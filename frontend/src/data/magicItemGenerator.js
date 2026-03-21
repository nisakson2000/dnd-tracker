/**
 * @file magicItemGenerator.js
 * @description Magic item creation and randomization data for The Codex — D&D Companion.
 *   Covers rarities, categories, minor properties, quirks, sentient item rules, and a
 *   curated sample library. All data sourced from D&D 5e SRD / DMG guidelines.
 * @module data/magicItemGenerator
 */

// ---------------------------------------------------------------------------
// MAGIC_ITEM_RARITIES
// ---------------------------------------------------------------------------

/**
 * The six magic item rarity tiers defined in the DMG.
 * Each entry includes the suggested minimum character level, a price range in
 * gold pieces (per DMG p.135 guidelines), and the likelihood that the item
 * requires attunement.
 */
export const MAGIC_ITEM_RARITIES = {
  common: {
    label: "Common",
    suggestedLevel: 1,
    priceRange: { min: 50, max: 100 },
    attunementLikelihood: "rare",
    description: "Available at 1st level and above. Minor magical trinkets and utility items.",
  },
  uncommon: {
    label: "Uncommon",
    suggestedLevel: 1,
    priceRange: { min: 101, max: 500 },
    attunementLikelihood: "occasional",
    description: "Available at 1st level and above. Noticeably magical with meaningful benefits.",
  },
  rare: {
    label: "Rare",
    suggestedLevel: 5,
    priceRange: { min: 501, max: 5000 },
    attunementLikelihood: "common",
    description: "Suitable for characters of 5th level or higher. Significant combat or utility impact.",
  },
  veryRare: {
    label: "Very Rare",
    suggestedLevel: 11,
    priceRange: { min: 5001, max: 50000 },
    attunementLikelihood: "very common",
    description: "Suitable for characters of 11th level or higher. Powerful items that can shape encounters.",
  },
  legendary: {
    label: "Legendary",
    suggestedLevel: 17,
    priceRange: { min: 50001, max: 500000 },
    attunementLikelihood: "almost always",
    description: "Suitable for characters of 17th level or higher. Game-changing artifacts of immense power.",
  },
  artifact: {
    label: "Artifact",
    suggestedLevel: 17,
    priceRange: { min: null, max: null },
    attunementLikelihood: "always",
    description:
      "Unique items of legendary status. Priceless — not available for sale under normal circumstances. Often have both beneficial and detrimental properties.",
  },
};

// ---------------------------------------------------------------------------
// ITEM_CATEGORIES
// ---------------------------------------------------------------------------

/**
 * The nine standard magic item categories from the DMG.
 * Each includes a short description and the typical equipment slot (or 'held'
 * for items that are carried/wielded).
 */
export const ITEM_CATEGORIES = {
  armor: {
    label: "Armor",
    description:
      "Magical suits of armor, shields, and protective garments that enhance defense or grant special resistances.",
    typicalSlot: "body",
  },
  weapon: {
    label: "Weapon",
    description:
      "Enchanted swords, bows, axes, and other armaments that improve attack rolls, damage, or grant special combat abilities.",
    typicalSlot: "held",
  },
  potion: {
    label: "Potion",
    description:
      "Single-use liquid magical items consumed as a bonus action. Effects range from healing to granting temporary magical abilities.",
    typicalSlot: "consumable",
  },
  ring: {
    label: "Ring",
    description:
      "Magical rings worn on the finger that grant passive bonuses or active abilities. A creature can wear up to two rings.",
    typicalSlot: "finger",
  },
  rod: {
    label: "Rod",
    description:
      "Scepter-like magical implements that channel spells or grant special powers when held or activated.",
    typicalSlot: "held",
  },
  scroll: {
    label: "Scroll",
    description:
      "Single-use parchments inscribed with a spell. A creature that can cast the spell can use a scroll; others may attempt with an ability check.",
    typicalSlot: "consumable",
  },
  staff: {
    label: "Staff",
    description:
      "Long magical implements that hold charges and can cast a variety of spells. Most require attunement by a spellcaster.",
    typicalSlot: "held",
  },
  wand: {
    label: "Wand",
    description:
      "Slim magical implements similar to staffs but typically holding fewer charges and a narrower range of effects.",
    typicalSlot: "held",
  },
  wondrousItem: {
    label: "Wondrous Item",
    description:
      "A catch-all category for magical items that do not fit other categories — cloaks, boots, bags, helmets, amulets, and more.",
    typicalSlot: "varies",
  },
};

// ---------------------------------------------------------------------------
// MINOR_PROPERTIES
// ---------------------------------------------------------------------------

/**
 * Twenty minor properties from DMG Table — Minor Property (p.143).
 * These are optional flourishes that add personality to a magic item without
 * changing its mechanical effect.
 */
