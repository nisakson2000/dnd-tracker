/**
 * playerProficiencyDisplay.js
 * Player Mode Improvements 68-73: Proficiency highlighting, expertise, armor/weapon profs
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// PROFICIENCY LEVELS
// ---------------------------------------------------------------------------

export const PROFICIENCY_LEVELS = {
  none: { label: 'Not Proficient', multiplier: 0, color: 'rgba(255,255,255,0.2)', symbol: '' },
  half: { label: 'Half Proficiency', multiplier: 0.5, color: '#94a3b8', symbol: '\u00BD' },
  proficient: { label: 'Proficient', multiplier: 1, color: '#4ade80', symbol: '\u25CF' },
  expertise: { label: 'Expertise', multiplier: 2, color: '#fbbf24', symbol: '\u25C6' },
};

/**
 * Calculate skill modifier.
 */
export function getSkillModifier(abilityMod, proficiencyBonus, proficiencyLevel = 'none') {
  const level = PROFICIENCY_LEVELS[proficiencyLevel] || PROFICIENCY_LEVELS.none;
  return abilityMod + Math.floor(proficiencyBonus * level.multiplier);
}

/**
 * Format a modifier for display (+X or -X).
 */
export function formatMod(mod) {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

// ---------------------------------------------------------------------------
// ARMOR PROFICIENCIES BY CLASS
// ---------------------------------------------------------------------------

export const ARMOR_PROFICIENCIES = {
  Barbarian: ['Light armor', 'Medium armor', 'Shields'],
  Bard: ['Light armor'],
  Cleric: ['Light armor', 'Medium armor', 'Shields'],
  Druid: ['Light armor', 'Medium armor', 'Shields (non-metal only)'],
  Fighter: ['All armor', 'Shields'],
  Monk: [],
  Paladin: ['All armor', 'Shields'],
  Ranger: ['Light armor', 'Medium armor', 'Shields'],
  Rogue: ['Light armor'],
  Sorcerer: [],
  Warlock: ['Light armor'],
  Wizard: [],
  Artificer: ['Light armor', 'Medium armor', 'Shields'],
};

// ---------------------------------------------------------------------------
// WEAPON PROFICIENCIES BY CLASS
// ---------------------------------------------------------------------------

export const WEAPON_PROFICIENCIES = {
  Barbarian: ['Simple weapons', 'Martial weapons'],
  Bard: ['Simple weapons', 'Hand crossbows', 'Longswords', 'Rapiers', 'Shortswords'],
  Cleric: ['Simple weapons'],
  Druid: ['Clubs', 'Daggers', 'Darts', 'Javelins', 'Maces', 'Quarterstaffs', 'Scimitars', 'Sickles', 'Slings', 'Spears'],
  Fighter: ['Simple weapons', 'Martial weapons'],
  Monk: ['Simple weapons', 'Shortswords'],
  Paladin: ['Simple weapons', 'Martial weapons'],
  Ranger: ['Simple weapons', 'Martial weapons'],
  Rogue: ['Simple weapons', 'Hand crossbows', 'Longswords', 'Rapiers', 'Shortswords'],
  Sorcerer: ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Light crossbows'],
  Warlock: ['Simple weapons'],
  Wizard: ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Light crossbows'],
  Artificer: ['Simple weapons', 'Firearms (optional)'],
};

// ---------------------------------------------------------------------------
// SAVING THROW PROFICIENCIES BY CLASS
// ---------------------------------------------------------------------------

export const SAVE_PROFICIENCIES = {
  Barbarian: ['STR', 'CON'],
  Bard: ['DEX', 'CHA'],
  Cleric: ['WIS', 'CHA'],
  Druid: ['INT', 'WIS'],
  Fighter: ['STR', 'CON'],
  Monk: ['STR', 'DEX'],
  Paladin: ['WIS', 'CHA'],
  Ranger: ['STR', 'DEX'],
  Rogue: ['DEX', 'INT'],
  Sorcerer: ['CON', 'CHA'],
  Warlock: ['WIS', 'CHA'],
  Wizard: ['INT', 'WIS'],
  Artificer: ['CON', 'INT'],
};

/**
 * Get all proficiencies for a class.
 */
export function getClassProficiencies(className) {
  const cls = Object.keys(ARMOR_PROFICIENCIES).find(c => className?.toLowerCase().includes(c.toLowerCase()));
  if (!cls) return { armor: [], weapons: [], saves: [] };
  return {
    armor: ARMOR_PROFICIENCIES[cls] || [],
    weapons: WEAPON_PROFICIENCIES[cls] || [],
    saves: SAVE_PROFICIENCIES[cls] || [],
  };
}

/**
 * Check if a character is proficient with a save.
 */
export function isProficientInSave(className, save) {
  const saves = SAVE_PROFICIENCIES[className] || [];
  return saves.includes(save.toUpperCase());
}
