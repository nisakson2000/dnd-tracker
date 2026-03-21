/**
 * playerRestSystem.js
 * Player Mode Improvements 191-200: Rest & Recovery Data
 * D&D 5e rest rules, class feature recharge tracking, and recovery calculations.
 */

// ---------------------------------------------------------------------------
// SHORT REST RULES
// ---------------------------------------------------------------------------

export const SHORT_REST_RULES = {
  duration: {
    minimum: "1 hour",
    description:
      "A short rest is a period of downtime, at least 1 hour long, during which a character does nothing more strenuous than eating, drinking, reading, and tending to wounds.",
  },
  hitDiceHealing: {
    description:
      "During a short rest, a character can spend one or more Hit Dice to regain hit points.",
    process: [
      "Roll the hit die for each die spent.",
      "Add your Constitution modifier to each roll.",
      "Minimum healing per die is 0 (negative results do not reduce HP).",
      "Regain that many hit points.",
    ],
  },
  classFeatureRecharge: {
    Fighter: ["Second Wind", "Action Surge"],
    "Fighter (Battle Master)": ["Superiority Dice"],
    Warlock: ["Pact Magic spell slots"],
    Monk: ["Ki Points"],
    "Bard (level 5+)": ["Bardic Inspiration"],
    Cleric: ["Channel Divinity"],
    Druid: ["Wild Shape (some uses)"],
    Wizard: ["Arcane Recovery (once per day, used during a short rest)"],
    Paladin: ["Channel Divinity"],
  },
};

// ---------------------------------------------------------------------------
// LONG REST RULES
// ---------------------------------------------------------------------------

export const LONG_REST_RULES = {
  duration: {
    total: "8 hours",
    minimumSleep: "6 hours",
    maximumLightActivity: "2 hours",
    lightActivityExamples: [
      "reading",
      "talking",
      "eating",
      "standing watch",
      "light camp chores",
    ],
  },
  benefits: [
    "Regain all lost hit points.",
    "Regain all expended spell slots.",
    "Regain hit dice equal to half your total hit dice (minimum 1).",
    "Reset all class features that recharge on a long rest.",
    "Remove 1 level of exhaustion (if you have had sufficient food and water).",
  ],
  requirements: [
    "Must have at least 1 hit point to begin and benefit from the rest.",
    "Can only benefit from a long rest once per 24-hour period.",
    "Interrupted by 1 or more hours of strenuous activity.",
  ],
  interruptionCriteria: {
    strenuous: [
      "walking",
      "fighting",
      "casting spells",
      "using class features that require significant exertion",
    ],
    strenuousThreshold: "1 hour of strenuous activity restarts the rest",
  },
  exhaustionRecovery: {
    levelsRemoved: 1,
    condition:
      "Sufficient food and water must have been consumed. Without provisions, exhaustion is not removed.",
  },
};

// ---------------------------------------------------------------------------
// CLASS FEATURE RECHARGE
// ---------------------------------------------------------------------------

