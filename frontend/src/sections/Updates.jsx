import { useState, useEffect, useRef, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, AlertCircle, WifiOff, Clock, ChevronDown, ChevronUp,
  ExternalLink, Download, RefreshCw, Shield, ArrowRight,
} from 'lucide-react';
import { CHANGELOG } from '../data/changelog';
import { useUpdateCheck } from '../hooks/useUpdateCheck';
import { invoke } from '@tauri-apps/api/core';

// ── Update phases ─────────────────────────────────────
const PHASE = {
  IDLE: 'idle',
  DOWNLOADING: 'downloading',
  PATCHING: 'patching',
  COMPLETE: 'complete',
  ERROR: 'error',
};

export default function Updates() {
  const {
    updateAvailable, latestVersion, checking, lastChecked,
    checkResult, checkForUpdates, currentVersion,
  } = useUpdateCheck();

  const [expandedVersion, setExpandedVersion] = useState(
    currentVersion || CHANGELOG[0]?.version || null,
  );
  const [phase, setPhase] = useState(PHASE.IDLE);
  const [progress, setProgress] = useState(0);
  const [updateError, setUpdateError] = useState('');
  const tickerRef = useRef(null);

  // Cleanup interval on unmount
  useEffect(() => () => {
    if (tickerRef.current) clearInterval(tickerRef.current);
  }, []);

  // Only show current version — full history on GitHub
  const recentVersions = CHANGELOG.filter(
    e => e.version === currentVersion || e.version === `v${currentVersion}` || `v${e.version}` === currentVersion,
  );
  const displayVersions = recentVersions.length > 0 ? recentVersions : CHANGELOG.slice(0, 1);

  // ── Install update flow ─────────────────────────────
  const installUpdate = useCallback(async () => {
    setPhase(PHASE.DOWNLOADING);
    setProgress(0);
    setUpdateError('');

    try {
      // Phase 1: Downloading
      tickerRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 65) {
            clearInterval(tickerRef.current);
            tickerRef.current = null;
            return 65;
          }
          return p + Math.random() * 4 + 1;
        });
      }, 120);

      // Fetch manifest for download URL
      const res = await fetch(
        'https://gist.githubusercontent.com/ArsenalRX/ca61bfa2b0eadf1f1e57108cbd881152/raw/version.json',
        { cache: 'no-store' },
      );
      if (!res.ok) throw new Error('Failed to fetch update manifest');
      const data = await res.json();
      const downloadUrl = data.download || '';

      if (!downloadUrl) throw new Error('No installer URL found in release manifest.');

      if (tickerRef.current) { clearInterval(tickerRef.current); tickerRef.current = null; }
      setProgress(70);

      // Phase 2: Patching (simulated — we open the installer)
      setPhase(PHASE.PATCHING);
      setProgress(70);

      tickerRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 95) {
            clearInterval(tickerRef.current);
            tickerRef.current = null;
            return 95;
          }
          return p + Math.random() * 3 + 0.5;
        });
      }, 150);

      // Open the installer
      try {
        await invoke('plugin:shell|open', { path: downloadUrl });
      } catch {
        window.open(downloadUrl, '_blank');
      }

      // Wait for visual completion
      await new Promise(r => setTimeout(r, 2000));
      if (tickerRef.current) { clearInterval(tickerRef.current); tickerRef.current = null; }
      setProgress(100);
      setPhase(PHASE.COMPLETE);
    } catch (err) {
      if (tickerRef.current) { clearInterval(tickerRef.current); tickerRef.current = null; }
      setUpdateError(err.message || 'Download failed');
      setPhase(PHASE.ERROR);
    }
  }, []);

  const resetUpdate = () => {
    setPhase(PHASE.IDLE);
    setProgress(0);
    setUpdateError('');
  };

  // ── Phase label for progress bar ────────────────────
  const phaseLabel = phase === PHASE.DOWNLOADING
    ? 'Downloading update...'
    : phase === PHASE.PATCHING
    ? 'Applying patch...'
    : phase === PHASE.COMPLETE
    ? 'Update ready!'
    : '';

  return (
    <div style={{ maxWidth: '640px' }}>
      <h2 className="font-display text-2xl text-amber-100 mb-1">Updates & Changelog</h2>
      <p className="text-sm text-amber-200/30 mb-6">Current version: {currentVersion}</p>

      {/* ── Active update flow ───────────────────────── */}
      <AnimatePresence mode="wait">
        {phase !== PHASE.IDLE && (
          <motion.div
            key="update-flow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mb-6"
          >
            <div style={{
              background: 'linear-gradient(135deg, rgba(14,12,24,0.95), rgba(20,16,32,0.95))',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '16px',
              padding: '32px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Accent line */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                background: phase === PHASE.ERROR
                  ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                  : phase === PHASE.COMPLETE
                  ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                  : 'linear-gradient(90deg, transparent, rgba(201,168,76,0.8), transparent)',
              }} />

              <div style={{ textAlign: 'center' }}>
                {/* Status icon */}
                <div style={{ marginBottom: '16px' }}>
                  {phase === PHASE.COMPLETE ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <CheckCircle size={48} style={{ color: '#4ade80' }} />
                    </motion.div>
                  ) : phase === PHASE.ERROR ? (
                    <AlertCircle size={48} style={{ color: '#ef4444' }} />
                  ) : (
                    <div style={{
                      width: '48px', height: '48px', margin: '0 auto',
                      borderRadius: '50%',
                      border: '3px solid rgba(201,168,76,0.15)',
                      borderTop: '3px solid #c9a84c',
                      animation: 'update-spin 0.8s linear infinite',
                    }} />
                  )}
                </div>

                {/* Phase text */}
                <h3 className="font-display text-lg text-amber-100 mb-1">
                  {phase === PHASE.COMPLETE
                    ? 'Update Ready'
                    : phase === PHASE.ERROR
                    ? 'Update Failed'
                    : phaseLabel}
                </h3>

                {phase === PHASE.COMPLETE && (
                  <p className="text-xs text-amber-200/40 mb-4">
                    The installer has been downloaded. Run it to complete the update to v{latestVersion}.
                  </p>
                )}

                {phase === PHASE.ERROR && (
                  <>
                    <p className="text-xs text-red-400/70 mb-3 font-mono">{updateError}</p>
                    <button
                      onClick={resetUpdate}
                      className="text-xs px-4 py-2 rounded-lg font-medium transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.6)',
                        cursor: 'pointer',
                      }}
                    >
                      Try Again
                    </button>
                  </>
                )}

                {(phase === PHASE.DOWNLOADING || phase === PHASE.PATCHING) && (
                  <>
                    {/* Version badge */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
                      <span className="font-mono text-xs text-amber-200/40">{currentVersion}</span>
                      <ArrowRight size={12} style={{ color: 'rgba(201,168,76,0.4)' }} />
                      <span className="font-mono text-xs text-gold font-semibold">{latestVersion}</span>
                    </div>

                    {/* Progress bar */}
                    <div style={{
                      height: '6px', background: 'rgba(255,255,255,0.06)',
                      borderRadius: '3px', overflow: 'hidden', margin: '0 auto',
                      maxWidth: '320px',
                    }}>
                      <motion.div
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        style={{
                          height: '100%', borderRadius: '3px',
                          background: 'linear-gradient(90deg, #c9a84c, #f0d878)',
                          position: 'relative',
                        }}
                      >
                        <div style={{
                          position: 'absolute', top: 0, right: 0, width: '40px', height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3))',
                          animation: 'update-shimmer 1.5s infinite',
                        }} />
                      </motion.div>
                    </div>

                    <p className="text-[11px] text-amber-200/30 mt-2 font-mono">
                      {Math.round(progress)}%
                    </p>
                  </>
                )}

                {phase === PHASE.COMPLETE && (
                  <button
                    onClick={resetUpdate}
                    className="text-xs px-5 py-2.5 rounded-lg font-medium transition-all mt-2"
                    style={{
                      background: 'rgba(74,222,128,0.1)',
                      border: '1px solid rgba(74,222,128,0.25)',
                      color: '#4ade80',
                      cursor: 'pointer',
                    }}
                  >
                    Done
                  </button>
                )}
              </div>
            </div>

            <style>{`
              @keyframes update-spin { to { transform: rotate(360deg); } }
              @keyframes update-shimmer { 0%,100% { opacity: 0; } 50% { opacity: 1; } }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Update status banner ────────────────────── */}
      {phase === PHASE.IDLE && (
        <div className="mb-6">
          {checkResult === 'offline' ? (
            <div className="flex items-center gap-3 p-4 rounded-lg" style={{ background: 'rgba(251,191,36,0.04)', border: '1px solid rgba(251,191,36,0.12)' }}>
              <WifiOff size={20} className="text-amber-400/60 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-amber-200/60 font-semibold">Unable to check for updates</p>
                <p className="text-xs text-amber-200/30 mt-0.5">No internet connection. Connect to WiFi or check your network to verify you're running the latest version.</p>
              </div>
            </div>
          ) : updateAvailable ? (
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(201,168,76,0.2)' }}>
              <div className="flex items-center gap-4 p-5" style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.03))' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.08))',
                  border: '1px solid rgba(201,168,76,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Download size={22} className="text-gold" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-amber-100 font-display font-semibold">Update Available</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-amber-200/40 font-mono">{currentVersion}</span>
                    <ArrowRight size={10} style={{ color: 'rgba(201,168,76,0.4)' }} />
                    <span className="text-xs text-gold font-mono font-semibold">{latestVersion}</span>
                  </div>
                </div>
                <button
                  onClick={installUpdate}
                  style={{
                    padding: '10px 24px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.12))',
                    border: '1px solid rgba(201,168,76,0.35)',
                    color: '#f0d878',
                    fontFamily: 'var(--font-display)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(201,168,76,0.3), rgba(201,168,76,0.18))';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(201,168,76,0.15)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.12))';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Download size={14} />
                  Update Now
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 rounded-lg" style={{ background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.12)' }}>
              <Shield size={20} className="text-green-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: 'rgba(74,222,128,0.8)' }}>You're up to date</p>
                <p className="text-xs text-amber-200/30 mt-0.5">Running the latest version of The Codex.</p>
              </div>
              <button
                onClick={checkForUpdates}
                disabled={checking}
                className="flex items-center gap-1.5 text-xs text-amber-200/40 hover:text-amber-200/70 transition-colors disabled:opacity-40"
                style={{ background: 'none', border: 'none', cursor: checking ? 'wait' : 'pointer', fontFamily: 'inherit' }}
              >
                <RefreshCw size={12} className={checking ? 'animate-spin' : ''} />
                {checking ? 'Checking...' : 'Check'}
              </button>
            </div>
          )}
          {lastChecked && (
            <p className="text-[10px] text-amber-200/20 mt-2 flex items-center gap-1">
              <Clock size={9} />
              Last checked: {lastChecked.toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
            </p>
          )}
        </div>
      )}

      {/* ── Changelog ───────────────────────────────── */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-mono tracking-widest uppercase text-amber-200/25">What's New</h3>
        <button
          onClick={() => {
            try { invoke('plugin:shell|open', { path: 'https://github.com/nisakson2000/dnd-tracker/blob/main/MASTERUPDATELIST.md' }); } catch { /* non-critical */ }
          }}
          className="flex items-center gap-1 text-[10px] text-amber-200/30 hover:text-amber-200/60 transition-colors bg-transparent border-none cursor-pointer"
          style={{ fontFamily: 'inherit' }}
        >
          <ExternalLink size={10} /> Full changelog
        </button>
      </div>
      <div className="space-y-3">
        {displayVersions.map((entry) => {
          const isExpanded = expandedVersion === entry.version;
          const isCurrent = entry.version === currentVersion || entry.version === `v${currentVersion}` || `v${entry.version}` === currentVersion;

          return (
            <div
              key={entry.version}
              className="rounded-lg border overflow-hidden"
              style={{
                borderColor: isCurrent ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)',
                background: isCurrent ? 'rgba(201,168,76,0.03)' : 'rgba(255,255,255,0.02)',
              }}
            >
              <button
                onClick={() => setExpandedVersion(isExpanded ? null : entry.version)}
                className="w-full flex items-center gap-3 p-4 text-left transition-colors bg-transparent border-none cursor-pointer"
                style={{ fontFamily: 'inherit' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-display font-semibold text-amber-100">{entry.version}</span>
                    <span className="text-xs text-amber-200/30">—</span>
                    <span className="text-xs text-amber-200/50">{entry.title}</span>
                    {isCurrent && (
                      <span className="text-[9px] bg-amber-500/15 text-amber-400/70 px-1.5 py-0.5 rounded font-mono">CURRENT</span>
                    )}
                  </div>
                  <p className="text-[11px] text-amber-200/25 mt-1">{entry.date}</p>
                </div>
                {isExpanded ? (
                  <ChevronUp size={14} className="text-amber-200/30 flex-shrink-0" />
                ) : (
                  <ChevronDown size={14} className="text-amber-200/30 flex-shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <ul className="px-4 pb-4 space-y-2">
                      {entry.changes.map((change, i) => (
                        <li key={i} className="flex gap-2.5 text-xs text-amber-200/50">
                          <span className="text-amber-200/20 mt-0.5 flex-shrink-0">•</span>
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
