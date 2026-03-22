import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import toast from 'react-hot-toast';
import MDEditor from '@uiw/react-md-editor';
import {
  ImagePlus, Trash2, Copy, Ruler, Weight, Calendar,
  Target, Users, Swords, Star, ChevronDown, ChevronRight,
  CheckSquare, Square, Plus, Shield, Milestone, X,
  Sparkles, RefreshCw, Check as CheckIcon, Loader2 as Spinner,
  Dice5, User, Compass, Link2, AlertTriangle
} from 'lucide-react';
import { getBackstory, updateBackstory } from '../api/backstory';
import { getNPCs } from '../api/npcs';
import { useAutosave } from '../hooks/useAutosave';
import SaveIndicator from '../components/SaveIndicator';
import HelpTooltip from '../components/HelpTooltip';
import { HELP } from '../data/helpText';
import { generateAI } from '../api/assistant';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

/* ── Standard 5e Background Presets ── */
const BACKGROUND_PRESETS = [
  { name: 'Acolyte', featureName: 'Shelter of the Faithful', featureDesc: 'As an acolyte, you command the respect of those who share your faith, and you can perform the religious ceremonies of your deity. You and your adventuring companions can expect to receive free healing and care at a temple, shrine, or other established presence of your faith.' },
  { name: 'Charlatan', featureName: 'False Identity', featureDesc: 'You have created a second identity that includes documentation, established acquaintances, and disguises that allow you to assume that persona. Additionally, you can forge documents including official papers and personal letters, as long as you have seen an example of the kind of document or the handwriting you are trying to copy.' },
  { name: 'Criminal', featureName: 'Criminal Contact', featureDesc: 'You have a reliable and trustworthy contact who acts as your liaison to a network of other criminals. You know how to get messages to and from your contact, even over great distances.' },
  { name: 'Entertainer', featureName: 'By Popular Demand', featureDesc: 'You can always find a place to perform, usually in an inn or tavern but possibly with a circus, at a theater, or even in a noble\'s court. At such a place, you receive free lodging and food of a modest or comfortable standard, as long as you perform each night.' },
  { name: 'Folk Hero', featureName: 'Rustic Hospitality', featureDesc: 'Since you come from the ranks of the common folk, you fit in among them with ease. You can find a place to hide, rest, or recuperate among other commoners, unless you have shown yourself to be a danger to them.' },
  { name: 'Guild Artisan', featureName: 'Guild Membership', featureDesc: 'As an established and respected member of a guild, you can rely on certain benefits that membership provides. Your fellow guild members will provide you with lodging and food if necessary, and pay for your funeral if needed.' },
  { name: 'Hermit', featureName: 'Discovery', featureDesc: 'The quiet seclusion of your extended hermitage gave you access to a unique and powerful discovery. The exact nature of this revelation depends on the nature of your seclusion. It might be a great truth, a hidden site, a long-forgotten fact, or unearthed some relic of the past.' },
  { name: 'Noble', featureName: 'Position of Privilege', featureDesc: 'Thanks to your noble birth, people are inclined to think the best of you. You are welcome in high society, and people assume you have the right to be wherever you are. The common folk make every effort to accommodate you and avoid your displeasure.' },
  { name: 'Outlander', featureName: 'Wanderer', featureDesc: 'You have an excellent memory for maps and geography, and you can always recall the general layout of terrain, settlements, and other features around you. In addition, you can find food and fresh water for yourself and up to five other people each day, provided that the land offers such resources.' },
  { name: 'Sage', featureName: 'Researcher', featureDesc: 'When you attempt to learn or recall a piece of lore, if you do not know that information, you often know where and from whom you can obtain it. Usually, this information comes from a library, scriptorium, university, or a sage or other learned person or creature.' },
  { name: 'Sailor', featureName: 'Ship\'s Passage', featureDesc: 'When you need to, you can secure free passage on a sailing ship for yourself and your adventuring companions. You might sail on the ship you served on, or another ship you have good relations with. Because you\'re calling in a favor, you can\'t be certain of a schedule or route that will meet your every need.' },
  { name: 'Soldier', featureName: 'Military Rank', featureDesc: 'You have a military rank from your career as a soldier. Soldiers loyal to your former military organization still recognize your authority and influence. You can invoke your rank to exert influence over other soldiers and requisition simple equipment or horses for temporary use.' },
  { name: 'Urchin', featureName: 'City Secrets', featureDesc: 'You know the secret patterns and flow to cities and can find passages through the urban sprawl that others would miss. When you are not in combat, you (and companions you lead) can travel between any two locations in the city twice as fast as your speed would normally allow.' },
];

/* ── Random Personality Tables (offline fallback) ── */
const RANDOM_TRAITS = [
  'I always have a plan for what to do when things go wrong.',
  'I am incredibly slow to trust. Those who seem the fairest often have the most to hide.',
  'I idolize a particular hero of my faith and constantly refer to that person\'s deeds.',
  'I can find common ground between the fiercest enemies, empathizing with them.',
  'I see omens in every event and action. The gods try to speak to us, we just need to listen.',
  'Nothing can shake my optimistic attitude.',
  'I quote (or misquote) sacred texts and proverbs in almost every situation.',
  'I am tolerant of other faiths and respect the worship of other gods.',
  'I\'ve enjoyed fine food, drink, and high society. Rough living grates on me.',
  'I misuse long words in an attempt to sound smarter.',
  'I get bored easily. When am I going to get on with my destiny?',
  'I judge people by their actions, not their words.',
  'If someone is in trouble, I\'m always ready to lend help.',
  'When I set my mind to something, I follow through no matter what gets in my way.',
  'I have a strong sense of fair play and always try to find the most equitable solution to arguments.',
];

