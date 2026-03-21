/**
 * playerConditionRef.js
 * Player-facing quick reference for conditions, exhaustion, and damage types.
 * Implements player mode improvements #89, 91, 96-99.
 * Pure JS — no React dependencies.
 */

// ─────────────────────────────────────────────────────────────────────────────
// CONDITION_QUICK_REF
// All 15 conditions with player-friendly descriptions and mechanical effects.
// ─────────────────────────────────────────────────────────────────────────────

export const CONDITION_QUICK_REF = {
  blinded: {
    name: "Blinded",
    icon: "👁️",
    color: "#6b6b6b",
    playerSummary:
      "You cannot see anything around you. You struggle to hit enemies and enemies find it easy to hit you.",
    mechanicalEffects: [
      "Auto-fail any ability check that requires sight",
      "Your attack rolls have disadvantage",
      "Attack rolls made against you have advantage",
    ],
    commonSources: [
      "Darkness or magical darkness",
      "Sand or dust thrown in eyes",
      "Spells: Blindness/Deafness, Color Spray",
      "Certain monster abilities (e.g. gas, ink)",
    ],
    removalMethods: [
      "Moving into light (if caused by darkness)",
      "Lesser Restoration spell",
      "Condition ends when the spell or effect ends",
    ],
  },

  charmed: {
    name: "Charmed",
    icon: "💕",
    color: "#e87cc3",
    playerSummary:
      "You are magically compelled to view the charmer as a trusted ally. You cannot harm them, and they have an easier time manipulating you.",
    mechanicalEffects: [
      "Cannot attack the charmer or target them with harmful abilities or spells",
      "The charmer has advantage on Charisma (social) checks made against you",
    ],
    commonSources: [
      "Spells: Charm Person, Dominate Person, Suggestion",
      "Certain monster abilities (e.g. vampire's Charm, harpy's Luring Song)",
      "Fey magic",
    ],
    removalMethods: [
      "Condition ends when the charming effect ends",
      "Lesser Restoration spell",
      "Being harmed by the charmer may end some charm effects",
    ],
  },

  deafened: {
    name: "Deafened",
    icon: "🔇",
    color: "#8a8a8a",
    playerSummary:
      "You cannot hear anything. You automatically fail any check that requires hearing.",
    mechanicalEffects: [
      "Cannot hear",
      "Auto-fail any ability check that requires hearing",
    ],
    commonSources: [
      "Spells: Blindness/Deafness, Thunderwave (in some interpretations)",
      "Certain monster abilities",
      "Extremely loud environments",
    ],
    removalMethods: [
      "Lesser Restoration spell",
      "Condition ends when the spell or effect ends",
    ],
  },

  frightened: {
    name: "Frightened",
    icon: "😨",
    color: "#c47a1e",
    playerSummary:
      "You are overcome with fear of a specific source. While you can see it, you fight and act poorly, and you cannot move toward it.",
    mechanicalEffects: [
      "Disadvantage on ability checks while the source of fear is in line of sight",
      "Disadvantage on attack rolls while the source of fear is in line of sight",
      "Cannot willingly move closer to the source of your fear",
    ],
    commonSources: [
      "Spells: Fear, Cause Fear, Phantasmal Killer",
      "Dragon's Frightful Presence",
      "Certain monster abilities and saves",
    ],
    removalMethods: [
      "Moving out of line of sight of the source",
      "Lesser Restoration spell",
      "Condition ends when the frightening effect ends",
    ],
  },

  grappled: {
    name: "Grappled",
    icon: "🤼",
    color: "#b07030",
    playerSummary:
      "Something has seized you. You cannot move until you break free or the grappler lets go.",
    mechanicalEffects: [
      "Speed becomes 0, and cannot be increased by any means",
      "Condition ends if the grappler is incapacitated",
      "Condition ends if you are moved beyond the grappler's reach by an external force",
    ],
    commonSources: [
      "Creature using the Grapple action (Athletics check)",
      "Spells: Entangle, Hold Person",
      "Monster abilities (e.g. tentacles, constrict)",
    ],
    removalMethods: [
      "Use your action to escape: Athletics or Acrobatics check vs. grappler's Athletics",
      "Another creature moves you out of the grappler's reach",
      "Grappler becomes incapacitated",
    ],
  },

  incapacitated: {
    name: "Incapacitated",
    icon: "🚫",
    color: "#999999",
    playerSummary:
      "You cannot take actions or reactions. Your turn is effectively skipped.",
    mechanicalEffects: [
      "Cannot take actions",
      "Cannot take reactions",
    ],
    commonSources: [
      "Component of other conditions: Paralyzed, Petrified, Stunned, Unconscious",
      "Spells: Tashas Hideous Laughter (while prone laughing)",
      "Certain monster abilities",
    ],
    removalMethods: [
      "Condition ends when the underlying effect ends",
      "Lesser Restoration (if caused by a spell or magic)",
    ],
  },

  invisible: {
    name: "Invisible",
    icon: "👻",
    color: "#b0c4de",
    playerSummary:
      "You cannot be seen without magical means. You are much harder to hit and much easier to land attacks with.",
    mechanicalEffects: [
      "Impossible to see without special senses; treated as heavily obscured",
      "Your attack rolls have advantage",
      "Attack rolls against you have disadvantage",
      "You can still be detected by sound, smell, or tracks",
    ],
    commonSources: [
      "Spells: Invisibility, Greater Invisibility",
      "Magic items",
      "Certain class features (e.g. Rogue's Vanish, Way of Shadow Monk)",
    ],
    removalMethods: [
      "Attacking or casting a spell ends Invisibility (not Greater Invisibility)",
      "Condition ends when the spell or effect ends",
      "See Invisibility or True Seeing can detect invisible creatures",
    ],
  },

  paralyzed: {
    name: "Paralyzed",
    icon: "⚡",
    color: "#f0c040",
    playerSummary:
      "You are completely frozen — you cannot move, speak, or act. Enemies can land critical hits on you automatically in melee.",
    mechanicalEffects: [
      "Incapacitated (cannot take actions or reactions)",
      "Cannot move",
      "Cannot speak",
      "Auto-fail Strength and Dexterity saving throws",
      "Attack rolls against you have advantage",
      "Any attack that hits you from within 5 feet is automatically a critical hit",
    ],
    commonSources: [
      "Spells: Hold Person, Hold Monster",
      "Ghoul's Claws",
      "Certain poisons and monster abilities",
    ],
    removalMethods: [
      "Lesser Restoration spell",
      "Condition ends when the effect ends (Hold Person: repeat save each turn)",
      "Freedom of Movement spell (immunity)",
    ],
  },

  petrified: {
    name: "Petrified",
    icon: "🪨",
    color: "#a0a0a0",
    playerSummary:
      "You have been turned to stone. You are completely helpless and unaware of your surroundings, but highly resistant to damage.",
    mechanicalEffects: [
      "Transformed into a solid inanimate substance (usually stone)",
      "Weight increases by a factor of 10",
      "Incapacitated (cannot take actions or reactions)",
      "Cannot move or speak",
      "Unaware of your surroundings",
      "Auto-fail Strength and Dexterity saving throws",
      "Resistance to all damage",
      "Immune to poison and disease (existing poison/disease is suspended, not removed)",
    ],
    commonSources: [
      "Medusa's Petrifying Gaze",
      "Basilisk's Gaze",
      "Cockatrice Bite",
      "Spells: Flesh to Stone",
    ],
    removalMethods: [
      "Greater Restoration spell",
      "Stone to Flesh spell",
      "Condition ends when the petrifying effect is reversed",
    ],
  },

  poisoned: {
    name: "Poisoned",
    icon: "🤢",
    color: "#6abf5e",
    playerSummary:
      "Poison courses through you, impairing your physical and mental capabilities. Everything you do is harder.",
    mechanicalEffects: [
      "Disadvantage on attack rolls",
      "Disadvantage on ability checks",
    ],
    commonSources: [
      "Poison weapons, darts, and traps",
      "Spells: Poison Spray, Ray of Sickness",
      "Monster abilities (e.g. giant spider, snake bite)",
      "Ingested or inhaled poisons",
    ],
    removalMethods: [
      "Lesser Restoration spell",
      "Antitoxin (advantage on CON save to resist poison)",
      "Neutralize Poison spell",
      "Condition ends when the effect ends; some require a CON save",
    ],
  },

  prone: {
    name: "Prone",
    icon: "🛌",
    color: "#b08050",
    playerSummary:
      "You are on the ground. Melee attackers have an easier time hitting you, but ranged attackers have a harder time. Standing up costs movement.",
    mechanicalEffects: [
      "Your attack rolls have disadvantage",
      "Melee attack rolls against you have advantage",
      "Ranged attack rolls against you have disadvantage",
      "Standing up costs half your movement speed for the turn",
      "You can crawl while prone, but crawling costs 1 extra foot of movement per foot traveled",
    ],
    commonSources: [
      "Being knocked down by a creature ability",
      "Spells: Thunderwave, Earthquake",
      "Voluntary: drop prone as a free action",
      "Failing certain checks or saves",
    ],
    removalMethods: [
      "Use half your movement speed to stand up",
    ],
  },

  restrained: {
    name: "Restrained",
    icon: "⛓️",
    color: "#8b6914",
    playerSummary:
      "You are held in place and your movements are restricted. Enemies hit you more easily, and you struggle to hit or dodge.",
    mechanicalEffects: [
      "Speed becomes 0, and cannot be increased by any means",
      "Your attack rolls have disadvantage",
      "Attack rolls against you have advantage",
      "Disadvantage on Dexterity saving throws",
    ],
    commonSources: [
      "Spells: Entangle, Web, Snare",
      "Monster abilities (e.g. grapple plus restraint)",
      "Environmental hazards (nets, webs)",
    ],
    removalMethods: [
      "Break free with a Strength check (DC varies by source)",
      "Condition ends when the restraining effect ends",
      "Allies can help cut you free depending on the source",
    ],
  },

  stunned: {
    name: "Stunned",
    icon: "💫",
    color: "#ffd700",
    playerSummary:
      "You are dazed and overwhelmed — barely able to speak, unable to move, and completely open to attack.",
    mechanicalEffects: [
      "Incapacitated (cannot take actions or reactions)",
      "Cannot move",
      "Can only speak falteringly (limited communication)",
      "Auto-fail Strength and Dexterity saving throws",
      "Attack rolls against you have advantage",
    ],
    commonSources: [
      "Monk's Stunning Strike",
      "Spells: Power Word Stun",
      "Certain monster abilities",
    ],
    removalMethods: [
      "Condition ends when the effect ends (many allow a CON save at end of each turn)",
      "Lesser Restoration in some cases",
    ],
  },

  unconscious: {
    name: "Unconscious",
    icon: "😵",
    color: "#555577",
    playerSummary:
      "You are out cold — completely unaware, unable to act, and vulnerable to melee finishing blows.",
    mechanicalEffects: [
      "Incapacitated (cannot take actions or reactions)",
      "Cannot move",
      "Cannot speak",
      "Unaware of your surroundings",
      "Drop whatever you are holding",
      "Fall prone",
      "Auto-fail Strength and Dexterity saving throws",
      "Attack rolls against you have advantage",
      "Any attack that hits you from within 5 feet is automatically a critical hit",
    ],
    commonSources: [
      "Dropping to 0 HP (dying state)",
      "Spells: Sleep, Power Word Kill",
      "Certain monster abilities",
      "Exhaustion level 6",
    ],
    removalMethods: [
      "Regaining at least 1 HP (if at 0 HP)",
      "Stabilized (stops death saves, but still unconscious at 0 HP)",
      "Spells: Healing Word, Spare the Dying (stabilize)",
      "Naturally waking from Sleep spell when damaged or shaken",
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// EXHAUSTION_QUICK_REF
// Levels 1–6 with cumulative effects and removal info.
// ─────────────────────────────────────────────────────────────────────────────

export const EXHAUSTION_QUICK_REF = {
  description:
    "Exhaustion is cumulative — all lower-level effects apply in addition to higher ones. A long rest removes 1 level of exhaustion (minimum 1 level removed if you have food and water).",
  removalMethods: [
    "Long rest removes 1 level of exhaustion (requires adequate food and water)",
    "Greater Restoration spell removes 1 level of exhaustion",
    "Some magic items or class features may remove exhaustion",
  ],
  levels: [
    {
      level: 1,
      effect: "Disadvantage on ability checks",
      cumulativeEffects: ["Disadvantage on ability checks"],
      severity: "minor",
      color: "#a8c84a",
      note: "Ability checks only — attacks and saves are not yet affected.",
    },
    {
      level: 2,
      effect: "Speed halved",
      cumulativeEffects: [
        "Disadvantage on ability checks",
        "Speed halved",
      ],
      severity: "moderate",
      color: "#f0b840",
      note: "Movement is significantly reduced on top of impaired checks.",
    },
    {
      level: 3,
      effect: "Disadvantage on attack rolls and saving throws",
      cumulativeEffects: [
        "Disadvantage on ability checks",
        "Speed halved",
        "Disadvantage on attack rolls and saving throws",
      ],
      severity: "serious",
      color: "#e07820",
      note: "Now affects combat offensively and defensively. Very dangerous in a fight.",
    },
    {
      level: 4,
      effect: "Hit point maximum halved",
      cumulativeEffects: [
        "Disadvantage on ability checks",
        "Speed halved",
        "Disadvantage on attack rolls and saving throws",
        "Hit point maximum halved",
      ],
      severity: "severe",
      color: "#c04020",
      note: "Your HP ceiling is cut in half. You become far easier to kill.",
    },
    {
      level: 5,
      effect: "Speed reduced to 0",
      cumulativeEffects: [
        "Disadvantage on ability checks",
        "Speed halved (then reduced to 0)",
        "Disadvantage on attack rolls and saving throws",
        "Hit point maximum halved",
        "Speed reduced to 0",
      ],
      severity: "critical",
      color: "#901010",
      note: "You cannot move at all. You are essentially immobile in combat.",
    },
    {
      level: 6,
      effect: "Death",
      cumulativeEffects: [
        "Disadvantage on ability checks",
        "Speed reduced to 0",
        "Disadvantage on attack rolls and saving throws",
        "Hit point maximum halved",
        "Speed reduced to 0",
        "Death",
      ],
      severity: "fatal",
      color: "#400000",
      note: "You die. Exhaustion level 6 is instant death with no saving throw.",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// DAMAGE_TYPE_INTERACTIONS
// Player-friendly explanations of resistance, immunity, vulnerability, and
// a reference list of common damage types and sources.
// ─────────────────────────────────────────────────────────────────────────────

export const DAMAGE_TYPE_INTERACTIONS = {
  mechanics: {
    resistance: {
      label: "Resistance",
      icon: "🛡️",
      color: "#4a90d9",
      description: "Take half damage from this damage type.",
      formula: "Damage × 0.5 (rounded down)",
      note: "Multiple resistances do not stack — you still only take half damage.",
    },
    immunity: {
      label: "Immunity",
      icon: "🚫",
      color: "#50c850",
      description: "Take no damage from this damage type.",
      formula: "Damage × 0 (zero damage)",
      note: "Immunity overrides resistance. If you are immune, you take 0 damage regardless.",
    },
    vulnerability: {
      label: "Vulnerability",
      icon: "⚠️",
      color: "#e04040",
      description: "Take double damage from this damage type.",
      formula: "Damage × 2",
      note: "If you have both resistance and vulnerability to the same damage type, they cancel out — take normal damage.",
    },
  },
  damageTypes: [
    {
      name: "Acid",
      icon: "🧪",
      color: "#a8e040",
      description: "Corrosive chemical damage.",
      commonSources: [
        "Acid Splash spell",
        "Black dragon breath",
        "Ochre jelly and black pudding",
        "Acid vials",
      ],
    },
    {
      name: "Bludgeoning",
      icon: "🔨",
      color: "#a0785a",
      description: "Blunt force trauma from clubs, hammers, falling, etc.",
      commonSources: [
        "Clubs, maces, warhammers",
        "Unarmed strikes",
        "Falling damage",
        "Thunderwave spell",
      ],
    },
    {
      name: "Cold",
      icon: "❄️",
      color: "#a0d8f0",
      description: "Freezing temperatures and ice damage.",
      commonSources: [
        "Ray of Frost spell",
        "Ice Storm spell",
        "White dragon breath",
        "Cone of Cold spell",
      ],
    },
    {
      name: "Fire",
      icon: "🔥",
      color: "#e06020",
      description: "Heat, flame, and burning damage.",
      commonSources: [
        "Fireball spell",
        "Fire Bolt cantrip",
        "Red and gold dragon breath",
        "Burning hands",
        "Torches and environmental fire",
      ],
    },
    {
      name: "Force",
      icon: "✨",
      color: "#c080ff",
      description: "Pure magical energy. Very few creatures resist this.",
      commonSources: [
        "Magic Missile spell",
        "Eldritch Blast cantrip",
        "Spiritual Weapon",
      ],
    },
    {
      name: "Lightning",
      icon: "⚡",
      color: "#f0e040",
      description: "Electrical damage from spells, storms, or monsters.",
      commonSources: [
        "Lightning Bolt spell",
        "Call Lightning spell",
        "Blue dragon breath",
        "Storm Sphere",
      ],
    },
    {
      name: "Necrotic",
      icon: "💀",
      color: "#604080",
      description: "Life-draining dark energy that withers and rots.",
      commonSources: [
        "Inflict Wounds spell",
        "Blight spell",
        "Undead creatures (e.g. wraith, specter)",
        "Chill Touch cantrip",
      ],
    },
    {
      name: "Piercing",
      icon: "🗡️",
      color: "#c0c0c0",
      description: "Stabbing and puncturing wounds from pointed weapons.",
      commonSources: [
        "Swords (piercing attacks), spears, arrows",
        "Rapiers, daggers",
        "Monster bites and claws (some)",
        "Spike Growth spell",
      ],
    },
    {
      name: "Poison",
      icon: "🤢",
      color: "#60c060",
      description: "Toxic damage from venom, disease, or noxious substances.",
      commonSources: [
        "Poison Spray cantrip",
        "Snake and spider bites",
        "Poisoned weapons",
        "Green dragon breath",
      ],
    },
    {
      name: "Psychic",
      icon: "🧠",
      color: "#e060b0",
      description: "Mental damage that assaults the mind directly.",
      commonSources: [
        "Phantasmal Killer spell",
        "Mind Sliver cantrip",
        "Mind Flayer abilities",
        "Psychic Scream spell",
      ],
    },
    {
      name: "Radiant",
      icon: "☀️",
      color: "#ffe080",
      description: "Holy and divine energy. Especially effective against undead.",
      commonSources: [
        "Sacred Flame cantrip",
        "Guiding Bolt spell",
        "Divine Smite (Paladin)",
        "Dawn spell",
        "Angels and celestials",
      ],
    },
    {
      name: "Slashing",
      icon: "⚔️",
      color: "#d04040",
      description: "Cutting and slashing wounds from bladed weapons.",
      commonSources: [
        "Swords, axes, scimitars",
        "Claws and talons",
        "Slashing spells (e.g. Shatter in some rulings)",
      ],
    },
    {
      name: "Thunder",
      icon: "💥",
      color: "#8080e0",
      description: "Concussive sonic energy and explosive force.",
      commonSources: [
        "Thunderwave spell",
        "Shatter spell",
        "Thunderclap cantrip",
        "Blue dragon's wing attack",
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTED UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the full quick-reference object for a given condition name.
 * Accepts both camelCase keys (e.g. "blinded") and display names (e.g. "Blinded").
 *
 * @param {string} conditionName
 * @returns {object|null} The condition reference object, or null if not found.
 */
export function getConditionRef(conditionName) {
  if (!conditionName) return null;
  const key = conditionName.toLowerCase().trim();
  return CONDITION_QUICK_REF[key] ?? null;
}

/**
 * Returns the exhaustion effects for a given level (1–6).
 * Includes all cumulative effects for that level.
 *
 * @param {number} level - Exhaustion level (1–6)
 * @returns {object|null} The exhaustion level object, or null if out of range.
 */
export function getExhaustionEffects(level) {
  if (typeof level !== "number" || level < 1 || level > 6) return null;
  return EXHAUSTION_QUICK_REF.levels[level - 1] ?? null;
}

/**
 * Returns a compact summary of all currently active conditions for display.
 * Given an array of condition name strings, returns an array of summary objects
 * with name, icon, color, and a one-line player summary.
 *
 * @param {string[]} activeConditions - Array of active condition name strings
 * @returns {object[]} Array of summary objects for each recognized condition
 */
export function getPlayerConditionSummary(activeConditions) {
  if (!Array.isArray(activeConditions)) return [];
  return activeConditions
    .map((name) => {
      const ref = getConditionRef(name);
      if (!ref) return null;
      return {
        name: ref.name,
        icon: ref.icon,
        color: ref.color,
        summary: ref.playerSummary,
        effectCount: ref.mechanicalEffects.length,
      };
    })
    .filter(Boolean);
}

/**
 * Returns information about a specific damage type by name.
 * Accepts case-insensitive names (e.g. "fire", "Fire", "FIRE").
 *
 * @param {string} damageType
 * @returns {object|null} The damage type info object, or null if not found.
 */
export function getDamageTypeInfo(damageType) {
  if (!damageType) return null;
  const normalized = damageType.toLowerCase().trim();
  return (
    DAMAGE_TYPE_INTERACTIONS.damageTypes.find(
      (dt) => dt.name.toLowerCase() === normalized
    ) ?? null
  );
}

/**
 * Returns an array of all condition reference objects, sorted alphabetically.
 *
 * @returns {object[]} All 15 condition objects.
 */
export function getAllConditions() {
  return Object.values(CONDITION_QUICK_REF).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}
