import { useState, useEffect, useCallback, memo } from 'react';
import { Dice5, Eye, EyeOff, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const DICE_TYPES = [4, 6, 8, 10, 12, 20, 100];

const TOAST_STYLE = {
  background: 'rgba(30, 20, 40, 0.95)',
  color: '#e2e8f0',
  fontFamily: 'var(--font-ui)',
  fontSize: '0.85rem',
};

const rollDice = (sides, count = 1, modifier = 0) => {
  const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
  return { rolls, total: rolls.reduce((a, b) => a + b, 0) + modifier, sides, count, modifier };
};

const CUSTOM_ROLL_REGEX = /^(\d+)?d(\d+)([+-]\d+)?$/;

function parseCustomRoll(input) {
  const match = input.trim().toLowerCase().match(CUSTOM_ROLL_REGEX);
  if (!match) return null;
  const count = parseInt(match[1] || '1', 10);
  const sides = parseInt(match[2], 10);
  const modifier = match[3] ? parseInt(match[3], 10) : 0;
  if (count < 1 || count > 100 || sides < 1 || sides > 1000) return null;
  return { count, sides, modifier };
}

function formatTimestamp(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function formatRollLabel(result) {
  let label = result.count > 1 ? `${result.count}d${result.sides}` : `d${result.sides}`;
  if (result.modifier > 0) label += `+${result.modifier}`;
  else if (result.modifier < 0) label += `${result.modifier}`;
  return label;
}

function SecretRollPanel({ onClose }) {
  const [history, setHistory] = useState([]);
  const [customInput, setCustomInput] = useState('');
  const [flashId, setFlashId] = useState(null);
  const maxHistory = 10;

  const addRoll = useCallback((result) => {
    const entry = {
      id: Date.now() + Math.random(),
      label: formatRollLabel(result),
      rolls: result.rolls,
      total: result.total,
      sides: result.sides,
      count: result.count,
      modifier: result.modifier,
      timestamp: new Date(),
    };
    setHistory((prev) => [entry, ...prev].slice(0, maxHistory));
    setFlashId(entry.id);
    toast('Rolled secretly', {
      icon: '🎲',
      style: {
        ...TOAST_STYLE,
        border: '1px solid rgba(192, 132, 252, 0.3)',
      },
      duration: 1500,
    });
  }, []);

  useEffect(() => {
    if (flashId) {
      const timer = setTimeout(() => setFlashId(null), 600);
      return () => clearTimeout(timer);
    }
  }, [flashId]);

  const handleQuickRoll = (sides) => {
    const result = rollDice(sides);
    addRoll(result);
  };

  const handleCustomRoll = () => {
    const parsed = parseCustomRoll(customInput);
    if (!parsed) {
      toast.error('Invalid format. Use e.g. 2d6+3', {
        style: TOAST_STYLE,
      });
      return;
    }
    const result = rollDice(parsed.sides, parsed.count, parsed.modifier);
    addRoll(result);
    setCustomInput('');
  };

  const clearHistory = () => {
    setHistory([]);
    toast('History cleared', {
      style: TOAST_STYLE,
      duration: 1200,
    });
  };

  const isNat20 = (entry) => entry.sides === 20 && entry.count === 1 && entry.rolls[0] === 20;
  const isNat1 = (entry) => entry.sides === 20 && entry.count === 1 && entry.rolls[0] === 1;

  return (
    <div style={styles.panel}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <EyeOff size={16} style={{ color: '#c084fc' }} />
          <span style={styles.title}>Secret Roll</span>
        </div>
        <button onClick={onClose} style={styles.closeBtn} title="Close">
          <X size={14} />
        </button>
      </div>

      {/* Quick Roll Buttons */}
      <div style={styles.section}>
        <div style={styles.sectionLabel}>Quick Roll</div>
        <div style={styles.diceGrid}>
          {DICE_TYPES.map((sides) => (
            <button
              key={sides}
              onClick={() => handleQuickRoll(sides)}
              style={styles.diceBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(192, 132, 252, 0.25)';
                e.currentTarget.style.borderColor = '#c084fc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(192, 132, 252, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(192, 132, 252, 0.25)';
              }}
            >
              d{sides}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Roll */}
      <div style={styles.section}>
        <div style={styles.sectionLabel}>Custom Roll</div>
        <div style={styles.customRow}>
          <input
            type="text"
            placeholder="e.g. 2d6+3"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCustomRoll()}
            style={styles.customInput}
          />
          <button onClick={handleCustomRoll} style={styles.rollBtn}>
            <Dice5 size={14} />
            Roll
          </button>
        </div>
      </div>

      {/* Roll History */}
      <div style={styles.section}>
        <div style={styles.historyHeader}>
          <div style={styles.sectionLabel}>
            <Eye size={13} style={{ color: '#c084fc', marginRight: 4 }} />
            History
          </div>
          {history.length > 0 && (
            <button onClick={clearHistory} style={styles.clearBtn} title="Clear History">
              <Trash2 size={12} />
            </button>
          )}
        </div>
        <div style={styles.historyList}>
          {history.length === 0 ? (
            <div style={styles.emptyState}>No rolls yet</div>
          ) : (
            history.map((entry) => {
              const nat20 = isNat20(entry);
              const nat1 = isNat1(entry);
              const isFlashing = flashId === entry.id;
              return (
                <div
                  key={entry.id}
                  style={{
                    ...styles.historyItem,
                    ...(isFlashing ? styles.flash : {}),
                    ...(nat20 ? styles.nat20Border : {}),
                    ...(nat1 ? styles.nat1Border : {}),
                  }}
                >
                  <div style={styles.historyTop}>
                    <span style={styles.historyLabel}>{entry.label}</span>
                    {nat20 && <span style={styles.nat20Badge}>NAT 20!</span>}
                    {nat1 && <span style={styles.nat1Badge}>NAT 1!</span>}
                    <span style={styles.historyTotal}>
                      {entry.total}
                    </span>
                  </div>
                  <div style={styles.historyBottom}>
                    {entry.count > 1 && (
                      <span style={styles.historyRolls}>
                        [{entry.rolls.join(', ')}]
                        {entry.modifier !== 0 && (
                          <span>{entry.modifier > 0 ? ` +${entry.modifier}` : ` ${entry.modifier}`}</span>
                        )}
                      </span>
                    )}
                    {entry.count === 1 && entry.modifier !== 0 && (
                      <span style={styles.historyRolls}>
                        {entry.rolls[0]}{entry.modifier > 0 ? ` +${entry.modifier}` : ` ${entry.modifier}`}
                      </span>
                    )}
                    <span style={styles.historyTime}>{formatTimestamp(entry.timestamp)}</span>
                  </div>
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
    display: 'flex',
    alignItems: 'center',
  },
  diceGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 5,
  },
  diceBtn: {
    background: 'rgba(192, 132, 252, 0.08)',
    border: '1px solid rgba(192, 132, 252, 0.25)',
    borderRadius: 6,
    color: '#e2e8f0',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.8rem',
    fontWeight: 600,
    padding: '5px 10px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  customRow: {
    display: 'flex',
    gap: 6,
  },
  customInput: {
    flex: 1,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(192, 132, 252, 0.2)',
    borderRadius: 6,
    color: '#e2e8f0',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.82rem',
    padding: '5px 8px',
    outline: 'none',
  },
  rollBtn: {
    background: 'rgba(192, 132, 252, 0.15)',
    border: '1px solid rgba(192, 132, 252, 0.35)',
    borderRadius: 6,
    color: '#c084fc',
    fontFamily: 'var(--font-ui)',
    fontSize: '0.8rem',
    fontWeight: 600,
    padding: '5px 12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    transition: 'all 0.15s ease',
  },
  historyHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    padding: 3,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    transition: 'color 0.15s',
  },
  historyList: {
    maxHeight: 180,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(192,132,252,0.15) transparent',
  },
  emptyState: {
    color: '#64748b',
    fontSize: '0.78rem',
    textAlign: 'center',
    padding: '12px 0',
    fontStyle: 'italic',
  },
  historyItem: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 6,
    padding: '6px 8px',
    transition: 'all 0.3s ease',
  },
  flash: {
    background: 'rgba(192, 132, 252, 0.18)',
    borderColor: 'rgba(192, 132, 252, 0.4)',
    boxShadow: '0 0 12px rgba(192, 132, 252, 0.2)',
  },
  nat20Border: {
    borderColor: 'rgba(74, 222, 128, 0.4)',
    boxShadow: '0 0 8px rgba(74, 222, 128, 0.15)',
  },
  nat1Border: {
    borderColor: 'rgba(248, 113, 113, 0.4)',
    boxShadow: '0 0 8px rgba(248, 113, 113, 0.15)',
  },
  historyTop: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  historyLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.78rem',
    color: '#c084fc',
    fontWeight: 600,
  },
  nat20Badge: {
    fontSize: '0.68rem',
    fontWeight: 700,
    color: '#4ade80',
    background: 'rgba(74, 222, 128, 0.12)',
    borderRadius: 4,
    padding: '1px 6px',
    letterSpacing: '0.04em',
  },
  nat1Badge: {
    fontSize: '0.68rem',
    fontWeight: 700,
    color: '#f87171',
    background: 'rgba(248, 113, 113, 0.12)',
    borderRadius: 4,
    padding: '1px 6px',
    letterSpacing: '0.04em',
  },
  historyTotal: {
    marginLeft: 'auto',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#e2e8f0',
  },
  historyBottom: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  historyRolls: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    color: '#64748b',
  },
  historyTime: {
    fontSize: '0.68rem',
    color: '#475569',
    marginLeft: 'auto',
  },
};

export default memo(SecretRollPanel);
