/**
 * @file initiativeVariants.js
 * @description Initiative system variants, combat order rules, and related helper functions
 * for D&D 5e and optional/variant rule systems.
 *
 * Covers standard initiative, DMG variants, Unearthed Arcana rules, and community variants.
 * Includes bonuses from class features, feats, and spells, as well as surprise rules.
 *
 * No React dependencies — pure data and utility functions.
 */

// ---------------------------------------------------------------------------
// STANDARD INITIATIVE
// ---------------------------------------------------------------------------

/**
 * Standard initiative rules as described in the D&D 5e Player's Handbook (PHB p.177).
 * Each combatant rolls a d20 and adds their Dexterity modifier.
 */
export const STANDARD_INITIATIVE = {
  id: "standard",
  name: "Standard Initiative",
  source: "PHB p.177",
  description:
    "Each combatant rolls a d20 at the start of combat and adds their Dexterity modifier. " +
    "Results are arranged from highest to lowest to determine turn order. " +
    "Initiative is rolled once at the start of combat and persists until combat ends.",
  dieSize: 20,
  modifier: "dexterity",
  rolledOnce: true,
  tieBreakerOptions: [
    {
      id: "higher_dex",
      label: "Higher DEX score wins",
      description: "The combatant with the higher Dexterity score acts first.",
    },
    {
      id: "reroll",
      label: "Re-roll to break tie",
      description: "Tied combatants each roll again; highest result goes first.",
    },
    {
      id: "player_first",
      label: "Player characters go first",
      description: "When tied with a monster, the player character acts first.",
    },
    {
      id: "dm_decides",
      label: "DM decides",
      description: "The DM determines the order for tied combatants.",
    },
  ],
  notes: [
    "Monsters often use the same initiative roll for a group of identical creatures.",
    "Initiative can be voluntarily delayed to act later in the same round (DM's discretion).",
  ],
};

// ---------------------------------------------------------------------------
// VARIANT RULES
// ---------------------------------------------------------------------------

/**
 * Optional and variant initiative systems from official sources and popular community variants.
 */
