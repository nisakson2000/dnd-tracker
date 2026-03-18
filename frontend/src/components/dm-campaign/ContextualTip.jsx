import React from 'react';
import { Lightbulb, X } from 'lucide-react';

export default function ContextualTip({ tipId, text, onDismiss, onHideAll }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      padding: '10px 14px',
      borderRadius: 10,
      background: 'rgba(201,168,76,0.06)',
      border: '1px solid rgba(201,168,76,0.15)',
      marginBottom: 12,
    }}>
      <Lightbulb size={14} style={{ color: '#c9a84c', flexShrink: 0, marginTop: 1 }} />
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 12,
          color: 'var(--text-dim)',
          lineHeight: 1.5,
          fontFamily: 'var(--font-ui)',
        }}>
          {text}
        </div>
        {onHideAll && (
          <button
            onClick={onHideAll}
            style={{
              marginTop: 6,
              padding: 0,
              background: 'none',
              border: 'none',
              color: 'var(--text-mute)',
              fontSize: 10,
              cursor: 'pointer',
              textDecoration: 'underline',
              fontFamily: 'var(--font-ui)',
            }}
          >
            Hide all tips
          </button>
        )}
      </div>
      <button
        onClick={() => onDismiss(tipId)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-mute)',
          padding: 2,
          display: 'flex',
          flexShrink: 0,
        }}
      >
        <X size={12} />
      </button>
    </div>
  );
}
