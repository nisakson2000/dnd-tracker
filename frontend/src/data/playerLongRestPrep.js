/**
 * playerLongRestPrep.js
 * Player Mode: Pre-rest and post-rest spell preparation and buffing strategies
 * Pure JS — no React dependencies.
 */

export const PRE_REST_BUFFS = {
  note: 'Cast long-duration spells BEFORE your long rest ends. They persist into the next day.',
  spells: [
    { spell: 'Mage Armor', duration: '8 hours', timing: 'Cast at hour 7 of rest. Lasts 7 more hours into the day.', level: 1 },
    { spell: 'Aid', duration: '8 hours', timing: 'Cast right before rest ends. +5/+10/+15 max HP for the day.', level: 2 },
    { spell: 'Death Ward', duration: '8 hours', timing: 'Cast before rest ends. Free "don\'t die" for 8 hours.', level: 4 },
    { spell: 'Longstrider', duration: '1 hour', timing: 'Cast right before leaving camp. +10ft speed.', level: 1 },
    { spell: 'Gift of Alacrity', duration: '8 hours', timing: 'Cast before rest ends. +1d8 initiative all day.', level: 1 },
    { spell: 'Nondetection', duration: '8 hours', timing: 'Cast before entering enemy territory. Invisible to scrying.', level: 3 },
  ],
};

export const POST_REST_SPELLS = {
  rituals: [
    'Find Familiar: 1 hour ritual. Always have your owl/bat ready.',
    'Detect Magic: 10 min ritual. Scan the area before moving out.',
    'Alarm: 1 min ritual. If camping again soon, pre-set alarms.',
    'Phantom Steed: 1 min ritual. 100ft speed mount for 1 hour.',
    'Leomund\'s Tiny Hut: 1 min ritual. Set up for tonight before you leave (no, that doesn\'t work — you\'d have to be inside).',
  ],
  note: 'Rituals don\'t use spell slots. Cast them freely during downtime.',
};

export const SPELL_PREP_STRATEGY = {
  alwaysPrepare: [
    'Healing Word (any healer): emergency pick-up.',
    'Counterspell (Wizard/Sorcerer): always have it ready.',
    'Revivify (Cleric/Paladin/Druid): death insurance.',
    'Dispel Magic (most casters): remove debuffs and magical obstacles.',
    'Shield (Wizard/Sorcerer): survival.',
  ],
  adaptToSituation: [
    'Fighting undead? Prepare: Spirit Guardians, Turn Undead, radiant spells.',
    'Dungeon crawl? Prepare: Detect Magic, Knock, Darkvision, Arcane Eye.',
    'Social encounter? Prepare: Suggestion, Zone of Truth, Detect Thoughts, Charm Person.',
    'Boss fight? Prepare: Haste, Hold Monster, Greater Invisibility, Banishment.',
    'Travel day? Prepare: Goodberry, Pass Without Trace, Longstrider, Tiny Hut.',
  ],
};

export const KNOWN_VS_PREPARED = {
  prepared: {
    classes: 'Cleric, Druid, Paladin, Artificer, Wizard (from spellbook)',
    rule: 'Choose spells each long rest from your full class list (or spellbook). Can change daily.',
    tip: 'Prepare versatile spells. You can always swap tomorrow.',
  },
  known: {
    classes: 'Bard, Ranger, Sorcerer, Warlock',
    rule: 'Fixed spells known. Can only swap one per level-up.',
    tip: 'Choose spells carefully. Pick flexible, always-useful spells. Avoid situational ones.',
  },
};

export function preparedSpellCount(className, level, castingMod) {
  if (['cleric', 'druid', 'paladin'].includes(className.toLowerCase())) {
    const base = level + castingMod;
    return Math.max(1, className.toLowerCase() === 'paladin' ? Math.floor(level / 2) + castingMod : base);
  }
  if (className.toLowerCase() === 'wizard') return level + castingMod;
  if (className.toLowerCase() === 'artificer') return Math.floor(level / 2) + castingMod;
  return 0; // Known casters don't prepare
}

export function aidHPFromPreRest(spellLevel) {
  return 5 * (spellLevel - 1); // +5 per level above 1st
}
