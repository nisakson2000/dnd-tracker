/**
 * @file trappingHunting.js
 * @description Wilderness hunting, trapping, and animal handling data and rules for The Codex D&D Companion.
 * Covers prey animals by terrain, hunting methods, trap types, butchering rules, and animal companion taming.
 * No React dependencies — pure data and utility functions only.
 */

// ---------------------------------------------------------------------------
// PREY_ANIMALS
// ---------------------------------------------------------------------------

/**
 * Prey animals organized by terrain type.
 * Each entry includes CR, AC, HP, meat yield (rations), hide value (gp), and tracking DC.
 * @type {Object.<string, Array<{id: string, name: string, cr: number|string, ac: number, hp: number, meatYield: number, hideValue: number, trackingDC: number, size: string}>>}
 */
export const PREY_ANIMALS = {
  forest: [
    {
      id: "deer",
      name: "Deer",
      cr: 0,
      ac: 13,
      hp: 4,
      meatYield: 6,
      hideValue: 2,
      trackingDC: 10,
      size: "medium",
    },
    {
      id: "boar",
      name: "Boar",
      cr: "1/4",
      ac: 11,
      hp: 11,
      meatYield: 8,
      hideValue: 1,
      trackingDC: 12,
      size: "medium",
    },
    {
      id: "rabbit",
      name: "Rabbit",
      cr: 0,
      ac: 13,
      hp: 1,
      meatYield: 1,
      hideValue: 1,
      trackingDC: 8,
      size: "tiny",
    },
    {
      id: "pheasant",
      name: "Pheasant",
      cr: 0,
      ac: 11,
      hp: 1,
      meatYield: 1,
      hideValue: 0,
      trackingDC: 10,
      size: "tiny",
    },
  ],
  plains: [
    {
      id: "bison",
      name: "Bison",
      cr: "1/2",
      ac: 11,
      hp: 15,
      meatYield: 20,
      hideValue: 8,
      trackingDC: 8,
      size: "large",
    },
    {
      id: "antelope",
      name: "Antelope",
      cr: 0,
      ac: 13,
      hp: 5,
      meatYield: 5,
      hideValue: 3,
      trackingDC: 12,
      size: "medium",
    },
    {
      id: "prairie_chicken",
      name: "Prairie Chicken",
      cr: 0,
      ac: 11,
      hp: 1,
      meatYield: 1,
      hideValue: 0,
      trackingDC: 9,
      size: "tiny",
    },
  ],
  mountain: [
    {
      id: "mountain_goat",
      name: "Mountain Goat",
      cr: "1/4",
      ac: 11,
      hp: 5,
      meatYield: 5,
      hideValue: 3,
      trackingDC: 14,
      size: "medium",
    },
    {
      id: "eagle",
      name: "Eagle",
      cr: 0,
      ac: 12,
      hp: 3,
      meatYield: 1,
      hideValue: 0,
      trackingDC: 13,
      size: "small",
    },
  ],
  swamp: [
    {
      id: "alligator",
      name: "Alligator",
      cr: "1/4",
      ac: 12,
      hp: 19,
      meatYield: 10,
      hideValue: 15,
      trackingDC: 13,
      size: "large",
    },
    {
      id: "giant_frog",
      name: "Giant Frog",
      cr: "1/4",
      ac: 11,
      hp: 18,
      meatYield: 3,
      hideValue: 1,
      trackingDC: 11,
      size: "medium",
    },
  ],
  arctic: [
    {
      id: "seal",
      name: "Seal",
      cr: 0,
      ac: 11,
      hp: 5,
      meatYield: 4,
      hideValue: 5,
      trackingDC: 11,
      size: "medium",
    },
    {
      id: "arctic_fox",
      name: "Arctic Fox",
      cr: 0,
      ac: 13,
      hp: 2,
      meatYield: 1,
      hideValue: 4,
      trackingDC: 12,
      size: "small",
    },
  ],
};

// ---------------------------------------------------------------------------
// HUNTING_METHODS
// ---------------------------------------------------------------------------

/**
 * Available hunting methods with associated skill requirements, time investment, and modifiers.
 * @type {Array<{id: string, name: string, description: string, requiredSkill: string, timeHours: number, successModifier: number, notes: string}>}
 */
