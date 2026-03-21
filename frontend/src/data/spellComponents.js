/**
 * @file spellComponents.js
 * @description Spell component tracking data and helpers for D&D 5e.
 *
 * Roadmap items covered:
 *   - 101: Spell component tracking (V/S/M components, focus substitution, costly components)
 *
 * No React imports. Pure data and utility exports only.
 */

// ---------------------------------------------------------------------------
// 1. COMPONENT TYPES
// ---------------------------------------------------------------------------

/**
 * The three standard spell component types in D&D 5e.
 * Each entry describes what the component requires during casting.
 */
export const COMPONENT_TYPES = {
  V: {
    key: "V",
    label: "Verbal",
    description:
      "Must speak aloud. Cannot cast in an area of magical silence (e.g., the Silence spell) or if the caster is unable to speak.",
    preventedBy: ["silence", "unable to speak"],
    canBeSubstitutedByFocus: false,
  },
  S: {
    key: "S",
    label: "Somatic",
    description:
      "Requires at least one free hand to perform the gestures. Cannot cast if both hands are restrained or occupied.",
    preventedBy: ["both hands restrained", "hands full without War Caster feat"],
    canBeSubstitutedByFocus: false,
    feat_exception: "War Caster — allows somatic components while holding weapons/shields",
  },
  M: {
    key: "M",
    label: "Material",
    description:
      "Requires a material component, component pouch, or arcane/druidic/holy focus. " +
      "Specific costly or consumed components can never be replaced by a focus.",
    preventedBy: ["no component pouch", "no arcane focus", "missing specific consumed component"],
    canBeSubstitutedByFocus: true,
    focusSubstitutionNote:
      "A focus replaces non-costly, non-consumed M components only. " +
      "If the component has a stated gold cost or is consumed by the spell, the physical item is always required.",
  },
};

// ---------------------------------------------------------------------------
// 2. ARCANE FOCUS TYPES
// ---------------------------------------------------------------------------

/**
 * Valid arcane focus items. Any of these can substitute for non-costly, non-consumed
 * material components for classes listed in `classes`.
 */
export const ARCANE_FOCUS_TYPES = {
  staff: {
    key: "staff",
    label: "Staff",
    costGp: 5,
    weightLbs: 4,
    classes: ["Wizard", "Sorcerer", "Warlock", "Druid", "Bard"],
    description: "A wooden staff that can be wielded as a quarterstaff.",
  },
  wand: {
    key: "wand",
    label: "Wand",
    costGp: 10,
    weightLbs: 1,
    classes: ["Wizard", "Sorcerer", "Warlock", "Bard"],
    description: "A slender rod of wood, bone, or other material about 15 inches long.",
  },
  rod: {
    key: "rod",
    label: "Rod",
    costGp: 10,
    weightLbs: 2,
    classes: ["Sorcerer", "Warlock", "Wizard"],
    description: "A solid metal or wooden rod, roughly 2 feet long.",
  },
  orb: {
    key: "orb",
    label: "Orb",
    costGp: 20,
    weightLbs: 3,
    classes: ["Sorcerer", "Warlock", "Wizard"],
    description: "A glass or crystal sphere used to channel arcane magic.",
  },
  crystal: {
    key: "crystal",
    label: "Crystal",
    costGp: 10,
    weightLbs: 1,
    classes: ["Sorcerer", "Wizard"],
    description: "A naturally occurring or cut crystal used as a spellcasting focus.",
  },
  component_pouch: {
    key: "component_pouch",
    label: "Component Pouch",
    costGp: 25,
    weightLbs: 2,
    classes: [
      "Artificer",
      "Bard",
      "Cleric",
      "Druid",
      "Paladin",
      "Ranger",
      "Sorcerer",
      "Warlock",
      "Wizard",
    ],
    description:
      "A small, watertight leather belt pouch containing all necessary material components " +
      "and other special items to cast spells (except costly/consumed components).",
  },
};

// ---------------------------------------------------------------------------
// 3. HOLY SYMBOL TYPES
// ---------------------------------------------------------------------------

/**
 * Holy symbol focus items used by divine spellcasters.
 * Can substitute for non-costly, non-consumed M components.
 */
