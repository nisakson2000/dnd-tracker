/**
 * spellScrollRules.js
 *
 * Roadmap items covered:
 *   - #106: Spell scrolls — rules, save DCs, attack bonuses, crafting costs,
 *           rarity, mishap table, and helper functions
 *
 * No React. Pure data and utility exports.
 */

// ---------------------------------------------------------------------------
// Core rules summary
// ---------------------------------------------------------------------------

/**
 * General rules for using a spell scroll.
 * @type {Object}
 */
export const SCROLL_RULES = {
  action: "Using a spell scroll requires the Use an Object action (action).",
  classRestriction:
    "The spell must be on your class's spell list. A creature with a different spell list may still attempt to use the scroll but must succeed on an Arcana check (DC 10 + spell level).",
  exceedsMaxSlot:
    "If the spell's level exceeds the highest spell slot level you can cast, you must make an ability check using your spellcasting ability (DC 10 + spell level). On a failure, the scroll's magic fizzles and a mishap may occur.",
  destruction:
    "The scroll is destroyed after use, regardless of whether the casting succeeds or fails.",
  concentration:
    "If the spell requires concentration, you must maintain concentration as normal.",
  components:
    "Material components are not required when casting from a scroll unless the component has a gold cost, in which case you must supply it.",
};

// ---------------------------------------------------------------------------
// Save DCs by spell level
// ---------------------------------------------------------------------------

/**
 * Spell save DC encoded in the scroll, keyed by spell level string.
 * @type {Object.<string, number>}
 */
export const SCROLL_SAVE_DCS = {
  cantrip: 13,
  "1st": 13,
  "2nd": 13,
  "3rd": 15,
  "4th": 15,
  "5th": 17,
  "6th": 17,
  "7th": 18,
  "8th": 18,
  "9th": 19,
};

// ---------------------------------------------------------------------------
// Spell attack bonuses by spell level
// ---------------------------------------------------------------------------

/**
 * Spell attack bonus encoded in the scroll, keyed by spell level string.
 * @type {Object.<string, string>}
 */
export const SCROLL_ATTACK_BONUS = {
  cantrip: "+5",
  "1st": "+5",
  "2nd": "+5",
  "3rd": "+7",
  "4th": "+7",
  "5th": "+9",
  "6th": "+9",
  "7th": "+10",
  "8th": "+10",
  "9th": "+11",
};

// ---------------------------------------------------------------------------
// Crafting costs and time by spell level
// ---------------------------------------------------------------------------

/**
 * Crafting requirements for each spell scroll level.
 * Each entry includes:
 *   - costGp {number}   Gold piece cost for materials
 *   - time {string}     Time to craft (days or weeks)
 *   - requirements {string[]}  Prerequisites
 * @type {Object.<string, {costGp: number, time: string, requirements: string[]}>}
 */
export const SCROLL_CRAFTING = {
  cantrip: {
    costGp: 15,
    time: "1 day",
    requirements: [
      "Spell known or prepared",
      "Any required material components",
    ],
  },
  "1st": {
    costGp: 25,
    time: "1 day",
    requirements: [
      "Spell known or prepared",
      "Any required material components",
    ],
  },
  "2nd": {
    costGp: 250,
    time: "3 days",
    requirements: [
      "Spell known or prepared",
      "Any required material components",
    ],
  },
  "3rd": {
    costGp: 500,
    time: "1 week",
    requirements: [
      "Spell known or prepared",
      "Any required material components",
    ],
  },
  "4th": {
    costGp: 2500,
    time: "2 weeks",
    requirements: [
      "Spell known or prepared",
      "Any required material components",
    ],
  },
  "5th": {
    costGp: 5000,
    time: "4 weeks",
    requirements: [
      "Spell known or prepared",
      "Any required material components",
    ],
  },
  "6th": {
    costGp: 15000,
    time: "8 weeks",
    requirements: [
      "Spell known or prepared",
      "Any required material components",
    ],
  },
  "7th": {
    costGp: 25000,
    time: "16 weeks",
    requirements: [
      "Spell known or prepared",
      "Any required material components",
    ],
  },
  "8th": {
    costGp: 50000,
    time: "32 weeks",
    requirements: [
      "Spell known or prepared",
      "Any required material components",
    ],
  },
  "9th": {
    costGp: 250000,
    time: "48 weeks",
    requirements: [
      "Spell known or prepared",
      "Any required material components",
    ],
  },
};

