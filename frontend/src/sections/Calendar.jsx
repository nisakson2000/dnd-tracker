import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Calendar as CalendarIcon, Sun, Moon, ChevronLeft, ChevronRight, Plus,
  X, Clock, Swords, Footprints, Sparkles, Tag, List, LayoutGrid, FastForward,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Harptos Calendar Data ──────────────────────────────────────────

const MONTHS = [
  { name: 'Hammer',    common: 'Deepwinter',   days: 30 },
  { name: 'Alturiak',  common: 'The Claw of Winter', days: 30 },
  { name: 'Ches',      common: 'The Claw of Sunsets', days: 30 },
  { name: 'Tarsakh',   common: 'The Claw of Storms',  days: 30 },
  { name: 'Mirtul',    common: 'The Melting',   days: 30 },
  { name: 'Kythorn',   common: 'The Time of Flowers', days: 30 },
  { name: 'Flamerule', common: 'Summertide',    days: 30 },
  { name: 'Eleasis',   common: 'Highsun',       days: 30 },
  { name: 'Eleint',    common: 'The Fading',    days: 30 },
  { name: 'Marpenoth', common: 'Leaffall',      days: 30 },
  { name: 'Uktar',     common: 'The Rotting',   days: 30 },
  { name: 'Nightal',   common: 'The Drawing Down', days: 30 },
];

// Festival days that fall between months (afterMonthIndex => festival)
const FESTIVALS = {
  0:  { name: 'Midwinter',       desc: 'The highpoint of winter, a day of feasting.' },
  3:  { name: 'Greengrass',      desc: 'The first day of spring, welcoming warmer weather.' },
  6:  { name: 'Midsummer',       desc: 'The longest day of the year, celebrated with revelry.' },
  8:  { name: 'Highharvestide',   desc: 'A harvest feast giving thanks for the bounty.' },
  10: { name: 'Feast of the Moon', desc: 'Honoring the dead, a night of remembrance.' },
};

// Shieldmeet: leap day every 4 years, occurs after Midsummer
function isLeapYear(year) { return year % 4 === 0; }

const SEASONS = {
  winter: { color: '#60a5fa', label: 'Winter', icon: '❄️' },
  spring: { color: '#4ade80', label: 'Spring', icon: '🌱' },
  summer: { color: '#fbbf24', label: 'Summer', icon: '☀️' },
  autumn: { color: '#f97316', label: 'Autumn', icon: '🍂' },
};

function getSeason(monthIndex) {
  if ([11, 0, 1].includes(monthIndex)) return 'winter';
  if ([2, 3, 4].includes(monthIndex)) return 'spring';
  if ([5, 6, 7].includes(monthIndex)) return 'summer';
  return 'autumn';
}

const EVENT_TYPES = [
  { id: 'session',  label: 'Session',  color: '#60a5fa' },
  { id: 'combat',   label: 'Combat',   color: '#ef4444' },
  { id: 'travel',   label: 'Travel',   color: '#4ade80' },
  { id: 'festival', label: 'Festival', color: '#fbbf24' },
  { id: 'custom',   label: 'Custom',   color: '#9ca3af' },
];

function getEventColor(type) {
  return EVENT_TYPES.find(t => t.id === type)?.color || '#9ca3af';
}

// ─── Moon Phase Calculation (Selûne — ~30.4 day cycle) ──────────────

const MOON_CYCLE = 30.4375; // ~30 day cycle for Selûne
const MOON_PHASES = [
  { name: 'New Moon',        icon: '🌑' },
  { name: 'Waxing Crescent', icon: '🌒' },
  { name: 'First Quarter',   icon: '🌓' },
  { name: 'Waxing Gibbous',  icon: '🌔' },
  { name: 'Full Moon',       icon: '🌕' },
  { name: 'Waning Gibbous',  icon: '🌖' },
  { name: 'Last Quarter',    icon: '🌗' },
  { name: 'Waning Crescent', icon: '🌘' },
];

