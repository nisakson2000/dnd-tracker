import { memo, useMemo } from 'react';
import { Swords } from 'lucide-react';
import { useCampaignSync } from '../../contexts/CampaignSyncContext';

// Compact condition labels for the initiative bar
const CONDITION_COLORS = {
  blinded: '#6b7280', charmed: '#f472b6', deafened: '#9ca3af', frightened: '#a78bfa',
  grappled: '#f97316', incapacitated: '#dc2626', invisible: '#67e8f9', paralyzed: '#eab308',
  petrified: '#78716c', poisoned: '#22c55e', prone: '#d97706', restrained: '#ea580c',
  stunned: '#facc15', unconscious: '#991b1b', concentrating: '#60a5fa',
};

export default memo(function CombatStateBar() {
  const {
    combatActive, initiativeOrder, currentTurn, round,
    monsterHpTiers, monsterConditions,
  } = useCampaignSync();

  const entries = useMemo(() => {
    if (!initiativeOrder?.length) return [];
    return initiativeOrder.map((entry, i) => {
      const isCurrent = i === currentTurn;
      const hpInfo = entry.is_monster ? monsterHpTiers[entry.monster_id] : null;
      const conditions = entry.is_monster ? (monsterConditions[entry.monster_id] || []) : [];
      return { ...entry, index: i, isCurrent, hpInfo, conditions };
    });
  }, [initiativeOrder, currentTurn, monsterHpTiers, monsterConditions]);

  if (!combatActive || entries.length === 0) return null;

  return (
    <div style={{
      padding: '8px 12px',
      background: 'rgba(201,168,76,0.04)',
      borderBottom: '1px solid rgba(201,168,76,0.12)',
    }}>
      {/* Round counter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <Swords size={11} style={{ color: '#ef4444' }} />
        <span style={{ fontSize: 10, fontWeight: 700, color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-heading)' }}>
          Round {round}
        </span>
      </div>

      {/* Initiative tokens row */}
      <div style={{
        display: 'flex', gap: 4, overflowX: 'auto',
        paddingBottom: 4, scrollbarWidth: 'thin',
      }}>
        {entries.map(entry => (
          <div
            key={entry.index}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              padding: '4px 8px', borderRadius: 8, minWidth: 52, flexShrink: 0,
              background: entry.isCurrent ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.02)',
              border: entry.isCurrent
                ? '1.5px solid rgba(201,168,76,0.5)'
                : '1px solid rgba(255,255,255,0.06)',
              boxShadow: entry.isCurrent ? '0 0 8px rgba(201,168,76,0.2)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {/* Name */}
            <span style={{
              fontSize: 9, fontWeight: entry.isCurrent ? 700 : 500,
              color: entry.isCurrent ? '#e8d9b5' : 'rgba(255,255,255,0.4)',
              maxWidth: 60, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              textAlign: 'center',
            }}>
              {entry.name}
            </span>

            {/* Initiative roll */}
            <span style={{
              fontSize: 8, color: 'rgba(255,255,255,0.2)',
              fontFamily: 'var(--font-mono, monospace)',
            }}>
              {entry.initiative}
            </span>

            {/* Monster HP tier dot + condition icons */}
            {entry.is_monster && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 1 }}>
                {/* HP tier dot */}
                {entry.hpInfo && !entry.hpInfo.hidden && (
                  <div
                    title={entry.hpInfo.hp_exact || entry.hpInfo.hp_pct != null ? `${entry.hpInfo.hp_pct}%` : entry.hpInfo.tier_label}
                    style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: entry.hpInfo.tier_color || '#4ade80',
                      border: `1px solid ${entry.hpInfo.tier_color || '#4ade80'}60`,
                      flexShrink: 0,
                    }}
                  />
                )}
                {/* HP detail text (percentage or exact) */}
                {entry.hpInfo?.hp_pct != null && (
                  <span style={{ fontSize: 7, color: entry.hpInfo.tier_color, fontWeight: 600 }}>
                    {entry.hpInfo.hp_pct}%
                  </span>
                )}
                {entry.hpInfo?.hp_exact && (
                  <span style={{ fontSize: 7, color: entry.hpInfo.tier_color, fontWeight: 600 }}>
                    {entry.hpInfo.hp_exact}
                  </span>
                )}
              </div>
            )}

            {/* Condition badges */}
            {entry.conditions.length > 0 && (
              <div style={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', marginTop: 1 }}>
                {entry.conditions.map(cid => (
                  <span
                    key={cid}
                    title={cid}
                    style={{
                      fontSize: 6, padding: '0px 2px', borderRadius: 2,
                      background: `${CONDITION_COLORS[cid] || '#888'}20`,
                      color: CONDITION_COLORS[cid] || '#888',
                      fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em',
                    }}
                  >
                    {cid.slice(0, 3)}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
})
