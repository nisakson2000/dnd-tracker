/**
 * playerMapTools.js
 * Player Mode Improvements 141-157 (UI/UX subset): Map/grid helpers and measurement tools
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// GRID MEASUREMENT
// ---------------------------------------------------------------------------

export const GRID_SCALE = {
  feetPerSquare: 5,
  metersPerSquare: 1.5,
};

/**
 * Convert grid squares to feet.
 */
export function squaresToFeet(squares) {
  return squares * GRID_SCALE.feetPerSquare;
}

/**
 * Convert feet to grid squares.
 */
export function feetToSquares(feet) {
  return Math.floor(feet / GRID_SCALE.feetPerSquare);
}

// ---------------------------------------------------------------------------
// AREA OF EFFECT TEMPLATES
// ---------------------------------------------------------------------------

export const AOE_SHAPES = [
  {
    id: 'cone',
    label: 'Cone',
    description: 'A cone extends in a direction you choose from its point of origin.',
    widthAtEnd: 'equal to length',
    examples: [
      { spell: 'Burning Hands', size: '15ft cone' },
      { spell: 'Cone of Cold', size: '60ft cone' },
      { spell: 'Dragonborn Breath', size: '15ft cone (or 30ft line)' },
    ],
  },
  {
    id: 'sphere',
    label: 'Sphere',
    description: 'Extends outward from point of origin in all directions.',
    examples: [
      { spell: 'Fireball', size: '20ft radius sphere' },
      { spell: 'Spirit Guardians', size: '15ft radius sphere (centered on you)' },
      { spell: 'Darkness', size: '15ft radius sphere' },
    ],
  },
  {
    id: 'cube',
    label: 'Cube',
    description: 'A cube\'s point of origin is anywhere on a face of the cube.',
    examples: [
      { spell: 'Thunderwave', size: '15ft cube' },
      { spell: 'Fog Cloud', size: '20ft radius sphere' },
      { spell: 'Stinking Cloud', size: '20ft radius sphere' },
    ],
  },
  {
    id: 'line',
    label: 'Line',
    description: 'Extends in a straight line from the origin up to its length.',
    width: '5ft (unless stated otherwise)',
    examples: [
      { spell: 'Lightning Bolt', size: '100ft x 5ft line' },
      { spell: 'Wall of Fire', size: '60ft long, 20ft high, 1ft thick' },
    ],
  },
  {
    id: 'cylinder',
    label: 'Cylinder',
    description: 'Extends from a point on the ground upward.',
    examples: [
      { spell: 'Moonbeam', size: '5ft radius, 40ft high cylinder' },
      { spell: 'Flame Strike', size: '10ft radius, 40ft high cylinder' },
    ],
  },
];

// ---------------------------------------------------------------------------
// COVER TYPES
// ---------------------------------------------------------------------------

export const COVER_TYPES = [
  { id: 'none', label: 'No Cover', acBonus: 0, dexSaveBonus: 0, description: 'No cover between you and the target.' },
  { id: 'half', label: 'Half Cover', acBonus: 2, dexSaveBonus: 2, description: 'An obstacle blocks at least half of the target. +2 AC and DEX saves.' },
  { id: 'three_quarters', label: '3/4 Cover', acBonus: 5, dexSaveBonus: 5, description: 'About three-quarters of the target is covered. +5 AC and DEX saves.' },
  { id: 'total', label: 'Total Cover', acBonus: null, dexSaveBonus: null, description: 'Completely concealed. Cannot be targeted directly by attacks or spells.' },
];

// ---------------------------------------------------------------------------
// WEAPON RANGES (common)
// ---------------------------------------------------------------------------

export const COMMON_RANGES = {
  melee: { normal: 5, long: null, label: 'Melee (5ft)' },
  reach: { normal: 10, long: null, label: 'Reach (10ft)' },
  shortbow: { normal: 80, long: 320, label: 'Shortbow' },
  longbow: { normal: 150, long: 600, label: 'Longbow' },
  hand_crossbow: { normal: 30, long: 120, label: 'Hand Crossbow' },
  light_crossbow: { normal: 80, long: 320, label: 'Light Crossbow' },
  heavy_crossbow: { normal: 100, long: 400, label: 'Heavy Crossbow' },
  javelin: { normal: 30, long: 120, label: 'Javelin' },
  handaxe: { normal: 20, long: 60, label: 'Handaxe' },
  dagger: { normal: 20, long: 60, label: 'Dagger' },
  dart: { normal: 20, long: 60, label: 'Dart' },
  sling: { normal: 30, long: 120, label: 'Sling' },
};

/**
 * Check if a target is within weapon range.
 */
export function isInRange(distanceFeet, range) {
  if (!range) return distanceFeet <= 5;
  if (distanceFeet <= range.normal) return { inRange: true, disadvantage: false };
  if (range.long && distanceFeet <= range.long) return { inRange: true, disadvantage: true };
  return { inRange: false, disadvantage: false };
}
