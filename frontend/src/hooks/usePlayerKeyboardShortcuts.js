import { useEffect, useCallback } from 'react';

/**
 * Keyboard shortcuts for Player Session mode.
 * - Space: End turn (during your turn)
 * - R: Open quick roll (focus chat with /roll)
 * - Tab: Cycle combat HUD tabs
 * - Escape: Dismiss overlays
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
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          if (onQuickRoll) onQuickRoll();
        }
        break;

      case 'Tab':
        // Tab: cycle combat HUD tabs
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          if (onCycleTab) onCycleTab();
        }
        break;

      case 'Escape':
        e.preventDefault();
        if (onDismiss) onDismiss();
        break;

      default:
        break;
    }
  }, [isMyTurn, connected, onEndTurn, onQuickRoll, onCycleTab, onDismiss]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
