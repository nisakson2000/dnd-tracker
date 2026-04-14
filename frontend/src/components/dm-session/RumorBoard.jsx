import { useState, useEffect, memo } from 'react';
import { MessageSquare, Plus, Trash2, Send, X, Shuffle, Eye } from 'lucide-react';

const STORAGE_KEY = 'codex_rumor_board';

const STATUS_ORDER = ['unheard', 'heard', 'investigated', 'resolved'];
const STATUS_COLORS = {
  unheard: '#818cf8',
  heard: '#fbbf24',
  investigated: '#60a5fa',
  resolved: '#4ade80',
};

const RUMOR_TEMPLATES = [
  'A dragon has been spotted near [location]',
  'The tavern keeper is secretly a retired adventurer',
  'Strange lights appear in the graveyard at midnight',
  'A merchant guild is smuggling contraband through the sewers',
  "The baron's heir has gone missing under mysterious circumstances",
  'An ancient tomb has been unsealed by recent earthquakes',
  'Cultists have been seen gathering in the abandoned mill',
  'A bounty hunter is looking for someone matching your description',
  'The local herbalist brews more than just potions',
  'Miners report strange sounds echoing from the deep tunnels',
];

function getTruthColor(pct) {
  if (pct <= 30) return '#ef4444';
  if (pct <= 60) return '#eab308';
  return '#22c55e';
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function RumorBoard({ onBroadcast, onClose }) {
  const [rumors, setRumors] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [newText, setNewText] = useState('');
  const [newTruth, setNewTruth] = useState(50);
  const [newSource, setNewSource] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rumors));
  }, [rumors]);

  const addRumor = () => {
    const text = newText.trim();
    if (!text) return;
    setRumors(prev => [
      ...prev,
      {
        id: generateId(),
        text,
        truth: newTruth,
        source: newSource.trim() || '',
        status: 'unheard',
      },
    ]);
    setNewText('');
    setNewTruth(50);
    setNewSource('');
  };

  const quickGenerate = () => {
    const template = RUMOR_TEMPLATES[Math.floor(Math.random() * RUMOR_TEMPLATES.length)];
    setRumors(prev => [
      ...prev,
      {
        id: generateId(),
        text: template,
        truth: Math.floor(Math.random() * 101),
        source: '',
        status: 'unheard',
      },
    ]);
  };

  const cycleStatus = (id) => {
    setRumors(prev =>
      prev.map(r => {
        if (r.id !== id) return r;
        const idx = STATUS_ORDER.indexOf(r.status);
        const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
        return { ...r, status: next };
      })
    );
  };

  const deleteRumor = (id) => {
    setRumors(prev => prev.filter(r => r.id !== id));
  };

  const broadcastRumor = (rumor) => {
    if (onBroadcast) onBroadcast(rumor.text);
  };

  return (
    <div style={styles.panel}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <MessageSquare size={16} color="#c084fc" />
          <span style={styles.title}>Rumor Board</span>
        </div>
        {onClose && (
          <button onClick={onClose} style={styles.closeBtn} title="Close">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Rumor List */}
      <div style={styles.list}>
        {rumors.length === 0 && (
          <div style={styles.empty}>No rumors yet. Add one below or quick-generate.</div>
        )}
        {rumors.map(rumor => (
          <div key={rumor.id} style={styles.card}>
            <div style={styles.cardTop}>
              <p style={styles.rumorText}>{rumor.text}</p>
              <div style={styles.cardActions}>
                <button
                  onClick={() => broadcastRumor(rumor)}
                  style={styles.iconBtn}
                  title="Broadcast to players"
                >
                  <Send size={13} color="#c9a84c" />
                </button>
                <button
                  onClick={() => deleteRumor(rumor.id)}
                  style={styles.iconBtn}
                  title="Delete rumor"
                >
                  <Trash2 size={13} color="#ef4444" />
                </button>
              </div>
            </div>

            {/* Truth bar */}
            <div style={styles.truthRow}>
              <span style={styles.label}>Truth</span>
              <div style={styles.truthBarOuter}>
                <div
                  style={{
                    ...styles.truthBarInner,
                    width: `${rumor.truth}%`,
                    backgroundColor: getTruthColor(rumor.truth),
                  }}
                />
              </div>
              <span style={{ ...styles.truthPct, color: getTruthColor(rumor.truth) }}>
                {rumor.truth}%
              </span>
            </div>

            {/* Source + Status */}
            <div style={styles.metaRow}>
              {rumor.source && (
                <span style={styles.source}>
                  <Eye size={11} style={{ marginRight: 3, opacity: 0.7 }} />
                  {rumor.source}
                </span>
              )}
              <button
                onClick={() => cycleStatus(rumor.id)}
                style={{
                  ...styles.statusBadge,
                  backgroundColor: STATUS_COLORS[rumor.status] + '22',
                  color: STATUS_COLORS[rumor.status],
                  borderColor: STATUS_COLORS[rumor.status] + '55',
                }}
                title="Click to advance status"
              >
                {rumor.status}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Generate */}
      <button onClick={quickGenerate} style={styles.quickGenBtn}>
        <Shuffle size={13} />
        Quick Generate
      </button>

      {/* Add Rumor Form */}
      <div style={styles.form}>
        <textarea
          value={newText}
          onChange={e => setNewText(e.target.value)}
          placeholder="Enter a rumor..."
          style={styles.textarea}
          rows={2}
        />
        <div style={styles.formRow}>
          <label style={styles.label}>Truth</label>
          <input
            type="range"
            min={0}
            max={100}
            value={newTruth}
            onChange={e => setNewTruth(Number(e.target.value))}
            style={styles.slider}
          />
          <span style={{ ...styles.truthPct, color: getTruthColor(newTruth), minWidth: 32 }}>
            {newTruth}%
          </span>
        </div>
        <div style={styles.formRow}>
          <input
            value={newSource}
            onChange={e => setNewSource(e.target.value)}
            placeholder="Source (optional)"
            style={styles.input}
          />
          <button onClick={addRumor} style={styles.addBtn} disabled={!newText.trim()}>
            <Plus size={14} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  panel: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: 10,
    backgroundColor: 'rgba(17, 17, 24, 0.95)',
    borderRadius: 8,
    border: '1px solid rgba(192, 132, 252, 0.2)',
    fontFamily: 'var(--font-ui)',
    fontSize: 13,
    color: '#d1d5db',
    maxHeight: '100%',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontWeight: 600,
    fontSize: 14,
    color: '#e5e7eb',
    letterSpacing: 0.3,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
    padding: 2,
    display: 'flex',
    alignItems: 'center',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    overflowY: 'auto',
    flex: 1,
    minHeight: 0,
    paddingRight: 2,
  },
  empty: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 12,
    padding: '16px 0',
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: 'rgba(30, 30, 44, 0.8)',
    borderRadius: 6,
    padding: '8px 10px',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 6,
  },
  rumorText: {
    margin: 0,
    fontSize: 12.5,
    lineHeight: 1.4,
    color: '#e5e7eb',
    flex: 1,
  },
  cardActions: {
    display: 'flex',
    gap: 2,
    flexShrink: 0,
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 3,
    display: 'flex',
    alignItems: 'center',
    borderRadius: 4,
    opacity: 0.7,
  },
  truthRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginTop: 5,
  },
  label: {
    fontSize: 11,
    color: '#9ca3af',
    flexShrink: 0,
  },
  truthBarOuter: {
    flex: 1,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  truthBarInner: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.2s ease',
  },
  truthPct: {
    fontSize: 11,
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    gap: 6,
  },
  source: {
    fontSize: 11,
    color: '#9ca3af',
    display: 'flex',
    alignItems: 'center',
    fontStyle: 'italic',
  },
  statusBadge: {
    fontSize: 10,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    padding: '2px 7px',
    borderRadius: 4,
    border: '1px solid',
    cursor: 'pointer',
    fontFamily: 'var(--font-mono)',
    background: 'none',
  },
  quickGenBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '6px 0',
    backgroundColor: 'rgba(192, 132, 252, 0.1)',
    border: '1px solid rgba(192, 132, 252, 0.25)',
    borderRadius: 5,
    color: '#c084fc',
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'var(--font-ui)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    borderTop: '1px solid rgba(255,255,255,0.06)',
    paddingTop: 8,
  },
  textarea: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 5,
    padding: '6px 8px',
    color: '#e5e7eb',
    fontSize: 12,
    fontFamily: 'var(--font-ui)',
    resize: 'vertical',
    outline: 'none',
  },
  formRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  slider: {
    flex: 1,
    accentColor: '#c084fc',
    height: 4,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 5,
    padding: '5px 8px',
    color: '#e5e7eb',
    fontSize: 12,
    fontFamily: 'var(--font-ui)',
    outline: 'none',
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '5px 12px',
    backgroundColor: 'rgba(201, 168, 76, 0.15)',
    border: '1px solid rgba(201, 168, 76, 0.35)',
    borderRadius: 5,
    color: '#c9a84c',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--font-ui)',
    flexShrink: 0,
  },
};

export default memo(RumorBoard);
