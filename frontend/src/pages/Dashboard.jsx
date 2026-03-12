import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Heart, Shield, Bell,
  Library, ChevronRight, ChevronLeft, Scroll, Check, X,
  Copy, Search, Users,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { listCharacters, createCharacter, deleteCharacter } from '../api/characters';
import { RULESET_OPTIONS, getRuleset } from '../data/rulesets';
import ConfirmDialog from '../components/ConfirmDialog';
import { APP_VERSION } from '../version';
import { useAppMode } from '../contexts/ModeContext';

// ─── Class definitions ──────────────────────────────────────────────────────

const CLASSES = [
  { id: 'Barbarian', color: '#c0392b', bg: 'rgba(192,57,43,0.12)',   sym: '⚔',  flavor: 'Primal fury' },
  { id: 'Bard',      color: '#8e44ad', bg: 'rgba(142,68,173,0.12)',  sym: '♪',  flavor: 'Silver tongue' },
  { id: 'Cleric',    color: '#f0d878', bg: 'rgba(240,216,120,0.12)', sym: '✦',  flavor: 'Divine conduit' },
  { id: 'Druid',     color: '#27ae60', bg: 'rgba(39,174,96,0.12)',   sym: '🌿', flavor: 'Nature\'s servant' },
  { id: 'Fighter',   color: '#e67e22', bg: 'rgba(230,126,34,0.12)',  sym: '🛡', flavor: 'Martial master' },
  { id: 'Monk',      color: '#1abc9c', bg: 'rgba(26,188,156,0.12)',  sym: '☯',  flavor: 'Body & mind' },
  { id: 'Paladin',   color: '#f1c40f', bg: 'rgba(241,196,15,0.12)',  sym: '⚜',  flavor: 'Oath bound' },
  { id: 'Ranger',    color: '#2ecc71', bg: 'rgba(46,204,113,0.12)',  sym: '🏹', flavor: 'Wilderness scout' },
  { id: 'Rogue',     color: '#95a5a6', bg: 'rgba(149,165,166,0.12)', sym: '🗡', flavor: 'Shadow walker' },
  { id: 'Sorcerer',  color: '#e74c3c', bg: 'rgba(231,76,60,0.12)',   sym: '✦',  flavor: 'Born of magic' },
  { id: 'Warlock',   color: '#9b59b6', bg: 'rgba(155,89,182,0.12)',  sym: '👁', flavor: 'Patron\'s vessel' },
  { id: 'Wizard',    color: '#3498db', bg: 'rgba(52,152,219,0.12)',  sym: '📖', flavor: 'Arcane scholar' },
];

const RUNE_CHARS = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ','ᛇ','ᛈ','ᛉ','ᛊ','ᛏ','ᛒ','ᛖ','ᛗ','ᛚ','ᛜ','ᛞ','ᛟ'];

// ─── Floating rune background ────────────────────────────────────────────────

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: 30 + Math.random() * 70,
  sym: RUNE_CHARS[i % RUNE_CHARS.length],
  delay: Math.random() * 12,
  dur: 14 + Math.random() * 10,
}));

function RuneParticle({ x, y, sym, delay, dur }) {
  return (
    <motion.span
      style={{
        position: 'absolute', left: `${x}%`, top: `${y}%`,
        fontFamily: 'serif', fontSize: 13, color: '#c9a84c',
        opacity: 0, pointerEvents: 'none', userSelect: 'none',
      }}
      animate={{ y: [0, -110], opacity: [0, 0.1, 0.065, 0] }}
      transition={{ delay, duration: dur, repeat: Infinity, repeatDelay: Math.random() * 8 + 4, ease: 'linear' }}
    >
      {sym}
    </motion.span>
  );
}

// ─── Typewriter subtitle ─────────────────────────────────────────────────────

function TypewriterSubtitle() {
  const [text, setText] = useState('');
  const full = 'D&D Campaign Companion';
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setText(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, 48);
    return () => clearInterval(id);
  }, []);
  return (
    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 10, letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.38)' }}>
      {text}
      <span style={{ animation: 'blink 1s infinite', color: 'rgba(201,168,76,0.4)' }}>|</span>
    </span>
  );
}

// ─── HP bar ──────────────────────────────────────────────────────────────────

function HpBar({ current, max }) {
  if (!max) return null;
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  const col = pct > 60 ? '#27ae60' : pct > 30 ? '#f39c12' : '#e74c3c';
  return (
    <div style={{ width: '100%', height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.05)', overflow: 'hidden', marginBottom: 12 }}>
      <motion.div
        style={{ height: '100%', borderRadius: 99, background: col }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.1, delay: 0.4 }}
      />
    </div>
  );
}

// ─── Character card ──────────────────────────────────────────────────────────

