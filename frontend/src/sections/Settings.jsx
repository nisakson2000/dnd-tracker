import { useState, useEffect, useCallback } from 'react';
import { Settings2, Palette, Type, LayoutGrid, Wifi, RotateCcw, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import Party from './Party';
import ConfirmDialog from '../components/ConfirmDialog';
import { checkOllamaStatus, listModels } from '../api/assistant';

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
  } catch (err) {
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
  try { localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(s)); } catch {}
}

function AiSettingsTab() {
  const [aiSettings, setAiSettings] = useState(() => loadAiSettings());
  const [status, setStatus] = useState(null);
  const [checking, setChecking] = useState(false);
  const [models, setModels] = useState([]);

  const checkStatus = async () => {
    setChecking(true);
    const result = await checkOllamaStatus(aiSettings.model);
    setStatus(result);
    if (result.available) {
      const modelList = await listModels();
      setModels(modelList);
    }
    setChecking(false);
  };

  useEffect(() => { checkStatus(); }, []);

  const updateAi = (updates) => {
    const next = { ...aiSettings, ...updates };
    setAiSettings(next);
    saveAiSettings(next);
  };

  return (
    <div>
      <div className="tog-row">
        <div>
          <div className="tog-label">Enable AI Assistant</div>
          <div className="tog-desc">Adds an "Arcane Advisor" section powered by a local Ollama model</div>
        </div>
        <div
          className={`toggle ${aiSettings.enabled ? 'on' : ''}`}
          onClick={() => updateAi({ enabled: !aiSettings.enabled })}
          tabIndex={0}
          role="switch"
          aria-checked={aiSettings.enabled}
        />
      </div>

      <div style={{
        padding: 14, borderRadius: 10, marginTop: 12,
        background: 'var(--bg-panel)', border: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span className="sp-sec" style={{ margin: 0 }}>Connection Status</span>
          <button
            onClick={checkStatus}
            disabled={checking}
            style={{
              padding: '4px 12px', borderRadius: 6, fontSize: 11,
              background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)',
              color: 'rgba(201,168,76,0.7)', cursor: 'pointer', fontFamily: 'var(--font-display)',
            }}
          >
            {checking ? 'Checking...' : 'Test Connection'}
          </button>
        </div>
        {status === null ? (
          <div style={{ color: 'var(--text-mute)', fontSize: 12 }}>Checking...</div>
        ) : status.available ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.4)' }} />
              <span style={{ fontSize: 12, color: '#22c55e' }}>Ollama running</span>
            </div>
            {status.modelInstalled ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.4)' }} />
                <span style={{ fontSize: 12, color: '#22c55e' }}>Model "{aiSettings.model}" ready</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#f59e0b' }} />
                <span style={{ fontSize: 12, color: '#f59e0b' }}>Model "{aiSettings.model}" not installed</span>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ fontSize: 12, color: '#ef4444' }}>Ollama not running</span>
          </div>
        )}
      </div>

      {status?.available && models.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div className="sp-sec">Model</div>
          <select
            value={aiSettings.model}
            onChange={e => { updateAi({ model: e.target.value }); setTimeout(checkStatus, 100); }}
            style={{
              width: '100%', padding: '8px 12px', borderRadius: 8, fontSize: 12,
              background: 'var(--bg-input, rgba(0,0,0,0.3))', border: '1px solid var(--border)',
              color: 'var(--text)', fontFamily: 'var(--font-ui)', outline: 'none', cursor: 'pointer',
            }}
          >
            {models.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
          </select>
        </div>
      )}

      {(!status?.available || !status?.modelInstalled) && (
        <div style={{
          marginTop: 14, padding: 14, borderRadius: 10,
          background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.12)',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--text)', marginBottom: 8 }}>Setup Guide</div>
          <ol style={{ paddingLeft: 18, fontSize: 12, color: 'var(--text-sub)', lineHeight: 2 }}>
            {!status?.available && (
              <>
                <li>Download Ollama from <span style={{ color: 'var(--accent-l)' }}>https://ollama.ai</span></li>
                <li>Install and start it</li>
              </>
            )}
            <li>Run in terminal: <code style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: 4, fontSize: 11 }}>ollama pull phi3.5</code></li>
            <li>Click "Test Connection" above</li>
          </ol>
          <p style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 8, fontStyle: 'italic' }}>
            Runs entirely on your machine. On CPU-only hardware, expect 5–15s response times.
          </p>
        </div>
      )}
    </div>
  );
}

export default function Settings({ characterId, character, onBugReport }) {
  const [settings, setSettings] = useState(() => loadV3Settings());
  const [activeTab, setActiveTab] = useState('interface');
  const [customHex, setCustomHex] = useState(settings.accent);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

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

  const tabs = [
    { id: 'interface', label: 'Interface', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'layout', label: 'Layout', icon: LayoutGrid },
    { id: 'party', label: 'Party Connect', icon: Wifi },
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
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              flex: 1, padding: '10px 8px', fontSize: '11px', fontWeight: 500,
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
        </div>
      )}

      {/* ── TYPOGRAPHY TAB ── */}
      {activeTab === 'typography' && (
        <div>
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
        </div>
      )}

      {/* ── LAYOUT TAB ── */}
      {activeTab === 'layout' && (
        <div>
          <div className="sp-sec">Density</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '16px' }}>
            {[{ v: 0.8, label: 'Compact', icon: '▪▪▪' }, { v: 1, label: 'Normal', icon: '▪ ▪ ▪' }, { v: 1.2, label: 'Spacious', icon: '▪  ▪  ▪' }].map(d => (
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
              </div>
            ))}
          </div>

          <div className="sp-sec">Sidebar Width</div>
          <div className="sl-row">
            <div className="sl-header">
              <span className="sl-label">Width</span>
              <span className="sl-val">{settings.sidebarWidth}px</span>
            </div>
            <input type="range" min={160} max={280} value={settings.sidebarWidth} step={4} onChange={e => update({ sidebarWidth: +e.target.value })} />
          </div>

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

          <button className="reset-btn" onClick={() => setShowResetConfirm(true)}>↺ Reset all to defaults</button>
        </div>
      )}

      {/* ── PARTY TAB ── */}
      {activeTab === 'party' && (
        <Party characterId={characterId} character={character} onBugReport={onBugReport} />
      )}

      {/* ── AI ASSISTANT TAB ── */}
      {activeTab === 'ai' && (
        <AiSettingsTab />
      )}

      <ConfirmDialog
        show={showResetConfirm}
        title="Reset Settings?"
        message="This will restore all interface, typography, and layout settings to their defaults."
        onConfirm={() => { resetAll(); setShowResetConfirm(false); }}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
}