export const VARIANT_RULES = [
  {
    id: "side_initiative",
    name: "Side Initiative",
    source: "DMG p.270",
    description:
      "Rather than each creature rolling individually, one player rolls a d20 for all player " +
      "characters and the DM rolls a d20 for all monsters. The side with the higher result acts " +
      "first, with all members of that side acting in any order the players or DM choose. " +
      "Initiative is re-rolled at the start of each new round.",
    dieSize: 20,
    modifier: null,
    rerollEachRound: true,
    groupBySide: true,
    pros: [
      "Faster to run — only two rolls per round.",
      "Encourages teamwork and coordinated tactics within a side.",
    ],
    cons: [
      "Less individual granularity; all allies act in a block.",
      "Can feel less dramatic than individual initiative.",
    ],
  },
  {
    id: "speed_factor",
    name: "Speed Factor Initiative",
    source: "DMG p.270–271",
    description:
      "Initiative is modified by the type of action a creature declares at the start of its " +
      "turn. Light or finesse weapons grant a +2 bonus, heavy weapons impose a -5 penalty, and " +
      "spells impose a penalty equal to the spell's level. Modifiers are applied after the " +
      "initial d20 + DEX roll.",
    dieSize: 20,
    modifier: "dexterity",
    rerollEachRound: false,
    modifiers: {
      lightWeapon: { label: "Light / Finesse weapon attack", value: 2 },
      oneHandedWeapon: { label: "One-handed weapon attack (not light)", value: 0 },
      heavyWeapon: { label: "Heavy weapon attack", value: -5 },
      rangedWeapon: { label: "Ranged weapon attack", value: 0 },
      spell: {
        label: "Cast a spell",
        value: "negativeSpellLevel",
        note: "Penalty equals the spell's level (cantrips = -0).",
      },
      other: { label: "Other action (dash, dodge, help, etc.)", value: 0 },
    },
    pros: [
      "Rewards tactical decisions about which weapon or spell to use.",
      "Creates meaningful tradeoffs between power and speed.",
    ],
    cons: [
      "Requires declaring actions before initiative is fully resolved.",
      "Adds bookkeeping complexity.",
    ],
  },
  {
    id: "greyhawk_initiative",
    name: "Greyhawk Initiative",
    source: "Unearthed Arcana: Greyhawk Initiative (2017)",
    description:
      "Each player rolls a different die depending on the action they intend to take. " +
      "Lower results act first (the system is reversed from standard — 1 is best). " +
      "Initiative is re-rolled every round, and players must declare their intended action " +
      "before rolling. Changing actions mid-round may impose a penalty at the DM's discretion.",
    rerollEachRound: true,
    lowerIsBetter: true,
    actionDice: {
      melee: {
        label: "Melee attack",
        die: "d4",
        dieSize: 4,
        note: "Fast, reactive fighting.",
      },
      ranged: {
        label: "Ranged attack",
        die: "d6",
        dieSize: 6,
        note: "Requires aiming; slightly slower.",
      },
      movement: {
        label: "Move only (no action)",
        die: "d8",
        dieSize: 8,
        note: "Repositioning without acting.",
      },
      spell: {
        label: "Cast a spell",
        die: "d10",
        dieSize: 10,
        note: "Concentration and verbal components take time.",
      },
      bonusAction: {
        label: "Bonus action",
        die: "d12",
        dieSize: 12,
        note: "Secondary actions are resolved last.",
      },
    },
    modifier: null,
    pros: [
      "Creates a highly dynamic round — initiative changes every turn.",
      "Rewards choosing fast actions tactically.",
      "Spellcasters are naturally slower, balancing power vs. speed.",
    ],
    cons: [
      "Requires pre-declaration of actions, which can feel restrictive.",
      "More dice rolling and bookkeeping per round.",
      "May slow down play at larger tables.",
    ],
  },
  {
    id: "popcorn_initiative",
    name: "Popcorn Initiative",
    source: "Community Variant (popularized by Ginny Di / Matt Colville)",
    description:
      "The first actor is determined by a single d20 roll (or the DM nominates a creature). " +
      "After each creature completes its turn, that creature chooses which other combatant acts " +
      "next — ally or enemy. The last creature to act in a round chooses who acts first in the " +
      "next round.",
    dieSize: 20,
    modifier: null,
    rerollEachRound: false,
    chooserRules: {
      normalTurn: "Current actor chooses next actor from any remaining combatants.",
      lastInRound: "Last actor in the round chooses who goes first in the next round.",
    },
    pros: [
      "Highly collaborative — players feel involved even when it is not their turn.",
      "Creates emergent narrative moments and tactical complexity.",
      "No initiative tracker needed beyond a simple list.",
    ],
    cons: [
      "Can be gamed by players who always pass to the same powerful ally.",
      "Enemies choosing next combatant may frustrate players.",
      "Less predictable pacing.",
    ],
  },
  {
    id: "narrative_initiative",
    name: "Narrative Initiative",
    source: "Community Variant / OSR Tradition",
    description:
      "The DM determines the order of actions based on what makes sense in the fiction. " +
      "No dice are rolled for initiative. The DM considers factors such as who acted first " +
      "narratively, distance, weapon reach, and dramatic timing.",
    dieSize: null,
    modifier: null,
    rerollEachRound: false,
    dmControlled: true,
    pros: [
      "Maximum narrative flexibility and immersion.",
      "Zero bookkeeping.",
      "Ideal for theater-of-the-mind play.",
    ],
    cons: [
      "Requires a confident, experienced DM to run fairly.",
      "Players may feel their agency is reduced.",
      "Can appear arbitrary without clear guiding principles.",
    ],
  },
  {
    id: "countdown_initiative",
    name: "Countdown Initiative",
    source: "Community Variant",
    description:
      "All combatants start at initiative count 30. Each action has an associated cost " +
      "(in initiative counts). A creature acts, subtracts the cost of its action from its " +
      "current count, and then waits until that new count comes around. The creature with " +
      "the lowest count acts first (or next). Lower counts act first.",
    startingCount: 30,
    lowerActsFirst: true,
    rerollEachRound: false,
    actionCosts: {
      lightAttack: { label: "Attack with light weapon", cost: 4 },
      normalAttack: { label: "Attack with standard weapon", cost: 6 },
      heavyAttack: { label: "Attack with heavy weapon", cost: 8 },
      cantrip: { label: "Cast a cantrip", cost: 5 },
      leveledSpell: { label: "Cast a leveled spell", cost: "5 + spell level" },
      move: { label: "Move up to full speed", cost: 3 },
      bonus: { label: "Bonus action", cost: 2 },
      reaction: { label: "Reaction", cost: 0 },
      dash: { label: "Dash action", cost: 3 },
      dodge: { label: "Dodge action", cost: 5 },
      help: { label: "Help action", cost: 4 },
    },
    pros: [
      "Faster actions feel meaningfully faster — light weapons truly have an advantage.",
      "No fixed rounds — combat flows continuously.",
      "Easy to understand once learned.",
    ],
    cons: [
      "High bookkeeping — every player must track their current count.",
      "Requires DM buy-in and consistent action cost rulings.",
      "Less familiar to new players.",
    ],
  },
];

