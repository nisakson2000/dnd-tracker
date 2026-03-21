/**
 * playerRestRecovery.js
 * Player Mode Improvements 191-200: Rest recovery summary, spell slot restore, exhaustion removal
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// SHORT REST RECOVERY
// ---------------------------------------------------------------------------

export const SHORT_REST_RECOVERY = {
  description: 'A short rest is at least 1 hour of light activity: eating, reading, tending wounds.',
  recoveries: [
    { id: 'hit_dice', label: 'Spend Hit Dice', description: 'Roll hit dice to regain HP (add CON modifier per die)', automatic: false },
    { id: 'ki_points', label: 'Ki Points', description: 'Monk: Regain all Ki Points', automatic: true, classes: ['Monk'] },
    { id: 'second_wind', label: 'Second Wind', description: 'Fighter: Regain Second Wind use', automatic: true, classes: ['Fighter'] },
    { id: 'action_surge', label: 'Action Surge', description: 'Fighter: Regain Action Surge use', automatic: true, classes: ['Fighter'] },
    { id: 'channel_divinity', label: 'Channel Divinity', description: 'Cleric/Paladin: Regain Channel Divinity uses', automatic: true, classes: ['Cleric', 'Paladin'] },
    { id: 'superiority_dice', label: 'Superiority Dice', description: 'Battle Master: Regain all superiority dice', automatic: true, classes: ['Fighter'] },
    { id: 'bardic_inspiration', label: 'Bardic Inspiration', description: 'Bard (5+): Regain all Bardic Inspiration uses', automatic: true, classes: ['Bard'], minLevel: 5 },
    { id: 'wild_shape', label: 'Wild Shape', description: 'Druid: Regain Wild Shape uses', automatic: true, classes: ['Druid'] },
    { id: 'warlock_slots', label: 'Pact Magic Slots', description: 'Warlock: Regain all Pact Magic spell slots', automatic: true, classes: ['Warlock'] },
    { id: 'arcane_recovery', label: 'Arcane Recovery', description: 'Wizard: Recover spell slots (1/day, half level rounded up total)', automatic: false, classes: ['Wizard'] },
  ],
};

// ---------------------------------------------------------------------------
// LONG REST RECOVERY
// ---------------------------------------------------------------------------

export const LONG_REST_RECOVERY = {
  description: 'A long rest is 8 hours: at least 6 hours of sleep, up to 2 hours of light activity.',
  recoveries: [
    { id: 'hp', label: 'Hit Points', description: 'Regain all lost HP', automatic: true },
    { id: 'hit_dice', label: 'Hit Dice', description: 'Regain half your total hit dice (minimum 1)', automatic: true },
    { id: 'spell_slots', label: 'Spell Slots', description: 'Regain all expended spell slots', automatic: true },
    { id: 'class_features', label: 'Class Features', description: 'Regain all uses of long-rest-recharge features', automatic: true },
    { id: 'exhaustion', label: 'Exhaustion', description: 'Remove one level of exhaustion (if sufficiently fed)', automatic: true },
    { id: 'death_saves', label: 'Death Saves', description: 'Reset all death save successes and failures', automatic: true },
    { id: 'rage', label: 'Rage', description: 'Barbarian: Regain all Rage uses', automatic: true, classes: ['Barbarian'] },
    { id: 'sorcery_points', label: 'Sorcery Points', description: 'Sorcerer: Regain all Sorcery Points', automatic: true, classes: ['Sorcerer'] },
    { id: 'lay_on_hands', label: 'Lay on Hands', description: 'Paladin: Regain full pool (level × 5 HP)', automatic: true, classes: ['Paladin'] },
    { id: 'lucky', label: 'Lucky', description: 'Regain all 3 luck points', automatic: true, feats: ['Lucky'] },
  ],
  restrictions: [
    'Only one long rest per 24 hours.',
    'Must have at least 1 HP to benefit from a long rest.',
    'If interrupted by 1+ hour of strenuous activity (fighting, casting spells, walking), must restart.',
  ],
};

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Get applicable short rest recoveries for a class.
 */
export function getShortRestRecoveries(className, level) {
  return SHORT_REST_RECOVERY.recoveries.filter(r => {
    if (r.classes && !r.classes.some(c => className?.toLowerCase().includes(c.toLowerCase()))) return false;
    if (r.minLevel && level < r.minLevel) return false;
    return true;
  });
}

/**
 * Get applicable long rest recoveries for a class.
 */
export function getLongRestRecoveries(className, feats = []) {
  return LONG_REST_RECOVERY.recoveries.filter(r => {
    if (r.classes && !r.classes.some(c => className?.toLowerCase().includes(c.toLowerCase()))) return false;
    if (r.feats && !r.feats.some(f => feats.includes(f))) return false;
    return true;
  });
}

/**
 * Calculate hit dice recovery on long rest.
 */
export function calculateHitDiceRecovery(totalHitDice, currentHitDice) {
  const recovery = Math.max(1, Math.floor(totalHitDice / 2));
  const newTotal = Math.min(totalHitDice, currentHitDice + recovery);
  return { recovered: newTotal - currentHitDice, newTotal };
}

/**
 * Generate rest summary.
 */
export function generateRestSummary(restType, className, level, currentState) {
  const recoveries = restType === 'short'
    ? getShortRestRecoveries(className, level)
    : getLongRestRecoveries(className);

  return {
    restType,
    recoveries: recoveries.map(r => ({
      ...r,
      applied: r.automatic,
    })),
    totalRecoveries: recoveries.length,
    automaticCount: recoveries.filter(r => r.automatic).length,
  };
}
