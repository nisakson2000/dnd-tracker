/**
 * Spell Slot Manager — D&D 5e Spell Management System
 *
 * Covers roadmap items 94-107 (Spell Management — prepared casters, slot tracking,
 * ritual casting, concentration, upcast, spell save DC, domain spells, etc.)
 */

// ── Caster Types ──
export const CASTER_TYPES = {
  full: { label: 'Full Caster', slotProgression: 'full', classes: ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Wizard'] },
  half: { label: 'Half Caster', slotProgression: 'half', classes: ['Paladin', 'Ranger', 'Artificer'] },
  third: { label: 'Third Caster', slotProgression: 'third', classes: ['Eldritch Knight (Fighter)', 'Arcane Trickster (Rogue)'] },
  pact: { label: 'Pact Caster', slotProgression: 'pact', classes: ['Warlock'] },
};

// ── Prepared vs Known Casters ──
export const PREPARATION_TYPE = {
  Bard: { type: 'known', formula: null, description: 'Knows a fixed number of spells. Can swap one on level up.' },
  Cleric: { type: 'prepared', formula: 'WIS mod + Cleric level (minimum 1)', description: 'Prepare from full Cleric list each long rest.' },
  Druid: { type: 'prepared', formula: 'WIS mod + Druid level (minimum 1)', description: 'Prepare from full Druid list each long rest.' },
  Paladin: { type: 'prepared', formula: 'CHA mod + half Paladin level (minimum 1)', description: 'Prepare from Paladin list each long rest.' },
  Ranger: { type: 'known', formula: null, description: 'Knows a fixed number of spells. Can swap one on level up.' },
  Sorcerer: { type: 'known', formula: null, description: 'Knows a fixed number of spells. Can swap one on level up.' },
  Warlock: { type: 'known', formula: null, description: 'Knows a fixed number of spells. Can swap one on level up.' },
  Wizard: { type: 'prepared', formula: 'INT mod + Wizard level (minimum 1)', description: 'Prepare from spellbook each long rest. Can copy new spells.' },
  Artificer: { type: 'prepared', formula: 'INT mod + half Artificer level (minimum 1)', description: 'Prepare from Artificer list each long rest.' },
};

// ── Spells Known by Level (for Known casters) ──
export const SPELLS_KNOWN = {
  Bard: [0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22],
  Ranger: [0, 0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
  Sorcerer: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15],
  Warlock: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15],
};

// ── Warlock Pact Slots ──
export const WARLOCK_PACT_SLOTS = [
  { level: 1,  slots: 1, slotLevel: 1 },
  { level: 2,  slots: 2, slotLevel: 1 },
  { level: 3,  slots: 2, slotLevel: 2 },
  { level: 4,  slots: 2, slotLevel: 2 },
  { level: 5,  slots: 2, slotLevel: 3 },
  { level: 6,  slots: 2, slotLevel: 3 },
  { level: 7,  slots: 2, slotLevel: 4 },
  { level: 8,  slots: 2, slotLevel: 4 },
  { level: 9,  slots: 2, slotLevel: 5 },
  { level: 10, slots: 2, slotLevel: 5 },
  { level: 11, slots: 3, slotLevel: 5 },
  { level: 12, slots: 3, slotLevel: 5 },
  { level: 13, slots: 3, slotLevel: 5 },
  { level: 14, slots: 3, slotLevel: 5 },
  { level: 15, slots: 3, slotLevel: 5 },
  { level: 16, slots: 3, slotLevel: 5 },
  { level: 17, slots: 4, slotLevel: 5 },
  { level: 18, slots: 4, slotLevel: 5 },
  { level: 19, slots: 4, slotLevel: 5 },
  { level: 20, slots: 4, slotLevel: 5 },
];

// ── Warlock Mystic Arcanum (6th-9th level spells, 1 each per long rest) ──
export const MYSTIC_ARCANUM_LEVELS = { 11: 6, 13: 7, 15: 8, 17: 9 };

// ── Concentration Rules ──
export const CONCENTRATION_RULES = {
  description: 'Some spells require concentration. You can only concentrate on one spell at a time.',
  breakingConcentration: [
    'Casting another concentration spell (previous one ends immediately)',
    'Taking damage — DC 10 or half the damage taken (whichever is higher) CON save',
    'Being incapacitated or killed',
    'DM determines environmental disturbance requires CON save',
  ],
  maintaining: [
    'No action required to maintain — just don\'t break it',
    'Can take other actions normally while concentrating',
    'War Caster feat: advantage on concentration saves',
    'Resilient (CON): add proficiency bonus to CON saves',
  ],
};

// ── Ritual Casting Rules ──
export const RITUAL_CASTING = {
  description: 'Some spells can be cast as rituals, adding 10 minutes to casting time but not using a spell slot.',
  whoCanRitual: {
    Bard: 'Can ritual cast any known spell with the ritual tag',
    Cleric: 'Can ritual cast any prepared spell with the ritual tag',
    Druid: 'Can ritual cast any prepared spell with the ritual tag',
    Wizard: 'Can ritual cast any spell in spellbook with the ritual tag (doesn\'t need to be prepared!)',
    Warlock: 'Only with Book of Ancient Secrets invocation',
    Paladin: 'Cannot ritual cast',
    Ranger: 'Cannot ritual cast',
    Sorcerer: 'Cannot ritual cast',
  },
};

