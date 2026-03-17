import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Trash2, Edit2, Globe, Search, MapPin, Users, Star, Clock, Sparkles, Bug, Package, Tag, Link, Shield, BookOpen, Eye, HelpCircle, MessageCircle, XCircle, ChevronDown, ChevronRight, Sun, ScrollText, Hash, Shuffle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import MDEditor from '@uiw/react-md-editor';
import { invoke } from '@tauri-apps/api/core';
import { getLoreNotes, addLoreNote, updateLoreNote, deleteLoreNote } from '../api/lore';
import { getNPCs } from '../api/npcs';
import { getQuests } from '../api/quests';
import ConfirmDialog from '../components/ConfirmDialog';
import ModalPortal from '../components/ModalPortal';
import { useAppMode } from '../contexts/ModeContext';

const CATEGORY_PRESETS = [
  { label: 'Location', icon: MapPin, color: 'bg-blue-800/30 text-blue-300 border-blue-500/30', borderLeft: 'border-l-blue-400' },
  { label: 'History', icon: ScrollText, color: 'bg-amber-800/30 text-amber-300 border-amber-500/30', borderLeft: 'border-l-amber-400' },
  { label: 'Religion', icon: Sun, color: 'bg-yellow-800/30 text-yellow-300 border-yellow-500/30', borderLeft: 'border-l-yellow-400' },
  { label: 'Organization', icon: Users, color: 'bg-emerald-800/30 text-emerald-300 border-emerald-500/30', borderLeft: 'border-l-emerald-400' },
  { label: 'Magic', icon: Sparkles, color: 'bg-purple-800/30 text-purple-300 border-purple-500/30', borderLeft: 'border-l-purple-400' },
  { label: 'Faction', icon: Shield, color: 'bg-rose-800/30 text-rose-300 border-rose-500/30', borderLeft: 'border-l-rose-400' },
  { label: 'Creature', icon: Bug, color: 'bg-red-800/30 text-red-300 border-red-500/30', borderLeft: 'border-l-red-400' },
  { label: 'Item', icon: Package, color: 'bg-cyan-800/30 text-cyan-300 border-cyan-500/30', borderLeft: 'border-l-cyan-400' },
  { label: 'Other', icon: BookOpen, color: 'bg-gray-800/30 text-gray-300 border-gray-500/30', borderLeft: 'border-l-gray-400' },
];

const LOCATION_SUGGESTIONS = ['The Rusty Anchor Tavern', 'Shadowfell Gate', 'Silvermine Pass', 'The Whispering Woods', 'Dragonspire Peak', 'The Sunken Temple', 'Ravenhollow Village', 'The Crimson Market'];
const LORE_TEMPLATES = [
  { label: 'Tavern / Inn', category: 'Location', title: '', body: '**Type:** Tavern / Inn\n**Owner:** \n**Notable features:** \n**Atmosphere:** \n**Menu specials:** \n**Rumors heard here:**' },
  { label: 'Town / City', category: 'Location', title: '', body: '**Population:** \n**Government:** \n**Notable landmarks:** \n**Economy:** \n**Dangers:** \n**Key NPCs:**' },
  { label: 'Dungeon', category: 'Location', title: '', body: '**Entrance:** \n**Levels/Rooms:** \n**Known hazards:** \n**Inhabitants:** \n**Treasure:** \n**History:**' },
  { label: 'Faction', category: 'Organization', title: '', body: '**Leader:** \n**Goals:** \n**Members:** \n**Headquarters:** \n**Allies:** \n**Enemies:** \n**Reputation:**' },
  { label: 'Legend / Myth', category: 'History', title: '', body: '**Origin:** \n**Key figures:** \n**What happened:** \n**Evidence:** \n**Current relevance:**' },
  { label: 'Magic Item', category: 'Item', title: '', body: '**Rarity:** \n**Type:** \n**Properties:** \n**History:** \n**Current location:**\n**Attunement:**' },
];

const QUICK_LORE_TITLES = {
  Location: ['The Sunken Temple', 'Ravenhollow Village', 'Dragonspire Peak', 'The Crimson Market', 'Thornwall Keep', 'The Whispering Caverns'],
  History: ['The Fall of the Old Kingdom', 'The Dragon Wars', 'The Great Betrayal', 'The Founding of the Realm', 'The Age of Shadows'],
  Religion: ['The Order of the Silver Flame', 'The Moon Goddess', 'The Cult of the Void', 'The Temple of Dawn', 'The Old Gods'],
  Organization: ['The Merchants Guild', 'The Shadow Council', 'The Arcane College', 'The Iron Guard', 'The Wayfinders'],
  Faction: ['The Black Thorns', 'The Emerald Enclave', 'The Red Hand', 'The Silent Pact', 'The Order of Whispers'],
  Creature: ['The Forest Warden', 'The Deepwater Leviathan', 'The Shadow Stalker', 'The Crystal Drake', 'The Bog Witch'],
  Magic: ['The Ley Lines', 'The Weave Disruption', 'Wild Magic Zones', 'The Arcane Wellspring', 'The Binding Ritual'],
  Item: ['The Blade of the First King', 'The Amulet of Warding', 'The Staff of Seasons', 'The Cloak of Many Faces'],
};

