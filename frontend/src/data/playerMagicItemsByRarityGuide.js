/**
 * playerMagicItemsByRarityGuide.js
 * Player Mode: Best magic items at each rarity tier
 * Pure JS — no React dependencies.
 */

export const COMMON_ITEMS = [
  { item: 'Cloak of Many Fashions', type: 'Wondrous', effect: 'Change cloak appearance at will.', rating: 'A (RP)', note: 'Best common item for roleplay. Disguise without a spell.' },
  { item: 'Hat of Wizardry', type: 'Wondrous', effect: 'Arcane focus + one free Wizard cantrip.', rating: 'A', note: 'Free cantrip from the Wizard list. Prestidigitation, Mending, etc.' },
  { item: 'Moon-Touched Sword', type: 'Weapon', effect: 'Sheds light. Counts as magical for resistance bypass.', rating: 'A', note: 'Bypasses nonmagical resistance at common rarity. Essential for martials.' },
  { item: 'Unbreakable Arrow', type: 'Ammo', effect: 'Can\'t be destroyed. Reusable.', rating: 'B', note: 'Infinite ammo with recovery. Niche but nice.' },
  { item: 'Clockwork Amulet', type: 'Wondrous', effect: 'Once per day: take 10 on attack roll instead of rolling.', rating: 'A', note: 'Guaranteed hit against moderate AC. Great for GWM/SS.' },
];

export const UNCOMMON_ITEMS = [
  { item: 'Cloak of Protection', type: 'Wondrous', attune: true, effect: '+1 AC and saving throws.', rating: 'S', note: 'Best uncommon item. Universal. +1 AC and +1 all saves is incredible.' },
  { item: '+1 Weapon', type: 'Weapon', attune: false, effect: '+1 to attack and damage.', rating: 'S', note: 'Consistent DPR increase. Bypasses nonmagical resistance.' },
  { item: 'Bag of Holding', type: 'Wondrous', attune: false, effect: '500 lbs of storage in a small bag.', rating: 'S', note: 'Solve inventory management forever.' },
  { item: 'Winged Boots', type: 'Wondrous', attune: true, effect: 'Fly speed = walk speed, 4 hours/day.', rating: 'S', note: 'Flight at uncommon. Game-changing.' },
  { item: 'Gauntlets of Ogre Power', type: 'Wondrous', attune: true, effect: 'STR becomes 19.', rating: 'A+', note: 'Free up ASIs for CHA/DEX. Best for CHA-based melee (Hexblade, Paladin).' },
  { item: 'Pearl of Power', type: 'Wondrous', attune: true, effect: 'Recover one L1-3 spell slot per day.', rating: 'A+', note: 'Free spell slot. Best on full casters.' },
  { item: 'Amulet of Proof Against Detection', type: 'Wondrous', attune: true, effect: 'Immune to divination magic. Can\'t be targeted by divination.', rating: 'A', note: 'Niche but campaign-breaking against scrying enemies.' },
  { item: 'Headband of Intellect', type: 'Wondrous', attune: true, effect: 'INT becomes 19.', rating: 'A', note: 'Best on non-INT characters. Makes anyone a decent Arcana/Investigation user.' },
];

export const RARE_ITEMS = [
  { item: '+2 Weapon', type: 'Weapon', attune: false, effect: '+2 to attack and damage.', rating: 'S', note: 'Major DPR increase. Reliable.' },
  { item: 'Amulet of Health', type: 'Wondrous', attune: true, effect: 'CON becomes 19.', rating: 'S', note: 'HP boost + better CON saves. Best on low-CON casters.' },
  { item: 'Belt of Giant Strength (Hill)', type: 'Wondrous', attune: true, effect: 'STR becomes 21.', rating: 'S', note: 'STR 21. Beyond natural limits. Best for grapplers and STR builds.' },
  { item: 'Ring of Protection', type: 'Ring', attune: true, effect: '+1 AC and saving throws.', rating: 'S', note: 'Same as Cloak of Protection. Stacks with it (different item).' },
  { item: 'Staff of the Woodlands', type: 'Staff', attune: true, effect: '+2 focus, several free spells, Pass Without Trace.', rating: 'S', note: 'Best Druid staff. Free spells daily.' },
  { item: 'Mantle of Spell Resistance', type: 'Wondrous', attune: true, effect: 'Advantage on saves vs spells.', rating: 'S', note: 'Advantage on ALL spell saves. Incredible defensive item.' },
  { item: 'Flame Tongue', type: 'Weapon', attune: true, effect: 'Command word: +2d6 fire damage per hit.', rating: 'A+', note: 'Massive damage increase. 2d6 per hit × multiple attacks.' },
];

