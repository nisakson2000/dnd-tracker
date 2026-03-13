import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wifi, WifiOff, Swords, Dice5, ScrollText,
  Image, Shield, Heart, User, LogOut, FileText, Eye,
  Send, MessageCircle, Hand,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { useSession } from '../contexts/SessionContext';
import CampaignOverview from '../components/CampaignOverview';

export default function PlayerSession() {
  const navigate = useNavigate();
  const {
    campaignId, campaignName, sessionActive,
    initiative, round, currentTurn, currentScene,
    connectedPlayers, chatMessages, dispatch,
    sendToDm, broadcastEvent, playerUuid,
  } = useSession();

  const [diceResult, setDiceResult] = useState(null);
  const [broadcasting, setBroadcasting] = useState(true);
  const [connected, setConnected] = useState(false);

  // M-13: Handouts feed
  const [handouts, setHandouts] = useState([]);
  const [expandedHandout, setExpandedHandout] = useState(null);

  // Chat & action request
  const [chatInput, setChatInput] = useState('');
  const [actionInput, setActionInput] = useState('');

  const handleSendChat = async () => {
    if (!chatInput.trim() || !connected) return;
    const msg = chatInput.trim();
    setChatInput('');
    const ts = Date.now();
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { sender: 'You', message: msg, timestamp: ts } });
    await sendToDm({ type: 'ChatMessage', sender: 'Player', message: msg, timestamp: ts });
  };

  const handleRequestAction = async () => {
    if (!actionInput.trim() || !connected) return;
    const desc = actionInput.trim();
    setActionInput('');
    const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    toast('Action request sent to DM', { icon: '\u270B', duration: 3000 });
    await sendToDm({
      type: 'ActionRequest', request_id: requestId,
      player_uuid: playerUuid || '', action_type: 'custom', description: desc,
    });
  };

  const loadHandouts = useCallback(async () => {
    try {
      const list = await invoke('list_handouts');
      // Only show revealed handouts to players
      setHandouts(list.filter(h => h.revealed));
    } catch {
      // Not connected to a campaign — that's fine
    }
  }, []);

  // Listen for ALL game events from DM
  useEffect(() => {
    let cancelled = false;
    let unlisten;
    loadHandouts();

    (async () => {
      try {
        unlisten = await listen('session-game-event', (event) => {
          if (cancelled) return;
          const gameEvent = event.payload?.event || event.payload;
          if (!gameEvent?.type) return;

          switch (gameEvent.type) {
            case 'HandoutRevealed':
              loadHandouts();
              toast('New handout from the DM!', { icon: '📜', duration: 4000 });
              break;
            case 'SceneAdvance':
              dispatch({ type: 'SET_SCENE', payload: { id: gameEvent.scene_id, name: gameEvent.scene_name } });
              toast(`Scene: ${gameEvent.scene_name || 'New scene'}`, { icon: '🗺️', duration: 3000 });
              break;
            case 'TurnAdvance':
              if (gameEvent.round != null) {
                dispatch({ type: 'SET_TURN', payload: { round: gameEvent.round, combatant_id: gameEvent.combatant_id } });
              } else {
                dispatch({ type: 'NEXT_TURN' });
              }
              toast('Next turn!', { icon: '⚔️', duration: 2000 });
              break;
            case 'EncounterStart': {
              dispatch({ type: 'SET_ENCOUNTER', payload: gameEvent });
              const initList = gameEvent.initiative
                || (gameEvent.initiative_json ? JSON.parse(gameEvent.initiative_json) : null);
              if (initList) dispatch({ type: 'SET_INITIATIVE', payload: initList });
              toast('Combat started!', { icon: '⚔️', duration: 3000 });
              break;
            }
            case 'EncounterEnd':
              dispatch({ type: 'SET_ENCOUNTER', payload: null });
              toast('Combat ended', { icon: '🛡️', duration: 3000 });
              break;
            case 'HpDelta':
              toast(`HP ${gameEvent.delta > 0 ? '+' : ''}${gameEvent.delta}: ${gameEvent.reason || ''}`, {
                icon: gameEvent.delta > 0 ? '💚' : '💔', duration: 3000,
              });
              break;
            case 'ConditionApplied':
              toast(`Condition: ${gameEvent.condition || 'effect'} applied`, { icon: '⚠️', duration: 3000 });
              break;
            case 'ConditionRemoved':
              toast(`Condition: ${gameEvent.condition || 'effect'} removed`, { icon: '✅', duration: 3000 });
              break;
            case 'RestCompleted':
              toast(`${gameEvent.rest_type === 'long' ? 'Long' : 'Short'} rest completed!`, {
                icon: gameEvent.rest_type === 'long' ? '🌙' : '☀️', duration: 4000,
              });
              // Request a full state refresh so player UI reflects updated HP/spell slots
              sendToDm({ type: 'RequestStateRefresh', player_uuid: playerUuid || '' }).catch(() => {});
              break;
            case 'XpAwarded':
              // Only show XP toast if this player is in the recipient list (or no filter specified)
              if (gameEvent.player_ids && Array.isArray(gameEvent.player_ids) && playerUuid && !gameEvent.player_ids.includes(playerUuid)) {
                break;
              }
              toast(`Gained ${gameEvent.amount || 0} XP! ${gameEvent.reason || ''}`, { icon: '⭐', duration: 5000 });
              break;
            case 'InspirationAwarded':
              // Only show inspiration toast if it's targeted at this player
              if (gameEvent.player_id && playerUuid && gameEvent.player_id !== playerUuid) {
                break;
              }
              toast(gameEvent.inspired ? 'You have inspiration!' : 'Inspiration removed', {
                icon: gameEvent.inspired ? '✨' : '💫', duration: 3000,
              });
              break;
            case 'QuestFlagSet':
              toast(`Quest update: ${gameEvent.flag || 'objective changed'}`, { icon: '📋', duration: 4000 });
              break;
            case 'MonsterKilled':
              toast(`${gameEvent.monster_name || 'Monster'} has been slain!`, { icon: '\u2620\uFE0F', duration: 4000 });
              // Remove the killed monster from the initiative tracker
              if (gameEvent.monster_id) {
                dispatch({
                  type: 'SET_INITIATIVE',
                  payload: initiative.filter(entry => entry.id !== gameEvent.monster_id),
                });
              }
              break;
            case 'LevelUp':
              toast(`Level up! ${gameEvent.player_name || 'Player'} is now level ${gameEvent.new_level}!`, {
                icon: '\u2B50', duration: 6000,
                style: { background: '#1a1520', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.4)', fontWeight: 600 },
              });
              break;
            case 'ActionApproved':
              toast('Your action was approved!', {
                icon: '\u2705', duration: 4000,
                style: { background: '#064e3b', color: '#a7f3d0', border: '1px solid rgba(52,211,153,0.4)' },
              });
              break;
            case 'ActionDenied':
              toast(`Action denied: ${gameEvent.reason || 'Not allowed'}`, {
                icon: '\u274C', duration: 5000,
                style: { background: '#450a0a', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.4)' },
              });
              break;
            case 'ChatMessage':
              dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { sender: gameEvent.sender || 'DM', message: gameEvent.message, timestamp: gameEvent.timestamp } });
              if (gameEvent.sender !== 'Player') {
                toast(`${gameEvent.sender || 'DM'}: ${gameEvent.message}`, { icon: '\uD83D\uDCAC', duration: 4000 });
              }
              break;
            case 'ConcentrationUpdate':
              toast(gameEvent.spell ? `Concentrating on ${gameEvent.spell}` : 'Concentration dropped', {
                icon: '\uD83C\uDFAF', duration: 3000,
              });
              break;
            case 'SessionEnd':
              toast('The DM has ended the session', { icon: '🏁', duration: 6000 });
              dispatch({ type: 'END_SESSION' });
              break;
            case 'FullStateSnapshot': {
              setConnected(true);
              const snap = gameEvent.state || gameEvent;
              dispatch({ type: 'START_SESSION', payload: { sessionId: snap.session_id || 'live' } });
              if (snap.campaign_name) {
                dispatch({ type: 'SET_CAMPAIGN', payload: { id: gameEvent.campaign_id, name: snap.campaign_name } });
              }
              if (snap.scene) {
                dispatch({ type: 'WS_GAME_EVENT', payload: { event: { type: 'SceneAdvance', scene_name: snap.scene } } });
              }
              if (snap.encounter_active && snap.initiative?.length > 0) {
                dispatch({ type: 'WS_GAME_EVENT', payload: { event: { type: 'EncounterStart', combatants: snap.initiative } } });
              }
              break;
            }
            default:
              break;
          }
        });
        if (cancelled && unlisten) unlisten();
      } catch { /* listener setup failed */ }
    })();

    return () => { cancelled = true; if (unlisten) unlisten(); };
  }, [loadHandouts, dispatch, sendToDm, playerUuid, initiative]);

  const handleRollDice = (sides) => {
    const result = Math.floor(Math.random() * sides) + 1;
    setDiceResult({ sides, result, timestamp: Date.now() });
    if (broadcasting && connected) {
      invoke('ws_send_to_dm', {
        eventJson: JSON.stringify({
          type: 'RollBroadcast',
          expression: `1d${sides}`,
          total: result,
          label: `d${sides}`,
          player_uuid: playerUuid || '',
        }),
      }).catch(e => console.warn('Failed to broadcast roll:', e));
    }
  };

  const handleDisconnect = async () => {
    try {
      await invoke('ws_disconnect_from_dm');
    } catch { /* not connected */ }
    setConnected(false);
    dispatch({ type: 'END_SESSION' });
    toast('Disconnected from session');
    navigate('/');
  };

  const panelStyle = {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    overflow: 'hidden',
  };

  const panelHeaderStyle = {
    padding: '10px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    fontSize: '11px', fontWeight: 700,
    letterSpacing: '0.08em', textTransform: 'uppercase',
    color: 'var(--text-mute)',
    fontFamily: 'var(--font-mono, monospace)',
    display: 'flex', alignItems: 'center', gap: '8px',
  };

  return (
    <div style={{
      height: '100vh',
      background: 'var(--bg, #04040b)',
      fontFamily: 'var(--font-ui, "DM Sans", sans-serif)',
      display: 'grid',
      gridTemplateRows: 'auto auto 1fr',
      paddingTop: 'var(--dev-banner-h, 0px)',
    }}>
      {/* ── Connection Banner ── */}
      <div style={{
        padding: '6px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: connected ? 'rgba(74,222,128,0.06)' : 'rgba(239,68,68,0.06)',
        borderBottom: `1px solid ${connected ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)'}`,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '12px', fontWeight: 500,
          color: connected ? '#4ade80' : '#fca5a5',
        }}>
          {connected ? <Wifi size={13} /> : <WifiOff size={13} />}
          {connected
            ? `Connected to ${campaignName || 'Session'}`
            : 'Not connected — join a session to play live'
          }
        </div>
        <button
          onClick={handleDisconnect}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '3px 10px', borderRadius: '6px',
            background: 'none',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--text-mute)', fontSize: '11px',
            cursor: 'pointer', fontFamily: 'var(--font-ui)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#fca5a5';
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--text-mute)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
          }}
        >
          <LogOut size={11} /> Leave
        </button>
      </div>

      {/* ── Initiative Bar (read-only) ── */}
      <div style={{
        padding: '8px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(4,4,11,0.5)',
        display: 'flex', alignItems: 'center', gap: '8px',
        overflowX: 'auto',
      }}>
        <span style={{
          fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'var(--text-mute)',
          fontFamily: 'var(--font-mono)', flexShrink: 0,
          marginRight: '8px',
        }}>
          <Swords size={11} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
          R{round}
        </span>
        {initiative.length === 0 ? (
          <span style={{ fontSize: '11px', color: 'var(--text-mute)', fontStyle: 'italic' }}>
            No active combat
          </span>
        ) : (
          initiative.map((entry, idx) => (
            <div
              key={entry.id || idx}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '4px 10px', borderRadius: '6px',
                background: idx === currentTurn ? 'rgba(155,89,182,0.15)' : 'rgba(255,255,255,0.03)',
                border: idx === currentTurn ? '1px solid rgba(155,89,182,0.3)' : '1px solid transparent',
                flexShrink: 0,
              }}
            >
              <span style={{
                fontSize: '10px', fontWeight: 700,
                color: idx === currentTurn ? '#c084fc' : 'var(--text-mute)',
                fontFamily: 'var(--font-mono)',
              }}>
                {entry.initiative ?? '?'}
              </span>
              <span style={{
                fontSize: '11px', fontWeight: idx === currentTurn ? 600 : 400,
                color: idx === currentTurn ? 'var(--text)' : 'var(--text-dim)',
                whiteSpace: 'nowrap',
              }}>
                {entry.name}
              </span>
            </div>
          ))
        )}
      </div>

      {/* ── Main Content ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: '12px',
        padding: '12px',
        overflow: 'hidden',
      }}>
        {/* Left: Campaign Overview + Dice */}
        <div style={{ display: 'grid', gridTemplateRows: '1fr auto', gap: '12px' }}>
          <div style={{ ...panelStyle, overflow: 'auto' }}>
            <CampaignOverview campaignId={campaignId} currentScene={currentScene} />
          </div>

          {/* Dice Roller */}
          <div style={panelStyle}>
            <div style={{
              ...panelHeaderStyle,
              justifyContent: 'space-between',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Dice5 size={12} /> Dice Roller
              </span>
              <button
                onClick={() => setBroadcasting(!broadcasting)}
                style={{
                  fontSize: '10px', fontWeight: 600,
                  padding: '2px 8px', borderRadius: '4px',
                  background: broadcasting ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${broadcasting ? 'rgba(74,222,128,0.25)' : 'rgba(255,255,255,0.08)'}`,
                  color: broadcasting ? '#4ade80' : 'var(--text-mute)',
                  cursor: 'pointer', fontFamily: 'var(--font-ui)',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}
              >
                {broadcasting ? 'Broadcasting' : 'Private'}
              </button>
            </div>
            <div style={{ padding: '12px 16px' }}>
              <div style={{
                display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px',
              }}>
                {[4, 6, 8, 10, 12, 20, 100].map(sides => (
                  <button
                    key={sides}
                    onClick={() => handleRollDice(sides)}
                    style={{
                      padding: '8px 14px', borderRadius: '8px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'var(--text-dim)', fontSize: '12px', fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'var(--font-ui)',
                      transition: 'all 0.15s', minWidth: '48px',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(201,168,76,0.12)';
                      e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)';
                      e.currentTarget.style.color = '#c9a84c';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.color = 'var(--text-dim)';
                    }}
                  >
                    d{sides}
                  </button>
                ))}
              </div>
              {diceResult && (
                <motion.div
                  key={diceResult.timestamp}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    textAlign: 'center', padding: '12px',
                    borderRadius: '10px',
                    background: diceResult.result === diceResult.sides
                      ? 'rgba(74,222,128,0.1)'
                      : diceResult.result === 1
                        ? 'rgba(239,68,68,0.1)'
                        : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${
                      diceResult.result === diceResult.sides
                        ? 'rgba(74,222,128,0.2)'
                        : diceResult.result === 1
                          ? 'rgba(239,68,68,0.2)'
                          : 'rgba(255,255,255,0.06)'
                    }`,
                  }}
                >
                  <div style={{
                    fontSize: '28px', fontWeight: 800,
                    color: diceResult.result === diceResult.sides
                      ? '#4ade80'
                      : diceResult.result === 1
                        ? '#ef4444'
                        : 'var(--text)',
                    fontFamily: 'var(--font-display)',
                  }}>
                    {diceResult.result}
                  </div>
                  <div style={{
                    fontSize: '11px', color: 'var(--text-mute)', marginTop: '2px',
                  }}>
                    d{diceResult.sides}
                    {diceResult.result === diceResult.sides && ' — Critical!'}
                    {diceResult.result === 1 && diceResult.sides === 20 && ' — Critical Fail!'}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Handouts + Info + Chat */}
        <div style={{ display: 'grid', gridTemplateRows: '1fr auto auto', gap: '12px' }}>
          {/* Handouts (M-13) */}
          <div style={panelStyle}>
            <div style={panelHeaderStyle}>
              <FileText size={12} /> Handouts ({handouts.length})
            </div>
            <div style={{
              padding: '8px 12px', overflowY: 'auto',
              maxHeight: 'calc(50vh - 80px)',
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
      </div>
    </div>
  );
}
