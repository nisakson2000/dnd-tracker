/**
 * Global Undo/Redo system using the Command Pattern.
 * Each action stores undo/redo callbacks along with metadata.
 * This is the foundation — actual integration with Combat/Inventory/Spellbook
 * will be added incrementally as those sections adopt the system.
 */

const MAX_HISTORY = 20;

class UndoStack {
  constructor() {
    this._history = [];   // past actions (undo stack)
    this._future = [];    // undone actions (redo stack)
    this._listeners = new Set();
  }

  /**
   * Push a new undoable action onto the stack.
   * Clears the redo stack (future is invalidated by new actions).
   * @param {{ type: string, description: string, undo: Function, redo: Function }} action
   */
  push(action) {
    if (!action || typeof action.undo !== 'function' || typeof action.redo !== 'function') {
      console.warn('[UndoStack] Invalid action — must have undo() and redo() callbacks');
      return;
    }

    this._history.push({
      type: action.type || 'unknown',
      description: action.description || '',
      undo: action.undo,
      redo: action.redo,
      timestamp: Date.now(),
    });

    // Trim to max size
    if (this._history.length > MAX_HISTORY) {
      this._history.shift();
    }

    // New action invalidates any redo history
    this._future = [];

    this._notify();
  }

  /**
   * Undo the most recent action.
   * @returns {boolean} true if an action was undone
   */
  undo() {
    if (this._history.length === 0) return false;

    const action = this._history.pop();
    try {
      action.undo();
    } catch (err) {
      console.error('[UndoStack] undo() failed:', err);
    }
    this._future.push(action);
    this._notify();
    return true;
  }

  /**
   * Redo the most recently undone action.
   * @returns {boolean} true if an action was redone
   */
  redo() {
    if (this._future.length === 0) return false;

    const action = this._future.pop();
    try {
      action.redo();
    } catch (err) {
      console.error('[UndoStack] redo() failed:', err);
    }
    this._history.push(action);
    this._notify();
    return true;
  }

  /** @returns {boolean} */
  canUndo() {
    return this._history.length > 0;
  }

  /** @returns {boolean} */
  canRedo() {
    return this._future.length > 0;
  }

  /**
   * Get the full undo history (most recent last).
   * @returns {Array<{ type: string, description: string, timestamp: number }>}
   */
  getHistory() {
    return this._history.map(({ type, description, timestamp }) => ({
      type,
      description,
      timestamp,
    }));
  }

  /**
   * Get the redo (future) stack.
   * @returns {Array<{ type: string, description: string, timestamp: number }>}
   */
  getFuture() {
    return this._future.map(({ type, description, timestamp }) => ({
      type,
      description,
      timestamp,
    }));
  }

  /** Clear all history and future. */
  clear() {
    this._history = [];
    this._future = [];
    this._notify();
  }

  /** Subscribe to changes. Returns an unsubscribe function. */
  subscribe(listener) {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  /** @private */
  _notify() {
    for (const listener of this._listeners) {
      try {
        listener();
      } catch {
        // ignore listener errors
      }
    }
  }
}

// Singleton instance — shared across the entire app
const undoStack = new UndoStack();

export default undoStack;
export { UndoStack };
