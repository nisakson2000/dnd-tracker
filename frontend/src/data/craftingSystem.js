/**
 * @file craftingSystem.js
 * @description Item crafting mechanics for The Codex — D&D Companion.
 * Covers PHB/DMG standard rules, Xanathar's Guide variant rules, magic item
 * crafting by rarity, complication tables, and sample recipe templates.
 * @see Player's Handbook Ch. 8, Dungeon Master's Guide Ch. 6, Xanathar's Guide to Everything
 */

// =============================================================================
// TOOL PROFICIENCIES
// =============================================================================

/**
 * The 17 artisan tool proficiencies from the PHB.
 * Each entry describes cost, weight, what the tool can craft, and the
 * primary ability score used when making crafting checks.
 */
export const TOOL_PROFICIENCIES = {
  alchemistsSupplies: {
    name: "Alchemist's Supplies",
    cost: 50,
    weight: 8,
    relevantAbility: "Intelligence",
    craftableItems: [
      "Acid",
      "Alchemist's Fire",
      "Antitoxin",
      "Basic Poison",
      "Perfume",
      "Smoke Bomb (homebrew variant)",
    ],
    description:
      "Alchemical equipment used to produce substances that deal damage, restore hit points, or create other effects.",
  },
  brewersSupplies: {
    name: "Brewer's Supplies",
    cost: 20,
    weight: 9,
    relevantAbility: "Wisdom",
    craftableItems: [
      "Ale",
      "Beer",
      "Mead",
      "Wine",
      "Spirits",
      "Herbal Tonics",
    ],
    description:
      "Equipment for fermenting and distilling beverages, including alcoholic drinks and herbal preparations.",
  },
  calligraphersSupplies: {
    name: "Calligrapher's Supplies",
    cost: 10,
    weight: 5,
    relevantAbility: "Dexterity",
    craftableItems: [
      "Spell Scroll (with appropriate spell slot)",
      "Documents",
      "Maps",
      "Illuminated Manuscripts",
      "Forgeries",
    ],
    description:
      "Inks, pens, and paper used for writing spells into scrolls and producing fine documents.",
  },
  carpenterTools: {
    name: "Carpenter's Tools",
    cost: 8,
    weight: 6,
    relevantAbility: "Strength",
    craftableItems: [
      "Club",
      "Greatclub",
      "Quarterstaff",
      "Wooden Shield",
      "Furniture",
      "Structures",
      "Wooden Containers",
    ],
    description:
      "Saws, hammers, and chisels for shaping wood into weapons, shields, furniture, and structures.",
  },
  cartographerTools: {
    name: "Cartographer's Tools",
    cost: 15,
    weight: 6,
    relevantAbility: "Intelligence",
    craftableItems: [
      "Maps",
      "Charts",
      "Navigational Aids",
      "Illustrated Guides",
    ],
    description:
      "Drafting instruments and inks for creating accurate maps and navigational documents.",
  },
  cobblerTools: {
    name: "Cobbler's Tools",
    cost: 5,
    weight: 5,
    relevantAbility: "Dexterity",
    craftableItems: [
      "Boots of Various Kinds",
      "Sandals",
      "Shoes",
      "Leather Straps",
      "Foot Bindings",
    ],
    description:
      "Lasts, hammers, and awls used to craft and repair footwear.",
  },
  cooksUtensils: {
    name: "Cook's Utensils",
    cost: 1,
    weight: 8,
    relevantAbility: "Wisdom",
    craftableItems: [
      "Rations (improved)",
      "Herbal Meals",
      "Restorative Soups",
      "Exotic Cuisine",
    ],
    description:
      "Pots, pans, and knives for preparing food that can provide bonuses to recovery or morale.",
  },
  glassblowerTools: {
    name: "Glassblower's Tools",
    cost: 30,
    weight: 5,
    relevantAbility: "Dexterity",
    craftableItems: [
      "Vials",
      "Flasks",
      "Lenses",
      "Lantern Globes",
      "Decorative Glass",
      "Alchemical Vessels",
    ],
    description:
      "Blowpipes and molds used to shape molten glass into vessels, lenses, and decorative items.",
  },
  jewelersTools: {
    name: "Jeweler's Tools",
    cost: 25,
    weight: 2,
    relevantAbility: "Dexterity",
    craftableItems: [
      "Rings",
      "Amulets",
      "Brooches",
      "Crowns",
      "Gem Settings",
      "Jewelry",
    ],
    description:
      "Loupes, files, and setting tools for crafting fine jewelry and evaluating gemstones.",
  },
  leatherworkersTools: {
    name: "Leatherworker's Tools",
    cost: 5,
    weight: 5,
    relevantAbility: "Dexterity",
    craftableItems: [
      "Leather Armor",
      "Studded Leather Armor",
      "Slings",
      "Whips",
      "Pouches",
      "Saddles",
      "Scabbards",
      "Boots",
    ],
    description:
      "Awls, knives, and punches for cutting, shaping, and stitching leather into armor and gear.",
  },
  masonsTools: {
    name: "Mason's Tools",
    cost: 10,
    weight: 8,
    relevantAbility: "Strength",
    craftableItems: [
      "Stone Walls",
      "Foundations",
      "Sculptures",
      "Grave Markers",
      "Fortifications",
    ],
    description:
      "Chisels and mallets for shaping stone into buildings, monuments, and fortifications.",
  },
  paintersSupplies: {
    name: "Painter's Supplies",
    cost: 10,
    weight: 5,
    relevantAbility: "Wisdom",
    craftableItems: [
      "Portraits",
      "Murals",
      "Heraldry",
      "Forgeries",
      "Illustrated Maps",
      "Spell Diagrams",
    ],
    description:
      "Brushes, pigments, and canvas for creating paintings, illustrations, and artistic forgeries.",
  },
  pottersTools: {
    name: "Potter's Tools",
    cost: 10,
    weight: 3,
    relevantAbility: "Dexterity",
    craftableItems: [
      "Jugs",
      "Bowls",
      "Urns",
      "Clay Vessels",
      "Ceramic Figurines",
      "Tiles",
    ],
    description:
      "Wheel, kiln, and shaping tools for forming clay into functional pottery and art objects.",
  },
  smithTools: {
    name: "Smith's Tools",
    cost: 20,
    weight: 8,
    relevantAbility: "Strength",
    craftableItems: [
      "Daggers",
      "Swords",
      "Axes",
      "Maces",
      "Spears",
      "Chain Mail",
      "Scale Mail",
      "Plate Armor",
      "Shields",
      "Metal Fittings",
    ],
    description:
      "Hammer, tongs, and anvil for forging metal weapons, armor, and hardware.",
  },
  tinkerTools: {
    name: "Tinker's Tools",
    cost: 50,
    weight: 10,
    relevantAbility: "Dexterity",
    craftableItems: [
      "Mechanical Toys",
      "Locks",
      "Clocks",
      "Small Mechanisms",
      "Gadgets",
      "Clockwork Devices",
    ],
    description:
      "Fine tools for constructing and repairing small mechanical devices, locks, and clockwork contraptions.",
  },
  weaversTools: {
    name: "Weaver's Tools",
    cost: 1,
    weight: 5,
    relevantAbility: "Dexterity",
    craftableItems: [
      "Robes",
      "Common Clothes",
      "Fine Clothes",
      "Cloaks",
      "Rope",
      "Tapestries",
      "Nets",
    ],
    description:
      "Loom and needles for weaving cloth and stitching garments, nets, and decorative textiles.",
  },
  woodcarverTools: {
    name: "Woodcarver's Tools",
    cost: 1,
    weight: 5,
    relevantAbility: "Dexterity",
    craftableItems: [
      "Arrows",
      "Bolts",
      "Bows",
      "Crossbows",
      "Wooden Figurines",
      "Staves",
      "Wand Blanks",
    ],
    description:
      "Knife, gouge, and mallet for shaping wood into ammunition, ranged weapons, and carvings.",
  },
};

