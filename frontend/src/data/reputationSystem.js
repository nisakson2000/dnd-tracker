/**
 * @file reputationSystem.js
 * @description Location and faction-based reputation tracking system for The Codex.
 *
 * Manages per-location/faction reputation scores independently from global fame/infamy.
 * A party may be revered in one settlement and reviled in another. Reputation affects
 * NPC disposition, shop prices, quest availability, guard reactions, and special rewards.
 *
 * @see fameInfamy.js for global fame/infamy tracking (world-wide renown)
 */

// ---------------------------------------------------------------------------
// REPUTATION_TIERS
// ---------------------------------------------------------------------------

/**
 * Nine-tier reputation scale from -4 (Reviled) to +4 (Revered).
 * Each tier defines how NPCs, merchants, and authorities respond to the party.
 *
 * @type {Object.<string, {
 *   score: number,
 *   label: string,
 *   npcDispositionModifier: number,
 *   shopPriceModifier: number,
 *   questAvailability: string,
 *   guardReaction: string,
 *   description: string
 * }>}
 */
export const REPUTATION_TIERS = {
  REVILED: {
    score: -4,
    label: "Reviled",
    npcDispositionModifier: -4,
    shopPriceModifier: 0.5,       // prices doubled (multiply base cost by 1 / modifier = 2x)
    questAvailability: "none",
    guardReaction: "attack_on_sight",
    description:
      "The party is despised here. Guards attack on sight, merchants refuse service, and locals scatter at their approach. Entering this location is extremely dangerous.",
  },
  HATED: {
    score: -3,
    label: "Hated",
    npcDispositionModifier: -3,
    shopPriceModifier: 0.65,
    questAvailability: "none",
    guardReaction: "hostile_demands",
    description:
      "The party is openly loathed. Guards confront them with weapons drawn and demand they leave. Most merchants will not deal with them without a hefty surcharge.",
  },
  DISLIKED: {
    score: -2,
    label: "Disliked",
    npcDispositionModifier: -2,
    shopPriceModifier: 0.8,
    questAvailability: "criminal_only",
    guardReaction: "suspicious_surveillance",
    description:
      "The party is unwelcome. Guards watch them closely and NPCs are curt or dismissive. Only shady contacts will offer work, and prices reflect the cold reception.",
  },
  DISTRUSTED: {
    score: -1,
    label: "Distrusted",
    npcDispositionModifier: -1,
    shopPriceModifier: 0.9,
    questAvailability: "limited",
    guardReaction: "wary",
    description:
      "The party has a poor reputation but can still function in the settlement. Guards keep a watchful eye and some NPCs refuse to engage without persuasion checks.",
  },
  UNKNOWN: {
    score: 0,
    label: "Unknown",
    npcDispositionModifier: 0,
    shopPriceModifier: 1.0,
    questAvailability: "standard",
    guardReaction: "neutral",
    description:
      "The party is neither known nor notable here. Standard prices apply, NPCs react with indifference, and guards treat them like any other traveler.",
  },
  KNOWN: {
    score: 1,
    label: "Known",
    npcDispositionModifier: 1,
    shopPriceModifier: 1.05,
    questAvailability: "standard",
    guardReaction: "cooperative",
    description:
      "People recognize the party and associate them with good deeds. Conversations start slightly warmer, and minor favors are easier to obtain.",
  },
  LIKED: {
    score: 2,
    label: "Liked",
    npcDispositionModifier: 2,
    shopPriceModifier: 1.1,
    questAvailability: "expanded",
    guardReaction: "helpful",
    description:
      "The party is well-regarded. Locals go out of their way to assist, minor discounts are available, and guards may share information freely.",
  },
  RESPECTED: {
    score: 3,
    label: "Respected",
    npcDispositionModifier: 3,
    shopPriceModifier: 1.2,
    questAvailability: "high_tier",
    guardReaction: "escort_offered",
    description:
      "The party has earned genuine respect. Leaders seek their counsel, better quests are offered, and the settlement's guard may provide voluntary escort through dangerous areas.",
  },
  REVERED: {
    score: 4,
    label: "Revered",
    npcDispositionModifier: 4,
    shopPriceModifier: 1.35,
    questAvailability: "all_including_secret",
    guardReaction: "full_support",
    description:
      "The party are legends in this place. Citizens celebrate their arrival, the highest authorities grant audiences, secret quests are revealed, and the full military or civic resources of the settlement may be placed at their disposal.",
  },
};

