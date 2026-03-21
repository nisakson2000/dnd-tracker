/**
 * Navigation Rules — Terrain-based navigation DCs, tools, lost consequences, and survival checks.
 * Covers roadmap item #449 (Navigation checks).
 */

// ---------------------------------------------------------------------------
// 1. NAVIGATION_DCS — terrain-based navigation difficulty
// ---------------------------------------------------------------------------
export const NAVIGATION_DCS = {
  road:      { label: 'Road/Highway',     dc: 5,  notes: 'Auto-success in most cases.' },
  plains:    { label: 'Plains/Grassland', dc: 10, notes: 'Open sightlines; landmarks visible.' },
  forest:    { label: 'Forest',           dc: 12, notes: 'Canopy obscures sky; paths twist.' },
  hills:     { label: 'Hills',            dc: 12, notes: 'Ridgelines help, but valleys mislead.' },
  mountain:  { label: 'Mountains',        dc: 15, notes: 'Altitude, weather, and limited passes.' },
  swamp:     { label: 'Swamp',            dc: 15, notes: 'Featureless terrain; fog common.' },
  desert:    { label: 'Desert',           dc: 18, notes: 'No landmarks; heat distortion.' },
  arctic:    { label: 'Arctic',           dc: 18, notes: 'Whiteout conditions; no landmarks.' },
  underdark: { label: 'Underdark',        dc: 20, notes: 'No sky, no sun, no natural reference.' },
  open_sea:  { label: 'Open Sea',         dc: 15, notes: 'DC 10 with compass; DC 5 with maps + compass.' },
};

// ---------------------------------------------------------------------------
// 2. NAVIGATION_TOOLS — tools that modify the navigation DC
// ---------------------------------------------------------------------------
export const NAVIGATION_TOOLS = [
  { id: 'compass',          label: 'Compass',                  dcModifier: -3,    special: null },
  { id: 'map_accurate',     label: 'Map (accurate)',           dcModifier: -5,    special: null },
  { id: 'map_rough',        label: 'Map (rough/hand-drawn)',   dcModifier: -2,    special: null },
  { id: 'guide_npc',        label: 'Guide NPC',               dcModifier: null,  special: 'Auto-success for known areas.' },
  { id: 'ranger_favored',   label: 'Ranger (favored terrain)', dcModifier: null, special: 'Auto-success in favored terrain.' },
  { id: 'stars_clear',      label: 'Stars (clear night)',      dcModifier: -2,    special: 'Only applies to open terrain (plains, desert, sea, arctic).' },
];

// ---------------------------------------------------------------------------
// 3. LOST_CONSEQUENCES — what happens when a navigation check fails
// ---------------------------------------------------------------------------
export const LOST_CONSEQUENCES = [
  {
    failRange: [1, 4],
    label: 'Veered Slightly',
    travelTimePenalty: 0.25,
    description: 'The party drifts off course. Add 25% to remaining travel time.',
    randomEncounters: 0,
    extra: null,
  },
  {
    failRange: [5, 9],
    label: 'Significantly Lost',
    travelTimePenalty: 0.50,
    description: 'The party is clearly lost. Add 50% to remaining travel time and roll a random encounter.',
    randomEncounters: 1,
    extra: null,
  },
  {
    failRange: [10, Infinity],
    label: 'Completely Lost',
    travelTimePenalty: 1.0,
    description: 'The party is hopelessly lost. Double remaining travel time, roll 2 random encounters, and the party may wander into dangerous territory.',
    randomEncounters: 2,
    extra: 'Party may end up in a dangerous area (DM discretion).',
  },
];

// ---------------------------------------------------------------------------
// 4. SURVIVAL_CHECKS — foraging, weather prediction, hazard detection
// ---------------------------------------------------------------------------
export const SURVIVAL_CHECKS = {
  find_water: {
    label: 'Find Water',
    skill: 'Survival',
    terrainDCs: {
      forest: 10,
      plains: 12,
      hills: 12,
      swamp: 8,
      mountain: 14,
      desert: 20,
      arctic: 15,
      underdark: 18,
      coastal: 8,
    },
    notes: 'Success locates a water source within 1d4 hours of travel.',
  },
  find_food: {
    label: 'Forage for Food',
    skill: 'Survival',
    terrainDCs: {
      forest: 10,
      plains: 12,
      hills: 12,
      swamp: 14,
      mountain: 15,
      desert: 20,
      arctic: 18,
      underdark: 18,
      coastal: 10,
    },
    notes: 'Success yields 1d6 + Wisdom modifier pounds of food.',
  },
  predict_weather: {
    label: 'Predict Weather',
    skill: 'Survival',
    dc: 12,
    notes: 'Predicts the next 24 hours of weather. DC increases by 3 for each additional day predicted.',
  },
  detect_hazard: {
    label: 'Detect Natural Hazard',
    skill: 'Survival / Perception',
    terrainDCs: {
      quicksand: 12,
      avalanche_risk: 15,
      flash_flood: 14,
      thin_ice: 13,
      sinkhole: 14,
      volcanic_vent: 12,
      falling_rocks: 13,
    },
    notes: 'Detected hazards can be avoided or prepared for. Failure means the party walks into them.',
  },
};

// ---------------------------------------------------------------------------
// 5. Helper functions
// ---------------------------------------------------------------------------

/**
 * Calculate the effective navigation DC for a terrain after applying tool modifiers.
 * @param {string} terrain — key from NAVIGATION_DCS (e.g., 'forest', 'open_sea')
 * @param {string[]} tools — array of tool ids from NAVIGATION_TOOLS (e.g., ['compass', 'map_accurate'])
 * @returns {{ dc: number, autoSuccess: boolean, terrain: object, appliedTools: object[] }}
 */
export function getNavigationDC(terrain, tools = []) {
  const terrainData = NAVIGATION_DCS[terrain];
  if (!terrainData) {
    return { dc: null, autoSuccess: false, terrain: null, appliedTools: [], error: `Unknown terrain: ${terrain}` };
  }

  const appliedTools = NAVIGATION_TOOLS.filter(t => tools.includes(t.id));
  const autoTool = appliedTools.find(t => t.special && t.special.toLowerCase().includes('auto-success'));
  if (autoTool) {
    return { dc: 0, autoSuccess: true, terrain: terrainData, appliedTools, note: autoTool.special };
  }

  const totalModifier = appliedTools.reduce((sum, t) => sum + (t.dcModifier || 0), 0);
  const effectiveDC = Math.max(1, terrainData.dc + totalModifier);

  return { dc: effectiveDC, autoSuccess: false, terrain: terrainData, appliedTools };
}

/**
 * Determine the consequence for failing a navigation check by a given amount.
 * @param {number} failBy — how much the roll failed by (DC − roll, must be ≥ 1)
 * @returns {object|null} matching consequence entry, or null if failBy < 1
 */
export function getLostConsequence(failBy) {
  if (failBy < 1) return null;
  return LOST_CONSEQUENCES.find(c => failBy >= c.failRange[0] && failBy <= c.failRange[1]) || null;
}

/**
 * Return the full list of navigation tools for UI rendering.
 * @returns {object[]}
 */
export function getNavigationTools() {
  return NAVIGATION_TOOLS;
}
