import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Plus, Trash2, Edit2, BookMarked, Search, X, Download, BookOpen, Star, Users, Copy, Clock, Coins, Zap, Calendar, ChevronDown, ChevronRight, FileText, Tag, Filter, Swords, MessageCircle, Map, ShoppingBag, Coffee, Sparkles, Wand2, Save, RefreshCw, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import MDEditor from '@uiw/react-md-editor';
import { getJournalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry } from '../api/journal';
import { getNPCs } from '../api/npcs';
import { getQuests } from '../api/quests';
import { checkOllamaStatus, streamChat } from '../api/assistant';
import ConfirmDialog from '../components/ConfirmDialog';
import ModalPortal from '../components/ModalPortal';

const MOOD_OPTIONS = [
  { value: 'adventure', label: 'Adventure', emoji: '\u2694\uFE0F' },
  { value: 'mystery',   label: 'Mystery',   emoji: '\uD83D\uDD0D' },
  { value: 'tragedy',   label: 'Tragedy',   emoji: '\uD83D\uDC80' },
  { value: 'comedy',    label: 'Comedy',    emoji: '\uD83D\uDE04' },
  { value: 'horror',    label: 'Horror',    emoji: '\uD83D\uDC7B' },
];

const QUICK_TAGS = [
  { value: 'Combat',      color: 'bg-red-800/30 text-red-300 border-red-500/20',      icon: Swords },
  { value: 'Roleplay',    color: 'bg-purple-800/30 text-purple-300 border-purple-500/20', icon: MessageCircle },
  { value: 'Exploration', color: 'bg-cyan-800/30 text-cyan-300 border-cyan-500/20',    icon: Map },
  { value: 'Shopping',    color: 'bg-yellow-800/30 text-yellow-300 border-yellow-500/20', icon: ShoppingBag },
  { value: 'Downtime',    color: 'bg-green-800/30 text-green-300 border-green-500/20',  icon: Coffee },
  { value: 'Recap',       color: 'bg-violet-800/30 text-violet-300 border-violet-500/20', icon: Sparkles },
];

function getQuickTagColor(tag) {
  const qt = QUICK_TAGS.find(q => q.value.toLowerCase() === tag.toLowerCase());
  return qt ? qt.color : 'bg-purple-800/30 text-purple-300 border-purple-500/20';
}

const MAX_RECENT_SEARCHES = 5;

const SESSION_TEMPLATE = `## Combat Encounters
-

## NPCs Met
-

## Loot Found
-

## Plot Points
-

## Player Notes
- `;

function getMoodFromTags(tags) {
  if (!tags) return null;
  const parts = tags.split(',').map(t => t.trim());
  const moodTag = parts.find(t => t.startsWith('mood:'));
  if (!moodTag) return null;
  const value = moodTag.replace('mood:', '');
  return MOOD_OPTIONS.find(m => m.value === value) || null;
}

function getDisplayTags(tags) {
  if (!tags) return [];
  return tags.split(',').map(t => t.trim()).filter(t => t && !t.startsWith('mood:') && !t.startsWith('xp:') && !t.startsWith('gold:'));
}

function setMoodInTags(tags, moodValue) {
  const existing = tags ? tags.split(',').map(t => t.trim()).filter(t => t && !t.startsWith('mood:')) : [];
  if (moodValue) existing.push(`mood:${moodValue}`);
  return existing.join(', ');
}

function getXpFromTags(tags) {
  if (!tags) return '';
  const parts = tags.split(',').map(t => t.trim());
  const xpTag = parts.find(t => t.startsWith('xp:'));
  return xpTag ? xpTag.replace('xp:', '') : '';
}

function getGoldFromTags(tags) {
  if (!tags) return '';
  const parts = tags.split(',').map(t => t.trim());
  const goldTag = parts.find(t => t.startsWith('gold:'));
  return goldTag ? goldTag.replace('gold:', '') : '';
}

function setXpGoldInTags(tags, xp, gold) {
  const existing = tags ? tags.split(',').map(t => t.trim()).filter(t => t && !t.startsWith('xp:') && !t.startsWith('gold:')) : [];
  if (xp) existing.push(`xp:${xp}`);
  if (gold) existing.push(`gold:${gold}`);
  return existing.join(', ');
}

function parseNpcs(npcsStr) {
  if (!npcsStr) return [];
  return npcsStr.split(',').map(s => s.trim()).filter(Boolean);
}

function exportJournal(entries) {
  const chronological = [...entries].sort((a, b) => {
    const sessionDiff = (a.session_number || 0) - (b.session_number || 0);
    if (sessionDiff !== 0) return sessionDiff;
    return (a.real_date || '').localeCompare(b.real_date || '');
  });

  const lines = chronological.map((entry, i) => {
    const parts = [];
    if (entry.session_number > 0) parts.push(`Session ${entry.session_number}`);
    if (entry.real_date) parts.push(entry.real_date);
    parts.push(entry.title || 'Untitled');
    const header = parts.join(' | ');
    const separator = '\u2500'.repeat(Math.max(header.length, 30));
    const body = entry.body || '';
    const npcs = parseNpcs(entry.npcs_mentioned);
    const npcLine = npcs.length > 0 ? `\nNPCs: ${npcs.join(', ')}` : '';
    const xp = getXpFromTags(entry.tags);
    const gold = getGoldFromTags(entry.tags);
    const rewardLine = (xp || gold) ? `\nRewards: ${xp ? xp + ' XP' : ''}${xp && gold ? ', ' : ''}${gold ? gold + ' GP' : ''}` : '';
    return `${header}\n${separator}\n${body}${npcLine}${rewardLine}${i < chronological.length - 1 ? '\n\n---\n' : ''}`;
  }).join('\n');

  const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'campaign-journal.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast.success('Journal exported');
}

function AutoLinkBadge({ text, isNpc, detail }) {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <span className="relative inline"
      onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
      <span className={`px-0.5 rounded cursor-pointer ${isNpc ? 'bg-blue-800/30 text-blue-300' : 'bg-emerald-800/30 text-emerald-300'}`}>
        {text}
      </span>
      {showTooltip && detail && (
        <span className="absolute left-0 bottom-full mb-1 z-50 bg-[#1a1826] border border-amber-200/20 rounded px-3 py-2 text-xs text-amber-200/70 whitespace-nowrap shadow-lg pointer-events-none">
          {isNpc ? (
            <>
              <span className="font-display text-blue-300">{detail.name}</span>
              {detail.role && <span className="ml-2 text-amber-200/40">{detail.role}</span>}
              {detail.status && <span className="ml-2 text-amber-200/30">({detail.status})</span>}
            </>
          ) : (
            <>
              <span className="font-display text-emerald-300">{detail.title}</span>
              {detail.status && <span className="ml-2 text-amber-200/40">{detail.status}</span>}
            </>
          )}
        </span>
      )}
    </span>
  );
}

