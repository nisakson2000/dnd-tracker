import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import undoStack from '../utils/undoStack';

/**
 * React hook that wraps the global UndoStack singleton.
 * Triggers re-renders when the undo/redo state changes.
 *
 * Usage:
 *   const { undo, redo, canUndo, canRedo, pushUndo, history } = useUndoStack();
 */
export default function useUndoStack() {
  // Use a version counter to trigger re-renders on stack changes
  const [, setVersion] = useState(0);

  useEffect(() => {
    const unsub = undoStack.subscribe(() => {
      setVersion((v) => v + 1);
    });
    return unsub;
  }, []);

  const undo = useCallback(() => undoStack.undo(), []);
  const redo = useCallback(() => undoStack.redo(), []);
  const clear = useCallback(() => undoStack.clear(), []);

  const pushUndo = useCallback((action) => {
    undoStack.push(action);
  }, []);

  return {
    undo,
    redo,
    canUndo: undoStack.canUndo(),
    canRedo: undoStack.canRedo(),
    pushUndo,
    clear,
    history: undoStack.getHistory(),
    future: undoStack.getFuture(),
  };
}
