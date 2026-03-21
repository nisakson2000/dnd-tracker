/**
 * chaseSystem.js
 * Chase Sequences and Pursuit Mechanics
 *
 * Roadmap Items Covered:
 * - Chase sequence tracker (turn order, distance, complications)
 * - Urban chase complication table (d20, DMG-based)
 * - Wilderness chase complication table (d20, DMG-based)
 * - Chase actions reference (dash, dodge, attack, hide, etc.)
 * - Exhaustion tracking for repeated dashing
 * - Max dashes per participant (3 + CON modifier)
 * - CON check rule for dashing beyond limit (DC 10)
 * - Round-by-round chase resolution helper
 * - Chase encounter generator (environment + start distance)
 */

// ---------------------------------------------------------------------------
// CHASE_RULES
// Core DMG chase rules summary and configuration
// ---------------------------------------------------------------------------

export const CHASE_RULES = {
  title: "Chase Sequence Rules",
  source: "DMG Chapter 8",
  summary:
    "A chase is an extended pursuit broken into rounds. Each participant acts on their turn. " +
    "The quarry starts at a set distance from pursuers. The chase ends when the quarry is caught, " +
    "escapes (typically after 10 rounds or breaking line of sight), or a participant gives up.",
  maxRounds: 10,
  dashLimit: {
    description:
      "Each participant can dash a limited number of times equal to 3 + their CON modifier (minimum 0). " +
      "After using all dashes, they must make a DC 10 CON check at the start of each round they wish to dash again. " +
      "On a failure, they cannot dash that round and gain 1 level of exhaustion.",
    baseValue: 3,
    modifier: "CON",
    minimum: 0,
    extraDashDC: 10,
    extraDashAbility: "CON",
    failurePenalty: "1 level of exhaustion, cannot dash this round",
  },
  escapeConditions: [
    "Quarry breaks line of sight and succeeds on a DC 15 Stealth check",
    "Chase exceeds 10 rounds with no capture",
    "All pursuers are incapacitated or stop the chase",
    "Quarry reaches a safe location (door, crowd, building)",
  ],
  catchConditions: [
    "Pursuer ends their turn in the same space as the quarry",
    "Quarry is reduced to 0 speed (restrained, incapacitated, etc.)",
    "Quarry willingly stops",
  ],
  distanceUnit: "feet",
  startingDistanceRange: { min: 30, max: 120 },
  notes: [
    "Spells and abilities that impose conditions (restrained, prone) can change the chase dramatically.",
    "Complications are rolled at the start of each participant's turn (optional — DM discretion).",
    "A participant can choose not to dash and instead take a different action.",
  ],
};

// ---------------------------------------------------------------------------
// URBAN_COMPLICATIONS
// d20 complication table for city/town chase environments
// ---------------------------------------------------------------------------