export const CLASS_FEATURE_RECHARGE = {
  Barbarian: {
    shortRest: [],
    longRest: ["Rage uses"],
    always: ["Reckless Attack", "Danger Sense"],
    notes:
      "Rage uses are restored on a long rest. Reckless Attack and Danger Sense are not limited-use features.",
  },
  Bard: {
    shortRest: ["Bardic Inspiration (level 5+, Font of Inspiration feature)"],
    longRest: [
      "Bardic Inspiration (before level 5)",
      "Song of Rest (always available, not expended)",
      "Spell slots",
    ],
    always: ["Song of Rest (passive; no charge)"],
    notes:
      "At level 5, Font of Inspiration allows Bardic Inspiration to recharge on a short rest.",
  },
  Cleric: {
    shortRest: ["Channel Divinity uses"],
    longRest: ["Spell slots", "Divine Intervention (7-day recharge after success)"],
    always: [],
    notes:
      "Divine Intervention recharges after 7 days following a successful use. All other features on long rest.",
  },
  Druid: {
    shortRest: ["Wild Shape uses"],
    longRest: ["Spell slots"],
    always: [],
    notes:
      "Wild Shape recharges on a short or long rest. Some subclass abilities may vary.",
  },
  Fighter: {
    shortRest: ["Second Wind", "Action Surge"],
    longRest: ["Indomitable"],
    always: [],
    notes:
      "Battle Master fighters also regain Superiority Dice on a short rest. Indomitable uses are long-rest only.",
  },
  "Fighter (Battle Master)": {
    shortRest: ["Superiority Dice", "Second Wind", "Action Surge"],
    longRest: ["Indomitable"],
    always: [],
    notes: "Superiority Dice recharge on a short or long rest.",
  },
  Monk: {
    shortRest: ["Ki Points"],
    longRest: [],
    always: [],
    notes:
      "All Ki Points are restored on a short or long rest.",
  },
  Paladin: {
    shortRest: ["Channel Divinity uses"],
    longRest: [
      "Lay on Hands pool",
      "Cleansing Touch uses",
      "Spell slots",
      "Favored Enemy (if applicable)",
    ],
    always: ["Divine Smite (uses spell slots; not a separate pool)"],
    notes:
      "Divine Smite consumes spell slots rather than a dedicated pool. Channel Divinity recharges on a short rest.",
  },
  Ranger: {
    shortRest: [],
    longRest: ["Spell slots", "Favored Foe uses"],
    always: [],
    notes:
      "Rangers have few resource pools outside of spell slots. Subclass features may vary.",
  },
  Rogue: {
    shortRest: [],
    longRest: [],
    always: [],
    notes:
      "Rogues have no major resource pools in the base class. Most class features are passive or at-will.",
  },
  Sorcerer: {
    shortRest: [],
    longRest: ["Sorcery Points", "Spell slots"],
    always: [],
    notes:
      "All Sorcery Points and spell slots restore on a long rest only.",
  },
  Warlock: {
    shortRest: ["Pact Magic spell slots"],
    longRest: ["Mystic Arcanum uses"],
    always: [],
    notes:
      "Pact Magic slots recharge on a short or long rest. Mystic Arcanum (levels 11-17) recharges on a long rest only.",
  },
  Wizard: {
    shortRest: ["Arcane Recovery (declared during short rest, once per day)"],
    longRest: ["Spell slots"],
    always: [],
    notes:
      "Arcane Recovery lets a Wizard regain some spell slots during a short rest, but can only be used once per day.",
  },
};

// ---------------------------------------------------------------------------
// HIT DICE RULES
// ---------------------------------------------------------------------------

export const HIT_DICE_RULES = {
  totalDice: "Equal to your character level (one die per level).",
  sizeByClass: {
    d6: ["Sorcerer", "Wizard"],
    d8: ["Artificer", "Bard", "Cleric", "Druid", "Monk", "Rogue", "Warlock"],
    d10: ["Fighter", "Paladin", "Ranger"],
    d12: ["Barbarian"],
  },
  spending: {
    when: "Only during a short rest.",
    how: "Spend one or more hit dice, roll each die, add your Constitution modifier to each roll (minimum 0 healing per die), and regain that many hit points.",
    minimum: "Healing from a single die is always at least 0 (a negative Constitution modifier cannot reduce HP).",
  },
  longRestRecovery: {
    regain: "Half of your total number of hit dice (rounded down, minimum 1).",
    example: "A level 7 character regains 3 hit dice on a long rest.",
  },
};

// ---------------------------------------------------------------------------
// REST RECOVERY SUMMARY TEMPLATE
// ---------------------------------------------------------------------------

export const REST_RECOVERY_SUMMARY_TEMPLATE = {
  hpRestored: 0,
  hitDiceSpent: 0,
  hitDiceRegained: 0,
  spellSlotsRestored: [],  // Array of { level: Number, count: Number }
  featuresRecharged: [],   // Array of feature name strings
  exhaustionRemoved: 0,
  notes: [],               // Array of informational strings
};

// ---------------------------------------------------------------------------
// VARIANT REST RULES
// ---------------------------------------------------------------------------

