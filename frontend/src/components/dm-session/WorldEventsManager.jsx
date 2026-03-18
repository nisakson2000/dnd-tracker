import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Globe, Plus, Trash2, Check, X, Filter, ChevronDown, ChevronUp,
  Landmark, Swords, Coins, CloudLightning, Sparkles, Users, Church,
  AlertTriangle, Loader2, Calendar,
} from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import toast from 'react-hot-toast';

/* ── Auto-Generate Event Suggestions ── */

const EVENT_TEMPLATES = {
  quest_complete: [
    { title: 'Shift in Local Power', type: 'political', severity: 'moderate', desc: 'The completion of this quest has shifted the balance of power in the region. Local leaders react.' },
    { title: 'Celebration in the Streets', type: 'social', severity: 'minor', desc: 'Word of the party\'s success has spread. The common folk celebrate.' },
    { title: 'New Alliances Form', type: 'political', severity: 'minor', desc: 'Inspired by recent events, rival factions consider new alliances.' },
    { title: 'Economic Boom', type: 'economic', severity: 'moderate', desc: 'Trade routes reopen and merchants return after the threat was eliminated.' },
  ],
  battle_won: [
    { title: 'Military Retaliation Brewing', type: 'military', severity: 'major', desc: 'Allies of the defeated force are regrouping and planning revenge.' },
    { title: 'War Spoils Redistributed', type: 'economic', severity: 'moderate', desc: 'The spoils of battle affect the local economy as weapons and goods flood the market.' },
    { title: 'Veterans Seek New Purpose', type: 'social', severity: 'minor', desc: 'Soldiers from the battle look for new employment or causes to fight for.' },
    { title: 'The Fallen Are Mourned', type: 'religious', severity: 'minor', desc: 'Temples hold services for those lost in battle. The mood is somber.' },
  ],
  faction_rep_change: [
    { title: 'Faction Tensions Rise', type: 'political', severity: 'moderate', desc: 'The change in reputation has not gone unnoticed. Political tensions are building.' },
    { title: 'Diplomatic Envoy Sent', type: 'political', severity: 'minor', desc: 'A faction sends envoys to address the changing relationship with the party.' },
    { title: 'Trade Embargo Threatened', type: 'economic', severity: 'major', desc: 'The faction considers economic retaliation based on recent actions.' },
    { title: 'Secret Alliance Proposed', type: 'political', severity: 'moderate', desc: 'A faction reaches out through back channels to propose a covert alliance.' },
  ],
  generic: [
    { title: 'Merchant Caravan Attacked', type: 'economic', severity: 'moderate', desc: 'Bandits have attacked a major trade caravan. Supply lines are disrupted.' },
    { title: 'Natural Disaster Strikes', type: 'natural', severity: 'major', desc: 'An earthquake, flood, or storm devastates a nearby settlement.' },
    { title: 'Wild Magic Surge', type: 'magical', severity: 'moderate', desc: 'A sudden surge of wild magic transforms the landscape in unexpected ways.' },
    { title: 'Political Assassination', type: 'political', severity: 'major', desc: 'A prominent leader has been assassinated. Suspicion falls on multiple factions.' },
    { title: 'Religious Festival', type: 'religious', severity: 'trivial', desc: 'A holy day approaches, drawing pilgrims and merchants from afar.' },
    { title: 'Plague Outbreak', type: 'social', severity: 'major', desc: 'A mysterious illness spreads through the populace. Healers are overwhelmed.' },
    { title: 'Border Skirmish', type: 'military', severity: 'moderate', desc: 'Soldiers clash along disputed borders. War may be on the horizon.' },
    { title: 'Ancient Ruins Discovered', type: 'magical', severity: 'minor', desc: 'Explorers have uncovered ruins of an ancient civilization nearby.' },
  ],
};

/**
 * Generate event suggestions based on recent session actions.
 * @param {'quest_complete'|'battle_won'|'faction_rep_change'|'generic'} actionType
 * @param {Object} [details] - Optional context
 * @returns {Object} A suggested event { title, type, severity, description }
 */
export function generateEventSuggestion(actionType = 'generic', details = {}) {
  const templates = EVENT_TEMPLATES[actionType] || EVENT_TEMPLATES.generic;
  const template = templates[Math.floor(Math.random() * templates.length)];

  let title = template.title;
  let description = template.desc;

  // Personalize with details
  if (details.questName) {
    description = `After "${details.questName}" was completed: ${description}`;
  }
  if (details.enemyName) {
    description = `Following the defeat of ${details.enemyName}: ${description}`;
  }
  if (details.factionName) {
    title = `${details.factionName}: ${title}`;
    description = `Regarding ${details.factionName}: ${description}`;
  }

  return {
    title,
    event_type: template.type,
    severity: template.severity,
    description,
  };
}

