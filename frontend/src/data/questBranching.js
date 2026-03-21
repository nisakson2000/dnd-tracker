/**
 * questBranching.js
 *
 * Quest branching data and helper functions for The Codex — D&D Companion.
 *
 * Roadmap items covered:
 *   - 175: Quest branching — node types, decision templates, consequence types,
 *           branch structure templates, and helper functions for building and
 *           evaluating branching quest narratives.
 *
 * No React imports. Pure data + utility exports.
 */

// ─── Node Types ─────────────────────────────────────────────────────────────

/**
 * NODE_TYPES defines every kind of node that can appear in a branching quest graph.
 *
 * @type {Object.<string, { label: string, description: string, iconHint: string }>}
 */
export const NODE_TYPES = {
  start: {
    label: "Start",
    description: "The entry point of a quest or quest segment. Every quest graph has exactly one start node.",
    iconHint: "flag",
  },
  decision: {
    label: "Decision",
    description: "A fork where the party must make a meaningful choice that affects the direction of the quest.",
    iconHint: "split-arrows",
  },
  challenge: {
    label: "Challenge",
    description: "An obstacle the party must overcome — combat, skill check, puzzle, or social encounter.",
    iconHint: "crossed-swords",
  },
  reveal: {
    label: "Reveal",
    description: "A narrative beat where hidden information, a twist, or important lore is uncovered.",
    iconHint: "eye",
  },
  reward: {
    label: "Reward",
    description: "The party receives tangible or intangible gains: treasure, XP, information, or goodwill.",
    iconHint: "chest",
  },
  consequence: {
    label: "Consequence",
    description: "A node that applies the downstream effects of an earlier decision to the world or party.",
    iconHint: "ripple",
  },
  branch: {
    label: "Branch",
    description: "A structural node that explicitly splits the narrative into two or more parallel paths.",
    iconHint: "branch",
  },
  merge: {
    label: "Merge",
    description: "A structural node that rejoins two or more previously diverging paths into one narrative thread.",
    iconHint: "merge",
  },
  end: {
    label: "End",
    description: "The terminus of a quest or major quest segment. A quest graph may have multiple end nodes.",
    iconHint: "checkmark-circle",
  },
};

// ─── Decision Templates ──────────────────────────────────────────────────────

/**
 * DECISION_TEMPLATES provides 12 archetypal quest decision points DMs can use
 * as starting scaffolds when designing branching encounters.
 *
 * Each entry has:
 *   - description    : narrative framing of the dilemma
 *   - options        : 2–3 player-facing choices
 *   - consequenceHints: downstream effects to consider for each option
 *
 * @type {Object.<string, { label: string, description: string, options: string[], consequenceHints: string[] }>}
 */