export const MINOR_PROPERTIES = [
  {
    id: "beacon",
    name: "Beacon",
    description:
      "The bearer can use a bonus action to cause the item to shed bright light in a 10-foot radius and dim light for an additional 10 feet, or to extinguish the light.",
  },
  {
    id: "compass",
    name: "Compass",
    description:
      "The wielder can use an action to learn which way is north. This property doesn't work underground or in other planes.",
  },
  {
    id: "conscientious",
    name: "Conscientious",
    description:
      "When the bearer of this item contemplates or undertakes a morally questionable act, the item enhances pangs of conscience, making the bearer feel uneasy.",
  },
  {
    id: "delver",
    name: "Delver",
    description:
      "While underground, the bearer of this item always knows the item's depth below the surface and the direction to the nearest staircase, ramp, or other path leading upward.",
  },
  {
    id: "gleaming",
    name: "Gleaming",
    description: "This item never gets dirty.",
  },
  {
    id: "guardian",
    name: "Guardian",
    description:
      "The item whispers warnings to its bearer, granting a +2 bonus to initiative if the bearer isn't incapacitated.",
  },
  {
    id: "harmonious",
    name: "Harmonious",
    description: "Attuning to this item takes only 1 minute.",
  },
  {
    id: "hiddenMessage",
    name: "Hidden Message",
    description:
      "A message is hidden somewhere on the item. It might be visible only under certain light conditions, written in an obscure language, or revealed by a command word.",
  },
  {
    id: "key",
    name: "Key",
    description:
      "The item is used to open a specific lock somewhere in the world. The GM chooses the lock; the key is useless otherwise.",
  },
  {
    id: "language",
    name: "Language",
    description:
      "The bearer can speak and understand a language determined by the GM while the item is on their person.",
  },
  {
    id: "sentinel",
    name: "Sentinel",
    description:
      "Choose a kind of creature that is an enemy of the item's creator. This item glows faintly when such creatures are within 120 feet of it.",
  },
  {
    id: "songcraft",
    name: "Songcraft",
    description:
      "Whenever this item is struck or is striking a creature, its bearer hears a fragment of an ancient song.",
  },
  {
    id: "strangeMaterial",
    name: "Strange Material",
    description:
      "The item was made from a material that is bizarre given its purpose. Its durability is the same as the normal version of the item.",
  },
  {
    id: "temperate",
    name: "Temperate",
    description:
      "The bearer suffers no harm in temperatures as cold as -20 degrees Fahrenheit or as warm as 120 degrees Fahrenheit.",
  },
  {
    id: "unbreakable",
    name: "Unbreakable",
    description: "The item can't be broken. Special means must be used to destroy it.",
  },
  {
    id: "warLeader",
    name: "War Leader",
    description:
      "The bearer can use an action to cause their voice to carry clearly for up to 300 feet until the end of the bearer's next turn.",
  },
  {
    id: "wicked",
    name: "Wicked",
    description:
      "When the bearer is presented with an opportunity to act in a selfish or malevolent way, the item heightens the bearer's urge to do so.",
  },
  {
    id: "illusion",
    name: "Illusion",
    description:
      "The item is a convincing illusion. It appears to be a normal, non-magical item of the same type, and its magical properties are undetectable except by a detect magic spell.",
  },
  {
    id: "vestige",
    name: "Vestige",
    description:
      "The item periodically shows a fleeting vision or sound from the memory of a previous owner, determined by the GM.",
  },
  {
    id: "artifact",
    name: "Artifact of Nature",
    description:
      "Small flowers, vines, or frost patterns grow on the item's surface over time. They can be cleaned away but always return within 24 hours.",
  },
];

// ---------------------------------------------------------------------------
// QUIRKS
// ---------------------------------------------------------------------------

/**
 * Twelve item quirks from DMG Table — Quirks (p.143).
 * Quirks apply most often to sentient magic items but can add personality to
 * any intelligent or cursed item.
 */