export const HUNTING_METHODS = [
  {
    id: "tracking",
    name: "Tracking",
    description: "Follow signs, tracks, and spoor to locate prey.",
    requiredSkill: "Survival",
    timeHours: 3,
    successModifier: 0,
    notes: "DC set by prey's tracking DC. Disadvantage in rain or on hard ground.",
  },
  {
    id: "ambush",
    name: "Ambush",
    description: "Conceal yourself near a known feeding or watering area and wait.",
    requiredSkill: "Stealth",
    timeHours: 4,
    successModifier: 2,
    notes: "Requires an attack roll after a successful Stealth check (DC 12). Prey is surprised on success.",
  },
  {
    id: "trapping",
    name: "Trapping",
    description: "Set one or more traps and return after a rest period to check them.",
    requiredSkill: "Survival",
    timeHours: 1,
    successModifier: -2,
    notes:
      "Setup takes 1 hour per trap; check after a long rest (8 hours). Success chance rolled separately per trap.",
  },
  {
    id: "fishing",
    name: "Fishing",
    description: "Use rod, line, nets, or weirs to catch fish from nearby water.",
    requiredSkill: "Tool Proficiency (fishing tackle)",
    timeHours: 2,
    successModifier: 0,
    notes:
      "Requires a body of water. Proficiency with fishing tackle grants +2. Yields only fish (1d4 rations per success).",
  },
  {
    id: "falconry",
    name: "Falconry",
    description: "Direct a trained bird of prey to flush and catch small game.",
    requiredSkill: "Animal Handling",
    timeHours: 2,
    successModifier: 3,
    notes: "Requires a trained falcon or hawk. Targets small or tiny prey only. Bird must be fed after use.",
  },
];

// ---------------------------------------------------------------------------
// TRAP_TYPES
// ---------------------------------------------------------------------------

/**
 * Wilderness trap types with materials, setup time, DCs, damage, and target sizes.
 * @type {Array<{id: string, name: string, description: string, targetSize: string[], materials: string[], setupTimeMinutes: number, triggerDC: number, escapeOrDisarmDC: number, damage: string|null, liveCapture: boolean}>}
 */
export const TRAP_TYPES = [
  {
    id: "snare",
    name: "Snare",
    description: "A loop of cord or wire set along a game trail to catch small animals by the leg or neck.",
    targetSize: ["tiny", "small"],
    materials: ["50 ft cord or wire", "sturdy stake"],
    setupTimeMinutes: 15,
    triggerDC: 12,
    escapeOrDisarmDC: 12,
    damage: null,
    liveCapture: true,
  },
  {
    id: "pit_trap",
    name: "Pit Trap",
    description: "A camouflaged pit dug along a game trail; medium creatures fall in and cannot easily climb out.",
    targetSize: ["medium"],
    materials: ["shovel or improvised digging tool", "branches and foliage for cover"],
    setupTimeMinutes: 120,
    triggerDC: 15,
    escapeOrDisarmDC: 15,
    damage: "1d6 bludgeoning (fall)",
    liveCapture: true,
  },
  {
    id: "deadfall",
    name: "Deadfall",
    description: "A heavy log or boulder propped by a trigger stick; crushes large prey when disturbed.",
    targetSize: ["medium", "large"],
    materials: ["large log or boulder (50+ lbs)", "trigger stick", "bait"],
    setupTimeMinutes: 60,
    triggerDC: 15,
    escapeOrDisarmDC: 13,
    damage: "2d6 bludgeoning",
    liveCapture: false,
  },
  {
    id: "net_trap",
    name: "Net Trap",
    description: "A weighted net rigged to drop from a tree or spring up from the ground.",
    targetSize: ["tiny", "small", "medium", "large"],
    materials: ["net (10 ft x 10 ft)", "rope", "anchor point"],
    setupTimeMinutes: 30,
    triggerDC: 13,
    escapeOrDisarmDC: 14,
    damage: null,
    liveCapture: true,
  },
  {
    id: "cage_trap",
    name: "Cage Trap",
    description: "A box or cage with a drop door triggered by bait inside; designed for live capture.",
    targetSize: ["tiny", "small", "medium"],
    materials: ["cage or box (crafted or purchased, ~5 gp)", "bait"],
    setupTimeMinutes: 10,
    triggerDC: 14,
    escapeOrDisarmDC: 16,
    damage: null,
    liveCapture: true,
  },
  {
    id: "fishing_weir",
    name: "Fishing Weir",
    description: "A fence or barrier of sticks built across a stream to funnel fish into a catching area.",
    targetSize: ["tiny", "small"],
    materials: ["20+ stout sticks", "twine or flexible branches"],
    setupTimeMinutes: 90,
    triggerDC: 10,
    escapeOrDisarmDC: 8,
    damage: null,
    liveCapture: true,
  },
];

