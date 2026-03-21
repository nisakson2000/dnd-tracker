/**
 * playerSessionLog.js
 * Player Mode: Session recap, highlights, and statistics
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// SESSION STATISTICS TEMPLATE
// ---------------------------------------------------------------------------

export const SESSION_STATS_TEMPLATE = {
  sessionStart: null,
  totalRolls: 0,
  nat20Count: 0,
  nat1Count: 0,
  attacksMade: 0,
  attacksHit: 0,
  spellsCast: 0,
  damageDealt: 0,
  damageTaken: 0,
  healingDone: 0,
  healingReceived: 0,
  deathSavesMade: 0,
  deathSavesFailed: 0,
  combatRounds: 0,
  itemsUsed: 0,
  featuresUsed: 0,
  criticalHits: 0,
  fumbles: 0,
  savesSucceeded: 0,
  savesFailed: 0,
};

/**
 * Calculate hit rate percentage.
 */
export function getHitRate(stats) {
  if (stats.attacksMade === 0) return 0;
  return Math.round((stats.attacksHit / stats.attacksMade) * 100);
}

/**
 * Get session summary text.
 */
export function getSessionSummary(stats) {
  const lines = [];
  if (stats.attacksMade > 0) lines.push(`Attacks: ${stats.attacksHit}/${stats.attacksMade} (${getHitRate(stats)}% hit rate)`);
  if (stats.criticalHits > 0) lines.push(`Critical Hits: ${stats.criticalHits}`);
  if (stats.damageDealt > 0) lines.push(`Damage Dealt: ${stats.damageDealt}`);
  if (stats.healingDone > 0) lines.push(`Healing Done: ${stats.healingDone}`);
  if (stats.spellsCast > 0) lines.push(`Spells Cast: ${stats.spellsCast}`);
  if (stats.nat20Count > 0) lines.push(`Natural 20s: ${stats.nat20Count}`);
  if (stats.nat1Count > 0) lines.push(`Natural 1s: ${stats.nat1Count}`);
  if (stats.deathSavesMade > 0 || stats.deathSavesFailed > 0) {
    lines.push(`Death Saves: ${stats.deathSavesMade} passed, ${stats.deathSavesFailed} failed`);
  }
  return lines;
}

/**
 * Update session stats with a new event.
 */
export function updateSessionStats(stats, eventType, data = {}) {
  const updated = { ...stats };
  if (!updated.sessionStart) updated.sessionStart = Date.now();

  switch (eventType) {
    case 'attack':
      updated.attacksMade++;
      if (data.hit) updated.attacksHit++;
      if (data.crit) updated.criticalHits++;
      if (data.fumble) updated.fumbles++;
      if (data.damage) updated.damageDealt += data.damage;
      break;
    case 'spell':
      updated.spellsCast++;
      if (data.damage) updated.damageDealt += data.damage;
      if (data.healing) updated.healingDone += data.healing;
      break;
    case 'damage_taken':
      updated.damageTaken += data.amount || 0;
      break;
    case 'healing_received':
      updated.healingReceived += data.amount || 0;
      break;
    case 'death_save':
      if (data.success) updated.deathSavesMade++;
      else updated.deathSavesFailed++;
      break;
    case 'roll':
      updated.totalRolls++;
      if (data.d20 === 20) updated.nat20Count++;
      if (data.d20 === 1) updated.nat1Count++;
      break;
    case 'save':
      if (data.success) updated.savesSucceeded++;
      else updated.savesFailed++;
      break;
    case 'item':
      updated.itemsUsed++;
      break;
    case 'feature':
      updated.featuresUsed++;
      break;
    default:
      break;
  }

  return updated;
}
