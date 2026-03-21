/**
 * playerAmmoTracker.js
 * Player Mode Improvements 110: Ammunition counter for ranged weapons
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// AMMUNITION TYPES
// ---------------------------------------------------------------------------

export const AMMO_TYPES = [
  { id: 'arrow', label: 'Arrows', icon: 'arrow-up', color: '#86efac', defaultCount: 20 },
  { id: 'bolt', label: 'Crossbow Bolts', icon: 'arrow-right', color: '#60a5fa', defaultCount: 20 },
  { id: 'bullet', label: 'Sling Bullets', icon: 'circle', color: '#a78bfa', defaultCount: 20 },
  { id: 'blowgun_needle', label: 'Blowgun Needles', icon: 'minus', color: '#fbbf24', defaultCount: 50 },
  { id: 'dart', label: 'Darts', icon: 'target', color: '#f472b6', defaultCount: 10 },
  { id: 'javelin', label: 'Javelins', icon: 'arrow-up', color: '#f97316', defaultCount: 5 },
  { id: 'handaxe', label: 'Handaxes', icon: 'axe', color: '#ef4444', defaultCount: 2 },
  { id: 'dagger_thrown', label: 'Daggers (Thrown)', icon: 'knife', color: '#94a3b8', defaultCount: 2 },
];

// ---------------------------------------------------------------------------
// SPECIAL AMMUNITION
// ---------------------------------------------------------------------------

export const SPECIAL_AMMO = [
  { id: 'arrow_plus1', label: '+1 Arrow', bonus: 1, damageBonus: 1, rarity: 'uncommon', color: '#4ade80' },
  { id: 'arrow_plus2', label: '+2 Arrow', bonus: 2, damageBonus: 2, rarity: 'rare', color: '#60a5fa' },
  { id: 'arrow_plus3', label: '+3 Arrow', bonus: 3, damageBonus: 3, rarity: 'very_rare', color: '#a78bfa' },
  { id: 'arrow_slaying', label: 'Arrow of Slaying', bonus: 0, extraDamage: '6d10', rarity: 'very_rare', color: '#ef4444' },
  { id: 'unbreakable_arrow', label: 'Unbreakable Arrow', bonus: 0, special: 'Cannot be broken', rarity: 'common', color: '#94a3b8' },
  { id: 'walloping_ammo', label: 'Walloping Ammunition', bonus: 0, special: 'DC 10 STR save or knocked prone', rarity: 'common', color: '#fbbf24' },
];

// ---------------------------------------------------------------------------
// AMMO TRACKER TEMPLATE
// ---------------------------------------------------------------------------

export const AMMO_TRACKER_TEMPLATE = {
  type: 'arrow',
  current: 20,
  max: 20,
  recoverable: true, // PHB: half ammunition recoverable after battle
};

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Fire ammunition (reduce count by 1).
 */
export function fireAmmo(tracker) {
  if (tracker.current <= 0) return { ...tracker, outOfAmmo: true };
  return { ...tracker, current: tracker.current - 1, outOfAmmo: false };
}

/**
 * Recover ammunition after combat (50% rule, rounded down).
 */
export function recoverAmmo(tracker, firedCount) {
  if (!tracker.recoverable) return tracker;
  const recovered = Math.floor(firedCount / 2);
  return {
    ...tracker,
    current: Math.min(tracker.max, tracker.current + recovered),
  };
}

/**
 * Check if ammo is low (below 25%).
 */
export function isAmmoLow(tracker) {
  if (tracker.max === 0) return false;
  return (tracker.current / tracker.max) <= 0.25;
}

/**
 * Get ammo status color.
 */
export function getAmmoColor(tracker) {
  const pct = tracker.max > 0 ? tracker.current / tracker.max : 0;
  if (pct <= 0) return '#ef4444';
  if (pct <= 0.25) return '#f97316';
  if (pct <= 0.5) return '#fbbf24';
  return '#4ade80';
}
