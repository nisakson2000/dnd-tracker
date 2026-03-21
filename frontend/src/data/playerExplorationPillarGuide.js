/**
 * playerExplorationPillarGuide.js
 * Player Mode: Exploration — travel, navigation, and wilderness survival
 * Pure JS — no React dependencies.
 */

export const EXPLORATION_BASICS = {
  concept: 'Exploration is one of 5e\'s three pillars (combat, social, exploration).',
  activities: ['Travel/navigation', 'Foraging', 'Mapping', 'Scouting', 'Tracking', 'Searching'],
  note: 'Often overlooked. Good exploration play prevents ambushes, finds resources, and sets up encounters.',
};

export const TRAVEL_PACE = [
  { pace: 'Fast', speed: '400 ft/min, 4 mph, 30 mi/day', effect: '-5 passive Perception.', note: 'Quick but you miss things and get ambushed.' },
  { pace: 'Normal', speed: '300 ft/min, 3 mph, 24 mi/day', effect: 'None.', note: 'Standard. Balanced speed and awareness.' },
  { pace: 'Slow', speed: '200 ft/min, 2 mph, 18 mi/day', effect: 'Can stealth.', note: 'Allows group Stealth. Best for dangerous territory.' },
];

export const EXPLORATION_ROLES = [
  { role: 'Navigator', skill: 'Survival', task: 'Prevent getting lost. DC based on terrain.', who: 'Ranger, Druid, anyone with Survival.' },
  { role: 'Scout', skill: 'Stealth + Perception', task: 'Spot threats before they spot you. Move ahead of party.', who: 'Rogue, Ranger, anyone stealthy.' },
  { role: 'Forager', skill: 'Survival', task: 'Find food and water. DC based on terrain.', who: 'Ranger, Druid, Outlander background.' },
  { role: 'Mapper', skill: 'Cartographer\'s tools', task: 'Track route. Prevent getting lost on return.', who: 'Anyone with tools proficiency.' },
  { role: 'Lookout', skill: 'Perception', task: 'Watch for threats during travel and rest.', who: 'High WIS characters, familiars.' },
];

export const EXPLORATION_SPELLS = [
  { spell: 'Goodberry (L1)', effect: '10 berries = 10 days of food for one. Eliminates foraging.', rating: 'S' },
  { spell: 'Create Water (L1)', effect: '10 gallons. Eliminates water concerns.', rating: 'A+' },
  { spell: 'Pass Without Trace (L2)', effect: '+10 Stealth for party. Stealthy travel even in armor.', rating: 'S' },
  { spell: 'Find the Path (L6)', effect: 'Know shortest route to destination. No navigation checks.', rating: 'A' },
  { spell: 'Locate Object (L2)', effect: 'Find specific object within 1000ft. Great for tracking.', rating: 'A' },
  { spell: 'Tiny Hut (L3)', effect: 'Safe rest. Climate controlled. Invisible from outside.', rating: 'S' },
  { spell: 'Wind Walk (L6)', effect: '300ft fly speed for 8 hours. Party-wide. Skip overland travel.', rating: 'S' },
  { spell: 'Transport via Plants (L6)', effect: 'Teleport between plants. Druid fast travel.', rating: 'S' },
  { spell: 'Find Familiar (L1)', effect: 'Aerial scout. 100ft telepathy. Owl sees in dark.', rating: 'S' },
  { spell: 'Speak with Animals (L1)', effect: 'Ask local fauna about dangers, directions, water sources.', rating: 'A' },
];

export const RANGER_EXPLORATION = {
  naturalExplorer: {
    effect: 'Favored terrain: can\'t get lost, find 2× food, learn exact creature numbers/sizes from tracks.',
    note: 'Original Ranger. Terrain-specific but very powerful when applicable.',
  },
  deftExplorer: {
    effect: 'Tasha\'s replacement: Expertise, languages, extra benefits.',
    note: 'Better in general. Expertise is always useful.',
  },
  note: 'Rangers are THE exploration class. Natural Explorer + Primeval Awareness = GPS in the wilderness.',
};

export const REST_DURING_TRAVEL = {
  shortRest: '1 hour minimum. Can do during travel pause.',
  longRest: '8 hours. At least 6 hours sleeping. 2 hours light activity (watch shifts).',
  tinyHut: 'Leomund\'s Tiny Hut: ritual, no slot. Safe long rest anywhere. 8-hour dome.',
  watches: 'Split party into watch shifts. 2-3 people per shift. Perception checks for night encounters.',
  ambush: 'If no one\'s on watch, auto-surprised by night encounters. Always set watches.',
};

export const EXPLORATION_TIPS = [
  'Always have someone scouting ahead. Familiars are perfect.',
  'Tiny Hut solves rest safety. Ritual cast = no slot. Every Wizard should have this.',
  'Goodberry eliminates food concerns entirely. One L1 slot = 10 days of food.',
  'Passive Perception is always active. High WIS + Observant = automatic trap detection.',
  'Outlander background: auto-forage for 5 people. No check needed.',
  'Track your rations if the DM uses survival rules. Running out = exhaustion.',
  'Mold Earth, Shape Water, Prestidigitation: utility cantrips that solve exploration problems.',
];
