import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, BookOpen, ExternalLink, ArrowRight, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GLOSSARY } from '../data/helpText';

const RECENT_KEY = 'codex_quick_search_recent';
const MAX_RECENT = 8;
const MAX_RESULTS = 12;

function loadRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); }
  catch { return []; }
}

function saveRecent(items) {
  localStorage.setItem(RECENT_KEY, JSON.stringify(items.slice(0, MAX_RECENT)));
}

function highlightMatch(text, query) {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} style={{ background: 'rgba(201,168,76,0.35)', color: 'inherit', borderRadius: 2, padding: '0 1px' }}>{part}</mark>
      : part
  );
}

export default function QuickSearch({ onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recent, setRecent] = useState(loadRecent);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Search results
  const results = query.trim().length > 0
    ? GLOSSARY.filter(entry =>
        entry.term.toLowerCase().includes(query.toLowerCase()) ||
        entry.definition.toLowerCase().includes(query.toLowerCase())
      ).slice(0, MAX_RESULTS)
    : [];

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selected = listRef.current.children[selectedIndex];
      if (selected) selected.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const handleSelect = useCallback((entry) => {
    // Add to recent
    const updated = [entry, ...recent.filter(r => r.term !== entry.term)].slice(0, MAX_RECENT);
    setRecent(updated);
    saveRecent(updated);
    onClose();
  }, [recent, onClose]);

  const handleKeyDown = (e) => {
    const items = query.trim() ? results : recent;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (items[selectedIndex]) handleSelect(items[selectedIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const goToWiki = () => {
    onClose();
    navigate('/wiki');
  };

  const clearRecent = () => {
    setRecent([]);
    saveRecent([]);
  };

  const displayItems = query.trim() ? results : recent;
  const showingRecent = !query.trim() && recent.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '15vh',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.2, type: 'spring', damping: 25, stiffness: 350 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 580,
          borderRadius: 16, overflow: 'hidden',
          background: 'rgba(11,9,20,0.97)',
          border: '1px solid rgba(201,168,76,0.25)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(201,168,76,0.08), 0 0 60px rgba(201,168,76,0.06)',
        }}
      >
        {/* Search input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 18px',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
        }}>
          <Search size={18} style={{ color: 'rgba(201,168,76,0.5)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search rules, conditions, mechanics..."
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: '#f0e4c8', fontSize: 15, fontFamily: 'var(--font-ui)',
              letterSpacing: '0.02em',
            }}
          />
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '2px 8px', borderRadius: 4,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            fontSize: 10, color: 'rgba(255,255,255,0.3)',
            fontFamily: 'var(--font-mono)',
          }}>
            ESC
          </div>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          style={{
            maxHeight: 380, overflowY: 'auto',
            padding: displayItems.length > 0 ? '6px 0' : 0,
          }}
        >
          {showingRecent && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 18px 4px',
            }}>
              <span style={{
                fontSize: 10, fontFamily: 'var(--font-heading)', letterSpacing: '0.12em',
                textTransform: 'uppercase', color: 'rgba(200,175,130,0.3)',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <Clock size={10} /> Recent
              </span>
              <button
                onClick={clearRecent}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 10, color: 'rgba(200,175,130,0.25)',
                  fontFamily: 'var(--font-ui)',
                }}
              >
                Clear
              </button>
            </div>
          )}

          {displayItems.map((entry, i) => (
            <div
              key={entry.term}
              onClick={() => handleSelect(entry)}
              onMouseEnter={() => setSelectedIndex(i)}
              style={{
                padding: '10px 18px',
                cursor: 'pointer',
                background: i === selectedIndex ? 'rgba(201,168,76,0.08)' : 'transparent',
                borderLeft: i === selectedIndex ? '2px solid rgba(201,168,76,0.5)' : '2px solid transparent',
                transition: 'all 0.1s',
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3,
              }}>
                <span style={{
                  fontFamily: 'var(--font-heading)', fontSize: 13,
                  color: i === selectedIndex ? '#f0e4c8' : 'rgba(200,175,130,0.8)',
                  fontWeight: 600,
                }}>
                  {highlightMatch(entry.term, query)}
                </span>
                <span style={{
                  fontSize: 9, padding: '1px 6px', borderRadius: 4,
                  background: 'rgba(201,168,76,0.08)',
                  border: '1px solid rgba(201,168,76,0.15)',
                  color: 'rgba(201,168,76,0.5)',
                  fontFamily: 'var(--font-heading)', letterSpacing: '0.05em',
                }}>
                  {entry.category}
                </span>
              </div>
              <div style={{
                fontSize: 12, color: 'rgba(200,175,130,0.45)',
                lineHeight: 1.5, maxHeight: 36, overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {highlightMatch(entry.definition, query)}
              </div>
            </div>
          ))}

          {query.trim() && results.length === 0 && (
            <div style={{
              padding: '24px 18px', textAlign: 'center',
              color: 'rgba(200,175,130,0.3)', fontSize: 13,
              fontFamily: 'var(--font-ui)',
            }}>
              No rules found for "{query}"
            </div>
          )}

          {!query.trim() && recent.length === 0 && (
            <div style={{
              padding: '24px 18px', textAlign: 'center',
              color: 'rgba(200,175,130,0.25)', fontSize: 12,
              fontFamily: 'var(--font-ui)', lineHeight: 1.6,
            }}>
              Type to search rules, conditions, and mechanics.
              <br />
              <span style={{ fontSize: 11, color: 'rgba(200,175,130,0.15)' }}>
                Use arrow keys to navigate, Enter to select
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 18px',
          borderTop: '1px solid rgba(201,168,76,0.08)',
          background: 'rgba(0,0,0,0.2)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            fontSize: 10, color: 'rgba(200,175,130,0.25)',
            fontFamily: 'var(--font-ui)',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ padding: '1px 4px', borderRadius: 3, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-mono)', fontSize: 9 }}>↑↓</span>
              Navigate
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ padding: '1px 4px', borderRadius: 3, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-mono)', fontSize: 9 }}>↵</span>
              Select
            </span>
          </div>
          <button
            onClick={goToWiki}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'none', border: '1px solid rgba(139,92,246,0.2)',
              borderRadius: 6, padding: '4px 12px', cursor: 'pointer',
              fontSize: 10, color: 'rgba(139,92,246,0.6)',
              fontFamily: 'var(--font-heading)', letterSpacing: '0.05em',
              transition: 'all 0.15s',
            }}
          >
            <BookOpen size={10} /> Full Encyclopedia <ExternalLink size={8} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
