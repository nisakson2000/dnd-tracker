/**
 * playerRollMacros.js
 * Player Mode Improvements #26-40: Dice Rolling Data
 * Pure JS — no React dependencies
 */

// ---------------------------------------------------------------------------
// SKILL_LIST
// All 18 D&D 5e skills mapped to their governing ability scores
// ---------------------------------------------------------------------------
export const SKILL_LIST = [
  { name: "Acrobatics",     ability: "DEX", key: "acrobatics" },
  { name: "Animal Handling",ability: "WIS", key: "animalHandling" },
  { name: "Arcana",         ability: "INT", key: "arcana" },
  { name: "Athletics",      ability: "STR", key: "athletics" },
  { name: "Deception",      ability: "CHA", key: "deception" },
  { name: "History",        ability: "INT", key: "history" },
  { name: "Insight",        ability: "WIS", key: "insight" },
  { name: "Intimidation",   ability: "CHA", key: "intimidation" },
  { name: "Investigation",  ability: "INT", key: "investigation" },
  { name: "Medicine",       ability: "WIS", key: "medicine" },
  { name: "Nature",         ability: "INT", key: "nature" },
  { name: "Perception",     ability: "WIS", key: "perception" },
  { name: "Performance",    ability: "CHA", key: "performance" },
  { name: "Persuasion",     ability: "CHA", key: "persuasion" },
  { name: "Religion",       ability: "INT", key: "religion" },
  { name: "Sleight of Hand",ability: "DEX", key: "sleightOfHand" },
  { name: "Stealth",        ability: "DEX", key: "stealth" },
  { name: "Survival",       ability: "WIS", key: "survival" },
];

// ---------------------------------------------------------------------------
// ROLL_TYPES
// Categories for roll classification — used for colour-coding and history
// ---------------------------------------------------------------------------
export const ROLL_TYPES = {
  attack: {
    label: "Attack",
    color: "#e74c3c",
    iconHint: "sword",
    description: "Roll to hit — compare to target AC",
  },
  damage: {
    label: "Damage",
    color: "#e67e22",
    iconHint: "burst",
    description: "Damage dealt on a successful hit",
  },
  save: {
    label: "Saving Throw",
    color: "#9b59b6",
    iconHint: "shield",
    description: "Resist a spell or effect — compare to DC",
  },
  check: {
    label: "Ability Check",
    color: "#3498db",
    iconHint: "dice",
    description: "General skill or ability test — compare to DC",
  },
  initiative: {
    label: "Initiative",
    color: "#1abc9c",
    iconHint: "lightning",
    description: "Determines turn order in combat",
  },
  death_save: {
    label: "Death Save",
    color: "#95a5a6",
    iconHint: "skull",
    description: "DC 10 — nat 20 restores 1 HP, nat 1 counts as 2 failures",
  },
  hit_dice: {
    label: "Hit Dice",
    color: "#27ae60",
    iconHint: "heart",
    description: "Short-rest healing — add CON modifier to result",
  },
  custom: {
    label: "Custom",
    color: "#f39c12",
    iconHint: "star",
    description: "User-defined roll expression",
  },
};

