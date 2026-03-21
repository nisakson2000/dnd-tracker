/**
 * playerBestFightingStylesGuide.js
 * Player Mode: Fighting styles ranked — best choices by class and build
 * Pure JS — no React dependencies.
 */

export const FIGHTING_STYLES = [
  { style: 'Archery', bonus: '+2 ranged attacks', rating: 'S+', note: 'Best style. +10% accuracy.' },
  { style: 'Dueling', bonus: '+2 one-handed damage', rating: 'S', note: 'Sword + shield staple.' },
  { style: 'Defense', bonus: '+1 AC with armor', rating: 'A+', note: 'Simple. Always useful.' },
  { style: 'Great Weapon Fighting', bonus: 'Reroll 1s/2s', rating: 'A', note: '~+1 avg damage. Overhyped.' },
  { style: 'Blind Fighting', bonus: '10ft blindsight', rating: 'A', note: 'See invisible in 10ft.' },
  { style: 'Interception', bonus: 'Reduce ally damage 1d10+prof', rating: 'A', note: 'Better than Protection.' },
  { style: 'Unarmed Fighting', bonus: '1d6+STR, 1d4 to grappled', rating: 'A', note: 'Grapple builds.' },
  { style: 'TWF', bonus: 'Add mod to off-hand', rating: 'B+', note: 'Only for dual wielders.' },
  { style: 'Blessed Warrior', bonus: '2 Cleric cantrips', rating: 'B+', note: 'Toll the Dead for Paladin.' },
  { style: 'Protection', bonus: 'Disadvantage on ally attack', rating: 'B', note: 'Reaction, adjacent only.' },
];

export const BEST_BY_BUILD = {
  archer: 'Archery. No contest.',
  swordBoard: 'Dueling or Defense.',
  greatsword: 'GWF or Defense.',
  grappler: 'Unarmed Fighting.',
  tank: 'Defense or Interception.',
};

export const FIGHTING_STYLE_TIPS = [
  'Archery: best style. +2 hit is massive for ranged.',
  'Dueling: best melee for sword + shield.',
  'GWF: only +1 avg damage. Defense may be better.',
  'Defense: +1 AC never wasted.',
  'Blind Fighting: see invisible within 10ft.',
  'Interception > Protection.',
  'Archery + Sharpshooter: +2 offsets -5.',
  'Fighting Initiate feat: second style.',
  'Blessed Warrior: ranged cantrip for Paladin.',
  'Unarmed Fighting: passive damage on grappled foes.',
];
