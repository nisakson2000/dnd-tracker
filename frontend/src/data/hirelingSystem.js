/**
 * @file hirelingSystem.js
 * @description D&D 5e Hireling, Retainer, and Follower system data and logic.
 * Covers hiring NPCs, loyalty tracking, morale checks, and retainer rules.
 * @module hirelingSystem
 * @version 1.0.0
 *
 * Data sources: D&D 5e Player's Handbook (Chapter 5: Equipment - Services),
 * Dungeon Master's Guide (Chapter 2: Creating a Multiverse - Hirelings),
 * Tasha's Cauldron of Everything (Sidekicks).
 *
 * No React dependencies — pure data and helper functions.
 */

// ---------------------------------------------------------------------------
// HIRELING TYPES
// ---------------------------------------------------------------------------

/**
 * The 12 hireling archetypes available for hire.
 * dailyCost is in gold pieces (gp) unless noted as sp (silver pieces).
 * costNote is used for variable-cost roles.
 * loyaltyBase is the starting loyalty score before CHA modifier.
 * riskTolerance: "low" | "medium" | "high" — willingness to face danger.
 */
export const HIRELING_TYPES = {
  porter: {
    id: "porter",
    name: "Porter / Laborer",
    description:
      "Unskilled workers who carry gear, dig ditches, and perform manual labor. Will not fight.",
    dailyCostGP: 0.2, // 2sp = 0.2gp
    dailyCostDisplay: "2 sp/day",
    costNote: null,
    skills: ["Athletics (untrained)", "Heavy load carrying", "Basic camp tasks"],
    statBlockRef: "Commoner (MM p.344)",
    loyaltyBase: 10,
    riskTolerance: "low",
    maxCarryLbs: 150,
    notes: "Refuses combat. Flees at first sign of serious danger.",
  },

  skilledLaborer: {
    id: "skilledLaborer",
    name: "Skilled Laborer",
    description:
      "Tradespeople, artisans, and trained workers. Masons, miners, blacksmiths, etc.",
    dailyCostGP: 2,
    dailyCostDisplay: "2 gp/day",
    costNote: null,
    skills: [
      "Trade skill (varies by specialty)",
      "Tool proficiency",
      "Basic construction/repair",
    ],
    statBlockRef: "Commoner (MM p.344) with tool proficiency",
    loyaltyBase: 10,
    riskTolerance: "low",
    maxCarryLbs: 120,
    notes:
      "Will perform skilled crafts but not combat. Specialty determines actual tools/skills.",
  },

  guide: {
    id: "guide",
    name: "Guide",
    description:
      "Wilderness scouts and local experts who know terrain, hazards, and safe routes.",
    dailyCostGP: 5,
    dailyCostDisplay: "5 gp/day",
    costNote: null,
    skills: [
      "Survival +4",
      "Nature +3",
      "Perception +3",
      "Stealth +2",
      "Local knowledge",
    ],
    statBlockRef: "Scout (MM p.349)",
    loyaltyBase: 10,
    riskTolerance: "medium",
    maxCarryLbs: 90,
    notes:
      "Will avoid combat but can fight if cornered. Expertise in specific terrain type (arctic, forest, urban, etc.).",
  },

  guard: {
    id: "guard",
    name: "Guard",
    description:
      "Armed professionals who protect people, property, or caravans. Basic fighters.",
    dailyCostGP: 2,
    dailyCostDisplay: "2 gp/day",
    costNote: null,
    skills: [
      "Athletics +3",
      "Perception +2",
      "Intimidation +1",
      "Weapon proficiency (simple, martial)",
    ],
    statBlockRef: "Guard (MM p.347)",
    loyaltyBase: 10,
    riskTolerance: "medium",
    maxCarryLbs: 100,
    notes:
      "Will fight to defend their charge but not lead assaults. Morale check if clearly outmatched.",
  },

  mercenary: {
    id: "mercenary",
    name: "Mercenary",
    description:
      "Professional soldiers hired for combat. Part of a company or working independently.",
    dailyCostGP: 5,
    dailyCostDisplay: "5 gp/day",
    costNote: null,
    skills: [
      "Athletics +4",
      "Perception +2",
      "Intimidation +2",
      "Weapon proficiency (all)",
      "Armor proficiency (all)",
    ],
    statBlockRef: "Veteran (MM p.350)",
    loyaltyBase: 8,
    riskTolerance: "high",
    maxCarryLbs: 120,
    notes:
      "Will enter combat. Loyalty is lower — mercenaries follow coin. Double pay for suicidal missions.",
  },

  healer: {
    id: "healer",
    name: "Healer",
    description:
      "Trained medics, herbalists, or hedge mages who treat wounds and illness.",
    dailyCostGP: 10,
    dailyCostDisplay: "10 gp/day",
    costNote: null,
    skills: [
      "Medicine +5",
      "Nature +3",
      "Herbalism Kit",
      "Stabilize dying (no roll)",
      "Treat wounds (restore 1d6+4 HP, once per short rest per target)",
    ],
    statBlockRef: "Acolyte (MM p.342) with Medicine expertise",
    loyaltyBase: 11,
    riskTolerance: "low",
    maxCarryLbs: 80,
    notes:
      "Carries a healer's kit. Expends 1 use per treatment. Will not fight unless absolutely necessary.",
  },

  sageTutor: {
    id: "sageTutor",
    name: "Sage / Tutor",
    description:
      "Scholars, historians, wizards' apprentices, or lore-keepers with broad academic knowledge.",
    dailyCostGP: 25,
    dailyCostDisplay: "25 gp/day",
    costNote: null,
    skills: [
      "Arcana +5",
      "History +5",
      "Nature +4",
      "Religion +4",
      "Investigation +4",
      "Expertise in specialty field",
    ],
    statBlockRef: "Mage (MM p.347) without combat spells; or Commoner with INT 16",
    loyaltyBase: 11,
    riskTolerance: "low",
    maxCarryLbs: 60,
    notes:
      "Invaluable for research and translating ancient texts. Specialty (e.g., ancient history, alchemy) grants advantage on relevant checks.",
  },

  spy: {
    id: "spy",
    name: "Spy",
    description:
      "Agents skilled in infiltration, disguise, and information gathering. Work in shadows.",
    dailyCostGP: 50,
    dailyCostDisplay: "50 gp/day",
    costNote: null,
    skills: [
      "Deception +5",
      "Stealth +5",
      "Insight +4",
      "Perception +4",
      "Disguise Kit",
      "Forgery Kit",
      "Thieves' Tools",
    ],
    statBlockRef: "Spy (MM p.349)",
    loyaltyBase: 8,
    riskTolerance: "medium",
    maxCarryLbs: 70,
    notes:
      "Will not operate in open combat. Loyalty is conditional — spies may have competing employers. Verify through Insight checks.",
  },

  assassin: {
    id: "assassin",
    name: "Assassin",
    description:
      "Contract killers trained to eliminate specific targets through stealth and poisons.",
    dailyCostGP: 100,
    dailyCostDisplay: "100+ gp/day",
    costNote:
      "Base 100 gp/day; high-value targets or difficult contracts may cost 500–5,000 gp flat fee.",
    skills: [
      "Stealth +6",
      "Deception +5",
      "Acrobatics +5",
      "Poisoner's Kit",
      "Disguise Kit",
      "Assassination (advantage on attacks vs. surprised targets; extra 4d6 damage)",
    ],
    statBlockRef: "Assassin (MM p.343)",
    loyaltyBase: 7,
    riskTolerance: "high",
    maxCarryLbs: 75,
    notes:
      "Operates only against agreed-upon targets. Payment typically 50% upfront. Evidence of double-cross triggers immediate betrayal.",
  },

  craftsman: {
    id: "craftsman",
    name: "Craftsman",
    description:
      "Master artisans — weaponsmiths, armorers, alchemists, jewelers, etc. Produce goods over time.",
    dailyCostGP: null,
    dailyCostDisplay: "Varies",
    costNote:
      "5 gp/day (apprentice) to 25 gp/day (master). Plus material costs. PHB p.187: 5 gp of goods per workday.",
    skills: [
      "Relevant tool proficiency (expertise)",
      "Appraise items",
      "Identify materials",
      "Craft items at half market cost",
    ],
    statBlockRef: "Commoner with tool expertise",
    loyaltyBase: 11,
    riskTolerance: "low",
    maxCarryLbs: 100,
    notes:
      "Produces 5 gp worth of goods per day of work. Master craftsmen may have unique recipes or techniques.",
  },

  animalHandler: {
    id: "animalHandler",
    name: "Animal Handler",
    description:
      "Trainers, stable hands, falconers, or beast tamers skilled with animals.",
    dailyCostGP: 3,
    dailyCostDisplay: "3 gp/day",
    costNote: null,
    skills: [
      "Animal Handling +5",
      "Nature +3",
      "Perception +2",
      "Calm Animals (as Calm Emotions for beasts)",
      "Train animals over weeks",
    ],
    statBlockRef: "Commoner with Animal Handling expertise",
    loyaltyBase: 11,
    riskTolerance: "medium",
    maxCarryLbs: 85,
    notes:
      "Required for managing mounts, pack animals, or trained combat beasts. One handler can manage up to 6 animals.",
  },

  cook: {
    id: "cook",
    name: "Cook",
    description:
      "Camp cooks and provisioners who prepare meals, forage ingredients, and manage rations.",
    dailyCostGP: 1,
    dailyCostDisplay: "1 gp/day",
    costNote: null,
    skills: [
      "Cook's Utensils",
      "Survival +2 (foraging)",
      "Nature +1",
      "Prepare morale-boosting meals",
    ],
    statBlockRef: "Commoner",
    loyaltyBase: 12,
    riskTolerance: "low",
    maxCarryLbs: 80,
    notes:
      "A good meal restores 1 additional HP per Hit Die spent during a long rest (DM discretion). Reduces ration consumption by 20%.",
  },
};

