/**
 * Equipment Sets & Currency System — D&D 5e
 *
 * Covers roadmap items 116-120, 405-414 (Equipment sets, Attunement tracker,
 * Encumbrance, Currency converter, Consumable quick-use, Ammo tracking, Item comparison).
 */

// ── Equipment Set Templates ──
export const EQUIPMENT_SET_TEMPLATES = {
  dungeonCrawl: {
    label: 'Dungeon Crawl',
    description: 'Standard dungeon delving gear.',
    items: [
      'Primary weapon', 'Shield (if applicable)', 'Best armor',
      'Torches (10)', 'Rope (50 ft)', 'Pitons (10)',
      'Rations (3 days)', 'Waterskin', 'Healer\'s Kit',
      'Thieves\' Tools (if proficient)', 'Crowbar',
    ],
  },
  townVisit: {
    label: 'Town / Social',
    description: 'Light gear for social situations.',
    items: [
      'Concealed weapon (dagger)', 'Fine clothes or traveler\'s clothes',
      'Belt pouch', 'Component pouch/focus', 'Coin purse',
    ],
  },
  combat: {
    label: 'Full Combat',
    description: 'Maximum combat readiness.',
    items: [
      'Primary weapon', 'Secondary weapon', 'Best armor', 'Shield',
      'Potion of Healing (if available)', 'Ranged weapon + ammo',
      'Component pouch/focus',
    ],
  },
  travel: {
    label: 'Overland Travel',
    description: 'Long-distance travel gear.',
    items: [
      'Traveler\'s clothes', 'Bedroll', 'Mess kit', 'Tinderbox',
      'Rations (10 days)', 'Waterskin', 'Rope (50 ft)',
      'Map (if available)', 'Compass (if available)',
      'Tent (if party has one)',
    ],
  },
  stealth: {
    label: 'Stealth Mission',
    description: 'Light, quiet, dark-colored gear.',
    items: [
      'Light weapon (dagger, shortsword)', 'Dark cloak',
      'Thieves\' Tools', 'Grappling hook', 'Rope (silk, 50 ft)',
      'Caltrops (bag of 20)', 'Ball bearings (bag of 1000)',
      'Crowbar', 'Potion of Invisibility (if available)',
    ],
  },
};

// ── Currency System ──
export const CURRENCY = {
  cp: { name: 'Copper Piece', abbr: 'cp', value: 1, weight: 0.02 },
  sp: { name: 'Silver Piece', abbr: 'sp', value: 10, weight: 0.02 },
  ep: { name: 'Electrum Piece', abbr: 'ep', value: 50, weight: 0.02 },
  gp: { name: 'Gold Piece', abbr: 'gp', value: 100, weight: 0.02 },
  pp: { name: 'Platinum Piece', abbr: 'pp', value: 1000, weight: 0.02 },
};

// ── Attunement Rules ──
export const ATTUNEMENT_RULES = {
  maxSlots: 3,
  process: 'Short rest spent focusing on the item (not other short rest benefits)',
  endAttunement: [
    'Spend another short rest focusing on ending it',
    'More than 100 feet from the item for 24+ hours',
    'Die',
    'Another creature attunes to the item',
    'Specific item conditions (e.g., cursed items may not allow voluntary end)',
  ],
  notes: [
    'Can\'t attune to more than one copy of the same item',
    'Item properties that require attunement don\'t function without it',
    'Artificers can attune to more items at higher levels (4 at 10th, 5 at 14th, 6 at 18th)',
  ],
};

// ── Encumbrance Rules ──
export const ENCUMBRANCE_RULES = {
  standard: {
    label: 'Standard',
    carryCapacity: 'STR × 15 lbs',
    description: 'Can carry up to STR × 15. Over that, speed drops to 0.',
  },
  variant: {
    label: 'Variant Encumbrance',
    tiers: [
      { label: 'Unencumbered', threshold: 'STR × 5', penalty: 'None', color: '#22c55e' },
      { label: 'Encumbered', threshold: 'STR × 10', penalty: 'Speed -10 ft', color: '#eab308' },
      { label: 'Heavily Encumbered', threshold: 'STR × 15', penalty: 'Speed -20 ft, disadvantage on ability checks, attack rolls, and STR/DEX/CON saves', color: '#ef4444' },
    ],
  },
  sizeModifiers: {
    Tiny: 0.5, Small: 1, Medium: 1, Large: 2, Huge: 4, Gargantuan: 8,
  },
  pushDragLift: 'STR × 30 (double carry capacity) — speed drops to 5 ft while doing so',
};

