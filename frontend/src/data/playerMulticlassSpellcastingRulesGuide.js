/**
 * playerMulticlassSpellcastingRulesGuide.js
 * Player Mode: Multiclass spellcasting rules — slot calculation, known spells, preparation
 * Pure JS — no React dependencies.
 */

export const MULTICLASS_SPELL_RULES = {
  spellsKnown: 'Each class: learn/prepare spells as if single-classed at that class level.',
  spellSlots: 'Slots are shared. Calculate total slots using the multiclass table.',
  cantrips: 'Cantrips scale with character level, not class level.',
  key: 'You can CAST any spell with any slot, but you only KNOW spells based on individual class levels.',
  example: 'Wizard 5 / Cleric 3: know Wizard spells up to L3, Cleric spells up to L2. But have L4 slots.',
};

export const CASTER_LEVEL_MULTIPLIERS = [
  { classes: 'Bard, Cleric, Druid, Sorcerer, Wizard', multiplier: 1, label: 'Full caster', note: 'Class level × 1' },
  { classes: 'Paladin, Ranger', multiplier: 0.5, label: 'Half caster', note: 'Class level × 0.5 (round down)', requirement: 'Only count levels 2+' },
  { classes: 'Eldritch Knight (Fighter), Arcane Trickster (Rogue)', multiplier: 1/3, label: 'Third caster', note: 'Class level × 1/3 (round down)', requirement: 'Only count levels 3+' },
  { classes: 'Warlock', multiplier: 0, label: 'Pact Magic (separate)', note: 'NOT added to multiclass table. Separate slots.', requirement: 'Warlock slots recover on short rest. Don\'t combine.' },
];

export const SLOT_CALCULATION_STEPS = [
  'Step 1: Determine each class\'s contribution.',
  'Step 2: Full caster levels × 1. Half caster levels × 0.5. Third caster levels × 1/3.',
  'Step 3: Round DOWN the total.',
  'Step 4: Look up the combined caster level on the multiclass spellcasting table.',
  'Step 5: Warlock Pact Magic slots are SEPARATE. Don\'t add them.',
];

export const MULTICLASS_SLOT_TABLE = [
  { level: 1,  slots: [2, 0, 0, 0, 0, 0, 0, 0, 0] },
  { level: 2,  slots: [3, 0, 0, 0, 0, 0, 0, 0, 0] },
  { level: 3,  slots: [4, 2, 0, 0, 0, 0, 0, 0, 0] },
  { level: 4,  slots: [4, 3, 0, 0, 0, 0, 0, 0, 0] },
  { level: 5,  slots: [4, 3, 2, 0, 0, 0, 0, 0, 0] },
  { level: 6,  slots: [4, 3, 3, 0, 0, 0, 0, 0, 0] },
  { level: 7,  slots: [4, 3, 3, 1, 0, 0, 0, 0, 0] },
  { level: 8,  slots: [4, 3, 3, 2, 0, 0, 0, 0, 0] },
  { level: 9,  slots: [4, 3, 3, 3, 1, 0, 0, 0, 0] },
  { level: 10, slots: [4, 3, 3, 3, 2, 0, 0, 0, 0] },
  { level: 11, slots: [4, 3, 3, 3, 2, 1, 0, 0, 0] },
  { level: 12, slots: [4, 3, 3, 3, 2, 1, 0, 0, 0] },
  { level: 13, slots: [4, 3, 3, 3, 2, 1, 1, 0, 0] },
  { level: 14, slots: [4, 3, 3, 3, 2, 1, 1, 0, 0] },
  { level: 15, slots: [4, 3, 3, 3, 2, 1, 1, 1, 0] },
  { level: 16, slots: [4, 3, 3, 3, 2, 1, 1, 1, 0] },
  { level: 17, slots: [4, 3, 3, 3, 2, 1, 1, 1, 1] },
  { level: 18, slots: [4, 3, 3, 3, 3, 1, 1, 1, 1] },
  { level: 19, slots: [4, 3, 3, 3, 3, 2, 1, 1, 1] },
  { level: 20, slots: [4, 3, 3, 3, 3, 2, 2, 1, 1] },
];

export const COMMON_MULTICLASS_EXAMPLES = [
  {
    build: 'Sorcerer 5 / Warlock 2',
    casterLevel: '5 (Sorc 5×1 = 5. Warlock = separate)',
    slots: 'L1:4, L2:3, L3:2 (from table) + 2 Warlock L1 Pact slots (recover on SR)',
    spellsKnown: 'Sorcerer: spells up to L3. Warlock: spells up to L1.',
    note: 'Can use Pact slots to fuel Sorcery Points via Font of Magic.',
  },
  {
    build: 'Wizard 5 / Fighter (EK) 4',
    casterLevel: '6 (Wiz 5×1 + EK 4×1/3 = 5+1 = 6)',
    slots: 'L1:4, L2:3, L3:3',
    spellsKnown: 'Wizard: spells up to L3. EK: spells up to L1.',
    note: 'Extra Attack from Fighter. Wizard utility. Action Surge for 2 spells/turn.',
  },
  {
    build: 'Cleric 6 / Paladin 6',
    casterLevel: '9 (Cleric 6×1 + Paladin 6×0.5 = 6+3 = 9)',
    slots: 'L1:4, L2:3, L3:3, L3:3, L5:1',
    spellsKnown: 'Cleric: spells up to L3. Paladin: spells up to L2.',
    note: 'Has L5 slots but can\'t learn L5 spells. Use them for upcasting or Divine Smite.',
  },
  {
    build: 'Bard 10 / Paladin 2',
    casterLevel: '11 (Bard 10×1 + Paladin 2×0.5 = 10+1 = 11)',
    slots: 'L1:4, L2:3, L3:3, L4:3, L5:2, L6:1',
    spellsKnown: 'Bard: spells up to L5. Paladin: no spellcasting at L2.',
    note: 'L6 slots for Divine Smite = 6d8 radiant. Devastating crits.',
  },
];

export const WARLOCK_MULTICLASS_SPECIAL = {
  rule: 'Pact Magic is SEPARATE from Spellcasting. Slots don\'t combine.',
  benefit: 'Warlock slots recover on short rest. Use them freely.',
  sorceryPoints: 'Sorlock: convert Pact slots → Sorcery Points on short rest. Infinite SP engine.',
  smite: 'Padlock: use Warlock slots for Divine Smite. Recover on SR.',
  upcast: 'Can use Pact slots to cast multiclass spells, and vice versa.',
  note: 'This is why Warlock dips are so powerful for multiclassing.',
};

export const MULTICLASS_SPELLCASTING_TIPS = [
  'Spells known: based on INDIVIDUAL class level. Slots: based on COMBINED caster level.',
  'Warlock Pact Magic is separate. Don\'t add it to the multiclass table.',
  'You can use higher-level slots to upcast lower-level spells you know.',
  'Having L5 slots but only L3 spells = upcast L3 spells at L5.',
  'Sorlock: convert Pact slots to Sorcery Points on short rest. Broken.',
  'Padlock: Divine Smite with Warlock slots. Recover on short rest.',
  'Cantrips scale with CHARACTER level, not class level.',
  'Half casters (Paladin/Ranger): round DOWN. Paladin 3 = 1.5 → 1.',
  'Third casters (EK/AT): only count levels 3+. EK 4 = 1.33 → 1.',
  'Extra Attack doesn\'t stack between classes (except Fighter).',
];
