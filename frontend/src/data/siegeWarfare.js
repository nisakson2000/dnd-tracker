/**
 * siegeWarfare.js
 * Data and helpers for mass combat and siege warfare mechanics.
 *
 * Roadmap items covered:
 *   273 — Fortification types and structural stats
 *   274 — Siege weapon roster with crew and timing rules
 *   275 — Siege tactics with duration, cost, and risk modeling
 *   276 — Garrison rules, morale, supply, and mass combat resolution
 */

// ---------------------------------------------------------------------------
// FORTIFICATION_TYPES
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} Fortification
 * @property {string}  id               — machine-readable key
 * @property {string}  name             — display name
 * @property {number}  ac               — Armor Class for attack rolls vs structure
 * @property {number}  hp               — Hit Points of a standard section
 * @property {number}  damageThreshold  — damage below this per hit is ignored
 * @property {boolean} [vulnerableToSiege] — takes double damage from siege weapons
 * @property {boolean} [impassable]     — blocks movement without special equipment
 * @property {string}  cover            — cover provided to defenders ('none' | 'half' | 'three-quarters' | 'total')
 * @property {string}  description
 */

/** @type {Object.<string, Fortification>} */
export const FORTIFICATION_TYPES = {
  woodenPalisade: {
    id: "woodenPalisade",
    name: "Wooden Palisade",
    ac: 15,
    hp: 100,
    damageThreshold: 5,
    vulnerableToSiege: false,
    impassable: false,
    cover: "half",
    description:
      "A row of sharpened wooden stakes or logs set into the earth. Quick to construct and easy to repair, but vulnerable to fire and heavy siege equipment. Typical of frontier camps and early defensive lines.",
  },
  stoneWall: {
    id: "stoneWall",
    name: "Stone Wall",
    ac: 17,
    hp: 300,
    damageThreshold: 10,
    vulnerableToSiege: false,
    impassable: false,
    cover: "three-quarters",
    description:
      "A mortared stone curtain wall 10 ft thick. Resists most mundane weapons and small siege equipment. A staple of fortified towns and minor keeps.",
  },
  castleWall: {
    id: "castleWall",
    name: "Castle Wall",
    ac: 17,
    hp: 500,
    damageThreshold: 15,
    vulnerableToSiege: false,
    impassable: false,
    cover: "total",
    description:
      "A massive dressed-stone curtain wall 15–20 ft thick with battlements. Defenders behind it gain total cover. Requires sustained bombardment or tunneling to breach.",
  },
  gate: {
    id: "gate",
    name: "Gate",
    ac: 18,
    hp: 250,
    damageThreshold: 10,
    vulnerableToSiege: true,
    impassable: false,
    cover: "none",
    description:
      "Reinforced iron-banded oak doors set in a gatehouse. The weak point of any fortification — battering rams and siege towers target gates preferentially. Takes double damage from siege weapons.",
  },
  tower: {
    id: "tower",
    name: "Tower",
    ac: 17,
    hp: 400,
    damageThreshold: 12,
    vulnerableToSiege: false,
    impassable: false,
    cover: "total",
    description:
      "A flanking tower projecting from the curtain wall, allowing archers to cover the wall face. Defenders inside gain total cover and can fire through arrow slits.",
  },
  keep: {
    id: "keep",
    name: "Keep",
    ac: 17,
    hp: 600,
    damageThreshold: 15,
    vulnerableToSiege: false,
    impassable: false,
    cover: "total",
    description:
      "The central fortified stronghold within a castle complex. Last line of defense; enormously thick walls and a self-contained water supply. Requires prolonged siege or magical assault to reduce.",
  },
  moat: {
    id: "moat",
    name: "Moat",
    ac: null,
    hp: null,
    damageThreshold: null,
    vulnerableToSiege: false,
    impassable: true,
    cover: "none",
    description:
      "A water-filled or dry ditch surrounding the fortification. Impassable without a bridge, siege tower, or filling material. Forces attackers to spend time and resources before reaching the wall.",
  },
  barricade: {
    id: "barricade",
    name: "Barricade",
    ac: 15,
    hp: 50,
    damageThreshold: 5,
    vulnerableToSiege: false,
    impassable: false,
    cover: "half",
    description:
      "An improvised obstacle of carts, rubble, or furniture thrown up in a doorway or street. Provides half cover and slows movement. Easily torn down once attackers reach it.",
  },
};

