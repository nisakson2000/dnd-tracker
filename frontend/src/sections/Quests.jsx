import { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Edit2, Map, CheckSquare, Square, XCircle, Star, Coins, Package, User, MapPin, Clock, ChevronDown, ChevronRight, Flag, Scroll, MessageSquarePlus, Crosshair, Compass, EyeOff, Eye, Shuffle } from 'lucide-react';
import toast from 'react-hot-toast';
import MDEditor from '@uiw/react-md-editor';
import { getQuests, addQuest, updateQuest, deleteQuest } from '../api/quests';
import { getNPCs } from '../api/npcs';
import { getOverview, updateOverview } from '../api/overview';
import ConfirmDialog from '../components/ConfirmDialog';
import ModalPortal from '../components/ModalPortal';
import { useAppMode } from '../contexts/ModeContext';

const DIFFICULTIES = ['trivial', 'easy', 'medium', 'hard', 'deadly'];
const DIFFICULTY_COLORS = {
  trivial: 'bg-emerald-800/30 text-emerald-300',
  easy: 'bg-emerald-800/30 text-emerald-300',
  medium: 'bg-amber-800/30 text-amber-300',
  hard: 'bg-red-800/30 text-red-300',
  deadly: 'bg-red-950/40 text-red-400',
};

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const PRIORITY_STYLES = {
  Low: { dot: 'bg-emerald-400', badge: 'bg-emerald-800/30 text-emerald-300 border-emerald-500/30' },
  Medium: { dot: 'bg-yellow-400', badge: 'bg-yellow-800/30 text-yellow-300 border-yellow-500/30' },
  High: { dot: 'bg-orange-400', badge: 'bg-orange-800/30 text-orange-300 border-orange-500/30' },
  Critical: { dot: 'bg-red-500 animate-pulse', badge: 'bg-red-800/30 text-red-300 border-red-500/30' },
};

const QUEST_TEMPLATES = [
  { label: 'Bounty Hunt', quest_type: 'Bounty', description: 'A dangerous creature has been spotted in the area. Track it down and eliminate the threat.', objectives: [{ text: 'Locate the creature', completed: false }, { text: 'Defeat or capture the target', completed: false }, { text: 'Return with proof of completion', completed: false }], difficulty: 'medium' },
  { label: 'Rescue Mission', quest_type: 'Side Quest', description: 'Someone has gone missing and needs to be found before it\'s too late.', objectives: [{ text: 'Investigate the disappearance', completed: false }, { text: 'Track down the missing person', completed: false }, { text: 'Ensure their safe return', completed: false }], difficulty: 'medium' },
  { label: 'Fetch Quest', quest_type: 'Side Quest', description: 'A rare item must be retrieved from a dangerous location.', objectives: [{ text: 'Travel to the location', completed: false }, { text: 'Retrieve the item', completed: false }, { text: 'Return the item to the quest giver', completed: false }], difficulty: 'easy' },
  { label: 'Escort Mission', quest_type: 'Side Quest', description: 'A traveler needs safe passage through dangerous territory.', objectives: [{ text: 'Meet the traveler', completed: false }, { text: 'Protect them during the journey', completed: false }, { text: 'Deliver them safely to the destination', completed: false }], difficulty: 'medium' },
  { label: 'Dungeon Delve', quest_type: 'Main Story', description: 'An ancient dungeon holds secrets and treasure, but also deadly traps and guardians.', objectives: [{ text: 'Find the dungeon entrance', completed: false }, { text: 'Navigate the traps and puzzles', completed: false }, { text: 'Defeat the dungeon boss', completed: false }, { text: 'Claim the treasure', completed: false }], difficulty: 'hard' },
  { label: 'Investigation', quest_type: 'Side Quest', description: 'Strange events demand answers. Gather clues and uncover the truth.', objectives: [{ text: 'Gather initial clues', completed: false }, { text: 'Interview witnesses or suspects', completed: false }, { text: 'Piece together the evidence', completed: false }, { text: 'Confront the responsible party', completed: false }], difficulty: 'medium' },
  { label: 'Defense / Siege', quest_type: 'Main Story', description: 'An attack is imminent. Prepare defenses and hold the line.', objectives: [{ text: 'Fortify defenses', completed: false }, { text: 'Rally allies and defenders', completed: false }, { text: 'Repel the attackers', completed: false }], difficulty: 'hard' },
  { label: 'Political Intrigue', quest_type: 'Main Story', description: 'Navigate the treacherous waters of politics and power.', objectives: [{ text: 'Gather intelligence on the factions', completed: false }, { text: 'Gain an ally among the powerful', completed: false }, { text: 'Expose or outmaneuver the opposition', completed: false }], difficulty: 'medium' },
];

const SUGGESTED_OBJECTIVES = ['Defeat the enemy', 'Find the hidden item', 'Speak to the contact', 'Solve the puzzle', 'Escort to safety', 'Survive the ambush', 'Gather evidence', 'Return to quest giver'];

const QUICK_QUEST_TITLES = [
  'The Missing Merchant', 'Shadows in the Mines', 'A Debt Unpaid', 'The Cursed Relic',
  'Wolves at the Gate', 'The Silent Village', 'Bounty: The Iron Fang', 'Secrets of the Old Tower',
  'The Stolen Heirloom', 'Rumbles Beneath', 'A Call for Aid', 'The Poisoned Well',
  'Whispers in the Dark', 'The Broken Seal', 'Trouble at the Border', 'The Lost Expedition',
];

function generateRandomQuest() {
  const template = QUEST_TEMPLATES[Math.floor(Math.random() * QUEST_TEMPLATES.length)];
  const title = QUICK_QUEST_TITLES[Math.floor(Math.random() * QUICK_QUEST_TITLES.length)];
  const priority = PRIORITIES[Math.floor(Math.random() * PRIORITIES.length)];
  return {
    title,
    quest_giver: '',
    description: template.description,
    status: 'active',
    difficulty: template.difficulty,
    notes_text: '',
    objectives: template.objectives.map(o => ({ ...o })),
    priority,
    xp_reward: '',
    gold_reward: '',
    item_rewards: '',
    location: '',
    quest_type: template.quest_type,
    timeline: [{ stage: 'received', date: new Date().toISOString().split('T')[0] }],
    session_notes: [],
    rewards_received: false,
    sub_objectives: {},
    secret_objectives: [],
    session_counter: 0,
  };
}

