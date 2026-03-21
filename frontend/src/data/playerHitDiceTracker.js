/**
 * playerHitDiceTracker.js
 * Player Mode Improvements 80, 191-194: Hit dice tracking and short rest healing
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// HIT DICE BY CLASS
// ---------------------------------------------------------------------------

export const HIT_DICE_BY_CLASS = {
  Barbarian: 12,
  Fighter: 10,
  Paladin: 10,
  Ranger: 10,
  Bard: 8,
  Cleric: 8,
  Druid: 8,
  Monk: 8,
  Rogue: 8,
  Warlock: 8,
  Sorcerer: 6,
  Wizard: 6,
  Artificer: 8,
  'Blood Hunter': 10,
};

// ---------------------------------------------------------------------------
// HIT DICE TRACKER TEMPLATE
// ---------------------------------------------------------------------------

export const HIT_DICE_TRACKER_TEMPLATE = {
  total: 0,       // total hit dice (= character level)
  remaining: 0,   // remaining hit dice
  dieSize: 8,     // d6, d8, d10, d12
  conMod: 0,      // Constitution modifier for healing
};

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Get hit die size for a class.
 */
export function getHitDie(className) {
  for (const [cls, die] of Object.entries(HIT_DICE_BY_CLASS)) {
    if (className && className.toLowerCase().includes(cls.toLowerCase())) return die;
  }
  return 8; // default
}

/**
 * Calculate average hit die healing (with CON modifier).
 */
export function averageHitDieHealing(dieSize, conMod = 0) {
  const avg = (dieSize / 2) + 0.5;
  return Math.max(1, Math.floor(avg) + conMod);
}

/**
 * Spend a hit die on short rest.
 * Returns { healing, remaining, roll }.
 */
export function spendHitDie(tracker) {
  if (tracker.remaining <= 0) return { healing: 0, remaining: 0, roll: 0, outOfDice: true };
  const roll = Math.floor(Math.random() * tracker.dieSize) + 1;
  const healing = Math.max(1, roll + tracker.conMod);
  return {
    healing,
    remaining: tracker.remaining - 1,
    roll,
    outOfDice: false,
  };
}

/**
 * Recover hit dice on long rest (half of total, minimum 1).
 */
export function recoverHitDice(tracker) {
  const recovered = Math.max(1, Math.floor(tracker.total / 2));
  return {
    ...tracker,
    remaining: Math.min(tracker.total, tracker.remaining + recovered),
    recovered,
  };
}

/**
 * Create a hit dice tracker from character data.
 */
export function createHitDiceTracker(className, level, conMod = 0) {
  const dieSize = getHitDie(className);
  return {
    total: level,
    remaining: level,
    dieSize,
    conMod,
  };
}

/**
 * Format hit dice display string.
 */
export function formatHitDice(tracker) {
  return `${tracker.remaining}/${tracker.total}d${tracker.dieSize}`;
}
