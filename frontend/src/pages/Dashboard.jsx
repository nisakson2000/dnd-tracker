import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Heart, Shield, ArrowLeft,
  Library, ChevronRight, ChevronLeft, Scroll, Check, X,
  Search, Users, Upload, ClipboardList, Flag, FileJson,
  Sparkles, Coins, BookOpen, AlertTriangle, Moon,
  Clock, CheckCircle, XCircle, Zap, Save, Download, Dices,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { invoke } from '@tauri-apps/api/core';
import { listCharacters, createCharacter, deleteCharacter } from '../api/characters';
import { getJournalEntries, addJournalEntry } from '../api/journal';
import { getSpells, getSpellSlots } from '../api/spells';
import { getConditions } from '../api/combat';
import { getQuests, updateQuest } from '../api/quests';
import { getOverview, updateOverview } from '../api/overview';
import { getCurrency, updateCurrency } from '../api/inventory';
import { longRest } from '../api/rest';
import { RULESET_OPTIONS, getRuleset } from '../data/rulesets';
import ConfirmDialog from '../components/ConfirmDialog';
import DDBImportModal from '../components/DDBImportModal';
import { APP_VERSION } from '../version';
import { useAppMode } from '../contexts/ModeContext';
import { useUpdateCheck } from '../hooks/useUpdateCheck';
import { useOllamaAutoSetup } from '../hooks/useOllamaAutoSetup';

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

// ─── NPC & Encounter quick-gen data ─────────────────────────────────────────

const NPC_NAMES = ['Grim', 'Aldric', 'Seraphina', 'Thorne', 'Isolde', 'Bramwell', 'Lyra', 'Corwin', 'Elara', 'Magnus'];
const NPC_TRAITS = ['grumpy', 'jovial', 'suspicious', 'generous', 'mysterious', 'nervous', 'boisterous', 'quiet', 'cunning', 'noble'];
const NPC_ROLES = ['innkeeper', 'blacksmith', 'merchant', 'guard', 'scholar', 'thief', 'priest', 'farmer', 'noble', 'wanderer'];

const ENCOUNTER_HOOKS = [
  'A band of goblins ambush from the treeline',
  'An injured traveler stumbles out of the fog',
  'A merchant cart has been overturned, its guards missing',
  'Strange lights flicker in the abandoned watchtower',
  'A bridge troll demands a riddle contest for passage',
  'Wolves circle the campsite as night falls',
  'A mysterious stranger offers a map to buried treasure',
  'The road ahead is blocked by a fresh landslide',
  'Bandits disguised as pilgrims approach the party',
  'A dragon\'s shadow passes overhead, circling twice',
  'An old well emanates faint cries for help',
  'A courier rushes past, dropping a sealed letter',
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
  repeatDelay: Math.random() * 8 + 4,
}));

function RuneParticle({ x, y, sym, delay, dur, repeatDelay }) {
  return (
    <motion.span
      style={{
        position: 'absolute', left: `${x}%`, top: `${y}%`,
        fontFamily: 'serif', fontSize: 13, color: '#c9a84c',
        opacity: 0, pointerEvents: 'none', userSelect: 'none',
      }}
      animate={{ y: [0, -110], opacity: [0, 0.1, 0.065, 0] }}
      transition={{ delay, duration: dur, repeat: Infinity, repeatDelay, ease: 'linear' }}
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

// ─── XP thresholds (5e) ─────────────────────────────────────────────────────
const XP_LEVELS = [0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000];

// ─── Time ago helper ─────────────────────────────────────────────────────────
function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

// ─── Character card ──────────────────────────────────────────────────────────

function CharacterCard({ char, index, onEnter, onDelete, onSessionPrep, onEndSession }) {
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
            overflow: 'hidden',
          }}
        >
          {char.portrait_data ? (
            <img
              src={char.portrait_data}
              alt={char.name}
              style={{
                width: 58, height: 58, borderRadius: '50%',
                objectFit: 'cover', display: 'block',
              }}
            />
          ) : (
            char.name?.[0] || '?'
          )}
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

        {/* Subclass */}
        {char.primary_subclass && (
          <div style={{ fontSize: 11, fontStyle: 'italic', color: `${clsColor}88`, marginBottom: 2, letterSpacing: '0.02em' }}>
            {char.primary_subclass}
          </div>
        )}

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
            {char.speed > 0 && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 99,
                background: 'rgba(0,0,0,0.35)',
                border: '1px solid rgba(200,175,130,0.15)',
                fontSize: 12, color: 'rgba(200,175,130,0.55)',
              }}>
                <Zap size={9} style={{ color: 'rgba(200,175,130,0.6)' }} /> {char.speed} ft
              </span>
            )}
          </div>
        )}

        {/* Status indicators */}
        {(char.inspiration || char.exhaustion_level > 0 || char.temp_hp > 0) && (
          <div style={{ display: 'flex', gap: 5, marginBottom: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            {char.inspiration && (
              <span style={{ display: 'flex', alignItems: 'center', color: '#f1c40f' }}>
                <Sparkles size={10} />
              </span>
            )}
            {char.exhaustion_level > 0 && (
              <span style={{
                fontSize: 9, padding: '1px 5px', borderRadius: 99,
                background: 'rgba(243,156,18,0.15)', border: '1px solid rgba(243,156,18,0.3)',
                color: '#f39c12', fontFamily: 'var(--font-heading)', letterSpacing: '0.04em',
              }}>
                E{char.exhaustion_level}
              </span>
            )}
            {char.temp_hp > 0 && (
              <span style={{
                fontSize: 9, padding: '1px 5px', borderRadius: 99,
                background: 'rgba(52,152,219,0.15)', border: '1px solid rgba(52,152,219,0.3)',
                color: '#3498db', fontFamily: 'var(--font-heading)', letterSpacing: '0.04em',
              }}>
                +{char.temp_hp} temp
              </span>
            )}
          </div>
        )}

        {char.max_hp > 0 && <HpBar current={char.current_hp} max={char.max_hp} />}

        {/* XP progress bar */}
        {char.experience_points > 0 && char.level >= 1 && char.level < 20 && (() => {
          const currentXP = XP_LEVELS[char.level - 1] || 0;
          const nextXP = XP_LEVELS[char.level] || XP_LEVELS[19];
          const xpRange = nextXP - currentXP;
          const xpProgress = xpRange > 0 ? Math.max(0, Math.min(100, ((char.experience_points - currentXP) / xpRange) * 100)) : 0;
          return (
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                <span style={{ fontSize: 8, color: `${clsColor}55`, fontFamily: 'var(--font-heading)', letterSpacing: '0.06em' }}>XP</span>
              </div>
              <div style={{ width: '100%', height: 2, borderRadius: 99, background: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', borderRadius: 99, background: `${clsColor}55` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1.1, delay: 0.6 }}
                />
              </div>
            </div>
          );
        })()}

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
          {char.updated_at && (
            <span style={{
              display: 'flex', alignItems: 'center', gap: 3,
              fontSize: 9, color: 'rgba(200,175,130,0.3)',
              fontFamily: 'var(--font-heading)', letterSpacing: '0.04em',
              marginLeft: 6,
            }}>
              <Clock size={8} /> {timeAgo(char.updated_at)}
            </span>
          )}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <span style={{ fontSize: 12, fontFamily: 'var(--font-heading)', color: clsColor, display: 'flex', alignItems: 'center', gap: 3, letterSpacing: '0.05em' }}>
              Enter <ChevronRight size={12} />
            </span>
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
          {isDM ? 'Select Campaign' : 'New Character'}
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 12, color: hovered ? 'rgba(200,175,130,0.4)' : 'rgba(200,175,130,0.18)', transition: 'color 0.3s' }}>
          {isDM ? 'Pick a premade adventure' : 'Begin a new legend'}
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

// ─── Import character card ──────────────────────────────────────────────────

function ImportCharCard({ index, onImport }) {
  const [hovered, setHovered] = useState(false);
  const accent = 'rgba(52,152,219,';
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      let data;
      try { data = JSON.parse(text); } catch { throw new Error('File is not valid JSON'); }
      if (!data || typeof data !== 'object') throw new Error('Invalid character file format');
      onImport(data);
    } catch (err) {
      toast.error(`Import failed: ${err.message}`);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -6, borderColor: `${accent}0.4)`, background: `${accent}0.04)`, boxShadow: `0 14px 50px rgba(0,0,0,0.7), 0 0 30px ${accent}0.06)` }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => fileInputRef.current?.click()}
      style={{
        borderRadius: 14, minHeight: 240, cursor: 'pointer', position: 'relative', overflow: 'hidden',
        border: `1px dashed ${accent}0.18)`,
        background: 'rgba(11,9,20,0.45)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 12,
        boxShadow: '0 4px 30px rgba(0,0,0,0.4)',
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <motion.div
        animate={hovered ? { scale: 1.1, boxShadow: `0 0 20px ${accent}0.2), inset 0 0 12px ${accent}0.08)` } : { scale: 1, boxShadow: 'none' }}
        transition={{ type: 'spring', stiffness: 320 }}
        style={{
          width: 64, height: 64, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${accent}0.05)`,
          border: `1px dashed ${accent}0.3)`,
          fontSize: 22, color: `${accent}0.45)`,
        }}
      >
        <Upload size={22} />
      </motion.div>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: hovered ? 'rgba(100,180,230,0.7)' : 'rgba(100,180,230,0.38)', transition: 'color 0.3s' }}>
          Import Character
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 12, color: hovered ? 'rgba(100,180,230,0.4)' : 'rgba(100,180,230,0.18)', transition: 'color 0.3s' }}>
          From exported JSON file
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

// ─── D&D Beyond Import card ─────────────────────────────────────────────────

function DDBImportCard({ index, onClick }) {
  const [hovered, setHovered] = useState(false);
  const accent = 'rgba(59,130,246,';

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
        animate={hovered ? { scale: 1.1, boxShadow: `0 0 20px ${accent}0.2), inset 0 0 12px ${accent}0.08)` } : { scale: 1, boxShadow: 'none' }}
        transition={{ type: 'spring', stiffness: 320 }}
        style={{
          width: 64, height: 64, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${accent}0.05)`,
          border: `1px dashed ${accent}0.3)`,
          fontSize: 22, color: `${accent}0.45)`,
        }}
      >
        <FileJson size={22} />
      </motion.div>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: hovered ? 'rgba(96,165,250,0.7)' : 'rgba(96,165,250,0.38)', transition: 'color 0.3s' }}>
          D&D Beyond Import
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 12, color: hovered ? 'rgba(96,165,250,0.4)' : 'rgba(96,165,250,0.18)', transition: 'color 0.3s' }}>
          Import from D&D Beyond JSON
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

