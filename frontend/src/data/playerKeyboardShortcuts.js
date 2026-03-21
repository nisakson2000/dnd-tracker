/**
 * playerKeyboardShortcuts.js
 * Player Mode Improvements 141-143: Keyboard shortcuts and quick-access hotkeys
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// KEYBOARD SHORTCUTS
// ---------------------------------------------------------------------------

export const KEYBOARD_SHORTCUTS = [
  // Dice
  { key: 'R', modifier: null, action: 'roll_d20', label: 'Quick d20 Roll', category: 'dice' },
  { key: 'Escape', modifier: null, action: 'dismiss', label: 'Dismiss Overlay', category: 'ui' },

  // Navigation (future)
  { key: '1', modifier: 'Alt', action: 'tab_attack', label: 'Attack Tab', category: 'combat' },
  { key: '2', modifier: 'Alt', action: 'tab_spells', label: 'Spells Tab', category: 'combat' },
  { key: '3', modifier: 'Alt', action: 'tab_items', label: 'Items Tab', category: 'combat' },
  { key: '4', modifier: 'Alt', action: 'tab_features', label: 'Features Tab', category: 'combat' },

  // Combat
  { key: 'E', modifier: null, action: 'end_turn', label: 'End Turn', category: 'combat' },
  { key: 'D', modifier: null, action: 'toggle_dash', label: 'Dash (Double Movement)', category: 'combat' },

  // Chat
  { key: 'Enter', modifier: null, action: 'send_chat', label: 'Send Chat Message', category: 'chat', context: 'chat_input' },
  { key: 'T', modifier: null, action: 'focus_chat', label: 'Focus Chat Input', category: 'chat' },
];

/**
 * Get shortcuts grouped by category.
 */
export function getShortcutsByCategory() {
  const groups = {};
  for (const shortcut of KEYBOARD_SHORTCUTS) {
    if (!groups[shortcut.category]) groups[shortcut.category] = [];
    groups[shortcut.category].push(shortcut);
  }
  return groups;
}

/**
 * Format a shortcut key for display.
 */
export function formatShortcutKey(shortcut) {
  if (shortcut.modifier) {
    return `${shortcut.modifier}+${shortcut.key}`;
  }
  return shortcut.key;
}
