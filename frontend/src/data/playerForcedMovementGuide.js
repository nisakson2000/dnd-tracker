/**
 * playerForcedMovementGuide.js
 * Player Mode: Forced movement — push, pull, hazard combos
 * Pure JS — no React dependencies.
 */

export const FORCED_MOVEMENT_RULES = {
  key: 'Forced movement does NOT provoke opportunity attacks.',
  rule: 'OAs only trigger on voluntary movement. Pushed, pulled, or teleported creatures do not provoke.',
  exception: 'Dissonant Whispers uses the target\'s REACTION to move — this IS voluntary and DOES provoke OAs.',
  note: 'This distinction matters hugely. Thunderwave push = no OAs. Dissonant Whispers flee = OAs.',
};

export const PUSH_SOURCES = [
  { source: 'Repelling Blast (Warlock)', type: 'Push 10ft per beam', note: '4 beams at L17 = 40ft push. No save. Most reliable push.' },
  { source: 'Thunderwave', type: 'Push 10ft (STR save)', note: 'AoE push. 10ft on failed save.' },
  { source: 'Gust of Wind', type: 'Push 15ft/turn (STR save)', note: 'Concentration. Repeated push each turn.' },
  { source: 'Telekinetic feat', type: 'Push/pull 5ft (STR save)', note: 'BA. No save on willing creatures.' },
  { source: 'Shield Master', type: 'Shove after Attack action', note: 'Push 5ft or knock prone.' },
  { source: 'Shove action', type: 'Push 5ft or prone', note: 'Athletics vs Athletics/Acrobatics.' },
  { source: 'Eldritch Blast + Grasp of Hadar', type: 'Pull 10ft per beam', note: 'Pull instead of push. Once per turn.' },
  { source: 'Thorn Whip', type: 'Pull 10ft toward you', note: 'Druid cantrip. Pull into Spirit Guardians or hazards.' },
  { source: 'Lightning Lure', type: 'Pull 10ft toward you (STR save)', note: 'Extra damage if pulled to within 5ft.' },
];

export const HAZARD_COMBOS = [
  {
    hazard: 'Spike Growth',
    damage: '2d4 per 5ft moved through',
    combo: 'EB + Repelling Blast: push target through Spike Growth. 4 beams × 10ft push = 8d4 damage (20 avg) per round.',
    rating: 'S',
  },
  {
    hazard: 'Spirit Guardians',
    damage: '3d8 on entering area or starting turn there',
    combo: 'Telekinetic shove into SG aura. Triggers damage on entry. Then they take damage again at start of their turn.',
    rating: 'S',
  },
  {
    hazard: 'Wall of Fire',
    damage: '5d8 on entering/starting on fire side',
    combo: 'Push enemy through Wall of Fire. 5d8 each time they pass through. EB + Repelling Blast = repeated pushes.',
    rating: 'S',
  },
  {
    hazard: 'Cloud of Daggers',
    damage: '4d4 on entering or starting turn',
    combo: 'Small area (5ft cube). Push/pull enemy into it. They take 4d4 on entry, 4d4 on their turn start.',
    rating: 'A',
  },
  {
    hazard: 'Moonbeam',
    damage: '2d10 on entering or starting turn',
    combo: 'Push into Moonbeam. Can also move the beam onto enemies (action).',
    rating: 'A',
  },
  {
    hazard: 'Environmental',
    damage: 'Fall damage (1d6/10ft), lava, pits, cliffs',
    combo: 'Push off cliff. Thunderwave near ledge. Repelling Blast into pit. Creative and devastating.',
    rating: 'S',
  },
];

export const SPIKE_GROWTH_EB_MATH = {
  combo: 'Spike Growth (Druid/Ranger L2) + Eldritch Blast + Repelling Blast',
  beamsByLevel: [
    { level: 5, beams: 2, pushPerBeam: 10, spikeDmg: '4d4 (10 avg)', totalPush: '20ft', note: '2 beams × 10ft = 20ft through Spike Growth = 4d4 per round.' },
    { level: 11, beams: 3, pushPerBeam: 10, spikeDmg: '6d4 (15 avg)', totalPush: '30ft', note: '3 beams × 10ft = 30ft = 6d4. Plus EB damage.' },
    { level: 17, beams: 4, pushPerBeam: 10, spikeDmg: '8d4 (20 avg)', totalPush: '40ft', note: '4 beams × 10ft = 40ft = 8d4. Plus 4d10+CHA×4 EB damage.' },
  ],
  note: 'This combo is why Warlock/Druid multiclass (or Warlock + Nature Cleric with Spike Growth) is so powerful.',
};

export function spikeGrowthDamage(feetPushed) {
  const d4s = Math.floor(feetPushed / 5) * 2;
  const avg = d4s * 2.5;
  return { dice: `${d4s}d4`, avg: Math.round(avg), note: `${feetPushed}ft through Spike Growth = ${d4s}d4 (${Math.round(avg)} avg) piercing damage.` };
}