function CampaignCard({ char, index, onEnter, onDelete, onExport }) {
  const [hovered, setHovered] = useState(false);
  const isDraft = char.status === 'draft';
  const color = isDraft ? '#4ade80' : '#9b59b6';

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

        {/* Card actions (top-left on hover) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 4 }}
        >
          <button
            style={{
              border: 'none', cursor: 'pointer', width: 28, height: 28, borderRadius: 8,
              background: 'rgba(0,0,0,0.45)', color: 'rgba(200,175,130,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
            }}
            title="Export campaign"
            onMouseEnter={e => { e.currentTarget.style.color = '#c9a84c'; e.currentTarget.style.background = 'rgba(201,168,76,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(200,175,130,0.45)'; e.currentTarget.style.background = 'rgba(0,0,0,0.45)'; }}
            onClick={e => { e.stopPropagation(); onExport?.(char); }}
          >
            <Download size={12} />
          </button>
          <button
            style={{
              border: 'none', cursor: 'pointer', width: 28, height: 28, borderRadius: 8,
              background: 'rgba(0,0,0,0.45)', color: 'rgba(220,80,80,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
            }}
            title="Delete campaign"
            onMouseEnter={e => { e.currentTarget.style.color = '#e74c3c'; e.currentTarget.style.background = 'rgba(139,34,50,0.45)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(220,80,80,0.45)'; e.currentTarget.style.background = 'rgba(0,0,0,0.45)'; }}
            onClick={e => { e.stopPropagation(); onDelete(char); }}
          >
            <Trash2 size={12} />
          </button>
        </motion.div>

        {/* Status badge */}
        {isDraft && (
          <div style={{
            position: 'absolute', top: 8, right: 10,
            fontSize: 9, fontFamily: 'var(--font-heading)', letterSpacing: '0.08em',
            color: '#4ade80', background: 'rgba(74,222,128,0.12)',
            border: '1px solid rgba(74,222,128,0.3)',
            padding: '2px 8px', borderRadius: 99, textTransform: 'uppercase',
          }}>
            Building
          </div>
        )}
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
            {isDraft ? 'Continue Building' : 'Open'} <ChevronRight size={12} />
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

// ─── Bundled premade campaigns for DM creation flow ──────────────────────────
import goblinMine from '../data/campaigns/goblin-mine.json';
import cursedVillage from '../data/campaigns/cursed-village.json';
import dragonCoast from '../data/campaigns/dragon-coast.json';
import shadowAcademy from '../data/campaigns/shadow-academy.json';
import siegeOfIronhold from '../data/campaigns/siege-of-ironhold.json';
import feywildCrossing from '../data/campaigns/feywild-crossing.json';
import { fetchCommunityList, fetchAndParseAdventure, parse5etoolsAdventure } from '../data/campaignFetcher';

const STARTER_CAMPAIGNS = [
  // 5e 2014
  { ...goblinMine, ruleset: '5e-2014' },
  { ...cursedVillage, ruleset: '5e-2014' },
  { ...dragonCoast, ruleset: '5e-2014' },
  // 5e 2024
  { ...shadowAcademy, ruleset: '5e-2024' },
  { ...siegeOfIronhold, ruleset: '5e-2024' },
  { ...feywildCrossing, ruleset: '5e-2024' },
];

const PREMADE_LEVEL_COLORS = {
  '1-3': { bg: 'rgba(74,222,128,0.12)', text: '#4ade80', border: 'rgba(74,222,128,0.25)' },
  '1-4': { bg: 'rgba(74,222,128,0.12)', text: '#4ade80', border: 'rgba(74,222,128,0.25)' },
  '3-5': { bg: 'rgba(251,191,36,0.12)', text: '#fbbf24', border: 'rgba(251,191,36,0.25)' },
  '3-6': { bg: 'rgba(251,191,36,0.12)', text: '#fbbf24', border: 'rgba(251,191,36,0.25)' },
  '5-8': { bg: 'rgba(249,115,22,0.12)', text: '#fb923c', border: 'rgba(249,115,22,0.25)' },
};

// ─── Create Campaign Modal (DM mode — with premade/homebrew choice) ──────────

function CreateCampaignModal({ onClose, onCreate }) {
  const [dmName, setDmName] = useState(() => localStorage.getItem('codex-dm-name') || '');
  const [ruleset, setRuleset] = useState('5e-2014');
  const [busy, setBusy] = useState(false);
  const [selectedPremade, setSelectedPremade] = useState(null);
  const [expandedCampaign, setExpandedCampaign] = useState(null);
  const [starterOpen, setStarterOpen] = useState(true);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [localOpen, setLocalOpen] = useState(false);
  const [localCampaigns, setLocalCampaigns] = useState([]);
  const [communityList, setCommunityList] = useState([]);
  const [communityLoading, setCommunityLoading] = useState(false);
  const [communityError, setCommunityError] = useState(null);
  const [communitySearch, setCommunitySearch] = useState('');
  const [downloadingAdv, setDownloadingAdv] = useState(null);

  // Fetch community list on mount
  useEffect(() => {
    if (communityList.length === 0 && !communityLoading) {
      setCommunityLoading(true);
      fetchCommunityList()
        .then(list => setCommunityList(list))
        .catch(err => setCommunityError(err.message))
        .finally(() => setCommunityLoading(false));
    }
  }, []);

  // Load local (homebrew) campaigns for the Local Campaigns section
  useEffect(() => {
    (async () => {
      try {
        const chars = await invoke('list_characters');
        const homebrew = chars.filter(c => (c.campaign_type === 'homebrew' || (!c.campaign_type && !c.primary_class)) && c.status !== 'draft' && c.status !== 'archived');
        setLocalCampaigns(homebrew);
      } catch { /* ignore */ }
    })();
  }, []);

  const handleSelectCommunity = async (adv) => {
    if (downloadingAdv) return;
    setDownloadingAdv(adv.fileName);
    try {
      const data = await fetchAndParseAdventure(adv.downloadUrl);
      const parsed = parse5etoolsAdventure(data);
      if (parsed.npcs.length === 0 && parsed.quests.length === 0 && parsed.lore.length === 0) {
        toast('No importable data found in this adventure', { icon: '📭' });
        setDownloadingAdv(null);
        return;
      }
      // Convert parsed data to campaign format and select it
      setSelectedPremade({
        name: parsed.name || adv.name,
        description: `Community adventure imported from 5etools homebrew. Contains ${parsed.npcs.length} NPCs, ${parsed.quests.length} quests, and ${parsed.lore.length} lore entries.`,
        level: '?',
        npcs: parsed.npcs,
        quests: parsed.quests,
        lore: parsed.lore,
        journals: parsed.journals,
        tags: ['community'],
        _community: true,
        questCount: parsed.questCount,
        estimatedHours: parsed.estimatedHours,
        estimatedSessions: parsed.estimatedSessions,
      });
      toast.success(`"${parsed.name || adv.name}" loaded — ready to create!`);
    } catch (err) {
      toast.error(`Failed to download: ${err.message}`);
    } finally {
      setDownloadingAdv(null);
    }
  };

  // Filter starter campaigns by ruleset
  const filteredStarter = STARTER_CAMPAIGNS.filter(c => c.ruleset === ruleset);
  // Filter community by ruleset + search
  const filteredCommunity = communityList
    .filter(c => c.ruleset === ruleset)
    .filter(c => !communitySearch.trim() || c.name.toLowerCase().includes(communitySearch.toLowerCase()));

  const doCreate = async (premadeCampaign) => {
    const campaignName = premadeCampaign ? premadeCampaign.name : name.trim();
    if (busy || !campaignName) return;
    // Save DM name to localStorage for session use
    if (dmName.trim()) localStorage.setItem('codex-dm-name', dmName.trim());
    setBusy(true);
    try {
      await onCreate({ name: campaignName, ruleset, primaryClass: '', race: '', experience: 'experienced', premade: premadeCampaign || null });
    } finally { setBusy(false); }
  };

  const overlayStyle = { position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)' };
  const cardStyle = { maxWidth: '100%', borderRadius: 18, overflow: 'hidden', background: 'linear-gradient(160deg,#0d0b18 0%,#110e1e 100%)', border: '1px solid rgba(155,89,182,0.22)', boxShadow: '0 40px 100px rgba(0,0,0,0.85), 0 0 0 1px rgba(155,89,182,0.08)' };

  // ── Campaign picker (direct — no homebrew/premade choice) ──

  const renderCampaignItem = (c, key) => {
    const isSelected = selectedPremade?.name === c.name;
    const isExpanded = expandedCampaign === key;
    const levelColor = PREMADE_LEVEL_COLORS[c.level] || { bg: 'rgba(160,160,160,0.12)', text: '#aaa', border: 'rgba(160,160,160,0.25)' };
    return (
      <div key={key} style={{
        borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
        background: isSelected ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isSelected ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.06)'}`,
        transition: 'all 0.2s',
      }} onClick={() => setSelectedPremade(c)}>
        <div style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${isSelected ? '#c9a84c' : 'rgba(255,255,255,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {isSelected && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#c9a84c' }} />}
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 13, color: isSelected ? '#efe0c0' : 'var(--text)', fontWeight: 600, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
            {c.level && c.level !== '?' && <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: levelColor.bg, color: levelColor.text, border: `1px solid ${levelColor.border}`, flexShrink: 0 }}>Lv {c.level}</span>}
            <span style={{ fontSize: 9, color: 'var(--text-mute)', flexShrink: 0 }}>
              {c.npcs?.length || 0} NPCs · {c.quests?.length || 0} Quests · {c.lore?.length || 0} Lore
            </span>
          </div>
          <p style={{ fontSize: 10, color: 'rgba(200,175,130,0.4)', lineHeight: 1.5, margin: '0 0 0 22px' }}>
            {isExpanded ? c.description : (c.description?.length > 100 ? c.description.substring(0, 100) + '...' : c.description)}
          </p>
          {c.description && c.description.length > 100 && (
            <button onClick={e => { e.stopPropagation(); setExpandedCampaign(isExpanded ? null : key); }} style={{
              display: 'flex', alignItems: 'center', gap: 4, marginLeft: 22, marginTop: 4, padding: 0,
              background: 'none', border: 'none', color: 'rgba(201,168,76,0.5)', fontSize: 9, cursor: 'pointer', fontFamily: 'var(--font-ui)',
            }}>
              {isExpanded ? '▲ Less' : '▼ More details'}
            </button>
          )}
          {isExpanded && (c.npcs?.length > 0 || c.quests?.length > 0 || c.lore?.length > 0) && (
            <div style={{ marginLeft: 22, marginTop: 8, padding: '8px 10px', background: 'rgba(0,0,0,0.25)', borderRadius: 6, fontSize: 10, color: 'var(--text-dim)', lineHeight: 1.6 }}>
              {c.tags && <div style={{ marginBottom: 6, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                {c.tags.map(t => <span key={t} style={{ fontSize: 8, padding: '1px 5px', borderRadius: 3, background: 'rgba(255,255,255,0.05)', color: 'var(--text-mute)', border: '1px solid rgba(255,255,255,0.06)' }}>{t}</span>)}
              </div>}
              {(c.npcs?.length > 0) && <div style={{ marginBottom: 4 }}><strong style={{ color: '#c9a84c' }}>NPCs:</strong> {c.npcs.map(n => n.name).join(', ')}</div>}
              {(c.quests?.length > 0) && <div style={{ marginBottom: 4 }}><strong style={{ color: '#c9a84c' }}>Quests:</strong> {c.quests.map(q => q.title).join(', ')}</div>}
              {(c.lore?.length > 0) && <div><strong style={{ color: '#c9a84c' }}>Lore:</strong> {c.lore.map(l => l.title).join(', ')}</div>}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
      <motion.div style={overlayStyle} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={e => e.target === e.currentTarget && onClose()}>
        <motion.div initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 16 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          style={{ ...cardStyle, width: 580, maxHeight: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 3, background: 'linear-gradient(90deg,transparent,#c9a84c,transparent)' }} />
          <div style={{ padding: '20px 24px 14px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', color: '#efe0c0', fontSize: 18, margin: 0 }}>
                Select a Campaign
              </h4>
            </div>
            <p style={{ fontSize: 11, color: 'rgba(200,175,130,0.35)' }}>
              Choose an adventure to load with NPCs, quests, and lore ready to go.
            </p>

            {/* Ruleset selector */}
            <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
              {RULESET_OPTIONS.map(opt => {
                const sel = ruleset === opt.id;
                return (
                  <button key={opt.id} onClick={() => { setRuleset(opt.id); setSelectedPremade(null); }} style={{
                    flex: 1, padding: '7px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', textAlign: 'center',
                    background: sel ? 'rgba(155,89,182,0.1)' : 'rgba(255,255,255,0.03)',
                    outline: sel ? '1px solid rgba(155,89,182,0.38)' : '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 11, color: sel ? '#c084fc' : 'rgba(200,175,130,0.5)' }}>{opt.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable campaign list */}
          <div style={{ padding: '0 24px 16px', overflowY: 'auto', flex: 1 }}>

            {/* ── Starter Campaigns dropdown ── */}
            <button onClick={() => setStarterOpen(v => !v)} style={{
              display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '10px 0', border: 'none', background: 'none', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <span style={{ fontSize: 12, color: starterOpen ? '#c9a84c' : 'rgba(200,175,130,0.5)', transition: 'transform 0.2s', display: 'inline-block', transform: starterOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 700, color: '#c9a84c', letterSpacing: '0.08em' }}>
                Starter Campaigns
              </span>
              <span style={{ fontSize: 10, color: 'var(--text-mute)', marginLeft: 'auto' }}>{filteredStarter.length} available</span>
            </button>
            {starterOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '10px 0' }}>
                {filteredStarter.length === 0 ? (
                  <div style={{ padding: '16px', textAlign: 'center', fontSize: 11, color: 'var(--text-mute)' }}>
                    No starter campaigns for this ruleset yet.
                  </div>
                ) : filteredStarter.map(c => renderCampaignItem(c, `starter-${c.name}`))}
              </div>
            )}

            {/* ── Community Campaigns dropdown ── */}
            <button onClick={() => setCommunityOpen(v => !v)} style={{
              display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '10px 0', border: 'none', background: 'none', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <span style={{ fontSize: 12, color: communityOpen ? '#a78bfa' : 'rgba(200,175,130,0.5)', transition: 'transform 0.2s', display: 'inline-block', transform: communityOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 700, color: '#a78bfa', letterSpacing: '0.08em' }}>
                Community Campaigns
              </span>
              <span style={{ fontSize: 10, color: 'var(--text-mute)', marginLeft: 'auto' }}>
                {communityLoading ? 'loading...' : `${filteredCommunity.length} available`}
              </span>
            </button>
            {communityOpen && (
              <div style={{ padding: '10px 0' }}>
                {communityLoading && (
                  <div style={{ padding: '20px', textAlign: 'center', fontSize: 11, color: 'var(--text-mute)' }}>
                    Fetching community adventures from GitHub...
                  </div>
                )}
                {communityError && (
                  <div style={{ padding: '14px', textAlign: 'center', fontSize: 11, color: '#fb923c' }}>
                    Failed to load: {communityError}
                    <button onClick={() => {
                      setCommunityError(null);
                      setCommunityLoading(true);
                      fetchCommunityList().then(l => setCommunityList(l)).catch(e => setCommunityError(e.message)).finally(() => setCommunityLoading(false));
                    }} style={{ display: 'block', margin: '8px auto 0', padding: '4px 12px', borderRadius: 6, border: '1px solid rgba(249,115,22,0.3)', background: 'rgba(249,115,22,0.08)', color: '#fb923c', fontSize: 10, cursor: 'pointer' }}>
                      Retry
                    </button>
                  </div>
                )}
                {!communityLoading && !communityError && (
                  <>
                    {/* Search within community */}
                    <input
                      placeholder="Search community campaigns..."
                      value={communitySearch}
                      onChange={e => setCommunitySearch(e.target.value)}
                      style={{
                        width: '100%', padding: '7px 12px', borderRadius: 8, marginBottom: 8,
                        border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.3)',
                        color: 'var(--text)', fontSize: 11, fontFamily: 'var(--font-ui)', outline: 'none',
                      }}
                      onFocus={e => e.target.style.borderColor = 'rgba(167,139,250,0.4)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 280, overflowY: 'auto' }}>
                      {filteredCommunity.length === 0 ? (
                        <div style={{ padding: '16px', textAlign: 'center', fontSize: 11, color: 'var(--text-mute)' }}>
                          {communitySearch ? 'No matches.' : 'No community campaigns for this ruleset.'}
                        </div>
                      ) : filteredCommunity.map(adv => {
                        const isSelected = selectedPremade?.name === adv.name && selectedPremade?._community;
                        const isDownloading = downloadingAdv === adv.fileName;
                        return (
                          <div key={adv.fileName} style={{
                            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8,
                            background: isSelected ? 'rgba(167,139,250,0.08)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${isSelected ? 'rgba(167,139,250,0.35)' : 'rgba(255,255,255,0.05)'}`,
                            cursor: isDownloading ? 'wait' : 'pointer', transition: 'all 0.15s',
                          }} onClick={() => !isDownloading && handleSelectCommunity(adv)}>
                            <div style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${isSelected ? '#a78bfa' : 'rgba(255,255,255,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {isSelected && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#a78bfa' }} />}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ fontFamily: 'var(--font-heading)', fontSize: 12, color: isSelected ? '#e0d4f7' : 'var(--text)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {adv.name}
                                </span>
                                {adv.size && <span style={{ fontSize: 8, color: 'var(--text-mute)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{Math.round(adv.size / 1024)}KB</span>}
                              </div>
                              {adv.author && <div style={{ fontSize: 9, color: 'rgba(167,139,250,0.5)', marginTop: 1 }}>by {adv.author}</div>}
                              <div style={{ fontSize: 9, color: 'var(--text-mute)', marginTop: 2, lineHeight: 1.4 }}>
                                {adv.description}
                              </div>
                              {(adv.estQuestCount || adv.estTime) && (
                                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                                  {adv.estQuestCount && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 8, fontFamily: 'var(--font-mono)', padding: '1px 6px', borderRadius: 4, background: 'rgba(167,139,250,0.08)', color: 'rgba(167,139,250,0.7)', border: '1px solid rgba(167,139,250,0.15)' }}>
                                      <Scroll size={8} /> ~{adv.estQuestCount} Quests
                                    </span>
                                  )}
                                  {adv.estTime && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 8, fontFamily: 'var(--font-mono)', padding: '1px 6px', borderRadius: 4, background: 'rgba(201,168,76,0.08)', color: 'rgba(201,168,76,0.6)', border: '1px solid rgba(201,168,76,0.15)' }}>
                                      <Clock size={8} /> ~{adv.estTime}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            {isDownloading && <span style={{ fontSize: 9, color: '#a78bfa', fontFamily: 'var(--font-ui)', flexShrink: 0 }}>Downloading...</span>}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── Local Campaigns dropdown ── */}
            <button onClick={() => setLocalOpen(v => !v)} style={{
              display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '10px 0', border: 'none', background: 'none', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <span style={{ fontSize: 12, color: localOpen ? '#4ade80' : 'rgba(200,175,130,0.5)', transition: 'transform 0.2s', display: 'inline-block', transform: localOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 700, color: '#4ade80', letterSpacing: '0.08em' }}>
                Local Campaigns
              </span>
              <span style={{ fontSize: 10, color: 'var(--text-mute)', marginLeft: 'auto' }}>{localCampaigns.length} saved</span>
            </button>
            {localOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '10px 0' }}>
                {localCampaigns.length === 0 ? (
                  <div style={{ padding: '16px', textAlign: 'center', fontSize: 11, color: 'var(--text-mute)' }}>
                    No homebrew campaigns yet. Use "Create Campaign" to build one from scratch.
                  </div>
                ) : localCampaigns.map(c => (
                  <div key={c.id} style={{
                    borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(74,222,128,0.15)',
                    transition: 'all 0.2s', padding: '12px 14px',
                  }}
                    onClick={() => onClose()}
                    onDoubleClick={() => { onClose(); /* navigate handled by parent */ }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: 13, color: 'var(--text)', fontWeight: 600, flex: 1 }}>{c.name}</span>
                      <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: 'rgba(74,222,128,0.08)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)', fontFamily: 'var(--font-mono)' }}>Homebrew</span>
                    </div>
                    <p style={{ fontSize: 10, color: 'rgba(200,175,130,0.4)', lineHeight: 1.5, margin: '4px 0 0' }}>
                      Click to open this campaign from the dashboard.
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected campaign preview */}
          {selectedPremade && (
            <div style={{ padding: '0 24px 10px', flexShrink: 0 }}>
              <div style={{ padding: '10px 14px', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: '#c9a84c', fontFamily: 'var(--font-heading)', fontWeight: 600, marginBottom: 2 }}>
                  Selected: {selectedPremade.name}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-mute)' }}>
                  {selectedPremade.npcs?.length || 0} NPCs, {selectedPremade.quests?.length || 0} quests, {selectedPremade.lore?.length || 0} lore entries will be imported
                </div>
                {(selectedPremade.questCount != null || selectedPremade.estimatedHours) && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                    {selectedPremade.questCount != null && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 9, fontFamily: 'var(--font-mono)', padding: '2px 7px', borderRadius: 4, background: 'rgba(167,139,250,0.08)', color: 'rgba(167,139,250,0.7)', border: '1px solid rgba(167,139,250,0.15)' }}>
                        <Scroll size={9} /> {selectedPremade.questCount} Quests
                      </span>
                    )}
                    {selectedPremade.estimatedHours && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 9, fontFamily: 'var(--font-mono)', padding: '2px 7px', borderRadius: 4, background: 'rgba(201,168,76,0.08)', color: 'rgba(201,168,76,0.6)', border: '1px solid rgba(201,168,76,0.15)' }}>
                        <Clock size={9} /> ~{selectedPremade.estimatedHours} hrs
                      </span>
                    )}
                    {selectedPremade.estimatedSessions != null && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 9, fontFamily: 'var(--font-mono)', padding: '2px 7px', borderRadius: 4, background: 'rgba(74,222,128,0.08)', color: 'rgba(74,222,128,0.6)', border: '1px solid rgba(74,222,128,0.15)' }}>
                        ~{selectedPremade.estimatedSessions} sessions
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DM Name + action bar */}
          <div style={{ padding: '8px 24px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 9, fontFamily: 'var(--font-heading)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(200,175,130,0.35)', whiteSpace: 'nowrap' }}>DM Name</span>
              <input
                value={dmName}
                onChange={e => setDmName(e.target.value)}
                placeholder="Your name…"
                maxLength={40}
                style={{
                  flex: 1, padding: '7px 12px', borderRadius: 7,
                  background: 'rgba(8,6,16,0.9)', border: '1px solid rgba(201,168,76,0.2)',
                  color: '#f0e4c8', fontFamily: 'var(--font-heading)', fontSize: 12,
                  letterSpacing: '0.03em', outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'}
              />
            </div>
          </div>
          <div style={{ padding: '4px 24px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'rgba(200,175,130,0.38)', fontFamily: 'var(--font-heading)', fontSize: 12 }}>
              Cancel
            </button>
            <motion.button
              onClick={() => selectedPremade && doCreate(selectedPremade)}
              disabled={busy || !selectedPremade}
              whileHover={selectedPremade ? { y: -2, boxShadow: '0 5px 18px rgba(201,168,76,0.3)' } : {}}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '10px 24px', borderRadius: 9, border: 'none',
                cursor: selectedPremade && !busy ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-heading)', fontSize: 12, letterSpacing: '0.08em', fontWeight: 700,
                background: selectedPremade ? 'linear-gradient(135deg,#b8860b,#c9a84c)' : 'rgba(201,168,76,0.15)',
                color: selectedPremade ? '#fff' : 'rgba(201,168,76,0.4)',
                opacity: busy ? 0.6 : selectedPremade ? 1 : 0.5,
              }}
            >
              {busy ? 'Creating…' : <><Scroll size={13} /> Create &amp; Load Campaign</>}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
}

// ─── Create Homebrew Campaign Modal ─────────────────────────────────────────

function CreateHomebrewModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [dmName, setDmName] = useState(() => localStorage.getItem('codex-dm-name') || '');
  const [ruleset, setRuleset] = useState('5e-2014');
  const [busy, setBusy] = useState(false);
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);

  const doCreate = async () => {
    if (busy || !name.trim()) return;
    if (dmName.trim()) localStorage.setItem('codex-dm-name', dmName.trim());
    setBusy(true);
    try {
      await onCreate({ name: name.trim(), ruleset, primaryClass: '', race: '', experience: 'experienced', premade: null, draft: true });
    } finally { setBusy(false); }
  };

  const overlayStyle = { position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)' };
  const cardStyle = { maxWidth: '100%', borderRadius: 18, overflow: 'hidden', background: 'linear-gradient(160deg,#0d0b18 0%,#110e1e 100%)', border: '1px solid rgba(74,222,128,0.22)', boxShadow: '0 40px 100px rgba(0,0,0,0.85), 0 0 0 1px rgba(74,222,128,0.08)' };

  return (
    <motion.div
      style={overlayStyle}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 16 }}
        transition={{ type: 'spring', damping: 24, stiffness: 300 }}
        style={{ ...cardStyle, width: 420 }}
      >
        <div style={{ height: 3, background: 'linear-gradient(90deg,transparent,#4ade80,transparent)' }} />
        <div style={{ padding: '24px 24px 28px' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 30, marginBottom: 8 }}>🛠️</div>
            <h4 style={{ fontFamily: 'var(--font-heading)', color: '#efe0c0', fontSize: 20, margin: '0 0 4px' }}>
              Create Campaign
            </h4>
            <p style={{ fontSize: 13, color: 'rgba(200,175,130,0.38)' }}>
              Build your own world from scratch with NPCs, quests, and lore.
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
              background: 'rgba(8,6,16,0.9)', border: '1px solid rgba(74,222,128,0.28)',
              color: '#f0e4c8', fontFamily: 'var(--font-heading)', fontSize: 16,
              letterSpacing: '0.05em', textAlign: 'center', outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(74,222,128,0.65)'}
            onBlur={e => e.target.style.borderColor = 'rgba(74,222,128,0.28)'}
          />

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 9, fontFamily: 'var(--font-heading)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(200,175,130,0.35)', marginBottom: 8 }}>Your Name (Dungeon Master)</div>
            <input
              value={dmName}
              onChange={e => setDmName(e.target.value)}
              placeholder="e.g. Matt, DM Sarah…"
              maxLength={40}
              style={{
                width: '100%', padding: '11px 16px', borderRadius: 10,
                background: 'rgba(8,6,16,0.9)', border: '1px solid rgba(201,168,76,0.25)',
                color: '#f0e4c8', fontFamily: 'var(--font-heading)', fontSize: 14,
                letterSpacing: '0.03em', textAlign: 'center', outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.55)'}
              onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.25)'}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 9, fontFamily: 'var(--font-heading)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(200,175,130,0.35)', marginBottom: 8 }}>Ruleset</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {RULESET_OPTIONS.map(opt => {
                const sel = ruleset === opt.id;
                return (
                  <button key={opt.id} onClick={() => setRuleset(opt.id)} style={{
                    flex: 1, padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', textAlign: 'center',
                    background: sel ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.03)',
                    outline: sel ? '1px solid rgba(74,222,128,0.38)' : '1px solid rgba(255,255,255,0.06)',
                    transition: 'all 0.2s',
                  }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 12, color: sel ? '#4ade80' : 'rgba(200,175,130,0.5)', letterSpacing: '0.03em' }}>{opt.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Campaign Completion Checklist */}
          <div style={{
            marginBottom: 18, padding: '14px 16px', borderRadius: 10,
            background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(74,222,128,0.12)',
          }}>
            <div style={{ fontSize: 9, fontFamily: 'var(--font-heading)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(74,222,128,0.5)', marginBottom: 10 }}>
              What makes a complete campaign
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {[
                { icon: Users, label: 'NPCs', desc: 'Characters that populate your world', required: true },
                { icon: Flag, label: 'Quests', desc: 'Plot threads and objectives for players', required: true },
                { icon: BookOpen, label: 'Lore & Locations', desc: 'World history, factions, and places', required: true },
                { icon: Sparkles, label: 'Encounters', desc: 'Combat encounters with monsters', required: false },
                { icon: ClipboardList, label: 'Session Notes', desc: 'Document sessions as you play', required: false },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    background: item.required ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${item.required ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.06)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <item.icon size={11} style={{ color: item.required ? '#4ade80' : 'rgba(255,255,255,0.25)' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{item.label}</span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginLeft: 6 }}>{item.desc}</span>
                  </div>
                  {item.required && (
                    <span style={{ fontSize: 8, fontFamily: 'var(--font-heading)', letterSpacing: '0.1em', color: '#4ade80', opacity: 0.5, textTransform: 'uppercase' }}>Required</span>
                  )}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(200,175,130,0.3)', marginTop: 10, lineHeight: 1.5 }}>
              You'll need at least 1 NPC, 1 Quest, and 1 Lore entry before you can publish your campaign.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'rgba(200,175,130,0.38)', fontFamily: 'var(--font-heading)', fontSize: 12, letterSpacing: '0.05em' }}>
              Cancel
            </button>
            <motion.button
              onClick={doCreate}
              disabled={busy || !name.trim()}
              whileHover={name.trim() ? { y: -2, boxShadow: '0 5px 18px rgba(74,222,128,0.3)' } : {}}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '10px 24px', borderRadius: 9, border: 'none',
                cursor: name.trim() && !busy ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-heading)', fontSize: 12, letterSpacing: '0.08em', fontWeight: 700,
                background: name.trim() ? 'linear-gradient(135deg,#16a34a,#4ade80)' : 'rgba(74,222,128,0.15)',
                color: name.trim() ? '#fff' : 'rgba(74,222,128,0.4)',
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

function EmptyState({ onOpen, onImport, onDDBImport, isDM, onCreateHomebrew, onImportCampaign }) {
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      let data;
      try { data = JSON.parse(text); } catch { throw new Error('File is not valid JSON'); }
      if (!data || typeof data !== 'object') throw new Error('Invalid character file format');
      onImport(data);
    } catch (err) {
      toast.error(`Import failed: ${err.message}`);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      style={{ textAlign: 'center', padding: '64px 32px' }}
    >
      <div style={{ fontSize: 70, opacity: 0.1, marginBottom: 20, lineHeight: 1, fontFamily: 'var(--font-heading)' }}>{isDM ? '📖' : '⚔'}</div>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: 'rgba(200,175,130,0.5)', marginBottom: 10 }}>
        {isDM ? 'No Campaigns Yet' : 'The Codex Awaits'}
      </h3>
      <p style={{ fontSize: 15, color: 'rgba(200,175,130,0.27)', maxWidth: 380, margin: '0 auto 32px', lineHeight: 1.75 }}>
        {isDM
          ? 'Select a premade adventure, create your own homebrew campaign, or import an existing one.'
          : 'No adventurers have been recorded yet. Create your first character or import an existing one.'}
      </p>
      {isDM ? (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <motion.button
            onClick={onOpen}
            whileHover={{ y: -2, boxShadow: '0 8px 28px rgba(155,89,182,0.3)' }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '12px 32px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-heading)', fontSize: 13, letterSpacing: '0.08em', fontWeight: 700, background: 'linear-gradient(135deg,#9b59b6,#c084fc)', color: '#fff' }}
          >
            <Scroll size={16} /> Select Campaign
          </motion.button>
          <motion.button
            onClick={onCreateHomebrew}
            whileHover={{ y: -2, boxShadow: '0 8px 28px rgba(74,222,128,0.25)' }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '12px 32px', borderRadius: 10, border: '1px solid rgba(74,222,128,0.3)', cursor: 'pointer', fontFamily: 'var(--font-heading)', fontSize: 13, letterSpacing: '0.08em', fontWeight: 700, background: 'rgba(74,222,128,0.1)', color: 'rgba(74,222,128,0.85)' }}
          >
            <Plus size={16} /> Create Campaign
          </motion.button>
          <motion.button
            onClick={onImportCampaign}
            whileHover={{ y: -2, boxShadow: '0 8px 28px rgba(96,165,250,0.25)' }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '12px 32px', borderRadius: 10, border: '1px solid rgba(96,165,250,0.3)', cursor: 'pointer', fontFamily: 'var(--font-heading)', fontSize: 13, letterSpacing: '0.08em', fontWeight: 700, background: 'rgba(96,165,250,0.1)', color: 'rgba(96,165,250,0.85)' }}
          >
            <Upload size={16} /> Import Campaign
          </motion.button>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <motion.button
            onClick={onOpen}
            whileHover={{ y: -2, boxShadow: '0 8px 28px rgba(201,168,76,0.3)' }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '12px 32px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-heading)', fontSize: 13, letterSpacing: '0.08em', fontWeight: 700, background: 'linear-gradient(135deg,#c9a84c,#f0d878)', color: '#12101c' }}
          >
            <Scroll size={16} /> Create New Character
          </motion.button>
          <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileSelect} style={{ display: 'none' }} />
          <motion.button
            onClick={() => fileInputRef.current?.click()}
            whileHover={{ y: -2, boxShadow: '0 8px 28px rgba(52,152,219,0.25)' }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '12px 32px', borderRadius: 10, border: '1px solid rgba(52,152,219,0.3)', cursor: 'pointer', fontFamily: 'var(--font-heading)', fontSize: 13, letterSpacing: '0.08em', fontWeight: 700, background: 'rgba(52,152,219,0.1)', color: 'rgba(100,180,230,0.85)' }}
          >
            <Upload size={16} /> Import Existing Character
          </motion.button>
          <motion.button
            onClick={onDDBImport}
            whileHover={{ y: -2, boxShadow: '0 8px 28px rgba(59,130,246,0.25)' }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '12px 32px', borderRadius: 10, border: '1px solid rgba(59,130,246,0.3)', cursor: 'pointer', fontFamily: 'var(--font-heading)', fontSize: 13, letterSpacing: '0.08em', fontWeight: 700, background: 'rgba(59,130,246,0.1)', color: 'rgba(96,165,250,0.85)' }}
          >
            <FileJson size={16} /> D&D Beyond Import
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

// ─── Session Prep Modal ───────────────────────────────────────────────────────

function SessionPrepModal({ characterId, characterName, onClose, navigate }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    journal: null,
    hp: { current: 0, max: 0 },
    slots: [],
    conditions: [],
    quests: [],
    currency: { gp: 0 },
    preparedCount: 0,
  });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [journalEntries, overview, slotData, condData, questData, currData, spellData] = await Promise.all([
          getJournalEntries(characterId).catch(() => []),
          getOverview(characterId).catch(() => ({})),
          getSpellSlots(characterId).catch(() => []),
          getConditions(characterId).catch(() => []),
          getQuests(characterId).catch(() => []),
          getCurrency(characterId).catch(() => ({ gp: 0 })),
          getSpells(characterId).catch(() => []),
        ]);
        if (cancelled) return;

        const sorted = (journalEntries || []).sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
        const latest = sorted[0] || null;

        setData({
          journal: latest,
          hp: { current: overview.current_hp || 0, max: overview.max_hp || 0 },
          slots: slotData || [],
          conditions: (condData || []).filter(c => c.active),
          quests: (questData || []).filter(q => q.status === 'active'),
          currency: currData || { gp: 0 },
          preparedCount: (spellData || []).filter(s => s.level > 0 && (s.prepared || s.always_prepared)).length,
        });
      } catch {
        toast.error('Failed to load session prep data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [characterId]);

  const hpFull = data.hp.max > 0 && data.hp.current >= data.hp.max;
  const totalSlots = data.slots.reduce((s, sl) => s + (sl.max_slots || 0), 0);
  const usedSlots = data.slots.reduce((s, sl) => s + (sl.used_slots || 0), 0);
  const remainingSlots = totalSlots - usedSlots;
  const slotsFull = totalSlots > 0 && usedSlots === 0;
  const hasConditions = data.conditions.length > 0;

  const items = [
    {
      label: 'Last Session Recap',
      icon: <BookOpen size={15} />,
      ok: !!data.journal,
      content: data.journal
        ? <>
            <div style={{ fontWeight: 600, color: '#f0e4c8', fontSize: 13, marginBottom: 2 }}>{data.journal.title || 'Untitled Entry'}</div>
            <div style={{ fontSize: 11, color: 'rgba(200,175,130,0.5)', lineHeight: 1.5, maxHeight: 36, overflow: 'hidden' }}>
              {(data.journal.content || '').split('\n').slice(0, 2).join(' ')}
            </div>
          </>
        : <span style={{ color: 'rgba(200,175,130,0.4)', fontStyle: 'italic' }}>No journal entries yet</span>,
      nav: () => { onClose(); navigate(`/character/${characterId}`, { state: { section: 'journal' } }); },
    },
    {
      label: 'HP Check',
      icon: <Heart size={15} />,
      ok: hpFull,
      warn: !hpFull && data.hp.max > 0,
      content: data.hp.max > 0
        ? <>
            <span style={{ fontSize: 16, fontWeight: 700, color: hpFull ? '#27ae60' : '#f39c12' }}>{data.hp.current}</span>
            <span style={{ color: 'rgba(200,175,130,0.4)' }}> / {data.hp.max} HP</span>
            {!hpFull && <div style={{ fontSize: 11, color: '#f39c12', marginTop: 2 }}>Did you forget to long rest?</div>}
          </>
        : <span style={{ color: 'rgba(200,175,130,0.4)', fontStyle: 'italic' }}>HP not set</span>,
      nav: () => { onClose(); navigate(`/character/${characterId}`, { state: { section: 'overview' } }); },
    },
    {
      label: 'Spell Slots',
      icon: <Sparkles size={15} />,
      ok: slotsFull || totalSlots === 0,
      warn: totalSlots > 0 && !slotsFull,
      content: totalSlots > 0
        ? <>
            <span style={{ fontSize: 16, fontWeight: 700, color: slotsFull ? '#27ae60' : '#f39c12' }}>{remainingSlots}</span>
            <span style={{ color: 'rgba(200,175,130,0.4)' }}> / {totalSlots} remaining</span>
            {!slotsFull && <div style={{ fontSize: 11, color: '#f39c12', marginTop: 2 }}>Some spell slots are spent</div>}
          </>
        : <span style={{ color: 'rgba(200,175,130,0.4)', fontStyle: 'italic' }}>No spell slots</span>,
      nav: () => { onClose(); navigate(`/character/${characterId}`, { state: { section: 'spellbook' } }); },
    },
    {
      label: 'Active Conditions',
      icon: <AlertTriangle size={15} />,
      ok: !hasConditions,
      warn: hasConditions,
      content: hasConditions
        ? <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {data.conditions.map((c, i) => (
                <span key={i} style={{ padding: '2px 8px', borderRadius: 99, fontSize: 11, background: 'rgba(231,76,60,0.12)', border: '1px solid rgba(231,76,60,0.25)', color: '#e74c3c' }}>{c.name}</span>
              ))}
            </div>
            <div style={{ fontSize: 11, color: '#f39c12', marginTop: 4 }}>Clear conditions before starting?</div>
          </>
        : <span style={{ color: '#27ae60', fontSize: 12 }}>No active conditions</span>,
      nav: () => { onClose(); navigate(`/character/${characterId}`, { state: { section: 'combat' } }); },
    },
    {
      label: 'Active Quests',
      icon: <Flag size={15} />,
      ok: true,
      content: data.quests.length > 0
        ? <>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#c9a84c' }}>{data.quests.length}</span>
            <span style={{ color: 'rgba(200,175,130,0.4)' }}> active {data.quests.length === 1 ? 'quest' : 'quests'}</span>
            <div style={{ fontSize: 11, color: 'rgba(200,175,130,0.35)', marginTop: 2, maxHeight: 32, overflow: 'hidden' }}>
              {data.quests.slice(0, 3).map(q => q.title || 'Untitled').join(', ')}
              {data.quests.length > 3 && ` +${data.quests.length - 3} more`}
            </div>
          </>
        : <span style={{ color: 'rgba(200,175,130,0.4)', fontStyle: 'italic' }}>No active quests</span>,
      nav: () => { onClose(); navigate(`/character/${characterId}`, { state: { section: 'quests' } }); },
    },
    {
      label: 'Gold',
      icon: <Coins size={15} />,
      ok: true,
      content: <>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#c9a84c' }}>{data.currency.gp || 0}</span>
        <span style={{ color: 'rgba(200,175,130,0.4)' }}> GP</span>
      </>,
      nav: () => { onClose(); navigate(`/character/${characterId}`, { state: { section: 'inventory' } }); },
    },
    {
      label: 'Prepared Spells',
      icon: <Zap size={15} />,
      ok: true,
      content: <>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#c9a84c' }}>{data.preparedCount}</span>
        <span style={{ color: 'rgba(200,175,130,0.4)' }}> spells prepared</span>
      </>,
      nav: () => { onClose(); navigate(`/character/${characterId}`, { state: { section: 'spellbook' } }); },
    },
  ];

  return (
    <motion.div
      style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 16 }}
        transition={{ type: 'spring', damping: 24, stiffness: 300 }}
        style={{ width: 520, maxWidth: '100%', maxHeight: '85vh', borderRadius: 18, overflow: 'hidden', background: 'linear-gradient(160deg,#0d0b18 0%,#110e1e 100%)', border: '1px solid rgba(39,174,96,0.22)', boxShadow: '0 40px 100px rgba(0,0,0,0.85), 0 0 0 1px rgba(39,174,96,0.08)' }}
      >
        <div style={{ height: 3, background: 'linear-gradient(90deg,transparent,#27ae60,transparent)' }} />

        <div style={{ padding: '20px 24px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ClipboardList size={18} style={{ color: '#27ae60' }} />
              <h3 style={{ fontFamily: 'var(--font-heading)', color: '#efe0c0', fontSize: 18, margin: 0 }}>Session Prep</h3>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(200,175,130,0.35)', marginTop: 4, fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>{characterName}</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.04)', color: 'rgba(200,175,130,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={15} />
          </button>
        </div>

        <div style={{ padding: '8px 24px 24px', overflowY: 'auto', maxHeight: 'calc(85vh - 80px)' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', fontSize: 13, fontFamily: 'var(--font-heading)', color: 'rgba(200,175,130,0.3)', letterSpacing: '0.1em' }}>
              Reviewing your grimoire...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ background: 'rgba(255,255,255,0.04)', borderColor: item.warn ? 'rgba(243,156,18,0.35)' : 'rgba(39,174,96,0.3)' }}
                  onClick={item.nav}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                    background: 'rgba(255,255,255,0.02)', border: `1px solid ${item.warn ? 'rgba(243,156,18,0.2)' : 'rgba(255,255,255,0.06)'}`,
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: item.warn ? 'rgba(243,156,18,0.12)' : item.ok ? 'rgba(39,174,96,0.12)' : 'rgba(201,168,76,0.08)',
                    border: `1px solid ${item.warn ? 'rgba(243,156,18,0.3)' : item.ok ? 'rgba(39,174,96,0.3)' : 'rgba(201,168,76,0.2)'}`,
                    color: item.warn ? '#f39c12' : item.ok ? '#27ae60' : 'rgba(201,168,76,0.5)',
                  }}>
                    {item.warn ? <AlertTriangle size={13} /> : item.ok ? <Check size={13} /> : item.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, fontFamily: 'var(--font-heading)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(200,175,130,0.4)', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 13, color: 'rgba(200,175,130,0.7)' }}>{item.content}</div>
                  </div>
                  <ChevronRight size={14} style={{ color: 'rgba(200,175,130,0.2)', flexShrink: 0, marginTop: 8 }} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Post-Session Modal ──────────────────────────────────────────────────────

function PostSessionModal({ characterId, characterName, onClose }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [xpGained, setXpGained] = useState('');
  const [goldChange, setGoldChange] = useState('');
  const [journalText, setJournalText] = useState('');
  const [quests, setQuests] = useState([]);
  const [questUpdates, setQuestUpdates] = useState({});
  const [takeLongRest, setTakeLongRest] = useState(false);
  const [overview, setOverview] = useState({});
  const [currency, setCurrency] = useState({ gp: 0 });

  const sessionStart = localStorage.getItem('codex_session_start');
  const sessionDuration = sessionStart ? Math.round((Date.now() - Number(sessionStart)) / 60000) : null;

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [ov, curr, questData] = await Promise.all([
          getOverview(characterId).catch(() => ({})),
          getCurrency(characterId).catch(() => ({ gp: 0 })),
          getQuests(characterId).catch(() => []),
        ]);
        if (cancelled) return;
        setOverview(ov || {});
        setCurrency(curr || { gp: 0 });
        setQuests((questData || []).filter(q => q.status === 'active'));
      } catch {
        toast.error('Failed to load session data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [characterId]);

  const toggleQuest = (questId, status) => {
    setQuestUpdates(prev => {
      const copy = { ...prev };
      if (copy[questId] === status) delete copy[questId];
      else copy[questId] = status;
      return copy;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const promises = [];

      // XP
      const xpNum = Number(xpGained);
      if (xpNum > 0) {
        const newXP = (overview.experience_points || 0) + xpNum;
        promises.push(updateOverview(characterId, { ...overview, experience_points: newXP }));
      }

      // Gold
      const goldNum = Number(goldChange);
      if (goldNum !== 0 && !isNaN(goldNum)) {
        const newGP = Math.max(0, (currency.gp || 0) + goldNum);
        promises.push(updateCurrency(characterId, { ...currency, gp: newGP }));
      }

      // Journal
      if (journalText.trim()) {
        const today = new Date().toISOString().split('T')[0];
        const durationNote = sessionDuration ? ` (${Math.floor(sessionDuration / 60)}h ${sessionDuration % 60}m session)` : '';
        promises.push(addJournalEntry(characterId, {
          title: `Session Notes — ${today}${durationNote}`,
          content: journalText.trim(),
        }));
      }

      // Quest updates
      for (const [questId, status] of Object.entries(questUpdates)) {
        const quest = quests.find(q => q.id === questId);
        if (quest) {
          promises.push(updateQuest(characterId, questId, { ...quest, status }));
        }
      }

      // Long rest
      if (takeLongRest) {
        promises.push(longRest(characterId));
      }

      await Promise.all(promises);

      // Clear session timer
      localStorage.removeItem('codex_session_start');

      const parts = [];
      if (xpNum > 0) parts.push(`+${xpNum} XP`);
      if (goldNum !== 0) parts.push(`${goldNum > 0 ? '+' : ''}${goldNum} GP`);
      if (journalText.trim()) parts.push('journal saved');
      if (Object.keys(questUpdates).length > 0) parts.push(`${Object.keys(questUpdates).length} quests updated`);
      if (takeLongRest) parts.push('long rest taken');

      toast.success(parts.length > 0 ? `Session saved: ${parts.join(', ')}` : 'Session ended', { duration: 5000 });
      onClose();
    } catch (err) {
      toast.error(`Failed to save session: ${err?.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    background: 'rgba(8,6,16,0.9)', border: '1px solid rgba(201,168,76,0.2)',
    color: '#f0e4c8', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none',
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
        style={{ width: 520, maxWidth: '100%', maxHeight: '85vh', borderRadius: 18, overflow: 'hidden', background: 'linear-gradient(160deg,#0d0b18 0%,#110e1e 100%)', border: '1px solid rgba(201,168,76,0.22)', boxShadow: '0 40px 100px rgba(0,0,0,0.85), 0 0 0 1px rgba(201,168,76,0.08)' }}
      >
        <div style={{ height: 3, background: 'linear-gradient(90deg,transparent,#c9a84c,transparent)' }} />

        <div style={{ padding: '20px 24px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Moon size={18} style={{ color: '#c9a84c' }} />
              <h3 style={{ fontFamily: 'var(--font-heading)', color: '#efe0c0', fontSize: 18, margin: 0 }}>End Session</h3>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(200,175,130,0.35)', marginTop: 4, fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
              {characterName}
              {sessionDuration != null && (
                <span style={{ marginLeft: 8, color: 'rgba(201,168,76,0.4)' }}>
                  <Clock size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
                  {Math.floor(sessionDuration / 60)}h {sessionDuration % 60}m
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.04)', color: 'rgba(200,175,130,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={15} />
          </button>
        </div>

        <div style={{ padding: '8px 24px 24px', overflowY: 'auto', maxHeight: 'calc(85vh - 80px)' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', fontSize: 13, fontFamily: 'var(--font-heading)', color: 'rgba(200,175,130,0.3)', letterSpacing: '0.1em' }}>
              Tallying the spoils...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Add XP */}
              <div>
                <label style={{ fontSize: 10, fontFamily: 'var(--font-heading)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(200,175,130,0.4)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <Sparkles size={12} /> Add XP
                </label>
                <input
                  type="number" min="0" placeholder="XP gained this session"
                  value={xpGained} onChange={e => setXpGained(e.target.value)}
                  style={inputStyle}
                />
                {overview.experience_points != null && (
                  <div style={{ fontSize: 11, color: 'rgba(200,175,130,0.3)', marginTop: 4 }}>
                    Current: {overview.experience_points || 0} XP
                    {Number(xpGained) > 0 && <span style={{ color: '#27ae60' }}> → {(overview.experience_points || 0) + Number(xpGained)} XP</span>}
                  </div>
                )}
              </div>

              {/* Update Gold */}
              <div>
                <label style={{ fontSize: 10, fontFamily: 'var(--font-heading)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(200,175,130,0.4)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <Coins size={12} /> Update Gold (+/-)
                </label>
                <input
                  type="number" placeholder="+50 or -25"
                  value={goldChange} onChange={e => setGoldChange(e.target.value)}
                  style={inputStyle}
                />
                <div style={{ fontSize: 11, color: 'rgba(200,175,130,0.3)', marginTop: 4 }}>
                  Current: {currency.gp || 0} GP
                  {Number(goldChange) !== 0 && !isNaN(Number(goldChange)) && (
                    <span style={{ color: Number(goldChange) > 0 ? '#27ae60' : '#e74c3c' }}>
                      {' → '}{Math.max(0, (currency.gp || 0) + Number(goldChange))} GP
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Journal */}
              <div>
                <label style={{ fontSize: 10, fontFamily: 'var(--font-heading)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(200,175,130,0.4)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <BookOpen size={12} /> Quick Journal
                </label>
                <textarea
                  placeholder="What happened this session? Key events, NPCs met, loot found..."
                  value={journalText} onChange={e => setJournalText(e.target.value)}
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 80, fontFamily: 'var(--font-body)' }}
                />
              </div>

              {/* Quest Updates */}
              {quests.length > 0 && (
                <div>
                  <label style={{ fontSize: 10, fontFamily: 'var(--font-heading)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(200,175,130,0.4)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <Flag size={12} /> Quest Updates
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {quests.map(q => {
                      const update = questUpdates[q.id];
                      return (
                        <div key={q.id} style={{
                          display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8,
                          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                        }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, color: '#f0e4c8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {q.title || 'Untitled Quest'}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                            <button
                              onClick={() => toggleQuest(q.id, 'completed')}
                              style={{
                                width: 28, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer',
                                background: update === 'completed' ? 'rgba(39,174,96,0.2)' : 'rgba(255,255,255,0.04)',
                                color: update === 'completed' ? '#27ae60' : 'rgba(200,175,130,0.3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                              }}
                              title="Mark completed"
                            >
                              <CheckCircle size={14} />
                            </button>
                            <button
                              onClick={() => toggleQuest(q.id, 'failed')}
                              style={{
                                width: 28, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer',
                                background: update === 'failed' ? 'rgba(231,76,60,0.2)' : 'rgba(255,255,255,0.04)',
                                color: update === 'failed' ? '#e74c3c' : 'rgba(200,175,130,0.3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                              }}
                              title="Mark failed"
                            >
                              <XCircle size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Long Rest */}
              <div
                onClick={() => setTakeLongRest(p => !p)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                  background: takeLongRest ? 'rgba(39,174,96,0.08)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${takeLongRest ? 'rgba(39,174,96,0.25)' : 'rgba(255,255,255,0.06)'}`,
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: takeLongRest ? '#27ae60' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${takeLongRest ? '#27ae60' : 'rgba(201,168,76,0.2)'}`,
                  color: takeLongRest ? '#fff' : 'transparent', transition: 'all 0.2s',
                }}>
                  <Check size={12} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: takeLongRest ? '#27ae60' : 'rgba(200,175,130,0.6)' }}>Take Long Rest?</div>
                  <div style={{ fontSize: 11, color: 'rgba(200,175,130,0.3)' }}>Restore HP, spell slots, and hit dice</div>
                </div>
                <Moon size={16} style={{ color: takeLongRest ? '#27ae60' : 'rgba(200,175,130,0.2)' }} />
              </div>

              {/* Save Button */}
              <motion.button
                onClick={handleSave}
                disabled={saving}
                whileHover={!saving ? { y: -2, boxShadow: '0 5px 18px rgba(201,168,76,0.3)' } : {}}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  width: '100%', padding: '13px 24px', borderRadius: 10, border: 'none',
                  cursor: saving ? 'wait' : 'pointer',
                  fontFamily: 'var(--font-heading)', fontSize: 13, letterSpacing: '0.08em', fontWeight: 700,
                  background: 'linear-gradient(135deg,#c9a84c,#f0d878)',
                  color: '#12101c', opacity: saving ? 0.6 : 1, transition: 'opacity 0.2s',
                }}
              >
                {saving ? 'Saving...' : <><Save size={15} /> Save Session</>}
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
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
  const [showCreateHomebrew, setShowCreateHomebrew] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

  const [charSearch, setCharSearch] = useState('');
  const [sortMode, setSortMode] = useState('recent');
  const [showDDBImport, setShowDDBImport] = useState(false);
  const [sessionPrepChar, setSessionPrepChar] = useState(null);
  const [postSessionChar, setPostSessionChar] = useState(null);
  const [updateBannerDismissed, setUpdateBannerDismissed] = useState(false);
  const [tauriUpdate, setTauriUpdate] = useState(null); // { available, version, body, update }
  const [updateInstalling, setUpdateInstalling] = useState(false);
  const { updateAvailable, latestVersion, currentVersion } = useUpdateCheck();
  const ollamaSetup = useOllamaAutoSetup();

  // Tauri native updater — checks GitHub Releases for signed binary updates
  // Checks on mount and every 5 minutes so mid-session updates are detected
  const normVer = s => (s || '').replace(/^[Vv]/, '').trim();
  useEffect(() => {
    let cancelled = false;
    const doCheck = async () => {
      try {
        const { check } = await import('@tauri-apps/plugin-updater');
        const update = await check();
        if (cancelled) return;
        // Only show if remote version is actually newer (not just a rebuilt same version)
        if (update?.available && normVer(update.version) !== normVer(currentVersion)) {
          setTauriUpdate({ available: true, version: update.version, body: update.body, update });
        }
      } catch (e) {
        if (import.meta.env.DEV) console.log('[updater] Check failed:', e);
      }
    };
    doCheck();
    const interval = setInterval(doCheck, 5 * 60 * 1000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [currentVersion]);

  const handleTauriUpdate = async () => {
    if (!tauriUpdate?.update) return;
    setUpdateInstalling(true);
    try {
      await tauriUpdate.update.downloadAndInstall();
      const { relaunch } = await import('@tauri-apps/plugin-process');
      await relaunch();
    } catch (e) {
      toast.error(`Update failed: ${e?.message || e}`);
      setUpdateInstalling(false);
    }
  };

  const load = async () => {
    try { const d = await listCharacters(); setCharacters(d); }
    catch (err) { toast.error(`Failed to load characters: ${err?.message || err}`); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleCreate = async ({ name, ruleset, primaryClass, race, premade, draft }) => {
    try {
      const char = await createCharacter({ name, ruleset, primaryClass, race });

      // If draft homebrew campaign, create campaign entry with 'draft' status
      if (draft && isDM) {
        await invoke('create_campaign', {
          name: char.name || name,
          description: '',
          ruleset: ruleset || 'dnd5e-2024',
          campaignType: 'homebrew',
          campaignId: char.id,
          status: 'draft',
        }).catch(() => {});
        await invoke('set_active_campaign_id', { campaignId: char.id });
        toast.success(`Campaign "${char.name}" created — start building!`);
        setShowCreateHomebrew(false);
        navigate(`/character/${char.id}`, { state: { section: 'dm-guide' } });
        return;
      }

      // If premade campaign selected, import all its data
      if (premade && isDM) {
        const { addNPC } = await import('../api/npcs');
        const { addQuest } = await import('../api/quests');
        const { addLoreNote } = await import('../api/lore');
        const { addJournalEntry: addJournal } = await import('../api/journal');

        let imported = { npcs: 0, quests: 0, lore: 0, journal: 0 };
        for (const npc of premade.npcs || []) {
          try { await addNPC(char.id, { name: npc.name, role: npc.role || '', race: npc.race || '', npc_class: npc.npc_class || '', location: npc.location || '', description: npc.description || '', notes: npc.notes || '', status: npc.status || 'alive' }); imported.npcs++; } catch { /* skip */ }
        }
        for (const quest of premade.quests || []) {
          try { await addQuest(char.id, { title: quest.title, giver: quest.giver || '', description: quest.description || '', status: quest.status || 'active', notes: quest.notes || '', objectives: (quest.objectives || []).map(o => ({ text: o.text, completed: o.completed || false })) }); imported.quests++; } catch { /* skip */ }
        }
        for (const note of premade.lore || []) {
          try { await addLoreNote(char.id, { title: note.title, category: note.category || 'Custom', body: note.body || '', related_to: note.related_to || '' }); imported.lore++; } catch { /* skip */ }
        }
        const journalEntries = premade.journals || (premade.journal ? [premade.journal] : []);
        for (const entry of journalEntries) {
          try { await addJournal(char.id, { title: entry.title, session_number: entry.session_number ?? 0, real_date: entry.real_date || new Date().toISOString().split('T')[0], ingame_date: entry.ingame_date || '', body: entry.body || '', tags: entry.tags || '', npcs_mentioned: entry.npcs_mentioned || '', pinned: entry.pinned || 0 }); imported.journal++; } catch { /* skip */ }
        }

        // Auto-generate scenes from lore locations + NPC locations
        try {
          // Create a matching campaign entry in campaigns.db so scene FK constraints pass
          await invoke('create_campaign', {
            name: char.name || name,
            description: premade.summary || premade.description || '',
            ruleset: ruleset || 'dnd5e-2024',
            campaignType: 'premade',
            campaignId: char.id,
          }).catch(() => {});
          // Set active campaign so create_scene works
          await invoke('set_active_campaign_id', { campaignId: char.id });

          // Collect location lore entries as primary scenes
          const locationLore = (premade.lore || []).filter(l => (l.category || '').toLowerCase() === 'location');
          const sceneNames = new Set();
          let sceneCount = 0;

          for (const loc of locationLore) {
            if (sceneNames.has(loc.title)) continue;
            sceneNames.add(loc.title);
            await invoke('create_scene', {
              name: loc.title,
              description: loc.body || '',
              location: loc.related_to || '',
            }).catch(() => {});
            sceneCount++;
          }

          // Add NPC locations that aren't already covered by lore
          const npcLocations = [...new Set((premade.npcs || []).map(n => n.location).filter(Boolean))];
          for (const loc of npcLocations) {
            // Skip if already a scene or a sub-location of an existing scene
            if (sceneNames.has(loc)) continue;
            const alreadyCovered = [...sceneNames].some(s => loc.includes(s) || s.includes(loc));
            if (alreadyCovered) continue;
            sceneNames.add(loc);
            const npcsHere = (premade.npcs || []).filter(n => n.location === loc).map(n => n.name).join(', ');
            await invoke('create_scene', {
              name: loc,
              description: npcsHere ? `NPCs here: ${npcsHere}` : '',
              location: loc,
            }).catch(() => {});
            sceneCount++;
          }

          if (sceneCount > 0) imported.scenes = sceneCount;
        } catch (e) {
          console.warn('[Dashboard] Scene auto-generation failed:', e);
        }

        const scenePart = imported.scenes ? `, ${imported.scenes} scenes` : '';
        toast.success(`"${char.name}" created with ${imported.npcs} NPCs, ${imported.quests} quests, ${imported.lore} lore entries${scenePart}!`);
      } else {
        toast.success(isDM ? `Campaign "${char.name}" created!` : `${char.name} added to the Codex!`);
      }

      setShowCreate(false);
      if (isDM) {
        navigate(`/character/${char.id}`);
      } else {
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

  const handleImport = async (data) => {
    try {
      const name = data.overview?.name || 'Imported Character';
      const ruleset = data.overview?.ruleset || '5e-2014';
      const primaryClass = data.overview?.primary_class || '';
      const race = data.overview?.race || '';
      const char = await createCharacter({ name, ruleset, primaryClass, race });
      await invoke('import_character', { characterId: char.id, payload: data });
      toast.success(`${name} imported to the Codex!`);
      load();
    } catch (err) {
      toast.error(`Import failed: ${err.message}`);
    }
  };


  // ── Campaign export/archive (DM mode) ──
  const handleExportCampaign = async (campaign) => {
    try {
      const data = await invoke('export_campaign', { campaignId: campaign.id });
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(campaign.name || 'campaign').replace(/[^a-zA-Z0-9]/g, '_')}_export.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`"${campaign.name}" exported!`);
    } catch (err) {
      toast.error(`Export failed: ${err.message || err}`);
    }
  };

  const handleImportCampaign = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data._format !== 'codex-campaign-export') {
          toast.error('Invalid campaign file format');
          return;
        }
        const result = await invoke('import_campaign', { payload: data });
        toast.success(`Campaign "${result.name}" imported!`);
        load();
      } catch (err) {
        toast.error(`Import failed: ${err.message || err}`);
      }
    };
    input.click();
  };

  // ── Derived stats for quick stats bar ──
  const filteredCharacters = characters
    .filter(c => {
      if (!charSearch.trim()) return true;
      const q = charSearch.trim().toLowerCase();
      return (c.name || '').toLowerCase().includes(q)
        || (c.race || '').toLowerCase().includes(q)
        || (c.primary_class || '').toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortMode === 'recent') return (b.updated_at || '').localeCompare(a.updated_at || '');
      if (sortMode === 'level') return (b.level || 0) - (a.level || 0);
      if (sortMode === 'az') return (a.name || '').localeCompare(b.name || '');
      return 0;
    });

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
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden', background: 'var(--bg-deep)', paddingTop: 'var(--dev-banner-h, 0px)' }}>

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

      {/* ── Update Banner (Tauri native updater or version.json fallback) ── */}
      {!updateBannerDismissed && (tauriUpdate?.available || updateAvailable) && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{
            position: 'relative', zIndex: 20, width: '100%', maxWidth: 1060, margin: '0 auto',
            padding: '10px 24px',
          }}
        >
          <div style={{
            position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            padding: '10px 20px', borderRadius: 10,
            background: tauriUpdate?.available ? 'rgba(39,174,96,0.12)' : 'rgba(201,168,76,0.1)',
            border: tauriUpdate?.available ? '1px solid rgba(39,174,96,0.3)' : '1px solid rgba(201,168,76,0.25)',
            backdropFilter: 'blur(12px)',
          }}>
            <span style={{ fontSize: 16 }}>{tauriUpdate?.available ? '🔄' : '✨'}</span>
            <span style={{
              fontFamily: 'var(--font-heading)', fontSize: 12, letterSpacing: '0.05em',
              color: tauriUpdate?.available ? '#86efac' : '#fde68a',
            }}>
              {tauriUpdate?.available
                ? `Update v${tauriUpdate.version} available — click UPDATE NOW to install`
                : `Update available: ${latestVersion} (you have ${currentVersion})`
              }
            </span>
            {tauriUpdate?.available && (
              <button
                onClick={handleTauriUpdate}
                disabled={updateInstalling}
                style={{
                  padding: '4px 14px', borderRadius: 6, fontSize: 11,
                  fontFamily: 'var(--font-heading)', letterSpacing: '0.08em',
                  background: 'rgba(39,174,96,0.2)', border: '1px solid rgba(39,174,96,0.4)',
                  color: '#86efac', cursor: updateInstalling ? 'wait' : 'pointer',
                  opacity: updateInstalling ? 0.6 : 1,
                }}
              >
                {updateInstalling ? 'INSTALLING...' : 'UPDATE NOW'}
              </button>
            )}
            <button
              onClick={() => setUpdateBannerDismissed(true)}
              style={{
                padding: '4px 14px', borderRadius: 6, fontSize: 11,
                fontFamily: 'var(--font-heading)', letterSpacing: '0.08em',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
              }}
            >
              LATER
            </button>
          </div>
        </motion.div>
      )}

      {/* ── AI Setup Banner ── */}
      {ollamaSetup.stage !== 'idle' && ollamaSetup.stage !== 'ready' && ollamaSetup.stage !== 'error' && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{
            position: 'relative', zIndex: 20, width: '100%', maxWidth: 1060, margin: '0 auto',
            padding: '6px 24px',
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 16px', borderRadius: 10,
            background: 'rgba(139,92,246,0.08)',
            border: '1px solid rgba(139,92,246,0.2)',
            backdropFilter: 'blur(12px)',
          }}>
            <div style={{
              width: 14, height: 14, border: '2px solid rgba(139,92,246,0.6)',
              borderTopColor: 'transparent', borderRadius: '50%',
              animation: 'spin 0.8s linear infinite', flexShrink: 0,
            }} />
            <span style={{ fontSize: 11, color: 'rgba(167,139,250,0.8)', fontFamily: 'var(--font-ui)' }}>
              {ollamaSetup.message}
            </span>
            {ollamaSetup.progress > 0 && ollamaSetup.progress < 100 && (
              <div style={{ flex: 1, maxWidth: 120, height: 4, borderRadius: 4, background: 'rgba(139,92,246,0.15)', overflow: 'hidden' }}>
                <div style={{ width: `${ollamaSetup.progress}%`, height: '100%', borderRadius: 4, background: 'rgba(139,92,246,0.5)', transition: 'width 0.3s' }} />
              </div>
            )}
          </div>
        </motion.div>
      )}

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
          <EmptyState
            onOpen={() => setShowCreate(true)}
            onImport={handleImport}
            onDDBImport={() => setShowDDBImport(true)}
            isDM={isDM}
            onCreateHomebrew={() => setShowCreateHomebrew(true)}
            onImportCampaign={handleImportCampaign}
          />
        ) : (
          <>
          <div style={{ display: 'flex', gap: 6, marginBottom: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: 'rgba(201,168,76,0.3)', fontFamily: 'var(--font-heading)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Sort:</span>
            {[
              { key: 'recent', label: 'Recent' },
              { key: 'level', label: 'Level' },
              { key: 'az', label: 'A-Z' },
            ].map(opt => (
              <button
                key={opt.key}
                onClick={() => setSortMode(opt.key)}
                style={{
                  fontSize: 10, fontFamily: 'var(--font-heading)', letterSpacing: '0.06em',
                  padding: '3px 10px', borderRadius: 99, cursor: 'pointer',
                  border: sortMode === opt.key ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(201,168,76,0.15)',
                  background: sortMode === opt.key ? 'rgba(201,168,76,0.12)' : 'rgba(0,0,0,0.2)',
                  color: sortMode === opt.key ? 'rgba(201,168,76,0.8)' : 'rgba(201,168,76,0.35)',
                  transition: 'all 0.15s',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* ─── Quick Actions Section ─────────────────────────────────── */}
          {!isDM && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42 }}
              style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 18, marginTop: 4 }}
            >
              <motion.button
                whileHover={{ scale: 1.06, background: 'rgba(201,168,76,0.15)' }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  const roll = Math.floor(Math.random() * 20) + 1;
                  toast(roll === 20 ? `d20: NAT 20!` : roll === 1 ? `d20: Critical fail... 1` : `d20: ${roll}`, {
                    icon: roll === 20 ? '🎉' : roll === 1 ? '💀' : '🎲',
                    style: { background: '#1a1425', color: '#f0e4c8', border: '1px solid rgba(201,168,76,0.3)', fontFamily: 'var(--font-heading)' },
                  });
                }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 16px', borderRadius: 99, cursor: 'pointer',
                  background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.18)',
                  fontFamily: 'var(--font-heading)', fontSize: 11, color: 'rgba(200,175,130,0.6)', letterSpacing: '0.04em',
                  transition: 'all 0.15s',
                }}
              >
                <Dices size={12} style={{ color: 'rgba(201,168,76,0.55)' }} />
                Quick Roll d20
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.06, background: 'rgba(201,168,76,0.15)' }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  if (characters.length > 0) {
                    toast('Open a character to rest', {
                      icon: '🌙',
                      style: { background: '#1a1425', color: '#f0e4c8', border: '1px solid rgba(201,168,76,0.3)', fontFamily: 'var(--font-heading)' },
                    });
                  }
                }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 16px', borderRadius: 99, cursor: 'pointer',
                  background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.18)',
                  fontFamily: 'var(--font-heading)', fontSize: 11, color: 'rgba(200,175,130,0.6)', letterSpacing: '0.04em',
                  transition: 'all 0.15s',
                }}
              >
                <Moon size={12} style={{ color: 'rgba(201,168,76,0.55)' }} />
                Long Rest All
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.06, background: 'rgba(201,168,76,0.15)' }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  if (characters.length > 0) {
                    const recent = [...characters].sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''))[0];
                    navigate(`/character/${recent.id}?section=random-tables`);
                  }
                }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 16px', borderRadius: 99, cursor: 'pointer',
                  background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.18)',
                  fontFamily: 'var(--font-heading)', fontSize: 11, color: 'rgba(200,175,130,0.6)', letterSpacing: '0.04em',
                  transition: 'all 0.15s',
                }}
              >
                <BookOpen size={12} style={{ color: 'rgba(201,168,76,0.55)' }} />
                Random Table
              </motion.button>
            </motion.div>
          )}

          {isDM && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 10, marginTop: 4 }}
              >
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '5px 14px', borderRadius: 99,
                  background: 'rgba(155,89,182,0.06)', border: '1px solid rgba(155,89,182,0.14)',
                  fontFamily: 'var(--font-heading)', fontSize: 11, color: 'rgba(192,132,252,0.5)', letterSpacing: '0.04em',
                }}>
                  <Library size={11} style={{ color: 'rgba(155,89,182,0.55)' }} />
                  {characters.length} {characters.length === 1 ? 'Campaign' : 'Campaigns'}
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '5px 14px', borderRadius: 99,
                  background: 'rgba(155,89,182,0.06)', border: '1px solid rgba(155,89,182,0.14)',
                  fontFamily: 'var(--font-heading)', fontSize: 11, color: 'rgba(192,132,252,0.5)', letterSpacing: '0.04em',
                }}>
                  <Zap size={11} style={{ color: 'rgba(155,89,182,0.55)' }} />
                  {characters.filter(c => c.status !== 'draft').length} Active
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '5px 14px', borderRadius: 99,
                  background: 'rgba(155,89,182,0.06)', border: '1px solid rgba(155,89,182,0.14)',
                  fontFamily: 'var(--font-heading)', fontSize: 11, color: 'rgba(192,132,252,0.5)', letterSpacing: '0.04em',
                }}>
                  <Clock size={11} style={{ color: 'rgba(155,89,182,0.55)' }} />
                  {characters.filter(c => c.status === 'draft').length} Draft
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42 }}
                style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}
              >
                <motion.button
                  whileHover={{ scale: 1.06, background: 'rgba(155,89,182,0.15)' }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    const name = NPC_NAMES[Math.floor(Math.random() * NPC_NAMES.length)];
                    const trait = NPC_TRAITS[Math.floor(Math.random() * NPC_TRAITS.length)];
                    const role = NPC_ROLES[Math.floor(Math.random() * NPC_ROLES.length)];
                    toast(`${name} — a ${trait} ${role}`, {
                      icon: '🎭',
                      duration: 5000,
                      style: { background: '#1a1425', color: '#f0e4c8', border: '1px solid rgba(155,89,182,0.3)', fontFamily: 'var(--font-heading)' },
                    });
                  }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '6px 16px', borderRadius: 99, cursor: 'pointer',
                    background: 'rgba(155,89,182,0.06)', border: '1px solid rgba(155,89,182,0.18)',
                    fontFamily: 'var(--font-heading)', fontSize: 11, color: 'rgba(192,132,252,0.6)', letterSpacing: '0.04em',
                    transition: 'all 0.15s',
                  }}
                >
                  <Users size={12} style={{ color: 'rgba(155,89,182,0.55)' }} />
                  Quick NPC
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.06, background: 'rgba(155,89,182,0.15)' }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    const hook = ENCOUNTER_HOOKS[Math.floor(Math.random() * ENCOUNTER_HOOKS.length)];
                    toast(hook, {
                      icon: '⚔️',
                      duration: 5000,
                      style: { background: '#1a1425', color: '#f0e4c8', border: '1px solid rgba(155,89,182,0.3)', fontFamily: 'var(--font-heading)' },
                    });
                  }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '6px 16px', borderRadius: 99, cursor: 'pointer',
                    background: 'rgba(155,89,182,0.06)', border: '1px solid rgba(155,89,182,0.18)',
                    fontFamily: 'var(--font-heading)', fontSize: 11, color: 'rgba(192,132,252,0.6)', letterSpacing: '0.04em',
                    transition: 'all 0.15s',
                  }}
                >
                  <Dices size={12} style={{ color: 'rgba(155,89,182,0.55)' }} />
                  Quick Encounter
                </motion.button>
              </motion.div>
            </>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 20 }}>
            {filteredCharacters.map((c, i) => isDM ? (
              <CampaignCard
                key={c.id} char={c} index={i}
                onEnter={id => navigate(`/dm/lobby/${id}`)}
                onDelete={setDeleteTarget}
                onExport={handleExportCampaign}
              />
            ) : (
              <CharacterCard
                key={c.id} char={c} index={i}
                onEnter={id => navigate(`/character/${id}`)}
                onDelete={setDeleteTarget}
              />
            ))}
            {!charSearch.trim() && (
              <>
                <NewCharCard index={filteredCharacters.length} onClick={() => setShowCreate(true)} isDM={isDM} />
                {isDM && (
                  <>
                    {/* Create Campaign card */}
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (filteredCharacters.length + 1) * 0.08, type: 'spring', damping: 22, stiffness: 200 }}
                      whileHover={{ y: -4, borderColor: 'rgba(74,222,128,0.4)' }}
                      onClick={() => setShowCreateHomebrew(true)}
                      style={{
                        borderRadius: 14, cursor: 'pointer', minHeight: 160,
                        background: 'rgba(11,9,20,0.6)', border: '1px dashed rgba(74,222,128,0.2)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        gap: 10, transition: 'all 0.2s',
                      }}
                    >
                      <Plus size={28} style={{ color: 'rgba(74,222,128,0.35)' }} />
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 13, color: 'rgba(74,222,128,0.5)', letterSpacing: '0.04em' }}>
                        Create Campaign
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
                        Build your own homebrew world
                      </div>
                    </motion.div>
                    {/* Import Campaign card */}
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (filteredCharacters.length + 2) * 0.08, type: 'spring', damping: 22, stiffness: 200 }}
                      whileHover={{ y: -4, borderColor: 'rgba(96,165,250,0.4)' }}
                      onClick={handleImportCampaign}
                      style={{
                        borderRadius: 14, cursor: 'pointer', minHeight: 160,
                        background: 'rgba(11,9,20,0.6)', border: '1px dashed rgba(96,165,250,0.2)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        gap: 10, transition: 'all 0.2s',
                      }}
                    >
                      <Upload size={28} style={{ color: 'rgba(96,165,250,0.35)' }} />
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 13, color: 'rgba(96,165,250,0.5)', letterSpacing: '0.04em' }}>
                        Import Campaign
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
                        Load a .json campaign file
                      </div>
                    </motion.div>
                  </>
                )}
                {!isDM && <ImportCharCard index={filteredCharacters.length + 1} onImport={handleImport} />}
                {!isDM && <DDBImportCard index={filteredCharacters.length + 2} onClick={() => setShowDDBImport(true)} />}
              </>
            )}
          </div>
          </>
        )}
      </div>

      {/* Switch Mode button (top-left, matches DM mode style) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        style={{ position: 'fixed', top: 16, left: 16, zIndex: 20 }}
      >
        <button
          onClick={clearMode}
          title="Back to mode selection"
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', borderRadius: '8px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--text-dim, rgba(255,255,255,0.5))',
            fontSize: '13px', fontWeight: 500,
            cursor: 'pointer', fontFamily: 'var(--font-ui)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
            e.currentTarget.style.color = 'var(--text, rgba(255,255,255,0.9))';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.color = 'var(--text-dim, rgba(255,255,255,0.5))';
          }}
        >
          <ArrowLeft size={14} />
          Switch Mode
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

      {/* Create Homebrew Campaign Modal */}
      <AnimatePresence>
        {showCreateHomebrew && (
          <CreateHomebrewModal onClose={() => setShowCreateHomebrew(false)} onCreate={handleCreate} />
        )}
      </AnimatePresence>

      {/* Session Prep Modal */}
      <AnimatePresence>
        {sessionPrepChar && (
          <SessionPrepModal
            characterId={sessionPrepChar.id}
            characterName={sessionPrepChar.name}
            onClose={() => setSessionPrepChar(null)}
            navigate={navigate}
          />
        )}
      </AnimatePresence>

      {/* Post-Session Modal */}
      <AnimatePresence>
        {postSessionChar && (
          <PostSessionModal
            characterId={postSessionChar.id}
            characterName={postSessionChar.name}
            onClose={() => setPostSessionChar(null)}
            navigate={navigate}
          />
        )}
      </AnimatePresence>

      {/* D&D Beyond Import Modal */}
      <DDBImportModal
        show={showDDBImport}
        onClose={() => setShowDDBImport(false)}
        onSuccess={() => { setShowDDBImport(false); load(); }}
      />

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