// ---------------------------------------------------------------------------
// INITIATIVE BONUSES
// ---------------------------------------------------------------------------

/**
 * Class features, feats, spells, and racial traits that modify initiative rolls or order.
 */
export const INITIATIVE_BONUSES = [
  {
    id: "alert_feat",
    name: "Alert",
    type: "feat",
    source: "PHB p.165",
    bonus: 5,
    bonusType: "flat",
    modifier: "+5 to initiative rolls",
    additionalBenefits: [
      "Cannot be surprised while conscious.",
      "Other creatures do not gain advantage on attack rolls against you as a result of being unseen by you.",
    ],
    stacksWithAdvantage: true,
  },
  {
    id: "dexterity_modifier",
    name: "Dexterity Modifier",
    type: "ability_score",
    source: "PHB p.177",
    bonus: "dexMod",
    bonusType: "ability_modifier",
    modifier: "DEX modifier added to d20 roll",
    note: "The default modifier for standard initiative. A +5 DEX mod adds +5 to the roll.",
  },
  {
    id: "war_wizard_tactical_wit",
    name: "Tactical Wit (War Wizard)",
    type: "class_feature",
    source: "Xanathar's Guide to Everything p.59",
    bonus: "intelligenceMod",
    bonusType: "ability_modifier",
    modifier: "Add INT modifier to initiative rolls",
    class: "Wizard",
    subclass: "War Magic",
    level: 2,
    note: "Adds Intelligence modifier (not DEX) on top of the standard DEX modifier roll.",
  },
  {
    id: "swashbuckler_fancy_footwork",
    name: "Panache / Rakish Audacity (Swashbuckler)",
    type: "class_feature",
    source: "Xanathar's Guide to Everything p.47",
    bonus: "charismaMod",
    bonusType: "ability_modifier",
    modifier: "Add CHA modifier to initiative rolls",
    class: "Rogue",
    subclass: "Swashbuckler",
    level: 3,
    note: "Adds Charisma modifier to initiative rolls in addition to DEX.",
  },
  {
    id: "barbarian_feral_instinct",
    name: "Feral Instinct",
    type: "class_feature",
    source: "PHB p.49",
    bonus: "advantage",
    bonusType: "advantage",
    modifier: "Advantage on initiative rolls",
    class: "Barbarian",
    level: 7,
    additionalBenefits: [
      "If surprised at the start of combat and not incapacitated, you can act normally on your first turn if you enter a rage before doing anything else.",
    ],
  },
  {
    id: "gift_of_alacrity",
    name: "Gift of Alacrity",
    type: "spell",
    source: "Explorer's Guide to Wildemount p.187",
    bonus: "1d8",
    bonusType: "die_roll",
    dieSize: 8,
    modifier: "+1d8 to initiative rolls",
    duration: "8 hours",
    level: 1,
    school: "Divination",
    note: "A 1st-level spell that adds a d8 to the target's initiative rolls for the duration.",
  },
  {
    id: "gloom_stalker_dread_ambusher",
    name: "Dread Ambusher (Gloom Stalker)",
    type: "class_feature",
    source: "Xanathar's Guide to Everything p.41",
    bonus: "wisdomMod",
    bonusType: "ability_modifier",
    modifier: "Add WIS modifier to initiative rolls",
    class: "Ranger",
    subclass: "Gloom Stalker",
    level: 3,
    additionalBenefits: [
      "At the start of your first turn in combat, your walking speed increases by 10 ft.",
      "If you take the Attack action on that first turn, you can make one additional weapon attack as part of that action.",
      "That additional attack deals an extra 1d8 damage on a hit.",
    ],
  },
];

