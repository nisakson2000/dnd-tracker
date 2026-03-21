/**
 * rumorBoard.js
 * =============
 * Data and helper functions for the Rumor Board feature.
 *
 * Roadmap Items Covered:
 *   - #192: Rumor board
 *
 * Exports:
 *   - RUMOR_TYPES        — Categories of rumors with truth and DC ranges
 *   - RUMOR_TEMPLATES    — 20+ templated rumor strings with placeholders
 *   - RUMOR_SOURCES      — NPC source types with reliability and cost data
 *   - RUMOR_SPREAD       — Mechanics for rumor propagation over sessions
 *   - generateRumor()    — Build a rumor object from type and context
 *   - getRumorSource()   — Retrieve a source definition by key
 *   - checkRumorTruth()  — Resolve whether a rumor is true given an investigation roll
 *   - spreadRumor()      — Apply distortion and reach after N sessions
 *   - getAllRumorTypes()  — Return all rumor type keys
 */

// ---------------------------------------------------------------------------
// RUMOR_TYPES
// ---------------------------------------------------------------------------

/**
 * Each entry describes a category of rumor.
 *
 * truthRange   — [min, max] percentage chance the rumor is accurate
 * investigationDC — [easy, hard] DC range to verify truth
 * description  — Short explanation of what this rumor category covers
 */
export const RUMOR_TYPES = {
  quest_hook: {
    key: "quest_hook",
    label: "Quest Hook",
    description: "A lead that points toward an adventure, job, or task in need of heroes.",
    truthRange: [60, 85],
    investigationDC: [10, 18],
    icon: "scroll",
  },
  world_lore: {
    key: "world_lore",
    label: "World Lore",
    description: "Historical or geographical information about the setting.",
    truthRange: [50, 90],
    investigationDC: [12, 20],
    icon: "book",
  },
  npc_gossip: {
    key: "npc_gossip",
    label: "NPC Gossip",
    description: "Personal details, secrets, or scandals about specific individuals.",
    truthRange: [30, 70],
    investigationDC: [8, 15],
    icon: "speech-bubble",
  },
  faction_news: {
    key: "faction_news",
    label: "Faction News",
    description: "Intelligence about the movements, goals, or politics of an organization.",
    truthRange: [40, 75],
    investigationDC: [12, 18],
    icon: "shield",
  },
  danger_warning: {
    key: "danger_warning",
    label: "Danger Warning",
    description: "Warnings about threats, monsters, bandits, or hazardous areas.",
    truthRange: [55, 80],
    investigationDC: [10, 16],
    icon: "skull",
  },
  treasure_lead: {
    key: "treasure_lead",
    label: "Treasure Lead",
    description: "Tips about hidden wealth, lost artifacts, or valuable rewards.",
    truthRange: [20, 60],
    investigationDC: [14, 22],
    icon: "chest",
  },
  political_intrigue: {
    key: "political_intrigue",
    label: "Political Intrigue",
    description: "Schemes, alliances, betrayals, or power plays among rulers and nobles.",
    truthRange: [35, 70],
    investigationDC: [14, 20],
    icon: "crown",
  },
  supernatural_event: {
    key: "supernatural_event",
    label: "Supernatural Event",
    description: "Strange occurrences involving magic, omens, divine signs, or the unexplained.",
    truthRange: [25, 65],
    investigationDC: [13, 21],
    icon: "sparkle",
  },
};

// ---------------------------------------------------------------------------
// RUMOR_TEMPLATES
// ---------------------------------------------------------------------------

/**
 * Templates use {placeholder} tokens that are substituted at generation time.
 * Available placeholders: {npc}, {location}, {faction}, {creature}, {item}, {number}, {adjective}
 *
 * Each template entry includes:
 *   type   — Matching key from RUMOR_TYPES
 *   style  — Delivery context (how the rumor is heard)
 *   text   — The template string
 */
