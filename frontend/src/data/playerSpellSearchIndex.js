/**
 * playerSpellSearchIndex.js
 * Player Mode: Spell search, filter, and quick-access helpers
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// SPELL SCHOOLS
// ---------------------------------------------------------------------------

export const SPELL_SCHOOLS = [
  { id: 'abjuration', label: 'Abjuration', color: '#60a5fa', description: 'Protective spells' },
  { id: 'conjuration', label: 'Conjuration', color: '#fbbf24', description: 'Summoning and teleportation' },
  { id: 'divination', label: 'Divination', color: '#a78bfa', description: 'Revealing information' },
  { id: 'enchantment', label: 'Enchantment', color: '#f472b6', description: 'Influencing minds' },
  { id: 'evocation', label: 'Evocation', color: '#ef4444', description: 'Energy and damage' },
  { id: 'illusion', label: 'Illusion', color: '#c084fc', description: 'Deception and misdirection' },
  { id: 'necromancy', label: 'Necromancy', color: '#94a3b8', description: 'Death and undead' },
  { id: 'transmutation', label: 'Transmutation', color: '#4ade80', description: 'Changing properties' },
];

// ---------------------------------------------------------------------------
// CASTING TIMES
// ---------------------------------------------------------------------------

export const CASTING_TIMES = [
  { id: 'action', label: '1 Action' },
  { id: 'bonus_action', label: 'Bonus Action' },
  { id: 'reaction', label: 'Reaction' },
  { id: 'minute', label: '1 Minute' },
  { id: 'ten_minutes', label: '10 Minutes' },
  { id: 'hour', label: '1 Hour' },
  { id: 'ritual', label: 'Ritual (10 min extra)' },
];

// ---------------------------------------------------------------------------
// SPELL TAGS
// ---------------------------------------------------------------------------

export const SPELL_TAGS = [
  { id: 'concentration', label: 'Concentration', color: '#60a5fa' },
  { id: 'ritual', label: 'Ritual', color: '#4ade80' },
  { id: 'damage', label: 'Damage', color: '#ef4444' },
  { id: 'healing', label: 'Healing', color: '#86efac' },
  { id: 'buff', label: 'Buff', color: '#fbbf24' },
  { id: 'debuff', label: 'Debuff', color: '#f97316' },
  { id: 'control', label: 'Control', color: '#a78bfa' },
  { id: 'utility', label: 'Utility', color: '#94a3b8' },
  { id: 'aoe', label: 'AoE', color: '#f472b6' },
  { id: 'single_target', label: 'Single Target', color: '#c4b5fd' },
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Search spells by name.
 */
export function searchSpells(spells, query) {
  if (!query || !query.trim()) return spells;
  const q = query.toLowerCase().trim();
  return spells.filter(s => (s.name || '').toLowerCase().includes(q));
}

/**
 * Filter spells by level.
 */
export function filterByLevel(spells, level) {
  if (level === null || level === undefined || level === 'all') return spells;
  return spells.filter(s => (s.level ?? 0) === level);
}

/**
 * Filter spells by school.
 */
export function filterBySchool(spells, school) {
  if (!school || school === 'all') return spells;
  return spells.filter(s => (s.school || '').toLowerCase() === school.toLowerCase());
}

/**
 * Filter concentration spells only.
 */
export function filterConcentration(spells, concentrationOnly = true) {
  if (!concentrationOnly) return spells;
  return spells.filter(s => s.concentration);
}

/**
 * Filter ritual spells only.
 */
export function filterRitual(spells, ritualOnly = true) {
  if (!ritualOnly) return spells;
  return spells.filter(s => s.ritual);
}

/**
 * Get school color.
 */
export function getSchoolColor(school) {
  const s = SPELL_SCHOOLS.find(sc => sc.id === (school || '').toLowerCase());
  return s ? s.color : '#94a3b8';
}

/**
 * Format spell level display.
 */
export function formatSpellLevel(level) {
  if (level === 0) return 'Cantrip';
  if (level === 1) return '1st';
  if (level === 2) return '2nd';
  if (level === 3) return '3rd';
  return `${level}th`;
}

/**
 * Sort spells (cantrips first, then by level, then alphabetical).
 */
export function sortSpells(spells) {
  return [...spells].sort((a, b) => {
    const la = a.level ?? 0;
    const lb = b.level ?? 0;
    if (la !== lb) return la - lb;
    return (a.name || '').localeCompare(b.name || '');
  });
}

/**
 * Group spells by level.
 */
export function groupSpellsByLevel(spells) {
  const groups = {};
  for (const spell of spells) {
    const level = spell.level ?? 0;
    if (!groups[level]) groups[level] = [];
    groups[level].push(spell);
  }
  return groups;
}
