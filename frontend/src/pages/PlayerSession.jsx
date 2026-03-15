import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wifi, WifiOff, Swords, Dice5, ScrollText,
  Image, Shield, Heart, User, LogOut, FileText, Eye,
  Send, MessageCircle, Hand, Moon, Target,
  Trophy, BookOpen, Compass, Bell,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { useSession } from '../contexts/SessionContext';
import { useCampaignSyncSafe } from '../contexts/CampaignSyncContext';
import { CONDITION_EFFECTS } from '../data/conditionEffects';
import { getOverview, updateOverview } from '../api/overview';
import { getItems, getCurrency } from '../api/inventory';
import { getSpellSlots, updateSpellSlots } from '../api/spells';
import { getConditions } from '../api/combat';
import { addJournalEntry } from '../api/journal';
import CampaignOverview from '../components/CampaignOverview';
import PlayerEventFeed from '../components/party/PlayerEventFeed';
import {
  Package, Coins, Sparkles, AlertTriangle, Edit3, Plus, Minus,
  ChevronDown, ChevronUp, Zap, Brain,
} from 'lucide-react';

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
    campaignId, campaignName, sessionActive,
    initiative, round, currentTurn, currentScene,
    connectedPlayers, chatMessages, dispatch,
    sendToDm, broadcastEvent, playerUuid,
  } = useSession();

  const syncCtx = useCampaignSyncSafe();
  const { isMyTurn, combatActive, initiativeOrder, currentTurn: syncCurrentTurn, round: syncRound, currentMood } = syncCtx || {};

  const [diceResult, setDiceResult] = useState(null);
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

  // Character overview data (loaded from local DB using playerUuid = characterId)
  const [charOverview, setCharOverview] = useState(null);
  const [charAbilities, setCharAbilities] = useState([]);
  const [showCampaignWorld, setShowCampaignWorld] = useState(false);

  // Session-1 essentials
  const [inventory, setInventory] = useState([]);
  const [currency, setCurrency] = useState({ cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 });
  const [spellSlots, setSpellSlots] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [hpEditMode, setHpEditMode] = useState(false);
  const [hpDelta, setHpDelta] = useState('');
  const [sessionNote, setSessionNote] = useState('');
  const [showAbilities, setShowAbilities] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showSpellSlots, setShowSpellSlots] = useState(false);

  // Load character overview when playerUuid (characterId) is available
  const refreshCharacter = useCallback(() => {
    if (!playerUuid) return;
    getOverview(playerUuid)
      .then(data => {
        if (data?.overview) setCharOverview(data.overview);
        else if (data?.name) setCharOverview(data);
        if (data?.ability_scores) setCharAbilities(data.ability_scores);
      })
      .catch(err => console.warn('[PlayerSession] Could not load character overview:', err));
  }, [playerUuid]);

  useEffect(() => { refreshCharacter(); }, [refreshCharacter]);

  // Load inventory, spell slots, conditions
  useEffect(() => {
    if (!playerUuid) return;
    getItems(playerUuid).then(setInventory).catch(e => console.warn('[PlayerSession] Failed to load inventory:', e));
    getCurrency(playerUuid).then(c => { if (c) setCurrency(c); }).catch(e => console.warn('[PlayerSession] Failed to load currency:', e));
    getSpellSlots(playerUuid).then(s => { if (s) setSpellSlots(s); }).catch(e => console.warn('[PlayerSession] Failed to load spell slots:', e));
    getConditions(playerUuid).then(c => { if (c) setConditions(c.filter(x => x.active)); }).catch(e => console.warn('[PlayerSession] Failed to load conditions:', e));
  }, [playerUuid]);

  // HP update handler
  const handleHpChange = async (delta) => {
    if (!playerUuid || !charOverview) return;
    const newHp = Math.max(0, Math.min(charOverview.max_hp || 999, (charOverview.current_hp || 0) + delta));
    try {
      await updateOverview(playerUuid, { current_hp: newHp });
      setCharOverview(prev => ({ ...prev, current_hp: newHp }));
      setHpDelta('');
      setHpEditMode(false);
      const label = delta > 0 ? `Healed ${delta}` : `Took ${Math.abs(delta)} damage`;
      addFeedEvent('combat', `${label} (HP: ${newHp}/${charOverview.max_hp})`);
      // Broadcast to DM
      if (connected) {
        sendToDm({ type: 'CharUpdate', player_uuid: playerUuid, hp: newHp, max_hp: charOverview.max_hp }).catch(() => {});
      }
    } catch (e) {
      toast.error('Failed to update HP');
    }
  };

  // Temp HP handler
  const handleSetTempHp = async (val) => {
    if (!playerUuid) return;
    try {
      await updateOverview(playerUuid, { temp_hp: val });
      setCharOverview(prev => ({ ...prev, temp_hp: val }));
    } catch { toast.error('Failed to set temp HP'); }
  };

  // Spell slot use handler
  const handleUseSpellSlot = async (slotLevel) => {
    if (!playerUuid) return;
    const slot = spellSlots.find(s => s.slot_level === slotLevel);
    if (!slot || slot.used_slots >= slot.max_slots) { toast.error('No slots remaining'); return; }
    const updated = spellSlots.map(s =>
      s.slot_level === slotLevel ? { ...s, used_slots: s.used_slots + 1 } : s
    );
    setSpellSlots(updated);
    try {
      await updateSpellSlots(playerUuid, updated.map(s => ({ slot_level: s.slot_level, used_slots: s.used_slots })));
      addFeedEvent('combat', `Used level ${slotLevel} spell slot (${slot.max_slots - slot.used_slots - 1} remaining)`);
    } catch { toast.error('Failed to update spell slots'); }
  };

  // Quick note save
  const handleSaveNote = async () => {
    if (!playerUuid || !sessionNote.trim()) return;
    try {
      await addJournalEntry(playerUuid, {
        title: `Session Note — ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        body: sessionNote.trim(),
        tags: ['session-note'],
        session_number: null, real_date: new Date().toISOString().split('T')[0],
        ingame_date: null, npcs_mentioned: [], pinned: false,
      });
      toast.success('Note saved to journal');
      setSessionNote('');
    } catch { toast.error('Failed to save note'); }
  };

  const addFeedEvent = useCallback((category, message, details) => {
    setEventFeed(prev => {
      const next = [...prev, makeFeedEvent(category, message, details)];
      return next.length > 200 ? next.slice(-200) : next;
    });
  }, []);

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
    const SKILL_ABILITY_MAP = {
      Athletics: 'Strength',
      Acrobatics: 'Dexterity', 'Sleight of Hand': 'Dexterity', Stealth: 'Dexterity',
      Arcana: 'Intelligence', History: 'Intelligence', Investigation: 'Intelligence', Nature: 'Intelligence', Religion: 'Intelligence',
      'Animal Handling': 'Wisdom', Insight: 'Wisdom', Medicine: 'Wisdom', Perception: 'Wisdom', Survival: 'Wisdom',
      Deception: 'Charisma', Intimidation: 'Charisma', Performance: 'Charisma', Persuasion: 'Charisma',
    };
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
              const initList = gameEvent.initiative
                || (gameEvent.initiative_json ? JSON.parse(gameEvent.initiative_json) : null);
              if (initList) dispatch({ type: 'SET_INITIATIVE', payload: initList });
              toast('Combat started!', { icon: '⚔️', duration: 3000 });
              addFeedEvent('combat', 'Combat has begun! Roll initiative!', initList ? `${initList.length} combatants` : null);
              break;
            }
            case 'EncounterEnd':
              dispatch({ type: 'SET_ENCOUNTER', payload: null });
              toast('Combat ended', { icon: '🛡️', duration: 3000 });
              addFeedEvent('combat', 'Combat has ended');
              break;
            case 'HpDelta': {
              const hpMsg = `HP ${gameEvent.delta > 0 ? '+' : ''}${gameEvent.delta}${gameEvent.reason ? `: ${gameEvent.reason}` : ''}`;
              toast(hpMsg, { icon: gameEvent.delta > 0 ? '💚' : '💔', duration: 3000 });
              addFeedEvent('combat', hpMsg);
              refreshCharacter();
              break;
            }
            case 'ConditionApplied': {
              const condApplied = gameEvent.condition || 'effect';
              const appliedSummary = CONDITION_EFFECTS[condApplied]?.summary;
              toast(`Condition: ${condApplied} applied${appliedSummary ? `\n${appliedSummary}` : ''}`, {
                icon: '⚠️', duration: 4000,
                style: { background: '#1a1520', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.4)', maxWidth: '360px', lineHeight: '1.4' }
              });
              addFeedEvent('combat', `Condition applied: ${condApplied}`, appliedSummary);
              break;
            }
            case 'ConditionRemoved':
              toast(`Condition: ${gameEvent.condition || 'effect'} removed`, {
                icon: '✅', duration: 2500,
                style: { background: '#1a1520', color: '#4ade80', border: '1px solid rgba(74,222,128,0.4)' }
              });
              addFeedEvent('combat', `Condition removed: ${gameEvent.condition || 'effect'}`);
              break;
            case 'RestCompleted':
              toast(`${gameEvent.rest_type === 'long' ? 'Long' : 'Short'} rest completed!`, {
                icon: gameEvent.rest_type === 'long' ? '🌙' : '☀️', duration: 4000,
              });
              addFeedEvent('system', `${gameEvent.rest_type === 'long' ? 'Long' : 'Short'} rest completed — HP and abilities restored`);
              refreshCharacter();
              sendToDm({ type: 'RequestStateRefresh', player_uuid: playerUuid || '' }).catch(() => {});
              break;
            case 'XpAwarded':
              if (gameEvent.player_ids && Array.isArray(gameEvent.player_ids) && playerUuid && !gameEvent.player_ids.includes(playerUuid)) {
                break;
              }
              toast(`Gained ${gameEvent.amount || 0} XP! ${gameEvent.reason || ''}`, { icon: '⭐', duration: 5000 });
              addFeedEvent('loot', `Gained ${gameEvent.amount || 0} XP${gameEvent.reason ? ` — ${gameEvent.reason}` : ''}`);
              break;
            case 'InspirationAwarded':
              if (gameEvent.player_id && playerUuid && gameEvent.player_id !== playerUuid) {
                break;
              }
              toast(gameEvent.inspired ? 'You have inspiration!' : 'Inspiration removed', {
                icon: gameEvent.inspired ? '✨' : '💫', duration: 3000,
              });
              addFeedEvent('loot', gameEvent.inspired ? 'Inspiration granted!' : 'Inspiration spent');
              break;
            case 'QuestFlagSet':
              toast(`Quest update: ${gameEvent.flag || 'objective changed'}`, { icon: '📋', duration: 4000 });
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
              toast(`Level up! ${gameEvent.player_name || 'Player'} is now level ${gameEvent.new_level}!`, {
                icon: '\u2B50', duration: 6000,
                style: { background: '#1a1520', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.4)', fontWeight: 600 },
              });
              addFeedEvent('loot', `Level up! ${gameEvent.player_name || 'Player'} reached level ${gameEvent.new_level}!`);
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
            case 'SessionEnd':
              toast('The DM has ended the session', { icon: '🏁', duration: 6000 });
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
              const npcName = gameEvent.npc_name || gameEvent.name || 'Unknown NPC';
              toast(`New NPC discovered: ${npcName}`, { icon: '\uD83D\uDC64', duration: 4000 });
              addFeedEvent('npc', `Discovered NPC: ${npcName}${gameEvent.role ? ` (${gameEvent.role})` : ''}`);
              setDiscoveredNpcs(prev => {
                if (prev.some(n => n.id === gameEvent.npc_id)) return prev;
                return [...prev, { id: gameEvent.npc_id, name: npcName, role: gameEvent.role }];
              });
              break;
            }
            case 'QuestRevealed': {
              const questTitle = gameEvent.title || 'Unknown Quest';
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
          }
        });
        if (cancelled && unlisten) unlisten();
      } catch { /* listener setup failed */ }
    })();

    return () => { cancelled = true; if (unlisten) unlisten(); };
  }, [loadHandouts, dispatch, sendToDm, playerUuid, initiative, addFeedEvent, round, refreshCharacter]);

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
      display: 'flex',
      flexDirection: 'column',
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

      {/* ── Character Stats Bar ── */}
      {charOverview && (
        <div style={{
          padding: '6px 20px',
          display: 'flex', alignItems: 'center', gap: '16px',
          background: 'rgba(201,168,76,0.04)',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
          flexWrap: 'wrap',
        }}>
          <span style={{
            fontSize: '13px', fontWeight: 700,
            color: '#c9a84c',
            fontFamily: 'var(--font-display, Cinzel, Georgia, serif)',
          }}>
            {charOverview.name || 'Unknown'}
          </span>
          {(charOverview.primary_class || charOverview.race) && (
            <span style={{
              fontSize: '11px', color: 'var(--text-dim)',
              fontFamily: 'var(--font-ui)',
            }}>
              {[charOverview.race, charOverview.primary_class, charOverview.primary_subclass].filter(Boolean).join(' ')}
              {charOverview.level ? ` Lv${charOverview.level}` : ''}
            </span>
          )}
          {/* Active conditions */}
          {conditions.length > 0 && (
            <div style={{ display: 'flex', gap: '4px' }}>
              {conditions.map((c, i) => (
                <span key={i} style={{
                  fontSize: '9px', fontWeight: 600, padding: '1px 6px', borderRadius: '4px',
                  background: 'rgba(251,191,36,0.12)', color: '#fbbf24',
                  border: '1px solid rgba(251,191,36,0.25)',
                }}>
                  {c.name || c.condition}{c.rounds_remaining != null ? ` (${c.rounds_remaining}r)` : ''}
                </span>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
            {/* HP with controls */}
            {charOverview.current_hp != null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {hpEditMode ? (
                  <>
                    <button onClick={() => { const v = parseInt(hpDelta) || 5; handleHpChange(-v); }}
                      style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '4px', padding: '1px 6px', cursor: 'pointer', color: '#ef4444', fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      <Minus size={10} />
                    </button>
                    <input type="number" value={hpDelta} onChange={e => setHpDelta(e.target.value)} placeholder="5"
                      onKeyDown={e => { if (e.key === 'Enter') { const v = parseInt(hpDelta) || 0; if (v > 0) handleHpChange(-v); else if (v < 0) handleHpChange(Math.abs(v)); } }}
                      style={{ width: '36px', padding: '1px 4px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'var(--text)', fontSize: '11px', fontFamily: 'var(--font-mono)', textAlign: 'center', outline: 'none' }}
                    />
                    <button onClick={() => { const v = parseInt(hpDelta) || 5; handleHpChange(v); }}
                      style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '4px', padding: '1px 6px', cursor: 'pointer', color: '#4ade80', fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      <Plus size={10} />
                    </button>
                    <button onClick={() => setHpEditMode(false)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-mute)', fontSize: '10px', padding: '0 2px' }}>✕</button>
                  </>
                ) : (
                  <button onClick={() => setHpEditMode(true)} title="Click to adjust HP"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: '1px solid transparent',
                      borderRadius: '4px', padding: '1px 4px', cursor: 'pointer', transition: 'all 0.15s',
                      fontSize: '12px', fontWeight: 600,
                      color: charOverview.current_hp <= 0 ? '#ef4444' : charOverview.current_hp <= Math.floor((charOverview.max_hp || 1) / 4) ? '#fbbf24' : '#4ade80',
                      fontFamily: 'var(--font-mono, monospace)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                  >
                    <Heart size={12} />
                    {charOverview.current_hp}/{charOverview.max_hp || '?'}
                    {charOverview.temp_hp > 0 && (
                      <span style={{ color: '#60a5fa', fontSize: '10px' }}>+{charOverview.temp_hp}</span>
                    )}
                  </button>
                )}
              </div>
            )}
            {charOverview.armor_class != null && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                fontSize: '12px', fontWeight: 600, color: '#a78bfa',
                fontFamily: 'var(--font-mono, monospace)',
              }}>
                <Shield size={12} />
                {charOverview.armor_class}
              </span>
            )}
            {charOverview.speed != null && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                fontSize: '11px', color: 'var(--text-mute)',
                fontFamily: 'var(--font-mono, monospace)',
              }}>
                {charOverview.speed} ft
              </span>
            )}
            {/* Quick toggles */}
            <button onClick={() => setShowAbilities(!showAbilities)} title="Ability Scores"
              style={{ background: showAbilities ? 'rgba(167,139,250,0.15)' : 'none', border: `1px solid ${showAbilities ? 'rgba(167,139,250,0.3)' : 'transparent'}`, borderRadius: '4px', padding: '2px 6px', cursor: 'pointer', color: showAbilities ? '#a78bfa' : 'var(--text-mute)', fontSize: '10px', fontFamily: 'var(--font-mono)', transition: 'all 0.15s' }}>
              <Brain size={11} />
            </button>
            <button onClick={() => setShowInventory(!showInventory)} title="Inventory"
              style={{ background: showInventory ? 'rgba(201,168,76,0.15)' : 'none', border: `1px solid ${showInventory ? 'rgba(201,168,76,0.3)' : 'transparent'}`, borderRadius: '4px', padding: '2px 6px', cursor: 'pointer', color: showInventory ? '#c9a84c' : 'var(--text-mute)', fontSize: '10px', fontFamily: 'var(--font-mono)', transition: 'all 0.15s' }}>
              <Package size={11} />
            </button>
            {spellSlots.some(s => s.max_slots > 0) && (
              <button onClick={() => setShowSpellSlots(!showSpellSlots)} title="Spell Slots"
                style={{ background: showSpellSlots ? 'rgba(155,89,182,0.15)' : 'none', border: `1px solid ${showSpellSlots ? 'rgba(155,89,182,0.3)' : 'transparent'}`, borderRadius: '4px', padding: '2px 6px', cursor: 'pointer', color: showSpellSlots ? '#c084fc' : 'var(--text-mute)', fontSize: '10px', fontFamily: 'var(--font-mono)', transition: 'all 0.15s' }}>
                <Sparkles size={11} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Ability Scores Bar ── */}
      {showAbilities && charAbilities.length > 0 && (
        <div style={{
          padding: '6px 20px', display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center',
          background: 'rgba(167,139,250,0.04)', borderBottom: '1px solid rgba(167,139,250,0.1)',
        }}>
          {charAbilities.map(a => {
            const mod = Math.floor(((a.score || 10) - 10) / 2);
            return (
              <div key={a.ability} style={{ textAlign: 'center', minWidth: '42px' }}>
                <div style={{ fontSize: '8px', fontWeight: 700, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>
                  {(a.ability || '').slice(0, 3)}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                  {a.score || 10}
                </div>
                <div style={{ fontSize: '10px', fontWeight: 600, color: mod >= 0 ? '#4ade80' : '#ef4444', fontFamily: 'var(--font-mono)' }}>
                  {mod >= 0 ? `+${mod}` : mod}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Inventory Bar ── */}
      {showInventory && (
        <div style={{
          padding: '6px 20px', maxHeight: '140px', overflowY: 'auto',
          background: 'rgba(201,168,76,0.04)', borderBottom: '1px solid rgba(201,168,76,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <span style={{ fontSize: '9px', fontWeight: 700, color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>Inventory</span>
            <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
              {['gp', 'sp', 'cp', 'ep', 'pp'].map(coin => currency[coin] > 0 && (
                <span key={coin} style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: coin === 'gp' ? '#fbbf24' : coin === 'sp' ? '#94a3b8' : coin === 'cp' ? '#b45309' : coin === 'pp' ? '#e2e8f0' : '#818cf8' }}>
                  {currency[coin]} {coin}
                </span>
              ))}
            </div>
          </div>
          {inventory.length === 0 ? (
            <div style={{ fontSize: '11px', color: 'var(--text-mute)', fontStyle: 'italic' }}>No items</div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {inventory.map(item => (
                <span key={item.id} style={{
                  fontSize: '10px', padding: '2px 8px', borderRadius: '4px',
                  background: item.equipped ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${item.equipped ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.06)'}`,
                  color: item.equipped ? '#4ade80' : 'var(--text-dim)',
                  fontFamily: 'var(--font-ui)',
                }} title={`${item.name}${item.quantity > 1 ? ` ×${item.quantity}` : ''}${item.description ? `\n${item.description}` : ''}`}>
                  {item.name}{item.quantity > 1 ? ` ×${item.quantity}` : ''}
                  {item.attuned && <Zap size={8} style={{ marginLeft: '2px', color: '#c084fc' }} />}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Spell Slots Bar ── */}
      {showSpellSlots && spellSlots.some(s => s.max_slots > 0) && (
        <div style={{
          padding: '6px 20px', display: 'flex', alignItems: 'center', gap: '12px',
          background: 'rgba(155,89,182,0.04)', borderBottom: '1px solid rgba(155,89,182,0.1)',
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '9px', fontWeight: 700, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>Slots</span>
          {spellSlots.filter(s => s.max_slots > 0).map(s => {
            const remaining = s.max_slots - (s.used_slots || 0);
            return (
              <div key={s.slot_level} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-mute)', fontFamily: 'var(--font-mono)', minWidth: '18px' }}>L{s.slot_level}</span>
                <div style={{ display: 'flex', gap: '3px' }}>
                  {Array.from({ length: s.max_slots }, (_, i) => (
                    <button key={i} onClick={() => { if (i < remaining) handleUseSpellSlot(s.slot_level); }}
                      style={{
                        width: '10px', height: '10px', borderRadius: '50%', padding: 0,
                        background: i < remaining ? '#c084fc' : 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(155,89,182,0.3)',
                        cursor: i < remaining ? 'pointer' : 'default',
                        transition: 'all 0.15s',
                      }}
                      title={i < remaining ? `Use level ${s.slot_level} slot` : 'Used'}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

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
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
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
          <PlayerEventFeed events={eventFeed} maxEvents={200} />

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

        {/* Right: Handouts + Info + Actions + Chat */}
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
                  {showCampaignWorld ? '▲' : '▼'}
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
      </div>

      {/* Skill Check Prompt Overlay */}
      {skillCheckPrompt && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
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
    </div>
  );
}
