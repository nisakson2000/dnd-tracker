import { useState } from 'react';
import { Send, Scroll, Coins, Map, Megaphone } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCampaignSync } from '../../contexts/CampaignSyncContext';

const BROADCAST_TYPES = [
  { id: 'narrative', label: 'Narrative', icon: Scroll, color: '#d4a574' },
  { id: 'loot', label: 'Loot', icon: Coins, color: '#fbbf24' },
  { id: 'quest', label: 'Quest Update', icon: Map, color: '#60a5fa' },
  { id: 'announcement', label: 'Announcement', icon: Megaphone, color: '#f59e0b' },
];

export default function DmBroadcastPanel() {
  const { sendBroadcast, broadcasts } = useCampaignSync();
  const [broadcastType, setBroadcastType] = useState('narrative');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSend = () => {
    if (!body.trim()) { toast.error('Write something to broadcast'); return; }
    sendBroadcast(broadcastType, title.trim(), body.trim());
    toast.success('Broadcast sent!');
    setTitle('');
    setBody('');
  };

  const typeInfo = BROADCAST_TYPES.find(t => t.id === broadcastType) || BROADCAST_TYPES[0];

  return (
    <div className="card border-gold/15 space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-gold/60 flex items-center gap-2">
        <Megaphone size={13} /> DM Broadcast
      </h3>

      {/* Type selector */}
      <div className="flex gap-1.5">
        {BROADCAST_TYPES.map(t => {
          const Icon = t.icon;
          const active = broadcastType === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setBroadcastType(t.id)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs transition-all"
              style={{
                background: active ? `${t.color}22` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active ? `${t.color}55` : 'rgba(255,255,255,0.06)'}`,
                color: active ? t.color : 'rgba(255,255,255,0.4)',
              }}
            >
              <Icon size={11} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Title */}
      <input
        className="input w-full text-sm"
        placeholder="Title (optional)"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      {/* Body */}
      <textarea
        className="input w-full text-sm"
        placeholder="Write your broadcast message..."
        rows={3}
        value={body}
        onChange={e => setBody(e.target.value)}
        style={{ resize: 'vertical', minHeight: 60 }}
      />

      {/* Send */}
      <button
        onClick={handleSend}
        disabled={!body.trim()}
        className="btn-primary text-xs flex items-center gap-1.5 px-4 py-2 disabled:opacity-30"
        style={{ background: `${typeInfo.color}22`, borderColor: `${typeInfo.color}44`, color: typeInfo.color }}
      >
        <Send size={12} /> Broadcast to Party
      </button>

      {/* Recent broadcasts */}
      {broadcasts.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-amber-200/8">
          <div className="text-[10px] text-amber-200/25 uppercase tracking-wider">Recent</div>
          {broadcasts.slice(0, 5).map(bc => (
            <div key={bc.id} className="text-xs text-amber-200/40 truncate">
              <span className="text-amber-200/20">[{bc.broadcast_type}]</span> {bc.title || bc.body?.slice(0, 60)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
