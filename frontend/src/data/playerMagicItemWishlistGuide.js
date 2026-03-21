/**
 * playerMagicItemWishlistGuide.js
 * Player Mode: Best magic items by class and rarity tier
 * Pure JS — no React dependencies.
 */

export const MAGIC_ITEM_TIERS = {
  common: { rarity: 'Common', attunement: 'Sometimes', priceRange: '50-100gp', note: 'Minor utility items. Good at L1-4.' },
  uncommon: { rarity: 'Uncommon', attunement: 'Sometimes', priceRange: '101-500gp', note: 'Core power items. L1-8 sweet spot.' },
  rare: { rarity: 'Rare', attunement: 'Usually', priceRange: '501-5000gp', note: 'Significant power boost. L5-14.' },
  veryRare: { rarity: 'Very Rare', attunement: 'Usually', priceRange: '5001-50000gp', note: 'Build-defining items. L11-16.' },
  legendary: { rarity: 'Legendary', attunement: 'Usually', priceRange: '50001+gp', note: 'Game-changing power. L17+.' },
};

export const UNIVERSAL_BEST_ITEMS = [
  { item: 'Cloak of Protection', rarity: 'Uncommon', attunement: true, effect: '+1 AC and saving throws.', rating: 'S', note: 'Best uncommon item in the game. +1 to EVERYTHING defensive.' },
  { item: 'Bag of Holding', rarity: 'Uncommon', attunement: false, effect: 'Holds 500 lbs in extradimensional space.', rating: 'S', note: 'Carry everything. Essential utility item.' },
  { item: 'Winged Boots', rarity: 'Uncommon', attunement: true, effect: 'Fly speed = walking speed for 4 hours/day.', rating: 'S', note: 'Flight without concentration or spell slots. Game-changing mobility.' },
  { item: 'Amulet of Proof Against Detection', rarity: 'Uncommon', attunement: true, effect: 'Hidden from divination magic. Can\'t be targeted by it.', rating: 'A', note: 'Invisible to Scrying, Detect Magic, etc. Great for stealth campaigns.' },
  { item: 'Ring of Protection', rarity: 'Rare', attunement: true, effect: '+1 AC and saving throws.', rating: 'S', note: 'Same as Cloak of Protection. Both stack if different slots.' },
  { item: 'Stone of Good Luck (Luckstone)', rarity: 'Uncommon', attunement: true, effect: '+1 to ability checks and saving throws.', rating: 'A', note: '+1 to all checks and saves. Subtle but powerful.' },
];

export const BEST_ITEMS_BY_CLASS = [
  { class: 'Fighter', items: ['+1/+2/+3 weapon', 'Belt of Giant Strength', 'Gauntlets of Ogre Power', 'Adamantine Armor'], note: 'Weapon and STR enhancement. Adamantine for crit immunity.' },
  { class: 'Barbarian', items: ['Belt of Giant Strength', 'Amulet of Health', 'Berserker Axe', 'Bracers of Defense'], note: 'Belt of Giant Strength lets you max CON instead of STR.' },
  { class: 'Rogue', items: ['Cloak of Elvenkind', 'Boots of Elvenkind', 'Gloves of Thievery', '+1 weapon'], note: 'Stealth items + Gloves of Thievery (+5 to Sleight of Hand + lockpicking).' },
  { class: 'Wizard', items: ['Pearl of Power', 'Staff of the Magi', 'Robe of the Archmagi', 'Headband of Intellect'], note: 'Pearl of Power recovers a slot. Staff of the Magi is endgame.' },
  { class: 'Cleric', items: ['+1 shield', 'Amulet of the Devout', 'Staff of Healing', 'Pearl of Power'], note: 'Amulet of the Devout: +DC, +attack, free Channel Divinity.' },
  { class: 'Paladin', items: ['Holy Avenger', 'Belt of Giant Strength', '+1/+2 shield', 'Amulet of the Devout'], note: 'Holy Avenger is the ultimate Paladin weapon.' },
  { class: 'Ranger', items: ['Bracers of Archery', '+1/+2 bow', 'Cloak of Elvenkind', 'Boots of Elvenkind'], note: 'Bracers of Archery: +2 damage with bows. Essential.' },
  { class: 'Warlock', items: ['Rod of the Pact Keeper', 'Eldritch Claw Tattoo', 'Amulet of Proof Against Detection'], note: 'Rod of the Pact Keeper: +DC, +attack, +1 slot/LR. Best Warlock item.' },
  { class: 'Sorcerer', items: ['Bloodwell Vial', 'Pearl of Power', 'Cloak of Protection', 'Staff of Power'], note: 'Bloodwell Vial: +DC/attack + free 5 SP on rolling HD.' },
  { class: 'Bard', items: ['Instrument of the Bards', 'Cloak of Protection', 'Pearl of Power'], note: 'Instruments: +DC, auto-fail charm saves, free spells.' },
  { class: 'Druid', items: ['Staff of the Woodlands', 'Pearl of Power', 'Cloak of Protection', 'Moon Sickle'], note: 'Moon Sickle: +DC/attack + bonus d4 on healing.' },
  { class: 'Monk', items: ['Bracers of Defense', 'Insignia of Claws', 'Cloak of Protection', 'Ring of Protection'], note: 'Insignia of Claws: +1 to unarmed attacks/damage. Essential.' },
  { class: 'Artificer', items: ['All-Purpose Tool', 'Bag of Holding', 'Headband of Intellect', 'Gauntlets of Ogre Power'], note: 'All-Purpose Tool: +DC/attack + any cantrip for a day.' },
];

export const ITEMS_FOR_CONCENTRATION = [
  { item: 'Amulet of Proof Against Detection', effect: 'Can\'t be targeted by divination. Indirect help.', rating: 'B' },
  { item: 'Cloak of Protection', effect: '+1 to CON saves for concentration.', rating: 'A' },
  { item: 'Ring of Protection', effect: '+1 to CON saves. Stacks with Cloak.', rating: 'A' },
  { item: 'Stone of Good Luck', effect: '+1 to saves (including concentration).', rating: 'A' },
  { item: 'Periapt of Wound Closure', effect: 'Stabilize automatically. Double HD healing. Helps stay conscious to keep concentration.', rating: 'B' },
];

export function attunementSlotsRemaining(currentAttuned) {
  return 3 - currentAttuned; // default max 3
}

export function itemPriceRange(rarity) {
  const ranges = {
    common: { min: 50, max: 100 },
    uncommon: { min: 101, max: 500 },
    rare: { min: 501, max: 5000 },
    veryRare: { min: 5001, max: 50000 },
    legendary: { min: 50001, max: 200000 },
  };
  return ranges[rarity] || { min: 0, max: 0 };
}