// Rich body content generators per category for quick generate
const LORE_BODY_GENERATORS = {
  Location: () => {
    const owners = ['Marta Copperkettle', 'Old Brann', 'Duchess Elara', 'The Ironworkers\' Guild', 'nobody — it\'s been abandoned', 'a reclusive mage', 'the town council'];
    const features = ['a centuries-old oak growing through the floor', 'walls covered in faded murals depicting a great battle', 'an underground spring with supposed healing properties', 'a bell tower that rings on its own during storms', 'hidden passageways behind the bookshelves', 'scorch marks on the walls from a long-ago fire'];
    const atmospheres = ['Warm and inviting, smells of pipe smoke and roasting meat', 'Cold and drafty, with an uneasy silence', 'Bustling and noisy, every table full of travelers', 'Dimly lit and secretive, conversations held in whispers', 'Ancient and crumbling, but maintained with obvious care'];
    const dangers = ['bandits patrol the roads nearby', 'the lower levels are flooded and home to something large', 'the local wildlife has become unusually aggressive', 'a curse lingers over anyone who stays past midnight', 'a rival faction has agents watching the area'];
    const p = (arr) => arr[Math.floor(Math.random() * arr.length)];
    return `**Controlled by:** ${p(owners)}\n**Notable features:** ${p(features)}\n**Atmosphere:** ${p(atmospheres)}\n**Dangers:** ${p(dangers)}\n**Local rumors:** The locals speak of ${p(['strange lights seen at night', 'a treasure hidden beneath the foundation', 'disappearances that happen every full moon', 'an ancient pact with a fey lord', 'a sealed door that no key can open'])}.`;
  },
  History: () => {
    const eras = ['the Age of Kings', 'the Sundering', 'the First Age', 'the War of Crowns', 'the Age of Silence'];
    const figures = ['a legendary hero', 'a tyrannical archmage', 'twin siblings who founded rival kingdoms', 'a dragon who brokered peace', 'a nameless prophet'];
    const events = ['a great war that reshaped the continent', 'a magical cataclysm that sank an island', 'the forging of a weapon that killed a god', 'a plague that wiped out an entire civilization', 'the sealing of a portal to the Abyss'];
    const evidence = ['ancient stone tablets found in a forgotten library', 'folk songs passed down through generations', 'a map that shows lands that no longer exist', 'contradictory accounts from two surviving texts'];
    const p = (arr) => arr[Math.floor(Math.random() * arr.length)];
    return `**Era:** ${p(eras)}\n**Key figures:** ${p(figures)}\n**What happened:** ${p(events)}\n**Evidence:** ${p(evidence)}\n**Current relevance:** ${p(['echoes of these events are being felt again', 'a descendant of the key figure has recently surfaced', 'the sealed threat may be weakening', 'scholars disagree on what really happened — the truth matters now'])}.`;
  },
  Organization: () => {
    const leaders = ['a charismatic half-elf diplomat', 'an aging dwarf general', 'a council of three masked figures', 'a young prodigy who seized control', 'a figurehead — the real leader is unknown'];
    const goals = ['expand trade routes across the continent', 'acquire ancient magical knowledge', 'overthrow the current ruling class', 'protect the realm from extraplanar threats', 'monopolize a critical resource'];
    const reputations = ['feared and respected in equal measure', 'beloved by the common folk', 'seen as corrupt by outsiders', 'mysterious — few know they even exist', 'once noble, now fallen from grace'];
    const p = (arr) => arr[Math.floor(Math.random() * arr.length)];
    return `**Leader:** ${p(leaders)}\n**Goals:** ${p(goals)}\n**Size:** ${p(['a handful of trusted operatives', 'several hundred members across the region', 'thousands, with cells in every major city', 'unknown — they recruit in secret'])}\n**Headquarters:** ${p(['a fortified keep on the border', 'hidden beneath a popular tavern', 'a floating citadel', 'constantly moving — no fixed location'])}\n**Reputation:** ${p(reputations)}`;
  },
  Faction: () => {
    const leaders = ['a ruthless spymaster', 'a reformed criminal', 'an elected council of veterans', 'a tiefling warlock with a silver tongue'];
    const goals = ['seize control of the city\'s underworld', 'expose corruption in the nobility', 'defend a sacred site from desecration', 'broker peace between warring nations'];
    const p = (arr) => arr[Math.floor(Math.random() * arr.length)];
    return `**Leader:** ${p(leaders)}\n**Goals:** ${p(goals)}\n**Allies:** ${p(['the merchant class', 'a neighboring kingdom', 'a rogue dragon', 'disillusioned soldiers'])}\n**Enemies:** ${p(['the crown', 'a rival faction', 'the church', 'an invading army'])}\n**Recruitment:** ${p(['by invitation only', 'anyone willing to take the oath', 'through a series of dangerous trials', 'bloodline members only'])}`;
  },
  Religion: () => {
    const domains = ['light and healing', 'death and rebirth', 'nature and the wild', 'knowledge and secrets', 'war and valor'];
    const p = (arr) => arr[Math.floor(Math.random() * arr.length)];
    return `**Domain:** ${p(domains)}\n**Worshippers:** ${p(['common folk seeking protection', 'scholars and mages', 'soldiers and warriors', 'outcasts and the desperate', 'royalty and nobility'])}\n**Holy site:** ${p(['a mountaintop temple', 'a grove of ancient trees', 'a cathedral in the capital', 'the site of a great miracle', 'a hidden underground shrine'])}\n**Tenets:** ${p(['protect the weak', 'seek knowledge at any cost', 'balance must be maintained', 'only the strong deserve to lead', 'all debts must be paid'])}\n**Current conflict:** ${p(['a schism has split the faithful', 'the deity has gone silent', 'a rival religion is gaining followers', 'a heretical cult threatens the order'])}`;
  },
  Creature: () => {
    const habitats = ['the deep forest', 'mountain caves', 'swamp ruins', 'the underdark', 'coastal cliffs'];
    const behaviors = ['territorial but not aggressive unless provoked', 'actively hunts intelligent prey', 'guards a sacred site', 'has been displaced from its home', 'is being controlled by a more powerful entity'];
    const p = (arr) => arr[Math.floor(Math.random() * arr.length)];
    return `**Habitat:** ${p(habitats)}\n**Behavior:** ${p(behaviors)}\n**Threat level:** ${p(['minor nuisance', 'dangerous to travelers', 'regional threat', 'existential danger to nearby settlements'])}\n**Distinguishing features:** ${p(['unusual coloring', 'scarred from a previous battle', 'larger than normal for its kind', 'displays surprising intelligence', 'leaves a trail of frost/fire/decay'])}\n**Local knowledge:** ${p(['the creature has been sighted for generations', 'it appeared only recently after an earthquake', 'hunters have tried and failed to kill it', 'a local druid claims it can be reasoned with'])}`;
  },
  Magic: () => {
    const p = (arr) => arr[Math.floor(Math.random() * arr.length)];
    return `**Type:** ${p(['arcane phenomenon', 'divine manifestation', 'planar bleed-through', 'ancient ward', 'wild magic surge'])}\n**Effect:** ${p(['spells behave unpredictably in the area', 'the boundary between planes is thin', 'magic is amplified to dangerous levels', 'divination magic is blocked entirely', 'the dead do not stay dead'])}\n**Cause:** ${p(['unknown — scholars are still investigating', 'a failed ritual centuries ago', 'the death of a powerful being', 'a ley line intersection', 'deliberate sabotage by an enemy mage'])}\n**Danger:** ${p(['minimal if you know the rules', 'moderate — avoid casting within the zone', 'severe — reality itself is unstable', 'catastrophic — the effect is spreading'])}`;
  },
  Item: () => {
    const rarities = ['Uncommon', 'Rare', 'Very Rare', 'Legendary'];
    const types = ['Weapon', 'Armor', 'Wondrous Item', 'Staff', 'Ring', 'Amulet'];
    const p = (arr) => arr[Math.floor(Math.random() * arr.length)];
    return `**Rarity:** ${p(rarities)}\n**Type:** ${p(types)}\n**Properties:** ${p(['+1 to attack and damage, glows near undead', 'grants resistance to fire, warm to the touch', 'allows the bearer to cast one spell per day', 'grants advantage on Stealth checks in dim light', 'deals extra radiant damage on critical hits'])}\n**History:** ${p(['forged by a master smith for a legendary hero', 'stolen from a dragon\'s hoard three centuries ago', 'created during the Age of Kings as a symbol of authority', 'the last work of a dying artificer', 'its origins are unknown — it simply appeared one day'])}\n**Attunement:** ${p(['Required', 'Not required', 'Required (by a spellcaster)', 'Required (by a good-aligned creature)'])}`;
  },
};

