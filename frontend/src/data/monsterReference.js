/**
 * monsterReference.js
 * DM Monster Reference Sidebar — Data & Helpers
 *
 * Roadmap Items Covered:
 *   - Item 160: DM monster reference sidebar
 *
 * Provides:
 *   - STAT_BLOCK_TEMPLATE: Standard D&D 5e stat block structure
 *   - QUICK_MONSTERS: 20 common monsters as quick-reference stat blocks
 *   - CR_TO_PROFICIENCY: Challenge rating to proficiency bonus mapping (CR 0–30)
 *   - SIZE_CATEGORIES: Size category metadata (hit die, space)
 *
 * Helper Functions:
 *   - getMonster(name)
 *   - getMonstersByCR(cr)
 *   - formatStatBlock(monster)
 *   - calculateModifier(abilityScore)
 *   - getProficiencyBonus(cr)
 *   - getMonstersByType(type)
 *   - searchMonsters(query)
 *
 * No React — pure data and utility functions only.
 */

// ---------------------------------------------------------------------------
// STAT BLOCK TEMPLATE
// ---------------------------------------------------------------------------

export const STAT_BLOCK_TEMPLATE = {
  name: "",
  size: "",           // Tiny | Small | Medium | Large | Huge | Gargantuan
  type: "",           // beast | humanoid | undead | fiend | dragon | etc.
  subtype: "",        // e.g. "goblinoid", "any race"
  alignment: "",
  ac: {
    value: 0,
    source: "",       // e.g. "natural armor", "leather armor", "shield"
  },
  hp: {
    average: 0,
    formula: "",      // e.g. "2d6+2"
  },
  speed: {
    walk: 0,
    fly: 0,
    swim: 0,
    burrow: 0,
    climb: 0,
  },
  abilities: {
    STR: 10,
    DEX: 10,
    CON: 10,
    INT: 10,
    WIS: 10,
    CHA: 10,
  },
  savingThrows: {},   // e.g. { DEX: 4, WIS: 2 }
  skills: {},         // e.g. { Perception: 3, Stealth: 6 }
  damageResistances: [],
  damageImmunities: [],
  conditionImmunities: [],
  senses: {
    darkvision: 0,
    blindsight: 0,
    tremorsense: 0,
    truesight: 0,
    passivePerception: 10,
  },
  languages: [],
  cr: {
    rating: "0",      // stored as string to handle fractions like "1/4"
    xp: 0,
  },
  traits: [],         // [{ name, description }]
  actions: [],        // [{ name, description }]
  bonusActions: [],   // [{ name, description }]
  reactions: [],      // [{ name, description }]
  legendaryActions: {
    count: 0,
    description: "",
    actions: [],      // [{ name, cost, description }]
  },
};

// ---------------------------------------------------------------------------
// QUICK MONSTERS
// ---------------------------------------------------------------------------

