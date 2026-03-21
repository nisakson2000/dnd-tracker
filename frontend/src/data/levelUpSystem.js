/**
 * Level Up System — D&D 5e Character Progression Data
 *
 * Covers roadmap items 79-93, 431-435 (Character Progression, Auto Level-Up).
 * XP thresholds, proficiency bonuses, class hit dice, ASI levels, feature milestones.
 */

// ── XP Thresholds by Level ──
export const XP_THRESHOLDS = [
  { level: 1,  xp: 0,       proficiencyBonus: 2 },
  { level: 2,  xp: 300,     proficiencyBonus: 2 },
  { level: 3,  xp: 900,     proficiencyBonus: 2 },
  { level: 4,  xp: 2700,    proficiencyBonus: 2 },
  { level: 5,  xp: 6500,    proficiencyBonus: 3 },
  { level: 6,  xp: 14000,   proficiencyBonus: 3 },
  { level: 7,  xp: 23000,   proficiencyBonus: 3 },
  { level: 8,  xp: 34000,   proficiencyBonus: 3 },
  { level: 9,  xp: 48000,   proficiencyBonus: 4 },
  { level: 10, xp: 64000,   proficiencyBonus: 4 },
  { level: 11, xp: 85000,   proficiencyBonus: 4 },
  { level: 12, xp: 100000,  proficiencyBonus: 4 },
  { level: 13, xp: 120000,  proficiencyBonus: 5 },
  { level: 14, xp: 140000,  proficiencyBonus: 5 },
  { level: 15, xp: 165000,  proficiencyBonus: 5 },
  { level: 16, xp: 195000,  proficiencyBonus: 5 },
  { level: 17, xp: 225000,  proficiencyBonus: 6 },
  { level: 18, xp: 265000,  proficiencyBonus: 6 },
  { level: 19, xp: 305000,  proficiencyBonus: 6 },
  { level: 20, xp: 355000,  proficiencyBonus: 6 },
];

// ── Class Hit Dice & HP ──
export const CLASS_HIT_DICE = {
  Barbarian:  { hitDie: 12, average: 7, primaryAbility: 'STR', savingThrows: ['STR', 'CON'] },
  Bard:       { hitDie: 8,  average: 5, primaryAbility: 'CHA', savingThrows: ['DEX', 'CHA'] },
  Cleric:     { hitDie: 8,  average: 5, primaryAbility: 'WIS', savingThrows: ['WIS', 'CHA'] },
  Druid:      { hitDie: 8,  average: 5, primaryAbility: 'WIS', savingThrows: ['INT', 'WIS'] },
  Fighter:    { hitDie: 10, average: 6, primaryAbility: 'STR or DEX', savingThrows: ['STR', 'CON'] },
  Monk:       { hitDie: 8,  average: 5, primaryAbility: 'DEX & WIS', savingThrows: ['STR', 'DEX'] },
  Paladin:    { hitDie: 10, average: 6, primaryAbility: 'STR & CHA', savingThrows: ['WIS', 'CHA'] },
  Ranger:     { hitDie: 10, average: 6, primaryAbility: 'DEX & WIS', savingThrows: ['STR', 'DEX'] },
  Rogue:      { hitDie: 8,  average: 5, primaryAbility: 'DEX', savingThrows: ['DEX', 'INT'] },
  Sorcerer:   { hitDie: 6,  average: 4, primaryAbility: 'CHA', savingThrows: ['CON', 'CHA'] },
  Warlock:    { hitDie: 8,  average: 5, primaryAbility: 'CHA', savingThrows: ['WIS', 'CHA'] },
  Wizard:     { hitDie: 6,  average: 4, primaryAbility: 'INT', savingThrows: ['INT', 'WIS'] },
  Artificer:  { hitDie: 8,  average: 5, primaryAbility: 'INT', savingThrows: ['CON', 'INT'] },
  'Blood Hunter': { hitDie: 10, average: 6, primaryAbility: 'STR or DEX', savingThrows: ['DEX', 'INT'] },
};

