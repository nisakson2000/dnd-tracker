import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ScrollText, BookOpen, Shield, Sparkles, Swords,
  BookMarked, Users, Map, Globe, Dice5, ArrowLeft, User, Download,
  Library, Settings2, Heart, Bug, Crown, LayoutDashboard,
  Star, Search, X, Zap, Wifi, MapPin, Lightbulb, Grid3X3,
  Calendar, Hammer, Package, HelpCircle,
} from 'lucide-react';
import { useAppMode } from '../contexts/ModeContext';
import { useSession } from '../contexts/SessionContext';
import { getSectionShortcutLabel } from '../utils/keyboardShortcuts';

function isAssistantEnabled() {
  try {
    const raw = localStorage.getItem('codex-assistant-settings');
    return raw ? JSON.parse(raw).enabled === true : false;
  } catch { return false; }
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
      { id: 'dice',       label: 'Dice Roller',        icon: Dice5 },
      { id: 'rules',      label: 'Rules Reference',    icon: Library },
      { id: 'party-connect', label: 'Party Connect',   icon: Wifi },
      { id: 'ai-modules', label: 'AI Modules',        icon: Sparkles },
      { id: 'ai-assistant', label: 'Arcane Advisor',   icon: Zap, conditional: () => isAssistantEnabled() },
      { id: 'settings',   label: 'Settings',           icon: Settings2 },
      { id: 'export',     label: 'Export & Import',    icon: Download },
      { id: 'bugreport', label: 'Bug Report',         icon: Bug },
      { id: 'featurerequest', label: 'Feature Request', icon: Lightbulb },
    ],
  },
];

// phase: 'build' = draft/building only, 'run' = active/running only, undefined = both
const DM_SECTION_GROUPS = [
  {
    label: 'Campaign',
    items: [
      { id: 'campaign-hub', label: 'Campaign Hub',     icon: LayoutDashboard },
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

export default function Sidebar({ character, activeSection, onSelect, onBack, activeConditionCount = 0, portrait = '' }) {
  const { mode: appMode } = useAppMode();
  const { campaignType } = useSession();
  const [, forceUpdate] = useState(0);

  // Re-render when AI settings change so the Arcane Advisor item appears/disappears
  useEffect(() => {
    const handler = () => forceUpdate(n => n + 1);
    window.addEventListener('codex-ai-settings-changed', handler);
    return () => window.removeEventListener('codex-ai-settings-changed', handler);
  }, []);

  const isDM = appMode === 'dm';
  const { campaignStatus } = useSession();
  const isDraft = campaignStatus === 'draft';
  // Filter DM sidebar items based on campaign type and status (draft = building, active = running)
  const rawGroups = isDM ? DM_SECTION_GROUPS : PLAYER_SECTION_GROUPS;
  const sectionGroups = isDM
    ? rawGroups
        .filter(g => {
          // Hide entire groups based on campaign phase
          if (isDraft && g.phase === 'run') return false;
          if (!isDraft && g.phase === 'build') return false;
          return true;
        })
        .map(g => ({
          ...g,
          items: g.items.filter(item => {
            if (item.campaignTypes && !item.campaignTypes.includes(campaignType)) return false;
            // Hide items based on campaign phase
            if (isDraft && item.phase === 'run') return false;
            if (!isDraft && item.phase === 'build') return false;
            return true;
          }),
        })).filter(g => g.items.length > 0)
    : rawGroups;

  const hp = character?.current_hp ?? 0;
  const maxHp = character?.max_hp ?? 0;
  const hpPct = maxHp > 0 ? Math.min(100, Math.max(0, (hp / maxHp) * 100)) : 0;
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
    <aside role="navigation" aria-label={isDM ? 'DM sections' : 'Character sections'} style={{ width: 'var(--sidebar-w, 240px)', minHeight: '100vh', background: 'rgba(4,4,11,0.6)', backdropFilter: 'blur(var(--panel-blur, 16px))', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
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

            {/* HP pill */}
            {maxHp > 0 && (
              <div className="sidebar-hp-pill">
                <Heart size={11} style={{ color: fillColor, flexShrink: 0 }} />
                <div className="sidebar-hp-bar">
                  <div className="sidebar-hp-fill" style={{ width: `${hpPct}%`, background: fillColor }} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: fillColor, fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap' }}>
                  {hp}/{maxHp}
                </span>
              </div>
            )}

            {/* Status badges */}
            {character && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                {character.inspiration && (
                  <span style={{ fontSize: '9px', background: 'rgba(201,168,76,0.15)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '4px', padding: '1px 6px', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>Inspired</span>
                )}
                {character.exhaustion_level > 0 && (
                  <span style={{ fontSize: '9px', background: 'rgba(249,115,22,0.15)', color: '#fb923c', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '4px', padding: '1px 6px', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>Exhaust {character.exhaustion_level}</span>
                )}
                {activeConditionCount > 0 && (
                  <span style={{ fontSize: '9px', background: 'rgba(239,68,68,0.12)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '4px', padding: '1px 6px', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>{activeConditionCount} Cond</span>
                )}
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
                      background: active ? 'var(--accent-xl)' : 'transparent',
                      border: 'none',
                      borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
                      color: active ? 'white' : 'var(--text-dim)',
                      transition: 'all 0.15s', textAlign: 'left',
                      fontFamily: 'var(--font-ui)', fontWeight: active ? 500 : 400,
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.background = 'transparent'; } }}
                  >
                    <Icon size={14} />
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

        {filteredGroups.map(group => (
          <div key={group.label} style={{ marginBottom: '4px' }}>
            <div style={{ padding: '8px 14px 3px', fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-mute)' }}>
              {group.label}
            </div>
            {group.items.filter(item => !item.conditional || item.conditional()).map(({ id, label, icon: Icon }) => { // eslint-disable-line no-unused-vars
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
                    onClick={() => onSelect(id)}
                    aria-current={active ? 'page' : undefined}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                      padding: 'calc(7px * var(--density, 1)) 14px', fontSize: 'calc(12px * var(--font-scale, 1))', cursor: 'pointer',
                      background: active ? 'var(--accent-xl)' : 'transparent',
                      border: 'none',
                      borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
                      color: active ? 'white' : 'var(--text-dim)',
                      transition: 'all 0.15s', textAlign: 'left',
                      fontFamily: 'var(--font-ui)', fontWeight: active ? 500 : 400,
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.background = 'transparent'; } }}
                  >
                    <Icon size={14} />
                    {label}
                    {shortcutHint && (
                      <span style={{ marginLeft: 'auto', opacity: 0.4, fontSize: '10px', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
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
        ))}

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
          {isDM && isDraft && (
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
              Create a Campaign
            </button>
          )}
        </div>
      </nav>
    </aside>
  );
}
