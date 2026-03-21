/**
 * npcFavorTracking.js
 *
 * Roadmap Items Covered:
 *   - #153: NPC gift/favor tracking
 *
 * Provides static data and helper functions for tracking NPC relationships
 * through gifts given, favors owed, favors granted, and influence scores.
 * No React dependencies — pure data and logic module.
 */

// ---------------------------------------------------------------------------
// GIFT_CATEGORIES
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} GiftCategory
 * @property {string} id
 * @property {string} label
 * @property {string} description
 * @property {{ min: number, max: number }} influenceRange  - On a 1-5 scale per gift
 * @property {{ min: number, max: number }} typicalCostGP   - Approximate gold piece value
 * @property {Object.<string, number>} npcPreferenceModifiers - Role -> modifier to influence gain
 */

/** @type {Object.<string, GiftCategory>} */
export const GIFT_CATEGORIES = {
  GOLD_COINS: {
    id: "GOLD_COINS",
    label: "Gold / Coins",
    description: "Direct monetary gifts — coin pouches, gemstones used as currency, trade goods.",
    influenceRange: { min: 1, max: 3 },
    typicalCostGP: { min: 10, max: 500 },
    npcPreferenceModifiers: {
      merchant: 2,
      noble: 1,
      innkeeper: 1,
      guard: 1,
      sage: 0,
      priest: 0,
      criminal: 1,
      commoner: 2,
    },
  },
  JEWELRY: {
    id: "JEWELRY",
    label: "Jewelry",
    description: "Rings, necklaces, brooches, and other decorative valuables.",
    influenceRange: { min: 2, max: 4 },
    typicalCostGP: { min: 25, max: 1000 },
    npcPreferenceModifiers: {
      noble: 3,
      merchant: 1,
      priest: 1,
      sage: 0,
      guard: 0,
      innkeeper: 0,
      criminal: 1,
      commoner: 1,
    },
  },
  WEAPONS_ARMOR: {
    id: "WEAPONS_ARMOR",
    label: "Weapons / Armor",
    description: "Blades, shields, armor sets, ammunition, and combat-related gear.",
    influenceRange: { min: 2, max: 5 },
    typicalCostGP: { min: 15, max: 1500 },
    npcPreferenceModifiers: {
      guard: 3,
      soldier: 3,
      mercenary: 3,
      noble: 1,
      merchant: 0,
      sage: -1,
      priest: 0,
      commoner: 1,
    },
  },
  POTIONS_CONSUMABLES: {
    id: "POTIONS_CONSUMABLES",
    label: "Potions / Consumables",
    description: "Healing potions, antitoxins, spell scrolls, and other single-use magical items.",
    influenceRange: { min: 1, max: 4 },
    typicalCostGP: { min: 50, max: 500 },
    npcPreferenceModifiers: {
      sage: 2,
      priest: 2,
      merchant: 1,
      guard: 1,
      noble: 1,
      innkeeper: 0,
      criminal: 1,
      commoner: 2,
    },
  },
  INFORMATION_SECRETS: {
    id: "INFORMATION_SECRETS",
    label: "Information / Secrets",
    description: "Rare knowledge, maps, blackmail material, intelligence reports, prophecies.",
    influenceRange: { min: 2, max: 5 },
    typicalCostGP: { min: 0, max: 200 },
    npcPreferenceModifiers: {
      sage: 3,
      criminal: 3,
      noble: 2,
      priest: 1,
      merchant: 2,
      guard: 1,
      innkeeper: 1,
      commoner: 0,
    },
  },
  SERVICES: {
    id: "SERVICES",
    label: "Services",
    description: "Labor, skill use, magical assistance, escorting, or other performed work.",
    influenceRange: { min: 1, max: 4 },
    typicalCostGP: { min: 5, max: 300 },
    npcPreferenceModifiers: {
      innkeeper: 2,
      merchant: 2,
      commoner: 3,
      guard: 1,
      noble: 1,
      sage: 1,
      priest: 2,
      criminal: 1,
    },
  },
  POLITICAL_SUPPORT: {
    id: "POLITICAL_SUPPORT",
    label: "Political Support",
    description: "Public endorsements, votes, introductions to powerful figures, official favors.",
    influenceRange: { min: 3, max: 5 },
    typicalCostGP: { min: 0, max: 100 },
    npcPreferenceModifiers: {
      noble: 4,
      merchant: 2,
      priest: 2,
      guard: 1,
      sage: 1,
      innkeeper: 0,
      criminal: 1,
      commoner: 0,
    },
  },
  PERSONAL_SENTIMENTAL: {
    id: "PERSONAL_SENTIMENTAL",
    label: "Personal / Sentimental Items",
    description: "Heirlooms, handcrafted gifts, recovered lost possessions, meaningful mementos.",
    influenceRange: { min: 3, max: 5 },
    typicalCostGP: { min: 0, max: 50 },
    npcPreferenceModifiers: {
      commoner: 3,
      priest: 3,
      sage: 2,
      innkeeper: 2,
      noble: 1,
      merchant: 0,
      guard: 1,
      criminal: 0,
    },
  },
};