export const DECISION_TEMPLATES = {
  moralDilemma: {
    label: "Moral Dilemma",
    description:
      "The party faces a situation with no clean solution — both paths involve harm, and the right answer is genuinely unclear.",
    options: [
      "Act to minimize immediate harm, even at ethical cost",
      "Hold to principle regardless of short-term consequences",
      "Seek a third path through creativity or negotiation",
    ],
    consequenceHints: [
      "reputation change, faction shift",
      "NPC relationship change, world state change",
      "new quest unlocked, resource gain/loss",
    ],
  },
  allyVsAlly: {
    label: "Ally vs. Ally",
    description:
      "Two trusted allies are in direct conflict; siding with one necessarily damages the relationship with the other.",
    options: [
      "Support Ally A and their position",
      "Support Ally B and their position",
      "Refuse to take sides and try to broker peace",
    ],
    consequenceHints: [
      "NPC relationship change (positive A, negative B), faction shift",
      "NPC relationship change (positive B, negative A), faction shift",
      "party conflict, new quest unlocked",
    ],
  },
  riskVsSafety: {
    label: "Risk vs. Safety",
    description:
      "A high-reward opportunity is available but carries significant danger; the safe option is less costly but yields less.",
    options: [
      "Take the risk for the greater reward",
      "Choose the safer, lower-reward path",
    ],
    consequenceHints: [
      "resource gain/loss (high variance), world state change",
      "resource gain/loss (small, reliable), reputation change",
    ],
  },
  mercyVsJustice: {
    label: "Mercy vs. Justice",
    description:
      "A defeated or captured enemy could be spared or punished. Both options carry social and narrative weight.",
    options: [
      "Show mercy — spare or rehabilitate",
      "Deliver justice — punish according to law or code",
      "Let the victim or wronged party decide",
    ],
    consequenceHints: [
      "NPC relationship change, new quest unlocked, faction shift",
      "reputation change, world state change, faction shift",
      "NPC relationship change, party conflict",
    ],
  },
  truthVsLoyalty: {
    label: "Truth vs. Loyalty",
    description:
      "An ally has done something wrong or concealed important information. Exposing the truth helps the world but betrays a bond.",
    options: [
      "Reveal the truth publicly",
      "Protect the ally and keep the secret",
      "Confront the ally privately first",
    ],
    consequenceHints: [
      "reputation change, NPC relationship change (negative), world state change",
      "NPC relationship change (positive), quest locked, world state change",
      "NPC relationship change, new quest unlocked",
    ],
  },
  individualVsGroup: {
    label: "Individual vs. Group",
    description:
      "Helping one person (or a small group) means abandoning or disadvantaging a larger population.",
    options: [
      "Prioritize the individual",
      "Prioritize the larger group",
      "Attempt to find a compromise that partially helps both",
    ],
    consequenceHints: [
      "NPC relationship change (deep positive), reputation change (negative with faction)",
      "world state change, reputation change (positive with faction)",
      "resource gain/loss, party conflict, new quest unlocked",
    ],
  },
  lawVsChaos: {
    label: "Law vs. Chaos",
    description:
      "Established rules or authority stand in the way of what seems like the morally correct action.",
    options: [
      "Follow the law even if it feels wrong",
      "Break the rules for the greater good",
    ],
    consequenceHints: [
      "reputation change (positive with authority), faction shift",
      "reputation change (negative with authority), new quest unlocked, world state change",
    ],
  },
  shortTermVsLongTerm: {
    label: "Short-Term vs. Long-Term",
    description:
      "An immediate gain conflicts with a strategy that would yield greater benefit in the future.",
    options: [
      "Take the immediate reward",
      "Invest now for a better future outcome",
      "Gamble on a wildcard option with unpredictable timing",
    ],
    consequenceHints: [
      "resource gain/loss (immediate), quest locked",
      "resource gain/loss (delayed), new quest unlocked",
      "world state change, party conflict",
    ],
  },
  violentVsPeaceful: {
    label: "Violent vs. Peaceful",
    description:
      "A conflict could be resolved through force or through diplomacy, each leaving a different mark on the world.",
    options: [
      "Resolve through combat or force",
      "Negotiate a non-violent solution",
      "Withdraw and avoid confrontation entirely",
    ],
    consequenceHints: [
      "reputation change, world state change, faction shift",
      "NPC relationship change, new quest unlocked, reputation change",
      "resource gain/loss (safety), quest locked",
    ],
  },
  trustVsSuspicion: {
    label: "Trust vs. Suspicion",
    description:
      "A stranger or former enemy offers help. Trusting them could open new paths; suspicion keeps the party safer but forecloses options.",
    options: [
      "Trust and accept the offer",
      "Refuse and act independently",
      "Verify before committing",
    ],
    consequenceHints: [
      "NPC relationship change, new quest unlocked, resource gain/loss (risk)",
      "world state change, quest locked",
      "resource gain/loss (time cost), new quest unlocked",
    ],
  },
  sacrificeVsPreservation: {
    label: "Sacrifice vs. Preservation",
    description:
      "Something valuable — a life, an artifact, a relationship — must be given up to achieve a greater goal, or preserved at a cost.",
    options: [
      "Make the sacrifice",
      "Refuse to give it up and find another way",
    ],
    consequenceHints: [
      "world state change, reputation change, NPC relationship change (loss)",
      "resource gain/loss, party conflict, new quest unlocked",
    ],
  },
  honorVsSurvival: {
    label: "Honor vs. Survival",
    description:
      "The honorable or noble action would put the party at serious risk; the survivable option is pragmatic but morally compromised.",
    options: [
      "Act with honor regardless of personal cost",
      "Prioritize survival and deal with consequences later",
      "Seek a way to preserve both, however slim the chance",
    ],
    consequenceHints: [
      "reputation change (positive), resource gain/loss (negative), faction shift",
      "reputation change (negative), world state change, NPC relationship change",
      "new quest unlocked, party conflict, world state change",
    ],
  },
};

