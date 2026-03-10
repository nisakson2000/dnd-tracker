import { useRef, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function useAutosave(saveFn, delay = 800) {
  const timerRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const trigger = useCallback((data) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setSaving(true);
      try {
        await saveFn(data);
        setLastSaved(new Date());
      } catch (err) {
        toast.error(`Save failed: ${err.message}`);
      } finally {
        setSaving(false);
      }
    }, delay);
  }, [saveFn, delay]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { trigger, saving, lastSaved };
}
