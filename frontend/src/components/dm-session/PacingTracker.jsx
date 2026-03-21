import { useState, useEffect, useCallback } from 'react';
import { Activity, TrendingUp, TrendingDown, X, Zap } from 'lucide-react';

const TENSION_LABELS = [
  { min: 1, max: 2, label: 'Calm', color: '#60a5fa' },
  { min: 3, max: 4, label: 'Building', color: '#2dd4bf' },
  { min: 5, max: 6, label: 'Tense', color: '#facc15' },
  { min: 7, max: 8, label: 'High Stakes', color: '#fb923c' },
  { min: 9, max: 10, label: 'Climax', color: '#ef4444' },
];

const PACING_SUGGESTIONS = [
  { min: 1, max: 3, text: 'Consider adding a mystery, social encounter, or foreshadowing' },
  { min: 4, max: 6, text: 'Good for exploration, puzzles, or meaningful choices' },
  { min: 7, max: 8, text: 'Time for combat, confrontation, or major reveals' },
  { min: 9, max: 10, text: 'Boss fight, climax, or dramatic turning point. Consider resolution soon.' },
];

function getTensionMeta(level) {
  return TENSION_LABELS.find((t) => level >= t.min && level <= t.max) || TENSION_LABELS[0];
}

function getSuggestion(level) {
  return PACING_SUGGESTIONS.find((s) => level >= s.min && level <= s.max) || PACING_SUGGESTIONS[0];
}

function formatTimestamp(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function getSegmentColor(index, currentLevel) {
  const segLevel = index + 1;
  if (segLevel > currentLevel) return 'rgba(255,255,255,0.05)';
  const meta = getTensionMeta(segLevel);
  return meta.color;
}

const STORAGE_KEY = 'codex_pacing_tracker';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Only restore if same session day
    const today = new Date().toDateString();
    if (parsed.sessionDate === today) {
      return {
        tension: parsed.tension || 5,
        log: (parsed.log || []).map((e) => ({ ...e, timestamp: new Date(e.timestamp) })),
      };
    }
  } catch { /* ignore */ }
  return null;
}

function saveState(tension, log) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        sessionDate: new Date().toDateString(),
        tension,
        log: log.map((e) => ({ ...e, timestamp: e.timestamp.toISOString() })),
      })
    );
  } catch { /* ignore */ }
}

