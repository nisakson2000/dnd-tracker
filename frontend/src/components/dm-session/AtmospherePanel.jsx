import { useState, useMemo, memo } from 'react';
import {
  Eye, CloudRain, Sun, Wind, Thermometer, RefreshCw,
  Send, ChevronDown, ChevronUp, Sparkles,
} from 'lucide-react';
import {
  generateAtmosphere, getLocationTypes, getTimeOptions, getWeatherOptions,
} from '../../data/sensoryDescriptions';

/* ─── styles ───────────────────────────────────────────────────── */

const PURPLE = '#c084fc';
const GOLD   = '#c9a84c';

const selectStyle = {
  padding: '5px 10px',
  borderRadius: '6px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'var(--text)',
  fontSize: '12px',
  fontFamily: 'var(--font-ui)',
  outline: 'none',
  cursor: 'pointer',
  flex: 1,
  minWidth: 0,
};

const labelStyle = {
  fontSize: '10px',
  color: 'var(--text-mute)',
  fontFamily: 'var(--font-ui)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  fontWeight: 600,
};

const btnBase = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  padding: '6px 12px',
  borderRadius: '6px',
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.04)',
  color: 'var(--text)',
  fontSize: '12px',
  fontFamily: 'var(--font-ui)',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background 0.15s, border-color 0.15s',
};

const SENSE_ICONS = {
  sight:       { icon: Eye,         color: '#60a5fa' },
  sound:       { icon: Wind,        color: '#a78bfa' },
  smell:       { icon: CloudRain,   color: '#34d399' },
  temperature: { icon: Thermometer, color: '#f59e0b' },
  texture:     { icon: Sun,         color: '#f472b6' },
};

/* ─── component ────────────────────────────────────────────────── */

