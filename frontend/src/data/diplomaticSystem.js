/**
 * @file diplomaticSystem.js
 * @description Faction diplomacy, treaties, and political systems for The Codex D&D Companion.
 * Covers roadmap items related to diplomatic stances, treaty frameworks, political events,
 * and faction need-driven behavior.
 * @module diplomaticSystem
 */

// ---------------------------------------------------------------------------
// DIPLOMATIC_STANCES
// 7 stances from War to Allied, each describing trade, border, military, espionage
// behavior and the DC required to shift the stance one step.
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} DiplomaticStance
 * @property {string} id - Unique identifier
 * @property {string} label - Display name
 * @property {number} tier - Numeric tier (1 = War, 7 = Allied)
 * @property {string} description - Narrative summary
 * @property {number} tradeModifier - Multiplier applied to trade values (0 = none, 1 = normal, >1 = bonus)
 * @property {string} borderPolicy - How the faction treats border crossings
 * @property {string} militaryPosture - Stance of armed forces toward the other faction
 * @property {string} espionageLevel - Intensity of intelligence operations
 * @property {number} shiftDC - Persuasion / Diplomacy DC to shift one step toward Allied
 */

export const DIPLOMATIC_STANCES = {
  WAR: {
    id: "WAR",
    label: "War",
    tier: 1,
    description:
      "Open armed conflict. All diplomatic channels are severed, borders are militarized, and trade is banned.",
    tradeModifier: 0,
    borderPolicy: "Closed — hostile forces turned back or captured on sight",
    militaryPosture: "Full offensive operations authorized",
    espionageLevel: "Maximum — deep-cover agents, saboteurs, assassins",
    shiftDC: 25,
  },
  HOSTILE: {
    id: "HOSTILE",
    label: "Hostile",
    tier: 2,
    description:
      "Active antagonism short of declared war. Skirmishes occur, diplomats are expelled, trade embargoes may be in place.",
    tradeModifier: 0.25,
    borderPolicy: "Heavily restricted — merchants require special permits",
    militaryPosture: "Defensive readiness with authorized border incursions",
    espionageLevel: "High — active intelligence gathering and subversion",
    shiftDC: 22,
  },
  COLD: {
    id: "COLD",
    label: "Cold",
    tier: 3,
    description:
      "Tense stalemate. No open fighting, but deep mutual distrust. Limited diplomatic contact, restricted trade.",
    tradeModifier: 0.5,
    borderPolicy: "Restricted — controlled checkpoints, heavy inspection",
    militaryPosture: "Heightened alert; no offensive operations",
    espionageLevel: "Moderate — surveillance and counter-intelligence focus",
    shiftDC: 18,
  },
  NEUTRAL: {
    id: "NEUTRAL",
    label: "Neutral",
    tier: 4,
    description:
      "Neither allied nor antagonistic. Standard diplomatic relations and normal trade, but no obligations of aid.",
    tradeModifier: 1.0,
    borderPolicy: "Open — standard customs and travel documentation",
    militaryPosture: "Peacetime footing; border patrols only",
    espionageLevel: "Low — routine intelligence only",
    shiftDC: 14,
  },
  CORDIAL: {
    id: "CORDIAL",
    label: "Cordial",
    tier: 5,
    description:
      "Positive, cooperative relations. Preferential trade terms, shared information, and goodwill gestures.",
    tradeModifier: 1.25,
    borderPolicy: "Relaxed — expedited crossing for known merchants and envoys",
    militaryPosture: "Non-threatening; joint patrols may be proposed",
    espionageLevel: "Minimal — passive monitoring only",
    shiftDC: 12,
  },
  FRIENDLY: {
    id: "FRIENDLY",
    label: "Friendly",
    tier: 6,
    description:
      "Strong positive bond. Favored trade status, cultural exchange, and willingness to offer limited military aid.",
    tradeModifier: 1.5,
    borderPolicy: "Open borders for citizens; minimal documentation",
    militaryPosture: "Cooperative; willing to share intelligence and logistics",
    espionageLevel: "None — active counter-espionage against mutual threats",
    shiftDC: 10,
  },
  ALLIED: {
    id: "ALLIED",
    label: "Allied",
    tier: 7,
    description:
      "Full partnership. Mutual defense obligations, shared resources, and unified foreign policy on key issues.",
    tradeModifier: 2.0,
    borderPolicy: "Fully open — treated as internal movement",
    militaryPosture: "Unified command possible; full mutual defense active",
    espionageLevel: "None — full intelligence sharing",
    shiftDC: null, // Maximum stance; cannot shift further toward Allied
  },
};

// ---------------------------------------------------------------------------
// TREATY_TYPES
// 8 formal agreements factions can enter, each with benefits, obligations,
// typical duration, and consequences for violation.
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} TreatyType
 * @property {string} id - Unique identifier
 * @property {string} label - Display name
 * @property {string} description - What the treaty covers
 * @property {string[]} benefits - What each signing party gains
 * @property {string[]} obligations - What each signing party must do / not do
 * @property {string} duration - Typical length or renewal terms
 * @property {string[]} violationConsequences - Mechanical and narrative fallout for breaking the treaty
 */

