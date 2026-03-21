/**
 * playerMagicItemAttunement.js
 * Player Mode: Attunement rules, limits, and tracking
 * Pure JS — no React dependencies.
 */

export const ATTUNEMENT_RULES = {
  maxItems: 3,
  process: 'Short rest spent focusing on the item (not the same short rest used to learn properties via Identify).',
  ending: [
    'Finishing a short rest focused on ending attunement.',
    'Exceeding 100 feet from the item for 24 hours.',
    'Dying.',
    'Another creature attuning to the item.',
  ],
  note: 'Not all magic items require attunement. Check item description.',
  artificerBonus: 'Artificers can attune to more items at higher levels (4 at 10th, 5 at 14th, 6 at 18th).',
};

export const RARITY_LEVELS = [
  { rarity: 'Common', color: '#9ca3af', priceRange: '50-100 gp', example: 'Potion of Healing' },
  { rarity: 'Uncommon', color: '#22c55e', priceRange: '101-500 gp', example: '+1 Weapon' },
  { rarity: 'Rare', color: '#3b82f6', priceRange: '501-5,000 gp', example: '+2 Weapon' },
  { rarity: 'Very Rare', color: '#a855f7', priceRange: '5,001-50,000 gp', example: '+3 Weapon' },
  { rarity: 'Legendary', color: '#f59e0b', priceRange: '50,001+ gp', example: 'Holy Avenger' },
  { rarity: 'Artifact', color: '#ef4444', priceRange: 'Priceless', example: 'Book of Exalted Deeds' },
];

export const ATTUNEMENT_TEMPLATE = {
  slot1: null,
  slot2: null,
  slot3: null,
};

export function getMaxAttunementSlots(className, level) {
  if ((className || '').toLowerCase() === 'artificer') {
    if (level >= 18) return 6;
    if (level >= 14) return 5;
    if (level >= 10) return 4;
  }
  return 3;
}

export function getRarityInfo(rarity) {
  return RARITY_LEVELS.find(r => r.rarity.toLowerCase() === (rarity || '').toLowerCase()) || RARITY_LEVELS[0];
}

export function getRarityColor(rarity) {
  return getRarityInfo(rarity).color;
}

export function canAttune(currentAttunedCount, maxSlots = 3) {
  return currentAttunedCount < maxSlots;
}
