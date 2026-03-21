/**
 * playerShopPrices.js
 * Player Mode: Standard shop prices and haggling reference
 * Pure JS — no React dependencies.
 */

export const WEAPON_PRICES = [
  { name: 'Dagger', cost: '2 gp', damage: '1d4 piercing', properties: 'Finesse, Light, Thrown (20/60)' },
  { name: 'Handaxe', cost: '5 gp', damage: '1d6 slashing', properties: 'Light, Thrown (20/60)' },
  { name: 'Javelin', cost: '5 sp', damage: '1d6 piercing', properties: 'Thrown (30/120)' },
  { name: 'Longsword', cost: '15 gp', damage: '1d8/1d10 slashing', properties: 'Versatile' },
  { name: 'Greatsword', cost: '50 gp', damage: '2d6 slashing', properties: 'Heavy, Two-Handed' },
  { name: 'Rapier', cost: '25 gp', damage: '1d8 piercing', properties: 'Finesse' },
  { name: 'Longbow', cost: '50 gp', damage: '1d8 piercing', properties: 'Ammunition (150/600), Heavy, Two-Handed' },
  { name: 'Hand Crossbow', cost: '75 gp', damage: '1d6 piercing', properties: 'Ammunition (30/120), Light, Loading' },
  { name: 'Heavy Crossbow', cost: '50 gp', damage: '1d10 piercing', properties: 'Ammunition (100/400), Heavy, Loading, Two-Handed' },
  { name: 'Shortsword', cost: '10 gp', damage: '1d6 piercing', properties: 'Finesse, Light' },
];

export const ARMOR_PRICES = [
  { name: 'Padded', cost: '5 gp', ac: '11 + DEX', stealth: 'Disadvantage', category: 'Light' },
  { name: 'Leather', cost: '10 gp', ac: '11 + DEX', stealth: 'Normal', category: 'Light' },
  { name: 'Studded Leather', cost: '45 gp', ac: '12 + DEX', stealth: 'Normal', category: 'Light' },
  { name: 'Chain Shirt', cost: '50 gp', ac: '13 + DEX (max 2)', stealth: 'Normal', category: 'Medium' },
  { name: 'Scale Mail', cost: '50 gp', ac: '14 + DEX (max 2)', stealth: 'Disadvantage', category: 'Medium' },
  { name: 'Breastplate', cost: '400 gp', ac: '14 + DEX (max 2)', stealth: 'Normal', category: 'Medium' },
  { name: 'Half Plate', cost: '750 gp', ac: '15 + DEX (max 2)', stealth: 'Disadvantage', category: 'Medium' },
  { name: 'Chain Mail', cost: '75 gp', ac: '16', stealth: 'Disadvantage', category: 'Heavy', strReq: 13 },
  { name: 'Splint', cost: '200 gp', ac: '17', stealth: 'Disadvantage', category: 'Heavy', strReq: 15 },
  { name: 'Plate', cost: '1500 gp', ac: '18', stealth: 'Disadvantage', category: 'Heavy', strReq: 15 },
  { name: 'Shield', cost: '10 gp', ac: '+2', stealth: 'Normal', category: 'Shield' },
];

export const ADVENTURING_GEAR_PRICES = [
  { name: 'Rope (50ft)', cost: '1 gp' },
  { name: 'Torch (10)', cost: '1 sp' },
  { name: 'Rations (1 day)', cost: '5 sp' },
  { name: 'Waterskin', cost: '2 sp' },
  { name: 'Bedroll', cost: '1 gp' },
  { name: 'Tent (2-person)', cost: '2 gp' },
  { name: 'Tinderbox', cost: '5 sp' },
  { name: 'Grappling Hook', cost: '2 gp' },
  { name: 'Lantern (hooded)', cost: '5 gp' },
  { name: 'Oil (flask)', cost: '1 sp' },
  { name: 'Caltrops (bag of 20)', cost: '1 gp' },
  { name: 'Ball Bearings (bag of 1000)', cost: '1 gp' },
  { name: 'Healer\'s Kit (10 uses)', cost: '5 gp' },
  { name: 'Antitoxin (vial)', cost: '50 gp' },
  { name: 'Holy Water (flask)', cost: '25 gp' },
  { name: 'Acid (vial)', cost: '25 gp' },
  { name: 'Alchemist\'s Fire', cost: '50 gp' },
  { name: 'Manacles', cost: '2 gp' },
  { name: 'Spyglass', cost: '1000 gp' },
  { name: 'Component Pouch', cost: '25 gp' },
];

export const SERVICE_PRICES = [
  { service: 'Inn (modest)', cost: '5 sp / night' },
  { service: 'Inn (comfortable)', cost: '8 sp / night' },
  { service: 'Inn (wealthy)', cost: '2 gp / night' },
  { service: 'Meal (modest)', cost: '3 sp' },
  { service: 'Meal (comfortable)', cost: '5 sp' },
  { service: 'Ale (mug)', cost: '4 cp' },
  { service: 'Wine (pitcher)', cost: '2 sp' },
  { service: 'Hireling (untrained)', cost: '2 sp / day' },
  { service: 'Hireling (skilled)', cost: '2 gp / day' },
  { service: 'Messenger', cost: '2 cp / mile' },
  { service: 'Coach cab (in city)', cost: '1 cp' },
  { service: 'Ship passage', cost: '1 sp / mile' },
  { service: 'Spellcasting service', cost: '10-50 gp + components (varies)' },
];

export const HAGGLING_TIPS = [
  { tip: 'Persuasion check', dc: '10-20', effect: '10-25% discount depending on roll vs DC' },
  { tip: 'Bulk purchases', dc: 'None', effect: 'Buying 10+ of same item: 10% discount typical' },
  { tip: 'Sell price', dc: 'None', effect: 'Shops buy at HALF the listed price (standard rule)' },
  { tip: 'Stolen goods', dc: 'None', effect: 'Fences buy at 25-40% of value. Sleight of Hand to find one.' },
  { tip: 'Reputation', dc: 'None', effect: 'If you saved the town, prices drop. If you caused trouble, they rise.' },
];

export function findItem(name) {
  const all = [...WEAPON_PRICES, ...ARMOR_PRICES, ...ADVENTURING_GEAR_PRICES];
  return all.find(i => i.name.toLowerCase().includes((name || '').toLowerCase())) || null;
}

export function calculateSellPrice(costString) {
  const match = (costString || '').match(/(\d+)\s*(cp|sp|gp|pp)/);
  if (!match) return 'Unknown';
  const value = parseInt(match[1], 10);
  return `${Math.floor(value / 2)} ${match[2]}`;
}
