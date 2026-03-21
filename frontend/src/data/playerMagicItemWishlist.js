/**
 * playerMagicItemWishlist.js
 * Player Mode: Magic item wishlists by class and priority
 * Pure JS — no React dependencies.
 */

export const CLASS_WISHLISTS = {
  Barbarian: [
    { item: 'Belt of Giant Strength', rarity: 'Very Rare+', reason: 'STR 21-29. Your main stat goes through the roof.', priority: 1 },
    { item: 'Berserker Axe', rarity: 'Rare', reason: '+1, extra 1d6 slashing on hit. Curse forces you to fight (Barbarian loves this).', priority: 2 },
    { item: 'Cloak of Protection', rarity: 'Uncommon', reason: '+1 AC and saves. Great since you have no armor.', priority: 3 },
    { item: 'Bracers of Defense', rarity: 'Rare', reason: '+2 AC while unarmored. Stacks with Unarmored Defense.', priority: 2 },
    { item: 'Boots of Speed', rarity: 'Rare', reason: 'Double speed for 10 minutes. Close distance instantly.', priority: 3 },
  ],
  Fighter: [
    { item: '+1/+2/+3 Weapon', rarity: 'Uncommon-Very Rare', reason: 'Straightforward damage increase. Applies to EVERY attack.', priority: 1 },
    { item: 'Adamantine Armor', rarity: 'Uncommon', reason: 'Crits become normal hits. Huge for a tanky fighter.', priority: 2 },
    { item: 'Gauntlets of Ogre Power', rarity: 'Uncommon', reason: 'STR 19. Lets you dump STR and focus DEX/CON.', priority: 2 },
    { item: 'Winged Boots', rarity: 'Uncommon', reason: 'Flying speed = reach any enemy. Melee fighter\'s dream.', priority: 2 },
    { item: 'Flame Tongue', rarity: 'Rare', reason: '+2d6 fire on hit. With Extra Attack and Action Surge = devastating.', priority: 1 },
  ],
  Wizard: [
    { item: 'Arcane Grimoire', rarity: 'Uncommon-Very Rare', reason: '+1/+2/+3 to spell attacks AND save DCs. The best wizard item.', priority: 1 },
    { item: 'Cloak of Protection', rarity: 'Uncommon', reason: '+1 AC and saves. You need every AC point you can get.', priority: 2 },
    { item: 'Pearl of Power', rarity: 'Uncommon', reason: 'Regain a spell slot (up to 3rd level) once per day.', priority: 2 },
    { item: 'Staff of Power', rarity: 'Very Rare', reason: '+2 AC, attacks, saves, spell DCs. Extra spell slots. Retributive Strike.', priority: 1 },
    { item: 'Robe of the Archmagi', rarity: 'Legendary', reason: 'AC 15 + DEX, +2 spell save DC, advantage on saves vs magic.', priority: 1 },
  ],
  Cleric: [
    { item: 'Amulet of the Devout', rarity: 'Uncommon-Very Rare', reason: '+1/+2/+3 spell attacks and save DCs. Extra Channel Divinity use.', priority: 1 },
    { item: '+1 Shield', rarity: 'Uncommon', reason: 'AC 20+ with heavy armor. Simple and effective.', priority: 2 },
    { item: 'Periapt of Wound Closure', rarity: 'Uncommon', reason: 'Stabilize at 0 HP automatically. Double hit dice healing.', priority: 3 },
    { item: 'Ring of Spell Storing', rarity: 'Rare', reason: 'Store Cure Wounds for allies to use. Or pre-load Spirit Guardians.', priority: 1 },
    { item: 'Staff of Healing', rarity: 'Rare', reason: 'Extra healing spells without using your own slots.', priority: 2 },
  ],
  Rogue: [
    { item: '+1/+2/+3 Weapon', rarity: 'Uncommon-Very Rare', reason: 'Ensures hit = Sneak Attack damage. Every hit matters more for Rogue.', priority: 1 },
    { item: 'Cloak of Elvenkind', rarity: 'Uncommon', reason: 'Advantage on Stealth. Stealth is your lifeline.', priority: 1 },
    { item: 'Boots of Elvenkind', rarity: 'Uncommon', reason: 'Advantage on Stealth (silent movement). Stacks with Cloak!', priority: 2 },
    { item: 'Winged Boots', rarity: 'Uncommon', reason: 'Fly = always can position for Sneak Attack.', priority: 2 },
    { item: 'Gloves of Thievery', rarity: 'Uncommon', reason: '+5 to Sleight of Hand and lock picking. Incredible.', priority: 2 },
  ],
};

export const UNIVERSAL_MUST_HAVES = [
  { item: 'Cloak of Protection', rarity: 'Uncommon', reason: '+1 AC and all saves. Good on literally everyone.' },
  { item: 'Ring of Protection', rarity: 'Rare', reason: '+1 AC and all saves. Stacks with Cloak.' },
  { item: 'Bag of Holding', rarity: 'Uncommon', reason: 'Carry 500 lbs in a 15 lb bag. Solves encumbrance forever.' },
  { item: 'Winged Boots', rarity: 'Uncommon', reason: 'Flight for anyone. Game-changing mobility.' },
  { item: 'Headband of Intellect', rarity: 'Uncommon', reason: 'INT 19. Great for non-INT classes for checks.' },
];

export function getWishlist(className) {
  return CLASS_WISHLISTS[className] || [];
}

export function getTopPriority(className) {
  const list = CLASS_WISHLISTS[className] || [];
  return list.filter(i => i.priority === 1);
}

export function getAllItemsByRarity(rarity) {
  const all = [];
  Object.values(CLASS_WISHLISTS).forEach(list => {
    list.forEach(item => {
      if (item.rarity.toLowerCase().includes((rarity || '').toLowerCase())) {
        all.push(item);
      }
    });
  });
  return all;
}
