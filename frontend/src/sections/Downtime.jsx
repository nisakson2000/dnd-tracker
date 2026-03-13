import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Hammer, GraduationCap, Search, Store, Heart, Skull, Swords, Dice6, Church,
  Plus, Clock, ChevronDown, ChevronUp, Trash2, CheckCircle, X, Play, Pause,
  AlertTriangle, Award, Archive, Edit3, Save, RotateCcw, Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// ─── Activity Type Definitions ──────────────────────────────────────────────

const ACTIVITY_TYPES = {
  crafting: {
    label: 'Crafting',
    icon: Hammer,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.10)',
    border: 'rgba(245,158,11,0.30)',
    glow: 'rgba(245,158,11,0.15)',
    defaultDays: 5,
    defaultGoldPerDay: 5,
    description: 'Create items, brew potions, scribe scrolls.',
    fields: [
      { key: 'itemName', label: 'Item Being Crafted', type: 'text', placeholder: 'e.g. Potion of Healing' },
      { key: 'materialsNeeded', label: 'Materials Needed', type: 'text', placeholder: 'e.g. Herbs, vial, 25gp ingredients' },
      { key: 'skillCheck', label: 'Skill Check Required', type: 'select', options: ['None', 'Arcana', 'Medicine', 'Nature', 'Herbalism Kit', "Alchemist's Supplies", "Smith's Tools", "Tinker's Tools", "Jeweler's Tools", "Brewer's Supplies", "Calligrapher's Supplies"] },
    ],
    reward: 'Item created — add to inventory!',
  },
  training: {
    label: 'Training',
    icon: GraduationCap,
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.10)',
    border: 'rgba(59,130,246,0.30)',
    glow: 'rgba(59,130,246,0.15)',
    defaultDays: 250,
    defaultGoldPerDay: 1,
    description: 'Learn a new skill, tool proficiency, or language.',
    fields: [
      { key: 'proficiencyType', label: 'Proficiency Type', type: 'select', options: ['Language', 'Tool Proficiency', 'Skill Proficiency', 'Weapon Proficiency', 'Armor Proficiency'] },
      { key: 'proficiencyName', label: 'Proficiency Name', type: 'text', placeholder: 'e.g. Elvish, Thieves\' Tools' },
      { key: 'trainerNPC', label: 'Trainer NPC', type: 'text', placeholder: 'e.g. Master Elara the Sage' },
    ],
    reward: 'New proficiency gained!',
  },
  research: {
    label: 'Research',
    icon: Search,
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.10)',
    border: 'rgba(168,85,247,0.30)',
    glow: 'rgba(168,85,247,0.15)',
    defaultDays: 7,
    defaultGoldPerDay: 2,
    description: 'Investigate lore, identify items, uncover secrets.',
    fields: [
      { key: 'subject', label: 'Research Subject', type: 'text', placeholder: 'e.g. The Curse of Strahd' },
      { key: 'resource', label: 'Library / Sage Resource', type: 'text', placeholder: 'e.g. Candlekeep, Sage Mistra' },
      { key: 'skillCheck', label: 'Skill Check', type: 'select', options: ['None', 'Arcana', 'History', 'Investigation', 'Nature', 'Religion'] },
      { key: 'discoveries', label: 'Discoveries', type: 'textarea', placeholder: 'Record findings here...' },
    ],
    reward: 'Lore entry revealed!',
  },
  business: {
    label: 'Running a Business',
    icon: Store,
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.10)',
    border: 'rgba(34,197,94,0.30)',
    glow: 'rgba(34,197,94,0.15)',
    defaultDays: 30,
    defaultGoldPerDay: 0,
    description: 'Manage a tavern, shop, or other enterprise.',
    fields: [
      { key: 'businessName', label: 'Business Name', type: 'text', placeholder: 'e.g. The Rusty Dragon Inn' },
      { key: 'businessType', label: 'Business Type', type: 'select', options: ['Tavern/Inn', 'Shop', 'Trading Post', 'Smithy', 'Apothecary', 'Stable', 'Theater', 'Other'] },
      { key: 'dailyExpenses', label: 'Daily Expenses (gp)', type: 'number', placeholder: '5' },
      { key: 'incomeRoll', label: 'Income Roll Result (d100)', type: 'number', placeholder: '' },
      { key: 'events', label: 'Business Events', type: 'textarea', placeholder: 'Notable events...' },
    ],
    reward: 'Income summary calculated!',
  },
  recuperating: {
    label: 'Recuperating',
    icon: Heart,
    color: '#10b981',
    bg: 'rgba(16,185,129,0.10)',
    border: 'rgba(16,185,129,0.30)',
    glow: 'rgba(16,185,129,0.15)',
    defaultDays: 3,
    defaultGoldPerDay: 0,
    description: 'Recover from lingering injury, disease, or poison.',
    fields: [
      { key: 'condition', label: 'Condition Recovering From', type: 'text', placeholder: 'e.g. Sewer Plague, Broken Arm' },
      { key: 'conSaveDC', label: 'Constitution Save DC', type: 'number', placeholder: '15' },
      { key: 'conSaveResult', label: 'Con Save Result', type: 'number', placeholder: '' },
    ],
    reward: 'Recovery complete — condition removed!',
  },
  crime: {
    label: 'Crime',
    icon: Skull,
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.10)',
    border: 'rgba(239,68,68,0.30)',
    glow: 'rgba(239,68,68,0.15)',
    defaultDays: 7,
    defaultGoldPerDay: 0,
    description: 'Burglary, pickpocketing, heists, and other illicit activities.',
    fields: [
      { key: 'crimeType', label: 'Crime Type', type: 'select', options: ['Burglary', 'Pickpocketing', 'Heist', 'Forgery', 'Smuggling', 'Fencing Goods', 'Other'] },
      { key: 'riskLevel', label: 'Risk Level', type: 'select', options: ['Low', 'Medium', 'High', 'Extreme'] },
      { key: 'skillCheck', label: 'Skill Check', type: 'select', options: ['Stealth', 'Sleight of Hand', 'Deception', 'Thieves\' Tools', 'Investigation'] },
      { key: 'payout', label: 'Potential Payout (gp)', type: 'number', placeholder: '50' },
    ],
    reward: 'Payout received... or consequences!',
  },
  'pit-fighting': {
    label: 'Pit Fighting',
    icon: Swords,
    color: '#f97316',
    bg: 'rgba(249,115,22,0.10)',
    border: 'rgba(249,115,22,0.30)',
    glow: 'rgba(249,115,22,0.15)',
    defaultDays: 1,
    defaultGoldPerDay: 0,
    description: 'Compete in prize fights for gold and glory.',
    fields: [
      { key: 'skillCheck', label: 'Primary Check', type: 'select', options: ['Athletics', 'Acrobatics', 'Intimidation'] },
      { key: 'wager', label: 'Wager (gp)', type: 'number', placeholder: '10' },
      { key: 'wins', label: 'Wins', type: 'number', placeholder: '0' },
      { key: 'losses', label: 'Losses', type: 'number', placeholder: '0' },
    ],
    reward: 'Fight concluded — collect winnings!',
  },
  gambling: {
    label: 'Gambling',
    icon: Dice6,
    color: '#eab308',
    bg: 'rgba(234,179,8,0.10)',
    border: 'rgba(234,179,8,0.30)',
    glow: 'rgba(234,179,8,0.15)',
    defaultDays: 1,
    defaultGoldPerDay: 0,
    description: 'Games of chance — risk gold for bigger rewards.',
    fields: [
      { key: 'wager', label: 'Wager (gp)', type: 'number', placeholder: '10' },
      { key: 'skillCheck', label: 'Check Used', type: 'select', options: ['Insight', 'Deception', 'Intimidation'] },
      { key: 'checkResult', label: 'Check Result', type: 'number', placeholder: '' },
      { key: 'netProfit', label: 'Net Profit/Loss (gp)', type: 'number', placeholder: '0' },
    ],
    reward: 'Gambling session complete!',
  },
  religious: {
    label: 'Religious Service',
    icon: Church,
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.10)',
    border: 'rgba(6,182,212,0.30)',
    glow: 'rgba(6,182,212,0.15)',
    defaultDays: 10,
    defaultGoldPerDay: 0,
    description: 'Serve at a temple, earn favors and faction reputation.',
    fields: [
      { key: 'deity', label: 'Deity / Temple', type: 'text', placeholder: 'e.g. Temple of Lathander' },
      { key: 'favorsEarned', label: 'Favors Earned', type: 'number', placeholder: '0' },
      { key: 'factionRep', label: 'Faction Reputation Change', type: 'select', options: ['None', '+1 Minor Favor', '+2 Moderate Favor', '+3 Major Favor'] },
    ],
    reward: 'Service complete — favors earned!',
  },
  custom: {
    label: 'Custom Activity',
    icon: Sparkles,
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.10)',
    border: 'rgba(139,92,246,0.30)',
    glow: 'rgba(139,92,246,0.15)',
    defaultDays: 1,
    defaultGoldPerDay: 0,
    description: 'User-defined activity with custom fields.',
    fields: [
      { key: 'customField1', label: 'Custom Field 1', type: 'text', placeholder: '' },
      { key: 'customField2', label: 'Custom Field 2', type: 'text', placeholder: '' },
      { key: 'customField3', label: 'Custom Field 3', type: 'textarea', placeholder: '' },
    ],
    reward: 'Activity complete!',
  },
};

