import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import {
  Users, Shield, Swords, Crown, Plus, Trash2, Edit3,
  ChevronDown, ChevronRight, Eye, EyeOff, Loader2,
  X, Save, Target, Handshake, MapPin,
} from 'lucide-react';

/* ── Constants ── */

const ALIGNMENTS = [
  'Lawful Good', 'Neutral Good', 'Chaotic Good',
  'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
  'Lawful Evil', 'Neutral Evil', 'Chaotic Evil',
];

const STATUSES = ['active', 'inactive', 'destroyed'];

const STATUS_COLORS = {
  active:    'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  inactive:  'bg-amber-500/20 text-amber-300 border-amber-500/30',
  destroyed: 'bg-red-500/20 text-red-300 border-red-500/30',
};

const RELATION_TYPES = ['allied', 'friendly', 'neutral', 'unfriendly', 'hostile', 'at_war'];

const RELATION_COLORS = {
  allied:     { bg: 'rgba(74,222,128,0.15)', text: '#4ade80', border: 'rgba(74,222,128,0.3)' },
  friendly:   { bg: 'rgba(163,230,53,0.15)', text: '#a3e635', border: 'rgba(163,230,53,0.3)' },
  neutral:    { bg: 'rgba(250,204,21,0.15)', text: '#facc15', border: 'rgba(250,204,21,0.3)' },
  unfriendly: { bg: 'rgba(251,146,60,0.15)', text: '#fb923c', border: 'rgba(251,146,60,0.3)' },
  hostile:    { bg: 'rgba(248,113,113,0.15)', text: '#f87171', border: 'rgba(248,113,113,0.3)' },
  at_war:     { bg: 'rgba(239,68,68,0.2)',    text: '#ef4444', border: 'rgba(239,68,68,0.4)' },
};

const REPUTATION_RANKS = [
  { min: -100, max: -60, label: 'Hated',      color: '#ef4444' },
  { min: -59,  max: -30, label: 'Hostile',     color: '#f87171' },
  { min: -29,  max: -10, label: 'Unfriendly',  color: '#fb923c' },
  { min: -9,   max: 9,   label: 'Unknown',     color: '#a1a1aa' },
  { min: 10,   max: 29,  label: 'Friendly',    color: '#a3e635' },
  { min: 30,   max: 59,  label: 'Trusted',     color: '#4ade80' },
  { min: 60,   max: 89,  label: 'Honored',     color: '#22d3ee' },
  { min: 90,   max: 100, label: 'Exalted',     color: '#c084fc' },
];

function getRepRank(score) {
  return REPUTATION_RANKS.find(r => score >= r.min && score <= r.max) || REPUTATION_RANKS[3];
}

/* ── Shared tiny components ── */

