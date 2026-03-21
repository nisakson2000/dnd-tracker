/**
 * playerExhaustionLevelsGuide.js
 * Player Mode: Exhaustion levels — effects, causes, and recovery
 * Pure JS — no React dependencies.
 */

export const EXHAUSTION_LEVELS = [
  { level: 1, effect: 'Disadvantage on ability checks.', severity: 'Mild' },
  { level: 2, effect: 'Speed halved.', severity: 'Moderate' },
  { level: 3, effect: 'Disadvantage on attack rolls and saving throws.', severity: 'Severe' },
  { level: 4, effect: 'Hit point maximum halved.', severity: 'Critical' },
  { level: 5, effect: 'Speed reduced to 0.', severity: 'Debilitating' },
  { level: 6, effect: 'Death.', severity: 'Fatal' },
];

export const EXHAUSTION_CAUSES = [
  { cause: 'No Long Rest (24+ hours)', how: 'CON save DC 10 (+5 per 24h) or +1 level.' },
  { cause: 'Starvation', how: 'After CON mod days, +1 per day.' },
  { cause: 'Dehydration', how: 'Half water: CON save or +1.' },
  { cause: 'Berserker Frenzy', how: '+1 when Frenzy ends.' },
  { cause: 'Sickening Radiance (L4)', how: 'Failed CON save: 4d10 + 1 exhaustion.' },
  { cause: 'Extreme Cold/Heat', how: 'CON save per hour of exposure.' },
];

export const EXHAUSTION_RECOVERY = [
  { method: 'Long Rest', recovery: 'Remove 1 level.', note: 'Need food and water. Slow.' },
  { method: 'Greater Restoration (L5)', recovery: 'Remove 1 level.', note: '100gp diamond consumed.' },
  { method: 'Potion of Vitality', recovery: 'Remove ALL levels.', note: 'Very Rare. Hard to find.' },
];

export const EXHAUSTION_TIPS = [
  'Exhaustion stacks. All levels cumulative.',
  '6 levels = instant death. No saves.',
  'Only 1 level removed per long rest. Recovery is SLOW.',
  'Greater Restoration: immediate but costs 100gp diamond.',
  'Berserker Frenzy: +1 per Frenzy. Use sparingly.',
  'Level 3 = disadvantage on attacks AND saves. Danger zone.',
  'Level 4 halves max HP. Effectively crippled.',
  'Create Food and Water prevents starvation exhaustion.',
  'Sickening Radiance stacks exhaustion rapidly. Very dangerous.',
  'Avoid exhaustion at all costs. Worst condition in 5e.',
];
