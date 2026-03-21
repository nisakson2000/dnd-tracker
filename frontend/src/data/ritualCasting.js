/**
 * @file ritualCasting.js
 * @description Ritual casting rules, spell data, and helper functions for D&D 5e.
 *
 * Roadmap items covered:
 *   - #99: Ritual casting auto-detect
 *
 * Exports:
 *   - RITUAL_RULES               — Core rules governing ritual casting
 *   - RITUAL_CASTER_FEAT         — Rules for the Ritual Caster feat
 *   - RITUAL_SPELLS              — Comprehensive list of ritual-tagged spells by level
 *   - CLASS_RITUAL_RULES         — Per-class ritual casting rules and requirements
 *   - canCastAsRitual(spellName, characterClass, knownSpells, preparedSpells, features)
 *   - getRitualSpells(characterClass)
 *   - getRitualCastingTime(spellName)
 *   - getAllRitualSpells()
 *   - isRitualSpell(spellName)
 *
 * No React imports. Pure data and utility exports only.
 */

// ---------------------------------------------------------------------------
// 1. RITUAL_RULES
// ---------------------------------------------------------------------------

/**
 * Core D&D 5e rules for ritual casting.
 * PHB p. 202; applies to all classes unless overridden by CLASS_RITUAL_RULES.
 *
 * @type {Object}
 */
export const RITUAL_RULES = {
  label: "Ritual Casting",
  description:
    "Certain spells tagged with the Ritual property can be cast as a ritual. " +
    "Casting a spell as a ritual adds 10 minutes to the casting time and does not " +
    "expend a spell slot. The spell must still be available to the caster per their " +
    "class rules (prepared, in spellbook, or known).",

  castingTimeAddedMinutes: 10,
  consumesSpellSlot: false,

  generalRequirements: [
    "The spell must have the Ritual tag.",
    "The caster must meet their class-specific availability requirement " +
      "(prepared, spellbook, or known — see CLASS_RITUAL_RULES).",
    "Casting time is extended by 10 minutes beyond the base casting time.",
    "Cannot be used if the spell does not have the Ritual tag, regardless of class.",
  ],

  classNotes: {
    clericDruidPaladin:
      "The spell must be prepared on the day it is cast. Ritual casting still " +
      "expends no spell slot but does require preparation.",
    wizard:
      "The spell must be in the wizard's spellbook. It does not need to be prepared.",
    bard:
      "Bards gain Ritual Casting as a class feature at 1st level. They can cast " +
      "any bard spell they know as a ritual if it has the Ritual tag.",
    warlock:
      "Warlocks cannot cast rituals by default. Only the Pact of the Tome feature " +
      "combined with the Book of Ancient Secrets invocation grants ritual casting " +
      "from a list of acquired ritual spells.",
    otherClasses:
      "Classes without a ritual casting feature cannot cast rituals unless they " +
      "take the Ritual Caster feat.",
  },
};

// ---------------------------------------------------------------------------
// 2. RITUAL_CASTER_FEAT
// ---------------------------------------------------------------------------

/**
 * Rules for the Ritual Caster feat (PHB p. 169).
 * Grants ritual casting to any character, using a specific class's spell list.
 *
 * @type {Object}
 */
export const RITUAL_CASTER_FEAT = {
  name: "Ritual Caster",
  source: "PHB p. 169",
  prerequisite: "Intelligence or Wisdom 13 or higher",

  description:
    "You have learned a number of spells that you can cast as rituals. These " +
    "spells are written in a ritual book, which you must have in hand while casting " +
    "one of them.",

  eligibleClasses: ["Bard", "Cleric", "Druid", "Sorcerer", "Warlock", "Wizard"],

  rules: [
    "Choose one of the eligible classes. You acquire a ritual book containing " +
      "two 1st-level ritual spells of your choice from that class's spell list.",
    "You do not need to have the spell prepared — the ritual book serves as the " +
      "preparation source.",
    "If you come across a ritual spell in written form, you may add it to your " +
      "ritual book. The spell must be on the chosen class's spell list and of a " +
      "level you can cast (based on your total level, not class level).",
    "Adding a spell takes 2 hours and 50 gp per spell level.",
    "You must have the ritual book in hand to cast from it.",
    "Ritual casting via this feat still adds 10 minutes to casting time and " +
      "consumes no spell slot.",
  ],

  requiresRitualBook: true,
  mustHavePrepared: false,
  spellSlotConsumed: false,
  castingTimeAddedMinutes: 10,
};

