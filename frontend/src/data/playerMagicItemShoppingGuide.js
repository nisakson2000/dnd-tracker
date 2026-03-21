/**
 * playerMagicItemShoppingGuide.js
 * Player Mode: Best magic items by rarity — what to prioritize and seek
 * Pure JS — no React dependencies.
 */

export const UNCOMMON_MUST_HAVES = [
  { item: 'Cloak of Protection', attune: true, rating: 'S+', note: '+1 AC + all saves. Best uncommon.' },
  { item: 'Bag of Holding', attune: false, rating: 'S', note: '500 lbs. Party staple.' },
  { item: 'Weapon +1', attune: false, rating: 'S', note: '+1 hit/damage. No attunement.' },
  { item: 'Winged Boots', attune: true, rating: 'S+', note: 'Flight. Best mobility item.' },
  { item: 'Pearl of Power', attune: true, rating: 'A+', note: 'Free L1-3 slot daily.' },
  { item: 'Weapon of Warning', attune: true, rating: 'S', note: 'Advantage initiative. No surprise.' },
  { item: 'Broom of Flying', attune: false, rating: 'S', note: 'Flight. No attunement. No limit.' },
];

export const RARE_MUST_HAVES = [
  { item: 'Weapon +2', attune: false, rating: 'S+', note: '+2 hit/damage.' },
  { item: 'Ring of Protection', attune: true, rating: 'S+', note: '+1 AC + saves. Stack with Cloak.' },
  { item: 'Amulet of Health', attune: true, rating: 'S', note: 'CON 19. HP and concentration.' },
  { item: 'Flame Tongue', attune: true, rating: 'S', note: '+2d6 fire per hit.' },
  { item: 'Mantle of Spell Resistance', attune: true, rating: 'S+', note: 'Advantage vs spells.' },
];

export const VERY_RARE_MUST_HAVES = [
  { item: 'Weapon +3', attune: false, rating: 'S+', note: 'Maximum weapon enhancement.' },
  { item: 'Staff of Power', attune: true, rating: 'S+', note: '+2 AC/saves/attacks. Spells.' },
  { item: 'Holy Avenger', attune: true, rating: 'S+ (Paladin)', note: '+3. Expanded magic resist.' },
  { item: 'Animated Shield', attune: true, rating: 'S', note: '+2 AC hands-free.' },
];

export const ITEM_PRIORITY = {
  melee: ['Weapon +X', 'Belt of Giant Strength', 'Cloak of Protection'],
  ranged: ['Weapon +X', 'Bracers of Archery', 'Winged Boots'],
  caster: ['Cloak of Protection', 'Pearl of Power', 'Amulet of Health'],
  tank: ['Armor +X', 'Cloak + Ring of Protection', 'Amulet of Health'],
};

export const MAGIC_ITEM_TIPS = [
  'Cloak of Protection: best uncommon item in the game.',
  'Weapon +1: no attunement = free power.',
  'Attunement limit: 3 max. Prioritize carefully.',
  'Ring + Cloak of Protection: +2 AC + saves. Stack them.',
  'Pearl of Power: free spell slot. Any caster wants this.',
  'Winged Boots or Broom of Flying: mobility wins fights.',
  'Moon-Touched Sword: common magical weapon at L1.',
  'Bag of Holding: one per party minimum.',
  'Prioritize defense on squishy characters.',
  'Ask DM about item availability. Plant seeds early.',
];
