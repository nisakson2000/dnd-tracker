/**
 * playerLocationLog.js
 * Player Mode Improvements 185: Location discovery log
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// LOCATION TYPES
// ---------------------------------------------------------------------------

export const LOCATION_TYPES = [
  { id: 'city', label: 'City', color: '#60a5fa', icon: 'building' },
  { id: 'town', label: 'Town', color: '#4ade80', icon: 'home' },
  { id: 'village', label: 'Village', color: '#86efac', icon: 'home' },
  { id: 'dungeon', label: 'Dungeon', color: '#ef4444', icon: 'skull' },
  { id: 'wilderness', label: 'Wilderness', color: '#22c55e', icon: 'tree' },
  { id: 'cave', label: 'Cave', color: '#a78bfa', icon: 'mountain' },
  { id: 'temple', label: 'Temple', color: '#fbbf24', icon: 'church' },
  { id: 'fortress', label: 'Fortress', color: '#f97316', icon: 'castle' },
  { id: 'tavern', label: 'Tavern', color: '#fde68a', icon: 'beer' },
  { id: 'shop', label: 'Shop', color: '#c4b5fd', icon: 'shopping-bag' },
  { id: 'ruins', label: 'Ruins', color: '#94a3b8', icon: 'ruin' },
  { id: 'portal', label: 'Portal/Teleport', color: '#f472b6', icon: 'zap' },
  { id: 'other', label: 'Other', color: '#94a3b8', icon: 'map-pin' },
];

// ---------------------------------------------------------------------------
// LOCATION ENTRY TEMPLATE
// ---------------------------------------------------------------------------

export const LOCATION_TEMPLATE = {
  id: '',
  name: '',
  type: 'other',
  description: '',
  notableNpcs: [],
  questsHere: [],
  dangers: '',
  loot: '',
  visited: true,
  discoveredSession: null,
  timestamp: null,
  notes: '',
};

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Create a location entry.
 */
export function createLocation(name, type = 'other', description = '') {
  return {
    ...LOCATION_TEMPLATE,
    id: `loc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    type,
    description,
    timestamp: Date.now(),
  };
}

/**
 * Get location type info.
 */
export function getLocationTypeInfo(typeId) {
  return LOCATION_TYPES.find(t => t.id === typeId) || LOCATION_TYPES[LOCATION_TYPES.length - 1];
}

/**
 * Filter locations by type.
 */
export function filterLocations(locations, typeId) {
  if (!typeId || typeId === 'all') return locations;
  return locations.filter(l => l.type === typeId);
}

/**
 * Search locations by name or description.
 */
export function searchLocations(locations, query) {
  if (!query || !query.trim()) return locations;
  const q = query.toLowerCase().trim();
  return locations.filter(l =>
    (l.name || '').toLowerCase().includes(q) ||
    (l.description || '').toLowerCase().includes(q)
  );
}
