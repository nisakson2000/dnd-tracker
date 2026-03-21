/**
 * playerXpTracker.js
 * Player Mode Improvements 79: XP to next level progress bar
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// XP THRESHOLDS (D&D 5e)
// ---------------------------------------------------------------------------

export const XP_BY_LEVEL = [
  { level: 1, xpRequired: 0 },
  { level: 2, xpRequired: 300 },
  { level: 3, xpRequired: 900 },
  { level: 4, xpRequired: 2700 },
  { level: 5, xpRequired: 6500 },
  { level: 6, xpRequired: 14000 },
  { level: 7, xpRequired: 23000 },
  { level: 8, xpRequired: 34000 },
  { level: 9, xpRequired: 48000 },
  { level: 10, xpRequired: 64000 },
  { level: 11, xpRequired: 85000 },
  { level: 12, xpRequired: 100000 },
  { level: 13, xpRequired: 120000 },
  { level: 14, xpRequired: 140000 },
  { level: 15, xpRequired: 165000 },
  { level: 16, xpRequired: 195000 },
  { level: 17, xpRequired: 225000 },
  { level: 18, xpRequired: 265000 },
  { level: 19, xpRequired: 305000 },
  { level: 20, xpRequired: 355000 },
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Get the XP required for a given level.
 */
export function getXpForLevel(level) {
  const entry = XP_BY_LEVEL.find(e => e.level === level);
  return entry ? entry.xpRequired : 0;
}

/**
 * Get the XP required for the NEXT level.
 */
export function getXpForNextLevel(currentLevel) {
  if (currentLevel >= 20) return Infinity;
  return getXpForLevel(currentLevel + 1);
}

/**
 * Calculate XP progress toward next level.
 * Returns { currentXp, nextLevelXp, previousLevelXp, progress (0-1), xpNeeded, isMaxLevel }
 */
export function getXpProgress(currentXp, currentLevel) {
  if (currentLevel >= 20) {
    return { currentXp, nextLevelXp: Infinity, previousLevelXp: getXpForLevel(20), progress: 1, xpNeeded: 0, isMaxLevel: true };
  }

  const prevXp = getXpForLevel(currentLevel);
  const nextXp = getXpForLevel(currentLevel + 1);
  const levelRange = nextXp - prevXp;
  const xpIntoLevel = currentXp - prevXp;
  const progress = levelRange > 0 ? Math.min(1, Math.max(0, xpIntoLevel / levelRange)) : 0;

  return {
    currentXp,
    nextLevelXp: nextXp,
    previousLevelXp: prevXp,
    progress,
    xpNeeded: Math.max(0, nextXp - currentXp),
    isMaxLevel: false,
  };
}

/**
 * Determine level from total XP.
 */
export function getLevelFromXp(totalXp) {
  let level = 1;
  for (const entry of XP_BY_LEVEL) {
    if (totalXp >= entry.xpRequired) level = entry.level;
    else break;
  }
  return level;
}

/**
 * Format XP display.
 */
export function formatXp(xp) {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
  return `${xp}`;
}

/**
 * Get progress bar color based on percentage.
 */
export function getProgressColor(progress) {
  if (progress >= 0.9) return '#4ade80';
  if (progress >= 0.5) return '#fbbf24';
  if (progress >= 0.25) return '#60a5fa';
  return '#a78bfa';
}