function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.active;
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${colors}`}>
      {status}
    </span>
  );
}

function AlignmentBadge({ alignment }) {
  if (!alignment) return null;
  return (
    <span className="text-[10px] px-1.5 py-0.5 rounded border bg-purple-500/15 text-purple-300 border-purple-500/25">
      {alignment}
    </span>
  );
}

function PowerBar({ label, value, color }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-amber-200/40 w-14 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="text-[10px] text-amber-200/40 w-6 text-right">{value}</span>
    </div>
  );
}

function TagList({ items, color = '#c084fc' }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((item, i) => (
        <span
          key={i}
          className="text-[10px] px-1.5 py-0.5 rounded border"
          style={{
            background: `${color}15`,
            color: color,
            borderColor: `${color}40`,
          }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

/* ── Relation Row ── */

function RelationRow({ relation, factions, onDelete }) {
  const otherName = relation.other_faction_name
    || factions.find(f => f.id === relation.faction_b_id || f.id === relation.faction_a_id)?.name
    || 'Unknown';
  const rc = RELATION_COLORS[relation.relation_type] || RELATION_COLORS.neutral;

  return (
    <div
      className="flex items-center justify-between gap-2 px-2 py-1.5 rounded"
      style={{ background: rc.bg, border: `1px solid ${rc.border}` }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <Handshake size={12} style={{ color: rc.text }} />
        <span className="text-xs truncate" style={{ color: rc.text }}>{otherName}</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.2)', color: rc.text }}>
          {relation.relation_type.replace('_', ' ')}
        </span>
        {relation.score != null && (
          <span className="text-[10px] text-amber-200/40">({relation.score > 0 ? '+' : ''}{relation.score})</span>
        )}
      </div>
      {relation.notes && (
        <span className="text-[10px] text-amber-200/30 truncate max-w-[120px]">{relation.notes}</span>
      )}
      {onDelete && (
        <button
          onClick={() => onDelete(relation)}
          className="text-amber-200/20 hover:text-red-400 transition-colors cursor-pointer shrink-0"
        >
          <Trash2 size={11} />
        </button>
      )}
    </div>
  );
}

/* ── Reputation Row ── */

function ReputationRow({ rep, onAdjust }) {
  const rank = getRepRank(rep.score || 0);
  const score = rep.score || 0;
  const pct = ((score + 100) / 200) * 100;

  return (
    <div className="bg-black/15 border border-white/5 rounded-lg p-2 space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-amber-100/80">{rep.character_name || 'Unknown'}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-medium" style={{ color: rank.color }}>{rank.label}</span>
          <span className="text-[10px] text-amber-200/40">({score > 0 ? '+' : ''}{score})</span>
        </div>
      </div>

      {/* Score bar */}
      <div className="relative h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className="absolute h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, background: rank.color }}
        />
        {/* Center marker */}
        <div className="absolute left-1/2 top-0 h-full w-px bg-white/20" />
      </div>

      {/* Quick adjust */}
      <div className="flex items-center gap-1">
        {[-10, -5, 5, 10].map(delta => (
          <button
            key={delta}
            onClick={() => onAdjust(rep, delta)}
            className="text-[10px] px-1.5 py-0.5 rounded border border-white/10 hover:border-purple-500/40 hover:bg-purple-500/10 text-amber-200/50 hover:text-purple-300 transition-all cursor-pointer"
          >
            {delta > 0 ? '+' : ''}{delta}
          </button>
        ))}
      </div>

      {rep.notes && <p className="text-[10px] text-amber-200/25 leading-relaxed">{rep.notes}</p>}
    </div>
  );
}

/* ── Add Relation Form ── */

function AddRelationForm({ factionId, factions, onSave, onClose }) {
  const [targetId, setTargetId] = useState('');
  const [relationType, setRelationType] = useState('neutral');
  const [score, setScore] = useState(0);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const others = factions.filter(f => f.id !== factionId);

  const handleSave = async () => {
    if (!targetId) return;
    setSaving(true);
    try {
      await invoke('set_faction_relation', {
        factionAId: factionId,
        factionBId: parseInt(targetId, 10),
        relationType,
        score: parseInt(score, 10),
        notes: notes.trim() || null,
      });
      onSave();
    } catch (err) {
      console.error('[FactionManager] set_faction_relation:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-black/15 border border-white/5 rounded-lg p-2.5 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-amber-200/50">New Relation</span>
        <button onClick={onClose} className="text-amber-200/30 hover:text-amber-200/60 cursor-pointer"><X size={12} /></button>
      </div>
      <select
        value={targetId}
        onChange={e => setTargetId(e.target.value)}
        className="w-full text-xs bg-black/20 border border-white/10 rounded px-2 py-1.5 text-amber-100/80 focus:border-purple-500/40 focus:outline-none cursor-pointer"
      >
        <option value="">Select faction...</option>
        {others.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
      </select>
      <div className="flex gap-2">
        <select
          value={relationType}
          onChange={e => setRelationType(e.target.value)}
          className="flex-1 text-xs bg-black/20 border border-white/10 rounded px-2 py-1.5 text-amber-100/80 focus:border-purple-500/40 focus:outline-none cursor-pointer"
        >
          {RELATION_TYPES.map(rt => (
            <option key={rt} value={rt}>{rt.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
          ))}
        </select>
        <input
          type="number"
          value={score}
          onChange={e => setScore(e.target.value)}
          min={-100}
          max={100}
          className="w-16 text-xs bg-black/20 border border-white/10 rounded px-2 py-1.5 text-amber-100/80 focus:border-purple-500/40 focus:outline-none text-center"
          placeholder="Score"
        />
      </div>
      <input
        type="text"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Notes (optional)"
        className="w-full text-xs bg-black/20 border border-white/10 rounded px-2 py-1.5 text-amber-100/80 placeholder:text-amber-200/20 focus:border-purple-500/40 focus:outline-none"
      />
      <button
        onClick={handleSave}
        disabled={saving || !targetId}
        className="text-xs px-3 py-1.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25 transition-all cursor-pointer flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {saving ? <Loader2 size={12} className="animate-spin" /> : <Handshake size={12} />}
        Add Relation
      </button>
    </div>
  );
}

/* ── Add Reputation Form ── */

function AddReputationForm({ factionId, onSave, onClose }) {
  const [charName, setCharName] = useState('');
  const [charId, setCharId] = useState('');
  const [repScore, setRepScore] = useState(0);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const rank = getRepRank(repScore);

  const handleSave = async () => {
    if (!charName.trim()) return;
    setSaving(true);
    try {
      await invoke('set_faction_reputation', {
        factionId,
        characterId: charId.trim() || null,
        characterName: charName.trim(),
        score: parseInt(repScore, 10),
        rank: rank.label.toLowerCase(),
        notes: notes.trim() || null,
      });
      onSave();
    } catch (err) {
      console.error('[FactionManager] set_faction_reputation:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-black/15 border border-white/5 rounded-lg p-2.5 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-amber-200/50">Add Player Reputation</span>
        <button onClick={onClose} className="text-amber-200/30 hover:text-amber-200/60 cursor-pointer"><X size={12} /></button>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={charName}
          onChange={e => setCharName(e.target.value)}
          placeholder="Character name"
          className="flex-1 text-xs bg-black/20 border border-white/10 rounded px-2 py-1.5 text-amber-100/80 placeholder:text-amber-200/20 focus:border-purple-500/40 focus:outline-none"
        />
        <input
          type="text"
          value={charId}
          onChange={e => setCharId(e.target.value)}
          placeholder="ID (optional)"
          className="w-20 text-xs bg-black/20 border border-white/10 rounded px-2 py-1.5 text-amber-100/80 placeholder:text-amber-200/20 focus:border-purple-500/40 focus:outline-none"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={-100}
          max={100}
          value={repScore}
          onChange={e => setRepScore(parseInt(e.target.value, 10))}
          className="flex-1 accent-purple-500"
        />
        <span className="text-xs w-8 text-right" style={{ color: rank.color }}>{repScore}</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${rank.color}20`, color: rank.color }}>
          {rank.label}
        </span>
      </div>
      <input
        type="text"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Notes (optional)"
        className="w-full text-xs bg-black/20 border border-white/10 rounded px-2 py-1.5 text-amber-100/80 placeholder:text-amber-200/20 focus:border-purple-500/40 focus:outline-none"
      />
      <button
        onClick={handleSave}
        disabled={saving || !charName.trim()}
        className="text-xs px-3 py-1.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25 transition-all cursor-pointer flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {saving ? <Loader2 size={12} className="animate-spin" /> : <Users size={12} />}
        Add Reputation
      </button>
    </div>
  );
}

