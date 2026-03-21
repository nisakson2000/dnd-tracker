/**
 * playerPointBuyOptimizer.js
 * Player Mode: Point buy optimization and standard array comparison
 * Pure JS — no React dependencies.
 */

export const POINT_BUY_RULES = {
  points: 27,
  costs: [
    { score: 8, cost: 0 }, { score: 9, cost: 1 }, { score: 10, cost: 2 },
    { score: 11, cost: 3 }, { score: 12, cost: 4 }, { score: 13, cost: 5 },
    { score: 14, cost: 7 }, { score: 15, cost: 9 },
  ],
  range: 'Scores can be 8-15 before racial modifiers.',
  standardArray: [15, 14, 13, 12, 10, 8],
  note: 'Point buy gives more flexibility than standard array. Always use point buy if allowed.',
};

export const OPTIMAL_DISTRIBUTIONS = [
  {
    name: 'SAD Caster (Single Ability Dependent)',
    scores: { primary: 15, con: 14, dex: 14, wis: 10, other1: 8, other2: 8 },
    cost: '9+7+7+2+0+0 = 25 (2 spare)',
    example: 'Wizard: 15 INT (+2 race = 17), 14 CON, 14 DEX. Round 17→18 with half-feat at L4.',
    note: 'Maximize primary stat. CON and DEX for survival. Dump the rest.',
  },
  {
    name: 'MAD Martial (STR + CON + secondary)',
    scores: { str: 15, con: 15, dex: 10, wis: 12, cha: 8, int: 8 },
    cost: '9+9+2+4+0+0 = 24 (3 spare)',
    example: 'Paladin: 15 STR (+1 race), 15 CON, bump CHA with race +2 = 10 CHA, 15 CON.',
    note: 'Two 15s is expensive. Consider one 15 and one 14.',
  },
  {
    name: 'Hexblade/CHA Mono-stat',
    scores: { cha: 15, con: 14, dex: 14, wis: 10, str: 8, int: 8 },
    cost: '9+7+7+2+0+0 = 25',
    example: 'Hexblade: 15 CHA (+2 race = 17). CHA for attack, damage, spells, saves.',
    note: 'Hexblade makes Paladin/Sorcerer single-stat viable.',
  },
  {
    name: 'Monk/Ranger (DEX + WIS)',
    scores: { dex: 15, wis: 15, con: 13, str: 8, cha: 8, int: 8 },
    cost: '9+9+5+0+0+0 = 23 (4 spare)',
    example: 'Monk: 15 DEX (+2 race = 17), 15 WIS (+1 race = 16). CON 13 for Resilient.',
    note: 'Monk needs DEX and WIS both high. Point buy struggles here.',
  },
];

export const RACIAL_ASI_OPTIMIZATION = {
  oddScores: 'If your primary stat is 15 and race gives +2 = 17 (odd). Take a half-feat at L4 for +1 → 18.',
  evenScores: 'If your primary stat is 15 and race gives +1 = 16 (even). ASI at L4 for +2 → 18.',
  halfFeats: 'Half-feats (+1 to a stat) are best when you have an odd score to round up.',
  rule: 'Always plan your L4 ASI/feat BEFORE finalizing point buy. The whole build flows from this.',
};

export function pointBuyCost(scores) {
  const costTable = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
  let total = 0;
  for (const score of Object.values(scores)) {
    total += costTable[score] || 0;
  }
  return { cost: total, remaining: 27 - total, valid: total <= 27 };
}

export function modifierFromScore(score) {
  return Math.floor((score - 10) / 2);
}

export function isOddAfterRace(baseScore, racialBonus) {
  return (baseScore + racialBonus) % 2 === 1;
}
