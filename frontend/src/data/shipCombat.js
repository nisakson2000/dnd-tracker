/**
 * @file shipCombat.js
 * @description Naval and ship combat mechanics data for The Codex — D&D Companion.
 * Covers ship types, weapons, crew roles, maneuvers, conditions, and boarding rules.
 * Based on D&D 5e DMG Chapter 5: Ship-to-Ship Combat rules.
 * @module data/shipCombat
 */

// ---------------------------------------------------------------------------
// SHIP TYPES
// ---------------------------------------------------------------------------

/**
 * Core ship type definitions with stats, crew requirements, cargo, cost, and armament.
 * Speed values are in miles per hour (mph). Damage threshold means attacks dealing
 * less damage than the threshold are ignored.
 * @type {Object.<string, Object>}
 */
export const SHIP_TYPES = {
  rowboat: {
    id: "rowboat",
    name: "Rowboat",
    description:
      "A small, open boat propelled by oars. Used for short river or coastal travel.",
    ac: 11,
    hp: 50,
    damageThreshold: 0,
    speed: { oars: 1.5 },
    crew: { min: 1, max: 3 },
    cargo: { tons: 0.5, description: "Half a ton" },
    cost: { gp: 50 },
    weapons: [],
    size: "Tiny",
    locomotion: ["oars"],
    notes: "No damage threshold. Can be portaged.",
  },

  keelboat: {
    id: "keelboat",
    name: "Keelboat",
    description:
      "A flat-bottomed boat suited for rivers and coastal waters, propelled by sail or oar.",
    ac: 15,
    hp: 100,
    damageThreshold: 10,
    speed: { sail: 1, oars: 1 },
    crew: { min: 1, max: 6 },
    cargo: { tons: 0.5, description: "Half a ton" },
    cost: { gp: 3000 },
    weapons: [],
    size: "Large",
    locomotion: ["sail", "oars"],
    notes: "Versatile river and coastal vessel.",
  },

  sailingShip: {
    id: "sailingShip",
    name: "Sailing Ship",
    description:
      "A versatile ocean-going vessel with multiple masts. Common merchant and exploration ship.",
    ac: 15,
    hp: 300,
    damageThreshold: 15,
    speed: { sail: 2 },
    crew: { min: 20, max: 30 },
    cargo: { tons: 100, description: "100 tons" },
    cost: { gp: 10000 },
    weapons: ["ballista", "mangonel"],
    size: "Huge",
    locomotion: ["sail"],
    notes: "Standard ocean-going merchant vessel.",
  },

  galley: {
    id: "galley",
    name: "Galley",
    description:
      "A massive warship powered by banks of oars and supplemented by sails. Built for naval warfare.",
    ac: 15,
    hp: 500,
    damageThreshold: 20,
    speed: { oars: 4, sail: 4 },
    crew: { min: 80, max: 80 },
    cargo: { tons: 150, description: "150 tons" },
    cost: { gp: 30000 },
    weapons: ["ram", "ballista", "cannon"],
    size: "Gargantuan",
    locomotion: ["oars", "sail"],
    notes: "Purpose-built warship. Ram attack requires minimum 30ft movement.",
  },

  longship: {
    id: "longship",
    name: "Longship",
    description:
      "A fast, shallow-draft vessel favored by raiders. Can navigate rivers and beach directly on shores.",
    ac: 15,
    hp: 300,
    damageThreshold: 15,
    speed: { oars: 3, sail: 3 },
    crew: { min: 40, max: 40 },
    cargo: { tons: 10, description: "10 tons" },
    cost: { gp: 10000 },
    weapons: ["ballista"],
    size: "Huge",
    locomotion: ["oars", "sail"],
    notes: "Can beach on shore. Excellent for raiding and swift travel.",
  },

  warship: {
    id: "warship",
    name: "Warship",
    description:
      "A large, heavily armed naval vessel designed for fleet engagements and prolonged sea battles.",
    ac: 15,
    hp: 500,
    damageThreshold: 20,
    speed: { sail: 2.5 },
    crew: { min: 60, max: 80 },
    cargo: { tons: 200, description: "200 tons" },
    cost: { gp: 25000 },
    weapons: ["cannon", "ballista", "mangonel"],
    size: "Gargantuan",
    locomotion: ["sail"],
    notes: "Heavy broadside armament. Can carry troops.",
  },

  airship: {
    id: "airship",
    name: "Airship",
    description:
      "A magical vessel kept aloft by an elemental air engine or enchanted balloon. Can fly over any terrain.",
    ac: 13,
    hp: 300,
    damageThreshold: 10,
    speed: { fly: 8 },
    crew: { min: 10, max: 20 },
    cargo: { tons: 1, description: "1 ton" },
    cost: { gp: 40000 },
    weapons: ["ballista", "mangonel"],
    size: "Huge",
    locomotion: ["fly"],
    flying: true,
    notes:
      "Flying vessel. Immune to underwater hazards. Vulnerable to lightning and wind.",
  },

  submarine: {
    id: "submarine",
    name: "Submarine",
    description:
      "A watertight vessel enchanted to navigate beneath the surface. Rare and exceptionally valuable.",
    ac: 17,
    hp: 400,
    damageThreshold: 15,
    speed: { underwater: 3 },
    crew: { min: 15, max: 20 },
    cargo: { tons: 15, description: "15 tons" },
    cost: { gp: 50000 },
    weapons: ["ballista"],
    size: "Huge",
    locomotion: ["underwater"],
    underwater: true,
    notes:
      "Can submerge fully. Crew requires water breathing or sealed air supply.",
  },
};