// ---------------------------------------------------------------------------
// FAVOR_TYPES
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} FavorType
 * @property {string} id
 * @property {string} label
 * @property {string} description
 * @property {number} influenceCost       - Influence points needed to request this favor
 * @property {string} typicalDuration     - Human-readable duration estimate
 * @property {number} socialDC            - Persuasion/Charisma DC to request without prior trust
 * @property {string[]} exampleUses
 */

/** @type {Object.<string, FavorType>} */
export const FAVOR_TYPES = {
  SMALL_FAVOR: {
    id: "SMALL_FAVOR",
    label: "Small Favor",
    description: "Minor assistance requiring little risk or resource from the NPC.",
    influenceCost: 1,
    typicalDuration: "Immediate / one-time",
    socialDC: 10,
    exampleUses: ["Directions to a location", "Informal introduction to an acquaintance", "Vouching for the party in passing"],
  },
  MODERATE_FAVOR: {
    id: "MODERATE_FAVOR",
    label: "Moderate Favor",
    description: "Meaningful assistance that costs the NPC time, money, or mild risk.",
    influenceCost: 3,
    typicalDuration: "1–3 sessions",
    socialDC: 14,
    exampleUses: ["Safe passage through territory", "Significant discount on goods or services", "Temporary use of resources or space"],
  },
  LARGE_FAVOR: {
    id: "LARGE_FAVOR",
    label: "Large Favor",
    description: "Significant aid with notable risk, cost, or social exposure for the NPC.",
    influenceCost: 6,
    typicalDuration: "1 session or a specific event",
    socialDC: 17,
    exampleUses: ["Direct combat aid", "Revealing a hidden location or cache", "Covering up a party action"],
  },
  LIFE_DEBT: {
    id: "LIFE_DEBT",
    label: "Life Debt",
    description: "The NPC owes (or is owed) their life. Rarely called in; deeply binding.",
    influenceCost: 10,
    typicalDuration: "Permanent until repaid",
    socialDC: 5,
    exampleUses: ["One extraordinary act of sacrifice", "Calling in rescue at a critical moment", "Permanent alliance pledge"],
  },
  POLITICAL_FAVOR: {
    id: "POLITICAL_FAVOR",
    label: "Political Favor",
    description: "Leveraging the NPC's social position to affect institutions, laws, or factions.",
    influenceCost: 5,
    typicalDuration: "Days to weeks",
    socialDC: 16,
    exampleUses: ["Petitioning a lord on the party's behalf", "Suppressing official charges", "Securing a title or land grant"],
  },
  INFORMATION_EXCHANGE: {
    id: "INFORMATION_EXCHANGE",
    label: "Information Exchange",
    description: "Trading intelligence, secrets, or rare knowledge of equal or greater value.",
    influenceCost: 2,
    typicalDuration: "Immediate",
    socialDC: 12,
    exampleUses: ["Location of a hidden enemy camp", "True identity of a disguised figure", "Contents of a sealed letter"],
  },
  MUTUAL_PROTECTION_PACT: {
    id: "MUTUAL_PROTECTION_PACT",
    label: "Mutual Protection Pact",
    description: "An ongoing arrangement of shared defense and watchfulness.",
    influenceCost: 7,
    typicalDuration: "Ongoing (reviewed each arc)",
    socialDC: 15,
    exampleUses: ["NPC alerts party of threats", "Party defends NPC's establishment", "Shared safe-house access"],
  },
  ONGOING_SERVICE: {
    id: "ONGOING_SERVICE",
    label: "Ongoing Service",
    description: "The NPC provides a recurring service or resource for a defined period.",
    influenceCost: 8,
    typicalDuration: "Multiple sessions or one campaign arc",
    socialDC: 18,
    exampleUses: ["Regular intelligence reports", "Monthly supply of crafted goods at cost", "A standing guest room and meals"],
  },
};

