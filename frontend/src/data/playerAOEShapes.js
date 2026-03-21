/**
 * playerAOEShapes.js
 * Player Mode: Area of Effect shapes, sizes, and targeting rules
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// AOE SHAPES
// ---------------------------------------------------------------------------

export const AOE_SHAPES = [
  {
    id: 'cone',
    label: 'Cone',
    description: 'A cone extends in a direction you choose from its point of origin. Width at any point equals distance from origin.',
    originRule: 'Point of origin is not included in the area.',
    example: 'Burning Hands (15ft cone)',
    targetEstimate: (sizeFt) => {
      // Rough estimate of 5ft squares in a cone
      const squares = Math.round((sizeFt / 5) * ((sizeFt / 5) + 1) / 2);
      return squares;
    },
  },
  {
    id: 'cube',
    label: 'Cube',
    description: 'Select a point of origin on one face of the cube. Size = length of each side.',
    originRule: 'Point of origin can be on any face.',
    example: 'Stinking Cloud (20ft cube)',
    targetEstimate: (sizeFt) => Math.pow(sizeFt / 5, 2),
  },
  {
    id: 'cylinder',
    label: 'Cylinder',
    description: 'Point of origin is center of a circle. Radius and height determine the area.',
    originRule: 'Point of origin is at center of the top or bottom.',
    example: 'Moonbeam (5ft radius, 40ft high cylinder)',
    targetEstimate: (radiusFt) => Math.round(Math.PI * Math.pow(radiusFt / 5, 2)),
  },
  {
    id: 'line',
    label: 'Line',
    description: 'A line extends from point of origin in a straight path up to its length, covering area of set width.',
    originRule: 'Point of origin is not included.',
    example: 'Lightning Bolt (100ft long, 5ft wide line)',
    targetEstimate: (lengthFt, widthFt = 5) => Math.round(lengthFt / 5) * Math.max(1, widthFt / 5),
  },
  {
    id: 'sphere',
    label: 'Sphere',
    description: 'Select a point in space. The sphere extends outward from that point.',
    originRule: 'Point of origin is included if on a grid intersection.',
    example: 'Fireball (20ft radius sphere)',
    targetEstimate: (radiusFt) => Math.round(Math.PI * Math.pow(radiusFt / 5, 2)),
  },
];

// ---------------------------------------------------------------------------
// COMMON SPELLS BY AOE
// ---------------------------------------------------------------------------

export const COMMON_AOE_SPELLS = [
  { spell: 'Burning Hands', shape: 'cone', size: 15, level: 1 },
  { spell: 'Thunderwave', shape: 'cube', size: 15, level: 1 },
  { spell: 'Shatter', shape: 'sphere', size: 10, level: 2 },
  { spell: 'Fireball', shape: 'sphere', size: 20, level: 3 },
  { spell: 'Lightning Bolt', shape: 'line', size: 100, level: 3 },
  { spell: 'Stinking Cloud', shape: 'sphere', size: 20, level: 3 },
  { spell: 'Ice Storm', shape: 'cylinder', size: 20, level: 4 },
  { spell: 'Cone of Cold', shape: 'cone', size: 60, level: 5 },
  { spell: 'Cloudkill', shape: 'sphere', size: 20, level: 5 },
  { spell: 'Spirit Guardians', shape: 'sphere', size: 15, level: 3 },
  { spell: 'Moonbeam', shape: 'cylinder', size: 5, level: 2 },
  { spell: 'Hunger of Hadar', shape: 'sphere', size: 20, level: 3 },
  { spell: 'Wall of Fire', shape: 'line', size: 60, level: 4 },
  { spell: 'Meteor Swarm', shape: 'sphere', size: 40, level: 9 },
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Get AOE shape info.
 */
export function getAOEShape(shapeId) {
  return AOE_SHAPES.find(s => s.id === shapeId) || null;
}

/**
 * Estimate number of 5ft squares in an AOE.
 */
export function estimateTargets(shapeId, sizeFt) {
  const shape = AOE_SHAPES.find(s => s.id === shapeId);
  if (!shape) return 0;
  return shape.targetEstimate(sizeFt);
}

/**
 * Get spells that use a specific AOE shape.
 */
export function getSpellsByShape(shapeId) {
  return COMMON_AOE_SPELLS.filter(s => s.shape === shapeId);
}
