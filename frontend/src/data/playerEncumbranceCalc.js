/**
 * playerEncumbranceCalc.js
 * Player Mode: Encumbrance calculation and weight tracking
 * Pure JS — no React dependencies.
 */

export const CARRY_CAPACITY_RULES = {
  normal: { formula: 'STR × 15', unit: 'lbs', description: 'Maximum weight you can carry.' },
  push: { formula: 'STR × 30', unit: 'lbs', description: 'Maximum weight you can push, drag, or lift. Speed = 5ft while doing so.' },
  encumbered: { formula: 'STR × 5', unit: 'lbs', description: 'Variant rule: -10 speed when carrying over this weight.' },
  heavilyEncumbered: { formula: 'STR × 10', unit: 'lbs', description: 'Variant rule: -20 speed, disadvantage on STR/DEX/CON checks, attacks, and saves.' },
};

export const SIZE_MULTIPLIERS = {
  Tiny: 0.5,
  Small: 1,
  Medium: 1,
  Large: 2,
  Huge: 4,
  Gargantuan: 8,
};

export const COMMON_WEIGHTS = {
  weapons: [
    { item: 'Dagger', weight: 1 },
    { item: 'Shortsword', weight: 2 },
    { item: 'Longsword', weight: 3 },
    { item: 'Greataxe', weight: 7 },
    { item: 'Longbow', weight: 2 },
    { item: 'Shield', weight: 6 },
  ],
  armor: [
    { item: 'Leather Armor', weight: 10 },
    { item: 'Chain Shirt', weight: 20 },
    { item: 'Chain Mail', weight: 55 },
    { item: 'Plate Armor', weight: 65 },
  ],
  adventuring: [
    { item: 'Backpack', weight: 5 },
    { item: 'Bedroll', weight: 7 },
    { item: 'Rations (1 day)', weight: 2 },
    { item: 'Rope (50ft)', weight: 10 },
    { item: 'Torch', weight: 1 },
    { item: 'Waterskin', weight: 5 },
    { item: 'Potion of Healing', weight: 0.5 },
  ],
  coins: { per50: 1, note: '50 coins = 1 lb regardless of type.' },
};

export const WEIGHT_REDUCERS = [
  { item: 'Bag of Holding', capacity: '500 lbs / 64 cu ft', actualWeight: '15 lbs', notes: 'Always weighs 15 lbs regardless of contents. Piercing it destroys contents.' },
  { item: 'Handy Haversack', capacity: '120 lbs total', actualWeight: '5 lbs', notes: 'Desired item always on top. Three pouches.' },
  { item: 'Portable Hole', capacity: '282,600 lbs (theoretical)', actualWeight: '0 lbs', notes: '6ft diameter, 10ft deep cylinder. Placing inside Bag of Holding = Astral Plane rift!' },
  { item: 'Quiver of Ehlonna', capacity: '60 arrows + 18 javelins + 6 bows', actualWeight: '2 lbs', notes: 'Perfect for archer builds.' },
];

export function calculateCarryCapacity(strScore, size) {
  const multiplier = SIZE_MULTIPLIERS[size] || 1;
  return strScore * 15 * multiplier;
}

export function getEncumbranceLevel(strScore, currentWeight, size) {
  const multiplier = SIZE_MULTIPLIERS[size] || 1;
  const encThreshold = strScore * 5 * multiplier;
  const heavyThreshold = strScore * 10 * multiplier;
  const maxCapacity = strScore * 15 * multiplier;

  if (currentWeight > maxCapacity) return { level: 'Over Capacity', color: '#f44336', penalty: 'Cannot move' };
  if (currentWeight > heavyThreshold) return { level: 'Heavily Encumbered', color: '#ff5722', penalty: '-20 speed, disadvantage on STR/DEX/CON' };
  if (currentWeight > encThreshold) return { level: 'Encumbered', color: '#ff9800', penalty: '-10 speed' };
  return { level: 'Normal', color: '#4caf50', penalty: 'None' };
}

export function coinWeight(totalCoins) {
  return totalCoins / 50;
}
