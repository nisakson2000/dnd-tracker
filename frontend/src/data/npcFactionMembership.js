/**
 * @file npcFactionMembership.js
 * @description NPC faction membership display data and helpers.
 *
 * Roadmap items covered:
 *   - #152: NPC faction membership display
 *
 * Exports:
 *   FACTION_RANKS, FACTION_ROLES, FACTION_LOYALTY,
 *   FACTION_INTERACTIONS, MEMBERSHIP_EVENTS
 *
 *   getFactionRank(rankLevel)
 *   getFactionRole(roleId)
 *   getLoyaltyLevel(score)
 *   checkFactionInteraction(npcFactions, pcFactions)
 *   generateMembershipEvent(npc)
 *   getNPCFactionProfile(npc)
 */

// ---------------------------------------------------------------------------
// FACTION_RANKS
// Generic rank structure applicable to any faction.
// ---------------------------------------------------------------------------

/** @type {Object.<number, {label: string, rankLevel: number, privileges: string[], responsibilities: string[], trustLevel: string}>} */
export const FACTION_RANKS = {
  0: {
    label: "Outsider",
    rankLevel: 0,
    privileges: ["No official privileges", "May receive limited public information"],
    responsibilities: ["None"],
    trustLevel: "None — not considered part of the faction",
  },
  1: {
    label: "Sympathizer",
    rankLevel: 1,
    privileges: ["Safe passage through faction-controlled areas", "Access to public faction services"],
    responsibilities: ["Passive support", "Non-disclosure of faction activities witnessed"],
    trustLevel: "Minimal — watched but not vouched for",
  },
  2: {
    label: "Initiate",
    rankLevel: 2,
    privileges: [
      "Access to faction common areas",
      "Introduction to faction contacts",
      "Basic equipment loans",
    ],
    responsibilities: [
      "Attend introductory meetings",
      "Perform minor errands",
      "Prove loyalty through small tasks",
    ],
    trustLevel: "Provisional — on probation, loyalty being evaluated",
  },
  3: {
    label: "Member",
    rankLevel: 3,
    privileges: [
      "Full access to faction facilities",
      "Faction protection and support",
      "Voting rights on minor decisions",
      "Access to faction resources and treasury (limited)",
    ],
    responsibilities: [
      "Complete assigned missions",
      "Recruit sympathizers",
      "Uphold faction values publicly",
      "Report threats to faction officers",
    ],
    trustLevel: "Established — considered a reliable part of the faction",
  },
  4: {
    label: "Trusted Agent",
    rankLevel: 4,
    privileges: [
      "Access to sensitive faction intelligence",
      "Authority to act independently on faction business",
      "Command over initiates and members",
      "Access to faction vault (moderate)",
    ],
    responsibilities: [
      "Lead small operations",
      "Vet new initiates",
      "Maintain faction contacts in assigned region",
      "Handle sensitive negotiations",
    ],
    trustLevel: "High — entrusted with secrets and independent authority",
  },
  5: {
    label: "Officer",
    rankLevel: 5,
    privileges: [
      "Seat on faction council",
      "Full treasury access",
      "Authority to recruit, promote, or expel members below officer rank",
      "Access to all but the most restricted faction secrets",
    ],
    responsibilities: [
      "Oversee a division or territory",
      "Report directly to inner circle",
      "Coordinate large-scale operations",
      "Enforce faction discipline",
    ],
    trustLevel: "Very High — a pillar of faction leadership",
  },
  6: {
    label: "Inner Circle",
    rankLevel: 6,
    privileges: [
      "Knowledge of faction's true goals and origin",
      "Authority over all officers and below",
      "Access to all faction resources",
      "Veto power on major decisions",
    ],
    responsibilities: [
      "Set faction strategy and long-term goals",
      "Guard core faction secrets",
      "Manage officer appointments",
      "Directly advise the leader",
    ],
    trustLevel: "Absolute — the faction's inner sanctum",
  },
  7: {
    label: "Leader",
    rankLevel: 7,
    privileges: [
      "Final authority on all faction decisions",
      "Sole access to the faction's deepest secrets",
      "Control of all faction assets",
      "Represents the faction in highest-level dealings",
    ],
    responsibilities: [
      "Embody the faction's ideology",
      "Bear ultimate responsibility for faction actions",
      "Maintain unity and vision",
      "Protect the faction's existence",
    ],
    trustLevel: "Total — the faction's living will",
  },
};

