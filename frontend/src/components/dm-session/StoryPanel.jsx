import { useState, useEffect, useCallback } from 'react';
import { BookOpen, Send, ChevronRight, Plus, Scroll, Trash2, X } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const GOLD = '#c9a84c';
const PURPLE = '#9b59b6';
const BG_CARD = 'rgba(11,9,20,0.85)';
const BG_INPUT = 'rgba(255,255,255,0.04)';
const BORDER = 'rgba(201,168,76,0.25)';
const BORDER_SUBTLE = 'rgba(255,255,255,0.08)';
const TEXT_PRIMARY = 'rgba(255,255,255,0.88)';
const TEXT_DIM = 'rgba(255,255,255,0.45)';

const STATUS_COLORS = {
  dormant: '#555',
  active: GOLD,
  escalating: '#ef4444',
  resolved: '#4ade80',
  paused: '#60a5fa',
};

const STATUS_LABELS = {
  dormant: 'Dormant',
  active: 'Active',
  escalating: 'Escalating',
  resolved: 'Resolved',
  paused: 'Paused',
};

const ADVANCE_MAP = {
  dormant: 'active',
  active: 'escalating',
  escalating: 'resolved',
  paused: 'active',
};

/* ─── small helpers ─── */

function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || '#555';
  return (
    <span style={{
      fontSize: '9px', fontWeight: 600,
      padding: '1px 6px', borderRadius: '4px',
      background: `${color}22`, color,
      border: `1px solid ${color}44`,
      fontFamily: 'var(--font-ui)', textTransform: 'capitalize',
      whiteSpace: 'nowrap',
    }}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

function PriorityDot({ priority }) {
  const colors = { critical: '#ef4444', high: '#f59e0b', medium: GOLD, low: '#555' };
  const c = colors[priority] || colors.medium;
  return (
    <span
      title={`Priority: ${priority}`}
      style={{
        display: 'inline-block', width: 7, height: 7,
        borderRadius: '50%', background: c, flexShrink: 0,
        boxShadow: priority === 'critical' ? `0 0 6px ${c}88` : 'none',
      }}
    />
  );
}

function SectionHeading({ icon: Icon, label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      marginBottom: '8px', paddingBottom: '5px',
      borderBottom: `1px solid ${BORDER}`,
    }}>
      <Icon size={14} style={{ color: GOLD }} />
      <span style={{
        fontSize: '11px', fontWeight: 700, color: GOLD,
        fontFamily: 'var(--font-ui)', textTransform: 'uppercase',
        letterSpacing: '0.6px',
      }}>
        {label}
      </span>
    </div>
  );
}

/* ─── main component ─── */

