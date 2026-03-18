import { useState, useEffect, useCallback, useMemo, useRef, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Swords, Dice5,
  Target,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { invoke } from '@tauri-apps/api/core';
import { useSession } from '../contexts/SessionContext';
import { useCampaignSyncSafe } from '../contexts/CampaignSyncContext';
import { SKILL_ABILITY_MAP } from '../utils/dndHelpers';
import PlayerEventFeed from '../components/party/PlayerEventFeed';
import PlayerSessionHeader from '../components/party/PlayerSessionHeader';
import PlayerSessionSidebar from '../components/party/PlayerSessionSidebar';
import ErrorBoundary from '../components/ErrorBoundary';
import usePlayerCharacterData from '../hooks/usePlayerCharacterData';
import usePlayerSessionEvents from '../hooks/usePlayerSessionEvents';

// ── Memoized animation variants (prevent recreation every render) ──
const YOUR_TURN_ANIM = { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } };
const DICE_RESULT_ANIM = { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 } };
const SKILL_CHECK_OVERLAY_ANIM = { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } };

let feedIdCounter = 0;
function makeFeedEvent(category, message, details = null) {
  return {
    id: `evt-${Date.now()}-${++feedIdCounter}`,
    category,
    message,
    details,
    timestamp: Date.now(),
  };
}

