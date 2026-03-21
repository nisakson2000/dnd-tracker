/**
 * playerCurrencyTracker.js
 * Player Mode: Currency management, splitting, and conversion
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// CURRENCY DENOMINATIONS
// ---------------------------------------------------------------------------

export const CURRENCIES = [
  { id: 'cp', name: 'Copper', abbr: 'CP', color: '#b87333', valueInCP: 1 },
  { id: 'sp', name: 'Silver', abbr: 'SP', color: '#c0c0c0', valueInCP: 10 },
  { id: 'ep', name: 'Electrum', abbr: 'EP', color: '#8faadc', valueInCP: 50 },
  { id: 'gp', name: 'Gold', abbr: 'GP', color: '#c9a84c', valueInCP: 100 },
  { id: 'pp', name: 'Platinum', abbr: 'PP', color: '#e5e4e2', valueInCP: 1000 },
];

/**
 * Convert any amount to copper pieces.
 */
export function toCopper(purse) {
  let total = 0;
  for (const c of CURRENCIES) {
    total += (purse[c.id] || 0) * c.valueInCP;
  }
  return total;
}

/**
 * Convert copper pieces to a full purse.
 */
export function fromCopper(totalCP) {
  const purse = { pp: 0, gp: 0, ep: 0, sp: 0, cp: 0 };
  let remaining = totalCP;
  purse.pp = Math.floor(remaining / 1000); remaining %= 1000;
  purse.gp = Math.floor(remaining / 100); remaining %= 100;
  purse.sp = Math.floor(remaining / 10); remaining %= 10;
  purse.cp = remaining;
  return purse;
}

/**
 * Split loot evenly among N players.
 */
export function splitLoot(totalPurse, numPlayers) {
  if (numPlayers <= 0) return [];
  const totalCP = toCopper(totalPurse);
  const perPlayer = Math.floor(totalCP / numPlayers);
  const remainder = totalCP % numPlayers;
  const shares = [];
  for (let i = 0; i < numPlayers; i++) {
    const extra = i < remainder ? 1 : 0;
    shares.push(fromCopper(perPlayer + extra));
  }
  return shares;
}

/**
 * Format a purse for display: "15gp 3sp 2cp"
 */
export function formatPurse(purse) {
  const parts = [];
  for (const c of [...CURRENCIES].reverse()) { // pp, gp, ep, sp, cp
    const amount = purse[c.id] || 0;
    if (amount > 0) parts.push(`${amount}${c.id}`);
  }
  return parts.join(' ') || '0gp';
}

/**
 * Total value in gold pieces.
 */
export function totalInGold(purse) {
  return toCopper(purse) / 100;
}

// ---------------------------------------------------------------------------
// LIFESTYLE EXPENSES (per day)
// ---------------------------------------------------------------------------

export const LIFESTYLE_EXPENSES = [
  { lifestyle: 'Wretched', gpPerDay: 0, description: 'Living on the streets' },
  { lifestyle: 'Squalid', gpPerDay: 0.1, description: 'Dangerous, minimal shelter' },
  { lifestyle: 'Poor', gpPerDay: 0.2, description: 'Basic necessities only' },
  { lifestyle: 'Modest', gpPerDay: 1, description: 'Simple lodging, adequate food' },
  { lifestyle: 'Comfortable', gpPerDay: 2, description: 'Good food, decent lodging' },
  { lifestyle: 'Wealthy', gpPerDay: 4, description: 'Fine dining, quality lodging' },
  { lifestyle: 'Aristocratic', gpPerDay: 10, description: 'Luxury living, servants' },
];
