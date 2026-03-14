import { createContext, useContext, useReducer, useCallback, useMemo, useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';

const SessionContext = createContext(null);

const initialState = {
  campaignId: null,
  campaignName: '',
  campaignType: 'homebrew', // 'homebrew' | 'premade'
  campaignStatus: 'active', // 'draft' | 'active' | 'archived'
  sessionId: null,
  sessionActive: false,
  connectedPlayers: [],
  pendingPlayers: [],
  connectionStatus: 'disconnected', // 'disconnected' | 'connecting' | 'connected'
  currentScene: null,
  currentEncounter: null,
  initiative: [],
  round: 0,
  currentTurn: 0,
  actionLog: [],
  chatMessages: [],
  pendingActions: [], // Action requests from players awaiting DM approval
  playerUuid: null, // UUID for this player (set on join)
};

function sessionReducer(state, action) {
  switch (action.type) {
    /* ── existing local actions ── */

    case 'SET_CAMPAIGN':
      return {
        ...state,
        campaignId: action.payload.id,
        campaignName: action.payload.name,
        campaignType: action.payload.campaign_type || 'homebrew',
        campaignStatus: action.payload.status || 'active',
      };
    case 'START_SESSION':
      return {
        ...state,
        sessionId: action.payload.sessionId,
        sessionActive: true,
        round: 0,
        currentTurn: 0,
        actionLog: [],
      };
    case 'END_SESSION':
      return {
        ...state,
        sessionId: null,
        sessionActive: false,
        initiative: [],
        round: 0,
        currentTurn: 0,
      };
    case 'SET_SCENE':
      return { ...state, currentScene: action.payload };
    case 'SET_ENCOUNTER':
      return { ...state, currentEncounter: action.payload };
    case 'SET_INITIATIVE':
      return { ...state, initiative: action.payload };
    case 'NEXT_TURN': {
      const nextTurn = (state.currentTurn + 1) % Math.max(state.initiative.length, 1);
      const nextRound = nextTurn === 0 ? state.round + 1 : state.round;
      return { ...state, currentTurn: nextTurn, round: nextRound };
    }
    case 'SET_TURN': {
      const { round: newRound, combatant_id } = action.payload;
      const turnIdx = combatant_id
        ? state.initiative.findIndex(e => e.id === combatant_id || e.name === combatant_id)
        : -1;
      return {
        ...state,
        round: newRound ?? state.round,
        currentTurn: turnIdx >= 0 ? turnIdx : (state.currentTurn + 1) % Math.max(state.initiative.length, 1),
      };
    }
    case 'ADD_PLAYER':
      return {
        ...state,
        connectedPlayers: [...state.connectedPlayers, action.payload],
      };
    case 'REMOVE_PLAYER':
      return {
        ...state,
        connectedPlayers: state.connectedPlayers.filter(p => p.id !== action.payload),
      };
    case 'SET_PLAYERS':
      return { ...state, connectedPlayers: action.payload };
    case 'LOG_ACTION':
      return {
        ...state,
        actionLog: [
          { text: action.payload, timestamp: Date.now() },
          ...state.actionLog,
        ].slice(0, 200),
      };
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatMessages: [
          ...state.chatMessages,
          { ...action.payload, timestamp: action.payload.timestamp || Date.now() },
        ].slice(-200),
      };
    case 'REMOVE_PENDING_ACTION':
      return {
        ...state,
        pendingActions: state.pendingActions.filter(a => a.requestId !== action.payload),
      };
    case 'SET_PLAYER_UUID':
      return { ...state, playerUuid: action.payload };
    case 'RESET':
      return { ...initialState };

    /* ── WebSocket / Tauri event actions ── */

    case 'SET_CONNECTION_STATUS':
      return { ...state, connectionStatus: action.payload };

    case 'ADD_PENDING_PLAYER':
      return {
        ...state,
        pendingPlayers: [...state.pendingPlayers, action.payload],
      };

    case 'REMOVE_PENDING_PLAYER':
      return {
        ...state,
        pendingPlayers: state.pendingPlayers.filter(p => p.id !== action.payload),
      };

    case 'WS_GAME_EVENT': {
      const { from, event } = action.payload;
      const label = from ? `[${from}]` : '[server]';

      switch (event.type) {
        case 'SceneAdvance':
          return {
            ...state,
            currentScene: event.scene ?? event.payload ?? null,
            actionLog: [
              { text: `${label} Scene advanced`, timestamp: Date.now() },
              ...state.actionLog,
            ].slice(0, 200),
          };

        case 'TurnAdvance':
          return {
            ...state,
            currentTurn: event.turn ?? event.currentTurn ?? state.currentTurn,
            round: event.round ?? state.round,
            actionLog: [
              { text: `${label} Turn advanced — round ${event.round ?? state.round}`, timestamp: Date.now() },
              ...state.actionLog,
            ].slice(0, 200),
          };

        case 'EncounterStart':
          return {
            ...state,
            currentEncounter: event.encounter ?? event.payload ?? null,
            initiative: event.initiative ?? [],
            actionLog: [
              { text: `${label} Encounter started`, timestamp: Date.now() },
              ...state.actionLog,
            ].slice(0, 200),
          };

        case 'EncounterEnd':
          return {
            ...state,
            currentEncounter: null,
            initiative: [],
            round: 0,
            currentTurn: 0,
            actionLog: [
              { text: `${label} Encounter ended`, timestamp: Date.now() },
              ...state.actionLog,
            ].slice(0, 200),
          };

        case 'SessionEnd':
          return {
            ...state,
            sessionId: null,
            sessionActive: false,
            initiative: [],
            round: 0,
            currentTurn: 0,
            actionLog: [
              { text: `${label} Session ended`, timestamp: Date.now() },
              ...state.actionLog,
            ].slice(0, 200),
          };

        case 'HpDelta':
          return {
            ...state,
            actionLog: [
              { text: `${label} HP changed: ${event.target ?? 'unknown'} ${event.delta >= 0 ? '+' : ''}${event.delta ?? 0}`, timestamp: Date.now() },
              ...state.actionLog,
            ].slice(0, 200),
          };

        case 'ConditionApplied':
          return {
            ...state,
            actionLog: [
              { text: `${label} Condition applied: ${event.condition ?? 'unknown'} on ${event.target ?? 'unknown'}`, timestamp: Date.now() },
              ...state.actionLog,
            ].slice(0, 200),
          };

        case 'ConditionRemoved':
          return {
            ...state,
            actionLog: [
              { text: `${label} Condition removed: ${event.condition ?? 'unknown'} from ${event.target ?? 'unknown'}`, timestamp: Date.now() },
              ...state.actionLog,
            ].slice(0, 200),
          };

        case 'RestCompleted':
          return {
            ...state,
            actionLog: [
              { text: `${label} Rest completed (${event.restType ?? 'unknown'})`, timestamp: Date.now() },
              ...state.actionLog,
            ].slice(0, 200),
          };

        case 'HandoutRevealed':
          return {
            ...state,
            actionLog: [
              { text: `${label} Handout revealed: ${event.name ?? event.handout ?? 'unknown'}`, timestamp: Date.now() },
              ...state.actionLog,
            ].slice(0, 200),
          };

        case 'InspirationAwarded':
          return {
            ...state,
            actionLog: [
              { text: `${label} Inspiration awarded to ${event.target ?? 'unknown'}`, timestamp: Date.now() },
              ...state.actionLog,
            ].slice(0, 200),
          };

        case 'XpAwarded':
          return {
            ...state,
            actionLog: [
              { text: `${label} XP awarded: ${event.amount ?? 0} to ${event.target ?? 'party'}`, timestamp: Date.now() },
              ...state.actionLog,
            ].slice(0, 200),
          };

        case 'RollBroadcast':
          return {
            ...state,
            actionLog: [
              { text: `${label} Roll: ${event.notation ?? '?'} = ${event.result ?? '?'}`, timestamp: Date.now() },
              ...state.actionLog,
            ].slice(0, 200),
          };

        case 'QuestFlagSet':
          return {
            ...state,
            actionLog: [
              { text: `${label} Quest flag set: ${event.flag ?? event.quest ?? 'unknown'}`, timestamp: Date.now() },
              ...state.actionLog,
            ].slice(0, 200),
          };

        case 'MonsterKilled':
          return {
            ...state,
            actionLog: [
              { text: `${label} Monster killed: ${event.monster_name ?? 'unknown'}`, timestamp: Date.now() },
              ...state.actionLog,
            ].slice(0, 200),
          };

        case 'LevelUp':
          return {
            ...state,
            actionLog: [
              { text: `${label} Level up! ${event.player_name ?? 'Player'} is now level ${event.new_level ?? '?'}`, timestamp: Date.now() },
              ...state.actionLog,
            ].slice(0, 200),
          };

        case 'ChatMessage':
          return {
            ...state,
            chatMessages: [
              ...state.chatMessages,
              { sender: event.sender, message: event.message, whisperTarget: event.whisper_target, timestamp: event.timestamp || Date.now() },
            ].slice(-200),
            actionLog: [
              { text: `${event.whisper_target ? '[whisper] ' : ''}${event.sender}: ${event.message}`, timestamp: Date.now() },
              ...state.actionLog,
            ].slice(0, 200),
          };

        case 'ActionRequest':
          return {
            ...state,
            pendingActions: [
              ...state.pendingActions,
              { requestId: event.request_id, playerUuid: event.player_uuid, actionType: event.action_type, description: event.description, details: event.details, timestamp: Date.now() },
            ],
            actionLog: [
              { text: `${label} Action request: ${event.description ?? event.action_type ?? 'unknown'}`, timestamp: Date.now() },
              ...state.actionLog,
            ].slice(0, 200),
          };

        case 'ActionApproved':
          return {
            ...state,
            pendingActions: state.pendingActions.filter(a => a.requestId !== event.request_id),
            actionLog: [
              { text: `${label} Action approved${event.dm_note ? ': ' + event.dm_note : ''}`, timestamp: Date.now() },
              ...state.actionLog,
            ].slice(0, 200),
          };

        case 'ActionDenied':
          return {
            ...state,
            pendingActions: state.pendingActions.filter(a => a.requestId !== event.request_id),
            actionLog: [
              { text: `${label} Action denied: ${event.reason ?? 'no reason given'}`, timestamp: Date.now() },
              ...state.actionLog,
            ].slice(0, 200),
          };

        case 'ConcentrationUpdate':
          return {
            ...state,
            actionLog: [
              { text: `${label} Concentration: ${event.spell ? event.spell : 'dropped'}`, timestamp: Date.now() },
              ...state.actionLog,
            ].slice(0, 200),
          };

        case 'NPCDiscovered':
          return {
            ...state,
            actionLog: [
              { text: `${label} NPC discovered: ${event.npc_name} (${event.role || 'unknown role'})`, timestamp: Date.now() },
              ...state.actionLog,
            ].slice(0, 200),
          };

        case 'NPCInfoRevealed':
          return {
            ...state,
            actionLog: [
              { text: `${label} New info about ${event.npc_name}: ${event.info}`, timestamp: Date.now() },
              ...state.actionLog,
            ].slice(0, 200),
          };

        case 'WorldStateChanged':
          return {
            ...state,
            actionLog: [
              { text: `${label} World update: ${event.key} changed`, timestamp: Date.now() },
              ...state.actionLog,
            ].slice(0, 200),
          };

        case 'QuestRevealed':
          return {
            ...state,
            actionLog: [
              { text: `${label} New quest available: ${event.title}`, timestamp: Date.now() },
              ...state.actionLog,
            ].slice(0, 200),
          };

        case 'QuestUpdated':
          return {
            ...state,
            actionLog: [
              { text: `${label} Quest updated: ${event.title} — ${event.status}`, timestamp: Date.now() },
              ...state.actionLog,
            ].slice(0, 200),
          };

        case 'SceneRevealed':
          return {
            ...state,
            currentScene: { id: event.scene_id, name: event.scene_name, description: event.player_description, location: event.location, mood: event.mood },
            actionLog: [
              { text: `${label} New location: ${event.scene_name}`, timestamp: Date.now() },
              ...state.actionLog,
            ].slice(0, 200),
          };

        case 'ArcUpdated':
          return {
            ...state,
            actionLog: [
              { text: `${label} Arc update: ${event.arc_title} — ${event.status}${event.latest_entry ? ': ' + event.latest_entry : ''}`, timestamp: Date.now() },
              ...state.actionLog,
            ].slice(0, 200),
          };

        default:
          // Unknown GameEvent type — just log it
          return {
            ...state,
            actionLog: [
              { text: `${label} ${event.type}: ${JSON.stringify(event)}`, timestamp: Date.now() },
              ...state.actionLog,
            ].slice(0, 200),
          };
      }
    }

    default:
      return state;
  }
}

