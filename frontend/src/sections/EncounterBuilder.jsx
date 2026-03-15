import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Search, Plus, Minus, Swords, Shield, Heart, X, ChevronDown, ChevronRight,
  Save, Shuffle, Users, Target, Skull, Zap, Info,
} from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// ─── XP Thresholds per character level (DMG p. 82) ─────────────────────────
const XP_THRESHOLDS = {
  1:  [25, 50, 75, 100],
  2:  [50, 100, 150, 200],
  3:  [75, 150, 225, 400],
  4:  [125, 250, 375, 500],
  5:  [250, 500, 750, 1100],
  6:  [300, 600, 900, 1400],
  7:  [350, 750, 1100, 1700],
  8:  [450, 900, 1400, 2100],
  9:  [550, 1100, 1600, 2400],
  10: [600, 1200, 1900, 2800],
  11: [800, 1600, 2400, 3600],
  12: [1000, 2000, 3000, 4500],
  13: [1100, 2200, 3400, 5100],
  14: [1250, 2500, 3800, 5700],
  15: [1400, 2800, 4300, 6400],
  16: [1600, 3200, 4800, 7200],
  17: [2000, 3900, 5900, 8800],
  18: [2100, 4200, 6300, 9500],
  19: [2400, 4900, 7300, 10900],
  20: [2800, 5700, 8500, 12700],
};

// ─── Monster XP by CR ───────────────────────────────────────────────────────
const CR_XP = {
  '0': 10, '1/8': 25, '1/4': 50, '1/2': 100,
  '1': 200, '2': 450, '3': 700, '4': 1100, '5': 1800,
  '6': 2300, '7': 2900, '8': 3900, '9': 5000, '10': 5900,
  '11': 7200, '12': 8400, '13': 10000, '14': 11500, '15': 13000,
  '16': 15000, '17': 18000, '18': 20000, '19': 22000, '20': 25000,
  '21': 33000, '22': 41000, '23': 50000, '24': 62000, '25': 75000,
  '26': 90000, '27': 105000, '28': 120000, '29': 135000, '30': 155000,
};

// ─── Encounter multiplier by monster count ──────────────────────────────────
function getEncounterMultiplier(count) {
  if (count <= 0) return 1;
  if (count === 1) return 1;
  if (count === 2) return 1.5;
  if (count <= 6) return 2;
  if (count <= 10) return 2.5;
  if (count <= 14) return 3;
  return 4;
}

function getMonsterXP(cr) {
  return CR_XP[String(cr)] || 0;
}

// ─── Difficulty helpers ─────────────────────────────────────────────────────
const DIFFICULTIES = [
  { key: 'easy',   label: 'Easy',   color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.25)' },
  { key: 'medium', label: 'Medium', color: '#eab308', bg: 'rgba(234,179,8,0.12)',   border: 'rgba(234,179,8,0.25)' },
  { key: 'hard',   label: 'Hard',   color: '#f97316', bg: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.25)' },
  { key: 'deadly', label: 'Deadly', color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.25)' },
];

function calcDifficulty(partySize, avgLevel, monsters) {
  const level = Math.max(1, Math.min(20, Math.round(avgLevel)));
  const thresholds = XP_THRESHOLDS[level] || XP_THRESHOLDS[1];
  const partyThresholds = thresholds.map(t => t * partySize);

  const totalMonsterCount = monsters.reduce((sum, m) => sum + m.count, 0);
  const rawXP = monsters.reduce((sum, m) => sum + getMonsterXP(m.cr) * m.count, 0);
  const multiplier = getEncounterMultiplier(totalMonsterCount);
  const adjustedXP = Math.floor(rawXP * multiplier);

  let rating = 'trivial';
  if (adjustedXP >= partyThresholds[3]) rating = 'deadly';
  else if (adjustedXP >= partyThresholds[2]) rating = 'hard';
  else if (adjustedXP >= partyThresholds[1]) rating = 'medium';
  else if (adjustedXP >= partyThresholds[0]) rating = 'easy';

  return {
    rawXP,
    adjustedXP,
    multiplier,
    totalMonsterCount,
    partyThresholds,
    rating,
  };
}