function generateRandomLoreNote() {
  const template = LORE_TEMPLATES[Math.floor(Math.random() * LORE_TEMPLATES.length)];
  const category = template.category;
  const titles = QUICK_LORE_TITLES[category] || QUICK_LORE_TITLES.Location;
  const title = titles[Math.floor(Math.random() * titles.length)];
  const discoveryType = ['Confirmed', 'Rumor', 'Speculation'][Math.floor(Math.random() * 3)];

  // Use the rich body generator if available, otherwise fall back to template
  const bodyGen = LORE_BODY_GENERATORS[category];
  const body = bodyGen ? bodyGen() : template.body;

  const sourceNpcs = ['A traveling bard', 'Old Theron the sage', 'A dying soldier', 'Ancient texts in the library', 'A cryptic vision', 'Local tavern gossip', 'A prisoner\'s confession', 'The town crier'];
  const sourceNpc = sourceNpcs[Math.floor(Math.random() * sourceNpcs.length)];

  return {
    title,
    category,
    body,
    related_to_text: '',
    discovery_type: discoveryType,
    source_npc: sourceNpc,
    source_date: new Date().toISOString().split('T')[0],
    session_number: '',
    linked_entries: [],
  };
}

const DISCOVERY_TYPES = ['Confirmed', 'Rumor', 'Speculation', 'Debunked'];
const DISCOVERY_STYLES = {
  Confirmed: { bg: 'bg-emerald-800/30', text: 'text-emerald-300', border: 'border-emerald-500/30', icon: Eye, cardBg: '' },
  Rumor: { bg: 'bg-amber-800/30', text: 'text-amber-300', border: 'border-amber-500/30', icon: HelpCircle, cardBg: 'bg-amber-900/5' },
  Speculation: { bg: 'bg-orange-800/30', text: 'text-orange-300', border: 'border-orange-500/30', icon: MessageCircle, cardBg: 'bg-orange-900/5' },
  Debunked: { bg: 'bg-red-800/30', text: 'text-red-300', border: 'border-red-500/30', icon: XCircle, cardBg: 'bg-red-900/5' },
};

function getCategoryPreset(category) {
  if (!category) return null;
  const lower = category.toLowerCase();
  return CATEGORY_PRESETS.find(p => {
    const pl = p.label.toLowerCase();
    if (pl === lower) return true;
    if (lower.endsWith('s') && lower.slice(0, -1) === pl) return true;
    if (pl === 'religion' && (lower === 'deity' || lower === 'deities' || lower === 'god' || lower === 'gods')) return true;
    if (pl === 'history' && lower === 'historical') return true;
    if (pl === 'magic' && (lower === 'magical' || lower === 'arcane')) return true;
    if (pl === 'creature' && (lower === 'monsters' || lower === 'monster')) return true;
    if (pl === 'item' && (lower === 'artifact' || lower === 'artifacts')) return true;
    return false;
  }) || CATEGORY_PRESETS.find(p => p.label === 'Other');
}

function getCategoryIcon(category) {
  const preset = getCategoryPreset(category);
  return preset ? preset.icon : BookOpen;
}

function getCategoryColor(category) {
  const preset = getCategoryPreset(category);
  return preset ? preset.color : 'bg-gray-800/30 text-gray-300 border-gray-500/30';
}

function getCategoryBorderLeft(category) {
  const preset = getCategoryPreset(category);
  return preset ? preset.borderLeft : 'border-l-gray-400';
}

function formatRelativeTime(isoString) {
  if (!isoString) return null;
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch { return null; }
}

// Pack extra lore data into related_to as JSON
function packLoreExtra(data) {
  return JSON.stringify({
    _v: 3,
    related_to_text: data.related_to_text || '',
    discovery_type: data.discovery_type || '',
    source_npc: data.source_npc || '',
    source_date: data.source_date || '',
    session_number: data.session_number || '',
    linked_entries: data.linked_entries || [],
  });
}