export const QUIRKS = [
  {
    id: "confident",
    name: "Confident",
    description:
      "The item is confident and inspires confidence in its bearer. It will push its bearer toward acts of bravado, even when dangerous.",
  },
  {
    id: "demanding",
    name: "Demanding",
    description:
      "The item frequently requests that its wielder use it, even when other tools or weapons would be more appropriate.",
  },
  {
    id: "hungry",
    name: "Hungry",
    description:
      "The item craves the experience of being used. After long periods without use it becomes sulky, its magical properties becoming unreliable.",
  },
  {
    id: "protective",
    name: "Protective",
    description:
      "The item is fiercely protective of its bearer and will alert them to danger even when not asked, sometimes intrusively.",
  },
  {
    id: "slothful",
    name: "Slothful",
    description:
      "The item encourages its bearer to rest whenever possible and resists being used for mundane tasks.",
  },
  {
    id: "bloodthirsty",
    name: "Bloodthirsty",
    description:
      "The item pushes its bearer to engage in combat even when negotiation or stealth would serve better.",
  },
  {
    id: "territorial",
    name: "Territorial",
    description:
      "The item resents being used by anyone other than its current bearer and may act erratically if lent out.",
  },
  {
    id: "jealous",
    name: "Jealous",
    description:
      "The item is jealous of other magical items the bearer possesses and will subtly undermine their effectiveness.",
  },
  {
    id: "talkative",
    name: "Talkative",
    description:
      "The item (if sentient) rarely stops communicating, offering commentary on everything from combat tactics to the bearer's fashion choices.",
  },
  {
    id: "covetous",
    name: "Covetous",
    description:
      "The item desires riches and will push its bearer to pursue treasure and wealth above other concerns.",
  },
  {
    id: "secretive",
    name: "Secretive",
    description:
      "The item keeps its full capabilities hidden, revealing new powers only at dramatic moments of its choosing.",
  },
  {
    id: "vain",
    name: "Vain",
    description:
      "The item is obsessed with its own appearance and becomes upset when dirty, damaged, or unappreciated for its beauty.",
  },
];

// ---------------------------------------------------------------------------
// SENTIENT_ITEM_RULES
// ---------------------------------------------------------------------------

/**
 * Rules for creating and running sentient magic items, drawn from DMG Chapter 7.
 * These are reference objects meant to guide the GM; they are not mechanical
 * functions but structured data for display and generation helpers.
 */
export const SENTIENT_ITEM_RULES = {
  abilityScores: {
    method: "Roll 3d6 for each of Intelligence, Wisdom, and Charisma.",
    notes:
      "These scores determine the item's mental capabilities, perception, and strength of personality. A sentient item uses its Charisma modifier for Charisma checks and saving throws.",
    minimumRecommended: {
      INT: 6,
      WIS: 6,
      CHA: 6,
    },
  },
  communication: [
    {
      type: "empathy",
      description:
        "The item communicates by transmitting emotions to its wielder. It can't speak, read, or share specific thoughts, only feelings — joy, sorrow, dread, eagerness.",
    },
    {
      type: "speech",
      description:
        "The item can speak aloud in one or more languages. It can hear and understand any language spoken within 30 feet of it.",
    },
    {
      type: "telepathy",
      description:
        "The item can communicate telepathically with any creature that holds it, sharing thoughts and images as well as emotions.",
    },
  ],
  senses: [
    {
      type: "hearing",
      range: 30,
      description: "The item can hear normally within 30 feet of itself.",
    },
    {
      type: "darkvision",
      range: 60,
      description: "The item has darkvision to 60 feet and can see in normal and magical darkness.",
    },
    {
      type: "blindsight",
      range: 30,
      description:
        "The item has blindsight to 30 feet and can perceive its surroundings without relying on sight.",
    },
    {
      type: "truesight",
      range: 60,
      description:
        "The item has truesight to 60 feet, can see invisible creatures, and can see into the Ethereal Plane.",
    },
  ],
  alignment: {
    notes:
      "A sentient item has an alignment. Its creator or the events of its history determine this alignment. A paladin's holy avenger is likely lawful good; a weapon forged in the Abyss is likely chaotic evil.",
    options: [
      "Lawful Good",
      "Neutral Good",
      "Chaotic Good",
      "Lawful Neutral",
      "True Neutral",
      "Chaotic Neutral",
      "Lawful Evil",
      "Neutral Evil",
      "Chaotic Evil",
    ],
  },
  purpose: {
    description:
      "Every sentient item has a goal it pursues. This purpose shapes its personality and can drive conflict with its wielder.",
    examples: [
      "Defeat a specific type of creature (e.g., fiends, undead, dragons)",
      "Protect a particular place, lineage, or people",
      "Seek a lost artifact or piece of lore",
      "Spread a particular alignment or ideology",
      "Seek revenge against a specific creature or faction",
      "Restore a former wielder to life",
    ],
  },
  conflictRules: {
    trigger:
      "Conflict arises when the item's wielder acts against the item's purpose, alignment, or desires.",
    resolution:
      "The item's wielder must make a Charisma saving throw (DC = 8 + the item's Charisma modifier). On a failure, the GM determines the effect: the bearer suffers disadvantage on attack rolls and ability checks until the next dawn, or in extreme cases the item can seize control of the bearer's actions for a short time.",
    contestDC: "8 + item's Charisma modifier",
    dominanceConditions: [
      "The bearer acts against the item's alignment",
      "The bearer ignores the item's purpose for an extended time",
      "The bearer endangers the item unnecessarily",
    ],
  },
};

