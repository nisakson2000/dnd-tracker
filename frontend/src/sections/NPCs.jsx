import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Plus, Trash2, Edit2, Users, Search, Copy, ScrollText, Pin, ChevronDown, ChevronRight, MapPin, Clock, MessageSquare, Shield, MessageCircle, Send, Bot, User, X, Loader2, Shuffle, Brain, Swords, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import MDEditor from '@uiw/react-md-editor';
import { getNPCs, addNPC, updateNPC, deleteNPC } from '../api/npcs';
import { getQuests } from '../api/quests';
import { checkOllamaStatus, streamChat } from '../api/assistant';
import ConfirmDialog from '../components/ConfirmDialog';
import ModalPortal from '../components/ModalPortal';
import { useAppMode } from '../contexts/ModeContext';

const ROLES = ['ally', 'enemy', 'neutral', 'party'];
const STATUSES = ['alive', 'dead', 'unknown'];
const RELATIONSHIPS = ['Friendly', 'Neutral', 'Hostile', 'Rival', 'Patron', 'Unknown'];
const DISPOSITIONS = ['Hostile', 'Unfriendly', 'Neutral', 'Friendly', 'Allied'];

const NPC_NAME_SUGGESTIONS = [
  'Alaric', 'Brenna', 'Cedric', 'Delara', 'Eldrin', 'Fiona', 'Gareth', 'Helena',
  'Idris', 'Jasira', 'Kael', 'Lyra', 'Magnus', 'Nessa', 'Orin', 'Petra',
  'Quillon', 'Rhiannon', 'Silas', 'Thalia', 'Ulric', 'Vesper', 'Wren', 'Xara', 'Yoren', 'Zara',
];
const NPC_RACES = ['Human', 'Elf', 'Dwarf', 'Halfling', 'Gnome', 'Half-Elf', 'Half-Orc', 'Tiefling', 'Dragonborn', 'Goliath', 'Aasimar', 'Tabaxi', 'Kenku', 'Firbolg', 'Goblin', 'Orc'];
const NPC_CLASSES = ['Commoner', 'Noble', 'Guard', 'Soldier', 'Merchant', 'Priest', 'Mage', 'Rogue', 'Bard', 'Ranger', 'Knight', 'Assassin', 'Druid', 'Warlock', 'Artificer', 'Scholar', 'Blacksmith', 'Innkeeper', 'Sailor', 'Farmer'];
const NPC_TEMPLATES = [
  { label: 'Tavern Keeper', name: '', role: 'neutral', race: 'Human', npc_class: 'Innkeeper', disposition: 'Friendly', description: 'A warm and welcoming tavern owner who hears all the local gossip.' },
  { label: 'Mysterious Stranger', name: '', role: 'neutral', race: 'Half-Elf', npc_class: 'Rogue', disposition: 'Neutral', description: 'A hooded figure who seems to know more than they let on.' },
  { label: 'Quest Giver', name: '', role: 'ally', race: 'Human', npc_class: 'Noble', disposition: 'Friendly', description: 'A person of influence who needs capable adventurers for an important task.' },
  { label: 'Rival Adventurer', name: '', role: 'enemy', race: 'Human', npc_class: 'Fighter', disposition: 'Unfriendly', description: 'A competitive adventurer who always seems to be after the same prize.' },
  { label: 'Wise Sage', name: '', role: 'ally', race: 'Elf', npc_class: 'Scholar', disposition: 'Friendly', description: 'An ancient scholar with vast knowledge of history and arcane lore.' },
  { label: 'Shady Merchant', name: '', role: 'neutral', race: 'Halfling', npc_class: 'Merchant', disposition: 'Neutral', description: 'A trader who deals in rare and questionable goods, no questions asked.' },
];

