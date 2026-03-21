/**
 * playerDimensionDoorGuide.js
 * Player Mode: Dimension Door — 500ft teleport with a passenger
 * Pure JS — no React dependencies.
 */

export const DIMENSION_DOOR_BASICS = {
  spell: 'Dimension Door',
  level: 4,
  school: 'Conjuration',
  castTime: '1 action',
  range: '500 feet',
  duration: 'Instantaneous',
  classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard', 'Paladin (Vengeance)'],
  effect: 'Teleport yourself + 1 willing creature your size or smaller to any spot within 500 feet.',
  note: 'No line of sight needed. Can describe a location ("500 feet straight up") or visualize a known spot.',
};

export const DIMENSION_DOOR_USES = [
  { use: 'Emergency escape', detail: 'Surrounded? Losing? Teleport 500 feet away. Fight over for you.', rating: 'S' },
  { use: 'Bypass obstacles', detail: 'Locked door? Wall? Chasm? Teleport past it. No check needed.', rating: 'S' },
  { use: 'Rescue an ally', detail: 'Grab the downed Wizard and teleport both of you to safety.', rating: 'S' },
  { use: 'Vertical teleport', detail: '"500 feet straight up" — land on rooftops, escape pits, reach flying enemies.', rating: 'A+' },
  { use: 'Behind enemy lines', detail: 'Teleport behind the enemy caster/archer. Assassinate priority targets.', rating: 'A' },
  { use: 'Into a known room', detail: 'If you\'ve been in a room before, teleport directly there. Perfect for heists.', rating: 'A' },
  { use: 'Through the floor', detail: 'In a dungeon? Teleport through the floor to the level below (if within 500ft).', rating: 'A' },
];

export const DIMENSION_DOOR_VS_MISTY_STEP = {
  dimensionDoor: { level: 4, range: '500 feet', action: 'Action', passenger: 'Yes (1)', losRequired: 'No' },
  mistyStep: { level: 2, range: '30 feet', action: 'Bonus action', passenger: 'No', losRequired: 'Yes (must see destination)' },
  verdict: 'Misty Step for combat repositioning (BA, cheap). Dimension Door for escape/exploration (500ft, no LOS, passenger).',
};

export const DIMENSION_DOOR_TIPS = [
  'You don\'t need to see the destination — just describe it or state a distance and direction.',
  'If you arrive in an occupied space, both you and passenger take 4d6 force damage and the spell fails.',
  'The passenger must be willing AND your size or smaller. Can\'t kidnap enemies.',
  'Warlock gets this at L7 with Pact slots — it\'s always cast at L4 for them. Great value.',
  'Vengeance Paladin gets this as an oath spell — rare martial teleport access.',
  'Combine with Glyph of Warding: set up traps/buffs at the destination beforehand.',
  'Bard gets this at L7 — emergency escape for the party\'s least mobile support.',
];

export const DIMENSION_DOOR_COMBOS = [
  { combo: 'DD + Grapple', effect: 'Grapple an enemy (they\'re not willing) — wait, they must be willing. This doesn\'t work.', rating: 'F', note: 'Common misconception. Passenger must be WILLING.' },
  { combo: 'DD straight up + ally', effect: 'Teleport 500ft up with a flying ally → you fall, they fly. Only works if one of you can fly.', rating: 'C', note: 'Niche. Fun with Feather Fall.' },
  { combo: 'DD + Feather Fall', effect: 'Teleport up → cast Feather Fall → float down safely. Good for reaching high places.', rating: 'B+' },
  { combo: 'DD + familiar scout', effect: 'Familiar scouts a room → you DD directly there. Safe teleport into any scouted area.', rating: 'S' },
  { combo: 'DD as Bard escape', effect: 'Bard grabs the unconscious fighter → DD 500ft to safety → party regroups.', rating: 'S' },
];