const RANDOM_IDEALS = [
  'Greater Good. My gifts are meant to be shared with all, not used for my own benefit. (Good)',
  'Tradition. The ancient traditions of worship and sacrifice must be preserved and upheld. (Lawful)',
  'Power. I hope to one day rise to the top of my faith\'s religious hierarchy. (Lawful)',
  'Faith. I trust that my deity will guide my actions. I have faith that if I work hard, things will go well. (Lawful)',
  'Change. We must help bring about the changes the gods are constantly working in the world. (Chaotic)',
  'Aspiration. I seek to prove myself worthy of my god\'s favor by matching my actions against teachings. (Any)',
  'Independence. I am a free spirit — no one tells me what to do. (Chaotic)',
  'Fairness. No one should get preferential treatment before the law, and no one is above the law. (Lawful)',
  'Freedom. Chains are meant to be broken, as are those who would forge them. (Chaotic)',
  'Might. If I become strong, I can take what I want — what I deserve. (Evil)',
  'Sincerity. There\'s no good in pretending to be something I\'m not. (Neutral)',
  'Destiny. Nothing and no one can steer me away from my higher calling. (Any)',
  'Honor. If I dishonor myself, I dishonor my whole family. (Lawful)',
  'Knowledge. The path to power and self-improvement is through knowledge. (Neutral)',
];

const RANDOM_BONDS = [
  'I would die to recover an ancient relic of my faith that was lost long ago.',
  'I will someday get revenge on the corrupt temple hierarchy who branded me a heretic.',
  'I owe my life to the priest who took me in when my parents died.',
  'Everything I do is for the common people.',
  'I will do anything to protect the temple where I served.',
  'I seek to preserve a sacred text that my enemies consider heretical and seek to destroy.',
  'I have a family, but I have no idea where they are. One day, I hope to see them again.',
  'An injury to the unspoiled wilderness of my home is an injury to me.',
  'I am the last of my tribe, and it is up to me to ensure their names enter legend.',
  'My town or city is my home, and I\'ll fight to defend it.',
  'Someone saved my life on the battlefield. To this day, I will never leave a friend behind.',
  'I fight for those who cannot fight for themselves.',
  'I protect those who cannot protect themselves.',
  'My mentor gave me a journal full of lore and secrets — I must decipher its meaning.',
];

const RANDOM_FLAWS = [
  'I judge others harshly, and myself even more severely.',
  'I put too much trust in those who wield power within my faith.',
  'My piety sometimes leads me to blindly trust those that profess faith in my god.',
  'I am inflexible in my thinking.',
  'I am suspicious of strangers and expect the worst of them.',
  'Once I pick a goal, I become obsessed with it to the detriment of everything else.',
  'I have trouble keeping my true feelings hidden. My sharp tongue lands me in trouble.',
  'I\'d rather eat my armor than admit when I\'m wrong.',
  'I am too enamored of ale, wine, and other intoxicants.',
  'I remember every insult I\'ve received and nurse a silent resentment toward anyone who\'s ever wronged me.',
  'Violence is my answer to almost any challenge.',
  'I\'m convinced of the significance of my destiny, and blind to my shortcomings and the risk of failure.',
  'I have a weakness for the vices of the city, especially hard drink.',
  'I secretly believe that everyone is beneath me.',
  'I\'m never satisfied with what I have — I always want more.',
];

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ── Pack/unpack structured data into goals_motivations text field ── */

function packGoalsData(data) {
  return JSON.stringify({
    _v: 2,
    goals_text: data.goals_text || '',
    short_term_goals: data.short_term_goals || [],
    long_term_goals: data.long_term_goals || [],
    backstory_allies: data.backstory_allies || [],
    backstory_enemies: data.backstory_enemies || [],
    character_arc: data.character_arc || [],
    background_feature_name: data.background_feature_name || '',
    background_feature_desc: data.background_feature_desc || '',
  });
}

function unpackGoalsData(goalsStr) {
  const defaults = {
    goals_text: '',
    short_term_goals: [],
    long_term_goals: [],
    backstory_allies: [],
    backstory_enemies: [],
    character_arc: [],
    background_feature_name: '',
    background_feature_desc: '',
  };
  if (!goalsStr) return defaults;
  try {
    const parsed = JSON.parse(goalsStr);
    if (parsed._v) {
      // Migrate from v1 single background_feature to split name/desc
      if (parsed.background_feature && !parsed.background_feature_name) {
        parsed.background_feature_name = '';
        parsed.background_feature_desc = parsed.background_feature;
      }
      return { ...defaults, ...parsed };
    }
  } catch { /* legacy plain text */ }
  return { ...defaults, goals_text: goalsStr };
}

/* ── Personality card theme colors ── */
const PERSONALITY_CARDS = [
  { key: 'personality_traits', label: 'Personality Traits', color: 'blue', icon: User, placeholder: 'Two traits that describe your character\'s demeanor...' },
  { key: 'ideals', label: 'Ideals', color: 'gold', icon: Compass, placeholder: 'What principle does your character believe in above all? (include alignment tag, e.g. "Good" or "Lawful")' },
  { key: 'bonds', label: 'Bonds', color: 'green', icon: Link2, placeholder: 'A person, place, or thing your character cares deeply about...' },
  { key: 'flaws', label: 'Flaws', color: 'red', icon: AlertTriangle, placeholder: 'A weakness or vice that can be used against your character...' },
];

const CARD_STYLES = {
  blue:  { border: 'border-blue-500/40',    bg: 'bg-blue-500/[0.06]',    accent: 'text-blue-400' },
  gold:  { border: 'border-yellow-500/40',  bg: 'bg-yellow-500/[0.06]',  accent: 'text-yellow-400' },
  green: { border: 'border-emerald-500/40', bg: 'bg-emerald-500/[0.06]', accent: 'text-emerald-400' },
  red:   { border: 'border-red-500/40',     bg: 'bg-red-500/[0.06]',     accent: 'text-red-400' },
};