export const HOLY_SYMBOL_TYPES = {
  amulet: {
    key: "amulet",
    label: "Amulet",
    costGp: 5,
    weightLbs: 1,
    classes: ["Cleric", "Paladin"],
    description:
      "An amulet emblazoned with a symbol of a deity. Can be worn or held.",
  },
  emblem: {
    key: "emblem",
    label: "Emblem",
    costGp: 5,
    weightLbs: 0,
    classes: ["Cleric", "Paladin"],
    description:
      "A symbol embossed or inlaid on a shield or armor. Does not require a free hand " +
      "when emblazoned on a shield the caster is already wielding.",
  },
  reliquary: {
    key: "reliquary",
    label: "Reliquary",
    costGp: 5,
    weightLbs: 2,
    classes: ["Cleric", "Paladin"],
    description:
      "A small chest, box, or reliquary containing holy relics of the deity.",
  },
};

// ---------------------------------------------------------------------------
// 4. DRUIDIC FOCUS TYPES
// ---------------------------------------------------------------------------

/**
 * Druidic focus items used by Druids as material component substitutes.
 * Can substitute for non-costly, non-consumed M components.
 */
export const DRUIDIC_FOCUS_TYPES = {
  sprig_of_mistletoe: {
    key: "sprig_of_mistletoe",
    label: "Sprig of Mistletoe",
    costGp: 1,
    weightLbs: 0,
    classes: ["Druid"],
    description:
      "A fresh or dried sprig of mistletoe, sacred to many druid traditions.",
  },
  totem: {
    key: "totem",
    label: "Totem",
    costGp: 1,
    weightLbs: 0,
    classes: ["Druid"],
    description:
      "A small carved figure of an animal, plant, or natural object imbued with spiritual significance.",
  },
  wooden_staff: {
    key: "wooden_staff",
    label: "Wooden Staff",
    costGp: 5,
    weightLbs: 4,
    classes: ["Druid"],
    description:
      "A staff carved from the wood of a living tree, serving as both a focus and a walking stick.",
  },
  yew_wand: {
    key: "yew_wand",
    label: "Yew Wand",
    costGp: 10,
    weightLbs: 1,
    classes: ["Druid"],
    description:
      "A wand made from yew wood, prized for its connection to both life and death in druidic lore.",
  },
};

// ---------------------------------------------------------------------------
// 5. COSTLY COMPONENTS
// ---------------------------------------------------------------------------

/**
 * Spells that require specific material components with a gold cost.
 * These components CANNOT be replaced by a focus or component pouch.
 * `consumed` indicates whether the component is destroyed when the spell is cast.
 */
export const COSTLY_COMPONENTS = [
  {
    spellName: "Chromatic Orb",
    level: 1,
    costGp: 50,
    component: "A diamond worth at least 50 gp",
    consumed: false,
  },
  {
    spellName: "Find Familiar",
    level: 1,
    costGp: 10,
    component: "10 gp worth of charcoal, incense, and herbs that must be consumed by fire in a brass brazier",
    consumed: true,
  },
  {
    spellName: "Identify",
    level: 1,
    costGp: 100,
    component: "A pearl worth at least 100 gp and an owl feather",
    consumed: false,
  },
  {
    spellName: "Arcane Lock",
    level: 2,
    costGp: 25,
    component: "Gold dust worth at least 25 gp, which the spell consumes",
    consumed: true,
  },
  {
    spellName: "Continual Flame",
    level: 2,
    costGp: 50,
    component: "Ruby dust worth 50 gp, which the spell consumes",
    consumed: true,
  },
  {
    spellName: "Revivify",
    level: 3,
    costGp: 300,
    component: "Diamonds worth at least 300 gp, which the spell consumes",
    consumed: true,
  },
  {
    spellName: "Glyph of Warding",
    level: 3,
    costGp: 200,
    component: "Incense and powdered diamond worth at least 200 gp, which the spell consumes",
    consumed: true,
  },
  {
    spellName: "Stoneskin",
    level: 4,
    costGp: 100,
    component: "Diamond dust worth 100 gp, which the spell consumes",
    consumed: true,
  },
  {
    spellName: "Heroes' Feast",
    level: 6,
    costGp: 1000,
    component: "A gem-encrusted bowl worth at least 1,000 gp, which the spell consumes",
    consumed: true,
  },
  {
    spellName: "Scrying",
    level: 5,
    costGp: 1000,
    component: "A focus worth at least 1,000 gp, such as a crystal ball, a silver mirror, or a font filled with holy water",
    consumed: false,
  },
  {
    spellName: "Greater Restoration",
    level: 5,
    costGp: 100,
    component: "Diamond dust worth at least 100 gp, which the spell consumes",
    consumed: true,
  },
  {
    spellName: "Raise Dead",
    level: 5,
    costGp: 500,
    component: "A diamond worth at least 500 gp, which the spell consumes",
    consumed: true,
  },
  {
    spellName: "Symbol",
    level: 7,
    costGp: 1000,
    component:
      "Mercury, phosphorus, and powdered diamond and opal with a total value of at least 1,000 gp, which the spell consumes",
    consumed: true,
  },
  {
    spellName: "Simulacrum",
    level: 7,
    costGp: 1500,
    component:
      "Snow or ice in quantities sufficient to made a life-size copy of the duplicated creature; some hair, fingernail clippings, or other piece of the creature's body placed inside the snow or ice; and powdered ruby worth 1,500 gp, sprinkled over the duplicate and consumed by the spell",
    consumed: true,
  },
  {
    spellName: "Clone",
    level: 8,
    costGp: 3000,
    component:
      "A diamond worth at least 1,000 gp and at least 1 cubic inch of flesh of the creature that is to be cloned, which the spell consumes; and a vessel worth at least 2,000 gp that has a sealable lid and is large enough to hold a Medium creature",
    consumed: true,
  },
  {
    spellName: "Resurrection",
    level: 7,
    costGp: 1000,
    component: "A diamond worth at least 1,000 gp, which the spell consumes",
    consumed: true,
  },
  {
    spellName: "Astral Projection",
    level: 9,
    costGp: 1100,
    component:
      "For each creature you affect: a jacinth worth at least 1,000 gp and one ornately carved bar of silver worth at least 100 gp, all of which the spell consumes",
    consumed: true,
  },
  {
    spellName: "Gate",
    level: 9,
    costGp: 5000,
    component: "A diamond worth at least 5,000 gp",
    consumed: false,
  },
  {
    spellName: "True Resurrection",
    level: 9,
    costGp: 25000,
    component: "A sprinkle of holy water and diamonds worth at least 25,000 gp, which the spell consumes",
    consumed: true,
  },
  {
    spellName: "Wish",
    level: 9,
    costGp: 0,
    component: "None — the most powerful spell in existence requires no material component",
    consumed: false,
  },
];