export function SessionProvider({ children }) {
  const [state, rawDispatch] = useReducer(sessionReducer, initialState);

  const dispatch = useCallback((action) => {
    rawDispatch(action);
  }, []);

  /* ── Tauri event listeners ── */

  useEffect(() => {
    const unlisteners = [];

    async function setupListeners() {
      // DM side: a player is requesting to join
      unlisteners.push(
        await listen('session-join-request', (e) => {
          dispatch({ type: 'ADD_PENDING_PLAYER', payload: e.payload });
        })
      );

      // A player was approved and has joined the session
      unlisteners.push(
        await listen('session-player-joined', (e) => {
          dispatch({ type: 'ADD_PLAYER', payload: e.payload });
          // Remove from pending if they were there
          if (e.payload?.id) {
            dispatch({ type: 'REMOVE_PENDING_PLAYER', payload: e.payload.id });
          }
        })
      );

      // A player disconnected
      unlisteners.push(
        await listen('session-player-left', (e) => {
          const playerId = typeof e.payload === 'string' ? e.payload : e.payload?.id;
          if (playerId) {
            dispatch({ type: 'REMOVE_PLAYER', payload: playerId });
          }
        })
      );

      // Any GameEvent from the WebSocket (contains { from, event } where event has a type field)
      unlisteners.push(
        await listen('session-game-event', (e) => {
          dispatch({ type: 'WS_GAME_EVENT', payload: e.payload });
        })
      );

      // Connection state changes
      unlisteners.push(
        await listen('session-connection-status', (e) => {
          dispatch({ type: 'SET_CONNECTION_STATUS', payload: e.payload });
        })
      );
    }

    setupListeners();

    return () => {
      unlisteners.forEach((unlisten) => {
        if (typeof unlisten === 'function') unlisten();
      });
    };
  }, [dispatch]);

  /* ── Helper functions for sending events over WS ── */

  const broadcastEvent = useCallback(async (eventObj) => {
    try {
      await invoke('ws_broadcast_event', { eventJson: JSON.stringify(eventObj) });
    } catch (err) {
      console.error('[SessionContext] broadcastEvent failed:', err);
    }
  }, []);

  const sendToDm = useCallback(async (eventObj) => {
    try {
      await invoke('ws_send_to_dm', { eventJson: JSON.stringify(eventObj) });
    } catch (err) {
      console.error('[SessionContext] sendToDm failed:', err);
    }
  }, []);

  /* ── Context value ── */

  const value = useMemo(
    () => ({ ...state, dispatch, broadcastEvent, sendToDm }),
    [state, dispatch, broadcastEvent, sendToDm]
  );

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be inside SessionProvider');
  return ctx;
}
