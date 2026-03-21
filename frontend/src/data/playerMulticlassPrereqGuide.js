/**
 * playerMulticlassPrereqGuide.js
 * Player Mode: Multiclass prerequisites and rules reference
 * Pure JS — no React dependencies.
 */

export const MULTICLASS_RULES = {
  requirement: 'Must meet the ability score prerequisite of BOTH your current class AND the new class.',
  minimum: '13 in the required ability score(s).',
  when: 'At any level-up, you can choose to take a level in a different class.',
  proficiencies: 'You gain SOME (not all) proficiencies of the new class. See table.',
  hpDice: 'Use the new class\'s hit die for the new level.',
  spellSlots: 'Combine spell slots using the multiclass spellcasting table.',
};

export const CLASS_PREREQUISITES = [
  { class: 'Barbarian', requirement: 'STR 13', profGained: 'Shields, simple weapons, martial weapons' },
  { class: 'Bard', requirement: 'CHA 13', profGained: 'Light armor, 1 skill, 1 musical instrument' },
  { class: 'Cleric', requirement: 'WIS 13', profGained: 'Light armor, medium armor, shields' },
  { class: 'Druid', requirement: 'WIS 13', profGained: 'Light armor, medium armor, shields (nonmetal)' },
  { class: 'Fighter', requirement: 'STR 13 or DEX 13', profGained: 'Light armor, medium armor, shields, simple weapons, martial weapons' },
  { class: 'Monk', requirement: 'DEX 13 and WIS 13', profGained: 'Simple weapons, shortswords' },
  { class: 'Paladin', requirement: 'STR 13 and CHA 13', profGained: 'Light armor, medium armor, shields, simple weapons, martial weapons' },
  { class: 'Ranger', requirement: 'DEX 13 and WIS 13', profGained: 'Light armor, medium armor, shields, simple weapons, martial weapons, 1 skill' },
  { class: 'Rogue', requirement: 'DEX 13', profGained: 'Light armor, 1 skill, thieves\' tools' },
  { class: 'Sorcerer', requirement: 'CHA 13', profGained: 'None' },
  { class: 'Warlock', requirement: 'CHA 13', profGained: 'Light armor, simple weapons' },
  { class: 'Wizard', requirement: 'INT 13', profGained: 'None' },
  { class: 'Artificer', requirement: 'INT 13', profGained: 'Light armor, medium armor, shields, thieves\' tools, tinker\'s tools' },
];

export const MULTICLASS_SPELLCASTING = {
  rule: 'Add full caster levels + half rounded-down levels (Paladin, Ranger, Artificer rounded up) + 1/3 rounded-down levels (Eldritch Knight, Arcane Trickster).',
  fullCasters: 'Bard, Cleric, Druid, Sorcerer, Wizard',
  halfCasters: 'Paladin, Ranger (round down), Artificer (round up)',
  thirdCasters: 'Eldritch Knight (Fighter), Arcane Trickster (Rogue)',
  pactMagic: 'Warlock slots are SEPARATE. Not added to multiclass table.',
  spellsKnown: 'You only know/prepare spells as if single-classed in each class.',
};

export const NOT_GAINED_FROM_MULTICLASS = [
  'Heavy armor proficiency (only from starting class)',
  'Saving throw proficiencies (only from starting class)',
  'Extra Attack does NOT stack between classes',
  'Unarmored Defense: only use one version',
  'Channel Divinity uses don\'t stack between Cleric/Paladin',
];

export const MULTICLASS_TIPS = [
  'Must meet prereqs of BOTH current and new class.',
  'Heavy armor: only from starting class. Start Fighter/Paladin if needed.',
  'Saving throw proficiency: only from starting class. Choose wisely.',
  'Extra Attack doesn\'t stack. Don\'t waste levels getting it twice.',
  'Warlock Pact Magic is separate from spell slots.',
  'Spells known/prepared: treat each class independently.',
  'Fighter 2 dip: Action Surge for any class. Best 2-level dip.',
  'Hexblade 1 dip: CHA to attacks + Shield + medium armor.',
  'Cleric 1 dip: heavy armor (some domains) + Shield of Faith + Healing Word.',
  '13 in required stats at character creation. Plan your Point Buy.',
];
