import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ScrollText, BookOpen, Shield, Sparkles, Swords,
  BookMarked, Users, Map, Globe, ArrowLeft, User, Download,
  Library, Settings2, Heart, Bug, Crown, LayoutDashboard,
  Star, Search, X, Zap, Wifi, MapPin, Lightbulb, Grid3X3, Eye,
  Calendar, Hammer, Package, HelpCircle, Dices, PawPrint, ClipboardList, Skull,
  ChevronDown, ChevronRight, Play, ChevronsDownUp, Pin,
} from 'lucide-react';
import { APP_VERSION } from '../version';
import toast from 'react-hot-toast';
import { useAppMode } from '../contexts/ModeContext';
import { useSession } from '../contexts/SessionContext';
import { useGuidance } from '../contexts/GuidanceContext';
import { useTutorial } from '../contexts/TutorialContext';
import { getSectionShortcutLabel } from '../utils/keyboardShortcuts';
import NextStepsWidget from './dm-campaign/NextStepsWidget';

function isAssistantEnabled() {
  try {
    const raw = localStorage.getItem('codex-assistant-settings');
    return raw ? JSON.parse(raw).enabled === true : false;
  } catch { return false; }
}

function getSessionStyle() {
  try { return JSON.parse(localStorage.getItem('codex-v3-settings') || '{}').sessionStyle || 'solo'; } catch { return 'solo'; }
}

const PLAYER_SECTION_GROUPS = [
  {
    label: 'Character',
    items: [
      { id: 'overview',   label: 'Character Sheet',   icon: User },
      { id: 'backstory',  label: 'Backstory',          icon: BookOpen },
      { id: 'features',   label: 'Features & Traits',  icon: ScrollText },
      { id: 'combat',     label: 'Combat',             icon: Swords },
      { id: 'spellbook',  label: 'Spellbook',          icon: Sparkles },
      { id: 'inventory',  label: 'Inventory',          icon: Shield },
      { id: 'companions', label: 'Companions',         icon: PawPrint },
    ],
  },
  {
    label: 'Campaign',
    items: [
      { id: 'campaign-map', label: 'Campaign Map',      icon: MapPin },
      { id: 'journal',    label: 'Campaign Journal',   icon: BookMarked },
    ],
  },
  {
    label: 'Tools',
    items: [
      { id: 'rules',      label: 'Rules Reference',    icon: Library },
      { id: 'random-tables', label: 'Random Encounters',   icon: Dices },
      { id: 'ai-modules', label: 'AI Modules',        icon: Sparkles },
      { id: 'ai-assistant', label: 'Arcane Advisor',   icon: Zap, conditional: () => isAssistantEnabled() },
      { id: 'party-connect', label: 'Party Connect', icon: Wifi, session: 'connected' },
      { id: 'settings',   label: 'Settings',           icon: Settings2 },
    ],
  },
];

// phase: 'build' = draft/building only, 'run' = active/running only, undefined = both
const DM_SECTION_GROUPS = [
  {
    label: 'Campaign',
    items: [
      { id: 'campaign-hub', label: 'Campaign Hub',     icon: LayoutDashboard },
      { id: 'session-prep', label: 'Session Prep',     icon: ClipboardList },
      { id: 'npcs',         label: 'NPCs',             icon: Users },
      { id: 'quests',       label: 'Quests & Plot',    icon: Map },
      { id: 'lore',         label: 'Lore & Locations', icon: Globe },
      { id: 'journal',      label: 'Session Notes',    icon: BookMarked, phase: 'run' },
    ],
  },
  {
    label: 'World Building',
    phase: 'build', // entire group is build-only
    items: [
      { id: 'homebrew',     label: 'Homebrew Builder',  icon: Hammer, campaignTypes: ['homebrew'] },
      { id: 'encounter-builder',  label: 'Encounter Builder', icon: Swords },
      { id: 'calendar',     label: 'Fantasy Calendar',  icon: Calendar, campaignTypes: ['homebrew'] },
    ],
  },
  {
    label: 'Combat',
    phase: 'run', // entire group is run-only
    items: [
      { id: 'encounter',          label: 'Encounter Runner',  icon: Swords },
      { id: 'battle-map',         label: 'Battle Map',        icon: Grid3X3 },
    ],
  },
  {
    label: 'Party',
    phase: 'run', // entire group is run-only
    items: [
      { id: 'party-overview', label: 'Party Overview', icon: Crown },
      { id: 'party-loot',     label: 'Party Loot',     icon: Package },
    ],
  },
  {
    label: 'Tools',
    items: [
      { id: 'rules',      label: 'Rules Reference',    icon: Library },
      { id: 'random-tables', label: 'Random Encounters',   icon: Dices },
      { id: 'ai-modules', label: 'AI Modules',        icon: Sparkles },
      { id: 'ai-assistant', label: 'Arcane Advisor',   icon: Zap, conditional: () => isAssistantEnabled() },
      { id: 'settings',   label: 'Settings',           icon: Settings2 },
      { id: 'export',     label: 'Export & Import',    icon: Download, phase: 'run' },
      { id: 'bugreport', label: 'Bug Report',         icon: Bug },
      { id: 'featurerequest', label: 'Feature Request', icon: Lightbulb },
    ],
  },
];

