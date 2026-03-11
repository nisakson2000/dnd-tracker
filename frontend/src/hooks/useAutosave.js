import { useRef, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function useAutosave(saveFn, delay = 800) {
  const timerRef = useRef(null);
  const pendingRef = useRef(null);
  const saveFnRef = useRef(saveFn);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Keep saveFn ref current to avoid stale closures
  useEffect(() => { saveFnRef.current = saveFn; }, [saveFn]);

  const doSave = useCallback(async (data) => {
    setSaving(true);
    try {
      await saveFnRef.current(data);
      setLastSaved(new Date());
    } catch (err) {
      toast.error(`Save failed: ${err.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
      pendingRef.current = null;
    }
  }, []);

  const trigger = useCallback((data) => {
    pendingRef.current = data;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => doSave(data), delay);
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
