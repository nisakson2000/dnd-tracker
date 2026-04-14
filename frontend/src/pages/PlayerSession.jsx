import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Swords, Dice5,
  Target, ChevronDown, ChevronUp,
  Radio, Volume2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { invoke } from '@tauri-apps/api/core';
import { useSession } from '../contexts/SessionContext';
import { useCampaignSyncSafe } from '../contexts/CampaignSyncContext';
import { SKILL_ABILITY_MAP, calcMod, ABILITIES } from '../utils/dndHelpers';
import { validateExpression } from '../data/playerRollExpressions';
import { SESSION_STATS_TEMPLATE } from '../data/playerSessionLog';
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

const SECTION_LABEL_STYLE = {
  fontSize: '10px', fontWeight: 600, color: 'var(--text-mute)',
  marginBottom: '6px', fontFamily: 'var(--font-mono)',
  textTransform: 'uppercase', letterSpacing: '0.06em',
};

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

function formatSessionTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
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

  const [showRollMacros, setShowRollMacros] = useState(false);
  const [showCampaignWorld, setShowCampaignWorld] = useState(false);
  const [latencyMs, setLatencyMs] = useState(null);
  const [showAbilities, setShowAbilities] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showSpellSlots, setShowSpellSlots] = useState(false);
  const [customRollExpr, setCustomRollExpr] = useState('');
  const [sessionStats, setSessionStats] = useState({ ...SESSION_STATS_TEMPLATE, sessionStart: Date.now() });
  const [sessionElapsed, setSessionElapsed] = useState(0);
  const [showSessionStats, setShowSessionStats] = useState(false);

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

  // Session timer
  useEffect(() => {
    const start = sessionStats.sessionStart || Date.now();
    const tick = () => setSessionElapsed(Math.floor((Date.now() - start) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [sessionStats.sessionStart]);

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

  const handleSendChat = useCallback(async () => {
    if (!chatInput.trim() || !connected) return;
    const msg = chatInput.trim();
    setChatInput('');
    const ts = Date.now();
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { sender: 'You', message: msg, timestamp: ts } });
    try {
      await sendToDm({ type: 'ChatMessage', sender: 'Player', message: msg, timestamp: ts });
    } catch {
      toast.error('Failed to send message');
    }
  }, [chatInput, connected, dispatch, sendToDm]);

  const handleRequestAction = useCallback(async () => {
    if (!actionInput.trim() || !connected) return;
    const desc = actionInput.trim();
    setActionInput('');
    const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    try {
      await sendToDm({
        type: 'ActionRequest', request_id: requestId,
        player_uuid: playerUuid || '', action_type: 'custom', description: desc,
      });
      toast('Action request sent to DM', { icon: '\u270B', duration: 3000 });
    } catch {
      toast.error('Failed to send action request');
    }
  }, [actionInput, connected, sendToDm, playerUuid]);

  const handleUseItem = useCallback(async () => {
    if (!useItemName.trim() || !connected) return;
    const item = useItemName.trim();
    setUseItemName('');
    setUseItemOpen(false);
    try {
      await sendToDm({
        type: 'ActionRequest', action_type: 'use_item', description: item,
        player_uuid: playerUuid || '',
      });
      toast(`Requesting to use: ${item}`, { icon: '\uD83D\uDEE1\uFE0F', duration: 3000 });
    } catch {
      toast.error('Failed to send item request');
    }
  }, [useItemName, connected, sendToDm, playerUuid]);

  const handleRequestRest = useCallback(async () => {
    if (!connected) return;
    const desc = restType === 'long' ? 'Long rest' : 'Short rest';
    toast(`Requesting ${desc.toLowerCase()}...`, { icon: restType === 'long' ? '\uD83C\uDF19' : '\u2600\uFE0F', duration: 3000 });
    try {
      await sendToDm({
        type: 'ActionRequest', action_type: 'rest_request', description: desc,
        player_uuid: playerUuid || '',
      });
    } catch {
      toast.error('Failed to send rest request');
    }
  }, [connected, restType, sendToDm, playerUuid]);

  const handleSkillCheckRoll = async () => {
    if (!skillCheckPrompt || skillCheckRolling) return;
    setSkillCheckRolling(true);
    const roll = Math.floor(Math.random() * 20) + 1;
    // Compute ability modifier from character sheet
    const abilityName = skillCheckPrompt.ability || SKILL_ABILITY_MAP[skillCheckPrompt.skill] || '';
    const abilityEntry = charAbilities.find(a => a.ability?.toLowerCase() === abilityName.toLowerCase());
    const modifier = abilityEntry ? calcMod(abilityEntry.score || 10) : 0;
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

  const handleWhisperToDm = useCallback(async () => {
    if (!whisperText.trim() || !connected) return;
    const text = whisperText.trim();
    setWhisperText('');
    setWhisperOpen(false);
    toast('Whisper sent to DM', { icon: '\uD83E\uDD2B', duration: 2000 });
    await sendToDm({
      type: 'ChatMessage', sender: 'Player (whisper)', message: text, private: true,
    });
  }, [whisperText, connected, sendToDm]);

  const handleSendSuggestion = useCallback(async () => {
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
  }, [suggestionInput, connected, sendToDm, playerUuid, addFeedEvent]);

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

  const handleAbilityRoll = useCallback((abilityName, modifier, label) => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    const total = d20 + modifier;
    const roll = { sides: 20, result: d20, modifier, total, label, timestamp: Date.now() };
    setDiceResult(roll);
    setRollHistory(prev => [...prev.slice(-9), roll]);
    if (broadcasting && connected) {
      invoke('ws_send_to_dm', {
        eventJson: JSON.stringify({
          type: 'RollBroadcast',
          expression: `1d20${modifier >= 0 ? '+' : ''}${modifier}`,
          total,
          label: `${label}: ${d20}${modifier >= 0 ? '+' : ''}${modifier} = ${total}`,
          player_uuid: playerUuid || '',
        }),
      }).catch(e => console.warn('Failed to broadcast roll:', e));
    }
  }, [broadcasting, connected, playerUuid]);

  // Compute ability modifiers for Quick Rolls
  const abilityModifiers = useMemo(() => {
    const mods = {};
    for (const ab of ABILITIES) {
      const entry = charAbilities.find(a => a.ability?.toUpperCase() === ab);
      const score = entry?.score ?? 10;
      const baseMod = calcMod(score);
      const profBonus = entry?.proficiencyBonus ?? 0;
      const saveProficient = entry?.saveProficient ?? false;
      mods[ab] = {
        checkMod: baseMod,
        saveMod: baseMod + (saveProficient ? (profBonus || 2) : 0),
        saveProficient,
      };
    }
    return mods;
  }, [charAbilities]);

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
  }, [skillCheckPrompt, diceResult, handleRollDice]);

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
        position: 'relative',
      }}>
        <span style={{
          fontSize: initiative.length > 0 ? '11px' : '10px',
          fontWeight: 700, letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: initiative.length > 0 ? '#c9a84c' : 'var(--text-mute)',
          fontFamily: 'var(--font-mono)', flexShrink: 0,
          marginRight: '8px',
          padding: initiative.length > 0 ? '3px 10px' : '0',
          borderRadius: initiative.length > 0 ? '6px' : '0',
          background: initiative.length > 0 ? 'rgba(201,168,76,0.1)' : 'transparent',
          border: initiative.length > 0 ? '1px solid rgba(201,168,76,0.25)' : 'none',
          boxShadow: initiative.length > 0 ? '0 0 12px rgba(201,168,76,0.2), 0 0 4px rgba(201,168,76,0.1)' : 'none',
          transition: 'all 0.3s ease',
        }}>
          <Swords size={initiative.length > 0 ? 12 : 11} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
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
        {/* Session Timer */}
        <span
          style={{
            marginLeft: 'auto', flexShrink: 0,
            fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em',
            color: 'var(--text-mute)', fontFamily: 'var(--font-mono)',
            cursor: 'pointer', padding: '2px 8px', borderRadius: '4px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
          title="Session duration — click for stats"
          onClick={() => setShowSessionStats(s => !s)}
        >
          {formatSessionTime(sessionElapsed)}
        </span>
        {showSessionStats && (
          <div style={{
            position: 'absolute', right: '20px', top: '100%', marginTop: '4px',
            background: 'var(--bg-card, #0c0b14)',
            border: '1px solid rgba(201,168,76,0.25)',
            borderRadius: '10px', padding: '14px 18px',
            zIndex: 50, minWidth: '200px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            fontSize: '12px', color: 'var(--text-dim)',
            fontFamily: 'var(--font-ui)',
          }}>
            <div style={{
              fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: '#c9a84c', marginBottom: '10px',
              fontFamily: 'var(--font-mono)',
            }}>
              Session Stats
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-mute)' }}>Time Elapsed</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text)' }}>{formatSessionTime(sessionElapsed)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-mute)' }}>Total Rolls</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text)' }}>{sessionStats.totalRolls || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-mute)' }}>Hits</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#4ade80' }}>{sessionStats.hits || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-mute)' }}>Misses</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#ef4444' }}>{sessionStats.misses || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px', marginTop: '2px' }}>
                <span style={{ color: 'var(--text-mute)' }}>Hit Rate</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#c9a84c' }}>
                  {(sessionStats.totalRolls || 0) > 0 ? `${Math.round(((sessionStats.hits || 0) / (sessionStats.totalRolls || 1)) * 100)}%` : '—'}
                </span>
              </div>
            </div>
          </div>
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
            animation: 'yourTurnPulse 2s ease-in-out infinite',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          }}
        >
          <Volume2 size={16} style={{ color: '#c9a84c', opacity: 0.7, flexShrink: 0 }} />
          <span style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'Cinzel, Georgia, serif', color: '#c9a84c', textShadow: '0 0 20px rgba(201,168,76,0.4)' }}>
            It's Your Turn!
          </span>
          <Volume2 size={16} style={{ color: '#c9a84c', opacity: 0.7, flexShrink: 0 }} />
          <style>{`
            @keyframes yourTurnPulse {
              0%, 100% { border-color: rgba(201,168,76,0.4); box-shadow: 0 0 0 0 rgba(201,168,76,0); }
              50% { border-color: rgba(201,168,76,0.7); box-shadow: 0 0 16px rgba(201,168,76,0.15); }
            }
          `}</style>
        </motion.div>
      )}

      {/* ── Main Content ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr minmax(min(280px, 100%), 320px)',
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
                  padding: '3px 10px', borderRadius: '4px',
                  background: broadcasting ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${broadcasting ? 'rgba(74,222,128,0.25)' : 'rgba(255,255,255,0.08)'}`,
                  color: broadcasting ? '#4ade80' : 'var(--text-mute)',
                  cursor: 'pointer', fontFamily: 'var(--font-ui)',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                  display: 'flex', alignItems: 'center', gap: '5px',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{
                  width: '7px', height: '7px', borderRadius: '50%',
                  background: broadcasting ? '#4ade80' : 'rgba(255,255,255,0.2)',
                  boxShadow: broadcasting ? '0 0 6px rgba(74,222,128,0.4)' : 'none',
                  transition: 'all 0.2s ease', flexShrink: 0,
                }} />
                <Radio size={10} style={{ opacity: 0.8, flexShrink: 0 }} />
                {broadcasting ? 'Broadcasting' : 'Private'}
              </button>
            </div>
            <div style={{ padding: '12px 16px' }}>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '12px',
              }}>
                {[4, 6, 8, 10, 12, 20, 100].map(sides => (
                  <button
                    key={sides}
                    onClick={() => handleRollDice(sides)}
                    style={{
                      padding: '8px 4px', borderRadius: '8px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'var(--text-dim)', fontSize: '12px', fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'var(--font-ui)',
                      transition: 'all 0.2s ease', textAlign: 'center',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(201,168,76,0.12)';
                      e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)';
                      e.currentTarget.style.color = '#c9a84c';
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(201,168,76,0.15)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.color = 'var(--text-dim)';
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    d{sides}
                  </button>
                ))}
              </div>
              {/* Quick Rolls: Ability Checks & Saving Throws */}
              <div style={{ marginBottom: '12px' }}>
                <button
                  onClick={() => setShowRollMacros(!showRollMacros)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    width: '100%', padding: '6px 0',
                    background: 'none', border: 'none',
                    color: 'var(--text-dim)', fontSize: '11px', fontWeight: 700,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    cursor: 'pointer', fontFamily: 'var(--font-mono, monospace)',
                  }}
                >
                  {showRollMacros ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  Quick Rolls
                </button>
                {showRollMacros && (
                  <div style={{ marginTop: '8px' }}>
                    {/* Ability Checks */}
                    <div style={SECTION_LABEL_STYLE}>
                      Ability Checks
                    </div>
                    <div style={{
                      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px',
                      marginBottom: '10px',
                    }}>
                      {ABILITIES.map(ab => {
                        const mod = abilityModifiers[ab]?.checkMod ?? 0;
                        return (
                          <button
                            key={`check-${ab}`}
                            onClick={() => handleAbilityRoll(ab, mod, `${ab} Check`)}
                            title={`${ab} Ability Check (d20${mod >= 0 ? '+' : ''}${mod})`}
                            style={{
                              padding: '6px 4px', borderRadius: '6px',
                              background: 'rgba(255,255,255,0.04)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              color: 'var(--text-dim)', fontSize: '11px', fontWeight: 600,
                              cursor: 'pointer', fontFamily: 'var(--font-ui)',
                              transition: 'all 0.15s',
                              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = 'rgba(52,152,219,0.12)';
                              e.currentTarget.style.borderColor = 'rgba(52,152,219,0.3)';
                              e.currentTarget.style.color = '#3498db';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                              e.currentTarget.style.color = 'var(--text-dim)';
                            }}
                          >
                            <span style={{ fontWeight: 700 }}>{ab}</span>
                            <span style={{ fontSize: '10px', opacity: 0.7, fontFamily: 'var(--font-mono)' }}>
                              {mod >= 0 ? `+${mod}` : mod}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {/* Saving Throws */}
                    <div style={SECTION_LABEL_STYLE}>
                      Saving Throws
                    </div>
                    <div style={{
                      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px',
                    }}>
                      {ABILITIES.map(ab => {
                        const mod = abilityModifiers[ab]?.saveMod ?? 0;
                        const isProf = abilityModifiers[ab]?.saveProficient ?? false;
                        return (
                          <button
                            key={`save-${ab}`}
                            onClick={() => handleAbilityRoll(ab, mod, `${ab} Save`)}
                            title={`${ab} Saving Throw (d20${mod >= 0 ? '+' : ''}${mod})${isProf ? ' [Proficient]' : ''}`}
                            style={{
                              padding: '6px 4px', borderRadius: '6px',
                              background: isProf ? 'rgba(155,89,182,0.06)' : 'rgba(255,255,255,0.04)',
                              border: `1px solid ${isProf ? 'rgba(155,89,182,0.2)' : 'rgba(255,255,255,0.08)'}`,
                              color: isProf ? '#c084fc' : 'var(--text-dim)', fontSize: '11px', fontWeight: 600,
                              cursor: 'pointer', fontFamily: 'var(--font-ui)',
                              transition: 'all 0.15s',
                              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = 'rgba(155,89,182,0.12)';
                              e.currentTarget.style.borderColor = 'rgba(155,89,182,0.3)';
                              e.currentTarget.style.color = '#9b59b6';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = isProf ? 'rgba(155,89,182,0.06)' : 'rgba(255,255,255,0.04)';
                              e.currentTarget.style.borderColor = isProf ? 'rgba(155,89,182,0.2)' : 'rgba(255,255,255,0.08)';
                              e.currentTarget.style.color = isProf ? '#c084fc' : 'var(--text-dim)';
                            }}
                          >
                            <span style={{ fontWeight: 700 }}>{ab}</span>
                            <span style={{ fontSize: '10px', opacity: 0.7, fontFamily: 'var(--font-mono)' }}>
                              {mod >= 0 ? `+${mod}` : mod}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              {/* Custom Expression Input */}
              <div style={{
                display: 'flex', gap: '6px', marginBottom: '12px',
              }}>
                <input
                  type="text"
                  value={customRollExpr}
                  onChange={e => setCustomRollExpr(e.target.value)}
                  placeholder="Roll dice: 2d6+5, 4d8, 1d20+7..."
                  onKeyDown={e => {
                    if (e.key === 'Enter' && customRollExpr.trim()) {
                      const validated = validateExpression(customRollExpr.trim());
                      if (validated) {
                        // Simple roll simulation
                        let total = validated.flatBonus;
                        const parts = [];
                        for (const g of validated.diceGroups) {
                          let groupTotal = 0;
                          const count = Math.abs(g.count);
                          for (let i = 0; i < count; i++) {
                            const r = Math.floor(Math.random() * g.sides) + 1;
                            groupTotal += r;
                          }
                          if (g.count < 0) groupTotal = -groupTotal;
                          total += groupTotal;
                          parts.push(`${g.count}d${g.sides}=${groupTotal}`);
                        }
                        if (validated.flatBonus) parts.push(`${validated.flatBonus > 0 ? '+' : ''}${validated.flatBonus}`);
                        setDiceResult({ sides: 0, result: total, label: customRollExpr.trim(), breakdown: parts.join(' '), timestamp: Date.now() });
                        setRollHistory(prev => [...prev.slice(-9), { sides: 0, result: total, label: customRollExpr.trim(), timestamp: Date.now() }]);
                        if (broadcasting && connected) {
                          invoke('ws_send_to_dm', {
                            eventJson: JSON.stringify({
                              type: 'RollBroadcast',
                              expression: customRollExpr.trim(),
                              total,
                              label: `${customRollExpr.trim()} = ${total}`,
                              player_uuid: playerUuid || '',
                            }),
                          }).catch(() => {});
                        }
                        setCustomRollExpr('');
                      }
                    }
                  }}
                  style={{
                    flex: 1, padding: '6px 10px', borderRadius: '6px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'var(--text)', fontSize: '12px',
                    fontFamily: 'var(--font-mono, monospace)',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={() => {
                    if (!customRollExpr.trim()) return;
                    const validated = validateExpression(customRollExpr.trim());
                    if (validated) {
                      let total = validated.flatBonus;
                      for (const g of validated.diceGroups) {
                        const count = Math.abs(g.count);
                        let groupTotal = 0;
                        for (let i = 0; i < count; i++) groupTotal += Math.floor(Math.random() * g.sides) + 1;
                        if (g.count < 0) groupTotal = -groupTotal;
                        total += groupTotal;
                      }
                      setDiceResult({ sides: 0, result: total, label: customRollExpr.trim(), timestamp: Date.now() });
                      setRollHistory(prev => [...prev.slice(-9), { sides: 0, result: total, label: customRollExpr.trim(), timestamp: Date.now() }]);
                      if (broadcasting && connected) {
                        invoke('ws_send_to_dm', {
                          eventJson: JSON.stringify({
                            type: 'RollBroadcast',
                            expression: customRollExpr.trim(),
                            total,
                            label: `${customRollExpr.trim()} = ${total}`,
                            player_uuid: playerUuid || '',
                          }),
                        }).catch(() => {});
                      }
                      setCustomRollExpr('');
                    }
                  }}
                  style={{
                    padding: '6px 12px', borderRadius: '6px',
                    background: 'rgba(201,168,76,0.12)',
                    border: '1px solid rgba(201,168,76,0.25)',
                    color: '#c9a84c', fontSize: '11px', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'var(--font-ui)',
                  }}
                >
                  Roll
                </button>
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
                  {diceResult.modifier !== undefined ? (
                    <>
                      <div style={{
                        fontSize: '13px', fontWeight: 600,
                        color: '#c9a84c', marginBottom: '4px',
                        fontFamily: 'var(--font-ui)',
                      }}>
                        {diceResult.label}
                      </div>
                      <div style={{
                        fontSize: '28px', fontWeight: 800,
                        color: diceResult.result === 20
                          ? '#4ade80'
                          : diceResult.result === 1
                            ? '#ef4444'
                            : 'var(--text)',
                        fontFamily: 'var(--font-display)',
                      }}>
                        {diceResult.total}
                      </div>
                      <div style={{
                        fontSize: '11px', color: 'var(--text-mute)', marginTop: '2px',
                        fontFamily: 'var(--font-mono)',
                      }}>
                        {diceResult.result} {diceResult.modifier >= 0 ? '+' : ''} {diceResult.modifier} = {diceResult.total}
                        {diceResult.result === 20 && ' — Natural 20!'}
                        {diceResult.result === 1 && ' — Natural 1!'}
                      </div>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
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
                    <span key={i} title={`${r.label || `d${r.sides}`}: rolled ${r.result}${r.total ? ` (total ${r.total})` : ''} — ${new Date(r.timestamp).toLocaleTimeString()}`} style={{
                      fontSize: '10px', fontFamily: 'var(--font-mono)',
                      padding: '1px 5px', borderRadius: '3px',
                      background: r.result === r.sides ? 'rgba(74,222,128,0.1)' : r.result === 1 && r.sides === 20 ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.03)',
                      color: r.result === r.sides ? '#4ade80' : r.result === 1 && r.sides === 20 ? '#ef4444' : 'var(--text-mute)',
                      border: `1px solid ${r.result === r.sides ? 'rgba(74,222,128,0.15)' : r.result === 1 && r.sides === 20 ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)'}`,
                      cursor: 'default',
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
