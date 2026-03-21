/**
 * playerMagicItemCursed.js
 * Player Mode: Cursed item identification and handling
 * Pure JS — no React dependencies.
 */

export const COMMON_CURSED_ITEMS = [
  { item: 'Berserker Axe', curse: 'Must attack nearest creature each turn. Can\'t voluntarily let go of the axe.', benefit: '+1 weapon, +1 HP per level.', removal: 'Remove Curse (3rd).' },
  { item: 'Armor of Vulnerability', curse: 'Vulnerability to one damage type (bludgeoning, piercing, or slashing).', benefit: 'Resistance to the other two types.', removal: 'Remove Curse (3rd).' },
  { item: 'Shield of Missile Attraction', curse: 'Ranged attacks against anyone within 10ft target YOU instead.', benefit: 'Resistance to ranged weapon damage.', removal: 'Remove Curse (3rd).' },
  { item: 'Sword of Vengeance', curse: 'Can\'t let go of it. On taking damage, WIS save or attack the creature that damaged you.', benefit: '+1 weapon.', removal: 'Remove Curse (3rd).' },
  { item: 'Demon Armor', curse: 'Can\'t remove it. Disadvantage on attacks and saves vs demons.', benefit: 'Plate armor +1, unarmed strikes deal 1d8.', removal: 'Remove Curse (3rd).' },
  { item: 'Necklace of Strangulation', curse: 'Once worn, can\'t be removed. Constricts, dealing 6d6 strangling damage per round.', benefit: 'Appears to be Necklace of Adaptation.', removal: 'Remove Curse, then destroy it.' },
  { item: 'Bag of Devouring', curse: 'Resembles Bag of Holding. Has a 50% chance of swallowing anything placed inside.', benefit: 'None. It\'s a trap.', removal: 'Destroy the bag.' },
  { item: 'Ring of Clumsiness', curse: '-2 DEX. Appears to be Ring of Protection.', benefit: 'None.', removal: 'Remove Curse (3rd).' },
];

export const CURSE_DETECTION = [
  'Identify spell does NOT reliably reveal curses (DM discretion, RAW it doesn\'t).',
  'Attunement reveals curse effects — but by then you\'re stuck.',
  'Legend Lore (5th) or Contact Other Plane (5th) may reveal curse history.',
  'Detect Magic shows the item is magical but not that it\'s cursed.',
  'If the DM describes an item as "suspiciously beneficial," be cautious.',
  'An appraiser or sage NPC might know the item\'s history.',
];

export const CURSE_REMOVAL = [
  { method: 'Remove Curse (3rd)', effect: 'Breaks attunement to a cursed item. You can then discard it.', note: 'Does NOT destroy the curse — someone else can pick it up.' },
  { method: 'Greater Restoration (5th)', effect: 'Removes more powerful curses.', note: 'Required for some homebrew or advanced curses.' },
  { method: 'Wish (9th)', effect: 'Can permanently destroy any curse.', note: 'Overkill for most curses but guaranteed.' },
  { method: 'Divine Intervention', effect: 'Cleric feature. DM decides if the deity helps.', note: 'Thematic for religious characters.' },
  { method: 'Quest/Ritual', effect: 'Some curses require a specific quest or ritual to break.', note: 'DM-driven. Great story hooks.' },
];

export function getCursedItemInfo(itemName) {
  return COMMON_CURSED_ITEMS.find(i => i.item.toLowerCase().includes((itemName || '').toLowerCase())) || null;
}

export function isSuspiciouslyCheap(itemRarity, price) {
  const minPrices = { Common: 50, Uncommon: 100, Rare: 500, 'Very Rare': 5000, Legendary: 50000 };
  const min = minPrices[itemRarity] || 0;
  return price < min * 0.3; // less than 30% of minimum = suspicious
}