// ---------------------------------------------------------------------------
// DEFAULT_ROLL_MACROS
// Pre-built macro definitions — expressions use {placeholder} tokens that are
// resolved at roll time via resolveExpression()
// ---------------------------------------------------------------------------
export const DEFAULT_ROLL_MACROS = {
  // -- Ability Checks -------------------------------------------------------
  abilityChecks: [
    {
      id: "check_str",
      name: "Strength Check",
      ability: "STR",
      type: "check",
      formula: "1d20+{strMod}",
      description: "Raw Strength ability check",
    },
    {
      id: "check_dex",
      name: "Dexterity Check",
      ability: "DEX",
      type: "check",
      formula: "1d20+{dexMod}",
      description: "Raw Dexterity ability check",
    },
    {
      id: "check_con",
      name: "Constitution Check",
      ability: "CON",
      type: "check",
      formula: "1d20+{conMod}",
      description: "Raw Constitution ability check",
    },
    {
      id: "check_int",
      name: "Intelligence Check",
      ability: "INT",
      type: "check",
      formula: "1d20+{intMod}",
      description: "Raw Intelligence ability check",
    },
    {
      id: "check_wis",
      name: "Wisdom Check",
      ability: "WIS",
      type: "check",
      formula: "1d20+{wisMod}",
      description: "Raw Wisdom ability check",
    },
    {
      id: "check_cha",
      name: "Charisma Check",
      ability: "CHA",
      type: "check",
      formula: "1d20+{chaMod}",
      description: "Raw Charisma ability check",
    },
  ],

  // -- Saving Throws --------------------------------------------------------
  // {saveMod} = ability modifier + proficiency bonus if proficient
  savingThrows: [
    {
      id: "save_str",
      name: "Strength Save",
      ability: "STR",
      type: "save",
      formula: "1d20+{strSaveMod}",
      description: "STR modifier + proficiency bonus if proficient",
    },
    {
      id: "save_dex",
      name: "Dexterity Save",
      ability: "DEX",
      type: "save",
      formula: "1d20+{dexSaveMod}",
      description: "DEX modifier + proficiency bonus if proficient",
    },
    {
      id: "save_con",
      name: "Constitution Save",
      ability: "CON",
      type: "save",
      formula: "1d20+{conSaveMod}",
      description: "CON modifier + proficiency bonus if proficient",
    },
    {
      id: "save_int",
      name: "Intelligence Save",
      ability: "INT",
      type: "save",
      formula: "1d20+{intSaveMod}",
      description: "INT modifier + proficiency bonus if proficient",
    },
    {
      id: "save_wis",
      name: "Wisdom Save",
      ability: "WIS",
      type: "save",
      formula: "1d20+{wisSaveMod}",
      description: "WIS modifier + proficiency bonus if proficient",
    },
    {
      id: "save_cha",
      name: "Charisma Save",
      ability: "CHA",
      type: "save",
      formula: "1d20+{chaSaveMod}",
      description: "CHA modifier + proficiency bonus if proficient",
    },
  ],

  // -- Skill Checks ---------------------------------------------------------
  // {skillMod} = governing ability modifier + proficiency bonus (× expertise multiplier if applicable)
  skillChecks: SKILL_LIST.map((skill) => ({
    id: `skill_${skill.key}`,
    name: `${skill.name} (${skill.ability})`,
    skill: skill.key,
    ability: skill.ability,
    type: "check",
    formula: `1d20+{${skill.key}Mod}`,
    description: `${skill.name} check using ${skill.ability} modifier`,
  })),

  // -- Initiative -----------------------------------------------------------
  initiative: {
    id: "initiative",
    name: "Initiative",
    type: "initiative",
    formula: "1d20+{dexMod}+{initBonus}",
    description:
      "DEX modifier + any bonus initiative (Alert feat, Jack of All Trades, etc.)",
  },

  // -- Death Saving Throw ---------------------------------------------------
  deathSave: {
    id: "death_save",
    name: "Death Saving Throw",
    type: "death_save",
    formula: "1d20",
    dc: 10,
    description:
      "DC 10. Nat 20 = stabilise at 1 HP. Nat 1 = 2 failures. No modifiers apply.",
    rules: {
      successDC: 10,
      nat20Effect: "Regain 1 hit point and regain consciousness",
      nat1Effect: "Counts as 2 failures",
      successesNeeded: 3,
      failuresNeeded: 3,
    },
  },

  // -- Hit Dice (one template per common class die size) -------------------
  hitDice: {
    d6: {
      id: "hit_dice_d6",
      name: "Hit Die (d6)",
      type: "hit_dice",
      formula: "1d6+{conMod}",
      description: "Sorcerer, Wizard — short-rest healing",
      classes: ["Sorcerer", "Wizard"],
    },
    d8: {
      id: "hit_dice_d8",
      name: "Hit Die (d8)",
      type: "hit_dice",
      formula: "1d8+{conMod}",
      description: "Bard, Cleric, Druid, Monk, Rogue, Warlock — short-rest healing",
      classes: ["Bard", "Cleric", "Druid", "Monk", "Rogue", "Warlock"],
    },
    d10: {
      id: "hit_dice_d10",
      name: "Hit Die (d10)",
      type: "hit_dice",
      formula: "1d10+{conMod}",
      description: "Fighter, Paladin, Ranger — short-rest healing",
      classes: ["Fighter", "Paladin", "Ranger"],
    },
    d12: {
      id: "hit_dice_d12",
      name: "Hit Die (d12)",
      type: "hit_dice",
      formula: "1d12+{conMod}",
      description: "Barbarian — short-rest healing",
      classes: ["Barbarian"],
    },
  },
};