// ---------------------------------------------------------------------------
// 6. COMPONENT RULES
// ---------------------------------------------------------------------------

/**
 * Rules governing component substitution, feats, and class features.
 */
export const COMPONENT_RULES = {
  focusSubstitution: {
    title: "Arcane/Holy/Druidic Focus Substitution",
    rule:
      "A spellcasting focus can substitute for any material component that does not have a " +
      "listed gold cost and is not consumed by the spell. If a component has a gold cost " +
      "(e.g., '100 gp diamond') or is consumed, the physical item is always required regardless of focus.",
    applies_to: "M components with no cost and not consumed",
    does_not_apply_to: "M components with a gold cost, or components that are consumed",
  },
  warCaster: {
    title: "War Caster Feat",
    rule:
      "A creature with the War Caster feat can perform the somatic components of a spell even " +
      "when it has weapons or a shield in one or both hands. This removes the 'free hand required' " +
      "restriction for S components.",
    feat: "War Caster",
    applies_to: "S components",
  },
  subtleSpell: {
    title: "Subtle Spell (Sorcerer Metamagic)",
    rule:
      "When the sorcerer casts a spell using Subtle Spell, they can cast without verbal (V) or " +
      "somatic (S) components. This is particularly useful in situations where speaking or gesturing " +
      "would give away spellcasting.",
    metamagic: "Subtle Spell",
    applies_to: "V and S components",
    sorcery_point_cost: 1,
  },
  componentPouch: {
    title: "Component Pouch",
    rule:
      "A component pouch is a small, watertight leather belt pouch that has compartments to hold " +
      "all the material components and other special items you need to cast your spells, " +
      "except for components that have a specific cost. It functions as a focus substitute for " +
      "all classes listed in ARCANE_FOCUS_TYPES.component_pouch.",
  },
  emblemShield: {
    title: "Holy Symbol as Shield Emblem",
    rule:
      "A Cleric or Paladin can use a holy symbol emblazoned on a shield as a spellcasting focus. " +
      "The caster needs a free hand to cast spells with somatic components, but the hand holding " +
      "the shield counts as free for holy symbol purposes — allowing the shield + emblem to serve " +
      "as the focus without an additional free hand.",
    applies_to: "Cleric, Paladin using emblem focus type",
  },
};

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Returns component requirements for a spell by name.
 * Checks COSTLY_COMPONENTS for known spells; for unknown spells returns null.
 *
 * @param {string} spellName - The name of the spell to look up.
 * @returns {{ costGp: number, component: string, consumed: boolean, level: number } | null}
 */