// ---------------------------------------------------------------------------
// INFLUENCE_THRESHOLDS
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} InfluenceLevel
 * @property {string} id
 * @property {string} label
 * @property {{ min: number, max: number|null }} scoreRange  - null max means open-ended
 * @property {string} description
 * @property {string[]} favorsAvailable  - IDs of FAVOR_TYPES accessible at this level
 * @property {number} giftEffectivenessMultiplier  - Multiplier applied to influence gained from gifts
 */

/** @type {InfluenceLevel[]} */
export const INFLUENCE_THRESHOLDS = [
  {
    id: "STRANGER",
    label: "Stranger",
    scoreRange: { min: 0, max: 2 },
    description:
      "The NPC barely knows the party. No goodwill established; all interactions start at arms length.",
    favorsAvailable: ["SMALL_FAVOR"],
    giftEffectivenessMultiplier: 0.5,
  },
  {
    id: "ACQUAINTANCE",
    label: "Acquaintance",
    scoreRange: { min: 3, max: 5 },
    description:
      "The NPC recognizes the party as reliable contacts. Minor favors flow easily; trust is building.",
    favorsAvailable: ["SMALL_FAVOR", "MODERATE_FAVOR", "INFORMATION_EXCHANGE"],
    giftEffectivenessMultiplier: 1.0,
  },
  {
    id: "FRIEND",
    label: "Friend",
    scoreRange: { min: 6, max: 8 },
    description:
      "Genuine warmth exists. The NPC will take personal risks for the party and speaks well of them.",
    favorsAvailable: [
      "SMALL_FAVOR",
      "MODERATE_FAVOR",
      "LARGE_FAVOR",
      "INFORMATION_EXCHANGE",
      "POLITICAL_FAVOR",
    ],
    giftEffectivenessMultiplier: 1.25,
  },
  {
    id: "TRUSTED_ALLY",
    label: "Trusted Ally",
    scoreRange: { min: 9, max: 11 },
    description:
      "Deep loyalty established. The NPC will make significant sacrifices and expects the same in return.",
    favorsAvailable: [
      "SMALL_FAVOR",
      "MODERATE_FAVOR",
      "LARGE_FAVOR",
      "POLITICAL_FAVOR",
      "INFORMATION_EXCHANGE",
      "MUTUAL_PROTECTION_PACT",
      "ONGOING_SERVICE",
    ],
    giftEffectivenessMultiplier: 1.5,
  },
  {
    id: "BONDED",
    label: "Bonded",
    scoreRange: { min: 12, max: null },
    description:
      "An unbreakable bond — friend, surrogate family, or life-sworn ally. All favors are available; betrayal would be catastrophic.",
    favorsAvailable: [
      "SMALL_FAVOR",
      "MODERATE_FAVOR",
      "LARGE_FAVOR",
      "LIFE_DEBT",
      "POLITICAL_FAVOR",
      "INFORMATION_EXCHANGE",
      "MUTUAL_PROTECTION_PACT",
      "ONGOING_SERVICE",
    ],
    giftEffectivenessMultiplier: 2.0,
  },
];

// ---------------------------------------------------------------------------
// FAVOR_DECAY
// ---------------------------------------------------------------------------

