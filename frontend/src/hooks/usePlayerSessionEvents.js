import { useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { CONDITION_EFFECTS } from '../data/conditionEffects';
import toast from 'react-hot-toast';

// Safe field access helpers
function safeStr(val, fallback = '') { return typeof val === 'string' ? val : fallback; }
function safeNum(val, fallback = 0) { return typeof val === 'number' && Number.isFinite(val) ? val : fallback; }

export default function usePlayerSessionEvents({
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
}) {
  useEffect(() => {
    let cancelled = false;
    let unlisten;
    loadHandouts();

    (async () => {
      try {
        unlisten = await listen('session-game-event', (event) => {
          if (cancelled) return;
          const gameEvent = event.payload?.event || event.payload;
          if (!gameEvent?.type || typeof gameEvent.type !== 'string') {
            if (gameEvent?.type !== undefined) console.warn('[PlayerEvents] Invalid event type:', gameEvent?.type);
            return;
          }

          try { switch (gameEvent.type) {
            case 'HandoutRevealed':
              loadHandouts();
              toast('New handout from the DM!', { icon: '\uD83D\uDCDC', duration: 4000 });
              addFeedEvent('system', 'New handout received from the DM');
              break;
            case 'SceneAdvance':
              dispatch({ type: 'SET_SCENE', payload: { id: gameEvent.scene_id, name: gameEvent.scene_name, description: gameEvent.player_description || '', mood: gameEvent.mood || '', phase: gameEvent.phase || '' } });
              toast(`Scene: ${gameEvent.scene_name || 'New scene'}`, { icon: '\uD83D\uDDFA\uFE0F', duration: 3000 });
              addFeedEvent('world', `Scene changed: ${gameEvent.scene_name || 'New scene'}${gameEvent.mood ? ` — Mood: ${gameEvent.mood}` : ''}`);
              break;
            case 'TurnAdvance':
              if (gameEvent.round != null) {
                dispatch({ type: 'SET_TURN', payload: { round: gameEvent.round, combatant_id: gameEvent.combatant_id } });
              } else {
                dispatch({ type: 'NEXT_TURN' });
              }
              addFeedEvent('combat', `Turn advanced — Round ${gameEvent.round || round}`);
              break;
            case 'EncounterStart': {
              dispatch({ type: 'SET_ENCOUNTER', payload: gameEvent });
              let initList = gameEvent.initiative || null;
              if (!initList && gameEvent.initiative_json) {
                try { initList = JSON.parse(gameEvent.initiative_json); } catch { initList = null; }
              }
              if (initList) dispatch({ type: 'SET_INITIATIVE', payload: initList });
              toast('Combat started!', { icon: '\u2694\uFE0F', duration: 3000 });
              addFeedEvent('combat', 'Combat has begun! Roll initiative!', initList ? `${initList.length} combatants` : null);
              break;
            }
            case 'EncounterEnd':
              dispatch({ type: 'SET_ENCOUNTER', payload: null });
              toast('Combat ended', { icon: '\uD83D\uDEE1\uFE0F', duration: 3000 });
              addFeedEvent('combat', 'Combat has ended');
              break;
            case 'HpDelta': {
              const delta = safeNum(gameEvent.delta, 0);
              const hpMsg = `HP ${delta > 0 ? '+' : ''}${delta}${gameEvent.reason ? `: ${gameEvent.reason}` : ''}`;
              toast(hpMsg, { icon: gameEvent.delta > 0 ? '\uD83D\uDC9A' : '\uD83D\uDC94', duration: 3000 });
              addFeedEvent('combat', hpMsg);
              refreshCharacter();
              break;
            }
            case 'ConditionApplied': {
              const condApplied = gameEvent.condition || 'effect';
              const appliedSummary = CONDITION_EFFECTS[condApplied]?.summary;
              toast(`Condition: ${condApplied} applied${appliedSummary ? `\n${appliedSummary}` : ''}`, {
                icon: '\u26A0\uFE0F', duration: 4000,
                style: { background: '#1a1520', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.4)', maxWidth: '360px', lineHeight: '1.4' }
              });
              addFeedEvent('combat', `Condition applied: ${condApplied}`, appliedSummary);
              break;
            }
            case 'ConditionRemoved':
              toast(`Condition: ${gameEvent.condition || 'effect'} removed`, {
                icon: '\u2705', duration: 2500,
                style: { background: '#1a1520', color: '#4ade80', border: '1px solid rgba(74,222,128,0.4)' }
              });
              addFeedEvent('combat', `Condition removed: ${gameEvent.condition || 'effect'}`);
              break;
            case 'RestCompleted':
              toast(`${gameEvent.rest_type === 'long' ? 'Long' : 'Short'} rest completed!`, {
                icon: gameEvent.rest_type === 'long' ? '\uD83C\uDF19' : '\u2600\uFE0F', duration: 4000,
              });
              addFeedEvent('system', `${gameEvent.rest_type === 'long' ? 'Long' : 'Short'} rest completed — HP and abilities restored`);
              refreshCharacter();
              sendToDm({ type: 'RequestStateRefresh', player_uuid: playerUuid || '' }).catch(() => {});
              break;
            case 'XpAwarded':
              if (gameEvent.player_ids && Array.isArray(gameEvent.player_ids) && playerUuid && !gameEvent.player_ids.includes(playerUuid)) {
                break;
              }
              const xpAmount = safeNum(gameEvent.amount, 0);
              toast(`Gained ${xpAmount} XP! ${gameEvent.reason || ''}`, { icon: '\u2B50', duration: 5000 });
              addFeedEvent('loot', `Gained ${xpAmount} XP${gameEvent.reason ? ` — ${gameEvent.reason}` : ''}`);
              break;
            case 'InspirationAwarded':
              if (gameEvent.player_id && playerUuid && gameEvent.player_id !== playerUuid) {
                break;
              }
              toast(gameEvent.inspired ? 'You have inspiration!' : 'Inspiration removed', {
                icon: gameEvent.inspired ? '\u2728' : '\uD83D\uDCAB', duration: 3000,
              });
              addFeedEvent('loot', gameEvent.inspired ? 'Inspiration granted!' : 'Inspiration spent');
              break;
            case 'QuestFlagSet':
              toast(`Quest update: ${gameEvent.flag || 'objective changed'}`, { icon: '\uD83D\uDCCB', duration: 4000 });
              addFeedEvent('quest', `Quest updated: ${gameEvent.flag || 'objective changed'}`);
              break;
            case 'MonsterKilled':
              toast(`${gameEvent.monster_name || 'Monster'} has been slain!`, { icon: '\u2620\uFE0F', duration: 4000 });
              addFeedEvent('combat', `${gameEvent.monster_name || 'Monster'} has been slain!`);
              if (gameEvent.monster_id) {
                dispatch({
                  type: 'SET_INITIATIVE',
                  payload: initiative.filter(entry => entry.id !== gameEvent.monster_id),
                });
              }
              break;
            case 'LevelUp':
              toast(`Level up! ${safeStr(gameEvent.player_name, 'Player')} is now level ${safeNum(gameEvent.new_level, '?')}!`, {
                icon: '\u2B50', duration: 6000,
                style: { background: '#1a1520', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.4)', fontWeight: 600 },
              });
              addFeedEvent('loot', `Level up! ${safeStr(gameEvent.player_name, 'Player')} reached level ${safeNum(gameEvent.new_level, '?')}!`);
              refreshCharacter();
              break;
            case 'ActionApproved':
              toast('Your action was approved!', {
                icon: '\u2705', duration: 4000,
                style: { background: '#064e3b', color: '#a7f3d0', border: '1px solid rgba(52,211,153,0.4)' },
              });
              addFeedEvent('system', 'Action approved by the DM');
              break;
            case 'ActionDenied':
              toast(`Action denied: ${gameEvent.reason || 'Not allowed'}`, {
                icon: '\u274C', duration: 5000,
                style: { background: '#450a0a', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.4)' },
              });
              addFeedEvent('system', `Action denied: ${gameEvent.reason || 'Not allowed'}`);
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
              addFeedEvent('combat', gameEvent.spell ? `Concentrating on ${gameEvent.spell}` : 'Concentration dropped');
              break;
            case 'SessionPaused':
              dispatch({ type: 'PAUSE_SESSION' });
              toast('Session paused by the DM', { icon: '\u23F8\uFE0F', duration: 4000 });
              addFeedEvent('system', 'The DM has paused the session');
              break;
            case 'SessionResumed':
              dispatch({ type: 'RESUME_SESSION' });
              toast('Session resumed!', { icon: '\u25B6\uFE0F', duration: 3000 });
              addFeedEvent('system', 'The DM has resumed the session');
              break;
            case 'SessionEnd':
              toast('The DM has ended the session', { icon: '\uD83C\uDFC1', duration: 6000 });
              addFeedEvent('system', 'The DM has ended the session. Thanks for playing!');
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
              addFeedEvent('system', `Connected to ${snap.campaign_name || 'session'}`);
              break;
            }
            // ── New event types for narrative/story pipeline ──
            case 'NarrativeText':
              addFeedEvent('narrative', gameEvent.text || gameEvent.message || 'The DM narrates...');
              break;
            case 'CombatAction':
              addFeedEvent('combat', gameEvent.text || gameEvent.description || 'A combat action occurs');
              break;
            case 'NpcDialogue':
              addFeedEvent('npc', `${gameEvent.npc_name || 'NPC'}: "${gameEvent.text || gameEvent.dialogue || '...'}"`, gameEvent.context);
              break;
            case 'EnvironmentChange':
              addFeedEvent('world', gameEvent.text || gameEvent.description || 'The environment shifts...');
              break;
            case 'QuestUpdate':
              addFeedEvent('quest', gameEvent.text || `Quest updated: ${gameEvent.quest_title || 'Unknown quest'}`);
              break;
            case 'LootDrop':
              addFeedEvent('loot', gameEvent.text || `Loot: ${gameEvent.items || gameEvent.description || 'Treasure found!'}`);
              break;
            case 'SkillCheckResult':
              addFeedEvent('skill_check', gameEvent.text || `Skill check: ${gameEvent.skill || 'check'} — ${gameEvent.success ? 'Success' : 'Failure'}`);
              break;
            case 'SkillCheckPrompt': {
              setSkillCheckPrompt({
                skill: gameEvent.skill || 'Perception',
                ability: gameEvent.ability || 'WIS',
                dc: gameEvent.dc,
                description: gameEvent.description || '',
                prompt_id: gameEvent.prompt_id,
                show_dc: gameEvent.show_dc || false,
              });
              toast(`Skill check: ${gameEvent.skill || 'Roll required'}!`, {
                icon: '\uD83C\uDFAF',
                duration: 5000,
                style: { background: '#1a1520', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.4)' },
              });
              addFeedEvent('skill_check', `DM requests ${gameEvent.skill || 'ability'} check${gameEvent.description ? `: ${gameEvent.description}` : ''}`);
              break;
            }
            case 'NPCDiscovered': {
              const npcName = safeStr(gameEvent.npc_name || gameEvent.name, 'Unknown NPC');
              toast(`New NPC discovered: ${npcName}`, { icon: '\uD83D\uDC64', duration: 4000 });
              addFeedEvent('npc', `Discovered NPC: ${npcName}${gameEvent.role ? ` (${gameEvent.role})` : ''}`);
              setDiscoveredNpcs(prev => {
                if (prev.some(n => n.id === gameEvent.npc_id)) return prev;
                return [...prev, { id: gameEvent.npc_id, name: npcName, role: gameEvent.role }];
              });
              break;
            }
            case 'QuestRevealed': {
              const questTitle = safeStr(gameEvent.title, 'Unknown Quest');
              toast(`New quest: ${questTitle}`, { icon: '\uD83D\uDCDC', duration: 5000, style: { background: '#1a1520', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)' } });
              addFeedEvent('quest', `New quest available: ${questTitle}`);
              setActiveQuests(prev => {
                if (prev.some(q => q.id === gameEvent.quest_id)) return prev;
                return [...prev, { id: gameEvent.quest_id, title: questTitle, status: 'active' }];
              });
              break;
            }
            case 'QuestUpdated': {
              const qTitle = gameEvent.title || 'Quest';
              toast(`Quest updated: ${qTitle} — ${gameEvent.status || 'updated'}`, { icon: '\uD83D\uDCCB', duration: 4000 });
              addFeedEvent('quest', `Quest updated: ${qTitle} — ${gameEvent.status || 'updated'}`);
              setActiveQuests(prev => prev.map(q => q.id === gameEvent.quest_id ? { ...q, status: gameEvent.status || q.status, title: gameEvent.title || q.title } : q));
              break;
            }
            case 'WorldStateChanged':
              toast(`World update: ${gameEvent.key || 'Something changed'}`, { icon: '\uD83C\uDF0D', duration: 3000 });
              addFeedEvent('world', `World state changed: ${gameEvent.key || 'update'}`);
              break;
            case 'SceneRevealed':
              dispatch({ type: 'SET_SCENE', payload: { id: gameEvent.scene_id, name: gameEvent.scene_name, description: gameEvent.player_description, mood: gameEvent.mood } });
              addFeedEvent('world', `New location: ${gameEvent.scene_name || 'Unknown'}`);
              break;
            default:
              break;
          } } catch (handlerErr) {
            console.error(`[PlayerEvents] Error handling ${gameEvent.type}:`, handlerErr);
            addFeedEvent('system', 'An event failed to process');
          }
        });
        if (cancelled && unlisten) unlisten();
      } catch { /* listener setup failed */ }
    })();

    return () => { cancelled = true; if (unlisten) unlisten(); };
  }, [loadHandouts, dispatch, sendToDm, playerUuid, initiative, addFeedEvent, round, refreshCharacter, setConnected, setSkillCheckPrompt, setDiscoveredNpcs, setActiveQuests]);
}
