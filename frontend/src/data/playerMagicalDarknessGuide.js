/**
 * playerMagicalDarknessGuide.js
 * Player Mode: Magical darkness — Darkness spell, Devil's Sight, Shadow of Moil
 * Pure JS — no React dependencies.
 */

export const DARKNESS_SPELL = {
  level: 2,
  concentration: true,
  range: '60ft point, 15ft radius sphere',
  effect: 'Magical darkness. Darkvision can\'t see through it. Non-magical light can\'t illuminate it.',
  duration: '10 minutes',
  counter: 'Dispel Magic. Light spell of L3+ in overlapping area. Devil\'s Sight.',
  note: 'Cast on object → move it. Cast on weapon → mobile darkness.',
};

export const DEVILS_SIGHT = {
  source: 'Warlock Invocation (L2)',
  effect: 'See normally in magical AND nonmagical darkness, 120ft.',
  note: 'ONLY vision type that sees through Darkness spell.',
  combo: 'Darkness + Devil\'s Sight: you see, they don\'t.',
};

export const DARKNESS_COMBOS = [
  {
    combo: 'Darkness + Devil\'s Sight',
    effect: 'You: advantage on attacks (unseen). Enemies: disadvantage (can\'t see you). Can\'t be targeted by most spells.',
    rating: 'S+',
    downside: 'Allies are also blinded. Annoys party. Spell Sniper doesn\'t help allies.',
  },
  {
    combo: 'Shadow of Moil (L4 Warlock)',
    effect: 'You: heavily obscured (advantage/disadvantage like Darkness). 2d8 necrotic to melee attackers.',
    rating: 'S+ (better than Darkness)',
    downside: 'Self only. L4 slot. Concentration.',
    note: 'Doesn\'t blind allies! Strictly better than Darkness+DS in most cases.',
  },
  {
    combo: 'Darkness on object + throw',
    effect: 'Throw darkened object onto enemy caster. They can\'t see to cast.',
    rating: 'A+',
    note: 'Anti-caster tactic. Most spells require seeing target.',
  },
  {
    combo: 'Darkness + Eldritch Blast',
    effect: 'EB from darkness. Advantage. Enemies can\'t counter you.',
    rating: 'S',
    note: 'Best with Repelling Blast. Push from darkness.',
  },
  {
    combo: 'Shadow Blade (L2) in Darkness',
    effect: '2d8 psychic weapon. Advantage in dim/dark. In Darkness: always advantage.',
    rating: 'A+',
    note: 'Shadow Blade has advantage in darkness by default.',
  },
];

export const DARKNESS_COUNTERS = [
  { counter: 'Dispel Magic', detail: 'Ends Darkness spell. Standard counter.', rating: 'S' },
  { counter: 'Daylight (L3)', detail: 'L3 light spell dispels L2 Darkness. Works if overlapping.', rating: 'A+' },
  { counter: 'Blindsight', detail: 'Perceive without sight. Not affected by darkness.', rating: 'A+' },
  { counter: 'Tremorsense', detail: 'Detect through vibrations. Not affected.', rating: 'A' },
  { counter: 'Faerie Fire', detail: 'Outlines creatures. But needs to see area to target. May not work in Darkness.', rating: 'B' },
  { counter: 'AoE spells (no targeting)', detail: 'Fireball on the darkness area. Don\'t need to see targets.', rating: 'A+' },
  { counter: 'Leave the area', detail: 'Walk out of Darkness sphere. 15ft radius.', rating: 'A' },
];

export const DARKNESS_TIPS = [
  'Devil\'s Sight: ONLY vision that sees through magical darkness.',
  'Shadow of Moil > Darkness for Warlocks. Doesn\'t blind allies.',
  'Cast Darkness on a coin → drop it → pick it up to "turn off."',
  'Most spells require seeing the target. Darkness blocks casting.',
  'Allies are blinded too. Communicate before casting Darkness.',
  'Darkness + Devil\'s Sight: advantage attacks + disadvantage vs you.',
  'Daylight (L3) counters Darkness (L2). Higher level wins.',
  'AoE spells don\'t need sight. Fireball into Darkness works.',
  'Darkness is 15ft radius. Relatively small. Easy to walk out of.',
  'Shadow Blade + Darkness: advantage on Shadow Blade attacks.',
];
