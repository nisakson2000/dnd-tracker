import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ScrollText, Sword, BookOpen, Shield, Sparkles, Swords,
  BookMarked, Users, Map, Globe, Dice5, ArrowLeft, User, Download,
  Library, Settings2, ChevronLeft, ChevronRight, Wifi,
} from 'lucide-react';
import { loadSettings, saveSettings } from '../utils/applySettings';

const sections = [
  { id: 'overview', label: 'Character Sheet', icon: User },
  { id: 'backstory', label: 'Backstory', icon: BookOpen },
  { id: 'spellbook', label: 'Spellbook', icon: Sparkles },
  { id: 'inventory', label: 'Inventory', icon: Shield },
  { id: 'features', label: 'Features & Traits', icon: ScrollText },
  { id: 'combat', label: 'Combat', icon: Swords },
  { id: 'journal', label: 'Campaign Journal', icon: BookMarked },
  { id: 'npcs', label: 'NPCs', icon: Users },
  { id: 'quests', label: 'Quests', icon: Map },
  { id: 'lore', label: 'Lore & World', icon: Globe },
  { id: 'party', label: 'Party Connect', icon: Wifi },
  { id: 'dice', label: 'Dice Roller', icon: Dice5 },
  { id: 'rules', label: 'Rules Reference', icon: Library },
  { id: 'settings', label: 'Settings', icon: Settings2 },
  { id: 'export', label: 'Export & Import', icon: Download },
];

export default function Sidebar({ character, activeSection, onSelect, onBack, activeConditionCount = 0 }) {
  const [collapsed, setCollapsed] = useState(() => loadSettings().sidebarCollapsed || false);

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    saveSettings({ ...loadSettings(), sidebarCollapsed: next });
  };

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-72'} min-h-screen bg-[#0a0a10] border-r border-gold/20 flex flex-col transition-all duration-200`}>
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-3 text-sm text-amber-200/60 hover:text-amber-200 transition-colors border-b border-gold/10"
        title={collapsed ? 'Dashboard' : undefined}
      >
        <ArrowLeft size={16} />
        {!collapsed && 'Dashboard'}
      </button>

      {/* Character header */}
      {!collapsed ? (
        <div className="px-4 py-4 border-b border-gold/10">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#1a1825] border-2 border-gold/30 flex items-center justify-center text-3xl text-amber-200/50 mb-3">
            {character?.name?.[0] || '?'}
          </div>
          <h2 className="font-display text-center text-amber-100 text-lg truncate">
            {character?.name || 'Unknown'}
          </h2>
          <p className="text-center text-xs text-amber-200/50 mt-1">
            {[character?.race, character?.primary_class].filter(Boolean).join(' ') || 'Adventurer'}
            {character?.level ? ` — Lv ${character.level}` : ''}
          </p>
          {character?.ruleset && (
            <p className="text-center text-[10px] text-amber-200/30 mt-1">
              {character.ruleset === '5e-2024' ? '2024 PHB' : '2014 PHB'}
            </p>
          )}
          {/* Status indicators */}
          {character && (
            <div className="flex items-center justify-center gap-1.5 mt-2 flex-wrap">
              {character.max_hp > 0 && character.current_hp <= character.max_hp * 0.25 && character.current_hp > 0 && (
                <span className="text-xs bg-red-900/40 text-red-400 px-1.5 py-0.5 rounded" title="Low HP">Low HP</span>
              )}
              {character.current_hp === 0 && character.max_hp > 0 && (
                <span className="text-xs bg-red-900/60 text-red-300 px-1.5 py-0.5 rounded animate-pulse" title="Down!">Down</span>
              )}
              {character.inspiration && (
                <span className="text-xs bg-gold/20 text-gold px-1.5 py-0.5 rounded" title="Inspired">Inspired</span>
              )}
              {character.exhaustion_level > 0 && (
                <span className="text-xs bg-orange-900/40 text-orange-400 px-1.5 py-0.5 rounded" title={`Exhaustion Level ${character.exhaustion_level}`}>Exhaust {character.exhaustion_level}</span>
              )}
              {activeConditionCount > 0 && (
                <span className="text-xs bg-amber-900/40 text-amber-400 px-1.5 py-0.5 rounded" title={`${activeConditionCount} active condition(s)`}>{activeConditionCount} Cond</span>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="py-3 border-b border-gold/10 flex justify-center">
          <div className="w-10 h-10 rounded-full bg-[#1a1825] border-2 border-gold/30 flex items-center justify-center text-lg text-amber-200/50">
            {character?.name?.[0] || '?'}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-3.5 text-base transition-all ${
              activeSection === id
                ? 'bg-gold/10 text-amber-100 border-r-2 border-gold'
                : 'text-amber-200/50 hover:text-amber-200/80 hover:bg-white/3'
            }`}
            title={collapsed ? label : undefined}
          >
            <Icon size={18} />
            {!collapsed && label}
            {!collapsed && id === 'combat' && activeConditionCount > 0 && (
              <span className="ml-auto w-5 h-5 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center">
                {activeConditionCount}
              </span>
            )}
          </button>
        ))}

        {/* Wiki link */}
        <div className="border-t border-gold/10 mt-2 pt-2">
          <Link
            to="/wiki"
            className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-3.5 text-base text-amber-200/50 hover:text-amber-200/80 hover:bg-white/3 transition-all`}
            title={collapsed ? 'Arcane Encyclopedia' : undefined}
          >
            <BookOpen size={18} />
            {!collapsed && 'Arcane Encyclopedia'}
          </Link>
        </div>
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggleCollapse}
        className="flex items-center justify-center p-3 border-t border-gold/10 text-amber-200/30 hover:text-amber-200/60 transition-colors"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}