// ---------------------------------------------------------------------------
// Rarity by spell level
// ---------------------------------------------------------------------------

/**
 * Magic item rarity of a spell scroll, keyed by spell level string.
 * @type {Object.<string, string>}
 */
export const SCROLL_RARITY = {
  cantrip: "Common",
  "1st": "Common",
  "2nd": "Uncommon",
  "3rd": "Uncommon",
  "4th": "Rare",
  "5th": "Rare",
  "6th": "Very Rare",
  "7th": "Very Rare",
  "8th": "Very Rare",
  "9th": "Legendary",
};

// ---------------------------------------------------------------------------
// Mishap table (d6)
// ---------------------------------------------------------------------------

/**
 * Mishap results when a caster fails the ability check to use a scroll whose
 * spell level exceeds their maximum slot level. Roll 1d6 and index into this
 * array (index 0 = roll of 1).
 *
 * Each entry:
 *   - roll {number}       The d6 result (1–6)
 *   - name {string}       Short name for the mishap
 *   - description {string} Full rules text
 * @type {Array.<{roll: number, name: string, description: string}>}
 */
export const SCROLL_MISHAPS = [
  {
    roll: 1,
    name: "Surge of Magical Energy",
    description:
      "A burst of uncontrolled energy erupts from the scroll. The caster takes 1d6 force damage per level of the spell (minimum 1d6), and the scroll is destroyed.",
  },
  {
    roll: 2,
    name: "Random Target",
    description:
      "The spell discharges but targets a random creature within range (including allies or the caster). Determine the target randomly using a die appropriate to the number of valid creatures.",
  },
  {
    roll: 3,
    name: "Half Effect",
    description:
      "The spell fires but at diminished power. Any damage, healing, or numerical effects are halved. Duration is also halved (minimum 1 round).",
  },
  {
    roll: 4,
    name: "Delayed Effect",
    description:
      "The scroll's magic does not activate immediately. The spell triggers at the start of the caster's next turn with no additional input required. The scroll is still destroyed.",
  },
  {
    roll: 5,
    name: "Reversed Effect",
    description:
      "The spell's intent is inverted. A damaging spell heals its targets; a healing spell deals necrotic damage; a buff becomes a debuff of equivalent magnitude.",
  },
  {
    roll: 6,
    name: "Wild Magic Surge",
    description:
      "Roll on the Wild Magic Surge table (Player's Handbook). The spell from the scroll fails entirely and does not take effect, but the wild magic surge resolves normally.",
  },
];

// ---------------------------------------------------------------------------
// Helper — normalise level input
// ---------------------------------------------------------------------------

/**
 * Normalise a spell level value to the canonical key used in this file.
 * Accepts numbers (0–9) or strings ("0", "cantrip", "1st" … "9th").
 *
 * @param {number|string} spellLevel
 * @returns {string|null} Canonical key, or null if unrecognised
 */
function normaliseLevel(spellLevel) {
  const levelMap = {
    0: "cantrip",
    cantrip: "cantrip",
    "0": "cantrip",
    1: "1st",
    "1": "1st",
    "1st": "1st",
    2: "2nd",
    "2": "2nd",
    "2nd": "2nd",
    3: "3rd",
    "3": "3rd",
    "3rd": "3rd",
    4: "4th",
    "4": "4th",
    "4th": "4th",
    5: "5th",
    "5": "5th",
    "5th": "5th",
    6: "6th",
    "6": "6th",
    "6th": "6th",
    7: "7th",
    "7": "7th",
    "7th": "7th",
    8: "8th",
    "8": "8th",
    "8th": "8th",
    9: "9th",
    "9": "9th",
    "9th": "9th",
  };
  return levelMap[spellLevel] ?? null;
}

// ---------------------------------------------------------------------------
// Exported helper functions
// ---------------------------------------------------------------------------

