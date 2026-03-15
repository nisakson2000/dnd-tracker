import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hammer, Wand2, Shield, Package, Plus, Save, Download, Upload, Trash2, Search, X, Copy, Eye, EyeOff, AlertTriangle, Check, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { addSpell } from '../api/spells';
import { addItem } from '../api/inventory';
import { ABILITIES, calcMod, modStr } from '../utils/dndHelpers';

/* ═══════════════════════════════════════════════════════════════════
   Storage helpers
   ═══════════════════════════════════════════════════════════════════ */
const STORAGE_KEY = 'codex_homebrew_library';

function loadLibrary() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { monsters: [], spells: [], items: [] }; }
  catch { return { monsters: [], spells: [], items: [] }; }
}
function saveLibrary(lib) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lib)); } catch (err) { if (import.meta.env.DEV) console.warn('Homebrew save failed:', err); }
}

/* ═══════════════════════════════════════════════════════════════════
   D&D Constants
   ═══════════════════════════════════════════════════════════════════ */
const SIZES = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
const MONSTER_TYPES = ['Aberration', 'Beast', 'Celestial', 'Construct', 'Dragon', 'Elemental', 'Fey', 'Fiend', 'Giant', 'Humanoid', 'Monstrosity', 'Ooze', 'Plant', 'Undead'];
const ALIGNMENTS = ['Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil', 'Unaligned'];
const DAMAGE_TYPES = ['Acid', 'Bludgeoning', 'Cold', 'Fire', 'Force', 'Lightning', 'Necrotic', 'Piercing', 'Poison', 'Psychic', 'Radiant', 'Slashing', 'Thunder'];
const CONDITIONS = ['Blinded', 'Charmed', 'Deafened', 'Exhaustion', 'Frightened', 'Grappled', 'Incapacitated', 'Invisible', 'Paralyzed', 'Petrified', 'Poisoned', 'Prone', 'Restrained', 'Stunned', 'Unconscious'];
const SPELL_SCHOOLS = ['Abjuration', 'Conjuration', 'Divination', 'Enchantment', 'Evocation', 'Illusion', 'Necromancy', 'Transmutation'];
const ITEM_TYPES = ['Weapon', 'Armor', 'Potion', 'Ring', 'Rod', 'Scroll', 'Staff', 'Wand', 'Wondrous Item', 'Adventuring Gear', 'Tool', 'Other'];
const RARITIES = ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary', 'Artifact'];
const EQUIPMENT_SLOTS = ['Head', 'Neck', 'Shoulders', 'Chest', 'Hands', 'Waist', 'Legs', 'Feet', 'Ring', 'Main Hand', 'Off Hand', 'Two-Handed', 'None'];

/* DMG p.274 Monster Statistics by Challenge Rating */
const CR_TABLE = {
  0:  { prof: 2, ac: 13, hpMin: 1,    hpMax: 6,    atk: 3, dmgMin: 0,  dmgMax: 1,  dc: 13 },
  '1/8': { prof: 2, ac: 13, hpMin: 7,    hpMax: 35,   atk: 3, dmgMin: 2,  dmgMax: 3,  dc: 13 },
  '1/4': { prof: 2, ac: 13, hpMin: 36,   hpMax: 49,   atk: 3, dmgMin: 4,  dmgMax: 5,  dc: 13 },
  '1/2': { prof: 2, ac: 13, hpMin: 50,   hpMax: 70,   atk: 3, dmgMin: 6,  dmgMax: 8,  dc: 13 },
  1:  { prof: 2, ac: 13, hpMin: 71,   hpMax: 85,   atk: 3, dmgMin: 9,  dmgMax: 14, dc: 13 },
  2:  { prof: 2, ac: 13, hpMin: 86,   hpMax: 100,  atk: 3, dmgMin: 15, dmgMax: 20, dc: 13 },
  3:  { prof: 2, ac: 13, hpMin: 101,  hpMax: 115,  atk: 4, dmgMin: 21, dmgMax: 26, dc: 13 },
  4:  { prof: 2, ac: 14, hpMin: 116,  hpMax: 130,  atk: 5, dmgMin: 27, dmgMax: 32, dc: 14 },
  5:  { prof: 3, ac: 15, hpMin: 131,  hpMax: 145,  atk: 6, dmgMin: 33, dmgMax: 38, dc: 15 },
  6:  { prof: 3, ac: 15, hpMin: 146,  hpMax: 160,  atk: 6, dmgMin: 39, dmgMax: 44, dc: 15 },
  7:  { prof: 3, ac: 15, hpMin: 161,  hpMax: 175,  atk: 6, dmgMin: 45, dmgMax: 50, dc: 15 },
  8:  { prof: 3, ac: 16, hpMin: 176,  hpMax: 190,  atk: 7, dmgMin: 51, dmgMax: 56, dc: 16 },
  9:  { prof: 4, ac: 16, hpMin: 191,  hpMax: 205,  atk: 7, dmgMin: 57, dmgMax: 62, dc: 16 },
  10: { prof: 4, ac: 17, hpMin: 206,  hpMax: 220,  atk: 7, dmgMin: 63, dmgMax: 68, dc: 16 },
  11: { prof: 4, ac: 17, hpMin: 221,  hpMax: 235,  atk: 8, dmgMin: 69, dmgMax: 74, dc: 17 },
  12: { prof: 4, ac: 17, hpMin: 236,  hpMax: 250,  atk: 8, dmgMin: 75, dmgMax: 80, dc: 17 },
  13: { prof: 5, ac: 18, hpMin: 251,  hpMax: 265,  atk: 8, dmgMin: 81, dmgMax: 86, dc: 18 },
  14: { prof: 5, ac: 18, hpMin: 266,  hpMax: 280,  atk: 8, dmgMin: 87, dmgMax: 92, dc: 18 },
  15: { prof: 5, ac: 18, hpMin: 281,  hpMax: 295,  atk: 8, dmgMin: 93, dmgMax: 98, dc: 18 },
  16: { prof: 5, ac: 18, hpMin: 296,  hpMax: 310,  atk: 9, dmgMin: 99, dmgMax: 104, dc: 18 },
  17: { prof: 6, ac: 19, hpMin: 311,  hpMax: 325,  atk: 10, dmgMin: 105, dmgMax: 110, dc: 19 },
  18: { prof: 6, ac: 19, hpMin: 326,  hpMax: 340,  atk: 10, dmgMin: 111, dmgMax: 116, dc: 19 },
  19: { prof: 6, ac: 19, hpMin: 341,  hpMax: 355,  atk: 10, dmgMin: 117, dmgMax: 122, dc: 19 },
  20: { prof: 6, ac: 19, hpMin: 356,  hpMax: 400,  atk: 10, dmgMin: 123, dmgMax: 140, dc: 19 },
  21: { prof: 7, ac: 19, hpMin: 401,  hpMax: 445,  atk: 11, dmgMin: 141, dmgMax: 158, dc: 20 },
  22: { prof: 7, ac: 19, hpMin: 446,  hpMax: 490,  atk: 11, dmgMin: 159, dmgMax: 176, dc: 20 },
  23: { prof: 7, ac: 19, hpMin: 491,  hpMax: 535,  atk: 11, dmgMin: 177, dmgMax: 194, dc: 20 },
  24: { prof: 7, ac: 19, hpMin: 536,  hpMax: 580,  atk: 12, dmgMin: 195, dmgMax: 212, dc: 21 },
  25: { prof: 8, ac: 19, hpMin: 581,  hpMax: 625,  atk: 12, dmgMin: 213, dmgMax: 230, dc: 21 },
  26: { prof: 8, ac: 19, hpMin: 626,  hpMax: 670,  atk: 12, dmgMin: 231, dmgMax: 248, dc: 21 },
  27: { prof: 8, ac: 19, hpMin: 671,  hpMax: 715,  atk: 13, dmgMin: 249, dmgMax: 266, dc: 22 },
  28: { prof: 8, ac: 19, hpMin: 716,  hpMax: 760,  atk: 13, dmgMin: 267, dmgMax: 284, dc: 22 },
  29: { prof: 9, ac: 19, hpMin: 761,  hpMax: 805,  atk: 13, dmgMin: 285, dmgMax: 302, dc: 22 },
  30: { prof: 9, ac: 19, hpMin: 806,  hpMax: 850,  atk: 14, dmgMin: 303, dmgMax: 320, dc: 23 },
};