// ─── Consequence Types ───────────────────────────────────────────────────────

/**
 * CONSEQUENCE_TYPES catalogs the categories of downstream effects that branch
 * decisions can produce, used when evaluating and applying outcomes.
 *
 * @type {Object.<string, { label: string, description: string }>}
 */
export const CONSEQUENCE_TYPES = {
  reputationChange: {
    label: "Reputation Change",
    description:
      "The party's standing with a settlement, organization, or social group shifts — for better or worse.",
  },
  factionShift: {
    label: "Faction Shift",
    description:
      "A faction's alignment, policy, or allegiance changes as a direct result of the party's choice.",
  },
  npcRelationshipChange: {
    label: "NPC Relationship Change",
    description:
      "A specific NPC's attitude toward the party improves or deteriorates, potentially unlocking or closing interactions.",
  },
  resourceGainLoss: {
    label: "Resource Gain / Loss",
    description:
      "The party gains or loses gold, items, spell slots, downtime days, or other trackable resources.",
  },
  newQuestUnlocked: {
    label: "New Quest Unlocked",
    description:
      "A previously unavailable quest or quest segment becomes accessible to the party.",
  },
  questLocked: {
    label: "Quest Locked",
    description:
      "A quest or quest segment the party might have pursued is now permanently unavailable due to their choice.",
  },
  worldStateChange: {
    label: "World State Change",
    description:
      "The state of the game world itself shifts — an NPC dies, a building falls, a war begins, a political situation evolves.",
  },
  partyConflict: {
    label: "Party Conflict",
    description:
      "The decision creates internal friction within the party, potentially triggering disagreements or alignment-based tension.",
  },
};

// ─── Branch Templates ────────────────────────────────────────────────────────

/**
 * BRANCH_TEMPLATES defines 6 archetypal quest graph structures.
 *
 * Each template includes:
 *   - description : narrative/structural summary
 *   - nodes       : ordered list of node descriptors { id, type, label }
 *   - edges       : directed connections { from, to, condition? }
 *
 * Node ids use short alphanumeric keys for portability. When instantiating a
 * template with createQuestNode / addBranch, replace ids with UUIDs.
 *
 * @type {Object.<string, { label: string, description: string, nodes: Object[], edges: Object[] }>}
 */
