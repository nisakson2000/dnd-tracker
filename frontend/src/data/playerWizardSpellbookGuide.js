/**
 * playerWizardSpellbookGuide.js
 * Player Mode: Wizard spellbook — copying, preparation, and protection
 * Pure JS — no React dependencies.
 */

export const SPELLBOOK_RULES = {
  starting: 'L1: 6 spells in spellbook.',
  perLevel: '+2 new wizard spells per level.',
  preparation: 'Prepare INT mod + wizard level spells each long rest.',
  rituals: 'Ritual spells from spellbook without preparing.',
  copying: '2 hours + 50gp per spell level. School: half cost/time.',
  note: 'Spellbook IS your class. Protect it.',
};

export const COPYING_COSTS = {
  fromScroll: 'Scroll consumed. 2 hours + 50gp per level.',
  fromBook: 'Source intact. 2 hours + 50gp per level.',
  schoolDiscount: 'Your school: 1 hour + 25gp per level.',
  restriction: 'Must be wizard spell of a level you can cast.',
};

export const ALWAYS_PREPARE = [
  'Shield (L1): +5 AC reaction.',
  'Counterspell (L3): counter enemy spells.',
  'Fireball (L3): AoE damage.',
  'Misty Step (L2): escape teleport.',
];

export const BEST_RITUALS = [
  { spell: 'Find Familiar (L1)', note: 'Scout, Help action, touch spell delivery.' },
  { spell: 'Detect Magic (L1)', note: 'Find magical traps and items.' },
  { spell: 'Identify (L1)', note: 'Free item identification.' },
  { spell: 'Tiny Hut (L3)', note: 'Safe long rest anywhere.' },
  { spell: 'Phantom Steed (L3)', note: 'Free 100ft mount.' },
  { spell: 'Telepathic Bond (L5)', note: 'Party-wide telepathy.' },
];

export const ARCANE_RECOVERY = {
  what: 'Short rest: recover slots = half wizard level (rounded up).',
  restriction: 'No L6+ individual slots.',
  tip: 'Use daily. Free spell slots. Recover most-used level.',
};

export const SPELLBOOK_PROTECTION = [
  'Back up to a second book. Same cost/time.',
  'Keep in Bag of Holding for environmental protection.',
  'Arcane Lock: DC 25 to open. Permanent.',
  'Never leave it behind. Always on your person.',
];

export const SPELLBOOK_TIPS = [
  'Copy every spell you find. More options = better wizard.',
  'School discount: half cost/time. Prioritize school spells.',
  'Ritual spells don\'t need preparation. Copy all rituals.',
  'Shield + Counterspell: always prepared. Non-negotiable.',
  'Back up your spellbook. Second copy at home base.',
  'Arcane Recovery: free slots on short rest. Use it.',
  'Maximize INT for more prepared spells.',
  'Ritual cast Detect Magic, Identify, Familiar for free.',
  'Losing your spellbook is devastating. Protect it.',
  'Found a spellbook? Copy every spell you can afford.',
];
