/**
 * wizardSpellbook.js
 *
 * Roadmap items covered:
 *   - #107: Wizard spellbook — rules, costs, sources, arcane recovery, variants, and helpers
 *
 * Data-only module. No React. No side effects.
 * All exports are plain objects or pure functions.
 */

// ---------------------------------------------------------------------------
// SPELLBOOK_RULES
// Core rules for the wizard spellbook feature (PHB 5e).
// ---------------------------------------------------------------------------

export const SPELLBOOK_RULES = {
  label: "Spellbook Rules",
  description:
    "The wizard's spellbook is the repository of all spells the wizard knows. " +
    "A wizard can only cast spells they have prepared from their spellbook.",

  startingSpells: {
    count: 6,
    description:
      "A 1st-level wizard begins with 6 spells of 1st level in their spellbook.",
  },

  spellsGainedPerLevel: {
    count: 2,
    description:
      "Each time a wizard gains a level (2nd and beyond), they add 2 spells of any " +
      "level they can cast to their spellbook for free, representing research between adventures.",
  },

  copyingSpells: {
    description:
      "A wizard can copy a spell from a scroll or another spellbook into their own " +
      "spellbook. Copying requires spending gold and time per spell level.",
    costPerSpellLevel: 50,
    hoursPerSpellLevel: 2,
    requiresIntelligenceCheck: false,
    notes: [
      "The spell must be on the wizard spell list.",
      "The wizard must be able to prepare spells of that level.",
      "Copying from a scroll consumes the scroll.",
    ],
  },

  schoolSpecialtyBonus: {
    description:
      "A wizard who is a specialist in a school of magic (e.g., Evocation, Divination) " +
      "pays half the normal gold cost and spends half the normal time when copying spells " +
      "from their specialty school.",
    costMultiplier: 0.5,
    timeMultiplier: 0.5,
  },

  maxPrepared: {
    description:
      "The number of spells a wizard can have prepared at any one time equals " +
      "their Intelligence modifier plus their wizard level (minimum 1).",
    formula: "INT modifier + wizard level (minimum 1)",
  },
};

// ---------------------------------------------------------------------------
// SPELLBOOK_COSTS
// Detailed cost and time table for copying spells by level.
// ---------------------------------------------------------------------------

export const SPELLBOOK_COSTS = {
  label: "Spellbook Copying Costs",
  description:
    "Gold and time required to copy a spell into a wizard's spellbook. " +
    "School specialists pay half cost and half time for their specialty school spells.",

  bySpellLevel: {
    1: { goldGp: 50,  timeHours: 2,  specialistGoldGp: 25,  specialistTimeHours: 1 },
    2: { goldGp: 100, timeHours: 4,  specialistGoldGp: 50,  specialistTimeHours: 2 },
    3: { goldGp: 150, timeHours: 6,  specialistGoldGp: 75,  specialistTimeHours: 3 },
    4: { goldGp: 200, timeHours: 8,  specialistGoldGp: 100, specialistTimeHours: 4 },
    5: { goldGp: 250, timeHours: 10, specialistGoldGp: 125, specialistTimeHours: 5 },
    6: { goldGp: 300, timeHours: 12, specialistGoldGp: 150, specialistTimeHours: 6 },
    7: { goldGp: 350, timeHours: 14, specialistGoldGp: 175, specialistTimeHours: 7 },
    8: { goldGp: 400, timeHours: 16, specialistGoldGp: 200, specialistTimeHours: 8 },
    9: { goldGp: 450, timeHours: 18, specialistGoldGp: 225, specialistTimeHours: 9 },
  },

  notes: [
    "Costs are per individual spell, not per page.",
    "Time spent copying must be uninterrupted study — not during travel or combat.",
    "Materials include inks, quills, and binding reagents; assumed included in the gold cost.",
  ],
};

// ---------------------------------------------------------------------------
// SPELL_SOURCES
// Ways a wizard can acquire new spells for their spellbook.
// ---------------------------------------------------------------------------

