/**
 * playerSpellPrepStrategyGuide.js
 * Player Mode: Spell preparation strategy — what to prepare and why
 * Pure JS — no React dependencies.
 */

export const PREP_CASTER_RULES = {
  preparedCasters: ['Cleric', 'Druid', 'Paladin', 'Artificer', 'Wizard'],
  formula: 'Spellcasting mod + class level = prepared spells.',
  change: 'Change on each LONG REST.',
  knownCasters: 'Sorcerer, Bard, Ranger, Warlock can\'t swap daily.',
};

export const ALWAYS_PREPARE = {
  cleric: ['Healing Word', 'Spiritual Weapon', 'Spirit Guardians', 'Revivify', 'Bless'],
  druid: ['Healing Word', 'Pass Without Trace', 'Conjure Animals', 'Spike Growth'],
  paladin: ['Bless', 'Shield of Faith', 'Revivify', 'Aura of Vitality'],
  wizard: ['Shield', 'Counterspell', 'Fireball', 'Hypnotic Pattern', 'Misty Step'],
  artificer: ['Cure Wounds', 'Faerie Fire', 'Web'],
};

export const SITUATIONAL_SWAPS = [
  { situation: 'Dungeon crawl', add: ['Detect Magic', 'Dispel Magic', 'See Invisibility'] },
  { situation: 'Social/urban', add: ['Zone of Truth', 'Detect Thoughts', 'Suggestion'] },
  { situation: 'Undead heavy', add: ['Protection from Evil/Good', 'Spirit Guardians'] },
  { situation: 'Boss fight', add: ['Banishment', 'Hold Monster', 'Greater Restoration'] },
  { situation: 'Travel', add: ['Goodberry', 'Pass Without Trace', 'Locate Object'] },
  { situation: 'Anti-caster', add: ['Counterspell', 'Silence', 'Dispel Magic'] },
];

export const PREP_TIERS = [
  { tier: 'Core (always)', percent: '40-50%', note: 'Healing Word, Shield, key concentration.' },
  { tier: 'Flexible (swap daily)', percent: '30-40%', note: 'Change based on expected encounters.' },
  { tier: 'Insurance', percent: '10-20%', note: 'Revivify, Remove Curse. Hope you don\'t need them.' },
];

export const RITUAL_SAVINGS = {
  wizard: 'Rituals don\'t need prep. Save 3-5 slots.',
  others: 'Must prepare to ritual cast.',
  best: ['Detect Magic', 'Identify', 'Comprehend Languages', 'Find Familiar', 'Tiny Hut'],
};

export const PREP_TIPS = [
  'Healing Word: ALWAYS prepared. BA ranged revive.',
  'Shield (Wizard): ALWAYS. +5 AC saves lives.',
  'Revivify: always once you have L3 slots.',
  'Wizards: ritual spells free. Save prep for combat.',
  'Ask DM for encounter hints. Swap spells accordingly.',
  'Core spells: never change. 40-50% of list.',
  'Don\'t prepare 100% damage. Need utility + healing.',
  'Paladin Oath spells: always prepared, don\'t count against limit.',
];