// ---------------------------------------------------------------------------
// SAMPLE_MAGIC_ITEMS
// ---------------------------------------------------------------------------

/**
 * A curated library of 30 canonical D&D 5e magic items spanning all non-Artifact
 * rarities. Descriptions are condensed summaries; refer to the DMG for full rules.
 *
 * @type {Array<{
 *   id: string,
 *   name: string,
 *   rarity: string,
 *   category: string,
 *   requiresAttunement: boolean,
 *   attunementRestriction: string|null,
 *   description: string,
 *   mechanicalEffect: string
 * }>}
 */
export const SAMPLE_MAGIC_ITEMS = [
  // ── Common (6) ──────────────────────────────────────────────────────────
  {
    id: "cloak_of_billowing",
    name: "Cloak of Billowing",
    rarity: "common",
    category: "wondrousItem",
    requiresAttunement: false,
    attunementRestriction: null,
    description: "A dramatic cloak that billows impressively in the absence of wind.",
    mechanicalEffect: "As a bonus action, cause the cloak to billow dramatically. No mechanical combat benefit, purely cosmetic.",
  },
  {
    id: "dread_helm",
    name: "Dread Helm",
    rarity: "common",
    category: "wondrousItem",
    requiresAttunement: false,
    attunementRestriction: null,
    description: "A fearsome-looking helmet that makes the wearer's eyes glow red.",
    mechanicalEffect: "While worn, the wearer's eyes appear to glow a frightening red. This is purely cosmetic.",
  },
  {
    id: "hat_of_wizardry",
    name: "Hat of Wizardry",
    rarity: "common",
    category: "wondrousItem",
    requiresAttunement: true,
    attunementRestriction: "wizard",
    description: "A classic pointed wizard's hat, crammed with minor magical potential.",
    mechanicalEffect:
      "While attuned, the wearer can use it as a spellcasting focus for wizard spells. Once per day, roll a d20; on a 20, cast a random cantrip from the wizard spell list as a reaction.",
  },
  {
    id: "moon_touched_sword",
    name: "Moon-Touched Sword",
    rarity: "common",
    category: "weapon",
    requiresAttunement: false,
    attunementRestriction: null,
    description: "A sword whose blade glows like moonlight in darkness.",
    mechanicalEffect:
      "In darkness, the unsheathed sword emits bright light in a 15-foot radius and dim light for an additional 15 feet. Counts as a light source.",
  },
  {
    id: "pot_of_awakening",
    name: "Pot of Awakening",
    rarity: "common",
    category: "wondrousItem",
    requiresAttunement: false,
    attunementRestriction: null,
    description: "An ordinary-looking clay pot that, when a shrub is planted and tended for 30 days, produces a awakened shrub.",
    mechanicalEffect:
      "If a shrub is planted in the pot and tended for 30 days, the shrub transforms into an awakened shrub at the end of that time. The pot becomes nonmagical once used.",
  },
  {
    id: "tankard_of_sobriety",
    name: "Tankard of Sobriety",
    rarity: "common",
    category: "wondrousItem",
    requiresAttunement: false,
    attunementRestriction: null,
    description: "An enchanted drinking vessel that negates the intoxicating effects of alcohol.",
    mechanicalEffect:
      "Any alcoholic beverage poured into this tankard becomes nonalcoholic. The taste is otherwise preserved perfectly.",
  },

  // ── Uncommon (8) ────────────────────────────────────────────────────────
  {
    id: "bag_of_holding",
    name: "Bag of Holding",
    rarity: "uncommon",
    category: "wondrousItem",
    requiresAttunement: false,
    attunementRestriction: null,
    description: "A sack that leads to an extradimensional space capable of holding far more than its exterior suggests.",
    mechanicalEffect:
      "Holds up to 500 pounds / 64 cubic feet. Weighs 15 pounds regardless of contents. Retrieving an item takes an action. If overloaded, pierced, or placed inside another extradimensional space, it ruptures.",
  },
  {
    id: "boots_of_elvenkind",
    name: "Boots of Elvenkind",
    rarity: "uncommon",
    category: "wondrousItem",
    requiresAttunement: false,
    attunementRestriction: null,
    description: "Supple boots that muffle the wearer's footsteps entirely.",
    mechanicalEffect:
      "While worn, the wearer's steps make no sound and they have advantage on Dexterity (Stealth) checks that rely on moving silently.",
  },
  {
    id: "cloak_of_protection",
    name: "Cloak of Protection",
    rarity: "uncommon",
    category: "wondrousItem",
    requiresAttunement: true,
    attunementRestriction: null,
    description: "A cloak woven with protective enchantments that reinforce the wearer's natural defenses.",
    mechanicalEffect: "While attuned and worn, the wearer gains a +1 bonus to AC and saving throws.",
  },
  {
    id: "gauntlets_of_ogre_power",
    name: "Gauntlets of Ogre Power",
    rarity: "uncommon",
    category: "wondrousItem",
    requiresAttunement: true,
    attunementRestriction: null,
    description: "Iron gauntlets inscribed with runes that fill the wearer with the brute strength of an ogre.",
    mechanicalEffect:
      "While attuned, the wearer's Strength score becomes 19. Has no effect if the wearer's Strength is already 19 or higher.",
  },
  {
    id: "goggles_of_night",
    name: "Goggles of Night",
    rarity: "uncommon",
    category: "wondrousItem",
    requiresAttunement: false,
    attunementRestriction: null,
    description: "Dark-lensed goggles enchanted to grant sight in total darkness.",
    mechanicalEffect:
      "While worn, the wearer gains darkvision to a range of 60 feet. If they already have darkvision, wearing the goggles extends the range by 60 feet.",
  },
  {
    id: "headband_of_intellect",
    name: "Headband of Intellect",
    rarity: "uncommon",
    category: "wondrousItem",
    requiresAttunement: true,
    attunementRestriction: null,
    description: "A slim circlet of worked silver that sharpens the wearer's mind to extraordinary clarity.",
    mechanicalEffect:
      "While attuned, the wearer's Intelligence score becomes 19. Has no effect if the wearer's Intelligence is already 19 or higher.",
  },
  {
    id: "immovable_rod",
    name: "Immovable Rod",
    rarity: "uncommon",
    category: "rod",
    requiresAttunement: false,
    attunementRestriction: null,
    description: "A flat iron rod with a button on one end that, when pressed, locks the rod in place in space.",
    mechanicalEffect:
      "As an action, press the button to fix the rod in place. It can hold up to 8,000 pounds. A creature can use an action to make a DC 30 Strength check to move it up to 10 feet on a success.",
  },
  {
    id: "weapon_plus_1",
    name: "Weapon +1",
    rarity: "uncommon",
    category: "weapon",
    requiresAttunement: false,
    attunementRestriction: null,
    description: "A finely crafted weapon with a magical edge that improves the wielder's accuracy and striking power.",
    mechanicalEffect:
      "Grants a +1 bonus to attack rolls and damage rolls made with this magic weapon. Counts as magical for the purpose of overcoming resistance and immunity.",
  },

  // ── Rare (8) ────────────────────────────────────────────────────────────
  {
    id: "armor_plus_1",
    name: "Armor +1",
    rarity: "rare",
    category: "armor",
    requiresAttunement: false,
    attunementRestriction: null,
    description: "Armor forged or enchanted to offer superior protection beyond its mundane counterpart.",
    mechanicalEffect:
      "Grants a +1 bonus to AC in addition to the armor's normal AC. Counts as magical armor.",
  },
  {
    id: "belt_of_dwarvenkind",
    name: "Belt of Dwarvenkind",
    rarity: "rare",
    category: "wondrousItem",
    requiresAttunement: true,
    attunementRestriction: null,
    description: "A sturdy leather belt worked with dwarven runes that bestows dwarven hardiness and skill upon its wearer.",
    mechanicalEffect:
      "Constitution increases by 2 (max 20). Advantage on Charisma (Persuasion) checks made to interact with dwarves. Darkvision 60 ft. (or +30 ft. if already possessed). 50% chance each day of growing a beard if the wearer is capable.",
  },
  {
    id: "cloak_of_displacement",
    name: "Cloak of Displacement",
    rarity: "rare",
    category: "wondrousItem",
    requiresAttunement: true,
    attunementRestriction: null,
    description:
      "A shimmering cloak that projects an illusion of the wearer slightly offset from their true position.",
    mechanicalEffect:
      "While worn, attackers have disadvantage on attack rolls against the wearer. This property is suppressed while the wearer is incapacitated, restrained, or otherwise unable to move.",
  },
  {
    id: "flame_tongue",
    name: "Flame Tongue",
    rarity: "rare",
    category: "weapon",
    requiresAttunement: true,
    attunementRestriction: null,
    description: "A sword whose blade erupts in magical flame when a command word is spoken.",
    mechanicalEffect:
      "As a bonus action, speak the command word to ignite the blade (bright light 40 ft., dim light 40 ft. more). While flaming, deals an extra 2d6 fire damage on a hit. Extinguish as a bonus action or by sheathing.",
  },
  {
    id: "ring_of_protection",
    name: "Ring of Protection",
    rarity: "rare",
    category: "ring",
    requiresAttunement: true,
    attunementRestriction: null,
    description: "A ring set with a protective ward that bolsters the wearer against harm.",
    mechanicalEffect:
      "While attuned, the wearer gains a +1 bonus to AC and saving throws.",
  },
  {
    id: "ring_of_spell_storing",
    name: "Ring of Spell Storing",
    rarity: "rare",
    category: "ring",
    requiresAttunement: true,
    attunementRestriction: null,
    description: "A ring that can store spells cast into it, releasing them at the bearer's command.",
    mechanicalEffect:
      "Can store up to 5 levels of spells. Any creature can cast a spell of 1st through 5th level into the ring. The ring wearer can cast any stored spell using the original caster's spell save DC and attack bonus.",
  },
  {
    id: "shield_plus_2",
    name: "Shield +2",
    rarity: "rare",
    category: "armor",
    requiresAttunement: false,
    attunementRestriction: null,
    description: "A magically reinforced shield that provides exceptional protection in combat.",
    mechanicalEffect:
      "Grants a +2 bonus to AC in addition to the shield's normal +2 AC bonus. Total AC bonus from this shield: +4.",
  },
  {
    id: "staff_of_the_woodlands",
    name: "Staff of the Woodlands",
    rarity: "rare",
    category: "staff",
    requiresAttunement: true,
    attunementRestriction: "druid",
    description: "A gnarled wooden staff carved with animal and plant motifs, vibrating with the power of the natural world.",
    mechanicalEffect:
      "10 charges. Regains 1d6+4 charges at dawn. Spells: pass without trace (2), animal friendship (1), awaken (5), barkskin (2), locate animals or plants (2), speak with animals (1), speak with plants (3), wall of thorns (6). Can also be planted to grow into a tree (charges expended).",
  },

  // ── Very Rare (5) ───────────────────────────────────────────────────────
  {
    id: "animated_shield",
    name: "Animated Shield",
    rarity: "veryRare",
    category: "armor",
    requiresAttunement: true,
    attunementRestriction: null,
    description: "A shield that hovers and defends its bearer autonomously, freeing both hands for other tasks.",
    mechanicalEffect:
      "As a bonus action, command the shield to animate. For 1 minute it floats in your space, granting +2 AC without requiring a hand to hold it. Can be used 3 times per day; recharges at dawn.",
  },
  {
    id: "armor_plus_2",
    name: "Armor +2",
    rarity: "veryRare",
    category: "armor",
    requiresAttunement: false,
    attunementRestriction: null,
    description: "Masterwork armor enchanted with powerful protective magic beyond that of +1 armor.",
    mechanicalEffect:
      "Grants a +2 bonus to AC in addition to the armor's normal AC. Counts as magical armor.",
  },
  {
    id: "dancing_sword",
    name: "Dancing Sword",
    rarity: "veryRare",
    category: "weapon",
    requiresAttunement: true,
    attunementRestriction: null,
    description: "A sword that leaps from its wielder's hand to fight independently in the air.",
    mechanicalEffect:
      "As a bonus action, toss the sword into the air; it flies up to 30 ft. and attacks a creature of your choice (using your attack bonus). It attacks once per turn for up to 4 rounds, then returns. While dancing, you can't attack with it but it grants +2 AC to you.",
  },
  {
    id: "rod_of_absorption",
    name: "Rod of Absorption",
    rarity: "veryRare",
    category: "rod",
    requiresAttunement: true,
    attunementRestriction: null,
    description: "A rod that absorbs the energy of spells cast at its wielder, storing that energy for future use.",
    mechanicalEffect:
      "While holding the rod, use your reaction to absorb a spell targeting only you. The spell has no effect on you and its energy (spell level in stored levels) is stored in the rod (max 50 levels). You can expend stored levels to cast spells as if using a spell slot of that level.",
  },
  {
    id: "staff_of_power",
    name: "Staff of Power",
    rarity: "veryRare",
    category: "staff",
    requiresAttunement: true,
    attunementRestriction: "sorcerer, warlock, or wizard",
    description: "A staff crackling with arcane energy, one of the most coveted implements a wizard can wield.",
    mechanicalEffect:
      "20 charges. +2 to attack rolls, damage rolls, AC, and saving throws while held. Spells (1–8 charges each): cone of cold, fireball (5th level), globe of invulnerability, hold monster, levitate, lightning bolt (5th level), magic missile, ray of enfeeblement, wall of force. Retributive strike option on destruction.",
  },

  // ── Legendary (3) ───────────────────────────────────────────────────────
  {
    id: "holy_avenger",
    name: "Holy Avenger",
    rarity: "legendary",
    category: "weapon",
    requiresAttunement: true,
    attunementRestriction: "paladin",
    description:
      "A legendary holy sword that blazes with radiant light, the ultimate weapon of a paladin devoted to good.",
    mechanicalEffect:
      "While attuned, you gain a +3 bonus to attack and damage rolls. Against fiends and undead, deals an extra 2d10 radiant damage. Emits bright light in a 10-ft. radius (20 ft. dim). Creates a magic circle against evil on the bearer and allies within 10 feet (advantage on saves vs. fiends/undead, those creatures can't charm/frighten/possess within the circle).",
  },
  {
    id: "luck_blade",
    name: "Luck Blade",
    rarity: "legendary",
    category: "weapon",
    requiresAttunement: true,
    attunementRestriction: null,
    description: "A sword infused with luck magic so powerful it can literally rewrite fate.",
    mechanicalEffect:
      "+1 to attack and damage rolls (minimum; the bonus can be higher per GM). Luck: while attuned, you have advantage on ability checks and saving throws. Wish: the sword has 1d4–1 wishes stored. You can expend one to cast the wish spell (once per day). When the last wish is used, the sword loses this property.",
  },
  {
    id: "staff_of_the_magi",
    name: "Staff of the Magi",
    rarity: "legendary",
    category: "staff",
    requiresAttunement: true,
    attunementRestriction: "sorcerer, warlock, or wizard",
    description:
      "The pinnacle of arcane staves — a relic of immense power that can cast the most devastating spells imaginable.",
    mechanicalEffect:
      "50 charges. +2 to spell attack rolls. Spell absorption: absorb spells targeting only you as a reaction (gain charges equal to spell level, max 50). Spells (1–7 charges): conjure elemental, dispel magic, fireball (7th), flaming sphere, ice storm, invisibility, knock, lightning bolt (7th), passwall, plane shift, telekinesis, wall of fire, web. Retributive strike: break the staff as an action for a catastrophic explosion (destroying you and dealing massive force damage in 30-ft. radius, 50% chance of planar transportation).",
  },
];

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Returns a random element from an array.
 * @param {Array} arr
 * @returns {*}
 */
