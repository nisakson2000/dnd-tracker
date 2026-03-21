/**
 * playerInventoryManagementGuide.js
 * Player Mode: Inventory organization, carrying capacity, and essential gear
 * Pure JS — no React dependencies.
 */

export const CARRYING_CAPACITY = {
  normal: 'STR score × 15 = max carry weight in pounds.',
  pushDragLift: 'STR score × 30 = max push/drag/lift (speed = 5ft while doing so).',
  encumbrance: {
    variant: 'Optional variant rule (PHB p.176):',
    levels: [
      { threshold: 'STR × 5', effect: 'No penalty.' },
      { threshold: 'STR × 10', effect: 'Encumbered: speed -10ft.' },
      { threshold: 'STR × 15', effect: 'Heavily encumbered: speed -20ft, disadvantage on STR/DEX/CON checks/saves/attacks.' },
    ],
  },
  sizeModifiers: {
    tiny: '×0.5 carrying capacity',
    small: '×1 (same as Medium)',
    medium: '×1',
    large: '×2',
    huge: '×4',
  },
};

export const ESSENTIAL_ADVENTURING_GEAR = [
  // Must-haves
  { item: 'Rope (50ft, hempen)', weight: '10 lbs', cost: '1gp', note: 'Climbing, tying, escaping. Always carry rope.', priority: 1 },
  { item: 'Healer\'s Kit', weight: '3 lbs', cost: '5gp', note: '10 uses. Auto-stabilize without check. Essential.', priority: 1 },
  { item: 'Rations (per day)', weight: '2 lbs', cost: '5sp', note: 'Carry 3-5 days minimum for emergencies.', priority: 1 },
  { item: 'Waterskin', weight: '5 lbs (full)', cost: '2sp', note: 'Hydration. 4 pints. Lasts 1 day.', priority: 1 },
  { item: 'Torch (×5)', weight: '5 lbs', cost: '5cp', note: 'Light source. 1 hour each. Backup if cantrips unavailable.', priority: 2 },
  { item: 'Tinderbox', weight: '1 lb', cost: '5sp', note: 'Start fires. Light torches. Essential utility.', priority: 2 },

  // Highly useful
  { item: 'Ball Bearings (bag of 1000)', weight: '2 lbs', cost: '1gp', note: 'Area denial. DEX save or prone. 10ft square.', priority: 2 },
  { item: 'Caltrops (bag of 20)', weight: '2 lbs', cost: '1gp', note: 'Area denial. Speed reduction. Covers 5ft square.', priority: 2 },
  { item: 'Pitons (×10)', weight: '2.5 lbs', cost: '5cp each', note: 'Spike into walls for climbing anchors. Jam doors shut.', priority: 2 },
  { item: 'Manacles', weight: '6 lbs', cost: '2gp', note: 'Restrain prisoners. DC 20 STR to break. DC 15 DEX to escape.', priority: 3 },
  { item: '10-foot Pole', weight: '7 lbs', cost: '5cp', note: 'Prod for traps. Test floors. Reach things from distance.', priority: 3 },
  { item: 'Crowbar', weight: '5 lbs', cost: '2gp', note: '+2 (advantage in some cases) to STR checks to pry things open.', priority: 3 },
  { item: 'Mirror (steel)', weight: '0.5 lbs', cost: '5gp', note: 'Look around corners without exposing yourself. Check for medusa.', priority: 3 },
  { item: 'Holy Water', weight: '1 lb', cost: '25gp', note: '2d6 radiant vs fiends/undead. Consecrate items. Splash weapon.', priority: 3 },
  { item: 'Antitoxin', weight: '—', cost: '50gp', note: 'Advantage on saves vs poison for 1 hour. Carry 1-2.', priority: 2 },
];

export const BAG_OF_HOLDING = {
  item: 'Bag of Holding',
  rarity: 'Uncommon',
  weight: '15 lbs (regardless of contents)',
  capacity: '500 lbs / 64 cubic feet',
  keyRules: [
    'Putting a Bag of Holding inside another extradimensional space (Portable Hole, Handy Haversack) creates a portal to the Astral Plane and both items are destroyed.',
    'If the bag is overloaded, pierced, or turned inside out, contents scatter in the Astral Plane.',
    'Breathing creatures inside have 10 minutes of air (divided by number of creatures).',
    'Retrieving an item requires your action.',
  ],
  note: 'Every party should have one. Eliminates carry weight concerns. Just don\'t put it in a Portable Hole.',
};

export const INVENTORY_ORGANIZATION_TIPS = [
  { tip: 'Keep "combat belt" items accessible', detail: 'Potions, holy water, alchemist\'s fire on your belt. Free object interaction to grab.' },
  { tip: 'Bag of Holding for bulk items', detail: 'Rations, rope, tools, loot go in the Bag. Keep only essential items on person.' },
  { tip: 'Track encumbrance loosely', detail: 'Most groups ignore weight. But know your limits for edge cases (climbing, swimming, flying).' },
  { tip: 'Distribute party loot fairly', detail: 'Split gold evenly. Assign magic items based on who benefits most. Keep a party treasure log.' },
  { tip: 'Know what you can draw for free', detail: 'One free object interaction per turn. Plan ahead: draw weapon before combat if possible.' },
];

export function carryingCapacity(strScore, sizeCategory = 'Medium') {
  const multipliers = { Tiny: 0.5, Small: 1, Medium: 1, Large: 2, Huge: 4 };
  return strScore * 15 * (multipliers[sizeCategory] || 1);
}

export function isEncumbered(totalWeight, strScore) {
  if (totalWeight > strScore * 15) return 'Over capacity';
  if (totalWeight > strScore * 10) return 'Heavily encumbered (-20ft speed, disadvantage)';
  if (totalWeight > strScore * 5) return 'Encumbered (-10ft speed)';
  return 'Not encumbered';
}