export const RUMOR_TEMPLATES = [
  // Quest Hooks
  {
    id: "qt_001",
    type: "quest_hook",
    style: "tavern gossip",
    text: "I heard {npc} is paying good coin to anyone willing to clear out the trouble near {location}. Won't say what kind of trouble, but the look on their face said plenty.",
  },
  {
    id: "qt_002",
    type: "quest_hook",
    style: "traveler's tale",
    text: "A merchant on the road told me the caves east of {location} have been sealed for three generations. Someone broke the seal last week.",
  },
  {
    id: "qt_003",
    type: "quest_hook",
    style: "official notice",
    text: "A notice posted at the {location} gate: '{faction} seeks able-bodied investigators to look into recent disappearances. Inquire at the hall before dawn.'",
  },

  // World Lore
  {
    id: "wl_001",
    type: "world_lore",
    style: "overheard whisper",
    text: "The old man at the docks swears {location} was built on a temple that predates the current calendar by {number} centuries. Says the foundations still hum on new moons.",
  },
  {
    id: "wl_002",
    type: "world_lore",
    style: "tavern gossip",
    text: "Everyone knows the {creature} that haunt the {location} road aren't natural. They're the remnants of a battle fought there before living memory.",
  },
  {
    id: "wl_003",
    type: "world_lore",
    style: "traveler's tale",
    text: "An elven scholar passing through mentioned that {item} was never destroyed — it was hidden, and the hiding place is somewhere in this very region.",
  },

  // NPC Gossip
  {
    id: "ng_001",
    type: "npc_gossip",
    style: "market chatter",
    text: "You didn't hear it from me, but {npc} hasn't slept a full night since they returned from {location}. Jumps at shadows and talks to no one.",
  },
  {
    id: "ng_002",
    type: "npc_gossip",
    style: "tavern gossip",
    text: "Three people saw {npc} meeting privately with a {faction} agent last Tenday. And {npc} has always claimed to hate everything they stand for.",
  },
  {
    id: "ng_003",
    type: "npc_gossip",
    style: "overheard whisper",
    text: "The children near the mill say {npc} buries things in the yard at night. Could be nothing. Could be everything.",
  },

  // Faction News
  {
    id: "fn_001",
    type: "faction_news",
    style: "market chatter",
    text: "{faction} has been buying up property along the {location} waterfront. Three buildings in as many weeks. Nobody knows what they're planning.",
  },
  {
    id: "fn_002",
    type: "faction_news",
    style: "official notice",
    text: "Word from the capital: {faction} has formally severed ties with the council. Their agents have been seen moving supplies through {location} by night.",
  },
  {
    id: "fn_003",
    type: "faction_news",
    style: "traveler's tale",
    text: "A soldier I met on the road said {faction} suffered a serious loss near {location}. Lost their leader and {number} of their best fighters in a single night.",
  },

  // Danger Warning
  {
    id: "dw_001",
    type: "danger_warning",
    style: "tavern gossip",
    text: "Don't take the {location} pass after dark. A {adjective} {creature} has been picking off travelers for the past fortnight. Three gone and no bodies found.",
  },
  {
    id: "dw_002",
    type: "danger_warning",
    style: "overheard whisper",
    text: "The water near {location} has gone wrong. Animals won't drink. People who have are getting sick. Something's upstream.",
  },
  {
    id: "dw_003",
    type: "danger_warning",
    style: "official notice",
    text: "By order of {faction}: all travel to {location} is suspended until further notice. Violators will not be escorted back.",
  },

  // Treasure Lead
  {
    id: "tl_001",
    type: "treasure_lead",
    style: "traveler's tale",
    text: "A dying prospector I found on the road kept saying {item} was buried beneath the {adjective} stones east of {location}. Died before he could say more.",
  },
  {
    id: "tl_002",
    type: "treasure_lead",
    style: "tavern gossip",
    text: "Everyone laughs at old {npc}, but they've been sketching the same map for {number} years. I finally got a look at it. It leads right to {location}.",
  },

  // Political Intrigue
  {
    id: "pi_001",
    type: "political_intrigue",
    style: "overheard whisper",
    text: "The {adjective} alliance between {faction} and the crown is more fragile than it looks. One provocation and it collapses — and someone is deliberately providing provocation.",
  },
  {
    id: "pi_002",
    type: "political_intrigue",
    style: "market chatter",
    text: "Two heirs to the seat at {location} and both claiming legitimacy. {npc} is quietly backing the weaker one. Ask yourself why.",
  },

  // Supernatural Event
  {
    id: "se_001",
    type: "supernatural_event",
    style: "tavern gossip",
    text: "The stars above {location} have been wrong for a week. Not moved wrong — wrong. Extra ones. A scholar who looked too hard went blind.",
  },
  {
    id: "se_002",
    type: "supernatural_event",
    style: "overheard whisper",
    text: "A {adjective} figure has been seen standing at the {location} crossroads at midnight. It doesn't move, doesn't speak, and by dawn it's gone — but the ground where it stood is always scorched.",
  },
  {
    id: "se_003",
    type: "supernatural_event",
    style: "traveler's tale",
    text: "I passed through {location} during the last full moon. The church bells rang on their own for {number} hours straight. The priests won't explain it.",
  },
];

