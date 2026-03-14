import { useState } from 'react';
import { Megaphone, Dice5, Swords } from 'lucide-react';
import DmBroadcastPanel from './DmBroadcastPanel';
import DmPromptPanel from './DmPromptPanel';
import DmActionPanel from './DmActionPanel';

const TABS = [
  { id: 'broadcast', label: 'Broadcast', icon: Megaphone },
  { id: 'prompt', label: 'Prompt', icon: Dice5 },
  { id: 'actions', label: 'Actions', icon: Swords },
];

/**
 * Merged Comms panel — Broadcast + Prompt as tabs
 * Replaces separate DmBroadcastPanel and DmPromptPanel toolbar buttons
 */
export default function DmCommsPanel() {
  const [tab, setTab] = useState('broadcast');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 3, padding: '2px', background: 'rgba(255,255,255,0.02)', borderRadius: 7 }}>
        {TABS.map(t => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                padding: '6px 10px', borderRadius: 5, fontSize: 10, fontWeight: 600,
                background: active ? 'rgba(201,168,76,0.1)' : 'transparent',
                border: `1px solid ${active ? 'rgba(201,168,76,0.2)' : 'transparent'}`,
                color: active ? '#c9a84c' : 'rgba(255,255,255,0.3)',
                cursor: 'pointer', transition: 'all 0.15s',
                fontFamily: 'var(--font-ui)',
              }}
            >
              <Icon size={11} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {tab === 'broadcast' ? <DmBroadcastPanel /> : tab === 'prompt' ? <DmPromptPanel /> : <DmActionPanel />}
    </div>
  );
}