// ---------------------------------------------------------------------------
// FACTION_ROLES
// Common roles an NPC can hold within a faction, independent of rank.
// ---------------------------------------------------------------------------

/** @type {Object.<string, {label: string, description: string, typicalSkills: string[], factionTypes: string[]}>} */
export const FACTION_ROLES = {
  spy: {
    label: "Spy",
    description:
      "Gathers intelligence on enemies and neutrals, often operating undercover in rival organizations or among the general populace.",
    typicalSkills: ["Deception", "Stealth", "Insight", "Disguise Kit", "Forgery Kit"],
    factionTypes: ["thieves guild", "assassins guild", "military", "noble house", "cult", "intelligence agency"],
  },
  enforcer: {
    label: "Enforcer",
    description:
      "Carries out the faction's will through intimidation or violence. Ensures members and outsiders comply with faction demands.",
    typicalSkills: ["Intimidation", "Athletics", "Perception", "Weapons proficiency"],
    factionTypes: ["thieves guild", "crime syndicate", "military", "mercenary company", "cult"],
  },
  diplomat: {
    label: "Diplomat",
    description:
      "Represents the faction in negotiations, alliances, and official dealings. Skilled in navigating political and social tensions.",
    typicalSkills: ["Persuasion", "Insight", "History", "Performance", "Deception"],
    factionTypes: ["noble house", "merchant guild", "religious order", "military", "adventurers guild"],
  },
  recruiter: {
    label: "Recruiter",
    description:
      "Identifies and brings in new members. Evaluates potential sympathizers and oversees the initial vetting of initiates.",
    typicalSkills: ["Persuasion", "Insight", "Deception", "Investigation"],
    factionTypes: ["cult", "adventurers guild", "military", "thieves guild", "religious order", "merchant guild"],
  },
  treasurer: {
    label: "Treasurer",
    description:
      "Manages the faction's finances, assets, and resource allocation. Tracks income, expenses, and bribes.",
    typicalSkills: ["Investigation", "History", "Insight", "Persuasion", "Thieves Tools (lock management)"],
    factionTypes: ["merchant guild", "thieves guild", "noble house", "religious order", "adventurers guild"],
  },
  lorekeeper: {
    label: "Lorekeeper",
    description:
      "Maintains the faction's records, history, and accumulated knowledge. Often the keeper of secrets and ancient traditions.",
    typicalSkills: ["History", "Arcana", "Religion", "Investigation", "Calligrapher's Supplies"],
    factionTypes: ["religious order", "arcane guild", "noble house", "druidic circle", "adventurers guild"],
  },
  commander: {
    label: "Commander",
    description:
      "Leads troops or operatives in the field. Plans and executes tactical operations on behalf of the faction.",
    typicalSkills: ["Athletics", "Intimidation", "Perception", "Insight", "Weapons proficiency"],
    factionTypes: ["military", "mercenary company", "resistance movement", "thieves guild", "cult"],
  },
  assassin: {
    label: "Assassin",
    description:
      "Eliminates targets designated by faction leadership. Operates with extreme discretion and rarely acknowledged openly.",
    typicalSkills: ["Stealth", "Deception", "Acrobatics", "Poisoner's Kit", "Disguise Kit"],
    factionTypes: ["assassins guild", "thieves guild", "cult", "noble house", "military (covert ops)"],
  },
  healer: {
    label: "Healer",
    description:
      "Provides medical, magical, or alchemical care to faction members. Also manages morale and recovery after operations.",
    typicalSkills: ["Medicine", "Nature", "Religion", "Herbalism Kit", "Alchemist's Supplies"],
    factionTypes: ["religious order", "adventurers guild", "military", "druidic circle", "mercenary company"],
  },
  quartermaster: {
    label: "Quartermaster",
    description:
      "Oversees the faction's supply chains, equipment stores, and logistical needs. Ensures operatives are equipped for their missions.",
    typicalSkills: ["Investigation", "Athletics", "Persuasion", "Cartographer's Tools"],
    factionTypes: ["military", "mercenary company", "adventurers guild", "merchant guild", "thieves guild"],
  },
  scout: {
    label: "Scout",
    description:
      "Reconnoiters terrain, enemy positions, and points of interest ahead of larger faction operations.",
    typicalSkills: ["Perception", "Stealth", "Survival", "Nature", "Athletics"],
    factionTypes: ["military", "mercenary company", "resistance movement", "adventurers guild", "rangers guild"],
  },
  advisor: {
    label: "Advisor",
    description:
      "Counsels faction leadership on strategic, arcane, divine, or political matters. Rarely acts directly but wields great influence.",
    typicalSkills: ["History", "Arcana", "Religion", "Insight", "Persuasion"],
    factionTypes: ["noble house", "religious order", "arcane guild", "military", "cult"],
  },
};

