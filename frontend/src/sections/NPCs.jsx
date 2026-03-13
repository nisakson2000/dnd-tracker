import { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Edit2, Users, Search, Copy, ScrollText, Pin, ChevronDown, ChevronRight, MapPin, Clock, MessageSquare, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import MDEditor from '@uiw/react-md-editor';
import { getNPCs, addNPC, updateNPC, deleteNPC } from '../api/npcs';
import { getQuests } from '../api/quests';
import ConfirmDialog from '../components/ConfirmDialog';
import ModalPortal from '../components/ModalPortal';

const ROLES = ['ally', 'enemy', 'neutral', 'party'];
const STATUSES = ['alive', 'dead', 'unknown'];
const RELATIONSHIPS = ['Friendly', 'Neutral', 'Hostile', 'Rival', 'Patron', 'Unknown'];
const DISPOSITIONS = ['Hostile', 'Unfriendly', 'Neutral', 'Friendly', 'Allied'];

const ROLE_COLORS = {
  ally: { bg: 'bg-emerald-600', border: 'border-emerald-400', text: 'text-emerald-400', cardBorder: 'border-emerald-500/25', cardBg: 'bg-emerald-950/10', leftBorder: 'border-l-emerald-500' },
  enemy: { bg: 'bg-red-600', border: 'border-red-400', text: 'text-red-400', cardBorder: 'border-red-500/25', cardBg: 'bg-red-950/10', leftBorder: 'border-l-red-500' },
  neutral: { bg: 'bg-amber-600', border: 'border-amber-400', text: 'text-amber-200/60', cardBorder: 'border-gold/20', cardBg: '', leftBorder: 'border-l-amber-500' },
  party: { bg: 'bg-blue-600', border: 'border-blue-400', text: 'text-blue-400', cardBorder: 'border-blue-500/25', cardBg: 'bg-blue-950/10', leftBorder: 'border-l-blue-500' },
};

const RELATIONSHIP_COLORS = {
  Friendly: { bg: 'bg-emerald-800/30', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  Neutral: { bg: 'bg-amber-800/30', text: 'text-amber-300', border: 'border-amber-500/30' },
  Hostile: { bg: 'bg-red-800/30', text: 'text-red-300', border: 'border-red-500/30' },
  Rival: { bg: 'bg-purple-800/30', text: 'text-purple-300', border: 'border-purple-500/30' },
  Patron: { bg: 'bg-blue-800/30', text: 'text-blue-300', border: 'border-blue-500/30' },
  Unknown: { bg: 'bg-gray-800/30', text: 'text-gray-300', border: 'border-gray-500/30' },
};

const DISPOSITION_COLORS = {
  Hostile: { bar: 'bg-red-500', text: 'text-red-300', width: '10%', border: 'border-l-red-500' },
  Unfriendly: { bar: 'bg-orange-500', text: 'text-orange-300', width: '30%', border: 'border-l-orange-500' },
  Neutral: { bar: 'bg-amber-500', text: 'text-amber-300', width: '50%', border: 'border-l-amber-400' },
  Friendly: { bar: 'bg-emerald-500', text: 'text-emerald-300', width: '75%', border: 'border-l-emerald-500' },
  Allied: { bar: 'bg-blue-500', text: 'text-blue-300', width: '100%', border: 'border-l-blue-500' },
};

function getInitials(name) {
  return name.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

// Pack extra NPC data into notes field as JSON
function packNpcNotes(data) {
  return JSON.stringify({
    _v: 2,
    notes_text: data.notes_text || '',
    relationship: data.relationship || 'Unknown',
    quest_hook: data.quest_hook || '',
    disposition: data.disposition || 'Neutral',
    last_seen_location: data.last_seen_location || '',
    last_encountered: data.last_encountered || '',
    faction: data.faction || '',
    pinned: data.pinned || false,
    conversation_log: data.conversation_log || [],
  });
}

function unpackNpcNotes(notesStr) {
  const defaults = { notes_text: '', relationship: 'Unknown', quest_hook: '', disposition: 'Neutral', last_seen_location: '', last_encountered: '', faction: '', pinned: false, conversation_log: [] };
  if (!notesStr) return defaults;
  try {
    const parsed = JSON.parse(notesStr);
    if (parsed._v) return { ...defaults, ...parsed };
  } catch { /* legacy plain text */ }
  return { ...defaults, notes_text: notesStr };
}

function enrichNpc(npc) {
  const extra = unpackNpcNotes(npc.notes);
  return {
    ...npc,
    notes_text: extra.notes_text || '',
    relationship: extra.relationship || 'Unknown',
    quest_hook: extra.quest_hook || '',
    disposition: extra.disposition || 'Neutral',
    last_seen_location: extra.last_seen_location || npc.location || '',
    last_encountered: extra.last_encountered || '',
    faction: extra.faction || '',
    pinned: extra.pinned || false,
    conversation_log: extra.conversation_log || [],
  };
}

function prepareNpcPayload(form) {
  const notes = packNpcNotes(form);
  return {
    name: form.name,
    role: form.role || 'neutral',
    race: form.race || '',
    npc_class: form.npc_class || '',
    location: form.location || '',
    description: form.description || '',
    notes,
    status: form.status || 'alive',
  };
}

export default function NPCs({ characterId }) {
  const [npcs, setNpcs] = useState([]);
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [groupBy, setGroupBy] = useState('none'); // none | faction | role
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());
  const [conversationNpc, setConversationNpc] = useState(null);
  const [dispositionFilter, setDispositionFilter] = useState('all');

  const load = async () => {
    try { setNpcs((await getNPCs(characterId)).map(enrichNpc)); }
    catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const loadQuests = async () => {
    try { setQuests(await getQuests(characterId)); }
    catch { /* silently ignore */ }
  };

  useEffect(() => { load(); loadQuests(); }, [characterId]);

  const getRelatedQuests = (npc) => {
    if (!npc.name || quests.length === 0) return [];
    const name = npc.name.toLowerCase();
    return quests.filter(q =>
      (q.quest_giver || '').toLowerCase().includes(name) ||
      (q.giver || '').toLowerCase().includes(name) ||
      (q.description || '').toLowerCase().includes(name)
    );
  };

  const handleSave = async (formData) => {
    try {
      // Auto-set last_encountered date when editing an existing NPC
      if (editing && !formData.last_encountered) {
        formData = { ...formData, last_encountered: new Date().toISOString().split('T')[0] };
      }
      const payload = prepareNpcPayload(formData);
      if (editing) {
        await updateNPC(characterId, editing.id, payload);
        toast.success('NPC updated');
      } else {
        await addNPC(characterId, payload);
        toast.success('NPC added');
      }
      setShowForm(false);
      setEditing(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNPC(characterId, id);
      toast.success('NPC removed');
      setConfirmDelete(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleDuplicate = async (npc) => {
    try {
      const payload = prepareNpcPayload({ ...npc, name: `${npc.name} (Copy)`, pinned: false });
      await addNPC(characterId, payload);
      toast.success('NPC duplicated');
      load();
    } catch (err) { toast.error(err.message); }
  };

  const togglePin = async (npc) => {
    const updated = { ...npc, pinned: !npc.pinned };
    try {
      await updateNPC(characterId, npc.id, prepareNpcPayload(updated));
      toast.success(updated.pinned ? 'NPC pinned' : 'NPC unpinned');
      load();
    } catch (err) { toast.error(err.message); }
  };

  const addConversationEntry = async (npc, text) => {
    const log = [...(npc.conversation_log || [])];
    log.push({ text, date: new Date().toISOString().split('T')[0], timestamp: new Date().toISOString() });
    const updated = { ...npc, conversation_log: log };
    try {
      await updateNPC(characterId, npc.id, prepareNpcPayload(updated));
      toast.success('Conversation logged');
      load();
    } catch (err) { toast.error(err.message); }
  };

  const filtered = useMemo(() => npcs.filter(n => {
    if (filter !== 'all' && n.role !== filter) return false;
    if (dispositionFilter !== 'all' && n.disposition !== dispositionFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!(n.name || '').toLowerCase().includes(q) && !(n.location || '').toLowerCase().includes(q) && !(n.description || '').toLowerCase().includes(q) && !(n.notes_text || '').toLowerCase().includes(q) && !(n.faction || '').toLowerCase().includes(q)) return false;
    }
    return true;
  }), [npcs, filter, dispositionFilter, searchQuery]);

  const roleCount = useMemo(() => {
    const counts = {};
    ROLES.forEach(r => { counts[r] = npcs.filter(n => n.role === r).length; });
    return counts;
  }, [npcs]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      // Pinned first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'role') return (a.role || '').localeCompare(b.role || '');
      if (sortBy === 'status') {
        const order = { alive: 0, unknown: 1, dead: 2 };
        return (order[a.status] ?? 9) - (order[b.status] ?? 9);
      }
      if (sortBy === 'disposition') {
        const order = { Allied: 0, Friendly: 1, Neutral: 2, Unfriendly: 3, Hostile: 4 };
        return (order[a.disposition] ?? 9) - (order[b.disposition] ?? 9);
      }
      if (sortBy === 'faction') return (a.faction || 'zzz').localeCompare(b.faction || 'zzz');
      return 0;
    });
    return list;
  }, [filtered, sortBy]);

  const grouped = useMemo(() => {
    if (groupBy === 'none') return null;
    const groups = {};
    sorted.forEach(npc => {
      const key = groupBy === 'faction' ? (npc.faction || 'Unaffiliated') : (npc.role || 'neutral');
      if (!groups[key]) groups[key] = [];
      groups[key].push(npc);
    });
    return groups;
  }, [sorted, groupBy]);

  const toggleGroup = (key) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  if (loading) return (
    <div className="space-y-4">
      <div className="skeleton-pulse" style={{ height: 32, width: '45%' }} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="skeleton-pulse" style={{ height: 120 }} />
        <div className="skeleton-pulse" style={{ height: 120 }} />
      </div>
    </div>
  );

  const NPCCard = ({ npc }) => {
    const colors = ROLE_COLORS[npc.role] || ROLE_COLORS.neutral;
    const relColors = RELATIONSHIP_COLORS[npc.relationship] || null;
    const dispColor = DISPOSITION_COLORS[npc.disposition] || DISPOSITION_COLORS.Neutral;
    return (
      <div className={`card ${colors.cardBg} border ${colors.cardBorder} border-l-3 ${dispColor.border}`}>
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className={`w-11 h-11 rounded-full ${colors.bg} border-2 ${colors.border} flex items-center justify-center flex-shrink-0 shadow-lg relative`}>
            <span className="text-white font-display text-sm font-bold">{getInitials(npc.name)}</span>
            {npc.pinned && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold flex items-center justify-center">
                <Pin size={8} className="text-[#14121c]" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-amber-100 font-medium">{npc.name}</h4>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      const nextRole = ROLES[(ROLES.indexOf(npc.role) + 1) % ROLES.length];
                      try {
                        await updateNPC(characterId, npc.id, prepareNpcPayload({ ...npc, role: nextRole }));
                        load();
                      } catch (err) { toast.error(err.message); }
                    }}
                    className={`text-xs capitalize ${colors.text} hover:underline cursor-pointer`}
                    title={`Click to cycle role (current: ${npc.role})`}
                  >{npc.role}</button>
                  <span className="text-amber-200/20">·</span>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      const nextStatus = STATUSES[(STATUSES.indexOf(npc.status) + 1) % STATUSES.length];
                      try {
                        await updateNPC(characterId, npc.id, prepareNpcPayload({ ...npc, status: nextStatus }));
                        load();
                      } catch (err) { toast.error(err.message); }
                    }}
                    className={`text-xs cursor-pointer hover:underline ${
                      npc.status === 'alive' ? 'text-emerald-400' :
                      npc.status === 'dead' ? 'text-red-400 line-through' :
                      'text-amber-200/40'
                    }`}
                    title={`Click to cycle status (current: ${npc.status})`}
                  >{npc.status}</button>
                  {relColors && (
                    <>
                      <span className="text-amber-200/20">·</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${relColors.bg} ${relColors.text} ${relColors.border}`}>
                        {npc.relationship}
                      </span>
                    </>
                  )}
                  {npc.faction && (
                    <>
                      <span className="text-amber-200/20">·</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-800/20 text-purple-300/70 border border-purple-500/20">
                        {npc.faction}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => togglePin(npc)} className={`${npc.pinned ? 'text-gold' : 'text-amber-200/40 hover:text-amber-200'}`} title={npc.pinned ? 'Unpin' : 'Pin NPC'}>
                  <Pin size={14} className={npc.pinned ? 'fill-gold' : ''} />
                </button>
                <button onClick={() => setConversationNpc(npc)} className="text-amber-200/40 hover:text-amber-200" title="Log conversation">
                  <MessageSquare size={14} />
                </button>
                <button onClick={() => handleDuplicate(npc)} className="text-amber-200/40 hover:text-amber-200" title="Duplicate"><Copy size={14} /></button>
                <button onClick={() => { setEditing(npc); setShowForm(true); }} className="text-amber-200/40 hover:text-amber-200"><Edit2 size={14} /></button>
                <button onClick={() => setConfirmDelete(npc)} className="text-red-400/50 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>

            {/* Disposition bar — clickable to cycle */}
            <button
              onClick={async (e) => {
                e.stopPropagation();
                const nextDisp = DISPOSITIONS[(DISPOSITIONS.indexOf(npc.disposition) + 1) % DISPOSITIONS.length];
                try {
                  await updateNPC(characterId, npc.id, prepareNpcPayload({ ...npc, disposition: nextDisp }));
                  load();
                } catch (err) { toast.error(err.message); }
              }}
              className="mt-1.5 flex items-center gap-2 w-full cursor-pointer group/disp"
              title={`Click to cycle disposition (current: ${npc.disposition})`}
            >
              <Shield size={10} className={`${dispColor.text} group-hover/disp:scale-110 transition-transform`} />
              <div className="flex-1 h-1.5 bg-amber-200/5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${dispColor.bar} transition-all`} style={{ width: dispColor.width }} />
              </div>
              <span className={`text-[10px] ${dispColor.text} group-hover/disp:underline`}>{npc.disposition}</span>
            </button>

            {npc.race && <p className="text-xs text-amber-200/40 mt-1">{[npc.race, npc.npc_class].filter(Boolean).join(' · ')}</p>}

            {/* Location tracking */}
            {(npc.last_seen_location || npc.location) && (
              <div className="flex items-center gap-1 text-xs text-amber-200/40 mt-0.5">
                <MapPin size={11} className="flex-shrink-0" />
                <span>{npc.last_seen_location || npc.location}</span>
                {npc.last_encountered && (
                  <>
                    <span className="text-amber-200/20 mx-1">·</span>
                    <Clock size={10} className="flex-shrink-0 text-amber-200/25" />
                    <span className="text-amber-200/25">Last seen: {npc.last_encountered}</span>
                  </>
                )}
              </div>
            )}

            {npc.description && <p className="text-sm text-amber-200/50 mt-2">{npc.description}</p>}
            {npc.quest_hook && (
              <div className="mt-2 flex items-start gap-1.5 bg-amber-800/10 border border-amber-500/15 rounded px-2 py-1.5">
                <ScrollText size={13} className="text-amber-400/60 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300/60">{npc.quest_hook}</p>
              </div>
            )}

            {/* Conversation log (last 3) */}
            {(npc.conversation_log || []).length > 0 && (
              <div className="mt-2 pt-2 border-t border-amber-200/5">
                <span className="text-[10px] text-amber-200/25 uppercase tracking-wider">Recent Conversations</span>
                <div className="space-y-1 mt-1">
                  {npc.conversation_log.slice(-3).map((entry, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className="text-amber-200/25 shrink-0 font-mono">{entry.date}</span>
                      <span className="text-amber-200/40">{entry.text}</span>
                    </div>
                  ))}
                  {npc.conversation_log.length > 3 && (
                    <span className="text-[10px] text-amber-200/20">+{npc.conversation_log.length - 3} more</span>
                  )}
                </div>
              </div>
            )}

            {npc.notes_text && (
              <div className="mt-1 text-xs text-amber-200/40 [&_.wmde-markdown]:!bg-transparent [&_.wmde-markdown]:!text-amber-200/40 [&_.wmde-markdown]:!font-sans [&_.wmde-markdown]:!text-xs" data-color-mode="dark">
                <MDEditor.Markdown source={npc.notes_text} />
              </div>
            )}
            {(() => {
              const related = getRelatedQuests(npc);
              if (related.length === 0) return null;
              return (
                <div className="mt-2 pt-2 border-t border-amber-200/5">
                  <span className="text-[10px] text-amber-200/25 uppercase tracking-wider">Related Quests</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {related.map(q => (
                      <span key={q.id} className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-800/25 text-emerald-300/80 border border-emerald-500/20">
                        {q.title || 'Untitled Quest'}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    );
  };

  const renderNPCList = (npcList) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {npcList.map(npc => <NPCCard key={npc.id} npc={npc} />)}
    </div>
  );

  return (
    <div className="space-y-6 max-w-none">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display text-amber-100 flex items-center gap-2">
          <Users size={20} />
          <div>
            <span>NPCs & Characters</span>
            <p className="text-xs text-amber-200/40 font-normal mt-0.5">Track the people your character meets. Record allies, enemies, factions, and conversation history so you never forget a name or promise.</p>
          </div>
        </h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary text-xs flex items-center gap-1">
          <Plus size={12} /> Add NPC
        </button>
      </div>

      {npcs.length > 0 && (
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-200/30 pointer-events-none" />
          <input className="input w-full pl-10" placeholder="Search NPCs by name, location, faction, or description..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      )}

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex gap-2">
          {['all', ...ROLES].map(r => (
            <button key={r} onClick={() => setFilter(r)}
              className={`text-xs px-3 py-1 rounded capitalize flex items-center gap-1.5 ${filter === r ? 'bg-gold/20 text-gold border border-gold/30' : 'text-amber-200/40 border border-amber-200/10'}`}>
              {r}
              {r !== 'all' && roleCount[r] > 0 && (
                <span className="text-[10px] bg-white/10 px-1.5 py-0 rounded-full">{roleCount[r]}</span>
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-xs text-amber-200/40">Group:</span>
          {[['none', 'None'], ['faction', 'Faction'], ['role', 'Role']].map(([key, label]) => (
            <button key={key} onClick={() => setGroupBy(key)}
              className={`text-xs px-2.5 py-1 rounded ${groupBy === key ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-amber-200/5 text-amber-200/40 border border-amber-200/10'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-amber-200/40">Disposition:</span>
        {['all', ...DISPOSITIONS].map(d => {
          const dColor = d !== 'all' ? DISPOSITION_COLORS[d] : null;
          const count = d !== 'all' ? npcs.filter(n => n.disposition === d).length : 0;
          return (
            <button key={d} onClick={() => setDispositionFilter(d)}
              className={`text-xs px-2.5 py-1 rounded capitalize flex items-center gap-1.5 ${dispositionFilter === d ? 'bg-gold/20 text-gold border border-gold/30' : `bg-amber-200/5 border border-amber-200/10 ${dColor ? dColor.text : 'text-amber-200/40'}`}`}>
              {d}
              {d !== 'all' && count > 0 && (
                <span className="text-[10px] bg-white/10 px-1.5 py-0 rounded-full">{count}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-xs text-amber-200/40">Sort:</span>
        {[['name', 'Name A-Z'], ['role', 'Role'], ['status', 'Status'], ['disposition', 'Disposition'], ['faction', 'Faction']].map(([key, label]) => (
          <button key={key} onClick={() => setSortBy(key)}
            className={`text-xs px-2.5 py-1 rounded ${sortBy === key ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-amber-200/5 text-amber-200/40 border border-amber-200/10'}`}>
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card border-dashed border-amber-200/10 text-center py-12">
          <Users size={32} className="mx-auto text-amber-200/15 mb-3" />
          <p className="text-sm text-amber-200/30 mb-1">No NPCs tracked yet — add the characters you meet</p>
          <p className="text-xs text-amber-200/20">Record allies, enemies, shopkeepers, quest givers, and everyone in between</p>
        </div>
      ) : grouped ? (
        <div className="space-y-4">
          {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([group, groupNpcs]) => {
            // Compute faction party standing from average disposition
            let standing = null;
            if (groupBy === 'faction' && group !== 'Unaffiliated') {
              const dispOrder = { Hostile: 0, Unfriendly: 1, Neutral: 2, Friendly: 3, Allied: 4 };
              const avg = groupNpcs.reduce((sum, n) => sum + (dispOrder[n.disposition] ?? 2), 0) / groupNpcs.length;
              const standingLabel = avg <= 0.5 ? 'Hostile' : avg <= 1.5 ? 'Unfriendly' : avg <= 2.5 ? 'Neutral' : avg <= 3.5 ? 'Friendly' : 'Allied';
              const sColor = DISPOSITION_COLORS[standingLabel];
              standing = { label: standingLabel, color: sColor };
            }
            return (
              <div key={group}>
                <button onClick={() => toggleGroup(group)} className="flex items-center gap-2 mb-2 w-full text-left group">
                  {collapsedGroups.has(group) ? <ChevronRight size={14} className="text-amber-200/30" /> : <ChevronDown size={14} className="text-amber-200/30" />}
                  <h3 className="font-display text-amber-100/60 capitalize">{group}</h3>
                  <span className="text-xs text-amber-200/30">({groupNpcs.length} {groupNpcs.length === 1 ? 'member' : 'members'})</span>
                  {standing && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${standing.color.text} bg-white/5 border border-white/5 ml-1`}>
                      Standing: {standing.label}
                    </span>
                  )}
                </button>
                {!collapsedGroups.has(group) && renderNPCList(groupNpcs)}
              </div>
            );
          })}
        </div>
      ) : (
        renderNPCList(sorted)
      )}

      {showForm && (
        <NPCForm npc={editing} onSubmit={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />
      )}

      {/* Conversation log modal */}
      {conversationNpc && (
        <ConversationModal npc={conversationNpc} onSubmit={(text) => { addConversationEntry(conversationNpc, text); setConversationNpc(null); }} onCancel={() => setConversationNpc(null)} />
      )}

      <ConfirmDialog
        show={!!confirmDelete}
        title="Delete NPC?"
        message={`Remove "${confirmDelete?.name}"? This cannot be undone.`}
        onConfirm={() => handleDelete(confirmDelete.id)}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}

function ConversationModal({ npc, onSubmit, onCancel }) {
  const [text, setText] = useState('');
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <ModalPortal>
      <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="bg-[#14121c] border border-gold/30 rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <h3 className="font-display text-lg text-amber-100 mb-2">Log Conversation</h3>
        <p className="text-xs text-amber-200/40 mb-3">with {npc.name} — {new Date().toISOString().split('T')[0]}</p>

        {/* Show existing log */}
        {(npc.conversation_log || []).length > 0 && (
          <div className="mb-3 max-h-40 overflow-y-auto space-y-1">
            {npc.conversation_log.map((entry, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className="text-amber-200/25 shrink-0 font-mono">{entry.date}</span>
                <span className="text-amber-200/40">{entry.text}</span>
              </div>
            ))}
          </div>
        )}

        <textarea className="input w-full h-20 resize-none" placeholder="Key conversation points, promises made, info learned..." value={text} onChange={e => setText(e.target.value)} autoFocus
          onKeyDown={e => { if (e.ctrlKey && e.key === 'Enter' && text.trim()) { e.preventDefault(); onSubmit(text.trim()); } }} />
        <div className="flex gap-3 justify-end mt-4">
          <span className="text-xs text-amber-200/30 self-center mr-auto">Ctrl+Enter to save</span>
          <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
          <button onClick={() => text.trim() && onSubmit(text.trim())} className="btn-primary text-sm" disabled={!text.trim()}>Log</button>
        </div>
      </div>
      </div>
    </ModalPortal>
  );
}

function NPCForm({ npc, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => {
    if (npc) return { ...npc };
    return {
      name: '', role: 'neutral', race: '', npc_class: '', location: '', description: '',
      notes_text: '', status: 'alive', relationship: 'Unknown', quest_hook: '',
      disposition: 'Neutral', last_seen_location: '', last_encountered: '',
      faction: '', pinned: false, conversation_log: [],
    };
  });
  const [nameError, setNameError] = useState(false);
  const update = (f, v) => {
    if (f === 'name') setNameError(false);
    setForm(prev => ({ ...prev, [f]: v }));
  };
  const handleSubmit = () => {
    if (!form.name.trim()) { setNameError(true); return; }
    onSubmit(form);
  };

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <ModalPortal>
      <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="bg-[#14121c] border border-gold/30 rounded-lg p-5 w-full mx-4" style={{ maxWidth: '720px' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg text-amber-100">{npc ? 'Edit NPC' : 'Add NPC'}</h3>
          <div className="flex gap-2">
            <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
            <button onClick={handleSubmit} className="btn-primary text-sm">{npc ? 'Save' : 'Add'}</button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-3">
            <input className={`input w-full ${nameError ? 'border-red-500' : ''}`} placeholder="NPC Name (e.g. Elara Brightheart)" value={form.name} onChange={e => update('name', e.target.value)} autoFocus />
            {nameError && <p className="text-red-400 text-xs mt-0.5">Name required</p>}
          </div>
          <select className="input w-full" value={form.role} onChange={e => update('role', e.target.value)}>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select className="input w-full" value={form.status} onChange={e => update('status', e.target.value)}>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="input w-full" value={form.disposition || 'Neutral'} onChange={e => update('disposition', e.target.value)}>
            {DISPOSITIONS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <input className="input w-full" placeholder="Race" value={form.race} onChange={e => update('race', e.target.value)} />
          <input className="input w-full" placeholder="Class" value={form.npc_class} onChange={e => update('npc_class', e.target.value)} />
          <select className="input w-full" value={form.relationship || 'Unknown'} onChange={e => update('relationship', e.target.value)}>
            {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <div className="col-span-3">
            <input className="input w-full" placeholder="Faction / Organization" value={form.faction || ''} onChange={e => update('faction', e.target.value)} />
          </div>
          <input className="input w-full" placeholder="Current location" value={form.location} onChange={e => update('location', e.target.value)} />
          <input className="input w-full" placeholder="Last seen location" value={form.last_seen_location || ''} onChange={e => update('last_seen_location', e.target.value)} />
          <div>
            <input type="date" className="input w-full" value={form.last_encountered || ''} onChange={e => update('last_encountered', e.target.value)} title="Last encountered" />
          </div>
          <div className="col-span-2">
            <textarea className="input w-full h-16 resize-none" placeholder="Description" value={form.description} onChange={e => update('description', e.target.value)} />
          </div>
          <div>
            <textarea className="input w-full h-16 resize-none" placeholder="Quest hook" value={form.quest_hook || ''} onChange={e => update('quest_hook', e.target.value)} />
          </div>
          <div className="col-span-3" data-color-mode="dark">
            <MDEditor value={form.notes_text} onChange={v => update('notes_text', v || '')} height={90} preview="edit" />
          </div>
        </div>
      </div>
      </div>
    </ModalPortal>
  );
}
