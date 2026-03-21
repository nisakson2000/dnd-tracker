/**
 * playerSpellBookManagement.js
 * Player Mode: Wizard spellbook management and spell acquisition
 * Pure JS — no React dependencies.
 */

export const SPELLBOOK_RULES = {
  starting: 'Level 1: 6 spells in your spellbook (1st-level wizard spells).',
  perLevel: 'Each wizard level: add 2 wizard spells of a level you can cast (FREE).',
  copying: 'Copy from scrolls/other spellbooks: 2 hours + 50 gp per spell level.',
  preparing: 'Prepare INT mod + wizard level spells per long rest.',
  ritual: 'Can ritual cast any ritual spell in your book WITHOUT preparing it.',
  lost: 'If spellbook is lost/destroyed, you can recreate it: 1 hour + 10 gp per spell level for prepared spells. Unprepared spells are GONE.',
  backup: 'ALWAYS make a backup copy of your spellbook. 1 hour + 10 gp per spell level.',
};

export const SPELL_ACQUISITION = [
  { method: 'Level Up', cost: 'Free', spells: 2, note: 'Choose any wizard spell of a level you can cast. Best way to get spells.' },
  { method: 'Found Scrolls', cost: '50 gp × spell level + 2 hours', spells: 1, note: 'Scroll is consumed in the process. INT check DC 10 + spell level. Fail = scroll destroyed, gold spent.' },
  { method: 'Other Wizard\'s Spellbook', cost: '50 gp × spell level + 2 hours', spells: 'Varies', note: 'Must be wizard spells. Can copy as many as you have time and gold for.' },
  { method: 'Downtime Study', cost: 'DM discretion', spells: 'Varies', note: 'Research new spells during downtime. Usually requires a library or mentor.' },
  { method: 'Quest Reward', cost: 'Free (quest completion)', spells: 'Varies', note: 'DMs may reward spellbooks or scrolls for completing objectives.' },
];

export const MUST_HAVE_WIZARD_SPELLS = {
  '1st': [
    { spell: 'Shield', reason: '+5 AC as reaction. Take this. Always.', priority: 'S' },
    { spell: 'Find Familiar', reason: 'The best 1st-level spell. Scout, Help action, deliver touch spells.', priority: 'S' },
    { spell: 'Absorb Elements', reason: 'Halve elemental damage as reaction. Essential vs dragons and casters.', priority: 'S' },
    { spell: 'Magic Missile', reason: 'Auto-hit. Never misses. Good for concentration breaking.', priority: 'A' },
    { spell: 'Detect Magic', reason: 'Ritual castable. Find magic items, traps, illusions.', priority: 'A' },
  ],
  '2nd': [
    { spell: 'Misty Step', reason: 'Bonus action teleport 30ft. Emergency escape.', priority: 'S' },
    { spell: 'Web', reason: 'Best 2nd-level control spell. Restrained + difficult terrain.', priority: 'S' },
    { spell: 'Invisibility', reason: 'Scouting, sneaking, positioning. Versatile.', priority: 'A' },
  ],
  '3rd': [
    { spell: 'Fireball', reason: '8d6 in 20ft radius. The iconic damage spell.', priority: 'S' },
    { spell: 'Counterspell', reason: 'Shut down enemy casters. Reaction to prevent a spell.', priority: 'S' },
    { spell: 'Dispel Magic', reason: 'Remove enemy buffs and effects.', priority: 'A' },
    { spell: 'Hypnotic Pattern', reason: 'Mass incapacitation. 30ft cube. WIS save.', priority: 'S' },
    { spell: 'Tiny Hut', reason: 'Ritual. Perfect safe rest anywhere. 8-hour dome.', priority: 'A' },
  ],
  '4th': [
    { spell: 'Polymorph', reason: 'Turn ally into Giant Ape (157 HP). Or enemy into snail.', priority: 'S' },
    { spell: 'Dimension Door', reason: '500ft teleport. Bring one willing creature. Escape or infiltrate.', priority: 'A' },
    { spell: 'Banishment', reason: 'Remove one enemy from combat for 1 minute. CHA save.', priority: 'A' },
  ],
  '5th': [
    { spell: 'Wall of Force', reason: 'Indestructible wall/dome. Splits battlefield. No save.', priority: 'S' },
    { spell: 'Animate Objects', reason: '10 tiny objects = 10 attacks per round. Insane damage.', priority: 'S' },
    { spell: 'Telekinesis', reason: 'Move creatures/objects. No concentration check on STR contest.', priority: 'A' },
  ],
};

export const SPELLBOOK_BACKUP_GUIDE = {
  cost: '10 gp per spell level (per spell)',
  time: '1 hour per spell level (per spell)',
  advice: [
    'Back up your MOST IMPORTANT spells first (Shield, Counterspell, etc.)',
    'Keep the backup in a separate location (Bag of Holding, with a trusted NPC)',
    'A level 10 wizard with 26 spells could cost 260-520+ gp to fully back up',
    'Alternatively: keep a second spellbook with just the essentials (10 spells)',
    'Some DMs allow Arcane Lock on your spellbook (it IS an object)',
  ],
};

export function calculateCopyingCost(spellLevel, numberOfSpells) {
  return {
    gold: spellLevel * 50 * numberOfSpells,
    hours: spellLevel * 2 * numberOfSpells,
    days: Math.ceil((spellLevel * 2 * numberOfSpells) / 8),
  };
}

export function getSpellsKnownAtLevel(wizardLevel) {
  return 6 + ((wizardLevel - 1) * 2);
}

export function getMustHaveSpells(spellLevel) {
  return MUST_HAVE_WIZARD_SPELLS[spellLevel] || [];
}