export const QUICK_MONSTERS = [
  // -------------------------------------------------------------------------
  // CR 1/8 — Kobold
  // -------------------------------------------------------------------------
  {
    name: "Kobold",
    size: "Small",
    type: "humanoid",
    subtype: "kobold",
    alignment: "Lawful Evil",
    ac: { value: 12, source: "leather armor" },
    hp: { average: 5, formula: "2d6-2" },
    speed: { walk: 30, fly: 0, swim: 0, burrow: 0, climb: 0 },
    abilities: { STR: 7, DEX: 15, CON: 9, INT: 8, WIS: 7, CHA: 8 },
    savingThrows: {},
    skills: {},
    damageResistances: [],
    damageImmunities: [],
    conditionImmunities: [],
    senses: { darkvision: 60, blindsight: 0, tremorsense: 0, truesight: 0, passivePerception: 8 },
    languages: ["Common", "Draconic"],
    cr: { rating: "1/8", xp: 25 },
    traits: [
      { name: "Sunlight Sensitivity", description: "While in sunlight, the kobold has disadvantage on attack rolls and Perception checks that rely on sight." },
      { name: "Pack Tactics", description: "The kobold has advantage on attack rolls against a creature if at least one of its allies is adjacent to the creature and not incapacitated." },
    ],
    actions: [
      { name: "Dagger", description: "Melee or Ranged Weapon Attack: +4 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 4 (1d4+2) piercing damage." },
      { name: "Sling", description: "Ranged Weapon Attack: +4 to hit, range 30/120 ft., one target. Hit: 4 (1d4+2) bludgeoning damage." },
    ],
    bonusActions: [],
    reactions: [],
    legendaryActions: { count: 0, description: "", actions: [] },
  },

  // -------------------------------------------------------------------------
  // CR 1/8 — Bandit
  // -------------------------------------------------------------------------
  {
    name: "Bandit",
    size: "Medium",
    type: "humanoid",
    subtype: "any race",
    alignment: "Any Non-Lawful",
    ac: { value: 12, source: "leather armor" },
    hp: { average: 11, formula: "2d8+2" },
    speed: { walk: 30, fly: 0, swim: 0, burrow: 0, climb: 0 },
    abilities: { STR: 11, DEX: 12, CON: 12, INT: 10, WIS: 10, CHA: 10 },
    savingThrows: {},
    skills: {},
    damageResistances: [],
    damageImmunities: [],
    conditionImmunities: [],
    senses: { darkvision: 0, blindsight: 0, tremorsense: 0, truesight: 0, passivePerception: 10 },
    languages: ["Any one language (usually Common)"],
    cr: { rating: "1/8", xp: 25 },
    traits: [],
    actions: [
      { name: "Scimitar", description: "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6+1) slashing damage." },
      { name: "Light Crossbow", description: "Ranged Weapon Attack: +3 to hit, range 80/320 ft., one target. Hit: 5 (1d8+1) piercing damage." },
    ],
    bonusActions: [],
    reactions: [],
    legendaryActions: { count: 0, description: "", actions: [] },
  },

  // -------------------------------------------------------------------------
  // CR 1/4 — Goblin
  // -------------------------------------------------------------------------
  {
    name: "Goblin",
    size: "Small",
    type: "humanoid",
    subtype: "goblinoid",
    alignment: "Neutral Evil",
    ac: { value: 15, source: "leather armor, shield" },
    hp: { average: 7, formula: "2d6" },
    speed: { walk: 30, fly: 0, swim: 0, burrow: 0, climb: 0 },
    abilities: { STR: 8, DEX: 14, CON: 10, INT: 10, WIS: 8, CHA: 8 },
    savingThrows: {},
    skills: { Stealth: 6 },
    damageResistances: [],
    damageImmunities: [],
    conditionImmunities: [],
    senses: { darkvision: 60, blindsight: 0, tremorsense: 0, truesight: 0, passivePerception: 9 },
    languages: ["Common", "Goblin"],
    cr: { rating: "1/4", xp: 50 },
    traits: [
      { name: "Nimble Escape", description: "The goblin can take the Disengage or Hide action as a bonus action on each of its turns." },
    ],
    actions: [
      { name: "Scimitar", description: "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6+2) slashing damage." },
      { name: "Shortbow", description: "Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target. Hit: 5 (1d6+2) piercing damage." },
    ],
    bonusActions: [
      { name: "Nimble Escape", description: "The goblin takes the Disengage or Hide action." },
    ],
    reactions: [],
    legendaryActions: { count: 0, description: "", actions: [] },
  },

  // -------------------------------------------------------------------------
  // CR 1/4 — Skeleton
  // -------------------------------------------------------------------------
  {
    name: "Skeleton",
    size: "Medium",
    type: "undead",
    subtype: "",
    alignment: "Lawful Evil",
    ac: { value: 13, source: "armor scraps" },
    hp: { average: 13, formula: "2d8+4" },
    speed: { walk: 30, fly: 0, swim: 0, burrow: 0, climb: 0 },
    abilities: { STR: 10, DEX: 14, CON: 15, INT: 6, WIS: 8, CHA: 5 },
    savingThrows: {},
    skills: {},
    damageResistances: [],
    damageImmunities: ["poison"],
    conditionImmunities: ["exhaustion", "poisoned"],
    senses: { darkvision: 60, blindsight: 0, tremorsense: 0, truesight: 0, passivePerception: 9 },
    languages: ["understands all languages it knew in life but can't speak"],
    cr: { rating: "1/4", xp: 50 },
    traits: [],
    actions: [
      { name: "Shortsword", description: "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6+2) piercing damage." },
      { name: "Shortbow", description: "Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target. Hit: 5 (1d6+2) piercing damage." },
    ],
    bonusActions: [],
    reactions: [],
    legendaryActions: { count: 0, description: "", actions: [] },
  },

  // -------------------------------------------------------------------------
  // CR 1/4 — Zombie
  // -------------------------------------------------------------------------
  {
    name: "Zombie",
    size: "Medium",
    type: "undead",
    subtype: "",
    alignment: "Neutral Evil",
    ac: { value: 8, source: "" },
    hp: { average: 22, formula: "3d8+9" },
    speed: { walk: 20, fly: 0, swim: 0, burrow: 0, climb: 0 },
    abilities: { STR: 13, DEX: 6, CON: 16, INT: 3, WIS: 6, CHA: 5 },
    savingThrows: { WIS: 0 },
    skills: {},
    damageResistances: [],
    damageImmunities: ["poison"],
    conditionImmunities: ["poisoned"],
    senses: { darkvision: 60, blindsight: 0, tremorsense: 0, truesight: 0, passivePerception: 8 },
    languages: ["understands the languages it knew in life but can't speak"],
    cr: { rating: "1/4", xp: 50 },
    traits: [
      { name: "Undead Fortitude", description: "If damage reduces the zombie to 0 HP, it must make a CON saving throw with a DC of 5 + damage dealt, unless the damage is radiant or from a critical hit. On success, the zombie drops to 1 HP instead." },
    ],
    actions: [
      { name: "Slam", description: "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6+1) bludgeoning damage." },
    ],
    bonusActions: [],
    reactions: [],
    legendaryActions: { count: 0, description: "", actions: [] },
  },

  // -------------------------------------------------------------------------
  // CR 1/4 — Wolf
  // -------------------------------------------------------------------------
  {
    name: "Wolf",
    size: "Medium",
    type: "beast",
    subtype: "",
    alignment: "Unaligned",
    ac: { value: 13, source: "natural armor" },
    hp: { average: 11, formula: "2d8+2" },
    speed: { walk: 40, fly: 0, swim: 0, burrow: 0, climb: 0 },
    abilities: { STR: 12, DEX: 15, CON: 12, INT: 3, WIS: 12, CHA: 6 },
    savingThrows: {},
    skills: { Perception: 3, Stealth: 4 },
    damageResistances: [],
    damageImmunities: [],
    conditionImmunities: [],
    senses: { darkvision: 0, blindsight: 0, tremorsense: 0, truesight: 0, passivePerception: 13 },
    languages: [],
    cr: { rating: "1/4", xp: 50 },
    traits: [
      { name: "Keen Hearing and Smell", description: "The wolf has advantage on Perception checks that rely on hearing or smell." },
      { name: "Pack Tactics", description: "The wolf has advantage on attack rolls against a creature if at least one ally is adjacent to the creature and not incapacitated." },
    ],
    actions: [
      { name: "Bite", description: "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (2d4+2) piercing damage. If the target is a creature, it must succeed on a DC 11 STR saving throw or be knocked prone." },
    ],
    bonusActions: [],
    reactions: [],
    legendaryActions: { count: 0, description: "", actions: [] },
  },

  // -------------------------------------------------------------------------
  // CR 1/2 — Orc
  // -------------------------------------------------------------------------
  {
    name: "Orc",
    size: "Medium",
    type: "humanoid",
    subtype: "orc",
    alignment: "Chaotic Evil",
    ac: { value: 13, source: "hide armor" },
    hp: { average: 15, formula: "2d8+6" },
    speed: { walk: 30, fly: 0, swim: 0, burrow: 0, climb: 0 },
    abilities: { STR: 16, DEX: 12, CON: 16, INT: 7, WIS: 11, CHA: 10 },
    savingThrows: {},
    skills: { Intimidation: 2 },
    damageResistances: [],
    damageImmunities: [],
    conditionImmunities: [],
    senses: { darkvision: 60, blindsight: 0, tremorsense: 0, truesight: 0, passivePerception: 10 },
    languages: ["Common", "Orc"],
    cr: { rating: "1/2", xp: 100 },
    traits: [
      { name: "Aggressive", description: "As a bonus action, the orc can move up to its speed toward a hostile creature it can see." },
    ],
    actions: [
      { name: "Greataxe", description: "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9 (1d12+3) slashing damage." },
      { name: "Javelin", description: "Melee or Ranged Weapon Attack: +5 to hit, reach 5 ft. or range 30/120 ft., one target. Hit: 6 (1d6+3) piercing damage." },
    ],
    bonusActions: [
      { name: "Aggressive", description: "The orc moves up to its speed toward a hostile creature it can see." },
    ],
    reactions: [],
    legendaryActions: { count: 0, description: "", actions: [] },
  },

  // -------------------------------------------------------------------------
  // CR 1 — Giant Spider
  // -------------------------------------------------------------------------
  {
    name: "Giant Spider",
    size: "Large",
    type: "beast",
    subtype: "",
    alignment: "Unaligned",
    ac: { value: 14, source: "natural armor" },
    hp: { average: 26, formula: "4d10+4" },
    speed: { walk: 30, fly: 0, swim: 0, burrow: 0, climb: 30 },
    abilities: { STR: 14, DEX: 16, CON: 12, INT: 2, WIS: 11, CHA: 4 },
    savingThrows: {},
    skills: { Stealth: 7 },
    damageResistances: [],
    damageImmunities: [],
    conditionImmunities: [],
    senses: { darkvision: 60, blindsight: 10, tremorsense: 0, truesight: 0, passivePerception: 10 },
    languages: [],
    cr: { rating: "1", xp: 200 },
    traits: [
      { name: "Spider Climb", description: "The spider can climb difficult surfaces, including upside down on ceilings, without needing an ability check." },
      { name: "Web Sense", description: "While in contact with a web, the spider knows the exact location of any other creature in contact with the same web." },
      { name: "Web Walker", description: "The spider ignores movement restrictions caused by webbing." },
    ],
    actions: [
      { name: "Bite", description: "Melee Weapon Attack: +5 to hit, reach 5 ft., one creature. Hit: 7 (1d8+3) piercing damage, and the target must make a DC 11 CON saving throw, taking 9 (2d8) poison damage on a failed save, or half as much on a success. If the poison damage reduces to 0 HP, the target is stable but poisoned for 1 hour, even after regaining HP, and is paralyzed while poisoned this way." },
      { name: "Web (Recharge 5–6)", description: "Ranged Weapon Attack: +5 to hit, range 30/60 ft., one creature. Hit: The target is restrained by webbing. As an action, the restrained target can make a DC 12 STR check, bursting the webbing on a success. The webbing can also be attacked and destroyed (AC 10; HP 5; vulnerability to fire; immunity to bludgeoning, poison, and psychic damage)." },
    ],
    bonusActions: [],
    reactions: [],
    legendaryActions: { count: 0, description: "", actions: [] },
  },

  // -------------------------------------------------------------------------
  // CR 2 — Ogre
  // -------------------------------------------------------------------------
  {
    name: "Ogre",
    size: "Large",
    type: "giant",
    subtype: "",
    alignment: "Chaotic Evil",
    ac: { value: 11, source: "hide armor" },
    hp: { average: 59, formula: "7d10+21" },
    speed: { walk: 40, fly: 0, swim: 0, burrow: 0, climb: 0 },
    abilities: { STR: 19, DEX: 8, CON: 16, INT: 5, WIS: 7, CHA: 7 },
    savingThrows: {},
    skills: {},
    damageResistances: [],
    damageImmunities: [],
    conditionImmunities: [],
    senses: { darkvision: 60, blindsight: 0, tremorsense: 0, truesight: 0, passivePerception: 8 },
    languages: ["Common", "Giant"],
    cr: { rating: "2", xp: 450 },
    traits: [],
    actions: [
      { name: "Greatclub", description: "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 13 (2d8+4) bludgeoning damage." },
      { name: "Javelin", description: "Melee or Ranged Weapon Attack: +6 to hit, reach 5 ft. or range 30/120 ft., one target. Hit: 11 (2d6+4) piercing damage." },
    ],
    bonusActions: [],
    reactions: [],
    legendaryActions: { count: 0, description: "", actions: [] },
  },

  // -------------------------------------------------------------------------
  // CR 2 — Mimic
  // -------------------------------------------------------------------------
  {
    name: "Mimic",
    size: "Medium",
    type: "monstrosity",
    subtype: "shapechanger",
    alignment: "Neutral",
    ac: { value: 12, source: "natural armor" },
    hp: { average: 58, formula: "9d8+18" },
    speed: { walk: 15, fly: 0, swim: 0, burrow: 0, climb: 15 },
    abilities: { STR: 17, DEX: 12, CON: 15, INT: 5, WIS: 13, CHA: 8 },
    savingThrows: {},
    skills: { Stealth: 5 },
    damageResistances: [],
    damageImmunities: ["acid"],
    conditionImmunities: ["prone"],
    senses: { darkvision: 60, blindsight: 0, tremorsense: 0, truesight: 0, passivePerception: 11 },
    languages: [],
    cr: { rating: "2", xp: 450 },
    traits: [
      { name: "Shapechanger", description: "The mimic can use its action to polymorph into an object or back into its true, amorphous form. Its statistics are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies." },
      { name: "Adhesive (Object Form Only)", description: "The mimic adheres to anything that touches it. A Huge or smaller creature adhered to the mimic is also grappled (escape DC 13). Ability checks made to escape this grapple have disadvantage." },
      { name: "False Appearance (Object Form Only)", description: "While the mimic remains motionless, it is indistinguishable from an ordinary object." },
      { name: "Grappler", description: "The mimic has advantage on attack rolls against any creature grappled by it." },
    ],
    actions: [
      { name: "Pseudopod", description: "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8+3) bludgeoning damage. If the mimic is in object form, the target is subjected to its Adhesive trait." },
      { name: "Bite", description: "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8+3) piercing damage plus 4 (1d8) acid damage." },
    ],
    bonusActions: [],
    reactions: [],
    legendaryActions: { count: 0, description: "", actions: [] },
  },

  // -------------------------------------------------------------------------
  // CR 2 — Gelatinous Cube
  // -------------------------------------------------------------------------
  {
    name: "Gelatinous Cube",
    size: "Large",
    type: "ooze",
    subtype: "",
    alignment: "Unaligned",
    ac: { value: 6, source: "" },
    hp: { average: 84, formula: "8d10+40" },
    speed: { walk: 15, fly: 0, swim: 0, burrow: 0, climb: 0 },
    abilities: { STR: 14, DEX: 3, CON: 20, INT: 1, WIS: 6, CHA: 1 },
    savingThrows: {},
    skills: {},
    damageResistances: [],
    damageImmunities: [],
    conditionImmunities: ["blinded", "charmed", "deafened", "exhaustion", "frightened", "prone"],
    senses: { darkvision: 0, blindsight: 60, tremorsense: 0, truesight: 0, passivePerception: 8 },
    languages: [],
    cr: { rating: "2", xp: 450 },
    traits: [
      { name: "Ooze Cube", description: "The cube takes up its entire space. Other creatures can enter the space, but a creature that does so is subjected to the cube's Engulf and has disadvantage on saving throws against it. Creatures inside the cube can be seen but have total cover. A creature within 5 ft. of the cube can take an action to pull a creature or object out of the cube. Doing so requires a DC 12 STR check, and the creature making the attempt takes 10 (3d6) acid damage. The cube can hold only one Large creature or up to four Medium or smaller creatures inside it at a time." },
      { name: "Transparent", description: "Even when the cube is in plain sight, it takes a successful DC 15 Perception check to spot it if it has neither moved nor attacked. A creature that tries to enter the cube's space while unaware of it is surprised by the cube." },
    ],
    actions: [
      { name: "Pseudopod", description: "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 10 (3d6) acid damage." },
      { name: "Engulf", description: "The cube moves up to its speed. While doing so, it can enter Large or smaller creatures' spaces. Whenever the cube enters a creature's space, the creature must make a DC 12 DEX saving throw. On a successful save, the creature can choose to be pushed 5 ft. back or to the side of the cube. A creature that chooses not to be pushed suffers the consequences of a failed saving throw. On a failed save, the cube enters the creature's space, and the creature takes 10 (3d6) acid damage and is engulfed." },
    ],
    bonusActions: [],
    reactions: [],
    legendaryActions: { count: 0, description: "", actions: [] },
  },

  // -------------------------------------------------------------------------
  // CR 3 — Owlbear
  // -------------------------------------------------------------------------
  {
    name: "Owlbear",
    size: "Large",
    type: "monstrosity",
    subtype: "",
    alignment: "Unaligned",
    ac: { value: 13, source: "natural armor" },
    hp: { average: 59, formula: "7d10+21" },
    speed: { walk: 40, fly: 0, swim: 0, burrow: 0, climb: 0 },
    abilities: { STR: 20, DEX: 12, CON: 17, INT: 3, WIS: 12, CHA: 7 },
    savingThrows: {},
    skills: { Perception: 3 },
    damageResistances: [],
    damageImmunities: [],
    conditionImmunities: [],
    senses: { darkvision: 60, blindsight: 0, tremorsense: 0, truesight: 0, passivePerception: 13 },
    languages: [],
    cr: { rating: "3", xp: 700 },
    traits: [
      { name: "Keen Sight and Smell", description: "The owlbear has advantage on Perception checks that rely on sight or smell." },
    ],
    actions: [
      { name: "Multiattack", description: "The owlbear makes two attacks: one with its beak and one with its claws." },
      { name: "Beak", description: "Melee Weapon Attack: +7 to hit, reach 5 ft., one creature. Hit: 10 (1d10+5) piercing damage." },
      { name: "Claws", description: "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 14 (2d8+5) slashing damage." },
    ],
    bonusActions: [],
    reactions: [],
    legendaryActions: { count: 0, description: "", actions: [] },
  },

  // -------------------------------------------------------------------------
  // CR 3 — Basilisk
  // -------------------------------------------------------------------------
  {
    name: "Basilisk",
    size: "Medium",
    type: "monstrosity",
    subtype: "",
    alignment: "Unaligned",
    ac: { value: 15, source: "natural armor" },
    hp: { average: 52, formula: "8d8+16" },
    speed: { walk: 20, fly: 0, swim: 0, burrow: 0, climb: 0 },
    abilities: { STR: 16, DEX: 8, CON: 15, INT: 2, WIS: 8, CHA: 7 },
    savingThrows: {},
    skills: {},
    damageResistances: [],
    damageImmunities: [],
    conditionImmunities: [],
    senses: { darkvision: 60, blindsight: 0, tremorsense: 0, truesight: 0, passivePerception: 9 },
    languages: [],
    cr: { rating: "3", xp: 700 },
    traits: [
      { name: "Petrifying Gaze", description: "If a creature starts its turn within 30 ft. of the basilisk and the two can see each other, the basilisk can force the creature to make a DC 12 CON saving throw if the basilisk isn't incapacitated. On a failed save, the creature magically begins to turn to stone and is restrained. The restrained creature must repeat the saving throw at the end of its next turn. On a success, the effect ends. On a failure, the creature is petrified until freed by the greater restoration spell or other magic. A creature that isn't surprised can avert its eyes to avoid the saving throw at the start of its turn. If the creature does so, it can't see the basilisk until the start of its next turn, when it can avert its eyes again. If the creature looks at the basilisk in the meantime, it must immediately make the save. If the basilisk sees itself reflected on a polished surface within 30 ft. of it and in an area of bright light, the basilisk is, due to its curse, affected by its own gaze." },
    ],
    actions: [
      { name: "Bite", description: "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6+3) piercing damage plus 7 (2d6) poison damage." },
    ],
    bonusActions: [],
    reactions: [],
    legendaryActions: { count: 0, description: "", actions: [] },
  },

  // -------------------------------------------------------------------------
  // CR 3 — Manticore
  // -------------------------------------------------------------------------
  {
    name: "Manticore",
    size: "Large",
    type: "monstrosity",
    subtype: "",
    alignment: "Lawful Evil",
    ac: { value: 14, source: "natural armor" },
    hp: { average: 68, formula: "8d10+24" },
    speed: { walk: 30, fly: 50, swim: 0, burrow: 0, climb: 0 },
    abilities: { STR: 17, DEX: 16, CON: 17, INT: 7, WIS: 12, CHA: 8 },
    savingThrows: {},
    skills: {},
    damageResistances: [],
    damageImmunities: [],
    conditionImmunities: [],
    senses: { darkvision: 60, blindsight: 0, tremorsense: 0, truesight: 0, passivePerception: 11 },
    languages: ["Common"],
    cr: { rating: "3", xp: 700 },
    traits: [
      { name: "Tail Spike Regrowth", description: "The manticore has twenty-four tail spikes. Used spikes regrow when the manticore finishes a long rest." },
    ],
    actions: [
      { name: "Multiattack", description: "The manticore makes three attacks: one with its bite and two with its claws or three with its tail spikes." },
      { name: "Bite", description: "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8+3) piercing damage." },
      { name: "Claw", description: "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6+3) slashing damage." },
      { name: "Tail Spike", description: "Ranged Weapon Attack: +5 to hit, range 100/200 ft., one target. Hit: 7 (1d8+3) piercing damage." },
    ],
    bonusActions: [],
    reactions: [],
    legendaryActions: { count: 0, description: "", actions: [] },
  },

  // -------------------------------------------------------------------------
  // CR 5 — Troll
  // -------------------------------------------------------------------------
  {
    name: "Troll",
    size: "Large",
    type: "giant",
    subtype: "",
    alignment: "Chaotic Evil",
    ac: { value: 15, source: "natural armor" },
    hp: { average: 84, formula: "8d10+40" },
    speed: { walk: 30, fly: 0, swim: 0, burrow: 0, climb: 0 },
    abilities: { STR: 18, DEX: 13, CON: 20, INT: 7, WIS: 9, CHA: 7 },
    savingThrows: {},
    skills: { Perception: 2 },
    damageResistances: [],
    damageImmunities: [],
    conditionImmunities: [],
    senses: { darkvision: 60, blindsight: 0, tremorsense: 0, truesight: 0, passivePerception: 12 },
    languages: ["Giant"],
    cr: { rating: "5", xp: 1800 },
    traits: [
      { name: "Keen Smell", description: "The troll has advantage on Perception checks that rely on smell." },
      { name: "Regeneration", description: "The troll regains 10 HP at the start of its turn. If the troll takes acid or fire damage, this trait doesn't function at the start of the troll's next turn. The troll dies only if it starts its turn with 0 HP and doesn't regenerate." },
    ],
    actions: [
      { name: "Multiattack", description: "The troll makes three attacks: one with its bite and two with its claws." },
      { name: "Bite", description: "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 7 (1d6+4) piercing damage." },
      { name: "Claw", description: "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6+4) slashing damage." },
    ],
    bonusActions: [],
    reactions: [],
    legendaryActions: { count: 0, description: "", actions: [] },
  },

  // -------------------------------------------------------------------------
  // CR 6 — Wyvern
  // -------------------------------------------------------------------------
  {
    name: "Wyvern",
    size: "Large",
    type: "dragon",
    subtype: "",
    alignment: "Unaligned",
    ac: { value: 13, source: "natural armor" },
    hp: { average: 110, formula: "13d10+39" },
    speed: { walk: 20, fly: 80, swim: 0, burrow: 0, climb: 0 },
    abilities: { STR: 19, DEX: 10, CON: 16, INT: 5, WIS: 12, CHA: 6 },
    savingThrows: {},
    skills: { Perception: 4 },
    damageResistances: [],
    damageImmunities: [],
    conditionImmunities: [],
    senses: { darkvision: 60, blindsight: 0, tremorsense: 0, truesight: 0, passivePerception: 14 },
    languages: [],
    cr: { rating: "6", xp: 2300 },
    traits: [],
    actions: [
      { name: "Multiattack", description: "The wyvern makes two attacks: one with its bite and one with its stinger. While flying, it can use its claws in place of one other attack." },
      { name: "Bite", description: "Melee Weapon Attack: +7 to hit, reach 10 ft., one creature. Hit: 11 (2d6+4) piercing damage." },
      { name: "Claws", description: "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 13 (2d8+4) slashing damage." },
      { name: "Stinger", description: "Melee Weapon Attack: +7 to hit, reach 10 ft., one creature. Hit: 11 (2d6+4) piercing damage. The target must make a DC 15 CON saving throw, taking 24 (7d6) poison damage on a failed save, or half as much on a success." },
    ],
    bonusActions: [],
    reactions: [],
    legendaryActions: { count: 0, description: "", actions: [] },
  },

  // -------------------------------------------------------------------------
  // CR 10 — Young Red Dragon
  // -------------------------------------------------------------------------
  {
    name: "Young Red Dragon",
    size: "Large",
    type: "dragon",
    subtype: "",
    alignment: "Chaotic Evil",
    ac: { value: 18, source: "natural armor" },
    hp: { average: 178, formula: "17d10+85" },
    speed: { walk: 40, fly: 80, swim: 0, burrow: 0, climb: 40 },
    abilities: { STR: 23, DEX: 10, CON: 21, INT: 14, WIS: 11, CHA: 19 },
    savingThrows: { DEX: 4, CON: 9, WIS: 4, CHA: 8 },
    skills: { Perception: 8, Stealth: 4 },
    damageResistances: [],
    damageImmunities: ["fire"],
    conditionImmunities: [],
    senses: { darkvision: 120, blindsight: 30, tremorsense: 0, truesight: 0, passivePerception: 18 },
    languages: ["Common", "Draconic"],
    cr: { rating: "10", xp: 5900 },
    traits: [],
    actions: [
      { name: "Multiattack", description: "The dragon makes three attacks: one with its bite and two with its claws." },
      { name: "Bite", description: "Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 17 (2d10+6) piercing damage plus 3 (1d6) fire damage." },
      { name: "Claw", description: "Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 13 (2d6+6) slashing damage." },
      { name: "Fire Breath (Recharge 5–6)", description: "The dragon exhales fire in a 30-foot cone. Each creature in that area must make a DC 17 DEX saving throw, taking 56 (16d6) fire damage on a failed save, or half as much on a successful one." },
    ],
    bonusActions: [],
    reactions: [],
    legendaryActions: { count: 0, description: "", actions: [] },
  },

  // -------------------------------------------------------------------------
  // CR 13 — Beholder
  // -------------------------------------------------------------------------
  {
    name: "Beholder",
    size: "Large",
    type: "aberration",
    subtype: "",
    alignment: "Lawful Evil",
    ac: { value: 18, source: "natural armor" },
    hp: { average: 180, formula: "19d10+76" },
    speed: { walk: 0, fly: 20, swim: 0, burrow: 0, climb: 0 },
    abilities: { STR: 10, DEX: 14, CON: 18, INT: 17, WIS: 15, CHA: 17 },
    savingThrows: { INT: 8, WIS: 7, CHA: 8 },
    skills: { Perception: 12 },
    damageResistances: [],
    damageImmunities: [],
    conditionImmunities: ["prone"],
    senses: { darkvision: 120, blindsight: 0, tremorsense: 0, truesight: 0, passivePerception: 22 },
    languages: ["Deep Speech", "Undercommon"],
    cr: { rating: "13", xp: 10000 },
    traits: [
      { name: "Antimagic Cone", description: "The beholder's central eye creates an area of antimagic, as in the antimagic field spell, in a 150-foot cone. At the start of each of its turns, the beholder decides which way the cone faces and whether the cone is active. The area works against the beholder's own eye rays." },
    ],
    actions: [
      { name: "Bite", description: "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 14 (4d6) piercing damage." },
      { name: "Eye Rays", description: "The beholder shoots three of the following magical eye rays at random (reroll duplicates), choosing one to three targets it can see within 120 ft.: 1-Charm Ray, 2-Paralyzing Ray, 3-Fear Ray, 4-Slowing Ray, 5-Enervation Ray, 6-Telekinetic Ray, 7-Sleep Ray, 8-Petrification Ray, 9-Disintegration Ray, 10-Death Ray. See stat block for individual ray details." },
    ],
    bonusActions: [],
    reactions: [],
    legendaryActions: {
      count: 3,
      description: "The beholder can take 3 legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature's turn. The beholder regains spent legendary actions at the start of its turn.",
      actions: [
        { name: "Eye Ray", cost: 1, description: "The beholder uses one random eye ray." },
      ],
    },
  },

  // -------------------------------------------------------------------------
  // CR 17 — Adult Red Dragon
  // -------------------------------------------------------------------------
  {
    name: "Adult Red Dragon",
    size: "Huge",
    type: "dragon",
    subtype: "",
    alignment: "Chaotic Evil",
    ac: { value: 19, source: "natural armor" },
    hp: { average: 256, formula: "19d12+133" },
    speed: { walk: 40, fly: 80, swim: 0, burrow: 0, climb: 40 },
    abilities: { STR: 27, DEX: 10, CON: 25, INT: 16, WIS: 13, CHA: 21 },
    savingThrows: { DEX: 6, CON: 13, WIS: 7, CHA: 11 },
    skills: { Perception: 13, Stealth: 6 },
    damageResistances: [],
    damageImmunities: ["fire"],
    conditionImmunities: [],
    senses: { darkvision: 120, blindsight: 60, tremorsense: 0, truesight: 0, passivePerception: 23 },
    languages: ["Common", "Draconic"],
    cr: { rating: "17", xp: 18000 },
    traits: [
      { name: "Legendary Resistance (3/Day)", description: "If the dragon fails a saving throw, it can choose to succeed instead." },
    ],
    actions: [
      { name: "Multiattack", description: "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws." },
      { name: "Bite", description: "Melee Weapon Attack: +14 to hit, reach 10 ft., one target. Hit: 19 (2d10+8) piercing damage plus 7 (2d6) fire damage." },
      { name: "Claw", description: "Melee Weapon Attack: +14 to hit, reach 5 ft., one target. Hit: 15 (2d6+8) slashing damage." },
      { name: "Tail", description: "Melee Weapon Attack: +14 to hit, reach 15 ft., one target. Hit: 17 (2d8+8) bludgeoning damage." },
      { name: "Frightful Presence", description: "Each creature of the dragon's choice within 120 ft. that is aware of it must succeed on a DC 19 WIS saving throw or become frightened for 1 minute." },
      { name: "Fire Breath (Recharge 5–6)", description: "The dragon exhales fire in a 60-foot cone. Each creature in that area must make a DC 21 DEX saving throw, taking 63 (18d6) fire damage on a failed save, or half as much on a success." },
    ],
    bonusActions: [],
    reactions: [],
    legendaryActions: {
      count: 3,
      description: "The dragon can take 3 legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature's turn. The dragon regains spent legendary actions at the start of its turn.",
      actions: [
        { name: "Detect", cost: 1, description: "The dragon makes a Perception check." },
        { name: "Tail Attack", cost: 1, description: "The dragon makes a tail attack." },
        { name: "Wing Attack (Costs 2 Actions)", cost: 2, description: "The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 22 DEX saving throw or take 15 (2d6+8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed." },
      ],
    },
  },

  // -------------------------------------------------------------------------
  // CR 21 — Lich
  // -------------------------------------------------------------------------
  {
    name: "Lich",
    size: "Medium",
    type: "undead",
    subtype: "",
    alignment: "Any Evil",
    ac: { value: 17, source: "natural armor" },
    hp: { average: 135, formula: "18d8+54" },
    speed: { walk: 30, fly: 0, swim: 0, burrow: 0, climb: 0 },
    abilities: { STR: 11, DEX: 16, CON: 16, INT: 20, WIS: 14, CHA: 16 },
    savingThrows: { CON: 10, INT: 12, WIS: 9 },
    skills: { Arcana: 19, History: 12, Insight: 9, Perception: 9 },
    damageResistances: ["cold", "lightning", "necrotic"],
    damageImmunities: ["poison", "bludgeoning, piercing, and slashing from nonmagical attacks"],
    conditionImmunities: ["charmed", "exhaustion", "frightened", "paralyzed", "poisoned"],
    senses: { darkvision: 120, blindsight: 0, tremorsense: 0, truesight: 0, passivePerception: 19 },
    languages: ["Common plus up to five other languages"],
    cr: { rating: "21", xp: 33000 },
    traits: [
      { name: "Legendary Resistance (3/Day)", description: "If the lich fails a saving throw, it can choose to succeed instead." },
      { name: "Rejuvenation", description: "If it has a phylactery, a destroyed lich gains a new body in 1d10 days, regaining all its hit points and becoming active again. The new body appears within 5 feet of the phylactery." },
      { name: "Spellcasting", description: "The lich is an 18th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 20, +12 to hit with spell attacks). The lich has the following wizard spells prepared: Cantrips (at will): mage hand, prestidigitation, ray of frost. 1st level (4 slots): detect magic, magic missile, shield, thunderwave. 2nd level (3 slots): detect thoughts, invisibility, Melf's acid arrow, mirror image. 3rd level (3 slots): animate dead, counterspell, dispel magic, fireball. 4th level (3 slots): blight, dimension door. 5th level (3 slots): cloudkill, scrying. 6th level (1 slot): disintegrate, globe of invulnerability. 7th level (1 slot): finger of death, plane shift. 8th level (1 slot): dominate monster, power word stun. 9th level (1 slot): power word kill." },
      { name: "Turn Resistance", description: "The lich has advantage on saving throws against any effect that turns undead." },
    ],
    actions: [
      { name: "Paralyzing Touch", description: "Melee Spell Attack: +12 to hit, reach 5 ft., one creature. Hit: 10 (3d6) cold damage. The target must succeed on a DC 18 CON saving throw or be paralyzed for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success." },
    ],
    bonusActions: [],
    reactions: [],
    legendaryActions: {
      count: 3,
      description: "The lich can take 3 legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature's turn. The lich regains spent legendary actions at the start of its turn.",
      actions: [
        { name: "Cantrip", cost: 1, description: "The lich casts a cantrip." },
        { name: "Paralyzing Touch (Costs 2 Actions)", cost: 2, description: "The lich uses its Paralyzing Touch." },
        { name: "Frightening Gaze (Costs 2 Actions)", cost: 2, description: "The lich fixes its gaze on one creature it can see within 10 feet of it. The target must succeed on a DC 18 WIS saving throw against this magic or become frightened for 1 minute. The frightened target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a target's saving throw is successful or the effect ends for it, the target is immune to the lich's gaze for the next 24 hours." },
        { name: "Disrupt Life (Costs 3 Actions)", cost: 3, description: "Each non-undead creature within 20 feet of the lich must make a DC 18 CON saving throw against this magic, taking 21 (6d6) necrotic damage on a failed save, or half as much damage on a successful one." },
      ],
    },
  },
];

