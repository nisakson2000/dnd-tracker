/**
 * playerAreaEffectMastery.js
 * Player Mode: Area of effect spell placement, templates, and maximizing targets
 * Pure JS — no React dependencies.
 */

export const AOE_SHAPES = [
  { shape: 'Sphere', description: 'Spreads from a point. Extends around corners.', examples: ['Fireball (20ft)', 'Spirit Guardians (15ft)', 'Shatter (10ft)'], maxTargets: { '10ft': 9, '15ft': 21, '20ft': 37 } },
  { shape: 'Cone', description: 'From you, widens. Width = distance from you.', examples: ['Burning Hands (15ft)', 'Cone of Cold (60ft)', 'Breath Weapons'], maxTargets: { '15ft': 6, '30ft': 18, '60ft': 66 } },
  { shape: 'Line', description: 'Straight line, usually 5ft wide.', examples: ['Lightning Bolt (100ft)', 'Wall of Fire (60ft)'], maxTargets: { '30ft': 6, '60ft': 12, '100ft': 20 } },
  { shape: 'Cube', description: 'From one face. No corners.', examples: ['Thunderwave (15ft)', 'Darkness (15ft sphere)'], maxTargets: { '10ft': 4, '15ft': 9, '20ft': 16 } },
  { shape: 'Cylinder', description: 'Circle on ground extending up. Catches fliers.', examples: ['Moonbeam (5ft r, 40ft tall)', 'Flame Strike (10ft r)'] },
];

export const PLACEMENT_TACTICS = [
  { tactic: 'Bottleneck bombing', detail: 'Force enemies into a chokepoint, then AoE the chokepoint.', rating: 'S' },
  { tactic: 'Edge clipping', detail: 'Place AoE edge just catches enemies, not allies.', rating: 'A' },
  { tactic: 'Forced movement into AoE', detail: 'Repelling Blast, Thorn Whip into Spike Growth/Wall of Fire.', rating: 'S' },
  { tactic: 'Pre-cast walk-in', detail: 'Cast Spirit Guardians then walk into enemies.', rating: 'S' },
  { tactic: 'Combo AoE', detail: 'Stack effects: Web + Fireball, Spike Growth + push.', rating: 'S' },
  { tactic: 'LoS blocking', detail: 'Fog Cloud/Darkness on enemy archers.', rating: 'A' },
];

export const FRIENDLY_FIRE_PREVENTION = [
  { method: 'Sculpt Spells (Evocation Wizard)', effect: 'Choose creatures to auto-succeed + take 0 damage.', rating: 'S' },
  { method: 'Careful Spell (Sorcerer)', effect: 'Auto-succeed on save. Still take half on damage spells.', rating: 'A' },
  { method: 'Perfect placement', effect: 'Position AoE to exclude allies entirely.', rating: 'A' },
  { method: 'Communicate', effect: '"Clear out, Fireball incoming." Allies ready a move.', rating: 'B' },
];

export const BEST_AOE_BY_LEVEL = [
  { level: 1, spell: 'Thunderwave', shape: '15ft cube', damage: '2d8', note: 'Also pushes 10ft.' },
  { level: 2, spell: 'Shatter', shape: '10ft sphere', damage: '3d8', note: '60ft range. Thunder.' },
  { level: 3, spell: 'Fireball', shape: '20ft sphere', damage: '8d6', note: 'Gold standard. Overtuned for L3.' },
  { level: 3, spell: 'Spirit Guardians', shape: '15ft radius (you)', damage: '3d8/turn', note: 'Persistent. Best sustained AoE.' },
  { level: 5, spell: 'Synaptic Static', shape: '20ft sphere', damage: '8d6 psychic', note: 'Fireball but psychic + debuff.' },
  { level: 9, spell: 'Meteor Swarm', shape: '4x 40ft spheres', damage: '40d6', note: '140 avg. Mile range.' },
];

export function aoeTargetCount(radiusFt, spacingFt) {
  const gridSquares = Math.ceil(radiusFt / spacingFt);
  return Math.floor(Math.PI * gridSquares * gridSquares);
}

export function isFireballSafe(alliesInRange, hasSculpt) {
  return hasSculpt || alliesInRange === 0;
}
