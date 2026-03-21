/**
 * playerCombatRoundTracker.js
 * Player Mode: Track combat rounds, turns, and duration effects
 * Pure JS — no React dependencies.
 */

export const ROUND_EVENTS = {
  startOfRound: [
    'Check lair actions (initiative 20)',
    'Environmental effects trigger',
    'Any "at the start of each round" effects',
  ],
  startOfTurn: [
    'Regeneration effects (Trolls, etc.)',
    'Aura damage (Spirit Guardians, Aura of Vitality)',
    'Conditions with "start of your turn" effects',
    'Concentration check reminders',
  ],
  endOfTurn: [
    'Repeat saving throws vs conditions (Hold Person, Frightened, etc.)',
    'Effects that end "at the end of your turn"',
    'Mark duration spells (1 round closer to expiring)',
    'Ongoing damage (e.g., burning, acid)',
  ],
  endOfRound: [
    'Increment round counter',
    '10 rounds = 1 minute',
    'Check minute-duration spells/effects',
  ],
};

export function createRoundTracker() {
  return {
    round: 0,
    currentTurn: 0,
    initiativeOrder: [],
    activeEffects: [],
    combatStartTime: null,
    combatActive: false,
  };
}

export function startCombat(tracker) {
  return {
    ...tracker,
    round: 1,
    currentTurn: 0,
    combatStartTime: Date.now(),
    combatActive: true,
  };
}

export function nextTurn(tracker) {
  const nextIdx = tracker.currentTurn + 1;
  if (nextIdx >= tracker.initiativeOrder.length) {
    return { ...tracker, round: tracker.round + 1, currentTurn: 0 };
  }
  return { ...tracker, currentTurn: nextIdx };
}

export function addEffect(tracker, effect) {
  return {
    ...tracker,
    activeEffects: [...tracker.activeEffects, {
      name: effect.name,
      startRound: tracker.round,
      durationRounds: effect.durationRounds || null,
      source: effect.source || 'Unknown',
      concentration: effect.concentration || false,
    }],
  };
}

export function getExpiredEffects(tracker) {
  return tracker.activeEffects.filter(e =>
    e.durationRounds && (tracker.round - e.startRound) >= e.durationRounds
  );
}

export function getElapsedTime(tracker) {
  const seconds = tracker.round * 6;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return { rounds: tracker.round, seconds, minutes, display: `${minutes}m ${remainingSeconds}s (${tracker.round} rounds)` };
}
