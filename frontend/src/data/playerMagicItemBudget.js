/**
 * playerMagicItemBudget.js
 * Player Mode: Magic item recommendations by level and priority
 * Pure JS — no React dependencies.
 */

export const MAGIC_ITEM_BY_TIER = {
  tier1: {
    levels: '1-4',
    budget: 'Common + Uncommon',
    mustHave: [
      { item: '+1 Weapon', rarity: 'Uncommon', why: 'Overcomes resistance to nonmagical damage. Most important item.' },
      { item: 'Cloak of Protection', rarity: 'Uncommon', why: '+1 AC and saves. Always useful.' },
      { item: 'Bag of Holding', rarity: 'Uncommon', why: 'Inventory management. 500 lbs in 15 lb bag.' },
      { item: 'Goggles of Night', rarity: 'Uncommon', why: '60ft darkvision. Essential for races without it.' },
      { item: 'Pearl of Power', rarity: 'Uncommon', why: 'Recover one spell slot (3rd or lower) per day.' },
    ],
  },
  tier2: {
    levels: '5-10',
    budget: 'Uncommon + Rare',
    mustHave: [
      { item: '+1 Armor/Shield', rarity: 'Rare', why: '+1 AC on top of base. Stacks with everything.' },
      { item: 'Ring of Protection', rarity: 'Rare', why: '+1 AC and saves. Stacks with Cloak of Protection.' },
      { item: 'Amulet of Health', rarity: 'Rare', why: 'Sets CON to 19. Massive HP boost + concentration saves.' },
      { item: 'Winged Boots', rarity: 'Uncommon', why: 'Flying speed for 4 hours/day. Game-changing mobility.' },
      { item: 'Gauntlets of Ogre Power', rarity: 'Uncommon', why: 'STR 19. Lets you dump STR and still grapple.' },
    ],
  },
  tier3: {
    levels: '11-16',
    budget: 'Rare + Very Rare',
    mustHave: [
      { item: '+2 Weapon', rarity: 'Rare', why: '+2 to hit AND damage. Significant accuracy boost.' },
      { item: 'Staff of Power', rarity: 'Very Rare', why: '+2 attacks/AC/saves. Bonus spells. Caster\'s dream.' },
      { item: 'Belt of Giant Strength', rarity: 'Very Rare', why: 'STR 23-25. Makes any character a melee powerhouse.' },
      { item: 'Mantle of Spell Resistance', rarity: 'Rare', why: 'Advantage on saves vs spells. Incredible defense.' },
      { item: 'Tome of Understanding/Leadership', rarity: 'Very Rare', why: 'Permanent +2 to an ability score. Beyond 20!' },
    ],
  },
  tier4: {
    levels: '17-20',
    budget: 'Very Rare + Legendary',
    mustHave: [
      { item: '+3 Weapon', rarity: 'Very Rare', why: 'Maximum accuracy. +3 to hit and damage.' },
      { item: 'Robe of the Archmagi', rarity: 'Legendary', why: 'AC 15 + DEX, advantage on saves vs spells, +2 spell DC.' },
      { item: 'Holy Avenger', rarity: 'Legendary', why: '+3 weapon, +2d10 radiant, allies get spell save aura.' },
      { item: 'Luck Blade', rarity: 'Legendary', why: '+1 weapon + 1d4+1 Wish charges. THE legendary item.' },
    ],
  },
};

export const ATTUNEMENT_PRIORITIES = [
  { priority: 1, category: 'Defensive', examples: ['+1/+2 armor', 'Cloak/Ring of Protection', 'Mantle of Spell Resistance'], reason: 'Staying alive > dealing more damage.' },
  { priority: 2, category: 'Offensive', examples: ['+1/+2 weapon', 'Staff of Power', 'Rod of the Pact Keeper'], reason: 'Accuracy and damage improvements.' },
  { priority: 3, category: 'Utility', examples: ['Winged Boots', 'Amulet of Health', 'Headband of Intellect'], reason: 'Situationally powerful. Context-dependent.' },
];

export function getRecommendedItems(level) {
  if (level <= 4) return MAGIC_ITEM_BY_TIER.tier1;
  if (level <= 10) return MAGIC_ITEM_BY_TIER.tier2;
  if (level <= 16) return MAGIC_ITEM_BY_TIER.tier3;
  return MAGIC_ITEM_BY_TIER.tier4;
}

export function getPriorityItems(level, slots) {
  const tier = getRecommendedItems(level);
  return tier.mustHave.slice(0, slots || 3);
}
