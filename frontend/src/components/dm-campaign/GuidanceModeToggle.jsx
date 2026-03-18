import React from 'react';
import { HandHelping, Rocket } from 'lucide-react';

export default function GuidanceModeToggle({ mode, onChange }) {
  const handleChange = (newMode) => {
    if (newMode === mode) return;
    onChange(newMode);
    window.dispatchEvent(new CustomEvent('codex-guidance-mode-changed', { detail: newMode }));
  };

  return (
    <div style={{
      display: 'inline-flex',
      borderRadius: 8,
      border: '1px solid var(--border)',
      background: 'rgba(255,255,255,0.02)',
      overflow: 'hidden',
    }}>
      <button
        onClick={() => handleChange('guided')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '5px 12px',
          border: 'none',
          cursor: 'pointer',
          fontSize: 11,
          fontWeight: 600,
          fontFamily: 'var(--font-ui)',
          borderRadius: '7px 0 0 7px',
          transition: 'all 0.15s',
          background: mode === 'guided' ? 'rgba(201,168,76,0.15)' : 'transparent',
          color: mode === 'guided' ? '#c9a84c' : 'var(--text-mute)',
        }}
      >
        <HandHelping size={13} />
        Guided
      </button>
      <button
        onClick={() => handleChange('free')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '5px 12px',
          border: 'none',
          cursor: 'pointer',
          fontSize: 11,
          fontWeight: 600,
          fontFamily: 'var(--font-ui)',
          borderRadius: '0 7px 7px 0',
          transition: 'all 0.15s',
          background: mode === 'free' ? 'rgba(155,89,182,0.15)' : 'transparent',
          color: mode === 'free' ? '#c084fc' : 'var(--text-mute)',
        }}
      >
        <Rocket size={13} />
        Free
      </button>
    </div>
  );
}