export default function PacingTracker({ onClose }) {
  const [tension, setTension] = useState(5);
  const [log, setLog] = useState([]);

  // Load persisted state on mount
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setTension(saved.tension);
      setLog(saved.log);
    }
  }, []);

  // Persist on change
  useEffect(() => {
    saveState(tension, log);
  }, [tension, log]);

  const changeTension = useCallback((newLevel) => {
    const clamped = Math.max(1, Math.min(10, newLevel));
    setTension((prev) => {
      if (clamped === prev) return prev;
      const direction = clamped > prev ? 'up' : 'down';
      setLog((prevLog) => [
        {
          from: prev,
          to: clamped,
          direction,
          timestamp: new Date(),
        },
        ...prevLog,
      ].slice(0, 30));
      return clamped;
    });
  }, []);

  const meta = getTensionMeta(tension);
  const suggestion = getSuggestion(tension);

  return (
    <div style={styles.panel}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <Activity size={16} style={{ color: '#c084fc' }} />
          <span style={styles.title}>Pacing Tracker</span>
        </div>
        <button onClick={onClose} style={styles.closeBtn} title="Close">
          <X size={14} />
        </button>
      </div>

      {/* Tension Display */}
      <div style={styles.tensionDisplay}>
        <div style={styles.tensionValue}>
          <span style={{ ...styles.tensionNumber, color: meta.color }}>{tension}</span>
          <span style={{ ...styles.tensionLabel, color: meta.color }}>{meta.label}</span>
        </div>
        <div style={styles.tensionControls}>
          <button
            onClick={() => changeTension(tension - 1)}
            disabled={tension <= 1}
            style={{
              ...styles.adjustBtn,
              opacity: tension <= 1 ? 0.3 : 1,
            }}
            title="Decrease tension"
          >
            <TrendingDown size={14} />
          </button>
          <button
            onClick={() => changeTension(tension + 1)}
            disabled={tension >= 10}
            style={{
              ...styles.adjustBtn,
              opacity: tension >= 10 ? 0.3 : 1,
            }}
            title="Increase tension"
          >
            <TrendingUp size={14} />
          </button>
        </div>
      </div>

      {/* Tension Bar */}
      <div style={styles.barSection}>
        <div style={styles.barContainer}>
          {Array.from({ length: 10 }, (_, i) => (
            <button
              key={i}
              onClick={() => changeTension(i + 1)}
              style={{
                ...styles.barSegment,
                background: getSegmentColor(i, tension),
                opacity: i + 1 <= tension ? 1 : 0.35,
                boxShadow:
                  i + 1 === tension
                    ? `0 0 8px ${meta.color}55`
                    : 'none',
                border:
                  i + 1 === tension
                    ? `1px solid ${meta.color}88`
                    : '1px solid rgba(255,255,255,0.06)',
              }}
              title={`Set tension to ${i + 1}`}
            >
              <span style={styles.barLabel}>{i + 1}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Suggestion */}
      <div style={styles.suggestionBox}>
        <Zap size={13} style={{ color: '#c9a84c', flexShrink: 0, marginTop: 1 }} />
        <span style={styles.suggestionText}>{suggestion.text}</span>
      </div>

      {/* Tension Log */}
      <div style={styles.section}>
        <div style={styles.sectionLabel}>Tension Log</div>
        <div style={styles.logList}>
          {log.length === 0 ? (
            <div style={styles.emptyState}>No changes yet</div>
          ) : (
            log.map((entry, idx) => {
              const fromMeta = getTensionMeta(entry.from);
              const toMeta = getTensionMeta(entry.to);
              return (
                <div key={idx} style={styles.logItem}>
                  <span style={{ color: fromMeta.color, fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                    {entry.from}
                  </span>
                  <span style={{ color: '#64748b', fontSize: '0.72rem', margin: '0 3px' }}>
                    {entry.direction === 'up' ? '\u2192' : '\u2192'}
                  </span>
                  <span style={{ color: toMeta.color, fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                    {entry.to}
                  </span>
                  {entry.direction === 'up' ? (
                    <TrendingUp size={11} style={{ color: '#fb923c', marginLeft: 4 }} />
                  ) : (
                    <TrendingDown size={11} style={{ color: '#60a5fa', marginLeft: 4 }} />
                  )}
                  <span style={styles.logTime}>{formatTimestamp(entry.timestamp)}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  panel: {
    background: 'rgba(20, 16, 28, 0.95)',
    border: '1px solid rgba(192, 132, 252, 0.2)',
    borderRadius: 10,
    padding: '10px 12px 12px',
    fontFamily: 'var(--font-ui)',
    color: '#e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    maxWidth: 300,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#c084fc',
    letterSpacing: '0.02em',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: 4,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
  },
  tensionDisplay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tensionValue: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 8,
  },
  tensionNumber: {
    fontSize: '1.6rem',
    fontWeight: 800,
    fontFamily: 'var(--font-mono)',
    lineHeight: 1,
  },
  tensionLabel: {
    fontSize: '0.85rem',
    fontWeight: 600,
    letterSpacing: '0.03em',
  },
  tensionControls: {
    display: 'flex',
    gap: 4,
  },
  adjustBtn: {
    background: 'rgba(192, 132, 252, 0.1)',
    border: '1px solid rgba(192, 132, 252, 0.25)',
    borderRadius: 6,
    color: '#e2e8f0',
    cursor: 'pointer',
    padding: '5px 8px',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.15s ease',
  },
  barSection: {
    padding: '2px 0',
  },
  barContainer: {
    display: 'flex',
    gap: 2,
    width: '100%',
  },
  barSegment: {
    flex: 1,
    height: 24,
    borderRadius: 4,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    padding: 0,
  },
  barLabel: {
    fontSize: '0.62rem',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    color: 'rgba(0,0,0,0.6)',
  },
  suggestionBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 6,
    background: 'rgba(201, 168, 76, 0.08)',
    border: '1px solid rgba(201, 168, 76, 0.2)',
    borderRadius: 6,
    padding: '6px 8px',
  },
  suggestionText: {
    fontSize: '0.75rem',
    color: '#c9a84c',
    lineHeight: 1.35,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  sectionLabel: {
    fontSize: '0.72rem',
    fontWeight: 600,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  logList: {
    maxHeight: 130,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(192,132,252,0.15) transparent',
  },
  emptyState: {
    color: '#64748b',
    fontSize: '0.78rem',
    textAlign: 'center',
    padding: '10px 0',
    fontStyle: 'italic',
  },
  logItem: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 5,
    padding: '4px 7px',
    gap: 2,
  },
  logTime: {
    fontSize: '0.66rem',
    color: '#475569',
    marginLeft: 'auto',
  },
};
