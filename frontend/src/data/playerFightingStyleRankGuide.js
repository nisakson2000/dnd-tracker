/**
 * playerFightingStyleRankGuide.js
 * Player Mode: All fighting styles ranked — when to take each
 * Pure JS — no React dependencies.
 */

export const FIGHTING_STYLES = [
  { style: 'Archery', bonus: '+2 ranged attack rolls', rating: 'S+', note: 'Best DPR style. +10% hit.' },
  { style: 'Defense', bonus: '+1 AC in armor', rating: 'S', note: 'Universal. Can\'t go wrong.' },
  { style: 'Dueling', bonus: '+2 damage one-handed', rating: 'S', note: 'Best sword+shield.' },
  { style: 'Great Weapon Fighting', bonus: 'Reroll 1-2 on damage', rating: 'A', note: 'Only +1.33 avg. Less than expected.' },
  { style: 'Two-Weapon Fighting', bonus: 'Add mod to off-hand', rating: 'A', note: 'Required for TWF. BA competes.' },
  { style: 'Interception', bonus: 'Reduce ally damage by 1d10+PB', rating: 'A', note: 'Better than Protection.' },
  { style: 'Blind Fighting', bonus: 'Blindsight 10ft', rating: 'A (niche)', note: 'Counter invisible.' },
  { style: 'Protection', bonus: 'Disadvantage on attack vs ally', rating: 'B+', note: 'Costs reaction. Shield required.' },
  { style: 'Blessed Warrior', bonus: '2 Cleric cantrips', rating: 'A (Paladin)', note: 'Guidance + Toll the Dead.' },
  { style: 'Druidic Warrior', bonus: '2 Druid cantrips', rating: 'A (Ranger)', note: 'Shillelagh = WIS melee.' },
  { style: 'Unarmed Fighting', bonus: 'd6/d8 unarmed + 1d4 grapple', rating: 'A', note: 'Grapple builds.' },
  { style: 'Thrown Weapon', bonus: '+2 damage thrown + free draw', rating: 'B+', note: 'Niche thrown builds.' },
  { style: 'Superior Technique', bonus: '1 maneuver + d6', rating: 'B+', note: 'Small die. Better to go BM.' },
];

export const STYLE_BY_BUILD = {
  swordAndShield: 'Dueling',
  twoHanded: 'Great Weapon Fighting',
  ranged: 'Archery',
  tank: 'Defense or Interception',
  twoWeapon: 'Two-Weapon Fighting',
  grappler: 'Unarmed Fighting',
  unsure: 'Defense',
};

export const FIGHTING_STYLE_TIPS = [
  'Archery: best. +2 = 10% more hits.',
  'Defense: always good. Universal +1 AC.',
  'Dueling: +2/hit. Sword+shield best.',
  'GWF: only +1.33 avg. Overrated.',
  'Interception > Protection. Guaranteed vs chance.',
  'Blessed Warrior: Guidance for Paladins.',
  'If unsure: Defense. Can\'t go wrong.',
];