// ---------------------------------------------------------------------------
// 3. RITUAL_SPELLS
// ---------------------------------------------------------------------------

/**
 * Comprehensive list of D&D 5e ritual-tagged spells, organized by spell level.
 * Each entry includes: name, level, school, classes with the spell on their list,
 * normal casting time, and a description snippet.
 *
 * @type {Array<{
 *   name: string,
 *   level: number,
 *   school: string,
 *   classes: string[],
 *   castingTime: string,
 *   ritualCastingTime: string,
 *   description: string
 * }>}
 */
export const RITUAL_SPELLS = [
  // ── Level 1 ──────────────────────────────────────────────────────────────

  {
    name: "Alarm",
    level: 1,
    school: "Abjuration",
    classes: ["Ranger", "Wizard"],
    castingTime: "1 minute",
    ritualCastingTime: "11 minutes",
    description:
      "Set an alarm against unwanted intrusion. For 8 hours, an alarm sounds " +
      "(mental or audible) whenever a creature of Small size or larger touches or " +
      "enters the warded area.",
  },
  {
    name: "Ceremony",
    level: 1,
    school: "Abjuration",
    classes: ["Cleric", "Paladin"],
    castingTime: "1 hour",
    ritualCastingTime: "1 hour 10 minutes",
    description:
      "Perform a religious ceremony charged with magic. Options include atonement, " +
      "bless water, coming of age, dedication, funeral rite, and wedding.",
  },
  {
    name: "Comprehend Languages",
    level: 1,
    school: "Divination",
    classes: ["Bard", "Sorcerer", "Warlock", "Wizard"],
    castingTime: "1 action",
    ritualCastingTime: "10 minutes 6 seconds",
    description:
      "For 1 hour you understand the literal meaning of any spoken language you " +
      "hear. You also understand written language you see, but must touch the surface " +
      "on which the words are written.",
  },
  {
    name: "Detect Magic",
    level: 1,
    school: "Divination",
    classes: ["Bard", "Cleric", "Druid", "Paladin", "Ranger", "Sorcerer", "Wizard"],
    castingTime: "1 action",
    ritualCastingTime: "10 minutes 6 seconds",
    description:
      "For up to 10 minutes you sense the presence of magic within 30 feet. You " +
      "can use your action to see a faint aura around any visible creature or object " +
      "that bears magic, and you learn its school of magic, if any.",
  },
  {
    name: "Detect Poison and Disease",
    level: 1,
    school: "Divination",
    classes: ["Cleric", "Druid", "Paladin", "Ranger"],
    castingTime: "1 action",
    ritualCastingTime: "10 minutes 6 seconds",
    description:
      "For up to 10 minutes you can sense the presence and location of poisons, " +
      "poisonous creatures, and diseases within 30 feet of you.",
  },
  {
    name: "Find Familiar",
    level: 1,
    school: "Conjuration",
    classes: ["Wizard"],
    castingTime: "1 hour",
    ritualCastingTime: "1 hour 10 minutes",
    description:
      "You gain the service of a familiar, a spirit that takes an animal form you " +
      "choose. While the familiar is within 100 feet you can communicate with it " +
      "telepathically.",
  },
  {
    name: "Identify",
    level: 1,
    school: "Divination",
    classes: ["Bard", "Wizard"],
    castingTime: "1 minute",
    ritualCastingTime: "11 minutes",
    description:
      "You choose one object that you must touch throughout the casting. You learn " +
      "its properties and how to use them, whether it requires attunement, and how " +
      "many charges it has, if any.",
  },
  {
    name: "Illusory Script",
    level: 1,
    school: "Illusion",
    classes: ["Bard", "Warlock", "Wizard"],
    castingTime: "1 minute",
    ritualCastingTime: "11 minutes",
    description:
      "You write on parchment, paper, or some other suitable writing material and " +
      "imbue it with a potent illusion that lasts for the duration. Only creatures " +
      "you designate can read the true message; all others see only scrambled text.",
  },
  {
    name: "Purify Food and Drink",
    level: 1,
    school: "Transmutation",
    classes: ["Cleric", "Druid", "Paladin"],
    castingTime: "1 action",
    ritualCastingTime: "10 minutes 6 seconds",
    description:
      "All nonmagical food and drink within a 5-foot-radius sphere centered on a " +
      "point of your choice within range is purified and rendered free of poison " +
      "and disease.",
  },
  {
    name: "Speak with Animals",
    level: 1,
    school: "Divination",
    classes: ["Bard", "Druid", "Ranger"],
    castingTime: "1 action",
    ritualCastingTime: "10 minutes 6 seconds",
    description:
      "You gain the ability to comprehend and verbally communicate with beasts for " +
      "the duration. Knowledge and awareness of many beasts is limited by their " +
      "intelligence, but at minimum a beast can give you information about nearby " +
      "locations and monsters.",
  },
  {
    name: "Unseen Servant",
    level: 1,
    school: "Conjuration",
    classes: ["Bard", "Warlock", "Wizard"],
    castingTime: "1 action",
    ritualCastingTime: "10 minutes 6 seconds",
    description:
      "This spell creates an invisible, mindless, shapeless, Medium force that " +
      "performs simple tasks at your command until the spell ends. It can perform " +
      "simple tasks a human servant could do.",
  },

  // ── Level 2 ──────────────────────────────────────────────────────────────

  {
    name: "Animal Messenger",
    level: 2,
    school: "Enchantment",
    classes: ["Bard", "Druid", "Ranger"],
    castingTime: "1 action",
    ritualCastingTime: "10 minutes 6 seconds",
    description:
      "You use magic to instruct a Tiny beast to deliver a message. The messenger " +
      "travels for 24 hours covering up to 50 miles per day toward a specific " +
      "individual described to it.",
  },
  {
    name: "Augury",
    level: 2,
    school: "Divination",
    classes: ["Cleric"],
    castingTime: "1 minute",
    ritualCastingTime: "11 minutes",
    description:
      "By casting gem-inlaid sticks, rolling dragon bones, laying out ornate cards, " +
      "or employing some other divining tool, you receive an omen from an otherworldly " +
      "entity about the results of a specific course of action taken within the next " +
      "30 minutes.",
  },
  {
    name: "Beast Sense",
    level: 2,
    school: "Divination",
    classes: ["Druid", "Ranger"],
    castingTime: "1 action",
    ritualCastingTime: "10 minutes 6 seconds",
    description:
      "You touch a willing beast. For the duration, you can use your action to see " +
      "through the beast's eyes and hear what it hears, and continue to do so until " +
      "you use your action to return to your normal senses.",
  },
  {
    name: "Gentle Repose",
    level: 2,
    school: "Necromancy",
    classes: ["Cleric", "Wizard"],
    castingTime: "1 action",
    ritualCastingTime: "10 minutes 6 seconds",
    description:
      "You touch a corpse or other remains. For the duration, the target is " +
      "protected from decay and can't become undead. The spell also effectively " +
      "extends the time limit on raising the target from the dead.",
  },
  {
    name: "Locate Animals or Plants",
    level: 2,
    school: "Divination",
    classes: ["Bard", "Druid", "Ranger"],
    castingTime: "1 action",
    ritualCastingTime: "10 minutes 6 seconds",
    description:
      "Describe or name a specific kind of beast or plant. Concentrating on the " +
      "voice of nature in your surroundings, you learn the direction and distance " +
      "to the closest creature or plant of that kind within 5 miles.",
  },
  {
    name: "Magic Mouth",
    level: 2,
    school: "Illusion",
    classes: ["Bard", "Wizard"],
    castingTime: "1 minute",
    ritualCastingTime: "11 minutes",
    description:
      "You implant a message within an object in range, a message that is uttered " +
      "when a trigger condition is met. The message can be up to 25 words and the " +
      "mouth moves and makes sound as though it speaks the message.",
  },
  {
    name: "Silence",
    level: 2,
    school: "Illusion",
    classes: ["Bard", "Cleric", "Ranger"],
    castingTime: "1 action",
    ritualCastingTime: "10 minutes 6 seconds",
    description:
      "For the duration, no sound can be created within or pass through a 20-foot " +
      "radius sphere centered on a point you choose. Any creature or object entirely " +
      "inside the sphere is immune to thunder damage.",
  },
  {
    name: "Skywrite",
    level: 2,
    school: "Transmutation",
    classes: ["Bard", "Druid", "Wizard"],
    castingTime: "1 action",
    ritualCastingTime: "10 minutes 6 seconds",
    description:
      "You cause up to ten words to form in a part of the sky you can see. The " +
      "words appear to be made of cloud and remain in place for the duration. The " +
      "words dissipate when the spell ends.",
  },

  // ── Level 3 ──────────────────────────────────────────────────────────────

  {
    name: "Feign Death",
    level: 3,
    school: "Necromancy",
    classes: ["Bard", "Cleric", "Druid", "Wizard"],
    castingTime: "1 action",
    ritualCastingTime: "10 minutes 6 seconds",
    description:
      "You touch a willing creature and put it into a cataleptic state that is " +
      "indistinguishable from death. For the spell's duration, or until you use an " +
      "action to touch the target and dismiss the spell, the target appears dead.",
  },
  {
    name: "Leomund's Tiny Hut",
    level: 3,
    school: "Evocation",
    classes: ["Bard", "Wizard"],
    castingTime: "1 minute",
    ritualCastingTime: "11 minutes",
    description:
      "A 10-foot-radius immobile dome of force springs into existence around and " +
      "above you and remains stationary for the duration. The spell ends if you " +
      "leave its area.",
  },
  {
    name: "Meld into Stone",
    level: 3,
    school: "Transmutation",
    classes: ["Cleric", "Druid"],
    castingTime: "1 action",
    ritualCastingTime: "10 minutes 6 seconds",
    description:
      "You step into a stone object or surface large enough to fully contain your " +
      "body, melding yourself and all the equipment you carry with the stone for the " +
      "duration.",
  },
  {
    name: "Phantom Steed",
    level: 3,
    school: "Illusion",
    classes: ["Wizard"],
    castingTime: "1 minute",
    ritualCastingTime: "11 minutes",
    description:
      "A Large quasi-real, horse-like creature appears on the ground in an " +
      "unoccupied space of your choice within range. You decide the creature's " +
      "appearance, and it can serve as a mount for up to 8 hours.",
  },
  {
    name: "Water Breathing",
    level: 3,
    school: "Transmutation",
    classes: ["Druid", "Ranger", "Sorcerer", "Wizard"],
    castingTime: "1 action",
    ritualCastingTime: "10 minutes 6 seconds",
    description:
      "This spell grants up to ten willing creatures you can see within range the " +
      "ability to breathe underwater until the spell ends. Affected creatures also " +
      "retain their normal mode of respiration.",
  },
  {
    name: "Water Walk",
    level: 3,
    school: "Transmutation",
    classes: ["Cleric", "Druid", "Ranger", "Sorcerer"],
    castingTime: "1 action",
    ritualCastingTime: "10 minutes 6 seconds",
    description:
      "This spell grants the ability to move across any liquid surface — such as " +
      "water, acid, mud, snow, quicksand, or lava — as if it were harmless solid " +
      "ground (creatures crossing molten lava can still take damage from the heat).",
  },

  // ── Level 4 ──────────────────────────────────────────────────────────────

  {
    name: "Divination",
    level: 4,
    school: "Divination",
    classes: ["Cleric"],
    castingTime: "1 action",
    ritualCastingTime: "10 minutes 6 seconds",
    description:
      "Your magic and an offering put you in contact with a god or a god's servants. " +
      "You ask a single question concerning a specific goal, event, or activity to " +
      "occur within 7 days. The DM offers a truthful reply.",
  },

  // ── Level 5 ──────────────────────────────────────────────────────────────

  {
    name: "Commune",
    level: 5,
    school: "Divination",
    classes: ["Cleric"],
    castingTime: "1 minute",
    ritualCastingTime: "11 minutes",
    description:
      "You contact your deity or a divine proxy and ask up to three questions that " +
      "can be answered with a yes or no. You must ask your questions before the " +
      "spell ends.",
  },
  {
    name: "Commune with Nature",
    level: 5,
    school: "Divination",
    classes: ["Druid", "Ranger"],
    castingTime: "1 minute",
    ritualCastingTime: "11 minutes",
    description:
      "You briefly become one with nature and gain knowledge of the surrounding " +
      "territory. In the outdoors, the spell gives you knowledge of the land within " +
      "3 miles of you.",
  },
  {
    name: "Contact Other Plane",
    level: 5,
    school: "Divination",
    classes: ["Warlock", "Wizard"],
    castingTime: "1 minute",
    ritualCastingTime: "11 minutes",
    description:
      "You mentally contact a demigod, the spirit of a long-dead sage, or some " +
      "other mysterious entity from another plane. You can ask up to five questions. " +
      "On a failed DC 15 Intelligence saving throw you take 6d6 psychic damage and " +
      "are insane until you finish a long rest.",
  },
  {
    name: "Rary's Telepathic Bond",
    level: 5,
    school: "Divination",
    classes: ["Wizard"],
    castingTime: "1 action",
    ritualCastingTime: "10 minutes 6 seconds",
    description:
      "You forge a telepathic link among up to eight willing creatures of your " +
      "choice within range, psychically linking each creature you chose to all the " +
      "others for the duration.",
  },

  // ── Level 6 ──────────────────────────────────────────────────────────────

  {
    name: "Drawmij's Instant Summons",
    level: 6,
    school: "Conjuration",
    classes: ["Wizard"],
    castingTime: "1 minute",
    ritualCastingTime: "11 minutes",
    description:
      "You touch an object weighing 10 pounds or less whose longest dimension is " +
      "6 feet or less. The spell leaves an invisible mark on its surface and " +
      "invisibly inscribes the name of the item on a sapphire worth 1,000 gp.",
  },
  {
    name: "Forbiddance",
    level: 6,
    school: "Abjuration",
    classes: ["Cleric"],
    castingTime: "10 minutes",
    ritualCastingTime: "20 minutes",
    description:
      "You create a ward against magical travel that protects up to 40,000 square " +
      "feet of floor space to a height of 30 feet above the floor. For the duration, " +
      "creatures can't teleport into the area or use portals.",
  },
];

