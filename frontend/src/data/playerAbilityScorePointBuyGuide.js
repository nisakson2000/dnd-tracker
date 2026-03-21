/**
 * playerAbilityScorePointBuyGuide.js
 * Player Mode: Point buy optimization — best stat arrays
 * Pure JS — no React dependencies.
 */

export const POINT_BUY_COSTS = [
  { score: 8, cost: 0, mod: -1 },
  { score: 9, cost: 1, mod: -1 },
  { score: 10, cost: 2, mod: 0 },
  { score: 11, cost: 3, mod: 0 },
  { score: 12, cost: 4, mod: 1 },
  { score: 13, cost: 5, mod: 1 },
  { score: 14, cost: 7, mod: 2 },
  { score: 15, cost: 9, mod: 2 },
];

export const POINT_BUY_RULES = {
  totalPoints: 27,
  minScore: 8,
  maxScore: 15,
  racialBonuses: 'Applied after point buy. Can push scores above 15.',
  note: 'Most balanced method. Guarantees fair stats across the party.',
};

export const OPTIMAL_ARRAYS = [
  {
    name: 'Standard Optimal',
    array: [15, 15, 15, 8, 8, 8],
    cost: 27,
    note: 'Three 15s with racial +2/+1 → 17/16/15. Best for MAD builds (Monk, Paladin, Ranger).',
    rating: 'S',
  },
  {
    name: 'SAD Caster',
    array: [8, 14, 15, 8, 8, 15],
    cost: 27,
    note: 'Max primary casting stat + CON. Dump everything else.',
    rating: 'S',
  },
  {
    name: 'Balanced Fighter',
    array: [15, 12, 14, 8, 12, 8],
    cost: 27,
    note: 'STR 15 (+2 racial = 17), CON 14, decent WIS. Well-rounded.',
    rating: 'A+',
  },
  {
    name: 'Face Character',
    array: [8, 14, 14, 8, 10, 15],
    cost: 27,
    note: 'CHA 15 (+2 = 17), DEX and CON at 14. Works for Bard, Sorcerer, Warlock.',
    rating: 'A+',
  },
  {
    name: 'Hexblade',
    array: [8, 14, 15, 8, 8, 15],
    cost: 27,
    note: 'CHA 15 (+2 = 17) for attacks AND spells. CON 15 (+1 = 16). DEX 14 for medium armor.',
    rating: 'S',
  },
];

export const RACIAL_BONUS_OPTIMIZATION = {
  standard: {
    rule: '+2/+1 to two different stats (PHB races) OR +2/+1 or +1/+1/+1 (Tasha\'s Custom Origin).',
    strategy: 'Put +2 in your primary stat. Put +1 in CON or secondary stat.',
  },
  tasha: {
    rule: 'Any race can put +2/+1 anywhere.',
    strategy: 'This makes every race viable for every class. Choose race for features, not stats.',
  },
  oddVsEven: {
    rule: 'Only EVEN scores give modifier increases. 15 → +2 mod. 16 → +3 mod. 17 → +3 mod (same as 16).',
    tip: 'Start with odd scores (15, 13) and use racial bonuses to make them even (17→16 effective, use half-feat to reach 18).',
    note: 'Half-feats (+1 to a stat) let you turn odd scores into even ones while gaining a feat.',
  },
};

export const DUMP_STAT_GUIDE = {
  str: { safe: ['Casters', 'DEX-based martials'], risk: 'Athletics checks, carry capacity, grapple escape.', note: 'Most common dump stat for casters.' },
  dex: { safe: ['Heavy armor users'], risk: 'Initiative, DEX saves (Fireball), Stealth.', note: 'Heavy armor ignores DEX for AC. Still affects initiative and saves.' },
  con: { safe: ['Nobody'], risk: 'HP, concentration saves, death.', note: 'NEVER dump CON. Everyone needs HP.' },
  int: { safe: ['Most non-Wizards'], risk: 'Investigation, some skill checks.', note: 'Safest dump stat for non-INT classes. INT saves are rare.' },
  wis: { safe: ['Carefully'], risk: 'Perception, WIS saves (many charm/fear effects).', note: 'Risky to dump. WIS saves are common and devastating.' },
  cha: { safe: ['Non-face characters'], risk: 'Social encounters, CHA saves (Banishment).', note: 'Safe if someone else handles social. CHA saves exist but are rare.' },
};

export function pointBuyRemaining(scores) {
  const costs = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
  const spent = scores.reduce((total, s) => total + (costs[s] || 0), 0);
  return { spent, remaining: 27 - spent, valid: spent <= 27 };
}
