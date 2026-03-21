/**
 * playerSummonTracker.js
 * Player Mode: Summon/companion creature tracking
 * Pure JS — no React dependencies.
 */

export const SUMMON_TYPES = [
  { spell: 'Find Familiar', level: 1, classes: ['Wizard'], duration: 'Until dismissed/killed', concentration: false, maxCR: 0, options: ['Bat', 'Cat', 'Crab', 'Frog', 'Hawk', 'Lizard', 'Octopus', 'Owl', 'Poisonous Snake', 'Fish', 'Rat', 'Raven', 'Sea Horse', 'Spider', 'Weasel'] },
  { spell: 'Conjure Animals', level: 3, classes: ['Druid', 'Ranger'], duration: '1 hour (concentration)', concentration: true, maxCR: 2, note: 'DM chooses creatures. Number depends on CR chosen.' },
  { spell: 'Summon Beast', level: 2, classes: ['Druid', 'Ranger'], duration: '1 hour (concentration)', concentration: true, note: 'Tasha\'s. Choose Air, Land, or Water form.' },
  { spell: 'Summon Fey', level: 3, classes: ['Druid', 'Ranger', 'Warlock', 'Wizard'], duration: '1 hour (concentration)', concentration: true, note: 'Tasha\'s. Choose Fuming, Mirthful, or Tricksy mood.' },
  { spell: 'Summon Undead', level: 3, classes: ['Warlock', 'Wizard'], duration: '1 hour (concentration)', concentration: true, note: 'Tasha\'s. Choose Ghostly, Putrid, or Skeletal form.' },
  { spell: 'Conjure Elemental', level: 5, classes: ['Druid', 'Wizard'], duration: '1 hour (concentration)', concentration: true, maxCR: 5, note: 'Hostile if concentration breaks!' },
  { spell: 'Conjure Woodland Beings', level: 4, classes: ['Druid', 'Ranger'], duration: '1 hour (concentration)', concentration: true, note: 'DM chooses fey creatures.' },
  { spell: 'Animate Dead', level: 3, classes: ['Cleric', 'Wizard'], duration: '24 hours', concentration: false, note: 'Reassert control every 24 hours or they become hostile.' },
  { spell: 'Spirit Guardians', level: 3, classes: ['Cleric'], duration: '10 min (concentration)', concentration: true, note: 'Not a summon — 15ft aura, 3d8 radiant/necrotic, half speed in area.' },
  { spell: 'Spiritual Weapon', level: 2, classes: ['Cleric'], duration: '1 minute', concentration: false, note: 'Bonus action to attack. Doesn\'t use concentration!' },
];

export const SUMMON_TEMPLATE = {
  name: '',
  sourceSpell: '',
  hp: 0,
  maxHP: 0,
  ac: 0,
  attacks: [],
  speed: '',
  active: true,
  roundsSummoned: 0,
  concentration: false,
};

export function createSummon(spell, name, hp, ac, speed = '30ft') {
  return {
    ...SUMMON_TEMPLATE,
    name: name || spell,
    sourceSpell: spell,
    hp,
    maxHP: hp,
    ac,
    speed,
    concentration: SUMMON_TYPES.find(s => s.spell === spell)?.concentration || false,
  };
}

export function getSummonSpells(className) {
  return SUMMON_TYPES.filter(s =>
    s.classes.some(c => c.toLowerCase() === (className || '').toLowerCase())
  );
}

export function tickSummonDuration(summon) {
  return { ...summon, roundsSummoned: summon.roundsSummoned + 1 };
}
