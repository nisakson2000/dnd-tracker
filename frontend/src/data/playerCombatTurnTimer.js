/**
 * playerCombatTurnTimer.js
 * Player Mode: Turn timer to encourage faster play
 * Pure JS — no React dependencies.
 */

export const TURN_TIME_TARGETS = {
  quick: { seconds: 30, label: 'Speed Run', color: '#4caf50', tip: 'For experienced players. "I attack, 23 to hit, 14 damage. Done."' },
  normal: { seconds: 60, label: 'Standard', color: '#2196f3', tip: 'Reasonable for most turns. Decide before your turn.' },
  complex: { seconds: 90, label: 'Complex Turn', color: '#ff9800', tip: 'Multi-spell, multiple attacks with decisions, or unusual situations.' },
  firstTime: { seconds: 120, label: 'New Player', color: '#9c27b0', tip: 'Learning the game. Take your time, but start building speed.' },
};

export const SPEED_TIPS = [
  'Decide your action BEFORE your turn starts. Plan during other players\' turns.',
  'Pre-roll your dice. DM says your turn, you announce the result immediately.',
  'Know your numbers: attack bonus, save DC, damage dice, AC, HP.',
  'Roll attack AND damage dice simultaneously.',
  'If choosing between two options and can\'t decide, pick the simpler one.',
  'Read your spell descriptions between sessions, not during your turn.',
  'Use a spell card or cheat sheet with your most common spells.',
  'Announce your total, not the math: "22 to hit" not "I rolled 14 plus 5 plus 3..."',
];

export const TURN_PHASES_TIMING = [
  { phase: 'Start-of-turn effects', suggestedTime: '5s', detail: 'Automatic effects. Should be instant.' },
  { phase: 'Movement decision', suggestedTime: '10s', detail: 'Should be pre-planned. Just confirm.' },
  { phase: 'Action', suggestedTime: '15s', detail: 'Announce + roll. Should be your main decision.' },
  { phase: 'Bonus Action', suggestedTime: '10s', detail: 'Quick. Usually a simple choice.' },
  { phase: 'End-of-turn saves', suggestedTime: '5s', detail: 'Automatic rolls. Quick.' },
];

export function createTurnTimer() {
  return {
    startTime: null,
    endTime: null,
    running: false,
    elapsed: 0,
    history: [],
  };
}

export function startTimer(timer) {
  return { ...timer, startTime: Date.now(), running: true, elapsed: 0 };
}

export function stopTimer(timer) {
  const elapsed = timer.startTime ? (Date.now() - timer.startTime) / 1000 : 0;
  return {
    ...timer,
    endTime: Date.now(),
    running: false,
    elapsed: Math.round(elapsed * 10) / 10,
    history: [...timer.history, elapsed],
  };
}

export function getAverageTurnTime(timer) {
  if (!timer.history.length) return 0;
  return Math.round(timer.history.reduce((a, b) => a + b, 0) / timer.history.length * 10) / 10;
}

export function getTurnRating(seconds) {
  if (seconds <= 30) return TURN_TIME_TARGETS.quick;
  if (seconds <= 60) return TURN_TIME_TARGETS.normal;
  if (seconds <= 90) return TURN_TIME_TARGETS.complex;
  return TURN_TIME_TARGETS.firstTime;
}