// ─── CR sort helper ─────────────────────────────────────────────────────────
function crToNum(cr) {
  if (cr === '1/8') return 0.125;
  if (cr === '1/4') return 0.25;
  if (cr === '1/2') return 0.5;
  return parseFloat(cr) || 0;
}

// ─── Styles ─────────────────────────────────────────────────────────────────
const cardStyle = {
  borderRadius: 10, padding: '14px 16px',
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.06)',
};

const inputStyle = {
  width: '100%', padding: '7px 10px', borderRadius: 6,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: 'var(--text)', fontSize: '12px',
  fontFamily: 'var(--font-ui)', outline: 'none',
  boxSizing: 'border-box',
};

const btnPrimary = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  padding: '8px 16px', borderRadius: 8,
  background: 'rgba(155,89,182,0.15)', border: '1px solid rgba(155,89,182,0.3)',
  color: '#c084fc', fontSize: '12px', fontWeight: 600,
  cursor: 'pointer', fontFamily: 'var(--font-ui)',
  transition: 'all 0.15s',
};

const btnSmall = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '4px 8px', borderRadius: 5,
  fontSize: '11px', fontWeight: 600,
  cursor: 'pointer', fontFamily: 'var(--font-ui)',
  transition: 'all 0.15s', border: 'none',
};

const labelStyle = {
  fontSize: 11, fontWeight: 600, color: 'var(--text-dim)',
  marginBottom: 4, fontFamily: 'var(--font-ui)',
};

