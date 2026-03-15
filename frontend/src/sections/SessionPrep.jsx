import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ClipboardList, Users, Swords, ScrollText, CheckSquare, ChevronDown, ChevronUp,
  Target, MapPin, Play, Search, Filter, X, AlertCircle, Edit3, Plus, Trash2,
} from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// ─── Helpers ────────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  active: '#c9a84c',
  completed: '#4ade80',
  failed: '#ef4444',
};

const NPC_STATUS_COLORS = {
  alive: '#4ade80',
  dead: '#ef4444',
  missing: '#f59e0b',
};

const DIFFICULTY_COLORS = {
  easy: '#4ade80',
  medium: '#c9a84c',
  hard: '#f97316',
  deadly: '#ef4444',
  unknown: '#94a3b8',
};

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

function storageKey(characterId, suffix) {
  return `session_prep_${suffix}_${characterId}`;
}

// ─── Stagger animation variants ─────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

// ─── Sub-Components ─────────────────────────────────────────────────────────

function PanelHeader({ icon: Icon, title, count, iconColor = '#c9a84c', children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Icon size={18} style={{ color: iconColor }} />
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'calc(15px * var(--font-scale, 1))', color: 'var(--text)', margin: 0, fontWeight: 600 }}>
          {title}
        </h3>
        {count !== undefined && (
          <span style={{ fontSize: '11px', background: 'rgba(201,168,76,0.15)', color: '#c9a84c', borderRadius: '10px', padding: '2px 8px', fontWeight: 600, fontFamily: 'var(--font-ui)' }}>
            {count}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function StatusBadge({ status, colors = STATUS_COLORS }) {
  const color = colors[status] || '#94a3b8';
  return (
    <span style={{
      fontSize: '10px', fontWeight: 600, fontFamily: 'var(--font-ui)',
      padding: '2px 8px', borderRadius: '4px', textTransform: 'capitalize',
      background: `${color}20`, color, border: `1px solid ${color}40`,
    }}>
      {status}
    </span>
  );
}

// ─── Session Overview Panel ─────────────────────────────────────────────────
function SessionOverviewPanel({ characterId, onStartSession }) {
  const [sessionNumber, setSessionNumber] = useState(() => {
    try { return localStorage.getItem(storageKey(characterId, 'session_number')) || '1'; } catch { return '1'; }
  });
  const [sessionDate, setSessionDate] = useState(() => {
    try { return localStorage.getItem(storageKey(characterId, 'session_date')) || todayISO(); } catch { return todayISO(); }
  });
  const [goals, setGoals] = useState(() => {
    try { return localStorage.getItem(storageKey(characterId, 'session_goals')) || ''; } catch { return ''; }
  });

  useEffect(() => {
    localStorage.setItem(storageKey(characterId, 'session_number'), sessionNumber);
  }, [sessionNumber, characterId]);

  useEffect(() => {
    localStorage.setItem(storageKey(characterId, 'session_date'), sessionDate);
  }, [sessionDate, characterId]);

  useEffect(() => {
    localStorage.setItem(storageKey(characterId, 'session_goals'), goals);
  }, [goals, characterId]);

  return (
    <motion.div variants={itemVariants} className="card" style={{ background: 'rgba(155,89,182,0.06)', border: '1px solid rgba(155,89,182,0.2)', borderRadius: '12px', padding: '20px' }}>
      <PanelHeader icon={ClipboardList} title="Session Overview" iconColor="rgba(155,89,182,0.9)" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'end', marginBottom: '14px' }}>
        <div>
          <label style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)', display: 'block', marginBottom: '4px' }}>Session #</label>
          <input
            type="number" min="1" value={sessionNumber}
            onChange={e => setSessionNumber(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.04)', color: 'var(--text)', fontSize: '14px', fontFamily: 'var(--font-ui)', outline: 'none' }}
          />
        </div>
        <div>
          <label style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)', display: 'block', marginBottom: '4px' }}>Date</label>
          <input
            type="date" value={sessionDate}
            onChange={e => setSessionDate(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.04)', color: 'var(--text)', fontSize: '14px', fontFamily: 'var(--font-ui)', outline: 'none' }}
          />
        </div>
        <button
          onClick={onStartSession}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, rgba(155,89,182,0.7), rgba(155,89,182,0.5))', color: 'white', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Play size={14} /> Start Session
        </button>
      </div>

      <div>
        <label style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)', display: 'block', marginBottom: '4px' }}>Session Goals / Agenda</label>
        <textarea
          value={goals}
          onChange={e => setGoals(e.target.value)}
          placeholder="What do you want to accomplish this session?"
          rows={3}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.04)', color: 'var(--text)', fontSize: '13px', fontFamily: 'var(--font-ui)', outline: 'none', resize: 'vertical', lineHeight: 1.5 }}
        />
      </div>
    </motion.div>
  );
}

