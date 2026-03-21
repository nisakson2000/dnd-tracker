/**
 * attunementTracker.js
 *
 * Roadmap Items Covered:
 *   #118 — Attunement tracker
 *
 * Provides static rule data and helper functions for tracking magic item
 * attunement slots, requirements, curses, and class-specific overrides.
 * No React dependencies — pure data and logic only.
 */

// ---------------------------------------------------------------------------
// 1. ATTUNEMENT_RULES
//    Core PHB rules governing how attunement works.
// ---------------------------------------------------------------------------

export const ATTUNEMENT_RULES = {
  maxSlots: 3,

  attunementProcess: {
    description:
      "Attuning to an item requires a short rest spent focused on only that item while being in physical contact with it. This focus can take the form of weapon practice, meditation, or some other activity based on the item's nature.",
    requiresShortRest: true,
    focusedOnItemOnly: true,
    mustBeInContact: true,
  },

  endingAttunement: {
    voluntary: {
      description:
        "A creature can voluntarily end attunement to an item during a short rest.",
      requiresShortRest: true,
    },
    automatic: [
      {
        condition: "distance",
        description:
          "Attunement ends if the creature is separated from the item by more than 100 feet for 24 or more hours.",
        distance: 100,
        duration: "24 hours",
      },
      {
        condition: "death",
        description: "Attunement ends if the attuned creature dies.",
      },
      {
        condition: "another_creature_attunes",
        description:
          "Attunement ends if another creature attunes to the item (only one creature can be attuned to an item at a time).",
      },
    ],
  },

  optionalRules: {
    additionalRequirements: {
      description:
        "Some DMs allow items to have additional attunement requirements such as class, alignment, race, or other characteristics. These are optional rules not in the core PHB.",
      types: [
        "Specific class or class feature (e.g., only a paladin)",
        "Specific alignment (e.g., must be lawful good)",
        "Specific race (e.g., only an elf)",
        "Ability score minimum (e.g., Strength 15 or higher)",
        "Fulfillment of a quest or ritual",
      ],
    },
  },

  notes: [
    "Without being attuned to an item, a creature can still use a magic item that doesn't require attunement.",
    "A creature's attunement to an item ends if the creature no longer satisfies the prerequisites for attunement.",
    "Attuning to multiple items of the same type (e.g., two rings of protection) generally does not stack benefits.",
  ],
};

// ---------------------------------------------------------------------------
// 2. ATTUNEMENT_REQUIREMENTS
//    Requirement types and example items for each.
// ---------------------------------------------------------------------------

export const ATTUNEMENT_REQUIREMENTS = {
  types: {
    none: {
      label: "No Attunement Required",
      description: "Item can be used by anyone without attuning.",
      examples: ["Bag of Holding", "Rope of Climbing", "Immovable Rod"],
    },
    anyClass: {
      label: "Any Class (General Attunement)",
      description:
        "Item requires attunement but has no class, race, or alignment restriction.",
      examples: [
        "Cloak of Protection",
        "Ring of Protection",
        "Boots of Speed",
        "Gauntlets of Ogre Power",
        "Headband of Intellect",
      ],
    },
    specificClass: {
      label: "Specific Class",
      description:
        "Item requires attunement by a creature of a specific class or with a specific class feature.",
      examples: [
        { item: "Holy Avenger", requirement: "Paladin only" },
        { item: "Staff of the Magi", requirement: "Sorcerer, Warlock, or Wizard" },
        { item: "Staff of Healing", requirement: "Bard, Cleric, or Druid" },
        { item: "Tome of Clear Thought", requirement: "Any class (raises INT)" },
        { item: "Robe of the Archmagi", requirement: "Sorcerer, Warlock, or Wizard" },
        { item: "Sword of Sharpness", requirement: "Attunement by a creature proficient with swords" },
      ],
    },
    specificAlignment: {
      label: "Specific Alignment",
      description: "Item requires the attuning creature to have a specific alignment.",
      examples: [
        { item: "Holy Avenger", requirement: "Good alignment" },
        { item: "Unholy weapons (variant)", requirement: "Evil alignment" },
        { item: "Axe of the Dwarvish Lords", requirement: "Non-evil dwarf" },
      ],
    },
    spellcasterOnly: {
      label: "Spellcaster Only",
      description: "Item requires attunement by a creature that can cast spells.",
      examples: [
        "Arcane Grimoire",
        "Moon Sickle",
        "Rod of the Pact Keeper",
        "Wand of the War Mage",
        "Bloodwell Vial",
      ],
    },
    specificRace: {
      label: "Specific Race",
      description: "Item requires attunement by a creature of a specific race.",
      examples: [
        { item: "Axe of the Dwarvish Lords", requirement: "Dwarf" },
        { item: "Nimbus of the Seldarine (variant)", requirement: "Elf or half-elf" },
      ],
    },
  },

  checkRequirement(requirementType, character) {
    // requirementType: one of the keys in ATTUNEMENT_REQUIREMENTS.types
    // character: { class, subclass, alignment, race, canCastSpells }
    // Returns { met: boolean, reason: string }
    const type = ATTUNEMENT_REQUIREMENTS.types[requirementType];
    if (!type) {
      return { met: false, reason: `Unknown requirement type: ${requirementType}` };
    }
    // Callers should use the exported checkAttunementRequirements() function
    // for full item-level logic; this method is informational only.
    return { met: true, reason: `Requirement type "${type.label}" identified.` };
  },
};