const CR_OPTIONS = ['0', '1/8', '1/4', '1/2', ...Array.from({ length: 30 }, (_, i) => String(i + 1))];

/* Spell balance reference: avg damage for single-target spells by level */
const SPELL_DMG_REF = {
  0: { avg: 7, example: 'Fire Bolt (1d10)' },
  1: { avg: 11, example: 'Chromatic Orb (3d8)' },
  2: { avg: 16, example: 'Scorching Ray (6d6)' },
  3: { avg: 28, example: 'Fireball (8d6, AoE)' },
  4: { avg: 28, example: 'Ice Storm (2d8+4d6, AoE)' },
  5: { avg: 36, example: 'Cone of Cold (8d8, AoE)' },
  6: { avg: 40, example: 'Chain Lightning (10d8)' },
  7: { avg: 49, example: 'Finger of Death (7d8+30)' },
  8: { avg: 54, example: 'Sunburst (12d6, AoE)' },
  9: { avg: 70, example: 'Meteor Swarm (40d6, AoE)' },
};

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ═══════════════════════════════════════════════════════════════════
   Style constants
   ═══════════════════════════════════════════════════════════════════ */
const inputStyle = {
  width: '100%', padding: '8px 10px', borderRadius: 6,
  border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
  color: 'var(--text)', fontSize: '12px', fontFamily: 'var(--font-ui)',
  outline: 'none', transition: 'border-color 0.15s',
};
const selectStyle = { ...inputStyle, cursor: 'pointer' };
const labelStyle = {
  display: 'block', fontSize: '10px', fontWeight: 600,
  color: 'var(--text-dim)', marginBottom: 4, fontFamily: 'var(--font-ui)',
  textTransform: 'uppercase', letterSpacing: '0.05em',
};
const cardStyle = {
  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 10, padding: 16, marginBottom: 12,
};
const btnPrimary = {
  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px',
  borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
  color: 'white', fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-ui)',
  cursor: 'pointer', transition: 'opacity 0.15s',
};
const btnSecondary = {
  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px',
  borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)',
  color: 'var(--text-dim)', fontSize: '12px', fontWeight: 500, fontFamily: 'var(--font-ui)',
  cursor: 'pointer', transition: 'all 0.15s',
};

/* ═══════════════════════════════════════════════════════════════════
   Balance checking helpers
   ═══════════════════════════════════════════════════════════════════ */
function getBalanceColor(status) {
  if (status === 'good') return '#4ade80';
  if (status === 'warn') return '#fbbf24';
  return '#ef4444';
}
function checkMonsterBalance(monster) {
  const cr = CR_TABLE[monster.cr];
  if (!cr) return [];
  const checks = [];
  const ac = Number(monster.ac) || 0;
  const hp = Number(monster.hp) || 0;
  const atkBonus = Number(monster.attackBonus) || 0;
  const dpr = Number(monster.damagePerRound) || 0;
  const saveDC = Number(monster.saveDC) || 0;

  // AC check
  if (ac > 0) {
    const diff = ac - cr.ac;
    if (Math.abs(diff) <= 1) checks.push({ stat: 'AC', status: 'good', msg: `AC ${ac} is balanced for CR ${monster.cr} (expected ~${cr.ac})` });
    else if (Math.abs(diff) <= 3) checks.push({ stat: 'AC', status: 'warn', msg: `AC ${ac} is ${diff > 0 ? 'high' : 'low'} for CR ${monster.cr} (expected ~${cr.ac})` });
    else checks.push({ stat: 'AC', status: 'bad', msg: `AC ${ac} is significantly ${diff > 0 ? 'high' : 'low'} for CR ${monster.cr} (expected ~${cr.ac})` });
  }
  // HP check
  if (hp > 0) {
    if (hp >= cr.hpMin && hp <= cr.hpMax) checks.push({ stat: 'HP', status: 'good', msg: `HP ${hp} is in range for CR ${monster.cr} (${cr.hpMin}-${cr.hpMax})` });
    else if (hp >= cr.hpMin - 20 && hp <= cr.hpMax + 20) checks.push({ stat: 'HP', status: 'warn', msg: `HP ${hp} is slightly outside range for CR ${monster.cr} (${cr.hpMin}-${cr.hpMax})` });
    else checks.push({ stat: 'HP', status: 'bad', msg: `HP ${hp} is far outside range for CR ${monster.cr} (${cr.hpMin}-${cr.hpMax})` });
  }
  // Attack bonus
  if (atkBonus > 0) {
    const diff = atkBonus - cr.atk;
    if (Math.abs(diff) <= 1) checks.push({ stat: 'Attack', status: 'good', msg: `Attack bonus +${atkBonus} is balanced (expected +${cr.atk})` });
    else if (Math.abs(diff) <= 2) checks.push({ stat: 'Attack', status: 'warn', msg: `Attack bonus +${atkBonus} is ${diff > 0 ? 'high' : 'low'} (expected +${cr.atk})` });
    else checks.push({ stat: 'Attack', status: 'bad', msg: `Attack bonus +${atkBonus} is significantly ${diff > 0 ? 'high' : 'low'} (expected +${cr.atk})` });
  }
  // DPR
  if (dpr > 0) {
    if (dpr >= cr.dmgMin && dpr <= cr.dmgMax) checks.push({ stat: 'DPR', status: 'good', msg: `Damage/round ${dpr} is in range (${cr.dmgMin}-${cr.dmgMax})` });
    else if (dpr >= cr.dmgMin - 5 && dpr <= cr.dmgMax + 5) checks.push({ stat: 'DPR', status: 'warn', msg: `Damage/round ${dpr} is slightly off (${cr.dmgMin}-${cr.dmgMax})` });
    else checks.push({ stat: 'DPR', status: 'bad', msg: `Damage/round ${dpr} is far off for CR ${monster.cr} (${cr.dmgMin}-${cr.dmgMax})` });
  }
  // Save DC
  if (saveDC > 0) {
    const diff = saveDC - cr.dc;
    if (Math.abs(diff) <= 1) checks.push({ stat: 'Save DC', status: 'good', msg: `Save DC ${saveDC} is balanced (expected ${cr.dc})` });
    else if (Math.abs(diff) <= 2) checks.push({ stat: 'Save DC', status: 'warn', msg: `Save DC ${saveDC} is ${diff > 0 ? 'high' : 'low'} (expected ${cr.dc})` });
    else checks.push({ stat: 'Save DC', status: 'bad', msg: `Save DC ${saveDC} is significantly ${diff > 0 ? 'high' : 'low'} (expected ${cr.dc})` });
  }
  return checks;
}

