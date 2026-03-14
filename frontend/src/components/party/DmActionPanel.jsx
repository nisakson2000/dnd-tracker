import { useState, useMemo, useCallback } from 'react';
import {
  Zap, Target, Gift, Users2, ClipboardList, Send, Plus, X,
  Users, User, Check, ShieldAlert, Swords, Eye, MessageSquare, AlertTriangle,
  EyeOff, Search, Brain,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useCampaignSync } from '../../contexts/CampaignSyncContext';
import { useParty } from '../../contexts/PartyContext';
import { CONDITION_EFFECTS } from '../../data/conditionEffects';

// ── Constants ──

const TABS = [
  { id: 'quick', label: 'Quick', icon: Zap },
  { id: 'skill', label: 'Skill Check', icon: Target },
  { id: 'conditions', label: 'Conditions', icon: AlertTriangle },
  { id: 'loot', label: 'Loot', icon: Gift },
  { id: 'social', label: 'Social', icon: Users2 },
  { id: 'results', label: 'Results', icon: ClipboardList },
];

const ALL_CONDITIONS = Object.keys(CONDITION_EFFECTS);
const CONDITION_COLORS = {
  Blinded: '#94a3b8', Charmed: '#f0abfc', Deafened: '#94a3b8', Frightened: '#fbbf24',
  Grappled: '#f97316', Incapacitated: '#ef4444', Invisible: '#a78bfa', Paralyzed: '#ef4444',
  Petrified: '#6b7280', Poisoned: '#4ade80', Prone: '#f97316', Restrained: '#f97316',
  Stunned: '#eab308', Unconscious: '#ef4444',
};

const DIFFICULTY_TIERS = [
  { id: 'easy', label: 'Easy', dc: 10, color: '#4ade80' },
  { id: 'medium', label: 'Medium', dc: 13, color: '#fbbf24' },
  { id: 'hard', label: 'Hard', dc: 15, color: '#f97316' },
  { id: 'deadly', label: 'Deadly', dc: 18, color: '#ef4444' },
];

const GROUP_CHECKS = [
  { label: 'Perception', skill: 'Perception', ability: 'WIS' },
  { label: 'Stealth', skill: 'Stealth', ability: 'DEX' },
  { label: 'Investigation', skill: 'Investigation', ability: 'INT' },
  { label: 'Insight', skill: 'Insight', ability: 'WIS' },
];

const SAVE_BUTTONS = [
  { label: 'STR', ability: 'STR' },
  { label: 'DEX', ability: 'DEX' },
  { label: 'CON', ability: 'CON' },
  { label: 'INT', ability: 'INT' },
  { label: 'WIS', ability: 'WIS' },
  { label: 'CHA', ability: 'CHA' },
];

const SKILLS = [
  'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception',
  'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine',
  'Nature', 'Perception', 'Performance', 'Persuasion', 'Religion',
  'Sleight of Hand', 'Stealth', 'Survival',
];

const ABILITIES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
const SOCIAL_SKILLS = ['Persuasion', 'Deception', 'Intimidation', 'Insight'];
const COIN_TYPES = ['cp', 'sp', 'gp', 'pp'];

const PASSIVE_CHECKS = [
  { label: 'Perception', skill: 'Perception', ability: 'wisdom', icon: Eye },
  { label: 'Investigation', skill: 'Investigation', ability: 'intelligence', icon: Search },
  { label: 'Insight', skill: 'Insight', ability: 'wisdom', icon: Brain },
];

function getAbilityMod(score) {
  if (score == null) return 0;
  return Math.floor((score - 10) / 2);
}

function getPassiveScore(character, check) {
  if (!character) return 10;
  // Try direct passive_perception/passive_investigation/passive_insight fields first
  const directField = `passive_${check.skill.toLowerCase()}`;
  if (character[directField] != null) return character[directField];
  // Compute from ability scores
  const scores = character.ability_scores || character.stats || {};
  const abilityScore = scores[check.ability] || scores[check.ability.slice(0, 3).toUpperCase()] || scores[check.ability.toUpperCase()] || 10;
  const mod = getAbilityMod(abilityScore);
  // Check skill proficiency
  const proficiencies = character.skill_proficiencies || character.proficiencies || [];
  const profBonus = character.proficiency_bonus || Math.ceil((character.level || 1) / 4) + 1;
  const isProficient = Array.isArray(proficiencies) && proficiencies.some(
    p => (typeof p === 'string' ? p : p?.name || '').toLowerCase() === check.skill.toLowerCase()
  );
  return 10 + mod + (isProficient ? profBonus : 0);
}