// ---------------------------------------------------------------------------
// SIEGE_WEAPONS
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} SiegeWeapon
 * @property {string}   id
 * @property {string}   name
 * @property {string}   damage          — dice expression + damage type
 * @property {boolean}  [area]          — true if the attack affects an area
 * @property {number[]} range           — [normal, long] in feet; null if not applicable
 * @property {number}   crewRequired    — minimum crew to operate
 * @property {string}   setupTime       — time to assemble and position
 * @property {string}   reloadTime      — time between shots / uses
 * @property {string}   notes
 * @property {string}   description
 */

/** @type {Object.<string, SiegeWeapon>} */
export const SIEGE_WEAPONS = {
  batteringRam: {
    id: "batteringRam",
    name: "Battering Ram",
    damage: "4d6 bludgeoning",
    area: false,
    range: null,
    crewRequired: 4,
    setupTime: "1 minute",
    reloadTime: "None (continuous use)",
    notes:
      "Deals damage to objects and structures only. Damage is doubled against gates (vulnerableToSiege). Crew is exposed while operating.",
    description:
      "A heavy log or iron-capped beam swung repeatedly against a door or wall. Simple and effective against gates; crew must be protected from missile fire above.",
  },
  ballista: {
    id: "ballista",
    name: "Ballista",
    damage: "3d10 piercing",
    area: false,
    range: [120, 480],
    crewRequired: 3,
    setupTime: "10 minutes",
    reloadTime: "1 action (1 round) to reload",
    notes:
      "Can target creatures or structures. Attack roll required (treat as +6 to hit). At long range, attack is made at disadvantage.",
    description:
      "A giant crossbow mounted on a rotating frame. Fires iron bolts capable of skewering multiple targets. Effective against lightly armored troops and light wooden structures.",
  },
  catapultTrebuchet: {
    id: "catapultTrebuchet",
    name: "Catapult / Trebuchet",
    damage: "5d10 bludgeoning",
    area: true,
    range: [300, 1200],
    crewRequired: 5,
    setupTime: "30 minutes",
    reloadTime: "2 actions (2 rounds) to reload",
    notes:
      "Area of effect: 10-ft radius on impact. DC 15 Dexterity saving throw for creatures in the area; half damage on success. Cannot fire at targets within minimum range of 60 ft. Trebuchet uses counterweight — cannot be moved once set up.",
    description:
      "Hurls boulders or incendiary payloads in a high arc. The trebuchet outranges the catapult and is the definitive siege weapon against masonry. Both require a dedicated crew and time to aim accurately.",
  },
  cannon: {
    id: "cannon",
    name: "Cannon",
    damage: "8d10 bludgeoning",
    area: false,
    range: [600, 2400],
    crewRequired: 5,
    setupTime: "15 minutes",
    reloadTime: "3 actions (3 rounds) to reload",
    notes:
      "Requires gunpowder (rare in most settings). Attack roll required (treat as +8 to hit). On a hit against a structure, roll damage twice and take the higher result. Loud: automatically alerts everyone within 1 mile.",
    description:
      "An iron or bronze tube that fires iron balls using explosive powder. Devastatingly effective against masonry but resource-intensive. Typically anachronistic in standard fantasy settings — introduce only deliberately.",
  },
  boilingOil: {
    id: "boilingOil",
    name: "Boiling Oil",
    damage: "3d6 fire",
    area: true,
    range: [null, null],
    crewRequired: 2,
    setupTime: "1 hour (to heat)",
    reloadTime: "30 minutes (to reheat)",
    notes:
      "Poured from above onto attackers at the base of a wall or gate. Area of effect: 10-ft square directly below the pour point. DC 13 Dexterity saving throw; full damage on failure, half on success. Continues to burn for 1 round (1d6 fire at start of next turn, no save).",
    description:
      "Cauldrons of heated oil or tar tipped over the battlements onto climbing attackers. Cheap, effective, and demoralizing. Requires an elevated position to deploy.",
  },
  siegeTower: {
    id: "siegeTower",
    name: "Siege Tower",
    damage: "None (transport)",
    area: false,
    range: null,
    crewRequired: 10,
    setupTime: "2 hours (construction on-site)",
    reloadTime: "N/A",
    notes:
      "Provides total cover to up to 20 troops inside while moving toward a wall. When adjacent to a wall, troops can move onto the wall top as part of their movement. Tower HP: 500, AC: 15. A burning tower is destroyed in 1d4 hours.",
    description:
      "A tall wooden structure on wheels, pushed forward by its crew to bridge the gap to a castle wall. Allows attackers to bypass climbing under fire. The primary counter-tool to high curtain walls.",
  },
};

