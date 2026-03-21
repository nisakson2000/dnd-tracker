/**
 * playerSpellFilters.js
 * Player Mode Improvements 45-50: Spell search, filtering, description display
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// SPELL SCHOOLS
// ---------------------------------------------------------------------------

export const SPELL_SCHOOLS = [
  { id: 'abjuration', label: 'Abjuration', color: '#60a5fa', description: 'Protective spells' },
  { id: 'conjuration', label: 'Conjuration', color: '#34d399', description: 'Summoning and teleporting' },
  { id: 'divination', label: 'Divination', color: '#c084fc', description: 'Information gathering' },
  { id: 'enchantment', label: 'Enchantment', color: '#f472b6', description: 'Mind-affecting spells' },
  { id: 'evocation', label: 'Evocation', color: '#f87171', description: 'Energy and damage' },
  { id: 'illusion', label: 'Illusion', color: '#a78bfa', description: 'Deception and trickery' },
  { id: 'necromancy', label: 'Necromancy', color: '#6b7280', description: 'Life and death magic' },
  { id: 'transmutation', label: 'Transmutation', color: '#fbbf24', description: 'Transformation spells' },
];

// ---------------------------------------------------------------------------
// SPELL CASTING TIMES
// ---------------------------------------------------------------------------

export const CASTING_TIMES = [
  { id: 'action', label: '1 Action' },
  { id: 'bonus_action', label: '1 Bonus Action' },
  { id: 'reaction', label: '1 Reaction' },
  { id: 'minute', label: '1 Minute' },
  { id: '10_minutes', label: '10 Minutes' },
  { id: 'hour', label: '1 Hour' },
  { id: 'ritual', label: 'Ritual' },
];

// ---------------------------------------------------------------------------
// SPELL FILTER TEMPLATE
// ---------------------------------------------------------------------------

export const SPELL_FILTER_TEMPLATE = {
  searchText: '',
  level: null,          // null = all, 0 = cantrips, 1-9 = specific level
  school: null,         // null = all, or school id
  concentration: null,  // null = all, true = concentration only, false = non-concentration
  ritual: null,         // null = all, true = ritual only
  castingTime: null,    // null = all, or casting time id
  prepared: null,       // null = all, true = prepared only
  sortBy: 'level',      // 'level', 'name', 'school'
};

// ---------------------------------------------------------------------------
// FILTER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Filter spells based on criteria.
 */
export function filterSpells(spells, filters) {
  let result = [...spells];

  if (filters.searchText) {
    const search = filters.searchText.toLowerCase();
    result = result.filter(s =>
      (s.name || '').toLowerCase().includes(search) ||
      (s.school || '').toLowerCase().includes(search) ||
      (s.description || '').toLowerCase().includes(search)
    );
  }

  if (filters.level !== null && filters.level !== undefined) {
    result = result.filter(s => (s.level ?? 0) === filters.level);
  }

  if (filters.school) {
    result = result.filter(s =>
      (s.school || '').toLowerCase() === filters.school.toLowerCase()
    );
  }

  if (filters.concentration !== null) {
    result = result.filter(s => !!s.concentration === filters.concentration);
  }

  if (filters.ritual !== null) {
    result = result.filter(s => !!s.ritual === filters.ritual);
  }

  if (filters.prepared !== null) {
    result = result.filter(s => !!s.prepared === filters.prepared);
  }

  // Sort
  switch (filters.sortBy) {
    case 'name':
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      break;
    case 'school':
      result.sort((a, b) => (a.school || '').localeCompare(b.school || '') || (a.level ?? 0) - (b.level ?? 0));
      break;
    case 'level':
    default:
      result.sort((a, b) => (a.level ?? 0) - (b.level ?? 0) || (a.name || '').localeCompare(b.name || ''));
      break;
  }

  return result;
}

/**
 * Get school color for a spell.
 */
export function getSchoolColor(schoolName) {
  if (!schoolName) return '#6b7280';
  const school = SPELL_SCHOOLS.find(s => s.id === schoolName.toLowerCase() || s.label.toLowerCase() === schoolName.toLowerCase());
  return school?.color || '#6b7280';
}

/**
 * Format spell level for display.
 */
export function formatSpellLevel(level) {
  if (level === 0) return 'Cantrip';
  const suffixes = ['st', 'nd', 'rd'];
  const suffix = level <= 3 ? suffixes[level - 1] : 'th';
  return `${level}${suffix} Level`;
}
