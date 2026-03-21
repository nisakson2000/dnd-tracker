/**
 * playerDodgeActionGuide.js
 * Player Mode: When to use the Dodge action, AC math, and defensive play
 * Pure JS — no React dependencies.
 */

export const DODGE_BASICS = {
  action: 'Dodge (uses your action)',
  effect: 'All attack rolls against you have disadvantage until your next turn. You also have advantage on DEX saves.',
  requirement: 'You can still see the attacker. Doesn\'t work if you\'re incapacitated.',
  stacks: 'Works with Shield, high AC, cover. Disadvantage + high AC = very hard to hit.',
  note: 'Unlike attacking, Dodge protects you ALL round — every attack against you is at disadvantage.',
};

export const WHEN_TO_DODGE = [
  { situation: 'Surrounded by multiple enemies', why: 'Every incoming attack has disadvantage. With 4+ enemies, that\'s 4+ attacks at disadvantage.', priority: 'S' },
  { situation: 'Concentrating on a crucial spell', why: 'Fewer hits = fewer concentration saves. Dodge + high CON = near-unbreakable concentration.', priority: 'S' },
  { situation: 'Waiting for allies to arrive', why: 'If you\'re alone vs multiple enemies, surviving is more important than dealing damage.', priority: 'A' },
  { situation: 'No good attack targets', why: 'If enemies are out of range or resistant to your damage, Dodge is productive.', priority: 'A' },
  { situation: 'Tank protecting squishies', why: 'Dodge + Sentinel: enemies have disadvantage against you AND you stop them from leaving.', priority: 'A' },
  { situation: 'Dragon breath incoming', why: 'Advantage on DEX saves. +5 equivalent against breath weapons and AoE spells.', priority: 'A' },
  { situation: 'Low HP, no healing available', why: 'Staying alive until the healer can reach you. Every round alive matters.', priority: 'S' },
];

export const WHEN_NOT_TO_DODGE = [
  { situation: 'Only one enemy attacking you', why: 'Disadvantage on one attack is less valuable than your own attack/spell.' },
  { situation: 'You could kill the enemy instead', why: 'Dead enemies deal 0 damage. If you can end the threat, attack.' },
  { situation: 'You have Shield or other reactions', why: 'Shield gives +5 AC when you need it. More efficient than Dodge in many cases.' },
  { situation: 'Ranged character not being targeted', why: 'If nobody is attacking you, Dodge does nothing. Attack instead.' },
];

export const DODGE_MATH = {
  normalHitChance: 'Average: ~65% (d20+5 vs AC 15)',
  withDisadvantage: 'Average: ~42% (roughly 0.65² is 42.25%)',
  reduction: '~23 percentage points less likely to be hit per attack',
  multipleAttacks: {
    twoAttacks: { normal: '87.75% chance at least one hits', dodge: '65.7%' },
    threeAttacks: { normal: '95.7%', dodge: '80.5%' },
    fourAttacks: { normal: '98.5%', dodge: '88.7%' },
  },
  note: 'The more attacks against you, the more valuable Dodge becomes.',
};

export const PATIENT_DEFENSE = {
  class: 'Monk',
  cost: '1 ki point',
  action: 'Bonus action Dodge (Patient Defense)',
  value: 'Dodge as BONUS action means you can still attack AND Dodge. Best defensive option in the game for its cost.',
  combo: 'Attack → Patient Defense → Deflect Missiles (reaction). Monks are very hard to hit.',
};

export const DEFENSIVE_STACKING = [
  { combination: 'Dodge + Heavy Armor + Shield', effectiveAC: '20+ with disadvantage', rating: 'S', note: 'Plate (18) + Shield (2) = AC 20. With Dodge, enemies need ~16+ on disadvantage to hit.' },
  { combination: 'Dodge + Shield spell', effectiveAC: 'AC + 5 with disadvantage', rating: 'S', note: 'Shield when you DO get hit despite Dodge. Nearly unhittable.' },
  { combination: 'Dodge + Half Cover', effectiveAC: 'AC + 2 with disadvantage', rating: 'A', note: 'Cover bonus stacks with Dodge. +2 AC AND disadvantage.' },
  { combination: 'Dodge + Mirror Image', effectiveAC: 'Multiple miss chances stacked', rating: 'S', note: 'Mirror Image doesn\'t require concentration. 3 extra "misses" + Dodge disadvantage.' },
  { combination: 'Dodge + Blur', effectiveAC: 'Double disadvantage (same as single)', rating: 'C', note: 'Blur gives disadvantage. Dodge gives disadvantage. They DON\'T stack. Waste of a spell.' },
];

export function dodgeEffectiveness(incomingAttacks, enemyHitBonus, yourAC) {
  const normalHitChance = Math.min(0.95, Math.max(0.05, (21 - (yourAC - enemyHitBonus)) / 20));
  const dodgeHitChance = normalHitChance * normalHitChance;

  const normalExpectedHits = incomingAttacks * normalHitChance;
  const dodgeExpectedHits = incomingAttacks * dodgeHitChance;
  const hitsPrevented = normalExpectedHits - dodgeExpectedHits;

  return {
    normalHitChance: Math.round(normalHitChance * 100),
    dodgeHitChance: Math.round(dodgeHitChance * 100),
    expectedHitsNormal: Math.round(normalExpectedHits * 10) / 10,
    expectedHitsDodge: Math.round(dodgeExpectedHits * 10) / 10,
    hitsPrevented: Math.round(hitsPrevented * 10) / 10,
    worthIt: hitsPrevented >= 1,
  };
}
