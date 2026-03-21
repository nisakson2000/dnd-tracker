/**
 * playerMulticlassingRequirementsGuide.js
 * Player Mode: Multiclassing prerequisites, proficiencies, and spell slot math
 * Pure JS — no React dependencies.
 */

export const MULTICLASS_PREREQUISITES = [
  { class: 'Artificer', requirement: 'INT 13', note: 'Only in Eberron/Tasha\'s.' },
  { class: 'Barbarian', requirement: 'STR 13', note: 'Must have STR 13 in BOTH current and new class.' },
  { class: 'Bard', requirement: 'CHA 13', note: 'CHA caster. CHA 13 in both.' },
  { class: 'Cleric', requirement: 'WIS 13', note: 'WIS caster. Medium armor gained.' },
  { class: 'Druid', requirement: 'WIS 13', note: 'No metal armor restriction applies.' },
  { class: 'Fighter', requirement: 'STR 13 or DEX 13', note: 'Flexible. Either stat works.' },
  { class: 'Monk', requirement: 'DEX 13 and WIS 13', note: 'Two stats required. MAD.' },
  { class: 'Paladin', requirement: 'STR 13 and CHA 13', note: 'Two stats. Heavy armor gained.' },
  { class: 'Ranger', requirement: 'DEX 13 and WIS 13', note: 'Two stats. Medium armor gained.' },
  { class: 'Rogue', requirement: 'DEX 13', note: 'Easiest martial to dip into.' },
  { class: 'Sorcerer', requirement: 'CHA 13', note: 'CHA caster. Easy CHA dip.' },
  { class: 'Warlock', requirement: 'CHA 13', note: 'CHA caster. Most popular dip.' },
  { class: 'Wizard', requirement: 'INT 13', note: 'INT caster. Gains no armor.' },
];

export const MULTICLASS_PROFICIENCIES_GAINED = [
  { class: 'Artificer', gains: 'Light armor, medium armor, shields, thieves\' tools, tinker\'s tools' },
  { class: 'Barbarian', gains: 'Shields, simple weapons, martial weapons' },
  { class: 'Bard', gains: 'Light armor, one skill, one instrument' },
  { class: 'Cleric', gains: 'Light armor, medium armor, shields' },
  { class: 'Druid', gains: 'Light armor, medium armor, shields (no metal)' },
  { class: 'Fighter', gains: 'Light armor, medium armor, shields, simple weapons, martial weapons' },
  { class: 'Monk', gains: 'Simple weapons, shortswords' },
  { class: 'Paladin', gains: 'Light armor, medium armor, shields, simple weapons, martial weapons' },
  { class: 'Ranger', gains: 'Light armor, medium armor, shields, simple weapons, martial weapons, one skill' },
  { class: 'Rogue', gains: 'Light armor, one skill, thieves\' tools' },
  { class: 'Sorcerer', gains: 'Nothing' },
  { class: 'Warlock', gains: 'Light armor, simple weapons' },
  { class: 'Wizard', gains: 'Nothing' },
];

export const SPELLCASTING_MULTICLASS = {
  rule: 'Add together caster levels to determine spell slots. Each class tracks spells known/prepared separately.',
  fullCasters: { classes: ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Wizard'], multiplier: 1, note: 'Count full class level.' },
  halfCasters: { classes: ['Paladin', 'Ranger'], multiplier: 0.5, note: 'Count half class level (round down). L1 doesn\'t count until L2.' },
  thirdCasters: { classes: ['Eldritch Knight', 'Arcane Trickster'], multiplier: 0.33, note: 'Count one-third class level (round down).' },
  artificer: { multiplier: 0.5, note: 'Round UP (unique to Artificer).' },
  warlock: { note: 'Pact Magic is SEPARATE. Warlock slots don\'t combine with multiclass slots. They recover on SR independently.' },
};

export const MULTICLASS_SPELL_SLOT_TABLE = [
  { casterLevel: 1, slots: [2] },
  { casterLevel: 2, slots: [3] },
  { casterLevel: 3, slots: [4, 2] },
  { casterLevel: 4, slots: [4, 3] },
  { casterLevel: 5, slots: [4, 3, 2] },
  { casterLevel: 6, slots: [4, 3, 3] },
  { casterLevel: 7, slots: [4, 3, 3, 1] },
  { casterLevel: 8, slots: [4, 3, 3, 2] },
  { casterLevel: 9, slots: [4, 3, 3, 3, 1] },
];

export const BEST_MULTICLASS_DIPS = [
  { dip: '1 level Hexblade Warlock', gains: 'CHA attacks, medium armor, shield, Shield spell, Hexblade\'s Curse', rating: 'S', note: 'Best 1-level dip for CHA classes.' },
  { dip: '1 level Fighter', gains: 'Heavy armor, CON saves, Fighting Style, Second Wind', rating: 'S', note: 'Best defensive dip. CON saves for casters.' },
  { dip: '1 level Cleric (Peace/Twilight)', gains: 'Medium armor, shield, subclass feature, healing', rating: 'S', note: 'Peace: Emboldening Bond. Twilight: advantage on initiative.' },
  { dip: '2 level Fighter', gains: 'Action Surge (extra action once per SR)', rating: 'S', note: 'Two full turns. Cast two spells. Best 2-level dip.' },
  { dip: '2 level Warlock', gains: 'Invocations (Agonizing Blast, Devil\'s Sight)', rating: 'A+', note: 'EB becomes viable ranged damage.' },
  { dip: '1 level Rogue', gains: 'Expertise, Sneak Attack, thieves\' tools', rating: 'A', note: 'Expertise in Athletics (grapplers) or social skills.' },
  { dip: '2 level Paladin', gains: 'Divine Smite, Fighting Style', rating: 'A+', note: 'Smite with any spell slots. Best for Bard or Sorcerer.' },
];

export const MULTICLASS_WARNINGS = [
  'Delayed ASIs: you get ASI at class levels 4/8/12/16/19 — not character levels.',
  'Delayed Extra Attack: you need 5 levels in ONE class. 3 Fighter / 2 Ranger = no Extra Attack.',
  'MAD (Multiple Ability Dependent): needing 2-3 stats at 13+ limits your builds.',
  'Spells known are per-class: Sorcerer 3 / Wizard 3 knows L2 spells max from each, but has L3 slots.',
  'Don\'t multiclass before L5 in your primary class. L5 is the biggest power spike (L3 spells, Extra Attack).',
  'Warlock Pact Magic is separate from multiclass spellcasting. Different pools.',
];
