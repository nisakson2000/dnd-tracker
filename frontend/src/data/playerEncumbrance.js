/**
 * playerEncumbrance.js
 * Player Mode Improvements 106-107: Encumbrance calculator and item weight tracking
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// ENCUMBRANCE RULES (PHB variants)
// ---------------------------------------------------------------------------

export const ENCUMBRANCE_RULES = {
  standard: {
    name: 'Standard',
    description: 'Carrying capacity is STR × 15 lbs.',
    getCapacity: (str) => str * 15,
    thresholds: [
      { label: 'Normal', color: '#4ade80', maxPercent: 100 },
    ],
  },
  variant: {
    name: 'Variant Encumbrance',
    description: 'Encumbered at STR × 5, heavily encumbered at STR × 10, max at STR × 15.',
    getCapacity: (str) => str * 15,
    thresholds: [
      { label: 'Unencumbered', color: '#4ade80', maxWeight: (str) => str * 5 },
      { label: 'Encumbered', color: '#fbbf24', maxWeight: (str) => str * 10, penalty: 'Speed -10ft' },
      { label: 'Heavily Encumbered', color: '#f97316', maxWeight: (str) => str * 15, penalty: 'Speed -20ft, disadvantage on STR/DEX/CON checks, saves, and attacks' },
      { label: 'Over Capacity', color: '#ef4444', maxWeight: () => Infinity, penalty: 'Cannot move' },
    ],
  },
};

// ---------------------------------------------------------------------------
// SIZE MODIFIERS
// ---------------------------------------------------------------------------

export const SIZE_CARRY_MULTIPLIERS = {
  Tiny: 0.5,
  Small: 1,
  Medium: 1,
  Large: 2,
  Huge: 4,
  Gargantuan: 8,
};

// ---------------------------------------------------------------------------
// COMMON ITEM WEIGHTS (lbs)
// ---------------------------------------------------------------------------

export const COMMON_WEIGHTS = {
  // Weapons
  'Club': 2, 'Dagger': 1, 'Greatclub': 10, 'Handaxe': 2, 'Javelin': 2,
  'Light Hammer': 2, 'Mace': 4, 'Quarterstaff': 4, 'Sickle': 2, 'Spear': 3,
  'Battleaxe': 4, 'Flail': 2, 'Glaive': 6, 'Greataxe': 7, 'Greatsword': 6,
  'Halberd': 6, 'Lance': 6, 'Longsword': 3, 'Maul': 10, 'Morningstar': 4,
  'Pike': 18, 'Rapier': 2, 'Scimitar': 3, 'Shortsword': 2, 'Trident': 4,
  'War Pick': 2, 'Warhammer': 2, 'Whip': 3,
  'Hand Crossbow': 3, 'Heavy Crossbow': 18, 'Light Crossbow': 5, 'Longbow': 2, 'Shortbow': 2,
  // Armor
  'Padded': 8, 'Leather': 10, 'Studded Leather': 13,
  'Hide': 12, 'Chain Shirt': 20, 'Scale Mail': 45, 'Breastplate': 20, 'Half Plate': 40,
  'Ring Mail': 40, 'Chain Mail': 55, 'Splint': 60, 'Plate': 65,
  'Shield': 6,
  // Misc
  'Potion of Healing': 0.5,
  'Backpack': 5, 'Bedroll': 7, 'Rations (1 day)': 2, 'Rope (50 ft)': 10,
  'Torch': 1, 'Waterskin': 5,
};

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Calculate total carried weight.
 */
export function calculateTotalWeight(items) {
  let total = 0;
  for (const item of items) {
    const weight = item.weight || COMMON_WEIGHTS[item.name] || 0;
    const qty = item.quantity || 1;
    total += weight * qty;
  }
  return Math.round(total * 10) / 10;
}

/**
 * Get carrying capacity for a character.
 */
export function getCarryingCapacity(str, size = 'Medium') {
  const mult = SIZE_CARRY_MULTIPLIERS[size] || 1;
  return str * 15 * mult;
}

/**
 * Get encumbrance status (variant rules).
 */
export function getEncumbranceStatus(totalWeight, str, size = 'Medium') {
  const mult = SIZE_CARRY_MULTIPLIERS[size] || 1;
  const cap = str * 15 * mult;
  const encThreshold = str * 5 * mult;
  const heavyThreshold = str * 10 * mult;

  if (totalWeight > cap) return { label: 'Over Capacity', color: '#ef4444', penalty: 'Cannot move', percent: 100 };
  if (totalWeight > heavyThreshold) return { label: 'Heavily Encumbered', color: '#f97316', penalty: 'Speed -20ft, disadvantage', percent: Math.round((totalWeight / cap) * 100) };
  if (totalWeight > encThreshold) return { label: 'Encumbered', color: '#fbbf24', penalty: 'Speed -10ft', percent: Math.round((totalWeight / cap) * 100) };
  return { label: 'Unencumbered', color: '#4ade80', penalty: null, percent: Math.round((totalWeight / cap) * 100) };
}