// ---------------------------------------------------------------------------
// LOYALTY SYSTEM
// ---------------------------------------------------------------------------

/**
 * Loyalty score range: 0–20.
 * Starting score = 10 + employer's CHA modifier (clamped to 1–19).
 *
 * Each entry defines how much a given event shifts the loyalty score.
 * Positive values increase loyalty; negative values decrease it.
 */
export const LOYALTY_SYSTEM = {
  startingBase: 10,

  /**
   * Calculate the starting loyalty score for a new hireling.
   * @param {number} chaModifier - Employer's Charisma modifier (-5 to +5).
   * @returns {number} Starting loyalty score clamped between 1 and 19.
   */
  calculateStartingLoyalty(chaModifier) {
    const raw = this.startingBase + chaModifier;
    return Math.min(19, Math.max(1, raw));
  },

  events: {
    paidOnTime: {
      id: "paidOnTime",
      label: "Paid on time",
      description: "Employer pays wages on the agreed schedule without delay.",
      loyaltyChange: +1,
    },
    bonusPay: {
      id: "bonusPay",
      label: "Received bonus pay",
      description:
        "Employer gives unexpected extra compensation (at least one day's extra wages).",
      loyaltyChange: +2,
    },
    savedFromDanger: {
      id: "savedFromDanger",
      label: "Saved from danger by employer",
      description:
        "Employer directly intervened to prevent the hireling's death or serious harm.",
      loyaltyChange: +3,
    },
    respectedPraised: {
      id: "respectedPraised",
      label: "Respected or publicly praised",
      description:
        "Employer treated hireling with genuine respect, or praised them in front of others.",
      loyaltyChange: +1,
    },
    givenGift: {
      id: "givenGift",
      label: "Received meaningful gift",
      description: "Employer gave a personal gift of value (magical or sentimental).",
      loyaltyChange: +2,
    },
    promisedFulfilled: {
      id: "promisedFulfilled",
      label: "Employer fulfilled a promise",
      description: "Employer kept a non-monetary promise made to the hireling.",
      loyaltyChange: +1,
    },
    payDelayed: {
      id: "payDelayed",
      label: "Pay delayed or shorted",
      description: "Wages paid late or reduced without agreement.",
      loyaltyChange: -1,
    },
    dangerBeyondContract: {
      id: "dangerBeyondContract",
      label: "Danger beyond contracted scope",
      description:
        "Hireling ordered into situations clearly more dangerous than agreed upon.",
      loyaltyChange: -2,
    },
    lifeThreatenedByEmployer: {
      id: "lifeThreatenedByEmployer",
      label: "Life threatened by employer actions",
      description:
        "Employer's decisions or negligence directly endangered the hireling's life.",
      loyaltyChange: -3,
    },
    insultedMistreated: {
      id: "insultedMistreated",
      label: "Insulted or mistreated",
      description:
        "Employer verbally abused, humiliated, or physically mistreated the hireling.",
      loyaltyChange: -2,
    },
    witnessedCruelty: {
      id: "witnessedCruelty",
      label: "Witnessed employer cruelty",
      description:
        "Hireling witnessed employer commit acts they find morally reprehensible.",
      loyaltyChange: -2,
    },
    abandonedInDanger: {
      id: "abandonedInDanger",
      label: "Abandoned in danger",
      description: "Employer fled or failed to aid hireling when they were in peril.",
      loyaltyChange: -4,
    },
    promiseBroken: {
      id: "promiseBroken",
      label: "Employer broke a promise",
      description: "Employer failed to keep a non-monetary promise.",
      loyaltyChange: -2,
    },
    enemyBribe: {
      id: "enemyBribe",
      label: "Offered bribe by enemy",
      description:
        "Enemy has offered the hireling coin or favors to betray or abandon their employer.",
      loyaltyChange: 0, // Triggers a morale check instead; outcome determines loyalty shift
      note: "Triggers a morale check. On failure, hireling considers the bribe. Loyalty change depends on outcome.",
    },
  },
};

