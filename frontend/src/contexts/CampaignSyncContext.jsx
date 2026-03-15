import { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react';
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

export function CampaignSyncProvider({ children }) {
  const { sendEvent, sendTargetedEvent, onPartyEvent, mode, myClientId } = useParty();

  const [activePrompts, setActivePrompts] = useState([]);
  const [promptResults, setPromptResults] = useState({});
  const [broadcasts, setBroadcasts] = useState([]);
  const [latestBroadcast, setLatestBroadcast] = useState(null);
  const [combatActive, setCombatActive] = useState(false);
  const [initiativeOrder, setInitiativeOrder] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [round, setRound] = useState(1);
  const [conditionChanges, setConditionChanges] = useState([]);
  const [equipmentRequested, setEquipmentRequested] = useState(false);
  const [pendingHpChanges, setPendingHpChanges] = useState([]);
  const [pendingRestSync, setPendingRestSync] = useState(null);
  const [latestXpAward, setLatestXpAward] = useState(null);
  const [sharedCombatLog, setSharedCombatLog] = useState([]);
  const [pendingDeathSavePrompt, setPendingDeathSavePrompt] = useState(null);
  const [concentrationState, setConcentrationState] = useState({}); // { clientId: spellName }
  const [pendingInspiration, setPendingInspiration] = useState(null);
  const [pendingReaction, setPendingReaction] = useState(null);
  const [pendingItemLoss, setPendingItemLoss] = useState([]);
  const [pendingGoldChange, setPendingGoldChange] = useState([]);
  const [pendingSlotLoss, setPendingSlotLoss] = useState([]);
  const [monsterHpTiers, setMonsterHpTiers] = useState({});
  const [monsterConditions, setMonsterConditions] = useState({}); // { monster_id: ['poisoned', 'prone'] }
  const [playerDeathSaves, setPlayerDeathSaves] = useState({}); // { client_id: { successes: N, failures: N } }
  const [turnFlash, setTurnFlash] = useState(false);
  const [syncedBattleMap, setSyncedBattleMap] = useState(null);
  const [activeShop, setActiveShop] = useState(null);
  const [pendingPurchases, setPendingPurchases] = useState([]);
  const [incomingAttacks, setIncomingAttacks] = useState([]); // player_attack events for DM auto-damage
  const [currentMood, setCurrentMood] = useState(null);
  const [dmSessionActive, setDmSessionActive] = useState(false);
  const [ambientSound, setAmbientSound] = useState(null);
  const [latestQuestUpdate, setLatestQuestUpdate] = useState(null);
  const [pendingRestRequest, setPendingRestRequest] = useState(null);
  const [whisperMessages, setWhisperMessages] = useState([]);
  const [pendingSkillCheck, setPendingSkillCheck] = useState(null);
  const [skillCheckResults, setSkillCheckResults] = useState([]);
  const [promptHistory, setPromptHistory] = useState([]);
  const [connectedPlayerMap, setConnectedPlayerMap] = useState({});

  const isHost = mode === 'host';

  // Refs for stable access inside event listeners (avoid stale closures)
  const isHostRef = useRef(isHost);
  useEffect(() => { isHostRef.current = isHost; }, [isHost]);
  const advanceTurnRef = useRef(null);

  const [pendingLevelUp, setPendingLevelUp] = useState(null);

  // Derived: is it my turn in combat?
  const isMyTurn = useMemo(() => {
    if (!combatActive || !initiativeOrder.length) return false;
    const current = initiativeOrder[currentTurn];
    return current?.client_id === myClientId;
  }, [combatActive, initiativeOrder, currentTurn, myClientId]);

  // Track isMyTurn transitions — play chime + flash when it becomes your turn
  const prevIsMyTurnRef = useRef(false);
  useEffect(() => {
    if (isMyTurn && !prevIsMyTurnRef.current) {
      setTurnFlash(true);
      const timer = setTimeout(() => setTurnFlash(false), 3000);
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
      const broadcast = { ...msg.data, timestamp: msg.timestamp, id: msg.data?.id || Date.now() };
      setBroadcasts(prev => [broadcast, ...prev].slice(0, MAX_BROADCASTS));
      setLatestBroadcast(broadcast);
    }));

    unsubs.push(onPartyEvent('dm_prompt', (msg) => {
      setActivePrompts(prev => [...prev, { ...msg.data, timestamp: msg.timestamp }]);
    }));

    unsubs.push(onPartyEvent('prompt_response', (msg) => {
      const { prompt_id, ...response } = msg.data || {};
      if (!prompt_id) return;
      setPromptResults(prev => ({
        ...prev,
        [prompt_id]: [...(prev[prompt_id] || []), { client_id: msg.client_id, ...response }],
      }));
      setPromptHistory(prev => prev.map(h =>
        h.prompt_id === prompt_id
          ? { ...h, results: [...(h.results || []), { client_id: msg.client_id, ...response }] }
          : h
      ));
    }));

    unsubs.push(onPartyEvent('combat_start', (msg) => {
      setCombatActive(true);
      setInitiativeOrder(msg.data?.initiative || []);
      setCurrentTurn(0);
      setRound(1);
    }));

    unsubs.push(onPartyEvent('combat_turn', (msg) => {
      if (msg.data?.turn !== undefined) setCurrentTurn(msg.data.turn);
      if (msg.data?.round !== undefined) setRound(msg.data.round);
    }));

    unsubs.push(onPartyEvent('combat_end', () => {
      setCombatActive(false);
      setInitiativeOrder([]);
      setCurrentTurn(0);
      setRound(1);
      setMonsterHpTiers({});
      setMonsterConditions({});
      setPlayerDeathSaves({});
      setSyncedBattleMap(null);
    }));

    unsubs.push(onPartyEvent('monster_hp_update', (msg) => {
      setMonsterHpTiers(prev => ({
        ...prev,
        [msg.data.monster_id]: msg.data,
      }));
    }));

    unsubs.push(onPartyEvent('condition_change', (msg) => {
      // Players receive this — store pending condition changes to process
      setConditionChanges(prev => [...prev, msg.data]);
    }));

    unsubs.push(onPartyEvent('equip_request', () => {
      setEquipmentRequested(true);
    }));

    unsubs.push(onPartyEvent('hp_change', (msg) => {
      setPendingHpChanges(prev => [...prev, msg.data]);
    }));

    unsubs.push(onPartyEvent('rest_sync', (msg) => {
      setPendingRestSync(msg.data);
    }));

    unsubs.push(onPartyEvent('xp_award', (msg) => {
      setLatestXpAward(msg.data);
    }));

    unsubs.push(onPartyEvent('combat_log_entry', (msg) => {
      setSharedCombatLog(prev => [...prev, msg.data].slice(-50));
    }));

    unsubs.push(onPartyEvent('death_save_prompt', (msg) => {
      setPendingDeathSavePrompt(msg.data);
    }));

    unsubs.push(onPartyEvent('concentration_update', (msg) => {
      setConcentrationState(prev => ({
        ...prev,
        [msg.client_id]: msg.data?.spell_name || null,
      }));
    }));

    unsubs.push(onPartyEvent('inspiration_toggle', (msg) => {
      setPendingInspiration(msg.data);
    }));

    unsubs.push(onPartyEvent('reaction_prompt', (msg) => {
      setPendingReaction(msg.data);
    }));

    unsubs.push(onPartyEvent('item_loss', (msg) => {
      setPendingItemLoss(prev => [...prev, msg.data]);
    }));

    unsubs.push(onPartyEvent('gold_change', (msg) => {
      setPendingGoldChange(prev => [...prev, msg.data]);
    }));

    unsubs.push(onPartyEvent('slot_loss', (msg) => {
      setPendingSlotLoss(prev => [...prev, msg.data]);
    }));

    // Player-to-DM events (DM receives these)
    unsubs.push(onPartyEvent('player_attack', (msg) => {
      setSharedCombatLog(prev => [...prev, { type: 'attack', text: msg.data?.text || `${msg.data?.player_name || 'Player'} attacks with ${msg.data?.weapon || 'weapon'}`, timestamp: msg.timestamp }].slice(-50));
      // Also store full attack data for DM auto-damage panel
      if (msg.data?.damage_roll) {
        setIncomingAttacks(prev => [...prev, { id: `atk_${Date.now()}_${Math.random().toString(36).slice(2,6)}`, client_id: msg.client_id, ...msg.data, timestamp: msg.timestamp }].slice(-20));
      }
    }));

    unsubs.push(onPartyEvent('player_cast_spell', (msg) => {
      setSharedCombatLog(prev => [...prev, { type: 'spell', text: msg.data?.text || `${msg.data?.player_name || 'Player'} casts ${msg.data?.spell_name || 'a spell'}`, timestamp: msg.timestamp }].slice(-50));
    }));

    unsubs.push(onPartyEvent('player_end_turn', (msg) => {
      const name = msg.data?.player_name || 'Player';
      setSharedCombatLog(prev => [...prev, { type: 'turn_end', text: `${name} ends their turn`, timestamp: msg.timestamp }].slice(-50));
      // Auto-advance turn on DM side
      if (isHostRef.current) {
        toast(`${name} ended their turn`, { icon: '\u23ED\uFE0F', duration: 2000 });
        setTimeout(() => {
          if (advanceTurnRef.current) advanceTurnRef.current();
        }, 500);
      }
    }));

    unsubs.push(onPartyEvent('feature_use', (msg) => {
      setSharedCombatLog(prev => [...prev, { type: 'feature', text: msg.data?.text || `${msg.data?.player_name || 'Player'} uses ${msg.data?.name || 'a feature'}`, timestamp: msg.timestamp }].slice(-50));
    }));

    unsubs.push(onPartyEvent('item_used', (msg) => {
      setSharedCombatLog(prev => [...prev, { type: 'item', text: msg.data?.text || `${msg.data?.player_name || 'Player'} uses ${msg.data?.item_name || 'an item'}`, timestamp: msg.timestamp }].slice(-50));
    }));

    unsubs.push(onPartyEvent('death_save_result', (msg) => {
      setSharedCombatLog(prev => [...prev, { type: 'death_save', text: msg.data?.text || `Death save result`, timestamp: msg.timestamp }].slice(-50));
      // Track structured death save data
      const cid = msg.client_id || msg.data?.client_id;
      if (cid) {
        setPlayerDeathSaves(prev => {
          const current = prev[cid] || { successes: 0, failures: 0 };
          const success = msg.data?.success;
          const isCrit = msg.data?.is_crit;
          if (success) {
            const newSuccesses = isCrit ? 3 : current.successes + 1;
            return { ...prev, [cid]: { ...current, successes: Math.min(3, newSuccesses) } };
          } else {
            const newFailures = (msg.data?.is_fumble || msg.data?.roll === 1) ? current.failures + 2 : current.failures + 1;
            return { ...prev, [cid]: { ...current, failures: Math.min(3, newFailures) } };
          }
        });
      }
    }));

    unsubs.push(onPartyEvent('spell_slot_update', (msg) => {
      // DM can track player spell slot usage
    }));

    unsubs.push(onPartyEvent('player_heal', (msg) => {
      setPendingHpChanges(prev => [...prev, { delta: msg.data?.amount, source: msg.data?.spell_name || 'Healing', source_name: msg.data?.source_name }]);
    }));

    unsubs.push(onPartyEvent('reaction_response', (msg) => {
      setSharedCombatLog(prev => [...prev, { type: 'reaction', text: msg.data?.text || `Reaction response`, timestamp: msg.timestamp }].slice(-50));
    }));

    unsubs.push(onPartyEvent('monster_condition', (msg) => {
      // Players can see monster conditions in combat log
      setSharedCombatLog(prev => [...prev, { type: 'condition', text: `${msg.data?.monster_name || 'Monster'} is ${msg.data?.action === 'add' ? 'now' : 'no longer'} ${msg.data?.condition || ''}`, timestamp: msg.timestamp }].slice(-50));
      // Track monster conditions persistently
      const mid = msg.data?.monster_id;
      const cond = msg.data?.condition;
      if (mid && cond) {
        setMonsterConditions(prev => {
          const current = prev[mid] || [];
          if (msg.data?.action === 'add') {
            return { ...prev, [mid]: current.includes(cond) ? current : [...current, cond] };
          } else {
            return { ...prev, [mid]: current.filter(c => c !== cond) };
          }
        });
      }
    }));

    unsubs.push(onPartyEvent('level_up_available', (msg) => {
      setPendingLevelUp(msg.data);
    }));

    // Battle map sync events
    unsubs.push(onPartyEvent('battle_map_sync', (msg) => {
      setSyncedBattleMap(msg.data);
    }));

    unsubs.push(onPartyEvent('battle_map_token_move', (msg) => {
      setSyncedBattleMap(prev => {
        if (!prev) return prev;
        const tokens = (prev.tokens || []).map(t =>
          t.id === msg.data.token_id ? { ...t, col: msg.data.col, row: msg.data.row } : t
        );
        return { ...prev, tokens };
      });
    }));

    unsubs.push(onPartyEvent('battle_map_fog_update', (msg) => {
      setSyncedBattleMap(prev => prev ? { ...prev, fog: msg.data.fog } : prev);
    }));

    unsubs.push(onPartyEvent('battle_map_drawing_update', (msg) => {
      setSyncedBattleMap(prev => prev ? { ...prev, drawings: msg.data.drawings } : prev);
    }));

    unsubs.push(onPartyEvent('battle_map_clear', () => {
      setSyncedBattleMap(null);
    }));

    // Mood/atmosphere events
    unsubs.push(onPartyEvent('mood_change', (msg) => {
      setCurrentMood(msg.data?.mood || null);
      if (msg.data?.ambient !== undefined) setAmbientSound(msg.data.ambient || null);
    }));
    unsubs.push(onPartyEvent('ambient_change', (msg) => {
      setAmbientSound(msg.data?.ambient || null);
    }));

    // Shop events
    unsubs.push(onPartyEvent('shop_open', (msg) => setActiveShop(msg.data)));
    unsubs.push(onPartyEvent('shop_close', () => setActiveShop(null)));
    unsubs.push(onPartyEvent('shop_purchase_approved', (msg) => {
      setPendingPurchases(prev => [...prev, { ...msg.data, approved: true }]);
    }));
    unsubs.push(onPartyEvent('shop_purchase_denied', (msg) => {
      setPendingPurchases(prev => [...prev, { ...msg.data, approved: false }]);
    }));
    unsubs.push(onPartyEvent('shop_purchase_request', (msg) => {
      setPendingPurchases(prev => [...prev, msg.data]);
    }));

    unsubs.push(onPartyEvent('narration', (msg) => {
      setSharedCombatLog(prev => [...prev, { type: 'narration', text: msg.data?.text || '', timestamp: msg.timestamp }].slice(-50));
    }));

    unsubs.push(onPartyEvent('quest_update', (msg) => {
      setLatestQuestUpdate(msg.data);
    }));

    unsubs.push(onPartyEvent('player_use_item', (msg) => {
      setSharedCombatLog(prev => [...prev, { type: 'item_used', text: msg.data?.text || `${msg.data?.player_name || 'Player'} uses ${msg.data?.item_name || 'an item'}`, timestamp: msg.timestamp }].slice(-50));
    }));

    unsubs.push(onPartyEvent('rest_request', (msg) => {
      setPendingRestRequest(msg.data);
    }));

    unsubs.push(onPartyEvent('player_whisper', (msg) => {
      setWhisperMessages(prev => [...prev, { client_id: msg.client_id, ...msg.data, timestamp: msg.timestamp }].slice(-50));
    }));

    // Skill check flow: DM prompts players to roll
    unsubs.push(onPartyEvent('skill_check_prompt', (msg) => {
      setPendingSkillCheck(msg.data);
    }));

    // Skill check result: player sends back their roll
    unsubs.push(onPartyEvent('skill_check_result', (msg) => {
      setSkillCheckResults(prev => [...prev, { client_id: msg.client_id, ...msg.data, timestamp: msg.timestamp }].slice(-30));
    }));

    // DM session lifecycle events — lock player editing during live sessions
    unsubs.push(onPartyEvent('session_start', () => setDmSessionActive(true)));
    unsubs.push(onPartyEvent('session_end', () => setDmSessionActive(false)));

    unsubs.push(onPartyEvent('state_request', (msg) => {
      if (isHostRef.current) {
        // DM side: send full state snapshot to reconnecting player
        const snapshot = {
          combatActive, initiativeOrder, currentTurn, round,
          activePrompts: activePrompts.filter(p => true), // Send active prompts
          currentMood, dmSessionActive,
          monsterHpTiers, monsterConditions, latestBroadcast,
        };
        sendTargetedEvent('full_state_snapshot', snapshot, [msg.client_id]);
      }
    }));

    unsubs.push(onPartyEvent('full_state_snapshot', (msg) => {
      if (!isHostRef.current && msg.data) {
        // Player side: restore state from DM's snapshot
        const s = msg.data;
        if (s.combatActive !== undefined) setCombatActive(s.combatActive);
        if (s.initiativeOrder) setInitiativeOrder(s.initiativeOrder);
        if (s.currentTurn !== undefined) setCurrentTurn(s.currentTurn);
        if (s.round !== undefined) setRound(s.round);
        if (s.activePrompts) setActivePrompts(s.activePrompts);
        if (s.currentMood !== undefined) setCurrentMood(s.currentMood);
        if (s.dmSessionActive !== undefined) setDmSessionActive(s.dmSessionActive);
        if (s.monsterHpTiers) setMonsterHpTiers(s.monsterHpTiers);
        if (s.monsterConditions) setMonsterConditions(s.monsterConditions);
        if (s.latestBroadcast) setLatestBroadcast(s.latestBroadcast);
        toast.success('Reconnected — state restored');
      }
    }));

    return () => unsubs.forEach(fn => fn());
  }, [onPartyEvent]);

  // DM actions
  const sendBroadcast = useCallback((broadcastType, title, body) => {
    const data = { id: `bc_${Date.now()}`, broadcast_type: broadcastType, title, body };
    sendEvent('dm_broadcast', data);
    // Also add locally for DM
    const broadcast = { ...data, timestamp: new Date().toISOString() };
    setBroadcasts(prev => [broadcast, ...prev].slice(0, MAX_BROADCASTS));
  }, [sendEvent]);

  const sendPrompt = useCallback((promptType, promptData, targetClientIds) => {
    const data = { prompt_id: `pr_${Date.now()}`, prompt_type: promptType, ...promptData };
    if (targetClientIds && targetClientIds.length > 0) {
      sendTargetedEvent('dm_prompt', data, targetClientIds);
    } else {
      sendEvent('dm_prompt', data);
    }
    // Initialize results tracking
    setPromptResults(prev => ({ ...prev, [data.prompt_id]: [] }));
    setPromptHistory(prev => [{ ...data, sent_at: Date.now(), results: [] }, ...prev].slice(0, 50));
    return data.prompt_id;
  }, [sendEvent, sendTargetedEvent]);

  const respondToPrompt = useCallback((promptId, response) => {
    sendEvent('prompt_response', { prompt_id: promptId, ...response });
    setActivePrompts(prev => prev.filter(p => p.prompt_id !== promptId));
  }, [sendEvent]);

  const startCombat = useCallback((initiative) => {
    sendEvent('combat_start', { initiative });
    setCombatActive(true);
    setInitiativeOrder(initiative);
    setCurrentTurn(0);
    setRound(1);
  }, [sendEvent]);

  const advanceTurn = useCallback(async () => {
    const nextTurn = (currentTurn + 1) % (initiativeOrder.length || 1);
    const nextRound = nextTurn === 0 ? round + 1 : round;
    sendEvent('combat_turn', { turn: nextTurn, round: nextRound });
    setCurrentTurn(nextTurn);
    setRound(nextRound);

    // Phase 2D: Tick conditions on turn advance
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
  }, [sendEvent, currentTurn, initiativeOrder.length, round]);

  // Keep ref in sync so event listeners can call advanceTurn without stale closure
  useEffect(() => { advanceTurnRef.current = advanceTurn; }, [advanceTurn]);

  const endCombat = useCallback(() => {
    sendEvent('combat_end', {});
    setCombatActive(false);
    setInitiativeOrder([]);
    setCurrentTurn(0);
    setRound(1);
  }, [sendEvent]);

  const dismissBroadcast = useCallback(() => {
    setLatestBroadcast(null);
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

  const clearConditionChanges = useCallback(() => {
    setConditionChanges([]);
  }, []);

  const clearEquipmentRequest = useCallback(() => {
    setEquipmentRequested(false);
  }, []);

  const clearHpChanges = useCallback(() => { setPendingHpChanges([]); }, []);
  const clearRestSync = useCallback(() => { setPendingRestSync(null); }, []);
  const clearXpAward = useCallback(() => { setLatestXpAward(null); }, []);
  const clearDeathSavePrompt = useCallback(() => { setPendingDeathSavePrompt(null); }, []);
  const clearInspiration = useCallback(() => { setPendingInspiration(null); }, []);
  const clearReaction = useCallback(() => { setPendingReaction(null); }, []);
  const clearItemLoss = useCallback(() => { setPendingItemLoss([]); }, []);
  const clearGoldChange = useCallback(() => { setPendingGoldChange([]); }, []);
  const clearSlotLoss = useCallback(() => { setPendingSlotLoss([]); }, []);
  const clearMonsterHpTiers = useCallback(() => { setMonsterHpTiers({}); }, []);
  const clearLevelUp = useCallback(() => { setPendingLevelUp(null); }, []);
  const removeIncomingAttack = useCallback((id) => { setIncomingAttacks(prev => prev.filter(a => a.id !== id)); }, []);
  const clearIncomingAttacks = useCallback(() => { setIncomingAttacks([]); }, []);
  const clearMood = useCallback(() => { setCurrentMood(null); setAmbientSound(null); }, []);
  const clearQuestUpdate = useCallback(() => { setLatestQuestUpdate(null); }, []);
  const clearRestRequest = useCallback(() => { setPendingRestRequest(null); }, []);
  const clearWhisperMessages = useCallback(() => { setWhisperMessages([]); }, []);
  const clearSkillCheck = useCallback(() => { setPendingSkillCheck(null); }, []);
  const clearSkillCheckResults = useCallback(() => { setSkillCheckResults([]); }, []);
  const clearPromptHistory = useCallback(() => { setPromptHistory([]); }, []);
  const clearPlayerDeathSaves = useCallback(() => { setPlayerDeathSaves({}); }, []);

  // Combat snapshot for crash-recovery persistence
  const getCombatSnapshot = useCallback(() => ({
    combatActive, initiativeOrder, currentTurn, round,
    monsterHpTiers, monsterConditions, playerDeathSaves,
  }), [combatActive, initiativeOrder, currentTurn, round, monsterHpTiers, monsterConditions, playerDeathSaves]);
  const registerPlayer = useCallback((clientId, playerName) => {
    setConnectedPlayerMap(prev => ({ ...prev, [clientId]: playerName }));
  }, []);
  const resolvePlayerName = useCallback((clientId) => {
    return connectedPlayerMap[clientId] || clientId;
  }, [connectedPlayerMap]);

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
    // Also add locally for DM
    setSharedCombatLog(prev => [...prev, entry].slice(-50));
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
    setSyncedBattleMap(null);
  }, [sendEvent]);

  // Mood/atmosphere helpers (DM side)
  const sendMoodChange = useCallback((mood, ambient) => {
    const data = { mood };
    if (ambient !== undefined) data.ambient = ambient;
    sendEvent('mood_change', data);
    setCurrentMood(mood || null);
    if (ambient !== undefined) setAmbientSound(ambient || null);
  }, [sendEvent]);

  const sendAmbientChange = useCallback((ambient) => {
    sendEvent('ambient_change', { ambient });
    setAmbientSound(ambient || null);
  }, [sendEvent]);

  // Skill check helpers
  const sendSkillCheckPrompt = useCallback((skill, ability, dc, description, targetClientIds) => {
    const data = { skill, ability, dc, description, prompt_id: `sk_${Date.now()}` };
    if (targetClientIds?.length > 0) {
      sendTargetedEvent('skill_check_prompt', data, targetClientIds);
    } else {
      sendEvent('skill_check_prompt', data);
    }
    setSkillCheckResults([]);
    return data.prompt_id;
  }, [sendEvent, sendTargetedEvent]);

  const sendSkillCheckResult = useCallback((promptId, skill, roll, modifier, total, success) => {
    sendEvent('skill_check_result', { prompt_id: promptId, skill, roll, modifier, total, success });
    setPendingSkillCheck(null);
  }, [sendEvent]);

  // Shop helpers
  const sendShopOpen = useCallback((shopData) => sendEvent('shop_open', shopData), [sendEvent]);
  const sendShopClose = useCallback(() => {
    sendEvent('shop_close', {});
    setActiveShop(null);
  }, [sendEvent]);
  const clearPendingPurchases = useCallback(() => setPendingPurchases([]), []);

  const value = useMemo(() => ({
    activePrompts, promptResults, broadcasts, latestBroadcast,
    combatActive, initiativeOrder, currentTurn, round, isMyTurn, isHost,
    sendBroadcast, sendPrompt, respondToPrompt,
    startCombat, advanceTurn, endCombat, dismissBroadcast, sendSceneChange,
    sendEvent,
    applyCondition, removeCondition, requestEquipment,
    conditionChanges, clearConditionChanges,
    equipmentRequested, clearEquipmentRequest,
    pendingHpChanges, clearHpChanges, sendHpChange,
    pendingRestSync, clearRestSync, sendRestSync,
    latestXpAward, clearXpAward, sendXpAward,
    sharedCombatLog, sendCombatLogEntry,
    pendingDeathSavePrompt, clearDeathSavePrompt, sendDeathSavePrompt,
    concentrationState, sendConcentrationUpdate,
    pendingInspiration, clearInspiration, sendInspirationToggle,
    pendingReaction, clearReaction, sendReactionPrompt,
    sendMonsterCondition,
    pendingItemLoss, clearItemLoss,
    pendingGoldChange, clearGoldChange,
    pendingSlotLoss, clearSlotLoss,
    monsterHpTiers, clearMonsterHpTiers, monsterConditions,
    playerDeathSaves, clearPlayerDeathSaves, turnFlash,
    getCombatSnapshot,
    syncedBattleMap, sendBattleMapSync, sendBattleMapTokenMove,
    sendBattleMapFogUpdate, sendBattleMapDrawingUpdate, sendBattleMapClear,
    activeShop, pendingPurchases, setPendingPurchases, sendShopOpen, sendShopClose, clearPendingPurchases,
    incomingAttacks, removeIncomingAttack, clearIncomingAttacks,
    pendingLevelUp, clearLevelUp,
    currentMood, ambientSound, sendMoodChange, sendAmbientChange, clearMood,
    dmSessionActive,
    latestQuestUpdate, clearQuestUpdate,
    pendingRestRequest, clearRestRequest,
    whisperMessages, clearWhisperMessages,
    pendingSkillCheck, clearSkillCheck, sendSkillCheckPrompt,
    skillCheckResults, clearSkillCheckResults, sendSkillCheckResult,
    promptHistory, clearPromptHistory,
    connectedPlayerMap, registerPlayer, resolvePlayerName,
  }), [activePrompts, promptResults, broadcasts, latestBroadcast,
       combatActive, initiativeOrder, currentTurn, round, isMyTurn, isHost,
       sendBroadcast, sendPrompt, respondToPrompt,
       startCombat, advanceTurn, endCombat, dismissBroadcast, sendSceneChange,
       sendEvent,
       applyCondition, removeCondition, requestEquipment,
       conditionChanges, clearConditionChanges,
       equipmentRequested, clearEquipmentRequest,
       pendingHpChanges, clearHpChanges, sendHpChange,
       pendingRestSync, clearRestSync, sendRestSync,
       latestXpAward, clearXpAward, sendXpAward,
       sharedCombatLog, sendCombatLogEntry,
       pendingDeathSavePrompt, clearDeathSavePrompt, sendDeathSavePrompt,
       concentrationState, sendConcentrationUpdate,
       pendingInspiration, clearInspiration, sendInspirationToggle,
       pendingReaction, clearReaction, sendReactionPrompt,
       sendMonsterCondition,
       pendingItemLoss, clearItemLoss,
       pendingGoldChange, clearGoldChange,
       pendingSlotLoss, clearSlotLoss,
       monsterHpTiers, clearMonsterHpTiers, monsterConditions,
       playerDeathSaves, clearPlayerDeathSaves, turnFlash,
       getCombatSnapshot,
       syncedBattleMap, sendBattleMapSync, sendBattleMapTokenMove,
       sendBattleMapFogUpdate, sendBattleMapDrawingUpdate, sendBattleMapClear,
       activeShop, pendingPurchases, sendShopOpen, sendShopClose, clearPendingPurchases,
       incomingAttacks, removeIncomingAttack, clearIncomingAttacks,
       pendingLevelUp, clearLevelUp,
       currentMood, ambientSound, sendMoodChange, sendAmbientChange, clearMood,
       dmSessionActive,
       latestQuestUpdate, clearQuestUpdate,
       pendingRestRequest, clearRestRequest,
       whisperMessages, clearWhisperMessages,
       pendingSkillCheck, clearSkillCheck, sendSkillCheckPrompt,
       skillCheckResults, clearSkillCheckResults, sendSkillCheckResult,
       promptHistory, clearPromptHistory,
       connectedPlayerMap, registerPlayer, resolvePlayerName]);

  return <CampaignSyncContext.Provider value={value}>{children}</CampaignSyncContext.Provider>;
}
