import { useState, useEffect, useCallback, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useAppMode } from '../contexts/ModeContext';
import { APP_VERSION } from '../version';
import { getAllFlags, setFlag } from '../dev/featureFlags';
import { ipcLog, subscribe as subscribeIpc, getIpcStats } from '../dev/devInvoke';
import { useDevUpdateCheck } from '../hooks/useDevUpdateCheck';

// Module-level timestamp for fallback (avoids impure Date.now() in render)
const MODULE_LOAD_TS = Date.now();

// ─── Sidebar ─────────────────────────────────────────────────────────────────

const SIDEBAR_SECTIONS = [
  { id: 'health',      label: 'Health & Errors', icon: 'H' },
  { id: 'console',     label: 'Console',         icon: 'C' },
  { id: 'db',          label: 'Database',         icon: 'D' },
  { id: 'git',         label: 'Git',              icon: 'G' },
  { id: 'diagnostics', label: 'Diagnostics',      icon: 'X' },
  { id: 'bug-report',  label: 'Bug Report',       icon: 'B' },
];

// ─── Shared styles ───────────────────────────────────────────────────────────

const inputStyle = {
  padding: '8px 12px', borderRadius: 8, fontSize: 12,
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  color: 'rgba(255,255,255,0.85)', outline: 'none', fontFamily: 'monospace',
  width: '100%', boxSizing: 'border-box',
};

const btnStyle = {
  padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
  background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
  color: '#a78bfa', cursor: 'pointer',
};

const pillStyle = {
  padding: '4px 10px', borderRadius: 6, fontSize: 11,
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
  color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
};

const cardStyle = {
  padding: 16, borderRadius: 12,
  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
};

