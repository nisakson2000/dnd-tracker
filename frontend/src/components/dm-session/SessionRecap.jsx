import { useState, useCallback } from 'react';
import { ScrollText, Copy, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import toast from 'react-hot-toast';

export default function SessionRecap({ sessionId }) {
  const [recap, setRecap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!sessionId) {
      toast.error('No session ID available');
      return;
    }
    setLoading(true);
    try {
      const md = await invoke('generate_session_recap', { sessionId });
      setRecap(md);
      setExpanded(true);
    } catch (e) {
      toast.error('Failed to generate recap');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  const handleCopy = useCallback(async () => {
    if (!recap) return;
    try {
      await navigator.clipboard.writeText(recap);
      setCopied(true);
      toast.success('Recap copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  }, [recap]);

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '10px',
      overflow: 'hidden',
    }}>
      <button
        onClick={recap ? () => setExpanded(!expanded) : handleGenerate}
        disabled={loading}
        style={{
          width: '100%',
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 14px',
          background: 'none', border: 'none', cursor: loading ? 'wait' : 'pointer',
          color: 'var(--text-dim)', fontSize: '12px', fontWeight: 600,
          fontFamily: 'var(--font-ui)', transition: 'color 0.15s',
        }}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.color = 'var(--text)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-dim)'; }}
      >
        <ScrollText size={13} />
        {loading ? 'Generating recap...' : recap ? 'Session Recap' : 'Generate Session Recap'}
        <span style={{ marginLeft: 'auto' }}>
          {recap && (expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />)}
        </span>
      </button>

      {expanded && recap && (
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '12px 14px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
            <button
              onClick={handleCopy}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '4px 10px', borderRadius: '6px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: copied ? '#4ade80' : 'var(--text-mute)',
                fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--font-ui)',
                transition: 'all 0.15s',
              }}
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div style={{
            whiteSpace: 'pre-wrap',
            fontSize: '12px',
            lineHeight: 1.6,
            color: 'var(--text-dim)',
            fontFamily: 'var(--font-ui)',
            maxHeight: '400px',
            overflowY: 'auto',
            padding: '8px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '6px',
          }}>
            {recap}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button
              onClick={handleGenerate}
              disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '4px 10px', borderRadius: '6px',
                background: 'rgba(155,89,182,0.1)',
                border: '1px solid rgba(155,89,182,0.2)',
                color: '#c084fc', fontSize: '11px', cursor: 'pointer',
                fontFamily: 'var(--font-ui)', transition: 'all 0.15s',
              }}
            >
              Regenerate
            </button>
            <button
              onClick={() => setExpanded(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '4px 10px', borderRadius: '6px',
                background: 'none',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text-mute)', fontSize: '11px', cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
              }}
            >
              <X size={11} /> Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