// ---------------------------------------------------------------------------
// SURPRISE RULES
// ---------------------------------------------------------------------------

/**
 * Rules governing the surprised condition and how it affects combat order.
 */
export const SURPRISE_RULES = {
  source: "PHB p.189",
  overview:
    "If a group of adventurers (or their enemies) encounters the opposing side while being stealthy, " +
    "those who were not aware of the encounter may be surprised. A surprised creature cannot move, " +
    "take actions, or take reactions on its first turn in combat, and it loses its turn if initiative " +
    "was already determined.",
  conditions: {
    surprised: {
      label: "Surprised",
      effects: [
        "Cannot move on first turn.",
        "Cannot take actions on first turn.",
        "Cannot take reactions until first turn ends.",
      ],
      endsAfter: "First turn in combat is complete.",
    },
    notSurprised: {
      label: "Not Surprised",
      note: "A creature is not surprised if it notices the ambush, or if a feature prevents surprise.",
    },
  },
  determiningSurprise:
    "The DM compares the Dexterity (Stealth) checks of those attempting to hide against the " +
    "passive Wisdom (Perception) scores of those who might notice them. Anyone whose passive " +
    "Perception is lower than the highest relevant Stealth check is surprised.",
  featuresAndAbilities: [
    {
      id: "alert_feat_surprise",
      name: "Alert (Feat)",
      source: "PHB p.165",
      effect: "You cannot be surprised while conscious.",
      preventsSuprise: true,
    },
    {
      id: "assassin_assassinate",
      name: "Assassinate (Assassin Rogue)",
      source: "PHB p.97",
      class: "Rogue",
      subclass: "Assassin",
      level: 3,
      effect:
        "You have advantage on attack rolls against creatures that have not yet taken a turn in combat. " +
        "Any hit you score against a surprised creature is automatically a critical hit.",
      triggersOnSurprise: true,
      note:
        "Assassinate applies to any creature that hasn't acted yet — not exclusively surprised creatures — " +
        "but the automatic critical hit applies only to surprised targets.",
    },
    {
      id: "feral_instinct_surprise",
      name: "Feral Instinct (Barbarian)",
      source: "PHB p.49",
      class: "Barbarian",
      level: 7,
      effect:
        "If surprised at the start of combat and not incapacitated, you can still act on your first " +
        "turn if you enter a rage before doing anything else. The surprised condition is effectively " +
        "bypassed if you immediately rage.",
      preventsSuprise: false,
      bypassesSurprise: true,
    },
    {
      id: "gloom_stalker_umbral_sight",
      name: "Umbral Sight (Gloom Stalker)",
      source: "Xanathar's Guide to Everything p.42",
      class: "Ranger",
      subclass: "Gloom Stalker",
      level: 3,
      effect:
        "You are invisible to creatures relying on darkvision. This makes you harder to detect " +
        "when ambushing in darkness, increasing the chance enemies are surprised.",
      preventsSuprise: false,
      aidsInSurprise: true,
    },
  ],
};

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Rolls a standard initiative check for one combatant.
 *
 * @param {number} dexMod - The combatant's Dexterity modifier (can be negative).
 * @param {Object} [bonuses={}] - Optional feature bonuses.
 * @param {boolean} [bonuses.alertFeat] - True if the combatant has the Alert feat.
 * @param {number}  [bonuses.warWizardIntMod] - INT modifier from War Wizard Tactical Wit.
 * @param {number}  [bonuses.swashbucklerChaMod] - CHA modifier from Swashbuckler Rakish Audacity.
 * @param {boolean} [bonuses.feralInstinct] - True if the combatant has Feral Instinct (advantage).
 * @param {number}  [bonuses.wisdomMod] - WIS modifier from Gloom Stalker Dread Ambusher.
 * @param {boolean} [bonuses.giftOfAlacrity] - True if the combatant is under Gift of Alacrity.
 * @returns {{ roll: number, total: number, breakdown: string[] }}
 */
