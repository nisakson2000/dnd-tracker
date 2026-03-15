import { useState, useCallback } from 'react';
import { Dices, ChevronDown, ChevronUp, Search, RotateCcw, Copy, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { ROLLABLE_TABLES, TABLE_CATEGORIES } from '../data/rollableTables';

function rollOnTable(entries) {
  return entries[Math.floor(Math.random() * entries.length)];
}

export default function RollableTablePanel() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedTable, setExpandedTable] = useState(null);
  const [results, setResults] = useState({}); // { tableId: [{ text, timestamp }] }

  const filteredTables = ROLLABLE_TABLES.filter(t => {
    const matchCat = category === 'all' || t.category === category;
    const matchSearch = !search.trim() ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleRoll = useCallback((table) => {
    const result = rollOnTable(table.entries);
    setResults(prev => ({
      ...prev,
      [table.id]: [
        { text: result, timestamp: Date.now() },
        ...(prev[table.id] || []).slice(0, 9),
      ],
    }));
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(
      () => toast.success('Copied!', { duration: 1500 }),
      () => toast.error('Copy failed')
    );
  };

  const clearResults = (tableId) => {
    setResults(prev => {
      const next = { ...prev };
      delete next[tableId];
      return next;
    });
  };

  const CATEGORY_COLORS = {
    Loot: { text: '#fbbf24', bg: 'rgba(251,191,36,0.10)', border: 'rgba(251,191,36,0.25)' },
    Encounters: { text: '#f87171', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.25)' },
    NPCs: { text: '#60a5fa', bg: 'rgba(96,165,250,0.10)', border: 'rgba(96,165,250,0.25)' },
    World: { text: '#4ade80', bg: 'rgba(74,222,128,0.10)', border: 'rgba(74,222,128,0.25)' },
    Magic: { text: '#c084fc', bg: 'rgba(192,132,252,0.10)', border: 'rgba(192,132,252,0.25)' },
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Dices size={18} style={{ color: 'rgba(201,168,76,0.7)' }} />
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 16, color: 'rgba(240,228,200,0.9)', letterSpacing: '0.02em' }}>
          Random Tables
        </span>
        <span style={{ fontSize: 10, color: 'rgba(200,175,130,0.3)', fontFamily: 'var(--font-ui)', marginLeft: 4 }}>
          No AI required
        </span>
      </div>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(200,175,130,0.3)' }} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search tables..."
          className="input w-full"
          style={{ paddingLeft: 34 }}
        />
      </div>

      {/* Category filters */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <button
          onClick={() => setCategory('all')}
          style={{
            fontSize: 11, padding: '4px 12px', borderRadius: 99, cursor: 'pointer',
            fontFamily: 'var(--font-heading)', letterSpacing: '0.05em',
            background: category === 'all' ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${category === 'all' ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.08)'}`,
            color: category === 'all' ? 'rgba(201,168,76,0.8)' : 'rgba(200,175,130,0.4)',
            transition: 'all 0.15s',
          }}
        >
          All
        </button>
        {TABLE_CATEGORIES.map(cat => {
          const colors = CATEGORY_COLORS[cat] || {};
          const active = category === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                fontSize: 11, padding: '4px 12px', borderRadius: 99, cursor: 'pointer',
                fontFamily: 'var(--font-heading)', letterSpacing: '0.05em',
                background: active ? colors.bg : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active ? colors.border : 'rgba(255,255,255,0.08)'}`,
                color: active ? colors.text : 'rgba(200,175,130,0.4)',
                transition: 'all 0.15s',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Table list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filteredTables.map(table => {
          const isExpanded = expandedTable === table.id;
          const tableResults = results[table.id] || [];
          const catColors = CATEGORY_COLORS[table.category] || {};

          return (
            <motion.div
              key={table.id}
              layout
              style={{
                borderRadius: 10, overflow: 'hidden',
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${isExpanded ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.06)'}`,
                transition: 'border-color 0.2s',
              }}
            >
              {/* Table header */}
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', cursor: 'pointer',
                }}
                onClick={() => setExpandedTable(isExpanded ? null : table.id)}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 13, color: 'rgba(240,228,200,0.85)', fontWeight: 600 }}>
                      {table.name}
                    </span>
                    <span style={{
                      fontSize: 9, padding: '1px 6px', borderRadius: 4,
                      background: catColors.bg, border: `1px solid ${catColors.border}`,
                      color: catColors.text, fontFamily: 'var(--font-heading)', letterSpacing: '0.05em',
                    }}>
                      {table.category}
                    </span>
                    <span style={{ fontSize: 10, color: 'rgba(200,175,130,0.25)' }}>
                      {table.entries.length} entries
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(200,175,130,0.35)', lineHeight: 1.4 }}>
                    {table.description}
                  </div>
                </div>

                {/* Quick roll button */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={e => { e.stopPropagation(); handleRoll(table); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
                    background: 'rgba(201,168,76,0.1)',
                    border: '1px solid rgba(201,168,76,0.25)',
                    color: 'rgba(201,168,76,0.7)',
                    fontFamily: 'var(--font-heading)', fontSize: 11, letterSpacing: '0.05em',
                    flexShrink: 0,
                  }}
                >
                  <Dices size={13} /> Roll
                </motion.button>

                {isExpanded ? (
                  <ChevronUp size={14} style={{ color: 'rgba(200,175,130,0.3)', flexShrink: 0 }} />
                ) : (
                  <ChevronDown size={14} style={{ color: 'rgba(200,175,130,0.3)', flexShrink: 0 }} />
                )}
              </div>

              {/* Latest result (always visible if exists) */}
              {tableResults.length > 0 && !isExpanded && (
                <div style={{
                  padding: '0 14px 10px',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <div style={{
                    flex: 1, padding: '8px 12px', borderRadius: 8,
                    background: 'rgba(201,168,76,0.06)',
                    border: '1px solid rgba(201,168,76,0.15)',
                    fontSize: 12, color: 'rgba(240,228,200,0.75)',
                    lineHeight: 1.5, fontFamily: 'var(--font-ui)',
                  }}>
                    {tableResults[0].text}
                  </div>
                </div>
              )}

              {/* Expanded view */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden' }}
                  >
                    {/* Results history */}
                    {tableResults.length > 0 && (
                      <div style={{ padding: '0 14px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: 10, fontFamily: 'var(--font-heading)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.4)' }}>
                            Results
                          </span>
                          <button
                            onClick={() => clearResults(table.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, color: 'rgba(200,175,130,0.25)', display: 'flex', alignItems: 'center', gap: 3 }}
                          >
                            <RotateCcw size={9} /> Clear
                          </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {tableResults.map((r, i) => (
                            <div
                              key={r.timestamp}
                              style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                padding: '6px 10px', borderRadius: 6,
                                background: i === 0 ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.02)',
                                border: `1px solid ${i === 0 ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.04)'}`,
                              }}
                            >
                              <span style={{ fontSize: 10, color: 'rgba(201,168,76,0.4)', fontFamily: 'var(--font-mono)', width: 18, textAlign: 'center', flexShrink: 0 }}>
                                {i + 1}
                              </span>
                              <span style={{ flex: 1, fontSize: 12, color: i === 0 ? 'rgba(240,228,200,0.8)' : 'rgba(200,175,130,0.5)', lineHeight: 1.4 }}>
                                {r.text}
                              </span>
                              <button
                                onClick={() => handleCopy(r.text)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(200,175,130,0.2)', padding: 2, flexShrink: 0 }}
                              >
                                <Copy size={11} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Full table entries (scrollable) */}
                    <div style={{
                      padding: '0 14px 12px',
                      borderTop: tableResults.length > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      paddingTop: tableResults.length > 0 ? 10 : 0,
                    }}>
                      <div style={{
                        maxHeight: 200, overflowY: 'auto',
                        borderRadius: 6, background: 'rgba(0,0,0,0.2)',
                        border: '1px solid rgba(255,255,255,0.04)',
                      }}>
                        {table.entries.map((entry, i) => (
                          <div
                            key={i}
                            style={{
                              display: 'flex', alignItems: 'baseline', gap: 8,
                              padding: '4px 10px',
                              borderBottom: i < table.entries.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                              fontSize: 11, color: 'rgba(200,175,130,0.45)',
                            }}
                          >
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(200,175,130,0.2)', width: 20, textAlign: 'right', flexShrink: 0 }}>
                              {i + 1}.
                            </span>
                            <span style={{ lineHeight: 1.5 }}>{entry}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {filteredTables.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'rgba(200,175,130,0.3)', fontSize: 13 }}>
            No tables match your search.
          </div>
        )}
      </div>
    </div>
  );
}
