/**
 * playerMagicItemTypes.js
 * Player Mode: Magic item categories and identification
 * Pure JS — no React dependencies.
 */

export const MAGIC_ITEM_CATEGORIES = [
  { type: 'Armor', description: 'Magical armor with bonuses or special properties.', examples: ['+1 Chain Mail', 'Adamantine Armor', 'Armor of Resistance'] },
  { type: 'Potion', description: 'Magical liquid consumed for effect. Action to drink, bonus to administer.', examples: ['Potion of Healing', 'Potion of Invisibility', 'Potion of Speed'] },
  { type: 'Ring', description: 'Worn magic rings. Usually require attunement.', examples: ['Ring of Protection', 'Ring of Spell Storing', 'Ring of Invisibility'] },
  { type: 'Rod', description: 'Scepter-like items, often used by spellcasters.', examples: ['Rod of the Pact Keeper', 'Immovable Rod'] },
  { type: 'Scroll', description: 'One-use spell scrolls. Must be on your class spell list to use.', examples: ['Scroll of Fireball', 'Scroll of Revivify'] },
  { type: 'Staff', description: 'Can be wielded as quarterstaff. Often hold charges.', examples: ['Staff of Fire', 'Staff of Healing', 'Staff of the Magi'] },
  { type: 'Wand', description: 'Small magic rods, usually for spellcasters. Hold charges.', examples: ['Wand of Magic Missiles', 'Wand of Fireballs', 'Wand of the War Mage'] },
  { type: 'Weapon', description: 'Magical weapons with bonuses or special effects.', examples: ['+1 Longsword', 'Flame Tongue', 'Sun Blade'] },
  { type: 'Wondrous Item', description: 'Catch-all for other magic items.', examples: ['Bag of Holding', 'Cloak of Elvenkind', 'Boots of Speed'] },
];

export const SCROLL_RULES = {
  useRequirement: 'Spell must be on your class spell list.',
  spellLevel: 'If above your max spell slot, make ability check (DC 10 + spell level).',
  saveDC: [
    { level: 0, dc: 13, attack: 5 },
    { level: 1, dc: 13, attack: 5 },
    { level: 2, dc: 13, attack: 5 },
    { level: 3, dc: 15, attack: 7 },
    { level: 4, dc: 15, attack: 7 },
    { level: 5, dc: 17, attack: 9 },
    { level: 6, dc: 17, attack: 9 },
    { level: 7, dc: 18, attack: 10 },
    { level: 8, dc: 18, attack: 10 },
    { level: 9, dc: 19, attack: 11 },
  ],
};

export const IDENTIFICATION_METHODS = [
  { method: 'Identify spell', time: '1 minute (ritual: 11 minutes)', cost: 'None (ritual) or 1st level slot' },
  { method: 'Short rest study', time: '1 short rest', cost: 'None', note: 'Must be in physical contact throughout the rest.' },
  { method: 'Arcana check', time: 'Action', cost: 'None', note: 'DM may allow partial info on a successful check.' },
  { method: 'Detect Magic', time: '10 minutes (ritual)', cost: 'None (ritual)', note: 'Reveals presence and school of magic, not specific properties.' },
];

export function getScrollDC(spellLevel) {
  return SCROLL_RULES.saveDC.find(s => s.level === spellLevel) || null;
}

export function getItemCategory(type) {
  return MAGIC_ITEM_CATEGORIES.find(c => c.type.toLowerCase() === (type || '').toLowerCase()) || null;
}
