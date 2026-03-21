/**
 * playerClassSpellcasting.js
 * Player Mode: Class-specific spellcasting rules and slot tables
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// SPELLCASTING ABILITY BY CLASS
// ---------------------------------------------------------------------------

export const SPELLCASTING_ABILITY = {
  Bard: 'CHA',
  Cleric: 'WIS',
  Druid: 'WIS',
  Paladin: 'CHA',
  Ranger: 'WIS',
  Sorcerer: 'CHA',
  Warlock: 'CHA',
  Wizard: 'INT',
  Artificer: 'INT',
};

// ---------------------------------------------------------------------------
// SPELL PREPARATION TYPES
// ---------------------------------------------------------------------------

export const PREPARATION_TYPES = {
  prepared: {
    label: 'Prepared',
    description: 'Prepare a list of spells each day from your full class list.',
    classes: ['Cleric', 'Druid', 'Paladin', 'Wizard', 'Artificer'],
    calculateCount: (abilityMod, level) => Math.max(1, abilityMod + level),
  },
  known: {
    label: 'Known',
    description: 'You know a fixed number of spells and can swap one on level-up.',
    classes: ['Bard', 'Ranger', 'Sorcerer', 'Warlock'],
  },
};

// ---------------------------------------------------------------------------
// SPELLS KNOWN BY CLASS & LEVEL (for "known" casters)
// ---------------------------------------------------------------------------

export const SPELLS_KNOWN_TABLE = {
  Bard: [0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22],
  Ranger: [0, 0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
  Sorcerer: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15],
  Warlock: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15],
};

// ---------------------------------------------------------------------------
// WARLOCK PACT MAGIC
// ---------------------------------------------------------------------------

export const WARLOCK_PACT_SLOTS = {
  1: { slots: 1, level: 1 },
  2: { slots: 2, level: 1 },
  3: { slots: 2, level: 2 },
  4: { slots: 2, level: 2 },
  5: { slots: 2, level: 3 },
  6: { slots: 2, level: 3 },
  7: { slots: 2, level: 4 },
  8: { slots: 2, level: 4 },
  9: { slots: 2, level: 5 },
  10: { slots: 2, level: 5 },
  11: { slots: 3, level: 5 },
  12: { slots: 3, level: 5 },
  13: { slots: 3, level: 5 },
  14: { slots: 3, level: 5 },
  15: { slots: 3, level: 5 },
  16: { slots: 3, level: 5 },
  17: { slots: 4, level: 5 },
  18: { slots: 4, level: 5 },
  19: { slots: 4, level: 5 },
  20: { slots: 4, level: 5 },
};

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Get spellcasting ability for a class.
 */
export function getSpellcastingAbility(className) {
  for (const [cls, ability] of Object.entries(SPELLCASTING_ABILITY)) {
    if (className?.toLowerCase().includes(cls.toLowerCase())) return ability;
  }
  return null;
}

/**
 * Calculate spell save DC.
 */
export function getSpellSaveDC(profBonus, abilityMod) {
  return 8 + profBonus + abilityMod;
}

/**
 * Calculate spell attack bonus.
 */
export function getSpellAttackBonus(profBonus, abilityMod) {
  return profBonus + abilityMod;
}

/**
 * Get number of prepared spells.
 */
export function getPreparedSpellCount(className, level, abilityMod) {
  if (PREPARATION_TYPES.prepared.classes.some(c => className?.toLowerCase().includes(c.toLowerCase()))) {
    return Math.max(1, abilityMod + level);
  }
  // Known caster — look up the table
  for (const [cls, table] of Object.entries(SPELLS_KNOWN_TABLE)) {
    if (className?.toLowerCase().includes(cls.toLowerCase())) {
      return table[Math.min(level, 20)] || 0;
    }
  }
  return 0;
}

/**
 * Check if class is a prepared caster.
 */
export function isPreparedCaster(className) {
  return PREPARATION_TYPES.prepared.classes.some(c => className?.toLowerCase().includes(c.toLowerCase()));
}

/**
 * Get Warlock pact slot info.
 */
export function getWarlockPactSlots(warlockLevel) {
  return WARLOCK_PACT_SLOTS[Math.min(warlockLevel, 20)] || { slots: 0, level: 0 };
}
