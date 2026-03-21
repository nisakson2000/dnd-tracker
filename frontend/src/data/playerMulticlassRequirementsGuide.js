/**
 * playerMulticlassRequirementsGuide.js
 * Player Mode: Multiclassing requirements and optimization
 * Pure JS — no React dependencies.
 */

export const MULTICLASS_REQUIREMENTS = [
  { class: 'Barbarian', requirement: 'STR 13', note: 'STR 13 minimum to multiclass in OR out.' },
  { class: 'Bard', requirement: 'CHA 13', note: 'CHA 13 to multiclass in or out.' },
  { class: 'Cleric', requirement: 'WIS 13', note: 'WIS 13.' },
  { class: 'Druid', requirement: 'WIS 13', note: 'WIS 13.' },
  { class: 'Fighter', requirement: 'STR 13 or DEX 13', note: 'Either stat works. Most flexible martial multiclass.' },
  { class: 'Monk', requirement: 'DEX 13 and WIS 13', note: 'Both stats required. MAD tax.' },
  { class: 'Paladin', requirement: 'STR 13 and CHA 13', note: 'Both stats. MAD but both are useful.' },
  { class: 'Ranger', requirement: 'DEX 13 and WIS 13', note: 'Both stats. Same as Monk.' },
  { class: 'Rogue', requirement: 'DEX 13', note: 'DEX 13 only. Easy to multiclass into.' },
  { class: 'Sorcerer', requirement: 'CHA 13', note: 'CHA 13.' },
  { class: 'Warlock', requirement: 'CHA 13', note: 'CHA 13.' },
  { class: 'Wizard', requirement: 'INT 13', note: 'INT 13.' },
  { class: 'Artificer', requirement: 'INT 13', note: 'INT 13.' },
];

export const PROFICIENCY_GAINS = [
  { class: 'Barbarian', gain: 'Shields, simple weapons, martial weapons', note: 'Full weapon access.' },
  { class: 'Bard', gain: 'Light armor, one skill, one instrument', note: 'Skill + instrument.' },
  { class: 'Cleric', gain: 'Light armor, medium armor, shields', note: 'Armor for casters. Some domains add heavy armor.' },
  { class: 'Druid', gain: 'Light armor, medium armor, shields', note: 'Same as Cleric (no metal restriction doesn\'t apply to MC gain RAW — ask DM).' },
  { class: 'Fighter', gain: 'Light armor, medium armor, shields, simple weapons, martial weapons', note: 'Full martial access. Best 1-level dip for armor.' },
  { class: 'Monk', gain: 'Simple weapons, shortswords', note: 'Minimal gain. Monk dips are for features, not proficiencies.' },
  { class: 'Paladin', gain: 'Light armor, medium armor, shields, simple weapons, martial weapons', note: 'Same as Fighter but requires STR+CHA 13.' },
  { class: 'Ranger', gain: 'Light armor, medium armor, shields, simple weapons, martial weapons, one skill', note: 'Full martial + a skill.' },
  { class: 'Rogue', gain: 'Light armor, one skill, thieves\' tools', note: 'Thieves\' tools + skill. Good utility dip.' },
  { class: 'Sorcerer', gain: 'Nothing', note: 'No new proficiencies from multiclassing into Sorcerer.' },
  { class: 'Warlock', gain: 'Light armor, simple weapons', note: 'Light armor for casters.' },
  { class: 'Wizard', gain: 'Nothing', note: 'No proficiency gains from Wizard dip.' },
];

export const SPELL_SLOT_PROGRESSION = {
  rule: 'Multiclass spell slots are calculated by adding: full caster levels + half-caster levels (rounded down) + third-caster levels (rounded down).',
  fullCasters: ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Wizard'],
  halfCasters: ['Paladin (÷2)', 'Ranger (÷2)', 'Artificer (÷2, rounded up)'],
  thirdCasters: ['Eldritch Knight (÷3)', 'Arcane Trickster (÷3)'],
  warlockNote: 'Warlock Pact Magic slots are SEPARATE. They don\'t combine with multiclass spell slots. But you CAN use Pact slots to cast other class spells and vice versa.',
  note: 'You get more spell SLOTS than a single-class character at some combinations, but your spell LEVELS known are still limited by individual class levels.',
};

export const POPULAR_MULTICLASS_COMBOS = [
  { combo: 'Paladin 2 / Sorcerer X', note: 'Divine Smite + Sorcerer spell slots. More slots = more Smites. Quicken Booming Blade + Smite.', rating: 'S' },
  { combo: 'Warlock 2-3 / Sorcerer X', note: 'Eldritch Blast + Agonizing. Short rest Pact slots → Sorcery Points. Quicken EB for 8 beams.', rating: 'S' },
  { combo: 'Fighter 1-2 / Wizard X', note: 'Heavy armor + CON saves + Action Surge for two Fireballs in one turn.', rating: 'S' },
  { combo: 'Rogue 1 / Fighter X', note: 'Expertise + Sneak Attack + thieves\' tools. Minor dip for huge utility.', rating: 'A' },
  { combo: 'Cleric 1 / Wizard X', note: 'Heavy armor (some domains) + Shield + healing + full Wizard progression.', rating: 'A' },
  { combo: 'Barbarian 1-3 / Fighter X', note: 'Rage resistance + Reckless Attack on a Fighter chassis. More attacks + Rage tankiness.', rating: 'A' },
  { combo: 'Hexblade 1 / Paladin X', note: 'CHA to attacks. Shield spell. Hexblade\'s Curse. Single-stat Paladin.', rating: 'S' },
  { combo: 'Ranger 3 (Gloom Stalker) / Rogue X', note: 'Dread Ambusher round 1 extra attack + Sneak Attack. WIS to initiative.', rating: 'A' },
];

export const MULTICLASS_WARNINGS = [
  { warning: 'Delayed Extra Attack', note: 'Extra Attack at L5. If you dip at L4, you don\'t get Extra Attack until L6 total. Big DPR loss.' },
  { warning: 'Delayed ASI/Feats', note: 'ASIs at L4, 8, 12, etc. per CLASS (not character). Multiclassing delays feats.' },
  { warning: 'Delayed spell levels', note: 'Spell levels known are per class. Wizard 5/Cleric 5 knows L3 spells from each, not L5.' },
  { warning: 'Capstone loss', note: 'You lose your L20 capstone ability. Some are weak (Barbarian L20 is great, Monk L20 is situational).' },
  { warning: 'Feature overlap', note: 'Extra Attack doesn\'t stack between classes (except Fighter L11+). Unarmored Defense doesn\'t stack.' },
];

export function multiclassSpellSlots(fullCasterLevels, halfCasterLevels, thirdCasterLevels) {
  const effectiveLevel = fullCasterLevels + Math.floor(halfCasterLevels / 2) + Math.floor(thirdCasterLevels / 3);
  return { effectiveCasterLevel: effectiveLevel, note: `Effective caster level: ${effectiveLevel}` };
}
