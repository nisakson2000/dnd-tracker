import { memo, useMemo, useState } from 'react';
import {
  Wifi, WifiOff, Shield, Heart, LogOut,
  Minus, Plus, Zap, Brain, AlertTriangle, Activity,
  Eye, Skull, Swords, Crosshair, Footprints, Search,
} from 'lucide-react';
import {
  Package, Sparkles,
} from 'lucide-react';
import { getConditionRef } from '../../data/playerConditionRef';
import { getDeathSaveStatus } from '../../data/playerDeathSaves';
import { getHpStatus } from '../../data/playerHpTracker';

const lowHpPulse = `
@keyframes lowHpPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
`;

export default memo(function PlayerSessionHeader({
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
  latencyMs,
  deathSaves,
  concentrationSpell,
}) {
  const [hoveredCondition, setHoveredCondition] = useState(null);
  // Low HP warning (< 25%)
  const hpWarning = useMemo(() => {
    if (!charOverview?.max_hp || charOverview.max_hp <= 0) return null;
    const pct = charOverview.current_hp / charOverview.max_hp;
    if (charOverview.current_hp <= 0) return 'dead';
    if (pct <= 0.25) return 'critical';
    if (pct <= 0.5) return 'low';
    return null;
  }, [charOverview?.current_hp, charOverview?.max_hp]);

  // Spell slot depletion check
  const slotWarning = useMemo(() => {
    if (!spellSlots || spellSlots.length === 0) return null;
    const withMax = spellSlots.filter(s => s.max_slots > 0);
    if (withMax.length === 0) return null;
    const totalRemaining = withMax.reduce((sum, s) => sum + (s.max_slots - (s.used_slots || 0)), 0);
    const totalMax = withMax.reduce((sum, s) => sum + s.max_slots, 0);
    if (totalRemaining === 0) return 'depleted';
    if (totalRemaining <= Math.ceil(totalMax * 0.25)) return 'low';
    return null;
  }, [spellSlots]);

  // Slot count summary (remaining/total)
  const slotSummary = useMemo(() => {
    if (!spellSlots || spellSlots.length === 0) return null;
    const withMax = spellSlots.filter(s => s.max_slots > 0);
    if (withMax.length === 0) return null;
    const totalRemaining = withMax.reduce((sum, s) => sum + (s.max_slots - (s.used_slots || 0)), 0);
    const totalMax = withMax.reduce((sum, s) => sum + s.max_slots, 0);
    return `${totalRemaining}/${totalMax}`;
  }, [spellSlots]);

  return (
    <>
      <style>{lowHpPulse}</style>

      {/* ── Low HP Warning Banner ── */}
      {hpWarning === 'critical' && (
        <div style={{
          padding: '4px 20px',
          background: 'rgba(239,68,68,0.1)',
          borderBottom: '1px solid rgba(239,68,68,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          animation: 'lowHpPulse 2s ease-in-out infinite',
        }}>
          <AlertTriangle size={12} style={{ color: '#ef4444' }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#fca5a5', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
            CRITICAL HP — {charOverview.current_hp}/{charOverview.max_hp}
          </span>
        </div>
      )}

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
          {connected && latencyMs != null && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-mono, monospace)',
              padding: '1px 6px', borderRadius: 4, marginLeft: 6,
              background: latencyMs < 100 ? 'rgba(74,222,128,0.1)' : latencyMs < 300 ? 'rgba(251,191,36,0.1)' : 'rgba(239,68,68,0.1)',
              color: latencyMs < 100 ? '#4ade80' : latencyMs < 300 ? '#fbbf24' : '#ef4444',
              border: `1px solid ${latencyMs < 100 ? 'rgba(74,222,128,0.2)' : latencyMs < 300 ? 'rgba(251,191,36,0.2)' : 'rgba(239,68,68,0.2)'}`,
            }}>
              <Activity size={8} />
              {latencyMs}ms
            </span>
          )}
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
          {/* Concentration indicator */}
          {concentrationSpell && (
            <span style={{
              fontSize: '9px', fontWeight: 600, padding: '1px 6px', borderRadius: '4px',
              background: 'rgba(96,165,250,0.12)', color: '#60a5fa',
              border: '1px solid rgba(96,165,250,0.25)',
              display: 'flex', alignItems: 'center', gap: 3,
            }}>
              <Crosshair size={8} /> Conc: {concentrationSpell}
            </span>
          )}
          {/* Active conditions with tooltips */}
          {conditions.length > 0 && (
            <div style={{ display: 'flex', gap: '4px', position: 'relative', alignItems: 'center' }}>
              <span style={{
                fontSize: '9px', fontWeight: 700, color: '#fbbf24',
                background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)',
                borderRadius: '8px', padding: '0 5px', minWidth: '16px', textAlign: 'center',
                fontFamily: 'var(--font-mono, monospace)', lineHeight: '16px',
              }}>
                {conditions.length}
              </span>
              {conditions.map((c, i) => {
                const condName = c.name || c.condition;
                const ref = getConditionRef ? getConditionRef(condName) : null;
                return (
                  <span key={i}
                    onMouseEnter={() => setHoveredCondition(condName)}
                    onMouseLeave={() => setHoveredCondition(null)}
                    style={{
                      fontSize: '9px', fontWeight: 600, padding: '1px 6px', borderRadius: '4px',
                      background: ref ? `${ref.color}18` : 'rgba(251,191,36,0.12)',
                      color: ref ? ref.color : '#fbbf24',
                      border: `1px solid ${ref ? `${ref.color}40` : 'rgba(251,191,36,0.25)'}`,
                      cursor: 'help', position: 'relative',
                    }}>
                    {ref?.icon && <span style={{ marginRight: 2 }}>{ref.icon}</span>}
                    {condName}{c.rounds_remaining != null ? ` (${c.rounds_remaining}r)` : ''}
                    {hoveredCondition === condName && ref && (
                      <div style={{
                        position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                        marginTop: 4, padding: '8px 10px', borderRadius: 8, zIndex: 100,
                        background: 'rgba(15,15,20,0.97)', border: '1px solid rgba(255,255,255,0.12)',
                        minWidth: 220, maxWidth: 300, whiteSpace: 'normal',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                      }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: ref.color, marginBottom: 4 }}>{ref.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-dim)', lineHeight: 1.4 }}>{ref.playerSummary}</div>
                        {ref.mechanicalEffects && (
                          <ul style={{ margin: '4px 0 0', paddingLeft: 14, fontSize: 9, color: 'var(--text-mute)', lineHeight: 1.5 }}>
                            {ref.mechanicalEffects.slice(0, 4).map((e, j) => <li key={j}>{e}</li>)}
                          </ul>
                        )}
                      </div>
                    )}
                  </span>
                );
              })}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
            {/* HP with controls */}
            {charOverview.current_hp != null && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
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
                    <span style={{ fontSize: '8px', color: 'var(--text-mute)', fontFamily: 'var(--font-mono)', opacity: 0.6, marginLeft: 2 }}>
                      Enter to apply
                    </span>
                    <button onClick={() => setHpEditMode(false)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-mute)', fontSize: '10px', padding: '0 2px' }}>✕</button>
                  </>
                ) : (
                  <button onClick={() => setHpEditMode(true)} title="Click to adjust HP"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: '1px solid transparent',
                      borderRadius: '4px', padding: '1px 4px', cursor: 'pointer', transition: 'all 0.15s',
                      fontSize: '12px', fontWeight: 600,
                      color: getHpStatus(charOverview.current_hp, charOverview.max_hp || 1).color,
                      fontFamily: 'var(--font-mono, monospace)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                  >
                    <Heart size={12} />
                    {charOverview.current_hp}/{charOverview.max_hp || '?'}
                    {(() => {
                      const hpStatus = getHpStatus(charOverview.current_hp, charOverview.max_hp || 1);
                      const pct = charOverview.max_hp > 0 ? Math.round((charOverview.current_hp / charOverview.max_hp) * 100) : 0;
                      return (
                        <span style={{ fontSize: '9px', color: hpStatus.color, opacity: 0.7 }}>
                          ({pct}%)
                        </span>
                      );
                    })()}
                    {charOverview.temp_hp > 0 && (
                      <span style={{
                        color: '#60a5fa', fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: 2,
                        textShadow: '0 0 6px rgba(96,165,250,0.5)',
                        background: 'rgba(96,165,250,0.1)', padding: '0 4px', borderRadius: 3,
                        border: '1px solid rgba(96,165,250,0.25)',
                      }}>
                        <Shield size={8} style={{ color: '#60a5fa' }} />+{charOverview.temp_hp}
                      </span>
                    )}
                  </button>
                )}
              </div>
              {/* HP Bar Visual */}
              {charOverview.max_hp > 0 && (() => {
                const hpPct = Math.max(0, Math.min(100, (charOverview.current_hp / charOverview.max_hp) * 100));
                const barColor = hpPct > 50 ? 'linear-gradient(90deg, #22c55e, #4ade80)' : hpPct > 25 ? 'linear-gradient(90deg, #eab308, #fbbf24)' : 'linear-gradient(90deg, #dc2626, #ef4444)';
                return (
                  <div style={{
                    width: '100%', height: 4, borderRadius: 2,
                    background: 'rgba(255,255,255,0.06)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${hpPct}%`, height: '100%', borderRadius: 2,
                      background: barColor,
                      transition: 'width 0.3s ease, background 0.3s ease',
                    }} />
                  </div>
                );
              })()}
              </div>
            )}
            {charOverview.armor_class != null && (
              <span title="Armor Class" style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                fontSize: '12px', fontWeight: 600, color: '#a78bfa',
                fontFamily: 'var(--font-mono, monospace)',
              }}>
                <Shield size={12} />
                {charOverview.armor_class}
              </span>
            )}
            {charOverview.speed != null && (
              <span title="Movement Speed" style={{
                display: 'flex', alignItems: 'center', gap: '3px',
                fontSize: '11px', color: 'var(--text-mute)',
                fontFamily: 'var(--font-mono, monospace)',
              }}>
                <Footprints size={11} />
                {charOverview.speed} ft/rd
              </span>
            )}
            {/* Proficiency Bonus */}
            {charOverview && (() => {
              const lvl = charOverview.level || 1;
              const prof = lvl >= 17 ? 6 : lvl >= 13 ? 5 : lvl >= 9 ? 4 : lvl >= 5 ? 3 : 2;
              return (
                <span title="Proficiency Bonus" style={{
                  display: 'flex', alignItems: 'center', gap: '3px',
                  fontSize: '11px', fontWeight: 600, color: '#c9a84c',
                  fontFamily: 'var(--font-mono, monospace)',
                }}>
                  +{prof}
                </span>
              );
            })()}
            {/* Passive Perception & Investigation */}
            {charAbilities && (() => {
              const wisEntry = charAbilities.find(a => (a.ability || '').toUpperCase().startsWith('WIS'));
              const wisMod = wisEntry ? Math.floor(((wisEntry.score || 10) - 10) / 2) : 0;
              const intEntry = charAbilities.find(a => (a.ability || '').toUpperCase().startsWith('INT'));
              const intMod = intEntry ? Math.floor(((intEntry.score || 10) - 10) / 2) : 0;
              const profBonus = charOverview.proficiency_bonus || 2;
              const isProfPerception = charOverview.perception_proficient || charOverview.skills?.includes?.('Perception');
              const passivePerception = 10 + wisMod + (isProfPerception ? profBonus : 0);
              const isProfInvestigation = charOverview.investigation_proficient || charOverview.skills?.includes?.('Investigation');
              const passiveInvestigation = 10 + intMod + (isProfInvestigation ? profBonus : 0);
              return (
                <>
                  <span title="Passive Perception" style={{
                    display: 'flex', alignItems: 'center', gap: '3px',
                    fontSize: '10px', color: '#f59e0b', fontWeight: 600,
                    fontFamily: 'var(--font-mono, monospace)',
                  }}>
                    <Eye size={10} /> {passivePerception}
                  </span>
                  <span title="Passive Investigation" style={{
                    display: 'flex', alignItems: 'center', gap: '3px',
                    fontSize: '10px', color: '#38bdf8', fontWeight: 600,
                    fontFamily: 'var(--font-mono, monospace)',
                  }}>
                    <Search size={10} /> {passiveInvestigation}
                  </span>
                </>
              );
            })()}
            {/* Death Save Pips */}
            {charOverview.current_hp <= 0 && deathSaves && (
              <div title="Death Saves" style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '1px 6px', borderRadius: 4,
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              }}>
                <Skull size={10} style={{ color: '#ef4444' }} />
                <div style={{ display: 'flex', gap: 2 }}>
                  {[0, 1, 2].map(i => (
                    <div key={`s${i}`} style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: i < (deathSaves.successes || 0) ? '#4ade80' : 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(74,222,128,0.3)',
                    }} />
                  ))}
                </div>
                <div style={{ width: 1, height: 10, background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ display: 'flex', gap: 2 }}>
                  {[0, 1, 2].map(i => (
                    <div key={`f${i}`} style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: i < (deathSaves.failures || 0) ? '#ef4444' : 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(239,68,68,0.3)',
                    }} />
                  ))}
                </div>
              </div>
            )}
            {/* HP Percentage */}
            {charOverview.current_hp != null && charOverview.max_hp > 0 && (
              <span style={{
                fontSize: '9px', color: 'var(--text-mute)',
                fontFamily: 'var(--font-mono)',
              }}>
                {Math.round((charOverview.current_hp / charOverview.max_hp) * 100)}%
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
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                <div style={{ position: 'relative', display: 'inline-flex' }}>
                  <button onClick={() => setShowSpellSlots(!showSpellSlots)} title="Spell Slots"
                    style={{ background: showSpellSlots ? 'rgba(155,89,182,0.15)' : 'none', border: `1px solid ${showSpellSlots ? 'rgba(155,89,182,0.3)' : 'transparent'}`, borderRadius: '4px', padding: '2px 6px', cursor: 'pointer', color: showSpellSlots ? '#c084fc' : 'var(--text-mute)', fontSize: '10px', fontFamily: 'var(--font-mono)', transition: 'all 0.15s' }}>
                    <Sparkles size={11} />
                  </button>
                  {slotWarning && (
                    <div style={{
                      position: 'absolute', top: -3, right: -3,
                      width: 8, height: 8, borderRadius: '50%',
                      background: slotWarning === 'depleted' ? '#ef4444' : '#fbbf24',
                      border: '1px solid rgba(0,0,0,0.3)',
                    }} title={slotWarning === 'depleted' ? 'All spell slots used!' : 'Low on spell slots'} />
                  )}
                </div>
                {slotSummary && (
                  <span style={{
                    fontSize: '9px', fontWeight: 600, color: 'var(--text-mute)',
                    fontFamily: 'var(--font-mono, monospace)',
                  }}>
                    {slotSummary}
                  </span>
                )}
              </div>
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
})
