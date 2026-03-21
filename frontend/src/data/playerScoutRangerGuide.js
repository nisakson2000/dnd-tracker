/**
 * playerScoutRangerGuide.js
 * Player Mode: Scout, exploration, and Ranger optimization for field operations
 * Pure JS — no React dependencies.
 */

export const RANGER_EXPLORATION = {
  naturalExplorer: 'Favored terrain: can\'t become lost, double proficiency foraging, alert to danger. Travel: difficult terrain doesn\'t slow, group can\'t be tracked (passively).',
  tashaOptional: 'Deft Explorer replaces favored terrain: Canny (expertise in 1 skill), Roving (+5ft speed + climb/swim speed), Tireless (temp HP on short rest).',
  note: 'Tasha\'s replacements are strictly better. Use them if your DM allows.',
};

export const SCOUTING_TOOLKIT = [
  { tool: 'Pass Without Trace', level: 2, effect: '+10 Stealth to entire party for 1 hour. Concentration.', rating: 'S', note: 'Makes the Paladin in plate stealthy. Party-wide ambush setup.' },
  { tool: 'Goodberry', level: 1, effect: '10 berries, each heals 1 HP and counts as a day of food.', rating: 'A', note: 'Never worry about rations. 10 emergency heals.' },
  { tool: 'Longstrider', level: 1, effect: '+10ft speed for 1 hour. No concentration.', rating: 'B', note: 'Cast on whole party pre-travel. Free speed.' },
  { tool: 'Speak with Animals', level: 1, effect: 'Talk to beasts for 10 min. Ritual.', rating: 'B', note: 'Animals are everywhere. Ask about dangers, enemies, directions.' },
  { tool: 'Beast Sense', level: 2, effect: 'See through beast\'s senses for 1 hour. Ritual.', rating: 'B', note: 'Send a hawk ahead. See what it sees. Perfect aerial recon.' },
  { tool: 'Detect Magic', level: 1, effect: 'Sense magic within 30ft for 10 min. Ritual.', rating: 'A', note: 'Find traps, hidden items, illusions, wards.' },
  { tool: 'Locate Creature/Object', level: 2, effect: 'Sense direction to target within 1000ft.', rating: 'B', note: 'Track specific targets. Detect ambushes.' },
  { tool: 'Cordon of Arrows', level: 2, effect: 'Set 4 arrows as alarm/trap. 1d6 each when triggered. Lasts 8 hours.', rating: 'B', note: 'Camp defense. Set and forget.' },
];

export const EXPLORATION_ROLES = [
  { role: 'Scout', responsibility: 'Move ahead of party. Stealth + Perception. Detect ambushes/traps.', skills: 'Stealth, Perception, Survival, Nature' },
  { role: 'Navigator', responsibility: 'Choose path. Avoid hazards. Manage travel pace.', skills: 'Survival, Nature, Cartographer\'s Tools' },
  { role: 'Forager', responsibility: 'Find food and water. DC 10 Survival, DC 15 in barren terrain.', skills: 'Survival, Nature' },
  { role: 'Lookout', responsibility: 'Watch for threats during travel and rest. Passive Perception matters.', skills: 'Perception, Investigation' },
  { role: 'Mapper', responsibility: 'Track the route. Mark landmarks. Prevent getting lost.', skills: 'Cartographer\'s Tools, Investigation' },
];

export const TRAVEL_PACE = [
  { pace: 'Fast', speed: '400ft/min, 4 miles/hour, 30 miles/day', effect: '-5 passive Perception.' },
  { pace: 'Normal', speed: '300ft/min, 3 miles/hour, 24 miles/day', effect: 'No modifier.' },
  { pace: 'Slow', speed: '200ft/min, 2 miles/hour, 18 miles/day', effect: 'Can use Stealth.' },
];

export const CAMPING_SAFETY = [
  'Set watch order. Everyone needs a long rest (8 hours, 6 sleeping, 2 light activity).',
  'Alarm (ritual) on all camp entrances. Free and reliable.',
  'Cordon of Arrows on approaches. 1d6 damage trap.',
  'Leomund\'s Tiny Hut (ritual, L3 Bard/Wizard): impenetrable dome. Perfect rest.',
  'Guard duty: minimum 2 watchers per shift. One Perception, one Investigation.',
  'Campfire: light and warmth but reveals position. In dangerous areas, cold camp.',
];

export function forageDC(terrain) {
  const dcs = { forest: 10, plains: 10, coast: 10, mountain: 15, desert: 20, arctic: 15, swamp: 10 };
  return dcs[terrain] || 10;
}

export function travelDistance(pace, hours) {
  const mph = { fast: 4, normal: 3, slow: 2 };
  return (mph[pace] || 3) * hours;
}
