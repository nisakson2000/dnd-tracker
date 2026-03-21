/**
 * playerEncumbranceCarryingGuide.js
 * Player Mode: Carrying capacity and encumbrance rules
 * Pure JS — no React dependencies.
 */

export const CARRYING_CAPACITY = {
  standard: 'STR score × 15 = max lbs you can carry.',
  heavy: 'STR score × 30 = max lbs you can push, drag, or lift (speed 5ft while doing so).',
  sizeModifiers: {
    tiny: '× 0.5',
    small: '× 1',
    medium: '× 1',
    large: '× 2',
    huge: '× 4',
    gargantuan: '× 8',
  },
  note: 'STR 10 = 150 lbs carry. STR 20 = 300 lbs. Most games don\'t track this closely.',
};

export const ENCUMBRANCE_VARIANT = {
  rule: 'Optional variant rule from PHB. More realistic but more bookkeeping.',
  levels: [
    { level: 'Unencumbered', threshold: '0 to STR×5', penalty: 'None', note: 'Normal movement.' },
    { level: 'Encumbered', threshold: 'STR×5 to STR×10', penalty: 'Speed -10ft', note: 'Noticeable weight.' },
    { level: 'Heavily Encumbered', threshold: 'STR×10 to STR×15', penalty: 'Speed -20ft, disadvantage on ability checks/attacks/saves (STR/DEX/CON)', note: 'Can barely move.' },
  ],
};

export const EQUIPMENT_WEIGHTS = [
  { category: 'Heavy Armor', examples: 'Chain Mail (55 lbs), Splint (60), Plate (65)', note: 'Heavy armor weighs a LOT.' },
  { category: 'Medium Armor', examples: 'Scale Mail (45), Breastplate (20), Half Plate (40)', note: 'Breastplate is lightest medium.' },
  { category: 'Light Armor', examples: 'Leather (10), Studded Leather (13)', note: 'Minimal weight.' },
  { category: 'Weapons', examples: 'Longsword (3), Greatsword (6), Longbow (2), Shield (6)', note: 'Weapons are relatively light.' },
  { category: 'Adventuring Gear', examples: 'Rope 50ft (10), Rations/day (2), Bedroll (7), Tent (20)', note: 'Adds up quickly.' },
  { category: 'Coins', examples: '50 coins = 1 lb', note: '1000gp = 20 lbs. Wealth has weight.' },
];

export const SOLVING_ENCUMBRANCE = [
  { solution: 'Bag of Holding', detail: 'Holds 500 lbs in a 2 lb bag. Solves everything.', rating: 'S' },
  { solution: 'Portable Hole', detail: '6ft diameter extradimensional hole. Much more space.', rating: 'S', note: 'DON\'T put in Bag of Holding = Astral Plane rift.' },
  { solution: 'Handy Haversack', detail: '120 lbs. Retrieve items as BA. Cheaper than Bag of Holding.', rating: 'A' },
  { solution: 'Tenser\'s Floating Disk (L1 ritual)', detail: 'Follows you. Carries 500 lbs. 1 hour.', rating: 'A', note: 'Ritual = free. Recast every hour.' },
  { solution: 'Mule/Horse', detail: 'Carry capacity 420 lbs (mule) or 480 lbs (horse).', rating: 'B+', note: 'Can\'t go in dungeons. Good for overland.' },
  { solution: 'Unseen Servant (L1 ritual)', detail: 'Carry up to 30 lbs. Basic tasks. 1 hour.', rating: 'B', note: 'Low weight limit but ritual castable.' },
  { solution: 'High STR', detail: 'STR 20 = 300 lb carry. Solve it with stats.', rating: 'A', note: 'Not viable for low-STR casters.' },
];

export const PRACTICAL_TIPS = [
  'Most tables don\'t track encumbrance strictly. Ask your DM.',
  'Bag of Holding is uncommon — buyable by L2-3 in most campaigns.',
  'If your DM tracks encumbrance: prioritize Bag of Holding in downtime.',
  'Breastplate (20 lbs) vs Plate (65 lbs): big difference if encumbrance matters.',
  'Gold weighs 50 coins/lb. Convert excess gold to gems (lightweight).',
  'Don\'t carry 500ft of rope "just in case." Pack smart.',
];
