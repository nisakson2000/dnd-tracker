/**
 * playerSwimmingClimbingGuide.js
 * Player Mode: Swimming, climbing, and difficult movement rules
 * Pure JS — no React dependencies.
 */

export const CLIMBING_RULES = {
  cost: 'Each foot of climbing costs 1 extra foot of movement (2 total). In difficult conditions: 1 foot costs 3 feet total.',
  check: 'DM may require Athletics check for difficult climbs. DC varies by surface.',
  falling: 'Fall = 1d6 bludgeoning per 10ft fallen (max 20d6 = 200ft).',
  note: 'Climbing speed: costs normal movement (no extra). Spider Climb: climb at walking speed on any surface.',
};

export const SWIMMING_RULES = {
  cost: 'Each foot of swimming costs 1 extra foot of movement (2 total). Calm water only.',
  roughWater: 'Rough water requires Athletics check (DC set by DM). Failure = no progress.',
  holding_breath: 'Hold breath: 1 + CON mod minutes (minimum 30 seconds). When out: survive CON mod rounds, then drop to 0 HP.',
  underwater_combat: 'Without swim speed: disadvantage on melee attacks (except dagger, javelin, shortsword, spear, trident). Ranged attacks auto-miss beyond normal range, disadvantage within normal range.',
  note: 'Swim speed negates the extra movement cost and underwater melee disadvantage.',
};

export const CLIMBING_DCS = [
  { surface: 'Ladder/rope', dc: 0, note: 'No check needed. Half speed.' },
  { surface: 'Rocky cliff with handholds', dc: 10, note: 'Easy. Most adventurers succeed.' },
  { surface: 'Brick wall with mortar gaps', dc: 15, note: 'Moderate. Need decent Athletics.' },
  { surface: 'Smooth stone wall', dc: 20, note: 'Hard. Requires tools or magic.' },
  { surface: 'Wet/icy surface', dc: 25, note: 'Near-impossible without climb speed or magic.' },
  { surface: 'Ceiling (inverted)', dc: 30, note: 'Requires Spider Climb or similar magic.' },
];

export const MOVEMENT_SOURCES = {
  climbSpeed: [
    { source: 'Spider Climb spell (L2)', effect: 'Walk on walls/ceilings. Hands free. Concentration.', note: 'Best climbing spell. Any surface.' },
    { source: 'Tabaxi (Cat\'s Claws)', effect: '20ft climb speed.', note: 'Racial climb speed. No checks needed.' },
    { source: 'Thief Second-Story Work', effect: 'Climbing doesn\'t cost extra movement.', note: 'Full speed climbing. Effectively a climb speed.' },
    { source: 'Boots of Spider Climbing', effect: 'Walk on walls/ceilings (no hands). No speed reduction.', note: 'Spider Climb without concentration.' },
    { source: 'Athlete feat', effect: 'Climbing doesn\'t cost extra movement.', note: 'Like Thief feature but as a feat.' },
  ],
  swimSpeed: [
    { source: 'Water Genasi', effect: '30ft swim speed.', note: 'Racial. Always active.' },
    { source: 'Triton', effect: '30ft swim speed + water breathing.', note: 'Full aquatic race.' },
    { source: 'Cloak of the Manta Ray', effect: '60ft swim speed + water breathing.', note: 'Best swim item. No attunement.' },
    { source: 'Ring of Swimming', effect: '40ft swim speed.', note: 'Requires attunement.' },
    { source: 'Water Breathing spell (L3 ritual)', effect: 'Breathe underwater for 24 hours. 10 creatures.', note: 'Ritual = free. 24 hour duration. Entire party.' },
  ],
};

export const UNDERWATER_COMBAT = {
  melee: {
    withSwimSpeed: 'Normal melee attacks.',
    withoutSwimSpeed: 'Disadvantage on all melee attacks EXCEPT dagger, javelin, shortsword, spear, and trident.',
    note: 'Trident and spear are the best underwater melee weapons.',
  },
  ranged: {
    normalRange: 'Disadvantage on ranged attacks.',
    longRange: 'Automatically miss.',
    crossbow: 'Crossbows work underwater (same rules). Thrown weapons with disadvantage.',
    note: 'Ranged combat is severely limited underwater.',
  },
  spellcasting: {
    verbal: 'Can cast spells with V components (you can speak underwater in 5e, just not breathe).',
    fire: 'Fire spells: DM discretion. Most rule they work (magic fire) but some don\'t.',
    note: 'Most spells work underwater. Check with your DM about fire spells.',
  },
};

export function holdBreathDuration(conMod) {
  const minutes = Math.max(0.5, 1 + conMod);
  const rounds = Math.max(1, conMod);
  return { breathMinutes: minutes, survivalRounds: rounds, note: `Hold breath ${minutes} min, then ${rounds} rounds before 0 HP` };
}

export function fallingDamage(heightFeet) {
  const d6s = Math.min(Math.floor(heightFeet / 10), 20);
  return { dice: `${d6s}d6`, avg: d6s * 3.5, max: d6s * 6 };
}
