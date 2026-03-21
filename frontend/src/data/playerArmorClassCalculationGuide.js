/**
 * playerArmorClassCalculationGuide.js
 * Player Mode: AC calculation — all methods compared
 * Pure JS — no React dependencies.
 */

export const AC_CALCULATION_METHODS = [
  { method: 'No Armor', formula: '10 + DEX mod', note: 'Default. Very low. Most characters wear armor.' },
  { method: 'Light Armor', examples: [
    { armor: 'Padded', ac: '11 + DEX', stealth: 'Disadvantage', cost: '5gp' },
    { armor: 'Leather', ac: '11 + DEX', stealth: 'None', cost: '10gp' },
    { armor: 'Studded Leather', ac: '12 + DEX', stealth: 'None', cost: '45gp' },
  ]},
  { method: 'Medium Armor', examples: [
    { armor: 'Hide', ac: '12 + DEX (max 2)', stealth: 'None', cost: '10gp' },
    { armor: 'Chain Shirt', ac: '13 + DEX (max 2)', stealth: 'None', cost: '50gp' },
    { armor: 'Scale Mail', ac: '14 + DEX (max 2)', stealth: 'Disadvantage', cost: '50gp' },
    { armor: 'Breastplate', ac: '14 + DEX (max 2)', stealth: 'None', cost: '400gp' },
    { armor: 'Half Plate', ac: '15 + DEX (max 2)', stealth: 'Disadvantage', cost: '750gp' },
  ]},
  { method: 'Heavy Armor', examples: [
    { armor: 'Ring Mail', ac: 14, stealth: 'Disadvantage', cost: '30gp', strReq: 'None' },
    { armor: 'Chain Mail', ac: 16, stealth: 'Disadvantage', cost: '75gp', strReq: 'STR 13' },
    { armor: 'Splint', ac: 17, stealth: 'Disadvantage', cost: '200gp', strReq: 'STR 15' },
    { armor: 'Plate', ac: 18, stealth: 'Disadvantage', cost: '1500gp', strReq: 'STR 15' },
  ]},
  { method: 'Shield', bonus: '+2 AC', note: 'Stacks with any armor. Requires one free hand.' },
];

export const ALTERNATIVE_AC = [
  { source: 'Unarmored Defense (Barbarian)', formula: '10 + DEX + CON', note: 'No armor. DEX 20 + CON 20 = AC 20.' },
  { source: 'Unarmored Defense (Monk)', formula: '10 + DEX + WIS', note: 'No armor, no shield. DEX 20 + WIS 20 = AC 20.' },
  { source: 'Mage Armor', formula: '13 + DEX', note: 'Spell (L1). Lasts 8 hours. No concentration.' },
  { source: 'Natural Armor (Lizardfolk)', formula: '13 + DEX', note: 'Same as Mage Armor. No spell needed.' },
  { source: 'Natural Armor (Tortle)', formula: '17 flat', note: 'No DEX bonus. Always AC 17. Shell Defense: AC 21 (can\'t attack).' },
  { source: 'Natural Armor (Loxodon)', formula: '12 + CON', note: 'CON-based. Good for non-DEX builds.' },
  { source: 'Armored Casing (Autognome)', formula: '13 + DEX', note: 'Free Mage Armor equivalent.' },
  { source: 'Draconic Resilience (Sorcerer)', formula: '13 + DEX', note: 'Draconic Bloodline feature.' },
  { source: 'Bladesong (Wizard)', formula: 'Light armor + INT', note: 'Add INT to AC while Bladesinging. Stacks.' },
];

export const AC_STACKING = {
  rules: [
    'Base AC formulas don\'t stack. Choose one (armor, Unarmored Defense, Mage Armor, etc.).',
    'Bonuses (Shield spell, Haste, Shield item) DO stack with base AC.',
    'Shield (item, +2) and Shield (spell, +5) stack with each other.',
  ],
  maxAC: [
    { build: 'Fighter (Plate 18 + Shield 2 + Defense 1)', ac: 21, note: 'Standard heavy armor tank.' },
    { build: 'Above + Shield spell', ac: 26, note: 'With Shield spell reaction.' },
    { build: 'Bladesinger (13+DEX 5+INT 5 + Shield spell)', ac: 28, note: 'Highest possible without magic items.' },
    { build: 'Forge Cleric (Plate 18 + Shield 2 + Blessing 1 + Soul 1 + Shield of Faith 2)', ac: 24, note: 'Without Shield spell.' },
    { build: 'Warforged Fighter (Plate 18 + Shield 2 + Defense 1 + Warforged 1)', ac: 22, note: 'Warforged integrated protection.' },
  ],
};

export const AC_BREAKPOINTS = [
  { ac: 14, note: 'Minimum for frontline. Most L1-4 enemies hit this easily.' },
  { ac: 16, note: 'Decent. Chain mail. Enemies need 12+ to hit.' },
  { ac: 18, note: 'Good. Plate or equivalent. Enemies need 14+ to hit.' },
  { ac: 20, note: 'Great. Plate + Shield. Most enemies miss more than they hit.' },
  { ac: 22, note: 'Excellent. Magic items or features. Very hard to hit.' },
  { ac: 25, note: 'With Shield spell. Temporary but nearly unhittable.' },
];

export function calculateAC(baseAC, dexMod, hasShield, shieldSpell, other) {
  let total = baseAC + dexMod;
  if (hasShield) total += 2;
  if (shieldSpell) total += 5;
  total += (other || 0);
  return { ac: total, note: `AC: ${total}` };
}