// ---------------------------------------------------------------------------
// BUTCHERING_RULES
// ---------------------------------------------------------------------------

/**
 * Rules for butchering a slain creature to harvest usable resources.
 * DC varies by creature size and familiarity. Yields scale with roll result.
 * @type {{
 *   baseDC: Object.<string, number>,
 *   yieldTable: Object.<string, {meat: number, hideValue: number, bones: string, specialParts: string[]}>,
 *   skillOptions: string[],
 *   failConsequences: string,
 *   partialSuccessThreshold: number
 * }}
 */
export const BUTCHERING_RULES = {
  baseDC: {
    tiny: 10,
    small: 10,
    medium: 12,
    large: 13,
    huge: 15,
    gargantuan: 15,
  },
  yieldTable: {
    tiny: {
      meat: 1,
      hideValue: 1,
      bones: "1d4 small bones (minor crafting material)",
      specialParts: ["feathers", "teeth (1-2)"],
    },
    small: {
      meat: 2,
      hideValue: 2,
      bones: "1d6 small bones",
      specialParts: ["feathers", "claws (1d4)", "teeth (1d6)"],
    },
    medium: {
      meat: 6,
      hideValue: 4,
      bones: "1d6 usable bones",
      specialParts: ["hide (full pelt)", "teeth (1d6)", "venom gland (if applicable)"],
    },
    large: {
      meat: 14,
      hideValue: 10,
      bones: "2d6 usable bones",
      specialParts: ["full hide", "horns/antlers", "large teeth", "stomach (waterskin substitute)"],
    },
    huge: {
      meat: 40,
      hideValue: 25,
      bones: "4d6 bones + 1d4 large bones",
      specialParts: ["full hide (multiple pieces)", "tusks/horns", "organ sacs", "sinew (bowstring material)"],
    },
    gargantuan: {
      meat: 100,
      hideValue: 60,
      bones: "multiple large structural bones",
      specialParts: ["hide panels", "giant teeth/claws", "heart (magical ingredient)", "scales (if applicable)"],
    },
  },
  skillOptions: ["Survival", "Nature"],
  failConsequences:
    "On a failure the meat yield is halved (spoiled or wasted) and the hide may be ruined (DM discretion).",
  partialSuccessThreshold: 5,
};

// ---------------------------------------------------------------------------
// ANIMAL_COMPANION_RULES
// ---------------------------------------------------------------------------

/**
 * Rules for taming wild creatures and training animal companions.
 * @type {{
 *   tamingDC: Function,
 *   trainingTimeWeeks: Function,
 *   commands: Array<{id: string, name: string, dc: number, description: string}>,
 *   loyaltyCheck: {trigger: string, dc: number, failureEffect: string},
 *   notes: string[]
 * }}
 */
