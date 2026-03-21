/**
 * playerFatigueManagement.js
 * Player Mode: Exhaustion levels, sources, and recovery
 * Pure JS — no React dependencies.
 */

export const EXHAUSTION_LEVELS = [
  { level: 1, effect: 'Disadvantage on ability checks.', severity: 'Low' },
  { level: 2, effect: 'Speed halved.', severity: 'Medium' },
  { level: 3, effect: 'Disadvantage on attacks and saves.', severity: 'High' },
  { level: 4, effect: 'HP maximum halved.', severity: 'Critical' },
  { level: 5, effect: 'Speed reduced to 0.', severity: 'Critical' },
  { level: 6, effect: 'Death.', severity: 'Fatal' },
];

export const EXHAUSTION_SOURCES = [
  { source: 'Forced march', trigger: 'Travel 8+ hours. CON DC 10+1/hour extra.' },
  { source: 'No food/water', trigger: '3+ days no food or 1+ day no water.' },
  { source: 'Berserker Frenzy', trigger: 'After Frenzy rage ends.' },
  { source: 'Sickening Radiance', trigger: '4th level. CON save or 4d10 + exhaustion.' },
  { source: 'Extreme temperatures', trigger: 'CON save per hour without protection.' },
];

export const RECOVERY = {
  longRest: 'Removes ONE level per long rest (with food/water).',
  greaterRestoration: '5th level. Removes one level instantly.',
  note: 'Level 5 exhaustion = 5 days to recover without magic.',
};

export const KILL_COMBO = {
  name: 'Sickening Radiance + Forcecage',
  effect: 'Trap in Forcecage. Sickening Radiance each round. 6 failed CON saves = death.',
  note: 'Most reliable kill combo in 5e. Works on anything without teleportation.',
};

export function exhaustionEffect(level) {
  return EXHAUSTION_LEVELS.find(e => e.level === level) || null;
}

export function recoveryDays(level, hasGR) {
  return hasGR ? Math.ceil(level / 2) : level;
}

export function forcedMarchDC(extraHours) {
  return 10 + extraHours;
}