export const BRANCH_TEMPLATES = {
  linear: {
    label: "Linear (A → B → C)",
    description:
      "A single path with no branching. Every scene leads inevitably to the next. Good for short side quests or prologues.",
    nodes: [
      { id: "A", type: "start",     label: "Quest Start" },
      { id: "B", type: "challenge", label: "Main Obstacle" },
      { id: "C", type: "end",       label: "Resolution" },
    ],
    edges: [
      { from: "A", to: "B" },
      { from: "B", to: "C" },
    ],
  },
  fork: {
    label: "Fork (A → B1 | B2 → C)",
    description:
      "One decision creates two distinct middle paths that both converge on the same conclusion. Good for single moral dilemmas.",
    nodes: [
      { id: "A",  type: "start",    label: "Inciting Event" },
      { id: "B1", type: "challenge",label: "Path 1 — Direct Approach" },
      { id: "B2", type: "challenge",label: "Path 2 — Alternate Approach" },
      { id: "C",  type: "end",      label: "Shared Conclusion" },
    ],
    edges: [
      { from: "A",  to: "B1", condition: "Choice A" },
      { from: "A",  to: "B2", condition: "Choice B" },
      { from: "B1", to: "C" },
      { from: "B2", to: "C" },
    ],
  },
  diamond: {
    label: "Diamond (A → B1 | B2 → C1 | C2 → D)",
    description:
      "Two decision points with four possible mid-routes, all merging at a single finale. Provides strong replayability.",
    nodes: [
      { id: "A",  type: "start",      label: "Opening" },
      { id: "B1", type: "challenge",  label: "Act 1 — Path 1" },
      { id: "B2", type: "challenge",  label: "Act 1 — Path 2" },
      { id: "C1", type: "reveal",     label: "Act 2 — Revelation A" },
      { id: "C2", type: "reveal",     label: "Act 2 — Revelation B" },
      { id: "D",  type: "end",        label: "Climax & Resolution" },
    ],
    edges: [
      { from: "A",  to: "B1", condition: "Decision 1 — Option A" },
      { from: "A",  to: "B2", condition: "Decision 1 — Option B" },
      { from: "B1", to: "C1", condition: "Decision 2 — Option A" },
      { from: "B1", to: "C2", condition: "Decision 2 — Option B" },
      { from: "B2", to: "C1", condition: "Decision 2 — Option A" },
      { from: "B2", to: "C2", condition: "Decision 2 — Option B" },
      { from: "C1", to: "D" },
      { from: "C2", to: "D" },
    ],
  },
  parallel: {
    label: "Parallel (A → B + C → D)",
    description:
      "After the opening, two simultaneous storylines run concurrently before joining. Good for split-party scenes or dual objectives.",
    nodes: [
      { id: "A", type: "start",     label: "Divergence Point" },
      { id: "B", type: "challenge", label: "Thread 1" },
      { id: "C", type: "challenge", label: "Thread 2" },
      { id: "M", type: "merge",     label: "Reunion" },
      { id: "D", type: "end",       label: "Combined Outcome" },
    ],
    edges: [
      { from: "A", to: "B", condition: "Parallel branch 1" },
      { from: "A", to: "C", condition: "Parallel branch 2" },
      { from: "B", to: "M" },
      { from: "C", to: "M" },
      { from: "M", to: "D" },
    ],
  },
  cascade: {
    label: "Cascade (A → B → C1 + C2 + C3)",
    description:
      "A single path builds to a branching finale with multiple distinct endings. Each end reflects the party's cumulative choices.",
    nodes: [
      { id: "A",  type: "start",       label: "Quest Begins" },
      { id: "B",  type: "decision",    label: "Critical Choice" },
      { id: "C1", type: "end",         label: "Ending 1 — Victory" },
      { id: "C2", type: "end",         label: "Ending 2 — Compromise" },
      { id: "C3", type: "end",         label: "Ending 3 — Failure / Twist" },
    ],
    edges: [
      { from: "A",  to: "B" },
      { from: "B",  to: "C1", condition: "Option A" },
      { from: "B",  to: "C2", condition: "Option B" },
      { from: "B",  to: "C3", condition: "Option C" },
    ],
  },
  web: {
    label: "Web (Multiple Interconnections)",
    description:
      "A fully non-linear structure where many nodes connect to many others. Best for sandbox-style quests or long campaigns.",
    nodes: [
      { id: "A",  type: "start",       label: "Entry" },
      { id: "B",  type: "challenge",   label: "Scene 1" },
      { id: "C",  type: "decision",    label: "Crossroads" },
      { id: "D",  type: "reveal",      label: "Hidden Truth" },
      { id: "E",  type: "consequence", label: "Fallout" },
      { id: "F",  type: "reward",      label: "Opportunity" },
      { id: "G",  type: "merge",       label: "Convergence" },
      { id: "H",  type: "end",         label: "Finale A" },
      { id: "I",  type: "end",         label: "Finale B" },
    ],
    edges: [
      { from: "A", to: "B" },
      { from: "A", to: "C", condition: "Skip ahead" },
      { from: "B", to: "C" },
      { from: "B", to: "D", condition: "Investigation success" },
      { from: "C", to: "D", condition: "Dig deeper" },
      { from: "C", to: "F", condition: "Take the deal" },
      { from: "D", to: "E" },
      { from: "E", to: "G" },
      { from: "F", to: "G" },
      { from: "G", to: "H", condition: "Confront" },
      { from: "G", to: "I", condition: "Negotiate" },
    ],
  },
};

// ─── Helper Functions ────────────────────────────────────────────────────────

/**
 * Creates a new quest node object.
 *
 * @param {string} type - One of the keys in NODE_TYPES.
 * @param {Object} data - Arbitrary metadata (label, description, rewards, etc.).
 * @returns {{ id: string, type: string, data: Object, createdAt: string }}
 */
