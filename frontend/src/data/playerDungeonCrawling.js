/**
 * playerDungeonCrawling.js
 * Player Mode: Dungeon exploration — procedures, safety, and resource management
 * Pure JS — no React dependencies.
 */

export const MARCHING_ORDER = {
  positions: [
    { position: 'Front', who: 'Tank (Fighter, Paladin, Barbarian)', role: 'Take hits, trigger traps, engage first.' },
    { position: 'Second', who: 'Melee DPS (Monk, Rogue, Ranger)', role: 'Flank support. Ready to assist front or protect rear.' },
    { position: 'Middle', who: 'Squishy caster (Wizard, Sorcerer)', role: 'Protected position. Cast over allies\' heads.' },
    { position: 'Rear', who: 'Healer/Support (Cleric, Bard, Druid)', role: 'Heal anyone. Watch for rear attacks. Last line of defense.' },
  ],
  singleFile: 'In 5ft corridors: single file. Only front and rear can be targeted. Middle is safest.',
  twoAbreast: 'In 10ft corridors: two side by side. Front pair shares danger.',
};

export const EXPLORATION_PROCEDURES = [
  { step: 'Check for traps', method: 'Passive Perception (always on) or Investigation check on suspicious areas.', dc: '10-20 depending on trap' },
  { step: 'Listen at doors', method: 'Perception check to hear through doors. DC 10 for loud noise, DC 20 for whispers.', dc: '10-20' },
  { step: 'Open doors carefully', method: 'Check for traps (Investigation), then open. Rogue\'s Thieves\' Tools for locks.', dc: '15-25 for locks' },
  { step: 'Search rooms', method: 'Investigation for hidden items/secrets. Perception for obvious threats.', dc: '10-20' },
  { step: 'Map the dungeon', method: 'Someone draws a map. Prevents getting lost. Cartographer\'s Tools helpful.', dc: 'N/A' },
  { step: 'Mark cleared areas', method: 'Chalk marks on walls, hammered pitons in doorways, Minor Illusion markers.', dc: 'N/A' },
];

export const DUNGEON_SPELLS = [
  { spell: 'Detect Magic (ritual)', purpose: 'Find magic traps, items, wards. 30ft. 10 minutes.', level: 1 },
  { spell: 'Find Traps', purpose: 'Reveals presence of traps within 120ft. Not location, just "there\'s a trap."', level: 2 },
  { spell: 'Knock', purpose: 'Open any lock, bar, or shackle. Loud 300ft sound.', level: 2 },
  { spell: 'Darkvision', purpose: 'Grant darkvision 60ft for 8 hours. For party members without it.', level: 2 },
  { spell: 'Tiny Hut (ritual)', purpose: 'Safe rest in a dungeon. 8 hour dome. Nothing gets in.', level: 3 },
  { spell: 'Arcane Eye', purpose: 'Invisible floating eye. 30ft darkvision. Scout ahead safely.', level: 4 },
  { spell: 'Stone Shape', purpose: 'Reshape 5ft cube of stone. Open walls, seal passages, create cover.', level: 4 },
  { spell: 'Passwall', purpose: 'Create passage through 20ft of stone. Bypass locked doors/walls.', level: 5 },
];

export const RESOURCE_MANAGEMENT = {
  torches: 'Burn 1 hour each. Carry at least 10. Or use Light cantrip / Darkvision.',
  rations: '1 day of food each. Carry 5+ per person. Goodberry creates 10 per spell.',
  water: 'Create Water: 10 gallons per 1st level slot. Or Decanter of Endless Water.',
  hitDice: 'Recover half on long rest. Don\'t blow them all on one short rest.',
  spellSlots: 'Save highest slots for emergencies. Use cantrips and low slots for exploration.',
  goldRule: 'Rest BEFORE entering the dungeon. Full resources at the start.',
};

export const DUNGEON_DANGERS = [
  { danger: 'Pit traps', counter: 'Passive Perception 15+ catches most. 10ft pole to test ground.' },
  { danger: 'Poison dart traps', counter: 'Investigation check on walls/floor. Thieves\' Tools to disarm.' },
  { danger: 'Mimics', counter: 'Poke chests/doors before touching. Mimics have to stick to you (Adhesive).' },
  { danger: 'Gelatinous Cube', counter: 'They\'re nearly invisible. Perception DC 15. Fill entire corridors.' },
  { danger: 'Wandering monsters', counter: 'Don\'t take long rests in dungeons. Tiny Hut helps. Keep noise down.' },
  { danger: 'Collapse/cave-in', counter: 'Don\'t use explosive spells underground. DEX save DC 15, 4d10 damage.' },
];

export function torchesNeeded(hours) {
  return Math.ceil(hours); // 1 torch per hour
}

export function rationsNeeded(days, partySize) {
  return days * partySize;
}
