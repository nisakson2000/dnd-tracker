import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Heart, Clock, Shield, Zap, Star, Footprints, X, Moon, Coffee, Sunrise, Dices, Flame, Check, Keyboard, Wand2, Sword, FlaskConical, Sparkles, ChevronUp, ChevronDown, Pin, Plus, Hammer } from 'lucide-react';
import toast from 'react-hot-toast';
import { getOverview } from '../api/overview';
import { getConditions, getAttacks } from '../api/combat';
import { getBackstory } from '../api/backstory';
import { getSpells, getSpellSlots, resetSpellSlots } from '../api/spells';
import { getFeatures, updateFeature } from '../api/features';
import { getItems, updateItem } from '../api/inventory';
import { longRest, shortRest } from '../api/rest';
import { RulesetProvider } from '../contexts/RulesetContext';
import { PartyProvider } from '../contexts/PartyContext';
import { CampaignSyncProvider, useCampaignSync } from '../contexts/CampaignSyncContext';
import { addQuest, addNpc } from '../utils/playerJournal';
import { LiveSessionProvider } from '../contexts/LiveSessionContext';
import { useSession } from '../contexts/SessionContext';
import PlayerNotification from '../components/party/PlayerNotification';
import PlayerActionOverlay from '../components/party/PlayerActionOverlay';
import SharedCombatBar from '../components/party/SharedCombatBar';
import DmToolbar from '../components/party/DmToolbar';
import Sidebar from '../components/Sidebar';
import KeyboardShortcutsHelp from '../components/KeyboardShortcutsHelp';
import LevelUpOverlay from '../components/LevelUpOverlay';
import ArcaneWidget from '../components/ArcaneWidget';
import CombatModeHUD from '../components/CombatModeHUD';
import { useLevelUp } from '../hooks/useLevelUp';
import { CONDITION_EFFECTS } from '../data/conditionEffects';
import { useCrashRecovery } from '../hooks/useCrashRecovery';
import { useAutoBackup } from '../hooks/useAutoBackup';
import { useErrorLog, setErrorContext } from '../hooks/useErrorLog';
import { invoke } from '@tauri-apps/api/core';
import { APP_VERSION } from '../version';
import { useAppMode } from '../contexts/ModeContext';
import { SECTION_ORDER } from '../utils/keyboardShortcuts';

const Overview = lazy(() => import('../sections/Overview'));
const Backstory = lazy(() => import('../sections/Backstory'));
const Spellbook = lazy(() => import('../sections/Spellbook'));
const Inventory = lazy(() => import('../sections/Inventory'));
const Features = lazy(() => import('../sections/Features'));
const Combat = lazy(() => import('../sections/Combat'));
const NPCs = lazy(() => import('../sections/NPCs'));
const Quests = lazy(() => import('../sections/Quests'));
const DiceRoller = lazy(() => import('../sections/DiceRoller'));
const Settings = lazy(() => import('../sections/Settings'));
const BugReport = lazy(() => import('../sections/BugReport'));
const FeatureRequest = lazy(() => import('../sections/FeatureRequest'));
const Journal = lazy(() => import('../sections/Journal'));
const Lore = lazy(() => import('../sections/Lore'));
const RulesReference = lazy(() => import('../sections/RulesReference'));
const ExportImport = lazy(() => import('../sections/ExportImport'));
const CampaignHub = lazy(() => import('../sections/CampaignHub'));
const Party = lazy(() => import('../sections/Party'));
const AiAssistant = lazy(() => import('../sections/AiAssistant'));
const PremadeCampaigns = lazy(() => import('../sections/PremadeCampaigns'));
const CampaignMap = lazy(() => import('../sections/CampaignMap'));
const PartyAnalyzer = lazy(() => import('../sections/PartyAnalyzer'));
const EncounterBuilder = lazy(() => import('../sections/EncounterBuilder'));
const BattleMap = lazy(() => import('../sections/BattleMap'));
const FantasyCalendar = lazy(() => import('../sections/Calendar'));
const HomebrewBuilder = lazy(() => import('../sections/HomebrewBuilder'));
const PartyLoot = lazy(() => import('../sections/PartyLoot'));
const AiModulesSection = lazy(() => import('../sections/AiModulesSection'));
const Archives = lazy(() => import('../sections/Archives'));
const DmGuide = lazy(() => import('../sections/DmGuide'));
const DevTools = import.meta.env.DEV ? lazy(() => import('../sections/DevTools')) : null;

class SectionErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="card text-center py-8">
          <p className="text-red-400 font-medium mb-2">Something went wrong in this section</p>
          <p className="text-xs text-amber-200/30 mb-3">{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })} className="btn-primary text-xs">Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const SECTIONS = {
  overview: Overview,
  backstory: Backstory,
  spellbook: Spellbook,
  inventory: Inventory,
  features: Features,
  combat: Combat,
  journal: Journal,
  npcs: NPCs,
  quests: Quests,
  lore: Lore,
  dice: DiceRoller,
  rules: RulesReference,
  settings: Settings,
  export: ExportImport,
  bugreport: BugReport,
  featurerequest: FeatureRequest,
  // DM-mode sections
  'campaign-hub': CampaignHub,
  'encounter': Combat,
  'party-overview': Party,
  'party-connect': Party,
  'ai-assistant': AiAssistant,
  'campaign-map': CampaignMap,
  'party-analyzer': PartyAnalyzer,
  'premade-campaigns': PremadeCampaigns,
  'encounter-builder': EncounterBuilder,
  'battle-map': BattleMap,
  'calendar': FantasyCalendar,
  'homebrew': HomebrewBuilder,
  'party-loot': PartyLoot,
  'ai-modules': AiModulesSection,
  'archives': Archives,
  'dm-guide': DmGuide,
  ...(DevTools ? { devtools: DevTools } : {}),
};

const SECTION_LABELS = {
  overview: 'Character Sheet',
  backstory: 'Backstory',
  spellbook: 'Spellbook',
  inventory: 'Inventory',
  features: 'Features & Traits',
  combat: 'Combat',
  journal: 'Campaign Journal',
  npcs: 'NPCs',
  quests: 'Quests',
  lore: 'Lore & World',
  dice: 'Dice Roller',
  rules: 'Rules Reference',
  settings: 'Settings',
  export: 'Export & Import',
  bugreport: 'Bug Report',
  featurerequest: 'Feature Request',
  devtools: 'Dev Tools',
  'campaign-map': 'Campaign Map',
  'campaign-hub': 'Campaign Hub',
  'encounter': 'Encounter Runner',
  'party-overview': 'Party Overview',
  'party-connect': 'Party Connect',
  'party-analyzer': 'Party Analyzer',
  'ai-assistant': 'Arcane Advisor',
  'ai-modules': 'AI Modules',
  'premade-campaigns': 'Premade Campaigns',
  'encounter-builder': 'Encounter Builder',
  'battle-map': 'Battle Map',
  'calendar': 'Fantasy Calendar',
  'homebrew': 'Homebrew Builder',
  'party-loot': 'Party Loot',
  'archives': 'Archives',
  'dm-guide': 'Create a Campaign Tutorial',
};

const SHORTCUT_SECTIONS = SECTION_ORDER;

/* ── Favorites Quick-Access Bar constants ── */
const FAV_TYPE_META = {
  spell:   { icon: Wand2,        color: '#c4b5fd', bg: 'rgba(139,92,246,0.10)', border: 'rgba(139,92,246,0.25)', label: 'Spell' },
  attack:  { icon: Sword,        color: '#fca5a5', bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.25)',  label: 'Attack' },
  item:    { icon: FlaskConical,  color: '#86efac', bg: 'rgba(34,197,94,0.10)',  border: 'rgba(34,197,94,0.25)',  label: 'Item' },
  feature: { icon: Sparkles,      color: '#fde68a', bg: 'rgba(201,168,76,0.10)', border: 'rgba(201,168,76,0.25)', label: 'Feature' },
};
const MAX_FAVORITES = 8;

function getFavoritesKey(characterId) { return `codex_favorites_${characterId}`; }
function getFavCollapseKey() { return 'codex_favorites_collapsed'; }

function loadFavorites(characterId) {
  try { return JSON.parse(localStorage.getItem(getFavoritesKey(characterId)) || '[]'); }
  catch { return []; }
}
function saveFavorites(characterId, favs) {
  try { localStorage.setItem(getFavoritesKey(characterId), JSON.stringify(favs)); } catch { /* ignore */ }
}