// ---------------------------------------------------------------------------
// SIEGE_TACTICS
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} SiegeTactic
 * @property {string}   id
 * @property {string}   name
 * @property {string}   timeRequired
 * @property {string}   resourceCost
 * @property {string[]} successFactors
 * @property {string[]} risks
 * @property {string}   description
 */

/** @type {Object.<string, SiegeTactic>} */
export const SIEGE_TACTICS = {
  directAssault: {
    id: "directAssault",
    name: "Direct Assault",
    timeRequired: "Hours to 1 day",
    resourceCost:
      "High — heavy troop casualties expected; siege ladders, siege towers, or grappling equipment needed",
    successFactors: [
      "Significant numerical superiority (3:1 or greater)",
      "Siege towers or ladders to overcome walls",
      "Suppressing fire to neutralize defenders",
      "Coordinated breach at gate and wall simultaneously",
    ],
    risks: [
      "Catastrophic casualties if assault is repelled",
      "Defenders gain significant cover bonuses",
      "Boiling oil, rocks, and arrows from above",
      "Gate resistance requires dedicated battering ram crew",
      "Morale collapse if initial assault fails",
    ],
    description:
      "Throw troops directly at the walls with ladders, siege towers, or through a breached gate. The fastest method but by far the bloodiest. Rarely attempted without overwhelming force or a critical breach.",
  },
  siege: {
    id: "siege",
    name: "Siege (Starve Out)",
    timeRequired: "Weeks to months",
    resourceCost:
      "Moderate ongoing — besieging force must be supplied continuously; large camp infrastructure needed",
    successFactors: [
      "Complete encirclement cutting all supply lines",
      "Intercepting or destroying relief forces",
      "Knowledge of garrison supply stores",
      "Maintaining besieging force morale over long duration",
    ],
    risks: [
      "Relief force may break the siege from outside",
      "Disease in the besieging camp",
      "Weather and seasonal hardship",
      "Political pressure to resolve quickly",
      "Garrison may sortie and disrupt siege lines",
    ],
    description:
      "Surround the fortification and wait for starvation, thirst, or disease to compel surrender. Avoids direct casualties but demands enormous logistical endurance. Historically the most common outcome of medieval sieges.",
  },
  tunnelSap: {
    id: "tunnelSap",
    name: "Tunnel / Sap",
    timeRequired: "Days to weeks depending on soil and wall depth",
    resourceCost:
      "Moderate — specialist miners or sappers; timber for tunnel shoring; incendiary material for collapse",
    successFactors: [
      "Suitable soil (not solid rock)",
      "Skilled miners or burrowing magic",
      "Secrecy — defenders must not detect the tunnel",
      "Sufficient combustible material to collapse foundations",
    ],
    risks: [
      "Counter-mining by defenders",
      "Tunnel collapse injuring diggers",
      "Detection via vibration-sensing (bowls of water, ear to ground)",
      "Partial collapse may not bring down the wall",
      "Requires follow-on assault through the breach",
    ],
    description:
      "Dig a tunnel beneath the wall foundation, shore it with timber, then burn the supports to collapse a section. A technically demanding but highly effective method against stone walls when direct assault is too costly.",
  },
  bombardment: {
    id: "bombardment",
    name: "Bombardment",
    timeRequired: "Days to weeks for meaningful breaches",
    resourceCost:
      "High — catapults, trebuchets, or cannons; large quantities of ammunition; specialist engineers",
    successFactors: [
      "Multiple siege engines concentrated on one section",
      "Suppressing return fire from garrison",
      "Sufficient ammunition stockpiles",
      "Targeting the weakest structural points (gates, corners)",
    ],
    risks: [
      "Equipment breakdown under sustained use",
      "Ammunition exhaustion",
      "Skilled defenders may repair breaches overnight",
      "Artillery duel if defenders have siege engines",
      "Slow against very thick walls (castleWall, keep)",
    ],
    description:
      "Sustained fire from catapults, trebuchets, or cannons to create a breach in the wall. Once a section is rubble, infantry can advance through it. Slow but methodical, and preserves assault troops until the critical moment.",
  },
  infiltration: {
    id: "infiltration",
    name: "Infiltration",
    timeRequired: "Variable — hours if successful, indefinite if not",
    resourceCost:
      "Low materially — requires skilled agents, forged documents, or bribes; high risk to operatives",
    successFactors: [
      "Inside contact willing to open a gate",
      "Disguise or forgery sufficient to pass inspection",
      "Small team to avoid detection",
      "Timing coordinated with external assault force",
    ],
    risks: [
      "Discovery results in execution of operatives",
      "Double agents or betrayal",
      "Alarm raised before gate can be secured",
      "Even success may not fully compromise the garrison",
      "Diplomatic and reputational consequences if exposed",
    ],
    description:
      "Sneak a small force inside — through a postern gate, sewers, disguise, or bribed guards — to open the main gate from within. The swiftest path to victory and the favorite of rogues, spies, and commanders who value decisive action.",
  },
  negotiation: {
    id: "negotiation",
    name: "Negotiation",
    timeRequired: "Days to weeks of parley",
    resourceCost:
      "Low materially — requires credible threats and/or credible promises; may involve ransom payments",
    successFactors: [
      "Hopeless defensive situation apparent to garrison commander",
      "Honorable terms offered (quarter, safe passage, ransom)",
      "Credible relief force absent or destroyed",
      "Internal divisions within defending force",
    ],
    risks: [
      "Defenders stall to buy time for relief",
      "Terms accepted may limit exploitation of victory",
      "Morale of besieging force may suffer from perceived hesitation",
      "Deception by defenders during truce",
    ],
    description:
      "Offer the garrison acceptable terms of surrender. Saves lives on both sides and often the preferred outcome for rational commanders. A besieging force that treats surrendering garrisons well will find future negotiations easier.",
  },
};

