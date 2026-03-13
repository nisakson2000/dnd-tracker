import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'codex-wiki-history';
const MAX_HISTORY = 20;

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.slice(0, MAX_HISTORY);
    }
  } catch { /* ignore */ }
  return [];
}

export default function useWikiHistory() {
  const [history, setHistory] = useState(loadHistory);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(history)); }
    catch { /* ignore */ }
  }, [history]);

  const recordVisit = useCallback(({ slug, title, category }) => {
    setHistory(prev => {
      const filtered = prev.filter(h => h.slug !== slug);
      return [{ slug, title, category, visitedAt: Date.now() }, ...filtered].slice(0, MAX_HISTORY);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, recordVisit, clearHistory };
}