export const URBAN_COMPLICATIONS = {
  environment: "urban",
  label: "Urban Chase Complications",
  description: "Roll a d20 at the start of your turn. On a result with a complication, resolve it before acting.",
  table: [
    {
      roll: 1,
      name: "Large Obstacle",
      description: "A heavy cart, fallen scaffolding, or overturned wagon blocks the path.",
      skillCheck: "Athletics",
      dc: 15,
      successEffect: "Move through normally, no speed lost.",
      failureEffect: "Movement stops at the obstacle this round.",
    },
    {
      roll: 2,
      name: "Crowd",
      description: "A dense crowd of bystanders fills the street ahead.",
      skillCheck: "Acrobatics",
      dc: 10,
      successEffect: "Weave through the crowd at half speed.",
      failureEffect: "Movement is halved and you lose your action as you push through.",
    },
    {
      roll: 3,
      name: "Narrow Alley",
      description: "The path squeezes into a tight alley; only one creature can pass at a time.",
      skillCheck: "Acrobatics",
      dc: 12,
      successEffect: "Slip through without losing speed.",
      failureEffect: "Speed halved for this round.",
    },
    {
      roll: 4,
      name: "Market Stalls",
      description: "Rows of market stalls with goods spilling into the lane. Crashing through costs time.",
      skillCheck: "Acrobatics",
      dc: 10,
      successEffect: "Dodge through without incident.",
      failureEffect: "Knocked prone; must use movement to stand.",
    },
    {
      roll: 5,
      name: "Stairs",
      description: "A steep outdoor staircase leads up or down.",
      skillCheck: "Athletics",
      dc: 10,
      successEffect: "Traverse the stairs at full speed.",
      failureEffect: "Stumble; speed is halved this round.",
    },
    {
      roll: 6,
      name: "Laundry Lines",
      description: "Low-hanging laundry lines stretch across the alley.",
      skillCheck: "Acrobatics",
      dc: 12,
      successEffect: "Duck under them cleanly.",
      failureEffect: "Entangled; speed reduced by 10 ft. this round.",
    },
    {
      roll: 7,
      name: "Horse and Cart",
      description: "A horse-drawn cart cuts across your path at speed.",
      skillCheck: "Acrobatics",
      dc: 13,
      successEffect: "Leap over the traces or dodge aside.",
      failureEffect: "Struck by the cart; take 1d6 bludgeoning damage and are knocked prone.",
    },
    {
      roll: 8,
      name: "Dead End",
      description: "The alley dead-ends at a tall wall.",
      skillCheck: "Athletics",
      dc: 15,
      successEffect: "Scale the wall and continue on the other side.",
      failureEffect: "Fail to climb; must backtrack (lose 10 ft. of movement this round).",
    },
    {
      roll: 9,
      name: "Window or Door",
      description: "Crashing through a closed window or door is the fastest option.",
      skillCheck: "Athletics",
      dc: 10,
      successEffect: "Burst through and continue at full speed; 1d4 slashing damage either way.",
      failureEffect: "Bounce off; stunned until end of turn, lose movement.",
      notes: "1d4 slashing damage is taken on success and failure.",
    },
    {
      roll: 10,
      name: "Bridge or Gap",
      description: "A gap between rooftops or a narrow bridge over a canal.",
      skillCheck: "Athletics",
      dc: 12,
      successEffect: "Cross the gap or bridge without issue.",
      failureEffect: "Fall into the canal or alley below (1d6 bludgeoning damage per 10 ft.).",
    },
    {
      roll: 11,
      name: "Construction Site",
      description: "An active construction site with piles of lumber, rope, and scaffolding.",
      skillCheck: "Acrobatics",
      dc: 12,
      successEffect: "Weave through the debris without incident.",
      failureEffect: "Tripped by a rope or beam; fall prone.",
    },
    {
      roll: 12,
      name: "City Guards",
      description: "A pair of city guards stands directly in your path and shouts for you to stop.",
      skillCheck: "Persuasion or Deception",
      dc: 15,
      successEffect: "Talk your way past; guards let you through.",
      failureEffect: "Guards attempt to grapple you; make a contested Athletics check or be restrained.",
    },
    {
      roll: 13,
      name: "Sewer Grate",
      description: "An open or partially open sewer grate gapes in the cobblestones.",
      skillCheck: "Perception",
      dc: 12,
      successEffect: "Spot and avoid it in time.",
      failureEffect: "Leg plunges into the grate; speed halved and 1d4 bludgeoning damage.",
    },
    {
      roll: 14,
      name: "Street Performer",
      description: "A juggler, acrobat, or fire-breather is mid-performance in the street.",
      skillCheck: "Acrobatics",
      dc: 10,
      successEffect: "Dodge the performer and their audience.",
      failureEffect: "Collide with the performer; both fall prone.",
    },
    {
      roll: 15,
      name: "Drunk or Beggar",
      description: "A staggering drunk or a seated beggar blocks the narrow path.",
      skillCheck: "Acrobatics",
      dc: 8,
      successEffect: "Step aside easily.",
      failureEffect: "Trip over them; fall prone.",
    },
    {
      roll: 16,
      name: "Rain and Mud",
      description: "A rain-slicked cobblestone stretch or fresh mud puddle makes footing treacherous.",
      skillCheck: "Acrobatics",
      dc: 13,
      successEffect: "Maintain footing without losing pace.",
      failureEffect: "Slip and fall prone.",
    },
    {
      roll: 17,
      name: "Rooftop Option",
      description: "A low rooftop offers a faster route if you can get up there.",
      skillCheck: "Athletics",
      dc: 12,
      successEffect: "Gain the rooftop route — move an additional 10 ft. this round.",
      failureEffect: "Can't make the jump; continue at street level.",
      notes: "This is an opportunity, not a hazard. Optional to attempt.",
    },
    {
      roll: 18,
      name: "Shortcut",
      description: "You spot a narrow cut-through that shaves a significant distance.",
      skillCheck: null,
      dc: null,
      successEffect: "Move an additional 15 ft. this round.",
      failureEffect: null,
      notes: "No check required. Automatically beneficial.",
    },
    {
      roll: 19,
      name: "No Complication",
      description: "The path is clear this round.",
      skillCheck: null,
      dc: null,
      successEffect: "Proceed normally.",
      failureEffect: null,
    },
    {
      roll: 20,
      name: "No Complication",
      description: "The path is clear this round.",
      skillCheck: null,
      dc: null,
      successEffect: "Proceed normally.",
      failureEffect: null,
    },
  ],
};

