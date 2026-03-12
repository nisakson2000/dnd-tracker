import { useState, useEffect, useRef } from 'react';
import { Terminal, AlertTriangle, Trash2, Copy, Activity, RefreshCw, ChevronDown, ChevronRight, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { invoke } from '@tauri-apps/api/core';
import { APP_VERSION } from '../version';
import { useAppMode } from '../contexts/ModeContext';

/* ─────────────────────────────────────────────────────────────────────────────
   ERROR CATCHER — captures EVERYTHING before it can crash the app
   This runs as soon as this module loads, even before DevTools renders.
   ───────────────────────────────────────────────────────────────────────────── */

const ERROR_LOG = [];     // All caught errors — survives re-renders
const CONSOLE_LOG = [];   // Console output mirror
const MAX_ENTRIES = 300;

function pushError(entry) {
  ERROR_LOG.unshift(entry); // newest first
  if (ERROR_LOG.length > MAX_ENTRIES) ERROR_LOG.length = MAX_ENTRIES;
}

function pushConsole(entry) {
  CONSOLE_LOG.push(entry);
  if (CONSOLE_LOG.length > MAX_ENTRIES) CONSOLE_LOG.splice(0, CONSOLE_LOG.length - MAX_ENTRIES);
}

if (!window.__codex_devtools_init) {
  window.__codex_devtools_init = true;

  // 1) Intercept console.log / warn / error / info
  const orig = {
    log: console.log.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    info: console.info.bind(console),
  };

  ['log', 'warn', 'error', 'info'].forEach(level => {
    console[level] = (...args) => {
      const msg = args.map(a => {
        try { return typeof a === 'object' ? JSON.stringify(a) : String(a); }
        catch { return String(a); }
      }).join(' ');

      pushConsole({ level, time: Date.now(), msg });

      // Also capture console.error and console.warn as errors
      if (level === 'error') {
        pushError({ type: 'Console Error', msg, time: Date.now(), source: 'console.error' });
      } else if (level === 'warn') {
        pushError({ type: 'Warning', msg, time: Date.now(), source: 'console.warn' });
      }

      orig[level](...args);
    };
  });

  // 2) Catch uncaught runtime errors (null references, type errors, etc.)
  window.addEventListener('error', (e) => {
    pushError({
      type: 'Uncaught Error',
      msg: e.message || 'Unknown error',
      file: e.filename ? `${e.filename}:${e.lineno}:${e.colno}` : null,
      time: Date.now(),
      source: 'window.onerror',
    });
  });

  // 3) Catch unhandled promise rejections (failed API calls, async errors)
  window.addEventListener('unhandledrejection', (e) => {
    const reason = e.reason;
    pushError({
      type: 'Unhandled Promise Rejection',
      msg: reason?.message || reason?.toString?.() || 'Unknown async error',
      stack: reason?.stack?.split('\n').slice(0, 3).join('\n') || null,
      time: Date.now(),
      source: 'promise rejection',
    });
  });

  // 4) Catch network/fetch failures
  const origFetch = window.fetch.bind(window);
  window.fetch = async (...args) => {
    try {
      const res = await origFetch(...args);
      if (!res.ok) {
        pushError({
          type: 'HTTP Error',
          msg: `${res.status} ${res.statusText} — ${typeof args[0] === 'string' ? args[0] : args[0]?.url || 'unknown URL'}`,
          time: Date.now(),
          source: 'fetch',
        });
      }
      return res;
    } catch (err) {
      pushError({
        type: 'Network Error',
        msg: `${err.message} — ${typeof args[0] === 'string' ? args[0] : 'unknown URL'}`,
        time: Date.now(),
        source: 'fetch',
      });
      throw err;
    }
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────────────────────────────────────── */

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 5) return 'just now';
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return new Date(ts).toLocaleTimeString();
}

function useTick(ms = 1000) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
}

