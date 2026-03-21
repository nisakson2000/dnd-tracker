/**
 * Black Market System — Illegal goods, risks, and underground economy.
 */

export const BLACK_MARKET_GOODS = [
  {
    name: 'Potion of Invisibility',
    normalPrice: 5000,
    blackMarketPrice: 2500,
    risk: 'medium',
    availability: 'common',
    description: 'Discount because the supply chain is... questionable. Might be stolen from a wizard\'s guild.',
    legalStatus: 'Restricted — requires a license to possess in most cities.',
  },
  {
    name: 'Poison (basic)',
    normalPrice: 100,
    blackMarketPrice: 75,
    risk: 'low',
    availability: 'common',
    description: 'Simple contact or ingested poison. No questions asked.',
    legalStatus: 'Illegal in all civilized areas.',
  },
  {
    name: 'Assassin\'s Blood (poison)',
    normalPrice: 150,
    blackMarketPrice: 120,
    risk: 'medium',
    availability: 'uncommon',
    description: 'Ingested. DC 10 CON save or 6 poison damage and poisoned for 24 hours.',
    legalStatus: 'Highly illegal. Possession is evidence of intent to kill.',
  },
  {
    name: 'Forged Documents',
    normalPrice: null,
    blackMarketPrice: 50,
    risk: 'medium',
    availability: 'common',
    description: 'Identity papers, guild licenses, letters of recommendation. Investigation DC 15 to detect as forgeries.',
    legalStatus: 'Illegal. Punishable by imprisonment.',
  },
  {
    name: 'Stolen Spell Scroll',
    normalPrice: 'varies',
    blackMarketPrice: '50% of normal',
    risk: 'high',
    availability: 'uncommon',
    description: 'Scrolls "liberated" from wizard guilds and temples. May have tracking spells on them.',
    legalStatus: 'Stolen property. Receiving stolen goods is a crime.',
  },
  {
    name: 'Smokepowder',
    normalPrice: 250,
    blackMarketPrice: 200,
    risk: 'high',
    availability: 'rare',
    description: 'Explosive alchemical powder. 1 lb creates a 10-foot radius explosion for 3d6 fire damage.',
    legalStatus: 'Banned in most cities. Possession is punishable by death in some.',
  },
  {
    name: 'Slave\'s Release Papers',
    normalPrice: null,
    blackMarketPrice: 200,
    risk: 'high',
    availability: 'rare',
    description: 'Forged freedom papers for slaves or indentured servants. Could save lives or start riots.',
    legalStatus: 'Forgery. Helping slaves escape is illegal in regions with slavery.',
  },
  {
    name: 'Forbidden Tome',
    normalPrice: null,
    blackMarketPrice: 500,
    risk: 'very high',
    availability: 'very rare',
    description: 'Contains knowledge of forbidden magic, demon summoning, or other banned topics.',
    legalStatus: 'Banned by every major religion and most governments.',
  },
  {
    name: 'Cursed Item (disguised)',
    normalPrice: null,
    blackMarketPrice: '70% of apparent item value',
    risk: 'very high',
    availability: 'uncommon',
    description: 'Sold as a legitimate magic item. Actually cursed. No refunds on the black market.',
    legalStatus: 'Fraud, but good luck complaining.',
  },
  {
    name: 'Smuggled Goods (general)',
    normalPrice: 'varies',
    blackMarketPrice: '60% of normal',
    risk: 'low',
    availability: 'common',
    description: 'Tax-free goods. Wine, silk, spices, and other luxury items avoiding import tariffs.',
    legalStatus: 'Tax evasion. Fined if caught.',
  },
];

export const BLACK_MARKET_RISKS = [
  { roll: [1, 20], event: 'Smooth transaction. No complications.', severity: 'none' },
  { roll: [21, 40], event: 'The seller is shady but delivers. Quality may be lower than advertised.', severity: 'minor' },
  { roll: [41, 55], event: 'You\'re being watched. Someone notes your visit but doesn\'t act... yet.', severity: 'minor' },
  { roll: [56, 70], event: 'The goods are hot — stolen recently. Previous owner may come looking.', severity: 'moderate' },
  { roll: [71, 80], event: 'Guards raid the market! DEX DC 14 to escape or face arrest.', severity: 'major' },
  { roll: [81, 90], event: 'The seller tries to rob you. They have 1d4 allies hidden nearby.', severity: 'major' },
  { roll: [91, 95], event: 'It\'s a sting operation. Undercover agents attempt to arrest you.', severity: 'severe' },
  { roll: [96, 100], event: 'The item is cursed or fake. And the seller has already disappeared.', severity: 'severe' },
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const d100 = () => Math.floor(Math.random() * 100) + 1;

export function rollBlackMarketRisk() {
  const roll = d100();
  const event = BLACK_MARKET_RISKS.find(r => roll >= r.roll[0] && roll <= r.roll[1]);
  return { roll, ...event };
}

export function getBlackMarketGoods(availability = null) {
  if (availability) {
    return BLACK_MARKET_GOODS.filter(g => g.availability === availability);
  }
  return [...BLACK_MARKET_GOODS];
}

export function generateBlackMarketDeal() {
  const item = pick(BLACK_MARKET_GOODS);
  const risk = rollBlackMarketRisk();
  return { item, risk };
}
