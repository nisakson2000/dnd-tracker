import { useState } from 'react';
import { Dice5, Check, X, Send } from 'lucide-react';
import ModalPortal from '../ModalPortal';
import { useCampaignSync } from '../../contexts/CampaignSyncContext';
import { parseAndRollExpression } from '../../utils/dice';

export default function PlayerPromptPopup() {
  const { activePrompts, respondToPrompt } = useCampaignSync();
  const [freeText, setFreeText] = useState('');
  const [rollResult, setRollResult] = useState(null);
  const [rolling, setRolling] = useState(false);

  if (activePrompts.length === 0) return null;

  const prompt = activePrompts[0]; // Show one at a time

  const handleRoll = () => {
    setRolling(true);
    const result = parseAndRollExpression('1d20');
    if (result) {
      setRollResult(result);
      setTimeout(() => {
        respondToPrompt(prompt.prompt_id, {
          name: 'Me', // Will be enriched by the server with client data
          roll_total: result.total,
          breakdown: `d20: ${result.total}`,
          roll_raw: result.total,
        });
        setRollResult(null);
        setRolling(false);
      }, 800);
    }
  };

  const handleChoice = (option) => {
    respondToPrompt(prompt.prompt_id, { name: 'Me', choice: option });
  };

  const handleConfirm = (accepted) => {
    respondToPrompt(prompt.prompt_id, { name: 'Me', accepted });
  };

  const handleFreeTextSubmit = () => {
    if (!freeText.trim()) return;
    respondToPrompt(prompt.prompt_id, { name: 'Me', text: freeText.trim() });
    setFreeText('');
  };

  return (
    <ModalPortal>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease-out',
      }}>
        <div style={{
          maxWidth: 420, width: '90vw',
          background: 'linear-gradient(135deg, #1a1520, #12101a)',
          border: '1px solid rgba(201,168,76,0.3)',
          borderRadius: 16, padding: '24px',
          boxShadow: '0 16px 64px rgba(0,0,0,0.5), 0 0 30px rgba(201,168,76,0.1)',
          animation: 'scaleIn 0.25s ease-out',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            {prompt.scene_context && (
              <div style={{ fontSize: 11, color: 'rgba(160,120,200,0.5)', fontStyle: 'italic', marginBottom: 8, lineHeight: 1.4 }}>
                {prompt.scene_context}
              </div>
            )}
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(201,168,76,0.6)', fontFamily: 'var(--font-heading)', marginBottom: 6 }}>
              The DM requests
            </div>
            <div style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: 20, color: '#e8d9b5', lineHeight: 1.3 }}>
              {prompt.label || prompt.title || prompt.question || 'Action Required'}
            </div>
            {prompt.body && (
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 8, lineHeight: 1.5 }}>
                {prompt.body}
              </div>
            )}
            {prompt.description && (
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 8, lineHeight: 1.5 }}>
                {prompt.description}
              </div>
            )}
          </div>

          {/* Roll check */}
          {prompt.prompt_type === 'roll_check' && (
            <div style={{ textAlign: 'center' }}>
              {rollResult ? (
                <div style={{ animation: 'scaleIn 0.3s ease-out' }}>
                  <div style={{ fontSize: 48, fontWeight: 700, fontFamily: 'Cinzel, Georgia, serif', color: rollResult.total === 20 ? '#4ade80' : rollResult.total === 1 ? '#ef4444' : '#c9a84c', marginBottom: 8 }}>
                    {rollResult.total}
                  </div>
                  {rollResult.total === 20 && <div style={{ fontSize: 12, color: '#4ade80', fontWeight: 600 }}>NATURAL 20!</div>}
                  {rollResult.total === 1 && <div style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>Critical Fail!</div>}
                </div>
              ) : (
                <button
                  onClick={handleRoll}
                  disabled={rolling}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    padding: '14px 32px', borderRadius: 12,
                    background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.1))',
                    border: '2px solid rgba(201,168,76,0.4)',
                    color: '#c9a84c', fontSize: 16, fontWeight: 700,
                    fontFamily: 'Cinzel, Georgia, serif', cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 0 20px rgba(201,168,76,0.15)',
                  }}
                >
                  <Dice5 size={22} /> Roll d20
                </button>
              )}
            </div>
          )}

          {/* Choice */}
          {prompt.prompt_type === 'choice' && prompt.options && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {prompt.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(opt)}
                  style={{
                    padding: '12px 16px', borderRadius: 10,
                    background: 'rgba(96,165,250,0.08)',
                    border: '1px solid rgba(96,165,250,0.25)',
                    color: '#93c5fd', fontSize: 14, fontWeight: 500,
                    cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
                    fontFamily: 'var(--font-ui)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(96,165,250,0.15)'; e.currentTarget.style.borderColor = 'rgba(96,165,250,0.5)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(96,165,250,0.08)'; e.currentTarget.style.borderColor = 'rgba(96,165,250,0.25)'; }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Confirm */}
          {prompt.prompt_type === 'confirm' && (
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => handleConfirm(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '12px 28px', borderRadius: 10,
                  background: 'rgba(74,222,128,0.1)',
                  border: '1px solid rgba(74,222,128,0.3)',
                  color: '#4ade80', fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <Check size={16} /> Accept
              </button>
              <button
                onClick={() => handleConfirm(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '12px 28px', borderRadius: 10,
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  color: '#ef4444', fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <X size={16} /> Decline
              </button>
            </div>
          )}

          {/* Free text */}
          {prompt.prompt_type === 'free_text' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <textarea
                value={freeText}
                onChange={e => setFreeText(e.target.value)}
                placeholder="Type your response..."
                rows={3}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#e8d9b5', fontSize: 14, resize: 'vertical',
                  fontFamily: 'var(--font-ui)', outline: 'none',
                }}
                autoFocus
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleFreeTextSubmit(); } }}
              />
              <button
                onClick={handleFreeTextSubmit}
                disabled={!freeText.trim()}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '10px 20px', borderRadius: 10,
                  background: freeText.trim() ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${freeText.trim() ? 'rgba(201,168,76,0.35)' : 'rgba(255,255,255,0.06)'}`,
                  color: freeText.trim() ? '#c9a84c' : 'rgba(255,255,255,0.2)',
                  fontSize: 14, fontWeight: 600, cursor: freeText.trim() ? 'pointer' : 'default',
                }}
              >
                <Send size={14} /> Submit
              </button>
            </div>
          )}
        </div>
      </div>
    </ModalPortal>
  );
}