// ---------------------------------------------------------------------------
// 4. CLASS_RITUAL_RULES
// ---------------------------------------------------------------------------

/**
 * Per-class rules describing exactly when and how ritual casting is available.
 *
 * @type {Object.<string, {
 *   hasRitualCasting: boolean,
 *   source: string,
 *   mustPrepare: boolean,
 *   mustKnow: boolean,
 *   requiresSpellbook: boolean,
 *   requiresFeature: string|null,
 *   notes: string
 * }>}
 */
export const CLASS_RITUAL_RULES = {
  Wizard: {
    hasRitualCasting: true,
    source: "Wizard class feature — Ritual Casting (PHB p. 114)",
    mustPrepare: false,
    mustKnow: false,
    requiresSpellbook: true,
    requiresFeature: null,
    notes:
      "A wizard can cast any ritual spell that is written in their spellbook without " +
      "preparing it. The spell must be in the spellbook. No spell slot is consumed.",
  },

  Cleric: {
    hasRitualCasting: true,
    source: "Cleric class feature — Ritual Casting (PHB p. 58)",
    mustPrepare: true,
    mustKnow: false,
    requiresSpellbook: false,
    requiresFeature: null,
    notes:
      "A cleric can cast a ritual spell only if it is currently prepared. Having a " +
      "ritual spell on the cleric spell list is not enough — it must be among the " +
      "spells prepared for that day.",
  },

  Druid: {
    hasRitualCasting: true,
    source: "Druid class feature — Ritual Casting (PHB p. 66)",
    mustPrepare: true,
    mustKnow: false,
    requiresSpellbook: false,
    requiresFeature: null,
    notes:
      "A druid can cast a ritual spell only if it is currently prepared. The spell " +
      "must be prepared for that day. No spell slot is consumed.",
  },

  Paladin: {
    hasRitualCasting: false,
    source: "None — Paladin has no innate Ritual Casting feature",
    mustPrepare: true,
    mustKnow: false,
    requiresSpellbook: false,
    requiresFeature: null,
    notes:
      "Paladins have no Ritual Casting class feature and cannot cast rituals unless " +
      "they take the Ritual Caster feat. Some ritual spells (Ceremony, Detect Magic, " +
      "Detect Poison and Disease, Purify Food and Drink) appear on the paladin list " +
      "but are only castable as rituals if the Ritual Caster feat is taken.",
  },

  Bard: {
    hasRitualCasting: true,
    source: "Bard class feature — Ritual Casting (PHB p. 51)",
    mustPrepare: false,
    mustKnow: true,
    requiresSpellbook: false,
    requiresFeature: "Ritual Casting",
    notes:
      "A bard can cast a ritual spell they know as a ritual, without preparing it " +
      "separately. The spell must be among the bard's known spells and must have the " +
      "Ritual tag. No spell slot is consumed.",
  },

  Ranger: {
    hasRitualCasting: false,
    source: "None — Ranger has no innate Ritual Casting feature",
    mustPrepare: false,
    mustKnow: true,
    requiresSpellbook: false,
    requiresFeature: null,
    notes:
      "Rangers have no Ritual Casting class feature. Some ritual spells appear on " +
      "the ranger spell list (Alarm, Animal Messenger, Beast Sense, etc.) but they " +
      "cannot cast these as rituals unless they take the Ritual Caster feat.",
  },

  Sorcerer: {
    hasRitualCasting: false,
    source: "None — Sorcerer has no innate Ritual Casting feature",
    mustPrepare: false,
    mustKnow: true,
    requiresSpellbook: false,
    requiresFeature: null,
    notes:
      "Sorcerers cannot cast rituals unless they take the Ritual Caster feat. " +
      "Some ritual spells appear on the sorcerer list but require a feat to use " +
      "as rituals.",
  },

  Warlock: {
    hasRitualCasting: false,
    source: "None by default — requires Pact of the Tome + Book of Ancient Secrets",
    mustPrepare: false,
    mustKnow: false,
    requiresSpellbook: true,
    requiresFeature: "Pact of the Tome + Book of Ancient Secrets",
    notes:
      "Warlocks cannot cast rituals by default. With the Pact of the Tome feature " +
      "and the Book of Ancient Secrets eldritch invocation, the warlock can inscribe " +
      "ritual spells of any class into their Book of Shadows and cast them as rituals. " +
      "Contact Other Plane is on the warlock list but requires this invocation to be " +
      "cast as a ritual.",
  },

  Fighter: {
    hasRitualCasting: false,
    source: "None",
    mustPrepare: false,
    mustKnow: false,
    requiresSpellbook: false,
    requiresFeature: null,
    notes:
      "Fighters have no spellcasting or ritual casting features unless they choose " +
      "the Eldritch Knight archetype. Even Eldritch Knights use the Wizard spell list " +
      "but do not gain the Wizard Ritual Casting feature. Ritual Caster feat required.",
  },

  Rogue: {
    hasRitualCasting: false,
    source: "None",
    mustPrepare: false,
    mustKnow: false,
    requiresSpellbook: false,
    requiresFeature: null,
    notes:
      "Rogues have no ritual casting features. Arcane Trickster rogues use the " +
      "Wizard spell list but do not gain Ritual Casting. Ritual Caster feat required.",
  },

  Barbarian: {
    hasRitualCasting: false,
    source: "None",
    mustPrepare: false,
    mustKnow: false,
    requiresSpellbook: false,
    requiresFeature: null,
    notes: "Barbarians have no spellcasting and cannot cast rituals without the Ritual Caster feat.",
  },

  Monk: {
    hasRitualCasting: false,
    source: "None",
    mustPrepare: false,
    mustKnow: false,
    requiresSpellbook: false,
    requiresFeature: null,
    notes: "Monks have no ritual casting features. Ritual Caster feat required.",
  },
};