export default function StoryPanel({ campaignId, onBroadcast, beatContext }) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [narration, setNarration] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);

  // Pre-fill narration from beat context when it changes
  useEffect(() => {
    if (beatContext?.text && !narration.trim()) {
      setNarration(beatContext.text);
    }
  }, [beatContext?.text]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ─── load threads ─── */

  const loadThreads = useCallback(async () => {
    try {
      const data = await invoke('list_story_threads');
      setThreads(data || []);
    } catch (err) {
      console.error('Failed to load story threads:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadThreads();
  }, [loadThreads, campaignId]);

  /* ─── narration broadcast ─── */

  const handleBroadcast = () => {
    if (!narration.trim()) return;
    onBroadcast?.({ type: 'NarrativeText', text: narration.trim() });
    toast.success('Narration broadcast to players');
    setNarration('');
  };

  /* ─── create thread ─── */

  const handleCreateThread = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      await invoke('create_story_thread', {
        title: newTitle.trim(),
        description: newDesc.trim(),
        threadType: null,
        priority: null,
        linkedQuestIdsJson: null,
        linkedNpcIdsJson: null,
        phasesJson: null,
        dmNotes: null,
      });
      toast.success('Story thread created');
      setNewTitle('');
      setNewDesc('');
      setShowNewForm(false);
      await loadThreads();
    } catch (err) {
      toast.error(`Failed to create thread: ${err}`);
    } finally {
      setCreating(false);
    }
  };

  /* ─── advance thread ─── */

  const handleAdvance = async (thread) => {
    const nextStatus = ADVANCE_MAP[thread.status];
    if (!nextStatus) {
      toast('Thread is already resolved', { icon: '\u2714' });
      return;
    }

    try {
      await invoke('update_story_thread', {
        threadId: thread.id,
        title: thread.title,
        description: thread.description || '',
        threadType: thread.thread_type || 'main_campaign',
        status: nextStatus,
        currentPhase: thread.current_phase || '',
        phasesJson: thread.phases_json || '[]',
        linkedQuestIdsJson: thread.linked_quest_ids_json || '[]',
        linkedNpcIdsJson: thread.linked_npc_ids_json || '[]',
        dmNotes: thread.dm_notes || '',
        priority: thread.priority || 'medium',
      });

      onBroadcast?.({
        type: 'QuestUpdate',
        threadId: thread.id,
        title: thread.title,
        newStatus: nextStatus,
      });

      toast.success(`"${thread.title}" advanced to ${STATUS_LABELS[nextStatus] || nextStatus}`);
      await loadThreads();
    } catch (err) {
      toast.error(`Failed to advance thread: ${err}`);
    }
  };

  /* ─── delete thread ─── */

  const handleDelete = async (thread) => {
    try {
      await invoke('delete_story_thread', { threadId: thread.id });
      toast.success('Thread deleted');
      await loadThreads();
    } catch (err) {
      toast.error(`Failed to delete thread: ${err}`);
    }
  };

  /* ─── styles ─── */

  const inputStyle = {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '6px',
    background: BG_INPUT,
    border: `1px solid ${BORDER_SUBTLE}`,
    color: TEXT_PRIMARY,
    fontSize: '12px',
    fontFamily: 'var(--font-ui)',
    outline: 'none',
    resize: 'vertical',
    boxSizing: 'border-box',
  };

  const btnStyle = (color, disabled) => ({
    display: 'flex', alignItems: 'center', gap: '5px',
    padding: '5px 10px', borderRadius: '6px',
    background: disabled ? 'rgba(255,255,255,0.02)' : `${color}15`,
    border: `1px solid ${disabled ? 'rgba(255,255,255,0.06)' : `${color}44`}`,
    color: disabled ? 'rgba(255,255,255,0.15)' : color,
    fontSize: '10px', fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'var(--font-ui)',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  });

  /* ─── render ─── */

  const activeThreads = threads.filter(t => t.status !== 'resolved');
  const resolvedThreads = threads.filter(t => t.status === 'resolved');

  return (
    <div style={{
      background: BG_CARD,
      borderRadius: '10px',
      border: `1px solid ${BORDER}`,
      padding: '14px',
      display: 'flex', flexDirection: 'column', gap: '14px',
      fontFamily: 'var(--font-ui)',
      maxHeight: '100%',
      overflow: 'auto',
    }}>

      {/* ── Narration Box ── */}
      <div>
        <SectionHeading icon={BookOpen} label="Narration" />
        <textarea
          value={narration}
          onChange={e => setNarration(e.target.value)}
          placeholder="Type narration text to broadcast to players..."
          rows={3}
          style={{ ...inputStyle, minHeight: '60px' }}
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleBroadcast();
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
          <button
            onClick={handleBroadcast}
            disabled={!narration.trim()}
            style={btnStyle(GOLD, !narration.trim())}
          >
            <Send size={11} />
            Broadcast to Players
          </button>
        </div>
      </div>

      {/* ── Story Threads ── */}
      <div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '8px', paddingBottom: '5px',
          borderBottom: `1px solid ${BORDER}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Scroll size={14} style={{ color: PURPLE }} />
            <span style={{
              fontSize: '11px', fontWeight: 700, color: PURPLE,
              fontFamily: 'var(--font-ui)', textTransform: 'uppercase',
              letterSpacing: '0.6px',
            }}>
              Story Threads
            </span>
            <span style={{
              fontSize: '9px', color: TEXT_DIM,
              fontFamily: 'var(--font-ui)',
            }}>
              ({activeThreads.length} active)
            </span>
          </div>
          <button
            onClick={() => setShowNewForm(f => !f)}
            style={btnStyle(PURPLE, false)}
            title="New Thread"
          >
            {showNewForm ? <X size={11} /> : <Plus size={11} />}
            {showNewForm ? 'Cancel' : 'New'}
          </button>
        </div>

        {/* ── New thread form ── */}
        <AnimatePresence>
          {showNewForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                overflow: 'hidden',
                marginBottom: '10px',
                padding: '10px',
                borderRadius: '8px',
                background: 'rgba(155,89,182,0.06)',
                border: `1px solid ${PURPLE}33`,
              }}
            >
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Thread title..."
                style={{ ...inputStyle, marginBottom: '6px' }}
                autoFocus
              />
              <textarea
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                placeholder="Description (optional)..."
                rows={2}
                style={{ ...inputStyle, minHeight: '40px', marginBottom: '8px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleCreateThread}
                  disabled={creating || !newTitle.trim()}
                  style={btnStyle(PURPLE, creating || !newTitle.trim())}
                >
                  <Plus size={11} />
                  {creating ? 'Creating...' : 'Create Thread'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Thread list ── */}
        {loading ? (
          <div style={{ fontSize: '11px', color: TEXT_DIM, textAlign: 'center', padding: '16px 0' }}>
            Loading threads...
          </div>
        ) : threads.length === 0 ? (
          <div style={{ fontSize: '11px', color: TEXT_DIM, textAlign: 'center', padding: '16px 0' }}>
            No story threads yet. Create one to get started.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <AnimatePresence>
              {activeThreads.map(thread => (
                <motion.div
                  key={thread.id}
                  layout
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.02)',
                    border: `1px solid ${BORDER_SUBTLE}`,
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = `${PURPLE}55`}
                  onMouseLeave={e => e.currentTarget.style.borderColor = BORDER_SUBTLE}
                >
                  {/* Top row: title + badges */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    marginBottom: '4px',
                  }}>
                    <PriorityDot priority={thread.priority} />
                    <span style={{
                      fontSize: '11px', fontWeight: 600, color: TEXT_PRIMARY,
                      flex: 1, overflow: 'hidden', textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {thread.title}
                    </span>
                    <StatusBadge status={thread.status} />
                  </div>

                  {/* Description */}
                  {thread.description && (
                    <div style={{
                      fontSize: '10px', color: TEXT_DIM,
                      marginBottom: '4px', lineHeight: '1.4',
                      overflow: 'hidden', textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}>
                      {thread.description}
                    </div>
                  )}

                  {/* Current phase */}
                  {thread.current_phase && (
                    <div style={{
                      fontSize: '9px', color: PURPLE,
                      marginBottom: '4px', fontStyle: 'italic',
                    }}>
                      Phase: {thread.current_phase}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    marginTop: '4px',
                  }}>
                    {ADVANCE_MAP[thread.status] && (
                      <button
                        onClick={() => handleAdvance(thread)}
                        style={btnStyle(GOLD, false)}
                        title={`Advance to ${STATUS_LABELS[ADVANCE_MAP[thread.status]] || ADVANCE_MAP[thread.status]}`}
                      >
                        <ChevronRight size={11} />
                        Advance
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(thread)}
                      style={btnStyle('#ef4444', false)}
                      title="Delete thread"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* ── Resolved threads (collapsed) ── */}
            {resolvedThreads.length > 0 && (
              <div style={{ marginTop: '6px' }}>
                <div style={{
                  fontSize: '9px', color: TEXT_DIM, fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                  marginBottom: '4px',
                }}>
                  Resolved ({resolvedThreads.length})
                </div>
                {resolvedThreads.map(thread => (
                  <div
                    key={thread.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '4px 8px',
                      fontSize: '10px', color: TEXT_DIM,
                      opacity: 0.6,
                    }}
                  >
                    <PriorityDot priority={thread.priority} />
                    <span style={{
                      flex: 1, overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      textDecoration: 'line-through',
                    }}>
                      {thread.title}
                    </span>
                    <button
                      onClick={() => handleDelete(thread)}
                      style={{
                        ...btnStyle('#ef4444', false),
                        padding: '2px 5px',
                      }}
                      title="Delete thread"
                    >
                      <Trash2 size={9} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
