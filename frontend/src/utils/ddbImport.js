/**
 * D&D Beyond Character Import Utility
 * Parses DDB JSON export format and maps it to The Codex import format.
 */

const STAT_MAP = { 1: 'STR', 2: 'DEX', 3: 'CON', 4: 'INT', 5: 'WIS', 6: 'CHA' };

const COMPONENT_MAP = { 1: 'V', 2: 'S', 3: 'M' };

// ─── Helpers ────────────────────────────────────────────────────────────────

function safe(val, fallback = '') {
  if (val === null || val === undefined) return fallback;
  return val;
}

function extractModifiers(ddb) {
  // Collect all modifiers from race, class, background, item, feat, etc.
  const all = [];
  if (ddb.modifiers && typeof ddb.modifiers === 'object') {
    Object.values(ddb.modifiers).forEach(arr => {
      if (Array.isArray(arr)) all.push(...arr);
    });
  }
  return all;
}

function getSkillProficiencies(ddb) {
  const mods = extractModifiers(ddb);
  const proficient = new Set();
  const expertise = new Set();

  mods.forEach(m => {
    if (!m.subType || !m.type) return;
    // Skill names in modifiers are like "acrobatics" — normalize to title case
    const skillName = m.friendlySubtypeName || m.subType.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    if (m.type === 'proficiency') proficient.add(skillName);
    if (m.type === 'expertise') {
      proficient.add(skillName);
      expertise.add(skillName);
    }
  });

  return { proficient, expertise };
}

function getSavingThrowProficiencies(ddb) {
  const mods = extractModifiers(ddb);
  const profs = new Set();
  mods.forEach(m => {
    if (m.type === 'proficiency' && m.subType && m.subType.endsWith('-saving-throws')) {
      const ability = m.subType.replace('-saving-throws', '').toUpperCase().slice(0, 3);
      // Map full names to abbreviations
      const nameMap = { STRENGTH: 'STR', DEXTERITY: 'DEX', CONSTITUTION: 'CON', INTELLIGENCE: 'INT', WISDOM: 'WIS', CHARISMA: 'CHA' };
      const mapped = nameMap[m.subType.replace('-saving-throws', '').toUpperCase()] || ability;
      profs.add(mapped);
    }
  });
  return profs;
}

function getProficiencyStrings(ddb, category) {
  // category: 'Armor', 'Weapons', 'Tools', 'Languages'
  const mods = extractModifiers(ddb);
  const items = [];
  mods.forEach(m => {
    if (m.type === 'proficiency' && m.friendlySubtypeName) {
      const sub = (m.friendlySubtypeName || '').toLowerCase();
      if (category === 'Armor' && (sub.includes('armor') || sub.includes('shield'))) {
        items.push(m.friendlySubtypeName);
      } else if (category === 'Weapons' && (sub.includes('weapon') || sub.includes('sword') || sub.includes('bow') || sub.includes('crossbow') || sub.includes('dagger') || sub.includes('axe') || sub.includes('mace') || sub.includes('hammer') || sub.includes('staff') || sub.includes('spear') || sub.includes('pike') || sub.includes('halberd') || sub.includes('rapier') || sub.includes('scimitar') || sub.includes('whip') || sub.includes('flail') || sub.includes('morningstar') || sub.includes('glaive') || sub.includes('trident') || sub.includes('lance') || sub.includes('net') || sub.includes('blowgun') || sub.includes('hand crossbow') || sub.includes('martial') || sub.includes('simple'))) {
        items.push(m.friendlySubtypeName);
      } else if (category === 'Tools' && (sub.includes('tools') || sub.includes('kit') || sub.includes('supplies') || sub.includes('instrument') || sub.includes('set') || sub.includes('vehicles'))) {
        items.push(m.friendlySubtypeName);
      }
    }
    if (category === 'Languages' && m.type === 'language' && m.friendlySubtypeName) {
      items.push(m.friendlySubtypeName);
    }
  });
  return [...new Set(items)].join(', ');
}

