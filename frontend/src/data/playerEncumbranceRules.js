/**
 * playerEncumbranceRules.js
 * Player Mode: Carrying capacity, encumbrance variants, and weight management
 * Pure JS — no React dependencies.
 */

export const CARRYING_RULES = {
  standard: {
    name: 'Standard (most tables)',
    capacity: 'STR × 15 pounds',
    effect: 'If over capacity, speed drops to 0. That\'s it. Binary.',
    note: 'Most tables use this and ignore weight entirely unless it\'s obviously absurd.',
  },
  variant: {
    name: 'Variant Encumbrance',
    encumbered: 'STR × 5: Speed -10ft',
    heavilyEncumbered: 'STR × 10: Speed -20ft, disadvantage on STR/DEX/CON checks and saves',
    maximum: 'STR × 15: Can\'t move',
    note: 'More realistic but more bookkeeping. Popular in gritty campaigns.',
  },
};

export const CARRYING_CAPACITY_TABLE = [
  { str: 8, standard: 120, encumbered: 40, heavy: 80 },
  { str: 10, standard: 150, encumbered: 50, heavy: 100 },
  { str: 12, standard: 180, encumbered: 60, heavy: 120 },
  { str: 14, standard: 210, encumbered: 70, heavy: 140 },
  { str: 16, standard: 240, encumbered: 80, heavy: 160 },
  { str: 18, standard: 270, encumbered: 90, heavy: 180 },
  { str: 20, standard: 300, encumbered: 100, heavy: 200 },
  { str: 24, standard: 360, encumbered: 120, heavy: 240 },
  { str: 30, standard: 450, encumbered: 150, heavy: 300 },
];

export const SIZE_MULTIPLIERS = {
  Tiny: { carry: 0.5, push: 0.5 },
  Small: { carry: 1, push: 1 },
  Medium: { carry: 1, push: 1 },
  Large: { carry: 2, push: 2 },
  Huge: { carry: 4, push: 4 },
  Gargantuan: { carry: 8, push: 8 },
};

export const COMMON_EQUIPMENT_WEIGHTS = [
  { item: 'Chain Mail', weight: 55, note: 'Heaviest common armor. Nearly half of STR 8 capacity.' },
  { item: 'Plate Armor', weight: 65, note: 'The heaviest. Needs STR 15 just to wear, and it weighs 65 lbs.' },
  { item: 'Longbow', weight: 2, note: 'Light for the damage it does.' },
  { item: 'Greatsword', weight: 6, note: 'Heavy weapon but only 6 lbs.' },
  { item: 'Shield', weight: 6, note: '+2 AC for 6 lbs. Always worth it.' },
  { item: 'Explorer\'s Pack', weight: 59, note: 'Includes bedroll, mess kit, rations, waterskin, rope, etc.' },
  { item: 'Dungeoneer\'s Pack', weight: 61.5, note: 'Similar to explorer\'s but with pitons, crowbar, etc.' },
  { item: '50 ft Rope', weight: 10, note: 'Hemp rope. Silk rope is 5 lbs for the same length.' },
  { item: '1000 coins', weight: 50, note: '50 coins = 1 lb. 1000 gold weighs 20 lbs. Gems are lighter.' },
  { item: 'Rations (1 day)', weight: 2, note: '10 days of food = 20 lbs. Goodberry fixes this.' },
];

export const WEIGHT_SOLUTIONS = [
  { solution: 'Bag of Holding', capacity: '500 lbs / 64 cubic ft', weight: 15, rarity: 'Uncommon', note: 'The classic. Always weighs 15 lbs regardless of contents. Fragile — don\'t put inside another extradimensional space.' },
  { solution: 'Handy Haversack', capacity: '120 lbs total', weight: 5, rarity: 'Rare', note: 'Desired item is always on top. 3 compartments. Lighter than Bag of Holding.' },
  { solution: 'Portable Hole', capacity: '~282 cubic ft', weight: 'Negligible', rarity: 'Rare', note: '6ft × 10ft deep hole. Folds to handkerchief. DO NOT put inside Bag of Holding (Astral Plane explosion).' },
  { solution: 'Tenser\'s Floating Disk', capacity: '500 lbs', weight: '0 (spell)', rarity: 'Spell (1st, ritual)', note: 'Ritual cast. Follows you at 20ft. Lasts 1 hour. Free pack mule.' },
  { solution: 'Beast of burden', capacity: '480 lbs (mule)', weight: 'N/A', rarity: '8 gp', note: 'Mule has STR 14, carrying capacity 210 lbs + 270 lbs drag.' },
  { solution: 'Ant Haul (variant)', capacity: 'Triple carry capacity', weight: 'N/A', rarity: 'Spell (if available)', note: 'Not RAW 5e but common houserule from Pathfinder. Ask your DM.' },
];

export function calculateCapacity(str, size, variant) {
  const mult = SIZE_MULTIPLIERS[size || 'Medium']?.carry || 1;
  const base = str * 15 * mult;
  if (!variant) return { capacity: base, encumbered: null, heavy: null };
  return {
    capacity: base,
    encumbered: str * 5 * mult,
    heavy: str * 10 * mult,
  };
}

export function checkEncumbrance(totalWeight, str, size, variant) {
  const caps = calculateCapacity(str, size, variant);
  if (totalWeight > caps.capacity) return { status: 'Overloaded', effect: 'Speed is 0. Can\'t move.' };
  if (variant && totalWeight > caps.heavy) return { status: 'Heavily Encumbered', effect: 'Speed -20ft, disadvantage on STR/DEX/CON.' };
  if (variant && totalWeight > caps.encumbered) return { status: 'Encumbered', effect: 'Speed -10ft.' };
  return { status: 'Fine', effect: 'No penalties.' };
}
