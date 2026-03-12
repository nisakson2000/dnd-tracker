import { useState, useEffect, useCallback, useRef, Component, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { ModeProvider, useAppMode } from './contexts/ModeContext';
import { useDevUpdateCheck } from './hooks/useDevUpdateCheck';
import ModeSelect from './pages/ModeSelect';
import Dashboard from './pages/Dashboard';
import CharacterView from './pages/CharacterView';
import WikiPage from './pages/WikiPage';
import WikiArticlePage from './pages/WikiArticlePage';
import UpdateScreen from './pages/UpdateScreen';
import CharacterSetup from './pages/CharacterSetup';

// Dev-only components — lazy loaded, tree-shaken in production
const DevToolsPanel = import.meta.env.DEV
  ? lazy(() => import('./dev/DevToolsPanel'))
  : () => null;
const HotReloadIndicator = import.meta.env.DEV
  ? lazy(() => import('./dev/HotReloadIndicator'))
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
        }}>
          <div style={{ textAlign: 'center', maxWidth: '420px', padding: '0 24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📖</div>
            <h1 style={{
              fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: '24px', fontWeight: 700,
              color: '#e8d9b5', marginBottom: '8px',
            }}>
              Something went wrong
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: '24px' }}>
              The Codex encountered an unexpected error. Your character data is safe — click below to reload.
            </p>
            {this.state.error && (
              <pre style={{
                fontSize: '11px', color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '12px',
                marginBottom: '20px', textAlign: 'left', overflow: 'auto', maxHeight: '120px',
                fontFamily: 'var(--font-mono, monospace)',
              }}>
                {this.state.error.message || 'Unknown error'}
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

function DevBanner() {
  const {
    hasUpdate, updateInfo, pulling, pullUpdates, peers,
    diffPreview, conflictInfo, canRollback, rollbackUpdate,
  } = useDevUpdateCheck();
  const [showDiffTooltip, setShowDiffTooltip] = useState(false);
  const tooltipRef = useRef(null);

  if (!import.meta.env.DEV) return null;

  const height = hasUpdate ? DEV_BANNER_HEIGHT_UPDATE : DEV_BANNER_HEIGHT;

  // Set CSS variable so all fixed-position pages can offset themselves
  useEffect(() => {
    document.documentElement.style.setProperty('--dev-banner-h', `${height}px`);
    return () => document.documentElement.style.setProperty('--dev-banner-h', '0px');
  }, [height]);

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
      {/* Dev count — always visible, counts you + peers */}
      <span
        style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          position: 'absolute', left: '12px', fontSize: '10px', opacity: 0.8,
          cursor: peers.length > 0 ? 'help' : 'default',
        }}
        title={peers.length > 0
          ? peers.map(p => `${p.name}${p.active_section ? ': editing ' + p.active_section : ''}`).join('\n')
          : 'Just you'}
      >
        <span style={{ color: '#4ade80', fontSize: '8px' }}>&#x25CF;</span>
        {peers.length + 1} dev{peers.length + 1 !== 1 ? 's' : ''} in app
      </span>

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

// ─── App ─────────────────────────────────────────────────────────────────────

function AppContent() {
  const [updateDone, setUpdateDone] = useState(false);
  const { mode } = useAppMode();

  return (
    <>
      {/* Ambient background effects */}
      <div className="ambient" />
      <div className="ambient-noise" />

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#09090f',
            color: 'rgba(255,255,255,0.85)',
            border: '1px solid rgba(255,255,255,0.07)',
            fontFamily: 'var(--font-ui)',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#4ade80', secondary: '#09090f' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#09090f' } },
          ariaProps: { role: 'status', 'aria-live': 'polite' },
        }}
      />

      {/* Step 1: Update splash */}
      <AnimatePresence>
        {!updateDone && (
          <UpdateScreen
            key="update-splash"
            onDone={() => setUpdateDone(true)}
            asModal={false}
          />
        )}
      </AnimatePresence>

      {/* Step 2: Mode selection (if no mode chosen yet) */}
      {updateDone && !mode && <ModeSelect />}

      {/* Step 3: Main app (once mode is selected) */}
      {updateDone && mode && (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/character/:characterId" element={<CharacterView />} />
            <Route path="/character/:characterId/setup" element={<CharacterSetup />} />
            <Route path="/wiki" element={<WikiPage />} />
            <Route path="/wiki/:slug" element={<WikiArticlePage />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default function App() {
  return (
    <>
      {/* Dev banner — completely outside ErrorBoundary/ModeProvider so it always renders on every screen */}
      <DevBanner />

      {/* Dev tools panel — Ctrl+Shift+D to toggle */}
      {import.meta.env.DEV && (
        <Suspense fallback={null}>
          <DevToolsPanel />
          <HotReloadIndicator />
        </Suspense>
      )}

      <ErrorBoundary>
        <ModeProvider>
          <AppContent />
        </ModeProvider>
      </ErrorBoundary>
    </>
  );
}