// ---------------------------------------------------------------------------
// GARRISON_RULES
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} GarrisonRules
 * @property {Object} troopsPerWallSection  — troops needed to actively defend each section
 * @property {Object} moraleSystem          — morale thresholds and effects
 * @property {Object} supplyConsumption     — resources consumed per day
 * @property {Object} reinforcementSchedule — guidelines for relief forces
 */

/** @type {GarrisonRules} */
export const GARRISON_RULES = {
  troopsPerWallSection: {
    description:
      "Each 30-ft section of wall requires a minimum number of defenders to hold effectively. Below minimum, defenders cannot cover all approach angles.",
    minimumPerSection: 4,
    effectivePerSection: 8,
    maximumUsefulPerSection: 16,
    note:
      "Defenders beyond the maximum add no combat benefit but consume supplies. Rotate troops to maintain morale on extended sieges.",
  },

  moraleSystem: {
    description:
      "Garrison morale is tracked on a scale of 0–20. High morale enables aggressive sallies; low morale triggers surrender rolls.",
    startingMorale: 15,
    thresholds: {
      20: "Inspired — Defenders gain advantage on all attack rolls and saving throws. May attempt aggressive sorties.",
      15: "Steady — Normal combat effectiveness. No modifiers.",
      10: "Wavering — Disadvantage on saving throws vs. fear. Garrison commander must make DC 12 Charisma check each day or morale drops by 1.",
      5:  "Breaking — Desertion begins. Lose 1d6 garrison troops per day. DC 15 Charisma check or surrender offer is considered.",
      0:  "Collapsed — Garrison surrenders or flees. Resistance ends.",
    },
    moraleModifiers: {
      "Successful sortie": +2,
      "Relief force sighted": +3,
      "Commander killed": -4,
      "Wall section breached": -3,
      "One day without food": -1,
      "Two consecutive days without water": -4,
      "Successful enemy assault repelled": +2,
      "Parley offer received (honorable terms)": -2,
      "Magical morale effect (fear spell, etc.)": "per spell",
    },
  },

  supplyConsumption: {
    description:
      "Resources consumed per day by the defending garrison. Shortfalls impose morale penalties.",
    food: {
      perTroopPerDay: "1 lb (standard ration)",
      shortfallPenalty: "-1 morale per day without full rations",
      starvationThreshold:
        "After 3 days without food, troops suffer 1 level of exhaustion per day",
    },
    water: {
      perTroopPerDay: "0.5 gallon minimum",
      shortfallPenalty: "-2 morale per day without water",
      dehydrationThreshold:
        "After 1 day without water, troops suffer 1 level of exhaustion per day",
    },
    ammunition: {
      perArcherPerDay: "20 arrows (active combat)",
      perSiegeEnginePerDay: "10 projectiles",
      shortfallPenalty:
        "Ranged attacks halved; morale -1 per day of shortage in active combat",
    },
    fuel: {
      description: "Wood for heating oil, cooking, and warmth in cold climates",
      perDayForGarrisonOf100: "1 cord of wood",
      shortfallPenalty:
        "-1 morale per day in cold conditions without fuel; boiling oil unavailable",
    },
  },

  reinforcementSchedule: {
    description:
      "Guidelines for determining when and how reinforcements might arrive to relieve a besieged garrison.",
    typicalResponseTimes: {
      "Local lord (within 1 day's ride)": "2d6 days to muster and arrive",
      "Regional force (2–5 days' ride)": "1d4 weeks",
      "Royal or major army (distant)": "1d6+2 weeks",
    },
    complicatingFactors: [
      "Road conditions and season (winter doubles travel time)",
      "Intercepting force blocking the relief column",
      "Political disputes delaying mobilization",
      "Misinformation about garrison's situation",
    ],
    reliefForceSize:
      "A relief force must outnumber the besieging army by at least 1.5:1 to break the siege directly. A smaller force may resupply by stealth or create a diversion.",
  },
};