// ---------------------------------------------------------------------------
// SHIP WEAPONS
// ---------------------------------------------------------------------------

/**
 * Ship-mounted weapon definitions with damage, range, crew requirements, and reload time.
 * Range values are [normal, long] in feet. Attacks beyond normal range are at disadvantage.
 * @type {Object.<string, Object>}
 */
export const SHIP_WEAPONS = {
  ballista: {
    id: "ballista",
    name: "Ballista",
    description:
      "A large crossbow-like siege weapon that fires heavy bolts. Mounted on a swivel.",
    damage: {
      dice: "3d10",
      diceCount: 3,
      diceSize: 10,
      type: "piercing",
      averageDamage: 16,
    },
    range: { normal: 120, long: 480 },
    attackBonus: 6,
    crew: { required: 3, minimum: 1 },
    reloadTime: { rounds: 1, description: "1 action to reload" },
    ammunition: "Ballista bolts",
    notes: "Can target creatures or ship components. Crew penalty applies when understaffed.",
  },

  mangonel: {
    id: "mangonel",
    name: "Mangonel",
    description:
      "A catapult that hurls heavy stones in a high arc. Cannot target creatures within minimum range.",
    damage: {
      dice: "5d10",
      diceCount: 5,
      diceSize: 10,
      type: "bludgeoning",
      averageDamage: 27,
    },
    range: { normal: 200, long: 800, minimum: 60 },
    attackBonus: 5,
    crew: { required: 5, minimum: 2 },
    reloadTime: { rounds: 2, description: "2 actions to reload" },
    ammunition: "Mangonel stones",
    notes:
      "Cannot target creatures or objects within 60 feet. Arc fire only. Stones as ammunition.",
  },

  cannon: {
    id: "cannon",
    name: "Cannon",
    description:
      "A black-powder firearm that launches iron balls with devastating force.",
    damage: {
      dice: "8d10",
      diceCount: 8,
      diceSize: 10,
      type: "bludgeoning",
      averageDamage: 44,
    },
    range: { normal: 600, long: 2400 },
    attackBonus: 6,
    crew: { required: 3, minimum: 1 },
    reloadTime: { rounds: 3, description: "3 actions to reload" },
    ammunition: "Cannon balls",
    notes:
      "Loud report — can be heard up to 600 feet away. Requires black powder and iron balls.",
  },

  ram: {
    id: "ram",
    name: "Ship's Ram",
    description:
      "A reinforced iron or hardwood prow designed to punch through enemy hulls on impact.",
    damage: {
      dice: "8d10",
      diceCount: 8,
      diceSize: 10,
      type: "bludgeoning",
      averageDamage: 44,
    },
    range: { normal: 0, long: 0 },
    attackBonus: 6,
    crew: { required: 0, minimum: 0 },
    reloadTime: { rounds: 0, description: "No reload — repositioning required" },
    ammunition: null,
    minimumMovement: 30,
    notes:
      "Ship must move at least 30 feet in a straight line before ramming. Ship takes half damage on a successful ram.",
  },
};

