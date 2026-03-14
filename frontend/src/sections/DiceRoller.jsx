import { useState, useCallback, useEffect, useRef } from 'react';
import { Dice5, Save, X, Play, Pencil, Check, ClipboardCopy, Radio, ChevronDown, ChevronUp, Search, Trash2 } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { invoke } from '@tauri-apps/api/core';
import HelpTooltip from '../components/HelpTooltip';
import { HELP } from '../data/helpText';
import { computeConditionEffects } from '../data/conditionEffects';
import { rollDie, parseAndRollExpression, validateExpression } from '../utils/dice';

/* ── Storage keys ── */
const getMacrosKey = (charId) => charId ? `codex_dice_macros_${charId}` : 'codex_dice_macros';
const getHistoryKey = (charId) => charId ? `codex_roll_history_${charId}` : 'codex_roll_history';
const MAX_MACROS = 30;
const MAX_HISTORY = 100;

/* ── localStorage helpers ── */
function loadFromStorage(key, fallback = []) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; }
  catch { return fallback; }
}
function saveToStorage(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* ignore */ }
}

/* ── Relative time formatter ── */
function formatRelativeTime(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 5) return 'just now';
  if (diff < 60) return `${diff}s ago`;
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
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

/* ── Dice face SVG components ── */
const D6_DOTS = {
  1: [[50,50]],
  2: [[25,25],[75,75]],
  3: [[25,25],[50,50],[75,75]],
  4: [[25,25],[75,25],[25,75],[75,75]],
  5: [[25,25],[75,25],[50,50],[25,75],[75,75]],
  6: [[25,25],[75,25],[25,50],[75,50],[25,75],[75,75]],
};

function D6Face({ value, size = 40 }) {
  const dots = D6_DOTS[value] || [];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
      <rect x="2" y="2" width="96" height="96" rx="14" fill="none" stroke="rgba(201,168,76,0.4)" strokeWidth="3" />
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="9" fill="rgba(201,168,76,0.85)" />
      ))}
    </svg>
  );
}

function DieFace({ sides, value, size = 48 }) {
  if (sides === 6 && value >= 1 && value <= 6) {
    return <D6Face value={value} size={size} />;
  }
  // For other dice, show a polygon shape with the number
  const shapes = {
    4:   'M50,8 L92,88 L8,88 Z',
    8:   'M50,5 L95,50 L50,95 L5,50 Z',
    10:  'M50,2 L90,35 L80,90 L20,90 L10,35 Z',
    12:  'M50,3 L85,22 L95,60 L72,92 L28,92 L5,60 L15,22 Z',
    20:  'M50,2 L88,18 L98,58 L75,92 L25,92 L2,58 L12,18 Z',
    100: 'M50,2 L90,18 L98,55 L80,88 L20,88 L2,55 L10,18 Z',
  };
  const path = shapes[sides] || shapes[20];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
      <path d={path} fill="none" stroke="rgba(201,168,76,0.4)" strokeWidth="2.5" />
      <text x="50" y="56" textAnchor="middle" dominantBaseline="middle"
        fill="rgba(201,168,76,0.9)" fontSize={value >= 100 ? '22' : value >= 10 ? '28' : '34'}
        fontWeight="700" fontFamily="var(--font-display, 'Cinzel', serif)">
        {value}
      </text>
    </svg>
  );
}