export default function Backstory({ characterId, character, onPortraitChange }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [npcs, setNpcs] = useState([]);
  const [expandedSections, setExpandedSections] = useState(new Set(['personality']));
  const [showAchieved, setShowAchieved] = useState(false);
  const fileInputRef = useRef(null);

  // AI backstory generation state
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [aiResults, setAiResults] = useState(null); // { personality_traits, ideals, bonds, flaws }
  const [showAiGenerator, setShowAiGenerator] = useState(false);

  const generatePersonality = async () => {
    setAiGenerating(true);
    setAiResults(null);
    try {
      const charName = character?.name || 'the character';
      const charRace = character?.race || '';
      const charClass = character?.primary_class || '';
      const charBg = data?.background_feature_name || character?.background || '';
      const backstory = data?.backstory_text?.slice(0, 500) || '';
      const userHint = aiPromptInput.trim();

      const system = `You are a D&D 5e character personality generator. Generate personality traits, ideals, bonds, and flaws for a character. Respond ONLY in this exact JSON format with no other text:
{"personality_traits":"...","ideals":"...","bonds":"...","flaws":"..."}
Each value should be 1-2 sentences. Make them specific, memorable, and roleplay-ready. Match the tone to the character's class and background.`;

      const prompt = `Generate personality for: ${charName}, a ${charRace} ${charClass}${charBg ? ` with ${charBg} background` : ''}.${backstory ? `\nBackstory context: ${backstory}` : ''}${userHint ? `\nPlayer wants: ${userHint}` : ''}`;

      const result = await generateAI(prompt, system, { temperature: 0.85, maxTokens: 512 });

      // Parse JSON from response — LLMs sometimes return malformed JSON
      const text = typeof result === 'string' ? result : result?.response || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        let raw = jsonMatch[0];
        // Fix common LLM JSON issues: trailing commas before }
        raw = raw.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
        let parsed;
        try {
          parsed = JSON.parse(raw);
        } catch {
          // Fallback: try to extract fields with regex if JSON is broken
          const extract = (key) => {
            const m = raw.match(new RegExp(`"${key}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`));
            return m ? m[1].replace(/\\"/g, '"').replace(/\\n/g, '\n') : '';
          };
          parsed = {
            personality_traits: extract('personality_traits'),
            ideals: extract('ideals'),
            bonds: extract('bonds'),
            flaws: extract('flaws'),
          };
          if (!parsed.personality_traits && !parsed.ideals && !parsed.bonds && !parsed.flaws) {
            toast.error('AI response was not in expected format. Try again.');
            return;
          }
        }
        setAiResults({
          personality_traits: parsed.personality_traits || '',
          ideals: parsed.ideals || '',
          bonds: parsed.bonds || '',
          flaws: parsed.flaws || '',
        });
      } else {
        toast.error('AI response was not in expected format. Try again.');
      }
    } catch (err) {
      const msg = err?.message || String(err);
      if (msg.includes('ollama') || msg.includes('connect')) {
        toast.error('Ollama is not running. Start Ollama to use AI generation.');
      } else {
        toast.error('AI generation failed: ' + msg);
      }
    } finally {
      setAiGenerating(false);
    }
  };

  const acceptAiResult = (key) => {
    if (aiResults?.[key]) {
      update(key, aiResults[key]);
      toast.success(`${PERSONALITY_CARDS.find(c => c.key === key)?.label || key} applied!`);
    }
  };

  const acceptAllAiResults = () => {
    if (!aiResults) return;
    for (const { key } of PERSONALITY_CARDS) {
      if (aiResults[key]) update(key, aiResults[key]);
    }
    setAiResults(null);
    setShowAiGenerator(false);
    toast.success('All personality traits applied!');
  };

  // Extra fields packed into goals_motivations
  const [extra, setExtra] = useState(null);

  useEffect(() => {
    getBackstory(characterId)
      .then((d) => {
        setData(d);
        setExtra(unpackGoalsData(d.goals_motivations));
        if (d.portrait_data) onPortraitChange?.(d.portrait_data);
      })
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [characterId, onPortraitChange]);

  useEffect(() => {
    getNPCs(characterId).then(setNpcs).catch(() => {});
  }, [characterId]);

  const saveFn = useCallback(async (d) => {
    await updateBackstory(characterId, d);
  }, [characterId]);

  const { trigger, saving, lastSaved } = useAutosave(saveFn);

  const update = (field, value) => {
    const updated = { ...data, [field]: value };
    setData(updated);
    trigger(updated);
    if (field === 'portrait_data') onPortraitChange?.(value);
  };

  const updateExtra = (field, value) => {
    const newExtra = { ...extra, [field]: value };
    setExtra(newExtra);
    const packed = packGoalsData(newExtra);
    const updated = { ...data, goals_motivations: packed };
    setData(updated);
    trigger(updated);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const handleImageFile = async (file) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Please upload a PNG, JPEG, WebP, or GIF image');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('Image must be under 2 MB');
      return;
    }
    try {
      const dataUrl = await readFileAsDataURL(file);
      update('portrait_data', dataUrl);
      toast.success('Portrait updated');
    } catch {
      toast.error('Failed to read image');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleImageFile(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setDragOver(false); };

  const removePortrait = () => {
    update('portrait_data', '');
    toast.success('Portrait removed');
  };

  /* ── Goal management ── */
  const addGoal = (type) => {
    const key = type === 'short' ? 'short_term_goals' : 'long_term_goals';
    const goals = [...(extra[key] || [])];
    goals.push({ title: '', description: '', completed: false });
    updateExtra(key, goals);
  };

  const updateGoal = (type, index, field, value) => {
    const key = type === 'short' ? 'short_term_goals' : 'long_term_goals';
    const goals = [...(extra[key] || [])];
    goals[index] = { ...goals[index], [field]: value };
    updateExtra(key, goals);
  };

  const removeGoal = (type, index) => {
    const key = type === 'short' ? 'short_term_goals' : 'long_term_goals';
    updateExtra(key, (extra[key] || []).filter((_, i) => i !== index));
  };

  /* ── Allies & enemies ── */
  const addRelation = (type) => {
    const key = type === 'ally' ? 'backstory_allies' : 'backstory_enemies';
    const list = [...(extra[key] || [])];
    list.push({ name: '', notes: '' });
    updateExtra(key, list);
  };

  const updateRelation = (type, index, field, value) => {
    const key = type === 'ally' ? 'backstory_allies' : 'backstory_enemies';
    const list = [...(extra[key] || [])];
    list[index] = { ...list[index], [field]: value };
    updateExtra(key, list);
  };

  const removeRelation = (type, index) => {
    const key = type === 'ally' ? 'backstory_allies' : 'backstory_enemies';
    updateExtra(key, (extra[key] || []).filter((_, i) => i !== index));
  };

  /* ── Character arc milestones ── */
  const addArcEntry = () => {
    const arc = [...(extra.character_arc || [])];
    arc.push({ title: '', description: '', session: '', date: new Date().toISOString().split('T')[0] });
    updateExtra('character_arc', arc);
  };

  const updateArcEntry = (index, field, value) => {
    const arc = [...(extra.character_arc || [])];
    arc[index] = { ...arc[index], [field]: value };
    updateExtra('character_arc', arc);
  };

  const removeArcEntry = (index) => {
    updateExtra('character_arc', (extra.character_arc || []).filter((_, i) => i !== index));
  };

  /* ── NPC link check ── */
  const isNpcLinked = (name) => {
    if (!name || npcs.length === 0) return false;
    return npcs.some(n => n.name && n.name.toLowerCase() === name.toLowerCase());
  };

  /* ── Computed values ── */
  const goalsProgress = useMemo(() => {
    if (!extra) return { short: { done: 0, total: 0 }, long: { done: 0, total: 0 } };
    const s = extra.short_term_goals || [];
    const l = extra.long_term_goals || [];
    return {
      short: { done: s.filter(g => g.completed).length, total: s.length },
      long: { done: l.filter(g => g.completed).length, total: l.length },
    };
  }, [extra]);

  const activeShortGoals = useMemo(() => (extra?.short_term_goals || []).map((g, i) => ({ ...g, _i: i })).filter(g => !g.completed), [extra]);
  const activeLongGoals = useMemo(() => (extra?.long_term_goals || []).map((g, i) => ({ ...g, _i: i })).filter(g => !g.completed), [extra]);
  const achievedGoals = useMemo(() => [
    ...(extra?.short_term_goals || []).map((g, i) => ({ ...g, _i: i, _type: 'short' })).filter(g => g.completed),
    ...(extra?.long_term_goals || []).map((g, i) => ({ ...g, _i: i, _type: 'long' })).filter(g => g.completed),
  ], [extra]);

  if (loading || !data || !extra) return (
    <div className="flex items-center justify-center gap-2 py-12 text-amber-200/40">
      <Spinner size={18} className="animate-spin" />
      <span>Loading backstory...</span>
    </div>
  );

  // Content indicators for collapsed sections
  const sectionHints = {
    backstory: (() => {
      const text = data.backstory_text || '';
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      return words > 0 ? `${words} words` : 'Empty';
    })(),
    goals: (() => {
      const total = goalsProgress.short.total + goalsProgress.long.total;
      const done = goalsProgress.short.done + goalsProgress.long.done;
      return total > 0 ? `${done}/${total} complete` : 'No goals';
    })(),
    relations: (() => {
      const allies = (extra?.backstory_allies || []).length;
      const enemies = (extra?.backstory_enemies || []).length;
      const parts = [];
      if (allies > 0) parts.push(`${allies} all${allies > 1 ? 'ies' : 'y'}`);
      if (enemies > 0) parts.push(`${enemies} enem${enemies > 1 ? 'ies' : 'y'}`);
      return parts.length > 0 ? parts.join(' \u00B7 ') : 'None';
    })(),
    arc: `${(extra?.character_arc || []).length} entries`,
    personality: (() => {
      const filled = PERSONALITY_CARDS.filter(({ key }) => data[key]?.trim()).length;
      return `${filled}/4 filled`;
    })(),
  };

  const renderSectionHeader = (id, title, SectionIcon, children) => (
    <button onClick={() => toggleSection(id)} className="flex items-center gap-2 w-full text-left group">
      {expandedSections.has(id) ? <ChevronDown size={14} className="text-amber-200/30" /> : <ChevronRight size={14} className="text-amber-200/30" />}
      {SectionIcon && <SectionIcon size={15} className="text-gold/60" />}
      <h3 className="font-display text-amber-100">{title}</h3>
      {children}
      {!expandedSections.has(id) && sectionHints[id] && (
        <span className="text-xs text-amber-200/30 ml-2 font-mono">{sectionHints[id]}</span>
      )}
    </button>
  );

  return (
    <div className="space-y-6 max-w-none">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display text-amber-100">Backstory & Details<HelpTooltip text={HELP.background} /></h2>
          <p className="text-xs text-amber-200/40 mt-1">Your character's history, personality, goals, and relationships. Track how they grow and change over the campaign.</p>
        </div>
        <SaveIndicator saving={saving} lastSaved={lastSaved} />
      </div>

      {/* Physical Summary Bar */}
      {(() => {
        const fields = [
          { key: 'age', label: 'Age', icon: Calendar },
          { key: 'height', label: 'Height', icon: Ruler },
          { key: 'weight', label: 'Weight', icon: Weight },
        ];
        const filled = fields.filter(f => data[f.key]?.trim());
        if (filled.length === 0 && goalsProgress.short.total === 0 && goalsProgress.long.total === 0) return null;
        return (
          <div className="flex items-center gap-4 px-4 py-2.5 rounded-lg bg-amber-200/[0.04] border border-amber-200/10 flex-wrap">
            {filled.map(({ key, label, icon: Icon }) => ( // eslint-disable-line no-unused-vars
              <div key={key} className="flex items-center gap-1.5">
                <Icon size={13} className="text-gold/50" />
                <span className="text-xs text-amber-200/40">{label}:</span>
                <span className="text-xs text-amber-100/80 font-medium">{data[key]}</span>
              </div>
            ))}
            {data.eyes?.trim() && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-amber-200/40">Eyes:</span>
                <span className="text-xs text-amber-100/80 font-medium">{data.eyes}</span>
              </div>
            )}
            {data.hair?.trim() && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-amber-200/40">Hair:</span>
                <span className="text-xs text-amber-100/80 font-medium">{data.hair}</span>
              </div>
            )}
            {data.skin?.trim() && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-amber-200/40">Skin:</span>
                <span className="text-xs text-amber-100/80 font-medium">{data.skin}</span>
              </div>
            )}
            {(goalsProgress.short.total > 0 || goalsProgress.long.total > 0) && (
              <div className="flex items-center gap-1.5 ml-auto">
                <Target size={13} className="text-gold/50" />
                <span className="text-xs text-amber-200/40">Goals:</span>
                <span className="text-xs text-amber-100/80 font-medium">
                  {goalsProgress.short.done + goalsProgress.long.done}/{goalsProgress.short.total + goalsProgress.long.total} complete
                </span>
              </div>
            )}
          </div>
        );
      })()}

      {/* Character Portrait */}
      <div className="card">
        <h3 className="font-display text-amber-100 mb-3">Character Portrait</h3>
        <div className="flex items-start gap-6">
          {data.portrait_data ? (
            <div className="relative group shrink-0">
              <img src={data.portrait_data} alt="Character portrait" className="w-40 h-40 rounded-lg object-cover border-2 border-gold/30" />
              <button onClick={removePortrait}
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-900/80 border border-red-500/50 text-red-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-800"
                title="Remove portrait" aria-label="Remove portrait">
                <Trash2 size={14} />
              </button>
            </div>
          ) : null}
          <div onClick={() => fileInputRef.current?.click()} onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragOver} onDragLeave={handleDragLeave}
            className={`flex-1 min-h-[160px] rounded-lg border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
              dragOver ? 'border-gold bg-gold/10' : 'border-amber-200/15 hover:border-gold/40 hover:bg-white/[0.02]'
            }`}>
            <ImagePlus size={32} className="text-amber-200/30" />
            <p className="text-sm text-amber-200/40">{data.portrait_data ? 'Click or drag to replace' : 'Click or drag an image here'}</p>
            <p className="text-xs text-amber-200/20">PNG, JPEG, WebP, or GIF — max 2 MB</p>
          </div>
          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={(e) => handleImageFile(e.target.files[0])} />
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/*  1. PERSONALITY FIELDS — 2x2 colored cards                */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="card">
        {renderSectionHeader('personality', 'Personality')}
        {expandedSections.has('personality') && (
          <div className="mt-3">
            <p className="text-xs text-amber-200/30 mb-3">The D&D 5e standard personality fields from your background. These guide how you roleplay your character.</p>

            {/* AI Generator */}
            <div className="mb-4">
              <button
                onClick={() => setShowAiGenerator(v => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-purple-500/30 bg-purple-500/[0.06] hover:bg-purple-500/[0.12] text-purple-300 text-xs font-medium transition-all"
              >
                <Sparkles size={13} />
                Generate with AI
                {showAiGenerator ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </button>

              {showAiGenerator && (
                <div className="mt-3 p-4 rounded-lg border border-purple-500/20 bg-purple-500/[0.04]">
                  <label className="text-xs text-purple-300/70 mb-2 block">Describe the vibe you want (optional)</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      className="input flex-1 text-sm"
                      placeholder='e.g. "brooding loner with a dark secret" or "cheerful optimist"'
                      value={aiPromptInput}
                      onChange={e => setAiPromptInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !aiGenerating) generatePersonality(); }}
                    />
                    <button
                      onClick={generatePersonality}
                      disabled={aiGenerating}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors"
                    >
                      {aiGenerating ? <Spinner size={13} className="animate-spin" /> : <Sparkles size={13} />}
                      {aiGenerating ? 'Generating...' : 'Generate'}
                    </button>
                  </div>

                  {aiResults && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-purple-300/60 font-medium">AI Suggestions</span>
                        <div className="flex gap-2">
                          <button
                            onClick={generatePersonality}
                            disabled={aiGenerating}
                            className="flex items-center gap-1 text-[11px] text-purple-300/50 hover:text-purple-200 transition-colors"
                          >
                            <RefreshCw size={11} /> Reroll All
                          </button>
                          <button
                            onClick={acceptAllAiResults}
                            className="flex items-center gap-1 text-[11px] text-emerald-400/70 hover:text-emerald-300 transition-colors font-medium"
                          >
                            <CheckIcon size={11} /> Accept All
                          </button>
                        </div>
                      </div>
                      {PERSONALITY_CARDS.map(({ key, label, color }) => {
                        const s = CARD_STYLES[color];
                        return aiResults[key] ? (
                          <div key={key} className={`flex items-start gap-3 p-3 rounded-lg border ${s.border} ${s.bg}`}>
                            <div className="flex-1 min-w-0">
                              <span className={`text-[11px] font-semibold ${s.accent} block mb-1`}>{label}</span>
                              <p className="text-xs text-amber-100/70 leading-relaxed">{aiResults[key]}</p>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <button
                                onClick={() => acceptAiResult(key)}
                                className="p-1.5 rounded bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors"
                                title="Accept"
                              >
                                <CheckIcon size={12} />
                              </button>
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PERSONALITY_CARDS.map(({ key, label, color, icon: CardIcon, placeholder }) => {
                const s = CARD_STYLES[color];
                const randomTable = key === 'personality_traits' ? RANDOM_TRAITS : key === 'ideals' ? RANDOM_IDEALS : key === 'bonds' ? RANDOM_BONDS : RANDOM_FLAWS;
                const isEmpty = !(data[key] || '').trim();
                return (
                  <div key={key} className={`rounded-lg border-2 ${s.border} ${s.bg} p-4 transition-colors`}>
                    <div className="flex items-center justify-between mb-2">
                      <label className={`text-sm font-semibold ${s.accent} flex items-center gap-1.5`}>
                        <CardIcon size={14} />
                        {label}
                      </label>
                      <button
                        onClick={() => {
                          const hasExisting = (data[key] || '').trim();
                          if (hasExisting && !window.confirm(`Replace your current ${label.toLowerCase()} with a random one?`)) return;
                          const pick = randomTable[Math.floor(Math.random() * randomTable.length)];
                          update(key, pick);
                          toast.success(`Random ${label.toLowerCase()} applied!`);
                        }}
                        className="flex items-center gap-1 text-[11px] text-amber-200/35 hover:text-amber-200/70 transition-colors px-1.5 py-0.5 rounded hover:bg-white/5"
                        title={`Random ${label.toLowerCase()} (no AI needed)`}
                      >
                        <Dice5 size={12} /> Random
                      </button>
                    </div>
                    {isEmpty && (
                      <div className="flex flex-col items-center py-2 mb-1">
                        <CardIcon size={22} className={`${s.accent} opacity-25 mb-1`} />
                        <span className="text-[11px] text-amber-200/20">No {label.toLowerCase()} added yet</span>
                      </div>
                    )}
                    <textarea
                      className="w-full h-24 resize-none bg-transparent border border-amber-200/10 rounded-md px-3 py-2 text-sm text-amber-100 placeholder-amber-200/20 focus:outline-none focus:border-amber-200/30 transition-colors"
                      placeholder={placeholder}
                      value={data[key] || ''}
                      onChange={e => update(key, e.target.value)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/*  BACKSTORY TEXT                                            */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="card">
        {renderSectionHeader('backstory', 'Character Backstory')}
        {expandedSections.has('backstory') && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span />
              {data.backstory_text?.trim() && (
                <button onClick={() => {
                    navigator.clipboard.writeText(data.backstory_text).then(
                      () => toast.success('Backstory copied to clipboard'),
                      () => toast.error('Failed to copy')
                    );
                  }}
                  className="flex items-center gap-1 text-xs text-amber-200/40 hover:text-gold transition-colors px-2 py-1 rounded hover:bg-gold/10">
                  <Copy size={12} /> Copy
                </button>
              )}
            </div>
            <div data-color-mode="dark">
              <MDEditor value={data.backstory_text} onChange={v => update('backstory_text', v || '')} height={250} preview="edit" />
            </div>
            {(() => {
              const text = data.backstory_text || '';
              const chars = text.length;
              const words = text.trim() ? text.trim().split(/\s+/).length : 0;
              return (
                <div className="text-xs text-amber-200/25 mt-1.5 text-right">
                  {words} {words === 1 ? 'word' : 'words'} / {chars} {chars === 1 ? 'character' : 'characters'}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/*  5. BACKGROUND FEATURE                                    */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="card">
        {renderSectionHeader('background', 'Background Feature', Shield)}
        {expandedSections.has('background') && (
          <div className="mt-3">
            <p className="text-xs text-amber-200/30 mb-3">The mechanical benefit from your character's background (e.g. "Shelter of the Faithful", "Criminal Contact").</p>

            {/* Background Preset Dropdown */}
            <div className="mb-4">
              <label className="label">Quick-fill from Standard Background</label>
              <select
                className="input w-full cursor-pointer"
                value=""
                onChange={e => {
                  const preset = BACKGROUND_PRESETS.find(b => b.name === e.target.value);
                  if (!preset) return;
                  const hasExisting = (extra.background_feature_name || '').trim() || (extra.background_feature_desc || '').trim();
                  if (hasExisting) {
                    if (!window.confirm(`This will replace your current background feature fields with "${preset.name} — ${preset.featureName}". Continue?`)) return;
                  }
                  updateExtra('background_feature_name', preset.featureName);
                  updateExtra('background_feature_desc', preset.featureDesc);
                  toast.success(`Applied ${preset.name} background feature`);
                }}
              >
                <option value="">-- Select a background to auto-fill --</option>
                {BACKGROUND_PRESETS.map(bg => (
                  <option key={bg.name} value={bg.name}>{bg.name} — {bg.featureName}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <div>
                <label className="label">Feature Name</label>
                <input
                  className="input w-full"
                  placeholder='e.g. "Shelter of the Faithful"'
                  value={extra.background_feature_name || ''}
                  onChange={e => updateExtra('background_feature_name', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  className="input w-full h-24 resize-none"
                  placeholder="Describe what this background feature lets you do..."
                  value={extra.background_feature_desc || ''}
                  onChange={e => updateExtra('background_feature_desc', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/*  2. CHARACTER GOALS                                       */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="card">
        {renderSectionHeader('goals', 'Character Goals', Target,
          (goalsProgress.short.total > 0 || goalsProgress.long.total > 0) && (
            <span className="text-xs text-amber-200/30 ml-2">
              {goalsProgress.short.done + goalsProgress.long.done}/{goalsProgress.short.total + goalsProgress.long.total} complete
            </span>
          )
        )}
        {expandedSections.has('goals') && (
          <div className="mt-3 space-y-4">
            {/* Short-term goals */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label mb-0 flex items-center gap-1"><Target size={12} className="text-amber-400" /> Short-term Goals</label>
                <button onClick={() => addGoal('short')} className="text-xs text-amber-200/40 hover:text-amber-200 flex items-center gap-1 px-2 py-1 rounded hover:bg-gold/10 transition-colors"><Plus size={12} /> Add</button>
              </div>
              {activeShortGoals.length === 0 && achievedGoals.filter(g => g._type === 'short').length === 0 ? (
                <p className="text-xs text-amber-200/20">No short-term goals yet — what does your character want to accomplish soon?</p>
              ) : (
                <div className="space-y-1.5">
                  {activeShortGoals.map(goal => (
                    <GoalRow key={goal._i} goal={goal} type="short" index={goal._i}
                      onToggle={updateGoal} onUpdate={updateGoal} onRemove={removeGoal} />
                  ))}
                </div>
              )}
            </div>

            {/* Long-term goals */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label mb-0 flex items-center gap-1"><Star size={12} className="text-gold" /> Long-term Goals</label>
                <button onClick={() => addGoal('long')} className="text-xs text-amber-200/40 hover:text-amber-200 flex items-center gap-1 px-2 py-1 rounded hover:bg-gold/10 transition-colors"><Plus size={12} /> Add</button>
              </div>
              {activeLongGoals.length === 0 && achievedGoals.filter(g => g._type === 'long').length === 0 ? (
                <p className="text-xs text-amber-200/20">No long-term goals yet — what is your character's ultimate ambition?</p>
              ) : (
                <div className="space-y-1.5">
                  {activeLongGoals.map(goal => (
                    <GoalRow key={goal._i} goal={goal} type="long" index={goal._i}
                      onToggle={updateGoal} onUpdate={updateGoal} onRemove={removeGoal} />
                  ))}
                </div>
              )}
            </div>

            {/* Achieved goals section */}
            {achievedGoals.length > 0 && (
              <div>
                <button onClick={() => setShowAchieved(v => !v)}
                  className="flex items-center gap-1.5 text-xs text-emerald-400/60 hover:text-emerald-400 transition-colors mb-2">
                  {showAchieved ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  <CheckSquare size={12} />
                  Achieved ({achievedGoals.length})
                </button>
                {showAchieved && (
                  <div className="space-y-1.5 pl-2 border-l-2 border-emerald-500/20">
                    {achievedGoals.map(goal => (
                      <GoalRow key={`${goal._type}-${goal._i}`} goal={goal} type={goal._type} index={goal._i}
                        onToggle={updateGoal} onUpdate={updateGoal} onRemove={removeGoal} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Legacy goals text (if migrated from old format) */}
            {extra.goals_text && (
              <div>
                <label className="label">Additional Goals & Motivations</label>
                <div data-color-mode="dark">
                  <MDEditor value={extra.goals_text} onChange={v => updateExtra('goals_text', v || '')} height={150} preview="edit" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/*  3. CHARACTER ARC TRACKER                                 */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="card">
        {renderSectionHeader('arc', 'Character Arc', Milestone,
          (extra.character_arc || []).length > 0 && (
            <span className="text-xs text-amber-200/30 ml-2">{(extra.character_arc || []).length} milestone{(extra.character_arc || []).length !== 1 ? 's' : ''}</span>
          )
        )}
        {expandedSections.has('arc') && (
          <div className="mt-3">
            <p className="text-xs text-amber-200/30 mb-3">Track the defining moments in your character's story. Record key moments of development.</p>

            {(extra.character_arc || []).length === 0 ? (
              <p className="text-xs text-amber-200/20 mb-3">No milestones yet — note key moments like "Overcame fear of undead" or "Forgave the betrayer".</p>
            ) : (
              <div className="relative pl-6 space-y-4 mb-4">
                {/* Vertical timeline line */}
                <div className="absolute left-[9px] top-1 bottom-1 w-0.5 bg-gold/20" />
                {(extra.character_arc || []).map((entry, i) => (
                  <div key={i} className="relative group">
                    {/* Timeline dot */}
                    <div className="absolute -left-[15px] top-2 w-3 h-3 rounded-full bg-gold/60 border-2 border-gold/30 group-hover:bg-gold transition-colors" />
                    <div className="p-3 rounded-lg bg-amber-200/[0.03] border border-amber-200/8 hover:border-amber-200/15 transition-colors">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 space-y-2">
                          <input
                            className="input w-full text-sm font-medium"
                            placeholder="Milestone title (e.g. Became guild leader)"
                            value={entry.title || entry.text || ''}
                            onChange={e => updateArcEntry(i, 'title', e.target.value)}
                          />
                          <textarea
                            className="input w-full text-xs resize-none h-14"
                            placeholder="What happened? How did your character change?"
                            value={entry.description || ''}
                            onChange={e => updateArcEntry(i, 'description', e.target.value)}
                          />
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-amber-200/30">Session:</span>
                              <input
                                className="input w-20 text-xs"
                                placeholder="#"
                                value={entry.session || ''}
                                onChange={e => updateArcEntry(i, 'session', e.target.value)}
                              />
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-amber-200/30">Date:</span>
                              <input
                                type="date"
                                className="input text-xs w-auto"
                                value={entry.date || ''}
                                onChange={e => updateArcEntry(i, 'date', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <button onClick={() => removeArcEntry(i)}
                          className="text-amber-200/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={addArcEntry} className="text-xs text-amber-200/40 hover:text-amber-200 flex items-center gap-1 px-2 py-1 rounded hover:bg-gold/10 transition-colors">
              <Plus size={12} /> Add Milestone
            </button>
          </div>
        )}
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/*  4. ALLIES & ENEMIES                                      */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="card">
        {renderSectionHeader('relations', 'Allies & Enemies', Users)}
        {expandedSections.has('relations') && (
          <div className="mt-3 space-y-4">
            <p className="text-xs text-amber-200/30 mb-1">Key backstory NPCs. If a name matches a campaign NPC, it will be highlighted.</p>

            {/* Allies */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label mb-0 flex items-center gap-1">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400">
                    <Shield size={11} />
                  </span>
                  Allies
                </label>
                <button onClick={() => addRelation('ally')} className="text-xs text-amber-200/40 hover:text-amber-200 flex items-center gap-1 px-2 py-1 rounded hover:bg-gold/10 transition-colors"><Plus size={12} /> Add</button>
              </div>
              {(extra.backstory_allies || []).length === 0 ? (
                <p className="text-xs text-amber-200/20">No backstory allies yet</p>
              ) : (
                <div className="space-y-2">
                  {(extra.backstory_allies || []).map((ally, i) => {
                    const linked = isNpcLinked(ally.name);
                    return (
                      <div key={i} className={`group flex items-start gap-2 p-3 rounded-lg border transition-colors ${linked ? 'border-emerald-500/25 bg-emerald-950/10' : 'border-amber-200/8 bg-amber-200/[0.02]'}`}>
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-400 shrink-0 mt-0.5">
                          <Shield size={13} />
                        </span>
                        <div className="flex-1 space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <input className="input flex-1 text-sm font-medium" value={ally.name || ''} onChange={e => updateRelation('ally', i, 'name', e.target.value)} placeholder="Name" />
                            {linked && <span className="text-[10px] bg-emerald-800/30 text-emerald-300 px-1.5 py-0.5 rounded shrink-0">In Campaign</span>}
                          </div>
                          <input className="input w-full text-xs" value={ally.notes || ally.description || ''} onChange={e => updateRelation('ally', i, 'notes', e.target.value)} placeholder="Notes about this relationship..." />
                        </div>
                        <button onClick={() => removeRelation('ally', i)} className="text-amber-200/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0 mt-1"><Trash2 size={12} /></button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Enemies */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label mb-0 flex items-center gap-1">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500/20 text-red-400">
                    <Swords size={11} />
                  </span>
                  Enemies
                </label>
                <button onClick={() => addRelation('enemy')} className="text-xs text-amber-200/40 hover:text-amber-200 flex items-center gap-1 px-2 py-1 rounded hover:bg-gold/10 transition-colors"><Plus size={12} /> Add</button>
              </div>
              {(extra.backstory_enemies || []).length === 0 ? (
                <p className="text-xs text-amber-200/20">No backstory enemies yet</p>
              ) : (
                <div className="space-y-2">
                  {(extra.backstory_enemies || []).map((enemy, i) => {
                    const linked = isNpcLinked(enemy.name);
                    return (
                      <div key={i} className={`group flex items-start gap-2 p-3 rounded-lg border transition-colors ${linked ? 'border-red-500/25 bg-red-950/10' : 'border-amber-200/8 bg-amber-200/[0.02]'}`}>
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-500/15 text-red-400 shrink-0 mt-0.5">
                          <Swords size={13} />
                        </span>
                        <div className="flex-1 space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <input className="input flex-1 text-sm font-medium" value={enemy.name || ''} onChange={e => updateRelation('enemy', i, 'name', e.target.value)} placeholder="Name" />
                            {linked && <span className="text-[10px] bg-red-800/30 text-red-300 px-1.5 py-0.5 rounded shrink-0">In Campaign</span>}
                          </div>
                          <input className="input w-full text-xs" value={enemy.notes || enemy.description || ''} onChange={e => updateRelation('enemy', i, 'notes', e.target.value)} placeholder="Why are they your enemy?" />
                        </div>
                        <button onClick={() => removeRelation('enemy', i)} className="text-amber-200/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0 mt-1"><Trash2 size={12} /></button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Physical */}
      <div className="card">
        {renderSectionHeader('physical', 'Physical Description')}
        {expandedSections.has('physical') && (
          <div className="mt-3">
            <p className="text-xs text-amber-200/30 mb-3">What does your character look like? These details help you and your party visualize them.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['age', 'height', 'weight', 'eyes', 'hair', 'skin'].map(f => (
                <div key={f}>
                  <label className="label capitalize">{f}</label>
                  <input className="input w-full" value={data[f]} onChange={e => update(f, e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Other details */}
      <div className="card">
        {renderSectionHeader('additional', 'Additional Details')}
        {expandedSections.has('additional') && (
          <div className="mt-3 space-y-4">
            <div>
              <label className="label">Allies & Organizations</label>
              <textarea className="input w-full h-20 resize-none" value={data.allies_organizations} onChange={e => update('allies_organizations', e.target.value)} />
            </div>
            <div>
              <label className="label">Appearance Notes</label>
              <textarea className="input w-full h-20 resize-none" value={data.appearance_notes} onChange={e => update('appearance_notes', e.target.value)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Goal row sub-component ── */
function GoalRow({ goal, type, index, onToggle, onUpdate, onRemove }) {
  return (
    <div className={`group flex items-start gap-2 p-2.5 rounded-lg border transition-colors ${
      goal.completed
        ? 'border-emerald-500/15 bg-emerald-950/5 border-l-2 border-l-emerald-500/40'
        : type === 'long'
          ? 'border-amber-200/8 bg-amber-200/[0.02] hover:border-amber-200/15 border-l-2 border-l-gold/40'
          : 'border-amber-200/8 bg-amber-200/[0.02] hover:border-amber-200/15 border-l-2 border-l-amber-400/40'
    }`}>
      <button onClick={() => onToggle(type, index, 'completed', !goal.completed)} className="mt-0.5 shrink-0">
        {goal.completed ? <CheckSquare size={15} className="text-emerald-400" /> : <Square size={15} className="text-amber-200/30 hover:text-amber-200/50" />}
      </button>
      <div className="flex-1 min-w-0 space-y-1">
        <input
          className={`input w-full font-medium ${goal.completed ? 'text-sm line-through text-amber-200/30' : 'text-[15px]'}`}
          value={goal.title || goal.text || ''}
          onChange={e => onUpdate(type, index, 'title', e.target.value)}
          placeholder="Goal title..."
        />
        <input
          className={`input w-full text-xs ${goal.completed ? 'line-through text-amber-200/20' : 'text-amber-200/50'}`}
          value={goal.description || ''}
          onChange={e => onUpdate(type, index, 'description', e.target.value)}
          placeholder="Description (optional)"
        />
      </div>
      <button onClick={() => onRemove(type, index)} className="text-amber-200/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0 mt-1">
        <Trash2 size={12} />
      </button>
    </div>
  );
}
