// playerQuickRef.js
// Character Quick Reference Data — Player Mode Improvements #61–80
// Pure JS, no React dependencies

// ─────────────────────────────────────────────────────────────────────────────
// 1. PASSIVE SCORES
// Formula: 10 + modifier + proficiency bonus (if proficient) + bonuses
// +5 for advantage, -5 for disadvantage
// ─────────────────────────────────────────────────────────────────────────────

export const PASSIVE_SCORES = {
  PASSIVE_PERCEPTION: {
    label: "Passive Perception",
    ability: "WIS",
    description: "10 + Wisdom modifier + proficiency bonus (if proficient). Used when not actively searching.",
    bonusSources: [
      { name: "Observant Feat", bonus: 5, description: "+5 to passive Perception and Investigation" },
    ],
  },
  PASSIVE_INVESTIGATION: {
    label: "Passive Investigation",
    ability: "INT",
    description: "10 + Intelligence modifier + proficiency bonus (if proficient). Used to notice clues without searching.",
    bonusSources: [
      { name: "Observant Feat", bonus: 5, description: "+5 to passive Perception and Investigation" },
    ],
  },
  PASSIVE_INSIGHT: {
    label: "Passive Insight",
    ability: "WIS",
    description: "10 + Wisdom modifier + proficiency bonus (if proficient). Used to sense lies or hidden motives.",
    bonusSources: [],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. SPEED TYPES
// ─────────────────────────────────────────────────────────────────────────────

export const SPEED_TYPES = {
  walk: {
    label: "Walking Speed",
    default: 30,
    description: "Standard movement speed on foot.",
    unit: "ft",
  },
  fly: {
    label: "Flying Speed",
    default: 0,
    description: "Speed when flying. Only available through racial traits, spells, or magic items.",
    unit: "ft",
  },
  swim: {
    label: "Swimming Speed",
    default: 0,
    description: "Without a swim speed, swimming costs double movement. With a swim speed, no penalty.",
    unit: "ft",
  },
  climb: {
    label: "Climbing Speed",
    default: 0,
    description: "Without a climb speed, climbing costs double movement. With a climb speed, no penalty.",
    unit: "ft",
  },
  burrow: {
    label: "Burrowing Speed",
    default: 0,
    description: "Speed when burrowing through earth. Typically a racial trait.",
    unit: "ft",
  },
};

// Walking speed by race (PHB defaults)
export const RACE_SPEED_DEFAULTS = {
  "Human": 30,
  "Variant Human": 30,
  "Elf": 30,
  "High Elf": 30,
  "Wood Elf": 35,
  "Drow": 30,
  "Dwarf": 25,
  "Hill Dwarf": 25,
  "Mountain Dwarf": 25,
  "Halfling": 25,
  "Lightfoot Halfling": 25,
  "Stout Halfling": 25,
  "Gnome": 25,
  "Forest Gnome": 25,
  "Rock Gnome": 25,
  "Half-Elf": 30,
  "Half-Orc": 30,
  "Tiefling": 30,
  "Dragonborn": 30,
  "Aarakocra": 25, // 50ft fly
  "Genasi": 30,
  "Goliath": 30,
  "Aasimar": 30,
  "Firbolg": 30,
  "Kenku": 30,
  "Lizardfolk": 30, // also 30ft swim
  "Tabaxi": 30, // also 20ft climb
  "Triton": 30, // also 30ft swim
  "Yuan-Ti Pureblood": 30,
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. VISION TYPES
// ─────────────────────────────────────────────────────────────────────────────

export const VISION_TYPES = {
  normal: {
    label: "Normal Vision",
    description: "No special vision. Can see normally in bright light. Cannot see in darkness.",
    ranges: {},
  },
  darkvision: {
    label: "Darkvision",
    description:
      "Can see in dim light within range as if it were bright light, and in darkness as if it were dim light. Cannot discern color in darkness — only shades of gray.",
    ranges: {
      standard: 60,
      extended: 120,
    },
    notes: [
      "Dim light → treated as bright light",
      "Darkness → treated as dim light (disadvantage on Perception)",
      "Cannot discern color in darkness",
    ],
  },
  blindsight: {
    label: "Blindsight",
    description:
      "Can perceive surroundings within range without relying on sight. Effective even in total darkness, against invisible creatures, etc.",
    ranges: {
      typical: 10,
    },
    notes: [
      "Does not require sight",
      "Effective against invisible creatures within range",
      "Immune to visual illusions within range",
    ],
  },
  tremorsense: {
    label: "Tremorsense",
    description:
      "Can detect and pinpoint the origin of vibrations within range, provided both the creature and the source of vibrations are in contact with the same ground or substance.",
    ranges: {
      typical: 60,
    },
    notes: [
      "Requires contact with the same surface",
      "Cannot detect flying or ethereal creatures",
    ],
  },
  truesight: {
    label: "Truesight",
    description:
      "Can see through normal and magical darkness, see invisible creatures and objects, detect visual illusions, see the true form of shapechangers and those transformed by magic, and see into the Ethereal Plane.",
    ranges: {
      typical: 120,
    },
    notes: [
      "Sees through magical and normal darkness",
      "Detects invisible creatures and objects",
      "Sees true forms of shapechangers",
      "Sees into the Ethereal Plane",
      "Automatically succeeds on saves vs. visual illusions",
    ],
  },
};

// Darkvision defaults by race (PHB)
export const RACE_VISION_DEFAULTS = {
  "Human": "normal",
  "Variant Human": "normal",
  "Elf": "darkvision_60",
  "High Elf": "darkvision_60",
  "Wood Elf": "darkvision_60",
  "Drow": "darkvision_120",
  "Dwarf": "darkvision_60",
  "Hill Dwarf": "darkvision_60",
  "Mountain Dwarf": "darkvision_60",
  "Halfling": "normal",
  "Lightfoot Halfling": "normal",
  "Stout Halfling": "normal",
  "Gnome": "darkvision_60",
  "Forest Gnome": "darkvision_60",
  "Rock Gnome": "darkvision_60",
  "Half-Elf": "darkvision_60",
  "Half-Orc": "darkvision_60",
  "Tiefling": "darkvision_60",
  "Dragonborn": "normal",
  "Aarakocra": "normal",
  "Genasi": "normal", // varies by subrace
  "Goliath": "normal",
  "Aasimar": "darkvision_60",
  "Firbolg": "normal",
  "Kenku": "normal",
  "Lizardfolk": "normal",
  "Tabaxi": "darkvision_60",
  "Triton": "normal",
  "Yuan-Ti Pureblood": "darkvision_60",
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. PROFICIENCY TYPES
// ─────────────────────────────────────────────────────────────────────────────

export const PROFICIENCY_TYPES = {
  armor: {
    label: "Armor Proficiency",
    description: "Proficiency allows wearing armor without penalties to ability checks, saving throws, and attack rolls.",
    categories: [
      {
        name: "Light Armor",
        examples: ["Padded", "Leather", "Studded Leather"],
        mechanic: "Add DEX modifier to AC (no cap).",
      },
      {
        name: "Medium Armor",
        examples: ["Hide", "Chain Shirt", "Scale Mail", "Breastplate", "Half Plate"],
        mechanic: "Add DEX modifier to AC (max +2).",
      },
      {
        name: "Heavy Armor",
        examples: ["Ring Mail", "Chain Mail", "Splint", "Plate"],
        mechanic: "No DEX modifier added to AC. May impose STR requirement.",
      },
      {
        name: "Shields",
        examples: ["Shield"],
        mechanic: "+2 AC while wielding.",
      },
    ],
    withoutProficiency:
      "Cannot cast spells. Disadvantage on any ability check, saving throw, or attack roll using Strength or Dexterity.",
  },
  weapons: {
    label: "Weapon Proficiency",
    description: "Add proficiency bonus to attack rolls with proficient weapons.",
    categories: [
      {
        name: "Simple Weapons",
        examples: ["Club", "Dagger", "Handaxe", "Javelin", "Light Crossbow", "Quarterstaff", "Shortbow", "Spear"],
        mechanic: "All classes proficient. Add proficiency bonus to attack rolls.",
      },
      {
        name: "Martial Weapons",
        examples: ["Battleaxe", "Greatsword", "Longbow", "Longsword", "Rapier", "Shortsword", "War Pick"],
        mechanic: "Fighter, Paladin, Ranger, Barbarian, and some others proficient. Add proficiency bonus to attack rolls.",
      },
      {
        name: "Specific Weapons",
        examples: ["Firearms (Gunslinger)", "Net", "Whip"],
        mechanic: "Only specific classes or subclasses. Add proficiency bonus to attack rolls.",
      },
    ],
    withoutProficiency: "No proficiency bonus added to attack rolls.",
  },
  tools: {
    label: "Tool Proficiency",
    description: "Add proficiency bonus to ability checks made using the tool.",
    categories: [
      {
        name: "Artisan's Tools",
        examples: [
          "Alchemist's Supplies", "Brewer's Supplies", "Calligrapher's Supplies",
          "Carpenter's Tools", "Cobbler's Tools", "Cook's Utensils",
          "Glassblower's Tools", "Jeweler's Tools", "Leatherworker's Tools",
          "Mason's Tools", "Painter's Supplies", "Potter's Tools",
          "Smith's Tools", "Tinker's Tools", "Weaver's Tools", "Woodcarver's Tools",
        ],
        mechanic: "Add proficiency bonus to checks using these tools.",
      },
      {
        name: "Gaming Sets",
        examples: ["Dice Set", "Dragonchess Set", "Playing Card Set", "Three-Dragon Ante Set"],
        mechanic: "Add proficiency bonus to checks involving games of skill or chance.",
      },
      {
        name: "Musical Instruments",
        examples: ["Bagpipes", "Drum", "Dulcimer", "Flute", "Lute", "Lyre", "Horn", "Pan Flute", "Shawm", "Viol"],
        mechanic: "Add proficiency bonus to performance checks and relevant ability checks.",
      },
      {
        name: "Other Tools",
        examples: ["Disguise Kit", "Forgery Kit", "Herbalism Kit", "Navigator's Tools", "Poisoner's Kit", "Thieves' Tools"],
        mechanic: "Add proficiency bonus to ability checks with these tools.",
      },
    ],
    withoutProficiency: "Cannot add proficiency bonus. May still attempt checks at DM discretion.",
  },
  savingThrows: {
    label: "Saving Throw Proficiency",
    description: "Add proficiency bonus to saving throws for the specified ability.",
    mechanic: "Each class grants proficiency in two saving throws. Add proficiency bonus when making those saves.",
    classDefaults: {
      Barbarian: ["STR", "CON"],
      Bard: ["DEX", "CHA"],
      Cleric: ["WIS", "CHA"],
      Druid: ["INT", "WIS"],
      Fighter: ["STR", "CON"],
      Monk: ["STR", "DEX"],
      Paladin: ["WIS", "CHA"],
      Ranger: ["STR", "DEX"],
      Rogue: ["DEX", "INT"],
      Sorcerer: ["CON", "CHA"],
      Warlock: ["WIS", "CHA"],
      Wizard: ["INT", "WIS"],
    },
  },
  skills: {
    label: "Skill Proficiency",
    description: "Add proficiency bonus to ability checks using that skill.",
    mechanic:
      "Proficiency: add proficiency bonus. Expertise: add double proficiency bonus. Jack of All Trades (Bard): add half proficiency (rounded down) to non-proficient skills.",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. ABILITY SCORE USES
// ─────────────────────────────────────────────────────────────────────────────

export const ABILITY_SCORE_USES = {
  STR: {
    label: "Strength",
    abbreviation: "STR",
    primaryUses: [
      "Melee weapon attack rolls (non-finesse)",
      "Melee weapon damage rolls (non-finesse)",
      "Athletics skill checks",
    ],
    carryingCapacity: {
      formula: "15 × STR score (lbs)",
      description: "Maximum weight you can carry without penalty.",
      encumbered: "STR score × 5 — speed drops by 10ft",
      heavilyEncumbered: "STR score × 10 — speed drops by 20ft, disadvantage on STR/DEX/CON checks, saves, attacks",
    },
    pushDragLift: {
      formula: "30 × STR score (lbs)",
      description: "Maximum weight you can push, drag, or lift (speed drops to 5ft if over carrying capacity).",
    },
    jumpDistance: {
      runningLongJump: "Up to STR score in feet (need 10ft running start)",
      standingLongJump: "Half STR score in feet",
      runningHighJump: "3 + STR modifier in feet (need 10ft running start)",
      standingHighJump: "Half of running high jump",
    },
    skills: ["Athletics"],
    savingThrowClasses: ["Barbarian", "Fighter", "Monk", "Ranger"],
  },
  DEX: {
    label: "Dexterity",
    abbreviation: "DEX",
    primaryUses: [
      "Ranged weapon attack rolls",
      "Ranged weapon damage rolls",
      "Finesse weapon attack and damage rolls (if higher than STR)",
      "Armor Class (light armor: full DEX; medium armor: max +2; heavy armor: none)",
      "Initiative rolls",
      "Acrobatics, Sleight of Hand, and Stealth skill checks",
    ],
    acFormulas: {
      unarmored: "10 + DEX modifier",
      unarmoredMonk: "10 + DEX modifier + WIS modifier",
      unarmoredBarbarian: "10 + DEX modifier + CON modifier",
      lightArmor: "Armor base + DEX modifier (no cap)",
      mediumArmor: "Armor base + DEX modifier (max +2)",
      heavyArmor: "Armor base (no DEX)",
    },
    initiative: "DEX modifier added to initiative rolls",
    skills: ["Acrobatics", "Sleight of Hand", "Stealth"],
    savingThrowClasses: ["Bard", "Monk", "Ranger", "Rogue"],
  },
  CON: {
    label: "Constitution",
    abbreviation: "CON",
    primaryUses: [
      "Hit points per level (CON modifier added each level)",
      "Concentration saving throws (DC 10 or half damage taken, whichever is higher)",
      "Constitution saving throws (many spells, exhaustion, etc.)",
    ],
    hitPoints: {
      level1: "Max hit die + CON modifier",
      perLevel: "Hit die roll (or average) + CON modifier",
      retroactive: "If CON modifier increases, HP increases retroactively for all past levels",
    },
    concentration: {
      description: "When taking damage while concentrating, make a CON save.",
      dc: "DC = max(10, half damage taken)",
      savingThrow: "CON saving throw; proficiency applies if proficient in CON saves",
    },
    skills: [], // No skills use CON directly
    savingThrowClasses: ["Barbarian", "Fighter", "Sorcerer"],
    notes: "Constitution has no associated skills, but its modifier and saves appear very frequently.",
  },
  INT: {
    label: "Intelligence",
    abbreviation: "INT",
    primaryUses: [
      "Wizard spellcasting ability (spell attack bonus, spell save DC)",
      "Arcana, History, Investigation, Nature, and Religion skill checks",
      "Intelligence saving throws",
    ],
    spellcastingClasses: ["Wizard"],
    spellcastingFormulas: {
      spellAttackBonus: "Proficiency bonus + INT modifier",
      spellSaveDC: "8 + proficiency bonus + INT modifier",
    },
    skills: ["Arcana", "History", "Investigation", "Nature", "Religion"],
    savingThrowClasses: ["Druid", "Rogue", "Wizard"],
  },
  WIS: {
    label: "Wisdom",
    abbreviation: "WIS",
    primaryUses: [
      "Cleric, Druid, and Ranger spellcasting ability",
      "Animal Handling, Insight, Medicine, Perception, and Survival skill checks",
      "Passive Perception and Passive Insight",
      "Wisdom saving throws",
    ],
    spellcastingClasses: ["Cleric", "Druid", "Ranger"],
    spellcastingFormulas: {
      spellAttackBonus: "Proficiency bonus + WIS modifier",
      spellSaveDC: "8 + proficiency bonus + WIS modifier",
    },
    skills: ["Animal Handling", "Insight", "Medicine", "Perception", "Survival"],
    passiveScores: ["Passive Perception", "Passive Insight"],
    savingThrowClasses: ["Cleric", "Druid", "Paladin", "Warlock", "Wizard"],
  },
  CHA: {
    label: "Charisma",
    abbreviation: "CHA",
    primaryUses: [
      "Bard, Paladin, Sorcerer, and Warlock spellcasting ability",
      "Deception, Intimidation, Performance, and Persuasion skill checks",
      "Charisma saving throws",
    ],
    spellcastingClasses: ["Bard", "Paladin", "Sorcerer", "Warlock"],
    spellcastingFormulas: {
      spellAttackBonus: "Proficiency bonus + CHA modifier",
      spellSaveDC: "8 + proficiency bonus + CHA modifier",
    },
    skills: ["Deception", "Intimidation", "Performance", "Persuasion"],
    savingThrowClasses: ["Bard", "Cleric", "Paladin", "Sorcerer", "Warlock"],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. XP THRESHOLDS (levels 1–20)
// Index 0 = level 1 XP required (0), index 19 = level 20 XP required
// ─────────────────────────────────────────────────────────────────────────────

export const XP_THRESHOLDS = [
  0,       // Level 1
  300,     // Level 2
  900,     // Level 3
  2700,    // Level 4
  6500,    // Level 5
  14000,   // Level 6
  23000,   // Level 7
  34000,   // Level 8
  48000,   // Level 9
  64000,   // Level 10
  85000,   // Level 11
  100000,  // Level 12
  120000,  // Level 13
  140000,  // Level 14
  165000,  // Level 15
  195000,  // Level 16
  225000,  // Level 17
  265000,  // Level 18
  305000,  // Level 19
  355000,  // Level 20
];

// ─────────────────────────────────────────────────────────────────────────────
// 7. HIT DICE BY CLASS
// ─────────────────────────────────────────────────────────────────────────────

export const HIT_DICE_BY_CLASS = {
  d6: {
    sides: 6,
    average: 4, // average roll for HP per level (rounded up: (1+6)/2 = 3.5 → 4)
    classes: ["Sorcerer", "Wizard"],
  },
  d8: {
    sides: 8,
    average: 5,
    classes: ["Bard", "Cleric", "Druid", "Monk", "Rogue", "Warlock"],
  },
  d10: {
    sides: 10,
    average: 6,
    classes: ["Fighter", "Paladin", "Ranger"],
  },
  d12: {
    sides: 12,
    average: 7,
    classes: ["Barbarian"],
  },
};

// Flat lookup: className → die sides
export const CLASS_HIT_DIE = (() => {
  const map = {};
  for (const [die, data] of Object.entries(HIT_DICE_BY_CLASS)) {
    for (const cls of data.classes) {
      map[cls] = data.sides;
    }
  }
  return map;
})();

// ─────────────────────────────────────────────────────────────────────────────
// 8. QUICK REFERENCE CARD TEMPLATE
// ─────────────────────────────────────────────────────────────────────────────

export const QUICK_REFERENCE_CARD = {
  sections: [
    {
      id: "identity",
      label: "Character Identity",
      fields: ["name", "race", "class", "level", "background", "alignment"],
    },
    {
      id: "combatStats",
      label: "Combat Stats",
      fields: ["armorClass", "initiative", "speed", "maxHP", "currentHP", "tempHP", "hitDice"],
    },
    {
      id: "abilityScores",
      label: "Ability Scores",
      fields: ["STR", "DEX", "CON", "INT", "WIS", "CHA"],
    },
    {
      id: "passiveScores",
      label: "Passive Scores",
      fields: ["passivePerception", "passiveInvestigation", "passiveInsight"],
    },
    {
      id: "proficiencyBonus",
      label: "Proficiency Bonus",
      fields: ["proficiencyBonus"],
    },
    {
      id: "savingThrows",
      label: "Saving Throws",
      fields: ["STR_save", "DEX_save", "CON_save", "INT_save", "WIS_save", "CHA_save"],
    },
    {
      id: "skills",
      label: "Skills",
      fields: [
        "Acrobatics", "Animal Handling", "Arcana", "Athletics",
        "Deception", "History", "Insight", "Intimidation",
        "Investigation", "Medicine", "Nature", "Perception",
        "Performance", "Persuasion", "Religion", "Sleight of Hand",
        "Stealth", "Survival",
      ],
    },
    {
      id: "vision",
      label: "Vision",
      fields: ["visionType", "visionRange"],
    },
    {
      id: "spellcasting",
      label: "Spellcasting",
      fields: ["spellcastingAbility", "spellSaveDC", "spellAttackBonus", "spellSlots"],
    },
    {
      id: "xp",
      label: "Experience Points",
      fields: ["currentXP", "xpToNextLevel", "xpForNextLevel"],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTED FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate a passive score.
 * @param {number} abilityMod - The ability modifier (e.g. WIS mod for Passive Perception)
 * @param {number} profBonus - Current proficiency bonus
 * @param {boolean} isProficient - Whether the character is proficient in the related skill
 * @param {boolean|null} hasAdvantage - true = advantage (+5), false = disadvantage (-5), null = normal
 * @param {number} bonuses - Any additional flat bonuses (e.g. Observant feat +5)
 * @returns {number} The calculated passive score
 */
export function calculatePassiveScore(abilityMod, profBonus, isProficient, hasAdvantage = null, bonuses = 0) {
  let score = 10 + abilityMod;
  if (isProficient) score += profBonus;
  if (hasAdvantage === true) score += 5;
  if (hasAdvantage === false) score -= 5;
  score += bonuses;
  return score;
}

/**
 * Get the total XP required to reach a given level.
 * @param {number} level - Character level (1–20)
 * @returns {number} XP required for that level, or -1 if out of range
 */
export function getXPForLevel(level) {
  if (level < 1 || level > 20) return -1;
  return XP_THRESHOLDS[level - 1];
}

/**
 * Get XP needed to reach the next level from the current XP and level.
 * @param {number} currentXP - The character's current XP total
 * @param {number} currentLevel - The character's current level (1–20)
 * @returns {number} XP remaining to next level, or 0 if at max level
 */
export function getXPToNextLevel(currentXP, currentLevel) {
  if (currentLevel >= 20) return 0;
  const nextLevelXP = XP_THRESHOLDS[currentLevel]; // index = currentLevel (0-based), so level N+1 is at index N
  return Math.max(0, nextLevelXP - currentXP);
}

/**
 * Get the hit die size for a given class name.
 * @param {string} className - e.g. "Fighter", "Wizard"
 * @returns {number|null} Number of sides on the hit die (6, 8, 10, or 12), or null if unknown
 */
export function getHitDie(className) {
  const normalized = className
    ? className.trim().charAt(0).toUpperCase() + className.trim().slice(1).toLowerCase()
    : "";

  // Try direct lookup
  if (CLASS_HIT_DIE[className]) return CLASS_HIT_DIE[className];

  // Try title-case normalized version
  for (const [cls, sides] of Object.entries(CLASS_HIT_DIE)) {
    if (cls.toLowerCase() === className.toLowerCase()) return sides;
  }
  return null;
}

/**
 * Get the default walking speed for a given race.
 * @param {string} race - Race name (e.g. "Wood Elf", "Dwarf")
 * @returns {number} Walking speed in feet (defaults to 30 if race not found)
 */
export function getSpeedForRace(race) {
  if (!race) return 30;
  // Direct match
  if (RACE_SPEED_DEFAULTS[race] !== undefined) return RACE_SPEED_DEFAULTS[race];
  // Case-insensitive match
  for (const [key, val] of Object.entries(RACE_SPEED_DEFAULTS)) {
    if (key.toLowerCase() === race.toLowerCase()) return val;
  }
  return 30; // fallback default
}

/**
 * Get the default vision type key for a given race.
 * @param {string} race - Race name (e.g. "Drow", "Gnome")
 * @returns {string} Vision type key: "normal", "darkvision_60", or "darkvision_120"
 */
export function getVisionForRace(race) {
  if (!race) return "normal";
  if (RACE_VISION_DEFAULTS[race] !== undefined) return RACE_VISION_DEFAULTS[race];
  for (const [key, val] of Object.entries(RACE_VISION_DEFAULTS)) {
    if (key.toLowerCase() === race.toLowerCase()) return val;
  }
  return "normal"; // fallback default
}

/**
 * Generate a quick reference summary card object for a character.
 * @param {Object} characterData - The character data object with ability scores, class, race, etc.
 * @returns {Object} A populated quick reference card object
 */
export function generateQuickRefCard(characterData) {
  if (!characterData) return null;

  const {
    name = "Unknown",
    race = "",
    characterClass = "",
    level = 1,
    background = "",
    alignment = "",
    abilityScores = {},
    proficiencies = {},
    currentHP = 0,
    maxHP = 0,
    tempHP = 0,
    armorClass = 10,
    currentXP = 0,
    spellSlots = {},
    expertise = {},
  } = characterData;

  // Ability modifiers
  const getMod = (score) => Math.floor((score - 10) / 2);
  const STRmod = getMod(abilityScores.STR || 10);
  const DEXmod = getMod(abilityScores.DEX || 10);
  const CONmod = getMod(abilityScores.CON || 10);
  const INTmod = getMod(abilityScores.INT || 10);
  const WISmod = getMod(abilityScores.WIS || 10);
  const CHAmod = getMod(abilityScores.CHA || 10);

  // Proficiency bonus by level
  const profBonus = Math.ceil(level / 4) + 1;

  // Hit die
  const hitDie = getHitDie(characterClass);

  // Speed and vision
  const speed = getSpeedForRace(race);
  const visionKey = getVisionForRace(race);
  const visionRange = visionKey === "darkvision_120" ? 120 : visionKey === "darkvision_60" ? 60 : 0;
  const visionType = visionKey.startsWith("darkvision") ? "darkvision" : "normal";

  // Passive scores
  const passivePerception = calculatePassiveScore(
    WISmod,
    profBonus,
    !!(proficiencies.skills && proficiencies.skills.includes("Perception")),
    null,
    characterData.observantFeat ? 5 : 0
  );
  const passiveInvestigation = calculatePassiveScore(
    INTmod,
    profBonus,
    !!(proficiencies.skills && proficiencies.skills.includes("Investigation")),
    null,
    characterData.observantFeat ? 5 : 0
  );
  const passiveInsight = calculatePassiveScore(
    WISmod,
    profBonus,
    !!(proficiencies.skills && proficiencies.skills.includes("Insight")),
    null,
    0
  );

  // Saving throws
  const savingThrows = {};
  for (const [ability, mod] of [
    ["STR", STRmod], ["DEX", DEXmod], ["CON", CONmod],
    ["INT", INTmod], ["WIS", WISmod], ["CHA", CHAmod],
  ]) {
    const isProficient = !!(proficiencies.savingThrows && proficiencies.savingThrows.includes(ability));
    savingThrows[ability] = mod + (isProficient ? profBonus : 0);
  }

  // Spellcasting
  const spellcastingAbility = (() => {
    if (!characterClass) return null;
    for (const [ability, data] of Object.entries(ABILITY_SCORE_USES)) {
      if (data.spellcastingClasses && data.spellcastingClasses.includes(characterClass)) {
        return ability;
      }
    }
    return null;
  })();

  const spellMod = spellcastingAbility
    ? getMod(abilityScores[spellcastingAbility] || 10)
    : 0;

  const spellSaveDC = spellcastingAbility ? 8 + profBonus + spellMod : null;
  const spellAttackBonus = spellcastingAbility ? profBonus + spellMod : null;

  // XP
  const xpForNextLevel = level < 20 ? XP_THRESHOLDS[level] : null;
  const xpToNextLevel = xpForNextLevel !== null ? getXPToNextLevel(currentXP, level) : 0;

  return {
    identity: { name, race, class: characterClass, level, background, alignment },
    combatStats: {
      armorClass,
      initiative: DEXmod,
      speed,
      maxHP,
      currentHP,
      tempHP,
      hitDice: hitDie ? `d${hitDie}` : null,
    },
    abilityScores: {
      STR: { score: abilityScores.STR || 10, modifier: STRmod },
      DEX: { score: abilityScores.DEX || 10, modifier: DEXmod },
      CON: { score: abilityScores.CON || 10, modifier: CONmod },
      INT: { score: abilityScores.INT || 10, modifier: INTmod },
      WIS: { score: abilityScores.WIS || 10, modifier: WISmod },
      CHA: { score: abilityScores.CHA || 10, modifier: CHAmod },
    },
    proficiencyBonus: profBonus,
    passiveScores: {
      passivePerception,
      passiveInvestigation,
      passiveInsight,
    },
    savingThrows,
    vision: {
      type: visionType,
      rangeInFeet: visionRange,
      label: visionRange > 0 ? `Darkvision ${visionRange}ft` : "Normal Vision",
    },
    spellcasting: spellcastingAbility
      ? {
          ability: spellcastingAbility,
          spellSaveDC,
          spellAttackBonus,
          spellSlots,
        }
      : null,
    xp: {
      currentXP,
      xpForNextLevel,
      xpToNextLevel,
      isMaxLevel: level >= 20,
    },
  };
}

/**
 * Get all primary uses, associated skills, and notes for a given ability score.
 * @param {string} ability - Ability abbreviation: "STR", "DEX", "CON", "INT", "WIS", or "CHA"
 * @returns {Object|null} The ability score uses data object, or null if not found
 */
export function getAbilityUses(ability) {
  if (!ability) return null;
  const key = ability.toUpperCase();
  return ABILITY_SCORE_USES[key] || null;
}
