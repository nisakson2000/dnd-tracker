import { useState, useCallback } from 'react';
import { Settings2, Palette, Type, LayoutGrid, RotateCcw, Zap, Sliders, Bug, Lightbulb, Download, ChevronDown, ChevronRight, Swords, BookOpen, Monitor } from 'lucide-react';
import toast from 'react-hot-toast';
import { invoke } from '@tauri-apps/api/core';
import ConfirmDialog from '../components/ConfirmDialog';
import { checkOllamaStatus, pullModel } from '../api/assistant';
import { APP_VERSION } from '../version';

const PRESET_THEMES = [
  { id: 'midnight-glass', label: 'Midnight Glass', accent: '#7c3aed', bg: '#04040b', swatches: ['#7c3aed','#a78bfa','#60a5fa'] },
  { id: 'ember-forge', label: 'Ember Forge', accent: '#c9a84c', bg: '#0c0906', swatches: ['#c9a84c','#e8c87a','#fb923c'] },
  { id: 'blood-pact', label: 'Blood Pact', accent: '#ef4444', bg: '#0a0505', swatches: ['#ef4444','#f87171','#fb923c'] },
  { id: 'arcane-sea', label: 'Arcane Sea', accent: '#2dd4bf', bg: '#030a09', swatches: ['#2dd4bf','#34d399','#60a5fa'] },
  { id: 'fey-wild', label: 'Fey Wild', accent: '#f472b6', bg: '#09040c', swatches: ['#f472b6','#e879f9','#a78bfa'] },
  { id: 'void-walker', label: 'Void Walker', accent: '#94a3b8', bg: '#07070a', swatches: ['#94a3b8','#cbd5e1','#64748b'] },
];

const ACCENT_SWATCHES = [
  '#7c3aed','#2563eb','#0891b2','#059669','#c9a84c','#dc2626',
  '#db2777','#8b5cf6','#f97316','#64748b','#d946ef','#84cc16',
];

const DISPLAY_FONTS = [
  { family: 'Syne', fallback: 'sans-serif' },
  { family: 'Cinzel', fallback: 'serif' },
  { family: 'Playfair Display', fallback: 'serif', label: 'Playfair' },
  { family: 'Unbounded', fallback: 'sans-serif' },
  { family: 'Space Grotesk', fallback: 'sans-serif', label: 'Space G.' },
  { family: 'Outfit', fallback: 'sans-serif' },
];

const BODY_FONTS = [
  { family: 'DM Sans', fallback: 'sans-serif' },
  { family: 'Outfit', fallback: 'sans-serif' },
  { family: 'Space Grotesk', fallback: 'sans-serif', label: 'Space G.' },
  { family: 'Fraunces', fallback: 'serif' },
];

const TEXT_FONTS = [
  { family: 'DM Sans', fallback: 'sans-serif' },
  { family: 'Outfit', fallback: 'sans-serif' },
  { family: 'Lora', fallback: 'serif' },
  { family: 'Merriweather', fallback: 'serif' },
  { family: 'Source Sans 3', fallback: 'sans-serif', label: 'Source Sans' },
  { family: 'Literata', fallback: 'serif' },
];

const SETTINGS_KEY = 'codex-v3-settings';

function lighten(hex) {
  let r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  r = Math.min(255, r+60); g = Math.min(255, g+60); b = Math.min(255, b+60);
  return '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
}

const DEFAULTS = {
  preset: 'midnight-glass',
  accent: '#7c3aed',
  bg: '#04040b',
  displayFont: 'Syne',
  bodyFont: 'DM Sans',
  textFont: 'DM Sans',
  fontScale: 100,
  density: 1,
  sidebarWidth: 214,
  borderRadius: 12,
  blur: true,
  noise: false,
  grid: false,
  ambientGlow: true,
  shimmer: true,
  abilityColors: true,
  monoLabels: true,
  uppercaseLabels: true,
  glowIntensity: 60,
  panelBlur: 16,
  panelOpacity: 3,
  brightness: 100,
  sessionStyle: 'solo', // 'solo' (DM uses books) or 'connected' (DM uses The Codex)
  sidebarDice: true,
  encumbrance: 'variant',
  criticalHitRule: 'standard', // 'standard' (double dice) or 'maxPlusRoll' (max damage die + roll)
  deathSaveRule: 'standard',  // 'standard' or 'heroic' (nat 20 = 1 HP)
  restVariant: 'standard',    // 'standard' or 'gritty' (short=8hr, long=7days)
  allowFeats: true,
  allowMulticlass: true,
  pointBuy: false,            // false = standard array / rolled, true = point buy
  flanking: true,             // flanking gives advantage on melee
  diagonalMovement: 'standard', // 'standard' (5ft) or 'alternating' (5/10/5/10)
};

function loadV3Settings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
  } catch { return { ...DEFAULTS }; }
}

