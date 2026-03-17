import { useState, useEffect, useMemo, useRef } from 'react';
import { Plus, Trash2, Pencil, ChevronDown, ChevronRight, ChevronUp, Sparkles, RotateCcw, Search, Lock, Coins, Info, CheckSquare, Square, Wand2, Coffee, Moon, BookOpen, Filter, Zap, Crosshair, CircleDot, ShieldAlert, Pin, PinOff, Flame, Clock, Loader2, Dice5 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSpells, addSpell, updateSpell, deleteSpell, getSpellSlots, updateSpellSlots, resetSpellSlots } from '../api/spells';
import { getOverview } from '../api/overview';
import { useRuleset } from '../contexts/RulesetContext';
import HelpTooltip from '../components/HelpTooltip';
import ConfirmDialog from '../components/ConfirmDialog';
import ModalPortal from '../components/ModalPortal';
import { HELP } from '../data/helpText';
import { calcMod } from '../utils/dndHelpers';
import { rollDie } from '../utils/dice';
import { motion, AnimatePresence } from 'framer-motion';

// Subclasses that grant third-caster spellcasting
const THIRD_CASTER_SUBCLASSES = {
  'Eldritch Knight': { ability: 'INT', className: 'Fighter' },
  'Arcane Trickster': { ability: 'INT', className: 'Rogue' },
};

// Spell school colors for filter pills
const SCHOOL_COLORS = {
  'Abjuration': 'bg-blue-900/30 text-blue-300 border-blue-500/20',
  'Conjuration': 'bg-yellow-900/30 text-yellow-300 border-yellow-500/20',
  'Divination': 'bg-cyan-900/30 text-cyan-300 border-cyan-500/20',
  'Enchantment': 'bg-pink-900/30 text-pink-300 border-pink-500/20',
  'Evocation': 'bg-red-900/30 text-red-300 border-red-500/20',
  'Illusion': 'bg-purple-900/30 text-purple-300 border-purple-500/20',
  'Necromancy': 'bg-green-900/30 text-green-300 border-green-500/20',
  'Transmutation': 'bg-orange-900/30 text-orange-300 border-orange-500/20',
};

// Damage type filter options
const DAMAGE_TYPES = ['Fire', 'Cold', 'Lightning', 'Thunder', 'Acid', 'Poison', 'Necrotic', 'Radiant', 'Force', 'Psychic'];

const DAMAGE_TYPE_COLORS = {
  'Fire': 'bg-red-900/30 text-red-300 border-red-500/20',
  'Cold': 'bg-sky-900/30 text-sky-300 border-sky-500/20',
  'Lightning': 'bg-yellow-900/30 text-yellow-300 border-yellow-500/20',
  'Thunder': 'bg-indigo-900/30 text-indigo-300 border-indigo-500/20',
  'Acid': 'bg-lime-900/30 text-lime-300 border-lime-500/20',
  'Poison': 'bg-green-900/30 text-green-300 border-green-500/20',
  'Necrotic': 'bg-gray-900/30 text-gray-300 border-gray-500/20',
  'Radiant': 'bg-amber-900/30 text-amber-300 border-amber-500/20',
  'Force': 'bg-violet-900/30 text-violet-300 border-violet-500/20',
  'Psychic': 'bg-fuchsia-900/30 text-fuchsia-300 border-fuchsia-500/20',
};

// Casting time filter options
const CASTING_TIMES = ['Action', 'Bonus Action', 'Reaction', '1 Minute', '10 Minutes', '1 Hour'];

// Caster type distinction
const KNOWN_CASTER_CLASSES = ['Bard', 'Sorcerer', 'Warlock', 'Ranger'];
const PREPARED_CASTER_CLASSES = ['Cleric', 'Druid', 'Paladin', 'Wizard'];

