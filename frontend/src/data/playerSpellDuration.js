/**
 * playerSpellDuration.js
 * Player Mode Improvements 60: Spell duration countdown timer
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// DURATION TYPES
// ---------------------------------------------------------------------------

export const DURATION_TYPES = {
  instantaneous: { label: 'Instantaneous', rounds: 0, trackable: false },
  '1_round': { label: '1 Round', rounds: 1, trackable: true },
  '1_minute': { label: '1 Minute', rounds: 10, trackable: true },
  '10_minutes': { label: '10 Minutes', rounds: 100, trackable: true },
  '1_hour': { label: '1 Hour', rounds: 600, trackable: true },
  '8_hours': { label: '8 Hours', rounds: 4800, trackable: false },
  '24_hours': { label: '24 Hours', rounds: 14400, trackable: false },
  until_dispelled: { label: 'Until Dispelled', rounds: Infinity, trackable: false },
  special: { label: 'Special', rounds: 0, trackable: false },
};

/**
 * Parse a spell duration string into rounds.
 */
export function parseDuration(durationStr) {
  if (!durationStr) return { rounds: 0, trackable: false, label: 'Unknown' };
  const s = durationStr.toLowerCase().trim();
  if (s === 'instantaneous') return DURATION_TYPES.instantaneous;
  if (s.includes('until dispelled')) return DURATION_TYPES.until_dispelled;

  const roundMatch = s.match(/^(\d+)\s*round/);
  if (roundMatch) return { label: `${roundMatch[1]} Round(s)`, rounds: parseInt(roundMatch[1]), trackable: true };

  const minMatch = s.match(/^(\d+)\s*minute/);
  if (minMatch) return { label: `${minMatch[1]} Minute(s)`, rounds: parseInt(minMatch[1]) * 10, trackable: parseInt(minMatch[1]) <= 10 };

  const hourMatch = s.match(/^(\d+)\s*hour/);
  if (hourMatch) return { label: `${hourMatch[1]} Hour(s)`, rounds: parseInt(hourMatch[1]) * 600, trackable: false };

  return { rounds: 0, trackable: false, label: durationStr };
}

// ---------------------------------------------------------------------------
// ACTIVE SPELL TRACKER
// ---------------------------------------------------------------------------

export const ACTIVE_SPELL_TEMPLATE = {
  name: '',
  level: 0,
  concentration: false,
  roundsRemaining: 0,
  castOnRound: 0,
  caster: '',
};

/**
 * Create an active spell entry.
 */
export function createActiveSpell(name, level, durationStr, currentRound, caster = '', concentration = false) {
  const duration = parseDuration(durationStr);
  return {
    name,
    level,
    concentration,
    roundsRemaining: duration.rounds,
    totalRounds: duration.rounds,
    castOnRound: currentRound,
    caster,
    trackable: duration.trackable,
  };
}

/**
 * Tick all active spells by 1 round.
 */
export function tickActiveSpells(activeSpells) {
  return activeSpells
    .map(spell => ({
      ...spell,
      roundsRemaining: spell.roundsRemaining - 1,
    }))
    .filter(spell => spell.roundsRemaining > 0 || !spell.trackable);
}

/**
 * Get spells about to expire (1-2 rounds remaining).
 */
export function getExpiringSpells(activeSpells) {
  return activeSpells.filter(s => s.trackable && s.roundsRemaining <= 2 && s.roundsRemaining > 0);
}

/**
 * Format rounds remaining as readable time.
 */
export function formatRoundsRemaining(rounds) {
  if (rounds === Infinity) return 'Permanent';
  if (rounds <= 0) return 'Expired';
  if (rounds <= 10) return `${rounds} round${rounds !== 1 ? 's' : ''}`;
  const minutes = Math.floor(rounds / 10);
  const extraRounds = rounds % 10;
  if (extraRounds === 0) return `${minutes} min`;
  return `${minutes} min ${extraRounds} rnd`;
}