// ---------------------------------------------------------------------------
// 3. RARITY_AND_ATTUNEMENT
//    How item rarity correlates with the likelihood of requiring attunement.
// ---------------------------------------------------------------------------

export const RARITY_AND_ATTUNEMENT = {
  correlation: {
    common: {
      label: "Common",
      attunementLikelihood: "Rarely requires attunement",
      percentage: "~10%",
      description:
        "Common items are minor curiosities. Most work without attunement.",
      examples: ["Candle of the Deep", "Cloak of Billowing", "Pipe of Smoke Monsters"],
    },
    uncommon: {
      label: "Uncommon",
      attunementLikelihood: "Sometimes requires attunement",
      percentage: "~30–40%",
      description:
        "Uncommon items begin to include those with persistent bonuses that warrant attunement.",
      examples: {
        requiresAttunement: ["Cloak of Protection", "Boots of Elvenkind"],
        noAttunement: ["Bag of Holding", "Goggles of Night"],
      },
    },
    rare: {
      label: "Rare",
      attunementLikelihood: "Often requires attunement",
      percentage: "~50–60%",
      description:
        "Rare items frequently require attunement, especially weapons and armor with meaningful bonuses.",
      examples: {
        requiresAttunement: ["Sword of Sharpness", "Ring of Evasion"],
        noAttunement: ["Carpet of Flying", "Portable Hole"],
      },
    },
    veryRare: {
      label: "Very Rare",
      attunementLikelihood: "Usually requires attunement",
      percentage: "~70–80%",
      description:
        "Very rare items almost always carry powerful abilities that require a personal bond.",
      examples: {
        requiresAttunement: ["Cloak of Invisibility", "Staff of the Magi"],
        noAttunement: ["Bowl of Commanding Water Elementals"],
      },
    },
    legendary: {
      label: "Legendary",
      attunementLikelihood: "Almost always requires attunement",
      percentage: "~90%",
      description:
        "Legendary items are defining character pieces. Nearly all require attunement.",
      examples: {
        requiresAttunement: ["Holy Avenger", "Vorpal Sword", "Talisman of Pure Good"],
        noAttunement: ["Crystal Ball (standard version)"],
      },
    },
    artifact: {
      label: "Artifact",
      attunementLikelihood: "Always requires attunement",
      percentage: "100%",
      description:
        "Artifacts are unique relics of immense power. Attunement is always required and often carries special conditions or risks.",
      examples: [
        "Eye of Vecna",
        "Hand of Vecna",
        "Orb of Dragonkind",
        "Book of Exalted Deeds",
        "Book of Vile Darkness",
      ],
    },
  },
};

// ---------------------------------------------------------------------------
// 4. ARTIFICER_RULES
//    Artificers can attune to more items than other classes.
// ---------------------------------------------------------------------------

