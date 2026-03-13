import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Dice5, Copy, ChevronDown, ChevronUp, BarChart3, Save, X, Play, Pencil, Check, Trash2, Clock, ClipboardCopy, RotateCcw } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import HelpTooltip from '../components/HelpTooltip';
import { HELP } from '../data/helpText';
import { computeConditionEffects } from '../data/conditionEffects';

/* ── Storage keys ── */
const getMacrosKey = (charId) => charId ? `codex_dice_macros_${charId}` : 'codex_dice_macros';
const getHistoryKey = (charId) => charId ? `codex_dice_history_${charId}` : 'codex_dice_history';
const MAX_MACROS = 30;
const MAX_HISTORY = 50;

/* ── localStorage helpers ── */
function loadFromStorage(key, fallback = []) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; }
  catch { return fallback; }
}
function saveToStorage(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* ignore */ }
}

/* ── Die constants ── */
const DICE = [4, 6, 8, 10, 12, 20, 100];
const DIE_LABELS = {
  4: 'Damage', 6: 'Common', 8: 'Damage', 10: 'Damage',
  12: 'Barb HD', 20: 'Main die', 100: 'Percentile',
};
const DIE_TIPS = {
  4: 'd4 — Dagger damage, Magic Missile, healing spells',
  6: 'd6 — Shortsword, Fireball damage, Sneak Attack',
  8: 'd8 — Longsword, many spell damage dice',
  10: 'd10 — Heavy crossbow, Fire Bolt, Eldritch Blast',
  12: 'd12 — Greataxe, Barbarian hit dice',
  20: 'd20 — The main die! Attack rolls, saving throws, ability checks',
  100: 'd100 — Percentile rolls, Wild Magic table, random loot',
};

/* ── Standard Array for stat generation ── */
const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
const ABILITY_NAMES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

/* ── Point Buy costs (8-15 range, PHB rules) ── */
const POINT_BUY_COSTS = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
const POINT_BUY_TOTAL = 27;

/* ── Core dice functions ── */
function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

/**
 * Advanced expression parser.
 * Supports: 2d6+1d8+5, 4d6kh3, 2d20kl1, flat modifiers, subtraction
 * Returns null on invalid input.
 *
 * Result: { groups: [{ count, sides, keep, keepMode, rolls, kept, subtotal }], modifier, total, breakdown }
 */
function parseAndRollExpression(expr) {
  const cleaned = expr.replace(/\s+/g, '').toLowerCase();
  if (!cleaned) return null;

  // Tokenize: split on + or - but keep the sign
  const tokens = [];
  let current = '';
  let sign = '+';
  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if ((ch === '+' || ch === '-') && i > 0) {
      tokens.push({ sign, token: current });
      sign = ch;
      current = '';
    } else if (ch === '+' || ch === '-') {
      sign = ch;
    } else {
      current += ch;
    }
  }
  if (current) tokens.push({ sign, token: current });

  if (tokens.length === 0) return null;

  const groups = [];
  let flatModifier = 0;
  let totalResult = 0;
  const breakdownParts = [];

  for (const { sign, token } of tokens) {
    const signMul = sign === '-' ? -1 : 1;

    // Match dice: NdX, NdXkhY, NdXklY
    const diceMatch = token.match(/^(\d+)?d(\d+)(?:k([hl])(\d+))?$/);
    if (diceMatch) {
      const count = parseInt(diceMatch[1]) || 1;
      const sides = parseInt(diceMatch[2]);
      const keepMode = diceMatch[3] || null; // 'h' or 'l' or null
      const keepCount = diceMatch[4] ? parseInt(diceMatch[4]) : null;

      if (count > 100 || sides > 1000 || count < 1 || sides < 1) return null;
      if (keepCount !== null && (keepCount < 1 || keepCount > count)) return null;

      const rolls = Array.from({ length: count }, () => rollDie(sides));
      let kept = [...rolls];
      let dropped = [];

      if (keepMode && keepCount !== null) {
        const sorted = rolls.map((v, i) => ({ v, i })).sort((a, b) => b.v - a.v);
        if (keepMode === 'h') {
          // Keep highest
          const keptIndices = new Set(sorted.slice(0, keepCount).map(x => x.i));
          kept = rolls.filter((_, i) => keptIndices.has(i));
          dropped = rolls.map((v, i) => ({ v, i, drop: !keptIndices.has(i) }));
        } else {
          // Keep lowest
          const keptIndices = new Set(sorted.slice(-keepCount).map(x => x.i));
          kept = rolls.filter((_, i) => keptIndices.has(i));
          dropped = rolls.map((v, i) => ({ v, i, drop: !keptIndices.has(i) }));
        }
      }

      const subtotal = kept.reduce((s, v) => s + v, 0) * signMul;
      totalResult += subtotal;

      // Build breakdown string
      let bk = `[${rolls.map((v, i) => {
        if (dropped.length > 0) {
          const info = dropped.find(d => d.i === i);
          return info && info.drop ? `~~${v}~~` : `**${v}**`;
        }
        return String(v);
      }).join(', ')}]`;
      if (keepMode) {
        bk += ` keep ${keepMode === 'h' ? 'highest' : 'lowest'} ${keepCount}`;
      }

      groups.push({
        count, sides, keepMode, keepCount, rolls, kept, dropped,
        subtotal: Math.abs(subtotal), sign: signMul,
        expr: `${count}d${sides}${keepMode ? `k${keepMode}${keepCount}` : ''}`,
      });

      breakdownParts.push(`${sign === '-' ? '- ' : (breakdownParts.length > 0 ? '+ ' : '')}${bk}`);
    } else {
      // Flat modifier
      const num = parseInt(token);
      if (isNaN(num)) return null;
      flatModifier += num * signMul;
      totalResult += num * signMul;
      breakdownParts.push(`${sign === '-' ? '- ' : (breakdownParts.length > 0 ? '+ ' : '')}${num}`);
    }
  }

  if (groups.length === 0 && flatModifier === 0) return null;

  return { groups, modifier: flatModifier, total: totalResult, breakdownParts };
}