const STATUS_CONFIG = {
  active:    { label: 'Active',    color: '#4ade80', bg: 'rgba(74,222,128,0.10)', border: 'rgba(74,222,128,0.25)' },
  completed: { label: 'Completed', color: '#3b82f6', bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.25)' },
  abandoned: { label: 'Abandoned', color: '#6b7280', bg: 'rgba(107,114,128,0.10)', border: 'rgba(107,114,128,0.25)' },
};

const RISK_COLORS = {
  Low: '#4ade80',
  Medium: '#eab308',
  High: '#f97316',
  Extreme: '#ef4444',
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function uuid() {
  return crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function storageKey(charId) {
  return `codex_downtime_${charId}`;
}

function loadActivities(charId) {
  try {
    const raw = localStorage.getItem(storageKey(charId));
    return raw ? JSON.parse(raw).activities || [] : [];
  } catch { return []; }
}

function saveActivities(charId, activities) {
  localStorage.setItem(storageKey(charId), JSON.stringify({ activities }));
}

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Activity Card ──────────────────────────────────────────────────────────

function ActivityCard({ activity, onUpdate, onDelete, onComplete, onAbandon }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const typeMeta = ACTIVITY_TYPES[activity.type] || ACTIVITY_TYPES.custom;
  const Icon = typeMeta.icon;
  const statusMeta = STATUS_CONFIG[activity.status];
  const progress = activity.daysRequired > 0
    ? Math.min(100, Math.round((activity.daysCompleted / activity.daysRequired) * 100))
    : 0;

  const startEdit = () => {
    setEditData({ notes: activity.notes || '', ...activity.customData });
    setEditing(true);
  };

  const saveEdit = () => {
    const { notes, ...rest } = editData;
    onUpdate(activity.id, { notes, customData: { ...activity.customData, ...rest } });
    setEditing(false);
    toast.success('Activity updated');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid rgba(255,255,255,0.06)`,
        borderLeft: `3px solid ${typeMeta.color}`,
        borderRadius: 10,
        marginBottom: 10,
        overflow: 'hidden',
      }}
    >
      {/* Card header */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text)', fontFamily: 'var(--font-ui)', textAlign: 'left',
        }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: typeMeta.bg, border: `1px solid ${typeMeta.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={18} style={{ color: typeMeta.color }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>
              {activity.name}
            </span>
            <span style={{
              fontSize: 9, fontWeight: 600, padding: '1px 7px', borderRadius: 4,
              background: statusMeta.bg, color: statusMeta.color, border: `1px solid ${statusMeta.border}`,
              fontFamily: 'var(--font-ui)', letterSpacing: '0.03em',
            }}>
              {statusMeta.label}
            </span>
          </div>

          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2, fontFamily: 'var(--font-ui)' }}>
            {typeMeta.label} · {activity.daysCompleted}/{activity.daysRequired} days
            {activity.goldCost > 0 && ` · ${activity.goldSpent}/${activity.goldCost} gp`}
          </div>

          {/* Progress bar */}
          {activity.status === 'active' && (
            <div style={{
              marginTop: 6, height: 5, borderRadius: 3,
              background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{
                  height: '100%', borderRadius: 3,
                  background: `linear-gradient(90deg, ${typeMeta.color}88, ${typeMeta.color})`,
                }}
              />
            </div>
          )}
        </div>

        <span style={{ fontSize: 11, color: typeMeta.color, fontWeight: 700, fontFamily: 'var(--font-ui)', marginRight: 4 }}>
          {progress}%
        </span>
        {expanded ? <ChevronUp size={14} style={{ color: 'var(--text-mute)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-mute)' }} />}
      </button>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              {/* Type-specific fields */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10, marginTop: 12 }}>
                {typeMeta.fields.map(field => {
                  const val = activity.customData?.[field.key] || '';
                  return (
                    <div key={field.key}>
                      <div style={{ fontSize: 10, color: 'var(--text-mute)', marginBottom: 3, fontFamily: 'var(--font-ui)', fontWeight: 500 }}>
                        {field.label}
                      </div>
                      {editing ? (
                        field.type === 'textarea' ? (
                          <textarea
                            value={editData[field.key] || ''}
                            onChange={e => setEditData(p => ({ ...p, [field.key]: e.target.value }))}
                            rows={2}
                            style={inputStyle}
                          />
                        ) : field.type === 'select' ? (
                          <select
                            value={editData[field.key] || ''}
                            onChange={e => setEditData(p => ({ ...p, [field.key]: e.target.value }))}
                            style={inputStyle}
                          >
                            <option value="">—</option>
                            {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            value={editData[field.key] || ''}
                            onChange={e => setEditData(p => ({ ...p, [field.key]: e.target.value }))}
                            style={inputStyle}
                          />
                        )
                      ) : (
                        <div style={{ fontSize: 12, color: val ? 'var(--text)' : 'var(--text-mute)', fontFamily: 'var(--font-ui)' }}>
                          {val || '—'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Notes */}
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 10, color: 'var(--text-mute)', marginBottom: 3, fontFamily: 'var(--font-ui)', fontWeight: 500 }}>Notes</div>
                {editing ? (
                  <textarea
                    value={editData.notes || ''}
                    onChange={e => setEditData(p => ({ ...p, notes: e.target.value }))}
                    rows={3}
                    placeholder="Session notes, DM rulings, etc."
                    style={{ ...inputStyle, width: '100%' }}
                  />
                ) : (
                  <div style={{ fontSize: 12, color: activity.notes ? 'var(--text)' : 'var(--text-mute)', fontFamily: 'var(--font-ui)', whiteSpace: 'pre-wrap' }}>
                    {activity.notes || 'No notes yet.'}
                  </div>
                )}
              </div>

              {/* Checks log */}
              {activity.checks && activity.checks.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-mute)', marginBottom: 4, fontFamily: 'var(--font-ui)', fontWeight: 500 }}>Skill Checks</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {activity.checks.map((c, i) => (
                      <div key={i} style={{
                        fontSize: 11, fontFamily: 'var(--font-ui)', color: 'var(--text-dim)',
                        padding: '3px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.03)',
                      }}>
                        <span style={{ color: c.success ? '#4ade80' : '#ef4444', fontWeight: 600 }}>
                          {c.success ? '✓' : '✗'}
                        </span> Day {c.day}: {c.type} — rolled {c.result}
                        {c.dc && ` (DC ${c.dc})`}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Date info */}
              <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 10, color: 'var(--text-mute)', fontFamily: 'var(--font-ui)' }}>
                <span>Started: {formatDate(activity.startDate)}</span>
                {activity.completedDate && <span>Completed: {formatDate(activity.completedDate)}</span>}
              </div>

              {/* Risk level for crime */}
              {activity.type === 'crime' && activity.customData?.riskLevel && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertTriangle size={12} style={{ color: RISK_COLORS[activity.customData.riskLevel] || '#eab308' }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: RISK_COLORS[activity.customData.riskLevel] || '#eab308', fontFamily: 'var(--font-ui)' }}>
                    {activity.customData.riskLevel} Risk
                  </span>
                </div>
              )}

              {/* Reward display for completed */}
              {activity.status === 'completed' && (
                <div style={{
                  marginTop: 12, padding: '10px 12px', borderRadius: 8,
                  background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <Award size={16} style={{ color: '#4ade80', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#4ade80', fontFamily: 'var(--font-display)' }}>Completed!</div>
                    <div style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-ui)' }}>
                      {activity.reward || typeMeta.reward}
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              {activity.status === 'active' && (
                <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                  {editing ? (
                    <>
                      <ActionBtn icon={Save} label="Save" color="#4ade80" onClick={saveEdit} />
                      <ActionBtn icon={X} label="Cancel" color="#6b7280" onClick={() => setEditing(false)} />
                    </>
                  ) : (
                    <>
                      <ActionBtn icon={Edit3} label="Edit" color="#60a5fa" onClick={startEdit} />
                      <ActionBtn icon={CheckCircle} label="Complete" color="#4ade80" onClick={() => onComplete(activity.id)} />
                      <ActionBtn icon={Pause} label="Abandon" color="#6b7280" onClick={() => onAbandon(activity.id)} />
                      <ActionBtn icon={Trash2} label="Delete" color="#ef4444" onClick={() => onDelete(activity.id)} />
                    </>
                  )}
                </div>
              )}
              {activity.status !== 'active' && (
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <ActionBtn icon={RotateCcw} label="Reactivate" color="#60a5fa" onClick={() => onUpdate(activity.id, { status: 'active', completedDate: null })} />
                  <ActionBtn icon={Trash2} label="Delete" color="#ef4444" onClick={() => onDelete(activity.id)} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ActionBtn({ icon: Icon, label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px',
        borderRadius: 6, border: `1px solid ${color}33`, background: `${color}11`,
        color, fontSize: 11, fontFamily: 'var(--font-ui)', fontWeight: 500, cursor: 'pointer',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = `${color}22`; e.currentTarget.style.borderColor = `${color}55`; }}
      onMouseLeave={e => { e.currentTarget.style.background = `${color}11`; e.currentTarget.style.borderColor = `${color}33`; }}
    >
      <Icon size={12} /> {label}
    </button>
  );
}

const inputStyle = {
  width: '100%', padding: '5px 8px', borderRadius: 5,
  border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)',
  color: 'var(--text)', fontSize: 12, fontFamily: 'var(--font-ui)', outline: 'none',
  resize: 'vertical',
};

// ─── New Activity Form ──────────────────────────────────────────────────────

function NewActivityForm({ onAdd, onCancel }) {
  const [type, setType] = useState('crafting');
  const [name, setName] = useState('');
  const [daysRequired, setDaysRequired] = useState(ACTIVITY_TYPES.crafting.defaultDays);
  const [goldPerDay, setGoldPerDay] = useState(ACTIVITY_TYPES.crafting.defaultGoldPerDay);
  const [customData, setCustomData] = useState({});

  const typeMeta = ACTIVITY_TYPES[type];

  const handleTypeChange = (newType) => {
    setType(newType);
    const meta = ACTIVITY_TYPES[newType];
    setDaysRequired(meta.defaultDays);
    setGoldPerDay(meta.defaultGoldPerDay);
    setCustomData({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Activity needs a name'); return; }
    const activity = {
      id: uuid(),
      type,
      name: name.trim(),
      daysRequired: Math.max(1, parseInt(daysRequired) || 1),
      daysCompleted: 0,
      goldCost: Math.max(0, (parseInt(goldPerDay) || 0)) * Math.max(1, parseInt(daysRequired) || 1),
      goldSpent: 0,
      goldPerDay: Math.max(0, parseInt(goldPerDay) || 0),
      status: 'active',
      notes: '',
      checks: [],
      customData,
      startDate: new Date().toISOString(),
      completedDate: null,
      reward: null,
    };
    onAdd(activity);
    toast.success(`Started: ${activity.name}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12, padding: 20, marginBottom: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text)', fontWeight: 600, margin: 0 }}>
          Start New Downtime Activity
        </h3>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-mute)', padding: 4 }}>
          <X size={16} />
        </button>
      </div>

      {/* Type selector grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 6, marginBottom: 16 }}>
        {Object.entries(ACTIVITY_TYPES).map(([key, meta]) => {
          const Icon = meta.icon;
          const active = type === key;
          return (
            <button
              key={key}
              onClick={() => handleTypeChange(key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px',
                borderRadius: 7, cursor: 'pointer', fontSize: 11, fontFamily: 'var(--font-ui)',
                fontWeight: active ? 600 : 400, transition: 'all 0.15s',
                background: active ? meta.bg : 'rgba(255,255,255,0.02)',
                border: `1px solid ${active ? meta.border : 'rgba(255,255,255,0.06)'}`,
                color: active ? meta.color : 'var(--text-dim)',
              }}
            >
              <Icon size={13} /> {meta.label}
            </button>
          );
        })}
      </div>

      <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 14, fontFamily: 'var(--font-ui)', fontStyle: 'italic' }}>
        {typeMeta.description}
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Activity Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={type === 'crafting' ? 'e.g. Potion of Healing' : type === 'training' ? 'e.g. Learn Elvish' : 'Activity name'}
              style={inputStyle}
              autoFocus
            />
          </div>
          <div>
            <label style={labelStyle}>Days Required</label>
            <input type="number" value={daysRequired} onChange={e => setDaysRequired(e.target.value)} min={1} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Gold / Day</label>
            <input type="number" value={goldPerDay} onChange={e => setGoldPerDay(e.target.value)} min={0} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Total Gold Cost</label>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#eab308', fontFamily: 'var(--font-display)', padding: '6px 0' }}>
              {(parseInt(goldPerDay) || 0) * (parseInt(daysRequired) || 0)} gp
            </div>
          </div>
        </div>

        {/* Type-specific fields */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10, marginBottom: 14 }}>
          {typeMeta.fields.map(field => (
            <div key={field.key} style={field.type === 'textarea' ? { gridColumn: '1 / -1' } : {}}>
              <label style={labelStyle}>{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  value={customData[field.key] || ''}
                  onChange={e => setCustomData(p => ({ ...p, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  rows={2}
                  style={inputStyle}
                />
              ) : field.type === 'select' ? (
                <select
                  value={customData[field.key] || ''}
                  onChange={e => setCustomData(p => ({ ...p, [field.key]: e.target.value }))}
                  style={inputStyle}
                >
                  <option value="">— Select —</option>
                  {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={customData[field.key] || ''}
                  onChange={e => setCustomData(p => ({ ...p, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  style={inputStyle}
                />
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="submit"
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px',
              borderRadius: 8, border: `1px solid ${typeMeta.border}`, background: typeMeta.bg,
              color: typeMeta.color, fontSize: 13, fontFamily: 'var(--font-ui)', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = `${typeMeta.color}22`}
            onMouseLeave={e => e.currentTarget.style.background = typeMeta.bg}
          >
            <Play size={14} /> Start Activity
          </button>
          <button
            type="button" onClick={onCancel}
            style={{
              padding: '8px 16px', borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
              color: 'var(--text-dim)', fontSize: 13, fontFamily: 'var(--font-ui)',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}

const labelStyle = {
  display: 'block', fontSize: 10, color: 'var(--text-mute)', marginBottom: 3,
  fontFamily: 'var(--font-ui)', fontWeight: 500,
};

// ─── Advance Time Modal ─────────────────────────────────────────────────────

function AdvanceTimeModal({ activities, onAdvance, onClose }) {
  const [days, setDays] = useState(1);
  const activeActivities = activities.filter(a => a.status === 'active');

  const projectedGold = activeActivities.reduce((sum, a) => {
    const daysLeft = a.daysRequired - a.daysCompleted;
    const advanceDays = Math.min(parseInt(days) || 0, daysLeft);
    return sum + (a.goldPerDay || 0) * advanceDays;
  }, 0);

  const completions = activeActivities.filter(a => {
    return a.daysCompleted + (parseInt(days) || 0) >= a.daysRequired;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(18,18,28,0.98)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14, padding: 24, maxWidth: 420, width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text)', fontWeight: 600, margin: '0 0 4px' }}>
          Advance Time
        </h3>
        <p style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--font-ui)', margin: '0 0 16px' }}>
          Progress all active downtime activities.
        </p>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Days to Advance</label>
          <input
            type="number"
            value={days}
            onChange={e => setDays(e.target.value)}
            min={1}
            max={365}
            style={{ ...inputStyle, fontSize: 18, fontWeight: 700, textAlign: 'center', padding: '10px 16px' }}
            autoFocus
          />
        </div>

        {/* Projections */}
        <div style={{ marginBottom: 16, padding: '12px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontFamily: 'var(--font-ui)', marginBottom: 6 }}>
            <span style={{ color: 'var(--text-dim)' }}>Active activities</span>
            <span style={{ color: 'var(--text)', fontWeight: 600 }}>{activeActivities.length}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontFamily: 'var(--font-ui)', marginBottom: 6 }}>
            <span style={{ color: 'var(--text-dim)' }}>Gold cost</span>
            <span style={{ color: '#eab308', fontWeight: 600 }}>{projectedGold} gp</span>
          </div>
          {completions.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontFamily: 'var(--font-ui)' }}>
              <span style={{ color: 'var(--text-dim)' }}>Will complete</span>
              <span style={{ color: '#4ade80', fontWeight: 600 }}>{completions.length} activit{completions.length === 1 ? 'y' : 'ies'}</span>
            </div>
          )}
        </div>

        {completions.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: 'var(--text-mute)', marginBottom: 4, fontFamily: 'var(--font-ui)', fontWeight: 500 }}>
              Completing:
            </div>
            {completions.map(a => {
              const meta = ACTIVITY_TYPES[a.type] || ACTIVITY_TYPES.custom;
              return (
                <div key={a.id} style={{
                  fontSize: 11, color: meta.color, fontFamily: 'var(--font-ui)', padding: '3px 0',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <CheckCircle size={11} /> {a.name}
                </div>
              );
            })}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => onAdvance(parseInt(days) || 1)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '10px 16px', borderRadius: 8,
              border: '1px solid rgba(74,222,128,0.3)', background: 'rgba(74,222,128,0.10)',
              color: '#4ade80', fontSize: 13, fontFamily: 'var(--font-ui)', fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(74,222,128,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(74,222,128,0.10)'}
          >
            <Clock size={14} /> Advance {days} Day{parseInt(days) !== 1 ? 's' : ''}
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '10px 16px', borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
              color: 'var(--text-dim)', fontSize: 13, fontFamily: 'var(--font-ui)', cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Check Prompt Modal ─────────────────────────────────────────────────────

function CheckPromptModal({ prompts, onSubmit, onClose }) {
  const [results, setResults] = useState(
    prompts.reduce((acc, p) => ({ ...acc, [p.activityId]: { result: '', dc: p.dc || 10 } }), {})
  );

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1001,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(18,18,28,0.98)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14, padding: 24, maxWidth: 440, width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text)', fontWeight: 600, margin: '0 0 4px' }}>
          Skill Checks Required
        </h3>
        <p style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-ui)', margin: '0 0 14px' }}>
          Enter roll results for each activity that needs a check.
        </p>

        {prompts.map(p => {
          const meta = ACTIVITY_TYPES[p.type] || ACTIVITY_TYPES.custom;
          return (
            <div key={p.activityId} style={{
              padding: '10px 12px', borderRadius: 8, marginBottom: 8,
              background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.06)`,
              borderLeft: `3px solid ${meta.color}`,
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-ui)', marginBottom: 6 }}>
                {p.name} — {p.checkType}
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div>
                  <label style={{ ...labelStyle, marginBottom: 2 }}>DC</label>
                  <input
                    type="number"
                    value={results[p.activityId]?.dc || 10}
                    onChange={e => setResults(r => ({ ...r, [p.activityId]: { ...r[p.activityId], dc: e.target.value } }))}
                    style={{ ...inputStyle, width: 60, textAlign: 'center' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ ...labelStyle, marginBottom: 2 }}>Roll Result</label>
                  <input
                    type="number"
                    value={results[p.activityId]?.result || ''}
                    onChange={e => setResults(r => ({ ...r, [p.activityId]: { ...r[p.activityId], result: e.target.value } }))}
                    placeholder="Roll..."
                    style={{ ...inputStyle, textAlign: 'center' }}
                  />
                </div>
              </div>
            </div>
          );
        })}

        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <button
            onClick={() => onSubmit(results)}
            style={{
              flex: 1, padding: '10px', borderRadius: 8,
              border: '1px solid rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.10)',
              color: '#60a5fa', fontSize: 13, fontFamily: 'var(--font-ui)', fontWeight: 600, cursor: 'pointer',
            }}
          >
            Submit Checks
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '10px 16px', borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
              color: 'var(--text-dim)', fontSize: 13, fontFamily: 'var(--font-ui)', cursor: 'pointer',
            }}
          >
            Skip
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Downtime Component ────────────────────────────────────────────────

export default function Downtime({ character }) {
  const charId = character?.id;
  const [activities, setActivities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showAdvance, setShowAdvance] = useState(false);
  const [checkPrompts, setCheckPrompts] = useState(null);
  const [filter, setFilter] = useState('active'); // active | completed | abandoned | all
  const [typeFilter, setTypeFilter] = useState('all');
  const hasLoaded = useRef(false);

  // Load on mount
  useEffect(() => {
    hasLoaded.current = false;
    if (charId) {
      setActivities(loadActivities(charId));
      hasLoaded.current = true;
    }
  }, [charId]);

  // Save on change
  useEffect(() => {
    if (!hasLoaded.current) return;
    if (charId && activities.length >= 0) saveActivities(charId, activities);
  }, [charId, activities]);

  const addActivity = useCallback((activity) => {
    setActivities(prev => [activity, ...prev]);
    setShowForm(false);
  }, []);

  const updateActivity = useCallback((id, updates) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  }, []);

  const deleteActivity = useCallback((id) => {
    setActivities(prev => prev.filter(a => a.id !== id));
    toast.success('Activity deleted');
  }, []);

  const completeActivity = useCallback((id) => {
    setActivities(prev => prev.map(a => {
      if (a.id !== id) return a;
      const meta = ACTIVITY_TYPES[a.type] || ACTIVITY_TYPES.custom;
      return {
        ...a,
        status: 'completed',
        daysCompleted: a.daysRequired,
        goldSpent: a.goldCost,
        completedDate: new Date().toISOString(),
        reward: a.reward || meta.reward,
      };
    }));
    toast.success('Activity completed!');
  }, []);

  const abandonActivity = useCallback((id) => {
    setActivities(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'abandoned', completedDate: new Date().toISOString() } : a
    ));
    toast('Activity abandoned', { icon: '⏸' });
  }, []);

  // Advance time
  const advanceTime = useCallback((days) => {
    // Check for activities needing skill checks
    const needsChecks = [];
    activities.forEach(a => {
      if (a.status !== 'active') return;
      const checkType = a.customData?.skillCheck;
      if (checkType && checkType !== 'None') {
        needsChecks.push({
          activityId: a.id,
          name: a.name,
          type: a.type,
          checkType,
          dc: a.customData?.conSaveDC || 10,
        });
      }
    });

    if (needsChecks.length > 0) {
      setCheckPrompts({ prompts: needsChecks, days });
      setShowAdvance(false);
      return;
    }

    applyAdvance(days, {});
  }, [activities]);

  const applyAdvance = useCallback((days, checkResults) => {
    setActivities(prev => prev.map(a => {
      if (a.status !== 'active') return a;
      const daysLeft = a.daysRequired - a.daysCompleted;
      const advanceDays = Math.min(days, daysLeft);
      const newDaysCompleted = a.daysCompleted + advanceDays;
      const goldForDays = (a.goldPerDay || 0) * advanceDays;
      const newGoldSpent = a.goldSpent + goldForDays;
      const completed = newDaysCompleted >= a.daysRequired;

      // Add check result if any
      const newChecks = [...(a.checks || [])];
      const cr = checkResults[a.id];
      if (cr && cr.result) {
        newChecks.push({
          day: newDaysCompleted,
          type: a.customData?.skillCheck || 'Check',
          result: parseInt(cr.result),
          dc: parseInt(cr.dc) || 10,
          success: parseInt(cr.result) >= (parseInt(cr.dc) || 10),
        });
      }

      const meta = ACTIVITY_TYPES[a.type] || ACTIVITY_TYPES.custom;
      return {
        ...a,
        daysCompleted: newDaysCompleted,
        goldSpent: newGoldSpent,
        checks: newChecks,
        status: completed ? 'completed' : 'active',
        completedDate: completed ? new Date().toISOString() : a.completedDate,
        reward: completed ? (a.reward || meta.reward) : a.reward,
      };
    }));

    setShowAdvance(false);
    setCheckPrompts(null);
    toast.success(`Advanced ${days} day${days !== 1 ? 's' : ''}`);
  }, []);

  const handleCheckSubmit = useCallback((results) => {
    if (checkPrompts) applyAdvance(checkPrompts.days, results);
  }, [checkPrompts, applyAdvance]);

  // Filtered activities
  const filtered = useMemo(() => {
    return activities.filter(a => {
      if (filter !== 'all' && a.status !== filter) return false;
      if (typeFilter !== 'all' && a.type !== typeFilter) return false;
      return true;
    });
  }, [activities, filter, typeFilter]);

  const activeCount = activities.filter(a => a.status === 'active').length;
  const completedCount = activities.filter(a => a.status === 'completed').length;
  const totalGoldSpent = activities.reduce((sum, a) => sum + (a.goldSpent || 0), 0);

  if (!charId) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)' }}>
        Select a character to track downtime activities.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 4px' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Clock size={22} style={{ color: '#f59e0b' }} />
          Downtime Activities
        </h2>
        <p style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--font-ui)', margin: 0 }}>
          Track crafting, training, research, and other between-adventure activities.
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <StatPill label="Active" value={activeCount} color="#4ade80" />
        <StatPill label="Completed" value={completedCount} color="#3b82f6" />
        <StatPill label="Gold Spent" value={`${totalGoldSpent} gp`} color="#eab308" />
      </div>

      {/* Action bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
            borderRadius: 8, border: '1px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.10)',
            color: '#f59e0b', fontSize: 13, fontFamily: 'var(--font-ui)', fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.18)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,158,11,0.10)'}
        >
          <Plus size={15} /> New Activity
        </button>

        {activeCount > 0 && (
          <button
            onClick={() => setShowAdvance(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
              borderRadius: 8, border: '1px solid rgba(74,222,128,0.3)', background: 'rgba(74,222,128,0.10)',
              color: '#4ade80', fontSize: 13, fontFamily: 'var(--font-ui)', fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(74,222,128,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(74,222,128,0.10)'}
          >
            <Clock size={15} /> Advance Time
          </button>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Filters */}
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            { key: 'all', label: 'All' },
            { key: 'active', label: 'Active' },
            { key: 'completed', label: 'Done' },
            { key: 'abandoned', label: 'Abandoned' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: '4px 10px', borderRadius: 5, fontSize: 10, fontFamily: 'var(--font-ui)',
                fontWeight: filter === f.key ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s',
                background: filter === f.key ? 'rgba(255,255,255,0.08)' : 'transparent',
                border: `1px solid ${filter === f.key ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)'}`,
                color: filter === f.key ? 'var(--text)' : 'var(--text-mute)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Type filter */}
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          style={{
            padding: '4px 8px', borderRadius: 5, fontSize: 10, fontFamily: 'var(--font-ui)',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--text-dim)', cursor: 'pointer', outline: 'none',
          }}
        >
          <option value="all">All Types</option>
          {Object.entries(ACTIVITY_TYPES).map(([key, meta]) => (
            <option key={key} value={key}>{meta.label}</option>
          ))}
        </select>
      </div>

      {/* New Activity Form */}
      <AnimatePresence>
        {showForm && <NewActivityForm onAdd={addActivity} onCancel={() => setShowForm(false)} />}
      </AnimatePresence>

      {/* Activity Cards */}
      <AnimatePresence mode="popLayout">
        {filtered.length > 0 ? (
          filtered.map(activity => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onUpdate={updateActivity}
              onDelete={deleteActivity}
              onComplete={completeActivity}
              onAbandon={abandonActivity}
            />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center', padding: '48px 20px',
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12,
            }}
          >
            <Clock size={36} style={{ color: 'var(--text-mute)', marginBottom: 12 }} />
            <div style={{ fontSize: 14, color: 'var(--text-dim)', fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 4 }}>
              {filter === 'active' ? 'No active downtime activities' :
               filter === 'completed' ? 'No completed activities yet' :
               filter === 'abandoned' ? 'No abandoned activities' :
               'No downtime activities yet'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-mute)', fontFamily: 'var(--font-ui)' }}>
              Start a new activity to track crafting, training, research, and more.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activity History (completed + abandoned in timeline) */}
      {filter === 'all' && activities.filter(a => a.status === 'completed').length > 0 && (
        <div style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Archive size={14} style={{ color: 'var(--text-mute)' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--text-dim)', fontWeight: 600, margin: 0 }}>
              Activity History
            </h3>
          </div>
          <div style={{
            borderLeft: '2px solid rgba(255,255,255,0.06)', marginLeft: 6, paddingLeft: 16,
          }}>
            {activities
              .filter(a => a.status === 'completed')
              .sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate))
              .map(a => {
                const meta = ACTIVITY_TYPES[a.type] || ACTIVITY_TYPES.custom;
                const Icon = meta.icon;
                return (
                  <div key={a.id} style={{
                    position: 'relative', marginBottom: 12, padding: '8px 12px',
                    background: 'rgba(255,255,255,0.02)', borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.04)',
                  }}>
                    {/* Timeline dot */}
                    <div style={{
                      position: 'absolute', left: -24, top: 12, width: 10, height: 10,
                      borderRadius: '50%', background: meta.color, border: '2px solid rgba(18,18,28,1)',
                    }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon size={14} style={{ color: meta.color }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>
                        {a.name}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--text-mute)', fontFamily: 'var(--font-ui)', marginLeft: 'auto' }}>
                        {formatDate(a.completedDate)}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-ui)', marginTop: 2 }}>
                      {a.daysRequired} days · {a.goldSpent} gp spent
                      {a.reward && ` · ${a.reward}`}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Advance Time Modal */}
      <AnimatePresence>
        {showAdvance && (
          <AdvanceTimeModal
            activities={activities}
            onAdvance={advanceTime}
            onClose={() => setShowAdvance(false)}
          />
        )}
      </AnimatePresence>

      {/* Check Prompt Modal */}
      <AnimatePresence>
        {checkPrompts && (
          <CheckPromptModal
            prompts={checkPrompts.prompts}
            onSubmit={handleCheckSubmit}
            onClose={() => { setCheckPrompts(null); applyAdvance(checkPrompts.days, {}); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
      borderRadius: 8, background: `${color}0a`, border: `1px solid ${color}20`,
    }}>
      <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-ui)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: 'var(--font-display)' }}>{value}</span>
    </div>
  );
}