// ── ASI / Feat Levels ──
export const ASI_LEVELS = {
  default: [4, 8, 12, 16, 19],
  Fighter: [4, 6, 8, 12, 14, 16, 19],
  Rogue: [4, 8, 12, 16, 19],
};

// ── Subclass Selection Levels ──
export const SUBCLASS_LEVELS = {
  Barbarian: { level: 3, name: 'Primal Path' },
  Bard: { level: 3, name: 'Bard College' },
  Cleric: { level: 1, name: 'Divine Domain' },
  Druid: { level: 2, name: 'Druid Circle' },
  Fighter: { level: 3, name: 'Martial Archetype' },
  Monk: { level: 3, name: 'Monastic Tradition' },
  Paladin: { level: 3, name: 'Sacred Oath' },
  Ranger: { level: 3, name: 'Ranger Archetype' },
  Rogue: { level: 3, name: 'Roguish Archetype' },
  Sorcerer: { level: 1, name: 'Sorcerous Origin' },
  Warlock: { level: 1, name: 'Otherworldly Patron' },
  Wizard: { level: 2, name: 'Arcane Tradition' },
  Artificer: { level: 3, name: 'Artificer Specialist' },
  'Blood Hunter': { level: 3, name: 'Blood Hunter Order' },
};

// ── Key Class Feature Milestones ──
export const CLASS_MILESTONES = {
  Barbarian: [
    { level: 1, features: ['Rage', 'Unarmored Defense'] },
    { level: 2, features: ['Reckless Attack', 'Danger Sense'] },
    { level: 3, features: ['Primal Path'] },
    { level: 5, features: ['Extra Attack', 'Fast Movement'] },
    { level: 11, features: ['Relentless Rage'] },
    { level: 20, features: ['Primal Champion (+4 STR/CON)'] },
  ],
  Fighter: [
    { level: 1, features: ['Fighting Style', 'Second Wind'] },
    { level: 2, features: ['Action Surge (1 use)'] },
    { level: 3, features: ['Martial Archetype'] },
    { level: 5, features: ['Extra Attack'] },
    { level: 11, features: ['Extra Attack (2)'] },
    { level: 17, features: ['Action Surge (2 uses)'] },
    { level: 20, features: ['Extra Attack (3)'] },
  ],
  Rogue: [
    { level: 1, features: ['Sneak Attack (1d6)', 'Thieves\' Cant', 'Expertise'] },
    { level: 2, features: ['Cunning Action'] },
    { level: 3, features: ['Roguish Archetype', 'Sneak Attack (2d6)'] },
    { level: 5, features: ['Uncanny Dodge', 'Sneak Attack (3d6)'] },
    { level: 7, features: ['Evasion'] },
    { level: 11, features: ['Reliable Talent'] },
    { level: 20, features: ['Stroke of Luck'] },
  ],
  Wizard: [
    { level: 1, features: ['Spellcasting', 'Arcane Recovery'] },
    { level: 2, features: ['Arcane Tradition'] },
    { level: 18, features: ['Spell Mastery'] },
    { level: 20, features: ['Signature Spells'] },
  ],
  Cleric: [
    { level: 1, features: ['Spellcasting', 'Divine Domain'] },
    { level: 2, features: ['Channel Divinity (1 use)', 'Turn Undead'] },
    { level: 5, features: ['Destroy Undead (CR 1/2)'] },
    { level: 10, features: ['Divine Intervention'] },
    { level: 17, features: ['Destroy Undead (CR 4)'] },
  ],
  Paladin: [
    { level: 1, features: ['Divine Sense', 'Lay on Hands'] },
    { level: 2, features: ['Fighting Style', 'Spellcasting', 'Divine Smite'] },
    { level: 3, features: ['Sacred Oath', 'Channel Divinity'] },
    { level: 5, features: ['Extra Attack'] },
    { level: 6, features: ['Aura of Protection'] },
    { level: 14, features: ['Cleansing Touch'] },
  ],
  Ranger: [
    { level: 1, features: ['Favored Enemy', 'Natural Explorer'] },
    { level: 2, features: ['Fighting Style', 'Spellcasting'] },
    { level: 3, features: ['Ranger Archetype', 'Primeval Awareness'] },
    { level: 5, features: ['Extra Attack'] },
    { level: 20, features: ['Foe Slayer'] },
  ],
  Bard: [
    { level: 1, features: ['Spellcasting', 'Bardic Inspiration (d6)'] },
    { level: 2, features: ['Jack of All Trades', 'Song of Rest (d6)'] },
    { level: 3, features: ['Bard College', 'Expertise'] },
    { level: 5, features: ['Bardic Inspiration (d8)', 'Font of Inspiration'] },
    { level: 10, features: ['Bardic Inspiration (d10)', 'Magical Secrets'] },
  ],
  Monk: [
    { level: 1, features: ['Unarmored Defense', 'Martial Arts'] },
    { level: 2, features: ['Ki', 'Unarmored Movement'] },
    { level: 3, features: ['Monastic Tradition', 'Deflect Missiles'] },
    { level: 4, features: ['Slow Fall'] },
    { level: 5, features: ['Extra Attack', 'Stunning Strike'] },
    { level: 7, features: ['Evasion', 'Stillness of Mind'] },
  ],
  Sorcerer: [
    { level: 1, features: ['Spellcasting', 'Sorcerous Origin'] },
    { level: 2, features: ['Font of Magic (Sorcery Points)'] },
    { level: 3, features: ['Metamagic (2 options)'] },
    { level: 10, features: ['Metamagic (3 options)'] },
    { level: 20, features: ['Sorcerous Restoration'] },
  ],
  Warlock: [
    { level: 1, features: ['Otherworldly Patron', 'Pact Magic'] },
    { level: 2, features: ['Eldritch Invocations (2)'] },
    { level: 3, features: ['Pact Boon'] },
    { level: 11, features: ['Mystic Arcanum (6th)'] },
    { level: 20, features: ['Eldritch Master'] },
  ],
  Druid: [
    { level: 1, features: ['Druidic', 'Spellcasting'] },
    { level: 2, features: ['Wild Shape', 'Druid Circle'] },
    { level: 4, features: ['Wild Shape improvement (CR 1/2)'] },
    { level: 8, features: ['Wild Shape improvement (CR 1)'] },
    { level: 18, features: ['Timeless Body', 'Beast Spells'] },
    { level: 20, features: ['Archdruid (unlimited Wild Shape)'] },
  ],
  Artificer: [
    { level: 1, features: ['Magical Tinkering', 'Spellcasting'] },
    { level: 2, features: ['Infuse Item (2 infusions)'] },
    { level: 3, features: ['Artificer Specialist', 'The Right Tool for the Job'] },
    { level: 5, features: ['Arcane Jolt (2d6)'] },
    { level: 6, features: ['Tool Expertise', 'Infuse Item (4 infusions)'] },
    { level: 10, features: ['Magic Item Adept', 'Infuse Item (6 infusions)'] },
    { level: 11, features: ['Spell-Storing Item'] },
    { level: 14, features: ['Magic Item Savant', 'Infuse Item (8 infusions)'] },
    { level: 18, features: ['Magic Item Master', 'Infuse Item (10 infusions)'] },
    { level: 20, features: ['Soul of Artifice (+6 to all saves)'] },
  ],
  'Blood Hunter': [
    { level: 1, features: ["Hunter's Bane", 'Blood Maledict'] },
    { level: 2, features: ['Crimson Rite'] },
    { level: 3, features: ['Blood Hunter Order'] },
    { level: 5, features: ['Extra Attack'] },
    { level: 7, features: ['Primal Rite'] },
    { level: 9, features: ['Grim Psychometry'] },
    { level: 11, features: ['Dark Augmentation'] },
    { level: 13, features: ['Brand of Castigation'] },
    { level: 14, features: ['Hardened Soul'] },
    { level: 20, features: ['Sanguine Mastery'] },
  ],
};