// ---------------------------------------------------------------------------
// FACTION_LOYALTY
// Loyalty score system describing an NPC's commitment to their faction.
// ---------------------------------------------------------------------------

/** @type {Array<{label: string, minScore: number, maxScore: number, behaviorDescription: string, betrayalRisk: number, persuasionDC: number}>} */
export const FACTION_LOYALTY = [
  {
    label: "Traitorous",
    minScore: -5,
    maxScore: -3,
    behaviorDescription:
      "Actively works against the faction from within. Will sell secrets, sabotage operations, and alert enemies given the opportunity.",
    betrayalRisk: 90,
    persuasionDC: 5,
  },
  {
    label: "Disloyal",
    minScore: -2,
    maxScore: -1,
    behaviorDescription:
      "Has serious doubts about the faction's goals or leadership. Will prioritize self-preservation over faction interests and may withhold effort.",
    betrayalRisk: 50,
    persuasionDC: 12,
  },
  {
    label: "Neutral",
    minScore: 0,
    maxScore: 0,
    behaviorDescription:
      "Performs assigned duties competently but without personal investment. Will not take unordered risks for the faction.",
    betrayalRisk: 20,
    persuasionDC: 18,
  },
  {
    label: "Loyal",
    minScore: 1,
    maxScore: 2,
    behaviorDescription:
      "Genuinely committed to the faction. Will follow orders without excessive questioning and will defend faction interests proactively.",
    betrayalRisk: 8,
    persuasionDC: 22,
  },
  {
    label: "Devoted",
    minScore: 3,
    maxScore: 4,
    behaviorDescription:
      "Places the faction's wellbeing above personal comfort. Will accept significant personal risk and sacrifice for the faction's success.",
    betrayalRisk: 2,
    persuasionDC: 27,
  },
  {
    label: "Fanatic",
    minScore: 5,
    maxScore: 5,
    behaviorDescription:
      "The faction is this NPC's entire identity and purpose. Will die for the cause without hesitation and views betrayal as unthinkable.",
    betrayalRisk: 0,
    persuasionDC: 35,
  },
];

// ---------------------------------------------------------------------------
// FACTION_INTERACTIONS
// How NPC faction membership affects interactions with PCs.
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} FactionInteractionEntry
 * @property {string} label
 * @property {string} description
 * @property {number} socialCheckModifier - Bonus/penalty applied to relevant social checks
 * @property {string[]} affectedChecks - Skills or checks modified
 * @property {string} notes
 */

