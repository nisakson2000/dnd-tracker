import { useEffect, useRef } from 'react';
import { Scroll, Coins, Map, Megaphone, X, MapPin, Users } from 'lucide-react';
import ModalPortal from '../ModalPortal';
import { useCampaignSync } from '../../contexts/CampaignSyncContext';

const TYPE_STYLES = {
  narrative: { icon: Scroll, bg: 'linear-gradient(135deg, #2a1f0e, #1a150b)', border: '#d4a574', accent: '#d4a574', label: 'The DM narrates...' },
  loot: { icon: Coins, bg: 'linear-gradient(135deg, #1a1a05, #151205)', border: '#fbbf24', accent: '#fbbf24', label: 'Loot!' },
  quest: { icon: Map, bg: 'linear-gradient(135deg, #0a1525, #0d1020)', border: '#60a5fa', accent: '#60a5fa', label: 'Quest Update' },
  announcement: { icon: Megaphone, bg: 'linear-gradient(135deg, #1a1505, #151005)', border: '#f59e0b', accent: '#f59e0b', label: 'Announcement' },
  scene_change: { icon: MapPin, bg: 'linear-gradient(135deg, #1a0f2e, #120d1f)', border: '#a78bfa', accent: '#a78bfa', label: 'Scene Change' },
  npc_reveal: { icon: Users, bg: 'linear-gradient(135deg, #0a1f15, #0d1a12)', border: '#4ade80', accent: '#4ade80', label: 'NPC Discovered' },
  quest_reveal: { icon: Map, bg: 'linear-gradient(135deg, #0a1530, #0d1025)', border: '#60a5fa', accent: '#60a5fa', label: 'New Quest' },
};

export default function PlayerNotification() {
  const { latestBroadcast, dismissBroadcast } = useCampaignSync();
  const timerRef = useRef(null);

  useEffect(() => {
    if (!latestBroadcast) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(dismissBroadcast, 8000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [latestBroadcast, dismissBroadcast]);

  if (!latestBroadcast) return null;

  const style = TYPE_STYLES[latestBroadcast.broadcast_type] || TYPE_STYLES.announcement;
  const Icon = style.icon;

  return (
    <ModalPortal>
      <div
        onClick={dismissBroadcast}
        style={{
          position: 'fixed', top: 24, right: 24, zIndex: 55,
          maxWidth: 380, width: '90vw',
          background: style.bg, border: `1px solid ${style.border}44`,
          borderRadius: 12, padding: '16px 18px',
          boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${style.border}15`,
          cursor: 'pointer', animation: 'slideInRight 0.3s ease-out',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Icon size={16} style={{ color: style.accent }} />
          <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: style.accent, fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
            {style.label}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); dismissBroadcast(); }}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 2 }}
          >
            <X size={12} />
          </button>
        </div>
        {latestBroadcast.title && (
          <div style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: 15, color: '#e8d9b5', marginBottom: 6, lineHeight: 1.3 }}>
            {latestBroadcast.title}
          </div>
        )}
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, fontFamily: 'var(--font-ui)' }}>
          {latestBroadcast.body}
        </div>
      </div>
    </ModalPortal>
  );
}