// ---------------------------------------------------------------------------
// RUMOR_SOURCES
// ---------------------------------------------------------------------------

/**
 * Each source represents a type of NPC who might share a rumor.
 *
 * reliabilityModifier — Added to the rumor's base truth percentage (-30 to +20)
 * costGP              — Typical gold cost to extract useful information (0 = free/volunteered)
 * investigationSkill  — Skill used to determine how much the source reveals
 * bribeThreshold      — Persuasion or Deception DC to get them talking without payment
 * notes               — Flavor text
 */
export const RUMOR_SOURCES = {
  tavern_keeper: {
    key: "tavern_keeper",
    label: "Tavern Keeper",
    reliabilityModifier: 5,
    costGP: 0,
    investigationSkill: "Insight",
    bribeThreshold: 10,
    notes: "Hears everything, volunteers gossip freely. Reliable for local color but prone to embellishment.",
  },
  traveling_merchant: {
    key: "traveling_merchant",
    label: "Traveling Merchant",
    reliabilityModifier: 10,
    costGP: 5,
    investigationSkill: "Persuasion",
    bribeThreshold: 12,
    notes: "Well-traveled and generally accurate on trade routes, faction activity, and regional events.",
  },
  town_crier: {
    key: "town_crier",
    label: "Town Crier",
    reliabilityModifier: 15,
    costGP: 0,
    investigationSkill: "History",
    bribeThreshold: 8,
    notes: "Official information only. High reliability but limited scope — won't know secrets.",
  },
  beggar: {
    key: "beggar",
    label: "Beggar",
    reliabilityModifier: -10,
    costGP: 1,
    investigationSkill: "Insight",
    bribeThreshold: 6,
    notes: "Sees things others ignore but details are scrambled. Cheap and sometimes surprisingly accurate.",
  },
  noble: {
    key: "noble",
    label: "Noble",
    reliabilityModifier: 5,
    costGP: 20,
    investigationSkill: "Persuasion",
    bribeThreshold: 18,
    notes: "Access to political and factional intelligence. Hard to approach without social standing or coin.",
  },
  guard: {
    key: "guard",
    label: "Guard",
    reliabilityModifier: 10,
    costGP: 3,
    investigationSkill: "Intimidation",
    bribeThreshold: 14,
    notes: "Solid on local threats and criminal activity. Bribery works but creates risk.",
  },
  priest: {
    key: "priest",
    label: "Priest",
    reliabilityModifier: 8,
    costGP: 0,
    investigationSkill: "Religion",
    bribeThreshold: 15,
    notes: "Reliable on supernatural and moral matters. May withhold information for ideological reasons.",
  },
  child: {
    key: "child",
    label: "Child",
    reliabilityModifier: -15,
    costGP: 0,
    investigationSkill: "Insight",
    bribeThreshold: 5,
    notes: "Easily overlooked by others, sees odd things, and embellishes wildly. Rarely reliable but sometimes crucial.",
  },
  mysterious_stranger: {
    key: "mysterious_stranger",
    label: "Mysterious Stranger",
    reliabilityModifier: 0,
    costGP: 10,
    investigationSkill: "Arcana",
    bribeThreshold: 20,
    notes: "Unpredictable reliability. May have insider knowledge or may be spreading disinformation deliberately.",
  },
};

