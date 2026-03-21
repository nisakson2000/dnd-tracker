/**
 * playerEncumbranceCarryGuide.js
 * Player Mode: Carrying capacity, encumbrance, and weight management
 * Pure JS — no React dependencies.
 */

export const CARRYING_RULES = {
  capacity: 'STR score × 15 = max carrying weight (lbs).',
  push: 'STR × 30 = push/drag/lift weight.',
  tiny: 'Tiny: halved capacity.',
  large: 'Large: doubled. Huge: ×4. Gargantuan: ×8.',
  example: 'STR 10 = 150 lbs carry. STR 20 = 300 lbs carry.',
};

export const ENCUMBRANCE_VARIANT = {
  rule: 'Optional rule (PHB). Many tables ignore weight.',
  encumbered: 'Carry > STR × 5: -10ft speed.',
  heavilyEncumbered: 'Carry > STR × 10: -20ft speed. Disadvantage on attacks, saves, STR/DEX/CON checks.',
  example: 'STR 10: encumbered at 50+ lbs. Heavily at 100+ lbs.',
};

export const COMMON_EQUIPMENT_WEIGHTS = [
  { item: 'Chain Mail', weight: '55 lbs', note: 'Heavy. Low STR characters struggle.' },
  { item: 'Plate Armor', weight: '65 lbs', note: 'Heaviest armor.' },
  { item: 'Shield', weight: '6 lbs', note: 'Light.' },
  { item: 'Longsword', weight: '3 lbs', note: 'Standard weapon.' },
  { item: 'Greatsword', weight: '6 lbs', note: 'Heavy weapon.' },
  { item: 'Longbow', weight: '2 lbs', note: 'Light ranged weapon.' },
  { item: 'Explorer\'s Pack', weight: '59 lbs', note: 'Full pack is heavy.' },
  { item: 'Dungeoneer\'s Pack', weight: '61.5 lbs', note: 'Heavier than Explorer\'s.' },
  { item: '50ft Rope', weight: '10 lbs', note: 'Essential but heavy.' },
  { item: 'Rations (1 day)', weight: '2 lbs', note: '10 days = 20 lbs.' },
  { item: 'Coins (50)', weight: '1 lb', note: '1000 gold = 20 lbs.' },
];

export const STORAGE_SOLUTIONS = [
  { item: 'Bag of Holding', capacity: '500 lbs / 64 cu ft', weight: '15 lbs', rating: 'S+', note: 'Best storage. Uncommon. Party essential.' },
  { item: 'Handy Haversack', capacity: '120 lbs total (3 pouches)', weight: '5 lbs', rating: 'A+', note: 'Retrieve items as BA.' },
  { item: 'Portable Hole', capacity: '~26,000 lbs (6ft×10ft cylinder)', weight: 'Negligible', rating: 'S', note: 'Massive storage. Rare.' },
  { item: 'Bag of Holding + Portable Hole', capacity: 'DO NOT COMBINE', weight: 'N/A', rating: 'DANGER', note: 'Combining destroys both and opens gate to Astral Plane.' },
  { item: 'Pack mule/horse', capacity: '480 lbs (mule)', weight: 'N/A', rating: 'A', note: 'Cheap. Can\'t enter dungeons.' },
  { item: 'Floating Disk (Tasha\'s)', capacity: '500 lbs', weight: 'None', rating: 'A+', note: 'Ritual. Follows you. 1 hour.' },
];

export const ENCUMBRANCE_TIPS = [
  'STR × 15 = carry limit. Know your number.',
  'Bag of Holding: 500 lbs in 15 lb bag. Get one early.',
  'Don\'t track weight if your table doesn\'t. But know the rules.',
  'Heavy armor + weapons + pack = easily 100+ lbs for martial.',
  'Coins weigh up: 1000 gold = 20 lbs. Convert to gems/platinum.',
  'Floating Disk (ritual): carry 500 lbs. Free to cast.',
  'STR 8 = 120 lbs max. Wizards in plate = struggle.',
  'Mules carry 480 lbs. Cheap logistics solution.',
  'NEVER put Bag of Holding inside Portable Hole (or vice versa).',
  'Encumbrance variant: STR × 5 = slow. STR × 10 = very slow.',
];
