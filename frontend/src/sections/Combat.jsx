import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Plus, Trash2, Swords, Dice5, Timer, MinusCircle, X, Search, Minus, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAttacks, addAttack, deleteAttack, getConditions, updateConditions, getCombatNotes, updateCombatNotes } from '../api/combat';
import { useAutosave } from '../hooks/useAutosave';
import SaveIndicator from '../components/SaveIndicator';
import HelpTooltip from '../components/HelpTooltip';
import ConfirmDialog from '../components/ConfirmDialog';
import { useRuleset } from '../contexts/RulesetContext';
import { HELP, ACTION_ECONOMY } from '../data/helpText';
import { CONDITION_EFFECTS, computeConditionEffects } from '../data/conditionEffects';

const CONDITION_ICONS = {
  'Blinded': '\u{1F441}', 'Charmed': '\u{1F495}', 'Deafened': '\u{1F507}',
  'Exhaustion': '\u{1F635}', 'Frightened': '\u{1F631}', 'Grappled': '\u{1F91D}',
  'Incapacitated': '\u{1F4AB}', 'Invisible': '\u{1F47B}', 'Paralyzed': '\u{26A1}',
  'Petrified': '\u{1FAA8}', 'Poisoned': '\u{1F922}', 'Prone': '\u{2B07}',
  'Restrained': '\u{26D3}', 'Stunned': '\u{2B50}', 'Unconscious': '\u{1F480}',
};

function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function parseBonus(str) {
  const n = parseInt(str);
  return isNaN(n) ? 0 : n;
}

function parseDamage(expr) {
  const match = expr.match(/^(\d+)?d(\d+)([+-]\d+)?$/i);
  if (!match) return null;
  return { count: parseInt(match[1]) || 1, sides: parseInt(match[2]), mod: parseInt(match[3]) || 0 };
}