// =============================================================================
// CRAFTING RULES
// =============================================================================

/**
 * Standard PHB/DMG crafting rules and the Xanathar's Guide variant.
 */
export const CRAFTING_RULES = {
  standard: {
    source: "Player's Handbook / Dungeon Master's Guide",
    progressPerDay: 5,
    progressUnit: "gp",
    costMultiplier: 0.5,
    description:
      "A character can craft nonmagical objects during downtime. To do so, they need the relevant tool proficiency and raw materials worth half the item's market price. Progress is made at 5 gp per day of work. Multiple characters with the same tool proficiency can combine their efforts.",
    requirements: [
      "Tool proficiency matching the item type",
      "Raw materials worth half the market price of the finished item",
      "Adequate workspace and tools",
      "For magical items: recipe or magical formula",
    ],
    multipleCharacters:
      "Multiple characters with the same proficiency can work together. Each contributes 5 gp of progress per day.",
    magicalItemNote:
      "Crafting magic items requires a recipe or magical formula in addition to standard materials. See MAGIC_ITEM_CRAFTING for details.",
  },
  xanatharsVariant: {
    source: "Xanathar's Guide to Everything",
    progressPerWeek: 50,
    progressUnit: "gp",
    costMultiplier: 0.5,
    description:
      "This variant adds crafting DCs and week-based tracking. Characters make a tool proficiency check at the end of each week to determine if progress is made. On a failure, the week's materials are wasted.",
    craftingDCByRarity: {
      mundane: { dc: 10, description: "Common nonmagical items" },
      common: { dc: 10, description: "Common magic items" },
      uncommon: { dc: 15, description: "Uncommon magic items" },
      rare: { dc: 20, description: "Rare magic items" },
      veryRare: { dc: 25, description: "Very rare magic items" },
      legendary: { dc: 30, description: "Legendary magic items" },
    },
    minimumProficiency:
      "Must have proficiency in the relevant tool to attempt crafting. Expertise doubles the proficiency bonus added to the check.",
    weeklyCheck:
      "At the end of each week of downtime, make a tool proficiency check against the crafting DC. On a success, the week counts toward progress. On a failure, the week's materials (25 gp per crafting level) are lost.",
  },
};