// ---------------------------------------------------------------------------
// CR TO PROFICIENCY BONUS
// ---------------------------------------------------------------------------

export const CR_TO_PROFICIENCY = {
  "0":    2,
  "1/8":  2,
  "1/4":  2,
  "1/2":  2,
  "1":    2,
  "2":    2,
  "3":    2,
  "4":    2,
  "5":    3,
  "6":    3,
  "7":    3,
  "8":    3,
  "9":    4,
  "10":   4,
  "11":   4,
  "12":   4,
  "13":   5,
  "14":   5,
  "15":   5,
  "16":   5,
  "17":   6,
  "18":   6,
  "19":   6,
  "20":   6,
  "21":   7,
  "22":   7,
  "23":   7,
  "24":   7,
  "25":   8,
  "26":   8,
  "27":   8,
  "28":   8,
  "29":   9,
  "30":   9,
};

// ---------------------------------------------------------------------------
// SIZE CATEGORIES
// ---------------------------------------------------------------------------

export const SIZE_CATEGORIES = {
  Tiny: {
    hitDie: "d4",
    spaceInFeet: "2.5 × 2.5",
    description: "Tiny creatures occupy a 2.5 ft. by 2.5 ft. space.",
  },
  Small: {
    hitDie: "d6",
    spaceInFeet: "5 × 5",
    description: "Small creatures occupy a 5 ft. by 5 ft. space.",
  },
  Medium: {
    hitDie: "d8",
    spaceInFeet: "5 × 5",
    description: "Medium creatures occupy a 5 ft. by 5 ft. space.",
  },
  Large: {
    hitDie: "d10",
    spaceInFeet: "10 × 10",
    description: "Large creatures occupy a 10 ft. by 10 ft. space.",
  },
  Huge: {
    hitDie: "d12",
    spaceInFeet: "15 × 15",
    description: "Huge creatures occupy a 15 ft. by 15 ft. space.",
  },
  Gargantuan: {
    hitDie: "d20",
    spaceInFeet: "20 × 20",
    description: "Gargantuan creatures occupy a 20 ft. by 20 ft. space (or larger).",
  },
};

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Retrieve a monster from QUICK_MONSTERS by name (case-insensitive).
 * Returns the monster object or null if not found.
 *
 * @param {string} name
 * @returns {object|null}
 */
