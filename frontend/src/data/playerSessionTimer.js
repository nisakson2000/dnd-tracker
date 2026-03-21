/**
 * playerSessionTimer.js
 * Player Mode Improvements 155, 196-198: Session duration, turn timer, rest timer
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// SESSION TIMER
// ---------------------------------------------------------------------------

export const SESSION_TIMER_TEMPLATE = {
  sessionStartTime: null,
  totalPausedMs: 0,
  lastPauseStart: null,
  isPaused: false,
};

/**
 * Get elapsed session time in minutes (excluding paused time).
 */
export function getSessionDuration(timer) {
  if (!timer.sessionStartTime) return 0;
  const now = Date.now();
  const totalElapsed = now - timer.sessionStartTime;
  const paused = timer.isPaused
    ? timer.totalPausedMs + (now - (timer.lastPauseStart || now))
    : timer.totalPausedMs;
  return Math.max(0, Math.floor((totalElapsed - paused) / 60000));
}

/**
 * Format duration as "Xh Ym".
 */
export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

// ---------------------------------------------------------------------------
// TURN TIMER
// ---------------------------------------------------------------------------

export const TURN_TIMER_TEMPLATE = {
  turnStartTime: null,
  turnDurations: [],    // last N turn durations in ms
  averageTurnMs: 0,
};

/**
 * Get current turn duration in seconds.
 */
export function getCurrentTurnDuration(timer) {
  if (!timer.turnStartTime) return 0;
  return Math.floor((Date.now() - timer.turnStartTime) / 1000);
}

/**
 * Record a completed turn and update average.
 */
export function recordTurnEnd(timer) {
  if (!timer.turnStartTime) return timer;
  const duration = Date.now() - timer.turnStartTime;
  const durations = [...timer.turnDurations, duration].slice(-20); // keep last 20
  const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
  return {
    ...timer,
    turnStartTime: null,
    turnDurations: durations,
    averageTurnMs: avg,
  };
}

/**
 * Format turn duration for display.
 */
export function formatTurnDuration(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// ROUND TRACKER
// ---------------------------------------------------------------------------

export const ROUND_TRACKER_TEMPLATE = {
  currentRound: 1,
  roundStartTimes: [],   // timestamp of each round start
  combatStartTime: null,
};

/**
 * Get total combat duration in seconds.
 */
export function getCombatDuration(tracker) {
  if (!tracker.combatStartTime) return 0;
  return Math.floor((Date.now() - tracker.combatStartTime) / 1000);
}

/**
 * Get in-game time elapsed (each round = 6 seconds).
 */
export function getInGameTime(roundNumber) {
  const totalSeconds = (roundNumber - 1) * 6;
  if (totalSeconds < 60) return `${totalSeconds} seconds`;
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins} minute${mins > 1 ? 's' : ''}`;
}