// ---------------------------------------------------------------------------
// WILDERNESS_COMPLICATIONS
// d20 complication table for outdoor/wilderness chase environments
// ---------------------------------------------------------------------------

export const WILDERNESS_COMPLICATIONS = {
  environment: "wilderness",
  label: "Wilderness Chase Complications",
  description: "Roll a d20 at the start of your turn. On a result with a complication, resolve it before acting.",
  table: [
    {
      roll: 1,
      name: "Brambles and Thorns",
      description: "A dense thicket of thorny brambles crosses the path.",
      skillCheck: "Athletics",
      dc: 12,
      successEffect: "Power through with only minor scratches.",
      failureEffect: "Take 1d4 piercing damage and speed is halved.",
    },
    {
      roll: 2,
      name: "Uneven Ground",
      description: "Rocky, rutted, or root-riddled terrain underfoot.",
      skillCheck: "Acrobatics",
      dc: 10,
      successEffect: "Maintain footing and pace.",
      failureEffect: "Stumble; speed is halved this round.",
    },
    {
      roll: 3,
      name: "Fallen Tree",
      description: "A large fallen tree trunk blocks the path.",
      skillCheck: "Athletics",
      dc: 10,
      successEffect: "Vault over it without breaking stride.",
      failureEffect: "Clip it on the way over; fall prone on the far side.",
    },
    {
      roll: 4,
      name: "Stream or River",
      description: "A fast-flowing stream or shallow river cuts across the route.",
      skillCheck: "Athletics",
      dc: 12,
      successEffect: "Ford or leap across without issue.",
      failureEffect:
        "Swept 10 ft. downstream; lose your action this round regaining your footing.",
    },
    {
      roll: 5,
      name: "Steep Slope",
      description: "A sharply angled hillside — either up or down — lies ahead.",
      skillCheck: "Athletics",
      dc: 12,
      successEffect: "Traverse the slope at full speed.",
      failureEffect: "Lose 10 ft. of movement as you scramble.",
    },
    {
      roll: 6,
      name: "Animal Burrow",
      description: "Concealed animal burrows honeycomb the ground underfoot.",
      skillCheck: "DEX Save",
      dc: 12,
      successEffect: "Sidestep in time.",
      failureEffect: "Foot catches; twisted ankle. Speed halved for the remainder of the chase.",
    },
    {
      roll: 7,
      name: "Swarm of Insects",
      description: "A disturbed nest launches a swarm of biting insects into your face.",
      skillCheck: "CON Save",
      dc: 11,
      successEffect: "Shrug off the stings and press on.",
      failureEffect: "Blinded until the end of your next turn.",
    },
    {
      roll: 8,
      name: "Mud and Bog",
      description: "A soft, sucking stretch of bog mud grabs at your feet.",
      skillCheck: "STR Save",
      dc: 13,
      successEffect: "Yank free without losing speed.",
      failureEffect: "Restrained until the start of your next turn.",
    },
    {
      roll: 9,
      name: "Dense Fog",
      description: "A low-lying bank of fog reduces visibility to 10 feet.",
      skillCheck: "Perception",
      dc: 12,
      successEffect: "Navigate by sound and memory; no speed penalty.",
      failureEffect: "Run in the wrong direction; lose 15 ft. of effective distance this round.",
    },
    {
      roll: 10,
      name: "Cliff Edge",
      description: "The terrain ends abruptly at a sheer drop.",
      skillCheck: "Perception",
      dc: 13,
      successEffect: "Spot it in time and veer away.",
      failureEffect: "Careen over the edge; DEX save DC 15 to catch a ledge. On failure, fall.",
    },
    {
      roll: 11,
      name: "Rockslide",
      description: "Loose stones high above begin to tumble down the slope toward you.",
      skillCheck: "DEX Save",
      dc: 14,
      successEffect: "Dodge the falling rocks.",
      failureEffect: "Struck by rocks; take 2d6 bludgeoning damage and fall prone.",
    },
    {
      roll: 12,
      name: "Wildlife Stampede",
      description: "A herd of deer, boar, or other animals burst from the underbrush and cross the path.",
      skillCheck: "Acrobatics",
      dc: 13,
      successEffect: "Weave through the stampede.",
      failureEffect: "Trampled; take 1d8 bludgeoning damage and fall prone.",
    },
    {
      roll: 13,
      name: "Quicksand",
      description: "A patch of ground that looks firm gives way to quicksand.",
      skillCheck: "Perception",
      dc: 14,
      successEffect: "Spot it before stepping in; move around it.",
      failureEffect:
        "Sink in; restrained and begin sinking (Athletics DC 14 each turn to escape, or sink 1 ft. per round).",
    },
    {
      roll: 14,
      name: "Ravine",
      description: "A narrow but deep ravine cuts across the path.",
      skillCheck: "Athletics",
      dc: 13,
      successEffect: "Leap across cleanly.",
      failureEffect: "Fall in; take falling damage (1d6 per 10 ft.) and must climb out.",
    },
    {
      roll: 15,
      name: "Thick Brush",
      description: "Impenetrable undergrowth forces a choice: push through or go around.",
      skillCheck: "Athletics",
      dc: 11,
      successEffect: "Force through at half speed.",
      failureEffect: "Go around; lose 20 ft. of effective movement this round.",
    },
    {
      roll: 16,
      name: "Slippery Rocks",
      description: "Wet or mossy rocks line the path, treacherous underfoot.",
      skillCheck: "Acrobatics",
      dc: 13,
      successEffect: "Pick your footing carefully; no speed penalty.",
      failureEffect: "Slip and fall prone.",
    },
    {
      roll: 17,
      name: "Shortcut Trail",
      description: "A game trail or old path offers a faster route through the terrain.",
      skillCheck: null,
      dc: null,
      successEffect: "Move an additional 15 ft. this round.",
      failureEffect: null,
      notes: "No check required. Automatically beneficial.",
    },
    {
      roll: 18,
      name: "No Complication",
      description: "The terrain is open this round.",
      skillCheck: null,
      dc: null,
      successEffect: "Proceed normally.",
      failureEffect: null,
    },
    {
      roll: 19,
      name: "No Complication",
      description: "The terrain is open this round.",
      skillCheck: null,
      dc: null,
      successEffect: "Proceed normally.",
      failureEffect: null,
    },
    {
      roll: 20,
      name: "No Complication",
      description: "The terrain is open this round.",
      skillCheck: null,
      dc: null,
      successEffect: "Proceed normally.",
      failureEffect: null,
    },
  ],
};

