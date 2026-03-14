import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  Zap, Target, Gift, Users2, ClipboardList, Send, Plus, X,
  Users, User, Check, ShieldAlert, Swords, Eye, MessageSquare, AlertTriangle,
  EyeOff, Search, Brain, Package, Sparkles as SparklesIcon, BookOpen, Heart, RotateCcw,
} from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import ItemPreview from './ItemPreview';
import { getWeaponProficiencies, getArmorProficiencies, getSpellcastingInfo, canUseWeapon } from '../../utils/classProficiencies';
import toast from 'react-hot-toast';
import { useCampaignSync } from '../../contexts/CampaignSyncContext';
import { useParty } from '../../contexts/PartyContext';
import { useLiveSession } from '../../contexts/LiveSessionContext';
import { CONDITION_EFFECTS } from '../../data/conditionEffects';

// ── Constants ──

const TABS = [
  { id: 'quick', label: 'Quick', icon: Zap },
  { id: 'skill', label: 'Skill Check', icon: Target },
  { id: 'conditions', label: 'Conditions', icon: AlertTriangle },
  { id: 'loot', label: 'Loot', icon: Gift },
  { id: 'social', label: 'Social', icon: Users2 },
  { id: 'hp', label: 'HP / Revive', icon: Heart },
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
  const { handleSocialOutcome } = useLiveSession();

  // Track which social prompts we've already processed for NPC disposition
  const processedSocialRef = useRef(new Set());

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
  const [lootMode, setLootMode] = useState('manual'); // manual | srd | custom
  const [lootItems, setLootItems] = useState([{ name: '', qty: 1 }]);
  const [lootGold, setLootGold] = useState({ cp: '', sp: '', gp: '', pp: '' });
  const [lootDesc, setLootDesc] = useState('');
  // SRD lookup state
  const [srdQuery, setSrdQuery] = useState('');
  const [srdCategory, setSrdCategory] = useState('');
  const [srdResults, setSrdResults] = useState([]);
  const [srdLoading, setSrdLoading] = useState(false);
  const [srdPreview, setSrdPreview] = useState(null);
  const [srdTargetPlayer, setSrdTargetPlayer] = useState('all');
  // Custom item state
  const [customItem, setCustomItem] = useState({
    name: '', type: 'weapon', rarity: 'common',
    damage: '', damage_type: '', properties: '',
    ac: '', armor_type: 'light', effect: '', description: '', charges: '',
    spell_level: 0, spell_school: '', casting_time: '', spell_range: '', duration: '',
  });

  // Social tab
  const [npcName, setNpcName] = useState('');
  const [npcNarrative, setNpcNarrative] = useState('');
  const [npcSkill, setNpcSkill] = useState('');
  const [npcChoices, setNpcChoices] = useState(['', '']);

  // HP / Revive tab
  const [hpAmount, setHpAmount] = useState('');
  const [hpMode, setHpMode] = useState('heal'); // 'heal' | 'damage' | 'set'
  const [hpTarget, setHpTarget] = useState('');

  // Results tracking
  const [actionLog, setActionLog] = useState([]);

  const otherMembers = members.filter(m => m.client_id !== myClientId);
  const dc = useMemo(() => DIFFICULTY_TIERS.find(t => t.id === difficulty)?.dc || 13, [difficulty]);

  const toggleTarget = (cid) =>
    setSelectedTargets(prev => prev.includes(cid) ? prev.filter(id => id !== cid) : [...prev, cid]);

  const getTargets = () => (targetMode === 'all' ? null : selectedTargets);

  const logAction = (type, label, promptId, dc = null, failCondition = null, meta = null) => {
    setActionLog(prev => [{ type, label, promptId, time: Date.now(), dc, failCondition, meta }, ...prev].slice(0, 10));
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

  // ── Auto-update NPC disposition from social check results ──
  useEffect(() => {
    for (const action of actionLog) {
      if (action.type !== 'social' || !action.promptId || !action.meta?.npcName || !action.dc) continue;
      const results = promptResults[action.promptId];
      if (!results || results.length === 0) continue;
      const key = action.promptId;
      if (processedSocialRef.current.has(key)) continue;
      processedSocialRef.current.add(key);

      // Determine best outcome from all responders
      for (const r of results) {
        if (r.roll_total == null) continue;
        const diff = r.roll_total - action.dc;
        let outcome;
        if (diff >= 10) outcome = 'critical_success';
        else if (diff >= 0) outcome = 'success';
        else if (diff <= -10) outcome = 'critical_failure';
        else outcome = 'failure';
        handleSocialOutcome(action.meta.npcName, outcome);
      }
    }
  }, [actionLog, promptResults, handleSocialOutcome]);

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
    logAction('check', `${check.label} DC${dc}`, pid, dc);
    toast.success(`${check.label} (DC ${dc}) sent`);
  };

  const sendSaveThrow = (save) => {
    const pid = sendPrompt('roll_check', {
      roll_type: 'Saving Throw', ability: save.ability, skill: null,
      dc, label: `${save.ability} Save`, body: `${save.ability} Saving Throw (DC ${dc})`,
    }, getTargets());
    logAction('save', `${save.label} Save DC${dc}`, pid, dc);
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
    logAction('check', `${skSkill} DC${skDc}`, pid, skDc);
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
      logAction('social', npcName.trim(), pid, dc, null, { npcName: npcName.trim(), skill: npcSkill });
    } else if (data.choices) {
      const pid = sendPrompt('choice', {
        title: npcName.trim(), body: npcNarrative.trim(), options: data.choices,
      }, getTargets());
      data.prompt_id = pid;
      logAction('social', npcName.trim(), pid, null, null, { npcName: npcName.trim() });
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

  // ── SRD Search ──

  const searchSrd = useCallback(async () => {
    if (!srdQuery.trim()) return;
    setSrdLoading(true);
    try {
      const result = await invoke('wiki_search', {
        q: srdQuery.trim(),
        category: srdCategory || null,
        subcategory: null,
        ruleset: null,
        page: 1,
        perPage: 20,
      });
      let items = result?.items || [];
      // If a target player is selected, filter by their class proficiencies
      if (srdTargetPlayer !== 'all') {
        const target = otherMembers.find(m => m.client_id === srdTargetPlayer);
        const playerClass = target?.character?.primary_class;
        if (playerClass) {
          items = items.filter(item => {
            const cat = (item.category || '').toLowerCase();
            if (cat.includes('spell')) {
              // Filter spells by class list (check tags or subcategory)
              const playerSpell = getSpellcastingInfo(playerClass, target?.character?.level || 1);
              if (!playerSpell) return false;
              // Check if spell tags contain the class
              const tags = (item.tags || '').toLowerCase();
              return tags.includes(playerClass.toLowerCase());
            }
            if (cat.includes('weapon') || cat.includes('equipment')) {
              const sub = (item.subcategory || '').toLowerCase();
              if (sub.includes('martial')) return canUseWeapon(playerClass, 'martial');
              if (sub.includes('simple')) return canUseWeapon(playerClass, 'simple');
            }
            return true; // Don't filter other categories
          });
        }
      }
      setSrdResults(items);
    } catch (err) {
      toast.error('Search failed');
      console.error('SRD search error:', err);
    }
    setSrdLoading(false);
  }, [srdQuery, srdCategory, srdTargetPlayer, otherMembers]);

  const loadSrdArticle = useCallback(async (slug) => {
    try {
      const article = await invoke('wiki_get_article', { slug });
      setSrdPreview(article);
    } catch (err) {
      toast.error('Failed to load item details');
    }
  }, []);

  const sendSrdItem = useCallback((item) => {
    const data = {
      items: [{ name: item.title || item.name, qty: 1, metadata: item.metadata_json }],
      gold: {},
      description: `You receive: ${item.title || item.name}`,
    };
    const targets = srdTargetPlayer !== 'all' ? [srdTargetPlayer] : getTargets();
    if (targets && targets.length) {
      sendTargetedEvent('loot_drop', data, targets);
    } else {
      sendEvent('loot_drop', data);
    }
    toast.success(`${item.title || item.name} sent!`);
    setSrdPreview(null);
  }, [srdTargetPlayer, getTargets, sendTargetedEvent, sendEvent]);

  const sendCustomItem = useCallback(() => {
    if (!customItem.name.trim()) { toast.error('Enter item name'); return; }
    const meta = { ...customItem };
    delete meta.name;
    // Add spell metadata if spell type
    if (customItem.type === 'spell') {
      meta.level = customItem.spell_level;
      meta.school = customItem.spell_school;
      meta.casting_time = customItem.casting_time;
      meta.range = customItem.spell_range;
      meta.duration = customItem.duration;
    }
    const data = {
      items: [{ name: customItem.name, qty: 1, metadata: JSON.stringify(meta) }],
      gold: {},
      description: `You receive: ${customItem.name}`,
    };
    const targets = srdTargetPlayer !== 'all' ? [srdTargetPlayer] : getTargets();
    if (targets && targets.length) {
      sendTargetedEvent('loot_drop', data, targets);
    } else {
      sendEvent('loot_drop', data);
    }
    toast.success(`${customItem.name} sent!`);
    setCustomItem({ name: '', type: 'weapon', rarity: 'common', damage: '', damage_type: '', properties: '', ac: '', armor_type: 'light', effect: '', description: '', charges: '', spell_level: 0, spell_school: '', casting_time: '', spell_range: '', duration: '' });
  }, [customItem, srdTargetPlayer, getTargets, sendTargetedEvent, sendEvent]);

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
          {/* Loot mode tabs */}
          <div style={{ display: 'flex', gap: 3 }}>
            {[
              { id: 'manual', label: 'Manual', icon: Gift },
              { id: 'srd', label: 'SRD Lookup', icon: BookOpen },
              { id: 'custom', label: 'Custom Item', icon: SparklesIcon },
            ].map(m => (
              <button key={m.id} onClick={() => setLootMode(m.id)}
                className="flex items-center gap-1 px-2 py-1 rounded transition-all"
                style={{ fontSize: 9, fontWeight: 500, cursor: 'pointer', ...pillBtn(lootMode === m.id, 'rgba(74,222,128,') }}>
                <m.icon size={9} /> {m.label}
              </button>
            ))}
          </div>

          {/* Manual mode — existing behavior */}
          {lootMode === 'manual' && (
            <>
              <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} placeholder="You find a chest containing..." value={lootDesc} onChange={e => setLootDesc(e.target.value)} />
              <div style={smallLabel}>Items</div>
              {lootItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <input style={{ ...inputStyle, flex: 1 }} placeholder="Item name" value={item.name} onChange={e => setLootItems(prev => prev.map((it, j) => j === i ? { ...it, name: e.target.value } : it))} />
                  <input type="number" min={1} style={{ ...inputStyle, width: 45, textAlign: 'center' }} value={item.qty} onChange={e => setLootItems(prev => prev.map((it, j) => j === i ? { ...it, qty: parseInt(e.target.value) || 1 } : it))} />
                  {lootItems.length > 1 && (
                    <button onClick={() => setLootItems(prev => prev.filter((_, j) => j !== i))} style={{ color: 'rgba(239,68,68,0.5)', cursor: 'pointer', background: 'none', border: 'none' }}><X size={12} /></button>
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
            </>
          )}

          {/* SRD Lookup mode */}
          {lootMode === 'srd' && (
            <>
              {/* Target player */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10 }}>
                <span style={{ color: 'rgba(201,168,76,0.3)' }}>For:</span>
                <select style={{ ...selectStyle, flex: 1 }} value={srdTargetPlayer} onChange={e => setSrdTargetPlayer(e.target.value)}>
                  <option value="all">All Players</option>
                  {otherMembers.map(m => (
                    <option key={m.client_id} value={m.client_id}>
                      {m.character?.name || 'Unknown'} ({m.character?.primary_class || '?'} Lv{m.character?.level || '?'})
                    </option>
                  ))}
                </select>
              </div>
              {/* Category filter */}
              <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                {[
                  { id: '', label: 'All' },
                  { id: 'equipment', label: 'Weapons' },
                  { id: 'armor', label: 'Armor' },
                  { id: 'spells', label: 'Spells' },
                  { id: 'magic-items', label: 'Magic Items' },
                ].map(c => (
                  <button key={c.id} onClick={() => setSrdCategory(c.id)}
                    style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, cursor: 'pointer', ...pillBtn(srdCategory === c.id, 'rgba(96,165,250,') }}>
                    {c.label}
                  </button>
                ))}
              </div>
              {/* Search bar */}
              <div style={{ display: 'flex', gap: 4 }}>
                <input style={{ ...inputStyle, flex: 1 }} placeholder="Search items, weapons, spells..." value={srdQuery}
                  onChange={e => setSrdQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && searchSrd()} />
                <button onClick={searchSrd} disabled={srdLoading}
                  style={{ padding: '4px 8px', borderRadius: 5, background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', color: '#60a5fa', cursor: 'pointer', fontSize: 10 }}>
                  <Search size={10} />
                </button>
              </div>
              {/* Results */}
              {srdLoading && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: 8 }}>Searching...</div>}
              {!srdLoading && srdResults.length > 0 && !srdPreview && (
                <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {srdResults.map(item => (
                    <div key={item.id} onClick={() => loadSrdArticle(item.slug)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', borderRadius: 5, cursor: 'pointer',
                        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                        transition: 'border-color 0.15s',
                      }}>
                      <span style={{ fontSize: 10, color: '#e8d9b5', fontWeight: 500, flex: 1 }}>{item.title}</span>
                      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>{item.subcategory || item.category}</span>
                    </div>
                  ))}
                </div>
              )}
              {!srdLoading && srdResults.length === 0 && srdQuery && (
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: 8, fontStyle: 'italic' }}>No results found</div>
              )}
              {/* Preview */}
              {srdPreview && (
                <div>
                  <button onClick={() => setSrdPreview(null)} style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 4 }}>
                    &larr; Back to results
                  </button>
                  <ItemPreview item={srdPreview} onGive={() => sendSrdItem(srdPreview)} />
                </div>
              )}
            </>
          )}

          {/* Custom Item mode */}
          {lootMode === 'custom' && (
            <>
              {/* Target player */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10 }}>
                <span style={{ color: 'rgba(201,168,76,0.3)' }}>For:</span>
                <select style={{ ...selectStyle, flex: 1 }} value={srdTargetPlayer} onChange={e => setSrdTargetPlayer(e.target.value)}>
                  <option value="all">All Players</option>
                  {otherMembers.map(m => (
                    <option key={m.client_id} value={m.client_id}>
                      {m.character?.name || 'Unknown'} ({m.character?.primary_class || '?'} Lv{m.character?.level || '?'})
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ flex: 1 }}>
                  <div style={smallLabel}>Name</div>
                  <input style={inputStyle} placeholder="Flame Tongue" value={customItem.name} onChange={e => setCustomItem(prev => ({ ...prev, name: e.target.value }))} />
                </div>
                <div style={{ width: 90 }}>
                  <div style={smallLabel}>Type</div>
                  <select style={selectStyle} value={customItem.type} onChange={e => setCustomItem(prev => ({ ...prev, type: e.target.value }))}>
                    <option value="weapon">Weapon</option>
                    <option value="armor">Armor</option>
                    <option value="spell">Spell</option>
                    <option value="potion">Potion</option>
                    <option value="consumable">Consumable</option>
                    <option value="scroll">Scroll</option>
                    <option value="wondrous">Wondrous</option>
                    <option value="misc">Misc</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ flex: 1 }}>
                  <div style={smallLabel}>Rarity</div>
                  <select style={selectStyle} value={customItem.rarity} onChange={e => setCustomItem(prev => ({ ...prev, rarity: e.target.value }))}>
                    <option value="common">Common</option>
                    <option value="uncommon">Uncommon</option>
                    <option value="rare">Rare</option>
                    <option value="very rare">Very Rare</option>
                    <option value="legendary">Legendary</option>
                  </select>
                </div>
              </div>
              {/* Dynamic fields based on type */}
              {customItem.type === 'weapon' && (
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ flex: 1 }}>
                    <div style={smallLabel}>Damage</div>
                    <input style={inputStyle} placeholder="2d6" value={customItem.damage} onChange={e => setCustomItem(prev => ({ ...prev, damage: e.target.value }))} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={smallLabel}>Damage Type</div>
                    <select style={selectStyle} value={customItem.damage_type} onChange={e => setCustomItem(prev => ({ ...prev, damage_type: e.target.value }))}>
                      <option value="">--</option>
                      {['Slashing', 'Piercing', 'Bludgeoning', 'Fire', 'Cold', 'Lightning', 'Thunder', 'Poison', 'Acid', 'Necrotic', 'Radiant', 'Force', 'Psychic'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              {customItem.type === 'weapon' && (
                <div>
                  <div style={smallLabel}>Properties</div>
                  <input style={inputStyle} placeholder="Finesse, Light, Versatile (1d8)" value={customItem.properties} onChange={e => setCustomItem(prev => ({ ...prev, properties: e.target.value }))} />
                </div>
              )}
              {customItem.type === 'armor' && (
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ flex: 1 }}>
                    <div style={smallLabel}>AC</div>
                    <input type="number" style={inputStyle} value={customItem.ac} onChange={e => setCustomItem(prev => ({ ...prev, ac: e.target.value }))} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={smallLabel}>Armor Type</div>
                    <select style={selectStyle} value={customItem.armor_type} onChange={e => setCustomItem(prev => ({ ...prev, armor_type: e.target.value }))}>
                      <option value="light">Light</option>
                      <option value="medium">Medium</option>
                      <option value="heavy">Heavy</option>
                      <option value="shield">Shield</option>
                    </select>
                  </div>
                </div>
              )}
              {customItem.type === 'spell' && (
                <>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <div style={{ width: 65 }}>
                      <div style={smallLabel}>Level</div>
                      <select style={selectStyle} value={customItem.spell_level} onChange={e => setCustomItem(prev => ({ ...prev, spell_level: parseInt(e.target.value) }))}>
                        <option value={0}>Cantrip</option>
                        {[1,2,3,4,5,6,7,8,9].map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={smallLabel}>School</div>
                      <select style={selectStyle} value={customItem.spell_school} onChange={e => setCustomItem(prev => ({ ...prev, spell_school: e.target.value }))}>
                        <option value="">--</option>
                        {['Abjuration','Conjuration','Divination','Enchantment','Evocation','Illusion','Necromancy','Transmutation'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <div style={{ flex: 1 }}>
                      <div style={smallLabel}>Cast Time</div>
                      <input style={inputStyle} placeholder="1 action" value={customItem.casting_time} onChange={e => setCustomItem(prev => ({ ...prev, casting_time: e.target.value }))} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={smallLabel}>Range</div>
                      <input style={inputStyle} placeholder="60 feet" value={customItem.spell_range} onChange={e => setCustomItem(prev => ({ ...prev, spell_range: e.target.value }))} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={smallLabel}>Duration</div>
                      <input style={inputStyle} placeholder="Instantaneous" value={customItem.duration} onChange={e => setCustomItem(prev => ({ ...prev, duration: e.target.value }))} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <div style={{ flex: 1 }}>
                      <div style={smallLabel}>Damage (optional)</div>
                      <input style={inputStyle} placeholder="8d6" value={customItem.damage} onChange={e => setCustomItem(prev => ({ ...prev, damage: e.target.value }))} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={smallLabel}>Damage Type</div>
                      <select style={selectStyle} value={customItem.damage_type} onChange={e => setCustomItem(prev => ({ ...prev, damage_type: e.target.value }))}>
                        <option value="">--</option>
                        {['Fire','Cold','Lightning','Thunder','Poison','Acid','Necrotic','Radiant','Force','Psychic'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}
              {customItem.type === 'consumable' && (
                <div>
                  <div style={smallLabel}>Effect</div>
                  <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} placeholder="Grants advantage on next attack..." value={customItem.effect} onChange={e => setCustomItem(prev => ({ ...prev, effect: e.target.value }))} />
                </div>
              )}
              {(customItem.type === 'potion' || customItem.type === 'scroll' || customItem.type === 'wondrous') && (
                <div>
                  <div style={smallLabel}>Effect</div>
                  <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} placeholder="Heals 2d4+2 HP..." value={customItem.effect} onChange={e => setCustomItem(prev => ({ ...prev, effect: e.target.value }))} />
                </div>
              )}
              {(customItem.type === 'potion' || customItem.type === 'wondrous') && (
                <div>
                  <div style={smallLabel}>Charges (optional)</div>
                  <input type="number" min={0} style={{ ...inputStyle, width: 70 }} value={customItem.charges} onChange={e => setCustomItem(prev => ({ ...prev, charges: e.target.value }))} />
                </div>
              )}
              <div>
                <div style={smallLabel}>Description</div>
                <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} placeholder="A blade wreathed in flames..." value={customItem.description} onChange={e => setCustomItem(prev => ({ ...prev, description: e.target.value }))} />
              </div>
              {/* Preview */}
              {customItem.name && (
                <ItemPreview item={{
                  title: customItem.name, category: customItem.type, summary: customItem.description,
                  metadata_json: JSON.stringify({
                    rarity: customItem.rarity, damage: customItem.damage, damage_type: customItem.damage_type,
                    properties: customItem.properties ? customItem.properties.split(',').map(s => s.trim()) : [],
                    ac: customItem.ac, armor_type: customItem.armor_type, effect: customItem.effect, charges: customItem.charges,
                  }),
                }} compact />
              )}
              <button onClick={sendCustomItem} className="btn-primary text-xs flex items-center gap-1.5 px-4 py-2">
                <Package size={11} /> Send Custom Item
              </button>
            </>
          )}
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

      {/* ── TAB: HP / Revive ── */}
      {tab === 'hp' && (
        <div className="space-y-3">
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginBottom: 4 }}>
            Heal, damage, or revive players. Use this to fix bugs, apply healing from other players' spells, or override death saves.
          </div>

          {otherMembers.length === 0 ? (
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontStyle: 'italic', textAlign: 'center', padding: 12 }}>
              No players connected
            </div>
          ) : (
            <>
              {/* Player cards with HP display */}
              {otherMembers.map(m => {
                const ch = m.character;
                const hp = ch?.current_hp ?? 0;
                const maxHp = ch?.max_hp ?? 1;
                const hpPct = maxHp > 0 ? Math.max(0, Math.min(100, (hp / maxHp) * 100)) : 0;
                const isDying = hp === 0 && maxHp > 0;
                const isSelected = hpTarget === m.client_id;
                return (
                  <button
                    key={m.client_id}
                    onClick={() => setHpTarget(isSelected ? '' : m.client_id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', width: '100%',
                      background: isSelected ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isSelected ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.05)'}`,
                      borderRadius: 6, cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: isDying ? '#fca5a5' : '#e2e0d8' }}>
                        {isDying && '\u{1F480} '}{ch?.name || 'Unknown'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                        <div style={{ width: 60, height: 4, background: '#0a0a10', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', borderRadius: 4, transition: 'width 0.3s',
                            width: `${hpPct}%`,
                            background: hpPct > 50 ? '#22c55e' : hpPct > 25 ? '#eab308' : '#ef4444',
                          }} />
                        </div>
                        <span style={{ fontSize: 10, color: hpPct > 50 ? '#86efac' : hpPct > 25 ? '#fde68a' : '#fca5a5' }}>
                          {hp}/{maxHp}
                        </span>
                      </div>
                    </div>
                    {isSelected && <Check size={12} style={{ color: '#c9a84c' }} />}
                  </button>
                );
              })}

              {/* HP Action Panel */}
              {hpTarget && (() => {
                const targetMember = otherMembers.find(m => m.client_id === hpTarget);
                const targetName = targetMember?.character?.name || 'Unknown';
                const targetHp = targetMember?.character?.current_hp ?? 0;
                const targetMaxHp = targetMember?.character?.max_hp ?? 1;
                const isDying = targetHp === 0 && targetMaxHp > 0;
                return (
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, padding: '10px 12px' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#e2e0d8', marginBottom: 8 }}>
                      Actions for {targetName}
                    </div>

                    {/* Quick actions */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                      {/* Revive to 1 HP */}
                      {isDying && (
                        <button
                          onClick={() => {
                            sendHpChange?.(1 - targetHp, 'DM Revive (emergency)', [hpTarget]);
                            toast.success(`${targetName} revived to 1 HP`);
                          }}
                          style={{
                            fontSize: 10, padding: '4px 10px', borderRadius: 4, cursor: 'pointer',
                            background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)',
                            color: '#86efac', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4,
                          }}
                        >
                          <RotateCcw size={10} /> Revive (1 HP)
                        </button>
                      )}

                      {/* Full heal */}
                      <button
                        onClick={() => {
                          sendHpChange?.(targetMaxHp - targetHp, 'DM Full Heal', [hpTarget]);
                          toast.success(`${targetName} fully healed to ${targetMaxHp} HP`);
                        }}
                        style={{
                          fontSize: 10, padding: '4px 10px', borderRadius: 4, cursor: 'pointer',
                          background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
                          color: 'rgba(34,197,94,0.7)', display: 'flex', alignItems: 'center', gap: 4,
                        }}
                      >
                        <Heart size={10} /> Full Heal
                      </button>

                      {/* Half heal */}
                      <button
                        onClick={() => {
                          const halfMax = Math.ceil(targetMaxHp / 2);
                          const healAmt = Math.min(halfMax, targetMaxHp - targetHp);
                          if (healAmt > 0) {
                            sendHpChange?.(healAmt, 'DM Half Heal', [hpTarget]);
                            toast.success(`${targetName} healed ${healAmt} HP`);
                          } else {
                            toast('Already at full HP', { icon: '\u2764\uFE0F' });
                          }
                        }}
                        style={{
                          fontSize: 10, padding: '4px 10px', borderRadius: 4, cursor: 'pointer',
                          background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)',
                          color: 'rgba(34,197,94,0.5)', display: 'flex', alignItems: 'center', gap: 4,
                        }}
                      >
                        <Heart size={10} /> Half Heal
                      </button>
                    </div>

                    {/* Custom HP change */}
                    <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                      {['heal', 'damage', 'set'].map(mode => (
                        <button
                          key={mode}
                          onClick={() => setHpMode(mode)}
                          style={{
                            fontSize: 9, padding: '3px 8px', borderRadius: 4, cursor: 'pointer',
                            background: hpMode === mode
                              ? mode === 'heal' ? 'rgba(34,197,94,0.2)' : mode === 'damage' ? 'rgba(239,68,68,0.2)' : 'rgba(96,165,250,0.2)'
                              : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${hpMode === mode
                              ? mode === 'heal' ? 'rgba(34,197,94,0.4)' : mode === 'damage' ? 'rgba(239,68,68,0.4)' : 'rgba(96,165,250,0.4)'
                              : 'rgba(255,255,255,0.06)'}`,
                            color: hpMode === mode
                              ? mode === 'heal' ? '#86efac' : mode === 'damage' ? '#fca5a5' : '#93c5fd'
                              : 'rgba(255,255,255,0.3)',
                            textTransform: 'capitalize',
                          }}
                        >
                          {mode === 'set' ? 'Set HP' : mode}
                        </button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {(() => {
                        const applyHpAction = () => {
                          const raw = parseInt(hpAmount);
                          if (isNaN(raw)) return;
                          const val = Math.abs(raw);
                          if (val === 0 && hpMode !== 'set') return;
                          if (hpMode === 'set') {
                            const clamped = Math.max(0, Math.min(val, targetMaxHp));
                            const delta = clamped - targetHp;
                            sendHpChange?.(delta, `DM set HP to ${clamped}`, [hpTarget]);
                            toast.success(`${targetName} HP set to ${clamped}`);
                          } else if (hpMode === 'heal') {
                            sendHpChange?.(val, 'DM Heal', [hpTarget]);
                            toast.success(`${targetName} healed ${val} HP`);
                          } else {
                            sendHpChange?.(-val, 'DM Damage', [hpTarget]);
                            toast.success(`${targetName} took ${val} damage`);
                          }
                          setHpAmount('');
                        };
                        return (<>
                      <input
                        type="number"
                        min="0"
                        style={{ ...inputStyle, width: 80 }}
                        placeholder={hpMode === 'set' ? 'New HP' : 'Amount'}
                        value={hpAmount}
                        onChange={e => setHpAmount(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') applyHpAction(); }}
                      />
                      <button
                        onClick={applyHpAction}
                        className="btn-primary text-xs px-3 py-1"
                        style={{
                          background: hpMode === 'heal' ? 'rgba(34,197,94,0.15)' : hpMode === 'damage' ? 'rgba(239,68,68,0.15)' : 'rgba(96,165,250,0.15)',
                          border: `1px solid ${hpMode === 'heal' ? 'rgba(34,197,94,0.3)' : hpMode === 'damage' ? 'rgba(239,68,68,0.3)' : 'rgba(96,165,250,0.3)'}`,
                          color: hpMode === 'heal' ? '#86efac' : hpMode === 'damage' ? '#fca5a5' : '#93c5fd',
                        }}
                      >
                        Apply
                      </button>
                        </>);
                      })()}
                    </div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', marginTop: 4 }}>
                      {hpMode === 'heal' ? 'Adds HP (capped at max). Use for healing spells from other players.' :
                       hpMode === 'damage' ? 'Removes HP. Use for environmental damage or traps.' :
                       'Sets HP to exact value. Use for emergency overrides.'}
                    </div>
                  </div>
                );
              })()}
            </>
          )}
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
                    // Compute pass/fail from stored DC or label regex
                    const actionDc = action.dc ?? (() => {
                      const m = action.label?.match(/DC(\d+)/);
                      return m ? parseInt(m[1]) : null;
                    })();
                    const pass = r.pass !== undefined ? r.pass
                      : (r.roll_total !== undefined && actionDc != null ? r.roll_total >= actionDc : undefined);
                    return (
                    <div key={ri} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 6px', borderRadius: 4, background: pass === false ? 'rgba(239,68,68,0.04)' : 'rgba(255,255,255,0.02)', marginTop: 2 }}>
                      <span style={{ fontSize: 10, fontWeight: 500, color: '#e2e0d8', flex: 1 }}>{r.name || r.client_id?.slice(0, 6)}</span>
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
                  {/* Summary for check/save with DC */}
                  {action.promptId && results.length > 0 && action.dc && (action.type === 'check' || action.type === 'save') && (() => {
                    const passCount = results.filter(r => {
                      const p = r.pass !== undefined ? r.pass : (r.roll_total != null ? r.roll_total >= action.dc : null);
                      return p === true;
                    }).length;
                    const failCount = results.filter(r => {
                      const p = r.pass !== undefined ? r.pass : (r.roll_total != null ? r.roll_total >= action.dc : null);
                      return p === false;
                    }).length;
                    return (
                      <div style={{ display: 'flex', gap: 8, marginTop: 4, paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ fontSize: 9, color: '#4ade80' }}>{passCount} passed</span>
                        <span style={{ fontSize: 9, color: '#ef4444' }}>{failCount} failed</span>
                      </div>
                    );
                  })()}
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
