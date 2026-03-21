/**
 * playerCurrencyConverter.js
 * Player Mode: D&D currency conversion and tracking
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// CURRENCY TYPES
// ---------------------------------------------------------------------------

export const CURRENCIES = [
  { id: 'cp', name: 'Copper Pieces', abbr: 'cp', color: '#b87333', gpValue: 0.01, icon: 'circle' },
  { id: 'sp', name: 'Silver Pieces', abbr: 'sp', color: '#c0c0c0', gpValue: 0.1, icon: 'circle' },
  { id: 'ep', name: 'Electrum Pieces', abbr: 'ep', color: '#6495ed', gpValue: 0.5, icon: 'circle' },
  { id: 'gp', name: 'Gold Pieces', abbr: 'gp', color: '#ffd700', gpValue: 1, icon: 'circle' },
  { id: 'pp', name: 'Platinum Pieces', abbr: 'pp', color: '#e5e4e2', gpValue: 10, icon: 'circle' },
];

// ---------------------------------------------------------------------------
// CONVERSION RATES
// ---------------------------------------------------------------------------

export const CONVERSION_TABLE = {
  cp: { cp: 1, sp: 0.1, ep: 0.02, gp: 0.01, pp: 0.001 },
  sp: { cp: 10, sp: 1, ep: 0.2, gp: 0.1, pp: 0.01 },
  ep: { cp: 50, sp: 5, ep: 1, gp: 0.5, pp: 0.05 },
  gp: { cp: 100, sp: 10, ep: 2, gp: 1, pp: 0.1 },
  pp: { cp: 1000, sp: 100, ep: 20, gp: 10, pp: 1 },
};

// ---------------------------------------------------------------------------
// COIN WEIGHT
// ---------------------------------------------------------------------------

export const COIN_WEIGHT = {
  coinsPerPound: 50,
  note: '50 coins of any denomination weigh 1 pound.',
};

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Convert an amount from one currency to another.
 */
export function convert(amount, from, to) {
  const rate = CONVERSION_TABLE[from]?.[to];
  if (!rate) return 0;
  return amount * rate;
}

/**
 * Calculate total wealth in GP.
 */
export function totalWealth(purse) {
  let total = 0;
  for (const currency of CURRENCIES) {
    total += (purse[currency.id] || 0) * currency.gpValue;
  }
  return Math.round(total * 100) / 100;
}

/**
 * Calculate total coin weight in pounds.
 */
export function totalCoinWeight(purse) {
  let totalCoins = 0;
  for (const currency of CURRENCIES) {
    totalCoins += purse[currency.id] || 0;
  }
  return totalCoins / COIN_WEIGHT.coinsPerPound;
}

/**
 * Format currency display.
 */
export function formatCurrency(purse) {
  const parts = [];
  for (const currency of [...CURRENCIES].reverse()) {
    const amount = purse[currency.id] || 0;
    if (amount > 0) parts.push(`${amount} ${currency.abbr}`);
  }
  return parts.join(', ') || '0 gp';
}

/**
 * Simplify coins upward (convert lower denominations to higher).
 */
export function simplifyCoins(purse) {
  let totalCP = 0;
  for (const currency of CURRENCIES) {
    totalCP += (purse[currency.id] || 0) * (currency.gpValue * 100);
  }
  totalCP = Math.round(totalCP);

  const pp = Math.floor(totalCP / 1000);
  totalCP %= 1000;
  const gp = Math.floor(totalCP / 100);
  totalCP %= 100;
  const sp = Math.floor(totalCP / 10);
  const cp = totalCP % 10;

  return { pp, gp, ep: 0, sp, cp };
}
