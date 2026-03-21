/**
 * playerCoverRules.js
 * Player Mode: Cover types, AC bonuses, and tactical positioning reference
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// COVER TYPES
// ---------------------------------------------------------------------------

export const COVER_TYPES = [
  {
    id: 'none',
    label: 'No Cover',
    acBonus: 0,
    dexSaveBonus: 0,
    description: 'No obstruction between you and the attacker.',
    color: 'rgba(255,255,255,0.2)',
  },
  {
    id: 'half',
    label: 'Half Cover',
    acBonus: 2,
    dexSaveBonus: 2,
    description: 'An obstacle blocks at least half of your body. Low wall, furniture, creature.',
    color: '#fbbf24',
    examples: ['Low wall', 'Large furniture', 'Narrow tree trunk', 'Another creature'],
  },
  {
    id: 'three_quarters',
    label: 'Three-Quarters Cover',
    acBonus: 5,
    dexSaveBonus: 5,
    description: 'An obstacle blocks about three-quarters of your body. Portcullis, arrow slit.',
    color: '#f97316',
    examples: ['Portcullis', 'Arrow slit', 'Thick tree trunk', 'Overturned table (crouching)'],
  },
  {
    id: 'full',
    label: 'Full Cover',
    acBonus: Infinity,
    dexSaveBonus: Infinity,
    description: 'Completely concealed by an obstacle. Cannot be targeted directly by attacks or spells.',
    color: '#ef4444',
    examples: ['Solid wall', 'Closed door', 'Pillar (fully behind it)'],
  },
];

// ---------------------------------------------------------------------------
// OBSCUREMENT
// ---------------------------------------------------------------------------

export const OBSCUREMENT_LEVELS = [
  {
    id: 'lightly_obscured',
    label: 'Lightly Obscured',
    effect: 'Disadvantage on Perception checks relying on sight.',
    sources: ['Dim light', 'Patchy fog', 'Moderate foliage'],
    color: '#94a3b8',
  },
  {
    id: 'heavily_obscured',
    label: 'Heavily Obscured',
    effect: 'Effectively blinded when trying to see something in the area.',
    sources: ['Darkness', 'Opaque fog', 'Dense foliage'],
    color: '#475569',
  },
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Get cover info by ID.
 */
export function getCoverInfo(coverId) {
  return COVER_TYPES.find(c => c.id === coverId) || COVER_TYPES[0];
}

/**
 * Calculate effective AC with cover.
 */
export function getACWithCover(baseAC, coverId) {
  const cover = getCoverInfo(coverId);
  if (cover.acBonus === Infinity) return Infinity; // can't be targeted
  return baseAC + cover.acBonus;
}
