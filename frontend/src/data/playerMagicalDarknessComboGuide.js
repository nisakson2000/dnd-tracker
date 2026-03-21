/**
 * playerMagicalDarknessComboGuide.js
 * Player Mode: Darkness + Devil's Sight and vision combos
 * Pure JS — no React dependencies.
 */

export const DARKNESS_COMBO_BASICS = {
  spell: 'Darkness (L2)',
  invocation: 'Devil\'s Sight (Warlock invocation)',
  combo: 'Cast Darkness → you see through it (Devil\'s Sight 120ft). Enemies can\'t see you.',
  result: 'You attack with advantage (unseen). Enemies attack with disadvantage (can\'t see you).',
  rating: 'S',
  note: 'Effectively +5 AC and advantage on all attacks. Devastating combo.',
};

export const DARKNESS_INTERACTIONS = [
  { situation: 'Ally in the Darkness', effect: 'Your allies ALSO can\'t see. They have disadvantage too.', solution: 'Coordinate positioning. Keep allies outside the Darkness.', rating: 'Problem' },
  { situation: 'Enemy with Blindsight', effect: 'They ignore Darkness completely.', counter: 'Check monster stat blocks. Many higher-CR monsters have Blindsight.', rating: 'Counter' },
  { situation: 'Enemy with Truesight', effect: 'They see through Darkness.', counter: 'Rare at low levels. More common at high CR.', rating: 'Counter' },
  { situation: 'Daylight spell', effect: 'L3 Daylight dispels L2 Darkness.', counter: 'Upcast Darkness to L3+ or avoid enemies with Daylight.', rating: 'Counter' },
  { situation: 'Dispel Magic', effect: 'Removes Darkness.', counter: 'Re-cast if needed. L2 slot is cheap.', rating: 'Counter' },
  { situation: 'Concentration', effect: 'Darkness is concentration. Replaces Hex/other concentration spells.', note: 'Can\'t have Hex AND Darkness at the same time.', rating: 'Limitation' },
];

export const WHO_BENEFITS = [
  { build: 'Warlock (any)', why: 'Devil\'s Sight is Warlock-only invocation. Core combo user.', rating: 'S' },
  { build: 'Shadow Sorcerer', why: 'Eyes of the Dark: see through your own Darkness. No Warlock needed.', rating: 'S' },
  { build: 'Eldritch Knight + Warlock dip', why: 'Darkness + Devil\'s Sight + martial attacks with advantage.', rating: 'A+' },
  { build: 'Paladin + Warlock dip', why: 'Advantage on all attacks = more crits = more Divine Smite.', rating: 'A+' },
  { build: 'Shadow Monk', why: 'Shadow Arts: cast Darkness for 2 Ki. Shadow Step teleport in dim/dark.', rating: 'A' },
  { build: 'Gloom Stalker Ranger', why: 'Invisible to Darkvision. Umbral Sight. Not true Darkness combo but similar effect.', rating: 'A+' },
];

export const ALTERNATIVE_VISION_COMBOS = [
  { combo: 'Fog Cloud + Blindsight', effect: 'Fog Cloud blocks vision. Blindsight ignores fog. You see, they don\'t.', access: 'Blind Fighting style (10ft Blindsight).', rating: 'A' },
  { combo: 'Fog Cloud + Blind Fighting', effect: 'Fighting style: 10ft Blindsight. Attack in fog normally within 10ft.', classes: 'Fighter, Paladin, Ranger.', rating: 'A' },
  { combo: 'Gloom Stalker + Darkvision enemies', effect: 'Invisible to Darkvision in darkness. Natural advantage.', access: 'Ranger subclass.', rating: 'S' },
  { combo: 'Darkness on weapon/shield', effect: 'Darkness cast on an item you carry = moves with you. Mobile Darkness bubble.', note: 'Center of Darkness follows you.', rating: 'A+' },
];

export const DARKNESS_ETIQUETTE = [
  'Warn your party before casting Darkness. They need to position outside it.',
  'Don\'t cast Darkness on the whole battlefield — only where YOU are fighting.',
  'If your party has many ranged characters, Darkness hurts them more than it helps you.',
  'Consider: is advantage worth blinding your allies? Sometimes the answer is no.',
  'Shadow Sorcerer or Devil\'s Sight users should discuss this combo at session zero.',
];
