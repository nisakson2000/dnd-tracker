/**
 * playerFreeRitualGuide.js
 * Player Mode: Ritual casting — rules, best rituals, and optimization
 * Pure JS — no React dependencies.
 */

export const RITUAL_RULES = {
  what: 'Cast ritual spell without slot. Takes 10 extra minutes.',
  wizard: 'Any ritual in spellbook. No preparation needed.',
  clericDruid: 'Prepared spells with ritual tag.',
  bard: 'Known spells with ritual tag.',
  feat: 'Ritual Caster feat or Book of Ancient Secrets invocation.',
};

export const TOP_RITUALS = [
  { spell: 'Detect Magic', level: 1, rating: 'S+', why: 'Know what\'s magical. Use in every room.' },
  { spell: 'Find Familiar', level: 1, rating: 'S+', why: 'Owl scout + Help action. Wizard.' },
  { spell: 'Identify', level: 1, rating: 'A+', why: 'Free magic item ID.' },
  { spell: 'Comprehend Languages', level: 1, rating: 'A+', why: 'Read any language. 1 hour.' },
  { spell: 'Alarm', level: 1, rating: 'A+', why: 'Camp security alert.' },
  { spell: 'Water Breathing', level: 3, rating: 'S', why: '24h underwater. 10 creatures.' },
  { spell: 'Tiny Hut', level: 3, rating: 'S+', why: 'Safe rest. Impenetrable dome.' },
  { spell: 'Phantom Steed', level: 3, rating: 'S', why: '100ft speed mount. Recast hourly.' },
  { spell: 'Speak with Dead', level: 3, rating: 'A', why: '5 questions to a corpse.' },
  { spell: 'Commune', level: 5, rating: 'A+', why: '3 yes/no from deity. Cleric.' },
  { spell: 'Telepathic Bond', level: 5, rating: 'A+', why: 'Party telepathy. 1 hour.' },
];

export const RITUAL_TIPS = [
  'Ritual casting is FREE. No slot. Just time.',
  'Detect Magic: every dungeon room. Costs nothing.',
  'Find Familiar: free owl scout + advantage.',
  'Tiny Hut: safe rest before sleeping.',
  'Water Breathing: free underwater exploration.',
  'Phantom Steed: fast travel between locations.',
  'Wizard rituals don\'t need preparation. Just in the book.',
  'Ritual Caster feat: Wizard list is best.',
  'Speak with Dead: 5 questions to corpses.',
  'Always look for ritual-tagged spells. Free power.',
];
