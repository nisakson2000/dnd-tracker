/**
 * playerWeightManagement.js
 * Player Mode: Carrying capacity, encumbrance, and weight management
 * Pure JS — no React dependencies.
 */

export const CARRYING_RULES = {
  normal: 'STR × 15 lbs. STR 10 = 150 lbs.',
  pushDragLift: 'STR × 30 lbs.',
  sizeModifiers: { Tiny: 0.5, Small: 1, Medium: 1, Large: 2, Huge: 4 },
};

export const ENCUMBRANCE = {
  encumbered: 'Weight > STR × 5: speed -10ft.',
  heavilyEncumbered: 'Weight > STR × 10: speed -20ft, disadvantage on STR/DEX/CON checks/attacks/saves.',
  note: 'Most tables don\'t use strict encumbrance. Check with DM.',
};

export const COMMON_WEIGHTS = [
  { item: 'Longsword', weight: 3 }, { item: 'Greatsword', weight: 6 },
  { item: 'Shield', weight: 6 }, { item: 'Chain mail', weight: 55 },
  { item: 'Plate', weight: 65 }, { item: 'Leather', weight: 10 },
  { item: '50 gold coins', weight: 1 }, { item: 'Rations (1 day)', weight: 2 },
  { item: 'Rope (50ft)', weight: 10 },
];

export const WEIGHT_SOLUTIONS = [
  { solution: 'Bag of Holding', capacity: '500 lbs', weight: '15 lbs' },
  { solution: 'Handy Haversack', capacity: '120 lbs', weight: '5 lbs' },
  { solution: 'Tenser\'s Floating Disk (ritual)', capacity: '500 lbs', weight: '0' },
  { solution: 'Mule', capacity: '420 lbs', weight: 'N/A' },
];

export function capacity(str, sizeMult) { return str * 15 * (sizeMult || 1); }
export function isEncumbered(str, weight) {
  if (weight > str * 10) return 'heavily';
  if (weight > str * 5) return 'encumbered';
  return 'fine';
}
