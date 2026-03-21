/**
 * playerSizeRules.js
 * Player Mode: Size categories, how size affects combat, and enlarge/reduce interactions
 * Pure JS — no React dependencies.
 */

export const SIZE_CATEGORIES = [
  { size: 'Tiny', space: '2.5 × 2.5 ft', examples: 'Familiars, pixies, sprites, pseudodragons', grapple: 'Can be grappled by Small+' },
  { size: 'Small', space: '5 × 5 ft', examples: 'Gnomes, halflings, goblins, kobolds', grapple: 'Can grapple Medium or smaller' },
  { size: 'Medium', space: '5 × 5 ft', examples: 'Humans, elves, dwarves, orcs', grapple: 'Can grapple Large or smaller' },
  { size: 'Large', space: '10 × 10 ft', examples: 'Ogres, horses, dire wolves', grapple: 'Can grapple Huge or smaller' },
  { size: 'Huge', space: '15 × 15 ft', examples: 'Giants, treants, young dragons', grapple: 'Can grapple Gargantuan or smaller' },
  { size: 'Gargantuan', space: '20 × 20 ft or more', examples: 'Ancient dragons, tarrasque, kraken', grapple: 'Can grapple anything' },
];

export const SIZE_COMBAT_EFFECTS = {
  heavyWeapons: 'Small creatures have disadvantage with Heavy weapons (greatsword, maul, glaive, etc.).',
  grappling: 'You can grapple a creature up to ONE size larger than you. Larger than that? Can\'t grapple.',
  shoving: 'Same as grappling: can shove creatures up to one size larger.',
  mounting: 'Your mount must be at least one size larger than you.',
  squeezing: 'A creature can squeeze through a space one size smaller. Cost: double movement, disadvantage on attacks/DEX saves, advantage against you.',
  cover: 'A creature one size larger than you can provide half cover.',
};

export const ENLARGE_REDUCE = {
  enlarge: {
    spell: 'Enlarge/Reduce (2nd level)',
    effect: 'Target grows one size category. Advantage on STR checks and saves. +1d4 damage on weapon attacks.',
    duration: 'Concentration, 1 minute',
    combos: [
      'Enlarged Barbarian with Reckless Attack: advantage on STR attacks + extra 1d4 damage',
      'Enlarged grappler: can now grapple creatures 2 sizes larger',
      'Enlarged with reach weapon: control a massive area',
    ],
    note: 'Weapons and equipment grow with you. Greatsword goes from 2d6 to 2d6+1d4.',
  },
  reduce: {
    effect: 'Target shrinks one size. Disadvantage on STR checks and saves. -1d4 damage on weapon attacks.',
    offensiveUse: 'Cast on an enemy to weaken their attacks and STR saves. Makes them easier to grapple.',
    combos: [
      'Reduce an enemy before grappling: Medium becomes Small, much easier to control',
      'Reduce a Large enemy blocking a corridor to Medium: party can pass',
      'Reduce + shove prone: enemy has disadvantage on Athletics to resist',
    ],
  },
};

export const RUNE_KNIGHT = {
  class: 'Fighter (Rune Knight)',
  feature: 'Giant\'s Might',
  effect: 'Become Large as a bonus action. +1d6 damage once per turn. Advantage on STR checks and saves.',
  scaling: 'At level 18: become Huge instead of Large.',
  combos: [
    'Large size + reach weapon = 15ft+ threat range',
    'Large size can grapple Huge creatures',
    'Bonus damage stacks with GWM for massive hits',
  ],
};

export const SIZE_INTERACTIONS = [
  { interaction: 'Polymorph and size', detail: 'Giant Ape is Huge. T-Rex is Huge. Size matters for what you can fit through.' },
  { interaction: 'Wild Shape sizes', detail: 'Moon Druid can turn into Large creatures. More HP, more space control.' },
  { interaction: 'Summon sizes', detail: 'Conjured creatures have their listed sizes. 8 Medium wolves take a LOT of space.' },
  { interaction: 'Teleportation and size', detail: 'Dimension Door: you + one willing creature you touch (regardless of size). Misty Step: only you.' },
  { interaction: 'Difficult terrain from size', detail: 'Large+ creatures can often step over small obstacles that would be difficult terrain for Small/Medium.' },
];

export const SMALL_RACE_TIPS = [
  'You CAN use most weapons normally. Only Heavy weapons give disadvantage.',
  'You can ride Medium creatures (like a mastiff) as mounts.',
  'Hide behind Medium allies with Halfling Naturally Stealthy.',
  'Squeezing through smaller spaces is easier for you.',
  'Some spells reference size: you\'re valid for more summoning/polymorphing targets.',
  'Use DEX weapons (rapiers, shortswords) instead of Heavy weapons.',
];

export function canGrapple(grapperSize, targetSize) {
  const sizes = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
  const gIdx = sizes.indexOf(grapperSize);
  const tIdx = sizes.indexOf(targetSize);
  return tIdx <= gIdx + 1;
}

export function squeezeSpace(normalSize) {
  const spaces = { Tiny: '1.25', Small: '2.5', Medium: '2.5', Large: '5', Huge: '10', Gargantuan: '15' };
  return spaces[normalSize] || '5';
}

export function enlargedSize(currentSize) {
  const order = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
  const idx = order.indexOf(currentSize);
  return idx < order.length - 1 ? order[idx + 1] : 'Gargantuan';
}