export default function Spellbook({ characterId, onSpellSlotsChange }) {
  const { PROFICIENCY_BONUS, CLASSES, SPELL_SLOTS } = useRuleset();
  const [spells, setSpells] = useState([]);
  const [slots, setSlots] = useState([]);
  const [charData, setCharData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedLevel, setExpandedLevel] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [editingSpell, setEditingSpell] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState(() => {
    try { return sessionStorage.getItem(`codex_spellfilter_${characterId}`) || 'all'; } catch { return 'all'; }
  });
  const [preparedFilter, setPreparedFilter] = useState('all');
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [componentFilter, setComponentFilter] = useState('all'); // 'all' | 'V' | 'S' | 'M'
  const [concentrationFilter, setConcentrationFilter] = useState('all'); // 'all' | 'yes' | 'no'
  const [ritualFilter, setRitualFilter] = useState('all'); // 'all' | 'yes'
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [damageTypeFilter, setDamageTypeFilter] = useState('all'); // 'all' | damage type name
  const [castingTimeFilter, setCastingTimeFilter] = useState('all'); // 'all' | casting time string
  const [sortBy, setSortBy] = useState('level'); // 'level' | 'name' | 'school' | 'casting_time'
  const [pinnedSpells, setPinnedSpells] = useState(() => {
    try {
      const stored = localStorage.getItem(`codex_pinned_spells_${characterId}`);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [concentratingOn, setConcentratingOn] = useState(null);
  const [expandedSpell, setExpandedSpell] = useState(null);
  const [quickCastOpen, setQuickCastOpen] = useState(() => {
    try { return sessionStorage.getItem(`codex_quickcast_${characterId}`) !== 'closed'; } catch { return true; }
  });
  const [quickCastPending, setQuickCastPending] = useState(null); // { spell, level } for upcast selector
  const [concentrationConfirm, setConcentrationConfirm] = useState(null); // { spell, level, oldSpell }
  const [spellRollResult, setSpellRollResult] = useState(null); // { d20, bonus, total, isNat20, isNat1, label }
  const spellRollTimerRef = useRef(null);
  const [spellAdvMode, setSpellAdvMode] = useState('normal'); // 'normal' | 'advantage' | 'disadvantage'

  const rollSpellAttack = (bonus, label = 'Spell Attack') => {
    const d20a = rollDie(20);
    const d20b = spellAdvMode !== 'normal' ? rollDie(20) : d20a;
    let d20;
    if (spellAdvMode === 'advantage') d20 = Math.max(d20a, d20b);
    else if (spellAdvMode === 'disadvantage') d20 = Math.min(d20a, d20b);
    else d20 = d20a;
    const total = d20 + bonus;
    if (spellRollTimerRef.current) clearTimeout(spellRollTimerRef.current);
    setSpellRollResult({ d20, d20a, d20b, rollMode: spellAdvMode, bonus, total, isNat20: d20 === 20, isNat1: d20 === 1, label });
    spellRollTimerRef.current = setTimeout(() => setSpellRollResult(null), 4000);
  };

  // Persist quick cast open state
  useEffect(() => {
    try { sessionStorage.setItem(`codex_quickcast_${characterId}`, quickCastOpen ? 'open' : 'closed'); } catch (err) { if (import.meta.env.DEV) console.warn('QuickCast persist:', err); }
  }, [quickCastOpen, characterId]);

  // Persist pinned spells to localStorage
  useEffect(() => {
    try { localStorage.setItem(`codex_pinned_spells_${characterId}`, JSON.stringify(pinnedSpells)); } catch (err) { if (import.meta.env.DEV) console.warn('Pinned spells persist:', err); }
  }, [pinnedSpells, characterId]);

  // Persist concentration state to localStorage and notify topbar
  const concentrationInitialized = useRef(false);
  useEffect(() => {
    // Skip the initial null state to avoid clearing localStorage before restoration
    if (!concentrationInitialized.current) {
      if (concentratingOn != null) concentrationInitialized.current = true;
      else return;
    }
    try {
      if (concentratingOn != null) {
        const spell = spells.find(s => s.id === concentratingOn);
        const spellName = spell?.name || 'Unknown Spell';
        localStorage.setItem(`codex_concentration_${characterId}`, spellName);
      } else {
        localStorage.removeItem(`codex_concentration_${characterId}`);
      }
    } catch {}
    window.dispatchEvent(new Event('codex-concentration-changed'));
  }, [concentratingOn, characterId, spells]);

  const togglePinSpell = (spellId) => {
    setPinnedSpells(prev =>
      prev.includes(spellId) ? prev.filter(id => id !== spellId) : [...prev, spellId]
    );
  };

  // Daily spell tracking (session-based)
  const dailyKey = `codex_spellscast_${characterId}`;
  const [spellsCastToday, setSpellsCastToday] = useState(() => {
    try {
      const stored = sessionStorage.getItem(dailyKey);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  useEffect(() => {
    sessionStorage.setItem(dailyKey, JSON.stringify(spellsCastToday));
  }, [spellsCastToday, dailyKey]);

  const load = async () => {
    try {
      const [spellData, slotData, overview] = await Promise.all([
        getSpells(characterId),
        getSpellSlots(characterId),
        getOverview(characterId),
      ]);
      setSpells(spellData);
      setSlots(slotData);
      setCharData(overview);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [characterId]);

  // Restore concentration state from localStorage after spells load
  const spellsLoaded = spells.length > 0;
  useEffect(() => {
    if (!spellsLoaded) return;
    try {
      const stored = localStorage.getItem(`codex_concentration_${characterId}`);
      if (!stored) return;
      // Try to match by spell name (new format: plain string)
      const match = spells.find(s => s.name === stored);
      if (match) {
        setConcentratingOn(match.id);
      } else {
        // Legacy format: might be JSON-encoded spell ID
        try {
          const parsed = JSON.parse(stored);
          const legacyMatch = spells.find(s => s.id === parsed);
          if (legacyMatch) {
            setConcentratingOn(legacyMatch.id);
          }
        } catch { /* not JSON, spell no longer exists */ }
      }
    } catch { /* ignore */ }
  }, [spellsLoaded, characterId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Notify parent (CharacterView top bar) when spell slots change
  useEffect(() => {
    if (onSpellSlotsChange) onSpellSlotsChange(slots);
  }, [slots, onSpellSlotsChange]);

  // Persist spell level filter to sessionStorage
  useEffect(() => {
    try { sessionStorage.setItem(`codex_spellfilter_${characterId}`, levelFilter); } catch { /* ignore */ }
  }, [levelFilter, characterId]);

  const filteredSpells = useMemo(() => spells.filter(s => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!(s.name || '').toLowerCase().includes(q) && !(s.school || '').toLowerCase().includes(q) && !(s.description || '').toLowerCase().includes(q)) return false;
    }
    if (levelFilter !== 'all' && s.level !== parseInt(levelFilter, 10)) return false;
    if (preparedFilter === 'prepared' && !s.prepared) return false;
    if (preparedFilter === 'unprepared' && s.prepared) return false;
    if (schoolFilter !== 'all' && s.school !== schoolFilter) return false;
    if (componentFilter !== 'all') {
      const comps = (s.components || '').toUpperCase();
      if (!comps.includes(componentFilter)) return false;
    }
    if (concentrationFilter === 'yes' && !s.concentration) return false;
    if (concentrationFilter === 'no' && s.concentration) return false;
    if (ritualFilter === 'yes' && !s.ritual) return false;
    if (damageTypeFilter !== 'all') {
      const desc = (s.description || '').toLowerCase();
      const name = (s.name || '').toLowerCase();
      const keyword = damageTypeFilter.toLowerCase();
      if (!desc.includes(keyword) && !name.includes(keyword)) return false;
    }
    if (castingTimeFilter !== 'all') {
      const ct = (s.casting_time || '').toLowerCase();
      const filterVal = castingTimeFilter.toLowerCase();
      if (!ct.includes(filterVal)) return false;
    }
    return true;
  }).sort((a, b) => {
    // Pinned spells always first
    const aPinned = pinnedSpells.includes(a.id) ? 0 : 1;
    const bPinned = pinnedSpells.includes(b.id) ? 0 : 1;
    if (aPinned !== bPinned) return aPinned - bPinned;

    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    if (sortBy === 'school') return (a.school || '').localeCompare(b.school || '') || a.level - b.level;
    if (sortBy === 'casting_time') return (a.casting_time || '').localeCompare(b.casting_time || '') || a.level - b.level;
    // Default: level
    return a.level - b.level || (a.name || '').localeCompare(b.name || '');
  }), [spells, searchQuery, levelFilter, preparedFilter, schoolFilter, componentFilter, concentrationFilter, ritualFilter, damageTypeFilter, castingTimeFilter, sortBy, pinnedSpells]);

  // Pinned spells (filtered but shown separately at top)
  const pinnedSpellsList = useMemo(() => {
    return filteredSpells.filter(s => pinnedSpells.includes(s.id));
  }, [filteredSpells, pinnedSpells]);

  const spellsByLevel = useMemo(() => {
    const byLevel = {};
    for (let i = 0; i <= 9; i++) byLevel[i] = [];
    filteredSpells.forEach(s => {
      if (!byLevel[s.level]) byLevel[s.level] = [];
      byLevel[s.level].push(s);
    });
    return byLevel;
  }, [filteredSpells]);

  // Spellcasting calcs
  const { spellAbility, spellDC, spellAttack, isWarlock } = useMemo(() => {
    let ability = '';
    let mod = 0;
    let dc = 0;
    let attack = 0;
    let warlock = false;
    if (charData) {
      const cls = CLASSES.find(c => c.name === charData.overview.primary_class);
      const subclass = charData.overview.primary_subclass;
      const thirdCasterInfo = THIRD_CASTER_SUBCLASSES[subclass];

      if (cls?.spellcasting) {
        ability = cls.spellcasting.ability;
      } else if (thirdCasterInfo && thirdCasterInfo.className === charData.overview.primary_class) {
        ability = thirdCasterInfo.ability;
      }

      warlock = charData.overview.primary_class === 'Warlock';

      if (ability) {
        const abilScore = charData?.ability_scores?.find(a => a.ability === ability);
        mod = calcMod(abilScore?.score || 10);
        const profBonus = PROFICIENCY_BONUS[charData.overview.level] || 2;
        dc = 8 + profBonus + mod;
        attack = profBonus + mod;
      }
    }
    return { spellAbility: ability, spellMod: mod, spellDC: dc, spellAttack: attack, isWarlock: warlock };
  }, [charData, CLASSES, PROFICIENCY_BONUS]);

  const handleAddSpell = async (spellData) => {
    try {
      spellData = { ...spellData, level: Math.min(9, Math.max(0, parseInt(spellData.level) || 0)) };
      await addSpell(characterId, spellData);
      toast.success('Spell added');
      load();
      setShowAdd(false);
    } catch (err) { toast.error(err.message); }
  };

  const handleUpdateSpell = async (spellId, spellData) => {
    try {
      await updateSpell(characterId, spellId, spellData);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleEditSpell = async (spellData) => {
    if (!editingSpell) return;
    try {
      await updateSpell(characterId, editingSpell.id, spellData);
      toast.success('Spell updated');
      setEditingSpell(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleDeleteSpell = async (spellId) => {
    try {
      await deleteSpell(characterId, spellId);
      toast.success('Spell removed');
      setConfirmDelete(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleSlotToggle = async (level, index) => {
    const slot = slots.find(s => s.slot_level === level);
    if (!slot) return;
    const newUsed = index < slot.used_slots ? index : index + 1;
    const updated = slots.map(s => s.slot_level === level ? { ...s, used_slots: Math.min(newUsed, s.max_slots) } : s);
    setSlots(updated);
    const payload = updated.map(({ slot_level, max_slots, used_slots }) => ({ slot_level, max_slots, used_slots }));
    try { await updateSpellSlots(characterId, payload); } catch (err) { toast.error(err.message); }
  };

  const handleResetSlots = async () => {
    try {
      await resetSpellSlots(characterId);
      toast.success('Spell slots reset');
      setSpellsCastToday([]);
      load();
    } catch (err) { toast.error(err.message); }
  };

  // Short Rest — only restores Warlock pact slots
  const handleShortRest = async () => {
    if (isWarlock) {
      // Warlock pact magic recovers on short rest
      try {
        await resetSpellSlots(characterId);
        toast.success('Short Rest: Pact magic slots restored');
        load();
      } catch (err) { toast.error(err.message); }
    } else {
      toast('Short Rest: No spell slots recover on short rest for your class', { icon: '\u2139\uFE0F' });
    }
  };

  const castSpell = async (spell, atLevel = null, skipConcentrationCheck = false) => {
    const castLevel = atLevel || spell.level;
    if (castLevel === 0) return; // Cantrips don't use slots

    // Concentration check: confirm before dropping existing concentration
    if (!skipConcentrationCheck && spell.concentration && concentratingOn && concentratingOn !== spell.id) {
      const oldSpell = spells.find(s => s.id === concentratingOn);
      setConcentrationConfirm({ spell, level: castLevel, oldSpell });
      return;
    }

    // Find the slot for this level
    const slot = slots.find(s => s.slot_level === castLevel);
    if (!slot || slot.used_slots >= slot.max_slots) {
      // Try to find a higher level slot
      const higherSlot = slots.find(s => s.slot_level > castLevel && s.used_slots < s.max_slots);
      if (!higherSlot) {
        toast.error(`No ${castLevel}${castLevel === 1 ? 'st' : castLevel === 2 ? 'nd' : castLevel === 3 ? 'rd' : 'th'} level slots available`);
        return;
      }
      // Use higher slot
      const newUsed = higherSlot.used_slots + 1;
      const updatedSlots = slots.map(s => s.slot_level === higherSlot.slot_level ? { ...s, used_slots: newUsed } : s);
      setSlots(updatedSlots);
      try {
        await updateSpellSlots(characterId, updatedSlots);
        toast(`Cast ${spell.name} using ${higherSlot.slot_level}${higherSlot.slot_level === 1 ? 'st' : higherSlot.slot_level === 2 ? 'nd' : higherSlot.slot_level === 3 ? 'rd' : 'th'} level slot (upcast)`, { icon: '\u2728', duration: 3000, style: { background: '#1a1025', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.3)' } });
      } catch (err) { toast.error(err.message); load(); }
      // Track daily casting
      setSpellsCastToday(prev => [...prev, { name: spell.name, level: higherSlot.slot_level, ts: Date.now() }]);
      // Set concentration if applicable
      if (spell.concentration) {
        setConcentratingOn(spell.id);
      }
      return;
    }

    const newUsed = slot.used_slots + 1;
    const updatedSlots = slots.map(s => s.slot_level === castLevel ? { ...s, used_slots: newUsed } : s);
    setSlots(updatedSlots);
    try {
      await updateSpellSlots(characterId, updatedSlots);
      const remaining = slot.max_slots - newUsed;
      toast(`Cast ${spell.name} \u2014 ${remaining} ${castLevel}${castLevel === 1 ? 'st' : castLevel === 2 ? 'nd' : castLevel === 3 ? 'rd' : 'th'} level slot${remaining !== 1 ? 's' : ''} left`, {
        icon: '\u2728', duration: 3000,
        style: { background: '#1a1025', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.3)' },
      });
    } catch (err) { toast.error(err.message); load(); }

    // Track daily casting
    setSpellsCastToday(prev => [...prev, { name: spell.name, level: castLevel, ts: Date.now() }]);

    // Auto-set concentration
    if (spell.concentration) {
      setConcentratingOn(spell.id);
    }
  };

  // Spell count summary
  const spellSummary = useMemo(() => {
    const cantrips = spells.filter(s => s.level === 0).length;
    const leveled = spells.filter(s => s.level > 0).length;
    const prepared = spells.filter(s => s.level > 0 && s.prepared).length;
    const alwaysPrepared = spells.filter(s => s.level > 0 && s.always_prepared).length;
    const rituals = spells.filter(s => s.ritual).length;
    const concentrationSpells = spells.filter(s => s.concentration).length;
    return { cantrips, leveled, prepared, alwaysPrepared, rituals, concentrationSpells, total: spells.length };
  }, [spells]);

  // Prepared spell limit for prepared casters
  const preparedLimit = useMemo(() => {
    if (!charData) return null;
    const cls = charData.overview.primary_class;
    const level = charData.overview.level || 1;

    // Mapping of prepared caster classes to their spellcasting ability
    const PREPARED_CASTERS = {
      'Cleric': 'WIS',
      'Druid': 'WIS',
      'Wizard': 'INT',
      'Paladin': 'CHA',
    };

    const ability = PREPARED_CASTERS[cls];
    if (!ability) return null;

    const abilScore = charData?.ability_scores?.find(a => a.ability === ability);
    const mod = calcMod(abilScore?.score || 10);

    // Paladin/Ranger use half level (rounded down), others use full level
    const halfCasters = ['Paladin', 'Ranger'];
    const levelContribution = halfCasters.includes(cls) ? Math.floor(level / 2) : level;
    const max = Math.max(1, mod + levelContribution);

    // Count currently prepared non-cantrip spells (exclude always_prepared since those are free)
    const currentPrepared = spells.filter(s => s.level > 0 && s.prepared && !s.always_prepared).length;

    return { current: currentPrepared, max, ability };
  }, [charData, spells]);

  // Caster type: known vs prepared
  const isKnownCaster = useMemo(() => {
    if (!charData) return false;
    return KNOWN_CASTER_CLASSES.includes(charData.overview.primary_class);
  }, [charData]);

  const isPreparedCaster = useMemo(() => {
    if (!charData) return false;
    return PREPARED_CASTER_CLASSES.includes(charData.overview.primary_class);
  }, [charData]);

  const atPreparedCap = useMemo(() => {
    if (!isPreparedCaster || !preparedLimit) return false;
    return preparedLimit.current >= preparedLimit.max;
  }, [isPreparedCaster, preparedLimit]);

  // Daily spell tracking summary
  const dailySummary = useMemo(() => {
    const totalSlotsUsed = slots.reduce((sum, s) => sum + (s.used_slots || 0), 0);
    const totalSlotsMax = slots.reduce((sum, s) => sum + (s.max_slots || 0), 0);
    return { castsToday: spellsCastToday.length, slotsUsed: totalSlotsUsed, slotsMax: totalSlotsMax };
  }, [spellsCastToday, slots]);

  // Quick Cast: categorize prepared spells by casting time
  const quickCastData = useMemo(() => {
    const normalizeCastingTime = (ct) => {
      if (!ct) return 'action';
      const lower = ct.toLowerCase().trim();
      if (lower.includes('bonus')) return 'bonus';
      if (lower.includes('reaction')) return 'reaction';
      return 'action';
    };

    // Cantrips are always available
    const cantrips = spells.filter(s => s.level === 0);
    // Leveled spells: must be prepared (or always_prepared)
    const preparedSpells = spells.filter(s => s.level > 0 && (s.prepared || s.always_prepared));

    // Check which spell levels have available slots
    const hasSlotForLevel = (spellLevel) => {
      // Check this level and higher
      for (let i = spellLevel; i <= 9; i++) {
        const slot = slots.find(s => s.slot_level === i);
        if (slot && slot.used_slots < slot.max_slots) return true;
      }
      return false;
    };

    // Filter to spells with available slots (or ritual spells which don't need slots)
    const available = preparedSpells.filter(s => s.ritual || hasSlotForLevel(s.level));

    const actions = { cantrips: [], spells: [] };
    const bonus = { cantrips: [], spells: [] };
    const reactions = { cantrips: [], spells: [] };

    cantrips.forEach(s => {
      const bucket = normalizeCastingTime(s.casting_time);
      if (bucket === 'bonus') bonus.cantrips.push(s);
      else if (bucket === 'reaction') reactions.cantrips.push(s);
      else actions.cantrips.push(s);
    });

    available.forEach(s => {
      const bucket = normalizeCastingTime(s.casting_time);
      if (bucket === 'bonus') bonus.spells.push(s);
      else if (bucket === 'reaction') reactions.spells.push(s);
      else actions.spells.push(s);
    });

    const totalCount = cantrips.length + available.length;
    return { actions, bonus, reactions, totalCount };
  }, [spells, slots]);

  // Quick Cast spell handler with concentration check
  const handleQuickCast = (spell, atLevel = null) => {
    const castLevel = atLevel || spell.level;

    // Cantrips: just fire and forget
    if (castLevel === 0) {
      toast(`Cast ${spell.name} (cantrip)`, {
        icon: '\u2728', duration: 2000,
        style: { background: '#1a1025', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.3)' },
      });
      setSpellsCastToday(prev => [...prev, { name: spell.name, level: 0, ts: Date.now() }]);
      setQuickCastPending(null);
      return;
    }

    // Check if upcast options exist and no level was explicitly chosen
    if (!atLevel && spell.level > 0) {
      // Check if there are higher level slots available for upcasting
      const hasUpcastOptions = [];
      for (let i = spell.level + 1; i <= 9; i++) {
        const slot = slots.find(s => s.slot_level === i);
        if (slot && slot.max_slots > 0 && slot.used_slots < slot.max_slots) {
          hasUpcastOptions.push(i);
        }
      }
      if (hasUpcastOptions.length > 0) {
        setQuickCastPending({ spell, minLevel: spell.level, options: [spell.level, ...hasUpcastOptions] });
        return;
      }
    }

    // Concentration check
    if (spell.concentration && concentratingOn && concentratingOn !== spell.id) {
      const oldSpell = spells.find(s => s.id === concentratingOn);
      setConcentrationConfirm({ spell, level: castLevel, oldSpell });
      setQuickCastPending(null);
      return;
    }

    // Cast it
    castSpell(spell, castLevel === spell.level ? null : castLevel);
    setQuickCastPending(null);
  };

  const confirmConcentrationSwap = () => {
    if (!concentrationConfirm) return;
    const { spell, level } = concentrationConfirm;
    castSpell(spell, level === spell.level ? null : level, true);
    setConcentrationConfirm(null);
    setQuickCastPending(null);
  };

  const handlePrepareAll = async () => {
    const toPrepare = spells.filter(s => s.level > 0 && !s.prepared && !s.always_prepared);
    if (toPrepare.length === 0) { toast('All spells already prepared'); return; }
    try {
      await Promise.all(toPrepare.map(s => updateSpell(characterId, s.id, { ...s, prepared: true })));
      toast.success(`Prepared ${toPrepare.length} spell${toPrepare.length !== 1 ? 's' : ''}`);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleUnprepareAll = async () => {
    const toUnprepare = spells.filter(s => s.level > 0 && s.prepared && !s.always_prepared);
    if (toUnprepare.length === 0) { toast('No spells to unprepare'); return; }
    try {
      await Promise.all(toUnprepare.map(s => updateSpell(characterId, s.id, { ...s, prepared: false })));
      toast.success(`Unprepared ${toUnprepare.length} spell${toUnprepare.length !== 1 ? 's' : ''}`);
      load();
    } catch (err) { toast.error(err.message); }
  };

  // Auto-fill spell slots from class/level
  const handleAutoFillSlots = async () => {
    if (!charData?.overview) return;
    const cls = CLASSES.find(c => c.name === charData.overview.primary_class);
    const subclass = charData.overview.primary_subclass;
    const level = charData.overview.level || 1;
    const thirdCasterInfo = THIRD_CASTER_SUBCLASSES[subclass];

    let slotType = null;
    if (cls?.spellcasting?.type) {
      slotType = cls.spellcasting.type;
    } else if (thirdCasterInfo && thirdCasterInfo.className === charData.overview.primary_class) {
      slotType = 'third';
    }

    if (!slotType) {
      toast.error('No spellcasting progression found for this class/subclass');
      return;
    }

    let newSlots = [];
    if (slotType === 'pact') {
      const pactData = SPELL_SLOTS.pact[level - 1];
      if (pactData) {
        for (let i = 1; i <= 9; i++) {
          if (i === pactData.slotLevel) {
            newSlots.push({ slot_level: i, max_slots: pactData.slots, used_slots: 0 });
          } else {
            newSlots.push({ slot_level: i, max_slots: 0, used_slots: 0 });
          }
        }
      }
    } else {
      const table = SPELL_SLOTS[slotType];
      if (table && table[level - 1]) {
        const row = table[level - 1];
        for (let i = 0; i < 9; i++) {
          newSlots.push({ slot_level: i + 1, max_slots: row[i] || 0, used_slots: 0 });
        }
      }
    }

    if (newSlots.length === 0) {
      toast.error('Could not determine spell slots for this level');
      return;
    }

    setSlots(newSlots);
    try {
      await updateSpellSlots(characterId, newSlots);
      toast.success(`Spell slots set for ${charData.overview.primary_class} Lv ${level}`);
    } catch (err) {
      toast.error(err.message);
      load();
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center gap-2 py-12 text-amber-200/40">
      <Loader2 size={18} className="animate-spin" />
      <span>Loading spellbook...</span>
    </div>
  );

  const levelNames = ['Cantrips', '1st Level', '2nd Level', '3rd Level', '4th Level', '5th Level', '6th Level', '7th Level', '8th Level', '9th Level'];

  return (
    <div className="space-y-6 max-w-none">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display text-amber-100 flex items-center gap-2">
          <Sparkles size={20} />
          <div>
            <span>Spellbook</span>
            <p className="text-xs text-amber-200/40 font-normal mt-0.5">Manage your known spells, track spell slots, and see your spellcasting stats. Add spells you learn and mark which ones you have prepared for the day.</p>
          </div>
        </h2>
        <div className="flex gap-2">
          <button onClick={handleShortRest} className="btn-secondary text-xs flex items-center gap-1" title={isWarlock ? 'Short Rest: Restore pact magic slots' : 'Short Rest: No spell slot recovery for your class'}>
            <Coffee size={12} /> Short Rest
          </button>
          <button onClick={handleResetSlots} className="btn-secondary text-xs flex items-center gap-1" title="Long Rest: Restore all spell slots and clear daily tracking">
            <Moon size={12} /> Long Rest
          </button>
          <button onClick={() => setShowAdd(true)} className="btn-primary text-xs flex items-center gap-1">
            <Plus size={12} /> Add Spell
          </button>
        </div>
      </div>

      {/* Spell Search & Filters */}
      {spells.length > 0 && (
        <div className="space-y-3">
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-200/30 pointer-events-none" />
            <input className="input w-full pl-10" placeholder="Search spells by name, school, or description..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-amber-200/40">Level:</span>
            {['all', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map(lv => (
              <button key={lv} onClick={() => setLevelFilter(lv)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${levelFilter === lv ? 'bg-gold/15 border-gold/30 text-gold' : 'border-amber-200/10 text-amber-200/30 hover:text-amber-200/50'}`}>
                {lv === 'all' ? 'All' : lv === '0' ? 'Cantrip' : `${lv}${lv === '1' ? 'st' : lv === '2' ? 'nd' : lv === '3' ? 'rd' : 'th'}`}
              </button>
            ))}
            <span className="text-xs text-amber-200/40 ml-2">Status:</span>
            {['all', 'prepared', 'unprepared'].map(pf => (
              <button key={pf} onClick={() => setPreparedFilter(pf)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all capitalize ${preparedFilter === pf ? 'bg-gold/15 border-gold/30 text-gold' : 'border-amber-200/10 text-amber-200/30 hover:text-amber-200/50'}`}>
                {pf === 'all' ? 'All' : pf}
              </button>
            ))}
            <span className="text-amber-200/15 mx-0.5">|</span>
            <button
              onClick={() => setConcentrationFilter(concentrationFilter === 'yes' ? 'all' : 'yes')}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 ${
                concentrationFilter === 'yes' ? 'bg-purple-900/30 border-purple-500/30 text-purple-300 shadow-[0_0_6px_rgba(168,85,247,0.15)]' : 'border-amber-200/10 text-amber-200/30 hover:text-amber-200/50'
              }`}
              title="Show only concentration spells"
            >
              <CircleDot size={10} /> Concentration
            </button>
            <span className="text-amber-200/15 mx-0.5">|</span>
            <span className="text-xs text-amber-200/40">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-xs px-2 py-1 rounded-full border border-amber-200/10 bg-transparent text-amber-200/60 focus:border-gold/30 focus:text-gold outline-none transition-all cursor-pointer"
            >
              <option value="level">Level</option>
              <option value="name">Name (A-Z)</option>
              <option value="school">School</option>
              <option value="casting_time">Casting Time</option>
            </select>
            <button
              onClick={() => setShowAdvancedFilters(prev => !prev)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 ml-auto ${
                showAdvancedFilters ? 'bg-purple-900/30 border-purple-500/30 text-purple-300' : 'border-amber-200/10 text-amber-200/30 hover:text-amber-200/50'
              }`}
            >
              <Filter size={10} /> {showAdvancedFilters ? 'Hide Filters' : 'More Filters'}
            </button>
          </div>
          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="bg-[#0d0d14] border border-amber-200/10 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-amber-200/40">School:</span>
                <button onClick={() => setSchoolFilter('all')}
                  className={`text-xs px-2 py-0.5 rounded border transition-all ${schoolFilter === 'all' ? 'bg-gold/15 border-gold/30 text-gold' : 'border-amber-200/10 text-amber-200/30'}`}>
                  All
                </button>
                {['Abjuration','Conjuration','Divination','Enchantment','Evocation','Illusion','Necromancy','Transmutation'].map(s => (
                  <button key={s} onClick={() => setSchoolFilter(schoolFilter === s ? 'all' : s)}
                    className={`text-xs px-2 py-0.5 rounded border transition-all ${schoolFilter === s ? SCHOOL_COLORS[s] : 'border-amber-200/10 text-amber-200/30'}`}>
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-amber-200/40">Components:</span>
                {['all', 'V', 'S', 'M'].map(c => (
                  <button key={c} onClick={() => setComponentFilter(componentFilter === c ? 'all' : c)}
                    className={`text-xs px-2 py-0.5 rounded border transition-all ${componentFilter === c ? 'bg-gold/15 border-gold/30 text-gold' : 'border-amber-200/10 text-amber-200/30'}`}>
                    {c === 'all' ? 'All' : c === 'V' ? 'Verbal' : c === 'S' ? 'Somatic' : 'Material'}
                  </button>
                ))}
                <span className="text-amber-200/15 mx-1">|</span>
                <button onClick={() => setConcentrationFilter(concentrationFilter === 'yes' ? 'all' : 'yes')}
                  className={`text-xs px-2 py-0.5 rounded border transition-all ${concentrationFilter === 'yes' ? 'bg-purple-900/30 border-purple-500/30 text-purple-300' : 'border-amber-200/10 text-amber-200/30'}`}>
                  Concentration
                </button>
                <button onClick={() => setRitualFilter(ritualFilter === 'yes' ? 'all' : 'yes')}
                  className={`text-xs px-2 py-0.5 rounded border transition-all ${ritualFilter === 'yes' ? 'bg-blue-900/30 border-blue-500/30 text-blue-300' : 'border-amber-200/10 text-amber-200/30'}`}>
                  Ritual
                </button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-amber-200/40 flex items-center gap-1"><Flame size={10} /> Damage:</span>
                <button onClick={() => setDamageTypeFilter('all')}
                  className={`text-xs px-2 py-0.5 rounded border transition-all ${damageTypeFilter === 'all' ? 'bg-gold/15 border-gold/30 text-gold' : 'border-amber-200/10 text-amber-200/30'}`}>
                  All
                </button>
                {DAMAGE_TYPES.map(dt => (
                  <button key={dt} onClick={() => setDamageTypeFilter(damageTypeFilter === dt ? 'all' : dt)}
                    className={`text-xs px-2 py-0.5 rounded border transition-all ${damageTypeFilter === dt ? DAMAGE_TYPE_COLORS[dt] : 'border-amber-200/10 text-amber-200/30'}`}>
                    {dt}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-amber-200/40 flex items-center gap-1"><Clock size={10} /> Cast Time:</span>
                <button onClick={() => setCastingTimeFilter('all')}
                  className={`text-xs px-2 py-0.5 rounded border transition-all ${castingTimeFilter === 'all' ? 'bg-gold/15 border-gold/30 text-gold' : 'border-amber-200/10 text-amber-200/30'}`}>
                  All
                </button>
                {CASTING_TIMES.map(ct => (
                  <button key={ct} onClick={() => setCastingTimeFilter(castingTimeFilter === ct ? 'all' : ct)}
                    className={`text-xs px-2 py-0.5 rounded border transition-all ${castingTimeFilter === ct ? 'bg-gold/15 border-gold/30 text-gold' : 'border-amber-200/10 text-amber-200/30'}`}>
                    {ct}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Spellcasting Stats */}
      {spellAbility && (
        <div className="grid grid-cols-3 gap-4">
          <div className="card text-center">
            <div className="text-xs text-amber-200/50">Spellcasting Ability<HelpTooltip text={HELP.spellSlots} /></div>
            <div className="text-xl font-display text-purple-300">{spellAbility}</div>
          </div>
          <div className="card text-center" title={`Spell Save DC = 8 + proficiency + ${spellAbility} modifier`}>
            <div className="text-xs text-amber-200/50">Spell Save DC<HelpTooltip text={HELP.spellSaveDC} /></div>
            <div className="text-xl font-display text-purple-300">{spellDC}</div>
          </div>
          <div className="card text-center">
            <div className="text-xs text-amber-200/50">Spell Attack<HelpTooltip text={HELP.spellAttack} /></div>
            <div className="flex items-center justify-center gap-2">
              <div className="text-xl font-display text-purple-300">+{spellAttack}</div>
              <button
                onClick={() => rollSpellAttack(spellAttack)}
                className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all flex items-center justify-center group"
                title="Roll spell attack"
              >
                <Dice5 size={14} className="text-purple-300 group-hover:text-purple-100 transition-colors" />
              </button>
            </div>
            {/* Advantage/Disadvantage toggles */}
            <div className="flex items-center justify-center gap-1.5 mt-1.5">
              <button
                onClick={() => setSpellAdvMode(m => m === 'advantage' ? 'normal' : 'advantage')}
                className={`text-[9px] px-1.5 py-0.5 rounded border transition-all ${
                  spellAdvMode === 'advantage' ? 'bg-green-900/50 text-green-300 border-green-500/40' : 'bg-white/5 text-amber-200/30 border-amber-200/10 hover:text-amber-200/50'
                }`}
              >ADV</button>
              <button
                onClick={() => setSpellAdvMode(m => m === 'disadvantage' ? 'normal' : 'disadvantage')}
                className={`text-[9px] px-1.5 py-0.5 rounded border transition-all ${
                  spellAdvMode === 'disadvantage' ? 'bg-red-900/50 text-red-300 border-red-500/40' : 'bg-white/5 text-amber-200/30 border-amber-200/10 hover:text-amber-200/50'
                }`}
              >DIS</button>
            </div>
            {/* Spell roll result */}
            {spellRollResult && (
              <div className={`mt-2 px-2 py-1.5 rounded-lg border text-xs ${
                spellRollResult.isNat20 ? 'bg-gold/10 border-gold/30' : spellRollResult.isNat1 ? 'bg-red-900/20 border-red-500/30' : 'bg-white/[0.03] border-purple-500/20'
              }`}>
                <div className="flex items-center justify-center gap-1.5">
                  {spellRollResult.rollMode !== 'normal' ? (
                    <span className={`${spellRollResult.rollMode === 'advantage' ? 'text-green-300' : 'text-red-300'}`}>
                      {spellRollResult.d20a === spellRollResult.d20
                        ? <>{spellRollResult.d20a}, <span className="line-through opacity-50">{spellRollResult.d20b}</span></>
                        : <><span className="line-through opacity-50">{spellRollResult.d20a}</span>, {spellRollResult.d20b}</>
                      }
                      <span className="ml-1 opacity-60">({spellRollResult.rollMode === 'advantage' ? 'ADV' : 'DIS'})</span>
                    </span>
                  ) : (
                    <span className="text-amber-200/50">{spellRollResult.d20}</span>
                  )}
                  <span className="text-amber-200/40">+ {spellRollResult.bonus} =</span>
                  <span className={`font-bold ${spellRollResult.isNat20 ? 'text-gold' : spellRollResult.isNat1 ? 'text-red-400' : 'text-purple-200'}`}>
                    {spellRollResult.total}
                  </span>
                </div>
                {spellRollResult.isNat20 && <div className="text-gold font-bold mt-0.5">NAT 20!</div>}
                {spellRollResult.isNat1 && <div className="text-red-400 font-bold mt-0.5">NAT 1!</div>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Spell Count Summary */}
      {spells.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs bg-amber-200/5 text-amber-200/50 px-2.5 py-1 rounded border border-amber-200/10">
              {spellSummary.total} spell{spellSummary.total !== 1 ? 's' : ''} known
            </span>
            {spellSummary.leveled > 0 && (
              <span className="text-xs bg-emerald-900/20 text-emerald-400 px-2.5 py-1 rounded border border-emerald-500/15">
                {spellSummary.prepared} prepared
              </span>
            )}
            {preparedLimit && (
              <span
                className={`text-xs px-2.5 py-1 rounded border flex items-center gap-1 ${
                  preparedLimit.current > preparedLimit.max
                    ? 'bg-yellow-900/30 text-yellow-300 border-yellow-500/25'
                    : preparedLimit.current === preparedLimit.max
                    ? 'bg-emerald-900/20 text-emerald-400 border-emerald-500/15'
                    : 'bg-amber-200/5 text-amber-200/50 border-amber-200/10'
                }`}
                title={`Prepared spell limit based on ${preparedLimit.ability} modifier + class level. Always-prepared spells don't count against this limit.`}
              >
                <BookOpen size={10} />
                {preparedLimit.current}/{preparedLimit.max} Prepared
                {preparedLimit.current > preparedLimit.max && ' (over limit)'}
              </span>
            )}
            {spellSummary.alwaysPrepared > 0 && (
              <span className="text-xs bg-emerald-900/30 text-emerald-300 px-2.5 py-1 rounded border border-emerald-500/25 flex items-center gap-1">
                <Lock size={10} /> {spellSummary.alwaysPrepared} always prepared
              </span>
            )}
            {spellSummary.cantrips > 0 && (
              <span className="text-xs bg-purple-900/20 text-purple-300 px-2.5 py-1 rounded border border-purple-500/15">
                {spellSummary.cantrips} cantrip{spellSummary.cantrips !== 1 ? 's' : ''}
              </span>
            )}
            {spellSummary.rituals > 0 && (
              <span className="text-xs bg-blue-900/20 text-blue-300 px-2.5 py-1 rounded border border-blue-500/15 flex items-center gap-1">
                <BookOpen size={10} /> {spellSummary.rituals} ritual{spellSummary.rituals !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {spellSummary.leveled > 0 && (
            <div className="flex items-center gap-1.5 ml-auto">
              <button onClick={handlePrepareAll} className="btn-secondary text-xs flex items-center gap-1" title="Prepare all non-always-prepared leveled spells">
                <CheckSquare size={11} /> Prepare All
              </button>
              <button onClick={handleUnprepareAll} className="btn-secondary text-xs flex items-center gap-1" title="Unprepare all non-always-prepared leveled spells">
                <Square size={11} /> Unprepare All
              </button>
            </div>
          )}
        </div>
      )}

      {/* Daily Spell Tracking */}
      {spellsCastToday.length > 0 && (
        <div className="card bg-purple-950/20 border-purple-500/15">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-purple-400" />
              <h3 className="text-sm font-display text-purple-200">Today's Casting</h3>
              <span className="text-xs bg-purple-900/40 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20">
                {dailySummary.slotsUsed}/{dailySummary.slotsMax} slots used
              </span>
            </div>
            <button
              onClick={() => setSpellsCastToday([])}
              className="text-xs text-purple-300/50 hover:text-purple-200 transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {spellsCastToday.map((cast, i) => (
              <span key={i} className="text-xs bg-purple-900/30 text-purple-300/80 px-2 py-0.5 rounded border border-purple-500/15">
                {cast.name} <span className="text-purple-400/50">(Lv{cast.level})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Concentration Banner */}
      {concentratingOn && (() => {
        const spell = spells.find(s => s.id === concentratingOn);
        if (!spell) return null;
        return (
          <div className="bg-purple-950/50 border-2 border-purple-500/40 rounded-lg p-4 shadow-[0_0_20px_rgba(124,77,189,0.15)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <span className="text-sm font-display text-purple-200">Concentrating on:</span>
                <span className="text-sm font-semibold text-purple-100">{spell.name}</span>
                <span className="text-xs bg-purple-800/40 text-purple-300 px-1.5 py-0.5 rounded">C</span>
              </div>
              <button
                onClick={() => setConcentratingOn(null)}
                className="text-xs text-purple-300/60 hover:text-purple-200 border border-purple-500/30 rounded px-2 py-1 transition-colors"
              >
                Drop Concentration
              </button>
            </div>
            <p className="text-xs text-purple-300/50 mt-1.5">Taking damage forces a CON save (DC = max of 10 or half damage taken). Failing ends the spell.</p>
          </div>
        );
      })()}

      {/* Quick Cast Panel */}
      {spells.length > 0 && (
        <div className="card border-purple-500/20 bg-gradient-to-b from-purple-950/20 to-transparent overflow-visible">
          <button
            className="w-full flex items-center justify-between"
            onClick={() => setQuickCastOpen(prev => !prev)}
          >
            <div className="flex items-center gap-2">
              <Crosshair size={16} className="text-purple-400" />
              <h3 className="font-display text-amber-100">Quick Cast</h3>
              <span className="text-xs text-purple-300/50 font-normal">
                {quickCastData.totalCount} combat-ready spell{quickCastData.totalCount !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Compact slot pips */}
              <div className="flex items-center gap-1.5">
                {[1,2,3,4,5,6,7,8,9].map(level => {
                  const slot = slots.find(s => s.slot_level === level);
                  if (!slot || slot.max_slots === 0) return null;
                  const remaining = slot.max_slots - slot.used_slots;
                  return (
                    <div key={level} className="flex items-center gap-0.5" title={`Level ${level}: ${remaining}/${slot.max_slots}`}>
                      <span className="text-[9px] text-amber-200/30">{level}</span>
                      <div className="flex gap-px">
                        {Array.from({ length: slot.max_slots }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              i < remaining ? 'bg-purple-400 shadow-[0_0_3px_rgba(168,85,247,0.5)]' : 'bg-gray-600/40'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              {quickCastOpen ? <ChevronDown size={14} className="text-amber-200/40" /> : <ChevronRight size={14} className="text-amber-200/40" />}
            </div>
          </button>

          {quickCastOpen && (
            <div className="mt-4">
              {quickCastData.totalCount === 0 ? (
                <p className="text-xs text-amber-200/30 text-center py-4">No prepared spells with available slots. Prepare spells below or restore slots with a rest.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Actions Column */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 pb-1.5 border-b border-amber-200/10">
                      <CircleDot size={12} className="text-amber-300/60" />
                      <span className="text-xs font-display text-amber-200/60 uppercase tracking-wider">Actions</span>
                      <span className="text-[10px] text-amber-200/30 ml-auto">{quickCastData.actions.cantrips.length + quickCastData.actions.spells.length}</span>
                    </div>
                    {quickCastData.actions.cantrips.map(spell => (
                      <QuickCastSpellButton key={spell.id} spell={spell} isCantrip slots={slots} concentratingOn={concentratingOn} onCast={handleQuickCast} />
                    ))}
                    {quickCastData.actions.spells.map(spell => (
                      <QuickCastSpellButton key={spell.id} spell={spell} slots={slots} concentratingOn={concentratingOn} onCast={handleQuickCast} />
                    ))}
                    {quickCastData.actions.cantrips.length === 0 && quickCastData.actions.spells.length === 0 && (
                      <p className="text-xs text-amber-200/20 text-center py-2">None</p>
                    )}
                  </div>

                  {/* Bonus Actions Column */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 pb-1.5 border-b border-amber-200/10">
                      <Zap size={12} className="text-yellow-400/60" />
                      <span className="text-xs font-display text-amber-200/60 uppercase tracking-wider">Bonus Actions</span>
                      <span className="text-[10px] text-amber-200/30 ml-auto">{quickCastData.bonus.cantrips.length + quickCastData.bonus.spells.length}</span>
                    </div>
                    {quickCastData.bonus.cantrips.map(spell => (
                      <QuickCastSpellButton key={spell.id} spell={spell} isCantrip slots={slots} concentratingOn={concentratingOn} onCast={handleQuickCast} />
                    ))}
                    {quickCastData.bonus.spells.map(spell => (
                      <QuickCastSpellButton key={spell.id} spell={spell} slots={slots} concentratingOn={concentratingOn} onCast={handleQuickCast} />
                    ))}
                    {quickCastData.bonus.cantrips.length === 0 && quickCastData.bonus.spells.length === 0 && (
                      <p className="text-xs text-amber-200/20 text-center py-2">None</p>
                    )}
                  </div>

                  {/* Reactions Column */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 pb-1.5 border-b border-amber-200/10">
                      <ShieldAlert size={12} className="text-red-400/60" />
                      <span className="text-xs font-display text-amber-200/60 uppercase tracking-wider">Reactions</span>
                      <span className="text-[10px] text-amber-200/30 ml-auto">{quickCastData.reactions.cantrips.length + quickCastData.reactions.spells.length}</span>
                    </div>
                    {quickCastData.reactions.cantrips.map(spell => (
                      <QuickCastSpellButton key={spell.id} spell={spell} isCantrip slots={slots} concentratingOn={concentratingOn} onCast={handleQuickCast} />
                    ))}
                    {quickCastData.reactions.spells.map(spell => (
                      <QuickCastSpellButton key={spell.id} spell={spell} slots={slots} concentratingOn={concentratingOn} onCast={handleQuickCast} />
                    ))}
                    {quickCastData.reactions.cantrips.length === 0 && quickCastData.reactions.spells.length === 0 && (
                      <p className="text-xs text-amber-200/20 text-center py-2">None</p>
                    )}
                  </div>
                </div>
              )}

              {/* Upcast Level Selector Popover */}
              {quickCastPending && (
                <div className="mt-3 bg-purple-950/40 border border-purple-500/25 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-display text-purple-200">
                      Cast {quickCastPending.spell.name} at level:
                    </span>
                    <button onClick={() => setQuickCastPending(null)} className="text-xs text-purple-300/40 hover:text-purple-200 transition-colors">Cancel</button>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {quickCastPending.options.map(lv => {
                      const slot = slots.find(s => s.slot_level === lv);
                      const available = slot && slot.used_slots < slot.max_slots;
                      const remaining = slot ? slot.max_slots - slot.used_slots : 0;
                      return (
                        <button
                          key={lv}
                          onClick={() => { if (available) handleQuickCast(quickCastPending.spell, lv); }}
                          disabled={!available}
                          className={`text-xs px-3 py-1.5 rounded border transition-all ${
                            available
                              ? 'bg-purple-900/40 border-purple-500/30 text-purple-200 hover:bg-purple-800/50 hover:border-purple-400/40'
                              : 'bg-gray-900/20 border-gray-500/10 text-gray-500 cursor-not-allowed'
                          }`}
                          title={available ? `${remaining} slot${remaining !== 1 ? 's' : ''} remaining` : 'No slots available'}
                        >
                          <span className="font-semibold">{lv}{lv === 1 ? 'st' : lv === 2 ? 'nd' : lv === 3 ? 'rd' : 'th'}</span>
                          {lv > quickCastPending.minLevel && <span className="text-purple-400/50 ml-1">(upcast)</span>}
                          <span className="text-[10px] text-purple-400/40 ml-1.5">{remaining}/{slot?.max_slots || 0}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* No slots warning */}
              {slots.length > 0 && slots.every(s => s.max_slots === 0 || s.used_slots >= s.max_slots) && spells.some(s => s.level > 0 && (s.prepared || s.always_prepared)) && (
                <div className="mt-3 text-center py-2 bg-red-950/20 border border-red-500/15 rounded-lg">
                  <p className="text-xs text-red-300/70">No spell slots available. Take a {isWarlock ? 'short' : 'long'} rest to restore slots.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Concentration Swap Confirm */}
      <ConfirmDialog
        show={!!concentrationConfirm}
        title="Drop Concentration?"
        message={concentrationConfirm ? `Drop ${concentrationConfirm.oldSpell?.name || 'current spell'} to cast ${concentrationConfirm.spell?.name}?` : ''}
        onConfirm={confirmConcentrationSwap}
        onCancel={() => { setConcentrationConfirm(null); setQuickCastPending(null); }}
      />

      {/* Spell Slots */}
      <div className="card overflow-visible">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-display text-amber-100">
            {isWarlock ? 'Pact Magic Slots' : 'Spell Slots'}
            <HelpTooltip text={isWarlock ? HELP.pactMagic : HELP.spellSlots} />
            {isWarlock && (
              <span className="text-xs text-purple-300/60 font-normal ml-2">(recover on short rest)</span>
            )}
          </h3>
          {(() => {
            const cls = CLASSES.find(c => c.name === charData?.overview?.primary_class);
            const subclass = charData?.overview?.primary_subclass;
            const thirdCasterInfo = THIRD_CASTER_SUBCLASSES[subclass];
            const hasCasting = cls?.spellcasting?.type || (thirdCasterInfo && thirdCasterInfo.className === charData?.overview?.primary_class);
            if (!hasCasting) return null;
            return (
              <button
                onClick={handleAutoFillSlots}
                className="text-[10px] font-medium px-2.5 py-1.5 rounded bg-purple-900/20 border border-purple-500/25 text-purple-300/70 hover:bg-purple-900/40 hover:text-purple-200 transition-all flex items-center gap-1"
                title={`Set spell slots to the standard ${charData?.overview?.primary_class} table for level ${charData?.overview?.level}`}
              >
                <Wand2 size={10} /> Set from Class
              </button>
            );
          })()}
        </div>
        <p className="text-xs text-amber-200/30 mb-4">Click a circle to mark it as used. Bright = available, dim = spent. Use "{isWarlock ? 'Short' : 'Long'} Rest" to restore{isWarlock ? ' pact' : ' all'} slots.</p>
        <div className="grid grid-cols-3 md:grid-cols-9 gap-4">
          {[1,2,3,4,5,6,7,8,9].map(level => {
            const slot = slots.find(s => s.slot_level === level);
            const maxSlots = slot?.max_slots || 0;
            const usedSlots = slot?.used_slots || 0;
            if (maxSlots === 0) return (
              <div key={level} className="text-center opacity-30">
                <div className="text-xs text-amber-200/50 mb-1">{levelNames[level]?.split(' ')[0] || level}</div>
                <div className="text-xs">\u2014</div>
              </div>
            );
            const remaining = maxSlots - usedSlots;
            const slotPct = maxSlots > 0 ? remaining / maxSlots : 0;
            const slotColor = remaining === 0 ? 'text-red-400' : slotPct <= 0.34 ? 'text-amber-400' : 'text-purple-400';
            const dotAvail = remaining === 0 ? 'bg-red-500/60 border-red-400/50' : slotPct <= 0.34 ? 'bg-amber-500 border-amber-300 shadow-[0_0_6px_rgba(245,158,11,0.4)]' : 'bg-purple-500 border-purple-300 shadow-[0_0_6px_rgba(168,85,247,0.4)]';
            return (
              <div key={level} className="text-center pb-1">
                <div className="text-xs text-amber-200/50 mb-2">{levelNames[level]}</div>
                <div className="flex gap-1.5 justify-center flex-wrap">
                  {Array.from({ length: Math.max(0, maxSlots) }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handleSlotToggle(level, i)}
                      className={`w-5 h-5 rounded-full border-2 transition-all ${
                        i < usedSlots ? 'bg-purple-600/40 border-purple-400/40' : dotAvail
                      }`}
                      title={`${remaining}/${maxSlots} ${levelNames[level]} slots remaining`}
                      aria-label={`${levelNames[level]} spell slot ${i + 1} of ${maxSlots}, ${i < usedSlots ? 'used' : 'available'}`}
                    />
                  ))}
                </div>
                <div className={`text-xs mt-1 font-semibold ${slotColor}`}>{remaining}/{maxSlots}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spells by Level */}
      <p className="text-xs text-amber-200/30 -mb-3">Click a spell level header to expand and see your spells. Mark spells as "Prepared" if your class requires it.</p>
      {spells.length === 0 && (
        <div className="card border-dashed border-amber-200/10 text-center py-12">
          <Sparkles size={32} className="mx-auto text-amber-200/15 mb-3" />
          <p className="text-sm text-amber-200/30 mb-1">No spells yet \u2014 add your first spell to get started</p>
          <p className="text-xs text-amber-200/20">Use the "Add Spell" button to build your spellbook</p>
        </div>
      )}

      {/* Pinned / Favorite Spells */}
      {pinnedSpellsList.length > 0 && (
        <div className="card border-amber-500/20 bg-gradient-to-b from-amber-950/15 to-transparent">
          <div className="flex items-center gap-2 mb-3">
            <Pin size={14} className="text-amber-400" />
            <h3 className="font-display text-amber-100">Pinned Spells</h3>
            <span className="text-xs text-amber-200/40 font-normal">{'\u2014'} Quick access</span>
            <span className="text-amber-200/40 text-sm ml-auto">({pinnedSpellsList.length})</span>
          </div>
          <div className="space-y-2">
            {pinnedSpellsList.map(spell => (
              <SpellRow key={`pinned-${spell.id}`} spell={spell} level={spell.level} spells={spells} slots={slots} concentratingOn={concentratingOn} setConcentratingOn={setConcentratingOn} handleUpdateSpell={handleUpdateSpell} setConfirmDelete={setConfirmDelete} setEditingSpell={setEditingSpell} expandedSpell={expandedSpell} setExpandedSpell={setExpandedSpell} castSpell={castSpell} isPinned={true} onTogglePin={togglePinSpell} isKnownCaster={isKnownCaster} isPreparedCaster={isPreparedCaster} atPreparedCap={atPreparedCap} />
            ))}
          </div>
        </div>
      )}

      {/* Cantrips \u2014 pinned at top */}
      {(spellsByLevel[0] || []).length > 0 && (
        <div className="card border-purple-500/20">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-display text-amber-100">Cantrips</h3>
            <span className="text-xs text-purple-300/60 font-normal">\u2014 At Will</span>
            <span className="text-amber-200/40 text-sm ml-auto">({spellsByLevel[0].length})</span>
          </div>
          <div className="space-y-2">
            {spellsByLevel[0].map(spell => (
              <SpellRow key={spell.id} spell={spell} level={0} spells={spells} slots={slots} concentratingOn={concentratingOn} setConcentratingOn={setConcentratingOn} handleUpdateSpell={handleUpdateSpell} setConfirmDelete={setConfirmDelete} setEditingSpell={setEditingSpell} expandedSpell={expandedSpell} setExpandedSpell={setExpandedSpell} castSpell={castSpell} isPinned={pinnedSpells.includes(spell.id)} onTogglePin={togglePinSpell} isKnownCaster={isKnownCaster} isPreparedCaster={isPreparedCaster} atPreparedCap={atPreparedCap} />
            ))}
          </div>
          {/* Cantrip Scaling Display */}
          {(() => {
            const charLevel = charData?.overview?.level || 1;
            const tier = charLevel >= 17 ? 4 : charLevel >= 11 ? 3 : charLevel >= 5 ? 2 : 1;
            return (
              <div className="mt-3 flex items-center gap-2 text-xs text-amber-200/30 border-t border-amber-200/5 pt-3">
                <Info size={12} className="text-purple-400/60 flex-shrink-0" />
                <span>Cantrip damage scales at levels{' '}
                  <span className={tier >= 2 ? 'text-purple-300 font-semibold' : ''}>5</span>,{' '}
                  <span className={tier >= 3 ? 'text-purple-300 font-semibold' : ''}>11</span>,{' '}
                  <span className={tier >= 4 ? 'text-purple-300 font-semibold' : ''}>17</span>
                  {' '}<span className="text-amber-200/20">(current tier: {tier})</span>
                </span>
              </div>
            );
          })()}
        </div>
      )}

      {/* Divider between cantrips and leveled spells */}
      {(spellsByLevel[0] || []).length > 0 && [1,2,3,4,5,6,7,8,9].some(l => (spellsByLevel[l] || []).length > 0) && (
        <div className="border-t border-amber-200/10" />
      )}

      {/* Leveled spells (1-9) */}
      {[1,2,3,4,5,6,7,8,9].map(level => {
        const levelSpells = spellsByLevel[level] || [];
        if (levelSpells.length === 0) return null;
        const isExpanded = expandedLevel === level;
        return (
          <div key={level} className="card">
            <button
              className="w-full flex items-center justify-between"
              onClick={() => setExpandedLevel(isExpanded ? -1 : level)}
            >
              <h3 className="font-display text-amber-100">
                {levelNames[level]} <span className="text-amber-200/40 text-sm ml-2">({levelSpells.length})</span>
              </h3>
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {isExpanded && (
              <div className="mt-3 space-y-2">
                {levelSpells.map(spell => (
                  <SpellRow key={spell.id} spell={spell} level={level} spells={spells} slots={slots} concentratingOn={concentratingOn} setConcentratingOn={setConcentratingOn} handleUpdateSpell={handleUpdateSpell} setConfirmDelete={setConfirmDelete} setEditingSpell={setEditingSpell} expandedSpell={expandedSpell} setExpandedSpell={setExpandedSpell} castSpell={castSpell} isPinned={pinnedSpells.includes(spell.id)} onTogglePin={togglePinSpell} isKnownCaster={isKnownCaster} isPreparedCaster={isPreparedCaster} atPreparedCap={atPreparedCap} />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Add Spell Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            <SpellForm onSubmit={handleAddSpell} onCancel={() => setShowAdd(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Spell Modal */}
      {editingSpell && <SpellForm spell={editingSpell} onSubmit={handleEditSpell} onCancel={() => setEditingSpell(null)} />}

      <ConfirmDialog
        show={!!confirmDelete}
        title="Delete Spell?"
        message={`Remove "${confirmDelete?.name}" from your spellbook? This cannot be undone.`}
        onConfirm={() => handleDeleteSpell(confirmDelete.id)}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}

function SpellRow({ spell, level, spells, slots, concentratingOn, setConcentratingOn, handleUpdateSpell, setConfirmDelete, setEditingSpell, expandedSpell, setExpandedSpell, castSpell, isPinned = false, onTogglePin, isKnownCaster = false, isPreparedCaster = false, atPreparedCap = false }) {
  const [showUpcast, setShowUpcast] = useState(false);

  // Material component cost detection
  const goldCost = useMemo(() => {
    if (!spell.material) return null;
    const match = spell.material.match(/(\d[\d,]*)\s*gp/i);
    return match ? match[1] : null;
  }, [spell.material]);

  // Available upcast levels
  const upcastLevels = useMemo(() => {
    if (spell.level === 0) return [];
    const levels = [];
    for (let i = spell.level + 1; i <= 9; i++) {
      const slot = slots.find(s => s.slot_level === i);
      if (slot && slot.max_slots > 0) {
        levels.push({ level: i, available: slot.used_slots < slot.max_slots });
      }
    }
    return levels;
  }, [spell.level, slots]);

  return (
    <div className={`rounded p-3 border ${spell.always_prepared ? 'bg-emerald-950/20 border-emerald-500/20 border-l-2 border-l-emerald-500/50' : 'bg-[#0d0d12] border-gold/10'} ${spell.ritual ? 'border-l-2 border-l-blue-500/40' : ''}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-amber-100 font-medium">{spell.name}</span>
          {spell.concentration && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (concentratingOn === spell.id) {
                  setConcentratingOn(null);
                } else {
                  if (concentratingOn) {
                    const prev = spells.find(s => s.id === concentratingOn);
                    toast(`Dropped concentration on ${prev?.name || 'previous spell'}`, { icon: '\u26A0\uFE0F', duration: 3000 });
                  }
                  setConcentratingOn(spell.id);
                  toast.success(`Concentrating on ${spell.name}`);
                }
              }}
              className={`text-xs px-1.5 py-0.5 rounded transition-all ${
                concentratingOn === spell.id
                  ? 'bg-purple-600/60 text-purple-100 border border-purple-400/50 shadow-[0_0_8px_rgba(124,77,189,0.3)]'
                  : 'bg-purple-800/40 text-purple-300 hover:bg-purple-700/50'
              }`}
              title={concentratingOn === spell.id ? 'Click to drop concentration' : 'Click to concentrate on this spell'}
            >
              C
            </button>
          )}
          {spell.ritual && (
            <span
              className="text-xs bg-blue-800/50 text-blue-200 px-2 py-0.5 rounded border border-blue-500/30 font-medium cursor-help"
              title="Ritual: Can be cast as a ritual in 10 extra minutes without using a spell slot."
            >
              Ritual
            </span>
          )}
          {spell.level > 0 && (
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); castSpell(spell); }}
                className="text-[10px] font-bold px-2.5 py-1 rounded bg-purple-600/25 border border-purple-400/30 text-purple-300 hover:bg-purple-600/40 hover:border-purple-400/50 transition-all"
                title={`Cast ${spell.name} (uses ${spell.level}${spell.level === 1 ? 'st' : spell.level === 2 ? 'nd' : spell.level === 3 ? 'rd' : 'th'} level slot)`}
              >
                Cast
              </button>
              {/* Upcast button */}
              {upcastLevels.length > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setShowUpcast(!showUpcast); }}
                  className={`text-[10px] px-1.5 py-1 rounded border transition-all ${
                    showUpcast ? 'bg-purple-900/40 border-purple-500/40 text-purple-200' : 'bg-purple-900/20 border-purple-500/20 text-purple-400/60 hover:text-purple-300'
                  }`}
                  title="Upcast at a higher level"
                >
                  <ChevronUp size={10} />
                </button>
              )}
            </div>
          )}
          {level > 0 && (
            spell.always_prepared ? (
              <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-800/40 text-emerald-300 flex items-center gap-1" title="Always prepared (domain/oath spell) \u2014 cannot be unprepared">
                <Lock size={10} /> Prepared
              </span>
            ) : isKnownCaster ? (
              <span
                className="text-xs px-1.5 py-0.5 rounded bg-emerald-800/40 text-emerald-300"
                title="Known casters always have their spells available"
              >
                Known
              </span>
            ) : (
              <button
                onClick={() => {
                  if (!spell.prepared || !atPreparedCap) {
                    handleUpdateSpell(spell.id, { ...spell, prepared: !spell.prepared });
                  }
                }}
                disabled={!spell.prepared && atPreparedCap}
                className={`text-xs px-1.5 py-0.5 rounded transition-all ${
                  spell.prepared
                    ? 'bg-emerald-800/40 text-emerald-300'
                    : atPreparedCap
                    ? 'bg-gray-800/40 text-gray-500 cursor-not-allowed opacity-60'
                    : 'bg-gray-800/40 text-gray-400'
                }`}
                title={
                  !spell.prepared && atPreparedCap
                    ? 'Prepared spell limit reached \u2014 unprepare another spell first'
                    : spell.prepared
                    ? 'Click to unprepare'
                    : 'Click to prepare'
                }
              >
                {spell.prepared ? 'Prepared' : 'Unprepared'}
              </button>
            )
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {onTogglePin && (
            <button onClick={() => onTogglePin(spell.id)} className={`transition-colors ${isPinned ? 'text-amber-400 hover:text-amber-300' : 'text-amber-200/20 hover:text-amber-200/50'}`} aria-label={isPinned ? `Unpin spell ${spell.name}` : `Pin spell ${spell.name}`} title={isPinned ? 'Unpin spell' : 'Pin spell for quick access'}>
              {isPinned ? <PinOff size={13} /> : <Pin size={13} />}
            </button>
          )}
          <button onClick={() => setEditingSpell(spell)} className="text-amber-200/30 hover:text-amber-200/70 transition-colors" aria-label={`Edit spell ${spell.name}`} title="Edit spell">
            <Pencil size={13} />
          </button>
          <button onClick={() => setConfirmDelete(spell)} className="text-red-400/50 hover:text-red-400 transition-colors" aria-label={`Delete spell ${spell.name}`} title="Delete spell">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Upcast Level Selector */}
      {showUpcast && upcastLevels.length > 0 && (
        <div className="flex items-center gap-2 mb-2 mt-1 ml-1">
          <span className="text-xs text-purple-300/60">Upcast at:</span>
          {upcastLevels.map(({ level: lv, available }) => (
            <button
              key={lv}
              onClick={() => { if (available) { castSpell(spell, lv); setShowUpcast(false); } }}
              disabled={!available}
              className={`text-xs px-2 py-0.5 rounded border transition-all ${
                available
                  ? 'bg-purple-900/30 border-purple-500/30 text-purple-300 hover:bg-purple-900/50'
                  : 'bg-gray-900/20 border-gray-500/10 text-gray-500 cursor-not-allowed'
              }`}
              title={available ? `Cast at ${lv}${lv === 1 ? 'st' : lv === 2 ? 'nd' : lv === 3 ? 'rd' : 'th'} level` : 'No slots available'}
            >
              {lv}{lv === 1 ? 'st' : lv === 2 ? 'nd' : lv === 3 ? 'rd' : 'th'}
            </button>
          ))}
        </div>
      )}

      <div className="text-xs text-amber-200/40 space-x-3">
        {spell.school && <span>{spell.school}</span>}
        {spell.casting_time && <span>{spell.casting_time}</span>}
        {spell.spell_range && <span>Range: {spell.spell_range}</span>}
        {spell.duration && <span>Duration: {spell.duration}</span>}
      </div>
      {spell.components && (
        <div className="flex items-center gap-1 mt-1">
          {spell.components.split(',').map(c => c.trim()).filter(Boolean).map(comp => {
            const letter = comp.charAt(0).toUpperCase();
            const isM = letter === 'M';
            return (
              <span
                key={comp}
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-800/30 text-amber-300/80"
                title={isM && spell.material ? spell.material : `${comp === 'V' ? 'Verbal' : comp === 'S' ? 'Somatic' : comp === 'M' ? 'Material' : comp}`}
              >
                {letter}
              </span>
            );
          })}
          {goldCost && (
            <span className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-yellow-900/30 text-yellow-400/90 ml-1" title={`Material cost: ${goldCost} gp \u2014 ${spell.material}`}>
              <Coins size={10} className="text-yellow-500" /> {goldCost} gp
            </span>
          )}
        </div>
      )}
      {spell.description && expandedSpell !== spell.id && (
        <p className="text-[11px] italic text-amber-200/25 mt-1 leading-snug">
          {spell.description.length > 80 ? spell.description.slice(0, 80).trim() + '\u2026' : spell.description}
        </p>
      )}
      {spell.description && (
        <button
          onClick={() => setExpandedSpell(expandedSpell === spell.id ? null : spell.id)}
          className="flex items-center gap-1 text-xs text-amber-200/30 hover:text-amber-200/50 mt-1.5 transition-colors"
        >
          {expandedSpell === spell.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {expandedSpell === spell.id ? 'Hide description' : 'Show description'}
        </button>
      )}
      {expandedSpell === spell.id && (
        <div className="mt-2 space-y-2">
          {spell.description && <p className="text-sm text-amber-200/60">{spell.description}</p>}
          {/* Upcasting helper */}
          {spell.upcast_notes && (
            <div className="bg-purple-950/30 border border-purple-500/15 rounded p-2.5">
              <div className="text-[10px] uppercase tracking-wider text-purple-400/60 font-semibold mb-1">At Higher Levels</div>
              <p className="text-xs text-purple-300/70">{spell.upcast_notes}</p>
            </div>
          )}
          {/* Ritual casting note */}
          {spell.ritual && (
            <div className="bg-blue-950/30 border border-blue-500/15 rounded p-2.5 flex items-start gap-2">
              <BookOpen size={12} className="text-blue-400/60 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-blue-400/60 font-semibold mb-0.5">Ritual Casting</div>
                <p className="text-xs text-blue-300/70">Can be cast as a ritual, adding 10 minutes to the casting time. Does not consume a spell slot. Does not need to be prepared (for classes like Wizard).</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function QuickCastSpellButton({ spell, isCantrip = false, slots, concentratingOn, onCast }) {
  const slotInfo = useMemo(() => {
    if (isCantrip || spell.level === 0) return null;
    const slot = slots.find(s => s.slot_level === spell.level);
    if (!slot) return { remaining: 0, max: 0 };
    return { remaining: slot.max_slots - slot.used_slots, max: slot.max_slots };
  }, [spell.level, slots, isCantrip]);

  return (
    <button
      onClick={() => onCast(spell)}
      className={`w-full text-left rounded-lg px-2.5 py-2 border transition-all group ${
        isCantrip
          ? 'bg-purple-950/20 border-purple-500/15 hover:bg-purple-950/40 hover:border-purple-500/30'
          : 'bg-[#0d0d14] border-amber-200/8 hover:bg-purple-950/20 hover:border-purple-500/20'
      }`}
    >
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs font-medium text-amber-100 truncate">{spell.name}</span>
          {spell.concentration && (
            <span className={`text-[9px] px-1 py-px rounded font-bold flex-shrink-0 ${
              concentratingOn === spell.id
                ? 'bg-purple-600/60 text-purple-100 border border-purple-400/50'
                : 'bg-purple-800/40 text-purple-300/70'
            }`}>C</span>
          )}
          {spell.ritual && (
            <span className="text-[9px] px-1 py-px rounded bg-blue-800/40 text-blue-300/70 flex-shrink-0">R</span>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {isCantrip ? (
            <span className="text-[10px] text-purple-400/50">At Will</span>
          ) : (
            <>
              <span className="text-[10px] text-amber-200/30">Lv{spell.level}</span>
              {slotInfo && (
                <div className="flex gap-px ml-0.5">
                  {Array.from({ length: slotInfo.max }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        i < slotInfo.remaining ? 'bg-purple-400' : 'bg-gray-600/40'
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </button>
  );
}

function SpellForm({ spell, onSubmit, onCancel }) {
  const [form, setForm] = useState(spell || {
    name: '', level: 0, school: '', casting_time: '1 action',
    spell_range: '', components: '', material: '', duration: '',
    concentration: false, ritual: false, description: '', upcast_notes: '', prepared: false, always_prepared: false,
  });
  const [nameError, setNameError] = useState(false);

  const update = (field, value) => {
    if (field === 'name') setNameError(false);
    setForm(prev => ({ ...prev, [field]: value }));
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
      <div className="bg-[#14121c] border border-gold/30 rounded-lg p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
        <h3 className="font-display text-lg text-amber-100 mb-4">{spell ? 'Edit Spell' : 'Add Spell'}</h3>
        <div className="space-y-3">
          <div>
            <input className={`input w-full ${nameError ? 'border-red-500' : ''}`} placeholder="Spell name" value={form.name} onChange={e => update('name', e.target.value)} autoFocus />
            {nameError && <p className="text-red-400 text-xs mt-1">Name required</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Level</label>
              <select className="input w-full" value={form.level} onChange={e => update('level', parseInt(e.target.value, 10))}>
                {[0,1,2,3,4,5,6,7,8,9].map(l => <option key={l} value={l}>{l === 0 ? 'Cantrip' : `${l}`}</option>)}
              </select>
            </div>
            <div>
              <label className="label">School</label>
              <select className="input w-full" value={form.school} onChange={e => update('school', e.target.value)}>
                <option value="">Select...</option>
                {['Abjuration','Conjuration','Divination','Enchantment','Evocation','Illusion','Necromancy','Transmutation'].map(s =>
                  <option key={s} value={s}>{s}</option>
                )}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input className="input w-full" placeholder="Casting time" value={form.casting_time} onChange={e => update('casting_time', e.target.value)} />
            <input className="input w-full" placeholder="Range" value={form.spell_range} onChange={e => update('spell_range', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input className="input w-full" placeholder="Components (V,S,M)" value={form.components} onChange={e => update('components', e.target.value)} />
            <input className="input w-full" placeholder="Duration" value={form.duration} onChange={e => update('duration', e.target.value)} />
          </div>
          <input className="input w-full" placeholder="Material components" value={form.material} onChange={e => update('material', e.target.value)} />
          <textarea className="input w-full h-24 resize-none" placeholder="Describe the spell's effects, range, components, etc." value={form.description} onChange={e => update('description', e.target.value)} />
          <textarea className="input w-full h-16 resize-none" placeholder="At Higher Levels: describe what changes when cast at a higher spell slot level" value={form.upcast_notes} onChange={e => update('upcast_notes', e.target.value)} />
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-amber-200/60">
              <input type="checkbox" checked={form.concentration} onChange={e => update('concentration', e.target.checked)} /> Concentration
            </label>
            <label className="flex items-center gap-2 text-sm text-amber-200/60">
              <input type="checkbox" checked={form.ritual} onChange={e => update('ritual', e.target.checked)} /> Ritual
            </label>
            <label className="flex items-center gap-2 text-sm text-amber-200/60">
              <input type="checkbox" checked={form.prepared} onChange={e => update('prepared', e.target.checked)} /> Prepared
            </label>
            <label className="flex items-center gap-2 text-sm text-amber-200/60" title="Domain, oath, or subclass spells that are always prepared and cannot be swapped out">
              <input type="checkbox" checked={form.always_prepared} onChange={e => { update('always_prepared', e.target.checked); if (e.target.checked) update('prepared', true); }} /> Always Prepared
            </label>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-4">
          <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary text-sm">{spell ? 'Save Changes' : 'Add Spell'}</button>
        </div>
      </div>
      </div>
    </ModalPortal>
  );
}
