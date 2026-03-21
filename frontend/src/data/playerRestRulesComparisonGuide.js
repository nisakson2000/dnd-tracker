/**
 * playerRestRulesComparisonGuide.js
 * Player Mode: Short/long rest rules, variants, and class dependencies
 * Pure JS — no React dependencies.
 */

export const REST_RULES = {
  shortRest: {
    duration: '1 hour minimum.',
    benefits: [
      'Spend Hit Dice to recover HP (roll + CON mod per die)',
      'Recover SR-dependent class features (Action Surge, Ki, Channel Divinity, Warlock slots)',
      'Song of Rest (Bard): +1d6→d12 healing per creature spending HD',
      'Chef feat: PB creatures get +1d8 HP',
    ],
  },
  longRest: {
    duration: '8 hours (6 sleep + 2 light activity).',
    benefits: [
      'Recover ALL hit points',
      'Recover HALF total Hit Dice (rounded down, min 1)',
      'Recover all spell slots and LR features',
      'Reduce exhaustion by 1 level',
    ],
    restrictions: ['1 per 24 hours', 'Must have 1+ HP', '1+ hour strenuous activity = restart'],
  },
};

export const SR_CLASS_DEPENDENCY = [
  { class: 'Warlock', dependency: 'Critical', note: 'All Pact slots recover on SR. Must short rest.' },
  { class: 'Fighter', dependency: 'High', note: 'Action Surge, Second Wind, Superiority Dice recover.' },
  { class: 'Monk', dependency: 'High', note: 'ALL ki recovers on SR. Without SRs, monks are weak.' },
  { class: 'Moon Druid', dependency: 'High', note: 'Wild Shape uses recover. Two extra HP pools per SR.' },
  { class: 'Cleric', dependency: 'Moderate', note: 'Channel Divinity recovers. Spell slots don\'t.' },
  { class: 'Bard (L5+)', dependency: 'Moderate', note: 'Bardic Inspiration recovers on SR at L5.' },
  { class: 'Wizard', dependency: 'Moderate', note: 'Arcane Recovery (once/day on SR).' },
  { class: 'Sorcerer', dependency: 'Low', note: 'Almost nothing recovers on SR.' },
  { class: 'Rogue', dependency: 'None', note: 'No SR features. Always online.' },
];

export const VARIANT_REST_OPTIONS = [
  { variant: 'Gritty Realism', sr: '8 hours', lr: '7 days', effect: 'Resources very scarce. Warlock advantage grows.', note: 'Survival/exploration focus.' },
  { variant: 'Epic Heroism', sr: '5 minutes', lr: '1 hour', effect: 'Fast recovery. More combats per session.', note: 'High-action campaigns.' },
  { variant: 'Standard', sr: '1 hour', lr: '8 hours', effect: 'Default PHB. 6-8 encounters/day assumed.', note: 'Most tables run fewer encounters.' },
];

export const REST_TIPS = [
  'Advocate for short rests. Warlocks, Fighters, and Monks depend on them.',
  'Tiny Hut (L3 ritual): safe sphere for resting in hostile territory.',
  'Alarm (L1 ritual): prevents surprise during rest. Always cast before sleeping.',
  'Catnap (L3): 10-minute short rest for 3 creatures. Incredible in dungeons.',
  'Elves: 4 hours trance instead of 6 hours sleep. Extra light activity time.',
  'If DM runs 1-2 encounters/day, LR classes dominate. SR classes suffer.',
];
