/**
 * playerMagicItemIdentification.js
 * Player Mode: How to identify magic items and their properties
 * Pure JS — no React dependencies.
 */

export const IDENTIFICATION_METHODS = [
  {
    method: 'Identify Spell (1st)',
    time: '1 minute (ritual)',
    cost: 'Free (ritual) or 1st level slot',
    reveals: 'All magical properties, how to use them, charges, whether it requires attunement, and whether it is cursed (DM discretion on curse reveal).',
    note: 'RAW, Identify does NOT reveal curses. Many DMs house-rule that it does.',
  },
  {
    method: 'Short Rest (Focus)',
    time: '1 short rest',
    cost: 'None',
    reveals: 'All magical properties and how to use them, including attunement requirements.',
    note: 'Spend the short rest focusing on the item. Same result as Identify without the spell.',
  },
  {
    method: 'Detect Magic (1st)',
    time: '1 action (ritual)',
    cost: 'Free (ritual) or 1st level slot',
    reveals: 'Whether the item is magical and its school of magic. Does NOT reveal specific properties.',
    note: 'Good first step to determine if an item is worth investigating further.',
  },
  {
    method: 'Arcana Check',
    time: 'Varies (DM discretion)',
    cost: 'None',
    reveals: 'DM determines what you learn based on the check result.',
    note: 'Not RAW for item identification, but many DMs allow it.',
  },
  {
    method: 'Attunement (Short Rest)',
    time: '1 short rest',
    cost: 'Uses an attunement slot',
    reveals: 'All properties revealed upon attuning. Also activates the item.',
    note: 'Risky with cursed items — attuning may bind the curse to you.',
  },
];

export const MAGIC_ITEM_CATEGORIES = [
  { category: 'Armor', attunement: 'Usually yes', examples: '+1/+2/+3 armor, Adamantine, Mithral, Glamoured Studded Leather' },
  { category: 'Weapons', attunement: 'Usually yes', examples: '+1/+2/+3 weapons, Flame Tongue, Vorpal Sword, Sun Blade' },
  { category: 'Potions', attunement: 'Never', examples: 'Healing, Invisibility, Flying, Giant Strength, Speed' },
  { category: 'Rings', attunement: 'Usually yes', examples: 'Ring of Protection, Ring of Spell Storing, Ring of Invisibility' },
  { category: 'Rods', attunement: 'Usually yes', examples: 'Rod of the Pact Keeper, Immovable Rod, Rod of Absorption' },
  { category: 'Scrolls', attunement: 'Never', examples: 'Spell Scrolls (all levels), Scroll of Protection' },
  { category: 'Staffs', attunement: 'Usually yes', examples: 'Staff of Fire, Staff of Power, Staff of the Magi' },
  { category: 'Wands', attunement: 'Usually yes', examples: 'Wand of Fireballs, Wand of the War Mage, Wand of Magic Missiles' },
  { category: 'Wondrous Items', attunement: 'Varies', examples: 'Bag of Holding, Cloak of Protection, Boots of Elvenkind' },
];

export const CURSED_ITEM_SIGNS = [
  'The item seems too good for the circumstances (found randomly in a low-level dungeon).',
  'Identify didn\'t reveal the full picture (DM seemed evasive).',
  'The item has a dark or unsettling aesthetic.',
  'The NPC selling it was unusually eager to part with it.',
  'Remove Curse (3rd level) typically removes most curses. Greater Restoration for worse ones.',
];

export function getIdentificationMethod(method) {
  return IDENTIFICATION_METHODS.find(m => m.method.toLowerCase().includes((method || '').toLowerCase())) || null;
}

export function canIdentifyWithout(hasIdentifySpell, hasShortRestTime) {
  if (hasIdentifySpell) return 'Cast Identify (1 minute ritual).';
  if (hasShortRestTime) return 'Spend a short rest focusing on the item.';
  return 'You need either the Identify spell or a short rest to identify this item.';
}