// ── Cantrip Scaling Levels ──
export const CANTRIP_SCALING = [
  { level: 1, dice: 1, label: '1 die' },
  { level: 5, dice: 2, label: '2 dice' },
  { level: 11, dice: 3, label: '3 dice' },
  { level: 17, dice: 4, label: '4 dice' },
];

// ── Spell Slots by Level (Full Caster) ──
export const SPELL_SLOTS_FULL = [
  { level: 1,  slots: [2, 0, 0, 0, 0, 0, 0, 0, 0] },
  { level: 2,  slots: [3, 0, 0, 0, 0, 0, 0, 0, 0] },
  { level: 3,  slots: [4, 2, 0, 0, 0, 0, 0, 0, 0] },
  { level: 4,  slots: [4, 3, 0, 0, 0, 0, 0, 0, 0] },
  { level: 5,  slots: [4, 3, 2, 0, 0, 0, 0, 0, 0] },
  { level: 6,  slots: [4, 3, 3, 0, 0, 0, 0, 0, 0] },
  { level: 7,  slots: [4, 3, 3, 1, 0, 0, 0, 0, 0] },
  { level: 8,  slots: [4, 3, 3, 2, 0, 0, 0, 0, 0] },
  { level: 9,  slots: [4, 3, 3, 3, 1, 0, 0, 0, 0] },
  { level: 10, slots: [4, 3, 3, 3, 2, 0, 0, 0, 0] },
  { level: 11, slots: [4, 3, 3, 3, 2, 1, 0, 0, 0] },
  { level: 12, slots: [4, 3, 3, 3, 2, 1, 0, 0, 0] },
  { level: 13, slots: [4, 3, 3, 3, 2, 1, 1, 0, 0] },
  { level: 14, slots: [4, 3, 3, 3, 2, 1, 1, 0, 0] },
  { level: 15, slots: [4, 3, 3, 3, 2, 1, 1, 1, 0] },
  { level: 16, slots: [4, 3, 3, 3, 2, 1, 1, 1, 0] },
  { level: 17, slots: [4, 3, 3, 3, 2, 1, 1, 1, 1] },
  { level: 18, slots: [4, 3, 3, 3, 3, 1, 1, 1, 1] },
  { level: 19, slots: [4, 3, 3, 3, 3, 2, 1, 1, 1] },
  { level: 20, slots: [4, 3, 3, 3, 3, 2, 2, 1, 1] },
];

