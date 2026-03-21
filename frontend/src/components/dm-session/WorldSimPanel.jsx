import { useState, useEffect } from 'react';
import { Globe, ChevronDown, Check, X, Clock, Leaf, Sun, TreeDeciduous, Snowflake } from 'lucide-react';
import { generateWorldEvents, getPopulationMood, calculateMoodShift, MOOD_EVENTS, SEASONAL_EFFECTS } from '../../data/worldSimulation';

const SEVERITY_COLORS = { low: '#22c55e', medium: '#eab308', high: '#ef4444' };
const SEASON_ICONS = { spring: Leaf, summer: Sun, autumn: TreeDeciduous, winter: Snowflake };
const LS_MOOD = 'worldsim-mood';
const LS_SEASON = 'worldsim-season';

export default function WorldSimPanel({ onClose, onBroadcast }) {
  const [open, setOpen] = useState(true);
  const [factions, setFactions] = useState('');
  const [villain, setVillain] = useState('');
  const [regions, setRegions] = useState('');
  const [events, setEvents] = useState([]);
  const [approved, setApproved] = useState([]);
  const [mood, setMood] = useState(() => parseInt(localStorage.getItem(LS_MOOD)) || 0);
  const [season, setSeason] = useState(() => localStorage.getItem(LS_SEASON) || 'summer');

  useEffect(() => { localStorage.setItem(LS_MOOD, mood); }, [mood]);
  useEffect(() => { localStorage.setItem(LS_SEASON, season); }, [season]);

  const moodInfo = getPopulationMood(mood);
  const seasonData = SEASONAL_EFFECTS[season];
  const SeasonIcon = SEASON_ICONS[season];

  const csvToArr = (s) => s.split(',').map(v => v.trim()).filter(Boolean);

  const handleGenerate = () => {
    const count = 3 + Math.floor(Math.random() * 3); // 3-5
    const ctx = {
      factions: csvToArr(factions).length ? csvToArr(factions) : undefined,
      villains: villain.trim() ? [villain.trim()] : undefined,
      regions: csvToArr(regions).length ? csvToArr(regions) : undefined,
    };
    setEvents(generateWorldEvents(count, ctx));
  };

  const handleApprove = (i) => {
    const ev = { ...events[i], approved: true };
    setApproved(prev => [...prev, ev]);
    setEvents(prev => prev.filter((_, idx) => idx !== i));
    if (onBroadcast) onBroadcast(ev);
  };

  const handleReject = (i) => setEvents(prev => prev.filter((_, idx) => idx !== i));

  const applyMoodEvent = (modifier) => {
    setMood(prev => Math.max(-5, Math.min(4, prev + modifier)));
  };

  const handleAdvanceTime = () => {
    handleGenerate();
    const shift = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
    setMood(prev => Math.max(-5, Math.min(4, prev + shift)));
  };

  // Mood bar position: map -5..4 to 0..100%
  const moodPct = ((mood + 5) / 9) * 100;

  const inputStyle = {
    background: 'rgba(0,0,0,0.2)',
    borderColor: 'rgba(255,255,255,0.1)',
    color: 'var(--text)',
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2 text-xs px-3 py-2 rounded-lg border cursor-pointer hover:brightness-110 transition-all"
        style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)', color: 'var(--text-dim)' }}
      >
        <Globe size={14} /> World Simulation
        <ChevronDown size={12} className="ml-auto" />
      </button>
    );
  }

  return (
    <div className="rounded-xl border space-y-3 p-3" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => setOpen(false)} className="flex items-center gap-2 text-sm font-medium cursor-pointer" style={{ color: '#c084fc' }}>
          <Globe size={16} /> World Simulation
          <ChevronDown size={12} style={{ transform: 'rotate(180deg)' }} />
        </button>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded hover:bg-white/5 cursor-pointer" style={{ color: 'var(--text-mute)' }}>
            <X size={14} />
          </button>
        )}
      </div>

      {/* Between-Session Events */}
      <div className="space-y-2">
        <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#c084fc' }}>Between-Session Events</div>
        <div className="grid grid-cols-3 gap-1.5">
          <input type="text" value={factions} onChange={e => setFactions(e.target.value)} placeholder="Factions (comma-sep)" className="text-xs rounded px-2 py-1.5 border focus:outline-none" style={inputStyle} />
          <input type="text" value={villain} onChange={e => setVillain(e.target.value)} placeholder="Villain name" className="text-xs rounded px-2 py-1.5 border focus:outline-none" style={inputStyle} />
          <input type="text" value={regions} onChange={e => setRegions(e.target.value)} placeholder="Regions (comma-sep)" className="text-xs rounded px-2 py-1.5 border focus:outline-none" style={inputStyle} />
        </div>
        <button onClick={handleGenerate} className="w-full text-xs px-3 py-1.5 rounded-lg border cursor-pointer hover:brightness-110 transition-all" style={{ background: 'rgba(192,132,252,0.12)', borderColor: 'rgba(192,132,252,0.3)', color: '#c084fc' }}>
          Generate Events
        </button>

        {/* Pending Events */}
        {events.length > 0 && (
          <div className="space-y-1.5">
            {events.map((ev, i) => (
              <div key={i} className="rounded-lg p-2 text-xs flex items-start gap-2" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase" style={{ background: 'rgba(192,132,252,0.15)', color: '#c084fc' }}>{ev.category}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase" style={{ background: `${SEVERITY_COLORS[ev.severity]}20`, color: SEVERITY_COLORS[ev.severity] }}>{ev.severity}</span>
                  </div>
                  <div style={{ color: 'var(--text-dim)' }}>{ev.text}</div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => handleApprove(i)} className="p-1 rounded hover:bg-green-500/20 cursor-pointer" style={{ color: '#22c55e' }}><Check size={14} /></button>
                  <button onClick={() => handleReject(i)} className="p-1 rounded hover:bg-red-500/20 cursor-pointer" style={{ color: '#ef4444' }}><X size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Approved Events */}
        {approved.length > 0 && (
          <div className="space-y-1">
            <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#22c55e' }}>Approved ({approved.length})</div>
            {approved.map((ev, i) => (
              <div key={i} className="rounded-lg px-2 py-1.5 text-xs flex items-center gap-2" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
                <Check size={10} className="text-green-500 shrink-0" />
                <span style={{ color: 'var(--text-dim)' }}>{ev.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Population Mood */}
      <div className="space-y-2">
        <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#c084fc' }}>Population Mood</div>
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold" style={{ color: moodInfo.color }}>{mood >= 0 ? '+' : ''}{mood}</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium" style={{ color: moodInfo.color }}>{moodInfo.label}</div>
            <div className="text-[10px]" style={{ color: 'var(--text-mute)' }}>{moodInfo.description}</div>
          </div>
        </div>
        {/* Mood Bar */}
        <div className="relative h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-300" style={{ width: `${moodPct}%`, background: moodInfo.color }} />
        </div>
        {/* Mood Event Buttons */}
        <div className="flex flex-wrap gap-1">
          {MOOD_EVENTS.map((me, i) => (
            <button key={i} onClick={() => applyMoodEvent(me.modifier)} className="text-[10px] px-1.5 py-0.5 rounded border cursor-pointer hover:brightness-125 transition-all" style={{ borderColor: me.modifier > 0 ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)', color: me.modifier > 0 ? '#22c55e' : '#ef4444', background: me.modifier > 0 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)' }}>
              {me.event} ({me.modifier > 0 ? '+' : ''}{me.modifier})
            </button>
          ))}
        </div>
      </div>

      {/* Season Selector */}
      <div className="space-y-2">
        <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#c084fc' }}>Season</div>
        <select value={season} onChange={e => setSeason(e.target.value)} className="w-full text-xs rounded px-2 py-1.5 border focus:outline-none cursor-pointer" style={inputStyle}>
          {Object.entries(SEASONAL_EFFECTS).map(([key, s]) => (
            <option key={key} value={key}>{s.label}</option>
          ))}
        </select>
        {seasonData && (
          <div className="rounded-lg p-2 text-xs space-y-1.5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-1.5" style={{ color: 'var(--text-dim)' }}>
              <SeasonIcon size={12} className="text-purple-400" />
              <span className="font-medium">{seasonData.label} Effects</span>
            </div>
            <div className="space-y-1 text-[11px]" style={{ color: 'var(--text-mute)' }}>
              {seasonData.worldEffects.map((e, i) => <div key={i}>- {e}</div>)}
            </div>
            <div className="grid grid-cols-3 gap-1.5 pt-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              <div><span className="text-[9px] uppercase font-semibold block" style={{ color: 'var(--text-mute)' }}>Travel</span><span style={{ color: 'var(--text-dim)' }}>{seasonData.travelModifier}x</span></div>
              <div><span className="text-[9px] uppercase font-semibold block" style={{ color: 'var(--text-mute)' }}>Encounters</span><span style={{ color: 'var(--text-dim)' }}>{seasonData.encounterMod}</span></div>
              <div><span className="text-[9px] uppercase font-semibold block" style={{ color: 'var(--text-mute)' }}>Economy</span><span style={{ color: 'var(--text-dim)' }}>{seasonData.economicEffect}</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Advance Time */}
      <button onClick={handleAdvanceTime} className="w-full flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-lg border cursor-pointer hover:brightness-110 transition-all" style={{ background: 'rgba(192,132,252,0.12)', borderColor: 'rgba(192,132,252,0.3)', color: '#c084fc' }}>
        <Clock size={13} /> Advance Time
      </button>
    </div>
  );
}