function getSenses(ddb) {
  const mods = extractModifiers(ddb);
  const senses = [];
  mods.forEach(m => {
    if (m.type === 'sense' && m.friendlySubtypeName) {
      senses.push(m.friendlySubtypeName);
    }
  });
  // Check racial traits for darkvision, etc.
  if (senses.length === 0 && ddb.race) {
    const racialTraits = ddb.race.racialTraits || [];
    racialTraits.forEach(t => {
      const name = t.definition?.name || '';
      if (name.toLowerCase().includes('darkvision')) senses.push('Darkvision 60 ft.');
      if (name.toLowerCase().includes('superior darkvision')) senses.push('Darkvision 120 ft.');
    });
  }
  return [...new Set(senses)].join(', ');
}

// ─── Main Parser ────────────────────────────────────────────────────────────

export function parseDDBCharacter(ddb) {
  if (!ddb || typeof ddb !== 'object') throw new Error('Invalid D&D Beyond JSON data');

  // Some DDB exports wrap the character in a "data" field
  if (ddb.data && ddb.data.name) ddb = ddb.data;

  if (!ddb.name && !ddb.classes) throw new Error('This does not appear to be a D&D Beyond character export');

  // ── Class info ──
  const classes = Array.isArray(ddb.classes) ? ddb.classes : [];
  const primaryClassObj = classes.length > 0 ? classes.reduce((a, b) => (b.level > a.level ? b : a), classes[0]) : null;
  const primaryClassName = primaryClassObj?.definition?.name || '';
  const primarySubclass = primaryClassObj?.subclassDefinition?.name || '';
  const totalLevel = classes.reduce((sum, c) => sum + (c.level || 0), 0);

  // Multiclass data
  const multiclassData = classes.length > 1
    ? JSON.stringify(classes.map(c => ({
        class: c.definition?.name || '',
        subclass: c.subclassDefinition?.name || '',
        level: c.level || 0,
      })))
    : '';

  // ── Ability Scores ──
  const abilityScores = {};
  const stats = Array.isArray(ddb.stats) ? ddb.stats : [];
  const bonusStats = Array.isArray(ddb.bonusStats) ? ddb.bonusStats : [];
  const overrideStats = Array.isArray(ddb.overrideStats) ? ddb.overrideStats : [];

  for (let id = 1; id <= 6; id++) {
    const ability = STAT_MAP[id];
    const override = overrideStats.find(s => s.id === id);
    if (override && override.value !== null && override.value !== undefined) {
      abilityScores[ability] = override.value;
    } else {
      const base = stats.find(s => s.id === id)?.value || 10;
      const bonus = bonusStats.find(s => s.id === id)?.value || 0;
      // Also add racial/misc modifiers (match by statId or subType containing the ability name)
      const mods = extractModifiers(ddb);
      const abilityName = STAT_MAP[id].toLowerCase();
      let modBonus = 0;
      mods.forEach(m => {
        if (m.type === 'bonus' && (m.statId === id || (m.subType?.toLowerCase().includes(abilityName) && m.subType?.includes('score')))) {
          modBonus += m.value || 0;
        }
      });
      abilityScores[ability] = base + bonus + modBonus;
    }
  }

  // ── Race ──
  const raceName = ddb.race?.fullName || ddb.race?.baseName || '';
  const subrace = ddb.race?.fullName && ddb.race?.baseName && ddb.race.fullName !== ddb.race.baseName
    ? ddb.race.fullName : '';

  // ── HP ──
  const maxHp = ddb.baseHitPoints || 0;
  const removedHp = ddb.hitPointsRemoved || 0;
  const currentHp = maxHp - removedHp;
  const tempHp = ddb.temporaryHitPoints || 0;

  // ── Hit Dice ──
  const hitDiceTotal = classes.map(c => `${c.level || 0}${c.definition?.hitDice ? 'd' + c.definition.hitDice : ''}`).join(' + ');

  // ── Speed ──
  let speed = 30;
  if (ddb.race?.weightSpeeds?.normal?.walk) speed = ddb.race.weightSpeeds.normal.walk;

  // ── AC ── (DDB doesn't export AC directly; we estimate from base 10 + DEX mod)
  const dexMod = Math.floor((abilityScores.DEX - 10) / 2);
  let armorClass = 10 + dexMod;
  // Check for equipped armor in inventory
  if (Array.isArray(ddb.inventory)) {
    ddb.inventory.forEach(item => {
      const def = item.definition || {};
      if (item.equipped && def.armorClass) {
        armorClass = def.armorClass;
        if (def.armorTypeId === 1) armorClass += dexMod; // Light armor
        else if (def.armorTypeId === 2) armorClass += Math.min(dexMod, 2); // Medium
        // Heavy armor: no DEX bonus
      }
      if (item.equipped && def.type === 'Shield') {
        armorClass += 2;
      }
    });
  }

  // ── Saving Throws ──
  const savingThrowProfs = getSavingThrowProficiencies(ddb);

  // ── Skills ──
  const { proficient: skillProfs, expertise: skillExpertise } = getSkillProficiencies(ddb);
  const SKILL_LIST = [
    'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception',
    'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine',
    'Nature', 'Perception', 'Performance', 'Persuasion', 'Religion',
    'Sleight of Hand', 'Stealth', 'Survival',
  ];
  const skills = SKILL_LIST.map(name => ({
    name,
    proficient: skillProfs.has(name),
    expertise: skillExpertise.has(name),
  }));

  // ── Spells ──
  const spells = [];
  const spellSources = ddb.spells || {};
  const allSpellArrays = [
    ...(Array.isArray(spellSources.class) ? spellSources.class : []),
    ...(Array.isArray(spellSources.race) ? spellSources.race : []),
    ...(Array.isArray(spellSources.feat) ? spellSources.feat : []),
    ...(Array.isArray(spellSources.item) ? spellSources.item : []),
  ];

  const seenSpells = new Set();
  allSpellArrays.forEach(sp => {
    const def = sp.definition || sp;
    const name = def.name || '';
    if (!name || seenSpells.has(name)) return;
    seenSpells.add(name);

    const components = Array.isArray(def.components)
      ? def.components.map(c => COMPONENT_MAP[c] || '').filter(Boolean).join(', ')
      : '';
    const materialComponent = def.componentsDescription || '';

    const range = def.range?.range
      ? (def.range.range === 0 ? (def.range.origin === 'Self' ? 'Self' : 'Touch') : `${def.range.range} ft.`)
      : '';

    const duration = def.duration?.durationType === 'Instantaneous' ? 'Instantaneous'
      : def.duration?.durationInterval
        ? `${def.duration.durationInterval} ${def.duration.durationUnit || 'round'}${def.duration.durationInterval > 1 ? 's' : ''}`
        : '';

    const castingTime = def.activation?.activationType === 1 ? '1 action'
      : def.activation?.activationType === 3 ? '1 bonus action'
      : def.activation?.activationType === 4 ? '1 reaction'
      : def.activation?.activationType === 6 ? '1 minute'
      : def.activation?.activationType === 7 ? '10 minutes'
      : def.activation?.activationType === 8 ? '1 hour'
      : '1 action';

    // Strip HTML tags from description
    const rawDesc = def.description || '';
    const description = rawDesc.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();

    const atHigherLevels = (def.atHigherLevels?.higherLevelDefinitions || [])
      .map(h => h.description || '').join(' ')
      .replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();

    spells.push({
      name,
      level: def.level || 0,
      school: def.school || '',
      casting_time: castingTime,
      spell_range: range,
      components,
      material: materialComponent,
      duration: (def.concentration ? 'Concentration, ' : '') + duration,
      concentration: !!def.concentration,
      ritual: !!def.ritual,
      description,
      upcast_notes: atHigherLevels,
      prepared: sp.prepared || false,
      source: def.sources?.[0]?.sourceBook || 'PHB',
    });
  });

  // ── Spell Slots ──
  const spellSlots = [];
  if (Array.isArray(ddb.spellSlots)) {
    ddb.spellSlots.forEach(sl => {
      if (sl.level > 0 && sl.max > 0) {
        spellSlots.push({
          level: sl.level,
          max: sl.max,
          used: sl.used || 0,
        });
      }
    });
  }

  // ── Inventory ──
  const inventory = [];
  if (Array.isArray(ddb.inventory)) {
    ddb.inventory.forEach(item => {
      const def = item.definition || {};
      const name = def.name || '';
      if (!name) return;

      const costGp = (def.cost || 0) / 100; // DDB stores cost in copper
      const description = (def.description || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();

      inventory.push({
        name,
        item_type: (def.type || def.filterType || 'Misc').toLowerCase(),
        weight: def.weight || 0,
        value_gp: costGp,
        quantity: item.quantity || 1,
        description,
        attunement: !!def.canAttune,
        attuned: !!item.isAttuned,
        equipped: !!item.equipped,
        equipment_slot: '',
      });
    });
  }

  // ── Currency ──
  const currency = {
    cp: ddb.currencies?.cp || 0,
    sp: ddb.currencies?.sp || 0,
    ep: ddb.currencies?.ep || 0,
    gp: ddb.currencies?.gp || 0,
    pp: ddb.currencies?.pp || 0,
  };

  // ── Features (class, race, feat) ──
  const features = [];
  const seenFeatures = new Set();

  // Class features
  classes.forEach(cls => {
    const classFeatures = cls.definition?.classFeatures || [];
    classFeatures.forEach(f => {
      if (f.requiredLevel > cls.level) return;
      const name = f.name || '';
      if (!name || seenFeatures.has(name)) return;
      seenFeatures.add(name);
      const desc = (f.description || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
      features.push({
        name,
        source: cls.definition?.name || '',
        source_level: f.requiredLevel || 0,
        feature_type: 'class',
        description: desc,
        uses_total: 0,
        uses_remaining: 0,
        recharge: '',
      });
    });
    // Subclass features
    if (cls.subclassDefinition?.classFeatures) {
      cls.subclassDefinition.classFeatures.forEach(f => {
        if (f.requiredLevel > cls.level) return;
        const name = f.name || '';
        if (!name || seenFeatures.has(name)) return;
        seenFeatures.add(name);
        const desc = (f.description || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
        features.push({
          name,
          source: cls.subclassDefinition?.name || cls.definition?.name || '',
          source_level: f.requiredLevel || 0,
          feature_type: 'class',
          description: desc,
          uses_total: 0,
          uses_remaining: 0,
          recharge: '',
        });
      });
    }
  });

  // Racial traits
  const racialTraits = ddb.race?.racialTraits || [];
  racialTraits.forEach(t => {
    const def = t.definition || t;
    const name = def.name || '';
    if (!name || seenFeatures.has(name)) return;
    seenFeatures.add(name);
    const desc = (def.description || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    features.push({
      name,
      source: raceName,
      source_level: 0,
      feature_type: 'race',
      description: desc,
      uses_total: 0,
      uses_remaining: 0,
      recharge: '',
    });
  });

  // Feats
  if (Array.isArray(ddb.feats)) {
    ddb.feats.forEach(f => {
      const def = f.definition || f;
      const name = def.name || '';
      if (!name || seenFeatures.has(name)) return;
      seenFeatures.add(name);
      const desc = (def.description || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
      features.push({
        name,
        source: 'Feat',
        source_level: 0,
        feature_type: 'feat',
        description: desc,
        uses_total: 0,
        uses_remaining: 0,
        recharge: '',
      });
    });
  }

  // ── Backstory ──
  const backstory = {
    backstory_text: safe(ddb.notes?.backstory),
    personality_traits: safe(ddb.traits?.personalityTraits),
    ideals: safe(ddb.traits?.ideals),
    bonds: safe(ddb.traits?.bonds),
    flaws: safe(ddb.traits?.flaws),
    age: safe(ddb.age, ''),
    height: safe(ddb.height, ''),
    weight: safe(ddb.weight, ''),
    eyes: safe(ddb.eyes, ''),
    hair: safe(ddb.hair, ''),
    skin: safe(ddb.skin, ''),
  };

  // ── Build import payload (matches The Codex import_character format) ──
  const payload = {
    overview: {
      name: ddb.name || 'Unnamed Character',
      race: raceName,
      subrace: subrace,
      primary_class: primaryClassName,
      primary_subclass: primarySubclass,
      background: ddb.background?.definition?.name || '',
      alignment: ddb.alignmentId != null
        ? (ddb.alignment?.name || '')
        : '',
      level: totalLevel,
      experience_points: ddb.currentXp || 0,
      max_hp: maxHp,
      current_hp: currentHp,
      temp_hp: tempHp,
      armor_class: armorClass,
      speed,
      hit_dice_total: hitDiceTotal,
      hit_dice_used: 0,
      senses: getSenses(ddb),
      languages: getProficiencyStrings(ddb, 'Languages'),
      proficiencies_armor: getProficiencyStrings(ddb, 'Armor'),
      proficiencies_weapons: getProficiencyStrings(ddb, 'Weapons'),
      proficiencies_tools: getProficiencyStrings(ddb, 'Tools'),
      multiclass_data: multiclassData,
      ruleset: '5e-2014',
    },
    ability_scores: abilityScores,
    saving_throw_proficiencies: [...savingThrowProfs],
    skills,
    backstory,
    spells,
    spell_slots: spellSlots,
    inventory,
    currency,
    features,
  };

  return {
    payload,
    summary: {
      name: payload.overview.name,
      race: raceName,
      class: primaryClassName + (primarySubclass ? ` (${primarySubclass})` : ''),
      level: totalLevel,
      multiclass: classes.length > 1 ? classes.map(c => `${c.definition?.name || '?'} ${c.level}`).join(' / ') : null,
      spellCount: spells.length,
      itemCount: inventory.length,
      featureCount: features.length,
      hp: `${currentHp}/${maxHp}`,
      stats: abilityScores,
    },
  };
}

/**
 * Full import pipeline: parse DDB JSON, create character, import data.
 * @param {object} ddb - Raw D&D Beyond JSON export
 * @param {function} createCharacterFn - The createCharacter API function
 * @param {function} importCharacterFn - invoke('import_character', ...) wrapper
 * @param {function} onProgress - Callback(step, total, label) for progress updates
 * @returns {Promise<{characterId: string, summary: object}>}
 */
export async function importDDBCharacter(ddb, createCharacterFn, importCharacterFn, onProgress = () => {}) {
  onProgress(0, 4, 'Parsing D&D Beyond data...');

  const { payload, summary } = parseDDBCharacter(ddb);

  onProgress(1, 4, 'Creating character...');

  const char = await createCharacterFn({
    name: payload.overview.name,
    ruleset: payload.overview.ruleset,
    race: payload.overview.race,
    primaryClass: payload.overview.primary_class,
    primarySubclass: payload.overview.primary_subclass,
  });

  onProgress(2, 4, 'Importing character data...');

  await importCharacterFn(char.id, payload);

  onProgress(3, 4, 'Finalizing...');

  // Small delay to let DB settle
  await new Promise(r => setTimeout(r, 200));

  onProgress(4, 4, 'Import complete!');

  return { characterId: char.id, summary };
}
