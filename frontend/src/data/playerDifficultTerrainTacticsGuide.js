/**
 * playerDifficultTerrainTacticsGuide.js
 * Player Mode: Difficult terrain — rules, spells, combos, and counters
 * Pure JS — no React dependencies.
 */

export const DIFFICULT_TERRAIN_RULES = {
  effect: 'Every foot of movement costs 2 feet. 30ft speed = 15ft effective.',
  stacking: 'Multiple sources do NOT stack. Double cost maximum.',
  dash: 'Dashing in difficult terrain also halved.',
};

export const TERRAIN_CREATING_SPELLS = [
  { spell: 'Spike Growth', level: 2, area: '20ft radius', damage: '2d4/5ft moved', rating: 'S+', note: 'Best terrain spell. Damage + slow. Push combo destroys.' },
  { spell: 'Plant Growth', level: 3, area: '100ft radius', cost: '4ft per 1ft (!)', rating: 'S+', note: '30ft speed = 7.5ft/turn. No concentration. No save.' },
  { spell: 'Web', level: 2, area: '20ft cube', extra: 'Restrained on failed DEX save', rating: 'S', note: 'Restrained + difficult terrain. Flammable.' },
  { spell: 'Entangle', level: 1, area: '20ft square', extra: 'Restrained on STR save', rating: 'A+', note: 'L1 control. Restrained is devastating.' },
  { spell: 'Sleet Storm', level: 3, area: '40ft radius', extra: 'Heavily obscured + prone risk', rating: 'A+', note: 'Area denial. Extinguishes flames.' },
  { spell: 'Grease', level: 1, area: '10ft square', extra: 'Prone on DEX save', rating: 'A', note: 'Small but effective L1 control.' },
  { spell: 'Erupting Earth', level: 3, area: '20ft cube', extra: 'Permanent difficult terrain', rating: 'A', note: 'Terrain persists after spell ends.' },
  { spell: 'Wall of Thorns', level: 6, area: '60×10×5ft', extra: '7d8 piercing on entry', rating: 'A+', note: 'Wall + damage + difficult terrain.' },
];

export const TERRAIN_DAMAGE_COMBOS = [
  { combo: 'Spike Growth + Repelling Blast', damage: '4d4 per 10ft push (avg 10)', rating: 'S+', note: 'EB with Repelling Blast pushes 10ft per beam = 4d4 per beam.' },
  { combo: 'Spike Growth + Thorn Whip', damage: '2d4 per 5ft pulled', rating: 'S', note: 'Pull 10ft through Spike Growth = 4d4 extra damage.' },
  { combo: 'Spike Growth + Swarmkeeper', damage: '6d4 per 15ft push', rating: 'S+', note: '15ft no-save push through damaging terrain.' },
  { combo: 'Plant Growth + melee party', damage: 'N/A (control)', rating: 'S', note: 'Enemies stuck. Your melee fighters dominate. No escape.' },
  { combo: 'Entangle + ranged', damage: 'Advantage on attacks', rating: 'A+', note: 'Restrained = advantage for ranged. Shoot fish in a barrel.' },
];

export const OVERCOMING_TERRAIN = [
  'Freedom of Movement (L4): immune to difficult terrain entirely.',
  'Mobile feat: Dash ignores difficult terrain for that turn.',
  'Land\'s Stride (Ranger L8): ignore nonmagical difficult terrain.',
  'Fly/Levitate: bypass ground-based terrain.',
  'Teleportation (Misty Step, etc.): skip through terrain.',
  'Boots of Speed: double speed to compensate.',
  'Monk Unarmored Movement (L9): vertical surfaces and water.',
];