export default function Combat({ characterId, character, onConditionsChange }) {
  const { CONDITIONS } = useRuleset();
  const [attacks, setAttacks] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [notes, setNotes] = useState({ actions: '', bonus_actions: '', reactions: '', legendary_actions: '' });
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showConditionInfo, setShowConditionInfo] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [rollResults, setRollResults] = useState({});
  const [dmgModifiers, setDmgModifiers] = useState({}); // #111 — 'resist' | 'vuln' | null per attack id
  const rollTimeoutRefs = useRef({});

  // #113 — Initiative/combatant tracker persisted to sessionStorage
  const initiativeKey = `codex_initiative_${characterId}`;
  const [combatants, setCombatants] = useState(() => {
    try {
      const stored = sessionStorage.getItem(initiativeKey);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [newCombatantName, setNewCombatantName] = useState('');
  const [newCombatantInit, setNewCombatantInit] = useState('');

  useEffect(() => {
    sessionStorage.setItem(initiativeKey, JSON.stringify(combatants));
  }, [combatants, initiativeKey]);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(`codex_initiative_${characterId}`);
      setCombatants(stored ? JSON.parse(stored) : []);
    } catch { setCombatants([]); }
  }, [characterId]);

  const addCombatant = () => {
    const name = newCombatantName.trim();
    if (!name) return;
    const init = parseInt(newCombatantInit) || 0;
    setCombatants(prev => [...prev, { id: Date.now(), name, initiative: init }].sort((a, b) => b.initiative - a.initiative));
    setNewCombatantName('');
    setNewCombatantInit('');
  };

  const removeCombatant = (id) => {
    setCombatants(prev => prev.filter(c => c.id !== id));
  };

  const clearCombatants = () => {
    setCombatants([]);
  };

  // #115 — Legendary action counter persisted to sessionStorage
  const legendaryKey = `codex_legendary_${characterId}`;
  const [legendaryActions, setLegendaryActions] = useState(() => {
    try {
      const stored = sessionStorage.getItem(legendaryKey);
      return stored ? JSON.parse(stored) : { used: 0, max: 3 };
    } catch { return { used: 0, max: 3 }; }
  });

  useEffect(() => {
    sessionStorage.setItem(legendaryKey, JSON.stringify(legendaryActions));
  }, [legendaryActions, legendaryKey]);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(`codex_legendary_${characterId}`);
      setLegendaryActions(stored ? JSON.parse(stored) : { used: 0, max: 3 });
    } catch { setLegendaryActions({ used: 0, max: 3 }); }
  }, [characterId]);

  // #116 — Reaction tracker
  const reactionKey = `codex_reaction_${characterId}`;
  const [reactionUsed, setReactionUsed] = useState(() => sessionStorage.getItem(reactionKey) === 'used');
  const toggleReaction = () => {
    setReactionUsed(prev => {
      const next = !prev;
      sessionStorage.setItem(reactionKey, next ? 'used' : 'available');
      return next;
    });
  };
  useEffect(() => {
    setReactionUsed(sessionStorage.getItem(reactionKey) === 'used');
  }, [characterId]);

  // Clean up pending roll timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(rollTimeoutRefs.current).forEach(clearTimeout);
    };
  }, []);

  const load = async () => {
    try {
      const [atkData, condData, notesData] = await Promise.all([
        getAttacks(characterId), getConditions(characterId), getCombatNotes(characterId),
      ]);
      setAttacks(atkData);
      setConditions(condData);
      setNotes(notesData);
      const activeConds = condData.filter(c => c.active);
      onConditionsChange?.(activeConds.length, activeConds.map(c => c.name));
    } catch (err) { toast.error('Failed to load combat data: ' + err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [characterId]);

  const saveNotesFn = useCallback(async (data) => {
    await updateCombatNotes(characterId, data);
  }, [characterId]);
  const { trigger: triggerNotes, saving, lastSaved } = useAutosave(saveNotesFn);

  const updateNote = (field, value) => {
    const updated = { ...notes, [field]: value };
    setNotes(updated);
    triggerNotes(updated);
  };

  const handleAddAttack = async (data) => {
    try {
      await addAttack(characterId, data);
      toast.success('Attack added');
      setShowAdd(false);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleDeleteAttack = async (id) => {
    try {
      await deleteAttack(characterId, id);
      toast.success('Attack removed');
      setConfirmDelete(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const toggleCondition = async (condName) => {
    const previous = [...conditions];
    const updated = conditions.map(c => {
      if (c.name !== condName) return c;
      const newActive = !c.active;
      return {
        ...c,
        active: newActive,
        duration_rounds: newActive ? c.duration_rounds : 0,
        rounds_remaining: newActive ? c.rounds_remaining : 0,
      };
    });
    setConditions(updated);
    const activeUpdated = updated.filter(c => c.active);
    onConditionsChange?.(activeUpdated.length, activeUpdated.map(c => c.name));
    try { await updateConditions(characterId, updated); }
    catch (err) {
      setConditions(previous);
      const activePrev = previous.filter(c => c.active);
      onConditionsChange?.(activePrev.length, activePrev.map(c => c.name));
      toast.error(err.message);
    }
  };

  const setConditionDuration = async (condName, rounds) => {
    const safeRounds = isNaN(rounds) ? 0 : Math.max(0, rounds);
    const updated = conditions.map(c =>
      c.name === condName ? { ...c, duration_rounds: safeRounds, rounds_remaining: safeRounds } : c
    );
    setConditions(updated);
    try { await updateConditions(characterId, updated); }
    catch (err) { toast.error(err.message); }
  };

  const tickRound = async () => {
    const updated = conditions.map(c => {
      if (!c.active || c.rounds_remaining <= 0) return c;
      const newRemaining = Math.max(0, c.rounds_remaining - 1);
      if (newRemaining <= 0) {
        return { ...c, active: false, rounds_remaining: 0, duration_rounds: 0 };
      }
      return { ...c, rounds_remaining: newRemaining };
    });
    setConditions(updated);
    const activeUpdated = updated.filter(c => c.active);
    onConditionsChange?.(activeUpdated.length, activeUpdated.map(c => c.name));
    try { await updateConditions(characterId, updated); }
    catch (err) { toast.error(err.message); }
    const wasActive = new Set(conditions.filter(c => c.active).map(c => c.name));
    const expired = updated.filter(c => !c.active && wasActive.has(c.name));
    if (expired.length > 0) {
      toast.success(`Expired: ${expired.map(c => c.name).join(', ')}`);
    }
  };

  // Inline attack roll
  const rollAttack = (atk) => {
    const bonus = parseBonus(atk.attack_bonus);
    const d20 = rollDie(20);
    const total = d20 + bonus;
    const isNat20 = d20 === 20;
    const isNat1 = d20 === 1;

    let dmgResult = null;
    const dmg = parseDamage(atk.damage_dice);
    if (dmg) {
      const rolls = Array.from({ length: isNat20 ? dmg.count * 2 : dmg.count }, () => rollDie(dmg.sides));
      const dmgTotal = rolls.reduce((s, r) => s + r, 0) + dmg.mod;
      dmgResult = { rolls, total: dmgTotal, crit: isNat20 };
    }

    const ts = Date.now();
    setRollResults(prev => ({
      ...prev,
      [atk.id]: { d20, bonus, total, isNat20, isNat1, damage: dmgResult, ts },
    }));

    // Clear previous timeout for this attack if any
    if (rollTimeoutRefs.current[atk.id]) {
      clearTimeout(rollTimeoutRefs.current[atk.id]);
    }

    // Clear after 8 seconds
    rollTimeoutRefs.current[atk.id] = setTimeout(() => {
      setRollResults(prev => {
        const next = { ...prev };
        if (next[atk.id]?.ts === ts) delete next[atk.id];
        return next;
      });
      delete rollTimeoutRefs.current[atk.id];
    }, 8000);
  };

  const rollDamageOnly = (atk) => {
    const dmg = parseDamage(atk.damage_dice);
    if (!dmg) { toast.error('Invalid damage expression'); return; }
    const rolls = Array.from({ length: dmg.count }, () => rollDie(dmg.sides));
    const dmgTotal = rolls.reduce((s, r) => s + r, 0) + dmg.mod;
    setRollResults(prev => ({
      ...prev,
      [atk.id]: { ...(prev[atk.id] || {}), damage: { rolls, total: dmgTotal, crit: false }, ts: Date.now() },
    }));
  };

  if (loading) return <div className="text-amber-200/40">Loading combat...</div>;

  return (
    <div className="space-y-6 max-w-none">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display text-amber-100 flex items-center gap-2">
          <Swords size={20} />
          <div>
            <span>Combat</span>
            <p className="text-xs text-amber-200/40 font-normal mt-0.5">Track your weapons, active conditions, and combat notes. Use the action economy reference below to know what you can do on your turn.</p>
          </div>
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleReaction}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all select-none ${
              reactionUsed
                ? 'bg-red-900/60 text-red-200 border border-red-500/40'
                : 'bg-emerald-900/50 text-emerald-200 border border-emerald-500/40'
            }`}
            title={reactionUsed ? 'Reaction used — click to reset' : 'Reaction available — click to mark used'}
          >
            Reaction: {reactionUsed ? 'Used' : 'Ready'}
          </button>
          <button onClick={() => setShowAdd(true)} className="btn-primary text-xs flex items-center gap-1">
            <Plus size={12} /> Add Attack
          </button>
        </div>
      </div>

      {/* #112 — Temp HP bar */}
      {character?.max_hp > 0 && (
        <div className="card">
          <h3 className="font-display text-amber-100 mb-2">Hit Points</h3>
          <div className="relative h-6 bg-[#0a0a10] rounded-lg border border-gold/10 overflow-hidden">
            {/* Normal HP bar */}
            <div
              className="absolute inset-y-0 left-0 rounded-lg transition-all duration-300"
              style={{
                width: `${character.max_hp > 0 ? Math.min(100, Math.max(0, (character.current_hp / character.max_hp) * 100)) : 0}%`,
                background: character.max_hp > 0 && character.current_hp / character.max_hp > 0.5
                  ? 'linear-gradient(90deg, rgba(34,197,94,0.7), rgba(34,197,94,0.5))'
                  : character.max_hp > 0 && character.current_hp / character.max_hp > 0.25
                  ? 'linear-gradient(90deg, rgba(234,179,8,0.7), rgba(234,179,8,0.5))'
                  : 'linear-gradient(90deg, rgba(239,68,68,0.7), rgba(239,68,68,0.5))',
              }}
            />
            {/* Temp HP overflow bar */}
            {character.temp_hp > 0 && (
              <div
                className="absolute inset-y-0 rounded-r-lg transition-all duration-300"
                style={{
                  left: `${character.max_hp > 0 ? Math.min(100, Math.max(0, (character.current_hp / character.max_hp) * 100)) : 0}%`,
                  width: `${character.max_hp > 0 ? Math.min(100 - (character.current_hp / character.max_hp) * 100, (character.temp_hp / character.max_hp) * 100) : 0}%`,
                  background: 'linear-gradient(90deg, rgba(234,179,8,0.8), rgba(201,168,76,0.6))',
                  borderLeft: '2px solid rgba(234,179,8,0.9)',
                }}
              />
            )}
            {/* Labels */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 text-xs font-medium">
              <span className="text-amber-100 drop-shadow-md">
                {character.current_hp} / {character.max_hp} HP
              </span>
              {character.temp_hp > 0 && (
                <span className="text-yellow-300 bg-yellow-900/60 px-1.5 py-0.5 rounded text-[10px] font-bold border border-yellow-500/40">
                  +{character.temp_hp} TEMP
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* #113 — Initiative / Combatant Tracker */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-amber-100">Initiative Tracker</h3>
          {combatants.length > 0 && (
            <button onClick={clearCombatants} className="text-xs text-red-400/70 hover:text-red-400 transition-colors">
              Clear All
            </button>
          )}
        </div>
        <p className="text-xs text-amber-200/30 mb-3">Track turn order. Entries persist across tab switches.</p>
        <div className="flex gap-2 mb-3">
          <input
            className="input flex-1"
            placeholder="Name"
            value={newCombatantName}
            onChange={e => setNewCombatantName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCombatant()}
          />
          <input
            type="number"
            className="input w-20"
            placeholder="Init"
            value={newCombatantInit}
            onChange={e => setNewCombatantInit(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCombatant()}
          />
          <button onClick={addCombatant} className="btn-primary text-xs flex items-center gap-1">
            <Plus size={12} /> Add
          </button>
        </div>
        {combatants.length > 0 && (
          <div className="space-y-1">
            {combatants.map((c, idx) => (
              <div key={c.id} className={`flex items-center gap-3 px-3 py-1.5 rounded-lg border transition-all ${
                idx === 0 ? 'bg-gold/5 border-gold/20' : 'bg-[#0a0a10] border-gold/10'
              }`}>
                <span className="text-gold font-bold text-sm w-8 text-center">{c.initiative}</span>
                <span className="text-amber-100 text-sm flex-1">{c.name}</span>
                <button onClick={() => removeCombatant(c.id)} className="text-red-400/50 hover:text-red-400 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* #115 — Legendary Action Counter */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-amber-100">Legendary Actions</h3>
          <button
            onClick={() => setLegendaryActions(prev => ({ ...prev, used: 0 }))}
            className="text-xs text-amber-200/50 hover:text-amber-200/80 transition-colors flex items-center gap-1"
            title="Reset legendary actions"
          >
            <RotateCcw size={11} /> Reset
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLegendaryActions(prev => ({ ...prev, used: Math.max(0, prev.used - 1) }))}
            disabled={legendaryActions.used <= 0}
            className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/30 hover:bg-gold/20 hover:border-gold/50 transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Decrease used legendary actions"
          >
            <Minus size={14} className="text-gold" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-amber-100 font-bold text-lg">{legendaryActions.used}</span>
            <span className="text-amber-200/40 text-sm">/</span>
            <span className="text-amber-200/60 font-bold text-lg">{legendaryActions.max}</span>
          </div>
          <button
            onClick={() => setLegendaryActions(prev => ({ ...prev, used: Math.min(prev.max, prev.used + 1) }))}
            disabled={legendaryActions.used >= legendaryActions.max}
            className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/30 hover:bg-gold/20 hover:border-gold/50 transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Increase used legendary actions"
          >
            <Plus size={14} className="text-gold" />
          </button>
          <span className="text-xs text-amber-200/30 ml-2">used</span>
          {/* Max stepper */}
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-xs text-amber-200/30">Max:</span>
            <button
              onClick={() => setLegendaryActions(prev => ({ ...prev, max: Math.max(1, prev.max - 1), used: Math.min(prev.used, Math.max(1, prev.max - 1)) }))}
              className="w-6 h-6 rounded bg-white/5 border border-amber-200/10 hover:border-amber-200/20 text-amber-200/40 hover:text-amber-200/60 transition-all flex items-center justify-center text-xs"
            >
              -
            </button>
            <span className="text-amber-200/60 text-sm font-medium w-4 text-center">{legendaryActions.max}</span>
            <button
              onClick={() => setLegendaryActions(prev => ({ ...prev, max: Math.min(10, prev.max + 1) }))}
              className="w-6 h-6 rounded bg-white/5 border border-amber-200/10 hover:border-amber-200/20 text-amber-200/40 hover:text-amber-200/60 transition-all flex items-center justify-center text-xs"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Attacks with Roll Buttons */}
      <div className="card">
        <h3 className="font-display text-amber-100 mb-1">Attacks & Weapons<HelpTooltip text="Roll d20 + attack bonus. If the total meets or exceeds the target's AC, you hit. Then roll damage dice + modifier." /></h3>
        <p className="text-xs text-amber-200/30 mb-3">Click the dice icon to roll attack + damage instantly. Click damage to re-roll damage only.</p>
        {attacks.length === 0 ? (
          <p className="text-sm text-amber-200/30">No attacks configured. Add your weapons and cantrips here so you can quickly reference them during combat.</p>
        ) : (
          <div className="space-y-2">
            {attacks.map(atk => {
              const result = rollResults[atk.id];
              return (
                <div key={atk.id} className={`bg-[#0a0a10] rounded-lg border transition-all ${
                  result?.isNat20 ? 'border-gold/60 shadow-[0_0_20px_rgba(201,168,76,0.2)]' :
                  result?.isNat1 ? 'border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.2)]' :
                  'border-gold/10'
                }`}>
                  <div className="flex items-center gap-3 px-4 py-3">
                    {/* Roll button */}
                    <button
                      onClick={() => rollAttack(atk)}
                      className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/30 hover:bg-gold/20 hover:border-gold/50 transition-all flex items-center justify-center flex-shrink-0 group"
                      title="Roll to attack"
                      aria-label={`Roll attack for ${atk.name || 'attack'}`}
                    >
                      <Dice5 size={18} className="text-gold group-hover:text-amber-100 transition-colors" />
                    </button>
                    {/* Attack info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="text-amber-100 font-medium">{atk.name || 'Unnamed Attack'}</span>
                        <span className="text-gold text-sm">{atk.attack_bonus ?? '+0'}</span>
                        <span className="text-amber-200/60 text-sm">{atk.damage_dice ?? '—'} {atk.damage_type && <span className="text-amber-200/40">{atk.damage_type}</span>}</span>
                        {atk.attack_range && <span className="text-amber-200/30 text-xs">{atk.attack_range}</span>}
                      </div>
                    </div>
                    <button onClick={() => setConfirmDelete(atk)} className="text-red-400/50 hover:text-red-400 flex-shrink-0" aria-label={`Delete ${atk.name || 'attack'}`}>
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Roll result */}
                  {result && (
                    <div aria-live="polite" className={`px-4 py-2 border-t flex items-center gap-4 text-sm ${
                      result.isNat20 ? 'border-gold/30 bg-gold/5' : result.isNat1 ? 'border-red-500/30 bg-red-950/20' : 'border-gold/10 bg-white/[0.02]'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-200/50 text-xs">ATK:</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          result.isNat20 ? 'bg-gold/20 text-gold font-bold' : result.isNat1 ? 'bg-red-900/40 text-red-300 font-bold' : 'bg-white/5 text-amber-200/40'
                        }`}>
                          {result.d20}
                        </span>
                        <span className="text-amber-200/40">+ {result.bonus} =</span>
                        <span className={`font-bold ${result.isNat20 ? 'text-gold' : result.isNat1 ? 'text-red-400' : 'text-amber-100'}`}>
                          {result.total}
                        </span>
                        {result.isNat20 && <span className="text-gold text-xs font-bold">NAT 20!</span>}
                        {result.isNat1 && <span className="text-red-400 text-xs font-bold">NAT 1!</span>}
                      </div>
                      {result.damage && (() => {
                        const mod = dmgModifiers[atk.id];
                        const displayTotal = mod === 'resist' ? Math.floor(result.damage.total / 2)
                          : mod === 'vuln' ? result.damage.total * 2
                          : result.damage.total;
                        const dmgColor = mod === 'resist' ? 'text-blue-300' : mod === 'vuln' ? 'text-red-400' : (result.damage.crit ? 'text-gold' : 'text-amber-100');
                        return (
                          <div className="flex items-center gap-2">
                            <span className="text-amber-200/30">|</span>
                            <span className="text-amber-200/50 text-xs">DMG:</span>
                            <button
                              onClick={() => { setDmgModifiers(prev => ({ ...prev, [atk.id]: null })); rollDamageOnly(atk); }}
                              className="flex items-center gap-1.5 hover:text-amber-100 transition-colors"
                              title="Roll damage only"
                              aria-label={`Re-roll damage for ${atk.name || 'attack'}`}
                            >
                              <span className="text-xs text-amber-200/30">[{result.damage.rolls.join(',')}]</span>
                              <span className={`font-bold ${dmgColor}`}>
                                {displayTotal}
                              </span>
                              {result.damage.crit && !mod && <span className="text-gold text-xs">CRIT!</span>}
                            </button>
                            <button
                              onClick={() => setDmgModifiers(prev => ({ ...prev, [atk.id]: prev[atk.id] === 'resist' ? null : 'resist' }))}
                              className={`text-[10px] px-1.5 py-0.5 rounded border transition-all ${
                                mod === 'resist' ? 'bg-blue-900/60 text-blue-200 border-blue-500/40' : 'bg-white/5 text-amber-200/40 border-amber-200/10 hover:text-amber-200/60'
                              }`}
                              title="Half damage (resistance)"
                            >
                              ½ Resist
                            </button>
                            <button
                              onClick={() => setDmgModifiers(prev => ({ ...prev, [atk.id]: prev[atk.id] === 'vuln' ? null : 'vuln' }))}
                              className={`text-[10px] px-1.5 py-0.5 rounded border transition-all ${
                                mod === 'vuln' ? 'bg-red-900/60 text-red-200 border-red-500/40' : 'bg-white/5 text-amber-200/40 border-amber-200/10 hover:text-amber-200/60'
                              }`}
                              title="Double damage (vulnerability)"
                            >
                              ×2 Vuln
                            </button>
                          </div>
                        );
                      })()}
                      <button
                        onClick={() => setRollResults(prev => { const next = { ...prev }; delete next[atk.id]; return next; })}
                        className="ml-auto text-amber-200/30 hover:text-amber-200/60 transition-colors flex-shrink-0"
                        title="Dismiss"
                        aria-label="Dismiss roll result"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Conditions with Duration Timers */}
      <ConditionsPanel
        conditions={conditions}
        conditionDescriptions={CONDITIONS}
        onToggle={toggleCondition}
        onSetDuration={setConditionDuration}
        onTickRound={tickRound}
      />

      {/* Combat Notes */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-amber-100">Action Notes<HelpTooltip text={HELP.actions} /></h3>
          <SaveIndicator saving={saving} lastSaved={lastSaved} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'actions', label: 'Actions' },
            { key: 'bonus_actions', label: 'Bonus Actions' },
            { key: 'reactions', label: 'Reactions' },
            { key: 'legendary_actions', label: 'Legendary/Lair Actions' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="label">{label}</label>
              <textarea className="input w-full h-24 resize-none" value={notes[key]} onChange={e => updateNote(key, e.target.value)} />
            </div>
          ))}
        </div>
      </div>

      {/* Action Economy Reference */}
      <div className="card">
        <h3 className="font-display text-amber-100 mb-3">{ACTION_ECONOMY.title}</h3>
        {ACTION_ECONOMY.sections.map(section => (
          <div key={section.label} className="mb-3 last:mb-0">
            <h4 className="text-xs text-gold font-semibold mb-1.5">{section.label}</h4>
            <ul className="space-y-1">
              {section.items.map((item, i) => (
                <li key={i} className="text-xs text-amber-200/60 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-gold/40">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {showAdd && <AttackForm onSubmit={handleAddAttack} onCancel={() => setShowAdd(false)} />}

      <ConfirmDialog
        show={!!confirmDelete}
        title="Delete Attack?"
        message={`Remove "${confirmDelete?.name}"? This cannot be undone.`}
        onConfirm={() => handleDeleteAttack(confirmDelete.id)}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}

function AttackForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: '', attack_bonus: '+0', damage_dice: '1d6', damage_type: '', attack_range: '', notes: '',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="bg-[#14121c] border border-gold/30 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="font-display text-lg text-amber-100 mb-4">Add Attack</h3>
        <div className="space-y-3">
          <div>
            <input className={`input w-full ${nameError ? 'border-red-500' : ''}`} placeholder="Weapon name" value={form.name} onChange={e => update('name', e.target.value)} autoFocus />
            {nameError && <p className="text-red-400 text-xs mt-1">Name required</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input className="input w-full" placeholder="Attack bonus" value={form.attack_bonus} onChange={e => update('attack_bonus', e.target.value)} />
            <div>
              <input className="input w-full" placeholder="Damage (e.g. 1d8+3)" value={form.damage_dice} onChange={e => update('damage_dice', e.target.value)} />
              <p className="text-amber-200/30 text-xs mt-1">e.g. 2d6+3</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input className="input w-full" placeholder="Damage type" value={form.damage_type} onChange={e => update('damage_type', e.target.value)} />
            <input className="input w-full" placeholder="Range" value={form.attack_range} onChange={e => update('attack_range', e.target.value)} />
          </div>
          <textarea className="input w-full h-16 resize-none" placeholder="Notes" value={form.notes} onChange={e => update('notes', e.target.value)} />
        </div>
        <div className="flex gap-3 justify-end mt-4">
          <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary text-sm">Add</button>
        </div>
      </div>
    </div>
  );
}

function ConditionsPanel({ conditions, conditionDescriptions, onToggle, onSetDuration, onTickRound }) {
  const [expanded, setExpanded] = useState(null);
  const [durationInput, setDurationInput] = useState({});
  const [conditionSearch, setConditionSearch] = useState('');
  const activeNames = useMemo(() => conditions.filter(c => c.active).map(c => c.name), [conditions]);
  const effects = useMemo(() => computeConditionEffects(activeNames), [activeNames]);
  const hasTimedConditions = conditions.some(c => c.active && c.rounds_remaining > 0);

  const filteredConditions = useMemo(() => conditionSearch
    ? conditions.filter(c => c.name.toLowerCase().includes(conditionSearch.toLowerCase()))
    : conditions, [conditions, conditionSearch]);

  const handleConditionClick = (condName) => {
    onToggle(condName);
    if (expanded === condName) setExpanded(null);
  };

  const handleContextMenu = (e, condName) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded(prev => prev === condName ? null : condName);
  };

  const handleSetDuration = (condName) => {
    const rounds = parseInt(durationInput[condName]) || 0;
    if (rounds > 0) {
      onSetDuration(condName, rounds);
      setDurationInput(prev => ({ ...prev, [condName]: '' }));
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display text-amber-100">Active Conditions</h3>
        {hasTimedConditions && (
          <button
            onClick={onTickRound}
            className="btn-primary text-xs flex items-center gap-1"
            title="Advance one round — decrements all condition timers"
          >
            <Timer size={12} /> Next Round
          </button>
        )}
      </div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-amber-200/30">
          Left-click to toggle on/off. Right-click for rule description. Set duration in rounds for auto-expiry.
        </p>
        {activeNames.length >= 3 && (
          <button
            onClick={() => activeNames.forEach(name => onToggle(name))}
            className="text-xs text-red-400/70 hover:text-red-400 transition-colors ml-3 whitespace-nowrap"
          >
            Clear All
          </button>
        )}
      </div>
      {conditions.length > 6 && (
        <div className="relative mb-3">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-200/30 pointer-events-none" />
          <input className="input w-full pl-10" placeholder="Filter conditions..." value={conditionSearch} onChange={e => setConditionSearch(e.target.value)} />
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {filteredConditions.map(cond => {
          const effect = CONDITION_EFFECTS[cond.name];
          return (
            <div key={cond.name} className="relative">
              <button
                onClick={() => handleConditionClick(cond.name)}
                onContextMenu={(e) => handleContextMenu(e, cond.name)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all select-none ${
                  cond.active
                    ? 'bg-red-900/60 text-red-200 border-2 border-red-500/60 shadow-[0_0_12px_rgba(239,68,68,0.35),_0_0_24px_rgba(239,68,68,0.15)] ring-1 ring-red-500/20'
                    : 'bg-[#0d0d12] text-amber-200/40 border border-amber-200/10 hover:text-amber-200/70 hover:border-amber-200/20'
                }`}
              >
                <span className="flex items-center gap-1">
                  {CONDITION_ICONS[cond.name] && <span>{CONDITION_ICONS[cond.name]}</span>}
                  {cond.name}
                  {cond.active && cond.rounds_remaining > 0 && (
                    <span className="ml-1 bg-red-800/60 text-red-100 px-1.5 py-0.5 rounded text-[10px] font-bold">
                      {cond.rounds_remaining}r
                    </span>
                  )}
                </span>
              </button>

              {expanded === cond.name && (
                <div className="absolute z-20 top-full left-0 mt-1 p-3 bg-[#14121c] border border-gold/20 rounded text-xs text-amber-200/60 w-72 shadow-xl">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-display text-amber-100">{cond.name}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setExpanded(null); }}
                      className="text-amber-200/30 hover:text-amber-200/60 text-xs ml-2"
                      aria-label="Close condition details"
                    >
                      &times;
                    </button>
                  </div>
                  {conditionDescriptions[cond.name] && (
                    <p className="leading-relaxed mb-2">{conditionDescriptions[cond.name]}</p>
                  )}
                  {effect && (
                    <div className="pt-2 border-t border-red-500/20">
                      <div className="text-[10px] uppercase tracking-wider text-red-400/70 mb-1 font-semibold">Mechanical Effects</div>
                      <p className="text-red-300/80 leading-relaxed">{effect.summary}</p>
                    </div>
                  )}
                  {cond.active && (
                    <div className="pt-2 mt-2 border-t border-gold/15">
                      <div className="text-[10px] uppercase tracking-wider text-amber-200/50 mb-1 font-semibold">Duration Timer</div>
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          min={1}
                          placeholder="Rounds"
                          className="input w-20 text-xs py-1"
                          value={durationInput[cond.name] || ''}
                          onChange={e => setDurationInput(prev => ({ ...prev, [cond.name]: e.target.value }))}
                          onKeyDown={e => e.key === 'Enter' && handleSetDuration(cond.name)}
                          onClick={e => e.stopPropagation()}
                        />
                        <button
                          onClick={(e) => { e.stopPropagation(); handleSetDuration(cond.name); }}
                          className="btn-primary text-[10px] py-1 px-2"
                        >
                          Set
                        </button>
                        {cond.rounds_remaining > 0 && (
                          <span className="text-amber-200/40 text-[10px]">{cond.rounds_remaining} rounds left</span>
                        )}
                      </div>
                      <p className="text-amber-200/30 text-[10px] mt-1">1 round = 6 seconds. 10 rounds = 1 minute.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Active conditions summary with mechanical effects */}
      {activeNames.length > 0 && (
        <div className="mt-3 pt-3 border-t border-red-500/15 space-y-2">
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs text-red-400/60 font-semibold mr-1">Active:</span>
            {conditions.filter(c => c.active).map(c => (
              <span key={c.name} className="text-xs text-red-200 bg-red-900/40 px-2 py-0.5 rounded border border-red-500/20">
                {CONDITION_ICONS[c.name] || ''} {c.name}
                {c.rounds_remaining > 0 && <span className="ml-1 text-red-300/70">({c.rounds_remaining}r)</span>}
              </span>
            ))}
          </div>

          {/* Mechanical effects banner */}
          <div className="bg-red-950/40 border border-red-500/20 rounded-lg p-3 space-y-1.5">
            <div className="text-[10px] uppercase tracking-wider text-red-400/80 font-semibold">Active Effects</div>
            {effects.speedOverride === 0 && (
              <div className="text-xs text-red-300/90 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                Speed reduced to 0
              </div>
            )}
            {effects.cantAct && (
              <div className="text-xs text-red-300/90 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                Cannot take actions or reactions
              </div>
            )}
            {effects.netAttackMode === 'disadvantage' && (
              <div className="text-xs text-red-300/90 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                Disadvantage on your attack rolls
              </div>
            )}
            {effects.netAttackMode === 'advantage' && (
              <div className="text-xs text-emerald-300/90 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                Advantage on your attack rolls
              </div>
            )}
            {effects.checkDisadvantage && (
              <div className="text-xs text-red-300/90 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                Disadvantage on ability checks
              </div>
            )}
            {effects.autoFailSaves.size > 0 && (
              <div className="text-xs text-red-300/90 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                Auto-fail {[...effects.autoFailSaves].join(' & ')} saving throws
              </div>
            )}
            {effects.saveDisadvantage.size > 0 && (
              <div className="text-xs text-red-300/90 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                Disadvantage on {[...effects.saveDisadvantage].join(' & ')} saving throws
              </div>
            )}
            {effects.attacksAgainstAdvantage && (
              <div className="text-xs text-orange-300/90 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                Attacks against you have advantage
              </div>
            )}
            {effects.autoCritMelee && (
              <div className="text-xs text-orange-300/90 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                Melee hits against you are automatic critical hits
              </div>
            )}
            {effects.resistAll && (
              <div className="text-xs text-blue-300/90 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                Resistance to all damage
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
