/**
 * playerBlindFightingGuide.js
 * Player Mode: Fighting while blinded, in darkness, or against invisible enemies
 * Pure JS — no React dependencies.
 */

export const BLINDED_CONDITION = {
  effect: 'Can\'t see. Auto-fail checks requiring sight. Attack rolls have disadvantage. Attacks against you have advantage.',
  sources: ['Darkness (no darkvision)', 'Blindness/Deafness spell', 'Color Spray', 'Fog Cloud', 'Wall of Sand'],
};

export const INVISIBLE_CONDITION = {
  effect: 'Impossible to see without magic. Advantage on attacks. Attacks against you have disadvantage.',
  detection: 'Not hidden. Creatures know your location from sound/tracks. You CAN still be targeted (with disadvantage).',
  hiding: 'Invisible + Hide action = hidden. Now creatures don\'t know your location at all.',
  counters: ['See Invisibility (2nd)', 'True Seeing (6th)', 'Faerie Fire (1st, outlines targets)', 'Blindsight/Tremorsense', 'Flour/paint thrown on creature'],
};

export const FIGHTING_UNSEEN = [
  { method: 'Blindsight', range: 'Varies (usually 10-60ft)', source: 'Blind Fighting style (10ft), some races/creatures', note: 'See without sight. Ignores invisibility and darkness.' },
  { method: 'Tremorsense', range: 'Varies', source: 'Some creatures, rare magic items', note: 'Detect creatures touching the ground.' },
  { method: 'Truesight', range: 'Usually 120ft', source: 'True Seeing spell, some creatures', note: 'See through all illusions, invisibility, and into Ethereal.' },
  { method: 'Faerie Fire', range: '60ft, 20ft cube', source: '1st level (Druid/Bard)', note: 'Targets outlined in light. Advantage on attacks against them. Negates invisibility.' },
  { method: 'AoE spells', range: 'Varies', source: 'Any caster', note: 'Fireball doesn\'t need to see the target — just the point. AoE hits invisible creatures.' },
  { method: 'Fog Cloud (counter-darkness)', range: '120ft', source: '1st level', note: 'Both sides equally blinded = cancels out advantage/disadvantage.' },
];

export const DARKNESS_DEVIL_SIGHT = {
  combo: 'Warlock casts Darkness + has Devil\'s Sight invocation.',
  yourAdvantage: 'You see normally. Enemies are blinded.',
  result: 'Advantage on all your attacks. Disadvantage on all attacks against you.',
  warning: 'Allies in the Darkness are ALSO blinded. Position carefully.',
  solutions: ['Cast Darkness on yourself/an object. Move it.', 'Tell allies to stay outside the Darkness radius.', 'Use with Eldritch Blast from inside (120ft range).'],
};

export const PARTY_FRIENDLY_DARKNESS = [
  { method: 'Fog Cloud', effect: 'Both sides blinded equally. No net advantage but cancels enemy advantages.', note: 'Cheaper than Darkness. Doesn\'t affect non-sight senses.' },
  { method: 'Shadow of Moil (4th Warlock)', effect: 'YOU are in darkness. Allies can see normally. Best of both worlds.', note: 'You\'re heavily obscured but it doesn\'t blind your allies.' },
  { method: 'Blind Fighting style allies', effect: 'Allies with Blind Fighting (10ft) can fight in Darkness normally.', note: 'Fighter/Ranger can take this. Only 10ft range though.' },
];

export function attackModifiersInDarkness(canSee, targetCanSee) {
  if (canSee && !targetCanSee) return 'Advantage (you see them, they\'re blinded)';
  if (!canSee && targetCanSee) return 'Disadvantage (you\'re blinded, they see you)';
  if (!canSee && !targetCanSee) return 'Normal (both blinded = advantage and disadvantage cancel)';
  return 'Normal';
}

export function canSeeInvisible(hasSeeInvisibility, hasTruesight, hasBlindsight, hasFaerieFire) {
  return hasSeeInvisibility || hasTruesight || hasBlindsight || hasFaerieFire;
}
