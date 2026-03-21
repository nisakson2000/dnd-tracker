/**
 * poisonSystem.js
 * D&D 5e Poison System Data & Helpers
 *
 * Roadmap Items Covered:
 * - Item 23: Disease/Poison Tracking
 *   - Poison type classification (Contact, Ingested, Inhaled, Injury)
 *   - Sample poisons from DMG with stats, cost, save DCs, and effects
 *   - Poison crafting rules (Poisoner's Kit, proficiency, harvest DCs)
 *   - Poison resistance/immunity by race and class feature
 *   - Antidote and countermeasure options
 *   - Helper functions for lookup, filtering, and resistance checking
 */

// ─────────────────────────────────────────────────────────────────────────────
// POISON TYPES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The four delivery categories for poisons in D&D 5e (DMG p. 257).
 * Each entry describes how the poison is applied, when the saving throw occurs,
 * and what kinds of effects are typical for that category.
 */
export const POISON_TYPES = {
  CONTACT: {
    id: "contact",
    label: "Contact",
    deliveryMethod:
      "Applied to a surface or object; takes effect when a creature touches it with bare skin.",
    saveTiming:
      "CON saving throw triggered immediately upon skin contact.",
    typicalEffects: [
      "Paralysis",
      "Poisoned condition",
      "Ability damage (usually STR or CON)",
    ],
    saveAbility: "CON",
    notes:
      "Gloves or other protective coverings generally prevent exposure. Contact poisons can be applied to weapons, door handles, or treasure items.",
  },

  INGESTED: {
    id: "ingested",
    label: "Ingested",
    deliveryMethod:
      "Must be eaten or drunk; often mixed into food, drink, or medicine.",
    saveTiming:
      "CON saving throw after ingestion — onset may be immediate or delayed (minutes to hours depending on the poison).",
    typicalEffects: [
      "Poisoned condition",
      "Unconsciousness",
      "Necrotic or poison damage",
      "Compelled truth-telling",
      "Repeated damage over multiple saves",
    ],
    saveAbility: "CON",
    notes:
      "Some ingested poisons have a delayed onset, making them ideal for assassination. A creature must actually swallow the substance — merely tasting it may not trigger the effect.",
  },

  INHALED: {
    id: "inhaled",
    label: "Inhaled",
    deliveryMethod:
      "Released as a gas, powder, or cloud; affects creatures that breathe it in.",
    saveTiming:
      "CON saving throw upon breathing the substance; typically affects an area (e.g., 5-foot cube).",
    typicalEffects: [
      "Poisoned condition",
      "Blindness",
      "Unconsciousness",
      "Poison damage",
      "Repeat saves on subsequent turns",
    ],
    saveAbility: "CON",
    notes:
      "Creatures that don't need to breathe (undead, constructs, etc.) are immune to inhaled poisons. Holding one's breath or using a mask may grant protection at the DM's discretion.",
  },

  INJURY: {
    id: "injury",
    label: "Injury",
    deliveryMethod:
      "Coated on a weapon or ammunition; delivered when the weapon deals damage.",
    saveTiming:
      "CON saving throw triggered when the coated weapon hits and deals damage to a creature.",
    typicalEffects: [
      "Poison damage",
      "Poisoned condition",
      "Unconsciousness",
      "Paralysis",
    ],
    saveAbility: "CON",
    notes:
      "One dose of injury poison coats one slashing or piercing weapon or up to three pieces of ammunition. The poison remains potent for 1 minute before drying. The applier risks accidental exposure on a fumble (optional rule).",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SAMPLE POISONS (DMG p. 258–259)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fourteen poisons from the Dungeon Master's Guide, each with mechanical stats
 * suitable for tracking in-session or for the poison crafting/purchasing system.
 *
 * Fields:
 *  name        — official poison name
 *  type        — one of "contact" | "ingested" | "inhaled" | "injury"
 *  costGp      — market price in gold pieces
 *  saveDC      — Constitution saving throw DC
 *  onFail      — effect(s) on a failed save (string description)
 *  onSuccess   — effect(s) on a successful save, if any
 *  duration    — how long the effect lasts (string)
 *  damage      — dice expression string if the poison deals damage, else null
 *  conditions  — array of conditions imposed on failed save
 *  repeating   — whether the creature must re-save on subsequent turns/intervals
 *  notes       — additional mechanical or flavour notes
 */
export const SAMPLE_POISONS = [
  {
    name: "Assassin's Blood",
    type: "ingested",
    costGp: 150,
    saveDC: 10,
    onFail: "Takes 1d12 poison damage and becomes poisoned for 24 hours.",
    onSuccess: "Takes 6 (1d12) poison damage only.",
    duration: "24 hours (poisoned condition)",
    damage: "1d12",
    conditions: ["poisoned"],
    repeating: false,
    notes:
      "One of the cheaper ingested poisons; reliable for low-budget assassinations. The low DC makes it less effective against hardy targets.",
  },
  {
    name: "Burnt Othur Fumes",
    type: "inhaled",
    costGp: 500,
    saveDC: 13,
    onFail:
      "Takes 3d6 poison damage and must repeat the saving throw at the start of each of its turns. On each successive failed save, takes 1d6 poison damage. Three consecutive successful saves end the effect.",
    onSuccess: "No effect.",
    duration: "Until three consecutive successful CON saves",
    damage: "3d6 (initial), 1d6 (per subsequent failed save)",
    conditions: [],
    repeating: true,
    notes:
      "Particularly dangerous in enclosed spaces. The repeating damage can accumulate quickly against creatures with a poor Constitution modifier.",
  },
  {
    name: "Crawler Mucus",
    type: "contact",
    costGp: 200,
    saveDC: 13,
    onFail:
      "Becomes poisoned and paralyzed for 1 minute. May repeat the save at the end of each of its turns, ending both conditions on success.",
    onSuccess: "No effect.",
    duration: "1 minute (or until successful save)",
    damage: null,
    conditions: ["poisoned", "paralyzed"],
    repeating: true,
    notes:
      "Harvested from a carrion crawler. The paralysis makes this extremely dangerous in combat — paralyzed creatures automatically fail STR and DEX saves and attacks against them have advantage (with melee crits within 5 ft.).",
  },
  {
    name: "Drow Poison",
    type: "injury",
    costGp: 200,
    saveDC: 13,
    onFail:
      "Becomes poisoned and unconscious for 1 hour. Another creature can use an action to shake or slap the unconscious creature awake.",
    onSuccess: "Becomes poisoned only until the end of its next turn.",
    duration: "1 hour (unconscious) / end of next turn (poisoned on success)",
    damage: null,
    conditions: ["poisoned", "unconscious"],
    repeating: false,
    notes:
      "Favoured by drow raiding parties for capturing prisoners. Difficult to obtain on the surface; surface merchants rarely stock it.",
  },
  {
    name: "Essence of Ether",
    type: "inhaled",
    costGp: 300,
    saveDC: 15,
    onFail:
      "Becomes poisoned and unconscious for 8 hours. The creature wakes up if it takes damage.",
    onSuccess: "No effect.",
    duration: "8 hours (or until damaged)",
    damage: null,
    conditions: ["poisoned", "unconscious"],
    repeating: false,
    notes:
      "The long duration makes it useful for incapacitating targets over an extended period. Combat noise nearby will wake the victim.",
  },
  {
    name: "Malice",
    type: "inhaled",
    costGp: 250,
    saveDC: 15,
    onFail: "Becomes poisoned and blinded for 1 hour.",
    onSuccess: "No effect.",
    duration: "1 hour",
    damage: null,
    conditions: ["poisoned", "blinded"],
    repeating: false,
    notes:
      "The blinded condition imposes disadvantage on attack rolls and grants advantage to attackers. Useful for disrupting spellcasters who require line of sight.",
  },
  {
    name: "Midnight Tears",
    type: "ingested",
    costGp: 1500,
    saveDC: 17,
    onFail:
      "Takes 9d6 poison damage at midnight. If the poison has been neutralized before midnight, the creature takes no damage.",
    onSuccess: "Takes half damage.",
    duration: "Until midnight (delayed onset)",
    damage: "9d6",
    conditions: [],
    repeating: false,
    notes:
      "One of the most expensive ingested poisons. The delayed onset until midnight gives the assassin time to establish an alibi. Lesser Restoration or similar magic cast before midnight can neutralise it.",
  },
  {
    name: "Oil of Taggit",
    type: "contact",
    costGp: 400,
    saveDC: 13,
    onFail:
      "Becomes poisoned and unconscious for 24 hours. The creature wakes up if it takes damage.",
    onSuccess: "No effect.",
    duration: "24 hours (or until damaged)",
    damage: null,
    conditions: ["poisoned", "unconscious"],
    repeating: false,
    notes:
      "Effective for long-term incapacitation. The 24-hour duration is the longest unconscious effect among contact poisons in the DMG.",
  },
  {
    name: "Pale Tincture",
    type: "ingested",
    costGp: 250,
    saveDC: 16,
    onFail:
      "Takes 1d6 poison damage and becomes poisoned. The poisoned creature must repeat the saving throw every 24 hours, taking 1d6 poison damage on a failure. The condition and damage end after seven days or if the poison is neutralized.",
    onSuccess: "No effect (on repeat save: no further damage).",
    duration: "Up to 7 days (repeating daily)",
    damage: "1d6 per day",
    conditions: ["poisoned"],
    repeating: true,
    notes:
      "A slow-acting poison — ideal for giving the poisoner time to leave the scene. Difficult to diagnose without magical means.",
  },
  {
    name: "Purple Worm Poison",
    type: "injury",
    costGp: 2000,
    saveDC: 19,
    onFail: "Takes 12d6 poison damage.",
    onSuccess: "Takes half damage.",
    duration: "Instantaneous",
    damage: "12d6",
    conditions: [],
    repeating: false,
    notes:
      "The most powerful and expensive injury poison in the DMG. Harvested from a purple worm. DC 19 is extremely hard to meet without significant CON investment.",
  },
  {
    name: "Serpent Venom",
    type: "injury",
    costGp: 200,
    saveDC: 11,
    onFail: "Takes 3d6 poison damage.",
    onSuccess: "Takes half damage.",
    duration: "Instantaneous",
    damage: "3d6",
    conditions: [],
    repeating: false,
    notes:
      "Harvested from a giant poisonous snake. The low DC and moderate damage make it a budget option for injury poisons; primarily notable for its accessibility.",
  },
  {
    name: "Torpor",
    type: "ingested",
    costGp: 600,
    saveDC: 15,
    onFail:
      "Becomes poisoned and incapacitated for 4d6 hours.",
    onSuccess: "No effect.",
    duration: "4d6 hours",
    damage: null,
    conditions: ["poisoned", "incapacitated"],
    repeating: false,
    notes:
      "The incapacitated condition prevents the creature from taking actions or reactions but does not render it unconscious. Variable duration adds unpredictability.",
  },
  {
    name: "Truth Serum",
    type: "ingested",
    costGp: 150,
    saveDC: 11,
    onFail:
      "Becomes poisoned and unable to speak deliberate lies for 1 hour. A question-and-answer period under a Zone of Truth may stack with this effect.",
    onSuccess: "No effect.",
    duration: "1 hour",
    damage: null,
    conditions: ["poisoned"],
    repeating: false,
    notes:
      "Does not compel the creature to speak — only prevents outright lies. The creature can still remain silent, speak in half-truths, or be misleading without technically lying.",
  },
  {
    name: "Wyvern Poison",
    type: "injury",
    costGp: 1200,
    saveDC: 15,
    onFail: "Takes 7d6 poison damage.",
    onSuccess: "Takes half damage.",
    duration: "Instantaneous",
    damage: "7d6",
    conditions: [],
    repeating: false,
    notes:
      "Harvested from a wyvern's stinger. Strong damage output at a mid-tier price point. Popular among well-funded assassins as a more accessible alternative to Purple Worm Poison.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// POISON CRAFTING (DMG p. 258, XGE p. 134)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Rules and requirements for crafting or harvesting poisons using a
 * Poisoner's Kit, per DMG/XGE guidelines.
 */
export const POISON_CRAFTING = {
  tool: {
    name: "Poisoner's Kit",
    costGp: 50,
    weight: "2 lb.",
    description:
      "A poisoner's kit includes the vials, chemicals, and other equipment necessary for the creation of poisons. Proficiency with this kit lets you add your proficiency bonus to any ability checks you make to craft or use poisons.",
    proficiencyRequired: true,
    associatedSkills: ["Nature", "Medicine"],
  },

  craftingRules: {
    costToCraft: "Half the market price of the poison (rounded down to nearest gp).",
    timePerGpValue:
      "1 workday (8 hours) per 25 gp of the poison's market value.",
    toolRequired: "Poisoner's Kit",
    proficiencyRequired: true,
    checkRequired: false,
    notes:
      "No ability check is required to craft a poison if you have proficiency with a Poisoner's Kit — only time and materials. Checks may be required for harvesting from monsters (see below).",
  },

  harvestingRules: {
    description:
      "A character can attempt to harvest poison from a dead or incapacitated poisonous creature. The creature must have a natural poison (e.g., giant spider, wyvern, purple worm).",
    check: "DC set by the DM (typically DC 10–20 Nature or Medicine check)",
    toolRequired: "Poisoner's Kit (proficiency recommended)",
    onSuccess: "Harvests one dose of the creature's poison.",
    onFailByFive:
      "On a failure of 5 or more, the harvester is accidentally exposed to the poison.",
    typicalDCs: [
      { creature: "Giant Poisonous Snake", dc: 10, poison: "Serpent Venom" },
      { creature: "Giant Spider", dc: 12, poison: "Spider Venom (DM discretion)" },
      { creature: "Wyvern", dc: 15, poison: "Wyvern Poison" },
      { creature: "Purple Worm", dc: 20, poison: "Purple Worm Poison" },
    ],
  },

  craftingTimeByPoison: {
    "Assassin's Blood":   { marketPriceGp: 150,  craftCostGp: 75,   workdays: 6  },
    "Burnt Othur Fumes":  { marketPriceGp: 500,  craftCostGp: 250,  workdays: 20 },
    "Crawler Mucus":      { marketPriceGp: 200,  craftCostGp: 100,  workdays: 8  },
    "Drow Poison":        { marketPriceGp: 200,  craftCostGp: 100,  workdays: 8  },
    "Essence of Ether":   { marketPriceGp: 300,  craftCostGp: 150,  workdays: 12 },
    "Malice":             { marketPriceGp: 250,  craftCostGp: 125,  workdays: 10 },
    "Midnight Tears":     { marketPriceGp: 1500, craftCostGp: 750,  workdays: 60 },
    "Oil of Taggit":      { marketPriceGp: 400,  craftCostGp: 200,  workdays: 16 },
    "Pale Tincture":      { marketPriceGp: 250,  craftCostGp: 125,  workdays: 10 },
    "Purple Worm Poison": { marketPriceGp: 2000, craftCostGp: 1000, workdays: 80 },
    "Serpent Venom":      { marketPriceGp: 200,  craftCostGp: 100,  workdays: 8  },
    "Torpor":             { marketPriceGp: 600,  craftCostGp: 300,  workdays: 24 },
    "Truth Serum":        { marketPriceGp: 150,  craftCostGp: 75,   workdays: 6  },
    "Wyvern Poison":      { marketPriceGp: 1200, craftCostGp: 600,  workdays: 48 },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// POISON RESISTANCE & IMMUNITY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Races, subraces, and class features that grant resistance or immunity to
 * poison damage and/or the poisoned condition, per the 2014 PHB/DMG rules.
 */
export const POISON_RESISTANCE = {
  immune: [
    {
      source: "Monk — Purity of Body (10th level)",
      type: "immunity",
      appliesTo: ["poison damage", "poisoned condition"],
      notes:
        "At 10th level, a monk's mastery of the ki flowing through them makes them immune to disease and poison.",
    },
    {
      source: "Paladin — Divine Health (3rd level)",
      type: "immunity",
      appliesTo: ["disease"],
      notes:
        "Divine Health (PHB p. 85) grants immunity to disease, not poison. See Antidotes section for Paladin poison mitigation.",
    },
    {
      source: "Undead creatures",
      type: "immunity",
      appliesTo: ["poison damage", "poisoned condition"],
      notes: "All undead are immune to poison damage and the poisoned condition.",
    },
    {
      source: "Constructs",
      type: "immunity",
      appliesTo: ["poison damage", "poisoned condition"],
      notes: "All constructs are immune to poison damage and the poisoned condition.",
    },
    {
      source: "Poison Immunity (monster trait)",
      type: "immunity",
      appliesTo: ["poison damage", "poisoned condition"],
      notes:
        "Many monsters (e.g., medusa, yuan-ti) list explicit poison immunity in their stat block.",
    },
  ],

  resistant: [
    {
      source: "Dwarf — Dwarven Resilience (all subraces)",
      type: "resistance",
      appliesTo: ["poison damage"],
      bonus: "Advantage on saving throws against poison",
      notes:
        "Dwarves have advantage on saving throws against poison and resistance to poison damage (PHB p. 20). This applies to all dwarf subraces: Hill Dwarf, Mountain Dwarf, Duergar.",
    },
    {
      source: "Stout Halfling — Stout Resilience",
      type: "resistance",
      appliesTo: ["poison damage"],
      bonus: "Advantage on saving throws against poison",
      notes:
        "Stout halflings have advantage on saving throws against poison and resistance to poison damage (PHB p. 28).",
    },
    {
      source: "Duergar — Duergar Resilience",
      type: "resistance",
      appliesTo: ["poisoned condition"],
      bonus: "Advantage on saving throws against poison",
      notes:
        "Duergar (from the Sword Coast Adventurer's Guide / Mordenkainen's) have advantage on saves against poison, as well as illusions and being charmed or paralyzed.",
    },
    {
      source: "Yuan-ti Pureblood — Poison Immunity",
      type: "immunity",
      appliesTo: ["poison damage", "poisoned condition"],
      notes:
        "Yuan-ti Purebloods (Volo's Guide) are fully immune to poison damage and the poisoned condition.",
    },
    {
      source: "Ranger — Favored Enemy (Poison, optional)",
      type: "advantage",
      appliesTo: ["poisoned condition saves"],
      notes:
        "DM option: Rangers with appropriate Favored Enemy or Natural Explorer features may gain advantage on poison-related saves in some settings.",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// ANTIDOTES & COUNTERMEASURES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Methods to prevent, resist, or cure poison effects in D&D 5e.
 */
export const ANTIDOTES = [
  {
    name: "Antitoxin",
    type: "consumable",
    costGp: 50,
    effect:
      "A creature that drinks this vial of liquid gains advantage on saving throws against poison for 1 hour. It confers no benefit to undead or constructs.",
    duration: "1 hour",
    cures: false,
    preventsOngoingEffect: true,
    notes:
      "Grants advantage on saves — does not end an existing poisoned condition or cure poison damage already dealt. Must be taken before or immediately as a preventive measure.",
    source: "PHB p. 151",
  },
  {
    name: "Lesser Restoration",
    type: "spell",
    spellLevel: 2,
    castingTime: "1 action",
    effect:
      "You touch a creature and can end either one disease or one condition afflicting it. The condition can be blinded, deafened, paralyzed, or poisoned.",
    duration: "Instantaneous",
    cures: true,
    curese: ["poisoned condition"],
    notes:
      "Ends the poisoned condition immediately. Does not restore hit points lost to poison damage. Can also neutralise poisons with a delayed onset (e.g., Midnight Tears before midnight, Pale Tincture mid-course).",
    source: "PHB p. 255",
  },
  {
    name: "Neutralize Poison",
    type: "spell",
    spellLevel: 3,
    castingTime: "1 action",
    effect:
      "You neutralize one poison affecting a creature you touch. If the poison is one that affects the target on a hit (e.g., Drow Poison), you can instead choose one poisonous substance within reach and render it nonpoisonous for the spell's duration.",
    duration: "Instantaneous / up to 8 hours (concentration variant)",
    cures: true,
    cures: ["poisoned condition", "ongoing poison effects"],
    notes:
      "More thorough than Lesser Restoration for complex or repeating poisons. Requires a 3rd-level spell slot.",
    source: "PHB p. 263",
  },
  {
    name: "Periapt of Proof Against Poison",
    type: "wondrous item",
    rarity: "rare",
    attunement: true,
    costGp: null,
    effect:
      "This delicate silver chain has a brilliant-cut black gem pendant. While you wear it, poisons have no effect on you. You are immune to the poisoned condition and have immunity to poison damage.",
    duration: "Permanent (while worn and attuned)",
    cures: false,
    preventsAll: true,
    notes:
      "Full poison immunity — the strongest mundane protection available. Rare item; generally found as treasure rather than purchased.",
    source: "DMG p. 184",
  },
  {
    name: "Paladin — Divine Health (3rd level)",
    type: "class feature",
    classLevel: { class: "Paladin", level: 3 },
    effect:
      "By 3rd level, the divine magic flowing through you makes you immune to disease.",
    duration: "Permanent",
    cures: false,
    preventsOngoingEffect: false,
    notes:
      "Divine Health grants disease immunity only — NOT poison immunity. Paladins still need antitoxin, Neutralize Poison, or a Periapt for poison protection.",
    source: "PHB p. 85",
  },
  {
    name: "Monk — Purity of Body (10th level)",
    type: "class feature",
    classLevel: { class: "Monk", level: 10 },
    effect:
      "At 10th level, your mastery of the ki flowing through you makes you immune to disease and poison.",
    duration: "Permanent",
    cures: false,
    preventsAll: true,
    notes:
      "Full poison immunity at Monk 10. Also grants disease immunity. Does not require attunement or cost gold.",
    source: "PHB p. 79",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns a single poison object by exact name (case-insensitive).
 * @param {string} name - The name of the poison to find.
 * @returns {object|null} The poison object, or null if not found.
 */
export function getPoison(name) {
  if (!name || typeof name !== "string") return null;
  const normalized = name.trim().toLowerCase();
  return (
    SAMPLE_POISONS.find((p) => p.name.toLowerCase() === normalized) || null
  );
}

/**
 * Returns all poisons of a given delivery type.
 * @param {string} type - One of: "contact" | "ingested" | "inhaled" | "injury"
 * @returns {object[]} Array of matching poison objects (may be empty).
 */
export function getPoisonsByType(type) {
  if (!type || typeof type !== "string") return [];
  const normalized = type.trim().toLowerCase();
  return SAMPLE_POISONS.filter((p) => p.type === normalized);
}

/**
 * Returns the Constitution saving throw DC for a named poison.
 * @param {string} poisonName - The name of the poison.
 * @returns {number|null} The save DC, or null if the poison is not found.
 */
export function calculatePoisonDC(poisonName) {
  const poison = getPoison(poisonName);
  return poison ? poison.saveDC : null;
}

/**
 * Returns the crafting requirements for a named poison, including cost,
 * workdays, and tool/proficiency requirements.
 * @param {string} poisonName - The name of the poison to look up.
 * @returns {object|null} Crafting data object, or null if not found.
 */
export function getCraftingRequirements(poisonName) {
  if (!poisonName || typeof poisonName !== "string") return null;
  const normalized = poisonName.trim();
  const entry = POISON_CRAFTING.craftingTimeByPoison[normalized];
  if (!entry) return null;

  return {
    poisonName: normalized,
    marketPriceGp: entry.marketPriceGp,
    craftCostGp: entry.craftCostGp,
    workdays: entry.workdays,
    toolRequired: POISON_CRAFTING.tool.name,
    toolCostGp: POISON_CRAFTING.tool.costGp,
    proficiencyRequired: POISON_CRAFTING.craftingRules.proficiencyRequired,
    checkRequired: POISON_CRAFTING.craftingRules.checkRequired,
    summary: `Crafting ${normalized} requires ${entry.workdays} workday(s), costs ${entry.craftCostGp} gp in materials, and requires a Poisoner's Kit with proficiency.`,
  };
}

/**
 * Checks whether a given race or set of class features confers poison
 * resistance or immunity, and returns the relevant entries.
 *
 * @param {string} [race] - The character's race or subrace (e.g., "Dwarf", "Stout Halfling").
 * @param {string[]} [classFeatures] - Array of class feature names (e.g., ["Purity of Body"]).
 * @returns {{ resistant: object[], immune: object[] }} Object with matched resistance/immunity entries.
 *
 * @example
 * checkPoisonResistance("Dwarf", ["Purity of Body"]);
 * // => { resistant: [{ source: "Dwarf — Dwarven Resilience", ... }], immune: [{ source: "Monk — Purity of Body", ... }] }
 */
export function checkPoisonResistance(race = "", classFeatures = []) {
  const raceLower = (race || "").trim().toLowerCase();
  const featureLower = (classFeatures || []).map((f) =>
    (f || "").trim().toLowerCase()
  );

  const matched = {
    resistant: [],
    immune: [],
  };

  // Check racial resistance
  for (const entry of POISON_RESISTANCE.resistant) {
    const sourceLower = entry.source.toLowerCase();
    if (raceLower && sourceLower.includes(raceLower)) {
      matched.resistant.push(entry);
    }
  }

  // Check racial immunity
  for (const entry of POISON_RESISTANCE.immune) {
    const sourceLower = entry.source.toLowerCase();
    if (raceLower && sourceLower.includes(raceLower)) {
      matched.immune.push(entry);
    }
    // Also check class features
    for (const feature of featureLower) {
      if (feature && sourceLower.includes(feature)) {
        if (!matched.immune.includes(entry)) {
          matched.immune.push(entry);
        }
      }
    }
  }

  // Check class feature resistance
  for (const entry of POISON_RESISTANCE.resistant) {
    const sourceLower = entry.source.toLowerCase();
    for (const feature of featureLower) {
      if (feature && sourceLower.includes(feature)) {
        if (!matched.resistant.includes(entry)) {
          matched.resistant.push(entry);
        }
      }
    }
  }

  return matched;
}

/**
 * Returns all poisons in the system, sorted alphabetically by name.
 * @returns {object[]} Array of all SAMPLE_POISONS entries.
 */
export function getAllPoisons() {
  return [...SAMPLE_POISONS].sort((a, b) => a.name.localeCompare(b.name));
}
