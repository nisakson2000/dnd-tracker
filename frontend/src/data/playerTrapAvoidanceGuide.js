/**
 * playerTrapAvoidanceGuide.js
 * Player Mode: Trap detection, disarming, and avoidance strategies
 * Pure JS — no React dependencies.
 */

export const TRAP_DETECTION = [
  { method: 'Passive Perception', note: 'Always active. DM checks vs trap DC.' },
  { method: 'Active Investigation', note: 'Action to search. Hidden mechanisms.' },
  { method: 'Familiar scout', note: 'Send ahead. Triggers trap. Resummon 10 gp.' },
  { method: 'Mage Hand', note: 'Trigger pressure plates from 30ft.' },
  { method: 'Detect Magic (ritual)', note: 'Reveals magical traps. Free.' },
];

export const COMMON_TRAPS = [
  { type: 'Pressure Plate', dc: '10-15', effect: 'Darts, pit, alarm', counter: 'Pole, Mage Hand' },
  { type: 'Tripwire', dc: '10-15', effect: 'Net, alarm, blade', counter: 'Step over, cut' },
  { type: 'Poison Needle', dc: '15-20', effect: 'Poison + condition', counter: 'Mage Hand' },
  { type: 'Pit Trap', dc: '15', effect: 'Fall damage', counter: 'Feather Fall' },
  { type: 'Glyph of Warding', dc: '13+', effect: 'Spell or 5d8', counter: 'Dispel Magic' },
];

export const TRAP_TIPS = [
  'Observant feat: +5 passive Perception.',
  'Send familiar first. 10 gp < HP.',
  'Mage Hand: trigger from 30ft.',
  'Detect Magic ritual: free trap detection.',
  'Rogue leads in trapped dungeons.',
  'Absorb Elements or Shield on trigger.',
  'Arcane Eye at L4: scout from safety.',
];