function CharacterCard({ char, index, onEnter, onDelete, onDuplicate }) {
  const [hovered, setHovered] = useState(false);
  const cls = CLASSES.find(c => c.id === char.primary_class);
  const clsColor = cls?.color || '#c9a84c';
  const clsBg    = cls?.bg    || 'rgba(201,168,76,0.08)';
  const sym      = cls?.sym   || '?';
  const flavor   = cls?.flavor || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', damping: 22, stiffness: 200 }}
      whileHover={{ y: -6, boxShadow: `0 14px 50px rgba(0,0,0,0.7), 0 0 0 1px ${clsColor}40` }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onEnter(char.id)}
      style={{
        borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
        background: 'rgba(11,9,20,0.9)',
        border: '1px solid rgba(201,168,76,0.15)',
        boxShadow: '0 4px 36px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(16px)',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Banner */}
      <div style={{
        height: 100, position: 'relative', overflow: 'hidden',
        background: `linear-gradient(135deg, ${clsBg}, rgba(0,0,0,0.45))`,
        borderBottom: `1px solid ${clsColor}28`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Giant faded symbol */}
        <div style={{
          position: 'absolute', fontSize: 108, opacity: 0.055,
          lineHeight: 1, color: clsColor, userSelect: 'none', pointerEvents: 'none',
        }}>{sym}</div>

        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.07 }}
          style={{
            position: 'relative', zIndex: 2,
            width: 58, height: 58, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 900,
            background: 'rgba(8,6,16,0.88)',
            border: `2px solid ${clsColor}55`,
            color: clsColor,
            boxShadow: `0 0 22px ${clsColor}28, inset 0 0 10px ${clsColor}0a`,
          }}
        >
          {char.name?.[0] || '?'}
        </motion.div>

        {/* Level badge */}
        {char.level > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              position: 'absolute', top: 8, right: 10,
              fontSize: 9, fontFamily: 'var(--font-heading)', letterSpacing: '0.08em',
              color: clsColor, background: `${clsColor}18`,
              border: `1px solid ${clsColor}35`,
              padding: '2px 8px', borderRadius: 99,
              boxShadow: `0 0 8px ${clsColor}22`,
            }}
          >
            Lv {char.level}
          </motion.div>
        )}

        {/* Delete */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          style={{
            position: 'absolute', top: 8, left: 8, border: 'none', cursor: 'pointer',
            width: 28, height: 28, borderRadius: 8, fontSize: 12,
            background: 'rgba(0,0,0,0.45)', color: 'rgba(220,80,80,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          whileHover={{ color: '#e74c3c', background: 'rgba(139,34,50,0.45)' }}
          onClick={e => { e.stopPropagation(); onDelete(char); }}
        >
          <Trash2 size={12} />
        </motion.button>

        {/* Duplicate */}
        {onDuplicate && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            style={{
              position: 'absolute', top: 8, left: 42, border: 'none', cursor: 'pointer',
              width: 28, height: 28, borderRadius: 8, fontSize: 12,
              background: 'rgba(0,0,0,0.45)', color: 'rgba(200,175,130,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            whileHover={{ color: '#c9a84c', background: 'rgba(201,168,76,0.2)' }}
            onClick={e => { e.stopPropagation(); onDuplicate(char); }}
            title="Duplicate character"
          >
            <Copy size={12} />
          </motion.button>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px 15px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{
          fontFamily: 'var(--font-heading)', fontSize: 17,
          color: '#f0e4c8', marginBottom: 3, whiteSpace: 'nowrap',
          overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '0.02em',
        }}>{char.name}</div>

        <div style={{ fontSize: 13, marginBottom: 2, color: `${clsColor}cc` }}>
          {[char.race, char.primary_class].filter(Boolean).join(' ')}
          {!char.primary_class && <span style={{ color: 'rgba(200,175,130,0.25)', fontStyle: 'italic' }}>Awaiting destiny…</span>}
        </div>

        {/* Flavor text */}
        {flavor && (
          <div style={{ fontSize: 11, fontStyle: 'italic', marginBottom: 8, letterSpacing: '0.02em', color: `${clsColor}55` }}>
            {flavor}
          </div>
        )}

        {/* Stat chips */}
        {(char.max_hp > 0 || char.armor_class > 0) && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
            {char.max_hp > 0 && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 99,
                background: 'rgba(0,0,0,0.35)',
                border: '1px solid #e74c3c22',
                fontSize: 12, color: 'rgba(200,175,130,0.55)',
              }}>
                <Heart size={9} style={{ color: '#e74c3c' }} /> {char.current_hp}/{char.max_hp}
              </span>
            )}
            {char.armor_class > 0 && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 99,
                background: 'rgba(0,0,0,0.35)',
                border: '1px solid rgba(200,175,130,0.15)',
                fontSize: 12, color: 'rgba(200,175,130,0.55)',
              }}>
                <Shield size={9} style={{ color: 'rgba(200,175,130,0.6)' }} /> AC {char.armor_class}
              </span>
            )}
          </div>
        )}

        {char.max_hp > 0 && <HpBar current={char.current_hp} max={char.max_hp} />}

        <div style={{ display: 'flex', alignItems: 'center', marginTop: 'auto' }}>
          {char.ruleset && (
            <div style={{
              fontSize: 9, fontFamily: 'var(--font-heading)', letterSpacing: '0.07em',
              padding: '3px 9px', borderRadius: 99, textTransform: 'uppercase',
              background: `${clsColor}12`, border: `1px solid ${clsColor}22`, color: `${clsColor}88`,
            }}>
              {RULESET_OPTIONS.find(o => o.id === char.ruleset)?.name || char.ruleset}
            </div>
          )}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            style={{
              marginLeft: 'auto', fontSize: 12, fontFamily: 'var(--font-heading)',
              color: clsColor, display: 'flex', alignItems: 'center', gap: 3,
              letterSpacing: '0.05em',
            }}
          >
            Enter <ChevronRight size={12} />
          </motion.div>
        </div>
      </div>

      {/* Bottom sweep */}
      <motion.div
        animate={{ width: hovered ? '100%' : '0%' }}
        transition={{ duration: 0.45 }}
        style={{
          height: 2,
          background: `linear-gradient(90deg, transparent, ${clsColor}, transparent)`,
        }}
      />
    </motion.div>
  );
}

// ─── New character card ───────────────────────────────────────────────────────

function NewCharCard({ index, onClick, isDM }) {
  const [hovered, setHovered] = useState(false);
  const accent = isDM ? 'rgba(155,89,182,' : 'rgba(201,168,76,';
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -6, borderColor: `${accent}0.4)`, background: `${accent}0.04)`, boxShadow: `0 14px 50px rgba(0,0,0,0.7), 0 0 30px ${accent}0.06)` }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      style={{
        borderRadius: 14, minHeight: 240, cursor: 'pointer', position: 'relative', overflow: 'hidden',
        border: `1px dashed ${accent}0.18)`,
        background: 'rgba(11,9,20,0.45)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 12,
        boxShadow: '0 4px 30px rgba(0,0,0,0.4)',
      }}
    >
      <motion.div
        animate={hovered ? { rotate: 90, scale: 1.1, boxShadow: `0 0 20px ${accent}0.2), inset 0 0 12px ${accent}0.08)` } : { rotate: 0, scale: 1, boxShadow: 'none' }}
        transition={{ type: 'spring', stiffness: 320 }}
        style={{
          width: 64, height: 64, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${accent}0.05)`,
          border: `1px dashed ${accent}0.3)`,
          fontSize: 22, color: `${accent}0.45)`,
        }}
      >
        <Plus size={22} />
      </motion.div>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: hovered ? 'rgba(200,175,130,0.7)' : 'rgba(200,175,130,0.38)', transition: 'color 0.3s' }}>
          {isDM ? 'New Campaign' : 'New Character'}
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 12, color: hovered ? 'rgba(200,175,130,0.4)' : 'rgba(200,175,130,0.18)', transition: 'color 0.3s' }}>
          {isDM ? 'Start a new adventure' : 'Begin a new legend'}
        </div>
      </div>

      {/* Bottom sweep */}
      <motion.div
        animate={{ width: hovered ? '100%' : '0%' }}
        transition={{ duration: 0.45 }}
        style={{
          position: 'absolute', bottom: 0, left: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${accent}0.5), transparent)`,
        }}
      />
    </motion.div>
  );
}