// ---------------------------------------------------------------------------
// RUMOR_SPREAD
// ---------------------------------------------------------------------------

/**
 * Mechanics governing how a rumor evolves as it spreads over time.
 *
 * speedPerSession        — How many additional NPCs hear the rumor per session (base)
 * distortionChance       — Percentage chance the rumor gains a distortion each time it spreads
 * maxDistortions         — After this many distortions, the rumor no longer resembles the original
 * maxReach               — Maximum number of settlements or NPCs a rumor can reach organically
 * suppressionDC          — Investigation DC to trace the rumor back to its origin source
 * distortionEffects      — Descriptions of what can change when a rumor is distorted
 */
export const RUMOR_SPREAD = {
  speedPerSession: 3,
  distortionChance: 25,
  maxDistortions: 4,
  maxReach: 12,
  suppressionDC: 15,
  distortionEffects: [
    "The subject of the rumor changes to a different NPC.",
    "The location mentioned shifts to a nearby but incorrect place.",
    "A mundane threat is exaggerated into a supernatural one.",
    "Numbers in the rumor inflate significantly.",
    "The tone flips — a warning becomes an invitation.",
    "A name is replaced with a vague descriptor.",
    "The timeline is distorted — recent events become ancient history.",
    "An ally becomes an enemy in the retelling.",
    "A key detail is omitted entirely, making the rumor misleading.",
    "The cause and effect are swapped.",
  ],
};

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * generateRumor
 * -------------
 * Creates a rumor object from a given type and context object.
 *
 * @param {string} type - Key from RUMOR_TYPES (e.g. "quest_hook")
 * @param {Object} context - Placeholder values: { npc, location, faction, creature, item, number, adjective }
 * @returns {Object} A fully resolved rumor object ready for display
 */
export function generateRumor(type, context = {}) {
  const rumorType = RUMOR_TYPES[type];
  if (!rumorType) {
    throw new Error(`generateRumor: unknown type "${type}". Valid types: ${Object.keys(RUMOR_TYPES).join(", ")}`);
  }

  // Filter templates to the requested type
  const pool = RUMOR_TEMPLATES.filter((t) => t.type === type);
  if (pool.length === 0) {
    throw new Error(`generateRumor: no templates found for type "${type}"`);
  }

  // Pick a random template
  const template = pool[Math.floor(Math.random() * pool.length)];

  // Resolve placeholders
  const defaults = {
    npc: "a local figure",
    location: "a nearby location",
    faction: "a powerful group",
    creature: "beast",
    item: "a mysterious artifact",
    number: String(Math.floor(Math.random() * 9) + 2),
    adjective: "strange",
  };
  const resolved = { ...defaults, ...context };
  const text = template.text.replace(/\{(\w+)\}/g, (_, key) => resolved[key] ?? `{${key}}`);

  // Calculate base truth percentage (midpoint of the type's range)
  const [minTruth, maxTruth] = rumorType.truthRange;
  const baseTruthPct = Math.round((minTruth + maxTruth) / 2);

  // Calculate investigation DC (midpoint of the type's range)
  const [minDC, maxDC] = rumorType.investigationDC;
  const investigationDC = Math.round((minDC + maxDC) / 2);

  return {
    id: `rumor_${Date.now()}_${Math.floor(Math.random() * 9999)}`,
    type: rumorType.key,
    typeLabel: rumorType.label,
    style: template.style,
    templateId: template.id,
    text,
    baseTruthPct,
    investigationDC,
    distortions: 0,
    sessionsActive: 0,
    reachCount: 1,
    confirmed: null, // null = unknown, true = verified, false = debunked
    createdAt: new Date().toISOString(),
  };
}

/**
 * getRumorSource
 * --------------
 * Returns the full source definition for a given source key.
 *
 * @param {string} sourceType - Key from RUMOR_SOURCES
 * @returns {Object} The source definition object
 */
