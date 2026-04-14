import { memo, useState, useCallback } from 'react';
import {
  ScrollText, Eye, FileText, Heart,
  Send, MessageCircle, Hand, Moon,
  BookOpen, Compass, User, Shield,
  Edit3, ChevronDown, ChevronUp, Activity, Zap, Footprints,
  Clock, Trash2, Dice1, Target, Swords, MapPin,
} from 'lucide-react';
import CampaignOverview from '../CampaignOverview';
import { SKILL_LIST } from '../../data/playerRollMacros';
import { QUEST_STATUS_COLORS, QUEST_PRIORITY, NPC_RELATIONSHIP_LEVELS } from '../../data/playerQuestTracker';
import { getRestChecklist } from '../../data/playerLongRestChecklist';
import { PARTY_STATUS, getPartyMemberStatus, QUICK_REACTIONS } from '../../data/playerPartyView';
import { PREP_TIPS, getSpellPrepInfo, calculatePreparedCount } from '../../data/playerSpellPreparation';
import { HEALING_SPELLS_RANKED, HEALING_STRATEGY } from '../../data/playerHealingOptimizer';
import { getClassCard, getCombatCard } from '../../data/playerShortcutReference';
import { searchConditions } from '../../data/playerConditionRemoval';
import { calcMod, ABILITIES } from '../../utils/dndHelpers';

