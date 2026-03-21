// playerInventoryTools.js
// Player Mode Improvements 101-120: Inventory & Equipment Data
// Pure JS — no React

// ---------------------------------------------------------------------------
// 1. ITEM_CATEGORIES
// ---------------------------------------------------------------------------
export const ITEM_CATEGORIES = {
  weapon: {
    label: "Weapon",
    iconHint: "sword",
    color: "#ef4444",
  },
  armor: {
    label: "Armor",
    iconHint: "shield",
    color: "#6b7280",
  },
  potion: {
    label: "Potion",
    iconHint: "flask",
    color: "#ec4899",
  },
  scroll: {
    label: "Scroll",
    iconHint: "scroll",
    color: "#f59e0b",
  },
  wand_rod_staff: {
    label: "Wand / Rod / Staff",
    iconHint: "wand",
    color: "#8b5cf6",
  },
  ring: {
    label: "Ring",
    iconHint: "ring",
    color: "#fbbf24",
  },
  wondrous_item: {
    label: "Wondrous Item",
    iconHint: "sparkles",
    color: "#06b6d4",
  },
  ammunition: {
    label: "Ammunition",
    iconHint: "arrow",
    color: "#84cc16",
  },
  tool: {
    label: "Tool",
    iconHint: "wrench",
    color: "#f97316",
  },
  adventuring_gear: {
    label: "Adventuring Gear",
    iconHint: "backpack",
    color: "#a3a3a3",
  },
};

// ---------------------------------------------------------------------------
// 2. RARITY_COLORS
// ---------------------------------------------------------------------------
export const RARITY_COLORS = {
  common: "#9ca3af",
  uncommon: "#22c55e",
  rare: "#3b82f6",
  very_rare: "#a855f7",
  legendary: "#f59e0b",
  artifact: "#ef4444",
};