export function createQuestNode(type, data = {}) {
  if (!NODE_TYPES[type]) {
    console.warn(`createQuestNode: unknown node type "${type}". Defaulting to "challenge".`);
    type = "challenge";
  }

  const id = `node_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  return {
    id,
    type,
    data: {
      label: data.label || NODE_TYPES[type].label,
      description: data.description || "",
      iconHint: NODE_TYPES[type].iconHint,
      ...data,
    },
    createdAt: new Date().toISOString(),
  };
}

/**
 * Creates a directed edge (branch) between two quest nodes.
 *
 * @param {string} fromNode - The id of the source node.
 * @param {string} toNode   - The id of the destination node.
 * @param {string} [condition] - Optional narrative condition for traversing the edge.
 * @returns {{ from: string, to: string, condition: string, id: string }}
 */
export function addBranch(fromNode, toNode, condition = "") {
  if (!fromNode || !toNode) {
    throw new Error("addBranch: both fromNode and toNode ids are required.");
  }

  return {
    id: `edge_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    from: fromNode,
    to: toNode,
    condition,
  };
}

/**
 * Returns a populated copy of a DECISION_TEMPLATES entry by key.
 *
 * @param {string} type - Key matching a DECISION_TEMPLATES entry.
 * @returns {{ type: string, label: string, description: string, options: string[], consequenceHints: string[] } | null}
 */
export function getDecisionTemplate(type) {
  const template = DECISION_TEMPLATES[type];
  if (!template) {
    console.warn(`getDecisionTemplate: no template found for type "${type}".`);
    return null;
  }

  return {
    type,
    ...template,
    options: [...template.options],
    consequenceHints: [...template.consequenceHints],
  };
}

/**
 * Evaluates a list of recorded decisions and returns an aggregated consequence summary.
 *
 * Each decision in the array should be:
 *   { templateType: string, chosenOptionIndex: number }
 *
 * Returns an object mapping each CONSEQUENCE_TYPES key to a numeric weight
 * (-n = negative, 0 = neutral, +n = positive).
 *
 * @param {Array<{ templateType: string, chosenOptionIndex: number }>} decisions
 * @returns {Object.<string, number>}
 */
export function evaluateConsequences(decisions = []) {
  const tally = Object.fromEntries(
    Object.keys(CONSEQUENCE_TYPES).map((key) => [key, 0])
  );

  const consequenceKeyMap = {
    reputationChange:    "reputationChange",
    factionShift:        "factionShift",
    npcRelationshipChange: "npcRelationshipChange",
    resourceGainLoss:    "resourceGainLoss",
    newQuestUnlocked:    "newQuestUnlocked",
    questLocked:         "questLocked",
    worldStateChange:    "worldStateChange",
    partyConflict:       "partyConflict",
  };

  // Simple keyword-based scoring from consequenceHints strings
  const positiveKeywords  = ["gain", "positive", "unlocked", "improve"];
  const negativeKeywords  = ["loss", "negative", "locked", "conflict", "damage"];

  for (const decision of decisions) {
    const template = DECISION_TEMPLATES[decision.templateType];
    if (!template) continue;

    const hintIndex = Math.min(decision.chosenOptionIndex, template.consequenceHints.length - 1);
    const hint = template.consequenceHints[hintIndex] || "";

    const segments = hint.split(",").map((s) => s.trim().toLowerCase());

    for (const segment of segments) {
      for (const [key] of Object.entries(consequenceKeyMap)) {
        // Match readable label words to the key
        const labelWords = CONSEQUENCE_TYPES[key].label.toLowerCase().split(/\W+/);
        const segWords   = segment.split(/\W+/);
        const matches    = labelWords.some((w) => w.length > 2 && segWords.includes(w));

        if (!matches) continue;

        const isPositive = positiveKeywords.some((kw) => segment.includes(kw));
        const isNegative = negativeKeywords.some((kw) => segment.includes(kw));

        if (isPositive) {
          tally[key] += 1;
        } else if (isNegative) {
          tally[key] -= 1;
        } else {
          tally[key] += 1; // presence alone = some activation
        }
      }
    }
  }

  return tally;
}

/**
 * Returns a fully instantiated quest graph (nodes + edges) from a BRANCH_TEMPLATES entry.
 *
 * Node ids are replaced with fresh generated ids, and edges are updated accordingly.
 *
 * @param {string} templateType - Key matching a BRANCH_TEMPLATES entry.
 * @returns {{ templateType: string, label: string, description: string, nodes: Object[], edges: Object[] } | null}
 */
