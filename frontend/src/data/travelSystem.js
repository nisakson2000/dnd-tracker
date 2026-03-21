/**
 * Travel System — Overland travel rules, encounters, and costs.
 */

export const TRAVEL_PACE = {
  fast: { label: 'Fast', milesPerDay: 30, effect: '-5 to passive Perception', stealth: false },
  normal: { label: 'Normal', milesPerDay: 24, effect: 'No penalties', stealth: false },
  slow: { label: 'Slow', milesPerDay: 18, effect: 'Can use Stealth', stealth: true },
};

export const TERRAIN_TRAVEL_MODIFIERS = {
  road: { label: 'Road/Highway', speedMultiplier: 1.0, encounterChance: 0.10 },
  plains: { label: 'Plains/Grassland', speedMultiplier: 1.0, encounterChance: 0.15 },
  forest: { label: 'Forest', speedMultiplier: 0.5, encounterChance: 0.20 },
  hills: { label: 'Hills', speedMultiplier: 0.75, encounterChance: 0.15 },
  mountain: { label: 'Mountain', speedMultiplier: 0.5, encounterChance: 0.20 },
  swamp: { label: 'Swamp', speedMultiplier: 0.5, encounterChance: 0.25 },
  desert: { label: 'Desert', speedMultiplier: 0.75, encounterChance: 0.15 },
  arctic: { label: 'Arctic/Tundra', speedMultiplier: 0.5, encounterChance: 0.10 },
  coastal: { label: 'Coastal', speedMultiplier: 1.0, encounterChance: 0.15 },
  underdark: { label: 'Underdark', speedMultiplier: 0.5, encounterChance: 0.30 },
};

export const TRAVEL_COSTS = {
  rations: { name: 'Rations (per day)', cost: 0.5, unit: 'gp/person' },
  water: { name: 'Waterskin refill', cost: 0.05, unit: 'gp' },
  lodging_poor: { name: 'Inn (poor)', cost: 0.1, unit: 'gp/night' },
  lodging_modest: { name: 'Inn (modest)', cost: 0.5, unit: 'gp/night' },
  lodging_comfortable: { name: 'Inn (comfortable)', cost: 1, unit: 'gp/night' },
  lodging_wealthy: { name: 'Inn (wealthy)', cost: 4, unit: 'gp/night' },
  lodging_aristocratic: { name: 'Inn (aristocratic)', cost: 10, unit: 'gp/night' },
  stabling: { name: 'Stabling (per mount)', cost: 0.5, unit: 'gp/night' },
  toll_road: { name: 'Toll road', cost: 0.1, unit: 'gp/person' },
  ferry: { name: 'River ferry', cost: 0.5, unit: 'gp/person' },
  ship_passage: { name: 'Ship passage', cost: 1, unit: 'gp/person/day' },
};

export const WEATHER_TABLE = [
  { roll: [1, 14], weather: 'Clear skies', effect: 'Normal travel.', season: 'all' },
  { roll: [15, 17], weather: 'Light rain', effect: 'Slightly muddy roads. No mechanical effect.', season: 'spring,summer,autumn' },
  { roll: [18, 18], weather: 'Heavy rain', effect: 'Visibility reduced. Difficult terrain outdoors.', season: 'spring,summer,autumn' },
  { roll: [19, 19], weather: 'Thunderstorm', effect: 'Travel dangerous. Disadvantage on Perception. Lightning risk.', season: 'spring,summer' },
  { roll: [20, 20], weather: 'Extreme weather', effect: 'Blizzard/sandstorm/monsoon. Travel halted or extremely dangerous.', season: 'all' },
  { roll: [15, 17], weather: 'Light snow', effect: 'Cold. Roads slippery. Normal speed on roads, half speed off-road.', season: 'winter' },
  { roll: [18, 19], weather: 'Heavy snow', effect: 'Visibility reduced. All terrain is difficult terrain.', season: 'winter' },
];

export function calculateTravelTime(distanceMiles, pace = 'normal', terrain = 'road') {
  const paceData = TRAVEL_PACE[pace] || TRAVEL_PACE.normal;
  const terrainData = TERRAIN_TRAVEL_MODIFIERS[terrain] || TERRAIN_TRAVEL_MODIFIERS.road;
  const effectiveMilesPerDay = paceData.milesPerDay * terrainData.speedMultiplier;
  const days = Math.ceil(distanceMiles / effectiveMilesPerDay);
  return { days, milesPerDay: effectiveMilesPerDay, pace: paceData, terrain: terrainData };
}

export function calculateTravelCost(days, partySize, lodgingTier = 'lodging_modest') {
  const rations = days * partySize * TRAVEL_COSTS.rations.cost;
  const lodging = days * partySize * (TRAVEL_COSTS[lodgingTier]?.cost || 0.5);
  return { rations, lodging, total: rations + lodging, perPerson: (rations + lodging) / partySize };
}

export function rollWeather(season = 'summer') {
  const roll = Math.floor(Math.random() * 20) + 1;
  const eligible = WEATHER_TABLE.filter(w => w.season === 'all' || w.season.includes(season));
  const result = eligible.find(w => roll >= w.roll[0] && roll <= w.roll[1]);
  return result || { weather: 'Clear skies', effect: 'Normal travel.', roll };
}
