import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import {
  Globe, Cloud, CloudRain, CloudSnow, CloudLightning, Wind, Sun,
  Shield, Coins, Scroll, AlertTriangle, TrendingUp, TrendingDown,
  Snowflake, CloudDrizzle, Eye,
} from 'lucide-react';
import { getWeatherEffects } from './WeatherPanel';

/* ── Helpers ── */

const REPUTATION_RANKS = [
  { min: -100, max: -60, label: 'Hated', color: '#ef4444' },
  { min: -59, max: -30, label: 'Hostile', color: '#f87171' },
  { min: -29, max: -10, label: 'Unfriendly', color: '#fb923c' },
  { min: -9, max: 9, label: 'Unknown', color: '#a1a1aa' },
  { min: 10, max: 29, label: 'Friendly', color: '#a3e635' },
  { min: 30, max: 59, label: 'Trusted', color: '#4ade80' },
  { min: 60, max: 89, label: 'Honored', color: '#22d3ee' },
  { min: 90, max: 100, label: 'Exalted', color: '#c084fc' },
];

function getRepRank(score) {
  return REPUTATION_RANKS.find(r => score >= r.min && score <= r.max) || REPUTATION_RANKS[3];
}

function getWeatherIcon(precipitation, wind) {
  if (!precipitation || precipitation === 'None') {
    if (wind === 'Gale' || wind === 'Hurricane') return <Wind size={16} style={{ color: '#a78bfa' }} />;
    if (wind === 'Strong') return <Wind size={16} style={{ color: 'rgba(167,139,250,0.7)' }} />;
    return <Sun size={16} style={{ color: '#fbbf24' }} />;
  }
  const p = precipitation.toLowerCase();
  if (p.includes('blizzard')) return <Snowflake size={16} style={{ color: '#93c5fd' }} />;
  if (p.includes('snow')) return <CloudSnow size={16} style={{ color: '#93c5fd' }} />;
  if (p.includes('thunder')) return <CloudLightning size={16} style={{ color: '#fde047' }} />;
  if (p.includes('heavy rain') || p.includes('hail')) return <CloudRain size={16} style={{ color: '#60a5fa' }} />;
  if (p.includes('rain')) return <CloudRain size={16} style={{ color: '#93c5fd' }} />;
  if (p.includes('drizzle')) return <CloudDrizzle size={16} style={{ color: 'rgba(147,197,253,0.7)' }} />;
  if (p.includes('fog') || p.includes('mist')) return <Cloud size={16} style={{ color: '#9ca3af' }} />;
  return <Cloud size={16} style={{ color: '#d1d5db' }} />;
}

const SEVERITY_COLORS = {
  trivial: '#6b7280',
  minor: '#60a5fa',
  moderate: '#f59e0b',
  major: '#ef4444',
  catastrophic: '#dc2626',
};

/* ── Component ── */

/**
 * WorldAtAGlance — compact dashboard card showing world state at a glance.
 *
 * Props (all optional — will auto-fetch if not provided):
 *   weather: { precipitation, wind, specialEffects, temperature, season }
 *   factions: [{ id, name, reputations: [{ score }] }]
 *   recentEvents: [{ title, severity, event_type, status }]
 *   economyData: { priceModifier, prosperity, taxRate }
 */