export function getRumorSource(sourceType) {
  const source = RUMOR_SOURCES[sourceType];
  if (!source) {
    throw new Error(
      `getRumorSource: unknown sourceType "${sourceType}". Valid types: ${Object.keys(RUMOR_SOURCES).join(", ")}`
    );
  }
  return { ...source };
}

/**
 * checkRumorTruth
 * ---------------
 * Determines whether a rumor is true based on an investigation roll.
 * Takes into account the rumor's base truth percentage, any distortions,
 * and the source's reliability modifier if a source is provided.
 *
 * @param {Object} rumor - A rumor object (as returned by generateRumor)
 * @param {number} investigationRoll - The d20 + modifier total of the investigation check
 * @param {string|null} sourceKey - Optional key from RUMOR_SOURCES for reliability adjustment
 * @returns {Object} { revealed: boolean, isTrue: boolean, adjustedTruthPct: number, dcMet: boolean }
 */
export function checkRumorTruth(rumor, investigationRoll, sourceKey = null) {
  if (!rumor || typeof rumor.baseTruthPct !== "number") {
    throw new Error("checkRumorTruth: invalid rumor object provided");
  }

  // Apply distortion penalty — each distortion reduces truth by 15%
  const distortionPenalty = (rumor.distortions ?? 0) * 15;

  // Apply source reliability modifier
  let reliabilityBonus = 0;
  if (sourceKey) {
    const source = RUMOR_SOURCES[sourceKey];
    if (source) {
      reliabilityBonus = source.reliabilityModifier;
    }
  }

  const adjustedTruthPct = Math.min(
    100,
    Math.max(0, rumor.baseTruthPct - distortionPenalty + reliabilityBonus)
  );

  // Check if the DC was met — if not, no information is reliably revealed
  const dcMet = investigationRoll >= rumor.investigationDC;

  // Determine truth via adjusted probability
  const roll = Math.floor(Math.random() * 100) + 1;
  const isTrue = roll <= adjustedTruthPct;

  return {
    revealed: dcMet,
    isTrue,
    adjustedTruthPct,
    dcMet,
    investigationRoll,
    requiredDC: rumor.investigationDC,
  };
}

/**
 * spreadRumor
 * -----------
 * Simulates a rumor propagating over a number of sessions.
 * Each session may introduce distortions and expands reach.
 * Returns a new rumor object — does not mutate the original.
 *
 * @param {Object} rumor - A rumor object (as returned by generateRumor)
 * @param {number} sessions - Number of in-game sessions that have passed
 * @returns {Object} Updated rumor object with spread applied
 */
export function spreadRumor(rumor, sessions) {
  if (!rumor || typeof sessions !== "number" || sessions < 1) {
    throw new Error("spreadRumor: requires a valid rumor object and a positive session count");
  }

  let updated = { ...rumor };

  for (let s = 0; s < sessions; s++) {
    // Increment session counter
    updated.sessionsActive = (updated.sessionsActive ?? 0) + 1;

    // Expand reach, capped at RUMOR_SPREAD.maxReach
    const newReach = (updated.reachCount ?? 1) + RUMOR_SPREAD.speedPerSession;
    updated.reachCount = Math.min(newReach, RUMOR_SPREAD.maxReach);

    // Roll for distortion
    const distortionRoll = Math.floor(Math.random() * 100) + 1;
    if (distortionRoll <= RUMOR_SPREAD.distortionChance) {
      if ((updated.distortions ?? 0) < RUMOR_SPREAD.maxDistortions) {
        updated.distortions = (updated.distortions ?? 0) + 1;

        // Apply a random distortion effect to the text as a note
        const effect =
          RUMOR_SPREAD.distortionEffects[
            Math.floor(Math.random() * RUMOR_SPREAD.distortionEffects.length)
          ];
        updated.distortionHistory = [
          ...(updated.distortionHistory ?? []),
          { session: updated.sessionsActive, effect },
        ];
      }
    }
  }

  return updated;
}

/**
 * getAllRumorTypes
 * ---------------
 * Returns an array of all rumor type keys.
 *
 * @returns {string[]} Array of RUMOR_TYPES keys
 */
export function getAllRumorTypes() {
  return Object.keys(RUMOR_TYPES);
}
