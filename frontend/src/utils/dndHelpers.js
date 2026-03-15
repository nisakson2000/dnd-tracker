/**
 * Shared D&D utility functions.
 * Consolidates commonly duplicated helpers across the codebase.
 */

/** Calculate ability score modifier: (score - 10) / 2, rounded down. */
export function calcMod(score) {
  const s = typeof score === 'number' && !isNaN(score) ? score : 10;
  return Math.floor((s - 10) / 2);
}

/** Calculate proficiency bonus from character level (5e rules). */
export function calcProfBonus(level) {
  const lvl = parseInt(level) || 1;
  if (lvl >= 17) return 6;
  if (lvl >= 13) return 5;
  if (lvl >= 9) return 4;
  if (lvl >= 5) return 3;
  return 2;
}

/** Pick a random element from an array. */
export function pick(arr) {
  if (!arr || arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Random integer between min and max (inclusive). */
export function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 5e skill-to-ability mapping (Title Case keys, full ability names). */
export const SKILL_ABILITY_MAP = {
  Athletics: 'Strength',
  Acrobatics: 'Dexterity',
  'Sleight of Hand': 'Dexterity',
  Stealth: 'Dexterity',
  Arcana: 'Intelligence',
  History: 'Intelligence',
  Investigation: 'Intelligence',
  Nature: 'Intelligence',
  Religion: 'Intelligence',
  'Animal Handling': 'Wisdom',
  Insight: 'Wisdom',
  Medicine: 'Wisdom',
  Perception: 'Wisdom',
  Survival: 'Wisdom',
  Deception: 'Charisma',
  Intimidation: 'Charisma',
  Performance: 'Charisma',
  Persuasion: 'Charisma',
};

/** Standard 6 abilities (abbreviated). */
export const ABILITIES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

/** Full ability names. */
export const ABILITY_NAMES = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'];