// ---------------------------------------------------------------------------
// LOYALTY THRESHOLDS
// ---------------------------------------------------------------------------

/**
 * Describes hireling behavior at each loyalty band.
 * Each threshold covers a range of loyalty scores.
 */
export const LOYALTY_THRESHOLDS = [
  {
    id: "betrayal",
    label: "Treacherous",
    range: [0, 3],
    description:
      "The hireling is actively hostile or planning to betray the party. They will flee at the first opportunity, sell information to enemies, or outright attack if they see an advantage.",
    behaviors: [
      "Will flee combat immediately",
      "May alert enemies to party location",
      "Will accept bribes from enemies",
      "Will lie and steal from employer",
      "Will not perform contracted duties",
    ],
    willFight: false,
    willFollowOrders: false,
    moraleDCModifier: +4,
  },
  {
    id: "unreliable",
    label: "Unreliable",
    range: [4, 7],
    description:
      "The hireling is disgruntled and performing only the bare minimum. They will refuse dangerous tasks, may be slow or careless, and are looking for a better offer.",
    behaviors: [
      "Refuses obviously dangerous tasks",
      "Works slowly or carelessly",
      "Complains frequently",
      "May consider enemy bribes",
      "Will desert if given a good opportunity",
    ],
    willFight: false,
    willFollowOrders: false,
    moraleDCModifier: +2,
  },
  {
    id: "reliable",
    label: "Reliable",
    range: [8, 12],
    description:
      "The hireling performs their job professionally and fulfills the terms of their contract. They won't go above and beyond, but they won't let the party down on routine tasks.",
    behaviors: [
      "Performs contracted duties fully",
      "Will fight if it falls within contract",
      "Requires persuasion for extra risks",
      "Ignores most enemy bribes",
      "Will leave if consistently mistreated",
    ],
    willFight: true, // Within contracted scope
    willFollowOrders: true,
    moraleDCModifier: 0,
  },
  {
    id: "loyal",
    label: "Loyal",
    range: [13, 16],
    description:
      "The hireling genuinely respects their employer and will take reasonable risks beyond the contract. They consider themselves part of the group and act accordingly.",
    behaviors: [
      "Will take risks beyond contract scope",
      "Defends employer without being asked",
      "Refuses enemy bribes",
      "Shares useful information proactively",
      "Stays even when pay is delayed briefly",
    ],
    willFight: true,
    willFollowOrders: true,
    moraleDCModifier: -2,
  },
  {
    id: "devoted",
    label: "Devoted",
    range: [17, 20],
    description:
      "The hireling is utterly devoted to their employer. They will risk — and potentially sacrifice — their life without hesitation. They see their employer's cause as their own.",
    behaviors: [
      "Will risk life without hesitation",
      "Cannot be bribed by enemies",
      "Stays through pay delays and hardship",
      "Acts on employer's behalf independently",
      "Will take suicidal actions if ordered",
    ],
    willFight: true,
    willFollowOrders: true,
    moraleDCModifier: -4,
  },
];

