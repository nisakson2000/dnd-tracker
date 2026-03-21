/**
 * playerRollExpressions.js
 * Player Mode Improvements 26, 28, 31, 33, 39, 40: Roll macros, expressions, statistics
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// ROLL MACRO TEMPLATE
// ---------------------------------------------------------------------------

export const ROLL_MACRO_TEMPLATE = {
  id: '',
  name: '',              // e.g., "Greatsword"
  expression: '',        // e.g., "2d6+5"
  category: 'custom',    // 'attack', 'damage', 'save', 'check', 'custom'
  favorite: false,
  color: null,           // optional color for display
};

// ---------------------------------------------------------------------------
// DEFAULT ROLL MACROS (common D&D rolls)
// ---------------------------------------------------------------------------

export const DEFAULT_ROLL_MACROS = [
  { id: 'initiative', name: 'Initiative', expression: '1d20', category: 'check', favorite: true },
  { id: 'perception', name: 'Perception', expression: '1d20', category: 'check', favorite: false },
  { id: 'hit_die_d6', name: 'Hit Die (d6)', expression: '1d6', category: 'custom', favorite: false },
  { id: 'hit_die_d8', name: 'Hit Die (d8)', expression: '1d8', category: 'custom', favorite: false },
  { id: 'hit_die_d10', name: 'Hit Die (d10)', expression: '1d10', category: 'custom', favorite: false },
  { id: 'hit_die_d12', name: 'Hit Die (d12)', expression: '1d12', category: 'custom', favorite: false },
  { id: 'fireball', name: 'Fireball', expression: '8d6', category: 'damage', favorite: false },
  { id: 'sneak_1', name: 'Sneak Attack (1d6)', expression: '1d6', category: 'damage', favorite: false },
  { id: 'sneak_3', name: 'Sneak Attack (3d6)', expression: '3d6', category: 'damage', favorite: false },
  { id: 'sneak_5', name: 'Sneak Attack (5d6)', expression: '5d6', category: 'damage', favorite: false },
  { id: 'smite_1', name: 'Smite (1st)', expression: '2d8', category: 'damage', favorite: false },
  { id: 'smite_2', name: 'Smite (2nd)', expression: '3d8', category: 'damage', favorite: false },
  { id: 'healing_word', name: 'Healing Word', expression: '1d4', category: 'custom', favorite: false },
  { id: 'cure_wounds', name: 'Cure Wounds', expression: '1d8', category: 'custom', favorite: false },
];

// ---------------------------------------------------------------------------
// ROLL STATISTICS TRACKER
// ---------------------------------------------------------------------------

export const ROLL_STATS_TEMPLATE = {
  totalRolls: 0,
  nat20s: 0,
  nat1s: 0,
  d20Rolls: [],          // last N d20 results for average calculation
  averageD20: 0,
  highestRoll: 0,
  lowestRoll: 21,        // starts above max so first roll replaces it
  rollsByType: {          // count by category
    attack: 0,
    damage: 0,
    save: 0,
    check: 0,
    custom: 0,
  },
  sessionStart: null,
};

/**
 * Update roll statistics with a new d20 roll.
 */
export function updateRollStats(stats, d20Result, category = 'custom') {
  const updated = { ...stats };
  updated.totalRolls++;
  if (d20Result === 20) updated.nat20s++;
  if (d20Result === 1) updated.nat1s++;
  updated.d20Rolls = [...(updated.d20Rolls || []), d20Result].slice(-100); // keep last 100
  updated.averageD20 = updated.d20Rolls.reduce((a, b) => a + b, 0) / updated.d20Rolls.length;
  updated.highestRoll = Math.max(updated.highestRoll, d20Result);
  updated.lowestRoll = Math.min(updated.lowestRoll, d20Result);
  if (updated.rollsByType[category] !== undefined) {
    updated.rollsByType[category]++;
  }
  if (!updated.sessionStart) updated.sessionStart = Date.now();
  return updated;
}

/**
 * Parse and validate a dice expression.
 * Supports: "2d6+5", "1d20-1", "4d8+2d6+3", etc.
 * Returns null if invalid.
 */
export function validateExpression(expression) {
  if (!expression || typeof expression !== 'string') return null;
  const cleaned = expression.replace(/\s+/g, '').toLowerCase();
  // Match: optional leading minus, then (NdS or number), then (+/- NdS or number)*
  const pattern = /^-?(\d+d\d+|\d+)([+-](\d+d\d+|\d+))*$/;
  if (!pattern.test(cleaned)) return null;

  // Extract all dice groups
  const diceGroups = [];
  const flatBonus = [];
  const parts = cleaned.match(/[+-]?\d+d\d+|[+-]?\d+/g);
  if (!parts) return null;

  for (const part of parts) {
    if (part.includes('d')) {
      const [count, sides] = part.replace(/^[+-]/, '').split('d').map(Number);
      const sign = part.startsWith('-') ? -1 : 1;
      if (count > 100 || sides > 100) return null; // sanity cap
      diceGroups.push({ count: count * sign, sides });
    } else {
      flatBonus.push(parseInt(part, 10));
    }
  }

  return {
    expression: cleaned,
    diceGroups,
    flatBonus: flatBonus.reduce((a, b) => a + b, 0),
    isValid: true,
  };
}

/**
 * Create a custom roll macro.
 */
export function createMacro(name, expression, category = 'custom') {
  const validated = validateExpression(expression);
  if (!validated) return null;
  return {
    ...ROLL_MACRO_TEMPLATE,
    id: `macro_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name,
    expression: validated.expression,
    category,
  };
}
