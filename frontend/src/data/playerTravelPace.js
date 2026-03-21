/**
 * playerTravelPace.js
 * Player Mode: Travel pace, distance tracking, random encounters
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// TRAVEL PACES
// ---------------------------------------------------------------------------

export const TRAVEL_PACES = [
  {
    id: 'fast',
    label: 'Fast',
    milesPerHour: 4,
    milesPerDay: 30,
    feetPerMinute: 400,
    effect: '-5 penalty to passive Perception',
    color: '#ef4444',
  },
  {
    id: 'normal',
    label: 'Normal',
    milesPerHour: 3,
    milesPerDay: 24,
    feetPerMinute: 300,
    effect: 'No penalty',
    color: '#22c55e',
  },
  {
    id: 'slow',
    label: 'Slow',
    milesPerHour: 2,
    milesPerDay: 18,
    feetPerMinute: 200,
    effect: 'Can use Stealth',
    color: '#3b82f6',
  },
];

// ---------------------------------------------------------------------------
// TERRAIN MODIFIERS
// ---------------------------------------------------------------------------

export const TERRAIN_TRAVEL_MODIFIERS = [
  { terrain: 'Road/Highway', modifier: 1.0, note: 'Normal pace' },
  { terrain: 'Open Plains', modifier: 1.0, note: 'Normal pace' },
  { terrain: 'Forest', modifier: 0.5, note: 'Half pace (difficult terrain)' },
  { terrain: 'Hills', modifier: 0.5, note: 'Half pace (difficult terrain)' },
  { terrain: 'Mountains', modifier: 0.5, note: 'Half pace, may require climbing' },
  { terrain: 'Swamp', modifier: 0.5, note: 'Half pace (difficult terrain)' },
  { terrain: 'Desert', modifier: 0.5, note: 'Half pace, exhaustion risk (heat)' },
  { terrain: 'Arctic', modifier: 0.5, note: 'Half pace, exhaustion risk (cold)' },
  { terrain: 'Underdark', modifier: 0.5, note: 'Half pace, no natural light' },
  { terrain: 'River (boat)', modifier: 1.5, note: '1.5x downstream, 0.5x upstream' },
  { terrain: 'Sea (sailing ship)', modifier: null, note: '2 mph, 48 miles/day' },
];

// ---------------------------------------------------------------------------
// TRAVEL ACTIVITIES
// ---------------------------------------------------------------------------

export const TRAVEL_ACTIVITIES = [
  { name: 'Navigate', ability: 'WIS (Survival)', dc: 15, description: 'Prevent the group from becoming lost.' },
  { name: 'Draw a Map', ability: 'WIS (Survival)', dc: 15, description: 'Create an accurate map of the area traveled.' },
  { name: 'Track', ability: 'WIS (Survival)', dc: 'Varies', description: 'Follow tracks of another creature.' },
  { name: 'Forage', ability: 'WIS (Survival)', dc: 'Varies (10-20)', description: 'Find food and water. DC depends on terrain.' },
  { name: 'Keep Watch', ability: 'WIS (Perception)', dc: null, description: 'Use passive Perception to spot threats.' },
  { name: 'Stealth', ability: 'DEX (Stealth)', dc: null, description: 'Move quietly. Only at slow pace.' },
];

// ---------------------------------------------------------------------------
// FORAGING DCS
// ---------------------------------------------------------------------------

export const FORAGING_DCS = [
  { terrain: 'Forest/Coast', dc: 10, abundance: 'Abundant food and water' },
  { terrain: 'Grassland/Swamp', dc: 15, abundance: 'Moderate food and water' },
  { terrain: 'Arctic/Desert/Mountains', dc: 20, abundance: 'Scarce food and water' },
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Calculate travel distance.
 */
export function calculateTravelDistance(pace, hours, terrainModifier = 1.0) {
  const paceData = TRAVEL_PACES.find(p => p.id === pace) || TRAVEL_PACES[1];
  return Math.floor(paceData.milesPerHour * hours * terrainModifier);
}

/**
 * Calculate travel time for a given distance.
 */
export function calculateTravelTime(distance, pace, terrainModifier = 1.0) {
  const paceData = TRAVEL_PACES.find(p => p.id === pace) || TRAVEL_PACES[1];
  const effectiveSpeed = paceData.milesPerHour * terrainModifier;
  if (effectiveSpeed <= 0) return Infinity;
  return Math.ceil(distance / effectiveSpeed);
}

/**
 * Get forced march exhaustion save DC.
 */
export function getForcedMarchDC(extraHours) {
  return 10 + extraHours; // DC 10 after 8 hours, +1 per additional hour
}
