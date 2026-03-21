/**
 * playerShortRestMaxGuide.js
 * Player Mode: Maximizing short rest value — recovery, features, and party coordination
 * Pure JS — no React dependencies.
 */

export const SHORT_REST_RULES = {
  duration: '1 hour of downtime.',
  hitDice: 'Spend Hit Dice to heal. Roll die + CON mod per die.',
  frequency: '2 per long rest is typical (6-8 encounter day).',
  interruption: 'Combat interrupts. Must restart.',
};

export const SHORT_REST_RECOVERY = [
  { class: 'Fighter', recovers: ['Action Surge', 'Second Wind', 'Superiority Dice'], rating: 'S+', note: 'Most SR-dependent class.' },
  { class: 'Warlock', recovers: ['ALL Pact Magic slots'], rating: 'S+', note: '2-3 full spell slots every SR.' },
  { class: 'Monk', recovers: ['ALL Ki Points'], rating: 'S+', note: 'Full Ki = full offense every fight.' },
  { class: 'Bard (L5+)', recovers: ['Bardic Inspiration'], rating: 'S', note: 'Font of Inspiration at L5.' },
  { class: 'Cleric', recovers: ['Channel Divinity'], rating: 'A+', note: 'CD recovery on SR.' },
  { class: 'Druid', recovers: ['Wild Shape'], rating: 'A+', note: '2 uses recover.' },
  { class: 'Wizard', recovers: ['Arcane Recovery (1/day)'], rating: 'A+', note: 'Once per day. Recover up to half wizard level in slots.' },
  { class: 'Barbarian', recovers: ['Nothing significant'], rating: 'C', note: 'Rage is per long rest. Only Hit Dice.' },
  { class: 'Paladin', recovers: ['Nothing significant'], rating: 'C', note: 'Lay on Hands, slots, smites = all LR.' },
  { class: 'Sorcerer', recovers: ['Nothing significant'], rating: 'C', note: 'All resources are LR.' },
];

export const HIT_DICE_OPTIMIZATION = {
  formula: 'Hit Die + CON modifier per die spent.',
  efficient: 'High CON = more healing per die. Don\'t dump CON.',
  rations: 'You have [level] Hit Dice total. Recover half on long rest.',
  advice: 'Spend enough to reach ~75% HP. Save some for later SRs.',
  perks: [
    { source: 'Durable (feat)', effect: 'Minimum healing = 2 × CON mod per die.', rating: 'A' },
    { source: 'Song of Rest (Bard)', effect: 'Extra die of healing (d6-d12).', rating: 'A+' },
    { source: 'Chef (feat)', effect: '+1d8 temp HP snack on SR.', rating: 'A' },
    { source: 'Periapt of Wound Closure', effect: 'Double HP from Hit Dice.', rating: 'S' },
  ],
};

export const SR_PARTY_COORDINATION = [
  'Fighter, Warlock, Monk: always push for short rests. They need them.',
  'If party is 3+ SR-dependent classes: aim for 2 short rests per day.',
  'Paladin/Sorcerer-heavy party: short rests are less impactful.',
  'Bard Song of Rest: free extra healing die for entire party.',
  'Chef feat: +1d8 temp HP snacks during SR. Good support.',
  'Warlock gets FULL slots on SR. Don\'t let them skip rests.',
  'Catnap (L3 spell): 10-minute short rest. Great for time pressure.',
];

export const SHORT_REST_TIPS = [
  'Push for 2 short rests per adventuring day.',
  'Fighter/Warlock/Monk are MUCH weaker without short rests.',
  'Hit Dice: spend wisely. Save some for later rests.',
  'Song of Rest (Bard): free healing die for party.',
  'Catnap spell: 10-minute short rest. Excellent in dungeons.',
  'Arcane Recovery (Wizard): once per day on SR. Use on first rest.',
  'Don\'t skip rests to rush. Resources win fights.',
  'Periapt of Wound Closure: doubles Hit Dice healing.',
  'Chef feat: +1d8 temp HP treats. Solid party support.',
  'If DM only does 1-2 fights per day: SR-dependent classes suffer.',
];
