/**
 * playerRestOptimizationGuide.js
 * Player Mode: Resting rules — short rest, long rest, variants, optimization
 * Pure JS — no React dependencies.
 */

export const SHORT_REST_RULES = {
  duration: '1 hour of light activity.',
  hitDice: 'Spend Hit Dice: roll HD + CON mod per die to heal.',
  recovery: [
    'Warlock: ALL Pact slots.',
    'Fighter: Action Surge + Second Wind.',
    'Monk: ALL ki points.',
    'Bard (L5+): ALL Bardic Inspiration.',
    'Druid: Wild Shape uses.',
    'Wizard: Arcane Recovery (once/day during SR).',
  ],
};

export const LONG_REST_RULES = {
  duration: '8 hours (6 sleep + 2 light activity).',
  recovery: ['All HP.', 'Half total Hit Dice.', 'All spell slots.', 'All features.', 'Remove 1 exhaustion.'],
  restrictions: ['One per 24 hours.', '1 hour combat restarts timer.'],
};

export const REST_VARIANTS = {
  gritty: { shortRest: '8 hours', longRest: '7 days', impact: 'SR classes (Warlock/Fighter/Monk) are strongest.' },
  epic: { shortRest: '5 minutes', longRest: '1 hour', impact: 'All resources recover fast. High-action games.' },
};

export const SR_CLASS_PRIORITY = [
  { class: 'Warlock', recovery: 'ALL Pact slots.', priority: 'S+' },
  { class: 'Monk', recovery: 'ALL ki.', priority: 'S+' },
  { class: 'Fighter', recovery: 'Action Surge + Second Wind.', priority: 'S' },
  { class: 'Bard (L5+)', recovery: 'ALL Inspiration.', priority: 'A+' },
  { class: 'Druid', recovery: 'Wild Shape.', priority: 'A' },
];

export const SAFE_REST_METHODS = [
  { method: 'Tiny Hut (ritual)', safety: 'S+', note: 'Impenetrable dome. 8 hours. Best safe rest.' },
  { method: 'Rope Trick', safety: 'A+', note: 'Extradimensional space. 1 hour. Short rest only.' },
  { method: 'Alarm (ritual)', safety: 'A', note: 'Know when enemies approach.' },
  { method: 'Guard rotation', safety: 'A', note: '2-hour watches. Everyone gets sleep.' },
];

export const REST_OPTIMIZATION_TIPS = [
  'Short rests are free healing. Always push for them.',
  'Warlock/Fighter/Monk: short rest = full recovery.',
  'Tiny Hut: ritual cast. Nothing gets in. Best safe rest.',
  'Don\'t spend all Hit Dice at once. Save some.',
  'Long rest: only one per 24 hours. Plan ahead.',
  'Alarm: ritual cast at camp. Free early warning.',
  'After hard fights: short rest before continuing.',
  'Guard rotation: 2-hour watches during long rest.',
  'Exhaustion: 1 level per 24 hours without rest.',
  'HD healing: high CON = more HP per die.',
];