function unpackLoreExtra(relatedToStr) {
  const defaults = { related_to_text: '', discovery_type: '', source_npc: '', source_date: '', session_number: '', linked_entries: [] };
  if (!relatedToStr) return defaults;
  try {
    const parsed = JSON.parse(relatedToStr);
    if (parsed._v) return { ...defaults, ...parsed };
  } catch { /* legacy plain text */ }
  return { ...defaults, related_to_text: relatedToStr };
}

function enrichLore(note) {
  const extra = unpackLoreExtra(note.related_to);
  return {
    ...note,
    related_to_text: extra.related_to_text || '',
    discovery_type: extra.discovery_type || '',
    source_npc: extra.source_npc || '',
    source_date: extra.source_date || '',
    session_number: extra.session_number || '',
    linked_entries: extra.linked_entries || [],
  };
}

function prepareLorePayload(form) {
  const related_to = packLoreExtra(form);
  return {
    title: form.title,
    category: form.category || '',
    body: form.body || '',
    related_to,
  };
}

export default function Lore({ characterId }) {
  const { mode: appMode } = useAppMode();
  const isDM = appMode === 'dm';
  const [notes, setNotes] = useState([]);
  const [npcs, setNpcs] = useState([]);
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [quickGenData, setQuickGenData] = useState(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [discoveryFilter, setDiscoveryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid | wiki
  const [expandedNote, setExpandedNote] = useState(null);
  const [hoveredNote, setHoveredNote] = useState(null);

  const load = async () => {
    try { setNotes((await getLoreNotes(characterId)).map(enrichLore)); }
    catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const loadCrossRefs = async () => {
    try { setNpcs(await getNPCs(characterId)); } catch (err) { if (import.meta.env.DEV) console.warn('Lore cross-ref NPCs:', err); }
    try { setQuests(await getQuests(characterId)); } catch (err) { if (import.meta.env.DEV) console.warn('Lore cross-ref quests:', err); }
  };

  useEffect(() => { load(); loadCrossRefs(); }, [characterId]);

  // NPC name set for quick lookups
  const npcNameSet = useMemo(() => new Set(npcs.map(n => (n.name || '').toLowerCase())), [npcs]);

  const getLoreReferences = (note) => {
    const text = [note.related_to_text || '', note.body || '', note.title || ''].join(' ').toLowerCase();
    const matchedNPCs = npcs.filter(npc => npc.name && text.includes(npc.name.toLowerCase()));
    const matchedQuests = quests.filter(q => q.title && text.includes(q.title.toLowerCase()));
    return { matchedNPCs, matchedQuests };
  };

  // Bidirectional linked lore: if A links B, also show A on B's card
  const getLinkedLoreEntries = useCallback((note) => {
    const directLinked = (note.linked_entries || []);
    const reverseLinked = notes
      .filter(n => n.id !== note.id && (n.linked_entries || []).includes(note.id))
      .map(n => n.id);
    const allLinkedIds = [...new Set([...directLinked, ...reverseLinked])];
    if (allLinkedIds.length === 0) return [];
    return notes.filter(n => allLinkedIds.includes(n.id) && n.id !== note.id);
  }, [notes]);

  const handleSave = async (formData) => {
    try {
      const payload = prepareLorePayload(formData);
      if (editing) {
        await updateLoreNote(characterId, editing.id, payload);
        toast.success('Note updated');
      } else {
        await addLoreNote(characterId, payload);
        toast.success('Note added');
      }
      setShowForm(false);
      setEditing(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteLoreNote(characterId, id);
      toast.success('Note removed');
      setConfirmDelete(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  // Cycle discovery status on click
  const cycleDiscoveryStatus = async (note) => {
    const currentIdx = DISCOVERY_TYPES.indexOf(note.discovery_type);
    const nextIdx = (currentIdx + 1) % (DISCOVERY_TYPES.length + 1);
    const nextStatus = nextIdx >= DISCOVERY_TYPES.length ? '' : DISCOVERY_TYPES[nextIdx];
    const updated = { ...note, discovery_type: nextStatus };
    try {
      await updateLoreNote(characterId, note.id, prepareLorePayload(updated));
      load();
      toast.success(nextStatus ? `Marked as ${nextStatus}` : 'Status cleared');
    } catch (err) { toast.error(err.message); }
  };

  const categories = useMemo(() => [...new Set(notes.map(n => n.category).filter(Boolean))], [notes]);

  const filtered = useMemo(() => notes.filter(n => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!(n.title || '').toLowerCase().includes(q) && !(n.body || '').toLowerCase().includes(q) && !(n.category || '').toLowerCase().includes(q) && !(n.related_to_text || '').toLowerCase().includes(q) && !(n.source_npc || '').toLowerCase().includes(q) && !(n.session_number || '').toString().includes(q)) return false;
    }
    if (categoryFilter !== 'all' && (n.category || '') !== categoryFilter) return false;
    if (discoveryFilter !== 'all' && (n.discovery_type || '') !== discoveryFilter) return false;
    return true;
  }), [notes, searchQuery, categoryFilter, discoveryFilter]);

  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    if (sortBy === 'name') return (a.title || '').localeCompare(b.title || '');
    if (sortBy === 'category') return (a.category || '').localeCompare(b.category || '');
    if (sortBy === 'recent') return (b.updated_at || b.created_at || '').localeCompare(a.updated_at || a.created_at || '');
    if (sortBy === 'discovery') {
      const order = { Confirmed: 0, Rumor: 1, Speculation: 2, Debunked: 3 };
      return (order[a.discovery_type] ?? 9) - (order[b.discovery_type] ?? 9);
    }
    return 0;
  }), [filtered, sortBy]);

  // Group by category for wiki view
  const groupedByCategory = useMemo(() => {
    const groups = {};
    sorted.forEach(note => {
      const cat = note.category || 'Uncategorized';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(note);
    });
    return groups;
  }, [sorted]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    notes.forEach(n => {
      const cat = n.category || 'Uncategorized';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [notes]);

  const discoveryCounts = useMemo(() => {
    const counts = {};
    notes.forEach(n => {
      if (n.discovery_type) {
        counts[n.discovery_type] = (counts[n.discovery_type] || 0) + 1;
      }
    });
    return counts;
  }, [notes]);

  if (loading) return (
    <div className="flex items-center justify-center gap-2 py-12 text-amber-200/40">
      <Loader2 size={18} className="animate-spin" />
      <span>Loading lore...</span>
    </div>
  );

  const LoreCard = ({ note, isWikiView }) => {
    const CatIcon = getCategoryIcon(note.category);
    const catColor = getCategoryColor(note.category);
    const borderLeftColor = getCategoryBorderLeft(note.category);
    const discStyle = DISCOVERY_STYLES[note.discovery_type] || null;
    const DiscIcon = discStyle?.icon;
    const isExpanded = expandedNote === note.id;
    const isDebunked = note.discovery_type === 'Debunked';
    const isRumorOrSpec = note.discovery_type === 'Rumor' || note.discovery_type === 'Speculation';
    const isHovered = hoveredNote === note.id;
    const sourceIsNpc = note.source_npc && npcNameSet.has(note.source_npc.toLowerCase());

    return (
      <div
        className={`card card-hover-lift border-l-[3px] ${borderLeftColor} relative transition-all duration-200 ${isRumorOrSpec ? 'bg-amber-900/[0.03]' : ''} ${isDebunked ? (discStyle?.cardBg || '') + ' opacity-75' : ''} ${isHovered && !isExpanded ? 'ring-1 ring-amber-200/10' : ''}`}
        onMouseEnter={() => setHoveredNote(note.id)}
        onMouseLeave={() => setHoveredNote(null)}
      >
        {/* Header row */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5">
              <div className={`p-1.5 rounded ${catColor} shrink-0`}>
                <CatIcon size={isWikiView ? 16 : 14} />
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className={`${isWikiView ? 'text-lg' : 'text-base'} font-display cursor-pointer hover:text-gold transition-colors leading-tight ${isDebunked ? 'line-through text-amber-200/40' : 'text-amber-100'}`}
                  onClick={() => setExpandedNote(isExpanded ? null : note.id)}
                >
                  {note.title}
                </h4>
                {/* Source line directly under title */}
                {(note.source_npc || note.source_date || note.session_number) && (
                  <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-amber-200/35">
                    {note.source_npc && (
                      <>
                        <span>Learned from</span>
                        {sourceIsNpc ? (
                          <span className="px-1.5 py-0 rounded bg-blue-800/25 text-blue-300/80 border border-blue-500/20">{note.source_npc}</span>
                        ) : (
                          <span className="text-amber-200/50">{note.source_npc}</span>
                        )}
                      </>
                    )}
                    {note.source_date && (
                      <>
                        {note.source_npc && <span className="text-amber-200/15">|</span>}
                        <span>{note.source_date}</span>
                      </>
                    )}
                    {note.session_number && (
                      <>
                        {(note.source_npc || note.source_date) && <span className="text-amber-200/15">|</span>}
                        <span className="flex items-center gap-0.5"><Hash size={9} />Session {note.session_number}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap ml-9">
              {note.category && <span className={`text-xs px-2 py-0.5 rounded border ${catColor}`}>{note.category}</span>}
              {/* Clickable discovery status badge */}
              {discStyle ? (
                <button
                  onClick={(e) => { e.stopPropagation(); cycleDiscoveryStatus(note); }}
                  title="Click to cycle status"
                  className={`text-xs px-2 py-0.5 rounded border flex items-center gap-1 cursor-pointer hover:brightness-125 transition-all ${discStyle.bg} ${discStyle.text} ${discStyle.border}`}
                >
                  {DiscIcon && <DiscIcon size={10} />}
                  {note.discovery_type}
                </button>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); cycleDiscoveryStatus(note); }}
                  title="Click to set discovery status"
                  className="text-[10px] px-1.5 py-0.5 rounded border border-amber-200/10 text-amber-200/20 hover:text-amber-200/40 hover:border-amber-200/20 transition-all"
                >
                  + status
                </button>
              )}
              {note.body && (() => {
                const words = note.body.trim().split(/\s+/).filter(Boolean).length;
                const mins = Math.ceil(words / 200);
                return <span className="text-[10px] text-amber-200/25">{words} words ~ {mins} min read</span>;
              })()}
            </div>
          </div>
          <div className="flex gap-1 ml-2">
            <button
              onClick={() => setExpandedNote(isExpanded ? null : note.id)}
              className="text-amber-200/30 hover:text-amber-200/60 transition-colors"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {isDM && <button onClick={() => { setEditing(note); setShowForm(true); }} className="text-amber-200/40 hover:text-amber-200"><Edit2 size={14} /></button>}
            {isDM && <button onClick={() => setConfirmDelete(note)} className="text-red-400/50 hover:text-red-400"><Trash2 size={14} /></button>}
          </div>
        </div>

        {note.related_to_text && (
          <div className="flex items-center gap-1.5 mb-2 ml-9">
            <Link size={11} className="text-amber-200/30 shrink-0" />
            <span className="text-xs text-amber-200/40 italic">Related to: <span className="text-amber-200/60">{note.related_to_text}</span></span>
          </div>
        )}

        {/* Body content - collapsible */}
        {note.body && (
          <div className={`text-sm text-amber-200/50 ml-9 ${isExpanded ? '' : 'line-clamp-3'} [&_.wmde-markdown]:!bg-transparent [&_.wmde-markdown]:!text-amber-200/50 [&_.wmde-markdown]:!font-sans [&_.wmde-markdown]:!text-sm`} data-color-mode="dark">
            <MDEditor.Markdown source={note.body} />
          </div>
        )}
        {note.body && note.body.length > 150 && !isExpanded && (
          <button onClick={() => setExpandedNote(note.id)} className="text-xs text-gold/60 hover:text-gold mt-1 ml-9">Read more...</button>
        )}
        {isExpanded && note.body && (
          <button onClick={() => setExpandedNote(null)} className="text-xs text-gold/60 hover:text-gold mt-1 ml-9">Show less</button>
        )}

        {/* Hover quick-preview: show first 2 lines if collapsed and hovered */}
        {isHovered && !isExpanded && !note.body && note.related_to_text && (
          <div className="text-xs text-amber-200/30 ml-9 mt-1 italic">{note.related_to_text}</div>
        )}

        {/* Related Lore section (bidirectional) */}
        {(() => {
          const linked = getLinkedLoreEntries(note);
          if (linked.length === 0) return null;
          return (
            <div className="mt-2 pt-2 border-t border-amber-200/5 ml-9">
              <span className="text-[10px] text-amber-200/25 uppercase tracking-wider">Related Lore</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {linked.map(l => {
                  const LIcon = getCategoryIcon(l.category);
                  const lBorder = getCategoryBorderLeft(l.category);
                  return (
                    <button key={l.id} onClick={() => setExpandedNote(l.id === expandedNote ? null : l.id)}
                      className={`text-[11px] px-2 py-0.5 rounded-full bg-amber-800/20 text-amber-300/70 border border-amber-500/20 flex items-center gap-1 hover:bg-amber-800/30 transition-colors border-l-2 ${lBorder}`}>
                      <LIcon size={9} />
                      {l.title}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Cross-references */}
        {(() => {
          const { matchedNPCs, matchedQuests } = getLoreReferences(note);
          if (matchedNPCs.length === 0 && matchedQuests.length === 0) return null;
          return (
            <div className="mt-2 pt-2 border-t border-amber-200/5 ml-9">
              <span className="text-[10px] text-amber-200/25 uppercase tracking-wider">References</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {matchedNPCs.map(npc => (
                  <span key={npc.id} className="text-[11px] px-2 py-0.5 rounded-full bg-blue-800/25 text-blue-300/80 border border-blue-500/20">
                    {npc.name}
                  </span>
                ))}
                {matchedQuests.map(q => (
                  <span key={q.id} className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-800/25 text-emerald-300/80 border border-emerald-500/20">
                    {q.title}
                  </span>
                ))}
              </div>
            </div>
          );
        })()}

        {(note.updated_at || note.created_at) && (() => {
          const ts = note.updated_at || note.created_at;
          const relative = formatRelativeTime(ts);
          const isUpdated = note.updated_at && note.created_at && note.updated_at !== note.created_at;
          return relative ? (
            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-amber-200/5 ml-9">
              <Clock size={10} className="text-amber-200/20" />
              <span className="text-[10px] text-amber-200/20">
                {isUpdated ? 'Updated' : 'Created'} {relative}
              </span>
            </div>
          ) : null;
        })()}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-none">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display text-amber-100 flex items-center gap-2">
          <Globe size={20} />
          <div>
            <span>Lore & World Notes</span>
            <p className="text-xs text-amber-200/40 font-normal mt-0.5">Your campaign knowledge base. Categorize world-building details, track sources, and mark what's confirmed vs. rumor.</p>
          </div>
        </h2>
        {isDM && (
          <div className="flex items-center gap-2">
            <button
              disabled={aiGenerating}
              onClick={async () => {
                setAiGenerating(true);
                toast('Generating with AI...', { icon: '🤖' });
                try {
                  const result = await invoke('generate_location', { locationType: null, setting: null, partyLevel: null });
                  const parsed = JSON.parse(result);
                  const aiLore = {
                    title: parsed.title || parsed.name || '',
                    category: parsed.category || parsed.type || 'Location',
                    body: parsed.body || parsed.description || '',
                    related_to_text: parsed.related_to || '',
                    discovery_type: parsed.discovery_type || 'Confirmed',
                    source_npc: parsed.source_npc || '',
                    source_date: '',
                    session_number: '',
                    linked_entries: [],
                  };
                  setEditing(null);
                  setQuickGenData(aiLore);
                  setShowForm(true);
                  toast.success('AI lore generated!');
                } catch (err) {
                  console.warn('AI lore generation failed, using template fallback:', err);
                  toast('AI unavailable — using template', { icon: '⚡' });
                  setEditing(null);
                  setQuickGenData(generateRandomLoreNote());
                  setShowForm(true);
                } finally {
                  setAiGenerating(false);
                }
              }}
              className="text-xs flex items-center gap-1"
              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(74,222,128,0.25)', background: 'rgba(74,222,128,0.08)', color: '#4ade80', fontFamily: 'var(--font-heading)', letterSpacing: '0.04em', cursor: 'pointer', opacity: aiGenerating ? 0.6 : 1 }}
              title="Generate a random lore entry with AI (falls back to template if unavailable)"
            >
              {aiGenerating ? <Loader2 size={12} className="animate-spin" /> : <Shuffle size={12} />} Quick Generate
            </button>
            <button onClick={() => { setEditing(null); setQuickGenData(null); setShowForm(true); }} className="btn-primary text-xs flex items-center gap-1">
              <Plus size={12} /> New Note
            </button>
          </div>
        )}
      </div>

      {/* Stats bar */}
      {notes.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs bg-amber-200/5 text-amber-200/50 px-2.5 py-1 rounded border border-amber-200/10">
            {notes.length} {notes.length === 1 ? 'entry' : 'entries'}
          </span>
          {Object.entries(categoryCounts).sort(([,a],[,b]) => b - a).slice(0, 5).map(([cat, count]) => {
            const CatIcon = getCategoryIcon(cat);
            const catColor = getCategoryColor(cat);
            return (
              <button key={cat} onClick={() => setCategoryFilter(categoryFilter === cat ? 'all' : cat)}
                className={`text-xs px-2.5 py-1 rounded border flex items-center gap-1 transition-all cursor-pointer ${categoryFilter === cat ? catColor : 'bg-amber-200/5 text-amber-200/40 border-amber-200/10 hover:bg-amber-200/10'}`}>
                <CatIcon size={10} /> {cat}: <span className="font-medium">{count}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          {/* View mode */}
          <div className="flex items-center gap-1">
            {[['grid', 'Grid'], ['wiki', 'Wiki']].map(([key, label]) => (
              <button key={key} onClick={() => setViewMode(key)}
                className={`text-xs px-2.5 py-1 rounded ${viewMode === key ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-amber-200/5 text-amber-200/40 border border-amber-200/10'}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-200/30 pointer-events-none" />
            <input className="input w-full pl-10" placeholder="Search lore..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-amber-200/40">Sort:</span>
            {[['name', 'Name A-Z'], ['category', 'Category'], ['recent', 'Recent'], ['discovery', 'Discovery']].map(([key, label]) => (
              <button key={key} onClick={() => setSortBy(key)}
                className={`text-xs px-2.5 py-1 rounded ${sortBy === key ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-amber-200/5 text-amber-200/40 border border-amber-200/10'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Category filter */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-amber-200/40">Category:</span>
            <button onClick={() => setCategoryFilter('all')}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all ${categoryFilter === 'all' ? 'bg-gold/15 border-gold/30 text-gold' : 'border-amber-200/10 text-amber-200/30 hover:text-amber-200/50'}`}>
              All
            </button>
            {categories.map(cat => {
              const CatIcon = getCategoryIcon(cat);
              const catColor = getCategoryColor(cat);
              return (
                <button key={cat} onClick={() => setCategoryFilter(cat)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 ${categoryFilter === cat ? catColor : 'border-amber-200/10 text-amber-200/30 hover:text-amber-200/50'}`}>
                  {CatIcon && <CatIcon size={10} />}
                  {cat}
                  <span className="text-[10px] opacity-60 bg-amber-200/10 px-1.5 rounded-full">{categoryCounts[cat] || 0}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Discovery filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-amber-200/40">Discovery:</span>
          <button onClick={() => setDiscoveryFilter('all')}
            className={`text-xs px-2.5 py-1 rounded-full border transition-all ${discoveryFilter === 'all' ? 'bg-gold/15 border-gold/30 text-gold' : 'border-amber-200/10 text-amber-200/30 hover:text-amber-200/50'}`}>
            All
          </button>
          {DISCOVERY_TYPES.map(d => {
            const style = DISCOVERY_STYLES[d];
            const DIcon = style.icon;
            const count = discoveryCounts[d] || 0;
            return (
              <button key={d} onClick={() => setDiscoveryFilter(discoveryFilter === d ? 'all' : d)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 ${discoveryFilter === d ? `${style.bg} ${style.text} ${style.border}` : 'border-amber-200/10 text-amber-200/30 hover:text-amber-200/50'}`}>
                <DIcon size={10} /> {d}
                {count > 0 && <span className="text-[10px] opacity-60 bg-amber-200/10 px-1.5 rounded-full">{count}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card border-dashed border-amber-200/10 text-center py-12">
          <Globe size={32} className="mx-auto text-amber-200/15 mb-3" />
          <p className="text-sm text-amber-200/30 mb-1">{searchQuery || categoryFilter !== 'all' || discoveryFilter !== 'all' ? 'No matching lore entries' : 'No lore notes yet — record world details and discoveries'}</p>
          <p className="text-xs text-amber-200/20">Store factions, locations, deities, history, and anything about the game world worth remembering</p>
        </div>
      ) : viewMode === 'wiki' ? (
        <div className="space-y-8">
          {Object.entries(groupedByCategory).sort(([a], [b]) => a.localeCompare(b)).map(([cat, catNotes]) => {
            const CatIcon = getCategoryIcon(cat);
            const catColor = getCategoryColor(cat);
            const borderLeftColor = getCategoryBorderLeft(cat);
            return (
              <div key={cat}>
                <div className={`flex items-center gap-2.5 mb-4 pb-2 border-b-2 ${borderLeftColor.replace('border-l-', 'border-b-')}`}>
                  <div className={`p-1.5 rounded ${catColor}`}>
                    <CatIcon size={18} />
                  </div>
                  <h3 className="font-display text-amber-100 text-xl">{cat}</h3>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border ${catColor} font-medium`}>{catNotes.length} {catNotes.length === 1 ? 'entry' : 'entries'}</span>
                </div>
                <div className="space-y-3">
                  {catNotes.map(note => <LoreCard key={note.id} note={note} isWikiView />)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sorted.map(note => <LoreCard key={note.id} note={note} />)}
        </div>
      )}

      {showForm && (
        <LoreForm note={editing} initialData={quickGenData} allNotes={notes} npcs={npcs} onSubmit={handleSave} onCancel={() => { setShowForm(false); setEditing(null); setQuickGenData(null); }} />
      )}

      <ConfirmDialog
        show={!!confirmDelete}
        title="Delete Lore Note?"
        message={`Remove "${confirmDelete?.title}"? This cannot be undone.`}
        onConfirm={() => handleDelete(confirmDelete.id)}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}

function LoreForm({ note, initialData, allNotes, npcs, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => {
    if (note) return { ...note };
    if (initialData) return { ...initialData };
    return { title: '', category: '', body: '', related_to_text: '', discovery_type: '', source_npc: '', source_date: '', session_number: '', linked_entries: [] };
  });
  const [titleError, setTitleError] = useState(false);
  const update = (f, v) => {
    if (f === 'title') setTitleError(false);
    setForm(prev => ({ ...prev, [f]: v }));
  };
  const handleSubmit = () => {
    if (!form.title.trim()) { setTitleError(true); return; }
    onSubmit(form);
  };

  const toggleLinkedEntry = (id) => {
    const linked = form.linked_entries || [];
    if (linked.includes(id)) {
      update('linked_entries', linked.filter(x => x !== id));
    } else {
      update('linked_entries', [...linked, id]);
    }
  };

  const otherNotes = useMemo(() => (allNotes || []).filter(n => !note || n.id !== note.id), [allNotes, note]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <ModalPortal>
      <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="bg-[#14121c] border border-gold/30 rounded-lg p-5 w-full mx-4" style={{ maxWidth: '720px', display: 'flex', flexDirection: 'column' }}>
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <h3 className="font-display text-lg text-amber-100">{note ? 'Edit Note' : 'New Lore Note'}</h3>
          <div className="flex gap-2">
            <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
            <button onClick={handleSubmit} className="btn-primary text-sm">{note ? 'Save' : 'Add'}</button>
          </div>
        </div>
        <div className="space-y-2 overflow-y-auto flex-1" style={{ minHeight: 0 }}>
          <input className={`input w-full ${titleError ? 'border-red-500' : ''}`} placeholder="Title" value={form.title} onChange={e => update('title', e.target.value)} autoFocus />

          {!note && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-amber-200/30 whitespace-nowrap">Template:</span>
              <div className="flex gap-1 flex-wrap">
                {LORE_TEMPLATES.map(t => (
                  <button key={t.label} type="button" onClick={() => {
                    setForm(prev => ({ ...prev, category: t.category, body: t.body }));
                  }}
                    className="text-[10px] px-2 py-0.5 rounded bg-amber-200/5 text-amber-200/30 border border-amber-200/8 hover:bg-amber-200/10 hover:text-amber-200/60 transition-all">
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Category with color-coded presets */}
          <div className="flex gap-1.5 flex-wrap">
              {CATEGORY_PRESETS.map(preset => {
                const PresetIcon = preset.icon;
                const isSelected = form.category === preset.label;
                return (
                  <button key={preset.label} type="button" onClick={() => update('category', isSelected ? '' : preset.label)}
                    className={`text-xs px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-all border ${isSelected ? preset.color + ' ring-1 ring-white/10' : 'bg-amber-200/5 text-amber-200/40 border-amber-200/10 hover:text-amber-200/60'}`}>
                    <PresetIcon size={11} />
                    {preset.label}
                  </button>
                );
              })}
            </div>
            <input className="input flex-1" style={{ minWidth: '140px' }} placeholder="Or custom..." value={form.category} onChange={e => update('category', e.target.value)} />

          {/* Discovery type */}
          <div className="flex gap-1.5 flex-wrap items-center">
              <button type="button" onClick={() => update('discovery_type', '')}
                className={`text-xs px-2.5 py-1.5 rounded border ${!form.discovery_type ? 'bg-gold/20 text-gold border-gold/30' : 'bg-amber-200/5 text-amber-200/40 border-amber-200/10'}`}>
                None
              </button>
              {DISCOVERY_TYPES.map(d => {
                const style = DISCOVERY_STYLES[d];
                const DIcon = style.icon;
                return (
                  <button key={d} type="button" onClick={() => update('discovery_type', d)}
                    className={`text-xs px-2.5 py-1.5 rounded border flex items-center gap-1 ${form.discovery_type === d ? `${style.bg} ${style.text} ${style.border}` : 'bg-amber-200/5 text-amber-200/40 border-amber-200/10'}`}>
                    <DIcon size={10} /> {d}
                  </button>
                );
              })}
            </div>

          <div data-color-mode="dark">
            <MDEditor value={form.body} onChange={v => update('body', v || '')} height={150} preview="edit" />
          </div>

          {/* Source tracking */}
          <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-amber-200/30 mb-1 block">Learned from</label>
                <input className="input w-full" placeholder="NPC, book, etc." value={form.source_npc || ''} onChange={e => update('source_npc', e.target.value)} list="npc-names" />
                <datalist id="npc-names">
                  {npcs.map(n => <option key={n.id} value={n.name} />)}
                </datalist>
              </div>
              <div>
                <label className="text-[10px] text-amber-200/30 mb-1 block">Discovered on</label>
                <input type="date" className="input w-full" value={form.source_date || ''} onChange={e => update('source_date', e.target.value)} />
              </div>
              <div>
                <label className="text-[10px] text-amber-200/30 mb-1 block">Session #</label>
                <input type="number" min="1" className="input w-full" placeholder="#" value={form.session_number || ''} onChange={e => update('session_number', e.target.value)} />
              </div>
            </div>
          <input className="input w-full" placeholder="Related to (reference another lore entry or topic)" value={form.related_to_text || ''} onChange={e => update('related_to_text', e.target.value)} />

          {/* Link to other lore entries */}
          {otherNotes.length > 0 && (
            <div>
              <label className="label flex items-center gap-1">Link to Other Entries <span className="text-[10px] text-amber-200/25 font-normal">(bidirectional)</span></label>
              <div className="max-h-32 overflow-y-auto space-y-1 border border-amber-200/10 rounded p-2">
                {otherNotes.map(n => {
                  const isLinked = (form.linked_entries || []).includes(n.id);
                  const NIcon = getCategoryIcon(n.category);
                  return (
                    <button key={n.id} type="button" onClick={() => toggleLinkedEntry(n.id)}
                      className={`w-full text-left text-xs px-2 py-1 rounded flex items-center gap-2 ${isLinked ? 'bg-gold/15 text-gold' : 'text-amber-200/40 hover:text-amber-200/60 hover:bg-amber-200/5'}`}>
                      <span className={`w-3 h-3 rounded border flex items-center justify-center ${isLinked ? 'bg-gold border-gold' : 'border-amber-200/20'}`}>
                        {isLinked && <span className="text-[8px] text-black font-bold">&#10003;</span>}
                      </span>
                      <NIcon size={10} className="shrink-0" />
                      {n.title}
                      {n.category && <span className="text-[10px] text-amber-200/25">[{n.category}]</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </ModalPortal>
  );
}
