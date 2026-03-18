import { useState, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import {
  Sun, Cloud, CloudRain, CloudSnow, Wind, CloudLightning,
  Snowflake, CloudDrizzle, Eye, RefreshCw, Save, Loader2,
  Thermometer, Droplets, ChevronDown, History, AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

const SEASONS = ['spring', 'summer', 'autumn', 'winter'];

const PRECIPITATION_OPTIONS = [
  'None', 'Light Drizzle', 'Rain', 'Heavy Rain', 'Thunderstorm',
  'Snow', 'Heavy Snow', 'Blizzard', 'Hail', 'Fog', 'Mist'
];

const WIND_OPTIONS = ['Calm', 'Light Breeze', 'Moderate', 'Strong', 'Gale', 'Hurricane'];

const SPECIAL_EFFECTS = [
  'None', 'Magical Aurora', 'Ash Fall', 'Blood Moon', 'Ethereal Fog',
  'Wild Magic Storm', 'Feywild Bleed', 'Shadowfell Gloom', 'Elemental Surge'
];

const MECHANICAL_EFFECTS = {
  'Heavy Rain': 'Disadvantage on Perception checks (sight/hearing). Extinguishes open flames.',
  'Thunderstorm': 'Disadvantage on Perception checks. Ranged attacks at disadvantage beyond normal range.',
  'Blizzard': 'Heavily obscured. Movement costs doubled. CON saves vs exhaustion each hour.',
  'Heavy Snow': 'Lightly obscured. Difficult terrain.',
  'Fog': 'Heavily obscured beyond 30 ft.',
  'Mist': 'Lightly obscured beyond 60 ft.',
  'Gale': 'Disadvantage on ranged weapon attacks. Flying creatures must succeed DEX save or be knocked prone.',
  'Hurricane': 'Impossible to use ranged weapons. Flying is impossible. STR save to move.',
  'Hail': '1d4 bludgeoning damage per round if unsheltered. Disadvantage on Perception.',
  'Wild Magic Storm': 'Any spell cast triggers a Wild Magic Surge roll.',
  'Ethereal Fog': 'Creatures can faintly see into the Ethereal Plane.',
  'Shadowfell Gloom': 'Wisdom saves (DC 10) each hour or gain 1 level of melancholy.',
  'Elemental Surge': 'Spells of a random element deal +1d6 damage.',
};

function getWeatherIcon(precipitation, wind) {
  if (!precipitation || precipitation === 'None') {
    if (wind === 'Gale' || wind === 'Hurricane') return <Wind size={28} className="text-purple-300" />;
    if (wind === 'Strong') return <Wind size={28} className="text-purple-300/70" />;
    return <Sun size={28} className="text-amber-300" />;
  }
  const p = precipitation.toLowerCase();
  if (p.includes('blizzard')) return <Snowflake size={28} className="text-blue-200" />;
  if (p.includes('snow')) return <CloudSnow size={28} className="text-blue-200" />;
  if (p.includes('thunder')) return <CloudLightning size={28} className="text-yellow-300" />;
  if (p.includes('heavy rain') || p.includes('hail')) return <CloudRain size={28} className="text-blue-400" />;
  if (p.includes('rain')) return <CloudRain size={28} className="text-blue-300" />;
  if (p.includes('drizzle')) return <CloudDrizzle size={28} className="text-blue-200/70" />;
  if (p.includes('fog') || p.includes('mist')) return <Cloud size={28} className="text-gray-400" />;
  return <Cloud size={28} className="text-gray-300" />;
}

// ── Weather categories for travel/combat modifiers ──
const WEATHER_TRAVEL_MODIFIERS = {
  'Rain': 1.0,
  'Heavy Rain': 1.5,
  'Thunderstorm': 1.5,
  'Snow': 1.5,
  'Heavy Snow': 1.5,
  'Blizzard': 2.0,
  'Hail': 1.5,
  'Fog': 1.0,
  'Mist': 1.0,
  'Light Drizzle': 1.0,
};

const WIND_TRAVEL_MODIFIERS = {
  'Gale': 1.5,
  'Hurricane': 2.0,
};

// ── Combat-relevant effects structured for programmatic use ──
const COMBAT_EFFECTS = {
  'Heavy Rain': [
    { type: 'disadvantage', target: 'Perception checks (sight & hearing)', icon: 'eye' },
    { type: 'disadvantage', target: 'Ranged attacks beyond normal range', icon: 'crosshair' },
    { type: 'effect', target: 'Extinguishes open flames', icon: 'flame' },
  ],
  'Thunderstorm': [
    { type: 'disadvantage', target: 'Perception checks', icon: 'eye' },
    { type: 'disadvantage', target: 'Ranged attacks beyond normal range', icon: 'crosshair' },
  ],
  'Blizzard': [
    { type: 'obscured', target: 'Heavily obscured — all areas', icon: 'eye-off' },
    { type: 'movement', target: 'Movement cost doubled', icon: 'footprints' },
    { type: 'save', target: 'CON save vs exhaustion each hour', icon: 'heart' },
  ],
  'Heavy Snow': [
    { type: 'obscured', target: 'Lightly obscured', icon: 'eye' },
    { type: 'terrain', target: 'Difficult terrain', icon: 'mountain' },
  ],
  'Fog': [
    { type: 'obscured', target: 'Heavily obscured beyond 30 ft', icon: 'eye-off' },
  ],
  'Mist': [
    { type: 'obscured', target: 'Lightly obscured beyond 60 ft', icon: 'eye' },
  ],
  'Gale': [
    { type: 'disadvantage', target: 'Ranged weapon attacks', icon: 'crosshair' },
    { type: 'disadvantage', target: 'Hearing-based Perception checks', icon: 'ear' },
    { type: 'save', target: 'Flying creatures: DEX save or knocked prone', icon: 'wind' },
  ],
  'Hurricane': [
    { type: 'impossible', target: 'Ranged weapons cannot be used', icon: 'crosshair' },
    { type: 'impossible', target: 'Flying is impossible', icon: 'wind' },
    { type: 'save', target: 'STR save to move against wind', icon: 'shield' },
  ],
  'Strong': [  // Strong wind
    { type: 'disadvantage', target: 'Ranged attacks', icon: 'crosshair' },
    { type: 'disadvantage', target: 'Hearing-based Perception checks', icon: 'ear' },
  ],
  'Hail': [
    { type: 'damage', target: '1d4 bludgeoning per round if unsheltered', icon: 'zap' },
    { type: 'disadvantage', target: 'Perception checks', icon: 'eye' },
  ],
  // Extreme cold (below 0°F)
  '_extreme_cold': [
    { type: 'save', target: 'CON save (DC 10) each hour or gain 1 exhaustion', icon: 'thermometer' },
  ],
};

/**
 * Get structured weather effects for programmatic use (combat modifiers, etc.)
 * Exported for use by other components.
 *
 * @param {Object} weatherState
 * @param {string} weatherState.precipitation
 * @param {string} weatherState.wind
 * @param {string} weatherState.specialEffects
 * @param {number} [weatherState.temperature]
 * @returns {{ mechanical: Array, combat: Array, travelMultiplier: number, summary: string }}
 */
export function getWeatherEffects(weatherState = {}) {
  const { precipitation = 'None', wind = 'Calm', specialEffects = 'None', temperature } = weatherState;

  const mechanical = [];
  const combat = [];
  let travelMultiplier = 1.0;

  // Precipitation effects
  if (precipitation && precipitation !== 'None') {
    if (MECHANICAL_EFFECTS[precipitation]) {
      mechanical.push({ source: precipitation, text: MECHANICAL_EFFECTS[precipitation] });
    }
    if (COMBAT_EFFECTS[precipitation]) {
      combat.push(...COMBAT_EFFECTS[precipitation].map(e => ({ ...e, source: precipitation })));
    }
    if (WEATHER_TRAVEL_MODIFIERS[precipitation]) {
      travelMultiplier = Math.max(travelMultiplier, WEATHER_TRAVEL_MODIFIERS[precipitation]);
    }
  }

  // Wind effects
  if (wind && wind !== 'Calm' && wind !== 'Light Breeze' && wind !== 'Moderate') {
    if (MECHANICAL_EFFECTS[wind]) {
      mechanical.push({ source: wind, text: MECHANICAL_EFFECTS[wind] });
    }
    if (COMBAT_EFFECTS[wind]) {
      combat.push(...COMBAT_EFFECTS[wind].map(e => ({ ...e, source: wind })));
    }
    if (WIND_TRAVEL_MODIFIERS[wind]) {
      travelMultiplier = Math.max(travelMultiplier, WIND_TRAVEL_MODIFIERS[wind]);
    }
  }

  // Special effects
  if (specialEffects && specialEffects !== 'None' && MECHANICAL_EFFECTS[specialEffects]) {
    mechanical.push({ source: specialEffects, text: MECHANICAL_EFFECTS[specialEffects] });
    if (COMBAT_EFFECTS[specialEffects]) {
      combat.push(...COMBAT_EFFECTS[specialEffects].map(e => ({ ...e, source: specialEffects })));
    }
  }

  // Extreme cold
  if (temperature != null && temperature <= 0) {
    mechanical.push({ source: 'Extreme Cold', text: 'CON save (DC 10) each hour or gain 1 level of exhaustion.' });
    combat.push(...COMBAT_EFFECTS['_extreme_cold'].map(e => ({ ...e, source: 'Extreme Cold' })));
  }

  // Build summary
  const parts = [];
  if (precipitation !== 'None') parts.push(precipitation);
  if (wind !== 'Calm') parts.push(`${wind} wind`);
  if (specialEffects !== 'None') parts.push(specialEffects);
  const summary = parts.length > 0 ? parts.join(', ') : 'Clear skies';

  return { mechanical, combat, travelMultiplier, summary };
}

function getActiveMechanicalEffects(precipitation, wind, specialEffects) {
  const effects = [];
  if (precipitation && MECHANICAL_EFFECTS[precipitation]) {
    effects.push({ source: precipitation, text: MECHANICAL_EFFECTS[precipitation] });
  }
  if (wind && MECHANICAL_EFFECTS[wind]) {
    effects.push({ source: wind, text: MECHANICAL_EFFECTS[wind] });
  }
  if (specialEffects && specialEffects !== 'None' && MECHANICAL_EFFECTS[specialEffects]) {
    effects.push({ source: specialEffects, text: MECHANICAL_EFFECTS[specialEffects] });
  }
  return effects;
}

export default function WeatherPanel() {
  const [region, setRegion] = useState('default');
  const [season, setSeason] = useState('summer');
  const [temperature, setTemperature] = useState('72');
  const [precipitation, setPrecipitation] = useState('None');
  const [wind, setWind] = useState('Calm');
  const [specialEffects, setSpecialEffects] = useState('None');
  const [saving, setSaving] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [weatherHistory, setWeatherHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showOverride, setShowOverride] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const currentEffects = getActiveMechanicalEffects(precipitation, wind, specialEffects);

  const applyWeatherState = useCallback((data) => {
    if (!data) return;
    setTemperature(String(data.temperature ?? '72'));
    setPrecipitation(data.precipitation || 'None');
    setWind(data.wind || 'Calm');
    setSpecialEffects(data.special_effects || data.specialEffects || 'None');
    if (data.season) setSeason(data.season);
    if (data.region) setRegion(data.region);
  }, []);

  const handleLoad = async () => {
    setLoading(true);
    try {
      const data = await invoke('get_weather', { region: region || 'default' });
      applyWeatherState(data);
      toast.success(`Loaded weather for "${region}"`);
    } catch (err) {
      console.error('[WeatherPanel] get_weather:', err);
      toast.error('Failed to load weather');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const mechanicalEffectsJson = JSON.stringify(currentEffects);
      await invoke('set_weather', {
        region: region || 'default',
        season,
        temperature: parseInt(temperature) || 72,
        precipitation,
        wind,
        specialEffects,
        mechanicalEffectsJson,
      });
      addToHistory();
      toast.success('Weather saved');
    } catch (err) {
      console.error('[WeatherPanel] set_weather:', err);
      toast.error('Failed to save weather');
    } finally {
      setSaving(false);
    }
  };

  const handleAdvance = async () => {
    setAdvancing(true);
    setTransitioning(true);
    try {
      const newWeather = await invoke('advance_weather', { region: region || 'default' });
      addToHistory();
      setTimeout(() => {
        applyWeatherState(newWeather);
        setTransitioning(false);
        toast.success('Weather advanced');
      }, 400);
    } catch (err) {
      console.error('[WeatherPanel] advance_weather:', err);
      toast.error('Failed to advance weather');
      setTransitioning(false);
    } finally {
      setAdvancing(false);
    }
  };

  const addToHistory = () => {
    const snapshot = {
      timestamp: new Date().toLocaleTimeString(),
      temperature,
      precipitation,
      wind,
      specialEffects,
      season,
      region,
    };
    setWeatherHistory(prev => [snapshot, ...prev].slice(0, 5));
  };

  const tempNum = parseInt(temperature) || 72;
  const tempColor = tempNum <= 32 ? 'text-blue-300' : tempNum <= 50 ? 'text-cyan-300' : tempNum <= 75 ? 'text-green-300' : tempNum <= 90 ? 'text-orange-300' : 'text-red-400';

  return (
    <div className="space-y-3">
      {/* Current Weather Display */}
      <div
        className="rounded-xl p-4 border transition-all duration-500"
        style={{
          background: 'rgba(255,255,255,0.03)',
          borderColor: 'rgba(255,255,255,0.06)',
          opacity: transitioning ? 0.4 : 1,
          transform: transitioning ? 'scale(0.98)' : 'scale(1)',
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {getWeatherIcon(precipitation, wind)}
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${tempColor}`}>{temperature}°F</span>
                <span className="text-xs px-1.5 py-0.5 rounded border capitalize"
                  style={{ borderColor: 'rgba(192,132,252,0.25)', color: '#c084fc', background: 'rgba(192,132,252,0.08)' }}>
                  {season}
                </span>
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>
                Region: <span style={{ color: 'var(--text)' }}>{region}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleLoad}
              disabled={loading}
              className="p-1.5 rounded hover:bg-white/5 transition-all cursor-pointer"
              style={{ color: 'var(--text-mute)' }}
              title="Load weather"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-1.5 rounded hover:bg-white/5 transition-all cursor-pointer"
              style={{ color: showHistory ? '#c084fc' : 'var(--text-mute)' }}
              title="Weather history"
            >
              <History size={14} />
            </button>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="flex items-center gap-1 mb-0.5" style={{ color: 'var(--text-mute)' }}>
              <Droplets size={10} /> Precipitation
            </div>
            <div style={{ color: 'var(--text)' }}>{precipitation}</div>
          </div>
          <div className="rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="flex items-center gap-1 mb-0.5" style={{ color: 'var(--text-mute)' }}>
              <Wind size={10} /> Wind
            </div>
            <div style={{ color: 'var(--text)' }}>{wind}</div>
          </div>
          <div className="rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="flex items-center gap-1 mb-0.5" style={{ color: 'var(--text-mute)' }}>
              <Thermometer size={10} /> Special
            </div>
            <div style={{ color: 'var(--text)' }}>{specialEffects}</div>
          </div>
        </div>

        {/* Mechanical Effects */}
        {currentEffects.length > 0 && (
          <div className="mt-3 space-y-1.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1" style={{ color: '#c084fc' }}>
              <AlertTriangle size={10} /> Active Effects
            </div>
            {currentEffects.map((effect, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded-lg p-2 text-xs"
                style={{ background: 'rgba(192,132,252,0.06)', border: '1px solid rgba(192,132,252,0.15)' }}
              >
                <AlertTriangle size={12} className="text-purple-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-purple-300 font-medium">{effect.source}:</span>{' '}
                  <span style={{ color: 'var(--text-dim)' }}>{effect.text}</span>
                </div>
              </div>
            ))}
            {/* Combat Modifiers Summary */}
            {(() => {
              const wx = getWeatherEffects({ precipitation, wind, specialEffects, temperature: parseInt(temperature) });
              if (wx.combat.length === 0) return null;
              return (
                <div
                  className="rounded-lg p-2"
                  style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#f87171' }}>
                    Combat Modifiers
                  </div>
                  <div className="space-y-1">
                    {wx.combat.map((mod, j) => (
                      <div key={j} className="flex items-center gap-1.5 text-[11px]">
                        <span className="px-1 py-0 rounded text-[9px] font-bold uppercase" style={{
                          background: mod.type === 'disadvantage' ? 'rgba(251,146,60,0.2)' :
                            mod.type === 'impossible' ? 'rgba(239,68,68,0.2)' :
                            mod.type === 'save' ? 'rgba(96,165,250,0.2)' :
                            mod.type === 'damage' ? 'rgba(239,68,68,0.2)' :
                            'rgba(255,255,255,0.1)',
                          color: mod.type === 'disadvantage' ? '#fb923c' :
                            mod.type === 'impossible' ? '#ef4444' :
                            mod.type === 'save' ? '#60a5fa' :
                            mod.type === 'damage' ? '#ef4444' :
                            'var(--text-dim)',
                        }}>
                          {mod.type}
                        </span>
                        <span style={{ color: 'var(--text-dim)' }}>{mod.target}</span>
                      </div>
                    ))}
                  </div>
                  {wx.travelMultiplier > 1 && (
                    <div className="mt-1.5 pt-1.5 border-t text-[10px] flex items-center gap-1" style={{ borderColor: 'rgba(239,68,68,0.1)', color: '#fb923c' }}>
                      Travel time: {wx.travelMultiplier === 2 ? 'Doubled' : '+50%'}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleAdvance}
          disabled={advancing}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-lg border transition-all cursor-pointer hover:brightness-110"
          style={{
            background: 'rgba(192,132,252,0.12)',
            borderColor: 'rgba(192,132,252,0.3)',
            color: '#c084fc',
          }}
        >
          {advancing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
          Advance Weather
        </button>
        <button
          onClick={() => setShowOverride(!showOverride)}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border transition-all cursor-pointer"
          style={{
            background: showOverride ? 'rgba(192,132,252,0.08)' : 'rgba(255,255,255,0.03)',
            borderColor: showOverride ? 'rgba(192,132,252,0.25)' : 'rgba(255,255,255,0.06)',
            color: showOverride ? '#c084fc' : 'var(--text-dim)',
          }}
        >
          <ChevronDown size={13} style={{ transform: showOverride ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          Manual Override
        </button>
      </div>

      {/* Manual Override */}
      {showOverride && (
        <div
          className="rounded-xl p-3 space-y-2.5 border"
          style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-dim)' }}>Manual Override</div>

          {/* Region & Season */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] mb-1 block" style={{ color: 'var(--text-mute)' }}>Region</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full text-xs rounded px-2.5 py-1.5 border focus:outline-none"
                style={{
                  background: 'rgba(0,0,0,0.2)',
                  borderColor: 'rgba(255,255,255,0.1)',
                  color: 'var(--text)',
                }}
                placeholder="Region name"
              />
            </div>
            <div>
              <label className="text-[10px] mb-1 block" style={{ color: 'var(--text-mute)' }}>Season</label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full text-xs rounded px-2 py-1.5 border focus:outline-none cursor-pointer"
                style={{
                  background: 'rgba(0,0,0,0.2)',
                  borderColor: 'rgba(255,255,255,0.1)',
                  color: 'var(--text)',
                }}
              >
                {SEASONS.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Temperature */}
          <div>
            <label className="text-[10px] mb-1 block" style={{ color: 'var(--text-mute)' }}>Temperature (°F)</label>
            <input
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="w-full text-xs rounded px-2.5 py-1.5 border focus:outline-none"
              style={{
                background: 'rgba(0,0,0,0.2)',
                borderColor: 'rgba(255,255,255,0.1)',
                color: 'var(--text)',
              }}
              min={-40}
              max={130}
            />
          </div>

          {/* Precipitation & Wind */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] mb-1 block" style={{ color: 'var(--text-mute)' }}>Precipitation</label>
              <select
                value={precipitation}
                onChange={(e) => setPrecipitation(e.target.value)}
                className="w-full text-xs rounded px-2 py-1.5 border focus:outline-none cursor-pointer"
                style={{
                  background: 'rgba(0,0,0,0.2)',
                  borderColor: 'rgba(255,255,255,0.1)',
                  color: 'var(--text)',
                }}
              >
                {PRECIPITATION_OPTIONS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] mb-1 block" style={{ color: 'var(--text-mute)' }}>Wind</label>
              <select
                value={wind}
                onChange={(e) => setWind(e.target.value)}
                className="w-full text-xs rounded px-2 py-1.5 border focus:outline-none cursor-pointer"
                style={{
                  background: 'rgba(0,0,0,0.2)',
                  borderColor: 'rgba(255,255,255,0.1)',
                  color: 'var(--text)',
                }}
              >
                {WIND_OPTIONS.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Special Effects */}
          <div>
            <label className="text-[10px] mb-1 block" style={{ color: 'var(--text-mute)' }}>Special Effects</label>
            <select
              value={specialEffects}
              onChange={(e) => setSpecialEffects(e.target.value)}
              className="w-full text-xs rounded px-2 py-1.5 border focus:outline-none cursor-pointer"
              style={{
                background: 'rgba(0,0,0,0.2)',
                borderColor: 'rgba(255,255,255,0.1)',
                color: 'var(--text)',
              }}
            >
              {SPECIAL_EFFECTS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-lg border transition-all cursor-pointer hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(192,132,252,0.12)',
              borderColor: 'rgba(192,132,252,0.3)',
              color: '#c084fc',
            }}
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            Save Weather
          </button>
        </div>
      )}

      {/* Weather History */}
      {showHistory && (
        <div
          className="rounded-xl p-3 border space-y-2"
          style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <div className="text-xs font-medium flex items-center gap-1.5" style={{ color: 'var(--text-dim)' }}>
            <History size={12} /> Recent Changes
          </div>
          {weatherHistory.length === 0 ? (
            <div className="text-center py-3 text-xs" style={{ color: 'var(--text-mute)' }}>
              No weather changes recorded yet
            </div>
          ) : (
            <div className="space-y-1.5">
              {weatherHistory.map((entry, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg p-2 text-xs"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <div className="shrink-0">{getWeatherIcon(entry.precipitation, entry.wind)}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span style={{ color: 'var(--text)' }}>{entry.temperature}°F</span>
                      <span style={{ color: 'var(--text-mute)' }}>|</span>
                      <span style={{ color: 'var(--text-dim)' }}>{entry.precipitation}</span>
                      <span style={{ color: 'var(--text-mute)' }}>|</span>
                      <span style={{ color: 'var(--text-dim)' }}>{entry.wind}</span>
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--text-mute)' }}>
                      {entry.region} - {entry.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
