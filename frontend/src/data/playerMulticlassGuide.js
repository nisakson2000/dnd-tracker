/**
 * playerMulticlassGuide.js
 * Player Mode: Multiclass requirements, benefits, and common dips
 * Pure JS — no React dependencies.
 */

export const MULTICLASS_PREREQUISITES = [
  { class: 'Barbarian', requirement: 'STR 13', proficiencies: 'Shields, simple weapons, martial weapons' },
  { class: 'Bard', requirement: 'CHA 13', proficiencies: 'Light armor, one skill, one instrument' },
  { class: 'Cleric', requirement: 'WIS 13', proficiencies: 'Light armor, medium armor, shields' },
  { class: 'Druid', requirement: 'WIS 13', proficiencies: 'Light armor, medium armor, shields (no metal)' },
  { class: 'Fighter', requirement: 'STR 13 or DEX 13', proficiencies: 'Light armor, medium armor, shields, simple weapons, martial weapons' },
  { class: 'Monk', requirement: 'DEX 13 and WIS 13', proficiencies: 'Simple weapons, shortswords' },
  { class: 'Paladin', requirement: 'STR 13 and CHA 13', proficiencies: 'Light armor, medium armor, shields, simple weapons, martial weapons' },
  { class: 'Ranger', requirement: 'DEX 13 and WIS 13', proficiencies: 'Light armor, medium armor, shields, simple weapons, martial weapons, one skill' },
  { class: 'Rogue', requirement: 'DEX 13', proficiencies: 'Light armor, one skill, thieves\' tools' },
  { class: 'Sorcerer', requirement: 'CHA 13', proficiencies: 'None' },
  { class: 'Warlock', requirement: 'CHA 13', proficiencies: 'Light armor, simple weapons' },
  { class: 'Wizard', requirement: 'INT 13', proficiencies: 'None' },
];

export const POPULAR_DIPS = [
  { dip: 'Fighter 1', why: 'Heavy armor, CON saves, Second Wind. Best 1-level dip for durability.', bestFor: ['Cleric', 'Warlock', 'Wizard'] },
  { dip: 'Fighter 2', why: 'Action Surge. Extra full action once per short rest. Insane for casters.', bestFor: ['Wizard', 'Sorcerer', 'Any caster'] },
  { dip: 'Hexblade 1', why: 'CHA for weapon attacks, medium armor, shields, Hexblade\'s Curse.', bestFor: ['Paladin', 'Bard', 'Sorcerer'] },
  { dip: 'Rogue 1', why: 'Expertise in 2 skills, Sneak Attack, thieves\' tools.', bestFor: ['Ranger', 'Bard', 'Fighter'] },
  { dip: 'Rogue 2', why: 'Cunning Action: bonus Dash/Disengage/Hide.', bestFor: ['Monk', 'Ranger'] },
  { dip: 'Cleric 1', why: 'Heavy armor (some domains), healing spells, domain feature.', bestFor: ['Druid', 'Wizard', 'Ranger'] },
  { dip: 'Paladin 2', why: 'Divine Smite. Use any spell slots for burst damage.', bestFor: ['Sorcerer', 'Warlock', 'Bard'] },
  { dip: 'Barbarian 1', why: 'Rage for melee damage and resistance. Unarmored Defense.', bestFor: ['Fighter', 'Rogue', 'Monk'] },
  { dip: 'War Magic Wizard 2', why: 'Arcane Deflection (+2 AC or +4 save as reaction). Great defense.', bestFor: ['Eldritch Knight Fighter', 'Arcane Trickster Rogue'] },
];

export const SPELLCASTING_MULTICLASS = {
  fullCasters: { classes: ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Wizard'], multiplier: 1 },
  halfCasters: { classes: ['Paladin', 'Ranger'], multiplier: 0.5, note: 'Round down. Need 2 levels for 1st-level slots.' },
  thirdCasters: { classes: ['Eldritch Knight', 'Arcane Trickster'], multiplier: 1/3, note: 'Round down. Need 3 levels for 1st-level slots.' },
  pactMagic: { classes: ['Warlock'], note: 'Warlock slots are SEPARATE. They stack for casting but tracked independently.' },
  rule: 'Add weighted levels together, then look up the Multiclass Spellcaster table for total spell slots.',
};

export const MULTICLASS_TRAPS = [
  'Delaying Extra Attack (level 5) — missing this is a huge power dip.',
  'MAD builds (needing 3+ high ability scores) are usually bad.',
  'Losing capstone abilities (level 20 features) — usually worth it though.',
  'Spellcasting progression slows significantly with multiclassing.',
  'Warlock/Sorcerer "coffeelock" — requires DM approval and is widely banned.',
];

export function meetsPrerequisites(currentClass, targetClass, abilityScores) {
  const current = MULTICLASS_PREREQUISITES.find(p => p.class === currentClass);
  const target = MULTICLASS_PREREQUISITES.find(p => p.class === targetClass);
  if (!current || !target) return { meets: false, reason: 'Unknown class' };
  // Must meet prerequisites of BOTH classes
  return { meets: true, currentReq: current.requirement, targetReq: target.requirement };
}

export function calculateMulticlassSlots(classLevels) {
  let totalLevel = 0;
  for (const [cls, level] of Object.entries(classLevels)) {
    if (['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Wizard'].includes(cls)) totalLevel += level;
    else if (['Paladin', 'Ranger'].includes(cls)) totalLevel += Math.floor(level / 2);
    else if (['Eldritch Knight', 'Arcane Trickster'].includes(cls)) totalLevel += Math.floor(level / 3);
    // Warlock not included — pact magic is separate
  }
  return totalLevel;
}
