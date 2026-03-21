/**
 * playerFreeRitualSpellGuide.js
 * Player Mode: Ritual casting rules and best ritual spells
 * Pure JS — no React dependencies.
 */

export const RITUAL_RULES = {
  time: 'Normal casting time + 10 minutes.',
  cost: 'No spell slot used.',
  requirement: 'Ritual Casting feature + spell has ritual tag.',
  wizard: 'Can ritual cast from spellbook without preparing.',
  others: 'Must have the spell prepared.',
  pactOfTome: 'Book of Ancient Secrets: rituals from any class.',
  feat: 'Ritual Caster feat: 2 rituals from any class + copy more.',
};

export const BEST_RITUALS = [
  { spell: 'Find Familiar', level: 1, rating: 'S+', why: 'Scout, Help, deliver touch spells.' },
  { spell: 'Detect Magic', level: 1, rating: 'S+', why: 'See all magic in 30ft.' },
  { spell: 'Identify', level: 1, rating: 'S', why: 'Reveal magic item properties.' },
  { spell: 'Alarm', level: 1, rating: 'S', why: 'Camp protection. 8 hours.' },
  { spell: 'Tiny Hut', level: 3, rating: 'S+', why: 'Impenetrable dome. Safe rest.' },
  { spell: 'Comprehend Languages', level: 1, rating: 'A+', why: 'Read any language. 1 hour.' },
  { spell: 'Water Breathing', level: 3, rating: 'A+', why: '24h, 10 creatures.' },
  { spell: 'Phantom Steed', level: 3, rating: 'A+', why: '100ft mount. Recast hourly.' },
  { spell: 'Commune', level: 5, rating: 'A+', why: '3 yes/no questions to deity.' },
  { spell: 'Telepathic Bond', level: 5, rating: 'A+', why: 'Party telepathy for 1 hour.' },
];

export const RITUAL_TIPS = [
  'Ritual = free spell. +10 min but no slot.',
  'Wizard: ritual from spellbook without preparing.',
  'Detect Magic: ritual cast between every room.',
  'Find Familiar: always have a familiar. Free.',
  'Tiny Hut: ritual. Best rest protection.',
  'Alarm: multiple castings around camp.',
  'Water Breathing: 24h for entire party.',
  'Phantom Steed: 100ft mount. Recast hourly.',
  'Ritual Caster feat: any class can ritual cast.',
  'Book of Ancient Secrets: Warlock ritual from any list.',
];