export const SPELL_SOURCES = {
  label: "Sources for New Spells",
  description:
    "Wizards can expand their spellbooks through a variety of means beyond leveling up.",

  sources: [
    {
      id: "enemy_spellbook",
      label: "Enemy Spellbooks",
      description:
        "Defeated enemy wizards, liches, or mages may carry spellbooks. " +
        "These can be looted and their spells copied at standard cost.",
      availability: "combat_loot",
      notes: ["May be partially destroyed or trapped.", "DM determines contents."],
    },
    {
      id: "scroll_loot",
      label: "Scroll Loot",
      description:
        "Magic scrolls found as treasure can be copied into a spellbook. " +
        "Copying a scroll consumes it.",
      availability: "treasure_reward",
      notes: [
        "Spell must be on the wizard list.",
        "Scroll is destroyed upon successful copying.",
      ],
    },
    {
      id: "library",
      label: "Libraries and Academies",
      description:
        "Arcane libraries, wizard colleges, or learned institutions may provide " +
        "access to spells for a fee or as a quest reward.",
      availability: "downtime_or_quest",
      notes: [
        "Access may require faction standing or payment.",
        "Typical fee: 25–100 gp per spell level for access, plus copying costs.",
      ],
    },
    {
      id: "wizard_trade",
      label: "Other Wizards (Trade or Purchase)",
      description:
        "Wizards may trade spells with one another or purchase access to copy " +
        "spells from a colleague's spellbook.",
      availability: "roleplay_npc",
      notes: [
        "Fair trade: exchange a spell of equal level.",
        "Purchase: negotiated price, typically market rate or higher.",
      ],
    },
    {
      id: "purchased_scroll",
      label: "Purchased Scrolls (Market Price)",
      description:
        "Spell scrolls can be purchased from magic shops or vendors at market price, " +
        "then copied into the spellbook.",
      availability: "market",
      marketPriceBySpellLevel: {
        1:  "50–100 gp",
        2:  "150–300 gp",
        3:  "300–500 gp",
        4:  "500–1,000 gp",
        5:  "1,000–1,500 gp",
        6:  "1,500–2,500 gp",
        7:  "2,500–5,000 gp",
        8:  "5,000–7,500 gp",
        9:  "7,500–10,000 gp",
      },
      notes: ["Market availability varies by settlement size and DM discretion."],
    },
    {
      id: "quest_reward",
      label: "Quest Rewards",
      description:
        "A patron, guild, or grateful NPC may reward a wizard with a rare spell " +
        "or spellbook as part of a story milestone.",
      availability: "dm_granted",
      notes: ["No gold cost — the reward covers acquisition.", "DM determines the spell."],
    },
  ],
};

// ---------------------------------------------------------------------------
// ARCANE_RECOVERY
// Once-per-day ability to recover spell slots on a short rest.
// ---------------------------------------------------------------------------

export const ARCANE_RECOVERY = {
  label: "Arcane Recovery",
  description:
    "Once per day when a wizard finishes a short rest, they can recover expended " +
    "spell slots. The total levels of the recovered slots cannot exceed half the " +
    "wizard's level (rounded up). No recovered slot may be 6th level or higher.",

  usesPerDay: 1,
  restType: "short_rest",
  maxSlotLevel: 5,
  formula: "Total recovered levels <= ceil(wizard level / 2)",

  restrictions: [
    "Cannot recover slots of 6th level or higher.",
    "Can recover multiple lower-level slots as long as their combined levels do not exceed the cap.",
    "Only usable once per day — resets on a long rest.",
  ],

  examples: [
    { wizardLevel: 1, maxRecoveryLevels: 1, note: "Recover one 1st-level slot." },
    { wizardLevel: 2, maxRecoveryLevels: 1, note: "Recover one 1st-level slot." },
    { wizardLevel: 3, maxRecoveryLevels: 2, note: "Two 1st-level slots, or one 2nd-level slot." },
    { wizardLevel: 5, maxRecoveryLevels: 3, note: "Up to 3 levels worth of slots (e.g., one 3rd, or one 2nd + one 1st)." },
    { wizardLevel: 10, maxRecoveryLevels: 5, note: "Up to 5 levels worth of slots (max slot level 5)." },
    { wizardLevel: 20, maxRecoveryLevels: 10, note: "Up to 10 levels worth of slots (max slot level 5 each)." },
  ],
};

