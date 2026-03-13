import { useEffect, useRef } from 'react';

// Registry of flush functions from all active autosave hooks
const flushRegistry = new Set();

export function registerFlush(fn) {
  flushRegistry.add(fn);
  return () => flushRegistry.delete(fn);
}

// Flush all pending autosaves — called on beforeunload / crash
function flushAll() {
  for (const fn of flushRegistry) {
    try { fn(); } catch { /* best effort */ }
  }
}

/**
 * Hook to install crash recovery at the app level.
 * Call once in CharacterView or App.
 * Flushes all pending autosaves on:
 *   - beforeunload (tab close, refresh, crash)
 *   - visibilitychange (app hidden / minimized)
 */
export function useCrashRecovery() {
  useEffect(() => {
    const handleBeforeUnload = () => flushAll();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flushAll();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
}

/**
 * Hook to register a flush function for crash recovery.
 * Use in any component with autosave:
 *   const { flush } = useAutosave(saveFn);
 *   useCrashFlush(flush);
 */
export function useCrashFlush(flushFn) {
  const fnRef = useRef(flushFn);
  useEffect(() => { fnRef.current = flushFn; }, [flushFn]);

  useEffect(() => {
    const wrapper = () => fnRef.current();
    return registerFlush(wrapper);
  }, []);
}
