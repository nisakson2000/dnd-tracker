import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Plus, Trash2, ScrollText, RotateCcw, RefreshCw, Search, ChevronDown, ChevronUp, Pin, PinOff, Zap, ChevronsDown, ChevronsUp, Coffee, Moon, Clock, ArrowRight, Star, Eye, Shield, Lock, Filter, Pencil, Dices, BookOpen, Loader2, Library } from 'lucide-react';
import toast from 'react-hot-toast';
import MDEditor from '@uiw/react-md-editor';
import { getFeatures, addFeature, updateFeature, deleteFeature } from '../api/features';
import HelpTooltip from '../components/HelpTooltip';
import ConfirmDialog from '../components/ConfirmDialog';
import ModalPortal from '../components/ModalPortal';
import { HELP } from '../data/helpText';
import { CLASS_FEATURES } from '../data/classFeatures';
import { FEAT_CATALOG, FEAT_CATEGORIES } from '../data/featCatalog';
import { useAppMode } from '../contexts/ModeContext';
import { searchArticles } from '../api/wiki';
import { motion, AnimatePresence } from 'framer-motion';

const RECHARGE_OPTIONS = ['', 'short_rest', 'long_rest', 'dawn', 'recharge_5_6', 'recharge_6', 'manual'];
const RECHARGE_LABELS = { '': 'None', 'short_rest': 'Short Rest', 'long_rest': 'Long Rest', 'dawn': 'At Dawn', 'recharge_5_6': 'Recharge 5-6', 'recharge_6': 'Recharge 6', 'manual': 'Manual' };

const RECHARGE_BADGE_STYLES = {
  short_rest: 'bg-blue-500/15 text-blue-300 border-blue-400/25',
  long_rest: 'bg-purple-500/15 text-purple-300 border-purple-400/25',
  dawn: 'bg-amber-500/15 text-amber-200 border-amber-400/25',
  recharge_5_6: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/25',
  recharge_6: 'bg-teal-500/15 text-teal-300 border-teal-400/25',
  manual: 'bg-amber-200/5 text-amber-200/40 border-amber-200/10',
};

// Feature activation types
const ACTIVATION_TYPES = ['', 'action', 'bonus_action', 'reaction', 'passive', 'other'];
const ACTIVATION_LABELS = { '': 'Not set', 'action': 'Action', 'bonus_action': 'Bonus Action', 'reaction': 'Reaction', 'passive': 'Passive', 'other': 'Other' };

/* Level badge color tiers */
function levelBadgeColors(level) {
  if (level <= 0) return '';
  if (level <= 4) return 'bg-stone-500/20 text-stone-300 border-stone-400/30';
  if (level <= 8) return 'bg-green-500/20 text-green-300 border-green-400/30';
  if (level <= 12) return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
  if (level <= 16) return 'bg-purple-500/20 text-purple-300 border-purple-400/30';
  return 'bg-amber-500/20 text-amber-200 border-amber-400/30';
}