// ---------------------------------------------------------------------------
// RETAINER RULES
// ---------------------------------------------------------------------------

/**
 * Rules for class-feature or reputation-based followers (sidekicks and retainers).
 * Based on Tasha's Cauldron of Everything Sidekick rules and DMG guidance.
 */
export const RETAINER_RULES = {
  overview:
    "Retainers differ from hirelings in that they are gained through class features, quests, or reputation rather than simple payment. They level up alongside the party and share XP.",

  sidekickTypes: {
    warrior: {
      id: "warrior",
      name: "Warrior Sidekick",
      description:
        "A combat-focused companion. Gains martial abilities as they level. Proficient with all armor and martial weapons.",
      hitDieType: "d8",
      primaryAbility: "STR or DEX",
      savingThrows: ["STR", "CON"],
      features: {
        level1: "Martial Role — choose Attacker, Defender, or Protector",
        level2: "Ability Score Improvement or Feat",
        level3: "Improved Critical (19–20) or Bonus Attack",
        level6: "Extra Attack",
        level10: "Ability Score Improvement or Feat",
        level14: "Improved Defense",
        level18: "Ability Score Improvement or Feat",
      },
      armorProficiencies: ["Light", "Medium", "Heavy", "Shields"],
      weaponProficiencies: ["Simple", "Martial"],
    },

    expert: {
      id: "expert",
      name: "Expert Sidekick",
      description:
        "A skill-focused companion. Gains expertise and utility features. Proficient with light armor and simple weapons.",
      hitDieType: "d8",
      primaryAbility: "DEX or INT",
      savingThrows: ["DEX", "INT"],
      features: {
        level1: "Bonus Proficiencies + Helpful (can use Help as bonus action)",
        level2: "Cunning Action (Dash, Disengage, or Hide as bonus action)",
        level3: "Expertise in two skills",
        level6: "Coordinated Strike (add 1d6 damage when using Help)",
        level8: "Ability Score Improvement or Feat",
        level10: "Expertise in two more skills",
        level12: "Sharp Mind (add INT modifier to Initiative)",
        level14: "Ability Score Improvement or Feat",
        level18: "Ability Score Improvement or Feat",
      },
      armorProficiencies: ["Light"],
      weaponProficiencies: ["Simple"],
    },

    spellcaster: {
      id: "spellcaster",
      name: "Spellcaster Sidekick",
      description:
        "A magic-using companion. Gains spells and magical features. Choose a spellcasting role: Mage, Healer, or Prodigy.",
      hitDieType: "d6",
      primaryAbility: "INT, WIS, or CHA",
      savingThrows: ["WIS", "CHA"],
      features: {
        level1:
          "Spellcasting (role determines spell list: arcane/divine/primal) + 2 cantrips + 2 1st-level spells",
        level2: "Ability Score Improvement or Feat",
        level3: "Magical Role feature (varies by role)",
        level4: "2nd-level spell slots",
        level6: "Empowered Spells (reroll 1 damage die, keep new result)",
        level8: "Ability Score Improvement or Feat",
        level10: "3rd-level spell slots",
        level12: "Ability Score Improvement or Feat",
        level14: "4th-level spell slots",
        level18: "Ability Score Improvement or Feat",
      },
      armorProficiencies: ["Light"],
      weaponProficiencies: ["Simple", "Hand crossbow", "Light crossbow"],
      spellcastingAbility: "INT (Mage), WIS (Healer), CHA (Prodigy)",
    },
  },

  levelProgression: {
    description:
      "Sidekicks use a simplified progression table and level at the same time as the party.",
    xpShare:
      "Half share: when dividing XP, the sidekick counts as half a party member. Example: 4 party members + 1 sidekick = divide by 4.5.",
    levelCap:
      "Sidekicks can reach up to the level of the lowest-level party member, or DM's discretion.",
    startingLevel:
      "Sidekick typically starts at level 1, regardless of when they join. DM may grant starting level equal to half the party's level for later additions.",
    abilityScoreIncreases:
      "Sidekicks gain ASIs at levels 4, 8, 12, 16, and 19 (standard 5e progression).",
  },

  deathAndResurrection: {
    death:
      "A sidekick that drops to 0 HP makes death saving throws like a PC. If they die, the employer may seek resurrection.",
    resurrection: {
      revivify: "Requires 300 gp diamond + action. Works within 1 minute of death.",
      raiseDead:
        "Requires 500 gp diamond + 1 hour ritual. Works within 10 days. Sidekick suffers -4 to all rolls for 1d4 days.",
      resurrection:
        "Requires 1,000 gp diamond + 1 hour. Works within 100 years. Requires willing soul.",
    },
    loyaltyImpact:
      "Failing to attempt resurrection when possible (and resources allow) reduces party reputation and may affect other NPC relationships.",
    permaDeath:
      "DM may rule that certain deaths are permanent (e.g., soul consumed, destroyed by a lich). Discuss at Session Zero.",
  },

  reputationFollowers: {
    description:
      "High-reputation parties attract followers without class features. These use standard hireling rules but may have reduced or waived costs.",
    reputationThresholds: {
      local: "Known in a town or village — minor followers offer discounts (10–25%).",
      regional: "Known across a region — skilled followers seek the party out.",
      national: "Famous across a kingdom — retainers with unique backgrounds appear.",
      legendary: "Legendary status — devoted followers, potential sidekick candidates.",
    },
  },
};

