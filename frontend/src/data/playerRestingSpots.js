/**
 * playerRestingSpots.js
 * Player Mode: Safe rest location evaluation and camping
 * Pure JS — no React dependencies.
 */

export const REST_SAFETY_LEVELS = [
  { level: 'Very Safe', color: '#22c55e', encounterChance: '0%', examples: ['Inn room', 'Leomund\'s Tiny Hut', 'Temple sanctuary', 'Allied stronghold'], notes: 'Full rest guaranteed. Can take off armor.' },
  { level: 'Safe', color: '#86efac', encounterChance: '5-10%', examples: ['Secured dungeon room (barricaded)', 'Allied camp with guards', 'Rope Trick (short rest only)'], notes: 'Set a watch but interruption is unlikely.' },
  { level: 'Moderate', color: '#eab308', encounterChance: '15-25%', examples: ['Wilderness campsite', 'Abandoned building', 'Cleared dungeon area'], notes: 'Set watches. Keep weapons close. Alarm spell recommended.' },
  { level: 'Risky', color: '#f97316', encounterChance: '30-50%', examples: ['Active dungeon (uncleared rooms nearby)', 'Hostile territory', 'Road in dangerous region'], notes: 'Short rest only if necessary. Long rest is risky.' },
  { level: 'Dangerous', color: '#ef4444', encounterChance: '50-75%', examples: ['Enemy-controlled area', 'Monster lair', 'Underdark wilds'], notes: 'Avoid resting here. If you must, stack defenses.' },
];

export const REST_DEFENSES = [
  { defense: 'Alarm (1st, Ritual)', effect: 'Mental or audible alarm when a creature enters a 20ft cube.', duration: '8 hours', note: 'Perfect for long rests. Ritual = no slot cost.' },
  { defense: 'Leomund\'s Tiny Hut (3rd, Ritual)', effect: 'Impenetrable dome, 10ft radius. Blocks spells, weather, creatures.', duration: '8 hours', note: 'Best rest defense. Nothing gets in. Ritual cast.' },
  { defense: 'Watch Rotation', effect: 'Party members take turns staying awake to watch for threats.', duration: 'All night', note: 'Each watch: 2 hours. 4-person party = 2 hours each, everyone gets long rest.' },
  { defense: 'Caltrops / Ball Bearings', effect: 'Spread around camp. Slows or knocks prone approaching enemies.', duration: 'Until removed', note: 'Cheap, effective early warning.' },
  { defense: 'Guard Dog / Familiar', effect: 'Animals have keen senses and can alert the party.', duration: 'All night', note: 'Owl familiar has 120ft darkvision + advantage on Perception.' },
  { defense: 'Barricade', effect: 'Block doors/entrances with furniture, spikes, or magic.', duration: 'Until broken', note: 'Arcane Lock adds +10 to the DC to break the door.' },
  { defense: 'Rope Trick (2nd)', effect: 'Extradimensional space for up to 8 creatures.', duration: '1 hour (short rest only)', note: 'Invisible from outside. Perfect emergency short rest.' },
];

export const LONG_REST_REQUIREMENTS = {
  duration: '8 hours (at least 6 hours sleeping, 2 hours light activity)',
  lightActivity: 'Reading, talking, standing watch, eating — not casting or fighting.',
  interruption: 'If interrupted by combat or 1+ hour of strenuous activity, must start over.',
  frequency: 'Only one long rest per 24 hours.',
  elfTrance: 'Elves need only 4 hours of trance instead of 6 hours of sleep.',
};

export function evaluateRestSafety(isIndoors, isBarricaded, hasAlarm, hasGuards, isEnemyTerritory) {
  let score = 0;
  if (isIndoors) score += 2;
  if (isBarricaded) score += 1;
  if (hasAlarm) score += 1;
  if (hasGuards) score += 1;
  if (isEnemyTerritory) score -= 3;

  if (score >= 4) return REST_SAFETY_LEVELS[0];
  if (score >= 3) return REST_SAFETY_LEVELS[1];
  if (score >= 1) return REST_SAFETY_LEVELS[2];
  if (score >= 0) return REST_SAFETY_LEVELS[3];
  return REST_SAFETY_LEVELS[4];
}