export default function PlayerSession() {
  const navigate = useNavigate();
  const {
    campaignId, campaignName, sessionActive, paused,
    initiative, round, currentTurn, currentScene,
    connectedPlayers, chatMessages, dispatch,
    sendToDm, broadcastEvent, playerUuid,
  } = useSession();

  const syncCtx = useCampaignSyncSafe();
  const { isMyTurn, combatActive, initiativeOrder, currentTurn: syncCurrentTurn, round: syncRound, currentMood } = syncCtx || {};

  const [diceResult, setDiceResult] = useState(null);
  const [rollHistory, setRollHistory] = useState([]); // last 10 rolls
  const [broadcasting, setBroadcasting] = useState(true);
  const [connected, setConnected] = useState(false);
  const [eventFeed, setEventFeed] = useState([]);

  // M-13: Handouts feed
  const [handouts, setHandouts] = useState([]);
  const [expandedHandout, setExpandedHandout] = useState(null);

  const [chatInput, setChatInput] = useState('');
  const [actionInput, setActionInput] = useState('');

  // Player Actions state
  const [useItemOpen, setUseItemOpen] = useState(false);
  const [useItemName, setUseItemName] = useState('');
  const [restType, setRestType] = useState('short'); // 'short' | 'long'
  const [whisperOpen, setWhisperOpen] = useState(false);
  const [whisperText, setWhisperText] = useState('');

  const [skillCheckPrompt, setSkillCheckPrompt] = useState(null);
  const [skillCheckRolling, setSkillCheckRolling] = useState(false);

  // v0.6.5: Suggestion system
  const [suggestionInput, setSuggestionInput] = useState('');
  const [suggestionSending, setSuggestionSending] = useState(false);
  // v0.7.0: NPC/Quest tracking
  const [discoveredNpcs, setDiscoveredNpcs] = useState([]);
  const [activeQuests, setActiveQuests] = useState([]);
  // v0.7.0: Your Turn banner
  const [showYourTurn, setShowYourTurn] = useState(false);

  const [showCampaignWorld, setShowCampaignWorld] = useState(false);
  const [latencyMs, setLatencyMs] = useState(null);
  const [showAbilities, setShowAbilities] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showSpellSlots, setShowSpellSlots] = useState(false);

  const addFeedEvent = useCallback((category, message, details) => {
    setEventFeed(prev => {
      const next = [...prev, makeFeedEvent(category, message, details)];
      return next.length > 200 ? next.slice(-200) : next;
    });
  }, []);

  // Character data hook
  const {
    refreshCharacter,
    charOverview,
    charAbilities,
    inventory,
    currency,
    spellSlots,
    conditions,
    hpEditMode,
    setHpEditMode,
    hpDelta,
    setHpDelta,
    sessionNote,
    setSessionNote,
    handleHpChange,
    handleSetTempHp,
    handleUseSpellSlot,
    handleSaveNote,
    savedNotes,
    handleDeleteNote,
  } = usePlayerCharacterData(playerUuid, { addFeedEvent, connected, sendToDm });

  const loadHandouts = useCallback(async () => {
    try {
      const list = await invoke('list_handouts');
      // Only show revealed handouts to players
      setHandouts(list.filter(h => h.revealed));
    } catch {
      // Not connected to a campaign — that's fine
    }
  }, []);

  // Event listener hook
  usePlayerSessionEvents({
    loadHandouts,
    dispatch,
    sendToDm,
    playerUuid,
    initiative,
    addFeedEvent,
    round,
    refreshCharacter,
    setConnected,
    setSkillCheckPrompt,
    setDiscoveredNpcs,
    setActiveQuests,
  });

  // Latency measurement: ping every 30s while connected
  useEffect(() => {
    if (!connected) { setLatencyMs(null); return; }
    const ping = () => {
      const t0 = Date.now();
      sendToDm({ type: 'Ping', timestamp: t0 })
        .then(() => setLatencyMs(Date.now() - t0))
        .catch(() => {});
    };
    ping(); // initial measurement
    const id = setInterval(ping, 30000);
    return () => clearInterval(id);
  }, [connected, sendToDm]);

  // v0.7.0: "Your Turn!" banner when isMyTurn becomes true
  useEffect(() => {
    if (isMyTurn) {
      setShowYourTurn(true);
      // Auto-dismiss after 5 seconds
      const t = setTimeout(() => setShowYourTurn(false), 5000);
      return () => clearTimeout(t);
    } else {
      setShowYourTurn(false);
    }
  }, [isMyTurn]);

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

  const handleUseItem = async () => {
    if (!useItemName.trim() || !connected) return;
    const item = useItemName.trim();
    setUseItemName('');
    setUseItemOpen(false);
    toast(`Requesting to use: ${item}`, { icon: '\uD83D\uDEE1\uFE0F', duration: 3000 });
    await sendToDm({
      type: 'ActionRequest', action_type: 'use_item', description: item,
      player_uuid: playerUuid || '',
    });
  };

  const handleRequestRest = async () => {
    if (!connected) return;
    const desc = restType === 'long' ? 'Long rest' : 'Short rest';
    toast(`Requesting ${desc.toLowerCase()}...`, { icon: restType === 'long' ? '\uD83C\uDF19' : '\u2600\uFE0F', duration: 3000 });
    await sendToDm({
      type: 'ActionRequest', action_type: 'rest_request', description: desc,
      player_uuid: playerUuid || '',
    });
  };

  const handleSkillCheckRoll = async () => {
    if (!skillCheckPrompt || skillCheckRolling) return;
    setSkillCheckRolling(true);
    const roll = Math.floor(Math.random() * 20) + 1;
    // Compute ability modifier from character sheet
    const abilityName = skillCheckPrompt.ability || SKILL_ABILITY_MAP[skillCheckPrompt.skill] || '';
    const abilityEntry = charAbilities.find(a => a.ability?.toLowerCase() === abilityName.toLowerCase());
    const modifier = abilityEntry ? Math.floor(((abilityEntry.score || 10) - 10) / 2) : 0;
    const total = roll + modifier;
    const success = skillCheckPrompt.dc ? total >= skillCheckPrompt.dc : null;

    addFeedEvent('skill_check', `Rolled ${roll}${modifier !== 0 ? ` + ${modifier}` : ''} = ${total} for ${skillCheckPrompt.skill}${success != null ? (success ? ' — Success!' : ' — Failed') : ''}`);

    await sendToDm({
      type: 'SkillCheckResult',
      prompt_id: skillCheckPrompt.prompt_id,
      skill: skillCheckPrompt.skill,
      roll,
      modifier,
      total,
      success,
      player_uuid: playerUuid || '',
    });

    toast(
      `${skillCheckPrompt.skill}: ${roll}${modifier !== 0 ? ` + ${modifier}` : ''} = ${total}${success != null ? (success ? ' — Pass!' : ' — Fail!') : ''}`,
      {
        icon: roll === 20 ? '\u2728' : roll === 1 ? '\uD83D\uDCA5' : '\uD83C\uDFB2',
        duration: 4000,
        style: {
          background: '#1a1520',
          color: success ? '#4ade80' : success === false ? '#fca5a5' : '#e2e0d8',
          border: `1px solid ${success ? 'rgba(74,222,128,0.4)' : success === false ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'}`,
        },
      }
    );

    setTimeout(() => {
      setSkillCheckPrompt(null);
      setSkillCheckRolling(false);
    }, 2000);
  };

  const handleWhisperToDm = async () => {
    if (!whisperText.trim() || !connected) return;
    const text = whisperText.trim();
    setWhisperText('');
    setWhisperOpen(false);
    toast('Whisper sent to DM', { icon: '\uD83E\uDD2B', duration: 2000 });
    await sendToDm({
      type: 'ChatMessage', sender: 'Player (whisper)', message: text, private: true,
    });
  };

  const handleSendSuggestion = async () => {
    if (!suggestionInput.trim() || !connected) return;
    setSuggestionSending(true);
    const desc = suggestionInput.trim();
    setSuggestionInput('');
    try {
      await sendToDm({
        type: 'ActionRequest', action_type: 'suggestion', description: `[Suggestion] ${desc}`,
        player_uuid: playerUuid || '',
        request_id: `sug_${Date.now()}`,
      });
      toast('Suggestion sent to DM', { icon: '\uD83D\uDCA1', duration: 3000 });
      addFeedEvent('system', `Suggestion sent: ${desc}`);
    } catch {
      toast.error('Failed to send suggestion');
    }
    setSuggestionSending(false);
  };

  const handleRollDice = useCallback((sides) => {
    const result = Math.floor(Math.random() * sides) + 1;
    const roll = { sides, result, timestamp: Date.now() };
    setDiceResult(roll);
    setRollHistory(prev => [...prev.slice(-9), roll]);
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
  }, [broadcasting, connected, playerUuid]);

  const handleDisconnect = async () => {
    try {
      await invoke('ws_disconnect_from_dm');
    } catch { /* not connected */ }
    setConnected(false);
    dispatch({ type: 'END_SESSION' });
    toast('Disconnected from session');
    navigate('/');
  };

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handler = (e) => {
      // Escape: dismiss overlays
      if (e.key === 'Escape') {
        if (skillCheckPrompt) { setSkillCheckPrompt(null); return; }
        if (diceResult) { setDiceResult(null); return; }
      }
      // Don't fire shortcuts if typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      // Ctrl+R or just R: quick d20 roll
      if (e.key === 'r' || e.key === 'R') {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
        }
        handleRollDice(20);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [skillCheckPrompt, diceResult]); // eslint-disable-line react-hooks/exhaustive-deps

  const panelStyle = useMemo(() => ({
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    overflow: 'hidden',
  }), []);

  const panelHeaderStyle = useMemo(() => ({
    padding: '10px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    fontSize: '11px', fontWeight: 700,
    letterSpacing: '0.08em', textTransform: 'uppercase',
    color: 'var(--text-mute)',
    fontFamily: 'var(--font-mono, monospace)',
    display: 'flex', alignItems: 'center', gap: '8px',
  }), []);

  return (
    <div style={{
      height: '100vh',
      background: 'var(--bg, #04040b)',
      fontFamily: 'var(--font-ui, "DM Sans", sans-serif)',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: 'var(--dev-banner-h, 0px)',
    }}>
      <PlayerSessionHeader
        connected={connected}
        campaignName={campaignName}
        handleDisconnect={handleDisconnect}
        charOverview={charOverview}
        conditions={conditions}
        hpEditMode={hpEditMode}
        setHpEditMode={setHpEditMode}
        hpDelta={hpDelta}
        setHpDelta={setHpDelta}
        handleHpChange={handleHpChange}
        charAbilities={charAbilities}
        showAbilities={showAbilities}
        setShowAbilities={setShowAbilities}
        showInventory={showInventory}
        setShowInventory={setShowInventory}
        inventory={inventory}
        currency={currency}
        spellSlots={spellSlots}
        showSpellSlots={showSpellSlots}
        setShowSpellSlots={setShowSpellSlots}
        handleUseSpellSlot={handleUseSpellSlot}
        latencyMs={latencyMs}
      />

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

      {/* Your Turn Banner */}
      {showYourTurn && isMyTurn && (
        <motion.div
          {...YOUR_TURN_ANIM}
          onClick={() => setShowYourTurn(false)}
          style={{
            padding: '12px 20px', textAlign: 'center', cursor: 'pointer',
            background: 'linear-gradient(90deg, rgba(201,168,76,0.15), rgba(155,89,182,0.15))',
            borderBottom: '2px solid rgba(201,168,76,0.4)',
          }}
        >
          <span style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'Cinzel, Georgia, serif', color: '#c9a84c', textShadow: '0 0 20px rgba(201,168,76,0.4)' }}>
            It's Your Turn!
          </span>
        </motion.div>
      )}

      {/* ── Main Content ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: '12px',
        padding: '12px',
        overflow: 'hidden',
        flex: 1,
        minHeight: 0,
      }}>
        {/* Left: Event Feed + Dice */}
        <div style={{ display: 'grid', gridTemplateRows: '1fr auto', gap: '12px', overflow: 'hidden' }}>
          <ErrorBoundary label="Event Feed">
            <PlayerEventFeed events={eventFeed} maxEvents={200} />
          </ErrorBoundary>

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
                  {...DICE_RESULT_ANIM}
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
              {/* Roll History */}
              {rollHistory.length > 1 && (
                <div style={{
                  display: 'flex', gap: '4px', flexWrap: 'wrap',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  paddingTop: '8px', marginTop: '4px',
                }}>
                  <span style={{ fontSize: '9px', color: 'var(--text-mute)', fontFamily: 'var(--font-mono)', alignSelf: 'center', marginRight: '4px' }}>
                    History:
                  </span>
                  {rollHistory.slice(0, -1).reverse().slice(0, 8).map((r, i) => (
                    <span key={i} style={{
                      fontSize: '10px', fontFamily: 'var(--font-mono)',
                      padding: '1px 5px', borderRadius: '3px',
                      background: r.result === r.sides ? 'rgba(74,222,128,0.1)' : r.result === 1 && r.sides === 20 ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.03)',
                      color: r.result === r.sides ? '#4ade80' : r.result === 1 && r.sides === 20 ? '#ef4444' : 'var(--text-mute)',
                      border: `1px solid ${r.result === r.sides ? 'rgba(74,222,128,0.15)' : r.result === 1 && r.sides === 20 ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)'}`,
                    }}>
                      {r.result}<span style={{ opacity: 0.5 }}>d{r.sides}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Sidebar */}
        <ErrorBoundary label="Sidebar">
        <PlayerSessionSidebar
          panelStyle={panelStyle}
          panelHeaderStyle={panelHeaderStyle}
          characterData={charOverview}
          characterAbilities={charAbilities}
          characterConditions={conditions}
          handouts={handouts}
          expandedHandout={expandedHandout}
          setExpandedHandout={setExpandedHandout}
          campaignName={campaignName}
          sessionActive={sessionActive}
          round={round}
          connectedPlayers={connectedPlayers}
          currentScene={currentScene}
          campaignId={campaignId}
          showCampaignWorld={showCampaignWorld}
          setShowCampaignWorld={setShowCampaignWorld}
          activeQuests={activeQuests}
          discoveredNpcs={discoveredNpcs}
          connected={connected}
          useItemOpen={useItemOpen}
          setUseItemOpen={setUseItemOpen}
          useItemName={useItemName}
          setUseItemName={setUseItemName}
          handleUseItem={handleUseItem}
          restType={restType}
          setRestType={setRestType}
          handleRequestRest={handleRequestRest}
          whisperOpen={whisperOpen}
          setWhisperOpen={setWhisperOpen}
          whisperText={whisperText}
          setWhisperText={setWhisperText}
          handleWhisperToDm={handleWhisperToDm}
          suggestionInput={suggestionInput}
          setSuggestionInput={setSuggestionInput}
          suggestionSending={suggestionSending}
          handleSendSuggestion={handleSendSuggestion}
          sessionNote={sessionNote}
          setSessionNote={setSessionNote}
          handleSaveNote={handleSaveNote}
          savedNotes={savedNotes}
          onDeleteNote={handleDeleteNote}
          chatMessages={chatMessages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          handleSendChat={handleSendChat}
          actionInput={actionInput}
          setActionInput={setActionInput}
          handleRequestAction={handleRequestAction}
        />
        </ErrorBoundary>
      </div>

      {/* Skill Check Prompt Overlay */}
      {skillCheckPrompt && (
        <motion.div
          {...SKILL_CHECK_OVERLAY_ANIM}
          style={{
            position: 'fixed', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.6)', zIndex: 1000,
          }}
        >
          <div style={{
            background: 'var(--bg-card, #0c0b14)',
            border: '1px solid rgba(251,191,36,0.3)',
            borderRadius: 16, padding: '32px 40px',
            textAlign: 'center', maxWidth: 360,
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}>
            <Target size={32} style={{ color: '#fbbf24', marginBottom: 12 }} />
            <div style={{
              fontSize: 18, fontWeight: 700, color: 'var(--text)',
              marginBottom: 4, fontFamily: 'var(--font-display)',
            }}>
              {skillCheckPrompt.skill} Check
            </div>
            {skillCheckPrompt.description && (
              <div style={{
                fontSize: 13, color: 'var(--text-dim)',
                marginBottom: 12, lineHeight: 1.4,
              }}>
                {skillCheckPrompt.description}
              </div>
            )}
            {skillCheckPrompt.show_dc && skillCheckPrompt.dc && (
              <div style={{
                fontSize: 12, color: '#fbbf24',
                marginBottom: 16, fontFamily: 'var(--font-mono)',
              }}>
                DC {skillCheckPrompt.dc}
              </div>
            )}
            <button
              onClick={handleSkillCheckRoll}
              disabled={skillCheckRolling}
              style={{
                padding: '12px 32px', borderRadius: 10,
                background: skillCheckRolling ? 'rgba(251,191,36,0.08)' : 'rgba(251,191,36,0.15)',
                border: '1px solid rgba(251,191,36,0.3)',
                color: '#fbbf24', fontSize: 16, fontWeight: 700,
                cursor: skillCheckRolling ? 'wait' : 'pointer',
                fontFamily: 'var(--font-display)',
                transition: 'all 0.2s',
                opacity: skillCheckRolling ? 0.5 : 1,
              }}
            >
              {skillCheckRolling ? 'Rolling...' : 'Roll d20'}
            </button>
            <button
              onClick={() => setSkillCheckPrompt(null)}
              style={{
                display: 'block', margin: '12px auto 0',
                background: 'none', border: 'none',
                color: 'var(--text-mute)', fontSize: 11,
                cursor: 'pointer', fontFamily: 'var(--font-ui)',
              }}
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}

      {/* Session Paused Overlay */}
      {paused && (
        <div style={{
          position: 'fixed', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 2000,
        }}>
          <div style={{
            textAlign: 'center',
            padding: '48px 64px',
            borderRadius: '20px',
            background: 'rgba(4,4,11,0.9)',
            border: '1px solid rgba(201,168,76,0.25)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
          }}>
            <div style={{
              fontSize: '32px', fontWeight: 800,
              color: '#c9a84c',
              fontFamily: 'var(--font-display, "Cinzel", serif)',
              marginBottom: '12px',
              textShadow: '0 0 30px rgba(201,168,76,0.3)',
            }}>
              Session Paused
            </div>
            <div style={{
              fontSize: '14px', color: 'var(--text-dim)',
              marginBottom: '24px',
              fontFamily: 'var(--font-ui)',
            }}>
              The DM has paused the session. Hang tight...
            </div>
            <div style={{
              display: 'flex', justifyContent: 'center', gap: '8px',
            }}>
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: '#c9a84c',
                    animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
            <style>{`
              @keyframes pulse {
                0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
                40% { opacity: 1; transform: scale(1.2); }
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
}
