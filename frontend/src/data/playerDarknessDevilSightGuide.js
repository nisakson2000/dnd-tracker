/**
 * playerDarknessDevilSightGuide.js
 * Player Mode: Darkness + Devil's Sight combo — the ultimate vision advantage
 * Pure JS — no React dependencies.
 */

export const DARKNESS_SPELL = {
  level: 2,
  school: 'Evocation',
  castingTime: '1 action',
  range: '60 feet',
  components: 'V, M (bat fur and a drop of pitch)',
  duration: 'Concentration, up to 10 minutes',
  area: '15-foot-radius sphere',
  effect: 'Magical darkness. Nonmagical light can\'t illuminate it. Darkvision can\'t see through it. Dispellable by L3+ light spells.',
  note: 'Can be cast on an object to create mobile darkness.',
};

export const DEVILS_SIGHT_INVOCATION = {
  name: "Devil's Sight",
  prereq: 'None',
  effect: 'See normally in darkness (both magical and nonmagical) out to 120 feet.',
  note: 'This is NOT darkvision. It\'s full normal vision in any darkness. No disadvantage on Perception.',
};

export const THE_COMBO = {
  setup: 'Cast Darkness on yourself or an object you carry. Take Devil\'s Sight invocation.',
  result: [
    'You can see perfectly in your own Darkness sphere.',
    'Enemies inside can\'t see (blinded effectively).',
    'You have advantage on ALL attacks against creatures in the darkness.',
    'ALL attacks against you have disadvantage.',
    'Advantage + disadvantage = effectively invisible to enemies.',
  ],
  rating: 'S+',
  note: 'One of the strongest combos in 5e. Essentially permanent advantage/disadvantage.',
};

export const COMBO_STRENGTHS = [
  'Advantage on all your attacks = higher hit rate + Eldritch Blast accuracy.',
  'Disadvantage on all attacks against you = massive AC boost equivalent.',
  'Sneak Attack: Rogues with Devil\'s Sight always have advantage = guaranteed SA.',
  'Elven Accuracy: with advantage, reroll 1 die = super advantage (3 dice, best of 3).',
  'GWM/Sharpshooter: advantage offsets the -5 penalty. Massive damage.',
  'Enemies can\'t target you with spells requiring sight (many do).',
  'Counterspell: enemies can\'t see you cast, so they can\'t Counterspell your spells.',
];

export const COMBO_WEAKNESSES = [
  'Uses Concentration. Can\'t concentrate on Hex/other spells simultaneously.',
  'Allies in the darkness are ALSO blinded. They can\'t see either.',
  'Party-unfriendly: your melee allies suffer disadvantage on attacks too.',
  'Enemies can leave the darkness area. It only covers 15ft radius.',
  'Dispel Magic or L3+ light spell (Daylight) ends it.',
  'Creatures with blindsight, tremorsense, or truesight are unaffected.',
  'Some creatures have Devil\'s Sight or similar abilities.',
  'Takes an action to set up + uses concentration.',
];

export const BUILDS_USING_THE_COMBO = [
  {
    build: 'Darkness Blaster (Warlock)',
    setup: 'EB + Agonizing Blast + Devil\'s Sight + Darkness',
    tactic: 'Stand in Darkness. EB with advantage every round. Enemies can\'t see you to target.',
    rating: 'S',
  },
  {
    build: 'Shadow Sorcerer / Warlock',
    setup: 'Shadow Sorcerer gets Darkness for 2 SP (no concentration via Eyes of the Dark at L3!)',
    tactic: 'Non-concentration Darkness + Devil\'s Sight = you can concentrate on OTHER spells.',
    rating: 'S++',
    note: 'Shadow Sorcerer 3 / Hexblade X is the optimal version. Darkness without concentration is broken.',
  },
  {
    build: 'Darkness Assassin (Rogue/Warlock)',
    setup: 'Rogue X / Warlock 2 (Devil\'s Sight) + Darkness',
    tactic: 'Always have advantage = always have Sneak Attack. Elven Accuracy = 3 dice.',
    rating: 'S+',
  },
  {
    build: 'Darkness Paladin (Hexblade/Paladin)',
    setup: 'Hexblade 2+ / Paladin X. Devil\'s Sight + Darkness.',
    tactic: 'Advantage on all attacks = more crits = more Smite damage.',
    rating: 'S',
  },
];

export const DARKNESS_COMBO_TIPS = [
  'Shadow Sorcerer 3 is the BEST version. No-concentration Darkness is game-changing.',
  'If you use normal Darkness (concentration), you lose Hex. Factor this into your damage calc.',
  'Cast Darkness on a coin or small object. Put it in your pocket to move it with you.',
  'Warn your party. Don\'t blind your allies without coordination.',
  'Enemies with blindsight (many high-CR creatures) counter this completely.',
  'Daylight (L3) auto-dispels Darkness. If enemies have Daylight, this combo fails.',
  'Devil\'s Sight sees through ALL darkness, not just your own. Useful even without the combo.',
  'At range (EB build), party-unfriendly aspect matters less. You\'re not near allies.',
  'Elven Accuracy + Devil\'s Sight + Darkness = triple advantage. Crits on 14% of attacks.',
];
