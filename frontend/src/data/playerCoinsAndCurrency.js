/**
 * playerCoinsAndCurrency.js
 * Player Mode: Currency conversion and wealth management
 * Pure JS — no React dependencies.
 */

export const CURRENCY_TABLE = [
  { coin: 'Copper (cp)', value: 1, inGold: 0.01, weight: '1/50 lb per coin' },
  { coin: 'Silver (sp)', value: 10, inGold: 0.1, weight: '1/50 lb per coin' },
  { coin: 'Electrum (ep)', value: 50, inGold: 0.5, weight: '1/50 lb per coin' },
  { coin: 'Gold (gp)', value: 100, inGold: 1, weight: '1/50 lb per coin' },
  { coin: 'Platinum (pp)', value: 1000, inGold: 10, weight: '1/50 lb per coin' },
];

export const CONVERSION = {
  cpToSp: 10, spToGp: 10, gpToPp: 10,
  cpToGp: 100, spToPp: 100, cpToPp: 1000,
  epToGp: 2, gpToEp: 0.5,
};

export const WEALTH_BY_LEVEL = [
  { level: '1-4', expectedWealth: '50-500 gp', lifestyle: 'Modest to Comfortable' },
  { level: '5-10', expectedWealth: '500-5,000 gp', lifestyle: 'Comfortable to Wealthy' },
  { level: '11-16', expectedWealth: '5,000-50,000 gp', lifestyle: 'Wealthy to Aristocratic' },
  { level: '17-20', expectedWealth: '50,000+ gp', lifestyle: 'Aristocratic. Money is rarely an issue.' },
];

export const LIFESTYLE_EXPENSES = [
  { lifestyle: 'Wretched', cost: '0 gp/day', description: 'Homeless. Sleeping outdoors. No food security.' },
  { lifestyle: 'Squalid', cost: '1 sp/day', description: 'Terrible shelter. Bad food. Dangerous area.' },
  { lifestyle: 'Poor', cost: '2 sp/day', description: 'Leaky roof. Simple food. Safe-ish.' },
  { lifestyle: 'Modest', cost: '1 gp/day', description: 'Simple inn. Decent meals. The adventurer standard.' },
  { lifestyle: 'Comfortable', cost: '2 gp/day', description: 'Good inn. Nice meals. Respectable.' },
  { lifestyle: 'Wealthy', cost: '4 gp/day', description: 'Fine establishments. Excellent meals. Servants.' },
  { lifestyle: 'Aristocratic', cost: '10+ gp/day', description: 'Luxury. Private suites. Gourmet dining. Social elite.' },
];

export const MONEY_TIPS = [
  'Convert copper and silver to gold regularly. 50 coins = 1 lb. It adds up.',
  'Gems are lighter than coins. 1000 gp gem weighs almost nothing. Convert when possible.',
  'Art objects and gems don\'t have coin weight. Great for carrying large values.',
  'Keep a party fund for shared expenses: resurrections, teleportation, bribes.',
  'Don\'t forget to sell loot! Shops buy at 50% listed value (standard rule).',
  'Letters of credit from banks or merchant guilds eliminate coin weight entirely.',
  'Electrum is worth half a gold. Many DMs skip it entirely due to confusion.',
  'Platinum = 10 gold. Carry platinum for large transactions. 10x value per coin.',
];

export function convertCurrency(amount, from, to) {
  const values = { cp: 1, sp: 10, ep: 50, gp: 100, pp: 1000 };
  const fromValue = values[from] || 1;
  const toValue = values[to] || 1;
  return (amount * fromValue) / toValue;
}

export function calculateCoinWeight(cp, sp, ep, gp, pp) {
  const totalCoins = (cp || 0) + (sp || 0) + (ep || 0) + (gp || 0) + (pp || 0);
  return totalCoins / 50; // 50 coins = 1 lb
}

export function totalWealth(cp, sp, ep, gp, pp) {
  return ((cp || 0) / 100) + ((sp || 0) / 10) + ((ep || 0) / 2) + (gp || 0) + ((pp || 0) * 10);
}