// ---------------------------------------------------------------------------
// CHASE_ACTIONS
// Actions available to participants during a chase round
// ---------------------------------------------------------------------------

export const CHASE_ACTIONS = {
  label: "Chase Actions",
  description:
    "On your turn during a chase, you can take one of the following actions in addition to your movement.",
  actions: [
    {
      name: "Dash",
      id: "dash",
      description:
        "Double your movement speed for this round. Counts against your dash limit (3 + CON modifier). " +
        "Beyond the limit, requires a DC 10 CON check or you fail to dash and gain 1 level of exhaustion.",
      requiresCheck: false,
      notes: "Tracked separately per participant. Most common chase action.",
    },
    {
      name: "Dodge",
      id: "dodge",
      description:
        "Focus entirely on avoiding harm. Attack rolls against you have disadvantage until the start of " +
        "your next turn, and you make DEX saving throws with advantage. You do not gain extra movement.",
      requiresCheck: false,
      notes: "Useful if being attacked by the quarry or their allies during the chase.",
    },
    {
      name: "Attack",
      id: "attack",
      description:
        "Make a melee or ranged attack against a creature within range. All attack rolls made while " +
        "running at full speed are made with disadvantage.",
      requiresCheck: false,
      notes: "Disadvantage applies unless the attacker is stationary or the DM rules otherwise.",
    },
    {
      name: "Use Object",
      id: "use_object",
      description:
        "Interact with an object in the environment or in your inventory (draw a weapon, open a door, " +
        "throw an object to create an obstacle, etc.).",
      requiresCheck: false,
      notes: "Can be used to create hazards that force pursuers to make checks.",
    },
    {
      name: "Cast a Spell",
      id: "cast_spell",
      description:
        "Cast a spell with a casting time of 1 action. Concentration spells can significantly affect " +
        "a chase (e.g., Fog Cloud, Grease, Web, Misty Step).",
      requiresCheck: false,
      notes:
        "Spells that create difficult terrain or restrain the target can effectively end a chase. " +
        "Misty Step and Dimension Door are especially powerful for quarries.",
    },
    {
      name: "Help",
      id: "help",
      description:
        "Assist another participant. They gain advantage on their next ability check or attack roll " +
        "before the start of your next turn.",
      requiresCheck: false,
      notes: "Useful for boosting a slower pursuer's Athletics or Acrobatics check.",
    },
    {
      name: "Disengage",
      id: "disengage",
      description:
        "Your movement does not provoke opportunity attacks for the rest of this turn.",
      requiresCheck: false,
      notes: "Valuable for a quarry trying to escape from melee reach.",
    },
    {
      name: "Hide",
      id: "hide",
      description:
        "Attempt to break line of sight and hide from pursuers. Requires cover or concealment (turning a corner, " +
        "ducking into a doorway, entering a crowd). Make a Stealth check contested by pursuers' Passive Perception.",
      requiresCheck: true,
      checkType: "Stealth",
      opposedBy: "Passive Perception",
      notes:
        "If successful, pursuers must make a DC 15 Perception check each round to relocate the quarry. " +
        "Combined with breaking line of sight, this is the primary escape mechanism.",
    },
  ],
};

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Roll a d20 and return the matching complication for the given environment.
 * @param {"urban" | "wilderness"} environment
 * @returns {{ roll: number, complication: object }}
 */
