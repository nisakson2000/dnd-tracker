/**
 * playerFightingStyleRankingGuide.js
 * Player Mode: All fighting styles ranked — which to choose and why
 * Pure JS — no React dependencies.
 */

export const FIGHTING_STYLES_RANKED = [
  { style: 'Archery', bonus: '+2 to ranged attack rolls', classes: ['Fighter', 'Ranger'], rating: 'S+', note: 'Best style. +2 to hit offsets Sharpshooter -5.' },
  { style: 'Dueling', bonus: '+2 damage one-handed (shield OK)', classes: ['Fighter', 'Paladin', 'Ranger'], rating: 'S', note: 'Sword + shield. Competitive DPR with defense.' },
  { style: 'Defense', bonus: '+1 AC while wearing armor', classes: ['Fighter', 'Paladin', 'Ranger'], rating: 'A+', note: 'Always useful. Safe pick for any build.' },
  { style: 'Interception', bonus: 'Reduce ally damage by 1d10+PB (reaction)', classes: ['Fighter', 'Paladin'], rating: 'A', note: 'Better than Protection. Guaranteed reduction.' },
  { style: 'Blind Fighting', bonus: 'Blindsight 10ft', classes: ['Fighter', 'Paladin', 'Ranger'], rating: 'A (niche)', note: 'See invisible in 10ft. Counters Darkness/Fog.' },
  { style: 'Druidic Warrior', bonus: '2 Druid cantrips (WIS)', classes: ['Ranger'], rating: 'A+', note: 'Shillelagh = WIS-based attacks. SAD Ranger.' },
  { style: 'Blessed Warrior', bonus: '2 Cleric cantrips (CHA)', classes: ['Paladin'], rating: 'A', note: 'Guidance + Toll the Dead. Ranged option.' },
  { style: 'Unarmed Fighting', bonus: '1d6/1d8 unarmed + grapple damage', classes: ['Fighter'], rating: 'A', note: 'Grapple builds. Free damage while grappling.' },
  { style: 'Two-Weapon Fighting', bonus: 'Add mod to off-hand damage', classes: ['Fighter', 'Ranger'], rating: 'B+', note: 'Makes TWF viable but TWF itself is weak.' },
  { style: 'Great Weapon Fighting', bonus: 'Reroll 1s/2s on damage dice (2H)', classes: ['Fighter', 'Paladin'], rating: 'B+', note: 'Only ~+1 avg damage. Sounds better than it is.' },
  { style: 'Thrown Weapon Fighting', bonus: '+2 damage thrown + free draw', classes: ['Fighter', 'Ranger'], rating: 'B', note: 'Free drawing is the real benefit.' },
  { style: 'Superior Technique', bonus: '1 maneuver + 1 superiority die', classes: ['Fighter'], rating: 'B+', note: 'Limited. Better to just play Battle Master.' },
  { style: 'Protection', bonus: 'Disadvantage on attack vs adjacent ally (reaction, shield)', classes: ['Fighter', 'Paladin'], rating: 'B', note: 'Very restrictive. Interception is better.' },
];

export const STYLE_SELECTION_GUIDE = [
  { build: 'Ranged (bow/crossbow)', pick: 'Archery', reason: '+2 to hit. Non-negotiable.' },
  { build: 'Sword and Board', pick: 'Dueling', reason: '+2 damage + shield defense.' },
  { build: 'Two-handed', pick: 'Defense or GWF', reason: 'Defense is arguably better (+1 AC > ~1 damage).' },
  { build: 'Tank', pick: 'Defense or Interception', reason: 'Pure survivability.' },
  { build: 'TWF', pick: 'Two-Weapon Fighting', reason: 'Essential for TWF builds.' },
  { build: 'Grappler', pick: 'Unarmed Fighting', reason: 'Free grapple damage.' },
  { build: 'WIS Ranger', pick: 'Druidic Warrior', reason: 'Shillelagh for WIS attacks.' },
];

export const FIGHTING_STYLE_TIPS = [
  'Archery +2 is mathematically the strongest style.',
  'Defense +1 AC is never wrong. Always a safe pick.',
  'GWF only adds ~1 damage. Often worse than Defense.',
  'Interception > Protection. Guaranteed vs maybe.',
  'Fighting Initiate feat: learn any style. Good for multiclass dips.',
  'Can\'t take the same style twice.',
];
