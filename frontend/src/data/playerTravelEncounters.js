/**
 * playerTravelEncounters.js
 * Player Mode: Travel encounter types and overland journey management
 * Pure JS — no React dependencies.
 */

export const TRAVEL_PACES = [
  { pace: 'Fast', speed: '400 ft/min, 4 mph, 30 miles/day', penalty: '-5 to passive Perception', benefit: 'Cover ground quickly', note: 'Can\'t use Stealth. May miss hidden things.' },
  { pace: 'Normal', speed: '300 ft/min, 3 mph, 24 miles/day', penalty: 'None', benefit: 'Standard speed', note: 'Default pace. Balanced.' },
  { pace: 'Slow', speed: '200 ft/min, 2 mph, 18 miles/day', penalty: 'None', benefit: 'Can use Stealth', note: 'Take this in dangerous territory. Able to be stealthy.' },
];

export const TRAVEL_ACTIVITIES = [
  { activity: 'Navigate', skill: 'Survival (WIS)', description: 'Prevent the party from getting lost. DC depends on terrain.', who: 'One character (usually Ranger)' },
  { activity: 'Scout', skill: 'Stealth + Perception', description: 'Move ahead to spot threats before they spot you.', who: 'Rogue or Ranger, 1000ft ahead' },
  { activity: 'Forage', skill: 'Survival DC 10-20', description: 'Find food and water. DC depends on terrain.', who: 'Anyone with Survival' },
  { activity: 'Keep Watch', skill: 'Perception', description: 'Spot approaching threats. Use passive if not actively watching.', who: 'Best Perception character' },
  { activity: 'Map', skill: 'Cartographer\'s Tools or Survival', description: 'Create a map for future travel. Prevents getting lost on return.', who: 'Anyone with tools/skill' },
  { activity: 'Track', skill: 'Survival', description: 'Follow existing tracks. DC depends on conditions.', who: 'Ranger excels (Natural Explorer)' },
];

export const TERRAIN_NAVIGATION_DC = [
  { terrain: 'Forest', dc: 15, foragedc: 10, note: 'Easy to forage, moderate to navigate. Ambush-prone.' },
  { terrain: 'Grassland', dc: 10, foragedc: 10, note: 'Easy to navigate and forage. Visible from far away.' },
  { terrain: 'Mountain', dc: 15, foragedc: 15, note: 'Difficult terrain. Risk of rockslides and altitude sickness.' },
  { terrain: 'Desert', dc: 20, foragedc: 20, note: 'Very hard. Heat exhaustion (CON save). Water is critical.' },
  { terrain: 'Swamp', dc: 15, foragedc: 15, note: 'Difficult terrain. Disease risk. Poor visibility.' },
  { terrain: 'Arctic', dc: 20, foragedc: 20, note: 'Extreme cold (CON save). Very hard to forage. Blizzard risk.' },
  { terrain: 'Underdark', dc: 20, foragedc: 15, note: 'No landmarks. Dangerous creatures. Need light or darkvision.' },
  { terrain: 'Coast', dc: 10, foragedc: 10, note: 'Easy travel along shore. Weather can change suddenly.' },
  { terrain: 'Urban', dc: 5, foragedc: 10, note: 'Roads and signs. Can\'t get lost unless magically.' },
];

export const TRAVEL_ENCOUNTERS = [
  { type: 'Combat', frequency: 'Common', examples: ['Bandit ambush', 'Monster territory', 'Territorial beast'] },
  { type: 'Social', frequency: 'Common', examples: ['Traveling merchant', 'Lost traveler', 'Patrol/guard checkpoint'] },
  { type: 'Environmental', frequency: 'Moderate', examples: ['River crossing', 'Collapsed bridge', 'Landslide blocking path'] },
  { type: 'Discovery', frequency: 'Uncommon', examples: ['Abandoned camp', 'Ancient ruins', 'Hidden cave', 'Dead adventurer with loot'] },
  { type: 'Weather', frequency: 'Moderate', examples: ['Sudden storm', 'Fog bank', 'Flash flood', 'Heat wave'] },
  { type: 'Mystical', frequency: 'Rare', examples: ['Fey crossing', 'Wandering ghost', 'Time distortion', 'Magical anomaly'] },
];

export function getTerrainInfo(terrain) {
  return TERRAIN_NAVIGATION_DC.find(t =>
    t.terrain.toLowerCase().includes((terrain || '').toLowerCase())
  ) || null;
}

export function calculateTravelTime(miles, pace) {
  const speeds = { fast: 30, normal: 24, slow: 18 };
  const milesPerDay = speeds[(pace || 'normal').toLowerCase()] || 24;
  return {
    days: Math.ceil(miles / milesPerDay),
    milesPerDay,
    totalMiles: miles,
  };
}

export function getPace(name) {
  return TRAVEL_PACES.find(p =>
    p.pace.toLowerCase() === (name || '').toLowerCase()
  ) || null;
}