export function rollChaseComplication(environment) {
  const roll = Math.floor(Math.random() * 20) + 1;
  const table =
    environment === "wilderness"
      ? WILDERNESS_COMPLICATIONS.table
      : URBAN_COMPLICATIONS.table;

  const complication = table.find((entry) => entry.roll === roll) || table[table.length - 1];

  return { roll, complication };
}

/**
 * Calculate the maximum number of dashes a participant can make without risking exhaustion.
 * @param {number} conModifier - The participant's CON ability modifier (can be negative)
 * @returns {number} Maximum free dashes (minimum 0)
 */
export function calculateMaxDashes(conModifier) {
  return Math.max(0, CHASE_RULES.dashLimit.baseValue + conModifier);
}

/**
 * Resolve a single round of a chase, advancing or reducing distance based on participant speeds.
 * Returns updated state with new distance, round number, and status.
 *
 * @param {Array<{ name: string, speed: number, dashing: boolean, dashesUsed: number, conModifier: number }>} pursuers
 * @param {{ name: string, speed: number, dashing: boolean, dashesUsed: number, conModifier: number }} quarry
 * @param {number} round - Current round number (1-indexed)
 * @param {number} currentDistance - Current distance between lead pursuer and quarry (feet)
 * @returns {{ round: number, distance: number, status: string, log: string[] }}
 */
export function resolveChaseRound(pursuers, quarry, round, currentDistance) {
  const log = [];

  // Determine quarry movement this round
  const quarryMaxDashes = calculateMaxDashes(quarry.conModifier);
  let quarryMove = quarry.speed;
  if (quarry.dashing) {
    const exhaustionResult = checkExhaustion(quarry.dashesUsed, quarry.conModifier);
    if (exhaustionResult.canDash) {
      quarryMove = quarry.speed * 2;
      log.push(`${quarry.name} dashes — moves ${quarryMove} ft.`);
    } else {
      log.push(
        `${quarry.name} failed CON check to dash (dashes used: ${quarry.dashesUsed}/${quarryMaxDashes}) — gains exhaustion, moves ${quarryMove} ft. without dashing.`
      );
    }
  } else {
    log.push(`${quarry.name} moves ${quarryMove} ft. without dashing.`);
  }

  // Determine fastest pursuer movement this round
  let fastestPursuerMove = 0;
  let fastestPursuerName = "";
  pursuers.forEach((pursuer) => {
    let move = pursuer.speed;
    if (pursuer.dashing) {
      const exhaustionResult = checkExhaustion(pursuer.dashesUsed, pursuer.conModifier);
      if (exhaustionResult.canDash) {
        move = pursuer.speed * 2;
        log.push(`${pursuer.name} dashes — moves ${move} ft.`);
      } else {
        log.push(
          `${pursuer.name} failed CON check to dash — gains exhaustion, moves ${move} ft. without dashing.`
        );
      }
    } else {
      log.push(`${pursuer.name} moves ${move} ft. without dashing.`);
    }
    if (move > fastestPursuerMove) {
      fastestPursuerMove = move;
      fastestPursuerName = pursuer.name;
    }
  });

  // Update distance
  const netChange = quarryMove - fastestPursuerMove;
  let newDistance = currentDistance + netChange;

  let status = "ongoing";

  if (newDistance <= 0) {
    newDistance = 0;
    status = "caught";
    log.push(`${fastestPursuerName} catches up to ${quarry.name}! Chase ends — quarry caught.`);
  } else if (round >= CHASE_RULES.maxRounds) {
    status = "escaped";
    log.push(
      `Round ${round} — chase time limit reached. ${quarry.name} escapes. Distance: ${newDistance} ft.`
    );
  } else {
    log.push(
      `End of round ${round}. Distance between ${fastestPursuerName} and ${quarry.name}: ${newDistance} ft.`
    );
  }

  return {
    round,
    distance: newDistance,
    status,
    log,
  };
}