// ---------------------------------------------------------------------------
// MORALE CHECKS
// ---------------------------------------------------------------------------

/**
 * Situations that trigger a morale check, and the base DC to pass.
 * A hireling passes the check by rolling a d20 + their loyalty modifier (loyalty - 10, similar to ability modifier).
 * Success: they stay and continue. Failure: see outcome field.
 *
 * Base DC for all checks is 10, modified by the situation and loyalty threshold.
 */
export const MORALE_CHECKS = {
  baseDC: 10,

  loyaltyModifierFormula:
    "Loyalty modifier = floor((loyaltyScore - 10) / 2), matching standard 5e ability modifier math.",

  triggers: {
    allyDropped: {
      id: "allyDropped",
      label: "An ally drops to 0 HP",
      description:
        "The hireling witnesses a fellow party member or hireling fall in combat.",
      dc: 10,
      outcome:
        "Failure: hireling uses their turn to flee or cower (Dodge action, moves away from combat each turn).",
    },
    halfPartyDown: {
      id: "halfPartyDown",
      label: "Half the party is incapacitated",
      description:
        "50% or more of the hiring party (not counting hirelings) are down or dead.",
      dc: 13,
      outcome:
        "Failure: hireling flees at full speed toward the nearest exit. They may be recovered after combat.",
    },
    obviousDanger: {
      id: "obviousDanger",
      label: "Ordered into obvious suicidal danger",
      description:
        "The hireling is commanded to perform an action that seems clearly lethal (e.g., charge a dragon, enter a collapsing building).",
      dc: 15,
      outcome:
        "Failure: hireling refuses the order and steps back. A second failure (next round) results in full desertion.",
    },
    enemyBribeOffered: {
      id: "enemyBribeOffered",
      label: "Offered a bribe by an enemy",
      description:
        "An enemy has offered money, freedom, or favors in exchange for betrayal or desertion.",
      dc: 12,
      outcome:
        "Failure: hireling is tempted. They do not immediately betray, but lose 2 loyalty and may act on it later (DM discretion). Critical failure (5 or below): immediate betrayal.",
    },
    witnessedHorror: {
      id: "witnessedHorror",
      label: "Witnessed something terrifying",
      description:
        "The hireling saw something deeply horrifying — undead, aberrations, fiends, or extreme violence.",
      dc: 11,
      outcome:
        "Failure: hireling is frightened (per condition) until the source is no longer visible or for 1 minute. Repeated failures may cause permanent -1 to loyalty.",
    },
    leaderKilled: {
      id: "leaderKilled",
      label: "Primary employer killed",
      description:
        "The character who hired and commands the hireling is killed in front of them.",
      dc: 14,
      outcome:
        "Failure: hireling flees. Success: they follow the next highest-loyalty party member. Loyalty immediately drops by 2.",
    },
  },
};

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Retrieve a hireling type definition by its ID.
 * @param {string} typeId - The hireling type ID (e.g., "guard", "spy").
 * @returns {Object|null} The hireling type object, or null if not found.
 */