/* Pin helpers */
function getPinned(characterId) {
  try {
    const raw = localStorage.getItem(`features_pinned_${characterId}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function setPinnedStorage(characterId, ids) {
  localStorage.setItem(`features_pinned_${characterId}`, JSON.stringify(ids));
}

/* Classify a feature as active/passive/reaction for filtering */
function classifyFeature(f) {
  if (f.activation === 'passive') return 'passive';
  if (f.activation === 'reaction') return 'reaction';
  if (f.activation && f.activation !== '') return 'active';
  // Heuristic: if it has charges it's active
  if ((f.uses_total ?? 0) > 0) return 'active';
  // If no activation set and no charges, treat as passive
  if (!f.activation && !f.recharge && (f.uses_total ?? 0) === 0) return 'passive';
  return 'active';
}

export default function Features({ characterId, character }) {
  const { mode: appMode } = useAppMode();
  const isDM = appMode === 'dm';
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [sourceFilter, setSourceFilter] = useState('all');
  const [activationFilter, setActivationFilter] = useState('all');
  const [rechargeFilter, setRechargeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [pinnedIds, setPinnedIds] = useState([]);
  const [allExpanded, setAllExpanded] = useState(null);
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [showProgression, setShowProgression] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [restoredIds, setRestoredIds] = useState(new Set());
  const [showFeatBrowser, setShowFeatBrowser] = useState(false);
  const [featSearch, setFeatSearch] = useState('');
  const [featCategory, setFeatCategory] = useState('all');

  // Usage history (session-based)
  const historyKey = `codex_feature_history_${characterId}`;
  const [usageHistory, setUsageHistory] = useState(() => {
    try {
      const stored = sessionStorage.getItem(historyKey);
      return stored ? JSON.parse(stored) : {};
    } catch { return {}; }
  });

  useEffect(() => {
    sessionStorage.setItem(historyKey, JSON.stringify(usageHistory));
  }, [usageHistory, historyKey]);

  // Refresh time-ago display every 30s
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  const load = async () => {
    try {
      const data = await getFeatures(characterId);
      setFeatures(data);
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [characterId]);
  useEffect(() => { setPinnedIds(getPinned(characterId)); }, [characterId]);

  const togglePin = (featureId) => {
    setPinnedIds(prev => {
      const next = prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId];
      setPinnedStorage(characterId, next);
      return next;
    });
  };

  const handleAdd = async (data) => {
    try {
      await addFeature(characterId, { ...data, uses_remaining: data.uses_total ?? 0 });
      toast.success('Feature added');
      setShowAdd(false);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFeature(characterId, id);
      toast.success('Feature removed');
      setConfirmDelete(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleEdit = async (data) => {
    if (!editingFeature) return;
    try {
      // Preserve uses_remaining and pinned state — only update editable fields
      const updated = {
        ...editingFeature,
        name: data.name,
        source: data.source,
        source_level: data.source_level,
        feature_type: data.feature_type,
        description: data.description,
        uses_total: data.uses_total,
        recharge: data.recharge,
        activation: data.activation,
        // If uses_total decreased below current remaining, clamp remaining
        uses_remaining: Math.min(editingFeature.uses_remaining ?? 0, data.uses_total ?? 0),
      };
      await updateFeature(characterId, editingFeature.id, updated);
      toast.success('Feature updated');
      setEditingFeature(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const spendCharge = async (feature) => {
    if ((feature.uses_remaining ?? 0) <= 0) {
      toast.error(`No uses left for ${feature.name || 'this feature'}`);
      return;
    }
    const updated = { ...feature, uses_remaining: (feature.uses_remaining ?? 0) - 1 };
    setFeatures(prev => prev.map(f => f.id === feature.id ? updated : f));
    // Track usage history
    setUsageHistory(prev => ({
      ...prev,
      [feature.id]: [...(prev[feature.id] || []), { ts: Date.now(), action: 'used' }].slice(-10),
    }));
    try {
      await updateFeature(characterId, feature.id, updated);
    } catch (err) { toast.error(err.message); load(); }
  };

  const restoreCharge = async (feature) => {
    if ((feature.uses_remaining ?? 0) >= (feature.uses_total ?? 0)) return;
    const updated = { ...feature, uses_remaining: (feature.uses_remaining ?? 0) + 1 };
    setFeatures(prev => prev.map(f => f.id === feature.id ? updated : f));
    try {
      await updateFeature(characterId, feature.id, updated);
    } catch (err) { toast.error(err.message); load(); }
  };

  const restoreAll = async (feature) => {
    const updated = { ...feature, uses_remaining: feature.uses_total ?? 0 };
    setFeatures(prev => prev.map(f => f.id === feature.id ? updated : f));
    try {
      await updateFeature(characterId, feature.id, updated);
      toast.success('Uses restored');
    } catch (err) { toast.error(err.message); load(); }
  };

  const rollRecharge = async (feature) => {
    if ((feature.uses_total ?? 0) <= 0) return;
    const roll = Math.floor(Math.random() * 6) + 1;
    const threshold = feature.recharge === 'recharge_6' ? 6 : 5;
    const label = feature.recharge === 'recharge_6' ? '6' : '5-6';
    if (roll >= threshold) {
      const updated = { ...feature, uses_remaining: feature.uses_total };
      setFeatures(prev => prev.map(f => f.id === feature.id ? updated : f));
      try {
        await updateFeature(characterId, feature.id, updated);
        toast.success(`${feature.name}: Rolled ${roll} — Recharged! (needed ${label})`, { duration: 4000 });
      } catch (err) { toast.error(err.message); load(); }
    } else {
      toast(`${feature.name}: Rolled ${roll} — No recharge (needed ${label})`, { icon: '\uD83C\uDFB2', duration: 4000 });
    }
  };

  const flashRestored = (ids) => {
    setRestoredIds(new Set(ids));
    setTimeout(() => setRestoredIds(new Set()), 1200);
  };

  const restoreAllFeatures = async () => {
    const targets = features.filter(f => (f.uses_total ?? 0) > 0 && (f.uses_remaining ?? 0) < (f.uses_total ?? 0));
    if (targets.length === 0) return;
    setFeatures(prev => prev.map(f => (f.uses_total ?? 0) > 0 ? { ...f, uses_remaining: f.uses_total } : f));
    flashRestored(targets.map(f => f.id));
    try {
      await Promise.all(targets.map(f => updateFeature(characterId, f.id, { ...f, uses_remaining: f.uses_total })));
      toast.success('All uses restored');
    } catch (err) { toast.error(err.message); load(); }
  };

  const shortRestRestore = async () => {
    // Short rest only restores features with recharge "short_rest" — long_rest features wait for long rest
    const targets = features.filter(f =>
      (f.uses_total ?? 0) > 0 &&
      (f.uses_remaining ?? 0) < (f.uses_total ?? 0) &&
      f.recharge === 'short_rest'
    );
    if (targets.length === 0) { toast('No features to restore on short rest', { icon: '\u2139\uFE0F' }); return; }
    const names = targets.map(f => f.name).filter(Boolean);
    setFeatures(prev => prev.map(f =>
      (f.uses_total ?? 0) > 0 && f.recharge === 'short_rest'
        ? { ...f, uses_remaining: f.uses_total } : f
    ));
    flashRestored(targets.map(f => f.id));
    try {
      await Promise.all(targets.map(f => updateFeature(characterId, f.id, { ...f, uses_remaining: f.uses_total })));
      const nameList = names.length <= 3 ? names.join(', ') : `${names.length} features`;
      toast.success(`Short rest: ${nameList} restored`);
    } catch (err) { toast.error(err.message); load(); }
  };

  const longRestRestore = async () => {
    // Long rest restores ALL features to max charges (except d6 recharge — those need a roll)
    const targets = features.filter(f =>
      (f.uses_total ?? 0) > 0 &&
      (f.uses_remaining ?? 0) < (f.uses_total ?? 0) &&
      f.recharge !== 'recharge_5_6' && f.recharge !== 'recharge_6'
    );
    if (targets.length === 0) { toast('No features to restore on long rest', { icon: '\u2139\uFE0F' }); return; }
    setFeatures(prev => prev.map(f =>
      (f.uses_total ?? 0) > 0 && f.recharge !== 'recharge_5_6' && f.recharge !== 'recharge_6' ? { ...f, uses_remaining: f.uses_total } : f
    ));
    flashRestored(targets.map(f => f.id));
    // Clear usage history on long rest
    setUsageHistory({});
    try {
      await Promise.all(targets.map(f => updateFeature(characterId, f.id, { ...f, uses_remaining: f.uses_total })));
      toast.success('Long rest: All features restored');
    } catch (err) { toast.error(err.message); load(); }
  };

  const shortRestCount = features.filter(f =>
    (f.uses_total ?? 0) > 0 && (f.uses_remaining ?? 0) < (f.uses_total ?? 0) &&
    f.recharge === 'short_rest'
  ).length;
  const longRestCount = features.filter(f =>
    (f.uses_total ?? 0) > 0 && (f.uses_remaining ?? 0) < (f.uses_total ?? 0) &&
    f.recharge !== 'recharge_5_6' && f.recharge !== 'recharge_6'
  ).length;

  const useAllFeatures = async () => {
    const targets = features.filter(f => (f.uses_total ?? 0) > 0 && (f.uses_remaining ?? 0) > 0);
    if (targets.length === 0) return;
    setFeatures(prev => prev.map(f => (f.uses_total ?? 0) > 0 ? { ...f, uses_remaining: 0 } : f));
    try {
      await Promise.all(targets.map(f => updateFeature(characterId, f.id, { ...f, uses_remaining: 0 })));
      toast.success('All uses spent');
    } catch (err) { toast.error(err.message); load(); }
  };

  const hasChargeFeatures = features.some(f => (f.uses_total ?? 0) > 0);

  // Category counts
  const activeCt = features.filter(f => classifyFeature(f) === 'active').length;
  const passiveCt = features.filter(f => classifyFeature(f) === 'passive').length;
  const reactionCt = features.filter(f => classifyFeature(f) === 'reaction').length;

  const filtered = useMemo(() => {
    // Source filter (by feature type: class, racial, feat, subclass, background)
    let result = sourceFilter === 'all' ? features : features.filter(f => f.feature_type === sourceFilter);

    // Active/passive/reaction filter
    if (activationFilter !== 'all') {
      result = result.filter(f => classifyFeature(f) === activationFilter);
    }

    // Recharge type filter
    if (rechargeFilter !== 'all') {
      if (rechargeFilter === 'none') {
        result = result.filter(f => !f.recharge);
      } else {
        result = result.filter(f => f.recharge === rechargeFilter);
      }
    }

    // Search by name, description, AND source
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(f =>
        (f.name || '').toLowerCase().includes(q) ||
        (f.description || '').toLowerCase().includes(q) ||
        (f.source || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [features, sourceFilter, activationFilter, rechargeFilter, search]);

  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    // Pinned always come first
    const aPinned = pinnedIds.includes(a.id) ? 0 : 1;
    const bPinned = pinnedIds.includes(b.id) ? 0 : 1;
    if (aPinned !== bPinned) return aPinned - bPinned;

    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    if (sortBy === 'type') {
      const order = { class: 0, subclass: 1, racial: 2, feat: 3, background: 4 };
      return (order[a.feature_type] ?? 9) - (order[b.feature_type] ?? 9);
    }
    if (sortBy === 'uses') return (a.uses_remaining ?? 0) - (b.uses_remaining ?? 0);
    return 0;
  }), [filtered, sortBy, pinnedIds]);

  /* Group features by source for grouped display */
  const grouped = useMemo(() => {
    const pinnedFeatures = sorted.filter(f => pinnedIds.includes(f.id));
    const unpinnedGroups = {};
    sorted.filter(f => !pinnedIds.includes(f.id)).forEach(f => {
      const key = f.source?.trim() || 'Other';
      if (!unpinnedGroups[key]) unpinnedGroups[key] = [];
      unpinnedGroups[key].push(f);
    });
    const result = [];
    if (pinnedFeatures.length > 0) {
      result.push({ key: '__pinned__', label: 'Pinned', features: pinnedFeatures, isPinned: true });
    }
    Object.keys(unpinnedGroups).sort().forEach(key => {
      result.push({ key, label: key, features: unpinnedGroups[key], isPinned: false });
    });
    return result;
  }, [sorted, pinnedIds]);

  const toggleGroup = (key) => {
    setCollapsedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAllDescriptions = () => {
    setAllExpanded(prev => prev === true ? false : true);
  };

  // Class feature progression from classFeatures.js
  const charClass = character?.primary_class || '';
  const charLevel = character?.level || 0;

  const upcomingFeatures = useMemo(() => {
    if (!charClass || !charLevel || charLevel >= 20) return [];
    const classData = CLASS_FEATURES[charClass];
    if (!classData) return [];
    const upcoming = [];
    const levels = Object.keys(classData).map(Number).sort((a, b) => a - b);
    let count = 0;
    for (const lvl of levels) {
      if (lvl > charLevel && count < 3) {
        upcoming.push({ level: lvl, features: classData[lvl] });
        count++;
      }
    }
    return upcoming;
  }, [charClass, charLevel]);

  const currentLevelFeatures = useMemo(() => {
    if (!charClass || !charLevel) return [];
    const classData = CLASS_FEATURES[charClass];
    if (!classData) return [];
    return classData[charLevel] || [];
  }, [charClass, charLevel]);

  if (loading) return (
    <div className="flex items-center justify-center gap-2 py-12 text-amber-200/40">
      <Loader2 size={18} className="animate-spin" />
      <span>Loading features...</span>
    </div>
  );

  return (
    <div className="space-y-6 max-w-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display text-amber-100 flex items-center gap-2">
          <ScrollText size={20} />
          <div>
            <span>Features & Traits<HelpTooltip text={HELP.feat} /></span>
            <p className="text-xs text-amber-200/40 font-normal mt-0.5">Your class features, racial traits, and feats. Track limited-use abilities with the charge system.</p>
          </div>
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFeatBrowser(true)} className="btn-secondary text-xs flex items-center gap-1">
            <Library size={12} /> Browse Feats
          </button>
          {isDM && (
            <button onClick={() => setShowAdd(true)} className="btn-primary text-xs flex items-center gap-1">
              <Plus size={12} /> Add Feature
            </button>
          )}
        </div>
      </div>

      {/* Rest Buttons — prominent */}
      {hasChargeFeatures && (
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={shortRestRestore}
            className="px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/25 hover:border-blue-400/40 text-blue-300 text-sm font-medium transition-all flex items-center gap-2 active:scale-[0.97]"
            title="Restore features that recharge on short or long rest"
          >
            <Coffee size={14} />
            Short Rest
            {shortRestCount > 0 && <span className="text-[10px] bg-blue-500/25 text-blue-200 px-1.5 py-0.5 rounded-full font-semibold">{shortRestCount}</span>}
          </button>
          <button
            onClick={longRestRestore}
            className="px-4 py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-400/25 hover:border-purple-400/40 text-purple-300 text-sm font-medium transition-all flex items-center gap-2 active:scale-[0.97]"
            title="Restore ALL features to max charges"
          >
            <Moon size={14} />
            Long Rest
            {longRestCount > 0 && <span className="text-[10px] bg-purple-500/25 text-purple-200 px-1.5 py-0.5 rounded-full font-semibold">{longRestCount}</span>}
          </button>
          <div className="h-5 w-px bg-amber-200/10" />
          <button onClick={restoreAllFeatures} className="btn-secondary text-xs flex items-center gap-1">
            <RotateCcw size={11} /> Restore All
          </button>
          <button onClick={useAllFeatures} className="btn-secondary text-xs flex items-center gap-1">
            Use All
          </button>
        </div>
      )}

      {/* Category Summary */}
      {features.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap text-xs">
          <span className="text-blue-300 bg-blue-500/10 border border-blue-400/20 px-2.5 py-1 rounded">
            {features.filter(f => f.feature_type === 'class').length} Class Features
          </span>
          <span className="text-emerald-300 bg-emerald-500/10 border border-emerald-400/20 px-2.5 py-1 rounded">
            {features.filter(f => f.feature_type === 'racial').length} Racial Traits
          </span>
          <span className="text-purple-300 bg-purple-500/10 border border-purple-400/20 px-2.5 py-1 rounded">
            {features.filter(f => f.feature_type === 'feat').length} Feats
          </span>
          {features.some(f => f.feature_type === 'subclass') && (
            <span className="text-indigo-300 bg-indigo-500/10 border border-indigo-400/20 px-2.5 py-1 rounded">
              {features.filter(f => f.feature_type === 'subclass').length} Subclass
            </span>
          )}
          {features.some(f => f.feature_type === 'background') && (
            <span className="text-rose-300 bg-rose-500/10 border border-rose-400/20 px-2.5 py-1 rounded">
              {features.filter(f => f.feature_type === 'background').length} Background
            </span>
          )}
          <div className="h-4 w-px bg-amber-200/10" />
          {activeCt > 0 && (
            <span className="text-orange-300 bg-orange-500/10 border border-orange-400/20 px-2.5 py-1 rounded flex items-center gap-1">
              <Zap size={9} /> {activeCt} Active
            </span>
          )}
          {passiveCt > 0 && (
            <span className="text-cyan-300 bg-cyan-500/10 border border-cyan-400/20 px-2.5 py-1 rounded flex items-center gap-1">
              <Eye size={9} /> {passiveCt} Passive
            </span>
          )}
          {reactionCt > 0 && (
            <span className="text-sky-300 bg-sky-500/10 border border-sky-400/20 px-2.5 py-1 rounded flex items-center gap-1">
              <Shield size={9} /> {reactionCt} Reaction
            </span>
          )}
          <div className="h-4 w-px bg-amber-200/10" />
          <span className="text-gold bg-gold/10 border border-gold/20 px-2.5 py-1 rounded">
            {features.filter(f => (f.uses_total ?? 0) > 0).length} with charges
          </span>
          {pinnedIds.length > 0 && (
            <span className="text-amber-300 bg-amber-500/10 border border-amber-400/20 px-2.5 py-1 rounded flex items-center gap-1">
              <Pin size={9} /> {pinnedIds.length} pinned
            </span>
          )}
        </div>
      )}

      {/* Search + Filter + Sort */}
      <div className="space-y-3">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-amber-200/30" />
            <input
              type="text"
              placeholder="Search name, description, source..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input text-xs pl-7 pr-3 py-1 w-56"
            />
          </div>
          {/* Source filter dropdown */}
          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
            className="input text-xs px-2.5 py-1 rounded"
          >
            <option value="all">All Sources</option>
            <option value="class">Class</option>
            <option value="racial">Race</option>
            <option value="feat">Feat</option>
            <option value="subclass">Subclass</option>
            <option value="background">Background</option>
          </select>
          {/* Active/Passive/Reaction filter */}
          <div className="flex gap-1">
            {['all', 'active', 'passive', 'reaction'].map(af => (
              <button key={af} onClick={() => setActivationFilter(af)}
                className={`text-xs px-2 py-1 rounded capitalize ${activationFilter === af ? 'bg-purple-900/30 text-purple-300 border border-purple-500/20' : 'text-amber-200/30 border border-amber-200/10'}`}>
                {af === 'all' ? 'All Types' : af}
              </button>
            ))}
          </div>
          {/* Toggle advanced filters */}
          <button
            onClick={() => setShowFilters(p => !p)}
            className={`text-xs px-2.5 py-1 rounded flex items-center gap-1 transition-colors ${showFilters ? 'bg-gold/20 text-gold border border-gold/30' : 'text-amber-200/40 border border-amber-200/10 hover:text-amber-200/60'}`}
          >
            <Filter size={10} /> More
          </button>
          <div className="flex items-center gap-1.5 ml-auto">
            {/* Class Feature Progression toggle */}
            {charClass && CLASS_FEATURES[charClass] && charLevel > 0 && charLevel < 20 && (
              <button
                onClick={() => setShowProgression(prev => !prev)}
                className={`text-xs px-2.5 py-1 rounded border transition-all flex items-center gap-1 ${
                  showProgression ? 'bg-gold/15 border-gold/30 text-gold' : 'bg-amber-200/5 text-amber-200/40 border-amber-200/10 hover:text-amber-200/70'
                }`}
                title="Show upcoming class features"
              >
                <Star size={10} /> Progression
              </button>
            )}
            {/* Expand/Collapse All descriptions */}
            {features.length > 0 && (
              <button
                onClick={toggleAllDescriptions}
                className="text-xs px-2.5 py-1 rounded bg-amber-200/5 text-amber-200/40 border border-amber-200/10 hover:text-amber-200/70 hover:border-amber-200/20 transition-colors flex items-center gap-1"
                title={allExpanded === true ? 'Collapse all descriptions' : 'Expand all descriptions'}
              >
                {allExpanded === true ? <><ChevronsUp size={11} /> Collapse All</> : <><ChevronsDown size={11} /> Expand All</>}
              </button>
            )}
            <span className="text-xs text-amber-200/40 ml-2">Sort:</span>
            {[['name', 'Name A-Z'], ['type', 'Type'], ['uses', 'Uses Left']].map(([key, label]) => (
              <button key={key} onClick={() => setSortBy(key)}
                className={`text-xs px-2.5 py-1 rounded ${sortBy === key ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-amber-200/5 text-amber-200/40 border border-amber-200/10'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced filters row */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <div className="flex items-center gap-4 flex-wrap pl-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-amber-200/30 uppercase tracking-wider">Recharge:</span>
                  {['all', 'short_rest', 'long_rest', 'dawn', 'recharge_5_6', 'recharge_6', 'none'].map(r => (
                    <button key={r} onClick={() => setRechargeFilter(r)}
                      className={`text-xs px-2.5 py-1 rounded ${rechargeFilter === r ? 'bg-gold/20 text-gold border border-gold/30' : 'text-amber-200/40 border border-amber-200/10'}`}>
                      {r === 'all' ? 'All' : r === 'none' ? 'No Recharge' : RECHARGE_LABELS[r] || r}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Class Feature Progression Panel */}
      {showProgression && charClass && CLASS_FEATURES[charClass] && (
        <div className="card bg-gradient-to-r from-[#14121c] to-[#1a1520] border-gold/20">
          <div className="flex items-center gap-2 mb-3">
            <Star size={14} className="text-gold" />
            <h3 className="font-display text-amber-100 text-sm">
              {charClass} Feature Progression
            </h3>
            <span className="text-xs text-amber-200/40">(Level {charLevel})</span>
          </div>
          {/* Current level features */}
          {currentLevelFeatures.length > 0 && (
            <div className="mb-3">
              <div className="text-[10px] uppercase tracking-wider text-emerald-400/70 font-semibold mb-1.5">Current Level</div>
              {currentLevelFeatures.map((f, i) => (
                <div key={i} className="flex items-start gap-2 mb-1.5 bg-emerald-950/20 border border-emerald-500/15 rounded p-2">
                  <span className="text-xs font-bold text-emerald-300 bg-emerald-900/30 px-1.5 py-0.5 rounded flex-shrink-0">Lv{charLevel}</span>
                  <div>
                    <span className="text-xs text-amber-100 font-medium">{f.name}</span>
                    <p className="text-xs text-amber-200/50">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Upcoming features */}
          {upcomingFeatures.length > 0 ? (
            <div>
              <div className="text-[10px] uppercase tracking-wider text-amber-200/40 font-semibold mb-1.5">Coming Up</div>
              <div className="space-y-1.5">
                {upcomingFeatures.map(({ level, features: feats }) => (
                  feats.map((f, i) => (
                    <div key={`${level}-${i}`} className="flex items-start gap-2 opacity-60">
                      <Lock size={10} className="text-amber-200/25 mt-1 flex-shrink-0" />
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded border flex-shrink-0 ${levelBadgeColors(level)}`}>Lv{level}</span>
                      <div>
                        <span className="text-xs text-amber-100 font-medium">{f.name}</span>
                        <p className="text-xs text-amber-200/40 line-clamp-2">{f.description}</p>
                      </div>
                    </div>
                  ))
                ))}
              </div>
              <p className="text-xs text-amber-200/20 text-center italic mt-3">
                Currently Level {charLevel} {charClass} — keep adventuring!
              </p>
            </div>
          ) : (
            <p className="text-xs text-amber-200/30">No upcoming features — you have reached the pinnacle!</p>
          )}
        </div>
      )}

      {/* Feature List -- Grouped by Source */}
      {filtered.length === 0 ? (
        <div className="card border-dashed border-amber-200/10 text-center py-12">
          <ScrollText size={32} className="mx-auto text-amber-200/15 mb-3" />
          <p className="text-sm text-amber-200/30 mb-1">No features yet — add class features, racial traits, or feats</p>
          <p className="text-xs text-amber-200/20">Check your class description for what you start with at level 1</p>
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map(group => (
            <div key={group.key}>
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.key)}
                className="w-full flex items-center gap-2 mb-2 group cursor-pointer"
              >
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  group.isPinned
                    ? 'bg-amber-500/10 text-amber-300 border border-amber-400/20'
                    : 'bg-amber-200/5 text-amber-200/50 border border-amber-200/10'
                } group-hover:border-amber-200/30`}>
                  {group.isPinned && <Pin size={10} />}
                  {collapsedGroups[group.key] ? <ChevronDown size={11} /> : <ChevronUp size={11} />}
                  {group.label}
                  <span className="text-amber-200/30 font-normal">({group.features.length})</span>
                  {/* Charges at-a-glance when group is collapsed */}
                  {collapsedGroups[group.key] && (() => {
                    const chargeFeatures = group.features.filter(gf => (gf.uses_total ?? 0) > 0);
                    if (chargeFeatures.length === 0) return null;
                    const totalRemaining = chargeFeatures.reduce((sum, gf) => sum + (gf.uses_remaining ?? 0), 0);
                    const totalMax = chargeFeatures.reduce((sum, gf) => sum + (gf.uses_total ?? 0), 0);
                    return (
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                        totalRemaining === 0
                          ? 'bg-red-500/15 text-red-400 border border-red-400/20'
                          : totalRemaining < totalMax
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-400/20'
                            : 'bg-gold/10 text-gold/70 border border-gold/20'
                      }`}>
                        {totalRemaining}/{totalMax} charges
                      </span>
                    );
                  })()}
                </div>
                <div className="flex-1 h-px bg-amber-200/8" />
              </button>
              {/* Group Content */}
              {!collapsedGroups[group.key] && (
                <div className="space-y-3">
                  {group.features.map(f => (
                    <FeatureCard
                      key={f.id}
                      feature={f}
                      isPinned={pinnedIds.includes(f.id)}
                      isRestored={restoredIds.has(f.id)}
                      onTogglePin={() => togglePin(f.id)}
                      onUseCharge={() => spendCharge(f)}
                      onRestoreCharge={() => restoreCharge(f)}
                      onRestoreAll={() => restoreAll(f)}
                      onRollRecharge={() => rollRecharge(f)}
                      onEdit={isDM ? () => setEditingFeature(f) : undefined}
                      onDelete={isDM ? () => setConfirmDelete(f) : undefined}
                      allExpanded={allExpanded}
                      lastUsed={usageHistory[f.id]?.slice(-1)[0]?.ts}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            <FeatureForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />
          </motion.div>
        )}
      </AnimatePresence>
      {editingFeature && <FeatureForm initialData={editingFeature} onSubmit={handleEdit} onCancel={() => setEditingFeature(null)} />}

      <ConfirmDialog
        show={!!confirmDelete}
        title="Delete Feature?"
        message={`Remove "${confirmDelete?.name}"? This cannot be undone.`}
        onConfirm={() => handleDelete(confirmDelete.id)}
        onCancel={() => setConfirmDelete(null)}
      />

      {/* ── Feat Browser Modal ── */}
      {showFeatBrowser && (
        <ModalPortal>
          <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowFeatBrowser(false)}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', maxWidth: 680, maxHeight: '80vh', display: 'flex', flexDirection: 'column', borderRadius: 16, overflow: 'hidden', background: 'rgba(14,12,24,0.97)', border: '1px solid rgba(201,168,76,0.22)', boxShadow: '0 40px 100px rgba(0,0,0,0.85)' }}
            >
              {/* Header */}
              <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <h3 className="font-display text-amber-100 text-lg flex items-center gap-2">
                    <Library size={18} /> Feat Catalog
                  </h3>
                  <button onClick={() => setShowFeatBrowser(false)} className="text-amber-200/30 hover:text-amber-200/70" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <span style={{ fontSize: 20 }}>&times;</span>
                  </button>
                </div>
                {/* Search */}
                <div style={{ position: 'relative', marginBottom: 10 }}>
                  <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(200,175,130,0.3)' }} />
                  <input
                    className="input w-full"
                    style={{ paddingLeft: 34 }}
                    placeholder="Search feats by name or description..."
                    value={featSearch}
                    onChange={e => setFeatSearch(e.target.value)}
                    autoFocus
                  />
                </div>
                {/* Category filters */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setFeatCategory('all')}
                    className={`text-xs px-3 py-1 rounded ${featCategory === 'all' ? 'bg-gold/20 text-gold border border-gold/30' : 'text-amber-200/40 border border-amber-200/10'}`}
                  >
                    All ({FEAT_CATALOG.length})
                  </button>
                  {FEAT_CATEGORIES.map(cat => {
                    const count = FEAT_CATALOG.filter(f => f.category === cat).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => setFeatCategory(cat)}
                        className={`text-xs px-3 py-1 rounded ${featCategory === cat ? 'bg-gold/20 text-gold border border-gold/30' : 'text-amber-200/40 border border-amber-200/10'}`}
                      >
                        {cat} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feat list (scrollable) */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
                {FEAT_CATALOG
                  .filter(f => {
                    const matchCat = featCategory === 'all' || f.category === featCategory;
                    const matchSearch = !featSearch.trim() ||
                      f.name.toLowerCase().includes(featSearch.toLowerCase()) ||
                      f.description.toLowerCase().includes(featSearch.toLowerCase());
                    return matchCat && matchSearch;
                  })
                  .map(feat => {
                    const alreadyHas = features.some(f => f.name === feat.name && f.feature_type === 'feat');
                    return (
                      <div
                        key={feat.id}
                        style={{
                          padding: '10px 20px',
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          opacity: alreadyHas ? 0.5 : 1,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 13, color: '#f0e4c8', fontWeight: 600 }}>
                            {feat.name}
                          </span>
                          <span style={{
                            fontSize: 9, padding: '1px 6px', borderRadius: 4,
                            background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)',
                            color: 'rgba(201,168,76,0.5)', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em',
                          }}>
                            {feat.category}
                          </span>
                          {feat.prerequisite && (
                            <span style={{ fontSize: 10, color: 'rgba(248,113,113,0.6)', fontStyle: 'italic' }}>
                              Req: {feat.prerequisite}
                            </span>
                          )}
                          <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
                            {alreadyHas ? (
                              <span style={{ fontSize: 10, color: 'rgba(74,222,128,0.6)', display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Eye size={10} /> Already added
                              </span>
                            ) : (
                              <button
                                onClick={async () => {
                                  try {
                                    await addFeature(characterId, {
                                      name: feat.name,
                                      description: feat.description,
                                      feature_type: 'feat',
                                      source: feat.source || 'PHB',
                                      source_level: 0,
                                      uses_total: 0,
                                      uses_remaining: 0,
                                      recharge: '',
                                    });
                                    toast.success(`${feat.name} added!`);
                                    load();
                                  } catch (err) { toast.error(err.message); }
                                }}
                                className="btn-primary text-xs flex items-center gap-1"
                                style={{ padding: '3px 10px' }}
                              >
                                <Plus size={11} /> Add
                              </button>
                            )}
                          </div>
                        </div>
                        <div style={{ fontSize: 12, color: 'rgba(200,175,130,0.5)', lineHeight: 1.5 }}>
                          {feat.description}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}

/* --- Wiki Lookup Tooltip --- */
function WikiLookup({ featureName }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (open) { setOpen(false); return; }
    setOpen(true);
    if (searched) return;
    setLoading(true);
    try {
      const results = await searchArticles(featureName);
      setResult(results && results.length > 0 ? results[0] : null);
    } catch {
      setResult(null);
    }
    setLoading(false);
    setSearched(true);
  };

  return (
    <span className="relative inline-flex items-center" ref={ref}>
      <button
        type="button"
        onClick={handleClick}
        className="text-amber-200/20 hover:text-amber-300/70 transition-colors focus:outline-none"
        aria-label={`Look up ${featureName} in wiki`}
        title="Wiki lookup"
      >
        <BookOpen size={12} />
      </button>
      {open && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 px-3 py-2.5 text-xs text-amber-100 bg-[#1a1825] border border-gold/30 rounded-lg shadow-xl leading-relaxed">
          {loading ? (
            <div className="flex items-center gap-2 text-amber-200/50">
              <Loader2 size={12} className="animate-spin" /> Searching wiki...
            </div>
          ) : result ? (
            <div>
              <div className="font-semibold text-amber-100 mb-1">{result.title}</div>
              {result.category && (
                <span className="text-[10px] text-amber-200/40 mb-1 block">{result.category}</span>
              )}
              <p className="text-amber-200/70 leading-relaxed">{result.summary}</p>
            </div>
          ) : (
            <span className="text-amber-200/40">No wiki article found.</span>
          )}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gold/30" />
        </div>
      )}
    </span>
  );
}

/* --- Feature Card --- */
function FeatureCard({ feature: f, isPinned, isRestored, onTogglePin, onUseCharge, onRestoreCharge, onRestoreAll, onRollRecharge, onEdit, onDelete, allExpanded, lastUsed }) {
  const hasCharges = (f.uses_total ?? 0) > 0;
  const remaining = f.uses_remaining ?? 0;
  const total = f.uses_total ?? 0;
  const usesHighCount = total >= 5;
  const isEmpty = remaining === 0 && hasCharges;
  const category = classifyFeature(f);
  const isPassive = category === 'passive';
  const activationIcon = f.activation === 'action' ? <Zap size={10} />
    : f.activation === 'bonus_action' ? <ArrowRight size={10} />
    : f.activation === 'reaction' ? <Shield size={10} />
    : f.activation === 'passive' ? <Eye size={10} />
    : null;

  // Format last used time (avoid Date.now() during render)
  const [nowTs, setNowTs] = useState(() => Date.now());
  useEffect(() => {
    if (!lastUsed) return;
    const id = setInterval(() => setNowTs(Date.now()), 30000);
    return () => clearInterval(id);
  }, [lastUsed]);
  const lastUsedStr = lastUsed ? (() => {
    const diff = nowTs - lastUsed;
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  })() : null;

  const restoredGlow = isRestored ? 'ring-2 ring-green-400/40 transition-all duration-500' : '';

  return (
    <div className={`card ${hasCharges && remaining === 1 ? 'animate-amber-pulse' : ''} ${isPinned ? 'border-amber-400/25' : ''} ${isPassive ? 'border-l-2 border-l-cyan-500/30' : ''} ${restoredGlow}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Pin button */}
            <button
              onClick={onTogglePin}
              className={`flex-shrink-0 transition-colors ${isPinned ? 'text-amber-400' : 'text-amber-200/15 hover:text-amber-200/40'}`}
              title={isPinned ? 'Unpin feature' : 'Pin to top'}
            >
              {isPinned ? <Pin size={13} /> : <PinOff size={13} />}
            </button>
            <h4 className="text-amber-100 font-medium">{f.name || 'Unnamed Feature'}</h4>
            {f.name && <WikiLookup featureName={f.name} />}
            {/* Level badge */}
            {f.source_level > 0 && (
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${levelBadgeColors(f.source_level)}`}
                    title={`Gained at level ${f.source_level}`}>
                Lv {f.source_level}
              </span>
            )}
            {/* Activation type badge */}
            {f.activation && f.activation !== '' && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded border flex items-center gap-1 font-medium ${
                f.activation === 'passive'
                  ? 'bg-cyan-500/10 text-cyan-300 border-cyan-400/20'
                  : f.activation === 'reaction'
                    ? 'bg-sky-500/10 text-sky-300 border-sky-400/20'
                    : 'bg-orange-500/10 text-orange-300 border-orange-400/20'
              }`}>
                {activationIcon}
                {ACTIVATION_LABELS[f.activation] || f.activation}
              </span>
            )}
            {/* Passive "always on" for features without explicit activation */}
            {!f.activation && category === 'passive' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded border bg-stone-500/10 text-stone-400 border-stone-400/20 flex items-center gap-1">
                <Eye size={8} /> Always On
              </span>
            )}
            {/* Recharge badge — color-coded */}
            {f.recharge && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded border flex items-center gap-1 font-medium ${RECHARGE_BADGE_STYLES[f.recharge] || 'bg-amber-200/5 text-amber-200/40 border-amber-200/10'}`}>
                <RefreshCw size={8} />
                {RECHARGE_LABELS[f.recharge] || f.recharge}
              </span>
            )}
            {/* Charges badge */}
            {hasCharges && (
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                remaining === 0
                  ? 'bg-red-500/15 text-red-400 border border-red-400/20'
                  : remaining === 1
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-400/20'
                    : 'bg-gold/10 text-gold/70 border border-gold/20'
              }`}>
                {remaining}/{total}
              </span>
            )}
            {/* Last used indicator */}
            {lastUsedStr && (
              <span className="text-[10px] text-amber-200/25 flex items-center gap-1" title={`Last used: ${lastUsedStr}`}>
                <Clock size={8} /> Used {lastUsedStr}
              </span>
            )}
          </div>
          <div className="text-xs text-amber-200/40 mt-1 flex items-center gap-2">
            {f.source && <span>{f.source}</span>}
            <span className={`inline-flex items-center capitalize text-[10px] font-medium px-1.5 py-0.5 rounded border ${
              f.feature_type === 'class' ? 'bg-blue-500/15 text-blue-300 border-blue-400/20' :
              f.feature_type === 'racial' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/20' :
              f.feature_type === 'feat' ? 'bg-purple-500/15 text-purple-300 border-purple-400/20' :
              f.feature_type === 'subclass' ? 'bg-indigo-500/15 text-indigo-300 border-indigo-400/20' :
              f.feature_type === 'background' ? 'bg-rose-500/15 text-rose-300 border-rose-400/20' :
              'bg-amber-200/5 text-amber-200/40 border-amber-200/10'
            }`}>{f.feature_type}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {onEdit && (
            <button onClick={onEdit} className="text-amber-200/30 hover:text-amber-200/70 transition-colors" aria-label={`Edit ${f.name || 'feature'}`} title="Edit feature">
              <Pencil size={13} />
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} className="text-red-400/50 hover:text-red-400 transition-colors" aria-label={`Delete ${f.name || 'feature'}`}>
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {f.description && <FeatureDescription text={f.description} allExpanded={allExpanded} />}

      {/* Recharge reminder when empty */}
      {isEmpty && f.recharge && (
        <div className="mt-2 text-xs text-amber-400/70 flex items-center gap-1.5">
          <RefreshCw size={10} className="text-amber-400/50" />
          Recharges on {RECHARGE_LABELS[f.recharge] || f.recharge}
          {(f.recharge === 'recharge_5_6' || f.recharge === 'recharge_6') && (
            <button
              onClick={onRollRecharge}
              className="ml-2 px-2.5 py-1 rounded-md bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-emerald-300 text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95"
              title={`Roll d6 to recharge (need ${f.recharge === 'recharge_6' ? '6' : '5-6'})`}
            >
              <Dices size={12} /> Roll Recharge
            </button>
          )}
        </div>
      )}

      {/* Uses/Charges Tracker */}
      {hasCharges && (
        <div className="mt-3 pt-3 border-t border-gold/10">
          <div className="flex items-center gap-3">
            {/* Quick USE button */}
            {remaining > 0 && (
              <button
                onClick={onUseCharge}
                className="px-3 py-1.5 rounded-md bg-gold/20 hover:bg-gold/30 border border-gold/40 text-gold text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95"
                title="Spend one use"
              >
                <Zap size={12} /> USE
              </button>
            )}
            {remaining === 0 && (f.recharge === 'recharge_5_6' || f.recharge === 'recharge_6') ? (
              <button
                onClick={onRollRecharge}
                className="px-3 py-1.5 rounded-md bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-emerald-300 text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95"
                title={`Roll d6 to recharge (need ${f.recharge === 'recharge_6' ? '6' : '5-6'})`}
              >
                <Dices size={12} /> ROLL RECHARGE
              </button>
            ) : remaining === 0 && (
              <button
                onClick={onRestoreAll}
                className="px-3 py-1.5 rounded-md bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-400 text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95"
                title="Restore all uses"
              >
                <RotateCcw size={12} /> RESTORE
              </button>
            )}

            {/* Charge display */}
            {usesHighCount ? (
              <HighChargeTracker remaining={remaining} total={total} onUse={onUseCharge} onRestore={onRestoreCharge} />
            ) : (
              <div className="flex gap-1.5">
                {Array.from({ length: Math.max(0, total) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => i < remaining ? onUseCharge() : onRestoreCharge()}
                    className={`w-5 h-5 rounded-full border-2 transition-all ${
                      i < remaining
                        ? 'bg-gold border-gold/70 shadow-[0_0_6px_rgba(201,168,76,0.3)]'
                        : 'border-amber-200/20 bg-transparent hover:border-amber-200/40'
                    }`}
                    title={i < remaining ? 'Click to spend a use' : 'Click to restore a use'}
                    aria-label={`${f.name || 'Feature'} use ${i + 1} of ${total}, ${i < remaining ? 'available — click to spend' : 'spent — click to restore'}`}
                  />
                ))}
              </div>
            )}

            <span className="text-xs text-amber-200/40">{remaining} / {total}</span>
            {remaining < total && remaining > 0 && (f.recharge === 'recharge_5_6' || f.recharge === 'recharge_6') && (
              <button
                onClick={onRollRecharge}
                className="text-xs text-emerald-400/60 hover:text-emerald-300 transition-colors flex items-center gap-1"
                title={`Roll d6 to recharge (need ${f.recharge === 'recharge_6' ? '6' : '5-6'})`}
              >
                <Dices size={10} /> Roll
              </button>
            )}
            {remaining < total && remaining > 0 && (
              <button
                onClick={onRestoreAll}
                className="text-xs text-gold/50 hover:text-gold transition-colors flex items-center gap-1"
                title="Restore all uses"
              >
                <RotateCcw size={10} /> Reset
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* --- High Charge Progress Bar (5+ uses) --- */
function HighChargeTracker({ remaining, total, onUse, onRestore }) {
  const pct = total > 0 ? (remaining / total) * 100 : 0;
  const barColor = remaining === 0
    ? 'bg-red-500/60'
    : remaining <= Math.ceil(total * 0.25)
      ? 'bg-amber-500/70'
      : 'bg-gold/70';

  return (
    <div className="flex-1 max-w-48 flex items-center gap-2">
      <div
        className="flex-1 h-3 bg-amber-200/10 rounded-full overflow-hidden cursor-pointer relative group"
        title={`${remaining} / ${total} — click left to spend, right to restore`}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickPct = (e.clientX - rect.left) / rect.width;
          if (clickPct < 0.5) onUse();
          else onRestore();
        }}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
        {/* Subtle notch markers */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: total - 1 }).map((_, i) => (
            <div
              key={i}
              className="h-full border-r border-amber-950/30"
              style={{ width: `${100 / total}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* --- Feature Description (supports allExpanded override) --- */
function FeatureDescription({ text, allExpanded }) {
  const contentRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [localExpanded, setLocalExpanded] = useState(false);

  const expanded = allExpanded !== null ? allExpanded : localExpanded;

  const checkOverflow = useCallback(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight > 64);
    }
  }, []);

  useEffect(() => {
    checkOverflow();
  }, [text, checkOverflow]);

  return (
    <div className="mt-2">
      <div
        ref={contentRef}
        className={`text-sm text-amber-200/60 overflow-hidden transition-all [&_.wmde-markdown]:!bg-transparent [&_.wmde-markdown]:!text-amber-200/60 [&_.wmde-markdown]:!font-sans [&_.wmde-markdown]:!text-sm`}
        style={{ maxHeight: expanded || !isOverflowing ? 'none' : '4.5em' }}
        data-color-mode="dark"
      >
        <MDEditor.Markdown source={text} />
      </div>
      {isOverflowing && allExpanded === null && (
        <button
          onClick={() => setLocalExpanded(prev => !prev)}
          className="text-xs text-gold/60 hover:text-gold mt-1 flex items-center gap-1 transition-colors"
        >
          {localExpanded ? <><ChevronUp size={10} /> Show less</> : <><ChevronDown size={10} /> Show more</>}
        </button>
      )}
    </div>
  );
}

/* --- Feature Form --- */
function FeatureForm({ onSubmit, onCancel, initialData }) {
  const isEditing = !!initialData;
  const [form, setForm] = useState({
    name: initialData?.name || '', source: initialData?.source || '', source_level: initialData?.source_level || 0,
    feature_type: initialData?.feature_type || 'class', description: initialData?.description || '',
    uses_total: initialData?.uses_total || 0, uses_remaining: initialData?.uses_remaining || 0,
    recharge: initialData?.recharge || '', activation: initialData?.activation || '',
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

  return (
    <ModalPortal>
      <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="bg-[#14121c] border border-gold/30 rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="font-display text-lg text-amber-100 mb-4">{isEditing ? 'Edit Feature' : 'Add Feature'}</h3>
        <div className="space-y-3">
          <div>
            <input className={`input w-full ${nameError ? 'border-red-500' : ''}`} placeholder="e.g. Action Surge, Sneak Attack, Lucky..." value={form.name} onChange={e => update('name', e.target.value)} autoFocus />
            {nameError && <p className="text-red-400 text-xs mt-1">Name required</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input className="input w-full" placeholder="Source (class/race)" value={form.source} onChange={e => update('source', e.target.value)} />
            <select className="input w-full" value={form.feature_type} onChange={e => update('feature_type', e.target.value)}>
              <option value="class">Class</option>
              <option value="racial">Racial</option>
              <option value="feat">Feat</option>
              <option value="subclass">Subclass</option>
              <option value="background">Background</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-amber-200/40 mb-1 block">Level Obtained</label>
              <input type="number" className="input w-full" placeholder="Level obtained" min={0} value={form.source_level} onChange={e => update('source_level', parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <label className="text-[10px] text-amber-200/40 mb-1 block">Activation Type</label>
              <select className="input w-full" value={form.activation} onChange={e => update('activation', e.target.value)}>
                <option value="">Not set</option>
                {ACTIVATION_TYPES.filter(a => a !== '').map(a => (
                  <option key={a} value={a}>{ACTIVATION_LABELS[a]}</option>
                ))}
              </select>
            </div>
          </div>
          <textarea className="input w-full h-24 resize-none" placeholder="Description (supports Markdown)" value={form.description} onChange={e => update('description', e.target.value)} />

          {/* Uses / Charges */}
          <div className="border-t border-gold/10 pt-3">
            <label className="label mb-2">Limited Uses (optional)</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-amber-200/40 mb-1 block">Uses Per Rest</label>
                <input type="number" className="input w-full" min={0} max={20} value={form.uses_total} onChange={e => update('uses_total', parseInt(e.target.value) || 0)} />
              </div>
              <div>
                <label className="text-[10px] text-amber-200/40 mb-1 block">Recharges On</label>
                <select className="input w-full" value={form.recharge} onChange={e => update('recharge', e.target.value)}>
                  {RECHARGE_OPTIONS.map(r => <option key={r} value={r}>{RECHARGE_LABELS[r]}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-4">
          <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary text-sm">{isEditing ? 'Save' : 'Add'}</button>
        </div>
      </div>
      </div>
    </ModalPortal>
  );
}
