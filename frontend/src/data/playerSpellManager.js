/**
 * playerSpellManager.js
 * Player Mode Improvements 41-60: Spell Management Data
 * Pure JS, no React.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. SPELL_MANAGEMENT_RULES
// ─────────────────────────────────────────────────────────────────────────────

export const SPELL_MANAGEMENT_RULES = {
  concentration: {
    description: "Only one concentration spell may be active at a time.",
    breakConditions: [
      {
        trigger: "taking_damage",
        description: "Taking damage requires a CON saving throw (DC = max(10, damage / 2)).",
        saveType: "CON",
        dcFormula: (damage) => Math.max(10, Math.floor(damage / 2)),
      },
      {
        trigger: "casting_another_concentration_spell",
        description: "Casting another concentration spell immediately ends the current one.",
      },
      {
        trigger: "incapacitated",
        description: "Becoming incapacitated (including unconscious) ends concentration.",
      },
      {
        trigger: "voluntary_end",
        description: "A caster may voluntarily end concentration at any time (no action required).",
      },
    ],
  },

  preparation: {
    description: "Some classes prepare spells daily; others have a fixed list of spells known.",
    prepareDaily: {
      classes: ["Wizard", "Cleric", "Druid", "Paladin"],
      formula: "spellcastingAbilityModifier + classLevel (minimum 1)",
      note: "Paladins divide level by 2 (rounded down) for slot level purposes but prepare CHA mod + Paladin level spells.",
    },
    spellsKnown: {
      classes: ["Bard", "Sorcerer", "Ranger", "Warlock"],
      note: "These classes have a fixed number of spells known that increases as they level up.",
    },
  },

  components: {
    verbal: {
      abbreviation: "V",
      description: "The caster must be able to speak. Silence or inability to speak prevents casting.",
    },
    somatic: {
      abbreviation: "S",
      description: "The caster needs at least one free hand to perform the gestures.",
    },
    material: {
      abbreviation: "M",
      description:
        "Requires a focus (arcane focus, druidic focus, holy symbol) or component pouch. Consumed or costly components (with a listed GP value) must be provided explicitly and cannot be substituted by a focus.",
    },
  },

  ritual: {
    description:
      "Spells with the ritual tag can be cast as a ritual, adding 10 minutes to the casting time and consuming no spell slot.",
    classBehavior: {
      Cleric: "Can ritual-cast any spell in their prepared list with the ritual tag.",
      Druid: "Can ritual-cast any spell in their prepared list with the ritual tag.",
      Wizard:
        "Can ritual-cast any ritual spell in their spellbook, even if not currently prepared.",
      Bard: "Can ritual-cast ritual spells they know (requires Ritual Caster feature or subclass).",
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. SPELLCASTING_ABILITY
// ─────────────────────────────────────────────────────────────────────────────

export const SPELLCASTING_ABILITY = {
  Bard: "CHA",
  Cleric: "WIS",
  Druid: "WIS",
  Paladin: "CHA",
  Ranger: "WIS",
  Sorcerer: "CHA",
  Warlock: "CHA",
  Wizard: "INT",
  Artificer: "INT",
  "Eldritch Knight": "INT",
  "Arcane Trickster": "INT",
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. SPELL_SAVE_DC_FORMULA / SPELL_ATTACK_FORMULA
// ─────────────────────────────────────────────────────────────────────────────

export const SPELL_SAVE_DC_FORMULA = {
  description: "8 + proficiency bonus + spellcasting ability modifier",
  calculate: (profBonus, abilityMod) => 8 + profBonus + abilityMod,
};

export const SPELL_ATTACK_FORMULA = {
  description: "proficiency bonus + spellcasting ability modifier",
  calculate: (profBonus, abilityMod) => profBonus + abilityMod,
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. CLASS_RESOURCES
// ─────────────────────────────────────────────────────────────────────────────

export const CLASS_RESOURCES = {
  Sorcerer: {
    sorceryPoints: {
      description: "Sorcerers gain 1 sorcery point per class level.",
      pointsByLevel: Object.fromEntries(
        Array.from({ length: 20 }, (_, i) => [i + 1, i + 1])
      ),
      recharge: "long rest",
    },
    metamagic: {
      description: "Metamagic options modify spells using sorcery points.",
      options: [
        { name: "Careful Spell", cost: 1, description: "Chosen creatures automatically succeed on saves against the spell." },
        { name: "Distant Spell", cost: 1, description: "Double the range of the spell (touch becomes 30 ft)." },
        { name: "Empowered Spell", cost: 1, description: "Reroll up to CHA mod damage dice; must use new rolls." },
        { name: "Extended Spell", cost: 1, description: "Double the duration of the spell (max 24 hours)." },
        { name: "Heightened Spell", cost: 3, description: "One target has disadvantage on the first saving throw against the spell." },
        { name: "Quickened Spell", cost: 2, description: "Change casting time from 1 action to 1 bonus action." },
        { name: "Seeking Spell", cost: 2, description: "Reroll a missed spell attack roll; must use new result." },
        { name: "Subtle Spell", cost: 1, description: "Cast without verbal or somatic components." },
        { name: "Transmuted Spell", cost: 1, description: "Change the damage type to another from a specified list." },
        { name: "Twinned Spell", cost: "1 per spell level (min 1)", description: "Target a second creature with a single-target spell." },
      ],
    },
  },

  Wizard: {
    arcaneRecovery: {
      description:
        "Once per day after a short rest, recover spell slots with total levels equal to half wizard level (rounded up). Cannot recover 6th level or higher slots.",
      recoveryByLevel: Object.fromEntries(
        Array.from({ length: 20 }, (_, i) => {
          const level = i + 1;
          return [level, Math.ceil(level / 2)];
        })
      ),
      maxSlotLevel: 5,
      usesPerDay: 1,
      recharge: "long rest (use triggers on short rest)",
    },
  },

  Cleric: {
    channelDivinity: {
      description: "Channel Divinity uses recharge on a short or long rest.",
      usesByLevel: {
        1: 1,
        2: 1,
        3: 1,
        4: 1,
        5: 1,
        6: 2,
        7: 2,
        8: 2,
        9: 2,
        10: 2,
        11: 2,
        12: 2,
        13: 2,
        14: 2,
        15: 2,
        16: 2,
        17: 2,
        18: 3,
        19: 3,
        20: 3,
      },
      recharge: "short rest",
    },
  },

  Warlock: {
    pactMagic: {
      description:
        "Warlocks have Pact Magic slots — all slots are the same level and recharge on a short or long rest.",
      slotsByLevel: {
        1:  { slots: 1, slotLevel: 1 },
        2:  { slots: 2, slotLevel: 1 },
        3:  { slots: 2, slotLevel: 2 },
        4:  { slots: 2, slotLevel: 2 },
        5:  { slots: 2, slotLevel: 3 },
        6:  { slots: 2, slotLevel: 3 },
        7:  { slots: 2, slotLevel: 4 },
        8:  { slots: 2, slotLevel: 4 },
        9:  { slots: 2, slotLevel: 5 },
        10: { slots: 2, slotLevel: 5 },
        11: { slots: 3, slotLevel: 5 },
        12: { slots: 3, slotLevel: 5 },
        13: { slots: 3, slotLevel: 5 },
        14: { slots: 3, slotLevel: 5 },
        15: { slots: 3, slotLevel: 5 },
        16: { slots: 3, slotLevel: 5 },
        17: { slots: 4, slotLevel: 5 },
        18: { slots: 4, slotLevel: 5 },
        19: { slots: 4, slotLevel: 5 },
        20: { slots: 4, slotLevel: 5 },
      },
      recharge: "short rest",
    },
    mysticArcanum: {
      description:
        "Warlocks gain one spell of 6th, 7th, 8th, and 9th level (Mystic Arcanum). Each can be cast once per long rest without a spell slot.",
      unlockedAtLevel: {
        11: 6,
        13: 7,
        15: 8,
        17: 9,
      },
      usesPerSpell: 1,
      recharge: "long rest",
    },
  },

  Paladin: {
    divineSmite: {
      description:
        "When hitting with a melee weapon attack, a Paladin may expend a spell slot to deal extra radiant damage.",
      baseDamage: "2d8",
      additionalPerSlotAbove1st: "1d8",
      maximumDice: "5d8",
      bonusVsUndeadOrFiend: "+1d8 (max 6d8 total)",
      formula: (slotLevel) => {
        const baseDice = 2;
        const extraDice = Math.min(slotLevel - 1, 3);
        return `${baseDice + extraDice}d8 radiant (${baseDice + extraDice + 1}d8 vs undead/fiend)`;
      },
    },
    channelDivinity: {
      description: "Paladins have 1 Channel Divinity use, recharging on a short or long rest.",
      uses: 1,
      recharge: "short rest",
    },
  },

  Bard: {
    bardicInspiration: {
      description:
        "A Bard can inspire others using a bonus action. Uses = CHA modifier (min 1). Die size scales with level.",
      useFormula: "CHA modifier (minimum 1)",
      dieByLevel: {
        1:  "d6",
        2:  "d6",
        3:  "d6",
        4:  "d6",
        5:  "d8",
        6:  "d8",
        7:  "d8",
        8:  "d8",
        9:  "d8",
        10: "d10",
        11: "d10",
        12: "d10",
        13: "d10",
        14: "d10",
        15: "d12",
        16: "d12",
        17: "d12",
        18: "d12",
        19: "d12",
        20: "d12",
      },
      rechargeByLevel: {
        note: "Long rest by default; short rest starting at 5th level (Font of Inspiration).",
        shortRestFrom: 5,
      },
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. CONCENTRATION_TRACKER_TEMPLATE
// ─────────────────────────────────────────────────────────────────────────────

export const CONCENTRATION_TRACKER_TEMPLATE = {
  active: false,
  spellName: null,
  startRound: null,
  duration: null, // in rounds; null = until dispelled
  saveDC: 10,
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. SPELL_SLOT_DISPLAY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Full caster spell slot table (Bard, Cleric, Druid, Sorcerer, Wizard).
 * Keys are class levels 1-20; values are arrays [1st, 2nd, 3rd, 4th, 5th, 6th, 7th, 8th, 9th].
 */
