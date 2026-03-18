import { createContext, useContext, useCallback, useEffect, useRef, useMemo, useReducer } from 'react';
import { invoke } from '@tauri-apps/api/core';
import toast from 'react-hot-toast';
import { useParty } from './PartyContext';

const CampaignSyncContext = createContext(null);

export function useCampaignSync() {
  const ctx = useContext(CampaignSyncContext);
  if (!ctx) throw new Error('useCampaignSync must be used within a CampaignSyncProvider');
  return ctx;
}

/** Safe version that returns null if outside provider tree (for optional usage) */
export function useCampaignSyncSafe() {
  return useContext(CampaignSyncContext);
}

const MAX_BROADCASTS = 20;
const MAX_COMBAT_LOG = 50;

// ─── Initial State ──────────────────────────────────────────────────────
const initialState = {
  // Prompts
  activePrompts: [],
  promptResults: {},
  promptHistory: [],
  // Broadcasts
  broadcasts: [],
  latestBroadcast: null,
  // Combat
  combatActive: false,
  initiativeOrder: [],
  currentTurn: 0,
  round: 1,
  turnFlash: false,
  sharedCombatLog: [],
  monsterHpTiers: {},
  monsterConditions: {},
  playerDeathSaves: {},
  incomingAttacks: [],
  // Pending player changes
  conditionChanges: [],
  equipmentRequested: false,
  pendingHpChanges: [],
  pendingRestSync: null,
  latestXpAward: null,
  pendingDeathSavePrompt: null,
  concentrationState: {},
  pendingInspiration: null,
  pendingReaction: null,
  pendingItemLoss: [],
  pendingGoldChange: [],
  pendingSlotLoss: [],
  pendingLevelUp: null,
  // Battle map
  syncedBattleMap: null,
  // Shop
  activeShop: null,
  pendingPurchases: [],
  // Atmosphere
  currentMood: null,
  ambientSound: null,
  dmSessionActive: false,
  // Quest/NPC
  latestQuestUpdate: null,
  // Communication
  pendingRestRequest: null,
  whisperMessages: [],
  pendingSkillCheck: null,
  skillCheckResults: [],
  connectedPlayerMap: {},
};

