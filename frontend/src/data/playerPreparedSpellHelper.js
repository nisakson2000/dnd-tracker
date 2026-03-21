/**
 * playerPreparedSpellHelper.js
 * Player Mode: Daily spell preparation planner with situational recommendations
 * Pure JS — no React dependencies.
 */

export const ALWAYS_PREPARE = {
  Cleric: ['Healing Word', 'Spiritual Weapon', 'Spirit Guardians', 'Bless', 'Revivify'],
  Druid: ['Healing Word', 'Entangle', 'Pass Without Trace', 'Conjure Animals', 'Absorb Elements'],
  Paladin: ['Bless', 'Shield of Faith', 'Revivify', 'Find Steed'],
  Wizard: ['Shield', 'Counterspell', 'Fireball', 'Misty Step'],
  Ranger: ['Goodberry', 'Pass Without Trace', 'Absorb Elements'],
};

export const SITUATIONAL_SPELLS = {
  dungeon: ['Detect Magic', 'Find Traps', 'Dispel Magic', 'Light', 'See Invisibility'],
  wilderness: ['Goodberry', 'Pass Without Trace', 'Water Breathing', 'Speak with Animals', 'Longstrider'],
  social: ['Zone of Truth', 'Detect Thoughts', 'Charm Person', 'Disguise Self', 'Suggestion'],
  combat: ['Hold Person', 'Fireball', 'Counterspell', 'Banishment', 'Haste'],
  boss: ['Banishment', 'Hold Monster', 'Greater Invisibility', 'Polymorph', 'Counterspell'],
  undead: ['Turn Undead (Channel Divinity)', 'Spirit Guardians', 'Guiding Bolt', 'Daylight', 'Protection from Evil and Good'],
  underwater: ['Water Breathing', 'Control Water', 'Tidal Wave', 'Maelstrom'],
};

export const SPELL_SWAP_RULES = {
  prepared: 'Prepared casters (Cleric, Druid, Paladin) swap their ENTIRE list after a long rest.',
  known: 'Known casters (Bard, Sorcerer, Ranger, Warlock) swap 1 spell per level-up only.',
  wizard: 'Wizards prepare from their spellbook. Can swap entire list after long rest.',
  domain: 'Domain/subclass spells are ALWAYS prepared and don\'t count against your limit.',
};

export function getAlwaysPrepare(className) {
  return ALWAYS_PREPARE[className] || [];
}

export function getSituationalSpells(situation) {
  return SITUATIONAL_SPELLS[(situation || '').toLowerCase()] || [];
}

export function buildPrepList(className, level, wisOrChaMod, situation) {
  const always = getAlwaysPrepare(className);
  const situational = getSituationalSpells(situation);
  const prepCount = level + wisOrChaMod;
  return {
    coreSpells: always,
    situationalPicks: situational.filter(s => !always.includes(s)),
    totalSlots: Math.max(1, prepCount),
    remaining: Math.max(0, prepCount - always.length),
  };
}
