import { useState, useEffect, useCallback, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { ipcLog, subscribe as subscribeIpc, getIpcStats } from './devInvoke';
import { getAllFlags, setFlag } from './featureFlags';

const TABS = ['DB', 'IPC', 'Env', 'Flags', 'Perf', 'Logs', 'Schema', 'Bug Report'];

export default function DevToolsPanel() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('DB');

  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setOpen(o => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', top: 'var(--dev-banner-h, 24px)', right: 0, bottom: 0,
      width: '520px', zIndex: 99998,
      background: '#0a0a12', borderLeft: '1px solid rgba(124,58,237,0.3)',
      display: 'flex', flexDirection: 'column',
      fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.85)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(124,58,237,0.1)',
      }}>
        <span style={{ fontWeight: 700, fontSize: '13px', color: '#a78bfa' }}>Dev Tools</span>
        <button onClick={() => setOpen(false)} style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
          cursor: 'pointer', fontSize: '16px',
        }}>✕</button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: '2px', padding: '4px 8px',
        borderBottom: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap',
      }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600,
            background: tab === t ? 'rgba(124,58,237,0.2)' : 'transparent',
            border: tab === t ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
            color: tab === t ? '#a78bfa' : 'rgba(255,255,255,0.5)',
            cursor: 'pointer',
          }}>{t}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '12px' }}>
        {tab === 'DB' && <DbPanel />}
        {tab === 'IPC' && <IpcPanel />}
        {tab === 'Env' && <EnvPanel />}
        {tab === 'Flags' && <FlagsPanel />}
        {tab === 'Perf' && <PerfPanel />}
        {tab === 'Logs' && <LogsPanel />}
        {tab === 'Schema' && <SchemaPanel />}
        {tab === 'Bug Report' && <BugReportPanel />}
      </div>
    </div>
  );
}

// ─── DB Inspector ─────────────────────────────────────────────────────────

function DbPanel() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [charId, setCharId] = useState(null);
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    invoke('list_characters').then(setCharacters).catch(() => {});
  }, []);

  useEffect(() => {
    invoke('dev_list_tables', { characterId: charId }).then(setTables).catch(() => {});
  }, [charId]);

  const runQuery = async () => {
    if (!query.trim()) return;
    try {
      const res = await invoke('dev_query_db', { characterId: charId, query });
      setResults(res);
    } catch (err) {
      setResults({ error: String(err) });
    }
  };

  const browseTable = (tableName) => {
    setSelectedTable(tableName);
    setQuery(`SELECT * FROM "${tableName}" LIMIT 100`);
    invoke('dev_query_db', { characterId: charId, query: `SELECT * FROM "${tableName}" LIMIT 100` })
      .then(setResults)
      .catch(err => setResults({ error: String(err) }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
      <select value={charId || ''} onChange={e => setCharId(e.target.value || null)} style={selectStyle}>
        <option value="">Wiki DB</option>
        {characters.map(c => (
          <option key={c.id} value={c.id}>{c.name} ({c.primary_class})</option>
        ))}
      </select>

      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {tables.map(t => (
          <button key={t.name} onClick={() => browseTable(t.name)} style={{
            ...pillStyle,
            background: selectedTable === t.name ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.05)',
          }}>
            {t.name} <span style={{ opacity: 0.5 }}>({t.row_count})</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '4px' }}>
        <input value={query} onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && runQuery()}
          placeholder="SELECT * FROM ..."
          style={{ ...inputStyle, flex: 1 }} />
        <button onClick={runQuery} style={btnStyle}>Run</button>
      </div>

      {results?.error && <div style={{ color: '#ef4444', fontSize: '11px' }}>{results.error}</div>}
      {results?.columns && (
        <div style={{ overflow: 'auto', flex: 1, fontSize: '10px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>{results.columns.map(c => (
                <th key={c} style={thStyle}>{c}</th>
              ))}</tr>
            </thead>
            <tbody>
              {results.rows.map((row, i) => (
                <tr key={i}>{row.map((val, j) => (
                  <td key={j} style={tdStyle}>{val === null ? <i style={{ opacity: 0.3 }}>null</i> : String(val).slice(0, 80)}</td>
                ))}</tr>
              ))}
            </tbody>
          </table>
          <div style={{ opacity: 0.4, marginTop: '4px' }}>{results.row_count} rows</div>
        </div>
      )}
    </div>
  );
}

