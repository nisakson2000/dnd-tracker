/**
 * playerSpellPreparationGuide.js
 * Player Mode: Spell preparation strategies for prepared casters
 * Pure JS — no React dependencies.
 */

export const PREPARED_VS_KNOWN = {
  preparedCasters: ['Cleric', 'Druid', 'Paladin', 'Wizard', 'Artificer'],
  knownCasters: ['Bard', 'Sorcerer', 'Warlock', 'Ranger'],
  preparedRule: 'Prepared casters can change their spell list after each long rest. Known casters are stuck with choices until level-up.',
  preparedCount: {
    cleric: 'WIS mod + Cleric level',
    druid: 'WIS mod + Druid level',
    paladin: 'CHA mod + half Paladin level (round down)',
    wizard: 'INT mod + Wizard level',
    artificer: 'INT mod + half Artificer level (round up)',
  },
  note: 'Prepared casters should change spells based on the day\'s expected challenges. This is a HUGE advantage.',
};

export const ALWAYS_PREPARE_SPELLS = {
  cleric: [
    { spell: 'Healing Word', level: 1, reason: 'Bonus action ranged heal. Never unprepare this.' },
    { spell: 'Bless', level: 1, reason: '+1d4 to attacks and saves. Best L1 buff.' },
    { spell: 'Spirit Guardians', level: 3, reason: 'Best sustained Cleric damage. Always ready.' },
    { spell: 'Revivify', level: 3, reason: 'Bring back the dead. You never know when you\'ll need it.' },
  ],
  druid: [
    { spell: 'Healing Word', level: 1, reason: 'Same as Cleric. Essential.' },
    { spell: 'Conjure Animals', level: 3, reason: 'Best Druid combat spell. 8 wolves.' },
    { spell: 'Pass Without Trace', level: 2, reason: '+10 party Stealth. Game-changing utility.' },
  ],
  wizard: [
    { spell: 'Shield', level: 1, reason: '+5 AC reaction. Always have this in your book and prepared.' },
    { spell: 'Counterspell', level: 3, reason: 'Negate enemy spells. Must-have at L5+.' },
    { spell: 'Fireball', level: 3, reason: 'Best AoE damage. 8d6 in 20ft radius.' },
  ],
  paladin: [
    { spell: 'Bless', level: 1, reason: 'Best use of concentration for Paladins.' },
    { spell: 'Shield of Faith', level: 1, reason: '+2 AC concentration. Good if Bless isn\'t needed.' },
    { spell: 'Revivify', level: 3, reason: 'Emergency resurrection. Always prepared.' },
  ],
};

export const SITUATIONAL_PREPARATION = [
  { situation: 'Dungeon crawl', spells: ['Detect Magic', 'Dispel Magic', 'See Invisibility', 'Knock'], note: 'Trap detection, magic doors, hidden enemies.' },
  { situation: 'Wilderness travel', spells: ['Goodberry', 'Pass Without Trace', 'Water Breathing', 'Wind Walk'], note: 'Survival, stealth, terrain crossing.' },
  { situation: 'Social/city session', spells: ['Zone of Truth', 'Detect Thoughts', 'Suggestion', 'Tongues'], note: 'Information gathering, persuasion, deception detection.' },
  { situation: 'Boss fight', spells: ['Banishment', 'Hold Monster', 'Polymorph', 'Greater Restoration'], note: 'Save-or-suck, buff/debuff, condition removal.' },
  { situation: 'Undead enemies', spells: ['Turn Undead (CD)', 'Spirit Guardians', 'Daylight', 'Holy Weapon'], note: 'Radiant damage, turn undead, sunlight for vampires.' },
  { situation: 'Dragon fight', spells: ['Absorb Elements', 'Protection from Energy', 'Haste', 'Freedom of Movement'], note: 'Elemental resistance, speed for repositioning, freedom from fear/restraint.' },
];

export const RITUAL_SPELLS_ALWAYS_AVAILABLE = {
  note: 'Ritual spells don\'t need to be prepared (for Wizards). Just need them in your spellbook. Clerics/Druids must prepare them.',
  mustHaveRituals: [
    { spell: 'Detect Magic', level: 1, note: 'Constant magic detection. Ritual = free.' },
    { spell: 'Find Familiar', level: 1, note: 'Scout, Help action, deliver touch spells.' },
    { spell: 'Identify', level: 1, note: 'Identify magic items. Short rest alternative exists but Identify is faster.' },
    { spell: 'Tiny Hut', level: 3, note: 'Safe long rest anywhere. Dome of force. Essential for travel.' },
    { spell: 'Phantom Steed', level: 3, note: '100ft speed mount for 1 hour. Ritual cast for free travel speed.' },
    { spell: 'Water Breathing', level: 3, note: '24 hours, 10 creatures. Ritual = free underwater exploration.' },
  ],
};

export function preparedSpellCount(className, level, abilityMod) {
  switch (className) {
    case 'Cleric':
    case 'Druid':
      return Math.max(1, abilityMod + level);
    case 'Wizard':
      return Math.max(1, abilityMod + level);
    case 'Paladin':
      return Math.max(1, abilityMod + Math.floor(level / 2));
    case 'Artificer':
      return Math.max(1, abilityMod + Math.ceil(level / 2));
    default:
      return 0; // Known casters don't prepare
  }
}

export function domainSpellsCount(clericLevel) {
  if (clericLevel >= 9) return 10; // 2 per spell level 1-5
  if (clericLevel >= 7) return 8;
  if (clericLevel >= 5) return 6;
  if (clericLevel >= 3) return 4;
  return 2;
}