// ─── DM Campaign Card ────────────────────────────────────────────────────────

function CampaignCard({ char, index, onEnter, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const color = '#9b59b6';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', damping: 22, stiffness: 200 }}
      whileHover={{ y: -6, boxShadow: `0 14px 50px rgba(0,0,0,0.7), 0 0 0 1px ${color}40` }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onEnter(char.id)}
      style={{
        borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
        background: 'rgba(11,9,20,0.9)',
        border: `1px solid ${color}25`,
        boxShadow: '0 4px 36px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(16px)',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Banner */}
      <div style={{
        height: 100, position: 'relative', overflow: 'hidden',
        background: `linear-gradient(135deg, rgba(155,89,182,0.12), rgba(0,0,0,0.45))`,
        borderBottom: `1px solid ${color}28`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ position: 'absolute', fontSize: 108, opacity: 0.055, lineHeight: 1, color, userSelect: 'none', pointerEvents: 'none' }}>📖</div>

        <motion.div
          whileHover={{ scale: 1.07 }}
          style={{
            position: 'relative', zIndex: 2,
            width: 58, height: 58, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 900,
            background: 'rgba(8,6,16,0.88)',
            border: `2px solid ${color}55`,
            color: '#c084fc',
            boxShadow: `0 0 22px ${color}28, inset 0 0 10px ${color}0a`,
          }}
        >
          {char.name?.[0] || '?'}
        </motion.div>

        {/* Delete */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          style={{
            position: 'absolute', top: 8, left: 8, border: 'none', cursor: 'pointer',
            width: 28, height: 28, borderRadius: 8, fontSize: 12,
            background: 'rgba(0,0,0,0.45)', color: 'rgba(220,80,80,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          whileHover={{ color: '#e74c3c', background: 'rgba(139,34,50,0.45)' }}
          onClick={e => { e.stopPropagation(); onDelete(char); }}
        >
          <Trash2 size={12} />
        </motion.button>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px 15px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{
          fontFamily: 'var(--font-heading)', fontSize: 17,
          color: '#f0e4c8', marginBottom: 3, whiteSpace: 'nowrap',
          overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '0.02em',
        }}>{char.name}</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <span style={{
            fontSize: 9, fontFamily: 'var(--font-heading)', letterSpacing: '0.08em',
            textTransform: 'uppercase', padding: '2px 8px', borderRadius: 99,
            background: 'rgba(155,89,182,0.12)', border: '1px solid rgba(155,89,182,0.25)',
            color: '#c084fc',
          }}>
            Campaign
          </span>
          {char.ruleset && (
            <span style={{
              fontSize: 9, fontFamily: 'var(--font-heading)', letterSpacing: '0.07em',
              padding: '2px 8px', borderRadius: 99, textTransform: 'uppercase',
              background: `${color}12`, border: `1px solid ${color}22`, color: `${color}88`,
            }}>
              {RULESET_OPTIONS.find(o => o.id === char.ruleset)?.name || char.ruleset}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: 'auto' }}>
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            style={{
              marginLeft: 'auto', fontSize: 12, fontFamily: 'var(--font-heading)',
              color: '#c084fc', display: 'flex', alignItems: 'center', gap: 3,
              letterSpacing: '0.05em',
            }}
          >
            Open <ChevronRight size={12} />
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ width: hovered ? '100%' : '0%' }}
        transition={{ duration: 0.45 }}
        style={{ height: 2, background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />
    </motion.div>
  );
}

// ─── Create Campaign Modal (DM mode — simplified) ────────────────────────────

function CreateCampaignModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [ruleset, setRuleset] = useState('5e-2014');
  const [busy, setBusy] = useState(false);
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);

  const doCreate = async () => {
    if (busy || !name.trim()) return;
    setBusy(true);
    try { await onCreate({ name: name.trim(), ruleset, primaryClass: '', race: '', experience: 'experienced' }); }
    finally { setBusy(false); }
  };

  return (
    <motion.div
      style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 16 }}
        transition={{ type: 'spring', damping: 24, stiffness: 300 }}
        style={{ width: 420, maxWidth: '100%', borderRadius: 18, overflow: 'hidden', background: 'linear-gradient(160deg,#0d0b18 0%,#110e1e 100%)', border: '1px solid rgba(155,89,182,0.22)', boxShadow: '0 40px 100px rgba(0,0,0,0.85), 0 0 0 1px rgba(155,89,182,0.08)' }}
      >
        {/* Glow bar */}
        <div style={{ height: 3, background: 'linear-gradient(90deg,transparent,#9b59b6,transparent)' }} />

        <div style={{ padding: '24px 24px 28px' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 30, marginBottom: 8 }}>📖</div>
            <h4 style={{ fontFamily: 'var(--font-heading)', color: '#efe0c0', fontSize: 20, marginBottom: 4 }}>
              Name Your Campaign
            </h4>
            <p style={{ fontSize: 13, color: 'rgba(200,175,130,0.38)' }}>
              Give your world a name. You can manage sessions, NPCs, and quests inside.
            </p>
          </div>

          <input
            ref={ref}
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && name.trim() && doCreate()}
            placeholder="e.g. Curse of Strahd, Homebrew World…"
            maxLength={60}
            style={{
              width: '100%', padding: '13px 18px', borderRadius: 10, marginBottom: 16,
              background: 'rgba(8,6,16,0.9)', border: '1px solid rgba(155,89,182,0.28)',
              color: '#f0e4c8', fontFamily: 'var(--font-heading)', fontSize: 16,
              letterSpacing: '0.05em', textAlign: 'center', outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(155,89,182,0.65)'}
            onBlur={e => e.target.style.borderColor = 'rgba(155,89,182,0.28)'}
          />

          {/* Ruleset selection */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 9, fontFamily: 'var(--font-heading)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(200,175,130,0.35)', marginBottom: 8 }}>Ruleset</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {RULESET_OPTIONS.map(opt => {
                const sel = ruleset === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setRuleset(opt.id)}
                    style={{
                      flex: 1, padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', textAlign: 'center',
                      background: sel ? 'rgba(155,89,182,0.1)' : 'rgba(255,255,255,0.03)',
                      outline: sel ? '1px solid rgba(155,89,182,0.38)' : '1px solid rgba(255,255,255,0.06)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 12, color: sel ? '#c084fc' : 'rgba(200,175,130,0.5)', letterSpacing: '0.03em' }}>{opt.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'rgba(200,175,130,0.38)', fontFamily: 'var(--font-heading)', fontSize: 12, letterSpacing: '0.05em' }}>
              Cancel
            </button>
            <motion.button
              onClick={doCreate}
              disabled={busy || !name.trim()}
              whileHover={name.trim() ? { y: -2, boxShadow: '0 5px 18px rgba(155,89,182,0.3)' } : {}}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '10px 24px', borderRadius: 9, border: 'none',
                cursor: name.trim() && !busy ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-heading)', fontSize: 12, letterSpacing: '0.08em', fontWeight: 700,
                background: name.trim() ? 'linear-gradient(135deg,#9b59b6,#c084fc)' : 'rgba(155,89,182,0.15)',
                color: name.trim() ? '#fff' : 'rgba(155,89,182,0.4)',
                opacity: busy ? 0.6 : name.trim() ? 1 : 0.5,
              }}
            >
              {busy ? 'Creating…' : <><Scroll size={13} /> Create Campaign</>}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Step 1: Name ─────────────────────────────────────────────────────────────

function StepName({ name, setName, onNext, onClose }) {
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 30, marginBottom: 8 }}>📜</div>
        <h4 style={{ fontFamily: 'var(--font-heading)', color: '#efe0c0', fontSize: 20, marginBottom: 4 }}>
          What is your name, adventurer?
        </h4>
        <p style={{ fontSize: 13, color: 'rgba(200,175,130,0.38)' }}>
          The name written in the annals of legend.
        </p>
      </div>
      <input
        ref={ref}
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && name.trim() && onNext()}
        placeholder="Enter character name…"
        maxLength={60}
        style={{
          width: '100%', padding: '13px 18px', borderRadius: 10,
          background: 'rgba(8,6,16,0.9)', border: '1px solid rgba(201,168,76,0.28)',
          color: '#f0e4c8', fontFamily: 'var(--font-heading)', fontSize: 16,
          letterSpacing: '0.05em', textAlign: 'center', outline: 'none',
        }}
        onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.65)'}
        onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.28)'}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'rgba(200,175,130,0.38)', fontFamily: 'var(--font-heading)', fontSize: 12, letterSpacing: '0.05em' }}>
          Cancel
        </button>
        <motion.button
          onClick={onNext}
          disabled={!name.trim()}
          whileHover={name.trim() ? { y: -2, boxShadow: '0 5px 18px rgba(201,168,76,0.3)' } : {}}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '10px 24px', borderRadius: 9, border: 'none', cursor: name.trim() ? 'pointer' : 'not-allowed',
            fontFamily: 'var(--font-heading)', fontSize: 12, letterSpacing: '0.08em', fontWeight: 700,
            background: name.trim() ? 'linear-gradient(135deg,#c9a84c,#f0d878)' : 'rgba(201,168,76,0.15)',
            color: name.trim() ? '#12101c' : 'rgba(201,168,76,0.4)',
            opacity: name.trim() ? 1 : 0.5,
          }}
        >
          Continue <ChevronRight size={14} />
        </motion.button>
      </div>
    </div>
  );
}