// ---------------------------------------------------------------------------
// ROLL_STATISTICS_TEMPLATE
// Default shape for a character's roll statistics object
// ---------------------------------------------------------------------------
export const ROLL_STATISTICS_TEMPLATE = {
  totalRolls: 0,
  nat20s: 0,
  nat1s: 0,
  averageRoll: 0,
  /** Running sum used internally to recompute averageRoll without storing all values */
  _runningTotal: 0,
  rollsByType: {
    attack: 0,
    damage: 0,
    save: 0,
    check: 0,
    initiative: 0,
    death_save: 0,
    hit_dice: 0,
    custom: 0,
  },
  /** Last 100 rolls kept for display/graphs — oldest dropped first */
  history: [],
};

// Maximum history entries retained (circular buffer ceiling)
const MAX_HISTORY_ENTRIES = 100;

// ---------------------------------------------------------------------------
// ADVANTAGE_RULES
// Reference data for when advantage / disadvantage applies in 5e
// ---------------------------------------------------------------------------
export const ADVANTAGE_RULES = {
  advantage: {
    label: "Advantage",
    description: "Roll 2d20 and take the higher result",
    mechanic: "2d20kh1",
    sources: [
      {
        id: "flanking",
        label: "Flanking",
        optional: true,
        notes: "Variant rule — attacker and ally on opposite sides of target",
      },
      {
        id: "help_action",
        label: "Help Action",
        optional: false,
        notes: "An ally uses their action to help you on an ability check",
      },
      {
        id: "faerie_fire",
        label: "Faerie Fire",
        optional: false,
        notes: "Target is illuminated — all attacks against it have advantage",
      },
      {
        id: "guiding_bolt",
        label: "Guiding Bolt",
        optional: false,
        notes: "Next attack against the target before the end of your next turn",
      },
      {
        id: "prone_melee",
        label: "Prone Target (melee)",
        optional: false,
        notes: "Melee attacks against a prone creature have advantage",
      },
      {
        id: "hidden_attacker",
        label: "Hidden Attacker",
        optional: false,
        notes: "Attacking while unseen by the target",
      },
      {
        id: "reckless_attack",
        label: "Reckless Attack",
        optional: false,
        notes: "Barbarian feature — first attack on your turn has advantage (but enemies also gain advantage against you)",
      },
      {
        id: "lucky_feat",
        label: "Lucky Feat",
        optional: false,
        notes: "Spend a luck point to roll an additional d20 and choose either result",
      },
      {
        id: "pack_tactics",
        label: "Pack Tactics",
        optional: false,
        notes: "When an ally is adjacent to the target and not incapacitated",
      },
      {
        id: "restrained_target",
        label: "Restrained Target",
        optional: false,
        notes: "Attack rolls against a restrained creature have advantage",
      },
      {
        id: "paralysed_target",
        label: "Paralysed Target (melee 5ft)",
        optional: false,
        notes: "Attacks within 5 ft are automatically critical hits (not just advantage, but counted here for clarity)",
      },
    ],
  },

  disadvantage: {
    label: "Disadvantage",
    description: "Roll 2d20 and take the lower result",
    mechanic: "2d20kl1",
    sources: [
      {
        id: "prone_ranged",
        label: "Prone Target (ranged)",
        optional: false,
        notes: "Ranged attacks against a prone creature have disadvantage",
      },
      {
        id: "blinded",
        label: "Blinded",
        optional: false,
        notes: "A blinded creature has disadvantage on attack rolls",
      },
      {
        id: "frightened_source_visible",
        label: "Frightened (source in sight)",
        optional: false,
        notes: "Disadvantage on ability checks and attack rolls while source is visible",
      },
      {
        id: "poisoned",
        label: "Poisoned",
        optional: false,
        notes: "Disadvantage on attack rolls and ability checks",
      },
      {
        id: "restrained",
        label: "Restrained Attacker",
        optional: false,
        notes: "A restrained creature has disadvantage on attack rolls",
      },
      {
        id: "long_range",
        label: "Long Range",
        optional: false,
        notes: "Attacking beyond normal range but within long range",
      },
      {
        id: "exhaustion_level_3",
        label: "Exhaustion (level 3+)",
        optional: false,
        notes: "Level 3 exhaustion imposes disadvantage on attack rolls and saving throws",
      },
      {
        id: "encumbered_variant",
        label: "Heavily Encumbered (variant)",
        optional: true,
        notes: "Variant rule — carrying weight over 10× STR score",
      },
      {
        id: "prone_attacker",
        label: "Prone Attacker",
        optional: false,
        notes: "A prone creature has disadvantage on its attack rolls",
      },
      {
        id: "invisible_target",
        label: "Invisible / Unseen Target",
        optional: false,
        notes: "Attacking a creature you cannot see",
      },
    ],
  },

  cancellation: {
    label: "Cancellation Rule",
    description:
      "Any number of advantage sources combined with any number of disadvantage sources results in a straight d20 roll — regardless of how many of each you have.",
    rule: "straight",
  },
};