/* ── Constants ── */

const EVENT_TYPES = [
  { key: 'political',  label: 'Political',  color: '#a78bfa', Icon: Landmark },
  { key: 'military',   label: 'Military',   color: '#ef4444', Icon: Swords },
  { key: 'economic',   label: 'Economic',   color: '#f59e0b', Icon: Coins },
  { key: 'natural',    label: 'Natural',    color: '#4ade80', Icon: CloudLightning },
  { key: 'magical',    label: 'Magical',    color: '#c084fc', Icon: Sparkles },
  { key: 'social',     label: 'Social',     color: '#60a5fa', Icon: Users },
  { key: 'religious',  label: 'Religious',  color: '#fbbf24', Icon: Church },
];

const EVENT_TYPE_MAP = Object.fromEntries(EVENT_TYPES.map(t => [t.key, t]));

const SEVERITY_LEVELS = [
  { key: 'trivial',      label: 'Trivial',      color: '#6b7280' },
  { key: 'minor',        label: 'Minor',        color: '#60a5fa' },
  { key: 'moderate',     label: 'Moderate',     color: '#f59e0b' },
  { key: 'major',        label: 'Major',        color: '#ef4444' },
  { key: 'catastrophic', label: 'Catastrophic', color: '#dc2626' },
];

const SEVERITY_MAP = Object.fromEntries(SEVERITY_LEVELS.map(s => [s.key, s]));

/* ── Shared Styles ── */

const inputStyle = {
  width: '100%', padding: '8px 12px', borderRadius: '6px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'var(--text)', fontSize: '13px',
  fontFamily: 'var(--font-ui)', outline: 'none',
  boxSizing: 'border-box',
};

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical', minHeight: 56, lineHeight: 1.5,
};

const labelStyle = {
  fontSize: '10px', color: 'var(--text-mute)',
  fontFamily: 'var(--font-ui)', display: 'block',
  marginBottom: '3px', textTransform: 'uppercase',
  letterSpacing: '0.06em', fontWeight: 600,
};

const sectionHeader = {
  fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
  textTransform: 'uppercase', color: 'var(--text-mute)',
  fontFamily: 'var(--font-mono, monospace)',
  display: 'flex', alignItems: 'center', gap: '8px',
  padding: '10px 0 6px',
};

/* ── Badges ── */

function TypeBadge({ type }) {
  const t = EVENT_TYPE_MAP[type] || { label: type, color: '#888', Icon: Globe };
  const { label, color, Icon } = t;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '3px',
      fontSize: '10px', fontWeight: 600,
      padding: '2px 8px', borderRadius: '4px',
      background: `${color}22`, color,
      border: `1px solid ${color}44`,
      fontFamily: 'var(--font-ui)', textTransform: 'capitalize',
      whiteSpace: 'nowrap',
    }}>
      <Icon size={10} /> {label}
    </span>
  );
}

