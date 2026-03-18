import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Minus, Skull, X, Shield, Heart, Swords } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import toast from 'react-hot-toast';

/**
 * M-11: Monster Panel for DM Session
 * - Search SRD monsters
 * - Add monsters to encounter
 * - Track HP, damage/heal, kill
 */
export default function MonsterPanel({ encounterId, onMonsterChange, onBroadcast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [monsters, setMonsters] = useState([]);
  const [damageInputs, setDamageInputs] = useState({}); // { monsterId: string }
  const [expandedMonster, setExpandedMonster] = useState(null);
  const [legendaryUsed, setLegendaryUsed] = useState({}); // { monsterId: number }

  // Load encounter monsters
  const loadMonsters = useCallback(async () => {
    if (!encounterId) return;
    try {
      const result = await invoke('get_encounter_monsters', { encounterId });
      setMonsters(result || []);
      if (onMonsterChange) onMonsterChange(result || []);
    } catch (e) {
      console.error('Failed to load monsters:', e);
    }
  }, [encounterId, onMonsterChange]);

  useEffect(() => {
    loadMonsters();
  }, [loadMonsters]);

  // Search SRD monsters
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const results = await invoke('search_srd_monsters', { query: searchQuery.trim() });
      setSearchResults(results || []);
    } catch (e) {
      console.error('Failed to search monsters:', e);
      toast.error('Monster search failed');
    } finally {
      setSearching(false);
    }
  };

  // Add monster from SRD to encounter
  const handleAddMonster = async (srdMonster) => {
    if (!encounterId) {
      toast.error('No active encounter');
      return;
    }
    try {
      await invoke('add_monster_to_encounter', {
        encounterId,
        name: srdMonster.name,
        hpMax: srdMonster.hp,
        ac: srdMonster.ac,
        statBlockJson: JSON.stringify(srdMonster),
      });
      toast.success(`Added ${srdMonster.name} to encounter`);
      loadMonsters();
    } catch (e) {
      toast.error('Failed to add monster');
      console.error(e);
    }
  };

  // Apply damage/heal to monster
  const handleHpChange = async (monsterId, delta) => {
    try {
      const newHp = await invoke('update_monster_hp', { monsterId, hpDelta: delta });
      const monster = monsters.find(m => m.id === monsterId);
      setMonsters(prev => prev.map(m =>
        m.id === monsterId ? { ...m, hp_current: newHp } : m
      ));
      setDamageInputs(prev => ({ ...prev, [monsterId]: '' }));
      // Broadcast HP change to players
      onBroadcast?.({
        type: 'HpDelta',
        target_id: monsterId,
        target_name: monster?.name || 'Monster',
        delta,
        source: 'DM',
      });
    } catch (e) {
      toast.error('Failed to update HP');
      console.error(e);
    }
  };

  // Kill monster
  const handleKill = async (monsterId) => {
    try {
      const monster = monsters.find(m => m.id === monsterId);
      await invoke('kill_monster', { monsterId });
      setMonsters(prev => prev.map(m =>
        m.id === monsterId ? { ...m, alive: false, hp_current: 0 } : m
      ));
      toast.success('Monster killed');
      // Broadcast kill to players
      onBroadcast?.({
        type: 'MonsterKilled',
        monster_id: monsterId,
        monster_name: monster?.name || 'Monster',
      });
    } catch (e) {
      toast.error('Failed to kill monster');
      console.error(e);
    }
  };

  // Remove monster
  const handleRemove = async (monsterId) => {
    try {
      await invoke('remove_monster', { monsterId });
      setMonsters(prev => prev.filter(m => m.id !== monsterId));
      toast.success('Monster removed');
    } catch (e) {
      toast.error('Failed to remove monster');
      console.error(e);
    }
  };

  const btnStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '4px 8px', borderRadius: '4px',
    fontSize: '11px', fontWeight: 600,
    cursor: 'pointer', fontFamily: 'var(--font-ui)',
    transition: 'all 0.15s', border: 'none',
  };

  return (
    <div style={{ display: 'grid', gap: '12px', height: '100%', gridTemplateRows: 'auto 1fr' }}>
      {/* Search Bar */}
      <div>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={12} style={{
              position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-mute)', pointerEvents: 'none',
            }} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Search SRD monsters..."
              style={{
                width: '100%', padding: '6px 8px 6px 26px', borderRadius: '6px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text)', fontSize: '12px',
                fontFamily: 'var(--font-ui)', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={searching}
            style={{
              ...btnStyle,
              background: 'rgba(155,89,182,0.15)',
              color: '#c084fc',
              padding: '6px 12px',
            }}
          >
            {searching ? '...' : 'Search'}
          </button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div style={{
            maxHeight: '160px', overflowY: 'auto',
            background: 'rgba(0,0,0,0.3)', borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            {searchResults.map((m, idx) => (
              <div
                key={`${m.name}-${idx}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '6px 10px',
                  borderBottom: idx < searchResults.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  cursor: 'pointer', transition: 'background 0.1s',
                }}
                onClick={() => handleAddMonster(m)}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(155,89,182,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '12px', color: 'var(--text)', flex: 1 }}>{m.name}</span>
                <span style={{
                  fontSize: '10px', color: 'var(--text-mute)',
                  fontFamily: 'var(--font-mono)',
                }}>
                  CR {m.cr}
                </span>
                <span style={{
                  fontSize: '10px', color: '#4ade80',
                  fontFamily: 'var(--font-mono)',
                  display: 'flex', alignItems: 'center', gap: '2px',
                }}>
                  <Heart size={8} /> {m.hp}
                </span>
                <span style={{
                  fontSize: '10px', color: '#60a5fa',
                  fontFamily: 'var(--font-mono)',
                  display: 'flex', alignItems: 'center', gap: '2px',
                }}>
                  <Shield size={8} /> {m.ac}
                </span>
                <Plus size={12} style={{ color: '#c084fc', opacity: 0.6 }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Encounter Monsters */}
      <div style={{ overflowY: 'auto' }}>
        {!encounterId ? (
          <div style={{
            textAlign: 'center', padding: '24px 8px',
            color: 'var(--text-mute)', fontSize: '12px',
          }}>
            <Swords size={20} style={{ opacity: 0.3, marginBottom: '8px' }} />
            <p>No active encounter</p>
            <p style={{ fontSize: '11px', opacity: 0.5, marginTop: '4px' }}>
              Start an encounter to add monsters
            </p>
          </div>
        ) : monsters.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '24px 8px',
            color: 'var(--text-mute)', fontSize: '12px',
          }}>
            <p>No monsters in encounter</p>
            <p style={{ fontSize: '11px', opacity: 0.5, marginTop: '4px' }}>
              Search and add SRD monsters above
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '6px' }}>
            {monsters.map(m => {
              const hpPercent = m.hp_max > 0 ? (m.hp_current / m.hp_max) * 100 : 0;
              const hpColor = !m.alive ? '#666' : hpPercent > 50 ? '#4ade80' : hpPercent > 25 ? '#fbbf24' : '#ef4444';
              const dmgVal = parseInt(damageInputs[m.id]) || 0;
              let statBlock = null;
              try {
                statBlock = m.stat_block_json ? (typeof m.stat_block_json === 'string' ? JSON.parse(m.stat_block_json) : m.stat_block_json) : null;
              } catch (e) { console.warn('Corrupted stat block for', m.name, e); }

              return (
                <div
                  key={m.id}
                  style={{
                    borderRadius: '8px',
                    background: m.alive ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
                    border: `1px solid ${m.alive ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)'}`,
                    opacity: m.alive ? 1 : 0.5,
                  }}
                >
                  {/* Monster header */}
                  <div
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '8px 10px',
                      cursor: 'pointer',
                    }}
                    onClick={() => setExpandedMonster(expandedMonster === m.id ? null : m.id)}
                  >
                    <span style={{
                      fontSize: '12px', fontWeight: 600,
                      color: m.alive ? 'var(--text)' : 'var(--text-mute)',
                      flex: 1, minWidth: 0, overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      textDecoration: m.alive ? 'none' : 'line-through',
                    }}>
                      {m.name}
                    </span>
                    {/* AC badge */}
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: '2px',
                      fontSize: '10px', color: '#60a5fa',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      <Shield size={9} /> {m.ac}
                    </span>
                    {/* HP */}
                    <span style={{
                      fontSize: '11px', fontWeight: 700, color: hpColor,
                      fontFamily: 'var(--font-mono)', minWidth: '48px', textAlign: 'right',
                    }}>
                      {m.hp_current}/{m.hp_max}
                    </span>
                  </div>

                  {/* HP bar */}
                  <div style={{
                    height: '3px', margin: '0 10px',
                    background: 'rgba(255,255,255,0.05)', borderRadius: '2px',
                  }}>
                    <div style={{
                      height: '100%', borderRadius: '2px',
                      background: hpColor,
                      width: `${Math.max(0, Math.min(100, hpPercent))}%`,
                      transition: 'width 0.3s',
                    }} />
                  </div>

                  {/* Controls */}
                  {m.alive && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      padding: '6px 10px',
                    }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleHpChange(m.id, dmgVal > 0 ? dmgVal : 1); }}
                        style={{ ...btnStyle, background: 'rgba(74,222,128,0.15)', color: '#4ade80' }}
                        title="Heal"
                      >
                        <Plus size={10} />
                      </button>
                      <input
                        type="number"
                        value={damageInputs[m.id] || ''}
                        onChange={e => setDamageInputs(prev => ({ ...prev, [m.id]: e.target.value }))}
                        placeholder="HP"
                        onClick={e => e.stopPropagation()}
                        style={{
                          width: '48px', padding: '3px 6px', borderRadius: '4px',
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'var(--text)', fontSize: '11px', textAlign: 'center',
                          fontFamily: 'var(--font-mono)', outline: 'none',
                        }}
                      />
                      <button
                        onClick={(e) => { e.stopPropagation(); handleHpChange(m.id, -(dmgVal > 0 ? dmgVal : 1)); }}
                        style={{ ...btnStyle, background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}
                        title="Damage"
                      >
                        <Minus size={10} />
                      </button>
                      <div style={{ flex: 1 }} />
                      <button
                        onClick={(e) => { e.stopPropagation(); handleKill(m.id); }}
                        style={{ ...btnStyle, background: 'rgba(239,68,68,0.1)', color: '#fca5a5' }}
                        title="Kill"
                      >
                        <Skull size={10} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemove(m.id); }}
                        style={{ ...btnStyle, background: 'rgba(255,255,255,0.05)', color: 'var(--text-mute)' }}
                        title="Remove"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  )}

                  {/* Expanded stat block — full 5e-style */}
                  {expandedMonster === m.id && statBlock && (() => {
                    const divider = { borderTop: '1px solid rgba(201,168,76,0.25)', margin: '6px 0' };
                    const sectionHeader = { color: '#c9a84c', fontSize: '11px', fontWeight: 700, marginBottom: '3px' };
                    const labelStyle = { color: 'var(--text-mute)' };
                    const bodyStyle = { color: 'var(--text-dim)' };
                    const saves = statBlock.saving_throws || statBlock.saves;
                    const lrMax = statBlock.legendary_resistance;
                    const lrUsed = legendaryUsed[m.id] || 0;

                    return (
                      <div style={{
                        padding: '8px 10px', borderTop: '1px solid rgba(255,255,255,0.04)',
                        fontSize: '10px', color: 'var(--text-dim)',
                        fontFamily: 'var(--font-mono)',
                        display: 'grid', gap: '2px',
                      }}>
                        {/* Basic info */}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {statBlock.size && <span><span style={labelStyle}>Size:</span> {statBlock.size}</span>}
                          {statBlock.type && <span><span style={labelStyle}>Type:</span> {statBlock.type}</span>}
                          {statBlock.cr && <span><span style={labelStyle}>CR:</span> {statBlock.cr}</span>}
                          {statBlock.speed && <span><span style={labelStyle}>Speed:</span> {statBlock.speed}</span>}
                        </div>

                        <div style={divider} />

                        {/* Ability scores */}
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                          {['str', 'dex', 'con', 'int', 'wis', 'cha'].map(stat => (
                            statBlock[stat] !== undefined && (
                              <span key={stat} style={{ textAlign: 'center' }}>
                                <span style={{ ...labelStyle, textTransform: 'uppercase', display: 'block', fontSize: '9px' }}>{stat}</span>
                                <span style={{ color: 'var(--text)', fontWeight: 600 }}>
                                  {statBlock[stat]} <span style={{ color: 'var(--text-mute)', fontSize: '9px' }}>({Math.floor((statBlock[stat] - 10) / 2) >= 0 ? '+' : ''}{Math.floor((statBlock[stat] - 10) / 2)})</span>
                                </span>
                              </span>
                            )
                          ))}
                        </div>

                        <div style={divider} />

                        {/* Saving throws */}
                        {saves && (
                          <div><span style={labelStyle}>Saving Throws </span>
                            {typeof saves === 'string' ? saves : typeof saves === 'object' && !Array.isArray(saves)
                              ? Object.entries(saves).map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)} +${v}`).join(', ')
                              : Array.isArray(saves) ? saves.join(', ') : ''}
                          </div>
                        )}

                        {/* Skills */}
                        {statBlock.skills && (
                          <div><span style={labelStyle}>Skills </span>
                            {typeof statBlock.skills === 'string' ? statBlock.skills : typeof statBlock.skills === 'object' && !Array.isArray(statBlock.skills)
                              ? Object.entries(statBlock.skills).map(([k, v]) => `${k} +${v}`).join(', ')
                              : Array.isArray(statBlock.skills) ? statBlock.skills.join(', ') : ''}
                          </div>
                        )}

                        {/* Damage vulnerabilities */}
                        {statBlock.damage_vulnerabilities && (
                          <div><span style={labelStyle}>Damage Vulnerabilities </span>
                            {Array.isArray(statBlock.damage_vulnerabilities) ? statBlock.damage_vulnerabilities.join(', ') : statBlock.damage_vulnerabilities}
                          </div>
                        )}

                        {/* Damage resistances */}
                        {statBlock.damage_resistances && (
                          <div><span style={labelStyle}>Damage Resistances </span>
                            {Array.isArray(statBlock.damage_resistances) ? statBlock.damage_resistances.join(', ') : statBlock.damage_resistances}
                          </div>
                        )}

                        {/* Damage immunities */}
                        {statBlock.damage_immunities && (
                          <div><span style={labelStyle}>Damage Immunities </span>
                            {Array.isArray(statBlock.damage_immunities) ? statBlock.damage_immunities.join(', ') : statBlock.damage_immunities}
                          </div>
                        )}

                        {/* Condition immunities */}
                        {statBlock.condition_immunities && (
                          <div><span style={labelStyle}>Condition Immunities </span>
                            {Array.isArray(statBlock.condition_immunities) ? statBlock.condition_immunities.join(', ') : statBlock.condition_immunities}
                          </div>
                        )}

                        {/* Senses */}
                        {statBlock.senses && (
                          <div><span style={labelStyle}>Senses </span>
                            {Array.isArray(statBlock.senses) ? statBlock.senses.join(', ') : statBlock.senses}
                          </div>
                        )}

                        {/* Languages */}
                        {statBlock.languages && (
                          <div><span style={labelStyle}>Languages </span>
                            {Array.isArray(statBlock.languages) ? statBlock.languages.join(', ') : statBlock.languages}
                          </div>
                        )}

                        {/* Special Abilities / Traits */}
                        {statBlock.traits && statBlock.traits.length > 0 && (
                          <>
                            <div style={divider} />
                            <div style={sectionHeader}>Traits</div>
                            {statBlock.traits.map((t, i) => (
                              <div key={i} style={{ marginBottom: '3px' }}>
                                {typeof t === 'object' && t.name ? (
                                  <>
                                    <span style={{ color: 'var(--text)', fontWeight: 600, fontStyle: 'italic' }}>{t.name}. </span>
                                    <span style={bodyStyle}>{t.desc || t.description || ''}</span>
                                  </>
                                ) : (
                                  <span style={bodyStyle}>{typeof t === 'string' ? t : JSON.stringify(t)}</span>
                                )}
                              </div>
                            ))}
                          </>
                        )}

                        {statBlock.special_abilities && statBlock.special_abilities.length > 0 && (
                          <>
                            <div style={divider} />
                            <div style={sectionHeader}>Special Abilities</div>
                            {statBlock.special_abilities.map((a, i) => (
                              <div key={i} style={{ marginBottom: '3px' }}>
                                <span style={{ color: 'var(--text)', fontWeight: 600, fontStyle: 'italic' }}>{a.name}. </span>
                                <span style={bodyStyle}>{a.desc || a.description || ''}</span>
                              </div>
                            ))}
                          </>
                        )}

                        {/* Actions */}
                        {((statBlock.attacks && statBlock.attacks.length > 0) || (statBlock.actions && statBlock.actions.length > 0)) && (
                          <>
                            <div style={divider} />
                            <div style={sectionHeader}>Actions</div>
                            {(statBlock.actions || []).map((a, i) => (
                              <div key={`action-${i}`} style={{ marginBottom: '3px' }}>
                                <span style={{ color: 'var(--text)', fontWeight: 600, fontStyle: 'italic' }}>{a.name}. </span>
                                <span style={bodyStyle}>{a.desc || a.description || ''}</span>
                              </div>
                            ))}
                            {(statBlock.attacks || []).filter(a => !(statBlock.actions || []).some(ac => ac.name === a.name)).map((a, i) => (
                              <div key={`atk-${i}`} style={{ marginBottom: '3px' }}>
                                <span style={{ color: 'var(--text)', fontWeight: 600, fontStyle: 'italic' }}>{a.name}. </span>
                                <span style={bodyStyle}>
                                  {a.desc || a.description || `+${a.bonus} to hit, ${a.damage} damage`}
                                </span>
                              </div>
                            ))}
                          </>
                        )}

                        {/* Reactions */}
                        {statBlock.reactions && statBlock.reactions.length > 0 && (
                          <>
                            <div style={divider} />
                            <div style={sectionHeader}>Reactions</div>
                            {statBlock.reactions.map((r, i) => (
                              <div key={i} style={{ marginBottom: '3px' }}>
                                <span style={{ color: 'var(--text)', fontWeight: 600, fontStyle: 'italic' }}>{r.name}. </span>
                                <span style={bodyStyle}>{r.desc || r.description || ''}</span>
                              </div>
                            ))}
                          </>
                        )}

                        {/* Legendary Resistance */}
                        {lrMax && (
                          <>
                            <div style={divider} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={sectionHeader}>Legendary Resistance ({lrMax}/Day)</span>
                              <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                                {Array.from({ length: lrMax }, (_, i) => (
                                  <button
                                    key={i}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setLegendaryUsed(prev => ({
                                        ...prev,
                                        [m.id]: i < lrUsed ? i : i + 1,
                                      }));
                                    }}
                                    style={{
                                      width: '14px', height: '14px', borderRadius: '50%',
                                      border: '1px solid #c9a84c',
                                      background: i < lrUsed ? '#c9a84c' : 'transparent',
                                      cursor: 'pointer', padding: 0,
                                      transition: 'background 0.15s',
                                    }}
                                    title={i < lrUsed ? 'Click to restore' : 'Click to use'}
                                  />
                                ))}
                                <span style={{ ...labelStyle, fontSize: '9px', marginLeft: '4px' }}>{lrUsed}/{lrMax} used</span>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Legendary Actions */}
                        {statBlock.legendary_actions && statBlock.legendary_actions.length > 0 && (
                          <>
                            <div style={divider} />
                            <div style={sectionHeader}>Legendary Actions</div>
                            {statBlock.legendary_actions.map((la, i) => (
                              <div key={i} style={{ marginBottom: '3px' }}>
                                <span style={{ color: 'var(--text)', fontWeight: 600, fontStyle: 'italic' }}>{la.name}. </span>
                                <span style={bodyStyle}>{la.desc || la.description || ''}</span>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