/**
 * Validate an expression string without rolling it.
 */
function validateExpression(expr) {
  const cleaned = expr.replace(/\s+/g, '').toLowerCase();
  if (!cleaned) return false;
  // Quick regex to verify structure
  const pattern = /^[+-]?(\d*d\d+(k[hl]\d+)?|\d+)([+-](\d*d\d+(k[hl]\d+)?|\d+))*$/;
  return pattern.test(cleaned);
}

/**
 * Simple parse for expression validation (no rolling).
 * Returns { count, sides, modifier } for simple NdX+M expressions (legacy compat).
 */
function parseSimpleRoll(expr) { // eslint-disable-line no-unused-vars
  const match = expr.match(/^(\d+)?d(\d+)([+-]\d+)?$/i);
  if (!match) return null;
  const count = parseInt(match[1]) || 1;
  const sides = parseInt(match[2]);
  const modifier = parseInt(match[3]) || 0;
  if (count > 100 || sides > 100 || count < 1 || sides < 1) return null;
  return { count, sides, modifier };
}

function rollStatBlock() {
  const stats = [];
  for (let i = 0; i < 6; i++) {
    const dice = Array.from({ length: 4 }, () => rollDie(6));
    const minVal = Math.min(...dice);
    const minIdx = dice.indexOf(minVal);
    const total = dice.reduce((s, v) => s + v, 0) - minVal;
    stats.push({ dice, droppedIdx: minIdx, total });
  }
  return stats;
}

/* ── Timestamp formatting ── */
function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatTimeAgo(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(ts).toLocaleDateString();
}


