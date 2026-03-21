/**
 * playerExplorationTools.js
 * Player Mode: Exploration activities, marching order, travel pace
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// TRAVEL PACE
// ---------------------------------------------------------------------------

export const TRAVEL_PACES = [
  { pace: 'Fast', milesPerHour: 4, milesPerDay: 30, effect: '-5 passive Perception', description: 'Moving quickly. Hard to notice threats.' },
  { pace: 'Normal', milesPerHour: 3, milesPerDay: 24, effect: 'No penalty', description: 'Standard travel speed.' },
  { pace: 'Slow', milesPerHour: 2, milesPerDay: 18, effect: 'Can use Stealth', description: 'Careful movement. Can travel stealthily.' },
];

// ---------------------------------------------------------------------------
// EXPLORATION ACTIVITIES
// ---------------------------------------------------------------------------

export const EXPLORATION_ACTIVITIES = [
  { activity: 'Navigate', skill: 'Survival', description: 'Prevent the group from getting lost. Make Survival checks when traveling through wilderness.' },
  { activity: 'Track', skill: 'Survival', description: 'Follow tracks or trail. DC depends on terrain and conditions.' },
  { activity: 'Forage', skill: 'Survival', description: 'Gather food and water during travel. DC 10-15 depending on terrain.' },
  { activity: 'Map', skill: 'Cartographer\'s Tools', description: 'Create a map of the area being explored.' },
  { activity: 'Scout', skill: 'Stealth/Perception', description: 'Move ahead to spot danger. Stealth to remain hidden, Perception to spot threats.' },
  { activity: 'Keep Watch', skill: 'Perception', description: 'Watch for threats and dangers. Use passive Perception or active checks.' },
  { activity: 'Search', skill: 'Investigation/Perception', description: 'Actively search for hidden objects, traps, or clues.' },
  { activity: 'Draw', skill: null, description: 'Draw or sketch what you see for reference.' },
  { activity: 'Identify Plants', skill: 'Nature', description: 'Identify useful or dangerous plants in the environment.' },
  { activity: 'Hunt', skill: 'Survival', description: 'Hunt for game during travel or rest.' },
];

// ---------------------------------------------------------------------------
// MARCHING ORDER POSITIONS
// ---------------------------------------------------------------------------

export const MARCHING_POSITIONS = [
  { position: 'Front', description: 'First to encounter traps and enemies. Needs high Perception and AC.', recommended: ['Fighter', 'Paladin', 'Barbarian'] },
  { position: 'Middle', description: 'Protected by front and rear. Good for squishy characters.', recommended: ['Wizard', 'Sorcerer', 'Bard'] },
  { position: 'Rear', description: 'Watches for followers and ambush from behind. Needs good Perception.', recommended: ['Rogue', 'Ranger', 'Cleric'] },
  { position: 'Scout', description: 'Moves ahead of the group (60-120 ft). Stealth-focused.', recommended: ['Rogue', 'Ranger'] },
];

// ---------------------------------------------------------------------------
// LIGHT SOURCES
// ---------------------------------------------------------------------------

export const LIGHT_SOURCES = [
  { name: 'Torch', bright: 20, dim: 40, duration: '1 hour', cost: '1 cp' },
  { name: 'Lantern (Hooded)', bright: 30, dim: 60, duration: '6 hours', cost: '5 gp' },
  { name: 'Lantern (Bullseye)', bright: 60, dim: 120, duration: '6 hours', cost: '10 gp', note: 'Cone shape' },
  { name: 'Candle', bright: 5, dim: 10, duration: '1 hour', cost: '1 cp' },
  { name: 'Light (cantrip)', bright: 20, dim: 40, duration: '1 hour', cost: 'Free' },
  { name: 'Dancing Lights (cantrip)', bright: 10, dim: 20, duration: '1 minute (concentration)', cost: 'Free' },
  { name: 'Continual Flame (2nd)', bright: 20, dim: 40, duration: 'Until dispelled', cost: '50 gp ruby dust' },
  { name: 'Daylight (3rd)', bright: 60, dim: 120, duration: '1 hour', cost: '3rd-level slot' },
];

// ---------------------------------------------------------------------------
// VISION RULES
// ---------------------------------------------------------------------------

export const VISION_RULES = {
  brightLight: 'Normal visibility. Most creatures see normally.',
  dimLight: 'Creates a lightly obscured area. Disadvantage on Perception checks relying on sight.',
  darkness: 'Creates a heavily obscured area. Effectively blinded (auto-fail sight checks, disadvantage on attacks, advantage for attackers).',
  darkvision: 'Treat darkness as dim light within range (grayscale only). Treat dim light as bright light within range.',
};
