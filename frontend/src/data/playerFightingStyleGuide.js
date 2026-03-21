/**
 * playerFightingStyleGuide.js
 * Player Mode: Fighting styles comparison, optimization, and class recommendations
 * Pure JS — no React dependencies.
 */

export const FIGHTING_STYLES = [
  { style: 'Archery', bonus: '+2 to ranged attack rolls', classes: ['Fighter', 'Ranger'], rating: 'S', analysis: 'Best fighting style. +2 to hit = ~10% more hits. Stacks with Sharpshooter to offset the -5 penalty.' },
  { style: 'Defense', bonus: '+1 AC while wearing armor', classes: ['Fighter', 'Paladin', 'Ranger'], rating: 'A', analysis: '+1 AC is always relevant. Simple, reliable, works with any build. Best "I don\'t know what to pick" choice.' },
  { style: 'Dueling', bonus: '+2 damage with one-handed melee weapon (other hand free or shield)', classes: ['Fighter', 'Paladin', 'Ranger'], rating: 'A', analysis: '+2 damage per hit. With Extra Attack: +4 DPR. Pairs perfectly with sword + shield for AC + damage.' },
  { style: 'Great Weapon Fighting', bonus: 'Reroll 1s and 2s on damage dice with two-handed/versatile weapons', classes: ['Fighter', 'Paladin'], rating: 'B', analysis: 'Only adds ~1 average damage per attack with greatsword. Worse than it looks. Dueling often beats it.' },
  { style: 'Two-Weapon Fighting', bonus: 'Add ability modifier to off-hand damage', classes: ['Fighter', 'Ranger'], rating: 'B', analysis: 'Necessary for dual wielding. Without it, off-hand does weapon die only. TWF build is suboptimal though.' },
  { style: 'Protection', bonus: 'Reaction: impose disadvantage on attack against adjacent ally (requires shield)', classes: ['Fighter', 'Paladin'], rating: 'B', analysis: 'Uses reaction. Only works adjacent. Sentinel is better for tanking. Niche but thematic.' },
  { style: 'Interception', bonus: 'Reaction: reduce damage to adjacent ally by 1d10+proficiency', classes: ['Fighter', 'Paladin'], rating: 'A', analysis: 'Better than Protection in most cases. Guaranteed damage reduction vs chance to miss (disadvantage). Scales with proficiency.' },
  { style: 'Blind Fighting', bonus: '10ft blindsight', classes: ['Fighter', 'Paladin', 'Ranger'], rating: 'A', analysis: 'See invisible creatures within 10ft. Pairs with Darkness spell. Niche but when it works, it\'s incredible.' },
  { style: 'Thrown Weapon Fighting', bonus: '+2 damage with thrown weapons. Draw thrown weapon as part of attack.', classes: ['Fighter', 'Ranger'], rating: 'C', analysis: 'Fixes thrown weapon drawing issues. +2 damage is fine. But thrown builds are generally suboptimal.' },
  { style: 'Unarmed Fighting', bonus: '1d6+STR unarmed (1d8 without shield). Start of turn: 1d4 to grappled.', classes: ['Fighter'], rating: 'B', analysis: 'Makes unarmed viable for non-Monks. Grappler builds love the d4 damage per turn.' },
  { style: 'Superior Technique', bonus: 'Learn one maneuver + 1 superiority die (d6)', classes: ['Fighter'], rating: 'B', analysis: 'One maneuver and one d6 die. Better as a taste of Battle Master than a primary choice.' },
  { style: 'Blessed Warrior', bonus: '2 Cleric cantrips (use CHA)', classes: ['Paladin'], rating: 'B', analysis: 'Guidance and Toll the Dead. Gives Paladin a ranged option and out-of-combat utility.' },
  { style: 'Druidic Warrior', bonus: '2 Druid cantrips (use WIS)', classes: ['Ranger'], rating: 'A', analysis: 'Shillelagh + Thorn Whip. Makes WIS-focused Ranger viable (SAD build).' },
];

export const CLASS_RECOMMENDATIONS = {
  Fighter: {
    melee: ['Dueling (sword+shield)', 'Defense (any build)', 'Great Weapon Fighting (2H)'],
    ranged: ['Archery (always)'],
    grappler: ['Unarmed Fighting'],
  },
  Paladin: {
    melee: ['Dueling (primary)', 'Defense (safe pick)', 'Blessed Warrior (utility)'],
    note: 'Dueling is usually best. +2 damage stacks with Smite for more burst.',
  },
  Ranger: {
    ranged: ['Archery (always)', 'Druidic Warrior (WIS-based)'],
    melee: ['Dueling', 'TWF (dual wield build)', 'Defense'],
    note: 'Archery is almost always the right choice for Rangers.',
  },
};

export const FIGHTING_STYLE_FEAT = {
  name: 'Fighting Initiate',
  prereq: 'Proficiency with a martial weapon',
  effect: 'Learn one Fighting Style from the Fighter list.',
  note: 'Any martial character can pick up a second Fighting Style. Defense + Archery is great.',
  bestPicks: ['Defense (universal)', 'Blind Fighting (with Darkness user)', 'Archery (if ranged backup)'],
};

export function getStylesForClass(className) {
  return FIGHTING_STYLES.filter(s => s.classes.includes(className));
}

export function getRecommendation(className, playstyle) {
  const rec = CLASS_RECOMMENDATIONS[className];
  if (!rec) return [];
  return rec[playstyle] || rec.melee || [];
}

export function compareDamage(style1, style2, attacksPerTurn) {
  const bonuses = {
    'Archery': { toHit: 2, toDamage: 0 },
    'Dueling': { toHit: 0, toDamage: 2 },
    'Great Weapon Fighting': { toHit: 0, toDamage: 1 }, // ~1 avg with 2d6
    'Defense': { toHit: 0, toDamage: 0 },
  };
  const s1 = bonuses[style1] || { toHit: 0, toDamage: 0 };
  const s2 = bonuses[style2] || { toHit: 0, toDamage: 0 };
  return {
    style1: { extraDPR: (s1.toDamage + s1.toHit * 0.5) * attacksPerTurn },
    style2: { extraDPR: (s2.toDamage + s2.toHit * 0.5) * attacksPerTurn },
  };
}
