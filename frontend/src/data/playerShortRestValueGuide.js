/**
 * playerShortRestValueGuide.js
 * Player Mode: Short rest value by class — who benefits most and why
 * Pure JS — no React dependencies.
 */

export const SHORT_REST_RECOVERY = [
  { class: 'Warlock', rating: 'S+', recovers: 'ALL spell slots (Pact Magic).', note: 'Warlock is built around short rests. 2 slots per fight.' },
  { class: 'Fighter', rating: 'S+', recovers: 'Action Surge, Second Wind, Superiority Dice (Battlemaster).', note: 'Fighter regains best features on short rest. Always ask for one.' },
  { class: 'Monk', rating: 'S', recovers: 'ALL ki points.', note: 'Monk is ki-dependent. Short rest = full ki.' },
  { class: 'Druid (Moon)', rating: 'S', recovers: 'Wild Shape uses.', note: 'Moon Druid: short rest = more Wild Shape HP pools.' },
  { class: 'Bard', rating: 'A+', recovers: 'Bardic Inspiration (L5+, Font of Inspiration).', note: 'Before L5: long rest only. After L5: short rest recovery.' },
  { class: 'Cleric', rating: 'A', recovers: 'Channel Divinity (1-2 uses).', note: 'Turn Undead, domain features. Valuable but not primary resource.' },
  { class: 'Paladin', rating: 'A', recovers: 'Channel Divinity (1 use).', note: 'Paladin spell slots don\'t recover. CD does.' },
  { class: 'Wizard (Arcane Recovery)', rating: 'A+', recovers: 'Spell slots = half wizard level (once per day on short rest).', note: 'Arcane Recovery is a short rest feature. Huge value.' },
  { class: 'Sorcerer', rating: 'C', recovers: 'Nothing (no short rest features).', note: 'Sorcerer has no short rest recovery. Convert SP if desperate.' },
  { class: 'Ranger', rating: 'B', recovers: 'Nothing major (some subclass features).', note: 'Rangers get little from short rests.' },
  { class: 'Rogue', rating: 'B', recovers: 'Nothing significant.', note: 'Rogues don\'t have short rest resources.' },
  { class: 'Barbarian', rating: 'B+', recovers: 'Nothing core, but Hit Dice healing.', note: 'Rages are long rest. Short rest = just HP recovery.' },
];

export const HIT_DICE_HEALING = {
  rule: 'Spend Hit Dice during short rest. Roll HD + CON mod per die. Recover that much HP.',
  totalHD: 'You have HD equal to your level. Recover half (rounded down) on long rest.',
  maxPerRest: 'Spend as many as you want per short rest (up to remaining HD).',
  strategy: [
    'Don\'t spend all HD on first short rest. Save some for later.',
    'High CON = more healing per HD. +3 CON = +3 per die.',
    'Bard Song of Rest: extra 1d6-1d12 healing per short rest for the party.',
    'Chef feat: +1d8 healing per short rest (one ally). Stacks with Song of Rest.',
    'Periapt of Wound Closure: double HP regained from HD.',
  ],
};

export const SHORT_REST_FEATURES = [
  { feature: 'Arcane Recovery (Wizard)', what: 'Recover spell slots = half wizard level. Once per day.', note: 'Best spell slot recovery. Use immediately after first fight.' },
  { feature: 'Natural Recovery (Land Druid)', what: 'Recover spell slots = half druid level. Once per day.', note: 'Same as Arcane Recovery but for Land Druid.' },
  { feature: 'Harness Divine Power (Tasha\'s)', what: 'Cleric/Paladin: recover one spell slot = 1/3 level (rounded up).', note: 'Uses Channel Divinity. Slot recovery on short rest.' },
  { feature: 'Font of Inspiration (Bard L5)', what: 'Bardic Inspiration recovers on short rest instead of long rest.', note: 'Game-changing at L5. Inspiration every fight.' },
  { feature: 'Song of Rest (Bard)', what: 'Allies who spend HD get extra 1d6 (scales to 1d12).', note: 'Free bonus healing for the whole party.' },
  { feature: 'Chef feat', what: 'One ally gets +1d8 HP during short rest. Also cook treats for temp HP.', note: 'Stacks with Song of Rest.' },
];

export const SHORT_REST_TIPS = [
  'Warlock and Fighter benefit most from short rests. Advocate for them.',
  'Two short rests per day is the assumed 5e adventuring day.',
  'Hit Dice: don\'t spend all on one rest. Budget across the day.',
  'Arcane Recovery: recover slots once per day on short rest. Huge.',
  'Monk ki resets on short rest. Stunning Strike every fight.',
  'Bard L5+: Inspiration on short rest. Use them freely.',
  'Song of Rest: free party healing. Bard should always short rest.',
  'Chef feat + Song of Rest: extra 1d8 + 1d6+ healing per short rest.',
  'If the party won\'t short rest, Warlock/Fighter/Monk suffer most.',
  'Catnap spell (L3): 10-minute short rest. Fast when time is tight.',
];