// ---------------------------------------------------------------------------
// REPUTATION_ACTIONS
// ---------------------------------------------------------------------------

/**
 * Actions that modify reputation at a location or with a faction.
 * reputationChange is the base delta applied to the party's score.
 * Some actions have conditional or variable changes noted in conditions.
 *
 * @type {Array.<{
 *   id: string,
 *   label: string,
 *   reputationChange: number,
 *   description: string,
 *   conditions: string|null
 * }>}
 */
export const REPUTATION_ACTIONS = [
  {
    id: "complete_quest",
    label: "Complete Quest",
    reputationChange: 1,
    description: "Successfully completing a quest given by a local NPC or authority.",
    conditions: null,
  },
  {
    id: "save_civilians",
    label: "Save Civilians",
    reputationChange: 2,
    description: "Rescuing townspeople from immediate danger (monster attack, fire, bandit raid, etc.).",
    conditions: null,
  },
  {
    id: "donate_to_temple",
    label: "Donate to Temple",
    reputationChange: 1,
    description: "Making a meaningful donation to the local temple or religious institution.",
    conditions: "Donation must be at least 10 gp or equivalent goods to count.",
  },
  {
    id: "defend_town",
    label: "Defend Town",
    reputationChange: 2,
    description: "Actively participating in the defense of the settlement against an external threat.",
    conditions: null,
  },
  {
    id: "commit_crime",
    label: "Commit Crime",
    reputationChange: -2,
    description: "Being caught committing theft, vandalism, fraud, or other crimes within the settlement.",
    conditions: "Applied only if witnessed or caught. Undetected crimes have no reputation effect.",
  },
  {
    id: "murder",
    label: "Murder",
    reputationChange: -3,
    description: "Killing a non-hostile NPC or committing unprovoked slaughter within the settlement.",
    conditions: "Applied per incident. Cumulative with other negative actions in the same session.",
  },
  {
    id: "help_merchant",
    label: "Help Merchant",
    reputationChange: 1,
    description: "Protecting a merchant's caravan, recovering stolen goods, or resolving a trade dispute in their favor.",
    conditions: null,
  },
  {
    id: "win_tournament",
    label: "Win Tournament",
    reputationChange: 1,
    description: "Winning a local tournament, gladiatorial contest, or other public competition.",
    conditions: "Only applies in settlements that host such events.",
  },
  {
    id: "betray_ally",
    label: "Betray Ally",
    reputationChange: -3,
    description: "Betraying a sworn ally, NPC companion, or local faction that the settlement holds in good standing.",
    conditions: "Effect is doubled if the betrayal directly harms the settlement.",
  },
  {
    id: "discover_ancient_artifact",
    label: "Discover Ancient Artifact",
    reputationChange: 1,
    description: "Recovering and presenting a historically significant artifact to local scholars, rulers, or temples.",
    conditions: "Artifact must be donated or displayed publicly, not sold privately.",
  },
  {
    id: "build_structure",
    label: "Build Structure",
    reputationChange: 2,
    description: "Funding or constructing a building that benefits the settlement (inn, bridge, well, shrine, etc.).",
    conditions: "Requires significant investment (100+ gp or equivalent labor).",
  },
  {
    id: "public_speech",
    label: "Public Speech",
    reputationChange: 0,
    description: "Giving a speech, performance, or public address to the settlement's population.",
    conditions:
      "Variable outcome. Roll Persuasion or Performance vs. DC 15: success = +1 reputation, failure = -1 reputation. Critical success = +2, critical failure = -2.",
  },
  {
    id: "charity",
    label: "Charity",
    reputationChange: 1,
    description: "Distributing food, coin, or supplies to the poor or disaster-affected people of the settlement.",
    conditions: "Costs at least 5 gp worth of goods or coin per +1 reputation gained.",
  },
  {
    id: "intimidation",
    label: "Intimidation",
    reputationChange: -1,
    description: "Coercing or threatening locals through fear rather than persuasion or fair dealing.",
    conditions: "Applied each time intimidation is used openly within the settlement.",
  },
  {
    id: "bribe_officials",
    label: "Bribe Officials",
    reputationChange: -1,
    description: "Attempting to bribe a guard, magistrate, or other official.",
    conditions:
      "Reputation loss only applied if the bribe is discovered or refused. Successful secret bribes have no reputation effect.",
  },
];