export const VARIANT_REST_RULES = {
  epicHeroism: {
    name: "Epic Heroism",
    source: "Dungeon Master's Guide (Optional Rule)",
    shortRest: {
      duration: "5 minutes",
      description:
        "Short rests are only 5 minutes long, allowing heroes to recover quickly between encounters.",
    },
    longRest: {
      duration: "1 hour",
      description:
        "Long rests are only 1 hour, making recovery rapid and heroic action the norm.",
    },
    notes:
      "Best for fast-paced, action-hero style campaigns where resources should feel abundant.",
  },
  grittyRealism: {
    name: "Gritty Realism",
    source: "Dungeon Master's Guide (Optional Rule)",
    shortRest: {
      duration: "8 hours",
      description:
        "A short rest now requires a full night's sleep, making recovery a significant investment.",
    },
    longRest: {
      duration: "7 days",
      description:
        "A long rest requires a full week of downtime in a safe location.",
    },
    notes:
      "Best for low-magic, survival, or dark fantasy campaigns where resources should feel scarce and meaningful.",
  },
  slowNaturalHealing: {
    name: "Slow Natural Healing",
    source: "Dungeon Master's Guide (Optional Rule)",
    longRestHPRecovery: false,
    description:
      "A long rest does not automatically restore hit points. Characters must spend Hit Dice during the long rest to regain HP, as if taking a short rest.",
    notes:
      "Healing magic and potions become more important. Works well alongside Gritty Realism.",
  },
};

// ---------------------------------------------------------------------------
// EXPORTED UTILITY FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Calculate total HP regained from spending hit dice during a short rest.
 *
 * @param {number} hitDieSize   - Size of the hit die (e.g. 8 for d8).
 * @param {number} conMod       - Character's Constitution modifier (can be negative).
 * @param {number} diceSpent    - Number of hit dice to spend.
 * @returns {{ totalHealing: number, rolls: number[], perDieResults: number[] }}
 */
export function calculateShortRestHealing(hitDieSize, conMod, diceSpent) {
  const rolls = [];
  const perDieResults = [];
  let totalHealing = 0;

  for (let i = 0; i < diceSpent; i++) {
    const roll = Math.floor(Math.random() * hitDieSize) + 1;
    const result = Math.max(0, roll + conMod);
    rolls.push(roll);
    perDieResults.push(result);
    totalHealing += result;
  }

  return { totalHealing, rolls, perDieResults };
}

/**
 * Calculate all recovery granted by a long rest for a character.
 *
 * @param {object} characterData - Character state object.
 *   Expected fields: {
 *     currentHp: number, maxHp: number,
 *     currentHitDice: number, totalHitDice: number, hitDieSize: number,
 *     conMod: number,
 *     exhaustionLevel: number,
 *     className: string,
 *     hasFood: boolean, hasWater: boolean,
 *     spellSlots: { [level]: { max: number, current: number } },
 *   }
 * @returns {object} Recovery summary matching REST_RECOVERY_SUMMARY_TEMPLATE shape.
 */
export function calculateLongRestRecovery(characterData) {
  const summary = { ...REST_RECOVERY_SUMMARY_TEMPLATE, spellSlotsRestored: [], featuresRecharged: [], notes: [] };

  if (characterData.currentHp <= 0) {
    summary.notes.push("Character has 0 HP and cannot benefit from a long rest.");
    return summary;
  }

  // HP restoration
  const hpMissing = characterData.maxHp - characterData.currentHp;
  summary.hpRestored = hpMissing;

  // Hit dice recovery
  const hitDiceRegained = getHitDiceRecovery(characterData.totalHitDice);
  summary.hitDiceRegained = hitDiceRegained;

  // Spell slot restoration
  if (characterData.spellSlots) {
    for (const [level, slot] of Object.entries(characterData.spellSlots)) {
      const restored = slot.max - slot.current;
      if (restored > 0) {
        summary.spellSlotsRestored.push({ level: Number(level), count: restored });
      }
    }
  }

  // Class features recharged on long rest
  const className = characterData.className || "";
  summary.featuresRecharged = getRechargeableFeatures(className, "long");

  // Exhaustion
  const hasProvisions = characterData.hasFood && characterData.hasWater;
  if (characterData.exhaustionLevel > 0 && hasProvisions) {
    summary.exhaustionRemoved = 1;
  } else if (characterData.exhaustionLevel > 0 && !hasProvisions) {
    summary.notes.push(
      "Exhaustion was not removed: character lacks sufficient food and/or water."
    );
  }

  return summary;
}