/**
 * Check whether a participant can still dash freely or must make a CON check,
 * and simulate the CON check outcome.
 *
 * @param {number} dashesUsed - How many times this participant has already dashed
 * @param {number} conModifier - The participant's CON ability modifier
 * @returns {{ canDash: boolean, requiresCheck: boolean, checkResult: number | null, exhaustionGained: boolean }}
 */
export function checkExhaustion(dashesUsed, conModifier) {
  const maxFreeDashes = calculateMaxDashes(conModifier);

  if (dashesUsed < maxFreeDashes) {
    // Still within the free dash limit
    return {
      canDash: true,
      requiresCheck: false,
      checkResult: null,
      exhaustionGained: false,
    };
  }

  // Must make a DC 10 CON check
  const roll = Math.floor(Math.random() * 20) + 1;
  const total = roll + conModifier;
  const success = total >= CHASE_RULES.dashLimit.extraDashDC;

  return {
    canDash: success,
    requiresCheck: true,
    checkResult: total,
    rollResult: roll,
    dc: CHASE_RULES.dashLimit.extraDashDC,
    exhaustionGained: !success,
  };
}

/**
 * Retrieve a specific chase action by its id.
 * @param {string} actionName - The action id (e.g., "dash", "hide", "attack")
 * @returns {object | undefined}
 */
export function getChaseAction(actionName) {
  return CHASE_ACTIONS.actions.find(
    (a) => a.id === actionName.toLowerCase().replace(/\s+/g, "_")
  );
}

/**
 * Generate a starter chase encounter setup for the given environment and starting distance.
 *
 * @param {"urban" | "wilderness"} environment
 * @param {number} startDistance - Starting distance between pursuer(s) and quarry in feet
 * @returns {{ environment: string, startDistance: number, maxRounds: number, openingComplication: object | null, tips: string[] }}
 */
export function generateChaseEncounter(environment, startDistance) {
  const clampedDistance = Math.max(
    CHASE_RULES.startingDistanceRange.min,
    Math.min(CHASE_RULES.startingDistanceRange.max, startDistance)
  );

  // 50% chance of an opening complication right out of the gate
  let openingComplication = null;
  if (Math.random() < 0.5) {
    const { roll, complication } = rollChaseComplication(environment);
    // Only use it if it's a real complication (not "no complication")
    if (complication.skillCheck !== null) {
      openingComplication = { roll, complication };
    }
  }

  const environmentLabel =
    environment === "wilderness" ? "Wilderness" : "Urban";

  const tips =
    environment === "urban"
      ? [
          "Urban chases favor acrobatic, nimble characters.",
          "The quarry can try to lose pursuers in crowds — Stealth vs. Passive Perception.",
          "City guards may intervene and complicate both sides.",
          "Rooftop routes can bypass many ground-level complications.",
        ]
      : [
          "Wilderness chases favor athletic, durable characters.",
          "Mounts can dramatically speed up either side.",
          "Fog, ravines, and dense brush can separate a party mid-chase.",
          "Animal encounters add chaos — prepare for improvisation.",
        ];

  return {
    environment: environmentLabel,
    startDistance: clampedDistance,
    maxRounds: CHASE_RULES.maxRounds,
    openingComplication,
    tips,
    suggestedStartingDistance: clampedDistance,
    complicationTable:
      environment === "wilderness" ? WILDERNESS_COMPLICATIONS.label : URBAN_COMPLICATIONS.label,
    quickReference: {
      dashLimit: `3 + CON modifier (min 0) free dashes per participant`,
      extraDashRule: `After limit: DC 10 CON check or no dash + 1 exhaustion`,
      escapeRule: `Quarry escapes after ${CHASE_RULES.maxRounds} rounds or by breaking line of sight + DC 15 Stealth`,
    },
  };
}
