/**
 * playerArmorClassGuide.js
 * Player Mode: AC calculation, armor types, and how to maximize your AC
 * Pure JS — no React dependencies.
 */

export const AC_CALCULATION = {
  base: 'Without armor: 10 + DEX modifier',
  lightArmor: 'Armor AC + DEX modifier (no cap)',
  mediumArmor: 'Armor AC + DEX modifier (max +2)',
  heavyArmor: 'Armor AC (DEX doesn\'t apply)',
  shield: '+2 AC (can combine with any armor)',
  note: 'AC formulas DON\'T stack. You choose one base AC calculation.',
};

export const ARMOR_TABLE = [
  { name: 'Padded', type: 'Light', ac: '11 + DEX', cost: '5 gp', stealth: 'Disadvantage', weight: '8 lb' },
  { name: 'Leather', type: 'Light', ac: '11 + DEX', cost: '10 gp', stealth: 'Normal', weight: '10 lb' },
  { name: 'Studded Leather', type: 'Light', ac: '12 + DEX', cost: '45 gp', stealth: 'Normal', weight: '13 lb' },
  { name: 'Hide', type: 'Medium', ac: '12 + DEX (max 2)', cost: '10 gp', stealth: 'Normal', weight: '12 lb' },
  { name: 'Chain Shirt', type: 'Medium', ac: '13 + DEX (max 2)', cost: '50 gp', stealth: 'Normal', weight: '20 lb' },
  { name: 'Scale Mail', type: 'Medium', ac: '14 + DEX (max 2)', cost: '50 gp', stealth: 'Disadvantage', weight: '45 lb' },
  { name: 'Breastplate', type: 'Medium', ac: '14 + DEX (max 2)', cost: '400 gp', stealth: 'Normal', weight: '20 lb' },
  { name: 'Half Plate', type: 'Medium', ac: '15 + DEX (max 2)', cost: '750 gp', stealth: 'Disadvantage', weight: '40 lb' },
  { name: 'Ring Mail', type: 'Heavy', ac: '14', cost: '30 gp', stealth: 'Disadvantage', weight: '40 lb', strReq: 0 },
  { name: 'Chain Mail', type: 'Heavy', ac: '16', cost: '75 gp', stealth: 'Disadvantage', weight: '55 lb', strReq: 13 },
  { name: 'Splint', type: 'Heavy', ac: '17', cost: '200 gp', stealth: 'Disadvantage', weight: '60 lb', strReq: 15 },
  { name: 'Plate', type: 'Heavy', ac: '18', cost: '1500 gp', stealth: 'Disadvantage', weight: '65 lb', strReq: 15 },
];

export const UNARMORED_DEFENSE = {
  Barbarian: { formula: '10 + DEX mod + CON mod', note: 'No armor, no shield required. DEX 16 + CON 16 = AC 16. Gets better as stats improve.' },
  Monk: { formula: '10 + DEX mod + WIS mod', note: 'No armor, no shield. DEX 20 + WIS 20 = AC 20. Best unarmored AC in the game at high levels.' },
  Draconic_Sorcerer: { formula: '13 + DEX mod', note: 'Natural armor from Draconic Resilience. Like permanent Mage Armor.' },
};

export const AC_BOOSTERS = [
  { source: 'Shield (equipment)', bonus: '+2', duration: 'Permanent (while equipped)', note: 'Requires proficiency. Occupies one hand.' },
  { source: 'Shield (spell)', bonus: '+5', duration: 'Reaction, until your next turn', note: '1st level. Reaction. Best defensive spell in the game.' },
  { source: 'Mage Armor', bonus: '13 + DEX', duration: '8 hours, no concentration', note: 'Cast before combat. Better than any light armor for DEX 14+.' },
  { source: 'Shield of Faith', bonus: '+2', duration: 'Concentration, 10 minutes', note: 'Cleric/Paladin. Stacks with everything. Concentration cost.' },
  { source: 'Haste', bonus: '+2', duration: 'Concentration, 1 minute', note: 'Plus doubled speed, extra action, advantage on DEX saves.' },
  { source: 'Defensive Duelist', bonus: '+proficiency', duration: 'Reaction (one attack)', note: 'Finesse weapon required. Proficiency can be +6 at high levels.' },
  { source: 'Half Cover', bonus: '+2', duration: 'Positional', note: 'Trees, low walls, furniture. Also +2 to DEX saves.' },
  { source: 'Three-Quarter Cover', bonus: '+5', duration: 'Positional', note: 'Arrow slits, thick trees. Also +5 to DEX saves.' },
  { source: '+1/+2/+3 Armor', bonus: '+1/+2/+3', duration: 'Permanent (magic item)', note: 'Plate Armor +1 = AC 19. +2 = AC 20. +3 = AC 21.' },
  { source: 'Ring/Cloak of Protection', bonus: '+1', duration: 'Permanent (attunement)', note: '+1 AC AND +1 to all saves. Very efficient attunement.' },
];

export const AC_BREAKPOINTS = {
  description: 'How AC relates to enemy hit chance (assuming +5 to hit)',
  breakpoints: [
    { ac: 12, hitChance: '70%', note: 'Low. Most attacks hit. Wizards without Mage Armor.' },
    { ac: 14, hitChance: '60%', note: 'Average for light armor users.' },
    { ac: 16, hitChance: '50%', note: 'Good. Chain Mail. 50/50 hit rate.' },
    { ac: 17, hitChance: '45%', note: 'Splint or Studded Leather + DEX 20.' },
    { ac: 18, hitChance: '40%', note: 'Plate or Half Plate + Shield.' },
    { ac: 19, hitChance: '35%', note: 'Plate + Shield. Excellent.' },
    { ac: 20, hitChance: '30%', note: 'Plate + Shield + Defense style or magic.' },
    { ac: 21, hitChance: '25%', note: '+1 Plate + Shield. Enemies struggle.' },
    { ac: 23, hitChance: '15%', note: 'Shield spell range. Nearly untouchable.' },
    { ac: 25, hitChance: '5%', note: 'Only nat 20 hits. Temporary with stacking.' },
  ],
};

export function calculateAC(armorAC, dexMod, armorType, hasShield, bonuses) {
  let ac = armorAC;

  if (armorType === 'light' || armorType === 'none') {
    ac += dexMod;
  } else if (armorType === 'medium') {
    ac += Math.min(dexMod, 2);
  }
  // Heavy armor: no DEX

  if (hasShield) ac += 2;
  ac += bonuses.reduce((sum, b) => sum + b, 0);

  return ac;
}

export function bestArmorForDex(dexMod) {
  if (dexMod >= 5) return { armor: 'Studded Leather', ac: 12 + dexMod, note: 'DEX 20: AC 17 with no stealth penalty.' };
  if (dexMod >= 2) return { armor: 'Half Plate or Breastplate', ac: 15 + 2, note: 'AC 17 with DEX +2. Breastplate has no stealth disadvantage.' };
  return { armor: 'Plate', ac: 18, note: 'AC 18 regardless of DEX. Best for low-DEX characters.' };
}

export function hitChance(attackBonus, targetAC) {
  const needed = targetAC - attackBonus;
  return Math.min(95, Math.max(5, (21 - needed) * 5));
}
