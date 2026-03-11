import { Link } from 'react-router-dom';
import {
  ScrollText, BookOpen, Shield, Sparkles, Swords,
  BookMarked, Users, Map, Globe, Dice5, ArrowLeft, User, Download,
  Library, Settings2, Heart,
} from 'lucide-react';

const SECTION_GROUPS = [
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
      { id: 'journal',    label: 'Campaign Journal',   icon: BookMarked },
      { id: 'npcs',       label: 'NPCs',               icon: Users },
      { id: 'quests',     label: 'Quests',             icon: Map },
      { id: 'lore',       label: 'Lore & World',       icon: Globe },
    ],
  },
  {
    label: 'Tools',
    items: [
      { id: 'dice',       label: 'Dice Roller',        icon: Dice5 },
      { id: 'rules',      label: 'Rules Reference',    icon: Library },
      { id: 'settings',   label: 'Settings',           icon: Settings2 },
      { id: 'export',     label: 'Export & Import',    icon: Download },
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

export default function Sidebar({ character, activeSection, onSelect, onBack, activeConditionCount = 0, portrait = '' }) {
  const hp = character?.current_hp ?? 0;
  const maxHp = character?.max_hp ?? 0;
  const hpPct = maxHp > 0 ? Math.min(100, Math.max(0, (hp / maxHp) * 100)) : 0;
  const fillColor = hpColor(hp, maxHp);

  return (
    <aside style={{ width: '240px', minHeight: '100vh', background: '#0a0a10', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' }}>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '12px', color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'color 0.15s', fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
        onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
      >
        <ArrowLeft size={14} /> Dashboard
      </button>

      {/* Character header */}
      <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {/* Avatar — portrait or initial */}
        {portrait ? (
          <img src={portrait} alt="Portrait" style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover', border: '1px solid rgba(201,168,76,0.3)', marginBottom: '10px' }} />
        ) : (
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700, color: '#c9a84c', marginBottom: '10px', fontFamily: 'Outfit, sans-serif' }}>
            {character?.name?.[0] || '?'}
          </div>
        )}

        <div style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: '13px', color: '#e8d9b5', lineHeight: 1.3, marginBottom: '3px' }}>
          {character?.name || 'Unknown'}
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '2px', fontFamily: 'Outfit, sans-serif' }}>
          {[character?.race, character?.primary_class].filter(Boolean).join(' ')}
          {character?.level ? ` · Lv ${character.level}` : ''}
        </div>
        {character?.ruleset && (
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.18)', fontFamily: 'Outfit, sans-serif' }}>
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
      </div>

      {/* Navigation groups */}
      <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
        {SECTION_GROUPS.map(group => (
          <div key={group.label} style={{ marginBottom: '4px' }}>
            <div style={{ padding: '8px 16px 4px', fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', fontFamily: 'Outfit, sans-serif' }}>
              {group.label}
            </div>
            {group.items.map(({ id, label, icon: Icon }) => {
              const active = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => onSelect(id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '8px 16px', fontSize: '13px', cursor: 'pointer',
                    background: active ? 'rgba(201,168,76,0.08)' : 'transparent',
                    border: 'none',
                    borderLeft: active ? '2px solid #c9a84c' : '2px solid transparent',
                    color: active ? '#e8d9b5' : 'rgba(255,255,255,0.4)',
                    transition: 'all 0.15s', textAlign: 'left',
                    fontFamily: 'Outfit, sans-serif', fontWeight: active ? 500 : 400,
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'transparent'; } }}
                >
                  <Icon size={14} />
                  {label}
                  {id === 'combat' && activeConditionCount > 0 && (
                    <span style={{ marginLeft: 'auto', width: '18px', height: '18px', borderRadius: '50%', background: '#dc2626', color: 'white', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                      {activeConditionCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}

        {/* Wiki link */}
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
        </div>
      </nav>
    </aside>
  );
}