function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Simulates rolling NdS dice and returns the total.
 * @param {number} n - Number of dice
 * @param {number} s - Number of sides
 * @returns {number}
 */
function rollDice(n, s) {
  let total = 0;
  for (let i = 0; i < n; i++) {
    total += Math.floor(Math.random() * s) + 1;
  }
  return total;
}

// ---------------------------------------------------------------------------

/**
 * Generates a procedural magic item description for a given rarity and category.
 * If a matching sample item exists it is returned directly; otherwise a
 * skeleton item object is produced with generated metadata.
 *
 * @param {string} rarity - Key from MAGIC_ITEM_RARITIES (e.g. "rare")
 * @param {string} category - Key from ITEM_CATEGORIES (e.g. "weapon")
 * @returns {{
 *   name: string,
 *   rarity: string,
 *   category: string,
 *   requiresAttunement: boolean,
 *   description: string,
 *   mechanicalEffect: string,
 *   minorProperty: object|null,
 *   quirk: object|null,
 *   generated: boolean
 * }}
 */
export function generateMagicItem(rarity = "common", category = "wondrousItem") {
  const rarityData = MAGIC_ITEM_RARITIES[rarity];
  const categoryData = ITEM_CATEGORIES[category];

  if (!rarityData) {
    throw new Error(`Unknown rarity "${rarity}". Valid values: ${Object.keys(MAGIC_ITEM_RARITIES).join(", ")}`);
  }
  if (!categoryData) {
    throw new Error(`Unknown category "${category}". Valid values: ${Object.keys(ITEM_CATEGORIES).join(", ")}`);
  }

  // Try to find a matching sample item first
  const candidates = SAMPLE_MAGIC_ITEMS.filter(
    (item) => item.rarity === rarity && item.category === category
  );

  if (candidates.length > 0) {
    const base = { ...randomFrom(candidates), generated: false };
    return base;
  }

  // No matching sample — produce a generic skeleton
  const attunementChance = {
    rare: 0.1,
    occasional: 0.35,
    common: 0.6,
    "very common": 0.8,
    "almost always": 0.95,
    always: 1.0,
  };
  const threshold = attunementChance[rarityData.attunementLikelihood] ?? 0.5;
  const requiresAttunement = Math.random() < threshold;

  const priceNote =
    rarityData.priceRange.min !== null
      ? `Approximate value: ${rarityData.priceRange.min}–${rarityData.priceRange.max} gp.`
      : "Priceless — not available for sale.";

  return {
    id: `generated_${rarity}_${category}_${Date.now()}`,
    name: `${rarityData.label} ${categoryData.label}`,
    rarity,
    category,
    requiresAttunement,
    attunementRestriction: null,
    description: `A ${rarityData.label.toLowerCase()} magic ${categoryData.label.toLowerCase()}. ${categoryData.description} ${priceNote}`,
    mechanicalEffect:
      "Mechanical effect to be determined by the GM based on the item's description and rarity guidelines.",
    minorProperty: Math.random() < 0.3 ? rollMinorProperty() : null,
    quirk: Math.random() < 0.15 ? rollQuirk() : null,
    generated: true,
  };
}

