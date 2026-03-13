import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Sparkles, Plus, Trash2, Check, X, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';

const ARC_STATUSES = {
  active: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  resolved: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  abandoned: 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30',
};

const ENTRY_TYPES = ['hook', 'development', 'complication', 'climax', 'resolution'];

const ENTRY_TYPE_COLORS = {
  hook: 'bg-sky-500/15 text-sky-300 border-sky-500/25',
  development: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
  complication: 'bg-rose-500/15 text-rose-300 border-rose-500/25',
  climax: 'bg-purple-500/15 text-purple-300 border-purple-500/25',
  resolution: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
};

function StatusBadge({ status }) {
  const colors = ARC_STATUSES[status] || ARC_STATUSES.active;
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${colors}`}>
      {status}
    </span>
  );
}

function EntryTypeBadge({ type }) {
  const colors = ENTRY_TYPE_COLORS[type] || ENTRY_TYPE_COLORS.development;
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${colors}`}>
      {type}
    </span>
  );
}

/* ── Arc Card with timeline ── */

function ArcCard({ arc, campaignId, onRefresh }) {
  const [expanded, setExpanded] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [showResolve, setShowResolve] = useState(false);

  // Entry form
  const [entrySession, setEntrySession] = useState('');
  const [entryDesc, setEntryDesc] = useState('');
  const [entryType, setEntryType] = useState('development');
  const [entryNpc, setEntryNpc] = useState('');
  const [savingEntry, setSavingEntry] = useState(false);

  // Resolve form
  const [resolveText, setResolveText] = useState('');
  const [resolving, setResolving] = useState(false);

  const fetchEntries = useCallback(async () => {
    if (!arc.id) return;
    setLoadingEntries(true);
    try {
      const data = await invoke('get_arc_entries', { arcId: arc.id });
      setEntries(data || []);
    } catch (err) {
      console.error('[CharacterArcManager] get_arc_entries:', err);
    } finally {
      setLoadingEntries(false);
    }
  }, [arc.id]);

  useEffect(() => {
    if (expanded) fetchEntries();
  }, [expanded, fetchEntries]);

  const handleAddEntry = async () => {
    if (!entryDesc.trim()) return;
    setSavingEntry(true);
    try {
      await invoke('add_arc_entry', {
        arcId: arc.id,
        sessionNumber: entrySession ? parseInt(entrySession, 10) : null,
        description: entryDesc.trim(),
        entryType,
        npcInvolved: entryNpc.trim() || null,
      });
      setEntryDesc('');
      setEntrySession('');
      setEntryNpc('');
      setEntryType('development');
      setShowAddEntry(false);
      await fetchEntries();
    } catch (err) {
      console.error('[CharacterArcManager] add_arc_entry:', err);
    } finally {
      setSavingEntry(false);
    }
  };

  const handleResolve = async () => {
    if (!resolveText.trim()) return;
    setResolving(true);
    try {
      await invoke('resolve_arc', { arcId: arc.id, resolution: resolveText.trim() });
      setResolveText('');
      setShowResolve(false);
      onRefresh();
    } catch (err) {
      console.error('[CharacterArcManager] resolve_arc:', err);
    } finally {
      setResolving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await invoke('delete_character_arc', { arcId: arc.id });
      onRefresh();
    } catch (err) {
      console.error('[CharacterArcManager] delete_character_arc:', err);
    }
  };

  return (
    <div className="bg-amber-200/[0.03] border border-amber-200/10 rounded-lg overflow-hidden">
      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-amber-200/[0.03] transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          {expanded ? (
            <ChevronDown size={14} className="text-amber-400/50 shrink-0" />
          ) : (
            <ChevronRight size={14} className="text-amber-400/50 shrink-0" />
          )}
          <div className="min-w-0">
            <div className="text-sm text-amber-100/80 font-medium truncate">{arc.title}</div>
            {arc.character_name && (
              <div className="text-[11px] text-amber-200/40">{arc.character_name}</div>
            )}
          </div>
        </div>
        <StatusBadge status={arc.status || 'active'} />
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-amber-200/5 p-3 space-y-3">
          {arc.description && (
            <p className="text-xs text-amber-200/50 leading-relaxed">{arc.description}</p>
          )}

          {/* Timeline */}
          {loadingEntries ? (
            <Loader2 size={14} className="animate-spin text-amber-300/40 mx-auto" />
          ) : entries.length > 0 ? (
            <div className="space-y-1.5 pl-3 border-l border-amber-500/15">
              {entries.map((entry, i) => (
                <div key={entry.id || i} className="relative space-y-0.5">
                  <div className="absolute -left-[calc(0.75rem+1px)] top-1.5 w-1.5 h-1.5 rounded-full bg-amber-500/40" />
                  <div className="flex items-center gap-1.5">
                    <EntryTypeBadge type={entry.entry_type || 'development'} />
                    {entry.session_number != null && (
                      <span className="text-[10px] text-amber-200/25">Session {entry.session_number}</span>
                    )}
                  </div>
                  <p className="text-xs text-amber-200/50 leading-relaxed">{entry.description}</p>
                  {entry.npc_involved && (
                    <div className="text-[10px] text-amber-200/30">NPC: {entry.npc_involved}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[11px] text-amber-200/25 text-center py-2">No timeline entries yet</div>
          )}

          {/* Add Entry Form */}
          {showAddEntry ? (
            <div className="bg-black/15 border border-white/5 rounded-lg p-2.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-amber-200/50">New Timeline Entry</span>
                <button onClick={() => setShowAddEntry(false)} className="text-amber-200/30 hover:text-amber-200/60 cursor-pointer">
                  <X size={12} />
                </button>
              </div>

              <textarea
                value={entryDesc}
                onChange={(e) => setEntryDesc(e.target.value)}
                placeholder="What happened..."
                rows={2}
                className="w-full text-xs bg-black/20 border border-white/10 rounded px-2 py-1.5 text-amber-100/80 placeholder:text-amber-200/20 focus:border-amber-500/40 focus:outline-none resize-y"
              />

              <div className="flex gap-2 flex-wrap">
                <select
                  value={entryType}
                  onChange={(e) => setEntryType(e.target.value)}
                  className="text-xs bg-black/20 border border-white/10 rounded px-2 py-1 text-amber-100/80 focus:border-amber-500/40 focus:outline-none cursor-pointer"
                >
                  {ENTRY_TYPES.map((t) => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={entrySession}
                  onChange={(e) => setEntrySession(e.target.value)}
                  placeholder="Session #"
                  className="text-xs bg-black/20 border border-white/10 rounded px-2 py-1 text-amber-100/80 placeholder:text-amber-200/20 focus:border-amber-500/40 focus:outline-none w-20"
                />
                <input
                  type="text"
                  value={entryNpc}
                  onChange={(e) => setEntryNpc(e.target.value)}
                  placeholder="NPC involved"
                  className="text-xs bg-black/20 border border-white/10 rounded px-2 py-1 text-amber-100/80 placeholder:text-amber-200/20 focus:border-amber-500/40 focus:outline-none flex-1 min-w-[100px]"
                />
              </div>

              <button
                onClick={handleAddEntry}
                disabled={savingEntry || !entryDesc.trim()}
                className="text-xs px-2.5 py-1 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-all cursor-pointer flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {savingEntry ? <Loader2 size={11} className="animate-spin" /> : <Plus size={11} />}
                Add Entry
              </button>
            </div>
          ) : null}

          {/* Resolve Form */}
          {showResolve ? (
            <div className="bg-black/15 border border-emerald-500/15 rounded-lg p-2.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-emerald-300/60">Resolve Arc</span>
                <button onClick={() => setShowResolve(false)} className="text-amber-200/30 hover:text-amber-200/60 cursor-pointer">
                  <X size={12} />
                </button>
              </div>
              <textarea
                value={resolveText}
                onChange={(e) => setResolveText(e.target.value)}
                placeholder="How was this arc resolved?"
                rows={2}
                className="w-full text-xs bg-black/20 border border-white/10 rounded px-2 py-1.5 text-amber-100/80 placeholder:text-amber-200/20 focus:border-emerald-500/40 focus:outline-none resize-y"
              />
              <button
                onClick={handleResolve}
                disabled={resolving || !resolveText.trim()}
                className="text-xs px-2.5 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 transition-all cursor-pointer flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {resolving ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                Resolve
              </button>
            </div>
          ) : null}

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1">
            {arc.status === 'active' && (
              <>
                <button
                  onClick={() => { setShowAddEntry(true); setShowResolve(false); }}
                  className="text-[11px] px-2 py-1 rounded border border-amber-500/20 text-amber-300/60 hover:text-amber-300 hover:bg-amber-500/10 transition-all cursor-pointer flex items-center gap-1"
                >
                  <Plus size={11} /> Add Entry
                </button>
                <button
                  onClick={() => { setShowResolve(true); setShowAddEntry(false); }}
                  className="text-[11px] px-2 py-1 rounded border border-emerald-500/20 text-emerald-300/60 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all cursor-pointer flex items-center gap-1"
                >
                  <Check size={11} /> Resolve
                </button>
              </>
            )}
            <button
              onClick={handleDelete}
              className="text-[11px] px-2 py-1 rounded border border-red-500/15 text-red-400/40 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer flex items-center gap-1 ml-auto"
            >
              <Trash2 size={11} /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Component ── */

export default function CharacterArcManager({ campaignId }) {
  const [arcs, setArcs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  // Create form
  const [formCharacterId, setFormCharacterId] = useState('');
  const [formCharacterName, setFormCharacterName] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchArcs = useCallback(async () => {
    if (!campaignId) return;
    setLoading(true);
    try {
      const data = await invoke('list_character_arcs', { campaignId });
      setArcs(data || []);
    } catch (err) {
      console.error('[CharacterArcManager] list_character_arcs:', err);
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    fetchArcs();
  }, [fetchArcs]);

  const handleCreate = async () => {
    if (!formTitle.trim() || !formCharacterName.trim()) return;
    setCreating(true);
    try {
      await invoke('create_character_arc', {
        campaignId,
        characterId: formCharacterId.trim() || null,
        characterName: formCharacterName.trim(),
        title: formTitle.trim(),
        description: formDesc.trim() || null,
      });
      setFormCharacterId('');
      setFormCharacterName('');
      setFormTitle('');
      setFormDesc('');
      setShowCreate(false);
      await fetchArcs();
    } catch (err) {
      console.error('[CharacterArcManager] create_character_arc:', err);
    } finally {
      setCreating(false);
    }
  };

  // Group arcs by character
  const grouped = {};
  arcs.forEach((arc) => {
    const key = arc.character_name || 'Unknown';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(arc);
  });

  if (!campaignId) {
    return (
      <div className="card p-4 text-center text-amber-200/40 text-sm">
        <Sparkles size={24} className="mx-auto mb-2 text-amber-200/20" />
        Select a campaign to manage character arcs
      </div>
    );
  }

  return (
    <div className="card p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-100/80">
          <Sparkles size={16} className="text-amber-400" />
          <span className="text-sm font-medium">Character Arcs</span>
          <span className="text-[10px] text-amber-200/30">({arcs.length})</span>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="text-xs px-2.5 py-1 rounded border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 transition-all cursor-pointer flex items-center gap-1"
        >
          <Plus size={12} /> New Arc
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="bg-amber-200/[0.04] border border-amber-500/20 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-amber-200/60">New Character Arc</span>
            <button onClick={() => setShowCreate(false)} className="text-amber-200/30 hover:text-amber-200/60 cursor-pointer">
              <X size={14} />
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={formCharacterName}
              onChange={(e) => setFormCharacterName(e.target.value)}
              placeholder="Character name *"
              className="flex-1 text-xs bg-black/20 border border-white/10 rounded px-2.5 py-1.5 text-amber-100/80 placeholder:text-amber-200/20 focus:border-amber-500/40 focus:outline-none"
            />
            <input
              type="text"
              value={formCharacterId}
              onChange={(e) => setFormCharacterId(e.target.value)}
              placeholder="Character ID (optional)"
              className="w-36 text-xs bg-black/20 border border-white/10 rounded px-2.5 py-1.5 text-amber-100/80 placeholder:text-amber-200/20 focus:border-amber-500/40 focus:outline-none"
            />
          </div>

          <input
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="Arc title *"
            className="w-full text-xs bg-black/20 border border-white/10 rounded px-2.5 py-1.5 text-amber-100/80 placeholder:text-amber-200/20 focus:border-amber-500/40 focus:outline-none"
          />

          <textarea
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
            placeholder="Arc description (optional)"
            rows={2}
            className="w-full text-xs bg-black/20 border border-white/10 rounded px-2.5 py-1.5 text-amber-100/80 placeholder:text-amber-200/20 focus:border-amber-500/40 focus:outline-none resize-y"
          />

          <button
            onClick={handleCreate}
            disabled={creating || !formTitle.trim() || !formCharacterName.trim()}
            className="text-xs px-3 py-1.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-all cursor-pointer flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {creating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
            Create Arc
          </button>
        </div>
      )}

      {/* Arcs list grouped by character */}
      {loading ? (
        <Loader2 size={16} className="animate-spin text-amber-300/40 mx-auto" />
      ) : arcs.length === 0 ? (
        <div className="text-center py-6 text-amber-200/30 text-sm">No character arcs yet</div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([charName, charArcs]) => (
            <div key={charName} className="space-y-1.5">
              <div className="text-xs text-amber-200/40 uppercase tracking-wider">{charName}</div>
              {charArcs.map((arc) => (
                <ArcCard
                  key={arc.id}
                  arc={arc}
                  campaignId={campaignId}
                  onRefresh={fetchArcs}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
