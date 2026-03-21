/**
 * playerHPEstimator.js
 * Player Mode: HP calculation by class and level
 * Pure JS — no React dependencies.
 */

export const HIT_DICE_BY_CLASS = {
  barbarian: 12,
  bard: 8,
  cleric: 8,
  druid: 8,
  fighter: 10,
  monk: 8,
  paladin: 10,
  ranger: 10,
  rogue: 8,
  sorcerer: 6,
  warlock: 8,
  wizard: 6,
};

/**
 * Calculate HP at a given level.
 */
export function calculateHP(className, level, conScore, useAverage = true) {
  const hitDie = HIT_DICE_BY_CLASS[(className || '').toLowerCase()] || 8;
  const conMod = Math.floor((conScore - 10) / 2);

  // Level 1: max hit die + CON mod
  let hp = hitDie + conMod;

  // Levels 2+: average or max per level
  for (let i = 2; i <= level; i++) {
    if (useAverage) {
      hp += Math.floor(hitDie / 2 + 1) + conMod;
    } else {
      hp += hitDie + conMod; // max per level (generous)
    }
  }

  return Math.max(1, hp);
}

/**
 * Get HP per level gain.
 */
export function hpPerLevel(className, conScore, useAverage = true) {
  const hitDie = HIT_DICE_BY_CLASS[(className || '').toLowerCase()] || 8;
  const conMod = Math.floor((conScore - 10) / 2);
  if (useAverage) return Math.floor(hitDie / 2 + 1) + conMod;
  return hitDie + conMod;
}

/**
 * Get toughness feat bonus.
 */
export function toughFeatBonus(level) {
  return level * 2;
}

/**
 * Estimate effective HP (accounting for resistances, healing, etc.)
 */
export function effectiveHP(hp, hasResistanceBPS = false, hasTempHP = 0) {
  let effective = hp + hasTempHP;
  if (hasResistanceBPS) effective *= 2; // resistance doubles effective HP vs physical
  return effective;
}
