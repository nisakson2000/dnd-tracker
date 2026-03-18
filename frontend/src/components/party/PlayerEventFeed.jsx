import { memo, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { List, useListRef } from 'react-window';
import {
  Swords, Heart, Star, Package, Scroll,
  MessageCircle, Globe, Settings, ChevronDown, ChevronUp,
  Search, Filter, X
} from 'lucide-react';

/* ─── Category config ─── */
const CATEGORIES = {
  narrative:   { color: '#c9a84c', icon: Scroll,        label: 'Narrative' },
  combat:      { color: '#e74c3c', icon: Swords,        label: 'Combat' },
  skill_check: { color: '#3498db', icon: Star,          label: 'Skill Check' },
  loot:        { color: '#2ecc71', icon: Package,       label: 'Loot' },
  quest:       { color: '#9b59b6', icon: Scroll,        label: 'Quest' },
  npc:         { color: '#1abc9c', icon: MessageCircle,  label: 'NPC' },
  world:       { color: '#e67e22', icon: Globe,         label: 'World' },
  system:      { color: '#6b7280', icon: Settings,      label: 'System' },
};
const CATEGORY_KEYS = Object.keys(CATEGORIES);

/* ─── Relative time helper ─── */
function relativeTime(timestamp) {
  if (!timestamp) return '';
  const diff = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  if (diff < 5) return 'just now';
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/* ─── Row heights ─── */
const COLLAPSED_HEIGHT = 52;
const EXPANDED_EXTRA = 60;

/* ─── Single event card (row component for react-window v2) ─── */
const EventRow = memo(function EventRow({ data, rowIndex, style }) {
  const { events, expandedIds, onToggle } = data;
  const event = events[rowIndex];
  if (!event) return null;

  const expanded = expandedIds.has(event.id);
  const cat = CATEGORIES[event.category] || CATEGORIES.system;
  const Icon = event.icon
    ? (CATEGORIES[event.icon]?.icon || cat.icon)
    : cat.icon;

  return (
    <div style={{ ...style, paddingRight: 8 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          padding: '8px 12px',
          borderLeft: `3px solid ${cat.color}`,
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '0 6px 6px 0',
          marginBottom: 4,
          cursor: event.details ? 'pointer' : 'default',
          transition: 'background 0.15s',
          height: expanded ? COLLAPSED_HEIGHT + EXPANDED_EXTRA - 4 : COLLAPSED_HEIGHT - 4,
          overflow: 'hidden',
        }}
        onClick={() => event.details && onToggle(event.id)}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
      >
        {/* Icon */}
        <div style={{
          width: 26, height: 26, minWidth: 26,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 6,
          background: `${cat.color}18`,
          marginTop: 1,
        }}>
          <Icon size={14} style={{ color: cat.color }} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              fontSize: 13,
              color: '#e2dcc8',
              lineHeight: 1.4,
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: expanded ? 'normal' : 'nowrap',
            }}>
              {event.message}
            </span>
            <span style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.3)',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-ui)',
            }}>
              {relativeTime(event.timestamp)}
            </span>
            {event.details && (
              expanded
                ? <ChevronUp size={12} style={{ color: 'rgba(255,255,255,0.3)' }} />
                : <ChevronDown size={12} style={{ color: 'rgba(255,255,255,0.3)' }} />
            )}
          </div>

          {/* Expandable details */}
          {expanded && event.details && (
            <div style={{
              marginTop: 6,
              padding: '6px 8px',
              fontSize: 12,
              lineHeight: 1.5,
              color: 'rgba(255,255,255,0.55)',
              background: 'rgba(0,0,0,0.25)',
              borderRadius: 4,
              fontFamily: 'var(--font-ui)',
            }}>
              {event.details}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

/* ─── Pulsing dot for empty state ─── */
const pulseKeyframes = `
@keyframes eventFeedPulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50%      { opacity: 1;   transform: scale(1.3); }
}
`;

/* ─── Filter button ─── */
const FilterButton = memo(function FilterButton({ catKey, active, onClick }) {
  const cat = CATEGORIES[catKey];
  return (
    <button
      onClick={() => onClick(catKey)}
      style={{
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: 10,
        fontWeight: 600,
        fontFamily: 'var(--font-ui)',
        border: `1px solid ${active ? cat.color + '40' : 'rgba(255,255,255,0.06)'}`,
        background: active ? cat.color + '18' : 'transparent',
        color: active ? cat.color : 'rgba(255,255,255,0.3)',
        cursor: 'pointer',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
        textTransform: 'capitalize',
      }}
    >
      {cat.label}
    </button>
  );
});

/* ─── Main feed component ─── */
export default memo(function PlayerEventFeed({ events = [], maxEvents = 200 }) {
  const [listRef, listCallbackRef] = useListRef();
  const scrollContainerRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [expandedIds, setExpandedIds] = useState(new Set());
  const userScrollingRef = useRef(false);
  const lastScrollTopRef = useRef(0);

  // Filtering state
  const [activeFilters, setActiveFilters] = useState(new Set()); // empty = show all
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Toggle a category filter
  const toggleFilter = useCallback((catKey) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(catKey)) next.delete(catKey);
      else next.add(catKey);
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFilters(new Set());
    setSearchQuery('');
  }, []);

  // Trim events to maxEvents (keep newest), then apply filters
  const filteredEvents = useMemo(() => {
    let list = events.length > maxEvents ? events.slice(-maxEvents) : events;

    if (activeFilters.size > 0) {
      list = list.filter(e => activeFilters.has(e.category));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(e =>
        e.message?.toLowerCase().includes(q) ||
        e.details?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [events, maxEvents, activeFilters, searchQuery]);

  const isFiltered = activeFilters.size > 0 || searchQuery.trim() !== '';

  // Toggle expand
  const handleToggle = useCallback((id) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Row height getter (supports variable heights for expanded items)
  const getRowHeight = useCallback((index) => {
    const event = filteredEvents[index];
    return expandedIds.has(event?.id) ? COLLAPSED_HEIGHT + EXPANDED_EXTRA : COLLAPSED_HEIGHT;
  }, [filteredEvents, expandedIds]);

  // Row props passed to each EventRow
  const rowProps = useMemo(() => ({
    events: filteredEvents,
    expandedIds,
    onToggle: handleToggle,
  }), [filteredEvents, expandedIds, handleToggle]);

  // Auto-scroll to bottom on new events (only when not filtered)
  useEffect(() => {
    if (autoScroll && !isFiltered && listRef.current && filteredEvents.length > 0) {
      listRef.current.scrollToRow(filteredEvents.length - 1);
    }
  }, [filteredEvents.length, autoScroll, isFiltered, listRef]);

  // Detect user scrolling up to pause auto-scroll
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollEl = el.querySelector('[style*="overflow"]') || el.firstChild;
    if (!scrollEl) return;

    const handleScroll = () => {
      const scrollTop = scrollEl.scrollTop;
      const totalHeight = scrollEl.scrollHeight;
      const viewportHeight = scrollEl.clientHeight;

      if (scrollTop < lastScrollTopRef.current - 5) {
        userScrollingRef.current = true;
        setAutoScroll(false);
      }
      lastScrollTopRef.current = scrollTop;

      const nearBottom = totalHeight - scrollTop - viewportHeight < 40;
      if (nearBottom && userScrollingRef.current) {
        userScrollingRef.current = false;
        setAutoScroll(true);
      }
    };

    scrollEl.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollEl.removeEventListener('scroll', handleScroll);
  }, [filteredEvents.length]);

  // Update relative timestamps every 30s
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  /* ─── Empty state ─── */
  if (events.length === 0) {
    return (
      <div style={{
        background: 'rgba(11,9,20,0.85)',
        borderRadius: 10,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 120,
        gap: 10,
      }}>
        <style>{pulseKeyframes}</style>
        <div style={{
          width: 8, height: 8,
          borderRadius: '50%',
          background: '#c9a84c',
          animation: 'eventFeedPulse 2s ease-in-out infinite',
        }} />
        <span style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.35)',
          fontFamily: 'var(--font-heading)',
          letterSpacing: '0.05em',
        }}>
          Awaiting events...
        </span>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(11,9,20,0.85)',
      borderRadius: 10,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Header with filter controls */}
      <div style={{
        padding: '8px 14px 6px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Title row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: showFilters ? 6 : 0,
        }}>
          <span style={{
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#c9a84c',
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
          }}>
            Event Feed
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {isFiltered && (
              <span style={{
                fontSize: 10,
                color: '#c9a84c',
                fontFamily: 'var(--font-ui)',
              }}>
                {filteredEvents.length}/{events.length > maxEvents ? maxEvents : events.length}
              </span>
            )}
            {!isFiltered && (
              <span style={{
                fontSize: 10,
                color: 'rgba(255,255,255,0.25)',
                fontFamily: 'var(--font-ui)',
              }}>
                {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
              </span>
            )}
            <button
              onClick={() => setShowFilters(f => !f)}
              style={{
                background: showFilters || isFiltered ? 'rgba(201,168,76,0.12)' : 'transparent',
                border: `1px solid ${showFilters || isFiltered ? 'rgba(201,168,76,0.25)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: 4,
                padding: '2px 6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                color: showFilters || isFiltered ? '#c9a84c' : 'rgba(255,255,255,0.3)',
                transition: 'all 0.15s',
              }}
              title="Toggle filters"
            >
              <Filter size={10} />
              {isFiltered && (
                <span style={{ fontSize: 9, fontWeight: 700 }}>
                  {activeFilters.size > 0 ? activeFilters.size : ''}{searchQuery ? 'Q' : ''}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter bar (collapsible) */}
        {showFilters && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {/* Search */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 4,
              padding: '3px 8px',
            }}>
              <Search size={11} style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search events..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#e2dcc8',
                  fontSize: 11,
                  fontFamily: 'var(--font-ui)',
                  padding: '2px 0',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
                >
                  <X size={10} style={{ color: 'rgba(255,255,255,0.3)' }} />
                </button>
              )}
            </div>

            {/* Category filter buttons */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 4,
              alignItems: 'center',
            }}>
              {CATEGORY_KEYS.map(key => (
                <FilterButton
                  key={key}
                  catKey={key}
                  active={activeFilters.has(key)}
                  onClick={toggleFilter}
                />
              ))}
              {isFiltered && (
                <button
                  onClick={clearFilters}
                  style={{
                    padding: '2px 6px',
                    borderRadius: 4,
                    fontSize: 10,
                    border: '1px solid rgba(239,68,68,0.2)',
                    background: 'rgba(239,68,68,0.08)',
                    color: '#fca5a5',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-ui)',
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Scrollable area with react-window v2 */}
      {filteredEvents.length === 0 ? (
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.25)',
          fontSize: 12,
          fontFamily: 'var(--font-ui)',
          fontStyle: 'italic',
        }}>
          No events match filters
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          style={{
            flex: 1,
            minHeight: 0,
            padding: '6px 0 6px 8px',
          }}
        >
          <List
            listRef={listCallbackRef}
            rowCount={filteredEvents.length}
            rowHeight={getRowHeight}
            rowComponent={EventRow}
            rowProps={rowProps}
            overscanCount={5}
            style={{
              height: '100%',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(201,168,76,0.25) transparent',
            }}
          />
        </div>
      )}

      {/* "Scroll to latest" button when auto-scroll is paused */}
      {!autoScroll && !isFiltered && (
        <button
          onClick={() => {
            setAutoScroll(true);
            if (listRef.current) {
              listRef.current.scrollToRow(filteredEvents.length - 1);
            }
          }}
          style={{
            position: 'absolute',
            bottom: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(201,168,76,0.15)',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: 20,
            padding: '4px 14px',
            fontSize: 11,
            color: '#c9a84c',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontFamily: 'var(--font-heading)',
            backdropFilter: 'blur(8px)',
            zIndex: 2,
          }}
        >
          <ChevronDown size={12} />
          New events
        </button>
      )}
    </div>
  );
})
