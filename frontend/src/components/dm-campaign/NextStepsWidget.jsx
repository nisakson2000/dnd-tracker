import React from 'react';
import { Compass, ChevronRight, MapPin, Users, Scroll, Swords, FileText } from 'lucide-react';

const SECTION_ICONS = {
  'campaign-hub': MapPin,
  'npcs': Users,
  'quests': Scroll,
  'encounter-builder': Swords,
  'session-prep': FileText,
  'journal': FileText,
};

export default function NextStepsWidget({ actions, onNavigate }) {
  if (!actions || actions.length === 0) return null;

  return (
    <div style={{
      margin: '0 10px 8px',
      padding: '12px 14px',
      borderRadius: 10,
      background: 'rgba(201,168,76,0.04)',
      border: '1px solid rgba(201,168,76,0.18)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 10,
        fontSize: 11,
        fontWeight: 700,
        color: '#c9a84c',
        fontFamily: 'var(--font-display)',
        letterSpacing: '0.03em',
      }}>
        <Compass size={13} />
        Next Steps
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {actions.slice(0, 3).map(action => {
          const Icon = SECTION_ICONS[action.section] || ChevronRight;
          return (
            <button
              key={action.id}
              onClick={() => action.section && onNavigate(action.section)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 8px',
                borderRadius: 6,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                color: 'var(--text-dim)',
                fontSize: 11,
                cursor: action.section ? 'pointer' : 'default',
                fontFamily: 'var(--font-ui)',
                textAlign: 'left',
                transition: 'all 0.15s',
                width: '100%',
              }}
              onMouseEnter={e => {
                if (action.section) {
                  e.currentTarget.style.background = 'rgba(201,168,76,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)';
                  e.currentTarget.style.color = 'var(--text)';
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.color = 'var(--text-dim)';
              }}
            >
              <Icon size={12} style={{ color: '#c9a84c', flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{action.text}</span>
              {action.section && <ChevronRight size={10} style={{ color: 'var(--text-mute)' }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
