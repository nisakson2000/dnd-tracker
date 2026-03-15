import { useState, useEffect, useRef, useCallback, useMemo, Component, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { invoke } from '@tauri-apps/api/core';
import { Search, Wand2, Sword, Users, ScrollText, BookOpen, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { ModeProvider, useAppMode } from './contexts/ModeContext';
import { SessionProvider } from './contexts/SessionContext';
import { useDevUpdateCheck } from './hooks/useDevUpdateCheck';
import { APP_VERSION } from './version';
import ModeSelect from './pages/ModeSelect';

// Heavy pages — lazy loaded for smaller initial bundle
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CharacterView = lazy(() => import('./pages/CharacterView'));
const WikiPage = lazy(() => import('./pages/WikiPage'));
const WikiArticlePage = lazy(() => import('./pages/WikiArticlePage'));
const CharacterSetup = lazy(() => import('./pages/CharacterSetup'));
import BootupVideo from './components/BootupVideo';
import SessionMonitor from './components/SessionMonitor';

// Lazy-loaded standalone pages
const UpdatesPage = lazy(() => import('./pages/UpdatesPage'));
// DM & Player session pages — lazy loaded
const DMCampaignList = lazy(() => import('./pages/DMCampaignList'));
const DMLobby = lazy(() => import('./pages/DMLobby'));
const DMSession = lazy(() => import('./pages/DMSession'));
const PlayerJoin = lazy(() => import('./pages/PlayerJoin'));
const PlayerSession = lazy(() => import('./pages/PlayerSession'));

// Dev-only components — lazy loaded, tree-shaken in production
const DevToolsPanel = import.meta.env.DEV
  ? lazy(() => import('./dev/DevToolsPanel'))
  : () => null;
const HotReloadIndicator = import.meta.env.DEV
  ? lazy(() => import('./dev/HotReloadIndicator'))
  : () => null;
const DevDashboard = import.meta.env.DEV
  ? lazy(() => import('./pages/DevDashboard'))
  : () => null;

// ─── Error Boundary ──────────────────────────────────────────────────────────

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('The Codex crashed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#04040b', fontFamily: 'var(--font-ui, "DM Sans", sans-serif)',
          border: '3px solid #ef4444',
        }}>
          <div style={{ textAlign: 'center', maxWidth: '420px', padding: '0 24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📖</div>
            <h1 style={{
              fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: '28px', fontWeight: 700,
              color: '#fca5a5', marginBottom: '8px',
              textShadow: '0 0 20px rgba(239,68,68,0.3)',
            }}>
              Something went wrong
            </h1>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '24px' }}>
              The Codex encountered an unexpected error. Your character data is safe — click below to reload.
            </p>
            {this.state.error && (
              <pre style={{
                fontSize: '12px', color: '#fca5a5', background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', padding: '12px',
                marginBottom: '20px', textAlign: 'left', overflow: 'auto', maxHeight: '160px',
                fontFamily: 'var(--font-mono, monospace)',
              }}>
                {this.state.error.message || 'Unknown error'}
                {this.state.error.stack && (
                  '\n\n' + this.state.error.stack
                )}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 28px', borderRadius: '8px', border: '1px solid rgba(201,168,76,0.4)',
                background: 'rgba(201,168,76,0.1)', color: '#c9a84c', fontSize: '14px', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'var(--font-ui, sans-serif)',
              }}
            >
              Reload The Codex
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ─── Dev Banner ─────────────────────────────────────────────────────────────
// Rendered as a top-level fixed element, completely independent of all other
// screens (UpdateScreen, ModeSelect, Dashboard, CharacterView). Always on top.

const DEV_BANNER_HEIGHT = 24;
const DEV_BANNER_HEIGHT_UPDATE = 36;

function DevBanner({ onOpenDevSettings }) {
  const {
    hasUpdate, updateInfo, pulling, pullUpdates, peers,
    diffPreview, conflictInfo, canRollback, rollbackUpdate,
  } = useDevUpdateCheck();
  const [showDiffTooltip, setShowDiffTooltip] = useState(false);
  const tooltipRef = useRef(null);

  const height = hasUpdate ? DEV_BANNER_HEIGHT_UPDATE : DEV_BANNER_HEIGHT;

  // Set CSS variable so all fixed-position pages can offset themselves
  useEffect(() => {
    document.documentElement.style.setProperty('--dev-banner-h', `${height}px`);
    return () => document.documentElement.style.setProperty('--dev-banner-h', '0px');
  }, [height]);

  if (!import.meta.env.DEV) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99999,
      height: `${height}px`,
      background: hasUpdate
        ? 'linear-gradient(90deg, #b45309, #92400e)'
        : 'linear-gradient(90deg, #7c3aed, #6d28d9)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
      fontFamily: '"DM Sans", sans-serif',
      fontSize: hasUpdate ? '12px' : '10px',
      fontWeight: 600,
      color: 'rgba(255,255,255,0.9)',
      letterSpacing: '0.04em',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    }}>
      {/* Dev settings wrench icon — leftmost */}
      <button
        onClick={onOpenDevSettings}
        style={{
          position: 'absolute', left: '8px',
          width: 20, height: 20, borderRadius: 4,
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
          color: 'rgba(255,255,255,0.8)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '11px', lineHeight: 1, padding: 0,
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        title="Dev Settings"
      >
        &#x2699;
      </button>

      {/* Dev count + sync status */}
      {(() => {
        const devCount = peers.length + 1;
        const allSynced = peers.length > 0 && peers.every(p => p.version === APP_VERSION.replace('V', ''));
        return (
          <span
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              position: 'absolute', left: '36px', fontSize: '10px',
              cursor: peers.length > 0 ? 'help' : 'default',
            }}
            title={`You: v${APP_VERSION.replace('V', '')}` + (peers.length > 0
              ? '\n' + peers.map(p => `${p.name} (v${p.version || '?'})${p.active_section ? ': editing ' + p.active_section : ''}`).join('\n')
              : '\nNo other devs detected')}
          >
            <span style={{ color: allSynced ? '#4ade80' : '#fbbf24', fontSize: '8px' }}>&#x25CF;</span>
            <span style={{ opacity: 0.9 }}>
              {devCount} dev{devCount !== 1 ? 's' : ''}
            </span>
            {allSynced && (
              <span style={{
                color: '#4ade80', fontWeight: 700, fontSize: '9px',
                padding: '1px 6px', borderRadius: 4,
                background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)',
              }}>
                builds synced
              </span>
            )}
            {peers.length > 0 && !allSynced && (
              <span style={{
                color: '#fbbf24', fontWeight: 700, fontSize: '9px',
                padding: '1px 6px', borderRadius: 4,
                background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.25)',
              }}>
                version mismatch
              </span>
            )}
          </span>
        );
      })()}

      {/* Rollback button — right side, only shows for 5 min after pull */}
      {canRollback && !hasUpdate && (
        <button
          onClick={rollbackUpdate}
          style={{
            position: 'absolute', right: '12px',
            padding: '2px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
            background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)',
            color: '#fca5a5', cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.35)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
          title="Revert last pull (git reset --hard HEAD~1)"
        >
          Rollback
        </button>
      )}

      {hasUpdate ? (
        <>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '14px' }}>&#x26A1;</span>
            Update available: {updateInfo?.commit_message || updateInfo?.remote_sha}
          </span>

          {/* Diff preview toggle */}
          {diffPreview && diffPreview.file_count > 0 && (
            <span
              ref={tooltipRef}
              style={{
                position: 'relative', cursor: 'pointer',
                opacity: 0.8, fontSize: '10px', textDecoration: 'underline',
              }}
              onMouseEnter={() => setShowDiffTooltip(true)}
              onMouseLeave={() => setShowDiffTooltip(false)}
              onClick={() => setShowDiffTooltip(prev => !prev)}
            >
              {diffPreview.file_count} file{diffPreview.file_count !== 1 ? 's' : ''} changed
              {showDiffTooltip && (
                <div style={{
                  position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                  marginTop: '8px', padding: '10px 14px', borderRadius: '8px',
                  background: '#1a1520', border: '1px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  whiteSpace: 'pre', textAlign: 'left',
                  fontSize: '11px', fontWeight: 400, fontFamily: 'monospace',
                  color: 'rgba(255,255,255,0.8)', minWidth: '280px', maxWidth: '500px',
                  maxHeight: '300px', overflowY: 'auto', zIndex: 100000,
                  lineHeight: 1.5, letterSpacing: '0',
                }}>
                  {diffPreview.diff_stat || diffPreview.changed_files.join('\n')}
                </div>
              )}
            </span>
          )}

          {/* Conflict warning */}
          {conflictInfo && conflictInfo.conflict_count > 0 && (
            <span style={{
              background: 'rgba(239,68,68,0.25)', border: '1px solid rgba(239,68,68,0.4)',
              borderRadius: '4px', padding: '1px 8px', fontSize: '10px',
              color: '#fca5a5', fontWeight: 700,
            }}
              title={`Potential conflicts:\n${conflictInfo.conflict_files.join('\n')}`}
            >
              {conflictInfo.conflict_count} file{conflictInfo.conflict_count !== 1 ? 's' : ''} may conflict
            </span>
          )}

          {updateInfo?.has_local_changes && (
            <span style={{ opacity: 0.7, fontSize: '10px' }}>(local changes will be stashed)</span>
          )}
          <button
            onClick={pullUpdates}
            disabled={pulling}
            style={{
              padding: '2px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 700,
              background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
              color: 'white', cursor: pulling ? 'wait' : 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { if (!pulling) e.currentTarget.style.background = 'rgba(255,255,255,0.3)'; }}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          >
            {pulling ? 'Pulling...' : 'Pull & Reload'}
          </button>
        </>
      ) : (
        <>
          <span style={{ opacity: 0.8 }}>DEV BUILD</span>
          {updateInfo?.local_ahead && (
            <span style={{ opacity: 0.6, fontSize: '9px', marginLeft: '4px' }}>
              (you have unpushed commits)
            </span>
          )}
        </>
      )}
    </div>
  );
}

