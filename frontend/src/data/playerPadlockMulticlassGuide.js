/**
 * playerPadlockMulticlassGuide.js
 * Player Mode: Padlock (Paladin/Warlock) multiclass — builds, smites, optimization
 * Pure JS — no React dependencies.
 */

export const PADLOCK_CORE = {
  concept: 'Paladin + Warlock. Use short-rest Pact slots for Divine Smite.',
  why: 'Pact Magic recovers on short rest. Smite with renewable resources.',
  synergy: 'CHA is primary stat for both classes. Perfect overlap.',
  key: 'Hexblade dip: CHA for weapon attacks. No need for STR.',
};

export const PADLOCK_BUILDS = [
  {
    name: 'Hexadin (Paladin X / Hexblade 1-2)',
    split: 'Paladin 6+ / Hexblade Warlock 1-2',
    priority: 'Paladin primary. Hexblade dip for CHA attacks.',
    features: [
      'L1 Hexblade: CHA for weapon attacks. Medium armor + shields. Shield spell.',
      'L2 Hexblade: Eldritch Blast + Agonizing Blast. Two invocations.',
      'Paladin 6+: Aura of Protection. Extra Attack. Smites.',
    ],
    stats: 'CHA > CON > STR 13 (multiclass requirement)',
    rating: 'S+',
    note: 'Best Padlock build. CHA for attacks + Aura of Protection.',
  },
  {
    name: 'Blastadin (Paladin 6 / Warlock X)',
    split: 'Paladin 6 / Warlock X',
    priority: 'Warlock primary after Paladin 6.',
    features: [
      'Paladin 6: Aura of Protection. Extra Attack. Smite.',
      'Warlock X: Eldritch Blast scales. More Pact slots. Invocations.',
      'L9 Warlock (L15 total): L5 Pact slots for 5d8 Smite.',
    ],
    stats: 'CHA > CON > STR 13',
    rating: 'A+',
    note: 'More Warlock = more EB damage + Pact slots. Less Paladin features.',
  },
  {
    name: 'Genie Padlock',
    split: 'Paladin 6-8 / Genie Warlock 3+',
    priority: 'Paladin first, then Genie.',
    features: [
      'Genie\'s Wrath: +PB damage once per turn.',
      'Bottled Respite: safe short rest in lamp.',
      'Dao: bludgeoning extra. Djinni: thunder.',
    ],
    stats: 'CHA > CON > STR 13',
    rating: 'A+',
    note: 'Genie adds utility + extra damage type.',
  },
];

export const SMITE_WITH_PACT_SLOTS = {
  rule: 'Pact Magic slots work for Divine Smite. They recover on short rest.',
  damage: [
    { pactLevel: 1, smiteDice: '2d8', avg: 9 },
    { pactLevel: 2, smiteDice: '3d8', avg: 13.5 },
    { pactLevel: 3, smiteDice: '4d8', avg: 18 },
    { pactLevel: 4, smiteDice: '5d8', avg: 22.5 },
    { pactLevel: 5, smiteDice: '5d8 (max)', avg: 22.5 },
  ],
  shortRest: 'Recover ALL Pact slots on short rest. Smite again immediately.',
  crit: 'On crit: all smite dice double. Wait for crits when possible.',
};

export const PADLOCK_INVOCATIONS = [
  { name: 'Agonizing Blast', why: '+CHA to EB damage. Ranged option.', priority: 'High' },
  { name: 'Devil\'s Sight', why: 'See in magical darkness. Darkness spell combo.', priority: 'Medium' },
  { name: 'Eldritch Smite', why: '+1d8/slot + prone (no save). Stacks with Divine Smite.', priority: 'High (if Pact of Blade)', note: 'Double smite: Divine + Eldritch on same hit.' },
  { name: 'Thirsting Blade', why: 'Extra Attack. Only if not getting it from Paladin.', priority: 'Skip (Paladin has Extra Attack)' },
  { name: 'Mask of Many Faces', why: 'At-will Disguise Self. CHA synergy.', priority: 'Low' },
];

export const PADLOCK_LEVEL_PROGRESSION = [
  { level: '1-5', plan: 'Paladin 1-5. Get Extra Attack. Core class features.', note: 'Pure Paladin early. Aura at 6.' },
  { level: '6', plan: 'Paladin 6. Aura of Protection. NEVER skip this.', note: '+CHA to all saves in 10ft. Best feature in the game.' },
  { level: '7', plan: 'Hexblade 1. CHA attacks + Shield spell + medium armor.', note: 'The power spike. CHA does everything now.' },
  { level: '8', plan: 'Hexblade 2. Agonizing Blast + invocation of choice.', note: 'EB for ranged option. Two invocations.' },
  { level: '9+', plan: 'Paladin 7+ or Warlock 3+ depending on build.', note: 'Paladin for oath features. Warlock for Pact Boon + higher slots.' },
];

export const PADLOCK_TIPS = [
  'Hexblade 1: CHA for attacks. Shield spell. Best dip in the game.',
  'Get Paladin 6 first: Aura of Protection is non-negotiable.',
  'Pact slots recover on short rest. Smite freely.',
  'Eldritch Blast: ranged option Paladin normally lacks.',
  'On crits: Divine Smite with highest slot. All dice doubled.',
  'Double smite: Divine + Eldritch Smite on same hit. Devastating.',
  'CHA > CON > STR 13. Only need 13 STR for multiclass.',
  'Darkness + Devil\'s Sight: advantage + enemy disadvantage.',
  'Short rest = full Pact slots. Push for short rests.',
  'This is one of the strongest multiclass combos in 5e.',
];