// ---------------------------------------------------------------------------
// REPUTATION_DECAY
// ---------------------------------------------------------------------------

/**
 * Natural drift of reputation back toward 0 over time when the party is absent
 * or takes no notable actions in a location.
 *
 * Positive reputation decays slowly (legends persist).
 * Negative reputation decays faster (communities want to move on).
 *
 * @type {{
 *   sessionsPerDecayTick: number,
 *   positiveDecayRate: number,
 *   negativeDecayRate: number,
 *   minimumScoreForDecay: number,
 *   description: string,
 *   rules: string[]
 * }}
 */
export const REPUTATION_DECAY = {
  sessionsPerDecayTick: 5,
  positiveDecayRate: 1,
  negativeDecayRate: 2,
  minimumScoreForDecay: 1,
  description:
    "Reputation drifts toward 0 when the party is not present and takes no notable actions. Negative reputation fades faster as communities seek to move on; positive reputation lingers longer as stories are retold.",
  rules: [
    "Every 5 sessions elapsed without party activity in a location triggers one decay tick.",
    "Positive scores lose 1 point per tick (slow decay — legends persist).",
    "Negative scores gain 2 points per tick toward 0 (fast decay — people want to forget).",
    "Score never crosses 0 due to decay alone.",
    "A party returning and taking notable action resets the session counter for that location.",
    "Locations with active temples, bards, or chroniclers may have halved decay rates for positive rep.",
  ],
};

// ---------------------------------------------------------------------------
// LOCATION_REPUTATION
// ---------------------------------------------------------------------------

/**
 * Template and metadata for a location's independent reputation record.
 * Each settlement, dungeon faction, or wilderness region tracks reputation separately.
 *
 * @type {{
 *   template: Object,
 *   notes: string[]
 * }}
 */
export const LOCATION_REPUTATION = {
  /**
   * Default structure for a new location reputation entry.
   * Clone this when initializing reputation for a new settlement or faction.
   */
  template: {
    locationId: "",
    locationName: "",
    locationType: "settlement",      // "settlement" | "faction" | "region" | "dungeon"
    partyScore: 0,
    individualScores: {},            // keyed by character ID, value is score number
    sessionsSinceLastActivity: 0,
    notableEvents: [],               // array of { action: string, change: number, session: number }
    lastModifiedSession: 0,
  },
  notes: [
    "Each location/faction maintains a completely independent reputation score.",
    "Party score represents collective standing; individual scores may differ.",
    "A character who committed crimes alone should receive individual score penalties, not party-wide.",
    "Heroes in one town can be villains in another — always check the specific location's score.",
    "Factions (thieves guild, merchant league, etc.) are treated as their own 'locations'.",
    "Region reputation represents general rural/wilderness area sentiment outside named settlements.",
  ],
};

// ---------------------------------------------------------------------------
// REPUTATION_REWARDS
// ---------------------------------------------------------------------------

/**
 * Special rewards and privileges unlocked at positive reputation thresholds.
 * These are in addition to the standard NPC disposition and price benefits.
 *
 * @type {Array.<{
 *   minimumScore: number,
 *   tier: string,
 *   rewards: string[]
 * }>}
 */
export const REPUTATION_REWARDS = [
  {
    minimumScore: 2,
    tier: "Liked",
    rewards: [
      "Minor discount at local shops (5-10% off standard prices).",
      "Free stabling for mounts at the local inn or stable.",
      "NPCs willingly share non-sensitive local rumors and gossip.",
      "Minor civic officials will grant short audiences without appointments.",
    ],
  },
  {
    minimumScore: 3,
    tier: "Respected",
    rewards: [
      "Free lodging at inns (basic room provided by the establishment as a gesture of goodwill).",
      "Access to high-tier quests and missions from respected NPCs and guilds.",
      "Guard escort offered through dangerous parts of town or surrounding roads.",
      "Local militia or town watch may assist in non-political conflicts the party is involved in.",
      "Invitations to exclusive social events (noble dinners, guild meetings, festival ceremonies).",
    ],
  },
  {
    minimumScore: 4,
    tier: "Revered",
    rewards: [
      "Political influence: the party's opinion carries weight in civic decisions.",
      "Eligible for a formal land grant within the settlement's territory.",
      "Eligible for an honorary title (Knight of the City, Friend of the Realm, etc.).",
      "Access to secret quests, hidden information, and restricted locations.",
      "Settlement leadership places military or civic resources at the party's disposal during crises.",
      "Statues, plaques, or other permanent monuments may be erected in the party's honor.",
      "Bards in the area actively spread the party's legend, slowing positive reputation decay.",
    ],
  },
];

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Returns the reputation tier object for a given numeric score.
 * Clamps the score to the valid range [-4, 4] before lookup.
 *
 * @param {number} score - Reputation score (expected range -4 to +4).
 * @returns {{
 *   score: number,
 *   label: string,
 *   npcDispositionModifier: number,
 *   shopPriceModifier: number,
 *   questAvailability: string,
 *   guardReaction: string,
 *   description: string
 * }} The matching tier object.
 */