// ---------------------------------------------------------------------------
// DICE_EXPRESSIONS
// Common dice expression patterns with metadata
// ---------------------------------------------------------------------------
export const DICE_EXPRESSIONS = {
  patterns: {
    /** Standard XdY+Z */
    full: {
      regex: /^(\d+)d(\d+)([+-]\d+)?$/i,
      example: "2d6+3",
      description: "X dice of size Y, with optional flat modifier",
    },
    /** XdY-Z */
    fullMinus: {
      regex: /^(\d+)d(\d+)-(\d+)$/i,
      example: "1d8-1",
      description: "X dice of size Y minus a flat amount",
    },
    /** Bare die: dY */
    single: {
      regex: /^d(\d+)$/i,
      example: "d20",
      description: "Single die of size Y (shorthand for 1dY)",
    },
    /** Keep highest: XdYkhN */
    keepHighest: {
      regex: /^(\d+)d(\d+)kh(\d+)$/i,
      example: "4d6kh3",
      description: "Roll X dice, keep the highest N results (e.g., stat generation)",
    },
    /** Keep lowest: XdYklN */
    keepLowest: {
      regex: /^(\d+)d(\d+)kl(\d+)$/i,
      example: "2d20kl1",
      description: "Roll X dice, keep the lowest N results (disadvantage shorthand)",
    },
    /** Drop lowest: XdYdlN */
    dropLowest: {
      regex: /^(\d+)d(\d+)dl(\d+)$/i,
      example: "4d6dl1",
      description: "Roll X dice, drop the lowest N results",
    },
    /** Drop highest: XdYdhN */
    dropHighest: {
      regex: /^(\d+)d(\d+)dh(\d+)$/i,
      example: "4d6dh1",
      description: "Roll X dice, drop the highest N results",
    },
  },
  commonExpressions: [
    { label: "d4",        expr: "1d4",        description: "4-sided die" },
    { label: "d6",        expr: "1d6",        description: "6-sided die" },
    { label: "d8",        expr: "1d8",        description: "8-sided die" },
    { label: "d10",       expr: "1d10",       description: "10-sided die" },
    { label: "d12",       expr: "1d12",       description: "12-sided die" },
    { label: "d20",       expr: "1d20",       description: "20-sided die" },
    { label: "d100",      expr: "1d100",      description: "Percentile die" },
    { label: "2d6",       expr: "2d6",        description: "Two 6-sided dice" },
    { label: "4d6kh3",   expr: "4d6kh3",     description: "Stat generation (drop lowest)" },
    { label: "2d20kh1",  expr: "2d20kh1",    description: "Advantage" },
    { label: "2d20kl1",  expr: "2d20kl1",    description: "Disadvantage" },
  ],
};

