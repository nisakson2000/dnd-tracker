/**
 * playerLongRestPlanning.js
 * Player Mode: Long rest optimization, watch schedules, and overnight survival
 * Pure JS — no React dependencies.
 */

export const LONG_REST_RULES = {
  duration: '8 hours minimum. At least 6 hours of sleep, up to 2 hours of light activity.',
  lightActivity: 'Reading, talking, eating, standing watch (up to 2 hours).',
  recovery: ['All HP restored', 'Half total hit dice (round down, min 1)', 'All spell slots', 'All class features', 'One level of exhaustion'],
  restrictions: ['Only one long rest per 24 hours', 'Must have eaten and drunk water', 'Combat (1+ minute) or strenuous activity (1+ hour) restarts the timer'],
  interruption: 'If combat lasts more than 1 minute OR strenuous activity more than 1 hour, the rest must start over.',
};

export const WATCH_SCHEDULES = {
  fourPerson: {
    description: '4-person party, 8-hour rest, each takes 2-hour watch',
    schedule: [
      { watch: 1, hours: '1st-2nd hour', bestFor: 'Elf/Warforged (don\'t need as much sleep)' },
      { watch: 2, hours: '3rd-4th hour', bestFor: 'High Perception character' },
      { watch: 3, hours: '5th-6th hour', bestFor: 'Anyone' },
      { watch: 4, hours: '7th-8th hour', bestFor: 'Character with Alarm spell' },
    ],
    note: 'Everyone gets 6 hours of sleep. RAW requires 6 hours for a long rest.',
  },
  threePerson: {
    description: '3-person party, 8-hour rest',
    schedule: [
      { watch: 1, hours: '1st-3rd hour (2.5 hrs)', bestFor: 'Elf (trance = only 4 hours needed)' },
      { watch: 2, hours: '3rd-5.5th hour (2.5 hrs)', bestFor: 'High Perception' },
      { watch: 3, hours: '5.5th-8th hour (2.5 hrs)', bestFor: 'Anyone' },
    ],
    note: '2.5 hours each. Tight but works if everyone needs 6 hours sleep.',
  },
  elfAdvantage: {
    description: 'Elves only need 4 hours (Trance). They can take longer watches.',
    benefit: 'An Elf can take a 4-hour watch while still completing their trance, allowing other party members to sleep 8 full hours.',
  },
  warforgedAdvantage: {
    description: 'Warforged don\'t sleep but still need 6 hours of inactivity for a long rest.',
    benefit: 'Can remain alert during "rest" with Sentry\'s Rest. 2-hour watch doesn\'t interrupt their rest.',
  },
};

export const CAMP_SECURITY = [
  { method: 'Alarm spell (ritual)', detail: '20ft cube. Mental or audible alarm when Tiny+ creature enters. 8-hour duration. No slot needed (ritual).', priority: 'S' },
  { method: 'Tiny Hut', detail: 'Leomund\'s Tiny Hut: 10ft hemisphere dome. Nothing can pass through. 8-hour duration. Ritual castable.', priority: 'S' },
  { method: 'Find Familiar (owl patrol)', detail: 'Owl circles camp. 120ft darkvision. Passive Perception 13. Alert the party of approaching threats.', priority: 'A' },
  { method: 'Sentinel Shield on watch', detail: 'Advantage on Perception checks. +5 to passive Perception effectively.', priority: 'A' },
  { method: 'Caltrops/Ball Bearings', detail: 'Scatter around camp approaches. Noisy when stepped on. Cheap early warning.', priority: 'B' },
  { method: 'Guard Drake/Companion', detail: 'Beast companions, familiars, or summoned creatures can serve as additional sentries.', priority: 'B' },
  { method: 'Glyph of Warding', detail: 'Expensive (200gp dust) but you can set trap glyphs around your camp. Fireball on intruders.', priority: 'A' },
  { method: 'Forbiddance (ritual)', detail: 'Cleric ritual. Prevents teleportation and damages certain creature types in the area.', priority: 'A' },
];

export const INTERRUPTED_REST = {
  combat: 'If combat lasts less than 1 minute (10 rounds), the rest is NOT interrupted. Quick fights are fine.',
  strenuous: 'Walking, running, fighting for more than 1 hour restarts the rest. Moving camp = restarting.',
  spellcasting: 'Casting a spell during rest counts as light activity unless it\'s strenuous (combat spells).',
  tip: 'If you\'re attacked during a long rest, try to end the combat quickly (under 1 minute) to preserve the rest.',
};

export const PRE_SLEEP_CHECKLIST = [
  { task: 'Set up Alarm spells', who: 'Wizard/Ranger (ritual)', note: 'Cover all approaches. Multiple alarms for large camps.' },
  { task: 'Cast Tiny Hut', who: 'Wizard/Bard', note: 'Best security. Nothing gets in. 8-hour duration matches rest.' },
  { task: 'Assign watch order', who: 'Party leader', note: 'Highest Perception first or last (most dangerous times).' },
  { task: 'Prepare healing', who: 'Healer', note: 'Prayer of Healing before sleep if party is injured. Saves morning slots.' },
  { task: 'Attune to magic items', who: 'Anyone', note: 'Attuning takes a short rest. Do it during the long rest.' },
  { task: 'Prepare spells', who: 'Prepared casters', note: 'Swap spell list at the end of the long rest, after seeing what\'s needed.' },
  { task: 'Cook meals (Chef feat)', who: 'Chef', note: 'Prepare food during rest. Allies regain extra HP and get temp HP treats.' },
];

export function watchDuration(partySize, restHours) {
  const watchHours = 2; // Each person watches for 2 hours max for long rest
  const totalWatchNeeded = restHours;
  return { hoursPerPerson: Math.ceil(totalWatchNeeded / partySize * 10) / 10, canAllSleep6Hours: (totalWatchNeeded / partySize) <= 2 };
}

export function isRestInterrupted(combatRounds, strenuousMinutes) {
  const combatMinutes = combatRounds / 10; // 10 rounds = 1 minute
  if (combatMinutes > 1) return { interrupted: true, reason: 'Combat lasted more than 1 minute.' };
  if (strenuousMinutes > 60) return { interrupted: true, reason: 'Strenuous activity exceeded 1 hour.' };
  return { interrupted: false, reason: 'Rest continues. Short interruptions are fine.' };
}
