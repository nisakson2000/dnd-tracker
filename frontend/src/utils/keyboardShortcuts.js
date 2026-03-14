// Keyboard shortcut definitions for The Codex
// Section IDs match SHORTCUT_SECTIONS in CharacterView.jsx

export const SHORTCUTS = {
  // Section navigation (Ctrl/Cmd + number)
  'overview':   { key: '1', mod: true, label: 'Character Sheet' },
  'backstory':  { key: '2', mod: true, label: 'Backstory' },
  'spellbook':  { key: '3', mod: true, label: 'Spellbook' },
  'inventory':  { key: '4', mod: true, label: 'Inventory' },
  'features':   { key: '5', mod: true, label: 'Features & Traits' },
  'combat':     { key: '6', mod: true, label: 'Combat' },
  'journal':    { key: '7', mod: true, label: 'Journal' },
  'npcs':       { key: '8', mod: true, label: 'NPCs' },
  'quests':     { key: '9', mod: true, label: 'Quests' },

  // Quick actions
  'quick-roll':      { key: 'r', mod: true, label: 'Quick Roll d20' },
  'save':            { key: 's', mod: true, label: 'Manual Save' },
  'command-palette': { key: 'k', mod: true, label: 'Command Palette' },
  'new-entry':       { key: 'n', mod: true, label: 'New Entry (context)' },
  'escape':          { key: 'Escape', mod: false, label: 'Close Modal / Deselect' },
};

// Section shortcut IDs in order (index maps to key 1-9)
export const SECTION_ORDER = [
  'overview', 'backstory', 'spellbook', 'inventory',
  'features', 'combat', 'journal', 'npcs', 'quests',
];

/**
 * Match a keyboard event against defined shortcuts.
 * Returns the action string if matched, null otherwise.
 */
export function matchShortcut(e) {
  const mod = e.ctrlKey || e.metaKey;
  for (const [action, def] of Object.entries(SHORTCUTS)) {
    if (def.key === e.key && def.mod === mod) {
      return action;
    }
  }
  return null;
}

/**
 * Get a human-readable label for a shortcut key combo.
 */
export function getShortcutLabel(action) {
  const def = SHORTCUTS[action];
  if (!def) return '';
  const modKey = navigator.platform.includes('Mac') ? '\u2318' : 'Ctrl';
  return def.mod ? `${modKey}+${def.key.toUpperCase()}` : def.key;
}

/**
 * Given a section ID, return the shortcut label if one exists.
 * E.g., 'overview' -> 'Ctrl+1'
 */
export function getSectionShortcutLabel(sectionId) {
  const idx = SECTION_ORDER.indexOf(sectionId);
  if (idx === -1) return null;
  const modKey = navigator.platform.includes('Mac') ? '\u2318' : 'Ctrl';
  return `${modKey}+${idx + 1}`;
}
