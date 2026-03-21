/**
 * playerTerrainEffects.js
 * Player Mode: Terrain types and their combat effects
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// TERRAIN TYPES
// ---------------------------------------------------------------------------

export const TERRAIN_TYPES = [
  {
    id: 'normal',
    label: 'Normal',
    movementCost: 1,
    color: '#4ade80',
    effects: [],
  },
  {
    id: 'difficult',
    label: 'Difficult Terrain',
    movementCost: 2,
    color: '#fbbf24',
    effects: ['Each foot of movement costs 1 extra foot'],
    examples: ['Rubble', 'Undergrowth', 'Ice', 'Swamp', 'Steep stairs', 'Snow'],
  },
  {
    id: 'water_shallow',
    label: 'Shallow Water',
    movementCost: 2,
    color: '#60a5fa',
    effects: ['Difficult terrain', 'May extinguish fire-based effects'],
  },
  {
    id: 'water_deep',
    label: 'Deep Water',
    movementCost: 2,
    color: '#3b82f6',
    effects: ['Requires swimming', 'Disadvantage on most melee attacks without swim speed'],
  },
  {
    id: 'lava',
    label: 'Lava',
    movementCost: 2,
    color: '#ef4444',
    effects: ['10d10 fire damage per round of contact', 'Destroys most objects'],
  },
  {
    id: 'ice',
    label: 'Slippery Ice',
    movementCost: 2,
    color: '#93c5fd',
    effects: ['Difficult terrain', 'DC 10 DEX save or fall prone when moving'],
  },
  {
    id: 'magical_darkness',
    label: 'Magical Darkness',
    movementCost: 1,
    color: '#1e1b4b',
    effects: ['Heavily obscured', 'Darkvision doesn\'t help', 'Non-magical light doesn\'t illuminate'],
  },
  {
    id: 'webs',
    label: 'Webs',
    movementCost: 4,
    color: '#d4d4d8',
    effects: ['Difficult terrain (4x cost)', 'DC 12 DEX save or restrained', 'Flammable'],
  },
  {
    id: 'grease',
    label: 'Grease',
    movementCost: 2,
    color: '#a3e635',
    effects: ['Difficult terrain', 'DC 10 DEX save or fall prone', 'Flammable'],
  },
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Get terrain info.
 */
export function getTerrainInfo(terrainId) {
  return TERRAIN_TYPES.find(t => t.id === terrainId) || TERRAIN_TYPES[0];
}

/**
 * Calculate movement cost in terrain.
 */
export function getMovementCost(feet, terrainId) {
  const terrain = getTerrainInfo(terrainId);
  return feet * terrain.movementCost;
}

/**
 * Check if terrain has hazard effects.
 */
export function isHazardous(terrainId) {
  const hazards = ['lava', 'magical_darkness', 'webs'];
  return hazards.includes(terrainId);
}