export function rollStandardInitiative(dexMod = 0, bonuses = {}) {
  const rollDie = (sides) => Math.floor(Math.random() * sides) + 1;

  let d20Roll;
  const breakdown = [];

  if (bonuses.feralInstinct) {
    const roll1 = rollDie(20);
    const roll2 = rollDie(20);
    d20Roll = Math.max(roll1, roll2);
    breakdown.push(`d20 (advantage): [${roll1}, ${roll2}] → ${d20Roll}`);
  } else {
    d20Roll = rollDie(20);
    breakdown.push(`d20: ${d20Roll}`);
  }

  let total = d20Roll + dexMod;
  breakdown.push(`DEX modifier: ${dexMod >= 0 ? "+" : ""}${dexMod}`);

  if (bonuses.alertFeat) {
    total += 5;
    breakdown.push("Alert feat: +5");
  }

  if (typeof bonuses.warWizardIntMod === "number") {
    total += bonuses.warWizardIntMod;
    breakdown.push(
      `War Wizard (Tactical Wit) INT mod: ${bonuses.warWizardIntMod >= 0 ? "+" : ""}${bonuses.warWizardIntMod}`
    );
  }

  if (typeof bonuses.swashbucklerChaMod === "number") {
    total += bonuses.swashbucklerChaMod;
    breakdown.push(
      `Swashbuckler (Rakish Audacity) CHA mod: ${bonuses.swashbucklerChaMod >= 0 ? "+" : ""}${bonuses.swashbucklerChaMod}`
    );
  }

  if (typeof bonuses.wisdomMod === "number") {
    total += bonuses.wisdomMod;
    breakdown.push(
      `Gloom Stalker (Dread Ambusher) WIS mod: ${bonuses.wisdomMod >= 0 ? "+" : ""}${bonuses.wisdomMod}`
    );
  }

  if (bonuses.giftOfAlacrity) {
    const alacRoll = rollDie(8);
    total += alacRoll;
    breakdown.push(`Gift of Alacrity: +${alacRoll} (d8)`);
  }

  breakdown.push(`Total: ${total}`);
  return { roll: d20Roll, total, breakdown };
}

/**
 * Rolls for Side Initiative (DMG variant).
 * Returns an object with the players' roll and monsters' roll.
 *
 * @returns {{ players: number, monsters: number, winner: "players" | "monsters" | "tie" }}
 */
export function rollSideInitiative() {
  const players = Math.floor(Math.random() * 20) + 1;
  const monsters = Math.floor(Math.random() * 20) + 1;
  let winner;
  if (players > monsters) winner = "players";
  else if (monsters > players) winner = "monsters";
  else winner = "tie";
  return { players, monsters, winner };
}

/**
 * Calculates the initiative modifier for the Speed Factor variant (DMG).
 *
 * @param {"light" | "oneHanded" | "heavy" | "ranged" | "spell" | "other"} actionType
 *   The broad category of action being taken.
 * @param {"light" | "normal" | "heavy" | null} [weaponWeight=null]
 *   The weapon weight category (only used when actionType is not "spell").
 * @param {number} [spellLevel=0]
 *   The level of the spell being cast (0 for cantrips). Only used when actionType is "spell".
 * @returns {{ modifier: number, description: string }}
 */
export function rollSpeedFactor(actionType, weaponWeight = null, spellLevel = 0) {
  let modifier = 0;
  let description = "";

  switch (actionType) {
    case "spell":
      modifier = -(spellLevel || 0);
      description = `Spell (level ${spellLevel}): ${modifier} to initiative`;
      break;
    case "light":
      modifier = 2;
      description = "Light / Finesse weapon: +2 to initiative";
      break;
    case "heavy":
      modifier = -5;
      description = "Heavy weapon: -5 to initiative";
      break;
    case "ranged":
    case "oneHanded":
    case "other":
    default:
      modifier = 0;
      description = `${actionType}: no initiative modifier`;
      break;
  }

  // Override with weaponWeight if explicitly provided and actionType isn't spell
  if (actionType !== "spell" && weaponWeight) {
    if (weaponWeight === "light") {
      modifier = 2;
      description = "Light / Finesse weapon: +2 to initiative";
    } else if (weaponWeight === "heavy") {
      modifier = -5;
      description = "Heavy weapon: -5 to initiative";
    }
  }

  return { modifier, description };
}

