import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import {
  Map, Navigation, Loader2, Footprints, Mountain, TreePine,
  Clock, Utensils, Swords, AlertTriangle, Compass, Route,
  Cloud, CloudRain, CloudSnow, CloudLightning, Wind
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getWeatherEffects } from './WeatherPanel';

const TERRAINS = [
  { value: 'Road', label: 'Road', icon: Route, desc: 'Paved or well-maintained path' },
  { value: 'Trail', label: 'Trail', icon: Footprints, desc: 'Worn dirt path through terrain' },
  { value: 'Wilderness', label: 'Wilderness', icon: TreePine, desc: 'Unmarked natural terrain' },
  { value: 'Mountain', label: 'Mountain', icon: Mountain, desc: 'Steep, rocky elevation' },
  { value: 'Swamp', label: 'Swamp', icon: Navigation, desc: 'Boggy, difficult wetlands' },
  { value: 'Desert', label: 'Desert', icon: Compass, desc: 'Arid, featureless expanse' },
];

const PACES = [
  {
    value: 'Fast',
    label: 'Fast',
    desc: '30 miles/day',
    effect: '-5 passive Perception. Cannot stealth.',
    color: '#f87171',
  },
  {
    value: 'Normal',
    label: 'Normal',
    desc: '24 miles/day',
    effect: 'No penalties or bonuses.',
    color: '#facc15',
  },
  {
    value: 'Slow',
    label: 'Slow',
    desc: '18 miles/day',
    effect: 'Can use stealth. Advantage on foraging.',
    color: '#4ade80',
  },
];

const WEATHER_PRESETS = [
  { label: 'Clear', precipitation: 'None', wind: 'Calm' },
  { label: 'Rain', precipitation: 'Rain', wind: 'Moderate' },
  { label: 'Heavy Rain', precipitation: 'Heavy Rain', wind: 'Strong' },
  { label: 'Thunderstorm', precipitation: 'Thunderstorm', wind: 'Strong' },
  { label: 'Snow', precipitation: 'Snow', wind: 'Moderate' },
  { label: 'Blizzard', precipitation: 'Blizzard', wind: 'Gale' },
  { label: 'Fog', precipitation: 'Fog', wind: 'Calm' },
];

