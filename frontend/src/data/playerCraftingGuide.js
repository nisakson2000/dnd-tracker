/**
 * playerCraftingGuide.js
 * Player Mode: Item crafting rules and recipes
 * Pure JS — no React dependencies.
 */

export const CRAFTING_RULES = {
  requirement: 'Proficiency with relevant tools + materials worth half the item\'s cost.',
  pace: '5 gp progress per day of crafting (standard rules).',
  xanatharPace: 'Xanathar\'s: varies by rarity. Common = 1 workweek, Legendary = 1 year.',
  magicItems: 'Magic items require a formula AND rare materials (usually from a monster or quest).',
  multipleCreators: 'Multiple characters can work together. Each adds 5 gp progress/day.',
};

export const CRAFTING_BY_RARITY = [
  { rarity: 'Common', cost: '50 gp', time: '1 workweek (5 days)', minLevel: 3, cr: '-' },
  { rarity: 'Uncommon', cost: '200 gp', time: '2 workweeks', minLevel: 3, cr: '1-3' },
  { rarity: 'Rare', cost: '2,000 gp', time: '10 workweeks', minLevel: 6, cr: '4-8' },
  { rarity: 'Very Rare', cost: '20,000 gp', time: '25 workweeks', minLevel: 11, cr: '9-12' },
  { rarity: 'Legendary', cost: '100,000 gp', time: '50 workweeks', minLevel: 17, cr: '13+' },
];

export const TOOL_PROFICIENCIES = [
  { tool: 'Smith\'s Tools', crafts: 'Metal weapons, armor, shields, metal objects', key: 'Repair metal gear, craft custom weapons' },
  { tool: 'Leatherworker\'s Tools', crafts: 'Leather armor, boots, belts, bags', key: 'Repair leather armor, create holsters' },
  { tool: 'Carpenter\'s Tools', crafts: 'Wooden items, shields, structures', key: 'Build shelters, repair doors, create wooden items' },
  { tool: 'Tinker\'s Tools', crafts: 'Clockwork devices, small mechanisms', key: 'Rock Gnome devices, repair locks, create gadgets' },
  { tool: 'Alchemist\'s Supplies', crafts: 'Potions, acid, alchemist\'s fire, antitoxin', key: 'Identify potions, create basic alchemical items' },
  { tool: 'Herbalism Kit', crafts: 'Potions of healing, antitoxin, herbal remedies', key: 'Create Potions of Healing (25 gp + 1 workweek)' },
  { tool: 'Jeweler\'s Tools', crafts: 'Rings, amulets, gem-set items', key: 'Appraise gems, craft jewelry components' },
  { tool: 'Weaver\'s Tools', crafts: 'Robes, cloaks, cloth items', key: 'Repair cloth armor, create disguises' },
  { tool: 'Calligrapher\'s Supplies', crafts: 'Scrolls, documents, maps', key: 'Scribe spell scrolls (with spellcasting)' },
  { tool: 'Poisoner\'s Kit', crafts: 'Poisons (various types)', key: 'Apply poison (DC varies), identify poisons' },
];

export const SCROLL_SCRIBING = [
  { level: 'Cantrip', cost: '15 gp', time: '1 day', saveDC: 13, attackBonus: 5 },
  { level: '1st', cost: '25 gp', time: '1 day', saveDC: 13, attackBonus: 5 },
  { level: '2nd', cost: '250 gp', time: '3 days', saveDC: 13, attackBonus: 5 },
  { level: '3rd', cost: '500 gp', time: '1 workweek', saveDC: 15, attackBonus: 7 },
  { level: '4th', cost: '2,500 gp', time: '2 workweeks', saveDC: 15, attackBonus: 7 },
  { level: '5th', cost: '5,000 gp', time: '4 workweeks', saveDC: 17, attackBonus: 9 },
  { level: '6th', cost: '15,000 gp', time: '8 workweeks', saveDC: 17, attackBonus: 9 },
  { level: '7th', cost: '25,000 gp', time: '16 workweeks', saveDC: 18, attackBonus: 10 },
  { level: '8th', cost: '50,000 gp', time: '32 workweeks', saveDC: 18, attackBonus: 10 },
  { level: '9th', cost: '250,000 gp', time: '48 workweeks', saveDC: 19, attackBonus: 11 },
];

export const POTION_BREWING = [
  { potion: 'Potion of Healing', cost: '25 gp', time: '1 day', tool: 'Herbalism Kit', rarity: 'Common' },
  { potion: 'Potion of Greater Healing', cost: '100 gp', time: '1 workweek', tool: 'Herbalism Kit', rarity: 'Uncommon' },
  { potion: 'Potion of Superior Healing', cost: '1,000 gp', time: '3 workweeks', tool: 'Herbalism Kit', rarity: 'Rare' },
  { potion: 'Potion of Supreme Healing', cost: '10,000 gp', time: '4 workweeks', tool: 'Herbalism Kit', rarity: 'Very Rare' },
  { potion: 'Antitoxin', cost: '25 gp', time: '1 day', tool: 'Alchemist\'s or Herbalism', rarity: 'Common' },
];

export function getCraftingTime(rarity) {
  const entry = CRAFTING_BY_RARITY.find(c => c.rarity.toLowerCase() === (rarity || '').toLowerCase());
  return entry || null;
}

export function getScrollCost(spellLevel) {
  return SCROLL_SCRIBING.find(s => s.level.toLowerCase().includes(String(spellLevel))) || null;
}

export function getToolForCraft(itemType) {
  return TOOL_PROFICIENCIES.find(t =>
    t.crafts.toLowerCase().includes((itemType || '').toLowerCase())
  ) || null;
}