// ---------------------------------------------------------------------------
// SHIP COMBAT ROLES
// ---------------------------------------------------------------------------

/**
 * Crew role definitions for ship combat, including available actions and relevant skills.
 * @type {Object.<string, Object>}
 */
export const SHIP_COMBAT_ROLES = {
  captain: {
    id: "captain",
    name: "Captain",
    description:
      "Commands the vessel, sets heading, and calls out orders during combat.",
    actionsAvailable: [
      "Helm the ship (steer, change speed)",
      "Call a maneuver (costs ship action)",
      "Inspire crew (bardic/leadership ability)",
      "Coordinate broadside fire",
      "Order boarding action",
    ],
    relevantSkills: ["Persuasion", "Intimidation", "History", "Insight"],
    relevantAbilities: ["Charisma", "Wisdom"],
    crewSlots: 1,
    notes: "One captain per ship. Captain orders grant +d4 to crew checks (if proficient).",
  },

  firstMate: {
    id: "firstMate",
    name: "First Mate",
    description:
      "Second in command. Coordinates crew stations and keeps morale under fire.",
    actionsAvailable: [
      "Assign crew to stations",
      "Rally demoralized crew (DC 15 Persuasion)",
      "Assist captain's maneuver",
      "Take helm if captain is incapacitated",
      "Coordinate damage control parties",
    ],
    relevantSkills: ["Persuasion", "Athletics", "Intimidation"],
    relevantAbilities: ["Charisma", "Strength"],
    crewSlots: 1,
    notes: "Provides advantage on crew coordination checks when present.",
  },

  gunner: {
    id: "gunner",
    name: "Gunner",
    description:
      "Operates ship-mounted weapons. Responsible for targeting, loading, and firing.",
    actionsAvailable: [
      "Fire a ship weapon",
      "Aim (spend action to gain +2 to next attack)",
      "Reload ship weapon",
      "Assess enemy ship weaknesses",
      "Switch weapon stations",
    ],
    relevantSkills: ["Arcana (magical weapons)", "Athletics", "Perception"],
    relevantAbilities: ["Dexterity", "Wisdom"],
    crewSlots: "varies by weapon",
    notes: "Each weapon requires its own crew. Understaffed weapons operate at disadvantage.",
  },

  boatswain: {
    id: "boatswain",
    name: "Boatswain",
    description:
      "Oversees hull integrity, sails, and rigging. Leads damage control and emergency repairs.",
    actionsAvailable: [
      "Repair hull (DC based on condition)",
      "Patch hull breach (DC 15 Carpenter's Tools)",
      "Douse fire aboard ship",
      "Repair torn sails (DC 12 Weaver's Tools)",
      "Reinforce damaged rudder (DC 14 Smith's Tools)",
    ],
    relevantSkills: ["Athletics", "Survival"],
    relevantAbilities: ["Strength", "Dexterity"],
    crewSlots: 1,
    notes: "Requires carpenter's tools, weaver's tools, or smith's tools for specific repairs.",
  },

  lookout: {
    id: "lookout",
    name: "Lookout",
    description:
      "Posted at the crow's nest or bow. Watches for hazards, enemy ships, and weather changes.",
    actionsAvailable: [
      "Spot enemy vessel (Perception vs. Stealth)",
      "Identify ship type and armament",
      "Detect underwater hazards (rocks, reefs)",
      "Warn of incoming fire (grant +2 AC vs. first salvo)",
      "Track weather changes",
    ],
    relevantSkills: ["Perception", "Survival", "Nature"],
    relevantAbilities: ["Wisdom"],
    crewSlots: 1,
    notes:
      "Lookout warnings can prevent surprise rounds in naval combat. Spyglass grants advantage.",
  },
};