/* ── FavoritesBar sub-component ── */
function FavoritesBar({ characterId }) {
  const [favorites, setFavorites] = useState(() => loadFavorites(characterId));
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(getFavCollapseKey()) === '1'; } catch { return false; }
  });
  const [showPicker, setShowPicker] = useState(false);
  const [pickerTab, setPickerTab] = useState('spell');
  const [pickerData, setPickerData] = useState({ spells: [], attacks: [], items: [], features: [] });
  const [pickerLoading, setPickerLoading] = useState(false);
  const longPressTimer = useRef(null);
  const pickerRef = useRef(null);

  // Sync favorites from localStorage when characterId changes
  useEffect(() => {
    setFavorites(loadFavorites(characterId));
  }, [characterId]);

  // Close picker on outside click
  useEffect(() => {
    if (!showPicker) return;
    const handler = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) setShowPicker(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showPicker]);

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    try { localStorage.setItem(getFavCollapseKey(), next ? '1' : '0'); } catch { /* ignore */ }
  };

  const removeFavorite = (id, type) => {
    const next = favorites.filter(f => !(f.id === id && f.type === type));
    setFavorites(next);
    saveFavorites(characterId, next);
    toast('Unpinned from favorites', { icon: '\uD83D\uDCCC', duration: 1500, style: { background: '#1a1520', color: '#fde68a', border: '1px solid rgba(201,168,76,0.3)' } });
  };

  const addFavorite = (fav) => {
    if (favorites.length >= MAX_FAVORITES) {
      toast('Maximum 8 favorites reached', { icon: '\u26A0\uFE0F', duration: 2000 });
      return;
    }
    if (favorites.some(f => f.id === fav.id && f.type === fav.type)) {
      toast('Already pinned', { duration: 1500 });
      return;
    }
    const next = [...favorites, fav];
    setFavorites(next);
    saveFavorites(characterId, next);
    toast(`Pinned ${fav.name}`, { icon: '\uD83D\uDCCC', duration: 1500, style: { background: '#1a1520', color: '#fde68a', border: '1px solid rgba(201,168,76,0.3)' } });
  };

  const openPicker = async () => {
    setShowPicker(true);
    setPickerLoading(true);
    try {
      const [spells, attacks, items, features] = await Promise.all([
        getSpells(characterId).catch(() => []),
        getAttacks(characterId).catch(() => []),
        getItems(characterId).catch(() => []),
        getFeatures(characterId).catch(() => []),
      ]);
      setPickerData({ spells: spells || [], attacks: attacks || [], items: items || [], features: features || [] });
    } catch { /* ignore */ }
    setPickerLoading(false);
  };

  /* ── Use / activate a favorite ── */
  const activateFavorite = async (fav) => {
    if (fav.type === 'attack') {
      // Roll a d20 + attack bonus
      const bonus = parseInt(fav.bonus) || 0;
      const d20 = Math.floor(Math.random() * 20) + 1; // eslint-disable-line react-hooks/purity -- only called from onClick
      const total = d20 + bonus;
      const isCrit = d20 === 20;
      const isFumble = d20 === 1;
      const prefix = isCrit ? 'CRIT! ' : isFumble ? 'MISS! ' : '';
      toast(`${prefix}${fav.name}: ${d20} + ${bonus} = ${total}`, {
        icon: isCrit ? '\uD83C\uDFAF' : '\u2694\uFE0F',
        duration: 4000,
        style: {
          background: isCrit ? '#1a1a10' : '#1a1520',
          color: isCrit ? '#fde68a' : '#fca5a5',
          border: `1px solid ${isCrit ? 'rgba(201,168,76,0.4)' : 'rgba(239,68,68,0.3)'}`,
          fontFamily: 'monospace',
        },
      });
    } else if (fav.type === 'spell') {
      // Roll a d20 for spell attack (simple cast notification)
      toast(`Cast ${fav.name}!`, {
        icon: '\u2728',
        duration: 3000,
        style: { background: '#1a1520', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.3)', fontFamily: 'monospace' },
      });
    } else if (fav.type === 'item') {
      // Use consumable — decrement quantity if applicable
      if (fav.itemId && fav.quantity > 0) {
        try {
          await updateItem(characterId, fav.itemId, { quantity: fav.quantity - 1 });
          // Update local fav with decremented quantity
          const next = favorites.map(f =>
            f.id === fav.id && f.type === fav.type ? { ...f, quantity: fav.quantity - 1 } : f
          );
          setFavorites(next);
          saveFavorites(characterId, next);
        } catch { /* ignore update failure */ }
      }
      toast(`Used ${fav.name}${fav.quantity > 0 ? ` (${fav.quantity - 1} left)` : ''}`, {
        icon: '\uD83E\uDDEA',
        duration: 3000,
        style: { background: '#1a1520', color: '#86efac', border: '1px solid rgba(34,197,94,0.3)', fontFamily: 'monospace' },
      });
    } else if (fav.type === 'feature') {
      // Spend a charge
      if (fav.featureId && fav.uses_remaining > 0) {
        try {
          await updateFeature(characterId, fav.featureId, { uses_remaining: fav.uses_remaining - 1 });
          const next = favorites.map(f =>
            f.id === fav.id && f.type === fav.type ? { ...f, uses_remaining: fav.uses_remaining - 1 } : f
          );
          setFavorites(next);
          saveFavorites(characterId, next);
        } catch { /* ignore */ }
      }
      toast(`Used ${fav.name}${fav.uses_remaining > 0 ? ` (${fav.uses_remaining - 1} left)` : ''}`, {
        icon: '\u2728',
        duration: 3000,
        style: { background: '#1a1520', color: '#fde68a', border: '1px solid rgba(201,168,76,0.3)', fontFamily: 'monospace' },
      });
    }
  };

  /* ── Pill mouse handlers for long-press-to-unpin ── */
  const handlePillMouseDown = (fav) => {
    longPressTimer.current = setTimeout(() => {
      removeFavorite(fav.id, fav.type);
      longPressTimer.current = null;
    }, 600);
  };
  const handlePillMouseUp = () => {
    if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
  };

  /* ── Picker data for current tab ── */
  const getPickerItems = () => {
    const alreadyPinned = new Set(favorites.map(f => `${f.type}:${f.id}`));
    if (pickerTab === 'spell') return (pickerData.spells || []).map(s => ({ id: String(s.id), type: 'spell', name: s.name, level: s.level })).filter(s => !alreadyPinned.has(`spell:${s.id}`));
    if (pickerTab === 'attack') return (pickerData.attacks || []).map(a => ({ id: String(a.id), type: 'attack', name: a.name, bonus: a.attack_bonus || 0 })).filter(a => !alreadyPinned.has(`attack:${a.id}`));
    if (pickerTab === 'item') return (pickerData.items || []).map(i => ({ id: String(i.id), type: 'item', name: i.name, itemId: i.id, quantity: i.quantity ?? 0 })).filter(i => !alreadyPinned.has(`item:${i.id}`));
    if (pickerTab === 'feature') return (pickerData.features || []).map(f => ({ id: String(f.id), type: 'feature', name: f.name, featureId: f.id, uses_remaining: f.uses_remaining ?? 0, max_uses: f.max_uses ?? 0 })).filter(f => !alreadyPinned.has(`feature:${f.id}`));
    return [];
  };

  const barStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: collapsed ? '3px 18px' : '6px 18px',
    background: 'rgba(4,4,11,0.65)',
    borderBottom: '1px solid var(--border)',
    flexShrink: 0,
    minHeight: collapsed ? '24px' : '36px',
    transition: 'all 0.15s ease',
  };

  return (
    <div style={barStyle}>
      {/* Collapse toggle */}
      <button
        onClick={toggleCollapse}
        title={collapsed ? 'Expand favorites bar' : 'Collapse favorites bar'}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
          color: 'rgba(253,230,138,0.3)', display: 'flex', alignItems: 'center',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'rgba(253,230,138,0.6)'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(253,230,138,0.3)'}
      >
        {collapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
      </button>

      <Pin size={10} style={{ color: 'rgba(253,230,138,0.2)', flexShrink: 0 }} />

      {collapsed ? (
        <span style={{ fontSize: '10px', color: 'rgba(253,230,138,0.25)', fontFamily: 'var(--font-ui)', cursor: 'pointer' }} onClick={toggleCollapse}>
          {favorites.length > 0 ? `${favorites.length} pinned` : 'Favorites'}
        </span>
      ) : (
        <>
          {/* Favorite pills */}
          {favorites.length === 0 && (
            <span style={{ fontSize: '10px', color: 'rgba(253,230,138,0.25)', fontFamily: 'var(--font-ui)', fontStyle: 'italic' }}>
              Pin your most-used spells, attacks, and items here
            </span>
          )}
          {favorites.map((fav) => {
            const meta = FAV_TYPE_META[fav.type] || FAV_TYPE_META.spell;
            const Icon = meta.icon;
            const usesLabel = fav.type === 'feature' && fav.max_uses > 0
              ? ` (${fav.uses_remaining ?? '?'}/${fav.max_uses})`
              : fav.type === 'item' && fav.quantity != null
              ? ` x${fav.quantity}`
              : fav.type === 'spell' && fav.level > 0
              ? ` Lv${fav.level}`
              : '';
            return (
              <button
                key={`${fav.type}:${fav.id}`}
                onClick={() => activateFavorite(fav)}
                onContextMenu={(e) => { e.preventDefault(); removeFavorite(fav.id, fav.type); }}
                onMouseDown={() => handlePillMouseDown(fav)}
                onMouseUp={handlePillMouseUp}
                title={`${meta.label}: ${fav.name}${usesLabel}\nClick to use \u00B7 Right-click to unpin`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: '3px 9px', borderRadius: '8px', fontSize: '11px',
                  fontFamily: 'var(--font-ui)', cursor: 'pointer',
                  background: meta.bg, border: `1px solid ${meta.border}`,
                  color: meta.color, whiteSpace: 'nowrap',
                  transition: 'all 0.15s', lineHeight: 1.2,
                }}
                onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.3)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.filter = ''; e.currentTarget.style.transform = ''; handlePillMouseUp(); }}
              >
                <Icon size={11} />
                <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fav.name}</span>
                {usesLabel && <span style={{ opacity: 0.6, fontSize: '9px' }}>{usesLabel}</span>}
              </button>
            );
          })}

          {/* Add button */}
          {favorites.length < MAX_FAVORITES && (
            <div style={{ position: 'relative' }} ref={pickerRef}>
              <button
                onClick={showPicker ? () => setShowPicker(false) : openPicker}
                title="Pin a favorite"
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '24px', height: '24px', borderRadius: '7px',
                  background: 'rgba(253,230,138,0.06)', border: '1px dashed rgba(253,230,138,0.2)',
                  color: 'rgba(253,230,138,0.35)', cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(253,230,138,0.12)'; e.currentTarget.style.color = 'rgba(253,230,138,0.7)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(253,230,138,0.06)'; e.currentTarget.style.color = 'rgba(253,230,138,0.35)'; }}
              >
                <Plus size={12} />
              </button>

              {/* Picker dropdown */}
              {showPicker && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 6px)', left: 0,
                  width: '280px', maxHeight: '320px',
                  background: 'rgba(12,10,20,0.97)', backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(201,168,76,0.25)', borderRadius: '10px',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.6)', zIndex: 200,
                  display: 'flex', flexDirection: 'column',
                }}>
                  {/* Tabs */}
                  <div style={{ display: 'flex', borderBottom: '1px solid rgba(253,230,138,0.1)', padding: '4px 6px', gap: '2px' }}>
                    {(['spell', 'attack', 'item', 'feature']).map(tab => {
                      const m = FAV_TYPE_META[tab];
                      const TabIcon = m.icon;
                      const active = pickerTab === tab;
                      return (
                        <button
                          key={tab}
                          onClick={() => setPickerTab(tab)}
                          style={{
                            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                            padding: '4px 6px', borderRadius: '6px', fontSize: '10px',
                            fontFamily: 'var(--font-ui)', cursor: 'pointer',
                            background: active ? m.bg : 'transparent',
                            border: active ? `1px solid ${m.border}` : '1px solid transparent',
                            color: active ? m.color : 'rgba(253,230,138,0.35)',
                            transition: 'all 0.15s',
                          }}
                        >
                          <TabIcon size={10} />
                          {m.label}s
                        </button>
                      );
                    })}
                  </div>

                  {/* List */}
                  <div style={{ flex: 1, overflowY: 'auto', padding: '6px' }}>
                    {pickerLoading ? (
                      <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(253,230,138,0.3)', fontSize: '11px' }}>Loading...</div>
                    ) : (() => {
                      const items = getPickerItems();
                      if (items.length === 0) return (
                        <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(253,230,138,0.25)', fontSize: '11px', fontStyle: 'italic' }}>
                          No {FAV_TYPE_META[pickerTab].label.toLowerCase()}s to pin
                        </div>
                      );
                      return items.map(item => {
                        const m = FAV_TYPE_META[item.type];
                        const ItemIcon = m.icon;
                        return (
                          <button
                            key={`${item.type}:${item.id}`}
                            onClick={() => addFavorite(item)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                              padding: '6px 8px', borderRadius: '6px', cursor: 'pointer',
                              background: 'transparent', border: 'none', color: m.color,
                              fontSize: '11px', fontFamily: 'var(--font-ui)', textAlign: 'left',
                              transition: 'background 0.1s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = m.bg}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <ItemIcon size={12} style={{ flexShrink: 0 }} />
                            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                            <Pin size={10} style={{ opacity: 0.4, flexShrink: 0 }} />
                          </button>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ========================================================================
   Unified Rest Modal — Short Rest & Long Rest engine
   ======================================================================== */
const REST_RECHARGE_LABELS = { short_rest: 'Short Rest', long_rest: 'Long Rest', dawn: 'At Dawn', manual: 'Manual' };

function UnifiedRestModal({ characterId, restTab, setRestTab, onClose, reloadCharacter }) {
  const [overview, setOverview] = useState(null);
  const [abilities, setAbilities] = useState([]);
  const [features, setFeatures] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [summary, setSummary] = useState(null);
  const [hitDiceRolls, setHitDiceRolls] = useState([]);
  const [pendingHpGain, setPendingHpGain] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [ovData, featData, slotData] = await Promise.all([
          invoke('get_overview', { characterId }),
          invoke('get_features', { characterId }).catch(() => []),
          invoke('get_spell_slots', { characterId }).catch(() => []),
        ]);
        if (cancelled) return;
        setOverview(ovData.overview);
        setAbilities(ovData.ability_scores || []);
        setFeatures(Array.isArray(featData) ? featData : []);
        setSlots(Array.isArray(slotData) ? slotData : []);
      } catch (err) { toast.error('Failed to load rest data: ' + err.message); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [characterId]);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  useEffect(() => { setHitDiceRolls([]); setPendingHpGain(0); setSummary(null); }, [restTab]);

  if (loading || !overview) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={e => e.target === e.currentTarget && onClose()}>
        <div style={{ background: 'rgba(12,10,20,0.97)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 14, padding: 40, color: '#c4b5fd', fontFamily: 'var(--font-ui)', fontSize: 13 }}>Loading rest data...</div>
      </div>
    );
  }

  const conAb = abilities.find(a => a.ability === 'CON');
  const conMod = conAb ? Math.floor((conAb.score - 10) / 2) : 0;
  const hdMatch = overview.hit_dice_total?.match(/(\d+)?d(\d+)/);
  const hitDieSize = hdMatch ? parseInt(hdMatch[2]) : 10;
  const hitDiceAvail = Math.max(0, overview.level - (overview.hit_dice_used || 0));
  const shortRestFeats = features.filter(f => (f.uses_total ?? 0) > 0 && (f.uses_remaining ?? 0) < (f.uses_total ?? 0) && (f.recharge === 'short_rest' || f.recharge === 'long_rest'));
  const longRestFeats = features.filter(f => (f.uses_total ?? 0) > 0 && (f.uses_remaining ?? 0) < (f.uses_total ?? 0) && f.recharge);
  const usedSlots = slots.filter(s => s.max_slots > 0 && s.used_slots > 0);

  const rollHitDie = () => {
    if (hitDiceAvail - hitDiceRolls.length <= 0 || overview.current_hp + pendingHpGain >= overview.max_hp) return;
    const roll = Math.floor(Math.random() * hitDieSize) + 1;
    const heal = Math.max(1, roll + conMod);
    const capped = Math.min(heal, overview.max_hp - overview.current_hp - pendingHpGain);
    setHitDiceRolls(prev => [...prev, { roll, conMod, total: capped }]);
    setPendingHpGain(prev => prev + capped);
  };

  const completeShortRest = async () => {
    setCompleting(true);
    const lines = [];
    try {
      const res = await shortRest(characterId, hitDiceRolls.length);
      if (res.restored) res.restored.forEach(m => lines.push(m));
      // Hit dice spent summary with individual rolls
      if (hitDiceRolls.length > 0) {
        const totalHealed = hitDiceRolls.reduce((sum, r) => sum + r.total, 0);
        lines.push('Hit dice spent: ' + hitDiceRolls.length + ' (healed ' + totalHealed + ' HP)');
        lines.push('HP: ' + overview.current_hp + ' \u2192 ' + Math.min(overview.max_hp, overview.current_hp + totalHealed) + ' / ' + overview.max_hp);
      }
      if (shortRestFeats.length > 0) {
        await Promise.all(shortRestFeats.map(f => updateFeature(characterId, f.id, { ...f, uses_remaining: f.uses_total }).catch(() => {})));
        for (const f of shortRestFeats) {
          lines.push('Recharged: ' + f.name + ' (' + f.uses_remaining + '/' + f.uses_total + ' \u2192 ' + f.uses_total + '/' + f.uses_total + ')');
        }
      }
      // Warlock Pact Magic: spell slots recover on short rest
      if (overview.primary_class && overview.primary_class.toLowerCase().includes('warlock')) {
        try {
          await resetSpellSlots(characterId);
          lines.push('Pact Magic spell slots restored');
        } catch (e) { void e; }
      }
      if (lines.length === 0) lines.push('Rested for 1 hour. Nothing needed restoring.');
      setSummary({ type: 'short', lines });
      reloadCharacter();
    } catch (err) { toast.error('Short rest failed: ' + err.message); }
    finally { setCompleting(false); }
  };

  const completeLongRest = async () => {
    setCompleting(true);
    const lines = [];
    try {
      const res = await longRest(characterId);
      if (res.restored) res.restored.forEach(m => lines.push(m));
      // HP restoration detail
      if (overview.current_hp < overview.max_hp) {
        lines.push('HP restored to full: ' + overview.current_hp + ' \u2192 ' + overview.max_hp);
      } else {
        lines.push('HP already at full (' + overview.max_hp + '/' + overview.max_hp + ')');
      }
      // Spell slots
      if (usedSlots.length > 0) {
        const totalRecovered = usedSlots.reduce((acc, sl) => acc + sl.used_slots, 0);
        try { await resetSpellSlots(characterId); lines.push('All spell slots recovered (' + totalRecovered + ' slot' + (totalRecovered !== 1 ? 's' : '') + ' restored)'); } catch(e) { void e; }
      }
      // Hit dice recovery (half level, rounded up, min 1)
      if (overview.hit_dice_used > 0) {
        const hitDiceRecovered = Math.max(1, Math.ceil(overview.level / 2));
        const actualRecovered = Math.min(hitDiceRecovered, overview.hit_dice_used);
        lines.push('Hit dice recovered: ' + actualRecovered + ' of ' + overview.hit_dice_used + ' spent');
      }
      // Features recharged — itemized
      if (longRestFeats.length > 0) {
        await Promise.all(longRestFeats.map(f => updateFeature(characterId, f.id, { ...f, uses_remaining: f.uses_total }).catch(() => {})));
        for (const f of longRestFeats) {
          lines.push('Recharged: ' + f.name + ' (' + f.uses_remaining + '/' + f.uses_total + ' \u2192 ' + f.uses_total + '/' + f.uses_total + ')');
        }
      }
      // Exhaustion
      if (overview.exhaustion_level > 0) {
        lines.push('Exhaustion reduced by 1: Level ' + overview.exhaustion_level + ' \u2192 ' + (overview.exhaustion_level - 1));
      }
      if (lines.length === 0) lines.push('Rested for 8 hours. Everything was already at full capacity.');
      setSummary({ type: 'long', lines });
      reloadCharacter();
    } catch (err) { toast.error('Long rest failed: ' + err.message); }
    finally { setCompleting(false); }
  };

  if (summary) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={e => e.target === e.currentTarget && onClose()}>
        <div style={{ background: 'rgba(12,10,20,0.97)', backdropFilter: 'blur(24px)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 14, width: 440, maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
          <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(139,92,246,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: summary.type === 'long' ? 'rgba(99,102,241,0.15)' : 'rgba(234,179,8,0.12)', border: '1px solid ' + (summary.type === 'long' ? 'rgba(99,102,241,0.3)' : 'rgba(234,179,8,0.25)'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {summary.type === 'long' ? <Moon size={18} style={{ color: '#a5b4fc' }} /> : <Coffee size={18} style={{ color: '#fbbf24' }} />}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: '#e0d5c0', fontWeight: 600 }}>{summary.type === 'long' ? 'Long Rest Complete' : 'Short Rest Complete'}</div>
                <div style={{ fontSize: 11, color: 'rgba(224,213,192,0.4)', fontFamily: 'var(--font-ui)', marginTop: 2 }}>{summary.type === 'long' ? 'Your party rested for 8 hours' : 'Your party rested for 1 hour'}</div>
              </div>
            </div>
          </div>
          <div style={{ padding: '16px 24px', overflowY: 'auto', flex: 1 }}>
            {summary.lines.length > 0 ? summary.lines.map((line, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, fontFamily: 'var(--font-ui)', marginBottom: 8 }}>
                <Check size={14} style={{ color: '#4ade80', flexShrink: 0, marginTop: 1 }} />
                <span style={{ color: 'rgba(224,213,192,0.7)' }}>{line}</span>
              </div>
            )) : (
              <div style={{ fontSize: 12, color: 'rgba(224,213,192,0.4)', fontFamily: 'var(--font-ui)', textAlign: 'center', padding: '12px 0' }}>Rest completed. Everything was already at full capacity.</div>
            )}
          </div>
          <div style={{ padding: '14px 24px', borderTop: '1px solid rgba(139,92,246,0.12)', display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={onClose} className="btn-primary text-xs px-6 py-2">Done</button>
          </div>
        </div>
      </div>
    );
  }

  const atFull = overview.current_hp >= overview.max_hp;
  const canRollMore = hitDiceAvail - hitDiceRolls.length > 0 && !atFull && overview.current_hp + pendingHpGain < overview.max_hp;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: 'rgba(12,10,20,0.97)', backdropFilter: 'blur(24px)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 14, width: 500, maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(139,92,246,0.08)' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 0' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: '#e0d5c0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sunrise size={16} style={{ color: '#c4b5fd' }} /> Take a Rest
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(224,213,192,0.3)', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex' }}><X size={16} /></button>
          </div>
          <div style={{ display: 'flex', padding: '12px 20px 0', borderBottom: '1px solid rgba(139,92,246,0.12)' }}>
            {[{ key: 'short', label: 'Short Rest', icon: Coffee, desc: '~1 hour' }, { key: 'long', label: 'Long Rest', icon: Moon, desc: '~8 hours' }].map(tab => {
              const active = restTab === tab.key; const Ic = tab.icon;
              return (<button key={tab.key} onClick={() => setRestTab(tab.key)} style={{ background: 'none', border: 'none', borderBottom: active ? '2px solid #a78bfa' : '2px solid transparent', padding: '8px 18px 10px', color: active ? '#c4b5fd' : 'rgba(224,213,192,0.35)', fontSize: 12, fontFamily: 'var(--font-heading)', letterSpacing: '0.03em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s' }}><Ic size={13} /> {tab.label} <span style={{ fontSize: 9, opacity: 0.5 }}>{tab.desc}</span></button>);
            })}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {restTab === 'short' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* HP */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: 10, padding: '10px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Heart size={14} style={{ color: '#fca5a5' }} /><span style={{ fontSize: 12, color: 'rgba(224,213,192,0.6)', fontFamily: 'var(--font-ui)' }}>Current HP</span></div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: '#e0d5c0' }}>
                  {overview.current_hp}{pendingHpGain > 0 && <span style={{ color: '#4ade80' }}> +{pendingHpGain}</span>} / {overview.max_hp}
                  {overview.temp_hp > 0 && <span style={{ color: '#7dd3fc', fontSize: 12, marginLeft: 4 }}>+{overview.temp_hp} temp</span>}
                </div>
              </div>

              {/* Hit Dice */}
              <div style={{ background: 'rgba(234,179,8,0.04)', border: '1px solid rgba(234,179,8,0.12)', borderRadius: 10, padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Dices size={14} style={{ color: '#fbbf24' }} /><span style={{ fontSize: 12, color: '#fde68a', fontFamily: 'var(--font-heading)', letterSpacing: '0.03em' }}>Hit Dice</span></div>
                  <span style={{ fontSize: 13, fontFamily: 'var(--font-display)', color: '#fde68a' }}>{hitDiceAvail - hitDiceRolls.length}/{overview.level} d{hitDieSize}</span>
                </div>
                {canRollMore ? (
                  <button onClick={rollHitDie} style={{ width: '100%', background: 'rgba(234,179,8,0.1)', border: '1px dashed rgba(234,179,8,0.3)', borderRadius: 8, padding: 10, color: '#fde68a', fontSize: 12, fontFamily: 'var(--font-heading)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.15s' }}>
                    <Dices size={14} /> Spend a Hit Die (1d{hitDieSize} {conMod >= 0 ? '+' : ''}{conMod} CON)
                  </button>
                ) : (
                  <div style={{ fontSize: 11, color: 'rgba(224,213,192,0.3)', fontFamily: 'var(--font-ui)', textAlign: 'center', padding: '6px 0' }}>{atFull || overview.current_hp + pendingHpGain >= overview.max_hp ? 'Already at full HP' : 'No hit dice remaining'}</div>
                )}
                {hitDiceRolls.length > 0 && (
                  <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {hitDiceRolls.map((r, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.12)', borderRadius: 6, padding: '6px 10px', fontSize: 11, fontFamily: 'var(--font-mono, monospace)' }}>
                        <span style={{ color: 'rgba(224,213,192,0.5)' }}>Die {i + 1}: <span style={{ color: '#fde68a' }}>{r.roll}</span> {r.conMod >= 0 ? '+' : ''}{r.conMod} CON</span>
                        <span style={{ color: '#4ade80', fontWeight: 600 }}>+{r.total} HP</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Short rest features */}
              {shortRestFeats.length > 0 && (
                <div style={{ background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.12)', borderRadius: 10, padding: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><Flame size={14} style={{ color: '#a78bfa' }} /><span style={{ fontSize: 12, color: '#c4b5fd', fontFamily: 'var(--font-heading)', letterSpacing: '0.03em' }}>Features Recharging</span></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {shortRestFeats.map(f => (
                      <div key={f.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, fontFamily: 'var(--font-ui)', padding: '4px 8px', background: 'rgba(139,92,246,0.05)', borderRadius: 5 }}>
                        <span style={{ color: 'rgba(224,213,192,0.7)' }}>{f.name}</span>
                        <span style={{ color: 'rgba(139,92,246,0.6)', fontSize: 10 }}>{f.uses_remaining}/{f.uses_total} &#8594; {f.uses_total}/{f.uses_total}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {overview.primary_class === 'Warlock' && (
                <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 8, padding: '8px 12px', fontSize: 11, color: '#c4b5fd', fontFamily: 'var(--font-ui)' }}>Pact Magic spell slots will be fully restored.</div>
              )}
            </div>
          ) : (
            /* Long Rest tab */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 11, color: 'rgba(224,213,192,0.4)', fontFamily: 'var(--font-ui)', marginBottom: 2 }}>After 8 hours of rest, the following will be restored:</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.12)', borderRadius: 8, padding: '10px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Heart size={14} style={{ color: '#4ade80' }} /><span style={{ fontSize: 12, color: 'rgba(224,213,192,0.7)', fontFamily: 'var(--font-ui)' }}>Full HP</span></div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: '#4ade80' }}>{overview.current_hp} &#8594; {overview.max_hp}</span>
              </div>
              {usedSlots.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.12)', borderRadius: 8, padding: '10px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Zap size={14} style={{ color: '#a78bfa' }} /><span style={{ fontSize: 12, color: 'rgba(224,213,192,0.7)', fontFamily: 'var(--font-ui)' }}>All Spell Slots</span></div>
                  <span style={{ fontSize: 11, color: '#c4b5fd', fontFamily: 'var(--font-ui)' }}>{usedSlots.reduce((acc, sl) => acc + sl.used_slots, 0)} slot{usedSlots.reduce((acc, sl) => acc + sl.used_slots, 0) !== 1 ? 's' : ''} restored</span>
                </div>
              )}
              {overview.hit_dice_used > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(234,179,8,0.04)', border: '1px solid rgba(234,179,8,0.12)', borderRadius: 8, padding: '10px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Dices size={14} style={{ color: '#fbbf24' }} /><span style={{ fontSize: 12, color: 'rgba(224,213,192,0.7)', fontFamily: 'var(--font-ui)' }}>Hit Dice Recovery</span></div>
                  <span style={{ fontSize: 11, color: '#fde68a', fontFamily: 'var(--font-ui)' }}>Recover {Math.max(1, Math.ceil(overview.level / 2))} (half, rounded up)</span>
                </div>
              )}
              {overview.exhaustion_level > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)', borderRadius: 8, padding: '10px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Flame size={14} style={{ color: '#fb923c' }} /><span style={{ fontSize: 12, color: 'rgba(224,213,192,0.7)', fontFamily: 'var(--font-ui)' }}>Exhaustion Reduced by 1</span></div>
                  <span style={{ fontSize: 11, color: '#fb923c', fontFamily: 'var(--font-ui)' }}>Level {overview.exhaustion_level} &#8594; {overview.exhaustion_level - 1}</span>
                </div>
              )}
              {longRestFeats.length > 0 && (
                <div style={{ background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.12)', borderRadius: 10, padding: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><Flame size={14} style={{ color: '#a78bfa' }} /><span style={{ fontSize: 12, color: '#c4b5fd', fontFamily: 'var(--font-heading)', letterSpacing: '0.03em' }}>Features Recharging ({longRestFeats.length})</span></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {longRestFeats.map(f => (
                      <div key={f.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, fontFamily: 'var(--font-ui)', padding: '4px 8px', background: 'rgba(139,92,246,0.05)', borderRadius: 5 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ color: 'rgba(224,213,192,0.7)' }}>{f.name}</span>
                          <span style={{ fontSize: 9, color: 'rgba(139,92,246,0.5)', background: 'rgba(139,92,246,0.08)', padding: '1px 5px', borderRadius: 3 }}>{REST_RECHARGE_LABELS[f.recharge] || f.recharge}</span>
                        </div>
                        <span style={{ color: 'rgba(139,92,246,0.6)', fontSize: 10 }}>{f.uses_remaining}/{f.uses_total} &#8594; {f.uses_total}/{f.uses_total}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {overview.current_hp >= overview.max_hp && usedSlots.length === 0 && overview.hit_dice_used === 0 && overview.exhaustion_level === 0 && longRestFeats.length === 0 && (
                <div style={{ fontSize: 12, color: 'rgba(224,213,192,0.35)', fontFamily: 'var(--font-ui)', textAlign: 'center', padding: '16px 0' }}>Everything is already at full capacity. You can still rest to advance time.</div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(139,92,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <span style={{ fontSize: 10, color: 'rgba(224,213,192,0.25)', fontFamily: 'var(--font-ui)' }}>{restTab === 'short' ? 'Spend hit dice to heal, recharge features' : 'Restores HP, slots, features, reduces exhaustion'}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} className="btn-secondary text-xs">Cancel</button>
            <button onClick={restTab === 'short' ? completeShortRest : completeLongRest} disabled={completing} className="btn-primary text-xs" style={{ display: 'flex', alignItems: 'center', gap: 5, opacity: completing ? 0.6 : 1 }}>
              {restTab === 'short' ? <Coffee size={12} /> : <Moon size={12} />}
              {completing ? 'Resting...' : restTab === 'short' ? 'Complete Short Rest' : 'Complete Long Rest'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================
   Campaign Event Processor — syncs DM-pushed events to player character
   ======================================================================== */
function CampaignEventProcessor({ characterId, character, onCharacterUpdate, onConditionsChange }) {
  const {
    conditionChanges, clearConditionChanges,
    pendingHpChanges, clearHpChanges,
    pendingRestSync, clearRestSync,
    latestXpAward, clearXpAward,
    pendingInspiration, clearInspiration,
    pendingItemLoss, clearItemLoss,
    pendingGoldChange, clearGoldChange,
    pendingSlotLoss, clearSlotLoss,
    latestBroadcast,
    pendingLevelUp, clearLevelUp,
  } = useCampaignSync();

  // Level-up notification
  useEffect(() => {
    if (!pendingLevelUp) return;
    const newLevel = pendingLevelUp.new_level || '?';
    toast(`Level Up Available! You've reached level ${newLevel}!`, {
      icon: '\uD83C\uDF1F',
      duration: 6000,
      style: { background: '#1a1a10', color: '#fde68a', border: '1px solid rgba(201,168,76,0.5)', fontWeight: 700 }
    });
    clearLevelUp();
  }, [pendingLevelUp, clearLevelUp]);

  // Save quest/NPC reveals to player journal
  useEffect(() => {
    if (!latestBroadcast || !characterId) return;
    if (latestBroadcast.broadcast_type === 'quest_reveal') {
      addQuest(characterId, {
        title: latestBroadcast.title,
        description: latestBroadcast.body,
        status: 'active',
      });
    }
    if (latestBroadcast.broadcast_type === 'npc_reveal') {
      addNpc(characterId, {
        name: latestBroadcast.title,
        description: latestBroadcast.body,
      });
    }
  }, [latestBroadcast, characterId]);

  // Phase 1A: Process condition changes from DM
  useEffect(() => {
    if (!conditionChanges || conditionChanges.length === 0) return;

    (async () => {
      try {
        const conditions = await getConditions(characterId);
        let activeList = (conditions || []).filter(c => c.active).map(c => c.name);

        for (const change of conditionChanges) {
          if (change.action === 'add' && !activeList.includes(change.condition)) {
            // Add condition via invoke
            await invoke('add_condition', {
              characterId,
              name: change.condition,
              active: true
            }).catch(() => {});
            activeList.push(change.condition);
            const appliedSummary = CONDITION_EFFECTS[change.condition]?.summary;
            toast(`Condition applied: ${change.condition}${appliedSummary ? `\n${appliedSummary}` : ''}`, {
              icon: '\u26A0\uFE0F', duration: 4000,
              style: { background: '#1a1520', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.4)', maxWidth: '360px', lineHeight: '1.4' }
            });
          } else if (change.action === 'remove') {
            // Remove condition via invoke
            const cond = conditions.find(c => c.name === change.condition && c.active);
            if (cond) {
              await invoke('update_condition', {
                conditionId: cond.id,
                active: false
              }).catch(() => {});
              activeList = activeList.filter(n => n !== change.condition);
              toast(`Condition removed: ${change.condition}`, {
                icon: '\u2705', duration: 2500,
                style: { background: '#1a1520', color: '#4ade80', border: '1px solid rgba(74,222,128,0.4)' }
              });
            }
          }
        }

        onConditionsChange(activeList.length, activeList);
      } catch (e) {
        console.error('Failed to process condition changes:', e);
      }
      clearConditionChanges();
    })();
  }, [conditionChanges, characterId, clearConditionChanges, onConditionsChange]);

  // Phase 1C: Process HP changes from DM
  useEffect(() => {
    if (!pendingHpChanges || pendingHpChanges.length === 0) return;

    (async () => {
      try {
        for (const change of pendingHpChanges) {
          const delta = change.delta || 0;
          const currentHp = character?.current_hp ?? 0;
          const maxHp = character?.max_hp ?? 0;
          const newHp = Math.max(0, Math.min(maxHp, currentHp + delta));

          await invoke('update_overview', {
            characterId,
            updates: { current_hp: newHp }
          }).catch(() => {});

          onCharacterUpdate(prev => ({ ...prev, current_hp: newHp }));

          const source = change.source || (delta > 0 ? 'Healing' : 'Damage');
          if (delta < 0) {
            toast(`${source}: ${Math.abs(delta)} damage (HP: ${newHp}/${maxHp})`, {
              icon: '\uD83D\uDCA5', duration: 3000,
              style: { background: '#1a1520', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)' }
            });
          } else if (delta > 0) {
            toast(`${source}: +${delta} HP (HP: ${newHp}/${maxHp})`, {
              icon: '\uD83D\uDC9A', duration: 3000,
              style: { background: '#1a1520', color: '#86efac', border: '1px solid rgba(74,222,128,0.3)' }
            });
          }
        }
      } catch (e) {
        console.error('Failed to process HP changes:', e);
      }
      clearHpChanges();
    })();
  }, [pendingHpChanges, characterId, character?.current_hp, character?.max_hp, clearHpChanges, onCharacterUpdate]);

  // Phase 1D: Process rest sync from DM
  useEffect(() => {
    if (!pendingRestSync) return;

    (async () => {
      try {
        const restType = pendingRestSync.rest_type;
        if (restType === 'long') {
          await longRest(characterId);
          toast('Long Rest complete! HP, spell slots, and features restored.', {
            icon: '\uD83C\uDF19', duration: 4000,
            style: { background: '#1a1520', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.3)' }
          });
        } else if (restType === 'short') {
          await shortRest(characterId, 0);
          // Warlock Pact Magic: spell slots recover on short rest
          if (character?.primary_class && character.primary_class.toLowerCase().includes('warlock')) {
            try { await resetSpellSlots(characterId); } catch (e) { void e; }
          }
          toast('Short Rest complete! Short-rest features recharged.', {
            icon: '\u2615', duration: 3000,
            style: { background: '#1a1520', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }
          });
        }
        // Reload character to reflect changes
        window.dispatchEvent(new Event('codex-character-reload'));
      } catch (e) {
        console.error('Failed to process rest sync:', e);
      }
      clearRestSync();
    })();
  }, [pendingRestSync, characterId, clearRestSync]);

  // Phase 1E: Process XP award notification
  useEffect(() => {
    if (!latestXpAward) return;

    const amount = latestXpAward.amount || 0;
    const reason = latestXpAward.reason || 'XP Awarded';
    toast(`+${amount} XP — ${reason}`, {
      icon: '\u2B50', duration: 4000,
      style: { background: '#1a1a10', color: '#fde68a', border: '1px solid rgba(201,168,76,0.4)', fontWeight: 600 }
    });
    clearXpAward();
  }, [latestXpAward, clearXpAward]);

  // Phase 3E: Process inspiration toggle
  useEffect(() => {
    if (!pendingInspiration) return;

    (async () => {
      try {
        const granted = pendingInspiration.granted;
        await invoke('update_overview', {
          characterId,
          updates: { inspiration: granted ? 1 : 0 }
        }).catch(() => {});
        onCharacterUpdate(prev => ({ ...prev, inspiration: granted ? 1 : 0 }));

        if (granted) {
          toast('Inspiration granted!', {
            icon: '\u2728', duration: 3000,
            style: { background: '#1a1a10', color: '#fde68a', border: '1px solid rgba(201,168,76,0.4)' }
          });
        }
      } catch (e) {
        console.error('Failed to process inspiration:', e);
      }
      clearInspiration();
    })();
  }, [pendingInspiration, characterId, clearInspiration, onCharacterUpdate]);

  // Phase 4C: Process item loss
  useEffect(() => {
    if (!pendingItemLoss || pendingItemLoss.length === 0) return;

    (async () => {
      try {
        for (const loss of pendingItemLoss) {
          // Try to find and delete the item by name
          const items = await getItems(characterId).catch(() => []);
          const item = (items || []).find(i => i.name === loss.item_name);
          if (item) {
            await invoke('delete_item', { itemId: item.id }).catch(() => {});
            toast(`Lost item: ${loss.item_name}${loss.reason ? ` (${loss.reason})` : ''}`, {
              icon: '\uD83D\uDEAB', duration: 3000,
              style: { background: '#1a1520', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)' }
            });
          }
        }
      } catch (e) {
        console.error('Failed to process item loss:', e);
      }
      clearItemLoss();
    })();
  }, [pendingItemLoss, characterId, clearItemLoss]);

  // Phase 4C: Process gold change
  useEffect(() => {
    if (!pendingGoldChange || pendingGoldChange.length === 0) return;

    (async () => {
      try {
        for (const change of pendingGoldChange) {
          const delta = change.delta || 0;
          const currency = await invoke('get_currency', { characterId }).catch(() => ({ gp: 0 }));
          const newGp = Math.max(0, (currency?.gp || 0) + delta);
          await invoke('update_currency', { characterId, currency: { ...currency, gp: newGp } }).catch(() => {});

          if (delta < 0) {
            toast(`Lost ${Math.abs(delta)} GP${change.reason ? ` — ${change.reason}` : ''}`, {
              icon: '\uD83D\uDCB0', duration: 3000,
              style: { background: '#1a1520', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)' }
            });
          } else {
            toast(`Gained ${delta} GP${change.reason ? ` — ${change.reason}` : ''}`, {
              icon: '\uD83D\uDCB0', duration: 3000,
              style: { background: '#1a1a10', color: '#fde68a', border: '1px solid rgba(201,168,76,0.3)' }
            });
          }
        }
      } catch (e) {
        console.error('Failed to process gold change:', e);
      }
      clearGoldChange();
    })();
  }, [pendingGoldChange, characterId, clearGoldChange]);

  // Phase 4C: Process spell slot loss
  useEffect(() => {
    if (!pendingSlotLoss || pendingSlotLoss.length === 0) return;

    (async () => {
      try {
        for (const loss of pendingSlotLoss) {
          // Deduct spell slot at specified level
          await invoke('use_spell_slot', {
            characterId,
            slotLevel: loss.level
          }).catch(() => {});
          toast(`Lost a level ${loss.level} spell slot`, {
            icon: '\uD83D\uDD2E', duration: 3000,
            style: { background: '#1a1520', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.3)' }
          });
        }
      } catch (e) {
        console.error('Failed to process slot loss:', e);
      }
      clearSlotLoss();
    })();
  }, [pendingSlotLoss, characterId, clearSlotLoss]);

  return null; // This is a logic-only component
}

export default function CharacterView() {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { mode: appMode } = useAppMode();
  const { dispatch: sessionDispatch, campaignId: sessionCampaignId, campaignStatus } = useSession();
  const [activeSection, setActiveSection] = useState(
    location.state?.section || (appMode === 'dm' ? 'campaign-hub' : 'overview')
  );
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeConditionCount, setActiveConditionCount] = useState(0);
  const [activeConditions, setActiveConditions] = useState([]);
  const [portrait, setPortrait] = useState('');
  const [sessionElapsed, setSessionElapsed] = useState('0m');
  const [spellSlots, setSpellSlots] = useState([]);
  const [showShortcutHelp, setShowShortcutHelp] = useState(false);
  const [shortcutHintsSeen, setShortcutHintsSeen] = useState(() => {
    try { return localStorage.getItem('codex_shortcut_hints_seen') === '1'; } catch { return false; }
  });
  const [showRestModal, setShowRestModal] = useState(false);
  const [restTab, setRestTab] = useState('short'); // 'short' | 'long'
  const [combatMode, setCombatMode] = useState(false);
  const [campaignStats, setCampaignStats] = useState({ session_count: 0, total_hours: 0 });
  const { showOverlay, levelUpInfo, triggerLevelUp, dismiss } = useLevelUp();
  useCrashRecovery();
  useAutoBackup(characterId, character?.name);
  // Broadcast which section we're editing to other devs (dev presence)
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    invoke('dev_set_active_section', { section: activeSection }).catch(() => {});
    return () => { invoke('dev_set_active_section', { section: null }).catch(() => {}); };
  }, [activeSection]);
  const { errors, clearErrors } = useErrorLog();

  /* ── #218  Session timer ── */
  useEffect(() => {
    const key = `session_start_${characterId}`;
    let fallbackStart = Date.now();
    try {
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, Date.now().toString());
      }
      fallbackStart = parseInt(sessionStorage.getItem(key) || Date.now(), 10);
    } catch { /* storage unavailable — use fallback */ }
    const tick = () => {
      let start = fallbackStart;
      try { start = parseInt(sessionStorage.getItem(key) || fallbackStart, 10); } catch { /* ignore */ }
      const mins = Math.floor((Date.now() - start) / 60000);
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      setSessionElapsed(h > 0 ? `${h}h ${m}m` : `${m}m`);
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [characterId]);

  /* ── #219  Unsaved changes warning ── */
  useEffect(() => {
    const handler = (e) => {
      if (window.__codex_unsaved) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  // Scroll content area to top on section change
  const contentRef = useRef(null);
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeSection]);

  // Keep error context in sync with active section
  useEffect(() => {
    setErrorContext({ section: activeSection });
  }, [activeSection]);

  // Note: active section broadcast is already handled in the effect at line ~144

  // Keep error context in sync with loaded character data
  useEffect(() => {
    if (character) {
      setErrorContext({
        characterId,
        characterName: character.name || null,
        characterClass: character.primary_class || null,
        characterLevel: character.level || null,
        characterRace: character.race || null,
      });
    }
  }, [characterId, character]);

  // When a bug report comes in via Party Connect, write it to desktop (dev builds auto-write)
  const handlePartyBugReport = useCallback((msg) => {
    if (import.meta.env.DEV) {
      const divider = '═'.repeat(60);
      const lines = [
        divider,
        `REMOTE BUG REPORT — ${msg.timestamp || new Date().toISOString()}`,
        divider,
        `Reporter : ${msg.reporter || 'Unknown'}`,
        `Client ID: ${msg.client_id || 'N/A'}`,
        '',
        JSON.stringify(msg.report || {}, null, 2),
        '',
        divider,
        '',
      ];
      invoke('write_bug_report', { report: lines.join('\n') }).catch(() => {});
    }
    toast(`Bug report from ${msg.reporter || 'a player'}`, { icon: '\uD83D\uDC1B', duration: 4000 });
  }, []);

  useEffect(() => {
    loadCharacter();
  }, [characterId]); // eslint-disable-line react-hooks/exhaustive-deps

  // DM mode: set campaign info in SessionContext from the loaded character data
  useEffect(() => {
    if (appMode !== 'dm' || !characterId || !character || sessionCampaignId === characterId) return;
    // Fetch campaign details to get status
    (async () => {
      try {
        const campaign = await invoke('select_campaign', { campaignId: characterId });
        sessionDispatch({
          type: 'SET_CAMPAIGN',
          payload: {
            id: characterId,
            name: character.name || 'Campaign',
            campaign_type: campaign?.campaign_type || 'homebrew',
            status: campaign?.status || 'active',
          },
        });
      } catch {
        sessionDispatch({
          type: 'SET_CAMPAIGN',
          payload: { id: characterId, name: character.name || 'Campaign', campaign_type: 'homebrew', status: 'active' },
        });
      }
    })();
  }, [appMode, characterId, character, sessionCampaignId, sessionDispatch]);

  // DM mode: fetch campaign stats (session count, total hours)
  useEffect(() => {
    if (appMode !== 'dm' || !characterId) return;
    invoke('select_campaign', { campaignId: characterId })
      .then(c => {
        if (c) setCampaignStats({ session_count: c.session_count || 0, total_hours: c.total_hours || 0 });
      })
      .catch(() => {});
  }, [appMode, characterId]);

  // Reload character data when import/export triggers a refresh (avoids full page reload)
  useEffect(() => {
    const handler = () => { loadCharacter(); };
    window.addEventListener('codex-character-reload', handler);
    return () => window.removeEventListener('codex-character-reload', handler);
  }, [characterId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load spell slots for top-bar indicator
  useEffect(() => {
    getSpellSlots(characterId)
      .then(slots => setSpellSlots(slots || []))
      .catch(() => setSpellSlots([]));
  }, [characterId]);

  const loadCharacter = async () => {
    try {
      const data = await getOverview(characterId);
      setCharacter(data.overview);
      // Load condition count and portrait
      let condFailed = false;
      let backstoryFailed = false;
      try {
        const conds = await getConditions(characterId);
        const activeConds = (conds || []).filter(c => c.active);
        setActiveConditionCount(activeConds.length);
        setActiveConditions(activeConds.map(c => c.name));
      } catch (e) { console.warn('Failed to load conditions:', e); condFailed = true; }
      try {
        const bs = await getBackstory(characterId);
        if (bs.portrait_data) setPortrait(bs.portrait_data);
      } catch (e) { console.warn('Failed to load backstory:', e); backstoryFailed = true; }
      if (condFailed && backstoryFailed) {
        toast('Some data failed to load', { icon: '\u26A0\uFE0F', duration: 2000 });
      }
    } catch (err) {
      toast.error(`Failed to load character: ${err.message || err}`);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  // Quick Journal helpers

  // Helper: check if event target is an input field (don't fire shortcuts while typing)
  const isTyping = useCallback((e) => {
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
    if (e.target.isContentEditable) return true;
    return false;
  }, []);

  // Toggle shortcut help and persist that user has seen it (for progressive disclosure of hints)
  const toggleShortcutHelp = useCallback(() => {
    setShowShortcutHelp(prev => {
      const next = !prev;
      if (next && !shortcutHintsSeen) {
        setShortcutHintsSeen(true);
        try { localStorage.setItem('codex_shortcut_hints_seen', '1'); } catch { /* ignore */ }
      }
      return next;
    });
  }, [shortcutHintsSeen]);

  // Context-dependent "new entry" action for Ctrl+N
  const handleNewEntry = useCallback(() => {
    if (activeSection === 'journal' || activeSection === 'npcs' || activeSection === 'quests' || activeSection === 'lore' || activeSection === 'inventory' || activeSection === 'spellbook' || activeSection === 'features') {
      // Dispatch a custom event that the active section can listen for
      window.dispatchEvent(new CustomEvent('codex:new-entry', { detail: { section: activeSection } }));
    }
  }, [activeSection]);

  // Comprehensive keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      const typing = isTyping(e);

      // ── Escape: close any open modal/overlay ──
      if (e.key === 'Escape') {
        if (showShortcutHelp) { setShowShortcutHelp(false); return; }
        if (showRestModal) { setShowRestModal(false); return; }
        return;
      }

      // ── ? key (no modifier, not typing): toggle shortcut help overlay ──
      if (e.key === '?' && !e.ctrlKey && !e.altKey && !e.metaKey && !typing) {
        e.preventDefault();
        toggleShortcutHelp();
        return;
      }

      // ── Ctrl+S: manual save (dispatch event + toast) ──
      if (e.ctrlKey && !e.shiftKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('codex:manual-save'));
        toast.success('Saved', {
          duration: 1500,
          style: { background: '#1a1520', color: '#86efac', border: '1px solid rgba(34,197,94,0.3)' },
        });
        return;
      }

      // ── Ctrl+K: open command palette (dispatch to App.jsx) ──
      if (e.ctrlKey && !e.shiftKey && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('codex:command-palette'));
        return;
      }

      // ── Ctrl+R (no shift): quick roll d20 ──
      if (e.ctrlKey && !e.shiftKey && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault();
        const roll = Math.floor(Math.random() * 20) + 1;
        const isCrit = roll === 20;
        const isFumble = roll === 1;
        const prefix = isCrit ? 'NAT 20! ' : isFumble ? 'NAT 1! ' : '';
        toast(`${prefix}d20: ${roll}`, {
          icon: isCrit ? '\uD83C\uDFAF' : isFumble ? '\uD83D\uDCA8' : '\uD83C\uDFB2',
          duration: 3000,
          style: {
            background: isCrit ? '#1a1a10' : isFumble ? '#1a1015' : '#1a1520',
            color: isCrit ? '#fde68a' : isFumble ? '#fca5a5' : '#c4b5fd',
            border: `1px solid ${isCrit ? 'rgba(201,168,76,0.4)' : isFumble ? 'rgba(239,68,68,0.3)' : 'rgba(139,92,246,0.3)'}`,
            fontFamily: 'monospace',
            fontSize: '14px',
            fontWeight: 600,
          },
        });
        setDiceHistory(prev => [...prev, { die: 'd20', result: roll, timestamp: Date.now() }]);
        return;
      }

      // ── Ctrl+Shift+R: roll initiative (d20 + dex mod) ──
      if (e.ctrlKey && e.shiftKey && (e.key === 'R' || e.key === 'r')) {
        e.preventDefault();
        const dexMod = character?.dexterity ? Math.floor((character.dexterity - 10) / 2) : 0;
        const roll = Math.floor(Math.random() * 20) + 1;
        const total = roll + dexMod;
        const modStr = dexMod >= 0 ? `+${dexMod}` : `${dexMod}`;
        toast(`Initiative: ${roll} ${modStr} = ${total}`, {
          icon: '\u2694\uFE0F',
          duration: 4000,
          style: {
            background: '#1a1520',
            color: '#fbbf24',
            border: '1px solid rgba(251,191,36,0.3)',
            fontFamily: 'monospace',
            fontSize: '14px',
            fontWeight: 600,
          },
        });
        setDiceHistory(prev => [...prev, { die: 'd20', result: roll, label: 'Initiative', timestamp: Date.now() }]);
        return;
      }

      // ── Ctrl+N (no shift): context-dependent new entry ──
      if (e.ctrlKey && !e.shiftKey && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        handleNewEntry();
        return;
      }

      // ── Ctrl+1 through Ctrl+9: switch sections (works even while typing) ──
      if (e.ctrlKey && !e.shiftKey && e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        const idx = parseInt(e.key) - 1;
        if (SHORTCUT_SECTIONS[idx]) setActiveSection(SHORTCUT_SECTIONS[idx]);
        return;
      }

      // ── Ctrl+Shift+?: toggle shortcut help (legacy combo, still works) ──
      if (e.ctrlKey && e.shiftKey && e.key === '?') {
        e.preventDefault();
        toggleShortcutHelp();
        return;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showShortcutHelp, showRestModal, character, activeSection, isTyping, toggleShortcutHelp, handleNewEntry]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-amber-200/40">
        Loading character...
      </div>
    );
  }

  const ActiveComponent = SECTIONS[activeSection];
  const rulesetId = character?.ruleset || '5e-2014';

  return (
    <RulesetProvider rulesetId={rulesetId}>
      <PartyProvider>
      <CampaignSyncProvider>
      <LiveSessionProvider>
      <CampaignEventProcessor
        characterId={characterId}
        character={character}
        onCharacterUpdate={setCharacter}
        onConditionsChange={(count, condNames) => {
          setActiveConditionCount(count);
          setActiveConditions(condNames || []);
        }}
      />
      <div style={{ display: 'flex', minHeight: '100vh', paddingTop: 'var(--dev-banner-h, 0px)' }}>
        <Sidebar
          character={character}
          activeSection={activeSection}
          onSelect={setActiveSection}
          onBack={() => navigate('/')}
          activeConditionCount={activeConditionCount}
          portrait={portrait}
        />

        {/* Right side: topbar + content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Breadcrumb */}
          <div className="text-xs text-amber-200/30 px-[18px] pt-1.5 pb-0" style={{ background: 'rgba(4,4,11,0.85)', flexShrink: 0 }}>
            <span className="hover:text-amber-200/50 cursor-pointer transition-colors" onClick={() => navigate('/')}>The Codex</span>
            <span className="mx-1.5">/</span>
            <span className="hover:text-amber-200/50 cursor-pointer transition-colors" onClick={() => setActiveSection('overview')}>{character?.name || 'Character'}</span>
            <span className="mx-1.5">/</span>
            <span className="text-amber-200/40">{SECTION_LABELS[activeSection] || activeSection}</span>
          </div>

          {/* Topbar */}
          <div style={{ height: 'var(--top-h, 52px)', background: 'rgba(4,4,11,0.85)', backdropFilter: 'blur(24px) saturate(1.5)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0', padding: '0 18px', flexShrink: 0 }}>
            {appMode === 'dm' ? (
              <>
                {/* DM mode: campaign name only */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '9px', background: 'linear-gradient(135deg, rgba(155,89,182,0.3), rgba(155,89,182,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(155,89,182,0.3)', flexShrink: 0 }}>
                    <Flame size={14} style={{ color: '#c084fc' }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 'calc(14px * var(--font-scale, 1))', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', lineHeight: 1.2 }}>
                      {character?.name || 'Campaign'}
                    </div>
                    <div style={{ fontSize: 'calc(10px * var(--font-scale, 1))', color: 'rgba(192,132,252,0.5)', fontFamily: 'var(--font-ui)', whiteSpace: 'nowrap', marginTop: '1px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      Dungeon Master
                    </div>
                  </div>
                </div>
                {/* Campaign stat badges removed per user request */}
              </>
            ) : (
              <>
                {/* Player mode: portrait, name, class, stats */}
                {/* Portrait mini */}
                {portrait ? (
                  <img src={portrait} alt={`${character?.name || 'Character'} portrait`} style={{ width: '30px', height: '30px', borderRadius: '9px', objectFit: 'cover', border: '1px solid var(--border-h)', marginRight: '10px' }} />
                ) : (
                  <div style={{ width: '30px', height: '30px', borderRadius: '9px', background: 'linear-gradient(135deg, var(--accent), var(--accent-l))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', color: 'white', boxShadow: '0 0 16px var(--accent-glow)', marginRight: '10px', flexShrink: 0 }}>
                    {character?.name?.[0] || '?'}
                  </div>
                )}
                {/* Name + class */}
                <div style={{ marginRight: '18px' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 'calc(14px * var(--font-scale, 1))', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', lineHeight: 1.2 }}>
                    {character?.name || 'Unknown'}
                  </div>
                  <div style={{ fontSize: 'calc(11px * var(--font-scale, 1))', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)', whiteSpace: 'nowrap', marginTop: '1px' }}>
                    {[character?.race, character?.primary_class].filter(Boolean).join(' · ')}
                    {character?.level ? ` · Lv ${character.level}` : ''}
                  </div>
                </div>

                {/* Divider */}
                <div style={{ width: '1px', height: '22px', background: 'var(--border)', margin: '0 14px', flexShrink: 0 }} />
            {/* Stat chips */}
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center', flexWrap: 'wrap' }}>
              {character?.max_hp > 0 && (() => {
                const pct = (character.current_hp / character.max_hp) * 100;
                const hpColor = pct <= 0 ? 'text-red-400 bg-red-950/40 border-red-500/30' : pct < 25 ? 'text-red-300 bg-red-950/30 border-red-500/20 animate-pulse' : pct <= 50 ? 'text-yellow-300 bg-yellow-950/20 border-yellow-500/20' : '';
                return (
                  <span className={`stat-chip stat-chip-hp ${hpColor}`}>
                    <Heart size={10} /> {character.current_hp}/{character.max_hp}
                    {character.temp_hp > 0 && <span className="text-blue-300 ml-0.5">+{character.temp_hp}</span>}
                  </span>
                );
              })()}
              {character?.armor_class > 0 && (
                <span className="stat-chip stat-chip-ac">
                  <Shield size={10} /> {character.armor_class}
                </span>
              )}
              {character?.speed > 0 && (
                <span className="stat-chip" style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.15)', color: '#7dd3fc', fontSize: '10px', padding: '2px 7px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Footprints size={9} /> {character.speed}ft
                </span>
              )}
              {character?.inspiration && (
                <span className="stat-chip stat-chip-xp">
                  <Star size={9} /> Inspired
                </span>
              )}
              {activeConditionCount > 0 && (
                <span style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', fontSize: '10px', padding: '2px 7px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Zap size={9} /> {activeConditionCount} condition{activeConditionCount !== 1 ? 's' : ''}
                </span>
              )}
              {/* Spell slot pips */}
              {spellSlots.filter(s => s.max_slots > 0).length > 0 && (
                <>
                  <div style={{ width: '1px', height: '16px', background: 'var(--border)', margin: '0 4px', flexShrink: 0 }} />
                  {spellSlots.filter(s => s.max_slots > 0).map(slot => {
                    const remaining = slot.max_slots - slot.used_slots;
                    const allUsed = remaining <= 0;
                    return (
                      <span
                        key={slot.slot_level}
                        title={`Level ${slot.slot_level}: ${remaining}/${slot.max_slots} remaining`}
                        style={{
                          background: allUsed ? 'rgba(139,92,246,0.05)' : 'rgba(139,92,246,0.1)',
                          border: `1px solid ${allUsed ? 'rgba(139,92,246,0.12)' : 'rgba(139,92,246,0.25)'}`,
                          color: allUsed ? 'rgba(196,181,253,0.35)' : '#c4b5fd',
                          fontSize: '9px',
                          padding: '1px 5px',
                          borderRadius: '5px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                          lineHeight: 1,
                          whiteSpace: 'nowrap',
                          fontFamily: 'var(--font-ui)',
                        }}
                      >
                        <span style={{ fontWeight: 600, fontSize: '8px', opacity: 0.7 }}>
                          {slot.slot_level}{['st','nd','rd'][slot.slot_level - 1] || 'th'}
                        </span>
                        <span style={{ display: 'inline-flex', gap: '1.5px', marginLeft: '1px' }}>
                          {Array.from({ length: slot.max_slots }, (_, i) => (
                            <span
                              key={i}
                              style={{
                                width: '5px',
                                height: '5px',
                                borderRadius: '50%',
                                background: i < remaining
                                  ? 'rgb(167,139,250)'
                                  : 'rgba(167,139,250,0.15)',
                                boxShadow: i < remaining ? '0 0 4px rgba(167,139,250,0.4)' : 'none',
                                transition: 'all 0.2s',
                              }}
                            />
                          ))}
                        </span>
                      </span>
                    );
                  })}
                </>
              )}
            </div>

            {/* Rest button */}
            <button
              onClick={() => setShowRestModal(true)}
              title="Take a Rest (Ctrl+Shift+R)"
              style={{
                background: 'rgba(139,92,246,0.08)',
                border: '1px solid rgba(139,92,246,0.2)',
                borderRadius: '7px',
                padding: '4px 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                color: '#c4b5fd',
                fontSize: '11px',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '0.03em',
                transition: 'all 0.15s',
                marginRight: '6px',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.15)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.2)'; }}
            >
              <Moon size={12} />
              Rest
              {shortcutHintsSeen && (
                <span style={{ fontSize: '8px', opacity: 0.35, fontFamily: 'var(--font-mono, monospace)', marginLeft: '2px' }}>Ctrl+Shift+R</span>
              )}
            </button>

            {/* Combat Mode toggle */}
            <button
              onClick={() => setCombatMode(true)}
              title="Enter Combat Mode"
              style={{
                background: combatMode ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.06)',
                border: `1px solid ${combatMode ? 'rgba(239,68,68,0.35)' : 'rgba(239,68,68,0.15)'}`,
                borderRadius: '7px',
                padding: '4px 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                color: '#fca5a5',
                fontSize: '11px',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '0.03em',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.15)'; }}
            >
              <Sword size={12} />
              Combat
            </button>
              </>
            )}

            <div style={{ flex: 1 }} />

            {/* Keyboard shortcuts help button */}
            <button
              onClick={toggleShortcutHelp}
              title="Keyboard Shortcuts (?)"
              style={{
                background: showShortcutHelp ? 'rgba(201,168,76,0.15)' : 'rgba(201,168,76,0.06)',
                border: `1px solid ${showShortcutHelp ? 'rgba(201,168,76,0.35)' : 'rgba(201,168,76,0.15)'}`,
                borderRadius: '7px',
                padding: '4px 7px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                color: showShortcutHelp ? '#fde68a' : 'rgba(253,230,138,0.4)',
                fontSize: '11px',
                fontFamily: 'var(--font-ui)',
                transition: 'all 0.15s',
                marginRight: '10px',
              }}
            >
              <Keyboard size={12} />
              {shortcutHintsSeen && <span style={{ fontSize: '9px', opacity: 0.5 }}>?</span>}
            </button>

            {/* Session timer */}
            <div className="flex items-center gap-1.5 text-[11px] text-amber-200/25 font-mono select-none">
              <Clock size={11} className="text-amber-200/20" />
              Session: {sessionElapsed}
            </div>
          </div>

          {/* Favorites Quick-Access Bar (player mode only) */}
          {appMode !== 'dm' && <FavoritesBar characterId={characterId} character={character} />}

          {/* Main content */}
          <main ref={contentRef} className="section-content" style={{ flex: 1, padding: 'calc(24px * var(--density, 1)) calc(28px * var(--density, 1))', overflowY: 'auto', maxHeight: 'calc(100vh - var(--top-h, 52px))', minWidth: 0 }}>
            {appMode === 'dm' && campaignStatus === 'draft' && activeSection !== 'campaign-hub' && activeSection !== 'dm-guide' && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '8px 14px',
                borderRadius: 8, background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)',
              }}>
                <Hammer size={13} style={{ color: '#4ade80', flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: '#4ade80', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                  Building Campaign
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-mute)' }}>—</span>
                <span style={{ fontSize: 11, color: 'var(--text-mute)' }}>
                  {character?.name || 'Untitled'}
                </span>
              </div>
            )}
            <SectionErrorBoundary key={activeSection}>
              <Suspense fallback={
                <div className="space-y-4">
                  <div className="skeleton-pulse" style={{ height: 28, width: '35%' }} />
                  <div className="skeleton-pulse" style={{ height: 160 }} />
                  <div className="skeleton-pulse" style={{ height: 100 }} />
                </div>
              }>
              <div key={activeSection} className="section-fade-enter">
                <ActiveComponent
                  characterId={characterId}
                  character={character}
                  onCharacterUpdate={(updated) => setCharacter(updated)}
                  onLevelUp={triggerLevelUp}
                  onConditionsChange={(count, condNames) => {
                    setActiveConditionCount(count);
                    setActiveConditions(condNames || []);
                  }}
                  onPortraitChange={setPortrait}
                  activeConditions={activeConditions}
                  errors={errors}
                  onClearErrors={clearErrors}
                  onBugReport={handlePartyBugReport}
                  onSpellSlotsChange={(slots) => setSpellSlots(slots || [])}
                  onNavigate={setActiveSection}
                />
              </div>
              </Suspense>
            </SectionErrorBoundary>
          </main>
        </div>

        {/* Combat Mode HUD overlay */}
        {combatMode && (
          <CombatModeHUD
            characterId={characterId}
            character={character}
            onClose={() => setCombatMode(false)}
            onCharacterUpdate={setCharacter}
          />
        )}

        {/* Arcane Advisor floating widget (context-aware per section) */}
        {activeSection !== 'ai-assistant' && (
          <ArcaneWidget
            characterId={characterId}
            section={activeSection}
          />
        )}



        {/* Unified Rest Modal */}
        {showRestModal && (
          <UnifiedRestModal
            characterId={characterId}
            restTab={restTab}
            setRestTab={setRestTab}
            onClose={() => setShowRestModal(false)}
            reloadCharacter={() => {
              loadCharacter();
              getSpellSlots(characterId).then(s => setSpellSlots(s || [])).catch(() => {});
            }}
          />
        )}

        {/* Keyboard Shortcuts Help Overlay */}
        <KeyboardShortcutsHelp open={showShortcutHelp} onClose={() => setShowShortcutHelp(false)} />

        <LevelUpOverlay
          show={showOverlay}
          name={levelUpInfo.name}
          level={levelUpInfo.level}
          className={levelUpInfo.className}
          rulesetId={rulesetId}
          onDismiss={dismiss}
        />
      </div>
      <PlayerNotification />
      <PlayerActionOverlay activeConditions={activeConditions} characterId={characterId} />
      <SharedCombatBar />
      <DmToolbar />
      </LiveSessionProvider>
      </CampaignSyncProvider>
      </PartyProvider>
    </RulesetProvider>
  );
}