/** @type {Object.<string, FactionInteractionEntry>} */
export const FACTION_INTERACTIONS = {
  allied: {
    label: "Allied Faction",
    description:
      "The NPC's faction and the PC's faction share alliance, common cause, or mutual defense pact.",
    socialCheckModifier: +4,
    affectedChecks: ["Persuasion", "Deception", "Intimidation", "Insight"],
    notes:
      "PCs may invoke the alliance for favors, safe passage, or information. The NPC is predisposed to trust and assist.",
  },
  rival: {
    label: "Rival Faction",
    description:
      "The NPC's faction and the PC's faction are competitors, enemies, or have a history of open conflict.",
    socialCheckModifier: -4,
    affectedChecks: ["Persuasion", "Deception", "Performance"],
    notes:
      "The NPC begins hostile or deeply suspicious. PCs must overcome faction bias before achieving meaningful cooperation.",
  },
  neutral: {
    label: "Neutral Faction",
    description:
      "No significant relationship exists between the NPC's faction and the PC's faction. Neither allied nor rival.",
    socialCheckModifier: 0,
    affectedChecks: [],
    notes:
      "Standard social rules apply. Faction membership is not a factor in determining the NPC's disposition.",
  },
  secret: {
    label: "Secret Membership",
    description:
      "The NPC is a member of a faction that the PCs do not know about, or the NPC is operating undercover.",
    socialCheckModifier: 0,
    affectedChecks: [],
    notes:
      "The NPC must make Deception checks (DC set by DM) to conceal membership if PCs become suspicious. " +
      "PCs may use Insight or Investigation to detect the hidden affiliation. " +
      "If discovered, the interaction type shifts to reflect the true faction relationship.",
  },
  unknown: {
    label: "Unknown Faction",
    description:
      "The NPC belongs to a faction the PCs have never encountered or have no information about.",
    socialCheckModifier: 0,
    affectedChecks: [],
    notes:
      "Faction symbols or behaviors may be detected with a History or Investigation check (DC 15). " +
      "Until identified, treat as neutral for interaction purposes.",
  },
};

// ---------------------------------------------------------------------------
// MEMBERSHIP_EVENTS
// Events that can change an NPC's faction standing.
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} MembershipEvent
 * @property {string} id
 * @property {string} label
 * @property {string} description
 * @property {number} standingChange - Positive raises rank/loyalty, negative lowers it
 * @property {string[]} possibleConsequences
 */

/** @type {MembershipEvent[]} */
export const MEMBERSHIP_EVENTS = [
  {
    id: "promoted",
    label: "Promoted",
    description:
      "The NPC has distinguished themselves and been elevated to a higher rank within the faction.",
    standingChange: +1,
    possibleConsequences: [
      "Increased responsibilities and visibility",
      "Jealousy from passed-over peers",
      "Access to new faction secrets",
      "Higher-value targets for enemies",
    ],
  },
  {
    id: "demoted",
    label: "Demoted",
    description:
      "The NPC failed or displeased leadership and has been reduced in rank, losing privileges and authority.",
    standingChange: -1,
    possibleConsequences: [
      "Loss of access to sensitive information",
      "Strained relationships with former peers",
      "Increased scrutiny from superiors",
      "Possible loyalty drop toward faction",
    ],
  },
  {
    id: "expelled",
    label: "Expelled",
    description:
      "The NPC has been formally cast out of the faction. May have been a public shaming or a quiet removal.",
    standingChange: -3,
    possibleConsequences: [
      "NPC is now a potential source of faction intelligence for enemies",
      "Faction may send enforcers if NPC knows too much",
      "NPC loses all faction protections and contacts",
      "Possible vendetta against those who expelled them",
    ],
  },
  {
    id: "recruited",
    label: "Recruited",
    description:
      "The NPC has recently joined the faction, beginning as a Sympathizer or Initiate.",
    standingChange: +1,
    possibleConsequences: [
      "NPC is eager to prove themselves",
      "Still establishing trust — may be tested",
      "Old ties to previous groups may cause conflict",
      "Potentially being used as a pawn by those who recruited them",
    ],
  },
  {
    id: "went_undercover",
    label: "Went Undercover",
    description:
      "The NPC has been assigned to infiltrate a rival group. Their true faction affiliation is actively concealed.",
    standingChange: 0,
    possibleConsequences: [
      "Dual identity creates psychological strain",
      "Risk of exposure at any time",
      "May develop genuine loyalty to the infiltrated group",
      "Handler relationship is critical to maintaining cover",
    ],
  },
  {
    id: "defected",
    label: "Defected",
    description:
      "The NPC has abandoned their faction and joined a rival or enemy organization.",
    standingChange: -4,
    possibleConsequences: [
      "Hunted by former faction",
      "Valuable intelligence asset for new faction",
      "Trust issues with new faction until proven",
      "Family or friends in old faction now at risk",
    ],
  },
  {
    id: "went_rogue",
    label: "Went Rogue",
    description:
      "The NPC has broken from the faction entirely and now operates independently, following no one's orders.",
    standingChange: -2,
    possibleConsequences: [
      "Unpredictable motivations and alliances",
      "Former faction views them as a loose end",
      "May still use old faction contacts covertly",
      "Freedom from faction politics but also its protection",
    ],
  },
  {
    id: "retired",
    label: "Retired",
    description:
      "The NPC has stepped back from active faction duties, whether by choice or arrangement. Retains some standing but is no longer operational.",
    standingChange: 0,
    possibleConsequences: [
      "Still holds old connections and knowledge",
      "May be called back in times of crisis",
      "Generally left alone by faction if exit was clean",
      "A target for enemies who want to leverage old secrets",
    ],
  },
  {
    id: "martyred",
    label: "Martyred",
    description:
      "The NPC died for the faction's cause, whether by enemy action, sacrifice, or execution while in service.",
    standingChange: 0,
    possibleConsequences: [
      "Posthumous elevation of status within faction legend",
      "Surviving allies may carry strong loyalty or grief",
      "The NPC's death may fuel faction recruits",
      "Enemies who caused the death become symbolic targets",
    ],
  },
  {
    id: "betrayed",
    label: "Betrayed",
    description:
      "The NPC was betrayed by the faction or a key member within it — left behind, sold out, or falsely accused.",
    standingChange: -5,
    possibleConsequences: [
      "Deep personal animosity toward former allies",
      "Possible alliance with faction's enemies out of revenge",
      "Loss of trust in institutions generally",
      "May hold damaging secrets as leverage",
    ],
  },
];

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Returns the rank entry for a given rank level (0–7).
 * Returns the Outsider rank if the level is out of bounds.
 *
 * @param {number} rankLevel
 * @returns {{ label: string, rankLevel: number, privileges: string[], responsibilities: string[], trustLevel: string }}
 */
