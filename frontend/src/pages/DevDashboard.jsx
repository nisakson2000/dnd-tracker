import { useState, useEffect, useCallback, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { motion } from 'framer-motion';
import { useAppMode } from '../contexts/ModeContext';
import { APP_VERSION } from '../version';
import { getAllFlags, setFlag } from '../dev/featureFlags';
import { ipcLog, subscribe as subscribeIpc, getIpcStats } from '../dev/devInvoke';
import { useDevUpdateCheck } from '../hooks/useDevUpdateCheck';

// ─── Sidebar Tabs ─────────────────────────────────────────────────────────────

const SIDEBAR_SECTIONS = [
  { id: 'overview', label: 'Overview', icon: '🛠' },
  { id: 'player-settings', label: 'Player Settings', icon: '⚔' },
  { id: 'dm-settings', label: 'DM Settings', icon: '📖' },
  { id: 'flags', label: 'Feature Flags', icon: '🚩' },
  { id: 'git', label: 'Git Panel', icon: '📦' },
  { id: 'chat', label: 'Dev Chat', icon: '💬' },
  { id: 'db', label: 'DB Inspector', icon: '🗄' },
  { id: 'env', label: 'Environment', icon: '🖥' },
  { id: 'ipc', label: 'IPC Logger', icon: '📡' },
  { id: 'perf', label: 'Performance', icon: '📊' },
  { id: 'logs', label: 'Log Viewer', icon: '📋' },
  { id: 'schema', label: 'Schema Diff', icon: '🔍' },
  { id: 'bug-report', label: 'Bug Report', icon: '🐛' },
];

// ─── Shared styles ────────────────────────────────────────────────────────────

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

// ─── Overview Panel ───────────────────────────────────────────────────────────

function OverviewPanel() {
  const { peers } = useDevUpdateCheck();
  const [env, setEnv] = useState(null);

  useEffect(() => {
    invoke('dev_check_environment').then(setEnv).catch(() => {});
  }, []);

  const stats = getIpcStats();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#a78bfa', margin: 0 }}>Dev Dashboard</h2>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
        All developer tools and settings in one place. Use the sidebar to navigate.
      </p>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
        <StatCard label="Version" value={env?.app_version || APP_VERSION} color="#a78bfa" />
        <StatCard label="Git SHA" value={env?.git_sha || '...'} color="#60a5fa" />
        <StatCard label="Branch" value={env?.git_branch || '...'} color="#4ade80" />
        <StatCard label="Devs Online" value={peers.length + 1} color="#fbbf24" />
        <StatCard label="IPC Calls" value={stats.total} color="#f472b6" />
        <StatCard label="IPC Avg" value={`${stats.avg.toFixed(1)}ms`} color="#38bdf8" />
      </div>

      {/* Online Devs */}
      {peers.length > 0 && (
        <div style={cardStyle}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Online Devs</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {peers.map((p, i) => (
              <span key={i} style={{
                padding: '4px 10px', borderRadius: 6,
                background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)',
                color: '#a7f3d0', fontSize: 11,
              }}>
                {p.name} {p.version && <span style={{ opacity: 0.5 }}>v{p.version}</span>}
                {p.active_section && <span style={{ opacity: 0.6, marginLeft: 4 }}>editing {p.active_section}</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Keyboard shortcuts */}
      <div style={cardStyle}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Keyboard Shortcuts</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
          <div><kbd style={kbdStyle}>Ctrl+Shift+D</kbd> Dev Tools Panel</div>
          <div><kbd style={kbdStyle}>Ctrl+1-9</kbd> Section shortcuts</div>
        </div>
      </div>
    </div>
  );
}

const kbdStyle = {
  padding: '2px 6px', borderRadius: 4, fontSize: 10,
  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
  fontFamily: 'monospace', marginRight: 6,
};

function StatCard({ label, value, color }) {
  return (
    <div style={{
      padding: '12px 14px', borderRadius: 10,
      background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ fontSize: 10, opacity: 0.5, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color, fontFamily: 'monospace' }}>{value}</div>
    </div>
  );
}

// ─── Settings Panels (Player / DM) ────────────────────────────────────────────

function SettingsPanel({ title, subtitle, color }) {
  // Embeds the Settings component from the character view
  // Since Settings requires a characterId, we show the settings that apply globally
  const [characters, setCharacters] = useState([]);
  const [selectedChar, setSelectedChar] = useState(null);

  useEffect(() => {
    invoke('list_characters').then(setCharacters).catch(() => {});
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color, margin: 0 }}>{title}</h2>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{subtitle}</span>
      </div>

      {/* Character selector */}
      <select
        value={selectedChar || ''}
        onChange={e => setSelectedChar(e.target.value || null)}
        style={{ ...inputStyle, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}
      >
        <option value="">Select a character to manage...</option>
        {characters.map(c => (
          <option key={c.id} value={c.id}>{c.name} — {c.primary_class || 'No class'} (Lv{c.level || 1})</option>
        ))}
      </select>

      {selectedChar ? (
        <div style={cardStyle}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
            Managing character in {title.toLowerCase()} context. Open the character to access full settings.
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => window.location.href = `/character/${selectedChar}`} style={btnStyle}>
              Open Character
            </button>
            <button
              onClick={async () => {
                try {
                  const data = await invoke('export_character', { characterId: selectedChar });
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a'); a.href = url; a.download = `character-${selectedChar}.json`; a.click();
                  URL.revokeObjectURL(url);
                } catch (err) { console.warn('Export failed:', err); }
              }}
              style={pillStyle}
            >
              Export JSON
            </button>
          </div>
        </div>
      ) : (
        <div style={{ ...cardStyle, textAlign: 'center', padding: 32, color: 'rgba(255,255,255,0.25)' }}>
          Select a character above to manage it
        </div>
      )}

      {/* Character list */}
      <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
        All Characters ({characters.length})
      </div>
      {characters.map(c => (
        <div key={c.id} style={{
          ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          cursor: 'pointer', transition: 'border-color 0.2s',
        }}
          onClick={() => setSelectedChar(c.id)}
          onMouseEnter={e => e.currentTarget.style.borderColor = `${color}40`}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{c.name}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
              {c.race || '?'} {c.primary_class || '?'} — Level {c.level || 1}
            </div>
          </div>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>{c.id.slice(0, 8)}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Feature Flags ────────────────────────────────────────────────────────────

function FlagsPanel() {
  const [flags, setFlags] = useState(getAllFlags());

  const toggle = (id, current) => {
    setFlag(id, !current);
    setFlags(getAllFlags());
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#fbbf24', margin: 0 }}>Feature Flags</h2>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: 0 }}>Toggle dev features. Changes take effect on next reload.</p>
      {flags.map(f => (
        <label key={f.id} style={{
          ...cardStyle, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
        }}>
          <input type="checkbox" checked={f.value} onChange={() => toggle(f.id, f.value)}
            style={{ width: 16, height: 16, accentColor: '#7c3aed' }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{f.label}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>{f.id}</div>
          </div>
        </label>
      ))}
    </div>
  );
}

// ─── Git Panel ────────────────────────────────────────────────────────────────

function GitPanel() {
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [commitMsg, setCommitMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const refresh = useCallback(async () => {
    try { setData(await invoke('dev_git_status')); } catch {}
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const stageAndCommit = async () => {
    if (selected.size === 0 || !commitMsg.trim()) return;
    setLoading(true);
    try {
      await invoke('dev_git_stage', { files: [...selected] });
      await invoke('dev_git_commit', { message: commitMsg });
      setResult({ type: 'success', msg: 'Committed successfully' });
      setCommitMsg('');
      setSelected(new Set());
      await refresh();
    } catch (err) { setResult({ type: 'error', msg: String(err) }); }
    setLoading(false);
  };

  const push = async () => {
    setLoading(true);
    try {
      const res = await invoke('dev_git_push');
      setResult({ type: 'success', msg: `Pushed to origin/${res.branch || 'main'}` });
      await refresh();
    } catch (err) { setResult({ type: 'error', msg: String(err) }); }
    setLoading(false);
  };

  const statusColor = (s) => ({ added: '#4ade80', modified: '#fbbf24', deleted: '#ef4444', untracked: '#94a3b8', renamed: '#38bdf8' }[s] || 'rgba(255,255,255,0.6)');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#60a5fa', margin: 0 }}>Git Panel</h2>
        <button onClick={refresh} style={pillStyle}>Refresh</button>
      </div>

      {result && (
        <div style={{ padding: '8px 12px', borderRadius: 8, fontSize: 12,
          background: result.type === 'success' ? 'rgba(74,222,128,0.08)' : 'rgba(239,68,68,0.08)',
          color: result.type === 'success' ? '#4ade80' : '#ef4444',
          border: `1px solid ${result.type === 'success' ? 'rgba(74,222,128,0.2)' : 'rgba(239,68,68,0.2)'}`,
        }}>{result.msg}</div>
      )}

      {/* Changed files */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>
            Changed Files ({data?.files?.length || 0})
          </span>
          <button onClick={() => data?.files && setSelected(new Set(data.files.map(f => f.path)))} style={pillStyle}>Select All</button>
        </div>
        <div style={{ maxHeight: 250, overflow: 'auto' }}>
          {(!data?.files || data.files.length === 0) && (
            <div style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>Working tree clean</div>
          )}
          {data?.files?.map(f => (
            <label key={f.path} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px',
              cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.03)',
            }}>
              <input type="checkbox" checked={selected.has(f.path)} onChange={() => {
                setSelected(prev => { const n = new Set(prev); n.has(f.path) ? n.delete(f.path) : n.add(f.path); return n; });
              }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: statusColor(f.status), minWidth: 16 }}>{f.status_code}</span>
              <span style={{ flex: 1, fontFamily: 'monospace', fontSize: 11, color: statusColor(f.status) }}>{f.path}</span>
              {(f.additions > 0 || f.deletions > 0) && (
                <span style={{ fontSize: 10, opacity: 0.6 }}>
                  {f.additions > 0 && <span style={{ color: '#4ade80' }}>+{f.additions}</span>}
                  {f.additions > 0 && f.deletions > 0 && ' '}
                  {f.deletions > 0 && <span style={{ color: '#ef4444' }}>-{f.deletions}</span>}
                </span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Commit + Push */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={commitMsg} onChange={e => setCommitMsg(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && stageAndCommit()}
          placeholder="Commit message..." style={{ ...inputStyle, flex: 1 }} />
        <button onClick={stageAndCommit} disabled={loading || !commitMsg.trim() || selected.size === 0} style={btnStyle}>
          Commit ({selected.size})
        </button>
        <button onClick={push} disabled={loading} style={{ ...btnStyle, background: 'rgba(96,165,250,0.15)', borderColor: 'rgba(96,165,250,0.3)', color: '#60a5fa' }}>
          Push
        </button>
      </div>

      {/* Recent commits */}
      <div style={cardStyle}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Recent Commits</div>
        <div style={{ maxHeight: 200, overflow: 'auto', fontSize: 11, fontFamily: 'monospace' }}>
          {data?.commits?.map((c, i) => (
            <div key={i} style={{ padding: '3px 0', display: 'flex', gap: 8 }}>
              <span style={{ color: '#a78bfa', fontWeight: 600, flexShrink: 0 }}>{c.sha}</span>
              <span style={{ opacity: 0.7 }}>{c.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Chat Panel ───────────────────────────────────────────────────────────────

function ChatPanel() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [peers, setPeers] = useState([]);
  const endRef = useRef(null);

  useEffect(() => {
    invoke('dev_get_chat_messages').then(setMessages).catch(() => {});
    invoke('get_dev_peers').then(setPeers).catch(() => {});
    const interval = setInterval(() => { invoke('get_dev_peers').then(setPeers).catch(() => {}); }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let unlisten = null;
    listen('dev-chat-message', (e) => setMessages(prev => [...prev, e.payload])).then(fn => { unlisten = fn; });
    return () => { if (unlisten) unlisten(); };
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    setSending(true);
    try {
      await invoke('dev_send_chat', { message: input });
      setInput('');
      setMessages(await invoke('dev_get_chat_messages'));
    } catch {}
    setSending(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#4ade80', margin: 0 }}>Dev Chat</h2>

      {/* Online */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {peers.length === 0 && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>No other devs online</span>}
        {peers.map((p, i) => (
          <span key={i} style={{ padding: '3px 8px', borderRadius: 4, background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', color: '#a7f3d0', fontSize: 10 }}>
            {p.name} {p.active_section && <span style={{ opacity: 0.6 }}>: {p.active_section}</span>}
          </span>
        ))}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflow: 'auto', ...cardStyle, minHeight: 300 }}>
        {messages.length === 0 && <div style={{ textAlign: 'center', padding: 32, color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>No messages yet</div>}
        {messages.map((m, i) => (
          <div key={i} style={{ padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: 12 }}>
            <span style={{ color: '#a78bfa', fontWeight: 600, marginRight: 8 }}>{m.dev_name}</span>
            <span style={{ opacity: 0.3, fontSize: 10, marginRight: 8 }}>{new Date(m.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span style={{ opacity: 0.85 }}>{m.message}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Type a message..." style={{ ...inputStyle, flex: 1, fontFamily: '"DM Sans", sans-serif' }} />
        <button onClick={send} disabled={sending || !input.trim()} style={btnStyle}>Send</button>
      </div>
    </div>
  );
}

// ─── DB Inspector ─────────────────────────────────────────────────────────────

function DbPanel() {
  const [tables, setTables] = useState([]);
  const [charId, setCharId] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);

  useEffect(() => { invoke('list_characters').then(setCharacters).catch(() => {}); }, []);
  useEffect(() => { invoke('dev_list_tables', { characterId: charId }).then(setTables).catch(() => {}); }, [charId]);

  const run = async () => {
    if (!query.trim()) return;
    try { setResults(await invoke('dev_query_db', { characterId: charId, query })); }
    catch (err) { setResults({ error: String(err) }); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#f472b6', margin: 0 }}>DB Inspector</h2>
      <select value={charId || ''} onChange={e => setCharId(e.target.value || null)} style={{ ...inputStyle, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
        <option value="">Wiki DB</option>
        {characters.map(c => <option key={c.id} value={c.id}>{c.name} ({c.primary_class})</option>)}
      </select>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {tables.map(t => (
          <button key={t.name} onClick={() => { setQuery(`SELECT * FROM "${t.name}" LIMIT 100`); run(); }} style={pillStyle}>
            {t.name} <span style={{ opacity: 0.5 }}>({t.row_count})</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && run()}
          placeholder="SELECT * FROM ..." style={{ ...inputStyle, flex: 1 }} />
        <button onClick={run} style={btnStyle}>Run</button>
      </div>

      {results?.error && <div style={{ color: '#ef4444', fontSize: 12 }}>{results.error}</div>}
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

// ─── Environment ──────────────────────────────────────────────────────────────

function EnvPanel() {
  const [env, setEnv] = useState(null);
  useEffect(() => { invoke('dev_check_environment').then(setEnv).catch(err => setEnv({ error: String(err) })); }, []);

  if (!env) return <div style={{ opacity: 0.4 }}>Loading...</div>;
  if (env.error) return <div style={{ color: '#ef4444' }}>{env.error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#2dd4bf', margin: 0 }}>Environment</h2>
      {Object.entries(env).map(([key, val]) => (
        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <span style={{ opacity: 0.5, fontWeight: 600, fontSize: 13 }}>{key.replace(/_/g, ' ')}</span>
          <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{String(val)}</span>
        </div>
      ))}
    </div>
  );
}

// ─── IPC Logger ───────────────────────────────────────────────────────────────

function IpcPanel() {
  const [entries, setEntries] = useState([...ipcLog]);
  const [filter, setFilter] = useState('');

  useEffect(() => subscribeIpc(() => setEntries([...ipcLog])), []);

  const filtered = filter ? entries.filter(e => e.command.toLowerCase().includes(filter.toLowerCase())) : entries;
  const stats = getIpcStats();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#f97316', margin: 0 }}>IPC Logger</h2>
      <div style={{ display: 'flex', gap: 16, fontSize: 11, opacity: 0.5 }}>
        <span>Total: {stats.total}</span>
        <span>Avg: {stats.avg.toFixed(1)}ms</span>
        <span>P95: {stats.p95.toFixed(1)}ms</span>
        <span>Max: {stats.max.toFixed(1)}ms</span>
      </div>
      <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter commands..." style={inputStyle} />
      <div style={{ maxHeight: 400, overflow: 'auto', fontSize: 11 }}>
        {filtered.slice(-100).reverse().map(e => (
          <div key={e.id} style={{ padding: '5px 8px', borderBottom: '1px solid rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: e.status === 'success' ? '#4ade80' : e.status === 'error' ? '#ef4444' : '#fbbf24', flexShrink: 0 }} />
            <span style={{ fontFamily: 'monospace', fontWeight: 600, minWidth: 160 }}>{e.command}</span>
            <span style={{ opacity: 0.4, flex: 1 }}>{e.duration ? `${e.duration.toFixed(1)}ms` : '...'}</span>
            {e.error && <span style={{ color: '#ef4444', fontSize: 10 }}>{e.error.slice(0, 40)}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Performance ──────────────────────────────────────────────────────────────

function PerfPanel() {
  const [fps, setFps] = useState(0);
  const [memory, setMemory] = useState(null);
  const lastRef = useRef(performance.now());

  useEffect(() => {
    let running = true, frames = 0;
    const tick = () => {
      if (!running) return;
      frames++;
      const now = performance.now();
      if (now - lastRef.current >= 1000) {
        setFps(frames); frames = 0; lastRef.current = now;
        if (performance.memory) setMemory({
          used: (performance.memory.usedJSHeapSize / 1048576).toFixed(1),
          total: (performance.memory.totalJSHeapSize / 1048576).toFixed(1),
        });
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => { running = false; };
  }, []);

  const stats = getIpcStats();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#e879f9', margin: 0 }}>Performance</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <StatCard label="FPS" value={fps} color={fps >= 55 ? '#4ade80' : fps >= 30 ? '#fbbf24' : '#ef4444'} />
        <StatCard label="IPC Avg" value={`${stats.avg.toFixed(1)}ms`} color="#a78bfa" />
        <StatCard label="IPC P95" value={`${stats.p95.toFixed(1)}ms`} color="#a78bfa" />
        <StatCard label="IPC Calls" value={stats.total} color="#a78bfa" />
        {memory && <>
          <StatCard label="Heap Used" value={`${memory.used} MB`} color="#38bdf8" />
          <StatCard label="Heap Total" value={`${memory.total} MB`} color="#38bdf8" />
        </>}
      </div>
    </div>
  );
}

// ─── Log Viewer ───────────────────────────────────────────────────────────────

function LogsPanel() {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    invoke('dev_get_log_buffer').then(setLogs).catch(() => {});
    const interval = setInterval(() => { invoke('dev_get_log_buffer').then(setLogs).catch(() => {}); }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#94a3b8', margin: 0 }}>Log Viewer</h2>
      <div style={{ ...cardStyle, maxHeight: 500, overflow: 'auto', fontFamily: 'monospace', fontSize: 11, lineHeight: 1.6 }}>
        {logs.length === 0 && <div style={{ opacity: 0.3 }}>No backend logs yet</div>}
        {logs.map((l, i) => <div key={i} style={{ opacity: 0.8 }}>{l}</div>)}
      </div>
    </div>
  );
}

// ─── Schema Diff ──────────────────────────────────────────────────────────────

function SchemaPanel() {
  const [characters, setCharacters] = useState([]);
  const [charId, setCharId] = useState('');
  const [diff, setDiff] = useState(null);

  useEffect(() => { invoke('list_characters').then(setCharacters).catch(() => {}); }, []);

  const check = async () => {
    if (!charId) return;
    try { setDiff(await invoke('dev_get_schema_diff', { characterId: charId })); }
    catch (err) { setDiff({ error: String(err) }); }
  };

  const migrate = async () => {
    if (!charId) return;
    try { await invoke('dev_run_migrations', { characterId: charId }); await check(); }
    catch (err) { setDiff(d => ({ ...d, migrationError: String(err) })); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#facc15', margin: 0 }}>Schema Diff</h2>
      <div style={{ display: 'flex', gap: 8 }}>
        <select value={charId} onChange={e => setCharId(e.target.value)} style={{ ...inputStyle, flex: 1, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
          <option value="">Select character...</option>
          {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={check} disabled={!charId} style={btnStyle}>Check</button>
        <button onClick={migrate} disabled={!charId} style={pillStyle}>Migrate</button>
      </div>
      {diff?.error && <div style={{ color: '#ef4444', fontSize: 12 }}>{diff.error}</div>}
      {diff?.issues?.length > 0 && diff.issues.map((issue, i) => (
        <div key={i} style={{ padding: '6px 10px', borderRadius: 6, fontSize: 12,
          background: issue.severity === 'error' ? 'rgba(239,68,68,0.08)' : 'rgba(251,191,36,0.08)',
          color: issue.severity === 'error' ? '#fca5a5' : '#fde68a',
        }}>{issue.type}: {issue.table}{issue.column ? `.${issue.column}` : ''}</div>
      ))}
      {diff?.issues?.length === 0 && <div style={{ color: '#4ade80', fontSize: 12 }}>Schema is up to date</div>}
    </div>
  );
}

// ─── Bug Report ───────────────────────────────────────────────────────────────

function BugReportPanel() {
  const [report, setReport] = useState(null);
  const [desc, setDesc] = useState('');
  const [generating, setGenerating] = useState(false);

  const generate = async () => {
    setGenerating(true);
    try {
      const data = await invoke('dev_collect_bug_report', { characterId: null });
      data.user_description = desc;
      setReport(data);
    } catch (err) { setReport({ error: String(err) }); }
    setGenerating(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#ef4444', margin: 0 }}>Bug Report</h2>
      <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe what went wrong..."
        style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} />
      <button onClick={generate} disabled={generating} style={btnStyle}>
        {generating ? 'Collecting...' : 'Generate Bug Report'}
      </button>
      {report && !report.error && (
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <button onClick={() => navigator.clipboard.writeText(JSON.stringify(report, null, 2))} style={pillStyle}>Copy to clipboard</button>
          </div>
          <pre style={{ ...cardStyle, overflow: 'auto', maxHeight: 300, fontSize: 10, fontFamily: 'monospace' }}>
            {JSON.stringify(report, null, 2)}
          </pre>
        </div>
      )}
      {report?.error && <div style={{ color: '#ef4444', fontSize: 12 }}>{report.error}</div>}
    </div>
  );
}

// ─── Main Dev Dashboard ───────────────────────────────────────────────────────

export default function DevDashboard() {
  const { clearMode } = useAppMode();
  const [section, setSection] = useState('overview');

  const renderContent = () => {
    switch (section) {
      case 'overview': return <OverviewPanel />;
      case 'player-settings': return <SettingsPanel title="Player Settings" subtitle="Character management context" color="#c9a84c" />;
      case 'dm-settings': return <SettingsPanel title="DM Settings" subtitle="Campaign management context" color="#9b59b6" />;
      case 'flags': return <FlagsPanel />;
      case 'git': return <GitPanel />;
      case 'chat': return <ChatPanel />;
      case 'db': return <DbPanel />;
      case 'env': return <EnvPanel />;
      case 'ipc': return <IpcPanel />;
      case 'perf': return <PerfPanel />;
      case 'logs': return <LogsPanel />;
      case 'schema': return <SchemaPanel />;
      case 'bug-report': return <BugReportPanel />;
      default: return <OverviewPanel />;
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 'var(--dev-banner-h, 0px)', left: 0, right: 0, bottom: 0,
      display: 'flex', background: '#0d0d14',
    }}>
      {/* Sidebar */}
      <div style={{
        width: 220, flexShrink: 0, borderRight: '1px solid rgba(124,58,237,0.15)',
        background: 'rgba(124,58,237,0.02)', display: 'flex', flexDirection: 'column',
        overflow: 'auto',
      }}>
        {/* Header */}
        <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
          <div style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: 16, fontWeight: 700, color: '#a78bfa' }}>
            Dev Settings
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>{APP_VERSION}</div>
        </div>

        {/* Nav items */}
        <div style={{ flex: 1, padding: '8px 6px' }}>
          {SIDEBAR_SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 10px', borderRadius: 8,
                border: 'none', cursor: 'pointer', textAlign: 'left',
                fontSize: 12, fontWeight: section === s.id ? 600 : 400,
                background: section === s.id ? 'rgba(124,58,237,0.15)' : 'transparent',
                color: section === s.id ? '#a78bfa' : 'rgba(255,255,255,0.45)',
                transition: 'all 0.15s',
                marginBottom: 2,
              }}
              onMouseEnter={e => { if (section !== s.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
              onMouseLeave={e => { if (section !== s.id) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: 14, width: 20, textAlign: 'center' }}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Switch mode button */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(124,58,237,0.1)' }}>
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
      </div>
    </div>
  );
}