export const ANIMAL_COMPANION_RULES = {
  /**
   * Returns the Animal Handling DC required to begin taming a creature.
   * CR 0–1: DC 15, CR 2–4: DC 18, CR 5–7: DC 21, CR 8+: DC 25.
   * @param {number} cr
   * @returns {number}
   */
  tamingDC: (cr) => {
    const numericCR = typeof cr === "string" ? eval(cr) : cr;
    if (numericCR <= 1) return 15;
    if (numericCR <= 4) return 18;
    if (numericCR <= 7) return 21;
    return 25;
  },

  /**
   * Returns the training time in weeks. Minimum 1 week; otherwise 4 weeks per CR point.
   * @param {number} cr
   * @returns {number}
   */
  trainingTimeWeeks: (cr) => {
    const numericCR = typeof cr === "string" ? eval(cr) : cr;
    return Math.max(1, Math.ceil(numericCR) * 4);
  },

  commands: [
    {
      id: "stay",
      name: "Stay",
      dc: 10,
      description: "The animal remains in place until released. Fails if threatened.",
    },
    {
      id: "attack",
      name: "Attack",
      dc: 12,
      description: "The animal attacks a designated target. Requires line of sight.",
    },
    {
      id: "fetch",
      name: "Fetch",
      dc: 11,
      description: "The animal retrieves a dropped or thrown object and returns it.",
    },
    {
      id: "guard",
      name: "Guard",
      dc: 13,
      description: "The animal watches a location or person and raises alarm (noise/attack) at intruders.",
    },
    {
      id: "come",
      name: "Come",
      dc: 10,
      description: "The animal returns to the handler immediately.",
    },
  ],

  loyaltyCheck: {
    trigger:
      "Stressful situations: combat, sudden loud noises, sight of natural predators, handler incapacitated.",
    dc: 13,
    failureEffect:
      "The animal flees, freezes, or acts unpredictably for 1d4 rounds. Repeated failures may break the bond permanently (DM discretion).",
  },

  notes: [
    "Only beasts of CR 1/2 or lower can be tamed without magical assistance as a baseline rule.",
    "Monstrosities, undead, and constructs cannot be tamed through Animal Handling alone.",
    "A creature whose CR exceeds the tamer's proficiency bonus is harder to hold: loyalty checks are made at disadvantage.",
    "The Speak with Animals spell grants advantage on taming checks for its duration.",
    "A tamed creature is not a charmed creature — it retains its instincts and may react to them.",
  ],
};

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Returns all prey animals available in a given terrain.
 * @param {string} terrain - One of: forest, plains, mountain, swamp, arctic
 * @returns {Array} Array of prey animal objects, or empty array if terrain not found.
 */
export function getPreyByTerrain(terrain) {
  return PREY_ANIMALS[terrain] ?? [];
}

/**
 * Simulates a hunting check for a given method, rolling against relevant terrain modifiers.
 * Returns the total roll, the DC, and whether the hunt succeeded.
 * @param {string} method - The hunting method id (e.g. "tracking", "ambush")
 * @param {number} skillModifier - The character's total skill modifier (ability mod + proficiency if applicable)
 * @param {string} terrain - Terrain type; some terrains impose a +2 DC penalty (mountain, swamp, arctic)
 * @returns {{roll: number, modifier: number, total: number, dc: number, success: boolean, method: string}}
 */
export function rollHuntingCheck(method, skillModifier, terrain) {
  const methodData = HUNTING_METHODS.find((m) => m.id === method);
  if (!methodData) {
    throw new Error(`Unknown hunting method: "${method}"`);
  }

  const d20 = Math.floor(Math.random() * 20) + 1;
  const modifier = skillModifier + methodData.successModifier;

  // Difficult terrains impose a +2 DC penalty
  const difficultTerrains = ["mountain", "swamp", "arctic"];
  const terrainPenalty = difficultTerrains.includes(terrain) ? 2 : 0;

  // Base DC for a hunting check is 12 (moderate challenge)
  const dc = 12 + terrainPenalty;
  const total = d20 + modifier;

  return {
    roll: d20,
    modifier,
    total,
    dc,
    success: total >= dc,
    method: methodData.name,
  };
}

/**
 * Calculates butchering yield based on creature size and the result of a Survival/Nature check.
 * On a partial success (within 5 of DC) meat yield is halved. On a full success all yields are granted.
 * @param {string} creatureSize - One of: tiny, small, medium, large, huge, gargantuan
 * @param {number} butcheringRoll - The total result of the Survival or Nature check
 * @returns {{success: boolean, partial: boolean, meat: number, hideValue: number, bones: string, specialParts: string[]}}
 */