const QUEST_TYPES = ['Main Story', 'Side Quest', 'Personal', 'Bounty'];
const QUEST_TYPE_STYLES = {
  'Main Story': { bg: 'bg-amber-800/30', text: 'text-amber-300', border: 'border-amber-500/30', icon: Star, borderColor: 'border-l-amber-500' },
  'Side Quest': { bg: 'bg-blue-800/30', text: 'text-blue-300', border: 'border-blue-500/30', icon: Compass, borderColor: 'border-l-blue-500' },
  'Personal': { bg: 'bg-purple-800/30', text: 'text-purple-300', border: 'border-purple-500/30', icon: User, borderColor: 'border-l-purple-500' },
  'Bounty': { bg: 'bg-red-800/30', text: 'text-red-300', border: 'border-red-500/30', icon: Crosshair, borderColor: 'border-l-red-500' },
};

const TIMELINE_STAGES = ['received', 'in_progress', 'completed', 'failed'];
const TIMELINE_LABELS = { received: 'Received', in_progress: 'In Progress', completed: 'Completed', failed: 'Failed' };

// Pack extra fields into the notes JSON blob so they persist
function packQuestNotes(data) {
  const { notes_text, quest_giver, location, priority, difficulty, xp_reward, gold_reward, item_rewards, rewards_received, quest_type, timeline, session_notes, sub_objectives, secret_objectives, session_counter, xp_awarded } = data;
  return JSON.stringify({
    _v: 3,
    notes_text: notes_text || '',
    quest_giver: quest_giver || '',
    location: location || '',
    priority: priority || '',
    difficulty: difficulty || '',
    xp_reward: xp_reward || '',
    gold_reward: gold_reward || '',
    item_rewards: item_rewards || '',
    rewards_received: rewards_received || false,
    quest_type: quest_type || '',
    timeline: timeline || [],
    session_notes: session_notes || [],
    sub_objectives: sub_objectives || {},
    secret_objectives: secret_objectives || [],
    session_counter: session_counter || 0,
    xp_awarded: xp_awarded || false,
  });
}

function unpackQuestNotes(notesStr) {
  const defaults = { notes_text: '', quest_giver: '', location: '', priority: '', difficulty: '', xp_reward: '', gold_reward: '', item_rewards: '', rewards_received: false, quest_type: '', timeline: [], session_notes: [], sub_objectives: {}, secret_objectives: [], session_counter: 0, xp_awarded: false };
  if (!notesStr) return defaults;
  try {
    const parsed = JSON.parse(notesStr);
    if (parsed._v) return { ...defaults, ...parsed };
  } catch { /* not JSON — legacy plain text */ }
  return { ...defaults, notes_text: notesStr };
}

function enrichQuest(q) {
  const extra = unpackQuestNotes(q.notes);
  return {
    ...q,
    notes_text: extra.notes_text || '',
    quest_giver: extra.quest_giver || q.giver || '',
    location: extra.location || '',
    priority: extra.priority || '',
    difficulty: extra.difficulty || '',
    xp_reward: extra.xp_reward || '',
    gold_reward: extra.gold_reward || '',
    item_rewards: extra.item_rewards || '',
    rewards_received: extra.rewards_received || false,
    quest_type: extra.quest_type || '',
    timeline: extra.timeline || [],
    session_notes: extra.session_notes || [],
    sub_objectives: extra.sub_objectives || {},
    secret_objectives: extra.secret_objectives || [],
    session_counter: extra.session_counter || 0,
    xp_awarded: extra.xp_awarded || false,
  };
}

function prepareQuestPayload(form) {
  const notes = packQuestNotes(form);
  return {
    title: form.title,
    giver: form.quest_giver || '',
    description: form.description || '',
    status: form.status || 'active',
    notes,
    objectives: form.objectives || [],
  };
}