// ─── Step 2: Experience Level ─────────────────────────────────────────────────

function StepExperience({ experience, setExperience, onNext, onBack }) {
  const options = [
    {
      id: 'new',
      label: "I'm new to D&D",
      desc: "I'll get a quick guide to the basics after we set up your character.",
      icon: '🌱',
    },
    {
      id: 'experienced',
      label: "I know how to play",
      desc: "Skip the intro — you'll still have the help button if you need it.",
      icon: '⚔',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 28, marginBottom: 6 }}>🎲</div>
        <h4 style={{ fontFamily: 'var(--font-heading)', color: '#efe0c0', fontSize: 20, marginBottom: 3 }}>
          How familiar are you with D&D?
        </h4>
        <p style={{ fontSize: 13, color: 'rgba(200,175,130,0.38)' }}>
          This helps us tailor your experience.
        </p>
      </div>

      {options.map(opt => {
        const sel = experience === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => setExperience(opt.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '16px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', textAlign: 'left',
              background: sel ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.03)',
              outline: sel ? '1px solid rgba(201,168,76,0.38)' : '1px solid rgba(255,255,255,0.06)',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: 28, lineHeight: 1 }}>{opt.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 14, color: sel ? '#c9a84c' : 'rgba(200,175,130,0.6)', letterSpacing: '0.03em' }}>
                {opt.label}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(200,175,130,0.3)', marginTop: 3, lineHeight: 1.4 }}>
                {opt.desc}
              </div>
            </div>
            <div style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, border: sel ? '2px solid #c9a84c' : '2px solid rgba(201,168,76,0.28)', background: sel ? '#c9a84c' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
              {sel && <Check size={10} style={{ color: '#12101c' }} />}
            </div>
          </button>
        );
      })}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <button onClick={onBack} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'rgba(200,175,130,0.38)', fontFamily: 'var(--font-heading)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, letterSpacing: '0.05em' }}>
          <ChevronLeft size={14} /> Back
        </button>
        <motion.button
          onClick={onNext}
          disabled={!experience}
          whileHover={experience ? { y: -2, boxShadow: '0 5px 18px rgba(201,168,76,0.3)' } : {}}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '10px 24px', borderRadius: 9, border: 'none',
            cursor: experience ? 'pointer' : 'not-allowed',
            fontFamily: 'var(--font-heading)', fontSize: 12, letterSpacing: '0.08em', fontWeight: 700,
            background: experience ? 'linear-gradient(135deg,#c9a84c,#f0d878)' : 'rgba(201,168,76,0.15)',
            color: experience ? '#12101c' : 'rgba(201,168,76,0.4)',
            opacity: experience ? 1 : 0.5,
          }}
        >
          Continue <ChevronRight size={14} />
        </motion.button>
      </div>
    </div>
  );
}

// ─── Step 3: Ruleset ──────────────────────────────────────────────────────────

