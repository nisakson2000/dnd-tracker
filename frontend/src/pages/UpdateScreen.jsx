import { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { APP_VERSION } from '../version';

/*
  UpdateScreen — shown at app launch before the dashboard.

  Flow:
    1. Use APP_VERSION as the installed version (no backend needed)
    2. Fetch a version manifest from a neutral URL (no repo name exposed)
    3. Compare. If same → "Up to date" → enter after 1.2s
    4. If newer → show update info → download installer asset
    5. If offline / unreachable → skip silently → enter

  The version manifest is a small JSON file hosted on a public Gist or
  static host. Format: { "version": "0.2.1", "notes": "...", "download": "https://..." }

  Props:
    onDone()   — called when the screen should close / enter app
    asModal?   — if true, renders as overlay panel instead of full screen
*/

const VERSION_MANIFEST_URL = 'https://raw.githubusercontent.com/ArsenalRX/Dnd-tracker/main/version.json';

function compareVersions(a, b) {
  const pa = a.replace(/^[vV]/, '').split('.').map(Number);
  const pb = b.replace(/^[vV]/, '').split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] || 0, nb = pb[i] || 0;
    if (nb > na) return 1;   // b is newer
    if (na > nb) return -1;  // a is newer
  }
  return 0;
}

const PHASES = {
  CHECKING:     'checking',
  UP_TO_DATE:   'up_to_date',
  UPDATE_FOUND: 'update_found',
  DOWNLOADING:  'downloading',
  DONE:         'done',
  OFFLINE:      'offline',
  ERROR:        'error',
};

