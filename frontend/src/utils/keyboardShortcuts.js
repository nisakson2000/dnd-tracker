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

  // Phase 6 additions
  'undo':            { key: 'z', mod: true, label: 'Undo' },
  'dice-dialog':     { key: 'd', mod: true, label: 'Quick Dice Roll Dialog' },
  'shortcut-help':   { key: '/', mod: true, label: 'Keyboard Shortcut Help' },
  'toggle-combat-log': { key: 'l', mod: true, label: 'Toggle Combat Log' },
};

// Combat-only shortcuts (no mod key, only active when combat tracker is focused)
export const COMBAT_SHORTCUTS = {
  'next-turn':       { key: ' ', mod: false, label: 'Next Turn' },
  'prev-turn':       { key: 'Backspace', mod: false, label: 'Previous Turn' },
  'damage-mode':     { key: 'd', mod: false, label: 'Damage Current Target' },
  'heal-mode':       { key: 'h', mod: false, label: 'Heal Current Target' },
  'condition-toggle':{ key: 'c', mod: false, label: 'Toggle Condition Picker' },
  'quick-roll':      { key: 'r', mod: false, label: 'Roll d20' },
  'sort-initiative': { key: 's', mod: false, label: 'Sort by Initiative' },
  'add-combatant':   { key: 'a', mod: false, label: 'Add Combatant' },
  'toggle-log':      { key: 'l', mod: false, label: 'Toggle Combat Log' },
  'end-combat':      { key: 'e', mod: false, label: 'End Combat' },
  'target-1':        { key: '1', mod: false, label: 'Target 1' },
  'target-2':        { key: '2', mod: false, label: 'Target 2' },
  'target-3':        { key: '3', mod: false, label: 'Target 3' },
  'target-4':        { key: '4', mod: false, label: 'Target 4' },
  'target-5':        { key: '5', mod: false, label: 'Target 5' },
  'target-6':        { key: '6', mod: false, label: 'Target 6' },
  'target-7':        { key: '7', mod: false, label: 'Target 7' },
  'target-8':        { key: '8', mod: false, label: 'Target 8' },
  'target-9':        { key: '9', mod: false, label: 'Target 9' },
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

  // Also accept Ctrl+? (Shift+/ on US keyboards) for shortcut help
  if (mod && e.key === '?') return 'shortcut-help';

  for (const [action, def] of Object.entries(SHORTCUTS)) {
    if (def.key === e.key && def.mod === mod) {
      return action;
    }
  }
  return null;
}

/**
 * Match a keyboard event against combat-only shortcuts.
 * Only call this when the combat tracker is focused/active.
 * Returns the action string if matched, null otherwise.
 */
export function matchCombatShortcut(e) {
  // Don't match if any modifier is held (those are global shortcuts)
  if (e.ctrlKey || e.metaKey || e.altKey) return null;

  for (const [action, def] of Object.entries(COMBAT_SHORTCUTS)) {
    if (def.key === e.key) {
      return action;
    }
  }
  return null;
}

/**
 * Get all shortcuts grouped by category for display in help overlay.
 */
export function getShortcutGroups() {
  const groups = {
    'Section Navigation': {},
    'Quick Actions': {},
    'Combat — DM Actions': {},
    'Combat — Targeting': {},
  };

  for (const [action, def] of Object.entries(SHORTCUTS)) {
    const idx = SECTION_ORDER.indexOf(action);
    if (idx !== -1) {
      groups['Section Navigation'][action] = def;
    } else {
      groups['Quick Actions'][action] = def;
    }
  }

  for (const [action, def] of Object.entries(COMBAT_SHORTCUTS)) {
    if (action.startsWith('target-')) {
      groups['Combat — Targeting'][action] = def;
    } else {
      groups['Combat — DM Actions'][action] = def;
    }
  }

  return groups;
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