// ---------------------------------------------------------------------------
// MASS_COMBAT_SIMPLIFIED
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} UnitDefinition
 * @property {string} size         — label for this unit size category
 * @property {number} minCount     — minimum individual combatants
 * @property {number} maxCount     — maximum individual combatants
 * @property {string} hpFormula    — how to calculate unit HP
 * @property {string} attackFormula — how to handle unit attacks
 * @property {string} moraleFormula — when to check morale
 */

/** @type {Object} */
export const MASS_COMBAT_SIMPLIFIED = {
  unitSizes: {
    squad: {
      size: "Squad",
      minCount: 4,
      maxCount: 8,
      hpFormula:
        "Individual HP × count (e.g., 8 soldiers at 11 HP each = 88 unit HP)",
      attackFormula:
        "Make a single attack roll per round. On a hit, roll individual damage × number of attackers in effective range.",
      moraleFormula: "Check morale when unit drops below 50% HP.",
    },
    platoon: {
      size: "Platoon",
      minCount: 20,
      maxCount: 50,
      hpFormula: "Individual HP × count",
      attackFormula:
        "Make 1d4 attack rolls per round, each dealing individual damage. Represents staggered waves of attackers.",
      moraleFormula:
        "Check morale at 50% HP and again at 25% HP. Rout on second failure.",
    },
    company: {
      size: "Company",
      minCount: 100,
      maxCount: 200,
      hpFormula: "Individual HP × count",
      attackFormula:
        "Make 2d4 attack rolls per round, each dealing individual damage × 2 (to account for massed attacks).",
      moraleFormula:
        "Check morale at 50%, 25%, and 10% HP. Unit disbands on third failure.",
    },
    regiment: {
      size: "Regiment",
      minCount: 500,
      maxCount: Infinity,
      hpFormula: "Individual HP × count (track in hundreds for bookkeeping)",
      attackFormula:
        "Make 3d6 attack rolls per round, each dealing individual damage × 3. Represent separate battalion actions.",
      moraleFormula:
        "Check morale at 60%, 40%, 20%, and 5% HP. Each failure reduces attack rolls by 1d6. Rout at 4 failures.",
    },
  },

  simplifiedAttackRolls: {
    description:
      "To keep mass combat tractable at the table, aggregate unit attacks as follows.",
    attackBonus:
      "Use the standard attack bonus of the unit's troop type (e.g., soldier: +4, veteran: +5, elite: +6).",
    damageOnHit:
      "Multiply individual weapon damage by a factor based on unit size: squad ×1, platoon ×2, company ×3, regiment ×5.",
    armorClass:
      "Use individual AC of the target unit's troop type. No averaging needed — one AC represents the fighting effectiveness of the line.",
    advantage:
      "Grant advantage on attacks if the unit has cavalry charge, higher ground, or flanking. Grant disadvantage if the unit is disordered, in difficult terrain, or has depleted morale.",
  },

  moraleChecks: {
    description:
      "When a unit crosses a morale threshold, the unit commander makes a Wisdom (Insight) or Charisma check against DC 12. Modifiers apply.",
    modifiers: {
      "Friendly commander with 14+ Charisma within 60 ft": "+2",
      "Unit has suffered 10%+ casualties in one round": "-3",
      "Friendly unit just routed within 120 ft": "-2",
      "Unit is defending home territory": "+2",
      "Unit is outnumbered 2:1 or more": "-2",
      "Enemy has displayed powerful magic this combat": "-3",
    },
    outcomes: {
      "Success by 5+": "Unit holds and gains +1 to attack rolls until next morale check.",
      "Success": "Unit holds. No change.",
      "Failure by 1–4": "Unit falls back 60 ft in good order. Attacks at disadvantage until rallied.",
      "Failure by 5+": "Unit routs. Retreats at full speed away from the enemy. May be rallied with DC 15 Charisma (Persuasion) check by a commander.",
    },
  },

  specialAbilities: {
    description:
      "Some unit types carry special rules reflecting training, equipment, or unit cohesion.",
    cavalry: {
      name: "Cavalry",
      rule: "On the first round of combat, if the cavalry unit charges at least 60 ft before attacking, it deals double damage on all hits.",
    },
    archers: {
      name: "Archers / Crossbowmen",
      rule: "Ranged attack rolls up to 300 ft (no penalty), 600 ft (disadvantage). Cannot make ranged attacks if an enemy unit is adjacent.",
    },
    shieldwall: {
      name: "Shield Wall",
      rule: "Infantry unit gains +2 AC when not moving. Cannot use shield wall while advancing.",
    },
    eliteUnit: {
      name: "Elite Unit",
      rule: "Automatically passes morale checks above 50% HP. Gains +2 to all attack rolls. Counts as two standard units for combat resolution purposes.",
    },
    monsters: {
      name: "Monster Unit",
      rule: "Single powerful creature (giant, dragon, etc.) counts as a full unit. Use its actual HP and attack actions from the Monster Manual. Morale check only on near-death (10% HP).",
    },
  },
};

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Retrieve a fortification type by its id key.
 * Returns null if the key is not found.
 *
 * @param {string} type — key from FORTIFICATION_TYPES (e.g. "stoneWall")
 * @returns {Fortification|null}
 */
