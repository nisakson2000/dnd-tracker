/**
 * playerQuickMathReference.js
 * Player Mode: Quick math reference for common D&D calculations
 * Pure JS — no React dependencies.
 */
import { calcProfBonus } from '../utils/dndHelpers';

export const PROFICIENCY_BY_LEVEL = [
  { levels: '1-4', bonus: '+2' },
  { levels: '5-8', bonus: '+3' },
  { levels: '9-12', bonus: '+4' },
  { levels: '13-16', bonus: '+5' },
  { levels: '17-20', bonus: '+6' },
];

export const ABILITY_MODIFIERS = [
  { score: 1, mod: -5 }, { score: 2, mod: -4 }, { score: 3, mod: -4 },
  { score: 4, mod: -3 }, { score: 5, mod: -3 }, { score: 6, mod: -2 },
  { score: 7, mod: -2 }, { score: 8, mod: -1 }, { score: 9, mod: -1 },
  { score: 10, mod: 0 }, { score: 11, mod: 0 }, { score: 12, mod: 1 },
  { score: 13, mod: 1 }, { score: 14, mod: 2 }, { score: 15, mod: 2 },
  { score: 16, mod: 3 }, { score: 17, mod: 3 }, { score: 18, mod: 4 },
  { score: 19, mod: 4 }, { score: 20, mod: 5 }, { score: 21, mod: 5 },
  { score: 22, mod: 6 }, { score: 23, mod: 6 }, { score: 24, mod: 7 },
  { score: 25, mod: 7 }, { score: 26, mod: 8 }, { score: 27, mod: 8 },
  { score: 28, mod: 9 }, { score: 29, mod: 9 }, { score: 30, mod: 10 },
];

export const COMMON_FORMULAS = [
  { name: 'Attack Roll', formula: '1d20 + ability mod + proficiency bonus', example: '1d20 + 4 (STR) + 3 (prof) = 1d20+7' },
  { name: 'Damage Roll', formula: 'Weapon dice + ability mod', example: '1d8 + 4 (STR) = 1d8+4 longsword' },
  { name: 'Spell Save DC', formula: '8 + proficiency + spellcasting mod', example: '8 + 3 + 4 (WIS) = DC 15' },
  { name: 'Spell Attack', formula: '1d20 + proficiency + spellcasting mod', example: '1d20 + 3 + 4 = 1d20+7' },
  { name: 'AC (Armor)', formula: 'Armor base + DEX mod (limited by armor type)', example: 'Chain Mail 16, Studded Leather 12+DEX' },
  { name: 'AC (Unarmored)', formula: '10 + DEX mod', example: '10 + 3 (DEX) = 13' },
  { name: 'Barbarian Unarmored', formula: '10 + DEX mod + CON mod', example: '10 + 2 + 3 = 15' },
  { name: 'Monk Unarmored', formula: '10 + DEX mod + WIS mod', example: '10 + 4 + 3 = 17' },
  { name: 'Initiative', formula: '1d20 + DEX mod (+ other bonuses)', example: '1d20 + 3 (DEX) = 1d20+3' },
  { name: 'Passive Perception', formula: '10 + WIS mod + proficiency (if proficient)', example: '10 + 3 + 3 = 16' },
  { name: 'Carry Capacity', formula: 'STR score × 15 lbs', example: '16 STR × 15 = 240 lbs' },
  { name: 'Jump (Long)', formula: 'STR score in feet (with 10ft running start)', example: '16 STR = 16 feet long jump' },
  { name: 'Jump (High)', formula: '3 + STR mod feet (with 10ft running start)', example: '3 + 3 = 6 feet high jump' },
  { name: 'Concentration DC', formula: 'MAX(10, damage taken ÷ 2)', example: '22 damage → DC 11' },
  { name: 'Falling Damage', formula: '1d6 per 10ft fallen (max 20d6)', example: '30ft fall = 3d6 damage' },
];

export const XP_BY_LEVEL = [
  { level: 1, xp: 0 }, { level: 2, xp: 300 }, { level: 3, xp: 900 },
  { level: 4, xp: 2700 }, { level: 5, xp: 6500 }, { level: 6, xp: 14000 },
  { level: 7, xp: 23000 }, { level: 8, xp: 34000 }, { level: 9, xp: 48000 },
  { level: 10, xp: 64000 }, { level: 11, xp: 85000 }, { level: 12, xp: 100000 },
  { level: 13, xp: 120000 }, { level: 14, xp: 140000 }, { level: 15, xp: 165000 },
  { level: 16, xp: 195000 }, { level: 17, xp: 225000 }, { level: 18, xp: 265000 },
  { level: 19, xp: 305000 }, { level: 20, xp: 355000 },
];

export function getAbilityMod(score) {
  return Math.floor((score - 10) / 2);
}

/**
 * Canonical implementation: calcProfBonus in utils/dndHelpers.js
 */
export { calcProfBonus as getProficiencyBonus } from '../utils/dndHelpers';

export function calculateAttackBonus(abilityScore, level, isProficient) {
  const mod = getAbilityMod(abilityScore);
  const prof = isProficient ? calcProfBonus(level) : 0;
  return mod + prof;
}

export function calculateSpellSaveDC(spellcastingScore, level) {
  return 8 + calcProfBonus(level) + getAbilityMod(spellcastingScore);
}

export function xpToNextLevel(currentLevel, currentXP) {
  const next = XP_BY_LEVEL.find(x => x.level === currentLevel + 1);
  if (!next) return 0;
  return Math.max(0, next.xp - currentXP);
}
