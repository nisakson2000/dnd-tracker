/**
 * playerSpellTargeting.js
 * Player Mode: Spell targeting rules and line of sight
 * Pure JS — no React dependencies.
 */

export const TARGETING_RULES = {
  lineOfSight: 'Most spells require you to see the target or a point within range.',
  lineOfEffect: 'A clear path between you and the target. Full cover blocks most spells.',
  self: 'Range: Self — only affects you (or emanates from you).',
  touch: 'Range: Touch — must touch the target. Requires a free hand or focus.',
  ranged: 'Range: X feet — target must be within the specified distance.',
  note: 'Spells that say "a creature you can see" cannot target invisible or hidden creatures.',
};

export const SPELL_TARGET_TYPES = [
  { type: 'Single Target', description: 'Affects one creature or object.', examples: ['Guiding Bolt', 'Hold Person', 'Polymorph'] },
  { type: 'Multiple Targets', description: 'Choose multiple targets within range.', examples: ['Scorching Ray (3 rays)', 'Eldritch Blast (multiple beams)'] },
  { type: 'Area of Effect', description: 'Affects all creatures in an area.', examples: ['Fireball (sphere)', 'Lightning Bolt (line)', 'Cone of Cold (cone)'] },
  { type: 'Self (Emanation)', description: 'Centered on you, affects creatures within range.', examples: ['Thunderwave (cube from you)', 'Spirit Guardians (15ft radius from you)'] },
  { type: 'Point in Space', description: 'Choose a point, effect originates from there.', examples: ['Fireball (choose a point within 150ft)', 'Darkness (choose a point)'] },
];

export const FRIENDLY_FIRE_SPELLS = [
  { spell: 'Fireball', area: '20ft radius', note: 'Hits everyone in the area, including allies!' },
  { spell: 'Thunderwave', area: '15ft cube from you', note: 'Only affects creatures in the cube — position carefully.' },
  { spell: 'Shatter', area: '10ft radius', note: 'Also damages objects and constructs.' },
  { spell: 'Hypnotic Pattern', area: '30ft cube', note: 'Can hit allies — but Careful Spell (Sorcerer) can protect them.' },
  { spell: 'Spirit Guardians', area: '15ft radius from you', note: 'You choose who is affected — allies are safe.' },
  { spell: 'Moonbeam', area: '5ft radius cylinder', note: 'Can move it on your turn — careful positioning.' },
  { spell: 'Web', area: '20ft cube', note: 'Restrains everyone — plan ally positioning first.' },
];

export const LINE_OF_SIGHT_BLOCKERS = [
  'Full cover (wall, closed door, large creature)',
  'Heavily obscured (darkness, fog, dense foliage)',
  'Invisibility (unless you can see invisible creatures)',
  'Fog Cloud, Darkness, Sleet Storm (heavily obscure)',
  'Globe of Invulnerability (blocks spells 5th and lower)',
];

export function canTarget(hasLineOfSight, hasCover, spellRequiresSight = true) {
  if (spellRequiresSight && !hasLineOfSight) return false;
  if (hasCover === 'full') return false; // full cover blocks targeting
  return true;
}

export function isFriendlyFireRisk(spellName) {
  return FRIENDLY_FIRE_SPELLS.some(s => s.spell.toLowerCase() === (spellName || '').toLowerCase());
}
