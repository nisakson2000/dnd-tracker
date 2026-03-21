/**
 * playerPreparedVsKnown.js
 * Player Mode: Prepared vs known spellcasting systems and spell selection strategy
 * Pure JS — no React dependencies.
 */

export const SPELLCASTING_SYSTEMS = {
  prepared: {
    name: 'Prepared Casters',
    classes: ['Cleric', 'Druid', 'Paladin', 'Wizard', 'Artificer'],
    howItWorks: 'After each long rest, choose which spells to prepare from your full class list (or spellbook for Wizard).',
    numberPrepared: 'Ability modifier + class level (half for Paladin/Artificer, full for Cleric/Druid/Wizard)',
    advantage: 'Flexibility — change your entire loadout daily based on expected encounters.',
    disadvantage: 'Decision paralysis. Need to predict what you\'ll face.',
    tip: 'Always prepare at least 1 healing spell, 1 combat spell, 1 utility spell, and 1 ritual.',
  },
  known: {
    name: 'Known Casters',
    classes: ['Bard', 'Ranger', 'Sorcerer', 'Warlock', 'Eldritch Knight', 'Arcane Trickster'],
    howItWorks: 'You know a fixed number of spells. Can swap one spell when you level up.',
    numberKnown: 'Varies by class and level. Sorcerer: 2 at level 1, max 15. Warlock: 2 at level 1, max 15.',
    advantage: 'No daily preparation needed. Always have your full list available.',
    disadvantage: 'Locked into your choices. Bad picks hurt more. Very limited selection.',
    tip: 'Choose versatile spells that work in many situations. Avoid niche picks.',
  },
};

export const SPELL_SELECTION_PRIORITY = {
  prepared: [
    { priority: 1, type: 'Core combat spell', examples: ['Spirit Guardians', 'Fireball', 'Spiritual Weapon'], reason: 'You need to deal damage. Always have at least one.' },
    { priority: 2, type: 'Healing', examples: ['Healing Word', 'Cure Wounds', 'Aura of Vitality'], reason: 'Someone will go down. Be ready.' },
    { priority: 3, type: 'Control/CC', examples: ['Hold Person', 'Hypnotic Pattern', 'Entangle'], reason: 'Remove threats without dealing damage.' },
    { priority: 4, type: 'Utility', examples: ['Dispel Magic', 'Lesser Restoration', 'Remove Curse'], reason: 'Problem-solving spells for specific situations.' },
    { priority: 5, type: 'Ritual', examples: ['Detect Magic', 'Tiny Hut', 'Water Breathing'], reason: 'Free casting = free value. Always prepare rituals if available.' },
    { priority: 6, type: 'Situational', examples: ['Water Walk', 'Protection from Poison', 'Speak with Dead'], reason: 'Prepare if you know you\'ll need it. Swap out tomorrow.' },
  ],
  known: [
    { priority: 1, type: 'Versatile damage', examples: ['Eldritch Blast', 'Fireball', 'Shatter'], reason: 'Your locked-in combat spell must work in many situations.' },
    { priority: 2, type: 'Defensive', examples: ['Shield', 'Misty Step', 'Absorb Elements'], reason: 'Survival spells you\'ll use every day. Can\'t swap them out.' },
    { priority: 3, type: 'Signature control', examples: ['Hypnotic Pattern', 'Web', 'Hold Person'], reason: 'One great CC spell covers most encounters.' },
    { priority: 4, type: 'Utility with broad use', examples: ['Suggestion', 'Invisibility', 'Dispel Magic'], reason: 'Pick utility that works in AND out of combat.' },
    { priority: 5, type: 'AVOID niche spells', examples: ['Protection from Poison', 'Water Walk', 'Glyph of Warding'], reason: 'Too situational for a known caster. Leave these for prepared casters.' },
  ],
};

export const CLASS_PREP_GUIDES = [
  { class: 'Cleric', formula: 'WIS mod + Cleric level', alwaysPrepare: ['Healing Word', 'Spiritual Weapon', 'Spirit Guardians'], note: 'Domain spells are always prepared and don\'t count against your total.' },
  { class: 'Druid', formula: 'WIS mod + Druid level', alwaysPrepare: ['Healing Word', 'Entangle/Spike Growth', 'Conjure Animals'], note: 'Circle spells are always prepared and don\'t count against your total.' },
  { class: 'Wizard', formula: 'INT mod + Wizard level', alwaysPrepare: ['Shield', 'Counterspell', 'Fireball'], note: 'Can ritual cast from spellbook without preparing. Prepare combat spells.' },
  { class: 'Paladin', formula: 'CHA mod + half Paladin level', alwaysPrepare: ['Shield of Faith', 'Bless', 'Revivify'], note: 'Oath spells always prepared. Smite doesn\'t need a prepared spell.' },
  { class: 'Sorcerer', formula: 'Known: 2-15 spells total', alwaysPrepare: ['Shield', 'Fireball/Lightning Bolt', 'Counterspell'], note: 'Every spell pick matters. Choose wisely — you can only swap one per level-up.' },
];

export function calculatePreparedSlots(className, level, abilityMod) {
  const halfCasters = ['Paladin', 'Ranger', 'Artificer'];
  const classLevel = halfCasters.includes(className) ? Math.floor(level / 2) : level;
  return Math.max(1, abilityMod + classLevel);
}

export function isKnownCaster(className) {
  return ['Bard', 'Ranger', 'Sorcerer', 'Warlock', 'Eldritch Knight', 'Arcane Trickster'].includes(className);
}

export function getPrepGuide(className) {
  return CLASS_PREP_GUIDES.find(c => c.class === className) || null;
}