export function getFactionRank(rankLevel) {
  const clamped = Math.max(0, Math.min(7, Math.round(rankLevel)));
  return FACTION_RANKS[clamped] ?? FACTION_RANKS[0];
}

/**
 * Returns the role entry for the given role id, or null if not found.
 *
 * @param {string} roleId
 * @returns {{ label: string, description: string, typicalSkills: string[], factionTypes: string[] } | null}
 */
export function getFactionRole(roleId) {
  return FACTION_ROLES[roleId] ?? null;
}

/**
 * Returns the loyalty level entry matching the given numeric score.
 * Clamps input to the range [-5, 5].
 *
 * @param {number} score
 * @returns {{ label: string, minScore: number, maxScore: number, behaviorDescription: string, betrayalRisk: number, persuasionDC: number }}
 */
export function getLoyaltyLevel(score) {
  const clamped = Math.max(-5, Math.min(5, Math.round(score)));
  return (
    FACTION_LOYALTY.find(
      (entry) => clamped >= entry.minScore && clamped <= entry.maxScore
    ) ?? FACTION_LOYALTY[2] // fallback: Neutral
  );
}

/**
 * Determines the interaction type and social check modifier between an NPC and a PC
 * based on their faction memberships.
 *
 * @param {string[]} npcFactions - Array of faction ids the NPC belongs to
 * @param {string[]} pcFactions  - Array of faction ids the PC belongs to
 * @param {{ alliances?: string[][], rivalries?: string[][], secrets?: string[] }} [factionRelationships]
 *   Optional map of alliance pairs, rivalry pairs, and ids of secret factions.
 * @returns {{ interactionType: string, modifier: number, entry: FactionInteractionEntry }}
 */