export default function UpdateScreen({ onDone, asModal = false }) {
  const [phase, setPhase]               = useState(PHASES.CHECKING);
  const [latestVersion, setLatestVer]   = useState('');
  const [releaseNotes, setReleaseNotes] = useState('');
  const [downloadUrl, setDownloadUrl]   = useState('');
  const [updateError, setUpdateError]   = useState('');
  const [progress, setProgress]         = useState(0);
  const tickerRef = useRef(null);

  const currentVersion = APP_VERSION.replace(/^[vV]/, '');

  useEffect(() => { runCheck(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup interval on unmount
  useEffect(() => () => { if (tickerRef.current) clearInterval(tickerRef.current); }, []);

  const runCheck = async () => {
    setPhase(PHASES.CHECKING);
    setProgress(0);
    await delay(500);
    setProgress(33);

    let latest = null;
    let notes = '';
    let dlUrl = '';
    try {
      const signal = typeof AbortSignal !== 'undefined' && AbortSignal.timeout
        ? AbortSignal.timeout(6000)
        : (() => { const c = new AbortController(); setTimeout(() => c.abort(), 6000); return c.signal; })();
      const res = await fetch(VERSION_MANIFEST_URL, { signal });
      if (res.ok) {
        const data = await res.json();
        latest = data.version?.replace(/^[vV]/, '') || null;
        notes = data.notes || '';
        dlUrl = data.download || '';
        setLatestVer(latest || '');
        setReleaseNotes(notes);
        setDownloadUrl(dlUrl);
      }
    } catch {
      latest = null;
    }

    setProgress(66);
    await delay(200);

    if (!latest) {
      setPhase(PHASES.OFFLINE);
      await delay(900);
      onDone();
      return;
    }

    const cmp = compareVersions(currentVersion, latest);

    if (cmp <= 0) {
      // current >= latest → up to date
      setProgress(100);
      setPhase(PHASES.UP_TO_DATE);
      await delay(1200);
      onDone();
    } else {
      // latest > current → update available
      setProgress(100);
      setPhase(PHASES.UPDATE_FOUND);
    }
  };

  const applyUpdate = async () => {
    if (!downloadUrl) {
      setUpdateError('No installer found in the latest release.');
      setPhase(PHASES.ERROR);
      return;
    }

    setPhase(PHASES.DOWNLOADING);
    setProgress(0);

    try {
      tickerRef.current = setInterval(() => {
        setProgress(p => Math.min(p + 5, 90));
      }, 200);

      try {
        const { invoke } = await import('@tauri-apps/api/core');
        await invoke('plugin:shell|open', { path: downloadUrl });
      } catch {
        window.open(downloadUrl, '_blank');
      }

      if (tickerRef.current) { clearInterval(tickerRef.current); tickerRef.current = null; }
      setProgress(100);
      setPhase(PHASES.DONE);
      await delay(2000);
      onDone();
    } catch (err) {
      if (tickerRef.current) { clearInterval(tickerRef.current); tickerRef.current = null; }
      setUpdateError(err.message || 'Download failed');
      setPhase(PHASES.ERROR);
    }
  };

  const skipUpdate = () => onDone();

  const content = (
    <div style={{ textAlign: 'center', maxWidth: '420px', width: '100%', padding: '0 24px' }}>

      {/* Logo */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}
      >
        <div style={{
          width: '72px', height: '72px', borderRadius: '20px',
          background: 'linear-gradient(135deg, var(--accent), var(--accent-l))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '32px',
          boxShadow: '0 0 40px var(--accent-glow), 0 0 80px color-mix(in srgb,var(--accent) 15%,transparent)',
        }}>📖</div>
      </motion.div>

      <motion.h1
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(28px,5vw,38px)',
          fontWeight: 800,
          background: 'linear-gradient(135deg,#f0d878,#c9a84c,#f0d878)',
          backgroundSize: '200% 200%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'title-shim 4s ease-in-out infinite',
          marginBottom: '6px',
        }}
      >
        The Codex
      </motion.h1>
      <style>{`@keyframes title-shim{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}`}</style>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-mute)', marginBottom: '32px', letterSpacing: '0.1em' }}>
        v{currentVersion}
      </div>

      <AnimatePresence mode="wait">

        {/* CHECKING */}
        {phase === PHASES.CHECKING && (
          <motion.div key="checking" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <StatusIcon spinning />
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-dim)', marginTop: '14px' }}>
              Checking for updates…
            </p>
            <ProgressBar value={progress} />
          </motion.div>
        )}

        {/* OFFLINE */}
        {phase === PHASES.OFFLINE && (
          <motion.div key="offline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StatusIcon icon="📡" />
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text-dim)', marginTop: '14px' }}>
              No internet — entering app…
            </p>
          </motion.div>
        )}

        {/* UP TO DATE */}
        {phase === PHASES.UP_TO_DATE && (
          <motion.div key="uptodate" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <StatusIcon icon="✅" />
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, color: 'white', marginTop: '14px' }}>
              You're up to date
            </p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-dim)', marginTop: '4px' }}>
              Entering app…
            </p>
            <ProgressBar value={100} color="#4ade80" />
          </motion.div>
        )}

        {/* UPDATE FOUND */}
        {phase === PHASES.UPDATE_FOUND && (
          <motion.div key="found" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <StatusIcon icon="✨" glow />
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'white', marginTop: '14px' }}>
              Update available
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', margin: '8px 0 16px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-mute)' }}>v{currentVersion}</span>
              <span style={{ color: 'var(--text-mute)', fontSize: '12px' }}>→</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--accent-l)', fontWeight: 600 }}>v{latestVersion}</span>
            </div>

            {releaseNotes && (
              <div style={{
                background: 'var(--bg-panel)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '12px 14px',
                marginBottom: '18px', maxHeight: '120px', overflowY: 'auto',
                textAlign: 'left',
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-mute)', marginBottom: '8px' }}>
                  What's new
                </div>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-dim)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {releaseNotes.slice(0, 400)}{releaseNotes.length > 400 ? '…' : ''}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                onClick={skipUpdate}
                style={{ padding: '9px 18px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-panel)', border: '1px solid var(--border)', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)', fontSize: '13px', cursor: 'pointer', transition: 'all .15s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
              >
                Skip for now
              </button>
              <button
                onClick={applyUpdate}
                style={{ padding: '9px 22px', borderRadius: 'var(--radius-sm)', background: 'var(--accent-xl)', border: '1px solid color-mix(in srgb,var(--accent) 50%,transparent)', color: 'var(--accent-l)', fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all .15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'color-mix(in srgb,var(--accent) 22%,transparent)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--accent-xl)'}
              >
                Install Update
              </button>
            </div>
          </motion.div>
        )}

        {/* DOWNLOADING */}
        {phase === PHASES.DOWNLOADING && (
          <motion.div key="downloading" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <StatusIcon spinning />
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, color: 'white', marginTop: '14px' }}>
              Downloading update…
            </p>
            <ProgressBar value={progress} animated />
          </motion.div>
        )}

        {/* DONE */}
        {phase === PHASES.DONE && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <StatusIcon icon="🎉" glow />
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'white', marginTop: '14px' }}>
              Update v{latestVersion} downloading
            </p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-dim)', marginTop: '4px' }}>
              Run the installer when it finishes to update.
            </p>
            <ProgressBar value={100} color="#4ade80" />
          </motion.div>
        )}

        {/* ERROR */}
        {phase === PHASES.ERROR && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StatusIcon icon="⚠️" />
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, color: '#fca5a5', marginTop: '14px' }}>
              Update failed
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-mute)', margin: '8px auto', maxWidth: '300px', lineHeight: 1.5 }}>
              {updateError}
            </p>
            <button
              onClick={skipUpdate}
              style={{ marginTop: '12px', padding: '9px 22px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-panel)', border: '1px solid var(--border)', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)', fontSize: '13px', cursor: 'pointer' }}
            >
              Enter app anyway
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );

  if (asModal) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}
        onClick={e => { if (e.target === e.currentTarget && phase !== PHASES.DOWNLOADING) onDone(); }}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          style={{ background: '#09090f', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '40px 32px', maxWidth: '440px', width: '100%', margin: '0 16px', position: 'relative', overflow: 'hidden' }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,transparent,var(--accent-l),transparent)' }} />
          {phase !== PHASES.DOWNLOADING && (
            <button onClick={onDone} style={{ position: 'absolute', top: '14px', right: '14px', background: 'none', border: 'none', color: 'var(--text-mute)', cursor: 'pointer', fontSize: '16px' }}>✕</button>
          )}
          <div style={{ display: 'flex', justifyContent: 'center' }}>{content}</div>
        </motion.div>
      </motion.div>
    );
  }

  // Full-screen launch splash
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'fixed', top: 'var(--dev-banner-h, 0px)', left: 0, right: 0, bottom: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}
    >
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 70% 50% at 50% 40%, color-mix(in srgb,var(--accent) 18%,transparent) 0%,transparent 60%)' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {content}
      </div>
    </motion.div>
  );
}