// ---------------------------------------------------------------------------
// Helper: internal normalized name lookup
// ---------------------------------------------------------------------------

/**
 * Normalize a spell name for comparison (lowercase, trimmed).
 * @param {string} name
 * @returns {string}
 */
function normalizeName(name) {
  return name.trim().toLowerCase();
}

// ---------------------------------------------------------------------------
// 5. Exported Helper Functions
// ---------------------------------------------------------------------------

/**
 * Determine whether a character can currently cast a given spell as a ritual.
 *
 * @param {string}   spellName      - Name of the spell to check (case-insensitive).
 * @param {string}   characterClass - Class name matching a key in CLASS_RITUAL_RULES.
 * @param {string[]} knownSpells    - Spell names the character knows (for Bard/Warlock).
 * @param {string[]} preparedSpells - Spell names currently prepared (for Cleric/Druid).
 * @param {string[]} features       - Active class features / invocations the character has.
 *                                    E.g. ["Ritual Casting", "Pact of the Tome",
 *                                    "Book of Ancient Secrets", "Ritual Caster"].
 * @returns {{ canCast: boolean, reason: string }}
 */
export function canCastAsRitual(
  spellName,
  characterClass,
  knownSpells = [],
  preparedSpells = [],
  features = []
) {
  const target = normalizeName(spellName);

  // 1. Is the spell a ritual spell at all?
  const spellEntry = RITUAL_SPELLS.find((s) => normalizeName(s.name) === target);
  if (!spellEntry) {
    return {
      canCast: false,
      reason: `"${spellName}" is not a ritual-tagged spell and cannot be cast as a ritual.`,
    };
  }

  const classKey = Object.keys(CLASS_RITUAL_RULES).find(
    (k) => k.toLowerCase() === (characterClass || "").trim().toLowerCase()
  );
  const classRules = classKey ? CLASS_RITUAL_RULES[classKey] : null;

  // Helper flags
  const hasRitualCasterFeat = features.map((f) => f.toLowerCase()).includes("ritual caster");
  const hasBookOfAncientSecrets =
    features.map((f) => f.toLowerCase()).includes("book of ancient secrets");
  const hasPactOfTome = features.map((f) => f.toLowerCase()).includes("pact of the tome");

  // 2. Check if the spell is on the character's class list
  const isOnClassList =
    classKey && spellEntry.classes.map((c) => c.toLowerCase()).includes(classKey.toLowerCase());

  // 3. Ritual Caster feat: can cast from ritual book regardless of class list
  if (hasRitualCasterFeat) {
    return {
      canCast: true,
      reason:
        `"${spellName}" can be cast as a ritual via the Ritual Caster feat. ` +
        `Remember to use your ritual book and add 10 minutes to the casting time.`,
    };
  }

  // 4. No class rules found (unknown class) — cannot cast ritual without feat
  if (!classRules) {
    return {
      canCast: false,
      reason:
        `Class "${characterClass}" is not recognized. Cannot determine ritual casting eligibility. ` +
        `Consider the Ritual Caster feat.`,
    };
  }

  // 5. Warlock special case: Book of Ancient Secrets invocation
  if (classKey === "Warlock") {
    if (hasPactOfTome && hasBookOfAncientSecrets) {
      return {
        canCast: true,
        reason:
          `"${spellName}" can be cast as a ritual via Book of Ancient Secrets (Pact of the Tome). ` +
          `Add 10 minutes to the casting time. No spell slot consumed.`,
      };
    }
    return {
      canCast: false,
      reason:
        `Warlocks cannot cast rituals without Pact of the Tome and the Book of Ancient Secrets invocation. ` +
        `"${spellName}" requires both features to cast as a ritual.`,
    };
  }

  // 6. Class has no ritual casting feature and no feat
  if (!classRules.hasRitualCasting) {
    return {
      canCast: false,
      reason:
        `${classKey}s do not have a Ritual Casting class feature. ` +
        `"${spellName}" cannot be cast as a ritual without the Ritual Caster feat.`,
    };
  }

  // 7. Spell must be on the class list
  if (!isOnClassList) {
    return {
      canCast: false,
      reason:
        `"${spellName}" is not on the ${classKey} spell list and cannot be cast as a ritual ` +
        `by a ${classKey}. Classes with it: ${spellEntry.classes.join(", ")}.`,
    };
  }

  // 8. Wizard: must be in spellbook, no preparation needed
  if (classKey === "Wizard") {
    return {
      canCast: true,
      reason:
        `"${spellName}" can be cast as a ritual by a Wizard as long as it is in their spellbook. ` +
        `No preparation required. Add 10 minutes to the casting time.`,
    };
  }

  // 9. Bard: must have the spell known + Ritual Casting feature (gained at level 1)
  if (classKey === "Bard") {
    const spellKnown = knownSpells
      .map((s) => normalizeName(s))
      .includes(target);
    if (!spellKnown) {
      return {
        canCast: false,
        reason:
          `Bards can only cast ritual spells they know. "${spellName}" is not among ` +
          `the character's known spells.`,
      };
    }
    return {
      canCast: true,
      reason:
        `"${spellName}" can be cast as a ritual because the Bard knows it and has the ` +
        `Ritual Casting class feature. Add 10 minutes to the casting time.`,
    };
  }

  // 10. Cleric / Druid: must be prepared
  if (classRules.mustPrepare) {
    const isPrepared = preparedSpells
      .map((s) => normalizeName(s))
      .includes(target);
    if (!isPrepared) {
      return {
        canCast: false,
        reason:
          `${classKey}s must have "${spellName}" prepared today to cast it as a ritual. ` +
          `It is not among the character's currently prepared spells.`,
      };
    }
    return {
      canCast: true,
      reason:
        `"${spellName}" is prepared and can be cast as a ritual by this ${classKey}. ` +
        `Add 10 minutes to the casting time. No spell slot consumed.`,
    };
  }

  // Fallback — class has ritual casting and spell is on list; allow it
  return {
    canCast: true,
    reason:
      `"${spellName}" can be cast as a ritual. Add 10 minutes to the casting time. ` +
      `No spell slot consumed.`,
  };
}

