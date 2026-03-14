import { Swords } from 'lucide-react';
import ModalPortal from '../ModalPortal';
import { useCampaignSync } from '../../contexts/CampaignSyncContext';

export default function SharedCombatBar() {
  const { combatActive, initiativeOrder, currentTurn, round, isMyTurn } = useCampaignSync();

  if (!combatActive || !initiativeOrder.length) return null;

  const currentCombatant = initiativeOrder[currentTurn] || {};

  return (
    <ModalPortal>
      {/* Your turn banner */}
      {isMyTurn && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 58,
          height: 48,
          background: 'linear-gradient(90deg, rgba(201,168,76,0.2), rgba(201,168,76,0.3), rgba(201,168,76,0.2))',
          borderBottom: '2px solid rgba(201,168,76,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          animation: 'pulseGold 2s ease-in-out infinite',
        }}>
          <Swords size={18} style={{ color: '#c9a84c' }} />
          <span style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: 18, fontWeight: 700, color: '#fde68a', letterSpacing: '0.08em' }}>
            YOUR TURN
          </span>
          <Swords size={18} style={{ color: '#c9a84c' }} />
        </div>
      )}

      {/* Initiative bar */}
      <div style={{
        position: 'fixed',
        top: isMyTurn ? 48 : 0,
        left: 0, right: 0, zIndex: 57,
        height: 32,
        background: 'rgba(10,10,18,0.9)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        padding: '0 16px',
        backdropFilter: 'blur(8px)',
      }}>
        <span style={{ fontSize: 10, color: 'rgba(201,168,76,0.5)', fontFamily: 'var(--font-heading)', letterSpacing: '0.1em', marginRight: 8 }}>
          Round {round}
        </span>

        {initiativeOrder.map((combatant, i) => {
          const isCurrent = i === currentTurn;
          return (
            <div
              key={combatant.client_id || combatant.name || i}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '2px 8px', borderRadius: 6,
                background: isCurrent ? 'rgba(201,168,76,0.15)' : 'transparent',
                border: `1px solid ${isCurrent ? 'rgba(201,168,76,0.35)' : 'transparent'}`,
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: isCurrent ? '#c9a84c' : 'rgba(255,255,255,0.15)',
                boxShadow: isCurrent ? '0 0 6px rgba(201,168,76,0.5)' : 'none',
              }} />
              <span style={{
                fontSize: 11, fontWeight: isCurrent ? 700 : 400,
                color: isCurrent ? '#e8d9b5' : 'rgba(255,255,255,0.3)',
                fontFamily: 'var(--font-ui)',
                maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {combatant.name || '?'}
              </span>
            </div>
          );
        })}

        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginLeft: 8 }}>
          {currentCombatant.name || '?'}'s Turn
        </span>
      </div>
    </ModalPortal>
  );
}
