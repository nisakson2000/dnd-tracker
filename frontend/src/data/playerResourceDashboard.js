/**
 * playerResourceDashboard.js
 * Player Mode: Centralized resource tracking — spell slots, abilities, items
 * Pure JS — no React dependencies.
 */

export const RESOURCE_CATEGORIES = [
  { category: 'Spell Slots', color: '#9c27b0', icon: '✨', trackBy: 'used/max', recharge: 'Long rest (Warlock: Short rest)' },
  { category: 'Class Abilities', color: '#2196f3', icon: '⚡', trackBy: 'used/max', recharge: 'Varies (Short or Long rest)' },
  { category: 'Hit Dice', color: '#4caf50', icon: '❤️', trackBy: 'remaining/max', recharge: 'Long rest (recover half)' },
  { category: 'Items', color: '#ff9800', icon: '🎒', trackBy: 'quantity', recharge: 'Purchase/Find' },
  { category: 'Racial Abilities', color: '#e91e63', icon: '🌟', trackBy: 'used/max', recharge: 'Varies' },
  { category: 'Feat Abilities', color: '#607d8b', icon: '📜', trackBy: 'used/max', recharge: 'Varies' },
];

export const SPELL_SLOT_TABLE = {
  1: [2], 2: [3], 3: [4, 2], 4: [4, 3], 5: [4, 3, 2],
  6: [4, 3, 3], 7: [4, 3, 3, 1], 8: [4, 3, 3, 2], 9: [4, 3, 3, 3, 1],
  10: [4, 3, 3, 3, 2], 11: [4, 3, 3, 3, 2, 1], 12: [4, 3, 3, 3, 2, 1],
  13: [4, 3, 3, 3, 2, 1, 1], 14: [4, 3, 3, 3, 2, 1, 1],
  15: [4, 3, 3, 3, 2, 1, 1, 1], 16: [4, 3, 3, 3, 2, 1, 1, 1],
  17: [4, 3, 3, 3, 2, 1, 1, 1, 1], 18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
  19: [4, 3, 3, 3, 3, 2, 1, 1, 1], 20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
};

export const CONSUMABLE_ITEMS = [
  { item: 'Potion of Healing', healing: '2d4+2 (avg 7)', rarity: 'Common', cost: '50 gp' },
  { item: 'Potion of Greater Healing', healing: '4d4+4 (avg 14)', rarity: 'Uncommon', cost: '100 gp' },
  { item: 'Potion of Superior Healing', healing: '8d4+8 (avg 28)', rarity: 'Rare', cost: '500 gp' },
  { item: 'Potion of Supreme Healing', healing: '10d4+20 (avg 45)', rarity: 'Very Rare', cost: '5,000 gp' },
  { item: 'Scroll (1st level)', effect: 'Cast a 1st-level spell', rarity: 'Common', cost: '25 gp' },
  { item: 'Antitoxin', effect: 'Advantage on poison saves for 1 hour', rarity: 'Common', cost: '50 gp' },
  { item: 'Alchemist\'s Fire', effect: '1d4 fire damage per turn', rarity: 'Common', cost: '50 gp' },
  { item: 'Holy Water', effect: '2d6 radiant vs undead/fiend', rarity: 'Common', cost: '25 gp' },
];

export function getSpellSlots(level) {
  return SPELL_SLOT_TABLE[level] || [];
}

export function createResourceState(className, level) {
  const slots = getSpellSlots(level);
  return {
    spellSlots: slots.map((max, i) => ({ level: i + 1, used: 0, max })),
    hitDice: { used: 0, max: level },
    classAbilities: [],
    consumables: [],
    notes: '',
  };
}

export function getResourceSummary(state) {
  const slotsRemaining = state.spellSlots.reduce((sum, s) => sum + (s.max - s.used), 0);
  const slotsTotal = state.spellSlots.reduce((sum, s) => sum + s.max, 0);
  const hitDiceRemaining = state.hitDice.max - state.hitDice.used;
  return {
    slotsUsed: slotsTotal - slotsRemaining,
    slotsRemaining,
    slotsTotal,
    hitDiceRemaining,
    hitDiceTotal: state.hitDice.max,
    percentRemaining: Math.round((slotsRemaining / Math.max(slotsTotal, 1)) * 100),
  };
}
