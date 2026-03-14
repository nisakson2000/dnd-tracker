import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Clock, Plus, Trash2, X, ChevronDown, ChevronRight,
  Swords, Landmark, Compass, Skull, PartyPopper, Star,
  Flame, Eye, EyeOff, Loader2, Maximize2, Minimize2, Tag,
} from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import toast from 'react-hot-toast';

/* ── Constants ── */

const CATEGORIES = [
  { key: 'event',     label: 'Event',     color: '#c084fc', Icon: Star },
  { key: 'battle',    label: 'Battle',    color: '#ef4444', Icon: Swords },
  { key: 'political', label: 'Political', color: '#a78bfa', Icon: Landmark },
  { key: 'discovery', label: 'Discovery', color: '#60a5fa', Icon: Compass },
  { key: 'founding',  label: 'Founding',  color: '#4ade80', Icon: Flame },
  { key: 'death',     label: 'Death',     color: '#6b7280', Icon: Skull },
  { key: 'festival',  label: 'Festival',  color: '#f59e0b', Icon: PartyPopper },
  { key: 'custom',    label: 'Custom',    color: '#ec4899', Icon: Tag },
];

const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map(c => [c.key, c]));

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
  resize: 'vertical', minHeight: 48, lineHeight: 1.5,
};

const labelStyle = {
  fontSize: '10px', color: 'var(--text-mute)',
  fontFamily: 'var(--font-ui)', display: 'block',
  marginBottom: '3px', textTransform: 'uppercase',
  letterSpacing: '0.06em', fontWeight: 600,
};

/* ── Badges ── */

function CategoryBadge({ category }) {
  const c = CATEGORY_MAP[category] || { label: category, color: '#888', Icon: Tag };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '3px',
      fontSize: '10px', fontWeight: 600,
      padding: '2px 8px', borderRadius: '4px',
      background: `${c.color}22`, color: c.color,
      border: `1px solid ${c.color}44`,
      fontFamily: 'var(--font-ui)', textTransform: 'capitalize',
      whiteSpace: 'nowrap',
    }}>
      <c.Icon size={10} /> {c.label}
    </span>
  );
}

function VisibilityBadge({ visibility }) {
  const isDmOnly = visibility === 'dm_only';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '3px',
      fontSize: '9px', fontWeight: 600,
      padding: '1px 6px', borderRadius: '4px',
      background: isDmOnly ? 'rgba(239,68,68,0.1)' : 'rgba(74,222,128,0.1)',
      color: isDmOnly ? '#ef4444' : '#4ade80',
      border: `1px solid ${isDmOnly ? 'rgba(239,68,68,0.25)' : 'rgba(74,222,128,0.25)'}`,
      fontFamily: 'var(--font-ui)', textTransform: 'uppercase',
      letterSpacing: '0.04em',
    }}>
      {isDmOnly ? <EyeOff size={8} /> : <Eye size={8} />}
      {isDmOnly ? 'DM Only' : 'Players'}
    </span>
  );
}

/* ── Add Entry Form ── */