function AtmospherePanel({ onBroadcast, onClose }) {
  const [locationType, setLocationType] = useState('tavern');
  const [timeOfDay, setTimeOfDay]       = useState('evening');
  const [weather, setWeather]           = useState('clear');
  const [result, setResult]             = useState(null);
  const [showSenses, setShowSenses]     = useState(false);

  const locationTypes = useMemo(() => getLocationTypes(), []);
  const timeOptions   = useMemo(() => getTimeOptions(), []);
  const weatherOpts   = useMemo(() => getWeatherOptions(), []);

  const handleGenerate = () => {
    setResult(generateAtmosphere(locationType, timeOfDay, weather));
  };

  const handleBroadcast = () => {
    if (result && onBroadcast) {
      onBroadcast(result.description);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* ── header bar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: `${PURPLE}12`,
          border: `1px solid ${PURPLE}30`,
          borderRadius: '8px',
        }}
      >
        <Sparkles size={16} style={{ color: PURPLE, flexShrink: 0 }} />
        <span
          style={{
            fontSize: '13px',
            fontWeight: 700,
            fontFamily: 'var(--font-display)',
            color: PURPLE,
            letterSpacing: '0.03em',
          }}
        >
          Atmosphere Generator
        </span>
        <div style={{ flex: 1 }} />
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-mute)',
              cursor: 'pointer',
              fontSize: '16px',
              lineHeight: 1,
              padding: '2px 4px',
            }}
            title="Close panel"
          >
            &times;
          </button>
        )}
      </div>

      {/* ── dropdowns ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ ...labelStyle, width: '62px', flexShrink: 0 }}>Location</span>
          <select
            value={locationType}
            onChange={(e) => setLocationType(e.target.value)}
            style={selectStyle}
          >
            {locationTypes.map((l) => (
              <option key={l.id} value={l.id}>{l.label}</option>
            ))}
          </select>
        </div>

        {/* time of day */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ ...labelStyle, width: '62px', flexShrink: 0 }}>Time</span>
          <select
            value={timeOfDay}
            onChange={(e) => setTimeOfDay(e.target.value)}
            style={selectStyle}
          >
            {timeOptions.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* weather */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ ...labelStyle, width: '62px', flexShrink: 0 }}>Weather</span>
          <select
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
            style={selectStyle}
          >
            {weatherOpts.map((w) => (
              <option key={w.id} value={w.id}>{w.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── generate button ── */}
      <button
        onClick={handleGenerate}
        style={{
          ...btnBase,
          justifyContent: 'center',
          background: `${PURPLE}18`,
          borderColor: `${PURPLE}44`,
          color: PURPLE,
          padding: '8px 14px',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = `${PURPLE}30`)}
        onMouseLeave={(e) => (e.currentTarget.style.background = `${PURPLE}18`)}
      >
        <Sparkles size={13} />
        Generate Atmosphere
      </button>

      {/* ── result ── */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* location + time label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '9px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '4px',
                fontFamily: 'var(--font-ui)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: `${GOLD}18`,
                color: GOLD,
                border: `1px solid ${GOLD}44`,
              }}
            >
              {result.location}
            </span>
            <span
              style={{
                fontSize: '9px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '4px',
                fontFamily: 'var(--font-ui)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: `${PURPLE}18`,
                color: PURPLE,
                border: `1px solid ${PURPLE}44`,
              }}
            >
              {timeOfDay} &middot; {weather}
            </span>
          </div>

          {/* atmospheric paragraph */}
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '10px',
              padding: '14px 16px',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: '13px',
                lineHeight: 1.65,
                color: 'var(--text)',
                fontFamily: 'var(--font-ui)',
                fontStyle: 'italic',
              }}
            >
              {result.description}
            </p>
          </div>

          {/* ── senses toggle ── */}
          <button
            onClick={() => setShowSenses((s) => !s)}
            style={{
              ...btnBase,
              justifyContent: 'center',
              gap: '6px',
              fontSize: '11px',
              padding: '5px 10px',
              color: 'var(--text-mute)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
          >
            {showSenses ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {showSenses ? 'Hide' : 'Show'} Individual Senses
          </button>

          {/* ── senses breakdown ── */}
          {showSenses && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
                borderRadius: '8px',
                padding: '10px 12px',
              }}
            >
              {Object.entries(result.senses).map(([sense, text]) => {
                const cfg = SENSE_ICONS[sense];
                const Icon = cfg ? cfg.icon : Eye;
                const clr  = cfg ? cfg.color : '#888';
                return (
                  <div
                    key={sense}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                    }}
                  >
                    <Icon
                      size={13}
                      style={{ color: clr, flexShrink: 0, marginTop: '2px' }}
                    />
                    <div>
                      <span
                        style={{
                          fontSize: '9px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          color: clr,
                          fontFamily: 'var(--font-ui)',
                          marginRight: '6px',
                        }}
                      >
                        {sense}
                      </span>
                      <span
                        style={{
                          fontSize: '12px',
                          color: 'var(--text)',
                          fontFamily: 'var(--font-ui)',
                          lineHeight: 1.5,
                        }}
                      >
                        {text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── action buttons ── */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={handleGenerate}
              style={btnBase}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
              title="Re-roll with same settings"
            >
              <RefreshCw size={12} />
              Re-roll
            </button>

            <button
              onClick={handleBroadcast}
              style={{
                ...btnBase,
                background: `${GOLD}18`,
                borderColor: `${GOLD}44`,
                color: GOLD,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = `${GOLD}30`)}
              onMouseLeave={(e) => (e.currentTarget.style.background = `${GOLD}18`)}
              title="Broadcast to players"
            >
              <Send size={12} />
              Broadcast
            </button>
          </div>
        </div>
      )}

      {/* ── empty state ── */}
      {!result && (
        <div
          style={{
            textAlign: 'center',
            padding: '24px 16px',
            color: 'var(--text-mute)',
            fontSize: '12px',
            fontFamily: 'var(--font-ui)',
            opacity: 0.6,
          }}
        >
          Choose a location, time, and weather, then generate an atmosphere.
        </div>
      )}
    </div>
  );
}

export default memo(AtmospherePanel);