export function getHirelingType(typeId) {
  if (!typeId || typeof typeId !== "string") return null;
  return HIRELING_TYPES[typeId] ?? null;
}

/**
 * Calculate the total cost of hiring a hireling for a given duration.
 * Handles variable-cost roles (craftsman) by returning a range string.
 *
 * @param {Object} hirelingType - A hireling type object from HIRELING_TYPES.
 * @param {number} durationDays - Number of days to hire.
 * @returns {{ totalGP: number|null, display: string, note: string|null }}
 */
export function calculateDailyCost(hirelingType, durationDays) {
  if (!hirelingType || typeof durationDays !== "number" || durationDays <= 0) {
    return { totalGP: null, display: "Invalid input", note: null };
  }

  if (hirelingType.dailyCostGP === null) {
    return {
      totalGP: null,
      display: `Variable — see notes`,
      note: hirelingType.costNote,
    };
  }

  const totalGP = hirelingType.dailyCostGP * durationDays;

  // Format display string
  let display;
  if (totalGP < 1) {
    display = `${Math.round(totalGP * 10)} sp total (${durationDays} day${durationDays !== 1 ? "s" : ""} × ${hirelingType.dailyCostDisplay})`;
  } else {
    const rounded = Math.round(totalGP * 100) / 100;
    display = `${rounded} gp total (${durationDays} day${durationDays !== 1 ? "s" : ""} × ${hirelingType.dailyCostDisplay})`;
  }

  return {
    totalGP,
    display,
    note: hirelingType.costNote ?? null,
  };
}