function ReadingOverlay({ entry, npcList, questList, npcNames, questTitles, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const mood = getMoodFromTags(entry.tags);
  const npcs = parseNpcs(entry.npcs_mentioned);
  const xp = getXpFromTags(entry.tags);
  const gold = getGoldFromTags(entry.tags);

  // Build lookup maps
  const npcLookup = useMemo(() => {
    const map = {};
    (npcList || []).forEach(n => { if (n.name) map[n.name.toLowerCase()] = n; });
    return map;
  }, [npcList]);
  const questLookup = useMemo(() => {
    const map = {};
    (questList || []).forEach(q => { if (q.title) map[q.title.toLowerCase()] = q; });
    return map;
  }, [questList]);

  // Highlight NPC names and quest titles in body with tooltips
  const highlightedBody = useMemo(() => {
    let text = entry.body || '';
    const highlights = [];
    [...npcNames, ...questTitles].forEach(name => {
      if (!name || name.length < 2) return;
      const regex = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      let match;
      while ((match = regex.exec(text)) !== null) {
        const isNpc = npcNames.includes(name);
        highlights.push({ start: match.index, end: match.index + match[0].length, text: match[0], isNpc, name });
      }
    });
    if (highlights.length === 0) return <span>{text}</span>;
    highlights.sort((a, b) => a.start - b.start);
    const deduped = [];
    let lastEnd = -1;
    highlights.forEach(h => { if (h.start >= lastEnd) { deduped.push(h); lastEnd = h.end; } });
    const parts = [];
    let cursor = 0;
    deduped.forEach((h, i) => {
      if (h.start > cursor) parts.push(<span key={`t${i}`}>{text.slice(cursor, h.start)}</span>);
      const detail = h.isNpc ? npcLookup[h.name.toLowerCase()] : questLookup[h.name.toLowerCase()];
      parts.push(
        <AutoLinkBadge key={`h${i}`} text={h.text} isNpc={h.isNpc} detail={detail} />
      );
      cursor = h.end;
    });
    if (cursor < text.length) parts.push(<span key="rest">{text.slice(cursor)}</span>);
    return parts;
  }, [entry.body, npcNames, questTitles, npcLookup, questLookup]);

  return (
    <div className="fixed inset-0 z-50 bg-[#14121c]/95 flex items-start justify-center overflow-y-auto" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-[700px] mx-4 my-12 px-8 py-10">
        <button onClick={onClose} className="fixed top-6 right-6 text-amber-200/40 hover:text-amber-200 z-50" aria-label="Close reading mode">
          <X size={24} />
        </button>
        <div className="mb-8">
          <div className="flex items-center gap-2">
            {entry.pinned === 1 && <Star size={16} className="text-gold fill-gold" />}
            <h1 className="text-3xl font-display text-amber-100">{entry.title}</h1>
          </div>
          <div className="text-sm text-amber-200/40 space-x-3 mt-3">
            {entry.session_number > 0 && <span>Session {entry.session_number}</span>}
            {entry.real_date && <span>{entry.real_date}</span>}
            {entry.ingame_date && <span>In-game: {entry.ingame_date}</span>}
            {mood && <span>{mood.emoji} {mood.label}</span>}
          </div>
          {(xp || gold) && (
            <div className="flex items-center gap-3 mt-2">
              {xp && <span className="text-xs text-amber-200/50 flex items-center gap-1"><Zap size={12} className="text-yellow-400" /> {xp} XP</span>}
              {gold && <span className="text-xs text-amber-200/50 flex items-center gap-1"><Coins size={12} className="text-yellow-500" /> {gold} GP</span>}
            </div>
          )}
          {npcs.length > 0 && (
            <div className="flex items-center gap-1.5 mt-3 flex-wrap">
              <Users size={12} className="text-amber-200/30" />
              {npcs.map((npc, i) => (
                <span key={`${npc}-${i}`} className="text-xs bg-blue-800/30 text-blue-300 px-2 py-0.5 rounded">
                  {npc}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="text-amber-200/70 text-base leading-relaxed whitespace-pre-wrap">
          {highlightedBody}
        </div>
      </div>
    </div>
  );
}

function SessionSummaryBar({ entries }) {
  const stats = useMemo(() => {
    const total = entries.length;
    const sessions = new Set(entries.filter(e => e.session_number > 0).map(e => e.session_number));
    const dates = entries.map(e => e.real_date).filter(Boolean).sort();
    const earliest = dates[0] || null;
    const latest = dates[dates.length - 1] || null;
    const totalXP = entries.reduce((sum, e) => sum + (Number(getXpFromTags(e.tags)) || 0), 0);
    const totalGold = entries.reduce((sum, e) => sum + (Number(getGoldFromTags(e.tags)) || 0), 0);
    const goldGained = entries.reduce((sum, e) => { const g = Number(getGoldFromTags(e.tags)) || 0; return g > 0 ? sum + g : sum; }, 0);
    const goldSpent = entries.reduce((sum, e) => { const g = Number(getGoldFromTags(e.tags)) || 0; return g < 0 ? sum + Math.abs(g) : sum; }, 0);
    return { total, sessionCount: sessions.size, earliest, latest, totalXP, totalGold, goldGained, goldSpent };
  }, [entries]);

  if (stats.total === 0) return null;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-xs bg-amber-200/5 text-amber-200/50 px-2.5 py-1 rounded border border-amber-200/10">
        {stats.total} {stats.total === 1 ? 'entry' : 'entries'}
      </span>
      {stats.sessionCount > 0 && (
        <span className="text-xs bg-amber-200/5 text-amber-200/50 px-2.5 py-1 rounded border border-amber-200/10">
          {stats.sessionCount} {stats.sessionCount === 1 ? 'session' : 'sessions'}
        </span>
      )}
      {stats.earliest && stats.latest && (
        <span className="text-xs bg-amber-200/5 text-amber-200/50 px-2.5 py-1 rounded border border-amber-200/10">
          {stats.earliest === stats.latest ? stats.earliest : `${stats.earliest} \u2014 ${stats.latest}`}
        </span>
      )}
      {stats.totalXP > 0 && (
        <span className="text-xs bg-amber-200/5 text-amber-200/50 px-2.5 py-1 rounded border border-amber-200/10 flex items-center gap-1">
          <Zap size={10} className="text-yellow-400" /> {stats.totalXP.toLocaleString()} XP total
        </span>
      )}
      {(stats.goldGained > 0 || stats.goldSpent > 0) && (
        <span className="text-xs bg-amber-200/5 text-amber-200/50 px-2.5 py-1 rounded border border-amber-200/10 flex items-center gap-1">
          <Coins size={10} className="text-yellow-500" /> {stats.totalGold.toLocaleString()} GP net
          {stats.goldSpent > 0 && <span className="text-amber-200/30">({stats.goldGained.toLocaleString()} gained, {stats.goldSpent.toLocaleString()} spent)</span>}
        </span>
      )}
    </div>
  );
}

function RecapModal({ entries, npcs, quests, characterId, onClose, onSaveAsEntry }) {
  const [recapText, setRecapText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCount, setSelectedCount] = useState(3);
  const [hasGenerated, setHasGenerated] = useState(false);
  const abortRef = useRef(false);

  const recentEntries = useMemo(() => {
    return [...entries]
      .sort((a, b) => {
        const sessionDiff = (b.session_number || 0) - (a.session_number || 0);
        if (sessionDiff !== 0) return sessionDiff;
        return (b.real_date || '').localeCompare(a.real_date || '');
      })
      .slice(0, Math.max(1, selectedCount));
  }, [entries, selectedCount]);

  const buildPrompt = useCallback(() => {
    const journalContext = recentEntries.map(e => {
      const parts = [];
      if (e.session_number > 0) parts.push(`Session ${e.session_number}`);
      if (e.real_date) parts.push(e.real_date);
      parts.push(e.title || 'Untitled');
      const header = parts.join(' | ');
      const npcsLine = e.npcs_mentioned ? `NPCs: ${e.npcs_mentioned}` : '';
      const tagsLine = getDisplayTags(e.tags).length > 0 ? `Tags: ${getDisplayTags(e.tags).join(', ')}` : '';
      const xp = getXpFromTags(e.tags);
      const gold = getGoldFromTags(e.tags);
      const rewardsLine = (xp || gold) ? `Rewards: ${xp ? xp + ' XP' : ''}${xp && gold ? ', ' : ''}${gold ? gold + ' GP' : ''}` : '';
      return [header, e.body || '', npcsLine, tagsLine, rewardsLine].filter(Boolean).join('\n');
    }).join('\n\n---\n\n');

    const activeQuestList = quests
      .filter(q => q.status && q.status.toLowerCase() !== 'completed' && q.status.toLowerCase() !== 'failed')
      .slice(0, 5)
      .map(q => `- ${q.title}${q.status ? ` (${q.status})` : ''}${q.description ? `: ${q.description.slice(0, 100)}` : ''}`)
      .join('\n');

    const recentNpcList = npcs
      .slice(0, 8)
      .map(n => `- ${n.name}${n.role ? ` — ${n.role}` : ''}${n.status ? ` (${n.status})` : ''}`)
      .join('\n');

    let prompt = `You are a narrator for a Dungeons & Dragons campaign. Based on the following session notes, generate a dramatic "Last time on..." recap summary that can be read aloud at the start of the next session. Keep it 2-3 paragraphs. Use vivid language and build tension. Do not use headers or bullet points — write it as flowing narrative prose.\n\n`;
    prompt += `## Session Notes\n${journalContext}\n\n`;
    if (activeQuestList) prompt += `## Active Quests\n${activeQuestList}\n\n`;
    if (recentNpcList) prompt += `## Known NPCs\n${recentNpcList}\n\n`;
    prompt += `Now write the recap, starting with "Last time, in our tale..."`;
    return prompt;
  }, [recentEntries, quests, npcs]);

  const generate = useCallback(async () => {
    setIsGenerating(true);
    setRecapText('');
    setHasGenerated(false);
    abortRef.current = false;

    try {
      const status = await checkOllamaStatus();
      if (!status.available) {
        toast.error('Ollama is not running. Start Ollama to use the Arcane Advisor.');
        setIsGenerating(false);
        return;
      }
      if (!status.modelInstalled) {
        toast.error(`Model "${status.model}" is not installed. Install it from the Arcane Advisor tab.`);
        setIsGenerating(false);
        return;
      }

      const prompt = buildPrompt();
      const messages = [
        { role: 'system', content: 'You are a dramatic fantasy narrator who creates vivid D&D session recaps. Write in an evocative, cinematic style.' },
        { role: 'user', content: prompt },
      ];

      let accumulated = '';
      for await (const chunk of streamChat(messages)) {
        if (abortRef.current) break;
        accumulated += chunk;
        setRecapText(accumulated);
      }
      setHasGenerated(true);
    } catch (err) {
      toast.error('Failed to generate recap: ' + (err.message || String(err)));
    } finally {
      setIsGenerating(false);
    }
  }, [buildPrompt]);

  const handleCopy = () => {
    navigator.clipboard.writeText(recapText).then(() => toast.success('Recap copied to clipboard')).catch(() => toast.error('Failed to copy'));
  };

  const handleSave = () => {
    onSaveAsEntry(recapText, recentEntries);
    onClose();
  };

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') { abortRef.current = true; onClose(); } };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <ModalPortal>
      <AnimatePresence>
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={e => { if (e.target === e.currentTarget) { abortRef.current = true; onClose(); } }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            style={{
              background: '#14121c',
              border: '1px solid rgba(192, 132, 252, 0.25)',
              borderRadius: '12px',
              padding: '24px',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '85vh',
              overflowY: 'auto',
              margin: '0 16px',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={20} style={{ color: '#c084fc' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#e8d5b5', fontFamily: 'var(--font-display, serif)' }}>
                  AI Session Recap
                </h3>
              </div>
              <button onClick={() => { abortRef.current = true; onClose(); }} style={{ color: 'rgba(232, 213, 181, 0.4)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {/* Entry count selector */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px',
              padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <Wand2 size={14} style={{ color: '#c084fc', flexShrink: 0 }} />
              <span style={{ fontSize: '13px', color: 'rgba(232, 213, 181, 0.5)' }}>Recap from the last</span>
              {[1, 2, 3].map(n => (
                <button key={n} onClick={() => setSelectedCount(n)}
                  style={{
                    fontSize: '12px', padding: '3px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                    background: selectedCount === n ? 'rgba(192, 132, 252, 0.2)' : 'rgba(255,255,255,0.04)',
                    color: selectedCount === n ? '#c084fc' : 'rgba(232, 213, 181, 0.4)',
                    borderWidth: '1px', borderStyle: 'solid',
                    borderColor: selectedCount === n ? 'rgba(192, 132, 252, 0.3)' : 'rgba(255,255,255,0.08)',
                  }}>
                  {n}
                </button>
              ))}
              <span style={{ fontSize: '13px', color: 'rgba(232, 213, 181, 0.5)' }}>
                {selectedCount === 1 ? 'entry' : 'entries'}
              </span>
              {entries.length === 0 && (
                <span style={{ fontSize: '11px', color: 'rgba(239, 68, 68, 0.6)', marginLeft: '8px' }}>No entries available</span>
              )}
            </div>

            {/* Generate / Regenerate button */}
            {!isGenerating && (
              <button onClick={generate} disabled={entries.length === 0}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  width: '100%', padding: '10px', borderRadius: '8px', border: 'none', cursor: entries.length === 0 ? 'not-allowed' : 'pointer',
                  background: entries.length === 0 ? 'rgba(255,255,255,0.03)' : 'linear-gradient(135deg, rgba(192, 132, 252, 0.15), rgba(139, 92, 246, 0.15))',
                  color: entries.length === 0 ? 'rgba(232, 213, 181, 0.2)' : '#c084fc',
                  fontSize: '13px', fontWeight: 500,
                  borderWidth: '1px', borderStyle: 'solid',
                  borderColor: entries.length === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(192, 132, 252, 0.25)',
                  marginBottom: '16px',
                  transition: 'all 0.2s',
                }}>
                {hasGenerated ? <RefreshCw size={14} /> : <Sparkles size={14} />}
                {hasGenerated ? 'Regenerate Recap' : 'Generate Recap'}
              </button>
            )}

            {/* Loading state */}
            {isGenerating && !recapText && (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '40px 20px', marginBottom: '16px',
                background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles size={24} style={{ color: '#c084fc' }} />
                </motion.div>
                <p style={{ fontSize: '13px', color: 'rgba(232, 213, 181, 0.5)', marginTop: '12px' }}>
                  The Arcane Advisor is weaving your tale...
                </p>
              </div>
            )}

            {/* Recap text */}
            {recapText && (
              <div style={{
                background: 'rgba(255,255,255,0.03)', borderRadius: '8px',
                border: '1px solid rgba(192, 132, 252, 0.12)', padding: '20px',
                marginBottom: '16px', position: 'relative',
              }}>
                {isGenerating && (
                  <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
                      <Loader2 size={14} style={{ color: '#c084fc' }} />
                    </motion.div>
                  </div>
                )}
                <div style={{
                  fontSize: '14px', lineHeight: '1.75', color: 'rgba(232, 213, 181, 0.75)',
                  whiteSpace: 'pre-wrap', fontStyle: 'italic',
                }}>
                  {recapText}
                </div>
              </div>
            )}

            {/* Action buttons */}
            {hasGenerated && recapText && !isGenerating && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={handleSave}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    padding: '9px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                    background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', border: '1px solid rgba(192, 132, 252, 0.25)',
                  }}>
                  <Save size={13} /> Save as Journal Entry
                </button>
                <button onClick={handleCopy}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    padding: '9px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                    background: 'rgba(255,255,255,0.04)', color: 'rgba(232, 213, 181, 0.6)', border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                  <Copy size={13} /> Copy to Clipboard
                </button>
                <button onClick={generate}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    padding: '9px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                    background: 'rgba(255,255,255,0.04)', color: 'rgba(232, 213, 181, 0.6)', border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                  <RefreshCw size={13} /> Regenerate
                </button>
              </div>
            )}

            {/* Included entries preview */}
            {recentEntries.length > 0 && (
              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '10px', color: 'rgba(232, 213, 181, 0.25)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Entries included in context
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                  {recentEntries.map(e => (
                    <div key={e.id} style={{
                      display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px',
                      color: 'rgba(232, 213, 181, 0.4)', padding: '4px 8px',
                      background: 'rgba(255,255,255,0.02)', borderRadius: '4px',
                    }}>
                      <FileText size={10} style={{ flexShrink: 0, color: 'rgba(192, 132, 252, 0.4)' }} />
                      {e.session_number > 0 && <span style={{ color: 'rgba(192, 132, 252, 0.5)' }}>S{e.session_number}</span>}
                      <span style={{ color: 'rgba(232, 213, 181, 0.5)' }}>{e.title}</span>
                      {e.real_date && <span>{e.real_date}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </ModalPortal>
  );
}

export default function Journal({ characterId }) {
  const [entries, setEntries] = useState([]);
  const [npcs, setNpcs] = useState([]);
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [readingEntry, setReadingEntry] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // list | timeline
  const [filterTag, setFilterTag] = useState('');
  const [recentSearches, setRecentSearches] = useState(() => {
    try { return JSON.parse(localStorage.getItem('journal_recent_searches') || '[]'); } catch (err) { if (import.meta.env.DEV) console.warn('Journal recent searches parse:', err); return []; }
  });
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [showRecap, setShowRecap] = useState(false);
  const searchInputRef = useRef(null);

  const addRecentSearch = (q) => {
    if (!q.trim()) return;
    const updated = [q, ...recentSearches.filter(s => s !== q)].slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(updated);
    localStorage.setItem('journal_recent_searches', JSON.stringify(updated));
  };

  const load = useCallback(async () => {
    try {
      const data = await getJournalEntries(characterId);
      setEntries(data);
    } catch (err) { toast.error(err.message); if (import.meta.env.DEV) console.warn('Journal load:', err); }
    finally { setLoading(false); }
  }, [characterId]);

  const loadCrossRefs = useCallback(async () => {
    try { setNpcs(await getNPCs(characterId)); } catch (err) { if (import.meta.env.DEV) console.warn('Journal loadCrossRefs npcs:', err); }
    try { setQuests(await getQuests(characterId)); } catch (err) { if (import.meta.env.DEV) console.warn('Journal loadCrossRefs quests:', err); }
  }, [characterId]);

  useEffect(() => { load(); loadCrossRefs(); }, [load, loadCrossRefs]);

  const npcNames = useMemo(() => npcs.map(n => n.name).filter(Boolean), [npcs]);
  const questTitles = useMemo(() => quests.map(q => q.title).filter(Boolean), [quests]);

  const handleAdd = async (data) => {
    try {
      await addJournalEntry(characterId, data);
      toast.success('Entry saved');
      setShowAdd(false);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleUpdate = async (id, data) => {
    try {
      await updateJournalEntry(characterId, id, data);
      toast.success('Entry saved');
      setEditing(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteJournalEntry(characterId, id);
      toast('Entry removed');
      setConfirmDelete(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const [duplicateTemplate, setDuplicateTemplate] = useState(null);

  const handleDuplicate = (entry) => {
    const nextNum = entries.length > 0 ? Math.max(...entries.map(e => e.session_number || 0)) + 1 : 1;
    setDuplicateTemplate({
      title: `${entry.title} (copy)`,
      session_number: nextNum,
      real_date: new Date().toISOString().split('T')[0],
      ingame_date: entry.ingame_date || '',
      body: entry.body || '',
      tags: entry.tags || '',
      npcs_mentioned: entry.npcs_mentioned || '',
      pinned: 0,
    });
    setEditing(null);
    setShowAdd(true);
  };

  const togglePin = async (entry) => {
    try {
      const newPinned = entry.pinned === 1 ? 0 : 1;
      await updateJournalEntry(characterId, entry.id, { ...entry, pinned: newPinned });
      toast.success(newPinned ? 'Entry pinned' : 'Entry unpinned');
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleSaveRecap = async (recapText, sourceEntries) => {
    const sessionNums = sourceEntries.map(e => e.session_number).filter(Boolean).sort((a, b) => a - b);
    const sessionLabel = sessionNums.length > 1
      ? `Sessions ${sessionNums[0]}-${sessionNums[sessionNums.length - 1]}`
      : sessionNums.length === 1 ? `Session ${sessionNums[0]}` : '';
    const title = sessionLabel ? `Recap: ${sessionLabel}` : 'Session Recap';
    try {
      await addJournalEntry(characterId, {
        title,
        session_number: 0,
        real_date: new Date().toISOString().split('T')[0],
        ingame_date: '',
        body: recapText,
        tags: 'Recap',
        npcs_mentioned: '',
        pinned: 0,
      });
      toast.success('Recap saved as journal entry');
      load();
    } catch (err) { toast.error(err.message); }
  };

  // Enhanced search with highlighting
  const searchResults = useMemo(() => {
    if (!searchQuery) return null;
    const q = searchQuery.toLowerCase();
    return entries.filter(e =>
      (e.title || '').toLowerCase().includes(q) ||
      (e.body || '').toLowerCase().includes(q) ||
      (e.tags || '').toLowerCase().includes(q) ||
      (e.npcs_mentioned || '').toLowerCase().includes(q)
    ).map(e => {
      // Find match context in body
      const bodyLower = (e.body || '').toLowerCase();
      const idx = bodyLower.indexOf(q);
      let snippet = '';
      if (idx >= 0) {
        const start = Math.max(0, idx - 40);
        const end = Math.min(e.body.length, idx + q.length + 40);
        snippet = (start > 0 ? '...' : '') + e.body.slice(start, end) + (end < e.body.length ? '...' : '');
      }
      return { ...e, _searchSnippet: snippet };
    });
  }, [entries, searchQuery]);

  const filtered = useMemo(() => {
    let base = searchResults || entries;
    if (filterTag) {
      base = base.filter(e => {
        const tags = getDisplayTags(e.tags);
        return tags.some(t => t.toLowerCase() === filterTag.toLowerCase());
      });
    }
    return base;
  }, [entries, searchResults, filterTag]);

  const sorted = useMemo(() => {
    const base = [...filtered].sort((a, b) => {
      if (sortBy === 'date') return (b.real_date || '').localeCompare(a.real_date || '');
      if (sortBy === 'session') return (b.session_number || 0) - (a.session_number || 0);
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
      return 0;
    });
    const pinned = base.filter(e => e.pinned === 1);
    const unpinned = base.filter(e => e.pinned !== 1);
    return [...pinned, ...unpinned];
  }, [filtered, sortBy]);

  // Timeline view data
  const timelineData = useMemo(() => {
    return [...entries]
      .filter(e => e.real_date || e.session_number > 0)
      .sort((a, b) => {
        const dateDiff = (a.real_date || '').localeCompare(b.real_date || '');
        if (dateDiff !== 0) return dateDiff;
        return (a.session_number || 0) - (b.session_number || 0);
      });
  }, [entries]);

  // Highlight search terms in text
  const highlightSearch = (text, maxLen) => {
    if (!text) return '';
    const truncated = maxLen && text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
    if (!searchQuery) return truncated;
    const q = searchQuery.toLowerCase();
    const idx = truncated.toLowerCase().indexOf(q);
    if (idx < 0) return truncated;
    return (
      <span>
        {truncated.slice(0, idx)}
        <mark className="bg-gold/30 text-gold rounded px-0.5">{truncated.slice(idx, idx + searchQuery.length)}</mark>
        {truncated.slice(idx + searchQuery.length)}
      </span>
    );
  };

  // Auto-detect NPC and quest references in body text
  const getBodyReferences = (body) => {
    if (!body) return { npcsFound: [], questsFound: [] };
    const bodyLower = body.toLowerCase();
    const npcsFound = npcs.filter(n => n.name && n.name.length > 1 && bodyLower.includes(n.name.toLowerCase()));
    const questsFound = quests.filter(q => q.title && q.title.length > 2 && bodyLower.includes(q.title.toLowerCase()));
    return { npcsFound, questsFound };
  };

  if (loading) return <div className="text-amber-200/40">Loading journal...</div>;

  return (
    <div className="space-y-6 max-w-none">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display text-amber-100 flex items-center gap-2">
          <BookMarked size={20} />
          <div>
            <span>Campaign Journal</span>
            <p className="text-xs text-amber-200/40 font-normal mt-0.5">Record what happens each session. Track XP, gold, and key events with structured templates and auto-linked NPC/quest references.</p>
          </div>
        </h2>
        <div className="flex items-center gap-2">
          {entries.length > 0 && (
            <button onClick={() => exportJournal(entries)} className="btn-secondary text-xs flex items-center gap-1" title="Export journal to text file">
              <Download size={12} /> Export
            </button>
          )}
          <button onClick={() => setShowRecap(true)}
            className="text-xs flex items-center gap-1"
            style={{
              padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 500,
              background: 'linear-gradient(135deg, rgba(192, 132, 252, 0.12), rgba(139, 92, 246, 0.12))',
              color: '#c084fc', border: '1px solid rgba(192, 132, 252, 0.25)',
            }}
            title="Generate an AI recap of recent sessions">
            <Sparkles size={12} /> Recap
          </button>
          <button onClick={() => setShowAdd(true)} className="btn-primary text-xs flex items-center gap-1">
            <Plus size={12} /> New Entry
          </button>
        </div>
      </div>

      <SessionSummaryBar entries={entries} />

      {/* View mode toggle + Search + Sort */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {[['list', 'List'], ['timeline', 'Timeline']].map(([key, label]) => (
            <button key={key} onClick={() => setViewMode(key)}
              className={`text-xs px-2.5 py-1 rounded ${viewMode === key ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-amber-200/5 text-amber-200/40 border border-amber-200/10'}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-200/30" />
          <input ref={searchInputRef} className="input w-full pl-9" placeholder="Search across all entries..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => { if (!searchQuery && recentSearches.length > 0) setShowRecentSearches(true); }}
            onBlur={() => setTimeout(() => setShowRecentSearches(false), 150)}
            onKeyDown={e => { if (e.key === 'Enter' && searchQuery.trim()) { addRecentSearch(searchQuery.trim()); setShowRecentSearches(false); } }}
          />
          {searchQuery ? (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-[10px] text-amber-200/30">
                {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
              </span>
              <button onClick={() => setSearchQuery('')} className="text-amber-200/30 hover:text-amber-200"><X size={12} /></button>
            </span>
          ) : null}
          {showRecentSearches && recentSearches.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1826] border border-amber-200/15 rounded shadow-lg z-40">
              <div className="text-[10px] text-amber-200/30 px-3 py-1.5 uppercase tracking-wider">Recent Searches</div>
              {recentSearches.map((s, i) => (
                <button key={i} className="w-full text-left px-3 py-1.5 text-xs text-amber-200/60 hover:bg-amber-200/5 flex items-center gap-2"
                  onMouseDown={e => { e.preventDefault(); setSearchQuery(s); setShowRecentSearches(false); }}>
                  <Clock size={10} className="text-amber-200/25 shrink-0" /> {s}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-amber-200/40">Sort:</span>
          {[['date', 'Date'], ['session', 'Session #'], ['title', 'Title A-Z']].map(([key, label]) => (
            <button key={key} onClick={() => setSortBy(key)}
              className={`text-xs px-2.5 py-1 rounded ${sortBy === key ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-amber-200/5 text-amber-200/40 border border-amber-200/10'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tag filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={12} className="text-amber-200/30" />
        <button onClick={() => setFilterTag('')}
          className={`text-xs px-2.5 py-1 rounded border ${!filterTag ? 'bg-gold/20 text-gold border-gold/30' : 'bg-amber-200/5 text-amber-200/40 border-amber-200/10'}`}>
          All
        </button>
        {QUICK_TAGS.map(qt => (
          <button key={qt.value} onClick={() => setFilterTag(filterTag === qt.value ? '' : qt.value)}
            className={`text-xs px-2.5 py-1 rounded border flex items-center gap-1 ${filterTag === qt.value ? qt.color + ' border' : 'bg-amber-200/5 text-amber-200/40 border-amber-200/10'}`}>
            <qt.icon size={10} /> {qt.value}
          </button>
        ))}
      </div>

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="relative">
          {timelineData.length === 0 ? (
            <p className="text-sm text-amber-200/30 text-center py-8">No dated entries yet — add session dates to see the timeline</p>
          ) : (
            <div className="relative pl-8">
              {/* Vertical line */}
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-amber-200/10" />
              {timelineData.map((entry) => {
                const mood = getMoodFromTags(entry.tags);
                const xp = getXpFromTags(entry.tags);
                const gold = getGoldFromTags(entry.tags);
                return (
                  <div key={entry.id} className="relative mb-6">
                    {/* Dot */}
                    <div className={`absolute -left-5 top-1 w-3 h-3 rounded-full border-2 ${entry.pinned === 1 ? 'bg-gold border-gold' : 'bg-amber-500 border-amber-400'}`} />
                    <div className="card">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            {entry.pinned === 1 && <Star size={12} className="text-gold fill-gold" />}
                            <h4 className="text-amber-100 font-display">{entry.title}</h4>
                            {mood && <span className="text-xs text-amber-200/40">{mood.emoji}</span>}
                          </div>
                          <div className="text-xs text-amber-200/40 mt-0.5 flex items-center gap-2">
                            {entry.session_number > 0 && <span>Session {entry.session_number}</span>}
                            {entry.real_date && <span>{entry.real_date}</span>}
                            {entry.ingame_date && <span className="text-amber-200/25">In-game: {entry.ingame_date}</span>}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => setReadingEntry(entry)} className="text-amber-200/40 hover:text-amber-200" title="Reading mode"><BookOpen size={14} /></button>
                          <button onClick={() => setEditing(entry)} className="text-amber-200/40 hover:text-amber-200"><Edit2 size={14} /></button>
                        </div>
                      </div>
                      {(xp || gold) && (
                        <div className="flex items-center gap-2 mt-1">
                          {xp && <span className="text-[10px] text-amber-200/40 flex items-center gap-0.5"><Zap size={10} className="text-yellow-400" /> {xp} XP</span>}
                          {gold && <span className="text-[10px] text-amber-200/40 flex items-center gap-0.5"><Coins size={10} className="text-yellow-500" /> {gold} GP</span>}
                        </div>
                      )}
                      <p className="text-sm text-amber-200/50 mt-2 line-clamp-3">{entry.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <>
          {filtered.length === 0 ? (
            <div className="card border-dashed border-amber-200/10 text-center py-12">
              <BookMarked size={32} className="mx-auto text-amber-200/15 mb-3" />
              <p className="text-sm text-amber-200/30 mb-1">{searchQuery ? 'No entries match your search' : 'No journal entries yet — record your first adventure'}</p>
              <p className="text-xs text-amber-200/20">After each session, jot down key events, plot hooks, and things you want to remember</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sorted.map(entry => {
                const mood = getMoodFromTags(entry.tags);
                const displayTags = getDisplayTags(entry.tags);
                const npcsRaw = parseNpcs(entry.npcs_mentioned);
                const xp = getXpFromTags(entry.tags);
                const gold = getGoldFromTags(entry.tags);
                const { npcsFound, questsFound } = getBodyReferences(entry.body);
                return (
                  <div key={entry.id} className={`card ${entry.pinned === 1 ? 'border-gold/20' : ''}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          {entry.pinned === 1 && <Star size={14} className="text-gold fill-gold shrink-0" />}
                          <h4 className="text-amber-100 font-display text-lg">{searchQuery ? highlightSearch(entry.title) : entry.title}</h4>
                          {mood && (
                            <span className="text-xs bg-amber-200/5 text-amber-200/50 px-1.5 py-0.5 rounded border border-amber-200/10" title={mood.label}>
                              {mood.emoji} {mood.label}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-amber-200/40 mt-1 space-x-3">
                          {entry.session_number > 0 && <span>Session {entry.session_number}</span>}
                          {entry.real_date && <span>{entry.real_date}</span>}
                          {entry.ingame_date && <span>In-game: {entry.ingame_date}</span>}
                          {(() => {
                            const words = entry.body ? entry.body.trim().split(/\s+/).filter(Boolean).length : 0;
                            const readTime = Math.max(1, Math.round(words / 200));
                            return words > 0 ? <span className="text-amber-200/25">~{words} words / {readTime} min read</span> : null;
                          })()}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => togglePin(entry)} className={`${entry.pinned === 1 ? 'text-gold' : 'text-amber-200/40 hover:text-amber-200'}`} title={entry.pinned === 1 ? 'Unpin' : 'Pin'}>
                          <Star size={14} className={entry.pinned === 1 ? 'fill-gold' : ''} />
                        </button>
                        <button onClick={() => setReadingEntry(entry)} className="text-amber-200/40 hover:text-amber-200" title="Reading mode"><BookOpen size={14} /></button>
                        <button onClick={() => handleDuplicate(entry)} className="text-amber-200/40 hover:text-amber-200" title="Duplicate"><Copy size={14} /></button>
                        <button onClick={() => setEditing(entry)} className="text-amber-200/40 hover:text-amber-200"><Edit2 size={14} /></button>
                        <button onClick={() => setConfirmDelete(entry)} className="text-red-400/50 hover:text-red-400"><Trash2 size={14} /></button>
                      </div>
                    </div>

                    {/* XP/Gold summary */}
                    {(xp || gold) && (
                      <div className="flex items-center gap-3 mb-2">
                        {xp && <span className="text-xs text-amber-200/50 flex items-center gap-1"><Zap size={12} className="text-yellow-400" /> {xp} XP</span>}
                        {gold && <span className="text-xs text-amber-200/50 flex items-center gap-1"><Coins size={12} className="text-yellow-500" /> {gold} GP</span>}
                      </div>
                    )}

                    {displayTags.length > 0 && (
                      <div className="flex gap-1 mb-2 flex-wrap">
                        {displayTags.map((tag, i) => (
                          <span key={`${tag}-${i}`} className={`text-xs px-2 py-0.5 rounded border ${getQuickTagColor(tag)}`}
                            onClick={() => setFilterTag(filterTag === tag ? '' : tag)}
                            style={{ cursor: 'pointer' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {npcsRaw.length > 0 && (
                      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        <Users size={12} className="text-amber-200/30 shrink-0" />
                        {npcsRaw.map((npc, i) => (
                          <span key={`${npc}-${i}`} className="text-xs bg-blue-800/30 text-blue-300 px-2 py-0.5 rounded">{npc}</span>
                        ))}
                      </div>
                    )}

                    {/* Search snippet with highlight */}
                    {searchQuery && entry._searchSnippet ? (
                      <div className="text-sm text-amber-200/60 whitespace-pre-wrap">{highlightSearch(entry._searchSnippet)}</div>
                    ) : (
                      <div className="text-sm text-amber-200/60 whitespace-pre-wrap line-clamp-4">{entry.body}</div>
                    )}

                    {/* Auto-detected references */}
                    {(npcsFound.length > 0 || questsFound.length > 0) && (
                      <div className="mt-2 pt-2 border-t border-amber-200/5">
                        <span className="text-[10px] text-amber-200/25 uppercase tracking-wider">Auto-detected References</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {npcsFound.map(npc => (
                            <span key={npc.id} className="text-[11px] px-2 py-0.5 rounded-full bg-blue-800/25 text-blue-300/80 border border-blue-500/20 cursor-default group relative">
                              {npc.name}
                              <span className="hidden group-hover:block absolute left-0 bottom-full mb-1 z-40 bg-[#1a1826] border border-amber-200/20 rounded px-3 py-2 text-xs text-amber-200/70 whitespace-nowrap shadow-lg pointer-events-none">
                                <span className="font-display text-blue-300">{npc.name}</span>
                                {npc.role && <span className="ml-2 text-amber-200/40">{npc.role}</span>}
                                {npc.status && <span className="ml-2 text-amber-200/30">({npc.status})</span>}
                              </span>
                            </span>
                          ))}
                          {questsFound.map(q => (
                            <span key={q.id} className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-800/25 text-emerald-300/80 border border-emerald-500/20 cursor-default group relative">
                              {q.title}
                              <span className="hidden group-hover:block absolute left-0 bottom-full mb-1 z-40 bg-[#1a1826] border border-amber-200/20 rounded px-3 py-2 text-xs text-amber-200/70 whitespace-nowrap shadow-lg pointer-events-none">
                                <span className="font-display text-emerald-300">{q.title}</span>
                                {q.status && <span className="ml-2 text-amber-200/40">{q.status}</span>}
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {(showAdd || editing) && (
        <JournalForm
          entry={editing || duplicateTemplate}
          isNew={!!showAdd}
          nextSessionNumber={entries.length > 0 ? Math.max(...entries.map(e => e.session_number || 0)) + 1 : 1}
          onSubmit={editing ? (data) => handleUpdate(editing.id, data) : handleAdd}
          onCancel={() => { setShowAdd(false); setEditing(null); setDuplicateTemplate(null); }}
        />
      )}

      {readingEntry && (
        <ReadingOverlay entry={readingEntry} npcList={npcs} questList={quests} npcNames={npcNames} questTitles={questTitles} onClose={() => setReadingEntry(null)} />
      )}

      <ConfirmDialog
        show={!!confirmDelete}
        title="Delete Journal Entry?"
        message={`Remove "${confirmDelete?.title}"? This cannot be undone.`}
        onConfirm={() => handleDelete(confirmDelete.id)}
        onCancel={() => setConfirmDelete(null)}
      />

      {showRecap && (
        <RecapModal
          entries={entries}
          npcs={npcs}
          quests={quests}
          characterId={characterId}
          onClose={() => setShowRecap(false)}
          onSaveAsEntry={handleSaveRecap}
        />
      )}
    </div>
  );
}

function JournalForm({ entry, isNew, nextSessionNumber = 1, onSubmit, onCancel }) {
  const existingMood = entry ? getMoodFromTags(entry.tags) : null;
  const [form, setForm] = useState(() => {
    const base = entry || {
      title: '', session_number: nextSessionNumber, real_date: new Date().toISOString().split('T')[0],
      ingame_date: '', body: '', tags: '', npcs_mentioned: '', pinned: 0,
    };
    return {
      ...base,
      _mood: existingMood ? existingMood.value : '',
      _xp: getXpFromTags(base.tags),
      _gold: getGoldFromTags(base.tags),
    };
  });
  const [titleError, setTitleError] = useState(false);
  const update = (f, v) => {
    if (f === 'title') setTitleError(false);
    setForm(prev => ({ ...prev, [f]: v }));
  };
  const handleSubmit = () => {
    if (!form.title.trim()) { setTitleError(true); return; }
    const { _mood, _xp, _gold, ...rest } = form;
    const displayTags = getDisplayTags(rest.tags).join(', ');
    let finalTags = setMoodInTags(displayTags, _mood);
    finalTags = setXpGoldInTags(finalTags, _xp, _gold);
    onSubmit({ ...rest, tags: finalTags });
  };

  const formRef = useRef(form);
  useEffect(() => { formRef.current = form; }, [form]);

  const handleSubmitRef = useRef(handleSubmit);
  useEffect(() => { handleSubmitRef.current = handleSubmit; });

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onCancel();
      if (e.ctrlKey && e.key === 'Enter' && formRef.current.title.trim()) { e.preventDefault(); handleSubmitRef.current(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  const applyTemplate = () => {
    if (form.body && !confirm('This will replace the current body text. Continue?')) return;
    update('body', SESSION_TEMPLATE);
    toast.success('Session template applied');
  };

  const displayTagsStr = getDisplayTags(form.tags).join(', ');

  return (
    <ModalPortal>
      <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="bg-[#14121c] border border-gold/30 rounded-lg p-5 w-full mx-4" style={{ maxWidth: '720px' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg text-amber-100">{isNew ? 'New Journal Entry' : 'Edit Entry'}</h3>
          <div className="flex gap-2 items-center">
            <button onClick={applyTemplate} className="btn-secondary text-xs flex items-center gap-1" title="Pre-fill with session recap structure">
              <FileText size={12} /> Template
            </button>
            <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
            <button onClick={handleSubmit} className="btn-primary text-sm">{entry ? 'Save' : 'Add'}</button>
          </div>
        </div>
        <div className="space-y-2">
          <input className={`input w-full ${titleError ? 'border-red-500' : ''}`} placeholder="Title" value={form.title} onChange={e => update('title', e.target.value)} autoFocus />
          <div className="grid grid-cols-5 gap-2">
            <div><label className="label">Session #</label><input type="number" className="input w-full" value={form.session_number} onChange={e => update('session_number', parseInt(e.target.value) || 0)} /></div>
            <div><label className="label">Date</label><input type="date" className="input w-full" value={form.real_date} onChange={e => update('real_date', e.target.value)} /></div>
            <div><label className="label">In-game Date</label><input className="input w-full" value={form.ingame_date} onChange={e => update('ingame_date', e.target.value)} /></div>
            <div><label className="label flex items-center gap-1"><Zap size={9} className="text-yellow-400" /> XP</label><input type="number" min="0" className="input w-full" placeholder="0" value={form._xp} onChange={e => update('_xp', e.target.value)} /></div>
            <div><label className="label flex items-center gap-1"><Coins size={9} className="text-yellow-500" /> Gold</label><input type="number" className="input w-full" placeholder="0" value={form._gold} onChange={e => update('_gold', e.target.value)} /></div>
          </div>

          {/* Mood selector */}
          <div className="flex items-center gap-1.5">
              <button type="button" onClick={() => update('_mood', '')}
                className={`text-xs px-2.5 py-1 rounded ${!form._mood ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-amber-200/5 text-amber-200/40 border border-amber-200/10'}`}>
                None
              </button>
              {MOOD_OPTIONS.map(m => (
                <button key={m.value} type="button" onClick={() => update('_mood', m.value)}
                  className={`text-xs px-2.5 py-1 rounded ${form._mood === m.value ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-amber-200/5 text-amber-200/40 border border-amber-200/10'}`}>
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>
          <div data-color-mode="dark">
            <MDEditor value={form.body} onChange={v => update('body', v || '')} height={150} preview="edit" />
          </div>
          <div>
            <label className="label flex items-center gap-1"><Tag size={10} /> Tags</label>
            <div className="flex gap-1 mb-2 flex-wrap">
              {QUICK_TAGS.map(qt => {
                const currentTags = getDisplayTags(form.tags);
                const isActive = currentTags.some(t => t.toLowerCase() === qt.value.toLowerCase());
                return (
                  <button key={qt.value} type="button"
                    onClick={() => {
                      const current = getDisplayTags(form.tags);
                      let next;
                      if (isActive) {
                        next = current.filter(t => t.toLowerCase() !== qt.value.toLowerCase());
                      } else {
                        next = [...current, qt.value];
                      }
                      // Preserve mood/xp/gold meta-tags
                      const moodPart = getMoodFromTags(form.tags);
                      let rebuilt = next.join(', ');
                      if (moodPart) rebuilt = rebuilt ? rebuilt + `, mood:${moodPart.value}` : `mood:${moodPart.value}`;
                      const xpVal = getXpFromTags(form.tags);
                      const goldVal = getGoldFromTags(form.tags);
                      if (xpVal) rebuilt = rebuilt ? rebuilt + `, xp:${xpVal}` : `xp:${xpVal}`;
                      if (goldVal) rebuilt = rebuilt ? rebuilt + `, gold:${goldVal}` : `gold:${goldVal}`;
                      update('tags', rebuilt);
                    }}
                    className={`text-xs px-2 py-0.5 rounded border flex items-center gap-1 ${isActive ? qt.color + ' border' : 'bg-amber-200/5 text-amber-200/40 border-amber-200/10'}`}>
                    <qt.icon size={10} /> {qt.value}
                  </button>
                );
              })}
            </div>
            <input className="input w-full" placeholder="Additional tags (comma separated)" value={displayTagsStr} onChange={e => update('tags', e.target.value)} />
          </div>
          <div>
            <label className="label flex items-center gap-1"><Users size={12} /> NPCs Mentioned</label>
            <input className="input w-full" placeholder="NPC names, comma separated (e.g. Gandalf, Elrond)" value={form.npcs_mentioned || ''} onChange={e => update('npcs_mentioned', e.target.value)} />
          </div>
        </div>
        <div className="flex items-center mt-2">
          <span className="text-xs text-amber-200/30">Ctrl+Enter to save</span>
        </div>
      </div>
      </div>
    </ModalPortal>
  );
}