export const FULL_CASTER_SLOTS = {
  1:  [2, 0, 0, 0, 0, 0, 0, 0, 0],
  2:  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  3:  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  4:  [4, 3, 0, 0, 0, 0, 0, 0, 0],
  5:  [4, 3, 2, 0, 0, 0, 0, 0, 0],
  6:  [4, 3, 3, 0, 0, 0, 0, 0, 0],
  7:  [4, 3, 3, 1, 0, 0, 0, 0, 0],
  8:  [4, 3, 3, 2, 0, 0, 0, 0, 0],
  9:  [4, 3, 3, 3, 1, 0, 0, 0, 0],
  10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
  11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
  12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
  13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
  14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
  15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
  16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
  17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
  18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
  19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
  20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
};

/**
 * Warlock Pact Magic slot table.
 * Each entry: { slots, slotLevel }
 */
export const WARLOCK_PACT_SLOTS = CLASS_RESOURCES.Warlock.pactMagic.slotsByLevel;

/**
 * Half-caster spell slot table (Paladin, Ranger).
 * Spell slots begin at class level 2 (effective caster level = floor(classLevel / 2)).
 */
export const HALF_CASTER_SLOTS = {
  1:  [0, 0, 0, 0, 0],
  2:  [2, 0, 0, 0, 0],
  3:  [3, 0, 0, 0, 0],
  4:  [3, 0, 0, 0, 0],
  5:  [4, 2, 0, 0, 0],
  6:  [4, 2, 0, 0, 0],
  7:  [4, 3, 0, 0, 0],
  8:  [4, 3, 0, 0, 0],
  9:  [4, 3, 2, 0, 0],
  10: [4, 3, 2, 0, 0],
  11: [4, 3, 3, 0, 0],
  12: [4, 3, 3, 0, 0],
  13: [4, 3, 3, 1, 0],
  14: [4, 3, 3, 1, 0],
  15: [4, 3, 3, 2, 0],
  16: [4, 3, 3, 2, 0],
  17: [4, 3, 3, 3, 1],
  18: [4, 3, 3, 3, 1],
  19: [4, 3, 3, 3, 2],
  20: [4, 3, 3, 3, 2],
};

