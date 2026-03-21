/**
 * playerResurrectionGuide.js
 * Player Mode: Death and resurrection mechanics, costs, and preparation
 * Pure JS — no React dependencies.
 */

export const DEATH_MECHANICS = {
  dropping: 'At 0 HP: fall unconscious, start death saves.',
  deathSaves: {
    trigger: 'Start of each turn at 0 HP',
    dc: '10 (flat)',
    success3: 'Stabilize at 0 HP (unconscious but not dying)',
    fail3: 'Die',
    nat20: 'Regain 1 HP and wake up',
    nat1: 'Counts as TWO failures',
    damage: 'Taking damage at 0 HP = 1 death save failure. Crit = 2 failures.',
    melee: 'Attacks within 5ft against unconscious targets auto-crit = 2 death save failures.',
  },
  massiveDamage: 'If remaining damage after dropping to 0 equals or exceeds your max HP, instant death.',
  stabilized: 'Stabilized: unconscious at 0 HP. Regain 1 HP after 1d4 hours.',
};

export const RESURRECTION_SPELLS = [
  {
    spell: 'Spare the Dying',
    level: 'Cantrip',
    cost: 'None',
    time: 'Action',
    limitation: 'Stabilizes only. Doesn\'t restore HP. Target is still unconscious.',
    timeLimit: 'Must be alive (before 3 death save failures)',
    rating: 'B',
  },
  {
    spell: 'Healing Word / Cure Wounds',
    level: '1st',
    cost: 'Spell slot',
    time: 'Bonus Action / Action',
    limitation: 'Must be at 0 HP (not dead). Restores HP and wakes them up.',
    timeLimit: 'Before death (3 failed saves)',
    rating: 'S',
  },
  {
    spell: 'Revivify',
    level: '3rd',
    cost: '300 gp diamond (consumed)',
    time: 'Action',
    limitation: 'Must touch the creature. Must have died within the last MINUTE.',
    timeLimit: '1 minute',
    rating: 'S',
  },
  {
    spell: 'Raise Dead',
    level: '5th',
    cost: '500 gp diamond (consumed)',
    time: '1 hour',
    limitation: 'Must have the body. Dead no more than 10 days. -4 penalty to d20 rolls (decreases by 1 per long rest).',
    timeLimit: '10 days',
    rating: 'A',
  },
  {
    spell: 'Reincarnate',
    level: '5th',
    cost: '1,000 gp of rare oils and unguents (consumed)',
    time: '1 hour',
    limitation: 'Returns in a RANDOM race body. Dead no more than 10 days. Needs a piece of the body.',
    timeLimit: '10 days',
    rating: 'B',
  },
  {
    spell: 'Resurrection',
    level: '7th',
    cost: '1,000 gp diamond (consumed)',
    time: '1 hour',
    limitation: 'Dead no more than 100 years. Cures all nonmagical diseases. No body needed except soul must be free.',
    timeLimit: '100 years',
    rating: 'A',
  },
  {
    spell: 'True Resurrection',
    level: '9th',
    cost: '25,000 gp (consumed)',
    time: '1 hour',
    limitation: 'Dead no more than 200 years. No body needed. Restores body completely.',
    timeLimit: '200 years',
    rating: 'S',
  },
  {
    spell: 'Wish',
    level: '9th',
    cost: 'None (but risks losing Wish forever)',
    time: 'Action',
    limitation: 'Can duplicate any 8th level or lower spell (including Resurrection). No component cost.',
    timeLimit: 'Per duplicated spell',
    rating: 'S',
  },
];

export const PREVENTION_STRATEGIES = [
  { strategy: 'Carry diamonds', detail: 'Always have a 300 gp diamond for Revivify. Cheap insurance.', priority: 'S' },
  { strategy: 'Healing Word on 0 HP allies', detail: 'Pick up downed allies immediately. They can act on their turn.', priority: 'S' },
  { strategy: 'Protect the healer', detail: 'If the healer dies, nobody can heal or Revivify. Protect them.', priority: 'S' },
  { strategy: 'Death Ward (4th level)', detail: 'When target drops to 0, go to 1 HP instead. Once per casting. No concentration.', priority: 'A' },
  { strategy: 'Clone (8th level)', detail: 'Grow a backup body. When you die, your soul transfers. Ultimate insurance.', priority: 'A' },
  { strategy: 'Ring of Free Action', detail: 'Can\'t be paralyzed or restrained. Prevents auto-crit death spirals.', priority: 'B' },
  { strategy: 'Gentle Repose', detail: 'Extends Revivify time limit. Cast on the dead body to stop the 1-minute clock.', priority: 'A' },
];

export const GENTLE_REPOSE_TRICK = {
  spell: 'Gentle Repose (2nd level, ritual)',
  effect: 'Extends the death timer. The 10-day limit for Raise Dead pauses while Gentle Repose is active.',
  revivifyCombo: 'Cast Gentle Repose on a dead ally. The 1-minute Revivify timer PAUSES. You can Revivify them later when you have a diamond.',
  ritualCasting: 'Cast as a ritual every 10 days to keep a body preserved indefinitely.',
  note: 'This is the best "we don\'t have a diamond right now" strategy.',
};

export function canRevive(spell, minutesSinceDeath) {
  const timeLimits = {
    Revivify: 1,
    'Raise Dead': 14400, // 10 days
    Reincarnate: 14400,
    Resurrection: 52560000, // 100 years
    'True Resurrection': 105120000, // 200 years
  };
  const limit = timeLimits[spell];
  if (!limit) return { canRevive: false, reason: 'Unknown spell.' };
  return { canRevive: minutesSinceDeath <= limit, reason: minutesSinceDeath <= limit ? 'Within time limit.' : 'Too much time has passed.' };
}

export function deathSaveProbability(successes, failures) {
  // Simplified — returns rough survival chance
  if (failures >= 3) return 0;
  if (successes >= 3) return 100;
  const remainingNeeded = 3 - successes;
  const remainingFails = 3 - failures;
  // Rough estimate
  return Math.round((remainingFails / (remainingNeeded + remainingFails)) * 100);
}
