import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, Map, BookMarked, Globe, Swords,
  ChevronDown, ChevronRight, Calculator, ClipboardList, CheckCircle,
  Hammer, Sparkles, FileText,
} from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { useSession } from '../contexts/SessionContext';
import toast from 'react-hot-toast';

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div style={{
      borderRadius: 12, padding: '18px 16px',
      background: 'rgba(11,9,20,0.8)', border: `1px solid ${color}20`,
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: 10,
        background: `${color}12`, border: `1px solid ${color}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color, fontFamily: 'var(--font-display)', lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color: 'var(--text-mute)', marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─── DM Quick Reference (active mode only) ──────────────────────────────

function DMQuickReference() {
  const [open, setOpen] = useState(false);

  const sectionHeader = { fontSize: 12, fontWeight: 700, color: '#c9a84c', marginBottom: 6, marginTop: 14, fontFamily: 'var(--font-display)' };
  const tableStyle = { width: '100%', fontSize: 11, color: 'var(--text-dim)', borderCollapse: 'collapse' };
  const cellStyle = { padding: '4px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)' };
  const labelCell = { ...cellStyle, color: 'var(--text-mute)', fontWeight: 600 };
  const valueCell = { ...cellStyle, color: 'var(--text)', fontFamily: 'var(--font-ui)' };

  return (
    <div style={{
      borderRadius: 10, marginTop: 16, overflow: 'hidden',
      background: 'rgba(11,9,20,0.6)', border: '1px solid rgba(201,168,76,0.15)',
    }}>
      <div
        onClick={() => setOpen(v => !v)}
        style={{
          padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
          userSelect: 'none', transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.05)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        {open ? <ChevronDown size={16} style={{ color: '#c9a84c' }} /> : <ChevronRight size={16} style={{ color: '#c9a84c' }} />}
        <BookMarked size={16} style={{ color: '#c9a84c' }} />
        <span style={{ fontSize: 14, fontWeight: 700, color: '#c9a84c', fontFamily: 'var(--font-display)' }}>DM Quick Reference</span>
      </div>

      {open && (
        <div style={{ padding: '0 18px 18px' }}>
          <div style={{ ...sectionHeader, marginTop: 0 }}>DC Guidelines</div>
          <table style={tableStyle}>
            <tbody>
              {[['Very Easy', '5'], ['Easy', '10'], ['Medium', '15'], ['Hard', '20'], ['Very Hard', '25'], ['Nearly Impossible', '30']].map(([label, val]) => (
                <tr key={label}><td style={labelCell}>{label}</td><td style={valueCell}>{val}</td></tr>
              ))}
            </tbody>
          </table>

          <div style={sectionHeader}>Common Damage by Level</div>
          <table style={tableStyle}>
            <tbody>
              {[['Levels 1–4', '2d6'], ['Levels 5–10', '4d6'], ['Levels 11–16', '10d6'], ['Levels 17–20', '18d6']].map(([label, val]) => (
                <tr key={label}><td style={labelCell}>{label}</td><td style={valueCell}>{val}</td></tr>
              ))}
            </tbody>
          </table>

          <div style={sectionHeader}>Cover Rules</div>
          <table style={tableStyle}>
            <tbody>
              {[
                ['Half Cover', '+2 AC / DEX saves'],
                ['Three-Quarters', '+5 AC / DEX saves'],
                ['Total Cover', "Can't be targeted directly"],
              ].map(([label, val]) => (
                <tr key={label}><td style={labelCell}>{label}</td><td style={valueCell}>{val}</td></tr>
              ))}
            </tbody>
          </table>

          <div style={sectionHeader}>Lighting</div>
          <table style={tableStyle}>
            <tbody>
              {[
                ['Bright Light', 'Normal vision'],
                ['Dim Light', 'Disadvantage on Perception'],
                ['Darkness', 'Effectively blinded'],
              ].map(([label, val]) => (
                <tr key={label}><td style={labelCell}>{label}</td><td style={valueCell}>{val}</td></tr>
              ))}
            </tbody>
          </table>

          <div style={sectionHeader}>Travel Pace</div>
          <table style={tableStyle}>
            <tbody>
              {[
                ['Fast', '4 mph — -5 passive Perception'],
                ['Normal', '3 mph'],
                ['Slow', '2 mph — can use Stealth'],
              ].map(([label, val]) => (
                <tr key={label}><td style={labelCell}>{label}</td><td style={valueCell}>{val}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Encounter Difficulty Calculator ──────────────────────────────────────

const XP_THRESHOLDS = {
  1:  { easy: 25,   medium: 50,   hard: 75,    deadly: 100 },
  2:  { easy: 50,   medium: 100,  hard: 150,   deadly: 200 },
  3:  { easy: 75,   medium: 150,  hard: 225,   deadly: 400 },
  4:  { easy: 125,  medium: 250,  hard: 375,   deadly: 500 },
  5:  { easy: 250,  medium: 500,  hard: 750,   deadly: 1100 },
  6:  { easy: 300,  medium: 600,  hard: 900,   deadly: 1400 },
  7:  { easy: 350,  medium: 750,  hard: 1100,  deadly: 1700 },
  8:  { easy: 450,  medium: 900,  hard: 1400,  deadly: 2100 },
  9:  { easy: 550,  medium: 1100, hard: 1600,  deadly: 2400 },
  10: { easy: 600,  medium: 1200, hard: 1900,  deadly: 2800 },
  11: { easy: 800,  medium: 1600, hard: 2400,  deadly: 3600 },
  12: { easy: 1000, medium: 2000, hard: 3000,  deadly: 4500 },
  13: { easy: 1100, medium: 2200, hard: 3400,  deadly: 5100 },
  14: { easy: 1250, medium: 2500, hard: 3800,  deadly: 5700 },
  15: { easy: 1400, medium: 2800, hard: 4300,  deadly: 6400 },
  16: { easy: 1600, medium: 3200, hard: 4800,  deadly: 7200 },
  17: { easy: 2000, medium: 3900, hard: 5900,  deadly: 8800 },
  18: { easy: 2100, medium: 4200, hard: 6300,  deadly: 9500 },
  19: { easy: 2400, medium: 4900, hard: 7300,  deadly: 10900 },
  20: { easy: 2800, medium: 5700, hard: 8500,  deadly: 12700 },
};

const DAILY_XP_BUDGET = {
  1: 300, 2: 600, 3: 1200, 4: 1700, 5: 3500, 6: 4000, 7: 5000, 8: 6000,
  9: 7500, 10: 9000, 11: 10500, 12: 11500, 13: 13500, 14: 15000, 15: 18000,
  16: 20000, 17: 25000, 18: 27000, 19: 30000, 20: 40000,
};

function EncounterDifficultyCalculator() {
  const [partySize, setPartySize] = useState(4);
  const [avgLevel, setAvgLevel] = useState(3);

  const clampedLevel = Math.max(1, Math.min(20, avgLevel));
  const thresholds = XP_THRESHOLDS[clampedLevel] || XP_THRESHOLDS[1];
  const daily = DAILY_XP_BUDGET[clampedLevel] || DAILY_XP_BUDGET[1];

  const inputStyle = {
    width: 60, padding: '6px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.3)', color: 'var(--text)', fontSize: 13, textAlign: 'center',
    fontFamily: 'var(--font-ui)',
  };

  const diffColors = { Easy: '#4ade80', Medium: '#fbbf24', Hard: '#f97316', Deadly: '#ef4444' };

  return (
    <div style={{
      borderRadius: 10, padding: '16px 18px', marginTop: 16,
      background: 'rgba(11,9,20,0.6)', border: '1px solid rgba(201,168,76,0.15)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <Calculator size={16} style={{ color: '#c9a84c' }} />
        <span style={{ fontSize: 14, fontWeight: 700, color: '#c9a84c', fontFamily: 'var(--font-display)' }}>Encounter Difficulty Calculator</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-dim)' }}>
          Party Size
          <input type="number" min={1} max={10} value={partySize} onChange={e => setPartySize(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))} style={inputStyle} />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-dim)' }}>
          Avg Level
          <input type="number" min={1} max={20} value={avgLevel} onChange={e => setAvgLevel(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))} style={inputStyle} />
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
        {Object.entries(diffColors).map(([label, color]) => {
          const key = label.toLowerCase();
          const xp = thresholds[key] * partySize;
          return (
            <div key={label} style={{
              borderRadius: 8, padding: '10px 8px', textAlign: 'center',
              background: `${color}08`, border: `1px solid ${color}25`,
            }}>
              <div style={{ fontSize: 10, color: `${color}aa`, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color, fontFamily: 'var(--font-display)' }}>{xp.toLocaleString()}</div>
              <div style={{ fontSize: 10, color: 'var(--text-mute)' }}>XP</div>
            </div>
          );
        })}
      </div>

      <div style={{
        borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.15)',
      }}>
        <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>Daily XP Budget (adventuring day)</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#60a5fa', fontFamily: 'var(--font-display)' }}>
          {(daily * partySize).toLocaleString()} XP
        </span>
      </div>
    </div>
  );
}

// ─── Session Planning Checklist (active mode only) ────────────────────────

const SESSION_CHECKLIST_ITEMS = [
  'Review last session notes',
  'Prepare NPCs',
  'Plan encounters',
  'Prepare maps / handouts',
  'Review player backstories',
  'Set session goals',
];

function SessionPlanningChecklist() {
  const [checked, setChecked] = useState(() => {
    try {
      const stored = sessionStorage.getItem('session-planning-checklist');
      return stored ? JSON.parse(stored) : {};
    } catch { return {}; }
  });

  const toggle = (item) => {
    setChecked(prev => {
      const next = { ...prev, [item]: !prev[item] };
      try { sessionStorage.setItem('session-planning-checklist', JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  const resetAll = () => {
    setChecked({});
    try { sessionStorage.removeItem('session-planning-checklist'); } catch { /* ignore */ }
  };

  const completedCount = SESSION_CHECKLIST_ITEMS.filter(i => checked[i]).length;

  return (
    <div style={{
      borderRadius: 10, padding: '16px 18px', marginTop: 16,
      background: 'rgba(11,9,20,0.6)', border: '1px solid rgba(201,168,76,0.15)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ClipboardList size={16} style={{ color: '#c9a84c' }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#c9a84c', fontFamily: 'var(--font-display)' }}>Session Planning Checklist</span>
          <span style={{ fontSize: 10, color: 'var(--text-mute)', marginLeft: 4 }}>{completedCount}/{SESSION_CHECKLIST_ITEMS.length}</span>
        </div>
        {completedCount > 0 && (
          <button
            onClick={resetAll}
            style={{
              fontSize: 10, color: 'var(--text-mute)', cursor: 'pointer', background: 'none', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 4, padding: '3px 8px', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-mute)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
          >
            Reset
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {SESSION_CHECKLIST_ITEMS.map(item => (
          <label
            key={item}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 6, cursor: 'pointer',
              background: checked[item] ? 'rgba(74,222,128,0.04)' : 'transparent',
              border: `1px solid ${checked[item] ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.03)'}`,
              transition: 'all 0.15s',
            }}
          >
            <input
              type="checkbox"
              checked={!!checked[item]}
              onChange={() => toggle(item)}
              style={{ accentColor: '#c9a84c', width: 14, height: 14, cursor: 'pointer' }}
            />
            <span style={{
              fontSize: 12, color: checked[item] ? 'var(--text-mute)' : 'var(--text-dim)',
              textDecoration: checked[item] ? 'line-through' : 'none',
              transition: 'all 0.15s',
            }}>
              {item}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