// ── Consumable Quick-Use Templates ──
export const CONSUMABLES = {
  potionOfHealing: { name: 'Potion of Healing', effect: 'Regain 2d4+2 HP', action: 'Action (Bonus Action variant)', rarity: 'Common', cost: '50 gp' },
  potionOfGreaterHealing: { name: 'Potion of Greater Healing', effect: 'Regain 4d4+4 HP', action: 'Action', rarity: 'Uncommon', cost: '150 gp' },
  potionOfSuperiorHealing: { name: 'Potion of Superior Healing', effect: 'Regain 8d4+8 HP', action: 'Action', rarity: 'Rare', cost: '450 gp' },
  potionOfSupremeHealing: { name: 'Potion of Supreme Healing', effect: 'Regain 10d4+20 HP', action: 'Action', rarity: 'Very Rare', cost: '1350 gp' },
  antitoxin: { name: 'Antitoxin', effect: 'Advantage on saves vs poison for 1 hour', action: 'Action', rarity: 'Common', cost: '50 gp' },
  holyWater: { name: 'Holy Water', effect: '2d6 radiant damage to fiend/undead (ranged attack, 20 ft)', action: 'Action', rarity: 'Common', cost: '25 gp' },
  acidVial: { name: 'Acid Vial', effect: '2d6 acid damage (ranged attack, 20 ft)', action: 'Action', rarity: 'Common', cost: '25 gp' },
  alchemistFire: { name: 'Alchemist\'s Fire', effect: '1d4 fire damage each turn until extinguished (DC 10 DEX)', action: 'Action', rarity: 'Common', cost: '50 gp' },
  healersKit: { name: 'Healer\'s Kit', effect: 'Stabilize creature at 0 HP (no Medicine check). 10 uses.', action: 'Action', rarity: 'Common', cost: '5 gp' },
};

// ── Ammunition Types ──
export const AMMUNITION = {
  arrows: { name: 'Arrows', weapon: 'Longbow, Shortbow', count: 20, cost: '1 gp', weight: '1 lb', recoverable: '50% after battle' },
  bolts: { name: 'Crossbow Bolts', weapon: 'Crossbow (all)', count: 20, cost: '1 gp', weight: '1.5 lb', recoverable: '50% after battle' },
  bullets: { name: 'Sling Bullets', weapon: 'Sling', count: 20, cost: '4 cp', weight: '1.5 lb', recoverable: '50% after battle' },
  blowgunNeedles: { name: 'Blowgun Needles', weapon: 'Blowgun', count: 50, cost: '1 gp', weight: '1 lb', recoverable: '50% after battle' },
  silveredArrows: { name: 'Silvered Arrows', weapon: 'Longbow, Shortbow', count: 10, cost: '100 gp', weight: '0.5 lb', recoverable: '50%', special: 'Bypasses resistance to nonmagical attacks for some creatures' },
};

/**
 * Convert currency to a base amount (in copper pieces).
 */
export function convertToCopper(amount, type) {
  const currency = CURRENCY[type];
  return currency ? amount * currency.value : 0;
}

/**
 * Convert copper to any currency type.
 */
export function convertFromCopper(copperAmount, targetType) {
  const currency = CURRENCY[targetType];
  if (!currency) return 0;
  return Math.floor(copperAmount / currency.value);
}

/**
 * Auto-convert all currency to gold with remainder.
 */
export function convertAllToGold(cp = 0, sp = 0, ep = 0, gp = 0, pp = 0) {
  const totalCopper = cp + (sp * 10) + (ep * 50) + (gp * 100) + (pp * 1000);
  return {
    gp: Math.floor(totalCopper / 100),
    sp: Math.floor((totalCopper % 100) / 10),
    cp: totalCopper % 10,
    totalInGold: totalCopper / 100,
  };
}

/**
 * Calculate encumbrance tier.
 */
export function calculateEncumbrance(totalWeight, strengthScore, useVariant = false) {
  const capacity = strengthScore * 15;

  if (!useVariant) {
    return {
      currentWeight: totalWeight,
      capacity,
      percentage: Math.round((totalWeight / capacity) * 100),
      overEncumbered: totalWeight > capacity,
      tier: totalWeight > capacity ? 'Over Capacity' : 'Normal',
      color: totalWeight > capacity ? '#ef4444' : totalWeight > capacity * 0.75 ? '#eab308' : '#22c55e',
    };
  }

  const tier1 = strengthScore * 5;
  const tier2 = strengthScore * 10;
  let tier, penalty, color;
  if (totalWeight <= tier1) { tier = 'Unencumbered'; penalty = 'None'; color = '#22c55e'; }
  else if (totalWeight <= tier2) { tier = 'Encumbered'; penalty = 'Speed -10 ft'; color = '#eab308'; }
  else if (totalWeight <= capacity) { tier = 'Heavily Encumbered'; penalty = 'Speed -20 ft, disadvantage on checks/attacks/saves'; color = '#f97316'; }
  else { tier = 'Over Capacity'; penalty = 'Cannot move'; color = '#ef4444'; }

  return { currentWeight: totalWeight, capacity, percentage: Math.round((totalWeight / capacity) * 100), tier, penalty, color };
}

/**
 * Compare two items.
 */
export function compareItems(item1, item2) {
  const comparison = {};
  const props = ['ac', 'damage', 'weight', 'cost', 'range', 'properties'];
  for (const prop of props) {
    if (item1[prop] !== undefined || item2[prop] !== undefined) {
      comparison[prop] = { item1: item1[prop] ?? '—', item2: item2[prop] ?? '—' };
    }
  }
  return { item1Name: item1.name, item2Name: item2.name, comparison };
}

/**
 * Get equipment set template.
 */
export function getEquipmentSet(setName) {
  return EQUIPMENT_SET_TEMPLATES[setName] || null;
}

/**
 * Get all equipment set options.
 */
export function getEquipmentSets() {
  return Object.entries(EQUIPMENT_SET_TEMPLATES).map(([key, set]) => ({
    id: key, label: set.label, description: set.description,
  }));
}