// ── Quick NPC Generator tables ──
const RANDOM_NPC_NAMES = {
  human: ['Aldric', 'Brenna', 'Cedric', 'Dahlia', 'Edmund', 'Fiona', 'Gareth', 'Helena', 'Ivar', 'Juliana', 'Kael', 'Lyra', 'Marcus', 'Nadia', 'Osric', 'Petra', 'Quinn', 'Rowena', 'Silas', 'Thea'],
  elf: ['Aelindra', 'Caelum', 'Elowen', 'Faelan', 'Galathil', 'Ithilwen', 'Lirael', 'Maelis', 'Nimue', 'Thalion', 'Varis', 'Yavanna'],
  dwarf: ['Balin', 'Dagny', 'Flint', 'Greta', 'Haldor', 'Ingrid', 'Korgrim', 'Marda', 'Nori', 'Thorin', 'Ulfgar', 'Willa'],
  halfling: ['Bramble', 'Corrin', 'Daisy', 'Eldon', 'Fern', 'Garret', 'Hilda', 'Jillian', 'Lavinia', 'Milo', 'Pip', 'Rosie'],
  tiefling: ['Amnon', 'Bryseis', 'Criella', 'Damakos', 'Euphemia', 'Kairon', 'Lerissa', 'Mordai', 'Nemeia', 'Orianna', 'Rieta', 'Zariel'],
};
const RANDOM_NPC_RACES = ['Human', 'Elf', 'Dwarf', 'Halfling', 'Tiefling', 'Half-Orc', 'Gnome', 'Dragonborn'];
const RANDOM_NPC_OCCUPATIONS = ['Blacksmith', 'Innkeeper', 'Merchant', 'Guard', 'Scholar', 'Farmer', 'Sailor', 'Thief', 'Priest', 'Noble', 'Bard', 'Hunter', 'Healer', 'Alchemist', 'Scribe', 'Cook', 'Stable Hand', 'Messenger', 'Beggar', 'Retired Adventurer'];
const RANDOM_NPC_TRAITS = ['Nervous laughter', 'Speaks in riddles', 'Overly friendly', 'Deeply suspicious', 'Tells tall tales', 'Whispers everything', 'Dramatic hand gestures', 'Never makes eye contact', 'Hums constantly', 'Obsessed with cats', 'Forgetful', 'Extremely literal', 'Always eating', 'Quotes old proverbs', 'Paranoid about magic'];
const RANDOM_NPC_VOICE_TAGS = ['Gruff and low', 'High-pitched and fast', 'Slow and deliberate', 'Thick accent', 'Wheezy', 'Booming', 'Soft-spoken', 'Singsong', 'Raspy', 'Stuttering', 'Formal', 'Slang-heavy'];

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generateRandomNpc() {
  const race = pickRandom(RANDOM_NPC_RACES);
  const raceKey = race.toLowerCase().replace('-', '');
  const namePool = RANDOM_NPC_NAMES[raceKey] || RANDOM_NPC_NAMES.human;
  const name = pickRandom(namePool);
  const occupation = pickRandom(RANDOM_NPC_OCCUPATIONS);
  const trait = pickRandom(RANDOM_NPC_TRAITS);
  const voice = pickRandom(RANDOM_NPC_VOICE_TAGS);

  return {
    name,
    role: 'neutral',
    race,
    npc_class: occupation,
    location: '',
    description: `${trait}. Voice: ${voice}.`,
    notes_text: `**Personality:** ${trait}\n**Voice/Accent:** ${voice}\n**Occupation:** ${occupation}`,
    status: 'alive',
    relationship: 'Unknown',
    quest_hook: '',
    disposition: 'Neutral',
    last_seen_location: '',
    last_encountered: new Date().toISOString().split('T')[0],
    faction: '',
    pinned: false,
    conversation_log: [],
  };
}

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
    _v: 3,
    notes_text: data.notes_text || '',
    relationship: data.relationship || 'Unknown',
    quest_hook: data.quest_hook || '',
    disposition: data.disposition || 'Neutral',
    last_seen_location: data.last_seen_location || '',
    last_encountered: data.last_encountered || '',
    faction: data.faction || '',
    pinned: data.pinned || false,
    conversation_log: data.conversation_log || [],
    // Phase 6: NPC Intelligence
    personality_archetype: data.personality_archetype || '',
    personality_traits: data.personality_traits || [],
    motivations: data.motivations || [],
    intelligence: data.intelligence ?? 10,
    fear_courage: data.fear_courage ?? 50,
    trust_score: data.trust_score ?? 0,
    combat_style: data.combat_style || '',
    merchant_location_type: data.merchant_location_type || 'town',
  });
}