// ─── Builder Workflow Card ────────────────────────────────────────────────

function BuilderWorkflowCard({ step, icon: Icon, title, desc, color, count }) {
  return (
    <div style={{
      borderRadius: 10, padding: '14px 16px',
      background: 'rgba(11,9,20,0.8)', border: `1px solid ${color}18`,
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: `${color}10`, border: `1px solid ${color}20`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, position: 'relative',
      }}>
        <Icon size={16} style={{ color }} />
        <div style={{
          position: 'absolute', top: -6, left: -6,
          width: 18, height: 18, borderRadius: 99,
          background: count > 0 ? color : 'rgba(255,255,255,0.06)',
          border: `1px solid ${count > 0 ? color : 'rgba(255,255,255,0.1)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9, fontWeight: 700, color: count > 0 ? '#fff' : 'var(--text-mute)',
          fontFamily: 'var(--font-mono)',
        }}>
          {step}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 11, color: 'var(--text-mute)', lineHeight: 1.4 }}>{desc}</div>
      </div>
      {count > 0 && (
        <div style={{
          padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700,
          background: `${color}15`, color, fontFamily: 'var(--font-mono)',
        }}>
          {count}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────

export default function CampaignHub({ characterId, character, onNavigate }) {
  const { campaignStatus, dispatch } = useSession();
  const isDraft = campaignStatus === 'draft';
  const [stats, setStats] = useState({ npcs: 0, quests: 0, sessions: 0, lore: 0, encounters: 0 });
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await invoke('archive_campaign', { campaignId: characterId, archived: false });
      dispatch({ type: 'SET_CAMPAIGN', payload: { id: characterId, name: character?.name || 'Campaign', campaign_type: 'homebrew', status: 'active' } });
      toast.success('Campaign published! You can now run live sessions.');
    } catch (err) {
      toast.error(`Failed: ${err.message || err}`);
    }
    setPublishing(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const [npcs, quests, journal, lore] = await Promise.all([
          invoke('get_npcs', { characterId }),
          invoke('get_quests', { characterId }),
          invoke('get_journal_entries', { characterId }),
          invoke('get_lore_notes', { characterId }),
        ]);
        setStats({
          npcs: Array.isArray(npcs) ? npcs.length : 0,
          quests: Array.isArray(quests) ? quests.length : 0,
          activeQuests: Array.isArray(quests) ? quests.filter(q => q.status === 'active' || q.status === 'Active').length : 0,
          sessions: Array.isArray(journal) ? journal.length : 0,
          lore: Array.isArray(lore) ? lore.length : 0,
        });
      } catch { /* ignore errors */ }
      setLoading(false);
    })();
  }, [characterId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-mute)', fontSize: 13 }}>
        Loading campaign data...
      </div>
    );
  }

  // ── DRAFT / BUILDER VIEW ────────────────────────────────────────────────
  if (isDraft) {
    const checks = [
      { label: 'At least 1 NPC created', done: stats.npcs >= 1, tip: 'Go to NPCs' },
      { label: 'At least 1 Quest created', done: stats.quests >= 1, tip: 'Go to Quests & Plot' },
      { label: 'At least 1 Lore entry', done: stats.lore >= 1, tip: 'Go to Lore & Locations' },
    ];
    const ready = checks.every(c => c.done);
    const completed = checks.filter(c => c.done).length;

    return (
      <div style={{ maxWidth: 700 }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Hammer size={20} style={{ color: '#4ade80' }} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--text)', fontWeight: 700 }}>
              Campaign Builder
            </h2>
            <span style={{
              fontSize: 9, padding: '3px 10px', borderRadius: 99,
              background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)',
              color: '#4ade80', fontFamily: 'var(--font-heading)', letterSpacing: '0.1em',
              textTransform: 'uppercase', fontWeight: 700,
            }}>
              Building
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
            <p style={{ fontSize: 13, color: 'var(--text-mute)', margin: 0 }}>
              {character?.name || 'Untitled Campaign'} — Build your world, then publish when ready.
            </p>
            {onNavigate && (
              <button
                onClick={() => onNavigate('dm-guide')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 12px', borderRadius: 8, border: '1px solid rgba(74,222,128,0.2)',
                  background: 'rgba(74,222,128,0.06)', color: '#4ade80',
                  fontSize: 11, fontFamily: 'var(--font-heading)', letterSpacing: '0.04em',
                  cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(74,222,128,0.12)'; e.currentTarget.style.borderColor = 'rgba(74,222,128,0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(74,222,128,0.06)'; e.currentTarget.style.borderColor = 'rgba(74,222,128,0.2)'; }}
              >
                <FileText size={12} />
                Tutorial
              </button>
            )}
          </div>
        </div>

        {/* Publish banner with readiness */}
        <div style={{
          marginBottom: 24, padding: '18px 20px', borderRadius: 12,
          background: ready ? 'rgba(74,222,128,0.06)' : 'rgba(255,255,255,0.02)',
          border: `1px solid ${ready ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.06)'}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: ready ? '#4ade80' : 'var(--text-dim)', fontWeight: 700, marginBottom: 4 }}>
                {ready ? 'Ready to Publish!' : 'Campaign Readiness'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.5 }}>
                {ready
                  ? 'Your campaign meets the minimum requirements. Publish to unlock session tools.'
                  : 'Complete the checklist below to unlock publishing.'}
              </div>
            </div>
            <button
              onClick={handlePublish}
              disabled={publishing || !ready}
              title={ready ? 'Publish your campaign' : `Complete ${checks.length - completed} more item${checks.length - completed > 1 ? 's' : ''} first`}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 20px', borderRadius: 10, border: 'none',
                background: ready ? 'linear-gradient(135deg, #16a34a, #4ade80)' : 'rgba(255,255,255,0.06)',
                color: ready ? '#fff' : 'var(--text-mute)', fontFamily: 'var(--font-heading)', fontSize: 12,
                fontWeight: 700, letterSpacing: '0.06em',
                cursor: publishing || !ready ? 'not-allowed' : 'pointer',
                opacity: publishing ? 0.6 : 1, whiteSpace: 'nowrap', flexShrink: 0,
              }}
            >
              <CheckCircle size={14} /> {publishing ? 'Publishing...' : 'Publish Campaign'}
            </button>
          </div>

          <div style={{
            padding: '12px 14px', borderRadius: 8,
            background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.04)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', marginBottom: 8, fontFamily: 'var(--font-ui)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Checklist — {completed}/{checks.length}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {checks.map(c => (
                <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle size={14} style={{ color: c.done ? '#4ade80' : 'rgba(255,255,255,0.12)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: c.done ? 'var(--text-dim)' : 'var(--text-mute)', textDecoration: c.done ? 'line-through' : 'none' }}>
                    {c.label}
                  </span>
                  {!c.done && <span style={{ fontSize: 10, color: 'var(--text-mute)', marginLeft: 'auto' }}>{c.tip}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Builder progress stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 28 }}>
          <StatCard icon={Users} label="NPCs Created" value={stats.npcs} color="#4ade80" sub="Characters in your world" />
          <StatCard icon={Map} label="Quests Designed" value={stats.quests} color="#fbbf24" sub="Plot threads & objectives" />
          <StatCard icon={Globe} label="Lore Entries" value={stats.lore} color="#c084fc" sub="World knowledge" />
        </div>

        {/* Builder Workflow — step by step */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 12, fontFamily: 'var(--font-ui)', fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
            Building Workflow
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <BuilderWorkflowCard
              step={1} icon={Users} title="Create NPCs"
              desc="Add the characters that populate your world — allies, enemies, quest givers, and merchants."
              color="#4ade80" count={stats.npcs}
            />
            <BuilderWorkflowCard
              step={2} icon={Map} title="Design Quests"
              desc="Create quest lines with objectives, rewards, and difficulty. Link them to NPCs."
              color="#fbbf24" count={stats.quests}
            />
            <BuilderWorkflowCard
              step={3} icon={Globe} title="Write Lore & Locations"
              desc="Build your world knowledge — locations, history, factions, religions, and legends."
              color="#c084fc" count={stats.lore}
            />
            <BuilderWorkflowCard
              step={4} icon={Swords} title="Plan Encounters"
              desc="Design combat encounters using the SRD monster database. Balance difficulty for your expected party."
              color="#ef4444" count={0}
            />
            <BuilderWorkflowCard
              step={5} icon={Hammer} title="Homebrew Content"
              desc="Create custom monsters, spells, and magic items with full stat blocks and balance checking."
              color="#f59e0b" count={0}
            />
            <BuilderWorkflowCard
              step={6} icon={Sparkles} title="AI Generation"
              desc="Use AI modules to generate scene descriptions, NPC dialogue, story hooks, and lore."
              color="#8b5cf6" count={0}
            />
          </div>
        </div>

        {/* Builder Tips */}
        <div style={{
          borderRadius: 10, padding: '16px 18px',
          background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.12)',
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#4ade80', marginBottom: 8 }}>Builder Tips</div>
          <ul style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.8, margin: 0, paddingLeft: 16 }}>
            <li>Start with <strong style={{ color: 'var(--text)' }}>NPCs</strong> — they're the heart of every campaign</li>
            <li>Create <strong style={{ color: 'var(--text)' }}>Quests</strong> that connect to your NPCs for a living world</li>
            <li>Use <strong style={{ color: 'var(--text)' }}>Lore</strong> to document locations, factions, and history your players can discover</li>
            <li>The <strong style={{ color: 'var(--text)' }}>Encounter Builder</strong> helps you balance fights for your expected party size and level</li>
            <li>Use <strong style={{ color: 'var(--text)' }}>AI Modules</strong> to quickly generate descriptions, dialogue, and hooks</li>
            <li>You can always add more content after publishing — building never stops!</li>
          </ul>
        </div>

        {/* Encounter Difficulty Calculator — useful during building */}
        <EncounterDifficultyCalculator />
      </div>
    );
  }

  // ── ACTIVE / DM SESSION VIEW ────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 700 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <LayoutDashboard size={20} style={{ color: '#c084fc' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--text)', fontWeight: 700 }}>
            Campaign Hub
          </h2>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-mute)' }}>
          Overview of your campaign — {character?.name || 'Untitled Campaign'}
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 28 }}>
        <StatCard icon={BookMarked} label="Session Notes" value={stats.sessions} color="#60a5fa" sub="Journal entries" />
        <StatCard icon={Users} label="NPCs Created" value={stats.npcs} color="#4ade80" sub="Characters in your world" />
        <StatCard icon={Map} label="Active Quests" value={stats.activeQuests || 0} color="#fbbf24" sub={`${stats.quests} total`} />
        <StatCard icon={Globe} label="Lore Entries" value={stats.lore} color="#c084fc" sub="World knowledge" />
      </div>

      {/* Quick actions — DM session focused */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 12, fontFamily: 'var(--font-ui)', fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
          Quick Start
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
          {[
            { label: 'Write Session Notes', desc: 'Document what happened', icon: BookMarked, section: 'journal' },
            { label: 'Add an NPC', desc: 'Create a new character', icon: Users, section: 'npcs' },
            { label: 'Create a Quest', desc: 'Start a plot thread', icon: Map, section: 'quests' },
            { label: 'Run an Encounter', desc: 'Start combat tracking', icon: Swords, section: 'encounter' },
          ].map(action => (
            <div
              key={action.label}
              style={{
                borderRadius: 10, padding: '14px 14px', cursor: 'pointer',
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(155,89,182,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <action.icon size={14} style={{ color: '#c084fc' }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{action.label}</span>
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-mute)', margin: 0 }}>{action.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* DM Tips */}
      <div style={{
        borderRadius: 10, padding: '16px 18px',
        background: 'rgba(155,89,182,0.05)', border: '1px solid rgba(155,89,182,0.15)',
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#c084fc', marginBottom: 8 }}>DM Tips</div>
        <ul style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.8, margin: 0, paddingLeft: 16 }}>
          <li>Use <strong style={{ color: 'var(--text)' }}>Session Notes</strong> to document each session as you play</li>
          <li>Add NPCs with descriptions, motivations, and secrets only you can see</li>
          <li>Track plot threads as Quests — mark them active, completed, or failed</li>
          <li>Use <strong style={{ color: 'var(--text)' }}>Party Overview</strong> to host a session and see your players' HP live</li>
          <li>The <strong style={{ color: 'var(--text)' }}>Encounter Runner</strong> tracks initiative, HP, and conditions for combat</li>
        </ul>
      </div>

      {/* Session Planning Checklist */}
      <SessionPlanningChecklist />

      {/* Encounter Difficulty Calculator */}
      <EncounterDifficultyCalculator />

      {/* DM Quick Reference */}
      <DMQuickReference />
    </div>
  );
}