export default function TravelCalculator() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [terrain, setTerrain] = useState('Road');
  const [pace, setPace] = useState('Normal');
  const [partySize, setPartySize] = useState(4);
  const [calculating, setCalculating] = useState(false);
  const [results, setResults] = useState(null);
  const [weatherPreset, setWeatherPreset] = useState('Clear');
  const [currentWeather, setCurrentWeather] = useState({ precipitation: 'None', wind: 'Calm' });
  const [showWeather, setShowWeather] = useState(false);

  // Load current weather from backend
  useEffect(() => {
    (async () => {
      try {
        const data = await invoke('get_weather', { region: 'default' });
        if (data) {
          setCurrentWeather({
            precipitation: data.precipitation || 'None',
            wind: data.wind || 'Calm',
            specialEffects: data.special_effects || data.specialEffects || 'None',
            temperature: data.temperature,
          });
        }
      } catch { /* weather not available */ }
    })();
  }, []);

  const selectedWeather = WEATHER_PRESETS.find(w => w.label === weatherPreset) || WEATHER_PRESETS[0];
  const weatherEffects = getWeatherEffects(weatherPreset === 'Current' ? currentWeather : selectedWeather);
  const weatherTravelMod = weatherEffects.travelMultiplier;

  const selectedPace = PACES.find(p => p.value === pace);
  const selectedTerrain = TERRAINS.find(t => t.value === terrain);

  const handleCalculate = async () => {
    if (!origin.trim() || !destination.trim()) {
      toast.error('Enter both origin and destination');
      return;
    }
    setCalculating(true);
    try {
      const result = await invoke('calculate_travel', {
        origin: origin.trim(),
        destination: destination.trim(),
        terrain,
        pace,
        partySize: parseInt(partySize) || 4,
      });
      setResults(result);
    } catch (err) {
      console.error('[TravelCalculator] calculate_travel:', err);
      toast.error('Failed to calculate travel');
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Origin & Destination */}
      <div
        className="rounded-xl p-3 border space-y-2"
        style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <Map size={12} style={{ color: '#c084fc' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--text-dim)' }}>Journey</span>
        </div>

        <div className="space-y-1.5">
          <div className="relative">
            <div
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
              style={{ background: '#4ade80' }}
            />
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Origin (e.g. Neverwinter)"
              className="w-full text-xs rounded-lg pl-7 pr-2.5 py-2 border focus:outline-none"
              style={{
                background: 'rgba(0,0,0,0.2)',
                borderColor: 'rgba(255,255,255,0.1)',
                color: 'var(--text)',
              }}
            />
          </div>

          {/* Dotted connector */}
          <div className="flex items-center pl-3.5">
            <div
              className="w-0.5 h-4 rounded-full"
              style={{ background: 'rgba(192,132,252,0.3)', marginLeft: '1px' }}
            />
          </div>

          <div className="relative">
            <div
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
              style={{ background: '#f87171' }}
            />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Destination (e.g. Waterdeep)"
              className="w-full text-xs rounded-lg pl-7 pr-2.5 py-2 border focus:outline-none"
              style={{
                background: 'rgba(0,0,0,0.2)',
                borderColor: 'rgba(255,255,255,0.1)',
                color: 'var(--text)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Terrain Selector */}
      <div
        className="rounded-xl p-3 border"
        style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div className="text-[10px] mb-2" style={{ color: 'var(--text-mute)' }}>Terrain</div>
        <div className="grid grid-cols-3 gap-1.5">
          {TERRAINS.map(t => {
            const Icon = t.icon;
            const isSelected = terrain === t.value;
            return (
              <button
                key={t.value}
                onClick={() => setTerrain(t.value)}
                className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg border text-center transition-all cursor-pointer"
                style={{
                  background: isSelected ? 'rgba(192,132,252,0.12)' : 'rgba(255,255,255,0.02)',
                  borderColor: isSelected ? 'rgba(192,132,252,0.35)' : 'rgba(255,255,255,0.06)',
                  color: isSelected ? '#c084fc' : 'var(--text-dim)',
                }}
              >
                <Icon size={14} />
                <span className="text-[10px]">{t.label}</span>
              </button>
            );
          })}
        </div>
        {selectedTerrain && (
          <div className="text-[10px] mt-1.5 text-center" style={{ color: 'var(--text-mute)' }}>
            {selectedTerrain.desc}
          </div>
        )}
      </div>

      {/* Pace Selector */}
      <div
        className="rounded-xl p-3 border"
        style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div className="text-[10px] mb-2" style={{ color: 'var(--text-mute)' }}>Travel Pace</div>
        <div className="grid grid-cols-3 gap-1.5">
          {PACES.map(p => {
            const isSelected = pace === p.value;
            return (
              <button
                key={p.value}
                onClick={() => setPace(p.value)}
                className="flex flex-col items-center gap-0.5 py-2 px-1 rounded-lg border text-center transition-all cursor-pointer"
                style={{
                  background: isSelected ? 'rgba(192,132,252,0.12)' : 'rgba(255,255,255,0.02)',
                  borderColor: isSelected ? `${p.color}55` : 'rgba(255,255,255,0.06)',
                  color: isSelected ? p.color : 'var(--text-dim)',
                }}
              >
                <span className="text-xs font-medium">{p.label}</span>
                <span className="text-[9px]" style={{ color: 'var(--text-mute)' }}>{p.desc}</span>
              </button>
            );
          })}
        </div>
        {selectedPace && (
          <div
            className="flex items-start gap-1.5 mt-2 rounded-lg p-2 text-[10px]"
            style={{ background: 'rgba(192,132,252,0.05)', border: '1px solid rgba(192,132,252,0.12)' }}
          >
            <AlertTriangle size={10} className="text-purple-400 mt-0.5 shrink-0" />
            <span style={{ color: 'var(--text-dim)' }}>{selectedPace.effect}</span>
          </div>
        )}
      </div>

      {/* Party Size */}
      <div
        className="rounded-xl p-3 border"
        style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Footprints size={12} style={{ color: 'var(--text-mute)' }} />
            <span className="text-[10px]" style={{ color: 'var(--text-mute)' }}>Party Size</span>
          </div>
          <input
            type="number"
            min={1}
            max={20}
            value={partySize}
            onChange={(e) => setPartySize(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-16 text-xs text-center rounded px-2 py-1 border focus:outline-none"
            style={{
              background: 'rgba(0,0,0,0.2)',
              borderColor: 'rgba(255,255,255,0.1)',
              color: 'var(--text)',
            }}
          />
        </div>
      </div>

      {/* Weather Impact */}
      <div
        className="rounded-xl p-3 border"
        style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <button
          onClick={() => setShowWeather(!showWeather)}
          className="w-full flex items-center justify-between text-[10px] cursor-pointer"
          style={{ color: 'var(--text-mute)', background: 'none', border: 'none', padding: 0 }}
        >
          <span className="flex items-center gap-1.5">
            <Cloud size={11} style={{ color: '#c084fc' }} /> Weather Conditions
          </span>
          <span style={{ color: weatherTravelMod > 1 ? '#fb923c' : '#4ade80' }}>
            {weatherTravelMod > 1 ? `${weatherTravelMod === 2 ? '2x' : '1.5x'} travel time` : 'No impact'}
          </span>
        </button>

        {showWeather && (
          <div className="mt-2 space-y-1.5">
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setWeatherPreset('Current')}
                className="text-[10px] px-2 py-1 rounded-lg border transition-all cursor-pointer"
                style={{
                  background: weatherPreset === 'Current' ? 'rgba(192,132,252,0.12)' : 'rgba(255,255,255,0.02)',
                  borderColor: weatherPreset === 'Current' ? 'rgba(192,132,252,0.35)' : 'rgba(255,255,255,0.06)',
                  color: weatherPreset === 'Current' ? '#c084fc' : 'var(--text-dim)',
                }}
              >
                Current ({currentWeather.precipitation || 'Clear'})
              </button>
              {WEATHER_PRESETS.map(w => (
                <button
                  key={w.label}
                  onClick={() => setWeatherPreset(w.label)}
                  className="text-[10px] px-2 py-1 rounded-lg border transition-all cursor-pointer"
                  style={{
                    background: weatherPreset === w.label ? 'rgba(192,132,252,0.12)' : 'rgba(255,255,255,0.02)',
                    borderColor: weatherPreset === w.label ? 'rgba(192,132,252,0.35)' : 'rgba(255,255,255,0.06)',
                    color: weatherPreset === w.label ? '#c084fc' : 'var(--text-dim)',
                  }}
                >
                  {w.label}
                </button>
              ))}
            </div>
            {weatherEffects.mechanical.length > 0 && (
              <div className="space-y-1 mt-1">
                {weatherEffects.mechanical.map((e, i) => (
                  <div key={i} className="text-[10px] flex items-start gap-1.5 rounded p-1.5"
                    style={{ background: 'rgba(192,132,252,0.05)', border: '1px solid rgba(192,132,252,0.1)' }}>
                    <AlertTriangle size={9} className="text-purple-400 mt-0.5 shrink-0" />
                    <span style={{ color: 'var(--text-dim)' }}>
                      <span className="text-purple-300 font-medium">{e.source}:</span> {e.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Calculate Button */}
      <button
        onClick={handleCalculate}
        disabled={calculating || !origin.trim() || !destination.trim()}
        className="w-full flex items-center justify-center gap-1.5 text-xs px-3 py-2.5 rounded-lg border transition-all cursor-pointer hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: 'rgba(192,132,252,0.15)',
          borderColor: 'rgba(192,132,252,0.35)',
          color: '#c084fc',
        }}
      >
        {calculating ? <Loader2 size={14} className="animate-spin" /> : <Navigation size={14} />}
        Calculate Travel
      </button>

      {/* Results */}
      {results && (
        <div
          className="rounded-xl border overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(192,132,252,0.2)' }}
        >
          {/* Summary Header */}
          <div
            className="p-3 border-b"
            style={{ background: 'rgba(192,132,252,0.06)', borderColor: 'rgba(192,132,252,0.15)' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Map size={14} style={{ color: '#c084fc' }} />
                <div>
                  <div className="text-xs font-medium" style={{ color: 'var(--text)' }}>
                    {origin} → {destination}
                  </div>
                  <div className="text-[10px]" style={{ color: 'var(--text-mute)' }}>
                    {terrain} | {pace} pace | {partySize} travelers
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-px" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="p-3" style={{ background: 'rgba(0,0,0,0.15)' }}>
              <div className="flex items-center gap-1.5 mb-1">
                <Clock size={11} style={{ color: '#c084fc' }} />
                <span className="text-[10px]" style={{ color: 'var(--text-mute)' }}>Travel Time</span>
              </div>
              <div className="text-lg font-bold" style={{ color: 'var(--text)' }}>
                {results.travel_days} <span className="text-xs font-normal" style={{ color: 'var(--text-dim)' }}>days</span>
              </div>
            </div>

            <div className="p-3" style={{ background: 'rgba(0,0,0,0.15)' }}>
              <div className="flex items-center gap-1.5 mb-1">
                <Route size={11} style={{ color: '#c084fc' }} />
                <span className="text-[10px]" style={{ color: 'var(--text-mute)' }}>Distance</span>
              </div>
              <div className="text-lg font-bold" style={{ color: 'var(--text)' }}>
                {results.distance_miles} <span className="text-xs font-normal" style={{ color: 'var(--text-dim)' }}>miles</span>
              </div>
            </div>

            <div className="p-3" style={{ background: 'rgba(0,0,0,0.15)' }}>
              <div className="flex items-center gap-1.5 mb-1">
                <Utensils size={11} style={{ color: '#c084fc' }} />
                <span className="text-[10px]" style={{ color: 'var(--text-mute)' }}>Rations Needed</span>
              </div>
              <div className="text-lg font-bold" style={{ color: 'var(--text)' }}>
                {results.rations_needed}
              </div>
              <div className="text-[10px]" style={{ color: 'var(--text-mute)' }}>
                ({partySize} x {results.travel_days} days)
              </div>
            </div>

            <div className="p-3" style={{ background: 'rgba(0,0,0,0.15)' }}>
              <div className="flex items-center gap-1.5 mb-1">
                <Swords size={11} style={{ color: '#c084fc' }} />
                <span className="text-[10px]" style={{ color: 'var(--text-mute)' }}>Encounter Chance</span>
              </div>
              <div className="text-lg font-bold" style={{ color: 'var(--text)' }}>
                {results.encounter_chance}<span className="text-xs font-normal" style={{ color: 'var(--text-dim)' }}>%</span>
              </div>
              <div className="text-[10px]" style={{ color: 'var(--text-mute)' }}>
                per day
              </div>
            </div>
          </div>

          {/* Weather Impact on Travel */}
          {weatherTravelMod > 1 && (
            <div className="p-3 border-t" style={{ borderColor: 'rgba(251,146,60,0.15)', background: 'rgba(251,146,60,0.04)' }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Cloud size={11} style={{ color: '#fb923c' }} />
                <span className="text-[10px] font-medium" style={{ color: '#fb923c' }}>Weather Impact</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: 'var(--text-dim)' }}>
                  {weatherEffects.summary}
                </span>
                <span className="font-medium" style={{ color: '#fb923c' }}>
                  {weatherTravelMod === 2 ? 'Double' : '+50%'} travel time
                </span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span style={{ color: 'var(--text-mute)' }}>Adjusted travel time:</span>
                <span className="font-bold" style={{ color: '#fb923c' }}>
                  {Math.ceil(results.travel_days * weatherTravelMod)} days
                </span>
              </div>
              <div className="flex items-center justify-between text-xs mt-0.5">
                <span style={{ color: 'var(--text-mute)' }}>Adjusted rations:</span>
                <span className="font-medium" style={{ color: '#fb923c' }}>
                  {Math.ceil(results.travel_days * weatherTravelMod) * partySize}
                </span>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="p-3 space-y-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            {/* Expected Encounters */}
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5" style={{ color: 'var(--text-mute)' }}>
                <Swords size={11} /> Expected encounter checks
              </span>
              <span className="font-medium" style={{ color: 'var(--text)' }}>
                {results.total_encounter_checks}
              </span>
            </div>

            {/* Pace Description */}
            {results.pace_description && (
              <div
                className="rounded-lg p-2 text-[11px]"
                style={{ background: 'rgba(192,132,252,0.05)', border: '1px solid rgba(192,132,252,0.12)' }}
              >
                <div className="flex items-start gap-1.5">
                  <Footprints size={11} className="text-purple-400 mt-0.5 shrink-0" />
                  <span style={{ color: 'var(--text-dim)' }}>{results.pace_description}</span>
                </div>
              </div>
            )}

            {/* Pace Effects */}
            {selectedPace && (
              <div
                className="rounded-lg p-2 text-[11px]"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-start gap-1.5">
                  <AlertTriangle size={11} className="text-purple-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium" style={{ color: '#c084fc' }}>{selectedPace.label} pace:</span>{' '}
                    <span style={{ color: 'var(--text-dim)' }}>{selectedPace.effect}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