export const TREATY_TYPES = {
  NON_AGGRESSION: {
    id: "NON_AGGRESSION",
    label: "Non-Aggression Pact",
    description:
      "Both parties agree to cease hostilities and refrain from initiating armed conflict.",
    benefits: [
      "Ceases active war state",
      "Allows limited trade resumption",
      "Frees military resources for other fronts",
    ],
    obligations: [
      "No offensive military operations against signatory",
      "Recall troops from contested border regions",
      "Agree to mediation before escalating disputes",
    ],
    duration: "1–5 years; renewable by mutual consent",
    violationConsequences: [
      "Stance immediately drops to War",
      "All other treaties with signatory are void",
      "Third-party factions may impose sanctions on the violator",
      "-4 penalty to all future Diplomacy checks with this faction",
    ],
  },
  TRADE_AGREEMENT: {
    id: "TRADE_AGREEMENT",
    label: "Trade Agreement",
    description:
      "Establishes preferential or normalized trade terms between two factions.",
    benefits: [
      "Trade modifier increased by 0.5",
      "Access to faction-exclusive goods",
      "Reduced tariffs and smuggling penalties",
    ],
    obligations: [
      "Maintain agreed tariff rates",
      "Protect merchants from the other faction",
      "Report known trade route threats",
    ],
    duration: "2 years; auto-renewable unless cancelled with 30-day notice",
    violationConsequences: [
      "Stance drops one step",
      "Trade modifier returns to base",
      "Reparation payments may be demanded",
    ],
  },
  MILITARY_ALLIANCE: {
    id: "MILITARY_ALLIANCE",
    label: "Military Alliance",
    description:
      "A formal agreement to coordinate military operations, share intelligence, and support each other in offensive campaigns.",
    benefits: [
      "Joint military operations permitted",
      "Shared intelligence and scouting",
      "Combined troop deployments",
      "Access to allied fortifications",
    ],
    obligations: [
      "Contribute troops or resources to alliance campaigns",
      "Share military intelligence",
      "Avoid separate peace without alliance consent",
    ],
    duration: "Duration of a defined campaign or 3 years",
    violationConsequences: [
      "Stance drops two steps",
      "Military alliance is void",
      "Reputation loss with all factions aware of the betrayal (DC 18 History to know)",
    ],
  },
  MUTUAL_DEFENSE: {
    id: "MUTUAL_DEFENSE",
    label: "Mutual Defense Pact",
    description:
      "Each signatory pledges to come to the other's defense if attacked by a third party.",
    benefits: [
      "Guaranteed military aid if attacked",
      "Deters aggression from third parties",
      "Strengthens internal stability",
    ],
    obligations: [
      "Mobilize within agreed timeframe when ally is attacked",
      "Cannot be the aggressor in a conflict that triggers the pact",
      "Maintain minimum force levels",
    ],
    duration: "Indefinite; reviewed every 5 years",
    violationConsequences: [
      "Stance drops two steps",
      "Violating faction seen as unreliable — all alliance proposals face DC +4",
      "Victim faction may seek war reparations",
    ],
  },
  VASSAL_TRIBUTE: {
    id: "VASSAL_TRIBUTE",
    label: "Vassal / Tribute Arrangement",
    description:
      "A weaker faction pledges loyalty and tribute to a dominant faction in exchange for protection.",
    benefits: {
      liege: [
        "Regular tribute in gold, goods, or levies",
        "Political influence over vassal's external affairs",
        "Access to vassal territory",
      ],
      vassal: [
        "Military protection",
        "Trade access to liege's network",
        "Legitimacy backed by liege's authority",
      ],
    },
    obligations: {
      liege: ["Defend vassal if attacked", "Not demand more than agreed tribute"],
      vassal: [
        "Pay tribute on schedule",
        "Defer to liege on declared foreign policy matters",
        "Provide troops when called upon",
      ],
    },
    duration: "Until renegotiated or vassal successfully declares independence",
    violationConsequences: [
      "Liege violation: Vassal may openly rebel; stance drops to Hostile",
      "Vassal violation: Liege may declare war; tribute doubled as penalty",
    ],
  },
  MARRIAGE_ALLIANCE: {
    id: "MARRIAGE_ALLIANCE",
    label: "Marriage Alliance",
    description:
      "A dynastic union through marriage that ties the factions' ruling families together.",
    benefits: [
      "Stance immediately rises one step",
      "Inheritance claim to ally's leadership if line fails",
      "Improved public perception between faction populations",
      "+2 to all Persuasion checks between the two factions permanently",
    ],
    obligations: [
      "Treat the married individual with honor",
      "Honor succession rights as agreed",
      "Consult the other faction before major political decisions",
    ],
    duration: "Lifetime of the married parties; may be renewed through children",
    violationConsequences: [
      "Divorce or mistreatment of spouse: Stance drops two steps",
      "Assassination of spouse: Immediate War stance",
      "Renouncing the alliance: -3 to Persuasion with all factions for 1 year",
    ],
  },
  KNOWLEDGE_SHARING: {
    id: "KNOWLEDGE_SHARING",
    label: "Knowledge-Sharing Accord",
    description:
      "An agreement to exchange magical research, scholarly works, maps, or technical expertise.",
    benefits: [
      "Access to the other faction's spell lists or craft schematics",
      "+2 to Arcana / History checks related to the other faction's domain",
      "Shared maps of agreed territories",
    ],
    obligations: [
      "Provide agreed knowledge at scheduled intervals",
      "Not weaponize shared knowledge against the partner",
      "Maintain a secure archive of exchanged materials",
    ],
    duration: "2 years; renewable",
    violationConsequences: [
      "Stance drops one step",
      "Shared knowledge may be revoked",
      "Faction may pursue legal or magical means to recover stolen knowledge",
    ],
  },
  RESOURCE_SHARING: {
    id: "RESOURCE_SHARING",
    label: "Resource-Sharing Compact",
    description:
      "An agreement to pool or exchange specific natural, magical, or economic resources.",
    benefits: [
      "Access to resources unavailable in home territory",
      "Reduced scarcity penalties during campaigns",
      "Joint development rights to agreed extraction sites",
    ],
    obligations: [
      "Deliver agreed resource quantities on schedule",
      "Maintain and protect shared extraction sites",
      "Not sell agreed-upon resources to hostile factions",
    ],
    duration: "Annual, tied to harvest or extraction cycles",
    violationConsequences: [
      "Stance drops one step",
      "Partner may seize extraction sites as reparations",
      "Trade modifier reduced by 0.5 until reparations paid",
    ],
  },
};

