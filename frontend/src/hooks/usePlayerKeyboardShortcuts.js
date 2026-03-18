import { useEffect, useCallback } from 'react';

/**
 * Keyboard shortcuts for Player Session mode.
 * - Space: End turn (during your turn)
 * - R: Open quick roll (focus chat with /roll)
 * - Tab: Cycle combat HUD tabs
 * - Escape: Dismiss overlays
 * - I: Toggle inventory
 * - C: Toggle character sheet
 * - H: Toggle shortcut help
 * - 1-9: Target selection in combat (when in combat)
 */
export default function usePlayerKeyboardShortcuts({
  isMyTurn,
  connected,
  sendToDm,
  playerUuid,
  onEndTurn,
  onQuickRoll,
  onCycleTab,
  onDismiss,
  onToggleInventory,
  onToggleCharSheet,
  onShowShortcutHelp,
  onTargetSelect,
  inCombat,
}) {
  const handleKeyDown = useCallback((e) => {
    // Don't trigger shortcuts when typing in inputs
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) {
      // Only handle Escape in inputs
      if (e.key === 'Escape') {
        e.target.blur();
        if (onDismiss) onDismiss();
      }
      return;
    }

    const mod = e.ctrlKey || e.metaKey;

    // Ctrl/Cmd shortcuts
    if (mod) {
      switch (e.key) {
        case '/':
        case '?':
          e.preventDefault();
          if (onShowShortcutHelp) onShowShortcutHelp();
          return;
        default:
          break;
      }
    }

    switch (e.key) {
      case ' ':
        // Space: end turn (only during your turn in combat)
        if (isMyTurn && connected) {
          e.preventDefault();
          if (onEndTurn) onEndTurn();
        }
        break;

      case 'r':
      case 'R':
        // R: open quick roll
        if (!mod) {
          e.preventDefault();
          if (onQuickRoll) onQuickRoll();
        }
        break;

      case 'i':
      case 'I':
        // I: toggle inventory panel
        if (!mod) {
          e.preventDefault();
          if (onToggleInventory) onToggleInventory();
        }
        break;

      case 'c':
      case 'C':
        // C: toggle character sheet
        if (!mod) {
          e.preventDefault();
          if (onToggleCharSheet) onToggleCharSheet();
        }
        break;

      case 'Tab':
        // Tab: cycle combat HUD tabs
        if (!mod) {
          e.preventDefault();
          if (onCycleTab) onCycleTab();
        }
        break;

      case 'Escape':
        e.preventDefault();
        if (onDismiss) onDismiss();
        break;

      default:
        // 1-9: target selection in combat
        if (inCombat && !mod) {
          const num = parseInt(e.key, 10);
          if (num >= 1 && num <= 9) {
            e.preventDefault();
            if (onTargetSelect) onTargetSelect(num);
          }
        }
        break;
    }
  }, [isMyTurn, connected, inCombat, onEndTurn, onQuickRoll, onCycleTab, onDismiss, onToggleInventory, onToggleCharSheet, onShowShortcutHelp, onTargetSelect]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