// ---------------------------------------------------------------------------

/**
 * Returns all sample magic items of a given rarity.
 *
 * @param {string} rarity - Key from MAGIC_ITEM_RARITIES
 * @returns {Array} Filtered array of matching items
 */
export function getItemsByRarity(rarity) {
  if (!MAGIC_ITEM_RARITIES[rarity]) {
    throw new Error(`Unknown rarity "${rarity}". Valid values: ${Object.keys(MAGIC_ITEM_RARITIES).join(", ")}`);
  }
  return SAMPLE_MAGIC_ITEMS.filter((item) => item.rarity === rarity);
}

// ---------------------------------------------------------------------------

/**
 * Returns all sample magic items belonging to a given category.
 *
 * @param {string} category - Key from ITEM_CATEGORIES
 * @returns {Array} Filtered array of matching items
 */
export function getItemsByCategory(category) {
  if (!ITEM_CATEGORIES[category]) {
    throw new Error(`Unknown category "${category}". Valid values: ${Object.keys(ITEM_CATEGORIES).join(", ")}`);
  }
  return SAMPLE_MAGIC_ITEMS.filter((item) => item.category === category);
}

// ---------------------------------------------------------------------------

/**
 * Returns a single randomly selected minor property from MINOR_PROPERTIES.
 *
 * @returns {object} A minor property entry
 */