export const VERY_RARE_ITEMS = [
  { item: '+3 Weapon', type: 'Weapon', attune: false, effect: '+3 to attack and damage.', rating: 'S', note: 'Best-in-slot for most martials.' },
  { item: 'Staff of Power', type: 'Staff', attune: true, effect: '+2 AC, +2 saves, +2 spell attacks, multiple spells.', rating: 'S+', note: 'Best caster item in the game. Everything a Wizard/Sorcerer wants.' },
  { item: 'Cloak of Displacement', type: 'Wondrous', attune: true, effect: 'Disadvantage on attacks against you. Resets if not hit.', rating: 'S', note: 'Pseudo-permanent disadvantage. Incredible tank item.' },
  { item: 'Belt of Giant Strength (Fire)', type: 'Wondrous', attune: true, effect: 'STR becomes 25.', rating: 'S', note: 'STR 25. Absurd for any martial.' },
  { item: 'Tome of Clear Thought', type: 'Wondrous', attune: false, effect: '+2 INT permanently (increases max).', rating: 'S', note: 'Permanent stat increase beyond 20. Consumed on use.' },
  { item: 'Animated Shield', type: 'Shield', attune: true, effect: '+2 AC, no hand needed.', rating: 'A+', note: 'Shield AC bonus with both hands free. GWM + shield AC.' },
];

export const LEGENDARY_ITEMS = [
  { item: 'Holy Avenger', type: 'Weapon', attune: true, effect: '+3, extra 2d10 vs undead/fiends, advantage on saves vs spells in 10ft aura.', rating: 'S+', note: 'Best Paladin weapon. Period.' },
  { item: 'Vorpal Sword', type: 'Weapon', attune: true, effect: '+3, nat 20 = decapitation (instant kill if applicable).', rating: 'S', note: 'Instant kill on crits vs non-immune creatures.' },
  { item: 'Belt of Storm Giant Strength', type: 'Wondrous', attune: true, effect: 'STR becomes 29.', rating: 'S', note: 'Near-maximum strength possible.' },
  { item: 'Ring of Three Wishes', type: 'Ring', attune: false, effect: '3 castings of Wish.', rating: 'S+', note: 'Three Wishes. Campaign-defining.' },
  { item: 'Robe of the Archmagi', type: 'Wondrous', attune: true, effect: 'AC 15+DEX, advantage on spell saves, +2 spell DC and attacks.', rating: 'S+', note: 'Best caster armor. +2 DC is insane.' },
  { item: 'Luck Blade', type: 'Weapon', attune: true, effect: '+1 weapon, +1 saves, 1d4-1 Wishes.', rating: 'S+', note: 'Random Wish charges. +1 everything.' },
];

export const BEST_ITEMS_BY_CLASS = {
  fighter: ['+X Weapon', 'Belt of Giant Strength', 'Cloak of Displacement'],
  rogue: ['Cloak of Elvenkind', 'Winged Boots', 'Cloak of Displacement'],
  wizard: ['Staff of Power', 'Robe of the Archmagi', 'Amulet of Health'],
  cleric: ['Staff of Healing', '+X Shield', 'Amulet of Health'],
  paladin: ['Holy Avenger', 'Belt of Giant Strength', '+X Weapon'],
  barbarian: ['Belt of Giant Strength', '+X Weapon', 'Cloak of Displacement'],
  ranger: ['+X Weapon (bow)', 'Cloak of Elvenkind', 'Bracers of Archery'],
  warlock: ['Rod of the Pact Keeper', 'Amulet of Health', 'Cloak of Protection'],
  sorcerer: ['Bloodwell Vial', 'Amulet of Health', 'Staff of Power'],
  bard: ['Instrument of the Bards', 'Cloak of Protection', 'Amulet of Health'],
  druid: ['Staff of the Woodlands', 'Amulet of Health', '+X Shield'],
  monk: ['Insignia of Claws', 'Cloak of Displacement', 'Amulet of Health'],
  artificer: ['All Creation Hammer', 'Amulet of Health', '+X Weapon'],
};
