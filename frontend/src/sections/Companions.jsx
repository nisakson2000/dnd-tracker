import { useState, useEffect, useCallback } from 'react';
import { PawPrint, Plus, Trash2, Edit3, Heart, Shield, Zap, ChevronDown, ChevronUp, ToggleLeft, ToggleRight, X, Minus, Swords, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { invoke } from '@tauri-apps/api/core';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmDialog from '../components/ConfirmDialog';
import ModalPortal from '../components/ModalPortal';

const CREATURE_TYPES = [
  { value: 'familiar', label: 'Familiar' },
  { value: 'beast_companion', label: 'Beast Companion' },
  { value: 'mount', label: 'Mount' },
  { value: 'summoned', label: 'Summoned' },
  { value: 'sidekick', label: 'Sidekick' },
];

const CREATURE_TYPE_LABELS = Object.fromEntries(CREATURE_TYPES.map(t => [t.value, t.label]));

const CREATURE_TYPE_COLORS = {
  familiar: { bg: 'rgba(139,92,246,0.12)', text: '#a78bfa', border: 'rgba(139,92,246,0.3)' },
  beast_companion: { bg: 'rgba(34,197,94,0.12)', text: '#4ade80', border: 'rgba(34,197,94,0.3)' },
  mount: { bg: 'rgba(234,179,8,0.12)', text: '#facc15', border: 'rgba(234,179,8,0.3)' },
  summoned: { bg: 'rgba(59,130,246,0.12)', text: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
  sidekick: { bg: 'rgba(244,114,182,0.12)', text: '#f472b6', border: 'rgba(244,114,182,0.3)' },
};

const ABILITY_NAMES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
const ABILITY_KEYS = ['str_score', 'dex_score', 'con_score', 'int_score', 'wis_score', 'cha_score'];

const EMPTY_COMPANION = {
  id: null,
  name: '',
  creature_type: 'familiar',
  species: '',
  hp_current: 10,
  hp_max: 10,
  ac: 10,
  speed: '30 ft.',
  str_score: 10, dex_score: 10, con_score: 10,
  int_score: 10, wis_score: 10, cha_score: 10,
  attacks_json: '[]',
  abilities_json: '[]',
  senses: '',
  notes: '',
  active: 1,
};

function abilityMod(score) {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

function hpColor(current, max) {
  if (!max) return '#4ade80';
  const pct = current / max;
  if (pct <= 0.1) return '#ef4444';
  if (pct <= 0.25) return '#f97316';
  if (pct <= 0.5) return '#eab308';
  return '#4ade80';
}

function parseJson(str, fallback = []) {
  try { return JSON.parse(str || '[]'); } catch { return fallback; }
}

/* ── Preset companions (5e SRD) ── */
const PRESET_COMPANIONS = [
  // Familiars (Find Familiar spell)
  { name: 'Bat', species: 'Bat', creature_type: 'familiar', ac: 12, hp_max: 1, hp_current: 1, speed: '5 ft., fly 30 ft.', str_score: 2, dex_score: 15, con_score: 8, int_score: 2, wis_score: 12, cha_score: 4, senses: 'Blindsight 60 ft., passive Perception 11', attacks_json: JSON.stringify([{ name: 'Bite', bonus: '+0', damage: '1 piercing', type: 'Piercing' }]), abilities_json: JSON.stringify([{ name: 'Echolocation', description: 'Can\'t use blindsight while deafened.' }, { name: 'Keen Hearing', description: 'Advantage on Perception checks that rely on hearing.' }]) },
  { name: 'Cat', species: 'Cat', creature_type: 'familiar', ac: 12, hp_max: 2, hp_current: 2, speed: '40 ft., climb 30 ft.', str_score: 3, dex_score: 15, con_score: 10, int_score: 3, wis_score: 12, cha_score: 7, senses: 'Darkvision 30 ft., passive Perception 13', attacks_json: JSON.stringify([{ name: 'Claws', bonus: '+0', damage: '1 slashing', type: 'Slashing' }]), abilities_json: JSON.stringify([{ name: 'Keen Smell', description: 'Advantage on Perception checks that rely on smell.' }]) },
  { name: 'Hawk', species: 'Hawk', creature_type: 'familiar', ac: 13, hp_max: 1, hp_current: 1, speed: '10 ft., fly 60 ft.', str_score: 5, dex_score: 16, con_score: 8, int_score: 2, wis_score: 14, cha_score: 6, senses: 'Passive Perception 14', attacks_json: JSON.stringify([{ name: 'Talons', bonus: '+5', damage: '1 slashing', type: 'Slashing' }]), abilities_json: JSON.stringify([{ name: 'Keen Sight', description: 'Advantage on Perception checks that rely on sight.' }]) },
  { name: 'Owl', species: 'Owl', creature_type: 'familiar', ac: 11, hp_max: 1, hp_current: 1, speed: '5 ft., fly 60 ft.', str_score: 3, dex_score: 13, con_score: 8, int_score: 2, wis_score: 12, cha_score: 7, senses: 'Darkvision 120 ft., passive Perception 13', attacks_json: JSON.stringify([{ name: 'Talons', bonus: '+3', damage: '1 slashing', type: 'Slashing' }]), abilities_json: JSON.stringify([{ name: 'Flyby', description: 'Doesn\'t provoke opportunity attacks when flying out of an enemy\'s reach.' }, { name: 'Keen Hearing & Sight', description: 'Advantage on Perception checks that rely on hearing or sight.' }]) },
  { name: 'Raven', species: 'Raven', creature_type: 'familiar', ac: 12, hp_max: 1, hp_current: 1, speed: '10 ft., fly 50 ft.', str_score: 2, dex_score: 14, con_score: 8, int_score: 2, wis_score: 12, cha_score: 6, senses: 'Passive Perception 13', attacks_json: JSON.stringify([{ name: 'Beak', bonus: '+4', damage: '1 piercing', type: 'Piercing' }]), abilities_json: JSON.stringify([{ name: 'Mimicry', description: 'Can mimic simple sounds. DC 10 Insight to determine it\'s an imitation.' }]) },
  { name: 'Frog', species: 'Frog', creature_type: 'familiar', ac: 11, hp_max: 1, hp_current: 1, speed: '20 ft., swim 20 ft.', str_score: 1, dex_score: 13, con_score: 8, int_score: 1, wis_score: 8, cha_score: 3, senses: 'Darkvision 30 ft., passive Perception 9', attacks_json: '[]', abilities_json: JSON.stringify([{ name: 'Amphibious', description: 'Can breathe air and water.' }, { name: 'Standing Leap', description: 'Long jump 10 ft., high jump 5 ft.' }]) },
  { name: 'Spider', species: 'Spider', creature_type: 'familiar', ac: 12, hp_max: 1, hp_current: 1, speed: '20 ft., climb 20 ft.', str_score: 2, dex_score: 14, con_score: 8, int_score: 1, wis_score: 10, cha_score: 2, senses: 'Darkvision 30 ft., passive Perception 10', attacks_json: JSON.stringify([{ name: 'Bite', bonus: '+4', damage: '1 piercing + DC 9 CON or 1d4 poison', type: 'Piercing' }]), abilities_json: JSON.stringify([{ name: 'Spider Climb', description: 'Can climb difficult surfaces including ceilings.' }, { name: 'Web Sense', description: 'Knows the exact location of any creature touching the same web.' }]) },
  { name: 'Weasel', species: 'Weasel', creature_type: 'familiar', ac: 13, hp_max: 1, hp_current: 1, speed: '30 ft.', str_score: 3, dex_score: 16, con_score: 8, int_score: 2, wis_score: 12, cha_score: 3, senses: 'Passive Perception 13', attacks_json: JSON.stringify([{ name: 'Bite', bonus: '+5', damage: '1 piercing', type: 'Piercing' }]), abilities_json: JSON.stringify([{ name: 'Keen Hearing & Smell', description: 'Advantage on Perception checks that rely on hearing or smell.' }]) },
  // Beast Companions
  { name: 'Wolf', species: 'Wolf', creature_type: 'beast_companion', ac: 13, hp_max: 11, hp_current: 11, speed: '40 ft.', str_score: 12, dex_score: 15, con_score: 12, int_score: 3, wis_score: 12, cha_score: 6, senses: 'Passive Perception 13', attacks_json: JSON.stringify([{ name: 'Bite', bonus: '+4', damage: '2d4+2', type: 'Piercing' }]), abilities_json: JSON.stringify([{ name: 'Pack Tactics', description: 'Advantage on attack if ally is within 5 ft. of target.' }, { name: 'Keen Hearing & Smell', description: 'Advantage on Perception checks that rely on hearing or smell.' }]) },
  { name: 'Panther', species: 'Panther', creature_type: 'beast_companion', ac: 12, hp_max: 13, hp_current: 13, speed: '50 ft., climb 40 ft.', str_score: 14, dex_score: 15, con_score: 10, int_score: 3, wis_score: 14, cha_score: 7, senses: 'Passive Perception 14', attacks_json: JSON.stringify([{ name: 'Bite', bonus: '+4', damage: '1d6+2', type: 'Piercing' }, { name: 'Claw', bonus: '+4', damage: '1d4+2', type: 'Slashing' }]), abilities_json: JSON.stringify([{ name: 'Keen Smell', description: 'Advantage on Perception checks that rely on smell.' }, { name: 'Pounce', description: 'If moves 20+ ft. and hits with claw, target must DC 12 STR save or be knocked prone. Can then bite as bonus action.' }]) },
  { name: 'Giant Badger', species: 'Giant Badger', creature_type: 'beast_companion', ac: 10, hp_max: 13, hp_current: 13, speed: '30 ft., burrow 10 ft.', str_score: 13, dex_score: 10, con_score: 15, int_score: 2, wis_score: 12, cha_score: 5, senses: 'Darkvision 30 ft., passive Perception 11', attacks_json: JSON.stringify([{ name: 'Bite', bonus: '+3', damage: '1d6+1', type: 'Piercing' }, { name: 'Claws', bonus: '+3', damage: '2d4+1', type: 'Slashing' }]), abilities_json: JSON.stringify([{ name: 'Keen Smell', description: 'Advantage on Perception checks that rely on smell.' }]) },
  { name: 'Blood Hawk', species: 'Blood Hawk', creature_type: 'beast_companion', ac: 12, hp_max: 7, hp_current: 7, speed: '10 ft., fly 60 ft.', str_score: 6, dex_score: 14, con_score: 10, int_score: 3, wis_score: 14, cha_score: 5, senses: 'Passive Perception 14', attacks_json: JSON.stringify([{ name: 'Beak', bonus: '+4', damage: '1d4+2', type: 'Piercing' }]), abilities_json: JSON.stringify([{ name: 'Keen Sight', description: 'Advantage on Perception checks that rely on sight.' }, { name: 'Pack Tactics', description: 'Advantage on attack if ally is within 5 ft. of target.' }]) },
  { name: 'Boar', species: 'Boar', creature_type: 'beast_companion', ac: 11, hp_max: 11, hp_current: 11, speed: '40 ft.', str_score: 13, dex_score: 11, con_score: 12, int_score: 2, wis_score: 9, cha_score: 5, senses: 'Passive Perception 9', attacks_json: JSON.stringify([{ name: 'Tusk', bonus: '+3', damage: '1d6+1', type: 'Slashing' }]), abilities_json: JSON.stringify([{ name: 'Charge', description: 'If moves 20+ ft. and hits with tusk, +1d6 slashing and DC 11 STR save or knocked prone.' }, { name: 'Relentless', description: 'If reduced to 0 HP by damage that isn\'t 7+, drops to 1 HP instead. Once per rest.' }]) },
  // Mounts
  { name: 'Riding Horse', species: 'Horse', creature_type: 'mount', ac: 10, hp_max: 13, hp_current: 13, speed: '60 ft.', str_score: 16, dex_score: 10, con_score: 12, int_score: 2, wis_score: 11, cha_score: 7, senses: 'Passive Perception 10', attacks_json: JSON.stringify([{ name: 'Hooves', bonus: '+5', damage: '2d4+3', type: 'Bludgeoning' }]), abilities_json: '[]' },
  { name: 'Warhorse', species: 'Horse', creature_type: 'mount', ac: 11, hp_max: 19, hp_current: 19, speed: '60 ft.', str_score: 18, dex_score: 12, con_score: 13, int_score: 2, wis_score: 12, cha_score: 7, senses: 'Passive Perception 11', attacks_json: JSON.stringify([{ name: 'Hooves', bonus: '+6', damage: '2d6+4', type: 'Bludgeoning' }]), abilities_json: JSON.stringify([{ name: 'Trampling Charge', description: 'If moves 20+ ft. and hits with hooves, DC 14 STR save or knocked prone. Can then bonus action hooves on prone target.' }]) },
  { name: 'Mastiff', species: 'Mastiff', creature_type: 'mount', ac: 12, hp_max: 5, hp_current: 5, speed: '40 ft.', str_score: 13, dex_score: 14, con_score: 12, int_score: 3, wis_score: 12, cha_score: 7, senses: 'Passive Perception 13', attacks_json: JSON.stringify([{ name: 'Bite', bonus: '+3', damage: '1d6+1', type: 'Piercing' }]), abilities_json: JSON.stringify([{ name: 'Keen Hearing & Smell', description: 'Advantage on Perception checks that rely on hearing or smell.' }]) },
  { name: 'Pony', species: 'Pony', creature_type: 'mount', ac: 10, hp_max: 11, hp_current: 11, speed: '40 ft.', str_score: 15, dex_score: 10, con_score: 13, int_score: 2, wis_score: 11, cha_score: 7, senses: 'Passive Perception 10', attacks_json: JSON.stringify([{ name: 'Hooves', bonus: '+4', damage: '2d4+2', type: 'Bludgeoning' }]), abilities_json: '[]' },
  { name: 'Mule', species: 'Mule', creature_type: 'mount', ac: 10, hp_max: 11, hp_current: 11, speed: '40 ft.', str_score: 14, dex_score: 10, con_score: 13, int_score: 2, wis_score: 10, cha_score: 5, senses: 'Passive Perception 10', attacks_json: JSON.stringify([{ name: 'Hooves', bonus: '+2', damage: '1d4+2', type: 'Bludgeoning' }]), abilities_json: JSON.stringify([{ name: 'Beast of Burden', description: 'Considered Large for carrying capacity.' }, { name: 'Sure-Footed', description: 'Advantage on saves against being knocked prone.' }]) },
  // More beast companions
  { name: 'Giant Poisonous Snake', species: 'Giant Poisonous Snake', creature_type: 'beast_companion', ac: 14, hp_max: 11, hp_current: 11, speed: '30 ft., swim 30 ft.', str_score: 10, dex_score: 18, con_score: 13, int_score: 2, wis_score: 10, cha_score: 3, senses: 'Blindsight 10 ft., passive Perception 10', attacks_json: JSON.stringify([{ name: 'Bite', bonus: '+6', damage: '1d4+4 + 3d6 poison (DC 11 CON half)', type: 'Piercing' }]), abilities_json: '[]' },
  { name: 'Giant Wolf Spider', species: 'Giant Wolf Spider', creature_type: 'beast_companion', ac: 13, hp_max: 11, hp_current: 11, speed: '40 ft., climb 40 ft.', str_score: 12, dex_score: 16, con_score: 13, int_score: 3, wis_score: 12, cha_score: 4, senses: 'Blindsight 10 ft., Darkvision 60 ft., passive Perception 13', attacks_json: JSON.stringify([{ name: 'Bite', bonus: '+3', damage: '1d6+1 + 2d6 poison (DC 11 CON half)', type: 'Piercing' }]), abilities_json: JSON.stringify([{ name: 'Spider Climb', description: 'Can climb difficult surfaces including ceilings.' }, { name: 'Web Sense', description: 'Knows exact location of any creature touching same web.' }]) },
  { name: 'Ape', species: 'Ape', creature_type: 'beast_companion', ac: 12, hp_max: 19, hp_current: 19, speed: '30 ft., climb 30 ft.', str_score: 16, dex_score: 14, con_score: 14, int_score: 6, wis_score: 12, cha_score: 7, senses: 'Passive Perception 13', attacks_json: JSON.stringify([{ name: 'Fist', bonus: '+5', damage: '1d6+3', type: 'Bludgeoning' }, { name: 'Rock', bonus: '+5', damage: '1d6+3', type: 'Bludgeoning' }]), abilities_json: '[]' },
  { name: 'Black Bear', species: 'Black Bear', creature_type: 'beast_companion', ac: 11, hp_max: 19, hp_current: 19, speed: '40 ft., climb 30 ft.', str_score: 15, dex_score: 10, con_score: 14, int_score: 2, wis_score: 12, cha_score: 7, senses: 'Passive Perception 13', attacks_json: JSON.stringify([{ name: 'Bite', bonus: '+4', damage: '1d6+2', type: 'Piercing' }, { name: 'Claws', bonus: '+4', damage: '2d4+2', type: 'Slashing' }]), abilities_json: JSON.stringify([{ name: 'Keen Smell', description: 'Advantage on Perception checks that rely on smell.' }]) },
  { name: 'Giant Frog', species: 'Giant Frog', creature_type: 'beast_companion', ac: 11, hp_max: 18, hp_current: 18, speed: '30 ft., swim 30 ft.', str_score: 12, dex_score: 13, con_score: 11, int_score: 2, wis_score: 10, cha_score: 3, senses: 'Darkvision 30 ft., passive Perception 10', attacks_json: JSON.stringify([{ name: 'Bite', bonus: '+3', damage: '1d6+1', type: 'Piercing' }]), abilities_json: JSON.stringify([{ name: 'Amphibious', description: 'Can breathe air and water.' }, { name: 'Swallow', description: 'On hit vs Small or smaller, target is grappled and swallowed. Swallowed creature is blinded, restrained, takes 2d4 acid damage per turn.' }]) },
  // Summoned creatures
  { name: 'Quasit', species: 'Quasit', creature_type: 'summoned', ac: 13, hp_max: 7, hp_current: 7, speed: '40 ft.', str_score: 5, dex_score: 17, con_score: 10, int_score: 7, wis_score: 10, cha_score: 10, senses: 'Darkvision 120 ft., passive Perception 10', attacks_json: JSON.stringify([{ name: 'Claws', bonus: '+4', damage: '1d4+3 + 2d4 poison (DC 10 CON)', type: 'Piercing' }]), abilities_json: JSON.stringify([{ name: 'Shapechanger', description: 'Can polymorph into bat, centipede, or toad form.' }, { name: 'Magic Resistance', description: 'Advantage on saves against spells and magical effects.' }, { name: 'Invisibility', description: 'Turns invisible until it attacks or concentration ends.' }]) },
  { name: 'Pseudodragon', species: 'Pseudodragon', creature_type: 'summoned', ac: 13, hp_max: 7, hp_current: 7, speed: '15 ft., fly 60 ft.', str_score: 6, dex_score: 15, con_score: 13, int_score: 10, wis_score: 12, cha_score: 10, senses: 'Blindsight 10 ft., Darkvision 60 ft., passive Perception 13', attacks_json: JSON.stringify([{ name: 'Bite', bonus: '+4', damage: '1d4+2', type: 'Piercing' }, { name: 'Sting', bonus: '+4', damage: '1d4+2 + DC 11 CON or poisoned 1 hr', type: 'Piercing' }]), abilities_json: JSON.stringify([{ name: 'Keen Senses', description: 'Advantage on Perception checks that rely on sight, hearing, or smell.' }, { name: 'Magic Resistance', description: 'Advantage on saves against spells and magical effects.' }, { name: 'Limited Telepathy', description: 'Communicate simple ideas and emotions to bonded creature within 100 ft.' }]) },
  { name: 'Imp', species: 'Imp', creature_type: 'summoned', ac: 13, hp_max: 10, hp_current: 10, speed: '20 ft., fly 40 ft.', str_score: 6, dex_score: 17, con_score: 13, int_score: 11, wis_score: 12, cha_score: 14, senses: 'Darkvision 120 ft., passive Perception 11', attacks_json: JSON.stringify([{ name: 'Sting', bonus: '+5', damage: '1d4+3 + 3d6 poison (DC 11 CON half)', type: 'Piercing' }]), abilities_json: JSON.stringify([{ name: 'Shapechanger', description: 'Can polymorph into rat, raven, or spider form.' }, { name: 'Devil\'s Sight', description: 'Magical darkness doesn\'t impede vision.' }, { name: 'Magic Resistance', description: 'Advantage on saves against spells and magical effects.' }, { name: 'Invisibility', description: 'Turns invisible until it attacks or concentration ends.' }]) },
];

/* ── Numeric input with up/down arrows ── */
function NumericInput({ value, onChange, style, min, max, step = 1 }) {
  const adjust = (delta) => {
    let next = (parseInt(value) || 0) + delta;
    if (min != null) next = Math.max(min, next);
    if (max != null) next = Math.min(max, next);
    onChange(next);
  };
  const arrowStyle = {
    background: 'none', border: 'none', color: 'rgba(201,168,76,0.5)',
    cursor: 'pointer', padding: '0 2px', fontSize: 10, lineHeight: 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <input
        style={style}
        type="number"
        value={value}
        onChange={e => onChange(parseInt(e.target.value) || 0)}
      />
      <div style={{ position: 'absolute', right: 4, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0 }}>
        <button type="button" onClick={() => adjust(step)} style={arrowStyle} tabIndex={-1}><ChevronUp size={12} /></button>
        <button type="button" onClick={() => adjust(-step)} style={arrowStyle} tabIndex={-1}><ChevronDown size={12} /></button>
      </div>
    </div>
  );
}

// ── Companion Form Modal ──
function CompanionFormModal({ companion, onSave, onClose }) {
  const [form, setForm] = useState(() => ({ ...EMPTY_COMPANION, ...companion }));
  const [attacks, setAttacks] = useState(() => parseJson(companion?.attacks_json));
  const [abilities, setAbilities] = useState(() => parseJson(companion?.abilities_json));
  const [presetSearch, setPresetSearch] = useState('');
  const [showPresets, setShowPresets] = useState(!companion?.id); // show presets for new companions

  const isEdit = !!companion?.id;

  const updateField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const applyPreset = (preset) => {
    setForm(prev => ({ ...prev, ...preset, id: prev.id, active: prev.active }));
    setAttacks(parseJson(preset.attacks_json));
    setAbilities(parseJson(preset.abilities_json));
    setShowPresets(false);
    setPresetSearch('');
  };

  const filteredPresets = presetSearch.trim()
    ? PRESET_COMPANIONS.filter(p => p.name.toLowerCase().includes(presetSearch.toLowerCase()) || p.creature_type.toLowerCase().includes(presetSearch.toLowerCase()))
    : PRESET_COMPANIONS;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Companion name is required'); return; }
    onSave({
      ...form,
      name: form.name.trim(),
      attacks_json: JSON.stringify(attacks),
      abilities_json: JSON.stringify(abilities),
    });
  };

  const addAttack = () => setAttacks(prev => [...prev, { name: '', bonus: '', damage: '', type: '' }]);
  const removeAttack = (i) => setAttacks(prev => prev.filter((_, idx) => idx !== i));
  const updateAttack = (i, key, val) => setAttacks(prev => prev.map((a, idx) => idx === i ? { ...a, [key]: val } : a));

  const addAbility = () => setAbilities(prev => [...prev, { name: '', description: '' }]);
  const removeAbility = (i) => setAbilities(prev => prev.filter((_, idx) => idx !== i));
  const updateAbility = (i, key, val) => setAbilities(prev => prev.map((a, idx) => idx === i ? { ...a, [key]: val } : a));

  const inputStyle = {
    width: '100%', padding: '8px 10px', borderRadius: 6,
    border: '1px solid rgba(201,168,76,0.2)', background: 'rgba(255,255,255,0.04)',
    color: 'var(--text)', fontSize: '13px', fontFamily: 'var(--font-ui)',
    outline: 'none', transition: 'border-color 0.15s',
  };

  const labelStyle = {
    display: 'block', fontSize: '11px', fontWeight: 600,
    color: 'rgba(201,168,76,0.7)', marginBottom: 4,
    fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.05em',
  };

  return (
    <ModalPortal>
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'relative', width: '90%', maxWidth: 640, maxHeight: '85vh', overflowY: 'auto',
            background: 'linear-gradient(135deg, rgba(15,15,25,0.98), rgba(4,4,11,0.99))',
            border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12,
            padding: 28, boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, color: '#c9a84c', margin: 0 }}>
              {isEdit ? 'Edit Companion' : 'Add Companion'}
            </h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 4 }}>
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Preset selector */}
            {!isEdit && (
              <div style={{ marginBottom: 16 }}>
                <button
                  type="button"
                  onClick={() => setShowPresets(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                    background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)',
                    color: '#a78bfa', cursor: 'pointer', fontFamily: 'var(--font-ui)', transition: 'all 0.15s',
                  }}
                >
                  <PawPrint size={12} />
                  {showPresets ? 'Hide Presets' : 'Choose from Presets'}
                  {showPresets ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                <span style={{ fontSize: 10, color: 'var(--text-mute)', marginLeft: 10 }}>or fill in manually below</span>

                {showPresets && (
                  <div style={{ marginTop: 8, padding: 10, background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 8 }}>
                    <div style={{ position: 'relative', marginBottom: 8 }}>
                      <Search size={12} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-mute)' }} />
                      <input
                        style={{ ...inputStyle, paddingLeft: 26, fontSize: 11 }}
                        placeholder="Search presets..."
                        value={presetSearch}
                        onChange={e => setPresetSearch(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {filteredPresets.map(p => {
                        const colors = CREATURE_TYPE_COLORS[p.creature_type] || CREATURE_TYPE_COLORS.familiar;
                        return (
                          <button
                            key={p.name}
                            type="button"
                            onClick={() => applyPreset(p)}
                            style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              padding: '6px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.06)',
                              background: 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.08)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                          >
                            <div>
                              <span style={{ fontSize: 12, color: 'var(--text)', fontWeight: 600 }}>{p.name}</span>
                              <span style={{ fontSize: 10, color: 'var(--text-mute)', marginLeft: 6 }}>AC {p.ac} · {p.hp_max} HP · {p.speed}</span>
                            </div>
                            <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, fontWeight: 600 }}>
                              {CREATURE_TYPE_LABELS[p.creature_type]}
                            </span>
                          </button>
                        );
                      })}
                      {filteredPresets.length === 0 && (
                        <p style={{ fontSize: 11, color: 'var(--text-mute)', textAlign: 'center', padding: 8 }}>No presets match "{presetSearch}"</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Basic info row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Name *</label>
                <input style={inputStyle} value={form.name} onChange={e => updateField('name', e.target.value)} placeholder="e.g. Shadow" autoFocus />
              </div>
              <div>
                <label style={labelStyle}>Species</label>
                <input style={inputStyle} value={form.species} onChange={e => updateField('species', e.target.value)} placeholder="e.g. Owl, Wolf" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Type</label>
                <select
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  value={form.creature_type}
                  onChange={e => updateField('creature_type', e.target.value)}
                >
                  {CREATURE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>AC</label>
                <NumericInput style={{ ...inputStyle, paddingRight: 22 }} value={form.ac} onChange={v => updateField('ac', v)} min={0} />
              </div>
              <div>
                <label style={labelStyle}>Speed</label>
                <input style={inputStyle} value={form.speed} onChange={e => updateField('speed', e.target.value)} placeholder="30 ft." />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>HP Current</label>
                <NumericInput style={{ ...inputStyle, paddingRight: 22 }} value={form.hp_current} onChange={v => updateField('hp_current', v)} min={0} />
              </div>
              <div>
                <label style={labelStyle}>HP Max</label>
                <NumericInput style={{ ...inputStyle, paddingRight: 22 }} value={form.hp_max} onChange={v => updateField('hp_max', v)} min={1} />
              </div>
            </div>

            {/* Ability Scores */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ ...labelStyle, marginBottom: 8 }}>Ability Scores</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
                {ABILITY_NAMES.map((name, i) => (
                  <div key={name} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(201,168,76,0.5)', marginBottom: 4, fontFamily: 'var(--font-ui)' }}>{name}</div>
                    <NumericInput
                      style={{ ...inputStyle, textAlign: 'center', padding: '6px 18px 6px 4px' }}
                      value={form[ABILITY_KEYS[i]]}
                      onChange={v => updateField(ABILITY_KEYS[i], v)}
                      min={1}
                      max={30}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Senses */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Senses</label>
              <input style={inputStyle} value={form.senses} onChange={e => updateField('senses', e.target.value)} placeholder="Darkvision 60 ft., passive Perception 13" />
            </div>

            {/* Attacks */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ ...labelStyle, margin: 0 }}>Attacks</label>
                <button type="button" onClick={addAttack} style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 6, color: '#c9a84c', cursor: 'pointer', padding: '3px 10px', fontSize: 11, fontFamily: 'var(--font-ui)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Plus size={12} /> Add
                </button>
              </div>
              {attacks.map((atk, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr 1.5fr auto', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                  <input style={{ ...inputStyle, fontSize: 12 }} value={atk.name} onChange={e => updateAttack(i, 'name', e.target.value)} placeholder="Name" />
                  <input style={{ ...inputStyle, fontSize: 12 }} value={atk.bonus} onChange={e => updateAttack(i, 'bonus', e.target.value)} placeholder="+5" />
                  <input style={{ ...inputStyle, fontSize: 12 }} value={atk.damage} onChange={e => updateAttack(i, 'damage', e.target.value)} placeholder="1d6+3" />
                  <input style={{ ...inputStyle, fontSize: 12 }} value={atk.type} onChange={e => updateAttack(i, 'type', e.target.value)} placeholder="Piercing" />
                  <button type="button" onClick={() => removeAttack(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4 }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Special Abilities */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ ...labelStyle, margin: 0 }}>Special Abilities</label>
                <button type="button" onClick={addAbility} style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 6, color: '#c9a84c', cursor: 'pointer', padding: '3px 10px', fontSize: 11, fontFamily: 'var(--font-ui)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Plus size={12} /> Add
                </button>
              </div>
              {abilities.map((ab, i) => (
                <div key={i} style={{ marginBottom: 8, padding: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8 }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
                    <input style={{ ...inputStyle, fontSize: 12 }} value={ab.name} onChange={e => updateAbility(i, 'name', e.target.value)} placeholder="Ability name" />
                    <button type="button" onClick={() => removeAbility(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4, flexShrink: 0 }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <textarea
                    style={{ ...inputStyle, resize: 'vertical', minHeight: 48, fontSize: 12 }}
                    value={ab.description}
                    onChange={e => updateAbility(i, 'description', e.target.value)}
                    placeholder="Describe the ability..."
                  />
                </div>
              ))}
            </div>

            {/* Notes */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Notes</label>
              <textarea
                style={{ ...inputStyle, resize: 'vertical', minHeight: 60 }}
                value={form.notes}
                onChange={e => updateField('notes', e.target.value)}
                placeholder="Additional notes..."
              />
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button type="button" onClick={onClose} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'var(--text-dim)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-ui)' }}>
                Cancel
              </button>
              <button type="submit" style={{ padding: '8px 24px', borderRadius: 8, border: '1px solid rgba(201,168,76,0.4)', background: 'rgba(201,168,76,0.15)', color: '#c9a84c', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-ui)', fontWeight: 600 }}>
                {isEdit ? 'Save Changes' : 'Add Companion'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </ModalPortal>
  );
}

// ── Companion Card ──
function CompanionCard({ companion, onEdit, onDelete, onToggleActive, onHpChange }) {
  const [expanded, setExpanded] = useState(false);
  const attacks = parseJson(companion.attacks_json);
  const abilities = parseJson(companion.abilities_json);
  const typeColors = CREATURE_TYPE_COLORS[companion.creature_type] || CREATURE_TYPE_COLORS.familiar;
  const isActive = companion.active === 1;
  const color = hpColor(companion.hp_current, companion.hp_max);
  const hpPct = companion.hp_max > 0 ? Math.min(100, Math.max(0, (companion.hp_current / companion.hp_max) * 100)) : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      style={{
        background: isActive ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
        border: `1px solid ${isActive ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 12, overflow: 'hidden',
        opacity: isActive ? 1 : 0.6,
        transition: 'opacity 0.2s, border-color 0.2s',
      }}
    >
      {/* Header row */}
      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Icon */}
        <div style={{
          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
          background: `linear-gradient(135deg, ${typeColors.bg}, rgba(201,168,76,0.05))`,
          border: `1px solid ${typeColors.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <PawPrint size={18} style={{ color: typeColors.text }} />
        </div>

        {/* Name + type */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'calc(15px * var(--font-scale, 1))', color: 'var(--text)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {companion.name}
            </span>
            <span style={{
              fontSize: 9, fontWeight: 600, padding: '1px 8px', borderRadius: 4,
              background: typeColors.bg, color: typeColors.text, border: `1px solid ${typeColors.border}`,
              fontFamily: 'var(--font-ui)', letterSpacing: '0.04em', textTransform: 'uppercase', flexShrink: 0,
            }}>
              {CREATURE_TYPE_LABELS[companion.creature_type] || companion.creature_type}
            </span>
            {!isActive && (
              <span style={{ fontSize: 9, fontWeight: 600, padding: '1px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: 'var(--text-mute)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-ui)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Dismissed
              </span>
            )}
          </div>
          {companion.species && (
            <div style={{ fontSize: 'calc(11px * var(--font-scale, 1))', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)' }}>
              {companion.species}
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          {/* HP bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button onClick={() => onHpChange(companion, -1)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, color: '#ef4444', cursor: 'pointer', padding: '2px 6px', display: 'flex', alignItems: 'center' }}>
              <Minus size={12} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 80 }}>
              <Heart size={13} style={{ color, flexShrink: 0 }} />
              <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', minWidth: 40 }}>
                <div style={{ height: '100%', width: `${hpPct}%`, background: color, borderRadius: 3, transition: 'width 0.3s' }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: 'var(--font-ui)', whiteSpace: 'nowrap' }}>
                {companion.hp_current}/{companion.hp_max}
              </span>
            </div>
            <button onClick={() => onHpChange(companion, 1)} style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 6, color: '#4ade80', cursor: 'pointer', padding: '2px 6px', display: 'flex', alignItems: 'center' }}>
              <Plus size={12} />
            </button>
          </div>

          {/* AC */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Shield size={13} style={{ color: 'rgba(201,168,76,0.6)' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>{companion.ac}</span>
          </div>

          {/* Speed */}
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-ui)', whiteSpace: 'nowrap' }}>
            {companion.speed}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <button
            onClick={() => onToggleActive(companion)}
            title={isActive ? 'Dismiss' : 'Summon'}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: isActive ? '#4ade80' : 'var(--text-mute)', transition: 'color 0.15s' }}
          >
            {isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
          </button>
          <button onClick={() => onEdit(companion)} title="Edit" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--text-dim)', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#c9a84c'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
          >
            <Edit3 size={15} />
          </button>
          <button onClick={() => onDelete(companion)} title="Delete" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--text-dim)', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
          >
            <Trash2 size={15} />
          </button>
          <button onClick={() => setExpanded(!expanded)} title={expanded ? 'Collapse' : 'Expand'} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--text-dim)', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Expanded stat block */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {/* Ability scores */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, margin: '14px 0' }}>
                {ABILITY_NAMES.map((name, i) => {
                  const score = companion[ABILITY_KEYS[i]];
                  return (
                    <div key={name} style={{ textAlign: 'center', padding: '8px 4px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(201,168,76,0.5)', fontFamily: 'var(--font-ui)', letterSpacing: '0.1em', marginBottom: 2 }}>{name}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-ui)', lineHeight: 1.2 }}>{score}</div>
                      <div style={{ fontSize: 11, color: 'rgba(201,168,76,0.7)', fontFamily: 'var(--font-ui)' }}>{abilityMod(score)}</div>
                    </div>
                  );
                })}
              </div>

              {/* Senses */}
              {companion.senses && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(201,168,76,0.6)', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Senses</div>
                  <div style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--font-ui)' }}>{companion.senses}</div>
                </div>
              )}

              {/* Attacks */}
              {attacks.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(201,168,76,0.6)', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Attacks</div>
                  {attacks.map((atk, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: 6, marginBottom: 4 }}>
                      <Swords size={12} style={{ color: '#f87171', flexShrink: 0 }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>{atk.name || 'Attack'}</span>
                      {atk.bonus && <span style={{ fontSize: 11, color: '#4ade80', fontFamily: 'var(--font-ui)' }}>{atk.bonus.startsWith('+') ? atk.bonus : `+${atk.bonus}`}</span>}
                      {atk.damage && <span style={{ fontSize: 11, color: '#f87171', fontFamily: 'var(--font-ui)' }}>{atk.damage}</span>}
                      {atk.type && <span style={{ fontSize: 10, color: 'var(--text-mute)', fontFamily: 'var(--font-ui)' }}>{atk.type}</span>}
                    </div>
                  ))}
                </div>
              )}

              {/* Special abilities */}
              {abilities.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(201,168,76,0.6)', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Special Abilities</div>
                  {abilities.map((ab, i) => (
                    <div key={i} style={{ padding: '8px 10px', background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.1)', borderRadius: 6, marginBottom: 4 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#a78bfa', fontFamily: 'var(--font-ui)', marginBottom: 2 }}>
                        <Zap size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: '-1px' }} />
                        {ab.name || 'Ability'}
                      </div>
                      {ab.description && <div style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-ui)', lineHeight: 1.5 }}>{ab.description}</div>}
                    </div>
                  ))}
                </div>
              )}

              {/* Notes */}
              {companion.notes && (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(201,168,76,0.6)', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Notes</div>
                  <div style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--font-ui)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{companion.notes}</div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main Section ──
export default function Companions({ characterId }) {
  const [companions, setCompanions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCompanion, setEditingCompanion] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchCompanions = useCallback(async () => {
    try {
      const data = await invoke('get_companions', { characterId });
      setCompanions(data || []);
    } catch (err) {
      console.error('Failed to load companions:', err);
      toast.error('Failed to load companions');
    } finally {
      setLoading(false);
    }
  }, [characterId]);

  useEffect(() => { fetchCompanions(); }, [fetchCompanions]);

  const handleSave = async (payload) => {
    try {
      if (payload.id) {
        await invoke('update_companion', { characterId, companionId: payload.id, payload });
        toast.success('Companion updated');
      } else {
        await invoke('add_companion', { characterId, payload });
        toast.success('Companion added');
      }
      setShowForm(false);
      setEditingCompanion(null);
      fetchCompanions();
    } catch (err) {
      console.error('Failed to save companion:', err);
      toast.error('Failed to save companion');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await invoke('delete_companion', { characterId, companionId: deleteTarget.id });
      toast.success(`${deleteTarget.name} removed`);
      setDeleteTarget(null);
      fetchCompanions();
    } catch (err) {
      console.error('Failed to delete companion:', err);
      toast.error('Failed to delete companion');
    }
  };

  const handleToggleActive = async (companion) => {
    try {
      const updated = { ...companion, active: companion.active === 1 ? 0 : 1 };
      await invoke('update_companion', { characterId, companionId: companion.id, payload: updated });
      toast.success(updated.active ? `${companion.name} summoned` : `${companion.name} dismissed`);
      fetchCompanions();
    } catch (err) {
      console.error('Failed to toggle companion:', err);
      toast.error('Failed to update companion');
    }
  };

  const handleHpChange = async (companion, delta) => {
    const newHp = Math.max(0, Math.min(companion.hp_max, companion.hp_current + delta));
    if (newHp === companion.hp_current) return;
    try {
      await invoke('update_companion', { characterId, companionId: companion.id, payload: { ...companion, hp_current: newHp } });
      fetchCompanions();
    } catch (err) {
      console.error('Failed to update HP:', err);
    }
  };

  const handleEdit = (companion) => {
    setEditingCompanion(companion);
    setShowForm(true);
  };

  const activeCompanions = companions.filter(c => c.active === 1);
  const dismissedCompanions = companions.filter(c => c.active !== 1);

  return (
    <div style={{ padding: '24px 28px', maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))',
            border: '1px solid rgba(201,168,76,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <PawPrint size={20} style={{ color: '#c9a84c' }} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'calc(22px * var(--font-scale, 1))', color: '#c9a84c', margin: 0, lineHeight: 1.2 }}>Companions</h1>
            <p style={{ fontSize: 'calc(11px * var(--font-scale, 1))', color: 'var(--text-mute)', margin: 0, fontFamily: 'var(--font-ui)' }}>
              {companions.length === 0 ? 'No companions yet' : `${activeCompanions.length} active, ${dismissedCompanions.length} dismissed`}
            </p>
          </div>
        </div>

        {companions.length > 0 && (
          <button
            onClick={() => { setEditingCompanion(null); setShowForm(true); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 8,
              background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)',
              color: '#c9a84c', cursor: 'pointer', fontSize: 13,
              fontFamily: 'var(--font-ui)', fontWeight: 600,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.2)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.12)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'; }}
          >
            <Plus size={16} /> Add Companion
          </button>
        )}
      </motion.div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-mute)', fontFamily: 'var(--font-ui)' }}>
          Loading companions...
        </div>
      )}

      {/* Empty state */}
      {!loading && companions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          style={{
            textAlign: 'center', padding: '60px 20px',
            background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(201,168,76,0.2)',
            borderRadius: 12,
          }}
        >
          <PawPrint size={40} style={{ color: 'rgba(201,168,76,0.3)', margin: '0 auto 16px' }} />
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: 'rgba(201,168,76,0.6)', margin: '0 0 8px' }}>No Companions</p>
          <p style={{ fontSize: 13, color: 'var(--text-mute)', fontFamily: 'var(--font-ui)', margin: '0 0 20px', maxWidth: 360, marginLeft: 'auto', marginRight: 'auto' }}>
            Add familiars, beast companions, mounts, summoned creatures, or sidekicks to track their stats and abilities.
          </p>
          <button
            onClick={() => { setEditingCompanion(null); setShowForm(true); }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 20px', borderRadius: 8,
              background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)',
              color: '#c9a84c', cursor: 'pointer', fontSize: 14,
              fontFamily: 'var(--font-ui)', fontWeight: 600,
            }}
          >
            <Plus size={16} /> Add Your First Companion
          </button>
        </motion.div>
      )}

      {/* Active companions */}
      {!loading && activeCompanions.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(201,168,76,0.5)', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10, paddingLeft: 2 }}>
            Active ({activeCompanions.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <AnimatePresence mode="popLayout">
              {activeCompanions.map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <CompanionCard
                    companion={c}
                    onEdit={handleEdit}
                    onDelete={setDeleteTarget}
                    onToggleActive={handleToggleActive}
                    onHpChange={handleHpChange}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Dismissed companions */}
      {!loading && dismissedCompanions.length > 0 && (
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-mute)', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10, paddingLeft: 2 }}>
            Dismissed ({dismissedCompanions.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <AnimatePresence mode="popLayout">
              {dismissedCompanions.map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <CompanionCard
                    companion={c}
                    onEdit={handleEdit}
                    onDelete={setDeleteTarget}
                    onToggleActive={handleToggleActive}
                    onHpChange={handleHpChange}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <CompanionFormModal
            companion={editingCompanion}
            onSave={handleSave}
            onClose={() => { setShowForm(false); setEditingCompanion(null); }}
          />
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <ConfirmDialog
        show={!!deleteTarget}
        title="Delete Companion"
        message={deleteTarget ? `Are you sure you want to remove ${deleteTarget.name}? This cannot be undone.` : ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