// ─── Command Palette (Ctrl+K) ────────────────────────────────────────────────

const PALETTE_CATEGORIES = [
  { key: 'spells',   label: 'Spells',   icon: Wand2,      color: '#a78bfa', section: 'spellbook', command: 'get_spells',          nameField: 'name',  subtitleField: (i) => `Level ${i.level} ${i.school}` },
  { key: 'items',    label: 'Items',    icon: Sword,      color: '#f59e0b', section: 'inventory', command: 'get_items',           nameField: 'name',  subtitleField: (i) => i.item_type || 'Item' },
  { key: 'npcs',     label: 'NPCs',     icon: Users,      color: '#34d399', section: 'npcs',      command: 'get_npcs',            nameField: 'name',  subtitleField: (i) => i.role || i.location || '' },
  { key: 'quests',   label: 'Quests',   icon: ScrollText, color: '#fb923c', section: 'quests',    command: 'get_quests',          nameField: 'title', subtitleField: (i) => i.status || '' },
  { key: 'journal',  label: 'Journal',  icon: BookOpen,   color: '#60a5fa', section: 'journal',   command: 'get_journal_entries',  nameField: 'title', subtitleField: (i) => i.ingame_date || i.real_date || '' },
  { key: 'lore',     label: 'Lore',     icon: BookOpen,   color: '#c084fc', section: 'lore',      command: 'get_lore_notes',      nameField: 'title', subtitleField: (i) => i.category || '' },
  { key: 'features', label: 'Features', icon: Sparkles,   color: '#fbbf24', section: 'features',  command: 'get_features',        nameField: 'name',  subtitleField: (i) => i.source || i.feature_type || '' },
];

