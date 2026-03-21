/**
 * playerSavingThrowHelper.js
 * Player Mode: Saving throw reference, common DCs, and auto-calc
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// SAVING THROW ABILITIES
// ---------------------------------------------------------------------------

export const SAVING_THROWS = [
  { id: 'STR', label: 'Strength', description: 'Resist being pushed, knocked prone, or physically overwhelmed.', color: '#ef4444' },
  { id: 'DEX', label: 'Dexterity', description: 'Dodge area effects, traps, and projectiles.', color: '#f97316' },
  { id: 'CON', label: 'Constitution', description: 'Resist poison, disease, exhaustion, and maintain concentration.', color: '#eab308' },
  { id: 'INT', label: 'Intelligence', description: 'Resist mental illusions and psionic effects.', color: '#3b82f6' },
  { id: 'WIS', label: 'Wisdom', description: 'Resist charm, fear, and compulsion effects.', color: '#22c55e' },
  { id: 'CHA', label: 'Charisma', description: 'Resist banishment, possession, and force of personality effects.', color: '#a855f7' },
];

// ---------------------------------------------------------------------------
// COMMON SAVE DCS
// ---------------------------------------------------------------------------

export const COMMON_SAVE_DCS = [
  { dc: 5, difficulty: 'Very Easy', description: 'Trivial challenge' },
  { dc: 10, difficulty: 'Easy', description: 'Simple challenge, most characters pass' },
  { dc: 13, difficulty: 'Medium', description: 'Moderate challenge' },
  { dc: 15, difficulty: 'Hard', description: 'Challenging for most characters' },
  { dc: 18, difficulty: 'Very Hard', description: 'Very challenging' },
  { dc: 20, difficulty: 'Nearly Impossible', description: 'Extremely difficult' },
  { dc: 25, difficulty: 'Legendary', description: 'Near-impossible without bonuses' },
  { dc: 30, difficulty: 'Godly', description: 'The absolute extreme' },
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Calculate saving throw modifier.
 */
export function getSaveModifier(abilityMod, profBonus, isProficient) {
  return abilityMod + (isProficient ? profBonus : 0);
}

/**
 * Calculate success probability.
 */
export function getSuccessProbability(saveModifier, dc) {
  const needed = dc - saveModifier;
  if (needed <= 1) return 100;   // auto-succeed (except nat 1 doesn't auto-fail saves in 5e)
  if (needed > 20) return 0;
  return Math.round(((21 - needed) / 20) * 100);
}

/**
 * Get save difficulty label for a given DC.
 */
export function getDifficultyLabel(dc) {
  for (let i = COMMON_SAVE_DCS.length - 1; i >= 0; i--) {
    if (dc >= COMMON_SAVE_DCS[i].dc) return COMMON_SAVE_DCS[i];
  }
  return COMMON_SAVE_DCS[0];
}

/**
 * Format save result.
 */
export function formatSaveResult(roll, modifier, dc) {
  const total = roll + modifier;
  const success = total >= dc;
  return {
    roll,
    modifier,
    total,
    dc,
    success,
    margin: total - dc,
    display: `${roll}${modifier >= 0 ? '+' : ''}${modifier} = ${total} vs DC ${dc} — ${success ? 'PASS' : 'FAIL'}`,
  };
}