// ---------------------------------------------------------------------------
// 3. ENCUMBRANCE_RULES
// ---------------------------------------------------------------------------
export const ENCUMBRANCE_RULES = {
  standard: {
    description:
      "Carry up to 15 × STR score lbs without penalty. Exceeding this grants the Encumbered condition.",
    carryMultiplier: 15,
    penalty: null,
  },
  variant: {
    description:
      "5 × STR = Encumbered (−10 ft speed). 10 × STR = Heavily Encumbered (−20 ft speed, disadvantage on STR/DEX/CON checks and saves).",
    thresholds: {
      encumbered: {
        multiplier: 5,
        label: "Encumbered",
        speedPenalty: -10,
        disadvantage: [],
      },
      heavily_encumbered: {
        multiplier: 10,
        label: "Heavily Encumbered",
        speedPenalty: -20,
        disadvantage: ["STR checks", "STR saves", "DEX checks", "DEX saves", "CON checks", "CON saves"],
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 4. ATTUNEMENT_RULES
// ---------------------------------------------------------------------------
export const ATTUNEMENT_RULES = {
  maxSlots: 3,
  exceptions: {
    artificer: {
      description: "Artificers can attune to one additional magic item (max 4 at level 10, 5 at level 14, 6 at level 18).",
      slotsAtLevel: { 1: 3, 10: 4, 14: 5, 18: 6 },
    },
  },
  attunementProcess: {
    restRequired: "short rest",
    description: "A creature must spend a short rest (at least 1 hour) focused on the item to attune to it.",
  },
  attunementEnds: [
    { trigger: "distance", detail: "More than 100 ft away from the item for 24 hours." },
    { trigger: "death", detail: "The creature dies." },
    { trigger: "another_attunement", detail: "The creature attunes to another item and is already at the max." },
    { trigger: "willingly_ends", detail: "The creature chooses to end attunement (short rest)." },
  ],
};

// ---------------------------------------------------------------------------
// 5. AMMUNITION_TRACKING
// ---------------------------------------------------------------------------
export const AMMUNITION_TRACKING = {
  types: {
    arrows: {
      label: "Arrows",
      weapons: ["longbow", "shortbow"],
      defaultCount: 20,
    },
    bolts: {
      label: "Bolts",
      weapons: ["hand crossbow", "heavy crossbow", "light crossbow"],
      defaultCount: 20,
    },
    bullets: {
      label: "Bullets",
      weapons: ["sling"],
      defaultCount: 20,
    },
    darts: {
      label: "Darts",
      weapons: ["dart"],
      defaultCount: 10,
    },
    blowgun_needles: {
      label: "Blowgun Needles",
      weapons: ["blowgun"],
      defaultCount: 50,
    },
  },
  recovery: {
    description: "After a battle, you can recover half of your expended ammunition (rounded down).",
    timeRequired: "1 minute search",
    formula: (spent) => Math.floor(spent / 2),
  },
};

// ---------------------------------------------------------------------------
// 6. POTION_EFFECTS
// ---------------------------------------------------------------------------
export const POTION_EFFECTS = {
  "Potion of Healing": {
    rarity: "common",
    effect: "Regain hit points.",
    healingFormula: "2d4+2",
    roll: () => Math.floor(Math.random() * 4) + 1 + Math.floor(Math.random() * 4) + 1 + 2,
    duration: "Instantaneous",
    pattern: /potion of healing$/i,
  },
  "Potion of Greater Healing": {
    rarity: "uncommon",
    effect: "Regain hit points.",
    healingFormula: "4d4+4",
    roll: () =>
      [1, 2, 3, 4].reduce((sum) => sum + Math.floor(Math.random() * 4) + 1, 0) + 4,
    duration: "Instantaneous",
    pattern: /potion of greater healing/i,
  },
  "Potion of Superior Healing": {
    rarity: "rare",
    effect: "Regain hit points.",
    healingFormula: "8d4+8",
    roll: () =>
      [1, 2, 3, 4, 5, 6, 7, 8].reduce((sum) => sum + Math.floor(Math.random() * 4) + 1, 0) + 8,
    duration: "Instantaneous",
    pattern: /potion of superior healing/i,
  },
  "Potion of Supreme Healing": {
    rarity: "very_rare",
    effect: "Regain hit points.",
    healingFormula: "10d4+20",
    roll: () =>
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reduce((sum) => sum + Math.floor(Math.random() * 4) + 1, 0) + 20,
    duration: "Instantaneous",
    pattern: /potion of supreme healing/i,
  },
  "Potion of Speed": {
    rarity: "very_rare",
    effect: "Gain the effects of the haste spell.",
    healingFormula: null,
    roll: null,
    duration: "1 minute (concentration not required)",
    pattern: /potion of speed/i,
  },
  "Potion of Invisibility": {
    rarity: "very_rare",
    effect: "Become invisible until the potion wears off. Anything worn or carried is invisible. The effect ends early if you attack or cast a spell.",
    healingFormula: null,
    roll: null,
    duration: "1 hour",
    pattern: /potion of invisibility/i,
  },
  "Potion of Resistance": {
    rarity: "uncommon",
    effect: "Gain resistance to one damage type (determined when the potion is brewed).",
    healingFormula: null,
    roll: null,
    duration: "1 hour",
    pattern: /potion of resistance/i,
  },
  "Potion of Flying": {
    rarity: "very_rare",
    effect: "Gain a flying speed equal to your walking speed and can hover.",
    healingFormula: null,
    roll: null,
    duration: "1 hour",
    pattern: /potion of flying/i,
  },
};

// ---------------------------------------------------------------------------
// 7. SORT_OPTIONS
// ---------------------------------------------------------------------------
export const SORT_OPTIONS = {
  name_asc: { label: "Name (A–Z)", key: "name", direction: "asc" },
  name_desc: { label: "Name (Z–A)", key: "name", direction: "desc" },
  type: { label: "Type", key: "type", direction: "asc" },
  rarity: {
    label: "Rarity",
    key: "rarity",
    direction: "asc",
    order: ["common", "uncommon", "rare", "very_rare", "legendary", "artifact"],
  },
  weight_asc: { label: "Weight (lightest first)", key: "weight", direction: "asc" },
  weight_desc: { label: "Weight (heaviest first)", key: "weight", direction: "desc" },
  value_asc: { label: "Value (lowest first)", key: "value_gp", direction: "asc" },
  value_desc: { label: "Value (highest first)", key: "value_gp", direction: "desc" },
};

// ---------------------------------------------------------------------------
// 8. CURRENCY_DENOMINATIONS
// ---------------------------------------------------------------------------
export const CURRENCY_DENOMINATIONS = {
  cp: {
    label: "Copper Piece",
    abbreviation: "cp",
    color: "#b87333",
    toGP: 0.01,
    conversionToGP: 100, // 100 cp = 1 gp
  },
  sp: {
    label: "Silver Piece",
    abbreviation: "sp",
    color: "#c0c0c0",
    toGP: 0.1,
    conversionToGP: 10, // 10 sp = 1 gp
  },
  ep: {
    label: "Electrum Piece",
    abbreviation: "ep",
    color: "#cfb53b",
    toGP: 0.5,
    conversionToGP: 2, // 2 ep = 1 gp
  },
  gp: {
    label: "Gold Piece",
    abbreviation: "gp",
    color: "#ffd700",
    toGP: 1,
    conversionToGP: 1,
  },
  pp: {
    label: "Platinum Piece",
    abbreviation: "pp",
    color: "#e5e4e2",
    toGP: 10,
    conversionToGP: 0.1, // 1 pp = 10 gp
  },
};

// ---------------------------------------------------------------------------
// EXPORTED FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Categorize an item by matching keywords in its name or an explicit type field.
 * Returns the matching category key or "adventuring_gear" as fallback.
 */
export function categorizeItem(item) {
  if (!item) return "adventuring_gear";

  const type = (item.type || "").toLowerCase();
  const name = (item.name || "").toLowerCase();

  if (type && ITEM_CATEGORIES[type]) return type;

  if (name.includes("sword") || name.includes("axe") || name.includes("bow") ||
      name.includes("dagger") || name.includes("mace") || name.includes("spear") ||
      name.includes("crossbow") || name.includes("staff of striking") ||
      name.includes("lance") || name.includes("flail") || name.includes("warhammer") ||
      name.includes("rapier") || name.includes("scimitar") || type === "weapon") {
    return "weapon";
  }
  if (name.includes("armor") || name.includes("shield") || name.includes("mail") ||
      name.includes("plate") || name.includes("leather") || type === "armor") {
    return "armor";
  }
  if (name.startsWith("potion") || type === "potion") return "potion";
  if (name.startsWith("scroll") || type === "scroll") return "scroll";
  if (name.startsWith("wand") || name.startsWith("rod") ||
      (name.startsWith("staff") && !name.includes("striking")) ||
      type === "wand_rod_staff") {
    return "wand_rod_staff";
  }
  if (name.startsWith("ring") || type === "ring") return "ring";
  if (name.includes("arrow") || name.includes("bolt") || name.includes("bullet") ||
      name.includes("needle") || type === "ammunition") {
    return "ammunition";
  }
  if (name.includes("tool") || name.includes("kit") || name.includes("set") ||
      name.includes("instrument") || type === "tool") {
    return "tool";
  }
  if (type === "wondrous_item" || name.includes("bag of") || name.includes("cloak of") ||
      name.includes("boots of") || name.includes("amulet") || name.includes("bracers") ||
      name.includes("gloves of") || name.includes("helm of") || name.includes("belt of")) {
    return "wondrous_item";
  }

  return "adventuring_gear";
}

/**
 * Return the hex color for a given rarity string.
 * Falls back to the "common" color if rarity is unrecognized.
 */
export function getRarityColor(rarity) {
  if (!rarity) return RARITY_COLORS.common;
  const key = rarity.toLowerCase().replace(/\s+/g, "_");
  return RARITY_COLORS[key] || RARITY_COLORS.common;
}

/**
 * Calculate encumbrance status for a character.
 *
 * @param {Array}   items       - Array of item objects with a `weight` (lbs) and optional `quantity` field.
 * @param {number}  strScore    - The character's STR ability score.
 * @param {boolean} useVariant  - Whether to use the variant encumbrance rule.
 * @returns {object} Encumbrance result.
 */
export function calculateEncumbrance(items, strScore, useVariant = false) {
  const totalWeight = (items || []).reduce((sum, item) => {
    const qty = item.quantity != null ? item.quantity : 1;
    return sum + (parseFloat(item.weight) || 0) * qty;
  }, 0);

  if (useVariant) {
    const encThreshold = strScore * 5;
    const heavyThreshold = strScore * 10;

    if (totalWeight > heavyThreshold) {
      return {
        totalWeight,
        status: "heavily_encumbered",
        label: "Heavily Encumbered",
        speedPenalty: -20,
        disadvantage: ENCUMBRANCE_RULES.variant.thresholds.heavily_encumbered.disadvantage,
        overBy: totalWeight - heavyThreshold,
      };
    }
    if (totalWeight > encThreshold) {
      return {
        totalWeight,
        status: "encumbered",
        label: "Encumbered",
        speedPenalty: -10,
        disadvantage: [],
        overBy: totalWeight - encThreshold,
      };
    }
    return {
      totalWeight,
      status: "normal",
      label: "Normal",
      speedPenalty: 0,
      disadvantage: [],
      overBy: 0,
    };
  }

  // Standard rule
  const carryCapacity = strScore * 15;
  const overBy = totalWeight > carryCapacity ? totalWeight - carryCapacity : 0;
  return {
    totalWeight,
    carryCapacity,
    status: overBy > 0 ? "encumbered" : "normal",
    label: overBy > 0 ? "Encumbered" : "Normal",
    speedPenalty: 0,
    disadvantage: [],
    overBy,
  };
}

/**
 * Check whether adding a new item to the attuned list would exceed the slot limit.
 *
 * @param {Array}  attunedItems - Currently attuned items array.
 * @param {number} maxSlots     - Maximum attunement slots (default 3).
 * @returns {object} Result with canAttune, slotsUsed, slotsAvailable, atLimit.
 */
export function checkAttunementLimit(attunedItems, maxSlots = ATTUNEMENT_RULES.maxSlots) {
  const slotsUsed = (attunedItems || []).length;
  const slotsAvailable = Math.max(0, maxSlots - slotsUsed);
  return {
    slotsUsed,
    slotsAvailable,
    maxSlots,
    atLimit: slotsUsed >= maxSlots,
    canAttune: slotsUsed < maxSlots,
  };
}

/**
 * Calculate remaining ammunition after spending some in combat, with optional recovery.
 *
 * @param {number}  currentCount - How many rounds/shots the character currently has.
 * @param {number}  used         - How many were spent this encounter.
 * @param {boolean} recovered    - Whether recovery search was performed after battle.
 * @returns {object} Updated count and breakdown.
 */
export function trackAmmunition(currentCount, used, recovered = false) {
  const afterBattle = Math.max(0, currentCount - used);
  const recoveredCount = recovered
    ? AMMUNITION_TRACKING.recovery.formula(used)
    : 0;
  const finalCount = afterBattle + recoveredCount;
  return {
    previous: currentCount,
    used,
    afterBattle,
    recoveredCount,
    finalCount,
    recoveryNote: recovered
      ? `Recovered ${recoveredCount} of ${used} spent (${AMMUNITION_TRACKING.recovery.timeRequired}).`
      : "No recovery performed.",
  };
}

/**
 * Detect whether an item name matches a known potion and return its effect data.
 *
 * @param {string} itemName
 * @returns {object|null} Potion effect object or null if not recognized.
 */
export function detectPotion(itemName) {
  if (!itemName) return null;
  for (const [key, potion] of Object.entries(POTION_EFFECTS)) {
    if (potion.pattern.test(itemName)) {
      return { name: key, ...potion };
    }
  }
  return null;
}

/**
 * Sort an array of items by the given sort key.
 * Does not mutate the original array.
 *
 * @param {Array}  items  - Array of item objects.
 * @param {string} sortBy - One of the SORT_OPTIONS keys.
 * @returns {Array} New sorted array.
 */
export function sortItems(items, sortBy = "name_asc") {
  if (!items || !items.length) return [];
  const option = SORT_OPTIONS[sortBy];
  if (!option) return [...items];

  return [...items].sort((a, b) => {
    let aVal = a[option.key];
    let bVal = b[option.key];

    // Rarity uses a fixed order array
    if (option.key === "rarity" && option.order) {
      aVal = option.order.indexOf((aVal || "common").toLowerCase().replace(/\s+/g, "_"));
      bVal = option.order.indexOf((bVal || "common").toLowerCase().replace(/\s+/g, "_"));
      if (aVal === -1) aVal = 999;
      if (bVal === -1) bVal = 999;
      return aVal - bVal;
    }

    // String comparison
    if (typeof aVal === "string" && typeof bVal === "string") {
      const cmp = aVal.localeCompare(bVal);
      return option.direction === "desc" ? -cmp : cmp;
    }

    // Numeric comparison (treat missing as 0)
    aVal = parseFloat(aVal) || 0;
    bVal = parseFloat(bVal) || 0;
    return option.direction === "desc" ? bVal - aVal : aVal - bVal;
  });
}

/**
 * Calculate the total GP value of all items in an inventory.
 * Items should have a `value_gp` field (or `value` + `currency` fields as fallback).
 *
 * @param {Array} items - Array of item objects.
 * @returns {number} Total value in GP (rounded to 2 decimal places).
 */
export function calculateTotalValue(items) {
  if (!items || !items.length) return 0;
  const total = items.reduce((sum, item) => {
    const qty = item.quantity != null ? item.quantity : 1;
    let gpValue = 0;

    if (item.value_gp != null) {
      gpValue = parseFloat(item.value_gp) || 0;
    } else if (item.value != null && item.currency) {
      const denom = CURRENCY_DENOMINATIONS[item.currency.toLowerCase()];
      if (denom) {
        gpValue = (parseFloat(item.value) || 0) * denom.toGP;
      }
    } else if (item.value != null) {
      gpValue = parseFloat(item.value) || 0;
    }

    return sum + gpValue * qty;
  }, 0);
  return Math.round(total * 100) / 100;
}

/**
 * Convert a currency amount from one denomination to another.
 *
 * @param {number} amount    - The amount to convert.
 * @param {string} fromDenom - Source denomination key (cp, sp, ep, gp, pp).
 * @param {string} toDenom   - Target denomination key.
 * @returns {object} Result with value (possibly fractional), rounded, and remainder.
 */
export function convertCurrency(amount, fromDenom, toDenom) {
  const from = CURRENCY_DENOMINATIONS[fromDenom];
  const to = CURRENCY_DENOMINATIONS[toDenom];

  if (!from || !to) {
    return { error: `Unknown denomination: ${!from ? fromDenom : toDenom}` };
  }

  const inGP = amount * from.toGP;
  const converted = inGP / to.toGP;
  const rounded = Math.floor(converted);
  const remainder = Math.round((converted - rounded) * to.toGP * 100) / 100; // leftover in GP

  return {
    original: { amount, denomination: fromDenom },
    converted: { amount: converted, denomination: toDenom },
    rounded,
    remainderGP: remainder,
    display: `${amount} ${fromDenom} = ${converted.toFixed(2)} ${toDenom}`,
  };
}

/**
 * Calculate carry capacity thresholds for a character.
 *
 * @param {number}  strScore   - STR ability score.
 * @param {boolean} useVariant - Whether to return variant thresholds.
 * @returns {object} Capacity thresholds in lbs.
 */
export function calculateCarryCapacity(strScore, useVariant = false) {
  if (useVariant) {
    return {
      encumberedAt: strScore * 5,
      heavilyEncumberedAt: strScore * 10,
      maximumCapacity: strScore * 15,
      pushDragLift: strScore * 30,
      useVariant: true,
    };
  }
  return {
    carryCapacity: strScore * 15,
    pushDragLift: strScore * 30,
    useVariant: false,
  };
}
