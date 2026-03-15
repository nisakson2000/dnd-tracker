import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Plus, Trash2, Swords, Dice5, Timer, X, Search, Minus, RotateCcw, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ScrollText, ArrowRight, Filter, Heart, Shield, ShieldOff, Skull, Activity, Zap, AlertTriangle, Cross, Lightbulb } from 'lucide-react';
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
import { calculateEffectiveDamage, applyDamageToHp, calculateHealingResult, resolveDeathSave, checkConcentration } from '../utils/damageEngine';
import { insertCombatLog } from '../api/combatLog';
import { rollDie } from '../utils/dice';

const CONDITION_ICONS = {
  'Blinded': '\u{1F441}', 'Charmed': '\u{1F495}', 'Deafened': '\u{1F507}',
  'Exhaustion': '\u{1F635}', 'Frightened': '\u{1F631}', 'Grappled': '\u{1F91D}',
  'Incapacitated': '\u{1F4AB}', 'Invisible': '\u{1F47B}', 'Paralyzed': '\u{26A1}',
  'Petrified': '\u{1FAA8}', 'Poisoned': '\u{1F922}', 'Prone': '\u{2B07}',
  'Restrained': '\u{26D3}', 'Stunned': '\u{2B50}', 'Unconscious': '\u{1F480}',
};

function parseBonus(str) {
  const n = parseInt(str);
  return isNaN(n) ? 0 : n;
}

function parseDamage(expr) {
  const match = expr.match(/^(\d+)?d(\d+)([+-]\d+)?$/i);
  if (!match) return null;
  return { count: parseInt(match[1]) || 1, sides: parseInt(match[2]), mod: parseInt(match[3]) || 0 };
}

// --- Custom hook: consolidates all combat sessionStorage state ---
const COMBAT_SESSION_DEFAULTS = {
  combatants: [],
  roundCounter: 1,
  currentTurn: 0,
  combatStats: { totalDamageDealt: 0, totalDamageTaken: 0, totalHealing: 0, attackCount: 0 },
  actionEcon: { action: false, bonusAction: false, reaction: false },
  flankingEnabled: false,
  legendaryActions: { used: 0, max: 3 },
  combatLog: [],
  concentratingSpell: null, // { name: string } or null
  deathSaves: {}, // { [combatantId]: { successes: 0, failures: 0, stable: false, dead: false } }
  lairAction: { enabled: false, description: '' },
};

