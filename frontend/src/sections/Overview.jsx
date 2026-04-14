import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { TrendingUp, TrendingDown, Heart, Shield, ShieldOff, Eye, Footprints, Moon, Coffee, Check, Star, Sparkles, Skull, Search, Brain, Swords, AlertTriangle, ChevronDown, ChevronUp, ChevronRight, StickyNote, Flame, Waves, Wind, Target, Wand2, Calculator, Package, Dices, X, Plus, Trash2, Compass, Loader2, RotateCcw, Pencil } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { getTotalLevel, getHitDiceBreakdown } from '../utils/multiclass';
import toast from 'react-hot-toast';
import { getOverview, updateOverview, updateAbilityScores, updateSavingThrows, updateSkills } from '../api/overview';
import { getItems } from '../api/inventory';
import { longRest, shortRest } from '../api/rest';
import { getFeatures, updateFeature } from '../api/features';
import { getSpells } from '../api/spells';
import { useAutosave } from '../hooks/useAutosave';
import SaveIndicator from '../components/SaveIndicator';
import HelpTooltip from '../components/HelpTooltip';
import RuleTooltip from '../components/RuleTooltip';
import { useRuleset } from '../contexts/RulesetContext';
import { useCampaignSyncSafe } from '../contexts/CampaignSyncContext';
import { HELP } from '../data/helpText';
import SubclassSelectModal from '../components/SubclassSelectModal';
import ModalPortal from '../components/ModalPortal';
import { computeConditionEffects, CONDITION_EFFECTS } from '../data/conditionEffects';
import { autoPopulateStats } from '../utils/autoPopulate';
import { calcMod, calcProfBonus, ABILITIES, ABILITY_ABBR_MAP, modStr, getEquippedStatBonuses } from '../utils/dndHelpers';
import { ARMOR_AC_TABLE } from '../data/armorData';
import { CLASS_HIT_DIE } from '../data/playerQuickRef';
import { SETTINGS_KEY } from './Settings';

const DAMAGE_TYPES = [
  'Acid', 'Bludgeoning', 'Cold', 'Fire', 'Force', 'Lightning', 'Necrotic',
  'Piercing', 'Poison', 'Psychic', 'Radiant', 'Slashing', 'Thunder',
  'Nonmagical Bludgeoning', 'Nonmagical Piercing', 'Nonmagical Slashing',
];

const OVERVIEW_TABS = [
  { id: 'stats', label: 'Stats', icon: Brain },
  { id: 'combat', label: 'Combat', icon: Swords },
  { id: 'character', label: 'Character', icon: Compass },
];

/** Calculate auto HP: max hit die at level 1, then (avg + CON mod) per subsequent level */
function calcAutoHP(className, level, conMod) {
  const hitDie = CLASS_HIT_DIE[className];
  if (!hitDie || level < 1) return null;
  const avg = Math.floor(hitDie / 2) + 1; // average rounded up (standard D&D rule)
  const hpAtOne = hitDie + conMod;
  const hpAfterOne = (level - 1) * (avg + conMod);
  return Math.max(1, hpAtOne + hpAfterOne);
}

// Extracted outside the component to prevent focus loss on re-render
function SectionToggle({ id, title, summary, icon: CardIcon, helpTooltip, rightContent, children, collapsedSections, toggleCollapse }) {
  const isCollapsed = collapsedSections.has(id);
  return (
    <>
      <button
        onClick={() => toggleCollapse(id)}
        className="w-full flex items-center gap-2 text-left group mb-1"
      >
        {isCollapsed ? <ChevronRight size={14} className="text-amber-200/30 flex-shrink-0" /> : <ChevronDown size={14} className="text-amber-200/30 flex-shrink-0" />}
        {CardIcon && <CardIcon size={15} className="text-gold/60 flex-shrink-0" />}
        <h3 className="font-display text-amber-100 flex-shrink-0">{title}</h3>
        {helpTooltip}
        {isCollapsed && summary && (
          <span className="text-xs text-amber-200/35 ml-2 truncate font-mono">{summary}</span>
        )}
        {!isCollapsed && rightContent && <span className="ml-auto">{rightContent}</span>}
      </button>
      {!isCollapsed && children}
    </>
  );
}