// ── Helper components ────────────────────────────────────────────────────────

function StatusIcon({ icon, spinning, glow }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {spinning ? (
        <div style={{
          width: '44px', height: '44px', borderRadius: '50%',
          border: '2px solid var(--border)',
          borderTop: '2px solid var(--accent-l)',
          animation: 'spin 0.8s linear infinite',
        }} />
      ) : (
        <div style={{
          fontSize: '36px',
          filter: glow ? `drop-shadow(0 0 12px var(--accent-glow))` : 'none',
        }}>{icon}</div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function ProgressBar({ value, color, animated }) {
  return (
    <div style={{ marginTop: '18px', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
      <motion.div
        animate={{ width: `${value}%` }}
        transition={{ duration: animated ? 0.3 : 0.6, ease: 'easeOut' }}
        style={{
          height: '100%', borderRadius: '2px',
          background: color || 'linear-gradient(90deg,var(--accent),var(--accent-l))',
          position: 'relative',
        }}
      >
        {animated && (
          <div style={{ position: 'absolute', top: 0, right: 0, width: '40px', height: '100%', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.3))', animation: 'shim 1.5s infinite' }} />
        )}
      </motion.div>
      <style>{`@keyframes shim{0%,100%{opacity:0}50%{opacity:1}}`}</style>
    </div>
  );
}

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}
