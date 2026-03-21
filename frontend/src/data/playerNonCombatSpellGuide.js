/**
 * playerNonCombatSpellGuide.js
 * Player Mode: Best non-combat spells — utility, exploration, and social
 * Pure JS — no React dependencies.
 */

export const EXPLORATION_SPELLS = [
  { spell: 'Detect Magic', level: 1, ritual: true, rating: 'S+', note: 'See magic auras. Ritual = free. Essential.' },
  { spell: 'Identify', level: 1, ritual: true, rating: 'A+', note: 'Identify magic items. Ritual. Some DMs allow SR instead.' },
  { spell: 'Comprehend Languages', level: 1, ritual: true, rating: 'A+', note: 'Read/understand any language. Ritual.' },
  { spell: 'Find Familiar', level: 1, ritual: true, rating: 'S+', note: 'Permanent scout. See through eyes. Ritual.' },
  { spell: 'Darkvision', level: 2, ritual: false, rating: 'A', note: 'Grant Darkvision 60ft for 8 hours.' },
  { spell: 'Locate Object', level: 2, ritual: false, rating: 'A', note: 'Find specific object within 1000ft. Quest-useful.' },
  { spell: 'Water Breathing', level: 3, ritual: true, rating: 'A+ (situational)', note: 'Entire party breathes underwater. 24 hours. Ritual.' },
  { spell: 'Tiny Hut', level: 3, ritual: true, rating: 'S+', note: 'Impenetrable dome. Safe long rest anywhere. Ritual.' },
  { spell: 'Fly', level: 3, ritual: false, rating: 'S', note: '60ft fly speed. Exploration AND combat.' },
  { spell: 'Passwall', level: 5, ritual: false, rating: 'A+', note: 'Walk through walls. 20ft passage. 1 hour.' },
  { spell: 'Arcane Eye', level: 4, ritual: false, rating: 'S', note: 'Invisible eye scouts entire dungeon from safety.' },
];

export const SOCIAL_SPELLS = [
  { spell: 'Charm Person', level: 1, rating: 'A', note: 'Advantage on CHA checks. Target knows after.' },
  { spell: 'Suggestion', level: 2, rating: 'S+', note: 'Best social spell. Reasonable request. No memory.' },
  { spell: 'Zone of Truth', level: 2, rating: 'A+', note: 'Can\'t lie. CHA save. They can stay silent.' },
  { spell: 'Detect Thoughts', level: 2, rating: 'S', note: 'Read surface thoughts. Deep probe = noticed.' },
  { spell: 'Tongues', level: 3, rating: 'A', note: 'Speak any language. 1 hour.' },
  { spell: 'Sending', level: 3, rating: 'A+', note: '25-word message to anyone, anywhere, any plane.' },
  { spell: 'Modify Memory', level: 5, rating: 'S+', note: 'Change memories. Target never knows.' },
  { spell: 'Mass Suggestion', level: 6, rating: 'S+', note: '12 targets. 24 hours. No concentration.' },
];

export const UTILITY_SPELLS = [
  { spell: 'Mending', level: 0, rating: 'A', note: 'Cantrip. Fix broken objects.' },
  { spell: 'Goodberry', level: 1, rating: 'A+', note: '10 berries = 10 HP. Prevents starvation.' },
  { spell: 'Feather Fall', level: 1, rating: 'S (situational)', note: 'Reaction. Prevents fall damage. Life-saver.' },
  { spell: 'Knock', level: 2, rating: 'A', note: 'Open any lock. LOUD (300ft). Alerting.' },
  { spell: 'Rope Trick', level: 2, rating: 'A+', note: 'Hidden extradimensional space. Safe short rest.' },
  { spell: 'Dispel Magic', level: 3, rating: 'S+', note: 'End any spell effect. Auto at L3, check higher.' },
  { spell: 'Remove Curse', level: 3, rating: 'A+', note: 'Remove curses. Free from cursed items.' },
  { spell: 'Fabricate', level: 4, rating: 'A+', note: 'Create objects from raw materials. Instant crafting.' },
  { spell: 'Creation', level: 5, rating: 'A', note: 'Create nonmagical objects. Temporary.' },
  { spell: 'Teleportation Circle', level: 5, rating: 'A+ (campaign)', note: 'Teleport to known circle. Party transport.' },
];

export const NON_COMBAT_TIPS = [
  'Detect Magic: cast as ritual. Always. Free magic detection.',
  'Tiny Hut: safe long rest ANYWHERE. Ritual. Must-have.',
  'Suggestion: "reasonable request" = incredibly broad.',
  'Find Familiar: permanent scout. Owl for flying recon.',
  'Goodberry: prevents starvation. Create 10 before long rest.',
  'Feather Fall: keep prepared. One reaction saves a life.',
  'Sending: 25 words to anyone on any plane. Communication.',
  'Arcane Eye: scout entire dungeon without entering.',
  'Dispel Magic: always prepare. Ends traps, effects, buffs.',
  'Don\'t neglect utility spells. They solve more problems than damage.',
];