// ---------------------------------------------------------------------------
// EXPORTED FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * buildRollMacro
 * Constructs a roll macro object with a consistent shape.
 *
 * @param {string} name        - Display name for the macro
 * @param {string} expression  - Dice expression string, may contain {tokens}
 * @param {string} type        - One of the keys in ROLL_TYPES
 * @param {Object} [modifiers] - Optional extra fields (ability, skill, dc, notes, etc.)
 * @returns {Object} Roll macro object
 */
export function buildRollMacro(name, expression, type, modifiers = {}) {
  if (!name || typeof name !== "string") {
    throw new Error("buildRollMacro: name must be a non-empty string");
  }
  if (!expression || typeof expression !== "string") {
    throw new Error("buildRollMacro: expression must be a non-empty string");
  }
  if (!ROLL_TYPES[type]) {
    throw new Error(
      `buildRollMacro: unknown type "${type}". Valid types: ${Object.keys(ROLL_TYPES).join(", ")}`
    );
  }

  return {
    id: modifiers.id || `macro_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name,
    formula: expression,
    type,
    color: ROLL_TYPES[type].color,
    iconHint: ROLL_TYPES[type].iconHint,
    ...modifiers,
    createdAt: modifiers.createdAt || new Date().toISOString(),
  };
}

/**
 * resolveExpression
 * Replaces {placeholder} tokens in a formula with real values derived from
 * characterData, then returns the resolved string ready for a dice parser.
 *
 * Supported tokens (all computed from characterData):
 *   {strMod}, {dexMod}, {conMod}, {intMod}, {wisMod}, {chaMod}
 *   {strSaveMod}, {dexSaveMod}, {conSaveMod}, {intSaveMod}, {wisSaveMod}, {chaSaveMod}
 *   {acrobaticssMod}, {animalHandlingMod}, ... (all 18 skill keys + "Mod")
 *   {initBonus}  — extra initiative bonus beyond DEX modifier
 *   {profBonus}  — proficiency bonus
 *   {conMod}     — already covered above
 *
 * @param {string} expression   - Formula with {token} placeholders
 * @param {Object} characterData - Character sheet data object
 * @returns {string} Resolved expression with numeric substitutions
 */
export function resolveExpression(expression, characterData = {}) {
  if (!expression || typeof expression !== "string") {
    throw new Error("resolveExpression: expression must be a non-empty string");
  }

  const {
    abilityScores = {},
    saveProficiencies = {},
    skillProficiencies = {},
    expertiseSkills = {},
    proficiencyBonus = 2,
    initiativeBonus = 0,
  } = characterData;

  // Helper: compute ability modifier from score
  const mod = (score) =>
    score !== undefined ? Math.floor((score - 10) / 2) : 0;

  // Helper: format modifier as signed string token replacement (+3, -1, +0)
  const signed = (n) => (n >= 0 ? `+${n}` : `${n}`);

  const scores = {
    STR: abilityScores.STR ?? abilityScores.str ?? 10,
    DEX: abilityScores.DEX ?? abilityScores.dex ?? 10,
    CON: abilityScores.CON ?? abilityScores.con ?? 10,
    INT: abilityScores.INT ?? abilityScores.int ?? 10,
    WIS: abilityScores.WIS ?? abilityScores.wis ?? 10,
    CHA: abilityScores.CHA ?? abilityScores.cha ?? 10,
  };

  // Skill mod = ability mod + profBonus * multiplier (1 = proficient, 2 = expertise, 0 = not proficient)
  const skillMod = (skill) => {
    const skillDef = SKILL_LIST.find((s) => s.key === skill);
    if (!skillDef) return 0;
    const baseMod = mod(scores[skillDef.ability]);
    const isProf = skillProficiencies[skill] || false;
    const isExpert = expertiseSkills[skill] || false;
    const multiplier = isExpert ? 2 : isProf ? 1 : 0;
    return baseMod + proficiencyBonus * multiplier;
  };

  // Save mod = ability mod + profBonus if proficient
  const saveMod = (ability) => {
    const baseMod = mod(scores[ability]);
    const isProf = saveProficiencies[ability] || saveProficiencies[ability.toLowerCase()] || false;
    return baseMod + (isProf ? proficiencyBonus : 0);
  };

  // Build the token map
  const tokenMap = {
    // Ability modifiers
    strMod: signed(mod(scores.STR)),
    dexMod: signed(mod(scores.DEX)),
    conMod: signed(mod(scores.CON)),
    intMod: signed(mod(scores.INT)),
    wisMod: signed(mod(scores.WIS)),
    chaMod: signed(mod(scores.CHA)),

    // Saving throw modifiers
    strSaveMod: signed(saveMod("STR")),
    dexSaveMod: signed(saveMod("DEX")),
    conSaveMod: signed(saveMod("CON")),
    intSaveMod: signed(saveMod("INT")),
    wisSaveMod: signed(saveMod("WIS")),
    chaSaveMod: signed(saveMod("CHA")),

    // Proficiency bonus and initiative
    profBonus: signed(proficiencyBonus),
    initBonus: signed(initiativeBonus),
  };

  // Add all skill modifiers dynamically
  for (const skill of SKILL_LIST) {
    tokenMap[`${skill.key}Mod`] = signed(skillMod(skill.key));
  }

  // Replace all {token} occurrences
  return expression.replace(/\{(\w+)\}/g, (match, token) => {
    if (Object.prototype.hasOwnProperty.call(tokenMap, token)) {
      return tokenMap[token];
    }
    // Leave unresolved tokens as-is so the caller can detect them
    return match;
  });
}

/**
 * getAllSkillMacros
 * Returns a resolved array of roll macro objects for all 18 skills, given
 * character ability scores, skill proficiency flags, and proficiency bonus.
 *
 * @param {Object} abilityScores       - { STR, DEX, CON, INT, WIS, CHA }
 * @param {Object} proficiencies       - { acrobatics: true, stealth: true, ... }
 * @param {number} profBonus           - Proficiency bonus value
 * @param {Object} [expertise]         - { stealth: true, ... } (optional expertise flags)
 * @returns {Object[]} Array of resolved macro objects
 */
export function getAllSkillMacros(
  abilityScores = {},
  proficiencies = {},
  profBonus = 2,
  expertise = {}
) {
  const characterData = {
    abilityScores,
    skillProficiencies: proficiencies,
    expertiseSkills: expertise,
    proficiencyBonus: profBonus,
  };

  return SKILL_LIST.map((skill) => {
    const macroTemplate = DEFAULT_ROLL_MACROS.skillChecks.find(
      (m) => m.skill === skill.key
    );
    const resolvedFormula = resolveExpression(macroTemplate.formula, characterData);
    return {
      ...macroTemplate,
      resolvedFormula,
      isProficient: !!proficiencies[skill.key],
      hasExpertise: !!expertise[skill.key],
    };
  });
}

/**
 * getAllSavesMacros
 * Returns a resolved array of roll macro objects for all 6 saving throws.
 *
 * @param {Object} abilityScores        - { STR, DEX, CON, INT, WIS, CHA }
 * @param {Object} saveProficiencies    - { STR: true, DEX: false, ... }
 * @param {number} profBonus            - Proficiency bonus value
 * @returns {Object[]} Array of resolved macro objects
 */
export function getAllSavesMacros(
  abilityScores = {},
  saveProficiencies = {},
  profBonus = 2
) {
  const characterData = {
    abilityScores,
    saveProficiencies,
    proficiencyBonus: profBonus,
  };

  return DEFAULT_ROLL_MACROS.savingThrows.map((macro) => {
    const resolvedFormula = resolveExpression(macro.formula, characterData);
    return {
      ...macro,
      resolvedFormula,
      isProficient: !!(
        saveProficiencies[macro.ability] ||
        saveProficiencies[macro.ability.toLowerCase()]
      ),
    };
  });
}

/**
 * getAdvantageStatus
 * Determines whether a roll should be made with advantage, disadvantage, or
 * straight based on active conditions and situation flags.
 *
 * Returns "advantage" | "disadvantage" | "straight" and arrays of active
 * sources for UI display.
 *
 * @param {string[]} conditions      - Active condition names (e.g., ["blinded", "poisoned"])
 * @param {Object}   situationFlags  - Situational boolean flags keyed by source id
 * @returns {{ mode: string, advantageSources: string[], disadvantageSources: string[] }}
 */
export function getAdvantageStatus(conditions = [], situationFlags = {}) {
  const activeAdvantage = [];
  const activeDisadvantage = [];

  const lowerConditions = conditions.map((c) => c.toLowerCase());

  // Check advantage sources
  for (const source of ADVANTAGE_RULES.advantage.sources) {
    const flagActive = situationFlags[source.id] === true;
    const conditionActive = lowerConditions.includes(source.id.replace(/_/g, " "));
    if (flagActive || conditionActive) {
      activeAdvantage.push(source.label);
    }
  }

  // Check disadvantage sources
  for (const source of ADVANTAGE_RULES.disadvantage.sources) {
    const flagActive = situationFlags[source.id] === true;
    const conditionActive = lowerConditions.includes(source.id.replace(/_/g, " "));
    if (flagActive || conditionActive) {
      activeDisadvantage.push(source.label);
    }
  }

  // 5e cancellation rule: any advantage + any disadvantage = straight roll
  let mode = "straight";
  if (activeAdvantage.length > 0 && activeDisadvantage.length === 0) {
    mode = "advantage";
  } else if (activeDisadvantage.length > 0 && activeAdvantage.length === 0) {
    mode = "disadvantage";
  }
  // else: both present → straight (cancellation rule)

  return {
    mode,
    advantageSources: activeAdvantage,
    disadvantageSources: activeDisadvantage,
    cancellationApplied: activeAdvantage.length > 0 && activeDisadvantage.length > 0,
  };
}

/**
 * createRollStatistics
 * Returns a fresh roll statistics object using the template.
 *
 * @returns {Object} Deep copy of ROLL_STATISTICS_TEMPLATE
 */
export function createRollStatistics() {
  return {
    ...ROLL_STATISTICS_TEMPLATE,
    rollsByType: { ...ROLL_STATISTICS_TEMPLATE.rollsByType },
    history: [],
    _runningTotal: 0,
  };
}

/**
 * updateRollStatistics
 * Immutably updates a roll statistics object with a new roll result.
 *
 * @param {Object} stats  - Existing statistics object (from createRollStatistics)
 * @param {Object} roll   - Roll result: { d20Result, total, type, label, timestamp }
 * @returns {Object} New statistics object (original not mutated)
 */
export function updateRollStatistics(stats, roll) {
  if (!stats || typeof stats !== "object") {
    throw new Error("updateRollStatistics: stats must be an object");
  }
  if (!roll || typeof roll.total !== "number") {
    throw new Error("updateRollStatistics: roll must have a numeric total");
  }

  const type = roll.type && ROLL_TYPES[roll.type] ? roll.type : "custom";
  const d20Result = roll.d20Result ?? null;
  const newTotal = stats.totalRolls + 1;
  const newRunning = (stats._runningTotal || 0) + roll.total;

  // Build history entry
  const historyEntry = {
    id: roll.id || `roll_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    label: roll.label || "Roll",
    formula: roll.formula || "",
    type,
    total: roll.total,
    d20Result,
    isNat20: d20Result === 20,
    isNat1: d20Result === 1,
    advantage: roll.advantage || "straight",
    timestamp: roll.timestamp || new Date().toISOString(),
  };

  // Keep only the last MAX_HISTORY_ENTRIES entries
  const newHistory = [...stats.history, historyEntry].slice(-MAX_HISTORY_ENTRIES);

  return {
    ...stats,
    totalRolls: newTotal,
    nat20s: stats.nat20s + (historyEntry.isNat20 ? 1 : 0),
    nat1s: stats.nat1s + (historyEntry.isNat1 ? 1 : 0),
    averageRoll: Math.round((newRunning / newTotal) * 100) / 100,
    _runningTotal: newRunning,
    rollsByType: {
      ...stats.rollsByType,
      [type]: (stats.rollsByType[type] || 0) + 1,
    },
    history: newHistory,
  };
}

