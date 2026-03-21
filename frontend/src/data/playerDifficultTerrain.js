/**
 * playerDifficultTerrain.js
 * Player Mode: Difficult terrain rules and movement costs
 * Pure JS — no React dependencies.
 */

export const DIFFICULT_TERRAIN_RULES = {
  cost: 'Every foot of movement in difficult terrain costs 1 extra foot.',
  stacking: 'Multiple sources of difficult terrain don\'t stack — still costs 2x.',
  examples: [
    'Rubble, ice, dense undergrowth, steep stairs',
    'Snow, marshland, shallow water',
    'Furniture, bodies, magical effects (Entangle, Spike Growth)',
    'Space of another creature (whether hostile or not)',
  ],
  movement: 'If you have 30ft speed, you can move 15ft in difficult terrain.',
  crawling: 'Crawling in difficult terrain costs 3ft per 1ft moved (1 extra for crawling + 1 for terrain).',
};

export const TERRAIN_IMMUNITY = [
  { source: 'Land\'s Stride (Ranger 8 / Druid 6)', effect: 'Nonmagical difficult terrain costs no extra movement. Can move through nonmagical plants without being slowed or taking damage.' },
  { source: 'Mobile feat', effect: 'Difficult terrain doesn\'t cost extra movement when you use Dash.' },
  { source: 'Freedom of Movement (4th level)', effect: 'Unaffected by difficult terrain. Can\'t be restrained, paralyzed, or slowed by magic.' },
  { source: 'Spider Climb', effect: 'Not affected by web-based difficult terrain. Can climb at normal speed.' },
  { source: 'Fly spell / Flying speed', effect: 'Can fly over ground-based difficult terrain.' },
  { source: 'Pass without Trace', effect: 'Doesn\'t remove difficult terrain but +10 Stealth helps move through stealthily.' },
];

export const MAGICAL_TERRAIN = [
  { spell: 'Entangle', area: '20ft square', effect: 'Difficult terrain + restrained on failed STR save.', level: 1 },
  { spell: 'Spike Growth', area: '20ft radius', effect: 'Difficult terrain + 2d4 piercing per 5ft moved.', level: 2 },
  { spell: 'Web', area: '20ft cube', effect: 'Difficult terrain + restrained on failed DEX save.', level: 2 },
  { spell: 'Grease', area: '10ft square', effect: 'Difficult terrain + DEX save or fall prone.', level: 1 },
  { spell: 'Plant Growth', area: '100ft radius', effect: '4x movement cost (4ft per 1ft of movement).', level: 3 },
  { spell: 'Sleet Storm', area: '40ft radius', effect: 'Difficult terrain + heavily obscured + prone on failed DEX save.', level: 3 },
  { spell: 'Black Tentacles', area: '20ft square', effect: 'Difficult terrain + 3d6 bludgeoning + restrained on failed DEX save.', level: 4 },
];

export function getMovementCost(distance, isDifficult = false, isCrawling = false) {
  let multiplier = 1;
  if (isDifficult) multiplier += 1;
  if (isCrawling) multiplier += 1;
  return distance * multiplier;
}

export function getMaxMovement(speed, isDifficult = false, isCrawling = false) {
  const multiplier = 1 + (isDifficult ? 1 : 0) + (isCrawling ? 1 : 0);
  return Math.floor(speed / multiplier);
}