// ---------------------------------------------------------------------------
// SPELLBOOK_VARIANTS
// Optional / homebrew rules for spellbook handling.
// ---------------------------------------------------------------------------

export const SPELLBOOK_VARIANTS = {
  label: "Spellbook Variants (Optional Rules)",
  description:
    "Alternative spellbook forms and optional rules that DMs may introduce for " +
    "narrative texture or mechanical variety.",

  variants: [
    {
      id: "digital_spellbook",
      label: "Digital / Crystalline Spellbook",
      description:
        "An arcane crystal or magical device stores spell formulae instead of a physical book. " +
        "Functions identically to a standard spellbook but is more durable and harder to read " +
        "without the paired attunement key.",
      mechanics: [
        "Immune to fire and water damage that would destroy parchment.",
        "Requires attunement — only the attuned wizard can read it without a DC 18 Arcana check.",
        "Cannot be copied from without the attunement key.",
      ],
      pageCapacity: null,
      notes: ["Rare item — typically crafted or found as treasure."],
    },
    {
      id: "backup_spellbook",
      label: "Backup Spellbook",
      description:
        "A second copy of all or part of the wizard's spellbook kept in a secure location. " +
        "Recreating a backup spellbook costs the same as copying each spell from scratch.",
      recreationCost: "Standard copying cost per spell (50 gp × spell level, 2 hr × spell level).",
      mechanics: [
        "Recreating a backup from memory requires a DC 10 + spell level Intelligence (Arcana) check per spell.",
        "Failure means the spell is not recovered; the wizard may try again after a long rest.",
      ],
      notes: [
        "Strongly recommended — losing the primary spellbook is potentially catastrophic.",
        "Most experienced wizards maintain at least one backup.",
      ],
    },
    {
      id: "spellbook_destruction",
      label: "Spellbook Destruction Consequences",
      description:
        "If a wizard's spellbook is destroyed and no backup exists, they cannot prepare spells " +
        "until a new spellbook is acquired and spells are re-inscribed.",
      consequences: [
        "Wizard cannot prepare any spells until spellbook is replaced.",
        "Spells still currently prepared remain until the next long rest.",
        "Reconstructing from memory: DC 10 + spell level Arcana check per spell; failure = lost.",
        "A blank spellbook costs 50 gp and can be purchased in most cities.",
      ],
      notes: [
        "DMs may allow partial destruction (some pages survive) for less severe outcomes.",
        "Cantrips are not stored in the spellbook and are unaffected.",
      ],
    },
    {
      id: "traveling_spellbook",
      label: "Traveling Spellbook",
      description:
        "A compact, lightweight spellbook designed for adventuring. Holds fewer spells than " +
        "a standard spellbook but is easier to carry and conceal.",
      pageCapacity: 40,
      spellCapacity: "~20 spells (varies by level — higher-level spells take more pages)",
      mechanics: [
        "Weighs 1 lb instead of the standard 3 lb.",
        "Fits in a small pouch or belt holster.",
        "Same copying costs as a standard spellbook.",
      ],
      notes: [
        "Many wizards maintain both a full spellbook at base and a traveling spellbook on adventures.",
        "Page count per spell level: 1st = 1 page, 2nd = 2 pages, 3rd = 3 pages, etc.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Calculate the gold cost to copy a spell into a spellbook.
 *
 * @param {number} spellLevel - The level of the spell (1–9).
 * @param {boolean} isSchoolSpecialty - True if the spell belongs to the wizard's specialty school.
 * @returns {number} Gold piece cost.
 */
export function calculateCopyingCost(spellLevel, isSchoolSpecialty = false) {
  if (spellLevel < 1 || spellLevel > 9) {
    throw new RangeError(`spellLevel must be between 1 and 9. Received: ${spellLevel}`);
  }
  const entry = SPELLBOOK_COSTS.bySpellLevel[spellLevel];
  return isSchoolSpecialty ? entry.specialistGoldGp : entry.goldGp;
}

/**
 * Calculate the time (in hours) required to copy a spell into a spellbook.
 *
 * @param {number} spellLevel - The level of the spell (1–9).
 * @param {boolean} isSchoolSpecialty - True if the spell belongs to the wizard's specialty school.
 * @returns {number} Time in hours.
 */
export function calculateCopyingTime(spellLevel, isSchoolSpecialty = false) {
  if (spellLevel < 1 || spellLevel > 9) {
    throw new RangeError(`spellLevel must be between 1 and 9. Received: ${spellLevel}`);
  }
  const entry = SPELLBOOK_COSTS.bySpellLevel[spellLevel];
  return isSchoolSpecialty ? entry.specialistTimeHours : entry.timeHours;
}

/**
 * Calculate the maximum number of spells a wizard can have prepared.
 *
 * @param {number} wizardLevel - The wizard's class level (1–20).
 * @param {number} intModifier - The wizard's Intelligence ability modifier.
 * @returns {number} Maximum prepared spells (minimum 1).
 */
export function getMaxPrepared(wizardLevel, intModifier) {
  if (wizardLevel < 1 || wizardLevel > 20) {
    throw new RangeError(`wizardLevel must be between 1 and 20. Received: ${wizardLevel}`);
  }
  return Math.max(1, wizardLevel + intModifier);
}

/**
 * Calculate the total number of spells a wizard has in their spellbook at a given level,
 * assuming they added 6 at 1st level and 2 per subsequent level (free level-up spells only).
 *
 * @param {number} wizardLevel - The wizard's class level (1–20).
 * @returns {number} Minimum expected spells in the spellbook from level-ups alone.
 */
export function getStartingSpells(wizardLevel) {
  if (wizardLevel < 1 || wizardLevel > 20) {
    throw new RangeError(`wizardLevel must be between 1 and 20. Received: ${wizardLevel}`);
  }
  // 6 at level 1, then +2 per level gained beyond 1st
  return 6 + (wizardLevel - 1) * 2;
}

/**
 * Calculate the maximum total spell slot levels a wizard can recover with Arcane Recovery.
 *
 * @param {number} wizardLevel - The wizard's class level (1–20).
 * @returns {{ maxRecoveryLevels: number, maxSlotLevel: number }} Recovery cap details.
 */
export function calculateArcaneRecovery(wizardLevel) {
  if (wizardLevel < 1 || wizardLevel > 20) {
    throw new RangeError(`wizardLevel must be between 1 and 20. Received: ${wizardLevel}`);
  }
  return {
    maxRecoveryLevels: Math.ceil(wizardLevel / 2),
    maxSlotLevel: ARCANE_RECOVERY.maxSlotLevel,
  };
}

/**
 * Get the spell capacity (page count or spell count) for a given spellbook variant type.
 *
 * @param {"standard" | "digital_spellbook" | "traveling_spellbook" | "backup_spellbook"} bookType
 * @returns {{ pageCapacity: number | null, notes: string }} Capacity information.
 */
export function getSpellbookCapacity(bookType) {
  if (bookType === "standard") {
    return {
      pageCapacity: 100,
      notes:
        "A standard spellbook has 100 pages. Each spell level occupies a number of pages equal " +
        "to its level (e.g., a 3rd-level spell takes 3 pages). A 1st-level wizard's starting " +
        "spellbook typically has room for ~32 additional spells after the initial 6.",
    };
  }

  const variant = SPELLBOOK_VARIANTS.variants.find((v) => v.id === bookType);
  if (!variant) {
    throw new Error(
      `Unknown bookType: "${bookType}". Valid types: standard, digital_spellbook, traveling_spellbook, backup_spellbook.`
    );
  }

  return {
    pageCapacity: variant.pageCapacity,
    notes: variant.notes ? variant.notes.join(" ") : variant.description,
  };
}