// ─── Reducer ────────────────────────────────────────────────────────────
function syncReducer(state, action) {
  switch (action.type) {
    // ── Prompts ──
    case 'ADD_PROMPT':
      return { ...state, activePrompts: [...state.activePrompts, action.payload] };
    case 'REMOVE_PROMPT':
      return { ...state, activePrompts: state.activePrompts.filter(p => p.prompt_id !== action.payload) };
    case 'SET_PROMPT_RESULT': {
      const { prompt_id, response } = action.payload;
      return {
        ...state,
        promptResults: {
          ...state.promptResults,
          [prompt_id]: [...(state.promptResults[prompt_id] || []), response],
        },
        promptHistory: state.promptHistory.map(h =>
          h.prompt_id === prompt_id
            ? { ...h, results: [...(h.results || []), response] }
            : h
        ),
      };
    }
    case 'INIT_PROMPT_RESULTS':
      return {
        ...state,
        promptResults: { ...state.promptResults, [action.payload.prompt_id]: [] },
        promptHistory: [action.payload, ...state.promptHistory].slice(0, 50),
      };
    case 'CLEAR_PROMPT_HISTORY':
      return { ...state, promptHistory: [] };

    // ── Broadcasts ──
    case 'ADD_BROADCAST': {
      const bc = action.payload;
      return {
        ...state,
        broadcasts: [bc, ...state.broadcasts].slice(0, MAX_BROADCASTS),
        latestBroadcast: bc,
      };
    }
    case 'ADD_BROADCAST_LOCAL': {
      const bc = action.payload;
      return { ...state, broadcasts: [bc, ...state.broadcasts].slice(0, MAX_BROADCASTS) };
    }
    case 'DISMISS_BROADCAST':
      return { ...state, latestBroadcast: null };

    // ── Combat ──
    case 'COMBAT_START':
      return {
        ...state,
        combatActive: true,
        initiativeOrder: action.payload.initiative || [],
        currentTurn: 0,
        round: 1,
      };
    case 'COMBAT_TURN':
      return {
        ...state,
        currentTurn: action.payload.turn ?? state.currentTurn,
        round: action.payload.round ?? state.round,
      };
    case 'COMBAT_END':
      return {
        ...state,
        combatActive: false,
        initiativeOrder: [],
        currentTurn: 0,
        round: 1,
        monsterHpTiers: {},
        monsterConditions: {},
        playerDeathSaves: {},
        syncedBattleMap: null,
      };
    case 'SET_TURN_FLASH':
      return { ...state, turnFlash: action.payload };

    // ── Combat Log ──
    case 'ADD_COMBAT_LOG':
      return { ...state, sharedCombatLog: [...state.sharedCombatLog, action.payload].slice(-MAX_COMBAT_LOG) };

    // ── Monster State ──
    case 'SET_MONSTER_HP_TIER':
      return { ...state, monsterHpTiers: { ...state.monsterHpTiers, [action.payload.monster_id]: action.payload } };
    case 'CLEAR_MONSTER_HP_TIERS':
      return { ...state, monsterHpTiers: {} };
    case 'SET_MONSTER_CONDITION': {
      const { monster_id, condition, add } = action.payload;
      const current = state.monsterConditions[monster_id] || [];
      const updated = add
        ? (current.includes(condition) ? current : [...current, condition])
        : current.filter(c => c !== condition);
      return { ...state, monsterConditions: { ...state.monsterConditions, [monster_id]: updated } };
    }

    // ── Death Saves ──
    case 'UPDATE_DEATH_SAVE': {
      const { client_id, success, is_crit, is_fumble, roll } = action.payload;
      const cur = state.playerDeathSaves[client_id] || { successes: 0, failures: 0 };
      let updated;
      if (success) {
        const newSuccesses = is_crit ? 3 : cur.successes + 1;
        updated = { ...cur, successes: Math.min(3, newSuccesses) };
      } else {
        const newFailures = (is_fumble || roll === 1) ? cur.failures + 2 : cur.failures + 1;
        updated = { ...cur, failures: Math.min(3, newFailures) };
      }
      return { ...state, playerDeathSaves: { ...state.playerDeathSaves, [client_id]: updated } };
    }
    case 'CLEAR_DEATH_SAVES':
      return { ...state, playerDeathSaves: {} };

    // ── Incoming Attacks ──
    case 'ADD_INCOMING_ATTACK':
      return { ...state, incomingAttacks: [...state.incomingAttacks, action.payload].slice(-20) };
    case 'REMOVE_INCOMING_ATTACK':
      return { ...state, incomingAttacks: state.incomingAttacks.filter(a => a.id !== action.payload) };
    case 'CLEAR_INCOMING_ATTACKS':
      return { ...state, incomingAttacks: [] };

    // ── Pending Changes ──
    case 'ADD_CONDITION_CHANGE':
      return { ...state, conditionChanges: [...state.conditionChanges, action.payload] };
    case 'CLEAR_CONDITION_CHANGES':
      return { ...state, conditionChanges: [] };
    case 'SET_EQUIPMENT_REQUESTED':
      return { ...state, equipmentRequested: action.payload };
    case 'ADD_HP_CHANGE':
      return { ...state, pendingHpChanges: [...state.pendingHpChanges, action.payload] };
    case 'CLEAR_HP_CHANGES':
      return { ...state, pendingHpChanges: [] };
    case 'SET_REST_SYNC':
      return { ...state, pendingRestSync: action.payload };
    case 'SET_XP_AWARD':
      return { ...state, latestXpAward: action.payload };
    case 'CLEAR_XP_AWARD':
      return { ...state, latestXpAward: null };
    case 'SET_DEATH_SAVE_PROMPT':
      return { ...state, pendingDeathSavePrompt: action.payload };
    case 'CLEAR_DEATH_SAVE_PROMPT':
      return { ...state, pendingDeathSavePrompt: null };
    case 'SET_CONCENTRATION': {
      const { client_id, spell_name } = action.payload;
      return { ...state, concentrationState: { ...state.concentrationState, [client_id]: spell_name } };
    }
    case 'SET_INSPIRATION':
      return { ...state, pendingInspiration: action.payload };
    case 'CLEAR_INSPIRATION':
      return { ...state, pendingInspiration: null };
    case 'SET_REACTION':
      return { ...state, pendingReaction: action.payload };
    case 'CLEAR_REACTION':
      return { ...state, pendingReaction: null };
    case 'ADD_ITEM_LOSS':
      return { ...state, pendingItemLoss: [...state.pendingItemLoss, action.payload] };
    case 'CLEAR_ITEM_LOSS':
      return { ...state, pendingItemLoss: [] };
    case 'ADD_GOLD_CHANGE':
      return { ...state, pendingGoldChange: [...state.pendingGoldChange, action.payload] };
    case 'CLEAR_GOLD_CHANGE':
      return { ...state, pendingGoldChange: [] };
    case 'ADD_SLOT_LOSS':
      return { ...state, pendingSlotLoss: [...state.pendingSlotLoss, action.payload] };
    case 'CLEAR_SLOT_LOSS':
      return { ...state, pendingSlotLoss: [] };
    case 'SET_LEVEL_UP':
      return { ...state, pendingLevelUp: action.payload };
    case 'CLEAR_LEVEL_UP':
      return { ...state, pendingLevelUp: null };

    // ── Battle Map ──
    case 'SET_BATTLE_MAP':
      return { ...state, syncedBattleMap: action.payload };
    case 'UPDATE_BATTLE_MAP_TOKEN': {
      if (!state.syncedBattleMap) return state;
      const tokens = (state.syncedBattleMap.tokens || []).map(t =>
        t.id === action.payload.token_id ? { ...t, col: action.payload.col, row: action.payload.row } : t
      );
      return { ...state, syncedBattleMap: { ...state.syncedBattleMap, tokens } };
    }
    case 'UPDATE_BATTLE_MAP_FOG':
      return state.syncedBattleMap
        ? { ...state, syncedBattleMap: { ...state.syncedBattleMap, fog: action.payload } }
        : state;
    case 'UPDATE_BATTLE_MAP_DRAWINGS':
      return state.syncedBattleMap
        ? { ...state, syncedBattleMap: { ...state.syncedBattleMap, drawings: action.payload } }
        : state;
    case 'CLEAR_BATTLE_MAP':
      return { ...state, syncedBattleMap: null };

    // ── Shop ──
    case 'SET_SHOP':
      return { ...state, activeShop: action.payload };
    case 'CLOSE_SHOP':
      return { ...state, activeShop: null };
    case 'ADD_PURCHASE':
      return { ...state, pendingPurchases: [...state.pendingPurchases, action.payload] };
    case 'SET_PENDING_PURCHASES':
      return { ...state, pendingPurchases: action.payload };
    case 'CLEAR_PURCHASES':
      return { ...state, pendingPurchases: [] };

    // ── Atmosphere ──
    case 'SET_MOOD':
      return {
        ...state,
        currentMood: action.payload.mood ?? state.currentMood,
        ambientSound: action.payload.ambient !== undefined ? (action.payload.ambient || null) : state.ambientSound,
      };
    case 'SET_AMBIENT':
      return { ...state, ambientSound: action.payload };
    case 'CLEAR_MOOD':
      return { ...state, currentMood: null, ambientSound: null };
    case 'SET_DM_SESSION_ACTIVE':
      return { ...state, dmSessionActive: action.payload };

    // ── Quest ──
    case 'SET_QUEST_UPDATE':
      return { ...state, latestQuestUpdate: action.payload };
    case 'CLEAR_QUEST_UPDATE':
      return { ...state, latestQuestUpdate: null };

    // ── Communication ──
    case 'SET_REST_REQUEST':
      return { ...state, pendingRestRequest: action.payload };
    case 'CLEAR_REST_REQUEST':
      return { ...state, pendingRestRequest: null };
    case 'ADD_WHISPER':
      return { ...state, whisperMessages: [...state.whisperMessages, action.payload].slice(-50) };
    case 'CLEAR_WHISPERS':
      return { ...state, whisperMessages: [] };
    case 'SET_SKILL_CHECK':
      return { ...state, pendingSkillCheck: action.payload };
    case 'CLEAR_SKILL_CHECK':
      return { ...state, pendingSkillCheck: null };
    case 'ADD_SKILL_CHECK_RESULT':
      return { ...state, skillCheckResults: [...state.skillCheckResults, action.payload].slice(-30) };
    case 'CLEAR_SKILL_CHECK_RESULTS':
      return { ...state, skillCheckResults: [] };
    case 'REGISTER_PLAYER':
      return { ...state, connectedPlayerMap: { ...state.connectedPlayerMap, [action.payload.clientId]: action.payload.name } };

    // ── Full State Restore (reconnect) ──
    case 'RESTORE_SNAPSHOT': {
      const s = action.payload;
      return {
        ...state,
        ...(s.combatActive !== undefined && { combatActive: s.combatActive }),
        ...(s.initiativeOrder && { initiativeOrder: s.initiativeOrder }),
        ...(s.currentTurn !== undefined && { currentTurn: s.currentTurn }),
        ...(s.round !== undefined && { round: s.round }),
        ...(s.activePrompts && { activePrompts: s.activePrompts }),
        ...(s.currentMood !== undefined && { currentMood: s.currentMood }),
        ...(s.dmSessionActive !== undefined && { dmSessionActive: s.dmSessionActive }),
        ...(s.monsterHpTiers && { monsterHpTiers: s.monsterHpTiers }),
        ...(s.monsterConditions && { monsterConditions: s.monsterConditions }),
        ...(s.latestBroadcast && { latestBroadcast: s.latestBroadcast }),
      };
    }

    default:
      return state;
  }
}

