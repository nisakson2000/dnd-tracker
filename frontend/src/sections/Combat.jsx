import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Plus, Trash2, Swords, Dice5, Timer, MinusCircle, X, Search, Minus, RotateCcw, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ScrollText, ArrowRight, Filter, Heart, Shield, Skull, Activity, TrendingUp, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAttacks, addAttack, deleteAttack, getConditions, updateConditions, getCombatNotes, updateCombatNotes } from '../api/combat';
import { useAutosave } from '../hooks/useAutosave';
import SaveIndicator from '../components/SaveIndicator';
import HelpTooltip from '../components/HelpTooltip';
import ConfirmDialog from '../components/ConfirmDialog';
import ModalPortal from '../components/ModalPortal';
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

// --- Combat Log helpers ---
function getCombatLog(characterId) {
  try {
    const stored = sessionStorage.getItem(`codex_combatlog_${characterId}`);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function addCombatLogEntry(characterId, type, message, setLog) {
  const entry = { ts: Date.now(), type, message };
  setLog(prev => {
    const updated = [entry, ...prev].slice(0, 50);
    sessionStorage.setItem(`codex_combatlog_${characterId}`, JSON.stringify(updated));
    return updated;
  });
}

export default function Combat({ characterId, character, onConditionsChange }) {
  const { CONDITIONS } = useRuleset();
  const [attacks, setAttacks] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [notes, setNotes] = useState({ actions: '', bonus_actions: '', reactions: '', legendary_actions: '' });
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [_showConditionInfo, _setShowConditionInfo] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [rollResults, setRollResults] = useState({});
  const [dmgModifiers, setDmgModifiers] = useState({}); // 'resist' | 'vuln' | null per attack id
  const rollTimeoutRefs = useRef({});

  // --- Combat Log state ---
  const [combatLog, setCombatLog] = useState(() => getCombatLog(characterId));
  const [combatLogOpen, setCombatLogOpen] = useState(false);

  useEffect(() => {
    setCombatLog(getCombatLog(characterId));
  }, [characterId]);

  const logEvent = useCallback((type, message) => {
    addCombatLogEntry(characterId, type, message, setCombatLog);
  }, [characterId]);

  // Initiative/combatant tracker persisted to sessionStorage
  const initiativeKey = `codex_initiative_${characterId}`;
  const [combatants, setCombatants] = useState(() => {
    try {
      const stored = sessionStorage.getItem(initiativeKey);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [newCombatantName, setNewCombatantName] = useState('');
  const [newCombatantInit, setNewCombatantInit] = useState('');
  const [newCombatantHP, setNewCombatantHP] = useState('');
  const [newCombatantIsEnemy, setNewCombatantIsEnemy] = useState(false);

  // --- Round counter & current turn (persisted) ---
  const roundKey = `codex_round_${characterId}`;
  const turnKey = `codex_turn_${characterId}`;
  const [roundCounter, setRoundCounter] = useState(() => {
    try { const v = sessionStorage.getItem(roundKey); return v ? parseInt(v) : 1; } catch { return 1; }
  });
  const [currentTurn, setCurrentTurn] = useState(() => {
    try { const v = sessionStorage.getItem(turnKey); return v ? parseInt(v) : 0; } catch { return 0; }
  });

  useEffect(() => { sessionStorage.setItem(roundKey, String(roundCounter)); }, [roundCounter, roundKey]);
  useEffect(() => { sessionStorage.setItem(turnKey, String(currentTurn)); }, [currentTurn, turnKey]);

  useEffect(() => {
    sessionStorage.setItem(initiativeKey, JSON.stringify(combatants));
  }, [combatants, initiativeKey]);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(`codex_initiative_${characterId}`);
      setCombatants(stored ? JSON.parse(stored) : []);
    } catch { setCombatants([]); }
    try { const v = sessionStorage.getItem(`codex_round_${characterId}`); setRoundCounter(v ? parseInt(v) : 1); } catch { setRoundCounter(1); }
    try { const v = sessionStorage.getItem(`codex_turn_${characterId}`); setCurrentTurn(v ? parseInt(v) : 0); } catch { setCurrentTurn(0); }
  }, [characterId]);

  // --- Combat Stats Tracker (persisted to sessionStorage) ---
  const statsKey = `codex_combatstats_${characterId}`;
  const [combatStats, setCombatStats] = useState(() => {
    try {
      const stored = sessionStorage.getItem(statsKey);
      return stored ? JSON.parse(stored) : { totalDamageDealt: 0, totalDamageTaken: 0, totalHealing: 0, attackCount: 0 };
    } catch { return { totalDamageDealt: 0, totalDamageTaken: 0, totalHealing: 0, attackCount: 0 }; }
  });

  useEffect(() => {
    sessionStorage.setItem(statsKey, JSON.stringify(combatStats));
  }, [combatStats, statsKey]);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(`codex_combatstats_${characterId}`);
      setCombatStats(stored ? JSON.parse(stored) : { totalDamageDealt: 0, totalDamageTaken: 0, totalHealing: 0, attackCount: 0 });
    } catch { setCombatStats({ totalDamageDealt: 0, totalDamageTaken: 0, totalHealing: 0, attackCount: 0 }); }
  }, [characterId]);

  // --- Damage/Healing Calculator state ---
  const [calcTarget, setCalcTarget] = useState(null); // combatant id
  const [calcAmount, setCalcAmount] = useState('');
  const [calcMode, setCalcMode] = useState('damage'); // 'damage' | 'healing'
  const [calcModifier, setCalcModifier] = useState('normal'); // 'normal' | 'resist' | 'vuln'

  // --- Action Economy Tracker state (persisted) ---
  const actionEconKey = `codex_actionecon_${characterId}`;
  const [actionEcon, setActionEcon] = useState(() => {
    try {
      const stored = sessionStorage.getItem(actionEconKey);
      return stored ? JSON.parse(stored) : { action: false, bonusAction: false, reaction: false };
    } catch { return { action: false, bonusAction: false, reaction: false }; }
  });

  useEffect(() => {
    sessionStorage.setItem(actionEconKey, JSON.stringify(actionEcon));
  }, [actionEcon, actionEconKey]);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(`codex_actionecon_${characterId}`);
      setActionEcon(stored ? JSON.parse(stored) : { action: false, bonusAction: false, reaction: false });
    } catch { setActionEcon({ action: false, bonusAction: false, reaction: false }); }
  }, [characterId]);

  const resetActionEconomy = useCallback(() => {
    setActionEcon({ action: false, bonusAction: false, reaction: false });
  }, []);

  // --- Flanking toggle (persisted) ---
  const flankingKey = `codex_flanking_${characterId}`;
  const [flankingEnabled, setFlankingEnabled] = useState(() => {
    return sessionStorage.getItem(flankingKey) === 'true';
  });

  useEffect(() => {
    sessionStorage.setItem(flankingKey, String(flankingEnabled));
  }, [flankingEnabled, flankingKey]);

  useEffect(() => {
    setFlankingEnabled(sessionStorage.getItem(`codex_flanking_${characterId}`) === 'true');
  }, [characterId]);

  // --- Next/Previous Turn ---
  const nextTurn = () => {
    if (combatants.length === 0) return;
    const _prevName = combatants[currentTurn % combatants.length]?.name || '?';
    setCurrentTurn(prev => {
      const next = prev + 1;
      if (next >= combatants.length) {
        setRoundCounter(r => {
          const newRound = r + 1;
          logEvent('round', `Round ${newRound} started`);
          return newRound;
        });
        resetActionEconomy();
        return 0;
      }
      resetActionEconomy();
      return next;
    });
    const nextIdx = (currentTurn + 1) % combatants.length;
    const nextName = combatants[nextIdx]?.name || '?';
    logEvent('turn', `${nextName}'s turn`);
  };

  const prevTurn = () => {
    if (combatants.length === 0) return;
    setCurrentTurn(prev => {
      if (prev <= 0) {
        setRoundCounter(r => Math.max(1, r - 1));
        return combatants.length - 1;
      }
      return prev - 1;
    });
  };

  const addCombatant = () => {
    const name = newCombatantName.trim();
    if (!name) return;
    const init = parseInt(newCombatantInit) || 0;
    const hp = parseInt(newCombatantHP) || 0;
    setCombatants(prev => [...prev, {
      id: Date.now(),
      name,
      initiative: init,
      maxHp: hp,
      currentHp: hp,
      isEnemy: newCombatantIsEnemy,
    }].sort((a, b) => b.initiative - a.initiative));
    setNewCombatantName('');
    setNewCombatantInit('');
    setNewCombatantHP('');
    setNewCombatantIsEnemy(false);
  };

  const removeCombatant = (id) => {
    setCombatants(prev => {
      const idx = prev.findIndex(c => c.id === id);
      const newList = prev.filter(c => c.id !== id);
      // Adjust currentTurn if needed
      if (idx < currentTurn) {
        setCurrentTurn(t => Math.max(0, t - 1));
      } else if (currentTurn >= newList.length && newList.length > 0) {
        setCurrentTurn(0);
      }
      return newList;
    });
  };

  const clearCombatants = () => {
    setCombatants([]);
    setRoundCounter(1);
    setCurrentTurn(0);
    setCombatStats({ totalDamageDealt: 0, totalDamageTaken: 0, totalHealing: 0, attackCount: 0 });
  };

  // --- Apply Damage/Healing to Combatant ---
  const applyDamageHealing = (combatantId, amount, mode, modifier) => {
    if (!amount || amount <= 0) return;
    let effectiveAmount = amount;
    if (mode === 'damage') {
      if (modifier === 'resist') effectiveAmount = Math.floor(amount / 2);
      else if (modifier === 'vuln') effectiveAmount = amount * 2;
    }

    setCombatants(prev => prev.map(c => {
      if (c.id !== combatantId) return c;
      if (mode === 'damage') {
        const newHp = Math.max(0, (c.currentHp ?? c.maxHp ?? 0) - effectiveAmount);
        return { ...c, currentHp: newHp };
      } else {
        const newHp = Math.min(c.maxHp || 9999, (c.currentHp ?? 0) + effectiveAmount);
        return { ...c, currentHp: newHp };
      }
    }));

    const target = combatants.find(c => c.id === combatantId);
    if (mode === 'damage') {
      setCombatStats(prev => ({
        ...prev,
        totalDamageDealt: prev.totalDamageDealt + effectiveAmount,
        attackCount: prev.attackCount + 1,
      }));
      logEvent('damage', `${target?.name || '?'} took ${effectiveAmount} damage${modifier !== 'normal' ? ` (${modifier})` : ''}`);
      toast(`${target?.name || '?'} took ${effectiveAmount} damage${modifier !== 'normal' ? ` (${modifier})` : ''}`, {
        icon: '\u2694\uFE0F', duration: 2000,
        style: { background: '#1a0a0a', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)' },
      });
    } else {
      setCombatStats(prev => ({
        ...prev,
        totalHealing: prev.totalHealing + effectiveAmount,
      }));
      logEvent('healing', `${target?.name || '?'} healed ${effectiveAmount} HP`);
      toast(`${target?.name || '?'} healed ${effectiveAmount} HP`, {
        icon: '\u2764\uFE0F', duration: 2000,
        style: { background: '#0a1a0a', color: '#86efac', border: '1px solid rgba(34,197,94,0.3)' },
      });
    }
    setCalcAmount('');
  };

  // Legendary action counter persisted to sessionStorage
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

  // Reaction tracker
  const reactionKey = `codex_reaction_${characterId}`;
  const [_reactionUsed, setReactionUsed] = useState(() => sessionStorage.getItem(reactionKey) === 'used');
  const _toggleReaction = () => {
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

    // Log condition toggle
    const cond = updated.find(c => c.name === condName);
    if (cond) {
      logEvent('condition', `${condName} ${cond.active ? 'applied' : 'removed'}`);
    }

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

  // --- Crit animation state ---
  const [critAnimations, setCritAnimations] = useState({});

  // Inline attack roll (enhanced with flanking, combat log, crit animation)
  const rollAttack = (atk) => {
    const bonus = parseBonus(atk.attack_bonus);
    const d20 = rollDie(20);
    const flankBonus = flankingEnabled ? 2 : 0;
    const total = d20 + bonus + flankBonus;
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
      [atk.id]: { d20, bonus, flankBonus, total, isNat20, isNat1, damage: dmgResult, ts },
    }));

    // Track combat stats
    if (dmgResult) {
      setCombatStats(prev => ({
        ...prev,
        totalDamageDealt: prev.totalDamageDealt + dmgResult.total,
        attackCount: prev.attackCount + 1,
      }));
    }

    // Crit animation
    if (isNat20 || isNat1) {
      setCritAnimations(prev => ({ ...prev, [atk.id]: isNat20 ? 'nat20' : 'nat1' }));
      setTimeout(() => {
        setCritAnimations(prev => { const next = { ...prev }; delete next[atk.id]; return next; });
      }, 1200);
    }

    // Combat log
    const dmgStr = dmgResult ? ` for ${dmgResult.total} damage${dmgResult.crit ? ' (CRIT!)' : ''}` : '';
    const critStr = isNat20 ? ' [NAT 20]' : isNat1 ? ' [NAT 1]' : '';
    logEvent('attack', `${atk.name || 'Attack'}: rolled ${d20} + ${bonus}${flankBonus ? ` + ${flankBonus} flanking` : ''} = ${total}${critStr}${dmgStr}`);

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
    logEvent('attack', `${atk.name || 'Attack'}: re-rolled damage for ${dmgTotal}`);
  };

  // --- Crit animation inline styles ---
  const critShimmerStyle = {
    animation: 'critShimmer 1.2s ease-out',
    boxShadow: '0 0 30px rgba(201,168,76,0.5), inset 0 0 20px rgba(201,168,76,0.15)',
  };
  const critFailStyle = {
    animation: 'critFail 1.2s ease-out',
    boxShadow: '0 0 30px rgba(239,68,68,0.5), inset 0 0 20px rgba(239,68,68,0.15)',
  };

  // --- Combat Stats Summary ---
  const avgDamagePerRound = roundCounter > 1 ? (combatStats.totalDamageDealt / (roundCounter - 1)).toFixed(1) : combatStats.totalDamageDealt.toFixed(1);
  const combatActive = combatants.length > 0 || roundCounter > 1;

  if (loading) return (
    <div className="space-y-4">
      <div className="skeleton-pulse" style={{ height: 32, width: '40%' }} />
      <div className="skeleton-pulse" style={{ height: 120 }} />
      <div className="skeleton-pulse" style={{ height: 80 }} />
      <div className="skeleton-pulse" style={{ height: 80 }} />
    </div>
  );

  return (
    <div className="space-y-6 max-w-none">
      {/* Crit animation keyframes */}
      <style>{`
        @keyframes critShimmer {
          0% { box-shadow: 0 0 0px rgba(201,168,76,0), inset 0 0 0px rgba(201,168,76,0); }
          20% { box-shadow: 0 0 40px rgba(201,168,76,0.7), inset 0 0 25px rgba(201,168,76,0.25); }
          100% { box-shadow: 0 0 0px rgba(201,168,76,0), inset 0 0 0px rgba(201,168,76,0); }
        }
        @keyframes critFail {
          0% { box-shadow: 0 0 0px rgba(239,68,68,0), inset 0 0 0px rgba(239,68,68,0); }
          20% { box-shadow: 0 0 40px rgba(239,68,68,0.7), inset 0 0 25px rgba(239,68,68,0.25); }
          100% { box-shadow: 0 0 0px rgba(239,68,68,0), inset 0 0 0px rgba(239,68,68,0); }
        }
      `}</style>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display text-amber-100 flex items-center gap-2">
          <Swords size={20} />
          <div>
            <span>Combat</span>
            <p className="text-xs text-amber-200/40 font-normal mt-0.5">Track your weapons, active conditions, and combat notes. Use the action economy reference below to know what you can do on your turn.</p>
          </div>
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAdd(true)} className="btn-primary text-xs flex items-center gap-1">
            <Plus size={12} /> Add Attack
          </button>
        </div>
      </div>

      {/* Combat Stats Summary */}
      {combatActive && (combatStats.totalDamageDealt > 0 || combatStats.totalHealing > 0 || combatStats.attackCount > 0) && (
        <div className="card bg-gradient-to-r from-[#14121c] to-[#1a1520]">
          <div className="flex items-center gap-2 mb-3">
            <Activity size={16} className="text-gold" />
            <h3 className="font-display text-amber-100">Combat Summary</h3>
            <button
              onClick={() => setCombatStats({ totalDamageDealt: 0, totalDamageTaken: 0, totalHealing: 0, attackCount: 0 })}
              className="text-xs text-amber-200/40 hover:text-amber-200/70 transition-colors ml-auto flex items-center gap-1"
            >
              <RotateCcw size={10} /> Reset Stats
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-red-950/30 border border-red-500/15 rounded-lg p-3 text-center">
              <div className="text-[10px] text-red-400/60 uppercase tracking-wider mb-1">Total Damage Dealt</div>
              <div className="text-xl font-display text-red-300">{combatStats.totalDamageDealt}</div>
            </div>
            <div className="bg-emerald-950/30 border border-emerald-500/15 rounded-lg p-3 text-center">
              <div className="text-[10px] text-emerald-400/60 uppercase tracking-wider mb-1">Total Healing</div>
              <div className="text-xl font-display text-emerald-300">{combatStats.totalHealing}</div>
            </div>
            <div className="bg-gold/5 border border-gold/15 rounded-lg p-3 text-center">
              <div className="text-[10px] text-gold/60 uppercase tracking-wider mb-1">Rounds Elapsed</div>
              <div className="text-xl font-display text-gold">{roundCounter}</div>
            </div>
            <div className="bg-purple-950/30 border border-purple-500/15 rounded-lg p-3 text-center">
              <div className="text-[10px] text-purple-400/60 uppercase tracking-wider mb-1">Avg Dmg/Round</div>
              <div className="text-xl font-display text-purple-300">{avgDamagePerRound}</div>
            </div>
          </div>
        </div>
      )}

      {/* Standalone Round Counter */}
      <div className="card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Timer size={16} className="text-gold" />
          <span className="font-display text-amber-100 text-sm">Round</span>
          <span className="text-gold font-bold text-xl bg-gold/10 border border-gold/30 px-3 py-0.5 rounded-lg min-w-[3rem] text-center">
            {roundCounter}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRoundCounter(r => Math.max(1, r - 1))}
            disabled={roundCounter <= 1}
            className="w-8 h-8 rounded-lg bg-white/5 border border-amber-200/10 hover:border-amber-200/20 hover:bg-white/10 transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
            title="Previous round"
          >
            <Minus size={14} className="text-amber-200/60" />
          </button>
          <button
            onClick={() => {
              setRoundCounter(r => {
                const newRound = r + 1;
                logEvent('round', `Round ${newRound} started (manual)`);
                return newRound;
              });
            }}
            className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/30 hover:bg-gold/20 hover:border-gold/50 transition-all flex items-center justify-center"
            title="Next round"
          >
            <Plus size={14} className="text-gold" />
          </button>
          <button
            onClick={() => { setRoundCounter(1); logEvent('round', 'Round counter reset'); }}
            className="text-xs text-amber-200/50 hover:text-amber-200/80 transition-colors flex items-center gap-1 ml-2"
            title="Reset round counter to 1"
          >
            <RotateCcw size={11} /> Reset
          </button>
        </div>
      </div>

      {/* Temp HP bar */}
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

      {/* Initiative / Combatant Tracker (Enhanced with HP tracking & damage/healing) */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <h3 className="font-display text-amber-100">Initiative Tracker</h3>
            {combatants.length > 0 && (
              <span className="text-gold font-bold text-sm bg-gold/10 border border-gold/30 px-2.5 py-0.5 rounded-lg">
                Round {roundCounter}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {combatants.length > 0 && (
              <>
                <button
                  onClick={prevTurn}
                  className="w-7 h-7 rounded-lg bg-white/5 border border-amber-200/10 hover:border-amber-200/20 hover:bg-white/10 transition-all flex items-center justify-center"
                  title="Previous turn"
                >
                  <ChevronLeft size={14} className="text-amber-200/60" />
                </button>
                <button
                  onClick={nextTurn}
                  className="px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/30 hover:bg-gold/20 hover:border-gold/50 transition-all flex items-center gap-1 text-xs text-gold font-medium"
                  title="Next turn — advances initiative order"
                >
                  Next Turn <ChevronRight size={14} />
                </button>
                <button onClick={clearCombatants} className="text-xs text-red-400/70 hover:text-red-400 transition-colors ml-1">
                  Clear All
                </button>
              </>
            )}
          </div>
        </div>
        <p className="text-xs text-amber-200/30 mb-3">Track turn order with HP. Click a combatant's HP to apply damage or healing.</p>
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
          <input
            type="number"
            className="input w-20"
            placeholder="HP"
            value={newCombatantHP}
            onChange={e => setNewCombatantHP(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCombatant()}
          />
          <button
            onClick={() => setNewCombatantIsEnemy(prev => !prev)}
            className={`px-2 py-1 rounded text-xs font-medium border transition-all ${
              newCombatantIsEnemy
                ? 'bg-red-900/40 text-red-300 border-red-500/30'
                : 'bg-blue-900/20 text-blue-300/60 border-blue-500/20'
            }`}
            title={newCombatantIsEnemy ? 'Enemy (click to toggle to ally)' : 'Ally (click to toggle to enemy)'}
          >
            {newCombatantIsEnemy ? <Skull size={14} /> : <Shield size={14} />}
          </button>
          <button onClick={addCombatant} className="btn-primary text-xs flex items-center gap-1">
            <Plus size={12} /> Add
          </button>
        </div>
        {combatants.length > 0 && (
          <div className="space-y-1">
            {combatants.map((c, idx) => {
              const isCurrentTurn = idx === currentTurn;
              const hpPct = c.maxHp > 0 ? Math.max(0, Math.min(100, ((c.currentHp ?? c.maxHp) / c.maxHp) * 100)) : -1;
              const isDead = c.maxHp > 0 && (c.currentHp ?? c.maxHp) <= 0;
              const isCalcTarget = calcTarget === c.id;
              return (
                <div key={c.id}>
                  <div className={`flex items-center gap-3 px-3 py-1.5 rounded-lg border transition-all ${
                    isDead ? 'bg-red-950/30 border-red-500/20 opacity-60' :
                    isCurrentTurn
                      ? 'bg-gold/10 border-gold/40'
                      : c.isEnemy ? 'bg-red-950/10 border-red-500/10' : 'bg-[#0a0a10] border-gold/10'
                  }`} style={isCurrentTurn ? { borderLeft: '3px solid rgb(201,168,76)' } : {}}>
                    {isCurrentTurn && (
                      <ArrowRight size={14} className="text-gold flex-shrink-0" />
                    )}
                    <span className="text-gold font-bold text-sm w-8 text-center">{c.initiative}</span>
                    <span className={`text-sm flex-1 ${isCurrentTurn ? 'text-amber-100 font-semibold' : 'text-amber-100'} ${isDead ? 'line-through' : ''}`}>
                      {c.isEnemy && <Skull size={12} className="inline text-red-400/60 mr-1" />}
                      {c.name}
                    </span>
                    {/* HP display with click-to-edit */}
                    {c.maxHp > 0 && (
                      <button
                        onClick={() => { setCalcTarget(isCalcTarget ? null : c.id); setCalcAmount(''); setCalcMode('damage'); setCalcModifier('normal'); }}
                        className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs transition-all ${
                          isCalcTarget ? 'bg-gold/15 border border-gold/40' : 'hover:bg-white/5'
                        }`}
                        title="Click to apply damage/healing"
                      >
                        <Heart size={11} className={`${
                          hpPct > 50 ? 'text-emerald-400' : hpPct > 25 ? 'text-yellow-400' : 'text-red-400'
                        }`} />
                        <span className={`font-medium ${
                          hpPct > 50 ? 'text-emerald-300' : hpPct > 25 ? 'text-yellow-300' : 'text-red-300'
                        }`}>
                          {c.currentHp ?? c.maxHp}/{c.maxHp}
                        </span>
                        {/* Mini HP bar */}
                        <div className="w-12 h-1.5 bg-[#0a0a10] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              hpPct > 50 ? 'bg-emerald-500' : hpPct > 25 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${hpPct}%` }}
                          />
                        </div>
                      </button>
                    )}
                    <button onClick={() => removeCombatant(c.id)} className="text-red-400/50 hover:text-red-400 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                  {/* Damage/Healing Calculator inline */}
                  {isCalcTarget && (
                    <div className="ml-11 mt-1 mb-2 p-3 bg-[#0d0d14] border border-gold/15 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <button
                          onClick={() => setCalcMode('damage')}
                          className={`text-xs px-2.5 py-1 rounded border transition-all ${
                            calcMode === 'damage' ? 'bg-red-900/40 text-red-300 border-red-500/30' : 'bg-white/5 text-amber-200/40 border-amber-200/10'
                          }`}
                        >
                          Damage
                        </button>
                        <button
                          onClick={() => setCalcMode('healing')}
                          className={`text-xs px-2.5 py-1 rounded border transition-all ${
                            calcMode === 'healing' ? 'bg-emerald-900/40 text-emerald-300 border-emerald-500/30' : 'bg-white/5 text-amber-200/40 border-amber-200/10'
                          }`}
                        >
                          Healing
                        </button>
                        {calcMode === 'damage' && (
                          <>
                            <span className="text-amber-200/20">|</span>
                            {['normal', 'resist', 'vuln'].map(mod => (
                              <button
                                key={mod}
                                onClick={() => setCalcModifier(mod)}
                                className={`text-[10px] px-2 py-0.5 rounded border transition-all ${
                                  calcModifier === mod
                                    ? mod === 'resist' ? 'bg-blue-900/50 text-blue-200 border-blue-500/40'
                                      : mod === 'vuln' ? 'bg-red-900/50 text-red-200 border-red-500/40'
                                      : 'bg-gold/15 text-gold border-gold/30'
                                    : 'bg-white/5 text-amber-200/40 border-amber-200/10'
                                }`}
                              >
                                {mod === 'normal' ? 'Normal' : mod === 'resist' ? '\u00BD Resist' : '\u00D72 Vuln'}
                              </button>
                            ))}
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          className="input w-24 text-sm"
                          placeholder="Amount"
                          value={calcAmount}
                          onChange={e => setCalcAmount(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              applyDamageHealing(c.id, parseInt(calcAmount) || 0, calcMode, calcModifier);
                              setCalcTarget(null);
                            }
                          }}
                          autoFocus
                        />
                        <button
                          onClick={() => {
                            applyDamageHealing(c.id, parseInt(calcAmount) || 0, calcMode, calcModifier);
                            setCalcTarget(null);
                          }}
                          className={`btn-primary text-xs px-3 py-1.5 ${calcMode === 'healing' ? '!bg-emerald-600/30 !border-emerald-500/40 !text-emerald-300' : '!bg-red-600/30 !border-red-500/40 !text-red-300'}`}
                        >
                          {calcMode === 'damage' ? 'Apply Damage' : 'Apply Healing'}
                        </button>
                        {calcMode === 'damage' && calcAmount && calcModifier !== 'normal' && (
                          <span className="text-xs text-amber-200/40">
                            = {calcModifier === 'resist' ? Math.floor((parseInt(calcAmount) || 0) / 2) : (parseInt(calcAmount) || 0) * 2} effective
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Turn Action Tracker */}
      <TurnActionTracker
        actionEcon={actionEcon}
        setActionEcon={setActionEcon}
        setReactionUsed={setReactionUsed}
        reactionKey={reactionKey}
        resetActionEconomy={resetActionEconomy}
        roundCounter={roundCounter}
        setRoundCounter={setRoundCounter}
        logEvent={logEvent}
        character={character}
      />

      {/* Legendary Action Counter */}
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
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-display text-amber-100">Attacks & Weapons<HelpTooltip text="Roll d20 + attack bonus. If the total meets or exceeds the target's AC, you hit. Then roll damage dice + modifier." /></h3>
          <button
            onClick={() => setFlankingEnabled(prev => !prev)}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all select-none ${
              flankingEnabled
                ? 'bg-gold/15 text-gold border border-gold/40'
                : 'bg-white/5 text-amber-200/40 border border-amber-200/10 hover:text-amber-200/60 hover:border-amber-200/20'
            }`}
            title={flankingEnabled ? 'Flanking active: +2 to attack rolls' : 'Enable flanking bonus'}
          >
            Flanking: +2 {flankingEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
        <p className="text-xs text-amber-200/30 mb-3">Click the dice icon to roll attack + damage instantly. Click damage to re-roll damage only.</p>
        {attacks.length === 0 ? (
          <p className="text-sm text-amber-200/30">No attacks configured. Add your weapons and cantrips here so you can quickly reference them during combat.</p>
        ) : (
          <div className="space-y-2">
            {attacks.map(atk => {
              const result = rollResults[atk.id];
              const critAnim = critAnimations[atk.id];
              return (
                <div key={atk.id} className={`bg-[#0a0a10] rounded-lg border transition-all ${
                  result?.isNat20 ? 'border-gold/60 shadow-[0_0_20px_rgba(201,168,76,0.2)]' :
                  result?.isNat1 ? 'border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.2)]' :
                  'border-gold/10'
                }`} style={critAnim === 'nat20' ? critShimmerStyle : critAnim === 'nat1' ? critFailStyle : {}}>
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
                        <span className="text-gold text-sm">{atk.attack_bonus ?? '+0'}{flankingEnabled && <span className="text-gold/60 text-xs ml-0.5">(+2)</span>}</span>
                        <span className="text-amber-200/60 text-sm">{atk.damage_dice ?? '\u2014'} {atk.damage_type && <span className="text-amber-200/40">{atk.damage_type}</span>}</span>
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
                        <span className="text-amber-200/40">+ {result.bonus}{result.flankBonus ? ` + ${result.flankBonus}` : ''} =</span>
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
                              \u00BD Resist
                            </button>
                            <button
                              onClick={() => setDmgModifiers(prev => ({ ...prev, [atk.id]: prev[atk.id] === 'vuln' ? null : 'vuln' }))}
                              className={`text-[10px] px-1.5 py-0.5 rounded border transition-all ${
                                mod === 'vuln' ? 'bg-red-900/60 text-red-200 border-red-500/40' : 'bg-white/5 text-amber-200/40 border-amber-200/10 hover:text-amber-200/60'
                              }`}
                              title="Double damage (vulnerability)"
                            >
                              \u00D72 Vuln
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
                <li key={i} className="text-xs text-amber-200/60 pl-3 relative before:content-['\u2022'] before:absolute before:left-0 before:text-gold/40">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Combat Log */}
      <CombatLog
        combatLog={combatLog}
        combatLogOpen={combatLogOpen}
        setCombatLogOpen={setCombatLogOpen}
        setCombatLog={setCombatLog}
        characterId={characterId}
      />

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

// --- Turn Action Tracker Component ---
const ACTION_TOOLTIPS = {
  action: {
    label: 'ACTION',
    general: [
      'Attack (melee or ranged)',
      'Cast a Spell (1 action)',
      'Dash (double movement)',
      'Dodge (attacks against you have disadvantage)',
      'Disengage (no opportunity attacks)',
      'Help (give an ally advantage)',
      'Hide (make a Stealth check)',
      'Ready (prepare a triggered action)',
      'Use an Object',
      'Search',
      'Grapple / Shove (replaces one attack)',
    ],
    classSpecific: {
      'Rogue': ['Cunning Action: Dash, Disengage, or Hide as action'],
      'Fighter': ['Action Surge (extra action, 1/rest)', 'Second Wind (bonus action heal)'],
      'Barbarian': ['Reckless Attack (advantage, enemies get advantage on you)'],
      'Monk': ['Flurry of Blows (2 unarmed strikes after Attack)', 'Stunning Strike (spend ki on hit)'],
      'Paladin': ['Divine Smite (add 2d8+ radiant on hit)', 'Lay on Hands (heal from pool)'],
      'Ranger': ["Hunter's Mark (bonus action, but Attack action needed)"],
      'Wizard': ['Arcane Recovery (restore spell slots, 1/day)'],
      'Warlock': ["Eldritch Blast (cantrip, multiple beams at higher levels)"],
      'Cleric': ['Turn Undead (Channel Divinity)'],
      'Druid': ['Wild Shape (2/rest)'],
      'Bard': ['Bardic Inspiration (give ally a die)'],
      'Sorcerer': ['Metamagic (modify spells with sorcery points)'],
    },
  },
  bonusAction: {
    label: 'BONUS ACTION',
    general: [
      'Two-Weapon Fighting (offhand attack)',
      'Cast a Spell (bonus action spells only)',
      'Certain class features',
    ],
    classSpecific: {
      'Rogue': ['Cunning Action: Dash, Disengage, or Hide'],
      'Barbarian': ['Rage (enter rage)', 'Reckless Attack (declare with Attack action)'],
      'Monk': ['Flurry of Blows (2 unarmed strikes, 1 ki)', 'Patient Defense (Dodge, 1 ki)', 'Step of the Wind (Dash/Disengage, 1 ki)'],
      'Ranger': ["Hunter's Mark", 'Heal (Healing Spirit, Goodberry)'],
      'Paladin': ['Smite spells (Thunderous, Wrathful, etc.)', 'Shield of Faith (+2 AC)'],
      'Cleric': ['Healing Word', 'Spiritual Weapon (attack as bonus action)', 'Shield of Faith'],
      'Wizard': ['Misty Step (teleport 30 ft)'],
      'Warlock': ["Hex (curse a target, extra 1d6)", 'Misty Step'],
      'Sorcerer': ['Quickened Spell (cast action spell as bonus)'],
      'Bard': ['Healing Word', 'Bardic Inspiration'],
      'Fighter': ['Second Wind (heal 1d10 + level)'],
      'Druid': ['Wild Shape (can also be action)'],
    },
    spells: [
      'Healing Word',
      'Misty Step',
      'Spiritual Weapon',
      'Shield of Faith',
      'Hex / Hunter\'s Mark',
      'Sanctuary',
      'Expeditious Retreat',
    ],
  },
  reaction: {
    label: 'REACTION',
    general: [
      'Opportunity Attack (enemy leaves your reach)',
      'Readied Action (trigger from Ready action)',
    ],
    classSpecific: {
      'Fighter': ['Riposte (Battle Master)', 'Protection fighting style (impose disadvantage)'],
      'Paladin': ['Protection fighting style', 'Aura saves (passive, no reaction needed)'],
      'Monk': ['Deflect Missiles (reduce ranged damage)', 'Slow Fall (reduce fall damage)'],
      'Rogue': ['Uncanny Dodge (halve attack damage)'],
      'Barbarian': ['Sentinel feat (if taken)'],
    },
    spells: [
      'Shield (+5 AC until next turn)',
      'Counterspell (negate a spell)',
      'Absorb Elements (resist + extra damage)',
      'Hellish Rebuke (fire damage on attacker)',
      'Feather Fall (slow falling)',
      'Silvery Barbs (force reroll)',
    ],
  },
};

const TOKEN_STYLES = {
  action: {
    active: 'bg-emerald-900/40 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
    used: 'bg-[#0a0a10] border-amber-200/10 opacity-40',
    dot: 'bg-emerald-400',
    dotUsed: 'bg-amber-200/20',
    text: 'text-emerald-300',
    textUsed: 'text-amber-200/30 line-through',
    iconColor: 'text-emerald-400',
    iconUsed: 'text-amber-200/20',
  },
  bonusAction: {
    active: 'bg-blue-900/40 border-blue-500/50 shadow-[0_0_12px_rgba(59,130,246,0.2)]',
    used: 'bg-[#0a0a10] border-amber-200/10 opacity-40',
    dot: 'bg-blue-400',
    dotUsed: 'bg-amber-200/20',
    text: 'text-blue-300',
    textUsed: 'text-amber-200/30 line-through',
    iconColor: 'text-blue-400',
    iconUsed: 'text-amber-200/20',
  },
  reaction: {
    active: 'bg-amber-900/40 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.2)]',
    used: 'bg-[#0a0a10] border-amber-200/10 opacity-40',
    dot: 'bg-amber-400',
    dotUsed: 'bg-amber-200/20',
    text: 'text-amber-300',
    textUsed: 'text-amber-200/30 line-through',
    iconColor: 'text-amber-400',
    iconUsed: 'text-amber-200/20',
  },
};

function TurnActionTracker({ actionEcon, setActionEcon, setReactionUsed, reactionKey, resetActionEconomy, setRoundCounter, logEvent, character }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredToken, setHoveredToken] = useState(null);

  const charClass = character?.class || '';
  const extraAttacks = (() => {
    const level = character?.level || 1;
    const cls = charClass.toLowerCase();
    if (cls === 'fighter' && level >= 20) return 4;
    if (cls === 'fighter' && level >= 11) return 3;
    if ((cls === 'fighter' || cls === 'paladin' || cls === 'ranger' || cls === 'barbarian' || cls === 'monk') && level >= 5) return 2;
    return 1;
  })();

  const handleTokenClick = (key) => {
    setActionEcon(prev => ({ ...prev, [key]: !prev[key] }));
    if (key === 'reaction') {
      setReactionUsed(prev => {
        const next = !prev;
        sessionStorage.setItem(reactionKey, next ? 'used' : 'available');
        return next;
      });
    }
  };

  const handleNewTurn = () => {
    resetActionEconomy();
    logEvent('turn', 'New turn — actions reset');
  };

  const handleNewRound = () => {
    resetActionEconomy();
    setRoundCounter(r => {
      const newRound = r + 1;
      logEvent('round', `Round ${newRound} started (New Round)`);
      return newRound;
    });
  };

  const renderTooltip = (key) => {
    const info = ACTION_TOOLTIPS[key];
    const classActions = charClass && info.classSpecific?.[charClass];
    return (
      <div className="absolute z-40 bottom-full left-1/2 -translate-x-1/2 mb-3 p-4 bg-[#14121c] border border-gold/25 rounded-lg shadow-2xl w-72 pointer-events-none">
        <div className="font-display text-amber-100 text-sm mb-2">{info.label}</div>
        {key === 'action' && extraAttacks > 1 && (
          <div className="mb-2 text-xs text-emerald-300 bg-emerald-900/30 border border-emerald-500/20 rounded px-2 py-1">
            Extra Attack: {extraAttacks} attacks per Attack action
          </div>
        )}
        <div className="text-[10px] uppercase tracking-wider text-amber-200/50 mb-1 font-semibold">Available Options</div>
        <ul className="space-y-0.5 mb-2">
          {info.general.map((item, i) => (
            <li key={i} className="text-xs text-amber-200/60 pl-2 relative before:content-['\u2022'] before:absolute before:left-0 before:text-gold/40">{item}</li>
          ))}
        </ul>
        {classActions && (
          <>
            <div className="text-[10px] uppercase tracking-wider text-gold/70 mb-1 font-semibold mt-2">{charClass} Features</div>
            <ul className="space-y-0.5 mb-2">
              {classActions.map((item, i) => (
                <li key={i} className="text-xs text-gold/70 pl-2 relative before:content-['\u2022'] before:absolute before:left-0 before:text-gold/40">{item}</li>
              ))}
            </ul>
          </>
        )}
        {info.spells && (
          <>
            <div className="text-[10px] uppercase tracking-wider text-purple-400/70 mb-1 font-semibold mt-2">Common Spells</div>
            <ul className="space-y-0.5">
              {info.spells.map((item, i) => (
                <li key={i} className="text-xs text-purple-300/60 pl-2 relative before:content-['\u2022'] before:absolute before:left-0 before:text-purple-400/40">{item}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  };

  const tokens = [
    { key: 'action', label: 'ACTION', icon: <Swords size={16} /> },
    { key: 'bonusAction', label: 'BONUS', icon: <Zap size={16} /> },
    { key: 'reaction', label: 'REACTION', icon: <Shield size={16} /> },
  ];

  return (
    <div className="card">
      <button
        onClick={() => setCollapsed(prev => !prev)}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-2">
          <Swords size={16} className="text-gold" />
          <h3 className="font-display text-amber-100">Turn Actions</h3>
          {!collapsed && (
            <span className="text-[10px] text-amber-200/30 ml-1">Click tokens to mark as used</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {collapsed && (
            <div className="flex items-center gap-1.5 mr-2">
              {tokens.map(({ key }) => {
                const used = actionEcon[key];
                const style = TOKEN_STYLES[key];
                return (
                  <div
                    key={key}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${used ? style.dotUsed : style.dot}`}
                  />
                );
              })}
            </div>
          )}
          {collapsed ? <ChevronDown size={16} className="text-amber-200/40" /> : <ChevronUp size={16} className="text-amber-200/40" />}
        </div>
      </button>

      {!collapsed && (
        <div className="mt-4">
          <div className="flex items-center gap-3 flex-wrap">
            {tokens.map(({ key, label, icon }) => {
              const used = actionEcon[key];
              const style = TOKEN_STYLES[key];
              return (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => setHoveredToken(key)}
                  onMouseLeave={() => setHoveredToken(null)}
                >
                  <button
                    onClick={() => handleTokenClick(key)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full border-2 transition-all select-none ${
                      used ? style.used : style.active
                    }`}
                  >
                    <div className={`transition-all ${used ? style.iconUsed : style.iconColor}`}>
                      {icon}
                    </div>
                    <span className={`text-sm font-bold tracking-wide ${used ? style.textUsed : style.text}`}>
                      {label}
                    </span>
                    <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center transition-all ${
                      used ? 'border-amber-200/20 bg-transparent' : 'border-current'
                    }`}>
                      {used && <X size={8} className="text-amber-200/30" />}
                    </div>
                  </button>
                  {hoveredToken === key && renderTooltip(key)}
                </div>
              );
            })}

            {/* Spacer + buttons */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={handleNewTurn}
                className="px-3 py-2 rounded-lg bg-gold/10 border border-gold/30 hover:bg-gold/20 hover:border-gold/50 transition-all flex items-center gap-1.5 text-xs text-gold font-medium"
                title="Reset all action tokens for a new turn"
              >
                <RotateCcw size={12} /> New Turn
              </button>
              <button
                onClick={handleNewRound}
                className="px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-500/30 hover:bg-purple-900/50 hover:border-purple-500/50 transition-all flex items-center gap-1.5 text-xs text-purple-300 font-medium"
                title="Reset tokens and advance round counter"
              >
                <Plus size={12} /> New Round
              </button>
            </div>
          </div>
        </div>
      )}
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
    <ModalPortal>
      <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
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
    </ModalPortal>
  );
}

function ConditionsPanel({ conditions, conditionDescriptions, onToggle, onSetDuration, onTickRound }) {
  const [expanded, setExpanded] = useState(null);
  const [durationInput, setDurationInput] = useState({});
  const [conditionSearch, setConditionSearch] = useState('');
  const [hoveredCondition, setHoveredCondition] = useState(null);
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
          Left-click to toggle on/off. Right-click or hover for rule description. Set duration in rounds for auto-expiry.
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
            <div key={cond.name} className="relative"
              onMouseEnter={() => setHoveredCondition(cond.name)}
              onMouseLeave={() => setHoveredCondition(null)}
            >
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
              {/* Quick hover tooltip showing mechanical effects */}
              {hoveredCondition === cond.name && effect && expanded !== cond.name && (
                <div className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-2 p-2.5 bg-[#14121c] border border-gold/20 rounded text-xs shadow-xl w-64 pointer-events-none">
                  <div className="font-display text-amber-100 text-xs mb-1">{cond.name}</div>
                  <p className="text-amber-200/60 leading-relaxed">{effect.summary}</p>
                  {effect.shortTag && (
                    <div className="mt-1.5 text-[10px] text-red-400/70 font-semibold">{effect.shortTag}</div>
                  )}
                </div>
              )}
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
              <button
                key={c.name}
                onClick={() => onToggle(c.name)}
                className="text-xs text-red-200 bg-red-900/40 px-2 py-0.5 rounded border border-red-500/20 hover:bg-red-800/50 hover:border-red-400/40 transition-all cursor-pointer group flex items-center gap-1"
                title={`Click to remove ${c.name}`}
              >
                {CONDITION_ICONS[c.name] || ''} {c.name}
                {c.rounds_remaining > 0 && <span className="ml-1 text-red-300/70">({c.rounds_remaining}r)</span>}
                <X size={10} className="text-red-400/0 group-hover:text-red-400/80 transition-colors" />
              </button>
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

function CombatLog({ combatLog, combatLogOpen, setCombatLogOpen, setCombatLog, characterId }) {
  const [logFilter, setLogFilter] = useState('all');

  const typeColors = {
    attack: 'text-red-400/70',
    condition: 'text-purple-400/70',
    round: 'text-gold/70',
    turn: 'text-amber-200/70',
    damage: 'text-orange-400/70',
    healing: 'text-emerald-400/70',
  };
  const typeBg = {
    attack: 'bg-red-900/20 border-red-500/10',
    condition: 'bg-purple-900/20 border-purple-500/10',
    round: 'bg-gold/5 border-gold/10',
    turn: 'bg-amber-900/10 border-amber-500/10',
    damage: 'bg-orange-900/20 border-orange-500/10',
    healing: 'bg-emerald-900/20 border-emerald-500/10',
  };

  const filteredLog = logFilter === 'all' ? combatLog : combatLog.filter(e => e.type === logFilter);

  // Latest entry preview when collapsed
  const latestEntry = combatLog.length > 0 ? combatLog[0] : null;

  return (
    <div className="card">
      <button
        onClick={() => setCombatLogOpen(prev => !prev)}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-2">
          <ScrollText size={16} className="text-gold" />
          <h3 className="font-display text-amber-100">Combat Log</h3>
          {combatLog.length > 0 && (
            <span className="text-[10px] text-amber-200/40 bg-white/5 px-1.5 py-0.5 rounded">{combatLog.length}</span>
          )}
        </div>
        {combatLogOpen ? <ChevronUp size={16} className="text-amber-200/40" /> : <ChevronDown size={16} className="text-amber-200/40" />}
      </button>

      {/* Latest entry preview when collapsed */}
      {!combatLogOpen && latestEntry && (
        <div className="mt-2 flex items-center gap-2 text-xs text-amber-200/40 truncate">
          <span className={`uppercase font-semibold tracking-wider ${typeColors[latestEntry.type] || 'text-amber-200/40'}`}>
            {latestEntry.type}
          </span>
          <span className="text-amber-200/30 truncate">{latestEntry.message}</span>
        </div>
      )}

      {combatLogOpen && (
        <div className="mt-3 space-y-1">
          {combatLog.length === 0 ? (
            <p className="text-xs text-amber-200/30">No combat events logged yet. Attacks, condition changes, and round advances will appear here.</p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                {/* Type filter buttons */}
                <div className="flex items-center gap-1">
                  <Filter size={11} className="text-amber-200/30 mr-1" />
                  {['all', 'attack', 'damage', 'healing', 'condition', 'round', 'turn'].map(type => (
                    <button
                      key={type}
                      onClick={() => setLogFilter(type)}
                      className={`text-[10px] px-2 py-0.5 rounded border transition-all capitalize ${
                        logFilter === type
                          ? 'bg-gold/15 text-gold border-gold/40 font-medium'
                          : 'bg-white/5 text-amber-200/40 border-amber-200/10 hover:text-amber-200/60 hover:border-amber-200/20'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setCombatLog([]);
                    sessionStorage.setItem(`codex_combatlog_${characterId}`, '[]');
                  }}
                  className="text-xs text-red-400/70 hover:text-red-400 transition-colors"
                >
                  Clear Log
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {filteredLog.length === 0 ? (
                  <p className="text-xs text-amber-200/30 py-2 text-center">No {logFilter} entries yet.</p>
                ) : (
                  filteredLog.map((entry, i) => {
                    const time = new Date(entry.ts);
                    const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                    return (
                      <div key={`${entry.ts}-${i}`} className={`flex items-start gap-2 px-3 py-1.5 rounded border text-xs ${typeBg[entry.type] || 'bg-white/[0.02] border-gold/5'}`}>
                        <span className="text-amber-200/20 font-mono flex-shrink-0 w-16">{timeStr}</span>
                        <span className={`uppercase font-semibold tracking-wider flex-shrink-0 w-16 ${typeColors[entry.type] || 'text-amber-200/40'}`}>
                          {entry.type}
                        </span>
                        <span className="text-amber-200/60">{entry.message}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
