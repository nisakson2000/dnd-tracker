/**
 * playerDeathHandling.js
 * Player Mode: Character death handling and resurrection options
 * Pure JS — no React dependencies.
 */

export const DEATH_MECHANICS = {
  droppingTo0: 'You fall unconscious. You\'re not dead yet — just dying.',
  deathSaves: 'Each turn: roll d20. 10+ = success. Below 10 = fail. 3 successes = stable. 3 fails = dead.',
  nat20DeathSave: 'Regain 1 HP and regain consciousness. Incredibly clutch.',
  nat1DeathSave: 'Counts as TWO failures. Very dangerous.',
  takingDamageAt0: 'Each hit = 1 death save failure. Critical hit from within 5ft = 2 failures.',
  massiveDamage: 'If remaining damage after 0 HP equals or exceeds your max HP, you\'re INSTANTLY dead. No saves.',
  stabilizing: 'Stable = no longer making death saves but still unconscious. Regain 1 HP after 1d4 hours.',
};

export const RESURRECTION_SPELLS = [
  { spell: 'Spare the Dying', level: 'Cantrip', cost: 'Free', time: '1 action', limitation: 'Only stabilizes. Doesn\'t bring back to consciousness.', available: 'Cleric, Artificer' },
  { spell: 'Healing Word', level: '1st', cost: 'Spell slot', time: 'Bonus action', limitation: 'Gets them up at 1+ HP. Not technically resurrection — prevents death.', available: 'Bard, Cleric, Druid' },
  { spell: 'Revivify', level: '3rd', cost: '300 gp diamond', time: '1 action', limitation: 'Must be used within 1 MINUTE of death. Won\'t restore missing body parts.', available: 'Cleric, Paladin, Artificer, Druid (Wildfire), Ranger (TCoE)' },
  { spell: 'Raise Dead', level: '5th', cost: '500 gp diamond', time: '1 hour', limitation: 'Within 10 DAYS of death. Can\'t restore missing parts. -4 penalty that reduces by 1 per long rest.', available: 'Cleric, Bard, Paladin' },
  { spell: 'Reincarnate', level: '5th', cost: '1000 gp oils', time: '1 hour', limitation: 'Within 10 days. Creates a NEW BODY (random race roll!). Soul must be willing.', available: 'Druid' },
  { spell: 'Resurrection', level: '7th', cost: '1000 gp diamond', time: '1 hour', limitation: 'Within 100 YEARS. Restores missing parts. -4 penalty reduces per long rest.', available: 'Cleric, Bard' },
  { spell: 'True Resurrection', level: '9th', cost: '25000 gp diamond', time: '1 hour', limitation: 'Within 200 YEARS. No body needed. Full restoration. No penalty.', available: 'Cleric, Druid' },
  { spell: 'Wish', level: '9th', cost: 'None (but risks)', time: '1 action', limitation: 'Can duplicate Resurrection or True Resurrection. Risk of never casting Wish again.', available: 'Wizard, Sorcerer' },
];

export const PERMANENT_DEATH_CAUSES = [
  'Disintegrate reduces to 0 HP → body turns to dust. Need True Resurrection or Wish.',
  'Soul trapped (Soul Cage, Imprisonment) → can\'t be resurrected until freed.',
  'Willing soul required → if the player doesn\'t want to come back, resurrection fails.',
  'Deity intervention → some gods may prevent resurrection.',
  'Body completely destroyed (dissolved in acid, eaten, etc.) → need Resurrection (7th+) or higher.',
  'Massive damage equal to max HP → instant death, but still revivable with Revivify+.',
];

export const BACKUP_CHARACTER_TIPS = [
  'Always have a backup character concept ready. Death can come suddenly.',
  'Match the party\'s level. Most DMs start replacements at party level.',
  'Consider what role the party needs. Fill a gap left by the departed.',
  'Have a reason to join the party. Shared goals, mutual acquaintance, hired help.',
  'Don\'t make a "replacement" of your old character. Make something new.',
  'Some DMs let you inherit a portion of your old character\'s wealth.',
  'Build your backup during downtime. Have the sheet ready before you need it.',
];

export function getResurrectionOptions(spellLevel, goldAvailable, timeSinceDeath) {
  return RESURRECTION_SPELLS.filter(s => {
    if (typeof s.level === 'string' && s.level === 'Cantrip') return true;
    const lvl = parseInt(s.level);
    if (lvl > spellLevel) return false;
    const cost = parseInt(s.cost) || 0;
    if (cost > goldAvailable) return false;
    return true;
  });
}

export function isRevivifyWindow(minutesSinceDeath) {
  return minutesSinceDeath <= 1;
}

export function isRaiseDeadWindow(daysSinceDeath) {
  return daysSinceDeath <= 10;
}
