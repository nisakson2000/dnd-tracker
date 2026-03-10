import { useState } from 'react';
import { Settings2, RotateCcw } from 'lucide-react';
import { THEMES, loadSettings, saveSettings, applySettings } from '../utils/applySettings';

const THEME_LABELS = {
  'dungeon-dark': 'Dungeon Dark',
  'aged-parchment': 'Aged Parchment',
  'frost-mage': 'Frost Mage',
  'forest-druid': 'Forest Druid',
  'infernal': 'Infernal',
};

const SCALE_OPTIONS = [
  { value: 80, label: 'Compact' },
  { value: 90, label: 'Normal' },
  { value: 100, label: 'Comfortable' },
  { value: 110, label: 'Large' },
  { value: 125, label: 'Huge' },
];

const FONT_OPTIONS = [
  { value: 16, label: 'Small (16px)' },
  { value: 18, label: 'Normal (18px)' },
  { value: 20, label: 'Large (20px)' },
  { value: 22, label: 'XL (22px)' },
];

const DEFAULTS = { theme: 'dungeon-dark', uiScale: 100, fontSize: 18, sidebarCollapsed: false };

export default function Settings() {
  const [settings, setSettings] = useState(() => ({ ...DEFAULTS, ...loadSettings() }));

  const update = (key, value) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    saveSettings(next);
    applySettings(next);
  };

  const resetDefaults = () => {
    setSettings(DEFAULTS);
    saveSettings(DEFAULTS);
    applySettings(DEFAULTS);
  };

  return (
    <div className="space-y-6 max-w-none">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display text-amber-100 flex items-center gap-2">
          <Settings2 size={20} />
          <div>
            <span>Settings</span>
            <p className="text-xs text-amber-200/40 font-normal mt-0.5">Customize the look and feel of The Codex.</p>
          </div>
        </h2>
        <button onClick={resetDefaults} className="btn-secondary text-xs flex items-center gap-1">
          <RotateCcw size={12} /> Reset to Defaults
        </button>
      </div>

      {/* Theme Presets */}
      <div className="card">
        <h3 className="font-display text-amber-100 mb-4">Theme</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(THEMES).map(([id, vars]) => (
            <button
              key={id}
              onClick={() => update('theme', id)}
              className={`rounded-lg p-4 border-2 transition-all text-left ${
                settings.theme === id
                  ? 'border-gold shadow-[0_0_12px_rgba(201,168,76,0.3)]'
                  : 'border-amber-200/10 hover:border-amber-200/30'
              }`}
              style={{ background: vars['--bg-deep'] }}
            >
              <div className="flex gap-1.5 mb-3">
                <div className="w-4 h-4 rounded-full" style={{ background: vars['--accent-gold'] }} />
                <div className="w-4 h-4 rounded-full" style={{ background: vars['--accent-crimson'] }} />
                <div className="w-4 h-4 rounded-full" style={{ background: vars['--accent-purple'] }} />
              </div>
              <div className="text-xs font-display" style={{ color: vars['--text-parchment'] }}>
                {THEME_LABELS[id]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* UI Scale */}
      <div className="card">
        <h3 className="font-display text-amber-100 mb-4">UI Scale</h3>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={80} max={125} step={5}
            value={settings.uiScale || 100}
            onChange={e => update('uiScale', parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm text-amber-200/60 w-16 text-right font-display">{settings.uiScale || 100}%</span>
        </div>
        <div className="flex justify-between text-xs text-amber-200/30 mt-2 px-1">
          {SCALE_OPTIONS.map(opt => (
            <span key={opt.value} className={settings.uiScale === opt.value ? 'text-gold' : ''}>{opt.label}</span>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div className="card">
        <h3 className="font-display text-amber-100 mb-4">Font Size</h3>
        <div className="flex gap-3">
          {FONT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => update('fontSize', opt.value)}
              className={`flex-1 py-2 rounded text-sm transition-all ${
                (settings.fontSize || 18) === opt.value
                  ? 'bg-gold/20 text-gold border border-gold/30'
                  : 'text-amber-200/40 border border-amber-200/10 hover:border-amber-200/30'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="card">
        <h3 className="font-display text-amber-100 mb-4">Sidebar</h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.sidebarCollapsed || false}
            onChange={e => update('sidebarCollapsed', e.target.checked)}
          />
          <span className="text-sm text-amber-200/60">Start with sidebar collapsed</span>
        </label>
      </div>
    </div>
  );
}