export function checkFactionInteraction(npcFactions, pcFactions, factionRelationships = {}) {
  const { alliances = [], rivalries = [], secrets = [] } = factionRelationships;

  // Check if any NPC faction is secret
  const hasSecret = npcFactions.some((f) => secrets.includes(f));
  if (hasSecret) {
    return {
      interactionType: "secret",
      modifier: FACTION_INTERACTIONS.secret.socialCheckModifier,
      entry: FACTION_INTERACTIONS.secret,
    };
  }

  // Check for alliance between any NPC faction and any PC faction
  const isAllied = alliances.some(
    ([a, b]) =>
      (npcFactions.includes(a) && pcFactions.includes(b)) ||
      (npcFactions.includes(b) && pcFactions.includes(a))
  );
  if (isAllied) {
    return {
      interactionType: "allied",
      modifier: FACTION_INTERACTIONS.allied.socialCheckModifier,
      entry: FACTION_INTERACTIONS.allied,
    };
  }

  // Check for rivalry between any NPC faction and any PC faction
  const isRival = rivalries.some(
    ([a, b]) =>
      (npcFactions.includes(a) && pcFactions.includes(b)) ||
      (npcFactions.includes(b) && pcFactions.includes(a))
  );
  if (isRival) {
    return {
      interactionType: "rival",
      modifier: FACTION_INTERACTIONS.rival.socialCheckModifier,
      entry: FACTION_INTERACTIONS.rival,
    };
  }

  // Check for shared faction (same faction = allied by default)
  const hasShared = npcFactions.some((f) => pcFactions.includes(f));
  if (hasShared) {
    return {
      interactionType: "allied",
      modifier: FACTION_INTERACTIONS.allied.socialCheckModifier,
      entry: FACTION_INTERACTIONS.allied,
    };
  }

  // Default: neutral
  return {
    interactionType: "neutral",
    modifier: FACTION_INTERACTIONS.neutral.socialCheckModifier,
    entry: FACTION_INTERACTIONS.neutral,
  };
}

/**
 * Generates a random membership event for an NPC and returns the event entry.
 * If the NPC has a `factionHistory` array, the event is appended to it.
 *
 * @param {{ name?: string, factionHistory?: MembershipEvent[] }} npc
 * @returns {MembershipEvent}
 */
export function generateMembershipEvent(npc) {
  const event = MEMBERSHIP_EVENTS[Math.floor(Math.random() * MEMBERSHIP_EVENTS.length)];
  if (npc && Array.isArray(npc.factionHistory)) {
    npc.factionHistory.push({ ...event, timestamp: Date.now() });
  }
  return event;
}

/**
 * Builds a comprehensive faction profile summary for an NPC.
 * The NPC object is expected to have (all optional with fallbacks):
 *   - factions: string[]         — faction ids
 *   - rankLevel: number          — 0–7
 *   - roleId: string             — role id
 *   - loyaltyScore: number       — -5 to 5
 *   - factionHistory: MembershipEvent[]
 *
 * @param {{ factions?: string[], rankLevel?: number, roleId?: string, loyaltyScore?: number, factionHistory?: MembershipEvent[], name?: string }} npc
 * @returns {{
 *   factions: string[],
 *   rank: ReturnType<typeof getFactionRank>,
 *   role: ReturnType<typeof getFactionRole>,
 *   loyalty: ReturnType<typeof getLoyaltyLevel>,
 *   recentEvent: MembershipEvent | null,
 *   summary: string
 * }}
 */
export function getNPCFactionProfile(npc) {
  const factions = npc?.factions ?? [];
  const rank = getFactionRank(npc?.rankLevel ?? 3);
  const role = getFactionRole(npc?.roleId ?? "");
  const loyalty = getLoyaltyLevel(npc?.loyaltyScore ?? 0);
  const history = npc?.factionHistory ?? [];
  const recentEvent = history.length > 0 ? history[history.length - 1] : null;

  const npcName = npc?.name ?? "This NPC";
  const factionList = factions.length > 0 ? factions.join(", ") : "no known faction";
  const roleLine = role ? ` serving as ${role.label}` : "";
  const summary =
    `${npcName} belongs to ${factionList}${roleLine}. ` +
    `Rank: ${rank.label} (Level ${rank.rankLevel}). ` +
    `Loyalty: ${loyalty.label} (betrayal risk ${loyalty.betrayalRisk}%, persuasion DC ${loyalty.persuasionDC}). ` +
    (recentEvent ? `Most recent event: ${recentEvent.label}.` : "No recorded membership events.");

  return { factions, rank, role, loyalty, recentEvent, summary };
}
