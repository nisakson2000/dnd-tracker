/**
 * playerMulticlassHelper.js
 * Player Mode: Multiclass quick-reference for player mode (what applies when)
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// MULTICLASS SPELL SLOT TABLE (combined caster levels)
// ---------------------------------------------------------------------------

export const COMBINED_SPELL_SLOTS = {
  1: [2],
  2: [3],
  3: [4, 2],
  4: [4, 3],
  5: [4, 3, 2],
  6: [4, 3, 3],
  7: [4, 3, 3, 1],
  8: [4, 3, 3, 2],
  9: [4, 3, 3, 3, 1],
  10: [4, 3, 3, 3, 2],
  11: [4, 3, 3, 3, 2, 1],
  12: [4, 3, 3, 3, 2, 1],
  13: [4, 3, 3, 3, 2, 1, 1],
  14: [4, 3, 3, 3, 2, 1, 1],
  15: [4, 3, 3, 3, 2, 1, 1, 1],
  16: [4, 3, 3, 3, 2, 1, 1, 1],
  17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
  18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
  19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
  20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
};

// ---------------------------------------------------------------------------
// CASTER LEVEL CONTRIBUTIONS
// ---------------------------------------------------------------------------

export const CASTER_CONTRIBUTIONS = {
  full: { multiplier: 1, classes: ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Wizard'] },
  half: { multiplier: 0.5, classes: ['Paladin', 'Ranger'], note: 'Round down. Levels 1 don\'t count.' },
  third: { multiplier: 1 / 3, classes: ['Eldritch Knight (Fighter)', 'Arcane Trickster (Rogue)'], note: 'Round down. Levels 1-2 don\'t count.' },
  pact: { multiplier: 0, classes: ['Warlock'], note: 'Warlock Pact Magic does not combine with other spellcasting for slot calculation.' },
};

/**
 * Calculate combined caster level for multiclass.
 */
export function calculateCasterLevel(classLevels) {
  let total = 0;
  for (const { className, level } of classLevels) {
    const lc = (className || '').toLowerCase();
    if (['bard', 'cleric', 'druid', 'sorcerer', 'wizard'].some(c => lc.includes(c))) {
      total += level;
    } else if (['paladin', 'ranger'].some(c => lc.includes(c))) {
      total += Math.floor(level / 2);
    } else if (lc.includes('eldritch knight') || lc.includes('arcane trickster')) {
      total += Math.floor(level / 3);
    }
    // Warlock pact magic doesn't contribute
  }
  return total;
}

/**
 * Get combined spell slots for a multiclass caster level.
 */
export function getMulticlassSpellSlots(casterLevel) {
  return COMBINED_SPELL_SLOTS[Math.min(20, Math.max(0, casterLevel))] || [];
}