// ── Styling helpers ──

const pillBtn = (active, activeColor = 'rgba(201,168,76,') => ({
  background: active ? `${activeColor}0.12)` : 'rgba(255,255,255,0.03)',
  border: `1px solid ${active ? `${activeColor}0.3)` : 'rgba(255,255,255,0.06)'}`,
  color: active ? `${activeColor}1)` : 'rgba(255,255,255,0.4)',
});

const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 5, padding: '5px 8px', fontSize: 11, color: '#e2e0d8',
  width: '100%', outline: 'none', fontFamily: 'var(--font-ui)',
};

const selectStyle = { ...inputStyle, cursor: 'pointer' };

const smallLabel = {
  fontSize: 10, color: 'rgba(201,168,76,0.35)', textTransform: 'uppercase',
  letterSpacing: '0.06em', marginBottom: 3,
};

// ── Component ──

export default function DmActionPanel() {
  const { sendPrompt, sendEvent, sendTargetedEvent, promptResults, applyCondition, removeCondition, requestEquipment, sendHpChange } = useCampaignSync();
  const { members, myClientId } = useParty();

  const [tab, setTab] = useState('quick');
  const [difficulty, setDifficulty] = useState('medium');
  const [targetMode, setTargetMode] = useState('all');
  const [selectedTargets, setSelectedTargets] = useState([]);

  // Passive Check
  const [passiveDc, setPassiveDc] = useState(13);
  const [passiveResults, setPassiveResults] = useState(null); // { check, dc, results: [{ name, score, pass }] }
  const [passiveNotify, setPassiveNotify] = useState(true);

  // Skill Check tab
  const [skSkill, setSkSkill] = useState('Perception');
  const [skAbility, setSkAbility] = useState('WIS');
  const [skDc, setSkDc] = useState(13);
  const [skShowDc, setSkShowDc] = useState(false);
  const [skDesc, setSkDesc] = useState('');
  const [skReward, setSkReward] = useState('');
  const [skConsequence, setSkConsequence] = useState('');

  // Loot tab
  const [lootItems, setLootItems] = useState([{ name: '', qty: 1 }]);
  const [lootGold, setLootGold] = useState({ cp: '', sp: '', gp: '', pp: '' });
  const [lootDesc, setLootDesc] = useState('');

  // Social tab
  const [npcName, setNpcName] = useState('');
  const [npcNarrative, setNpcNarrative] = useState('');
  const [npcSkill, setNpcSkill] = useState('');
  const [npcChoices, setNpcChoices] = useState(['', '']);

  // Results tracking
  const [actionLog, setActionLog] = useState([]);

  const otherMembers = members.filter(m => m.client_id !== myClientId);
  const dc = useMemo(() => DIFFICULTY_TIERS.find(t => t.id === difficulty)?.dc || 13, [difficulty]);

  const toggleTarget = (cid) =>
    setSelectedTargets(prev => prev.includes(cid) ? prev.filter(id => id !== cid) : [...prev, cid]);

  const getTargets = () => (targetMode === 'all' ? null : selectedTargets);

  const logAction = (type, label, promptId) => {
    setActionLog(prev => [{ type, label, promptId, time: Date.now() }, ...prev].slice(0, 10));
  };

  // ── Consequence helpers ──

  const getTargetClientIds = useCallback(() => {
    const players = members.filter(m => m.client_id !== myClientId);
    if (targetMode === 'all') {
      return players.map(m => m.client_id);
    }
    return selectedTargets || [];
  }, [members, myClientId, targetMode, selectedTargets]);

  const applyConsequence = useCallback((type, value) => {
    const targetIds = getTargetClientIds();
    if (targetIds.length === 0) {
      toast.error('Select target players first');
      return;
    }

    if (type === 'damage') {
      sendHpChange(-value, 'Consequence', targetIds);
      toast(`Applied ${value} damage to ${targetIds.length} player(s)`, {
        icon: '\u{1F4A5}', duration: 2000,
        style: { background: '#1a1520', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)' }
      });
    } else if (type === 'condition') {
      applyCondition(value, targetIds);
      toast(`Applied ${value} to ${targetIds.length} player(s)`, {
        icon: '\u26A0\uFE0F', duration: 2000,
        style: { background: '#1a1520', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }
      });
    } else if (type === 'gold') {
      for (const id of targetIds) {
        sendEvent('gold_change', { delta: value, reason: 'Consequence' });
      }
      toast(`Applied ${value} GP to ${targetIds.length} player(s)`, {
        icon: '\u{1F4B0}', duration: 2000,
        style: { background: '#1a1520', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)' }
      });
    }
  }, [getTargetClientIds, sendHpChange, applyCondition, sendEvent]);

  // ── Passive Check ──

  const runPassiveCheck = (check) => {
    const players = otherMembers;
    if (players.length === 0) {
      toast.error('No players connected');
      return;
    }
    const results = players.map(m => {
      const char = m.character || {};
      const score = getPassiveScore(char, check);
      return {
        name: char.name || 'Unknown',
        clientId: m.client_id,
        score,
        pass: score >= passiveDc,
      };
    });
    setPassiveResults({ check: check.label, dc: passiveDc, results });
    logAction('check', `Passive ${check.label} DC${passiveDc}`, null);

    const passCount = results.filter(r => r.pass).length;
    toast.success(`Passive ${check.label} (DC ${passiveDc}): ${passCount}/${results.length} noticed`);

    // Optionally notify passing players
    if (passiveNotify) {
      const passingIds = results.filter(r => r.pass).map(r => r.clientId);
      if (passingIds.length > 0) {
        sendTargetedEvent('passive_notice', {
          text: `Your passive ${check.label.toLowerCase()} picks up on something...`,
          skill: check.skill,
          dc: passiveDc,
        }, passingIds);
      }
    }
  };

  // ── Senders ──

  const sendGroupCheck = (check) => {
    const pid = sendPrompt('roll_check', {
      roll_type: 'Skill Check', ability: check.ability, skill: check.skill,
      dc, label: `${check.skill} Check`, body: `Group ${check.skill} check (DC ${dc})`,
    }, getTargets());
    logAction('check', `${check.label} DC${dc}`, pid);
    toast.success(`${check.label} (DC ${dc}) sent`);
  };

  const sendSaveThrow = (save) => {
    const pid = sendPrompt('roll_check', {
      roll_type: 'Saving Throw', ability: save.ability, skill: null,
      dc, label: `${save.ability} Save`, body: `${save.ability} Saving Throw (DC ${dc})`,
    }, getTargets());
    logAction('save', `${save.label} Save DC${dc}`, pid);
    toast.success(`${save.label} Save (DC ${dc}) sent`);
  };

  const sendDetailedCheck = () => {
    const pid = sendPrompt('roll_check', {
      roll_type: 'Skill Check', ability: skAbility, skill: skSkill,
      dc: skDc, label: `${skSkill} Check`,
      body: skDesc || `The DM requests a ${skSkill} check.`,
      show_dc: skShowDc, reward: skReward || undefined,
      consequence: skConsequence || undefined,
    }, getTargets());
    logAction('check', `${skSkill} DC${skDc}`, pid);
    toast.success(`${skSkill} Check (DC ${skDc}) sent`);
  };

  const sendLoot = () => {
    const items = lootItems.filter(i => i.name.trim());
    const gold = {};
    COIN_TYPES.forEach(c => { if (lootGold[c]) gold[c] = parseInt(lootGold[c]) || 0; });
    if (!items.length && !Object.keys(gold).length) {
      toast.error('Add at least one item or gold amount'); return;
    }
    const data = { items, gold, description: lootDesc.trim() || 'The DM drops loot!' };
    const targets = getTargets();
    if (targets && targets.length) {
      sendTargetedEvent('loot_drop', data, targets);
    } else {
      sendEvent('loot_drop', data);
    }
    logAction('loot', `${items.length} item(s)`, null);
    setLootItems([{ name: '', qty: 1 }]); setLootGold({ cp: '', sp: '', gp: '', pp: '' }); setLootDesc('');
    toast.success('Loot sent!');
  };

  const sendSocial = () => {
    if (!npcName.trim()) { toast.error('Enter an NPC name'); return; }
    const data = {
      npc_name: npcName.trim(), narrative: npcNarrative.trim(),
      skill_check: npcSkill || undefined,
      choices: npcChoices.filter(c => c.trim()).length >= 2 ? npcChoices.filter(c => c.trim()) : undefined,
    };
    if (npcSkill) {
      const pid = sendPrompt('roll_check', {
        roll_type: 'Skill Check', ability: 'CHA', skill: npcSkill,
        dc, label: `${npcSkill} (${npcName.trim()})`,
        body: npcNarrative.trim() || `${npcName.trim()} engages you in conversation.`,
      }, getTargets());
      data.prompt_id = pid;
      logAction('social', npcName.trim(), pid);
    } else if (data.choices) {
      const pid = sendPrompt('choice', {
        title: npcName.trim(), body: npcNarrative.trim(), options: data.choices,
      }, getTargets());
      data.prompt_id = pid;
      logAction('social', npcName.trim(), pid);
    } else {
      const targets = getTargets();
      if (targets && targets.length) {
        sendTargetedEvent('social_encounter', data, targets);
      } else {
        sendEvent('social_encounter', data);
      }
      logAction('social', npcName.trim(), null);
    }
    setNpcName(''); setNpcNarrative(''); setNpcSkill(''); setNpcChoices(['', '']);
    toast.success('Social encounter sent!');
  };

  // ── Render helpers ──

  const TargetSelector = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10 }}>
        <span style={{ color: 'rgba(201,168,76,0.3)' }}>Target:</span>
        <button onClick={() => { setTargetMode('all'); setSelectedTargets([]); }}
          className="flex items-center gap-1 px-2 py-1 rounded transition-all" style={pillBtn(targetMode === 'all', 'rgba(74,222,128,')}>
          <Users size={9} /> <span style={{ fontSize: 10 }}>All</span>
        </button>
        <button onClick={() => setTargetMode('select')}
          className="flex items-center gap-1 px-2 py-1 rounded transition-all" style={pillBtn(targetMode === 'select', 'rgba(96,165,250,')}>
          <User size={9} /> <span style={{ fontSize: 10 }}>Select</span>
        </button>
      </div>
      {targetMode === 'select' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {otherMembers.map(m => {
            const sel = selectedTargets.includes(m.client_id);
            return (
              <button key={m.client_id} onClick={() => toggleTarget(m.client_id)}
                className="px-2 py-1 rounded transition-all" style={{ fontSize: 10, ...pillBtn(sel, 'rgba(96,165,250,') }}>
                {m.character?.name || 'Unknown'}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  const DifficultyRow = () => (
    <div>
      <div style={smallLabel}>Difficulty (DC)</div>
      <div style={{ display: 'flex', gap: 4 }}>
        {DIFFICULTY_TIERS.map(t => (
          <button key={t.id} onClick={() => setDifficulty(t.id)}
            className="flex-1 py-1.5 rounded text-center transition-all"
            style={{
              fontSize: 10, fontWeight: 600,
              background: difficulty === t.id ? `${t.color}18` : 'rgba(255,255,255,0.02)',
              border: `1px solid ${difficulty === t.id ? `${t.color}50` : 'rgba(255,255,255,0.05)'}`,
              color: difficulty === t.id ? t.color : 'rgba(255,255,255,0.3)',
            }}>
            {t.label} ({t.dc})
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="card border-gold/15 space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-gold/60 flex items-center gap-2">
        <Swords size={13} /> DM Actions
      </h3>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {TABS.map(t => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex items-center gap-1 px-2 py-1.5 rounded transition-all"
              style={{ fontSize: 10, fontWeight: 500, cursor: 'pointer', ...pillBtn(active) }}>
              <Icon size={10} /> {t.label}
              {t.id === 'results' && actionLog.length > 0 && (
                <span style={{ fontSize: 9, background: 'rgba(201,168,76,0.2)', borderRadius: 8, padding: '0 4px', color: '#c9a84c' }}>
                  {actionLog.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Target + Difficulty (shared across tabs except results/conditions) */}
      {tab !== 'results' && tab !== 'conditions' && (
        <div className="space-y-2">
          <TargetSelector />
          {(tab === 'quick' || tab === 'social') && <DifficultyRow />}
        </div>
      )}

      {/* ── TAB: Quick Actions ── */}
      {tab === 'quick' && (
        <div className="space-y-3">
          <div>
            <div style={smallLabel}>Group Checks</div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {GROUP_CHECKS.map(c => (
                <button key={c.skill} onClick={() => sendGroupCheck(c)}
                  className="px-2.5 py-1.5 rounded transition-all"
                  style={{ fontSize: 10, fontWeight: 500, background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', color: 'rgba(201,168,76,0.7)' }}>
                  <Eye size={9} style={{ display: 'inline', marginRight: 3, verticalAlign: 'middle' }} />{c.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={smallLabel}>Saving Throws</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {SAVE_BUTTONS.map(s => (
                <button key={s.ability} onClick={() => sendSaveThrow(s)}
                  className="px-2.5 py-1.5 rounded transition-all"
                  style={{ fontSize: 10, fontWeight: 500, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: 'rgba(239,68,68,0.6)' }}>
                  <ShieldAlert size={9} style={{ display: 'inline', marginRight: 3, verticalAlign: 'middle' }} />{s.label}
                </button>
              ))}
            </div>
          </div>
          {/* Passive Checks */}
          <div>
            <div style={smallLabel}>Passive Checks</div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>DC:</span>
                <input type="number" min={1} max={30} value={passiveDc}
                  onChange={e => setPassiveDc(parseInt(e.target.value) || 10)}
                  style={{ ...inputStyle, width: 48, textAlign: 'center', padding: '4px 6px' }} />
              </div>
              {PASSIVE_CHECKS.map(c => {
                const Icon = c.icon;
                return (
                  <button key={c.skill} onClick={() => runPassiveCheck(c)}
                    className="px-2.5 py-1.5 rounded transition-all"
                    style={{ fontSize: 10, fontWeight: 500, background: 'rgba(147,130,220,0.06)', border: '1px solid rgba(147,130,220,0.15)', color: 'rgba(147,130,220,0.7)' }}>
                    <Icon size={9} style={{ display: 'inline', marginRight: 3, verticalAlign: 'middle' }} />{c.label}
                  </button>
                );
              })}
              <label style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 9, color: 'rgba(255,255,255,0.25)', cursor: 'pointer', marginLeft: 'auto' }}>
                <input type="checkbox" checked={passiveNotify} onChange={e => setPassiveNotify(e.target.checked)} style={{ width: 12, height: 12 }} />
                Notify
              </label>
            </div>
            {/* Passive check results */}
            {passiveResults && (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, padding: '6px 8px', marginTop: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                  <EyeOff size={10} style={{ color: 'rgba(147,130,220,0.7)' }} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(147,130,220,0.8)' }}>
                    Passive {passiveResults.check} (DC {passiveResults.dc})
                  </span>
                  <button onClick={() => setPassiveResults(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.2)', padding: 2 }}>
                    <X size={10} />
                  </button>
                </div>
                {passiveResults.results.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.02)', marginTop: 2 }}>
                    <span style={{ fontSize: 10, fontWeight: 500, color: '#e2e0d8', flex: 1 }}>{r.name}</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 11, color: '#c9a84c' }}>{r.score}</span>
                    <span style={{
                      fontSize: 9, padding: '1px 5px', borderRadius: 3, fontWeight: 700,
                      background: r.pass ? 'rgba(74,222,128,0.12)' : 'rgba(239,68,68,0.12)',
                      border: `1px solid ${r.pass ? 'rgba(74,222,128,0.25)' : 'rgba(239,68,68,0.25)'}`,
                      color: r.pass ? '#4ade80' : '#ef4444',
                    }}>
                      {r.pass ? 'NOTICED' : 'UNAWARE'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Consequences */}
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(239,68,68,0.4)', fontFamily: 'var(--font-heading)', marginBottom: 6 }}>
              Quick Consequences
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {[
                { label: '5 Damage', action: () => applyConsequence('damage', 5) },
                { label: '10 Damage', action: () => applyConsequence('damage', 10) },
                { label: '20 Damage', action: () => applyConsequence('damage', 20) },
                { label: 'Poisoned', action: () => applyConsequence('condition', 'Poisoned') },
                { label: 'Frightened', action: () => applyConsequence('condition', 'Frightened') },
                { label: 'Prone', action: () => applyConsequence('condition', 'Prone') },
                { label: 'Restrained', action: () => applyConsequence('condition', 'Restrained') },
                { label: 'Lose 1 GP', action: () => applyConsequence('gold', -1) },
                { label: 'Lose 5 GP', action: () => applyConsequence('gold', -5) },
              ].map((c, i) => (
                <button
                  key={i}
                  onClick={c.action}
                  style={{
                    padding: '4px 8px', borderRadius: 5, fontSize: 9, fontWeight: 600,
                    background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
                    color: '#ef4444', cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Skill Check (Detailed) ── */}
      {tab === 'skill' && (
        <div className="space-y-2">
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ flex: 1 }}>
              <div style={smallLabel}>Skill</div>
              <select style={selectStyle} value={skSkill} onChange={e => setSkSkill(e.target.value)}>
                {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ width: 70 }}>
              <div style={smallLabel}>Ability</div>
              <select style={selectStyle} value={skAbility} onChange={e => setSkAbility(e.target.value)}>
                {ABILITIES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div style={{ width: 55 }}>
              <div style={smallLabel}>DC</div>
              <input type="number" min={1} max={30} style={inputStyle} value={skDc} onChange={e => setSkDc(parseInt(e.target.value) || 0)} />
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'rgba(255,255,255,0.35)', cursor: 'pointer' }}>
            <input type="checkbox" checked={skShowDc} onChange={e => setSkShowDc(e.target.checked)} /> Show DC to players
          </label>
          <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} placeholder="Description (what you tell the players...)" value={skDesc} onChange={e => setSkDesc(e.target.value)} />
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ flex: 1 }}>
              <div style={smallLabel}>On Success</div>
              <input style={inputStyle} placeholder="e.g. You find a hidden passage" value={skReward} onChange={e => setSkReward(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={smallLabel}>On Failure</div>
              <input style={inputStyle} placeholder="e.g. You trigger the trap" value={skConsequence} onChange={e => setSkConsequence(e.target.value)} />
            </div>
          </div>
          <button onClick={sendDetailedCheck} className="btn-primary text-xs flex items-center gap-1.5 px-4 py-2">
            <Send size={11} /> Send Skill Check
          </button>
        </div>
      )}

      {/* ── TAB: Loot ── */}
      {tab === 'loot' && (
        <div className="space-y-2">
          <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} placeholder="You find a chest containing..." value={lootDesc} onChange={e => setLootDesc(e.target.value)} />
          <div style={smallLabel}>Items</div>
          {lootItems.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <input style={{ ...inputStyle, flex: 1 }} placeholder="Item name" value={item.name} onChange={e => setLootItems(prev => prev.map((it, j) => j === i ? { ...it, name: e.target.value } : it))} />
              <input type="number" min={1} style={{ ...inputStyle, width: 45, textAlign: 'center' }} value={item.qty} onChange={e => setLootItems(prev => prev.map((it, j) => j === i ? { ...it, qty: parseInt(e.target.value) || 1 } : it))} />
              {lootItems.length > 1 && (
                <button onClick={() => setLootItems(prev => prev.filter((_, j) => j !== i))} style={{ color: 'rgba(239,68,68,0.5)', cursor: 'pointer', background: 'none', border: 'none' }}>
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
          {lootItems.length < 8 && (
            <button onClick={() => setLootItems(prev => [...prev, { name: '', qty: 1 }])}
              style={{ fontSize: 10, color: 'rgba(201,168,76,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <Plus size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 2 }} />Add item
            </button>
          )}
          <div style={smallLabel}>Currency</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {COIN_TYPES.map(c => (
              <div key={c} style={{ flex: 1 }}>
                <input type="number" min={0} style={{ ...inputStyle, textAlign: 'center' }} placeholder={c.toUpperCase()} value={lootGold[c]} onChange={e => setLootGold(prev => ({ ...prev, [c]: e.target.value }))} />
                <div style={{ fontSize: 9, textAlign: 'center', color: 'rgba(255,255,255,0.2)', marginTop: 1 }}>{c}</div>
              </div>
            ))}
          </div>
          <button onClick={sendLoot} className="btn-primary text-xs flex items-center gap-1.5 px-4 py-2">
            <Gift size={11} /> Send Loot
          </button>
        </div>
      )}

      {/* ── TAB: Social ── */}
      {tab === 'social' && (
        <div className="space-y-2">
          <div>
            <div style={smallLabel}>NPC Name</div>
            <input style={inputStyle} placeholder="e.g. Bartender Mirena" value={npcName} onChange={e => setNpcName(e.target.value)} />
          </div>
          <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} placeholder="Narrative text..." value={npcNarrative} onChange={e => setNpcNarrative(e.target.value)} />
          <div>
            <div style={smallLabel}>Attach Skill Check (optional)</div>
            <select style={selectStyle} value={npcSkill} onChange={e => setNpcSkill(e.target.value)}>
              <option value="">None</option>
              {SOCIAL_SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <div style={smallLabel}>Choices (optional, min 2)</div>
            {npcChoices.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 4, marginBottom: 4, alignItems: 'center' }}>
                <input style={{ ...inputStyle, flex: 1 }} placeholder={`Choice ${i + 1}`} value={c} onChange={e => setNpcChoices(prev => prev.map((o, j) => j === i ? e.target.value : o))} />
                {npcChoices.length > 2 && (
                  <button onClick={() => setNpcChoices(prev => prev.filter((_, j) => j !== i))} style={{ color: 'rgba(239,68,68,0.5)', cursor: 'pointer', background: 'none', border: 'none' }}>
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
            {npcChoices.length < 6 && (
              <button onClick={() => setNpcChoices(prev => [...prev, ''])}
                style={{ fontSize: 10, color: 'rgba(201,168,76,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <Plus size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 2 }} />Add choice
              </button>
            )}
          </div>
          <button onClick={sendSocial} className="btn-primary text-xs flex items-center gap-1.5 px-4 py-2">
            <MessageSquare size={11} /> Send Encounter
          </button>
        </div>
      )}

      {/* ── TAB: Conditions ── */}
      {tab === 'conditions' && (
        <div className="space-y-3">
          <div style={smallLabel}>Apply / Remove Conditions</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginBottom: 4 }}>
            Select a player, then click a condition to apply or remove it. Conditions auto-modify their rolls.
          </div>
          {/* Per-player condition manager */}
          {otherMembers.length === 0 ? (
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontStyle: 'italic', textAlign: 'center', padding: 12 }}>
              No players connected
            </div>
          ) : (
            otherMembers.map(m => {
              const playerConditions = m.character?.conditions || [];
              return (
                <div key={m.client_id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 6, padding: '8px 10px' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#e2e0d8', marginBottom: 6 }}>
                    {m.character?.name || 'Unknown'}
                    {playerConditions.length > 0 && (
                      <span style={{ fontSize: 9, color: 'rgba(239,68,68,0.6)', marginLeft: 6 }}>
                        ({playerConditions.length} active)
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    {ALL_CONDITIONS.map(cond => {
                      const isActive = playerConditions.includes(cond);
                      const color = CONDITION_COLORS[cond] || '#c9a84c';
                      const effect = CONDITION_EFFECTS[cond];
                      return (
                        <button
                          key={cond}
                          onClick={() => {
                            if (isActive) {
                              removeCondition?.(cond, [m.client_id]);
                              toast.success(`Removed ${cond} from ${m.character?.name}`);
                            } else {
                              applyCondition?.(cond, [m.client_id]);
                              toast.success(`Applied ${cond} to ${m.character?.name}`);
                            }
                          }}
                          title={effect?.summary || cond}
                          style={{
                            fontSize: 9, padding: '2px 6px', borderRadius: 4,
                            background: isActive ? `${color}20` : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${isActive ? `${color}50` : 'rgba(255,255,255,0.06)'}`,
                            color: isActive ? color : 'rgba(255,255,255,0.25)',
                            cursor: 'pointer', transition: 'all 0.15s', fontWeight: isActive ? 600 : 400,
                          }}
                        >
                          {cond}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}

          {/* Equipment Request */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 8, marginTop: 4 }}>
            <div style={smallLabel}>Equipment</div>
            <button
              onClick={() => {
                requestEquipment?.();
                toast.success('Equipment selection request sent to all players');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded transition-all"
              style={{ fontSize: 10, fontWeight: 500, background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)', color: 'rgba(96,165,250,0.7)', cursor: 'pointer' }}
            >
              <Swords size={10} /> Request Equipment Selection
            </button>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', marginTop: 3 }}>
              Prompts players to select their weapons/gear before combat
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Results ── */}
      {tab === 'results' && (
        <div className="space-y-2">
          {actionLog.length === 0 ? (
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontStyle: 'italic', padding: '12px 0', textAlign: 'center' }}>
              No actions sent yet. Send a check, loot, or encounter to see results here.
            </div>
          ) : (
            actionLog.map((action, idx) => {
              const results = action.promptId ? (promptResults[action.promptId] || []) : [];
              const icon = action.type === 'check' ? <Eye size={10} />
                : action.type === 'save' ? <ShieldAlert size={10} />
                : action.type === 'loot' ? <Gift size={10} />
                : <Users2 size={10} />;
              const typeColors = { check: '#c9a84c', save: '#ef4444', loot: '#4ade80', social: '#60a5fa' };
              const c = typeColors[action.type] || '#c9a84c';
              return (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 6, padding: '6px 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                    <span style={{ color: c }}>{icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: c }}>{action.label}</span>
                    <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.15)', marginLeft: 'auto' }}>
                      {new Date(action.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {action.promptId && results.length === 0 && (
                    <div style={{ fontSize: 10, color: 'rgba(201,168,76,0.35)', fontStyle: 'italic' }}>
                      Waiting for responses...
                    </div>
                  )}
                  {results.map((r, ri) => {
                    // Independently compute pass/fail from DC if available
                    const pass = r.pass !== undefined ? r.pass
                      : (r.roll_total !== undefined && action.promptId && (() => {
                          // Try to find the DC from the action log entry
                          const dcMatch = action.label?.match(/DC(\d+)/);
                          const actionDc = dcMatch ? parseInt(dcMatch[1]) : null;
                          return actionDc ? r.roll_total >= actionDc : undefined;
                        })());
                    return (
                    <div key={ri} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.02)', marginTop: 2 }}>
                      <span style={{ fontSize: 10, fontWeight: 500, color: '#e2e0d8' }}>{r.name || r.client_id?.slice(0, 6)}</span>
                      {r.roll_total !== undefined && (
                        <>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 11, color: '#c9a84c' }}>{r.roll_total}</span>
                          {r.breakdown && <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>{r.breakdown}</span>}
                          {pass !== undefined && pass !== null && (
                            <span style={{
                              fontSize: 9, padding: '1px 5px', borderRadius: 3, fontWeight: 700,
                              background: pass ? 'rgba(74,222,128,0.12)' : 'rgba(239,68,68,0.12)',
                              border: `1px solid ${pass ? 'rgba(74,222,128,0.25)' : 'rgba(239,68,68,0.25)'}`,
                              color: pass ? '#4ade80' : '#ef4444',
                            }}>
                              {pass ? 'PASS' : 'FAIL'}
                            </span>
                          )}
                        </>
                      )}
                      {r.choice !== undefined && <span style={{ fontSize: 10, color: '#60a5fa' }}>{r.choice}</span>}
                      {r.accepted !== undefined && (
                        <span style={{ fontSize: 10, color: r.accepted ? '#4ade80' : '#ef4444' }}>{r.accepted ? 'Accepted' : 'Declined'}</span>
                      )}
                      {r.text !== undefined && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontStyle: 'italic' }}>"{r.text}"</span>}
                    </div>
                    );
                  })}
                  {!action.promptId && action.type === 'loot' && (
                    <div style={{ fontSize: 10, color: 'rgba(74,222,128,0.5)' }}>
                      <Check size={9} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />Loot delivered
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
