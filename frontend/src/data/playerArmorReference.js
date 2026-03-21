/**
 * playerArmorReference.js
 * Player Mode: Armor types, AC calculation, and stealth penalties
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// ARMOR TYPES
// ---------------------------------------------------------------------------

export const LIGHT_ARMOR = [
  { name: 'Padded', ac: 11, addDex: true, maxDex: null, stealthDisadv: true, weight: 8, cost: 5 },
  { name: 'Leather', ac: 11, addDex: true, maxDex: null, stealthDisadv: false, weight: 10, cost: 10 },
  { name: 'Studded Leather', ac: 12, addDex: true, maxDex: null, stealthDisadv: false, weight: 13, cost: 45 },
];

export const MEDIUM_ARMOR = [
  { name: 'Hide', ac: 12, addDex: true, maxDex: 2, stealthDisadv: false, weight: 12, cost: 10 },
  { name: 'Chain Shirt', ac: 13, addDex: true, maxDex: 2, stealthDisadv: false, weight: 20, cost: 50 },
  { name: 'Scale Mail', ac: 14, addDex: true, maxDex: 2, stealthDisadv: true, weight: 45, cost: 50 },
  { name: 'Breastplate', ac: 14, addDex: true, maxDex: 2, stealthDisadv: false, weight: 20, cost: 400 },
  { name: 'Half Plate', ac: 15, addDex: true, maxDex: 2, stealthDisadv: true, weight: 40, cost: 750 },
];

export const HEAVY_ARMOR = [
  { name: 'Ring Mail', ac: 14, addDex: false, maxDex: 0, stealthDisadv: true, weight: 40, cost: 30, strReq: null },
  { name: 'Chain Mail', ac: 16, addDex: false, maxDex: 0, stealthDisadv: true, weight: 55, cost: 75, strReq: 13 },
  { name: 'Splint', ac: 17, addDex: false, maxDex: 0, stealthDisadv: true, weight: 60, cost: 200, strReq: 15 },
  { name: 'Plate', ac: 18, addDex: false, maxDex: 0, stealthDisadv: true, weight: 65, cost: 1500, strReq: 15 },
];

export const SHIELDS = [
  { name: 'Shield', acBonus: 2, weight: 6, cost: 10 },
];

// ---------------------------------------------------------------------------
// UNARMORED DEFENSE
// ---------------------------------------------------------------------------

export const UNARMORED_DEFENSE = [
  { className: 'Barbarian', formula: '10 + DEX mod + CON mod', shield: true },
  { className: 'Monk', formula: '10 + DEX mod + WIS mod', shield: false },
  { className: 'Draconic Sorcerer', formula: '13 + DEX mod', shield: false },
  { className: 'Default', formula: '10 + DEX mod', shield: true },
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Calculate AC for a given armor setup.
 */
export function calculateAC(armor, dexMod, hasShield = false, magicBonus = 0) {
  let ac;
  if (!armor) {
    // Unarmored
    ac = 10 + dexMod;
  } else if (armor.addDex) {
    const dexBonus = armor.maxDex !== null ? Math.min(dexMod, armor.maxDex) : dexMod;
    ac = armor.ac + dexBonus;
  } else {
    ac = armor.ac;
  }

  if (hasShield) ac += 2;
  ac += magicBonus;
  return ac;
}

/**
 * Get all armor.
 */
export function getAllArmor() {
  return [...LIGHT_ARMOR, ...MEDIUM_ARMOR, ...HEAVY_ARMOR];
}

/**
 * Find armor by name.
 */
export function getArmor(name) {
  return getAllArmor().find(a => a.name.toLowerCase() === (name || '').toLowerCase()) || null;
}

/**
 * Check if character meets STR requirement.
 */
export function meetsStrRequirement(armor, strScore) {
  if (!armor?.strReq) return true;
  return strScore >= armor.strReq;
}

/**
 * Get speed penalty for heavy armor without meeting STR requirement.
 */
export function getArmorSpeedPenalty(armor, strScore) {
  if (!armor?.strReq) return 0;
  return strScore < armor.strReq ? -10 : 0;
}