/* ── Particle effect CSS (injected once) ── */
const PARTICLE_STYLE_ID = 'codex-dice-particles';
function ensureParticleStyles() {
  if (document.getElementById(PARTICLE_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = PARTICLE_STYLE_ID;
  style.textContent = `
    @keyframes crit-glow {
      0%, 100% { text-shadow: 0 0 20px rgba(255,215,0,0.6), 0 0 40px rgba(255,215,0,0.3); }
      50% { text-shadow: 0 0 30px rgba(255,215,0,0.9), 0 0 60px rgba(255,215,0,0.5), 0 0 80px rgba(255,215,0,0.2); }
    }
    @keyframes crit-miss-glow {
      0%, 100% { text-shadow: 0 0 20px rgba(239,68,68,0.6), 0 0 40px rgba(239,68,68,0.3); }
      50% { text-shadow: 0 0 30px rgba(239,68,68,0.9), 0 0 60px rgba(239,68,68,0.5), 0 0 80px rgba(239,68,68,0.2); }
    }
    @keyframes dice-spin {
      0% { transform: rotateY(0deg) rotateX(0deg) scale(1); }
      25% { transform: rotateY(180deg) rotateX(90deg) scale(1.1); }
      50% { transform: rotateY(360deg) rotateX(180deg) scale(1); }
      75% { transform: rotateY(540deg) rotateX(270deg) scale(1.1); }
      100% { transform: rotateY(720deg) rotateX(360deg) scale(1); }
    }
    @keyframes dice-tumble {
      0% { transform: rotate(0deg) scale(1); }
      20% { transform: rotate(72deg) scale(1.05); }
      40% { transform: rotate(144deg) scale(0.95); }
      60% { transform: rotate(216deg) scale(1.05); }
      80% { transform: rotate(288deg) scale(0.95); }
      100% { transform: rotate(360deg) scale(1); }
    }
    @keyframes sparkle-burst {
      0% { transform: translate(0,0) scale(1); opacity: 1; }
      100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
    }
    @keyframes shatter-piece {
      0% { transform: translate(0,0) rotate(0deg) scale(1); opacity: 1; }
      100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(0.3); opacity: 0; }
    }
    @keyframes crack-flash {
      0% { opacity: 0.8; }
      50% { opacity: 1; }
      100% { opacity: 0; }
    }
    .dice-rolling {
      animation: dice-tumble 0.6s ease-in-out;
    }
    .sparkle-particle {
      position: absolute;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      pointer-events: none;
      animation: sparkle-burst 0.8s ease-out forwards;
    }
    .shatter-particle {
      position: absolute;
      pointer-events: none;
      animation: shatter-piece 0.7s ease-out forwards;
    }
  `;
  document.head.appendChild(style);
}

/* ── Sparkle / Shatter particle generators ── */
function CritParticles({ type }) {
  const particles = useRef(
    Array.from({ length: type === 'nat20' ? 18 : 12 }, (_, i) => {
      const angle = (i / (type === 'nat20' ? 18 : 12)) * 360 + (Math.random() * 30 - 15);
      const dist = 40 + Math.random() * 60;
      const rad = (angle * Math.PI) / 180;
      return {
        key: i,
        tx: Math.cos(rad) * dist,
        ty: Math.sin(rad) * dist,
        rot: Math.random() * 360,
        size: type === 'nat20' ? 4 + Math.random() * 5 : 3 + Math.random() * 4,
        delay: Math.random() * 0.15,
        color: type === 'nat20'
          ? `hsl(${40 + Math.random() * 20}, 100%, ${60 + Math.random() * 30}%)`
          : `hsl(${0 + Math.random() * 10}, ${80 + Math.random() * 20}%, ${45 + Math.random() * 20}%)`,
      };
    })
  ).current;

  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', pointerEvents: 'none', zIndex: 10 }}>
      {particles.map(p => (
        <div
          key={p.key}
          className={type === 'nat20' ? 'sparkle-particle' : 'shatter-particle'}
          style={{
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
            '--rot': `${p.rot}deg`,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: type === 'nat20' ? '50%' : '2px',
            animationDelay: `${p.delay}s`,
            boxShadow: type === 'nat20' ? `0 0 6px ${p.color}` : 'none',
          }}
        />
      ))}
    </div>
  );
}

/* ── Rolling animation overlay ── */
function RollingOverlay({ sides }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px 0',
      }}
    >
      <div className="dice-rolling" style={{ perspective: '200px' }}>
        <svg width="64" height="64" viewBox="0 0 100 100">
          {sides === 6 ? (
            <rect x="10" y="10" width="80" height="80" rx="14" fill="none" stroke="rgba(201,168,76,0.6)" strokeWidth="3" />
          ) : sides === 4 ? (
            <path d="M50,8 L92,88 L8,88 Z" fill="none" stroke="rgba(201,168,76,0.6)" strokeWidth="3" />
          ) : sides === 8 ? (
            <path d="M50,5 L95,50 L50,95 L5,50 Z" fill="none" stroke="rgba(201,168,76,0.6)" strokeWidth="3" />
          ) : (
            <path d="M50,2 L88,18 L98,58 L75,92 L25,92 L2,58 L12,18 Z" fill="none" stroke="rgba(201,168,76,0.6)" strokeWidth="3" />
          )}
          <text x="50" y="55" textAnchor="middle" dominantBaseline="middle"
            fill="rgba(201,168,76,0.7)" fontSize="22" fontWeight="700"
            fontFamily="var(--font-display, 'Cinzel', serif)">
            ?
          </text>
        </svg>
      </div>
    </motion.div>
  );
}

