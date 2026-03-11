import { useState, Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import CharacterView from './pages/CharacterView';
import WikiPage from './pages/WikiPage';
import WikiArticlePage from './pages/WikiArticlePage';
import UpdateScreen from './pages/UpdateScreen';

// ─── Error Boundary ──────────────────────────────────────────────────────────
// Catches any unhandled React error and shows a recovery screen instead of
// a blank white page. This is critical for production — without it, a single
// component crash kills the entire app.

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

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [updateDone, setUpdateDone] = useState(false);

  return (
    <ErrorBoundary>
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
        }}
      />

      {/* Update splash — shown before anything else on launch */}
      <AnimatePresence>
        {!updateDone && (
          <UpdateScreen
            key="update-splash"
            onDone={() => setUpdateDone(true)}
            asModal={false}
          />
        )}
      </AnimatePresence>

      {/* Main app — rendered underneath, becomes visible after update check */}
      {updateDone && (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/character/:characterId" element={<CharacterView />} />
            <Route path="/wiki" element={<WikiPage />} />
            <Route path="/wiki/:slug" element={<WikiArticlePage />} />
          </Routes>
        </BrowserRouter>
      )}
    </ErrorBoundary>
  );
}