// ---------------------------------------------------------------------------
// NAVAL MANEUVERS
// ---------------------------------------------------------------------------

/**
 * Ship combat maneuvers with modifiers to speed, AC, and attack rolls.
 * Speed modifiers are multipliers (1.0 = no change). AC and attack modifiers are flat bonuses/penalties.
 * @type {Object.<string, Object>}
 */
export const NAVAL_MANEUVERS = {
  fullSpeed: {
    id: "fullSpeed",
    name: "Full Speed",
    description:
      "Push the ship to maximum speed, sacrificing maneuverability for straight-line velocity.",
    speedModifier: 1.5,
    acModifier: -2,
    attackModifier: -2,
    crewCheck: null,
    actionCost: "Bonus action (Captain)",
    duration: "Until start of next turn",
    notes:
      "Ship moves at 1.5x speed but takes -2 AC and -2 to attack rolls due to instability.",
  },

  turnHard: {
    id: "turnHard",
    name: "Turn Hard",
    description:
      "Execute a sharp turn up to 90 degrees from current heading at speed.",
    speedModifier: 0.75,
    acModifier: 0,
    attackModifier: -2,
    crewCheck: { skill: "Water Vehicles", dc: 12 },
    actionCost: "Action (Captain or Helmsman)",
    duration: "Instantaneous",
    notes:
      "Allows up to 90-degree course change. Failure means ship turns only 45 degrees. Attack rolls suffer while crew adjusts.",
  },

  comeAbout: {
    id: "comeAbout",
    name: "Come About",
    description:
      "Perform a 180-degree reversal of heading. Risky in combat but can escape or reposition.",
    speedModifier: 0.5,
    acModifier: -4,
    attackModifier: -4,
    crewCheck: { skill: "Water Vehicles", dc: 16 },
    actionCost: "Full round action (Captain)",
    duration: "Lasts 1 round to complete",
    notes:
      "On failure, ship only turns 90 degrees and crew is disorganized for 1 round (disadvantage on all ship checks).",
  },

  ram: {
    id: "ram",
    name: "Ram",
    description:
      "Aim the prow directly at an enemy vessel and accelerate to maximum speed for impact.",
    speedModifier: 1.25,
    acModifier: -4,
    attackModifier: 4,
    crewCheck: { skill: "Water Vehicles", dc: 14 },
    actionCost: "Action (Captain)",
    duration: "Instantaneous on contact",
    minimumMovement: 30,
    notes:
      "Requires ship's ram weapon. Ship must move 30+ feet toward target. Attacker takes half damage on hit.",
  },

  broadside: {
    id: "broadside",
    name: "Broadside",
    description:
      "Position the ship to bring all weapons on one side to bear simultaneously.",
    speedModifier: 0.5,
    acModifier: -2,
    attackModifier: 2,
    crewCheck: { skill: "Water Vehicles", dc: 13 },
    actionCost: "Action (Captain)",
    duration: "Until start of next turn",
    notes:
      "All weapons on firing side may fire in the same round. Ship slows to hold position. On failure, only half weapons may fire.",
  },

  evasive: {
    id: "evasive",
    name: "Evasive Maneuvers",
    description:
      "Unpredictable weaving and course changes to throw off enemy targeting.",
    speedModifier: 0.75,
    acModifier: 4,
    attackModifier: -2,
    crewCheck: { skill: "Water Vehicles", dc: 14 },
    actionCost: "Action (Captain or Helmsman)",
    duration: "Until start of next turn",
    notes:
      "Grants +4 AC against ranged attacks. Ship's own ranged attacks suffer -2 due to unstable firing platform. On failure, no AC bonus.",
  },
};

// ---------------------------------------------------------------------------
// SHIP CONDITIONS
// ---------------------------------------------------------------------------

