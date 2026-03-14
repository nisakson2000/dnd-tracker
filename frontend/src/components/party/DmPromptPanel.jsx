import { useState } from 'react';
import { Dice5, List, HelpCircle, MessageSquare, Send, Check, X, Users, User, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCampaignSync } from '../../contexts/CampaignSyncContext';
import { useParty } from '../../contexts/PartyContext';

const TABS = [
  { id: 'quick', label: 'Quick', icon: Zap },
  { id: 'roll', label: 'Roll', icon: Dice5 },
  { id: 'choice', label: 'Choice', icon: List },
  { id: 'confirm', label: 'Confirm', icon: HelpCircle },
  { id: 'free_text', label: 'Text', icon: MessageSquare },
];

const ROLL_TYPES = ['Ability Check', 'Saving Throw', 'Skill Check'];
const ABILITIES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
const SKILLS = [
  'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception',
  'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine',
  'Nature', 'Perception', 'Performance', 'Persuasion', 'Religion',
  'Sleight of Hand', 'Stealth', 'Survival',
];

// ── Premade D&D Quick Checks — accurate to 5e SRD ──
const DIFFICULTY_TIERS = [
  { id: 'easy', label: 'Easy', dc: 10, color: '#4ade80' },
  { id: 'medium', label: 'Medium', dc: 13, color: '#fbbf24' },
  { id: 'hard', label: 'Hard', dc: 15, color: '#f97316' },
  { id: 'deadly', label: 'Deadly', dc: 18, color: '#ef4444' },
];

const QUICK_CHECKS = [
  { label: 'Perception', skill: 'Perception', ability: 'WIS', category: 'awareness', body: 'The DM requests a Perception check. Use your senses to detect hidden threats or details.' },
  { label: 'Investigation', skill: 'Investigation', ability: 'INT', category: 'awareness', body: 'The DM requests an Investigation check. Search for clues, hidden compartments, or deduce information.' },
  { label: 'Insight', skill: 'Insight', ability: 'WIS', category: 'awareness', body: 'The DM requests an Insight check. Read body language and intentions — is someone lying?' },
  { label: 'Stealth', skill: 'Stealth', ability: 'DEX', category: 'exploration', body: 'The DM requests a Stealth check. Move silently and avoid detection.' },
  { label: 'Athletics', skill: 'Athletics', ability: 'STR', category: 'exploration', body: 'The DM requests an Athletics check. Climb, swim, jump, or grapple.' },
  { label: 'Acrobatics', skill: 'Acrobatics', ability: 'DEX', category: 'exploration', body: 'The DM requests an Acrobatics check. Balance, tumble, or perform agile maneuvers.' },
  { label: 'Arcana', skill: 'Arcana', ability: 'INT', category: 'knowledge', body: 'The DM requests an Arcana check. Recall magical lore, identify spells, or understand arcane phenomena.' },
  { label: 'Nature', skill: 'Nature', ability: 'INT', category: 'knowledge', body: 'The DM requests a Nature check. Identify plants, animals, weather patterns, or natural cycles.' },
  { label: 'History', skill: 'History', ability: 'INT', category: 'knowledge', body: 'The DM requests a History check. Recall historical events, people, wars, or ancient civilizations.' },
  { label: 'Religion', skill: 'Religion', ability: 'INT', category: 'knowledge', body: 'The DM requests a Religion check. Recall lore about deities, rites, prayers, or holy symbols.' },
  { label: 'Persuasion', skill: 'Persuasion', ability: 'CHA', category: 'social', body: 'The DM requests a Persuasion check. Convince someone through diplomacy, tact, or charm.' },
  { label: 'Deception', skill: 'Deception', ability: 'CHA', category: 'social', body: 'The DM requests a Deception check. Hide the truth through lies, misdirection, or ambiguous statements.' },
  { label: 'Intimidation', skill: 'Intimidation', ability: 'CHA', category: 'social', body: 'The DM requests an Intimidation check. Influence through threats, hostile actions, or physical menace.' },
  { label: 'Medicine', skill: 'Medicine', ability: 'WIS', category: 'utility', body: 'The DM requests a Medicine check. Stabilize a dying creature, diagnose illness, or apply first aid.' },
  { label: 'Survival', skill: 'Survival', ability: 'WIS', category: 'utility', body: 'The DM requests a Survival check. Track creatures, navigate wilderness, forage, or endure harsh conditions.' },
  { label: 'Animal Handling', skill: 'Animal Handling', ability: 'WIS', category: 'utility', body: 'The DM requests an Animal Handling check. Calm an animal, control a mount, or intuit an animal\'s intentions.' },
];