/**
 * Apply a loyalty event to a current loyalty score and return the new score.
 * Score is clamped between 0 and 20.
 *
 * @param {number} currentLoyalty - Current loyalty score (0–20).
 * @param {string} eventId - Key from LOYALTY_SYSTEM.events (e.g., "paidOnTime").
 * @returns {{ newLoyalty: number, change: number, label: string, clamped: boolean }}
 */
export function modifyLoyalty(currentLoyalty, eventId) {
  if (
    typeof currentLoyalty !== "number" ||
    currentLoyalty < 0 ||
    currentLoyalty > 20
  ) {
    return { newLoyalty: currentLoyalty, change: 0, label: "Invalid loyalty score", clamped: false };
  }

  const event = LOYALTY_SYSTEM.events[eventId];
  if (!event) {
    return { newLoyalty: currentLoyalty, change: 0, label: "Unknown event", clamped: false };
  }

  const raw = currentLoyalty + event.loyaltyChange;
  const newLoyalty = Math.min(20, Math.max(0, raw));
  const clamped = raw !== newLoyalty;

  return {
    newLoyalty,
    change: event.loyaltyChange,
    label: event.label,
    clamped,
    note: event.note ?? null,
  };
}

/**
 * Determine which loyalty threshold band applies to a given loyalty score.
 *
 * @param {number} score - Loyalty score (0–20).
 * @returns {Object|null} The matching threshold object from LOYALTY_THRESHOLDS, or null.
 */
export function getLoyaltyThreshold(score) {
  if (typeof score !== "number") return null;
  return (
    LOYALTY_THRESHOLDS.find(
      (threshold) => score >= threshold.range[0] && score <= threshold.range[1]
    ) ?? null
  );
}

/**
 * Perform a morale check for a hireling given their loyalty score and situation.
 * Returns the DC, the hireling's modifier, a simulated roll, and pass/fail result.
 *
 * Note: In a real game session, the DM rolls. This function can simulate or
 * calculate threshold information for display purposes.
 *
 * @param {number} loyaltyScore - Hireling's current loyalty score (0–20).
 * @param {string} situationId - Key from MORALE_CHECKS.triggers.
 * @param {number|null} [diceRoll=null] - Optional explicit d20 roll (1–20). If null, simulates a roll.
 * @returns {{
 *   dc: number,
 *   loyaltyModifier: number,
 *   roll: number,
 *   total: number,
 *   passed: boolean,
 *   situation: Object,
 *   outcome: string
 * }|null}
 */