export default function WorldAtAGlance({ weather, factions, recentEvents, economyData }) {
  const [localWeather, setLocalWeather] = useState(null);
  const [localFactions, setLocalFactions] = useState([]);
  const [localEvents, setLocalEvents] = useState([]);
  const [localEconomy, setLocalEconomy] = useState(null);
  const [factionReps, setFactionReps] = useState({});

  // Auto-fetch data if not passed as props
  useEffect(() => {
    if (!weather) {
      (async () => {
        try {
          const data = await invoke('get_weather', { region: 'default' });
          if (data) setLocalWeather(data);
        } catch { /* not available */ }
      })();
    }
    if (!factions) {
      (async () => {
        try {
          const data = await invoke('list_factions');
          setLocalFactions((data || []).slice(0, 5));
          // Fetch reputations for top factions
          const reps = {};
          for (const f of (data || []).slice(0, 3)) {
            try {
              const r = await invoke('get_faction_reputations', { factionId: f.id });
              if (r && r.length > 0) {
                // Average reputation across all characters
                const avg = Math.round(r.reduce((sum, rep) => sum + (rep.score || 0), 0) / r.length);
                reps[f.id] = avg;
              }
            } catch { /* skip */ }
          }
          setFactionReps(reps);
        } catch { /* not available */ }
      })();
    }
    if (!recentEvents) {
      (async () => {
        try {
          const data = await invoke('list_world_events');
          setLocalEvents((data || []).filter(e => e.status !== 'resolved').slice(0, 3));
        } catch { /* not available */ }
      })();
    }
    if (!economyData) {
      (async () => {
        try {
          const data = await invoke('get_economy', { region: 'default' });
          if (data) setLocalEconomy(data);
        } catch { /* not available */ }
      })();
    }
  }, [weather, factions, recentEvents, economyData]);

  const wx = weather || localWeather || {};
  const fxList = factions || localFactions;
  const events = recentEvents || localEvents;
  const econ = economyData || localEconomy;

  const wxEffects = getWeatherEffects({
    precipitation: wx.precipitation || 'None',
    wind: wx.wind || 'Calm',
    specialEffects: wx.special_effects || wx.specialEffects || 'None',
    temperature: wx.temperature,
  });

  const econMod = econ?.price_modifier ?? econ?.priceModifier ?? 1.0;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '10px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(192,132,252,0.04)',
      }}>
        <Globe size={14} style={{ color: '#c084fc' }} />
        <span style={{
          fontSize: '12px', fontWeight: 700, color: 'var(--text)',
          fontFamily: 'var(--font-ui)',
        }}>
          World at a Glance
        </span>
      </div>

      <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Weather */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '8px 10px', borderRadius: '8px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          {getWeatherIcon(wx.precipitation, wx.wind)}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: '12px', fontWeight: 600, color: 'var(--text)',
              fontFamily: 'var(--font-ui)',
            }}>
              {wxEffects.summary}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-mute)', fontFamily: 'var(--font-ui)' }}>
              {wx.temperature ? `${wx.temperature}°F` : ''}{wx.season ? ` · ${wx.season}` : ''}
              {wxEffects.combat.length > 0 && (
                <span style={{ color: '#fb923c', marginLeft: '6px' }}>
                  {wxEffects.combat.length} combat effect{wxEffects.combat.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
          {wxEffects.travelMultiplier > 1 && (
            <span style={{
              fontSize: '9px', fontWeight: 700,
              padding: '2px 6px', borderRadius: '4px',
              background: 'rgba(251,146,60,0.15)', color: '#fb923c',
              border: '1px solid rgba(251,146,60,0.25)',
              fontFamily: 'var(--font-ui)',
              whiteSpace: 'nowrap',
            }}>
              {wxEffects.travelMultiplier === 2 ? '2x' : '+50%'} travel
            </span>
          )}
        </div>

        {/* Top Factions */}
        {fxList.length > 0 && (
          <div style={{
            padding: '8px 10px', borderRadius: '8px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}>
            <div style={{
              fontSize: '10px', fontWeight: 600, color: 'var(--text-mute)',
              fontFamily: 'var(--font-ui)',
              textTransform: 'uppercase', letterSpacing: '0.05em',
              marginBottom: '6px',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              <Shield size={10} /> Top Factions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {fxList.slice(0, 3).map(f => {
                const repScore = factionReps[f.id] ?? 0;
                const rank = getRepRank(repScore);
                const pct = ((repScore + 100) / 200) * 100;
                return (
                  <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '11px', color: 'var(--text-dim)',
                      fontFamily: 'var(--font-ui)',
                      minWidth: '80px', overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {f.name}
                    </span>
                    <div style={{
                      flex: 1, height: '4px', borderRadius: '2px',
                      background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
                      position: 'relative',
                    }}>
                      <div style={{
                        position: 'absolute', height: '100%', borderRadius: '2px',
                        width: `${pct}%`, background: rank.color,
                        transition: 'width 0.3s',
                      }} />
                      <div style={{
                        position: 'absolute', left: '50%', top: 0,
                        height: '100%', width: '1px',
                        background: 'rgba(255,255,255,0.15)',
                      }} />
                    </div>
                    <span style={{
                      fontSize: '10px', fontWeight: 600, color: rank.color,
                      fontFamily: 'var(--font-ui)',
                      minWidth: '24px', textAlign: 'right',
                    }}>
                      {repScore > 0 ? '+' : ''}{repScore}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Economy Status */}
        {econ && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '8px 10px', borderRadius: '8px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}>
            <Coins size={14} style={{ color: '#f59e0b' }} />
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '11px', color: 'var(--text-dim)',
                fontFamily: 'var(--font-ui)',
              }}>
                Economy: {econMod < 1 ? 'Prices Low' : econMod > 1 ? 'Prices High' : 'Stable'}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-mute)', fontFamily: 'var(--font-ui)' }}>
                Modifier: {econMod}x
                {econ.prosperity != null && ` · Prosperity: ${econ.prosperity}/100`}
              </div>
            </div>
            <span style={{
              fontSize: '10px', fontWeight: 600,
              color: econMod < 1 ? '#4ade80' : econMod > 1 ? '#f87171' : 'var(--text-dim)',
              fontFamily: 'var(--font-ui)',
              display: 'flex', alignItems: 'center', gap: '2px',
            }}>
              {econMod < 1 ? <TrendingDown size={10} /> : econMod > 1 ? <TrendingUp size={10} /> : null}
              {econMod}x
            </span>
          </div>
        )}

        {/* Recent World Events */}
        {events.length > 0 && (
          <div style={{
            padding: '8px 10px', borderRadius: '8px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}>
            <div style={{
              fontSize: '10px', fontWeight: 600, color: 'var(--text-mute)',
              fontFamily: 'var(--font-ui)',
              textTransform: 'uppercase', letterSpacing: '0.05em',
              marginBottom: '6px',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              <Scroll size={10} /> Recent Events
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {events.slice(0, 3).map((ev, i) => {
                const sevColor = SEVERITY_COLORS[ev.severity] || '#6b7280';
                return (
                  <div key={ev.id || i} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}>
                    <span style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: sevColor, flexShrink: 0,
                    }} />
                    <span style={{
                      fontSize: '11px', color: 'var(--text-dim)',
                      fontFamily: 'var(--font-ui)',
                      flex: 1, overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {ev.title}
                    </span>
                    <span style={{
                      fontSize: '9px', fontWeight: 600,
                      padding: '1px 5px', borderRadius: '3px',
                      background: `${sevColor}22`, color: sevColor,
                      border: `1px solid ${sevColor}44`,
                      fontFamily: 'var(--font-ui)',
                      textTransform: 'capitalize',
                      whiteSpace: 'nowrap',
                    }}>
                      {ev.severity}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!wx.precipitation && fxList.length === 0 && events.length === 0 && !econ && (
          <div style={{
            padding: '16px', textAlign: 'center',
            fontSize: '11px', color: 'var(--text-mute)',
            fontFamily: 'var(--font-ui)',
          }}>
            <Eye size={16} style={{ color: 'rgba(192,132,252,0.2)', margin: '0 auto 6px' }} />
            No world data available yet. Set up weather, factions, economy, and events to see the overview.
          </div>
        )}
      </div>
    </div>
  );
}