// ─── Provider ───────────────────────────────────────────────────────────
export function CampaignSyncProvider({ children }) {
  const { sendEvent, sendTargetedEvent, onPartyEvent, mode, myClientId } = useParty();
  const [state, dispatch] = useReducer(syncReducer, initialState);

  const isHost = mode === 'host';

  // Refs for stable access inside event listeners (avoid stale closures)
  const isHostRef = useRef(isHost);
  useEffect(() => { isHostRef.current = isHost; }, [isHost]);
  const advanceTurnRef = useRef(null);
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  // Derived: is it my turn in combat?
  const isMyTurn = useMemo(() => {
    if (!state.combatActive || !state.initiativeOrder.length) return false;
    const current = state.initiativeOrder[state.currentTurn];
    return current?.client_id === myClientId;
  }, [state.combatActive, state.initiativeOrder, state.currentTurn, myClientId]);

  // Track isMyTurn transitions — play chime + flash when it becomes your turn
  const prevIsMyTurnRef = useRef(false);
  useEffect(() => {
    if (isMyTurn && !prevIsMyTurnRef.current) {
      dispatch({ type: 'SET_TURN_FLASH', payload: true });
      const timer = setTimeout(() => dispatch({ type: 'SET_TURN_FLASH', payload: false }), 3000);
      // Play a short chime via Web Audio API
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.1); // G5
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } catch (_) { /* Web Audio not available */ }
      return () => clearTimeout(timer);
    }
    prevIsMyTurnRef.current = isMyTurn;
  }, [isMyTurn]);

  // Subscribe to party events
  useEffect(() => {
    const unsubs = [];

    unsubs.push(onPartyEvent('dm_broadcast', (msg) => {
      dispatch({ type: 'ADD_BROADCAST', payload: { ...msg.data, timestamp: msg.timestamp, id: msg.data?.id || Date.now() } });
    }));

    unsubs.push(onPartyEvent('dm_prompt', (msg) => {
      dispatch({ type: 'ADD_PROMPT', payload: { ...msg.data, timestamp: msg.timestamp } });
    }));

    unsubs.push(onPartyEvent('prompt_response', (msg) => {
      const { prompt_id, ...response } = msg.data || {};
      if (!prompt_id) return;
      dispatch({ type: 'SET_PROMPT_RESULT', payload: { prompt_id, response: { client_id: msg.client_id, ...response } } });
    }));

    unsubs.push(onPartyEvent('combat_start', (msg) => {
      dispatch({ type: 'COMBAT_START', payload: { initiative: msg.data?.initiative } });
    }));

    unsubs.push(onPartyEvent('combat_turn', (msg) => {
      dispatch({ type: 'COMBAT_TURN', payload: { turn: msg.data?.turn, round: msg.data?.round } });
    }));

    unsubs.push(onPartyEvent('combat_end', () => {
      dispatch({ type: 'COMBAT_END' });
    }));

    unsubs.push(onPartyEvent('monster_hp_update', (msg) => {
      dispatch({ type: 'SET_MONSTER_HP_TIER', payload: msg.data });
    }));

    unsubs.push(onPartyEvent('condition_change', (msg) => {
      dispatch({ type: 'ADD_CONDITION_CHANGE', payload: msg.data });
    }));

    unsubs.push(onPartyEvent('equip_request', () => {
      dispatch({ type: 'SET_EQUIPMENT_REQUESTED', payload: true });
    }));

    unsubs.push(onPartyEvent('hp_change', (msg) => {
      dispatch({ type: 'ADD_HP_CHANGE', payload: msg.data });
    }));

    unsubs.push(onPartyEvent('rest_sync', (msg) => {
      dispatch({ type: 'SET_REST_SYNC', payload: msg.data });
    }));

    unsubs.push(onPartyEvent('xp_award', (msg) => {
      dispatch({ type: 'SET_XP_AWARD', payload: msg.data });
    }));

    unsubs.push(onPartyEvent('combat_log_entry', (msg) => {
      dispatch({ type: 'ADD_COMBAT_LOG', payload: msg.data });
    }));

    unsubs.push(onPartyEvent('death_save_prompt', (msg) => {
      dispatch({ type: 'SET_DEATH_SAVE_PROMPT', payload: msg.data });
    }));

    unsubs.push(onPartyEvent('concentration_update', (msg) => {
      dispatch({ type: 'SET_CONCENTRATION', payload: { client_id: msg.client_id, spell_name: msg.data?.spell_name || null } });
    }));

    unsubs.push(onPartyEvent('inspiration_toggle', (msg) => {
      dispatch({ type: 'SET_INSPIRATION', payload: msg.data });
    }));

    unsubs.push(onPartyEvent('reaction_prompt', (msg) => {
      dispatch({ type: 'SET_REACTION', payload: msg.data });
    }));

    unsubs.push(onPartyEvent('item_loss', (msg) => {
      dispatch({ type: 'ADD_ITEM_LOSS', payload: msg.data });
    }));

    unsubs.push(onPartyEvent('gold_change', (msg) => {
      dispatch({ type: 'ADD_GOLD_CHANGE', payload: msg.data });
    }));

    unsubs.push(onPartyEvent('slot_loss', (msg) => {
      dispatch({ type: 'ADD_SLOT_LOSS', payload: msg.data });
    }));

    // Player-to-DM events (DM receives these)
    unsubs.push(onPartyEvent('player_attack', (msg) => {
      dispatch({ type: 'ADD_COMBAT_LOG', payload: { type: 'attack', text: msg.data?.text || `${msg.data?.player_name || 'Player'} attacks with ${msg.data?.weapon || 'weapon'}`, timestamp: msg.timestamp } });
      if (msg.data?.damage_roll) {
        dispatch({ type: 'ADD_INCOMING_ATTACK', payload: { id: `atk_${Date.now()}_${Math.random().toString(36).slice(2,6)}`, client_id: msg.client_id, ...msg.data, timestamp: msg.timestamp } });
      }
    }));

    unsubs.push(onPartyEvent('player_cast_spell', (msg) => {
      dispatch({ type: 'ADD_COMBAT_LOG', payload: { type: 'spell', text: msg.data?.text || `${msg.data?.player_name || 'Player'} casts ${msg.data?.spell_name || 'a spell'}`, timestamp: msg.timestamp } });
    }));

    unsubs.push(onPartyEvent('player_end_turn', (msg) => {
      const name = msg.data?.player_name || 'Player';
      dispatch({ type: 'ADD_COMBAT_LOG', payload: { type: 'turn_end', text: `${name} ends their turn`, timestamp: msg.timestamp } });
      if (isHostRef.current) {
        toast(`${name} ended their turn`, { icon: '\u23ED\uFE0F', duration: 2000 });
        setTimeout(() => {
          if (advanceTurnRef.current) advanceTurnRef.current();
        }, 500);
      }
    }));

    unsubs.push(onPartyEvent('feature_use', (msg) => {
      dispatch({ type: 'ADD_COMBAT_LOG', payload: { type: 'feature', text: msg.data?.text || `${msg.data?.player_name || 'Player'} uses ${msg.data?.name || 'a feature'}`, timestamp: msg.timestamp } });
    }));

    unsubs.push(onPartyEvent('item_used', (msg) => {
      dispatch({ type: 'ADD_COMBAT_LOG', payload: { type: 'item', text: msg.data?.text || `${msg.data?.player_name || 'Player'} uses ${msg.data?.item_name || 'an item'}`, timestamp: msg.timestamp } });
    }));

    unsubs.push(onPartyEvent('death_save_result', (msg) => {
      dispatch({ type: 'ADD_COMBAT_LOG', payload: { type: 'death_save', text: msg.data?.text || `Death save result`, timestamp: msg.timestamp } });
      const cid = msg.client_id || msg.data?.client_id;
      if (cid) {
        dispatch({ type: 'UPDATE_DEATH_SAVE', payload: { client_id: cid, success: msg.data?.success, is_crit: msg.data?.is_crit, is_fumble: msg.data?.is_fumble, roll: msg.data?.roll } });
      }
    }));

    unsubs.push(onPartyEvent('spell_slot_update', () => {
      // DM can track player spell slot usage
    }));

    unsubs.push(onPartyEvent('player_heal', (msg) => {
      dispatch({ type: 'ADD_HP_CHANGE', payload: { delta: msg.data?.amount, source: msg.data?.spell_name || 'Healing', source_name: msg.data?.source_name } });
    }));

    unsubs.push(onPartyEvent('reaction_response', (msg) => {
      dispatch({ type: 'ADD_COMBAT_LOG', payload: { type: 'reaction', text: msg.data?.text || `Reaction response`, timestamp: msg.timestamp } });
    }));

    unsubs.push(onPartyEvent('monster_condition', (msg) => {
      dispatch({ type: 'ADD_COMBAT_LOG', payload: { type: 'condition', text: `${msg.data?.monster_name || 'Monster'} is ${msg.data?.action === 'add' ? 'now' : 'no longer'} ${msg.data?.condition || ''}`, timestamp: msg.timestamp } });
      const mid = msg.data?.monster_id;
      const cond = msg.data?.condition;
      if (mid && cond) {
        dispatch({ type: 'SET_MONSTER_CONDITION', payload: { monster_id: mid, condition: cond, add: msg.data?.action === 'add' } });
      }
    }));

    unsubs.push(onPartyEvent('level_up_available', (msg) => {
      dispatch({ type: 'SET_LEVEL_UP', payload: msg.data });
    }));

    // Battle map sync events
    unsubs.push(onPartyEvent('battle_map_sync', (msg) => {
      dispatch({ type: 'SET_BATTLE_MAP', payload: msg.data });
    }));

    unsubs.push(onPartyEvent('battle_map_token_move', (msg) => {
      dispatch({ type: 'UPDATE_BATTLE_MAP_TOKEN', payload: msg.data });
    }));

    unsubs.push(onPartyEvent('battle_map_fog_update', (msg) => {
      dispatch({ type: 'UPDATE_BATTLE_MAP_FOG', payload: msg.data.fog });
    }));

    unsubs.push(onPartyEvent('battle_map_drawing_update', (msg) => {
      dispatch({ type: 'UPDATE_BATTLE_MAP_DRAWINGS', payload: msg.data.drawings });
    }));

    unsubs.push(onPartyEvent('battle_map_clear', () => {
      dispatch({ type: 'CLEAR_BATTLE_MAP' });
    }));

    // Mood/atmosphere events
    unsubs.push(onPartyEvent('mood_change', (msg) => {
      dispatch({ type: 'SET_MOOD', payload: { mood: msg.data?.mood || null, ambient: msg.data?.ambient } });
    }));
    unsubs.push(onPartyEvent('ambient_change', (msg) => {
      dispatch({ type: 'SET_AMBIENT', payload: msg.data?.ambient || null });
    }));

    // Shop events
    unsubs.push(onPartyEvent('shop_open', (msg) => dispatch({ type: 'SET_SHOP', payload: msg.data })));
    unsubs.push(onPartyEvent('shop_close', () => dispatch({ type: 'CLOSE_SHOP' })));
    unsubs.push(onPartyEvent('shop_purchase_approved', (msg) => {
      dispatch({ type: 'ADD_PURCHASE', payload: { ...msg.data, approved: true } });
    }));
    unsubs.push(onPartyEvent('shop_purchase_denied', (msg) => {
      dispatch({ type: 'ADD_PURCHASE', payload: { ...msg.data, approved: false } });
    }));
    unsubs.push(onPartyEvent('shop_purchase_request', (msg) => {
      dispatch({ type: 'ADD_PURCHASE', payload: msg.data });
    }));

    unsubs.push(onPartyEvent('narration', (msg) => {
      dispatch({ type: 'ADD_COMBAT_LOG', payload: { type: 'narration', text: msg.data?.text || '', timestamp: msg.timestamp } });
    }));

    unsubs.push(onPartyEvent('quest_update', (msg) => {
      dispatch({ type: 'SET_QUEST_UPDATE', payload: msg.data });
    }));

    unsubs.push(onPartyEvent('player_use_item', (msg) => {
      dispatch({ type: 'ADD_COMBAT_LOG', payload: { type: 'item_used', text: msg.data?.text || `${msg.data?.player_name || 'Player'} uses ${msg.data?.item_name || 'an item'}`, timestamp: msg.timestamp } });
    }));

    unsubs.push(onPartyEvent('rest_request', (msg) => {
      dispatch({ type: 'SET_REST_REQUEST', payload: msg.data });
    }));

    unsubs.push(onPartyEvent('player_whisper', (msg) => {
      dispatch({ type: 'ADD_WHISPER', payload: { client_id: msg.client_id, ...msg.data, timestamp: msg.timestamp } });
    }));

    unsubs.push(onPartyEvent('skill_check_prompt', (msg) => {
      dispatch({ type: 'SET_SKILL_CHECK', payload: msg.data });
    }));

    unsubs.push(onPartyEvent('skill_check_result', (msg) => {
      dispatch({ type: 'ADD_SKILL_CHECK_RESULT', payload: { client_id: msg.client_id, ...msg.data, timestamp: msg.timestamp } });
    }));

    unsubs.push(onPartyEvent('session_start', () => dispatch({ type: 'SET_DM_SESSION_ACTIVE', payload: true })));
    unsubs.push(onPartyEvent('session_end', () => dispatch({ type: 'SET_DM_SESSION_ACTIVE', payload: false })));

    unsubs.push(onPartyEvent('state_request', (msg) => {
      if (isHostRef.current) {
        const s = stateRef.current;
        const snapshot = {
          combatActive: s.combatActive, initiativeOrder: s.initiativeOrder,
          currentTurn: s.currentTurn, round: s.round,
          activePrompts: s.activePrompts,
          currentMood: s.currentMood, dmSessionActive: s.dmSessionActive,
          monsterHpTiers: s.monsterHpTiers, monsterConditions: s.monsterConditions,
          latestBroadcast: s.latestBroadcast,
        };
        sendTargetedEvent('full_state_snapshot', snapshot, [msg.client_id]);
      }
    }));

    unsubs.push(onPartyEvent('full_state_snapshot', (msg) => {
      if (!isHostRef.current && msg.data) {
        dispatch({ type: 'RESTORE_SNAPSHOT', payload: msg.data });
        toast.success('Reconnected — state restored');
      }
    }));

    return () => unsubs.forEach(fn => fn());
  }, [onPartyEvent, sendTargetedEvent]);

  // ── DM Actions ──────────────────────────────────────────────────────
  const sendBroadcast = useCallback((broadcastType, title, body) => {
    const data = { id: `bc_${Date.now()}`, broadcast_type: broadcastType, title, body };
    sendEvent('dm_broadcast', data);
    dispatch({ type: 'ADD_BROADCAST_LOCAL', payload: { ...data, timestamp: new Date().toISOString() } });
  }, [sendEvent]);

  const sendPrompt = useCallback((promptType, promptData, targetClientIds) => {
    const data = { prompt_id: `pr_${Date.now()}`, prompt_type: promptType, ...promptData };
    if (targetClientIds && targetClientIds.length > 0) {
      sendTargetedEvent('dm_prompt', data, targetClientIds);
    } else {
      sendEvent('dm_prompt', data);
    }
    dispatch({ type: 'INIT_PROMPT_RESULTS', payload: { ...data, sent_at: Date.now(), results: [] } });
    return data.prompt_id;
  }, [sendEvent, sendTargetedEvent]);

  const respondToPrompt = useCallback((promptId, response) => {
    sendEvent('prompt_response', { prompt_id: promptId, ...response });
    dispatch({ type: 'REMOVE_PROMPT', payload: promptId });
  }, [sendEvent]);

  const startCombat = useCallback((initiative) => {
    sendEvent('combat_start', { initiative });
    dispatch({ type: 'COMBAT_START', payload: { initiative } });
  }, [sendEvent]);

  const advanceTurn = useCallback(async () => {
    const s = stateRef.current;
    const nextTurn = (s.currentTurn + 1) % (s.initiativeOrder.length || 1);
    const nextRound = nextTurn === 0 ? s.round + 1 : s.round;
    sendEvent('combat_turn', { turn: nextTurn, round: nextRound });
    dispatch({ type: 'COMBAT_TURN', payload: { turn: nextTurn, round: nextRound } });

    try {
      const expired = await invoke('campaign_tick_conditions');
      if (expired && Array.isArray(expired) && expired.length > 0) {
        for (const expiredCondition of expired) {
          sendEvent('condition_change', { action: 'remove', condition: expiredCondition, targets: 'all' });
          sendEvent('combat_log_entry', { type: 'condition', text: `${expiredCondition} has expired`, timestamp: Date.now() });
        }
      }
    } catch (_e) {
      // Command may not exist yet — don't break combat flow
    }
  }, [sendEvent]);

  useEffect(() => { advanceTurnRef.current = advanceTurn; }, [advanceTurn]);

  const endCombat = useCallback(() => {
    sendEvent('combat_end', {});
    dispatch({ type: 'COMBAT_END' });
  }, [sendEvent]);

  const dismissBroadcast = useCallback(() => {
    dispatch({ type: 'DISMISS_BROADCAST' });
  }, []);

  const sendSceneChange = useCallback((name, description) => {
    sendBroadcast('scene_change', name, description);
  }, [sendBroadcast]);

  const applyCondition = useCallback((conditionName, targetClientIds) => {
    const data = { condition: conditionName, action: 'add' };
    if (targetClientIds?.length > 0) {
      sendTargetedEvent('condition_change', data, targetClientIds);
    } else {
      sendEvent('condition_change', data);
    }
  }, [sendEvent, sendTargetedEvent]);

  const removeCondition = useCallback((conditionName, targetClientIds) => {
    const data = { condition: conditionName, action: 'remove' };
    if (targetClientIds?.length > 0) {
      sendTargetedEvent('condition_change', data, targetClientIds);
    } else {
      sendEvent('condition_change', data);
    }
  }, [sendEvent, sendTargetedEvent]);

  const requestEquipment = useCallback((targetClientIds) => {
    const data = { prompt_type: 'equip_weapons' };
    if (targetClientIds?.length > 0) {
      sendTargetedEvent('equip_request', data, targetClientIds);
    } else {
      sendEvent('equip_request', data);
    }
  }, [sendEvent, sendTargetedEvent]);

  // Clear helpers — stable references via dispatch
  const clearConditionChanges = useCallback(() => dispatch({ type: 'CLEAR_CONDITION_CHANGES' }), []);
  const clearEquipmentRequest = useCallback(() => dispatch({ type: 'SET_EQUIPMENT_REQUESTED', payload: false }), []);
  const clearHpChanges = useCallback(() => dispatch({ type: 'CLEAR_HP_CHANGES' }), []);
  const clearRestSync = useCallback(() => dispatch({ type: 'SET_REST_SYNC', payload: null }), []);
  const clearXpAward = useCallback(() => dispatch({ type: 'CLEAR_XP_AWARD' }), []);
  const clearDeathSavePrompt = useCallback(() => dispatch({ type: 'CLEAR_DEATH_SAVE_PROMPT' }), []);
  const clearInspiration = useCallback(() => dispatch({ type: 'CLEAR_INSPIRATION' }), []);
  const clearReaction = useCallback(() => dispatch({ type: 'CLEAR_REACTION' }), []);
  const clearItemLoss = useCallback(() => dispatch({ type: 'CLEAR_ITEM_LOSS' }), []);
  const clearGoldChange = useCallback(() => dispatch({ type: 'CLEAR_GOLD_CHANGE' }), []);
  const clearSlotLoss = useCallback(() => dispatch({ type: 'CLEAR_SLOT_LOSS' }), []);
  const clearMonsterHpTiers = useCallback(() => dispatch({ type: 'CLEAR_MONSTER_HP_TIERS' }), []);
  const clearLevelUp = useCallback(() => dispatch({ type: 'CLEAR_LEVEL_UP' }), []);
  const removeIncomingAttack = useCallback((id) => dispatch({ type: 'REMOVE_INCOMING_ATTACK', payload: id }), []);
  const clearIncomingAttacks = useCallback(() => dispatch({ type: 'CLEAR_INCOMING_ATTACKS' }), []);
  const clearMood = useCallback(() => dispatch({ type: 'CLEAR_MOOD' }), []);
  const clearQuestUpdate = useCallback(() => dispatch({ type: 'CLEAR_QUEST_UPDATE' }), []);
  const clearRestRequest = useCallback(() => dispatch({ type: 'CLEAR_REST_REQUEST' }), []);
  const clearWhisperMessages = useCallback(() => dispatch({ type: 'CLEAR_WHISPERS' }), []);
  const clearSkillCheck = useCallback(() => dispatch({ type: 'CLEAR_SKILL_CHECK' }), []);
  const clearSkillCheckResults = useCallback(() => dispatch({ type: 'CLEAR_SKILL_CHECK_RESULTS' }), []);
  const clearPromptHistory = useCallback(() => dispatch({ type: 'CLEAR_PROMPT_HISTORY' }), []);
  const clearPlayerDeathSaves = useCallback(() => dispatch({ type: 'CLEAR_DEATH_SAVES' }), []);

  const getCombatSnapshot = useCallback(() => {
    const s = stateRef.current;
    return {
      combatActive: s.combatActive, initiativeOrder: s.initiativeOrder,
      currentTurn: s.currentTurn, round: s.round,
      monsterHpTiers: s.monsterHpTiers, monsterConditions: s.monsterConditions,
      playerDeathSaves: s.playerDeathSaves,
    };
  }, []);

  const registerPlayer = useCallback((clientId, playerName) => {
    dispatch({ type: 'REGISTER_PLAYER', payload: { clientId, name: playerName } });
  }, []);

  const resolvePlayerName = useCallback((clientId) => {
    return stateRef.current.connectedPlayerMap[clientId] || clientId;
  }, []);

  // DM action functions
  const sendHpChange = useCallback((delta, source, targetClientIds) => {
    const data = { delta, source };
    if (targetClientIds?.length > 0) {
      sendTargetedEvent('hp_change', data, targetClientIds);
    } else {
      sendEvent('hp_change', data);
    }
  }, [sendEvent, sendTargetedEvent]);

  const sendRestSync = useCallback((restType) => {
    sendEvent('rest_sync', { rest_type: restType });
  }, [sendEvent]);

  const sendXpAward = useCallback((amount, reason, perPlayer) => {
    sendEvent('xp_award', { amount, reason, per_player: perPlayer });
  }, [sendEvent]);

  const sendCombatLogEntry = useCallback((type, text) => {
    const entry = { type, text, timestamp: new Date().toISOString() };
    sendEvent('combat_log_entry', entry);
    dispatch({ type: 'ADD_COMBAT_LOG', payload: entry });
  }, [sendEvent]);

  const sendDeathSavePrompt = useCallback((targetClientId) => {
    sendTargetedEvent('death_save_prompt', {}, [targetClientId]);
  }, [sendTargetedEvent]);

  const sendConcentrationUpdate = useCallback((spellName) => {
    sendEvent('concentration_update', { spell_name: spellName });
  }, [sendEvent]);

  const sendInspirationToggle = useCallback((granted, targetClientIds) => {
    const data = { granted };
    if (targetClientIds?.length > 0) {
      sendTargetedEvent('inspiration_toggle', data, targetClientIds);
    } else {
      sendEvent('inspiration_toggle', data);
    }
  }, [sendEvent, sendTargetedEvent]);

  const sendReactionPrompt = useCallback((type, context, targetClientId) => {
    sendTargetedEvent('reaction_prompt', { type, context }, [targetClientId]);
  }, [sendTargetedEvent]);

  const sendMonsterCondition = useCallback((monsterId, monsterName, condition, action) => {
    sendEvent('monster_condition', { monster_id: monsterId, monster_name: monsterName, condition, action });
  }, [sendEvent]);

  // Battle map sync functions (DM side)
  const sendBattleMapSync = useCallback((mapState) => {
    sendEvent('battle_map_sync', mapState);
  }, [sendEvent]);

  const sendBattleMapTokenMove = useCallback((tokenData) => {
    sendEvent('battle_map_token_move', tokenData);
  }, [sendEvent]);

  const sendBattleMapFogUpdate = useCallback((fogData) => {
    sendEvent('battle_map_fog_update', fogData);
  }, [sendEvent]);

  const sendBattleMapDrawingUpdate = useCallback((drawingData) => {
    sendEvent('battle_map_drawing_update', drawingData);
  }, [sendEvent]);

  const sendBattleMapClear = useCallback(() => {
    sendEvent('battle_map_clear', {});
    dispatch({ type: 'CLEAR_BATTLE_MAP' });
  }, [sendEvent]);

  // Mood/atmosphere helpers (DM side)
  const sendMoodChange = useCallback((mood, ambient) => {
    const data = { mood };
    if (ambient !== undefined) data.ambient = ambient;
    sendEvent('mood_change', data);
    dispatch({ type: 'SET_MOOD', payload: { mood: mood || null, ambient } });
  }, [sendEvent]);

  const sendAmbientChange = useCallback((ambient) => {
    sendEvent('ambient_change', { ambient });
    dispatch({ type: 'SET_AMBIENT', payload: ambient || null });
  }, [sendEvent]);

  // Skill check helpers
  const sendSkillCheckPrompt = useCallback((skill, ability, dc, description, targetClientIds) => {
    const data = { skill, ability, dc, description, prompt_id: `sk_${Date.now()}` };
    if (targetClientIds?.length > 0) {
      sendTargetedEvent('skill_check_prompt', data, targetClientIds);
    } else {
      sendEvent('skill_check_prompt', data);
    }
    dispatch({ type: 'CLEAR_SKILL_CHECK_RESULTS' });
    return data.prompt_id;
  }, [sendEvent, sendTargetedEvent]);

  const sendSkillCheckResult = useCallback((promptId, skill, roll, modifier, total, success) => {
    sendEvent('skill_check_result', { prompt_id: promptId, skill, roll, modifier, total, success });
    dispatch({ type: 'CLEAR_SKILL_CHECK' });
  }, [sendEvent]);

  // Shop helpers
  const sendShopOpen = useCallback((shopData) => sendEvent('shop_open', shopData), [sendEvent]);
  const sendShopClose = useCallback(() => {
    sendEvent('shop_close', {});
    dispatch({ type: 'CLOSE_SHOP' });
  }, [sendEvent]);
  const clearPendingPurchases = useCallback(() => dispatch({ type: 'CLEAR_PURCHASES' }), []);

  // setPendingPurchases compatibility wrapper
  const setPendingPurchases = useCallback((val) => {
    if (typeof val === 'function') {
      // Functional update — read from ref
      const next = val(stateRef.current.pendingPurchases);
      dispatch({ type: 'SET_PENDING_PURCHASES', payload: next });
    } else {
      dispatch({ type: 'SET_PENDING_PURCHASES', payload: val });
    }
  }, []);

  const value = useMemo(() => ({
    activePrompts: state.activePrompts, promptResults: state.promptResults,
    broadcasts: state.broadcasts, latestBroadcast: state.latestBroadcast,
    combatActive: state.combatActive, initiativeOrder: state.initiativeOrder,
    currentTurn: state.currentTurn, round: state.round, isMyTurn, isHost,
    sendBroadcast, sendPrompt, respondToPrompt,
    startCombat, advanceTurn, endCombat, dismissBroadcast, sendSceneChange,
    sendEvent,
    applyCondition, removeCondition, requestEquipment,
    conditionChanges: state.conditionChanges, clearConditionChanges,
    equipmentRequested: state.equipmentRequested, clearEquipmentRequest,
    pendingHpChanges: state.pendingHpChanges, clearHpChanges, sendHpChange,
    pendingRestSync: state.pendingRestSync, clearRestSync, sendRestSync,
    latestXpAward: state.latestXpAward, clearXpAward, sendXpAward,
    sharedCombatLog: state.sharedCombatLog, sendCombatLogEntry,
    pendingDeathSavePrompt: state.pendingDeathSavePrompt, clearDeathSavePrompt, sendDeathSavePrompt,
    concentrationState: state.concentrationState, sendConcentrationUpdate,
    pendingInspiration: state.pendingInspiration, clearInspiration, sendInspirationToggle,
    pendingReaction: state.pendingReaction, clearReaction, sendReactionPrompt,
    sendMonsterCondition,
    pendingItemLoss: state.pendingItemLoss, clearItemLoss,
    pendingGoldChange: state.pendingGoldChange, clearGoldChange,
    pendingSlotLoss: state.pendingSlotLoss, clearSlotLoss,
    monsterHpTiers: state.monsterHpTiers, clearMonsterHpTiers,
    monsterConditions: state.monsterConditions,
    playerDeathSaves: state.playerDeathSaves, clearPlayerDeathSaves,
    turnFlash: state.turnFlash,
    getCombatSnapshot,
    syncedBattleMap: state.syncedBattleMap, sendBattleMapSync, sendBattleMapTokenMove,
    sendBattleMapFogUpdate, sendBattleMapDrawingUpdate, sendBattleMapClear,
    activeShop: state.activeShop, pendingPurchases: state.pendingPurchases, setPendingPurchases,
    sendShopOpen, sendShopClose, clearPendingPurchases,
    incomingAttacks: state.incomingAttacks, removeIncomingAttack, clearIncomingAttacks,
    pendingLevelUp: state.pendingLevelUp, clearLevelUp,
    currentMood: state.currentMood, ambientSound: state.ambientSound,
    sendMoodChange, sendAmbientChange, clearMood,
    dmSessionActive: state.dmSessionActive,
    latestQuestUpdate: state.latestQuestUpdate, clearQuestUpdate,
    pendingRestRequest: state.pendingRestRequest, clearRestRequest,
    whisperMessages: state.whisperMessages, clearWhisperMessages,
    pendingSkillCheck: state.pendingSkillCheck, clearSkillCheck, sendSkillCheckPrompt,
    skillCheckResults: state.skillCheckResults, clearSkillCheckResults, sendSkillCheckResult,
    promptHistory: state.promptHistory, clearPromptHistory,
    connectedPlayerMap: state.connectedPlayerMap, registerPlayer, resolvePlayerName,
  }), [state, isMyTurn, isHost,
       sendBroadcast, sendPrompt, respondToPrompt,
       startCombat, advanceTurn, endCombat, dismissBroadcast, sendSceneChange,
       sendEvent,
       applyCondition, removeCondition, requestEquipment,
       clearConditionChanges, clearEquipmentRequest,
       clearHpChanges, sendHpChange,
       clearRestSync, sendRestSync,
       clearXpAward, sendXpAward,
       sendCombatLogEntry,
       clearDeathSavePrompt, sendDeathSavePrompt,
       sendConcentrationUpdate,
       clearInspiration, sendInspirationToggle,
       clearReaction, sendReactionPrompt,
       sendMonsterCondition,
       clearItemLoss, clearGoldChange, clearSlotLoss,
       clearMonsterHpTiers, clearPlayerDeathSaves,
       getCombatSnapshot,
       sendBattleMapSync, sendBattleMapTokenMove,
       sendBattleMapFogUpdate, sendBattleMapDrawingUpdate, sendBattleMapClear,
       setPendingPurchases, sendShopOpen, sendShopClose, clearPendingPurchases,
       removeIncomingAttack, clearIncomingAttacks,
       clearLevelUp,
       sendMoodChange, sendAmbientChange, clearMood,
       clearQuestUpdate, clearRestRequest,
       clearWhisperMessages,
       clearSkillCheck, sendSkillCheckPrompt,
       clearSkillCheckResults, sendSkillCheckResult,
       clearPromptHistory,
       registerPlayer, resolvePlayerName]);

  return <CampaignSyncContext.Provider value={value}>{children}</CampaignSyncContext.Provider>;
}
