/**
 * playerItemRarity.js
 * Player Mode Improvements 108-109: Attunement slots and item rarity color coding
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// ITEM RARITIES (D&D 5e)
// ---------------------------------------------------------------------------

export const ITEM_RARITIES = {
  common: { label: 'Common', color: '#94a3b8', glow: 'rgba(148,163,184,0.2)', sortOrder: 0 },
  uncommon: { label: 'Uncommon', color: '#4ade80', glow: 'rgba(74,222,128,0.2)', sortOrder: 1 },
  rare: { label: 'Rare', color: '#60a5fa', glow: 'rgba(96,165,250,0.2)', sortOrder: 2 },
  very_rare: { label: 'Very Rare', color: '#a78bfa', glow: 'rgba(167,139,250,0.25)', sortOrder: 3 },
  legendary: { label: 'Legendary', color: '#fbbf24', glow: 'rgba(251,191,36,0.25)', sortOrder: 4 },
  artifact: { label: 'Artifact', color: '#f97316', glow: 'rgba(249,115,22,0.3)', sortOrder: 5 },
};

/**
 * Get rarity display info.
 */
export function getRarityInfo(rarity) {
  const key = (rarity || 'common').toLowerCase().replace(/[\s-]/g, '_');
  return ITEM_RARITIES[key] || ITEM_RARITIES.common;
}

// ---------------------------------------------------------------------------
// ATTUNEMENT
// ---------------------------------------------------------------------------

export const ATTUNEMENT_RULES = {
  maxSlots: 3,
  artificerBonus: (level) => {
    if (level >= 18) return 3; // 6 total
    if (level >= 14) return 2; // 5 total
    if (level >= 10) return 1; // 4 total
    return 0;
  },
  description: 'You can attune to a maximum of 3 magic items at a time. Attuning takes a short rest.',
};

/**
 * Get max attunement slots for a character.
 */
export function getMaxAttunementSlots(className, level) {
  const base = ATTUNEMENT_RULES.maxSlots;
  if (className && className.toLowerCase().includes('artificer')) {
    return base + ATTUNEMENT_RULES.artificerBonus(level);
  }
  return base;
}

/**
 * Check if character can attune to more items.
 */
export function canAttune(currentAttuned, maxSlots) {
  return currentAttuned < maxSlots;
}

// ---------------------------------------------------------------------------
// INVENTORY SORTING
// ---------------------------------------------------------------------------

export const SORT_OPTIONS = [
  { id: 'name', label: 'Name (A-Z)', sort: (a, b) => (a.name || '').localeCompare(b.name || '') },
  { id: 'type', label: 'Type', sort: (a, b) => (a.item_type || a.type || '').localeCompare(b.item_type || b.type || '') },
  { id: 'rarity', label: 'Rarity', sort: (a, b) => {
    const ra = getRarityInfo(a.rarity).sortOrder;
    const rb = getRarityInfo(b.rarity).sortOrder;
    return rb - ra; // higher rarity first
  }},
  { id: 'weight', label: 'Weight', sort: (a, b) => (b.weight || 0) - (a.weight || 0) },
];

// ---------------------------------------------------------------------------
// INVENTORY FILTERS
// ---------------------------------------------------------------------------

export const INVENTORY_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'weapon', label: 'Weapons' },
  { id: 'armor', label: 'Armor' },
  { id: 'consumable', label: 'Consumables' },
  { id: 'wondrous', label: 'Wondrous Items' },
  { id: 'gear', label: 'Adventuring Gear' },
  { id: 'tool', label: 'Tools' },
  { id: 'treasure', label: 'Treasure' },
];

/**
 * Filter items by category.
 */
export function filterItems(items, filterId) {
  if (filterId === 'all') return items;
  return items.filter(item => {
    const type = (item.item_type || item.type || '').toLowerCase();
    return type.includes(filterId);
  });
}

/**
 * Search items by name.
 */
export function searchItems(items, query) {
  if (!query || !query.trim()) return items;
  const q = query.toLowerCase().trim();
  return items.filter(item => (item.name || '').toLowerCase().includes(q));
}
