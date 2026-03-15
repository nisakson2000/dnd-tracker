import {
  ScrollText, Eye, FileText, Heart,
  Send, MessageCircle, Hand, Moon,
  BookOpen, Compass, User, Shield,
  Edit3,
} from 'lucide-react';
import CampaignOverview from '../CampaignOverview';

export default function PlayerSessionSidebar({
  panelStyle,
  panelHeaderStyle,
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
  // Chat
  chatMessages,
  chatInput,
  setChatInput,
  handleSendChat,
  actionInput,
  setActionInput,
  handleRequestAction,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '100%' }}>
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
              placeholder="Jot a session note..."
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
}
