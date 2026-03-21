/**
 * playerSpecialSenses.js
 * Player Mode: Special senses, lighting conditions, and visibility rules
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// LIGHTING CONDITIONS
// ---------------------------------------------------------------------------

export const LIGHTING_CONDITIONS = [
  {
    id: 'bright_light',
    label: 'Bright Light',
    color: '#fbbf24',
    description: 'Most creatures see normally.',
    effect: 'No penalties to Perception or combat.',
    sources: ['Daylight', 'Torches (20ft radius)', 'Light spell', 'Dancing Lights'],
  },
  {
    id: 'dim_light',
    label: 'Dim Light',
    color: '#94a3b8',
    description: 'Lightly obscured area.',
    effect: 'Disadvantage on Perception checks that rely on sight.',
    sources: ['Twilight', 'Torch edge (20-40ft)', 'Moonlight', 'Darkvision sees darkness as this'],
  },
  {
    id: 'darkness',
    label: 'Darkness',
    color: '#1f2937',
    description: 'Heavily obscured area.',
    effect: 'Effectively blinded. Auto-fail checks requiring sight. Attacks against unseen = advantage; your attacks = disadvantage.',
    sources: ['Unlit dungeon', 'Moonless night', 'Darkness spell'],
  },
];

// ---------------------------------------------------------------------------
// LIGHT SOURCES
// ---------------------------------------------------------------------------

export const LIGHT_SOURCES = [
  { name: 'Candle', bright: 5, dim: 10, duration: '1 hour', hands: 1 },
  { name: 'Lamp', bright: 15, dim: 45, duration: '6 hours (1 pint oil)', hands: 1 },
  { name: 'Lantern, Hooded', bright: 30, dim: 60, duration: '6 hours (1 pint oil)', hands: 1, special: 'Can lower hood to dim 5ft or no light' },
  { name: 'Lantern, Bullseye', bright: 60, dim: 120, duration: '6 hours (1 pint oil)', hands: 1, special: '60ft cone' },
  { name: 'Torch', bright: 20, dim: 40, duration: '1 hour', hands: 1, special: '1 fire damage as improvised weapon' },
  { name: 'Light (cantrip)', bright: 20, dim: 40, duration: '1 hour', hands: 0, special: 'Cast on object' },
  { name: 'Dancing Lights', bright: 0, dim: 10, duration: '1 minute (concentration)', hands: 0, special: 'Up to 4 lights' },
  { name: 'Continual Flame', bright: 20, dim: 40, duration: 'Permanent', hands: 0, special: 'Not actual fire' },
  { name: 'Daylight (3rd)', bright: 60, dim: 120, duration: '1 hour', hands: 0, special: 'Dispels magical darkness of 3rd level or lower' },
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Determine what a character can see at a given distance.
 */
export function getVisibility(distance, lighting, darkvisionRange = 0) {
  if (lighting === 'bright_light') return { canSee: true, obscured: false, darkvision: false };
  if (lighting === 'dim_light') return { canSee: true, obscured: true, darkvision: false, penalty: 'Disadvantage on sight-based Perception' };
  // Darkness
  if (darkvisionRange > 0 && distance <= darkvisionRange) {
    return { canSee: true, obscured: true, darkvision: true, penalty: 'Sees as dim light — disadvantage on sight Perception' };
  }
  return { canSee: false, obscured: true, darkvision: false, penalty: 'Effectively blinded' };
}

/**
 * Get light source info by name.
 */
export function getLightSource(name) {
  return LIGHT_SOURCES.find(l => l.name.toLowerCase() === name.toLowerCase());
}