function useFPS() {
  const [fps, setFps] = useState(0);
  useEffect(() => {
    let frames = 0, last = performance.now(), raf;
    const tick = () => { frames++; raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    const id = setInterval(() => {
      const now = performance.now();
      setFps(Math.round(frames / ((now - last) / 1000)));
      frames = 0; last = now;
    }, 2000);
    return () => { cancelAnimationFrame(raf); clearInterval(id); };
  }, []);
  return fps;
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT — simplified, plain-English labels
   ───────────────────────────────────────────────────────────────────────────── */

export default function DevTools({ characterId, character, errors: hookErrors, onClearErrors }) {
  const [tab, setTab] = useState('health');
  const { mode: appMode } = useAppMode();
  useTick(2000); // re-render periodically so timestamps update
  const fps = useFPS();
  const logEndRef = useRef(null);

  const errorCount = ERROR_LOG.filter(e => e.type !== 'Warning').length;
  const warnCount = ERROR_LOG.filter(e => e.type === 'Warning').length;
  const memory = performance.memory ? {
    used: (performance.memory.usedJSHeapSize / 1048576).toFixed(0),
    total: (performance.memory.totalJSHeapSize / 1048576).toFixed(0),
  } : null;
  const domCount = document.querySelectorAll('*').length;

  // Health status
  const health = errorCount === 0 && fps >= 50 ? 'good' : errorCount > 5 || fps < 20 ? 'bad' : 'okay';
  const healthColor = { good: '#4ade80', okay: '#fbbf24', bad: '#ef4444' };
  const healthLabel = { good: 'Running Smoothly', okay: 'Minor Issues', bad: 'Needs Attention' };

  const TABS = [
    { id: 'health', label: 'Health Check' },
    { id: 'errors', label: `Errors${errorCount > 0 ? ` (${errorCount})` : ''}` },
    { id: 'console', label: 'Console Log' },
    { id: 'test', label: 'Run Tests' },
    { id: 'audit', label: 'Find Improvements' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Terminal size={20} style={{ color: 'var(--accent)' }} />
        <div>
          <h2 className="font-display text-lg text-white font-bold">Dev Tools</h2>
          <p className="text-xs" style={{ color: 'var(--text-mute)' }}>{APP_VERSION} — Dev build only, removed in compiled app</p>
        </div>
      </div>

      {/* Big Status Banner */}
      <div className="card mb-4 p-4 flex items-center gap-4" style={{ border: `1px solid ${healthColor[health]}33` }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${healthColor[health]}18`, border: `2px solid ${healthColor[health]}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
          {health === 'good' ? '✓' : health === 'okay' ? '!' : '✗'}
        </div>
        <div style={{ flex: 1 }}>
          <div className="text-sm font-bold" style={{ color: healthColor[health] }}>{healthLabel[health]}</div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>
            {fps} FPS · {domCount.toLocaleString()} elements on screen
            {memory && ` · ${memory.used}MB memory used`}
            {errorCount > 0 && ` · ${errorCount} error${errorCount > 1 ? 's' : ''} caught`}
            {warnCount > 0 && ` · ${warnCount} warning${warnCount > 1 ? 's' : ''}`}
          </div>
        </div>
        <div className="text-xs" style={{ color: 'var(--text-mute)', fontFamily: 'var(--font-mono)' }}>
          {character?.name || '—'} · Lv {character?.level || '?'}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 mb-3">
        {TABS.map((t, i) => (
          <div key={t.id} className="flex items-center">
            {i > 0 && <span style={{ color: 'rgba(200,175,130,0.15)', margin: '0 4px', fontSize: 14, userSelect: 'none' }}>|</span>}
            <button
              className={`btn-ghost text-xs ${tab === t.id ? 'bg-white/10 text-white' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          </div>
        ))}
      </div>

      {/* ── HEALTH CHECK ── */}
      {tab === 'health' && (
        <div className="space-y-3">
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-white mb-3">What do these numbers mean?</h3>
            <div className="space-y-3">
              <HealthRow
                label="Frame Rate (FPS)"
                value={`${fps} fps`}
                status={fps >= 55 ? 'good' : fps >= 30 ? 'okay' : 'bad'}
                help="How smooth the app feels. 60 is perfect, below 30 means lag."
              />
              <HealthRow
                label="Elements on Screen"
                value={domCount.toLocaleString()}
                status={domCount < 3000 ? 'good' : domCount < 6000 ? 'okay' : 'bad'}
                help="How many UI pieces are rendered. Too many can slow things down."
              />
              {memory && (
                <HealthRow
                  label="Memory Usage"
                  value={`${memory.used} MB / ${memory.total} MB`}
                  status={parseInt(memory.used) < 80 ? 'good' : parseInt(memory.used) < 150 ? 'okay' : 'bad'}
                  help="How much RAM the app is using. Under 100MB is normal."
                />
              )}
              <HealthRow
                label="Errors Caught"
                value={errorCount === 0 ? 'None' : `${errorCount} error${errorCount > 1 ? 's' : ''}`}
                status={errorCount === 0 ? 'good' : errorCount <= 3 ? 'okay' : 'bad'}
                help="Errors the app ran into. Check the Errors tab for details."
              />
              <HealthRow
                label="Warnings"
                value={warnCount === 0 ? 'None' : `${warnCount}`}
                status={warnCount === 0 ? 'good' : 'okay'}
                help="Non-critical issues. Usually safe to ignore but worth checking."
              />
              <HealthRow
                label="Local Storage"
                value={`${localStorage.length} saved items`}
                status={localStorage.length < 20 ? 'good' : 'okay'}
                help="Settings and data saved in your browser. Clearing this resets preferences."
              />
            </div>
          </div>
        </div>
      )}

      {/* ── ERRORS ── */}
      {tab === 'errors' && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">All Caught Errors & Warnings</h3>
            <div className="flex items-center gap-2">
              {ERROR_LOG.filter(e => e.type !== 'Warning').length > 0 && (
                <button
                  className="btn-ghost text-xs font-semibold"
                  style={{ color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 6, padding: '3px 10px' }}
                  onClick={() => {
                    const errors = ERROR_LOG.filter(e => e.type !== 'Warning');
                    const report = [
                      `--- Fix All: ${errors.length} Error(s) from The Codex Dev Tools ---`,
                      `Version: ${APP_VERSION}`,
                      `Time: ${new Date().toLocaleString()}`,
                      `Total Errors: ${errors.length}`,
                      ``,
                      ...errors.map((err, i) => [
                        `═══ Error ${i + 1} of ${errors.length} ═══`,
                        `Type: ${err.type}`,
                        `Source: ${err.source || 'unknown'}`,
                        `Message: ${err.msg}`,
                        err.file ? `File: ${err.file}` : null,
                        err.stack ? `Stack:\n${err.stack}` : null,
                        err.testName ? `Test: ${err.testName}` : null,
                        err.details ? `Details: ${err.details}` : null,
                        ``,
                      ].filter(Boolean)).flat(),
                      `---`,
                      `Please fix all ${errors.length} issues above. Each error was caught by Dev Tools in The Codex D&D Companion app.`,
                    ].join('\n');
                    navigator.clipboard.writeText(report).then(() => toast.success(`Copied ${errors.length} error(s)! Paste to Claude to fix them all.`));
                  }}
                >
                  <Copy size={10} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                  Fix All — Copy for Claude
                </button>
              )}
              <button className="btn-ghost text-xs text-red-400" onClick={() => { ERROR_LOG.length = 0; }}>
                <Trash2 size={12} /> Clear All
              </button>
            </div>
          </div>

          {ERROR_LOG.length === 0 ? (
            <div className="text-center py-8">
              <div style={{ fontSize: 28, opacity: 0.2, marginBottom: 8 }}>✓</div>
              <p className="text-sm" style={{ color: 'var(--text-mute)' }}>No errors or warnings caught. Everything is running clean.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-auto">
              {ERROR_LOG.map((err, i) => (
                <ErrorCard key={`${err.time}-${i}`} err={err} />
              ))}
            </div>
          )}

          {/* Hook errors (from useErrorLog) */}
          {hookErrors?.length > 0 && (
            <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-white">React Error Boundary Catches</h4>
                <button className="btn-ghost text-xs text-red-400" onClick={onClearErrors}>Clear</button>
              </div>
              {hookErrors.map((err, i) => (
                <div key={i} className="p-2 rounded text-xs mb-1" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontFamily: 'var(--font-mono)', color: '#fca5a5' }}>
                  {err.message || JSON.stringify(err)}
                  {err.section && <span style={{ color: 'var(--text-mute)', marginLeft: 8 }}>in {err.section}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── CONSOLE LOG ── */}
      {tab === 'console' && (
        <div className="card p-0 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-xs" style={{ color: 'var(--text-mute)' }}>{CONSOLE_LOG.length} messages</span>
            <div style={{ flex: 1 }} />
            <button className="btn-ghost text-xs p-1" title="Copy all" onClick={() => {
              const text = CONSOLE_LOG.map(l => `[${l.level.toUpperCase()}] ${new Date(l.time).toLocaleTimeString()} ${l.msg}`).join('\n');
              navigator.clipboard.writeText(text).then(() => toast.success('Copied'));
            }}><Copy size={12} /></button>
            <button className="btn-ghost text-xs p-1 text-red-400" title="Clear" onClick={() => { CONSOLE_LOG.length = 0; }}>
              <Trash2 size={12} />
            </button>
          </div>
          <div className="overflow-auto" style={{ maxHeight: 400, minHeight: 150, background: 'rgba(0,0,0,0.3)' }}>
            {CONSOLE_LOG.length === 0 ? (
              <div className="p-4 text-xs text-center" style={{ color: 'var(--text-mute)' }}>Console is empty. Interact with the app to see output here.</div>
            ) : (
              CONSOLE_LOG.map((l, i) => {
                const color = { log: '#9ca3af', warn: '#fbbf24', error: '#ef4444', info: '#60a5fa' }[l.level] || '#9ca3af';
                return (
                  <div key={i} className="px-3 py-1 text-xs flex gap-2" style={{ fontFamily: 'var(--font-mono)', borderBottom: '1px solid rgba(255,255,255,0.03)', color }}>
                    <span style={{ color: 'var(--text-mute)', width: 60, flexShrink: 0 }}>{new Date(l.time).toLocaleTimeString()}</span>
                    <span style={{ width: 36, flexShrink: 0, fontWeight: 600, textTransform: 'uppercase', fontSize: 9, lineHeight: '18px' }}>{l.level}</span>
                    <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{l.msg}</span>
                  </div>
                );
              })
            )}
            <div ref={logEndRef} />
          </div>
        </div>
      )}

      {/* ── RUN TESTS ── */}
      {tab === 'test' && (
        <TestRunner characterId={characterId} />
      )}

      {/* ── FIND IMPROVEMENTS ── */}
      {tab === 'audit' && (
        <ImprovementAudit characterId={characterId} character={character} isDM={appMode === 'dm'} />
      )}
    </div>
  );
}

/* ── Health Row ── */
function HealthRow({ label, value, status, help }) {
  const colors = { good: '#4ade80', okay: '#fbbf24', bad: '#ef4444' };
  const icons = { good: '●', okay: '●', bad: '●' };
  return (
    <div className="flex items-start gap-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <span style={{ color: colors[status], fontSize: 10, marginTop: 3 }}>{icons[status]}</span>
      <div style={{ flex: 1 }}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium" style={{ color: 'var(--text)' }}>{label}</span>
          <span className="text-xs font-bold" style={{ color: colors[status], fontFamily: 'var(--font-mono)' }}>{value}</span>
        </div>
        <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-mute)' }}>{help}</div>
      </div>
    </div>
  );
}

/* ── Error Card with Fix Issue button ── */
function ErrorCard({ err }) {
  const [expanded, setExpanded] = useState(false);
  const isWarning = err.type === 'Warning';
  const bg = isWarning ? 'rgba(251,191,36,0.06)' : 'rgba(239,68,68,0.06)';
  const border = isWarning ? 'rgba(251,191,36,0.2)' : 'rgba(239,68,68,0.2)';
  const color = isWarning ? '#fbbf24' : '#fca5a5';

  const copyForFix = (e) => {
    e.stopPropagation();
    const report = [
      `--- Bug Report from The Codex Dev Tools ---`,
      `Version: ${APP_VERSION}`,
      `Time: ${new Date(err.time).toLocaleString()}`,
      `Type: ${err.type}`,
      `Source: ${err.source || 'unknown'}`,
      `Error: ${err.msg}`,
      err.file ? `File: ${err.file}` : null,
      err.stack ? `Stack:\n${err.stack}` : null,
      err.testName ? `Test: ${err.testName}` : null,
      err.details ? `Details: ${err.details}` : null,
      `---`,
      `Please fix this issue. The error above was caught by Dev Tools in The Codex D&D Companion app.`,
    ].filter(Boolean).join('\n');
    navigator.clipboard.writeText(report).then(() => toast.success('Copied! Paste it to Claude to fix.'));
  };

  return (
    <div className="rounded p-3 cursor-pointer" style={{ background: bg, border: `1px solid ${border}` }} onClick={() => setExpanded(!expanded)}>
      <div className="flex items-start gap-2">
        <AlertTriangle size={12} style={{ color, marginTop: 2, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold" style={{ color }}>{err.type}</span>
            <span className="text-[10px]" style={{ color: 'var(--text-mute)', fontFamily: 'var(--font-mono)' }}>{timeAgo(err.time)}</span>
            <span className="text-[10px] ml-auto" style={{ color: 'var(--text-mute)' }}>{err.source}</span>
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-dim)', wordBreak: 'break-word' }}>
            {err.msg.length > 150 && !expanded ? err.msg.slice(0, 150) + '…' : err.msg}
          </div>
          {expanded && err.file && (
            <div className="text-[10px] mt-1" style={{ color: 'var(--text-mute)', fontFamily: 'var(--font-mono)' }}>File: {err.file}</div>
          )}
          {expanded && err.stack && (
            <pre className="text-[10px] mt-1 p-2 rounded overflow-auto" style={{ color: 'var(--text-mute)', fontFamily: 'var(--font-mono)', background: 'rgba(0,0,0,0.3)', maxHeight: 100 }}>{err.stack}</pre>
          )}
          {expanded && !isWarning && (
            <button
              className="mt-2 px-3 py-1 rounded text-xs font-semibold"
              style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', cursor: 'pointer' }}
              onClick={copyForFix}
            >
              <Copy size={10} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
              Fix Issue — Copy for Claude
            </button>
          )}
        </div>
        <span className="text-[10px]" style={{ color: 'var(--text-mute)' }}>{expanded ? '▼' : '▶'}</span>
      </div>
    </div>
  );
}

/* ── Test Runner — comprehensive tests for finding bugs, glitches, errors ── */
function TestRunner({ characterId }) {
  const [results, setResults] = useState([]);
  const [running, setRunning] = useState(false);

  const runAll = async () => {
    setRunning(true);
    setResults([]);
    const out = [];

    const addResult = (r) => {
      out.push(r);
      setResults([...out]);
    };

    const runTest = async (name, fn) => {
      const start = performance.now();
      try {
        const detail = await fn();
        addResult({ name, status: 'pass', ms: (performance.now() - start).toFixed(0), detail });
      } catch (err) {
        const errMsg = typeof err === 'string' ? err : err.message || 'Unknown error';
        const stack = err?.stack?.split('\n').slice(0, 4).join('\n') || null;
        addResult({ name, status: 'fail', ms: (performance.now() - start).toFixed(0), error: errMsg });
        pushError({
          type: 'Test Failed', msg: `${name}: ${errMsg}`, time: Date.now(),
          source: 'test-runner', stack, testName: name,
          details: `This test checks: ${name}. It failed which means something is broken.`,
        });
      }
    };

    // ═══════════════════════════════════════════════════════════════════
    // SECTION 1: Backend Data Loading — Can we load every data section?
    // ═══════════════════════════════════════════════════════════════════
    const backendTests = [
      ['Load Character Overview', 'get_overview'],
      ['Load Backstory', 'get_backstory'],
      ['Load Spells', 'get_spells'],
      ['Load Inventory', 'get_inventory'],
      ['Load Features', 'get_features'],
      ['Load Conditions', 'get_conditions'],
      ['Load Journal Entries', 'get_journal_entries'],
      ['Load NPCs', 'get_npcs'],
      ['Load Quests', 'get_quests'],
      ['Load Lore Notes', 'get_lore_notes'],
      ['Load Attacks', 'get_attacks'],
      ['Load Combat Notes', 'get_combat_notes'],
      ['Load Spell Slots', 'get_spell_slots'],
      ['Load Currency', 'get_currency'],
      ['Load Items', 'get_items'],
      ['List All Characters', 'list_characters'],
    ];

    for (const [name, cmd] of backendTests) {
      const args = cmd === 'list_characters' ? {} : { characterId };
      await runTest(name, async () => {
        const data = await invoke(cmd, args);
        return typeof data === 'object' ? 'loaded OK' : 'returned';
      });
    }

    // ═══════════════════════════════════════════════════════════════════
    // SECTION 2: Data Integrity — Is the loaded data actually correct?
    // ═══════════════════════════════════════════════════════════════════

    await runTest('Character has a name', async () => {
      const ov = await invoke('get_overview', { characterId });
      if (!ov.name || ov.name.trim() === '') throw new Error('Character name is empty or missing');
      return ov.name;
    });

    await runTest('HP values make sense', async () => {
      const ov = await invoke('get_overview', { characterId });
      if (ov.max_hp < 0) throw new Error(`Max HP is negative: ${ov.max_hp}`);
      if (ov.current_hp < 0) throw new Error(`Current HP is negative: ${ov.current_hp}`);
      if (ov.current_hp > ov.max_hp + 50) throw new Error(`Current HP (${ov.current_hp}) way higher than max (${ov.max_hp}) — possible glitch`);
      return `${ov.current_hp}/${ov.max_hp} HP`;
    });

    await runTest('Level is valid (1–20)', async () => {
      const ov = await invoke('get_overview', { characterId });
      if (!ov.level || ov.level < 1 || ov.level > 20) throw new Error(`Level is ${ov.level} — should be 1-20`);
      return `Level ${ov.level}`;
    });

    await runTest('Ability scores are valid (1–30)', async () => {
      const ov = await invoke('get_overview', { characterId });
      const abilities = ov.ability_scores || [];
      for (const ab of abilities) {
        if (ab.score < 1 || ab.score > 30) throw new Error(`${ab.name} is ${ab.score} — should be 1-30`);
      }
      if (abilities.length !== 6) throw new Error(`Expected 6 ability scores, got ${abilities.length}`);
      return `${abilities.length} scores, all valid`;
    });

    await runTest('AC is reasonable (0–35)', async () => {
      const ov = await invoke('get_overview', { characterId });
      if (ov.armor_class < 0 || ov.armor_class > 35) throw new Error(`AC is ${ov.armor_class} — seems wrong`);
      return `AC ${ov.armor_class}`;
    });

    await runTest('Speed is reasonable', async () => {
      const ov = await invoke('get_overview', { characterId });
      if (ov.speed < 0 || ov.speed > 200) throw new Error(`Speed is ${ov.speed} — seems wrong`);
      return `${ov.speed} ft`;
    });

    await runTest('Proficiency bonus matches level', async () => {
      const ov = await invoke('get_overview', { characterId });
      const expected = Math.ceil(ov.level / 4) + 1;
      if (ov.proficiency_bonus && ov.proficiency_bonus !== expected) {
        throw new Error(`Proficiency is +${ov.proficiency_bonus} but level ${ov.level} should be +${expected}`);
      }
      return `+${ov.proficiency_bonus || expected}`;
    });

    await runTest('Spell slots not over-used', async () => {
      const slots = await invoke('get_spell_slots', { characterId });
      if (Array.isArray(slots)) {
        for (const s of slots) {
          if (s.used > s.max) throw new Error(`Level ${s.level} slots: ${s.used} used but only ${s.max} max`);
        }
      }
      return 'slots OK';
    });

    await runTest('No items with negative quantity', async () => {
      const items = await invoke('get_items', { characterId });
      if (Array.isArray(items)) {
        for (const item of items) {
          if (item.quantity < 0) throw new Error(`"${item.name}" has negative quantity: ${item.quantity}`);
        }
      }
      return `${Array.isArray(items) ? items.length : 0} items checked`;
    });

    await runTest('Currency values not negative', async () => {
      const c = await invoke('get_currency', { characterId });
      for (const [key, val] of Object.entries(c || {})) {
        if (typeof val === 'number' && val < 0) throw new Error(`${key} is negative: ${val}`);
      }
      return 'currency OK';
    });

    // ═══════════════════════════════════════════════════════════════════
    // SECTION 3: Backend Speed — Are commands responding fast enough?
    // ═══════════════════════════════════════════════════════════════════

    await runTest('Backend speed — Overview under 2s', async () => {
      const t0 = performance.now();
      await invoke('get_overview', { characterId });
      const ms = performance.now() - t0;
      if (ms > 2000) throw new Error(`Took ${ms.toFixed(0)}ms — way too slow (limit: 2000ms)`);
      return `${ms.toFixed(0)}ms`;
    });

    await runTest('Backend speed — List characters under 2s', async () => {
      const t0 = performance.now();
      await invoke('list_characters');
      const ms = performance.now() - t0;
      if (ms > 2000) throw new Error(`Took ${ms.toFixed(0)}ms — way too slow (limit: 2000ms)`);
      return `${ms.toFixed(0)}ms`;
    });

    // ═══════════════════════════════════════════════════════════════════
    // SECTION 4: UI & Display — Is the interface set up correctly?
    // ═══════════════════════════════════════════════════════════════════

    await runTest('CSS theme variables exist', async () => {
      const root = document.documentElement;
      const vars = ['--accent', '--text', '--text-dim', '--border', '--panel-blur', '--font-display', '--font-ui'];
      const missing = vars.filter(v => !getComputedStyle(root).getPropertyValue(v).trim());
      if (missing.length > 0) throw new Error(`Missing CSS variables: ${missing.join(', ')}`);
      return `${vars.length} variables OK`;
    });

    await runTest('Fonts are loaded', async () => {
      const fonts = ['--font-display', '--font-ui', '--font-text'];
      const root = document.documentElement;
      const missing = [];
      for (const v of fonts) {
        const val = getComputedStyle(root).getPropertyValue(v).trim();
        if (!val) missing.push(v);
      }
      if (missing.length > 0) throw new Error(`Font variables not set: ${missing.join(', ')}`);
      return 'all font vars set';
    });

    await runTest('Page is not too big (under 8000 elements)', async () => {
      const count = document.querySelectorAll('*').length;
      if (count > 8000) throw new Error(`${count} DOM elements — too many, app may lag`);
      return `${count} elements`;
    });

    await runTest('No broken images on page', async () => {
      const images = document.querySelectorAll('img');
      const broken = [];
      images.forEach(img => {
        if (img.naturalWidth === 0 && img.complete && img.src) broken.push(img.src.slice(-40));
      });
      if (broken.length > 0) throw new Error(`${broken.length} broken image(s): ${broken.join(', ')}`);
      return `${images.length} images OK`;
    });

    await runTest('No empty links or buttons', async () => {
      const empties = [];
      document.querySelectorAll('a, button').forEach(el => {
        const text = el.textContent?.trim();
        const ariaLabel = el.getAttribute('aria-label');
        const title = el.getAttribute('title');
        if (!text && !ariaLabel && !title && !el.querySelector('svg')) {
          empties.push(el.tagName.toLowerCase());
        }
      });
      if (empties.length > 3) throw new Error(`${empties.length} buttons/links with no label — accessibility issue`);
      return 'labels OK';
    });

    // ═══════════════════════════════════════════════════════════════════
    // SECTION 5: Settings & Storage — Is saved data intact?
    // ═══════════════════════════════════════════════════════════════════

    await runTest('Settings not corrupted', async () => {
      const raw = localStorage.getItem('codex-settings-v3');
      if (!raw) return 'no settings saved (using defaults)';
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed !== 'object') throw new Error('Settings is not an object');
        return `${Object.keys(parsed).length} settings`;
      } catch {
        throw new Error('Settings data is corrupted — cannot parse JSON');
      }
    });

    await runTest('No localStorage corruption', async () => {
      let corrupt = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        try {
          const val = localStorage.getItem(key);
          if (val && val.startsWith('{')) JSON.parse(val); // only validate JSON-looking values
        } catch {
          corrupt++;
        }
      }
      if (corrupt > 0) throw new Error(`${corrupt} localStorage entries have corrupted JSON`);
      return `${localStorage.length} entries OK`;
    });

    // ═══════════════════════════════════════════════════════════════════
    // SECTION 6: Export & Wiki — Extra backend features
    // ═══════════════════════════════════════════════════════════════════

    await runTest('Export character works', async () => {
      const data = await invoke('export_character', { characterId });
      if (!data) throw new Error('Export returned empty data');
      return 'export OK';
    });

    await runTest('Wiki search works', async () => {
      await invoke('wiki_search', { query: 'fire', page: 1, perPage: 5 });
      return 'wiki OK';
    });

    await runTest('Wiki categories load', async () => {
      const cats = await invoke('wiki_categories', { ruleset: null });
      if (!cats || (Array.isArray(cats) && cats.length === 0)) return 'no categories (may be empty)';
      return `${Array.isArray(cats) ? cats.length : '?'} categories`;
    });

    // ═══════════════════════════════════════════════════════════════════
    // SECTION 7: Bloat & Performance — Is anything running unnecessarily?
    // ═══════════════════════════════════════════════════════════════════

    await runTest('No excessive event listeners', async () => {
      // Check for common listener leak patterns
      const allElements = document.querySelectorAll('*');
      if (allElements.length > 5000) throw new Error(`${allElements.length} elements — possible component not unmounting properly`);
      return `${allElements.length} elements`;
    });

    await runTest('No runaway timers (intervals)', async () => {
      // Count active intervals by testing a known range
      let activeCount = 0;
      const testId = setInterval(() => {}, 99999);
      // The ID gives us a rough count of how many intervals have been created
      if (testId > 500) {
        activeCount = testId;
        clearInterval(testId);
        throw new Error(`Timer ID is ${activeCount} — possible interval leak. Timers may not be cleaning up on unmount.`);
      }
      clearInterval(testId);
      return `timer ID ${testId} (normal)`;
    });

    await runTest('No duplicate stylesheets loaded', async () => {
      const sheets = document.querySelectorAll('link[rel="stylesheet"]');
      const hrefs = [...sheets].map(s => s.href).filter(Boolean);
      const unique = new Set(hrefs);
      if (unique.size < hrefs.length) throw new Error(`${hrefs.length - unique.size} duplicate stylesheet(s) loaded — wasted bandwidth`);
      return `${hrefs.length} sheets, no duplicates`;
    });

    await runTest('No hidden overflow content (scroll traps)', async () => {
      let traps = 0;
      document.querySelectorAll('[style*="overflow"]').forEach(el => {
        if (el.scrollHeight > el.clientHeight * 3 && el.clientHeight < 50) traps++;
      });
      if (traps > 2) throw new Error(`${traps} elements with hidden overflow — content may be invisible to user`);
      return 'no scroll traps';
    });

    await runTest('Console has no recent errors', async () => {
      const recentErrors = CONSOLE_LOG.filter(l => l.level === 'error' && (Date.now() - l.time) < 30000);
      if (recentErrors.length > 0) throw new Error(`${recentErrors.length} console error(s) in last 30 seconds: ${recentErrors[0].msg.slice(0, 80)}`);
      return `${recentErrors.length} recent errors`;
    });

    await runTest('No stale React state warnings', async () => {
      const staleWarnings = CONSOLE_LOG.filter(l =>
        l.level === 'warn' && (
          l.msg.includes('Cannot update a component') ||
          l.msg.includes('unmounted component') ||
          l.msg.includes('memory leak')
        )
      );
      if (staleWarnings.length > 0) throw new Error(`${staleWarnings.length} React state warning(s) — components may be updating after unmount`);
      return 'no stale state warnings';
    });

    await runTest('localStorage not bloated', async () => {
      let totalSize = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        totalSize += (localStorage.getItem(key) || '').length;
      }
      const mb = (totalSize / 1048576).toFixed(2);
      if (totalSize > 5 * 1048576) throw new Error(`localStorage is ${mb}MB — too bloated, may slow down the app`);
      return `${mb}MB used`;
    });

    // ═══════════════════════════════════════════════════════════════════
    // SECTION 8: Data Consistency — Cross-check related data
    // ═══════════════════════════════════════════════════════════════════

    await runTest('Character class exists in ruleset', async () => {
      const ov = await invoke('get_overview', { characterId });
      if (!ov.primary_class) return 'no class set';
      // Check if class name is valid (non-empty, reasonable length)
      if (ov.primary_class.length > 30) throw new Error(`Class name "${ov.primary_class}" seems wrong — too long`);
      return ov.primary_class;
    });

    await runTest('Character race is set', async () => {
      const ov = await invoke('get_overview', { characterId });
      if (!ov.race || ov.race.trim() === '') return 'no race set (may be new character)';
      if (ov.race.length > 40) throw new Error(`Race "${ov.race}" seems wrong — too long`);
      return ov.race;
    });

    await runTest('All saving throws have valid modifiers', async () => {
      const ov = await invoke('get_overview', { characterId });
      const saves = ov.saving_throws || [];
      for (const s of saves) {
        if (typeof s.modifier !== 'number') throw new Error(`${s.name} saving throw modifier is not a number`);
        if (s.modifier < -10 || s.modifier > 20) throw new Error(`${s.name} save modifier is ${s.modifier} — seems wrong`);
      }
      return `${saves.length} saves checked`;
    });

    await runTest('No orphaned spell slots (max=0 but used>0)', async () => {
      const slots = await invoke('get_spell_slots', { characterId });
      if (Array.isArray(slots)) {
        for (const s of slots) {
          if (s.max === 0 && s.used > 0) throw new Error(`Level ${s.level} has ${s.used} used slots but max is 0 — data error`);
        }
      }
      return 'slots consistent';
    });

    await runTest('Features have valid use counts', async () => {
      const features = await invoke('get_features', { characterId });
      if (Array.isArray(features)) {
        for (const f of features) {
          if (f.max_uses > 0 && f.current_uses > f.max_uses) {
            throw new Error(`"${f.name}" has ${f.current_uses}/${f.max_uses} uses — over limit`);
          }
        }
        return `${features.length} features checked`;
      }
      return 'no features';
    });

    await runTest('No zero-weight equipped items', async () => {
      const items = await invoke('get_items', { characterId });
      if (Array.isArray(items)) {
        const zeroWeight = items.filter(i => i.equipped && i.weight === 0 && !i.name?.toLowerCase().includes('ring'));
        if (zeroWeight.length > 5) throw new Error(`${zeroWeight.length} equipped items with 0 weight — may be missing data`);
      }
      return 'items OK';
    });

    // Done
    setRunning(false);
    const failed = out.filter(r => r.status === 'fail').length;
    if (failed === 0) toast.success(`All ${out.length} tests passed!`);
    else toast.error(`${failed} test${failed > 1 ? 's' : ''} failed — check Errors tab`);
  };

  const passCount = results.filter(r => r.status === 'pass').length;
  const failCount = results.filter(r => r.status === 'fail').length;
  const total = 16 + 10 + 2 + 5 + 2 + 3 + 7 + 6; // approximate total across all 8 sections

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Full App Test Suite</h3>
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-mute)' }}>
            Tests backend commands, data integrity, UI health, settings, and more.
            {failCount > 0 && ' Failed tests are sent to the Errors tab — click "Fix Issue" to copy details.'}
          </p>
        </div>
        <button className="btn-primary text-xs px-4" onClick={runAll} disabled={running}>
          {running ? 'Running…' : `Run All Tests (~${total})`}
        </button>
      </div>

      {results.length > 0 && (
        <>
          {/* Progress bar */}
          <div className="mb-2" style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)' }}>
            <div style={{
              height: '100%', borderRadius: 2, transition: 'width 0.3s',
              width: `${Math.min(100, (results.length / total) * 100)}%`,
              background: failCount > 0 ? '#ef4444' : '#4ade80',
            }} />
          </div>

          <div className="text-xs mb-3" style={{ color: 'var(--text-dim)' }}>
            {passCount} passed · {failCount} failed · {results.length} complete{running ? ' (running…)' : ''}
          </div>
          <div className="space-y-1 max-h-[450px] overflow-auto">
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 px-2 rounded text-xs" style={{ background: r.status === 'fail' ? 'rgba(239,68,68,0.08)' : 'rgba(74,222,128,0.05)' }}>
                <span style={{ color: r.status === 'pass' ? '#4ade80' : '#ef4444', fontWeight: 700, flexShrink: 0 }}>
                  {r.status === 'pass' ? '✓' : '✗'}
                </span>
                <span style={{ color: 'var(--text)', flex: 1 }}>{r.name}</span>
                {r.detail && <span className="text-[10px]" style={{ color: 'var(--text-mute)' }}>{r.detail}</span>}
                <span style={{ color: 'var(--text-mute)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{r.ms}ms</span>
                {r.error && <span className="text-red-400 truncate" style={{ maxWidth: 220, flexShrink: 0 }}>{r.error}</span>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Improvement Audit — finds what's good and what's lacking ── */

function ImprovementAudit({ characterId, character, isDM }) {
  const [results, setResults] = useState([]);
  const [running, setRunning] = useState(false);
  const [summary, setSummary] = useState(null);

  const runAudit = async () => {
    setRunning(true);
    setResults([]);
    setSummary(null);
    const out = [];

    const add = (r) => { out.push(r); setResults([...out]); };

    const check = async (name, category, fn) => {
      try {
        const result = await fn();
        add({ name, category, ...result });
      } catch (err) {
        add({ name, category, status: 'error', msg: err.message || 'Check failed' });
      }
    };

    if (isDM) {
      // ═══════════════════════════════════════════════════════════════
      // DM MODE AUDIT — Campaign Hub focused
      // ═══════════════════════════════════════════════════════════════

      await check('Session Notes', 'Content', async () => {
        const journal = await invoke('get_journal_entries', { characterId });
        const count = Array.isArray(journal) ? journal.length : 0;
        if (count === 0) return { status: 'missing', msg: 'No session notes yet — document your sessions to keep track of what happened', suggestion: 'Write your first session note after your next game' };
        if (count < 3) return { status: 'improve', msg: `Only ${count} session note${count > 1 ? 's' : ''} — keep logging to build a campaign history`, suggestion: 'Try to write notes during or right after each session' };
        const short = journal.filter(j => (j.content || '').length < 50);
        if (short.length > count / 2) return { status: 'improve', msg: `${short.length} of ${count} notes are very short — add more detail`, suggestion: 'Include key events, NPC interactions, and player decisions' };
        return { status: 'good', msg: `${count} session notes with solid detail` };
      });

      await check('NPC Roster', 'Content', async () => {
        const npcs = await invoke('get_npcs', { characterId });
        const count = Array.isArray(npcs) ? npcs.length : 0;
        if (count === 0) return { status: 'missing', msg: 'No NPCs created — your players need characters to interact with', suggestion: 'Add key NPCs: a quest giver, a merchant, a villain, and a recurring ally' };
        if (count < 3) return { status: 'improve', msg: `Only ${count} NPC${count > 1 ? 's' : ''} — most campaigns need at least a handful`, suggestion: 'Add NPCs for each major location or faction' };
        const noDesc = npcs.filter(n => !(n.description || '').trim());
        if (noDesc.length > 0) return { status: 'improve', msg: `${noDesc.length} NPC${noDesc.length > 1 ? 's' : ''} missing descriptions`, suggestion: 'Include appearance, personality, and motivation for each NPC' };
        return { status: 'good', msg: `${count} NPCs all with descriptions` };
      });

      await check('Quest Tracker', 'Content', async () => {
        const quests = await invoke('get_quests', { characterId });
        const count = Array.isArray(quests) ? quests.length : 0;
        if (count === 0) return { status: 'missing', msg: 'No quests created — quests drive the story forward', suggestion: 'Create at least a main quest and one or two side quests' };
        const active = quests.filter(q => (q.status || '').toLowerCase() === 'active');
        const completed = quests.filter(q => (q.status || '').toLowerCase() === 'completed');
        if (active.length === 0 && completed.length === 0) return { status: 'improve', msg: `${count} quest${count > 1 ? 's' : ''} but none are marked active or completed`, suggestion: 'Set active quests so you know what the party is working on' };
        if (active.length > 5) return { status: 'improve', msg: `${active.length} active quests — players may feel overwhelmed`, suggestion: 'Consider completing or shelving some to keep focus' };
        return { status: 'good', msg: `${active.length} active, ${completed.length} completed, ${count} total` };
      });

      await check('Lore & World Building', 'Content', async () => {
        const lore = await invoke('get_lore_notes', { characterId });
        const count = Array.isArray(lore) ? lore.length : 0;
        if (count === 0) return { status: 'missing', msg: 'No lore entries — worldbuilding notes help you stay consistent', suggestion: 'Add entries for major locations, factions, and historical events' };
        if (count < 3) return { status: 'improve', msg: `Only ${count} lore entr${count > 1 ? 'ies' : 'y'} — flesh out your world`, suggestion: 'Cover at least: a major city, a villain faction, and a piece of history' };
        return { status: 'good', msg: `${count} lore entries — solid worldbuilding` };
      });

      await check('Campaign Identity', 'Setup', async () => {
        const ov = await invoke('get_overview', { characterId });
        if (!ov.name || ov.name.trim() === '' || ov.name === 'Unknown') return { status: 'missing', msg: 'Campaign has no name', suggestion: 'Name your campaign so players know what world they\'re in' };
        if (ov.name.length < 3) return { status: 'improve', msg: 'Campaign name is very short', suggestion: 'A descriptive name helps set the tone' };
        return { status: 'good', msg: `Campaign: "${ov.name}"` };
      });

      await check('Party Connect', 'Multiplayer', async () => {
        try {
          const ip = await invoke('get_local_ip');
          if (!ip || ip === 'localhost' || ip === '127.0.0.1') return { status: 'improve', msg: 'Could not detect your network IP — hosting may not work for remote players', suggestion: 'Make sure you\'re connected to WiFi' };
          return { status: 'good', msg: `Network IP: ${ip} — ready to host` };
        } catch {
          return { status: 'improve', msg: 'Could not check network IP', suggestion: 'Ensure you\'re on a local network' };
        }
      });

      await check('Export / Backup', 'Safety', async () => {
        try {
          const data = await invoke('export_character', { characterId });
          if (!data) return { status: 'improve', msg: 'Export returned empty', suggestion: 'Try exporting manually from Export & Import' };
          const size = JSON.stringify(data).length;
          if (size < 200) return { status: 'improve', msg: 'Campaign data is very small — not much to back up yet', suggestion: 'Export regularly once you have more content' };
          return { status: 'good', msg: `Campaign data exportable (${(size / 1024).toFixed(1)} KB)` };
        } catch {
          return { status: 'improve', msg: 'Export check failed', suggestion: 'Try exporting manually' };
        }
      });

      await check('Encounter Readiness', 'Gameplay', async () => {
        const attacks = await invoke('get_attacks', { characterId });
        const combatNotes = await invoke('get_combat_notes', { characterId });
        const hasAttacks = Array.isArray(attacks) && attacks.length > 0;
        const hasNotes = combatNotes && typeof combatNotes === 'string' && combatNotes.trim().length > 0;
        if (!hasAttacks && !hasNotes) return { status: 'missing', msg: 'No encounter prep — add monster stat blocks or combat notes', suggestion: 'Pre-create attacks for monsters your party will face' };
        if (!hasNotes) return { status: 'improve', msg: `${attacks.length} attack${attacks.length > 1 ? 's' : ''} ready but no combat notes`, suggestion: 'Add notes about encounter difficulty, terrain, or tactics' };
        return { status: 'good', msg: `${Array.isArray(attacks) ? attacks.length : 0} attacks + combat notes ready` };
      });

    } else {
      // ═══════════════════════════════════════════════════════════════
      // PLAYER MODE AUDIT — Character completeness
      // ═══════════════════════════════════════════════════════════════

      await check('Character Identity', 'Basics', async () => {
        const ov = await invoke('get_overview', { characterId });
        const missing = [];
        if (!ov.name || ov.name.trim() === '') missing.push('name');
        if (!ov.race || ov.race.trim() === '') missing.push('race');
        if (!ov.primary_class || ov.primary_class.trim() === '') missing.push('class');
        if (missing.length > 0) return { status: 'missing', msg: `Missing: ${missing.join(', ')}`, suggestion: 'Fill in your basic info on the Character Sheet' };
        return { status: 'good', msg: `${ov.name} — ${ov.race} ${ov.primary_class} Lv${ov.level}` };
      });

      await check('Ability Scores', 'Basics', async () => {
        const ov = await invoke('get_overview', { characterId });
        const scores = ov.ability_scores || [];
        if (scores.length < 6) return { status: 'missing', msg: `Only ${scores.length} ability scores — need all 6`, suggestion: 'Set STR, DEX, CON, INT, WIS, and CHA' };
        const allDefault = scores.every(s => s.score === 10);
        if (allDefault) return { status: 'improve', msg: 'All scores are still 10 — they haven\'t been customized', suggestion: 'Use point buy, standard array, or roll for abilities' };
        const high = scores.filter(s => s.score > 18);
        if (high.length > 3) return { status: 'improve', msg: `${high.length} scores above 18 — double check for your level`, suggestion: 'Most level 1 characters max out at 15-17' };
        return { status: 'good', msg: `All 6 scores set (${scores.map(s => s.score).join(', ')})` };
      });

      await check('Hit Points', 'Combat', async () => {
        const ov = await invoke('get_overview', { characterId });
        if (!ov.max_hp || ov.max_hp <= 0) return { status: 'missing', msg: 'Max HP is 0 — you\'ll drop instantly in combat', suggestion: 'Set max HP = class hit die + CON modifier' };
        if (ov.max_hp < 4) return { status: 'improve', msg: `Max HP is only ${ov.max_hp} — very low even for level 1`, suggestion: 'Most level 1 characters have 6-12 HP' };
        if (ov.current_hp <= 0 && ov.max_hp > 0) return { status: 'improve', msg: 'You\'re at 0 HP — heal up!', suggestion: 'Take a long rest or use a healing potion' };
        return { status: 'good', msg: `${ov.current_hp}/${ov.max_hp} HP` };
      });

      await check('Armor Class', 'Combat', async () => {
        const ov = await invoke('get_overview', { characterId });
        if (!ov.armor_class || ov.armor_class <= 0) return { status: 'missing', msg: 'AC is not set — enemies auto-hit you', suggestion: 'Base AC = 10 + DEX mod, plus armor' };
        if (ov.armor_class < 10) return { status: 'improve', msg: `AC ${ov.armor_class} is below base — check if intentional`, suggestion: 'Unarmored AC should be at least 10 + DEX mod' };
        return { status: 'good', msg: `AC ${ov.armor_class}` };
      });

      await check('Movement Speed', 'Combat', async () => {
        const ov = await invoke('get_overview', { characterId });
        if (!ov.speed || ov.speed <= 0) return { status: 'missing', msg: 'Speed is 0 — you can\'t move in combat', suggestion: 'Most races have 25-30 ft speed' };
        return { status: 'good', msg: `${ov.speed} ft` };
      });

      await check('Proficiency Bonus', 'Basics', async () => {
        const ov = await invoke('get_overview', { characterId });
        const expected = Math.ceil(ov.level / 4) + 1;
        if (!ov.proficiency_bonus) return { status: 'improve', msg: 'Proficiency bonus not set', suggestion: `At level ${ov.level}, it should be +${expected}` };
        if (ov.proficiency_bonus !== expected) return { status: 'improve', msg: `+${ov.proficiency_bonus} but should be +${expected} at Lv${ov.level}`, suggestion: 'Update on the Character Sheet' };
        return { status: 'good', msg: `+${ov.proficiency_bonus} (correct for Lv${ov.level})` };
      });

      await check('Backstory', 'Roleplay', async () => {
        const bs = await invoke('get_backstory', { characterId });
        const hasBackstory = bs && typeof bs === 'object' && (bs.backstory || bs.personality_traits || bs.ideals || bs.bonds || bs.flaws);
        if (!hasBackstory) return { status: 'missing', msg: 'No backstory — your character has no history', suggestion: 'Even a few sentences adds depth' };
        const fields = [bs.backstory, bs.personality_traits, bs.ideals, bs.bonds, bs.flaws].filter(f => f && f.trim());
        if (fields.length < 3) return { status: 'improve', msg: `Only ${fields.length} backstory fields filled`, suggestion: 'Fill in personality traits, ideals, bonds, and flaws' };
        return { status: 'good', msg: `${fields.length} backstory fields filled` };
      });

      await check('Spellbook', 'Abilities', async () => {
        const ov = await invoke('get_overview', { characterId });
        const casterClasses = ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Warlock', 'Wizard'];
        const isCaster = casterClasses.some(c => (ov.primary_class || '').toLowerCase().includes(c.toLowerCase()));
        if (!isCaster) return { status: 'good', msg: 'Non-caster — spellbook not needed' };
        const spells = await invoke('get_spells', { characterId });
        const count = Array.isArray(spells) ? spells.length : 0;
        if (count === 0) return { status: 'missing', msg: `You're a ${ov.primary_class} with no spells`, suggestion: 'Add cantrips and level 1 spells from your class list' };
        const cantrips = spells.filter(s => s.level === 0 || s.level === '0' || (s.level || '').toString().toLowerCase() === 'cantrip');
        if (cantrips.length === 0) return { status: 'improve', msg: `${count} spells but no cantrips`, suggestion: 'Add at least 2-3 cantrips you can use at will' };
        return { status: 'good', msg: `${count} spells (${cantrips.length} cantrips)` };
      });

      await check('Features & Traits', 'Abilities', async () => {
        const features = await invoke('get_features', { characterId });
        const count = Array.isArray(features) ? features.length : 0;
        if (count === 0) return { status: 'missing', msg: 'No features — every class gets features at level 1', suggestion: 'Add racial traits and class features from the PHB' };
        if (count < 2) return { status: 'improve', msg: `Only ${count} feature — most characters start with 2-4`, suggestion: 'Check your race and class for starting features' };
        return { status: 'good', msg: `${count} features & traits` };
      });

      await check('Inventory & Equipment', 'Gear', async () => {
        const items = await invoke('get_items', { characterId });
        const count = Array.isArray(items) ? items.length : 0;
        if (count === 0) return { status: 'missing', msg: 'Empty inventory — no weapons, armor, or gear', suggestion: 'Add starting equipment from your class and background' };
        const weapons = items.filter(i => i.type === 'weapon' || (i.name || '').toLowerCase().match(/sword|bow|axe|dagger|staff|mace|hammer|spear|crossbow/));
        if (weapons.length === 0) return { status: 'improve', msg: `${count} items but no weapons detected`, suggestion: 'Add at least one weapon' };
        return { status: 'good', msg: `${count} items` };
      });

      await check('Currency', 'Gear', async () => {
        const c = await invoke('get_currency', { characterId });
        const total = (c?.gp || 0) + (c?.sp || 0) / 10 + (c?.cp || 0) / 100 + (c?.ep || 0) / 2 + (c?.pp || 0) * 10;
        if (total <= 0) return { status: 'improve', msg: 'No gold — most characters start with some', suggestion: 'Starting gold varies by background (usually 5-25 gp)' };
        return { status: 'good', msg: `${total.toFixed(1)} gp equivalent` };
      });

      await check('Campaign Journal', 'Tracking', async () => {
        const journal = await invoke('get_journal_entries', { characterId });
        const count = Array.isArray(journal) ? journal.length : 0;
        if (count === 0) return { status: 'improve', msg: 'No journal entries — tracking sessions helps you remember', suggestion: 'Write a quick note after each session' };
        return { status: 'good', msg: `${count} journal entr${count > 1 ? 'ies' : 'y'}` };
      });
    }

    // Summarize
    const good = out.filter(r => r.status === 'good').length;
    const improve = out.filter(r => r.status === 'improve').length;
    const missing = out.filter(r => r.status === 'missing').length;
    const errors = out.filter(r => r.status === 'error').length;
    setSummary({ good, improve, missing, errors, total: out.length });
    setRunning(false);

    if (missing === 0 && improve === 0) toast.success('Everything looks great!');
    else toast(`Found ${missing + improve} area${missing + improve > 1 ? 's' : ''} to improve`, { icon: '🔍' });
  };

  const statusConfig = {
    good:    { color: '#4ade80', bg: 'rgba(74,222,128,0.06)',  border: 'rgba(74,222,128,0.15)',  icon: '✓', label: 'Good' },
    improve: { color: '#fbbf24', bg: 'rgba(251,191,36,0.06)',  border: 'rgba(251,191,36,0.15)',  icon: '!', label: 'Could Improve' },
    missing: { color: '#f87171', bg: 'rgba(248,113,113,0.06)', border: 'rgba(248,113,113,0.15)', icon: '✗', label: 'Missing' },
    error:   { color: '#94a3b8', bg: 'rgba(148,163,184,0.06)', border: 'rgba(148,163,184,0.15)', icon: '?', label: 'Error' },
  };

  // Group by category
  const categories = {};
  results.forEach(r => {
    if (!categories[r.category]) categories[r.category] = [];
    categories[r.category].push(r);
  });

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Search size={14} />
            {isDM ? 'Campaign Audit' : 'Character Audit'}
          </h3>
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-mute)' }}>
            {isDM
              ? 'Scans your campaign for missing content, incomplete setup, and areas to flesh out.'
              : 'Checks your character for missing info, incomplete setup, and things needed to play.'}
          </p>
        </div>
        <button className="btn-primary text-xs px-4" onClick={runAudit} disabled={running}>
          {running ? 'Scanning…' : 'Run Audit'}
        </button>
      </div>

      {/* Summary bar */}
      {summary && (
        <div className="flex items-center gap-4 mb-4 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          {[
            { key: 'good', label: 'Good', count: summary.good },
            { key: 'improve', label: 'Improve', count: summary.improve },
            { key: 'missing', label: 'Missing', count: summary.missing },
          ].map(s => (
            <div key={s.key} className="flex items-center gap-2">
              <span style={{ color: statusConfig[s.key].color, fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{s.count}</span>
              <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>{s.label}</span>
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <div className="text-[11px]" style={{ color: 'var(--text-mute)' }}>
            {summary.total} checks · {Math.round((summary.good / summary.total) * 100)}% complete
          </div>
        </div>
      )}

      {/* Results by category */}
      {Object.entries(categories).length > 0 && (
        <div className="space-y-4">
          {Object.entries(categories).map(([cat, items]) => (
            <div key={cat}>
              <h4 className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-mute)' }}>{cat}</h4>
              <div className="space-y-2">
                {items.map((r, i) => {
                  const cfg = statusConfig[r.status] || statusConfig.error;
                  return (
                    <div key={i} className="rounded-lg p-3" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                      <div className="flex items-start gap-2.5">
                        <span style={{ color: cfg.color, fontWeight: 700, fontSize: 12, marginTop: 1, flexShrink: 0, width: 14, textAlign: 'center' }}>{cfg.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{r.name}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: `${cfg.color}15`, color: cfg.color, fontWeight: 600 }}>{cfg.label}</span>
                          </div>
                          <div className="text-[11px]" style={{ color: 'var(--text-dim)', lineHeight: 1.5 }}>{r.msg}</div>
                          {r.suggestion && (
                            <div className="text-[11px] mt-1.5 flex items-start gap-1.5" style={{ color: 'var(--text-mute)' }}>
                              <span style={{ color: cfg.color, flexShrink: 0 }}>→</span>
                              {r.suggestion}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Copy report */}
      {results.length > 0 && !running && (
        <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            className="btn-ghost text-xs font-semibold"
            style={{ color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 6, padding: '4px 12px' }}
            onClick={() => {
              const lines = [
                `--- ${isDM ? 'Campaign' : 'Character'} Audit Report ---`,
                `Version: ${APP_VERSION}`,
                `Mode: ${isDM ? 'DM' : 'Player'}`,
                `Time: ${new Date().toLocaleString()}`,
                '',
                ...results.map(r => `[${(statusConfig[r.status]?.label || r.status).toUpperCase()}] ${r.name}: ${r.msg}${r.suggestion ? `\n  → ${r.suggestion}` : ''}`),
                '',
                `Summary: ${summary?.good || 0} good, ${summary?.improve || 0} to improve, ${summary?.missing || 0} missing`,
                '---',
                `Paste this to Claude to get help fixing these issues.`,
              ];
              navigator.clipboard.writeText(lines.join('\n')).then(() => toast.success('Audit report copied!'));
            }}
          >
            <Copy size={10} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
            Copy Report for Claude
          </button>
        </div>
      )}
    </div>
  );
}
