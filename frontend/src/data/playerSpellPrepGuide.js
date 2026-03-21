/**
 * playerSpellPrepGuide.js
 * Player Mode: Spell preparation strategy for prepared casters
 * Pure JS — no React dependencies.
 */

export const PREP_RULES = {
  who: 'Cleric, Druid, Paladin, Wizard, Artificer prepare spells each long rest.',
  count: 'Ability mod + class level (Paladin/Ranger: half level). Minimum 1.',
  ritual: 'Wizard: ritual spells in spellbook don\'t need to be prepared.',
  domain: 'Cleric/Paladin: subclass spells are always prepared and don\'t count against limit.',
  known: 'Bard, Ranger, Sorcerer, Warlock use "spells known" — no daily prep.',
};

export const ALWAYS_PREPARE = {
  cleric: ['Healing Word', 'Bless', 'Spirit Guardians', 'Spiritual Weapon', 'Revivify'],
  druid: ['Healing Word', 'Goodberry', 'Conjure Animals', 'Pass Without Trace', 'Absorb Elements'],
  wizard: ['Shield', 'Counterspell', 'Fireball', 'Misty Step', 'Dispel Magic'],
  paladin: ['Bless', 'Shield of Faith', 'Revivify', 'Find Steed'],
  artificer: ['Cure Wounds', 'Faerie Fire', 'Web', 'Dispel Magic'],
};

export const SITUATIONAL_PREP = [
  { situation: 'Dungeon crawl', add: ['Detect Magic (ritual ok for Wizard)', 'Darkvision', 'Find Traps', 'Light'], drop: ['Water spells', 'Travel spells'] },
  { situation: 'Wilderness travel', add: ['Goodberry', 'Pass Without Trace', 'Create Water', 'Plant Growth'], drop: ['Urban spells', 'Social spells'] },
  { situation: 'Social/Urban', add: ['Charm Person', 'Detect Thoughts', 'Zone of Truth', 'Tongues'], drop: ['Combat-heavy spells'] },
  { situation: 'Undead heavy', add: ['Turn Undead', 'Protection from Evil', 'Spirit Guardians', 'Dawn'], drop: ['Poison spells', 'Charm spells'] },
  { situation: 'Dragon fight', add: ['Absorb Elements', 'Protection from Energy', 'Earthbind', 'Heroes\' Feast'], drop: ['Low-impact cantrips', 'Utility spells'] },
  { situation: 'Naval/Water', add: ['Water Breathing', 'Control Water', 'Freedom of Movement', 'Tidal Wave'], drop: ['Fire spells', 'Land-based spells'] },
  { situation: 'Boss fight', add: ['Counterspell', 'Dispel Magic', 'Hold Monster', 'Banishment'], drop: ['AoE damage (fewer targets)', 'Utility'] },
];

export const PREP_MISTAKES = [
  'Not preparing Healing Word. Someone WILL go down.',
  'Not preparing Counterspell. Enemy casters WILL cast.',
  'Preparing too many situational spells. Keep a core always-prepared set.',
  'Not preparing a damage cantrip. You\'ll run out of slots.',
  'Preparing only combat spells. Utility spells solve problems too.',
  'Not checking subclass spells. They\'re free and don\'t count against your limit.',
  'Forgetting Revivify materials (300 gp diamond). Prepare the spell AND carry the diamond.',
];

export function spellsPrepared(abilityMod, classLevel, isHalfCaster) {
  const level = isHalfCaster ? Math.floor(classLevel / 2) : classLevel;
  return Math.max(1, abilityMod + level);
}

export function totalWithSubclass(prepCount, subclassSpellCount) {
  return prepCount + subclassSpellCount;
}
