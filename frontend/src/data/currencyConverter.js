/**
 * currencyConverter.js
 *
 * D&D 5e Currency Converter — data and helper functions.
 *
 * Roadmap items covered:
 *   - #120: Currency converter
 *
 * No React. Pure data constants and utility functions only.
 * All internal calculations use copper pieces (cp) as the base unit.
 */

// ---------------------------------------------------------------------------
// CURRENCY_TYPES
// ---------------------------------------------------------------------------

/**
 * Standard D&D 5e coin denominations.
 * `rate` is the value of one coin expressed in copper pieces.
 * `weightLbs` is the weight of a single coin (50 coins = 1 lb).
 */
export const CURRENCY_TYPES = {
  cp: {
    key: "cp",
    name: "Copper Piece",
    abbreviation: "cp",
    rate: 1,
    iconHint: "coin-copper",
    weightLbs: 1 / 50,
  },
  sp: {
    key: "sp",
    name: "Silver Piece",
    abbreviation: "sp",
    rate: 10,
    iconHint: "coin-silver",
    weightLbs: 1 / 50,
  },
  ep: {
    key: "ep",
    name: "Electrum Piece",
    abbreviation: "ep",
    rate: 50,
    iconHint: "coin-electrum",
    weightLbs: 1 / 50,
  },
  gp: {
    key: "gp",
    name: "Gold Piece",
    abbreviation: "gp",
    rate: 100,
    iconHint: "coin-gold",
    weightLbs: 1 / 50,
  },
  pp: {
    key: "pp",
    name: "Platinum Piece",
    abbreviation: "pp",
    rate: 1000,
    iconHint: "coin-platinum",
    weightLbs: 1 / 50,
  },
};

/**
 * Ordered array of denominations from lowest to highest value.
 * Useful for iteration in display and optimisation logic.
 */
export const DENOMINATION_ORDER = ["cp", "sp", "ep", "gp", "pp"];

// ---------------------------------------------------------------------------
// TRADE_GOODS
// ---------------------------------------------------------------------------

/**
 * Common trade goods and their copper-piece equivalents (PHB p. 157).
 * `unit` describes what quantity the `valueCp` represents.
 */
export const TRADE_GOODS = [
  { name: "Wheat",   unit: "1 lb",    valueCp: 1   },
  { name: "Flour",   unit: "1 lb",    valueCp: 2   },
  { name: "Chicken", unit: "1 bird",  valueCp: 2   },
  { name: "Iron",    unit: "1 lb",    valueCp: 10  },  // 1 sp
  { name: "Canvas",  unit: "1 lb",    valueCp: 10  },  // 1 sp
  { name: "Ginger",  unit: "1 lb",    valueCp: 100 },  // 1 gp
  { name: "Goat",    unit: "1 animal",valueCp: 100 },  // 1 gp
  { name: "Cow",     unit: "1 animal",valueCp: 1000},  // 10 gp
  { name: "Ox",      unit: "1 animal",valueCp: 1500},  // 15 gp
];

// ---------------------------------------------------------------------------
// LIFESTYLE_EXPENSES
// ---------------------------------------------------------------------------

/**
 * Lifestyle expense tiers (PHB p. 157–158).
 * `costCpPerDay` is the daily cost in copper pieces.
 * A value of `null` means effectively free / no fixed cost.
 * `note` captures the "10gp+" qualifier for Aristocratic.
 */
export const LIFESTYLE_EXPENSES = [
  {
    lifestyle: "Wretched",
    costCpPerDay: 0,
    note: "No coin cost; survival by begging or foraging.",
  },
  {
    lifestyle: "Squalid",
    costCpPerDay: 1,       // 1 sp = 10 cp
    note: null,
  },
  {
    lifestyle: "Poor",
    costCpPerDay: 20,      // 2 sp = 20 cp
    note: null,
  },
  {
    lifestyle: "Modest",
    costCpPerDay: 100,     // 1 gp = 100 cp
    note: null,
  },
  {
    lifestyle: "Comfortable",
    costCpPerDay: 200,     // 2 gp = 200 cp
    note: null,
  },
  {
    lifestyle: "Wealthy",
    costCpPerDay: 400,     // 4 gp = 400 cp
    note: null,
  },
  {
    lifestyle: "Aristocratic",
    costCpPerDay: 1000,    // 10 gp minimum = 1000 cp
    note: "Minimum 10 gp/day; actual cost often higher.",
  },
];

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Convert an amount of a given denomination into copper pieces.
 *
 * @param {number} amount        - Quantity of coins/denomination to convert.
 * @param {string} denomination  - One of "cp" | "sp" | "ep" | "gp" | "pp".
 * @returns {number} Equivalent value in copper pieces.
 * @throws {Error} If the denomination is not recognised.
 */
export function convertToCopper(amount, denomination) {
  const denom = CURRENCY_TYPES[denomination];
  if (!denom) {
    throw new Error(
      `Unknown denomination "${denomination}". Valid options: ${Object.keys(CURRENCY_TYPES).join(", ")}.`
    );
  }
  return amount * denom.rate;
}