/**
 * Rules governing how NPC influence erodes over time without interaction.
 *
 * @type {Object}
 */
export const FAVOR_DECAY = {
  /** Influence points lost per every N sessions with no party interaction. */
  passiveDecayPerInterval: -1,
  /** Number of sessions between each passive decay tick. */
  sessionsPerDecayInterval: 5,
  /**
   * Influence reduction applied when the party breaks a promise to this NPC.
   * Applied immediately, in addition to any passive decay.
   */
  brokenPromisePenalty: -3,
  /**
   * Each gift slows decay: for every gift of the specified category given in
   * the last decay interval, offset passiveDecayPerInterval by this amount.
   */
  giftDecaySlowdown: {
    description:
      "Any gift given within the current decay interval reduces passive decay by 1 (minimum 0 decay that interval).",
    offsetPerGift: 1,
  },
  /**
   * If the party has not interacted with an NPC for this many sessions,
   * decay accelerates: apply the interval penalty twice per interval instead.
   */
  estrangementThresholdSessions: 10,
  estrangementMultiplier: 2,
};

// ---------------------------------------------------------------------------
// RECIPROCITY_RULES
// ---------------------------------------------------------------------------

/**
 * NPCs track whether the relationship is balanced. Persistent imbalance causes
 * resentment (negative debt) or gratitude (positive debt).
 *
 * @type {Object}
 */
export const RECIPROCITY_RULES = {
  /**
   * Debt balance scale:
   *   Positive  → party is owed favors / has surplus goodwill
   *   Negative  → NPC is owed favors / party is in deficit
   */
  debtBalanceDescription:
    "Track a running integer debt balance. Positive means the NPC owes the party; negative means the party owes the NPC.",

  /** Influence penalty applied each session the debt stays below this threshold. */
  resentmentThreshold: -4,
  resentmentPassivePenalty: -1,

  /** Influence bonus applied each session the debt exceeds this threshold (NPC is very grateful). */
  gratitudeThreshold: 4,
  gratitudePassiveBonus: 1,

  /**
   * Cultural modifiers — some societies weigh gift-giving more heavily,
   * changing the influence gained per gift.
   */
  culturalModifiers: {
    HIGH_GIFT_CULTURE: {
      id: "HIGH_GIFT_CULTURE",
      label: "High Gift Culture",
      description:
        "Societies where gift-giving is a cornerstone of social bonding (e.g., merchant guilds, tribal cultures, fey courts).",
      giftInfluenceMultiplier: 1.5,
      refusedGiftPenalty: -2,
    },
    NEUTRAL_GIFT_CULTURE: {
      id: "NEUTRAL_GIFT_CULTURE",
      label: "Neutral Gift Culture",
      description: "Standard urban societies where gifts are appreciated but not ritualized.",
      giftInfluenceMultiplier: 1.0,
      refusedGiftPenalty: 0,
    },
    LOW_GIFT_CULTURE: {
      id: "LOW_GIFT_CULTURE",
      label: "Low Gift Culture",
      description:
        "Stoic or austere cultures (military orders, certain monastic traditions) where gifts may be seen as bribery.",
      giftInfluenceMultiplier: 0.5,
      refusedGiftPenalty: -1,
    },
  },
};

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Calculate a net influence score for a single NPC relationship.
 *
 * @param {Array<{ category: string, npcRole?: string }>} giftsGiven
 *   List of gift records given to the NPC.
 * @param {Array<{ type: string }>} favorsOwed
 *   Favors the NPC has granted to the party (party owes these).
 * @param {Array<{ type: string }>} favorsGranted
 *   Favors the party has granted to the NPC (NPC owes these).
 * @param {number} sessionsElapsed
 *   Total sessions since the relationship began (used for decay).
 * @returns {number} Raw influence score (can be negative).
 */
