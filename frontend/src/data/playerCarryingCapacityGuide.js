/**
 * playerCarryingCapacityGuide.js
 * Player Mode: Carrying capacity and encumbrance rules
 * Pure JS — no React dependencies.
 */

export const CARRYING_BASICS = {
  standard: 'Carry: STR × 15 lbs. Push/drag/lift: STR × 30 lbs.',
  variant_encumbrance: 'Optional rule. STR × 5 = encumbered (-10ft speed). STR × 10 = heavily encumbered (-20ft, disadvantage on STR/DEX/CON checks and saves).',
  note: 'Most tables ignore encumbrance entirely. If using variant encumbrance, STR matters much more.',
};

export const CARRYING_CAPACITY_TABLE = [
  { str: 8, carry: 120, pushDragLift: 240, encumbered: 40, heavilyEncumbered: 80 },
  { str: 10, carry: 150, pushDragLift: 300, encumbered: 50, heavilyEncumbered: 100 },
  { str: 12, carry: 180, pushDragLift: 360, encumbered: 60, heavilyEncumbered: 120 },
  { str: 14, carry: 210, pushDragLift: 420, encumbered: 70, heavilyEncumbered: 140 },
  { str: 16, carry: 240, pushDragLift: 480, encumbered: 80, heavilyEncumbered: 160 },
  { str: 18, carry: 270, pushDragLift: 540, encumbered: 90, heavilyEncumbered: 180 },
  { str: 20, carry: 300, pushDragLift: 600, encumbered: 100, heavilyEncumbered: 200 },
];

export const SIZE_MODIFIERS = [
  { size: 'Tiny', multiplier: 0.5, note: 'Half capacity. Familiars, pixies.' },
  { size: 'Small', multiplier: 1, note: 'Same as Medium. Halflings, gnomes.' },
  { size: 'Medium', multiplier: 1, note: 'Standard. Humans, elves, dwarves.' },
  { size: 'Large', multiplier: 2, note: 'Double capacity. Centaurs (Powerful Build counts as Large).' },
  { size: 'Huge', multiplier: 4, note: 'Quadruple. Giants, dragons.' },
  { size: 'Gargantuan', multiplier: 8, note: '8× capacity. Ancient dragons, tarrasque.' },
];

export const POWERFUL_BUILD_RACES = [
  'Goliath', 'Firbolg', 'Bugbear', 'Orc', 'Loxodon', 'Centaur',
];

export const COMMON_EQUIPMENT_WEIGHTS = [
  { item: 'Plate Armor', weight: 65, note: 'Heaviest standard armor.' },
  { item: 'Chain Mail', weight: 55, note: 'Common heavy armor.' },
  { item: 'Half Plate', weight: 40, note: 'Best medium armor.' },
  { item: 'Shield', weight: 6, note: '+2 AC.' },
  { item: 'Greatsword', weight: 6, note: '2d6 damage.' },
  { item: 'Longbow', weight: 2, note: '1d8 damage, 150/600ft.' },
  { item: 'Explorer\'s Pack', weight: 59, note: 'Standard adventuring gear.' },
  { item: 'Dungeoneer\'s Pack', weight: 61.5, note: 'Dungeon crawling gear.' },
  { item: '50ft Rope', weight: 10, note: 'Essential utility.' },
  { item: '1000 coins', weight: 20, note: '50 coins = 1 lb. Coins add up fast.' },
];

export const ENCUMBRANCE_TIPS = [
  { tip: 'Bag of Holding', detail: 'Holds 500 lbs / 64 cubic feet. Weighs only 15 lbs. Solves all carrying problems.', priority: 'S' },
  { tip: 'Handy Haversack', detail: 'Holds 120 lbs. Weighs 5 lbs. Retrieval as BA. Budget Bag of Holding.', priority: 'A' },
  { tip: 'Portable Hole', detail: '6ft×10ft cylinder. Holds massive amounts. Folds to handkerchief size.', priority: 'A' },
  { tip: 'Tenser\'s Floating Disk', detail: 'Ritual: carries 500 lbs. Follows you. 1 hour duration. Free with ritual casting.', priority: 'A' },
  { tip: 'Mule/Horse', detail: 'Mule: STR 14 = 420 lbs carry. Costs 8gp. Low-tech solution.', priority: 'B' },
  { tip: 'Leave gold in a bank', detail: 'Don\'t carry 10,000 gold coins (200 lbs). Use gems, letters of credit, or banks.', priority: 'B' },
];

export function carryingCapacity(str, sizeMultiplier = 1, hasPowerfulBuild = false) {
  const effectiveMultiplier = hasPowerfulBuild ? sizeMultiplier * 2 : sizeMultiplier;
  return { carry: str * 15 * effectiveMultiplier, pushDragLift: str * 30 * effectiveMultiplier };
}

export function encumbranceThresholds(str) {
  return { encumbered: str * 5, heavilyEncumbered: str * 10, carry: str * 15 };
}