/**
 * Rolls Greyhawk Initiative for a set of actions a creature is taking this round.
 * Lower total is better (acts earlier in round).
 *
 * @param {Array<"melee" | "ranged" | "movement" | "spell" | "bonusAction">} actions
 *   Array of action types the creature is performing this round.
 * @returns {{ rolls: Object[], total: number, lowerIsBetter: true }}
 */
export function rollGreyhawkInitiative(actions = []) {
  const dieSizes = {
    melee: 4,
    ranged: 6,
    movement: 8,
    spell: 10,
    bonusAction: 12,
  };

  const rolls = actions.map((action) => {
    const dieSize = dieSizes[action] ?? 6;
    const result = Math.floor(Math.random() * dieSize) + 1;
    return { action, dieSize, result };
  });

  const total = rolls.reduce((sum, r) => sum + r.result, 0);

  return { rolls, total, lowerIsBetter: true };
}

/**
 * Looks up an initiative bonus entry by feature name (case-insensitive, partial match).
 *
 * @param {string} featureName - Name or partial name of the feature to search for.
 * @returns {Object | null} The matching INITIATIVE_BONUSES entry, or null if not found.
 */
export function getInitiativeBonus(featureName) {
  if (!featureName) return null;
  const query = featureName.toLowerCase();
  return (
    INITIATIVE_BONUSES.find(
      (bonus) =>
        bonus.name.toLowerCase().includes(query) ||
        bonus.id.toLowerCase().includes(query)
    ) ?? null
  );
}

/**
 * Determines which creatures in a combat encounter are surprised at the start of combat.
 *
 * A creature is surprised if its passive Perception is lower than the highest Stealth
 * roll made against it, and it does not have a feature that prevents surprise.
 *
 * @param {Array<{ id: string, stealthRoll: number }>} stealthRolls
 *   Stealth checks made by the ambushing group. Each entry needs an id and a stealthRoll.
 * @param {Array<{ id: string, passivePerception: number, preventsSuprise?: boolean }>} passivePerceptions
 *   Passive Perception scores for potential targets. Set preventsSuprise to true for
 *   creatures with Alert feat or similar.
 * @returns {Array<{ id: string, surprised: boolean, reason: string }>}
 */
export function checkSurprise(stealthRolls = [], passivePerceptions = []) {
  if (!stealthRolls.length || !passivePerceptions.length) return [];

  const highestStealth = Math.max(...stealthRolls.map((s) => s.stealthRoll));

  return passivePerceptions.map((target) => {
    if (target.preventsSuprise) {
      return {
        id: target.id,
        surprised: false,
        reason: "Feature prevents surprise (e.g. Alert feat or Feral Instinct).",
      };
    }

    if (target.passivePerception < highestStealth) {
      return {
        id: target.id,
        surprised: true,
        reason: `Passive Perception (${target.passivePerception}) is lower than the highest Stealth roll (${highestStealth}).`,
      };
    }

    return {
      id: target.id,
      surprised: false,
      reason: `Passive Perception (${target.passivePerception}) meets or exceeds the highest Stealth roll (${highestStealth}).`,
    };
  });
}

/**
 * Sorts an array of combatants by initiative total, highest first.
 * Ties are broken by Dexterity score (higher DEX goes first), then by a random tiebreaker.
 *
 * @param {Array<{
 *   id: string,
 *   name: string,
 *   initiativeTotal: number,
 *   dexScore?: number,
 *   isPlayer?: boolean
 * }>} combatants
 *   Array of combatant objects. Each needs at minimum an id, name, and initiativeTotal.
 * @returns {Array} The sorted array (new array, original is not mutated).
 */
export function sortInitiativeOrder(combatants = []) {
  return [...combatants].sort((a, b) => {
    // Primary sort: initiative total, descending
    if (b.initiativeTotal !== a.initiativeTotal) {
      return b.initiativeTotal - a.initiativeTotal;
    }

    // Tiebreaker 1: Dexterity score, descending
    const aDex = a.dexScore ?? 10;
    const bDex = b.dexScore ?? 10;
    if (bDex !== aDex) {
      return bDex - aDex;
    }

    // Tiebreaker 2: Player characters before monsters
    if (a.isPlayer && !b.isPlayer) return -1;
    if (!a.isPlayer && b.isPlayer) return 1;

    // Tiebreaker 3: Random (stable within a single sort call)
    return Math.random() < 0.5 ? -1 : 1;
  });
}
