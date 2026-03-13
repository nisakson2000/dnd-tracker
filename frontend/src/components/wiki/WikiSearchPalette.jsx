import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Clock, BookOpen } from 'lucide-react';
import { searchArticles } from '../../api/wiki';
import { getCategoryConfig } from '../../data/wikiCategoryConfig';

const RECENT_KEY = 'codex-wiki-recent-searches';
const MAX_RECENT = 8;

function loadRecent() {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.slice(0, MAX_RECENT);
    }
  } catch { /* ignore */ }
  return [];
}

function saveRecent(searches) {
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(searches.slice(0, MAX_RECENT))); }
  catch { /* ignore */ }
}

export default function WikiSearchPalette({ open, onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const overlayRef = useRef(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [recentSearches, setRecentSearches] = useState(loadRecent);
  const debounceRef = useRef(null);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Search with debounce
  const doSearch = useCallback((q) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    searchArticles(q, { per_page: 12 })
      .then(data => {
        setResults(data.items || []);
        setSelectedIdx(0);
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, []);

  const handleInput = (value) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 200);
  };

  // Navigate to article
  const goToArticle = (item) => {
    const updated = [item.title, ...recentSearches.filter(s => s !== item.title)].slice(0, MAX_RECENT);
    setRecentSearches(updated);
    saveRecent(updated);
    onClose();
    navigate(`/wiki/${item.slug}`);
  };

  // Navigate from recent search
  const searchFromRecent = (term) => {
    setQuery(term);
    doSearch(term);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIdx(prev => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIdx(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && results[selectedIdx]) {
        e.preventDefault();
        goToArticle(results[selectedIdx]);
      }
    };
    document.addEventListener('keydown', handler, true);
    return () => document.removeEventListener('keydown', handler, true);
  }, [open, results, selectedIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  const showRecent = !query.trim() && recentSearches.length > 0;

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        style={{
          position: 'fixed', inset: 0, zIndex: 99990,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          paddingTop: '12vh',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.97 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          style={{
            width: '100%', maxWidth: '600px',
            background: 'rgba(14,12,24,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 60px rgba(201,168,76,0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
            <Search size={18} className="text-amber-200/40 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleInput(e.target.value)}
              placeholder="Search the Arcane Encyclopedia..."
              className="flex-1 bg-transparent text-amber-100 text-base outline-none placeholder:text-amber-200/30"
            />
            {query && (
              <button onClick={() => { setQuery(''); setResults([]); }} className="text-amber-200/40 hover:text-amber-200">
                <X size={16} />
              </button>
            )}
            <kbd className="text-[10px] text-amber-200/30 border border-amber-200/10 rounded px-1.5 py-0.5">ESC</kbd>
          </div>

          {/* Results area */}
          <div className="max-h-[50vh] overflow-y-auto">
            {/* Recent searches */}
            {showRecent && (
              <div className="px-3 py-2">
                <p className="text-[10px] text-amber-200/30 uppercase tracking-wider px-1 mb-1">Recent Searches</p>
                {recentSearches.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => searchFromRecent(term)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-amber-200/60 hover:bg-white/5 hover:text-amber-100 transition-colors text-left"
                  >
                    <Clock size={12} className="shrink-0 opacity-40" />
                    {term}
                  </button>
                ))}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="px-4 py-8 text-center text-amber-200/40 text-sm">
                Searching...
              </div>
            )}

            {/* Results grouped by category */}
            {!loading && results.length > 0 && (
              <div className="py-1">
                {results.map((item, i) => {
                  const config = getCategoryConfig(item.category);
                  const Icon = config.icon;
                  const isSelected = i === selectedIdx;
                  return (
                    <button
                      key={item.slug}
                      onClick={() => goToArticle(item)}
                      onMouseEnter={() => setSelectedIdx(i)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        isSelected ? 'bg-amber-700/20' : 'hover:bg-white/5'
                      }`}
                    >
                      <Icon size={16} style={{ color: config.color }} className="shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isSelected ? 'text-amber-100' : 'text-amber-200/70'}`}>
                          {item.title}
                        </p>
                        <p className="text-[10px] text-amber-200/40 truncate">
                          {config.label}
                          {item.subcategory && ` / ${item.subcategory.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`}
                        </p>
                      </div>
                      {isSelected && <ArrowRight size={14} className="text-amber-200/30 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* No results */}
            {!loading && query.trim() && results.length === 0 && (
              <div className="px-4 py-8 text-center text-amber-200/40">
                <BookOpen size={24} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No articles found for &quot;{query}&quot;</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4 px-4 py-2 border-t border-white/5 text-[10px] text-amber-200/25">
            <span><kbd className="border border-amber-200/10 rounded px-1 py-0.5 mr-1">↑↓</kbd> navigate</span>
            <span><kbd className="border border-amber-200/10 rounded px-1 py-0.5 mr-1">↵</kbd> open</span>
            <span><kbd className="border border-amber-200/10 rounded px-1 py-0.5 mr-1">esc</kbd> close</span>
            {results.length > 0 && (
              <span className="ml-auto">{results.length} results</span>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
