/**
 * playerMulticlassSpellSlotGuide.js
 * Player Mode: Multiclass spellcasting — slot calculation, spell access, and rules
 * Pure JS — no React dependencies.
 */

export const MULTICLASS_SPELLCASTING_RULES = {
  slotCalculation: 'Add full caster levels (Wizard, Sorcerer, Bard, Cleric, Druid) + half levels (Paladin, Ranger, Artificer rounded up) + third levels (Eldritch Knight, Arcane Trickster). Use multiclass slot table.',
  spellAccess: 'You can only learn/prepare spells based on individual class levels, NOT total caster level.',
  slotUsage: 'You CAN use any slot for any class\'s spells (Paladin can Smite with Sorcerer slots).',
  example: 'Paladin 6 / Sorcerer 14 = 3 (half Paladin) + 14 (full Sorcerer) = 17th level caster. But Paladin only knows up to 2nd-level Paladin spells.',
  pactMagic: 'Warlock Pact Magic is SEPARATE. Not added to multiclass total. But slots can be used for either class.',
};

export const CASTER_LEVEL_MATH = [
  { class: 'Wizard, Sorcerer, Bard, Cleric, Druid', multiplier: '1× (full caster)', note: 'Every level counts.' },
  { class: 'Paladin, Ranger', multiplier: '½× (half caster, from L2+)', note: 'Round down. Only levels 2+.' },
  { class: 'Artificer', multiplier: '½× (half caster, round UP)', note: 'Round UP (special rule). All Artificer levels count.' },
  { class: 'Eldritch Knight, Arcane Trickster', multiplier: '⅓× (third caster, from L3+)', note: 'Round down. Only levels 3+.' },
  { class: 'Warlock', multiplier: 'SEPARATE', note: 'Pact Magic. Not added. Independent slots.' },
];

export const COMMON_MULTICLASS_SLOTS = [
  { build: 'Paladin 2 / Sorcerer 18', casterLevel: '1 + 18 = 19', slots: 'Full 19th-level caster (4/3/3/3/3/2/1/1/1)', note: 'Near-full caster with Divine Smite.' },
  { build: 'Paladin 6 / Sorcerer 14', casterLevel: '3 + 14 = 17', slots: '17th-level caster (4/3/3/3/2/1/1/1)', note: 'THE Sorcadin. Tons of Smite fuel.' },
  { build: 'Fighter 5 / Wizard 15', casterLevel: '0 + 15 = 15', slots: '15th-level caster slots', note: 'EK levels don\'t start counting until L3.' },
  { build: 'Warlock 2 / Sorcerer 18', casterLevel: '0 + 18 = 18', slots: '18th-level caster + 2 warlock slots (1st)', note: 'Pact slots are separate. Convert to SP.' },
  { build: 'Cleric 1 / Wizard 19', casterLevel: '1 + 19 = 20', slots: 'Full 20th-level caster', note: 'Full slot progression. Access both lists.' },
];

export const MULTICLASS_SPELL_INTERACTIONS = [
  { interaction: 'Divine Smite + Sorcerer slots', rule: 'Smite uses ANY spell slot. Sorcerer slots = more Smites.', note: 'Core Sorcadin mechanic.' },
  { interaction: 'Warlock slots + Sorcery Points', rule: 'Convert Pact slots to SP on short rest. SP → create spell slots.', note: 'Coffeelock/Cocainelock exploit. Some DMs ban.' },
  { interaction: 'Cleric spells + Wizard slots', rule: 'Cleric 1 knows 1st-level Cleric spells. Can cast with higher Wizard slots.', note: 'Upcast Healing Word or Shield of Faith with Wizard slots.' },
  { interaction: 'Cantrip scaling', rule: 'Cantrips scale with total CHARACTER level, not class level.', note: 'Warlock 2 / Fighter 18: EB still does 4 beams at L17.' },
  { interaction: 'Ritual casting', rule: 'Only from classes that grant ritual casting. Follow that class\'s rules.', note: 'Wizard rituals: in spellbook. Cleric rituals: must be prepared.' },
];

export const MULTICLASS_SPELL_TIPS = [
  'Slots are based on combined caster level. Spells known are based on individual class levels.',
  'You CAN use higher-level slots from another class to upcast lower-level spells.',
  'Divine Smite uses ANY slot. This is why Sorcadin works.',
  'Warlock Pact Magic is separate. Doesn\'t combine with multiclass slot table.',
  'Cantrips scale with total level. Warlock 2 / anything 18 = full EB damage.',
  'Coffeelock: convert Pact slots to SP, SP to spell slots. Accumulate over short rests. Controversial.',
  'Cleric 1 / Wizard X: full caster slots + Healing Word + armor proficiency.',
  'Don\'t multiclass casters unless you have a specific combo in mind. Delayed progression hurts.',
  'Paladin 2 is the best caster dip: Divine Smite + Fighting Style + armor.',
  'Hexblade 1 dip: CHA for attacks + medium armor + Shield spell. Best single-level dip.',
];
