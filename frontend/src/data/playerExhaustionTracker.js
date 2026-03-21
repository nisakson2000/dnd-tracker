/**
 * playerExhaustionTracker.js
 * Player Mode: Exhaustion levels, effects, and tracking
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// EXHAUSTION LEVELS
// ---------------------------------------------------------------------------

export const EXHAUSTION_LEVELS = [
  { level: 0, effect: 'No exhaustion.', color: '#22c55e' },
  { level: 1, effect: 'Disadvantage on ability checks.', color: '#eab308' },
  { level: 2, effect: 'Speed halved.', color: '#f97316' },
  { level: 3, effect: 'Disadvantage on attack rolls and saving throws.', color: '#ef4444' },
  { level: 4, effect: 'Hit point maximum halved.', color: '#dc2626' },
  { level: 5, effect: 'Speed reduced to 0.', color: '#991b1b' },
  { level: 6, effect: 'Death.', color: '#000000' },
];

// ---------------------------------------------------------------------------
// EXHAUSTION CAUSES
// ---------------------------------------------------------------------------

export const EXHAUSTION_CAUSES = [
  'Traveling for more than 8 hours without a long rest',
  'Going 24 hours without a long rest (CON save DC 10, +5 each time)',
  'Going without food for a number of days (CON save DC 10 + 1/day)',
  'Frenzy (Berserker Barbarian) — 1 level after rage ends',
  'Certain spells (Sickening Radiance, Dream)',
  'Extreme heat without water (CON save DC 5, +1 each hour)',
  'Extreme cold without protection (CON save DC 10)',
  'Some monster abilities (e.g., certain undead)',
];

// ---------------------------------------------------------------------------
// RECOVERY
// ---------------------------------------------------------------------------

export const EXHAUSTION_RECOVERY = {
  longRest: 'A long rest reduces exhaustion level by 1 (requires food and drink).',
  greaterRestoration: 'Greater Restoration (5th level) reduces exhaustion by 1 level.',
  note: 'Exhaustion effects are cumulative — a creature at level 3 has all effects from levels 1-3.',
};

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Get all effects at a given exhaustion level (cumulative).
 */
export function getExhaustionEffects(level) {
  return EXHAUSTION_LEVELS.filter(e => e.level > 0 && e.level <= level);
}

/**
 * Get exhaustion display info.
 */
export function getExhaustionDisplay(level) {
  const clamped = Math.max(0, Math.min(6, level));
  return EXHAUSTION_LEVELS[clamped];
}

/**
 * Check if a specific mechanic is affected by exhaustion.
 */
export function isAffectedByExhaustion(level, mechanic) {
  if (level <= 0) return false;
  switch (mechanic) {
    case 'ability_check': return level >= 1;
    case 'speed': return level >= 2;
    case 'attack': return level >= 3;
    case 'saving_throw': return level >= 3;
    case 'hp_max': return level >= 4;
    case 'movement': return level >= 5;
    case 'death': return level >= 6;
    default: return false;
  }
}
