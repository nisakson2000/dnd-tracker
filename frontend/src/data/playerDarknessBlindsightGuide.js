/**
 * playerDarknessBlindsightGuide.js
 * Player Mode: Darkness, blindsight, tremorsense, and vision rules
 * Pure JS — no React dependencies.
 */

export const VISION_TYPES = [
  {
    name: 'Normal Vision',
    range: 'Unlimited (with light)',
    detail: 'Requires bright or dim light. Dim light = disadvantage on Perception. Darkness = blind.',
    counters: 'Darkness, fog, invisibility.',
  },
  {
    name: 'Darkvision',
    range: '60ft (most races), 120ft (Drow, Deep Gnome, Owlin)',
    detail: 'See in darkness as dim light (grayscale). Dim light = bright light. Still disadvantage in darkness.',
    counters: 'Magical darkness (Darkness spell), Fog Cloud, invisibility.',
    note: 'Darkvision does NOT let you see in darkness perfectly. It treats darkness as dim light = disadvantage on Perception.',
  },
  {
    name: 'Blindsight',
    range: '10-30ft (varies)',
    detail: 'Perceive surroundings without sight. Not affected by darkness, invisibility, or fog.',
    sources: ['Bat familiar (60ft)', 'Blind Fighting style (10ft)', 'Roper (60ft)', 'Dragon (varies)'],
    note: 'Best vision type. Defeats invisibility, darkness, fog. Short range is the only weakness.',
  },
  {
    name: 'Tremorsense',
    range: '30-60ft (varies)',
    detail: 'Detect creatures touching the ground. Doesn\'t work against flying/levitating creatures.',
    sources: ['Certain monsters (Bulette 60ft, Purple Worm 60ft)'],
    note: 'Niche. Only works on grounded creatures. Rarely available to PCs.',
  },
  {
    name: 'Truesight',
    range: '120ft (True Seeing spell)',
    detail: 'See in normal and magical darkness. See invisible. See through illusions. See into Ethereal Plane.',
    sources: ['True Seeing (L6 spell)', 'Some high-CR creatures'],
    note: 'Ultimate vision. Defeats everything. L6 spell, expensive (25gp component consumed).',
  },
  {
    name: 'Devil\'s Sight',
    range: '120ft',
    detail: 'See normally in darkness (including magical darkness). Warlock invocation.',
    sources: ['Warlock: Devil\'s Sight invocation'],
    note: 'Key part of the Darkness + Devil\'s Sight combo. Only Warlock invocation.',
  },
];

export const DARKNESS_SPELL_COMBO = {
  spell: 'Darkness',
  level: 2,
  effect: '15ft radius magical darkness. Non-magical light can\'t illuminate it. Darkvision can\'t see through it.',
  combo: {
    devilsSight: {
      method: 'Warlock casts Darkness + has Devil\'s Sight invocation.',
      result: 'You see normally. Enemies are blinded. You have advantage, they have disadvantage. Effectively invisible.',
      note: 'One of the strongest combos in the game. Completely shuts down enemies without blindsight/truesight.',
    },
    shadowSorcerer: {
      method: 'Shadow Sorcerer L3: Eyes of the Dark. See through your own Darkness spell.',
      result: 'Same as Devil\'s Sight but Sorcerer. Can also cast Darkness with Sorcery Points (2 SP).',
    },
    blindFighting: {
      method: 'Fighting Initiate/Fighter: Blind Fighting style (10ft blindsight).',
      result: 'Only 10ft range. Must be in melee. Works but much weaker than Devil\'s Sight.',
    },
  },
  counters: [
    'Blindsight/Tremorsense: not affected by darkness.',
    'Dispel Magic: removes the Darkness spell.',
    'Daylight (L3): counters Darkness (L2). Higher level wins.',
    'Move out of the area: 15ft radius. Just walk away.',
    'AoE spells: don\'t require sight (Fireball targets a point, not a creature).',
  ],
};

export const HEAVILY_OBSCURED = {
  condition: 'Effectively blinded when trying to see through: darkness, opaque fog, dense foliage.',
  blindedEffects: [
    'Can\'t see. Auto-fail ability checks requiring sight.',
    'Attack rolls against blinded creature have advantage.',
    'Blinded creature\'s attack rolls have disadvantage.',
  ],
  note: 'Fog Cloud, Darkness, and similar spells create heavily obscured areas. Both sides are blinded unless they have special vision.',
};

export const LIGHTLY_OBSCURED = {
  condition: 'Dim light, patchy fog, moderate foliage.',
  effect: 'Disadvantage on Perception checks that rely on sight.',
  note: 'Darkvision treats darkness as dim light. So even with darkvision, you have disadvantage on Perception in total darkness.',
};

export function canSeeInDarkness(hasDarkvision, darkvisionRange, hasDevilsSight, hasBlindFighting, hasTruesight) {
  if (hasTruesight) return { canSee: true, type: 'Truesight', note: 'See through all darkness including magical.' };
  if (hasDevilsSight) return { canSee: true, type: 'Devil\'s Sight', note: 'See normally in all darkness (120ft).' };
  if (hasBlindFighting) return { canSee: true, type: 'Blind Fighting', note: 'Blindsight 10ft only. Very limited range.' };
  if (hasDarkvision) return { canSee: true, type: 'Darkvision', note: `See ${darkvisionRange}ft in non-magical darkness as dim light (disadvantage on Perception).` };
  return { canSee: false, type: 'None', note: 'Effectively blinded in darkness.' };
}