const RECENT_SEARCHES_KEY = 'codex-command-palette-recent';
const MAX_RECENT = 8;

function fuzzyMatch(text, query) {
  if (!query) return true;
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  // Direct substring match
  if (lower.includes(q)) return true;
  // Fuzzy: all query chars appear in order
  let qi = 0;
  for (let i = 0; i < lower.length && qi < q.length; i++) {
    if (lower[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

function fuzzyScore(text, query) {
  if (!query) return 0;
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  // Exact start = best
  if (lower.startsWith(q)) return 3;
  // Contains substring
  if (lower.includes(q)) return 2;
  // Fuzzy match
  return 1;
}

function CommandPalette({ characterId }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [cache, setCache] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [recentSearches, setRecentSearches] = useState(() => {
    try { return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]'); } catch { return []; }
  });
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const overlayRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract characterId from URL if not passed
  const charId = characterId || (() => {
    const m = location.pathname.match(/\/character\/([^/]+)/);
    return m ? m[1] : null;
  })();

  // Open / close handlers
  const closePalette = useCallback(() => {
    setOpen(false);
    setQuery('');
    setSelectedIdx(0);
  }, []);

  // Global Ctrl+K listener
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        e.stopPropagation();
        setOpen(prev => {
          if (prev) return false;
          setQuery('');
          setSelectedIdx(0);
          return true;
        });
      }
    };
    document.addEventListener('keydown', handler, true);
    return () => document.removeEventListener('keydown', handler, true);
  }, []);

  // Auto-focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Fetch and cache data when opened
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!open || !charId) return;
    if (Object.keys(cache).length > 0) return; // already cached

    let cancelled = false;
    setLoading(true);

    Promise.allSettled(
      PALETTE_CATEGORIES.map(cat =>
        invoke(cat.command, { characterId: charId })
          .then(data => ({ key: cat.key, data }))
          .catch(() => ({ key: cat.key, data: [] }))
      )
    ).then(results => {
      if (cancelled) return;
      const newCache = {};
      results.forEach(r => {
        if (r.status === 'fulfilled') {
          newCache[r.value.key] = r.value.data;
        }
      });
      setCache(newCache);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [open, charId]); // eslint-disable-line react-hooks/exhaustive-deps
  /* eslint-enable react-hooks/set-state-in-effect */

  // Invalidate cache when palette closes (so next open gets fresh data)
  useEffect(() => {
    if (!open) setCache({}); // eslint-disable-line react-hooks/set-state-in-effect
  }, [open]);

  // Build filtered results
  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    const groups = [];
    for (const cat of PALETTE_CATEGORIES) {
      const items = cache[cat.key] || [];
      const matched = items
        .filter(item => fuzzyMatch(item[cat.nameField] || '', query))
        .map(item => ({
          ...item,
          _name: item[cat.nameField] || '',
          _subtitle: cat.subtitleField(item),
          _category: cat,
          _score: fuzzyScore(item[cat.nameField] || '', query),
        }))
        .sort((a, b) => b._score - a._score)
        .slice(0, 6);
      if (matched.length > 0) {
        groups.push({ category: cat, items: matched });
      }
    }
    return groups;
  }, [query, cache]);

  const flatResults = useMemo(() => {
    const flat = [];
    filteredResults.forEach(group => {
      group.items.forEach(item => flat.push(item));
    });
    return flat;
  }, [filteredResults]);

  // Reset selectedIdx when results change
  useEffect(() => {
    setSelectedIdx(0); // eslint-disable-line react-hooks/set-state-in-effect
  }, [query]);

  // Select a result: navigate to section, dispatch highlight event, save recent
  const selectResult = useCallback((item) => {
    const section = item._category.section;
    const name = item._name;

    // Save to recent searches
    const updated = [
      { name, section, categoryKey: item._category.key, categoryLabel: item._category.label },
      ...recentSearches.filter(r => !(r.name === name && r.section === section)),
    ].slice(0, MAX_RECENT);
    setRecentSearches(updated);
    try { localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated)); } catch { /* ignore storage errors */ }

    closePalette();

    // Navigate to character page with section + highlight
    if (charId) {
      const targetPath = `/character/${charId}`;
      // Dispatch a custom event that CharacterView can listen for
      window.dispatchEvent(new CustomEvent('codex-command-navigate', {
        detail: { section, highlightId: item.id, highlightName: name },
      }));
      // If we're not on the character page, navigate there
      if (!location.pathname.startsWith(targetPath)) {
        navigate(targetPath, { state: { section, highlightId: item.id, highlightName: name } });
      }
    }
  }, [charId, navigate, location, closePalette, recentSearches]);

  // Click recent item
  const selectRecent = useCallback((recent) => {
    closePalette();
    if (charId) {
      window.dispatchEvent(new CustomEvent('codex-command-navigate', {
        detail: { section: recent.section, highlightName: recent.name },
      }));
      const targetPath = `/character/${charId}`;
      if (!location.pathname.startsWith(targetPath)) {
        navigate(targetPath, { state: { section: recent.section, highlightName: recent.name } });
      }
    }
  }, [charId, navigate, location, closePalette]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      closePalette();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(prev => Math.min(prev + 1, flatResults.length - 1));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(prev => Math.max(prev - 1, 0));
      return;
    }
    if (e.key === 'Enter' && flatResults[selectedIdx]) {
      e.preventDefault();
      selectResult(flatResults[selectedIdx]);
    }
  }, [flatResults, selectedIdx, selectResult, closePalette]);

  // Scroll selected item into view
  useEffect(() => {
    if (!resultsRef.current) return;
    const el = resultsRef.current.querySelector(`[data-idx="${selectedIdx}"]`);
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [selectedIdx]);

  if (!open) return null;

  const showRecent = !query.trim() && recentSearches.length > 0;
  const noResults = query.trim() && flatResults.length === 0 && !loading;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) closePalette(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 99990,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '12vh',
        fontFamily: 'var(--font-ui, "DM Sans", sans-serif)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.97 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        style={{
          width: '100%', maxWidth: '580px',
          background: 'rgba(14,12,24,0.92)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), 0 0 60px rgba(124,58,237,0.08)',
          backdropFilter: 'blur(40px)',
          overflow: 'hidden',
        }}
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <Search size={18} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={charId ? 'Search spells, items, NPCs, quests...' : 'Open a character first to search'}
            disabled={!charId}
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: 'rgba(255,255,255,0.9)', fontSize: '15px',
              fontFamily: 'var(--font-ui, "DM Sans", sans-serif)',
              caretColor: '#a78bfa',
            }}
          />
          <kbd style={{
            padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
            color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            fontFamily: 'var(--font-mono, monospace)',
          }}>
            ESC
          </kbd>
        </div>

        {/* Results area */}
        <div ref={resultsRef} style={{
          maxHeight: '400px', overflowY: 'auto', padding: '8px 0',
          scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent',
        }}>
          {/* Loading state */}
          {loading && (
            <div style={{
              padding: '32px 20px', textAlign: 'center',
              color: 'rgba(255,255,255,0.3)', fontSize: '13px',
            }}>
              Loading...
            </div>
          )}

          {/* No character */}
          {!charId && !loading && (
            <div style={{
              padding: '32px 20px', textAlign: 'center',
              color: 'rgba(255,255,255,0.3)', fontSize: '13px',
            }}>
              Open a character to search across spells, items, NPCs, and more.
            </div>
          )}

          {/* Recent searches (when query is empty) */}
          {showRecent && !loading && charId && (
            <>
              <div style={{
                padding: '8px 20px 4px', fontSize: '10px', fontWeight: 700,
                color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <Clock size={11} />
                Recent Searches
              </div>
              {recentSearches.map((recent, i) => (
                <button
                  key={`${recent.name}-${recent.section}-${i}`}
                  onClick={() => selectRecent(recent)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 20px', background: 'none', border: 'none',
                    cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s',
                    color: 'rgba(255,255,255,0.7)', fontSize: '13px',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  <Clock size={14} style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{recent.name}</span>
                  <span style={{
                    fontSize: '11px', color: 'rgba(255,255,255,0.2)',
                    padding: '1px 8px', borderRadius: '4px',
                    background: 'rgba(255,255,255,0.04)',
                  }}>
                    {recent.categoryLabel}
                  </span>
                  <ArrowRight size={12} style={{ color: 'rgba(255,255,255,0.15)' }} />
                </button>
              ))}
            </>
          )}

          {/* Empty state when query is empty and no recent */}
          {!query.trim() && recentSearches.length === 0 && !loading && charId && (
            <div style={{
              padding: '32px 20px', textAlign: 'center',
              color: 'rgba(255,255,255,0.25)', fontSize: '13px',
            }}>
              Start typing to search across all your character data.
            </div>
          )}

          {/* No results */}
          {noResults && (
            <div style={{
              padding: '32px 20px', textAlign: 'center',
              color: 'rgba(255,255,255,0.3)', fontSize: '13px',
            }}>
              No results for "<span style={{ color: 'rgba(255,255,255,0.5)' }}>{query}</span>"
            </div>
          )}

          {/* Grouped results */}
          {!loading && filteredResults.map((group) => {
            const Icon = group.category.icon;
            const catColor = group.category.color;
            return (
              <div key={group.category.key}>
                <div style={{
                  padding: '10px 20px 4px', fontSize: '10px', fontWeight: 700,
                  color: catColor, textTransform: 'uppercase', letterSpacing: '0.08em',
                  display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.8,
                }}>
                  <Icon size={12} />
                  {group.category.label}
                </div>
                {group.items.map((item) => {
                  const globalIdx = flatResults.indexOf(item);
                  const isSelected = globalIdx === selectedIdx;
                  return (
                    <button
                      key={`${group.category.key}-${item.id}`}
                      data-idx={globalIdx}
                      onClick={() => selectResult(item)}
                      onMouseEnter={() => setSelectedIdx(globalIdx)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '10px 20px', border: 'none', cursor: 'pointer',
                        textAlign: 'left', transition: 'background 0.08s',
                        background: isSelected ? 'rgba(167,139,250,0.1)' : 'none',
                        borderLeft: isSelected ? `2px solid ${catColor}` : '2px solid transparent',
                        fontFamily: 'var(--font-ui, "DM Sans", sans-serif)',
                      }}
                    >
                      <Icon size={16} style={{
                        color: catColor, opacity: isSelected ? 1 : 0.5, flexShrink: 0,
                        transition: 'opacity 0.1s',
                      }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '13px', fontWeight: 500,
                          color: isSelected ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          transition: 'color 0.1s',
                        }}>
                          {item._name}
                        </div>
                        {item._subtitle && (
                          <div style={{
                            fontSize: '11px', color: 'rgba(255,255,255,0.3)',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {item._subtitle}
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <ArrowRight size={14} style={{ color: catColor, opacity: 0.6, flexShrink: 0 }} />
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer hint */}
        {charId && (
          <div style={{
            padding: '10px 20px', borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', alignItems: 'center', gap: '16px',
            fontSize: '11px', color: 'rgba(255,255,255,0.2)',
          }}>
            <span><kbd style={{ padding: '1px 5px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '10px' }}>&#x2191;&#x2193;</kbd> navigate</span>
            <span><kbd style={{ padding: '1px 5px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '10px' }}>&#x23CE;</kbd> open</span>
            <span><kbd style={{ padding: '1px 5px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '10px' }}>esc</kbd> close</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}


// ─── Navigation Bridge ──────────────────────────────────────────────────────
// Registers react-router navigate with ModeContext so mode changes can trigger navigation
function NavigationBridge() {
  const navigate = useNavigate();
  const { mode, registerNavigate } = useAppMode();
  const didInitialNav = useRef(false);

  useEffect(() => {
    registerNavigate(navigate);
  }, [navigate, registerNavigate]);

  // On first mount, always navigate to the correct starting route for the mode
  useEffect(() => {
    if (didInitialNav.current) return;
    didInitialNav.current = true;
    // Both modes start at Dashboard — DM accesses campaigns via sidebar
    navigate('/', { replace: true });
  }, [mode, navigate]);

  return null;
}

// ─── App ─────────────────────────────────────────────────────────────────────

// ─── Dev Sync Gate ──────────────────────────────────────────────────────────
// On dev startup, checks git for upstream changes and forces a pull before
// the app can proceed. Prevents 2 devs from diverging.

function DevSyncGate({ onReady }) {
  const [status, setStatus] = useState('checking'); // checking | pulling | conflict | ready
  const [info, setInfo] = useState(null);
  const triedRef = useRef(false);

  useEffect(() => {
    if (triedRef.current) return;
    triedRef.current = true;

    (async () => {
      try {
        const result = await invoke('check_git_updates');
        if (!result.has_update) {
          setStatus('ready');
          onReady();
          return;
        }

        setInfo(result);
        setStatus('pulling');

        const pullResult = await invoke('dev_smart_pull');
        if (!pullResult.success) {
          setStatus('conflict');
          setInfo(pullResult);
          return;
        }

        // Store success for post-reload toast
        localStorage.setItem('dev-update-result', JSON.stringify({
          success: true,
          message: `Startup sync: ${pullResult.message || 'Pulled latest changes'}`,
          action: pullResult.action || 'clean_rebase',
        }));
        window.location.reload();
      } catch (err) {
        console.warn('[dev-sync-gate] Check failed, proceeding anyway:', err);
        setStatus('ready');
        onReady();
      }
    })();
  }, [onReady]);

  if (status === 'ready') return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99990,
      background: 'var(--bg, #04040b)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '16px',
      fontFamily: 'var(--font-ui, "DM Sans", sans-serif)',
      paddingTop: 'var(--dev-banner-h, 0px)',
    }}>
      {status === 'checking' && (
        <>
          <div style={{ fontSize: '14px', color: 'var(--text-dim, #aaa)' }}>
            Checking for upstream changes...
          </div>
        </>
      )}
      {status === 'pulling' && (
        <>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            border: '3px solid rgba(124,58,237,0.2)',
            borderTopColor: '#7c3aed',
            animation: 'spin 0.8s linear infinite',
          }} />
          <div style={{ fontSize: '14px', color: '#c084fc', fontWeight: 600 }}>
            Syncing with remote...
          </div>
          {info?.commit_message && (
            <div style={{ fontSize: '12px', color: 'var(--text-mute, #666)', maxWidth: '400px', textAlign: 'center' }}>
              Pulling: &ldquo;{info.commit_message}&rdquo;
            </div>
          )}
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </>
      )}
      {status === 'conflict' && (
        <>
          <div style={{ fontSize: '16px', color: '#ef4444', fontWeight: 700 }}>
            Merge Conflict
          </div>
          <div style={{
            fontSize: '12px', color: 'var(--text-dim, #aaa)',
            maxWidth: '480px', textAlign: 'center', lineHeight: 1.6,
          }}>
            Could not auto-merge upstream changes. Conflicting files:
          </div>
          <div style={{
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '8px', padding: '12px 16px', maxWidth: '480px',
            fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: '#fca5a5',
          }}>
            {(info?.conflict_files || info?.overlapping_files || []).map((f, i) => (
              <div key={i}>{f}</div>
            ))}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-mute)', marginTop: '8px' }}>
            Resolve conflicts in your terminal, then restart.
          </div>
          <button
            onClick={() => { setStatus('ready'); onReady(); }}
            style={{
              marginTop: '8px', padding: '8px 20px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-dim)', fontSize: '12px', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'var(--font-ui)',
            }}
          >
            Skip & Continue Anyway
          </button>
        </>
      )}
    </div>
  );
}

function AppContent() {
  const [bootupDone, setBootupDone] = useState(false);
  const [syncDone, setSyncDone] = useState(!import.meta.env.DEV);
  const [updateDone, setUpdateDone] = useState(true); // Tauri updater handles updates via Dashboard banner now
  const { mode } = useAppMode();
  const handleSyncReady = useCallback(() => setSyncDone(true), []);

  // Flush any queued bug reports / feature requests on startup
  useEffect(() => {
    invoke('flush_pending_reports').then(result => {
      if (result?.flushed > 0) {
        console.log(`[Reports] Flushed ${result.flushed} queued report(s) to GitHub`);
      }
    }).catch(() => {}); // Silent — no internet is fine
  }, []);

  return (
    <>
      {/* Background error monitor — auto-reports crashes to GitHub */}
      <SessionMonitor />

      {/* Ambient background effects */}
      <div className="ambient" />
      <div className="ambient-noise" />

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#1a1520', color: '#e2e0d8', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-ui, "DM Sans", sans-serif)', fontSize: '13px' },
        }}
        containerStyle={{ bottom: 20, right: 20 }}
        gutter={8}
      />

      {/* Step 0: Bootup video */}
      {!bootupDone && <BootupVideo onDone={() => setBootupDone(true)} />}

      {/* Step 0.5: Dev sync gate — force pull if behind remote (dev builds only) */}
      {import.meta.env.DEV && bootupDone && !syncDone && <DevSyncGate onReady={handleSyncReady} />}

      {/* Mode selection (if no mode chosen yet) */}
      {syncDone && updateDone && !mode && <ModeSelect />}

      {/* Step 3: Main app (once mode is selected) */}
      {syncDone && updateDone && mode && (
        <BrowserRouter>
          <NavigationBridge />
          <SessionProvider>
            <CommandPalette />
            <ErrorBoundary>
              <Suspense fallback={null}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/character/:characterId" element={<CharacterView />} />
                  <Route path="/character/:characterId/setup" element={<CharacterSetup />} />
                  <Route path="/wiki" element={<WikiPage />} />
                  <Route path="/wiki/:slug" element={<WikiArticlePage />} />
                  <Route path="/updates" element={<UpdatesPage />} />
                  <Route path="/dm/campaigns" element={<Navigate to="/" replace />} />
                  <Route path="/dm/lobby/:id" element={<DMLobby />} />
                  <Route path="/dm/session/:id" element={<DMSession />} />
                  <Route path="/player/join" element={<PlayerJoin />} />
                  <Route path="/player/session" element={<PlayerSession />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </SessionProvider>
        </BrowserRouter>
      )}
    </>
  );
}

export default function App() {
  const [showDevSettings, setShowDevSettings] = useState(false);

  return (
    <>
      {/* Dev banner — completely outside ErrorBoundary/ModeProvider so it always renders on every screen */}
      {import.meta.env.DEV && <DevBanner onOpenDevSettings={() => setShowDevSettings(true)} />}

      {/* Dev tools panel — Ctrl+Shift+D to toggle */}
      {import.meta.env.DEV && (
        <Suspense fallback={null}>
          <DevToolsPanel />
          <HotReloadIndicator />
        </Suspense>
      )}

      <ErrorBoundary>
        <ModeProvider>
          {/* Dev Settings overlay — opened from wrench icon in banner */}
          {import.meta.env.DEV && (
            <AnimatePresence>
              {showDevSettings && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'fixed', inset: 0, zIndex: 99998,
                    top: 'var(--dev-banner-h, 24px)',
                    background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
                  }}
                  onClick={e => e.target === e.currentTarget && setShowDevSettings(false)}
                >
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ height: '100%', overflow: 'auto' }}
                  >
                    {/* Close button */}
                    <button
                      onClick={() => setShowDevSettings(false)}
                      style={{
                        position: 'fixed', top: 'calc(var(--dev-banner-h, 24px) + 12px)', right: '16px',
                        zIndex: 99999, width: 32, height: 32, borderRadius: 8,
                        background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                        color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '16px',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    >
                      &#x2715;
                    </button>
                    <Suspense fallback={
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-heading)' }}>
                        Loading Dev Settings...
                      </div>
                    }>
                      <DevDashboard />
                    </Suspense>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          <AppContent />
        </ModeProvider>
      </ErrorBoundary>
    </>
  );
}