// ---------------------------------------------------------------------------
// DIPLOMATIC_ACTIONS
// 10 player-facing or NPC-driven diplomatic actions, each with costs,
// timeframe, required skill check, and success/failure outcomes.
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} DiplomaticAction
 * @property {string} id - Unique identifier
 * @property {string} label - Display name
 * @property {string} description - What the action does
 * @property {Object} cost - Gold, time, and political capital cost
 * @property {string} timeRequired - How long the action takes in-world
 * @property {Object} skillCheck - Skill, ability, and base DC
 * @property {Object} outcomes - Success, partial, and failure results
 */

export const DIPLOMATIC_ACTIONS = {
  SEND_ENVOY: {
    id: "SEND_ENVOY",
    label: "Send Envoy",
    description:
      "Dispatch a diplomatic representative to open or maintain a communication channel with another faction.",
    cost: { gold: 50, days: 3, politicalCapital: 1 },
    timeRequired: "3–7 days travel plus negotiations",
    skillCheck: { skill: "Persuasion", ability: "CHA", baseDC: 12 },
    outcomes: {
      success: "Communication channel established; stance improves by 1 on next Persuasion check",
      partial: "Envoy received but no immediate change; re-attempt possible in 14 days",
      failure: "Envoy turned away; stance drops 1 step; cannot send envoy for 30 days",
    },
  },
  PROPOSE_TREATY: {
    id: "PROPOSE_TREATY",
    label: "Propose Treaty",
    description: "Formally offer a treaty of a chosen type to another faction.",
    cost: { gold: 100, days: 7, politicalCapital: 2 },
    timeRequired: "1–4 weeks of negotiations",
    skillCheck: { skill: "Persuasion", ability: "CHA", baseDC: 15 },
    outcomes: {
      success: "Treaty accepted; apply treaty benefits immediately",
      partial: "Counter-offer made; re-negotiate at DC 12 or reject",
      failure: "Treaty rejected; no stance change unless failure is by 5+, in which case stance drops 1",
    },
  },
  DECLARE_WAR: {
    id: "DECLARE_WAR",
    label: "Declare War",
    description: "Issue a formal declaration of war against a faction.",
    cost: { gold: 0, days: 1, politicalCapital: 5 },
    timeRequired: "Immediate; takes effect at next dawn",
    skillCheck: null,
    outcomes: {
      success: "Stance set to War; all treaties with target void; third-party reactions vary",
      partial: null,
      failure: null,
    },
  },
  IMPOSE_SANCTIONS: {
    id: "IMPOSE_SANCTIONS",
    label: "Impose Sanctions",
    description:
      "Cut off or restrict trade with a faction as economic and political pressure.",
    cost: { gold: 0, days: 1, politicalCapital: 2 },
    timeRequired: "Takes effect within 7 days as merchants are turned back",
    skillCheck: { skill: "Insight", ability: "WIS", baseDC: 13 },
    outcomes: {
      success:
        "Target faction's trade modifier halved; they must make a DC 14 Wisdom check or approach to negotiate",
      partial: "Trade reduced but target faction finds alternative suppliers; limited economic impact",
      failure: "Sanctions cause blowback; your faction's trade also suffers (-0.25 modifier)",
    },
  },
  OFFER_TRIBUTE: {
    id: "OFFER_TRIBUTE",
    label: "Offer Tribute",
    description:
      "Present gold, goods, or concessions to improve relations or appease a hostile faction.",
    cost: { gold: 500, days: 1, politicalCapital: 3 },
    timeRequired: "Immediate effect upon delivery",
    skillCheck: { skill: "Persuasion", ability: "CHA", baseDC: 10 },
    outcomes: {
      success: "Stance improves 1 step; target faction is satisfied",
      partial: "Stance holds; faction acknowledges gesture but wants more",
      failure: "Faction views tribute as weakness; -2 to next Persuasion check with them",
    },
  },
  REQUEST_AID: {
    id: "REQUEST_AID",
    label: "Request Aid",
    description:
      "Ask an allied or friendly faction to provide military, economic, or magical assistance.",
    cost: { gold: 0, days: 2, politicalCapital: 2 },
    timeRequired: "Response arrives in 3–10 days",
    skillCheck: { skill: "Persuasion", ability: "CHA", baseDC: 14 },
    outcomes: {
      success: "Aid granted; faction sends agreed resources, troops, or expertise",
      partial: "Partial aid offered; faction provides half the requested support",
      failure: "Aid denied; no stance change unless failed by 5+, which drops stance 1 step",
    },
  },
  FORGE_ALLIANCE: {
    id: "FORGE_ALLIANCE",
    label: "Forge Alliance",
    description:
      "Conduct intensive diplomatic work to elevate a relationship to Allied status.",
    cost: { gold: 300, days: 14, politicalCapital: 4 },
    timeRequired: "2–6 weeks of sustained diplomacy",
    skillCheck: { skill: "Persuasion", ability: "CHA", baseDC: 18 },
    outcomes: {
      success: "Stance set to Allied; Mutual Defense Pact offered automatically",
      partial: "Stance rises to Friendly; alliance can be retried after 30 days",
      failure: "Stance unchanged; political capital lost; retry costs doubled for 60 days",
    },
  },
  ESPIONAGE: {
    id: "ESPIONAGE",
    label: "Espionage",
    description:
      "Send agents to gather intelligence on a faction's plans, resources, or alliances.",
    cost: { gold: 200, days: 7, politicalCapital: 1 },
    timeRequired: "1–3 weeks; risk ongoing until agents return",
    skillCheck: { skill: "Stealth", ability: "DEX", baseDC: 15 },
    outcomes: {
      success: "Gain one faction secret (military strength, treasury level, or pending action)",
      partial: "Partial intelligence; gain vague information, 50% accuracy",
      failure: "Agents captured; stance drops 1 step; captured agents may reveal your secrets",
    },
  },
  SABOTAGE: {
    id: "SABOTAGE",
    label: "Sabotage",
    description:
      "Covertly damage a faction's infrastructure, supply lines, or leadership.",
    cost: { gold: 400, days: 10, politicalCapital: 2 },
    timeRequired: "1–4 weeks; risk ongoing",
    skillCheck: { skill: "Stealth", ability: "DEX", baseDC: 17 },
    outcomes: {
      success:
        "Target faction's military strength or trade modifier reduced by 25% for 30 days",
      partial: "Minor disruption; 10% reduction for 7 days",
      failure:
        "Operation traced back; stance drops 2 steps; may trigger declaration of war",
    },
  },
  HOST_SUMMIT: {
    id: "HOST_SUMMIT",
    label: "Host Summit",
    description:
      "Organize a multi-faction diplomatic summit to resolve disputes, forge alliances, or establish regional peace.",
    cost: { gold: 1000, days: 21, politicalCapital: 5 },
    timeRequired: "3–6 weeks of preparation plus a 3–7 day summit",
    skillCheck: { skill: "Persuasion", ability: "CHA", baseDC: 16 },
    outcomes: {
      success:
        "All attending factions improve stance toward host by 1 step; one major treaty can be ratified",
      partial:
        "Summit concludes without major agreement; host gains +1 Prestige need satisfaction",
      failure:
        "Summit collapses; host faction loses 2 political capital; one attending faction's stance drops 1 step toward host",
    },
  },
};

