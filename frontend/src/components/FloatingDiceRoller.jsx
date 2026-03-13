import { useState, useEffect, lazy, Suspense } from 'react';
import { Dices, X, Minus, Maximize2 } from 'lucide-react';

const DiceRoller = lazy(() => import('../sections/DiceRoller'));

const STORAGE_KEY = 'codex-dice-panel-state';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { minimized: false };
}

export default function FloatingDiceRoller({ characterId, activeConditions = [], diceHistory, onDiceHistoryChange, sessionActive, playerUuid, isDM }) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(() => loadState().minimized);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ minimized }));
  }, [minimized]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        title="Open Dice Roller"
        style={{
          position: 'fixed',
          bottom: 20,
          right: 80,
          zIndex: 9990,
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: '1px solid rgba(201,168,76,0.3)',
          background: 'rgba(12,10,20,0.92)',
          backdropFilter: 'blur(12px)',
          color: 'rgba(201,168,76,0.7)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 24px rgba(0,0,0,0.5), 0 0 12px rgba(201,168,76,0.1)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)';
          e.currentTarget.style.color = 'rgba(201,168,76,1)';
          e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.5), 0 0 20px rgba(201,168,76,0.2)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)';
          e.currentTarget.style.color = 'rgba(201,168,76,0.7)';
          e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.5), 0 0 12px rgba(201,168,76,0.1)';
        }}
      >
        <Dices size={22} />
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 9990,
        width: minimized ? 280 : 420,
        maxHeight: minimized ? 48 : 'calc(100vh - 80px)',
        borderRadius: 14,
        border: '1px solid rgba(201,168,76,0.2)',
        background: 'rgba(12,10,20,0.96)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 16px rgba(201,168,76,0.08)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.2s, max-height 0.3s',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 14px',
          borderBottom: minimized ? 'none' : '1px solid rgba(201,168,76,0.12)',
          cursor: 'default',
          flexShrink: 0,
        }}
      >
        <Dices size={16} style={{ color: 'rgba(201,168,76,0.6)' }} />
        <span style={{
          flex: 1,
          fontFamily: 'var(--font-display, "Cinzel", serif)',
          fontSize: 13,
          fontWeight: 600,
          color: 'rgba(201,168,76,0.8)',
          letterSpacing: '0.03em',
        }}>
          Dice Roller
        </span>
        <button
          onClick={() => setMinimized(!minimized)}
          title={minimized ? 'Expand' : 'Minimize'}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.3)', padding: 4, display: 'flex',
            alignItems: 'center', transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
        >
          {minimized ? <Maximize2 size={14} /> : <Minus size={14} />}
        </button>
        <button
          onClick={() => setOpen(false)}
          title="Close"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.3)', padding: 4, display: 'flex',
            alignItems: 'center', transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(239,68,68,0.8)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
        >
          <X size={14} />
        </button>
      </div>

      {/* Content */}
      {!minimized && (
        <div style={{ flex: 1, overflow: 'auto', padding: '0 2px' }}>
          <Suspense fallback={
            <div style={{ padding: 32, textAlign: 'center', color: 'rgba(200,175,130,0.3)', fontSize: 12 }}>
              Loading dice...
            </div>
          }>
            <DiceRoller
              characterId={characterId}
              activeConditions={activeConditions}
              diceHistory={diceHistory}
              onDiceHistoryChange={onDiceHistoryChange}
              sessionActive={sessionActive}
              playerUuid={playerUuid}
              isDM={isDM}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}