export function getMonster(name) {
  if (!name) return null;
  const normalized = name.trim().toLowerCase();
  return QUICK_MONSTERS.find((m) => m.name.toLowerCase() === normalized) || null;
}

/**
 * Retrieve all monsters matching the given CR rating string (e.g. "1/4", "5", "21").
 *
 * @param {string} cr
 * @returns {object[]}
 */
export function getMonstersByCR(cr) {
  if (cr === undefined || cr === null) return [];
  const normalized = String(cr).trim();
  return QUICK_MONSTERS.filter((m) => m.cr.rating === normalized);
}

/**
 * Format a monster's stat block into a human-readable plain-text string.
 * Suitable for display in sidebars, tooltips, or plain text areas.
 *
 * @param {object} monster
 * @returns {string}
 */
export function formatStatBlock(monster) {
  if (!monster) return "";

  const lines = [];
  const mod = (score) => {
    const m = calculateModifier(score);
    return m >= 0 ? `+${m}` : `${m}`;
  };

  // Header
  lines.push(`${monster.name}`);
  const subtypeStr = monster.subtype ? ` (${monster.subtype})` : "";
  lines.push(`${monster.size} ${monster.type}${subtypeStr}, ${monster.alignment}`);
  lines.push("");

  // Defenses
  lines.push(`AC: ${monster.ac.value}${monster.ac.source ? ` (${monster.ac.source})` : ""}`);
  lines.push(`HP: ${monster.hp.average} (${monster.hp.formula})`);

  const speedParts = [];
  if (monster.speed.walk) speedParts.push(`${monster.speed.walk} ft.`);
  if (monster.speed.fly) speedParts.push(`fly ${monster.speed.fly} ft.`);
  if (monster.speed.swim) speedParts.push(`swim ${monster.speed.swim} ft.`);
  if (monster.speed.burrow) speedParts.push(`burrow ${monster.speed.burrow} ft.`);
  if (monster.speed.climb) speedParts.push(`climb ${monster.speed.climb} ft.`);
  lines.push(`Speed: ${speedParts.join(", ") || "0 ft."}`);
  lines.push("");

  // Ability scores
  const { STR, DEX, CON, INT, WIS, CHA } = monster.abilities;
  lines.push(
    `STR ${STR} (${mod(STR)})  DEX ${DEX} (${mod(DEX)})  CON ${CON} (${mod(CON)})  INT ${INT} (${mod(INT)})  WIS ${WIS} (${mod(WIS)})  CHA ${CHA} (${mod(CHA)})`
  );
  lines.push("");

  // Saving throws
  const savingThrowKeys = Object.keys(monster.savingThrows);
  if (savingThrowKeys.length) {
    const saveStr = savingThrowKeys
      .map((k) => `${k} ${monster.savingThrows[k] >= 0 ? "+" : ""}${monster.savingThrows[k]}`)
      .join(", ");
    lines.push(`Saving Throws: ${saveStr}`);
  }

  // Skills
  const skillKeys = Object.keys(monster.skills);
  if (skillKeys.length) {
    const skillStr = skillKeys
      .map((k) => `${k} ${monster.skills[k] >= 0 ? "+" : ""}${monster.skills[k]}`)
      .join(", ");
    lines.push(`Skills: ${skillStr}`);
  }

  if (monster.damageResistances.length) {
    lines.push(`Damage Resistances: ${monster.damageResistances.join(", ")}`);
  }
  if (monster.damageImmunities.length) {
    lines.push(`Damage Immunities: ${monster.damageImmunities.join(", ")}`);
  }
  if (monster.conditionImmunities.length) {
    lines.push(`Condition Immunities: ${monster.conditionImmunities.join(", ")}`);
  }

  // Senses
  const senseParts = [];
  if (monster.senses.darkvision) senseParts.push(`darkvision ${monster.senses.darkvision} ft.`);
  if (monster.senses.blindsight) senseParts.push(`blindsight ${monster.senses.blindsight} ft.`);
  if (monster.senses.tremorsense) senseParts.push(`tremorsense ${monster.senses.tremorsense} ft.`);
  if (monster.senses.truesight) senseParts.push(`truesight ${monster.senses.truesight} ft.`);
  senseParts.push(`passive Perception ${monster.senses.passivePerception}`);
  lines.push(`Senses: ${senseParts.join(", ")}`);

  if (monster.languages.length) {
    lines.push(`Languages: ${monster.languages.join(", ")}`);
  } else {
    lines.push("Languages: —");
  }

  lines.push(`CR: ${monster.cr.rating} (${monster.cr.xp.toLocaleString()} XP)`);
  lines.push("");

  // Traits
  if (monster.traits.length) {
    monster.traits.forEach((t) => {
      lines.push(`${t.name}. ${t.description}`);
      lines.push("");
    });
  }

  // Actions
  if (monster.actions.length) {
    lines.push("ACTIONS");
    monster.actions.forEach((a) => {
      lines.push(`${a.name}. ${a.description}`);
      lines.push("");
    });
  }

  // Bonus Actions
  if (monster.bonusActions.length) {
    lines.push("BONUS ACTIONS");
    monster.bonusActions.forEach((a) => {
      lines.push(`${a.name}. ${a.description}`);
      lines.push("");
    });
  }

  // Reactions
  if (monster.reactions.length) {
    lines.push("REACTIONS");
    monster.reactions.forEach((r) => {
      lines.push(`${r.name}. ${r.description}`);
      lines.push("");
    });
  }

  // Legendary Actions
  if (monster.legendaryActions.count > 0) {
    lines.push("LEGENDARY ACTIONS");
    if (monster.legendaryActions.description) {
      lines.push(monster.legendaryActions.description);
      lines.push("");
    }
    monster.legendaryActions.actions.forEach((la) => {
      const costStr = la.cost > 1 ? ` (Costs ${la.cost} Actions)` : "";
      lines.push(`${la.name}${costStr}. ${la.description}`);
    });
  }

  return lines.join("\n").trim();
}