/**
 * Ship condition definitions with mechanical effects, repair DCs, and estimated repair time.
 * Conditions can stack and some worsen over time if left untreated.
 * @type {Object.<string, Object>}
 */
export const SHIP_CONDITIONS = {
  hullBreach: {
    id: "hullBreach",
    name: "Hull Breach",
    description:
      "The ship's hull has been breached and is taking on water. The ship will sink if not repaired.",
    effect:
      "Ship sinks in 1d4 hours unless repaired. -10 ft. speed per breach. Cargo at risk.",
    repairDC: 15,
    toolsRequired: "Carpenter's Tools",
    timeToRepair: {
      rounds: null,
      minutes: 10,
      description: "10 minutes per breach",
    },
    worsenCondition: "Each hour untreated adds another breach",
    emergencyMeasure: "Stuffing the breach with cloth or rags buys 1 hour (DC 10 Athletics).",
    notes: "Multiple breaches stack. A ship with 3+ breaches sinks in minutes, not hours.",
  },

  fire: {
    id: "fire",
    name: "Fire Aboard",
    description:
      "Part of the ship is on fire. Fire spreads rapidly and can destroy the vessel.",
    effect:
      "Ship takes 2d6 fire damage per round. Spreads to adjacent section on a roll of 1-2 (d6) each round.",
    repairDC: 12,
    toolsRequired: "Buckets of water, or Prestidigitation/Create Water",
    timeToRepair: {
      rounds: 3,
      minutes: null,
      description: "3 rounds to douse each fire",
    },
    worsenCondition: "Spreads on 1-2 (d6) each round if unattended",
    emergencyMeasure: "Cutting the burning section loose (extreme circumstance, requires axe and 2 rounds).",
    notes: "Magical fire (alchemist's fire, dragon breath) has DC 16 to extinguish.",
  },

  becalmed: {
    id: "becalmed",
    name: "Becalmed",
    description:
      "The wind has died and sail-powered vessels cannot move. Ships with oars are unaffected.",
    effect:
      "Sail-propelled ships have 0 speed. Cannot perform sail-dependent maneuvers.",
    repairDC: null,
    toolsRequired: "Wind-based magic (Gust of Wind, Control Weather) or oars",
    timeToRepair: {
      rounds: null,
      minutes: null,
      description: "Lasts until wind returns (1d6 hours) or magic is used",
    },
    worsenCondition: null,
    emergencyMeasure: "Gust of Wind spell provides half speed for its duration.",
    notes: "Does not affect oar-powered ships or flying/underwater vessels.",
  },

  crewMutiny: {
    id: "crewMutiny",
    name: "Crew Mutiny",
    description:
      "The crew has refused orders or actively turned against the officers. Ship operation is compromised.",
    effect:
      "All ship checks made at disadvantage. Crew may actively interfere. Ship may stop or change course.",
    repairDC: 18,
    toolsRequired: null,
    timeToRepair: {
      rounds: null,
      minutes: null,
      description: "Charisma (Persuasion or Intimidation) check, DC 18. May take several rounds of negotiation.",
    },
    worsenCondition: "Violent mutiny if Persuasion fails by 5+",
    emergencyMeasure: "Charm Person/Suggestion on ringleaders can buy time.",
    notes:
      "Caused by poor morale, lack of pay, or mistreatment. Prevents all coordinated maneuvers.",
  },

  damagedRudder: {
    id: "damagedRudder",
    name: "Damaged Rudder",
    description:
      "The ship's rudder has been damaged, severely limiting steering control.",
    effect:
      "Ship can only turn 45 degrees per round (normally 90). All maneuver checks made at disadvantage.",
    repairDC: 14,
    toolsRequired: "Carpenter's Tools or Smith's Tools",
    timeToRepair: {
      rounds: null,
      minutes: 30,
      description: "30 minutes for field repair",
    },
    worsenCondition: "Further hits to rudder section destroy it entirely (no turning possible)",
    emergencyMeasure: "Crew on oars can provide steering at half effectiveness (DC 12 Athletics).",
    notes: "Ship cannot perform Turn Hard, Come About, or Evasive Maneuvers while rudder is destroyed.",
  },

  tornSails: {
    id: "tornSails",
    name: "Torn Sails",
    description:
      "The ship's sails have been torn by weapons fire, fire, or storm damage.",
    effect:
      "Ship speed reduced by 50%. Cannot perform Full Speed maneuver. Disadvantage on all sailing checks.",
    repairDC: 12,
    toolsRequired: "Weaver's Tools, Canvas and rope",
    timeToRepair: {
      rounds: null,
      minutes: 20,
      description: "20 minutes per sail section",
    },
    worsenCondition: "Fire spreads to rigging if sails are already burning",
    emergencyMeasure: "Jury-rigging with spare canvas: DC 14 Weaver's Tools, takes 5 minutes, restores 25% speed.",
    notes: "Ships with oars are less affected. Flying ships with torn sails drop 50% altitude per round.",
  },
};

