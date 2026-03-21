import { useState } from 'react';
import {
  Dice5, Map, RefreshCw, Send, ChevronDown, X,
  Swords, MessageCircle, Compass, AlertTriangle,
} from 'lucide-react';
import { generateRandomEncounter, getTerrainTypes } from '../../utils/randomEncounters';

/* ─── Constants ─── */
const TERRAINS = [
  { key: 'road',      label: 'Road' },
  { key: 'forest',    label: 'Forest' },
  { key: 'mountain',  label: 'Mountain' },
  { key: 'swamp',     label: 'Swamp' },
  { key: 'urban',     label: 'Urban' },
  { key: 'desert',    label: 'Desert' },
  { key: 'underdark', label: 'Underdark' },
  { key: 'coastal',   label: 'Coastal' },
];

const TENSIONS = [
  { key: 'low',    label: 'Low' },
  { key: 'medium', label: 'Medium' },
  { key: 'high',   label: 'High' },
];

const TYPE_COLORS = {
  combat:      '#ef4444',
  social:      '#60a5fa',
  exploration: '#4ade80',
  hazard:      '#fbbf24',
};

const TYPE_ICONS = {
  combat:      Swords,
  social:      MessageCircle,
  exploration: Compass,
  hazard:      AlertTriangle,
};

/* ─── Styles ─── */
const panelStyle = {
  background: 'rgba(30, 30, 40, 0.95)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '10px',
  overflow: 'hidden',
  fontFamily: 'var(--font-ui)',
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 12px',
  background: 'rgba(192,132,252,0.08)',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
  cursor: 'pointer',
  userSelect: 'none',
};

const headerTitleStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  color: '#c084fc',
  fontWeight: 700,
  fontSize: '12px',
  fontFamily: 'var(--font-display)',
  letterSpacing: '0.3px',
};

const bodyStyle = {
  padding: '10px 12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const labelStyle = {
  fontSize: '10px',
  fontWeight: 600,
  color: '#c9a84c',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '4px',
};

const selectStyle = {
  width: '100%',
  padding: '6px 8px',
  borderRadius: '6px',
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(0,0,0,0.3)',
  color: 'var(--text)',
  fontSize: '12px',
  fontFamily: 'var(--font-ui)',
  outline: 'none',
  cursor: 'pointer',
};

const btnBase = {
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontFamily: 'var(--font-ui)',
  fontWeight: 600,
  fontSize: '11px',
  transition: 'all 0.15s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '5px',
};

/* ─── Component ─── */
export default function QuickEncounterPanel({ onBroadcast, onClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const [terrain, setTerrain]     = useState('road');
  const [tension, setTension]     = useState('medium');
  const [encounter, setEncounter] = useState(null);

  const rollEncounter = () => {
    const result = generateRandomEncounter(terrain, { tension });
    setEncounter(result);
  };

  const reroll = () => {
    rollEncounter();
  };

  const broadcast = () => {
    if (encounter && onBroadcast) {
      onBroadcast(encounter.description);
    }
  };

  const TypeIcon = encounter ? (TYPE_ICONS[encounter.type] || Dice5) : null;
  const typeColor = encounter ? (TYPE_COLORS[encounter.type] || '#888') : '#888';

  return (
    <div style={panelStyle}>
      {/* ── Header ── */}
      <div style={headerStyle} onClick={() => setCollapsed(c => !c)}>
        <div style={headerTitleStyle}>
          <Dice5 size={14} />
          Quick Encounter
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ChevronDown
            size={14}
            style={{
              color: 'rgba(255,255,255,0.4)',
              transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          />
          {onClose && (
            <X
              size={14}
              style={{ color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}
              onClick={e => { e.stopPropagation(); onClose(); }}
            />
          )}
        </div>
      </div>

      {/* ── Body ── */}
      {!collapsed && (
        <div style={bodyStyle}>

          {/* Terrain selector */}
          <div>
            <div style={labelStyle}>
              <Map size={10} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              Terrain
            </div>
            <select
              value={terrain}
              onChange={e => setTerrain(e.target.value)}
              style={selectStyle}
            >
              {TERRAINS.map(t => (
                <option key={t.key} value={t.key}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Tension toggle buttons */}
          <div>
            <div style={labelStyle}>Tension</div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {TENSIONS.map(t => {
                const active = tension === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setTension(t.key)}
                    style={{
                      ...btnBase,
                      flex: 1,
                      padding: '5px 0',
                      background: active ? 'rgba(192,132,252,0.2)' : 'rgba(255,255,255,0.04)',
                      border: active
                        ? '1px solid rgba(192,132,252,0.5)'
                        : '1px solid rgba(255,255,255,0.08)',
                      color: active ? '#c084fc' : 'rgba(255,255,255,0.45)',
                    }}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Roll button */}
          <button
            onClick={rollEncounter}
            style={{
              ...btnBase,
              padding: '8px 0',
              background: 'linear-gradient(135deg, rgba(192,132,252,0.25), rgba(201,168,76,0.2))',
              border: '1px solid rgba(192,132,252,0.3)',
              color: '#e2c97e',
              fontSize: '12px',
            }}
          >
            <Dice5 size={14} />
            Roll Encounter
          </button>

          {/* ── Result card ── */}
          {encounter && (
            <div style={{
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              {/* Name + type badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                <span style={{
                  color: 'var(--text)',
                  fontWeight: 700,
                  fontSize: '13px',
                  fontFamily: 'var(--font-display)',
                  lineHeight: 1.2,
                }}>
                  {encounter.name}
                </span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  padding: '2px 7px',
                  borderRadius: '4px',
                  fontSize: '9px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px',
                  background: `${typeColor}18`,
                  border: `1px solid ${typeColor}40`,
                  color: typeColor,
                  flexShrink: 0,
                }}>
                  {TypeIcon && <TypeIcon size={10} />}
                  {encounter.type}
                </span>
              </div>

              {/* CR + terrain + d100 */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {encounter.cr != null && (
                  <span style={{
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'rgba(192,132,252,0.1)',
                    border: '1px solid rgba(192,132,252,0.2)',
                    color: '#c084fc',
                    fontSize: '10px',
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                  }}>
                    CR {encounter.cr}
                  </span>
                )}
                {encounter.terrain && (
                  <span style={{
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'rgba(201,168,76,0.1)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    color: '#e2c97e',
                    fontSize: '10px',
                    fontWeight: 600,
                  }}>
                    {encounter.terrain}
                  </span>
                )}
                {encounter.d100 != null && (
                  <span style={{
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                  }}>
                    d100: {encounter.d100}
                  </span>
                )}
              </div>

              {/* Description */}
              {encounter.description && (
                <p style={{
                  margin: 0,
                  fontSize: '11px',
                  lineHeight: 1.5,
                  color: 'var(--text-mute)',
                  borderTop: '1px solid rgba(255,255,255,0.04)',
                  paddingTop: '6px',
                }}>
                  {encounter.description}
                </p>
              )}

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                <button
                  onClick={reroll}
                  style={{
                    ...btnBase,
                    flex: 1,
                    padding: '6px 0',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.6)',
                  }}
                >
                  <RefreshCw size={12} />
                  Re-roll
                </button>
                <button
                  onClick={broadcast}
                  style={{
                    ...btnBase,
                    flex: 1,
                    padding: '6px 0',
                    background: 'rgba(192,132,252,0.15)',
                    border: '1px solid rgba(192,132,252,0.3)',
                    color: '#c084fc',
                  }}
                >
                  <Send size={12} />
                  Broadcast
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
