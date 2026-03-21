/**
 * playerCraftingOptimizationGuide.js
 * Player Mode: Crafting systems, potion brewing, and item creation
 * Pure JS — no React dependencies.
 */

export const CRAFTING_BASICS = {
  phbRule: '5gp of progress per day. Cost = half market price. Need tool proficiency.',
  xanatharsRule: 'Rarity-based time and cost. Much faster for common/uncommon items.',
  requirement: 'Tool proficiency matching the item. Formula/recipe for magic items.',
  multipleArtisans: 'Multiple characters with tool proficiency can work together, each contributing their daily progress.',
};

export const POTION_BREWING = {
  toolRequired: 'Herbalism Kit or Alchemist\'s Supplies',
  potionOfHealing: { cost: '25gp', time: '1 day', heals: '2d4+2', note: 'Most efficient potion. Every adventurer should stockpile.' },
  greaterHealing: { cost: '100gp', time: '1 workweek', heals: '4d4+4', note: 'Good mid-tier healing.' },
  superiorHealing: { cost: '1,000gp', time: '3 workweeks', heals: '8d4+8', note: 'Expensive but very strong.' },
  supremeHealing: { cost: '10,000gp', time: '4 workweeks', heals: '10d4+20', note: 'End-game healing potion.' },
};

export const TOOL_TO_ITEM_MAP = [
  { tool: 'Smith\'s Tools', items: ['Weapons', 'Armor', 'Metal items', 'Horseshoes'], note: 'Most martial equipment.' },
  { tool: 'Leatherworker\'s Tools', items: ['Leather armor', 'Boots', 'Belts', 'Bags'], note: 'Light armor and accessories.' },
  { tool: 'Carpenter\'s Tools', items: ['Shields', 'Bows', 'Staffs', 'Wooden structures'], note: 'Wooden items and structures.' },
  { tool: 'Jeweler\'s Tools', items: ['Rings', 'Amulets', 'Crowns', 'Gemstone settings'], note: 'Magic item settings for jewelry.' },
  { tool: 'Tinker\'s Tools', items: ['Clockwork devices', 'Traps', 'Gadgets'], note: 'Artificer specialty.' },
  { tool: 'Weaver\'s Tools', items: ['Cloaks', 'Robes', 'Bags of Holding (with formula)'], note: 'Cloth items and magical cloaks.' },
  { tool: 'Herbalism Kit', items: ['Potions of Healing', 'Antitoxin', 'Herbal remedies'], note: 'Essential for potion crafting.' },
  { tool: 'Alchemist\'s Supplies', items: ['Potions', 'Acids', 'Alchemist\'s Fire', 'Poisons'], note: 'Chemical creations.' },
  { tool: 'Poisoner\'s Kit', items: ['Poisons (all types)'], note: 'DC 20 Nature check to harvest poison from dead creatures.' },
  { tool: 'Calligrapher\'s Supplies', items: ['Spell scrolls (with Arcana proficiency)'], note: 'Scroll scribing. Needs spellcasting ability too.' },
];

export const CRAFTING_OPTIMIZATION = [
  { tip: 'Multiple crafters', detail: 'Each character with the right tool proficiency adds their daily progress. 4 smiths = 4× speed.', rating: 'S' },
  { tip: 'Fabricate spell', detail: 'L4 Transmutation: instantly create items from raw materials. Skip the time entirely. Need tool proficiency.', rating: 'S' },
  { tip: 'Artificer class features', detail: 'Artificers get Magic Item Adept (L10: craft common/uncommon at quarter time/cost) and Magic Item Savant (L14: attune 5 items).', rating: 'S' },
  { tip: 'Craft during travel', detail: 'Some DMs allow crafting during long overland travel days. Ask if you can work while riding.', rating: 'A' },
  { tip: 'Stock healing potions', detail: 'Every day of downtime: brew a Potion of Healing. 25gp, 1 day. Stockpile between adventures.', rating: 'S' },
  { tip: 'Harvest monster parts', detail: 'Dragon scales for armor, hydra venom for poison, giant bones for clubs. DM-dependent but ask.', rating: 'A' },
];

export const POISON_CRAFTING = {
  toolRequired: 'Poisoner\'s Kit',
  harvestDC: 'Nature check DC 20 to harvest poison from dead creature (within 1 minute of death)',
  basicPoison: { cost: '100gp', damage: '1d4 poison (DC 10 CON save)', duration: '1 minute', note: 'Weak. Buy or craft better.' },
  craftablPoisons: [
    { poison: 'Serpent Venom', type: 'Injury', damage: '3d6 poison (DC 11 CON, half on save)', cost: '200gp' },
    { poison: 'Drow Poison', type: 'Injury', effect: 'DC 13 CON or unconscious 1 hour', cost: '200gp' },
    { poison: 'Wyvern Poison', type: 'Injury', damage: '7d6 poison (DC 15 CON, half on save)', cost: '1,200gp' },
    { poison: 'Purple Worm Poison', type: 'Injury', damage: '12d6 poison (DC 19 CON, half on save)', cost: '2,000gp' },
  ],
};

export function craftingDays(itemCostGP, numberOfCrafters = 1) {
  const totalDays = Math.ceil(itemCostGP / (5 * 2)); // half cost / 5gp per day
  return Math.ceil(totalDays / numberOfCrafters);
}

export function xanatharCraftingWeeks(rarity) {
  const weeks = { common: 1, uncommon: 2, rare: 10, veryRare: 25, legendary: 50 };
  return weeks[rarity] || 1;
}

export function potionCost(type) {
  const costs = { healing: 25, greater: 100, superior: 1000, supreme: 10000 };
  return costs[type] || 25;
}
