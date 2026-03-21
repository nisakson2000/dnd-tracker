/**
 * playerDifficultTerrainMechanicsGuide.js
 * Player Mode: Difficult terrain rules and navigation
 * Pure JS — no React dependencies.
 */

export const DIFFICULT_TERRAIN_RULES = {
  rule: 'Every foot of movement in difficult terrain costs 1 extra foot.',
  effect: '30ft speed → 15ft through difficult terrain.',
  stacking: 'Multiple DT sources don\'t stack.',
  examples: ['Dense forest, mud, shallow water, rubble, ice, Web, Entangle, Spike Growth.'],
};

export const DT_IMMUNITY = [
  { source: 'Mobile feat', effect: 'DT doesn\'t cost extra when you Dash.', rating: 'A' },
  { source: 'Land\'s Stride (Ranger L8/Druid L6)', effect: 'Non-magical DT no extra cost.', rating: 'A' },
  { source: 'Freedom of Movement (L4)', effect: 'Ignore all DT. Can\'t be restrained.', rating: 'S' },
  { source: 'Flight', effect: 'Fly over ground DT.', rating: 'A' },
  { source: 'Teleportation', effect: 'Skip through/over DT.', rating: 'A' },
];

export const DT_SPELLS_RANKED = [
  { spell: 'Plant Growth', level: 3, area: '100ft radius', effect: '4ft per 1ft moved. No concentration!', rating: 'S' },
  { spell: 'Spike Growth', level: 2, area: '20ft radius', effect: 'DT + 2d4/5ft piercing. Invisible thorns.', rating: 'S' },
  { spell: 'Web', level: 2, area: '20ft cube', effect: 'DT + restrained (DEX save).', rating: 'A' },
  { spell: 'Entangle', level: 1, area: '20ft square', effect: 'DT + restrained (STR save).', rating: 'A' },
  { spell: 'Sleet Storm', level: 3, area: '40ft radius', effect: 'DT + prone + concentration checks + obscured.', rating: 'A' },
  { spell: 'Grease', level: 1, area: '10ft square', effect: 'DT + prone (DEX save).', rating: 'B' },
];

export const PLANT_GROWTH_VALUE = {
  effect: '4ft movement cost per 1ft. 30ft speed → 7ft effective.',
  concentration: 'NONE',
  area: '100ft radius',
  note: 'Strongest area denial for its level. No concentration. Lasts until dispelled. Cast before combat.',
};

export function movementInDT(baseSpeed, isPlantGrowth) {
  const effective = isPlantGrowth ? Math.floor(baseSpeed / 4) : Math.floor(baseSpeed / 2);
  return { effective, note: `${baseSpeed}ft → ${effective}ft in ${isPlantGrowth ? 'Plant Growth' : 'difficult terrain'}` };
}
