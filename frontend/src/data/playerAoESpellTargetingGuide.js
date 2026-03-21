/**
 * playerAoESpellTargetingGuide.js
 * Player Mode: AoE spell shapes, positioning, and maximizing targets
 * Pure JS — no React dependencies.
 */

export const AOE_SHAPES = [
  {
    shape: 'Sphere',
    description: 'Spreads from a point. Affects all creatures in radius.',
    examples: ['Fireball (20ft radius)', 'Spirit Guardians (15ft from you)', 'Hypnotic Pattern (30ft cube, technically)'],
    positioning: 'Center on clusters. Fireball: 20ft radius = 40ft diameter. Covers a LOT of space.',
    note: 'Most common AoE shape. The "point of origin" can be placed precisely.',
  },
  {
    shape: 'Cone',
    description: 'Triangular blast from you outward. Width = length at the end.',
    examples: ['Burning Hands (15ft cone)', 'Cone of Cold (60ft cone)', 'Breath weapons (varies)'],
    positioning: 'Stand at angle to hit maximum enemies. 60ft cone is HUGE at its end.',
    note: 'Cones get wider with distance. 60ft cone is 60ft wide at the end.',
  },
  {
    shape: 'Line',
    description: 'Straight line from you. Hits everything in the path.',
    examples: ['Lightning Bolt (100ft × 5ft)', 'Wall of Fire (60ft long)', 'Moonbeam (5ft cylinder)'],
    positioning: 'Line up enemies. Works in corridors. Difficult in open spaces.',
    note: 'Lines hit in a narrow path. Best in corridors or when enemies line up.',
  },
  {
    shape: 'Cube',
    description: 'Box-shaped area. Can be placed with one face touching the origin.',
    examples: ['Thunderwave (15ft cube)', 'Darkness (15ft sphere, technically)', 'Stinking Cloud (20ft sphere)'],
    positioning: 'Cubes can be placed adjacent to you. Thunderwave: 15ft cube starting at you.',
    note: 'Cubes are measured from face, not center. Positioning matters.',
  },
  {
    shape: 'Cylinder',
    description: 'Circular area with height. Point of origin is the center top.',
    examples: ['Moonbeam (5ft radius, 40ft tall)', 'Call Lightning (60ft radius cloud, 10ft bolts)', 'Insect Plague (20ft sphere)'],
    positioning: 'Cylinders are vertical. Height matters in open areas but not in dungeons (ceiling).',
    note: 'Vertical reach catches flying creatures. 40ft Moonbeam cylinder is tall.',
  },
];

export const AOE_SPELL_COMPARISON = [
  { spell: 'Fireball', level: 3, shape: '20ft sphere', damage: '8d6 fire', save: 'DEX', rating: 'S', note: 'Gold standard AoE. 40ft diameter = massive area.' },
  { spell: 'Hypnotic Pattern', level: 3, shape: '30ft cube', damage: 'None (incapacitate)', save: 'WIS', rating: 'S+', note: 'No damage but removes enemies. Better than Fireball most of the time.' },
  { spell: 'Spirit Guardians', level: 3, shape: '15ft from you', damage: '3d8 radiant/necrotic per turn', save: 'WIS', rating: 'S+', note: 'Moves with you. Damages on entry AND start of turn. Incredible.' },
  { spell: 'Synaptic Static', level: 5, shape: '20ft sphere', damage: '8d6 psychic', save: 'INT', rating: 'S+', note: 'Same area as Fireball but INT save + lingering debuff. Better.' },
  { spell: 'Web', level: 2, shape: '20ft cube', damage: 'None (restrained)', save: 'DEX', rating: 'S+', note: 'Restrains + difficult terrain. Best L2 AoE.' },
  { spell: 'Thunderwave', level: 1, shape: '15ft cube', damage: '2d8 thunder', save: 'CON', rating: 'A', note: 'Pushes 10ft. Emergency melee escape.' },
  { spell: 'Shatter', level: 2, shape: '10ft sphere', damage: '3d8 thunder', save: 'CON', rating: 'A', note: 'Smaller area but hits constructs hard (disadvantage on save).' },
  { spell: 'Ice Storm', level: 4, shape: '20ft cylinder', damage: '2d8 bludgeoning + 4d6 cold', save: 'DEX', rating: 'A', note: 'Difficult terrain after. Lower damage than Fireball for L4.' },
  { spell: 'Cone of Cold', level: 5, shape: '60ft cone', damage: '8d8 cold', save: 'CON', rating: 'A+', note: 'Huge area. Cold is commonly resisted though.' },
  { spell: 'Meteor Swarm', level: 9, shape: '4×40ft spheres', damage: '40d6 fire+bludgeoning', save: 'DEX', rating: 'S+', note: 'Most damage in the game. 4 impact points. Nuke.' },
];

export const AOE_TARGETING_TIPS = [
  'Wait for enemies to cluster. One Fireball on 5 enemies > one on 2.',
  'DON\'T Fireball your allies. Check positioning before casting.',
  'Evocation Wizard: Sculpt Spells lets you protect allies in your AoE. Game-changing.',
  'Careful Spell (Sorcerer): allies auto-succeed on saves. Good but they still take half.',
  'Spirit Guardians: move INTO enemies to trigger damage. Walk through their space.',
  'Control AoE (Hypnotic Pattern, Web) is usually better than damage AoE.',
  'Prone enemies have disadvantage on DEX saves. Shove prone → Fireball = more damage.',
  'Synaptic Static > Fireball at L5. Same area, INT save (worse for monsters), + debuff.',
  'Place AoE to block escape routes. Wall of Fire across a corridor = no retreat.',
  'Friendly fire is the #1 reason parties hate AoE. Always communicate before casting.',
];

export const AOE_POSITIONING_RULES = [
  'Sphere: place center anywhere within range. 20ft radius = 1,256 sq ft of area.',
  'Cube: one face must include the point of origin. Usually adjacent to caster.',
  'Cone: starts at you, expands outward. Width = distance at the end.',
  'Line: goes from you in a straight line. 5ft wide usually.',
  'Cylinder: center top is the origin. Height matters for flying creatures.',
  'AoE goes around corners (most spells). Only total cover blocks.',
  'You can place the center of a Fireball JUST past your ally to exclude them.',
];
