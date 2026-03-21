/**
 * playerShortRestClassesGuide.js
 * Player Mode: Short rest dependent classes and features
 * Pure JS — no React dependencies.
 */

export const SHORT_REST_OVERVIEW = {
  duration: '1 hour minimum',
  activities: 'Spend Hit Dice to heal, eat, drink, read, bandage wounds.',
  hitDice: 'Spend up to half your total Hit Dice. Recover half your total on long rest.',
  note: 'Short rests are FREE resources. Push for them whenever safe.',
};

export const SR_DEPENDENT_CLASSES = [
  { class: 'Warlock', dependency: 'Critical', recovers: 'ALL Pact Magic spell slots', note: 'Warlock is DESIGNED around short rests. 2-4 slots that fully recover on SR.', rating: 'S' },
  { class: 'Fighter', dependency: 'High', recovers: 'Action Surge, Second Wind, Superiority Dice (Battle Master)', note: 'Action Surge per SR = extra action per encounter.', rating: 'S' },
  { class: 'Monk', dependency: 'High', recovers: 'All Ki points', note: 'Ki runs out fast. SR = full Ki reset. Essential.', rating: 'S' },
  { class: 'Druid (Land)', dependency: 'Moderate', recovers: 'Natural Recovery (half Druid level in spell slots, once/day)', note: 'Land Druid specifically. Other Druids less SR-dependent.', rating: 'A' },
  { class: 'Wizard', dependency: 'Moderate', recovers: 'Arcane Recovery (half Wizard level in slots, once/day)', note: 'Only once per day on SR. Still valuable.', rating: 'A' },
  { class: 'Bard', dependency: 'Moderate', recovers: 'Bardic Inspiration (L5+: Font of Inspiration)', note: 'Pre-L5: Inspiration recovers on LR. L5+: recovers on SR.', rating: 'A' },
  { class: 'Cleric', dependency: 'Low', recovers: 'Channel Divinity (some uses per SR)', note: 'CD recovers on SR. Spells still need LR.', rating: 'B+' },
  { class: 'Paladin', dependency: 'Low', recovers: 'Channel Divinity', note: 'Most Paladin resources are LR-dependent.', rating: 'B' },
];

export const SR_FEATURES = [
  { feature: 'Hit Dice healing', class: 'All', detail: 'Spend Hit Dice to heal. Most efficient healing in the game (free).', rating: 'S' },
  { feature: 'Pact Magic', class: 'Warlock', detail: 'All slots recover. 2 L5 slots per SR at higher levels.', rating: 'S' },
  { feature: 'Action Surge', class: 'Fighter', detail: 'Extra action once per SR. Resets every hour.', rating: 'S' },
  { feature: 'Second Wind', class: 'Fighter', detail: '1d10+level HP as BA. Resets on SR.', rating: 'A' },
  { feature: 'Ki Points', class: 'Monk', detail: 'All Ki recovers. Flurry, Stunning Strike, Step of the Wind all back.', rating: 'S' },
  { feature: 'Superiority Dice', class: 'Battle Master', detail: 'All dice recover. More maneuvers per fight.', rating: 'A+' },
  { feature: 'Bardic Inspiration', class: 'Bard (L5+)', detail: 'All Inspiration dice recover. Font of Inspiration.', rating: 'A+' },
  { feature: 'Channel Divinity', class: 'Cleric/Paladin', detail: 'Uses recover on SR. More CD = more subclass features.', rating: 'A' },
  { feature: 'Wild Shape', class: 'Druid', detail: 'Uses recover on SR. More transformations per day.', rating: 'A' },
  { feature: 'Arcane Recovery', class: 'Wizard', detail: 'Once per day on SR: recover slots totaling half Wizard level.', rating: 'A' },
];

export const ADVOCATING_FOR_SHORT_RESTS = [
  'Ask your DM: "Can we take a short rest here?" Don\'t be passive about it.',
  'If you\'re a Warlock, Fighter, or Monk: you NEED SRs. Advocate for them.',
  'Tiny Hut provides a safe rest location anywhere.',
  'Even 1 short rest per day doubles a Warlock\'s effective spell slots.',
  'Song of Rest (Bard): extra healing die for allies on SR. More reason to rest.',
  'Catnap (L3): 10-minute short rest for 3 creatures. Faster than normal SR.',
  'If the DM runs 6-8 encounters/day, SR classes dominate LR classes.',
];

export const CATNAP_SPELL = {
  spell: 'Catnap',
  level: 3,
  castTime: '1 action',
  duration: '10 minutes',
  effect: 'Up to 3 willing creatures fall unconscious for 10 min, gain benefits of a short rest.',
  note: 'Short rest in 10 minutes instead of 60. Incredible for SR-dependent parties.',
  rating: 'A+',
};
