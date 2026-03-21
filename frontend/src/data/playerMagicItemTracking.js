/**
 * playerMagicItemTracking.js
 * Player Mode: Magic item charge tracking, attunement display, and item identification
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// ATTUNEMENT RULES
// ---------------------------------------------------------------------------

export const ATTUNEMENT_RULES = {
  maxSlots: 3,
  artificerBonus: { level10: 4, level14: 5, level18: 6 },
  process: {
    duration: 'Short rest (1 hour)',
    description: 'Spend a short rest focused on the item. Must be within reach.',
  },
  endAttunement: [
    'End attunement as an action (if within reach).',
    'More than 100 feet away for 24 hours.',
    'Dying ends all attunements.',
    'Another creature attunes to the item.',
  ],
};

// ---------------------------------------------------------------------------
// ITEM RARITIES
// ---------------------------------------------------------------------------

export const ITEM_RARITIES = [
  { id: 'common', label: 'Common', color: '#9ca3af', valueRange: '50-100 gp' },
  { id: 'uncommon', label: 'Uncommon', color: '#22c55e', valueRange: '101-500 gp' },
  { id: 'rare', label: 'Rare', color: '#3b82f6', valueRange: '501-5,000 gp' },
  { id: 'very_rare', label: 'Very Rare', color: '#a855f7', valueRange: '5,001-50,000 gp' },
  { id: 'legendary', label: 'Legendary', color: '#f97316', valueRange: '50,001+ gp' },
  { id: 'artifact', label: 'Artifact', color: '#ef4444', valueRange: 'Priceless' },
];

/**
 * Get rarity info.
 */
export function getRarityInfo(rarity) {
  return ITEM_RARITIES.find(r => r.id === (rarity || '').toLowerCase() || r.label.toLowerCase() === (rarity || '').toLowerCase()) || ITEM_RARITIES[0];
}

// ---------------------------------------------------------------------------
// CHARGE-BASED ITEMS
// ---------------------------------------------------------------------------

export const CHARGE_ITEM_TEMPLATE = {
  name: '',
  maxCharges: 0,
  currentCharges: 0,
  rechargeRule: '',      // e.g., "1d6+1 at dawn"
  destroyOnEmpty: false, // some items break at 0 charges on a roll of 1
  destroyChance: null,   // e.g., "Roll d20 when last charge used. On 1, item is destroyed."
};

// ---------------------------------------------------------------------------
// COMMON CHARGE ITEMS
// ---------------------------------------------------------------------------

export const COMMON_CHARGE_ITEMS = [
  { name: 'Wand of Magic Missiles', maxCharges: 7, recharge: '1d6+1 at dawn', destroy: 'On 1 when last charge used' },
  { name: 'Wand of Fireballs', maxCharges: 7, recharge: '1d6+1 at dawn', destroy: 'On 1 when last charge used' },
  { name: 'Wand of Lightning Bolts', maxCharges: 7, recharge: '1d6+1 at dawn', destroy: 'On 1 when last charge used' },
  { name: 'Staff of the Magi', maxCharges: 50, recharge: '4d6+2 at dawn', destroy: 'Retributive strike option' },
  { name: 'Staff of Power', maxCharges: 20, recharge: '2d8+4 at dawn', destroy: 'Retributive strike option' },
  { name: 'Staff of Healing', maxCharges: 10, recharge: '1d6+4 at dawn', destroy: null },
  { name: 'Ring of Spell Storing', maxCharges: 5, recharge: 'Store spells (slot levels)', destroy: null },
  { name: 'Cloak of Displacement', maxCharges: null, recharge: 'Reactivates at start of turn if not damaged', destroy: null },
  { name: 'Boots of Speed', maxCharges: null, recharge: '10 minutes of use, recharges on long rest', destroy: null },
  { name: 'Cape of the Mountebank', maxCharges: 1, recharge: '1 at dawn', destroy: null },
  { name: 'Helm of Telepathy', maxCharges: null, recharge: 'At will + 1/day suggestion', destroy: null },
  { name: 'Necklace of Fireballs', maxCharges: null, recharge: 'None (consumable beads)', destroy: 'Thrown into fire: all remaining beads explode' },
];
