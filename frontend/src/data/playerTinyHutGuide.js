/**
 * playerTinyHutGuide.js
 * Player Mode: Leomund's Tiny Hut — the ultimate rest spell
 * Pure JS — no React dependencies.
 */

export const TINY_HUT_BASICS = {
  spell: 'Leomund\'s Tiny Hut',
  level: 3,
  school: 'Evocation (Ritual)',
  castTime: '1 minute (ritual: 11 minutes)',
  range: 'Self (10ft hemisphere)',
  duration: '8 hours',
  classes: ['Bard', 'Wizard'],
  note: 'Creates an invulnerable dome. Nothing passes through except the caster and designated creatures. Perfect for long rests. Ritual castable = free. Game-changing utility spell.',
};

export const TINY_HUT_RULES = {
  whoEnters: 'Up to 9 Medium creatures (including caster) designated at casting. They can pass freely.',
  protection: 'Spells and effects can\'t pass through. Objects can\'t pass through.',
  climate: 'Interior is comfortable and dry regardless of outside conditions.',
  light: 'Dim light or darkness inside (caster chooses).',
  seeThrough: 'Creatures outside see the dome as opaque. Creatures inside can see out.',
  dispel: 'Dispel Magic can end it. Caster leaving ends it.',
  floor: 'The dome extends to the ground but does not have a floor — creatures can dig under.',
  note: 'Key limitation: caster cannot leave without ending the spell. Plan accordingly.',
};

export const TINY_HUT_USES = [
  { use: 'Safe long rest', detail: 'Cast as ritual. 8 hour dome. Party rests inside. Immune to attacks, spells, weather.', rating: 'S' },
  { use: 'Ambush setup', detail: 'Rest inside. Party can see out (enemies can\'t see in). Ready actions. Drop dome → alpha strike.', rating: 'S' },
  { use: 'Weather shelter', detail: 'Rain, snow, sandstorm, extreme heat/cold — all irrelevant inside the dome.', rating: 'A' },
  { use: 'Underwater breathing', detail: 'Cast on surface → dome keeps water out. Rest underwater. Dome is airtight (8 hours of air for 9 creatures is tight though).', rating: 'B' },
  { use: 'Shooting gallery', detail: 'Controversial: arrows/bolts pass out but not in? RAW unclear. Many DMs rule objects can\'t pass either direction.', rating: 'DM-dependent' },
  { use: 'Interrogation room', detail: 'Put prisoner inside. They can\'t leave (not designated). Secure containment.', rating: 'B' },
];

export const TINY_HUT_COUNTERPLAY = [
  { counter: 'Dispel Magic', detail: 'L3 Dispel Magic ends the dome. Smart enemies send a caster.', note: 'Most common counter.' },
  { counter: 'Digging under', detail: 'No floor. Creatures can burrow or dig underneath.', note: 'Bulettes, Umber Hulks, or enemies with shovels.' },
  { counter: 'Waiting it out', detail: '8 hours max. Enemies surround the dome and wait.', note: 'Party exits into an ambush.' },
  { counter: 'Antimagic Field', detail: 'Suppresses the dome in the overlap.', note: 'Rare but devastating.' },
  { counter: 'Move the ground', detail: 'Earthquake, Transmute Rock, Move Earth. Dome stays, ground doesn\'t.', note: 'Creative but rare.' },
];

export const TINY_HUT_TACTICS = [
  { tactic: 'Always ritual cast', detail: 'Never spend a spell slot. 11 minutes to cast as ritual. Always worth it.', rating: 'S' },
  { tactic: 'Cast before danger', detail: 'If you suspect ambush, cast early. 8 hour duration = cast well before rest.', rating: 'A' },
  { tactic: 'Caster stays inside', detail: 'You (the caster) leaving = dome drops. Send allies out to scout. You stay.', rating: 'A' },
  { tactic: 'Combine with alarm', detail: 'Cast Alarm (ritual) on approaches. Know when enemies arrive at the dome.', rating: 'A' },
];

export function tinyHutAirSupply(numCreatures) {
  const totalMinutes = 480;
  const minutesPerCreature = totalMinutes / numCreatures;
  const hoursPerCreature = minutesPerCreature / 60;
  return { totalHours: 8, perCreature: `${hoursPerCreature.toFixed(1)} hours`, note: numCreatures > 5 ? 'Air might be tight for 8 hours with many creatures' : 'Plenty of air' };
}