export function getFortification(type) {
  return FORTIFICATION_TYPES[type] ?? null;
}

/**
 * Retrieve a siege weapon by its id key.
 * Returns null if the key is not found.
 *
 * @param {string} name — key from SIEGE_WEAPONS (e.g. "ballista")
 * @returns {SiegeWeapon|null}
 */
export function getSiegeWeapon(name) {
  return SIEGE_WEAPONS[name] ?? null;
}

/**
 * Estimate how many rounds of sustained fire a siege weapon crew needs to
 * reduce a fortification section to 0 HP.
 *
 * This uses the average damage per hit, accounting for the fortification's
 * damage threshold. The function does NOT model attack rolls (it assumes
 * every shot lands, which is appropriate for structure-vs-structure rules
 * where the "roll to hit" step is often omitted).
 *
 * @param {number} fortificationHP      — HP of the fortification section
 * @param {string} siegeWeaponDamageStr — damage string from SIEGE_WEAPONS (e.g. "5d10 bludgeoning")
 * @param {number} count                — number of identical siege weapons firing each round
 * @returns {{ rounds: number, hours: number, notes: string }}
 */
export function calculateSiegeDuration(fortificationHP, siegeWeaponDamageStr, count) {
  if (
    typeof fortificationHP !== "number" ||
    fortificationHP <= 0 ||
    typeof siegeWeaponDamageStr !== "string" ||
    typeof count !== "number" ||
    count <= 0
  ) {
    return { rounds: null, hours: null, notes: "Invalid parameters supplied." };
  }

  // Parse "XdY" from the front of the damage string.
  const match = siegeWeaponDamageStr.match(/^(\d+)d(\d+)/);
  if (!match) {
    return {
      rounds: null,
      hours: null,
      notes: `Could not parse damage dice from "${siegeWeaponDamageStr}".`,
    };
  }

  const diceCount = parseInt(match[1], 10);
  const diceSize = parseInt(match[2], 10);
  const avgDamagePerWeapon = diceCount * ((diceSize + 1) / 2);
  const avgDamagePerRound = avgDamagePerWeapon * count;

  if (avgDamagePerRound <= 0) {
    return { rounds: null, hours: null, notes: "Average damage per round is zero." };
  }

  const roundsNeeded = Math.ceil(fortificationHP / avgDamagePerRound);

  // Convert rounds to hours. Combat rounds are 6 seconds; 600 rounds = 1 hour.
  // Siege bombardment is typically abstracted to 10-minute turns (100 rounds),
  // but we report raw rounds for GM flexibility.
  const hoursNeeded = parseFloat((roundsNeeded / 600).toFixed(2));

  return {
    rounds: roundsNeeded,
    hours: hoursNeeded,
    notes: `${count} × ${siegeWeaponDamageStr} weapon(s); ~${avgDamagePerRound.toFixed(1)} avg damage/round vs ${fortificationHP} HP. Does not account for damage threshold, repair, or missed shots.`,
  };
}

