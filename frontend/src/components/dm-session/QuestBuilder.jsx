import { useState, useEffect } from 'react';
import {
  X, Save, Plus, Trash2, ChevronDown, ChevronUp,
  Scroll, Swords, Users, Compass, Puzzle, GripVertical,
  MapPin, User, Gift,
} from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import toast from 'react-hot-toast';

const BEAT_TYPES = [
  { key: 'story', label: 'Story', color: '#c9a84c', Icon: Scroll },
  { key: 'combat', label: 'Combat', color: '#ef4444', Icon: Swords },
  { key: 'social', label: 'Social', color: '#60a5fa', Icon: Users },
  { key: 'exploration', label: 'Exploration', color: '#4ade80', Icon: Compass },
  { key: 'puzzle', label: 'Puzzle', color: '#a78bfa', Icon: Puzzle },
];

const BEAT_COLOR_MAP = {
  story: '#c9a84c',
  combat: '#ef4444',
  social: '#60a5fa',
  exploration: '#4ade80',
  puzzle: '#a78bfa',
};

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

function BeatTypeBadge({ type, small }) {
  const color = BEAT_COLOR_MAP[type] || '#888';
  return (
    <span style={{
      fontSize: small ? '9px' : '10px', fontWeight: 600,
      padding: small ? '1px 5px' : '2px 8px',
      borderRadius: '4px',
      background: `${color}22`, color,
      border: `1px solid ${color}44`,
      fontFamily: 'var(--font-ui)', textTransform: 'capitalize',
    }}>
      {type}
    </span>
  );
}