function AddEntryForm({ onCreated, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('event');
  const [calendarDay, setCalendarDay] = useState('');
  const [calendarMonth, setCalendarMonth] = useState('');
  const [calendarYear, setCalendarYear] = useState('');
  const [sessionNumber, setSessionNumber] = useState('');
  const [visibility, setVisibility] = useState('dm_only');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) { toast.error('Entry needs a title'); return; }
    setSaving(true);
    try {
      await invoke('add_timeline_entry', {
        title: title.trim(),
        description: description.trim() || null,
        category,
        calendarDay: calendarDay ? parseInt(calendarDay, 10) : null,
        calendarMonth: calendarMonth ? parseInt(calendarMonth, 10) : null,
        calendarYear: calendarYear ? parseInt(calendarYear, 10) : null,
        sessionNumber: sessionNumber ? parseInt(sessionNumber, 10) : null,
        visibility,
      });
      toast.success('Timeline entry added');
      onCreated();
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to add entry');
      console.error('[WorldTimeline] add_timeline_entry:', err);
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
          New Timeline Entry
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
            placeholder="e.g., The Battle of Crimson Fields"
          />
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle}>Description</label>
          <textarea
            style={textareaStyle}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="What happened..."
          />
        </div>

        {/* Category */}
        <div>
          <label style={labelStyle}>Category</label>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {CATEGORIES.map(({ key, label, color, Icon }) => {
              const active = category === key;
              return (
                <button
                  key={key}
                  onClick={() => setCategory(key)}
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

        {/* Date Row */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Year</label>
            <input
              style={inputStyle}
              type="number"
              value={calendarYear}
              onChange={e => setCalendarYear(e.target.value)}
              placeholder="Year"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Month</label>
            <input
              style={inputStyle}
              type="number" min={1}
              value={calendarMonth}
              onChange={e => setCalendarMonth(e.target.value)}
              placeholder="Month"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Day</label>
            <input
              style={inputStyle}
              type="number" min={1}
              value={calendarDay}
              onChange={e => setCalendarDay(e.target.value)}
              placeholder="Day"
            />
          </div>
        </div>

        {/* Session + Visibility */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          <div style={{ flex: '0 0 100px' }}>
            <label style={labelStyle}>Session #</label>
            <input
              style={inputStyle}
              type="number" min={1}
              value={sessionNumber}
              onChange={e => setSessionNumber(e.target.value)}
              placeholder="#"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Visibility</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['dm_only', 'players'].map(v => {
                const active = visibility === v;
                const isDm = v === 'dm_only';
                const color = isDm ? '#ef4444' : '#4ade80';
                return (
                  <button
                    key={v}
                    onClick={() => setVisibility(v)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      padding: '6px 12px', borderRadius: '6px',
                      background: active ? `${color}18` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${active ? `${color}44` : 'rgba(255,255,255,0.08)'}`,
                      color: active ? color : 'var(--text-mute)',
                      fontSize: '11px', fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'var(--font-ui)',
                      transition: 'all 0.15s',
                    }}
                  >
                    {isDm ? <EyeOff size={11} /> : <Eye size={11} />}
                    {isDm ? 'DM Only' : 'Players'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Save */}
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
            {saving ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={12} />}
            {saving ? 'Adding...' : 'Add Entry'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Timeline Entry ── */

function TimelineEntry({ entry, compact, onDelete, onToggleVisibility }) {
  const cat = CATEGORY_MAP[entry.category] || CATEGORY_MAP.custom;
  const CatIcon = cat.Icon;

  const dateStr = [
    entry.calendar_year != null && `Year ${entry.calendar_year}`,
    entry.calendar_month != null && `Month ${entry.calendar_month}`,
    entry.calendar_day != null && `Day ${entry.calendar_day}`,
  ].filter(Boolean).join(', ');

  return (
    <div style={{
      position: 'relative',
      paddingLeft: '28px',
      paddingBottom: compact ? '12px' : '18px',
    }}>
      {/* Dot on the timeline line */}
      <div style={{
        position: 'absolute',
        left: '-1px',
        top: '4px',
        width: '12px', height: '12px',
        borderRadius: '50%',
        background: `${cat.color}33`,
        border: `2px solid ${cat.color}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1,
      }}>
        <CatIcon size={6} style={{ color: cat.color }} />
      </div>

      {/* Content */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '8px',
        padding: compact ? '8px 10px' : '10px 14px',
        transition: 'all 0.15s',
      }}>
        {/* Header row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          flexWrap: 'wrap', marginBottom: compact ? '2px' : '6px',
        }}>
          <span style={{
            fontSize: compact ? '12px' : '13px', fontWeight: 700,
            color: 'var(--text)', fontFamily: 'var(--font-ui)',
            flex: 1, minWidth: 0,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {entry.title}
          </span>
          <CategoryBadge category={entry.category} />
          <VisibilityBadge visibility={entry.visibility} />
        </div>

        {/* Description */}
        {!compact && entry.description && (
          <p style={{
            fontSize: '12px', lineHeight: 1.6, color: 'var(--text-dim)',
            fontFamily: 'var(--font-ui)', margin: '0 0 6px',
          }}>
            {entry.description}
          </p>
        )}

        {/* Meta row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
        }}>
          {dateStr && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '3px',
              fontSize: '10px', color: 'var(--text-mute)',
              fontFamily: 'var(--font-ui)',
            }}>
              <Clock size={9} /> {dateStr}
            </span>
          )}
          {entry.session_number != null && (
            <span style={{
              fontSize: '10px', color: '#c084fc',
              fontFamily: 'var(--font-ui)', fontWeight: 600,
            }}>
              Session {entry.session_number}
            </span>
          )}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
            <button
              onClick={() => onToggleVisibility(entry)}
              title={entry.visibility === 'dm_only' ? 'Make visible to players' : 'Hide from players'}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-mute)', padding: '2px',
                opacity: 0.5, transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
            >
              {entry.visibility === 'dm_only' ? <Eye size={11} /> : <EyeOff size={11} />}
            </button>
            <button
              onClick={() => onDelete(entry.id)}
              title="Delete entry"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(239,68,68,0.5)', padding: '2px',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(239,68,68,0.5)'}
            >
              <Trash2 size={11} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Year Group ── */

function YearGroup({ year, entries, compact, collapsed, onToggle, onDelete, onToggleVisibility }) {
  return (
    <div style={{ marginBottom: '6px' }}>
      {/* Year header */}
      <button
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '6px 10px', borderRadius: '6px',
          background: 'rgba(192,132,252,0.08)',
          border: '1px solid rgba(192,132,252,0.15)',
          color: '#c084fc', fontSize: '12px', fontWeight: 700,
          cursor: 'pointer', fontFamily: 'var(--font-heading)',
          letterSpacing: '0.04em', width: '100%',
          textAlign: 'left', marginBottom: '10px',
          transition: 'all 0.15s',
        }}
      >
        {collapsed
          ? <ChevronRight size={13} />
          : <ChevronDown size={13} />
        }
        Year {year}
        <span style={{
          fontSize: '10px', fontWeight: 500, color: 'rgba(192,132,252,0.5)',
          fontFamily: 'var(--font-ui)', marginLeft: '4px',
        }}>
          ({entries.length} {entries.length === 1 ? 'entry' : 'entries'})
        </span>
      </button>

      {/* Timeline entries */}
      {!collapsed && (
        <div style={{
          marginLeft: '16px',
          borderLeft: '2px solid rgba(192,132,252,0.15)',
          paddingLeft: '0',
        }}>
          {entries.map(entry => (
            <TimelineEntry
              key={entry.id}
              entry={entry}
              compact={compact}
              onDelete={onDelete}
              onToggleVisibility={onToggleVisibility}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main Component ── */

export default function WorldTimeline({ campaignId }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [compact, setCompact] = useState(false);
  const [collapsedYears, setCollapsedYears] = useState({});

  const fetchTimeline = useCallback(async () => {
    if (!campaignId) return;
    setLoading(true);
    try {
      const data = await invoke('get_timeline');
      setEntries(data || []);
    } catch (err) {
      console.error('[WorldTimeline] get_timeline:', err);
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => { fetchTimeline(); }, [fetchTimeline]);

  const handleDelete = async (entryId) => {
    try {
      await invoke('delete_timeline_entry', { entryId });
      toast.success('Entry deleted');
      fetchTimeline();
    } catch (err) {
      toast.error('Failed to delete entry');
      console.error('[WorldTimeline] delete_timeline_entry:', err);
    }
  };

  const handleToggleVisibility = async (entry) => {
    const newVis = entry.visibility === 'dm_only' ? 'players' : 'dm_only';
    try {
      // Re-add with toggled visibility (backend should handle upsert or we delete + re-add)
      await invoke('add_timeline_entry', {
        title: entry.title,
        description: entry.description || null,
        category: entry.category,
        calendarDay: entry.calendar_day || null,
        calendarMonth: entry.calendar_month || null,
        calendarYear: entry.calendar_year || null,
        sessionNumber: entry.session_number || null,
        visibility: newVis,
      });
      // Delete old entry
      await invoke('delete_timeline_entry', { entryId: entry.id });
      toast.success(`Visibility: ${newVis === 'dm_only' ? 'DM only' : 'Players'}`);
      fetchTimeline();
    } catch (err) {
      toast.error('Failed to toggle visibility');
      console.error('[WorldTimeline] toggle visibility:', err);
    }
  };

  const toggleYear = (year) => {
    setCollapsedYears(prev => ({ ...prev, [year]: !prev[year] }));
  };

  // Group entries by year, sort chronologically
  const groupedByYear = useMemo(() => {
    const sorted = [...entries].sort((a, b) => {
      const ya = a.calendar_year ?? 0;
      const yb = b.calendar_year ?? 0;
      if (ya !== yb) return ya - yb;
      const ma = a.calendar_month ?? 0;
      const mb = b.calendar_month ?? 0;
      if (ma !== mb) return ma - mb;
      const da = a.calendar_day ?? 0;
      const db = b.calendar_day ?? 0;
      return da - db;
    });

    const groups = {};
    sorted.forEach(entry => {
      const year = entry.calendar_year != null ? entry.calendar_year : 'Unknown';
      if (!groups[year]) groups[year] = [];
      groups[year].push(entry);
    });

    // Sort year keys numerically
    const yearKeys = Object.keys(groups).sort((a, b) => {
      if (a === 'Unknown') return 1;
      if (b === 'Unknown') return -1;
      return Number(a) - Number(b);
    });

    return yearKeys.map(year => ({
      year,
      entries: groups[year],
    }));
  }, [entries]);

  if (!campaignId) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px', padding: '24px', textAlign: 'center',
      }}>
        <Clock size={24} style={{ color: 'rgba(192,132,252,0.3)', margin: '0 auto 8px' }} />
        <div style={{ fontSize: '13px', color: 'var(--text-mute)', fontFamily: 'var(--font-ui)' }}>
          Select a campaign to view the world timeline
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
          <Clock size={15} style={{ color: '#c084fc' }} />
          <span style={{
            fontSize: '12px', fontWeight: 700, color: 'var(--text)',
            fontFamily: 'var(--font-ui)',
          }}>
            World Timeline
          </span>
          <span style={{
            fontSize: '10px', color: 'var(--text-mute)',
            fontFamily: 'var(--font-ui)',
          }}>
            ({entries.length} {entries.length === 1 ? 'entry' : 'entries'})
          </span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setCompact(!compact)}
            title={compact ? 'Expanded view' : 'Compact view'}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '5px 10px', borderRadius: '6px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--text-mute)', fontSize: '11px', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'var(--font-ui)',
              transition: 'all 0.15s',
            }}
          >
            {compact ? <Maximize2 size={11} /> : <Minimize2 size={11} />}
            {compact ? 'Expand' : 'Compact'}
          </button>
          <button
            onClick={() => setShowAdd(!showAdd)}
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
            <Plus size={12} /> Add Entry
          </button>
        </div>
      </div>

      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Add Form */}
        {showAdd && (
          <AddEntryForm
            onCreated={() => { setShowAdd(false); fetchTimeline(); }}
            onClose={() => setShowAdd(false)}
          />
        )}

        {/* Timeline */}
        {loading ? (
          <div style={{
            padding: '24px', textAlign: 'center',
            fontSize: '12px', color: 'var(--text-mute)',
            fontFamily: 'var(--font-ui)',
          }}>
            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 8px' }} />
            Loading timeline...
          </div>
        ) : groupedByYear.length === 0 ? (
          <div style={{
            padding: '32px', textAlign: 'center',
          }}>
            <Clock size={20} style={{ color: 'rgba(192,132,252,0.2)', margin: '0 auto 8px' }} />
            <div style={{
              fontSize: '12px', color: 'var(--text-mute)',
              fontFamily: 'var(--font-ui)',
            }}>
              No timeline entries yet. Add events, battles, and discoveries to build your world's history.
            </div>
          </div>
        ) : (
          <div>
            {groupedByYear.map(({ year, entries: yearEntries }) => (
              <YearGroup
                key={year}
                year={year}
                entries={yearEntries}
                compact={compact}
                collapsed={!!collapsedYears[year]}
                onToggle={() => toggleYear(year)}
                onDelete={handleDelete}
                onToggleVisibility={handleToggleVisibility}
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
