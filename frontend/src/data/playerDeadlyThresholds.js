/**
 * playerDeadlyThresholds.js
 * Player Mode: Encounter difficulty reference for the party
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// XP THRESHOLDS BY CHARACTER LEVEL (per character)
// ---------------------------------------------------------------------------

export const XP_THRESHOLDS = {
  1:  { easy: 25,   medium: 50,   hard: 75,    deadly: 100 },
  2:  { easy: 50,   medium: 100,  hard: 150,   deadly: 200 },
  3:  { easy: 75,   medium: 150,  hard: 225,   deadly: 400 },
  4:  { easy: 125,  medium: 250,  hard: 375,   deadly: 500 },
  5:  { easy: 250,  medium: 500,  hard: 750,   deadly: 1100 },
  6:  { easy: 300,  medium: 600,  hard: 900,   deadly: 1400 },
  7:  { easy: 350,  medium: 750,  hard: 1100,  deadly: 1700 },
  8:  { easy: 450,  medium: 900,  hard: 1400,  deadly: 2100 },
  9:  { easy: 550,  medium: 1100, hard: 1600,  deadly: 2400 },
  10: { easy: 600,  medium: 1200, hard: 1900,  deadly: 2800 },
  11: { easy: 800,  medium: 1600, hard: 2400,  deadly: 3600 },
  12: { easy: 1000, medium: 2000, hard: 3000,  deadly: 4500 },
  13: { easy: 1100, medium: 2200, hard: 3400,  deadly: 5100 },
  14: { easy: 1250, medium: 2500, hard: 3800,  deadly: 5700 },
  15: { easy: 1400, medium: 2800, hard: 4300,  deadly: 6400 },
  16: { easy: 1600, medium: 3200, hard: 4800,  deadly: 7200 },
  17: { easy: 2000, medium: 3900, hard: 5900,  deadly: 8800 },
  18: { easy: 2100, medium: 4200, hard: 6300,  deadly: 9500 },
  19: { easy: 2400, medium: 4900, hard: 7300,  deadly: 10900 },
  20: { easy: 2800, medium: 5700, hard: 8500,  deadly: 12700 },
};

// ---------------------------------------------------------------------------
// DIFFICULTY COLORS
// ---------------------------------------------------------------------------

export const DIFFICULTY_COLORS = {
  easy: '#4ade80',
  medium: '#fbbf24',
  hard: '#f97316',
  deadly: '#ef4444',
  trivial: '#94a3b8',
};

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Get party XP thresholds for an encounter.
 */
export function getPartyThresholds(partyLevels) {
  const thresholds = { easy: 0, medium: 0, hard: 0, deadly: 0 };
  for (const level of partyLevels) {
    const t = XP_THRESHOLDS[level] || XP_THRESHOLDS[1];
    thresholds.easy += t.easy;
    thresholds.medium += t.medium;
    thresholds.hard += t.hard;
    thresholds.deadly += t.deadly;
  }
  return thresholds;
}

/**
 * Determine encounter difficulty.
 */
export function getEncounterDifficulty(adjustedXp, partyThresholds) {
  if (adjustedXp >= partyThresholds.deadly) return { level: 'deadly', color: DIFFICULTY_COLORS.deadly };
  if (adjustedXp >= partyThresholds.hard) return { level: 'hard', color: DIFFICULTY_COLORS.hard };
  if (adjustedXp >= partyThresholds.medium) return { level: 'medium', color: DIFFICULTY_COLORS.medium };
  if (adjustedXp >= partyThresholds.easy) return { level: 'easy', color: DIFFICULTY_COLORS.easy };
  return { level: 'trivial', color: DIFFICULTY_COLORS.trivial };
}
