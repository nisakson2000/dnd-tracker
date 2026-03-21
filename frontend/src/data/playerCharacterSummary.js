/**
 * playerCharacterSummary.js
 * Player Mode: Character sheet summary card data
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// CHARACTER CARD SECTIONS
// ---------------------------------------------------------------------------

export const CHARACTER_CARD_SECTIONS = [
  { id: 'identity', label: 'Identity', fields: ['name', 'race', 'class', 'subclass', 'level', 'alignment', 'background'] },
  { id: 'combat', label: 'Combat', fields: ['ac', 'hp', 'speed', 'initiative', 'proficiency_bonus', 'hit_dice'] },
  { id: 'abilities', label: 'Abilities', fields: ['str', 'dex', 'con', 'int', 'wis', 'cha'] },
  { id: 'saves', label: 'Saving Throws', fields: ['str_save', 'dex_save', 'con_save', 'int_save', 'wis_save', 'cha_save'] },
  { id: 'skills', label: 'Skills', fields: ['all_18_skills'] },
  { id: 'features', label: 'Features & Traits', fields: ['class_features', 'racial_traits', 'feats'] },
  { id: 'equipment', label: 'Equipment', fields: ['weapons', 'armor', 'items', 'currency'] },
  { id: 'spells', label: 'Spellcasting', fields: ['spell_ability', 'spell_save_dc', 'spell_attack', 'spell_slots', 'spells_known'] },
  { id: 'background', label: 'Background', fields: ['personality', 'ideals', 'bonds', 'flaws', 'backstory'] },
];

// ---------------------------------------------------------------------------
// DISPLAY HELPERS
// ---------------------------------------------------------------------------

/**
 * Format a character's class display.
 */
export function formatClassDisplay(character) {
  if (!character) return '';
  const parts = [];
  if (character.primary_class) {
    let cls = character.primary_class;
    if (character.primary_subclass) cls += ` (${character.primary_subclass})`;
    if (character.level) cls += ` ${character.level}`;
    parts.push(cls);
  }
  if (character.secondary_class) {
    let cls = character.secondary_class;
    if (character.secondary_level) cls += ` ${character.secondary_level}`;
    parts.push(cls);
  }
  return parts.join(' / ');
}

/**
 * Calculate total character level (for multiclass).
 */
export function getTotalLevel(character) {
  if (!character) return 0;
  const primary = character.level || character.primary_level || 0;
  const secondary = character.secondary_level || 0;
  return primary + secondary;
}

/**
 * Generate a one-line character summary.
 */
export function getCharacterOneLiner(character) {
  if (!character) return 'No character loaded';
  const parts = [character.name];
  if (character.race) parts.push(character.race);
  parts.push(formatClassDisplay(character));
  return parts.filter(Boolean).join(' — ');
}

// ---------------------------------------------------------------------------
// STAT BLOCK TEMPLATE (for display card)
// ---------------------------------------------------------------------------

export const STAT_DISPLAY_ORDER = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

export const STAT_COLORS = {
  STR: '#ef4444',
  DEX: '#f97316',
  CON: '#eab308',
  INT: '#3b82f6',
  WIS: '#22c55e',
  CHA: '#a855f7',
};