// ═════════════════════════════════════════════════════════════════════════════
// Encounter Builder Component
// ═════════════════════════════════════════════════════════════════════════════
export default function EncounterBuilder({ _characterId }) { // eslint-disable-line no-unused-vars
  // ── Party Setup ──
  const [partySize, setPartySize] = useState(4);
  const [avgLevel, setAvgLevel] = useState(3);

  // ── Monster Search ──
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterCR, setFilterCR] = useState('');

  // ── Encounter Monsters ──
  const [encounterMonsters, setEncounterMonsters] = useState([]);
  const [expandedMonster, setExpandedMonster] = useState(null);
  const [encounterName, setEncounterName] = useState('');

  // ── Search SRD monsters ──
  const handleSearch = useCallback(async (query) => {
    const q = (query ?? searchQuery).trim();
    if (!q && !filterType && !filterCR) {
      // Load all monsters when no query
      try {
        setSearching(true);
        const results = await invoke('search_srd_monsters', { query: '' });
        setSearchResults(results || []);
      } catch (e) {
        console.error('Failed to load monsters:', e);
      } finally {
        setSearching(false);
      }
      return;
    }
    setSearching(true);
    try {
      const results = await invoke('search_srd_monsters', { query: q || '' });
      let filtered = results || [];

      // Apply type filter
      if (filterType) {
        filtered = filtered.filter(m =>
          m.type && m.type.toLowerCase().includes(filterType.toLowerCase())
        );
      }
      // Apply CR filter
      if (filterCR) {
        filtered = filtered.filter(m => String(m.cr) === filterCR);
      }

      setSearchResults(filtered);
    } catch (e) {
      console.error('Failed to search monsters:', e);
      toast.error('Monster search failed');
    } finally {
      setSearching(false);
    }
  }, [searchQuery, filterType, filterCR]);

  // Load all monsters on mount
  useEffect(() => {
    handleSearch('');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-search when filters change
  useEffect(() => {
    handleSearch(searchQuery);
  }, [filterType, filterCR]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Add monster to encounter with full stat block ──
  const addMonster = useCallback((monster) => {
    // Build the full stat_block_json for downstream features
    // (initiative auto-roll reads DEX, legendary actions, etc.)
    const statBlock = {
      name: monster.name,
      size: monster.size,
      type: monster.type,
      cr: monster.cr,
      ac: monster.ac,
      hp: monster.hp,
      speed: monster.speed,
      str: monster.str,
      dex: monster.dex,
      con: monster.con,
      int: monster.int,
      wis: monster.wis,
      cha: monster.cha,
      attacks: monster.attacks || [],
      traits: monster.traits || [],
      actions: monster.actions || [],
    };

    setEncounterMonsters(prev => {
      const existing = prev.find(m => m.name === monster.name);
      if (existing) {
        return prev.map(m =>
          m.name === monster.name ? { ...m, count: m.count + 1 } : m
        );
      }
      return [...prev, {
        ...monster,
        count: 1,
        stat_block_json: JSON.stringify(statBlock),
      }];
    });

    toast.success(`Added ${monster.name} to encounter`, { duration: 1500, icon: '+' });
  }, []);

  // ── Remove / adjust count ──
  const adjustMonsterCount = useCallback((name, delta) => {
    setEncounterMonsters(prev => {
      return prev.map(m => {
        if (m.name !== name) return m;
        const newCount = m.count + delta;
        return newCount > 0 ? { ...m, count: newCount } : null;
      }).filter(Boolean);
    });
  }, []);

  const removeMonster = useCallback((name) => {
    setEncounterMonsters(prev => prev.filter(m => m.name !== name));
  }, []);

  const clearEncounter = useCallback(() => {
    setEncounterMonsters([]);
    setEncounterName('');
  }, []);

  // ── Difficulty calculation ──
  const difficulty = useMemo(() => {
    if (encounterMonsters.length === 0) return null;
    return calcDifficulty(partySize, avgLevel, encounterMonsters);
  }, [partySize, avgLevel, encounterMonsters]);

  // ── Quick Generate ──
  const quickGenerate = useCallback(async (targetDifficulty) => {
    try {
      const allMonsters = await invoke('search_srd_monsters', { query: '' });
      if (!allMonsters || allMonsters.length === 0) {
        toast.error('No SRD monsters available');
        return;
      }

      const level = Math.max(1, Math.min(20, Math.round(avgLevel)));
      const thresholds = XP_THRESHOLDS[level] || XP_THRESHOLDS[1];
      const diffIdx = DIFFICULTIES.findIndex(d => d.key === targetDifficulty);
      const targetXP = thresholds[diffIdx >= 0 ? diffIdx : 1] * partySize;

      // Filter monsters by appropriate CR range
      const maxCR = level + 3;
      const eligible = allMonsters.filter(m => {
        const cr = crToNum(m.cr);
        return cr <= maxCR && cr > 0;
      });

      if (eligible.length === 0) {
        toast.error('No eligible monsters found');
        return;
      }

      // Build encounter by randomly picking monsters
      const built = [];
      let currentXP = 0;
      let attempts = 0;
      const maxAttempts = 50;

      while (currentXP < targetXP * 0.6 && attempts < maxAttempts) {
        attempts++;
        const monster = eligible[Math.floor(Math.random() * eligible.length)];
        const monsterXP = getMonsterXP(monster.cr);
        const totalCount = built.reduce((s, m) => s + m.count, 0) + 1;
        const projectedXP = (currentXP + monsterXP) * getEncounterMultiplier(totalCount);

        if (projectedXP > targetXP * 1.3) continue;

        const existing = built.find(m => m.name === monster.name);
        if (existing) {
          existing.count += 1;
        } else {
          built.push({ ...monster, count: 1, stat_block_json: JSON.stringify(monster) });
        }
        currentXP += monsterXP;
      }

      if (built.length === 0) {
        // fallback: add one random monster
        const m = eligible[Math.floor(Math.random() * eligible.length)];
        built.push({ ...m, count: 1, stat_block_json: JSON.stringify(m) });
      }

      setEncounterMonsters(built);
      setEncounterName(`${targetDifficulty.charAt(0).toUpperCase() + targetDifficulty.slice(1)} Encounter`);
      toast.success(`Generated ${targetDifficulty} encounter`);
    } catch (e) {
      console.error('Failed to generate encounter:', e);
      toast.error('Failed to generate encounter');
    }
  }, [partySize, avgLevel]);

  // ── Save Encounter (requires active campaign with a scene) ──
  const saveEncounter = useCallback(async () => {
    if (encounterMonsters.length === 0) {
      toast.error('Add monsters before saving');
      return;
    }

    try {
      // Try to get scenes from active campaign
      const scenes = await invoke('list_scenes').catch(() => []);
      if (!scenes || scenes.length === 0) {
        // Save to localStorage as fallback
        const saved = JSON.parse(localStorage.getItem('codex_saved_encounters') || '[]');
        const encounter = {
          id: crypto.randomUUID(),
          name: encounterName || 'Unnamed Encounter',
          partySize,
          avgLevel,
          monsters: encounterMonsters,
          difficulty: difficulty?.rating || 'unknown',
          totalXP: difficulty?.rawXP || 0,
          adjustedXP: difficulty?.adjustedXP || 0,
          createdAt: new Date().toISOString(),
        };
        saved.push(encounter);
        localStorage.setItem('codex_saved_encounters', JSON.stringify(saved));
        toast.success(`Saved "${encounter.name}" locally`);
        return;
      }

      // Use the first scene to create encounter in the campaign DB
      const sceneId = scenes[0].id;
      const result = await invoke('create_encounter', { sceneId });
      const encounterId = result?.id;

      if (encounterId) {
        // Add each monster to the encounter
        for (const monster of encounterMonsters) {
          for (let i = 0; i < monster.count; i++) {
            await invoke('add_monster_to_encounter', {
              encounterId,
              name: monster.name,
              hpMax: monster.hp,
              ac: monster.ac,
              statBlockJson: monster.stat_block_json || JSON.stringify(monster),
            });
          }
        }
        toast.success(`Created encounter with ${difficulty?.totalMonsterCount || 0} monsters`);
      }
    } catch (e) {
      // Fallback to localStorage
      const saved = JSON.parse(localStorage.getItem('codex_saved_encounters') || '[]');
      const encounter = {
        id: crypto.randomUUID(),
        name: encounterName || 'Unnamed Encounter',
        partySize,
        avgLevel,
        monsters: encounterMonsters,
        difficulty: difficulty?.rating || 'unknown',
        totalXP: difficulty?.rawXP || 0,
        adjustedXP: difficulty?.adjustedXP || 0,
        createdAt: new Date().toISOString(),
      };
      saved.push(encounter);
      localStorage.setItem('codex_saved_encounters', JSON.stringify(saved));
      toast.success(`Saved "${encounter.name}" locally`);
    }
  }, [encounterMonsters, encounterName, partySize, avgLevel, difficulty]);

  // ── Get unique types from search results for filter dropdown ──
  const monsterTypes = useMemo(() => {
    const types = new Set();
    searchResults.forEach(m => { if (m.type) types.add(m.type.toLowerCase()); });
    return Array.from(types).sort();
  }, [searchResults]);

  const crOptions = useMemo(() => {
    const crs = new Set();
    searchResults.forEach(m => { if (m.cr !== undefined) crs.add(String(m.cr)); });
    return Array.from(crs).sort((a, b) => crToNum(a) - crToNum(b));
  }, [searchResults]);

  // ── Difficulty bar position ──
  const difficultyBar = useMemo(() => {
    if (!difficulty) return null;
    const { adjustedXP, partyThresholds } = difficulty;
    const maxThreshold = partyThresholds[3] * 1.5; // extend past deadly
    const pct = Math.min(100, (adjustedXP / maxThreshold) * 100);
    return { pct, thresholds: partyThresholds.map(t => Math.min(100, (t / maxThreshold) * 100)) };
  }, [difficulty]);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'rgba(155,89,182,0.12)', border: '1px solid rgba(155,89,182,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Swords size={18} style={{ color: '#c084fc' }} />
        </div>
        <div>
          <h1 style={{
            fontSize: 'calc(18px * var(--font-scale, 1))', fontWeight: 700,
            color: 'var(--text)', fontFamily: 'var(--font-display)',
            margin: 0, lineHeight: 1.2,
          }}>
            Encounter Builder
          </h1>
          <p style={{ fontSize: 11, color: 'var(--text-mute)', margin: 0, fontFamily: 'var(--font-ui)' }}>
            Build and balance combat encounters
          </p>
        </div>
      </div>

      {/* ── Party Setup + Difficulty Display ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
        {/* Party Setup Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Users size={14} style={{ color: '#c084fc' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
              Party Setup
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <div style={labelStyle}>Party Size</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button
                  onClick={() => setPartySize(Math.max(1, partySize - 1))}
                  style={{ ...btnSmall, background: 'rgba(255,255,255,0.06)', color: 'var(--text-dim)' }}
                >
                  <Minus size={10} />
                </button>
                <input
                  type="number"
                  value={partySize}
                  onChange={e => setPartySize(Math.max(1, Math.min(8, parseInt(e.target.value) || 1)))}
                  style={{ ...inputStyle, width: 48, textAlign: 'center', padding: '5px 4px' }}
                  min={1} max={8}
                />
                <button
                  onClick={() => setPartySize(Math.min(8, partySize + 1))}
                  style={{ ...btnSmall, background: 'rgba(255,255,255,0.06)', color: 'var(--text-dim)' }}
                >
                  <Plus size={10} />
                </button>
              </div>
            </div>
            <div>
              <div style={labelStyle}>Average Level</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button
                  onClick={() => setAvgLevel(Math.max(1, avgLevel - 1))}
                  style={{ ...btnSmall, background: 'rgba(255,255,255,0.06)', color: 'var(--text-dim)' }}
                >
                  <Minus size={10} />
                </button>
                <input
                  type="number"
                  value={avgLevel}
                  onChange={e => setAvgLevel(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                  style={{ ...inputStyle, width: 48, textAlign: 'center', padding: '5px 4px' }}
                  min={1} max={20}
                />
                <button
                  onClick={() => setAvgLevel(Math.min(20, avgLevel + 1))}
                  style={{ ...btnSmall, background: 'rgba(255,255,255,0.06)', color: 'var(--text-dim)' }}
                >
                  <Plus size={10} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Difficulty Display Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Target size={14} style={{ color: '#c084fc' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
              Difficulty Rating
            </span>
          </div>

          {difficulty ? (
            <>
              {/* Rating badge */}
              {(() => {
                const diff = DIFFICULTIES.find(d => d.key === difficulty.rating);
                const ratingColor = diff?.color || 'var(--text-mute)';
                const ratingLabel = diff?.label || 'Trivial';
                return (
                  <motion.div
                    key={difficulty.rating}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '4px 12px', borderRadius: 6,
                      background: diff?.bg || 'rgba(255,255,255,0.05)',
                      border: `1px solid ${diff?.border || 'rgba(255,255,255,0.1)'}`,
                      marginBottom: 10,
                    }}
                  >
                    <Skull size={12} style={{ color: ratingColor }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: ratingColor, fontFamily: 'var(--font-display)' }}>
                      {ratingLabel}
                    </span>
                  </motion.div>
                );
              })()}

              {/* XP info */}
              <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-dim)', marginBottom: 8, fontFamily: 'var(--font-ui)' }}>
                <span>Base XP: <strong style={{ color: 'var(--text)' }}>{difficulty.rawXP.toLocaleString()}</strong></span>
                <span>Adjusted: <strong style={{ color: 'var(--text)' }}>{difficulty.adjustedXP.toLocaleString()}</strong></span>
                <span>x{difficulty.multiplier}</span>
              </div>

              {/* Difficulty bar */}
              {difficultyBar && (
                <div style={{ position: 'relative', height: 8, borderRadius: 4, overflow: 'hidden', background: 'rgba(255,255,255,0.04)' }}>
                  {/* Threshold zones */}
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${difficultyBar.thresholds[0]}%`, background: 'rgba(74,222,128,0.08)' }} />
                  <div style={{ position: 'absolute', left: `${difficultyBar.thresholds[0]}%`, top: 0, bottom: 0, width: `${difficultyBar.thresholds[1] - difficultyBar.thresholds[0]}%`, background: 'rgba(234,179,8,0.08)' }} />
                  <div style={{ position: 'absolute', left: `${difficultyBar.thresholds[1]}%`, top: 0, bottom: 0, width: `${difficultyBar.thresholds[2] - difficultyBar.thresholds[1]}%`, background: 'rgba(249,115,22,0.08)' }} />
                  <div style={{ position: 'absolute', left: `${difficultyBar.thresholds[2]}%`, top: 0, bottom: 0, right: 0, background: 'rgba(239,68,68,0.08)' }} />

                  {/* Threshold markers */}
                  {difficultyBar.thresholds.map((pct, i) => (
                    <div key={i} style={{
                      position: 'absolute', left: `${pct}%`, top: 0, bottom: 0, width: 1,
                      background: DIFFICULTIES[i].color, opacity: 0.3,
                    }} />
                  ))}

                  {/* Current position */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${difficultyBar.pct}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    style={{
                      position: 'absolute', left: 0, top: 0, bottom: 0,
                      borderRadius: 4,
                      background: DIFFICULTIES.find(d => d.key === difficulty.rating)?.color || '#c084fc',
                      opacity: 0.7,
                    }}
                  />
                </div>
              )}

              {/* Threshold labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                {DIFFICULTIES.map(d => {
                  const idx = DIFFICULTIES.indexOf(d);
                  return (
                    <span key={d.key} style={{
                      fontSize: 9, color: d.color, opacity: 0.6,
                      fontFamily: 'var(--font-mono)', fontWeight: 600,
                    }}>
                      {d.label} ({difficulty.partyThresholds[idx].toLocaleString()})
                    </span>
                  );
                })}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '12px 0', color: 'var(--text-mute)', fontSize: 12 }}>
              <Info size={16} style={{ opacity: 0.3, marginBottom: 4 }} />
              <p style={{ margin: 0 }}>Add monsters to see difficulty</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Monster Search ── */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <Search size={14} style={{ color: '#c084fc' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
            Monster Library
          </span>
          <span style={{ fontSize: 10, color: 'var(--text-mute)', marginLeft: 'auto', fontFamily: 'var(--font-mono)' }}>
            {searchResults.length} monsters
          </span>
        </div>

        {/* Search + Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 160 }}>
            <Search size={12} style={{
              position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-mute)', pointerEvents: 'none',
            }} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Search by name..."
              style={{ ...inputStyle, paddingLeft: 26 }}
            />
          </div>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            style={{ ...inputStyle, width: 'auto', minWidth: 110, cursor: 'pointer', appearance: 'auto' }}
          >
            <option value="">All Types</option>
            {monsterTypes.map(t => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
          <select
            value={filterCR}
            onChange={e => setFilterCR(e.target.value)}
            style={{ ...inputStyle, width: 'auto', minWidth: 80, cursor: 'pointer', appearance: 'auto' }}
          >
            <option value="">All CR</option>
            {crOptions.map(cr => (
              <option key={cr} value={cr}>CR {cr}</option>
            ))}
          </select>
          <button
            onClick={() => handleSearch()}
            disabled={searching}
            style={{ ...btnPrimary, padding: '7px 14px' }}
          >
            {searching ? '...' : 'Search'}
          </button>
        </div>

        {/* Results Grid */}
        <div style={{
          maxHeight: 280, overflowY: 'auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 6,
        }}>
          {searchResults.map((m, idx) => {
            const xpVal = getMonsterXP(m.cr);
            const alreadyAdded = encounterMonsters.some(em => em.name === m.name);
            return (
              <motion.div
                key={`${m.name}-${idx}`}
                whileHover={{ scale: 1.01 }}
                style={{
                  display: 'flex', alignItems: 'stretch', gap: 0,
                  borderRadius: 8,
                  background: alreadyAdded ? 'rgba(155,89,182,0.06)' : 'rgba(255,255,255,0.02)',
                  border: alreadyAdded ? '1px solid rgba(155,89,182,0.2)' : '1px solid rgba(255,255,255,0.05)',
                  transition: 'border-color 0.15s',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(155,89,182,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = alreadyAdded ? 'rgba(155,89,182,0.2)' : 'rgba(255,255,255,0.05)'}
              >
                {/* Monster info area — clickable */}
                <div
                  onClick={() => addMonster(m)}
                  style={{
                    flex: 1, minWidth: 0, padding: '8px 10px',
                    cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 3,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                      {m.name}
                    </div>
                    {alreadyAdded && (
                      <span style={{
                        fontSize: 9, color: '#c084fc', fontWeight: 700,
                        padding: '1px 5px', borderRadius: 4,
                        background: 'rgba(155,89,182,0.15)',
                        fontFamily: 'var(--font-mono)', flexShrink: 0,
                      }}>
                        x{encounterMonsters.find(em => em.name === m.name)?.count || 0}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-mute)', fontFamily: 'var(--font-ui)' }}>
                    {m.size} {m.type} · CR {m.cr} · {xpVal.toLocaleString()} XP
                  </div>
                  {/* Stat preview row */}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 1 }}>
                    <span style={{ fontSize: 10, color: '#60a5fa', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Shield size={8} /> {m.ac}
                    </span>
                    <span style={{ fontSize: 10, color: '#4ade80', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Heart size={8} /> {m.hp}
                    </span>
                    {m.speed && (
                      <span style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                        {m.speed}
                      </span>
                    )}
                  </div>
                </div>
                {/* Quick Add button */}
                <button
                  onClick={(e) => { e.stopPropagation(); addMonster(m); }}
                  title={`Quick Add ${m.name} — full stat block will be imported`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 36, flexShrink: 0,
                    background: 'rgba(155,89,182,0.08)',
                    border: 'none', borderLeft: '1px solid rgba(255,255,255,0.04)',
                    cursor: 'pointer', transition: 'background 0.15s',
                    color: '#c084fc',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(155,89,182,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(155,89,182,0.08)'}
                >
                  <Plus size={14} />
                </button>
              </motion.div>
            );
          })}
          {searchResults.length === 0 && !searching && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 16, color: 'var(--text-mute)', fontSize: 12 }}>
              No monsters found
            </div>
          )}
        </div>
      </div>

      {/* ── Encounter Roster ── */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <Swords size={14} style={{ color: '#c084fc' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
            Encounter Roster
          </span>
          {encounterMonsters.length > 0 && (
            <span style={{
              fontSize: 10, color: 'var(--text-mute)', marginLeft: 'auto',
              fontFamily: 'var(--font-mono)',
            }}>
              {difficulty?.totalMonsterCount || 0} creature{(difficulty?.totalMonsterCount || 0) !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {encounterMonsters.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-mute)', fontSize: 12 }}>
            <Swords size={20} style={{ opacity: 0.2, marginBottom: 6 }} />
            <p style={{ margin: 0 }}>Click monsters above to add them</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 6 }}>
            <AnimatePresence mode="popLayout">
              {encounterMonsters.map(m => {
                const xp = getMonsterXP(m.cr);
                const isExpanded = expandedMonster === m.name;
                return (
                  <motion.div
                    key={m.name}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      borderRadius: 8,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Monster row */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 10px',
                    }}>
                      {/* Expand toggle */}
                      <button
                        onClick={() => setExpandedMonster(isExpanded ? null : m.name)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-mute)', padding: 0, display: 'flex' }}
                      >
                        {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                      </button>

                      {/* Name + info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {m.name}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-mute)', fontFamily: 'var(--font-ui)' }}>
                          CR {m.cr} · {xp.toLocaleString()} XP each · {(xp * m.count).toLocaleString()} XP total
                        </div>
                      </div>

                      {/* Count controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <button
                          onClick={() => adjustMonsterCount(m.name, -1)}
                          style={{ ...btnSmall, background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}
                        >
                          <Minus size={10} />
                        </button>
                        <span style={{
                          minWidth: 24, textAlign: 'center',
                          fontSize: 13, fontWeight: 700, color: 'var(--text)',
                          fontFamily: 'var(--font-mono)',
                        }}>
                          {m.count}
                        </span>
                        <button
                          onClick={() => adjustMonsterCount(m.name, 1)}
                          style={{ ...btnSmall, background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}
                        >
                          <Plus size={10} />
                        </button>
                      </div>

                      {/* Stats */}
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        <span style={{ fontSize: 10, color: '#60a5fa', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Shield size={9} /> {m.ac}
                        </span>
                        <span style={{ fontSize: 10, color: '#4ade80', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Heart size={9} /> {m.hp}
                        </span>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeMonster(m.name)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-mute)', padding: 2, display: 'flex', transition: 'color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-mute)'}
                      >
                        <X size={12} />
                      </button>
                    </div>

                    {/* Expanded Stat Block */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{
                            padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.04)',
                            fontSize: 11, color: 'var(--text-dim)',
                            fontFamily: 'var(--font-mono)', display: 'grid', gap: 6,
                          }}>
                            {/* Basic info */}
                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                              {m.size && <span><span style={{ color: 'var(--text-mute)' }}>Size:</span> {m.size}</span>}
                              {m.type && <span><span style={{ color: 'var(--text-mute)' }}>Type:</span> {m.type}</span>}
                              {m.speed && <span><span style={{ color: 'var(--text-mute)' }}>Speed:</span> {m.speed}</span>}
                            </div>

                            {/* Ability scores */}
                            <div style={{
                              display: 'flex', gap: 8,
                              padding: '6px 10px', borderRadius: 6,
                              background: 'rgba(255,255,255,0.02)',
                            }}>
                              {['str', 'dex', 'con', 'int', 'wis', 'cha'].map(stat => (
                                m[stat] !== undefined && (
                                  <div key={stat} style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 8, color: 'var(--text-mute)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em' }}>
                                      {stat}
                                    </div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                                      {m[stat]}
                                    </div>
                                    <div style={{ fontSize: 9, color: 'var(--text-dim)' }}>
                                      ({Math.floor((m[stat] - 10) / 2) >= 0 ? '+' : ''}{Math.floor((m[stat] - 10) / 2)})
                                    </div>
                                  </div>
                                )
                              ))}
                            </div>

                            {/* Attacks */}
                            {m.attacks && m.attacks.length > 0 && (
                              <div>
                                <div style={{ fontSize: 10, fontWeight: 700, color: '#fca5a5', marginBottom: 3 }}>Attacks</div>
                                {m.attacks.map((a, i) => (
                                  <div key={i} style={{ display: 'flex', gap: 8, padding: '2px 0' }}>
                                    <span style={{ color: 'var(--text)', fontWeight: 600 }}>{a.name}</span>
                                    <span style={{ color: '#c084fc' }}>+{a.bonus}</span>
                                    <span style={{ color: 'var(--text-dim)' }}>{a.damage}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Traits */}
                            {m.traits && m.traits.length > 0 && (
                              <div>
                                <div style={{ fontSize: 10, fontWeight: 700, color: '#fde68a', marginBottom: 3 }}>Traits</div>
                                <div style={{ color: 'var(--text-dim)' }}>{m.traits.join(', ')}</div>
                              </div>
                            )}

                            {/* Actions */}
                            {m.actions && m.actions.length > 0 && (
                              <div>
                                <div style={{ fontSize: 10, fontWeight: 700, color: '#86efac', marginBottom: 3 }}>Actions</div>
                                <div style={{ color: 'var(--text-dim)' }}>{m.actions.join(', ')}</div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Quick Generate ── */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <Shuffle size={14} style={{ color: '#c084fc' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
            Quick Generate
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {DIFFICULTIES.map(d => (
            <button
              key={d.key}
              onClick={() => quickGenerate(d.key)}
              style={{
                ...btnSmall,
                padding: '6px 14px',
                background: d.bg,
                border: `1px solid ${d.border}`,
                color: d.color,
                fontSize: 12,
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.8'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <Zap size={10} style={{ marginRight: 4 }} /> {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Save Controls ── */}
      <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <input
          value={encounterName}
          onChange={e => setEncounterName(e.target.value)}
          placeholder="Encounter name..."
          style={{ ...inputStyle, flex: '1 1 200px' }}
        />
        <button
          onClick={saveEncounter}
          disabled={encounterMonsters.length === 0}
          style={{
            ...btnPrimary,
            opacity: encounterMonsters.length === 0 ? 0.4 : 1,
            cursor: encounterMonsters.length === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          <Save size={13} /> Save Encounter
        </button>
        {encounterMonsters.length > 0 && (
          <button
            onClick={clearEncounter}
            style={{ ...btnSmall, background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '8px 14px', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <X size={11} style={{ marginRight: 4 }} /> Clear
          </button>
        )}
      </div>
    </div>
  );
}