export function checkMorale(loyaltyScore, situationId, diceRoll = null) {
  if (typeof loyaltyScore !== "number") return null;

  const situation = MORALE_CHECKS.triggers[situationId];
  if (!situation) return null;

  const threshold = getLoyaltyThreshold(loyaltyScore);
  const thresholdDCMod = threshold ? threshold.moraleDCModifier : 0;
  const dc = situation.dc + thresholdDCMod;

  // Loyalty modifier: treat loyalty like an ability score (10 = +0, 12 = +1, etc.)
  const loyaltyModifier = Math.floor((loyaltyScore - 10) / 2);

  // Roll: use provided value or simulate
  const roll =
    diceRoll !== null
      ? Math.min(20, Math.max(1, Math.round(diceRoll)))
      : Math.ceil(Math.random() * 20);

  const total = roll + loyaltyModifier;
  const passed = total >= dc;

  return {
    dc,
    loyaltyModifier,
    roll,
    total,
    passed,
    situation,
    outcome: passed
      ? "The hireling steels themselves and continues."
      : situation.outcome,
    thresholdLabel: threshold ? threshold.label : "Unknown",
  };
}

/**
 * Generate a basic hireling NPC record of the given type and level.
 * Returns a plain object suitable for saving to party/campaign state.
 *
 * @param {string} type - A key from HIRELING_TYPES (e.g., "guard").
 * @param {number} [level=1] - Approximate experience level (1–10). Scales HP and bonuses.
 * @param {number} [employerCHAModifier=0] - Employer's CHA modifier for starting loyalty.
 * @returns {Object|null} A hireling record object, or null if type is invalid.
 */
export function generateHireling(type, level = 1, employerCHAModifier = 0) {
  const hirelingType = getHirelingType(type);
  if (!hirelingType) return null;

  const clampedLevel = Math.min(10, Math.max(1, Math.round(level)));
  const startingLoyalty = LOYALTY_SYSTEM.calculateStartingLoyalty(employerCHAModifier);

  // Scale HP roughly by level: base 8 + (level-1)*5, modified by type
  const hpBases = {
    porter: 6,
    skilledLaborer: 6,
    guide: 10,
    guard: 11,
    mercenary: 14,
    healer: 8,
    sageTutor: 6,
    spy: 10,
    assassin: 12,
    craftsman: 7,
    animalHandler: 8,
    cook: 6,
  };
  const hpBase = hpBases[type] ?? 8;
  const hp = hpBase + (clampedLevel - 1) * 4;

  // Proficiency bonus by level (standard 5e)
  const profBonus = clampedLevel <= 4 ? 2 : clampedLevel <= 8 ? 3 : 4;

  const threshold = getLoyaltyThreshold(startingLoyalty);

  return {
    id: `hireling_${type}_${Date.now()}`,
    name: `${hirelingType.name} (Level ${clampedLevel})`,
    type,
    typeName: hirelingType.name,
    level: clampedLevel,
    hp,
    maxHP: hp,
    proficiencyBonus: profBonus,
    loyaltyScore: startingLoyalty,
    loyaltyThreshold: threshold ? threshold.label : "Reliable",
    skills: hirelingType.skills,
    statBlockRef: hirelingType.statBlockRef,
    dailyCostGP: hirelingType.dailyCostGP,
    dailyCostDisplay: hirelingType.dailyCostDisplay,
    riskTolerance: hirelingType.riskTolerance,
    notes: hirelingType.notes,
    costNote: hirelingType.costNote ?? null,
    createdAt: new Date().toISOString(),
    active: true,
    paymentLog: [],
    loyaltyHistory: [
      {
        event: "hired",
        label: "Initial hiring",
        change: 0,
        resultScore: startingLoyalty,
        timestamp: new Date().toISOString(),
      },
    ],
  };
}