/* ── Core dice functions imported from utils/dice.js ── */


export default function DiceRoller({ characterId, activeConditions = [], sessionActive = false, playerUuid = '' }) {
  const [customExpr, setCustomExpr] = useState('');
  const [rollLabel, setRollLabel] = useState('');
  const [lastRoll, setLastRoll] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [rollingSides, setRollingSides] = useState(20);
  const [rollMode, setRollMode] = useState('normal');
  const [broadcastOn, setBroadcastOn] = useState(false);
  const [macros, setMacros] = useState([]);
  const [editingMacro, setEditingMacro] = useState(null); // { id, name, expr }
  const [rollHistory, setRollHistory] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('');
  const condEffects = computeConditionEffects(activeConditions);

  useEffect(() => { ensureParticleStyles(); }, []);

  // Load macros from per-character localStorage
  useEffect(() => {
    setMacros(loadFromStorage(getMacrosKey(characterId)));
  }, [characterId]);

  // Load roll history from per-character localStorage
  useEffect(() => {
    setRollHistory(loadFromStorage(getHistoryKey(characterId)));
  }, [characterId]);

  const pushToHistory = useCallback((entry) => {
    setRollHistory(prev => {
      const historyEntry = {
        id: Date.now(),
        expression: entry.expr,
        result: entry.total,
        rolls: entry.rolls || [],
        label: entry.label || '',
        timestamp: Date.now(),
      };
      const updated = [historyEntry, ...prev].slice(0, MAX_HISTORY);
      saveToStorage(getHistoryKey(characterId), updated);
      return updated;
    });
  }, [characterId]);

  const clearHistory = useCallback(() => {
    setRollHistory([]);
    saveToStorage(getHistoryKey(characterId), []);
    toast.success('Roll history cleared');
  }, [characterId]);

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

  // Extract die sides from expression for animation
  const extractSides = (expr) => {
    const match = expr.match(/d(\d+)/i);
    return match ? parseInt(match[1], 10) : 20;
  };

  /**
   * Advanced roll handler: parses complex expressions and produces detailed results.
   */
  const doAdvancedRoll = useCallback((expression, autoLabel = '') => {
    setRolling(true);
    setRollingSides(extractSides(expression));
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
          sides: g.sides,
        })),
        modifier,
        total: advInfo ? finalTotal : total,
        isNat20,
        isNat1,
        advInfo,
        breakdownParts,
      };

      setLastRoll(entry);
      pushToHistory(entry);
      setRolling(false);

      // Broadcast roll to session if toggle is on and not a DM secret roll
      if (broadcastOn && sessionActive) {
        try {
          invoke('ws_broadcast_event', {
            eventJson: JSON.stringify({
              type: 'RollBroadcast',
              player_uuid: playerUuid,
              expression: entry.expr,
              result: entry.rolls || [],
              total: entry.total,
              label: entry.label || '',
            }),
          }).catch(() => {});
        } catch { /* ignore broadcast errors */ }
      }

      if (rollLabel) setRollLabel('');
    }, 650); // Slightly longer to allow animation to play
  }, [rollMode, rollLabel, broadcastOn, sessionActive, playerUuid, pushToHistory]);

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

  const handleCopyRoll = async (entry) => {
    const label = entry.label ? ` (${entry.label})` : '';
    const line = `${entry.expr}: ${entry.total}${label}`;
    try {
      await navigator.clipboard.writeText(line);
      toast.success('Roll copied to clipboard');
    } catch {
      toast.error('Failed to copy');
    }
  };

  /* ── Hover animation variants for die buttons ── */
  const dieButtonVariants = {
    idle: { rotate: 0, scale: 1 },
    hover: {
      rotate: [0, -6, 6, -4, 4, -2, 2, 0],
      scale: [1, 1.08, 1.05, 1.08, 1.05, 1.03, 1.01, 1.05],
      transition: { duration: 0.6, repeat: Infinity, repeatType: 'loop' },
    },
  };

  return (
    <div className="space-y-6 max-w-none">
      <h2 className="text-2xl font-display text-amber-100 flex items-center gap-2">
        <Dice5 size={20} />
        <div>
          <span>Dice Roller<HelpTooltip text={HELP.diceBasics} /></span>
          <p className="text-xs text-amber-200/40 font-normal mt-0.5">Roll any combination of dice. Supports advanced expressions like &quot;2d6+1d8+5&quot;, &quot;4d6kh3&quot; (keep highest), &quot;2d20kl1&quot; (keep lowest).</p>
        </div>
      </h2>

      {/* Broadcast Toggle (only shown in active session) */}
      {sessionActive && (
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio size={14} className={broadcastOn ? 'text-emerald-400' : 'text-amber-200/30'} />
              <span className="font-display text-amber-100 text-sm">Broadcast Rolls</span>
              <span className="text-xs text-amber-200/30">
                {broadcastOn ? 'Rolls are shared with the session' : 'Rolls are private'}
              </span>
            </div>
            <button
              onClick={() => setBroadcastOn(b => !b)}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                broadcastOn ? 'bg-emerald-600' : 'bg-amber-200/10'
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  broadcastOn ? 'left-5.5 translate-x-0.5' : 'left-0.5'
                }`}
                style={{ left: broadcastOn ? '22px' : '2px' }}
              />
            </button>
          </div>
        </div>
      )}

      {/* Roll Label */}
      <div className="card">
        <h3 className="font-display text-amber-100 mb-2">Roll Label</h3>
        <p className="text-xs text-amber-200/30 mb-2">Give your next roll context — appears in history so you know what it was for.</p>
        <input
          className="input w-full mb-3"
          placeholder='e.g. "Attack — Longsword", "DEX save", "Stealth check"'
          value={rollLabel}
          onChange={e => setRollLabel(e.target.value)}
        />
        <div className="flex flex-wrap gap-1.5">
          {[
            'Attack Roll', 'Damage', 'Initiative', 'Saving Throw',
            'Ability Check', 'Skill Check', 'Death Save', 'Concentration',
            'Wild Magic', 'Hit Dice', 'Sneak Attack', 'Smite',
          ].map(label => (
            <button
              key={label}
              onClick={() => setRollLabel(label)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                rollLabel === label
                  ? 'bg-gold/20 text-amber-100 border border-gold/40'
                  : 'bg-[#0d0d12] text-amber-200/40 border border-amber-200/10 hover:text-amber-200/60 hover:border-amber-200/25'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Advantage / Disadvantage Toggle */}
      <div className={`card relative overflow-hidden ${
        rollMode === 'advantage' ? 'ring-1 ring-emerald-500/30' :
        rollMode === 'disadvantage' ? 'ring-1 ring-red-500/30' : ''
      }`}>
        {rollMode !== 'normal' && (
          <div className={`absolute inset-0 pointer-events-none ${
            rollMode === 'advantage' ? 'bg-emerald-500/5' : 'bg-red-500/5'
          }`} />
        )}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display text-amber-100">Roll Mode</h3>
            {rollMode !== 'normal' && (
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                rollMode === 'advantage'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {rollMode === 'advantage' ? 'ADV' : 'DIS'} Active
              </span>
            )}
          </div>
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
              { mode: 'normal', label: 'Normal', icon: '\u2696' },
              { mode: 'advantage', label: 'Advantage', icon: '\u2191' },
              { mode: 'disadvantage', label: 'Disadvantage', icon: '\u2193' },
            ].map(({ mode, label, icon }) => (
              <button
                key={mode}
                onClick={() => setRollMode(mode)}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  rollMode === mode
                    ? mode === 'advantage' ? 'bg-emerald-800/60 text-emerald-200 border-2 border-emerald-400/50 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                    : mode === 'disadvantage' ? 'bg-red-800/60 text-red-200 border-2 border-red-400/50 shadow-[0_0_12px_rgba(239,68,68,0.15)]'
                    : 'bg-gold/15 text-amber-100 border-2 border-gold/40'
                    : 'bg-[#0d0d12] text-amber-200/40 border border-amber-200/10 hover:text-amber-200/60 hover:border-amber-200/25'
                }`}
              >
                <span className="mr-1">{icon}</span> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Roll Buttons — with shake-to-roll hover animation */}
      <div className="card">
        <h3 className="font-display text-amber-100 mb-3">Quick Roll</h3>
        <div className="flex flex-wrap gap-3">
          {DICE.map(sides => (
            <motion.button
              key={sides}
              onClick={() => handleQuickRoll(sides)}
              className="w-16 h-16 rounded-lg bg-[#0d0d12] border-2 border-gold/20 hover:border-gold/50 transition-colors flex flex-col items-center justify-center group hover:shadow-[0_0_15px_rgba(201,168,76,0.2)]"
              aria-label={`Roll d${sides}`}
              title={`Roll 1d${sides} — ${DIE_TIPS[sides]}`}
              variants={dieButtonVariants}
              initial="idle"
              whileHover="hover"
              whileTap={{ scale: 0.9, rotate: 15 }}
            >
              <span className="text-lg font-display text-gold group-hover:text-amber-100 transition-colors">d{sides}</span>
              <span className="text-[9px] text-amber-200/30 group-hover:text-amber-200/50">{DIE_LABELS[sides]}</span>
            </motion.button>
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

      {/* Rolling Animation */}
      <AnimatePresence>
        {rolling && (
          <motion.div
            key="rolling-overlay"
            className="card text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <RollingOverlay sides={rollingSides} />
            <div className="text-sm text-amber-200/40 mt-1 font-display">Rolling...</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Last Roll Result */}
      <AnimatePresence mode="wait">
        {lastRoll && !rolling && (
          <motion.div
            key={lastRoll.id}
            aria-live="polite"
            aria-label={`Roll result: ${lastRoll.expr} = ${lastRoll.total}${lastRoll.isNat20 ? ', Natural 20!' : ''}${lastRoll.isNat1 ? ', Natural 1' : ''}`}
            className={`card text-center overflow-hidden relative ${lastRoll.isNat20 ? 'border-gold shadow-[0_0_40px_rgba(201,168,76,0.4)]' : lastRoll.isNat1 ? 'border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)]' : ''}`}
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
            {/* Particle effects for crits */}
            {lastRoll.isNat20 && <CritParticles type="nat20" />}
            {lastRoll.isNat1 && <CritParticles type="nat1" />}

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

            {/* Die face visual + total */}
            <motion.div
              className="flex flex-col items-center gap-2"
              initial={{ rotateX: 90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              transition={{ type: 'spring', damping: 12, delay: 0.05 }}
            >
              {/* Show die face visuals for simple rolls */}
              {lastRoll.groups && lastRoll.groups.length === 1 && !lastRoll.advInfo &&
                lastRoll.groups[0].kept.length <= 6 && lastRoll.groups[0].sides && (
                <div className="flex gap-2 justify-center mb-1">
                  {lastRoll.groups[0].kept.map((val, i) => (
                    <motion.div
                      key={i}
                      initial={{ rotateY: 180, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      transition={{ delay: 0.1 + i * 0.08, type: 'spring', damping: 14 }}
                    >
                      <DieFace sides={lastRoll.groups[0].sides} value={val} size={42} />
                    </motion.div>
                  ))}
                </div>
              )}
              <div className={`text-6xl font-display ${lastRoll.isNat20 ? 'text-gold' : lastRoll.isNat1 ? 'text-red-400' : 'text-amber-100'}`}>
                {lastRoll.total}
              </div>
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

      {/* ── Roll History ── */}
      <div className="card">
        <button
          onClick={() => setHistoryOpen(o => !o)}
          className="w-full flex items-center justify-between"
        >
          <h3 className="font-display text-amber-100 flex items-center gap-2">
            Roll History
            {rollHistory.length > 0 && (
              <span className="text-xs text-amber-200/30 font-normal">({rollHistory.length})</span>
            )}
          </h3>
          {historyOpen ? <ChevronUp size={16} className="text-amber-200/40" /> : <ChevronDown size={16} className="text-amber-200/40" />}
        </button>

        <AnimatePresence>
          {historyOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-3">
                {/* Filter + Clear */}
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-amber-200/30 pointer-events-none" />
                    <input
                      className="input w-full pl-8 text-sm"
                      placeholder="Filter by label or expression..."
                      value={historyFilter}
                      onChange={e => setHistoryFilter(e.target.value)}
                    />
                  </div>
                  {rollHistory.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="text-xs text-amber-200/30 hover:text-red-400 transition-colors flex items-center gap-1 shrink-0"
                      title="Clear all roll history"
                    >
                      <Trash2 size={12} /> Clear
                    </button>
                  )}
                </div>

                {/* History list */}
                {rollHistory.length === 0 ? (
                  <p className="text-sm text-amber-200/20">No rolls yet. Start rolling to build your history.</p>
                ) : (() => {
                  const filterLower = historyFilter.toLowerCase().trim();
                  const filtered = filterLower
                    ? rollHistory.filter(h =>
                        (h.label && h.label.toLowerCase().includes(filterLower)) ||
                        (h.expression && h.expression.toLowerCase().includes(filterLower))
                      )
                    : rollHistory;

                  if (filtered.length === 0) {
                    return <p className="text-sm text-amber-200/20">No rolls match your filter.</p>;
                  }

                  return (
                    <div className="max-h-72 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-amber-200/10">
                      {filtered.map(h => (
                        <div
                          key={h.id}
                          className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-[#0d0d12] border border-amber-200/5 hover:border-amber-200/15 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-amber-100 font-display text-lg font-bold w-10 text-right shrink-0">
                              {h.result}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-amber-200/60 truncate">{h.expression}</span>
                                {h.label && (
                                  <span className="text-[10px] text-gold/50 bg-gold/10 px-1.5 py-0.5 rounded-full truncate shrink-0">
                                    {h.label}
                                  </span>
                                )}
                              </div>
                              {h.rolls && h.rolls.length > 1 && (
                                <div className="text-[10px] text-amber-200/25">[{h.rolls.join(', ')}]</div>
                              )}
                            </div>
                          </div>
                          <span className="text-[10px] text-amber-200/20 shrink-0 whitespace-nowrap">
                            {formatRelativeTime(h.timestamp)}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