// ---------------------------------------------------------------------------
// BOARDING RULES
// ---------------------------------------------------------------------------

/**
 * Methods for boarding an enemy ship during combat, including required checks and failure consequences.
 * @type {Object.<string, Object>}
 */
export const BOARDING_RULES = {
  grapplingHooks: {
    id: "grapplingHooks",
    name: "Grappling Hooks",
    description:
      "Throw grappling hooks attached to ropes to latch onto the enemy ship and pull it alongside.",
    checkRequired: "Attack roll vs. target ship AC (use Dexterity modifier)",
    dc: null,
    attackBonus: "+4 (standard grappling hook)",
    crewRequired: 2,
    timeRequired: "2 rounds (throw + pull together)",
    failureConsequence:
      "Hook misses or fails to catch. Can retry next round. Rope can be cut by defenders (AC 11, 5 HP).",
    successEffect:
      "Ships are grappled. Enemy ship cannot move away without breaking free (Strength DC 15).",
    notes:
      "Defenders can cut ropes. Multiple hooks increase difficulty to break free (+2 DC per additional hook).",
  },

  swingAcross: {
    id: "swingAcross",
    name: "Swing Across",
    description:
      "Use a rope attached to the rigging to swing from one ship to the other.",
    checkRequired: "Athletics or Acrobatics check",
    dc: 12,
    attackBonus: null,
    crewRequired: 1,
    timeRequired: "1 action",
    failureConsequence:
      "On a failure, character falls into the water between ships (takes 1d6 bludgeoning damage, must swim). On a failure by 5+, character is crushed between hulls (3d6 bludgeoning damage).",
    successEffect:
      "Character arrives on enemy deck and may take one melee attack as part of the action.",
    notes:
      "DC increases to 15 in rough seas. DC increases to 18 if ships are moving at full speed. Dramatic entry allows one free attack.",
  },

  plank: {
    id: "plank",
    name: "Boarding Plank",
    description:
      "Deploy a heavy wooden plank or bridge between ships to allow easy crossing in force.",
    checkRequired: "Strength check to deploy plank under fire",
    dc: 10,
    attackBonus: null,
    crewRequired: 4,
    timeRequired: "1 round to deploy",
    failureConsequence:
      "Plank is not secured. Falls into water or slides off. Must try again next round.",
    successEffect:
      "Stable crossing. Up to 3 Medium creatures can cross per round. Grants advantage to all boarding checks for this method.",
    notes:
      "Defenders can push the plank off (DC 14 Athletics). Plank can be set on fire. Ships must be within 5 feet of each other.",
  },

  jump: {
    id: "jump",
    name: "Jump Across",
    description:
      "Leap the gap between ships under one's own power, landing directly in combat.",
    checkRequired: "Athletics check",
    dc: 15,
    attackBonus: null,
    crewRequired: 1,
    timeRequired: "1 action (part of move)",
    failureConsequence:
      "Character falls into the water (1d6 bludgeoning damage, must swim to nearest ship or shore). A natural 1 means character slips on deck and is prone.",
    successEffect:
      "Character lands on enemy deck. If gap is 10 feet or less, no check required for characters with STR 15+.",
    notes:
      "Maximum gap of 15 feet (or character's standing long jump distance). DC increases by 2 per 5 feet of gap over 10 feet. DC increases by 3 in rough weather.",
  },
};

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Retrieves a ship type definition by its ID.
 * @param {string} typeId - The ship type ID (e.g., "sailingShip", "galley").
 * @returns {Object|null} The ship type object, or null if not found.
 */