function saveV3Settings(s) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
    window.dispatchEvent(new CustomEvent('codex-settings-changed', { detail: s }));
  } catch {
    toast.error('Failed to save settings — localStorage may be full or disabled');
  }
}

function applyV3Settings(s) {
  const root = document.documentElement;
  // Accent
  root.style.setProperty('--accent', s.accent);
  root.style.setProperty('--accent-l', lighten(s.accent));
  root.style.setProperty('--accent-xl', s.accent + '24');
  root.style.setProperty('--accent-glow', s.accent + '59');
  // BG
  root.style.setProperty('--bg', s.bg);
  // Fonts
  root.style.setProperty('--font-display', `'${s.displayFont}', sans-serif`);
  root.style.setProperty('--font-ui', `'${s.bodyFont}', sans-serif`);
  const textFontEntry = TEXT_FONTS.find(f => f.family === s.textFont) || TEXT_FONTS[0];
  root.style.setProperty('--font-text', `'${textFontEntry.family}', ${textFontEntry.fallback}`);
  root.style.setProperty('--font-scale', s.fontScale / 100);
  // Layout
  root.style.setProperty('--density', s.density);
  root.style.setProperty('--sidebar-w', s.sidebarWidth + 'px');
  root.style.setProperty('--radius', s.borderRadius + 'px');
  root.style.setProperty('--radius-sm', Math.max(0, s.borderRadius - 4) + 'px');
  // Effects
  root.style.setProperty('--panel-blur', s.blur ? s.panelBlur + 'px' : '0px');
  // Ambient
  const ambient = document.querySelector('.ambient');
  if (ambient) ambient.style.opacity = s.ambientGlow ? (s.glowIntensity / 100) : '0';
  const noise = document.querySelector('.ambient-noise');
  if (noise) noise.style.opacity = s.noise ? '0.04' : '0';
  // Panel opacity
  root.style.setProperty('--bg-panel', `rgba(255,255,255,${s.panelOpacity / 100})`);
  root.style.setProperty('--bg-panel-h', `rgba(255,255,255,${(s.panelOpacity + 2) / 100})`);
  // Brightness
  const brightness = s.brightness != null ? s.brightness : 100;
  root.style.filter = brightness !== 100 ? `brightness(${brightness / 100})` : '';
}

// Apply on load
const initialSettings = loadV3Settings();
applyV3Settings(initialSettings);

const AI_SETTINGS_KEY = 'codex-assistant-settings';

function loadAiSettings() {
  try {
    const raw = localStorage.getItem(AI_SETTINGS_KEY);
    return raw ? JSON.parse(raw) : { enabled: false, model: 'phi3.5' };
  } catch { return { enabled: false, model: 'phi3.5' }; }
}

function saveAiSettings(s) {
  try {
    localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(s));
    window.dispatchEvent(new CustomEvent('codex-ai-settings-changed', { detail: s }));
  } catch { /* ignore */ }
}

function PreferencesSection() {
  const [diceAnimation, setDiceAnimation] = useState(() => {
    try { return localStorage.getItem('codex_dice_animation') !== 'false'; } catch { return true; }
  });
  const [showSaveIndicator, setShowSaveIndicator] = useState(() => {
    try { return localStorage.getItem('codex_show_save_indicator') !== 'false'; } catch { return true; }
  });
  const [showSessionTimer, setShowSessionTimer] = useState(() => {
    try { return localStorage.getItem('codex_show_session_timer') !== 'false'; } catch { return true; }
  });

  const toggle = (key, value, setter) => {
    const next = !value;
    setter(next);
    try { localStorage.setItem(key, String(next)); } catch { /* ignore */ }
    window.dispatchEvent(new CustomEvent('codex-preference-changed', { detail: { key, value: next } }));
  };

  return (
    <>
      <div className="sp-sec" style={{ marginTop: '8px' }}>Preferences</div>
      <div className="tog-row">
        <div>
          <div className="tog-label">Dice roll animation</div>
          <div className="tog-desc">Show rolling animation for dice — disable for instant results</div>
        </div>
        <div
          className={`toggle ${diceAnimation ? 'on' : ''}`}
          onClick={() => toggle('codex_dice_animation', diceAnimation, setDiceAnimation)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle('codex_dice_animation', diceAnimation, setDiceAnimation); } }}
          tabIndex={0} role="switch" aria-checked={diceAnimation}
        />
      </div>
      <div className="tog-row">
        <div>
          <div className="tog-label">Auto-save indicators</div>
          <div className="tog-desc">Show brief confirmation when data is saved</div>
        </div>
        <div
          className={`toggle ${showSaveIndicator ? 'on' : ''}`}
          onClick={() => toggle('codex_show_save_indicator', showSaveIndicator, setShowSaveIndicator)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle('codex_show_save_indicator', showSaveIndicator, setShowSaveIndicator); } }}
          tabIndex={0} role="switch" aria-checked={showSaveIndicator}
        />
      </div>
      <div className="tog-row">
        <div>
          <div className="tog-label">Session timer</div>
          <div className="tog-desc">Show the session timer in the top bar</div>
        </div>
        <div
          className={`toggle ${showSessionTimer ? 'on' : ''}`}
          onClick={() => toggle('codex_show_session_timer', showSessionTimer, setShowSessionTimer)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle('codex_show_session_timer', showSessionTimer, setShowSessionTimer); } }}
          tabIndex={0} role="switch" aria-checked={showSessionTimer}
        />
      </div>
    </>
  );
}

