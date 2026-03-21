/**
 * playerTinyHutUsesGuide.js
 * Player Mode: Leomund's Tiny Hut — uses, counters, and creative applications
 * Pure JS — no React dependencies.
 */

export const TINY_HUT_RULES = {
  level: 3,
  ritual: true,
  duration: '8 hours',
  size: '10ft radius hemisphere',
  capacity: 'Caster + 9 Medium or smaller creatures',
  properties: [
    'Atmosphere is comfortable regardless of weather.',
    'Keeps out creatures and objects not inside when cast.',
    'Spells can\'t pass through (in either direction).',
    'Interior: dim light or darkness (caster\'s choice).',
    'If caster leaves, spell ends.',
  ],
  note: 'Best ritual spell for safe long rests.',
};

export const TINY_HUT_USES = [
  { use: 'Safe Long Rest', method: 'Cast before sleeping. Nothing gets in. 8 hour duration = full long rest.', rating: 'S+' },
  { use: 'Ambush Platform', method: 'Cast in hallway. Party prepares spells inside. Drop hut (caster steps out). Ready actions fire.', rating: 'S' },
  { use: 'Underwater Breathing', method: 'Air inside is comfortable. Cast underwater = air pocket.', rating: 'A+' },
  { use: 'Weather Protection', method: 'Ignore storms, blizzards, desert heat.', rating: 'A+' },
  { use: 'Ranged Cover (DM ruling)', method: 'Some DMs allow shooting out but not in. Check first.', rating: 'A (table-dependent)' },
  { use: 'Negotiation Shield', method: 'Talk to hostiles from inside. They can\'t attack.', rating: 'A' },
];

export const TINY_HUT_COUNTERS = [
  { counter: 'Dispel Magic', method: 'L3 Dispel auto-ends it. Most common counter.', rating: 'S' },
  { counter: 'Dig Under', method: 'It\'s a hemisphere, not a sphere. Floor may be exposed.', rating: 'A (DM ruling)' },
  { counter: 'Wait It Out', method: '8 hours max. Enemies surround and wait.', rating: 'A' },
  { counter: 'Antimagic Field', method: 'Suppresses the hut. Everything enters.', rating: 'S' },
  { counter: 'Earthquake / Cave-in', method: 'Collapse ceiling onto hut. When hut ends, rubble falls.', rating: 'A' },
  { counter: 'Move Earth Around It', method: 'Bury the hut. When it ends, party is underground.', rating: 'A' },
];

export const TINY_HUT_TIPS = [
  'Ritual cast: no spell slot. Free safe rest every day.',
  'Caster must stay inside or hut ends. Don\'t leave.',
  'Nothing enters after casting. Set up BEFORE casting.',
  'Dispel Magic ends it. Enemies with Dispel = vulnerability.',
  'Only creatures present at casting can enter/exit freely.',
  'Some DMs rule hemisphere extends below ground (blocks digging).',
  'Can\'t cast spells through the dome (in OR out).',
  'Great for: wilderness, dangerous dungeons, hostile territory.',
  'Combine with Alarm spell for extra security.',
  'If caster is killed or incapacitated, hut drops.',
];