export function getShipType(typeId) {
  return SHIP_TYPES[typeId] ?? null;
}

/**
 * Retrieves a ship weapon definition by its ID.
 * @param {string} weaponId - The weapon ID (e.g., "ballista", "cannon").
 * @returns {Object|null} The weapon object, or null if not found.
 */
export function getShipWeapon(weaponId) {
  return SHIP_WEAPONS[weaponId] ?? null;
}

/**
 * Resolves a ship weapon attack against a target's AC.
 * Returns whether the attack hits and the resulting damage roll (if hit).
 * @param {Object} weapon - A weapon object from SHIP_WEAPONS.
 * @param {number} targetAC - The target ship's AC.
 * @param {number} [attackRollOverride] - Optional override for d20 roll (for testing or predetermined rolls).
 * @returns {{ hit: boolean, attackRoll: number, totalAttack: number, damage: number|null, damageRoll: string }}
 */
export function resolveShipAttack(weapon, targetAC, attackRollOverride = null) {
  if (!weapon) {
    return { hit: false, attackRoll: 0, totalAttack: 0, damage: null, damageRoll: "0" };
  }

  const d20 = attackRollOverride !== null
    ? attackRollOverride
    : Math.floor(Math.random() * 20) + 1;

  const totalAttack = d20 + (weapon.attackBonus ?? 0);
  const hit = d20 === 20 || (d20 !== 1 && totalAttack >= targetAC);

  if (!hit) {
    return { hit: false, attackRoll: d20, totalAttack, damage: null, damageRoll: weapon.damage.dice };
  }

  // Roll damage
  let totalDamage = 0;
  const { diceCount, diceSize } = weapon.damage;
  for (let i = 0; i < diceCount; i++) {
    totalDamage += Math.floor(Math.random() * diceSize) + 1;
  }

  // Critical hit doubles damage dice
  if (d20 === 20) {
    let critBonus = 0;
    for (let i = 0; i < diceCount; i++) {
      critBonus += Math.floor(Math.random() * diceSize) + 1;
    }
    totalDamage += critBonus;
  }

  return {
    hit: true,
    critical: d20 === 20,
    attackRoll: d20,
    totalAttack,
    damage: totalDamage,
    damageRoll: weapon.damage.dice,
  };
}

/**
 * Applies damage to a ship object, respecting damage threshold and returning updated HP and status.
 * Does not mutate the original ship object — returns a new object with updated stats.
 * @param {Object} ship - A ship instance with { hp, maxHp, damageThreshold, ... }.
 * @param {number} damage - Raw incoming damage value.
 * @returns {{ ...ship, hp: number, status: string, destroyed: boolean, damageApplied: number }}
 */
export function applyShipDamage(ship, damage) {
  const threshold = ship.damageThreshold ?? 0;

  // Damage below threshold is ignored
  const effectiveDamage = damage < threshold ? 0 : damage;
  const newHp = Math.max(0, (ship.hp ?? 0) - effectiveDamage);

  let status = "Operational";
  if (newHp <= 0) {
    status = "Destroyed";
  } else if (newHp <= (ship.maxHp ?? ship.hp) * 0.25) {
    status = "Critical";
  } else if (newHp <= (ship.maxHp ?? ship.hp) * 0.5) {
    status = "Damaged";
  }

  return {
    ...ship,
    hp: newHp,
    maxHp: ship.maxHp ?? ship.hp + effectiveDamage,
    status,
    destroyed: newHp <= 0,
    damageApplied: effectiveDamage,
    damageBlocked: damage - effectiveDamage,
  };
}