export default function Overview({ characterId, character, onCharacterUpdate, onLevelUp, activeConditions = [] }) {
  const { PROFICIENCY_BONUS, SKILLS, RACES, CLASSES, CONDITIONS, EXHAUSTION_LEVELS, ancestryLabel } = useRuleset();
  const syncCtx = useCampaignSyncSafe();
  const dmSessionLocked = syncCtx?.dmSessionActive && !syncCtx?.isHost;
  const allowMulticlass = (() => {
    try { return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}').allowMulticlass !== false; } catch { return true; }
  })();
  const [overview, setOverview] = useState(null);
  const [abilities, setAbilities] = useState([]);
  const [saves, setSaves] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localAbilities, setLocalAbilities] = useState({});
  const [itemStatBonuses, setItemStatBonuses] = useState({});
  const [itemSaveBonus, setItemSaveBonus] = useState(0);
  const [itemMagicBonuses, setItemMagicBonuses] = useState([]); // [{name, magic_bonus, item_type}]
  const [attunedCount, setAttunedCount] = useState(0);
  const [stealthDisadvantage, setStealthDisadvantage] = useState(false);
  const [showSubclassModal, setShowSubclassModal] = useState(false);
  const [showLevelConfirm, setShowLevelConfirm] = useState(null);
  const [overviewTab, setOverviewTab] = useState(() => {
    try {
      const stored = localStorage.getItem(`codex-overview-tab-${characterId}`);
      if (stored && ['stats', 'combat', 'character', 'multiclass'].includes(stored)) return stored;
    } catch {}
    return 'stats';
  });
  const [acCalcResult, setAcCalcResult] = useState(null); // { total, breakdown[] }

  const switchOverviewTab = useCallback((tab) => {
    setOverviewTab(tab);
    try { localStorage.setItem(`codex-overview-tab-${characterId}`, tab); } catch {}
  }, [characterId]);
  const [diceHintDismissed, setDiceHintDismissed] = useState(() => !!localStorage.getItem('codex-dice-hint-dismissed'));
  const prevLevelRef = useRef(null);
  const subclassTimeoutRef = useRef(null);

  // Collapsible sections state (Phase 2)
  const DEFAULT_COLLAPSED = new Set(['multiclass', 'passive-skills', 'damage-mods', 'proficiencies', 'features', 'notes', 'goals']);
  const [collapsedSections, setCollapsedSections] = useState(() => {
    try {
      const stored = localStorage.getItem(`codex-overview-collapsed-${characterId}`);
      if (stored) return new Set(JSON.parse(stored));
    } catch {}
    return new Set(DEFAULT_COLLAPSED);
  });

  const toggleCollapse = useCallback((section) => {
    setCollapsedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      try { localStorage.setItem(`codex-overview-collapsed-${characterId}`, JSON.stringify([...next])); } catch {}
      return next;
    });
  }, [characterId]);

  const collapseAll = useCallback(() => {
    const all = new Set(['multiclass', 'passive-skills', 'damage-mods', 'proficiencies', 'features', 'notes', 'goals', 'ability-scores', 'saving-throws', 'skills', 'hp', 'hit-dice', 'inspiration-exhaustion']);
    setCollapsedSections(all);
    try { localStorage.setItem(`codex-overview-collapsed-${characterId}`, JSON.stringify([...all])); } catch {}
  }, [characterId]);

  const expandAll = useCallback(() => {
    setCollapsedSections(new Set());
    try { localStorage.setItem(`codex-overview-collapsed-${characterId}`, JSON.stringify([])); } catch {}
  }, [characterId]);

  const loadData = async () => {
    try {
      const data = await getOverview(characterId);
      setOverview(data.overview);
      setAbilities(data.ability_scores);
      setSaves(data.saving_throws);
      setSkills(data.skills);
      // Init local ability display strings
      const localAb = {};
      data.ability_scores.forEach(a => { localAb[a.ability] = String(a.score); });
      setLocalAbilities(localAb);
      prevLevelRef.current = data.overview.level;
      // Load equipped item stat bonuses, save bonuses, and magic bonuses
      try {
        const allItems = await getItems(characterId);
        const bonuses = getEquippedStatBonuses(allItems);
        let totalSaveBonus = 0;
        const magicItems = [];
        for (const item of allItems.filter(i => i.equipped)) {
          // Accumulate save bonus from items like Cloak of Protection
          if (item.save_bonus && typeof item.save_bonus === 'number' && item.save_bonus > 0) {
            totalSaveBonus += item.save_bonus;
          }
          // Track magic bonus items for attack/AC display
          if (item.magic_bonus && typeof item.magic_bonus === 'number' && item.magic_bonus > 0) {
            magicItems.push({ name: item.name, magic_bonus: item.magic_bonus, item_type: item.item_type });
          }
        }
        setItemStatBonuses(bonuses);
        setItemSaveBonus(totalSaveBonus);
        // Detect stealth disadvantage from equipped armor (heavy armor + Scale Mail + Half Plate)
        const STEALTH_DISADV_ARMOR = ['Ring Mail', 'Chain Mail', 'Splint Armor', 'Plate Armor', 'Scale Mail', 'Half Plate', 'Padded Armor'];
        setStealthDisadvantage(equipped.some(i => STEALTH_DISADV_ARMOR.includes(i.name)));
        setItemMagicBonuses(magicItems);
        // Count attuned items for attunement display
        setAttunedCount(allItems.filter(i => i.attuned).length);
      } catch (err) { if (import.meta.env.DEV) console.warn('Failed to load item stat bonuses:', err); }
    } catch (err) {
      toast.error(`Failed to load: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [characterId]);

  useEffect(() => {
    return () => {
      if (subclassTimeoutRef.current) clearTimeout(subclassTimeoutRef.current);
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
      if (diceResultTimerRef.current) clearTimeout(diceResultTimerRef.current);
    };
  }, []);

  const saveOverview = useCallback(async (data) => {
    await updateOverview(characterId, data);
    onCharacterUpdate(data);
  }, [characterId, onCharacterUpdate]);

  const saveAbilities = useCallback(async (data) => {
    await updateAbilityScores(characterId, data);
  }, [characterId]);

  const saveSaves = useCallback(async (data) => {
    await updateSavingThrows(characterId, data);
  }, [characterId]);

  const saveSkills = useCallback(async (data) => {
    await updateSkills(characterId, data);
  }, [characterId]);

  const { trigger: triggerOverview, saving: savingOverview, lastSaved: overviewSaved } = useAutosave(saveOverview);
  const { trigger: triggerAbilities } = useAutosave(saveAbilities);
  const { trigger: triggerSaves } = useAutosave(saveSaves);
  const { trigger: triggerSkills } = useAutosave(saveSkills);

  const [notesOpen, setNotesOpen] = useState(false);
  const [goalsOpen, setGoalsOpen] = useState(false);
  const [personalArcs, setPersonalArcs] = useState([]);
  const [arcsLoading, setArcsLoading] = useState(false);
  const [expandedArcId, setExpandedArcId] = useState(null);
  const [arcEntries, setArcEntries] = useState({});
  const [arcEntriesLoading, setArcEntriesLoading] = useState({});
  const [showShortRest, setShowShortRest] = useState(false);
  const [showDamage, setShowDamage] = useState(false);
  const [showHeal, setShowHeal] = useState(false);
  const [showTempHpInput, setShowTempHpInput] = useState(false);
  const [damageAmount, setDamageAmount] = useState('');
  const [healAmount, setHealAmount] = useState('');
  const [tempHpAmount, setTempHpAmount] = useState('');
  const [damageModifier, setDamageModifier] = useState('normal'); // 'normal' | 'resistant' | 'vulnerable'
  const [damageType, setDamageType] = useState(''); // selected damage type for auto-modifier detection
  const prevHpRef = useRef(null);
  const smartDamageAppliedRef = useRef(false);
  const [lastHpAction, setLastHpAction] = useState(null); // { prevHp, prevTempHp, label, timestamp }
  const undoTimerRef = useRef(null);

  // ── Dice Roll Center Popup ──
  const [diceResult, setDiceResult] = useState(null); // { label, d20, mod, total, nat20, nat1, mode }
  const diceResultTimerRef = useRef(null);

  // ── Value-change flash tracking ──
  const prevSaveModsRef = useRef({});
  const prevSkillModsRef = useRef({});
  const [flashedSaves, setFlashedSaves] = useState({});
  const [flashedSkills, setFlashedSkills] = useState({});

  // ── Automation Engine State ──
  const [showHPCalc, setShowHPCalc] = useState(false);
  const [showLevelUpSummary, setShowLevelUpSummary] = useState(null); // { level, gains }
  const [hpRollResult, setHpRollResult] = useState(null);

  // Concentration tracker (session-only, stored in localStorage per character)
  const [concentrationSpell, setConcentrationSpell] = useState('');
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`codex_concentration_${characterId}`);
      if (stored) setConcentrationSpell(stored);
    } catch (err) { if (import.meta.env.DEV) console.warn('Failed to read concentration from localStorage:', err); }
  }, [characterId]);
  const updateConcentration = (val) => {
    setConcentrationSpell(val);
    try {
      if (val) localStorage.setItem(`codex_concentration_${characterId}`, val);
      else localStorage.removeItem(`codex_concentration_${characterId}`);
    } catch (err) { if (import.meta.env.DEV) console.warn('Failed to save concentration to localStorage:', err); }
    window.dispatchEvent(new Event('codex-concentration-changed'));
  };

  // ── Personal Goals (Character Arcs) ──
  const loadPersonalArcs = useCallback(async () => {
    setArcsLoading(true);
    try {
      const allArcs = await invoke('list_character_arcs');
      // Filter arcs belonging to this character
      const mine = (allArcs || []).filter(a => a.character_id === characterId);
      setPersonalArcs(mine);
    } catch (err) {
      if (import.meta.env.DEV) console.warn('[Overview] list_character_arcs:', err);
    } finally {
      setArcsLoading(false);
    }
  }, [characterId]);

  useEffect(() => {
    if (goalsOpen && personalArcs.length === 0 && !arcsLoading) {
      loadPersonalArcs();
    }
  }, [goalsOpen, loadPersonalArcs, personalArcs.length, arcsLoading]);

  const loadArcEntries = useCallback(async (arcId) => {
    setArcEntriesLoading(prev => ({ ...prev, [arcId]: true }));
    try {
      const entries = await invoke('get_arc_entries', { arcId });
      setArcEntries(prev => ({ ...prev, [arcId]: entries || [] }));
    } catch (err) {
      if (import.meta.env.DEV) console.warn('[Overview] get_arc_entries:', err);
    } finally {
      setArcEntriesLoading(prev => ({ ...prev, [arcId]: false }));
    }
  }, []);

  const toggleArcExpand = useCallback((arcId) => {
    setExpandedArcId(prev => {
      const newId = prev === arcId ? null : arcId;
      if (newId && !arcEntries[arcId]) loadArcEntries(arcId);
      return newId;
    });
  }, [arcEntries, loadArcEntries]);

  // Speed variants (climb, swim, fly) — stored in overview fields
  const [showSpeedVariants, setShowSpeedVariants] = useState(false);

  // Damage modifiers (resistances, immunities, vulnerabilities)
  const [dmAddCategory, setDmAddCategory] = useState('resistances'); // which category the dropdown targets
  const [dmAddType, setDmAddType] = useState('');
  const parsedDamageModifiers = useMemo(() => {
    if (!overview?.damage_modifiers) return { resistances: [], immunities: [], vulnerabilities: [] };
    try {
      const parsed = typeof overview.damage_modifiers === 'string'
        ? JSON.parse(overview.damage_modifiers)
        : overview.damage_modifiers;
      return {
        resistances: parsed.resistances || [],
        immunities: parsed.immunities || [],
        vulnerabilities: parsed.vulnerabilities || [],
      };
    } catch (err) { if (import.meta.env.DEV) console.warn('Failed to parse damage_modifiers:', err); return { resistances: [], immunities: [], vulnerabilities: [] }; }
  }, [overview?.damage_modifiers]);

  const updateDamageModifiers = (newMods) => {
    const json = JSON.stringify(newMods);
    const updated = { ...overview, damage_modifiers: json };
    setOverview(updated);
    triggerOverview(updated);
  };

  const addDamageModifier = (category, type) => {
    if (!type) return;
    const mods = { ...parsedDamageModifiers };
    if (mods[category].includes(type)) return;
    // Remove from other categories (a type can only be in one category)
    mods.resistances = mods.resistances.filter(t => t !== type);
    mods.immunities = mods.immunities.filter(t => t !== type);
    mods.vulnerabilities = mods.vulnerabilities.filter(t => t !== type);
    mods[category] = [...mods[category], type];
    updateDamageModifiers(mods);
    setDmAddType('');
  };

  const removeDamageModifier = (category, type) => {
    const mods = { ...parsedDamageModifiers };
    mods[category] = mods[category].filter(t => t !== type);
    updateDamageModifiers(mods);
  };

  const handleLongRest = async () => {
    try {
      const result = await longRest(characterId);
      result.restored.forEach(msg => toast.success(msg, { duration: 3000 }));
      // Auto-restore features
      try {
        const features = await getFeatures(characterId);
        const targets = features.filter(f => (f.uses_total ?? 0) > 0 && (f.uses_remaining ?? 0) < (f.uses_total ?? 0) && f.recharge && f.recharge !== 'recharge_5_6' && f.recharge !== 'recharge_6');
        if (targets.length > 0) {
          await Promise.all(targets.map(f => updateFeature(characterId, f.id, { ...f, uses_remaining: f.uses_total })));
          toast.success(`${targets.length} feature${targets.length > 1 ? 's' : ''} restored`, { duration: 3000 });
        }
      } catch (err) { if (import.meta.env.DEV) console.warn('Failed to restore features on long rest:', err); }
      loadData();
    } catch (err) {
      toast.error(`Long rest failed: ${err.message}`);
    }
  };

  const handleShortRest = async (hitDice = 0) => {
    try {
      const result = await shortRest(characterId, hitDice);
      result.restored.forEach(msg => toast.success(msg, { duration: 3000 }));
      // Auto-restore short rest features
      try {
        const features = await getFeatures(characterId);
        const targets = features.filter(f => (f.uses_total ?? 0) > 0 && (f.uses_remaining ?? 0) < (f.uses_total ?? 0) && f.recharge === 'short_rest');
        if (targets.length > 0) {
          await Promise.all(targets.map(f => updateFeature(characterId, f.id, { ...f, uses_remaining: f.uses_total })));
          toast.success(`${targets.length} feature${targets.length > 1 ? 's' : ''} restored`, { duration: 3000 });
        }
      } catch (err) { if (import.meta.env.DEV) console.warn('Failed to restore features on short rest:', err); }
      setShowShortRest(false);
      loadData();
    } catch (err) {
      toast.error(`Short rest failed: ${err.message}`);
    }
  };

  const applyDamage = () => {
    const rawDmg = parseInt(damageAmount) || 0;
    if (rawDmg <= 0) return;
    // Auto-detect modifier from damage modifiers if a damage type is selected and modifier is 'normal'
    let effectiveModifier = damageModifier;
    let autoDetected = false;
    if (damageType && damageModifier === 'normal') {
      const mods = parsedDamageModifiers;
      if (mods.immunities.includes(damageType)) { effectiveModifier = 'immune'; autoDetected = true; }
      else if (mods.resistances.includes(damageType)) { effectiveModifier = 'resistant'; autoDetected = true; }
      else if (mods.vulnerabilities.includes(damageType)) { effectiveModifier = 'vulnerable'; autoDetected = true; }
    }
    // Apply resistance/vulnerability/immunity
    let dmg = rawDmg;
    if (effectiveModifier === 'immune') dmg = 0;
    else if (effectiveModifier === 'resistant') dmg = Math.floor(rawDmg / 2);
    else if (effectiveModifier === 'vulnerable') dmg = rawDmg * 2;

    let remaining = dmg;
    let newTemp = overview.temp_hp || 0;
    let newCurrent = overview.current_hp;
    const oldTemp = newTemp;
    // Temp HP absorbs first
    if (newTemp > 0) {
      const absorbed = Math.min(newTemp, remaining);
      newTemp -= absorbed;
      remaining -= absorbed;
    }
    newCurrent = Math.max(0, newCurrent - remaining);
    const tempAbsorbed = oldTemp - newTemp;

    smartDamageAppliedRef.current = true; // prevent duplicate concentration toast from useEffect
    // Save undo state
    setLastHpAction({ prevHp: overview.current_hp, prevTempHp: overview.temp_hp || 0, label: `${dmg} damage` });
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(() => setLastHpAction(null), 10000);
    const updated = { ...overview, temp_hp: newTemp, current_hp: newCurrent };
    // If HP drops to 0, activate death save mode (clear previous saves)
    if (newCurrent === 0 && overview.current_hp > 0) {
      updated.death_save_successes = 0;
      updated.death_save_failures = 0;
    }
    setOverview(updated);
    triggerOverview(updated);

    // Build summary toast
    const parts = [];
    const typeLabel = damageType ? `${damageType} damage` : 'damage';
    if (effectiveModifier === 'immune') {
      parts.push(`${typeLabel} negated by immunity!`);
    } else if (effectiveModifier === 'resistant') {
      parts.push(`${rawDmg} ${typeLabel} halved to ${dmg}${autoDetected ? ' (resistance)' : ''}`);
    } else if (effectiveModifier === 'vulnerable') {
      parts.push(`${rawDmg} ${typeLabel} doubled to ${dmg}${autoDetected ? ' (vulnerability)' : ''}`);
    } else {
      parts.push(`Took ${dmg} ${typeLabel}`);
    }
    if (tempAbsorbed > 0) parts.push(`${tempAbsorbed} absorbed by temp HP`);
    parts.push(`HP: ${newCurrent}/${overview.max_hp}`);
    const toastColor = effectiveModifier === 'immune' ? { background: '#0a1a1a', color: '#fde68a', border: '1px solid rgba(234,179,8,0.3)' }
      : { background: '#1a1520', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)' };
    toast(parts.join('. ') + '.', { icon: effectiveModifier === 'immune' ? '\u{1F6E1}' : '\u2694\uFE0F', duration: 4000, style: toastColor });

    // Unconscious warning
    if (newCurrent === 0 && overview.current_hp > 0) {
      toast.error("You're unconscious!", { duration: 5000, icon: '💀' });
    }

    // Concentration check (uses actual damage to HP for DC, not temp-absorbed)
    const hpDamage = dmg - tempAbsorbed;
    if (concentrationSpell && hpDamage > 0 && newCurrent > 0) {
      const dc = Math.max(10, Math.floor(hpDamage / 2));
      const conMod = calcMod(abilityMap.CON || 10);
      const conSaveBonus = conMod + (saves.find(s => s.ability === 'CON')?.proficient ? profBonus : 0);
      toast(
        (t) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span>Concentration check! DC {dc} ({concentrationSpell})</span>
            <button
              onClick={() => {
                rollDice(`CON Save (Concentration DC ${dc})`, conSaveBonus);
                toast.dismiss(t.id);
              }}
              style={{ background: 'rgba(139,92,246,0.3)', border: '1px solid rgba(139,92,246,0.5)', color: '#c4b5fd', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--font-display)' }}
            >
              Roll CON Save ({modStr(conSaveBonus)})
            </button>
          </div>
        ),
        { duration: 8000, style: { background: '#1a1025', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.3)' } }
      );
    }

    // Fetch and suggest reaction spells
    if (newCurrent > 0) {
      getSpells(characterId).then(spells => {
        const REACTION_SPELL_NAMES = ['Shield', 'Absorb Elements', 'Counterspell', 'Hellish Rebuke', 'Silvery Barbs', 'Feather Fall'];
        const available = (spells || []).filter(s =>
          s.prepared && REACTION_SPELL_NAMES.some(name => s.name?.toLowerCase() === name.toLowerCase())
        );
        if (available.length > 0) {
          toast(
            `Reaction spells available: ${available.map(s => s.name).join(', ')}`,
            { icon: '✨', duration: 5000, style: { background: '#1a1a25', color: '#93c5fd', border: '1px solid rgba(96,165,250,0.3)' } }
          );
        }
      }).catch((err) => { if (import.meta.env.DEV) console.warn('Failed to fetch reaction spells:', err); });
    }

    setDamageAmount('');
    setDamageModifier('normal');
    setDamageType('');
    setShowDamage(false);
  };

  const applyHeal = () => {
    const heal = parseInt(healAmount) || 0;
    if (heal <= 0) return;
    const healCap = condEffects.hpMaxHalved ? Math.floor(overview.max_hp / 2) : overview.max_hp;
    const newCurrent = Math.min(healCap, overview.current_hp + heal);
    const actualHeal = newCurrent - overview.current_hp;
    // Save undo state
    setLastHpAction({ prevHp: overview.current_hp, prevTempHp: overview.temp_hp || 0, label: `${actualHeal} heal` });
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(() => setLastHpAction(null), 10000);
    const updated = { ...overview, current_hp: newCurrent };
    // If healing from 0 HP, clear death saves and exit death save mode
    if (overview.current_hp === 0 && newCurrent > 0) {
      updated.death_save_successes = 0;
      updated.death_save_failures = 0;
    }
    setOverview(updated);
    triggerOverview(updated);
    if (actualHeal > 0) {
      toast.success(`Healed ${actualHeal} HP. HP: ${newCurrent}/${overview.max_hp}`, { duration: 3000 });
    }
    setHealAmount('');
    setShowHeal(false);
  };

  const applyTempHp = () => {
    const amount = parseInt(tempHpAmount) || 0;
    if (amount <= 0) return;
    // Temp HP doesn't stack — take the higher value
    const newTemp = Math.max(overview.temp_hp || 0, amount);
    const updated = { ...overview, temp_hp: newTemp };
    setOverview(updated);
    triggerOverview(updated);
    if (newTemp === overview.temp_hp && amount <= (overview.temp_hp || 0)) {
      toast(`Temp HP not applied — current (${overview.temp_hp}) is higher`, { icon: '🛡️', duration: 3000 });
    } else {
      toast.success(`Temp HP set to ${newTemp}`, { duration: 3000 });
    }
    setTempHpAmount('');
    setShowTempHpInput(false);
  };

  const rollDice = (label, mod, { disadvantage = false, advantage = false } = {}) => {
    const d20a = Math.floor(Math.random() * 20) + 1;
    const hasAdvDis = advantage || disadvantage;
    const d20b = hasAdvDis ? Math.floor(Math.random() * 20) + 1 : d20a;
    let d20;
    let mode = '';
    if (advantage && disadvantage) {
      d20 = d20a;
      mode = 'ADV+DIS cancel';
    } else if (advantage) {
      d20 = Math.max(d20a, d20b);
      mode = `ADV: ${d20a}, ${d20b}`;
    } else if (disadvantage) {
      d20 = Math.min(d20a, d20b);
      mode = `DIS: ${d20a}, ${d20b}`;
    } else {
      d20 = d20a;
    }
    const total = d20 + mod;
    if (diceResultTimerRef.current) clearTimeout(diceResultTimerRef.current);
    setDiceResult({ label, d20, mod, total, nat20: d20 === 20, nat1: d20 === 1, mode });
    diceResultTimerRef.current = setTimeout(() => setDiceResult(null), 3000);
  };

  const rollAbilityCheck = (ability, mod) => {
    rollDice(`${ABILITY_ABBR_MAP[ability]} Check`, mod, { disadvantage: condEffects.checkDisadvantage });
  };

  const rollSavingThrow = (ability, mod, isAutoFail, hasDis) => {
    if (isAutoFail) {
      // Show auto-fail in the dice result popup AND toast
      if (diceResultTimerRef.current) clearTimeout(diceResultTimerRef.current);
      setDiceResult({ label: `${ABILITY_ABBR_MAP[ability]} Save`, d20: 0, mod: 0, total: 0, nat20: false, nat1: false, mode: 'AUTO-FAIL (condition)', autoFail: true });
      diceResultTimerRef.current = setTimeout(() => setDiceResult(null), 3000);
      return;
    }
    // Check for exhaustion 3+ save disadvantage on all saves
    const disFromAll = condEffects.saveDisadvantageAll;
    rollDice(`${ABILITY_ABBR_MAP[ability]} Save`, mod, { disadvantage: hasDis || disFromAll });
  };

  const rollSkillCheck = (skillName, ability, mod, { advantage = false, disadvantage = false } = {}) => {
    const condDis = condEffects.checkDisadvantage;
    // Merge manual and condition-based advantage/disadvantage
    rollDice(`${skillName} (${ability})`, mod, { disadvantage: condDis || disadvantage, advantage });
  };

  /** Shared helper: apply all cascading effects of a level change to `updated` object (mutates it). */
  const applyLevelChange = (oldLevel, newLevel, updated) => {
    const classData = CLASSES.find(c => c.name === overview.primary_class);
    const conMod = calcMod(abilityMap.CON || 10);

    // Hit dice update
    if (classData?.hitDie) {
      updated.hit_dice_total = `${newLevel}d${classData.hitDie}`;
    }

    if (newLevel > oldLevel) {
      // ── Level-up ──
      onLevelUp(overview.name, newLevel, overview.primary_class);

      // Subclass prompt
      if (classData && classData.subclassLevel && newLevel >= classData.subclassLevel && !overview.primary_subclass) {
        subclassTimeoutRef.current = setTimeout(() => setShowSubclassModal(true), 2000);
      }

      // Auto HP for level up
      if (classData?.hitDie && overview.hp_calc_method !== 'manual') {
        const avgRoll = Math.floor(classData.hitDie / 2) + 1;
        const hpGain = avgRoll + conMod;
        updated.max_hp = Math.max(1, (overview.max_hp || 0) + Math.max(1, hpGain));
        updated.current_hp = updated.max_hp;
        toast.success(`Level ${newLevel}! HP +${Math.max(1, hpGain)} (d${classData.hitDie} avg + CON ${modStr(conMod)}) = ${updated.max_hp} Max HP`, { duration: 4000 });
      }

      // Level-up summary (proficiency, features, ASI)
      const newProf = calcProfBonus(newLevel);
      const oldProf = calcProfBonus(newLevel - 1);
      const gains = { level: newLevel };
      if (newProf > oldProf) {
        gains.profBonusChange = { old: oldProf, new: newProf };
      }
      if (classData?.features) {
        gains.newFeatures = classData.features.filter(f => f.level === newLevel);
      }
      const asiLevels = overview.primary_class === 'Fighter' ? [4,6,8,12,14,16,19] : overview.primary_class === 'Rogue' ? [4,8,10,12,16,19] : [4,8,12,16,19];
      if (asiLevels.includes(newLevel)) {
        gains.isASI = true;
      }
      if (gains.profBonusChange || (gains.newFeatures && gains.newFeatures.length > 0) || gains.isASI) {
        setShowLevelUpSummary(gains);
      }
    } else {
      // ── Level-down ──
      if (classData?.hitDie && overview.hp_calc_method !== 'manual') {
        const autoHP = calcAutoHP(overview.primary_class, newLevel, conMod);
        if (autoHP !== null) {
          updated.max_hp = autoHP;
          updated.current_hp = Math.min(overview.current_hp, autoHP);
        }
      }
    }
  };

  const updateField = (field, value) => {
    let v = value;
    // Level clamping
    if (field === 'level') {
      v = Math.max(1, Math.min(20, v || 1));
    }
    // AC clamping (D&D valid range 0-30)
    if (field === 'armor_class') {
      v = Math.max(0, Math.min(30, v || 10));
    }
    // HP clamping
    if (field === 'max_hp') {
      v = Math.max(0, Math.min(999, v || 0));
    }
    if (field === 'current_hp') {
      v = Math.max(0, Math.min(v, overview.max_hp || 999));
    }
    if (field === 'temp_hp') {
      v = Math.max(0, Math.min(999, v));
    }
    if (field === 'max_hp' && overview.current_hp > v && v > 0) {
      // If max HP drops below current, clamp current
      const updated = { ...overview, [field]: v, current_hp: v };
      setOverview(updated);
      triggerOverview(updated);
      return;
    }

    const updated = { ...overview, [field]: v };
    setOverview(updated);

    if (field === 'level' && prevLevelRef.current !== null && v !== prevLevelRef.current) {
      applyLevelChange(prevLevelRef.current, v, updated);
      prevLevelRef.current = v;
    }

    // ── Auto level-up/down from XP changes ──
    if (field === 'experience_points') {
      const newLevel = getLevelFromXP(v);
      if (newLevel !== overview.level) {
        updated.level = newLevel;
        applyLevelChange(overview.level, newLevel, updated);
        prevLevelRef.current = newLevel;
        setOverview(updated);
      }
    }

    triggerOverview(updated);
  };

  const handleSubclassSelect = async (subclass) => {
    setShowSubclassModal(false);
    const updated = { ...overview, primary_subclass: subclass };
    setOverview(updated);
    triggerOverview(updated);
    toast.success(`Subclass set to ${subclass}!`);
    if (onCharacterUpdate) onCharacterUpdate({ ...character, primary_subclass: subclass });
  };

  const handleAutoPopulate = () => {
    const classData = CLASSES.find(c => c.name === overview.primary_class);
    const raceData = RACES.find(r => {
      const val = r.subrace ? `${r.name} (${r.subrace})` : r.name;
      return val === overview.race;
    });

    if (!classData && !raceData) {
      toast.error('Set a class and race before auto-populating.');
      return;
    }

    const result = autoPopulateStats({
      classData,
      raceData,
      level: overview.level || 1,
      overview,
      abilities,
      saves,
      respectManualEdits: true,
    });

    // Apply overview changes
    setOverview(result.overview);
    triggerOverview(result.overview);

    // Apply ability score changes
    if (result.abilities !== abilities) {
      setAbilities(result.abilities);
      const localAb = {};
      result.abilities.forEach(a => { localAb[a.ability] = String(a.score); });
      setLocalAbilities(localAb);
      triggerAbilities(result.abilities);
    }

    // Apply saving throw changes
    if (result.saves !== saves) {
      setSaves(result.saves);
      triggerSaves(result.saves);
    }

    if (result.changes.length > 0) {
      toast.success(result.summary, { duration: 5000 });
    } else {
      toast('No changes applied — fields already have values. Clear them first to re-populate.', { icon: '\u2139\uFE0F', duration: 4000 });
    }
  };

  const updateAbility = (ability, score) => {
    const updated = abilities.map(a => a.ability === ability ? { ...a, score } : a);
    setAbilities(updated);
    setLocalAbilities(prev => ({ ...prev, [ability]: String(score) }));
    triggerAbilities(updated);

    // ── Cascading updates when ability score changes ──
    const newAbilityMap = {};
    updated.forEach(a => { newAbilityMap[a.ability] = a.score; });
    const newMod = calcMod(score);
    const oldMod = calcMod(abilityMap[ability] || 10);

    // If CON changed and HP is auto-calculated, adjust HP proportionally
    if (ability === 'CON' && overview?.hp_calc_method !== 'manual' && overview?.primary_class) {
      const oldConMod = oldMod;
      const newConMod = newMod;
      if (oldConMod !== newConMod) {
        const hpDelta = (newConMod - oldConMod) * (overview.level || 1);
        const newMax = Math.max(1, (overview.max_hp || 0) + hpDelta);
        // Adjust current HP proportionally
        const ratio = overview.max_hp > 0 ? overview.current_hp / overview.max_hp : 1;
        const newCurrent = Math.max(1, Math.min(newMax, Math.round(newMax * ratio)));
        const overviewUpdated = { ...overview, max_hp: newMax, current_hp: newCurrent };
        setOverview(overviewUpdated);
        triggerOverview(overviewUpdated);
        toast.success(`CON mod changed (${modStr(oldConMod)} -> ${modStr(newConMod)}): Max HP adjusted to ${newMax}`, { duration: 3000 });
      }
    }
  };

  const toggleSave = (ability) => {
    const updated = saves.map(s => s.ability === ability ? { ...s, proficient: !s.proficient } : s);
    setSaves(updated);
    triggerSaves(updated);
  };

  const toggleSkillProf = (skillName) => {
    const updated = skills.map(s => s.name === skillName ? { ...s, proficient: !s.proficient, expertise: !s.proficient ? s.expertise : false } : s);
    setSkills(updated);
    triggerSkills(updated);
  };

  const toggleSkillExpertise = (skillName) => {
    const updated = skills.map(s => s.name === skillName ? { ...s, expertise: !s.expertise, proficient: !s.expertise ? true : s.proficient } : s);
    setSkills(updated);
    triggerSkills(updated);
  };

  const abilityMap = useMemo(() => {
    const map = {};
    abilities.forEach(a => { map[a.ability] = a.score; });
    return map;
  }, [abilities]);
  const saveMap = useMemo(() => {
    const map = {};
    saves.forEach(s => { map[s.ability] = s.proficient; });
    return map;
  }, [saves]);

  const condEffects = useMemo(() => computeConditionEffects(activeConditions, overview?.exhaustion_level || 0), [activeConditions, overview?.exhaustion_level]);
  const effectiveMaxHP = condEffects.hpMaxHalved ? Math.floor((overview?.max_hp || 0) / 2) : (overview?.max_hp || 0);

  const { multiclassData, totalLevel } = useMemo(() => {
    let mc = [];
    try { mc = JSON.parse(overview?.multiclass_data || '[]'); } catch { mc = []; }
    if (!Array.isArray(mc)) mc = [];
    return { multiclassData: mc, totalLevel: getTotalLevel(overview?.level, mc) };
  }, [overview?.multiclass_data, overview?.level]);

  const profBonus = PROFICIENCY_BONUS[totalLevel] || 2;

  // Proficiency count: saves + skills with proficiency
  const proficiencyCount = useMemo(() => {
    const saveProfs = saves.filter(s => s.proficient).length;
    const skillProfs = skills.filter(s => s.proficient || s.expertise).length;
    return saveProfs + skillProfs;
  }, [saves, skills]);

  // HP status text & color
  const hpStatus = useMemo(() => {
    if (!overview) return { text: '', color: '', bgColor: '' };
    const pct = overview.max_hp > 0 ? (overview.current_hp / overview.max_hp) * 100 : 0;
    if (overview.current_hp <= 0) return { text: 'Down', color: '#ef4444', bgColor: 'rgba(239,68,68,0.15)' };
    if (pct < 25) return { text: 'Critical', color: '#f97316', bgColor: 'rgba(249,115,22,0.12)' };
    if (pct < 50) return { text: 'Bloodied', color: '#eab308', bgColor: 'rgba(234,179,8,0.1)' };
    return { text: 'Healthy', color: '#4ade80', bgColor: 'rgba(74,222,128,0.08)' };
  }, [overview?.current_hp, overview?.max_hp]);

  const { dexMod, passivePerc, passiveInvestigation, passiveInsight, initiative, encumbranceState } = useMemo(() => {
    const dex = calcMod(abilityMap.DEX || 10);
    const wis = calcMod(abilityMap.WIS || 10);
    const intMod = calcMod(abilityMap.INT || 10);
    const strScore = abilityMap.STR || 10;
    const percSkill = skills.find(s => s.name === 'Perception');
    const perc = wis + (percSkill?.expertise ? profBonus * 2 : percSkill?.proficient ? profBonus : 0);
    const investSkill = skills.find(s => s.name === 'Investigation');
    const invest = intMod + (investSkill?.expertise ? profBonus * 2 : investSkill?.proficient ? profBonus : 0);
    const insightSkill = skills.find(s => s.name === 'Insight');
    const insight = wis + (insightSkill?.expertise ? profBonus * 2 : insightSkill?.proficient ? profBonus : 0);
    // Encumbrance: check carry_weight from overview
    const carryWeight = overview?.carry_weight || 0;
    const heavyThreshold = strScore * 10;
    const encThreshold = strScore * 5;
    let encState = 'normal';
    if (carryWeight > heavyThreshold) encState = 'heavy';
    else if (carryWeight > encThreshold) encState = 'encumbered';
    return {
      dexMod: dex,
      passivePerc: 10 + perc,
      passiveInvestigation: 10 + invest,
      passiveInsight: 10 + insight,
      initiative: dex,
      encumbranceState: encState,
    };
  }, [abilityMap, skills, profBonus, overview?.carry_weight]);

  // Spell Save DC: 8 + proficiency bonus + spellcasting ability modifier
  const spellSaveDC = useMemo(() => {
    if (!overview?.primary_class) return null;
    const classData = CLASSES.find(c => c.name === overview.primary_class);
    if (!classData?.spellcasting) return null;
    const spellAbility = classData.spellcasting.ability;
    const abilityMod = calcMod(abilityMap[spellAbility] || 10);
    return { dc: 8 + profBonus + abilityMod, ability: spellAbility };
  }, [overview?.primary_class, CLASSES, abilityMap, profBonus]);

  // Spell Attack Bonus: proficiency + spellcasting ability mod
  const spellAttackBonus = useMemo(() => {
    if (!spellSaveDC) return null;
    const abilityMod = calcMod(abilityMap[spellSaveDC.ability] || 10);
    return { bonus: profBonus + abilityMod, ability: spellSaveDC.ability };
  }, [spellSaveDC, abilityMap, profBonus]);

  // Carrying Capacity: STR x 15
  const carryingCapacity = useMemo(() => {
    const str = abilityMap.STR || 10;
    return { capacity: str * 15, heavy: str * 10, encumbered: str * 5 };
  }, [abilityMap.STR]);

  // ── Collapsed section summaries ──
  const abilitySummary = useMemo(() => {
    return ABILITIES.map(ab => {
      const score = (abilityMap[ab] || 10) + (itemStatBonuses[ab] || 0);
      return `${ab} ${modStr(calcMod(score))}`;
    }).join(' \u00B7 ');
  }, [abilityMap, itemStatBonuses]);

  const saveSummary = useMemo(() => {
    const profs = saves.filter(s => s.proficient).length;
    return `${profs} proficiencie${profs !== 1 ? 's' : ''}${itemSaveBonus > 0 ? ` \u00B7 +${itemSaveBonus} from items` : ''}`;
  }, [saves, itemSaveBonus]);

  const skillSummary = useMemo(() => {
    const profs = skills.filter(s => s.proficient).length;
    const experts = skills.filter(s => s.expertise).length;
    return `${profs} proficient${experts > 0 ? ` \u00B7 ${experts} expertise` : ''}`;
  }, [skills]);

  const passiveSummary = `Perc ${passivePerc} \u00B7 Invest ${passiveInvestigation} \u00B7 Insight ${passiveInsight}`;

  const hpSummary = useMemo(() => {
    if (!overview) return '';
    const parts = [`${overview.current_hp}/${effectiveMaxHP} HP`];
    if (overview.temp_hp > 0) parts.push(`${overview.temp_hp} Temp`);
    return parts.join(' \u00B7 ');
  }, [overview?.current_hp, effectiveMaxHP, overview?.temp_hp]);

  const hitDiceSummary = useMemo(() => {
    if (!overview?.hit_dice_total) return 'No hit dice set';
    return `${overview.hit_dice_total} (${overview.hit_dice_used || 0} used)`;
  }, [overview?.hit_dice_total, overview?.hit_dice_used]);

  const inspirationExhaustionSummary = useMemo(() => {
    const parts = [];
    parts.push(overview?.inspiration ? 'Inspired' : 'Not inspired');
    parts.push(overview?.exhaustion_level > 0 ? `Exhaustion ${overview.exhaustion_level}` : 'No exhaustion');
    return parts.join(' \u00B7 ');
  }, [overview?.inspiration, overview?.exhaustion_level]);

  const damageModSummary = useMemo(() => {
    const r = parsedDamageModifiers.resistances.length;
    const i = parsedDamageModifiers.immunities.length;
    const v = parsedDamageModifiers.vulnerabilities.length;
    if (r + i + v === 0) return 'None';
    const parts = [];
    if (r > 0) parts.push(`${r} resistance${r > 1 ? 's' : ''}`);
    if (i > 0) parts.push(`${i} immunit${i > 1 ? 'ies' : 'y'}`);
    if (v > 0) parts.push(`${v} vulnerabilit${v > 1 ? 'ies' : 'y'}`);
    return parts.join(' \u00B7 ');
  }, [parsedDamageModifiers]);

  // ── Flash detection: track saving throw & skill modifier changes ──
  useEffect(() => {
    if (!saves.length || !abilities.length) return;
    const currentSaveMods = {};
    ABILITIES.forEach(ab => {
      const score = abilityMap[ab] || 10;
      const itemBonus = itemStatBonuses[ab] || 0;
      const prof = saveMap[ab] || false;
      currentSaveMods[ab] = calcMod(score + itemBonus) + (prof ? profBonus : 0) + itemSaveBonus;
    });
    const prev = prevSaveModsRef.current;
    if (Object.keys(prev).length > 0) {
      const changed = {};
      for (const ab of ABILITIES) {
        if (prev[ab] !== undefined && prev[ab] !== currentSaveMods[ab]) changed[ab] = true;
      }
      if (Object.keys(changed).length > 0) {
        setFlashedSaves(changed);
        setTimeout(() => setFlashedSaves({}), 1200);
      }
    }
    prevSaveModsRef.current = currentSaveMods;
  }, [abilityMap, saveMap, profBonus, itemSaveBonus, itemStatBonuses]);

  useEffect(() => {
    if (!skills.length || !abilities.length) return;
    const currentSkillMods = {};
    for (const sk of skills) {
      const ability = Object.entries(SKILLS).find(([name]) => name === sk.name)?.[1] || 'STR';
      const score = abilityMap[ability] || 10;
      const skillItemBonus = itemStatBonuses[ability] || 0;
      currentSkillMods[sk.name] = calcMod(score + skillItemBonus) + (sk.expertise ? profBonus * 2 : sk.proficient ? profBonus : 0);
    }
    const prev = prevSkillModsRef.current;
    if (Object.keys(prev).length > 0) {
      const changed = {};
      for (const name of Object.keys(currentSkillMods)) {
        if (prev[name] !== undefined && prev[name] !== currentSkillMods[name]) changed[name] = true;
      }
      if (Object.keys(changed).length > 0) {
        setFlashedSkills(changed);
        setTimeout(() => setFlashedSkills({}), 1200);
      }
    }
    prevSkillModsRef.current = currentSkillMods;
  }, [abilityMap, skills, profBonus, itemStatBonuses, SKILLS]);

  // Death save outcome toasts
  useEffect(() => {
    if (!overview) return;
    if (overview.death_save_successes >= 3) {
      toast.success('Stabilized! Your character is unconscious but stable.', { duration: 5000, style: { background: '#1a2e1a', color: '#86efac', border: '1px solid rgba(52,211,153,0.4)', fontFamily: 'monospace' } });
    }
    if (overview.death_save_failures >= 3) {
      toast.error('Your character has fallen...', { duration: 6000, icon: '💀', style: { background: '#2e1a1a', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.4)', fontFamily: 'monospace' } });
    }
  }, [overview?.death_save_successes, overview?.death_save_failures]);

  // Concentration save helper: detect HP decrease from manual edits (smart damage has its own handler)
  useEffect(() => {
    if (overview && prevHpRef.current !== null && overview.current_hp < prevHpRef.current) {
      if (smartDamageAppliedRef.current) {
        // Smart damage already showed concentration toast — skip
        smartDamageAppliedRef.current = false;
      } else if (concentrationSpell) {
        const damageTaken = prevHpRef.current - overview.current_hp;
        const dc = Math.max(10, Math.floor(damageTaken / 2));
        toast('Concentration check! DC = ' + dc + ' (damage: ' + damageTaken + ')', {
          icon: '🎯',
          duration: 5000,
          style: { background: '#1a1025', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.3)' },
        });
      }
    } else {
      smartDamageAppliedRef.current = false;
    }
    if (overview) {
      prevHpRef.current = overview.current_hp;
    }
  }, [overview?.current_hp, concentrationSpell]);

  const sortedSkillEntries = useMemo(() => Object.entries(SKILLS).sort(([a], [b]) => a.localeCompare(b)), [SKILLS]);

  // ── Auto-Calculate AC from equipped items ──
  const autoCalculateAC = useCallback(async () => {
    try {
      const allItems = await getItems(characterId);
      const equipped = allItems.filter(i => i.equipped);
      const dex = calcMod(abilityMap.DEX || 10);
      let baseAC = 10 + dex; // unarmored default
      let shieldBonus = 0;
      let armorFound = false;
      const breakdown = [{ label: 'Unarmored base', value: 10 }];

      for (const item of equipped) {
        const armorInfo = ARMOR_AC_TABLE[item.name];
        if (armorInfo) {
          if (armorInfo.bonus) {
            // Shield
            shieldBonus = armorInfo.bonus + (item.magic_bonus || 0);
          } else {
            armorFound = true;
            const mb = item.magic_bonus || 0;
            if (armorInfo.type === 'light') {
              baseAC = armorInfo.base + dex + mb;
              breakdown.length = 0;
              breakdown.push({ label: `${item.name}`, value: armorInfo.base });
              breakdown.push({ label: 'DEX modifier', value: dex });
              if (mb > 0) breakdown.push({ label: 'Magic bonus', value: mb });
            } else if (armorInfo.type === 'medium') {
              const cappedDex = Math.min(dex, armorInfo.maxDex || 2);
              baseAC = armorInfo.base + cappedDex + mb;
              breakdown.length = 0;
              breakdown.push({ label: `${item.name}`, value: armorInfo.base });
              breakdown.push({ label: `DEX modifier (max ${armorInfo.maxDex || 2})`, value: cappedDex });
              if (mb > 0) breakdown.push({ label: 'Magic bonus', value: mb });
            } else if (armorInfo.type === 'heavy') {
              baseAC = armorInfo.base + mb;
              breakdown.length = 0;
              breakdown.push({ label: `${item.name}`, value: armorInfo.base });
              if (mb > 0) breakdown.push({ label: 'Magic bonus', value: mb });
            }
          }
        }
      }

      if (!armorFound) {
        breakdown.push({ label: 'DEX modifier', value: dex });
      }
      if (shieldBonus > 0) {
        breakdown.push({ label: 'Shield', value: shieldBonus });
      }

      const total = baseAC + shieldBonus;
      setAcCalcResult({ total, breakdown, hasArmor: armorFound, hasShield: shieldBonus > 0 });
      toast.success(`Calculated AC: ${total}`, { duration: 3000 });
    } catch (err) {
      toast.error(`Failed to calculate AC: ${err.message}`);
    }
  }, [characterId, abilityMap]);

  // ── Recalculate all skill bonuses ──
  const recalculateAllSkills = useCallback(() => {
    let changed = 0;
    const updatedSkills = skills.map(sk => {
      const ability = Object.entries(SKILLS).find(([name]) => name === sk.name)?.[1] || 'STR';
      const score = abilityMap[ability] || 10;
      const skillItemBonus = itemStatBonuses[ability] || 0;
      const expectedBonus = calcMod(score + skillItemBonus) + (sk.expertise ? profBonus * 2 : sk.proficient ? profBonus : 0);
      if (sk.bonus !== undefined && sk.bonus !== expectedBonus) changed++;
      return { ...sk, bonus: expectedBonus };
    });
    setSkills(updatedSkills);
    triggerSkills(updatedSkills);
    toast.success(`Skill bonuses recalculated (${changed} updated)`, { duration: 3000 });
  }, [skills, abilityMap, itemStatBonuses, profBonus, SKILLS]);


  if (loading || !overview) {
    return <div className="text-amber-200/40">Loading character sheet...</div>;
  }

  const hpPercent = effectiveMaxHP > 0 ? (Math.min(overview.current_hp, effectiveMaxHP) / effectiveMaxHP) * 100 : 0;

  // SectionToggle is now defined outside the component to prevent focus loss on re-render

  return (
    <div className="space-y-6 max-w-none">
      {/* Dice Roll Center Popup */}
      {diceResult && (
        <div
          onClick={() => { setDiceResult(null); if (diceResultTimerRef.current) clearTimeout(diceResultTimerRef.current); }}
          style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', animation: 'dice-fade-in 0.15s ease-out' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              padding: '24px 36px', borderRadius: '16px', textAlign: 'center', minWidth: '260px',
              background: diceResult.autoFail ? 'linear-gradient(135deg, #2e1a1a, #1a0a0a)' : diceResult.nat20 ? 'linear-gradient(135deg, #1a2e1a, #0a1a0a)' : diceResult.nat1 ? 'linear-gradient(135deg, #2e1a1a, #1a0a0a)' : 'linear-gradient(135deg, #1a1520, #0c0a14)',
              border: `1px solid ${diceResult.autoFail ? 'rgba(239,68,68,0.4)' : diceResult.nat20 ? 'rgba(74,222,128,0.4)' : diceResult.nat1 ? 'rgba(239,68,68,0.4)' : 'rgba(201,168,76,0.3)'}`,
              boxShadow: diceResult.autoFail ? '0 0 40px rgba(239,68,68,0.2)' : diceResult.nat20 ? '0 0 40px rgba(74,222,128,0.2)' : diceResult.nat1 ? '0 0 40px rgba(239,68,68,0.2)' : '0 0 40px rgba(201,168,76,0.1)',
              animation: 'dice-scale-in 0.2s ease-out',
            }}
          >
            <div style={{ fontSize: '12px', color: 'rgba(201,168,76,0.7)', fontFamily: 'var(--font-display)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              {diceResult.label}
            </div>
            <div style={{ fontSize: '48px', fontWeight: 800, fontFamily: 'var(--font-display)', color: diceResult.autoFail ? '#ef4444' : diceResult.nat20 ? '#4ade80' : diceResult.nat1 ? '#ef4444' : '#fde68a', lineHeight: 1 }}>
              {diceResult.autoFail ? 'FAIL' : diceResult.total}
            </div>
            {!diceResult.autoFail && (
              <div style={{ fontSize: '14px', color: 'rgba(253,230,138,0.6)', fontFamily: 'monospace', marginTop: '8px' }}>
                {diceResult.d20} + ({modStr(diceResult.mod)})
              </div>
            )}
            {(diceResult.nat20 || diceResult.nat1) && (
              <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-display)', marginTop: '6px', color: diceResult.nat20 ? '#4ade80' : '#ef4444' }}>
                {diceResult.nat20 ? 'NAT 20!' : 'NAT 1!'}
              </div>
            )}
            {diceResult.mode && (
              <div style={{ fontSize: '11px', color: 'rgba(253,230,138,0.4)', marginTop: '4px' }}>
                [{diceResult.mode}]
              </div>
            )}
          </div>
        </div>
      )}

      {/* Flash animation + dice popup keyframes */}
      <style>{`
        @keyframes value-flash {
          0% { background-color: rgba(201,168,76,0.3); }
          100% { background-color: transparent; }
        }
        @keyframes dice-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes dice-scale-in {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-display text-amber-100">Character Sheet</h2>
            <button onClick={collapseAll} className="text-[10px] text-amber-200/30 hover:text-amber-200/60 transition-colors px-1.5 py-0.5 rounded hover:bg-white/[0.03]" title="Collapse all sections">Collapse All</button>
            <button onClick={expandAll} className="text-[10px] text-amber-200/30 hover:text-amber-200/60 transition-colors px-1.5 py-0.5 rounded hover:bg-white/[0.03]" title="Expand all sections">Expand All</button>
          </div>
          <p className="text-xs text-amber-200/40 mt-1">Your character's core stats, abilities, and vitals. This is the hub for everything that defines who your character is mechanically.</p>
        </div>
        <div className="flex items-center gap-3">
          <SaveIndicator saving={savingOverview} lastSaved={overviewSaved} />
          <button
            onClick={() => setShowShortRest(true)}
            className="btn-secondary text-xs flex items-center gap-1"
            title="Rest for 1 hour. Spend hit dice to recover HP. Restores some class features."
          >
            <Coffee size={12} /> Short Rest
          </button>
          <button
            onClick={handleLongRest}
            className="btn-secondary text-xs flex items-center gap-1"
            title="Rest for 8 hours. Restores HP, spell slots, and most resources. Reduces exhaustion by 1."
          >
            <Moon size={12} /> Long Rest
          </button>
          <button
            onClick={() => setShowLevelConfirm('down')}
            className="btn-secondary text-xs flex items-center gap-1"
            disabled={overview.level <= 1}
            title="Reduce level by 1"
          >
            <TrendingDown size={12} /> Level Down
          </button>
          <button
            onClick={() => setShowLevelConfirm('up')}
            className="btn-secondary text-xs flex items-center gap-1"
            disabled={overview.level >= 20}
            title="Increase level by 1"
          >
            <TrendingUp size={12} /> Level Up!
          </button>
        </div>
      </div>

      {/* Level change confirmation */}
      {showLevelConfirm && (() => {
        const isUp = showLevelConfirm === 'up';
        const newLevel = isUp ? overview.level + 1 : overview.level - 1;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={e => e.target === e.currentTarget && setShowLevelConfirm(null)}>
            <div className="bg-[#14121c] border rounded-lg p-6 max-w-sm w-full mx-4 shadow-2xl" style={{ borderColor: isUp ? 'rgba(201,168,76,0.3)' : 'rgba(251,191,36,0.2)' }}>
              <h3 className="font-display text-lg text-amber-100 mb-2">
                {isUp ? 'Level Up?' : 'Level Down?'}
              </h3>
              <p className="text-sm text-amber-200/60 mb-1">
                {isUp
                  ? `Advance ${overview.name || 'your character'} from level ${overview.level} to level ${newLevel}?`
                  : `Reduce ${overview.name || 'your character'} from level ${overview.level} to level ${newLevel}?`}
              </p>
              {!isUp && (
                <p className="text-xs text-amber-200/40 mb-4">This won't automatically remove features or change stats gained at the current level.</p>
              )}
              {isUp && (
                <p className="text-xs text-amber-200/40 mb-4">You'll gain your proficiency bonus, class features, and any ASI for level {newLevel}.</p>
              )}
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowLevelConfirm(null)} className="btn-secondary text-sm">Cancel</button>
                <button
                  onClick={() => {
                    updateField('level', newLevel);
                    setShowLevelConfirm(null);
                    toast.success(isUp ? `Leveled up to ${newLevel}!` : `Reduced to level ${newLevel}`);
                  }}
                  className="text-sm px-4 py-2 rounded font-medium transition-colors"
                  style={{
                    background: isUp ? 'rgba(201,168,76,0.2)' : 'rgba(251,191,36,0.1)',
                    color: isUp ? '#c9a84c' : '#fbbf24',
                    border: `1px solid ${isUp ? 'rgba(201,168,76,0.4)' : 'rgba(251,191,36,0.2)'}`,
                  }}
                >
                  {isUp ? 'Level Up!' : 'Level Down'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Condition Effects Banner */}
      {activeConditions.length > 0 && (
        <div className="bg-red-950/50 border-2 border-red-500/30 rounded-lg p-4 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-display text-red-300 font-semibold">Active Conditions</span>
            <div className="flex gap-1.5 ml-2">
              {activeConditions.map(name => (
                <RuleTooltip key={name} term={name}>
                  <span className="text-xs bg-red-900/50 text-red-200 px-2 py-0.5 rounded border border-red-500/30">
                    {name}
                  </span>
                </RuleTooltip>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
            {condEffects.speedOverride === 0 && (
              <div className="text-xs text-red-300/90 flex items-center gap-1.5">
                <span className="text-red-500">&#x2716;</span> Speed reduced to 0
              </div>
            )}
            {condEffects.cantAct && (
              <div className="text-xs text-red-300/90 flex items-center gap-1.5">
                <span className="text-red-500">&#x2716;</span> Cannot take actions or reactions
              </div>
            )}
            {condEffects.netAttackMode === 'disadvantage' && (
              <div className="text-xs text-red-300/90 flex items-center gap-1.5">
                <span className="text-red-500">&#x25BC;</span> Disadvantage on attack rolls
              </div>
            )}
            {condEffects.netAttackMode === 'advantage' && (
              <div className="text-xs text-emerald-300/90 flex items-center gap-1.5">
                <span className="text-emerald-500">&#x25B2;</span> Advantage on attack rolls
              </div>
            )}
            {condEffects.checkDisadvantage && (
              <div className="text-xs text-red-300/90 flex items-center gap-1.5">
                <span className="text-red-500">&#x25BC;</span> Disadvantage on ability checks
              </div>
            )}
            {condEffects.autoFailSaves.size > 0 && (
              <div className="text-xs text-red-300/90 flex items-center gap-1.5">
                <span className="text-red-500">&#x2716;</span> Auto-fail {[...condEffects.autoFailSaves].join(' & ')} saves
              </div>
            )}
            {condEffects.saveDisadvantage.size > 0 && (
              <div className="text-xs text-red-300/90 flex items-center gap-1.5">
                <span className="text-red-500">&#x25BC;</span> Disadvantage on {[...condEffects.saveDisadvantage].join(' & ')} saves
              </div>
            )}
            {condEffects.attacksAgainstAdvantage && (
              <div className="text-xs text-orange-300/90 flex items-center gap-1.5">
                <span className="text-orange-500">&#x26A0;</span> Enemies have advantage against you
              </div>
            )}
            {condEffects.autoCritMelee && (
              <div className="text-xs text-orange-300/90 flex items-center gap-1.5">
                <span className="text-orange-500">&#x26A0;</span> Melee hits auto-crit against you
              </div>
            )}
            {condEffects.speedHalved && condEffects.speedOverride !== 0 && (
              <div className="text-xs text-orange-300/90 flex items-center gap-1.5">
                <span className="text-orange-500">&#x25BC;</span> Speed halved (Exhaustion)
              </div>
            )}
            {condEffects.saveDisadvantageAll && (
              <div className="text-xs text-red-300/90 flex items-center gap-1.5">
                <span className="text-red-500">&#x25BC;</span> Disadvantage on all saving throws (Exhaustion)
              </div>
            )}
            {condEffects.hpMaxHalved && (
              <div className="text-xs text-red-300/90 flex items-center gap-1.5">
                <span className="text-red-500">&#x2716;</span> Hit point maximum halved (Exhaustion)
              </div>
            )}
            {condEffects.dead && (
              <div className="text-xs text-red-400 font-bold flex items-center gap-1.5">
                <Skull size={12} className="text-red-500" /> DEAD — Exhaustion level 6
              </div>
            )}
          </div>
        </div>
      )}

      {/* Identity */}
      <div className="card">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="label">Name</label>
            <div className="input w-full bg-[#0a0a10] cursor-not-allowed opacity-75">{overview.name || 'Unknown'}</div>
          </div>
          <div>
            <label className="label">{ancestryLabel}</label>
            <div className="input w-full bg-[#0a0a10] cursor-not-allowed opacity-75">{overview.race || 'Not set'}</div>
          </div>
          <div>
            <label className="label">Class</label>
            <div className="input w-full bg-[#0a0a10] cursor-not-allowed opacity-75">{overview.primary_class || 'Not set'}</div>
          </div>
          <div>
            <label className="label">Level</label>
            <input type="number" className="input w-full" min={1} max={20}
              value={overview.level} onChange={e => updateField('level', parseInt(e.target.value) || 1)} />
          </div>
          <div>
            <label className="label">Subclass</label>
            {overview.primary_subclass ? (
              <div className="input w-full bg-[#0a0a10] cursor-not-allowed opacity-75">{overview.primary_subclass}</div>
            ) : (
              (() => {
                const cls = CLASSES.find(c => c.name === overview.primary_class);
                const subs = cls?.subclasses || [];
                if (subs.length > 0) {
                  return (
                    <select className="input w-full" value={overview.primary_subclass} onChange={e => updateField('primary_subclass', e.target.value)}>
                      <option value="">Select...</option>
                      {subs.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  );
                }
                return <input className="input w-full" value={overview.primary_subclass || ''} onChange={e => updateField('primary_subclass', e.target.value)} />;
              })()
            )}
          </div>
          <div>
            <label className="label">Background</label>
            <input className="input w-full" value={overview.background} onChange={e => updateField('background', e.target.value)} />
          </div>
          <div>
            <label className="label">Alignment</label>
            <select className="input w-full" value={overview.alignment} onChange={e => updateField('alignment', e.target.value)}>
              <option value="">Select...</option>
              {['Lawful Good','Neutral Good','Chaotic Good','Lawful Neutral','True Neutral','Chaotic Neutral','Lawful Evil','Neutral Evil','Chaotic Evil'].map(a =>
                <option key={a} value={a}>{a}</option>
              )}
            </select>
          </div>
          <div>
            <label className="label">Campaign</label>
            <input className="input w-full" value={overview.campaign_name} onChange={e => updateField('campaign_name', e.target.value)} />
          </div>
        </div>

        {/* Auto-Populate Stats Button */}
        {overview.primary_class && overview.race && (
          <button
            onClick={handleAutoPopulate}
            className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded bg-gold/8 border border-gold/20 text-gold/70 hover:bg-gold/15 hover:text-gold transition-all mt-3"
            title="Auto-fill HP, saving throws, proficiencies, speed, and racial bonuses from your class and race"
          >
            <Sparkles size={12} /> Auto-Populate Stats from Class & Race
          </button>
        )}

        {/* XP Progress */}
        <XPProgress xp={overview.experience_points} level={overview.level} onXPChange={v => updateField('experience_points', v)} locked={dmSessionLocked} />

        {/* Multiclass Section */}
        {allowMulticlass && (() => {
          let mc = [];
          try { mc = JSON.parse(overview.multiclass_data || '[]'); } catch (err) { if (import.meta.env.DEV) console.warn('Failed to parse multiclass_data:', err); mc = []; }
          if (!Array.isArray(mc)) mc = [];

          const totalLevel = getTotalLevel(overview.level, mc);
          const hitDice = getHitDiceBreakdown(overview.primary_class, overview.level, mc);

          const updateMulticlass = (newMc) => {
            const updated = { ...overview, multiclass_data: JSON.stringify(newMc) };
            setOverview(updated);
            triggerOverview(updated);
          };

          const addMulticlass = () => {
            updateMulticlass([...mc, { class: '', subclass: '', level: 1 }]);
          };

          const removeMulticlass = (index) => {
            updateMulticlass(mc.filter((_, i) => i !== index));
          };

          const updateMulticlassEntry = (index, field, value) => {
            const newMc = mc.map((entry, i) => {
              if (i !== index) return entry;
              const updated = { ...entry, [field]: value };
              if (field === 'level') updated.level = Math.max(1, Math.min(20, parseInt(value) || 1));
              return updated;
            });
            updateMulticlass(newMc);
          };

          return (
            <div className="mt-4 pt-4 border-t border-gold/10">
              <button
                onClick={() => toggleCollapse('multiclass')}
                className="w-full flex items-center justify-between mb-2"
              >
                <div className="flex items-center gap-2">
                  {collapsedSections.has('multiclass') ? <ChevronRight size={12} className="text-amber-200/30" /> : <ChevronDown size={12} className="text-amber-200/30" />}
                  <div className="text-xs text-amber-200/50 font-display tracking-wider uppercase">Multiclass</div>
                </div>
                {mc.length > 0 && (
                  <div className="text-xs text-amber-200/40">
                    Total Level: {totalLevel} ({overview.primary_class || 'Primary'} {overview.level}
                    {mc.map((cls, i) => ` + ${cls.class || '?'} ${cls.level || '?'}`).join('')})
                  </div>
                )}
              </button>

              {!collapsedSections.has('multiclass') && (<>
              {mc.length > 0 && (
                <div className="space-y-2 mb-3">
                  {mc.map((cls, i) => (
                    <div key={i} className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-end bg-purple-900/10 border border-purple-500/15 rounded p-2">
                      <div>
                        <label className="label text-[10px]">Class</label>
                        <select className="input w-full text-sm" value={cls.class || ''} onChange={e => updateMulticlassEntry(i, 'class', e.target.value)}>
                          <option value="">Select...</option>
                          {CLASSES.map(c => (
                            <option key={c.name} value={c.name} disabled={c.name === overview.primary_class}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="label text-[10px]">Subclass</label>
                        {(() => {
                          const clsData = CLASSES.find(c => c.name === cls.class);
                          const subs = clsData?.subclasses || [];
                          if (subs.length > 0) {
                            return (
                              <select className="input w-full text-sm" value={cls.subclass || ''} onChange={e => updateMulticlassEntry(i, 'subclass', e.target.value)}>
                                <option value="">Select...</option>
                                {subs.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            );
                          }
                          return <input className="input w-full text-sm" value={cls.subclass || ''} onChange={e => updateMulticlassEntry(i, 'subclass', e.target.value)} placeholder="Subclass" />;
                        })()}
                      </div>
                      <div>
                        <label className="label text-[10px]">Lv</label>
                        <input type="number" className="input w-16 text-sm text-center" min={1} max={20}
                          value={cls.level || 1} onChange={e => updateMulticlassEntry(i, 'level', e.target.value)} />
                      </div>
                      <button onClick={() => removeMulticlass(i)} className="btn-ghost p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded self-end mb-0.5" title="Remove class">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button onClick={addMulticlass} className="btn-ghost text-xs flex items-center gap-1 text-purple-300 hover:text-purple-200">
                <Plus size={12} /> Add Class
              </button>

              {mc.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gold/5">
                  <div className="text-[10px] text-amber-200/40 uppercase tracking-wider mb-1">Hit Dice Breakdown</div>
                  <div className="flex flex-wrap gap-2">
                    {hitDice.map((hd, i) => (
                      <span key={i} className="text-xs bg-purple-900/20 text-purple-200/80 px-2 py-1 rounded border border-purple-500/15">
                        {hd.count}{hd.die} ({hd.class || '?'})
                      </span>
                    ))}
                  </div>
                </div>
              )}
              </>)}
            </div>
          );
        })()}
      </div>

      {/* Overview Tab Bar */}
      <div className="flex flex-wrap gap-1.5">
        {[...OVERVIEW_TABS, ...(allowMulticlass && multiclassData.length > 0 ? [{ id: 'multiclass', label: 'Multiclass', icon: Sparkles }] : [])].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => switchOverviewTab(tab.id)}
              className={`text-xs px-3 py-1.5 rounded border transition-all cursor-pointer flex items-center gap-1.5 font-display tracking-wide ${
                overviewTab === tab.id
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'border-white/5 text-amber-200/40 hover:text-amber-200/60 hover:border-white/10'
              }`}
            >
              <Icon size={12} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* ═══ STATS TAB ═══ */}
      {overviewTab === 'stats' && (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left column: Ability Scores, Saving Throws, Skills */}
        <div className="space-y-6">
          {/* Dice roll hint banner */}
          {!diceHintDismissed && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-gold/[0.08] border border-gold/20 text-sm text-gold/80">
              <Dices size={16} className="flex-shrink-0 text-gold/60 animate-pulse" />
              <span className="flex-1 font-semibold">Click any modifier, saving throw, or skill to roll a d20 check!</span>
              <button
                onClick={() => { localStorage.setItem('codex-dice-hint-dismissed', '1'); setDiceHintDismissed(true); }}
                className="text-gold/30 hover:text-gold/60 transition-colors p-0.5"
                title="Dismiss"
              >
                <X size={12} />
              </button>
            </div>
          )}
          {/* Ability Scores */}
          <div className="card">
            <SectionToggle collapsedSections={collapsedSections} toggleCollapse={toggleCollapse} id="ability-scores" title="Ability Scores" summary={abilitySummary} helpTooltip={<HelpTooltip text={HELP.modifier} />}>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {ABILITIES.map(ab => {
                const score = abilityMap[ab] || 10;
                const itemBonus = itemStatBonuses[ab] || 0;
                // Use the live local value for real-time modifier updates while editing
                const liveScore = localAbilities[ab] != null ? (parseInt(localAbilities[ab]) || 10) : score;
                const effectiveScore = liveScore + itemBonus;
                const mod = calcMod(effectiveScore);
                return (
                  <div key={ab} className={`ab-card-hex stagger-item text-center p-4 rounded-lg bg-[#0a0a10] border ${itemBonus ? 'border-green-500/25' : 'border-gold/15'} hover:border-gold/30 transition-all group/ab cursor-pointer`} onClick={() => rollAbilityCheck(ab, mod)} title={`Click to roll ${ABILITY_ABBR_MAP[ab]} check${itemBonus ? ` (includes ${itemBonus > 0 ? '+' : ''}${itemBonus} from items)` : ''}`}>
                    <div className="text-[11px] text-amber-200/50 font-display tracking-widest mb-2">{ab}</div>
                    {/* Base score — big yellow number (editable) */}
                    <div className="relative">
                      <input
                        type="number" min={1} max={30}
                        className="text-3xl font-bold text-gold text-center w-16 mx-auto hover:text-amber-300 transition-all rounded-md hover:ring-1 hover:ring-gold/25 focus:ring-1 focus:ring-gold/40"
                        aria-label={`${ABILITY_ABBR_MAP[ab]} score`}
                        style={{ border: 'none', background: 'transparent', outline: 'none', boxShadow: 'none' }}
                        value={localAbilities[ab] ?? score}
                        onClick={e => e.stopPropagation()}
                        onChange={e => setLocalAbilities(prev => ({ ...prev, [ab]: e.target.value }))}
                        onBlur={e => {
                          const val = Math.max(1, Math.min(30, parseInt(e.target.value.trim()) || 10));
                          setLocalAbilities(prev => ({ ...prev, [ab]: val }));
                          updateAbility(ab, val);
                        }}
                      />
                      <Pencil size={10} className="absolute top-0 -left-1 text-gold/0 group-hover/ab:text-gold/40 transition-all duration-200" />
                      <Dices size={12} className="absolute top-0 -right-1 text-gold/0 group-hover/ab:text-gold/70 transition-all duration-200 group-hover/ab:animate-pulse" />
                    </div>
                    {/* Modifier below — color-coded */}
                    <div className={`text-lg font-semibold mt-1 ${mod >= 3 ? 'ab-mod-high' : mod >= 0 ? 'ab-mod-positive' : 'ab-mod-negative'}`}>
                      {modStr(mod)}
                    </div>
                    {itemBonus ? (
                      <div className="text-[10px] text-green-400/70 mt-1" title="Bonus from equipped items">
                        +{itemBonus} from gear
                      </div>
                    ) : (
                      <div className="text-[10px] text-amber-200/30 mt-1">{ABILITY_ABBR_MAP[ab]}</div>
                    )}
                  </div>
                );
              })}
            </div>
            </SectionToggle>
          </div>

          {/* Saving Throws */}
          <div className="card">
            <SectionToggle collapsedSections={collapsedSections} toggleCollapse={toggleCollapse} id="saving-throws" title="Saving Throws" summary={saveSummary} helpTooltip={<HelpTooltip text={HELP.savingThrows} />}
              rightContent={proficiencyCount > 0 && (
                <span className="text-[10px] font-display tracking-wide text-gold/60 bg-gold/8 border border-gold/15 px-2 py-0.5 rounded-full">
                  {proficiencyCount} proficienc{proficiencyCount === 1 ? 'y' : 'ies'} active
                </span>
              )}
            >
            <p className="text-xs text-amber-200/30 mb-3">
              Click to mark proficiency — adds +{profBonus} to the roll.
              {itemSaveBonus > 0 && <span className="text-green-400/70 ml-1">(+{itemSaveBonus} from items)</span>}
            </p>
            {(() => {
              const noSavesSet = saves.every(s => !s.proficient);
              const classData = CLASSES.find(c => c.name === overview.primary_class);
              if (!noSavesSet || !classData?.savingThrows) return null;
              return (
                <button
                  onClick={() => {
                    const updatedSaves = saves.map(s =>
                      classData.savingThrows.includes(s.ability) ? { ...s, proficient: true } : s
                    );
                    setSaves(updatedSaves);
                    triggerSaves(updatedSaves);
                    toast.success(`Saving throw proficiencies set for ${overview.primary_class}: ${classData.savingThrows.join(' & ')}`);
                  }}
                  className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded bg-gold/8 border border-gold/20 text-gold/70 hover:bg-gold/15 hover:text-gold transition-all mb-3"
                  title={`${overview.primary_class} saving throws: ${classData.savingThrows.join(' & ')}`}
                >
                  <Wand2 size={11} /> Auto-set from {overview.primary_class}? ({classData.savingThrows.join(' & ')})
                </button>
              );
            })()}
            <div className="space-y-0.5">
              {ABILITIES.map(ab => {
                const score = abilityMap[ab] || 10;
                const itemBonus = itemStatBonuses[ab] || 0;
                const effectiveScore = score + itemBonus;
                const prof = saveMap[ab] || false;
                const mod = calcMod(effectiveScore) + (prof ? profBonus : 0) + itemSaveBonus;
                const isAutoFail = condEffects.autoFailSaves.has(ab);
                const hasDis = condEffects.saveDisadvantage.has(ab) || condEffects.saveDisadvantageAll;
                return (
                  <div
                    key={ab}
                    onClick={() => toggleSave(ab)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSave(ab); } }}
                    tabIndex={0}
                    role="checkbox"
                    aria-checked={prof}
                    aria-label={`${ABILITY_ABBR_MAP[ab]} saving throw proficiency`}
                    className={`flex items-center gap-3 py-1.5 px-2 rounded-md cursor-pointer group hover:bg-white/[0.03] transition-colors select-none ${isAutoFail ? 'bg-red-950/30 border border-red-500/20 rounded' : ''}`}
                  >
                    {/* Proficiency indicator */}
                    <div className={`prof-circle${prof ? ' active' : ''}`} />
                    <span
                      className={`text-sm font-semibold w-8 text-right transition-colors cursor-pointer hover:scale-110 ${isAutoFail ? 'text-red-400 line-through' : prof ? 'text-gold hover:text-amber-300' : 'text-amber-200/35 hover:text-amber-200/60'}`}
                      style={flashedSaves[ab] ? { animation: 'value-flash 1.2s ease-out', borderRadius: '4px' } : undefined}
                      onClick={(e) => { e.stopPropagation(); rollSavingThrow(ab, mod, isAutoFail, hasDis); }}
                      title={`Click to roll ${ABILITY_ABBR_MAP[ab]} saving throw`}
                    >
                      {isAutoFail ? 'FAIL' : modStr(mod)}
                    </span>
                    <span className={`text-sm flex-1 transition-colors ${isAutoFail ? 'text-red-300' : prof ? 'text-amber-100' : 'text-amber-200/60'}`}>{ABILITY_ABBR_MAP[ab]}</span>
                    {isAutoFail && (
                      <span className="text-[10px] font-display tracking-wider text-red-400 bg-red-900/30 border border-red-500/20 px-1.5 py-0.5 rounded">AUTO-FAIL</span>
                    )}
                    {hasDis && !isAutoFail && (
                      <span className="text-[10px] font-display tracking-wider text-red-400 bg-red-900/30 border border-red-500/20 px-1.5 py-0.5 rounded">DIS</span>
                    )}
                    {prof && !isAutoFail && !hasDis && (
                      <span className="text-[10px] font-display tracking-wider text-gold bg-gold/15 border border-gold/20 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">PROF</span>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); rollSavingThrow(ab, mod, isAutoFail, hasDis); }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gold/10 text-gold/50 hover:text-gold"
                      title={`Roll ${ABILITY_ABBR_MAP[ab]} save`}
                    >
                      <Dices size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
            </SectionToggle>
          </div>

          {/* Skills */}
          <div className="card">
            <SectionToggle collapsedSections={collapsedSections} toggleCollapse={toggleCollapse} id="skills" title="Skills" summary={skillSummary}>
            {condEffects.checkDisadvantage && (
              <span className="text-xs text-red-400 font-normal ml-2 bg-red-900/30 px-2 py-0.5 rounded border border-red-500/20">Disadvantage on all checks</span>
            )}
            {/* Legend */}
            <div className="flex items-center gap-3.5 mb-3 text-[11px] text-amber-200/35">
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-full bg-gold border-2 border-gold shadow-[0_0_6px_rgba(201,168,76,0.35)]" />
                Proficient (+{profBonus})
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rotate-45 rounded-sm bg-purple-600 border-2 border-purple-400 shadow-[0_0_6px_rgba(124,77,189,0.4)]" />
                Expertise (+{profBonus * 2})
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-full border-2 border-amber-200/25 bg-amber-200/[0.04]" />
                None
              </span>
              <button
                onClick={recalculateAllSkills}
                className="ml-auto inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded bg-gold/8 border border-gold/20 text-gold/60 hover:bg-gold/15 hover:text-gold transition-all"
                title="Recalculate all skill bonuses from current ability scores and proficiencies"
              >
                <Calculator size={10} /> Recalculate All
              </button>
            </div>
            <div className="space-y-0 max-h-[380px] overflow-y-auto pr-1 skill-list">
              {sortedSkillEntries.map(([skillName, ability]) => {
                const sk = skills.find(s => s.name === skillName);
                const score = abilityMap[ability] || 10;
                const skillItemBonus = itemStatBonuses[ability] || 0;
                const abilityMod = calcMod(score + skillItemBonus);
                const profComponent = sk?.expertise ? profBonus * 2 : sk?.proficient ? profBonus : 0;
                const mod = abilityMod + profComponent;
                const state = sk?.expertise ? 'expertise' : sk?.proficient ? 'proficient' : 'none';
                // Build modifier breakdown tooltip
                const breakdownParts = [`${ability} ${modStr(calcMod(score))}`];
                if (skillItemBonus !== 0) breakdownParts.push(`${modStr(skillItemBonus)} item bonus`);
                if (sk?.expertise) breakdownParts.push(`+${profBonus * 2} expertise`);
                else if (sk?.proficient) breakdownParts.push(`+${profBonus} proficiency`);
                const breakdownTooltip = `${breakdownParts.join(', ')} = ${modStr(mod)}`;
                const isStealth = skillName === 'Stealth';
                const showStealthDis = isStealth && stealthDisadvantage;
                return (
                  <div key={skillName} className="flex items-center gap-2 py-[5px] px-1.5 rounded group hover:bg-white/[0.025] transition-colors select-none">
                    {/* Proficiency circle */}
                    <button
                      onClick={() => toggleSkillProf(skillName)}
                      className={`prof-circle${sk?.proficient ? ' active' : ''}`}
                      style={{ width: '16px', height: '16px' }}
                      title={sk?.proficient ? 'Proficient — click to remove' : 'Click to add proficiency'}
                    />
                    {/* Expertise diamond */}
                    <button
                      onClick={() => toggleSkillExpertise(skillName)}
                      className={`expertise-diamond${sk?.expertise ? ' active' : ''}`}
                      title={sk?.expertise ? 'Expertise — click to remove' : 'Click to add expertise (auto-grants proficiency)'}
                    />
                    <span
                      className={`text-[13px] font-semibold w-[30px] text-right flex-shrink-0 transition-colors cursor-pointer hover:scale-110 ${
                        state === 'expertise' ? 'text-purple-300 hover:text-purple-200' : state === 'proficient' ? 'text-gold hover:text-amber-300' : 'text-amber-200/35 hover:text-amber-200/60'
                      }`}
                      style={flashedSkills[skillName] ? { animation: 'value-flash 1.2s ease-out', borderRadius: '4px' } : undefined}
                      onClick={(e) => { e.stopPropagation(); rollSkillCheck(skillName, ability, mod); }}
                      title={breakdownTooltip}
                    >{modStr(mod)}</span>
                    <span
                      className={`text-[13px] flex-1 transition-colors cursor-pointer ${
                        state === 'expertise' ? 'text-purple-100 hover:text-purple-50' : state === 'proficient' ? 'text-amber-100 hover:text-amber-50' : 'text-amber-200/60 hover:text-amber-200/80'
                      }`}
                      onClick={(e) => { e.stopPropagation(); rollSkillCheck(skillName, ability, mod); }}
                      title={breakdownTooltip}
                    >{skillName}</span>
                    {showStealthDis && (
                      <span className="text-[9px] font-bold text-red-400 bg-red-900/30 px-1.5 py-0.5 rounded border border-red-500/20 flex-shrink-0" title="Disadvantage from equipped armor">DIS</span>
                    )}
                    <span className="text-[10px] font-display tracking-wider text-amber-200/[0.18] w-[26px] text-right">{ability}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); rollSkillCheck(skillName, ability, mod); }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-gold/10 text-gold/40 hover:text-gold flex-shrink-0"
                      title={`Roll ${skillName}`}
                    >
                      <Dices size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
            </SectionToggle>
          </div>

          {/* Passive Skills */}
          <div className="card">
            <SectionToggle collapsedSections={collapsedSections} toggleCollapse={toggleCollapse} id="passive-skills" title="Passive Skills" summary={passiveSummary}>
            <div className="space-y-2">
              <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-[#0a0a10] border border-amber-200/8">
                <Eye size={16} className="text-amber-200/50 flex-shrink-0" />
                <span className="text-sm text-amber-200/60 flex-1">Passive Perception</span>
                <span className="text-lg font-display text-amber-100 font-bold">{passivePerc}</span>
              </div>
              <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-[#0a0a10] border border-amber-200/8">
                <Search size={16} className="text-amber-200/50 flex-shrink-0" />
                <span className="text-sm text-amber-200/60 flex-1">Passive Investigation</span>
                <span className="text-lg font-display text-amber-100 font-bold">{passiveInvestigation}</span>
              </div>
              <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-[#0a0a10] border border-amber-200/8">
                <Brain size={16} className="text-amber-200/50 flex-shrink-0" />
                <span className="text-sm text-amber-200/60 flex-1">Passive Insight</span>
                <span className="text-lg font-display text-amber-100 font-bold">{passiveInsight}</span>
              </div>
            </div>
            </SectionToggle>
          </div>
        </div>

      </div>
      )}

      {/* ═══ COMBAT TAB ═══ */}
      {overviewTab === 'combat' && (
      <div className="space-y-6">
          {/* Proficiency + Core Stats */}
          <div className={`grid grid-cols-2 ${spellAttackBonus ? 'md:grid-cols-7' : spellSaveDC ? 'md:grid-cols-6' : 'md:grid-cols-5'} gap-4`}>
            <div className="card text-center border-gold/25 shadow-[0_0_12px_rgba(201,168,76,0.06)]" title={`Proficiency bonus: +${profBonus} (levels ${profBonus === 2 ? '1-4' : profBonus === 3 ? '5-8' : profBonus === 4 ? '9-12' : profBonus === 5 ? '13-16' : '17-20'})`}>
              <div className="text-xs text-gold/70 mb-1 font-semibold">Proficiency<HelpTooltip text={HELP.proficiencyBonus} /></div>
              <div className="text-3xl font-display text-gold font-bold">{modStr(profBonus)}</div>
              <div className="text-[10px] text-gold/40 mt-0.5">Level {totalLevel}</div>
            </div>
            <div className="card text-center group relative" title={`AC Breakdown: Base 10 + DEX mod (${modStr(dexMod)}) = ${10 + dexMod}. Current AC: ${overview.armor_class}${overview.armor_class !== 10 + dexMod ? ' (armor/shield/magic may apply)' : ''}`}>
              <div className="text-xs text-amber-200/50 mb-1 flex items-center justify-center gap-1"><Shield size={12} /> AC<HelpTooltip text={HELP.ac} /></div>
              <input type="number" min={0} max={30} className="input text-center text-2xl font-display w-20 mx-auto" value={overview.armor_class} onChange={e => updateField('armor_class', parseInt(e.target.value) || 0)} />
              {/* Auto-calculate AC button */}
              <button
                onClick={(e) => { e.stopPropagation(); autoCalculateAC(); }}
                className="text-[9px] text-amber-200/40 hover:text-gold transition-colors mt-1 flex items-center gap-0.5 mx-auto"
                title="Auto-calculate AC from equipped armor, shield, and DEX"
              >
                <Calculator size={9} /> Auto
              </button>
              {/* AC Breakdown Tooltip on hover */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 p-3 rounded-lg bg-[#0c0a14] border border-gold/20 shadow-xl z-30 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
                <div className="text-[10px] font-display text-gold/70 tracking-wider uppercase mb-1.5">AC Breakdown</div>
                <div className="space-y-1 text-[11px] text-amber-200/60">
                  {acCalcResult ? (
                    <>
                      {acCalcResult.breakdown.map((item, i) => (
                        <div key={i} className="flex justify-between"><span>{item.label}</span><span className="text-amber-100">{item.value >= 0 ? '+' : ''}{item.value}</span></div>
                      ))}
                      <div className="border-t border-amber-200/10 my-1" />
                      <div className="flex justify-between"><span>Calculated AC</span><span className="text-gold font-bold">{acCalcResult.total}</span></div>
                      {acCalcResult.total !== overview.armor_class && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateField('armor_class', acCalcResult.total);
                            toast.success(`AC updated to ${acCalcResult.total}`);
                          }}
                          className="w-full mt-1.5 text-[10px] px-2 py-1 rounded bg-gold/15 text-gold border border-gold/30 hover:bg-gold/25 transition-all"
                        >
                          Apply AC {acCalcResult.total}
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between"><span>Unarmored base</span><span className="text-amber-100">10</span></div>
                      <div className="flex justify-between"><span>DEX modifier</span><span className="text-amber-100">{modStr(dexMod)}</span></div>
                      {(() => {
                        const armorMagicTotal = itemMagicBonuses.filter(i => i.item_type === 'armor').reduce((s, i) => s + i.magic_bonus, 0);
                        return armorMagicTotal > 0 && (
                          <div className="flex justify-between"><span className="text-purple-400/70">Magic armor/shield</span><span className="text-purple-400/70">+{armorMagicTotal}</span></div>
                        );
                      })()}
                      <div className="border-t border-amber-200/10 my-1" />
                      <div className="flex justify-between"><span>Unarmored total</span><span className="text-gold font-bold">{10 + dexMod}</span></div>
                      {overview.armor_class !== 10 + dexMod && (
                        <>
                          <div className="border-t border-amber-200/10 my-1" />
                          <div className="flex justify-between"><span>Your AC</span><span className="text-gold font-bold">{overview.armor_class}</span></div>
                          <div className="text-[9px] text-amber-200/35 mt-1">Difference of {modStr(overview.armor_class - (10 + dexMod))} from armor, shield, or magic</div>
                        </>
                      )}
                      <div className="border-t border-amber-200/10 my-1" />
                      <div className="text-[9px] text-amber-200/30 text-center">Click "Auto" to calculate from equipped items</div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="card text-center" title={`Initiative = DEX mod (${modStr(dexMod)})${overview.initiative_bonus ? ` + bonus (${modStr(overview.initiative_bonus)})` : ''}`}>
              <div className="text-xs text-amber-200/50 mb-1 flex items-center justify-center gap-1"><Swords size={12} /> Initiative<HelpTooltip text={HELP.initiative} /></div>
              <div className="text-2xl font-display text-gold cursor-pointer hover:text-amber-300 hover:scale-110 transition-all" onClick={() => rollDice('Initiative', initiative + (overview.initiative_bonus || 0))} title="Click to roll initiative">{modStr(initiative + (overview.initiative_bonus || 0))}</div>
              <div className="text-[10px] text-amber-200/30 mt-0.5">DEX {modStr(dexMod)}{overview.initiative_bonus ? ` + ${overview.initiative_bonus}` : ''}</div>
            </div>
            <div className={`card text-center ${condEffects.speedOverride === 0 ? 'border-2 border-red-500/40 bg-red-950/20' : encumbranceState !== 'normal' ? 'border-2 border-orange-500/30 bg-orange-950/10' : ''}`}>
              <div className="text-xs text-amber-200/50 mb-1 flex items-center justify-center gap-1"><Footprints size={12} /> Speed</div>
              {condEffects.speedOverride === 0 ? (
                <>
                  <div className="text-2xl font-display text-red-400 line-through">{overview.speed}</div>
                  <div className="text-lg font-display text-red-300 font-bold">0 ft</div>
                  <div className="text-[10px] text-red-400/70 mt-0.5">Condition</div>
                </>
              ) : condEffects.speedHalved ? (
                <>
                  <div className="text-2xl font-display text-orange-400">{Math.floor(overview.speed / 2)}</div>
                  <div className="text-[10px] text-orange-400/70 mt-0.5">Halved ({overview.speed} base)</div>
                </>
              ) : (
                <>
                  <input type="number" min={0} className="input text-center text-2xl font-display w-20 mx-auto" value={overview.speed} onChange={e => updateField('speed', Math.max(0, parseInt(e.target.value) || 0))} />
                  {encumbranceState === 'heavy' && (
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <AlertTriangle size={10} className="text-red-400" />
                      <span className="text-[9px] text-red-400 font-semibold">Heavily Encumbered: -20 ft</span>
                    </div>
                  )}
                  {encumbranceState === 'encumbered' && (
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <AlertTriangle size={10} className="text-orange-400" />
                      <span className="text-[9px] text-orange-400 font-semibold">Encumbered: -10 ft</span>
                    </div>
                  )}
                  {/* Speed variant mini-badges when collapsed */}
                  {!showSpeedVariants && (overview.climb_speed > 0 || overview.swim_speed > 0 || overview.fly_speed > 0) && (
                    <div className="flex justify-center gap-1 mt-1.5 flex-wrap">
                      {overview.climb_speed > 0 && <span className="text-[8px] text-amber-200/35 bg-amber-200/5 px-1.5 py-0.5 rounded">Climb {overview.climb_speed}ft</span>}
                      {overview.swim_speed > 0 && <span className="text-[8px] text-blue-300/35 bg-blue-300/5 px-1.5 py-0.5 rounded">Swim {overview.swim_speed}ft</span>}
                      {overview.fly_speed > 0 && <span className="text-[8px] text-sky-300/35 bg-sky-300/5 px-1.5 py-0.5 rounded">Fly {overview.fly_speed}ft</span>}
                    </div>
                  )}
                  <button
                    onClick={() => setShowSpeedVariants(!showSpeedVariants)}
                    className="text-[8px] text-amber-200/25 hover:text-amber-200/50 transition-colors mt-1"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    {showSpeedVariants ? 'Hide variants' : 'Speed variants'}
                  </button>
                  {showSpeedVariants && (
                    <div className="mt-1.5 space-y-1">
                      <div className="flex items-center gap-1.5 justify-center">
                        <Flame size={9} className="text-amber-200/30 flex-shrink-0" />
                        <span className="text-[9px] text-amber-200/35 w-10">Climb</span>
                        <input type="number" min={0} className="input text-center text-[10px] w-14 py-0" value={overview.climb_speed || ''} placeholder="--" onChange={e => updateField('climb_speed', parseInt(e.target.value) || 0)} />
                      </div>
                      <div className="flex items-center gap-1.5 justify-center">
                        <Waves size={9} className="text-blue-300/30 flex-shrink-0" />
                        <span className="text-[9px] text-blue-300/35 w-10">Swim</span>
                        <input type="number" min={0} className="input text-center text-[10px] w-14 py-0" value={overview.swim_speed || ''} placeholder="--" onChange={e => updateField('swim_speed', parseInt(e.target.value) || 0)} />
                      </div>
                      <div className="flex items-center gap-1.5 justify-center">
                        <Wind size={9} className="text-sky-300/30 flex-shrink-0" />
                        <span className="text-[9px] text-sky-300/35 w-10">Fly</span>
                        <input type="number" min={0} className="input text-center text-[10px] w-14 py-0" value={overview.fly_speed || ''} placeholder="--" onChange={e => updateField('fly_speed', parseInt(e.target.value) || 0)} />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="card text-center">
              <div className="text-xs text-amber-200/50 mb-1 flex items-center justify-center gap-1"><Eye size={12} /> Passive Perc.<HelpTooltip text={HELP.passivePerception} /></div>
              <div className="text-2xl font-display text-amber-100">{passivePerc}</div>
            </div>
            {spellSaveDC && (
              <div className="card text-center" title={`Spell Save DC = 8 + ${profBonus} (prof) + ${modStr(calcMod(abilityMap[spellSaveDC.ability] || 10))} (${spellSaveDC.ability})`}>
                <div className="text-xs text-amber-200/50 mb-1 flex items-center justify-center gap-1"><Star size={12} /> Spell DC</div>
                <div className="text-2xl font-display text-purple-300">{spellSaveDC.dc}</div>
                <div className="text-[10px] text-amber-200/30 mt-0.5">{spellSaveDC.ability}</div>
              </div>
            )}
            {spellAttackBonus && (
              <div className="card text-center" title={`Spell Attack = ${profBonus} (prof) + ${modStr(calcMod(abilityMap[spellAttackBonus.ability] || 10))} (${spellAttackBonus.ability})`}>
                <div className="text-xs text-amber-200/50 mb-1 flex items-center justify-center gap-1"><Wand2 size={12} /> Spell Atk</div>
                <div className="text-2xl font-display text-purple-300">{modStr(spellAttackBonus.bonus)}</div>
                <div className="text-[10px] text-amber-200/30 mt-0.5">{spellAttackBonus.ability}</div>
              </div>
            )}
          </div>

          {/* Inspiration & Attunement quick bar */}
          <div className="flex items-center gap-4 px-3 py-2 rounded-lg border border-amber-200/10 bg-amber-200/[0.02]">
            {/* Inspiration toggle */}
            <button
              onClick={() => updateField('inspiration', !overview.inspiration)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-all ${
                overview.inspiration
                  ? 'bg-gold/15 border-gold/40 text-gold shadow-[0_0_8px_rgba(201,168,76,0.2)]'
                  : 'border-amber-200/15 text-amber-200/25 hover:border-amber-200/30 hover:text-amber-200/40'
              }`}
              title={overview.inspiration ? 'Inspired! Click to spend' : 'Click to toggle inspiration'}
            >
              <Star size={14} fill={overview.inspiration ? 'currentColor' : 'none'} />
              <span className="text-xs font-display tracking-wide">Inspiration</span>
            </button>

            <div className="w-px h-5 bg-amber-200/10" />

            {/* Attunement display */}
            <div className="flex items-center gap-2" title={`${attunedCount} of 3 attunement slots used`}>
              <Sparkles size={14} className={attunedCount > 0 ? 'text-purple-400' : 'text-purple-400/30'} />
              <span className="text-xs text-amber-200/50 font-display tracking-wide">Attuned</span>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full border transition-all ${
                      i < attunedCount
                        ? 'bg-purple-400/60 border-purple-400/80 shadow-[0_0_6px_rgba(192,132,252,0.3)]'
                        : 'border-amber-200/15 bg-transparent'
                    }`}
                  />
                ))}
              </div>
              <span className={`text-xs font-mono ${attunedCount >= 3 ? 'text-purple-400' : 'text-amber-200/40'}`}>
                {attunedCount}/3
              </span>
            </div>
          </div>

          {/* Concentration Tracker */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all"
            style={{
              background: concentrationSpell ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.03)',
              borderColor: concentrationSpell ? 'rgba(139,92,246,0.25)' : 'rgba(139,92,246,0.1)',
            }}
          >
            <Target size={14} className={concentrationSpell ? 'text-purple-400' : 'text-purple-400/30'} />
            <span className="text-xs text-purple-300/60 font-display tracking-wide flex-shrink-0">Concentrating on:</span>
            <input
              type="text"
              className="input flex-1 text-sm py-1"
              style={{ background: 'transparent', border: 'none', color: concentrationSpell ? '#c4b5fd' : 'rgba(196,181,253,0.4)', outline: 'none', boxShadow: 'none' }}
              placeholder="None"
              value={concentrationSpell}
              onChange={e => updateConcentration(e.target.value)}
            />
            {concentrationSpell && (
              <button
                onClick={() => updateConcentration('')}
                className="text-purple-400/40 hover:text-purple-300 transition-colors text-xs"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px' }}
                title="Drop concentration"
              >
                Drop
              </button>
            )}
          </div>

          {/* Carrying Capacity */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg border transition-all"
            style={{
              background: encumbranceState !== 'normal' ? 'rgba(249,115,22,0.06)' : 'rgba(201,168,76,0.03)',
              borderColor: encumbranceState === 'heavy' ? 'rgba(239,68,68,0.25)' : encumbranceState === 'encumbered' ? 'rgba(249,115,22,0.2)' : 'rgba(201,168,76,0.1)',
            }}
          >
            <Package size={14} className={encumbranceState !== 'normal' ? 'text-orange-400' : 'text-amber-200/30'} />
            <span className="text-xs text-amber-200/50 font-display tracking-wide flex-shrink-0">Carry Capacity:</span>
            <span className="text-sm font-display text-amber-100 font-bold">{carryingCapacity.capacity} lbs</span>
            <span className="text-[10px] text-amber-200/25">(STR {abilityMap.STR || 10} x 15)</span>
            {encumbranceState === 'heavy' && (
              <span className="ml-auto text-[10px] text-red-400 bg-red-900/30 px-1.5 py-0.5 rounded border border-red-500/20 font-medium">Heavily Encumbered</span>
            )}
            {encumbranceState === 'encumbered' && (
              <span className="ml-auto text-[10px] text-orange-400 bg-orange-900/30 px-1.5 py-0.5 rounded border border-orange-500/20 font-medium">Encumbered</span>
            )}
          </div>

          {/* HP Section */}
          <div className="card">
            <SectionToggle collapsedSections={collapsedSections} toggleCollapse={toggleCollapse} id="hp" title="Hit Points" summary={hpSummary} icon={Heart} helpTooltip={<HelpTooltip text={HELP.hp} />}
              rightContent={
                <div className="flex items-center gap-2">
                  {overview.hp_calc_method !== 'manual' && (
                    <span className="text-[9px] text-emerald-400/50 bg-emerald-400/8 border border-emerald-400/15 px-1.5 py-0.5 rounded font-display tracking-wide">AUTO</span>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowHPCalc(!showHPCalc); }}
                    className="text-[10px] text-amber-200/40 hover:text-gold transition-colors flex items-center gap-1"
                    title="Open HP calculator"
                  >
                    <Calculator size={11} /> {showHPCalc ? 'Hide' : 'Calculate HP'}
                  </button>
                </div>
              }
            >
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div>
                <label className="label">Max HP</label>
                <input type="number" className="input w-full" value={overview.max_hp} onChange={e => updateField('max_hp', parseInt(e.target.value) || 0)} />
              </div>
              <div>
                <label className="label">Current HP</label>
                <input type="number" className="input w-full" value={overview.current_hp} onChange={e => updateField('current_hp', parseInt(e.target.value) || 0)} />
              </div>
              <div>
                <label className="label">Temp HP<HelpTooltip text={HELP.tempHp} /></label>
                <input type="number" className="input w-full" value={overview.temp_hp} onChange={e => updateField('temp_hp', parseInt(e.target.value) || 0)} />
              </div>
            </div>
            {/* HP Calculator */}
            {showHPCalc && (() => {
              const classData = CLASSES.find(c => c.name === overview.primary_class);
              const hitDie = classData?.hitDie;
              const conMod = calcMod(abilityMap.CON || 10);
              const autoHP = hitDie ? calcAutoHP(overview.primary_class, overview.level, conMod) : null;
              return (
                <div className="mt-3 p-4 rounded-lg bg-[#0a0a10] border border-gold/15">
                  <div className="text-xs font-display text-gold/70 tracking-wider uppercase mb-3">HP Calculator</div>
                  {hitDie ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-3 text-xs text-amber-200/60">
                        <div className="flex justify-between"><span>Hit Die</span><span className="text-amber-100 font-medium">d{hitDie}</span></div>
                        <div className="flex justify-between"><span>CON Modifier</span><span className="text-amber-100 font-medium">{modStr(conMod)}</span></div>
                        <div className="flex justify-between"><span>Level 1 HP</span><span className="text-amber-100 font-medium">{hitDie} + {conMod} = {hitDie + conMod}</span></div>
                        <div className="flex justify-between"><span>Per Level (avg)</span><span className="text-amber-100 font-medium">{Math.floor(hitDie / 2) + 1} + {conMod} = {Math.floor(hitDie / 2) + 1 + conMod}</span></div>
                      </div>
                      <div className="border-t border-amber-200/10 my-2" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-amber-200/60">Calculated Max HP (avg):</span>
                        <span className="text-xl font-display text-gold font-bold">{autoHP}</span>
                      </div>
                      {autoHP !== overview.max_hp && (
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => {
                              const ratio = overview.max_hp > 0 ? overview.current_hp / overview.max_hp : 1;
                              const newCurrent = Math.max(1, Math.min(autoHP, Math.round(autoHP * ratio)));
                              const updated = { ...overview, max_hp: autoHP, current_hp: newCurrent, hp_calc_method: 'auto' };
                              setOverview(updated);
                              triggerOverview(updated);
                              toast.success(`Max HP set to ${autoHP} (auto-calculated)`);
                            }}
                            className="text-xs px-3 py-1.5 rounded bg-gold/15 text-gold border border-gold/30 hover:bg-gold/25 transition-all"
                          >
                            Apply Auto HP ({autoHP})
                          </button>
                          <button
                            onClick={() => {
                              const updated = { ...overview, hp_calc_method: 'manual' };
                              setOverview(updated);
                              triggerOverview(updated);
                              toast('HP set to manual mode — auto-calc disabled', { duration: 2000 });
                            }}
                            className="text-xs px-3 py-1.5 rounded bg-white/[0.04] text-amber-200/50 border border-amber-200/10 hover:border-amber-200/25 transition-all"
                          >
                            Keep Manual ({overview.max_hp})
                          </button>
                        </div>
                      )}
                      {autoHP === overview.max_hp && overview.hp_calc_method !== 'manual' && (
                        <div className="text-[10px] text-emerald-400/50 flex items-center gap-1"><Check size={10} /> HP matches auto-calculation</div>
                      )}
                      {/* Roll for HP option */}
                      <div className="border-t border-amber-200/10 mt-3 pt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const roll = Math.floor(Math.random() * hitDie) + 1;
                              const hpGain = Math.max(1, roll + conMod);
                              setHpRollResult({ roll, conMod, total: hpGain, die: hitDie });
                              toast(`Rolled d${hitDie}: ${roll} + CON (${modStr(conMod)}) = ${hpGain} HP`, { icon: '🎲', duration: 4000 });
                            }}
                            className="text-xs px-3 py-1.5 rounded bg-purple-900/20 text-purple-300 border border-purple-500/20 hover:bg-purple-900/30 transition-all flex items-center gap-1"
                          >
                            <Dices size={11} /> Roll d{hitDie} for HP
                          </button>
                          {hpRollResult && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-purple-300">
                                Rolled {hpRollResult.roll} + {modStr(hpRollResult.conMod)} = <strong>{hpRollResult.total}</strong> HP
                              </span>
                              <button
                                onClick={() => {
                                  const newMax = (overview.max_hp || 0) + hpRollResult.total;
                                  const updated = { ...overview, max_hp: newMax, current_hp: newMax, hp_calc_method: 'manual' };
                                  setOverview(updated);
                                  triggerOverview(updated);
                                  setHpRollResult(null);
                                  toast.success(`Added ${hpRollResult.total} HP! New max: ${newMax}`);
                                }}
                                className="text-[10px] px-2 py-1 rounded bg-purple-500/20 text-purple-200 border border-purple-500/30 hover:bg-purple-500/30 transition-all"
                              >
                                Add to Max
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-[9px] text-amber-200/25 mt-1">Roll instead of taking the average. Sets HP to manual mode.</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-amber-200/40">Select a class to auto-calculate HP.</p>
                  )}
                </div>
              );
            })()}

            {/* Quick Damage / Heal / Temp HP buttons */}
            <div className="flex gap-2 mt-3">
              <button onClick={() => { setShowDamage(!showDamage); setShowHeal(false); setShowTempHpInput(false); }}
                className={`flex-1 text-xs font-display tracking-wider py-2 px-3 rounded-lg border transition-all ${showDamage ? 'bg-red-900/30 border-red-500/40 text-red-300' : 'bg-red-950/20 border-red-500/15 text-red-400/60 hover:border-red-500/30 hover:text-red-300'}`}>
                Take Damage
              </button>
              <button onClick={() => { setShowHeal(!showHeal); setShowDamage(false); setShowTempHpInput(false); }}
                className={`flex-1 text-xs font-display tracking-wider py-2 px-3 rounded-lg border transition-all ${showHeal ? 'bg-emerald-900/30 border-emerald-500/40 text-emerald-300' : 'bg-emerald-950/20 border-emerald-500/15 text-emerald-400/60 hover:border-emerald-500/30 hover:text-emerald-300'}`}>
                Heal
              </button>
              <button onClick={() => { setShowTempHpInput(!showTempHpInput); setShowDamage(false); setShowHeal(false); }}
                className={`flex-1 text-xs font-display tracking-wider py-2 px-3 rounded-lg border transition-all ${showTempHpInput ? 'bg-blue-900/30 border-blue-500/40 text-blue-300' : 'bg-blue-950/20 border-blue-500/15 text-blue-400/60 hover:border-blue-500/30 hover:text-blue-300'}`}>
                + Temp HP
              </button>
            </div>
            {showDamage && (
              <div className="mt-2" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div className="flex gap-2 items-center">
                  <input type="number" min={1} autoFocus className="input w-24 text-center text-red-300" placeholder="Amount"
                    value={damageAmount} onChange={e => setDamageAmount(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applyDamage()} />
                  <select
                    value={damageType}
                    onChange={e => setDamageType(e.target.value)}
                    className="input text-[11px] text-red-300/80"
                    style={{ width: '120px', padding: '5px 6px' }}
                  >
                    <option value="">Type (any)</option>
                    {DAMAGE_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <button onClick={applyDamage} className="text-xs font-medium py-1.5 px-4 rounded-lg bg-red-600/20 border border-red-500/30 text-red-300 hover:bg-red-600/30 transition-colors">
                    Apply
                  </button>
                </div>
                {/* Auto-detection indicator */}
                {damageType && damageModifier === 'normal' && (() => {
                  const mods = parsedDamageModifiers;
                  if (mods.immunities.includes(damageType)) return (
                    <span className="text-[10px] font-medium text-yellow-300/80" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldOff size={10} /> Immune to {damageType} — damage will be negated
                    </span>
                  );
                  if (mods.resistances.includes(damageType)) return (
                    <span className="text-[10px] font-medium text-blue-300/80" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Shield size={10} /> Resistant to {damageType} — damage will be halved
                    </span>
                  );
                  if (mods.vulnerabilities.includes(damageType)) return (
                    <span className="text-[10px] font-medium text-red-300/80" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertTriangle size={10} /> Vulnerable to {damageType} — damage will be doubled
                    </span>
                  );
                  return null;
                })()}
                <div className="flex gap-1.5 items-center">
                  {['normal', 'resistant', 'vulnerable'].map(mod => (
                    <button key={mod} onClick={() => setDamageModifier(mod)}
                      className={`text-[10px] font-medium py-1 px-2.5 rounded-md border transition-all ${
                        damageModifier === mod
                          ? mod === 'resistant' ? 'bg-blue-600/25 border-blue-400/40 text-blue-300'
                            : mod === 'vulnerable' ? 'bg-orange-600/25 border-orange-400/40 text-orange-300'
                            : 'bg-amber-600/15 border-amber-400/30 text-amber-300'
                          : 'border-amber-200/10 text-amber-200/30 hover:text-amber-200/50'
                      }`}>
                      {mod === 'normal' ? 'Normal' : mod === 'resistant' ? 'Resist (x0.5)' : 'Vuln (x2)'}
                    </button>
                  ))}
                  <span className="text-[10px] text-amber-200/30 ml-0.5">Override</span>
                  {damageAmount && damageModifier !== 'normal' && (
                    <span className="text-[10px] text-amber-200/40 ml-1">
                      = {damageModifier === 'resistant' ? Math.floor((parseInt(damageAmount) || 0) / 2) : (parseInt(damageAmount) || 0) * 2} dmg
                    </span>
                  )}
                </div>
              </div>
            )}
            {showHeal && (
              <div className="flex gap-2 mt-2 items-center">
                <input type="number" min={1} autoFocus className="input w-24 text-center text-emerald-300" placeholder="Amount"
                  value={healAmount} onChange={e => setHealAmount(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && applyHeal()} />
                <button onClick={applyHeal} className="text-xs font-medium py-1.5 px-4 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30 transition-colors">
                  Apply Healing
                </button>
              </div>
            )}
            {showTempHpInput && (
              <div className="flex gap-2 mt-2 items-center">
                <input type="number" min={1} autoFocus className="input w-24 text-center text-blue-300" placeholder="Amount"
                  value={tempHpAmount} onChange={e => setTempHpAmount(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && applyTempHp()} />
                <button onClick={applyTempHp} className="text-xs font-medium py-1.5 px-4 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600/30 transition-colors">
                  Set Temp HP
                </button>
                {(overview.temp_hp || 0) > 0 && (
                  <span className="text-[10px] text-blue-300/50">Current: {overview.temp_hp} (keeps higher)</span>
                )}
              </div>
            )}
            {/* Undo last HP change (10-second window) */}
            {lastHpAction && (
              <button
                onClick={() => {
                  const restored = { ...overview, current_hp: lastHpAction.prevHp, temp_hp: lastHpAction.prevTempHp };
                  setOverview(restored);
                  triggerOverview(restored);
                  toast.success(`Undid ${lastHpAction.label}. HP restored to ${lastHpAction.prevHp}/${overview.max_hp}`);
                  setLastHpAction(null);
                  if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
                }}
                className="flex items-center gap-1.5 text-[10px] font-medium px-3 py-1 mt-1 rounded bg-amber-900/15 border border-amber-500/20 text-amber-400/70 hover:bg-amber-900/25 hover:text-amber-300 transition-all w-fit"
                title="Undo the last damage or healing applied"
              >
                <RotateCcw size={10} /> Undo {lastHpAction.label}
              </button>
            )}
            {/* HP bar with color states, shimmer, and temp HP segment */}
            <div className="hp-bar-full" style={{ marginTop: '10px' }} role="progressbar" aria-label={`HP: ${overview.current_hp} of ${overview.max_hp}`} aria-valuenow={overview.current_hp} aria-valuemin={0} aria-valuemax={overview.max_hp}>
              <div
                className={`hp-bar-full-fill ${hpPercent <= 0 ? 'hp-critical' : hpPercent < 25 ? 'hp-low' : hpPercent <= 50 ? 'hp-mid' : 'hp-high'}`}
                style={{ width: `${Math.min(100, Math.max(0, hpPercent))}%` }}
              />
              {overview.temp_hp > 0 && overview.max_hp > 0 && (
                <div
                  className="hp-bar-temp-overlay"
                  style={{
                    left: `${Math.min(100, Math.max(0, hpPercent))}%`,
                    right: 'auto',
                    width: `${Math.min(100 - hpPercent, (overview.temp_hp / overview.max_hp) * 100)}%`,
                  }}
                />
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '5px', fontFamily: 'Outfit, sans-serif' }}>
              <span style={{ color: hpPercent < 25 ? '#fca5a5' : 'rgba(255,255,255,0.5)', fontWeight: hpPercent < 25 ? 600 : 400 }}>
                {overview.current_hp} / {overview.max_hp} HP
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {overview.temp_hp > 0 && (
                  <span style={{ color: '#93c5fd' }}>+{overview.temp_hp} temp</span>
                )}
                <span style={{
                  color: hpStatus.color,
                  background: hpStatus.bgColor,
                  padding: '1px 8px',
                  borderRadius: '9999px',
                  fontSize: '10px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.05em',
                  border: `1px solid ${hpStatus.color}33`,
                }}>
                  {hpStatus.text}
                </span>
              </div>
            </div>
            </SectionToggle>
          </div>

          {/* Prominent Death Saves - visible at 0 HP */}
          {overview.current_hp <= 0 && (
            <div className="card border-2 border-red-500/40 bg-red-950/20 shadow-[0_0_24px_rgba(239,68,68,0.12)]">
              <div className="flex items-center gap-2 mb-3">
                <Skull size={18} className="text-red-400" />
                <h3 className="font-display text-red-300 text-lg tracking-wide">DEATH SAVES</h3>
                <span className="text-xs text-red-400/60 ml-auto">Your character is at 0 HP!</span>
              </div>
              <div className="flex gap-10 justify-center py-2">
                <div className="text-center">
                  <label className="label text-emerald-400/80 mb-2 text-sm font-display tracking-wider">Successes</label>
                  <div className="flex gap-3">
                    {[1,2,3].map(i => (
                      <button key={i}
                        onClick={() => updateField('death_save_successes', overview.death_save_successes === i ? i-1 : i)}
                        className={`death-save-pip success ${i <= overview.death_save_successes ? 'active' : ''}`}
                        title={i <= overview.death_save_successes ? 'Click to remove success' : 'Click to mark success'}
                      >
                        {i <= overview.death_save_successes && <Check size={16} className="text-white" strokeWidth={3} />}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <label className="label text-red-400/80 mb-2 text-sm font-display tracking-wider">Failures</label>
                  <div className="flex gap-3">
                    {[1,2,3].map(i => (
                      <button key={i}
                        onClick={() => updateField('death_save_failures', overview.death_save_failures === i ? i-1 : i)}
                        className={`death-save-pip failure ${i <= overview.death_save_failures ? 'active' : ''}`}
                        title={i <= overview.death_save_failures ? 'Click to remove failure' : 'Click to mark failure'}
                      >
                        {i <= overview.death_save_failures && <span className="text-white text-lg font-bold">&times;</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-3">
                <button
                  onClick={() => {
                    const d20 = Math.floor(Math.random() * 20) + 1;
                    if (d20 === 20) {
                      const updated = { ...overview, current_hp: 1, death_save_successes: 0, death_save_failures: 0 };
                      setOverview(updated);
                      triggerOverview(updated);
                      toast.success(`Critical! You regain 1 HP!`, { icon: '🎲', duration: 5000, style: { background: '#1a2e1a', color: '#86efac', border: '1px solid rgba(52,211,153,0.4)', fontFamily: 'monospace' } });
                    } else if (d20 === 1) {
                      const newFails = Math.min(3, overview.death_save_failures + 2);
                      const updated = { ...overview, death_save_failures: newFails };
                      setOverview(updated);
                      triggerOverview(updated);
                      if (newFails >= 3) {
                        toast(`NAT 1! Your character has fallen...`, { icon: '💀', duration: 6000, style: { background: '#2e1a1a', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.4)', fontFamily: 'monospace' } });
                      } else {
                        toast(`NAT 1! Two death save failures! (${newFails}/3)`, { icon: '💀', duration: 5000, style: { background: '#2e1a1a', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.4)', fontFamily: 'monospace' } });
                      }
                    } else if (d20 >= 10) {
                      const newSucc = Math.min(3, overview.death_save_successes + 1);
                      const updated = { ...overview, death_save_successes: newSucc };
                      setOverview(updated);
                      triggerOverview(updated);
                      if (newSucc >= 3) {
                        toast.success(`Rolled ${d20} — Stabilized! Your character is unconscious but stable.`, { icon: '🎲', duration: 5000, style: { background: '#1a2e1a', color: '#86efac', border: '1px solid rgba(52,211,153,0.4)', fontFamily: 'monospace' } });
                      } else {
                        toast.success(`Rolled ${d20} — Death save success! (${newSucc}/3)`, { icon: '🎲', duration: 4000, style: { background: '#1a2e1a', color: '#86efac', border: '1px solid rgba(52,211,153,0.3)', fontFamily: 'monospace' } });
                      }
                    } else {
                      const newFails = Math.min(3, overview.death_save_failures + 1);
                      const updated = { ...overview, death_save_failures: newFails };
                      setOverview(updated);
                      triggerOverview(updated);
                      if (newFails >= 3) {
                        toast(`Rolled ${d20} — Your character has fallen...`, { icon: '💀', duration: 6000, style: { background: '#2e1a1a', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.4)', fontFamily: 'monospace' } });
                      } else {
                        toast(`Rolled ${d20} — Death save failure! (${newFails}/3)`, { icon: '💀', duration: 4000, style: { background: '#2e1a1a', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)', fontFamily: 'monospace' } });
                      }
                    }
                  }}
                  className="btn-primary text-sm px-6 py-2 flex items-center gap-2 bg-red-600/80 hover:bg-red-500 border-red-400/30"
                  title="Roll d20: 10+ = success, 9 or less = failure. Nat 20 = regain 1 HP. Nat 1 = 2 failures."
                  disabled={overview.death_save_successes >= 3 || overview.death_save_failures >= 3}
                >
                  🎲 Roll Death Save
                </button>
              </div>
              <p className="text-xs text-red-300/40 text-center mt-2">
                Roll d20 each turn: 10+ = success, 9- = failure. Nat 20 = regain 1 HP. Nat 1 = two failures.
              </p>
            </div>
          )}

          {/* Hit Dice & Death Saves */}
          <div className={`grid grid-cols-1 ${overview.current_hp > 0 ? 'md:grid-cols-2' : ''} gap-6`}>
            <div className="card">
              <SectionToggle collapsedSections={collapsedSections} toggleCollapse={toggleCollapse} id="hit-dice" title="Hit Dice" summary={hitDiceSummary} helpTooltip={<HelpTooltip text={HELP.hitDice} />}>
              <p className="text-xs text-amber-200/30 mb-3">Spend during short rests to heal. Total = your class die (e.g., "3d10"). Half recover on long rest.</p>
              <div className="flex items-center gap-4">
                <div>
                  <label className="label">Total</label>
                  <div className="flex items-center gap-2">
                    <input className="input w-24" placeholder="e.g. 5d10" value={overview.hit_dice_total} onChange={e => updateField('hit_dice_total', e.target.value)} />
                    {(() => {
                      const classData = CLASSES.find(c => c.name === overview.primary_class);
                      if (!classData?.hitDie || !overview.level) return null;
                      const suggested = `${overview.level}d${classData.hitDie}`;
                      if (overview.hit_dice_total === suggested) return null;
                      return (
                        <button
                          onClick={() => {
                            updateField('hit_dice_total', suggested);
                            toast.success(`Hit dice set to ${suggested}`);
                          }}
                          className="text-[10px] font-medium px-2 py-1.5 rounded bg-gold/10 border border-gold/25 text-gold/80 hover:bg-gold/20 hover:text-gold transition-all whitespace-nowrap flex items-center gap-1"
                          title={`Auto-set to ${suggested} (${overview.primary_class} Lv ${overview.level})`}
                        >
                          <Wand2 size={10} /> Auto
                        </button>
                      );
                    })()}
                  </div>
                </div>
                <div>
                  <label className="label">Used</label>
                  <input type="number" className="input w-20" min={0} value={overview.hit_dice_used} onChange={e => updateField('hit_dice_used', parseInt(e.target.value) || 0)} />
                </div>
              </div>
              </SectionToggle>
            </div>

            {/* Compact Death Saves — hidden at 0 HP since the prominent panel is showing */}
            {overview.current_hp > 0 && (
              <div className="card">
                <h3 className="font-display text-amber-100 mb-1">Death Saves<HelpTooltip text={HELP.deathSaves} /></h3>
                <p className="text-xs text-amber-200/30 mb-3">Click circles to track saves when at 0 HP. Three of either = outcome.</p>
                <div className="flex gap-8">
                  <div>
                    <label className="label text-emerald-400/70 mb-1.5">Successes</label>
                    <div className="flex gap-2.5">
                      {[1,2,3].map(i => (
                        <button key={i}
                          onClick={() => updateField('death_save_successes', overview.death_save_successes === i ? i-1 : i)}
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                            i <= overview.death_save_successes
                              ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.3)]'
                              : 'border-emerald-400/25 hover:border-emerald-400/50'
                          }`}
                          title={i <= overview.death_save_successes ? 'Click to remove success' : 'Click to mark success'}
                        >
                          {i <= overview.death_save_successes && <Check size={14} className="text-white" strokeWidth={3} />}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="label text-red-400/70 mb-1.5">Failures</label>
                    <div className="flex gap-2.5">
                      {[1,2,3].map(i => (
                        <button key={i}
                          onClick={() => updateField('death_save_failures', overview.death_save_failures === i ? i-1 : i)}
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                            i <= overview.death_save_failures
                              ? 'bg-red-500 border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.3)]'
                              : 'border-red-400/25 hover:border-red-400/50'
                          }`}
                          title={i <= overview.death_save_failures ? 'Click to remove failure' : 'Click to mark failure'}
                        >
                          {i <= overview.death_save_failures && <span className="text-white text-sm font-bold">&times;</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-amber-200/25 mt-3">
                  At 0 HP, roll d20 each turn: 10+ = success, 9 or less = failure. Nat 20 = regain 1 HP. Nat 1 = two failures.
                </p>
              </div>
            )}
          </div>

          {/* Inspiration & Exhaustion (combined) */}
          <div className="card">
            <SectionToggle collapsedSections={collapsedSections} toggleCollapse={toggleCollapse} id="inspiration-exhaustion" title="Inspiration & Exhaustion" summary={inspirationExhaustionSummary}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inspiration */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-display text-amber-100">Inspiration<HelpTooltip text={HELP.inspiration} /></h4>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateField('inspiration', !overview.inspiration)}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                      overview.inspiration
                        ? 'bg-gold/20 border-gold text-gold shadow-[0_0_12px_rgba(201,168,76,0.3)]'
                        : 'border-amber-200/20 text-amber-200/20 hover:border-amber-200/40'
                    }`}
                    title={overview.inspiration ? 'Inspired! Click to spend' : 'No inspiration — click when your DM awards it'}
                  >
                    <Star size={18} fill={overview.inspiration ? 'currentColor' : 'none'} />
                  </button>
                  <p className={`text-xs ${overview.inspiration ? 'text-gold/60' : 'text-amber-200/20'}`}>
                    {overview.inspiration ? 'Inspired! Use it for advantage on a roll.' : 'Not inspired — click star when your DM awards it'}
                  </p>
                </div>
              </div>

              {/* Exhaustion */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-display text-amber-100">Exhaustion<HelpTooltip text={HELP.exhaustion} /></h4>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {EXHAUSTION_LEVELS.map((effect, i) => {
                    const lvl = i + 1;
                    return (
                      <button key={lvl}
                        onClick={() => updateField('exhaustion_level', overview.exhaustion_level === lvl ? lvl-1 : lvl)}
                        className={`w-9 h-9 rounded text-xs font-bold transition-all ${
                          lvl <= overview.exhaustion_level
                            ? 'bg-red-700/50 border-2 border-red-500 text-red-200 shadow-[0_0_6px_rgba(239,68,68,0.2)]'
                            : 'border-2 border-amber-200/15 text-amber-200/25 hover:border-amber-200/30'
                        }`}
                        title={`Level ${lvl}: ${effect}`}
                      >
                        {lvl}
                      </button>
                    );
                  })}
                </div>
                {overview.exhaustion_level > 0 && (
                  <div className="mt-3 p-3 rounded-lg border-2 border-red-500/25 bg-red-950/30 shadow-[0_0_16px_rgba(239,68,68,0.06)]">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle size={14} className="text-red-400" />
                      <span className="text-xs font-display text-red-300 font-semibold tracking-wide">
                        Exhaustion Level {overview.exhaustion_level} — Active Effects
                      </span>
                    </div>
                    <div className="space-y-1">
                      {EXHAUSTION_LEVELS.slice(0, overview.exhaustion_level).map((effect, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          <span className={`flex-shrink-0 mt-0.5 w-4 h-4 rounded text-center font-bold leading-4 ${i === overview.exhaustion_level - 1 ? 'bg-red-600/50 text-red-200 border border-red-500/40' : 'bg-red-900/40 text-red-300/60 border border-red-500/20'}`}>{i + 1}</span>
                          <span className={`${i === overview.exhaustion_level - 1 ? 'text-red-200 font-medium' : 'text-red-300/50'}`}>{effect}</span>
                        </div>
                      ))}
                    </div>
                    {overview.exhaustion_level >= 4 && (
                      <div className="mt-2 pt-2 border-t border-red-500/15 text-[10px] text-red-400/70 flex items-center gap-1">
                        <Skull size={10} /> {overview.exhaustion_level >= 6 ? 'LETHAL — Character dies at level 6!' : 'Dangerously high exhaustion!'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            </SectionToggle>
          </div>

          {/* Damage Modifiers (Resistances, Immunities, Vulnerabilities) */}
      <div className="card">
        <SectionToggle collapsedSections={collapsedSections} toggleCollapse={toggleCollapse} id="damage-mods" title="Damage Modifiers" summary={damageModSummary}>
        <p className="text-xs text-amber-200/30 mb-3">Track resistances, immunities, and vulnerabilities from your race, class, or magic items.</p>

        {/* Category display */}
        {[
          { key: 'resistances', label: 'Resistances', desc: 'Half damage', icon: <Shield size={14} />, color: 'blue', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)', text: 'rgb(147,197,253)', chipBg: 'rgba(59,130,246,0.15)', chipBorder: 'rgba(59,130,246,0.3)' },
          { key: 'immunities', label: 'Immunities', desc: 'No damage', icon: <ShieldOff size={14} />, color: 'gold', bg: 'rgba(234,179,8,0.08)', border: 'rgba(234,179,8,0.25)', text: 'rgb(253,224,71)', chipBg: 'rgba(234,179,8,0.15)', chipBorder: 'rgba(234,179,8,0.3)' },
          { key: 'vulnerabilities', label: 'Vulnerabilities', desc: 'Double damage', icon: <AlertTriangle size={14} />, color: 'red', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', text: 'rgb(252,165,165)', chipBg: 'rgba(239,68,68,0.15)', chipBorder: 'rgba(239,68,68,0.3)' },
        ].map(cat => (
          <div key={cat.key} style={{ background: cat.bg, border: `1px solid ${cat.border}`, borderRadius: '8px', padding: '10px 12px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: parsedDamageModifiers[cat.key].length > 0 ? '8px' : '0' }}>
              <span style={{ color: cat.text, display: 'flex', alignItems: 'center' }}>{cat.icon}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: cat.text, fontWeight: 600 }}>{cat.label}</span>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginLeft: '4px' }}>{cat.desc}</span>
            </div>
            {parsedDamageModifiers[cat.key].length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {parsedDamageModifiers[cat.key].map(type => (
                  <span key={type} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    background: cat.chipBg, border: `1px solid ${cat.chipBorder}`, borderRadius: '6px',
                    padding: '3px 8px', fontSize: '11px', color: cat.text, fontFamily: 'var(--font-ui)',
                  }}>
                    {type}
                    <button
                      onClick={() => removeDamageModifier(cat.key, type)}
                      style={{ background: 'none', border: 'none', color: cat.text, cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center', opacity: 0.6 }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Add damage modifier control */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '8px' }}>
          <select
            value={dmAddCategory}
            onChange={e => setDmAddCategory(e.target.value)}
            className="input"
            style={{ width: '140px', fontSize: '11px', padding: '5px 8px' }}
          >
            <option value="resistances">Resistance</option>
            <option value="immunities">Immunity</option>
            <option value="vulnerabilities">Vulnerability</option>
          </select>
          <select
            value={dmAddType}
            onChange={e => {
              if (e.target.value) {
                addDamageModifier(dmAddCategory, e.target.value);
              }
            }}
            className="input"
            style={{ flex: 1, fontSize: '11px', padding: '5px 8px' }}
          >
            <option value="">Select damage type...</option>
            {DAMAGE_TYPES.filter(t => !parsedDamageModifiers[dmAddCategory]?.includes(t)).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        </SectionToggle>
      </div>
      </div>
      )}

      {/* ═══ CHARACTER TAB ═══ */}
      {overviewTab === 'character' && (
      <div className="space-y-6">
          {/* Quick Notes / Scratchpad */}
          <div className="card">
            <SectionToggle collapsedSections={collapsedSections} toggleCollapse={toggleCollapse} id="notes" title="Quick Notes" icon={StickyNote} summary={overview.notes ? `${overview.notes.slice(0, 40)}${overview.notes.length > 40 ? '...' : ''}` : 'Empty'}>
              <textarea
                className="input w-full min-h-[120px] resize-y text-sm"
                placeholder="Jot down session notes, reminders, loot..."
                value={overview.notes || ''}
                onChange={e => updateField('notes', e.target.value)}
              />
            </SectionToggle>
          </div>

      {/* Race Traits & Class Features */}
      {(() => {
        const raceData = RACES.find(r => {
          const val = r.subrace ? `${r.name} (${r.subrace})` : r.name;
          return val === overview.race;
        });
        const classData = CLASSES.find(c => c.name === overview.primary_class);
        const raceTraits = raceData?.traits || [];
        const classFeatures = (classData?.features || []).filter(f => f.level <= overview.level);
        if (raceTraits.length === 0 && classFeatures.length === 0) return null;
        return (
          <div className="card">
            <SectionToggle collapsedSections={collapsedSections} toggleCollapse={toggleCollapse} id="features" title="Features & Traits" summary={`${raceTraits.length + classFeatures.length} total`}>
            {raceTraits.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-amber-200/40 mb-2">
                  Racial Traits — {overview.race}
                </h4>
                <div className="space-y-2">
                  {raceTraits.map((t, i) => (
                    <div key={i} className="bg-[#0a0a10] rounded p-3 border border-amber-200/8">
                      <div className="text-sm text-amber-100 font-medium">{t.name}</div>
                      <div className="text-xs text-amber-200/45 mt-0.5">{t.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {classFeatures.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-amber-200/40 mb-2">
                  Class Features — {overview.primary_class} (Lv {overview.level})
                </h4>
                <div className="space-y-2">
                  {classFeatures.map((f, i) => (
                    <div key={i} className="bg-[#0a0a10] rounded p-3 border border-amber-200/8">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-amber-100 font-medium">{f.name}</span>
                        <span className="text-[10px] text-amber-200/30 bg-amber-200/5 px-1.5 py-0.5 rounded">Lv {f.level}</span>
                      </div>
                      <div className="text-xs text-amber-200/45 mt-0.5">{f.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            </SectionToggle>
          </div>
        );
      })()}

      {/* Misc fields */}
      <div className="card">
        <SectionToggle collapsedSections={collapsedSections} toggleCollapse={toggleCollapse} id="proficiencies" title="Proficiencies & Senses" summary={`${overview.senses || 'No senses'} \u00B7 ${overview.languages || 'No languages'}`}>
        <p className="text-xs text-amber-200/30 mb-3">Record what your character can see, speak, and use. Check your class and race for these.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Senses</label>
            <input className="input w-full" value={overview.senses} onChange={e => updateField('senses', e.target.value)} placeholder="Darkvision 60ft..." />
          </div>
          <div>
            <label className="label">Languages</label>
            <input className="input w-full" value={overview.languages} onChange={e => updateField('languages', e.target.value)} placeholder="Common, Elvish..." />
          </div>
          <div>
            <label className="label">Armor Proficiencies</label>
            <input className="input w-full" value={overview.proficiencies_armor} onChange={e => updateField('proficiencies_armor', e.target.value)} />
          </div>
          <div>
            <label className="label">Weapon Proficiencies</label>
            <input className="input w-full" value={overview.proficiencies_weapons} onChange={e => updateField('proficiencies_weapons', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Tool Proficiencies</label>
            <input className="input w-full" value={overview.proficiencies_tools} onChange={e => updateField('proficiencies_tools', e.target.value)} />
          </div>
        </div>
        </SectionToggle>
      </div>

      {/* Personal Goals (Character Arcs) */}
      <div className="card">
        <SectionToggle collapsedSections={collapsedSections} toggleCollapse={toggleCollapse} id="goals" title="Personal Goals" icon={Compass} summary={`${personalArcs.length} goal${personalArcs.length !== 1 ? 's' : ''}`}>
          <div className="space-y-3">
            {arcsLoading ? (
              <div className="flex items-center gap-2 text-amber-200/40 text-sm py-4 justify-center">
                <Loader2 size={14} className="animate-spin" /> Loading goals...
              </div>
            ) : personalArcs.length === 0 ? (
              <div className="text-sm text-amber-200/30 py-4 text-center">
                No goals assigned yet. Your DM can create character arcs for you.
              </div>
            ) : (
              <>
                {/* Active arcs first, then resolved */}
                {[...personalArcs]
                  .sort((a, b) => {
                    if (a.status === 'active' && b.status !== 'active') return -1;
                    if (a.status !== 'active' && b.status === 'active') return 1;
                    return (b.created_at || 0) - (a.created_at || 0);
                  })
                  .map(arc => {
                    const isExpanded = expandedArcId === arc.id;
                    const isResolved = arc.status === 'resolved';
                    const isAbandoned = arc.status === 'abandoned';
                    const entries = arcEntries[arc.id] || [];
                    const entriesLoading = arcEntriesLoading[arc.id];
                    return (
                      <div
                        key={arc.id}
                        className={`rounded-lg border transition-all ${
                          isResolved
                            ? 'bg-emerald-900/8 border-emerald-500/15 opacity-70'
                            : isAbandoned
                              ? 'bg-neutral-900/20 border-neutral-500/15 opacity-50'
                              : 'bg-[#0a0a10] border-amber-200/10'
                        }`}
                      >
                        {/* Arc header — clickable to expand */}
                        <button
                          onClick={() => toggleArcExpand(arc.id)}
                          className="w-full flex items-start gap-2 p-3 text-left"
                        >
                          <span className="mt-0.5 shrink-0">
                            {isExpanded
                              ? <ChevronDown size={14} className="text-amber-200/40" />
                              : <ChevronRight size={14} className="text-amber-200/40" />
                            }
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-sm font-medium ${isResolved ? 'text-emerald-200/70' : isAbandoned ? 'text-neutral-400' : 'text-amber-100'}`}>
                                {arc.title}
                              </span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                isResolved
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                  : isAbandoned
                                    ? 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30'
                                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              }`}>
                                {arc.status}
                              </span>
                            </div>
                            {arc.description && (
                              <p className="text-xs text-amber-200/35 mt-1 line-clamp-2">{arc.description}</p>
                            )}
                          </div>
                        </button>

                        {/* Expanded content — timeline entries */}
                        {isExpanded && (
                          <div className="px-3 pb-3 pt-0 border-t border-amber-200/5 mt-0">
                            {/* Resolution note for resolved/abandoned arcs */}
                            {(isResolved || isAbandoned) && arc.resolution && (
                              <div className={`mt-3 p-2 rounded text-xs ${
                                isResolved
                                  ? 'bg-emerald-900/15 border border-emerald-500/15 text-emerald-200/60'
                                  : 'bg-neutral-800/20 border border-neutral-500/15 text-neutral-400/60'
                              }`}>
                                <span className="font-medium">{isResolved ? 'Resolution' : 'Reason'}:</span> {arc.resolution}
                              </div>
                            )}

                            {/* Timeline */}
                            <div className="mt-3">
                              <h4 className="text-[10px] font-display text-amber-200/30 tracking-wider uppercase mb-2">Timeline</h4>
                              {entriesLoading ? (
                                <div className="flex items-center gap-2 text-amber-200/30 text-xs py-2">
                                  <Loader2 size={12} className="animate-spin" /> Loading...
                                </div>
                              ) : entries.length === 0 ? (
                                <p className="text-xs text-amber-200/20 py-2">No timeline entries yet.</p>
                              ) : (
                                <div className="space-y-0 relative">
                                  {/* Vertical line connecting entries */}
                                  <div className="absolute left-[5px] top-2 bottom-2 w-px bg-amber-200/8" />
                                  {entries.map((entry, idx) => {
                                    const typeColors = {
                                      hook: 'bg-sky-400',
                                      development: 'bg-amber-400',
                                      complication: 'bg-rose-400',
                                      climax: 'bg-purple-400',
                                      resolution: 'bg-emerald-400',
                                    };
                                    const typeBadgeColors = {
                                      hook: 'bg-sky-500/15 text-sky-300 border-sky-500/25',
                                      development: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
                                      complication: 'bg-rose-500/15 text-rose-300 border-rose-500/25',
                                      climax: 'bg-purple-500/15 text-purple-300 border-purple-500/25',
                                      resolution: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
                                    };
                                    const dotColor = typeColors[entry.entry_type] || typeColors.development;
                                    const badgeColor = typeBadgeColors[entry.entry_type] || typeBadgeColors.development;
                                    return (
                                      <div key={entry.id || idx} className="relative pl-5 py-1.5">
                                        {/* Timeline dot */}
                                        <div className={`absolute left-0.5 top-[11px] w-[7px] h-[7px] rounded-full ${dotColor} ring-2 ring-[#14121c]`} />
                                        <div className="flex items-center gap-2 flex-wrap">
                                          {entry.session_number > 0 && (
                                            <span className="text-[10px] text-amber-200/25 font-mono">S{entry.session_number}</span>
                                          )}
                                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${badgeColor}`}>
                                            {entry.entry_type}
                                          </span>
                                          {entry.npc_involved && (
                                            <span className="text-[10px] text-purple-300/40">w/ {entry.npc_involved}</span>
                                          )}
                                        </div>
                                        <p className="text-xs text-amber-200/50 mt-0.5">{entry.description}</p>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </>
            )}
          </div>
        </SectionToggle>
      </div>

      </div>
      )}

      {/* ═══ MULTICLASS TAB ═══ */}
      {allowMulticlass && overviewTab === 'multiclass' && multiclassData.length > 0 && (
        <div className="card">
          <p className="text-xs text-amber-200/40 mb-3">Manage your multiclass levels and hit dice breakdown. Primary class details are in the identity card above.</p>
          {(() => {
            let mc = [];
            try { mc = JSON.parse(overview.multiclass_data || '[]'); } catch { mc = []; }
            if (!Array.isArray(mc)) mc = [];
            const tl = getTotalLevel(overview.level, mc);
            const hitDice = getHitDiceBreakdown(overview.primary_class, overview.level, mc);
            const updateMulticlass = (newMc) => {
              const updated = { ...overview, multiclass_data: JSON.stringify(newMc) };
              setOverview(updated);
              triggerOverview(updated);
            };
            const addMulticlass = () => updateMulticlass([...mc, { class: '', subclass: '', level: 1 }]);
            const removeMulticlass = (index) => updateMulticlass(mc.filter((_, i) => i !== index));
            const updateMulticlassEntry = (index, field, value) => {
              const newMc = mc.map((entry, i) => {
                if (i !== index) return entry;
                const updated = { ...entry, [field]: value };
                if (field === 'level') updated.level = Math.max(1, Math.min(20, parseInt(value) || 1));
                return updated;
              });
              updateMulticlass(newMc);
            };
            return (<>
              <div className="text-xs text-amber-200/50 mb-3">Total Level: {tl} ({overview.primary_class || 'Primary'} {overview.level}{mc.map((cls) => ` + ${cls.class || '?'} ${cls.level || '?'}`).join('')})</div>
              {mc.length > 0 && (
                <div className="space-y-2 mb-3">
                  {mc.map((cls, i) => (
                    <div key={i} className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-end bg-purple-900/10 border border-purple-500/15 rounded p-2">
                      <div>
                        <label className="label text-[10px]">Class</label>
                        <select className="input w-full text-sm" value={cls.class || ''} onChange={e => updateMulticlassEntry(i, 'class', e.target.value)}>
                          <option value="">Select...</option>
                          {CLASSES.map(c => (
                            <option key={c.name} value={c.name} disabled={c.name === overview.primary_class}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="label text-[10px]">Subclass</label>
                        {(() => {
                          const clsData = CLASSES.find(c => c.name === cls.class);
                          const subs = clsData?.subclasses || [];
                          if (subs.length > 0) {
                            return (
                              <select className="input w-full text-sm" value={cls.subclass || ''} onChange={e => updateMulticlassEntry(i, 'subclass', e.target.value)}>
                                <option value="">Select...</option>
                                {subs.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            );
                          }
                          return <input className="input w-full text-sm" value={cls.subclass || ''} onChange={e => updateMulticlassEntry(i, 'subclass', e.target.value)} placeholder="Subclass" />;
                        })()}
                      </div>
                      <div>
                        <label className="label text-[10px]">Lv</label>
                        <input type="number" className="input w-16 text-sm text-center" min={1} max={20}
                          value={cls.level || 1} onChange={e => updateMulticlassEntry(i, 'level', e.target.value)} />
                      </div>
                      <button onClick={() => removeMulticlass(i)} className="btn-ghost p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded self-end mb-0.5" title="Remove class">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={addMulticlass} className="btn-ghost text-xs flex items-center gap-1 text-purple-300 hover:text-purple-200">
                <Plus size={12} /> Add Class
              </button>
              {mc.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gold/5">
                  <div className="text-[10px] text-amber-200/40 uppercase tracking-wider mb-1">Hit Dice Breakdown</div>
                  <div className="flex flex-wrap gap-2">
                    {hitDice.map((hd, i) => (
                      <span key={i} className="text-xs bg-purple-900/20 text-purple-200/80 px-2 py-1 rounded border border-purple-500/15">
                        {hd.count}{hd.die} ({hd.class || '?'})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>);
          })()}
        </div>
      )}

      {/* Level-Up Summary */}
      {showLevelUpSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={e => e.target === e.currentTarget && setShowLevelUpSummary(null)}>
          <div className="bg-[#14121c] border border-gold/30 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center">
                <Sparkles size={20} className="text-gold" />
              </div>
              <div>
                <h3 className="font-display text-lg text-gold">Level {showLevelUpSummary.level} Unlocked!</h3>
                <p className="text-xs text-amber-200/40">Here's what changed for your character</p>
              </div>
            </div>
            <div className="space-y-3">
              {/* Proficiency Bonus change */}
              {showLevelUpSummary.profBonusChange && (
                <div className="flex items-center gap-2 p-2 rounded bg-gold/8 border border-gold/15">
                  <Star size={14} className="text-gold" />
                  <span className="text-sm text-amber-100">Proficiency Bonus: +{showLevelUpSummary.profBonusChange.old} → <strong className="text-gold">+{showLevelUpSummary.profBonusChange.new}</strong></span>
                  <span className="text-[10px] text-amber-200/30 ml-auto">All saves & skills updated</span>
                </div>
              )}
              {/* ASI */}
              {showLevelUpSummary.isASI && (
                <div className="flex items-center gap-2 p-2 rounded bg-purple-900/20 border border-purple-500/20">
                  <TrendingUp size={14} className="text-purple-400" />
                  <span className="text-sm text-purple-200">Ability Score Improvement available!</span>
                  <span className="text-[10px] text-purple-300/40 ml-auto">+2 to one / +1 to two</span>
                </div>
              )}
              {/* New Features */}
              {showLevelUpSummary.newFeatures && showLevelUpSummary.newFeatures.length > 0 && (
                <div>
                  <div className="text-[10px] font-display text-amber-200/40 tracking-wider uppercase mb-1.5">New Features</div>
                  {showLevelUpSummary.newFeatures.map((f, i) => (
                    <div key={i} className="p-2 rounded bg-[#0a0a10] border border-amber-200/8 mb-1.5">
                      <div className="text-sm text-amber-100 font-medium">{f.name}</div>
                      <div className="text-xs text-amber-200/45 mt-0.5">{f.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowLevelUpSummary(null)}
                className="text-sm px-4 py-2 rounded font-medium bg-gold/15 text-gold border border-gold/30 hover:bg-gold/25 transition-all"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Short Rest Modal */}
      {showShortRest && (
        <ShortRestModal
          overview={overview}
          conScore={abilityMap.CON || 10}
          onRest={handleShortRest}
          onCancel={() => setShowShortRest(false)}
        />
      )}

      {/* Subclass Selection Modal */}
      <SubclassSelectModal
        show={showSubclassModal}
        className={overview.primary_class}
        subclasses={CLASSES.find(c => c.name === overview.primary_class)?.subclasses || []}
        onSelect={handleSubclassSelect}
        onClose={() => setShowSubclassModal(false)}
      />
    </div>
  );
}

// D&D 5e XP thresholds per level (index = level - 1)
const XP_THRESHOLDS = [0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000];

function getLevelFromXP(xp) {
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= XP_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

function XPProgress({ xp, level, onXPChange, locked }) {
  const currentThreshold = XP_THRESHOLDS[level - 1] || 0;
  const nextThreshold = level < 20 ? XP_THRESHOLDS[level] : XP_THRESHOLDS[19];
  const xpInLevel = xp - currentThreshold;
  const xpNeeded = nextThreshold - currentThreshold;
  const percent = level >= 20 ? 100 : xpNeeded > 0 ? Math.min(100, Math.max(0, (xpInLevel / xpNeeded) * 100)) : 0;

  return (
    <div className="mt-4 pt-4 border-t border-gold/10">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <label className="text-xs text-amber-200/50 font-display tracking-wider uppercase">Experience Points</label>
          {locked && <span className="text-[9px] text-red-400/50 border border-red-400/20 rounded px-1.5 py-0.5">DM Controlled</span>}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            className="input w-28 text-sm text-right"
            value={xp}
            onChange={e => onXPChange(Math.max(0, parseInt(e.target.value) || 0))}
            disabled={locked}
            title={locked ? 'XP is controlled by the DM during live sessions' : ''}
            style={locked ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          />
          {level < 20 && (
            <span className="text-xs text-amber-200/30">/ {nextThreshold.toLocaleString()} XP</span>
          )}
        </div>
      </div>
      <div className="h-2.5 rounded-full bg-[#0a0a10] border border-gold/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percent}%`,
            background: level >= 20 ? 'linear-gradient(90deg, #c9a84c, #fde68a)' : 'linear-gradient(90deg, #4a3d7a, #7c3aed)',
          }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-amber-200/25">{xp.toLocaleString()} XP</span>
        {level < 20 ? (
          <span className="text-[10px] text-amber-200/25">{Math.max(0, nextThreshold - xp).toLocaleString()} XP to level {level + 1}</span>
        ) : (
          <span className="text-[10px] text-gold/40">Max Level</span>
        )}
      </div>
    </div>
  );
}

function ShortRestModal({ overview, conScore, onRest, onCancel }) {
  const [diceToSpend, setDiceToSpend] = useState(0);
  const available = Math.max(0, overview.level - overview.hit_dice_used);
  const hitDie = overview.hit_dice_total?.replace(/^\d+/, '') || 'd10';
  const hitDieSize = parseInt(hitDie.replace('d', '')) || 10;
  const conMod = calcMod(conScore || 10);
  const avgPerDie = Math.max(1, Math.floor(hitDieSize / 2) + 1 + conMod);
  const expectedHeal = diceToSpend * avgPerDie;
  const hpMissing = Math.max(0, (overview.max_hp || 0) - (overview.current_hp || 0));

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <ModalPortal>
      <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="bg-[#14121c] border border-gold/30 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="font-display text-lg text-amber-100 mb-2">Short Rest</h3>
        <p className="text-sm text-amber-200/50 mb-4">
          Spend hit dice to recover HP. Each die rolls 1{hitDie} + CON ({modStr(conMod)}).
        </p>

        <div className="space-y-4">
          {/* HP Bar */}
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-amber-200/60">HP</span>
              <span className="text-amber-100 font-display">{overview.current_hp}{expectedHeal > 0 ? <span className="text-green-400"> +{Math.min(expectedHeal, hpMissing)} avg</span> : ''} / {overview.max_hp}</span>
            </div>
            <div className="h-2 bg-[#0a0a10] rounded-full overflow-hidden border border-amber-200/10">
              <div className="h-full rounded-full relative" style={{ width: `${Math.min(100, ((overview.current_hp + Math.min(expectedHeal, hpMissing)) / overview.max_hp) * 100)}%` }}>
                <div className="h-full bg-green-500/70 rounded-full" style={{ width: `${(overview.current_hp / (overview.current_hp + Math.min(expectedHeal, hpMissing) || 1)) * 100}%` }} />
                {expectedHeal > 0 && <div className="absolute right-0 top-0 h-full bg-green-400/30 rounded-r-full" style={{ width: `${(Math.min(expectedHeal, hpMissing) / (overview.current_hp + Math.min(expectedHeal, hpMissing))) * 100}%` }} />}
              </div>
            </div>
          </div>

          {/* Hit Dice Counter */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-amber-200/60">Hit Dice Available</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: overview.level }, (_, i) => (
                <div key={i} className={`w-3 h-3 rounded-sm ${i < available ? 'bg-gold/70' : 'bg-amber-200/10'}`} title={i < available ? 'Available' : 'Spent'} />
              ))}
              <span className="text-xs text-amber-200/40 ml-2">{available}/{overview.level}</span>
            </div>
          </div>

          {available > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-amber-200/60">Dice to Spend</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDiceToSpend(d => Math.max(0, d - 1))}
                    disabled={diceToSpend <= 0}
                    className="w-8 h-8 rounded-lg bg-[#0a0a10] border border-gold/20 text-gold font-bold text-lg flex items-center justify-center disabled:opacity-30 hover:border-gold/40 transition-all"
                  >−</button>
                  <span className="text-2xl font-display text-gold w-10 text-center">{diceToSpend}</span>
                  <button
                    onClick={() => setDiceToSpend(d => Math.min(available, d + 1))}
                    disabled={diceToSpend >= available}
                    className="w-8 h-8 rounded-lg bg-[#0a0a10] border border-gold/20 text-gold font-bold text-lg flex items-center justify-center disabled:opacity-30 hover:border-gold/40 transition-all"
                  >+</button>
                </div>
              </div>
              {diceToSpend > 0 && (
                <p className="text-xs text-green-400/70 bg-green-900/15 rounded p-2 text-center">
                  Rolling {diceToSpend}{hitDie} + {conMod >= 0 ? '+' : ''}{conMod} each — avg {expectedHeal} HP ({Math.min(expectedHeal, hpMissing)} effective)
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-amber-200/30 bg-amber-900/10 rounded p-2 text-center">
              No hit dice remaining — take a long rest to recover them.
            </p>
          )}

          {overview.primary_class === 'Warlock' && (
            <p className="text-xs text-purple-300/70 bg-purple-900/20 rounded p-2">
              Pact Magic spell slots will be fully restored.
            </p>
          )}
        </div>

        <div className="flex gap-3 justify-end mt-4">
          <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
          <button onClick={() => onRest(diceToSpend)} className="btn-primary text-sm" disabled={diceToSpend === 0 && overview.current_hp >= overview.max_hp}>
            {diceToSpend > 0 ? `Spend ${diceToSpend} ${diceToSpend === 1 ? 'Die' : 'Dice'} & Rest` : 'Rest'}
          </button>
        </div>
      </div>
      </div>
    </ModalPortal>
  );
}