/* ═══════════════════════════════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════════════════════════════ */
function FormField({ label, children, style: s }) {
  return (
    <div style={{ marginBottom: 10, ...s }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function MultiSelect({ options, selected, onChange, label }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);
  return (
    <FormField label={label}>
      <div ref={wrapperRef} style={{ position: 'relative' }}>
        <button
          type="button" onClick={() => setOpen(!open)}
          style={{ ...inputStyle, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 34 }}
        >
          <span style={{ fontSize: '11px', color: selected.length ? 'var(--text)' : 'var(--text-mute)' }}>
            {selected.length ? selected.join(', ') : 'None selected'}
          </span>
          {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
        {open && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20,
            background: 'rgba(20,20,30,0.98)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, maxHeight: 180, overflowY: 'auto', marginTop: 2,
          }}>
            {options.map(opt => (
              <button key={opt} type="button" onClick={() => {
                onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]);
              }} style={{
                width: '100%', textAlign: 'left', padding: '6px 10px', border: 'none',
                background: selected.includes(opt) ? 'rgba(192,132,252,0.12)' : 'transparent',
                color: selected.includes(opt) ? '#c4b5fd' : 'var(--text-dim)',
                fontSize: '11px', fontFamily: 'var(--font-ui)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{ width: 14, height: 14, borderRadius: 3, border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', background: selected.includes(opt) ? 'rgba(192,132,252,0.2)' : 'transparent' }}>
                  {selected.includes(opt) && <Check size={9} />}
                </span>
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </FormField>
  );
}

function BalanceIndicator({ checks }) {
  if (!checks.length) return null;
  return (
    <div style={{ ...cardStyle, background: 'rgba(255,255,255,0.015)', borderColor: 'rgba(255,255,255,0.08)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <AlertTriangle size={14} style={{ color: '#fbbf24' }} />
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>Balance Checker</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {checks.map(c => (
          <div key={c.stat} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: getBalanceColor(c.status),
              boxShadow: `0 0 6px ${getBalanceColor(c.status)}40`,
              flexShrink: 0,
            }} />
            <span style={{ fontSize: '11px', color: getBalanceColor(c.status), fontFamily: 'var(--font-ui)' }}>{c.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Monster Builder
   ═══════════════════════════════════════════════════════════════════ */
const EMPTY_MONSTER = {
  name: '', size: 'Medium', type: 'Humanoid', alignment: 'Unaligned',
  cr: '1', ac: 13, hp: 78, speed: '30 ft.', senses: 'passive Perception 10',
  languages: 'Common', abilities: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
  attackBonus: 3, damagePerRound: 11, saveDC: 13,
  attacks: [], traits: [], actions: [], bonusActions: [], reactions: [], legendaryActions: [],
  resistances: [], immunities: [], vulnerabilities: [], conditionImmunities: [],
};

function MonsterBuilder({ onSave }) {
  const [m, setM] = useState({ ...EMPTY_MONSTER, abilities: { ...EMPTY_MONSTER.abilities } });
  const [showPreview, setShowPreview] = useState(false);

  const update = useCallback((field, val) => setM(prev => ({ ...prev, [field]: val })), []);

  const applyCRSuggestions = useCallback((cr) => {
    const ref = CR_TABLE[cr];
    if (!ref) return;
    setM(prev => ({
      ...prev, cr,
      ac: ref.ac,
      hp: Math.round((ref.hpMin + ref.hpMax) / 2),
      attackBonus: ref.atk,
      damagePerRound: Math.round((ref.dmgMin + ref.dmgMax) / 2),
      saveDC: ref.dc,
    }));
  }, []);

  const addAttack = () => update('attacks', [...m.attacks, { id: genId(), name: '', type: 'Melee Weapon', bonus: m.attackBonus, damage: '1d8+3', reach: '5 ft.' }]);
  const removeAttack = (id) => update('attacks', m.attacks.filter(a => a.id !== id));
  const updateAttack = (id, field, val) => update('attacks', m.attacks.map(a => a.id === id ? { ...a, [field]: val } : a));

  const addTextBlock = (key) => update(key, [...m[key], { id: genId(), name: '', text: '' }]);
  const removeTextBlock = (key, id) => update(key, m[key].filter(t => t.id !== id));
  const updateTextBlock = (key, id, field, val) => update(key, m[key].map(t => t.id === id ? { ...t, [field]: val } : t));

  const balance = useMemo(() => checkMonsterBalance(m), [m]);

  const handleSave = () => {
    if (!m.name.trim()) { toast.error('Monster needs a name'); return; }
    onSave({ ...m, id: genId(), createdAt: Date.now() });
    setM({ ...EMPTY_MONSTER, abilities: { ...EMPTY_MONSTER.abilities } });
    toast.success(`${m.name} saved to library`);
  };

  return (
    <div>
      {/* Basic Info */}
      <div style={cardStyle}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: 12, fontFamily: 'var(--font-display)' }}>Basic Information</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <FormField label="Name" style={{ gridColumn: '1 / -1' }}>
            <input style={inputStyle} value={m.name} onChange={e => update('name', e.target.value)} placeholder="e.g., Shadow Drake" />
          </FormField>
          <FormField label="Size">
            <select style={selectStyle} value={m.size} onChange={e => update('size', e.target.value)}>
              {SIZES.map(s => <option key={s}>{s}</option>)}
            </select>
          </FormField>
          <FormField label="Type">
            <select style={selectStyle} value={m.type} onChange={e => update('type', e.target.value)}>
              {MONSTER_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </FormField>
          <FormField label="Alignment">
            <select style={selectStyle} value={m.alignment} onChange={e => update('alignment', e.target.value)}>
              {ALIGNMENTS.map(a => <option key={a}>{a}</option>)}
            </select>
          </FormField>
          <FormField label="Challenge Rating">
            <select style={selectStyle} value={m.cr} onChange={e => applyCRSuggestions(e.target.value)}>
              {CR_OPTIONS.map(c => <option key={c} value={c}>CR {c}</option>)}
            </select>
          </FormField>
        </div>
      </div>

      {/* Core Stats */}
      <div style={cardStyle}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: 12, fontFamily: 'var(--font-display)' }}>Core Statistics</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <FormField label="Armor Class">
            <input type="number" style={inputStyle} value={m.ac} onChange={e => update('ac', e.target.value)} />
          </FormField>
          <FormField label="Hit Points">
            <input type="number" style={inputStyle} value={m.hp} onChange={e => update('hp', e.target.value)} />
          </FormField>
          <FormField label="Save DC">
            <input type="number" style={inputStyle} value={m.saveDC} onChange={e => update('saveDC', e.target.value)} />
          </FormField>
          <FormField label="Attack Bonus">
            <input type="number" style={inputStyle} value={m.attackBonus} onChange={e => update('attackBonus', e.target.value)} />
          </FormField>
          <FormField label="Damage/Round">
            <input type="number" style={inputStyle} value={m.damagePerRound} onChange={e => update('damagePerRound', e.target.value)} />
          </FormField>
          <FormField label="Speed">
            <input style={inputStyle} value={m.speed} onChange={e => update('speed', e.target.value)} placeholder="30 ft." />
          </FormField>
        </div>
      </div>

      {/* Ability Scores */}
      <div style={cardStyle}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: 12, fontFamily: 'var(--font-display)' }}>Ability Scores</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
          {ABILITIES.map(ab => (
            <div key={ab} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#c084fc', marginBottom: 4, fontFamily: 'var(--font-mono)' }}>{ab}</div>
              <input
                type="number" style={{ ...inputStyle, textAlign: 'center', padding: '6px 4px' }}
                value={m.abilities[ab]}
                onChange={e => setM(prev => ({ ...prev, abilities: { ...prev.abilities, [ab]: Number(e.target.value) || 0 } }))}
              />
              <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                {modStr(calcMod(m.abilities[ab]))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Senses & Languages */}
      <div style={cardStyle}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <FormField label="Senses">
            <input style={inputStyle} value={m.senses} onChange={e => update('senses', e.target.value)} placeholder="darkvision 60 ft., passive Perception 14" />
          </FormField>
          <FormField label="Languages">
            <input style={inputStyle} value={m.languages} onChange={e => update('languages', e.target.value)} placeholder="Common, Draconic" />
          </FormField>
        </div>
      </div>

      {/* Resistances/Immunities */}
      <div style={cardStyle}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: 12, fontFamily: 'var(--font-display)' }}>Defenses</div>
        <MultiSelect label="Resistances" options={DAMAGE_TYPES} selected={m.resistances} onChange={v => update('resistances', v)} />
        <MultiSelect label="Immunities" options={DAMAGE_TYPES} selected={m.immunities} onChange={v => update('immunities', v)} />
        <MultiSelect label="Vulnerabilities" options={DAMAGE_TYPES} selected={m.vulnerabilities} onChange={v => update('vulnerabilities', v)} />
        <MultiSelect label="Condition Immunities" options={CONDITIONS} selected={m.conditionImmunities} onChange={v => update('conditionImmunities', v)} />
      </div>

      {/* Attacks */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>Attacks</span>
          <button onClick={addAttack} style={btnSecondary}><Plus size={12} /> Add Attack</button>
        </div>
        {m.attacks.map(atk => (
          <div key={atk.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto auto', gap: 8, marginBottom: 8, alignItems: 'end' }}>
            <FormField label="Name"><input style={inputStyle} value={atk.name} onChange={e => updateAttack(atk.id, 'name', e.target.value)} placeholder="Claw" /></FormField>
            <FormField label="Bonus"><input type="number" style={{ ...inputStyle, width: 60 }} value={atk.bonus} onChange={e => updateAttack(atk.id, 'bonus', e.target.value)} /></FormField>
            <FormField label="Damage"><input style={{ ...inputStyle, width: 90 }} value={atk.damage} onChange={e => updateAttack(atk.id, 'damage', e.target.value)} placeholder="2d6+3" /></FormField>
            <FormField label="Reach/Range"><input style={{ ...inputStyle, width: 80 }} value={atk.reach} onChange={e => updateAttack(atk.id, 'reach', e.target.value)} /></FormField>
            <button onClick={() => removeAttack(atk.id)} style={{ ...btnSecondary, padding: '7px 8px', marginBottom: 10, color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}><Trash2 size={12} /></button>
          </div>
        ))}
      </div>

      {/* Text blocks: Traits, Actions, Bonus Actions, Reactions, Legendary */}
      {[
        { key: 'traits', label: 'Traits & Special Abilities' },
        { key: 'actions', label: 'Actions' },
        { key: 'bonusActions', label: 'Bonus Actions' },
        { key: 'reactions', label: 'Reactions' },
        { key: 'legendaryActions', label: 'Legendary Actions' },
      ].map(({ key, label }) => (
        <div key={key} style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{label}</span>
            <button onClick={() => addTextBlock(key)} style={btnSecondary}><Plus size={12} /> Add</button>
          </div>
          {m[key].map(t => (
            <div key={t.id} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                <input style={{ ...inputStyle, flex: 1 }} value={t.name} onChange={e => updateTextBlock(key, t.id, 'name', e.target.value)} placeholder="Name" />
                <button onClick={() => removeTextBlock(key, t.id)} style={{ ...btnSecondary, padding: '6px 8px', color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}><Trash2 size={12} /></button>
              </div>
              <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} value={t.text} onChange={e => updateTextBlock(key, t.id, 'text', e.target.value)} placeholder="Description..." />
            </div>
          ))}
        </div>
      ))}

      {/* Balance Checker */}
      <BalanceIndicator checks={balance} />

      {/* Preview Toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={() => setShowPreview(!showPreview)} style={btnSecondary}>
          {showPreview ? <EyeOff size={12} /> : <Eye size={12} />}
          {showPreview ? 'Hide Preview' : 'Stat Block Preview'}
        </button>
        <button onClick={handleSave} style={btnPrimary}><Save size={12} /> Save Monster</button>
      </div>

      {/* Stat Block Preview */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)',
              borderRadius: 10, padding: 20, fontFamily: 'var(--font-ui)', overflow: 'hidden',
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#c9a84c', fontFamily: 'var(--font-display)', marginBottom: 2 }}>{m.name || 'Unnamed Monster'}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: 12, fontStyle: 'italic' }}>
              {m.size} {m.type.toLowerCase()}, {m.alignment.toLowerCase()}
            </div>
            <div style={{ height: 1, background: 'rgba(201,168,76,0.2)', marginBottom: 10 }} />
            <div style={{ fontSize: '12px', color: 'var(--text)', lineHeight: 1.7 }}>
              <div><strong style={{ color: '#c9a84c' }}>Armor Class</strong> {m.ac}</div>
              <div><strong style={{ color: '#c9a84c' }}>Hit Points</strong> {m.hp}</div>
              <div><strong style={{ color: '#c9a84c' }}>Speed</strong> {m.speed}</div>
            </div>
            <div style={{ height: 1, background: 'rgba(201,168,76,0.2)', margin: '10px 0' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4, textAlign: 'center', marginBottom: 10 }}>
              {ABILITIES.map(ab => (
                <div key={ab}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#c9a84c' }}>{ab}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text)' }}>{m.abilities[ab]} ({modStr(calcMod(m.abilities[ab]))})</div>
                </div>
              ))}
            </div>
            <div style={{ height: 1, background: 'rgba(201,168,76,0.2)', margin: '10px 0' }} />
            <div style={{ fontSize: '12px', color: 'var(--text)', lineHeight: 1.7 }}>
              {m.resistances.length > 0 && <div><strong style={{ color: '#c9a84c' }}>Damage Resistances</strong> {m.resistances.join(', ')}</div>}
              {m.immunities.length > 0 && <div><strong style={{ color: '#c9a84c' }}>Damage Immunities</strong> {m.immunities.join(', ')}</div>}
              {m.vulnerabilities.length > 0 && <div><strong style={{ color: '#c9a84c' }}>Damage Vulnerabilities</strong> {m.vulnerabilities.join(', ')}</div>}
              {m.conditionImmunities.length > 0 && <div><strong style={{ color: '#c9a84c' }}>Condition Immunities</strong> {m.conditionImmunities.join(', ')}</div>}
              <div><strong style={{ color: '#c9a84c' }}>Senses</strong> {m.senses}</div>
              <div><strong style={{ color: '#c9a84c' }}>Languages</strong> {m.languages}</div>
              <div><strong style={{ color: '#c9a84c' }}>Challenge</strong> {m.cr} (Prof. +{CR_TABLE[m.cr]?.prof || 2})</div>
            </div>
            {m.traits.length > 0 && (
              <>
                <div style={{ height: 1, background: 'rgba(201,168,76,0.2)', margin: '10px 0' }} />
                {m.traits.map(t => (
                  <div key={t.id} style={{ marginBottom: 6, fontSize: '12px', color: 'var(--text)' }}>
                    <strong style={{ color: '#c9a84c', fontStyle: 'italic' }}>{t.name}.</strong> {t.text}
                  </div>
                ))}
              </>
            )}
            {(m.actions.length > 0 || m.attacks.length > 0) && (
              <>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#c9a84c', marginTop: 12, marginBottom: 6 }}>Actions</div>
                {m.attacks.map(a => (
                  <div key={a.id} style={{ marginBottom: 6, fontSize: '12px', color: 'var(--text)' }}>
                    <strong style={{ color: '#c9a84c', fontStyle: 'italic' }}>{a.name || 'Attack'}.</strong>{' '}
                    <em>{a.type}</em>: +{a.bonus} to hit, reach {a.reach}. <em>Hit:</em> {a.damage} damage.
                  </div>
                ))}
                {m.actions.map(a => (
                  <div key={a.id} style={{ marginBottom: 6, fontSize: '12px', color: 'var(--text)' }}>
                    <strong style={{ color: '#c9a84c', fontStyle: 'italic' }}>{a.name}.</strong> {a.text}
                  </div>
                ))}
              </>
            )}
            {m.bonusActions.length > 0 && (
              <>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#c9a84c', marginTop: 12, marginBottom: 6 }}>Bonus Actions</div>
                {m.bonusActions.map(a => (
                  <div key={a.id} style={{ marginBottom: 6, fontSize: '12px', color: 'var(--text)' }}><strong style={{ color: '#c9a84c', fontStyle: 'italic' }}>{a.name}.</strong> {a.text}</div>
                ))}
              </>
            )}
            {m.reactions.length > 0 && (
              <>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#c9a84c', marginTop: 12, marginBottom: 6 }}>Reactions</div>
                {m.reactions.map(r => (
                  <div key={r.id} style={{ marginBottom: 6, fontSize: '12px', color: 'var(--text)' }}><strong style={{ color: '#c9a84c', fontStyle: 'italic' }}>{r.name}.</strong> {r.text}</div>
                ))}
              </>
            )}
            {m.legendaryActions.length > 0 && (
              <>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#c9a84c', marginTop: 12, marginBottom: 6 }}>Legendary Actions</div>
                {m.legendaryActions.map(l => (
                  <div key={l.id} style={{ marginBottom: 6, fontSize: '12px', color: 'var(--text)' }}><strong style={{ color: '#c9a84c', fontStyle: 'italic' }}>{l.name}.</strong> {l.text}</div>
                ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Spell Builder
   ═══════════════════════════════════════════════════════════════════ */
const EMPTY_SPELL = {
  name: '', level: 1, school: 'Evocation',
  castingTime: '1 action', range: '60 feet', duration: '1 round',
  components: { V: true, S: true, M: false, material: '' },
  concentration: false, ritual: false,
  description: '', damage: '', damageType: 'Fire',
  healing: '', atHigherLevels: '',
};

function SpellBuilder({ onSave, characterId }) {
  const [sp, setSp] = useState({ ...EMPTY_SPELL, components: { ...EMPTY_SPELL.components } });

  const update = useCallback((field, val) => setSp(prev => ({ ...prev, [field]: val })), []);

  const balanceHint = useMemo(() => {
    if (!sp.damage) return null;
    const ref = SPELL_DMG_REF[sp.level];
    if (!ref) return null;
    // Try to parse dice like 8d6
    const match = sp.damage.match(/(\d+)d(\d+)/);
    if (!match) return null;
    const count = parseInt(match[1]);
    const sides = parseInt(match[2]);
    const avg = count * ((sides + 1) / 2);
    const diff = avg - ref.avg;
    const pct = Math.abs(diff) / ref.avg;

    if (pct <= 0.15) return { status: 'good', msg: `Avg damage ${avg.toFixed(0)} is balanced for level ${sp.level} (reference: ${ref.example})` };
    if (pct <= 0.35) return { status: 'warn', msg: `Avg damage ${avg.toFixed(0)} is ${diff > 0 ? 'above' : 'below'} average for level ${sp.level} (reference: ${ref.example})` };
    return { status: 'bad', msg: `Avg damage ${avg.toFixed(0)} is significantly ${diff > 0 ? 'higher' : 'lower'} than typical level ${sp.level} spells (reference: ${ref.example})` };
  }, [sp.damage, sp.level]);

  const handleSave = () => {
    if (!sp.name.trim()) { toast.error('Spell needs a name'); return; }
    onSave({ ...sp, id: genId(), createdAt: Date.now() });
    setSp({ ...EMPTY_SPELL, components: { ...EMPTY_SPELL.components } });
    toast.success(`${sp.name} saved to library`);
  };

  const handleAddToSpellbook = async () => {
    if (!characterId) { toast.error('No active character selected'); return; }
    if (!sp.name.trim()) { toast.error('Spell needs a name'); return; }
    try {
      const compList = [sp.components.V && 'V', sp.components.S && 'S', sp.components.M && 'M'].filter(Boolean).join(', ');
      await addSpell(characterId, {
        name: sp.name,
        level: sp.level,
        school: sp.school,
        casting_time: sp.castingTime,
        range: sp.range,
        duration: sp.duration,
        components: compList + (sp.components.M && sp.components.material ? ` (${sp.components.material})` : ''),
        concentration: sp.concentration,
        ritual: sp.ritual,
        description: sp.description + (sp.atHigherLevels ? `\n\nAt Higher Levels: ${sp.atHigherLevels}` : ''),
        damage: sp.damage ? `${sp.damage} ${sp.damageType}` : '',
        prepared: false,
        source: 'Homebrew',
      });
      toast.success(`${sp.name} added to spellbook`);
    } catch (err) {
      toast.error('Failed to add spell: ' + (err.message || err));
    }
  };

  return (
    <div>
      <div style={cardStyle}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: 12, fontFamily: 'var(--font-display)' }}>Spell Details</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <FormField label="Name" style={{ gridColumn: '1 / -1' }}>
            <input style={inputStyle} value={sp.name} onChange={e => update('name', e.target.value)} placeholder="e.g., Arcane Torrent" />
          </FormField>
          <FormField label="Level">
            <select style={selectStyle} value={sp.level} onChange={e => update('level', Number(e.target.value))}>
              <option value={0}>Cantrip</option>
              {[1,2,3,4,5,6,7,8,9].map(l => <option key={l} value={l}>{l}{l===1?'st':l===2?'nd':l===3?'rd':'th'} Level</option>)}
            </select>
          </FormField>
          <FormField label="School">
            <select style={selectStyle} value={sp.school} onChange={e => update('school', e.target.value)}>
              {SPELL_SCHOOLS.map(s => <option key={s}>{s}</option>)}
            </select>
          </FormField>
          <FormField label="Casting Time">
            <input style={inputStyle} value={sp.castingTime} onChange={e => update('castingTime', e.target.value)} placeholder="1 action" />
          </FormField>
          <FormField label="Range">
            <input style={inputStyle} value={sp.range} onChange={e => update('range', e.target.value)} placeholder="60 feet" />
          </FormField>
          <FormField label="Duration">
            <input style={inputStyle} value={sp.duration} onChange={e => update('duration', e.target.value)} placeholder="1 minute" />
          </FormField>
        </div>

        {/* Components */}
        <div style={{ marginTop: 10 }}>
          <label style={labelStyle}>Components</label>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            {['V', 'S', 'M'].map(c => (
              <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '12px', color: 'var(--text)', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>
                <input type="checkbox" checked={sp.components[c]} onChange={e => setSp(prev => ({ ...prev, components: { ...prev.components, [c]: e.target.checked } }))} style={{ accentColor: '#c084fc' }} />
                {c === 'V' ? 'Verbal' : c === 'S' ? 'Somatic' : 'Material'}
              </label>
            ))}
          </div>
          {sp.components.M && (
            <input style={{ ...inputStyle, marginTop: 6 }} value={sp.components.material} onChange={e => setSp(prev => ({ ...prev, components: { ...prev.components, material: e.target.value } }))} placeholder="Material components..." />
          )}
        </div>

        {/* Toggles */}
        <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '12px', color: 'var(--text)', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>
            <input type="checkbox" checked={sp.concentration} onChange={e => update('concentration', e.target.checked)} style={{ accentColor: '#c084fc' }} />
            Concentration
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '12px', color: 'var(--text)', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>
            <input type="checkbox" checked={sp.ritual} onChange={e => update('ritual', e.target.checked)} style={{ accentColor: '#c084fc' }} />
            Ritual
          </label>
        </div>
      </div>

      {/* Description */}
      <div style={cardStyle}>
        <FormField label="Description">
          <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} value={sp.description} onChange={e => update('description', e.target.value)} placeholder="Describe the spell's effects..." />
        </FormField>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <FormField label="Damage Dice">
            <input style={inputStyle} value={sp.damage} onChange={e => update('damage', e.target.value)} placeholder="8d6" />
          </FormField>
          <FormField label="Damage Type">
            <select style={selectStyle} value={sp.damageType} onChange={e => update('damageType', e.target.value)}>
              {DAMAGE_TYPES.map(d => <option key={d}>{d}</option>)}
            </select>
          </FormField>
          <FormField label="Healing Dice">
            <input style={inputStyle} value={sp.healing} onChange={e => update('healing', e.target.value)} placeholder="2d8+4" />
          </FormField>
        </div>

        <FormField label="At Higher Levels">
          <textarea style={{ ...inputStyle, minHeight: 50, resize: 'vertical' }} value={sp.atHigherLevels} onChange={e => update('atHigherLevels', e.target.value)} placeholder="When cast using a higher-level spell slot..." />
        </FormField>
      </div>

      {/* Balance Hint */}
      {balanceHint && (
        <div style={{ ...cardStyle, background: 'rgba(255,255,255,0.015)', borderColor: 'rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <AlertTriangle size={14} style={{ color: '#fbbf24' }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>Balance Hint</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: getBalanceColor(balanceHint.status), boxShadow: `0 0 6px ${getBalanceColor(balanceHint.status)}40`, flexShrink: 0 }} />
            <span style={{ fontSize: '11px', color: getBalanceColor(balanceHint.status), fontFamily: 'var(--font-ui)' }}>{balanceHint.msg}</span>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleSave} style={btnPrimary}><Save size={12} /> Save Spell</button>
        <button onClick={handleAddToSpellbook} style={btnSecondary}><Wand2 size={12} /> Add to Spellbook</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Item Builder
   ═══════════════════════════════════════════════════════════════════ */
const EMPTY_ITEM = {
  name: '', type: 'Wondrous Item', rarity: 'Common', attunement: false,
  weight: '', value: '', description: '',
  modifiers: { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 },
  slot: 'None',
};

function ItemBuilder({ onSave, characterId }) {
  const [item, setItem] = useState({ ...EMPTY_ITEM, modifiers: { ...EMPTY_ITEM.modifiers } });

  const update = useCallback((field, val) => setItem(prev => ({ ...prev, [field]: val })), []);

  const handleSave = () => {
    if (!item.name.trim()) { toast.error('Item needs a name'); return; }
    onSave({ ...item, id: genId(), createdAt: Date.now() });
    setItem({ ...EMPTY_ITEM, modifiers: { ...EMPTY_ITEM.modifiers } });
    toast.success(`${item.name} saved to library`);
  };

  const handleAddToInventory = async () => {
    if (!characterId) { toast.error('No active character selected'); return; }
    if (!item.name.trim()) { toast.error('Item needs a name'); return; }
    try {
      const modList = Object.entries(item.modifiers).filter(([, v]) => v !== 0).map(([k, v]) => `${k} ${v > 0 ? '+' : ''}${v}`).join(', ');
      await addItem(characterId, {
        name: item.name,
        type: item.type,
        rarity: item.rarity,
        attuned: item.attunement,
        weight: Number(item.weight) || 0,
        value: item.value ? `${item.value} gp` : '',
        description: item.description + (modList ? `\n\nStat Modifiers: ${modList}` : ''),
        equipped: false,
        quantity: 1,
        source: 'Homebrew',
      });
      toast.success(`${item.name} added to inventory`);
    } catch (err) {
      toast.error('Failed to add item: ' + (err.message || err));
    }
  };

  return (
    <div>
      <div style={cardStyle}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: 12, fontFamily: 'var(--font-display)' }}>Item Details</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <FormField label="Name" style={{ gridColumn: '1 / -1' }}>
            <input style={inputStyle} value={item.name} onChange={e => update('name', e.target.value)} placeholder="e.g., Cloak of Shadows" />
          </FormField>
          <FormField label="Type">
            <select style={selectStyle} value={item.type} onChange={e => update('type', e.target.value)}>
              {ITEM_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </FormField>
          <FormField label="Rarity">
            <select style={selectStyle} value={item.rarity} onChange={e => update('rarity', e.target.value)}>
              {RARITIES.map(r => <option key={r}>{r}</option>)}
            </select>
          </FormField>
          <FormField label="Weight (lbs)">
            <input type="number" style={inputStyle} value={item.weight} onChange={e => update('weight', e.target.value)} placeholder="0" />
          </FormField>
          <FormField label="Value (gp)">
            <input style={inputStyle} value={item.value} onChange={e => update('value', e.target.value)} placeholder="50" />
          </FormField>
          <FormField label="Equipment Slot">
            <select style={selectStyle} value={item.slot} onChange={e => update('slot', e.target.value)}>
              {EQUIPMENT_SLOTS.map(s => <option key={s}>{s}</option>)}
            </select>
          </FormField>
          <div style={{ display: 'flex', alignItems: 'center', paddingTop: 18 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', color: 'var(--text)', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>
              <input type="checkbox" checked={item.attunement} onChange={e => update('attunement', e.target.checked)} style={{ accentColor: '#c084fc' }} />
              Requires Attunement
            </label>
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <FormField label="Description">
          <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={item.description} onChange={e => update('description', e.target.value)} placeholder="Describe the item's properties and effects..." />
        </FormField>
      </div>

      {/* Stat Modifiers */}
      <div style={cardStyle}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: 12, fontFamily: 'var(--font-display)' }}>Stat Modifiers</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
          {ABILITIES.map(ab => (
            <div key={ab} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#c084fc', marginBottom: 4, fontFamily: 'var(--font-mono)' }}>{ab}</div>
              <input
                type="number" style={{ ...inputStyle, textAlign: 'center', padding: '6px 4px' }}
                value={item.modifiers[ab]}
                onChange={e => setItem(prev => ({ ...prev, modifiers: { ...prev.modifiers, [ab]: Number(e.target.value) || 0 } }))}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleSave} style={btnPrimary}><Save size={12} /> Save Item</button>
        <button onClick={handleAddToInventory} style={btnSecondary}><Shield size={12} /> Add to Inventory</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Library View
   ═══════════════════════════════════════════════════════════════════ */
function LibraryView({ library, onDelete, onEdit }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const fileInputRef = useRef(null);

  const filtered = useMemo(() => {
    let items = [];
    if (filter === 'all' || filter === 'monsters') items = [...items, ...library.monsters.map(m => ({ ...m, _type: 'monster' }))];
    if (filter === 'all' || filter === 'spells') items = [...items, ...library.spells.map(s => ({ ...s, _type: 'spell' }))];
    if (filter === 'all' || filter === 'items') items = [...items, ...library.items.map(i => ({ ...i, _type: 'item' }))];
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(i => i.name.toLowerCase().includes(q));
    }
    return items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }, [library, filter, search]);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(library, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codex-homebrew-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Homebrew library exported');
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.monsters && !data.spells && !data.items) {
          toast.error('Invalid homebrew file format');
          return;
        }
        const lib = loadLibrary();
        const existingIds = new Set([...lib.monsters, ...lib.spells, ...lib.items].map(x => x.id));
        if (data.monsters) lib.monsters = [...lib.monsters, ...data.monsters.map(m => ({ ...m, id: m.id || genId() })).filter(m => !existingIds.has(m.id))];
        if (data.spells) lib.spells = [...lib.spells, ...data.spells.map(s => ({ ...s, id: s.id || genId() })).filter(s => !existingIds.has(s.id))];
        if (data.items) lib.items = [...lib.items, ...data.items.map(i => ({ ...i, id: i.id || genId() })).filter(i => !existingIds.has(i.id))];
        saveLibrary(lib);
        onEdit(lib);
        toast.success(`Imported ${(data.monsters?.length || 0) + (data.spells?.length || 0) + (data.items?.length || 0)} items`);
      } catch {
        toast.error('Failed to parse import file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const typeColors = { monster: '#ef4444', spell: '#c4b5fd', item: '#4ade80' };
  const typeIcons = { monster: Hammer, spell: Wand2, item: Package };

  return (
    <div>
      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-mute)' }} />
          <input style={{ ...inputStyle, paddingLeft: 28 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search homebrew..." />
        </div>
        <select style={{ ...selectStyle, width: 'auto', minWidth: 100 }} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Types</option>
          <option value="monsters">Monsters</option>
          <option value="spells">Spells</option>
          <option value="items">Items</option>
        </select>
        <button onClick={handleExport} style={btnSecondary}><Download size={12} /> Export</button>
        <button onClick={() => fileInputRef.current?.click()} style={btnSecondary}><Upload size={12} /> Import</button>
        <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Monsters', count: library.monsters.length, color: '#ef4444' },
          { label: 'Spells', count: library.spells.length, color: '#c4b5fd' },
          { label: 'Items', count: library.items.length, color: '#4ade80' },
        ].map(s => (
          <div key={s.label} style={{ ...cardStyle, flex: 1, textAlign: 'center', marginBottom: 0, padding: 12 }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: s.color, fontFamily: 'var(--font-display)' }}>{s.count}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-mute)', fontSize: '13px', fontFamily: 'var(--font-ui)' }}>
          {search ? 'No matching homebrew content found' : 'Your homebrew library is empty. Create something!'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.map(item => {
            const TypeIcon = typeIcons[item._type];
            return (
              <div key={item.id} style={{
                ...cardStyle, marginBottom: 0, padding: '10px 14px',
                display: 'flex', alignItems: 'center', gap: 10,
                transition: 'border-color 0.15s',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: `${typeColors[item._type]}15`,
                  border: `1px solid ${typeColors[item._type]}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <TypeIcon size={14} style={{ color: typeColors[item._type] }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-ui)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-mute)', fontFamily: 'var(--font-ui)' }}>
                    {item._type === 'monster' && `CR ${item.cr} ${item.type}`}
                    {item._type === 'spell' && `${item.level === 0 ? 'Cantrip' : `Level ${item.level}`} ${item.school}`}
                    {item._type === 'item' && `${item.rarity} ${item.type}`}
                  </div>
                </div>
                <button
                  onClick={() => {
                    const json = JSON.stringify(item, null, 2);
                    navigator.clipboard.writeText(json).then(() => toast.success('Copied to clipboard')).catch(() => toast.error('Failed to copy'));
                  }}
                  style={{ ...btnSecondary, padding: '5px 8px' }}
                  title="Copy JSON"
                >
                  <Copy size={12} />
                </button>
                <button
                  onClick={() => onDelete(item._type, item.id)}
                  style={{ ...btnSecondary, padding: '5px 8px', color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Main HomebrewBuilder Component
   ═══════════════════════════════════════════════════════════════════ */
const TABS = [
  { id: 'monster', label: 'Monster', icon: Hammer },
  { id: 'spell', label: 'Spell', icon: Wand2 },
  { id: 'item', label: 'Item', icon: Package },
  { id: 'library', label: 'Library', icon: Shield },
];

export default function HomebrewBuilder({ characterId }) {
  const [tab, setTab] = useState('monster');
  const [library, setLibrary] = useState(loadLibrary);

  const saveMonster = useCallback((monster) => {
    setLibrary(prev => {
      const next = { ...prev, monsters: [...prev.monsters, monster] };
      saveLibrary(next);
      return next;
    });
  }, []);

  const saveSpell = useCallback((spell) => {
    setLibrary(prev => {
      const next = { ...prev, spells: [...prev.spells, spell] };
      saveLibrary(next);
      return next;
    });
  }, []);

  const saveItem = useCallback((item) => {
    setLibrary(prev => {
      const next = { ...prev, items: [...prev.items, item] };
      saveLibrary(next);
      return next;
    });
  }, []);

  const deleteEntry = useCallback((type, id) => {
    setLibrary(prev => {
      const key = type === 'monster' ? 'monsters' : type === 'spell' ? 'spells' : 'items';
      const next = { ...prev, [key]: prev[key].filter(e => e.id !== id) };
      saveLibrary(next);
      return next;
    });
    toast.success('Deleted from library');
  }, []);

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <Hammer size={20} style={{ color: '#c084fc' }} />
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', margin: 0 }}>
            Homebrew Content Builder
          </h2>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-mute)', fontFamily: 'var(--font-ui)', margin: 0 }}>
          Create custom monsters, spells, and items for your campaign. Free forever.
        </p>
      </div>

      {/* Tab Bar */}
      <div style={{
        display: 'flex', gap: 2, marginBottom: 20, padding: 3,
        background: 'rgba(255,255,255,0.02)', borderRadius: 10,
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        {TABS.map(t => {
          const active = tab === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id} onClick={() => setTab(t.id)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '10px 12px', borderRadius: 8, border: 'none',
                background: active ? 'rgba(192,132,252,0.15)' : 'transparent',
                color: active ? '#c084fc' : 'var(--text-dim)',
                fontSize: '12px', fontWeight: active ? 600 : 400,
                fontFamily: 'var(--font-ui)', cursor: 'pointer',
                transition: 'all 0.15s',
                borderBottom: active ? '2px solid #c084fc' : '2px solid transparent',
              }}
            >
              <Icon size={14} />
              {t.label}
              {t.id === 'library' && (
                <span style={{
                  fontSize: '9px', fontWeight: 700, padding: '1px 5px',
                  borderRadius: 10, background: 'rgba(192,132,252,0.15)',
                  color: '#c084fc', fontFamily: 'var(--font-mono)',
                }}>
                  {library.monsters.length + library.spells.length + library.items.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {tab === 'monster' && <MonsterBuilder onSave={saveMonster} />}
          {tab === 'spell' && <SpellBuilder onSave={saveSpell} characterId={characterId} />}
          {tab === 'item' && <ItemBuilder onSave={saveItem} characterId={characterId} />}
          {tab === 'library' && <LibraryView library={library} onDelete={deleteEntry} onEdit={setLibrary} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
