/**
 * playerSaveProficiencyGuide.js
 * Player Mode: Saving throw importance, frequency, and optimization
 * Pure JS — no React dependencies.
 */

export const SAVE_FREQUENCY = [
  { save: 'DEX', frequency: 'Very Common', rank: 1, targets: 'Fireball, Lightning Bolt, dragon breath, traps, AoE.', effect: 'Half damage on success.' },
  { save: 'WIS', frequency: 'Very Common', rank: 2, targets: 'Hold Person, Banishment, Charm, Fear, Dominate.', effect: 'Often incapacitated/controlled.' },
  { save: 'CON', frequency: 'Common', rank: 3, targets: 'Concentration, poison, Resilient Sphere, exhaustion.', effect: 'Lose concentration, poisoned.' },
  { save: 'CHA', frequency: 'Uncommon', rank: 4, targets: 'Banishment, Calm Emotions, Zone of Truth.', effect: 'Banished, compelled.' },
  { save: 'STR', frequency: 'Uncommon', rank: 5, targets: 'Entangle, Earthen Grasp, grapple, shoves.', effect: 'Restrained, grappled, prone.' },
  { save: 'INT', frequency: 'Rare', rank: 6, targets: 'Mind Blast, Synaptic Static, Feeblemind.', effect: 'Stunned, reduced stats. Devastating.' },
];

export const STRONG_VS_WEAK_SAVES = {
  strong: ['DEX', 'CON', 'WIS'],
  weak: ['STR', 'INT', 'CHA'],
  explanation: 'Each class is proficient in one strong save and one weak save.',
};

export const CLASS_SAVE_PROFICIENCIES = [
  { class: 'Barbarian', saves: 'STR, CON' },
  { class: 'Bard', saves: 'DEX, CHA' },
  { class: 'Cleric', saves: 'WIS, CHA' },
  { class: 'Druid', saves: 'INT, WIS' },
  { class: 'Fighter', saves: 'STR, CON' },
  { class: 'Monk', saves: 'STR, DEX' },
  { class: 'Paladin', saves: 'WIS, CHA' },
  { class: 'Ranger', saves: 'STR, DEX' },
  { class: 'Rogue', saves: 'DEX, INT' },
  { class: 'Sorcerer', saves: 'CON, CHA' },
  { class: 'Warlock', saves: 'WIS, CHA' },
  { class: 'Wizard', saves: 'INT, WIS' },
  { class: 'Artificer', saves: 'CON, INT' },
];

export const SAVE_OPTIMIZATION = [
  { method: 'Resilient (feat)', effect: '+1 stat + save proficiency', best: 'Resilient CON for casters.' },
  { method: 'Paladin Aura L6', effect: '+CHA mod to all saves in 10ft', best: 'Best save buff in 5e.' },
  { method: 'Ring of Protection', effect: '+1 all saves + AC', best: 'Rare magic item.' },
  { method: 'Cloak of Protection', effect: '+1 all saves + AC', best: 'Uncommon magic item.' },
  { method: 'Bless', effect: '+1d4 to saves and attacks', best: 'Best L1 buff spell.' },
  { method: 'Magic Resistance', effect: 'Advantage vs spells', best: 'Yuan-Ti, Satyr, Gnome Cunning.' },
  { method: 'Monk Diamond Soul L14', effect: 'Proficient in ALL saves', best: 'Best single save feature.' },
];

export const SAVE_TIPS = [
  'WIS saves: most dangerous. Hold Person, Banishment, Fear.',
  'DEX saves: most common. Fireball, dragon breath.',
  'CON saves: concentration checks. Resilient CON essential for casters.',
  'Paladin Aura: +CHA to all saves in 10ft. Best party buff.',
  'Resilient: +1 stat + proficiency. Scales with level.',
  'Bless: +1d4 to saves and attacks for 3 targets.',
  'Magic Resistance: advantage on spell saves.',
  'INT saves are rare but devastating.',
  'Starting class determines save proficiencies.',
  'Monk L14: proficient in ALL saves.',
];