export const ARTIFICER_RULES = {
  feature: "Soul of Artifice",
  description:
    "At 20th level, an Artificer's Soul of Artifice feature grants +1 to all saving throws per attuned magic item. However, expanded attunement slots are granted earlier via the Infuse Item feature progression.",
  expandedSlots: [
    {
      level: 1,
      maxSlots: 3,
      note: "Standard attunement cap; Artificers begin at the same limit as all other classes.",
    },
    {
      level: 10,
      maxSlots: 4,
      note: "Artificer Magic Item Adept: can attune to up to 4 magic items at once.",
      featureName: "Magic Item Adept",
    },
    {
      level: 14,
      maxSlots: 5,
      note: "Artificer Magic Item Savant: can attune to up to 5 magic items at once, ignoring class/race attunement requirements.",
      featureName: "Magic Item Savant",
      bonus: "Ignore class, race, spell, and level requirements on attuning to or using magic items.",
    },
    {
      level: 18,
      maxSlots: 6,
      note: "Artificer Magic Item Master: can attune to up to 6 magic items at once.",
      featureName: "Magic Item Master",
    },
  ],
  soulOfArtifice: {
    level: 20,
    description:
      "You have integrated yourself with your magic items. You can attune to up to 6 magic items at once. Additionally, you gain a +1 bonus to all saving throws per magic item you are currently attuned to.",
    savingThrowBonus: "+1 per attuned item (max +6 at full attunement)",
  },
  infuseItemNote:
    "Infused items count as magic items for the purposes of the Artificer's attunement and do not require a short rest to attune — they are automatically attuned when infused.",
};

// ---------------------------------------------------------------------------
// 5. CURSED_ATTUNEMENT
//    Rules for cursed items that trap attunement.
// ---------------------------------------------------------------------------