/**
 * Get the list of class features that recharge on a given rest type.
 *
 * @param {string} className  - Class name (e.g. "Warlock", "Fighter").
 * @param {string} restType   - "short" or "long".
 * @returns {string[]} Array of feature names that recharge.
 */
export function getRechargeableFeatures(className, restType) {
  const classData = CLASS_FEATURE_RECHARGE[className];
  if (!classData) return [];

  const type = restType === "short" ? "shortRest" : "longRest";
  const features = [...(classData[type] || [])];

  // Long rest also recharges short-rest features (a long rest confers all short rest benefits)
  if (restType === "long" && classData.shortRest) {
    for (const f of classData.shortRest) {
      if (!features.includes(f)) features.push(f);
    }
  }

  return features;
}

/**
 * Calculate how many hit dice are regained after a long rest.
 *
 * @param {number} totalHitDice - Character's maximum hit dice (equal to character level).
 * @returns {number} Number of hit dice regained.
 */
export function getHitDiceRecovery(totalHitDice) {
  return Math.max(1, Math.floor(totalHitDice / 2));
}

/**
 * Generate a full rest summary for a character, for display in the UI.
 *
 * @param {object} characterData  - Character state (see calculateLongRestRecovery for shape).
 * @param {string} restType       - "short" or "long".
 * @param {number} hitDiceSpent   - Number of hit dice spent (relevant to short rests).
 * @returns {object} Populated summary matching REST_RECOVERY_SUMMARY_TEMPLATE.
 */
export function generateRestSummary(characterData, restType, hitDiceSpent = 0) {
  const summary = { ...REST_RECOVERY_SUMMARY_TEMPLATE, spellSlotsRestored: [], featuresRecharged: [], notes: [] };

  if (restType === "short") {
    if (hitDiceSpent > 0) {
      const healing = calculateShortRestHealing(
        characterData.hitDieSize || 8,
        characterData.conMod || 0,
        hitDiceSpent
      );
      summary.hpRestored = healing.totalHealing;
      summary.hitDiceSpent = hitDiceSpent;
      summary.notes.push(
        `Rolled ${hitDiceSpent}d${characterData.hitDieSize || 8}: [${healing.rolls.join(", ")}] + CON (${characterData.conMod >= 0 ? "+" : ""}${characterData.conMod}) = ${healing.totalHealing} HP restored.`
      );
    } else {
      summary.notes.push("No hit dice were spent during this short rest.");
    }

    summary.featuresRecharged = getRechargeableFeatures(characterData.className || "", "short");
  } else {
    const longSummary = calculateLongRestRecovery(characterData);
    Object.assign(summary, longSummary);
  }

  return summary;
}

/**
 * Check whether a rest has been interrupted.
 *
 * @param {number} activityDuration - Duration of strenuous activity in minutes.
 * @param {string} activityType     - Type of activity (e.g. "fighting", "walking", "casting spells").
 * @returns {{ interrupted: boolean, reason: string }}
 */
export function checkRestInterruption(activityDuration, activityType) {
  const strenuousActivities = LONG_REST_RULES.interruptionCriteria.strenuous;
  const isStrenuous = strenuousActivities.some((a) =>
    activityType.toLowerCase().includes(a.toLowerCase())
  );

  if (!isStrenuous) {
    return {
      interrupted: false,
      reason: `"${activityType}" is not considered strenuous and does not interrupt a rest.`,
    };
  }

  // 60 minutes = 1 hour threshold
  if (activityDuration >= 60) {
    return {
      interrupted: true,
      reason: `${activityDuration} minutes of "${activityType}" (strenuous activity) exceeds the 1-hour threshold. The rest is interrupted and must be restarted.`,
    };
  }

  return {
    interrupted: false,
    reason: `${activityDuration} minutes of "${activityType}" is strenuous but has not yet exceeded 1 hour. Rest continues, but further exertion may interrupt it.`,
  };
}