// =============================================================================
// MAGIC ITEM CRAFTING
// =============================================================================

/**
 * Magic item crafting requirements by rarity.
 * Based on Dungeon Master's Guide and Xanathar's Guide to Everything.
 */
export const MAGIC_ITEM_CRAFTING = {
  common: {
    rarity: "Common",
    minimumCost: 50,
    minimumTimeWeeks: 1,
    spellcastingRequirement: "Spells up to 1st level",
    exoticComponent: {
      description: "A common exotic component from a CR 1-3 creature",
      exampleCR: "1-3",
      examples: [
        "Pixie dust",
        "Goblin's lucky charm",
        "Kobold scale",
        "Giant rat tooth",
      ],
    },
    notes:
      "The simplest magic items. Often have minor beneficial effects such as warming light, minor luck, or cosmetic enhancements.",
  },
  uncommon: {
    rarity: "Uncommon",
    minimumCost: 200,
    minimumTimeWeeks: 2,
    spellcastingRequirement: "Spells up to 3rd level",
    exoticComponent: {
      description: "An uncommon exotic component from a CR 4-8 creature",
      exampleCR: "4-8",
      examples: [
        "Harpy feather",
        "Owlbear claw",
        "Centaur hoof",
        "Nothic eye",
        "Werewolf pelt",
      ],
    },
    notes:
      "Items with notable magical properties. Require meaningful investment and a moderately challenging component source.",
  },
  rare: {
    rarity: "Rare",
    minimumCost: 2000,
    minimumTimeWeeks: 10,
    spellcastingRequirement: "Spells up to 6th level",
    exoticComponent: {
      description: "A rare exotic component from a CR 9-12 creature",
      exampleCR: "9-12",
      examples: [
        "Young dragon scale",
        "Aboleth slime",
        "Treant heartwood",
        "Vampire ash",
        "Cloud giant fingernail",
      ],
    },
    notes:
      "Powerful items requiring substantial time and a dangerous component. Represent the upper tier of what most adventuring parties will encounter.",
  },
  veryRare: {
    rarity: "Very Rare",
    minimumCost: 20000,
    minimumTimeWeeks: 25,
    spellcastingRequirement: "Spells up to 8th level",
    exoticComponent: {
      description: "A very rare exotic component from a CR 13-18 creature",
      exampleCR: "13-18",
      examples: [
        "Adult dragon blood",
        "Lich phylactery shard",
        "Marilith scale",
        "Storm giant soul-stone",
        "Death knight armor fragment",
      ],
    },
    notes:
      "Exceptionally powerful items. Require half a year of dedicated crafting and components from some of the most dangerous creatures in the world.",
  },
  legendary: {
    rarity: "Legendary",
    minimumCost: 100000,
    minimumTimeWeeks: 50,
    spellcastingRequirement: "Spells up to 9th level",
    exoticComponent: {
      description: "A legendary exotic component from a CR 19+ creature",
      exampleCR: "19+",
      examples: [
        "Ancient dragon heart",
        "Demon lord essence",
        "Archdevil sigil",
        "Tarrasque scale",
        "God-touched relic",
      ],
    },
    notes:
      "The rarest and most powerful items in existence. Nearly a year of crafting, an astronomical cost, and components from world-ending threats.",
  },
};

