/**
 * playerCombatTimer.js
 * Player Mode: Combat round timer and turn duration tracking
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// TIMER TEMPLATES
// ---------------------------------------------------------------------------

export const COMBAT_TIMER_TEMPLATE = {
  combatStartTime: null,
  roundStartTime: null,
  turnStartTime: null,
  totalCombatSeconds: 0,
  currentRoundSeconds: 0,
  currentTurnSeconds: 0,
  roundDurations: [],      // [{ round: 1, durationMs: 45000 }]
  turnDurations: [],       // [{ round: 1, actor: 'Tharion', durationMs: 12000 }]
  averageTurnMs: 0,
};

// ---------------------------------------------------------------------------
// IN-GAME TIME
// ---------------------------------------------------------------------------

export const IN_GAME_TIME = {
  roundDuration: 6,  // seconds in a combat round
  getInGameSeconds: (rounds) => rounds * 6,
  formatInGameTime: (rounds) => {
    const totalSeconds = rounds * 6;
    if (totalSeconds < 60) return `${totalSeconds} seconds`;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  },
};

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Start combat timer.
 */
export function startCombatTimer() {
  const now = Date.now();
  return {
    ...COMBAT_TIMER_TEMPLATE,
    combatStartTime: now,
    roundStartTime: now,
    turnStartTime: now,
  };
}

/**
 * Record end of a turn.
 */
export function endTurn(timer, actorName, round) {
  const now = Date.now();
  const turnDuration = now - (timer.turnStartTime || now);
  const newTurnDurations = [...timer.turnDurations, { round, actor: actorName, durationMs: turnDuration }];
  const totalTurnMs = newTurnDurations.reduce((sum, t) => sum + t.durationMs, 0);

  return {
    ...timer,
    turnStartTime: now,
    turnDurations: newTurnDurations,
    currentTurnSeconds: 0,
    averageTurnMs: Math.round(totalTurnMs / newTurnDurations.length),
  };
}

/**
 * Record end of a round.
 */
export function endRound(timer, round) {
  const now = Date.now();
  const roundDuration = now - (timer.roundStartTime || now);
  return {
    ...timer,
    roundStartTime: now,
    roundDurations: [...timer.roundDurations, { round, durationMs: roundDuration }],
    currentRoundSeconds: 0,
  };
}

/**
 * Get total combat duration.
 */
export function getCombatDuration(timer) {
  if (!timer.combatStartTime) return 0;
  return Date.now() - timer.combatStartTime;
}

/**
 * Format milliseconds to display string.
 */
export function formatDuration(ms) {
  const totalSecs = Math.floor(ms / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

/**
 * Get average round duration.
 */
export function getAverageRoundDuration(timer) {
  if (timer.roundDurations.length === 0) return 0;
  const total = timer.roundDurations.reduce((sum, r) => sum + r.durationMs, 0);
  return Math.round(total / timer.roundDurations.length);
}

/**
 * Get fastest and slowest turns.
 */
export function getTurnExtremes(timer) {
  if (timer.turnDurations.length === 0) return { fastest: null, slowest: null };
  const sorted = [...timer.turnDurations].sort((a, b) => a.durationMs - b.durationMs);
  return {
    fastest: sorted[0],
    slowest: sorted[sorted.length - 1],
  };
}