export function calculateInfluence(
  giftsGiven = [],
  favorsOwed = [],
  favorsGranted = [],
  sessionsElapsed = 0
) {
  let score = 0;

  // Add influence from gifts
  for (const gift of giftsGiven) {
    const category = GIFT_CATEGORIES[gift.category];
    if (!category) continue;
    const midpoint =
      (category.influenceRange.min + category.influenceRange.max) / 2;
    const roleBonus =
      gift.npcRole && category.npcPreferenceModifiers[gift.npcRole] != null
        ? category.npcPreferenceModifiers[gift.npcRole]
        : 0;
    score += midpoint + roleBonus * 0.25;
  }

  // Add influence from favors the party granted to the NPC
  for (const favor of favorsGranted) {
    const ft = FAVOR_TYPES[favor.type];
    if (!ft) continue;
    score += ft.influenceCost * 0.75;
  }

  // Subtract influence consumed by favors the NPC granted to the party
  for (const favor of favorsOwed) {
    const ft = FAVOR_TYPES[favor.type];
    if (!ft) continue;
    score -= ft.influenceCost * 0.5;
  }

  // Apply passive decay
  const decayIntervals = Math.floor(sessionsElapsed / FAVOR_DECAY.sessionsPerDecayInterval);
  const giftSlowdown = Math.min(giftsGiven.length, decayIntervals) * FAVOR_DECAY.giftDecaySlowdown.offsetPerGift;
  const netDecay = Math.max(0, decayIntervals + giftSlowdown) * Math.abs(FAVOR_DECAY.passiveDecayPerInterval);
  score -= netDecay;

  return Math.round(score * 10) / 10;
}

/**
 * Determine the influence level object for a given numeric score.
 *
 * @param {number} score
 * @returns {InfluenceLevel}
 */
export function getInfluenceLevel(score) {
  // Iterate in reverse so BONDED (highest) is checked first
  for (let i = INFLUENCE_THRESHOLDS.length - 1; i >= 0; i--) {
    const level = INFLUENCE_THRESHOLDS[i];
    if (score >= level.scoreRange.min) {
      return level;
    }
  }
  return INFLUENCE_THRESHOLDS[0];
}

/**
 * Determine whether the party can request a specific favor given current influence.
 *
 * @param {string} favorTypeId  - Key from FAVOR_TYPES
 * @param {string} influenceLevelId  - Key from INFLUENCE_THRESHOLDS (e.g. "FRIEND")
 * @returns {{ canRequest: boolean, reason: string }}
 */
export function canRequestFavor(favorTypeId, influenceLevelId) {
  const level = INFLUENCE_THRESHOLDS.find((t) => t.id === influenceLevelId);
  if (!level) {
    return { canRequest: false, reason: `Unknown influence level: ${influenceLevelId}` };
  }
  const favor = FAVOR_TYPES[favorTypeId];
  if (!favor) {
    return { canRequest: false, reason: `Unknown favor type: ${favorTypeId}` };
  }
  const available = level.favorsAvailable.includes(favorTypeId);
  return {
    canRequest: available,
    reason: available
      ? `"${favor.label}" is available at the ${level.label} level.`
      : `"${favor.label}" requires a higher influence level than ${level.label}. Reach ${
          INFLUENCE_THRESHOLDS.find((t) => t.favorsAvailable.includes(favorTypeId))?.label ??
          "Bonded"
        } first.`,
  };
}

/**
 * Calculate the influence gained from giving a gift to an NPC.
 *
 * @param {string} giftCategoryId  - Key from GIFT_CATEGORIES
 * @param {string} [npcRole]       - Optional NPC role string for preference modifier
 * @returns {{ influenceGained: number, details: string }}
 */
export function recordGift(giftCategoryId, npcRole = null) {
  const category = GIFT_CATEGORIES[giftCategoryId];
  if (!category) {
    return { influenceGained: 0, details: `Unknown gift category: ${giftCategoryId}` };
  }
  const base = (category.influenceRange.min + category.influenceRange.max) / 2;
  const roleModifier =
    npcRole && category.npcPreferenceModifiers[npcRole] != null
      ? category.npcPreferenceModifiers[npcRole]
      : 0;
  const influenceGained = Math.round((base + roleModifier * 0.25) * 10) / 10;
  return {
    influenceGained,
    details: `${category.label} gift gives ${base} base influence${
      roleModifier !== 0
        ? ` with a ${roleModifier >= 0 ? "+" : ""}${roleModifier} role modifier for ${npcRole}`
        : ""
    } = ${influenceGained} total.`,
  };
}