// ── Multiclass Prerequisites ──
export const MULTICLASS_PREREQUISITES = {
  Barbarian: { STR: 13 },
  Bard: { CHA: 13 },
  Cleric: { WIS: 13 },
  Druid: { WIS: 13 },
  Fighter: { STR: 13, or: { DEX: 13 } },
  Monk: { DEX: 13, WIS: 13 },
  Paladin: { STR: 13, CHA: 13 },
  Ranger: { DEX: 13, WIS: 13 },
  Rogue: { DEX: 13 },
  Sorcerer: { CHA: 13 },
  Warlock: { CHA: 13 },
  Wizard: { INT: 13 },
  Artificer: { INT: 13 },
  'Blood Hunter': { STR: 13, INT: 13 },
};

/**
 * Get XP needed for a level.
 */
export function getXPForLevel(level) {
  const entry = XP_THRESHOLDS.find(t => t.level === level);
  return entry ? entry.xp : 0;
}

/**
 * Get current level from XP.
 */
export function getLevelFromXP(xp) {
  let level = 1;
  for (const t of XP_THRESHOLDS) {
    if (xp >= t.xp) level = t.level;
  }
  return level;
}

/**
 * Check if level up is available.
 */
export function checkLevelUp(currentLevel, currentXP) {
  const nextLevel = XP_THRESHOLDS.find(t => t.level === currentLevel + 1);
  if (!nextLevel) return { available: false, xpNeeded: 0, xpRemaining: 0 };
  return {
    available: currentXP >= nextLevel.xp,
    xpNeeded: nextLevel.xp,
    xpRemaining: Math.max(0, nextLevel.xp - currentXP),
  };
}