function hpColor(hp, maxHp) {
  if (!maxHp) return '#4ade80';
  const pct = hp / maxHp;
  if (pct <= 0.1) return '#ef4444';
  if (pct <= 0.25) return '#f97316';
  if (pct <= 0.5) return '#eab308';
  return '#4ade80';
}

const PINNED_STORAGE_KEY = 'codex_pinned_sections';
const MAX_PINS = 5;

function loadPinned() {
  try {
    const raw = localStorage.getItem(PINNED_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.slice(0, MAX_PINS);
    }
  } catch { /* ignore parse errors */ }
  return [];
}

export default function Sidebar({ character, activeSection, onSelect, onBack, activeConditionCount = 0, activeConditions = [], portrait = '', onHpChange }) {
  const { mode: appMode } = useAppMode();
  const { campaignType } = useSession();
  const [, forceUpdate] = useState(0);
  const [showHpPopup, setShowHpPopup] = useState(false);
  const [hpInput, setHpInput] = useState('');
  const hpInputRef = useRef(null);
  const [showSidebarDice, setShowSidebarDice] = useState(() => {
    try { const s = JSON.parse(localStorage.getItem('codex-v3-settings') || '{}'); return s.sidebarDice !== false; } catch { return true; }
  });
  const [currentSessionStyle, setCurrentSessionStyle] = useState(() => getSessionStyle());

  // Re-render when AI or gameplay settings change
  useEffect(() => {
    const handler = () => forceUpdate(n => n + 1);
    const settingsHandler = (e) => {
      forceUpdate(n => n + 1);
      const detail = e.detail || {};
      // Update sidebar dice
      if (detail.sidebarDice !== undefined) {
        setShowSidebarDice(detail.sidebarDice !== false);
      } else {
        try { const s = JSON.parse(localStorage.getItem('codex-v3-settings') || '{}'); setShowSidebarDice(s.sidebarDice !== false); } catch {}
      }
      // Update session style
      if (detail.sessionStyle) {
        setCurrentSessionStyle(detail.sessionStyle);
      } else {
        setCurrentSessionStyle(getSessionStyle());
      }
    };
    window.addEventListener('codex-ai-settings-changed', handler);
    window.addEventListener('codex-settings-changed', settingsHandler);
    return () => {
      window.removeEventListener('codex-ai-settings-changed', handler);
      window.removeEventListener('codex-settings-changed', settingsHandler);
    };
  }, []);

  const isDM = appMode === 'dm';
  const guidance = useGuidance();
  const tutorial = useTutorial();
  const { campaignStatus } = useSession();

  // Tutorial: determine which sidebar section the current step targets
  const tutorialTargetSection = (() => {
    if (!tutorial?.tutorialActive || !tutorial?.currentStep?.targetSelector) return null;
    const match = tutorial.currentStep.targetSelector.match(/data-tutorial="sidebar-(.+?)"/);
    return match ? match[1] : null;
  })();
  const isDraft = campaignStatus === 'draft';
  // Filter DM sidebar items based on campaign type and status (draft = building, active = running)
  const rawGroups = isDM ? DM_SECTION_GROUPS : PLAYER_SECTION_GROUPS;
  const sectionGroups = isDM
    ? rawGroups
        .filter(g => {
          if (isDraft && g.phase === 'run') return false;
          if (!isDraft && g.phase === 'build') return false;
          return true;
        })
        .map(g => ({
          ...g,
          items: g.items.filter(item => {
            if (item.campaignTypes && !item.campaignTypes.includes(campaignType)) return false;
            if (isDraft && item.phase === 'run') return false;
            if (!isDraft && item.phase === 'build') return false;
            return true;
          }),
        })).filter(g => g.items.length > 0)
    : rawGroups.map(g => ({
        ...g,
        items: g.items.filter(item => {
          // Hide Party Connect items in solo mode
          if (item.session && item.session !== currentSessionStyle) return false;
          return true;
        }),
      })).filter(g => g.items.length > 0);

  const hp = character?.current_hp ?? 0;
  const maxHp = character?.max_hp ?? 0;
  const tempHp = character?.temp_hp ?? 0;
  const hpPct = maxHp > 0 ? Math.min(100, Math.max(0, (hp / maxHp) * 100)) : 0;
  const tempHpPct = maxHp > 0 ? Math.min(100 - hpPct, Math.max(0, (tempHp / maxHp) * 100)) : 0;
  const fillColor = hpColor(hp, maxHp);

  // ── Pinned sections ──
  const [pinnedIds, setPinnedIds] = useState(loadPinned);

  useEffect(() => {
    localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(pinnedIds));
  }, [pinnedIds]);

  const togglePin = useCallback((id) => {
    setPinnedIds(prev => {
      if (prev.includes(id)) return prev.filter(p => p !== id);
      if (prev.length >= MAX_PINS) return prev;
      return [...prev, id];
    });
  }, []);

  // ── Collapsible sidebar groups ──
  const COLLAPSED_GROUPS_KEY = 'codex_sidebar_collapsed_groups';
  const [collapsedGroups, setCollapsedGroups] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(COLLAPSED_GROUPS_KEY) || '{}');
    } catch { return {}; }
  });

  const toggleGroupCollapse = useCallback((groupLabel) => {
    setCollapsedGroups(prev => {
      const next = { ...prev, [groupLabel]: !prev[groupLabel] };
      localStorage.setItem(COLLAPSED_GROUPS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Determine which group the active section belongs to
  const activeGroup = sectionGroups.find(g => g.items.some(item => item.id === activeSection))?.label || null;

  // Check if a group should be collapsed: auto-collapse Campaign and Tools when not active,
  // but Character group stays expanded by default
  const isGroupCollapsed = (groupLabel) => {
    // If user has explicitly toggled this group, respect that
    if (collapsedGroups[groupLabel] !== undefined) return collapsedGroups[groupLabel];
    // Character group is always expanded by default
    if (groupLabel === 'Character') return false;
    // Auto-collapse Campaign and Tools groups when not actively used
    if ((groupLabel === 'Campaign' || groupLabel === 'Tools') && activeGroup !== groupLabel) return true;
    return false;
  };

  // Build a flat lookup of all items for pinned rendering
  const allItems = sectionGroups.flatMap(g => g.items);
  const pinnedItems = pinnedIds.map(id => allItems.find(item => item.id === id)).filter(item => item && (!item.conditional || item.conditional()));

  // ── Section search ──
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGroups = searchQuery.trim()
    ? sectionGroups.map(group => ({
        ...group,
        items: group.items.filter(item =>
          item.label.toLowerCase().includes(searchQuery.trim().toLowerCase())
        ),
      })).filter(group => group.items.length > 0)
    : sectionGroups;

  return (
    <aside role="navigation" aria-label={isDM ? 'DM sections' : 'Character sections'} style={{ width: 'var(--sidebar-w, 240px)', height: '100%', background: 'rgba(4,4,11,0.6)', backdropFilter: 'blur(var(--panel-blur, 16px))', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
      {/* Back button */}
      <button
        onClick={onBack}
        title="Back to Dashboard"
        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '12px', color: 'var(--text-dim)', background: 'none', border: 'none', borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'color 0.15s', fontFamily: 'var(--font-ui)', fontWeight: 500 }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
      >
        <ArrowLeft size={14} /> Dashboard
      </button>

      {/* Header — DM vs Player */}
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
        {isDM ? (
          <>
            {/* DM header — campaign-focused */}
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #9b59b6, #8e44ad)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '10px', fontFamily: 'var(--font-display)', boxShadow: '0 0 12px rgba(155,89,182,0.3)' }}>
              {character?.name?.[0] || '📖'}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'calc(13px * var(--font-scale))', color: 'var(--text)', fontWeight: 600, lineHeight: 1.3, marginBottom: '3px' }}>
              {character?.name || 'Campaign'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <span style={{ fontSize: '9px', background: 'rgba(155,89,182,0.15)', color: '#c084fc', border: '1px solid rgba(155,89,182,0.3)', borderRadius: '4px', padding: '1px 8px', fontFamily: 'var(--font-ui)', fontWeight: 600, letterSpacing: '0.05em' }}>
                DM MODE
              </span>
            </div>
          </>
        ) : (
          <>
            {/* Player header — character-focused */}
            {portrait ? (
              <img src={portrait} alt="Portrait" style={{ width: '38px', height: '38px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--border-h)', marginBottom: '10px' }} />
            ) : (
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent), var(--accent-l))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '10px', fontFamily: 'var(--font-display)', boxShadow: '0 0 12px var(--accent-glow)' }}>
                {character?.name?.[0] || '?'}
              </div>
            )}

            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'calc(13px * var(--font-scale))', color: 'var(--text)', fontWeight: 600, lineHeight: 1.3, marginBottom: '3px' }}>
              {character?.name || 'Unknown'}
            </div>
            <div style={{ fontSize: 'calc(10px * var(--font-scale))', color: 'var(--text-dim)', marginBottom: '2px', fontFamily: 'var(--font-ui)' }}>
              {[character?.race, character?.primary_class].filter(Boolean).join(' · ')}
              {character?.level ? ` · Lv ${character.level}` : ''}
            </div>
            {character?.ruleset && (
              <div style={{ fontSize: '10px', color: 'var(--text-mute)', fontFamily: 'var(--font-ui)' }}>
                {character.ruleset === '5e-2024' ? '2024 PHB' : '2014 PHB'}
              </div>
            )}

            {/* HP pill — clickable for quick damage/heal */}
            {maxHp > 0 && (
              <div style={{ position: 'relative' }}>
                <div
                  className="sidebar-hp-pill"
                  style={{ cursor: onHpChange ? 'pointer' : 'default' }}
                  onClick={() => {
                    if (!onHpChange) return;
                    setShowHpPopup(!showHpPopup);
                    setHpInput('');
                    setTimeout(() => hpInputRef.current?.focus(), 50);
                  }}
                  title={onHpChange ? 'Click to damage/heal' : undefined}
                >
                  <Heart size={11} style={{ color: fillColor, flexShrink: 0 }} />
                  <div className="sidebar-hp-bar">
                    <div className="sidebar-hp-fill" style={{ width: `${hpPct}%`, background: fillColor }} />
                    {tempHp > 0 && (
                      <div style={{
                        position: 'absolute', top: 0, bottom: 0, borderRadius: 2,
                        left: `${hpPct}%`, width: `${tempHpPct}%`,
                        background: '#60a5fa', opacity: 0.6, transition: 'width 0.3s',
                      }} />
                    )}
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: fillColor, fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap' }}>
                    {hp}/{maxHp}{tempHp > 0 ? <span style={{ color: '#60a5fa', fontSize: '9px' }}> +{tempHp}</span> : ''}
                  </span>
                </div>
                {/* Micro HP progress bar */}
                <div style={{ height: '2px', borderRadius: '1px', background: 'rgba(255,255,255,0.06)', marginTop: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${hpPct}%`, background: fillColor, borderRadius: '1px', transition: 'width 0.3s' }} />
                </div>

                {/* Quick HP popup */}
                {showHpPopup && onHpChange && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    marginTop: 4, padding: '8px', borderRadius: 8,
                    background: 'rgba(20,15,30,0.98)', border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.5)', zIndex: 100,
                  }}>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <button
                        onClick={() => {
                          const val = parseInt(hpInput) || 0;
                          if (val > 0) { onHpChange(-val); setHpInput(''); setShowHpPopup(false); }
                        }}
                        style={{
                          padding: '4px 8px', borderRadius: 4, border: 'none', cursor: 'pointer',
                          background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontSize: 11, fontWeight: 700,
                          fontFamily: 'var(--font-mono)',
                        }}
                      >−</button>
                      <input
                        ref={hpInputRef}
                        type="number"
                        value={hpInput}
                        onChange={e => setHpInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            const val = parseInt(hpInput) || 0;
                            if (val > 0) { onHpChange(-val); setHpInput(''); setShowHpPopup(false); }
                          } else if (e.key === 'Escape') { setShowHpPopup(false); }
                        }}
                        placeholder="HP"
                        style={{
                          flex: 1, padding: '4px 6px', borderRadius: 4, textAlign: 'center',
                          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                          color: 'var(--text)', fontSize: 12, fontFamily: 'var(--font-mono)',
                          outline: 'none', width: '100%', minWidth: 0,
                        }}
                      />
                      <button
                        onClick={() => {
                          const val = parseInt(hpInput) || 0;
                          if (val > 0) { onHpChange(val); setHpInput(''); setShowHpPopup(false); }
                        }}
                        style={{
                          padding: '4px 8px', borderRadius: 4, border: 'none', cursor: 'pointer',
                          background: 'rgba(74,222,128,0.15)', color: '#4ade80', fontSize: 11, fontWeight: 700,
                          fontFamily: 'var(--font-mono)',
                        }}
                      >+</button>
                    </div>
                    <div style={{ display: 'flex', gap: 3, marginTop: 4, justifyContent: 'center' }}>
                      {[1, 5, 10].map(n => (
                        <button
                          key={n}
                          onClick={() => { onHpChange(-n); setShowHpPopup(false); }}
                          style={{
                            padding: '2px 8px', borderRadius: 4, border: 'none', cursor: 'pointer',
                            background: 'rgba(239,68,68,0.08)', color: '#fca5a5', fontSize: 10,
                            fontFamily: 'var(--font-mono)', fontWeight: 600,
                          }}
                        >-{n}</button>
                      ))}
                      {[1, 5, 10].map(n => (
                        <button
                          key={n}
                          onClick={() => { onHpChange(n); setShowHpPopup(false); }}
                          style={{
                            padding: '2px 8px', borderRadius: 4, border: 'none', cursor: 'pointer',
                            background: 'rgba(74,222,128,0.08)', color: '#86efac', fontSize: 10,
                            fontFamily: 'var(--font-mono)', fontWeight: 600,
                          }}
                        >+{n}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Initiative bonus — only shown if non-zero (Prof, AC, Speed all in top bar) */}
            {character && character.initiative_bonus !== undefined && character.initiative_bonus !== 0 && (
              <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                <div style={{ padding: '2px 7px', borderRadius: '6px', background: 'rgba(192,132,252,0.08)', border: '1px solid rgba(192,132,252,0.15)', transition: 'all 0.15s' }} title="Initiative Bonus">
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#c084fc', fontFamily: 'var(--font-mono)' }}>{character.initiative_bonus >= 0 ? '+' : ''}{character.initiative_bonus} Init</span>
                </div>
              </div>
            )}

            {/* Death saves — shown when at 0 HP */}
            {character && hp === 0 && maxHp > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', padding: '4px 8px', borderRadius: '6px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                <Skull size={12} style={{ color: '#ef4444', flexShrink: 0 }} />
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '2px' }} title="Successes">
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i < (character.death_save_successes || 0) ? '#4ade80' : 'rgba(255,255,255,0.1)', border: '1px solid rgba(74,222,128,0.3)' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '8px', color: 'var(--text-mute)' }}>|</span>
                  <div style={{ display: 'flex', gap: '2px' }} title="Failures">
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i < (character.death_save_failures || 0) ? '#ef4444' : 'rgba(255,255,255,0.1)', border: '1px solid rgba(239,68,68,0.3)' }} />
                    ))}
                  </div>
                </div>
                <span style={{ fontSize: '9px', color: '#fca5a5', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>Death Saves</span>
              </div>
            )}

            {/* Status badges */}
            {character && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                {character.inspiration && (
                  <span style={{ fontSize: '9px', background: 'rgba(201,168,76,0.15)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '4px', padding: '1px 6px', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>Inspired</span>
                )}
                {character.exhaustion_level > 0 && (
                  <span style={{ fontSize: '9px', background: 'rgba(249,115,22,0.15)', color: '#fb923c', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '4px', padding: '1px 6px', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>Exhaust {character.exhaustion_level}</span>
                )}
                {activeConditionCount > 0 && (
                  <span
                    style={{ fontSize: '9px', background: 'rgba(239,68,68,0.12)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '4px', padding: '1px 6px', fontFamily: 'Outfit, sans-serif', fontWeight: 600, cursor: 'default' }}
                    title={activeConditions.length > 0 ? activeConditions.join(', ') : `${activeConditionCount} active conditions`}
                  >{activeConditionCount} Cond</span>
                )}
              </div>
            )}

            {/* Quick dice roller — respects sidebarDice setting */}
            {!isDM && character && showSidebarDice && (
              <div style={{ display: 'flex', gap: '3px', marginTop: '8px', flexWrap: 'wrap' }}>
                {[4, 6, 8, 10, 12, 20, 100].map(die => (
                  <button
                    key={die}
                    onClick={() => {
                      const roll = Math.floor(Math.random() * die) + 1;
                      const isCrit = die === 20 && roll === 20;
                      const isFail = die === 20 && roll === 1;
                      toast(isCrit ? `d${die}: NAT 20!` : isFail ? `d${die}: Critical fail... 1` : `d${die}: ${roll}`, {
                        icon: isCrit ? '\u{1F389}' : isFail ? '\u{1F480}' : '\u{1F3B2}',
                        duration: 3000,
                        style: { background: '#1a1425', color: '#f0e4c8', border: '1px solid rgba(201,168,76,0.3)', fontFamily: 'var(--font-heading)' },
                      });
                    }}
                    style={{
                      padding: '3px 0', borderRadius: 4, border: 'none', cursor: 'pointer',
                      background: 'rgba(201,168,76,0.06)', color: 'rgba(200,175,130,0.5)',
                      fontSize: 9, fontWeight: 700, fontFamily: 'var(--font-mono)',
                      flex: 1, textAlign: 'center', transition: 'all 0.15s', minWidth: 28,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.15)'; e.currentTarget.style.color = '#c9a84c'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.06)'; e.currentTarget.style.color = 'rgba(200,175,130,0.5)'; }}
                    title={`Roll d${die}`}
                  >d{die}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Section search */}
      <div style={{ padding: '8px 10px 4px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={12} style={{ position: 'absolute', left: 8, color: 'var(--text-mute)', pointerEvents: 'none' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Escape') setSearchQuery(''); }}
            placeholder="Search sections..."
            style={{
              width: '100%', padding: '6px 28px 6px 26px', borderRadius: 6,
              border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)',
              color: 'var(--text)', fontSize: '11px', fontFamily: 'var(--font-ui)',
              outline: 'none', transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-mute)', padding: 2, display: 'flex', alignItems: 'center' }}
            >
              <X size={11} />
            </button>
          )}
        </div>
      </div>

      {/* Navigation groups */}
      <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
        {/* Collapse all button */}
        {!searchQuery && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 10px 4px' }}>
            <button
              onClick={() => {
                const allCollapsed = {};
                sectionGroups.forEach(g => { allCollapsed[g.label] = true; });
                setCollapsedGroups(allCollapsed);
                localStorage.setItem(COLLAPSED_GROUPS_KEY, JSON.stringify(allCollapsed));
              }}
              title="Collapse all groups"
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                background: 'none', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px',
                cursor: 'pointer', color: 'var(--text-mute)', padding: '2px 6px',
                fontSize: '9px', fontFamily: 'var(--font-ui)', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-mute)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
            >
              <ChevronsDownUp size={10} />
              Collapse all
            </button>
          </div>
        )}
        {/* DM Guidance: Next Steps Widget */}
        {isDM && guidance?.guidanceMode === 'guided' && guidance?.nextActions?.length > 0 && (
          <NextStepsWidget actions={guidance.nextActions} onNavigate={onSelect} />
        )}

        {/* Pinned sections */}
        {!searchQuery && pinnedItems.length > 0 && (
          <div style={{ marginBottom: '4px' }}>
            <div style={{ padding: '8px 14px 3px', fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Star size={8} style={{ fill: '#c9a84c', color: '#c9a84c' }} />
              Pinned
            </div>
            {pinnedItems.map(({ id, label, icon: Icon }) => { // eslint-disable-line no-unused-vars
              const active = activeSection === id;
              return (
                <div key={id} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <button
                    onClick={() => onSelect(id)}
                    aria-current={active ? 'page' : undefined}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                      padding: 'calc(7px * var(--density, 1)) 14px', fontSize: 'calc(12px * var(--font-scale, 1))', cursor: 'pointer',
                      background: active ? 'rgba(var(--accent-rgb, 139,92,246), 0.12)' : 'transparent',
                      border: 'none',
                      borderLeft: active ? '3px solid var(--accent)' : '3px solid transparent',
                      color: active ? 'white' : 'var(--text-dim)',
                      transition: 'all 0.15s', textAlign: 'left',
                      fontFamily: 'var(--font-ui)', fontWeight: active ? 500 : 400,
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.background = 'transparent'; } }}
                  >
                    <Icon size={14} />
                    <Pin size={9} style={{ color: '#c9a84c', flexShrink: 0, marginLeft: '-4px', marginRight: '-2px' }} />
                    {label}
                    {id === 'combat' && activeConditionCount > 0 && (
                      <span style={{ marginLeft: 'auto', width: '18px', height: '18px', borderRadius: '50%', background: '#dc2626', color: 'white', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                        {activeConditionCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); togglePin(id); }}
                    title="Unpin section"
                    style={{
                      position: 'absolute', right: 8, background: 'none', border: 'none',
                      cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center',
                      color: '#c9a84c', opacity: 0.7, transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
                  >
                    <Star size={10} style={{ fill: '#c9a84c', color: '#c9a84c' }} />
                  </button>
                </div>
              );
            })}
            <div style={{ height: 1, margin: '4px 14px', background: 'var(--border)' }} />
          </div>
        )}

        {filteredGroups.map(group => {
          const collapsed = !searchQuery && isGroupCollapsed(group.label);
          const ChevronIcon = collapsed ? ChevronRight : ChevronDown;
          return (
          <div key={group.label} style={{ marginBottom: '4px' }}>
            <div
              onClick={() => !searchQuery && toggleGroupCollapse(group.label)}
              style={{ padding: '8px 14px 3px', fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-mute)', cursor: searchQuery ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '4px', userSelect: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => { if (!searchQuery) e.currentTarget.style.color = 'var(--text-dim)'; }}
              onMouseLeave={e => { if (!searchQuery) e.currentTarget.style.color = 'var(--text-mute)'; }}
            >
              {!searchQuery && <ChevronIcon size={10} style={{ flexShrink: 0 }} />}
              {group.label}
            </div>
            {!collapsed && group.items.filter(item => !item.conditional || item.conditional()).map(({ id, label, icon: Icon }) => { // eslint-disable-line no-unused-vars
              const active = activeSection === id;
              const isPinned = pinnedIds.includes(id);
              const shortcutHint = getSectionShortcutLabel(id);
              return (
                <div
                  key={id}
                  className="sidebar-nav-item"
                  style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                >
                  <button
                    data-tutorial={`sidebar-${id}`}
                    onClick={() => onSelect(id)}
                    aria-current={active ? 'page' : undefined}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                      padding: 'calc(7px * var(--density, 1)) 14px', fontSize: 'calc(12px * var(--font-scale, 1))', cursor: 'pointer',
                      background: active ? 'rgba(var(--accent-rgb, 139,92,246), 0.12)' : 'transparent',
                      border: 'none',
                      borderLeft: active ? '3px solid var(--accent)' : '3px solid transparent',
                      color: active ? 'white' : 'var(--text-dim)',
                      transition: 'all 0.15s', textAlign: 'left',
                      fontFamily: 'var(--font-ui)', fontWeight: active ? 500 : 400,
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.background = 'transparent'; } }}
                  >
                    <Icon size={14} />
                    {isPinned && <Pin size={9} style={{ color: '#c9a84c', flexShrink: 0, marginLeft: '-4px', marginRight: '-2px' }} />}
                    {label}
                    {shortcutHint && (
                      <span style={{ marginLeft: 'auto', opacity: 0.5, fontSize: '9px', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', padding: '1px 4px', letterSpacing: '0.02em' }}>
                        {shortcutHint}
                      </span>
                    )}
                    {id === 'combat' && activeConditionCount > 0 && (
                      <span style={{ marginLeft: shortcutHint ? '6px' : 'auto', width: '18px', height: '18px', borderRadius: '50%', background: '#dc2626', color: 'white', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                        {activeConditionCount}
                      </span>
                    )}
                  </button>
                  <button
                    className="sidebar-pin-btn"
                    onClick={(e) => { e.stopPropagation(); togglePin(id); }}
                    title={isPinned ? 'Unpin section' : (pinnedIds.length >= MAX_PINS ? `Max ${MAX_PINS} pins` : 'Pin section')}
                    disabled={!isPinned && pinnedIds.length >= MAX_PINS}
                    style={{
                      position: 'absolute', right: 8, background: 'none', border: 'none',
                      cursor: !isPinned && pinnedIds.length >= MAX_PINS ? 'not-allowed' : 'pointer',
                      padding: 2, display: 'flex', alignItems: 'center',
                      color: isPinned ? '#c9a84c' : 'var(--text-mute)',
                      opacity: isPinned ? 0.8 : 0,
                      transition: 'opacity 0.15s',
                    }}
                  >
                    <Star size={10} style={isPinned ? { fill: '#c9a84c', color: '#c9a84c' } : {}} />
                  </button>
                </div>
              );
            })}
          </div>
          );
        })}

        {/* Wiki + Archives links */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '8px', paddingTop: '8px' }}>
          <Link
            to="/wiki"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontFamily: 'Outfit, sans-serif', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            <BookOpen size={14} />
            Arcane Encyclopedia
          </Link>
          {isDM && (
            <>
              <button
                onClick={() => onSelect('dm-guide')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 16px', fontSize: '13px',
                  color: activeSection === 'dm-guide' ? 'white' : 'rgba(255,255,255,0.4)',
                  background: activeSection === 'dm-guide' ? 'var(--accent-xl)' : 'none',
                  borderLeft: activeSection === 'dm-guide' ? '2px solid var(--accent)' : '2px solid transparent',
                  border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                  transition: 'color 0.15s', width: '100%', textAlign: 'left',
                }}
                onMouseEnter={e => { if (activeSection !== 'dm-guide') e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                onMouseLeave={e => { if (activeSection !== 'dm-guide') e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
              >
                <HelpCircle size={14} />
                DM Guide
              </button>
              {tutorial && !tutorial.tutorialActive && (
                <button
                  onClick={() => {
                    tutorial.startTutorial();
                    import('../utils/loadTutorialCampaign').then(({ loadTutorialCampaign }) => {
                      loadTutorialCampaign().then(charId => {
                        window.dispatchEvent(new CustomEvent('codex-navigate', { detail: `/dm/lobby/${charId}` }));
                      });
                    });
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 16px', fontSize: '12px',
                    color: 'rgba(74,222,128,0.6)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: 'Outfit, sans-serif', transition: 'color 0.15s',
                    width: '100%', textAlign: 'left',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#4ade80'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(74,222,128,0.6)'}
                >
                  <Play size={12} />
                  {tutorial.isTutorialCompleted() ? 'Restart Tutorial' : 'Interactive Tutorial'}
                </button>
              )}
            </>
          )}
        </div>
      </nav>

      {/* Version badge */}
      <div style={{ padding: '8px 14px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <span style={{ fontSize: '9px', color: 'var(--text-mute)', fontFamily: 'var(--font-mono)', opacity: 0.5, letterSpacing: '0.05em' }}>
          {APP_VERSION}
        </span>
      </div>
    </aside>
  );
}
