import { useEffect, useRef } from 'react';
import { Swords, MapPin, Users, Map, FileText, Scroll, Sparkles, Play, Square } from 'lucide-react';
import { useLiveSession } from '../../contexts/LiveSessionContext';

const TYPE_CONFIG = {
  session_start: { icon: Play, color: '#4ade80' },
  session_end: { icon: Square, color: '#ef4444' },
  scene_change: { icon: MapPin, color: '#c9a84c' },
  combat_start: { icon: Swords, color: '#ef4444' },
  combat_end: { icon: Swords, color: '#ef4444' },
  kill: { icon: Swords, color: '#ef4444' },
  damage: { icon: Swords, color: '#fbbf24' },
  npc_reveal: { icon: Users, color: '#4ade80' },
  quest_reveal: { icon: Map, color: '#60a5fa' },
  handout_revealed: { icon: FileText, color: '#fbbf24' },
  narrative: { icon: Scroll, color: '#d4a574' },
  perception_check: { icon: Sparkles, color: '#c084fc' },
  stealth_check: { icon: Sparkles, color: '#c084fc' },
};

export default function DmLogPanel() {
  const { actionLog, sessionActive } = useLiveSession();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [actionLog.length]);

  if (!sessionActive) {
    return (
      <div style={{ textAlign: 'center', padding: 16, color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
        Start a live session to see the action log.
      </div>
    );
  }

  if (actionLog.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 16, color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
        No events yet. Actions will appear here as you run the session.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 400, overflowY: 'auto' }}>
      {actionLog.map((entry, i) => {
        const config = TYPE_CONFIG[entry.type] || { icon: Sparkles, color: 'rgba(255,255,255,0.4)' };
        const Icon = config.icon;
        const time = new Date(entry.timestamp);
        const timeStr = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')}`;

        return (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 8,
              padding: '5px 8px', borderRadius: 5,
              background: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
            }}
          >
            <Icon size={10} style={{ color: config.color, marginTop: 2, flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', flexShrink: 0, fontFamily: 'var(--font-mono, monospace)' }}>
              {timeStr}
            </span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
              {entry.text}
            </span>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
