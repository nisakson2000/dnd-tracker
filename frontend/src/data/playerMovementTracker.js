/**
 * playerMovementTracker.js
 * Player Mode Improvements 9, 141-143: Movement tracking, difficult terrain, speed modifiers
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// BASE SPEED BY RACE
// ---------------------------------------------------------------------------

export const RACE_SPEEDS = {
  Human: 30,
  Elf: 30,
  'High Elf': 30,
  'Wood Elf': 35,
  'Dark Elf (Drow)': 30,
  Dwarf: 25,
  'Hill Dwarf': 25,
  'Mountain Dwarf': 25,
  Halfling: 25,
  'Lightfoot Halfling': 25,
  'Stout Halfling': 25,
  Gnome: 25,
  'Forest Gnome': 25,
  'Rock Gnome': 25,
  'Half-Elf': 30,
  'Half-Orc': 30,
  Tiefling: 30,
  Dragonborn: 30,
  Aarakocra: 25,
  Genasi: 30,
  Goliath: 30,
  Tabaxi: 30,
  Kenku: 30,
  Tortle: 30,
  Firbolg: 30,
  Bugbear: 30,
  Goblin: 30,
  Hobgoblin: 30,
  Kobold: 30,
  Lizardfolk: 30,
  Orc: 30,
  Yuan_ti: 30,
  Changeling: 30,
  Warforged: 30,
  Shifter: 30,
  Kalashtar: 30,
};

// ---------------------------------------------------------------------------
// SPEED MODIFIERS
// ---------------------------------------------------------------------------

export const SPEED_MODIFIERS = [
  { id: 'difficult_terrain', label: 'Difficult Terrain', multiplier: 0.5, description: 'Each foot of movement costs 1 extra foot.' },
  { id: 'dash', label: 'Dash', multiplier: 2.0, description: 'Double your speed for this turn.' },
  { id: 'prone_crawling', label: 'Crawling (Prone)', multiplier: 0.5, description: 'While prone, each foot of movement costs 1 extra foot.' },
  { id: 'climbing', label: 'Climbing', multiplier: 0.5, description: 'Climbing costs 1 extra foot of movement per foot climbed.' },
  { id: 'swimming', label: 'Swimming', multiplier: 0.5, description: 'Swimming costs 1 extra foot of movement per foot swum.' },
  { id: 'haste', label: 'Haste', multiplier: 2.0, description: 'Speed doubled by Haste spell.' },
  { id: 'slow', label: 'Slow', multiplier: 0.5, description: 'Speed halved by Slow spell.' },
  { id: 'exhaustion_5', label: 'Exhaustion 5', multiplier: 0, description: 'Speed reduced to 0 at exhaustion level 5.' },
  { id: 'grappled', label: 'Grappled', multiplier: 0, description: 'Speed becomes 0 while grappled.' },
  { id: 'restrained', label: 'Restrained', multiplier: 0, description: 'Speed becomes 0 while restrained.' },
];

// ---------------------------------------------------------------------------
// MOVEMENT TEMPLATE (for tracking during a turn)
// ---------------------------------------------------------------------------

export const MOVEMENT_TRACKER_TEMPLATE = {
  baseSpeed: 30,
  remainingMovement: 30,
  modifiers: [],       // active modifier IDs
  hasDashed: false,
  history: [],         // [{feet: 5, terrain: 'normal'}, ...]
};

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Calculate effective speed with all active modifiers.
 */
export function calculateEffectiveSpeed(baseSpeed, activeModifierIds = []) {
  let speed = baseSpeed;
  for (const modId of activeModifierIds) {
    const mod = SPEED_MODIFIERS.find(m => m.id === modId);
    if (!mod) continue;
    if (mod.multiplier === 0) return 0;
    if (mod.multiplier === 2.0) speed *= 2;
    else if (mod.multiplier === 0.5) speed = Math.floor(speed / 2);
  }
  return Math.max(0, speed);
}

/**
 * Calculate remaining movement after moving X feet.
 * Returns { remaining, costPerFoot } accounting for difficult terrain etc.
 */
export function calculateMovementCost(remainingMovement, feetMoved, isDifficultTerrain = false) {
  const cost = isDifficultTerrain ? feetMoved * 2 : feetMoved;
  return {
    remaining: Math.max(0, remainingMovement - cost),
    actualCost: cost,
    feetMoved,
  };
}

/**
 * Reset movement tracker for a new turn.
 */
export function resetMovementForTurn(baseSpeed, conditions = []) {
  const activeModifiers = [];
  const lowerConditions = conditions.map(c => (typeof c === 'string' ? c : c.name || '').toLowerCase());

  if (lowerConditions.includes('grappled')) activeModifiers.push('grappled');
  if (lowerConditions.includes('restrained')) activeModifiers.push('restrained');
  if (lowerConditions.includes('prone')) activeModifiers.push('prone_crawling');

  const effectiveSpeed = calculateEffectiveSpeed(baseSpeed, activeModifiers);

  return {
    baseSpeed,
    remainingMovement: effectiveSpeed,
    modifiers: activeModifiers,
    hasDashed: false,
    history: [],
  };
}