/**
 * Evaluate the current morale of a garrison based on observable conditions.
 * Returns the adjusted morale score (clamped 0–20) and a status label.
 *
 * @param {number}  casualties           — troops lost as a fraction of starting strength (0.0 – 1.0)
 * @param {number}  supplyDays           — days of full supplies remaining (negative = days in shortage)
 * @param {boolean} reinforcementComing  — true if a confirmed relief force is en route
 * @returns {{ morale: number, status: string, effects: string[] }}
 */
export function checkGarrisonMorale(casualties, supplyDays, reinforcementComing) {
  let morale = GARRISON_RULES.moraleSystem.startingMorale; // 15 baseline
  const effects = [];

  // Casualty pressure
  if (casualties >= 0.5) {
    morale -= 4;
    effects.push("50%+ casualties: morale −4");
  } else if (casualties >= 0.25) {
    morale -= 2;
    effects.push("25%+ casualties: morale −2");
  } else if (casualties >= 0.1) {
    morale -= 1;
    effects.push("10%+ casualties: morale −1");
  }

  // Supply situation
  if (supplyDays < 0) {
    const daysShort = Math.abs(supplyDays);
    const penalty = Math.min(daysShort * 1, 8); // cap at −8 for supply crisis
    morale -= penalty;
    effects.push(`${daysShort} day(s) in supply shortage: morale −${penalty}`);
  } else if (supplyDays <= 3) {
    morale -= 2;
    effects.push("Critically low supplies (≤3 days): morale −2");
  } else if (supplyDays <= 7) {
    morale -= 1;
    effects.push("Low supplies (≤7 days): morale −1");
  } else {
    effects.push("Supplies adequate: no morale penalty");
  }

  // Reinforcement hope
  if (reinforcementComing) {
    morale += 3;
    effects.push("Relief force en route: morale +3");
  }

  morale = Math.max(0, Math.min(20, morale));

  // Map morale to status label using threshold table
  const thresholds = GARRISON_RULES.moraleSystem.thresholds;
  let status = thresholds[0]; // collapsed default
  for (const threshold of [20, 15, 10, 5, 0]) {
    if (morale >= threshold) {
      status = thresholds[threshold];
      break;
    }
  }

  return { morale, status, effects };
}