const QUICK_SAVES = [
  { label: 'DEX Save', ability: 'DEX', body: 'The DM requests a Dexterity Saving Throw. Dodge, evade, or react quickly!' },
  { label: 'CON Save', ability: 'CON', body: 'The DM requests a Constitution Saving Throw. Endure poison, disease, or physical hardship.' },
  { label: 'WIS Save', ability: 'WIS', body: 'The DM requests a Wisdom Saving Throw. Resist charm, fear, or mental effects.' },
  { label: 'STR Save', ability: 'STR', body: 'The DM requests a Strength Saving Throw. Resist being pushed, knocked prone, or restrained.' },
  { label: 'INT Save', ability: 'INT', body: 'The DM requests an Intelligence Saving Throw. Resist illusions or psychic intrusion.' },
  { label: 'CHA Save', ability: 'CHA', body: 'The DM requests a Charisma Saving Throw. Resist banishment or possession.' },
];

const CATEGORY_LABELS = {
  awareness: 'Awareness',
  exploration: 'Exploration',
  knowledge: 'Knowledge',
  social: 'Social',
  utility: 'Utility',
};
const CATEGORY_ORDER = ['awareness', 'exploration', 'social', 'knowledge', 'utility'];

export default function DmPromptPanel() {
  const { sendPrompt, promptResults } = useCampaignSync();
  const { members, myClientId } = useParty();
  const [tab, setTab] = useState('quick');
  const [targetMode, setTargetMode] = useState('all');
  const [selectedTargets, setSelectedTargets] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');

  // Roll tab state
  const [rollType, setRollType] = useState('Ability Check');
  const [rollAbility, setRollAbility] = useState('WIS');
  const [rollSkill, setRollSkill] = useState('Perception');
  const [rollDc, setRollDc] = useState('');

  // Choice tab state
  const [choiceTitle, setChoiceTitle] = useState('');
  const [choiceBody, setChoiceBody] = useState('');
  const [choiceOptions, setChoiceOptions] = useState(['', '']);

  // Confirm tab state
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmDesc, setConfirmDesc] = useState('');

  // Free text tab state
  const [freeTextQuestion, setFreeTextQuestion] = useState('');

  // Active prompt tracking
  const [activePromptIds, setActivePromptIds] = useState([]);

  const otherMembers = members.filter(m => m.client_id !== myClientId);

  const toggleTarget = (clientId) => {
    setSelectedTargets(prev =>
      prev.includes(clientId) ? prev.filter(id => id !== clientId) : [...prev, clientId]
    );
  };

  const getTargets = () => {
    if (targetMode === 'all') return null;
    return selectedTargets;
  };

  // ── Quick check sender ──
  const sendQuickCheck = (check, isSave = false) => {
    const tier = DIFFICULTY_TIERS.find(t => t.id === selectedDifficulty) || DIFFICULTY_TIERS[1];
    const targets = getTargets();
    const label = isSave
      ? `${check.ability} Saving Throw`
      : `${check.skill} Check`;
    const promptId = sendPrompt('roll_check', {
      roll_type: isSave ? 'Saving Throw' : 'Skill Check',
      ability: check.ability,
      skill: isSave ? null : check.skill,
      dc: tier.dc,
      label,
      body: check.body,
    }, targets);
    setActivePromptIds(prev => [...prev, promptId]);
    toast.success(`${label} (DC ${tier.dc})`);
  };

  const handleSendRoll = () => {
    const label = rollType === 'Skill Check' ? rollSkill : `${rollAbility} ${rollType === 'Saving Throw' ? 'Save' : 'Check'}`;
    const targets = getTargets();
    const promptId = sendPrompt('roll_check', {
      roll_type: rollType,
      ability: rollAbility,
      skill: rollType === 'Skill Check' ? rollSkill : null,
      dc: rollDc ? parseInt(rollDc) : null,
      label,
    }, targets);
    setActivePromptIds(prev => [...prev, promptId]);
    toast.success(`Requested: ${label}`);
  };

  const handleSendChoice = () => {
    const opts = choiceOptions.filter(o => o.trim());
    if (opts.length < 2) { toast.error('Need at least 2 options'); return; }
    if (!choiceTitle.trim()) { toast.error('Add a title'); return; }
    const targets = getTargets();
    const promptId = sendPrompt('choice', {
      title: choiceTitle.trim(),
      body: choiceBody.trim(),
      options: opts,
    }, targets);
    setActivePromptIds(prev => [...prev, promptId]);
    setChoiceTitle(''); setChoiceBody(''); setChoiceOptions(['', '']);
    toast.success('Choice sent!');
  };

  const handleSendConfirm = () => {
    if (!confirmTitle.trim()) { toast.error('Add a title'); return; }
    const targets = getTargets();
    const promptId = sendPrompt('confirm', {
      title: confirmTitle.trim(),
      description: confirmDesc.trim(),
    }, targets);
    setActivePromptIds(prev => [...prev, promptId]);
    setConfirmTitle(''); setConfirmDesc('');
    toast.success('Confirmation sent!');
  };

  const handleSendFreeText = () => {
    if (!freeTextQuestion.trim()) { toast.error('Write a question'); return; }
    const targets = getTargets();
    const promptId = sendPrompt('free_text', {
      question: freeTextQuestion.trim(),
    }, targets);
    setActivePromptIds(prev => [...prev, promptId]);
    setFreeTextQuestion('');
    toast.success('Question sent!');
  };

  return (
    <div className="card border-gold/15 space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-gold/60 flex items-center gap-2">
        <Dice5 size={13} /> DM Prompts
      </h3>

      {/* Tabs */}
      <div className="flex gap-1">
        {TABS.map(t => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs transition-all"
              style={{
                background: active ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.06)'}`,
                color: active ? '#c9a84c' : 'rgba(255,255,255,0.4)',
              }}
            >
              <Icon size={11} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Target selector */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-amber-200/30">Target:</span>
        <button
          onClick={() => { setTargetMode('all'); setSelectedTargets([]); }}
          className="flex items-center gap-1 px-2 py-1 rounded transition-all"
          style={{
            background: targetMode === 'all' ? 'rgba(74,222,128,0.1)' : 'transparent',
            border: `1px solid ${targetMode === 'all' ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.06)'}`,
            color: targetMode === 'all' ? '#4ade80' : 'rgba(255,255,255,0.35)',
          }}
        >
          <Users size={10} /> All
        </button>
        <button
          onClick={() => setTargetMode('select')}
          className="flex items-center gap-1 px-2 py-1 rounded transition-all"
          style={{
            background: targetMode === 'select' ? 'rgba(96,165,250,0.1)' : 'transparent',
            border: `1px solid ${targetMode === 'select' ? 'rgba(96,165,250,0.3)' : 'rgba(255,255,255,0.06)'}`,
            color: targetMode === 'select' ? '#60a5fa' : 'rgba(255,255,255,0.35)',
          }}
        >
          <User size={10} /> Select
        </button>
      </div>

      {targetMode === 'select' && (
        <div className="flex flex-wrap gap-1.5">
          {otherMembers.map(m => {
            const selected = selectedTargets.includes(m.client_id);
            return (
              <button
                key={m.client_id}
                onClick={() => toggleTarget(m.client_id)}
                className="px-2 py-1 rounded text-xs transition-all"
                style={{
                  background: selected ? 'rgba(96,165,250,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${selected ? 'rgba(96,165,250,0.4)' : 'rgba(255,255,255,0.06)'}`,
                  color: selected ? '#93c5fd' : 'rgba(255,255,255,0.35)',
                }}
              >
                {m.character?.name || 'Unknown'}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Quick Checks tab ── */}
      {tab === 'quick' && (
        <div className="space-y-3">
          {/* Difficulty selector */}
          <div>
            <div className="text-[10px] text-amber-200/25 uppercase tracking-wider mb-1.5">Difficulty (DC)</div>
            <div className="flex gap-1.5">
              {DIFFICULTY_TIERS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedDifficulty(t.id)}
                  className="flex-1 py-1.5 rounded text-xs font-semibold transition-all text-center"
                  style={{
                    background: selectedDifficulty === t.id ? `${t.color}18` : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${selectedDifficulty === t.id ? `${t.color}50` : 'rgba(255,255,255,0.05)'}`,
                    color: selectedDifficulty === t.id ? t.color : 'rgba(255,255,255,0.3)',
                  }}
                >
                  {t.label} ({t.dc})
                </button>
              ))}
            </div>
          </div>

          {/* Skill checks by category */}
          {CATEGORY_ORDER.map(cat => {
            const checks = QUICK_CHECKS.filter(c => c.category === cat);
            return (
              <div key={cat}>
                <div className="text-[10px] text-amber-200/20 uppercase tracking-wider mb-1">{CATEGORY_LABELS[cat]}</div>
                <div className="flex flex-wrap gap-1">
                  {checks.map(check => (
                    <button
                      key={check.skill}
                      onClick={() => sendQuickCheck(check)}
                      className="px-2 py-1 rounded text-[10px] font-medium transition-all"
                      style={{
                        background: 'rgba(201,168,76,0.06)',
                        border: '1px solid rgba(201,168,76,0.15)',
                        color: 'rgba(201,168,76,0.7)',
                      }}
                      title={`${check.skill} (${check.ability}) — ${check.body}`}
                    >
                      {check.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Saving throws */}
          <div>
            <div className="text-[10px] text-red-400/30 uppercase tracking-wider mb-1">Saving Throws</div>
            <div className="flex flex-wrap gap-1">
              {QUICK_SAVES.map(save => (
                <button
                  key={save.ability}
                  onClick={() => sendQuickCheck(save, true)}
                  className="px-2 py-1 rounded text-[10px] font-medium transition-all"
                  style={{
                    background: 'rgba(239,68,68,0.06)',
                    border: '1px solid rgba(239,68,68,0.15)',
                    color: 'rgba(239,68,68,0.6)',
                  }}
                  title={save.body}
                >
                  {save.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Roll tab */}
      {tab === 'roll' && (
        <div className="space-y-2">
          <select className="input w-full text-sm" value={rollType} onChange={e => setRollType(e.target.value)}>
            {ROLL_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          {rollType === 'Skill Check' ? (
            <select className="input w-full text-sm" value={rollSkill} onChange={e => setRollSkill(e.target.value)}>
              {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          ) : (
            <select className="input w-full text-sm" value={rollAbility} onChange={e => setRollAbility(e.target.value)}>
              {ABILITIES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          )}
          <input
            className="input w-full text-sm"
            placeholder="DC (optional, DM-only)"
            type="number" min={1} max={30}
            value={rollDc}
            onChange={e => setRollDc(e.target.value)}
          />
          <button onClick={handleSendRoll} className="btn-primary text-xs flex items-center gap-1.5 px-4 py-2">
            <Send size={12} /> Request Roll
          </button>
        </div>
      )}

      {/* Choice tab */}
      {tab === 'choice' && (
        <div className="space-y-2">
          <input className="input w-full text-sm" placeholder="Choice title" value={choiceTitle} onChange={e => setChoiceTitle(e.target.value)} />
          <input className="input w-full text-sm" placeholder="Description (optional)" value={choiceBody} onChange={e => setChoiceBody(e.target.value)} />
          {choiceOptions.map((opt, i) => (
            <div key={i} className="flex gap-1.5">
              <input
                className="input flex-1 text-sm"
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={e => setChoiceOptions(prev => prev.map((o, j) => j === i ? e.target.value : o))}
              />
              {choiceOptions.length > 2 && (
                <button onClick={() => setChoiceOptions(prev => prev.filter((_, j) => j !== i))} className="text-red-400/50 hover:text-red-400 p-1">
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
          {choiceOptions.length < 6 && (
            <button onClick={() => setChoiceOptions(prev => [...prev, ''])} className="text-xs text-amber-200/30 hover:text-amber-200/60">
              + Add option
            </button>
          )}
          <button onClick={handleSendChoice} className="btn-primary text-xs flex items-center gap-1.5 px-4 py-2">
            <Send size={12} /> Send Choice
          </button>
        </div>
      )}

      {/* Confirm tab */}
      {tab === 'confirm' && (
        <div className="space-y-2">
          <input className="input w-full text-sm" placeholder="Question / title" value={confirmTitle} onChange={e => setConfirmTitle(e.target.value)} />
          <textarea className="input w-full text-sm" placeholder="Description (optional)" rows={2} value={confirmDesc} onChange={e => setConfirmDesc(e.target.value)} style={{ resize: 'vertical' }} />
          <button onClick={handleSendConfirm} className="btn-primary text-xs flex items-center gap-1.5 px-4 py-2">
            <Send size={12} /> Send Confirmation
          </button>
        </div>
      )}

      {/* Free text tab */}
      {tab === 'free_text' && (
        <div className="space-y-2">
          <textarea className="input w-full text-sm" placeholder="What do you want to ask your players?" rows={3} value={freeTextQuestion} onChange={e => setFreeTextQuestion(e.target.value)} style={{ resize: 'vertical' }} />
          <button onClick={handleSendFreeText} className="btn-primary text-xs flex items-center gap-1.5 px-4 py-2">
            <Send size={12} /> Send Question
          </button>
        </div>
      )}

      {/* Results panel */}
      {activePromptIds.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-amber-200/8">
          <div className="text-[10px] text-amber-200/25 uppercase tracking-wider">Responses</div>
          {activePromptIds.slice(-5).reverse().map(pid => {
            const results = promptResults[pid] || [];
            return (
              <div key={pid} className="text-xs space-y-1">
                <div className="text-amber-200/30 font-mono text-[10px]">{pid}</div>
                {results.length === 0 ? (
                  <div className="text-amber-200/20 italic">Waiting for responses...</div>
                ) : (
                  results.map((r, i) => (
                    <div key={i} className="flex items-center gap-2 py-1 px-2 rounded bg-white/[0.02]">
                      <span className="text-amber-100 font-medium">{r.name || r.client_id?.slice(0, 4)}</span>
                      {r.roll_total !== undefined ? (
                        <span className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-gold">{r.roll_total}</span>
                          {r.breakdown && <span className="text-amber-200/25">{r.breakdown}</span>}
                          {r.pass !== undefined && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${r.pass ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/15 text-red-400 border border-red-500/20'}`}>
                              {r.pass ? 'PASS' : 'FAIL'}
                            </span>
                          )}
                        </span>
                      ) : r.choice !== undefined ? (
                        <span className="text-blue-300">{r.choice}</span>
                      ) : r.accepted !== undefined ? (
                        <span className={r.accepted ? 'text-emerald-400' : 'text-red-400'}>
                          {r.accepted ? 'Accepted' : 'Declined'}
                        </span>
                      ) : r.text !== undefined ? (
                        <span className="text-amber-200/60 italic">"{r.text}"</span>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
