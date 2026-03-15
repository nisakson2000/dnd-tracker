import { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import toast from 'react-hot-toast';
import { useCampaignSync } from './CampaignSyncContext';
import { useParty } from './PartyContext';
import { getHpTier } from '../utils/combatUtils';
import { rollDie } from '../utils/dice';

// 5e SRD XP thresholds — index = current level, value = XP needed to reach next level
const XP_LEVEL_THRESHOLDS = [
  0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000,
  85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000
];

const LiveSessionContext = createContext(null);

export function useLiveSession() {
  const ctx = useContext(LiveSessionContext);
  if (!ctx) throw new Error('useLiveSession must be used within a LiveSessionProvider');
  return ctx;
}

export function LiveSessionProvider({ children }) {
  const { sendBroadcast, startCombat, advanceTurn, endCombat, sendPrompt, sendEvent, sendXpAward, requestEquipment, sendRestSync, getCombatSnapshot } = useCampaignSync();
  const { members, myClientId } = useParty();

  // Session state
  const [activeCampaignId, setActiveCampaignId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionStartedAt, setSessionStartedAt] = useState(null);

  // Campaign data
  const [campaignName, setCampaignName] = useState('');
  const [currentScene, setCurrentScene] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [npcs, setNpcs] = useState([]);
  const [quests, setQuests] = useState([]);
  const [handouts, setHandouts] = useState([]);

  // Encounter state
  const [activeEncounterId, setActiveEncounterId] = useState(null);
  const [encounterMonsters, setEncounterMonsters] = useState([]);

  // DM-configurable monster HP visibility: 'tier' | 'percentage' | 'exact' | 'hidden'
  const [monsterHpVisibility, setMonsterHpVisibility] = useState('tier');

  // Quest runner state
  const [activeQuestId, setActiveQuestId] = useState(null);
  const [activeQuestBeats, setActiveQuestBeats] = useState([]);
  const [currentBeat, setCurrentBeat] = useState(null);

  // Action log
  const [actionLog, setActionLog] = useState([]);

  // XP tracking for session
  const [sessionXp, setSessionXp] = useState(0);

  const timerRef = useRef(null);
  const activeCampaignIdRef = useRef(activeCampaignId);
  activeCampaignIdRef.current = activeCampaignId;
  const [elapsed, setElapsed] = useState(0);

  // Elapsed timer
  useEffect(() => {
    if (sessionActive && sessionStartedAt) {
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - sessionStartedAt) / 1000));
      }, 1000);
      return () => clearInterval(timerRef.current);
    } else {
      setElapsed(0);
    }
  }, [sessionActive, sessionStartedAt]);

  // ── Periodic crash-recovery snapshot (every 30s) ──
  useEffect(() => {
    if (!sessionActive || !sessionId || !activeCampaignId) return;
    const interval = setInterval(() => {
      const combatState = getCombatSnapshot ? getCombatSnapshot() : {};
      const snapshot = {
        campaignId: activeCampaignId,
        campaignName,
        sessionId,
        currentScene: currentScene?.id,
        activeEncounterId,
        encounterMonsters,
        sessionXp,
        sessionStartedAt,
        monsterHpVisibility,
        combat: combatState,
        timestamp: Date.now(),
      };
      invoke('save_session_snapshot', {
        campaignId: activeCampaignId,
        sessionId,
        stateJson: JSON.stringify(snapshot),
      }).catch(e => console.warn('Snapshot save failed:', e));
    }, 30000);
    return () => clearInterval(interval);
  }, [sessionActive, sessionId, activeCampaignId, campaignName, currentScene, activeEncounterId, encounterMonsters, sessionXp, sessionStartedAt, monsterHpVisibility, getCombatSnapshot]);

  const logEvent = useCallback((type, text) => {
    const entry = { type, text, timestamp: new Date().toISOString() };
    setActionLog(prev => [...prev, entry]);
    if (sessionId) {
      invoke('log_session_event', {
        sessionId,
        eventType: type,
        payloadJson: JSON.stringify({ text }),
      }).catch(e => console.error('Failed to log event:', e));
    }
  }, [sessionId]);

  // Load all campaign data
  const loadCampaignData = useCallback(async () => {
    try {
      if (import.meta.env.DEV) console.log('[LiveSession] loadCampaignData: fetching scenes, npcs, quests, handouts...');
      // Try campaign DB first (campaigns.db)
      const [sceneList, campaignNpcs, campaignQuests, handoutList] = await Promise.all([
        invoke('list_scenes').catch(() => []),
        invoke('list_campaign_npcs').catch(() => []),
        invoke('list_campaign_quests').catch(() => []),
        invoke('list_handouts').catch(() => []),
      ]);

      let npcList = campaignNpcs || [];
      let questList = campaignQuests || [];

      // Fallback: if campaign DB returned nothing, try character-based data
      // (DM mode from Dashboard stores data in per-character DB)
      if (npcList.length === 0 && activeCampaignIdRef.current) {
        const charNpcs = await invoke('get_npcs', { characterId: activeCampaignIdRef.current }).catch(() => []);
        if (charNpcs && charNpcs.length > 0) {
          if (import.meta.env.DEV) console.log('[LiveSession] Using character-based NPCs:', charNpcs.length);
          npcList = charNpcs;
        }
      }
      if (questList.length === 0 && activeCampaignIdRef.current) {
        const charQuests = await invoke('get_quests', { characterId: activeCampaignIdRef.current }).catch(() => []);
        if (charQuests && charQuests.length > 0) {
          if (import.meta.env.DEV) console.log('[LiveSession] Using character-based quests:', charQuests.length);
          questList = charQuests;
        }
      }

      if (import.meta.env.DEV) console.log('[LiveSession] loadCampaignData results:', {
        scenes: (sceneList || []).length,
        npcs: npcList.length,
        quests: questList.length,
        handouts: (handoutList || []).length,
      });
      setScenes(sceneList || []);
      setNpcs(npcList);
      setQuests(questList);
      setHandouts(handoutList || []);

      const activeSceneId = (sceneList || []).length > 0 ? sceneList[0].active_scene_id : null;
      const active = activeSceneId
        ? (sceneList || []).find(s => s.id === activeSceneId)
        : (sceneList || [])[0] || null;
      setCurrentScene(active || (sceneList || [])[0] || null);
    } catch (e) {
      console.error('[LiveSession] Failed to load campaign data:', e);
      toast.error('Failed to load campaign data');
    }
  }, []);

  const startLiveSession = useCallback(async (campaignId, name) => {
    try {
      if (import.meta.env.DEV) console.log('[LiveSession] Step 1: Selecting campaign:', campaignId);
      // Try select_campaign first (campaigns.db), fall back to set_active_campaign_id
      // (character-based campaigns from Dashboard DM mode don't exist in campaigns.db)
      try {
        await invoke('select_campaign', { campaignId });
      } catch {
        if (import.meta.env.DEV) console.log('[LiveSession] Campaign not in campaigns.db, using character-based mode');
        await invoke('set_active_campaign_id', { campaignId });
      }
      if (import.meta.env.DEV) console.log('[LiveSession] Step 2: Starting session...');
      const result = await invoke('start_session');
      if (import.meta.env.DEV) console.log('[LiveSession] Step 3: Session started, id:', result.session_id);
      setActiveCampaignId(campaignId);
      setCampaignName(name || 'Campaign');
      setSessionId(result.session_id);
      setSessionActive(true);
      setSessionStartedAt(Date.now());
      setActionLog([]);
      setSessionXp(0);

      // Load all campaign data — pulls quests, NPCs, scenes, handouts from the selected campaign
      if (import.meta.env.DEV) console.log('[LiveSession] Step 4: Loading campaign data...');
      await loadCampaignData();
      if (import.meta.env.DEV) console.log('[LiveSession] Step 5: Campaign data loaded. Broadcasting...');

      // Notify players that a live session is active (locks XP/currency editing)
      sendEvent('session_start', { campaign_id: campaignId, campaign_name: name });
      sendBroadcast('announcement', 'Session Started', `The adventure begins! Welcome to ${name || 'the campaign'}.`);
      logEvent('session_start', `Live session started for ${name}`);
      if (import.meta.env.DEV) console.log('[LiveSession] Session fully started!');
    } catch (e) {
      console.error('[LiveSession] Failed to start live session:', e);
      toast.error(`Failed to start session: ${e?.message || e}`);
      throw e;
    }
  }, [loadCampaignData, sendBroadcast, sendEvent, logEvent]);

  const endLiveSession = useCallback(async () => {
    try {
      if (sessionId) {
        await invoke('end_session', { sessionId });
      }
      // Log XP summary if any was earned
      if (sessionXp > 0) {
        sendBroadcast('loot', 'Session XP', `The party earned ${sessionXp} XP this session!`);
      }
      sendEvent('session_end', {});
      sendBroadcast('announcement', 'Session Ended', 'Thanks for playing! The session has ended.');
      logEvent('session_end', `Live session ended — ${sessionXp} XP earned`);

      // Mark snapshot as complete so it won't trigger recovery on next launch
      if (sessionId) {
        invoke('mark_session_complete', { sessionId }).catch(e => console.warn('[LiveSession] mark session complete:', e));
      }

      setSessionActive(false);
      setSessionId(null);
      setActiveCampaignId(null);
      setCampaignName('');
      setSessionStartedAt(null);
      setCurrentScene(null);
      setScenes([]);
      setNpcs([]);
      setQuests([]);
      setHandouts([]);
      setActiveEncounterId(null);
      setEncounterMonsters([]);
      setSessionXp(0);
    } catch (e) {
      console.error('Failed to end live session:', e);
      toast.error('Failed to end session');
    }
  }, [sessionId, sessionXp, sendBroadcast, sendEvent, logEvent]);

  const setActiveScene = useCallback(async (scene) => {
    try {
      await invoke('advance_scene', { sceneId: scene.id });
      setCurrentScene(scene);
      // Send scene_change with player_description so players see scene info
      sendBroadcast('scene_change', scene.name, scene.player_description || scene.description || 'The scene shifts...');
      logEvent('scene_change', `Advanced to scene: ${scene.name}`);
    } catch (e) {
      console.error('Failed to advance scene:', e);
      toast.error('Failed to advance scene');
    }
  }, [sendBroadcast, logEvent]);

  const startSceneEncounter = useCallback(async (sceneId) => {
    try {
      const encounter = await invoke('create_encounter', { sceneId });
      const encounterId = encounter.id;

      const monsters = await invoke('get_encounter_monsters', { encounterId }).catch(e => {
        console.error('Failed to load encounter monsters:', e);
        return [];
      });
      setEncounterMonsters(monsters || []);
      setActiveEncounterId(encounterId);

      const playerEntries = members
        .filter(m => m.client_id !== myClientId && m.character)
        .map(m => {
          const char = m.character || {};
          const dexScore = char.ability_scores?.dexterity || char.ability_scores?.DEX || char.dex || 10;
          const dexMod = Math.floor((dexScore - 10) / 2);
          const d20 = rollDie(20);
          return {
            name: char.name || m.display_name || 'Player',
            client_id: m.client_id,
            initiative: d20 + dexMod,
            is_monster: false,
          };
        });
      // Include connected members without character data (fallback to plain d20)
      const playersNoChar = members
        .filter(m => m.client_id !== myClientId && !m.character)
        .map(m => ({
          name: m.display_name || 'Player',
          client_id: m.client_id,
          initiative: rollDie(20),
          is_monster: false,
        }));
      const monsterEntries = (monsters || []).filter(m => m.alive !== 0 && m.alive !== false).map(m => {
        let dexMod = 0;
        if (m.stat_block_json) {
          try {
            const stats = JSON.parse(m.stat_block_json);
            dexMod = stats.dex_mod || Math.floor(((stats.dex || stats.dexterity || 10) - 10) / 2);
          } catch (e) { console.warn('[LiveSession] JSON parse error:', e); }
        }
        const d20 = rollDie(20);
        return {
          name: m.name,
          monster_id: m.id,
          initiative: d20 + dexMod,
          is_monster: true,
        };
      });
      const initiative = [...playerEntries, ...playersNoChar, ...monsterEntries].sort((a, b) => b.initiative - a.initiative);

      await invoke('start_encounter', { encounterId, initiativeJson: JSON.stringify(initiative) }).catch(e => {
        console.error('Failed to start encounter in DB:', e);
      });
      startCombat(initiative);
      logEvent('combat_start', `Encounter started with ${monsters?.length || 0} monsters`);
    } catch (e) {
      console.error('Failed to start encounter:', e);
      toast.error('Failed to start encounter');
    }
  }, [members, myClientId, startCombat, logEvent]);

  const endSceneEncounter = useCallback(async () => {
    try {
      if (activeEncounterId) {
        await invoke('end_encounter', { encounterId: activeEncounterId }).catch(e => {
          console.error('Failed to end encounter in DB:', e);
        });
      }

      // Distribute XP to players
      const playerMembers = members.filter(m => m.client_id !== myClientId);
      const playerCount = playerMembers.length;
      if (sessionXp > 0 && playerCount > 0) {
        const perPlayerXp = Math.floor(sessionXp / playerCount);
        sendXpAward(perPlayerXp, 'Encounter Complete', true);
        logEvent('xp_award', `${sessionXp} XP distributed (${perPlayerXp} per player)`);

        // Check level-up for each player
        for (const member of playerMembers) {
          const char = member.character;
          if (!char) continue;
          const currentXp = (char.xp || 0) + perPlayerXp;
          const currentLevel = char.level || 1;
          const nextLevelXp = XP_LEVEL_THRESHOLDS[currentLevel] || Infinity;
          if (currentXp >= nextLevelXp && currentLevel < 20) {
            sendEvent('level_up_available', { new_level: currentLevel + 1, current_xp: currentXp });
          }
        }
      }

      endCombat();
      setActiveEncounterId(null);
      setEncounterMonsters([]);
      logEvent('combat_end', 'Encounter ended');
    } catch (e) {
      console.error('Failed to end encounter:', e);
      toast.error('Failed to end encounter');
    }
  }, [activeEncounterId, endCombat, logEvent, members, myClientId, sessionXp, sendXpAward]);

  const restParty = useCallback(async (restType) => {
    try {
      sendRestSync(restType);
      sendBroadcast('announcement',
        restType === 'long' ? 'Long Rest' : 'Short Rest',
        restType === 'long'
          ? 'The party settles down for a long rest. 8 hours pass...'
          : 'The party takes a short rest. 1 hour passes...'
      );
      logEvent('rest', `${restType === 'long' ? 'Long' : 'Short'} rest triggered for all players`);
    } catch (e) {
      console.error('Failed to trigger rest:', e);
      toast.error('Failed to trigger rest');
    }
  }, [sendRestSync, sendBroadcast, logEvent]);

  const completeQuest = useCallback(async (questId, rewards) => {
    try {
      const quest = quests.find(q => q.id === questId);
      if (!quest) return;

      // Update quest status
      await invoke('update_campaign_quest', {
        questId,
        title: quest.title || '',
        giver: quest.giver || '',
        description: quest.description || '',
        status: 'completed',
        visibility: quest.visibility || 'visible',
        objectivesJson: quest.objectives_json || '[]',
      }).catch(e => console.error('Failed to complete quest:', e));

      // Award XP
      const xpReward = rewards?.xp || quest.reward_xp || 0;
      if (xpReward > 0) {
        const playerCount = members.filter(m => m.client_id !== myClientId).length;
        const perPlayer = playerCount > 0 ? Math.floor(xpReward / playerCount) : xpReward;
        sendXpAward(perPlayer, `Quest: ${quest.title}`, true);
        setSessionXp(prev => prev + xpReward);
      }

      // Send loot if any
      const rewardGold = rewards?.gold || quest.reward_gold || 0;
      let rewardItems = [];
      try {
        rewardItems = JSON.parse(rewards?.items_json || quest.reward_items_json || '[]');
      } catch (e) { console.warn('[LiveSession] JSON parse error:', e); rewardItems = []; }

      if (rewardGold > 0 || rewardItems.length > 0) {
        sendEvent('loot_drop', {
          items: rewardItems,
          gold: rewardGold,
          description: `Quest Reward: ${quest.title}`
        });
      }

      // Broadcast
      sendBroadcast('quest_reveal', quest.title, 'Quest Completed!');
      logEvent('quest_complete', `Quest completed: ${quest.title} (+${xpReward} XP, +${rewardGold} GP)`);

      // Refresh quests
      const updated = await invoke('list_campaign_quests').catch(() => []);
      setQuests(updated || []);
    } catch (e) {
      console.error('Failed to complete quest:', e);
      toast.error('Failed to complete quest');
    }
  }, [quests, members, myClientId, sendXpAward, sendEvent, sendBroadcast, logEvent]);

  const startRandomEncounter = useCallback(async (monsters) => {
    if (!currentScene?.id) {
      toast.error('No active scene for encounter');
      return;
    }
    try {
      const encounter = await invoke('create_encounter', { sceneId: currentScene.id });
      const encounterId = encounter.id;

      // Add monsters to encounter
      for (const monster of (monsters || [])) {
        await invoke('add_monster_to_encounter', {
          encounterId,
          name: monster.name,
          hpMax: monster.hp_max || 20,
          ac: monster.ac || 10,
          monsterType: monster.type || 'beast',
        }).catch(e => console.error('Failed to add monster:', e));
      }

      const monsterList = await invoke('get_encounter_monsters', { encounterId }).catch(() => []);
      setEncounterMonsters(monsterList || []);
      setActiveEncounterId(encounterId);

      // Build initiative
      const playerEntries = members
        .filter(m => m.client_id !== myClientId && m.character)
        .map(m => {
          const char = m.character || {};
          const dexScore = char.ability_scores?.dexterity || char.ability_scores?.DEX || char.dex || 10;
          const dexMod = Math.floor((dexScore - 10) / 2);
          const d20 = rollDie(20);
          return {
            name: char.name || m.display_name || 'Player',
            client_id: m.client_id,
            initiative: d20 + dexMod,
            is_monster: false,
          };
        });
      const playersNoChar = members
        .filter(m => m.client_id !== myClientId && !m.character)
        .map(m => ({
          name: m.display_name || 'Player',
          client_id: m.client_id,
          initiative: rollDie(20),
          is_monster: false,
        }));
      const monsterEntries = (monsterList || []).filter(m => m.alive !== 0 && m.alive !== false).map(m => {
        let dexMod = 0;
        if (m.stat_block_json) {
          try {
            const stats = JSON.parse(m.stat_block_json);
            dexMod = stats.dex_mod || Math.floor(((stats.dex || stats.dexterity || 10) - 10) / 2);
          } catch (e) { console.warn('[LiveSession] JSON parse error:', e); }
        }
        const d20 = rollDie(20);
        return {
          name: m.name,
          monster_id: m.id,
          initiative: d20 + dexMod,
          is_monster: true,
        };
      });
      const initiative = [...playerEntries, ...playersNoChar, ...monsterEntries].sort((a, b) => b.initiative - a.initiative);

      await invoke('start_encounter', { encounterId, initiativeJson: JSON.stringify(initiative) }).catch(e => console.warn('[LiveSession] start encounter:', e));
      startCombat(initiative);
      logEvent('combat_start', `Random encounter started with ${monsters?.length || 0} monsters`);
    } catch (e) {
      console.error('Failed to start random encounter:', e);
      toast.error('Failed to start encounter');
    }
  }, [currentScene, members, myClientId, startCombat, logEvent]);

  const damageMonster = useCallback(async (monsterId, delta) => {
    try {
      const monster = encounterMonsters.find(m => m.id === monsterId);
      if (!monster) return;

      const result = await invoke('update_monster_hp', { monsterId, hpDelta: delta });
      const newHp = result?.hp_current ?? ((monster.hp_current ?? monster.hp_max) + delta);

      // Broadcast HP tier to players (with optional extra detail based on visibility setting)
      const tier = getHpTier(newHp, monster.hp_max);
      const hpPayload = {
        monster_id: monsterId,
        name: monster.name,
        tier: tier.tier,
        tier_label: tier.label,
        tier_color: tier.color,
      };
      if (monsterHpVisibility === 'percentage') {
        hpPayload.hp_pct = Math.max(0, Math.round((newHp / monster.hp_max) * 100));
      } else if (monsterHpVisibility === 'exact') {
        hpPayload.hp_exact = `${Math.max(0, newHp)}/${monster.hp_max}`;
      } else if (monsterHpVisibility === 'hidden') {
        hpPayload.hidden = true;
      }
      sendEvent('monster_hp_update', hpPayload);

      if (newHp <= 0) {
        await invoke('kill_monster', { monsterId });
        // XP award — estimate based on monster CR/HP
        const xpReward = estimateMonsterXp(monster);
        setSessionXp(prev => prev + xpReward);
        logEvent('kill', `${monster.name} was slain! (+${xpReward} XP)`);
        sendBroadcast('narrative', 'Creature Slain', `${monster.name} has been defeated! (+${xpReward} XP)`);
      } else {
        logEvent('damage', `${monster.name}: ${delta > 0 ? '+' : ''}${delta} HP (${newHp}/${monster.hp_max})`);
      }

      if (activeEncounterId) {
        const updated = await invoke('get_encounter_monsters', { encounterId: activeEncounterId });
        setEncounterMonsters(updated || []);
      }
    } catch (e) {
      console.error('Failed to update monster HP:', e);
      toast.error('Failed to update monster HP');
    }
  }, [encounterMonsters, activeEncounterId, logEvent, sendBroadcast, sendEvent]);

  const discoverNpc = useCallback(async (npcId) => {
    try {
      const npc = npcs.find(n => n.id === npcId);
      await invoke('discover_npc', { npcId });
      if (npc) {
        sendBroadcast('npc_reveal', npc.name, `${npc.role || 'NPC'} — ${npc.description || 'A mysterious figure appears.'}`);
        logEvent('npc_reveal', `NPC revealed: ${npc.name}`);
        // Sync NPC update to players
        sendEvent('npc_updated', { npc_id: npcId, name: npc.name, visibility: 'discovered' });
      }
      const updated = await invoke('list_campaign_npcs').catch(e => { console.error('Failed to refresh NPCs:', e); return []; });
      setNpcs(updated || []);
    } catch (e) {
      console.error('Failed to discover NPC:', e);
      toast.error('Failed to reveal NPC');
    }
  }, [npcs, sendBroadcast, sendEvent, logEvent]);

  const revealQuest = useCallback(async (questId) => {
    try {
      const quest = quests.find(q => q.id === questId);
      if (!quest) return;
      await invoke('update_campaign_quest', {
        questId,
        title: quest.title || '',
        giver: quest.giver || '',
        description: quest.description || '',
        status: 'active',
        visibility: 'visible',
        objectivesJson: quest.objectives_json || '[]',
      });
      sendBroadcast('quest_reveal', quest.title, quest.description || 'A new quest has been revealed!');
      logEvent('quest_reveal', `Quest revealed: ${quest.title}`);
      // Sync quest update to players
      sendEvent('quest_updated', { quest_id: questId, title: quest.title, status: 'active', visibility: 'visible' });
      const updated = await invoke('list_campaign_quests').catch(e => { console.error('Failed to refresh quests:', e); return []; });
      setQuests(updated || []);
    } catch (e) {
      console.error('Failed to reveal quest:', e);
      toast.error('Failed to reveal quest');
    }
  }, [quests, sendBroadcast, sendEvent, logEvent]);

  const revealHandout = useCallback(async (handoutId) => {
    try {
      const handout = handouts.find(h => h.id === handoutId);
      await invoke('reveal_handout', { handoutId });
      if (handout) {
        sendBroadcast('announcement', `Handout: ${handout.title}`, handout.content || 'A document has been revealed.');
        logEvent('handout_revealed', `Handout revealed: ${handout.title}`);
      }
      const updated = await invoke('list_handouts').catch(e => { console.error('Failed to refresh handouts:', e); return []; });
      setHandouts(updated || []);
    } catch (e) {
      console.error('Failed to reveal handout:', e);
      toast.error('Failed to reveal handout');
    }
  }, [handouts, sendBroadcast, logEvent]);

  // ── NPC Disposition Auto-Update ──
  // Call this when player actions affect NPC relationships
  const updateNpcDisposition = useCallback(async (npcId, delta, reason) => {
    try {
      const npc = npcs.find(n => n.id === npcId);
      if (!npc) return;
      const newScore = Math.max(-100, Math.min(100, (npc.disposition_score || 0) + delta));
      // Map score to disposition label
      let disposition = 'Neutral';
      if (newScore >= 50) disposition = 'Friendly';
      else if (newScore >= 20) disposition = 'Warm';
      else if (newScore <= -50) disposition = 'Hostile';
      else if (newScore <= -20) disposition = 'Unfriendly';

      await invoke('update_npc_disposition', { npcId, disposition, dispositionScore: newScore });
      logEvent('npc_disposition', `${npc.name}: ${disposition} (${delta > 0 ? '+' : ''}${delta}) — ${reason}`);

      // Refresh NPCs
      const updated = await invoke('list_campaign_npcs').catch(() => []);
      setNpcs(updated || []);

      // Broadcast to players if the change crosses a threshold
      if (disposition !== npc.disposition) {
        sendEvent('npc_updated', { npc_id: npcId, name: npc.name, disposition });
      }
    } catch (e) {
      console.error('Failed to update NPC disposition:', e);
    }
  }, [npcs, logEvent, sendEvent]);

  // Auto-update disposition when social encounters resolve positively
  const handleSocialOutcome = useCallback((npcName, outcome) => {
    const npc = npcs.find(n => n.name === npcName);
    if (!npc) return;
    const delta = outcome === 'success' ? 10 : outcome === 'critical_success' ? 20 : outcome === 'failure' ? -5 : outcome === 'critical_failure' ? -15 : 0;
    if (delta !== 0) updateNpcDisposition(npc.id, delta, `Social ${outcome}`);
  }, [npcs, updateNpcDisposition]);

  const refreshData = useCallback(async () => {
    if (sessionActive) {
      await loadCampaignData();
      toast.success('Campaign data refreshed');
    }
  }, [sessionActive, loadCampaignData]);

  // Derive contextual quick-actions for current scene
  const getSceneActions = useCallback(() => {
    if (!currentScene) return [];
    const actions = [];

    if (!activeEncounterId) {
      actions.push({ type: 'encounter', label: 'Start Encounter', action: 'start_encounter' });
    }

    // Hidden NPCs — check both 'hidden' and 'dm_only' visibility
    const hiddenNpcs = npcs.filter(n =>
      (n.visibility === 'hidden' || n.visibility === 'dm_only') &&
      (n.location === currentScene.location || n.location === currentScene.name || !n.location)
    );
    hiddenNpcs.forEach(n => {
      actions.push({ type: 'npc', label: `Reveal NPC: ${n.name}`, id: n.id, action: 'discover_npc' });
    });

    // Hidden quests — check both visibility and status
    const hiddenQuests = quests.filter(q => q.visibility === 'hidden' || q.visibility === 'dm_only' || q.status === 'hidden');
    hiddenQuests.forEach(q => {
      actions.push({ type: 'quest', label: `Activate Quest: ${q.title}`, id: q.id, action: 'reveal_quest' });
    });

    // Unrevealed handouts
    const unrevealedHandouts = handouts.filter(h => !h.revealed);
    unrevealedHandouts.forEach(h => {
      actions.push({ type: 'handout', label: `Reveal Handout: ${h.title}`, id: h.id, action: 'reveal_handout' });
    });

    // Scene-contextual skill check suggestions
    const text = (currentScene.mood || '') + (currentScene.phase || '') + currentScene.name + (currentScene.description || '');
    if (/explor|dungeon|cave|ruin|search|hidden|trap/i.test(text)) {
      actions.push({ type: 'prompt', label: 'Request Perception Check', action: 'perception_check' });
    }
    if (/stealth|ambush|sneak|patrol|guard/i.test(text)) {
      actions.push({ type: 'prompt', label: 'Request Stealth Check', action: 'stealth_check' });
    }

    return actions;
  }, [currentScene, npcs, quests, handouts, activeEncounterId]);

  // Quest runner functions
  const loadQuestForSession = useCallback(async (questId) => {
    try {
      setActiveQuestId(questId);
      const beats = await invoke('list_quest_beats', { questId }).catch(() => []);
      setActiveQuestBeats(beats || []);
      const quest = quests.find(q => q.id === questId);
      const activeBeatId = quest?.active_beat_id;
      if (activeBeatId) {
        setCurrentBeat((beats || []).find(b => b.id === activeBeatId) || (beats || [])[0] || null);
      } else {
        setCurrentBeat((beats || [])[0] || null);
      }
      logEvent('quest_loaded', `Quest loaded for session: ${quest?.title || questId}`);
    } catch (e) {
      console.error('Failed to load quest:', e);
      toast.error('Failed to load quest');
    }
  }, [quests, logEvent]);

  const advanceQuestBeat = useCallback(async () => {
    if (!activeQuestId) return;
    try {
      const result = await invoke('advance_quest_beat', { questId: activeQuestId });
      // Refresh beats
      const beats = await invoke('list_quest_beats', { questId: activeQuestId }).catch(() => []);
      setActiveQuestBeats(beats || []);
      if (result?.id) {
        setCurrentBeat(result);
        logEvent('beat_advanced', `Beat advanced to: ${result.title || 'next'}`);
      } else {
        // Quest complete — no more beats
        setCurrentBeat(null);
        logEvent('quest_beats_done', 'All quest beats completed');
      }
      // Refresh quests
      const updatedQuests = await invoke('list_campaign_quests').catch(() => []);
      setQuests(updatedQuests || []);
    } catch (e) {
      console.error('Failed to advance beat:', e);
      toast.error('Failed to advance quest beat');
    }
  }, [activeQuestId, logEvent]);

  const value = useMemo(() => ({
    activeCampaignId, campaignName, sessionId, sessionActive, sessionStartedAt, elapsed,
    currentScene, scenes, npcs, quests, handouts,
    activeEncounterId, encounterMonsters, monsterHpVisibility, setMonsterHpVisibility,
    actionLog, sessionXp,
    activeQuestId, activeQuestBeats, currentBeat,
    startLiveSession, endLiveSession,
    setActiveScene, startSceneEncounter, endSceneEncounter,
    damageMonster, discoverNpc, revealQuest, revealHandout,
    logEvent, getSceneActions, refreshData,
    restParty, completeQuest, startRandomEncounter,
    loadQuestForSession, advanceQuestBeat,
    updateNpcDisposition, handleSocialOutcome,
  }), [
    activeCampaignId, campaignName, sessionId, sessionActive, sessionStartedAt, elapsed,
    currentScene, scenes, npcs, quests, handouts,
    activeEncounterId, encounterMonsters, monsterHpVisibility, setMonsterHpVisibility,
    actionLog, sessionXp,
    activeQuestId, activeQuestBeats, currentBeat,
    startLiveSession, endLiveSession,
    setActiveScene, startSceneEncounter, endSceneEncounter,
    damageMonster, discoverNpc, revealQuest, revealHandout,
    logEvent, getSceneActions, refreshData,
    restParty, completeQuest, startRandomEncounter,
    loadQuestForSession, advanceQuestBeat,
    updateNpcDisposition, handleSocialOutcome,
  ]);

  return <LiveSessionContext.Provider value={value}>{children}</LiveSessionContext.Provider>;
}

// ── XP estimation based on monster HP (5e SRD approximation) ──
function estimateMonsterXp(monster) {
  const hp = monster.hp_max || 0;
  if (hp <= 6) return 10;
  if (hp <= 14) return 25;
  if (hp <= 25) return 50;
  if (hp <= 35) return 100;
  if (hp <= 49) return 200;
  if (hp <= 70) return 450;
  if (hp <= 85) return 700;
  if (hp <= 100) return 1100;
  if (hp <= 115) return 1800;
  if (hp <= 130) return 2300;
  if (hp <= 145) return 2900;
  if (hp <= 160) return 3900;
  if (hp <= 175) return 5000;
  if (hp <= 190) return 5900;
  if (hp <= 210) return 7200;
  if (hp <= 240) return 8400;
  if (hp <= 270) return 10000;
  if (hp <= 310) return 11500;
  if (hp <= 350) return 13000;
  if (hp <= 400) return 15000;
  return 18000;
}