// =============================================================================
// CRAFTING COMPLICATIONS
// =============================================================================

/**
 * A d6 complication table for crafting downtime activities.
 * Roll once per crafting project or once per week at DM discretion.
 * Based on Xanathar's Guide to Everything downtime complication framework.
 */
export const CRAFTING_COMPLICATIONS = [
  {
    roll: 1,
    title: "Unwanted Attention",
    description:
      "Rumors of your work spread through the settlement. Interested parties — buyers, rivals, or those who want the item for their own purposes — begin making inquiries.",
    mechanical:
      "The DM introduces an NPC faction or individual with interest in the crafted item. This may lead to role-playing encounters, demands, or theft attempts.",
    severity: "moderate",
  },
  {
    roll: 2,
    title: "Tool Breaks",
    description:
      "A critical tool is damaged or destroyed during the crafting process, halting work until it is repaired or replaced.",
    mechanical:
      "Work halts until the tool is repaired or replaced. Replacement or repair costs 10% of the tool's original purchase price. Work may resume the following day.",
    severity: "minor",
  },
  {
    roll: 3,
    title: "Rival Crafter",
    description:
      "Another craftsperson in the area takes notice of your project and attempts to interfere — sabotaging materials, spreading false rumors, or undercutting your commission.",
    mechanical:
      "Progress for 1d4 days is lost, or a key material is ruined and must be replaced at half cost. The rival may become a recurring antagonist.",
    severity: "moderate",
  },
  {
    roll: 4,
    title: "Flawed Material",
    description:
      "A batch of raw materials turns out to be substandard, counterfeit, or contaminated. The flaw is only discovered mid-project.",
    mechanical:
      "Half of the materials already invested (gp value) must be replaced. The crafting timeline is extended by 1d6 days while new materials are sourced.",
    severity: "moderate",
  },
  {
    roll: 5,
    title: "Patron Changes Requirements",
    description:
      "If crafting on commission, the patron alters the specifications — a different material, an added enchantment, or a changed design — partway through the project.",
    mechanical:
      "Up to half of current progress may be lost depending on how significant the change is. The patron may or may not compensate for additional materials.",
    severity: "variable",
  },
  {
    roll: 6,
    title: "Exceptional Craftsmanship",
    description:
      "Through inspired work, a fortunate alignment of materials, or simply a streak of brilliant technique, the finished item surpasses expectations.",
    mechanical:
      "The item gains one of the following at the DM's discretion: a +1 bonus to relevant checks or attacks, a minor cosmetic magical property, or increased value (worth 150% of market price). For magical items, a minor additional property may be granted.",
    severity: "beneficial",
  },
];

