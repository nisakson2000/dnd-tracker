/**
 * playerCraftingSystemGuide.js
 * Player Mode: Crafting rules — weapons, armor, magic items, and more
 * Pure JS — no React dependencies.
 */

export const CRAFTING_RULES_PHB = {
  requirement: 'Proficiency with relevant tools + raw materials.',
  pace: '5 gp worth of progress per day of downtime.',
  cost: 'Half the item\'s market price in raw materials.',
  example: 'Plate armor (1,500 gp): 750 gp materials, 150 days of work.',
  note: 'PHB crafting is extremely slow. Most DMs use Xanathar\'s or homebrew.',
};

export const CRAFTING_RULES_XANATHARS = {
  requirement: 'Proficiency with relevant tools + formula/recipe + materials.',
  pace: 'Varies by item rarity. Work in 25 gp increments per day (workweeks).',
  magicItems: 'Requires formula, exotic materials (quest), and time.',
  note: 'Xanathar\'s is the most commonly used crafting system.',
};

export const MUNDANE_CRAFTING = {
  weapons: [
    { item: 'Simple Weapons', cost: '1-25 gp (materials: half)', time: '1-5 days', tool: 'Smith\'s Tools or Woodcarver\'s', note: 'Cheap and fast.' },
    { item: 'Martial Weapons', cost: '5-50 gp (materials: half)', time: '1-10 days', tool: 'Smith\'s Tools', note: 'Standard crafting.' },
    { item: 'Ammunition (20)', cost: '1 gp (materials: 5 sp)', time: '1 day', tool: 'Smith\'s Tools or Woodcarver\'s', note: 'Easy to keep stocked.' },
  ],
  armor: [
    { item: 'Leather/Padded', cost: '5-10 gp', time: '1-2 days', tool: 'Leatherworker\'s Tools', note: 'Light armor is fast.' },
    { item: 'Chain Shirt', cost: '50 gp', time: '10 days', tool: 'Smith\'s Tools', note: 'Medium armor. Reasonable crafting time.' },
    { item: 'Half Plate', cost: '750 gp', time: '150 days', tool: 'Smith\'s Tools', note: 'Very long craft time.' },
    { item: 'Plate', cost: '1,500 gp', time: '300 days', tool: 'Smith\'s Tools', note: 'Impractical to craft. Just buy it.' },
    { item: 'Shield', cost: '10 gp', time: '2 days', tool: 'Smith\'s or Woodcarver\'s', note: 'Quick and useful.' },
  ],
  other: [
    { item: 'Healing Potion', cost: '25 gp (materials: 25 gp)', time: '1 day', tool: 'Herbalism Kit', note: 'Xanathar\'s rule. Very useful.' },
    { item: 'Antitoxin', cost: '50 gp', time: '1 workweek', tool: 'Alchemist\'s Supplies or Herbalism Kit', note: 'Situational but cheap.' },
    { item: 'Holy Water', cost: '25 gp', time: '1 day', tool: 'Religion check + materials', note: 'Bonus action throw. 2d6 radiant vs undead/fiends.' },
    { item: 'Caltrops (bag of 20)', cost: '1 gp', time: '1 day', tool: 'Smith\'s Tools', note: 'Area denial. Cheap.' },
    { item: 'Ball Bearings (bag of 1000)', cost: '1 gp', time: '1 day', tool: 'Smith\'s Tools or Tinker\'s', note: 'Area denial. DEX save or prone.' },
  ],
};

export const MAGIC_ITEM_CRAFTING_XANATHARS = [
  { rarity: 'Common', cost: '50 gp', time: '1 workweek', minLevel: 3, formula: 'Yes', exoticMaterial: 'No' },
  { rarity: 'Uncommon', cost: '200 gp', time: '2 workweeks', minLevel: 3, formula: 'Yes', exoticMaterial: 'Yes (CR 1-3)' },
  { rarity: 'Rare', cost: '2,000 gp', time: '10 workweeks', minLevel: 6, formula: 'Yes', exoticMaterial: 'Yes (CR 4-8)' },
  { rarity: 'Very Rare', cost: '20,000 gp', time: '25 workweeks', minLevel: 11, formula: 'Yes', exoticMaterial: 'Yes (CR 9-12)' },
  { rarity: 'Legendary', cost: '100,000 gp', time: '50 workweeks', minLevel: 17, formula: 'Yes', exoticMaterial: 'Yes (CR 13+)' },
];

export const CRAFTING_BEST_PRACTICES = [
  'Healing Potions via Herbalism Kit are the most useful mundane craft. 25 gp, 1 day.',
  'Scrolls are better than potions for most spell delivery. See Scroll Scribing guide.',
  'Magic item crafting requires a formula (quest reward) and exotic materials (monster parts).',
  'Multiple characters can work together to reduce crafting time.',
  'Artificers get crafting bonuses: half time, half cost for certain items.',
  'Forge Cleric: Channel Divinity creates simple metal objects. Bypass crafting entirely.',
  'Fabricate spell (Wizard L4): create finished products from raw materials in 10 minutes.',
  'Don\'t craft Plate armor. 300 days. Just buy it or find it.',
  'Craft consumables (potions, scrolls, ammunition) — they\'re always useful.',
  'Ask your DM about harvesting monster parts. Dragon scales → dragon scale mail.',
];

export const CRAFTING_BY_CLASS = [
  { class: 'Artificer', ability: 'Best crafter. Infusions bypass normal crafting. Half time on magic items.', rating: 'S+' },
  { class: 'Forge Cleric', ability: 'Channel Divinity: create metal objects. Blessing of the Forge: +1 weapon/armor.', rating: 'S' },
  { class: 'Wizard (Transmutation)', ability: 'Fabricate spell. Minor Alchemy. Transmuter\'s Stone.', rating: 'A+' },
  { class: 'Druid', ability: 'Herbalism Kit proficiency. Goodberry production. Natural materials.', rating: 'A' },
  { class: 'Rogue', ability: 'Thieves\' Tools for trap crafting. Expertise on tool checks.', rating: 'A' },
  { class: 'Any with Tool Proficiency', ability: 'Background or racial tool proficiency enables basic crafting.', rating: 'B+' },
];