function SeverityBadge({ severity }) {
  const s = SEVERITY_MAP[severity] || { label: severity, color: '#888' };
  return (
    <span style={{
      fontSize: '10px', fontWeight: 600,
      padding: '2px 8px', borderRadius: '4px',
      background: `${s.color}22`, color: s.color,
      border: `1px solid ${s.color}44`,
      fontFamily: 'var(--font-ui)', textTransform: 'capitalize',
      whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  );
}

function StatusBadge({ status }) {
  const resolved = status === 'resolved';
  const color = resolved ? '#4ade80' : '#c084fc';
  return (
    <span style={{
      fontSize: '9px', fontWeight: 700,
      padding: '2px 7px', borderRadius: '4px',
      background: `${color}18`, color,
      border: `1px solid ${color}33`,
      fontFamily: 'var(--font-ui)', textTransform: 'uppercase',
      letterSpacing: '0.05em',
    }}>
      {resolved ? 'Resolved' : 'Pending'}
    </span>
  );
}

/* ── Event Card ── */

function EventCard({ event, onResolve, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  let triggerConditions = null;
  try { triggerConditions = event.trigger_conditions_json ? JSON.parse(event.trigger_conditions_json) : null; } catch { /* */ }

  let effects = null;
  try { effects = event.effects_json ? JSON.parse(event.effects_json) : null; } catch { /* */ }

  const isResolved = event.status === 'resolved';

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${isResolved ? 'rgba(74,222,128,0.1)' : 'rgba(192,132,252,0.12)'}`,
      borderRadius: '10px', overflow: 'hidden',
      opacity: isResolved ? 0.7 : 1,
      transition: 'all 0.2s',
    }}>
      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 12px', cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            marginBottom: '4px',
          }}>
            <span style={{
              fontSize: '13px', fontWeight: 700, color: 'var(--text)',
              fontFamily: 'var(--font-ui)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {event.title}
            </span>
            <StatusBadge status={event.status} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <TypeBadge type={event.event_type} />
            <SeverityBadge severity={event.severity} />
            {(event.calendar_day || event.calendar_month) && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '3px',
                fontSize: '10px', color: 'var(--text-mute)',
                fontFamily: 'var(--font-ui)',
              }}>
                <Calendar size={9} />
                {event.calendar_month && `Month ${event.calendar_month}`}
                {event.calendar_day && event.calendar_month && ', '}
                {event.calendar_day && `Day ${event.calendar_day}`}
              </span>
            )}
          </div>
        </div>
        {expanded
          ? <ChevronUp size={14} style={{ color: 'var(--text-mute)', flexShrink: 0 }} />
          : <ChevronDown size={14} style={{ color: 'var(--text-mute)', flexShrink: 0 }} />
        }
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div style={{
          padding: '10px 14px 12px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          {event.description && (
            <p style={{
              fontSize: '12px', lineHeight: 1.6, color: 'var(--text-dim)',
              fontFamily: 'var(--font-ui)', margin: '0 0 10px',
            }}>
              {event.description}
            </p>
          )}

          {/* Trigger Conditions */}
          {triggerConditions && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ ...labelStyle, marginBottom: '4px' }}>Trigger Conditions</div>
              <div style={{
                padding: '6px 10px', borderRadius: '6px',
                background: 'rgba(192,132,252,0.06)',
                border: '1px solid rgba(192,132,252,0.12)',
                fontSize: '11px', color: '#c4b5fd', fontFamily: 'var(--font-ui)',
                lineHeight: 1.5, whiteSpace: 'pre-wrap',
              }}>
                {typeof triggerConditions === 'string'
                  ? triggerConditions
                  : JSON.stringify(triggerConditions, null, 2)}
              </div>
            </div>
          )}

          {/* Effects */}
          {effects && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ ...labelStyle, marginBottom: '4px' }}>Effects</div>
              <div style={{
                padding: '6px 10px', borderRadius: '6px',
                background: 'rgba(245,158,11,0.06)',
                border: '1px solid rgba(245,158,11,0.12)',
                fontSize: '11px', color: '#fbbf24', fontFamily: 'var(--font-ui)',
                lineHeight: 1.5, whiteSpace: 'pre-wrap',
              }}>
                {typeof effects === 'string' ? effects : JSON.stringify(effects, null, 2)}
              </div>
            </div>
          )}

          {/* Resolved timestamp */}
          {isResolved && event.resolved_at && (
            <div style={{
              fontSize: '10px', color: '#4ade80', fontFamily: 'var(--font-ui)',
              marginBottom: '8px',
            }}>
              Resolved: {new Date(event.resolved_at).toLocaleString()}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
            {!isResolved && (
              <button
                onClick={(e) => { e.stopPropagation(); onResolve(event.id); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '5px 12px', borderRadius: '6px',
                  background: 'rgba(74,222,128,0.1)',
                  border: '1px solid rgba(74,222,128,0.25)',
                  color: '#4ade80', fontSize: '11px', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'var(--font-ui)',
                  transition: 'all 0.15s',
                }}
              >
                <Check size={12} /> Resolve
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(event.id); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '5px 12px', borderRadius: '6px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                color: '#ef4444', fontSize: '11px', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'var(--font-ui)',
                transition: 'all 0.15s',
                marginLeft: 'auto',
              }}
            >
              <Trash2 size={11} /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Create Form ── */

function CreateEventForm({ onCreated, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('political');
  const [severity, setSeverity] = useState('moderate');
  const [triggerConditions, setTriggerConditions] = useState('');
  const [effects, setEffects] = useState('');
  const [calendarDay, setCalendarDay] = useState('');
  const [calendarMonth, setCalendarMonth] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) { toast.error('Event needs a title'); return; }
    setSaving(true);
    try {
      await invoke('create_world_event', {
        title: title.trim(),
        description: description.trim() || null,
        eventType,
        severity,
        triggerConditionsJson: triggerConditions.trim() || null,
        effectsJson: effects.trim() || null,
        calendarDay: calendarDay ? parseInt(calendarDay, 10) : null,
        calendarMonth: calendarMonth ? parseInt(calendarMonth, 10) : null,
      });
      toast.success('World event created');
      onCreated();
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to create event');
      console.error('[WorldEventsManager] create_world_event:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      background: 'rgba(192,132,252,0.04)',
      border: '1px solid rgba(192,132,252,0.15)',
      borderRadius: '10px', padding: '14px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '12px',
      }}>
        <span style={{
          fontSize: '12px', fontWeight: 700, color: '#c084fc',
          fontFamily: 'var(--font-ui)',
        }}>
          New World Event
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-mute)', padding: '2px',
          }}
        >
          <X size={14} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Title */}
        <div>
          <label style={labelStyle}>Title</label>
          <input
            style={inputStyle}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g., The Fall of House Ravencrest"
          />
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle}>Description</label>
          <textarea
            style={textareaStyle}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="What is happening in the world..."
          />
        </div>

        {/* Type Selector */}
        <div>
          <label style={labelStyle}>Event Type</label>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {EVENT_TYPES.map(({ key, label, color, Icon }) => {
              const active = eventType === key;
              return (
                <button
                  key={key}
                  onClick={() => setEventType(key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    padding: '4px 10px', borderRadius: '6px',
                    background: active ? `${color}22` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${active ? `${color}55` : 'rgba(255,255,255,0.08)'}`,
                    color: active ? color : 'var(--text-mute)',
                    fontSize: '11px', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'var(--font-ui)',
                    transition: 'all 0.15s',
                  }}
                >
                  <Icon size={11} /> {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Severity Selector */}
        <div>
          <label style={labelStyle}>Severity</label>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {SEVERITY_LEVELS.map(({ key, label, color }) => {
              const active = severity === key;
              return (
                <button
                  key={key}
                  onClick={() => setSeverity(key)}
                  style={{
                    padding: '4px 10px', borderRadius: '6px',
                    background: active ? `${color}22` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${active ? `${color}55` : 'rgba(255,255,255,0.08)'}`,
                    color: active ? color : 'var(--text-mute)',
                    fontSize: '11px', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'var(--font-ui)',
                    transition: 'all 0.15s',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Trigger Conditions + Effects */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Trigger Conditions</label>
            <textarea
              style={{ ...textareaStyle, minHeight: 44 }}
              value={triggerConditions}
              onChange={e => setTriggerConditions(e.target.value)}
              placeholder='Free text or JSON, e.g., "Party reaches level 5"'
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Effects</label>
            <textarea
              style={{ ...textareaStyle, minHeight: 44 }}
              value={effects}
              onChange={e => setEffects(e.target.value)}
              placeholder="Trade routes blocked, prices rise..."
            />
          </div>
        </div>

        {/* Calendar Date */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Calendar Month</label>
            <input
              style={inputStyle}
              type="number" min={1}
              value={calendarMonth}
              onChange={e => setCalendarMonth(e.target.value)}
              placeholder="Month"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Calendar Day</label>
            <input
              style={inputStyle}
              type="number" min={1}
              value={calendarDay}
              onChange={e => setCalendarDay(e.target.value)}
              placeholder="Day"
            />
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '7px 14px', borderRadius: '6px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-dim)', fontSize: '12px', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'var(--font-ui)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 18px', borderRadius: '6px',
              background: saving
                ? 'rgba(192,132,252,0.06)'
                : 'linear-gradient(135deg, rgba(192,132,252,0.2), rgba(192,132,252,0.1))',
              border: '1px solid rgba(192,132,252,0.35)',
              color: saving ? 'rgba(192,132,252,0.4)' : '#c084fc',
              fontSize: '12px', fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-ui)',
              transition: 'all 0.15s',
            }}
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
            {saving ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */

export default function WorldEventsManager({ campaignId }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [autoGenType, setAutoGenType] = useState('generic');

  const fetchEvents = useCallback(async () => {
    if (!campaignId) return;
    setLoading(true);
    try {
      const data = await invoke('list_world_events');
      setEvents(data || []);
    } catch (err) {
      console.error('[WorldEventsManager] list_world_events:', err);
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const handleResolve = async (eventId) => {
    try {
      await invoke('resolve_world_event', { eventId });
      toast.success('Event resolved');
      fetchEvents();
    } catch (err) {
      toast.error('Failed to resolve event');
      console.error('[WorldEventsManager] resolve_world_event:', err);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      await invoke('delete_world_event', { eventId });
      toast.success('Event deleted');
      fetchEvents();
    } catch (err) {
      toast.error('Failed to delete event');
      console.error('[WorldEventsManager] delete_world_event:', err);
    }
  };

  // Sort: pending first, then resolved. Within each group, newest first.
  const sortedEvents = useMemo(() => {
    let filtered = [...events];

    if (filterType !== 'all') {
      filtered = filtered.filter(e => e.event_type === filterType);
    }
    if (filterSeverity !== 'all') {
      filtered = filtered.filter(e => e.severity === filterSeverity);
    }

    filtered.sort((a, b) => {
      if (a.status === 'pending' && b.status === 'resolved') return -1;
      if (a.status === 'resolved' && b.status === 'pending') return 1;
      return (b.id || 0) - (a.id || 0);
    });

    return filtered;
  }, [events, filterType, filterSeverity]);

  const pendingCount = events.filter(e => e.status !== 'resolved').length;
  const resolvedCount = events.filter(e => e.status === 'resolved').length;

  if (!campaignId) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px', padding: '24px', textAlign: 'center',
      }}>
        <Globe size={24} style={{ color: 'rgba(192,132,252,0.3)', margin: '0 auto 8px' }} />
        <div style={{ fontSize: '13px', color: 'var(--text-mute)', fontFamily: 'var(--font-ui)' }}>
          Select a campaign to manage world events
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '12px', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <Globe size={15} style={{ color: '#c084fc' }} />
          <span style={{
            fontSize: '12px', fontWeight: 700, color: 'var(--text)',
            fontFamily: 'var(--font-ui)',
          }}>
            World Events
          </span>
          <span style={{
            fontSize: '10px', color: 'var(--text-mute)',
            fontFamily: 'var(--font-ui)',
          }}>
            ({pendingCount} active, {resolvedCount} resolved)
          </span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '5px 10px', borderRadius: '6px',
              background: showFilters ? 'rgba(192,132,252,0.12)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${showFilters ? 'rgba(192,132,252,0.3)' : 'rgba(255,255,255,0.08)'}`,
              color: showFilters ? '#c084fc' : 'var(--text-mute)',
              fontSize: '11px', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'var(--font-ui)',
              transition: 'all 0.15s',
            }}
          >
            <Filter size={11} /> Filters
          </button>
          <button
            onClick={() => {
              const s = generateEventSuggestion(autoGenType);
              setSuggestion(s);
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '5px 10px', borderRadius: '6px',
              background: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.3)',
              color: '#f59e0b', fontSize: '11px', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'var(--font-ui)',
              transition: 'all 0.15s',
            }}
          >
            <Sparkles size={11} /> Auto-Generate
          </button>
          <button
            onClick={() => setShowCreate(!showCreate)}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '5px 10px', borderRadius: '6px',
              background: 'rgba(192,132,252,0.1)',
              border: '1px solid rgba(192,132,252,0.3)',
              color: '#c084fc', fontSize: '11px', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'var(--font-ui)',
              transition: 'all 0.15s',
            }}
          >
            <Plus size={12} /> New Event
          </button>
        </div>
      </div>

      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Filter Bar */}
        {showFilters && (
          <div style={{
            display: 'flex', gap: '12px', flexWrap: 'wrap',
            padding: '10px 12px', borderRadius: '8px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div>
              <label style={labelStyle}>Type</label>
              <select
                style={{ ...inputStyle, width: 'auto', cursor: 'pointer', minWidth: 120 }}
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                {EVENT_TYPES.map(t => (
                  <option key={t.key} value={t.key}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Severity</label>
              <select
                style={{ ...inputStyle, width: 'auto', cursor: 'pointer', minWidth: 120 }}
                value={filterSeverity}
                onChange={e => setFilterSeverity(e.target.value)}
              >
                <option value="all">All Severities</option>
                {SEVERITY_LEVELS.map(s => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Auto-Generate Suggestion */}
        {suggestion && (
          <div style={{
            background: 'rgba(245,158,11,0.04)',
            border: '1px solid rgba(245,158,11,0.15)',
            borderRadius: '10px', padding: '14px',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '10px',
            }}>
              <span style={{
                fontSize: '12px', fontWeight: 700, color: '#f59e0b',
                fontFamily: 'var(--font-ui)',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <Sparkles size={13} /> Suggested Event
              </span>
              <button
                onClick={() => setSuggestion(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-mute)', padding: '2px' }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Action type selector */}
            <div style={{ marginBottom: '10px' }}>
              <div style={labelStyle}>Based on</div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {[
                  { key: 'quest_complete', label: 'Quest Completed' },
                  { key: 'battle_won', label: 'Battle Won' },
                  { key: 'faction_rep_change', label: 'Faction Change' },
                  { key: 'generic', label: 'Random' },
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => {
                      setAutoGenType(opt.key);
                      setSuggestion(generateEventSuggestion(opt.key));
                    }}
                    style={{
                      padding: '3px 8px', borderRadius: '5px',
                      background: autoGenType === opt.key ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${autoGenType === opt.key ? 'rgba(245,158,11,0.35)' : 'rgba(255,255,255,0.08)'}`,
                      color: autoGenType === opt.key ? '#f59e0b' : 'var(--text-mute)',
                      fontSize: '10px', fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'var(--font-ui)',
                      transition: 'all 0.15s',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Suggestion preview */}
            <div style={{
              padding: '10px 12px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              marginBottom: '10px',
            }}>
              <div style={{
                fontSize: '13px', fontWeight: 700, color: 'var(--text)',
                fontFamily: 'var(--font-ui)', marginBottom: '4px',
              }}>
                {suggestion.title}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <TypeBadge type={suggestion.event_type} />
                <SeverityBadge severity={suggestion.severity} />
              </div>
              <p style={{
                fontSize: '12px', lineHeight: 1.5, color: 'var(--text-dim)',
                fontFamily: 'var(--font-ui)', margin: 0,
              }}>
                {suggestion.description}
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => {
                  const s = generateEventSuggestion(autoGenType);
                  setSuggestion(s);
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '5px 12px', borderRadius: '6px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-dim)', fontSize: '11px', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'var(--font-ui)',
                }}
              >
                <Sparkles size={11} /> Re-roll
              </button>
              <button
                onClick={async () => {
                  try {
                    await invoke('create_world_event', {
                      title: suggestion.title,
                      description: suggestion.description,
                      eventType: suggestion.event_type,
                      severity: suggestion.severity,
                      triggerConditionsJson: null,
                      effectsJson: null,
                      calendarDay: null,
                      calendarMonth: null,
                    });
                    toast.success('Event created from suggestion');
                    setSuggestion(null);
                    fetchEvents();
                  } catch (err) {
                    toast.error('Failed to create event');
                    console.error('[WorldEventsManager] auto-create:', err);
                  }
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '5px 14px', borderRadius: '6px',
                  background: 'rgba(74,222,128,0.1)',
                  border: '1px solid rgba(74,222,128,0.25)',
                  color: '#4ade80', fontSize: '11px', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'var(--font-ui)',
                }}
              >
                <Check size={12} /> Accept & Create
              </button>
              <button
                onClick={() => {
                  // Send to create form for editing
                  setShowCreate(true);
                  setSuggestion(null);
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '5px 12px', borderRadius: '6px',
                  background: 'rgba(192,132,252,0.08)',
                  border: '1px solid rgba(192,132,252,0.2)',
                  color: '#c084fc', fontSize: '11px', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'var(--font-ui)',
                }}
              >
                <Plus size={11} /> Edit First
              </button>
            </div>
          </div>
        )}

        {/* Create Form */}
        {showCreate && (
          <CreateEventForm
            onCreated={() => { setShowCreate(false); fetchEvents(); }}
            onClose={() => setShowCreate(false)}
          />
        )}

        {/* Events List */}
        {loading ? (
          <div style={{
            padding: '24px', textAlign: 'center',
            fontSize: '12px', color: 'var(--text-mute)',
            fontFamily: 'var(--font-ui)',
          }}>
            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 8px' }} />
            Loading events...
          </div>
        ) : sortedEvents.length === 0 ? (
          <div style={{
            padding: '32px', textAlign: 'center',
          }}>
            <AlertTriangle size={20} style={{ color: 'rgba(192,132,252,0.2)', margin: '0 auto 8px' }} />
            <div style={{
              fontSize: '12px', color: 'var(--text-mute)',
              fontFamily: 'var(--font-ui)',
            }}>
              {events.length === 0
                ? 'No world events yet. Create one to track political upheavals, natural disasters, and more.'
                : 'No events match the current filters.'}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sortedEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onResolve={handleResolve}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
