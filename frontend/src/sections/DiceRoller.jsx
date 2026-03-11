import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Dice5, Copy, ChevronDown, ChevronUp, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import HelpTooltip from '../components/HelpTooltip';
import { HELP } from '../data/helpText';
import { computeConditionEffects } from '../data/conditionEffects';

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

function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function parseRoll(expr) {
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

export default function DiceRoller({ activeConditions = [], diceHistory, onDiceHistoryChange }) {
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
  const [showStats, setShowStats] = useState(false);
  const condEffects = computeConditionEffects(activeConditions);

  // #208 — Compute roll statistics per die type
  const rollStats = useMemo(() => {
    const byType = {};
    for (const entry of history) {
      // Only count single-die quick rolls (e.g. 1d20, 1d6) for meaningful stats
      const match = entry.expr.match(/^1?d(\d+)/i);
      if (!match) continue;
      const dieType = `d${match[1]}`;
      if (!byType[dieType]) byType[dieType] = { rolls: [], total: 0 };
      const val = entry.rolls[0];
      if (val == null) continue;
      byType[dieType].rolls.push(val);
      byType[dieType].total += val;
    }
    const stats = {};
    for (const [dieType, data] of Object.entries(byType)) {
      if (data.rolls.length >= 5) {
        stats[dieType] = {
          count: data.rolls.length,
          average: (data.total / data.rolls.length).toFixed(1),
          highest: Math.max(...data.rolls),
          lowest: Math.min(...data.rolls),
        };
      }
    }
    return stats;
  }, [history]);

  // Auto-set roll mode based on active conditions
  useEffect(() => {
    if (condEffects.netAttackMode !== 'normal') {
      setRollMode(condEffects.netAttackMode);
    }
  }, [condEffects.netAttackMode]);

  const doRoll = useCallback((count, sides, modifier = 0, autoLabel = '') => {
    setRolling(true);
    setTimeout(() => {
      let rolls, total, isNat20, isNat1, advInfo = null;

      if (sides === 20 && count === 1 && rollMode !== 'normal') {
        const roll1 = rollDie(20);
        const roll2 = rollDie(20);
        const chosen = rollMode === 'advantage' ? Math.max(roll1, roll2) : Math.min(roll1, roll2);
        rolls = [chosen];
        total = chosen + modifier;
        isNat20 = chosen === 20;
        isNat1 = chosen === 1;
        advInfo = { roll1, roll2, mode: rollMode, chosen };
      } else {
        rolls = Array.from({ length: count }, () => rollDie(sides));
        total = rolls.reduce((s, r) => s + r, 0) + modifier;
        isNat20 = sides === 20 && count === 1 && rolls[0] === 20;
        isNat1 = sides === 20 && count === 1 && rolls[0] === 1;
      }

      const modeTag = advInfo ? (advInfo.mode === 'advantage' ? ' (ADV)' : ' (DIS)') : '';
      const label = rollLabel || autoLabel;
      const entry = {
        id: Date.now() + '-' + Math.random().toString(36).slice(2, 8),
        expr: `${count}d${sides}${modifier > 0 ? `+${modifier}` : modifier < 0 ? modifier : ''}${modeTag}`,
        label,
        rolls,
        modifier,
        total,
        isNat20,
        isNat1,
        advInfo,
      };

      setLastRoll(entry);
      setHistory(prev => [entry, ...prev].slice(0, 200));
      setRolling(false);
      if (rollLabel) setRollLabel('');
    }, 300);
  }, [rollMode, rollLabel, setHistory]);

  const handleQuickRoll = (sides) => doRoll(1, sides, 0, `d${sides}`);

  const handleCustomRoll = () => {
    const parsed = parseRoll(customExpr.trim());
    if (parsed) {
      doRoll(parsed.count, parsed.sides, parsed.modifier, customExpr.trim());
      setCustomExpr('');
    } else if (customExpr.trim()) {
      toast.error('Invalid roll — try "3d6+5" or "1d20"');
    }
  };

  const handleRollStats = () => {
    const result = rollStatBlock();
    setStatBlockResult(result);
    setShowStatBlock(true);
    // Also add to history
    const grandTotal = result.reduce((s, r) => s + r.total, 0);
    const entry = {
      id: Date.now() + '-' + Math.random().toString(36).slice(2, 8),
      expr: '4d6kh3 x6',
      label: 'Stat Block Roll',
      rolls: result.map(r => r.total),
      modifier: 0,
      total: grandTotal,
      isNat20: false,
      isNat1: false,
      advInfo: null,
    };
    setHistory(prev => [entry, ...prev].slice(0, 200));
  };

  const handleCopyHistory = async () => {
    if (history.length === 0) {
      toast.error('No rolls to copy');
      return;
    }
    const lines = history.slice().reverse().map(entry => {
      const time = new Date(parseInt(entry.id)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

  return (
    <div className="space-y-6 max-w-none">
      <h2 className="text-2xl font-display text-amber-100 flex items-center gap-2">
        <Dice5 size={20} />
        <div>
          <span>Dice Roller<HelpTooltip text={HELP.diceBasics} /></span>
          <p className="text-xs text-amber-200/40 font-normal mt-0.5">Roll any combination of dice right here. Use the quick buttons for single rolls or type a custom expression like "2d6+3".</p>
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
          <button onClick={handleRollStats}
            className="w-16 h-16 rounded-lg bg-[#0d0d12] border-2 border-purple-500/30 hover:border-purple-400/60 transition-all flex flex-col items-center justify-center group hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]"
            aria-label="Roll ability scores (4d6 drop lowest x6)"
            title="Roll 4d6-drop-lowest six times for ability scores"
          >
            <span className="text-xs font-display text-purple-300 group-hover:text-purple-200 transition-colors">Stats</span>
            <span className="text-[9px] text-purple-300/40 group-hover:text-purple-300/60">4d6kh3</span>
          </button>
        </div>
      </div>

      {/* #202 — Stat Block Result */}
      <AnimatePresence>
        {showStatBlock && statBlockResult && (
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
        <h3 className="font-display text-amber-100 mb-3">Custom Roll</h3>
        <div className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="e.g. 2d6+3, 4d8, 1d20+5"
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
            className={`card text-center ${lastRoll.isNat20 ? 'border-gold shadow-[0_0_30px_rgba(201,168,76,0.3)]' : lastRoll.isNat1 ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : ''}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            {lastRoll.isNat20 && (
              <div className="text-4xl mb-2" style={{ animation: 'glow-pulse 1s ease-in-out infinite' }}>
                NAT 20!
              </div>
            )}
            {lastRoll.isNat1 && (
              <div className="text-4xl mb-2 text-red-400" style={{ animation: 'glow-pulse 1s ease-in-out infinite' }}>
                NAT 1
              </div>
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
            {lastRoll.advInfo && (
              <div className="text-sm text-amber-200/40 mt-2">
                Rolled: <span className={lastRoll.advInfo.chosen === lastRoll.advInfo.roll1 ? 'text-amber-100 font-bold' : 'line-through opacity-50'}>{lastRoll.advInfo.roll1}</span>
                {' & '}
                <span className={lastRoll.advInfo.chosen === lastRoll.advInfo.roll2 ? 'text-amber-100 font-bold' : 'line-through opacity-50'}>{lastRoll.advInfo.roll2}</span>
                {lastRoll.modifier !== 0 && ` ${lastRoll.modifier > 0 ? '+' : ''}${lastRoll.modifier}`}
              </div>
            )}
            {!lastRoll.advInfo && lastRoll.rolls.length > 1 && (
              <div className="text-sm text-amber-200/40 mt-2">
                [{lastRoll.rolls.join(', ')}]
                {lastRoll.modifier !== 0 && ` ${lastRoll.modifier > 0 ? '+' : ''}${lastRoll.modifier}`}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Roll History */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-amber-100">Roll History{history.length > 0 && <span className="text-amber-200/30 text-sm font-normal ml-2">({history.length} {history.length === 1 ? 'roll' : 'rolls'})</span>}</h3>
          {history.length > 0 && (
            <div className="flex items-center gap-3">
              <button onClick={handleCopyHistory} className="text-xs text-amber-200/30 hover:text-amber-200/60 transition-colors flex items-center gap-1" title="Copy roll history to clipboard">
                <Copy size={12} /> Copy
              </button>
              <button onClick={() => setHistory([])} className="text-xs text-amber-200/30 hover:text-amber-200/60 transition-colors">
                Clear
              </button>
            </div>
          )}
        </div>
        {history.length === 0 ? (
          <p className="text-sm text-amber-200/30">No rolls yet. Click a die above or type a custom expression to get started!</p>
        ) : (
          <div className="space-y-1 max-h-[300px] overflow-y-auto">
            {history.map(entry => (
              <div key={entry.id} className={`flex items-center justify-between py-1.5 px-2 rounded text-sm ${
                entry.isNat20 ? 'bg-gold/10 text-gold' : entry.isNat1 ? 'bg-red-900/20 text-red-300' : 'text-amber-200/60'
              }`}>
                <span className="flex items-center gap-2 min-w-0">
                  {entry.label && <span className="text-xs text-gold/50 truncate max-w-[120px]">{entry.label}</span>}
                  <span>{entry.expr}</span>
                </span>
                <span className="flex items-center gap-2 flex-shrink-0">
                  {entry.advInfo && <span className="text-xs text-amber-200/30">{entry.advInfo.roll1},{entry.advInfo.roll2}</span>}
                  {!entry.advInfo && entry.rolls.length > 1 && <span className="text-xs text-amber-200/30">[{entry.rolls.join(',')}]</span>}
                  <span className="font-bold">{entry.total}</span>
                  {entry.isNat20 && <span>NAT20</span>}
                  {entry.isNat1 && <span>NAT1</span>}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* #208 — Roll Statistics Panel */}
      {Object.keys(rollStats).length > 0 && (
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
                <div className="mt-3 space-y-2">
                  {Object.entries(rollStats).sort((a, b) => {
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
