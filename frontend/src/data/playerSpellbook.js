/**
 * playerSpellbook.js
 * Player Mode: Spellbook management, preparation, and spell slot optimization
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// SPELL PREPARATION RULES
// ---------------------------------------------------------------------------

export const PREPARATION_RULES = {
  prepared_casters: {
    Cleric: { formula: 'WIS mod + Cleric level (min 1)', description: 'Choose from the entire Cleric spell list each day.' },
    Druid: { formula: 'WIS mod + Druid level (min 1)', description: 'Choose from the entire Druid spell list each day.' },
    Paladin: { formula: 'CHA mod + half Paladin level (min 1)', description: 'Choose from the entire Paladin spell list each day.' },
    Wizard: { formula: 'INT mod + Wizard level (min 1)', description: 'Prepare from spells in your spellbook.' },
  },
  known_casters: {
    Bard: { description: 'Know a fixed number of spells. Can swap one on level up.' },
    Ranger: { description: 'Know a fixed number of spells. Can swap one on level up.' },
    Sorcerer: { description: 'Know a fixed number of spells. Can swap one on level up.' },
    Warlock: { description: 'Know a fixed number of spells. Can swap one on level up. Pact Magic slots recharge on short rest.' },
  },
};

// ---------------------------------------------------------------------------
// SPELLS KNOWN TABLE
// ---------------------------------------------------------------------------

export const SPELLS_KNOWN_BY_LEVEL = {
  Bard:     [0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22],
  Ranger:   [0, 0, 2, 3, 3, 4, 4, 5,  5,  6,  6,  7,  7,  8,  8,  9,  9, 10, 10, 11, 11],
  Sorcerer: [0, 2, 3, 4, 5, 6, 7, 8,  9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15],
  Warlock:  [0, 2, 3, 4, 5, 6, 7, 8,  9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15],
};

/**
 * Get number of spells known for a known-caster class at a level.
 */
export function getSpellsKnown(className, level) {
  const table = SPELLS_KNOWN_BY_LEVEL[className];
  if (!table || level < 1 || level > 20) return 0;
  return table[level] || 0;
}

/**
 * Calculate prepared spell count for a prepared-caster.
 */
export function calculatePreparedCount(className, level, abilityMod) {
  const lc = (className || '').toLowerCase();
  if (lc.includes('cleric') || lc.includes('druid')) {
    return Math.max(1, abilityMod + level);
  }
  if (lc.includes('paladin')) {
    return Math.max(1, abilityMod + Math.floor(level / 2));
  }
  if (lc.includes('wizard')) {
    return Math.max(1, abilityMod + level);
  }
  return 0;
}

// ---------------------------------------------------------------------------
// SPELL SLOT USAGE SUGGESTIONS
// ---------------------------------------------------------------------------

export const SLOT_USAGE_TIPS = [
  { level: 1, tip: 'Save for Shield, Healing Word, or situational utility.' },
  { level: 2, tip: 'Great for Hold Person, Misty Step, or upcast heals.' },
  { level: 3, tip: 'Powerful options: Fireball, Spirit Guardians, Counterspell, Haste.' },
  { level: 4, tip: 'Banishment, Polymorph, Greater Invisibility — encounter-defining spells.' },
  { level: 5, tip: 'Hold Monster, Wall of Force, Raise Dead. Use carefully.' },
  { level: 6, tip: 'Very powerful: Heal, Globe of Invulnerability. Save for critical moments.' },
  { level: 7, tip: 'Teleport, Plane Shift, Forcecage. Extreme impact spells.' },
  { level: 8, tip: 'Feeblemind, Maze, Sunburst. Nearly irreplaceable effects.' },
  { level: 9, tip: 'Wish, Power Word Kill, True Polymorph. The most powerful magic available.' },
];
