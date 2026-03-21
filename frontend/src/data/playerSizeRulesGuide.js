/**
 * playerSizeRulesGuide.js
 * Player Mode: Creature size rules — space, grapple, equipment, and interactions
 * Pure JS — no React dependencies.
 */

export const SIZE_CATEGORIES = [
  { size: 'Tiny', space: '2.5 x 2.5 ft', examples: 'Familiar (owl, cat), sprite, pixie', carryMultiplier: 'x0.5', note: 'Can occupy another creature\'s space.' },
  { size: 'Small', space: '5 x 5 ft', examples: 'Halfling, Gnome, Goblin, Kobold', carryMultiplier: 'x1', note: 'Same space as Medium. Some weapon restrictions.' },
  { size: 'Medium', space: '5 x 5 ft', examples: 'Human, Elf, Dwarf, Half-Orc', carryMultiplier: 'x1', note: 'Standard PC size. Most equipment designed for Medium.' },
  { size: 'Large', space: '10 x 10 ft', examples: 'Horse, Ogre, Giant Spider', carryMultiplier: 'x2', note: 'Can mount. Weapons deal extra dice (monster stat blocks).' },
  { size: 'Huge', space: '15 x 15 ft', examples: 'Giant, Treant, Young Dragon', carryMultiplier: 'x4', note: 'Controls massive area. Hard to grapple.' },
  { size: 'Gargantuan', space: '20 x 20 ft+', examples: 'Ancient Dragon, Tarrasque, Kraken', carryMultiplier: 'x8', note: 'Enormous. Can\'t grapple unless you\'re Huge+.' },
];

export const SIZE_INTERACTIONS = {
  grapple: {
    rule: 'You can grapple a creature up to one size larger than you.',
    example: 'Medium PC can grapple Large. Can\'t grapple Huge+ without Enlarge.',
    enlarge: 'Enlarge spell makes you Large. Can now grapple Huge creatures.',
    note: 'Rune Knight Fighter grows to Large (L3) or Huge (L18).',
  },
  mounting: {
    rule: 'Mount must be at least one size larger than the rider.',
    example: 'Medium PC needs Large+ mount (horse). Small PC can ride Medium (mastiff).',
    note: 'Small races have more mount options. Halfling on a mastiff.',
  },
  squeezing: {
    rule: 'Can squeeze through a space one size smaller than your size.',
    penalty: 'Disadvantage on attacks and DEX saves. Attacks against you have advantage.',
    speed: 'Every foot of movement costs 1 extra foot.',
    note: 'Medium can squeeze through 2.5ft space. Tight but possible.',
  },
  movingThrough: {
    rule: 'Can move through a hostile creature\'s space if it\'s 2+ sizes different.',
    example: 'Medium PC can move through Huge+ creature\'s space.',
    note: 'Counts as difficult terrain.',
  },
};

export const SMALL_RACE_RULES = {
  heavyWeapons: 'Small creatures have disadvantage with Heavy weapons (greatsword, glaive, greataxe, heavy crossbow, longbow, maul, pike).',
  mounts: 'Small creatures can ride Medium mounts (mastiff, pony).',
  advantage: 'More mount options. Easier to hide. Fit through smaller spaces.',
  disadvantage: 'Can\'t use Heavy weapons effectively without workaround.',
  workaround: 'Use non-Heavy weapons: rapier, shortbow, hand crossbow, longsword (versatile).',
  note: 'Small race penalty is minor. Non-Heavy weapons are still excellent.',
};

export const ENLARGE_REDUCE = {
  enlarge: {
    sizeChange: 'One size larger (Medium → Large).',
    weaponDamage: '+1d4 to weapon damage.',
    advantage: 'Advantage on STR checks and saves.',
    carrying: 'Double carrying capacity.',
    duration: '1 minute (concentration).',
    note: 'Become Large. Grapple Huge creatures. +1d4 damage.',
  },
  reduce: {
    sizeChange: 'One size smaller (Medium → Small).',
    weaponDamage: '-1d4 to weapon damage.',
    disadvantage: 'Disadvantage on STR checks and saves.',
    carrying: 'Half carrying capacity.',
    duration: '1 minute (concentration).',
    note: 'Become Small. Fit through tight spaces. Reduced damage.',
  },
};

export const SIZE_TIPS = [
  'Grapple: can grapple one size larger. Enlarge to grapple bigger.',
  'Small races: disadvantage with Heavy weapons. Use rapier/shortbow instead.',
  'Small races: more mount options. Ride a mastiff or wolf.',
  'Squeeze: move through one size smaller. Disadvantage on attacks.',
  'Enlarge: +1d4 damage, advantage on STR, grapple Huge creatures.',
  'Move through hostile space if 2+ sizes different. Difficult terrain.',
  'Rune Knight: grow to Large at L3. Grapple Huge enemies.',
  'Mounting: mount must be one size larger than rider.',
  'Tiny creatures can share your space. Familiar sits on your shoulder.',
  'Gargantuan creatures control 20x20ft+. Respect the space.',
];