/* ── Faction Form (Create / Edit) ── */

function FactionForm({ faction, onSave, onClose }) {
  const [name, setName] = useState(faction?.name || '');
  const [description, setDescription] = useState(faction?.description || '');
  const [leader, setLeader] = useState(faction?.leader || '');
  const [headquarters, setHeadquarters] = useState(faction?.headquarters || '');
  const [alignment, setAlignment] = useState(faction?.alignment || 'True Neutral');
  const [military, setMilitary] = useState(faction?.military ?? 50);
  const [wealth, setWealth] = useState(faction?.wealth ?? 50);
  const [influence, setInfluence] = useState(faction?.influence ?? 50);
  const [status, setStatus] = useState(faction?.status || 'active');
  const [visibility, setVisibility] = useState(faction?.visibility || 'dm_only');
  const [territories, setTerritories] = useState(() => {
    try { return faction?.territory_json ? JSON.parse(faction.territory_json) : []; }
    catch { return []; }
  });
  const [goals, setGoals] = useState(() => {
    try { return faction?.goals_json ? JSON.parse(faction.goals_json) : []; }
    catch { return []; }
  });
  const [newTerritory, setNewTerritory] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      if (faction?.id) {
        await invoke('update_faction', {
          factionId: faction.id,
          name: name.trim(),
          description: description.trim() || null,
          leader: leader.trim() || null,
          headquarters: headquarters.trim() || null,
          alignment,
          military: parseInt(military, 10),
          wealth: parseInt(wealth, 10),
          influence: parseInt(influence, 10),
          territoryJson: JSON.stringify(territories),
          goalsJson: JSON.stringify(goals),
          status,
          visibility,
        });
      } else {
        await invoke('create_faction', {
          name: name.trim(),
          description: description.trim() || null,
          leader: leader.trim() || null,
          headquarters: headquarters.trim() || null,
          alignment,
          visibility,
        });
      }
      onSave();
    } catch (err) {
      console.error('[FactionManager] save faction:', err);
    } finally {
      setSaving(false);
    }
  };

  const addTerritory = () => {
    if (newTerritory.trim()) {
      setTerritories(prev => [...prev, newTerritory.trim()]);
      setNewTerritory('');
    }
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setGoals(prev => [...prev, newGoal.trim()]);
      setNewGoal('');
    }
  };

  const inputCls = "w-full text-xs bg-black/20 border border-white/10 rounded px-2.5 py-1.5 text-amber-100/80 placeholder:text-amber-200/20 focus:border-purple-500/40 focus:outline-none";
  const selectCls = "text-xs bg-black/20 border border-white/10 rounded px-2 py-1.5 text-amber-100/80 focus:border-purple-500/40 focus:outline-none cursor-pointer";

  return (
    <div className="bg-purple-200/[0.04] border border-purple-500/20 rounded-lg p-3 space-y-2.5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-purple-200/60">{faction?.id ? 'Edit Faction' : 'New Faction'}</span>
        <button onClick={onClose} className="text-amber-200/30 hover:text-amber-200/60 cursor-pointer"><X size={14} /></button>
      </div>

      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Faction name *" className={inputCls} />

      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description..."
        rows={2}
        className={`${inputCls} resize-y`}
      />

      <div className="grid grid-cols-2 gap-2">
        <input type="text" value={leader} onChange={e => setLeader(e.target.value)} placeholder="Leader" className={inputCls} />
        <input type="text" value={headquarters} onChange={e => setHeadquarters(e.target.value)} placeholder="Headquarters" className={inputCls} />
      </div>

      <div className="flex gap-2 flex-wrap">
        <select value={alignment} onChange={e => setAlignment(e.target.value)} className={selectCls}>
          {ALIGNMENTS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} className={selectCls}>
          {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select value={visibility} onChange={e => setVisibility(e.target.value)} className={selectCls}>
          <option value="dm_only">DM Only</option>
          <option value="players">Visible to Players</option>
        </select>
      </div>

      {/* Power sliders */}
      {faction?.id && (
        <div className="space-y-1.5 bg-black/10 rounded-lg p-2">
          <span className="text-[10px] text-amber-200/40 uppercase tracking-wider">Power</span>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Swords size={10} className="text-red-400/60 shrink-0" />
              <span className="text-[10px] text-amber-200/40 w-14">Military</span>
              <input type="range" min={0} max={100} value={military} onChange={e => setMilitary(e.target.value)} className="flex-1 accent-red-500" />
              <span className="text-[10px] text-amber-200/40 w-6 text-right">{military}</span>
            </div>
            <div className="flex items-center gap-2">
              <Crown size={10} className="text-amber-400/60 shrink-0" />
              <span className="text-[10px] text-amber-200/40 w-14">Wealth</span>
              <input type="range" min={0} max={100} value={wealth} onChange={e => setWealth(e.target.value)} className="flex-1 accent-amber-500" />
              <span className="text-[10px] text-amber-200/40 w-6 text-right">{wealth}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={10} className="text-purple-400/60 shrink-0" />
              <span className="text-[10px] text-amber-200/40 w-14">Influence</span>
              <input type="range" min={0} max={100} value={influence} onChange={e => setInfluence(e.target.value)} className="flex-1 accent-purple-500" />
              <span className="text-[10px] text-amber-200/40 w-6 text-right">{influence}</span>
            </div>
          </div>
        </div>
      )}

      {/* Territories */}
      <div className="space-y-1">
        <span className="text-[10px] text-amber-200/40 uppercase tracking-wider">Territories</span>
        <TagList items={territories} color="#22d3ee" />
        <div className="flex gap-1">
          <input
            type="text"
            value={newTerritory}
            onChange={e => setNewTerritory(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTerritory()}
            placeholder="Add territory..."
            className={`flex-1 ${inputCls}`}
          />
          <button onClick={addTerritory} className="text-amber-200/30 hover:text-purple-300 cursor-pointer px-1"><Plus size={14} /></button>
        </div>
        {territories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {territories.map((t, i) => (
              <button
                key={i}
                onClick={() => setTerritories(prev => prev.filter((_, idx) => idx !== i))}
                className="text-[10px] px-1.5 py-0.5 rounded border border-cyan-500/25 bg-cyan-500/10 text-cyan-300 hover:bg-red-500/15 hover:border-red-500/25 hover:text-red-300 cursor-pointer transition-colors"
                title="Click to remove"
              >
                {t} x
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Goals */}
      <div className="space-y-1">
        <span className="text-[10px] text-amber-200/40 uppercase tracking-wider">Goals</span>
        <div className="flex gap-1">
          <input
            type="text"
            value={newGoal}
            onChange={e => setNewGoal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addGoal()}
            placeholder="Add goal..."
            className={`flex-1 ${inputCls}`}
          />
          <button onClick={addGoal} className="text-amber-200/30 hover:text-purple-300 cursor-pointer px-1"><Plus size={14} /></button>
        </div>
        {goals.length > 0 && (
          <div className="space-y-0.5">
            {goals.map((g, i) => (
              <div key={i} className="flex items-start gap-1.5 group">
                <Target size={10} className="text-amber-400/40 mt-0.5 shrink-0" />
                <span className="text-xs text-amber-200/50 flex-1">{g}</span>
                <button
                  onClick={() => setGoals(prev => prev.filter((_, idx) => idx !== i))}
                  className="text-amber-200/15 hover:text-red-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                >
                  <Trash2 size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleSave}
        disabled={saving || !name.trim()}
        className="text-xs px-3 py-1.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25 transition-all cursor-pointer flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
        {faction?.id ? 'Update Faction' : 'Create Faction'}
      </button>
    </div>
  );
}

/* ── Faction Card ── */

function FactionCard({ faction, factions, onRefresh }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [relations, setRelations] = useState([]);
  const [reputations, setReputations] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showAddRelation, setShowAddRelation] = useState(false);
  const [showAddRep, setShowAddRep] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const territories = (() => {
    try { return faction.territory_json ? JSON.parse(faction.territory_json) : []; }
    catch { return []; }
  })();
  const goals = (() => {
    try { return faction.goals_json ? JSON.parse(faction.goals_json) : []; }
    catch { return []; }
  })();

  const fetchDetails = useCallback(async () => {
    if (!faction.id) return;
    setLoadingDetails(true);
    try {
      const [rels, reps] = await Promise.all([
        invoke('get_faction_relations', { factionId: faction.id }),
        invoke('get_faction_reputations', { factionId: faction.id }),
      ]);
      setRelations(rels || []);
      setReputations(reps || []);
    } catch (err) {
      console.error('[FactionManager] fetch details:', err);
    } finally {
      setLoadingDetails(false);
    }
  }, [faction.id]);

  useEffect(() => {
    if (expanded) fetchDetails();
  }, [expanded, fetchDetails]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await invoke('delete_faction', { factionId: faction.id });
      onRefresh();
    } catch (err) {
      console.error('[FactionManager] delete_faction:', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleVisibility = async () => {
    try {
      const newVis = faction.visibility === 'players' ? 'dm_only' : 'players';
      await invoke('update_faction', {
        factionId: faction.id,
        name: faction.name,
        description: faction.description || null,
        leader: faction.leader || null,
        headquarters: faction.headquarters || null,
        alignment: faction.alignment || 'True Neutral',
        military: faction.military ?? 50,
        wealth: faction.wealth ?? 50,
        influence: faction.influence ?? 50,
        territoryJson: faction.territory_json || '[]',
        goalsJson: faction.goals_json || '[]',
        status: faction.status || 'active',
        visibility: newVis,
      });
      onRefresh();
    } catch (err) {
      console.error('[FactionManager] toggle visibility:', err);
    }
  };

  const handleRepAdjust = async (rep, delta) => {
    const newScore = Math.max(-100, Math.min(100, (rep.score || 0) + delta));
    const rank = getRepRank(newScore);
    try {
      await invoke('set_faction_reputation', {
        factionId: faction.id,
        characterId: rep.character_id || null,
        characterName: rep.character_name,
        score: newScore,
        rank: rank.label.toLowerCase(),
        notes: rep.notes || null,
      });
      await fetchDetails();
    } catch (err) {
      console.error('[FactionManager] adjust reputation:', err);
    }
  };

  if (editing) {
    return (
      <FactionForm
        faction={faction}
        onSave={() => { setEditing(false); onRefresh(); }}
        onClose={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="bg-amber-200/[0.03] border border-amber-200/10 rounded-lg overflow-hidden">
      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-amber-200/[0.03] transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          {expanded ? (
            <ChevronDown size={14} className="text-purple-400/50 shrink-0" />
          ) : (
            <ChevronRight size={14} className="text-purple-400/50 shrink-0" />
          )}
          <Shield size={14} className="text-purple-400/60 shrink-0" />
          <div className="min-w-0">
            <div className="text-sm text-amber-100/80 font-medium truncate">{faction.name}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              {faction.leader && (
                <span className="text-[10px] text-amber-200/35 flex items-center gap-0.5">
                  <Crown size={9} /> {faction.leader}
                </span>
              )}
              {faction.headquarters && (
                <span className="text-[10px] text-amber-200/35 flex items-center gap-0.5">
                  <MapPin size={9} /> {faction.headquarters}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <AlignmentBadge alignment={faction.alignment} />
          <StatusBadge status={faction.status || 'active'} />
          {faction.visibility === 'dm_only' && <EyeOff size={11} className="text-amber-200/25" />}
        </div>
      </div>

      {/* Power Bars (always visible in collapsed) */}
      {!expanded && (faction.military != null || faction.wealth != null || faction.influence != null) && (
        <div className="px-3 pb-2 space-y-0.5">
          <PowerBar label="Military" value={faction.military ?? 0} color="#ef4444" />
          <PowerBar label="Wealth" value={faction.wealth ?? 0} color="#f59e0b" />
          <PowerBar label="Influence" value={faction.influence ?? 0} color="#c084fc" />
        </div>
      )}

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-amber-200/5 p-3 space-y-3">
          {/* Description */}
          {faction.description && (
            <p className="text-xs text-amber-200/50 leading-relaxed">{faction.description}</p>
          )}

          {/* Power Bars */}
          <div className="space-y-0.5">
            <PowerBar label="Military" value={faction.military ?? 0} color="#ef4444" />
            <PowerBar label="Wealth" value={faction.wealth ?? 0} color="#f59e0b" />
            <PowerBar label="Influence" value={faction.influence ?? 0} color="#c084fc" />
          </div>

          {/* Territories */}
          {territories.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] text-amber-200/30 uppercase tracking-wider">Territories</span>
              <TagList items={territories} color="#22d3ee" />
            </div>
          )}

          {/* Goals */}
          {goals.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] text-amber-200/30 uppercase tracking-wider">Goals</span>
              <div className="space-y-0.5">
                {goals.map((g, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <Target size={10} className="text-amber-400/40 mt-0.5 shrink-0" />
                    <span className="text-xs text-amber-200/50">{g}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Relations */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-amber-200/30 uppercase tracking-wider">Relations</span>
              <button
                onClick={(e) => { e.stopPropagation(); setShowAddRelation(true); }}
                className="text-[10px] px-1.5 py-0.5 rounded border border-purple-500/25 text-purple-300/60 hover:bg-purple-500/10 cursor-pointer flex items-center gap-0.5"
              >
                <Plus size={9} /> Add
              </button>
            </div>

            {loadingDetails ? (
              <Loader2 size={14} className="animate-spin text-purple-300/40 mx-auto" />
            ) : relations.length > 0 ? (
              <div className="space-y-1">
                {relations.map((rel, i) => (
                  <RelationRow key={rel.id || i} relation={rel} factions={factions} />
                ))}
              </div>
            ) : (
              <div className="text-[11px] text-amber-200/25 text-center py-1">No relations set</div>
            )}

            {showAddRelation && (
              <AddRelationForm
                factionId={faction.id}
                factions={factions}
                onSave={() => { setShowAddRelation(false); fetchDetails(); }}
                onClose={() => setShowAddRelation(false)}
              />
            )}
          </div>

          {/* Player Reputation */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-amber-200/30 uppercase tracking-wider">Player Reputation</span>
              <button
                onClick={(e) => { e.stopPropagation(); setShowAddRep(true); }}
                className="text-[10px] px-1.5 py-0.5 rounded border border-purple-500/25 text-purple-300/60 hover:bg-purple-500/10 cursor-pointer flex items-center gap-0.5"
              >
                <Plus size={9} /> Add
              </button>
            </div>

            {loadingDetails ? (
              <Loader2 size={14} className="animate-spin text-purple-300/40 mx-auto" />
            ) : reputations.length > 0 ? (
              <div className="space-y-1.5">
                {reputations.map((rep, i) => (
                  <ReputationRow key={rep.id || i} rep={rep} onAdjust={handleRepAdjust} />
                ))}
              </div>
            ) : (
              <div className="text-[11px] text-amber-200/25 text-center py-1">No player reputations tracked</div>
            )}

            {showAddRep && (
              <AddReputationForm
                factionId={faction.id}
                onSave={() => { setShowAddRep(false); fetchDetails(); }}
                onClose={() => setShowAddRep(false)}
              />
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 pt-1 border-t border-white/5">
            <button
              onClick={(e) => { e.stopPropagation(); setEditing(true); }}
              className="text-[10px] px-2 py-1 rounded border border-white/10 text-amber-200/40 hover:text-purple-300 hover:border-purple-500/30 cursor-pointer flex items-center gap-1 transition-colors"
            >
              <Edit3 size={10} /> Edit
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleToggleVisibility(); }}
              className="text-[10px] px-2 py-1 rounded border border-white/10 text-amber-200/40 hover:text-purple-300 hover:border-purple-500/30 cursor-pointer flex items-center gap-1 transition-colors"
            >
              {faction.visibility === 'players' ? <><EyeOff size={10} /> Hide</> : <><Eye size={10} /> Reveal</>}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(); }}
              disabled={deleting}
              className="text-[10px] px-2 py-1 rounded border border-white/10 text-amber-200/40 hover:text-red-400 hover:border-red-500/30 cursor-pointer flex items-center gap-1 transition-colors ml-auto disabled:opacity-40"
            >
              {deleting ? <Loader2 size={10} className="animate-spin" /> : <Trash2 size={10} />} Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Component ── */

export default function FactionManager({ campaignId } = {}) {
  const [factions, setFactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchFactions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await invoke('list_factions');
      setFactions(data || []);
    } catch (err) {
      console.error('[FactionManager] list_factions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFactions();
  }, [fetchFactions]);

  return (
    <div className="card p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-100/80">
          <Shield size={16} className="text-purple-400" />
          <span className="text-sm font-medium">Factions</span>
          <span className="text-[10px] text-amber-200/30">({factions.length})</span>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="text-xs px-2.5 py-1 rounded border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 transition-all cursor-pointer flex items-center gap-1"
        >
          <Plus size={12} /> Add Faction
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <FactionForm
          onSave={() => { setShowForm(false); fetchFactions(); }}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Loading */}
      {loading && factions.length === 0 && (
        <div className="flex items-center justify-center py-6">
          <Loader2 size={16} className="animate-spin text-purple-300/40" />
        </div>
      )}

      {/* Empty state */}
      {!loading && factions.length === 0 && (
        <div className="text-center py-6 text-amber-200/30 text-xs space-y-2">
          <Users size={24} className="mx-auto text-amber-200/15" />
          <p>No factions yet. Create one to start tracking organizations, guilds, and power groups.</p>
        </div>
      )}

      {/* Faction list */}
      {factions.length > 0 && (
        <div className="space-y-2">
          {factions.map(faction => (
            <FactionCard
              key={faction.id}
              faction={faction}
              factions={factions}
              onRefresh={fetchFactions}
            />
          ))}
        </div>
      )}
    </div>
  );
}