function StepRuleset({ ruleset, setRuleset, onNext, onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 28, marginBottom: 6 }}>📖</div>
        <h4 style={{ fontFamily: 'var(--font-heading)', color: '#efe0c0', fontSize: 20, marginBottom: 3 }}>Rules of the Realm</h4>
        <p style={{ fontSize: 13, color: 'rgba(200,175,130,0.38)' }}>Choose your edition first — it determines available classes, races &amp; subclasses.</p>
      </div>

      {RULESET_OPTIONS.map(opt => {
        const sel = ruleset === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => setRuleset(opt.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '13px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', textAlign: 'left',
              background: sel ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.03)',
              outline: sel ? '1px solid rgba(201,168,76,0.38)' : '1px solid rgba(255,255,255,0.06)',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, border: sel ? '2px solid #c9a84c' : '2px solid rgba(201,168,76,0.28)', background: sel ? '#c9a84c' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
              {sel && <Check size={10} style={{ color: '#12101c' }} />}
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 13, color: sel ? '#c9a84c' : 'rgba(200,175,130,0.6)', letterSpacing: '0.03em' }}>{opt.name}</div>
              <div style={{ fontSize: 11, color: 'rgba(200,175,130,0.28)', marginTop: 2 }}>
                {opt.id === '5e-2014' ? 'The classic 2014 Player\'s Handbook rules' : 'Revised 2024 rules — updated classes & subclasses'}
              </div>
            </div>
          </button>
        );
      })}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <button onClick={onBack} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'rgba(200,175,130,0.38)', fontFamily: 'var(--font-heading)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, letterSpacing: '0.05em' }}>
          <ChevronLeft size={14} /> Back
        </button>
        <motion.button
          onClick={onNext}
          whileHover={{ y: -2, boxShadow: '0 5px 18px rgba(201,168,76,0.3)' }}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 24px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-heading)', fontSize: 12, letterSpacing: '0.08em', fontWeight: 700, background: 'linear-gradient(135deg,#c9a84c,#f0d878)', color: '#12101c' }}
        >
          Continue <ChevronRight size={14} />
        </motion.button>
      </div>
    </div>
  );
}

// ─── Step 3: Class + Race ────────────────────────────────────────────────────

function StepClass({ name, cls, setCls, race, setRace, ruleset, onCreate, onBack, busy }) {
  const clsDef = CLASSES.find(c => c.id === cls);
  const rulesetData = getRuleset(ruleset);
  // Get class names from ruleset data
  const rulesetClasses = rulesetData.CLASSES.map(c => c.name);
  // Get unique race names from ruleset data
  const rulesetRaces = [...new Set(rulesetData.RACES.map(r => r.name))];
  // Filter our CLASSES visual definitions to only show ones in this ruleset
  const availableClasses = CLASSES.filter(c => rulesetClasses.includes(c.id));
  const canCreate = cls && race;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 28, marginBottom: 6 }}>⚔</div>
        <h4 style={{ fontFamily: 'var(--font-heading)', color: '#efe0c0', fontSize: 20, marginBottom: 3 }}>Choose your path</h4>
        <p style={{ fontSize: 13, color: 'rgba(200,175,130,0.38)' }}>Select a class and race for your character.</p>
      </div>

      {/* Class grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, maxHeight: 200, overflowY: 'auto', paddingRight: 2 }}>
        {availableClasses.map(c => {
          const selected = cls === c.id;
          return (
            <motion.button
              key={c.id}
              onClick={() => setCls(selected ? '' : c.id)}
              whileHover={{ scale: 1.04 }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                padding: '10px 4px', borderRadius: 9, cursor: 'pointer', border: 'none',
                background: selected ? c.bg : 'rgba(255,255,255,0.03)',
                outline: selected ? `1px solid ${c.color}55` : '1px solid rgba(255,255,255,0.06)',
                boxShadow: selected ? `0 0 12px ${c.color}22` : 'none',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>{c.sym}</span>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: selected ? c.color : 'rgba(200,175,130,0.45)', fontFamily: 'var(--font-heading)' }}>
                {c.id}
              </span>
              {selected && <span style={{ fontSize: 8, fontStyle: 'italic', color: `${c.color}99` }}>{c.flavor}</span>}
            </motion.button>
          );
        })}
      </div>

      {/* Race pills */}
      <div>
        <div style={{ fontSize: 9, fontFamily: 'var(--font-heading)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(200,175,130,0.35)', marginBottom: 8 }}>Race</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {rulesetRaces.map(r => {
            const sel = race === r;
            return (
              <button
                key={r}
                onClick={() => setRace(sel ? '' : r)}
                style={{
                  padding: '4px 11px', borderRadius: 99, fontSize: 12, cursor: 'pointer', border: 'none',
                  background: sel ? 'rgba(201,168,76,0.18)' : 'rgba(255,255,255,0.04)',
                  outline: sel ? '1px solid rgba(201,168,76,0.45)' : '1px solid rgba(255,255,255,0.07)',
                  color: sel ? '#c9a84c' : 'rgba(200,175,130,0.42)',
                  fontFamily: 'var(--font-body)', transition: 'all 0.2s',
                }}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>

      {/* Character preview */}
      <div style={{ borderRadius: 10, padding: '12px 16px', textAlign: 'center', background: clsDef ? clsDef.bg : 'rgba(201,168,76,0.07)', outline: `1px solid ${clsDef ? clsDef.color : '#c9a84c'}28` }}>
        <div style={{ fontSize: 26, marginBottom: 3 }}>{clsDef?.sym || '?'}</div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 15, color: '#f0e4c8' }}>{name}</div>
        <div style={{ fontSize: 12, marginTop: 2, color: clsDef ? `${clsDef.color}bb` : 'rgba(200,175,130,0.4)' }}>
          {[race, cls].filter(Boolean).join(' ') || 'Mysterious Stranger'}
          {ruleset && <span style={{ color: 'rgba(200,175,130,0.3)', marginLeft: 6 }}>· {RULESET_OPTIONS.find(o => o.id === ruleset)?.name}</span>}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onBack} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'rgba(200,175,130,0.38)', fontFamily: 'var(--font-heading)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, letterSpacing: '0.05em' }}>
          <ChevronLeft size={14} /> Back
        </button>
        <motion.button
          onClick={onCreate}
          disabled={busy || !canCreate}
          whileHover={!busy && canCreate ? { y: -2, boxShadow: '0 5px 18px rgba(201,168,76,0.3)' } : {}}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 24px', borderRadius: 9, border: 'none', cursor: busy || !canCreate ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-heading)', fontSize: 12, letterSpacing: '0.08em', fontWeight: 700, background: canCreate ? 'linear-gradient(135deg,#c9a84c,#f0d878)' : 'rgba(201,168,76,0.15)', color: canCreate ? '#12101c' : 'rgba(201,168,76,0.4)', opacity: busy ? 0.6 : canCreate ? 1 : 0.5 }}
        >
          {busy ? <span>Creating…</span> : <><Scroll size={13} /> Begin the Legend</>}
        </motion.button>
      </div>
    </div>
  );
}