export default function Quests({ characterId }) {
  const { mode: appMode } = useAppMode();
  const isDM = appMode === 'dm';
  const [quests, setQuests] = useState([]);
  const [npcs, setNpcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [quickGenData, setQuickGenData] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [sortBy, setSortBy] = useState('status');
  // viewMode reserved for future cards/timeline toggle
  const [typeFilter, setTypeFilter] = useState('all');
  const [sessionNoteQuest, setSessionNoteQuest] = useState(null);
  const [expandedQuests, setExpandedQuests] = useState(new Set());

  const load = async () => {
    try { setQuests((await getQuests(characterId)).map(enrichQuest)); }
    catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const loadNPCs = async () => {
    try { setNpcs(await getNPCs(characterId)); }
    catch (err) { if (import.meta.env.DEV) console.warn('Failed to load NPCs for quest cross-refs:', err); }
  };

  useEffect(() => { load(); loadNPCs(); }, [characterId]);

  const getRelatedNPCs = (quest) => {
    if (npcs.length === 0) return [];
    const matched = new Set();
    const giver = (quest.quest_giver || quest.giver || '').toLowerCase();
    const desc = (quest.description || '').toLowerCase();
    return npcs.filter(npc => {
      if (!npc.name) return false;
      const name = npc.name.toLowerCase();
      if (giver.includes(name) || desc.includes(name)) {
        if (matched.has(npc.id)) return false;
        matched.add(npc.id);
        return true;
      }
      return false;
    });
  };

  // Consolidated XP award helper — guards against double-awarding
  const awardQuestXP = async (questId, questData, xpReward) => {
    if (!xpReward || questData.xp_awarded) return;
    try {
      const overview = await getOverview(characterId);
      const newXP = (overview.experience_points || 0) + xpReward;
      await updateOverview(characterId, { ...overview, experience_points: newXP });
      // Mark quest as xp_awarded so it can't be awarded again
      const marked = { ...questData, xp_awarded: true };
      await updateQuest(characterId, questId, prepareQuestPayload(marked));
      toast.success(`+${xpReward.toLocaleString()} XP awarded!`, { icon: '⭐' });
    } catch (err) { if (import.meta.env.DEV) console.warn('XP award failed:', err); }
  };

  const handleSave = async (formData) => {
    try {
      const payload = prepareQuestPayload(formData);
      if (editing) {
        await updateQuest(characterId, editing.id, payload);
        if (formData.status === 'completed' && editing.status !== 'completed') {
          toast.success('Quest completed!');
          const xpReward = Number(formData.xp_reward) || 0;
          if (xpReward > 0) {
            await awardQuestXP(editing.id, formData, xpReward);
          }
        } else {
          toast.success('Quest updated');
        }
      } else {
        await addQuest(characterId, payload);
        toast.success('Quest added');
      }
      setShowForm(false);
      setEditing(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteQuest(characterId, id);
      toast.success('Quest removed');
      setConfirmDelete(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const toggleObjective = async (quest, objIndex) => {
    const updated = {
      ...quest,
      objectives: (quest.objectives || []).map((o, i) =>
        i === objIndex ? { ...o, completed: !o.completed } : o
      ),
    };
    try {
      await updateQuest(characterId, quest.id, prepareQuestPayload(updated));
      load();
    } catch (err) { toast.error(err.message); }
  };

  const toggleSubObjective = async (quest, objIndex, subIndex) => {
    const subObjs = { ...(quest.sub_objectives || {}) };
    const key = `${objIndex}`;
    const subs = [...(subObjs[key] || [])];
    subs[subIndex] = { ...subs[subIndex], completed: !subs[subIndex].completed };
    subObjs[key] = subs;
    const updated = { ...quest, sub_objectives: subObjs };
    try {
      await updateQuest(characterId, quest.id, prepareQuestPayload(updated));
      load();
    } catch (err) { toast.error(err.message); }
  };

  const cyclePriority = async (quest) => {
    const allPriorities = ['', ...PRIORITIES];
    const currentIdx = allPriorities.indexOf(quest.priority || '');
    const nextIdx = (currentIdx + 1) % allPriorities.length;
    const updated = { ...quest, priority: allPriorities[nextIdx] };
    try {
      await updateQuest(characterId, quest.id, prepareQuestPayload(updated));
      toast.success(allPriorities[nextIdx] ? `Priority: ${allPriorities[nextIdx]}` : 'Priority cleared');
      load();
    } catch (err) { toast.error(err.message); }
  };

  const cycleQuestType = async (quest) => {
    const allTypes = ['', ...QUEST_TYPES];
    const currentIdx = allTypes.indexOf(quest.quest_type || '');
    const nextIdx = (currentIdx + 1) % allTypes.length;
    const updated = { ...quest, quest_type: allTypes[nextIdx] };
    try {
      await updateQuest(characterId, quest.id, prepareQuestPayload(updated));
      toast.success(allTypes[nextIdx] ? `Type: ${allTypes[nextIdx]}` : 'Type cleared');
      load();
    } catch (err) { toast.error(err.message); }
  };

  const addSessionNote = async (quest, noteText) => {
    const sessionNotes = [...(quest.session_notes || [])];
    const sessionNum = (quest.session_counter || 0) + 1;
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    sessionNotes.push({ text: noteText, date: new Date().toISOString().split('T')[0], timestamp: new Date().toISOString(), session: sessionNum, label: `Session ${sessionNum} - ${dateStr}` });
    const updated = { ...quest, session_notes: sessionNotes, session_counter: sessionNum };
    try {
      await updateQuest(characterId, quest.id, prepareQuestPayload(updated));
      toast.success('Session note added');
      load();
    } catch (err) { toast.error(err.message); }
  };

  const toggleSecretObjective = async (quest, secretIdx) => {
    const secrets = [...(quest.secret_objectives || [])];
    secrets[secretIdx] = { ...secrets[secretIdx], revealed: !secrets[secretIdx].revealed };
    const updated = { ...quest, secret_objectives: secrets };
    try {
      await updateQuest(characterId, quest.id, prepareQuestPayload(updated));
      toast.success(secrets[secretIdx].revealed ? 'Objective revealed!' : 'Objective hidden');
      load();
    } catch (err) { toast.error(err.message); }
  };

  const toggleSecretObjectiveComplete = async (quest, secretIdx) => {
    const secrets = [...(quest.secret_objectives || [])];
    secrets[secretIdx] = { ...secrets[secretIdx], completed: !secrets[secretIdx].completed };
    const updated = { ...quest, secret_objectives: secrets };
    try {
      await updateQuest(characterId, quest.id, prepareQuestPayload(updated));
      load();
    } catch (err) { toast.error(err.message); }
  };

  const markRewardsReceived = async (quest) => {
    const updated = { ...quest, rewards_received: !quest.rewards_received };
    try {
      await updateQuest(characterId, quest.id, prepareQuestPayload(updated));
      toast.success(updated.rewards_received ? 'Rewards marked as received' : 'Rewards unmarked');
      load();
    } catch (err) { toast.error(err.message); }
  };

  const changeStatus = async (quest, newStatus) => {
    // Add timeline event
    const timeline = [...(quest.timeline || [])];
    const stage = newStatus === 'active' ? 'in_progress' : newStatus;
    if (!timeline.find(t => t.stage === stage)) {
      timeline.push({ stage, date: new Date().toISOString().split('T')[0] });
    }
    const updated = { ...quest, status: newStatus, timeline };
    try {
      await updateQuest(characterId, quest.id, prepareQuestPayload(updated));
      if (newStatus === 'completed') {
        toast.success(`Quest "${quest.title}" completed!`);
        const xpReward = Number(quest.xp_reward) || 0;
        if (xpReward > 0) {
          await awardQuestXP(quest.id, updated, xpReward);
        }
      }
      else if (newStatus === 'failed') toast(`Quest "${quest.title}" failed`);
      else toast.success(`Quest "${quest.title}" reactivated`);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const getProgress = (q) => {
    const objs = q.objectives || [];
    const secrets = (q.secret_objectives || []).filter(s => s.revealed);
    if (objs.length === 0 && secrets.length === 0) return 0;
    let total = 0, done = 0;
    objs.forEach((o, i) => {
      total++;
      if (o.completed) done++;
      const subs = (q.sub_objectives || {})[`${i}`] || [];
      subs.forEach(s => { total++; if (s.completed) done++; });
    });
    secrets.forEach(s => { total++; if (s.completed) done++; });
    return total > 0 ? (done / total) * 100 : 0;
  };

  const sortedQuests = useMemo(() => {
    let list = [...quests];
    if (typeFilter !== 'all') list = list.filter(q => q.quest_type === typeFilter);
    return list.sort((a, b) => {
      if (sortBy === 'name') return (a.title || '').localeCompare(b.title || '');
      if (sortBy === 'status') {
        const order = { active: 0, completed: 1, failed: 2 };
        return (order[a.status] ?? 9) - (order[b.status] ?? 9);
      }
      if (sortBy === 'progress') return getProgress(b) - getProgress(a);
      if (sortBy === 'priority') {
        const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
        return (order[a.priority] ?? 9) - (order[b.priority] ?? 9);
      }
      if (sortBy === 'type') {
        const order = { 'Main Story': 0, 'Side Quest': 1, 'Personal': 2, 'Bounty': 3 };
        return (order[a.quest_type] ?? 9) - (order[b.quest_type] ?? 9);
      }
      return 0;
    });
  }, [quests, sortBy, typeFilter]);

  const active = useMemo(() => sortedQuests.filter(q => q.status === 'active'), [sortedQuests]);
  const completed = useMemo(() => sortedQuests.filter(q => q.status === 'completed'), [sortedQuests]);
  const failed = useMemo(() => sortedQuests.filter(q => q.status === 'failed'), [sortedQuests]);

  const rewardSummary = useMemo(() => {
    const activeQuests = quests.filter(q => q.status === 'active');
    const totalXP = activeQuests.reduce((sum, q) => sum + (Number(q.xp_reward) || 0), 0);
    const totalGold = activeQuests.reduce((sum, q) => sum + (Number(q.gold_reward) || 0), 0);
    return { totalXP, totalGold };
  }, [quests]);

  const toggleExpand = (id) => {
    setExpandedQuests(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading) return (
    <div className="space-y-4">
      <div className="skeleton-pulse" style={{ height: 32, width: '50%' }} />
      <div className="skeleton-pulse" style={{ height: 100 }} />
      <div className="skeleton-pulse" style={{ height: 100 }} />
    </div>
  );

  const QuestTimeline = ({ quest }) => {
    const timeline = quest.timeline || [];
    const stages = ['received', 'in_progress', quest.status === 'failed' ? 'failed' : 'completed'];
    return (
      <div className="flex items-center gap-1 mt-2">
        {stages.map((stage, i) => {
          const event = timeline.find(t => t.stage === stage);
          const isActive = event != null;
          const isCurrent = (stage === 'in_progress' && quest.status === 'active') || stage === quest.status;
          return (
            <div key={stage} className="flex items-center gap-1 flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-3 h-3 rounded-full border-2 ${isActive ? (stage === 'failed' ? 'bg-red-500 border-red-400' : stage === 'completed' ? 'bg-emerald-500 border-emerald-400' : 'bg-amber-500 border-amber-400') : isCurrent ? 'border-amber-400 bg-amber-400/30' : 'border-amber-200/20 bg-transparent'}`} />
                <span className={`text-[9px] mt-0.5 ${isActive ? 'text-amber-200/60' : 'text-amber-200/20'}`}>{TIMELINE_LABELS[stage]}</span>
                {event?.date && <span className="text-[8px] text-amber-200/30">{event.date}</span>}
              </div>
              {i < stages.length - 1 && <div className={`h-0.5 flex-1 -mt-3 ${isActive ? 'bg-amber-500/40' : 'bg-amber-200/10'}`} />}
            </div>
          );
        })}
      </div>
    );
  };

  const QuestCard = ({ quest }) => {
    const priorityStyle = PRIORITY_STYLES[quest.priority] || null;
    const typeStyle = QUEST_TYPE_STYLES[quest.quest_type] || null;
    const isExpanded = expandedQuests.has(quest.id);
    const progressPct = getProgress(quest);
    const hasRewards = Number(quest.xp_reward) > 0 || Number(quest.gold_reward) > 0 || quest.item_rewards;

    return (
      <div className={`card ${quest.status === 'failed' ? 'border-l-3 border-l-red-500' : ''} ${typeStyle ? `border-l-3 ${typeStyle.borderColor}` : ''}`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {quest.status === 'failed' && <XCircle size={16} className="text-red-400 flex-shrink-0" />}
              {priorityStyle && (
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${priorityStyle.dot}`} title={`${quest.priority} priority`} />
              )}
              <h4 className={`text-amber-100 font-display ${quest.status === 'failed' ? 'line-through text-amber-100/50' : ''}`}>{quest.title || 'Untitled Quest'}</h4>
              <button onClick={() => toggleExpand(quest.id)} className="text-amber-200/30 hover:text-amber-200/60 ml-auto flex-shrink-0">
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            </div>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {quest.quest_giver && (
                <p className="text-xs text-amber-200/40 flex items-center gap-1">
                  <User size={11} className="flex-shrink-0" /> {quest.quest_giver}
                </p>
              )}
              {quest.location && (
                <p className="text-xs text-amber-200/40 flex items-center gap-1">
                  <MapPin size={11} className="flex-shrink-0" /> {quest.location}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-1 flex-shrink-0 ml-2">
            {quest.status === 'active' && (
              <>
                <button onClick={() => changeStatus(quest, 'completed')} className="text-emerald-400/50 hover:text-emerald-400" title="Mark as completed"><CheckSquare size={14} /></button>
                <button onClick={() => changeStatus(quest, 'failed')} className="text-red-400/30 hover:text-red-400" title="Mark as failed"><XCircle size={14} /></button>
              </>
            )}
            {quest.status !== 'active' && (
              <button onClick={() => changeStatus(quest, 'active')} className="text-amber-200/40 hover:text-amber-200" title="Reactivate quest"><Map size={14} /></button>
            )}
            <button onClick={() => setSessionNoteQuest(quest)} className="text-amber-200/40 hover:text-amber-200" title="Add session note"><MessageSquarePlus size={14} /></button>
            {isDM && <button onClick={() => { setEditing(quest); setShowForm(true); }} className="text-amber-200/40 hover:text-amber-200"><Edit2 size={14} /></button>}
            {isDM && <button onClick={() => setConfirmDelete(quest)} className="text-red-400/50 hover:text-red-400"><Trash2 size={14} /></button>}
          </div>
        </div>

        {quest.description && <p className="text-sm text-amber-200/50 mb-2">{quest.description}</p>}

        {/* Quest type & priority badges */}
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span className={`text-xs px-2 py-0.5 rounded ${
            quest.status === 'active' ? 'bg-emerald-800/30 text-emerald-300' :
            quest.status === 'completed' ? 'bg-blue-800/30 text-blue-300' :
            'bg-red-800/30 text-red-300'
          }`}>{quest.status}</span>
          <button onClick={() => cycleQuestType(quest)} className={`text-xs px-2 py-0.5 rounded border cursor-pointer transition-colors flex items-center gap-1 ${typeStyle ? `${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}` : 'bg-amber-200/5 text-amber-200/30 border-amber-200/10 hover:text-amber-200/50'}`} title="Click to cycle quest type">
            {typeStyle ? (() => { const TypeIcon = typeStyle.icon; return <TypeIcon size={11} />; })() : null}
            {quest.quest_type || 'No Type'}
          </button>
          {quest.difficulty && DIFFICULTY_COLORS[quest.difficulty] && (
            <span className={`text-xs px-2 py-0.5 rounded capitalize ${DIFFICULTY_COLORS[quest.difficulty]}`}>{quest.difficulty}</span>
          )}
          <button onClick={() => cyclePriority(quest)} className={`text-xs px-2 py-0.5 rounded border cursor-pointer transition-colors ${priorityStyle ? priorityStyle.badge : 'bg-amber-200/5 text-amber-200/30 border-amber-200/10 hover:text-amber-200/50'}`} title="Click to cycle priority">
            {quest.priority || 'No Priority'}
          </button>
        </div>

        {/* Rewards with received toggle */}
        {hasRewards && (
          <div className={`flex items-center gap-3 mb-2 flex-wrap ${quest.rewards_received ? 'opacity-50' : ''}`}>
            {Number(quest.xp_reward) > 0 && (
              <span className="text-xs text-amber-200/50 flex items-center gap-1">
                <Star size={12} className="text-yellow-400" /> {quest.xp_reward} XP
              </span>
            )}
            {Number(quest.gold_reward) > 0 && (
              <span className="text-xs text-amber-200/50 flex items-center gap-1">
                <Coins size={12} className="text-yellow-500" /> {quest.gold_reward} GP
              </span>
            )}
            {quest.item_rewards && (
              <span className="text-xs text-amber-200/50 flex items-center gap-1">
                <Package size={12} className="text-blue-400" /> {quest.item_rewards}
              </span>
            )}
            {quest.status === 'completed' && (
              <button onClick={() => markRewardsReceived(quest)}
                className={`text-[10px] px-1.5 py-0.5 rounded border ${quest.rewards_received ? 'bg-emerald-800/30 text-emerald-300 border-emerald-500/30' : 'border-amber-200/20 text-amber-200/40 hover:text-amber-200/60'}`}>
                {quest.rewards_received ? 'Received' : 'Mark received'}
              </button>
            )}
          </div>
        )}

        {/* Timeline visualization */}
        {(quest.timeline || []).length > 0 && <QuestTimeline quest={quest} />}

        {/* Objectives & Progress */}
        {((quest.objectives || []).length > 0 || (quest.secret_objectives || []).some(s => s.revealed)) && (() => {
          const objs = quest.objectives || [];
          const revealedSecrets = (quest.secret_objectives || []).filter(s => s.revealed);
          const totalItems = objs.reduce((sum, o, i) => sum + 1 + ((quest.sub_objectives || {})[`${i}`] || []).length, 0) + revealedSecrets.length;
          const doneItems = objs.reduce((sum, o, i) => {
            let d = o.completed ? 1 : 0;
            ((quest.sub_objectives || {})[`${i}`] || []).forEach(s => { if (s.completed) d++; });
            return sum + d;
          }, 0) + revealedSecrets.filter(s => s.completed).length;
          return (
            <div className="mt-2">
              <div className="space-y-1">
                {objs.map((obj, i) => {
                  const subs = (quest.sub_objectives || {})[`${i}`] || [];
                  return (
                    <div key={obj.id || i}>
                      <button onClick={() => toggleObjective(quest, i)} className="flex items-center gap-2 w-full text-left text-sm">
                        {obj.completed ? <CheckSquare size={14} className="text-emerald-400 flex-shrink-0" /> : <Square size={14} className="text-amber-200/30 flex-shrink-0" />}
                        <span className={obj.completed ? 'line-through text-amber-200/30' : 'text-amber-200/60'}>{obj.text}</span>
                      </button>
                      {subs.length > 0 && (
                        <div className="ml-6 space-y-0.5 mt-0.5">
                          {subs.map((sub, si) => (
                            <button key={si} onClick={() => toggleSubObjective(quest, i, si)} className="flex items-center gap-2 w-full text-left text-xs">
                              {sub.completed ? <CheckSquare size={12} className="text-emerald-400/70 flex-shrink-0" /> : <Square size={12} className="text-amber-200/20 flex-shrink-0" />}
                              <span className={sub.completed ? 'line-through text-amber-200/20' : 'text-amber-200/40'}>{sub.text}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                {/* Secret objectives (revealed ones) */}
                {(quest.secret_objectives || []).map((secret, si) => {
                  if (!secret.revealed) return null;
                  return (
                    <div key={`secret-${si}`} className="flex items-center gap-2">
                      <button onClick={() => toggleSecretObjectiveComplete(quest, si)} className="flex items-center gap-2 w-full text-left text-sm">
                        {secret.completed ? <CheckSquare size={14} className="text-emerald-400 flex-shrink-0" /> : <Square size={14} className="text-amber-200/30 flex-shrink-0" />}
                        <span className={`${secret.completed ? 'line-through text-amber-200/30' : 'text-amber-200/60'}`}>{secret.text}</span>
                      </button>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-800/20 text-amber-300/50 border border-amber-500/15 flex-shrink-0">SECRET</span>
                    </div>
                  );
                })}
                {/* Unrevealed secret objectives — DM toggle */}
                {(quest.secret_objectives || []).map((secret, si) => {
                  if (secret.revealed) return null;
                  return (
                    <div key={`hidden-${si}`} className="flex items-center gap-2">
                      <button onClick={() => toggleSecretObjective(quest, si)} className="flex items-center gap-2 w-full text-left text-xs group" title="Click to reveal this secret objective">
                        <EyeOff size={13} className="text-amber-200/15 group-hover:text-amber-200/40 flex-shrink-0" />
                        <span className="text-amber-200/15 italic group-hover:text-amber-200/30">Hidden objective — click to reveal</span>
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-amber-200/40 mb-1">
                  <span>{doneItems}/{totalItems} objectives</span>
                  <span>{Math.round(progressPct)}%</span>
                </div>
                <div className="hp-bar-container" style={{height: '6px'}} role="progressbar" aria-valuenow={doneItems} aria-valuemin={0} aria-valuemax={totalItems}>
                  <div className="hp-bar-fill hp-high" style={{width: `${progressPct}%`}} />
                </div>
              </div>
            </div>
          );
        })()}

        {/* Expanded details */}
        {isExpanded && (
          <div className="mt-3 space-y-2">
            {/* Session notes timeline */}
            {(quest.session_notes || []).length > 0 && (
              <div className="border-t border-amber-200/5 pt-2">
                <span className="text-[10px] text-amber-200/25 uppercase tracking-wider">Session Notes</span>
                <div className="mt-2 relative">
                  {/* Timeline line */}
                  <div className="absolute left-[5px] top-2 bottom-2 w-px bg-amber-200/10" />
                  <div className="space-y-2">
                    {quest.session_notes.map((note, i) => {
                      const label = note.label || `${note.date}`;
                      return (
                        <div key={i} className="flex items-start gap-3 relative">
                          <div className="w-[11px] h-[11px] rounded-full bg-amber-800/40 border-2 border-amber-500/30 flex-shrink-0 mt-0.5 z-10" />
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] text-amber-300/40 font-mono">[{label}]</span>
                            <p className="text-xs text-amber-200/50 mt-0.5">{note.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Markdown notes */}
            {quest.notes_text && (
              <div className="text-xs text-amber-200/30 [&_.wmde-markdown]:!bg-transparent [&_.wmde-markdown]:!text-amber-200/30 [&_.wmde-markdown]:!font-sans [&_.wmde-markdown]:!text-xs border-t border-amber-200/5 pt-2" data-color-mode="dark">
                <MDEditor.Markdown source={quest.notes_text} />
              </div>
            )}

            {/* Related NPCs */}
            {(() => {
              const related = getRelatedNPCs(quest);
              if (related.length === 0) return null;
              return (
                <div className="pt-2 border-t border-amber-200/5">
                  <span className="text-[10px] text-amber-200/25 uppercase tracking-wider">Related NPCs</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {related.map(npc => (
                      <span key={npc.id} className="text-[11px] px-2 py-0.5 rounded-full bg-blue-800/25 text-blue-300/80 border border-blue-500/20">
                        {npc.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Collapsed: show note preview and related NPCs inline */}
        {!isExpanded && (
          <>
            {quest.notes_text && (
              <div className="mt-2 text-xs text-amber-200/30 [&_.wmde-markdown]:!bg-transparent [&_.wmde-markdown]:!text-amber-200/30 [&_.wmde-markdown]:!font-sans [&_.wmde-markdown]:!text-xs line-clamp-2" data-color-mode="dark">
                <MDEditor.Markdown source={quest.notes_text} />
              </div>
            )}
            {(() => {
              const related = getRelatedNPCs(quest);
              if (related.length === 0) return null;
              return (
                <div className="mt-2 pt-2 border-t border-amber-200/5">
                  <span className="text-[10px] text-amber-200/25 uppercase tracking-wider">Related NPCs</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {related.map(npc => (
                      <span key={npc.id} className="text-[11px] px-2 py-0.5 rounded-full bg-blue-800/25 text-blue-300/80 border border-blue-500/20">
                        {npc.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}
          </>
        )}
      </div>
    );
  };

  const QuestSection = ({ title, titleClass, quests: sectionQuests, wrapperClass }) => {
    if (sectionQuests.length === 0) return null;
    return (
      <div>
        <h3 className={`font-display mb-3 ${titleClass}`}>{title}</h3>
        <div className={`space-y-3 ${wrapperClass || ''}`}>
          {sectionQuests.map(q => <QuestCard key={q.id} quest={q} />)}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-none">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display text-amber-100 flex items-center gap-2">
          <Map size={20} />
          <div>
            <span>Quests & Objectives</span>
            <p className="text-xs text-amber-200/40 font-normal mt-0.5">Track your active quests, objectives, and rewards. Check off goals as you complete them and keep session notes on progress.</p>
          </div>
        </h2>
        {isDM && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setEditing(null); setQuickGenData(generateRandomQuest()); setShowForm(true); }}
              className="text-xs flex items-center gap-1"
              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(74,222,128,0.25)', background: 'rgba(74,222,128,0.08)', color: '#4ade80', fontFamily: 'var(--font-heading)', letterSpacing: '0.04em', cursor: 'pointer' }}
              title="Generate a random quest with title, type, and objectives"
            >
              <Shuffle size={12} /> Quick Generate
            </button>
            <button onClick={() => { setEditing(null); setQuickGenData(null); setShowForm(true); }} className="btn-primary text-xs flex items-center gap-1">
              <Plus size={12} /> New Quest
            </button>
          </div>
        )}
      </div>

      {/* Reward Summary Bar */}
      {(rewardSummary.totalXP > 0 || rewardSummary.totalGold > 0) && (
        <div className="flex items-center gap-4 bg-amber-900/10 border border-amber-500/15 rounded-lg px-4 py-2">
          <span className="text-xs text-amber-200/40">Active Quest Rewards:</span>
          {rewardSummary.totalXP > 0 && (
            <span className="text-xs text-amber-200/60 flex items-center gap-1">
              <Star size={12} className="text-yellow-400" /> {rewardSummary.totalXP.toLocaleString()} XP
            </span>
          )}
          {rewardSummary.totalGold > 0 && (
            <span className="text-xs text-amber-200/60 flex items-center gap-1">
              <Coins size={12} className="text-yellow-500" /> {rewardSummary.totalGold.toLocaleString()} GP
            </span>
          )}
        </div>
      )}

      {/* Filters & Sort */}
      <div className="space-y-2">
        {/* Quest type filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-amber-200/40">Type:</span>
          {['all', ...QUEST_TYPES].map(t => {
            const style = t !== 'all' ? QUEST_TYPE_STYLES[t] : null;
            const FilterIcon = style ? style.icon : null;
            return (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`text-xs px-2.5 py-1 rounded flex items-center gap-1 ${typeFilter === t ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-amber-200/5 text-amber-200/40 border border-amber-200/10'}`}>
                {FilterIcon && <FilterIcon size={11} />}
                {t === 'all' ? 'All' : t}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-amber-200/40">Sort:</span>
          {[['status', 'Active First'], ['name', 'Name A-Z'], ['progress', 'Progress %'], ['priority', 'Priority'], ['type', 'Type']].map(([key, label]) => (
            <button key={key} onClick={() => setSortBy(key)}
              className={`text-xs px-2.5 py-1 rounded ${sortBy === key ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-amber-200/5 text-amber-200/40 border border-amber-200/10'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <QuestSection title="Active Quests" titleClass="text-amber-100/70" quests={active} />
      <QuestSection title="Completed" titleClass="text-amber-100/40" quests={completed} wrapperClass="opacity-60" />
      <QuestSection title="Failed" titleClass="text-red-400/60" quests={failed} wrapperClass="opacity-50" />

      {quests.length === 0 && (
        <div className="card border-dashed border-amber-200/10 text-center py-12">
          <Map size={32} className="mx-auto text-amber-200/15 mb-3" />
          <p className="text-sm text-amber-200/30 mb-1">No quests yet — add your first quest objective</p>
          <p className="text-xs text-amber-200/20">When your DM gives you a mission or you discover a goal, track it here</p>
        </div>
      )}

      {showForm && (
        <QuestForm quest={editing} initialData={quickGenData} onSubmit={handleSave} onCancel={() => { setShowForm(false); setEditing(null); setQuickGenData(null); }} />
      )}

      {/* Session Note Modal */}
      {sessionNoteQuest && (
        <SessionNoteModal quest={sessionNoteQuest} onSubmit={(text) => { addSessionNote(sessionNoteQuest, text); setSessionNoteQuest(null); }} onCancel={() => setSessionNoteQuest(null)} />
      )}

      <ConfirmDialog
        show={!!confirmDelete}
        title="Delete Quest?"
        message={`Remove "${confirmDelete?.title}" and all its objectives? This cannot be undone.`}
        onConfirm={() => handleDelete(confirmDelete.id)}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}

function SessionNoteModal({ quest, onSubmit, onCancel }) {
  const [text, setText] = useState('');
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <ModalPortal><div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="bg-[#14121c] border border-gold/30 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="font-display text-lg text-amber-100 mb-2">Add Session Note</h3>
        <p className="text-xs text-amber-200/40 mb-3">for "{quest.title}" — {new Date().toISOString().split('T')[0]}</p>
        <textarea className="input w-full h-24 resize-none" placeholder="What happened with this quest this session?" value={text} onChange={e => setText(e.target.value)} autoFocus
          onKeyDown={e => { if (e.ctrlKey && e.key === 'Enter' && text.trim()) { e.preventDefault(); onSubmit(text.trim()); } }} />
        <div className="flex gap-3 justify-end mt-4">
          <span className="text-xs text-amber-200/30 self-center mr-auto">Ctrl+Enter to save</span>
          <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
          <button onClick={() => text.trim() && onSubmit(text.trim())} className="btn-primary text-sm" disabled={!text.trim()}>Add Note</button>
        </div>
      </div>
      </div>
    </ModalPortal>
  );
}

function QuestForm({ quest, initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => {
    if (quest) return { ...quest, objectives: quest.objectives || [], secret_objectives: quest.secret_objectives || [] };
    if (initialData) return { ...initialData, objectives: initialData.objectives || [], secret_objectives: initialData.secret_objectives || [] };
    return {
      title: '', quest_giver: '', description: '', status: 'active', difficulty: '',
      notes_text: '', objectives: [], priority: '', xp_reward: '', gold_reward: '',
      item_rewards: '', location: '', quest_type: '', timeline: [{ stage: 'received', date: new Date().toISOString().split('T')[0] }],
      session_notes: [], rewards_received: false, sub_objectives: {}, secret_objectives: [], session_counter: 0,
    };
  });
  const [newObj, setNewObj] = useState('');
  const [newSubObj, setNewSubObj] = useState({});
  const [newSecretObj, setNewSecretObj] = useState('');
  const [titleError, setTitleError] = useState(false);
  const update = (f, v) => {
    if (f === 'title') setTitleError(false);
    setForm(prev => ({ ...prev, [f]: v }));
  };
  const handleSubmit = () => {
    if (!form.title.trim()) { setTitleError(true); return; }
    onSubmit(form);
  };

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  const addObjective = () => {
    if (!newObj.trim()) return;
    update('objectives', [...form.objectives, { text: newObj.trim(), completed: false }]);
    setNewObj('');
  };

  const removeObjective = (i) => {
    const newObjs = form.objectives.filter((_, idx) => idx !== i);
    const newSubObjs = { ...form.sub_objectives };
    delete newSubObjs[`${i}`];
    // Reindex sub_objectives
    const reindexed = {};
    newObjs.forEach((_, ni) => {
      const oldIdx = ni >= i ? ni + 1 : ni;
      if (newSubObjs[`${oldIdx}`]) reindexed[`${ni}`] = newSubObjs[`${oldIdx}`];
      else if (ni < i && newSubObjs[`${ni}`]) reindexed[`${ni}`] = newSubObjs[`${ni}`];
    });
    setForm(prev => ({ ...prev, objectives: newObjs, sub_objectives: reindexed }));
  };

  const addSubObjective = (objIdx) => {
    const text = (newSubObj[objIdx] || '').trim();
    if (!text) return;
    const subs = { ...form.sub_objectives };
    subs[`${objIdx}`] = [...(subs[`${objIdx}`] || []), { text, completed: false }];
    update('sub_objectives', subs);
    setNewSubObj(prev => ({ ...prev, [objIdx]: '' }));
  };

  const removeSubObjective = (objIdx, subIdx) => {
    const subs = { ...form.sub_objectives };
    subs[`${objIdx}`] = (subs[`${objIdx}`] || []).filter((_, i) => i !== subIdx);
    update('sub_objectives', subs);
  };

  const addSecretObjective = () => {
    if (!newSecretObj.trim()) return;
    update('secret_objectives', [...(form.secret_objectives || []), { text: newSecretObj.trim(), completed: false, revealed: false }]);
    setNewSecretObj('');
  };

  const removeSecretObjective = (i) => {
    update('secret_objectives', (form.secret_objectives || []).filter((_, idx) => idx !== i));
  };

  return (
    <ModalPortal>
      <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="bg-[#14121c] border border-gold/30 rounded-lg p-5 w-full mx-4" style={{ maxWidth: '720px', display: 'flex', flexDirection: 'column' }}>
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <h3 className="font-display text-lg text-amber-100">{quest ? 'Edit Quest' : 'New Quest'}</h3>
          <div className="flex gap-2">
            <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
            <button onClick={handleSubmit} className="btn-primary text-sm">{quest ? 'Save' : 'Add'}</button>
          </div>
        </div>
        <div className="space-y-2 overflow-y-auto flex-1" style={{ minHeight: 0 }}>
          <input className={`input w-full ${titleError ? 'border-red-500' : ''}`} placeholder="Quest title" value={form.title} onChange={e => update('title', e.target.value)} autoFocus />

          {!quest && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-amber-200/30 whitespace-nowrap">Quick template:</span>
              <div className="flex gap-1 flex-wrap">
                {QUEST_TEMPLATES.map(t => (
                  <button key={t.label} type="button" onClick={() => {
                    setForm(prev => ({ ...prev, quest_type: t.quest_type, description: t.description, objectives: t.objectives, difficulty: t.difficulty }));
                  }}
                    className="text-[10px] px-2 py-0.5 rounded bg-amber-200/5 text-amber-200/30 border border-amber-200/8 hover:bg-amber-200/10 hover:text-amber-200/60 transition-all">
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quest type */}
          <div className="flex items-center gap-1.5">
              <button type="button" onClick={() => update('quest_type', '')}
                className={`text-xs px-2.5 py-1 rounded ${!form.quest_type ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-amber-200/5 text-amber-200/40 border border-amber-200/10'}`}>
                None
              </button>
              {QUEST_TYPES.map(t => {
                const style = QUEST_TYPE_STYLES[t];
                const TypeIcon = style.icon;
                return (
                  <button key={t} type="button" onClick={() => update('quest_type', t)}
                    className={`text-xs px-2.5 py-1 rounded border flex items-center gap-1 ${form.quest_type === t ? `${style.bg} ${style.text} ${style.border}` : 'bg-amber-200/5 text-amber-200/40 border-amber-200/10'}`}>
                    <TypeIcon size={11} /> {t}
                  </button>
                );
              })}
            </div>

          <div className="grid grid-cols-2 gap-3">
            <input className="input w-full" placeholder="Quest giver" value={form.quest_giver || ''} onChange={e => update('quest_giver', e.target.value)} />
            <input className="input w-full" placeholder="Location" value={form.location || ''} onChange={e => update('location', e.target.value)} />
          </div>
          <textarea className="input w-full h-14 resize-none" placeholder="Description" value={form.description} onChange={e => update('description', e.target.value)} />
          <div className="grid grid-cols-3 gap-2">
            <select className="input w-full" value={form.status} onChange={e => update('status', e.target.value)}>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
            <select className="input w-full" value={form.difficulty || ''} onChange={e => update('difficulty', e.target.value)}>
              <option value="">No difficulty</option>
              {DIFFICULTIES.map(d => <option key={d} value={d} className="capitalize">{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
            </select>
            <select className="input w-full" value={form.priority || ''} onChange={e => update('priority', e.target.value)}>
              <option value="">No priority</option>
              {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Rewards */}
          <div className="grid grid-cols-3 gap-2">
            <input className="input w-full" type="number" min="0" placeholder="XP reward" value={form.xp_reward || ''} onChange={e => update('xp_reward', e.target.value)} />
            <input className="input w-full" type="number" min="0" placeholder="Gold reward" value={form.gold_reward || ''} onChange={e => update('gold_reward', e.target.value)} />
            <input className="input w-full" placeholder="Item rewards" value={form.item_rewards || ''} onChange={e => update('item_rewards', e.target.value)} />
          </div>

          {/* Objectives with sub-objectives */}
          <div>
            <label className="label">Objectives</label>
            {form.objectives.map((obj, i) => (
              <div key={`${obj.text}-${i}`} className="mb-2">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm text-amber-200/60 flex-1">{obj.text}</span>
                  <button onClick={() => removeObjective(i)} className="text-red-400/50 hover:text-red-400"><Trash2 size={12} /></button>
                </div>
                {/* Sub-objectives */}
                {((form.sub_objectives || {})[`${i}`] || []).map((sub, si) => (
                  <div key={si} className="flex items-center gap-2 ml-5 mb-0.5">
                    <span className="text-xs text-amber-200/40 flex-1">{sub.text}</span>
                    <button onClick={() => removeSubObjective(i, si)} className="text-red-400/50 hover:text-red-400"><Trash2 size={10} /></button>
                  </div>
                ))}
                <div className="flex gap-2 ml-5 mt-0.5">
                  <input className="input flex-1 text-xs" placeholder="Add sub-objective..." value={newSubObj[i] || ''}
                    onChange={e => setNewSubObj(prev => ({ ...prev, [i]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && addSubObjective(i)} />
                  <button onClick={() => addSubObjective(i)} className="text-xs text-amber-200/40 hover:text-amber-200">+</button>
                </div>
              </div>
            ))}
            <div className="flex gap-2 mt-1">
              <input className="input flex-1 text-sm" placeholder="Add an objective and press Enter" value={newObj}
                onChange={e => setNewObj(e.target.value)} onKeyDown={e => e.key === 'Enter' && addObjective()} />
              <button onClick={addObjective} className="btn-secondary text-xs">Add</button>
            </div>
            <div className="flex gap-1 flex-wrap mt-1">
              {SUGGESTED_OBJECTIVES.filter(s => !form.objectives.some(o => o.text === s)).slice(0, 4).map(s => (
                <button key={s} type="button" onClick={() => update('objectives', [...form.objectives, { text: s, completed: false }])}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200/5 text-amber-200/20 hover:text-amber-200/50 hover:bg-amber-200/10">
                  + {s}
                </button>
              ))}
            </div>
          </div>

          {/* Secret objectives (DM can reveal later) */}
          <div>
            <label className="label flex items-center gap-2">
              <EyeOff size={12} className="text-amber-200/40" />
              Secret Objectives
              <span className="text-[10px] text-amber-200/25 font-normal">(hidden until revealed on the quest card)</span>
            </label>
            {(form.secret_objectives || []).map((secret, i) => (
              <div key={i} className="flex items-center gap-2 mb-1">
                <EyeOff size={12} className="text-amber-200/20 flex-shrink-0" />
                <span className="text-sm text-amber-200/40 flex-1 italic">{secret.text}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${secret.revealed ? 'bg-emerald-800/30 text-emerald-300' : 'bg-amber-800/20 text-amber-200/30'}`}>
                  {secret.revealed ? 'Revealed' : 'Hidden'}
                </span>
                <button onClick={() => removeSecretObjective(i)} className="text-red-400/50 hover:text-red-400"><Trash2 size={12} /></button>
              </div>
            ))}
            <div className="flex gap-2 mt-1">
              <input className="input flex-1 text-sm" placeholder="Add a secret objective..." value={newSecretObj}
                onChange={e => setNewSecretObj(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSecretObjective()} />
              <button onClick={addSecretObjective} className="btn-secondary text-xs">Add</button>
            </div>
          </div>

          <div data-color-mode="dark">
            <label className="label">Notes</label>
            <MDEditor value={form.notes_text} onChange={v => update('notes_text', v || '')} height={80} preview="edit" />
          </div>
        </div>
      </div>
      </div>
    </ModalPortal>
  );
}
