/**
 * playerNoteCategories.js
 * Player Mode Improvements 158-162: Note categorization, templates, pinning, search
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// NOTE CATEGORIES
// ---------------------------------------------------------------------------

export const NOTE_CATEGORIES = [
  { id: 'general', label: 'General', color: '#94a3b8', icon: 'file-text' },
  { id: 'combat', label: 'Combat', color: '#ef4444', icon: 'swords' },
  { id: 'lore', label: 'Lore', color: '#a78bfa', icon: 'book' },
  { id: 'npc', label: 'NPC', color: '#f472b6', icon: 'user' },
  { id: 'quest', label: 'Quest', color: '#fbbf24', icon: 'compass' },
  { id: 'location', label: 'Location', color: '#4ade80', icon: 'map-pin' },
  { id: 'item', label: 'Item', color: '#60a5fa', icon: 'package' },
  { id: 'rules', label: 'Rules', color: '#f97316', icon: 'book-open' },
];

// ---------------------------------------------------------------------------
// NOTE TEMPLATES
// ---------------------------------------------------------------------------

export const NOTE_TEMPLATES = [
  {
    id: 'npc_encounter',
    label: 'NPC Encounter',
    category: 'npc',
    template: `**NPC Name:**
**Location:**
**Role/Title:**
**Attitude:** Friendly / Neutral / Hostile
**Key Info:**
**Appearance:**
**Notes:** `,
  },
  {
    id: 'location_discovery',
    label: 'Location',
    category: 'location',
    template: `**Location:**
**Type:** Town / Dungeon / Wilderness / Building
**Notable Features:**
**NPCs Here:**
**Threats:**
**Loot/Resources:**
**Notes:** `,
  },
  {
    id: 'item_found',
    label: 'Item Found',
    category: 'item',
    template: `**Item:**
**Type:** Weapon / Armor / Potion / Scroll / Wondrous / Other
**Rarity:** Common / Uncommon / Rare / Very Rare / Legendary
**Properties:**
**Attunement:** Yes / No
**Notes:** `,
  },
  {
    id: 'combat_encounter',
    label: 'Combat Encounter',
    category: 'combat',
    template: `**Enemies:**
**Location:**
**Difficulty:** Easy / Medium / Hard / Deadly
**Tactics Used:**
**Loot Gained:**
**Notes:** `,
  },
  {
    id: 'quest_update',
    label: 'Quest Update',
    category: 'quest',
    template: `**Quest:**
**Given By:**
**Objective:**
**Progress:**
**Leads/Clues:**
**Reward:**
**Notes:** `,
  },
  {
    id: 'lore_discovery',
    label: 'Lore Discovery',
    category: 'lore',
    template: `**Topic:**
**Source:** Book / NPC / Inscription / Vision / Other
**Key Details:**
**Related To:**
**Notes:** `,
  },
];

// ---------------------------------------------------------------------------
// NOTE ENTRY TEMPLATE
// ---------------------------------------------------------------------------

export const NOTE_ENTRY_TEMPLATE = {
  id: '',
  category: 'general',
  title: '',
  content: '',
  pinned: false,
  timestamp: null,
  session: null,
  tags: [],
};

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Create a note from a template.
 */
export function createFromTemplate(templateId, sessionId = null) {
  const tmpl = NOTE_TEMPLATES.find(t => t.id === templateId);
  if (!tmpl) return { ...NOTE_ENTRY_TEMPLATE, timestamp: Date.now(), session: sessionId };
  return {
    ...NOTE_ENTRY_TEMPLATE,
    id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    category: tmpl.category,
    title: tmpl.label,
    content: tmpl.template,
    timestamp: Date.now(),
    session: sessionId,
  };
}

/**
 * Search notes by keyword.
 */
export function searchNotes(notes, query) {
  if (!query || !query.trim()) return notes;
  const q = query.toLowerCase().trim();
  return notes.filter(n =>
    (n.title || '').toLowerCase().includes(q) ||
    (n.content || '').toLowerCase().includes(q) ||
    (n.tags || []).some(t => t.toLowerCase().includes(q))
  );
}

/**
 * Filter notes by category.
 */
export function filterNotesByCategory(notes, categoryId) {
  if (!categoryId || categoryId === 'all') return notes;
  return notes.filter(n => n.category === categoryId);
}

/**
 * Sort notes (pinned first, then by timestamp descending).
 */
export function sortNotes(notes) {
  return [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return (b.timestamp || 0) - (a.timestamp || 0);
  });
}

/**
 * Get category info by id.
 */
export function getCategoryInfo(categoryId) {
  return NOTE_CATEGORIES.find(c => c.id === categoryId) || NOTE_CATEGORIES[0];
}