export function rollMinorProperty() {
  return randomFrom(MINOR_PROPERTIES);
}

// ---------------------------------------------------------------------------

/**
 * Returns a single randomly selected quirk from QUIRKS.
 *
 * @returns {object} A quirk entry
 */
export function rollQuirk() {
  return randomFrom(QUIRKS);
}

// ---------------------------------------------------------------------------

/**
 * Generates a complete sentient item by combining a base item with randomly
 * rolled sentient properties per the DMG rules in SENTIENT_ITEM_RULES.
 *
 * @param {object} baseItem - An item object (e.g. from SAMPLE_MAGIC_ITEMS or generateMagicItem())
 * @returns {object} The base item extended with a `sentience` property
 */
export function generateSentientItem(baseItem) {
  if (!baseItem || typeof baseItem !== "object") {
    throw new Error("generateSentientItem requires a valid base item object.");
  }

  const intScore = rollDice(3, 6);
  const wisScore = rollDice(3, 6);
  const chaScore = rollDice(3, 6);

  const communicationOptions = SENTIENT_ITEM_RULES.communication;
  const senseOptions = SENTIENT_ITEM_RULES.senses;
  const alignmentOptions = SENTIENT_ITEM_RULES.alignment.options;
  const purposeOptions = SENTIENT_ITEM_RULES.purpose.examples;

  // Randomly pick communication type (weighted toward lower-tier options)
  const commRoll = Math.random();
  let communication;
  if (commRoll < 0.4) {
    communication = communicationOptions[0]; // empathy
  } else if (commRoll < 0.75) {
    communication = communicationOptions[1]; // speech
  } else {
    communication = communicationOptions[2]; // telepathy
  }

  // Pick 1–2 senses
  const shuffledSenses = [...senseOptions].sort(() => Math.random() - 0.5);
  const senseCount = Math.random() < 0.5 ? 1 : 2;
  const senses = shuffledSenses.slice(0, senseCount);

  const alignment = randomFrom(alignmentOptions);
  const purpose = randomFrom(purposeOptions);
  const quirk = rollQuirk();

  const chaMod = Math.floor((chaScore - 10) / 2);
  const conflictDC = 8 + chaMod;

  return {
    ...baseItem,
    requiresAttunement: true,
    sentience: {
      abilityScores: { INT: intScore, WIS: wisScore, CHA: chaScore },
      communication,
      senses,
      alignment,
      purpose,
      quirk,
      conflictDC,
      conflictNote: SENTIENT_ITEM_RULES.conflictRules.resolution,
    },
  };
}

// ---------------------------------------------------------------------------

/**
 * Returns the full array of all sample magic items.
 *
 * @returns {Array} All entries in SAMPLE_MAGIC_ITEMS
 */
export function getAllMagicItems() {
  return [...SAMPLE_MAGIC_ITEMS];
}
