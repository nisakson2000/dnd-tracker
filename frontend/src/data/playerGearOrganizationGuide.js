/**
 * playerGearOrganizationGuide.js
 * Player Mode: Inventory, carrying capacity, essential gear, and storage
 * Pure JS — no React dependencies.
 */

export const ESSENTIAL_GEAR = [
  { item: 'Rope (50ft)', cost: '1-10 gp', weight: '5-10 lb', use: 'Climbing, tying, rescue.', rating: 'S+' },
  { item: 'Healing Potion', cost: '50 gp', weight: '0.5 lb', use: '2d4+2 HP emergency heal.', rating: 'S' },
  { item: 'Ball Bearings', cost: '1 gp', weight: '2 lb', use: '10×10ft prone trap.', rating: 'A' },
  { item: 'Caltrops', cost: '1 gp', weight: '2 lb', use: '5×5ft speed 0 trap.', rating: 'A' },
  { item: '10ft Pole', cost: '5 cp', weight: '7 lb', use: 'Trigger traps, poke things.', rating: 'A' },
  { item: 'Crowbar', cost: '2 gp', weight: '5 lb', use: 'Advantage on pry checks.', rating: 'A' },
  { item: 'Mirror', cost: '5 gp', weight: '0.5 lb', use: 'Look around corners. Medusa defense.', rating: 'A' },
  { item: 'Manacles', cost: '2 gp', weight: '6 lb', use: 'Restrain prisoners. DC 20 STR.', rating: 'B+' },
  { item: 'Holy Water', cost: '25 gp', weight: '1 lb', use: '2d6 radiant vs undead.', rating: 'A' },
];

export const CARRYING_CAPACITY = {
  normal: 'STR × 15 pounds.',
  encumbered: 'STR × 5: -10ft speed.',
  heavilyEncumbered: 'STR × 10: -20ft speed + disadvantage.',
  note: 'Most tables ignore encumbrance. Ask DM.',
};

export const STORAGE_ITEMS = [
  { item: 'Bag of Holding', capacity: '500 lb, 64 cu ft. Always 15 lb.', note: 'Essential. Every party needs one.' },
  { item: 'Handy Haversack', capacity: '120 lb. Items always on top.', note: 'Better item access than Bag of Holding.' },
  { item: 'Portable Hole', capacity: '280 cu ft. Folds to cloth.', note: 'NEVER combine with Bag of Holding.' },
];

export const GEAR_TIPS = [
  'Bag of Holding: get ASAP. 500 lb capacity.',
  'Always carry rope, healing potion, light source.',
  'Ball bearings + caltrops: 1 gp encounter-changers.',
  '10ft pole: test for traps and mimics.',
  'NEVER put Bag of Holding in Portable Hole. Astral rift = TPK.',
  'Mundane gear solves encounters. Don\'t ignore it.',
];