/**
 * Retrieves a naval maneuver by its ID.
 * @param {string} maneuverId - The maneuver ID (e.g., "broadside", "evasive").
 * @returns {Object|null} The maneuver object, or null if not found.
 */
export function getManeuver(maneuverId) {
  return NAVAL_MANEUVERS[maneuverId] ?? null;
}

/**
 * Checks the current condition state of a ship and returns a list of active conditions with severity.
 * Expects a ship object with an optional `conditions` array of condition IDs.
 * @param {Object} ship - A ship instance, optionally with a `conditions` string array.
 * @returns {{ conditions: Object[], hasCriticalCondition: boolean, summary: string }}
 */
export function checkShipCondition(ship) {
  const conditionIds = ship.conditions ?? [];
  const activeConditions = conditionIds
    .map((id) => SHIP_CONDITIONS[id] ?? null)
    .filter(Boolean);

  const criticalIds = ["hullBreach", "fire", "crewMutiny"];
  const hasCriticalCondition = activeConditions.some((c) =>
    criticalIds.includes(c.id)
  );

  let summary = "No conditions";
  if (activeConditions.length > 0) {
    summary = activeConditions.map((c) => c.name).join(", ");
  }

  return {
    conditions: activeConditions,
    hasCriticalCondition,
    conditionCount: activeConditions.length,
    summary,
  };
}

/**
 * Calculates crew efficiency as a multiplier based on current crew vs. required minimum.
 * Full efficiency (1.0) requires meeting minimum crew. Larger crew up to max provides a small bonus.
 * @param {number} currentCrew - Number of active crew members.
 * @param {number} requiredCrew - Minimum crew required to operate the ship.
 * @param {number} [maxCrew] - Maximum effective crew (optional, for bonus calculation).
 * @returns {{ efficiency: number, penalty: string|null, bonus: string|null, description: string }}
 */
export function calculateCrewEfficiency(currentCrew, requiredCrew, maxCrew = null) {
  if (requiredCrew <= 0) {
    return {
      efficiency: 1.0,
      penalty: null,
      bonus: null,
      description: "No crew required.",
    };
  }

  const ratio = currentCrew / requiredCrew;
  let efficiency;
  let penalty = null;
  let bonus = null;
  let description;

  if (currentCrew <= 0) {
    efficiency = 0;
    penalty = "Ship cannot operate — no crew.";
    description = "0% efficiency. Ship is adrift.";
  } else if (ratio < 0.25) {
    efficiency = 0.25;
    penalty = "Severely understaffed. Disadvantage on all ship checks. Speed halved.";
    description = `${Math.round(ratio * 100)}% of required crew. Severe penalty.`;
  } else if (ratio < 0.5) {
    efficiency = 0.5;
    penalty = "Understaffed. -2 to all ship checks. Speed reduced by 25%.";
    description = `${Math.round(ratio * 100)}% of required crew. Moderate penalty.`;
  } else if (ratio < 0.75) {
    efficiency = 0.75;
    penalty = "Lightly understaffed. -1 to ship checks.";
    description = `${Math.round(ratio * 100)}% of required crew. Minor penalty.`;
  } else if (ratio < 1.0) {
    efficiency = 0.9;
    penalty = "Slightly understaffed. No mechanical penalty but crew is strained.";
    description = `${Math.round(ratio * 100)}% of required crew. Near full efficiency.`;
  } else {
    efficiency = 1.0;
    description = "Full crew. Standard operation.";

    // Bonus for having a full complement up to max
    if (maxCrew && currentCrew > requiredCrew) {
      const surplusRatio = (currentCrew - requiredCrew) / (maxCrew - requiredCrew);
      if (surplusRatio >= 0.5) {
        efficiency = 1.1;
        bonus = "+1 to ship checks from surplus crew.";
        description = "Full crew with experienced surplus. Minor bonus to ship checks.";
      }
    }
  }

  return {
    efficiency,
    penalty,
    bonus,
    description,
    currentCrew,
    requiredCrew,
    crewRatio: Math.round(ratio * 100) / 100,
  };
}
