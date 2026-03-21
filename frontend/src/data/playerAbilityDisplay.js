/**
 * playerAbilityDisplay.js
 * Player Mode Improvements 61-80: Quick reference data for ability scores, proficiency, vision, etc.
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// ABILITY SCORE DETAILS
// ---------------------------------------------------------------------------

export const ABILITIES = [
  { id: 'str', name: 'Strength', abbr: 'STR', color: '#ef4444', skills: ['Athletics'] },
  { id: 'dex', name: 'Dexterity', abbr: 'DEX', color: '#f97316', skills: ['Acrobatics', 'Sleight of Hand', 'Stealth'] },
  { id: 'con', name: 'Constitution', abbr: 'CON', color: '#eab308', skills: [] },
  { id: 'int', name: 'Intelligence', abbr: 'INT', color: '#3b82f6', skills: ['Arcana', 'History', 'Investigation', 'Nature', 'Religion'] },
  { id: 'wis', name: 'Wisdom', abbr: 'WIS', color: '#22c55e', skills: ['Animal Handling', 'Insight', 'Medicine', 'Perception', 'Survival'] },
  { id: 'cha', name: 'Charisma', abbr: 'CHA', color: '#a855f7', skills: ['Deception', 'Intimidation', 'Performance', 'Persuasion'] },
];

/**
 * Calculate ability modifier from score.
 */
export function getModifier(score) {
  return Math.floor((score - 10) / 2);
}

/**
 * Format modifier as "+X" or "-X".
 */
export function formatModifier(mod) {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

// ---------------------------------------------------------------------------
// PASSIVE SCORES
// ---------------------------------------------------------------------------

export const PASSIVE_SKILLS = [
  { skill: 'Perception', ability: 'wis', description: 'Noticing hidden things without actively searching' },
  { skill: 'Investigation', ability: 'int', description: 'Deducing information without actively investigating' },
  { skill: 'Insight', ability: 'wis', description: 'Reading social cues without actively checking' },
];

/**
 * Calculate passive score: 10 + modifier + proficiency (if proficient).
 */
export function calculatePassive(abilityScore, proficiencyBonus = 0, isProficient = false, hasAdvantage = false, hasDisadvantage = false) {
  const mod = getModifier(abilityScore);
  let passive = 10 + mod + (isProficient ? proficiencyBonus : 0);
  if (hasAdvantage) passive += 5;
  if (hasDisadvantage) passive -= 5;
  return passive;
}

// ---------------------------------------------------------------------------
// PROFICIENCY BONUS BY LEVEL
// ---------------------------------------------------------------------------

export const PROFICIENCY_BY_LEVEL = [
  0, // level 0 (placeholder)
  2, 2, 2, 2,   // 1-4
  3, 3, 3, 3,   // 5-8
  4, 4, 4, 4,   // 9-12
  5, 5, 5, 5,   // 13-16
  6, 6, 6, 6,   // 17-20
];

/**
 * Get proficiency bonus for a character level.
 */
export function getProficiencyBonus(level) {
  if (level < 1) return 2;
  if (level > 20) return 6;
  return PROFICIENCY_BY_LEVEL[level];
}

// ---------------------------------------------------------------------------
// VISION TYPES
// ---------------------------------------------------------------------------

export const VISION_TYPES = [
  { id: 'normal', label: 'Normal Vision', range: null, description: 'Standard human sight.' },
  { id: 'darkvision', label: 'Darkvision', range: 60, description: 'See in dim light as bright light, darkness as dim light (grayscale).' },
  { id: 'superior_darkvision', label: 'Superior Darkvision', range: 120, description: 'Extended darkvision (Drow, Deep Gnome).' },
  { id: 'blindsight', label: 'Blindsight', range: 10, description: 'Perceive surroundings without sight within range.' },
  { id: 'tremorsense', label: 'Tremorsense', range: 60, description: 'Detect creatures touching the same ground.' },
  { id: 'truesight', label: 'Truesight', range: 120, description: 'See through illusions, shapechangers, and into the Ethereal Plane.' },
];

// ---------------------------------------------------------------------------
// XP THRESHOLDS
// ---------------------------------------------------------------------------

export const XP_BY_LEVEL = [
  0, 0, 300, 900, 2700, 6500,           // 0-5
  14000, 23000, 34000, 48000, 64000,     // 6-10
  85000, 100000, 120000, 140000, 165000, // 11-15
  195000, 225000, 265000, 305000, 355000, // 16-20
];

/**
 * Get XP progress to next level.
 */
export function getXpProgress(currentXp, currentLevel) {
  if (currentLevel >= 20) return { current: currentXp, needed: 0, percent: 100, nextLevel: 20 };
  const currentThreshold = XP_BY_LEVEL[currentLevel] || 0;
  const nextThreshold = XP_BY_LEVEL[currentLevel + 1] || 0;
  const xpInLevel = currentXp - currentThreshold;
  const xpNeeded = nextThreshold - currentThreshold;
  return {
    current: xpInLevel,
    needed: xpNeeded,
    percent: xpNeeded > 0 ? Math.min(100, Math.floor((xpInLevel / xpNeeded) * 100)) : 100,
    nextLevel: currentLevel + 1,
  };
}

// ---------------------------------------------------------------------------
// ARMOR CLASS BREAKDOWN
// ---------------------------------------------------------------------------

export const AC_FORMULAS = {
  unarmored: { formula: '10 + DEX mod', description: 'No armor equipped' },
  'light armor': { formula: 'Armor base + DEX mod', description: 'Leather, Studded Leather, etc.' },
  'medium armor': { formula: 'Armor base + DEX mod (max 2)', description: 'Chain Shirt, Breastplate, etc.' },
  'heavy armor': { formula: 'Armor base (no DEX)', description: 'Chain Mail, Plate, etc.' },
  'unarmored defense (barbarian)': { formula: '10 + DEX mod + CON mod', description: 'Barbarian Unarmored Defense' },
  'unarmored defense (monk)': { formula: '10 + DEX mod + WIS mod', description: 'Monk Unarmored Defense' },
  'natural armor': { formula: '13 + DEX mod (Lizardfolk/Tortle)', description: 'Racial natural armor' },
  mage_armor: { formula: '13 + DEX mod', description: 'Mage Armor spell (8 hours)' },
  shield: { bonus: 2, description: '+2 AC from a shield' },
};