export function getReputationTier(score) {
  const clamped = Math.max(-4, Math.min(4, Math.round(score)));
  return Object.values(REPUTATION_TIERS).find((tier) => tier.score === clamped) || REPUTATION_TIERS.UNKNOWN;
}

/**
 * Applies a named reputation action to a current score and returns the new score.
 * The resulting score is clamped to [-4, 4].
 *
 * For the "public_speech" action (variable outcome), pass an explicit override via
 * the options parameter rather than relying on the base reputationChange of 0.
 *
 * @param {number} currentScore - The current reputation score.
 * @param {string} actionId - The id of the action from REPUTATION_ACTIONS.
 * @param {Object} [options] - Optional overrides.
 * @param {number} [options.overrideChange] - Override the action's default reputationChange.
 * @returns {{ newScore: number, delta: number, action: Object|null, newTier: Object }}
 */
export function modifyReputation(currentScore, actionId, options = {}) {
  const action = REPUTATION_ACTIONS.find((a) => a.id === actionId) || null;

  let delta = 0;
  if (options.overrideChange !== undefined) {
    delta = options.overrideChange;
  } else if (action) {
    delta = action.reputationChange;
  }

  const newScore = Math.max(-4, Math.min(4, currentScore + delta));
  return {
    newScore,
    delta,
    action,
    newTier: getReputationTier(newScore),
  };
}

/**
 * Applies natural reputation decay to a map of location reputation records
 * based on sessions elapsed since last activity.
 *
 * Processes each location independently and moves scores toward 0 according
 * to REPUTATION_DECAY rates.
 *
 * @param {Object.<string, { partyScore: number, sessionsSinceLastActivity: number }>} reputations
 *   Map of locationId -> reputation record (or any object with partyScore and sessionsSinceLastActivity).
 * @param {number} sessionsElapsed - Number of sessions that have passed since last call.
 * @returns {Object.<string, { partyScore: number, sessionsSinceLastActivity: number, decayApplied: number }>}
 *   Updated reputation records with decay applied and decayApplied delta noted.
 */
export function applyReputationDecay(reputations, sessionsElapsed) {
  const { sessionsPerDecayTick, positiveDecayRate, negativeDecayRate, minimumScoreForDecay } = REPUTATION_DECAY;

  const result = {};

  for (const [locationId, rep] of Object.entries(reputations)) {
    const totalSessions = (rep.sessionsSinceLastActivity || 0) + sessionsElapsed;
    const ticks = Math.floor(totalSessions / sessionsPerDecayTick);
    const remainingSessions = totalSessions % sessionsPerDecayTick;

    let score = rep.partyScore;
    let decayApplied = 0;

    if (ticks > 0 && Math.abs(score) >= minimumScoreForDecay) {
      for (let i = 0; i < ticks; i++) {
        if (score === 0) break;

        if (score > 0) {
          const decay = Math.min(score, positiveDecayRate);
          score -= decay;
          decayApplied -= decay;
        } else {
          // Negative reputation: move toward 0 (increase score)
          const decay = Math.min(Math.abs(score), negativeDecayRate);
          score += decay;
          decayApplied += decay;
        }
      }
    }

    result[locationId] = {
      ...rep,
      partyScore: score,
      sessionsSinceLastActivity: remainingSessions,
      decayApplied,
    };
  }

  return result;
}

