/**
 * playerRestingVariants.js
 * Player Mode: Rest variants, Catnap, and alternative rest rules
 * Pure JS — no React dependencies.
 */

export const STANDARD_RESTS = {
  shortRest: {
    duration: '1 hour minimum.',
    recovery: ['Spend Hit Dice to heal', 'Warlock spell slots', 'Channel Divinity', 'Ki points', 'Action Surge', 'Second Wind', 'Short rest features'],
    limit: 'No limit per day, but DM pacing.',
    note: 'Try to take 2-3 short rests per adventuring day. Short rest classes need them.',
  },
  longRest: {
    duration: '8 hours. At least 6 hours sleeping. Up to 2 hours light activity.',
    recovery: ['All HP', 'Half total Hit Dice (rounded down)', 'All spell slots', 'All daily features', 'One exhaustion level (with food/water)'],
    limit: 'Once per 24 hours.',
    interruption: 'If interrupted by combat (1+ hour), must restart the rest.',
  },
};

export const CATNAP = {
  spell: 'Catnap (3rd level, Bard/Sorcerer/Wizard)',
  duration: '10 minutes.',
  effect: 'Up to 3 willing creatures fall unconscious and gain the benefits of a short rest.',
  targets: 'The targets are unconscious and can\'t keep watch.',
  note: 'A short rest in 10 minutes instead of 1 hour. Incredible value for short-rest classes.',
  rating: 'A',
  best: 'Party with Warlock, Monk, or Fighter. They recover slots/ki/surge in 10 minutes.',
};

export const REST_VARIANTS = {
  grittyRealism: {
    name: 'Gritty Realism',
    shortRest: '8 hours (overnight)',
    longRest: '7 days (downtime)',
    effect: 'Resources are much scarcer. Every encounter matters more.',
    note: 'Short-rest classes become relatively stronger. Warlock thrives.',
  },
  epicHeroism: {
    name: 'Epic Heroism',
    shortRest: '5 minutes',
    longRest: '1 hour',
    effect: 'Players recover very quickly. More encounters per day possible.',
    note: 'Casters become dominant (slots recover fast). Less resource management.',
  },
};

export const RESTING_SAFETY = [
  { spell: 'Tiny Hut (3rd, ritual)', effect: 'Dome blocks all entry from outside. Safe rest anywhere.', rating: 'S' },
  { spell: 'Alarm (1st, ritual)', effect: 'Mental or audible alert when creature enters 20ft cube.', rating: 'A' },
  { spell: 'Guard and Wards (6th)', effect: 'Protect a building with multiple wards.', rating: 'A' },
  { item: 'Rope Trick (2nd)', effect: 'Extradimensional space for 8 creatures. Invisible entrance.', rating: 'A' },
  { method: 'Barricade doors', effect: 'Shove furniture against doors. Set caltrops.', rating: 'B' },
  { method: 'Watch rotation', effect: 'Split the night into shifts. Everyone gets 6 hours sleep.', rating: 'A' },
];

export const HIT_DICE_OPTIMIZATION = [
  'You recover half your total Hit Dice on a long rest (rounded down).',
  'Spend Hit Dice on short rests. Roll + CON mod per die.',
  'If you have a Bard: Song of Rest adds extra healing per short rest (1d6 to 1d12).',
  'Durable feat: minimum HP per Hit Die = 2× CON mod.',
  'Periapt of Wound Closure: double HP from Hit Dice.',
  'Don\'t spend ALL Hit Dice at once. Save some for the next short rest.',
];

export function hitDiceHealing(dieSize, conMod, numDice) {
  const avgPerDie = dieSize / 2 + 0.5 + conMod;
  return Math.max(numDice, avgPerDie * numDice); // minimum 1 per die
}

export function hitDiceRecovery(totalHitDice) {
  return Math.max(1, Math.floor(totalHitDice / 2));
}