/**
 * Calculate the D&D 5e ability score modifier for a given ability score.
 *
 * @param {number} abilityScore
 * @returns {number}
 */
export function calculateModifier(abilityScore) {
  return Math.floor((abilityScore - 10) / 2);
}

/**
 * Look up the proficiency bonus for a given CR rating string.
 * Returns 2 if the CR is not found in the table.
 *
 * @param {string|number} cr
 * @returns {number}
 */
export function getProficiencyBonus(cr) {
  const key = String(cr).trim();
  return CR_TO_PROFICIENCY[key] !== undefined ? CR_TO_PROFICIENCY[key] : 2;
}

/**
 * Retrieve all monsters matching the given creature type (case-insensitive).
 * Examples: "beast", "undead", "humanoid", "dragon"
 *
 * @param {string} type
 * @returns {object[]}
 */
export function getMonstersByType(type) {
  if (!type) return [];
  const normalized = type.trim().toLowerCase();
  return QUICK_MONSTERS.filter((m) => m.type.toLowerCase() === normalized);
}

/**
 * Search monsters by a query string, matching against name, type, subtype,
 * alignment, and CR rating. Case-insensitive. Returns an array of matching
 * monster objects sorted by CR (ascending).
 *
 * @param {string} query
 * @returns {object[]}
 */
export function searchMonsters(query) {
  if (!query) return [...QUICK_MONSTERS];

  const q = query.trim().toLowerCase();

  const crOrder = [
    "0", "1/8", "1/4", "1/2",
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
    "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
    "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
  ];

  const matches = QUICK_MONSTERS.filter((m) => {
    return (
      m.name.toLowerCase().includes(q) ||
      m.type.toLowerCase().includes(q) ||
      m.subtype.toLowerCase().includes(q) ||
      m.alignment.toLowerCase().includes(q) ||
      m.cr.rating === q
    );
  });

  return matches.sort((a, b) => {
    const ai = crOrder.indexOf(a.cr.rating);
    const bi = crOrder.indexOf(b.cr.rating);
    const aIdx = ai === -1 ? 999 : ai;
    const bIdx = bi === -1 ? 999 : bi;
    return aIdx - bIdx;
  });
}