function AbilityScoreGrid({ abilities }) {
  const ABILITY_ORDER = ABILITIES;
  const abilityMap = {};
  (abilities || []).forEach(a => {
    const key = (a.ability || '').toUpperCase().slice(0, 3);
    abilityMap[key] = a.score || 10;
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px' }}>
      {ABILITY_ORDER.map(ab => {
        const score = abilityMap[ab] || 10;
        const mod = calcMod(score);
        const modStr = mod >= 0 ? `+${mod}` : `${mod}`;
        return (
          <div key={ab} style={{
            textAlign: 'center', padding: '4px 2px',
            borderRadius: '6px', background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}>
            <div style={{ fontSize: '8px', fontWeight: 700, color: 'var(--text-mute)', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>{ab}</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>{score}</div>
            <div style={{ fontSize: '10px', color: mod >= 0 ? '#4ade80' : '#f87171', fontWeight: 600 }}>{modStr}</div>
          </div>
        );
      })}
    </div>
  );
}

export default memo(function PlayerSessionSidebar({
  panelStyle,
  panelHeaderStyle,
  // Character data
  characterData,
  characterAbilities,
  characterConditions,
  // Handouts
  handouts,
  expandedHandout,
  setExpandedHandout,
  // Session info
  campaignName,
  sessionActive,
  round,
  connectedPlayers,
  currentScene,
  // Campaign world
  campaignId,
  showCampaignWorld,
  setShowCampaignWorld,
  // Quests
  activeQuests,
  // NPCs
  discoveredNpcs,
  // Player actions
  connected,
  useItemOpen,
  setUseItemOpen,
  useItemName,
  setUseItemName,
  handleUseItem,
  restType,
  setRestType,
  handleRequestRest,
  whisperOpen,
  setWhisperOpen,
  whisperText,
  setWhisperText,
  handleWhisperToDm,
  suggestionInput,
  setSuggestionInput,
  suggestionSending,
  handleSendSuggestion,
  // Session notes
  sessionNote,
  setSessionNote,
  handleSaveNote,
  savedNotes,
  onDeleteNote,
  // Chat
  chatMessages,
  chatInput,
  setChatInput,
  handleSendChat,
  actionInput,
  setActionInput,
  handleRequestAction,
}) {
  const [showCharView, setShowCharView] = useState(false);
  const [showSavedNotes, setShowSavedNotes] = useState(false);
  const [showSkillChecks, setShowSkillChecks] = useState(false);
  const [showSavingThrows, setShowSavingThrows] = useState(false);
  const [showRestChecklist, setShowRestChecklist] = useState(false);
  const [restChecklistType, setRestChecklistType] = useState('short');
  const [restChecked, setRestChecked] = useState({});
  const [showPartyStatus, setShowPartyStatus] = useState(false);
  const [showSpellPrep, setShowSpellPrep] = useState(false);
  const [showHealingRef, setShowHealingRef] = useState(false);
  const [showQuickRef, setShowQuickRef] = useState(false);
  const [showConditionCures, setShowConditionCures] = useState(false);
  const [conditionQuery, setConditionQuery] = useState('');

  // Auto-save note on blur if there's content
  const handleNoteBlur = useCallback(() => {
    if (sessionNote?.trim()) {
      handleSaveNote();
    }
  }, [sessionNote, handleSaveNote]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '100%' }}>
      {/* Character Quick-View */}
      {characterData && (
        <div style={panelStyle}>
          <button
            onClick={() => setShowCharView(!showCharView)}
            style={{
              ...panelHeaderStyle,
              width: '100%', background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: 'var(--font-mono, monospace)',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={12} /> Character
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-mute)' }}>
              {showCharView ? '\u25B2' : '\u25BC'}
            </span>
          </button>
          {showCharView && (
            <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Name, Race, Class, Level */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display, "Cinzel", serif)' }}>
                  {characterData.name || 'Unknown'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
                  {[characterData.race, characterData.class, characterData.level ? `Lv ${characterData.level}` : null].filter(Boolean).join(' \u2022 ')}
                </div>
              </div>

              {/* HP Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Heart size={10} style={{ color: '#ef4444' }} /> HP
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                    {characterData.current_hp ?? '?'}/{characterData.max_hp ?? '?'}
                    {(characterData.temp_hp || 0) > 0 && (
                      <span style={{ color: '#60a5fa', marginLeft: '4px' }}>+{characterData.temp_hp}</span>
                    )}
                  </span>
                </div>
                <div style={{
                  height: '6px', borderRadius: '3px',
                  background: 'rgba(255,255,255,0.06)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', borderRadius: '3px',
                    width: `${Math.min(100, Math.max(0, ((characterData.current_hp || 0) / (characterData.max_hp || 1)) * 100))}%`,
                    background: ((characterData.current_hp || 0) / (characterData.max_hp || 1)) > 0.5
                      ? '#4ade80'
                      : ((characterData.current_hp || 0) / (characterData.max_hp || 1)) > 0.25
                        ? '#fbbf24'
                        : '#ef4444',
                    transition: 'width 0.3s, background 0.3s',
                  }} />
                </div>
              </div>

              {/* AC, Speed, Initiative, Proficiency */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                {[
                  { label: 'AC', value: characterData.armor_class ?? characterData.ac ?? '—', icon: Shield, color: '#60a5fa' },
                  { label: 'Speed', value: characterData.speed ? `${characterData.speed} ft` : '—', icon: Footprints, color: '#a78bfa' },
                  { label: 'Initiative', value: (() => {
                    const dexEntry = (characterAbilities || []).find(a => (a.ability || '').toUpperCase().startsWith('DEX'));
                    const mod = dexEntry ? calcMod(dexEntry.score || 10) : 0;
                    return mod >= 0 ? `+${mod}` : `${mod}`;
                  })(), icon: Zap, color: '#fbbf24' },
                  { label: 'Prof.', value: characterData.proficiency_bonus ? `+${characterData.proficiency_bonus}` : '—', icon: Activity, color: '#4ade80' },
                ].map(stat => (
                  <div key={stat.label} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '5px 8px', borderRadius: '6px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <stat.icon size={11} style={{ color: stat.color, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '8px', color: 'var(--text-mute)', fontWeight: 600, letterSpacing: '0.04em' }}>{stat.label}</div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{stat.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ability Scores */}
              {characterAbilities && characterAbilities.length > 0 && (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                    Ability Scores
                  </div>
                  <AbilityScoreGrid abilities={characterAbilities} />
                </div>
              )}

              {/* Active Conditions */}
              {characterConditions && characterConditions.length > 0 && (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                    Conditions
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {characterConditions.map((c, i) => (
                      <span key={c.id || i} style={{
                        fontSize: '10px', fontWeight: 600,
                        padding: '2px 8px', borderRadius: '4px',
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.2)',
                        color: '#f87171',
                        textTransform: 'capitalize',
                      }}>
                        {c.name || c.condition || 'Unknown'}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Quick Reference */}
      <div style={panelStyle}>
        <button
          onClick={() => setShowQuickRef(!showQuickRef)}
          style={{
            ...panelHeaderStyle,
            width: '100%', background: 'none', border: 'none',
            cursor: 'pointer', fontFamily: 'var(--font-mono, monospace)',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={12} /> Quick Reference
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-mute)' }}>
            {showQuickRef ? '\u25B2' : '\u25BC'}
          </span>
        </button>
        {showQuickRef && (() => {
          const classCard = getClassCard(characterData?.class);
          const combatCard = getCombatCard();
          return (
            <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Class-specific key ability */}
              {classCard && (
                <div style={{
                  padding: '8px 10px', borderRadius: '6px',
                  background: 'rgba(168,139,250,0.08)',
                  border: '1px solid rgba(168,139,250,0.18)',
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                    {characterData?.class} — {classCard.key}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)', lineHeight: 1.5 }}>
                    {classCard.reminder}
                  </div>
                </div>
              )}

              {/* Your Turn actions */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Swords size={10} /> Your Turn
                </div>
                <ul style={{ margin: 0, paddingLeft: '14px', listStyleType: 'disc' }}>
                  {combatCard.yourTurn.map((item, i) => (
                    <li key={i} style={{ fontSize: '10px', color: 'var(--text-dim)', lineHeight: 1.6 }}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Reactions */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Zap size={10} /> Reactions
                </div>
                <ul style={{ margin: 0, paddingLeft: '14px', listStyleType: 'disc' }}>
                  {combatCard.otherTurns.map((item, i) => (
                    <li key={i} style={{ fontSize: '10px', color: 'var(--text-dim)', lineHeight: 1.6 }}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Important Numbers */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Target size={10} /> Important Numbers
                </div>
                <ul style={{ margin: 0, paddingLeft: '14px', listStyleType: 'disc' }}>
                  {combatCard.importantNumbers.map((item, i) => (
                    <li key={i} style={{ fontSize: '10px', color: 'var(--text-dim)', lineHeight: 1.6 }}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Quick Skill Checks */}
      {characterAbilities && characterAbilities.length > 0 && (
        <div style={panelStyle}>
          <button
            onClick={() => setShowSkillChecks(!showSkillChecks)}
            style={{
              ...panelHeaderStyle,
              width: '100%', background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: 'var(--font-mono, monospace)',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={12} /> Skill Checks
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-mute)' }}>
              {showSkillChecks ? '\u25B2' : '\u25BC'}
            </span>
          </button>
          {showSkillChecks && (
            <div style={{ padding: '8px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
              {(SKILL_LIST || [
                { name: 'Acrobatics', ability: 'DEX' }, { name: 'Animal Handling', ability: 'WIS' },
                { name: 'Arcana', ability: 'INT' }, { name: 'Athletics', ability: 'STR' },
                { name: 'Deception', ability: 'CHA' }, { name: 'History', ability: 'INT' },
                { name: 'Insight', ability: 'WIS' }, { name: 'Intimidation', ability: 'CHA' },
                { name: 'Investigation', ability: 'INT' }, { name: 'Medicine', ability: 'WIS' },
                { name: 'Nature', ability: 'INT' }, { name: 'Perception', ability: 'WIS' },
                { name: 'Performance', ability: 'CHA' }, { name: 'Persuasion', ability: 'CHA' },
                { name: 'Religion', ability: 'INT' }, { name: 'Sleight of Hand', ability: 'DEX' },
                { name: 'Stealth', ability: 'DEX' }, { name: 'Survival', ability: 'WIS' },
              ]).map(skill => {
                const abilityEntry = (characterAbilities || []).find(a =>
                  (a.ability || '').toUpperCase().startsWith(skill.ability?.slice(0, 3))
                );
                const mod = abilityEntry ? calcMod(abilityEntry.score || 10) : 0;
                const profBonus = characterData?.proficiency_bonus || 2;
                const isProficient = characterData?.skills?.includes?.(skill.name);
                const totalMod = mod + (isProficient ? profBonus : 0);
                const modStr = totalMod >= 0 ? `+${totalMod}` : `${totalMod}`;
                return (
                  <div key={skill.name} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '2px 6px', borderRadius: 4, fontSize: 10,
                    background: isProficient ? 'rgba(74,222,128,0.06)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isProficient ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.04)'}`,
                  }}>
                    <span style={{ color: isProficient ? '#4ade80' : 'var(--text-dim)', fontWeight: isProficient ? 600 : 400 }}>
                      {skill.name}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 10,
                      color: totalMod >= 0 ? '#4ade80' : '#f87171',
                    }}>{modStr}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Quick Saving Throws */}
      {characterAbilities && characterAbilities.length > 0 && (
        <div style={panelStyle}>
          <button
            onClick={() => setShowSavingThrows(!showSavingThrows)}
            style={{
              ...panelHeaderStyle,
              width: '100%', background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: 'var(--font-mono, monospace)',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={12} /> Saving Throws
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-mute)' }}>
              {showSavingThrows ? '\u25B2' : '\u25BC'}
            </span>
          </button>
          {showSavingThrows && (
            <div style={{ padding: '8px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px' }}>
              {ABILITIES.map(ab => {
                const entry = (characterAbilities || []).find(a => (a.ability || '').toUpperCase().startsWith(ab));
                const mod = entry ? calcMod(entry.score || 10) : 0;
                const profBonus = characterData?.proficiency_bonus || 2;
                const isProficient = characterData?.saving_throw_proficiencies?.includes?.(ab) ||
                  characterData?.save_proficiencies?.includes?.(ab);
                const totalMod = mod + (isProficient ? profBonus : 0);
                const modStr = totalMod >= 0 ? `+${totalMod}` : `${totalMod}`;
                return (
                  <div key={ab} style={{
                    textAlign: 'center', padding: '4px 2px', borderRadius: 6,
                    background: isProficient ? 'rgba(96,165,250,0.08)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isProficient ? 'rgba(96,165,250,0.2)' : 'rgba(255,255,255,0.05)'}`,
                  }}>
                    <div style={{ fontSize: 8, fontWeight: 700, color: 'var(--text-mute)', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>{ab}</div>
                    <div style={{
                      fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)',
                      color: isProficient ? '#60a5fa' : (totalMod >= 0 ? '#4ade80' : '#f87171'),
                    }}>{modStr}</div>
                    {isProficient && <div style={{ fontSize: 7, color: '#60a5fa', fontWeight: 600 }}>PROF</div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Spell Preparation Helper */}
      {characterData?.class && getSpellPrepInfo(characterData.class) && (
        <div style={panelStyle}>
          <button
            onClick={() => setShowSpellPrep(!showSpellPrep)}
            style={{
              ...panelHeaderStyle,
              width: '100%', background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: 'var(--font-mono, monospace)',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={12} /> Spell Prep
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-mute)' }}>
              {showSpellPrep ? '\u25B2' : '\u25BC'}
            </span>
          </button>
          {showSpellPrep && (() => {
            const info = getSpellPrepInfo(characterData.class);
            const abilityMap = {};
            (characterAbilities || []).forEach(a => { abilityMap[(a.ability || '').toUpperCase().slice(0, 3)] = a.score || 10; });
            const modKey = info.formula.startsWith('INT') ? 'INT' : info.formula.startsWith('WIS') ? 'WIS' : info.formula.startsWith('CHA') ? 'CHA' : null;
            const mod = modKey ? calcMod(abilityMap[modKey] || 10) : 0;
            const count = calculatePreparedCount(characterData.class, characterData.level || 1, mod);
            return (
              <div style={{ padding: '8px 12px', fontSize: 10, color: 'var(--text-dim)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#d4a843', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>{info.prepType.toUpperCase()}</div>
                <div><span style={{ color: 'var(--text-mute)' }}>Formula:</span> {info.formula}</div>
                {count > 0 && <div><span style={{ color: 'var(--text-mute)' }}>Can prepare:</span> <span style={{ color: '#4ade80', fontWeight: 700 }}>{count} spells</span></div>}
                {count === -1 && <div style={{ color: 'var(--text-mute)', fontStyle: 'italic' }}>See class table for spells known</div>}
                <div><span style={{ color: 'var(--text-mute)' }}>Change:</span> {info.changeWhen}</div>
                <div style={{ fontSize: 9, fontStyle: 'italic', color: 'rgba(212,168,67,0.7)' }}>{info.note}</div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '8px 0' }} />
                <div>
                  {PREP_TIPS.slice(0, 3).map((tip, i) => (
                    <div key={i} style={{ fontSize: 9, color: 'var(--text-mute)', padding: '1px 0' }}>{'\u2022'} {tip}</div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Healing Quick Reference */}
      {characterData?.class && ['Cleric', 'Druid', 'Bard', 'Paladin', 'Ranger'].some(c => c.toLowerCase() === (characterData.class || '').toLowerCase()) && (
        <div style={panelStyle}>
          <button
            onClick={() => setShowHealingRef(!showHealingRef)}
            style={{
              ...panelHeaderStyle,
              width: '100%', background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: 'var(--font-mono, monospace)',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Heart size={12} /> Healing Ref
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-mute)' }}>
              {showHealingRef ? '\u25B2' : '\u25BC'}
            </span>
          </button>
          {showHealingRef && (
            <div style={{ padding: '8px 12px', fontSize: 10, color: 'var(--text-dim)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#d4a843', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '2px' }}>TOP HEALING SPELLS</div>
              {HEALING_SPELLS_RANKED.filter(s => ['S', 'A'].includes(s.tier)).slice(0, 4).map(s => (
                <div key={s.spell} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '2px 6px', borderRadius: 4,
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <span style={{ color: 'var(--text)', fontWeight: 600 }}>
                    {s.spell} <span style={{ color: 'var(--text-mute)', fontWeight: 400 }}>L{s.level}</span>
                  </span>
                  <span style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ fontSize: 9, color: 'var(--text-mute)' }}>{s.action}</span>
                    <span style={{
                      fontSize: 8, fontWeight: 700, padding: '1px 4px', borderRadius: 3,
                      background: s.tier === 'S' ? 'rgba(234,179,8,0.15)' : 'rgba(74,222,128,0.1)',
                      color: s.tier === 'S' ? '#eab308' : '#4ade80',
                    }}>{s.tier}</span>
                  </span>
                </div>
              ))}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '8px 0' }} />
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#d4a843', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '2px' }}>STRATEGY</div>
                {HEALING_STRATEGY.slice(0, 3).map((tip, i) => (
                  <div key={i} style={{ fontSize: 9, color: 'var(--text-mute)', padding: '1px 0' }}>{'\u2022'} {tip}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Handouts (M-13) */}
      <div style={{ ...panelStyle, flex: '1 1 0', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={panelHeaderStyle}>
          <FileText size={12} /> Handouts ({handouts.length})
        </div>
        <div style={{
          padding: '8px 12px', overflowY: 'auto',
          flex: 1, minHeight: 0,
        }}>
          {handouts.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '12px',
              color: 'var(--text-mute)', fontSize: 11, fontStyle: 'italic',
            }}>
              <ScrollText size={28} style={{ opacity: 0.2, marginBottom: '8px' }} />
              <p style={{ margin: 0 }}>Handouts from the DM will appear here</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '6px' }}>
              {handouts.map(h => (
                <div key={h.id} style={{
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(74,222,128,0.12)',
                  overflow: 'hidden',
                }}>
                  <button
                    onClick={() => setExpandedHandout(expandedHandout === h.id ? null : h.id)}
                    style={{
                      width: '100%',
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '8px 10px', background: 'none', border: 'none',
                      cursor: 'pointer', color: 'var(--text)',
                      fontSize: '12px', fontWeight: 500,
                      fontFamily: 'var(--font-ui)', textAlign: 'left',
                    }}
                  >
                    <Eye size={11} style={{ color: '#4ade80', flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{h.title}</span>
                    {h.revealed_at && (
                      <span style={{
                        fontSize: '9px', color: 'var(--text-mute)',
                        fontFamily: 'var(--font-mono)',
                      }}>
                        {new Date(h.revealed_at * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </button>
                  {expandedHandout === h.id && h.content && (
                    <div style={{
                      padding: '8px 10px 10px',
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                      fontSize: '12px', lineHeight: 1.5,
                      color: 'var(--text-dim)',
                      whiteSpace: 'pre-wrap',
                    }}>
                      {h.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Session info */}
      <div style={panelStyle}>
        <div style={panelHeaderStyle}>
          <Heart size={12} /> Session Info
        </div>
        <div style={{ padding: '8px 12px' }}>
          <div style={{ display: 'grid', gap: '8px' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: '12px', color: 'var(--text-dim)',
            }}>
              <span>Campaign</span>
              <span style={{ color: 'var(--text)', fontWeight: 500 }}>
                {campaignName || '—'}
              </span>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: '12px', color: 'var(--text-dim)',
            }}>
              <span>Status</span>
              <span style={{
                color: sessionActive ? '#4ade80' : 'var(--text-mute)',
                fontWeight: 500,
              }}>
                {sessionActive ? 'In Session' : 'Idle'}
              </span>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: '12px', color: 'var(--text-dim)',
            }}>
              <span>Round</span>
              <span style={{ color: 'var(--text)', fontWeight: 500 }}>{round}</span>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: '12px', color: 'var(--text-dim)',
            }}>
              <span>Players</span>
              <span style={{ color: 'var(--text)', fontWeight: 500 }}>
                {connectedPlayers.length}
              </span>
            </div>
            {currentScene?.mood && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-dim)' }}>
                <span>Mood</span>
                <span style={{ color: '#c084fc', fontWeight: 500, textTransform: 'capitalize' }}>{currentScene.mood}</span>
              </div>
            )}
            {currentScene?.description && (
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', lineHeight: 1.5, padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {currentScene.description}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Campaign World (CampaignOverview) */}
      {campaignId && (
        <div style={panelStyle}>
          <button
            onClick={() => setShowCampaignWorld(!showCampaignWorld)}
            style={{
              ...panelHeaderStyle,
              width: '100%', background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: 'var(--font-mono, monospace)',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={12} /> Campaign World
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-mute)' }}>
              {showCampaignWorld ? '\u25B2' : '\u25BC'}
            </span>
          </button>
          {showCampaignWorld && (
            <div style={{ padding: '0' }}>
              <CampaignOverview campaignId={campaignId} currentScene={currentScene} />
            </div>
          )}
        </div>
      )}

      {/* Quest Journal */}
      {activeQuests.length > 0 && (
        <div style={panelStyle}>
          <div style={panelHeaderStyle}>
            <BookOpen size={12} /> Quests ({activeQuests.length})
          </div>
          <div style={{ padding: '8px 12px', maxHeight: '180px', overflowY: 'auto' }}>
            {activeQuests.map(q => {
              const statusConfig = QUEST_STATUS_COLORS[q.status] || QUEST_STATUS_COLORS.active;
              const priorityConfig = q.priority ? (QUEST_PRIORITY[q.priority] || QUEST_PRIORITY.medium) : null;
              const objectives = q.objectives || q.steps || [];
              const completedCount = objectives.filter(o => o.completed || o.done).length;
              const totalCount = objectives.length;
              return (
                <div key={q.id} style={{ padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                    {/* Priority indicator dot */}
                    <span style={{
                      width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0,
                      background: priorityConfig ? priorityConfig.color : statusConfig.color,
                      boxShadow: priorityConfig && priorityConfig.color === '#ef4444' ? '0 0 4px rgba(239,68,68,0.4)' : 'none',
                    }} />
                    <span style={{ color: 'var(--text)', flex: 1, fontWeight: 500 }}>{q.title}</span>
                    {/* Status badge */}
                    <span style={{
                      fontSize: '8px', fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      padding: '1px 5px', borderRadius: '3px',
                      color: statusConfig.color,
                      background: `${statusConfig.color}15`,
                      border: `1px solid ${statusConfig.color}30`,
                    }}>
                      {statusConfig.label}
                    </span>
                  </div>
                  {/* Progress bar for objectives */}
                  {totalCount > 0 && (
                    <div style={{ marginTop: '3px', marginLeft: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        flex: 1, height: '3px', borderRadius: '2px',
                        background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%', borderRadius: '2px',
                          width: `${(completedCount / totalCount) * 100}%`,
                          background: completedCount === totalCount ? '#4ade80' : '#c9a84c',
                          transition: 'width 0.3s',
                        }} />
                      </div>
                      <span style={{ fontSize: '8px', color: 'var(--text-mute)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                        {completedCount}/{totalCount}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Discovered NPCs */}
      {discoveredNpcs.length > 0 && (
        <div style={panelStyle}>
          <div style={panelHeaderStyle}>
            <User size={12} /> NPCs ({discoveredNpcs.length})
          </div>
          <div style={{ padding: '8px 12px', maxHeight: '160px', overflowY: 'auto' }}>
            {discoveredNpcs.map(n => {
              const relLevel = n.relationship || n.relation || 'neutral';
              const relConfig = NPC_RELATIONSHIP_LEVELS[relLevel] || NPC_RELATIONSHIP_LEVELS.neutral;
              return (
                <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 0', fontSize: '11px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <span style={{ color: 'var(--text)', fontWeight: 500 }}>{n.name}</span>
                  {n.role && <span style={{ fontSize: '9px', color: 'var(--text-mute)' }}>({n.role})</span>}
                  {/* Relationship badge */}
                  <span style={{
                    fontSize: '8px', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.04em', marginLeft: 'auto',
                    padding: '1px 5px', borderRadius: '3px',
                    color: relConfig.color,
                    background: `${relConfig.color}15`,
                    border: `1px solid ${relConfig.color}30`,
                    flexShrink: 0,
                  }}>
                    {relConfig.label}
                  </span>
                  {/* Location */}
                  {(n.location || n.last_location) && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '9px', color: 'var(--text-mute)', flexShrink: 0 }}>
                      <MapPin size={8} />
                      {n.location || n.last_location}
                    </span>
                  )}
                  {/* Last interaction */}
                  {(n.lastInteraction || n.last_interaction) && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '8px', color: 'var(--text-mute)', flexShrink: 0 }}>
                      <Clock size={7} />
                      {typeof (n.lastInteraction || n.last_interaction) === 'number'
                        ? new Date((n.lastInteraction || n.last_interaction) * 1000).toLocaleDateString([], { month: 'short', day: 'numeric' })
                        : (n.lastInteraction || n.last_interaction)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Player Actions */}
      <div style={panelStyle}>
        <div style={panelHeaderStyle}>
          <Hand size={12} /> Player Actions
        </div>
        <div style={{ padding: '8px 12px', display: 'grid', gap: '6px' }}>
          {/* Use Item */}
          <div>
            <button
              onClick={() => setUseItemOpen(!useItemOpen)}
              disabled={!connected}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                padding: '5px 8px', borderRadius: '6px',
                background: useItemOpen ? 'rgba(167,139,250,0.1)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${useItemOpen ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.06)'}`,
                color: connected ? 'var(--text-dim)' : 'var(--text-mute)',
                fontSize: '11px', fontWeight: 500, cursor: connected ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-ui)', textAlign: 'left',
                opacity: connected ? 1 : 0.4, transition: 'all 0.15s',
              }}
            >
              <Shield size={12} style={{ color: '#a78bfa', flexShrink: 0 }} />
              Use Item
            </button>
            {useItemOpen && (
              <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                <input
                  type="text"
                  value={useItemName}
                  onChange={e => setUseItemName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleUseItem(); }}
                  placeholder="Item name..."
                  autoFocus
                  style={{
                    flex: 1, padding: '4px 8px', borderRadius: 6,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(167,139,250,0.15)',
                    color: 'var(--text)', fontSize: 12,
                    fontFamily: 'var(--font-ui)', outline: 'none',
                  }}
                />
                <button
                  onClick={handleUseItem}
                  disabled={!useItemName.trim()}
                  style={{
                    background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.25)',
                    borderRadius: 6, padding: '6px 12px', cursor: useItemName.trim() ? 'pointer' : 'not-allowed',
                    color: '#a78bfa', display: 'flex', alignItems: 'center',
                    opacity: useItemName.trim() ? 1 : 0.4, fontSize: 11, fontWeight: 600, transition: 'all 0.15s',
                  }}
                >
                  <Send size={10} />
                </button>
              </div>
            )}
          </div>

          {/* Request Rest */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={handleRequestRest}
              disabled={!connected}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', gap: '8px',
                padding: '5px 8px', borderRadius: '6px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: connected ? 'var(--text-dim)' : 'var(--text-mute)',
                fontSize: '11px', fontWeight: 500, cursor: connected ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-ui)', textAlign: 'left',
                opacity: connected ? 1 : 0.4, transition: 'all 0.15s',
              }}
            >
              <Moon size={12} style={{ color: '#818cf8', flexShrink: 0 }} />
              Request Rest
            </button>
            <button
              onClick={() => setRestType(restType === 'short' ? 'long' : 'short')}
              disabled={!connected}
              style={{
                padding: '3px 8px', borderRadius: '4px', flexShrink: 0,
                background: restType === 'long' ? 'rgba(129,140,248,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${restType === 'long' ? 'rgba(129,140,248,0.25)' : 'rgba(255,255,255,0.08)'}`,
                color: restType === 'long' ? '#818cf8' : 'var(--text-mute)',
                fontSize: '9px', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.05em', cursor: connected ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-ui)', opacity: connected ? 1 : 0.4,
                transition: 'all 0.15s',
              }}
            >
              {restType === 'short' ? 'Short' : 'Long'}
            </button>
          </div>

          {/* Rest Checklist */}
          <div>
            <button
              onClick={() => setShowRestChecklist(!showRestChecklist)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                padding: '5px 8px', borderRadius: '6px',
                background: showRestChecklist ? 'rgba(129,140,248,0.08)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${showRestChecklist ? 'rgba(129,140,248,0.15)' : 'rgba(255,255,255,0.06)'}`,
                color: 'var(--text-dim)',
                fontSize: '11px', fontWeight: 500, cursor: 'pointer',
                fontFamily: 'var(--font-ui)', textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              <BookOpen size={12} style={{ color: '#818cf8', flexShrink: 0 }} />
              Rest Checklist
              <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--text-mute)' }}>
                {showRestChecklist ? '\u25B2' : '\u25BC'}
              </span>
            </button>
            {showRestChecklist && (
              <div style={{
                marginTop: '4px', padding: '8px',
                borderRadius: '6px', background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(129,140,248,0.1)',
              }}>
                {/* Short/Long toggle */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                  {['short', 'long'].map(t => (
                    <button
                      key={t}
                      onClick={() => { setRestChecklistType(t); setRestChecked({}); }}
                      style={{
                        flex: 1, padding: '3px 6px', borderRadius: '4px',
                        background: restChecklistType === t ? 'rgba(129,140,248,0.15)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${restChecklistType === t ? 'rgba(129,140,248,0.3)' : 'rgba(255,255,255,0.06)'}`,
                        color: restChecklistType === t ? '#818cf8' : 'var(--text-mute)',
                        fontSize: '9px', fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: '0.05em', cursor: 'pointer',
                        fontFamily: 'var(--font-ui)', transition: 'all 0.15s',
                      }}
                    >
                      {t} Rest
                    </button>
                  ))}
                </div>
                {/* Checklist items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {getRestChecklist(restChecklistType, characterData?.class || '').map(item => (
                    <label
                      key={item.id}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: '6px',
                        padding: '4px 6px', borderRadius: '4px', cursor: 'pointer',
                        background: restChecked[item.id] ? 'rgba(74,222,128,0.06)' : 'transparent',
                        transition: 'background 0.15s',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={!!restChecked[item.id]}
                        onChange={() => setRestChecked(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                        style={{ marginTop: '2px', accentColor: '#818cf8', flexShrink: 0 }}
                      />
                      <div>
                        <div style={{
                          fontSize: '10px', fontWeight: 600,
                          color: restChecked[item.id] ? 'var(--text-mute)' : 'var(--text-dim)',
                          textDecoration: restChecked[item.id] ? 'line-through' : 'none',
                          transition: 'all 0.15s',
                        }}>
                          {item.label}
                          {item.auto && <span style={{ color: '#4ade80', marginLeft: '4px', fontSize: '8px', fontWeight: 700 }}>AUTO</span>}
                          {item.optional && <span style={{ color: '#fbbf24', marginLeft: '4px', fontSize: '8px', fontWeight: 700 }}>OPT</span>}
                        </div>
                        <div style={{ fontSize: '9px', color: 'var(--text-mute)', lineHeight: 1.4, marginTop: '1px' }}>
                          {item.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Whisper to DM */}
          <div>
            <button
              onClick={() => setWhisperOpen(!whisperOpen)}
              disabled={!connected}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                padding: '5px 8px', borderRadius: '6px',
                background: whisperOpen ? 'rgba(251,191,36,0.08)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${whisperOpen ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.06)'}`,
                color: connected ? 'var(--text-dim)' : 'var(--text-mute)',
                fontSize: '11px', fontWeight: 500, cursor: connected ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-ui)', textAlign: 'left',
                opacity: connected ? 1 : 0.4, transition: 'all 0.15s',
              }}
            >
              <MessageCircle size={12} style={{ color: '#fbbf24', flexShrink: 0 }} />
              Whisper to DM
            </button>
            {whisperOpen && (
              <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                <input
                  type="text"
                  value={whisperText}
                  onChange={e => setWhisperText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleWhisperToDm(); }}
                  placeholder="Private message..."
                  autoFocus
                  style={{
                    flex: 1, padding: '4px 8px', borderRadius: 6,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(251,191,36,0.15)',
                    color: 'var(--text)', fontSize: 12,
                    fontFamily: 'var(--font-ui)', outline: 'none',
                  }}
                />
                <button
                  onClick={handleWhisperToDm}
                  disabled={!whisperText.trim()}
                  style={{
                    background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)',
                    borderRadius: 6, padding: '6px 12px', cursor: whisperText.trim() ? 'pointer' : 'not-allowed',
                    color: '#fbbf24', display: 'flex', alignItems: 'center',
                    opacity: whisperText.trim() ? 1 : 0.4, fontSize: 11, fontWeight: 600, transition: 'all 0.15s',
                  }}
                >
                  <Send size={10} />
                </button>
              </div>
            )}
          </div>

          {/* Suggestion to DM */}
          <div style={{ display: 'flex', gap: '4px' }}>
            <input
              type="text"
              value={suggestionInput}
              onChange={e => setSuggestionInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSendSuggestion(); }}
              placeholder={connected ? 'Suggest to DM...' : 'Connect first'}
              disabled={!connected || suggestionSending}
              style={{
                flex: 1, padding: '4px 8px', borderRadius: 6,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(74,222,128,0.12)',
                color: 'var(--text)', fontSize: 12,
                fontFamily: 'var(--font-ui)', outline: 'none',
              }}
            />
            <button
              onClick={handleSendSuggestion}
              disabled={!connected || !suggestionInput.trim() || suggestionSending}
              title="Send suggestion"
              style={{
                background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)',
                borderRadius: 6, padding: '6px 12px', cursor: connected && suggestionInput.trim() ? 'pointer' : 'not-allowed',
                color: '#4ade80', display: 'flex', alignItems: 'center',
                opacity: connected && suggestionInput.trim() ? 1 : 0.4, fontSize: 11, fontWeight: 600, transition: 'all 0.15s',
              }}
            >
              <Compass size={11} />
            </button>
          </div>
        </div>
      </div>

      {/* Session Notes */}
      <div style={panelStyle}>
        <div style={panelHeaderStyle}>
          <Edit3 size={12} /> Quick Note
        </div>
        <div style={{ padding: '8px 12px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <textarea
              value={sessionNote}
              onChange={e => setSessionNote(e.target.value)}
              onBlur={handleNoteBlur}
              placeholder="Jot a session note... (auto-saves on blur)"
              rows={2}
              style={{
                flex: 1, padding: '4px 8px', borderRadius: 6,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text)', fontSize: 12,
                fontFamily: 'var(--font-ui)', outline: 'none',
                resize: 'vertical', minHeight: '32px',
              }}
              onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSaveNote(); }}
            />
            <button onClick={handleSaveNote} disabled={!sessionNote.trim()} title="Save to journal (Ctrl+Enter)"
              style={{
                background: sessionNote.trim() ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${sessionNote.trim() ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: 6, padding: '6px 12px', cursor: sessionNote.trim() ? 'pointer' : 'not-allowed',
                color: sessionNote.trim() ? '#4ade80' : 'var(--text-mute)', display: 'flex', alignItems: 'center',
                alignSelf: 'flex-end', opacity: sessionNote.trim() ? 1 : 0.4, fontSize: 11, fontWeight: 600, transition: 'all 0.15s',
              }}>
              <FileText size={11} />
            </button>
          </div>
        </div>

        {/* Saved Notes */}
        {savedNotes && savedNotes.length > 0 && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button
              onClick={() => setShowSavedNotes(!showSavedNotes)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '6px 12px', background: 'none', border: 'none',
                cursor: 'pointer', color: 'var(--text-mute)', fontSize: '10px', fontWeight: 600,
                fontFamily: 'var(--font-ui)',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={10} /> Saved Notes ({savedNotes.length})
              </span>
              {showSavedNotes ? <ChevronUp size={9} /> : <ChevronDown size={9} />}
            </button>
            {showSavedNotes && (
              <div style={{ padding: '4px 12px 8px', maxHeight: '160px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {savedNotes.slice(0, 20).map(note => (
                  <div key={note.id} style={{
                    padding: '6px 8px', borderRadius: '6px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                      <span style={{ fontSize: '9px', color: 'var(--text-mute)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={8} />
                        {note.created_at ? new Date(note.created_at).toLocaleString([], {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                        }) : note.title || 'Note'}
                      </span>
                      {onDeleteNote && (
                        <button
                          onClick={() => onDeleteNote(note.id)}
                          title="Delete note"
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: 'var(--text-mute)', padding: '2px', display: 'flex',
                            opacity: 0.4, transition: 'opacity 0.15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = '#f87171'; }}
                          onMouseLeave={e => { e.currentTarget.style.opacity = '0.4'; e.currentTarget.style.color = 'var(--text-mute)'; }}
                        >
                          <Trash2 size={9} />
                        </button>
                      )}
                    </div>
                    <div style={{
                      fontSize: '11px', color: 'var(--text-dim)', lineHeight: 1.4,
                      whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    }}>
                      {note.body?.slice(0, 200)}{(note.body?.length || 0) > 200 ? '...' : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Condition Cures */}
      <div style={panelStyle}>
        <button
          onClick={() => setShowConditionCures(!showConditionCures)}
          style={{
            ...panelHeaderStyle,
            width: '100%', background: 'none', border: 'none',
            cursor: 'pointer', fontFamily: 'var(--font-mono, monospace)',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={12} /> Condition Cures
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-mute)' }}>
            {showConditionCures ? '\u25B2' : '\u25BC'}
          </span>
        </button>
        {showConditionCures && (
          <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <input
              type="text"
              value={conditionQuery}
              onChange={e => setConditionQuery(e.target.value)}
              placeholder="Search conditions..."
              style={{
                width: '100%', padding: '4px 8px', borderRadius: 6,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text)', fontSize: 12,
                fontFamily: 'var(--font-ui)', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '260px', overflowY: 'auto' }}>
              {searchConditions(conditionQuery).length === 0 ? (
                <div style={{ fontSize: 11, color: 'var(--text-mute)', fontStyle: 'italic', textAlign: 'center', padding: '12px' }}>
                  No matching conditions
                </div>
              ) : (
                searchConditions(conditionQuery).map(c => (
                  <div key={c.condition} style={{
                    padding: '6px 8px', borderRadius: '6px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <div style={{
                      fontSize: '11px', fontWeight: 700, color: '#f59e0b',
                      marginBottom: '4px', letterSpacing: '0.02em',
                    }}>
                      {c.condition}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '4px' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#4ade80', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                        Cures
                      </div>
                      {c.cures.map((cure, i) => (
                        <div key={i} style={{ fontSize: '10px', color: 'var(--text-dim)', paddingLeft: '6px' }}>
                          {'\u2022'} {cure}
                        </div>
                      ))}
                    </div>
                    <div style={{
                      fontSize: '9px', color: 'var(--text-mute)', fontStyle: 'italic',
                      borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '3px',
                    }}>
                      {c.selfHelp}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Party Status */}
      <div style={panelStyle}>
        <button
          onClick={() => setShowPartyStatus(!showPartyStatus)}
          style={{
            ...panelHeaderStyle,
            width: '100%', background: 'none', border: 'none',
            cursor: 'pointer', fontFamily: 'var(--font-mono, monospace)',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={12} /> Party Status
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-mute)' }}>
            {showPartyStatus ? '\u25B2' : '\u25BC'}
          </span>
        </button>
        {showPartyStatus && (
          <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {connectedPlayers.length === 0 ? (
              <div style={{ fontSize: 11, color: 'var(--text-mute)', fontStyle: 'italic', textAlign: 'center', padding: '12px' }}>
                No players connected
              </div>
            ) : (
              connectedPlayers.map((player, idx) => {
                const status = getPartyMemberStatus(
                  player.current_hp ?? player.hp ?? 0,
                  player.max_hp ?? player.maxHp ?? 1
                );
                return (
                  <div key={player.id || player.name || idx} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '5px 8px', borderRadius: '6px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: status.color, flexShrink: 0,
                      boxShadow: `0 0 6px ${status.color}40`,
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '11px', fontWeight: 600, color: 'var(--text)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {player.character_name || player.name || 'Unknown'}
                      </div>
                      <div style={{ fontSize: '9px', color: status.color, fontWeight: 500 }}>
                        {status.label}
                        {player.current_hp != null && player.max_hp != null && (
                          <span style={{ color: 'var(--text-mute)', marginLeft: '4px' }}>
                            {player.current_hp}/{player.max_hp} HP
                          </span>
                        )}
                      </div>
                    </div>
                    {player.class && (
                      <div style={{
                        fontSize: '8px', color: 'var(--text-mute)', fontWeight: 600,
                        textTransform: 'uppercase', letterSpacing: '0.04em',
                      }}>
                        {player.class}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Chat + Action Request */}
      <div style={panelStyle}>
        <div style={panelHeaderStyle}>
          <MessageCircle size={12} /> Chat
        </div>
        <div style={{ padding: '8px 12px' }}>
          {/* Recent messages */}
          <div style={{
            maxHeight: '80px', overflowY: 'auto', marginBottom: '6px',
            display: 'flex', flexDirection: 'column', gap: '2px',
          }}>
            {chatMessages.length === 0 ? (
              <span style={{ fontSize: 11, color: 'var(--text-mute)', fontStyle: 'italic', textAlign: 'center', padding: '12px', display: 'block' }}>
                No messages yet
              </span>
            ) : (
              chatMessages.slice(-10).map((msg, i) => (
                <div key={i} style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                  <span style={{ fontWeight: 600, color: msg.sender === 'DM' ? '#c084fc' : '#4ade80' }}>
                    {msg.sender}:
                  </span>{' '}
                  {msg.message}
                </div>
              ))
            )}
          </div>
          {/* Chat input */}
          <div style={{ display: 'flex', gap: '4px' }}>
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSendChat(); }}
              placeholder={connected ? 'Message...' : 'Connect first'}
              disabled={!connected}
              style={{
                flex: 1, padding: '4px 8px', borderRadius: 6,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text)', fontSize: 12,
                fontFamily: 'var(--font-ui)', outline: 'none',
              }}
            />
            <button
              onClick={handleSendChat}
              disabled={!connected}
              style={{
                background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)',
                borderRadius: 6, padding: '6px 12px', cursor: connected ? 'pointer' : 'not-allowed',
                color: '#a78bfa', display: 'flex', alignItems: 'center',
                opacity: connected ? 1 : 0.4, fontSize: 11, fontWeight: 600, transition: 'all 0.15s',
              }}
            >
              <Send size={11} />
            </button>
          </div>
          {/* Action request */}
          <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
            <input
              type="text"
              value={actionInput}
              onChange={e => setActionInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleRequestAction(); }}
              placeholder={connected ? 'Request action from DM...' : 'Connect first'}
              disabled={!connected}
              style={{
                flex: 1, padding: '4px 8px', borderRadius: 6,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(251,191,36,0.12)',
                color: 'var(--text)', fontSize: 12,
                fontFamily: 'var(--font-ui)', outline: 'none',
              }}
            />
            <button
              onClick={handleRequestAction}
              disabled={!connected}
              title="Request action"
              style={{
                background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)',
                borderRadius: 6, padding: '6px 12px', cursor: connected ? 'pointer' : 'not-allowed',
                color: '#fbbf24', display: 'flex', alignItems: 'center',
                opacity: connected ? 1 : 0.4, fontSize: 11, fontWeight: 600, transition: 'all 0.15s',
              }}
            >
              <Hand size={11} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
})
