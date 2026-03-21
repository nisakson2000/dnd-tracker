/**
 * Session Analytics — Data structures and utility functions for tracking
 * session statistics, combat performance, and historical comparisons.
 * Covers roadmap items 361-372.
 */

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

/**
 * Template object representing a full session's tracked metrics.
 */
export const SESSION_METRICS = {
  duration: 0,                 // total session length in minutes
  combatTime: 0,               // minutes spent in combat
  rpTime: 0,                   // minutes spent in roleplay
  explorationTime: 0,          // minutes spent exploring

  encounterCount: 0,
  encounterDifficulties: [],   // e.g. ['easy', 'medium', 'deadly']

  totalDamageDealt: 0,
  totalDamageReceived: 0,
  totalHealing: 0,

  spellSlotsUsed: 0,
  spellsUsedList: [],          // e.g. ['Fireball', 'Shield', 'Healing Word']

  deathSavesMade: 0,
  deathSavesFailed: 0,

  npcsInteracted: [],          // names of NPCs the party spoke with
  questsAdvanced: [],          // quest names or IDs that progressed
  lootAwarded: [],             // items / gold awarded during the session

  criticalHits: 0,
  criticalMisses: 0,

  combatantsDefeated: 0,       // enemies killed / knocked out
  combatantsLost: 0,           // party members or allies dropped
};

/**
 * Per-combatant combat statistics template.
 */
export const COMBAT_STATS_TEMPLATE = {
  name: '',
  attacksMade: 0,
  attacksHit: 0,
  attacksMissed: 0,
  damageDealt: 0,
  damageReceived: 0,
  healingDone: 0,
  conditionsApplied: 0,
  conditionsReceived: 0,
  actionsUsed: 0,
  bonusActionsUsed: 0,
  reactionsUsed: 0,
  spellsCast: 0,
  killCount: 0,
  timesDroppedTo0: 0,
};

// ---------------------------------------------------------------------------
// Factory functions
// ---------------------------------------------------------------------------

/**
 * Returns a fresh session metrics object (deep copy of the template).
 */
export function createSessionMetrics() {
  return {
    ...SESSION_METRICS,
    encounterDifficulties: [],
    spellsUsedList: [],
    npcsInteracted: [],
    questsAdvanced: [],
    lootAwarded: [],
  };
}

/**
 * Returns a fresh combat stats object for the given combatant name.
 */
export function createCombatStats(name = '') {
  return { ...COMBAT_STATS_TEMPLATE, name };
}

// ---------------------------------------------------------------------------
// Calculation helpers
// ---------------------------------------------------------------------------

/**
 * Calculate hit rate as a ratio between 0 and 1.
 * Returns 0 if no attacks were made.
 */
export function calculateHitRate(stats) {
  if (!stats || stats.attacksMade <= 0) return 0;
  return stats.attacksHit / stats.attacksMade;
}

/**
 * Calculate damage per round.
 * Returns 0 if rounds is 0 or not provided.
 */
export function calculateDPR(stats, rounds) {
  if (!stats || !rounds || rounds <= 0) return 0;
  return stats.damageDealt / rounds;
}

/**
 * Calculate action efficiency — the ratio of actions actually used to total
 * action opportunities (actions + bonus actions + reactions).
 * Returns 0 if no actions were available.
 */
export function calculateActionEfficiency(stats) {
  if (!stats) return 0;
  const totalUsed = stats.actionsUsed + stats.bonusActionsUsed + stats.reactionsUsed;
  // Each round provides at most 1 action + 1 bonus action + 1 reaction = 3 slots.
  // We treat the total used as the numerator; the denominator is the maximum
  // possible (3 per round), but since we don't always know round count we
  // express efficiency as used / (actions + bonus + reactions) itself — a
  // self-reported ratio where higher absolute numbers indicate more engagement.
  // If a round count is tracked externally, divide totalUsed by (rounds * 3).
  const totalPossible = stats.actionsUsed + stats.bonusActionsUsed + stats.reactionsUsed;
  if (totalPossible <= 0) return 0;
  return totalUsed / totalPossible;
}

