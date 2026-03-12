import { useState, useEffect, useCallback, Component } from 'react';
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

const DEV_BANNER_HEIGHT = 24;
const DEV_BANNER_HEIGHT_UPDATE = 36;

function DevBanner({ onHeightChange }) {
  const { hasUpdate, updateInfo, pulling, pullUpdates } = useDevUpdateCheck();

  // Notify parent of height changes so padding stays in sync
  useEffect(() => {
    if (onHeightChange) onHeightChange(hasUpdate ? DEV_BANNER_HEIGHT_UPDATE : DEV_BANNER_HEIGHT);
  }, [hasUpdate, onHeightChange]);

  if (!import.meta.env.DEV) return null;

  const height = hasUpdate ? DEV_BANNER_HEIGHT_UPDATE : DEV_BANNER_HEIGHT;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      height: `${height}px`,
      background: hasUpdate
        ? 'linear-gradient(90deg, #b45309, #92400e)'
        : 'linear-gradient(90deg, #7c3aed, #6d28d9)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
      fontFamily: 'var(--font-ui, "DM Sans", sans-serif)',
      fontSize: hasUpdate ? '12px' : '10px',
      fontWeight: 600,
      color: 'rgba(255,255,255,0.9)',
      letterSpacing: '0.04em',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    }}>
      {hasUpdate ? (
        <>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '14px' }}>&#x26A1;</span>
            Update available: {updateInfo?.commit_message || updateInfo?.remote_sha}
          </span>
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
        <span style={{ opacity: 0.8 }}>DEV BUILD</span>
      )}
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

function AppContent() {
  const [updateDone, setUpdateDone] = useState(false);
  const { mode } = useAppMode();
  const [bannerHeight, setBannerHeight] = useState(import.meta.env.DEV ? DEV_BANNER_HEIGHT : 0);

  return (
    <div style={bannerHeight > 0 ? { paddingTop: `${bannerHeight}px` } : undefined}>
      {/* Dev build banner */}
      <DevBanner onHeightChange={setBannerHeight} />

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
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ModeProvider>
        <AppContent />
      </ModeProvider>
    </ErrorBoundary>
  );
}