// =============================================================================
// RECIPE TEMPLATES
// =============================================================================

/**
 * Ten sample crafting recipes covering common adventuring consumables,
 * magical items, and equipment enhancements.
 */
export const RECIPE_TEMPLATES = {
  healingPotion: {
    name: "Healing Potion",
    category: "Consumable",
    rarity: "Common",
    magical: true,
    toolRequired: "Alchemist's Supplies",
    materials: [
      { item: "Goodberry (crushed)", quantity: 5, cost: 5 },
      { item: "Healer's kit components", quantity: 1, cost: 5 },
      { item: "Purified water", quantity: 1, cost: 1 },
      { item: "Glass vial", quantity: 1, cost: 1 },
    ],
    totalMaterialCost: 12,
    marketValue: 50,
    craftingTimedays: 1,
    craftingDC: 10,
    effect: "Restores 2d4+2 hit points when consumed.",
    notes:
      "One of the most commonly crafted consumables. Healers and alchemists keep stock recipes on hand.",
  },
  plus1Weapon: {
    name: "+1 Weapon",
    category: "Weapon Enhancement",
    rarity: "Uncommon",
    magical: true,
    toolRequired: "Smith's Tools",
    materials: [
      { item: "Masterwork weapon blank (base weapon cost)", quantity: 1, cost: 100 },
      { item: "Enchanting reagents (arcane)", quantity: 1, cost: 50 },
      { item: "Mithral dust", quantity: 1, cost: 50 },
    ],
    totalMaterialCost: 200,
    marketValue: 500,
    craftingTimedays: 14,
    craftingDC: 15,
    effect:
      "Grants a +1 bonus to attack rolls and damage rolls. Counts as magical for the purpose of overcoming resistance.",
    notes:
      "Requires both Smith's Tools proficiency and the ability to cast at least one enchantment or transmutation spell of 1st level or higher, or a collaborating spellcaster.",
  },
  bagOfHolding: {
    name: "Bag of Holding",
    category: "Wondrous Item",
    rarity: "Uncommon",
    magical: true,
    toolRequired: "Leatherworker's Tools",
    materials: [
      { item: "Extradimensional leather (owlbear hide, tanned)", quantity: 2, cost: 50 },
      { item: "Arcane thread (spun from shadow silk)", quantity: 1, cost: 75 },
      { item: "Enchanting reagents", quantity: 1, cost: 75 },
    ],
    totalMaterialCost: 200,
    marketValue: 500,
    craftingTimedays: 14,
    craftingDC: 15,
    effect:
      "Interior space is 2 ft. in diameter and 4 ft. deep. Can hold up to 500 lb., not exceeding 64 cubic feet in volume. Weighs 15 lb. regardless of contents.",
    notes:
      "The owlbear hide (CR 3 creature) serves as the uncommon exotic component required for magic item crafting.",
  },
  cloakOfProtection: {
    name: "Cloak of Protection",
    category: "Wondrous Item",
    rarity: "Uncommon",
    magical: true,
    toolRequired: "Weaver's Tools",
    materials: [
      { item: "Displacer beast hide (processed)", quantity: 1, cost: 100 },
      { item: "Silver thread", quantity: 1, cost: 50 },
      { item: "Abjuration reagents", quantity: 1, cost: 50 },
    ],
    totalMaterialCost: 200,
    marketValue: 500,
    craftingTimedays: 14,
    craftingDC: 15,
    effect: "Grants +1 to AC and saving throws while attuned.",
    notes:
      "Attunement required. Displacer beast hide (CR 3) provides the uncommon exotic component.",
  },
  spellScroll: {
    name: "Spell Scroll (1st Level)",
    category: "Consumable",
    rarity: "Common",
    magical: true,
    toolRequired: "Calligrapher's Supplies",
    materials: [
      { item: "Fine parchment", quantity: 1, cost: 10 },
      { item: "Arcane ink", quantity: 1, cost: 25 },
      { item: "Powdered gemstone (crystal)", quantity: 1, cost: 15 },
    ],
    totalMaterialCost: 50,
    marketValue: 100,
    craftingTimedays: 3,
    craftingDC: 10,
    effect:
      "Contains a single 1st-level spell. A spellcaster who has the spell on their list may read it to cast without expending a spell slot.",
    notes:
      "The crafter must be able to cast the spell being inscribed. Scroll rarity scales with spell level: cantrip/1st = Common, 2nd/3rd = Uncommon, 4th/5th = Rare, 6th/7th = Very Rare, 8th/9th = Legendary.",
  },
  alchemistsFire: {
    name: "Alchemist's Fire",
    category: "Consumable",
    rarity: "Mundane (Special)",
    magical: false,
    toolRequired: "Alchemist's Supplies",
    materials: [
      { item: "Volatile oil", quantity: 1, cost: 3 },
      { item: "Quicklime", quantity: 1, cost: 2 },
      { item: "Sulfur compound", quantity: 1, cost: 2 },
      { item: "Glass flask", quantity: 1, cost: 1 },
    ],
    totalMaterialCost: 8,
    marketValue: 50,
    craftingTimedays: 1,
    craftingDC: 12,
    effect:
      "Thrown weapon. On hit, target takes 1d4 fire damage at the start of each turn. DC 10 Dex check as an action to extinguish.",
    notes:
      "The market price is high relative to material cost due to the danger and expertise involved in production.",
  },
  holyWater: {
    name: "Holy Water",
    category: "Consumable",
    rarity: "Mundane (Special)",
    magical: false,
    toolRequired: "Alchemist's Supplies",
    materials: [
      { item: "Pure water (spring or distilled)", quantity: 1, cost: 1 },
      { item: "Silver dust", quantity: 1, cost: 5 },
      { item: "Powdered moonstone", quantity: 1, cost: 6 },
      { item: "Glass flask", quantity: 1, cost: 1 },
    ],
    totalMaterialCost: 13,
    marketValue: 25,
    craftingTimedays: 1,
    craftingDC: 10,
    effect:
      "Thrown weapon. Deals 2d6 radiant damage to undead and fiends on a hit. No effect on other creature types.",
    notes:
      "Traditionally requires a cleric or paladin to perform a blessing ritual as part of the crafting process.",
  },
  antitoxin: {
    name: "Antitoxin",
    category: "Consumable",
    rarity: "Mundane",
    magical: false,
    toolRequired: "Alchemist's Supplies",
    materials: [
      { item: "Bezoar stone (powdered)", quantity: 1, cost: 15 },
      { item: "Herbal distillate (garlic, rue)", quantity: 1, cost: 5 },
      { item: "Alcohol base", quantity: 1, cost: 3 },
      { item: "Vial", quantity: 1, cost: 2 },
    ],
    totalMaterialCost: 25,
    marketValue: 50,
    craftingTimedays: 1,
    craftingDC: 10,
    effect:
      "Advantage on saving throws against poison for 1 hour. Not affected by existing poison conditions.",
    notes: "One of the most practical consumables for dungeon exploration.",
  },
  silveredWeapon: {
    name: "Silvered Weapon",
    category: "Weapon Enhancement",
    rarity: "Mundane (Special)",
    magical: false,
    toolRequired: "Smith's Tools",
    materials: [
      { item: "Base weapon", quantity: 1, cost: "varies" },
      { item: "Silver bar (refined)", quantity: 1, cost: 90 },
      { item: "Binding flux", quantity: 1, cost: 10 },
    ],
    totalMaterialCost: 100,
    marketValue: 100,
    craftingTimedays: 1,
    craftingDC: 12,
    effect:
      "Weapon counts as silvered. Bypasses damage resistance of creatures such as werewolves and some devils.",
    notes:
      "Cost is 100 gp regardless of the base weapon's value. The silver must be applied by a skilled smith to ensure it does not compromise the weapon's structural integrity.",
  },
  ammunitionPlus1: {
    name: "Ammunition +1",
    category: "Ammunition",
    rarity: "Uncommon",
    magical: true,
    toolRequired: "Woodcarver's Tools",
    materials: [
      { item: "Fine hardwood shafts", quantity: 20, cost: 20 },
      { item: "Hawk or eagle feathers (fletching)", quantity: 1, cost: 5 },
      { item: "Enchanting reagents", quantity: 1, cost: 50 },
      { item: "Arrowheads (iron)", quantity: 20, cost: 5 },
    ],
    totalMaterialCost: 80,
    marketValue: 200,
    craftingTimedays: 7,
    craftingDC: 15,
    effect:
      "Bundle of 20 pieces of +1 ammunition. Each piece grants +1 to attack and damage rolls. The enchantment is consumed on use.",
    notes:
      "Produces 20 pieces. Crafting a smaller quantity does not reduce cost proportionally due to the enchanting process.",
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Calculates the number of days needed to craft an item.
 * @param {number} itemValue - Market value of the item in gold pieces.
 * @param {"standard"|"xanathar"} [variant="standard"] - Which ruleset to use.
 * @returns {{ days: number, weeks: number, progressPerDay: number, totalProgressNeeded: number }}
 */
export function calculateCraftingTime(itemValue, variant = "standard") {
  const costToCraft = itemValue / 2;

  if (variant === "xanathar") {
    const progressPerWeek = CRAFTING_RULES.xanatharsVariant.progressPerWeek;
    const weeksNeeded = Math.ceil(costToCraft / progressPerWeek);
    return {
      days: weeksNeeded * 7,
      weeks: weeksNeeded,
      progressPerDay: progressPerWeek / 7,
      totalProgressNeeded: costToCraft,
      variant: "xanathar",
      note: "Each week requires a successful tool proficiency check or materials are lost.",
    };
  }

  const progressPerDay = CRAFTING_RULES.standard.progressPerDay;
  const daysNeeded = Math.ceil(costToCraft / progressPerDay);
  return {
    days: daysNeeded,
    weeks: Math.ceil(daysNeeded / 7),
    progressPerDay,
    totalProgressNeeded: costToCraft,
    variant: "standard",
    note: "Progress accumulates at 5 gp per craftsperson per day.",
  };
}

/**
 * Calculates the raw material cost required to craft an item.
 * Per PHB/DMG rules, materials cost half the item's market value.
 * @param {number} itemValue - Market value of the item in gold pieces.
 * @returns {{ materialCost: number, marketValue: number, savings: number }}
 */
export function calculateCraftingCost(itemValue) {
  const materialCost = itemValue * CRAFTING_RULES.standard.costMultiplier;
  return {
    materialCost,
    marketValue: itemValue,
    savings: itemValue - materialCost,
    note: "Raw materials must be worth half the item's market price.",
  };
}

/**
 * Retrieves a tool proficiency entry by name (case-insensitive, flexible matching).
 * @param {string} toolName - The name or key of the tool (e.g. "Smith's Tools" or "smithTools").
 * @returns {object|null} The tool proficiency object, or null if not found.
 */
export function getCraftingTool(toolName) {
  if (!toolName) return null;

  // Direct key lookup first
  if (TOOL_PROFICIENCIES[toolName]) {
    return TOOL_PROFICIENCIES[toolName];
  }

  // Case-insensitive name match
  const normalized = toolName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const match = Object.values(TOOL_PROFICIENCIES).find(
    (tool) => tool.name.toLowerCase().replace(/[^a-z0-9]/g, "") === normalized
  );

  return match || null;
}

/**
 * Returns the full crafting requirements for a magic item of the given rarity.
 * @param {"common"|"uncommon"|"rare"|"veryRare"|"legendary"} rarity - Rarity tier.
 * @returns {object|null} The MAGIC_ITEM_CRAFTING entry, or null if rarity is unrecognized.
 */
export function getMagicItemCraftingRequirements(rarity) {
  if (!rarity) return null;

  const normalized = rarity.toLowerCase().replace(/[^a-z]/g, "");

  const rarityKeyMap = {
    common: "common",
    uncommon: "uncommon",
    rare: "rare",
    veryrare: "veryRare",
    legendary: "legendary",
  };

  const key = rarityKeyMap[normalized];
  return key ? MAGIC_ITEM_CRAFTING[key] : null;
}

/**
 * Simulates rolling a d6 on the crafting complications table.
 * Returns a random complication entry from CRAFTING_COMPLICATIONS.
 * @returns {object} A single complication entry.
 */
export function rollCraftingComplication() {
  const roll = Math.floor(Math.random() * 6) + 1;
  return CRAFTING_COMPLICATIONS.find((c) => c.roll === roll);
}

/**
 * Retrieves a recipe template by item name (case-insensitive, flexible matching).
 * @param {string} itemName - The name or key of the recipe (e.g. "Healing Potion" or "healingPotion").
 * @returns {object|null} The recipe template object, or null if not found.
 */
export function getRecipe(itemName) {
  if (!itemName) return null;

  // Direct key lookup first
  if (RECIPE_TEMPLATES[itemName]) {
    return RECIPE_TEMPLATES[itemName];
  }

  // Case-insensitive name match
  const normalized = itemName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const match = Object.values(RECIPE_TEMPLATES).find(
    (recipe) => recipe.name.toLowerCase().replace(/[^a-z0-9]/g, "") === normalized
  );

  return match || null;
}

/**
 * Checks whether a character meets the tool requirements to attempt a given recipe.
 * @param {string[]} characterTools - Array of tool names the character is proficient with.
 * @param {object} recipe - A recipe object from RECIPE_TEMPLATES (or a custom recipe with a toolRequired field).
 * @returns {{ eligible: boolean, missingTool: string|null, requiredTool: string, message: string }}
 */
export function checkCraftingEligibility(characterTools, recipe) {
  if (!recipe || !recipe.toolRequired) {
    return {
      eligible: false,
      missingTool: null,
      requiredTool: null,
      message: "Invalid recipe: no tool requirement found.",
    };
  }

  if (!Array.isArray(characterTools) || characterTools.length === 0) {
    return {
      eligible: false,
      missingTool: recipe.toolRequired,
      requiredTool: recipe.toolRequired,
      message: `Character has no tool proficiencies. Requires: ${recipe.toolRequired}.`,
    };
  }

  const requiredNormalized = recipe.toolRequired
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  const hasTool = characterTools.some(
    (tool) => tool.toLowerCase().replace(/[^a-z0-9]/g, "") === requiredNormalized
  );

  if (hasTool) {
    return {
      eligible: true,
      missingTool: null,
      requiredTool: recipe.toolRequired,
      message: `Character is eligible to craft ${recipe.name}. Required tool proficiency confirmed: ${recipe.toolRequired}.`,
    };
  }

  return {
    eligible: false,
    missingTool: recipe.toolRequired,
    requiredTool: recipe.toolRequired,
    message: `Character cannot craft ${recipe.name}. Missing tool proficiency: ${recipe.toolRequired}.`,
  };
}