/**
 * Returns a summary of all mechanical effects currently active for a given reputation score.
 * Combines tier data with applicable reward unlocks.
 *
 * @param {number} score - The current reputation score.
 * @returns {{
 *   tier: Object,
 *   npcDispositionModifier: number,
 *   shopPriceModifier: number,
 *   questAvailability: string,
 *   guardReaction: string,
 *   unlockedRewards: string[]
 * }}
 */
export function getReputationEffects(score) {
  const tier = getReputationTier(score);

  const unlockedRewards = REPUTATION_REWARDS.filter((r) => score >= r.minimumScore).flatMap((r) => r.rewards);

  return {
    tier,
    npcDispositionModifier: tier.npcDispositionModifier,
    shopPriceModifier: tier.shopPriceModifier,
    questAvailability: tier.questAvailability,
    guardReaction: tier.guardReaction,
    unlockedRewards,
  };
}

/**
 * Calculates the actual price a merchant charges given a base price and reputation score.
 *
 * Positive reputation grants discounts (shop sells cheaper to the party).
 * Negative reputation results in surcharges (shop sells more expensive or refuses).
 *
 * The shopPriceModifier in tiers is a multiplier on the party's favor:
 * - modifier > 1.0 means the shop favors the party (effective price is lower)
 * - modifier < 1.0 means the shop disfavors the party (effective price is higher)
 *
 * Final price = basePrice / shopPriceModifier (rounded to nearest copper).
 *
 * @param {number} reputationScore - The party's reputation score at this location.
 * @param {number} basePrice - The standard price of the item in gold pieces (can be decimal).
 * @returns {{ finalPrice: number, modifier: number, percentChange: number }}
 */
export function calculatePriceModifier(reputationScore, basePrice = 1) {
  const tier = getReputationTier(reputationScore);
  const modifier = tier.shopPriceModifier;

  // modifier = 1.0 → no change; >1.0 → party is favored (cheaper); <1.0 → party is penalized (expensive)
  const finalPrice = Math.round((basePrice / modifier) * 100) / 100;
  const percentChange = Math.round(((finalPrice - basePrice) / basePrice) * 100);

  return {
    finalPrice,
    modifier,
    percentChange,
  };
}

/**
 * Returns the list of quest availability categories accessible at a given reputation score.
 * Higher reputation unlocks more quest types; negative reputation restricts them.
 *
 * @param {number} reputationScore - The party's reputation score at this location.
 * @returns {{
 *   availabilityKey: string,
 *   availableTypes: string[],
 *   description: string
 * }}
 */
export function getAvailableQuests(reputationScore) {
  const tier = getReputationTier(reputationScore);
  const key = tier.questAvailability;

  const QUEST_AVAILABILITY_MAP = {
    none: {
      availableTypes: [],
      description: "No NPCs will offer quests. The party is unwelcome and must leave or improve standing first.",
    },
    criminal_only: {
      availableTypes: ["criminal", "underworld"],
      description: "Only criminal contacts and underworld fixers will deal with the party.",
    },
    limited: {
      availableTypes: ["criminal", "underworld", "mercenary"],
      description: "Mercenary work and underworld contracts are available. Legitimate guilds refuse service.",
    },
    standard: {
      availableTypes: ["mercenary", "bounty", "delivery", "standard_guild", "civic_minor"],
      description: "Standard quest board notices, minor guild contracts, and civic errands are available.",
    },
    expanded: {
      availableTypes: ["mercenary", "bounty", "delivery", "standard_guild", "civic_minor", "civic_major", "noble_minor"],
      description:
        "Expanded access includes minor noble commissions and major civic contracts alongside standard fare.",
    },
    high_tier: {
      availableTypes: [
        "mercenary", "bounty", "delivery", "standard_guild", "civic_minor",
        "civic_major", "noble_minor", "noble_major", "military", "religious",
      ],
      description:
        "High-tier access includes noble houses, military commissions, and religious orders seeking the party's aid.",
    },
    all_including_secret: {
      availableTypes: [
        "mercenary", "bounty", "delivery", "standard_guild", "civic_minor",
        "civic_major", "noble_minor", "noble_major", "military", "religious",
        "secret", "legendary",
      ],
      description:
        "Full access including secret missions from hidden factions, legendary quests, and tasks only trusted heroes are told of.",
    },
  };

  const entry = QUEST_AVAILABILITY_MAP[key] || QUEST_AVAILABILITY_MAP["standard"];

  return {
    availabilityKey: key,
    availableTypes: entry.availableTypes,
    description: entry.description,
  };
}