export function getComponentRequirements(spellName) {
  if (!spellName || typeof spellName !== "string") return null;
  const normalized = spellName.trim().toLowerCase();
  const found = COSTLY_COMPONENTS.find(
    (entry) => entry.spellName.toLowerCase() === normalized
  );
  return found ?? null;
}

/**
 * Determines whether a given focus type can substitute material components
 * for a specific spell and character class.
 *
 * Returns false if the spell has a costly/consumed component — a focus never
 * replaces those. Returns true if the spell is unknown (no cost entry) and
 * the focus is valid for the class.
 *
 * @param {string} spellName - Name of the spell.
 * @param {string} focusType - Key from ARCANE_FOCUS_TYPES, HOLY_SYMBOL_TYPES, or DRUIDIC_FOCUS_TYPES.
 * @param {string} characterClass - The character's class (e.g. "Wizard", "Cleric").
 * @returns {{ canUse: boolean, reason: string }}
 */
export function canUseFocus(spellName, focusType, characterClass) {
  if (!spellName || !focusType || !characterClass) {
    return { canUse: false, reason: "Missing spellName, focusType, or characterClass." };
  }

  // Check if the spell has a costly or consumed component
  const requirement = getComponentRequirements(spellName);
  if (requirement) {
    if (requirement.consumed) {
      return {
        canUse: false,
        reason: `${spellName} requires a consumed component (${requirement.component}). A focus cannot replace it.`,
      };
    }
    if (requirement.costGp > 0) {
      return {
        canUse: false,
        reason: `${spellName} requires a component worth at least ${requirement.costGp} gp (${requirement.component}). A focus cannot replace it.`,
      };
    }
  }

  // Look up the focus across all focus type dictionaries
  const allFocusTypes = {
    ...ARCANE_FOCUS_TYPES,
    ...HOLY_SYMBOL_TYPES,
    ...DRUIDIC_FOCUS_TYPES,
  };

  const focusKey = focusType.toLowerCase().replace(/\s+/g, "_");
  const focus = allFocusTypes[focusKey];

  if (!focus) {
    return { canUse: false, reason: `Unknown focus type: "${focusType}".` };
  }

  const classAllowed = focus.classes.some(
    (cls) => cls.toLowerCase() === characterClass.trim().toLowerCase()
  );

  if (!classAllowed) {
    return {
      canUse: false,
      reason: `${characterClass} cannot use a ${focus.label} as a spellcasting focus. Allowed classes: ${focus.classes.join(", ")}.`,
    };
  }

  return {
    canUse: true,
    reason: `${characterClass} can use a ${focus.label} as a focus to replace the material component for ${spellName}.`,
  };
}

/**
 * Returns all costly component entries at or below a given spell level.
 * Pass Infinity (or omit) to get all costly components.
 *
 * @param {number} [maxLevel=Infinity] - Maximum spell level to include.
 * @returns {Array<{ spellName: string, level: number, costGp: number, component: string, consumed: boolean }>}
 */
export function getCostlyComponents(maxLevel = Infinity) {
  if (typeof maxLevel !== "number" || maxLevel < 0) return [];
  return COSTLY_COMPONENTS.filter((entry) => entry.level <= maxLevel);
}

/**
 * Returns whether a spell's material component is consumed when cast.
 * Returns null if the spell is not found in COSTLY_COMPONENTS.
 *
 * @param {string} spellName - Name of the spell.
 * @returns {boolean | null}
 */
export function isComponentConsumed(spellName) {
  if (!spellName || typeof spellName !== "string") return null;
  const entry = getComponentRequirements(spellName);
  if (!entry) return null;
  return entry.consumed;
}

/**
 * Returns all valid focus options for a given character class,
 * pulled from arcane, holy symbol, and druidic focus type dictionaries.
 *
 * @param {string} characterClass - The character's class (e.g. "Druid", "Paladin").
 * @returns {Array<{ key: string, label: string, costGp: number, weightLbs: number, description: string }>}
 */
export function getFocusOptions(characterClass) {
  if (!characterClass || typeof characterClass !== "string") return [];

  const normalizedClass = characterClass.trim().toLowerCase();
  const allFocusTypes = {
    ...ARCANE_FOCUS_TYPES,
    ...HOLY_SYMBOL_TYPES,
    ...DRUIDIC_FOCUS_TYPES,
  };

  return Object.values(allFocusTypes).filter((focus) =>
    focus.classes.some((cls) => cls.toLowerCase() === normalizedClass)
  );
}
