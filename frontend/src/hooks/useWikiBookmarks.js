import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'codex-wiki-bookmarks';
const MAX_BOOKMARKS = 50;

function loadBookmarks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.slice(0, MAX_BOOKMARKS);
    }
  } catch { /* ignore */ }
  return [];
}

export default function useWikiBookmarks() {
  const [bookmarks, setBookmarks] = useState(loadBookmarks);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks)); }
    catch { /* ignore */ }
  }, [bookmarks]);

  const addBookmark = useCallback(({ slug, title, category }) => {
    setBookmarks(prev => {
      if (prev.some(b => b.slug === slug)) return prev;
      return [{ slug, title, category, bookmarkedAt: Date.now() }, ...prev].slice(0, MAX_BOOKMARKS);
    });
  }, []);

  const removeBookmark = useCallback((slug) => {
    setBookmarks(prev => prev.filter(b => b.slug !== slug));
  }, []);

  const toggleBookmark = useCallback((article) => {
    setBookmarks(prev => {
      if (prev.some(b => b.slug === article.slug)) {
        return prev.filter(b => b.slug !== article.slug);
      }
      return [
        { slug: article.slug, title: article.title, category: article.category, bookmarkedAt: Date.now() },
        ...prev,
      ].slice(0, MAX_BOOKMARKS);
    });
  }, []);

  const isBookmarked = useCallback((slug) => {
    return bookmarks.some(b => b.slug === slug);
  }, [bookmarks]);

  return { bookmarks, addBookmark, removeBookmark, toggleBookmark, isBookmarked };
}
