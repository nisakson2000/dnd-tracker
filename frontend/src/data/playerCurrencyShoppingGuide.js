/**
 * playerCurrencyShoppingGuide.js
 * Player Mode: Currency, shopping, and wealth management
 * Pure JS — no React dependencies.
 */

export const CURRENCY = {
  cp: { name: 'Copper Piece', value: '1/100 gp', note: 'Practically worthless. Peasant currency.' },
  sp: { name: 'Silver Piece', value: '1/10 gp', note: 'Common currency. Buy basic goods.' },
  ep: { name: 'Electrum Piece', value: '1/2 gp', note: 'Rarely used. Many tables ignore it.' },
  gp: { name: 'Gold Piece', value: '1 gp', note: 'Standard adventurer currency.' },
  pp: { name: 'Platinum Piece', value: '10 gp', note: 'Wealthy currency. Magic item transactions.' },
};

export const PRIORITY_PURCHASES = [
  { item: 'Plate Armor', cost: '1,500 gp', priority: 'S+ (heavy armor users)', when: 'ASAP for Fighters, Paladins, Clerics. AC 18.', note: 'Biggest single AC upgrade. Buy first.' },
  { item: 'Healing Potions (2d4+2)', cost: '50 gp each', priority: 'S', when: 'Always stock 2-3. Emergency healing.', note: 'Anyone can use. No class restriction.' },
  { item: 'Greater Healing Potion (4d4+4)', cost: '100-250 gp', priority: 'A+', when: 'When basic potions feel weak.', note: 'Better healing per gold.' },
  { item: 'Component Pouch / Focus', cost: '25/5-20 gp', priority: 'S (casters)', when: 'Immediately if you don\'t have one.', note: 'Can\'t cast most spells without components or focus.' },
  { item: 'Shield', cost: '10 gp', priority: 'S (proficient)', when: 'L1 if proficient. +2 AC.', note: 'Cheapest +2 AC in the game.' },
  { item: 'Bag of Holding', cost: '~500 gp', priority: 'S', when: 'ASAP. Solve encumbrance forever.', note: 'Party should pool gold for this.' },
  { item: 'Diamond (300 gp)', cost: '300 gp', priority: 'S+ (L5+)', when: 'Always carry one. Revivify component.', note: 'If someone dies and you don\'t have this, they stay dead.' },
  { item: 'Diamond (500 gp)', cost: '500 gp', priority: 'A+ (L9+)', when: 'Raise Dead component. Backup.', note: 'In case Revivify window passes.' },
  { item: 'Holy Water', cost: '25 gp each', priority: 'A', when: 'Before undead/fiend encounters.', note: '2d6 radiant vs undead/fiends. Anyone can throw.' },
  { item: 'Spell Scroll (Revivify)', cost: '~500 gp', priority: 'S', when: 'If party has no regular access to Revivify.', note: 'Emergency resurrection for any Cleric/Paladin.' },
];

export const WEALTH_BY_LEVEL = [
  { level: '1-4', typical: '50-500 gp', note: 'Scraping by. Save for plate armor.' },
  { level: '5-8', typical: '500-5,000 gp', note: 'Comfortable. Buy key items.' },
  { level: '9-12', typical: '5,000-25,000 gp', note: 'Wealthy. Magic items available.' },
  { level: '13-16', typical: '25,000-100,000 gp', note: 'Rich. Rare items. Strongholds.' },
  { level: '17-20', typical: '100,000+ gp', note: 'Legendary wealth. Very rare/legendary items.' },
];

export const MAGIC_ITEM_COSTS = {
  common: { range: '50-100 gp', examples: 'Potion of Healing, Cantrip scroll.' },
  uncommon: { range: '100-500 gp', examples: '+1 weapon, Bag of Holding, Boots of Elvenkind.' },
  rare: { range: '500-5,000 gp', examples: '+2 weapon, Cloak of Displacement, Ring of Protection.' },
  veryRare: { range: '5,000-50,000 gp', examples: '+3 weapon, Staff of Power, Belt of Giant Strength.' },
  legendary: { range: '50,000+ gp', examples: 'Holy Avenger, Vorpal Sword, Robe of the Archmagi.' },
  note: 'Prices vary by DM and setting. These are guidelines from the DMG/Xanathar\'s.',
};

export const SHOPPING_TIPS = [
  'Plate armor first (heavy armor users). AC 18 for 1,500gp.',
  'Always carry a 300gp diamond. Revivify saves lives.',
  'Pool party gold for a Bag of Holding. Everyone benefits.',
  'Healing Potions: stock 2-3. Anyone can use them.',
  'Magic item prices vary wildly by DM. Ask about availability.',
  'Sell unwanted loot at 50% value (standard).',
  'Gems are lighter than coins. Convert gold to gems for weight.',
  'Holy Water: 25gp for 2d6 radiant vs undead. Cheap damage.',
  'Spell scrolls: buy emergency scrolls (Revivify, Counterspell).',
  'Don\'t hoard gold. Spend it on things that help the party.',
];