function StatCard({ label, value, color, sub }) {
  return (
    <div style={{
      padding: '12px 14px', borderRadius: 10,
      background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ fontSize: 10, opacity: 0.5, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color, fontFamily: 'monospace' }}>{value}</div>
      {sub && <div style={{ fontSize: 9, opacity: 0.35, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function StatusDot({ ok, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
      <span style={{
        width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
        background: ok === true ? '#4ade80' : ok === false ? '#ef4444' : '#fbbf24',
        boxShadow: ok === true ? '0 0 6px rgba(74,222,128,0.4)' : ok === false ? '0 0 6px rgba(239,68,68,0.4)' : 'none',
      }} />
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{label}</span>
    </div>
  );
}

// ─── Health & Errors Panel (the main feature) ────────────────────────────────

// Capture frontend errors in a module-level buffer
const _frontendErrors = [];
const _maxFrontendErrors = 200;
let _frontendListenersInstalled = false;

function _installFrontendCapture() {
  if (_frontendListenersInstalled) return;
  _frontendListenersInstalled = true;

  const push = (entry) => {
    _frontendErrors.unshift(entry);
    if (_frontendErrors.length > _maxFrontendErrors) _frontendErrors.length = _maxFrontendErrors;
  };

  // Capture console.error
  const origError = console.error;
  console.error = (...args) => {
    origError.apply(console, args);
    const msg = args.map(a => a instanceof Error ? a.message : String(a ?? '')).join(' ').slice(0, 500);
    if (msg.trim() && !msg.includes('[DevDashboard]')) {
      push({ level: 'error', source: 'console', message: msg, ts: Date.now(), stack: args.find(a => a instanceof Error)?.stack || '' });
    }
  };

  // Capture console.warn
  const origWarn = console.warn;
  console.warn = (...args) => {
    origWarn.apply(console, args);
    const msg = args.map(a => String(a ?? '')).join(' ').slice(0, 500);
    if (msg.trim() && !msg.includes('[DevDashboard]')) {
      push({ level: 'warn', source: 'console', message: msg, ts: Date.now() });
    }
  };

  // Unhandled errors
  window.addEventListener('error', (e) => {
    push({
      level: 'error', source: 'uncaught', ts: Date.now(),
      message: `${e.message} at ${e.filename}:${e.lineno}:${e.colno}`,
      stack: e.error?.stack || '',
    });
  });

  // Unhandled rejections
  window.addEventListener('unhandledrejection', (e) => {
    const reason = e.reason;
    push({
      level: 'error', source: 'promise', ts: Date.now(),
      message: reason instanceof Error ? reason.message : String(reason ?? 'Unknown rejection'),
      stack: reason instanceof Error ? (reason.stack || '') : '',
    });
  });
}

function HealthPanel() {
  const { peers } = useDevUpdateCheck();
  const [env, setEnv] = useState(null);
  const [backendLogs, setBackendLogs] = useState([]);
  const [serverHealth, setServerHealth] = useState(null); // true/false/null
  const [ipcErrors, setIpcErrors] = useState([]);
  const [feErrors, setFeErrors] = useState([..._frontendErrors]);
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filter, setFilter] = useState('all'); // all, error, warn, info
  const scrollRef = useRef(null);

  // 1) Memory usage
  const [memory, setMemory] = useState(null);
  // 3) DB health
  const [dbHealth, setDbHealth] = useState(null);
  // 4) Slow IPC threshold
  const [slowIpcThreshold] = useState(500);
  // 6) Error rate tracking
  const errorTimestampsRef = useRef([]);
  const [errorRate, setErrorRate] = useState(0);
  // 7) localStorage usage
  const [storageInfo, setStorageInfo] = useState(null);
  // Session uptime
  const [sessionStart] = useState(() => Date.now());
  const [uptimeStr, setUptimeStr] = useState('0m');

  // Install frontend error capture
  useEffect(() => { _installFrontendCapture(); }, []);

  // Fetch environment info once
  useEffect(() => { invoke('dev_check_environment').then(setEnv).catch(e => console.error('Environment check failed:', e)); }, []);

  // Health check ping — every 5s
  useEffect(() => {
    const check = () => {
      invoke('dev_check_environment')
        .then(() => setServerHealth(true))
        .catch(() => setServerHealth(false));
    };
    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, []);

  // Poll backend logs every 2s
  useEffect(() => {
    if (!autoRefresh) return;
    const poll = () => invoke('dev_get_log_buffer').then(setBackendLogs).catch(() => {});
    poll();
    const interval = setInterval(poll, 2000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Subscribe to IPC errors
  useEffect(() => {
    return subscribeIpc(() => {
      const errors = ipcLog.filter(e => e.status === 'error');
      setIpcErrors(errors.slice(-50));
      setFeErrors([..._frontendErrors]);
    });
  }, []);

  // Refresh frontend errors periodically
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => setFeErrors([..._frontendErrors]), 1500);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // 1) Memory usage — poll every 3s
  useEffect(() => {
    const poll = () => {
      if (performance.memory) {
        setMemory({
          used: (performance.memory.usedJSHeapSize / 1048576).toFixed(1),
          total: (performance.memory.totalJSHeapSize / 1048576).toFixed(1),
          limit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(0),
          pct: ((performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100).toFixed(1),
        });
      }
    };
    poll();
    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, []);

  // 3) DB health — check on mount
  useEffect(() => {
    const checkDb = async () => {
      try {
        const chars = await invoke('list_characters');
        const tables = await invoke('dev_list_tables', { characterId: chars[0]?.id || null }).catch(() => []);
        setDbHealth({
          ok: true,
          characterCount: chars.length,
          tableCount: tables.length,
          characters: chars.map(c => c.name),
        });
      } catch (err) {
        setDbHealth({ ok: false, error: String(err) });
      }
    };
    checkDb();
  }, []);

  // 6) Error rate — track errors per minute (sliding 5 min window)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const fiveMinAgo = now - 300000;
      // Add current error count
      const currentTotal = _frontendErrors.filter(e => e.level === 'error' && e.ts > fiveMinAgo).length;
      errorTimestampsRef.current = _frontendErrors
        .filter(e => e.level === 'error' && e.ts > fiveMinAgo)
        .map(e => e.ts);
      setErrorRate(Math.round(currentTotal / 5)); // per minute avg
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Uptime ticker — update every 30s
  useEffect(() => {
    const update = () => {
      const mins = Math.floor((Date.now() - sessionStart) / 60000);
      setUptimeStr(mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`);
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [sessionStart]);

  // 7) localStorage usage — check every 5s
  useEffect(() => {
    const check = () => {
      try {
        let totalSize = 0;
        let keyCount = 0;
        const keyBreakdown = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          const val = localStorage.getItem(key);
          const size = (key.length + (val?.length || 0)) * 2; // UTF-16
          totalSize += size;
          keyCount++;
          if (size > 1024) {
            keyBreakdown.push({ key, size: (size / 1024).toFixed(1) });
          }
        }
        keyBreakdown.sort((a, b) => parseFloat(b.size) - parseFloat(a.size));
        setStorageInfo({
          totalKB: (totalSize / 1024).toFixed(1),
          keyCount,
          largeKeys: keyBreakdown.slice(0, 5),
        });
      } catch { /* ignore */ }
    };
    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = getIpcStats();
  const errorCount = feErrors.filter(e => e.level === 'error').length + ipcErrors.length;
  const warnCount = feErrors.filter(e => e.level === 'warn').length;

  // Parse backend logs for errors/warnings
  const backendErrors = backendLogs.filter(l =>
    /error|exception|traceback|failed|crash/i.test(l) && !/INFO/i.test(l)
  );

  // Combined error feed
  const allEntries = [
    ...feErrors.map(e => ({ ...e, origin: 'frontend' })),
    ...ipcErrors.map(e => ({
      level: 'error', source: 'ipc', origin: 'ipc', ts: e.endTime || MODULE_LOAD_TS,
      message: `${e.command} failed: ${e.error?.slice(0, 200) || 'Unknown'}`,
    })),
    ...backendErrors.map(l => ({
      level: /error|exception|crash/i.test(l) ? 'error' : 'warn',
      source: 'backend', origin: 'backend', ts: MODULE_LOAD_TS,
      message: l.slice(0, 300),
    })),
  ].sort((a, b) => b.ts - a.ts);

  const filtered = filter === 'all' ? allEntries : allEntries.filter(e => e.level === filter);

  // 4) Slow IPC calls
  const slowIpcCalls = ipcLog.filter(e => e.duration && e.duration >= slowIpcThreshold);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#a78bfa', margin: 0 }}>
          Health & Live Errors
        </h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
            <input type="checkbox" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)}
              style={{ accentColor: '#7c3aed' }} />
            Live
          </label>
          <button onClick={() => { _frontendErrors.length = 0; setFeErrors([]); setIpcErrors([]); }} style={pillStyle}>
            Clear Errors
          </button>
        </div>
      </div>

      {/* Health indicators */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
        <StatCard label="Errors" value={errorCount + backendErrors.length} color={errorCount + backendErrors.length > 0 ? '#ef4444' : '#4ade80'} />
        <StatCard label="Warnings" value={warnCount} color={warnCount > 0 ? '#fbbf24' : '#4ade80'} />
        <StatCard label="Err/min (5m)" value={errorRate} color={errorRate > 5 ? '#ef4444' : errorRate > 0 ? '#fbbf24' : '#4ade80'} />
        <StatCard label="IPC Calls" value={stats.total} color="#a78bfa" sub={`avg ${stats.avg.toFixed(0)}ms / p95 ${stats.p95.toFixed(0)}ms`} />
        <StatCard label="Slow IPC" value={slowIpcCalls.length} color={slowIpcCalls.length > 0 ? '#f97316' : '#4ade80'} sub={`>${slowIpcThreshold}ms`} />
        {memory && <StatCard label="Heap Used" value={`${memory.used} MB`} color={parseFloat(memory.pct) > 80 ? '#ef4444' : parseFloat(memory.pct) > 50 ? '#fbbf24' : '#38bdf8'} sub={`${memory.pct}% of ${memory.limit} MB`} />}
        <StatCard label="localStorage" value={storageInfo ? `${storageInfo.totalKB} KB` : '...'} color="#a78bfa" sub={storageInfo ? `${storageInfo.keyCount} keys` : ''} />
        <StatCard label="Version" value={env?.app_version || APP_VERSION} color="#60a5fa" sub={env?.git_branch || ''} />
        <StatCard label="FPS" value={<FPSValue />} color="#38bdf8" />
        <StatCard label="Uptime" value={uptimeStr} color="#60a5fa" />
        <StatCard label="Devs" value={peers.length + 1} color="#fbbf24" />
      </div>

      {/* Status checks */}
      <div style={cardStyle}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>System Health</div>
        <StatusDot ok={serverHealth} label={serverHealth === null ? 'Checking Tauri backend...' : serverHealth ? 'Tauri backend responding' : 'Backend not responding'} />
        <StatusDot ok={errorCount === 0} label={errorCount === 0 ? 'No frontend errors' : `${errorCount} frontend error${errorCount !== 1 ? 's' : ''} detected`} />
        <StatusDot ok={backendErrors.length === 0} label={backendErrors.length === 0 ? 'No backend errors' : `${backendErrors.length} backend error${backendErrors.length !== 1 ? 's' : ''} in log`} />
        <StatusDot ok={stats.total === 0 || ipcErrors.length === 0} label={ipcErrors.length === 0 ? 'All IPC calls healthy' : `${ipcErrors.length} failed IPC call${ipcErrors.length !== 1 ? 's' : ''}`} />
        <StatusDot ok={dbHealth?.ok ?? null} label={dbHealth === null ? 'Checking database...' : dbHealth.ok ? `Database healthy — ${dbHealth.characterCount} character${dbHealth.characterCount !== 1 ? 's' : ''}, ${dbHealth.tableCount} tables` : `Database error: ${dbHealth.error}`} />
        <StatusDot ok={slowIpcCalls.length === 0} label={slowIpcCalls.length === 0 ? `No slow IPC calls (>${slowIpcThreshold}ms)` : `${slowIpcCalls.length} slow IPC call${slowIpcCalls.length !== 1 ? 's' : ''} (>${slowIpcThreshold}ms)`} />
        {memory && <StatusDot ok={parseFloat(memory.pct) < 80} label={`Heap: ${memory.used} / ${memory.total} MB (${memory.pct}%)`} />}
        <StatusDot ok={!storageInfo || parseFloat(storageInfo.totalKB) < 4000} label={storageInfo ? `localStorage: ${storageInfo.totalKB} KB across ${storageInfo.keyCount} keys` : 'Checking localStorage...'} />
      </div>

      {/* Detail panels row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* DB Health Detail */}
        <div style={cardStyle}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#60a5fa', marginBottom: 8 }}>Database</div>
          {dbHealth === null && <div style={{ fontSize: 11, opacity: 0.4 }}>Checking...</div>}
          {dbHealth?.ok && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
                {dbHealth.characterCount} character{dbHealth.characterCount !== 1 ? 's' : ''} &middot; {dbHealth.tableCount} tables
              </div>
              {dbHealth.characters.map(name => (
                <div key={name} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'rgba(96,165,250,0.08)', color: '#93c5fd', display: 'inline-block', marginRight: 4 }}>
                  {name}
                </div>
              ))}
            </div>
          )}
          {dbHealth && !dbHealth.ok && <div style={{ fontSize: 11, color: '#ef4444' }}>{dbHealth.error}</div>}
        </div>

        {/* Memory Detail */}
        <div style={cardStyle}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#38bdf8', marginBottom: 8 }}>Memory</div>
          {!memory && <div style={{ fontSize: 11, opacity: 0.4 }}>Not available in this webview</div>}
          {memory && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
                <span>Used: {memory.used} MB</span>
                <span>Total: {memory.total} MB</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 3, transition: 'width 0.5s',
                  width: `${memory.pct}%`,
                  background: parseFloat(memory.pct) > 80 ? '#ef4444' : parseFloat(memory.pct) > 50 ? '#fbbf24' : '#38bdf8',
                }} />
              </div>
              <div style={{ fontSize: 10, opacity: 0.35 }}>Limit: {memory.limit} MB</div>
            </div>
          )}
        </div>

        {/* Slow IPC Calls */}
        <div style={cardStyle}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#f97316', marginBottom: 8 }}>
            Slow IPC ({slowIpcCalls.length})
            <span style={{ fontSize: 10, fontWeight: 400, opacity: 0.5, marginLeft: 6 }}>&gt;{slowIpcThreshold}ms</span>
          </div>
          {slowIpcCalls.length === 0 ? (
            <div style={{ fontSize: 11, opacity: 0.3 }}>No slow calls detected</div>
          ) : (
            <div style={{ maxHeight: 120, overflow: 'auto', fontSize: 10, fontFamily: 'monospace' }}>
              {slowIpcCalls.slice(-15).reverse().map(e => (
                <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{e.command}</span>
                  <span style={{ color: e.duration > 1000 ? '#ef4444' : '#f97316', fontWeight: 600 }}>{e.duration.toFixed(0)}ms</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* localStorage Detail */}
        <div style={cardStyle}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#a78bfa', marginBottom: 8 }}>localStorage</div>
          {!storageInfo ? (
            <div style={{ fontSize: 11, opacity: 0.4 }}>Checking...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
                {storageInfo.totalKB} KB total &middot; {storageInfo.keyCount} keys
              </div>
              {storageInfo.largeKeys.length > 0 && (
                <>
                  <div style={{ fontSize: 10, opacity: 0.4, marginTop: 4 }}>Largest keys (&gt;1 KB):</div>
                  {storageInfo.largeKeys.map(k => (
                    <div key={k.key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'monospace', padding: '1px 0' }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>{k.key}</span>
                      <span style={{ color: '#a78bfa', fontWeight: 600 }}>{k.size} KB</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Error feed */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>
            Live Error Feed ({filtered.length})
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            {['all', 'error', 'warn'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                ...pillStyle,
                background: filter === f ? 'rgba(124,58,237,0.2)' : pillStyle.background,
                color: filter === f ? '#a78bfa' : pillStyle.color,
                borderColor: filter === f ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.08)',
              }}>
                {f === 'all' ? 'All' : f === 'error' ? 'Errors' : 'Warnings'}
              </button>
            ))}
          </div>
        </div>

        <div ref={scrollRef} style={{ ...cardStyle, maxHeight: 400, overflow: 'auto', padding: 0 }}>
          {filtered.length === 0 && (
            <div style={{ padding: 32, textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>
              No errors detected — everything looks good
            </div>
          )}
          {filtered.slice(0, 100).map((entry, i) => {
            const isError = entry.level === 'error';
            const expanded = expandedIdx === i;
            return (
              <div key={i}
                onClick={() => setExpandedIdx(expanded ? null : i)}
                style={{
                  padding: '8px 12px', cursor: entry.stack ? 'pointer' : 'default',
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                  background: expanded ? 'rgba(255,255,255,0.02)' : 'transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                    background: isError ? '#ef4444' : '#fbbf24',
                  }} />
                  <span style={{
                    padding: '1px 6px', borderRadius: 3, fontSize: 9, fontWeight: 700, flexShrink: 0,
                    background: entry.origin === 'frontend' ? 'rgba(124,58,237,0.15)' : entry.origin === 'ipc' ? 'rgba(249,115,22,0.15)' : 'rgba(45,212,191,0.15)',
                    color: entry.origin === 'frontend' ? '#a78bfa' : entry.origin === 'ipc' ? '#f97316' : '#2dd4bf',
                  }}>
                    {entry.source}
                  </span>
                  <span style={{ flex: 1, fontSize: 11, fontFamily: 'monospace', color: isError ? '#fca5a5' : '#fde68a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {entry.message}
                  </span>
                  <span style={{ fontSize: 9, opacity: 0.3, flexShrink: 0 }}>
                    {new Date(entry.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                {expanded && entry.stack && (
                  <pre style={{
                    marginTop: 8, padding: 10, borderRadius: 6, fontSize: 10,
                    background: 'rgba(0,0,0,0.3)', color: 'rgba(255,255,255,0.5)',
                    overflow: 'auto', maxHeight: 200, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                  }}>
                    {entry.stack}
                  </pre>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Inline FPS counter component
function FPSValue() {
  const [fps, setFps] = useState(0);
  const lastRef = useRef(null);
  const framesRef = useRef(0);

  useEffect(() => {
    let running = true;
    lastRef.current = performance.now();
    const tick = () => {
      if (!running) return;
      framesRef.current++;
      const now = performance.now();
      if (now - lastRef.current >= 1000) {
        setFps(framesRef.current);
        framesRef.current = 0;
        lastRef.current = now;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => { running = false; };
  }, []);

  return <span style={{ color: fps >= 55 ? '#4ade80' : fps >= 30 ? '#fbbf24' : '#ef4444' }}>{fps}</span>;
}

// ─── Console Panel (unified logs) ────────────────────────────────────────────

function ConsolePanel() {
  const [backendLogs, setBackendLogs] = useState([]);
  const [ipcEntries, setIpcEntries] = useState([...ipcLog]);
  const [feErrors, setFeErrors] = useState([..._frontendErrors]);
  const [filter, setFilter] = useState('');
  const [source, setSource] = useState('all'); // all, backend, ipc, frontend
  const [autoScroll, setAutoScroll] = useState(true);
  const endRef = useRef(null);

  useEffect(() => { _installFrontendCapture(); }, []);

  useEffect(() => {
    const poll = () => invoke('dev_get_log_buffer').then(setBackendLogs).catch(() => {});
    poll();
    const interval = setInterval(poll, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => subscribeIpc(() => {
    setIpcEntries([...ipcLog]);
    setFeErrors([..._frontendErrors]);
  }), []);

  useEffect(() => {
    const interval = setInterval(() => setFeErrors([..._frontendErrors]), 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (autoScroll) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [backendLogs, ipcEntries, feErrors, autoScroll]);

  const stats = getIpcStats();

  // Build unified log
  const entries = [];

  if (source === 'all' || source === 'backend') {
    backendLogs.forEach((l, i) => {
      entries.push({ id: `b-${i}`, ts: 0, source: 'backend', level: /error|exception/i.test(l) ? 'error' : /warn/i.test(l) ? 'warn' : 'info', text: l });
    });
  }

  if (source === 'all' || source === 'ipc') {
    ipcEntries.forEach(e => {
      entries.push({
        id: `i-${e.id}`, ts: e.endTime || e.startTime, source: 'ipc',
        level: e.status === 'error' ? 'error' : 'info',
        text: `${e.command} ${e.duration ? `(${e.duration.toFixed(0)}ms)` : ''}${e.error ? ` — ${e.error.slice(0, 100)}` : ''}`,
      });
    });
  }

  if (source === 'all' || source === 'frontend') {
    feErrors.forEach((e, i) => {
      entries.push({ id: `f-${i}`, ts: e.ts, source: e.source, level: e.level, text: e.message });
    });
  }

  const filtered = filter
    ? entries.filter(e => e.text.toLowerCase().includes(filter.toLowerCase()))
    : entries;

  const levelColor = (l) => l === 'error' ? '#ef4444' : l === 'warn' ? '#fbbf24' : 'rgba(255,255,255,0.4)';
  const sourceColor = (s) => ({ backend: '#2dd4bf', ipc: '#f97316', console: '#a78bfa', uncaught: '#ef4444', promise: '#ef4444' }[s] || '#94a3b8');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#94a3b8', margin: 0 }}>Console</h2>
        <div style={{ display: 'flex', gap: 8, fontSize: 11, opacity: 0.4 }}>
          <span>IPC: {stats.total} calls</span>
          <span>avg {stats.avg.toFixed(0)}ms</span>
          <span>p95 {stats.p95.toFixed(0)}ms</span>
        </div>
      </div>

      {/* Source tabs + filter */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {['all', 'backend', 'ipc', 'frontend'].map(s => (
          <button key={s} onClick={() => setSource(s)} style={{
            ...pillStyle,
            background: source === s ? 'rgba(124,58,237,0.2)' : pillStyle.background,
            color: source === s ? '#a78bfa' : pillStyle.color,
            textTransform: 'capitalize',
          }}>
            {s}
          </button>
        ))}
        <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter..."
          style={{ ...inputStyle, flex: 1, padding: '5px 10px', fontSize: 11 }} />
        <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          <input type="checkbox" checked={autoScroll} onChange={e => setAutoScroll(e.target.checked)} style={{ accentColor: '#7c3aed' }} />
          Auto-scroll
        </label>
      </div>

      {/* Log output */}
      <div style={{ ...cardStyle, flex: 1, overflow: 'auto', padding: 0, fontFamily: 'monospace', fontSize: 11, minHeight: 400 }}>
        {filtered.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>No log entries</div>
        )}
        {filtered.map(entry => (
          <div key={entry.id} style={{ padding: '4px 10px', borderBottom: '1px solid rgba(255,255,255,0.02)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ color: levelColor(entry.level), fontWeight: 700, fontSize: 9, minWidth: 36, textTransform: 'uppercase', marginTop: 2 }}>
              {entry.level}
            </span>
            <span style={{
              padding: '0 4px', borderRadius: 2, fontSize: 9, fontWeight: 600, marginTop: 1,
              color: sourceColor(entry.source), background: `${sourceColor(entry.source)}15`,
              minWidth: 48, textAlign: 'center',
            }}>
              {entry.source}
            </span>
            <span style={{ flex: 1, color: entry.level === 'error' ? '#fca5a5' : entry.level === 'warn' ? '#fde68a' : 'rgba(255,255,255,0.6)', wordBreak: 'break-all' }}>
              {entry.text}
            </span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}

// ─── DB Inspector ────────────────────────────────────────────────────────────

function DbPanel() {
  const [tables, setTables] = useState([]);
  const [charId, setCharId] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => { invoke('list_characters').then(setCharacters).catch(e => console.error('Failed to list characters:', e)); }, []);
  useEffect(() => { invoke('dev_list_tables', { characterId: charId }).then(setTables).catch(e => console.error('Failed to list tables:', e)); }, [charId]);

  const run = async (q) => {
    const toRun = q || query;
    if (!toRun.trim()) return;
    try {
      const res = await invoke('dev_query_db', { characterId: charId, query: toRun });
      setResults(res);
      setHistory(prev => [toRun, ...prev.filter(h => h !== toRun)].slice(0, 20));
    } catch (err) { setResults({ error: String(err) }); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#f472b6', margin: 0 }}>Database Inspector</h2>

      <select value={charId || ''} onChange={e => setCharId(e.target.value || null)} style={{ ...inputStyle, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
        <option value="">Wiki DB</option>
        {characters.map(c => <option key={c.id} value={c.id}>{c.name} ({c.primary_class})</option>)}
      </select>

      {/* Table pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {tables.map(t => (
          <button key={t.name} onClick={() => { setQuery(`SELECT * FROM "${t.name}" LIMIT 100`); run(`SELECT * FROM "${t.name}" LIMIT 100`); }} style={pillStyle}>
            {t.name} <span style={{ opacity: 0.5 }}>({t.row_count})</span>
          </button>
        ))}
      </div>

      {/* Query input */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && run()}
          placeholder="SELECT * FROM ..." style={{ ...inputStyle, flex: 1 }} />
        <button onClick={() => run()} style={btnStyle}>Run</button>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {history.slice(0, 5).map((h, i) => (
            <button key={i} onClick={() => { setQuery(h); run(h); }} style={{ ...pillStyle, fontSize: 9, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {h}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {results?.error && <div style={{ color: '#ef4444', fontSize: 12, padding: '8px 12px', background: 'rgba(239,68,68,0.06)', borderRadius: 8 }}>{results.error}</div>}
      {results?.columns && (
        <div style={{ overflow: 'auto', maxHeight: 400, fontSize: 11 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>{results.columns.map(c => <th key={c} style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontWeight: 600, color: '#a78bfa', position: 'sticky', top: 0, background: '#0d0d14' }}>{c}</th>)}</tr>
            </thead>
            <tbody>
              {results.rows.map((row, i) => (
                <tr key={i}>{row.map((val, j) => <td key={j} style={{ padding: '4px 8px', borderBottom: '1px solid rgba(255,255,255,0.03)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val === null ? <i style={{ opacity: 0.3 }}>null</i> : String(val).slice(0, 100)}</td>)}</tr>
              ))}
            </tbody>
          </table>
          <div style={{ opacity: 0.4, marginTop: 6 }}>{results.row_count} rows</div>
        </div>
      )}
    </div>
  );
}

// ─── Git Panel ───────────────────────────────────────────────────────────────

function GitPanel() {
  const [data, setData] = useState(null);
  const [branchInfo, setBranchInfo] = useState(null);
  const [detailedLog, setDetailedLog] = useState(null);
  const [sessionSummary, setSessionSummary] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [commitMsg, setCommitMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [diffFile, setDiffFile] = useState(null);
  const [diffContent, setDiffContent] = useState(null);
  const [diffLoading, setDiffLoading] = useState(false);
  const [subTab, setSubTab] = useState('summary'); // summary, files, log, stash, actions
  const [actionLog, setActionLog] = useState([]);
  const [stashes, setStashes] = useState([]);
  const [editableSummary, setEditableSummary] = useState('');
  const [summaryEdited, setSummaryEdited] = useState(false);

  const logAction = useCallback((type, msg) => {
    setActionLog(prev => [{ type, msg, ts: Date.now() }, ...prev].slice(0, 50));
  }, []);

  const summaryEditedRef = useRef(false);
  const [refreshing, setRefreshing] = useState(false);

  // Sync ref outside render via effect
  useEffect(() => { summaryEditedRef.current = summaryEdited; }, [summaryEdited]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const [status, branch, log, summary] = await Promise.all([
        invoke('dev_git_status').catch(() => null),
        invoke('dev_git_branch_info').catch(() => null),
        invoke('dev_git_log_detailed').catch(() => null),
        invoke('dev_git_session_summary').catch(() => null),
      ]);
      if (status) setData(status);
      if (branch) setBranchInfo(branch);
      if (log) setDetailedLog(log);
      if (summary) {
        setSessionSummary(summary);
        if (!summaryEditedRef.current) setEditableSummary(summary.summary_text || '');
      }
    } catch { /* ignore */ }
    setRefreshing(false);
  }, []);

  // Load once on mount — user must click Refresh for updates
  const hasLoadedRef = useRef(false);
  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      // Defer to avoid synchronous setState in effect
      Promise.resolve().then(refresh);
    }
  }, [refresh]);

  const viewDiff = async (filePath) => {
    if (diffFile === filePath) { setDiffFile(null); setDiffContent(null); return; }
    setDiffFile(filePath);
    setDiffLoading(true);
    try {
      const res = await invoke('dev_git_diff', { filePath });
      setDiffContent(res);
    } catch (err) { setDiffContent({ diff: `Error: ${err}`, type: 'error' }); }
    setDiffLoading(false);
  };

  const commitAll = async () => {
    if (!commitMsg.trim() || !data?.files?.length) return;
    setLoading(true);
    try {
      const allFiles = data.files.map(f => f.path);
      await invoke('dev_git_stage', { files: allFiles });
      await invoke('dev_git_commit', { message: commitMsg });
      logAction('success', `Committed all ${allFiles.length} file(s): "${commitMsg}"`);
      setResult({ type: 'success', msg: 'Committed all changes successfully' });
      setCommitMsg(''); setSelected(new Set()); setSummaryEdited(false);
      await refresh();
    } catch (err) {
      logAction('error', `Commit failed: ${err}`);
      setResult({ type: 'error', msg: String(err) });
    }
    setLoading(false);
  };

  const stageAndCommit = async () => {
    if (selected.size === 0 || !commitMsg.trim()) return;
    setLoading(true);
    try {
      await invoke('dev_git_stage', { files: [...selected] });
      await invoke('dev_git_commit', { message: commitMsg });
      logAction('success', `Committed ${selected.size} file(s): "${commitMsg}"`);
      setResult({ type: 'success', msg: 'Committed successfully' });
      setCommitMsg(''); setSelected(new Set());
      await refresh();
    } catch (err) {
      logAction('error', `Commit failed: ${err}`);
      setResult({ type: 'error', msg: String(err) });
    }
    setLoading(false);
  };

  const push = async () => {
    setLoading(true);
    try {
      const res = await invoke('dev_git_push');
      logAction('success', `Pushed to origin/${res.branch || 'main'}`);
      setResult({ type: 'success', msg: `Pushed to origin/${res.branch || 'main'}` });
      await refresh();
    } catch (err) {
      logAction('error', `Push failed: ${err}`);
      setResult({ type: 'error', msg: String(err) });
    }
    setLoading(false);
  };

  const pull = async () => {
    setLoading(true);
    try {
      const res = await invoke('dev_git_pull');
      logAction('success', `Pulled from origin/${res.branch || 'main'}`);
      setResult({ type: 'success', msg: `Pulled latest from origin/${res.branch || 'main'}` });
      await refresh();
    } catch (err) {
      logAction('error', `Pull failed: ${err}`);
      setResult({ type: 'error', msg: String(err) });
    }
    setLoading(false);
  };

  const stashAction = async (action) => {
    setLoading(true);
    try {
      const res = await invoke('dev_git_stash', { action });
      if (action === 'list') {
        setStashes(res.stashes || []);
      } else {
        logAction('success', `Stash ${action}: ${res.output || 'OK'}`);
        setResult({ type: 'success', msg: `Stash ${action} successful` });
        await refresh();
      }
    } catch (err) {
      logAction('error', `Stash ${action} failed: ${err}`);
      setResult({ type: 'error', msg: String(err) });
    }
    setLoading(false);
  };

  // Use summary as commit message
  const useSummaryAsCommit = () => {
    const text = editableSummary.trim();
    if (text) setCommitMsg(text.split('\n').filter(l => l.trim()).join('; ').slice(0, 200));
  };

  useEffect(() => { if (subTab === 'stash') Promise.resolve().then(() => stashAction('list')); }, [subTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const statusColor = (s) => ({ added: '#4ade80', modified: '#fbbf24', deleted: '#ef4444', untracked: '#94a3b8', renamed: '#38bdf8', conflict: '#f472b6' }[s] || 'rgba(255,255,255,0.6)');
  const catColor = (c) => ({ 'bug-fix': '#ef4444', 'feature': '#4ade80', 'improvement': '#60a5fa', 'refactor': '#94a3b8' }[c] || '#94a3b8');
  const catLabel = (c) => ({ 'bug-fix': 'Bug Fix', 'feature': 'New Feature', 'improvement': 'Improvement', 'refactor': 'Refactor' }[c] || c);

  const totalAdditions = data?.files?.reduce((sum, f) => sum + (f.additions || 0), 0) || 0;
  const totalDeletions = data?.files?.reduce((sum, f) => sum + (f.deletions || 0), 0) || 0;
  const hasConflicts = data?.files?.some(f => f.status === 'conflict');
  const counts = sessionSummary?.counts || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#60a5fa', margin: 0 }}>Session Changes</h2>
          {branchInfo && (
            <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, fontFamily: 'monospace',
              background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.25)', color: '#93c5fd' }}>
              {branchInfo.branch || 'detached'}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {branchInfo?.last_fetch && (
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>fetched {branchInfo.last_fetch}</span>
          )}
          <button onClick={() => { setSummaryEdited(false); refresh(); }} disabled={refreshing}
            style={{ ...pillStyle, opacity: refreshing ? 0.5 : 1 }}>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(105px, 1fr))', gap: 8 }}>
        {counts.bug_fixes > 0 && <StatCard label="Bug Fixes" value={counts.bug_fixes} color="#ef4444" />}
        {counts.features > 0 && <StatCard label="Features" value={counts.features} color="#4ade80" />}
        {counts.improvements > 0 && <StatCard label="Improved" value={counts.improvements} color="#60a5fa" />}
        {counts.refactors > 0 && <StatCard label="Refactored" value={counts.refactors} color="#94a3b8" />}
        <StatCard label="Files" value={counts.total || data?.files?.length || 0} color="#fbbf24" />
        <StatCard label="Lines" value={`+${totalAdditions} -${totalDeletions}`} color="#a78bfa" />
        {branchInfo?.ahead > 0 && <StatCard label="Ahead" value={branchInfo.ahead} color="#a78bfa" />}
      </div>

      {/* Alerts */}
      {branchInfo?.behind > 0 && (
        <div style={{ padding: '8px 12px', borderRadius: 8, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(249,115,22,0.08)', color: '#fb923c', border: '1px solid rgba(249,115,22,0.2)' }}>
          <span>{branchInfo.behind} commit(s) behind remote — pull recommended</span>
          <button onClick={pull} disabled={loading} style={{ ...pillStyle, color: '#fb923c', borderColor: 'rgba(249,115,22,0.3)' }}>Pull Now</button>
        </div>
      )}

      {hasConflicts && (
        <div style={{ padding: '8px 12px', borderRadius: 8, fontSize: 12,
          background: 'rgba(244,114,182,0.08)', color: '#f472b6', border: '1px solid rgba(244,114,182,0.2)' }}>
          Merge conflicts detected — resolve before committing
        </div>
      )}

      {result && (
        <div style={{ padding: '8px 12px', borderRadius: 8, fontSize: 12,
          background: result.type === 'success' ? 'rgba(74,222,128,0.08)' : 'rgba(239,68,68,0.08)',
          color: result.type === 'success' ? '#4ade80' : '#ef4444',
          border: `1px solid ${result.type === 'success' ? 'rgba(74,222,128,0.2)' : 'rgba(239,68,68,0.2)'}`,
        }}>{result.msg}</div>
      )}

      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {[
          { id: 'summary', label: 'Session Summary' },
          { id: 'files', label: `Files (${data?.files?.length || 0})` },
          { id: 'log', label: 'Commit Log' },
          { id: 'stash', label: `Stash (${branchInfo?.stash_count || 0})` },
          { id: 'actions', label: `Action Log (${actionLog.length})` },
        ].map(t => (
          <button key={t.id} onClick={() => setSubTab(t.id)} style={{
            ...pillStyle,
            background: subTab === t.id ? 'rgba(96,165,250,0.15)' : pillStyle.background,
            color: subTab === t.id ? '#93c5fd' : pillStyle.color,
            borderColor: subTab === t.id ? 'rgba(96,165,250,0.3)' : 'rgba(255,255,255,0.08)',
          }}>{t.label}</button>
        ))}
      </div>

      {/* === Session Summary Tab (DEFAULT) === */}
      {subTab === 'summary' && (
        <>
          {/* Categorized change cards */}
          {sessionSummary?.changes?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Group by category */}
              {['bug-fix', 'feature', 'improvement', 'refactor'].map(cat => {
                const items = sessionSummary.changes.filter(c => c.category === cat);
                if (items.length === 0) return null;
                return (
                  <div key={cat} style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: catColor(cat) }} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: catColor(cat) }}>{catLabel(cat)}</span>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>({items.length} file{items.length !== 1 ? 's' : ''})</span>
                    </div>
                    {items.map(item => (
                      <div key={item.file} style={{ padding: '4px 0 4px 16px', borderLeft: `2px solid ${catColor(cat)}30` }}>
                        {item.summary?.length > 0 ? (
                          item.summary.map((s, i) => (
                            <div key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', padding: '2px 0' }}>{s}</div>
                          ))
                        ) : (
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Changed: {item.area}</div>
                        )}
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', marginTop: 2 }}>{item.file}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ ...cardStyle, textAlign: 'center', padding: 32, color: 'rgba(255,255,255,0.15)', fontSize: 12 }}>
              No uncommitted changes — working tree clean
            </div>
          )}

          {/* Editable summary for commit message */}
          {sessionSummary?.changes?.length > 0 && (
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>Commit Summary (editable)</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => { setEditableSummary(sessionSummary.summary_text || ''); setSummaryEdited(false); }} style={pillStyle}>Reset</button>
                  <button onClick={useSummaryAsCommit} style={{ ...pillStyle, color: '#4ade80', borderColor: 'rgba(74,222,128,0.25)' }}>Use as Commit Msg</button>
                </div>
              </div>
              <textarea
                value={editableSummary}
                onChange={e => { setEditableSummary(e.target.value); setSummaryEdited(true); }}
                style={{ ...inputStyle, minHeight: 100, resize: 'vertical', lineHeight: 1.6 }}
                placeholder="Session summary will appear here..."
              />
            </div>
          )}

          {/* Commit + Push controls */}
          {data?.files?.length > 0 && (
            <>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={commitMsg} onChange={e => setCommitMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && commitAll()}
                  placeholder="Commit message..." style={{ ...inputStyle, flex: 1 }} />
                <button onClick={commitAll} disabled={loading || !commitMsg.trim()}
                  style={{ ...btnStyle, opacity: loading || !commitMsg.trim() ? 0.4 : 1 }}>
                  Commit All ({data?.files?.length || 0})
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={pull} disabled={loading} style={{ ...btnStyle, background: 'rgba(249,115,22,0.12)', borderColor: 'rgba(249,115,22,0.25)', color: '#fb923c' }}>Pull</button>
                <button onClick={push} disabled={loading} style={{ ...btnStyle, background: 'rgba(96,165,250,0.12)', borderColor: 'rgba(96,165,250,0.25)', color: '#60a5fa' }}>
                  Push{branchInfo?.ahead > 0 ? ` (${branchInfo.ahead})` : ''}
                </button>
                <button onClick={() => stashAction('save')} disabled={loading || !data?.files?.length} style={{ ...btnStyle, background: 'rgba(148,163,184,0.12)', borderColor: 'rgba(148,163,184,0.25)', color: '#94a3b8' }}>Stash</button>
              </div>
            </>
          )}
        </>
      )}

      {/* === Files Tab (raw file view) === */}
      {subTab === 'files' && (
        <>
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>Changed Files</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => setSelected(new Set())} style={pillStyle}>Clear</button>
                <button onClick={() => data?.files && setSelected(new Set(data.files.map(f => f.path)))} style={pillStyle}>Select All</button>
              </div>
            </div>
            <div style={{ maxHeight: 300, overflow: 'auto' }}>
              {(!data?.files || data.files.length === 0) && (
                <div style={{ padding: 20, textAlign: 'center', color: 'rgba(255,255,255,0.15)', fontSize: 12 }}>Working tree clean</div>
              )}
              {data?.files?.map(f => (
                <div key={f.path}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <input type="checkbox" checked={selected.has(f.path)} onChange={() => {
                      setSelected(prev => { const n = new Set(prev); n.has(f.path) ? n.delete(f.path) : n.add(f.path); return n; });
                    }} style={{ accentColor: '#7c3aed' }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: statusColor(f.status), minWidth: 16 }}>{f.status_code}</span>
                    <span
                      onClick={() => viewDiff(f.path)}
                      style={{ flex: 1, fontFamily: 'monospace', fontSize: 11, color: statusColor(f.status), cursor: 'pointer', textDecoration: diffFile === f.path ? 'underline' : 'none' }}
                    >{f.path}</span>
                    {(f.additions > 0 || f.deletions > 0) && (
                      <span style={{ fontSize: 10, opacity: 0.6 }}>
                        {f.additions > 0 && <span style={{ color: '#4ade80' }}>+{f.additions}</span>}
                        {f.additions > 0 && f.deletions > 0 && ' '}
                        {f.deletions > 0 && <span style={{ color: '#ef4444' }}>-{f.deletions}</span>}
                      </span>
                    )}
                    <button onClick={() => viewDiff(f.path)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 10, padding: '2px 6px' }}>
                      {diffFile === f.path ? '▼' : 'diff'}
                    </button>
                  </div>
                  {diffFile === f.path && (
                    <div style={{ padding: '8px 12px 12px', background: 'rgba(0,0,0,0.25)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      {diffLoading ? (
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Loading diff...</div>
                      ) : (
                        <pre style={{ margin: 0, fontSize: 10, fontFamily: 'monospace', maxHeight: 300, overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all', lineHeight: 1.5 }}>
                          {diffContent?.diff?.split('\n').map((line, i) => {
                            const color = line.startsWith('+') ? '#4ade80' : line.startsWith('-') ? '#ef4444' : line.startsWith('@@') ? '#60a5fa' : 'rgba(255,255,255,0.45)';
                            const bg = line.startsWith('+') ? 'rgba(74,222,128,0.06)' : line.startsWith('-') ? 'rgba(239,68,68,0.06)' : 'transparent';
                            return <div key={i} style={{ color, background: bg, padding: '0 4px' }}>{line}</div>;
                          })}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <input value={commitMsg} onChange={e => setCommitMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && stageAndCommit()}
              placeholder="Commit message..." style={{ ...inputStyle, flex: 1 }} />
            <button onClick={stageAndCommit} disabled={loading || !commitMsg.trim() || selected.size === 0}
              style={{ ...btnStyle, opacity: loading || !commitMsg.trim() || selected.size === 0 ? 0.4 : 1 }}>
              Commit ({selected.size})
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={pull} disabled={loading} style={{ ...btnStyle, background: 'rgba(249,115,22,0.12)', borderColor: 'rgba(249,115,22,0.25)', color: '#fb923c' }}>Pull</button>
            <button onClick={push} disabled={loading} style={{ ...btnStyle, background: 'rgba(96,165,250,0.12)', borderColor: 'rgba(96,165,250,0.25)', color: '#60a5fa' }}>
              Push{branchInfo?.ahead > 0 ? ` (${branchInfo.ahead})` : ''}
            </button>
          </div>
        </>
      )}

      {/* === Commit Log Tab === */}
      {subTab === 'log' && (
        <div style={cardStyle}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>Commit History (last 30)</div>
          <div style={{ maxHeight: 400, overflow: 'auto' }}>
            {detailedLog?.commits?.map((c, i) => (
              <div key={i} style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ color: '#a78bfa', fontWeight: 600, fontFamily: 'monospace', fontSize: 11, flexShrink: 0, marginTop: 1 }}>{c.sha}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.message}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                    {c.author} · {c.date}
                  </div>
                </div>
              </div>
            ))}
            {(!detailedLog?.commits || detailedLog.commits.length === 0) && (
              <div style={{ padding: 20, textAlign: 'center', color: 'rgba(255,255,255,0.15)', fontSize: 12 }}>No commits found</div>
            )}
          </div>
        </div>
      )}

      {/* === Stash Tab === */}
      {subTab === 'stash' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => stashAction('save')} disabled={loading || !data?.files?.length} style={btnStyle}>Stash Current Changes</button>
            {stashes.length > 0 && (
              <button onClick={() => stashAction('pop')} disabled={loading} style={{ ...btnStyle, background: 'rgba(74,222,128,0.12)', borderColor: 'rgba(74,222,128,0.25)', color: '#4ade80' }}>Pop Latest</button>
            )}
            <button onClick={() => stashAction('list')} disabled={loading} style={pillStyle}>Refresh List</button>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Stash List</div>
            {stashes.length === 0 && (
              <div style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.15)', fontSize: 12 }}>No stashes</div>
            )}
            {stashes.map((s, i) => (
              <div key={i} style={{ padding: '5px 0', fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>{s}</div>
            ))}
          </div>
        </div>
      )}

      {/* === Action Log Tab === */}
      {subTab === 'actions' && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>Git Operation Log</span>
            <button onClick={() => setActionLog([])} style={pillStyle}>Clear</button>
          </div>
          <div style={{ maxHeight: 350, overflow: 'auto' }}>
            {actionLog.length === 0 && (
              <div style={{ padding: 20, textAlign: 'center', color: 'rgba(255,255,255,0.15)', fontSize: 12 }}>No operations logged yet</div>
            )}
            {actionLog.map((entry, i) => (
              <div key={i} style={{ padding: '5px 8px', borderBottom: '1px solid rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                  background: entry.type === 'success' ? '#4ade80' : '#ef4444',
                }} />
                <span style={{ flex: 1, fontSize: 11, fontFamily: 'monospace', color: entry.type === 'success' ? 'rgba(255,255,255,0.7)' : '#fca5a5' }}>{entry.msg}</span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>
                  {new Date(entry.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Diagnostics (Environment + Schema + Perf + Flags) ───────────────────────

function DiagnosticsPanel() {
  const [env, setEnv] = useState(null);
  const [flags, setFlags] = useState(getAllFlags());
  const [characters, setCharacters] = useState([]);
  const [charId, setCharId] = useState('');
  const [schemaDiff, setSchemaDiff] = useState(null);
  const [memory, setMemory] = useState(null);
  const [subPanel, setSubPanel] = useState('env'); // env, schema, flags

  useEffect(() => { invoke('dev_check_environment').then(setEnv).catch(err => setEnv({ error: String(err) })); }, []);
  useEffect(() => { invoke('list_characters').then(setCharacters).catch(e => console.error('Failed to list characters:', e)); }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (performance.memory) setMemory({
        used: (performance.memory.usedJSHeapSize / 1048576).toFixed(1),
        total: (performance.memory.totalJSHeapSize / 1048576).toFixed(1),
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const checkSchema = async () => {
    if (!charId) return;
    try { setSchemaDiff(await invoke('dev_get_schema_diff', { characterId: charId })); }
    catch (err) { setSchemaDiff({ error: String(err) }); }
  };

  const migrateSchema = async () => {
    if (!charId) return;
    try { await invoke('dev_run_migrations', { characterId: charId }); await checkSchema(); }
    catch (err) { setSchemaDiff(d => ({ ...d, migrationError: String(err) })); }
  };

  const toggleFlag = (id, current) => {
    setFlag(id, !current);
    setFlags(getAllFlags());
  };

  const stats = getIpcStats();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#2dd4bf', margin: 0 }}>Diagnostics</h2>

      {/* Sub-panel tabs */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { id: 'env', label: 'Environment' },
          { id: 'schema', label: 'Schema Check' },
          { id: 'flags', label: 'Feature Flags' },
        ].map(t => (
          <button key={t.id} onClick={() => setSubPanel(t.id)} style={{
            ...pillStyle,
            background: subPanel === t.id ? 'rgba(45,212,191,0.15)' : pillStyle.background,
            color: subPanel === t.id ? '#2dd4bf' : pillStyle.color,
            borderColor: subPanel === t.id ? 'rgba(45,212,191,0.3)' : 'rgba(255,255,255,0.08)',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Environment */}
      {subPanel === 'env' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Performance stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
            <StatCard label="FPS" value={<FPSValue />} color="#4ade80" />
            <StatCard label="IPC Avg" value={`${stats.avg.toFixed(1)}ms`} color="#a78bfa" />
            <StatCard label="IPC P95" value={`${stats.p95.toFixed(1)}ms`} color="#a78bfa" />
            {memory && <StatCard label="Heap" value={`${memory.used}MB`} color="#38bdf8" sub={`of ${memory.total}MB`} />}
          </div>

          {/* Env details */}
          <div style={cardStyle}>
            {env?.error && <div style={{ color: '#ef4444' }}>{env.error}</div>}
            {env && !env.error && Object.entries(env).map(([key, val]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ opacity: 0.5, fontWeight: 600, fontSize: 12 }}>{key.replace(/_/g, ' ')}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 11 }}>{String(val)}</span>
              </div>
            ))}
            {!env && <div style={{ opacity: 0.4 }}>Loading...</div>}
          </div>
        </div>
      )}

      {/* Schema Check */}
      {subPanel === 'schema' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <select value={charId} onChange={e => setCharId(e.target.value)} style={{ ...inputStyle, flex: 1, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
              <option value="">Select character...</option>
              {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button onClick={checkSchema} disabled={!charId} style={btnStyle}>Check</button>
            <button onClick={migrateSchema} disabled={!charId} style={pillStyle}>Migrate</button>
          </div>
          {schemaDiff?.error && <div style={{ color: '#ef4444', fontSize: 12 }}>{schemaDiff.error}</div>}
          {schemaDiff?.issues?.length > 0 && schemaDiff.issues.map((issue, i) => (
            <div key={i} style={{
              padding: '6px 10px', borderRadius: 6, fontSize: 12,
              background: issue.severity === 'error' ? 'rgba(239,68,68,0.08)' : 'rgba(251,191,36,0.08)',
              color: issue.severity === 'error' ? '#fca5a5' : '#fde68a',
            }}>{issue.type}: {issue.table}{issue.column ? `.${issue.column}` : ''}</div>
          ))}
          {schemaDiff?.issues?.length === 0 && <div style={{ color: '#4ade80', fontSize: 12 }}>Schema is up to date</div>}
          {!schemaDiff && <div style={{ ...cardStyle, textAlign: 'center', padding: 32, color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>Select a character and click Check to validate schema</div>}
        </div>
      )}

      {/* Feature Flags */}
      {subPanel === 'flags' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>Toggle dev features. Changes take effect on next reload.</p>
          {flags.map(f => (
            <label key={f.id} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '10px 14px' }}>
              <input type="checkbox" checked={f.value} onChange={() => toggleFlag(f.id, f.value)}
                style={{ width: 16, height: 16, accentColor: '#7c3aed' }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{f.label}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>{f.id}</div>
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Bug Report ──────────────────────────────────────────────────────────────

function BugReportPanel() {
  const [report, setReport] = useState(null);
  const [desc, setDesc] = useState('');
  const [generating, setGenerating] = useState(false);

  const generate = async () => {
    setGenerating(true);
    try {
      const data = await invoke('dev_collect_bug_report', { characterId: null });
      data.user_description = desc;
      // Attach frontend errors
      data.frontend_errors = _frontendErrors.slice(0, 20).map(e => ({
        level: e.level, source: e.source, message: e.message,
        time: new Date(e.ts).toISOString(),
      }));
      // Attach IPC errors
      data.ipc_errors = ipcLog.filter(e => e.status === 'error').slice(-10).map(e => ({
        command: e.command, error: e.error, duration: e.duration,
      }));
      setReport(data);
    } catch (err) { setReport({ error: String(err) }); }
    setGenerating(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#ef4444', margin: 0 }}>Bug Report</h2>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
        Generate a full snapshot of the app state including frontend errors, IPC failures, git state, and environment info.
      </p>

      <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe what went wrong..."
        style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} />

      <button onClick={generate} disabled={generating} style={btnStyle}>
        {generating ? 'Collecting...' : 'Generate Bug Report'}
      </button>

      {report && !report.error && (
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <button onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(report, null, 2));
            }} style={pillStyle}>Copy to clipboard</button>
            <button onClick={() => {
              const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a'); a.href = url; a.download = `bug-report-${Date.now()}.json`; a.click();
              URL.revokeObjectURL(url);
            }} style={pillStyle}>Save to file</button>
          </div>
          <pre style={{ ...cardStyle, overflow: 'auto', maxHeight: 300, fontSize: 10, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(report, null, 2)}
          </pre>
        </div>
      )}
      {report?.error && <div style={{ color: '#ef4444', fontSize: 12 }}>{report.error}</div>}
    </div>
  );
}

// ─── Main Dev Dashboard ──────────────────────────────────────────────────────

export default function DevDashboard() {
  const { clearMode } = useAppMode();
  const [section, setSection] = useState('health');

  // Track error count for badge
  const [errorBadge, setErrorBadge] = useState(0);
  useEffect(() => {
    _installFrontendCapture();
    const interval = setInterval(() => {
      const feCount = _frontendErrors.filter(e => e.level === 'error').length;
      const ipcCount = ipcLog.filter(e => e.status === 'error').length;
      setErrorBadge(feCount + ipcCount);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (section) {
      case 'health':      return <HealthPanel />;
      case 'console':     return <ConsolePanel />;
      case 'db':          return <DbPanel />;
      case 'git':         return null; // Git panel rendered separately to persist state
      case 'diagnostics': return <DiagnosticsPanel />;
      case 'bug-report':  return <BugReportPanel />;
      default:            return <HealthPanel />;
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 'var(--dev-banner-h, 0px)', left: 0, right: 0, bottom: 0,
      display: 'flex', background: '#0d0d14',
    }}>
      {/* Sidebar */}
      <div style={{
        width: 200, flexShrink: 0, borderRight: '1px solid rgba(124,58,237,0.15)',
        background: 'rgba(124,58,237,0.02)', display: 'flex', flexDirection: 'column',
        overflow: 'auto',
      }}>
        {/* Header */}
        <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
          <div style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: 16, fontWeight: 700, color: '#a78bfa' }}>
            Dev Tools
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>{APP_VERSION}</div>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, padding: '8px 6px' }}>
          {SIDEBAR_SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '9px 10px', borderRadius: 8,
                border: 'none', cursor: 'pointer', textAlign: 'left',
                fontSize: 12, fontWeight: section === s.id ? 600 : 400,
                background: section === s.id ? 'rgba(124,58,237,0.15)' : 'transparent',
                color: section === s.id ? '#a78bfa' : 'rgba(255,255,255,0.45)',
                transition: 'all 0.15s', marginBottom: 2,
              }}
              onMouseEnter={e => { if (section !== s.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
              onMouseLeave={e => { if (section !== s.id) e.currentTarget.style.background = 'transparent'; }}
            >
              <span>{s.label}</span>
              {s.id === 'health' && errorBadge > 0 && (
                <span style={{
                  padding: '1px 6px', borderRadius: 8, fontSize: 9, fontWeight: 700,
                  background: 'rgba(239,68,68,0.2)', color: '#ef4444',
                }}>
                  {errorBadge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(124,58,237,0.1)', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>
            Ctrl+Shift+D for floating panel
          </div>
          <button onClick={clearMode} style={{
            width: '100%', padding: '8px 12px', borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
            color: 'rgba(255,255,255,0.4)', fontSize: 11, cursor: 'pointer',
            fontFamily: 'var(--font-display, "Cinzel", serif)', letterSpacing: '0.06em',
          }}>
            Switch Mode
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '24px 32px' }}>
        {renderContent()}
        {/* Git panel always mounted so session logs persist across tab switches */}
        <div style={{ display: section === 'git' ? 'block' : 'none' }}>
          <GitPanel />
        </div>
      </div>
    </div>
  );
}
