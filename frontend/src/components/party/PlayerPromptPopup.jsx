import { useState } from 'react';
import { Dice5, Check, X, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import ModalPortal from '../ModalPortal';
import { useCampaignSync } from '../../contexts/CampaignSyncContext';
import { useParty } from '../../contexts/PartyContext';
import { parseAndRollExpression } from '../../utils/dice';

const SKILL_TO_ABILITY = {
  acrobatics: 'dexterity', animal_handling: 'wisdom', arcana: 'intelligence',
  athletics: 'strength', deception: 'charisma', history: 'intelligence',
  insight: 'wisdom', intimidation: 'charisma', investigation: 'intelligence',
  medicine: 'wisdom', nature: 'intelligence', perception: 'wisdom',
  performance: 'charisma', persuasion: 'charisma', religion: 'intelligence',
  sleight_of_hand: 'dexterity', stealth: 'dexterity', survival: 'wisdom',
};

function getAbilityModifier(score) {
  if (score == null) return 0;
  return Math.floor((score - 10) / 2);
}

export default function PlayerPromptPopup() {
  const { activePrompts, respondToPrompt } = useCampaignSync();
  const { members, myClientId } = useParty();
  const [freeText, setFreeText] = useState('');
  const [rollResult, setRollResult] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [sent, setSent] = useState(false);

  if (activePrompts.length === 0) return null;

  const prompt = activePrompts[0]; // Show one at a time

  // Resolve player identity
  const myMember = members.find(m => m.client_id === myClientId);
  const myName = myMember?.character?.name || myMember?.display_name || 'Unknown';
  const character = myMember?.character;

  // Compute modifier and proficiency for roll checks
  const computeRollModifiers = () => {
    let modifier = 0;
    let proficiency = 0;
    const parts = [];

    if (character) {
      // Determine which ability to use
      let abilityKey = prompt.ability; // e.g. 'strength', 'dexterity'
      if (!abilityKey && prompt.skill) {
        abilityKey = SKILL_TO_ABILITY[prompt.skill];
      }

      if (abilityKey && character[abilityKey] != null) {
        modifier = getAbilityModifier(character[abilityKey]);
      }

      if (prompt.proficiency_required && character.proficiency_bonus) {
        proficiency = character.proficiency_bonus;
      }
    }

    if (modifier !== 0) parts.push(`${modifier >= 0 ? '+' : ''}${modifier} ${prompt.ability || prompt.skill || 'ability'}`);
    if (proficiency !== 0) parts.push(`+${proficiency} prof`);

    return { modifier, proficiency, totalMod: modifier + proficiency, parts };
  };

  // Build dice expression based on advantage/disadvantage
  const getDiceExpression = (totalMod) => {
    let diceBase;
    if (prompt.advantage) {
      diceBase = '2d20kh1';
    } else if (prompt.disadvantage) {
      diceBase = '2d20kl1';
    } else {
      diceBase = '1d20';
    }

    if (totalMod !== 0) {
      const sign = totalMod >= 0 ? '+' : '';
      return `${diceBase}${sign}${totalMod}`;
    }
    return diceBase;
  };

  const sendResponse = async (promptId, payload) => {
    try {
      await respondToPrompt(promptId, payload);
      toast.success('Response sent!');
      setSent(true);
      setTimeout(() => setSent(false), 1200);
    } catch (err) {
      toast.error('Failed to send response');
      console.error('respondToPrompt error:', err);
    }
  };

  const handleRoll = () => {
    setRolling(true);
    const { modifier, proficiency, totalMod, parts } = computeRollModifiers();
    const expression = getDiceExpression(totalMod);
    const result = parseAndRollExpression(expression);

    if (result) {
      setRollResult({ ...result, modifier, proficiency, totalMod, parts });
      setTimeout(() => {
        const breakdownStr = [`d20: ${result.total - totalMod}`, ...parts].join(', ');
        sendResponse(prompt.prompt_id, {
          name: myName,
          roll_total: result.total,
          roll_raw: result.total - totalMod,
          modifier,
          proficiency,
          total: result.total,
          breakdown: breakdownStr,
        });
        setRollResult(null);
        setRolling(false);
      }, 800);
    } else {
      setRolling(false);
    }
  };

  const handleChoice = (option) => {
    sendResponse(prompt.prompt_id, { name: myName, choice: option });
  };

  const handleConfirm = (accepted) => {
    sendResponse(prompt.prompt_id, { name: myName, accepted });
  };

  const handleFreeTextSubmit = () => {
    if (!freeText.trim()) return;
    sendResponse(prompt.prompt_id, { name: myName, text: freeText.trim() });
    setFreeText('');
  };

  // Determine pass/fail for DC display
  const dcValue = prompt.dc != null ? Number(prompt.dc) : null;
  const passed = rollResult && dcValue != null ? rollResult.total >= dcValue : null;
  const rawRoll = rollResult ? rollResult.total - (rollResult.totalMod || 0) : null;

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
          {/* Sent confirmation overlay */}
          {sent && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.7)', borderRadius: 16, zIndex: 2,
              animation: 'fadeIn 0.15s ease-out',
            }}>
              <div style={{ textAlign: 'center', color: '#4ade80' }}>
                <CheckCircle size={36} style={{ marginBottom: 8 }} />
                <div style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: 18, fontWeight: 700 }}>Sent!</div>
              </div>
            </div>
          )}

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
            {dcValue != null && (
              <div style={{
                display: 'inline-block', marginTop: 8, padding: '3px 12px',
                borderRadius: 8, fontSize: 12, fontWeight: 700, letterSpacing: '0.05em',
                background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)',
                color: '#c9a84c', fontFamily: 'var(--font-heading)',
              }}>
                DC {dcValue}
              </div>
            )}
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
            {(prompt.advantage || prompt.disadvantage) && (
              <div style={{
                fontSize: 11, fontWeight: 600, marginTop: 6, letterSpacing: '0.05em',
                color: prompt.advantage ? '#4ade80' : '#ef4444',
              }}>
                {prompt.advantage ? 'ADVANTAGE' : 'DISADVANTAGE'}
              </div>
            )}
          </div>

          {/* Roll check */}
          {prompt.prompt_type === 'roll_check' && (
            <div style={{ textAlign: 'center' }}>
              {rollResult ? (
                <div style={{ animation: 'scaleIn 0.3s ease-out' }}>
                  <div style={{
                    fontSize: 48, fontWeight: 700, fontFamily: 'Cinzel, Georgia, serif',
                    color: rawRoll === 20 ? '#4ade80' : rawRoll === 1 ? '#ef4444' : '#c9a84c',
                    marginBottom: 4,
                  }}>
                    {rollResult.total}
                  </div>
                  {/* Breakdown line */}
                  {rollResult.parts && rollResult.parts.length > 0 && (
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
                      d20: {rawRoll}{rollResult.parts.length > 0 ? `, ${rollResult.parts.join(', ')}` : ''}
                    </div>
                  )}
                  {rawRoll === 20 && <div style={{ fontSize: 12, color: '#4ade80', fontWeight: 600 }}>NATURAL 20!</div>}
                  {rawRoll === 1 && <div style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>Critical Fail!</div>}
                  {/* DC pass/fail indicator */}
                  {dcValue != null && passed != null && (
                    <div style={{
                      marginTop: 8, fontSize: 14, fontWeight: 700,
                      color: passed ? '#4ade80' : '#ef4444',
                      letterSpacing: '0.05em',
                    }}>
                      {passed ? 'PASS' : 'FAIL'} (DC {dcValue})
                    </div>
                  )}
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
                  <Dice5 size={22} />
                  {prompt.advantage ? 'Roll 2d20 (Adv)' : prompt.disadvantage ? 'Roll 2d20 (Dis)' : 'Roll d20'}
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