function BeatEditor({ beat, index, npcs, scenes, onChange, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const update = (field, value) => {
    onChange(index, { ...beat, [field]: value });
  };

  const encounters = (() => {
    try { return JSON.parse(beat.linked_encounter_json || '[]'); } catch { return []; }
  })();

  const updateEncounters = (enc) => {
    update('linked_encounter_json', JSON.stringify(enc));
  };

  const addEncounter = () => {
    updateEncounters([...encounters, { name: '', cr: '', hp: '', ac: '', count: 1 }]);
  };

  const updateEncounter = (i, field, val) => {
    const copy = [...encounters];
    copy[i] = { ...copy[i], [field]: val };
    updateEncounters(copy);
  };

  const removeEncounter = (i) => {
    updateEncounters(encounters.filter((_, idx) => idx !== i));
  };

  const linkedNpcIds = (() => {
    try { return JSON.parse(beat.linked_npc_ids_json || '[]'); } catch { return []; }
  })();

  const toggleNpc = (npcId) => {
    const next = linkedNpcIds.includes(npcId)
      ? linkedNpcIds.filter(id => id !== npcId)
      : [...linkedNpcIds, npcId];
    update('linked_npc_ids_json', JSON.stringify(next));
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: `1px solid ${expanded ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.06)'}`,
      borderRadius: '8px', overflow: 'hidden',
      transition: 'border-color 0.15s',
    }}>
      {/* Beat row header */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 10px', cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <GripVertical size={12} style={{ color: 'rgba(255,255,255,0.15)', flexShrink: 0 }} />
        <span style={{
          fontSize: '12px', fontWeight: 600, color: 'var(--text)',
          fontFamily: 'var(--font-ui)', flex: 1,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {beat.title || `Beat ${index + 1}`}
        </span>
        <BeatTypeBadge type={beat.beat_type || 'story'} small />
        {beat.linked_scene_id && (
          <MapPin size={10} style={{ color: '#a78bfa', flexShrink: 0 }} />
        )}
        {linkedNpcIds.length > 0 && (
          <User size={10} style={{ color: '#60a5fa', flexShrink: 0 }} />
        )}
        {expanded ? <ChevronUp size={12} style={{ color: 'var(--text-mute)' }} /> : <ChevronDown size={12} style={{ color: 'var(--text-mute)' }} />}
      </div>

      {/* Expanded editor */}
      {expanded && (
        <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ marginBottom: '8px' }}>
            <label style={labelStyle}>Title</label>
            <input
              style={inputStyle}
              value={beat.title || ''}
              onChange={e => update('title', e.target.value)}
              placeholder="Beat title"
            />
          </div>

          <div style={{ marginBottom: '8px' }}>
            <label style={labelStyle}>Description</label>
            <textarea
              style={textareaStyle}
              value={beat.description || ''}
              onChange={e => update('description', e.target.value)}
              placeholder="What happens in this beat..."
            />
          </div>

          <div style={{ marginBottom: '8px' }}>
            <label style={labelStyle}>DM Notes</label>
            <textarea
              style={{ ...textareaStyle, background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.15)' }}
              value={beat.dm_notes || ''}
              onChange={e => update('dm_notes', e.target.value)}
              placeholder="Private DM notes..."
            />
          </div>

          {/* Beat type selector */}
          <div style={{ marginBottom: '10px' }}>
            <label style={labelStyle}>Type</label>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {BEAT_TYPES.map(({ key, label, color, Icon }) => {
                const active = (beat.beat_type || 'story') === key;
                return (
                  <button
                    key={key}
                    onClick={() => update('beat_type', key)}
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

          {/* Scene link */}
          <div style={{ marginBottom: '8px' }}>
            <label style={labelStyle}>Linked Scene</label>
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={beat.linked_scene_id || ''}
              onChange={e => update('linked_scene_id', e.target.value || null)}
            >
              <option value="">— None —</option>
              {(scenes || []).map(s => (
                <option key={s.id} value={s.id}>{s.name || s.title || `Scene ${s.id}`}</option>
              ))}
            </select>
          </div>

          {/* NPC links */}
          <div style={{ marginBottom: '10px' }}>
            <label style={labelStyle}>Linked NPCs</label>
            <div style={{
              maxHeight: 120, overflowY: 'auto',
              padding: '4px 0',
            }}>
              {(npcs || []).length === 0 && (
                <span style={{ fontSize: '11px', color: 'var(--text-mute)', fontFamily: 'var(--font-ui)' }}>
                  No NPCs available
                </span>
              )}
              {(npcs || []).map(npc => {
                const checked = linkedNpcIds.includes(npc.id);
                return (
                  <label
                    key={npc.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '3px 4px', cursor: 'pointer',
                      fontSize: '12px', color: checked ? '#60a5fa' : 'var(--text-dim)',
                      fontFamily: 'var(--font-ui)',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleNpc(npc.id)}
                      style={{ accentColor: '#60a5fa' }}
                    />
                    {npc.name || `NPC ${npc.id}`}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Encounter config */}
          <div style={{ marginBottom: '10px' }}>
            <label style={labelStyle}>Encounter Monsters</label>
            {encounters.map((enc, i) => (
              <div key={i} style={{
                display: 'flex', gap: '4px', alignItems: 'center',
                marginBottom: '4px',
              }}>
                <input
                  style={{ ...inputStyle, flex: 2 }}
                  value={enc.name || ''}
                  onChange={e => updateEncounter(i, 'name', e.target.value)}
                  placeholder="Name"
                />
                <input
                  style={{ ...inputStyle, flex: '0 0 40px', textAlign: 'center' }}
                  value={enc.cr || ''}
                  onChange={e => updateEncounter(i, 'cr', e.target.value)}
                  placeholder="CR"
                />
                <input
                  style={{ ...inputStyle, flex: '0 0 44px', textAlign: 'center' }}
                  type="number"
                  value={enc.hp || ''}
                  onChange={e => updateEncounter(i, 'hp', e.target.value)}
                  placeholder="HP"
                />
                <input
                  style={{ ...inputStyle, flex: '0 0 40px', textAlign: 'center' }}
                  type="number"
                  value={enc.ac || ''}
                  onChange={e => updateEncounter(i, 'ac', e.target.value)}
                  placeholder="AC"
                />
                <input
                  style={{ ...inputStyle, flex: '0 0 32px', textAlign: 'center' }}
                  type="number" min={1}
                  value={enc.count || 1}
                  onChange={e => updateEncounter(i, 'count', parseInt(e.target.value) || 1)}
                  placeholder="#"
                />
                <button
                  onClick={() => removeEncounter(i)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(239,68,68,0.6)', padding: '2px', flexShrink: 0,
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            <button
              onClick={addEncounter}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '4px 10px', borderRadius: '5px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text-mute)', fontSize: '10px', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'var(--font-ui)',
              }}
            >
              <Plus size={10} /> Add Monster
            </button>
          </div>

          {/* Delete beat */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => onDelete(index)}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '4px 10px', borderRadius: '5px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                color: '#ef4444', fontSize: '10px', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'var(--font-ui)',
              }}
            >
              <Trash2 size={10} /> Remove Beat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuestBuilder({ quest, onSave, onClose, npcs, scenes }) {
  const [title, setTitle] = useState(quest?.title || '');
  const [giver, setGiver] = useState(quest?.giver_npc_id || '');
  const [description, setDescription] = useState(quest?.description || '');
  const [plotSummary, setPlotSummary] = useState(quest?.plot_summary || '');
  const [beats, setBeats] = useState(quest?.beats || []);
  const [xp, setXp] = useState(quest?.reward_xp ?? '');
  const [gold, setGold] = useState(quest?.reward_gold ?? '');
  const [items, setItems] = useState(quest?.reward_items || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (quest?.id && quest.beats === undefined) {
      invoke('list_quest_beats', { questId: quest.id })
        .then(data => setBeats(data || []))
        .catch(err => console.error('[QuestBuilder] load beats:', err));
    }
  }, [quest]);

  const updateBeat = (index, updated) => {
    setBeats(prev => prev.map((b, i) => i === index ? updated : b));
  };

  const deleteBeat = (index) => {
    const beat = beats[index];
    setBeats(prev => prev.filter((_, i) => i !== index));
    if (beat?.id) {
      invoke('delete_quest_beat', { beatId: beat.id }).catch(err =>
        console.error('[QuestBuilder] delete beat:', err)
      );
    }
  };

  const addBeat = () => {
    setBeats(prev => [
      ...prev,
      {
        title: '',
        description: '',
        dm_notes: '',
        beat_type: 'story',
        sort_order: prev.length,
        linked_scene_id: null,
        linked_npc_ids_json: '[]',
        linked_encounter_json: '[]',
      },
    ]);
  };

  const handleSave = async () => {
    if (!title.trim()) { toast.error('Quest needs a title'); return; }
    setSaving(true);
    try {
      const questData = {
        ...quest,
        title: title.trim(),
        giver_npc_id: giver || null,
        description: description.trim(),
        plot_summary: plotSummary.trim(),
        reward_xp: xp ? parseInt(xp, 10) : null,
        reward_gold: gold ? parseInt(gold, 10) : null,
        reward_items: items.trim() || null,
      };
      const beatsData = beats.map((b, i) => ({ ...b, sort_order: i }));
      await onSave({ quest: questData, beats: beatsData });
      toast.success('Quest saved');
    } catch (e) {
      toast.error(typeof e === 'string' ? e : e?.message || 'Failed to save quest');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
    }}>
      <div style={{
        width: '100%', maxWidth: 600, maxHeight: '90vh',
        display: 'flex', flexDirection: 'column',
        background: 'rgba(10,10,16,0.98)',
        border: '1px solid rgba(201,168,76,0.2)',
        borderRadius: '14px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 1px rgba(201,168,76,0.15)',
      }}>
        {/* Modal header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 18px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            fontSize: '14px', fontWeight: 700, color: '#c9a84c',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '0.04em',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <Scroll size={16} /> {quest?.id ? 'Edit Quest' : 'New Quest'}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-mute)', padding: '4px',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '16px 18px',
          display: 'flex', flexDirection: 'column', gap: '12px',
        }}>
          {/* Title + Giver */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Quest Title</label>
              <input
                style={inputStyle}
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g., The Cursed Idol of Xanthar"
              />
            </div>
            <div style={{ flex: '0 0 160px' }}>
              <label style={labelStyle}>Quest Giver</label>
              <select
                style={{ ...inputStyle, cursor: 'pointer' }}
                value={giver}
                onChange={e => setGiver(e.target.value)}
              >
                <option value="">— None —</option>
                {(npcs || []).map(npc => (
                  <option key={npc.id} value={npc.id}>{npc.name || `NPC ${npc.id}`}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              style={textareaStyle}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What the party knows about the quest..."
            />
          </div>

          {/* Plot summary (DM only) */}
          <div>
            <label style={labelStyle}>Plot Summary (DM Only)</label>
            <textarea
              style={{
                ...textareaStyle,
                background: 'rgba(167,139,250,0.06)',
                border: '1px solid rgba(167,139,250,0.15)',
              }}
              value={plotSummary}
              onChange={e => setPlotSummary(e.target.value)}
              placeholder="The full plot arc — only you see this..."
            />
          </div>

          {/* Beat Timeline */}
          <div>
            <div style={sectionHeader}>
              <GripVertical size={11} /> Beat Timeline
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {beats.map((beat, i) => (
                <BeatEditor
                  key={beat.id || `new-${i}`}
                  beat={beat}
                  index={i}
                  npcs={npcs}
                  scenes={scenes}
                  onChange={updateBeat}
                  onDelete={deleteBeat}
                />
              ))}
            </div>
            <button
              onClick={addBeat}
              style={{
                width: '100%', marginTop: '6px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                padding: '8px', borderRadius: '6px',
                background: 'rgba(201,168,76,0.06)',
                border: '1px dashed rgba(201,168,76,0.25)',
                color: '#c9a84c', fontSize: '11px', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'var(--font-ui)',
                transition: 'all 0.15s',
              }}
            >
              <Plus size={12} /> Add Beat
            </button>
          </div>

          {/* Rewards */}
          <div>
            <div style={sectionHeader}>
              <Gift size={11} /> Rewards
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>XP</label>
                <input
                  style={inputStyle}
                  type="number" min={0}
                  value={xp}
                  onChange={e => setXp(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Gold</label>
                <input
                  style={inputStyle}
                  type="number" min={0}
                  value={gold}
                  onChange={e => setGold(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Items</label>
              <textarea
                style={{ ...textareaStyle, minHeight: 40 }}
                value={items}
                onChange={e => setItems(e.target.value)}
                placeholder="One item per line (e.g., Cloak of Protection, +1 Longsword)"
              />
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: '8px',
          padding: '12px 18px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <button
            onClick={onClose}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '8px 16px', borderRadius: '8px',
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
              padding: '8px 20px', borderRadius: '8px',
              background: saving
                ? 'rgba(201,168,76,0.08)'
                : 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.12))',
              border: '1px solid rgba(201,168,76,0.35)',
              color: saving ? 'rgba(201,168,76,0.4)' : '#c9a84c',
              fontSize: '12px', fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-ui)',
              transition: 'all 0.15s',
            }}
          >
            <Save size={13} /> {saving ? 'Saving...' : 'Save Quest'}
          </button>
        </div>
      </div>
    </div>
  );
}