// ─── IPC Logger ─────────────────────────────────────────────────────────────

function IpcPanel() {
  const [entries, setEntries] = useState([...ipcLog]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    return subscribeIpc(() => setEntries([...ipcLog]));
  }, []);

  const filtered = filter
    ? entries.filter(e => e.command.toLowerCase().includes(filter.toLowerCase()))
    : entries;

  const stats = getIpcStats();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
      <div style={{ display: 'flex', gap: '12px', fontSize: '10px', opacity: 0.6 }}>
        <span>Total: {stats.total}</span>
        <span>Avg: {stats.avg.toFixed(1)}ms</span>
        <span>P95: {stats.p95.toFixed(1)}ms</span>
        <span>Max: {stats.max.toFixed(1)}ms</span>
      </div>
      <input value={filter} onChange={e => setFilter(e.target.value)}
        placeholder="Filter commands..." style={inputStyle} />
      <div style={{ overflow: 'auto', flex: 1, fontSize: '10px' }}>
        {filtered.slice(-100).reverse().map(e => (
          <div key={e.id} style={{
            padding: '4px 8px', borderBottom: '1px solid rgba(255,255,255,0.04)',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: e.status === 'success' ? '#4ade80' : e.status === 'error' ? '#ef4444' : '#fbbf24',
              flexShrink: 0,
            }} />
            <span style={{ fontFamily: 'monospace', fontWeight: 600, minWidth: '140px' }}>{e.command}</span>
            <span style={{ opacity: 0.4, flex: 1 }}>{e.duration ? `${e.duration.toFixed(1)}ms` : '...'}</span>
            {e.error && <span style={{ color: '#ef4444', fontSize: '9px' }}>{e.error.slice(0, 40)}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Environment Check ──────────────────────────────────────────────────────

function EnvPanel() {
  const [env, setEnv] = useState(null);

  useEffect(() => {
    invoke('dev_check_environment').then(setEnv).catch(err => setEnv({ error: String(err) }));
  }, []);

  if (!env) return <div style={{ opacity: 0.4 }}>Loading...</div>;
  if (env.error) return <div style={{ color: '#ef4444' }}>{env.error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {Object.entries(env).map(([key, val]) => (
        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <span style={{ opacity: 0.6, fontWeight: 600 }}>{key.replace(/_/g, ' ')}</span>
          <span style={{ fontFamily: 'monospace', fontSize: '11px' }}>{String(val)}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Feature Flags ──────────────────────────────────────────────────────────

function FlagsPanel() {
  const [flags, setFlags] = useState(getAllFlags());

  const toggle = (id, current) => {
    setFlag(id, !current);
    setFlags(getAllFlags());
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ opacity: 0.5, fontSize: '10px' }}>Changes take effect on next reload</div>
      {flags.map(f => (
        <label key={f.id} style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px',
          background: 'rgba(255,255,255,0.03)', borderRadius: '6px', cursor: 'pointer',
        }}>
          <input type="checkbox" checked={f.value} onChange={() => toggle(f.id, f.value)} />
          <span>{f.label}</span>
        </label>
      ))}
    </div>
  );
}

// ─── Performance Overlay ────────────────────────────────────────────────────

function PerfPanel() {
  const [fps, setFps] = useState(0);
  const [memory, setMemory] = useState(null);
  const frameRef = useRef(0);
  const lastRef = useRef(performance.now());

  useEffect(() => {
    let running = true;
    let frames = 0;

    const loop = () => {
      if (!running) return;
      frames++;
      const now = performance.now();
      if (now - lastRef.current >= 1000) {
        setFps(frames);
        frames = 0;
        lastRef.current = now;

        // Memory (Chrome/webview only)
        if (performance.memory) {
          setMemory({
            used: (performance.memory.usedJSHeapSize / 1048576).toFixed(1),
            total: (performance.memory.totalJSHeapSize / 1048576).toFixed(1),
            limit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(0),
          });
        }
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    return () => { running = false; };
  }, []);

  const stats = getIpcStats();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <StatBox label="FPS" value={fps} color={fps >= 55 ? '#4ade80' : fps >= 30 ? '#fbbf24' : '#ef4444'} />
        <StatBox label="IPC Avg" value={`${stats.avg.toFixed(1)}ms`} color="#a78bfa" />
        <StatBox label="IPC P95" value={`${stats.p95.toFixed(1)}ms`} color="#a78bfa" />
        <StatBox label="IPC Calls" value={stats.total} color="#a78bfa" />
        {memory && <>
          <StatBox label="Heap Used" value={`${memory.used} MB`} color="#38bdf8" />
          <StatBox label="Heap Total" value={`${memory.total} MB`} color="#38bdf8" />
        </>}
      </div>
    </div>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div style={{
      padding: '10px 12px', borderRadius: '8px',
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ fontSize: '10px', opacity: 0.5, marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '18px', fontWeight: 700, color }}>{value}</div>
    </div>
  );
}

// ─── Log Viewer ─────────────────────────────────────────────────────────────

function LogsPanel() {
  const [logs, setLogs] = useState([]);
  const [consoleLogs, setConsoleLogs] = useState([]);

  useEffect(() => {
    invoke('dev_get_log_buffer').then(setLogs).catch(() => {});
    const interval = setInterval(() => {
      invoke('dev_get_log_buffer').then(setLogs).catch(() => {});
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Capture console.log/warn in dev
  useEffect(() => {
    const origLog = console.log;
    const origWarn = console.warn;
    const buffer = [];

    console.log = (...args) => {
      origLog.apply(console, args);
      buffer.push({ level: 'log', msg: args.map(String).join(' '), time: Date.now() });
      if (buffer.length > 200) buffer.shift();
      setConsoleLogs([...buffer]);
    };
    console.warn = (...args) => {
      origWarn.apply(console, args);
      buffer.push({ level: 'warn', msg: args.map(String).join(' '), time: Date.now() });
      if (buffer.length > 200) buffer.shift();
      setConsoleLogs([...buffer]);
    };

    return () => {
      console.log = origLog;
      console.warn = origWarn;
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
      <div style={{ fontWeight: 600, opacity: 0.6 }}>Backend Logs</div>
      <div style={{ overflow: 'auto', maxHeight: '40%', fontSize: '10px', fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '6px' }}>
        {logs.length === 0 && <div style={{ opacity: 0.3 }}>No backend logs yet</div>}
        {logs.map((l, i) => <div key={i} style={{ padding: '1px 0', opacity: 0.8 }}>{l}</div>)}
      </div>

      <div style={{ fontWeight: 600, opacity: 0.6 }}>Frontend Console</div>
      <div style={{ overflow: 'auto', flex: 1, fontSize: '10px', fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '6px' }}>
        {consoleLogs.length === 0 && <div style={{ opacity: 0.3 }}>No console output yet</div>}
        {consoleLogs.slice(-100).map((l, i) => (
          <div key={i} style={{ padding: '1px 0', color: l.level === 'warn' ? '#fbbf24' : 'rgba(255,255,255,0.7)' }}>
            [{l.level}] {l.msg.slice(0, 200)}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Schema Diff / Migration ────────────────────────────────────────────────

function SchemaPanel() {
  const [characters, setCharacters] = useState([]);
  const [charId, setCharId] = useState('');
  const [diff, setDiff] = useState(null);
  const [migrating, setMigrating] = useState(false);

  useEffect(() => {
    invoke('list_characters').then(setCharacters).catch(() => {});
  }, []);

  const checkSchema = async () => {
    if (!charId) return;
    try {
      const res = await invoke('dev_get_schema_diff', { characterId: charId });
      setDiff(res);
    } catch (err) {
      setDiff({ error: String(err) });
    }
  };

  const runMigrations = async () => {
    if (!charId) return;
    setMigrating(true);
    try {
      await invoke('dev_run_migrations', { characterId: charId });
      await checkSchema(); // refresh
    } catch (err) {
      setDiff(d => ({ ...d, migrationError: String(err) }));
    }
    setMigrating(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        <select value={charId} onChange={e => setCharId(e.target.value)} style={{ ...selectStyle, flex: 1 }}>
          <option value="">Select character...</option>
          {characters.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button onClick={checkSchema} disabled={!charId} style={btnStyle}>Check</button>
        <button onClick={runMigrations} disabled={!charId || migrating} style={btnStyle}>
          {migrating ? 'Running...' : 'Migrate'}
        </button>
      </div>

      {diff?.error && <div style={{ color: '#ef4444', fontSize: '11px' }}>{diff.error}</div>}
      {diff?.migrationError && <div style={{ color: '#ef4444', fontSize: '11px' }}>{diff.migrationError}</div>}

      {diff?.issues && diff.issues.length > 0 && (
        <div style={{ fontSize: '11px' }}>
          <div style={{ fontWeight: 600, color: '#fbbf24', marginBottom: '4px' }}>{diff.issue_count} issues found:</div>
          {diff.issues.map((issue, i) => (
            <div key={i} style={{
              padding: '4px 8px', marginBottom: '2px', borderRadius: '4px',
              background: issue.severity === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(251,191,36,0.1)',
              color: issue.severity === 'error' ? '#fca5a5' : '#fde68a',
            }}>
              {issue.type}: {issue.table}{issue.column ? `.${issue.column}` : ''}
            </div>
          ))}
        </div>
      )}

      {diff?.issues && diff.issues.length === 0 && (
        <div style={{ color: '#4ade80', fontSize: '11px' }}>Schema is up to date</div>
      )}
    </div>
  );
}

// ─── Bug Report ─────────────────────────────────────────────────────────────

function BugReportPanel() {
  const [report, setReport] = useState(null);
  const [description, setDescription] = useState('');
  const [generating, setGenerating] = useState(false);

  const generate = async () => {
    setGenerating(true);
    try {
      const data = await invoke('dev_collect_bug_report', { characterId: null });
      data.user_description = description;
      data.ipc_recent = ipcLog.slice(-20).map(e => ({
        command: e.command,
        status: e.status,
        duration: e.duration,
        error: e.error,
      }));
      setReport(data);
    } catch (err) {
      setReport({ error: String(err) });
    }
    setGenerating(false);
  };

  const copyReport = () => {
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
  };

  const saveReport = async () => {
    try {
      await invoke('write_bug_report', { content: JSON.stringify(report, null, 2) });
    } catch { /* ignore */ }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <textarea value={description} onChange={e => setDescription(e.target.value)}
        placeholder="Describe what went wrong..."
        style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} />
      <button onClick={generate} disabled={generating} style={btnStyle}>
        {generating ? 'Collecting...' : 'Generate Bug Report'}
      </button>

      {report && !report.error && (
        <div style={{ fontSize: '10px' }}>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
            <button onClick={copyReport} style={pillStyle}>Copy to clipboard</button>
            <button onClick={saveReport} style={pillStyle}>Save to file</button>
          </div>
          <pre style={{
            background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '6px',
            overflow: 'auto', maxHeight: '300px', fontSize: '9px', fontFamily: 'monospace',
          }}>
            {JSON.stringify(report, null, 2)}
          </pre>
        </div>
      )}
      {report?.error && <div style={{ color: '#ef4444', fontSize: '11px' }}>{report.error}</div>}
    </div>
  );
}

// ─── Shared Styles ──────────────────────────────────────────────────────────

const inputStyle = {
  padding: '6px 10px', borderRadius: '6px', fontSize: '11px',
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  color: 'rgba(255,255,255,0.85)', outline: 'none', fontFamily: 'monospace',
};

const selectStyle = {
  ...inputStyle, cursor: 'pointer',
};

const btnStyle = {
  padding: '6px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
  background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
  color: '#a78bfa', cursor: 'pointer',
};

const pillStyle = {
  padding: '3px 8px', borderRadius: '4px', fontSize: '10px',
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
  color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
};

const thStyle = {
  textAlign: 'left', padding: '4px 6px', borderBottom: '1px solid rgba(255,255,255,0.1)',
  position: 'sticky', top: 0, background: '#0a0a12', fontWeight: 600, color: '#a78bfa',
};

const tdStyle = {
  padding: '3px 6px', borderBottom: '1px solid rgba(255,255,255,0.03)',
  maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
};