/**
 * Convert a copper-piece total into a target denomination.
 * Returns a decimal number; use Math.floor() if you need whole coins.
 *
 * @param {number} copperAmount      - Value expressed in copper pieces.
 * @param {string} targetDenomination - One of "cp" | "sp" | "ep" | "gp" | "pp".
 * @returns {number} Equivalent value in the target denomination.
 * @throws {Error} If the denomination is not recognised.
 */
export function convertFromCopper(copperAmount, targetDenomination) {
  const denom = CURRENCY_TYPES[targetDenomination];
  if (!denom) {
    throw new Error(
      `Unknown denomination "${targetDenomination}". Valid options: ${Object.keys(CURRENCY_TYPES).join(", ")}.`
    );
  }
  return copperAmount / denom.rate;
}

/**
 * Convert an amount from one denomination to another.
 *
 * @param {number} amount  - Quantity of coins to convert.
 * @param {string} from    - Source denomination key.
 * @param {string} to      - Target denomination key.
 * @returns {number} Converted amount in the target denomination (may be fractional).
 * @throws {Error} If either denomination is not recognised.
 */
export function convertCurrency(amount, from, to) {
  const copperValue = convertToCopper(amount, from);
  return convertFromCopper(copperValue, to);
}

/**
 * Given a total value in copper pieces, return the fewest possible coins
 * needed to represent that value using pp → gp → ep → sp → cp.
 *
 * Electrum pieces are intentionally skipped in the greedy pass because
 * they are rarely used and can cause unexpected results. They are included
 * as a fallback denomination order to match RAW but kept after gp.
 *
 * @param {number} copperTotal - Total value in copper pieces (must be a non-negative integer).
 * @returns {{ pp: number, gp: number, ep: number, sp: number, cp: number }}
 */
export function optimizeChange(copperTotal) {
  if (copperTotal < 0) {
    throw new Error("copperTotal must be a non-negative number.");
  }

  let remaining = Math.floor(copperTotal);
  const result = { pp: 0, gp: 0, ep: 0, sp: 0, cp: 0 };

  // Greedy highest-to-lowest, skipping ep to minimise unusual coinage.
  const greedyOrder = ["pp", "gp", "sp", "cp"];
  for (const key of greedyOrder) {
    const rate = CURRENCY_TYPES[key].rate;
    result[key] = Math.floor(remaining / rate);
    remaining -= result[key] * rate;
  }

  // Any residual copper (should be 0 after cp pass, but guard anyway).
  result.cp += remaining;

  return result;
}

/**
 * Calculate the total weight (in pounds) of a collection of coins.
 *
 * @param {{ cp?: number, sp?: number, ep?: number, gp?: number, pp?: number }} coinCounts
 *   An object mapping denomination keys to coin counts. Missing keys are treated as 0.
 * @returns {number} Total weight in pounds.
 */
export function calculateWeight(coinCounts) {
  let totalWeight = 0;
  for (const [key, count] of Object.entries(coinCounts)) {
    const denom = CURRENCY_TYPES[key];
    if (!denom) {
      throw new Error(
        `Unknown denomination "${key}" in coinCounts. Valid options: ${Object.keys(CURRENCY_TYPES).join(", ")}.`
      );
    }
    totalWeight += (count || 0) * denom.weightLbs;
  }
  return totalWeight;
}

/**
 * Format a copper-piece total as a human-readable currency string.
 * Only non-zero denominations are included.
 * Electrum pieces are omitted from the output for readability.
 *
 * Examples:
 *   formatCurrency(1234) → "12 gp, 3 sp, 4 cp"
 *   formatCurrency(100)  → "1 gp"
 *   formatCurrency(5)    → "5 cp"
 *   formatCurrency(0)    → "0 cp"
 *
 * @param {number} copperAmount - Total value in copper pieces.
 * @returns {string} Formatted currency string.
 */
export function formatCurrency(copperAmount) {
  if (copperAmount === 0) return "0 cp";

  const coins = optimizeChange(copperAmount);
  const parts = [];

  // Display order: pp → gp → sp → cp (ep hidden for cleaner output)
  const displayOrder = ["pp", "gp", "sp", "cp"];
  for (const key of displayOrder) {
    if (coins[key] > 0) {
      parts.push(`${coins[key]} ${key}`);
    }
  }

  return parts.length > 0 ? parts.join(", ") : "0 cp";
}

/**
 * Calculate the total lifestyle cost for a given number of days.
 *
 * @param {string} lifestyle - Lifestyle name (case-insensitive), e.g. "Modest".
 * @param {number} days      - Number of days.
 * @returns {{ lifestyle: string, days: number, totalCp: number, totalGp: number, formatted: string, note: string|null }}
 * @throws {Error} If the lifestyle name is not recognised.
 */
export function getLifestyleCost(lifestyle, days) {
  const entry = LIFESTYLE_EXPENSES.find(
    (l) => l.lifestyle.toLowerCase() === lifestyle.toLowerCase()
  );

  if (!entry) {
    const valid = LIFESTYLE_EXPENSES.map((l) => l.lifestyle).join(", ");
    throw new Error(
      `Unknown lifestyle "${lifestyle}". Valid options: ${valid}.`
    );
  }

  const totalCp = entry.costCpPerDay * days;

  return {
    lifestyle: entry.lifestyle,
    days,
    totalCp,
    totalGp: totalCp / 100,
    formatted: formatCurrency(totalCp),
    note: entry.note,
  };
}
