/**
 * playerPassiveScores.js
 * Player Mode Improvements 63-65, 67: Passive scores and vision display
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// PASSIVE SCORE CALCULATIONS
// ---------------------------------------------------------------------------

/**
 * Calculate a passive score.
 * Passive = 10 + skill modifier + bonuses - penalties
 */
export function calculatePassiveScore(skillMod, bonuses = 0, penalties = 0) {
  return 10 + skillMod + bonuses - penalties;
}

/**
 * Get passive Perception.
 */
export function getPassivePerception(wisMod, profBonus, isProficient, hasObservant = false, hasDisadvantage = false) {
  const skillMod = wisMod + (isProficient ? profBonus : 0);
  const bonus = hasObservant ? 5 : 0;
  const penalty = hasDisadvantage ? 5 : 0;
  return calculatePassiveScore(skillMod, bonus, penalty);
}

/**
 * Get passive Investigation.
 */
export function getPassiveInvestigation(intMod, profBonus, isProficient, hasObservant = false) {
  const skillMod = intMod + (isProficient ? profBonus : 0);
  const bonus = hasObservant ? 5 : 0;
  return calculatePassiveScore(skillMod, bonus, 0);
}

/**
 * Get passive Insight.
 */
export function getPassiveInsight(wisMod, profBonus, isProficient) {
  const skillMod = wisMod + (isProficient ? profBonus : 0);
  return calculatePassiveScore(skillMod, 0, 0);
}

// ---------------------------------------------------------------------------
// PASSIVE SCORES DISPLAY CONFIG
// ---------------------------------------------------------------------------

export const PASSIVE_SCORES = [
  { id: 'perception', label: 'Passive Perception', ability: 'WIS', skill: 'Perception', color: '#4ade80', icon: 'eye' },
  { id: 'investigation', label: 'Passive Investigation', ability: 'INT', skill: 'Investigation', color: '#60a5fa', icon: 'search' },
  { id: 'insight', label: 'Passive Insight', ability: 'WIS', skill: 'Insight', color: '#a78bfa', icon: 'brain' },
];

// ---------------------------------------------------------------------------
// VISION TYPES
// ---------------------------------------------------------------------------

export const VISION_TYPES = [
  { id: 'normal', label: 'Normal Vision', range: null, color: '#94a3b8', description: 'Normal human vision.' },
  { id: 'darkvision_60', label: 'Darkvision (60ft)', range: 60, color: '#a78bfa', description: 'See in dim light as bright, darkness as dim light, within range.' },
  { id: 'darkvision_120', label: 'Darkvision (120ft)', range: 120, color: '#7c3aed', description: 'Extended darkvision — Drow, Deep Gnome, etc.' },
  { id: 'darkvision_300', label: 'Darkvision (300ft)', range: 300, color: '#6d28d9', description: 'Exceptional darkvision — Gloom Stalker, etc.' },
  { id: 'blindsight', label: 'Blindsight', range: null, color: '#f97316', description: 'Perceive surroundings without relying on sight.' },
  { id: 'tremorsense', label: 'Tremorsense', range: null, color: '#fbbf24', description: 'Detect vibrations through the ground.' },
  { id: 'truesight', label: 'Truesight', range: null, color: '#ef4444', description: 'See through illusions, into the Ethereal Plane, and see true forms.' },
];

// ---------------------------------------------------------------------------
// RACES WITH DARKVISION
// ---------------------------------------------------------------------------

export const DARKVISION_RACES = {
  Elf: 60, 'High Elf': 60, 'Wood Elf': 60, 'Dark Elf (Drow)': 120,
  Dwarf: 60, 'Hill Dwarf': 60, 'Mountain Dwarf': 60,
  Gnome: 60, 'Forest Gnome': 60, 'Rock Gnome': 60, 'Deep Gnome': 120,
  'Half-Elf': 60, 'Half-Orc': 60,
  Tiefling: 60, Dragonborn: 0,
  Human: 0, 'Variant Human': 0,
  Halfling: 0, 'Lightfoot Halfling': 0,
  Goliath: 0, Firbolg: 0,
  Tabaxi: 60, Bugbear: 60, Goblin: 60, Hobgoblin: 60, Kobold: 60,
};

/**
 * Get darkvision range for a race.
 */
export function getDarkvisionRange(race) {
  for (const [key, range] of Object.entries(DARKVISION_RACES)) {
    if (race && race.toLowerCase().includes(key.toLowerCase())) return range;
  }
  return 0; // default no darkvision
}
