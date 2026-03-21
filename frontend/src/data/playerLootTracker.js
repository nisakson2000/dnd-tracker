/**
 * playerLootTracker.js
 * Player Mode: Track loot found, party loot splitting, and treasure display
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// LOOT ENTRY TEMPLATE
// ---------------------------------------------------------------------------

export const LOOT_ENTRY_TEMPLATE = {
  id: '',
  name: '',
  type: 'item',         // item, gold, gem, art, magic_item
  quantity: 1,
  value: 0,             // in gold pieces
  rarity: 'common',
  description: '',
  claimedBy: null,       // player name who claimed it
  session: null,
  timestamp: null,
};

// ---------------------------------------------------------------------------
// TREASURE TYPES
// ---------------------------------------------------------------------------

export const TREASURE_TYPES = [
  { id: 'coins', label: 'Coins', icon: 'coins', color: '#fbbf24' },
  { id: 'gem', label: 'Gemstones', icon: 'gem', color: '#a78bfa' },
  { id: 'art', label: 'Art Objects', icon: 'palette', color: '#f472b6' },
  { id: 'magic_item', label: 'Magic Items', icon: 'sparkles', color: '#60a5fa' },
  { id: 'mundane', label: 'Mundane Items', icon: 'package', color: '#94a3b8' },
  { id: 'scroll', label: 'Scrolls', icon: 'scroll', color: '#4ade80' },
  { id: 'potion', label: 'Potions', icon: 'flask', color: '#86efac' },
];

// ---------------------------------------------------------------------------
// GEMSTONE VALUES (common)
// ---------------------------------------------------------------------------

export const GEM_VALUES = [
  { gp: 10, examples: ['Azurite', 'Banded Agate', 'Blue Quartz', 'Eye Agate', 'Hematite', 'Lapis Lazuli', 'Malachite', 'Moss Agate', 'Obsidian', 'Rhodochrosite', 'Tiger Eye', 'Turquoise'] },
  { gp: 50, examples: ['Bloodstone', 'Carnelian', 'Chalcedony', 'Chrysoprase', 'Citrine', 'Jasper', 'Moonstone', 'Onyx', 'Quartz', 'Sardonyx', 'Star Rose Quartz', 'Zircon'] },
  { gp: 100, examples: ['Amber', 'Amethyst', 'Chrysoberyl', 'Coral', 'Garnet', 'Jade', 'Jet', 'Pearl', 'Spinel', 'Tourmaline'] },
  { gp: 500, examples: ['Alexandrite', 'Aquamarine', 'Black Pearl', 'Blue Spinel', 'Peridot', 'Topaz'] },
  { gp: 1000, examples: ['Black Opal', 'Blue Sapphire', 'Emerald', 'Fire Opal', 'Opal', 'Star Ruby', 'Star Sapphire', 'Yellow Sapphire'] },
  { gp: 5000, examples: ['Black Sapphire', 'Diamond', 'Jacinth', 'Ruby'] },
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Create a loot entry.
 */
export function createLootEntry(name, type = 'item', value = 0, quantity = 1) {
  return {
    ...LOOT_ENTRY_TEMPLATE,
    id: `loot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    type,
    value,
    quantity,
    timestamp: Date.now(),
  };
}

/**
 * Calculate total loot value (in GP).
 */
export function calculateTotalValue(lootEntries) {
  return lootEntries.reduce((sum, entry) => sum + (entry.value || 0) * (entry.quantity || 1), 0);
}

/**
 * Split loot evenly among party members.
 */
export function splitLootEvenly(totalGP, partySize) {
  if (partySize <= 0) return { perPerson: 0, remainder: 0 };
  const perPerson = Math.floor(totalGP / partySize);
  const remainder = totalGP % partySize;
  return { perPerson, remainder };
}

/**
 * Get unclaimed loot.
 */
export function getUnclaimedLoot(lootEntries) {
  return lootEntries.filter(e => !e.claimedBy);
}

/**
 * Get loot claimed by a specific player.
 */
export function getLootByPlayer(lootEntries, playerName) {
  return lootEntries.filter(e => e.claimedBy === playerName);
}

/**
 * Group loot by type.
 */
export function groupLootByType(lootEntries) {
  const groups = {};
  for (const entry of lootEntries) {
    const type = entry.type || 'item';
    if (!groups[type]) groups[type] = [];
    groups[type].push(entry);
  }
  return groups;
}
