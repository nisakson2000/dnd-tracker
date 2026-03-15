import {
  Wifi, WifiOff, Shield, Heart, LogOut,
  Minus, Plus, Zap, Brain,
} from 'lucide-react';
import {
  Package, Sparkles,
} from 'lucide-react';

export default function PlayerSessionHeader({
  connected,
  campaignName,
  handleDisconnect,
  charOverview,
  conditions,
  hpEditMode,
  setHpEditMode,
  hpDelta,
  setHpDelta,
  handleHpChange,
  charAbilities,
  showAbilities,
  setShowAbilities,
  showInventory,
  setShowInventory,
  inventory,
  currency,
  spellSlots,
  showSpellSlots,
  setShowSpellSlots,
  handleUseSpellSlot,
}) {
  return (
    <>
      {/* ── Connection Banner ── */}
      <div style={{
        padding: '6px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: connected ? 'rgba(74,222,128,0.06)' : 'rgba(239,68,68,0.06)',
        borderBottom: `1px solid ${connected ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)'}`,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '12px', fontWeight: 500,
          color: connected ? '#4ade80' : '#fca5a5',
        }}>
          {connected ? <Wifi size={13} /> : <WifiOff size={13} />}
          {connected
            ? `Connected to ${campaignName || 'Session'}`
            : 'Not connected — join a session to play live'
          }
        </div>
        <button
          onClick={handleDisconnect}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '3px 10px', borderRadius: '6px',
            background: 'none',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--text-mute)', fontSize: '11px',
            cursor: 'pointer', fontFamily: 'var(--font-ui)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#fca5a5';
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--text-mute)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
          }}
        >
          <LogOut size={11} /> Leave
        </button>
      </div>

      {/* ── Character Stats Bar ── */}
      {charOverview && (
        <div style={{
          padding: '6px 20px',
          display: 'flex', alignItems: 'center', gap: '16px',
          background: 'rgba(201,168,76,0.04)',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
          flexWrap: 'wrap',
        }}>
          <span style={{
            fontSize: '13px', fontWeight: 700,
            color: '#c9a84c',
            fontFamily: 'var(--font-display, Cinzel, Georgia, serif)',
          }}>
            {charOverview.name || 'Unknown'}
          </span>
          {(charOverview.primary_class || charOverview.race) && (
            <span style={{
              fontSize: '11px', color: 'var(--text-dim)',
              fontFamily: 'var(--font-ui)',
            }}>
              {[charOverview.race, charOverview.primary_class, charOverview.primary_subclass].filter(Boolean).join(' ')}
              {charOverview.level ? ` Lv${charOverview.level}` : ''}
            </span>
          )}
          {/* Active conditions */}
          {conditions.length > 0 && (
            <div style={{ display: 'flex', gap: '4px' }}>
              {conditions.map((c, i) => (
                <span key={i} style={{
                  fontSize: '9px', fontWeight: 600, padding: '1px 6px', borderRadius: '4px',
                  background: 'rgba(251,191,36,0.12)', color: '#fbbf24',
                  border: '1px solid rgba(251,191,36,0.25)',
                }}>
                  {c.name || c.condition}{c.rounds_remaining != null ? ` (${c.rounds_remaining}r)` : ''}
                </span>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
            {/* HP with controls */}
            {charOverview.current_hp != null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {hpEditMode ? (
                  <>
                    <button onClick={() => { const parsed = parseInt(hpDelta); const v = isNaN(parsed) ? 5 : parsed; handleHpChange(-v); }}
                      style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '4px', padding: '1px 6px', cursor: 'pointer', color: '#ef4444', fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      <Minus size={10} />
                    </button>
                    <input type="number" value={hpDelta} onChange={e => setHpDelta(e.target.value)} placeholder="5"
                      onKeyDown={e => { if (e.key === 'Enter') { const parsed = parseInt(hpDelta); const v = isNaN(parsed) ? 0 : parsed; if (v > 0) handleHpChange(-v); else if (v < 0) handleHpChange(Math.abs(v)); } }}
                      style={{ width: '36px', padding: '1px 4px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'var(--text)', fontSize: '11px', fontFamily: 'var(--font-mono)', textAlign: 'center', outline: 'none' }}
                    />
                    <button onClick={() => { const parsed = parseInt(hpDelta); const v = isNaN(parsed) ? 5 : parsed; handleHpChange(v); }}
                      style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '4px', padding: '1px 6px', cursor: 'pointer', color: '#4ade80', fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      <Plus size={10} />
                    </button>
                    <button onClick={() => setHpEditMode(false)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-mute)', fontSize: '10px', padding: '0 2px' }}>✕</button>
                  </>
                ) : (
                  <button onClick={() => setHpEditMode(true)} title="Click to adjust HP"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: '1px solid transparent',
                      borderRadius: '4px', padding: '1px 4px', cursor: 'pointer', transition: 'all 0.15s',
                      fontSize: '12px', fontWeight: 600,
                      color: charOverview.current_hp <= 0 ? '#ef4444' : charOverview.current_hp <= Math.floor((charOverview.max_hp || 1) / 4) ? '#fbbf24' : '#4ade80',
                      fontFamily: 'var(--font-mono, monospace)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                  >
                    <Heart size={12} />
                    {charOverview.current_hp}/{charOverview.max_hp || '?'}
                    {charOverview.temp_hp > 0 && (
                      <span style={{ color: '#60a5fa', fontSize: '10px' }}>+{charOverview.temp_hp}</span>
                    )}
                  </button>
                )}
              </div>
            )}
            {charOverview.armor_class != null && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                fontSize: '12px', fontWeight: 600, color: '#a78bfa',
                fontFamily: 'var(--font-mono, monospace)',
              }}>
                <Shield size={12} />
                {charOverview.armor_class}
              </span>
            )}
            {charOverview.speed != null && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                fontSize: '11px', color: 'var(--text-mute)',
                fontFamily: 'var(--font-mono, monospace)',
              }}>
                {charOverview.speed} ft
              </span>
            )}
            {/* Quick toggles */}
            <button onClick={() => setShowAbilities(!showAbilities)} title="Ability Scores"
              style={{ background: showAbilities ? 'rgba(167,139,250,0.15)' : 'none', border: `1px solid ${showAbilities ? 'rgba(167,139,250,0.3)' : 'transparent'}`, borderRadius: '4px', padding: '2px 6px', cursor: 'pointer', color: showAbilities ? '#a78bfa' : 'var(--text-mute)', fontSize: '10px', fontFamily: 'var(--font-mono)', transition: 'all 0.15s' }}>
              <Brain size={11} />
            </button>
            <button onClick={() => setShowInventory(!showInventory)} title="Inventory"
              style={{ background: showInventory ? 'rgba(201,168,76,0.15)' : 'none', border: `1px solid ${showInventory ? 'rgba(201,168,76,0.3)' : 'transparent'}`, borderRadius: '4px', padding: '2px 6px', cursor: 'pointer', color: showInventory ? '#c9a84c' : 'var(--text-mute)', fontSize: '10px', fontFamily: 'var(--font-mono)', transition: 'all 0.15s' }}>
              <Package size={11} />
            </button>
            {spellSlots.some(s => s.max_slots > 0) && (
              <button onClick={() => setShowSpellSlots(!showSpellSlots)} title="Spell Slots"
                style={{ background: showSpellSlots ? 'rgba(155,89,182,0.15)' : 'none', border: `1px solid ${showSpellSlots ? 'rgba(155,89,182,0.3)' : 'transparent'}`, borderRadius: '4px', padding: '2px 6px', cursor: 'pointer', color: showSpellSlots ? '#c084fc' : 'var(--text-mute)', fontSize: '10px', fontFamily: 'var(--font-mono)', transition: 'all 0.15s' }}>
                <Sparkles size={11} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Ability Scores Bar ── */}
      {showAbilities && charAbilities.length > 0 && (
        <div style={{
          padding: '6px 20px', display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center',
          background: 'rgba(167,139,250,0.04)', borderBottom: '1px solid rgba(167,139,250,0.1)',
        }}>
          {charAbilities.map(a => {
            const mod = Math.floor(((a.score || 10) - 10) / 2);
            return (
              <div key={a.ability} style={{ textAlign: 'center', minWidth: '42px' }}>
                <div style={{ fontSize: '8px', fontWeight: 700, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>
                  {(a.ability || '').slice(0, 3)}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                  {a.score || 10}
                </div>
                <div style={{ fontSize: '10px', fontWeight: 600, color: mod >= 0 ? '#4ade80' : '#ef4444', fontFamily: 'var(--font-mono)' }}>
                  {mod >= 0 ? `+${mod}` : mod}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Inventory Bar ── */}
      {showInventory && (
        <div style={{
          padding: '6px 20px', maxHeight: '140px', overflowY: 'auto',
          background: 'rgba(201,168,76,0.04)', borderBottom: '1px solid rgba(201,168,76,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <span style={{ fontSize: '9px', fontWeight: 700, color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>Inventory</span>
            <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
              {['gp', 'sp', 'cp', 'ep', 'pp'].map(coin => currency[coin] > 0 && (
                <span key={coin} style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: coin === 'gp' ? '#fbbf24' : coin === 'sp' ? '#94a3b8' : coin === 'cp' ? '#b45309' : coin === 'pp' ? '#e2e8f0' : '#818cf8' }}>
                  {currency[coin]} {coin}
                </span>
              ))}
            </div>
          </div>
          {inventory.length === 0 ? (
            <div style={{ fontSize: '11px', color: 'var(--text-mute)', fontStyle: 'italic' }}>No items</div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {inventory.map(item => (
                <span key={item.id} style={{
                  fontSize: '10px', padding: '2px 8px', borderRadius: '4px',
                  background: item.equipped ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${item.equipped ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.06)'}`,
                  color: item.equipped ? '#4ade80' : 'var(--text-dim)',
                  fontFamily: 'var(--font-ui)',
                }} title={`${item.name}${item.quantity > 1 ? ` ×${item.quantity}` : ''}${item.description ? `\n${item.description}` : ''}`}>
                  {item.name}{item.quantity > 1 ? ` ×${item.quantity}` : ''}
                  {item.attuned && <Zap size={8} style={{ marginLeft: '2px', color: '#c084fc' }} />}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Spell Slots Bar ── */}
      {showSpellSlots && spellSlots.some(s => s.max_slots > 0) && (
        <div style={{
          padding: '6px 20px', display: 'flex', alignItems: 'center', gap: '12px',
          background: 'rgba(155,89,182,0.04)', borderBottom: '1px solid rgba(155,89,182,0.1)',
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '9px', fontWeight: 700, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>Slots</span>
          {spellSlots.filter(s => s.max_slots > 0).map(s => {
            const remaining = s.max_slots - (s.used_slots || 0);
            return (
              <div key={s.slot_level} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-mute)', fontFamily: 'var(--font-mono)', minWidth: '18px' }}>L{s.slot_level}</span>
                <div style={{ display: 'flex', gap: '3px' }}>
                  {Array.from({ length: s.max_slots }, (_, i) => (
                    <button key={i} onClick={() => { if (i < remaining) handleUseSpellSlot(s.slot_level); }}
                      style={{
                        width: '10px', height: '10px', borderRadius: '50%', padding: 0,
                        background: i < remaining ? '#c084fc' : 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(155,89,182,0.3)',
                        cursor: i < remaining ? 'pointer' : 'default',
                        transition: 'all 0.15s',
                      }}
                      title={i < remaining ? `Use level ${s.slot_level} slot` : 'Used'}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
