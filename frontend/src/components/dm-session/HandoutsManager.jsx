import { useState, useEffect, useCallback } from 'react';
import { Eye, EyeOff, Plus, Trash2, Check, X, FileText } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import toast from 'react-hot-toast';

export default function HandoutsManager({ campaignId }) {
  const [handouts, setHandouts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const loadHandouts = useCallback(async () => {
    try {
      const list = await invoke('list_handouts');
      setHandouts(list);
    } catch (e) {
      console.error('Failed to load handouts:', e);
    }
  }, []);

  useEffect(() => { loadHandouts(); }, [loadHandouts]);

  const handleCreate = async () => {
    if (!title.trim()) { toast.error('Title is required'); return; }
    setLoading(true);
    try {
      await invoke('create_handout', { title: title.trim(), content: content.trim() });
      toast.success('Handout created');
      setTitle(''); setContent(''); setShowForm(false);
      loadHandouts();
    } catch (e) {
      toast.error('Failed to create handout');
      console.error(e);
    } finally { setLoading(false); }
  };

  const handleReveal = async (handout) => {
    try {
      await invoke('reveal_handout', { handoutId: handout.id });
      // Broadcast to connected players via WebSocket
      await invoke('ws_broadcast_event', {
        eventJson: JSON.stringify({
          type: 'HandoutRevealed',
          campaign_id: campaignId,
          handout_id: String(handout.id),
          title: handout.title || '',
          content: handout.content || '',
        })
      });
      toast.success(`Revealed: ${handout.title}`);
      loadHandouts();
    } catch (e) {
      toast.error('Failed to reveal handout');
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    try {
      await invoke('delete_handout', { handoutId: id });
      toast.success('Handout deleted');
      loadHandouts();
    } catch (e) {
      toast.error('Failed to delete handout');
      console.error(e);
    }
  };

  const inputStyle = {
    width: '100%', padding: '8px 12px', borderRadius: '6px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--text)', fontSize: '13px',
    fontFamily: 'var(--font-ui)', outline: 'none',
    marginBottom: '8px', boxSizing: 'border-box',
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '12px', overflow: 'hidden',
    }}>
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        fontSize: '11px', fontWeight: 700,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'var(--text-mute)',
        fontFamily: 'var(--font-mono, monospace)',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <FileText size={12} /> Handouts ({handouts.length})
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            marginLeft: 'auto',
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '3px 8px', borderRadius: '4px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--text-dim)', fontSize: '10px',
            cursor: 'pointer', fontFamily: 'var(--font-ui)',
          }}
        >
          {showForm ? <X size={10} /> : <Plus size={10} />}
          {showForm ? 'Cancel' : 'New'}
        </button>
      </div>

      <div style={{ padding: '12px', maxHeight: '400px', overflowY: 'auto' }}>
        {showForm && (
          <div style={{
            padding: '12px', borderRadius: '8px',
            background: 'rgba(155,89,182,0.06)',
            border: '1px solid rgba(155,89,182,0.15)',
            marginBottom: '12px',
          }}>
            <input
              type="text" value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Handout title"
              autoFocus
              style={inputStyle}
            />
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Handout content (markdown supported)"
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setShowForm(false); setTitle(''); setContent(''); }}
                style={{
                  padding: '5px 12px', borderRadius: '6px',
                  background: 'none', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-dim)', fontSize: '12px',
                  cursor: 'pointer', fontFamily: 'var(--font-ui)',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}
              >
                <X size={11} /> Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={loading || !title.trim()}
                style={{
                  padding: '5px 12px', borderRadius: '6px',
                  background: title.trim() ? 'rgba(155,89,182,0.2)' : 'rgba(155,89,182,0.05)',
                  border: '1px solid rgba(155,89,182,0.3)',
                  color: title.trim() ? '#c084fc' : 'rgba(192,132,252,0.3)',
                  fontSize: '12px', fontWeight: 600,
                  cursor: title.trim() ? 'pointer' : 'not-allowed',
                  fontFamily: 'var(--font-ui)',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}
              >
                <Check size={11} /> Create
              </button>
            </div>
          </div>
        )}

        {handouts.length === 0 && !showForm ? (
          <div style={{
            textAlign: 'center', padding: '24px 8px',
            color: 'var(--text-mute)', fontSize: '12px',
          }}>
            <FileText size={24} style={{ opacity: 0.3, marginBottom: '8px' }} />
            <p>No handouts yet</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '6px' }}>
            {handouts.map(h => (
              <div key={h.id} style={{
                padding: '10px 12px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${h.revealed ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.06)'}`,
                display: 'flex', alignItems: 'flex-start', gap: '10px',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    fontSize: '13px', fontWeight: 500, color: 'var(--text)',
                  }}>
                    {h.revealed && <Check size={12} style={{ color: '#4ade80', flexShrink: 0 }} />}
                    {h.title}
                  </div>
                  {h.content && (
                    <div style={{
                      fontSize: '11px', color: 'var(--text-mute)',
                      marginTop: '4px', lineHeight: 1.4,
                      overflow: 'hidden', textOverflow: 'ellipsis',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    }}>
                      {h.content}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                  {!h.revealed && (
                    <button
                      onClick={() => handleReveal(h)}
                      title="Reveal to players"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '3px',
                        padding: '4px 8px', borderRadius: '5px',
                        background: 'rgba(74,222,128,0.1)',
                        border: '1px solid rgba(74,222,128,0.2)',
                        color: '#4ade80', fontSize: '10px', fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'var(--font-ui)',
                      }}
                    >
                      <Eye size={11} /> Reveal
                    </button>
                  )}
                  {h.revealed && (
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: '3px',
                      padding: '4px 8px', fontSize: '10px', color: '#4ade80',
                      fontFamily: 'var(--font-ui)',
                    }}>
                      <Eye size={11} /> Shown
                    </span>
                  )}
                  <button
                    onClick={() => handleDelete(h.id)}
                    title="Delete handout"
                    style={{
                      padding: '4px', borderRadius: '4px',
                      background: 'none', border: 'none',
                      color: 'var(--text-mute)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center',
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-mute)'}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