/**
 * Return a combined info object for a scroll of the given spell level,
 * merging save DC, attack bonus, rarity, and crafting data.
 *
 * @param {number|string} spellLevel - Spell level (0–9 or "cantrip"/"1st" etc.)
 * @returns {{
 *   level: string,
 *   saveDC: number,
 *   attackBonus: string,
 *   rarity: string,
 *   crafting: {costGp: number, time: string, requirements: string[]},
 *   rules: Object
 * }|null} Combined scroll info, or null for an unrecognised level
 */
export function getScrollInfo(spellLevel) {
  const key = normaliseLevel(spellLevel);
  if (!key) return null;

  return {
    level: key,
    saveDC: SCROLL_SAVE_DCS[key],
    attackBonus: SCROLL_ATTACK_BONUS[key],
    rarity: SCROLL_RARITY[key],
    crafting: SCROLL_CRAFTING[key],
    rules: SCROLL_RULES,
  };
}

/**
 * Determine whether a character can use a spell scroll without an ability
 * check, and if a check is required, return the DC.
 *
 * @param {number|string} spellLevel      - Level of the spell on the scroll
 * @param {number}        casterLevel     - Highest spell slot level the character can cast (0 if non-caster)
 * @param {boolean}       spellOnClassList - Whether the spell appears on the character's class spell list
 * @returns {{
 *   canUse: boolean,
 *   requiresCheck: boolean,
 *   checkDC: number|null,
 *   reason: string
 * }}
 */
export function canUseScroll(spellLevel, casterLevel, spellOnClassList) {
  const key = normaliseLevel(spellLevel);
  if (!key) {
    return {
      canUse: false,
      requiresCheck: false,
      checkDC: null,
      reason: "Unrecognised spell level.",
    };
  }

  const numericLevel =
    key === "cantrip"
      ? 0
      : parseInt(key.replace(/\D/g, ""), 10);

  if (!spellOnClassList) {
    const dc = 10 + numericLevel;
    return {
      canUse: true,
      requiresCheck: true,
      checkDC: dc,
      reason: `Spell is not on your class spell list. Arcana check DC ${dc} required.`,
    };
  }

  if (numericLevel > casterLevel) {
    const dc = 10 + numericLevel;
    return {
      canUse: true,
      requiresCheck: true,
      checkDC: dc,
      reason: `Spell level (${key}) exceeds your highest available spell slot (${casterLevel}). Spellcasting ability check DC ${dc} required.`,
    };
  }

  return {
    canUse: true,
    requiresCheck: false,
    checkDC: null,
    reason: "You can use this scroll without an ability check.",
  };
}

/**
 * Return the crafting cost and time for a spell scroll of the given level.
 *
 * @param {number|string} spellLevel
 * @returns {{costGp: number, time: string, requirements: string[]}|null}
 */
export function getScrollCraftingCost(spellLevel) {
  const key = normaliseLevel(spellLevel);
  if (!key) return null;
  return SCROLL_CRAFTING[key];
}

/**
 * Roll a random scroll mishap from the d6 mishap table.
 * Uses Math.random(); pass in a pre-rolled value (1–6) to override.
 *
 * @param {number} [dieResult] - Optional pre-rolled d6 result (1–6)
 * @returns {{roll: number, name: string, description: string}}
 */
export function rollScrollMishap(dieResult) {
  const roll =
    dieResult !== undefined
      ? Math.min(6, Math.max(1, Math.floor(dieResult)))
      : Math.floor(Math.random() * 6) + 1;
  return SCROLL_MISHAPS[roll - 1];
}

/**
 * Return the spell save DC encoded in a scroll of the given spell level.
 *
 * @param {number|string} spellLevel
 * @returns {number|null}
 */
export function getScrollSaveDC(spellLevel) {
  const key = normaliseLevel(spellLevel);
  if (!key) return null;
  return SCROLL_SAVE_DCS[key];
}

/**
 * Return the spell attack bonus encoded in a scroll of the given spell level.
 *
 * @param {number|string} spellLevel
 * @returns {string|null} Formatted string such as "+5" or "+11", or null
 */
export function getScrollAttackBonus(spellLevel) {
  const key = normaliseLevel(spellLevel);
  if (!key) return null;
  return SCROLL_ATTACK_BONUS[key];
}
