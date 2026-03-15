import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Square, Clock, Users, Swords, MapPin, ChevronRight,
  SkipForward, ScrollText, Dice5, Shield, Star, Eye, Zap, ChevronDown, ChevronUp, X, Check, Moon, Sun,
  Play, StopCircle, Skull, Heart, Send, MessageCircle, Download, Sparkles, Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { invoke } from '@tauri-apps/api/core';
import ENCOUNTER_PROMPTS, { ENCOUNTER_CATEGORIES } from '../data/encounterPrompts';
import { listen } from '@tauri-apps/api/event';
import { useSession } from '../contexts/SessionContext';
import HandoutsManager from '../components/dm-session/HandoutsManager';
import WorldStateManager from '../components/dm-session/WorldStateManager';
import CharacterArcManager from '../components/dm-session/CharacterArcManager';
import StoryPanel from '../components/dm-session/StoryPanel';
import QuestRunner from '../components/dm-session/QuestRunner';
import { useCampaignSyncSafe } from '../contexts/CampaignSyncContext';
import { History, AlertCircle, BookMarked, Megaphone } from 'lucide-react';

function formatTimer(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function DMSession() {
  const { id: campaignId } = useParams();
  const navigate = useNavigate();
  const {
    campaignName, sessionId, sessionActive,
    connectedPlayers, currentScene, initiative,
    round, currentTurn, actionLog, pendingActions, chatMessages, dispatch,
    broadcastEvent,
  } = useSession();

  const syncCtx = useCampaignSyncSafe();
  const {
    promptResults = {}, promptHistory = [], clearPromptHistory = () => {},
    sendPrompt = () => {}, connectedPlayerMap = {}, resolvePlayerName = (id) => id || 'Player',
    sendEvent: syncSendEvent = () => {},
  } = syncCtx || {};

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [ending, setEnding] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [scenes, setScenes] = useState([]);
  const timerRef = useRef(null);

  // M-14: XP Award modal
  const [showXpModal, setShowXpModal] = useState(false);
  const [xpAmount, setXpAmount] = useState('');
  const [xpReason, setXpReason] = useState('');
  const [xpSelectedPlayers, setXpSelectedPlayers] = useState([]);
  const [awardingXp, setAwardingXp] = useState(false);

  // M-18: Spell slot detail view
  const [expandedPlayer, setExpandedPlayer] = useState(null);

  // M-07: Rest state
  const [restingLong, setRestingLong] = useState(false);
  const [restingShort, setRestingShort] = useState(false);

  // Encounter controls state
  const [encounterMonsters, setEncounterMonsters] = useState([]);
  const [encounterActive, setEncounterActive] = useState(false);
  const [activeEncounterId, setActiveEncounterId] = useState(null);

  // Chat state
  const [chatInput, setChatInput] = useState('');

  // Quick Checks state
  const [quickCheckAbility, setQuickCheckAbility] = useState('');
  const [quickCheckSkill, setQuickCheckSkill] = useState('');
  const [quickCheckDC, setQuickCheckDC] = useState('');
  const [quickCheckAdvantage, setQuickCheckAdvantage] = useState('normal'); // 'normal' | 'advantage' | 'disadvantage'
  const [showPromptHistory, setShowPromptHistory] = useState(false);
  // Suggestions state
  const [showSuggestions, setShowSuggestions] = useState(false);
  // Narrative flow
  const [showNarrativeFlow, setShowNarrativeFlow] = useState(false);
  const [narrativeBroadcastText, setNarrativeBroadcastText] = useState('');
  // Chat history
  const [showChatHistory, setShowChatHistory] = useState(false);
  // Quest panel
  const [showQuestRunner, setShowQuestRunner] = useState(false);
  const [quests, setQuests] = useState([]);
  const [questNpcs, setQuestNpcs] = useState([]);
  // Debounce refs
  const startSessionDebounce = useRef(false);
  const endSessionDebounce = useRef(false);
  const startEncounterDebounce = useRef(false);
  const endEncounterDebounce = useRef(false);

  // Random Encounter Engine state
  const [showEncounterEngine, setShowEncounterEngine] = useState(false);
  const [encounterCategory, setEncounterCategory] = useState('');
  const [encounterSearch, setEncounterSearch] = useState('');
  const [encounterCustomPrompt, setEncounterCustomPrompt] = useState('');
  const [encounterGenerating, setEncounterGenerating] = useState(false);
  const [encounterResult, setEncounterResult] = useState(null);
  const [encounterMode, setEncounterMode] = useState('library'); // 'library' | 'custom'

  // Encounter handlers
  const handleStartEncounter = async () => {
    if (startEncounterDebounce.current) return;
    startEncounterDebounce.current = true;
    setTimeout(() => { startEncounterDebounce.current = false; }, 2000);
    if (!currentScene?.id) {
      toast.error('Select a scene first');
      return;
    }
    try {
      const encounter = await invoke('create_encounter', { sceneId: currentScene.id });
      const initJson = JSON.stringify(
        connectedPlayers.map((p, i) => ({
          id: p.id, name: p.name, initiative: 0, active: i === 0, type: 'player',
        }))
      );
      await invoke('start_encounter', { encounterId: encounter.id, initiativeJson: initJson });
      setActiveEncounterId(encounter.id);
      setEncounterActive(true);
      dispatch({ type: 'SET_ENCOUNTER', payload: encounter });
      dispatch({ type: 'LOG_ACTION', payload: 'Encounter started' });
      toast.success('Encounter started!');
      await broadcastEvent({
        type: 'EncounterStart',
        campaign_id: campaignId,
        encounter_id: encounter.id,
        initiative_json: initJson,
        initiative: JSON.parse(initJson),
      });
      // Load monsters
      const monsters = await invoke('get_encounter_monsters', { encounterId: encounter.id });
      setEncounterMonsters(monsters);
    } catch (e) {
      toast.error('Failed to start encounter');
      console.error(e);
    }
  };

  const handleEndEncounter = async () => {
    if (endEncounterDebounce.current) return;
    endEncounterDebounce.current = true;
    setTimeout(() => { endEncounterDebounce.current = false; }, 2000);
    if (!activeEncounterId) return;
    try {
      await invoke('end_encounter', { encounterId: activeEncounterId });
      setEncounterActive(false);
      setActiveEncounterId(null);
      setEncounterMonsters([]);
      dispatch({ type: 'SET_ENCOUNTER', payload: null });
      dispatch({ type: 'SET_INITIATIVE', payload: [] });
      dispatch({ type: 'LOG_ACTION', payload: 'Encounter ended' });
      toast.success('Encounter ended');
      await broadcastEvent({ type: 'EncounterEnd', campaign_id: campaignId });
    } catch (e) {
      toast.error('Failed to end encounter');
      console.error(e);
    }
  };

  const handleMonsterHp = async (monsterId, delta) => {
    try {
      const result = await invoke('update_monster_hp', { monsterId, hpDelta: delta });
      setEncounterMonsters(prev => prev.map(m =>
        m.id === monsterId ? { ...m, hp_current: result.new_hp } : m
      ));
      dispatch({ type: 'LOG_ACTION', payload: `${result.monster_name}: ${delta > 0 ? '+' : ''}${delta} HP (now ${result.new_hp})` });
      await broadcastEvent({
        type: 'HpDelta', campaign_id: campaignId,
        target_id: monsterId, target_name: result.monster_name,
        delta, source: 'DM',
      });
    } catch (e) {
      toast.error('Failed to update HP');
      console.error(e);
    }
  };

  const handleKillMonster = async (monsterId) => {
    try {
      const result = await invoke('kill_monster', { monsterId });
      setEncounterMonsters(prev => prev.map(m =>
        m.id === monsterId ? { ...m, alive: false, hp_current: 0 } : m
      ));
      dispatch({ type: 'LOG_ACTION', payload: `${result.monster_name} was slain!` });
      toast.success(`${result.monster_name} killed!`);
      await broadcastEvent({
        type: 'MonsterKilled', campaign_id: campaignId,
        monster_id: monsterId, monster_name: result.monster_name,
      });
    } catch (e) {
      toast.error('Failed to kill monster');
      console.error(e);
    }
  };

  // Chat handler
  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatInput('');
    const ts = Date.now();
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { sender: 'DM', message: msg, timestamp: ts } });
    dispatch({ type: 'LOG_ACTION', payload: `DM: ${msg}` });
    await broadcastEvent({ type: 'ChatMessage', sender: 'DM', message: msg, timestamp: ts });
  };

  const handleSendQuickCheck = () => {
    if (!quickCheckAbility && !quickCheckSkill) {
      toast.error('Select an ability or skill');
      return;
    }
    const dc = parseInt(quickCheckDC) || 0;
    const promptData = {
      label: quickCheckSkill
        ? `${quickCheckSkill} Check${dc ? ` (DC ${dc})` : ''}`
        : `${quickCheckAbility} Check${dc ? ` (DC ${dc})` : ''}`,
      ability: quickCheckAbility || undefined,
      skill: quickCheckSkill || undefined,
      dc: dc || undefined,
      proficiency_required: !!quickCheckSkill,
      advantage: quickCheckAdvantage === 'advantage' || undefined,
      disadvantage: quickCheckAdvantage === 'disadvantage' || undefined,
    };
    sendPrompt('roll_check', promptData);
    dispatch({ type: 'LOG_ACTION', payload: `Sent ${promptData.label} to players` });
    toast.success(`Quick Check sent: ${promptData.label}`);
  };

  // Action request handlers (DM approves/denies player requests)
  const handleApproveAction = async (request) => {
    dispatch({ type: 'REMOVE_PENDING_ACTION', payload: request.requestId });
    dispatch({ type: 'LOG_ACTION', payload: `Approved: ${request.description}` });
    await broadcastEvent({
      type: 'ActionApproved', request_id: request.requestId,
      player_uuid: request.playerUuid,
    });
  };

  const handleDenyAction = async (request, reason = 'Not allowed') => {
    dispatch({ type: 'REMOVE_PENDING_ACTION', payload: request.requestId });
    dispatch({ type: 'LOG_ACTION', payload: `Denied: ${request.description} (${reason})` });
    await broadcastEvent({
      type: 'ActionDenied', request_id: request.requestId,
      player_uuid: request.playerUuid, reason,
    });
  };

  // M-07: Campaign rest handlers
  const handleLongRest = async () => {
    setRestingLong(true);
    try {
      const result = await invoke('campaign_long_rest');
      toast.success('Long rest completed \u2014 all players restored');
      dispatch({ type: 'LOG_ACTION', payload: `Long rest: ${result.players_restored} player(s) restored` });
      // Broadcast to session
      try {
        await invoke('ws_broadcast_event', {
          eventJson: JSON.stringify({ type: 'RestCompleted', campaign_id: campaignId, rest_type: 'long' }),
        });
      } catch { /* ignore broadcast errors */ }
    } catch (e) {
      toast.error('Failed to complete long rest');
      console.error(e);
    } finally {
      setRestingLong(false);
    }
  };

  const handleShortRest = async () => {
    setRestingShort(true);
    try {
      const result = await invoke('campaign_short_rest');
      toast.success('Short rest completed');
      dispatch({ type: 'LOG_ACTION', payload: `Short rest: ${result.players_count} player(s)` });
      try {
        await invoke('ws_broadcast_event', {
          eventJson: JSON.stringify({ type: 'RestCompleted', campaign_id: campaignId, rest_type: 'short' }),
        });
      } catch { /* ignore broadcast errors */ }
    } catch (e) {
      toast.error('Failed to complete short rest');
      console.error(e);
    } finally {
      setRestingShort(false);
    }
  };

  // Random Encounter Engine handlers
  const handleGenerateEncounter = async (prompt) => {
    setEncounterGenerating(true);
    setEncounterResult(null);
    try {
      const result = await invoke('generate_encounter', {
        prompt,
        encounterType: encounterCategory || null,
        partyLevel: null,
        setting: null,
      });
      // Try to parse as JSON, fall back to raw text
      let parsed;
      try {
        // Extract JSON from markdown code blocks if present
        const jsonMatch = result.match(/```(?:json)?\s*([\s\S]*?)```/);
        parsed = JSON.parse(jsonMatch ? jsonMatch[1] : result);
      } catch {
        parsed = { opening_narration: result, player_text: result, mood: 'mysterious' };
      }
      setEncounterResult(parsed);
      toast.success('Encounter generated!');
    } catch (err) {
      toast.error(`Generation failed: ${err}`);
    }
    setEncounterGenerating(false);
  };

  const handleInjectEncounter = async () => {
    if (!encounterResult) return;
    const text = encounterResult.player_text || encounterResult.opening_narration || 'Something stirs...';
    try {
      await broadcastEvent({
        type: 'NarrativeText',
        text,
        mood: encounterResult.mood || 'mysterious',
      });
      dispatch({ type: 'LOG_ACTION', payload: `Injected encounter: ${text.slice(0, 60)}...` });
      toast.success('Encounter injected to players!');
    } catch {
      toast.error('Failed to inject encounter');
    }
  };

  // Start WS server on mount, stop on unmount
  const wsStartedRef = useRef(false);
  const [serverAddr, setServerAddr] = useState(null);

  useEffect(() => {
    if (wsStartedRef.current) return;
    wsStartedRef.current = true;
    (async () => {
      try {
        const addr = await invoke('ws_start_server', {});
        setServerAddr(addr);
        dispatch({ type: 'LOG_ACTION', payload: `Session server started at ${addr}` });
      } catch (e) {
        // Server may already be running from lobby
        console.warn('WS server start:', e);
      }
    })();
    return () => {
      invoke('ws_stop_server').catch(() => {}); // Cleanup on unmount — safe to ignore
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Poll connected players every 3s — include all statuses for visibility
  useEffect(() => {
    const poll = async () => {
      try {
        const players = await invoke('ws_get_connected');
        dispatch({ type: 'SET_PLAYERS', payload: players.map(p => ({
          id: p.uuid || p.player_uuid,
          name: p.display_name || p.name || 'Player',
          connected: p.status === 'approved' || p.status === 'connected',
          playerStatus: p.status || 'disconnected',
          ...p,
        }))});
      } catch { /* server not running yet */ }
    };
    poll();
    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [dispatch]);

  // Listen for ALL incoming game events from players
  const connectedPlayersRef = useRef(connectedPlayers);
  connectedPlayersRef.current = connectedPlayers;
  useEffect(() => {
    let unlisten;
    listen('session-game-event', (event) => {
      const { from, event: gameEvent } = event.payload || {};
      if (!gameEvent?.type) return;
      const players = connectedPlayersRef.current;

      switch (gameEvent.type) {
        case 'RollBroadcast': {
          const label = gameEvent.label ? ` (${gameEvent.label})` : '';
          const playerName = players.find(p => p.id === gameEvent.player_uuid)?.name || from || 'Player';
          dispatch({
            type: 'LOG_ACTION',
            payload: `${playerName} rolled ${gameEvent.expression} → ${gameEvent.total}${label}`,
          });
          break;
        }
        case 'CharUpdate': {
          dispatch({ type: 'LOG_ACTION', payload: `${from || 'Player'} updated character data` });
          break;
        }
        case 'ConcentrationUpdate': {
          const playerName = players.find(p => p.id === gameEvent.player_uuid)?.name || from || 'Player';
          dispatch({ type: 'LOG_ACTION', payload: `${playerName} ${gameEvent.spell ? 'concentrating on ' + gameEvent.spell : 'dropped concentration'}` });
          break;
        }
        case 'ActionRequest': {
          const playerName = players.find(p => p.id === gameEvent.player_uuid)?.name || from || 'Player';
          toast(`${playerName} requests: ${gameEvent.description || gameEvent.action_type}`, {
            icon: '\u2753', duration: 6000,
            style: { background: '#1a1520', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' },
          });
          dispatch({ type: 'WS_GAME_EVENT', payload: { from, event: gameEvent } });
          break;
        }
        case 'ChatMessage': {
          const senderName = players.find(p => p.id === from)?.name || gameEvent.sender || from || 'Player';
          dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { sender: senderName, message: gameEvent.message, timestamp: gameEvent.timestamp } });
          dispatch({ type: 'LOG_ACTION', payload: `${senderName}: ${gameEvent.message}` });
          break;
        }
        default:
          break;
      }
    }).then(fn => { unlisten = fn; });
    return () => { if (unlisten) unlisten(); };
  }, [dispatch]);

  // Listen for join requests — auto-approve with current game state snapshot
  const gameStateRef = useRef({ currentScene, initiative, round, currentTurn, sessionId, campaignName, campaignId });
  gameStateRef.current = { currentScene, initiative, round, currentTurn, sessionId, campaignName, campaignId };
  useEffect(() => {
    let unlisten;
    listen('session-join-request', (event) => {
      const { player_uuid, display_name } = event.payload || {};
      dispatch({ type: 'LOG_ACTION', payload: `${display_name || 'Player'} requested to join` });
      toast(`${display_name || 'Player'} wants to join!`, { icon: '👤', duration: 5000 });

      const gs = gameStateRef.current;
      const snapshot = JSON.stringify({
        type: 'FullStateSnapshot',
        campaign_id: gs.campaignId || '',
        state: {
          scene: gs.currentScene || null,
          initiative: gs.initiative || [],
          round: gs.round || 0,
          current_turn: gs.currentTurn || 0,
          encounter_active: (gs.initiative && gs.initiative.length > 0) || false,
          session_id: gs.sessionId || '',
          campaign_name: gs.campaignName || '',
        },
      });

      invoke('ws_approve_player', { player_uuid, snapshot_json: snapshot }).catch(e => {
        console.error('Auto-approve failed:', e);
      });
    }).then(fn => { unlisten = fn; });
    return () => { if (unlisten) unlisten(); };
  }, [dispatch]);

  // Session timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Restore timer from localStorage on mount (crash recovery)
  useEffect(() => {
    const key = `codex-session-timer-${sessionId || campaignId}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const { elapsed, savedAt } = JSON.parse(saved);
        // Only restore if saved within last 2 hours
        if (elapsed > 0 && Date.now() - savedAt < 7200000) {
          setElapsedSeconds(elapsed);
        }
      }
    } catch { /* ignore parse errors */ }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist timer to localStorage every 30s for crash recovery
  const elapsedRef = useRef(elapsedSeconds);
  elapsedRef.current = elapsedSeconds;
  useEffect(() => {
    const key = `codex-session-timer-${sessionId || campaignId}`;
    const saveInterval = setInterval(() => {
      if (elapsedRef.current > 0) {
        localStorage.setItem(key, JSON.stringify({ elapsed: elapsedRef.current, savedAt: Date.now() }));
      }
    }, 30000);
    return () => clearInterval(saveInterval);
  }, [sessionId, campaignId]);

  // Load scenes on mount
  useEffect(() => {
    invoke('list_scenes')
      .then(setScenes)
      .catch(e => console.error('Failed to load scenes:', e));
  }, []);

  // Load quests for quest runner
  useEffect(() => {
    if (!campaignId) return;
    invoke('list_campaign_quests', { campaignId })
      .then(setQuests)
      .catch(e => console.warn('Failed to load quests:', e));
    invoke('list_campaign_npcs', { campaignId })
      .then(setQuestNpcs)
      .catch(e => console.warn('Failed to load NPCs:', e));
  }, [campaignId]);

  const handleEndSession = async () => {
    if (endSessionDebounce.current) return;
    endSessionDebounce.current = true;
    setTimeout(() => { endSessionDebounce.current = false; }, 2000);
    setEnding(true);
    try {
      await invoke('end_session', { sessionId });
      // Broadcast session end to all players
      await invoke('ws_broadcast_event', {
        eventJson: JSON.stringify({ type: 'SessionEnd', campaign_id: campaignId }),
      }).catch(e => console.warn('[DMSession] Failed to broadcast session end:', e));
      await invoke('ws_stop_server').catch(e => console.warn('[DMSession] Failed to stop WS server:', e));
      dispatch({ type: 'END_SESSION' });
      // Clean up saved timer
      localStorage.removeItem(`codex-session-timer-${sessionId || campaignId}`);
      toast.success(`Session ended after ${formatTimer(elapsedSeconds)}`);
      navigate(`/dm/lobby/${campaignId}`);
    } catch (e) {
      toast.error('Failed to end session');
      console.error(e);
    } finally {
      setEnding(false);
    }
  };

  const handleExportSession = async () => {
    if (!sessionId) {
      toast.error('No active session to export');
      return;
    }
    setExporting(true);
    try {
      const markdown = await invoke('export_session_markdown', { sessionId });
      // Create a downloadable file
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const date = new Date().toISOString().split('T')[0];
      a.download = `session-${campaignName || 'campaign'}-${date}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Session log exported!');
    } catch (err) {
      toast.error(`Export failed: ${err}`);
    }
    setExporting(false);
  };

  const handleNextTurn = () => {
    // Compute next turn values before dispatch (state won't update synchronously)
    const nextTurn = (currentTurn + 1) % Math.max(initiative.length, 1);
    const nextRound = nextTurn === 0 ? round + 1 : round;
    const combatant = initiative[nextTurn];

    dispatch({ type: 'NEXT_TURN' });
    dispatch({ type: 'LOG_ACTION', payload: 'Advanced to next turn' });
    // Broadcast to players with required round & combatant_id fields
    invoke('ws_broadcast_event', {
      eventJson: JSON.stringify({
        type: 'TurnAdvance',
        campaign_id: campaignId,
        combatant_id: combatant?.id || combatant?.name || '',
        round: nextRound,
      }),
    }).catch(e => console.warn('[DMSession] Broadcast failed:', e));
  };

  const handleSelectScene = (scene) => {
    dispatch({ type: 'SET_SCENE', payload: scene });
    dispatch({ type: 'LOG_ACTION', payload: `Scene changed to: ${scene.name}` });
    invoke('ws_broadcast_event', {
      eventJson: JSON.stringify({
        type: 'SceneAdvance', campaign_id: campaignId,
        scene_id: scene.id, scene_name: scene.name,
        player_description: scene.player_description || scene.description || '',
        mood: scene.mood || '', phase: scene.phase || '',
      }),
    }).catch(e => console.warn('[DMSession] Broadcast failed:', e));
  };

  // M-14: Award XP
  const handleAwardXp = async () => {
    if (!xpAmount || xpSelectedPlayers.length === 0) return;
    setAwardingXp(true);
    try {
      await invoke('award_xp', {
        playerIds: xpSelectedPlayers,
        amount: parseInt(xpAmount) || 0,
        reason: xpReason || 'Encounter',
      });
      toast.success(`Awarded ${xpAmount} XP to ${xpSelectedPlayers.length} player(s)`);
      dispatch({ type: 'LOG_ACTION', payload: `Awarded ${xpAmount} XP: ${xpReason || 'Encounter'}` });
      // Broadcast to players
      invoke('ws_broadcast_event', {
        eventJson: JSON.stringify({
          type: 'XpAwarded', campaign_id: campaignId,
          amount: parseInt(xpAmount) || 0, reason: xpReason || 'Encounter',
          player_ids: xpSelectedPlayers,
        }),
      }).catch(e => console.warn('[DMSession] Broadcast failed:', e));
      setShowXpModal(false);
      setXpAmount('');
      setXpReason('');
      setXpSelectedPlayers([]);
    } catch (e) {
      toast.error('Failed to award XP');
      console.error(e);
    } finally {
      setAwardingXp(false);
    }
  };

  // M-16: Toggle inspiration
  const handleToggleInspiration = async (playerId) => {
    try {
      const newVal = await invoke('toggle_inspiration', { playerId });
      toast.success(newVal ? 'Inspiration granted!' : 'Inspiration removed');
      dispatch({ type: 'LOG_ACTION', payload: `Inspiration ${newVal ? 'granted' : 'removed'}` });
      // Broadcast to players
      invoke('ws_broadcast_event', {
        eventJson: JSON.stringify({
          type: 'InspirationAwarded', campaign_id: campaignId,
          player_id: playerId, inspired: newVal,
        }),
      }).catch(e => console.warn('[DMSession] Broadcast failed:', e));
    } catch (e) {
      toast.error('Failed to toggle inspiration');
      console.error(e);
    }
  };

  // M-17: Calculate passive perception from player data
  const getPassivePerception = (player) => {
    // If we have it from sync data, use it directly
    if (player.passive_perception !== undefined && player.passive_perception !== null) {
      return player.passive_perception;
    }
    // Default fallback
    return 10;
  };

  // M-18: Parse spell slots from player data
  const parseSpellSlots = (player) => {
    try {
      if (!player.spell_slots_json) return null;
      const slots = typeof player.spell_slots_json === 'string'
        ? JSON.parse(player.spell_slots_json)
        : player.spell_slots_json;
      if (!slots || Object.keys(slots).length === 0) return null;
      return slots;
    } catch { return null; }
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
      gridTemplateRows: 'auto 1fr auto',
      paddingTop: 'var(--dev-banner-h, 0px)',
    }}>
      {/* ── Top Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex', alignItems: 'center', gap: '16px',
          padding: '10px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(4,4,11,0.8)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Campaign name */}
        <div style={{
          fontFamily: 'var(--font-display, "Cinzel", serif)',
          fontSize: '16px', fontWeight: 700,
          color: 'var(--text, #e8d9b5)',
        }}>
          {campaignName || 'Session'}
        </div>

        <div style={{ flex: 1 }} />

        {/* Session timer */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '4px 12px', borderRadius: '6px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <Clock size={13} style={{ color: '#fbbf24' }} />
          <span style={{
            fontSize: '14px', fontWeight: 700,
            color: '#fbbf24',
            fontFamily: 'var(--font-mono, monospace)',
            minWidth: '60px', textAlign: 'center',
          }}>
            {formatTimer(elapsedSeconds)}
          </span>
        </div>

        {/* Round counter */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '4px 12px', borderRadius: '6px',
          background: 'rgba(155,89,182,0.1)',
          border: '1px solid rgba(155,89,182,0.2)',
        }}>
          <Swords size={13} style={{ color: '#c084fc' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#c084fc' }}>
            Round {round}
          </span>
        </div>

        {/* End session */}
        <button
          onClick={handleEndSession}
          disabled={ending}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 16px', borderRadius: '8px',
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#fca5a5', fontSize: '12px', fontWeight: 600,
            cursor: ending ? 'wait' : 'pointer',
            fontFamily: 'var(--font-ui)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            if (!ending) {
              e.currentTarget.style.background = 'rgba(239,68,68,0.25)';
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)';
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.15)';
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
          }}
        >
          <Square size={12} /> {ending ? 'Ending...' : 'End Session'}
        </button>
      </motion.div>

      {/* ── Main Grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr 280px',
        gap: '12px',
        padding: '12px',
        overflow: 'hidden',
      }}>
        {/* LEFT: Initiative Tracker */}
        <div style={panelStyle}>
          <div style={panelHeaderStyle}>
            <Swords size={12} /> Initiative
          </div>
          <div style={{ padding: '12px', overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
            {initiative.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '32px 8px',
                color: 'var(--text-mute)', fontSize: '12px',
              }}>
                <Dice5 size={24} style={{ opacity: 0.3, marginBottom: '8px' }} />
                <p>No initiative set</p>
                <p style={{ fontSize: '11px', opacity: 0.6, marginTop: '4px' }}>
                  Start an encounter to roll initiative
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '4px' }}>
                {initiative.map((entry, idx) => (
                  <div
                    key={entry.id || idx}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '8px 10px', borderRadius: '8px',
                      background: idx === currentTurn ? 'rgba(155,89,182,0.15)' : 'rgba(255,255,255,0.02)',
                      border: idx === currentTurn ? '1px solid rgba(155,89,182,0.3)' : '1px solid transparent',
                    }}
                  >
                    <span style={{
                      fontSize: '14px', fontWeight: 700, color: '#c084fc',
                      fontFamily: 'var(--font-mono)', minWidth: '24px', textAlign: 'center',
                    }}>
                      {entry.initiative ?? '—'}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '12px', fontWeight: 500,
                        color: idx === currentTurn ? 'var(--text)' : 'var(--text-dim)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {entry.name}
                      </div>
                    </div>
                    {entry.hp !== undefined && (
                      <span style={{
                        fontSize: '11px', color: entry.hp > 0 ? '#4ade80' : '#ef4444',
                        fontFamily: 'var(--font-mono)',
                      }}>
                        {entry.hp}/{entry.maxHp}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            {initiative.length > 0 && (
              <button
                onClick={handleNextTurn}
                style={{
                  width: '100%', marginTop: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  padding: '8px', borderRadius: '8px',
                  background: 'rgba(155,89,182,0.12)',
                  border: '1px solid rgba(155,89,182,0.25)',
                  color: '#c084fc', fontSize: '12px', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'var(--font-ui)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(155,89,182,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(155,89,182,0.12)'}
              >
                <SkipForward size={13} /> Next Turn
              </button>
            )}
          </div>
        </div>

        {/* CENTER: Scene & Encounter */}
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '12px' }}>
          {/* Scene Info */}
          <div style={panelStyle}>
            <div style={panelHeaderStyle}>
              <MapPin size={12} /> Current Scene
            </div>
            <div style={{ padding: '16px' }}>
              {currentScene ? (
                <>
                  <h3 style={{
                    fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600,
                    color: 'var(--text)', margin: '0 0 6px',
                  }}>
                    {currentScene.name}
                  </h3>
                  {currentScene.location && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      fontSize: '12px', color: 'var(--text-mute)', marginBottom: '8px',
                    }}>
                      <MapPin size={10} /> {currentScene.location}
                    </div>
                  )}
                  {currentScene.description && (
                    <p style={{
                      fontSize: '13px', color: 'var(--text-dim)',
                      lineHeight: 1.5, margin: 0,
                    }}>
                      {currentScene.description}
                    </p>
                  )}
                  {currentScene.mood && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '11px', color: 'var(--text-mute)' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(155,89,182,0.1)', border: '1px solid rgba(155,89,182,0.2)', color: '#c084fc', fontSize: '10px', fontWeight: 600 }}>
                        {currentScene.mood}
                      </span>
                      {currentScene.phase && (
                        <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', color: '#c9a84c', fontSize: '10px', fontWeight: 600, textTransform: 'capitalize' }}>
                          {currentScene.phase}
                        </span>
                      )}
                    </div>
                  )}
                  {currentScene.player_description && (
                    <div style={{ marginTop: '8px', padding: '8px 10px', borderRadius: '6px', background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.1)', fontSize: '11px', color: 'var(--text-dim)', lineHeight: 1.5 }}>
                      <div style={{ fontSize: '9px', fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Player-visible</div>
                      {currentScene.player_description}
                    </div>
                  )}
                  {currentScene.dm_notes && (
                    <div style={{ marginTop: '6px', padding: '8px 10px', borderRadius: '6px', background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.1)', fontSize: '11px', color: '#c4b5fd', lineHeight: 1.5 }}>
                      <div style={{ fontSize: '9px', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>DM Notes</div>
                      {currentScene.dm_notes}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ color: 'var(--text-mute)', fontSize: '13px' }}>
                  <p style={{ margin: '0 0 12px' }}>No scene selected. Choose a scene:</p>
                  <div style={{ display: 'grid', gap: '6px' }}>
                    {scenes.map(s => (
                      <button
                        key={s.id}
                        onClick={() => handleSelectScene(s)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '8px 12px', borderRadius: '8px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          color: 'var(--text-dim)', fontSize: '12px',
                          cursor: 'pointer', fontFamily: 'var(--font-ui)',
                          textAlign: 'left', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                          e.currentTarget.style.color = 'var(--text)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                          e.currentTarget.style.color = 'var(--text-dim)';
                        }}
                      >
                        <MapPin size={11} /> {s.name}
                        <ChevronRight size={11} style={{ marginLeft: 'auto', opacity: 0.4 }} />
                      </button>
                    ))}
                    {scenes.length === 0 && (
                      <span style={{ fontSize: '12px', opacity: 0.5 }}>
                        No scenes available. Add scenes in the lobby.
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Encounter Controls */}
          <div style={panelStyle}>
            <div style={{ ...panelHeaderStyle, justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Swords size={12} /> Encounter
              </span>
              {!encounterActive ? (
                <button
                  onClick={handleStartEncounter}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    padding: '3px 10px', borderRadius: '6px',
                    background: 'rgba(74,222,128,0.12)',
                    border: '1px solid rgba(74,222,128,0.25)',
                    color: '#4ade80', fontSize: '10px', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'var(--font-ui)',
                  }}
                >
                  <Play size={10} /> Start
                </button>
              ) : (
                <button
                  onClick={handleEndEncounter}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    padding: '3px 10px', borderRadius: '6px',
                    background: 'rgba(239,68,68,0.12)',
                    border: '1px solid rgba(239,68,68,0.25)',
                    color: '#fca5a5', fontSize: '10px', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'var(--font-ui)',
                  }}
                >
                  <StopCircle size={10} /> End
                </button>
              )}
            </div>
            <div style={{ padding: '12px', overflowY: 'auto', maxHeight: 'calc(100% - 44px)' }}>
              {!encounterActive ? (
                <div style={{
                  textAlign: 'center', padding: '24px 8px',
                  color: 'var(--text-mute)', fontSize: '12px',
                }}>
                  <Shield size={28} style={{ opacity: 0.2, marginBottom: '8px' }} />
                  <p style={{ margin: 0 }}>No active encounter</p>
                  <p style={{ fontSize: '11px', opacity: 0.5, marginTop: '4px' }}>
                    Select a scene and start an encounter
                  </p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '6px' }}>
                  {encounterMonsters.length === 0 ? (
                    <div style={{
                      textAlign: 'center', padding: '12px',
                      color: 'var(--text-mute)', fontSize: '11px',
                    }}>
                      No monsters in encounter
                    </div>
                  ) : (
                    encounterMonsters.map(m => (
                      <div key={m.id} style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '6px 10px', borderRadius: '8px',
                        background: m.alive ? 'rgba(255,255,255,0.03)' : 'rgba(239,68,68,0.05)',
                        border: `1px solid ${m.alive ? 'rgba(255,255,255,0.06)' : 'rgba(239,68,68,0.15)'}`,
                        opacity: m.alive ? 1 : 0.5,
                      }}>
                        <span style={{
                          fontSize: '12px', fontWeight: 500,
                          color: m.alive ? 'var(--text)' : '#ef4444',
                          flex: 1, minWidth: 0, overflow: 'hidden',
                          textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          textDecoration: m.alive ? 'none' : 'line-through',
                        }}>
                          {m.name}
                        </span>
                        <span style={{
                          fontSize: '11px', fontWeight: 600,
                          fontFamily: 'var(--font-mono)',
                          color: m.hp_current > m.hp_max * 0.25 ? '#4ade80' : '#ef4444',
                        }}>
                          {m.hp_current}/{m.hp_max}
                        </span>
                        {m.alive && (
                          <>
                            <button
                              onClick={() => handleMonsterHp(m.id, -5)}
                              title="Deal 5 damage"
                              style={{
                                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                                borderRadius: '4px', padding: '2px 6px', cursor: 'pointer',
                                color: '#fca5a5', fontSize: '10px', fontWeight: 700,
                                fontFamily: 'var(--font-mono)',
                              }}
                            >-5</button>
                            <button
                              onClick={() => handleMonsterHp(m.id, 5)}
                              title="Heal 5"
                              style={{
                                background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)',
                                borderRadius: '4px', padding: '2px 6px', cursor: 'pointer',
                                color: '#4ade80', fontSize: '10px', fontWeight: 700,
                                fontFamily: 'var(--font-mono)',
                              }}
                            >+5</button>
                            <button
                              onClick={() => handleKillMonster(m.id)}
                              title="Kill monster"
                              style={{
                                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                                borderRadius: '4px', padding: '2px 4px', cursor: 'pointer',
                                color: '#fca5a5', display: 'flex', alignItems: 'center',
                              }}
                            >
                              <Skull size={11} />
                            </button>
                          </>
                        )}
                      </div>
                    ))
                  )}
                  {/* Pending action requests from players */}
                  {pendingActions.length > 0 && (
                    <div style={{
                      marginTop: '8px', padding: '8px',
                      borderRadius: '8px',
                      background: 'rgba(251,191,36,0.06)',
                      border: '1px solid rgba(251,191,36,0.15)',
                    }}>
                      <div style={{
                        fontSize: '10px', fontWeight: 700, color: '#fbbf24',
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                        marginBottom: '6px', fontFamily: 'var(--font-mono)',
                      }}>Action Requests</div>
                      {pendingActions.map(req => (
                        <div key={req.requestId} style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          padding: '4px 0', fontSize: '11px', color: 'var(--text-dim)',
                        }}>
                          <span style={{ flex: 1 }}>{req.description}</span>
                          <button
                            onClick={() => handleApproveAction(req)}
                            style={{
                              background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.25)',
                              borderRadius: '4px', padding: '2px 6px', cursor: 'pointer',
                              color: '#4ade80', fontSize: '10px', fontWeight: 600,
                              display: 'flex', alignItems: 'center', gap: '2px',
                            }}
                          ><Check size={10} /></button>
                          <button
                            onClick={() => handleDenyAction(req)}
                            style={{
                              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.25)',
                              borderRadius: '4px', padding: '2px 6px', cursor: 'pointer',
                              color: '#fca5a5', fontSize: '10px', fontWeight: 600,
                              display: 'flex', alignItems: 'center', gap: '2px',
                            }}
                          ><X size={10} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Players, Handouts & Action Log */}
        <div style={{ display: 'grid', gridTemplateRows: 'auto auto 1fr', gap: '12px' }}>
          {/* Connected Players */}
          <div style={panelStyle}>
            <div style={panelHeaderStyle}>
              <Users size={12} /> Players ({connectedPlayers.filter(p => p.connected).length}/{connectedPlayers.length})
            </div>
            <div style={{ padding: '12px' }}>
              {connectedPlayers.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '16px 8px',
                  color: 'var(--text-mute)', fontSize: '12px',
                }}>
                  No players connected
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '6px' }}>
                  {connectedPlayers.map(p => (
                    <div key={p.id}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '6px 10px', borderRadius: '6px',
                        background: 'rgba(255,255,255,0.03)',
                        cursor: 'pointer',
                      }}
                        onClick={() => setExpandedPlayer(expandedPlayer === p.id ? null : p.id)}
                      >
                        {/* M-16: Inspiration star */}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleToggleInspiration(p.id); }}
                          title={p.inspiration ? 'Remove inspiration' : 'Grant inspiration'}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            padding: '0', display: 'flex', alignItems: 'center',
                            color: p.inspiration ? '#fbbf24' : 'rgba(255,255,255,0.15)',
                            filter: p.inspiration ? 'drop-shadow(0 0 4px rgba(251,191,36,0.5))' : 'none',
                            transition: 'all 0.2s',
                          }}
                        >
                          <Star size={12} fill={p.inspiration ? '#fbbf24' : 'none'} />
                        </button>
                        <div title={p.playerStatus === 'pending' ? 'Pending' : p.connected ? 'Connected' : 'Disconnected'} style={{
                          width: '6px', height: '6px', borderRadius: '50%',
                          background: p.playerStatus === 'pending' ? '#eab308' : p.connected ? '#4ade80' : '#ef4444',
                          boxShadow: p.playerStatus === 'pending' ? '0 0 4px rgba(234,179,8,0.5)' : p.connected ? '0 0 4px rgba(74,222,128,0.5)' : 'none',
                        }} />
                        <span style={{ fontSize: '12px', color: 'var(--text)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                        {/* M-17: Passive Perception */}
                        <span title="Passive Perception" style={{
                          display: 'flex', alignItems: 'center', gap: '2px',
                          fontSize: '10px', color: 'var(--text-mute)',
                          fontFamily: 'var(--font-mono)',
                        }}>
                          <Eye size={9} style={{ opacity: 0.6 }} />
                          {getPassivePerception(p)}
                        </span>
                        {p.hp !== undefined && p.maxHp !== undefined && (
                          <span style={{
                            fontSize: '11px',
                            color: p.hp > p.maxHp * 0.25 ? '#4ade80' : '#ef4444',
                            fontFamily: 'var(--font-mono)',
                          }}>
                            {p.hp}/{p.maxHp}
                          </span>
                        )}
                      </div>
                      {/* M-18: Spell Slot detail view */}
                      {expandedPlayer === p.id && (() => {
                        const slots = parseSpellSlots(p);
                        if (!slots) return null;
                        return (
                          <div style={{
                            padding: '6px 10px 8px', marginTop: '2px',
                            background: 'rgba(155,89,182,0.05)',
                            borderRadius: '0 0 6px 6px',
                            border: '1px solid rgba(155,89,182,0.1)',
                            borderTop: 'none',
                          }}>
                            <div style={{
                              fontSize: '9px', fontWeight: 700, color: 'var(--text-mute)',
                              letterSpacing: '0.06em', textTransform: 'uppercase',
                              marginBottom: '4px', fontFamily: 'var(--font-mono)',
                            }}>Spell Slots</div>
                            <div style={{ display: 'grid', gap: '2px' }}>
                              {Object.entries(slots).filter(([_, v]) => {
                                const max = typeof v === 'object' ? (v.max || v.total || 0) : v;
                                return max > 0;
                              }).map(([level, val]) => {
                                const max = typeof val === 'object' ? (val.max || val.total || 0) : val;
                                const used = typeof val === 'object' ? (val.used || 0) : 0;
                                const remaining = max - used;
                                return (
                                  <div key={level} style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    fontSize: '10px',
                                  }}>
                                    <span style={{
                                      color: 'var(--text-mute)', fontFamily: 'var(--font-mono)',
                                      minWidth: '18px',
                                    }}>L{level}</span>
                                    <div style={{ display: 'flex', gap: '3px' }}>
                                      {Array.from({ length: max }, (_, i) => (
                                        <div key={i} style={{
                                          width: '8px', height: '8px', borderRadius: '50%',
                                          background: i < remaining ? '#c084fc' : 'rgba(255,255,255,0.08)',
                                          border: '1px solid rgba(155,89,182,0.3)',
                                        }} />
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Story & Narration */}
          <StoryPanel
            campaignId={campaignId}
            onBroadcast={async (evt) => {
              try {
                await invoke('ws_broadcast_event', { eventJson: JSON.stringify(evt) });
              } catch { /* no players connected */ }
            }}
          />

          {/* Prompt Results Panel */}
          {Object.keys(promptResults).length > 0 && (
            <div style={panelStyle}>
              <div style={panelHeaderStyle}>
                <Dice5 size={12} /> Prompt Results
              </div>
              <div style={{ padding: '8px 12px', maxHeight: '200px', overflowY: 'auto' }}>
                {Object.entries(promptResults).map(([promptId, results]) => {
                  if (!results || results.length === 0) return null;
                  const historyEntry = promptHistory.find(h => h.prompt_id === promptId);
                  const dc = historyEntry?.dc;
                  const passCount = dc ? results.filter(r => (r.total || r.roll_total || 0) >= dc).length : 0;
                  return (
                    <div key={promptId} style={{ marginBottom: '8px', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: '10px', fontWeight: 600, color: '#c9a84c', marginBottom: '4px' }}>
                        {historyEntry?.label || promptId.slice(0, 12)}
                        {dc ? <span style={{ color: 'var(--text-mute)', marginLeft: '6px' }}>DC {dc}</span> : null}
                        {dc ? <span style={{ marginLeft: '8px', color: passCount > 0 ? '#4ade80' : '#ef4444', fontWeight: 700 }}>{passCount}/{results.length} passed</span> : null}
                      </div>
                      {results.map((r, i) => {
                        const total = r.total || r.roll_total || 0;
                        const passed = dc ? total >= dc : null;
                        return (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '2px 0', fontSize: '11px' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text)', minWidth: '60px' }}>{r.name || resolvePlayerName(r.client_id)}</span>
                            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>{r.breakdown || `${total}`}</span>
                            <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: passed === true ? '#4ade80' : passed === false ? '#ef4444' : '#c9a84c' }}>{total}</span>
                            {passed !== null && (
                              <span style={{ fontSize: '9px', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', background: passed ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)', color: passed ? '#4ade80' : '#ef4444' }}>
                                {passed ? 'PASS' : 'FAIL'}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quest Runner */}
          <QuestRunner
            quests={quests}
            npcs={questNpcs}
            scenes={scenes}
            onAdvanceBeat={async (questId) => {
              try {
                const result = await invoke('advance_quest_beat', { questId });
                if (result?.completed) {
                  toast.success(`Quest complete: ${result.quest_title || 'Quest'}`);
                } else {
                  toast.success(`Beat advanced: ${result?.next_beat_title || 'Next beat'}`);
                }
                await broadcastEvent({ type: 'QuestUpdated', campaign_id: campaignId, quest_id: questId });
              } catch (e) { toast.error(`Failed to advance beat: ${e}`); }
            }}
            onBroadcast={async (text) => {
              try {
                await broadcastEvent({ type: 'NarrativeText', text, campaign_id: campaignId });
                dispatch({ type: 'LOG_ACTION', payload: `Broadcast: ${text.slice(0, 60)}...` });
                toast.success('Narration broadcast to players');
              } catch { toast.error('Broadcast failed'); }
            }}
            onLoadEncounter={(enc) => toast(`Loading encounter: ${enc.length} monsters`, { icon: '\u2694\uFE0F' })}
            onRevealNpcs={(ids) => {
              ids.forEach(id => {
                broadcastEvent({ type: 'NPCDiscovered', campaign_id: campaignId, npc_id: id }).catch(e => console.warn('[DMSession] Broadcast failed:', e));
              });
              toast.success(`Revealed ${ids.length} NPC(s)`);
            }}
            onSetScene={(sceneId) => {
              const scene = scenes.find(s => s.id === sceneId);
              if (scene) handleSelectScene(scene);
            }}
          />

          {/* Prompt History */}
          {showPromptHistory && (
            <div style={panelStyle}>
              <div style={{ ...panelHeaderStyle, justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><History size={12} /> Prompt History</span>
                <button onClick={() => setShowPromptHistory(false)} style={{ background: 'none', border: 'none', color: 'var(--text-mute)', cursor: 'pointer' }}><X size={12} /></button>
              </div>
              <div style={{ padding: '8px 12px', maxHeight: '250px', overflowY: 'auto' }}>
                {promptHistory.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '12px', fontSize: '11px', color: 'var(--text-mute)' }}>No prompts sent yet</div>
                ) : promptHistory.map((h, i) => (
                  <div key={h.prompt_id || i} style={{ padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '11px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600, color: '#c9a84c' }}>{h.label || h.prompt_type}</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-mute)', fontFamily: 'var(--font-mono)' }}>
                        {h.sent_at ? new Date(h.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    {h.results && h.results.length > 0 && (
                      <div style={{ marginTop: '2px', fontSize: '10px', color: 'var(--text-dim)' }}>
                        {h.results.length} response(s) — {h.dc ? `${h.results.filter(r => (r.total || r.roll_total || 0) >= h.dc).length}/${h.results.length} passed` : 'no DC'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Handouts */}
          <HandoutsManager campaignId={campaignId} />

          {/* World State */}
          <WorldStateManager campaignId={campaignId} />

          {/* Character Arcs */}
          <CharacterArcManager campaignId={campaignId} />

          {/* Chat History */}
          {showChatHistory && (
            <div style={panelStyle}>
              <div style={{ ...panelHeaderStyle, justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MessageCircle size={12} /> Chat ({chatMessages.length})</span>
                <button onClick={() => setShowChatHistory(false)} style={{ background: 'none', border: 'none', color: 'var(--text-mute)', cursor: 'pointer' }}><X size={12} /></button>
              </div>
              <div style={{ padding: '8px 12px', maxHeight: '200px', overflowY: 'auto' }}>
                {chatMessages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '12px', fontSize: '11px', color: 'var(--text-mute)' }}>No messages yet</div>
                ) : chatMessages.map((msg, i) => (
                  <div key={i} style={{ padding: '3px 0', borderBottom: i < chatMessages.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none', fontSize: '11px' }}>
                    <span style={{ color: 'var(--text-mute)', fontSize: '10px', fontFamily: 'var(--font-mono)', marginRight: '6px' }}>
                      {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                    <span style={{ fontWeight: 600, color: msg.sender === 'DM' ? '#c084fc' : '#c9a84c', marginRight: '4px' }}>{msg.sender}:</span>
                    <span style={{ color: 'var(--text-dim)' }}>{msg.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Log */}
          <div style={panelStyle}>
            <div style={panelHeaderStyle}>
              <ScrollText size={12} /> Action Log
            </div>
            <div style={{
              padding: '8px 12px', overflowY: 'auto',
              maxHeight: 'calc(100vh - 440px)',
            }}>
              {actionLog.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '20px 8px',
                  color: 'var(--text-mute)', fontSize: '12px',
                }}>
                  Session events will appear here
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '2px' }}>
                  {actionLog.map((entry, idx) => (
                    <div key={idx} style={{
                      fontSize: '11px', color: 'var(--text-dim)',
                      padding: '3px 0',
                      borderBottom: idx < actionLog.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                    }}>
                      <span style={{
                        color: 'var(--text-mute)', fontSize: '10px',
                        fontFamily: 'var(--font-mono)',
                        marginRight: '6px',
                      }}>
                        {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {entry.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* M-14: XP Award Button */}
      {showXpModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }}
          onClick={() => setShowXpModal(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '360px', padding: '20px', borderRadius: '12px',
              background: 'var(--bg, #0a0a14)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '16px',
            }}>
              <h3 style={{
                margin: 0, fontSize: '16px', fontWeight: 700,
                color: 'var(--text)', fontFamily: 'var(--font-display)',
              }}>Award XP</h3>
              <button
                onClick={() => setShowXpModal(false)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-mute)', display: 'flex',
                }}
              ><X size={16} /></button>
            </div>

            <input
              type="number" value={xpAmount}
              onChange={e => setXpAmount(e.target.value)}
              placeholder="XP amount"
              autoFocus
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text)', fontSize: '14px',
                fontFamily: 'var(--font-ui)', outline: 'none',
                marginBottom: '8px', boxSizing: 'border-box',
              }}
            />
            <input
              type="text" value={xpReason}
              onChange={e => setXpReason(e.target.value)}
              placeholder="Reason (e.g., defeated goblins)"
              style={{
                width: '100%', padding: '8px 12px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text)', fontSize: '13px',
                fontFamily: 'var(--font-ui)', outline: 'none',
                marginBottom: '12px', boxSizing: 'border-box',
              }}
            />

            <div style={{ marginBottom: '12px' }}>
              <div style={{
                fontSize: '11px', fontWeight: 600, color: 'var(--text-mute)',
                marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>Select Players</div>
              {connectedPlayers.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--text-mute)', fontStyle: 'italic' }}>
                  No players connected
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '4px' }}>
                  {connectedPlayers.map(p => (
                    <label key={p.id} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '6px 10px', borderRadius: '6px',
                      background: xpSelectedPlayers.includes(p.id)
                        ? 'rgba(155,89,182,0.1)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${xpSelectedPlayers.includes(p.id)
                        ? 'rgba(155,89,182,0.25)' : 'rgba(255,255,255,0.05)'}`,
                      cursor: 'pointer', fontSize: '12px', color: 'var(--text-dim)',
                      transition: 'all 0.15s',
                    }}>
                      <input
                        type="checkbox"
                        checked={xpSelectedPlayers.includes(p.id)}
                        onChange={e => {
                          if (e.target.checked) {
                            setXpSelectedPlayers(prev => [...prev, p.id]);
                          } else {
                            setXpSelectedPlayers(prev => prev.filter(id => id !== p.id));
                          }
                        }}
                        style={{ accentColor: '#c084fc' }}
                      />
                      {p.name}
                    </label>
                  ))}
                  {connectedPlayers.length > 1 && (
                    <button
                      onClick={() => {
                        if (xpSelectedPlayers.length === connectedPlayers.length) {
                          setXpSelectedPlayers([]);
                        } else {
                          setXpSelectedPlayers(connectedPlayers.map(p => p.id));
                        }
                      }}
                      style={{
                        fontSize: '10px', color: '#c084fc', background: 'none',
                        border: 'none', cursor: 'pointer', padding: '4px 0',
                        fontFamily: 'var(--font-ui)', textAlign: 'left',
                      }}
                    >
                      {xpSelectedPlayers.length === connectedPlayers.length ? 'Deselect All' : 'Select All'}
                    </button>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={handleAwardXp}
              disabled={awardingXp || !xpAmount || xpSelectedPlayers.length === 0}
              style={{
                width: '100%', padding: '10px', borderRadius: '8px',
                background: xpAmount && xpSelectedPlayers.length > 0
                  ? 'rgba(155,89,182,0.2)' : 'rgba(155,89,182,0.05)',
                border: '1px solid rgba(155,89,182,0.3)',
                color: xpAmount && xpSelectedPlayers.length > 0 ? '#c084fc' : 'rgba(192,132,252,0.3)',
                fontSize: '13px', fontWeight: 600,
                cursor: xpAmount && xpSelectedPlayers.length > 0 ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-ui)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}
            >
              <Zap size={14} /> Award XP
            </button>
          </div>
        </div>
      )}

      {/* ── Bottom Quick Reference ── */}
      <div style={{
        padding: '8px 20px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(4,4,11,0.6)',
        display: 'flex', alignItems: 'center', gap: '16px',
        fontSize: '11px', color: 'var(--text-mute)',
        fontFamily: 'var(--font-mono, monospace)',
      }}>
        <span>Session: {sessionId ? sessionId.slice(0, 8) : '---'}</span>
        <span style={{ opacity: 0.3 }}>|</span>
        <span>Elapsed: {formatTimer(elapsedSeconds)}</span>
        <span style={{ opacity: 0.3 }}>|</span>
        <span>Round {round}, Turn {currentTurn + 1}</span>
        <span style={{ opacity: 0.3 }}>|</span>
        <span>{connectedPlayers.length} player{connectedPlayers.length !== 1 ? 's' : ''} connected</span>
        <span style={{ opacity: 0.3 }}>|</span>
        <button
          onClick={() => setShowXpModal(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '2px 10px', borderRadius: '4px',
            background: 'rgba(155,89,182,0.1)',
            border: '1px solid rgba(155,89,182,0.2)',
            color: '#c084fc', fontSize: '11px', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'var(--font-mono)',
          }}
        >
          <Zap size={10} /> Award XP
        </button>
        <span style={{ opacity: 0.3 }}>|</span>
        {/* M-07: Rest buttons */}
        <button
          onClick={handleShortRest}
          disabled={restingShort}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '2px 10px', borderRadius: '4px',
            background: 'rgba(251,191,36,0.1)',
            border: '1px solid rgba(251,191,36,0.2)',
            color: '#fbbf24', fontSize: '11px', fontWeight: 600,
            cursor: restingShort ? 'wait' : 'pointer',
            fontFamily: 'var(--font-mono)',
            opacity: restingShort ? 0.5 : 1,
          }}
        >
          <Sun size={10} /> {restingShort ? 'Resting...' : 'Short Rest'}
        </button>
        <button
          onClick={handleLongRest}
          disabled={restingLong}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '2px 10px', borderRadius: '4px',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.2)',
            color: '#818cf8', fontSize: '11px', fontWeight: 600,
            cursor: restingLong ? 'wait' : 'pointer',
            fontFamily: 'var(--font-mono)',
            opacity: restingLong ? 0.5 : 1,
          }}
        >
          <Moon size={10} /> {restingLong ? 'Resting...' : 'Long Rest'}
        </button>
        <span style={{ opacity: 0.3 }}>|</span>
        <button
          onClick={() => setShowEncounterEngine(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 8,
            background: 'rgba(192,132,252,0.1)',
            border: '1px solid rgba(192,132,252,0.25)',
            color: '#c084fc', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'var(--font-ui)',
          }}
        >
          <Sparkles size={13} /> Random Encounter
        </button>
        <span style={{ opacity: 0.3 }}>|</span>
        {/* Quick Checks */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <select value={quickCheckAbility} onChange={e => { setQuickCheckAbility(e.target.value); setQuickCheckSkill(''); }} style={{ padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text)', fontSize: '10px', fontFamily: 'var(--font-ui)', outline: 'none' }}>
            <option value="">Ability...</option>
            {['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'].map(a => <option key={a} value={a.toLowerCase()}>{a.slice(0,3)}</option>)}
          </select>
          <select value={quickCheckSkill} onChange={e => setQuickCheckSkill(e.target.value)} style={{ padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text)', fontSize: '10px', fontFamily: 'var(--font-ui)', outline: 'none' }}>
            <option value="">Skill...</option>
            {['Acrobatics','Animal Handling','Arcana','Athletics','Deception','History','Insight','Intimidation','Investigation','Medicine','Nature','Perception','Performance','Persuasion','Religion','Sleight of Hand','Stealth','Survival'].map(s => <option key={s} value={s.toLowerCase().replace(/ /g,'_')}>{s}</option>)}
          </select>
          <input type="number" value={quickCheckDC} onChange={e => setQuickCheckDC(e.target.value)} placeholder="DC" style={{ width: '36px', padding: '2px 4px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text)', fontSize: '10px', fontFamily: 'var(--font-mono)', outline: 'none', textAlign: 'center' }} />
          <select value={quickCheckAdvantage} onChange={e => setQuickCheckAdvantage(e.target.value)} style={{ padding: '2px 4px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: quickCheckAdvantage === 'advantage' ? '#4ade80' : quickCheckAdvantage === 'disadvantage' ? '#ef4444' : 'var(--text)', fontSize: '10px', fontFamily: 'var(--font-ui)', outline: 'none' }}>
            <option value="normal">Normal</option>
            <option value="advantage">Adv</option>
            <option value="disadvantage">Dis</option>
          </select>
          <button onClick={handleSendQuickCheck} style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', color: '#c9a84c', fontSize: '10px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>
            <Dice5 size={10} /> Check
          </button>
        </div>
        <span style={{ opacity: 0.3 }}>|</span>
        <button onClick={() => setShowPromptHistory(!showPromptHistory)} style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-mute)', fontSize: '10px', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}>
          <History size={10} /> History
        </button>
        <button onClick={() => setShowQuestRunner(!showQuestRunner)} style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', color: '#c9a84c', fontSize: '10px', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}>
          <BookMarked size={10} /> Quests
        </button>
        <button onClick={() => setShowChatHistory(!showChatHistory)} style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '2px 8px', borderRadius: '4px', background: showChatHistory ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${showChatHistory ? 'rgba(167,139,250,0.3)' : 'rgba(255,255,255,0.08)'}`, color: showChatHistory ? '#a78bfa' : 'var(--text-mute)', fontSize: '10px', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}>
          <MessageCircle size={10} /> Chat{chatMessages.length > 0 ? ` (${chatMessages.length})` : ''}
        </button>
        <button onClick={handleExportSession} disabled={exporting || !sessionId} style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-mute)', fontSize: '10px', cursor: exporting ? 'wait' : 'pointer', fontFamily: 'var(--font-mono)', opacity: exporting ? 0.5 : 1 }}>
          <Download size={10} /> {exporting ? 'Exporting...' : 'Export'}
        </button>
        <span style={{ opacity: 0.3 }}>|</span>
        {/* Chat input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, maxWidth: '300px' }}>
          <MessageCircle size={10} style={{ color: '#a78bfa', flexShrink: 0 }} />
          <input
            type="text"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSendChat(); }}
            placeholder="Message players..."
            style={{
              flex: 1, padding: '2px 8px', borderRadius: '4px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--text)', fontSize: '11px',
              fontFamily: 'var(--font-ui)', outline: 'none',
            }}
          />
          <button
            onClick={handleSendChat}
            style={{
              background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)',
              borderRadius: '4px', padding: '2px 6px', cursor: 'pointer',
              color: '#a78bfa', display: 'flex', alignItems: 'center',
            }}
          >
            <Send size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}