function AiSettingsTab() {
  const [aiSettings, setAiSettings] = useState(() => loadAiSettings());
  const [pulling, setPulling] = useState(false);
  const [pullProgress, setPullProgress] = useState('');

  const updateAi = (updates) => {
    const next = { ...aiSettings, ...updates };
    setAiSettings(next);
    saveAiSettings(next);
  };

  const handleToggle = async () => {
    const enabling = !aiSettings.enabled;
    updateAi({ enabled: enabling });
    if (!enabling) return;

    const result = await checkOllamaStatus();
    if (!result.available) {
      toast.error('Ollama is not running — install it first, then re-enable');
      updateAi({ enabled: false });
      return;
    }
    if (result.modelInstalled) {
      toast.success('Arcane Advisor enabled!');
      return;
    }

    setPulling(true);
    setPullProgress('Starting download...');
    toast('Downloading phi3.5 model — this may take a few minutes', { duration: 4000 });
    try {
      await pullModel((progress) => {
        if (progress.status === 'pulling manifest') {
          setPullProgress('Pulling manifest...');
        } else if (progress.total && progress.completed) {
          const pct = Math.round((progress.completed / progress.total) * 100);
          setPullProgress(`Downloading: ${pct}%`);
        } else if (progress.status) {
          setPullProgress(progress.status);
        }
      });
      setPullProgress('');
      setPulling(false);
      toast.success('Model downloaded — Arcane Advisor ready!');
    } catch (err) {
      setPullProgress('');
      setPulling(false);
      toast.error(`Failed to pull model: ${err.message}`);
    }
  };

  return (
    <div>
      <div className="tog-row">
        <div>
          <div className="tog-label">Enable AI Assistant</div>
          <div className="tog-desc">Local AI powered by Ollama (phi3.5). Answers use the built-in D&D wiki.</div>
        </div>
        <div
          className={`toggle ${aiSettings.enabled ? 'on' : ''}`}
          onClick={handleToggle}
          tabIndex={0}
          role="switch"
          aria-checked={aiSettings.enabled}
        />
      </div>

      {pulling && (
        <div style={{
          padding: 12, borderRadius: 10, marginTop: 12,
          background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 14, height: 14, border: '2px solid var(--accent)',
            borderTopColor: 'transparent', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <span style={{ fontSize: 12, color: 'var(--text-sub)' }}>{pullProgress}</span>
        </div>
      )}

      <div style={{
        marginTop: 14, padding: 14, borderRadius: 10,
        background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.12)',
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--text)', marginBottom: 8 }}>Setup</div>
        <ol style={{ paddingLeft: 18, fontSize: 12, color: 'var(--text-sub)', lineHeight: 2 }}>
          <li>Install Ollama from <span style={{ color: 'var(--accent-l)' }}>ollama.com/download</span></li>
          <li>Toggle the switch above — model downloads automatically</li>
          <li>For DM AI Modules, open a campaign and expand the "AI Modules" panel</li>
        </ol>
        <p style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 8, fontStyle: 'italic' }}>
          Runs entirely on your machine. The Arcane Advisor uses phi3.5 for chat; DM AI Modules use llama3.2 for content generation.
        </p>
      </div>
    </div>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState(() => loadV3Settings());
  const [activeTab, setActiveTab] = useState('interface');
  const [customHex, setCustomHex] = useState(settings.accent);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [devTapCount, setDevTapCount] = useState(0);
  const [showDevInput, setShowDevInput] = useState(false);
  const [devPassphrase, setDevPassphrase] = useState('');
  const [devUnlocked, setDevUnlocked] = useState(() => { try { return localStorage.getItem('codex-dev-unlocked') === 'true'; } catch { return false; } });

  const update = useCallback((updates) => {
    setSettings(prev => {
      const next = { ...prev, ...updates };
      saveV3Settings(next);
      applyV3Settings(next);
      return next;
    });
  }, []);

  const resetAll = () => {
    setSettings({ ...DEFAULTS });
    setCustomHex(DEFAULTS.accent);
    saveV3Settings(DEFAULTS);
    applyV3Settings(DEFAULTS);
  };

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showTypography, setShowTypography] = useState(false);
  const [showLayout, setShowLayout] = useState(false);

  const navigateToSection = (sectionId) => {
    window.dispatchEvent(new CustomEvent('codex-section-navigate', { detail: sectionId }));
  };

  const tabs = [
    { id: 'interface', label: 'Interface', icon: Palette },
    { id: 'gameplay', label: 'Gameplay', icon: Swords },
    { id: 'ai', label: 'AI Assistant', icon: Zap },
  ];

  return (
    <div style={{ maxWidth: '640px' }}>
      <div className="flex items-center gap-3 mb-6">
        <Settings2 size={20} className="text-amber-200/40" />
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'calc(20px * var(--font-scale))', fontWeight: 700, color: 'white', margin: 0 }}>Settings</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '2px' }}>Customize your experience.</p>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '20px' }}>
        {tabs.map(({ id, label, icon: Icon }) => ( // eslint-disable-line no-unused-vars
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              flex: 1, padding: '10px 12px', fontSize: '12px', fontWeight: 600,
              textAlign: 'center', cursor: 'pointer',
              color: activeTab === id ? 'var(--accent-l)' : 'var(--text-dim)',
              borderBottom: activeTab === id ? '2px solid var(--accent)' : '2px solid transparent',
              transition: 'all .15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* ── INTERFACE TAB ── */}
      {activeTab === 'interface' && (
        <div>
          <div className="sp-sec">Preset Themes</div>
          <div className="preset-grid" style={{ marginBottom: '16px' }}>
            {PRESET_THEMES.map(theme => (
              <div
                key={theme.id}
                className={`preset ${settings.preset === theme.id ? 'on' : ''}`}
                onClick={() => update({ preset: theme.id, accent: theme.accent, bg: theme.bg })}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); update({ preset: theme.id, accent: theme.accent, bg: theme.bg }); } }}
                tabIndex={0}
                role="button"
                aria-pressed={settings.preset === theme.id}
              >
                <div className="preset-bg" style={{ background: `linear-gradient(135deg, ${theme.bg}, ${lighten(theme.bg)})` }}>
                  {theme.swatches.map((sw, i) => (
                    <div key={i} className="pswatch" style={{ background: sw }} />
                  ))}
                </div>
                <div className="preset-label">{theme.label}</div>
              </div>
            ))}
          </div>

          <div className="sp-sec">Custom Accent Color</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '6px', marginBottom: '12px' }}>
            {ACCENT_SWATCHES.map(hex => (
              <div
                key={hex}
                className={`cswatch ${settings.accent === hex ? 'on' : ''}`}
                style={{ background: hex }}
                onClick={() => { update({ accent: hex, preset: '' }); setCustomHex(hex); }}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); update({ accent: hex, preset: '' }); setCustomHex(hex); } }}
                tabIndex={0}
                role="button"
                aria-label={`Accent color ${hex}`}
                aria-pressed={settings.accent === hex}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '9px', border: '1px solid var(--border)', overflow: 'hidden', flexShrink: 0 }}>
              <input
                type="color"
                value={customHex}
                onChange={e => { setCustomHex(e.target.value); update({ accent: e.target.value, preset: '' }); }}
                style={{ width: '150%', height: '150%', margin: '-20% 0 0 -20%', cursor: 'pointer', border: 'none', padding: 0, background: 'none' }}
              />
            </div>
            <input
              type="text"
              value={customHex}
              onChange={e => {
                setCustomHex(e.target.value);
                if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) update({ accent: e.target.value, preset: '' });
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
              maxLength={7}
              placeholder="#7c3aed"
              style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '12px', background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none' }}
            />
          </div>

          <div className="sp-sec">Panel Style</div>
          <div className="tog-row">
            <div><div className="tog-label">Glassmorphism blur</div><div className="tog-desc">Frosted glass panel backgrounds</div></div>
            <div className={`toggle ${settings.blur ? 'on' : ''}`} onClick={() => update({ blur: !settings.blur })} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); update({ blur: !settings.blur }); } }} tabIndex={0} role="switch" aria-checked={settings.blur} />
          </div>
          <div className="tog-row">
            <div><div className="tog-label">Noise texture</div><div className="tog-desc">Subtle film grain on panels</div></div>
            <div className={`toggle ${settings.noise ? 'on' : ''}`} onClick={() => update({ noise: !settings.noise })} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); update({ noise: !settings.noise }); } }} tabIndex={0} role="switch" aria-checked={settings.noise} />
          </div>
          <div className="tog-row">
            <div><div className="tog-label">Ambient glow</div><div className="tog-desc">Colored radial glow behind content</div></div>
            <div className={`toggle ${settings.ambientGlow ? 'on' : ''}`} onClick={() => update({ ambientGlow: !settings.ambientGlow })} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); update({ ambientGlow: !settings.ambientGlow }); } }} tabIndex={0} role="switch" aria-checked={settings.ambientGlow} />
          </div>
          <div className="tog-row">
            <div><div className="tog-label">Shimmer animations</div><div className="tog-desc">HP bar and card shimmer effects</div></div>
            <div className={`toggle ${settings.shimmer ? 'on' : ''}`} onClick={() => update({ shimmer: !settings.shimmer })} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); update({ shimmer: !settings.shimmer }); } }} tabIndex={0} role="switch" aria-checked={settings.shimmer} />
          </div>
          <div className="tog-row">
            <div><div className="tog-label">Ability color accents</div><div className="tog-desc">Per-stat colors on ability cards</div></div>
            <div className={`toggle ${settings.abilityColors ? 'on' : ''}`} onClick={() => update({ abilityColors: !settings.abilityColors })} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); update({ abilityColors: !settings.abilityColors }); } }} tabIndex={0} role="switch" aria-checked={settings.abilityColors} />
          </div>

          <PreferencesSection />

          {/* Font Size (moved from Typography) */}
          <div className="sp-sec">Font Size</div>
          <div className="sl-row">
            <div className="sl-header">
              <span className="sl-label">Scale</span>
              <span className="sl-val">{settings.fontScale}%</span>
            </div>
            <input type="range" min={75} max={130} value={settings.fontScale} step={5} onChange={e => update({ fontScale: +e.target.value })} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '10px', color: 'var(--text-mute)', fontFamily: 'var(--font-mono)' }}>
              <span>Tiny</span><span>Default</span><span>Large</span>
            </div>
          </div>

          {/* Density (moved from Layout) */}
          <div className="sp-sec">Density</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '16px' }}>
            {[{ v: 0.6, label: 'Compact', icon: '▪▪▪', desc: 'Best for smaller screens (≤24")' }, { v: 1, label: 'Normal', icon: '▪ ▪ ▪', desc: 'Default spacing' }, { v: 1.2, label: 'Spacious', icon: '▪  ▪  ▪', desc: 'Extra breathing room' }].map(d => (
              <div
                key={d.v}
                className={`dbtn ${settings.density === d.v ? 'on' : ''}`}
                onClick={() => update({ density: d.v })}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); update({ density: d.v }); } }}
                tabIndex={0}
                role="button"
                aria-pressed={settings.density === d.v}
              >
                <div style={{ fontSize: '18px', marginBottom: '4px' }}>{d.icon}</div>
                {d.label}
                {d.desc && <div style={{ fontSize: '9px', color: 'var(--text-mute)', marginTop: '2px', lineHeight: 1.2 }}>{d.desc}</div>}
              </div>
            ))}
          </div>

          {/* Sidebar Width (moved from Layout) */}
          <div className="sp-sec">Sidebar Width</div>
          <div className="sl-row">
            <div className="sl-header">
              <span className="sl-label">Width</span>
              <span className="sl-val">{settings.sidebarWidth}px</span>
            </div>
            <input type="range" min={160} max={280} value={settings.sidebarWidth} step={4} onChange={e => update({ sidebarWidth: +e.target.value })} />
          </div>

          {/* ── Typography (collapsible) ── */}
          <button
            onClick={() => setShowTypography(!showTypography)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: '10px 0', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: 12, fontFamily: 'var(--font-ui)', fontWeight: 600, borderTop: '1px solid var(--border)', marginTop: 8 }}
          >
            {showTypography ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <Type size={13} /> Typography
          </button>
          {showTypography && (
            <div style={{ paddingLeft: 4 }}>
              <div className="sp-sec">Display Font</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '16px' }}>
                {DISPLAY_FONTS.map(f => (
                  <div
                    key={f.family}
                    className={`fpick ${settings.displayFont === f.family ? 'on' : ''}`}
                    onClick={() => update({ displayFont: f.family })}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); update({ displayFont: f.family }); } }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={settings.displayFont === f.family}
                  >
                    <div className="fpick-name" style={{ fontFamily: `'${f.family}', ${f.fallback}` }}>{f.label || f.family}</div>
                    <div className="fpick-sample" style={{ fontFamily: `'${f.family}', ${f.fallback}` }}>The Codex</div>
                  </div>
                ))}
              </div>

              <div className="sp-sec">Body Font</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '16px' }}>
                {BODY_FONTS.map(f => (
                  <div
                    key={f.family}
                    className={`fpick ${settings.bodyFont === f.family ? 'on' : ''}`}
                    onClick={() => update({ bodyFont: f.family })}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); update({ bodyFont: f.family }); } }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={settings.bodyFont === f.family}
                  >
                    <div className="fpick-name" style={{ fontFamily: `'${f.family}', ${f.fallback}` }}>{f.label || f.family}</div>
                    <div className="fpick-sample" style={{ fontFamily: `'${f.family}', ${f.fallback}` }}>Character Sheet</div>
                  </div>
                ))}
              </div>

              <div className="sp-sec">Text Font</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '16px' }}>
                {TEXT_FONTS.map(f => (
                  <div
                    key={f.family}
                    className={`fpick ${settings.textFont === f.family ? 'on' : ''}`}
                    onClick={() => update({ textFont: f.family })}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); update({ textFont: f.family }); } }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={settings.textFont === f.family}
                  >
                    <div className="fpick-name" style={{ fontFamily: `'${f.family}', ${f.fallback}` }}>{f.label || f.family}</div>
                    <div className="fpick-sample" style={{ fontFamily: `'${f.family}', ${f.fallback}` }}>The quick brown fox jumps over the lazy dog.</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Advanced (collapsible) — glow, blur, panel darkness, brightness, border radius ── */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            aria-expanded={showAdvanced}
            style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: '10px 0', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: 12, fontFamily: 'var(--font-ui)', fontWeight: 600, borderTop: '1px solid var(--border)', marginTop: 8 }}
          >
            {showAdvanced ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <Sliders size={13} /> Advanced
          </button>
          {showAdvanced && (
            <div style={{ paddingLeft: 4 }}>
              <div className="sp-sec">Panel Border Radius</div>
              <div className="sl-row">
                <div className="sl-header">
                  <span className="sl-label">Roundness</span>
                  <span className="sl-val">{settings.borderRadius}px</span>
                </div>
                <input type="range" min={0} max={20} value={settings.borderRadius} step={2} onChange={e => update({ borderRadius: +e.target.value })} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '10px', color: 'var(--text-mute)', fontFamily: 'var(--font-mono)' }}>
                  <span>Sharp</span><span>Rounded</span><span>Pill</span>
                </div>
              </div>

              <div className="sp-sec">Effects</div>
              <div className="sl-row">
                <div className="sl-header">
                  <span className="sl-label">Glow intensity</span>
                  <span className="sl-val">{settings.glowIntensity}%</span>
                </div>
                <input type="range" min={0} max={100} value={settings.glowIntensity} step={5} onChange={e => update({ glowIntensity: +e.target.value })} />
              </div>

              <div className="sl-row">
                <div className="sl-header">
                  <span className="sl-label">Backdrop blur</span>
                  <span className="sl-val">{settings.panelBlur}px</span>
                </div>
                <input type="range" min={0} max={32} value={settings.panelBlur} step={4} onChange={e => update({ panelBlur: +e.target.value })} />
              </div>

              <div className="sl-row">
                <div className="sl-header">
                  <span className="sl-label">Panel darkness</span>
                  <span className="sl-val">{settings.panelOpacity}%</span>
                </div>
                <input type="range" min={1} max={15} value={settings.panelOpacity} step={1} onChange={e => update({ panelOpacity: +e.target.value })} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '10px', color: 'var(--text-mute)', fontFamily: 'var(--font-mono)' }}>
                  <span>Ghost</span><span>Glass</span><span>Solid</span>
                </div>
              </div>

              <div className="sl-row">
                <div className="sl-header">
                  <span className="sl-label">Brightness</span>
                  <span className="sl-val">{settings.brightness ?? 100}%</span>
                </div>
                <input type="range" min={40} max={130} value={settings.brightness ?? 100} step={5} onChange={e => update({ brightness: +e.target.value })} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '10px', color: 'var(--text-mute)', fontFamily: 'var(--font-mono)' }}>
                  <span>Dim</span><span>Normal</span><span>Bright</span>
                </div>
              </div>
            </div>
          )}

          <button className="reset-btn" onClick={() => setShowResetConfirm(true)} style={{ marginTop: 16 }}>↺ Reset all to defaults</button>
        </div>
      )}

      {/* ── GAMEPLAY TAB ── */}
      {activeTab === 'gameplay' && (
        <div>
          <div className="sp-sec">Session Style</div>
          <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '12px', lineHeight: 1.5 }}>
            How is your DM running the game? This adjusts which features are shown.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
            {[
              { id: 'solo', icon: BookOpen, label: 'Solo Tracker', desc: 'DM uses books or another app. You track your own character, rolls, and resources independently.' },
              { id: 'connected', icon: Monitor, label: 'Party Connect', desc: 'DM uses The Codex. Enables live session sync, shared initiative, and DM broadcasts.' },
            ].map(opt => (
              <div
                key={opt.id}
                onClick={() => update({ sessionStyle: opt.id })}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); update({ sessionStyle: opt.id }); } }}
                tabIndex={0}
                role="button"
                aria-pressed={settings.sessionStyle === opt.id}
                style={{
                  padding: '16px 14px',
                  borderRadius: '10px',
                  border: `2px solid ${settings.sessionStyle === opt.id ? 'var(--accent)' : 'var(--border)'}`,
                  background: settings.sessionStyle === opt.id ? 'rgba(124,58,237,0.08)' : 'var(--bg-panel)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  textAlign: 'center',
                }}
              >
                <opt.icon size={24} style={{ margin: '0 auto 8px', color: settings.sessionStyle === opt.id ? 'var(--accent-l)' : 'var(--text-dim)' }} />
                <div style={{ fontSize: '13px', fontWeight: 600, color: settings.sessionStyle === opt.id ? 'var(--text)' : 'var(--text-dim)', fontFamily: 'var(--font-ui)', marginBottom: '4px' }}>
                  {opt.label}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-mute)', lineHeight: 1.4 }}>
                  {opt.desc}
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', fontSize: '11px', color: 'rgba(201,168,76,0.7)', lineHeight: 1.5 }}>
            {settings.sessionStyle === 'solo'
              ? 'Solo Tracker mode focuses on personal character management — combat tracking, dice rolls, spell slots, and HP are all self-managed. Perfect when your DM runs the game from physical books.'
              : 'Party Connect mode enables live session features — join your DM\'s session, see shared initiative, receive broadcasts, and sync party data in real-time.'}
          </div>

          <div className="sp-sec" style={{ marginTop: '20px' }}>Dice Roller</div>
          <div className="tog-row">
            <div><div className="tog-label">Sidebar dice buttons</div><div className="tog-desc">Quick d4–d100 roller in the sidebar</div></div>
            <div className={`toggle ${settings.sidebarDice !== false ? 'on' : ''}`} onClick={() => update({ sidebarDice: settings.sidebarDice === false ? true : false })} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); update({ sidebarDice: settings.sidebarDice === false ? true : false }); } }} tabIndex={0} role="switch" aria-checked={settings.sidebarDice !== false} />
          </div>

          <div className="sp-sec" style={{ marginTop: '20px' }}>Encumbrance Rules</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
            {[
              { id: 'variant', label: 'Variant', desc: 'STR×5 encumbered, STR×10 heavily (default 5e optional rule)' },
              { id: 'standard', label: 'Standard', desc: 'No penalty until you exceed STR×15 carry capacity' },
            ].map(opt => (
              <div
                key={opt.id}
                className={`dbtn ${(settings.encumbrance || 'variant') === opt.id ? 'on' : ''}`}
                onClick={() => update({ encumbrance: opt.id })}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); update({ encumbrance: opt.id }); } }}
                tabIndex={0}
                role="button"
                aria-pressed={(settings.encumbrance || 'variant') === opt.id}
              >
                {opt.label}
                <div style={{ fontSize: '9px', color: 'var(--text-mute)', marginTop: '2px', lineHeight: 1.2 }}>{opt.desc}</div>
              </div>
            ))}
          </div>

          <div className="sp-sec" style={{ marginTop: '20px' }}>Critical Hit Rule</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
            {[
              { id: 'standard', label: 'Standard', desc: 'Double all damage dice on a critical hit' },
              { id: 'maxPlusRoll', label: 'Max + Roll', desc: 'Max damage die + a normal roll (homebrew, less swingy)' },
            ].map(opt => (
              <div
                key={opt.id}
                className={`dbtn ${(settings.criticalHitRule || 'standard') === opt.id ? 'on' : ''}`}
                onClick={() => update({ criticalHitRule: opt.id })}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); update({ criticalHitRule: opt.id }); } }}
                tabIndex={0} role="button" aria-pressed={(settings.criticalHitRule || 'standard') === opt.id}
              >
                {opt.label}
                <div style={{ fontSize: '9px', color: 'var(--text-mute)', marginTop: '2px', lineHeight: 1.2 }}>{opt.desc}</div>
              </div>
            ))}
          </div>

          <div className="sp-sec" style={{ marginTop: '20px' }}>Rest Variant</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
            {[
              { id: 'standard', label: 'Standard', desc: 'Short rest = 1 hour, Long rest = 8 hours' },
              { id: 'gritty', label: 'Gritty Realism', desc: 'Short rest = 8 hours, Long rest = 7 days (DMG variant)' },
            ].map(opt => (
              <div
                key={opt.id}
                className={`dbtn ${(settings.restVariant || 'standard') === opt.id ? 'on' : ''}`}
                onClick={() => update({ restVariant: opt.id })}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); update({ restVariant: opt.id }); } }}
                tabIndex={0} role="button" aria-pressed={(settings.restVariant || 'standard') === opt.id}
              >
                {opt.label}
                <div style={{ fontSize: '9px', color: 'var(--text-mute)', marginTop: '2px', lineHeight: 1.2 }}>{opt.desc}</div>
              </div>
            ))}
          </div>

          <div className="sp-sec" style={{ marginTop: '20px' }}>Optional Rules</div>
          <div className="tog-row">
            <div><div className="tog-label">Flanking</div><div className="tog-desc">Melee attacks gain advantage when flanking a creature</div></div>
            <div className={`toggle ${settings.flanking !== false ? 'on' : ''}`} onClick={() => update({ flanking: !settings.flanking })} tabIndex={0} role="switch" aria-checked={settings.flanking !== false} />
          </div>
          <div className="tog-row">
            <div><div className="tog-label">Allow Feats</div><div className="tog-desc">Players can choose feats instead of ability score improvements</div></div>
            <div className={`toggle ${settings.allowFeats !== false ? 'on' : ''}`} onClick={() => update({ allowFeats: settings.allowFeats === false ? true : false })} tabIndex={0} role="switch" aria-checked={settings.allowFeats !== false} />
          </div>
          <div className="tog-row">
            <div><div className="tog-label">Allow Multiclassing</div><div className="tog-desc">Players can take levels in multiple classes</div></div>
            <div className={`toggle ${settings.allowMulticlass !== false ? 'on' : ''}`} onClick={() => update({ allowMulticlass: settings.allowMulticlass === false ? true : false })} tabIndex={0} role="switch" aria-checked={settings.allowMulticlass !== false} />
          </div>

          <div className="sp-sec" style={{ marginTop: '20px' }}>Movement</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
            {[
              { id: 'standard', label: 'Standard', desc: 'Diagonal movement costs 5 ft per square' },
              { id: 'alternating', label: 'Alternating', desc: 'Diagonals alternate 5 ft / 10 ft (DMG variant)' },
            ].map(opt => (
              <div
                key={opt.id}
                className={`dbtn ${(settings.diagonalMovement || 'standard') === opt.id ? 'on' : ''}`}
                onClick={() => update({ diagonalMovement: opt.id })}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); update({ diagonalMovement: opt.id }); } }}
                tabIndex={0} role="button" aria-pressed={(settings.diagonalMovement || 'standard') === opt.id}
              >
                {opt.label}
                <div style={{ fontSize: '9px', color: 'var(--text-mute)', marginTop: '2px', lineHeight: 1.2 }}>{opt.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── AI ASSISTANT TAB ── */}
      {activeTab === 'ai' && (
        <AiSettingsTab />
      )}

      {/* ── Feedback & Export ── */}
      <div style={{ borderTop: '1px solid var(--border)', marginTop: 24, paddingTop: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-mute)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Quick Actions</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button
            onClick={() => navigateToSection('export')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-dim)', fontSize: 12, fontFamily: 'var(--font-ui)', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-dim)'; }}
          >
            <Download size={14} /> Export & Import
          </button>
          <button
            onClick={() => navigateToSection('bugreport')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-dim)', fontSize: 12, fontFamily: 'var(--font-ui)', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-dim)'; }}
          >
            <Bug size={14} /> Bug Report
          </button>
          <button
            onClick={() => navigateToSection('featurerequest')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-dim)', fontSize: 12, fontFamily: 'var(--font-ui)', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-dim)'; }}
          >
            <Lightbulb size={14} /> Feature Request
          </button>
          <button
            onClick={() => navigateToSection('party-connect')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-dim)', fontSize: 12, fontFamily: 'var(--font-ui)', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-dim)'; }}
          >
            <Sliders size={14} /> Party Connect
          </button>
        </div>
      </div>

      <ConfirmDialog
        show={showResetConfirm}
        title="Reset Settings?"
        message="This will restore all interface, typography, and layout settings to their defaults."
        onConfirm={() => { resetAll(); setShowResetConfirm(false); }}
        onCancel={() => setShowResetConfirm(false)}
      />

      {/* Dev access gate - click version 5 times to reveal */}
      <div
        onClick={() => {
          const next = devTapCount + 1;
          setDevTapCount(next);
          if (next >= 5 && !devUnlocked) {
            setShowDevInput(true);
            setDevTapCount(0);
          }
        }}
        style={{ marginTop: 24, textAlign: 'center', cursor: 'default', userSelect: 'none' }}
      >
        <span style={{ fontSize: 10, color: 'var(--text-mute)', fontFamily: 'var(--font-mono)' }}>
          {APP_VERSION} {devUnlocked ? '(Dev)' : ''}
        </span>
      </div>

      {showDevInput && !devUnlocked && (
        <div style={{
          marginTop: 12, padding: 16, borderRadius: 10,
          background: 'rgba(155,89,182,0.06)', border: '1px solid rgba(155,89,182,0.15)',
        }}>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 8 }}>Enter dev passphrase:</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="password"
              value={devPassphrase}
              onChange={e => setDevPassphrase(e.target.value)}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
              onKeyDown={async e => {
                if (e.key === 'Enter' && devPassphrase) {
                  try {
                    const valid = await invoke('verify_dev_passphrase', { passphrase: devPassphrase });
                    if (valid) {
                      localStorage.setItem('codex-dev-unlocked', 'true');
                      setDevUnlocked(true);
                      setShowDevInput(false);
                      toast.success('Dev access unlocked');
                    } else {
                      toast.error('Invalid passphrase');
                    }
                  } catch { toast.error('Verification failed'); }
                  setDevPassphrase('');
                }
              }}
              placeholder="Passphrase..."
              style={{
                flex: 1, padding: '6px 10px', borderRadius: 6,
                background: 'var(--bg-input)', border: '1px solid var(--border)',
                color: 'var(--text)', fontSize: 12, fontFamily: 'var(--font-mono)',
                outline: 'none',
              }}
            />
            <button
              onClick={() => { setShowDevInput(false); setDevPassphrase(''); }}
              style={{
                padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)',
                background: 'none', color: 'var(--text-mute)', fontSize: 11, cursor: 'pointer',
              }}
            >Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