function getMoonPhase(year, monthIndex, day) {
  // Calculate absolute day from epoch (year 0, month 0, day 1)
  const totalDays = (year * 365) + Math.floor(year / 4) + (monthIndex * 30) + day;
  const phase = totalDays % MOON_CYCLE;
  const idx = Math.floor((phase / MOON_CYCLE) * 8) % 8;
  return MOON_PHASES[idx];
}

// ─── Date key helper ────────────────────────────────────────────────

function dateKey(year, monthIndex, day) {
  return `${year}-${monthIndex}-${day}`;
}

function festivalKey(year, monthIndex) {
  return `${year}-fest-${monthIndex}`;
}

function shieldmeetKey(year) {
  return `${year}-shieldmeet`;
}

// ─── Storage helpers ────────────────────────────────────────────────

function loadCalendarData(characterId) {
  try {
    const raw = localStorage.getItem(`codex-calendar-${characterId}`);
    return raw ? JSON.parse(raw) : { currentYear: 1492, currentMonth: 0, currentDay: 1, events: {} };
  } catch { return { currentYear: 1492, currentMonth: 0, currentDay: 1, events: {} }; }
}

function saveCalendarData(characterId, data) {
  localStorage.setItem(`codex-calendar-${characterId}`, JSON.stringify(data));
}

// ─── Pre-populated festival events ──────────────────────────────────

function getFestivalEvents(year) {
  const events = {};
  for (const [mIdx, fest] of Object.entries(FESTIVALS)) {
    const key = festivalKey(year, parseInt(mIdx));
    events[key] = [{ title: fest.name, description: fest.desc, type: 'festival', session: null }];
  }
  if (isLeapYear(year)) {
    const key = shieldmeetKey(year);
    events[key] = [{ title: 'Shieldmeet', description: 'A leap day occurring once every four years, after Midsummer. A day of open council and contests.', type: 'festival', session: null }];
  }
  return events;
}

// ─── Styles ─────────────────────────────────────────────────────────

const S = {
  container: {
    maxWidth: 920, margin: '0 auto', fontFamily: 'var(--font-ui)',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 20, flexWrap: 'wrap', gap: 12,
  },
  title: {
    fontFamily: 'var(--font-display)', fontSize: 'calc(22px * var(--font-scale, 1))',
    fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 10,
  },
  subtitle: {
    fontSize: 'calc(11px * var(--font-scale, 1))', color: 'var(--text-dim)',
    fontFamily: 'var(--font-ui)', marginTop: 2,
  },
  navRow: {
    display: 'flex', alignItems: 'center', gap: 8,
  },
  navBtn: {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: 'var(--text-dim)',
    display: 'flex', alignItems: 'center', transition: 'all 0.15s',
  },
  monthLabel: {
    fontFamily: 'var(--font-display)', fontSize: 'calc(16px * var(--font-scale, 1))',
    fontWeight: 600, color: 'var(--text)', minWidth: 200, textAlign: 'center',
  },
  seasonBadge: (color) => ({
    fontSize: 10, padding: '2px 8px', borderRadius: 6,
    background: `${color}15`, color, border: `1px solid ${color}30`,
    fontWeight: 600, fontFamily: 'var(--font-ui)',
  }),
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4,
  },
  dayHeader: {
    padding: '6px 4px', textAlign: 'center', fontSize: 9, fontWeight: 600,
    color: 'var(--text-mute)', fontFamily: 'var(--font-mono)',
    textTransform: 'uppercase', letterSpacing: '0.12em',
  },
  dayCell: (isToday, hasEvents) => ({
    background: isToday ? 'rgba(192,132,252,0.08)' : 'rgba(255,255,255,0.03)',
    border: isToday ? '1px solid #c084fc' : '1px solid rgba(255,255,255,0.06)',
    borderRadius: 8, padding: '6px 8px', minHeight: 64, cursor: 'pointer',
    transition: 'all 0.15s', position: 'relative',
  }),
  dayCellHover: {
    background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)',
  },
  dayNum: (isToday) => ({
    fontSize: 12, fontWeight: isToday ? 700 : 500,
    color: isToday ? '#c084fc' : 'var(--text)',
    fontFamily: 'var(--font-ui)',
  }),
  moonIcon: {
    fontSize: 10, position: 'absolute', top: 6, right: 8, opacity: 0.6,
  },
  eventDot: (color) => ({
    width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0,
  }),
  festivalRow: (isToday) => ({
    background: isToday ? 'rgba(251,191,36,0.10)' : 'rgba(251,191,36,0.04)',
    border: isToday ? '1px solid #fbbf24' : '1px solid rgba(251,191,36,0.15)',
    borderRadius: 8, padding: '10px 14px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.15s',
    gridColumn: '1 / -1',
  }),
  // Day detail panel
  panel: {
    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12, padding: 20, marginTop: 16,
  },
  input: {
    width: '100%', padding: '8px 12px', borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)',
    color: 'var(--text)', fontSize: 13, fontFamily: 'var(--font-ui)', outline: 'none',
  },
  textarea: {
    width: '100%', padding: '8px 12px', borderRadius: 8, minHeight: 60, resize: 'vertical',
    border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)',
    color: 'var(--text)', fontSize: 13, fontFamily: 'var(--font-ui)', outline: 'none',
  },
  select: {
    padding: '8px 12px', borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)',
    color: 'var(--text)', fontSize: 13, fontFamily: 'var(--font-ui)', outline: 'none',
  },
  btn: (accent) => ({
    padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
    fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-ui)',
    background: accent ? 'rgba(192,132,252,0.15)' : 'rgba(255,255,255,0.06)',
    color: accent ? '#c084fc' : 'var(--text-dim)',
    transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6,
  }),
  // Advance day controls
  advanceRow: {
    display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
  },
  // Timeline
  timelineItem: {
    display: 'flex', gap: 12, padding: '10px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  timelineDot: (color) => ({
    width: 10, height: 10, borderRadius: '50%', background: color,
    marginTop: 4, flexShrink: 0,
  }),
};