/**
 * Calculate HP gain on level up.
 */
export function calculateLevelUpHP(className, conModifier, useAverage = true) {
  const classData = CLASS_HIT_DICE[className];
  if (!classData) return { hp: 1, method: 'unknown class' };
  if (useAverage) {
    return { hp: Math.max(1, classData.average + conModifier), method: 'average' };
  }
  const roll = Math.floor(Math.random() * classData.hitDie) + 1;
  return { hp: Math.max(1, roll + conModifier), method: 'rolled', roll };
}

/**
 * Get proficiency bonus for a level.
 */
export function getProficiencyBonus(level) {
  const entry = XP_THRESHOLDS.find(t => t.level === level);
  return entry ? entry.proficiencyBonus : 2;
}

/**
 * Check if a level is an ASI level for a class.
 */
export function isASILevel(className, level) {
  const levels = ASI_LEVELS[className] || ASI_LEVELS.default;
  return levels.includes(level);
}

/**
 * Get spell slots for a full caster at a given level.
 */
export function getSpellSlots(level) {
  const entry = SPELL_SLOTS_FULL.find(s => s.level === level);
  return entry ? entry.slots : [0, 0, 0, 0, 0, 0, 0, 0, 0];
}

/**
 * Get features gained at a specific level for a class.
 */
export function getFeaturesAtLevel(className, level) {
  const milestones = CLASS_MILESTONES[className];
  if (!milestones) return [];
  const entry = milestones.find(m => m.level === level);
  return entry ? entry.features : [];
}

/**
 * Check multiclass prerequisites.
 */
export function canMulticlass(className, abilityScores) {
  const prereqs = MULTICLASS_PREREQUISITES[className];
  if (!prereqs) return { eligible: false, reason: 'Unknown class' };
  for (const [ability, required] of Object.entries(prereqs)) {
    if (ability === 'or') continue;
    if ((abilityScores[ability] || 0) < required) {
      if (prereqs.or) {
        const orMet = Object.entries(prereqs.or).some(([a, r]) => (abilityScores[a] || 0) >= r);
        if (orMet) continue;
      }
      return { eligible: false, reason: `${ability} must be ${required}+ (currently ${abilityScores[ability] || 0})` };
    }
  }
  return { eligible: true, reason: 'Meets all prerequisites' };
}

/**
 * Generate level-up summary.
 */
export function generateLevelUpSummary(className, newLevel, conModifier) {
  const hp = calculateLevelUpHP(className, conModifier);
  const features = getFeaturesAtLevel(className, newLevel);
  const isASI = isASILevel(className, newLevel);
  const profBonus = getProficiencyBonus(newLevel);
  const subclass = SUBCLASS_LEVELS[className];
  const needsSubclass = subclass && subclass.level === newLevel;

  return {
    level: newLevel,
    className,
    hpGain: hp.hp,
    newFeatures: features,
    isASILevel: isASI,
    proficiencyBonus: profBonus,
    needsSubclassChoice: needsSubclass,
    subclassName: needsSubclass ? subclass.name : null,
    summary: `Now Level ${newLevel}! +${hp.hp} HP${features.length ? `, ${features.join(', ')}` : ''}${isASI ? ', ASI/Feat choice' : ''}${needsSubclass ? `, Choose ${subclass.name}` : ''}`,
  };
}