// ─── Creation wizard modal ────────────────────────────────────────────────────

function CreateModal({ onClose, onCreate }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [experience, setExperience] = useState('');
  const [cls, setCls] = useState('');
  const [race, setRace] = useState('');
  const [ruleset, setRuleset] = useState('5e-2014');
  const [busy, setBusy] = useState(false);

  const doCreate = async () => {
    if (busy) return;
    setBusy(true);
    try { await onCreate({ name: name.trim(), ruleset, primaryClass: cls, race, experience }); }
    finally { setBusy(false); }
  };

  const STEP_LABELS = ['Name', 'Experience', 'Ruleset', 'Class & Race'];

  return (
    <motion.div
      style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 16 }}
        transition={{ type: 'spring', damping: 24, stiffness: 300 }}
        style={{ width: 460, maxWidth: '100%', borderRadius: 18, overflow: 'hidden', background: 'linear-gradient(160deg,#0d0b18 0%,#110e1e 100%)', border: '1px solid rgba(201,168,76,0.22)', boxShadow: '0 40px 100px rgba(0,0,0,0.85), 0 0 0 1px rgba(201,168,76,0.08)' }}
      >
        {/* Glow bar */}
        <div style={{ height: 3, background: 'linear-gradient(90deg,transparent,#c9a84c,transparent)' }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '20px 24px 0' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', color: '#efe0c0', fontSize: 14, letterSpacing: '0.05em' }}>New Character</div>
            {/* Step indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 10 }}>
              {STEP_LABELS.map((label, i) => {
                const n = i + 1;
                const done = n < step, current = n === step;
                return (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontFamily: 'var(--font-heading)', fontWeight: 700, border: `1px solid ${done || current ? '#c9a84c' : 'rgba(201,168,76,0.25)'}`, background: done || current ? '#c9a84c' : 'rgba(201,168,76,0.06)', color: done || current ? '#12101c' : 'rgba(201,168,76,0.3)', transition: 'all 0.3s' }}>
                      {done ? <Check size={10} /> : n}
                    </div>
                    <span style={{ fontSize: 9, fontFamily: 'var(--font-heading)', color: 'rgba(200,175,130,0.35)', display: window.innerWidth > 450 ? 'inline' : 'none' }}>{label}</span>
                    {i < STEP_LABELS.length - 1 && <div style={{ width: 14, height: 1, background: n < step ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.1)', marginLeft: 2 }} />}
                  </div>
                );
              })}
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.04)', color: 'rgba(200,175,130,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: -4 }}>
            <X size={15} />
          </button>
        </div>

        {/* Step content */}
        <div style={{ padding: '16px 24px 24px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.18 }}
            >
              {step === 1 && <StepName name={name} setName={setName} onNext={() => setStep(2)} onClose={onClose} />}
              {step === 2 && <StepExperience experience={experience} setExperience={setExperience} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
              {step === 3 && <StepRuleset ruleset={ruleset} setRuleset={setRuleset} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
              {step === 4 && <StepClass name={name} cls={cls} setCls={setCls} race={race} setRace={setRace} ruleset={ruleset} onCreate={doCreate} onBack={() => setStep(3)} busy={busy} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Decorative divider ───────────────────────────────────────────────────────

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '18px auto 18px', maxWidth: 480, opacity: 0.38, width: '100%' }}>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,transparent,rgba(201,168,76,0.9))' }} />
      <svg width="14" height="14" viewBox="0 0 16 16"><path d="M8 1L9.8 6.2L15 8L9.8 9.8L8 15L6.2 9.8L1 8L6.2 6.2Z" fill="#c9a84c"/></svg>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,rgba(201,168,76,0.9),transparent)' }} />
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onOpen, isDM }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      style={{ textAlign: 'center', padding: '64px 32px' }}
    >
      <div style={{ fontSize: 70, opacity: 0.1, marginBottom: 20, lineHeight: 1, fontFamily: 'var(--font-heading)' }}>{isDM ? '📖' : '⚔'}</div>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: 'rgba(200,175,130,0.5)', marginBottom: 10 }}>
        {isDM ? 'No Campaigns Yet' : 'The Codex Awaits'}
      </h3>
      <p style={{ fontSize: 15, color: 'rgba(200,175,130,0.27)', maxWidth: 320, margin: '0 auto 32px', lineHeight: 1.75 }}>
        {isDM
          ? 'Create your first campaign to start managing sessions, NPCs, quests, and encounters.'
          : 'No adventurers have been recorded yet. Create your first character and begin writing your legend.'}
      </p>
      <motion.button
        onClick={onOpen}
        whileHover={{ y: -2, boxShadow: isDM ? '0 8px 28px rgba(155,89,182,0.3)' : '0 8px 28px rgba(201,168,76,0.3)' }}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '12px 32px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-heading)', fontSize: 13, letterSpacing: '0.08em', fontWeight: 700, background: isDM ? 'linear-gradient(135deg,#9b59b6,#c084fc)' : 'linear-gradient(135deg,#c9a84c,#f0d878)', color: isDM ? '#fff' : '#12101c' }}
      >
        <Scroll size={16} /> {isDM ? 'Create First Campaign' : 'Create First Character'}
      </motion.button>
    </motion.div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { mode: appMode, clearMode } = useAppMode();
  const isDM = appMode === 'dm';
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

  const [charSearch, setCharSearch] = useState('');

  const load = async () => {
    try { const d = await listCharacters(); setCharacters(d); }
    catch (err) { toast.error(`Failed to load characters: ${err.message}`); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleCreate = async ({ name, ruleset, primaryClass, race, experience }) => {
    try {
      const char = await createCharacter({ name, ruleset, primaryClass, race });
      toast.success(isDM ? `Campaign "${char.name}" created!` : `${char.name} added to the Codex!`);
      setShowCreate(false);
      if (isDM) {
        navigate(`/character/${char.id}`);
      } else {
        // Player mode: go to character setup wizard
        navigate(`/character/${char.id}/setup`);
      }
    } catch (err) {
      toast.error(`Failed to create character: ${err.message}`);
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCharacter(deleteTarget.id);
      toast.success(`${deleteTarget.name} removed from the Codex.`);
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(`Failed to delete: ${err.message}`);
    }
  };

  const handleDuplicate = async (char) => {
    try {
      const dupChar = await createCharacter({
        name: `${char.name} (Copy)`,
        ruleset: char.ruleset || '5e-2014',
        primaryClass: char.primary_class || '',
        race: char.race || '',
      });
      toast.success(`Duplicated as "${dupChar.name}"`);
      load();
    } catch (err) {
      toast.error(`Failed to duplicate: ${err.message}`);
    }
  };

  // ── Derived stats for quick stats bar ──
  const filteredCharacters = charSearch.trim()
    ? characters.filter(c => {
        const q = charSearch.trim().toLowerCase();
        return (c.name || '').toLowerCase().includes(q)
          || (c.race || '').toLowerCase().includes(q)
          || (c.primary_class || '').toLowerCase().includes(q);
      })
    : characters;

  const avgLevel = characters.length > 0
    ? (characters.reduce((sum, c) => sum + (c.level || 0), 0) / characters.length).toFixed(1)
    : 0;

  const mostPlayedClass = (() => {
    if (characters.length === 0) return null;
    const counts = {};
    characters.forEach(c => {
      if (c.primary_class) counts[c.primary_class] = (counts[c.primary_class] || 0) + 1;
    });
    const entries = Object.entries(counts);
    if (entries.length === 0) return null;
    entries.sort((a, b) => b[1] - a[1]);
    return { name: entries[0][0], count: entries[0][1] };
  })();

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden', background: 'var(--bg-deep)' }}>

      {/* ── Atmosphere ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '50%', transform: 'translateX(-50%)', width: 900, height: 700, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(46,31,94,0.28) 0%, transparent 65%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: '-5%', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(139,34,50,0.14) 0%, transparent 65%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', top: '35%', right: '-5%', width: 500, height: 450, background: 'radial-gradient(ellipse, rgba(26,58,92,0.15) 0%, transparent 65%)', filter: 'blur(40px)' }} />
        {/* Diagonal light ray */}
        <div style={{ position: 'absolute', top: '-15%', left: '33%', width: 2, height: '130%', background: 'linear-gradient(180deg,transparent,rgba(201,168,76,0.05) 35%,rgba(201,168,76,0.09) 55%,rgba(201,168,76,0.04) 75%,transparent)', transform: 'rotate(11deg)', transformOrigin: 'top center', filter: 'blur(3px)' }} />
        {/* Rune particles */}
        {PARTICLES.map(p => <RuneParticle key={p.id} {...p} />)}
      </div>

      {/* ── Content ── */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 1060, padding: '0 24px 120px' }}>

        {/* Header */}
        <motion.header
          initial={{ y: -22, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', paddingTop: 52, paddingBottom: 0 }}
        >
          {/* Typewriter subtitle */}
          <div style={{ display: 'block', marginBottom: 10, minHeight: '1.2em' }}>
            <TypewriterSubtitle />
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 900,
            fontSize: 'clamp(3rem,7.5vw,5.5rem)', lineHeight: 1, marginBottom: 2,
            background: 'linear-gradient(135deg, #ffe9a0 0%, #c9a84c 35%, #ffe9a0 65%, #c9a84c 100%)',
            backgroundSize: '300% 300%',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            animation: 'shimmer 5s ease-in-out infinite',
          }}>
            The Codex
          </h1>

          <Divider />

          {/* Nav buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
            <motion.button
              onClick={() => navigate('/wiki')}
              whileHover={{ borderColor: 'rgba(201,168,76,0.6)', color: '#c9a84c', boxShadow: '0 0 20px rgba(201,168,76,0.12), 0 4px 16px rgba(0,0,0,0.4)' }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 99, border: '1px solid rgba(201,168,76,0.22)', background: 'rgba(201,168,76,0.06)', color: 'rgba(200,175,130,0.6)', fontFamily: 'var(--font-heading)', fontSize: 11, letterSpacing: '0.1em', cursor: 'pointer', textTransform: 'uppercase' }}
            >
              <Library size={13} /> Arcane Encyclopedia
            </motion.button>
            <motion.button
              onClick={() => {
                // Navigate to first character's updates if available, otherwise just show toast
                if (characters.length > 0) navigate(`/character/${characters[0].id}`, { state: { section: 'updates' } });
                else toast('Create a character first', { icon: '📜' });
              }}
              whileHover={{ borderColor: 'rgba(201,168,76,0.6)', color: '#c9a84c', boxShadow: '0 0 20px rgba(201,168,76,0.12), 0 4px 16px rgba(0,0,0,0.4)' }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 99, border: '1px solid rgba(201,168,76,0.22)', background: 'rgba(201,168,76,0.06)', color: 'rgba(200,175,130,0.6)', fontFamily: 'var(--font-heading)', fontSize: 11, letterSpacing: '0.1em', cursor: 'pointer', textTransform: 'uppercase' }}
            >
              <Bell size={13} /> Updates
            </motion.button>
          </div>
        </motion.header>

        {/* Count pill */}
        {!loading && characters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', damping: 18 }}
            style={{ textAlign: 'center', marginBottom: 28 }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '6px 20px', borderRadius: 99,
              background: 'rgba(201,168,76,0.06)',
              border: '1px solid rgba(201,168,76,0.16)',
              fontFamily: 'var(--font-heading)', fontSize: 10,
              color: 'rgba(200,175,130,0.35)', letterSpacing: '0.28em', textTransform: 'uppercase',
            }}>
              <span style={{ width: 5, height: 5, background: 'rgba(201,168,76,0.55)', transform: 'rotate(45deg)', flexShrink: 0 }} />
              {characters.length} {isDM
                ? (characters.length === 1 ? 'Campaign' : 'Campaigns')
                : (characters.length === 1 ? 'Adventurer' : 'Adventurers')
              } in the Codex
              <span style={{ width: 5, height: 5, background: 'rgba(201,168,76,0.55)', transform: 'rotate(45deg)', flexShrink: 0 }} />
            </div>
          </motion.div>
        )}

        {/* Quick Stats Bar */}
        {!loading && characters.length > 0 && !isDM && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 14px', borderRadius: 99,
              background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.14)',
              fontFamily: 'var(--font-heading)', fontSize: 11, color: 'rgba(200,175,130,0.5)', letterSpacing: '0.04em',
            }}>
              <Users size={11} style={{ color: 'rgba(201,168,76,0.5)' }} />
              {characters.length} {characters.length === 1 ? 'Character' : 'Characters'}
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 14px', borderRadius: 99,
              background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.14)',
              fontFamily: 'var(--font-heading)', fontSize: 11, color: 'rgba(200,175,130,0.5)', letterSpacing: '0.04em',
            }}>
              Avg Lv {avgLevel}
            </div>
            {mostPlayedClass && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 14px', borderRadius: 99,
                background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.14)',
                fontFamily: 'var(--font-heading)', fontSize: 11, color: 'rgba(200,175,130,0.5)', letterSpacing: '0.04em',
              }}>
                {mostPlayedClass.name} <span style={{ color: 'rgba(200,175,130,0.3)' }}>x{mostPlayedClass.count}</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Character Search */}
        {!loading && characters.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ maxWidth: 400, margin: '0 auto 22px', position: 'relative' }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={14} style={{ position: 'absolute', left: 14, color: 'rgba(200,175,130,0.3)', pointerEvents: 'none' }} />
              <input
                type="text"
                value={charSearch}
                onChange={e => setCharSearch(e.target.value)}
                onKeyDown={e => { if (e.key === 'Escape') setCharSearch(''); }}
                placeholder={isDM ? 'Search campaigns...' : 'Search by name, race, or class...'}
                style={{
                  width: '100%', padding: '10px 38px 10px 38px', borderRadius: 10,
                  border: '1px solid rgba(201,168,76,0.16)', background: 'rgba(11,9,20,0.7)',
                  color: '#f0e4c8', fontFamily: 'var(--font-heading)', fontSize: 13,
                  letterSpacing: '0.03em', outline: 'none', transition: 'border-color 0.2s',
                  backdropFilter: 'blur(8px)',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.45)'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.16)'}
              />
              {charSearch && (
                <button
                  onClick={() => setCharSearch('')}
                  style={{ position: 'absolute', right: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(200,175,130,0.4)', padding: 4, display: 'flex', alignItems: 'center' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
            {charSearch.trim() && (
              <div style={{ textAlign: 'center', marginTop: 8, fontSize: 11, fontFamily: 'var(--font-heading)', color: 'rgba(200,175,130,0.3)', letterSpacing: '0.08em' }}>
                {filteredCharacters.length} {filteredCharacters.length === 1 ? 'result' : 'results'}
              </div>
            )}
          </motion.div>
        )}

        {/* Grid / states */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', fontSize: 14, fontFamily: 'var(--font-heading)', color: 'rgba(200,175,130,0.22)', letterSpacing: '0.15em' }}>
            Consulting the ancient texts…
          </div>
        ) : characters.length === 0 ? (
          <EmptyState onOpen={() => setShowCreate(true)} isDM={isDM} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 20 }}>
            {filteredCharacters.map((c, i) => isDM ? (
              <CampaignCard
                key={c.id} char={c} index={i}
                onEnter={id => navigate(`/character/${id}`)}
                onDelete={setDeleteTarget}
              />
            ) : (
              <CharacterCard
                key={c.id} char={c} index={i}
                onEnter={id => navigate(`/character/${id}`)}
                onDelete={setDeleteTarget}
                onDuplicate={handleDuplicate}
              />
            ))}
            {!charSearch.trim() && (
              <NewCharCard index={filteredCharacters.length} onClick={() => setShowCreate(true)} isDM={isDM} />
            )}
          </div>
        )}
      </div>

      {/* Mode badge + switch (top-right) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        style={{ position: 'fixed', top: 16, right: 16, zIndex: 20, display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 14px', borderRadius: 99,
          background: appMode === 'dm' ? 'rgba(155,89,182,0.1)' : 'rgba(201,168,76,0.08)',
          border: `1px solid ${appMode === 'dm' ? 'rgba(155,89,182,0.25)' : 'rgba(201,168,76,0.18)'}`,
          fontFamily: 'var(--font-heading)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: appMode === 'dm' ? 'rgba(155,89,182,0.7)' : 'rgba(201,168,76,0.55)',
        }}>
          <span>{appMode === 'dm' ? '📖' : '⚔'}</span>
          {appMode === 'dm' ? 'DM Mode' : 'Player Mode'}
        </div>
        <button
          onClick={clearMode}
          style={{
            padding: '5px 10px', borderRadius: 99, border: 'none', cursor: 'pointer',
            background: 'rgba(255,255,255,0.04)', color: 'rgba(200,175,130,0.3)',
            fontFamily: 'var(--font-heading)', fontSize: 9, letterSpacing: '0.08em',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'rgba(200,175,130,0.6)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(200,175,130,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
          title="Switch between DM and Player mode"
        >
          Switch
        </button>
      </motion.div>

      {/* Version */}
      <div style={{ position: 'fixed', bottom: 12, right: 16, zIndex: 20, fontFamily: 'var(--font-heading)', fontSize: 9, letterSpacing: '0.1em', color: 'rgba(200,175,130,0.18)' }}>
        {APP_VERSION}
      </div>

      {/* Bottom vignette */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 120, pointerEvents: 'none', zIndex: 5, background: 'linear-gradient(to top, var(--bg-deep) 0%, transparent 100%)' }} />

      {/* Modal */}
      <AnimatePresence>
        {showCreate && (isDM ? (
          <CreateCampaignModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />
        ) : (
          <CreateModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />
        ))}
      </AnimatePresence>

      {/* Delete confirm */}
      <ConfirmDialog
        show={!!deleteTarget}
        title={isDM ? 'Delete Campaign' : 'Remove from the Codex'}
        message={isDM
          ? `Permanently delete the campaign "${deleteTarget?.name}"? All session notes, NPCs, and quests will be lost.`
          : `Permanently remove ${deleteTarget?.name}? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
