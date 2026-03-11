import { useRef, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function useAutosave(saveFn, delay = 800) {
  const timerRef = useRef(null);
  const pendingRef = useRef(null);
  const failedDataRef = useRef(null);
  const saveFnRef = useRef(saveFn);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Keep saveFn ref current to avoid stale closures
  useEffect(() => { saveFnRef.current = saveFn; }, [saveFn]);

  const doSave = useCallback(async (data) => {
    if (data == null) return;
    setSaving(true);
    try {
      await saveFnRef.current(data);
      setLastSaved(new Date());
      failedDataRef.current = null;
    } catch (err) {
      failedDataRef.current = data;
      toast.error(`Save failed: ${err.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
      pendingRef.current = null;
      window.__codex_unsaved = false;
    }
  }, []);

  const trigger = useCallback((data) => {
    const saveData = data ?? failedDataRef.current;
    if (saveData == null) return;
    pendingRef.current = saveData;
    window.__codex_unsaved = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => doSave(saveData), delay);
  }, [doSave, delay]);

  // Flush: cancel timer and save immediately if data is pending
  const flush = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    if (pendingRef.current !== null) {
      // Fire-and-forget save of pending data
      const data = pendingRef.current;
      pendingRef.current = null;
      saveFnRef.current(data).catch(() => {});
    }
  }, []);

  // Cleanup on unmount — flush pending saves
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (pendingRef.current !== null) {
        saveFnRef.current(pendingRef.current).catch(() => {});
      }
    };
  }, []);

  return { trigger, flush, saving, lastSaved };
}