function unpackNpcNotes(notesStr) {
  const defaults = {
    notes_text: '', relationship: 'Unknown', quest_hook: '', disposition: 'Neutral',
    last_seen_location: '', last_encountered: '', faction: '', pinned: false, conversation_log: [],
    personality_archetype: '', personality_traits: [], motivations: [], intelligence: 10,
    fear_courage: 50, trust_score: 0, combat_style: '', merchant_location_type: 'town',
  };
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
    personality_archetype: extra.personality_archetype || '',
    personality_traits: extra.personality_traits || [],
    motivations: extra.motivations || [],
    intelligence: extra.intelligence ?? 10,
    fear_courage: extra.fear_courage ?? 50,
    trust_score: extra.trust_score ?? 0,
    combat_style: extra.combat_style || '',
    merchant_location_type: extra.merchant_location_type || 'town',
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
  const { mode: appMode } = useAppMode();
  const isDM = appMode === 'dm';
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
  const [aiChatNpc, setAiChatNpc] = useState(null);
  const [dispositionFilter, setDispositionFilter] = useState('all');
  const [quickGenData, setQuickGenData] = useState(null);

  const load = useCallback(async () => {
    try { setNpcs((await getNPCs(characterId)).map(enrichNpc)); }
    catch (err) { toast.error(err.message); if (import.meta.env.DEV) console.warn('NPCs load:', err); }
    finally { setLoading(false); }
  }, [characterId]);

  const loadQuests = useCallback(async () => {
    try { setQuests(await getQuests(characterId)); }
    catch (err) { if (import.meta.env.DEV) console.warn('NPCs loadQuests:', err); }
  }, [characterId]);

  useEffect(() => { load(); loadQuests(); }, [load, loadQuests]);

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

  const handleOpenAiChat = async (npc) => {
    try {
      const status = await checkOllamaStatus();
      if (!status.available) {
        toast.error('Ollama is not running. Please start Ollama to talk to NPCs.');
        return;
      }
      if (!status.modelInstalled) {
        toast.error(`AI model "${status.model}" is not installed. Open Arcane Advisor to set it up.`);
        return;
      }
      setAiChatNpc(npc);
    } catch (err) {
      toast.error('Could not connect to Ollama: ' + (err.message || String(err)));
    }
  };

  const saveAiConversation = async (npc, userMsg, npcResponse) => {
    const log = [...(npc.conversation_log || [])];
    log.push({
      text: `[AI Chat] You: "${userMsg}" — ${npc.name}: "${npcResponse.length > 200 ? npcResponse.slice(0, 200) + '...' : npcResponse}"`,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
    });
    const updated = { ...npc, conversation_log: log };
    try {
      await updateNPC(characterId, npc.id, prepareNpcPayload(updated));
      setAiChatNpc(prev => prev && prev.id === npc.id ? { ...prev, conversation_log: log } : prev);
      load();
    } catch (err) {
      toast.error('Failed to save conversation: ' + err.message);
    }
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
                <button onClick={() => handleOpenAiChat(npc)} className="text-purple-400/50 hover:text-purple-300" title="Talk to NPC (AI)">
                  <MessageCircle size={14} />
                </button>
                {isDM && <button onClick={() => handleDuplicate(npc)} className="text-amber-200/40 hover:text-amber-200" title="Duplicate"><Copy size={14} /></button>}
                {isDM && <button onClick={() => { setEditing(npc); setQuickGenData(null); setShowForm(true); }} className="text-amber-200/40 hover:text-amber-200"><Edit2 size={14} /></button>}
                {isDM && <button onClick={() => setConfirmDelete(npc)} className="text-red-400/50 hover:text-red-400"><Trash2 size={14} /></button>}
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
        {isDM && (
          <div className="flex items-center gap-2">
            <button onClick={() => { setEditing(null); setQuickGenData(generateRandomNpc()); setShowForm(true); }}
              className="text-xs flex items-center gap-1"
              style={{
                padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 500,
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.12))',
                color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.25)',
              }}
              title="Generate a random NPC with name, race, trait, occupation, and voice tag">
              <Shuffle size={12} /> Quick Generate
            </button>
            <button onClick={() => { setEditing(null); setQuickGenData(null); setShowForm(true); }} className="btn-primary text-xs flex items-center gap-1">
              <Plus size={12} /> Add NPC
            </button>
          </div>
        )}
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
        <NPCForm npc={editing} initialData={quickGenData} onSubmit={handleSave} onCancel={() => { setShowForm(false); setEditing(null); setQuickGenData(null); }} />
      )}

      {/* Conversation log modal */}
      {conversationNpc && (
        <ConversationModal npc={conversationNpc} onSubmit={(text) => { addConversationEntry(conversationNpc, text); setConversationNpc(null); }} onCancel={() => setConversationNpc(null)} />
      )}

      {/* AI NPC Chat modal */}
      <AnimatePresence>
        {aiChatNpc && (
          <AIChatModal
            npc={aiChatNpc}
            onSaveExchange={saveAiConversation}
            onClose={() => setAiChatNpc(null)}
          />
        )}
      </AnimatePresence>

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

function buildNpcSystemPrompt(npc) {
  const race = npc.race || 'unknown race';
  const classProfession = npc.npc_class || 'unknown profession';
  const role = npc.role || 'neutral figure';
  const description = npc.description || 'No description available.';
  const notesText = npc.notes_text || '';
  const relationship = npc.relationship || 'Unknown';
  const disposition = npc.disposition || 'Neutral';
  const location = npc.last_seen_location || npc.location || 'unknown location';
  const faction = npc.faction || 'none';
  const questHook = npc.quest_hook || '';
  const status = npc.status || 'alive';

  let prompt = `You are roleplaying as ${npc.name}, a ${race} ${classProfession} who is a ${role}.
Personality: ${description}${notesText ? '\nAdditional details: ' + notesText : ''}
Current disposition toward the party: ${relationship} (${disposition})
Location: ${location}
Faction: ${faction}
Status: ${status}`;

  if (questHook) {
    prompt += `\n\n[DM CONTEXT - use this to inform your responses but do NOT reveal these secrets directly]: ${questHook}`;
  }

  prompt += `\n\nStay in character at all times. Respond as ${npc.name} would based on their personality and relationship with the party. Keep responses concise (2-4 sentences). Use appropriate speech patterns for a ${race} ${classProfession}. Do not break character or mention that you are an AI.`;

  return prompt;
}

