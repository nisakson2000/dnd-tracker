/**
 * playerMapNavigation.js
 * Player Mode: Overland travel and navigation helpers
 * Pure JS — no React dependencies.
 */

export const TRAVEL_SPEEDS = [
  { pace: 'Fast', milesPerHour: 4, milesPerDay: 30, effect: '-5 passive Perception', stealth: false },
  { pace: 'Normal', milesPerHour: 3, milesPerDay: 24, effect: 'No effect', stealth: false },
  { pace: 'Slow', milesPerHour: 2, milesPerDay: 18, effect: 'Can use Stealth', stealth: true },
];

export const TERRAIN_TRAVEL_MODIFIERS = [
  { terrain: 'Road/Highway', modifier: 1.0, note: 'Normal speed. Safest travel.' },
  { terrain: 'Plains/Grassland', modifier: 1.0, note: 'Normal speed. Easy terrain.' },
  { terrain: 'Forest', modifier: 0.5, note: 'Half speed. Easy to get lost.' },
  { terrain: 'Hills', modifier: 0.75, note: 'Three-quarter speed.' },
  { terrain: 'Mountains', modifier: 0.5, note: 'Half speed. Climbing, altitude.' },
  { terrain: 'Swamp', modifier: 0.5, note: 'Half speed. Difficult footing, disease risk.' },
  { terrain: 'Desert', modifier: 0.5, note: 'Half speed. Extreme heat, water scarcity.' },
  { terrain: 'Arctic', modifier: 0.5, note: 'Half speed. Extreme cold, snow.' },
  { terrain: 'Jungle', modifier: 0.25, note: 'Quarter speed. Dense foliage, hazards.' },
  { terrain: 'Coast', modifier: 1.0, note: 'Normal speed. Beach/cliffs.' },
];

export const NAVIGATION_CHECKS = {
  check: 'WIS (Survival)',
  frequency: 'Once per day of travel, or when conditions change.',
  dcByTerrain: [
    { terrain: 'Road', dc: 0, note: 'No check needed — follow the road.' },
    { terrain: 'Open terrain (plains)', dc: 10, note: 'Easy navigation by landmarks.' },
    { terrain: 'Forest/hills', dc: 15, note: 'Moderate difficulty. Use compass/stars.' },
    { terrain: 'Mountains/swamp', dc: 15, note: 'Hard. Dense fog or featureless terrain.' },
    { terrain: 'Desert/arctic', dc: 20, note: 'Very hard. Few landmarks, harsh conditions.' },
    { terrain: 'Deep forest/jungle', dc: 20, note: 'Very hard. Canopy blocks sky.' },
  ],
  failureResult: 'Party becomes lost. Add 1d6 hours to travel time. May encounter additional hazards.',
};

export const TRAVEL_ACTIVITIES = [
  { activity: 'Navigate', description: 'WIS (Survival) to keep the party on course. Prevents getting lost.', limit: 'One navigator.' },
  { activity: 'Keep Watch', description: 'Passive Perception to notice threats. Fast pace: -5 to passive Perception.', limit: 'Multiple watchers allowed.' },
  { activity: 'Map', description: 'Draw a map of the terrain as you travel. Helps with return trips.', limit: 'One mapper.' },
  { activity: 'Forage', description: 'WIS (Survival) DC 10-15 to find food/water. 1d6+WIS mod pounds of food.', limit: 'Can\'t navigate and forage simultaneously.' },
  { activity: 'Track', description: 'WIS (Survival) to follow a trail. DC depends on terrain and age of tracks.', limit: 'Slow pace required.' },
  { activity: 'Scout Ahead', description: 'Move ahead of the party to spot threats. Stealth check if slow pace.', limit: 'One scout. Risk of separation.' },
];

export function calculateTravelTime(miles, pace, terrainModifier = 1.0) {
  const speed = TRAVEL_SPEEDS.find(t => t.pace.toLowerCase() === (pace || 'normal').toLowerCase()) || TRAVEL_SPEEDS[1];
  const effectiveSpeed = speed.milesPerHour * terrainModifier;
  return { hours: miles / effectiveSpeed, days: miles / (speed.milesPerDay * terrainModifier) };
}

export function getTerrainModifier(terrain) {
  const entry = TERRAIN_TRAVEL_MODIFIERS.find(t => t.terrain.toLowerCase().includes((terrain || '').toLowerCase()));
  return entry ? entry.modifier : 1.0;
}