/**
 * Summarize the influence impact of recording a favor transaction.
 *
 * @param {string} favorTypeId  - Key from FAVOR_TYPES
 * @param {"given"|"received"} direction
 *   "given"    = party did the NPC a favor (increases party influence with NPC)
 *   "received" = NPC did the party a favor (decreases party influence with NPC — debt)
 * @returns {{ influenceDelta: number, debtDelta: number, details: string }}
 */
export function recordFavor(favorTypeId, direction) {
  const favor = FAVOR_TYPES[favorTypeId];
  if (!favor) {
    return { influenceDelta: 0, debtDelta: 0, details: `Unknown favor type: ${favorTypeId}` };
  }

  if (direction === "given") {
    const influenceDelta = Math.round(favor.influenceCost * 0.75 * 10) / 10;
    const debtDelta = favor.influenceCost; // NPC now owes party
    return {
      influenceDelta,
      debtDelta,
      details: `Party granted "${favor.label}" to NPC. +${influenceDelta} influence, debt balance shifts +${debtDelta} (NPC owes party).`,
    };
  } else if (direction === "received") {
    const influenceDelta = -Math.round(favor.influenceCost * 0.5 * 10) / 10;
    const debtDelta = -favor.influenceCost; // Party now owes NPC
    return {
      influenceDelta,
      debtDelta,
      details: `NPC granted "${favor.label}" to party. ${influenceDelta} influence (debt consumed), debt balance shifts ${debtDelta} (party owes NPC).`,
    };
  }

  return {
    influenceDelta: 0,
    debtDelta: 0,
    details: `Invalid direction "${direction}". Use "given" or "received".`,
  };
}

/**
 * Apply time-based decay to a current influence score.
 *
 * @param {number} currentInfluence
 * @param {number} sessionsSinceInteraction
 * @param {number} [giftsGivenThisInterval=0]  - Gifts given in the current decay interval
 * @param {boolean} [brokenPromise=false]       - Whether a promise was broken this session
 * @returns {{ newInfluence: number, decayApplied: number, details: string }}
 */
export function applyDecay(
  currentInfluence,
  sessionsSinceInteraction,
  giftsGivenThisInterval = 0,
  brokenPromise = false
) {
  const intervals = Math.floor(
    sessionsSinceInteraction / FAVOR_DECAY.sessionsPerDecayInterval
  );

  let decayMultiplier =
    sessionsSinceInteraction >= FAVOR_DECAY.estrangementThresholdSessions
      ? FAVOR_DECAY.estrangementMultiplier
      : 1;

  const rawDecay = intervals * Math.abs(FAVOR_DECAY.passiveDecayPerInterval) * decayMultiplier;
  const giftOffset = Math.min(giftsGivenThisInterval, intervals) * FAVOR_DECAY.giftDecaySlowdown.offsetPerGift;
  const promisePenalty = brokenPromise ? Math.abs(FAVOR_DECAY.brokenPromisePenalty) : 0;

  const totalDecay = Math.max(0, rawDecay - giftOffset) + promisePenalty;
  const newInfluence = Math.round((currentInfluence - totalDecay) * 10) / 10;

  const details = [
    `Sessions since interaction: ${sessionsSinceInteraction}`,
    `Decay intervals: ${intervals} (x${decayMultiplier} multiplier${decayMultiplier > 1 ? " — estranged" : ""})`,
    `Raw decay: -${rawDecay}`,
    giftsGivenThisInterval > 0 ? `Gift slowdown offset: +${giftOffset}` : null,
    brokenPromise ? `Broken promise penalty: -${promisePenalty}` : null,
    `Total decay applied: -${totalDecay}`,
    `New influence: ${newInfluence}`,
  ]
    .filter(Boolean)
    .join(" | ");

  return { newInfluence, decayApplied: totalDecay, details };
}