export default function DiceRoller({ characterId, activeConditions = [], diceHistory, onDiceHistoryChange }) {
  // Use lifted state if provided, else local state (fallback)
  const [localHistory, setLocalHistory] = useState([]);
  const history = diceHistory || localHistory;
  const setHistory = onDiceHistoryChange || setLocalHistory;

  const [customExpr, setCustomExpr] = useState('');
  const [rollLabel, setRollLabel] = useState('');
  const [lastRoll, setLastRoll] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [rollMode, setRollMode] = useState('normal');
  const [statBlockResult, setStatBlockResult] = useState(null);
  const [showStatBlock, setShowStatBlock] = useState(false);
  const [statMode, setStatMode] = useState('roll'); // 'roll' | 'standard' | 'pointbuy'
  const [showStats, setShowStats] = useState(false);
  const [macros, setMacros] = useState([]);
  const [editingMacro, setEditingMacro] = useState(null); // { id, name, expr }
  const [pointBuyScores, setPointBuyScores] = useState([8, 8, 8, 8, 8, 8]);
  const condEffects = computeConditionEffects(activeConditions);
  const historyInitialized = useRef(false);

  // Load macros from per-character localStorage
  useEffect(() => {
    setMacros(loadFromStorage(getMacrosKey(characterId)));
  }, [characterId]);

  // Load persistent history from localStorage on mount
  useEffect(() => {
    if (historyInitialized.current) return;
    historyInitialized.current = true;
    const saved = loadFromStorage(getHistoryKey(characterId));
    if (saved.length > 0 && history.length === 0) {
      setHistory(() => saved.slice(0, MAX_HISTORY));
    }
  }, [characterId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist history to localStorage when it changes
  useEffect(() => {
    if (history.length > 0) {
      saveToStorage(getHistoryKey(characterId), history.slice(0, MAX_HISTORY));
    }
  }, [history, characterId]);

  const saveMacros = useCallback((newMacros) => {
    setMacros(newMacros);
    saveToStorage(getMacrosKey(characterId), newMacros);
  }, [characterId]);

  const handleSaveMacro = () => {
    if (!lastRoll) { toast.error('Roll something first'); return; }
    if (macros.length >= MAX_MACROS) { toast.error(`Maximum ${MAX_MACROS} macros reached — delete one first`); return; }
    const name = prompt('Name this roll macro:');
    if (!name || !name.trim()) return;
    const expr = lastRoll.expr.replace(/ \(ADV\)$/, '').replace(/ \(DIS\)$/, '');
    const newMacros = [...macros, { id: Date.now().toString(36), name: name.trim(), expr }];
    saveMacros(newMacros);
    toast.success(`Saved "${name.trim()}"`);
  };

  const handleDeleteMacro = (id) => {
    saveMacros(macros.filter(m => m.id !== id));
  };

  const handleEditMacro = (macro) => {
    setEditingMacro({ ...macro });
  };

  const handleSaveEditMacro = () => {
    if (!editingMacro) return;
    if (!editingMacro.name.trim()) { toast.error('Macro name cannot be empty'); return; }
    if (!validateExpression(editingMacro.expr)) { toast.error('Invalid dice expression'); return; }
    saveMacros(macros.map(m => m.id === editingMacro.id ? { ...m, name: editingMacro.name.trim(), expr: editingMacro.expr.trim() } : m));
    setEditingMacro(null);
    toast.success('Macro updated');
  };

  const handleRunMacro = (macro) => {
    doAdvancedRoll(macro.expr, macro.name);
  };

  // Auto-set roll mode based on active conditions
  useEffect(() => {
    if (condEffects.netAttackMode !== 'normal') {
      setRollMode(condEffects.netAttackMode);
    }
  }, [condEffects.netAttackMode]);

  /**
   * Advanced roll handler: parses complex expressions and produces detailed results.
   */
  const doAdvancedRoll = useCallback((expression, autoLabel = '') => {
    setRolling(true);
    setTimeout(() => {
      const result = parseAndRollExpression(expression);
      if (!result) {
        toast.error('Invalid dice expression');
        setRolling(false);
        return;
      }

      const { groups, modifier, total, breakdownParts } = result;

      // Check for advantage/disadvantage on single d20 rolls
      let advInfo = null;
      let finalTotal = total;
      const allRolls = groups.flatMap(g => g.kept);

      // Handle adv/dis for simple 1d20 expressions
      const isSingleD20 = groups.length === 1 && groups[0].count === 1 && groups[0].sides === 20 && !groups[0].keepMode;
      if (isSingleD20 && rollMode !== 'normal') {
        const roll1 = groups[0].rolls[0];
        const roll2 = rollDie(20);
        const chosen = rollMode === 'advantage' ? Math.max(roll1, roll2) : Math.min(roll1, roll2);
        finalTotal = chosen + modifier;
        advInfo = { roll1, roll2, mode: rollMode, chosen };
      }

      const isNat20 = isSingleD20 && (advInfo ? advInfo.chosen === 20 : groups[0].rolls[0] === 20);
      const isNat1 = isSingleD20 && (advInfo ? advInfo.chosen === 1 : groups[0].rolls[0] === 1);

      const modeTag = advInfo ? (advInfo.mode === 'advantage' ? ' (ADV)' : ' (DIS)') : '';
      const label = rollLabel || autoLabel;

      const entry = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        expr: `${expression}${modeTag}`,
        label,
        rolls: advInfo ? [advInfo.chosen] : allRolls,
        groups: groups.map(g => ({
          expr: g.expr,
          rolls: g.rolls,
          kept: g.kept,
          dropped: g.dropped,
          subtotal: g.subtotal,
          sign: g.sign,
        })),
        modifier,
        total: advInfo ? finalTotal : total,
        isNat20,
        isNat1,
        advInfo,
        breakdownParts,
      };

      setLastRoll(entry);
      setHistory(prev => [entry, ...prev].slice(0, MAX_HISTORY));
      setRolling(false);
      if (rollLabel) setRollLabel('');
    }, 300);
  }, [rollMode, rollLabel, setHistory]);

  /**
   * Legacy simple roll for quick buttons.
   */
  const doRoll = useCallback((count, sides, modifier = 0, autoLabel = '') => {
    const expr = `${count}d${sides}${modifier > 0 ? `+${modifier}` : modifier < 0 ? `${modifier}` : ''}`;
    doAdvancedRoll(expr, autoLabel);
  }, [doAdvancedRoll]);

  const handleQuickRoll = (sides) => doRoll(1, sides, 0, `d${sides}`);

  const handleCustomRoll = () => {
    const trimmed = customExpr.trim();
    if (!trimmed) return;
    if (validateExpression(trimmed)) {
      doAdvancedRoll(trimmed, trimmed);
      setCustomExpr('');
    } else {
      toast.error('Invalid expression — try "2d6+1d8+5", "4d6kh3", "2d20kl1"');
    }
  };

  const handleRollStats = () => {
    const result = rollStatBlock();
    setStatBlockResult(result);
    setShowStatBlock(true);
    const grandTotal = result.reduce((s, r) => s + r.total, 0);
    const entry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      expr: '4d6kh3 x6',
      label: 'Stat Block Roll',
      rolls: result.map(r => r.total),
      groups: [],
      modifier: 0,
      total: grandTotal,
      isNat20: false,
      isNat1: false,
      advInfo: null,
      breakdownParts: [],
    };
    setHistory(prev => [entry, ...prev].slice(0, MAX_HISTORY));
  };

  const handleCopyRoll = async (entry) => {
    const time = formatTime(entry.timestamp || parseInt(entry.id));
    const label = entry.label ? ` (${entry.label})` : '';
    const line = `[${time}] ${entry.expr}: ${entry.total}${label}`;
    try {
      await navigator.clipboard.writeText(line);
      toast.success('Roll copied to clipboard');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleCopyHistory = async () => {
    if (history.length === 0) { toast.error('No rolls to copy'); return; }
    const lines = history.slice().reverse().map(entry => {
      const time = formatTime(entry.timestamp || parseInt(entry.id));
      const label = entry.label ? ` (${entry.label})` : '';
      return `[${time}] ${entry.expr}: ${entry.total}${label}`;
    });
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      toast.success('Roll history copied to clipboard');
    } catch {
      toast.error('Failed to copy — clipboard access denied');
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try { localStorage.removeItem(getHistoryKey(characterId)); } catch { /* ignore */ }
  };

  /* ── Point Buy helpers ── */
  const pointBuySpent = useMemo(() =>
    pointBuyScores.reduce((sum, score) => sum + (POINT_BUY_COSTS[score] || 0), 0),
    [pointBuyScores]
  );

  const handlePointBuyChange = (idx, delta) => {
    setPointBuyScores(prev => {
      const next = [...prev];
      const newVal = next[idx] + delta;
      if (newVal < 8 || newVal > 15) return prev;
      const newCost = POINT_BUY_COSTS[newVal] - POINT_BUY_COSTS[next[idx]];
      if (pointBuySpent + newCost > POINT_BUY_TOTAL) return prev;
      next[idx] = newVal;
      return next;
    });
  };

  /* ── Roll statistics ── */
  const rollStats = useMemo(() => {
    if (history.length === 0) return null;

    let totalRolls = history.length;
    let nat20Count = 0;
    let nat1Count = 0;
    let highestRoll = -Infinity;
    let highestExpr = '';
    let lowestRoll = Infinity;
    let lowestExpr = '';
    let totalSum = 0;

    const byType = {};

    for (const entry of history) {
      totalSum += entry.total;
      if (entry.isNat20) nat20Count++;
      if (entry.isNat1) nat1Count++;
      if (entry.total > highestRoll) { highestRoll = entry.total; highestExpr = entry.expr; }
      if (entry.total < lowestRoll) { lowestRoll = entry.total; lowestExpr = entry.expr; }

      // Per-die-type stats for single-die quick rolls
      const match = entry.expr.match(/^1?d(\d+)/i);
      if (match) {
        const dieType = `d${match[1]}`;
        if (!byType[dieType]) byType[dieType] = { rolls: [], total: 0 };
        const val = entry.rolls?.[0];
        if (val != null) {
          byType[dieType].rolls.push(val);
          byType[dieType].total += val;
        }
      }
    }

    const perDie = {};
    for (const [dieType, data] of Object.entries(byType)) {
      if (data.rolls.length >= 3) {
        perDie[dieType] = {
          count: data.rolls.length,
          average: (data.total / data.rolls.length).toFixed(1),
          highest: Math.max(...data.rolls),
          lowest: Math.min(...data.rolls),
        };
      }
    }

    return {
      totalRolls,
      nat20Count,
      nat1Count,
      highestRoll: highestRoll === -Infinity ? null : highestRoll,
      highestExpr,
      lowestRoll: lowestRoll === Infinity ? null : lowestRoll,
      lowestExpr,
      average: (totalSum / totalRolls).toFixed(1),
      perDie,
    };
  }, [history]);

  return (
    <div className="space-y-6 max-w-none">
      <h2 className="text-2xl font-display text-amber-100 flex items-center gap-2">
        <Dice5 size={20} />
        <div>
          <span>Dice Roller<HelpTooltip text={HELP.diceBasics} /></span>
          <p className="text-xs text-amber-200/40 font-normal mt-0.5">Roll any combination of dice. Supports advanced expressions like &quot;2d6+1d8+5&quot;, &quot;4d6kh3&quot; (keep highest), &quot;2d20kl1&quot; (keep lowest).</p>
        </div>
      </h2>

      {/* Roll Label */}
      <div className="card">
        <h3 className="font-display text-amber-100 mb-2">Roll Label</h3>
        <p className="text-xs text-amber-200/30 mb-2">Give your next roll context — appears in history so you know what it was for.</p>
        <input
          className="input w-full"
          placeholder='e.g. "Attack — Longsword", "DEX save", "Stealth check"'
          value={rollLabel}
          onChange={e => setRollLabel(e.target.value)}
        />
      </div>

      {/* Advantage / Disadvantage Toggle */}
      <div className="card">
        <h3 className="font-display text-amber-100 mb-2">Roll Mode</h3>
        <p className="text-xs text-amber-200/30 mb-3">Advantage/Disadvantage applies to d20 rolls only. Rolls 2d20 and takes the higher (ADV) or lower (DIS) result.</p>
        {condEffects.netAttackMode !== 'normal' && (
          <div className={`text-xs mb-3 px-3 py-2 rounded border ${
            condEffects.netAttackMode === 'disadvantage'
              ? 'bg-red-950/40 border-red-500/30 text-red-300'
              : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
          }`}>
            Auto-set to <span className="font-semibold">{condEffects.netAttackMode}</span> from active conditions ({activeConditions.join(', ')}). You can override manually.
          </div>
        )}
        <div className="flex gap-2">
          {[
            { mode: 'normal', label: 'Normal' },
            { mode: 'advantage', label: 'Advantage' },
            { mode: 'disadvantage', label: 'Disadvantage' },
          ].map(({ mode, label }) => (
            <button
              key={mode}
              onClick={() => setRollMode(mode)}
              className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                rollMode === mode
                  ? mode === 'advantage' ? 'bg-emerald-800/50 text-emerald-300 border border-emerald-500/40'
                  : mode === 'disadvantage' ? 'bg-red-800/50 text-red-300 border border-red-500/40'
                  : 'bg-gold/15 text-amber-100 border border-gold/40'
                  : 'bg-[#0d0d12] text-amber-200/40 border border-amber-200/10 hover:text-amber-200/60'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Roll Buttons */}
      <div className="card">
        <h3 className="font-display text-amber-100 mb-3">Quick Roll</h3>
        <div className="flex flex-wrap gap-3">
          {DICE.map(sides => (
            <button key={sides} onClick={() => handleQuickRoll(sides)}
              className="w-16 h-16 rounded-lg bg-[#0d0d12] border-2 border-gold/20 hover:border-gold/50 transition-all flex flex-col items-center justify-center group hover:shadow-[0_0_15px_rgba(201,168,76,0.2)]"
              aria-label={`Roll d${sides}`}
              title={`Roll 1d${sides} — ${DIE_TIPS[sides]}`}
            >
              <span className="text-lg font-display text-gold group-hover:text-amber-100 transition-colors">d{sides}</span>
              <span className="text-[9px] text-amber-200/30 group-hover:text-amber-200/50">{DIE_LABELS[sides]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Saved Roll Macros */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-amber-100">Saved Rolls</h3>
          {lastRoll && (
            <button onClick={handleSaveMacro} className="text-xs text-amber-200/30 hover:text-amber-200/60 transition-colors flex items-center gap-1" title="Save the last rolled expression as a macro">
              <Save size={12} /> Save Current
            </button>
          )}
        </div>
        <p className="text-xs text-amber-200/30 mb-3">Save frequently used rolls as quick-access macros. Click to roll, pencil to edit, X to delete.</p>
        {macros.length === 0 ? (
          <p className="text-sm text-amber-200/20">No saved rolls yet. Roll something and click &quot;Save Current&quot; to add one.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {macros.map(macro => (
              <div key={macro.id} className="group relative flex items-center gap-1.5 bg-[#0d0d12] border border-gold/15 rounded-lg px-3 py-2 hover:border-gold/40 transition-all">
                {editingMacro && editingMacro.id === macro.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      className="input text-xs w-24 py-1 px-2"
                      value={editingMacro.name}
                      onChange={e => setEditingMacro(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Name"
                      onKeyDown={e => e.key === 'Enter' && handleSaveEditMacro()}
                    />
                    <input
                      className="input text-xs w-24 py-1 px-2"
                      value={editingMacro.expr}
                      onChange={e => setEditingMacro(prev => ({ ...prev, expr: e.target.value }))}
                      placeholder="e.g. 2d6+4"
                      onKeyDown={e => e.key === 'Enter' && handleSaveEditMacro()}
                    />
                    <button onClick={handleSaveEditMacro} className="text-emerald-400 hover:text-emerald-300" title="Save changes">
                      <Check size={14} />
                    </button>
                    <button onClick={() => setEditingMacro(null)} className="text-amber-200/30 hover:text-amber-200/60" title="Cancel">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleRunMacro(macro)}
                      className="flex items-center gap-2 text-sm"
                      title={`Roll ${macro.expr}`}
                    >
                      <Play size={10} className="text-gold/50" />
                      <span className="text-amber-100 font-medium">{macro.name}</span>
                      <span className="text-amber-200/30 text-xs">{macro.expr}</span>
                    </button>
                    <button
                      onClick={() => handleEditMacro(macro)}
                      className="text-amber-200/20 hover:text-amber-200/60 transition-colors ml-1 opacity-0 group-hover:opacity-100"
                      title="Edit macro"
                      aria-label={`Edit macro ${macro.name}`}
                    >
                      <Pencil size={11} />
                    </button>
                    <button
                      onClick={() => handleDeleteMacro(macro.id)}
                      className="text-amber-200/20 hover:text-red-400 transition-colors ml-0.5 opacity-0 group-hover:opacity-100"
                      title="Delete macro"
                      aria-label={`Delete macro ${macro.name}`}
                    >
                      <X size={12} />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
        {macros.length > 0 && (
          <div className="text-xs text-amber-200/20 mt-2">{macros.length}/{MAX_MACROS} macros</div>
        )}
      </div>

      {/* Stat Rolling Mode */}
      <div className="card">
        <h3 className="font-display text-amber-100 mb-3">Ability Score Generation</h3>
        <p className="text-xs text-amber-200/30 mb-3">Roll for stats, use the Standard Array, or calculate via Point Buy.</p>
        <div className="flex gap-2 mb-4">
          {[
            { mode: 'roll', label: '4d6 Drop Lowest' },
            { mode: 'standard', label: 'Standard Array' },
            { mode: 'pointbuy', label: 'Point Buy' },
          ].map(({ mode, label }) => (
            <button
              key={mode}
              onClick={() => { setStatMode(mode); if (mode !== 'roll') setShowStatBlock(true); }}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                statMode === mode
                  ? 'bg-purple-800/50 text-purple-200 border border-purple-500/40'
                  : 'bg-[#0d0d12] text-amber-200/40 border border-amber-200/10 hover:text-amber-200/60'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {statMode === 'roll' && (
          <button onClick={handleRollStats}
            className="px-4 py-2 rounded-lg bg-[#0d0d12] border-2 border-purple-500/30 hover:border-purple-400/60 transition-all text-sm font-display text-purple-300 hover:text-purple-200 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]"
          >
            Roll 4d6kh3 x6
          </button>
        )}

        {statMode === 'standard' && showStatBlock && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {STANDARD_ARRAY.map((score, i) => (
              <div key={i} className="bg-[#0d0d12] rounded-lg border border-purple-500/20 p-3 text-center">
                <div className="text-xs text-purple-300/60 mb-1">{ABILITY_NAMES[i]}</div>
                <div className="text-3xl font-display text-amber-100">{score}</div>
              </div>
            ))}
            <div className="col-span-full text-center text-xs text-amber-200/30 mt-1">
              Assign these scores to your abilities as you choose. Total: {STANDARD_ARRAY.reduce((a, b) => a + b, 0)}
            </div>
          </div>
        )}

        {statMode === 'pointbuy' && showStatBlock && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-amber-200/60">
                Points spent: <span className={`font-bold ${pointBuySpent > POINT_BUY_TOTAL ? 'text-red-400' : pointBuySpent === POINT_BUY_TOTAL ? 'text-emerald-400' : 'text-amber-100'}`}>{pointBuySpent}</span>
                <span className="text-amber-200/30">/{POINT_BUY_TOTAL}</span>
              </span>
              <button onClick={() => setPointBuyScores([8, 8, 8, 8, 8, 8])} className="text-xs text-amber-200/30 hover:text-amber-200/60 flex items-center gap-1">
                <RotateCcw size={10} /> Reset
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ABILITY_NAMES.map((name, i) => (
                <div key={name} className="bg-[#0d0d12] rounded-lg border border-purple-500/20 p-3 text-center">
                  <div className="text-xs text-purple-300/60 mb-1">{name}</div>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePointBuyChange(i, -1)}
                      disabled={pointBuyScores[i] <= 8}
                      className="w-6 h-6 rounded bg-[#1a1a24] border border-amber-200/10 text-amber-200/50 hover:text-amber-100 disabled:opacity-20 disabled:cursor-not-allowed text-sm font-bold"
                    >-</button>
                    <span className="text-2xl font-display text-amber-100 w-8 text-center">{pointBuyScores[i]}</span>
                    <button
                      onClick={() => handlePointBuyChange(i, 1)}
                      disabled={pointBuyScores[i] >= 15}
                      className="w-6 h-6 rounded bg-[#1a1a24] border border-amber-200/10 text-amber-200/50 hover:text-amber-100 disabled:opacity-20 disabled:cursor-not-allowed text-sm font-bold"
                    >+</button>
                  </div>
                  <div className="text-[10px] text-amber-200/25 mt-1">Cost: {POINT_BUY_COSTS[pointBuyScores[i]]}</div>
                </div>
              ))}
            </div>
            <div className="text-center text-xs text-amber-200/30 mt-3">
              Modifier: {pointBuyScores.map(s => { const mod = Math.floor((s - 10) / 2); return mod >= 0 ? `+${mod}` : `${mod}`; }).join(' / ')}
            </div>
          </div>
        )}
      </div>

      {/* Stat Block Result (from 4d6kh3 rolls) */}
      <AnimatePresence>
        {showStatBlock && statBlockResult && statMode === 'roll' && (
          <motion.div
            className="card"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-purple-200">Ability Score Rolls <span className="text-xs text-amber-200/30 font-normal">(4d6 drop lowest)</span></h3>
              <button onClick={() => setShowStatBlock(false)} className="text-xs text-amber-200/30 hover:text-amber-200/60 transition-colors">Hide</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {statBlockResult.map((stat, i) => (
                <div key={i} className="bg-[#0d0d12] rounded-lg border border-purple-500/20 p-3 text-center">
                  <div className="text-3xl font-display text-amber-100 mb-1">{stat.total}</div>
                  <div className="flex items-center justify-center gap-1.5 text-sm">
                    {stat.dice.map((val, j) => (
                      <span
                        key={j}
                        className={j === stat.droppedIdx
                          ? 'text-red-400/40 line-through text-xs'
                          : 'text-amber-200/60'}
                      >
                        {val}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-center text-sm text-amber-200/40">
              Total: <span className="text-amber-100 font-bold">{statBlockResult.reduce((s, r) => s + r.total, 0)}</span>
              <span className="ml-3">Avg: <span className="text-amber-100">{(statBlockResult.reduce((s, r) => s + r.total, 0) / 6).toFixed(1)}</span></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Expression */}
      <div className="card">
        <h3 className="font-display text-amber-100 mb-2">Custom Roll</h3>
        <p className="text-xs text-amber-200/30 mb-3">Supports: 2d6+1d8+5, 4d6kh3 (keep highest), 2d20kl1 (keep lowest), flat modifiers (+5, -2)</p>
        <div className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="e.g. 2d6+1d8+5, 4d6kh3, 2d20kl1-2"
            value={customExpr}
            onChange={e => setCustomExpr(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCustomRoll()}
          />
          <button onClick={handleCustomRoll} className="btn-primary">Roll</button>
        </div>
      </div>

      {/* Last Roll Result */}
      <AnimatePresence mode="wait">
        {lastRoll && (
          <motion.div
            key={lastRoll.id}
            aria-live="polite"
            aria-label={`Roll result: ${lastRoll.expr} = ${lastRoll.total}${lastRoll.isNat20 ? ', Natural 20!' : ''}${lastRoll.isNat1 ? ', Natural 1' : ''}`}
            className={`card text-center overflow-hidden ${lastRoll.isNat20 ? 'border-gold shadow-[0_0_40px_rgba(201,168,76,0.4)]' : lastRoll.isNat1 ? 'border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)]' : ''}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={lastRoll.isNat20 || lastRoll.isNat1 ? {
              scale: 1, opacity: 1,
              x: [0, -3, 3, -2, 2, 0],
            } : { scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={lastRoll.isNat20 || lastRoll.isNat1 ? {
              type: 'spring', damping: 15,
              x: { duration: 0.4, delay: 0.1 },
            } : { type: 'spring', damping: 15 }}
          >
            {lastRoll.isNat20 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 8, delay: 0.15 }}
              >
                <div className="text-5xl font-display font-bold mb-1" style={{
                  color: '#ffd700',
                  textShadow: '0 0 20px rgba(255,215,0,0.6), 0 0 40px rgba(255,215,0,0.3), 0 0 60px rgba(255,215,0,0.15)',
                  animation: 'crit-glow 1.2s ease-in-out infinite',
                }}>
                  CRITICAL HIT!
                </div>
                <div className="text-sm text-gold/60 mb-2">Natural 20</div>
              </motion.div>
            )}
            {lastRoll.isNat1 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 8, delay: 0.15 }}
              >
                <div className="text-5xl font-display font-bold mb-1" style={{
                  color: '#ef4444',
                  textShadow: '0 0 20px rgba(239,68,68,0.6), 0 0 40px rgba(239,68,68,0.3), 0 0 60px rgba(239,68,68,0.15)',
                  animation: 'crit-miss-glow 1.2s ease-in-out infinite',
                }}>
                  CRITICAL MISS!
                </div>
                <div className="text-sm text-red-400/60 mb-2">Natural 1</div>
              </motion.div>
            )}
            {lastRoll.label && <div className="text-xs text-gold/60 mb-1">{lastRoll.label}</div>}
            <div className="text-sm text-amber-200/50 mb-2">{lastRoll.expr}</div>
            <motion.div
              className={`text-6xl font-display ${lastRoll.isNat20 ? 'text-gold' : lastRoll.isNat1 ? 'text-red-400' : 'text-amber-100'}`}
              initial={{ rotateX: 90 }}
              animate={{ rotateX: 0 }}
            >
              {rolling ? '...' : lastRoll.total}
            </motion.div>
            {/* Advantage/disadvantage detail */}
            {lastRoll.advInfo && (
              <div className="text-sm text-amber-200/40 mt-2">
                Rolled: <span className={lastRoll.advInfo.chosen === lastRoll.advInfo.roll1 ? 'text-amber-100 font-bold' : 'line-through opacity-50'}>{lastRoll.advInfo.roll1}</span>
                {' & '}
                <span className={lastRoll.advInfo.chosen === lastRoll.advInfo.roll2 ? 'text-amber-100 font-bold' : 'line-through opacity-50'}>{lastRoll.advInfo.roll2}</span>
                {lastRoll.modifier !== 0 && ` ${lastRoll.modifier > 0 ? '+' : ''}${lastRoll.modifier}`}
              </div>
            )}
            {/* Individual dice breakdown for complex rolls */}
            {!lastRoll.advInfo && lastRoll.groups && lastRoll.groups.length > 0 && (
              <div className="text-sm text-amber-200/40 mt-2 space-y-0.5">
                {lastRoll.groups.map((g, gi) => (
                  <div key={gi}>
                    <span className="text-amber-200/30">{g.sign < 0 ? '- ' : gi > 0 ? '+ ' : ''}{g.expr}: </span>
                    <span>[{g.rolls.map((v, vi) => {
                      const isDrop = g.dropped && g.dropped.length > 0 && g.dropped.find(d => d.i === vi)?.drop;
                      return (
                        <span key={vi} className={isDrop ? 'text-red-400/40 line-through' : 'text-amber-200/70'}>
                          {vi > 0 ? ', ' : ''}{v}
                        </span>
                      );
                    })}]</span>
                    {g.dropped && g.dropped.some(d => d.drop) && (
                      <span className="text-amber-200/25 text-xs ml-1">
                        (kept {g.kept.length})
                      </span>
                    )}
                    <span className="text-amber-200/50 ml-1">= {g.subtotal}</span>
                  </div>
                ))}
                {lastRoll.modifier !== 0 && (
                  <div className="text-amber-200/30">{lastRoll.modifier > 0 ? '+' : ''}{lastRoll.modifier}</div>
                )}
              </div>
            )}
            {/* Simple multi-die display (no groups, legacy) */}
            {!lastRoll.advInfo && (!lastRoll.groups || lastRoll.groups.length === 0) && lastRoll.rolls && lastRoll.rolls.length > 1 && (
              <div className="text-sm text-amber-200/40 mt-2">
                [{lastRoll.rolls.join(', ')}]
                {lastRoll.modifier !== 0 && ` ${lastRoll.modifier > 0 ? '+' : ''}${lastRoll.modifier}`}
              </div>
            )}
            {/* Copy + Save buttons */}
            <div className="flex items-center justify-center gap-3 mt-3">
              <button onClick={() => handleCopyRoll(lastRoll)} className="text-xs text-amber-200/30 hover:text-amber-200/60 transition-colors flex items-center gap-1">
                <ClipboardCopy size={11} /> Copy
              </button>
              <button onClick={handleSaveMacro} className="text-xs text-amber-200/30 hover:text-amber-200/60 transition-colors flex items-center gap-1">
                <Save size={11} /> Save as Macro
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Roll History */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-amber-100">
            Roll History
            {history.length > 0 && <span className="text-amber-200/30 text-sm font-normal ml-2">({history.length} {history.length === 1 ? 'roll' : 'rolls'})</span>}
          </h3>
          {history.length > 0 && (
            <div className="flex items-center gap-3">
              <button onClick={handleCopyHistory} className="text-xs text-amber-200/30 hover:text-amber-200/60 transition-colors flex items-center gap-1" title="Copy roll history to clipboard">
                <Copy size={12} /> Copy All
              </button>
              <button onClick={handleClearHistory} className="text-xs text-amber-200/30 hover:text-red-400/60 transition-colors flex items-center gap-1">
                <Trash2 size={12} /> Clear
              </button>
            </div>
          )}
        </div>
        {history.length === 0 ? (
          <p className="text-sm text-amber-200/30">No rolls yet. Click a die above or type a custom expression to get started!</p>
        ) : (
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {history.map(entry => {
              const ts = entry.timestamp || parseInt(entry.id);
              return (
                <div key={entry.id} className={`group flex items-center justify-between py-1.5 px-2 rounded text-sm ${
                  entry.isNat20 ? 'bg-gold/10 text-gold' : entry.isNat1 ? 'bg-red-900/20 text-red-300' : 'text-amber-200/60'
                } hover:bg-amber-200/5`}>
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] text-amber-200/20 flex-shrink-0 flex items-center gap-0.5" title={new Date(ts).toLocaleString()}>
                      <Clock size={9} className="opacity-50" />
                      {formatTimeAgo(ts)}
                    </span>
                    {entry.label && <span className="text-xs text-gold/50 truncate max-w-[120px]">{entry.label}</span>}
                    <span className="truncate">{entry.expr}</span>
                  </span>
                  <span className="flex items-center gap-2 flex-shrink-0">
                    {entry.advInfo && <span className="text-xs text-amber-200/30">{entry.advInfo.roll1},{entry.advInfo.roll2}</span>}
                    {!entry.advInfo && entry.rolls && entry.rolls.length > 1 && entry.rolls.length <= 8 && (
                      <span className="text-xs text-amber-200/30">[{entry.rolls.join(',')}]</span>
                    )}
                    <span className="font-bold">{entry.total}</span>
                    {entry.isNat20 && <span className="text-[10px] font-bold">NAT20</span>}
                    {entry.isNat1 && <span className="text-[10px] font-bold">NAT1</span>}
                    <button
                      onClick={() => handleCopyRoll(entry)}
                      className="opacity-0 group-hover:opacity-100 text-amber-200/20 hover:text-amber-200/60 transition-all"
                      title="Copy this roll"
                    >
                      <ClipboardCopy size={11} />
                    </button>
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Roll Statistics Panel */}
      {rollStats && rollStats.totalRolls > 0 && (
        <div className="card">
          <button
            onClick={() => setShowStats(s => !s)}
            className="w-full flex items-center justify-between"
          >
            <h3 className="font-display text-amber-100 flex items-center gap-2">
              <BarChart3 size={16} className="text-gold/60" />
              Roll Statistics
            </h3>
            {showStats ? <ChevronUp size={16} className="text-amber-200/40" /> : <ChevronDown size={16} className="text-amber-200/40" />}
          </button>
          <AnimatePresence>
            {showStats && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                {/* Summary stats */}
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="bg-[#0d0d12] rounded-lg border border-amber-200/5 p-3 text-center">
                    <div className="text-2xl font-display text-amber-100">{rollStats.totalRolls}</div>
                    <div className="text-[10px] text-amber-200/30">Total Rolls</div>
                  </div>
                  <div className="bg-[#0d0d12] rounded-lg border border-amber-200/5 p-3 text-center">
                    <div className="text-2xl font-display text-amber-100">{rollStats.average}</div>
                    <div className="text-[10px] text-amber-200/30">Average Roll</div>
                  </div>
                  <div className="bg-[#0d0d12] rounded-lg border border-gold/15 p-3 text-center">
                    <div className="text-2xl font-display text-gold">{rollStats.nat20Count}</div>
                    <div className="text-[10px] text-gold/40">Nat 20s</div>
                  </div>
                  <div className="bg-[#0d0d12] rounded-lg border border-red-500/15 p-3 text-center">
                    <div className="text-2xl font-display text-red-400">{rollStats.nat1Count}</div>
                    <div className="text-[10px] text-red-400/40">Nat 1s</div>
                  </div>
                </div>

                {/* Highest / Lowest */}
                {rollStats.highestRoll !== null && (
                  <div className="flex gap-3 mb-4">
                    <div className="flex-1 bg-[#0d0d12] rounded-lg border border-emerald-500/10 p-2 px-3 flex items-center justify-between">
                      <span className="text-xs text-amber-200/30">Highest</span>
                      <span className="text-sm">
                        <span className="text-emerald-300 font-bold">{rollStats.highestRoll}</span>
                        <span className="text-amber-200/20 ml-1.5 text-xs">{rollStats.highestExpr}</span>
                      </span>
                    </div>
                    <div className="flex-1 bg-[#0d0d12] rounded-lg border border-red-500/10 p-2 px-3 flex items-center justify-between">
                      <span className="text-xs text-amber-200/30">Lowest</span>
                      <span className="text-sm">
                        <span className="text-red-300 font-bold">{rollStats.lowestRoll}</span>
                        <span className="text-amber-200/20 ml-1.5 text-xs">{rollStats.lowestExpr}</span>
                      </span>
                    </div>
                  </div>
                )}

                {/* Per-die-type breakdown */}
                {Object.keys(rollStats.perDie).length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs text-amber-200/25 mb-1">Per-Die Breakdown (3+ rolls)</div>
                    {Object.entries(rollStats.perDie).sort((a, b) => {
                      const order = ['d4','d6','d8','d10','d12','d20','d100'];
                      return order.indexOf(a[0]) - order.indexOf(b[0]);
                    }).map(([dieType, data]) => (
                      <div key={dieType} className="flex items-center gap-4 py-2 px-3 rounded bg-[#0d0d12] border border-amber-200/5 text-sm">
                        <span className="font-display text-gold w-10">{dieType}</span>
                        <span className="text-amber-200/50">{data.count} rolls</span>
                        <span className="text-amber-200/50">Avg: <span className="text-amber-100">{data.average}</span></span>
                        <span className="text-amber-200/50">Hi: <span className="text-emerald-300">{data.highest}</span></span>
                        <span className="text-amber-200/50">Lo: <span className="text-red-300">{data.lowest}</span></span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
