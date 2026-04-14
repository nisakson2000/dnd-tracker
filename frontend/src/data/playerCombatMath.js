/**
 * playerCombatMath.js
 * Player Mode: Combat math quick reference (to-hit, damage, save DCs)
 * Pure JS — no React dependencies.
 */

export const ATTACK_ROLL_FORMULA = {
  melee: 'd20 + STR modifier + proficiency bonus (+ magic weapon bonus)',
  ranged: 'd20 + DEX modifier + proficiency bonus (+ magic weapon bonus)',
  finesse: 'd20 + STR or DEX modifier (your choice) + proficiency bonus',
  spell: 'd20 + spellcasting ability modifier + proficiency bonus',
  note: 'Roll ≥ target AC = hit. Natural 20 = auto-hit + crit. Natural 1 = auto-miss.',
};

export const SAVE_DC_FORMULA = {
  spell: '8 + spellcasting ability modifier + proficiency bonus',
  class: '8 + relevant ability modifier + proficiency bonus',
  item: 'Fixed DC listed in item description (usually 13-17)',
  note: 'Target rolls d20 + save modifier ≥ DC to succeed.',
};

export const DAMAGE_MODIFIERS = [
  { modifier: 'Critical Hit', effect: 'Roll all damage dice TWICE (double the dice, not the total). Add modifiers once.', example: '2d6+4 longsword crit = 4d6+4.' },
  { modifier: 'Resistance', effect: 'Half damage (round down).', example: '18 fire damage → 9 with fire resistance.' },
  { modifier: 'Vulnerability', effect: 'Double damage.', example: '18 fire damage → 36 with fire vulnerability.' },
  { modifier: 'Immunity', effect: 'Zero damage.', example: 'Fire elemental takes 0 from fire damage.' },
  { modifier: 'GWM/Sharpshooter', effect: '-5 to hit, +10 damage.', example: 'Worth it against AC 15 or lower (generally).' },
  { modifier: 'Rage (Barbarian)', effect: '+2/+3/+4 to melee damage (level dependent).', example: 'Stacks with everything. Melee only.' },
  { modifier: 'Sneak Attack', effect: 'Extra Xd6 once per turn.', example: 'Scales every other level: 1d6 at 1st, 10d6 at 19th.' },
  { modifier: 'Divine Smite', effect: '2d8 + 1d8 per slot level above 1st.', example: '2nd level slot = 3d8. +1d8 vs undead/fiend.' },
];

export const AC_CALCULATIONS = [
  { type: 'No Armor', formula: '10 + DEX modifier', note: 'Base AC for anyone.' },
  { type: 'Light Armor', formula: 'Armor base + DEX modifier', note: 'Studded Leather: 12 + DEX.' },
  { type: 'Medium Armor', formula: 'Armor base + DEX modifier (max 2)', note: 'Half Plate: 15 + DEX (max 2) = 17.' },
  { type: 'Heavy Armor', formula: 'Armor base (no DEX)', note: 'Plate: 18. Requires STR 15.' },
  { type: 'Shield', formula: '+2 AC', note: 'Stacks with any armor. Requires free hand.' },
  { type: 'Unarmored Defense (Barbarian)', formula: '10 + DEX + CON', note: 'No armor, can use shield.' },
  { type: 'Unarmored Defense (Monk)', formula: '10 + DEX + WIS', note: 'No armor or shield.' },
  { type: 'Natural Armor (Lizardfolk)', formula: '13 + DEX modifier', note: 'Racial feature. Better than light armor at low DEX.' },
  { type: 'Mage Armor (1st)', formula: '13 + DEX modifier', note: 'Spell, lasts 8 hours, no concentration.' },
];

export const PROFICIENCY_BY_LEVEL = [
  { levels: '1-4', bonus: 2 },
  { levels: '5-8', bonus: 3 },
  { levels: '9-12', bonus: 4 },
  { levels: '13-16', bonus: 5 },
  { levels: '17-20', bonus: 6 },
];

export function getAttackBonus(abilityMod, profBonus, magicBonus = 0) {
  return abilityMod + profBonus + magicBonus;
}

export function getSpellSaveDC(castingMod, profBonus) {
  return 8 + castingMod + profBonus;
}

/**
 * Canonical implementation: calcProfBonus in utils/dndHelpers.js
 */
export { calcProfBonus as getProficiencyBonus } from '../utils/dndHelpers';

export function calculateAC(armorBase, dexMod, maxDex = Infinity, shieldBonus = 0) {
  return armorBase + Math.min(dexMod, maxDex) + shieldBonus;
}