/**
 * parseExpression
 * Parses a dice expression string and returns a structured breakdown of its
 * components. Does NOT roll dice — use with a dice engine of your choice.
 *
 * Returns null if the expression does not match any known pattern.
 *
 * @param {string} expressionString - e.g. "2d6+3", "4d6kh3", "1d20"
 * @returns {Object|null} Parsed expression components
 */
export function parseExpression(expressionString) {
  if (!expressionString || typeof expressionString !== "string") {
    return null;
  }

  const expr = expressionString.trim().toLowerCase();

  // Try single bare die: dY
  const singleMatch = expr.match(/^d(\d+)$/);
  if (singleMatch) {
    return {
      raw: expressionString,
      diceCount: 1,
      dieSize: parseInt(singleMatch[1], 10),
      modifier: 0,
      keepHighest: null,
      keepLowest: null,
      dropHighest: null,
      dropLowest: null,
      pattern: "single",
      isValid: true,
    };
  }

  // Try keep highest: XdYkhN
  const khMatch = expr.match(/^(\d+)d(\d+)kh(\d+)$/);
  if (khMatch) {
    return {
      raw: expressionString,
      diceCount: parseInt(khMatch[1], 10),
      dieSize: parseInt(khMatch[2], 10),
      modifier: 0,
      keepHighest: parseInt(khMatch[3], 10),
      keepLowest: null,
      dropHighest: null,
      dropLowest: null,
      pattern: "keepHighest",
      isValid: true,
    };
  }

  // Try keep lowest: XdYklN
  const klMatch = expr.match(/^(\d+)d(\d+)kl(\d+)$/);
  if (klMatch) {
    return {
      raw: expressionString,
      diceCount: parseInt(klMatch[1], 10),
      dieSize: parseInt(klMatch[2], 10),
      modifier: 0,
      keepHighest: null,
      keepLowest: parseInt(klMatch[3], 10),
      dropHighest: null,
      dropLowest: null,
      pattern: "keepLowest",
      isValid: true,
    };
  }

  // Try drop lowest: XdYdlN
  const dlMatch = expr.match(/^(\d+)d(\d+)dl(\d+)$/);
  if (dlMatch) {
    return {
      raw: expressionString,
      diceCount: parseInt(dlMatch[1], 10),
      dieSize: parseInt(dlMatch[2], 10),
      modifier: 0,
      keepHighest: null,
      keepLowest: null,
      dropHighest: null,
      dropLowest: parseInt(dlMatch[3], 10),
      pattern: "dropLowest",
      isValid: true,
    };
  }

  // Try drop highest: XdYdhN
  const dhMatch = expr.match(/^(\d+)d(\d+)dh(\d+)$/);
  if (dhMatch) {
    return {
      raw: expressionString,
      diceCount: parseInt(dhMatch[1], 10),
      dieSize: parseInt(dhMatch[2], 10),
      modifier: 0,
      keepHighest: null,
      keepLowest: null,
      dropHighest: parseInt(dhMatch[3], 10),
      dropLowest: null,
      pattern: "dropHighest",
      isValid: true,
    };
  }

  // Try full expression: XdY+Z or XdY-Z or XdY
  const fullMatch = expr.match(/^(\d+)d(\d+)([+-]\d+)?$/);
  if (fullMatch) {
    return {
      raw: expressionString,
      diceCount: parseInt(fullMatch[1], 10),
      dieSize: parseInt(fullMatch[2], 10),
      modifier: fullMatch[3] ? parseInt(fullMatch[3], 10) : 0,
      keepHighest: null,
      keepLowest: null,
      dropHighest: null,
      dropLowest: null,
      pattern: fullMatch[3] ? "full" : "basic",
      isValid: true,
    };
  }

  // No pattern matched
  return {
    raw: expressionString,
    isValid: false,
    pattern: null,
    error: `Unrecognised dice expression: "${expressionString}"`,
  };
}
