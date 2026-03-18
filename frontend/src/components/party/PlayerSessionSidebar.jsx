import { memo, useState, useCallback } from 'react';
import {
  ScrollText, Eye, FileText, Heart,
  Send, MessageCircle, Hand, Moon,
  BookOpen, Compass, User, Shield,
  Edit3, ChevronDown, ChevronUp, Activity, Zap, Footprints,
  Clock, Trash2,
} from 'lucide-react';
import CampaignOverview from '../CampaignOverview';

function AbilityScoreGrid({ abilities }) {
  const ABILITY_ORDER = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
  const abilityMap = {};
  (abilities || []).forEach(a => {
    const key = (a.ability || '').toUpperCase().slice(0, 3);
    abilityMap[key] = a.score || 10;
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px' }}>
      {ABILITY_ORDER.map(ab => {
        const score = abilityMap[ab] || 10;
        const mod = Math.floor((score - 10) / 2);
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
            <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                    const mod = dexEntry ? Math.floor(((dexEntry.score || 10) - 10) / 2) : 0;
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
                  <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                    Ability Scores
                  </div>
                  <AbilityScoreGrid abilities={characterAbilities} />
                </div>
              )}

              {/* Active Conditions */}
              {characterConditions && characterConditions.length > 0 && (
                <div>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
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
              textAlign: 'center', padding: '24px 8px',
              color: 'var(--text-mute)', fontSize: '12px',
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
                      borderTop: '1px solid rgba(255,255,255,0.04)',
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
        <div style={{ padding: '12px' }}>
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
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', lineHeight: 1.5, padding: '6px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
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
          <div style={{ padding: '8px 12px', maxHeight: '120px', overflowY: 'auto' }}>
            {activeQuests.map(q => (
              <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '3px 0', fontSize: '11px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: q.status === 'completed' ? '#4ade80' : '#c9a84c', flexShrink: 0 }} />
                <span style={{ color: 'var(--text)', flex: 1 }}>{q.title}</span>
                <span style={{ fontSize: '9px', color: 'var(--text-mute)', textTransform: 'capitalize' }}>{q.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Discovered NPCs */}
      {discoveredNpcs.length > 0 && (
        <div style={panelStyle}>
          <div style={panelHeaderStyle}>
            <User size={12} /> NPCs ({discoveredNpcs.length})
          </div>
          <div style={{ padding: '8px 12px', maxHeight: '100px', overflowY: 'auto' }}>
            {discoveredNpcs.map(n => (
              <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '2px 0', fontSize: '11px' }}>
                <span style={{ color: 'var(--text)' }}>{n.name}</span>
                {n.role && <span style={{ fontSize: '9px', color: 'var(--text-mute)' }}>({n.role})</span>}
              </div>
            ))}
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
                    flex: 1, padding: '3px 8px', borderRadius: '5px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(167,139,250,0.15)',
                    color: 'var(--text)', fontSize: '11px',
                    fontFamily: 'var(--font-ui)', outline: 'none',
                  }}
                />
                <button
                  onClick={handleUseItem}
                  disabled={!useItemName.trim()}
                  style={{
                    background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.25)',
                    borderRadius: '5px', padding: '3px 8px', cursor: useItemName.trim() ? 'pointer' : 'not-allowed',
                    color: '#a78bfa', display: 'flex', alignItems: 'center',
                    opacity: useItemName.trim() ? 1 : 0.4,
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
                    flex: 1, padding: '3px 8px', borderRadius: '5px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(251,191,36,0.15)',
                    color: 'var(--text)', fontSize: '11px',
                    fontFamily: 'var(--font-ui)', outline: 'none',
                  }}
                />
                <button
                  onClick={handleWhisperToDm}
                  disabled={!whisperText.trim()}
                  style={{
                    background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)',
                    borderRadius: '5px', padding: '3px 8px', cursor: whisperText.trim() ? 'pointer' : 'not-allowed',
                    color: '#fbbf24', display: 'flex', alignItems: 'center',
                    opacity: whisperText.trim() ? 1 : 0.4,
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
                flex: 1, padding: '4px 8px', borderRadius: '6px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(74,222,128,0.12)',
                color: 'var(--text)', fontSize: '11px',
                fontFamily: 'var(--font-ui)', outline: 'none',
              }}
            />
            <button
              onClick={handleSendSuggestion}
              disabled={!connected || !suggestionInput.trim() || suggestionSending}
              title="Send suggestion"
              style={{
                background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)',
                borderRadius: '6px', padding: '4px 8px', cursor: connected && suggestionInput.trim() ? 'pointer' : 'not-allowed',
                color: '#4ade80', display: 'flex', alignItems: 'center',
                opacity: connected && suggestionInput.trim() ? 1 : 0.4,
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
                flex: 1, padding: '4px 8px', borderRadius: '6px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text)', fontSize: '11px',
                fontFamily: 'var(--font-ui)', outline: 'none',
                resize: 'vertical', minHeight: '32px',
              }}
              onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSaveNote(); }}
            />
            <button onClick={handleSaveNote} disabled={!sessionNote.trim()} title="Save to journal (Ctrl+Enter)"
              style={{
                background: sessionNote.trim() ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${sessionNote.trim() ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: '6px', padding: '4px 8px', cursor: sessionNote.trim() ? 'pointer' : 'not-allowed',
                color: sessionNote.trim() ? '#4ade80' : 'var(--text-mute)', display: 'flex', alignItems: 'center',
                alignSelf: 'flex-end', opacity: sessionNote.trim() ? 1 : 0.4,
              }}>
              <FileText size={11} />
            </button>
          </div>
        </div>

        {/* Saved Notes */}
        {savedNotes && savedNotes.length > 0 && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
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
              <span style={{ fontSize: '11px', color: 'var(--text-mute)', fontStyle: 'italic' }}>
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
                flex: 1, padding: '4px 8px', borderRadius: '6px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text)', fontSize: '11px',
                fontFamily: 'var(--font-ui)', outline: 'none',
              }}
            />
            <button
              onClick={handleSendChat}
              disabled={!connected}
              style={{
                background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)',
                borderRadius: '6px', padding: '4px 8px', cursor: connected ? 'pointer' : 'not-allowed',
                color: '#a78bfa', display: 'flex', alignItems: 'center',
                opacity: connected ? 1 : 0.4,
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
                flex: 1, padding: '4px 8px', borderRadius: '6px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(251,191,36,0.12)',
                color: 'var(--text)', fontSize: '11px',
                fontFamily: 'var(--font-ui)', outline: 'none',
              }}
            />
            <button
              onClick={handleRequestAction}
              disabled={!connected}
              title="Request action"
              style={{
                background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)',
                borderRadius: '6px', padding: '4px 8px', cursor: connected ? 'pointer' : 'not-allowed',
                color: '#fbbf24', display: 'flex', alignItems: 'center',
                opacity: connected ? 1 : 0.4,
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
