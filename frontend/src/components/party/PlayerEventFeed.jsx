import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords, Heart, Star, Package, Scroll,
  MessageCircle, Globe, Settings, ChevronDown, ChevronUp
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

/* ─── Virtualized window constants ─── */
const ITEM_HEIGHT = 52;       // estimated px per collapsed card
const BUFFER_COUNT = 8;       // extra items above/below viewport

/* ─── Single event card ─── */
function EventCard({ event, index }) {
  const [expanded, setExpanded] = useState(false);
  const cat = CATEGORIES[event.category] || CATEGORIES.system;
  const Icon = event.icon
    ? (CATEGORIES[event.icon]?.icon || cat.icon)
    : cat.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
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
      }}
      onClick={() => event.details && setExpanded(e => !e)}
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
        <AnimatePresence>
          {expanded && event.details && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: 'hidden' }}
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Pulsing dot for empty state ─── */
const pulseKeyframes = `
@keyframes eventFeedPulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50%      { opacity: 1;   transform: scale(1.3); }
}
`;

/* ─── Main feed component ─── */
export default function PlayerEventFeed({ events = [], maxEvents = 200 }) {
  const scrollRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 30 });
  const userScrollingRef = useRef(false);
  const lastScrollTopRef = useRef(0);

  // Trim events to maxEvents (keep newest)
  const trimmedEvents = useMemo(
    () => (events.length > maxEvents ? events.slice(-maxEvents) : events),
    [events, maxEvents]
  );

  // Compute visible window on scroll
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollTop = el.scrollTop;
    const viewportHeight = el.clientHeight;
    const totalHeight = el.scrollHeight;

    // Detect user scrolling up -> pause auto-scroll
    if (scrollTop < lastScrollTopRef.current - 5) {
      userScrollingRef.current = true;
      setAutoScroll(false);
    }
    lastScrollTopRef.current = scrollTop;

    // Re-enable auto-scroll if user scrolled near bottom
    const nearBottom = totalHeight - scrollTop - viewportHeight < 40;
    if (nearBottom && userScrollingRef.current) {
      userScrollingRef.current = false;
      setAutoScroll(true);
    }

    // Virtualization range
    const start = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER_COUNT);
    const end = Math.min(
      trimmedEvents.length,
      Math.ceil((scrollTop + viewportHeight) / ITEM_HEIGHT) + BUFFER_COUNT
    );
    setVisibleRange({ start, end });
  }, [trimmedEvents.length]);

  // Auto-scroll to bottom on new events
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [trimmedEvents.length, autoScroll]);

  // Initial visible range
  useEffect(() => {
    setVisibleRange({ start: Math.max(0, trimmedEvents.length - 30), end: trimmedEvents.length });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update relative timestamps every 30s
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const visibleEvents = trimmedEvents.slice(visibleRange.start, visibleRange.end);
  const topPad = visibleRange.start * ITEM_HEIGHT;
  const bottomPad = Math.max(0, (trimmedEvents.length - visibleRange.end) * ITEM_HEIGHT);

  /* ─── Empty state ─── */
  if (trimmedEvents.length === 0) {
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
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px 8px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
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
        <span style={{
          fontSize: 10,
          color: 'rgba(255,255,255,0.25)',
          fontFamily: 'var(--font-ui)',
        }}>
          {trimmedEvents.length} event{trimmedEvents.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Scrollable area */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '6px 8px',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(201,168,76,0.25) transparent',
        }}
      >
        {/* Top spacer for virtualization */}
        {topPad > 0 && <div style={{ height: topPad }} />}

        <AnimatePresence initial={false}>
          {visibleEvents.map((event, i) => (
            <EventCard
              key={event.id || `${visibleRange.start + i}`}
              event={event}
              index={visibleRange.start + i}
            />
          ))}
        </AnimatePresence>

        {/* Bottom spacer for virtualization */}
        {bottomPad > 0 && <div style={{ height: bottomPad }} />}
      </div>

      {/* "Scroll to latest" button when auto-scroll is paused */}
      {!autoScroll && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          onClick={() => {
            setAutoScroll(true);
            if (scrollRef.current) {
              scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
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
        </motion.button>
      )}
    </div>
  );
}
