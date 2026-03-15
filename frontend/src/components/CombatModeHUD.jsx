import { useState, useEffect, useCallback, useRef } from 'react';
import {
  X, Plus, Minus, Swords, Shield, Heart, Zap,
  RotateCcw, Sparkles, Target, Skull, ChevronUp, ChevronDown,
  Dices
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getOverview, updateOverview } from '../api/overview';
import { getAttacks, getConditions, updateConditions } from '../api/combat';
import { getSpells, getSpellSlots, updateSpellSlots } from '../api/spells';
import { parseAndRollExpression } from '../utils/dice';
import { calcMod, calcProfBonus, ABILITIES, modStr } from '../utils/dndHelpers';

const ABILITY_COLORS = {
  STR: 'var(--str-c)', DEX: 'var(--dex-c)', CON: 'var(--con-c)',
  INT: 'var(--int-c)', WIS: 'var(--wis-c)', CHA: 'var(--cha-c)',
};

const calcProf = calcProfBonus;

// Shared inline style fragments
const S = {
  panel: {
    background: 'var(--bg-panel)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', padding: '10px',
  },
  gold: { color: '#c9a84c' },
  heading: { fontFamily: 'var(--font-display)', color: '#c9a84c', margin: 0, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' },
  btn: {
    background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', color: 'var(--text)', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
};

export default function CombatModeHUD({ characterId, character, onClose, onCharacterUpdate }) {
  // ── Data State ──
  const [overview, setOverview] = useState(null);
  const [abilities, setAbilities] = useState([]);
  const [saves, setSaves] = useState([]);
  const [attacks, setAttacks] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [spells, setSpells] = useState([]);
  const [spellSlots, setSpellSlots] = useState([]);

  // ── Local Combat State ──
  const [round, setRound] = useState(1);
  const [hpDelta, setHpDelta] = useState('');
  const [tempHp, setTempHp] = useState(0);
  const [rollResults, setRollResults] = useState({}); // keyed by id
  const [actionEcon, setActionEcon] = useState({ action: false, bonus: false, reaction: false });
  const [deathSaves, setDeathSaves] = useState({ success: 0, fail: 0 });
  const fadeTimers = useRef({});

  // ── Load Data ──
  const loadAll = useCallback(async () => {
    try {
      const [ovData, atkData, condData, spellData, slotData] = await Promise.all([
        getOverview(characterId),
        getAttacks(characterId),
        getConditions(characterId),
        getSpells(characterId),
        getSpellSlots(characterId),
      ]);
      setOverview(ovData.overview);
      setAbilities(ovData.ability_scores);
      setSaves(ovData.saving_throws);
      setAttacks(atkData);
      setConditions(condData);
      setSpells(spellData);
      setSpellSlots(slotData);
      setTempHp(ovData.overview.temp_hp || 0);
    } catch (e) {
      toast.error('Failed to load combat data');
    }
  }, [characterId]);

  useEffect(() => { loadAll(); }, [loadAll]);

  // ── HP Helpers ──
  const currentHp = overview?.current_hp ?? 0;
  const maxHp = overview?.max_hp ?? 1;
  const ac = overview?.armor_class ?? 10;

  const changeHp = async (delta) => {
    if (!overview) return;
    const newHp = Math.max(0, Math.min(maxHp, currentHp + delta));
    const updated = { ...overview, current_hp: newHp };
    setOverview(updated);
    try {
      await updateOverview(characterId, updated);
      onCharacterUpdate?.();
    } catch { toast.error('Failed to update HP'); }
  };

  const applyHpDelta = (sign) => {
    const val = parseInt(hpDelta);
    if (isNaN(val) || val <= 0) return;
    changeHp(sign * val);
    setHpDelta('');
  };

  // ── Roll Helpers ──
  const showResult = (key, text) => {
    setRollResults(prev => ({ ...prev, [key]: text }));
    if (fadeTimers.current[key]) clearTimeout(fadeTimers.current[key]);
    fadeTimers.current[key] = setTimeout(() => {
      setRollResults(prev => { const n = { ...prev }; delete n[key]; return n; });
    }, 4000);
  };

  const rollSave = (ability) => {
    const ab = abilities.find(a => a.ability === ability);
    const sv = saves.find(s => s.ability === ability);
    const mod = calcMod(ab?.score ?? 10);
    const prof = sv?.proficient ? calcProf(overview?.level ?? 1) : 0;
    const total = mod + prof;
    const result = parseAndRollExpression(`1d20+${total}`);
    if (result) {
      showResult(`save-${ability}`, `${result.total}`);
      toast(`${ability} Save: ${result.total}`, { icon: '🎲' });
    }
  };

  const rollAttack = (atk, index) => {
    const bonus = atk.attack_bonus ?? 0;
    const atkRoll = parseAndRollExpression(`1d20+${bonus}`);
    let dmgText = '';
    if (atk.damage_dice) {
      const dmg = parseAndRollExpression(atk.damage_dice);
      dmgText = dmg ? ` | Dmg: ${dmg.total}` : '';
    }
    if (atkRoll) {
      const nat = atkRoll.groups?.[0]?.rolls?.[0];
      const crit = nat === 20 ? ' CRIT!' : nat === 1 ? ' MISS!' : '';
      showResult(`atk-${index}`, `${atkRoll.total}${dmgText}${crit}`);
      toast(`${atk.name}: ${atkRoll.total} to hit${dmgText}${crit}`, { icon: '⚔️' });
    }
  };

  const rollInitiative = () => {
    const dexAb = abilities.find(a => a.ability === 'DEX');
    const mod = calcMod(dexAb?.score ?? 10);
    const result = parseAndRollExpression(`1d20+${mod}`);
    if (result) {
      showResult('initiative', `${result.total}`);
      toast(`Initiative: ${result.total}`, { icon: '⚡' });
    }
  };

  // ── Spell Slot Helpers ──
  const expendSlot = async (levelIndex) => {
    const slot = spellSlots[levelIndex];
    if (!slot || (slot.used ?? 0) >= (slot.total ?? 0)) return;
    const updated = spellSlots.map((s, i) =>
      i === levelIndex ? { ...s, used: (s.used ?? 0) + 1 } : s
    );
    setSpellSlots(updated);
    try { await updateSpellSlots(characterId, updated); } catch { toast.error('Failed to update slots'); }
  };

  // ── Condition Toggle ──
  const toggleCondition = async (cond) => {
    const active = Array.isArray(conditions) ? conditions : [];
    const updated = active.includes(cond) ? active.filter(c => c !== cond) : [...active, cond];
    setConditions(updated);
    try { await updateConditions(characterId, updated); } catch {}
  };

  const COMMON_CONDITIONS = [
    'Blinded', 'Charmed', 'Deafened', 'Frightened', 'Grappled',
    'Incapacitated', 'Invisible', 'Paralyzed', 'Petrified',
    'Poisoned', 'Prone', 'Restrained', 'Stunned', 'Unconscious',
    'Concentrating',
  ];

  if (!overview) return null;

  const hpPct = Math.round((currentHp / maxHp) * 100);
  const hpBarColor = hpPct > 50 ? 'var(--green)' : hpPct > 25 ? 'var(--orange)' : 'var(--red)';

  // ── Render ──
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 'var(--z-overlay)',
      background: 'var(--bg)', color: 'var(--text)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: 'var(--font-ui)',
    }}>
      {/* ── Top Bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 16px', borderBottom: '1px solid var(--border)',
        background: 'rgba(0,0,0,0.4)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Swords size={20} style={S.gold} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', ...S.gold }}>
            {character?.name || overview.character_name || 'Unknown'}
          </span>
          <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            Lv{overview.level} {overview.class}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button onClick={() => setRound(r => Math.max(1, r - 1))} style={{ ...S.btn, width: 24, height: 24, fontSize: '0.75rem' }}><Minus size={12} /></button>
            <span style={{ fontSize: '0.85rem', minWidth: 70, textAlign: 'center' }}>Round {round}</span>
            <button onClick={() => setRound(r => r + 1)} style={{ ...S.btn, width: 24, height: 24, fontSize: '0.75rem' }}><Plus size={12} /></button>
          </div>
          <button onClick={onClose} style={{ ...S.btn, width: 32, height: 32 }} title="Exit Combat Mode">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* ── Main 3-Column Layout ── */}
      <div style={{ flex: 1, display: 'flex', gap: 10, padding: 10, overflow: 'hidden', minHeight: 0 }}>
        {/* ── Left Column (40%) ── */}
        <div style={{ width: '40%', display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto' }}>
          {/* HP Panel */}
          <div style={{ ...S.panel }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Heart size={16} color="var(--hp-color)" />
              <h3 style={S.heading}>Hit Points</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: hpBarColor }}>{currentHp}</span>
              <span style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>/ {maxHp}</span>
              {tempHp > 0 && <span style={{ color: 'var(--teal)', fontSize: '0.85rem' }}>+{tempHp} temp</span>}
            </div>
            <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', marginBottom: 8 }}>
              <div style={{ height: '100%', borderRadius: 3, background: hpBarColor, width: `${hpPct}%`, transition: 'width 0.3s' }} />
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <button onClick={() => applyHpDelta(-1)} style={{ ...S.btn, width: 32, height: 32, color: 'var(--red)' }}><Minus size={16} /></button>
              <input
                value={hpDelta} onChange={e => setHpDelta(e.target.value.replace(/\D/g, ''))}
                placeholder="0" style={{
                  width: 56, textAlign: 'center', padding: '4px 0',
                  background: 'var(--bg-input)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '1rem',
                  outline: 'none',
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') applyHpDelta(-1);
                }}
              />
              <button onClick={() => applyHpDelta(1)} style={{ ...S.btn, width: 32, height: 32, color: 'var(--green)' }}><Plus size={16} /></button>
            </div>
          </div>

          {/* AC Display */}
          <div style={{ ...S.panel, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Shield size={28} color="var(--ac-color)" />
            <div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Armor Class</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--ac-color)' }}>{ac}</div>
            </div>
          </div>

          {/* Saving Throws */}
          <div style={S.panel}>
            <h3 style={{ ...S.heading, marginBottom: 6 }}>Saving Throws</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
              {ABILITIES.map(ab => {
                const abData = abilities.find(a => a.ability === ab);
                const svData = saves.find(s => s.ability === ab);
                const mod = calcMod(abData?.score ?? 10);
                const prof = svData?.proficient ? calcProf(overview.level) : 0;
                const total = mod + prof;
                return (
                  <button key={ab} onClick={() => rollSave(ab)} style={{
                    ...S.btn, flexDirection: 'column', padding: '6px 2px', fontSize: '0.7rem',
                    position: 'relative', gap: 1,
                  }}>
                    <span style={{ fontWeight: 700, color: ABILITY_COLORS[ab], fontSize: '0.75rem' }}>{ab}</span>
                    <span style={{ color: 'var(--text-dim)' }}>{modStr(total)}</span>
                    {rollResults[`save-${ab}`] && (
                      <span style={{
                        position: 'absolute', top: -6, right: -4, background: '#c9a84c',
                        color: '#000', borderRadius: 6, padding: '1px 6px', fontSize: '0.7rem',
                        fontWeight: 700, animation: 'fadeIn 0.2s',
                      }}>{rollResults[`save-${ab}`]}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditions */}
          <div style={S.panel}>
            <h3 style={{ ...S.heading, marginBottom: 6 }}>Conditions</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {COMMON_CONDITIONS.map(c => {
                const active = Array.isArray(conditions) && conditions.includes(c);
                return (
                  <button key={c} onClick={() => toggleCondition(c)} style={{
                    ...S.btn, padding: '3px 8px', fontSize: '0.65rem',
                    background: active ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.04)',
                    borderColor: active ? '#c9a84c' : 'var(--border)',
                    color: active ? '#c9a84c' : 'var(--text-dim)',
                  }}>
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Center Column (35%) ── */}
        <div style={{ width: '35%', display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto' }}>
          {/* Attacks */}
          <div style={{ ...S.panel, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Swords size={16} style={S.gold} />
              <h3 style={S.heading}>Attacks</h3>
            </div>
            {attacks.length === 0 && <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>No attacks configured</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {attacks.map((atk, i) => (
                <button key={atk.id || i} onClick={() => rollAttack(atk, i)} style={{
                  ...S.btn, justifyContent: 'flex-start', padding: '8px 10px', gap: 10,
                  width: '100%', position: 'relative', textAlign: 'left',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{atk.name || 'Attack'}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'flex', gap: 8 }}>
                      <span style={{ color: 'var(--green)' }}>{modStr(atk.attack_bonus ?? 0)} to hit</span>
                      {atk.damage_dice && <span>{atk.damage_dice}</span>}
                      {atk.damage_type && <span style={{ color: 'var(--orange)' }}>{atk.damage_type}</span>}
                    </div>
                  </div>
                  <Dices size={14} style={{ color: 'var(--text-dim)' }} />
                  {rollResults[`atk-${i}`] && (
                    <div style={{
                      position: 'absolute', top: -8, right: 8, background: '#c9a84c',
                      color: '#000', borderRadius: 6, padding: '2px 8px', fontSize: '0.7rem',
                      fontWeight: 700, animation: 'fadeIn 0.2s', whiteSpace: 'nowrap',
                    }}>{rollResults[`atk-${i}`]}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Column (25%) ── */}
        <div style={{ width: '25%', display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto' }}>
          {/* Initiative */}
          <button onClick={rollInitiative} style={{
            ...S.panel, ...S.btn, padding: '10px', gap: 8, width: '100%',
            justifyContent: 'center', position: 'relative',
          }}>
            <Zap size={16} color="#c9a84c" />
            <span style={{ fontFamily: 'var(--font-display)', ...S.gold, fontSize: '0.85rem' }}>Roll Initiative</span>
            {rollResults.initiative && (
              <span style={{
                position: 'absolute', top: -8, right: 8, background: '#c9a84c',
                color: '#000', borderRadius: 6, padding: '2px 8px', fontSize: '0.8rem',
                fontWeight: 700, animation: 'fadeIn 0.2s',
              }}>{rollResults.initiative}</span>
            )}
          </button>

          {/* Spell Slots */}
          <div style={S.panel}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Sparkles size={14} color="#c9a84c" />
              <h3 style={S.heading}>Spell Slots</h3>
            </div>
            {spellSlots.filter(s => (s.total ?? 0) > 0).length === 0 && (
              <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>No spell slots</div>
            )}
            {spellSlots.map((slot, i) => {
              const total = slot.total ?? 0;
              const used = slot.used ?? 0;
              if (total <= 0) return null;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', width: 28 }}>Lv{slot.level ?? i + 1}</span>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {Array.from({ length: total }, (_, j) => (
                      <button key={j} onClick={() => j >= used ? expendSlot(i) : null} style={{
                        width: 14, height: 14, borderRadius: '50%', border: '1.5px solid',
                        borderColor: j < used ? 'var(--text-dim)' : '#c9a84c',
                        background: j < used ? 'transparent' : 'rgba(201,168,76,0.3)',
                        cursor: j >= used ? 'pointer' : 'default', padding: 0,
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>{total - used}/{total}</span>
                </div>
              );
            })}
          </div>

          {/* Quick Spells */}
          <div style={{ ...S.panel, flex: 1, overflow: 'auto' }}>
            <h3 style={{ ...S.heading, marginBottom: 6 }}>Prepared Spells</h3>
            {spells.filter(s => s.prepared).length === 0 && (
              <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>No prepared spells</div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {spells.filter(s => s.prepared).map(sp => (
                <div key={sp.id} style={{
                  fontSize: '0.75rem', padding: '4px 6px', borderRadius: 'var(--radius-sm)',
                  background: sp.concentration ? 'rgba(201,168,76,0.1)' : 'transparent',
                  border: sp.concentration ? '1px solid rgba(201,168,76,0.25)' : '1px solid transparent',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  {sp.concentration && <Target size={10} color="#c9a84c" />}
                  <span style={{ color: sp.concentration ? '#c9a84c' : 'var(--text)' }}>{sp.name}</span>
                  <span style={{ marginLeft: 'auto', color: 'var(--text-dim)', fontSize: '0.6rem' }}>
                    {sp.level === 0 ? 'C' : `L${sp.level}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 16px', borderTop: '1px solid var(--border)',
        background: 'rgba(0,0,0,0.4)', gap: 16, flexWrap: 'wrap',
      }}>
        {/* Action Economy */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions:</span>
          {['action', 'bonus', 'reaction'].map(type => (
            <button key={type} onClick={() => setActionEcon(prev => ({ ...prev, [type]: !prev[type] }))} style={{
              ...S.btn, padding: '4px 12px', fontSize: '0.75rem', gap: 4,
              background: actionEcon[type] ? 'rgba(255,255,255,0.04)' : 'rgba(201,168,76,0.15)',
              borderColor: actionEcon[type] ? 'var(--border)' : 'rgba(201,168,76,0.4)',
              color: actionEcon[type] ? 'var(--text-dim)' : '#c9a84c',
              textDecoration: actionEcon[type] ? 'line-through' : 'none',
              opacity: actionEcon[type] ? 0.5 : 1,
            }}>
              {type === 'action' && <Swords size={12} />}
              {type === 'bonus' && <Zap size={12} />}
              {type === 'reaction' && <Shield size={12} />}
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
          <button onClick={() => setActionEcon({ action: false, bonus: false, reaction: false })}
            style={{ ...S.btn, width: 26, height: 26 }} title="Reset Actions">
            <RotateCcw size={12} />
          </button>
        </div>

        {/* Death Saves */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Skull size={14} color="var(--text-dim)" />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Death Saves</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--green)', marginRight: 2 }}>S</span>
            {[0, 1, 2].map(i => (
              <button key={`s${i}`} onClick={() => setDeathSaves(prev => ({
                ...prev, success: prev.success > i ? i : i + 1,
              }))} style={{
                width: 16, height: 16, borderRadius: '50%', padding: 0, cursor: 'pointer',
                border: `2px solid ${i < deathSaves.success ? 'var(--green)' : 'var(--border)'}`,
                background: i < deathSaves.success ? 'rgba(74,222,128,0.3)' : 'transparent',
              }} />
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--red)', marginRight: 2 }}>F</span>
            {[0, 1, 2].map(i => (
              <button key={`f${i}`} onClick={() => setDeathSaves(prev => ({
                ...prev, fail: prev.fail > i ? i : i + 1,
              }))} style={{
                width: 16, height: 16, borderRadius: '50%', padding: 0, cursor: 'pointer',
                border: `2px solid ${i < deathSaves.fail ? 'var(--red)' : 'var(--border)'}`,
                background: i < deathSaves.fail ? 'rgba(248,113,113,0.3)' : 'transparent',
              }} />
            ))}
          </div>
          <button onClick={() => setDeathSaves({ success: 0, fail: 0 })}
            style={{ ...S.btn, width: 20, height: 20 }} title="Reset Death Saves">
            <RotateCcw size={10} />
          </button>
        </div>
      </div>

      {/* Inline animation keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