function useCombatSession(characterId) {
  const storageKey = `codex_combat_session_${characterId}`;

  // Read all combat state from sessionStorage (with migration from old keys)
  const readSession = useCallback((charId) => {
    const key = `codex_combat_session_${charId}`;
    try {
      const stored = sessionStorage.getItem(key);
      if (stored) return { ...COMBAT_SESSION_DEFAULTS, ...JSON.parse(stored) };
    } catch (err) { if (import.meta.env.DEV) console.warn('useCombatSession read error:', err); }

    // Migrate from legacy per-key storage
    const migrated = { ...COMBAT_SESSION_DEFAULTS };
    try {
      const init = sessionStorage.getItem(`codex_initiative_${charId}`);
      if (init) migrated.combatants = JSON.parse(init);
    } catch (err) { if (import.meta.env.DEV) console.warn('useCombatSession migrate initiative:', err); }
    try {
      const r = sessionStorage.getItem(`codex_round_${charId}`);
      if (r) migrated.roundCounter = parseInt(r) || 1;
    } catch (err) { if (import.meta.env.DEV) console.warn('useCombatSession migrate round:', err); }
    try {
      const t = sessionStorage.getItem(`codex_turn_${charId}`);
      if (t) migrated.currentTurn = parseInt(t) || 0;
    } catch (err) { if (import.meta.env.DEV) console.warn('useCombatSession migrate turn:', err); }
    try {
      const s = sessionStorage.getItem(`codex_combatstats_${charId}`);
      if (s) migrated.combatStats = { ...COMBAT_SESSION_DEFAULTS.combatStats, ...JSON.parse(s) };
    } catch (err) { if (import.meta.env.DEV) console.warn('useCombatSession migrate stats:', err); }
    try {
      const a = sessionStorage.getItem(`codex_actionecon_${charId}`);
      if (a) migrated.actionEcon = { ...COMBAT_SESSION_DEFAULTS.actionEcon, ...JSON.parse(a) };
    } catch (err) { if (import.meta.env.DEV) console.warn('useCombatSession migrate actionEcon:', err); }
    try {
      const f = sessionStorage.getItem(`codex_flanking_${charId}`);
      if (f) migrated.flankingEnabled = f === 'true';
    } catch (err) { if (import.meta.env.DEV) console.warn('useCombatSession migrate flanking:', err); }
    try {
      const l = sessionStorage.getItem(`codex_legendary_${charId}`);
      if (l) migrated.legendaryActions = { ...COMBAT_SESSION_DEFAULTS.legendaryActions, ...JSON.parse(l) };
    } catch (err) { if (import.meta.env.DEV) console.warn('useCombatSession migrate legendary:', err); }
    try {
      const log = sessionStorage.getItem(`codex_combatlog_${charId}`);
      if (log) migrated.combatLog = JSON.parse(log);
    } catch (err) { if (import.meta.env.DEV) console.warn('useCombatSession migrate combatLog:', err); }

    return migrated;
  }, []);

  const [session, setSessionRaw] = useState(() => readSession(characterId));

  // Persist whenever session changes
  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(session));
    } catch (err) { if (import.meta.env.DEV) console.warn('useCombatSession persist error:', err); }
  }, [session, storageKey]);

  // Re-read when characterId changes
  useEffect(() => {
    setSessionRaw(readSession(characterId));
  }, [characterId, readSession]);

  // Field-level setters that mirror useState setter API
  const setCombatants = useCallback((updater) => {
    setSessionRaw(prev => ({ ...prev, combatants: typeof updater === 'function' ? updater(prev.combatants) : updater }));
  }, []);
  const setRoundCounter = useCallback((updater) => {
    setSessionRaw(prev => ({ ...prev, roundCounter: typeof updater === 'function' ? updater(prev.roundCounter) : updater }));
  }, []);
  const setCurrentTurn = useCallback((updater) => {
    setSessionRaw(prev => ({ ...prev, currentTurn: typeof updater === 'function' ? updater(prev.currentTurn) : updater }));
  }, []);
  const setCombatStats = useCallback((updater) => {
    setSessionRaw(prev => ({ ...prev, combatStats: typeof updater === 'function' ? updater(prev.combatStats) : updater }));
  }, []);
  const setActionEcon = useCallback((updater) => {
    setSessionRaw(prev => ({ ...prev, actionEcon: typeof updater === 'function' ? updater(prev.actionEcon) : updater }));
  }, []);
  const setFlankingEnabled = useCallback((updater) => {
    setSessionRaw(prev => ({ ...prev, flankingEnabled: typeof updater === 'function' ? updater(prev.flankingEnabled) : updater }));
  }, []);
  const setLegendaryActions = useCallback((updater) => {
    setSessionRaw(prev => ({ ...prev, legendaryActions: typeof updater === 'function' ? updater(prev.legendaryActions) : updater }));
  }, []);
  const setCombatLog = useCallback((updater) => {
    setSessionRaw(prev => ({ ...prev, combatLog: typeof updater === 'function' ? updater(prev.combatLog) : updater }));
  }, []);
  const setConcentratingSpell = useCallback((updater) => {
    setSessionRaw(prev => ({ ...prev, concentratingSpell: typeof updater === 'function' ? updater(prev.concentratingSpell) : updater }));
  }, []);
  const setDeathSaves = useCallback((updater) => {
    setSessionRaw(prev => ({ ...prev, deathSaves: typeof updater === 'function' ? updater(prev.deathSaves || {}) : updater }));
  }, []);
  const setLairAction = useCallback((updater) => {
    setSessionRaw(prev => ({ ...prev, lairAction: typeof updater === 'function' ? updater(prev.lairAction || COMBAT_SESSION_DEFAULTS.lairAction) : updater }));
  }, []);

  return {
    combatants: session.combatants, setCombatants,
    roundCounter: session.roundCounter, setRoundCounter,
    currentTurn: session.currentTurn, setCurrentTurn,
    combatStats: session.combatStats, setCombatStats,
    actionEcon: session.actionEcon, setActionEcon,
    flankingEnabled: session.flankingEnabled, setFlankingEnabled,
    legendaryActions: session.legendaryActions, setLegendaryActions,
    combatLog: session.combatLog, setCombatLog,
    concentratingSpell: session.concentratingSpell, setConcentratingSpell,
    deathSaves: session.deathSaves || {}, setDeathSaves,
    lairAction: session.lairAction || COMBAT_SESSION_DEFAULTS.lairAction, setLairAction,
  };
}

function addCombatLogEntry(type, message, setLog) {
  const entry = { ts: Date.now(), type, message };
  setLog(prev => [entry, ...prev].slice(0, 50));
}

const DAMAGE_TYPES = [
  'Acid', 'Bludgeoning', 'Cold', 'Fire', 'Force', 'Lightning', 'Necrotic',
  'Piercing', 'Poison', 'Psychic', 'Radiant', 'Slashing', 'Thunder',
  'Nonmagical Bludgeoning', 'Nonmagical Piercing', 'Nonmagical Slashing',
];

// --- Condition-based tactical hints for enemies ---
const CONDITION_EXPLOIT_HINTS = {
  Prone: { icon: '\u2B07', hint: 'Prone target: melee attacks have advantage (ranged have disadvantage)' },
  Blinded: { icon: '\u{1F441}', hint: 'Blinded target: your attacks have advantage' },
  Stunned: { icon: '\u2B50', hint: 'Stunned target: attacks have advantage, auto-fail STR/DEX saves' },
  Paralyzed: { icon: '\u26A1', hint: 'Paralyzed target: attacks have advantage, melee auto-crits within 5ft' },
  Restrained: { icon: '\u26D3', hint: 'Restrained target: your attacks have advantage' },
  Frightened: { icon: '\u{1F631}', hint: 'Frightened target: has disadvantage on attacks and checks' },
  Poisoned: { icon: '\u{1F922}', hint: 'Poisoned target: has disadvantage on attacks and ability checks' },
  Unconscious: { icon: '\u{1F480}', hint: 'Unconscious target: attacks have advantage, melee auto-crits within 5ft' },
  Invisible: { icon: '\u{1F47B}', hint: 'Invisible target: your attacks have disadvantage unless you can see them' },
  Incapacitated: { icon: '\u{1F4AB}', hint: "Incapacitated target: can't take actions or reactions" },
};