/**
 * Third-caster spell slot table (Eldritch Knight, Arcane Trickster).
 * Spell slots begin at class level 3 (effective caster level = floor(classLevel / 3)).
 */
export const THIRD_CASTER_SLOTS = {
  1:  [0, 0, 0, 0],
  2:  [0, 0, 0, 0],
  3:  [2, 0, 0, 0],
  4:  [3, 0, 0, 0],
  5:  [3, 0, 0, 0],
  6:  [3, 0, 0, 0],
  7:  [4, 2, 0, 0],
  8:  [4, 2, 0, 0],
  9:  [4, 2, 0, 0],
  10: [4, 3, 0, 0],
  11: [4, 3, 0, 0],
  12: [4, 3, 0, 0],
  13: [4, 3, 2, 0],
  14: [4, 3, 2, 0],
  15: [4, 3, 2, 0],
  16: [4, 3, 3, 0],
  17: [4, 3, 3, 0],
  18: [4, 3, 3, 0],
  19: [4, 3, 3, 1],
  20: [4, 3, 3, 1],
};

export const SPELL_SLOT_DISPLAY = {
  fullCaster: FULL_CASTER_SLOTS,
  warlockPact: WARLOCK_PACT_SLOTS,
  halfCaster: HALF_CASTER_SLOTS,
  thirdCaster: THIRD_CASTER_SLOTS,
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTED FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate the Spell Save DC.
 * @param {number} profBonus - Proficiency bonus.
 * @param {number} abilityMod - Spellcasting ability modifier.
 * @returns {number}
 */
export function calculateSpellSaveDC(profBonus, abilityMod) {
  return 8 + profBonus + abilityMod;
}

/**
 * Calculate the Spell Attack Bonus.
 * @param {number} profBonus - Proficiency bonus.
 * @param {number} abilityMod - Spellcasting ability modifier.
 * @returns {number}
 */
export function calculateSpellAttackBonus(profBonus, abilityMod) {
  return profBonus + abilityMod;
}

/**
 * Get the Concentration saving throw DC based on damage taken.
 * DC = max(10, floor(damageTaken / 2))
 * @param {number} damageTaken - Total damage taken from a single instance.
 * @returns {number}
 */
export function getConcentrationDC(damageTaken) {
  return Math.max(10, Math.floor(damageTaken / 2));
}

/**
 * Get class-specific resources for a given class and level.
 * @param {string} className - Class name (e.g. "Sorcerer").
 * @param {number} level - Class level (1-20).
 * @returns {object|null} Resource data, or null if not found.
 */
export function getClassResource(className, level) {
  const resource = CLASS_RESOURCES[className];
  if (!resource) return null;

  const result = { className, level, resources: {} };

  if (className === "Sorcerer") {
    result.resources.sorceryPoints = resource.sorceryPoints.pointsByLevel[level] ?? level;
    result.resources.metamagic = resource.metamagic.options;
  }

  if (className === "Wizard") {
    result.resources.arcaneRecoverySlotLevels =
      resource.arcaneRecovery.recoveryByLevel[level] ?? Math.ceil(level / 2);
    result.resources.arcaneRecoveryMaxSlotLevel = resource.arcaneRecovery.maxSlotLevel;
  }

  if (className === "Cleric") {
    result.resources.channelDivinityUses =
      resource.channelDivinity.usesByLevel[level] ?? 1;
  }

  if (className === "Warlock") {
    result.resources.pactMagic = resource.pactMagic.slotsByLevel[level] ?? null;
    const arcanum = {};
    for (const [unlockLevel, spellLevel] of Object.entries(resource.mysticArcanum.unlockedAtLevel)) {
      if (level >= Number(unlockLevel)) {
        arcanum[`level${spellLevel}`] = { spellLevel: Number(spellLevel), usesRemaining: 1 };
      }
    }
    result.resources.mysticArcanum = arcanum;
  }

  if (className === "Paladin") {
    result.resources.divineSmite = resource.divineSmite;
    result.resources.channelDivinityUses = resource.channelDivinity.uses;
  }

  if (className === "Bard") {
    result.resources.bardicInspirationDie = resource.bardicInspiration.dieByLevel[level] ?? "d6";
    result.resources.bardicInspirationUsesFormula = resource.bardicInspiration.useFormula;
    result.resources.bardicInspirationRecharge =
      level >= resource.bardicInspiration.rechargeByLevel.shortRestFrom
        ? "short rest"
        : "long rest";
  }

  return result;
}

/**
 * Get the sorcery point cost for a given Metamagic option.
 * @param {string} metamagicOption - Name of the metamagic option.
 * @returns {number|string|null} Cost in sorcery points, or null if not found.
 */
export function getSorceryPointCost(metamagicOption) {
  const options = CLASS_RESOURCES.Sorcerer.metamagic.options;
  const found = options.find(
    (o) => o.name.toLowerCase() === metamagicOption.toLowerCase()
  );
  return found ? found.cost : null;
}

/**
 * Get the Warlock Pact Magic slot level for a given warlock level.
 * @param {number} warlockLevel - Warlock class level (1-20).
 * @returns {number} The spell level of Pact Magic slots.
 */
export function getWarlockSlotLevel(warlockLevel) {
  const entry = CLASS_RESOURCES.Warlock.pactMagic.slotsByLevel[warlockLevel];
  return entry ? entry.slotLevel : 1;
}

/**
 * Calculate the number of prepared spells for preparation-based classes.
 * For Paladins and Rangers (half-casters), effective caster level = floor(classLevel / 2).
 * @param {string} className - Class name.
 * @param {number} level - Class level.
 * @param {number} abilityMod - Spellcasting ability modifier.
 * @returns {number|null} Prepared spell count, or null for non-preparation classes.
 */
export function calculatePreparedSpellCount(className, level, abilityMod) {
  const prepClasses = ["Wizard", "Cleric", "Druid", "Paladin"];
  if (!prepClasses.includes(className)) return null;

  let effectiveLevel = level;
  if (className === "Paladin") {
    effectiveLevel = Math.floor(level / 2);
  }

  return Math.max(1, effectiveLevel + abilityMod);
}

/**
 * Check whether starting a new concentration spell disrupts an existing one.
 * @param {object|null} currentSpell - Current concentration tracker object (or null).
 * @param {object} newSpell - New spell being cast { spellName, isConcentration }.
 * @returns {{ canCast: boolean, endsCurrentConcentration: boolean, message: string }}
 */
export function checkConcentration(currentSpell, newSpell) {
  if (!newSpell.isConcentration) {
    return {
      canCast: true,
      endsCurrentConcentration: false,
      message: "New spell does not require concentration. No conflict.",
    };
  }

  if (!currentSpell || !currentSpell.active) {
    return {
      canCast: true,
      endsCurrentConcentration: false,
      message: `${newSpell.spellName} can be cast. No active concentration to end.`,
    };
  }

  return {
    canCast: true,
    endsCurrentConcentration: true,
    message: `Casting ${newSpell.spellName} will end concentration on ${currentSpell.spellName}.`,
  };
}

/**
 * Get the spell slots available to a class at a given level.
 * Returns an array indexed 0-8 representing slots for spell levels 1-9.
 * For Warlocks, returns pact magic slot info instead.
 * @param {string} className - Class name.
 * @param {number} level - Class level (1-20).
 * @returns {number[]|object|null}
 */
export function getSpellSlotsByLevel(className, level) {
  const fullCasters = ["Bard", "Cleric", "Druid", "Sorcerer", "Wizard", "Artificer"];
  const halfCasters = ["Paladin", "Ranger"];
  const thirdCasters = ["Eldritch Knight", "Arcane Trickster"];

  if (className === "Warlock") {
    const entry = WARLOCK_PACT_SLOTS[level];
    if (!entry) return null;
    // Return as a slots array where only the pact slot level has entries
    const slots = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    const idx = entry.slotLevel - 1;
    if (idx >= 0 && idx < 9) slots[idx] = entry.slots;
    return slots;
  }

  if (fullCasters.includes(className)) {
    return FULL_CASTER_SLOTS[level] ?? null;
  }

  if (halfCasters.includes(className)) {
    return HALF_CASTER_SLOTS[level] ?? null;
  }

  if (thirdCasters.includes(className)) {
    return THIRD_CASTER_SLOTS[level] ?? null;
  }

  return null;
}