// ─── Component ──────────────────────────────────────────────────────

export default function FantasyCalendar({ characterId }) {
  const [calData, setCalData] = useState(() => loadCalendarData(characterId));
  const [viewMonth, setViewMonth] = useState(calData.currentMonth);
  const [viewYear, setViewYear] = useState(calData.currentYear);
  const [selectedDay, setSelectedDay] = useState(null); // { type: 'day'|'festival'|'shieldmeet', monthIndex, day }
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' | 'timeline'
  const [advanceDays, setAdvanceDays] = useState(1);
  const [direction, setDirection] = useState(0);

  const hasLoaded = useRef(false);

  // Event form
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formType, setFormType] = useState('custom');
  const [formSession, setFormSession] = useState('');

  // Persist on change
  useEffect(() => {
    if (!hasLoaded.current) return;
    saveCalendarData(characterId, calData);
  }, [calData, characterId]);

  // Reload when characterId changes
  useEffect(() => {
    hasLoaded.current = false;
    const d = loadCalendarData(characterId);
    setCalData(d);
    setViewMonth(d.currentMonth);
    setViewYear(d.currentYear);
    setSelectedDay(null);
    hasLoaded.current = true;
  }, [characterId]);

  // Merge festival events with user events
  const allEvents = useMemo(() => {
    const festEvents = getFestivalEvents(viewYear);
    const merged = { ...festEvents };
    for (const [k, v] of Object.entries(calData.events)) {
      if (merged[k]) {
        merged[k] = [...merged[k], ...v];
      } else {
        merged[k] = v;
      }
    }
    return merged;
  }, [calData.events, viewYear]);

  // ── Navigation ──

  const goMonth = useCallback((delta) => {
    setDirection(delta);
    setViewMonth(prev => {
      let m = prev + delta;
      if (m < 0) { setViewYear(y => y - 1); return 11; }
      if (m > 11) { setViewYear(y => y + 1); return 0; }
      return m;
    });
    setSelectedDay(null);
  }, []);

  const goToToday = useCallback(() => {
    setViewMonth(calData.currentMonth);
    setViewYear(calData.currentYear);
    setSelectedDay(null);
  }, [calData.currentMonth, calData.currentYear]);

  // ── Advance day ──

  const advanceDate = useCallback((numDays) => {
    setCalData(prev => {
      let { currentYear, currentMonth, currentDay } = prev;
      for (let i = 0; i < numDays; i++) {
        currentDay++;
        if (currentDay > 30) {
          currentDay = 1;
          currentMonth++;
          if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
          }
        }
      }
      return { ...prev, currentYear, currentMonth, currentDay };
    });
  }, []);

  // ── Get selected key ──

  const getSelectedKey = useCallback(() => {
    if (!selectedDay) return null;
    if (selectedDay.type === 'festival') return festivalKey(viewYear, selectedDay.monthIndex);
    if (selectedDay.type === 'shieldmeet') return shieldmeetKey(viewYear);
    return dateKey(viewYear, viewMonth, selectedDay.day);
  }, [selectedDay, viewYear, viewMonth]);

  const selectedEvents = useMemo(() => {
    const key = getSelectedKey();
    return key ? (allEvents[key] || []) : [];
  }, [getSelectedKey, allEvents]);

  // ── Add event ──

  const addEvent = useCallback(() => {
    if (!formTitle.trim() || !selectedDay) return;
    const key = getSelectedKey();
    if (!key) return;
    const newEvent = {
      title: formTitle.trim(),
      description: formDesc.trim(),
      type: formType,
      session: formSession ? parseInt(formSession) : null,
      userEvent: true,
    };
    setCalData(prev => ({
      ...prev,
      events: {
        ...prev.events,
        [key]: [...(prev.events[key] || []), newEvent],
      },
    }));
    setFormTitle(''); setFormDesc(''); setFormType('custom'); setFormSession('');
    setShowForm(false);
  }, [formTitle, formDesc, formType, formSession, selectedDay, getSelectedKey]);

  // ── Delete event ──

  const deleteEvent = useCallback((eventIndex) => {
    const key = getSelectedKey();
    if (!key) return;
    setCalData(prev => {
      const existing = prev.events[key] || [];
      const updated = existing.filter((_, i) => i !== eventIndex);
      const events = { ...prev.events };
      if (updated.length === 0) {
        delete events[key];
      } else {
        events[key] = updated;
      }
      return { ...prev, events };
    });
  }, [getSelectedKey]);

  // ── Build calendar grid ──

  const gridItems = useMemo(() => {
    const items = [];
    const month = MONTHS[viewMonth];
    const isCurrentMonth = viewYear === calData.currentYear && viewMonth === calData.currentMonth;

    // Festivals go between months. Show festival after the month it follows:
    const festAfter = FESTIVALS[viewMonth];
    const hasShieldmeet = viewMonth === 6 && isLeapYear(viewYear); // Shieldmeet after Midsummer (Flamerule=6)

    for (let d = 1; d <= month.days; d++) {
      const key = dateKey(viewYear, viewMonth, d);
      const events = allEvents[key] || [];
      const isToday = isCurrentMonth && d === calData.currentDay;
      items.push({ type: 'day', day: d, key, events, isToday });
    }

    // Add festival after this month
    if (festAfter) {
      const fKey = festivalKey(viewYear, viewMonth);
      const fEvents = allEvents[fKey] || [];
      const isTodayFest = false; // Festivals are interstitial
      items.push({ type: 'festival', name: festAfter.name, desc: festAfter.desc, key: fKey, events: fEvents, monthIndex: viewMonth, isToday: isTodayFest });
    }

    // Add Shieldmeet
    if (hasShieldmeet) {
      const sKey = shieldmeetKey(viewYear);
      const sEvents = allEvents[sKey] || [];
      items.push({ type: 'shieldmeet', name: 'Shieldmeet', desc: 'A leap day — open council, contests, and celebration.', key: sKey, events: sEvents, isToday: false });
    }

    return items;
  }, [viewMonth, viewYear, calData, allEvents]);

  // ── Timeline: collect all events across all months for this year ──

  const timelineEvents = useMemo(() => {
    if (viewMode !== 'timeline') return [];
    const items = [];
    for (let m = 0; m < 12; m++) {
      for (let d = 1; d <= 30; d++) {
        const key = dateKey(viewYear, m, d);
        const evts = allEvents[key];
        if (evts?.length) {
          for (const evt of evts) {
            items.push({ ...evt, year: viewYear, monthIndex: m, day: d, dateLabel: `${d} ${MONTHS[m].name}` });
          }
        }
      }
      // Festival
      const fKey = festivalKey(viewYear, m);
      const fEvts = allEvents[fKey];
      if (fEvts?.length) {
        for (const evt of fEvts) {
          items.push({ ...evt, year: viewYear, monthIndex: m, day: 31, dateLabel: FESTIVALS[m]?.name || 'Festival' });
        }
      }
    }
    // Shieldmeet
    if (isLeapYear(viewYear)) {
      const sKey = shieldmeetKey(viewYear);
      const sEvts = allEvents[sKey];
      if (sEvts?.length) {
        for (const evt of sEvts) {
          items.push({ ...evt, year: viewYear, monthIndex: 6, day: 32, dateLabel: 'Shieldmeet' });
        }
      }
    }
    return items;
  }, [viewMode, viewYear, allEvents]);

  // ── Season ──

  const season = SEASONS[getSeason(viewMonth)];

  // ── Day name headers (Harptos uses tendays — 3 tendays per month) ──
  const dayHeaders = ['I', 'II', 'III', 'IV', 'V', 'VI'];

  // ── Render ──

  const selectedLabel = useMemo(() => {
    if (!selectedDay) return '';
    if (selectedDay.type === 'festival') return FESTIVALS[selectedDay.monthIndex]?.name || 'Festival';
    if (selectedDay.type === 'shieldmeet') return 'Shieldmeet';
    return `${selectedDay.day} ${MONTHS[viewMonth].name}, ${viewYear} DR`;
  }, [selectedDay, viewMonth, viewYear]);

  return (
    <div style={S.container}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <div style={S.title}>
            <CalendarIcon size={22} style={{ color: '#c084fc' }} />
            Fantasy Calendar
          </div>
          <div style={S.subtitle}>
            Harptos Calendar — {calData.currentDay} {MONTHS[calData.currentMonth].name}, {calData.currentYear} DR
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setViewMode(viewMode === 'calendar' ? 'timeline' : 'calendar')}
            style={S.btn(false)}
            title={viewMode === 'calendar' ? 'Timeline View' : 'Calendar View'}
          >
            {viewMode === 'calendar' ? <List size={14} /> : <LayoutGrid size={14} />}
            {viewMode === 'calendar' ? 'Timeline' : 'Calendar'}
          </button>
          <button onClick={goToToday} style={S.btn(true)}>
            <Clock size={14} /> Today
          </button>
        </div>
      </div>

      {/* Advance Day Controls */}
      <div style={{ ...S.panel, marginTop: 0, marginBottom: 16, padding: '12px 16px' }}>
        <div style={S.advanceRow}>
          <span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600 }}>Advance Time:</span>
          <button onClick={() => advanceDate(1)} style={S.btn(true)}>
            <FastForward size={12} /> +1 Day
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input
              type="number"
              min={1}
              max={365}
              value={advanceDays}
              onChange={e => setAdvanceDays(Math.max(1, parseInt(e.target.value) || 1))}
              style={{ ...S.input, width: 60, padding: '6px 8px', textAlign: 'center' }}
            />
            <button onClick={() => advanceDate(advanceDays)} style={S.btn(false)}>
              <FastForward size={12} /> +{advanceDays} Days
            </button>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={S.seasonBadge(season.color)}>
              {season.icon} {season.label}
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-mute)' }}>
              {getMoonPhase(viewYear, viewMonth, calData.currentDay).icon} {getMoonPhase(viewYear, viewMonth, calData.currentDay).name}
            </span>
          </div>
        </div>
      </div>

      {/* Month Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
        <button onClick={() => goMonth(-1)} style={S.navBtn}>
          <ChevronLeft size={16} />
        </button>
        <div style={S.monthLabel}>
          {MONTHS[viewMonth].name}
          <span style={{ fontSize: 11, color: 'var(--text-dim)', marginLeft: 8 }}>
            ({MONTHS[viewMonth].common})
          </span>
        </div>
        <button onClick={() => goMonth(1)} style={S.navBtn}>
          <ChevronRight size={16} />
        </button>
        <div style={{ fontSize: 13, color: 'var(--text-dim)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
          {viewYear} DR
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <>
          {/* Day headers */}
          <div style={S.grid}>
            {dayHeaders.map(h => (
              <div key={h} style={S.dayHeader}>{h}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${viewYear}-${viewMonth}`}
              initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
              transition={{ duration: 0.2 }}
              style={S.grid}
            >
              {gridItems.map((item) => {
                if (item.type === 'festival' || item.type === 'shieldmeet') {
                  const isSelected = selectedDay?.type === item.type && (item.type === 'shieldmeet' || selectedDay?.monthIndex === item.monthIndex);
                  return (
                    <div
                      key={item.key}
                      onClick={() => setSelectedDay(item.type === 'shieldmeet' ? { type: 'shieldmeet' } : { type: 'festival', monthIndex: item.monthIndex })}
                      style={{
                        ...S.festivalRow(item.isToday),
                        ...(isSelected ? { borderColor: '#fbbf24', background: 'rgba(251,191,36,0.12)' } : {}),
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(251,191,36,0.10)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = isSelected ? 'rgba(251,191,36,0.12)' : item.isToday ? 'rgba(251,191,36,0.10)' : 'rgba(251,191,36,0.04)'; }}
                    >
                      <Sparkles size={14} style={{ color: '#fbbf24' }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#fbbf24', fontFamily: 'var(--font-display)' }}>
                        {item.name}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>{item.desc}</span>
                      {item.events.length > 1 && (
                        <span style={{ marginLeft: 'auto', fontSize: 9, color: '#fbbf24', opacity: 0.7 }}>
                          +{item.events.length - 1} events
                        </span>
                      )}
                    </div>
                  );
                }

                const isSelected = selectedDay?.type === 'day' && selectedDay?.day === item.day;
                const moon = getMoonPhase(viewYear, viewMonth, item.day);

                return (
                  <div
                    key={item.day}
                    onClick={() => setSelectedDay({ type: 'day', day: item.day })}
                    style={{
                      ...S.dayCell(item.isToday, item.events.length > 0),
                      ...(isSelected && !item.isToday ? { borderColor: 'rgba(192,132,252,0.5)', background: 'rgba(192,132,252,0.05)' } : {}),
                    }}
                    onMouseEnter={e => {
                      if (!item.isToday && !isSelected) {
                        e.currentTarget.style.background = S.dayCellHover.background;
                        e.currentTarget.style.borderColor = S.dayCellHover.borderColor;
                      }
                    }}
                    onMouseLeave={e => {
                      if (!item.isToday && !isSelected) {
                        e.currentTarget.style.background = S.dayCell(false, false).background;
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={S.dayNum(item.isToday)}>{item.day}</span>
                      <span style={S.moonIcon} title={moon.name}>{moon.icon}</span>
                    </div>
                    {item.events.length > 0 && (
                      <div style={{ display: 'flex', gap: 3, marginTop: 6, flexWrap: 'wrap' }}>
                        {item.events.slice(0, 4).map((evt, i) => (
                          <div key={i} style={S.eventDot(getEventColor(evt.type))} title={evt.title} />
                        ))}
                        {item.events.length > 4 && (
                          <span style={{ fontSize: 8, color: 'var(--text-mute)' }}>+{item.events.length - 4}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        /* Timeline View */
        <div style={S.panel}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12, fontFamily: 'var(--font-display)' }}>
            Events in {viewYear} DR
          </div>
          {timelineEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 30, color: 'var(--text-mute)', fontSize: 13 }}>
              No events this year. Switch to calendar view and click a day to add events.
            </div>
          ) : (
            timelineEvents.map((evt, i) => (
              <div key={i} style={S.timelineItem}>
                <div style={S.timelineDot(getEventColor(evt.type))} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{evt.title}</span>
                    <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: `${getEventColor(evt.type)}15`, color: getEventColor(evt.type), fontWeight: 600 }}>
                      {evt.type}
                    </span>
                    {evt.session && (
                      <span style={{ fontSize: 10, color: 'var(--text-mute)' }}>Session #{evt.session}</span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>{evt.dateLabel}, {viewYear} DR</div>
                  {evt.description && (
                    <div style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 4 }}>{evt.description}</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Day Detail Panel */}
      {selectedDay && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={S.panel}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
              {selectedLabel}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { setShowForm(true); }} style={S.btn(true)}>
                <Plus size={12} /> Add Event
              </button>
              <button onClick={() => setSelectedDay(null)} style={{ ...S.btn(false), padding: '6px 8px' }}>
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Existing events */}
          {selectedEvents.length === 0 && !showForm && (
            <div style={{ color: 'var(--text-mute)', fontSize: 12, textAlign: 'center', padding: 16 }}>
              No events. Click "Add Event" to create one.
            </div>
          )}
          {selectedEvents.map((evt, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'flex-start' }}>
              <div style={S.eventDot(getEventColor(evt.type))} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{evt.title}</span>
                  <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 4, background: `${getEventColor(evt.type)}15`, color: getEventColor(evt.type), fontWeight: 600 }}>
                    {evt.type}
                  </span>
                  {evt.session && <span style={{ fontSize: 10, color: 'var(--text-mute)' }}>Session #{evt.session}</span>}
                </div>
                {evt.description && <div style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 3 }}>{evt.description}</div>}
              </div>
              {/* Only allow deleting user events, not built-in festivals */}
              {evt.userEvent && (
                <button onClick={() => deleteEvent(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-mute)', padding: 4 }}>
                  <X size={12} />
                </button>
              )}
            </div>
          ))}

          {/* Add Event Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden', marginTop: 12 }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 0' }}>
                  <input
                    type="text"
                    placeholder="Event title..."
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    style={S.input}
                    autoFocus
                    onKeyDown={e => { if (e.key === 'Enter') addEvent(); }}
                  />
                  <textarea
                    placeholder="Description (optional)..."
                    value={formDesc}
                    onChange={e => setFormDesc(e.target.value)}
                    style={S.textarea}
                  />
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <select value={formType} onChange={e => setFormType(e.target.value)} style={S.select}>
                      {EVENT_TYPES.map(t => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Session #"
                      value={formSession}
                      onChange={e => setFormSession(e.target.value)}
                      style={{ ...S.input, width: 100 }}
                    />
                    <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
                      <button onClick={() => setShowForm(false)} style={S.btn(false)}>Cancel</button>
                      <button onClick={addEvent} style={S.btn(true)} disabled={!formTitle.trim()}>
                        <Plus size={12} /> Save
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Year navigation */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 20, paddingBottom: 20 }}>
        <button onClick={() => { setViewYear(y => y - 1); setSelectedDay(null); }} style={S.navBtn}>
          <ChevronLeft size={14} />
        </button>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dim)', fontFamily: 'var(--font-display)' }}>
          Year {viewYear} DR
        </span>
        <button onClick={() => { setViewYear(y => y + 1); setSelectedDay(null); }} style={S.navBtn}>
          <ChevronRight size={14} />
        </button>
        {isLeapYear(viewYear) && (
          <span style={{ fontSize: 10, color: '#fbbf24', opacity: 0.7 }}>Leap Year (Shieldmeet)</span>
        )}
      </div>
    </div>
  );
}
