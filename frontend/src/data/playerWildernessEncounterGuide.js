/**
 * playerWildernessEncounterGuide.js
 * Player Mode: Wilderness travel, encounters, and survival
 * Pure JS — no React dependencies.
 */

export const TRAVEL_PACE = [
  { pace: 'Fast', speed: '400ft/min, 4 mph, 30 miles/day', effect: '-5 passive Perception.', note: 'Speed at the cost of awareness. Easier to be ambushed.' },
  { pace: 'Normal', speed: '300ft/min, 3 mph, 24 miles/day', effect: 'No modifier.', note: 'Standard travel. Balanced.' },
  { pace: 'Slow', speed: '200ft/min, 2 mph, 18 miles/day', effect: 'Can use Stealth.', note: 'Only pace that allows stealth. Use when sneaking through dangerous areas.' },
];

export const TRAVEL_ROLES = [
  { role: 'Navigator', skill: 'Survival', dc: 'DC 10-15', effect: 'Avoid getting lost. Higher DC in featureless terrain (desert, ocean).', note: 'Ranger with Natural Explorer auto-succeeds in favored terrain.' },
  { role: 'Scout', skill: 'Perception/Stealth', dc: 'Varies', effect: 'Spot danger ahead. Move at slow pace to stealth.', note: 'Send 60ft+ ahead. Report back before party commits.' },
  { role: 'Forager', skill: 'Survival', dc: 'DC 10-15', effect: 'Find food and water. DC varies by terrain.', note: 'Goodberry and Create Food and Water eliminate this need.' },
  { role: 'Lookout', skill: 'Perception', dc: 'Passive', effect: 'Watch for threats and ambushes.', note: 'Multiple lookouts: best passive Perception applies.' },
];

export const WILDERNESS_SPELLS = [
  { spell: 'Goodberry (L1)', rating: 'S+', note: '10 berries = 10 HP and day of sustenance. Eliminates food concerns.' },
  { spell: 'Create Food and Water (L3)', rating: 'A+', note: 'Feed 15 people + 30 gallons water. Camp staple.' },
  { spell: 'Pass Without Trace (L2)', rating: 'S+', note: '+10 Stealth for party. Avoid encounters entirely.' },
  { spell: 'Tiny Hut (L3 ritual)', rating: 'S+', note: 'Safe camp. Impenetrable dome. Blocks weather, creatures, spells.' },
  { spell: 'Phantom Steed (L3 ritual)', rating: 'A+', note: '100ft mount. 13mph = double travel speed. Recast every hour.' },
  { spell: 'Wind Walk (L6)', rating: 'S', note: '300ft fly speed for 8 hours. Travel 43 miles/hour. Cross continents.' },
  { spell: 'Transport via Plants (L6)', rating: 'S', note: 'Plant-to-plant teleportation. Instant long-distance travel.' },
  { spell: 'Commune with Nature (L5 ritual)', rating: 'A', note: 'Learn terrain features, settlements, creatures within 3 miles.' },
  { spell: 'Find the Path (L6)', rating: 'B+', note: 'Know shortest route to fixed location. Concentration. 1 day.' },
  { spell: 'Water Breathing (L3 ritual)', rating: 'A+', note: '10 creatures breathe underwater 24 hours. Essential for aquatic travel.' },
];

export const WILDERNESS_HAZARDS = [
  { hazard: 'Getting lost', risk: 'Medium', counter: 'Navigator Survival check. Ranger Natural Explorer. Compass.' },
  { hazard: 'Random encounters', risk: 'High', counter: 'Pass Without Trace. Travel at slow pace. Avoid dangerous regions.' },
  { hazard: 'Exhaustion (forced march)', risk: 'Medium', counter: 'Rest properly. 8+ hours travel = CON saves or exhaustion.' },
  { hazard: 'Extreme weather', risk: 'Varies', counter: 'Appropriate gear. Protection from Energy. Tiny Hut.' },
  { hazard: 'Difficult terrain', risk: 'Low (time cost)', counter: 'Fly. Ranger in favored terrain. Phantom Steed.' },
  { hazard: 'Food/Water shortage', risk: 'Medium', counter: 'Goodberry. Create Food and Water. Foraging.' },
  { hazard: 'River/mountain crossings', risk: 'Medium', counter: 'Fly. Shape Stone. Water Walk. Rope + Athletics.' },
];

export const FORCED_MARCH_RULES = {
  normalDay: '8 hours of travel. Characters can travel beyond 8 hours at a cost.',
  extendedTravel: 'Each hour beyond 8: DC 10 + 1/extra hour CON save or 1 level exhaustion.',
  example: '10 hours travel: hour 9 = DC 11 CON save, hour 10 = DC 12 CON save.',
  tip: 'Avoid forced marches unless absolutely necessary. Exhaustion is devastating.',
};

export const WILDERNESS_TIPS = [
  'Goodberry solves food. Tiny Hut solves shelter. These two spells trivialize wilderness survival.',
  'Pass Without Trace: avoid most random encounters. +10 Stealth for everyone.',
  'Phantom Steed (ritual): doubles travel speed for free. Cast every 50 minutes.',
  'Rangers with Natural Explorer: can\'t get lost, double foraging, not slowed by difficult terrain.',
  'Forced marches cause exhaustion. Avoid unless emergency.',
  'Set watches during camp. Alarm spell on the perimeter.',
  'Wind Walk at L6: 300ft fly = cross entire continents in a day.',
];