export function calculateYield(creatureSize, butcheringRoll) {
  const size = creatureSize.toLowerCase();
  const dc = BUTCHERING_RULES.baseDC[size] ?? 12;
  const yieldData = BUTCHERING_RULES.yieldTable[size];

  if (!yieldData) {
    throw new Error(`Unknown creature size: "${creatureSize}"`);
  }

  const succeeded = butcheringRoll >= dc;
  const partial =
    !succeeded && butcheringRoll >= dc - BUTCHERING_RULES.partialSuccessThreshold;

  if (!succeeded && !partial) {
    return {
      success: false,
      partial: false,
      meat: 0,
      hideValue: 0,
      bones: "none",
      specialParts: [],
    };
  }

  return {
    success: succeeded,
    partial,
    meat: partial ? Math.floor(yieldData.meat / 2) : yieldData.meat,
    hideValue: partial ? 0 : yieldData.hideValue,
    bones: partial ? "scraps only" : yieldData.bones,
    specialParts: partial ? [] : yieldData.specialParts,
  };
}

/**
 * Returns a trap type object by its id.
 * @param {string} trapId - The trap id (e.g. "snare", "pit_trap")
 * @returns {Object|null} The trap type object, or null if not found.
 */
export function getTrapType(trapId) {
  return TRAP_TYPES.find((t) => t.id === trapId) ?? null;
}

/**
 * Simulates an Animal Handling check to begin taming a creature.
 * Returns the roll, DC, success/failure, and estimated training time on success.
 * @param {number|string} creatureCR - The CR of the creature (number or fraction string like "1/4")
 * @param {number} animalHandlingMod - The character's Animal Handling modifier
 * @returns {{roll: number, total: number, dc: number, success: boolean, trainingWeeks: number|null, notes: string}}
 */
export function rollTamingCheck(creatureCR, animalHandlingMod) {
  const dc = ANIMAL_COMPANION_RULES.tamingDC(creatureCR);
  const trainingWeeks = ANIMAL_COMPANION_RULES.trainingTimeWeeks(creatureCR);
  const d20 = Math.floor(Math.random() * 20) + 1;
  const total = d20 + animalHandlingMod;
  const success = total >= dc;

  return {
    roll: d20,
    total,
    dc,
    success,
    trainingWeeks: success ? trainingWeeks : null,
    notes: success
      ? `The creature responds cautiously. Training will take approximately ${trainingWeeks} week(s).`
      : "The creature rejects your approach. You may try again after a long rest.",
  };
}

/**
 * Generates a random hunting encounter appropriate to the terrain and party level.
 * Returns one prey animal, a recommended hunting method, and an optional complication.
 * @param {string} terrain - The terrain type
 * @param {number} partyLevel - Average party level (1–20); influences whether dangerous prey appears
 * @returns {{prey: Object, suggestedMethod: Object, complication: string|null}}
 */
export function generateHuntingEncounter(terrain, partyLevel) {
  const preyList = getPreyByTerrain(terrain);
  if (preyList.length === 0) {
    return { prey: null, suggestedMethod: null, complication: "No known prey animals in this terrain." };
  }

  // Filter prey to CR-appropriate targets (CR should not exceed partyLevel / 4)
  const maxCR = Math.max(0.25, partyLevel / 4);
  const filteredPrey = preyList.filter((p) => {
    const numericCR = typeof p.cr === "string" ? eval(p.cr) : p.cr;
    return numericCR <= maxCR;
  });

  const eligiblePrey = filteredPrey.length > 0 ? filteredPrey : preyList;
  const prey = eligiblePrey[Math.floor(Math.random() * eligiblePrey.length)];

  // Pick a hunting method weighted toward common approaches
  const methodWeights = ["tracking", "tracking", "ambush", "trapping", "fishing", "falconry"];
  const methodId = methodWeights[Math.floor(Math.random() * methodWeights.length)];
  const suggestedMethod = HUNTING_METHODS.find((m) => m.id === methodId) ?? HUNTING_METHODS[0];

  // Random complications (roughly 1-in-3 chance)
  const complications = [
    null,
    null,
    "A predator (wolf pack or large cat) is trailing the same prey — they will arrive 1d4 rounds after the hunt begins.",
    "Fresh tracks suggest another hunting party (bandits or rival hunters) is in the area.",
    "The prey is accompanied by its young — killing it may be legal but provokes a loyalty check for any animal companion present.",
    "Terrain is waterlogged / icy / dense — Survival checks in this area are made at disadvantage for the next hour.",
    "A hidden trap (someone else's) is near the prey's last known location. Perception DC 14 to spot it.",
  ];

  const complication = complications[Math.floor(Math.random() * complications.length)];

  return { prey, suggestedMethod, complication };
}