/**
 * Return all ritual spells available to a given class.
 *
 * @param {string} characterClass - Class name (case-insensitive).
 * @returns {Array} Filtered entries from RITUAL_SPELLS.
 */
export function getRitualSpells(characterClass) {
  if (!characterClass) return [];
  const cls = characterClass.trim().toLowerCase();
  return RITUAL_SPELLS.filter((spell) =>
    spell.classes.map((c) => c.toLowerCase()).includes(cls)
  );
}

/**
 * Return the ritual casting time for a spell (base casting time + 10 minutes).
 *
 * @param {string} spellName - Spell name (case-insensitive).
 * @returns {string|null} The ritual casting time string, or null if not a ritual spell.
 */
export function getRitualCastingTime(spellName) {
  const target = normalizeName(spellName);
  const spell = RITUAL_SPELLS.find((s) => normalizeName(s.name) === target);
  return spell ? spell.ritualCastingTime : null;
}

/**
 * Return the full list of all ritual spells.
 *
 * @returns {Array} All entries from RITUAL_SPELLS.
 */
export function getAllRitualSpells() {
  return RITUAL_SPELLS;
}

/**
 * Check whether a given spell name is tagged as a ritual spell.
 *
 * @param {string} spellName - Spell name (case-insensitive).
 * @returns {boolean}
 */
export function isRitualSpell(spellName) {
  const target = normalizeName(spellName);
  return RITUAL_SPELLS.some((s) => normalizeName(s.name) === target);
}