// ─── Quest Tracker Panel ────────────────────────────────────────────────────
function QuestTrackerPanel({ characterId }) {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadQuests = useCallback(async () => {
    try {
      const data = await invoke('get_quests', { characterId });
      setQuests(Array.isArray(data) ? data : []);
    } catch (e) {
      console.warn('Failed to load quests:', e);
      setQuests([]);
    } finally {
      setLoading(false);
    }
  }, [characterId]);

  useEffect(() => { loadQuests(); }, [loadQuests]);

  const toggleStatus = useCallback(async (quest) => {
    const nextStatus = quest.status === 'active' ? 'completed' : quest.status === 'completed' ? 'failed' : 'active';
    try {
      await invoke('update_quest', { questId: quest.id, status: nextStatus });
      loadQuests();
      toast.success(`Quest marked as ${nextStatus}`);
    } catch (e) {
      console.warn('Failed to update quest status:', e);
      toast.error('Failed to update quest');
    }
  }, [loadQuests]);

  const activeQuests = quests.filter(q => q.status === 'active');
  const completedQuests = quests.filter(q => q.status === 'completed');
  const failedQuests = quests.filter(q => q.status === 'failed');

  return (
    <motion.div variants={itemVariants} className="card" style={{ background: 'rgba(4,4,11,0.5)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
      <PanelHeader icon={Target} title="Quest Tracker" count={activeQuests.length} iconColor="#c9a84c" />

      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-mute)', padding: '20px', fontFamily: 'var(--font-ui)', fontSize: '13px' }}>Loading quests...</div>
      ) : quests.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-mute)', padding: '20px', fontFamily: 'var(--font-ui)', fontSize: '13px' }}>
          <Target size={24} style={{ opacity: 0.3, marginBottom: '8px' }} />
          <p>No quests yet. Add quests in the Quests &amp; Plot section.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[...activeQuests, ...completedQuests, ...failedQuests].map(quest => (
            <div key={quest.id} style={{ padding: '12px', borderRadius: '8px', background: `${STATUS_COLORS[quest.status] || '#94a3b8'}08`, border: `1px solid ${STATUS_COLORS[quest.status] || '#94a3b8'}25` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{quest.title || quest.name || 'Untitled Quest'}</span>
                  <StatusBadge status={quest.status || 'active'} />
                </div>
                <button
                  onClick={() => toggleStatus(quest)}
                  style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-dim)', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}
                  title="Cycle status"
                >
                  Toggle
                </button>
              </div>
              {quest.giver && (
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)', marginBottom: '4px' }}>
                  Given by: <span style={{ color: '#c9a84c' }}>{quest.giver}</span>
                </div>
              )}
              {quest.objectives && quest.objectives.length > 0 && (
                <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {quest.objectives.map((obj, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: obj.completed ? 'var(--text-mute)' : 'var(--text-dim)', fontFamily: 'var(--font-ui)' }}>
                      <CheckSquare size={12} style={{ color: obj.completed ? '#4ade80' : 'var(--text-mute)', flexShrink: 0 }} />
                      <span style={{ textDecoration: obj.completed ? 'line-through' : 'none' }}>{obj.text || obj.description || obj}</span>
                    </div>
                  ))}
                </div>
              )}
              {quest.description && !quest.objectives?.length && (
                <p style={{ fontSize: '11px', color: 'var(--text-mute)', fontFamily: 'var(--font-ui)', margin: '4px 0 0', lineHeight: 1.4 }}>{quest.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── NPC Review Panel ───────────────────────────────────────────────────────
function NPCReviewPanel({ characterId }) {
  const [npcs, setNpcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await invoke('get_npcs', { characterId });
        setNpcs(Array.isArray(data) ? data : []);
      } catch (e) {
        console.warn('Failed to load NPCs:', e);
        setNpcs([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [characterId]);

  const filtered = useMemo(() => {
    if (filter === 'all') return npcs;
    return npcs.filter(n => (n.status || 'alive').toLowerCase() === filter);
  }, [npcs, filter]);

  return (
    <motion.div variants={itemVariants} className="card" style={{ background: 'rgba(4,4,11,0.5)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
      <PanelHeader icon={Users} title="NPC Review" count={npcs.length} iconColor="rgba(155,89,182,0.8)">
        <div style={{ display: 'flex', gap: '4px' }}>
          {['all', 'alive', 'dead', 'missing'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                fontSize: '10px', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer',
                fontFamily: 'var(--font-ui)', fontWeight: 500, textTransform: 'capitalize',
                border: filter === s ? '1px solid rgba(155,89,182,0.5)' : '1px solid var(--border)',
                background: filter === s ? 'rgba(155,89,182,0.15)' : 'rgba(255,255,255,0.03)',
                color: filter === s ? '#c084fc' : 'var(--text-dim)',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </PanelHeader>

      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-mute)', padding: '20px', fontFamily: 'var(--font-ui)', fontSize: '13px' }}>Loading NPCs...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-mute)', padding: '20px', fontFamily: 'var(--font-ui)', fontSize: '13px' }}>
          <Users size={24} style={{ opacity: 0.3, marginBottom: '8px' }} />
          <p>{filter === 'all' ? 'No NPCs yet. Add NPCs in the NPCs section.' : `No ${filter} NPCs.`}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {filtered.map(npc => {
            const status = (npc.status || 'alive').toLowerCase();
            const isExpanded = expandedId === npc.id;
            return (
              <div key={npc.id} style={{ borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <button
                  onClick={() => setExpandedId(isExpanded ? null : npc.id)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 600, color: 'var(--text)', flex: 1 }}>{npc.name}</span>
                  {npc.role && <span style={{ fontSize: '10px', color: 'var(--text-mute)', fontFamily: 'var(--font-ui)' }}>{npc.role}</span>}
                  {npc.location && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px', color: 'var(--text-mute)', fontFamily: 'var(--font-ui)' }}>
                      <MapPin size={10} /> {npc.location}
                    </span>
                  )}
                  <StatusBadge status={status} colors={NPC_STATUS_COLORS} />
                  {isExpanded ? <ChevronUp size={14} style={{ color: 'var(--text-mute)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-mute)' }} />}
                </button>
                <AnimatePresence>
                  {isExpanded && (npc.notes || npc.description) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '0 12px 12px', fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)', lineHeight: 1.5, borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                        {npc.notes || npc.description}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

// ─── Encounter Prep Panel ───────────────────────────────────────────────────
function EncounterPrepPanel({ characterId }) {
  const [encounters, setEncounters] = useState([]);
  const [readyMap, setReadyMap] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey(characterId, 'encounter_ready')) || '{}'); } catch { return {}; }
  });
  const [notesMap, setNotesMap] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey(characterId, 'encounter_notes')) || '{}'); } catch { return {}; }
  });

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('codex_saved_encounters') || '[]');
      setEncounters(saved);
    } catch { setEncounters([]); }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey(characterId, 'encounter_ready'), JSON.stringify(readyMap));
  }, [readyMap, characterId]);

  useEffect(() => {
    localStorage.setItem(storageKey(characterId, 'encounter_notes'), JSON.stringify(notesMap));
  }, [notesMap, characterId]);

  const toggleReady = (id) => {
    setReadyMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const updateNote = (id, note) => {
    setNotesMap(prev => ({ ...prev, [id]: note }));
  };

  return (
    <motion.div variants={itemVariants} className="card" style={{ background: 'rgba(4,4,11,0.5)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
      <PanelHeader icon={Swords} title="Encounter Prep" count={encounters.length} iconColor="#f97316" />

      {encounters.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-mute)', padding: '20px', fontFamily: 'var(--font-ui)', fontSize: '13px' }}>
          <Swords size={24} style={{ opacity: 0.3, marginBottom: '8px' }} />
          <p>No saved encounters. Build encounters in the Encounter Builder.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {encounters.map(enc => {
            const diffColor = DIFFICULTY_COLORS[enc.difficulty?.toLowerCase()] || DIFFICULTY_COLORS.unknown;
            const isReady = readyMap[enc.id];
            return (
              <div key={enc.id} style={{ padding: '12px', borderRadius: '8px', background: isReady ? 'rgba(74,222,128,0.05)' : 'rgba(255,255,255,0.02)', border: `1px solid ${isReady ? 'rgba(74,222,128,0.25)' : 'var(--border)'}`, transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{enc.name}</span>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: diffColor, fontFamily: 'var(--font-ui)', textTransform: 'capitalize' }}>{enc.difficulty}</span>
                  </div>
                  <button
                    onClick={() => toggleReady(enc.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', padding: '3px 10px',
                      borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600,
                      border: isReady ? '1px solid rgba(74,222,128,0.4)' : '1px solid var(--border)',
                      background: isReady ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.05)',
                      color: isReady ? '#4ade80' : 'var(--text-dim)',
                    }}
                  >
                    <CheckSquare size={11} /> {isReady ? 'Ready' : 'Not Ready'}
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--text-mute)', fontFamily: 'var(--font-ui)', marginBottom: '6px' }}>
                  <span>Monsters: {enc.monsters?.length || 0} types ({enc.monsters?.reduce((s, m) => s + (m.count || 1), 0) || 0} total)</span>
                  <span>XP: {enc.totalXP?.toLocaleString() || '?'}</span>
                </div>

                {/* Monster list */}
                {enc.monsters && enc.monsters.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                    {enc.monsters.map((m, idx) => (
                      <span key={idx} style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)' }}>
                        {m.name} {m.count > 1 ? `x${m.count}` : ''}
                      </span>
                    ))}
                  </div>
                )}

                <input
                  type="text"
                  placeholder="Quick notes..."
                  value={notesMap[enc.id] || ''}
                  onChange={e => updateNote(enc.id, e.target.value)}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)', color: 'var(--text)', fontSize: '11px', fontFamily: 'var(--font-ui)', outline: 'none' }}
                />
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

// ─── Session Notes / Reminders Panel ────────────────────────────────────────
function SessionNotesPanel({ characterId }) {
  const key = `session_prep_notes_${characterId}`;
  const [notes, setNotes] = useState(() => {
    try { return localStorage.getItem(key) || ''; } catch { return ''; }
  });
  const [checklistMode, setChecklistMode] = useState(false);

  useEffect(() => {
    localStorage.setItem(key, notes);
  }, [notes, key]);

  // Parse lines starting with "- [ ]" or "- [x]" as checklist items
  const checklistLines = useMemo(() => {
    if (!checklistMode) return [];
    return notes.split('\n').map((line, idx) => {
      const unchecked = /^- \[ \] (.*)/.exec(line);
      const checked = /^- \[x\] (.*)/.exec(line);
      if (unchecked) return { idx, text: unchecked[1], checked: false };
      if (checked) return { idx, text: checked[1], checked: true };
      return { idx, text: line, plain: true };
    });
  }, [notes, checklistMode]);

  const toggleCheck = (lineIdx) => {
    const lines = notes.split('\n');
    const line = lines[lineIdx];
    if (/^- \[ \] /.test(line)) {
      lines[lineIdx] = line.replace('- [ ] ', '- [x] ');
    } else if (/^- \[x\] /.test(line)) {
      lines[lineIdx] = line.replace('- [x] ', '- [ ] ');
    }
    setNotes(lines.join('\n'));
  };

  return (
    <motion.div variants={itemVariants} className="card" style={{ background: 'rgba(4,4,11,0.5)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
      <PanelHeader icon={ScrollText} title="Session Notes / Reminders" iconColor="#60a5fa">
        <button
          onClick={() => setChecklistMode(!checklistMode)}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', padding: '3px 10px',
            borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 500,
            border: checklistMode ? '1px solid rgba(96,165,250,0.4)' : '1px solid var(--border)',
            background: checklistMode ? 'rgba(96,165,250,0.12)' : 'rgba(255,255,255,0.03)',
            color: checklistMode ? '#60a5fa' : 'var(--text-dim)',
          }}
        >
          <CheckSquare size={11} /> Checklist
        </button>
      </PanelHeader>

      {checklistMode ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {checklistLines.map((item) => (
            item.plain ? (
              <div key={item.idx} style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)', padding: '2px 0', lineHeight: 1.5 }}>
                {item.text}
              </div>
            ) : (
              <button
                key={item.idx}
                onClick={() => toggleCheck(item.idx)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <CheckSquare size={14} style={{ color: item.checked ? '#4ade80' : 'var(--text-mute)', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: item.checked ? 'var(--text-mute)' : 'var(--text)', fontFamily: 'var(--font-ui)', textDecoration: item.checked ? 'line-through' : 'none' }}>
                  {item.text}
                </span>
              </button>
            )
          ))}
          <div style={{ marginTop: '8px', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={"Use checklist format:\n- [ ] Item one\n- [ ] Item two\n- [x] Done item"}
              rows={4}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)', color: 'var(--text)', fontSize: '12px', fontFamily: 'var(--font-mono, monospace)', outline: 'none', resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>
        </div>
      ) : (
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder={"Session notes, reminders, plot hooks...\n\nTip: Use checklist format and toggle Checklist mode:\n- [ ] Reveal the villain's plan\n- [ ] Give quest reward"}
          rows={8}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)', color: 'var(--text)', fontSize: '12px', fontFamily: 'var(--font-ui)', outline: 'none', resize: 'vertical', lineHeight: 1.6 }}
        />
      )}
    </motion.div>
  );
}

// ─── Main SessionPrep Component ─────────────────────────────────────────────
export default function SessionPrep({ characterId, onNavigate }) {
  const handleStartSession = useCallback(() => {
    if (onNavigate) {
      // Navigate to DM Session via the section navigation
      onNavigate('dm-session');
    } else {
      toast('Start Session navigation not available', { icon: 'ℹ️' });
    }
  }, [onNavigate]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 8px' }}
    >
      {/* Page title */}
      <motion.div variants={itemVariants} style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'calc(22px * var(--font-scale, 1))', color: 'var(--text)', margin: '0 0 4px', fontWeight: 700 }}>
          Session Prep
        </h2>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-dim)', margin: 0 }}>
          Prepare your encounters, review NPCs, and track quests before the session begins.
        </p>
      </motion.div>

      {/* Session Overview — full width */}
      <SessionOverviewPanel characterId={characterId} onStartSession={handleStartSession} />

      {/* 2-column grid for main panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px', marginTop: '16px' }}>
        <QuestTrackerPanel characterId={characterId} />
        <NPCReviewPanel characterId={characterId} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px', marginTop: '16px' }}>
        <EncounterPrepPanel characterId={characterId} />
        <SessionNotesPanel characterId={characterId} />
      </div>
    </motion.div>
  );
}