// ---------------------------------------------------------------------------
// POLITICAL_EVENTS
// 12 dynamic events that can alter diplomatic landscapes, trigger crises,
// or create opportunities for players and factions.
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} PoliticalEvent
 * @property {string} id - Unique identifier
 * @property {string} label - Display name
 * @property {string} description - What has occurred
 * @property {string[]} affectedStances - Which diplomatic stances are typical when this occurs
 * @property {string[]} factionInvolvement - How many and what type of factions are typically involved
 * @property {Object[]} resolutionOptions - Possible ways to resolve the event
 */

export const POLITICAL_EVENTS = {
  SUCCESSION_CRISIS: {
    id: "SUCCESSION_CRISIS",
    label: "Succession Crisis",
    description:
      "A faction's leadership has died or become incapacitated without a clear heir, triggering internal power struggles and diplomatic uncertainty.",
    affectedStances: ["NEUTRAL", "CORDIAL", "FRIENDLY", "ALLIED"],
    factionInvolvement: ["Primary faction in crisis", "1–3 rival claimant-supporting factions"],
    resolutionOptions: [
      {
        option: "Back a claimant",
        skill: "Persuasion",
        DC: 16,
        outcome: "Supported claimant takes power; stance with faction improves 1 step if successful",
      },
      {
        option: "Broker a council regency",
        skill: "Insight",
        DC: 14,
        outcome: "Stable but weak government formed; faction enters Cold stance with all until resolved",
      },
      {
        option: "Exploit the chaos",
        skill: "Deception",
        DC: 18,
        outcome: "Gain territorial or trade concession; faction becomes Hostile when they stabilize",
      },
    ],
  },
  ASSASSINATION_ATTEMPT: {
    id: "ASSASSINATION_ATTEMPT",
    label: "Assassination Attempt",
    description:
      "A key diplomatic or military figure has been targeted for assassination. Success or failure will reshape alliances.",
    affectedStances: ["HOSTILE", "COLD", "NEUTRAL", "CORDIAL"],
    factionInvolvement: ["Target faction", "Suspected sponsoring faction", "Neutral witness factions"],
    resolutionOptions: [
      {
        option: "Investigate and expose perpetrator",
        skill: "Investigation",
        DC: 17,
        outcome: "Innocent party cleared; guilty party's stance drops to Hostile with all",
      },
      {
        option: "Cover up involvement",
        skill: "Deception",
        DC: 18,
        outcome: "Crisis averted for now; if later exposed, all stances drop 2 steps",
      },
      {
        option: "Offer protection and alliance",
        skill: "Persuasion",
        DC: 13,
        outcome: "Stance with target rises 1 step; you gain leverage with their faction",
      },
    ],
  },
  BORDER_SKIRMISH: {
    id: "BORDER_SKIRMISH",
    label: "Border Skirmish",
    description:
      "Military forces have clashed along a contested or unclear border, threatening to escalate to open war.",
    affectedStances: ["COLD", "HOSTILE", "NEUTRAL"],
    factionInvolvement: ["Two border-sharing factions"],
    resolutionOptions: [
      {
        option: "Demand ceasefire and arbitration",
        skill: "Persuasion",
        DC: 15,
        outcome: "Skirmish ends; border commission formed; both stances hold",
      },
      {
        option: "Provide military aid to one side",
        skill: null,
        DC: null,
        outcome: "Aided faction's stance improves 1 step; opposing faction's stance drops 1 step",
      },
      {
        option: "Ignore and let it escalate",
        skill: null,
        DC: null,
        outcome: "Both factions enter War stance; regional trade disrupted",
      },
    ],
  },
  TRADE_DISPUTE: {
    id: "TRADE_DISPUTE",
    label: "Trade Dispute",
    description:
      "A tariff violation, stolen cargo, or broken trade agreement has created economic and diplomatic friction.",
    affectedStances: ["NEUTRAL", "CORDIAL", "FRIENDLY"],
    factionInvolvement: ["Two trading factions"],
    resolutionOptions: [
      {
        option: "Mediate and propose reparations",
        skill: "Persuasion",
        DC: 13,
        outcome: "Dispute resolved; trade continues; both factions owe mediator a favor",
      },
      {
        option: "Side with the aggrieved faction",
        skill: "Insight",
        DC: 12,
        outcome: "Aggrieved faction's stance improves 1; other faction's stance drops 1",
      },
      {
        option: "Exploit trade routes while distracted",
        skill: "Sleight of Hand",
        DC: 15,
        outcome: "Gain 200 gp equivalent in goods; if caught, stance with both drops 1 step",
      },
    ],
  },
  RELIGIOUS_CONFLICT: {
    id: "RELIGIOUS_CONFLICT",
    label: "Religious Conflict",
    description:
      "Theological differences or a holy site dispute has inflamed tensions between factions with incompatible religious identities.",
    affectedStances: ["COLD", "HOSTILE", "NEUTRAL"],
    factionInvolvement: ["Two factions with opposing dominant religions", "Religious institution"],
    resolutionOptions: [
      {
        option: "Broker a sacred site sharing agreement",
        skill: "Religion",
        DC: 16,
        outcome: "Conflict de-escalates; both factions move 1 step toward Neutral",
      },
      {
        option: "Champion one faith",
        skill: "Persuasion",
        DC: 14,
        outcome: "Championed faction's stance improves 2 steps; opposed faction's drops 2 steps",
      },
      {
        option: "Declare religious neutrality",
        skill: "Persuasion",
        DC: 12,
        outcome: "Short-term stability; neither faction improves; conflict resurfaces in 1d6 months",
      },
    ],
  },
  REFUGEE_CRISIS: {
    id: "REFUGEE_CRISIS",
    label: "Refugee Crisis",
    description:
      "Mass displacement of people due to war, disaster, or persecution is straining borders and creating humanitarian and political pressure.",
    affectedStances: ["WAR", "HOSTILE", "COLD", "NEUTRAL"],
    factionInvolvement: ["Origin faction", "1–3 receiving factions"],
    resolutionOptions: [
      {
        option: "Open borders and provide aid",
        skill: "Medicine",
        DC: 12,
        outcome: "Stance improves 1 step with refugees' origin faction; internal stability checked",
      },
      {
        option: "Negotiate resettlement agreement",
        skill: "Persuasion",
        DC: 15,
        outcome: "Managed refugee flow; gain political capital with humanitarian factions",
      },
      {
        option: "Close borders",
        skill: null,
        DC: null,
        outcome: "Internal stability maintained; stance with origin faction drops 1 step; prestige loss",
      },
    ],
  },
  NATURAL_DISASTER_RESPONSE: {
    id: "NATURAL_DISASTER_RESPONSE",
    label: "Natural Disaster Response",
    description:
      "A catastrophic earthquake, flood, famine, or magical disaster requires inter-faction cooperation or creates an opportunity for exploitation.",
    affectedStances: ["NEUTRAL", "CORDIAL", "FRIENDLY", "COLD"],
    factionInvolvement: ["Affected faction", "1–4 neighboring factions"],
    resolutionOptions: [
      {
        option: "Lead relief efforts",
        skill: "Persuasion",
        DC: 11,
        outcome: "Stance with affected faction improves 2 steps; prestige gained with all factions",
      },
      {
        option: "Offer aid in exchange for concessions",
        skill: "Persuasion",
        DC: 14,
        outcome: "Gain a treaty or territorial concession; affected faction is Cordial but watchful",
      },
      {
        option: "Seize territory while they recover",
        skill: null,
        DC: null,
        outcome: "Territory gained; affected faction and allies drop to Hostile; reputation penalty",
      },
    ],
  },
  MARRIAGE_PROPOSAL: {
    id: "MARRIAGE_PROPOSAL",
    label: "Marriage Proposal",
    description:
      "A faction has proposed a dynastic union. Accepting, declining, or counter-offering all carry significant diplomatic weight.",
    affectedStances: ["NEUTRAL", "CORDIAL", "FRIENDLY"],
    factionInvolvement: ["Proposing faction", "Receiving faction"],
    resolutionOptions: [
      {
        option: "Accept the proposal",
        skill: null,
        DC: null,
        outcome: "Marriage Alliance treaty active; stance improves 1 step",
      },
      {
        option: "Negotiate terms before accepting",
        skill: "Persuasion",
        DC: 14,
        outcome: "Favorable marriage terms secured; stance improves 1 step with minor concessions",
      },
      {
        option: "Decline diplomatically",
        skill: "Persuasion",
        DC: 13,
        outcome: "Proposal declined without offense; stance unchanged",
      },
      {
        option: "Decline coldly",
        skill: null,
        DC: null,
        outcome: "Stance drops 1 step; proposing faction feels slighted",
      },
    ],
  },
  TOURNAMENT_INVITATION: {
    id: "TOURNAMENT_INVITATION",
    label: "Tournament Invitation",
    description:
      "A faction is hosting a grand tournament, games, or martial exhibition and has extended an invitation. Participation (and performance) affects prestige and diplomacy.",
    affectedStances: ["NEUTRAL", "CORDIAL", "FRIENDLY", "ALLIED"],
    factionInvolvement: ["Hosting faction", "2–6 invited factions"],
    resolutionOptions: [
      {
        option: "Send champions and perform well",
        skill: "Athletics",
        DC: 15,
        outcome: "Stance with host improves 1 step; gain prestige with all attending factions",
      },
      {
        option: "Attend but do not compete",
        skill: "Persuasion",
        DC: 11,
        outcome: "Goodwill maintained; no prestige change",
      },
      {
        option: "Decline the invitation",
        skill: null,
        DC: null,
        outcome: "Stance with host drops 1 step unless a valid excuse is provided (DC 13 Persuasion)",
      },
    ],
  },
  SPY_DISCOVERED: {
    id: "SPY_DISCOVERED",
    label: "Spy Discovered",
    description:
      "An agent from one faction has been caught operating within another faction's territory.",
    affectedStances: ["NEUTRAL", "CORDIAL", "FRIENDLY", "ALLIED", "COLD"],
    factionInvolvement: ["Sponsoring faction", "Victim faction"],
    resolutionOptions: [
      {
        option: "Deny and stonewall",
        skill: "Deception",
        DC: 17,
        outcome: "If successful, stance holds; if failed, stance drops 2 steps",
      },
      {
        option: "Apologize and offer reparations",
        skill: "Persuasion",
        DC: 14,
        outcome: "Stance drops only 1 step; spy may be returned; future espionage DC+2",
      },
      {
        option: "Admit and claim the spy acted alone",
        skill: "Deception",
        DC: 13,
        outcome: "Stance drops 1 step; victim faction is skeptical but accepts the explanation for now",
      },
    ],
  },
  EMBARGO: {
    id: "EMBARGO",
    label: "Embargo",
    description:
      "A faction or coalition has declared a trade embargo, cutting off economic access to a target faction.",
    affectedStances: ["HOSTILE", "COLD", "NEUTRAL"],
    factionInvolvement: ["Embargo-issuing faction(s)", "Target faction", "Neutral trade partners"],
    resolutionOptions: [
      {
        option: "Negotiate embargo terms and concessions",
        skill: "Persuasion",
        DC: 16,
        outcome: "Embargo lifted; target faction makes one policy concession",
      },
      {
        option: "Find alternative trade routes",
        skill: "Survival",
        DC: 14,
        outcome: "Trade modifier penalty reduced by half; embargo technically maintained",
      },
      {
        option: "Retaliate with counter-embargo",
        skill: null,
        DC: null,
        outcome: "Mutual economic damage; both factions' trade modifiers drop 0.5; stance drops 1 step",
      },
    ],
  },
  REVOLUTION: {
    id: "REVOLUTION",
    label: "Revolution",
    description:
      "Internal upheaval has toppled or threatened a faction's government. The new power's diplomatic stance may differ dramatically from the old regime.",
    affectedStances: ["ALL"],
    factionInvolvement: ["Faction in revolution", "Foreign factions with interests or alliances"],
    resolutionOptions: [
      {
        option: "Support the revolutionaries",
        skill: "Persuasion",
        DC: 15,
        outcome: "If revolution succeeds, new government starts at Friendly; if fails, old regime is Hostile",
      },
      {
        option: "Support the existing government",
        skill: "Persuasion",
        DC: 15,
        outcome: "If government survives, stance improves 1 step; if revolution succeeds, new government starts at Hostile",
      },
      {
        option: "Remain neutral and wait",
        skill: null,
        DC: null,
        outcome: "Stance with whoever wins starts at Neutral; no prestige gain or loss",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// FACTION_NEEDS
// 6 core needs that drive faction diplomatic behavior. Understanding these
// allows players and DMs to predict, manipulate, and satisfy faction motivations.
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} FactionNeed
 * @property {string} id - Unique identifier
 * @property {string} label - Display name
 * @property {string} description - What drives this need
 * @property {string[]} diplomaticBehaviors - How this need shapes the faction's diplomatic actions
 * @property {string[]} satisfactionSources - What can fulfill this need
 * @property {string} unsatisfiedEffect - Consequence when the need goes unmet
 * @property {string} satisfiedBonus - Benefit when the need is well-met
 */

export const FACTION_NEEDS = {
  TERRITORY: {
    id: "TERRITORY",
    label: "Territory",
    description:
      "The faction requires land, resources within specific regions, or strategic positions to survive or expand.",
    diplomaticBehaviors: [
      "Pursues border agreements and vassal arrangements",
      "Likely to initiate border skirmishes if territorial ambitions are ignored",
      "Will pay high tribute or make concessions to acquire desired land",
      "Views neighbors as competitors for limited space",
    ],
    satisfactionSources: [
      "Territorial concessions in treaties",
      "Jointly administered border zones",
      "Colonization rights in unclaimed regions",
      "Military victory and annexation",
    ],
    unsatisfiedEffect:
      "Faction becomes increasingly aggressive; stance with all border neighbors shifts 1 step toward Hostile every 3 months",
    satisfiedBonus:
      "+2 to Persuasion when dealing with this faction if you control desired territory and offer it as a concession",
  },
  RESOURCES: {
    id: "RESOURCES",
    label: "Resources",
    description:
      "The faction depends on specific materials, foodstuffs, magic components, or economic access it cannot produce internally.",
    diplomaticBehaviors: [
      "Prioritizes trade agreements and resource-sharing compacts",
      "Will accept unfavorable political terms in exchange for resource security",
      "May resort to sabotage or embargo if resources are cut off",
      "Highly receptive to envoys from resource-rich factions",
    ],
    satisfactionSources: [
      "Trade agreements with favorable resource terms",
      "Resource-sharing compacts",
      "Control of key trade routes",
      "Discovery of internal resource deposits",
    ],
    unsatisfiedEffect:
      "Faction's trade modifier drops 0.25 per month of scarcity; military strength degrades after 3 months",
    satisfiedBonus:
      "Faction is +4 to accept any treaty that includes resource provisions, regardless of other terms",
  },
  SECURITY: {
    id: "SECURITY",
    label: "Security",
    description:
      "The faction fears external attack, internal rebellion, or existential threats and seeks guarantees of safety.",
    diplomaticBehaviors: [
      "Seeks mutual defense pacts and military alliances",
      "Suspicious of powerful neighbors; prone to pre-emptive hostility",
      "Will subordinate ideology and prestige to survive",
      "Highly responsive to offers of protection from powerful factions",
    ],
    satisfactionSources: [
      "Mutual defense treaties",
      "Military alliances with strong partners",
      "Elimination or containment of threatening factions",
      "Strong internal stability and loyal military",
    ],
    unsatisfiedEffect:
      "Faction adopts paranoid stance; espionage level increases against all neighbors; Persuasion DC +3 for all outside factions",
    satisfiedBonus:
      "Faction will accept vassal or tribute arrangements willingly; +3 to all Persuasion checks when offering protection",
  },
  PRESTIGE: {
    id: "PRESTIGE",
    label: "Prestige",
    description:
      "The faction needs recognition, respect, and a seat of influence among its peers. Status and honor are paramount.",
    diplomaticBehaviors: [
      "Hosts summits, tournaments, and grand events",
      "Demands to be consulted on regional matters",
      "Will initiate conflict if publicly humiliated",
      "Responsive to being treated as equals or superiors",
    ],
    satisfactionSources: [
      "Being invited to lead major diplomatic summits",
      "Receiving prestigious marriage proposals",
      "Winning tournament or martial competitions",
      "Public recognition by powerful factions",
    ],
    unsatisfiedEffect:
      "Faction becomes belligerent and seeks conflict or attention; will decline reasonable treaties as a show of independence",
    satisfiedBonus:
      "Faction grants one free concession per major treaty if approached with formal ceremony; Persuasion DC -3",
  },
  IDEOLOGY: {
    id: "IDEOLOGY",
    label: "Ideology",
    description:
      "The faction is driven by a core belief system — religious, political, or philosophical — that shapes every decision.",
    diplomaticBehaviors: [
      "Refuses treaties that contradict core values regardless of benefit",
      "Actively seeks to spread its ideology to neighbors",
      "Will go to war over ideological affronts even when militarily weak",
      "Deep alliance possible if ideology is shared or respected",
    ],
    satisfactionSources: [
      "Treaties that acknowledge or protect the faction's ideology",
      "Spreading ideology to neighboring factions through knowledge-sharing",
      "Eliminating ideological rivals",
      "Recognition from respected ideological authorities",
    ],
    unsatisfiedEffect:
      "Faction enters religious or political conflict stance; Cold or Hostile with all who oppose its beliefs",
    satisfiedBonus:
      "Faction becomes Friendly or Allied at half normal diplomatic cost if ideology is visibly respected in treaty language",
  },
  REVENGE: {
    id: "REVENGE",
    label: "Revenge",
    description:
      "A historical wrong — conquest, betrayal, assassination, or theft — drives the faction toward vendetta. Until satisfied, diplomacy is severely hampered.",
    diplomaticBehaviors: [
      "Will not enter Allied or Friendly stance with the offending faction",
      "Recruits other factions into coalitions against the target",
      "Uses espionage and sabotage preferentially over direct diplomacy",
      "May accept any diplomatic deal with the target's enemies, regardless of terms",
    ],
    satisfactionSources: [
      "Public apology and reparations from offending faction",
      "Military defeat of offending faction",
      "Restoration of lost territory, treasure, or honor",
      "Death or removal of the specific individual responsible for the wrong",
    ],
    unsatisfiedEffect:
      "Faction takes any opportunity to harm the offending faction; treats all allies of the offender as Cold at best",
    satisfiedBonus:
      "Once revenge is satisfied, faction relationship resets to Neutral and is extremely receptive to alliance-building; +5 to first Persuasion check",
  },
};

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Retrieve a diplomatic stance object by its ID.
 * @param {string} stanceId - The stance ID (e.g., "WAR", "ALLIED")
 * @returns {DiplomaticStance|null} The stance object, or null if not found
 */
export function getDiplomaticStance(stanceId) {
  if (!stanceId) return null;
  return DIPLOMATIC_STANCES[stanceId.toUpperCase()] || null;
}

/**
 * Propose a treaty between two factions, returning the treaty details and
 * the Persuasion DC adjusted for current stance between the factions.
 * @param {string} type - Treaty type ID (e.g., "TRADE_AGREEMENT")
 * @param {Object} factionA - First faction object (must have { id, name, stance })
 * @param {Object} factionB - Second faction object (must have { id, name, stance })
 * @returns {Object} Treaty proposal with treaty details, adjusted DC, and notes
 */
export function proposeTreaty(type, factionA, factionB) {
  const treaty = TREATY_TYPES[type?.toUpperCase()];
  if (!treaty) {
    return { error: `Unknown treaty type: ${type}` };
  }

  const currentStance = getDiplomaticStance(factionB?.stance);
  let dcModifier = 0;
  let notes = [];

  if (currentStance) {
    // Higher-tier stances make treaty proposals easier
    const tier = currentStance.tier;
    if (tier >= 6) {
      dcModifier = -4;
      notes.push("Friendly or Allied stance: DC reduced by 4");
    } else if (tier === 5) {
      dcModifier = -2;
      notes.push("Cordial stance: DC reduced by 2");
    } else if (tier === 4) {
      dcModifier = 0;
      notes.push("Neutral stance: no DC modifier");
    } else if (tier === 3) {
      dcModifier = +3;
      notes.push("Cold stance: DC increased by 3");
    } else if (tier <= 2) {
      dcModifier = +6;
      notes.push("Hostile or War stance: DC increased by 6 — consider prerequisite diplomacy first");
    }
  }

  const baseAction = DIPLOMATIC_ACTIONS.PROPOSE_TREATY;
  const adjustedDC = baseAction.skillCheck.baseDC + dcModifier;

  return {
    treaty,
    proposingFaction: factionA,
    receivingFaction: factionB,
    currentStance: currentStance?.label || "Unknown",
    skillCheck: {
      skill: baseAction.skillCheck.skill,
      ability: baseAction.skillCheck.ability,
      baseDC: baseAction.skillCheck.baseDC,
      adjustedDC,
      dcModifier,
    },
    cost: baseAction.cost,
    timeRequired: baseAction.timeRequired,
    outcomes: baseAction.outcomes,
    notes,
  };
}

/**
 * Resolve a diplomatic action given the action ID, the player's skill check total,
 * and the action's DC (or a custom DC override).
 * @param {string} action - The diplomatic action ID (e.g., "SEND_ENVOY")
 * @param {number} skillCheck - The total rolled on the skill check (roll + modifier)
 * @param {number|null} [DC=null] - Override DC; uses action's baseDC if null
 * @returns {Object} Resolution result with outcome, margin, and narrative
 */
export function resolveDiplomaticAction(action, skillCheck, DC = null) {
  const actionData = DIPLOMATIC_ACTIONS[action?.toUpperCase()];
  if (!actionData) {
    return { error: `Unknown diplomatic action: ${action}` };
  }

  // Some actions (declare war) have no skill check
  if (!actionData.skillCheck) {
    return {
      action: actionData.label,
      result: "automatic",
      outcome: actionData.outcomes.success,
      narrative: `${actionData.label} requires no skill check and takes effect automatically.`,
    };
  }

  const effectiveDC = DC !== null ? DC : actionData.skillCheck.baseDC;
  const margin = skillCheck - effectiveDC;

  let result;
  let outcome;

  if (margin >= 5) {
    result = "critical_success";
    outcome = actionData.outcomes.success;
  } else if (margin >= 0) {
    result = "success";
    outcome = actionData.outcomes.success;
  } else if (margin >= -4) {
    result = "partial";
    outcome = actionData.outcomes.partial || actionData.outcomes.failure;
  } else {
    result = "failure";
    outcome = actionData.outcomes.failure;
  }

  return {
    action: actionData.label,
    skillCheck,
    DC: effectiveDC,
    margin,
    result,
    outcome,
    cost: actionData.cost,
    timeRequired: actionData.timeRequired,
  };
}

/**
 * Generate a random political event weighted toward factions that have unmet needs
 * or volatile stances.
 * @param {Object[]} factions - Array of faction objects with { id, name, stance, needs }
 * @returns {Object} A political event object with suggested involved factions
 */
export function generatePoliticalEvent(factions = []) {
  const eventKeys = Object.keys(POLITICAL_EVENTS);
  const randomKey = eventKeys[Math.floor(Math.random() * eventKeys.length)];
  const event = POLITICAL_EVENTS[randomKey];

  // Filter factions whose current stance matches the event's affected stances
  const eligibleFactions = factions.filter(
    (f) =>
      !event.affectedStances ||
      event.affectedStances.includes("ALL") ||
      event.affectedStances.includes(f.stance?.toUpperCase())
  );

  // Pick primary and secondary factions if available
  const involvedFactions = eligibleFactions.slice(0, 2);
  if (involvedFactions.length === 0 && factions.length > 0) {
    involvedFactions.push(factions[Math.floor(Math.random() * factions.length)]);
  }

  return {
    event,
    involvedFactions,
    timestamp: new Date().toISOString(),
    notes: `Event "${event.label}" generated. Assign involved factions and present resolution options to players.`,
  };
}

/**
 * Attempt to shift a faction's diplomatic stance one step in a given direction,
 * applying the stance's shiftDC and the player's check result.
 * @param {string} current - Current stance ID
 * @param {"up"|"down"} direction - "up" moves toward Allied; "down" moves toward War
 * @param {number} checkResult - Total of the Persuasion/Intimidation check
 * @returns {Object} New stance, whether the shift succeeded, and margin details
 */
export function shiftDiplomaticStance(current, direction, checkResult) {
  const stanceOrder = ["WAR", "HOSTILE", "COLD", "NEUTRAL", "CORDIAL", "FRIENDLY", "ALLIED"];
  const currentIndex = stanceOrder.indexOf(current?.toUpperCase());

  if (currentIndex === -1) {
    return { error: `Unknown stance: ${current}` };
  }

  const currentStanceData = DIPLOMATIC_STANCES[stanceOrder[currentIndex]];
  const isShiftingUp = direction === "up";

  // Cannot shift beyond bounds
  if (isShiftingUp && currentIndex === stanceOrder.length - 1) {
    return {
      current: currentStanceData,
      new: currentStanceData,
      shifted: false,
      reason: "Already at maximum stance (Allied); cannot improve further",
    };
  }
  if (!isShiftingUp && currentIndex === 0) {
    return {
      current: currentStanceData,
      new: currentStanceData,
      shifted: false,
      reason: "Already at minimum stance (War); cannot worsen further",
    };
  }

  const DC = isShiftingUp ? currentStanceData.shiftDC : 10; // Shifting down is easier (DC 10)
  const margin = checkResult - DC;
  const succeeded = margin >= 0;

  const newIndex = succeeded
    ? isShiftingUp
      ? currentIndex + 1
      : currentIndex - 1
    : currentIndex;

  const newStance = DIPLOMATIC_STANCES[stanceOrder[newIndex]];

  return {
    current: currentStanceData,
    new: newStance,
    direction,
    checkResult,
    DC,
    margin,
    shifted: succeeded,
    reason: succeeded
      ? `Check succeeded by ${margin}; stance ${isShiftingUp ? "improved" : "worsened"} to ${newStance.label}`
      : `Check failed by ${Math.abs(margin)}; stance remains ${currentStanceData.label}`,
  };
}

/**
 * Assess a faction's active needs and return diplomatic behavior predictions
 * and recommended engagement strategies.
 * @param {Object} faction - Faction object with { id, name, needs: string[], stance }
 * @returns {Object} Assessment with needs data, behavioral predictions, and strategies
 */
export function assessFactionNeeds(faction) {
  if (!faction || !Array.isArray(faction.needs)) {
    return { error: "Faction must have a 'needs' array of FACTION_NEEDS keys" };
  }

  const resolvedNeeds = faction.needs
    .map((needId) => FACTION_NEEDS[needId?.toUpperCase()])
    .filter(Boolean);

  if (resolvedNeeds.length === 0) {
    return {
      faction,
      resolvedNeeds: [],
      behavioralPredictions: [],
      recommendedStrategies: [],
      notes: "No recognized needs found. Faction behavior may be unpredictable.",
    };
  }

  const behavioralPredictions = resolvedNeeds.flatMap((need) => need.diplomaticBehaviors);
  const satisfactionSources = resolvedNeeds.flatMap((need) => need.satisfactionSources);
  const unsatisfiedRisks = resolvedNeeds.map(
    (need) => `[${need.label}] ${need.unsatisfiedEffect}`
  );
  const satisfiedBonuses = resolvedNeeds.map(
    (need) => `[${need.label}] ${need.satisfiedBonus}`
  );

  return {
    faction: { id: faction.id, name: faction.name, stance: faction.stance },
    resolvedNeeds,
    behavioralPredictions,
    recommendedStrategies: satisfactionSources,
    unsatisfiedRisks,
    satisfiedBonuses,
    notes: `Faction has ${resolvedNeeds.length} identified need(s). Address highest-priority needs first in treaty negotiations.`,
  };
}