function AIChatModal({ npc, onSaveExchange, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(false);

  // Load previous conversation context from conversation_log
  const previousContext = useMemo(() => {
    const log = npc.conversation_log || [];
    if (log.length === 0) return '';
    const recent = log.slice(-5);
    return '\n\n[Previous conversation context with the party]:\n' +
      recent.map(e => `- ${e.date}: ${e.text}`).join('\n');
  }, [npc.conversation_log]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, streamingText, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
    const handler = (e) => { if (e.key === 'Escape' && !streaming) onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, streaming]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || streaming) return;

    const userMessage = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setStreaming(true);
    setStreamingText('');
    abortRef.current = false;

    const systemPrompt = buildNpcSystemPrompt(npc) + previousContext;
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...newMessages.map(m => ({ role: m.role, content: m.content })),
    ];

    let fullResponse = '';
    try {
      for await (const chunk of streamChat(apiMessages)) {
        if (abortRef.current) break;
        fullResponse += chunk;
        setStreamingText(fullResponse);
      }

      if (!abortRef.current && fullResponse) {
        const assistantMessage = { role: 'assistant', content: fullResponse };
        setMessages(prev => [...prev, assistantMessage]);
        setStreamingText('');
        // Auto-save this exchange
        onSaveExchange(npc, text, fullResponse);
      }
    } catch (err) {
      toast.error('AI response failed: ' + (err.message || String(err)));
    } finally {
      setStreaming(false);
      setStreamingText('');
    }
  };

  return (
    <ModalPortal>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={e => { if (e.target === e.currentTarget && !streaming) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, x: 60, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 60, scale: 0.97 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{
            background: '#14121c',
            border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: 12,
            width: '100%',
            maxWidth: 520,
            height: '80vh',
            maxHeight: 700,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            margin: '0 16px',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(212,175,55,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexShrink: 0,
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(155,89,182,0.25)',
              border: '2px solid rgba(155,89,182,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ color: '#d4af37', fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700 }}>
                {getInitials(npc.name)}
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', color: '#fef3c7', fontSize: 16, margin: 0 }}>
                {npc.name}
              </h3>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'rgba(253,230,138,0.4)', margin: 0 }}>
                {[npc.race, npc.npc_class, npc.disposition].filter(Boolean).join(' \u00b7 ')}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Bot size={14} style={{ color: 'rgba(155,89,182,0.6)' }} />
              <span style={{ fontSize: 10, color: 'rgba(155,89,182,0.6)', fontFamily: 'var(--font-ui)' }}>AI Chat</span>
            </div>
            <button
              onClick={() => { if (!streaming) { abortRef.current = true; onClose(); } }}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(253,230,138,0.4)',
                cursor: streaming ? 'not-allowed' : 'pointer',
                padding: 4,
                display: 'flex',
              }}
              title="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            {/* Previous conversation context hint */}
            {(npc.conversation_log || []).length > 0 && messages.length === 0 && !streaming && (
              <div style={{
                textAlign: 'center',
                padding: '8px 12px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <span style={{ fontSize: 11, color: 'rgba(253,230,138,0.25)', fontFamily: 'var(--font-ui)' }}>
                  {npc.name} remembers {npc.conversation_log.length} previous conversation{npc.conversation_log.length !== 1 ? 's' : ''} with you
                </span>
              </div>
            )}

            {/* Welcome message */}
            {messages.length === 0 && !streaming && (
              <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                <MessageCircle size={32} style={{ color: 'rgba(155,89,182,0.2)', margin: '0 auto 12px' }} />
                <p style={{ fontSize: 13, color: 'rgba(253,230,138,0.3)', fontFamily: 'var(--font-ui)', margin: 0 }}>
                  Start a conversation with {npc.name}
                </p>
                <p style={{ fontSize: 11, color: 'rgba(253,230,138,0.15)', fontFamily: 'var(--font-ui)', marginTop: 4 }}>
                  The AI will stay in character based on this NPC's personality and relationship
                </p>
              </div>
            )}

            {/* Chat messages */}
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  gap: 8,
                }}
              >
                {msg.role === 'assistant' && (
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'rgba(155,89,182,0.2)',
                    border: '1px solid rgba(155,89,182,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 2,
                  }}>
                    <Bot size={14} style={{ color: 'rgba(155,89,182,0.7)' }} />
                  </div>
                )}
                <div style={{
                  maxWidth: '75%',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: msg.role === 'user' ? 'rgba(155,89,182,0.15)' : 'rgba(255,255,255,0.04)',
                  border: msg.role === 'user' ? '1px solid rgba(155,89,182,0.25)' : '1px solid rgba(255,255,255,0.06)',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 13,
                    color: msg.role === 'user' ? 'rgba(253,230,138,0.8)' : 'rgba(253,230,138,0.65)',
                    margin: 0,
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                  }}>{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'rgba(155,89,182,0.15)',
                    border: '1px solid rgba(155,89,182,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 2,
                  }}>
                    <User size={14} style={{ color: 'rgba(253,230,138,0.5)' }} />
                  </div>
                )}
              </motion.div>
            ))}

            {/* Streaming response */}
            {streaming && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', justifyContent: 'flex-start', gap: 8 }}
              >
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'rgba(155,89,182,0.2)',
                  border: '1px solid rgba(155,89,182,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 2,
                }}>
                  <Bot size={14} style={{ color: 'rgba(155,89,182,0.7)' }} />
                </div>
                <div style={{
                  maxWidth: '75%',
                  padding: '10px 14px',
                  borderRadius: '14px 14px 14px 4px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 13,
                    color: 'rgba(253,230,138,0.65)',
                    margin: 0,
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                  }}>
                    {streamingText || '\u00a0'}
                    <span style={{
                      display: 'inline-block',
                      width: 2,
                      height: 14,
                      background: 'rgba(155,89,182,0.7)',
                      marginLeft: 2,
                      verticalAlign: 'text-bottom',
                      animation: 'npcCursorBlink 0.8s step-end infinite',
                    }} />
                  </p>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div style={{
            padding: '12px 20px 16px',
            borderTop: '1px solid rgba(212,175,55,0.1)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={`Say something to ${npc.name}...`}
                disabled={streaming}
                rows={1}
                style={{
                  flex: 1,
                  fontFamily: 'var(--font-ui)',
                  fontSize: 13,
                  color: '#fef3c7',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(212,175,55,0.15)',
                  borderRadius: 10,
                  padding: '10px 14px',
                  resize: 'none',
                  outline: 'none',
                  minHeight: 40,
                  maxHeight: 100,
                  lineHeight: 1.4,
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || streaming}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: input.trim() && !streaming ? 'rgba(155,89,182,0.3)' : 'rgba(255,255,255,0.04)',
                  border: input.trim() && !streaming ? '1px solid rgba(155,89,182,0.4)' : '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: input.trim() && !streaming ? 'pointer' : 'not-allowed',
                  flexShrink: 0,
                  transition: 'all 0.15s',
                }}
                title="Send message"
              >
                {streaming ? (
                  <Loader2 size={16} style={{ color: 'rgba(155,89,182,0.5)', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Send size={16} style={{ color: input.trim() ? 'rgba(155,89,182,0.8)' : 'rgba(253,230,138,0.2)' }} />
                )}
              </button>
            </div>
            <p style={{ fontSize: 10, color: 'rgba(253,230,138,0.15)', fontFamily: 'var(--font-ui)', marginTop: 6, textAlign: 'center' }}>
              Enter to send \u00b7 Shift+Enter for new line \u00b7 Powered by Arcane Advisor (Ollama)
            </p>
          </div>
        </motion.div>

        {/* Cursor blink animation */}
        <style>{`
          @keyframes npcCursorBlink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>
      </motion.div>
    </ModalPortal>
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

// ── Personality archetypes for the behavior engine ──
const ARCHETYPES = [
  { id: '', label: 'None (Custom)' },
  { id: 'schemer', label: 'The Schemer', traits: ['cunning', 'ambitious', 'deceptive', 'patient'], color: '#8b5cf6', desc: 'Manipulative and calculating — always has a hidden agenda.' },
  { id: 'guardian', label: 'The Guardian', traits: ['loyal', 'brave', 'protective', 'honorable'], color: '#3b82f6', desc: 'Steadfast defender — honor above all.' },
  { id: 'merchant', label: 'The Merchant', traits: ['greedy', 'practical', 'risk-averse', 'shrewd'], color: '#f59e0b', desc: 'Profit-driven and pragmatic — everything has a price.' },
  { id: 'zealot', label: 'The Zealot', traits: ['devoted', 'unyielding', 'charismatic', 'extreme'], color: '#ef4444', desc: 'Unshakeable conviction — will sacrifice anything.' },
  { id: 'outcast', label: 'The Outcast', traits: ['suspicious', 'independent', 'resourceful', 'bitter'], color: '#6b7280', desc: 'Mistrustful of others — self-reliance only.' },
  { id: 'sage', label: 'The Sage', traits: ['wise', 'curious', 'patient', 'detached'], color: '#06b6d4', desc: 'Seeks truth above all.' },
  { id: 'trickster', label: 'The Trickster', traits: ['witty', 'unpredictable', 'charming', 'selfish'], color: '#ec4899', desc: 'Life is a game — and they intend to win laughing.' },
  { id: 'noble', label: 'The Noble', traits: ['proud', 'commanding', 'generous', 'entitled'], color: '#a855f7', desc: 'Born to rule — expects deference.' },
];
const ALL_PERSONALITY_TRAITS = [
  'brave', 'cowardly', 'cunning', 'honest', 'deceptive', 'loyal', 'treacherous',
  'greedy', 'generous', 'cruel', 'kind', 'patient', 'impulsive', 'suspicious',
  'trusting', 'proud', 'humble', 'ambitious', 'lazy', 'devoted', 'selfish',
  'protective', 'reckless', 'cautious', 'charismatic', 'shy', 'witty', 'serious',
  'vengeful', 'forgiving', 'stubborn', 'flexible', 'honorable', 'pragmatic',
];
const MOTIVATION_OPTIONS = [
  'Wealth', 'Power', 'Knowledge', 'Faith', 'Duty', 'Protection', 'Revenge',
  'Survival', 'Freedom', 'Fun', 'Legacy', 'Love', 'Control', 'Status',
];
const COMBAT_STYLES = [
  { id: '', label: 'Default' },
  { id: 'cowardly', label: 'Cowardly — flees when wounded' },
  { id: 'aggressive', label: 'Aggressive — never retreats' },
  { id: 'cunning', label: 'Cunning — targets casters, uses cover' },
  { id: 'protective', label: 'Protective — guards allies' },
  { id: 'chaotic', label: 'Chaotic — unpredictable' },
  { id: 'tactical', label: 'Tactical — exploits weaknesses' },
];
const TRUST_LABELS = [
  { min: -100, max: -80, label: 'Sworn Enemy', color: '#7f1d1d' },
  { min: -79, max: -50, label: 'Hostile', color: '#dc2626' },
  { min: -49, max: -20, label: 'Distrustful', color: '#f97316' },
  { min: -19, max: 19, label: 'Neutral', color: '#6b7280' },
  { min: 20, max: 49, label: 'Friendly', color: '#22c55e' },
  { min: 50, max: 79, label: 'Devoted', color: '#3b82f6' },
  { min: 80, max: 100, label: 'Unbreakable Bond', color: '#a855f7' },
];
function getTrustLabel(score) {
  return TRUST_LABELS.find(l => score >= l.min && score <= l.max) || TRUST_LABELS[3];
}

function NPCForm({ npc, initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => {
    if (npc) return { ...npc };
    if (initialData) return { ...initialData };
    return {
      name: '', role: 'neutral', race: '', npc_class: '', location: '', description: '',
      notes_text: '', status: 'alive', relationship: 'Unknown', quest_hook: '',
      disposition: 'Neutral', last_seen_location: '', last_encountered: '',
      faction: '', pinned: false, conversation_log: [],
      personality_archetype: '', personality_traits: [], motivations: [],
      intelligence: 10, fear_courage: 50, trust_score: 0,
      combat_style: '', merchant_location_type: 'town',
    };
  });
  const [nameError, setNameError] = useState(false);
  const [activeTab, setActiveTab] = useState('basics');
  const update = (f, v) => {
    if (f === 'name') setNameError(false);
    setForm(prev => ({ ...prev, [f]: v }));
  };
  const toggleTrait = (trait) => {
    setForm(prev => {
      const traits = prev.personality_traits || [];
      return { ...prev, personality_traits: traits.includes(trait) ? traits.filter(t => t !== trait) : [...traits, trait] };
    });
  };
  const toggleMotivation = (m) => {
    setForm(prev => {
      const motivations = prev.motivations || [];
      return { ...prev, motivations: motivations.includes(m) ? motivations.filter(x => x !== m) : [...motivations, m] };
    });
  };
  const handleSubmit = () => {
    if (!form.name.trim()) { setNameError(true); setActiveTab('basics'); return; }
    onSubmit(form);
  };

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  const trustInfo = getTrustLabel(form.trust_score || 0);
  const tabStyle = (tab) => ({
    padding: '6px 14px', borderRadius: '6px 6px 0 0', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
    border: 'none', borderBottom: activeTab === tab ? '2px solid #fbbf24' : '2px solid transparent',
    background: activeTab === tab ? 'rgba(251,191,36,0.08)' : 'transparent',
    color: activeTab === tab ? '#fbbf24' : 'rgba(255,255,255,0.4)',
    fontFamily: 'var(--font-heading)',
  });

  return (
    <ModalPortal>
      <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="bg-[#14121c] border border-gold/30 rounded-lg p-5 w-full mx-4" style={{ maxWidth: '780px', maxHeight: '85vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg text-amber-100">{npc ? 'Edit NPC' : 'Add NPC'}</h3>
          <div className="flex gap-2">
            <button type="button" onClick={() => {
              const gen = generateRandomNpc();
              setForm(prev => ({ ...prev, ...gen }));
            }}
              className="text-xs flex items-center gap-1"
              style={{
                padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 500,
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.12))',
                color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.25)',
              }}
              title="Re-roll all fields with a new random NPC">
              <Shuffle size={12} /> Re-roll
            </button>
            <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
            <button onClick={handleSubmit} className="btn-primary text-sm">{npc ? 'Save' : 'Add'}</button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 12 }}>
          <button style={tabStyle('basics')} onClick={() => setActiveTab('basics')}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={12} /> Basics</span>
          </button>
          <button style={tabStyle('intelligence')} onClick={() => setActiveTab('intelligence')}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Brain size={12} /> Intelligence & Behavior</span>
          </button>
          <button style={tabStyle('combat')} onClick={() => setActiveTab('combat')}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Swords size={12} /> Combat</span>
          </button>
        </div>

        {/* ── Basics Tab ── */}
        {activeTab === 'basics' && (
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-3 flex gap-2">
            <input className={`input flex-1 ${nameError ? 'border-red-500' : ''}`} placeholder="NPC Name (e.g. Elara Brightheart)" value={form.name} onChange={e => update('name', e.target.value)} autoFocus />
            <button type="button" onClick={() => {
              const name = NPC_NAME_SUGGESTIONS[Math.floor(Math.random() * NPC_NAME_SUGGESTIONS.length)];
              update('name', name);
            }} className="btn-secondary text-xs whitespace-nowrap" title="Random name suggestion">
              Random
            </button>
            {nameError && <p className="text-red-400 text-xs mt-0.5 self-center">Name required</p>}
          </div>
          {!npc && (
            <div className="col-span-3 flex items-center gap-2">
              <span className="text-[10px] text-amber-200/30 whitespace-nowrap">Quick fill:</span>
              <div className="flex gap-1 flex-wrap">
                {NPC_TEMPLATES.map(t => (
                  <button key={t.label} type="button" onClick={() => {
                    setForm(prev => ({ ...prev, role: t.role, race: t.race, npc_class: t.npc_class, disposition: t.disposition, description: t.description }));
                  }}
                    className="text-[10px] px-2 py-0.5 rounded bg-amber-200/5 text-amber-200/30 border border-amber-200/8 hover:bg-amber-200/10 hover:text-amber-200/60 transition-all">
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <select className="input w-full" value={form.role} onChange={e => update('role', e.target.value)}>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select className="input w-full" value={form.status} onChange={e => update('status', e.target.value)}>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="input w-full" value={form.disposition || 'Neutral'} onChange={e => update('disposition', e.target.value)}>
            {DISPOSITIONS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <div>
            <input className="input w-full" placeholder="Race" value={form.race} onChange={e => update('race', e.target.value)} list="npc-races" />
            <datalist id="npc-races">
              {NPC_RACES.map(r => <option key={r} value={r} />)}
            </datalist>
          </div>
          <div>
            <input className="input w-full" placeholder="Class / Occupation" value={form.npc_class} onChange={e => update('npc_class', e.target.value)} list="npc-classes" />
            <datalist id="npc-classes">
              {NPC_CLASSES.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>
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
        )}

        {/* ── Intelligence & Behavior Tab ── */}
        {activeTab === 'intelligence' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Archetype Picker */}
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-mute)', fontFamily: 'var(--font-heading)', marginBottom: 6, display: 'block' }}>Personality Archetype</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {ARCHETYPES.map(a => (
                <button key={a.id} type="button" onClick={() => {
                  update('personality_archetype', a.id);
                  if (a.traits) update('personality_traits', a.traits);
                }}
                  style={{
                    padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 600,
                    border: `1px solid ${form.personality_archetype === a.id ? (a.color || '#fbbf24') + '50' : 'rgba(255,255,255,0.08)'}`,
                    background: form.personality_archetype === a.id ? (a.color || '#fbbf24') + '15' : 'rgba(255,255,255,0.02)',
                    color: form.personality_archetype === a.id ? (a.color || '#fbbf24') : 'rgba(255,255,255,0.5)',
                    fontFamily: 'var(--font-heading)',
                  }}>
                  {a.label}
                </button>
              ))}
            </div>
            {form.personality_archetype && ARCHETYPES.find(a => a.id === form.personality_archetype)?.desc && (
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 4, fontStyle: 'italic' }}>
                {ARCHETYPES.find(a => a.id === form.personality_archetype).desc}
              </p>
            )}
          </div>

          {/* Traits */}
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-mute)', fontFamily: 'var(--font-heading)', marginBottom: 6, display: 'block' }}>
              Personality Traits <span style={{ color: 'rgba(255,255,255,0.2)' }}>({(form.personality_traits || []).length} selected)</span>
            </label>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {ALL_PERSONALITY_TRAITS.map(t => {
                const selected = (form.personality_traits || []).includes(t);
                return (
                  <button key={t} type="button" onClick={() => toggleTrait(t)}
                    style={{
                      padding: '3px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 10,
                      border: `1px solid ${selected ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.06)'}`,
                      background: selected ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.02)',
                      color: selected ? '#4ade80' : 'rgba(255,255,255,0.35)',
                      fontWeight: selected ? 600 : 400,
                    }}>
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Motivations */}
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-mute)', fontFamily: 'var(--font-heading)', marginBottom: 6, display: 'block' }}>
              Motivations <span style={{ color: 'rgba(255,255,255,0.2)' }}>({(form.motivations || []).length} selected)</span>
            </label>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {MOTIVATION_OPTIONS.map(m => {
                const selected = (form.motivations || []).includes(m);
                return (
                  <button key={m} type="button" onClick={() => toggleMotivation(m)}
                    style={{
                      padding: '3px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 10,
                      border: `1px solid ${selected ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.06)'}`,
                      background: selected ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.02)',
                      color: selected ? '#a78bfa' : 'rgba(255,255,255,0.35)',
                      fontWeight: selected ? 600 : 400,
                    }}>
                    {m}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sliders: Intelligence, Fear/Courage, Trust */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: 11, color: 'var(--text-mute)', fontFamily: 'var(--font-heading)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Intelligence</span>
                <span style={{ color: '#fbbf24' }}>{form.intelligence ?? 10}</span>
              </label>
              <input type="range" min="1" max="30" value={form.intelligence ?? 10} onChange={e => update('intelligence', parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#fbbf24' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>
                <span>Mindless</span><span>Genius</span>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, color: 'var(--text-mute)', fontFamily: 'var(--font-heading)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Fear / Courage</span>
                <span style={{ color: (form.fear_courage ?? 50) >= 50 ? '#22c55e' : '#ef4444' }}>{form.fear_courage ?? 50}</span>
              </label>
              <input type="range" min="0" max="100" value={form.fear_courage ?? 50} onChange={e => update('fear_courage', parseInt(e.target.value))}
                style={{ width: '100%', accentColor: (form.fear_courage ?? 50) >= 50 ? '#22c55e' : '#ef4444' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>
                <span>Cowardly</span><span>Fearless</span>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, color: 'var(--text-mute)', fontFamily: 'var(--font-heading)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Trust</span>
                <span style={{ color: trustInfo.color }}>{form.trust_score ?? 0} — {trustInfo.label}</span>
              </label>
              <input type="range" min="-100" max="100" value={form.trust_score ?? 0} onChange={e => update('trust_score', parseInt(e.target.value))}
                style={{ width: '100%', accentColor: trustInfo.color }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>
                <span>Sworn Enemy</span><span>Unbreakable</span>
              </div>
            </div>
          </div>

          {/* Behavior Preview */}
          {(form.personality_traits || []).length > 0 && (
            <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 10, color: 'var(--text-mute)', fontFamily: 'var(--font-heading)', marginBottom: 6 }}>Behavior Preview</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                <div><strong style={{ color: 'rgba(255,255,255,0.7)' }}>If party asks for help:</strong> {
                  (form.trust_score ?? 0) >= 50 ? 'Eagerly agrees — devoted to party' :
                  (form.trust_score ?? 0) >= 20 ? 'Happy to help — friendly relationship' :
                  (form.personality_traits || []).includes('greedy') ? 'Demands payment first — greedy nature' :
                  (form.trust_score ?? 0) <= -20 ? 'Refuses — wants nothing to do with party' :
                  'Weighs the request — persuasion may be needed'
                }</div>
                <div><strong style={{ color: 'rgba(255,255,255,0.7)' }}>If threatened:</strong> {
                  (form.personality_traits || []).includes('brave') || (form.fear_courage ?? 50) >= 70 ? 'Stands firm — refuses to be intimidated' :
                  (form.personality_traits || []).includes('cowardly') || (form.fear_courage ?? 50) <= 30 ? 'Capitulates immediately — too afraid to resist' :
                  (form.personality_traits || []).includes('cunning') ? 'Pretends to submit, plans retaliation' :
                  'Considers their options — DC 13 Intimidation'
                }</div>
                <div><strong style={{ color: 'rgba(255,255,255,0.7)' }}>Combat morale:</strong> {
                  (form.fear_courage ?? 50) >= 70 ? 'Fights bravely, inspires allies' :
                  (form.fear_courage ?? 50) >= 40 ? 'Holds the line, retreats if badly wounded' :
                  'Flees at first sign of real danger'
                }</div>
              </div>
            </div>
          )}
        </div>
        )}

        {/* ── Combat Tab ── */}
        {activeTab === 'combat' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-mute)', fontFamily: 'var(--font-heading)', marginBottom: 6, display: 'block' }}>Combat Style</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {COMBAT_STYLES.map(s => (
                <button key={s.id} type="button" onClick={() => update('combat_style', s.id)}
                  style={{
                    padding: '8px 14px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                    border: `1px solid ${form.combat_style === s.id ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    background: form.combat_style === s.id ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.02)',
                    color: form.combat_style === s.id ? '#fca5a5' : 'rgba(255,255,255,0.4)',
                    fontSize: 12,
                  }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Intelligence tier preview */}
          <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 10, color: 'var(--text-mute)', fontFamily: 'var(--font-heading)', marginBottom: 6 }}>Combat Intelligence Tier</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
              {(form.intelligence ?? 10) <= 2 && <><strong style={{ color: '#ef4444' }}>Mindless</strong> — Attacks nearest target, ignores tactics, never retreats</>}
              {(form.intelligence ?? 10) >= 3 && (form.intelligence ?? 10) <= 4 && <><strong style={{ color: '#f97316' }}>Beast</strong> — Instinct-driven, attacks nearest, flees when wounded</>}
              {(form.intelligence ?? 10) >= 5 && (form.intelligence ?? 10) <= 8 && <><strong style={{ color: '#fbbf24' }}>Low</strong> — Focuses weak targets, basic self-preservation</>}
              {(form.intelligence ?? 10) >= 9 && (form.intelligence ?? 10) <= 12 && <><strong style={{ color: '#22c55e' }}>Average</strong> — Targets casters, uses terrain, coordinates with allies</>}
              {(form.intelligence ?? 10) >= 13 && (form.intelligence ?? 10) <= 16 && <><strong style={{ color: '#3b82f6' }}>Smart</strong> — Exploits conditions, baits reactions, retreats tactically</>}
              {(form.intelligence ?? 10) >= 17 && <><strong style={{ color: '#a855f7' }}>Genius</strong> — Predicts player strategies, sets traps, sacrifices pawns</>}
            </div>
          </div>

          {/* Merchant settings (show if class is merchant-related) */}
          {['Merchant', 'Innkeeper', 'Blacksmith', 'Alchemist'].includes(form.npc_class) && (
            <div>
              <label style={{ fontSize: 11, color: 'var(--text-mute)', fontFamily: 'var(--font-heading)', marginBottom: 6, display: 'block' }}>
                Merchant Location Type <span style={{ color: 'rgba(255,255,255,0.2)' }}>(affects pricing)</span>
              </label>
              <select className="input w-full" value={form.merchant_location_type || 'town'} onChange={e => update('merchant_location_type', e.target.value)}>
                <option value="capital">Capital City (best prices)</option>
                <option value="city">City (competitive)</option>
                <option value="town">Town (standard)</option>
                <option value="village">Village (slight markup)</option>
                <option value="outpost">Outpost (noticeable markup)</option>
                <option value="wilderness">Wilderness (premium)</option>
                <option value="underdark">Underdark (high markup)</option>
                <option value="black_market">Black Market (cheap buy, cheap sell)</option>
              </select>
            </div>
          )}
        </div>
        )}
      </div>
      </div>
    </ModalPortal>
  );
}
