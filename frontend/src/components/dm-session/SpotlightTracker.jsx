import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Users, Star, Plus, RotateCcw, X, Lightbulb } from 'lucide-react';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'codex_spotlight_tracker';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const today = new Date().toDateString();
    if (parsed.sessionDate === today) {
      return parsed.data || {};
    }
  } catch { /* ignore */ }
  return null;
}

function saveState(data) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ sessionDate: new Date().toDateString(), data })
    );
  } catch { /* ignore */ }
}

function formatTimestamp(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function SpotlightTracker({ players, onClose }) {
  // spotlight[playerId] = { count, lastTimestamp, note }
  const [spotlight, setSpotlight] = useState(() => {
    const saved = loadState();
    return saved || {};
  });

  const connectedPlayers = useMemo(
    () => (players || []).filter((p) => p.connected),
    [players]
  );

  // Persist on every change
  useEffect(() => {
    saveState(spotlight);
  }, [spotlight]);

  const getPlayerData = useCallback(
    (id) => spotlight[id] || { count: 0, lastTimestamp: null, note: '' },
    [spotlight]
  );

  const maxCount = useMemo(() => {
    if (connectedPlayers.length === 0) return 1;
    const counts = connectedPlayers.map((p) => getPlayerData(p.id).count);
    return Math.max(1, ...counts);
  }, [connectedPlayers, getPlayerData]);

  const minCount = useMemo(() => {
    if (connectedPlayers.length === 0) return 0;
    const counts = connectedPlayers.map((p) => getPlayerData(p.id).count);
    return Math.min(...counts);
  }, [connectedPlayers, getPlayerData]);

  const increment = useCallback((id) => {
    setSpotlight((prev) => {
      const current = prev[id] || { count: 0, lastTimestamp: null, note: '' };
      return {
        ...prev,
        [id]: { ...current, count: current.count + 1, lastTimestamp: Date.now() },
      };
    });
  }, []);

  const updateNote = useCallback((id, note) => {
    setSpotlight((prev) => {
      const current = prev[id] || { count: 0, lastTimestamp: null, note: '' };
      return { ...prev, [id]: { ...current, note } };
    });
  }, []);

  const resetAll = useCallback(() => {
    setSpotlight({});
    toast.success('Spotlight counts reset');
  }, []);

  const suggestFocus = useCallback(() => {
    if (connectedPlayers.length === 0) {
      toast('No connected players', { icon: '⚠️' });
      return;
    }
    const candidates = connectedPlayers.filter(
      (p) => getPlayerData(p.id).count === minCount
    );
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    if (pick) {
      toast(
        `Give the spotlight to ${pick.name}! They've had the fewest moments this session.`,
        {
          icon: '💡',
          duration: 5000,
          style: {
            background: 'rgba(30, 20, 40, 0.95)',
            color: '#e2e8f0',
            border: '1px solid #c9a84c',
          },
        }
      );
    }
  }, [connectedPlayers, getPlayerData, minCount]);

  // ─── Styles ─────────────────────────────────────────────
  const panelStyle = {
    background: 'rgba(20, 16, 32, 0.96)',
    border: '1px solid rgba(192, 132, 252, 0.25)',
    borderRadius: 12,
    padding: 16,
    fontFamily: 'var(--font-ui)',
    color: '#e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    maxWidth: 420,
    width: '100%',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const titleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 15,
    fontWeight: 600,
    color: '#c084fc',
  };

  const btnIcon = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#94a3b8',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
  };

  const actionRow = {
    display: 'flex',
    gap: 8,
  };

  const actionBtn = (accent) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '5px 10px',
    fontSize: 12,
    fontFamily: 'var(--font-ui)',
    fontWeight: 500,
    border: `1px solid ${accent}44`,
    borderRadius: 6,
    background: `${accent}18`,
    color: accent,
    cursor: 'pointer',
  });

  const listStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    maxHeight: 340,
    overflowY: 'auto',
  };

  return (
    <div style={panelStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <span style={titleStyle}>
          <Users size={16} />
          Spotlight Tracker
        </span>
        <button style={btnIcon} onClick={onClose} title="Close">
          <X size={16} />
        </button>
      </div>

      {/* Action buttons */}
      <div style={actionRow}>
        <button style={actionBtn('#c9a84c')} onClick={suggestFocus}>
          <Lightbulb size={13} />
          Suggest Focus
        </button>
        <button style={actionBtn('#ef4444')} onClick={resetAll}>
          <RotateCcw size={13} />
          Reset
        </button>
      </div>

      {/* Player list */}
      <div style={listStyle}>
        {connectedPlayers.length === 0 && (
          <div style={{ color: '#64748b', fontSize: 13, textAlign: 'center', padding: 12 }}>
            No connected players
          </div>
        )}
        {connectedPlayers.map((player) => {
          const data = getPlayerData(player.id);
          const isLowest =
            connectedPlayers.length > 1 && data.count === minCount;
          const barWidth = maxCount > 0 ? (data.count / maxCount) * 100 : 0;

          return (
            <div
              key={player.id}
              style={{
                background: isLowest
                  ? 'rgba(201, 168, 76, 0.1)'
                  : 'rgba(255, 255, 255, 0.04)',
                border: isLowest
                  ? '1px solid rgba(201, 168, 76, 0.35)'
                  : '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: 8,
                padding: '8px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              {/* Top row: name, count, + button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {isLowest && (
                  <Star
                    size={13}
                    style={{ color: '#c9a84c', flexShrink: 0 }}
                    fill="#c9a84c"
                  />
                )}
                <span
                  style={{
                    flex: 1,
                    fontSize: 13,
                    fontWeight: 600,
                    color: isLowest ? '#c9a84c' : '#e2e8f0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {player.name}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    color: '#94a3b8',
                    minWidth: 18,
                    textAlign: 'center',
                  }}
                >
                  {data.count}
                </span>
                <button
                  onClick={() => increment(player.id)}
                  title="Add spotlight moment"
                  style={{
                    background: 'rgba(192, 132, 252, 0.15)',
                    border: '1px solid rgba(192, 132, 252, 0.3)',
                    borderRadius: 4,
                    color: '#c084fc',
                    cursor: 'pointer',
                    padding: '2px 5px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Plus size={13} />
                </button>
              </div>

              {/* Distribution bar */}
              <div
                style={{
                  height: 4,
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.06)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${barWidth}%`,
                    borderRadius: 2,
                    background: isLowest
                      ? '#c9a84c'
                      : '#c084fc',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>

              {/* Bottom row: timestamp + note */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    fontSize: 10,
                    color: '#64748b',
                    fontFamily: 'var(--font-mono)',
                    flexShrink: 0,
                  }}
                >
                  Last: {formatTimestamp(data.lastTimestamp)}
                </span>
                <input
                  type="text"
                  placeholder="Quick note..."
                  value={data.note || ''}
                  onChange={(e) => updateNote(player.id, e.target.value)}
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 4,
                    padding: '2px 6px',
                    fontSize: 10,
                    fontFamily: 'var(--font-ui)',
                    color: '#94a3b8',
                    outline: 'none',
                    minWidth: 0,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(SpotlightTracker);
