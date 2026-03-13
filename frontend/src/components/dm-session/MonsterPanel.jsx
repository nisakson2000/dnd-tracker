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
export default function MonsterPanel({ encounterId, onMonsterChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [monsters, setMonsters] = useState([]);
  const [damageInputs, setDamageInputs] = useState({}); // { monsterId: string }
  const [expandedMonster, setExpandedMonster] = useState(null);

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
      setMonsters(prev => prev.map(m =>
        m.id === monsterId ? { ...m, hp_current: newHp } : m
      ));
      setDamageInputs(prev => ({ ...prev, [monsterId]: '' }));
    } catch (e) {
      toast.error('Failed to update HP');
      console.error(e);
    }
  };

  // Kill monster
  const handleKill = async (monsterId) => {
    try {
      await invoke('kill_monster', { monsterId });
      setMonsters(prev => prev.map(m =>
        m.id === monsterId ? { ...m, alive: false, hp_current: 0 } : m
      ));
      toast.success('Monster killed');
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
              } catch { /* ignore */ }

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

                  {/* Expanded stat block */}
                  {expandedMonster === m.id && statBlock && (
                    <div style={{
                      padding: '8px 10px', borderTop: '1px solid rgba(255,255,255,0.04)',
                      fontSize: '10px', color: 'var(--text-dim)',
                      fontFamily: 'var(--font-mono)',
                      display: 'grid', gap: '4px',
                    }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {statBlock.size && <span>Size: {statBlock.size}</span>}
                        {statBlock.type && <span>Type: {statBlock.type}</span>}
                        {statBlock.cr && <span>CR: {statBlock.cr}</span>}
                        {statBlock.speed && <span>Speed: {statBlock.speed}</span>}
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        {['str', 'dex', 'con', 'int', 'wis', 'cha'].map(stat => (
                          statBlock[stat] !== undefined && (
                            <span key={stat}>
                              <span style={{ color: 'var(--text-mute)', textTransform: 'uppercase' }}>{stat}</span>{' '}
                              <span style={{ color: 'var(--text)' }}>{statBlock[stat]}</span>
                            </span>
                          )
                        ))}
                      </div>
                      {statBlock.attacks && statBlock.attacks.length > 0 && (
                        <div>
                          <span style={{ color: 'var(--text-mute)' }}>Attacks: </span>
                          {statBlock.attacks.map((a, i) => (
                            <span key={i}>
                              {a.name} (+{a.bonus}, {a.damage}){i < statBlock.attacks.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </div>
                      )}
                      {statBlock.traits && statBlock.traits.length > 0 && (
                        <div>
                          <span style={{ color: 'var(--text-mute)' }}>Traits: </span>
                          {statBlock.traits.join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