export function getQuestStructure(templateType) {
  const template = BRANCH_TEMPLATES[templateType];
  if (!template) {
    console.warn(`getQuestStructure: no template found for "${templateType}".`);
    return null;
  }

  // Build a map from template id → new node instance
  const idMap = {};
  const nodes = template.nodes.map((n) => {
    const node = createQuestNode(n.type, { label: n.label });
    idMap[n.id] = node.id;
    return node;
  });

  const edges = template.edges.map((e) => ({
    id: `edge_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    from: idMap[e.from],
    to:   idMap[e.to],
    condition: e.condition || "",
  }));

  return {
    templateType,
    label: template.label,
    description: template.description,
    nodes,
    edges,
  };
}

/**
 * Suggests the most appropriate next node type given the current node type
 * and a lightweight quest history context.
 *
 * questHistory is an optional array of node type strings representing the
 * path taken so far (oldest first).
 *
 * Returns an array of { type, reason } suggestions in priority order.
 *
 * @param {string} currentNodeType - Type of the current node (key in NODE_TYPES).
 * @param {string[]} [questHistory=[]] - Ordered list of prior node type strings.
 * @returns {Array<{ type: string, reason: string }>}
 */
export function suggestNextNode(currentNodeType, questHistory = []) {
  const suggestions = [];

  const historySet = new Set(questHistory);
  const historyLength = questHistory.length;

  switch (currentNodeType) {
    case "start":
      suggestions.push(
        { type: "challenge", reason: "Open with an obstacle to establish stakes." },
        { type: "decision",  reason: "Start with an immediate choice for agency." },
        { type: "reveal",    reason: "Hook the party with intriguing information." }
      );
      break;

    case "decision":
      suggestions.push(
        { type: "branch",    reason: "Explicitly fork the graph for each option." },
        { type: "challenge", reason: "Each branch may lead into an obstacle." },
        { type: "consequence", reason: "Immediately show the impact of the decision." }
      );
      break;

    case "challenge":
      suggestions.push(
        { type: "reward",    reason: "Overcoming a challenge should yield something." },
        { type: "reveal",    reason: "A challenge often uncovers hidden information." },
        { type: "decision",  reason: "Success may open a new choice." }
      );
      break;

    case "reveal":
      suggestions.push(
        { type: "decision",  reason: "New information calls for a reaction choice." },
        { type: "consequence", reason: "What the party learns changes the world." },
        { type: "challenge", reason: "The truth may bring new conflict." }
      );
      break;

    case "reward":
      if (historyLength > 4 && !historySet.has("end")) {
        suggestions.push({ type: "end", reason: "The quest has run long — consider wrapping up." });
      }
      suggestions.push(
        { type: "decision",  reason: "A reward can open new avenues." },
        { type: "challenge", reason: "New resources invite new conflict." },
        { type: "merge",     reason: "This may be where parallel threads converge." }
      );
      break;

    case "consequence":
      suggestions.push(
        { type: "reveal",    reason: "Consequences often expose deeper truths." },
        { type: "challenge", reason: "Fallout creates new obstacles." },
        { type: "merge",     reason: "Threads affected by consequences often converge here." }
      );
      break;

    case "branch":
      suggestions.push(
        { type: "challenge", reason: "Each branch path needs its own obstacle." },
        { type: "decision",  reason: "Branches can contain nested decisions." },
        { type: "reveal",    reason: "Diverging paths may uncover different truths." }
      );
      break;

    case "merge":
      suggestions.push(
        { type: "reveal",    reason: "Convergence is a good moment for a major revelation." },
        { type: "challenge", reason: "The merged threads face a shared final obstacle." },
        { type: "end",       reason: "After merging, the quest can conclude." }
      );
      break;

    case "end":
      suggestions.push(
        { type: "start",     reason: "An ending can seed a follow-up quest." },
        { type: "consequence", reason: "Post-ending consequences feed into the broader campaign." }
      );
      break;

    default:
      suggestions.push(
        { type: "challenge", reason: "Default progression — introduce an obstacle." },
        { type: "decision",  reason: "Give the party agency." }
      );
      break;
  }

  return suggestions;
}