export const CURSED_ATTUNEMENT = {
  overview:
    "Some magic items bear curses that are not revealed until the item is attuned to. Once attuned, the curse binds the creature to the item and makes ending attunement impossible without outside help.",

  endingCursedAttunement: {
    cannotEndVoluntarily: true,
    description:
      "A cursed item's attunement cannot be ended voluntarily. The creature remains attuned to the item even after the item is removed from the creature's possession.",
    removalMethods: [
      {
        method: "Remove Curse spell",
        description:
          "Casting Remove Curse on the creature ends the attunement and allows the creature to discard the item.",
        isStandard: true,
      },
      {
        method: "Greater Restoration",
        description:
          "In some cases, Greater Restoration may also end a curse's grip depending on the specific item.",
        isStandard: false,
      },
      {
        method: "DM ruling",
        description:
          "A DM may allow specific in-world methods (rituals, artifacts) to remove particularly powerful curses.",
        isStandard: false,
      },
    ],
  },

  symptoms: [
    "Compulsion to use or keep the item, even when it is harmful.",
    "Inability to remove the item once donned (e.g., Necklace of Strangulation).",
    "Stat penalties or ability score drains while attuned.",
    "Behavioral changes: alignment shifts, irrational aggression, paranoia.",
    "Compelled to perform specific actions or avoid certain behaviors.",
    "Item takes control in certain situations (e.g., Sword of Vengeance).",
  ],

  revelationRules: {
    identifySpell: {
      revealsDetails: false,
      note:
        "The Identify spell does NOT automatically reveal whether an item is cursed. The DM may choose to reveal the curse or may not — this is intentional in the RAW.",
    },
    attunement: {
      description:
        "The curse is typically revealed only after attunement occurs. The creature becomes aware something is wrong but may not know the full extent.",
    },
    hints: [
      "A DM may give hints through history checks, lore, or NPC knowledge before a player attunes.",
      "Detect Magic reveals an item is magical but not its nature.",
      "Legend Lore may reveal curses on sufficiently famous or infamous items.",
    ],
  },

  exampleCursedItems: [
    {
      name: "Berserker Axe",
      effect:
        "When you attack with the axe, you may go berserk, attacking the nearest creature other than yourself. Curse persists until Remove Curse is cast.",
    },
    {
      name: "Necklace of Strangulation",
      effect:
        "When placed around a neck, it tightens until the wearer dies or a Remove Curse spell is cast. 6d6 damage per round.",
    },
    {
      name: "Sword of Vengeance",
      effect:
        "You must attack each round if able. You have disadvantage on attack rolls with other weapons. Remove Curse ends the curse.",
    },
    {
      name: "Armor of Vulnerability",
      effect:
        "Appears as +1 armor. Grants resistance to one damage type but vulnerability to two others. Curse is revealed on attunement.",
    },
    {
      name: "Helm of Brilliance (cursed variant)",
      effect:
        "Any undead within 60 ft that can see you must succeed on a DC 10 Wisdom saving throw or be turned, but the wearer is also compelled to attack the living if they fail a DC 15 Wisdom save.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Determine whether a character can attune to an additional item.
 *
 * @param {number} currentSlots - Number of items currently attuned.
 * @param {number} maxSlots     - Maximum attunement slots available to this character.
 * @returns {{ canAttune: boolean, reason: string }}
 */
export function canAttune(currentSlots, maxSlots) {
  if (typeof currentSlots !== "number" || typeof maxSlots !== "number") {
    return { canAttune: false, reason: "Invalid slot values provided." };
  }
  if (currentSlots < 0 || maxSlots < 1) {
    return { canAttune: false, reason: "Slot values are out of range." };
  }
  if (currentSlots >= maxSlots) {
    return {
      canAttune: false,
      reason: `All ${maxSlots} attunement slot(s) are occupied. End attunement with another item first.`,
    };
  }
  const slotsRemaining = maxSlots - currentSlots;
  return {
    canAttune: true,
    reason: `${slotsRemaining} attunement slot(s) available (${currentSlots}/${maxSlots} used).`,
  };
}

/**
 * Get the maximum number of attunement slots for a character.
 * Handles standard characters (3 slots) and Artificers (up to 6).
 *
 * @param {string} characterClass - The character's class (case-insensitive).
 * @param {number} level          - The character's current level (1–20).
 * @returns {number} Maximum attunement slots.
 */
export function getMaxAttunementSlots(characterClass, level) {
  const normalizedClass = (characterClass || "").toLowerCase().trim();
  const clampedLevel = Math.min(Math.max(parseInt(level, 10) || 1, 1), 20);

  if (normalizedClass === "artificer") {
    if (clampedLevel >= 18) return 6;
    if (clampedLevel >= 14) return 5;
    if (clampedLevel >= 10) return 4;
    return 3;
  }

  return ATTUNEMENT_RULES.maxSlots; // 3 for all other classes
}

/**
 * Check whether a character meets a specific item's attunement requirements.
 *
 * @param {Object} item      - The magic item to check.
 *   @param {boolean}  item.requiresAttunement
 *   @param {string}   [item.attunementRequirement] - e.g. "paladin", "spellcaster", "good alignment"
 *   @param {string[]} [item.allowedClasses]         - e.g. ["sorcerer","wizard","warlock"]
 *   @param {string[]} [item.allowedAlignments]      - e.g. ["lawful good","neutral good","chaotic good"]
 *   @param {string[]} [item.allowedRaces]            - e.g. ["dwarf"]
 *   @param {boolean}  [item.spellcasterOnly]
 * @param {Object} character - The character attempting to attune.
 *   @param {string}   character.class
 *   @param {string}   [character.subclass]
 *   @param {string}   [character.alignment]
 *   @param {string}   [character.race]
 *   @param {boolean}  [character.canCastSpells]
 * @returns {{ eligible: boolean, reasons: string[] }}
 */
export function checkAttunementRequirements(item, character) {
  if (!item || !character) {
    return { eligible: false, reasons: ["Missing item or character data."] };
  }

  if (!item.requiresAttunement) {
    return { eligible: true, reasons: ["This item does not require attunement."] };
  }

  const reasons = [];
  let eligible = true;

  const charClass = (character.class || "").toLowerCase().trim();
  const charRace = (character.race || "").toLowerCase().trim();
  const charAlignment = (character.alignment || "").toLowerCase().trim();

  // Allowed classes check
  if (item.allowedClasses && item.allowedClasses.length > 0) {
    const allowed = item.allowedClasses.map((c) => c.toLowerCase().trim());
    if (!allowed.includes(charClass)) {
      eligible = false;
      reasons.push(
        `Class requirement not met. Allowed classes: ${item.allowedClasses.join(", ")}.`
      );
    }
  }

  // Allowed alignments check
  if (item.allowedAlignments && item.allowedAlignments.length > 0) {
    const allowed = item.allowedAlignments.map((a) => a.toLowerCase().trim());
    if (!allowed.includes(charAlignment)) {
      eligible = false;
      reasons.push(
        `Alignment requirement not met. Allowed alignments: ${item.allowedAlignments.join(", ")}.`
      );
    }
  }

  // Allowed races check
  if (item.allowedRaces && item.allowedRaces.length > 0) {
    const allowed = item.allowedRaces.map((r) => r.toLowerCase().trim());
    if (!allowed.includes(charRace)) {
      eligible = false;
      reasons.push(
        `Race requirement not met. Allowed races: ${item.allowedRaces.join(", ")}.`
      );
    }
  }

  // Spellcaster check
  if (item.spellcasterOnly && !character.canCastSpells) {
    eligible = false;
    reasons.push("This item requires attunement by a spellcaster.");
  }

  if (eligible) {
    reasons.push("Character meets all attunement requirements.");
  }

  return { eligible, reasons };
}

/**
 * Inspect a list of currently attuned items and return relevant warnings.
 *
 * @param {Object[]} attunedItems - Array of attuned item objects.
 *   Each item may include: { name, isCursed, requiresShortRest, distance, lastSeenDistance }
 * @returns {string[]} Array of warning messages (may be empty).
 */
export function getAttunementWarnings(attunedItems) {
  if (!Array.isArray(attunedItems)) return [];

  const warnings = [];

  attunedItems.forEach((item) => {
    if (!item) return;

    // Cursed item warning
    if (item.isCursed) {
      warnings.push(
        `"${item.name}" is cursed. Attunement cannot be ended voluntarily — Remove Curse is required.`
      );
    }

    // Distance warning
    if (
      typeof item.lastSeenDistance === "number" &&
      item.lastSeenDistance > 100
    ) {
      warnings.push(
        `"${item.name}" is more than 100 feet away. If separated for 24 hours, attunement will end automatically.`
      );
    }

    // Duplicate type warning
    // (Caller should flag items with the same type if stacking is not intended)
    if (item.stackingNote) {
      warnings.push(`"${item.name}": ${item.stackingNote}`);
    }
  });

  return warnings;
}

/**
 * Suggest which currently attuned item(s) to de-attune to make room for a new one.
 * Returns an empty array if there is already a free slot.
 *
 * @param {Object[]} attunedItems - Currently attuned items. Each: { name, isCursed, rarity, priority }
 *   priority: optional number (higher = more important to keep). Defaults to 0.
 * @param {Object}  newItem       - The new item to be attuned: { name, rarity }
 * @returns {{ suggestions: string[], canFree: boolean }}
 *   suggestions — ordered list of item names recommended for de-attunement
 *   canFree     — false if all items are cursed (no slot can be freed)
 */
export function suggestDeattunement(attunedItems, newItem) {
  if (!Array.isArray(attunedItems) || attunedItems.length === 0) {
    return { suggestions: [], canFree: true };
  }

  const rarityOrder = {
    common: 1,
    uncommon: 2,
    rare: 3,
    "very rare": 4,
    legendary: 5,
    artifact: 6,
  };

  const uncursed = attunedItems.filter((item) => !item.isCursed);

  if (uncursed.length === 0) {
    return {
      suggestions: [],
      canFree: false,
    };
  }

  // Sort by priority (ascending) then rarity (ascending) — lowest priority/rarity suggested first
  const sorted = [...uncursed].sort((a, b) => {
    const aPriority = typeof a.priority === "number" ? a.priority : 0;
    const bPriority = typeof b.priority === "number" ? b.priority : 0;
    if (aPriority !== bPriority) return aPriority - bPriority;

    const aRarity = rarityOrder[(a.rarity || "").toLowerCase()] || 0;
    const bRarity = rarityOrder[(b.rarity || "").toLowerCase()] || 0;
    return aRarity - bRarity;
  });

  const suggestions = sorted.map(
    (item) =>
      `De-attune from "${item.name}"` +
      (item.rarity ? ` (${item.rarity})` : "") +
      (typeof item.priority === "number" ? ` [priority: ${item.priority}]` : "")
  );

  if (newItem && newItem.name) {
    suggestions.unshift(
      `To attune to "${newItem.name}", consider de-attuning one of the following:`
    );
  }

  return { suggestions, canFree: true };
}