function CombatSuggestions({ character, combatants, conditions, deathSaves, concentratingSpell, actionEcon, combatActive }) {
  const [collapsed, setCollapsed] = useState(true);

  const suggestions = useMemo(() => {
    if (!combatActive) return [];
    const tips = [];

    // 1. Low HP — suggest healing
    if (character?.current_hp > 0 && character?.max_hp > 0) {
      const hpRatio = character.current_hp / (character.max_hp || 1);
      if (hpRatio <= 0.25) {
        tips.push({ id: 'low-hp', icon: '\u2764\uFE0F', text: 'HP critical! Consider a healing potion, healing spell, or disengaging to safety.', priority: 1 });
      } else if (hpRatio <= 0.5) {
        tips.push({ id: 'half-hp', icon: '\u{1F49B}', text: 'HP below half. Keep healing options in mind — Second Wind, potions, or healing magic.', priority: 3 });
      }
    }

    // 2. Enemy conditions — suggest exploiting them
    const enemyCombatants = combatants.filter(c => c.isEnemy);
    for (const enemy of enemyCombatants) {
      // Check if any conditions stored in deathSaves or in the combatant's conditions array
      // Combatants don't store conditions directly, but we can check the conditions list for known enemies
      if (enemy.currentHp <= 0 && enemy.maxHp > 0) {
        // Enemy is down, skip
        continue;
      }
    }

    // Check player's own conditions for self-awareness hints
    if (Array.isArray(conditions) && conditions.length > 0) {
      for (const cond of conditions) {
        const condName = typeof cond === 'string' ? cond : cond?.name;
        if (!condName) continue;
        const effects = CONDITION_EFFECTS[condName];
        if (effects?.attackRolls === 'disadvantage') {
          tips.push({ id: `self-cond-${condName}`, icon: '\u26A0\uFE0F', text: `You are ${condName} — your attacks have disadvantage. Consider removing the condition first.`, priority: 2 });
        }
        if (effects?.cantAct) {
          tips.push({ id: `self-cond-${condName}-noact`, icon: '\u{1F6D1}', text: `You are ${condName} — you cannot take actions or reactions this turn.`, priority: 1 });
        }
      }
    }

    // 3. Concentration active — remind to maintain
    if (concentratingSpell) {
      tips.push({ id: 'concentration', icon: '\u{1F52E}', text: `Concentrating on ${concentratingSpell.name}. Taking damage requires a CON save (DC 10 or half damage, whichever is higher).`, priority: 4 });
    }

    // 4. Death saves happening for allies — suggest help
    if (deathSaves && Object.keys(deathSaves).length > 0) {
      for (const [combatantId, ds] of Object.entries(deathSaves)) {
        if (ds.dead || ds.stable) continue;
        const ally = combatants.find(c => c.id === Number(combatantId) || c.id === combatantId);
        if (ally && !ally.isEnemy) {
          tips.push({ id: `death-save-${combatantId}`, icon: '\u{1F198}', text: `${ally.name} is making death saves (${ds.successes} success, ${ds.failures} fail). Stabilize with Spare the Dying, Medicine DC 10, or heal them.`, priority: 1 });
        }
      }
    }

    // 5. Unused action economy — remind about available actions
    if (!actionEcon.action && !actionEcon.bonusAction && !actionEcon.reaction) {
      // All actions still available — no specific suggestion needed
    } else if (actionEcon.action && !actionEcon.bonusAction) {
      tips.push({ id: 'bonus-action', icon: '\u26A1', text: 'Bonus action still available! Offhand attack, class feature, or bonus action spell?', priority: 5 });
    } else if (actionEcon.action && actionEcon.bonusAction && !actionEcon.reaction) {
      tips.push({ id: 'reaction', icon: '\u{1F6E1}\uFE0F', text: 'Reaction still available. Save it for opportunity attacks or Shield/Counterspell.', priority: 5 });
    }

    // 6. Prone enemies in the tracker (by checking combatant names against conditions context)
    // Since conditions are per-character (not per-combatant), we check for general tactical tips
    // based on enemies being low HP
    for (const enemy of enemyCombatants) {
      if (enemy.maxHp > 0 && enemy.currentHp > 0 && enemy.currentHp <= Math.floor(enemy.maxHp * 0.25)) {
        tips.push({ id: `finish-${enemy.id}`, icon: '\u{1F3AF}', text: `${enemy.name} is nearly down (${enemy.currentHp}/${enemy.maxHp} HP). Focus fire to eliminate the threat.`, priority: 2 });
        break; // Only show one "finish them" suggestion
      }
    }

    // Sort by priority (lower = more important) and cap at 4
    return tips.sort((a, b) => a.priority - b.priority).slice(0, 4);
  }, [character?.current_hp, character?.max_hp, combatants, conditions, deathSaves, concentratingSpell, actionEcon, combatActive]);

  if (!combatActive || suggestions.length === 0) return null;

  return (
    <div className="card bg-gradient-to-r from-[#1a1610] to-[#14121c] border-amber-500/15">
      <button
        onClick={() => setCollapsed(c => !c)}
        className="flex items-center justify-between w-full group"
      >
        <div className="flex items-center gap-2">
          <Lightbulb size={16} className="text-amber-400/80" />
          <span className="font-display text-amber-200/80 text-sm">Suggestions</span>
          <span className="text-[10px] text-amber-200/40 bg-amber-200/5 border border-amber-200/10 px-1.5 py-0.5 rounded-full">
            {suggestions.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-amber-200/30 group-hover:text-amber-200/50 transition-colors">
            {collapsed ? 'Show hints' : 'Hide'}
          </span>
          {collapsed ? <ChevronDown size={14} className="text-amber-200/40" /> : <ChevronUp size={14} className="text-amber-200/40" />}
        </div>
      </button>
      {!collapsed && (
        <div className="mt-3 space-y-2">
          {suggestions.map(s => (
            <div
              key={s.id}
              className="flex items-start gap-2.5 px-3 py-2 rounded-lg bg-amber-900/10 border border-amber-500/10 hover:border-amber-500/20 transition-colors"
            >
              <span className="text-base mt-0.5 flex-shrink-0">{s.icon}</span>
              <span className="text-xs text-amber-200/70 leading-relaxed">{s.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Combat({ characterId, character, onConditionsChange }) {
  const { CONDITIONS } = useRuleset();
  const [attacks, setAttacks] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [notes, setNotes] = useState({ actions: '', bonus_actions: '', reactions: '', legendary_actions: '' });
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [rollResults, setRollResults] = useState({});
  const [dmgModifiers, setDmgModifiers] = useState({}); // 'resist' | 'vuln' | null per attack id
  const rollTimeoutRefs = useRef({});

  // --- All combat sessionStorage state consolidated into one hook ---
  const {
    combatants, setCombatants,
    roundCounter, setRoundCounter,
    currentTurn, setCurrentTurn,
    combatStats, setCombatStats,
    actionEcon, setActionEcon,
    flankingEnabled, setFlankingEnabled,
    legendaryActions, setLegendaryActions,
    combatLog, setCombatLog,
    concentratingSpell, setConcentratingSpell,
    deathSaves, setDeathSaves,
    lairAction, setLairAction,
  } = useCombatSession(characterId);

  const [combatLogOpen, setCombatLogOpen] = useState(false);

  const logEvent = useCallback((type, message) => {
    addCombatLogEntry(type, message, setCombatLog);
  }, [setCombatLog]);

  const [newCombatantName, setNewCombatantName] = useState('');
  const [newCombatantInit, setNewCombatantInit] = useState('');
  const [newCombatantHP, setNewCombatantHP] = useState('');
  const [newCombatantIsEnemy, setNewCombatantIsEnemy] = useState(false);

  const resetActionEconomy = useCallback(() => {
    setActionEcon({ action: false, bonusAction: false, reaction: false });
  }, [setActionEcon]);

  // --- Damage/Healing Calculator state ---
  const [calcTarget, setCalcTarget] = useState(null); // combatant id
  const [calcAmount, setCalcAmount] = useState('');
  const [calcMode, setCalcMode] = useState('damage'); // 'damage' | 'healing'
  const [calcModifier, setCalcModifier] = useState('normal'); // 'normal' | 'resist' | 'vuln'
  const [calcDamageType, setCalcDamageType] = useState(''); // damage type for auto-modifier detection

  // Parse character damage modifiers for auto-detection
  const charDamageModifiers = useMemo(() => {
    if (!character?.damage_modifiers) return { resistances: [], immunities: [], vulnerabilities: [] };
    try {
      const parsed = typeof character.damage_modifiers === 'string'
        ? JSON.parse(character.damage_modifiers)
        : character.damage_modifiers;
      return {
        resistances: parsed.resistances || [],
        immunities: parsed.immunities || [],
        vulnerabilities: parsed.vulnerabilities || [],
      };
    } catch (err) { if (import.meta.env.DEV) console.warn('charDamageModifiers parse error:', err); return { resistances: [], immunities: [], vulnerabilities: [] }; }
  }, [character?.damage_modifiers]);

  // --- Death save roll for a combatant ---
  const rollDeathSave = (combatantId) => {
    const target = combatants.find(c => c.id === combatantId);
    const ds = deathSaves[combatantId];
    if (!target || !ds || ds.dead || ds.stable) return;

    const roll = rollDie(20);
    const result = resolveDeathSave(roll);
    const newSuccesses = Math.min(3, ds.successes + result.successes);
    const newFailures = Math.min(3, ds.failures + result.failures);

    logEvent('death', `${target.name} death save: ${result.description}`);

    if (result.type === 'nat20') {
      // Heal to 1 HP, clear death saves
      setCombatants(prev => prev.map(c => c.id === combatantId ? { ...c, currentHp: 1 } : c));
      setDeathSaves(prev => { const next = { ...prev }; delete next[combatantId]; return next; });
      toast(`${target.name} rolls a Natural 20! Regains 1 HP!`, {
        icon: '\u2728', duration: 4000,
        style: { background: '#0a1a0a', color: '#86efac', border: '1px solid rgba(34,197,94,0.5)' },
      });
      return;
    }

    const isDead = newFailures >= 3;
    const isStable = newSuccesses >= 3;
    setDeathSaves(prev => ({
      ...prev,
      [combatantId]: { successes: newSuccesses, failures: newFailures, stable: isStable, dead: isDead },
    }));

    if (isDead) {
      logEvent('death', `${target.name} has died.`);
      toast(`${target.name} has died.`, { icon: '\u{1F480}', duration: 4000,
        style: { background: '#1a0505', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.5)' },
      });
    } else if (isStable) {
      logEvent('death', `${target.name} has stabilized!`);
      toast(`${target.name} has stabilized!`, { icon: '\u{1F49A}', duration: 3000,
        style: { background: '#0a1a0a', color: '#86efac', border: '1px solid rgba(34,197,94,0.4)' },
      });
    } else {
      toast(result.description, { icon: result.failures > 0 ? '\u274C' : '\u2705', duration: 2500,
        style: result.failures > 0
          ? { background: '#1a0a0a', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)' }
          : { background: '#0a1a0a', color: '#86efac', border: '1px solid rgba(34,197,94,0.3)' },
      });
    }
  };

  // --- Drop concentration ---
  const dropConcentration = () => {
    if (!concentratingSpell) return;
    logEvent('concentration', `Concentration on ${concentratingSpell.name} dropped`);
    toast(`Concentration on ${concentratingSpell.name} dropped`, {
      icon: '\u{1F52E}', duration: 2000,
      style: { background: '#1a0a2a', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.3)' },
    });
    setConcentratingSpell(null);
  };

  // --- Next/Previous Turn ---
  const nextTurn = () => {
    if (combatants.length === 0) return;
    setCurrentTurn(prev => {
      const next = prev + 1;
      const isNewRound = next >= combatants.length;
      const resolvedNext = isNewRound ? 0 : next;

      if (isNewRound) {
        setRoundCounter(r => {
          const newRound = r + 1;
          logEvent('round', `Round ${newRound} started`);
          return newRound;
        });
        // Auto-reset legendary actions on new round (use updater to avoid stale closure)
        setLegendaryActions(la => {
          if (la.max > 0) {
            logEvent('legendary', 'Legendary actions recharged');
            return { ...la, used: 0 };
          }
          return la;
        });
        // Lair action reminder (use updater to read fresh state)
        setLairAction(la => {
          if (la.enabled) {
            const desc = la.description ? ': ' + la.description.slice(0, 200) : '';
            toast(`Lair Action! (Init 20)${desc}`, {
              icon: '\u{1F3F0}', duration: 5000,
              style: { background: '#1a0a2a', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.4)' },
            });
            logEvent('lair', `Lair action triggered${desc}`);
          }
          return la; // don't mutate
        });
        // Tick condition durations on new round
        tickRound();
      }

      resetActionEconomy();

      // Log next combatant's turn (use resolvedNext to avoid stale currentTurn)
      const nextName = combatants[resolvedNext]?.name || '?';
      logEvent('turn', `${nextName}'s turn`);

      return resolvedNext;
    });
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
      // Adjust currentTurn if needed (use updater to avoid stale closure)
      setCurrentTurn(t => {
        if (idx < t) return Math.max(0, t - 1);
        if (t >= newList.length && newList.length > 0) return 0;
        return t;
      });
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
  const applyDamageHealing = (combatantId, amount, mode, modifier, damageTypeArg) => {
    if (!amount || amount <= 0) return;
    const target = combatants.find(c => c.id === combatantId);
    if (!target) return;

    if (mode === 'damage') {
      // --- Use damageEngine for resistance/vulnerability/immunity ---
      let resistances = [];
      let vulnerabilities = [];
      let immunities = [];

      // Auto-detect from character's damage modifiers if combatant matches character name
      if (damageTypeArg && modifier === 'normal' && character?.name &&
          target.name.toLowerCase() === character.name.toLowerCase()) {
        resistances = charDamageModifiers.resistances || [];
        vulnerabilities = charDamageModifiers.vulnerabilities || [];
        immunities = charDamageModifiers.immunities || [];
      }

      // Manual override takes precedence
      if (modifier === 'resist') { resistances = [damageTypeArg || 'all']; immunities = []; vulnerabilities = []; }
      else if (modifier === 'vuln') { vulnerabilities = [damageTypeArg || 'all']; immunities = []; resistances = []; }
      else if (modifier === 'immune') { immunities = [damageTypeArg || 'all']; resistances = []; vulnerabilities = []; }

      const dmgResult = calculateEffectiveDamage({
        amount,
        damageType: damageTypeArg || 'all',
        resistances,
        vulnerabilities,
        immunities,
      });

      const currentHp = target.currentHp ?? target.maxHp ?? 0;
      const tempHp = target.tempHp || 0;
      const maxHp = target.maxHp || 0;
      const hpResult = applyDamageToHp({ damage: dmgResult.effective, currentHp, tempHp, maxHp });

      // Apply HP change
      setCombatants(prev => prev.map(c => {
        if (c.id !== combatantId) return c;
        return { ...c, currentHp: hpResult.newHp, tempHp: hpResult.newTempHp };
      }));

      // Update stats
      setCombatStats(prev => ({
        ...prev,
        totalDamageDealt: prev.totalDamageDealt + dmgResult.effective,
        attackCount: prev.attackCount + 1,
      }));

      // Log message
      const modLabel = dmgResult.modifier !== 'normal' ? dmgResult.modifier : '';
      const modSuffix = modLabel ? ` (${modLabel}${damageTypeArg ? ` - ${damageTypeArg}` : ''})` : '';
      const dmgMsg = dmgResult.modifier === 'immune'
        ? `${target.name} is immune to ${damageTypeArg || 'this damage'}!`
        : `${target.name} took ${dmgResult.effective} damage${modSuffix}`;
      logEvent('damage', dmgMsg);

      const toastStyle = dmgResult.modifier === 'immune'
        ? { background: '#0a1a1a', color: '#fde68a', border: '1px solid rgba(234,179,8,0.3)' }
        : { background: '#1a0a0a', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)' };
      toast(dmgMsg, {
        icon: dmgResult.modifier === 'immune' ? '\u{1F6E1}' : '\u2694\uFE0F', duration: 2000,
        style: toastStyle,
      });

      // Persist to combat log DB (fire-and-forget)
      insertCombatLog('', roundCounter, currentTurn, 'damage', '', target.name, dmgMsg,
        JSON.stringify({ raw: amount, effective: dmgResult.effective, modifier: dmgResult.modifier, damageType: damageTypeArg })
      ).catch(e => console.warn('[Combat] combat log (damage) — silent fail for solo play:', e));

      // --- Death save trigger: dropped to 0 HP ---
      if (hpResult.droppedToZero) {
        if (hpResult.massiveDamage) {
          logEvent('death', `${target.name} suffered MASSIVE DAMAGE and is instantly killed!`);
          toast(`${target.name} is instantly killed! (massive damage)`, {
            icon: '\u{1F480}', duration: 4000,
            style: { background: '#1a0505', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.5)' },
          });
          setDeathSaves(prev => ({ ...prev, [combatantId]: { successes: 0, failures: 3, stable: false, dead: true } }));
        } else {
          logEvent('death', `${target.name} dropped to 0 HP! Death saves begin.`);
          toast(`${target.name} dropped to 0 HP! Death saves begin.`, {
            icon: '\u{1F480}', duration: 3000,
            style: { background: '#1a0505', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.4)' },
          });
          setDeathSaves(prev => ({ ...prev, [combatantId]: { successes: 0, failures: 0, stable: false, dead: false } }));
        }
      }

      // --- Damage while at 0 HP = auto death save failure ---
      if (currentHp === 0 && dmgResult.effective > 0) {
        const ds = deathSaves[combatantId];
        if (ds && !ds.dead && !ds.stable) {
          const newFailures = Math.min(3, ds.failures + 1);
          const isDead = newFailures >= 3;
          setDeathSaves(prev => ({ ...prev, [combatantId]: { ...ds, failures: newFailures, dead: isDead } }));
          logEvent('death', `${target.name} takes damage at 0 HP — automatic death save failure!`);
          if (isDead) {
            logEvent('death', `${target.name} has died.`);
            toast(`${target.name} has died.`, { icon: '\u{1F480}', duration: 4000,
              style: { background: '#1a0505', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.5)' },
            });
          }
        }
      }

      // --- Concentration check trigger ---
      if (concentratingSpell && dmgResult.effective > 0 && character?.name &&
          target.name.toLowerCase() === character.name.toLowerCase()) {
        const dc = checkConcentration(dmgResult.effective);
        toast(`Concentration check! DC ${dc} CON save to maintain ${concentratingSpell.name}`, {
          icon: '\u{1F52E}', duration: 5000,
          style: { background: '#1a0a2a', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.4)' },
        });
        logEvent('concentration', `Concentration check: DC ${dc} CON save for ${concentratingSpell.name}`);
      }

    } else {
      // --- Healing ---
      const currentHp = target.currentHp ?? 0;
      const maxHp = target.maxHp || 9999;
      const healResult = calculateHealingResult({ amount, currentHp, maxHp });

      setCombatants(prev => prev.map(c => {
        if (c.id !== combatantId) return c;
        return { ...c, currentHp: healResult.newHp };
      }));

      setCombatStats(prev => ({
        ...prev,
        totalHealing: prev.totalHealing + healResult.actualHealing,
      }));
      logEvent('healing', `${target.name} healed ${healResult.actualHealing} HP`);
      toast(`${target.name} healed ${healResult.actualHealing} HP`, {
        icon: '\u2764\uFE0F', duration: 2000,
        style: { background: '#0a1a0a', color: '#86efac', border: '1px solid rgba(34,197,94,0.3)' },
      });

      // Persist to combat log DB
      insertCombatLog('', roundCounter, currentTurn, 'healing', '', target.name,
        `${target.name} healed ${healResult.actualHealing} HP`,
        JSON.stringify({ amount, actual: healResult.actualHealing })
      ).catch(e => console.warn('[Combat] combat log (healing):', e));

      // --- Healing from 0 HP clears death saves (but not if dead — need resurrection) ---
      if (healResult.wasAtZero && healResult.newHp > 0) {
        const ds = deathSaves[combatantId];
        if (ds?.dead) {
          // Dead characters can't be healed by normal means — notify DM
          toast(`${target.name} is dead and cannot be healed. Use DM Revive or resurrection magic.`, {
            icon: '\u{1F480}', duration: 4000,
            style: { background: '#1a0505', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.4)' },
          });
          // Revert the HP change
          setCombatants(prev => prev.map(c => c.id === combatantId ? { ...c, currentHp: 0 } : c));
        } else {
          setDeathSaves(prev => {
            const next = { ...prev };
            delete next[combatantId];
            return next;
          });
          logEvent('death', `${target.name} is no longer dying (healed to ${healResult.newHp} HP)`);
        }
      }
    }
    setCalcAmount('');
    setCalcDamageType('');
  };

  // Reaction used state (driven by action economy toggle in TurnActionTracker)
  const [reactionUsed, setReactionUsed] = useState(false);

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

      {/* Combat Suggestions Panel */}
      <CombatSuggestions
        character={character}
        combatants={combatants}
        conditions={conditions}
        deathSaves={deathSaves}
        concentratingSpell={concentratingSpell}
        actionEcon={actionEcon}
        combatActive={combatActive}
      />

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
                        onClick={() => { setCalcTarget(isCalcTarget ? null : c.id); setCalcAmount(''); setCalcMode('damage'); setCalcModifier('normal'); setCalcDamageType(''); }}
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
                            {['normal', 'resist', 'vuln', 'immune'].map(mod => (
                              <button
                                key={mod}
                                onClick={() => setCalcModifier(mod)}
                                className={`text-[10px] px-2 py-0.5 rounded border transition-all ${
                                  calcModifier === mod
                                    ? mod === 'resist' ? 'bg-blue-900/50 text-blue-200 border-blue-500/40'
                                      : mod === 'vuln' ? 'bg-red-900/50 text-red-200 border-red-500/40'
                                      : mod === 'immune' ? 'bg-yellow-900/50 text-yellow-200 border-yellow-500/40'
                                      : 'bg-gold/15 text-gold border-gold/30'
                                    : 'bg-white/5 text-amber-200/40 border-amber-200/10'
                                }`}
                              >
                                {mod === 'normal' ? 'Normal' : mod === 'resist' ? '\u00BD Resist' : mod === 'vuln' ? '\u00D72 Vuln' : '\u{1F6E1} Immune'}
                              </button>
                            ))}
                          </>
                        )}
                      </div>
                      {/* Damage type selector for auto-modifier detection */}
                      {calcMode === 'damage' && (
                        <div className="flex items-center gap-2 mb-1">
                          <select
                            value={calcDamageType}
                            onChange={e => { setCalcDamageType(e.target.value); setCalcModifier('normal'); }}
                            className="input text-[11px]"
                            style={{ width: '140px', padding: '3px 6px' }}
                          >
                            <option value="">Type (any)</option>
                            {DAMAGE_TYPES.map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                          {/* Auto-detection hint for player character */}
                          {calcDamageType && character?.name && c.name.toLowerCase() === character.name.toLowerCase() && calcModifier === 'normal' && (() => {
                            const mods = charDamageModifiers;
                            if (mods.immunities.includes(calcDamageType)) return (
                              <span className="text-[10px] text-yellow-300/80 flex items-center gap-1"><ShieldOff size={10} /> Immune</span>
                            );
                            if (mods.resistances.includes(calcDamageType)) return (
                              <span className="text-[10px] text-blue-300/80 flex items-center gap-1"><Shield size={10} /> Resistant</span>
                            );
                            if (mods.vulnerabilities.includes(calcDamageType)) return (
                              <span className="text-[10px] text-red-300/80 flex items-center gap-1"><AlertTriangle size={10} /> Vulnerable</span>
                            );
                            return null;
                          })()}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          className="input w-24 text-sm"
                          placeholder="Amount"
                          value={calcAmount}
                          onChange={e => setCalcAmount(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              applyDamageHealing(c.id, parseInt(calcAmount) || 0, calcMode, calcModifier, calcDamageType);
                              setCalcTarget(null);
                            }
                          }}
                          autoFocus
                        />
                        <button
                          onClick={() => {
                            applyDamageHealing(c.id, parseInt(calcAmount) || 0, calcMode, calcModifier, calcDamageType);
                            setCalcTarget(null);
                          }}
                          className={`btn-primary text-xs px-3 py-1.5 ${calcMode === 'healing' ? '!bg-emerald-600/30 !border-emerald-500/40 !text-emerald-300' : '!bg-red-600/30 !border-red-500/40 !text-red-300'}`}
                        >
                          {calcMode === 'damage' ? 'Apply Damage' : 'Apply Healing'}
                        </button>
                        {calcMode === 'damage' && calcAmount && calcModifier !== 'normal' && (
                          <span className="text-xs text-amber-200/40">
                            = {calcModifier === 'immune' ? 0 : calcModifier === 'resist' ? Math.floor((parseInt(calcAmount) || 0) / 2) : (parseInt(calcAmount) || 0) * 2} effective
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {/* Death Save Tracker */}
                  {deathSaves[c.id] && !deathSaves[c.id].dead && (
                    <div className="ml-11 mt-1 mb-2 p-3 bg-[#1a0808] border border-red-500/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-display text-red-300 flex items-center gap-1.5">
                          <Skull size={12} /> Death Saves — {c.name}
                        </span>
                        {deathSaves[c.id].stable ? (
                          <span className="text-[10px] text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded border border-emerald-500/30">Stabilized</span>
                        ) : (
                          <button
                            onClick={() => rollDeathSave(c.id)}
                            className="text-xs px-2.5 py-1 rounded bg-red-900/40 text-red-300 border border-red-500/30 hover:bg-red-900/60 transition-all flex items-center gap-1"
                          >
                            <Dice5 size={11} /> Roll Death Save
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-emerald-400/70 uppercase tracking-wider">Successes</span>
                          {[0, 1, 2].map(i => (
                            <div key={`s-${i}`} className={`w-4 h-4 rounded-full border-2 transition-all ${
                              i < deathSaves[c.id].successes
                                ? 'bg-emerald-500 border-emerald-400'
                                : 'bg-transparent border-emerald-500/30'
                            }`} />
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-red-400/70 uppercase tracking-wider">Failures</span>
                          {[0, 1, 2].map(i => (
                            <div key={`f-${i}`} className={`w-4 h-4 rounded-full border-2 transition-all ${
                              i < deathSaves[c.id].failures
                                ? 'bg-red-500 border-red-400'
                                : 'bg-transparent border-red-500/30'
                            }`} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Dead indicator */}
                  {deathSaves[c.id]?.dead && (
                    <div className="ml-11 mt-1 mb-2 p-2 bg-[#1a0505] border border-red-500/30 rounded-lg text-center">
                      <span className="text-xs text-red-400 font-display">{'\u{1F480}'} {c.name} has died</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Concentration Tracker */}
      {concentratingSpell && (
        <div className="card bg-gradient-to-r from-purple-950/30 to-[#14121c] border-purple-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-purple-400">{'\u{1F52E}'}</span>
              <span className="text-sm font-display text-purple-200">Concentrating on</span>
              <span className="text-sm font-bold text-purple-100">{concentratingSpell.name}</span>
            </div>
            <button
              onClick={dropConcentration}
              className="text-xs px-2.5 py-1 rounded bg-purple-900/40 text-purple-300 border border-purple-500/30 hover:bg-purple-900/60 transition-all"
            >
              Drop Concentration
            </button>
          </div>
        </div>
      )}

      {/* Turn Action Tracker */}
      <TurnActionTracker
        actionEcon={actionEcon}
        setActionEcon={setActionEcon}
        setReactionUsed={setReactionUsed}
        resetActionEconomy={resetActionEconomy}
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
        <p className="text-[10px] text-amber-200/30 mt-2">Auto-resets each round on Next Turn.</p>
      </div>

      {/* Lair Actions */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-amber-100">Lair Actions</h3>
          <button
            onClick={() => setLairAction(prev => ({ ...prev, enabled: !prev.enabled }))}
            className={`text-xs px-2.5 py-1 rounded border transition-all ${
              lairAction.enabled
                ? 'bg-purple-900/40 text-purple-300 border-purple-500/30'
                : 'bg-white/5 text-amber-200/40 border-amber-200/10'
            }`}
          >
            {lairAction.enabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>
        {lairAction.enabled && (
          <div className="space-y-2">
            <p className="text-[10px] text-amber-200/30">Triggers on initiative count 20 (losing ties). Reminder shown each round.</p>
            <textarea
              className="input w-full text-xs"
              rows={2}
              placeholder="Describe lair action effects..."
              value={lairAction.description}
              onChange={e => setLairAction(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
        )}
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

function TurnActionTracker({ actionEcon, setActionEcon, setReactionUsed, resetActionEconomy, setRoundCounter, logEvent, character }) {
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
      setReactionUsed(prev => !prev);
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

  const onKeyDown = (e) => { if (e.key === 'Enter') { e.preventDefault(); handleSubmit(); } };

  return (
    <ModalPortal>
      <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="bg-[#14121c] border border-gold/30 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="font-display text-lg text-amber-100 mb-4">Add Attack</h3>
        <div className="space-y-3" onKeyDown={onKeyDown}>
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