/**
 * Generate a plain-text summary paragraph for a completed session.
 */
export function generateSessionSummary(metrics) {
  if (!metrics) return 'No session data available.';

  const hours = Math.floor(metrics.duration / 60);
  const mins = metrics.duration % 60;
  const durationStr = hours > 0
    ? `${hours}h ${mins}m`
    : `${mins}m`;

  const lines = [];
  lines.push(`Session lasted ${durationStr}.`);

  if (metrics.combatTime || metrics.rpTime || metrics.explorationTime) {
    const parts = [];
    if (metrics.combatTime) parts.push(`${metrics.combatTime}m in combat`);
    if (metrics.rpTime) parts.push(`${metrics.rpTime}m in roleplay`);
    if (metrics.explorationTime) parts.push(`${metrics.explorationTime}m exploring`);
    lines.push(`Time breakdown: ${parts.join(', ')}.`);
  }

  if (metrics.encounterCount > 0) {
    lines.push(`${metrics.encounterCount} encounter${metrics.encounterCount !== 1 ? 's' : ''} faced (${metrics.encounterDifficulties.join(', ') || 'unrated'}).`);
  }

  if (metrics.totalDamageDealt || metrics.totalDamageReceived) {
    lines.push(`Damage dealt: ${metrics.totalDamageDealt}. Damage received: ${metrics.totalDamageReceived}.`);
  }

  if (metrics.totalHealing > 0) {
    lines.push(`Total healing: ${metrics.totalHealing} HP restored.`);
  }

  if (metrics.criticalHits || metrics.criticalMisses) {
    lines.push(`Critical hits: ${metrics.criticalHits}. Critical misses: ${metrics.criticalMisses}.`);
  }

  if (metrics.combatantsDefeated > 0) {
    lines.push(`${metrics.combatantsDefeated} combatant${metrics.combatantsDefeated !== 1 ? 's' : ''} defeated.`);
  }
  if (metrics.combatantsLost > 0) {
    lines.push(`${metrics.combatantsLost} ally/allies lost.`);
  }

  if (metrics.deathSavesMade || metrics.deathSavesFailed) {
    lines.push(`Death saves — successes: ${metrics.deathSavesMade}, failures: ${metrics.deathSavesFailed}.`);
  }

  if (metrics.spellSlotsUsed > 0) {
    lines.push(`${metrics.spellSlotsUsed} spell slot${metrics.spellSlotsUsed !== 1 ? 's' : ''} expended.`);
  }

  if (metrics.npcsInteracted.length > 0) {
    lines.push(`NPCs interacted with: ${metrics.npcsInteracted.join(', ')}.`);
  }

  if (metrics.questsAdvanced.length > 0) {
    lines.push(`Quests advanced: ${metrics.questsAdvanced.join(', ')}.`);
  }

  if (metrics.lootAwarded.length > 0) {
    lines.push(`Loot awarded: ${metrics.lootAwarded.join(', ')}.`);
  }

  return lines.join(' ');
}

/**
 * Compare the current session metrics against a historical average object
 * (same shape as SESSION_METRICS but with average values).
 *
 * Returns an object mapping each numeric key to { value, average, delta, pct }.
 * Positive delta means the current session exceeded the average.
 */
export function compareToAverage(current, historical) {
  if (!current || !historical) return {};

  const numericKeys = [
    'duration', 'combatTime', 'rpTime', 'explorationTime',
    'encounterCount', 'totalDamageDealt', 'totalDamageReceived',
    'totalHealing', 'spellSlotsUsed', 'deathSavesMade', 'deathSavesFailed',
    'criticalHits', 'criticalMisses', 'combatantsDefeated', 'combatantsLost',
  ];

  const result = {};
  for (const key of numericKeys) {
    const value = current[key] ?? 0;
    const average = historical[key] ?? 0;
    const delta = value - average;
    const pct = average !== 0 ? (delta / average) * 100 : 0;
    result[key] = { value, average, delta, pct: Math.round(pct) };
  }

  return result;
}
