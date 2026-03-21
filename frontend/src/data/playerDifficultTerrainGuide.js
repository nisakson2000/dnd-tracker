/**
 * playerDifficultTerrainGuide.js
 * Player Mode: Difficult terrain rules, interactions, and workarounds
 * Pure JS — no React dependencies.
 */

export const DIFFICULT_TERRAIN_RULES = {
  cost: 'Every 1 foot of movement costs 2 feet of speed in difficult terrain.',
  stacking: 'Multiple sources of difficult terrain DON\'T stack. It\'s always 2x cost, not 4x.',
  examples: ['Rubble', 'Ice', 'Mud', 'Dense undergrowth', 'Steep stairs', 'Snow', 'Furniture', 'Spell effects (Web, Entangle, etc.)'],
  doesNotAffect: ['Flying creatures (usually)', 'Creatures with special movement', 'Freedom of Movement targets'],
  squeezing: 'Moving through a space one size smaller costs 2x movement (like difficult terrain).',
};

export const DIFFICULT_TERRAIN_SOURCES = {
  natural: [
    { source: 'Dense forest/undergrowth', type: 'Natural', counter: 'Ranger (Natural Explorer) ignores this in favored terrain' },
    { source: 'Rocky/rubble-filled ground', type: 'Natural', counter: 'Fly, Spider Climb, careful path-finding' },
    { source: 'Ice/slippery surfaces', type: 'Natural', counter: 'Crampons, Spider Climb, careful movement' },
    { source: 'Deep snow', type: 'Natural', counter: 'Snowshoes, Fly, mounts' },
    { source: 'Shallow water (1-3 feet)', type: 'Natural', counter: 'Swim speed, Water Walk spell' },
    { source: 'Steep slopes', type: 'Natural', counter: 'Climbing speed, Spider Climb, Fly' },
  ],
  magical: [
    { source: 'Web', type: 'Spell (2nd)', counter: 'STR check to break, fire (burns away in 1 round), Freedom of Movement' },
    { source: 'Entangle', type: 'Spell (1st)', counter: 'STR save to escape, Freedom of Movement' },
    { source: 'Spike Growth', type: 'Spell (2nd)', counter: 'Fly (doesn\'t touch ground), Freedom of Movement' },
    { source: 'Plant Growth', type: 'Spell (3rd)', counter: 'Fly, or spend 4x movement (can\'t be dispelled — instant duration)' },
    { source: 'Sleet Storm', type: 'Spell (3rd)', counter: 'DEX save or fall prone. Fly helps. Very hard to counter in it.' },
    { source: 'Grease', type: 'Spell (1st)', counter: 'DEX save or fall prone. Careful movement.' },
  ],
};

export const IGNORING_DIFFICULT_TERRAIN = [
  { method: 'Freedom of Movement', type: 'Spell (4th)', effect: 'Ignore difficult terrain entirely. Also can\'t be restrained.', duration: '1 hour' },
  { method: 'Ranger: Natural Explorer', type: 'Class feature', effect: 'Ignore difficult terrain in favored terrain. Party also benefits.', duration: 'Passive' },
  { method: 'Mobile feat', type: 'Feat', effect: 'Difficult terrain doesn\'t cost extra movement when you Dash.', duration: 'Passive' },
  { method: 'Land\'s Stride (Ranger 8/Druid 6)', type: 'Class feature', effect: 'Ignore nonmagical difficult terrain. Advantage vs magical plants.', duration: 'Passive' },
  { method: 'Fly/levitate', type: 'Various', effect: 'Ground-based difficult terrain doesn\'t affect flying creatures.', duration: 'Varies' },
  { method: 'Boots of Striding and Springing', type: 'Magic Item (Uncommon)', effect: 'Speed can\'t be reduced below 30ft. Advantage on jumping.', duration: 'Passive' },
  { method: 'Monk: Unarmored Movement (9th)', type: 'Class feature', effect: 'Move along vertical surfaces and across liquids.', duration: 'Passive' },
  { method: 'Spider Climb', type: 'Spell (2nd)', effect: 'Climb speed = walk speed. Walk on walls/ceilings. Bypasses ground terrain.', duration: '1 hour (conc)' },
];

export const DIFFICULT_TERRAIN_TACTICS = [
  { tactic: 'Chokepoint + difficult terrain', detail: 'Place difficult terrain in a narrow passage. Enemies take multiple rounds to reach you. Free ranged attacks.' },
  { tactic: 'Spike Growth cheese', detail: 'Spike Growth + forced movement. Enemy moves 30ft through = 12d4 damage. No save. Just physics.' },
  { tactic: 'Plant Growth fortress', detail: 'Plant Growth (no concentration) in a circle around your party. Enemies need 120ft of movement to cross 30ft.' },
  { tactic: 'Defensive terrain', detail: 'Cast difficult terrain between you and melee enemies. They can\'t reach you in one turn. You shoot them freely.' },
  { tactic: 'Fly above your own terrain', detail: 'Create difficult terrain for enemies, then Fly above it yourself. They\'re slowed, you\'re not.' },
];

export function movementInDifficultTerrain(speed, distance) {
  const effectiveCost = distance * 2;
  const canTraverse = speed >= effectiveCost;
  const maxDistance = Math.floor(speed / 2);
  return { canTraverse, maxDistance, speedNeeded: effectiveCost, speedAvailable: speed };
}

export function dashInDifficultTerrain(speed) {
  // Dash doubles your speed, then difficult terrain halves it
  const dashSpeed = speed * 2;
  const maxDistance = Math.floor(dashSpeed / 2);
  return { maxDistance, withDash: true };
}
