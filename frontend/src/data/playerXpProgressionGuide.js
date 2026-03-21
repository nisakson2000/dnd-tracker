/**
 * Player XP Progression Guide — D&D 5e Level-Up XP Utility
 *
 * Pure data helper for XP tracking and level progression.
 * Thresholds sourced from the 5e PHB / DMG.
 *
 * Exports:
 *   XP_THRESHOLDS          – array indexed by level (0 unused, 1-20 valid)
 *   getXpForLevel(level)   – XP required to reach a given level
 *   getLevelFromXp(totalXp) – derive level from raw XP total
 *   getXpProgress(currentXp, currentLevel) – progress toward next level
 */

// ── XP Thresholds by Level ──
// Index 0 is a placeholder so XP_THRESHOLDS[level] works directly.
export const XP_THRESHOLDS = [
  0,       // 0  (unused)
  0,       // 1
  300,     // 2
  900,     // 3
  2700,    // 4
  6500,    // 5
  14000,   // 6
  23000,   // 7
  34000,   // 8
  48000,   // 9
  64000,   // 10
  85000,   // 11
  100000,  // 12
  120000,  // 13
  140000,  // 14
  165000,  // 15
  195000,  // 16
  225000,  // 17
  265000,  // 18
  305000,  // 19
  355000,  // 20
];

/**
 * Get the XP required to reach a given level.
 * @param {number} level – 1 through 20
 * @returns {number} XP threshold for that level
 */
export function getXpForLevel(level) {
  const clamped = Math.min(20, Math.max(1, level));
  return XP_THRESHOLDS[clamped];
}

/**
 * Derive the character level from a raw XP total.
 * @param {number} totalXp – the character's accumulated XP
 * @returns {number} level (1-20)
 */
export function getLevelFromXp(totalXp) {
  const xp = Math.max(0, totalXp);
  for (let lvl = 20; lvl >= 1; lvl--) {
    if (xp >= XP_THRESHOLDS[lvl]) return lvl;
  }
  return 1;
}

/**
 * Calculate progress toward the next level.
 * @param {number} currentXp    – the character's accumulated XP
 * @param {number} currentLevel – the character's current level (1-20)
 * @returns {{ currentXp: number, nextLevelXp: number|null, progressPercent: number, xpNeeded: number }}
 *   - currentXp:       echo of the input XP
 *   - nextLevelXp:     XP required for the next level (null at 20)
 *   - progressPercent: 0-100 indicating progress between current and next level
 *   - xpNeeded:        XP still required to reach the next level (0 at 20)
 */
export function getXpProgress(currentXp, currentLevel) {
  const level = Math.min(20, Math.max(1, currentLevel));
  const xp = Math.max(0, currentXp);

  // Already max level
  if (level >= 20) {
    return { currentXp: xp, nextLevelXp: null, progressPercent: 100, xpNeeded: 0 };
  }

  const currentThreshold = XP_THRESHOLDS[level];
  const nextThreshold = XP_THRESHOLDS[level + 1];
  const span = nextThreshold - currentThreshold;
  const earned = Math.min(xp - currentThreshold, span);
  const progressPercent = span > 0 ? Math.min(100, Math.max(0, Math.round((earned / span) * 100))) : 100;
  const xpNeeded = Math.max(0, nextThreshold - xp);

  return { currentXp: xp, nextLevelXp: nextThreshold, progressPercent, xpNeeded };
}
