/**
 * playerAbilityScoreGenMethodsGuide.js
 * Player Mode: Ability score generation methods — point buy, rolling, standard array
 * Pure JS — no React dependencies.
 */

export const STANDARD_ARRAY = {
  scores: [15, 14, 13, 12, 10, 8],
  pros: ['Balanced. Fair. Everyone starts equal.', 'No bad rolls.', 'Fast character creation.'],
  cons: ['No 16+ before racial bonuses.', 'Predictable. Less exciting.', 'Can\'t min-max as hard.'],
  bestFor: 'New players, organized play (AL), fairness-focused tables.',
};

export const POINT_BUY = {
  points: 27,
  costs: [
    { score: 8, cost: 0 },
    { score: 9, cost: 1 },
    { score: 10, cost: 2 },
    { score: 11, cost: 3 },
    { score: 12, cost: 4 },
    { score: 13, cost: 5 },
    { score: 14, cost: 7 },
    { score: 15, cost: 9 },
  ],
  range: '8-15 before racial bonuses',
  pros: ['Full control over scores.', 'Balanced between players.', 'Optimizable.'],
  cons: ['Max 15 before racials.', 'Takes longer than standard array.', 'Can feel calculated.'],
  bestFor: 'Optimization-focused players, balanced tables, AL-legal.',
};

export const POINT_BUY_OPTIMAL_SPREADS = [
  { build: 'SAD (Single Ability Dependent)', spread: '15/14/14/10/10/8', note: 'Max primary + two 14s for secondary/CON. Warlock, Rogue.' },
  { build: 'MAD (Multi Ability Dependent)', spread: '15/15/13/10/10/8', note: 'Two 15s for multiclass. Paladin, Monk, Ranger.' },
  { build: 'Balanced Caster', spread: '15/10/14/12/12/8', note: 'Primary 15, CON 14, rest balanced. Most casters.' },
  { build: 'Pure Martial', spread: '15/14/14/8/12/8', note: 'STR/DEX + CON. Dump INT and CHA. Fighter, Barbarian.' },
  { build: 'Face Character', spread: '15/10/13/8/12/14', note: 'Primary + CHA + CON. Bard, Warlock, Paladin.' },
];

export const ROLLING_4D6 = {
  method: 'Roll 4d6, drop lowest die. Repeat 6 times. Assign as desired.',
  average: '~12.24 per score (higher than point buy average)',
  pros: ['Exciting. Fun randomness.', 'Can get 16-18 before racials.', 'Memorable characters from rolls.'],
  cons: ['Unbalanced between players.', 'Can roll terribly (6-8 on everything).', 'Power disparity at the table.'],
  bestFor: 'Home games, experienced tables, DMs who handle imbalance.',
};

export const ALTERNATIVE_METHODS = [
  { method: '3d6 Straight', how: 'Roll 3d6 for each stat in order (STR→CHA).', avg: '~10.5', note: 'Old school. Very swingy. Build around what you roll.' },
  { method: '2d6+6', how: 'Roll 2d6+6 for each stat. Assign freely.', avg: '~13', note: 'Higher floor (8 minimum). More heroic.' },
  { method: 'Roll 4d6×7, drop lowest set', how: 'Roll 7 arrays of 4d6-drop-lowest. Drop worst score.', avg: '~13', note: 'Safety net against terrible rolls.' },
  { method: 'Group Array', how: 'One player rolls. Everyone uses the same array.', avg: 'Varies', note: 'Fair but still has rolling excitement.' },
  { method: 'Heroic Array', how: '[17, 15, 13, 12, 10, 8] or similar.', avg: '~12.5', note: 'DM-defined high-power array.' },
];

export const RACIAL_BONUS_PLACEMENT = {
  traditional: '+2/+1 to fixed stats based on race (PHB).',
  tashas: '+2/+1 (or +1/+1/+1) to any stats you choose (Tasha\'s/MotM).',
  key: 'Tasha\'s custom lineage: always put +2 in your primary stat.',
  tip: 'If using fixed racial bonuses, pick a race that boosts your primary stat.',
};

export const COMMON_STAT_TARGETS = [
  { target: 16, why: 'Sweet spot at L1. +3 modifier. Achievable with 15+1 racial or 14+2 racial.', priority: 'Primary stat.' },
  { target: 14, why: '+2 modifier. Good for secondary stats (CON, DEX for casters).', priority: 'CON for HP, secondary attack stat.' },
  { target: 13, why: 'Minimum for most multiclass requirements.', priority: 'Only if multiclassing.' },
  { target: 20, why: 'Max modifier (+5). Achievable at L4-8 with ASIs.', priority: 'Long-term primary stat goal.' },
  { target: 8, why: 'Dump stat. -1 modifier. Acceptable for non-essential abilities.', priority: 'INT for non-casters, CHA for non-faces.' },
];

export const SCORE_GENERATION_TIPS = [
  'Point buy: most balanced. Best for optimization and fairness.',
  'Standard array: fastest. Good for new players.',
  'Rolling: most fun but can create power imbalance.',
  'Always put your highest score in your primary stat.',
  'CON 14+ is important for everyone. HP matters.',
  '13 in a stat = multiclass prerequisite. Plan ahead.',
  'Tasha\'s custom origin: +2/+1 anywhere. Any race, any class.',
  'Point buy optimal: 15/15/13 for MAD builds (Paladin, Monk).',
  'Dump stats are fine. 8 INT Fighter is classic and valid.',
  'ASIs at L4, 8, 12, 16, 19: plan your progression.',
];
