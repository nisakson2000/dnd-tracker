/**
 * playerCampSetup.js
 * Player Mode: Camping, watch schedules, and wilderness resting
 * Pure JS — no React dependencies.
 */

export const WATCH_SCHEDULE = {
  longRestDuration: '8 hours',
  sleepRequired: '6 hours minimum',
  watchShift: '2 hours each',
  maxWatchers: 'Party size - 1 per shift (someone always sleeps)',
  rules: [
    'A long rest is 8 hours: at least 6 hours sleeping, up to 2 hours light activity.',
    'Light activity = standing watch, reading, talking. NOT fighting or casting.',
    'If interrupted by combat (1+ hour of strenuous activity), restart the long rest.',
    'Combat under 1 hour doesn\'t break the rest — but the DM may rule otherwise.',
    'Elves only need 4 hours of trance instead of 6 hours sleep. Great for watch duty.',
    'Warforged don\'t sleep but still need 6 hours of inactivity for a long rest.',
  ],
};

export const WATCH_TEMPLATES = [
  { partySize: 3, shifts: [{ watch: 1, hours: '1-3', watcher: 'Player A' }, { watch: 2, hours: '3-5', watcher: 'Player B' }, { watch: 3, hours: '5-7', watcher: 'Player C' }], note: 'Each person gets ~5-6 hours sleep.' },
  { partySize: 4, shifts: [{ watch: 1, hours: '1-3', watcher: 'Player A' }, { watch: 2, hours: '3-5', watcher: 'Player B' }, { watch: 3, hours: '5-7', watcher: 'Player C' }, { watch: 4, hours: '7-8', watcher: 'Player D' }], note: 'Comfortable schedule. Everyone gets 6+ hours.' },
  { partySize: 5, shifts: [{ watch: 1, hours: '1-2.5', watcher: 'Players A+B' }, { watch: 2, hours: '2.5-4', watcher: 'Players C+D' }, { watch: 3, hours: '4-5.5', watcher: 'Player E + A' }], note: 'Pairs for safety. Plenty of sleep for all.' },
];

export const CAMP_ACTIVITIES = [
  { activity: 'Set up Alarm spell', benefit: 'Mental or audible alert if anything enters 20ft cube. Ritual = no spell slot.', who: 'Wizard, Ranger, Eldritch Knight' },
  { activity: 'Tiny Hut', benefit: 'Impenetrable dome. 8-hour duration. Perfect camp. Creatures inside when cast only.', who: 'Wizard, Bard (Magical Secrets)' },
  { activity: 'Goodberry', benefit: 'Create 10 berries before sleeping. Each heals 1 HP and provides a day\'s sustenance.', who: 'Druid, Ranger' },
  { activity: 'Create Water', benefit: 'Create 10 gallons of water. Enough for the whole party and mounts.', who: 'Cleric, Druid' },
  { activity: 'Set traps', benefit: 'Hunting traps (DC 13 STR), caltrops, or tripwires with bells around camp.', who: 'Anyone with supplies' },
  { activity: 'Camouflage camp', benefit: 'Survival check (DC 15) to hide the camp. -5 to enemy Perception to find you.', who: 'Ranger, Druid, high Survival' },
  { activity: 'Cook a meal', benefit: 'Chef feat: short rest temp HP. Or just morale boost (DM discretion).', who: 'Chef feat, Cook\'s Utensils proficiency' },
  { activity: 'Identify items', benefit: 'Identify spell as ritual during rest. Learn all magic item properties.', who: 'Wizard, Bard, Artificer' },
];

export const RANDOM_ENCOUNTER_CHANCE = {
  safe: { chance: '5%', description: 'Settled area, patrolled road, friendly territory.' },
  moderate: { chance: '15%', description: 'Wilderness, minor roads, neutral territory.' },
  dangerous: { chance: '25%', description: 'Deep wilderness, monster territory, war zone.' },
  extreme: { chance: '40%', description: 'Underdark, Shadowfell, active dungeon, enemy camp nearby.' },
};

export function createWatchSchedule(partyMembers) {
  const count = partyMembers.length;
  const hoursPerShift = Math.ceil(8 / count);
  return partyMembers.map((member, i) => ({
    watch: i + 1,
    watcher: member,
    startHour: i * hoursPerShift,
    endHour: Math.min((i + 1) * hoursPerShift, 8),
  }));
}

export function getEncounterChance(dangerLevel) {
  return RANDOM_ENCOUNTER_CHANCE[dangerLevel] || RANDOM_ENCOUNTER_CHANCE.moderate;
}
