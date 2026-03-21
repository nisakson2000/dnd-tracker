/**
 * playerGoldEconomy.js
 * Player Mode: Typical costs for items, services, and lifestyle
 * Pure JS — no React dependencies.
 */

export const CURRENCY_CONVERSION = {
  cp: { name: 'Copper', toGold: 0.01 },
  sp: { name: 'Silver', toGold: 0.1 },
  ep: { name: 'Electrum', toGold: 0.5 },
  gp: { name: 'Gold', toGold: 1 },
  pp: { name: 'Platinum', toGold: 10 },
};

export const LIFESTYLE_EXPENSES = [
  { lifestyle: 'Wretched', cost: '—', perDay: 0, description: 'Homeless, sleeping outside.' },
  { lifestyle: 'Squalid', cost: '1 sp/day', perDay: 0.1, description: 'Leaky shack, unsafe neighborhood.' },
  { lifestyle: 'Poor', cost: '2 sp/day', perDay: 0.2, description: 'Simple room, basic food.' },
  { lifestyle: 'Modest', cost: '1 gp/day', perDay: 1, description: 'Clean room at an inn, decent meals.' },
  { lifestyle: 'Comfortable', cost: '2 gp/day', perDay: 2, description: 'Private room, good food, decent clothes.' },
  { lifestyle: 'Wealthy', cost: '4 gp/day', perDay: 4, description: 'Fine lodging, excellent food, servants.' },
  { lifestyle: 'Aristocratic', cost: '10+ gp/day', perDay: 10, description: 'Lavish estate, gourmet meals, social elite.' },
];

export const COMMON_SERVICES = [
  { service: 'Ale (mug)', cost: '4 cp' },
  { service: 'Wine (pitcher)', cost: '2 sp' },
  { service: 'Meal (modest)', cost: '3 sp' },
  { service: 'Meal (comfortable)', cost: '5 sp' },
  { service: 'Inn stay (modest)', cost: '5 sp/night' },
  { service: 'Inn stay (comfortable)', cost: '8 sp/night' },
  { service: 'Stabling (per day)', cost: '5 sp' },
  { service: 'Hireling (untrained)', cost: '2 sp/day' },
  { service: 'Hireling (skilled)', cost: '2 gp/day' },
  { service: 'Messenger', cost: '2 cp/mile' },
  { service: 'Road/gate toll', cost: '1 cp' },
  { service: 'Ship passage', cost: '1 sp/mile' },
  { service: 'Coach cab (city)', cost: '1 cp' },
  { service: 'Spellcasting service', cost: '10-50gp + components' },
];

export const COMMON_EQUIPMENT_COSTS = [
  { item: 'Healing Potion', cost: '50 gp', notes: '2d4+2 HP' },
  { item: 'Antitoxin', cost: '50 gp', notes: 'Advantage vs poison for 1 hour' },
  { item: 'Rope (50 ft, hemp)', cost: '1 gp', notes: '2 HP, burst DC 17' },
  { item: 'Rope (50 ft, silk)', cost: '10 gp', notes: 'Lighter, same strength' },
  { item: 'Torch', cost: '1 cp', notes: '20ft bright, 20ft dim, 1 hour' },
  { item: 'Lantern (hooded)', cost: '5 gp', notes: '30ft bright, 30ft dim' },
  { item: 'Oil (flask)', cost: '1 sp', notes: '5 fire damage, 2 rounds' },
  { item: 'Rations (1 day)', cost: '5 sp', notes: 'Dried food' },
  { item: 'Waterskin', cost: '2 sp', notes: '4 pints capacity' },
  { item: 'Backpack', cost: '2 gp', notes: '30 lbs capacity' },
  { item: 'Bedroll', cost: '1 gp', notes: 'For camping' },
  { item: 'Tent (two-person)', cost: '2 gp', notes: 'Shelter' },
  { item: 'Thieves\' Tools', cost: '25 gp', notes: 'Required for lockpicking' },
  { item: 'Holy Symbol', cost: '5 gp', notes: 'Spellcasting focus (Cleric/Paladin)' },
  { item: 'Component Pouch', cost: '25 gp', notes: 'Spellcasting focus (general)' },
  { item: 'Spellbook', cost: '50 gp', notes: 'Wizard required' },
  { item: 'Chain Mail', cost: '75 gp', notes: 'AC 16, Stealth disadvantage' },
  { item: 'Plate Armor', cost: '1,500 gp', notes: 'AC 18, Str 15, Stealth disadvantage' },
  { item: 'Shield', cost: '10 gp', notes: '+2 AC' },
  { item: 'Longsword', cost: '15 gp', notes: '1d8/1d10 versatile' },
  { item: 'Longbow', cost: '50 gp', notes: '1d8 piercing, 150/600 ft' },
];

export const MAGIC_ITEM_PRICES = [
  { rarity: 'Common', range: '50-100 gp', examples: 'Potion of Healing, Cantrip spell scroll' },
  { rarity: 'Uncommon', range: '100-500 gp', examples: '+1 weapon, Bag of Holding, Cloak of Protection' },
  { rarity: 'Rare', range: '500-5,000 gp', examples: '+2 weapon, Flame Tongue, Ring of Protection' },
  { rarity: 'Very Rare', range: '5,000-50,000 gp', examples: '+3 weapon, Amulet of Health, Staff of Power' },
  { rarity: 'Legendary', range: '50,000+ gp', examples: 'Vorpal Sword, Holy Avenger, Ring of Three Wishes' },
];

export function convertToGold(amount, fromCurrency) {
  const rate = CURRENCY_CONVERSION[fromCurrency];
  return rate ? amount * rate.toGold : amount;
}

export function getLifestyleCost(lifestyle, days) {
  const entry = LIFESTYLE_EXPENSES.find(l => l.lifestyle.toLowerCase() === (lifestyle || '').toLowerCase());
  return entry ? entry.perDay * days : 0;
}