/**
 * Resolve one round of mass combat between two opposing forces.
 * Each unit object should have: { name, hp, maxHp, attackBonus, damagePerHit, ac, count, size }.
 *
 * Mutates the hp values of each unit in place and returns a summary of the round.
 *
 * @param {Object[]} attackerUnits — array of unit objects for the attacking force
 * @param {Object[]} defenderUnits — array of unit objects for the defending force
 * @returns {{ log: string[], attackersDefeated: Object[], defendersDefeated: Object[] }}
 */
export function resolveMassCombatRound(attackerUnits, defenderUnits) {
  const log = [];
  const attackersDefeated = [];
  const defendersDefeated = [];

  /**
   * Determine how many attack rolls a unit makes per round based on size.
   * @param {Object} unit
   * @returns {number}
   */
  function attacksPerRound(unit) {
    switch (unit.size) {
      case "squad":    return 1;
      case "platoon":  return 2;
      case "company":  return 4;
      case "regiment": return 6;
      default:         return 1;
    }
  }

  /**
   * Damage multiplier per hit based on unit size.
   * @param {Object} unit
   * @returns {number}
   */
  function damageMultiplier(unit) {
    switch (unit.size) {
      case "squad":    return 1;
      case "platoon":  return 2;
      case "company":  return 3;
      case "regiment": return 5;
      default:         return 1;
    }
  }

  /**
   * Roll a d20 and return the result.
   * @returns {number}
   */
  function d20() {
    return Math.floor(Math.random() * 20) + 1;
  }

  /**
   * Execute all attacks from one side against the other.
   * @param {Object[]} attackers
   * @param {Object[]} defenders
   * @param {string}   sideLabel
   * @param {Object[]} defeatedArray — collect defeated units here
   */
  function executeAttacks(attackers, defenders, sideLabel, defeatedArray) {
    const activeDefenders = defenders.filter((u) => u.hp > 0);
    if (activeDefenders.length === 0) return;

    attackers
      .filter((unit) => unit.hp > 0)
      .forEach((unit) => {
        // Pick a random target from active defenders
        const target =
          activeDefenders[Math.floor(Math.random() * activeDefenders.length)];
        const numAttacks = attacksPerRound(unit);
        const dmgMult = damageMultiplier(unit);
        let totalDamage = 0;
        let hits = 0;

        for (let i = 0; i < numAttacks; i++) {
          const roll = d20();
          const total = roll + (unit.attackBonus ?? 4);
          if (roll === 20 || total >= target.ac) {
            const dmg = (unit.damagePerHit ?? 8) * dmgMult;
            totalDamage += dmg;
            hits++;
          }
        }

        if (hits > 0) {
          target.hp = Math.max(0, target.hp - totalDamage);
          log.push(
            `[${sideLabel}] ${unit.name} → ${target.name}: ${hits}/${numAttacks} hit(s), ${totalDamage} damage (target HP: ${target.hp}/${target.maxHp})`
          );
          if (target.hp === 0) {
            log.push(`  *** ${target.name} has been defeated! ***`);
            defeatedArray.push(target);
          }
        } else {
          log.push(
            `[${sideLabel}] ${unit.name} → ${target.name}: 0/${numAttacks} hit(s), no damage dealt`
          );
        }
      });
  }

  log.push("=== Mass Combat Round Begin ===");
  executeAttacks(attackerUnits, defenderUnits, "ATTACKER", defendersDefeated);
  executeAttacks(defenderUnits, attackerUnits, "DEFENDER", attackersDefeated);
  log.push("=== Mass Combat Round End ===");

  return { log, attackersDefeated, defendersDefeated };
}