// ── Spell Component Rules ──
export const COMPONENT_RULES = {
  verbal: { short: 'V', description: 'Must speak. Cannot cast if silenced or in area of Silence spell.' },
  somatic: { short: 'S', description: 'Must have a free hand for gestures. Shield or focus occupies a hand.' },
  material: { short: 'M', description: 'Need specific materials. Arcane focus or component pouch substitutes for non-consumed, non-costed materials.' },
  focusSubstitution: 'Arcane focus, holy symbol, druidic focus, or component pouch replaces material components WITHOUT a gold cost and that are NOT consumed.',
};

// ── Spell Scroll Rules ──
export const SPELL_SCROLL_RULES = {
  description: 'A scroll contains a single spell. Anyone whose class spell list includes the spell can cast it without components.',
  scrollSaveDC: { 1: 13, 2: 13, 3: 15, 4: 15, 5: 17, 6: 17, 7: 18, 8: 18, 9: 19 },
  scrollAttackBonus: { 1: 5, 2: 5, 3: 7, 4: 7, 5: 9, 6: 9, 7: 10, 8: 10, 9: 11 },
  abilityCheckDC: 'If spell is above your casting level: DC 10 + spell level ability check. Failure = scroll destroyed.',
  scrollCost: { 0: '15 gp', 1: '25 gp', 2: '250 gp', 3: '500 gp', 4: '2500 gp', 5: '5000 gp', 6: '15000 gp', 7: '25000 gp', 8: '50000 gp', 9: '250000 gp' },
};

/**
 * Calculate spell save DC.
 */
export function calculateSpellSaveDC(abilityModifier, proficiencyBonus) {
  return 8 + abilityModifier + proficiencyBonus;
}

/**
 * Calculate spell attack bonus.
 */
export function calculateSpellAttackBonus(abilityModifier, proficiencyBonus) {
  return abilityModifier + proficiencyBonus;
}

/**
 * Calculate prepared spell count.
 */
export function calculatePreparedCount(className, level, abilityModifier) {
  const prep = PREPARATION_TYPE[className];
  if (!prep || prep.type !== 'prepared') return null;

  let count;
  switch (className) {
    case 'Cleric':
    case 'Druid':
    case 'Wizard':
      count = abilityModifier + level;
      break;
    case 'Paladin':
      count = abilityModifier + Math.floor(level / 2);
      break;
    case 'Artificer':
      count = abilityModifier + Math.floor(level / 2);
      break;
    default:
      count = abilityModifier + level;
  }
  return Math.max(1, count);
}

/**
 * Calculate concentration save DC for damage taken.
 */
export function calculateConcentrationDC(damageTaken) {
  return Math.max(10, Math.floor(damageTaken / 2));
}

/**
 * Get Warlock pact slot info for a level.
 */
export function getWarlockSlots(level) {
  const entry = WARLOCK_PACT_SLOTS.find(s => s.level === level);
  return entry || { slots: 1, slotLevel: 1 };
}

/**
 * Calculate multiclass spell slots (PHB p.164).
 */
export function calculateMulticlassSlots(classes) {
  let casterLevel = 0;
  for (const { className, level } of classes) {
    const casterType = Object.values(CASTER_TYPES).find(ct => ct.classes.includes(className));
    if (!casterType) {
      // Check for third casters
      if (['Eldritch Knight', 'Arcane Trickster'].some(sc => className.includes(sc))) {
        casterLevel += Math.floor(level / 3);
      }
      continue;
    }
    switch (casterType.slotProgression) {
      case 'full': casterLevel += level; break;
      case 'half': casterLevel += Math.floor(level / 2); break;
      case 'pact': break; // Warlock slots are separate
    }
  }
  return casterLevel;
}

/**
 * Get spells known for a known-caster at a level.
 */
export function getSpellsKnown(className, level) {
  const table = SPELLS_KNOWN[className];
  if (!table || level < 1 || level > 20) return 0;
  return table[level] || 0;
}

/**
 * Check if a class can ritual cast.
 */
export function canRitualCast(className) {
  const entry = RITUAL_CASTING.whoCanRitual[className];
  return { canRitual: entry && !entry.startsWith('Cannot'), details: entry || 'Cannot ritual cast' };
}

/**
 * Get the casting ability for a class.
 */
export function getCastingAbility(className) {
  const abilities = {
    Bard: 'CHA', Cleric: 'WIS', Druid: 'WIS', Paladin: 'CHA',
    Ranger: 'WIS', Sorcerer: 'CHA', Warlock: 'CHA', Wizard: 'INT', Artificer: 'INT',
  };
  return abilities[className] || null;
}
