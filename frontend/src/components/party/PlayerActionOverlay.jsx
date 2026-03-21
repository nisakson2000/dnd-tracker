import { memo, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Swords, Dice5, Check, X, Send, Coins, Users, Shield, Heart, ChevronRight, AlertTriangle, Skull, Zap, Clock, Book } from 'lucide-react';
import toast from 'react-hot-toast';
import { invoke } from '@tauri-apps/api/core';
import ModalPortal from '../ModalPortal';
import { useCampaignSync } from '../../contexts/CampaignSyncContext';
import { useParty } from '../../contexts/PartyContext';
import { parseAndRollExpression } from '../../utils/dice';
import { computeConditionEffects } from '../../data/conditionEffects';
import { getOverview } from '../../api/overview';
import PlayerCombatHUD from './PlayerCombatHUD';
import ErrorBoundary from '../ErrorBoundary';
import { loadJournal } from '../../utils/playerJournal';

// Keyframes injected once
const STYLE_ID = 'player-action-overlay-styles';
function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes pao-fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes pao-slideUp { from { opacity: 0; transform: translateY(40px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
    @keyframes pao-pulseGold { 0%,100% { box-shadow: 0 0 20px rgba(201,168,76,0.15); } 50% { box-shadow: 0 0 40px rgba(201,168,76,0.35); } }
    @keyframes pao-rollSpin { 0% { transform: rotate(0deg) scale(1); } 50% { transform: rotate(180deg) scale(1.2); } 100% { transform: rotate(360deg) scale(1); } }
    @keyframes pao-resultPop { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.15); } 100% { transform: scale(1); opacity: 1; } }
    @keyframes pao-turnPulse { 0%,100% { text-shadow: 0 0 10px rgba(201,168,76,0.3); } 50% { text-shadow: 0 0 30px rgba(201,168,76,0.7); } }
  `;
  document.head.appendChild(style);
}

const GOLD = '#c9a84c';
const GOLD_DIM = 'rgba(201,168,76,0.5)';
const BG_DARK = 'rgba(10,8,16,0.92)';

// Shared button style factory
const actionBtn = (color, bg) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
  padding: '16px 40px', borderRadius: 14,
  background: bg, border: `2px solid ${color}`,
  color, fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-heading)',
  cursor: 'pointer', transition: 'all 0.2s', animation: 'pao-pulseGold 2s ease-in-out infinite',
});

export default memo(function PlayerActionOverlay({ activeConditions = [], characterId }) {
  const { activePrompts, respondToPrompt, combatActive, initiativeOrder, currentTurn, round, isMyTurn, sendEvent, pendingDeathSavePrompt, clearDeathSavePrompt, pendingReaction, clearReaction } = useCampaignSync();
  const { onPartyEvent, myClientId, members } = useParty();

  // Compute condition effects from active conditions
  const condEffects = useMemo(() => computeConditionEffects(activeConditions), [activeConditions]);

  const [actionQueue, setActionQueue] = useState([]); // non-prompt actions: combat_start, loot_drop, social_encounter, group_check
  const [rollResult, setRollResult] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [freeText, setFreeText] = useState('');
  const [resultView, setResultView] = useState(null); // { pass, text }
  const [showTurnBanner, setShowTurnBanner] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [journalTab, setJournalTab] = useState('quests');
  const resultTimerRef = useRef(null);
  const prevIsMyTurnRef = useRef(false);

  // Death Save state
  const [deathSaveRolling, setDeathSaveRolling] = useState(false);
  const [deathSaveResult, setDeathSaveResult] = useState(null);
  const deathSaveTimerRef = useRef(null);

  // Reaction state
  const [reactionCountdown, setReactionCountdown] = useState(0);
  const [reactionRolling, setReactionRolling] = useState(false);
  const [reactionRollResult, setReactionRollResult] = useState(null);
  const reactionTimerRef = useRef(null);
  const reactionIntervalRef = useRef(null);

  // ── Character data for name + modifier calculations ──
  const [playerName, setPlayerName] = useState('Player');
  const [characterData, setCharacterData] = useState(null);

  useEffect(() => {
    if (!characterId) return;
    getOverview(characterId).then(data => {
      if (data?.overview?.name) setPlayerName(data.overview.name);
      if (data) {
        // Build a lookup-friendly structure
        const abilityScores = {};
        (data.ability_scores || []).forEach(a => {
          abilityScores[a.ability.toLowerCase()] = a.score;
          // Also map short form
          const shortMap = { strength: 'str', dexterity: 'dex', constitution: 'con', intelligence: 'int', wisdom: 'wis', charisma: 'cha' };
          abilityScores[a.ability.toUpperCase()] = a.score;
        });
        const level = data.overview?.level || 1;
        const profBonus = Math.floor((level - 1) / 4) + 2;
        setCharacterData({
          ability_scores: abilityScores,
          skills: data.skills || [],
          saving_throws: data.saving_throws || [],
          proficiency_bonus: profBonus,
        });
      }
    }).catch(() => {});
  }, [characterId]);

  const calcModifier = useCallback((prompt) => {
    if (!characterData || !prompt?.ability) return 0;
    const abilityKey = prompt.ability.toUpperCase();
    const score = characterData.ability_scores?.[abilityKey] || 10;
    const mod = Math.floor((score - 10) / 2);
    let prof = 0;
    const profBonus = characterData.proficiency_bonus || 2;
    // Check skill proficiency
    if (prompt.skill && characterData.skills) {
      const skill = characterData.skills.find(s => s.name?.toLowerCase() === prompt.skill?.toLowerCase());
      if (skill?.proficient) prof = profBonus;
      if (skill?.expertise) prof = profBonus * 2;
    }
    // Check saving throw proficiency
    if (prompt.roll_type === 'Saving Throw' && characterData.saving_throws) {
      const save = characterData.saving_throws.find(s => s.ability?.toUpperCase() === abilityKey);
      if (save?.proficient) prof = profBonus;
    }
    return mod + prof;
  }, [characterData]);

  useEffect(() => { ensureStyles(); }, []);

  // Phase 2F: Turn notification — audio + title flash + banner
  useEffect(() => {
    if (isMyTurn && !prevIsMyTurnRef.current) {
      // Just became my turn
      setShowTurnBanner(true);

      // Play audio notification
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.15); // G5 note
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
      } catch (e) { /* audio not available */ }

      // Flash window title
      const originalTitle = document.title;
      let flash = true;
      const titleInterval = setInterval(() => {
        document.title = flash ? '\u2694\uFE0F YOUR TURN \u2014 The Codex' : originalTitle;
        flash = !flash;
      }, 800);

      // Stop flashing after 5 seconds
      const stopFlash = setTimeout(() => {
        clearInterval(titleInterval);
        document.title = originalTitle;
      }, 5000);

      // Vibrate if available
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }

      // Auto-hide banner after 3 seconds
      const hideBanner = setTimeout(() => setShowTurnBanner(false), 3000);

      return () => {
        clearInterval(titleInterval);
        clearTimeout(stopFlash);
        clearTimeout(hideBanner);
        document.title = originalTitle;
      };
    } else if (!isMyTurn) {
      setShowTurnBanner(false);
    }
    prevIsMyTurnRef.current = isMyTurn;
  }, [isMyTurn]);

  // Listen for event-based actions
  useEffect(() => {
    const unsubs = [];
    const pushAction = (type, data) => {
      setActionQueue(prev => [...prev, { id: `act_${Date.now()}_${Math.random()}`, type, ...data }]);
    };
    unsubs.push(onPartyEvent('combat_start', (msg) => pushAction('combat_start', msg.data || {})));
    unsubs.push(onPartyEvent('loot_drop', (msg) => pushAction('loot_drop', msg.data || {})));
    unsubs.push(onPartyEvent('social_encounter', (msg) => pushAction('social_encounter', msg.data || {})));
    unsubs.push(onPartyEvent('group_check', (msg) => pushAction('group_check', msg.data || {})));
    unsubs.push(onPartyEvent('dismiss_action', (msg) => {
      const dismissId = msg.data?.action_id;
      if (dismissId) setActionQueue(prev => prev.filter(a => a.id !== dismissId));
      else setActionQueue([]);
    }));
    return () => unsubs.forEach(fn => fn());
  }, [onPartyEvent]);

  // Cleanup timers
  useEffect(() => () => { if (resultTimerRef.current) clearTimeout(resultTimerRef.current); }, []);

  // Current prompt (from DM prompt system)
  const prompt = activePrompts.length > 0 ? activePrompts[0] : null;
  // Current event-based action
  const action = actionQueue.length > 0 ? actionQueue[0] : null;

  // Determine what to show: prompts take priority, then event actions, then combat HUD
  const hasOverlay = prompt || action;

  const dismissAction = useCallback(() => {
    setActionQueue(prev => prev.slice(1));
    setRollResult(null);
    setRolling(false);
    setResultView(null);
    setFreeText('');
  }, []);

  const sendActionResponse = useCallback((actionId, type, data) => {
    sendEvent('action_response', { action_id: actionId, type, ...data });
  }, [sendEvent]);

  // Determine roll mode based on prompt type and condition effects
  const getPromptRollMode = useCallback((p) => {
    if (!p) return 'normal';
    const ability = (p.ability || '').toUpperCase();

    // Saving throws
    if (p.roll_type === 'save') {
      if (condEffects.autoFailSaves.has(ability)) return 'auto_fail';
      if (condEffects.saveDisadvantage.has(ability)) return 'disadvantage';
      return 'normal';
    }
    // Ability checks and skill checks
    if (p.roll_type === 'ability' || p.roll_type === 'skill') {
      if (condEffects.cantAct) return 'cant_act';
      if (condEffects.checkDisadvantage) return 'disadvantage';
      return 'normal';
    }
    // Attack rolls
    if (p.roll_type === 'attack') {
      if (condEffects.cantAct) return 'cant_act';
      if (condEffects.netAttackMode === 'disadvantage') return 'disadvantage';
      if (condEffects.netAttackMode === 'advantage') return 'advantage';
      return 'normal';
    }
    return 'normal';
  }, [condEffects]);

  // --- Prompt handlers (replaces PlayerPromptPopup) ---
  const handlePromptRoll = useCallback(() => {
    if (!prompt) return;
    const rollMode = getPromptRollMode(prompt);

    // Auto-fail: don't roll, respond immediately with 0
    if (rollMode === 'auto_fail' || rollMode === 'cant_act') {
      setRolling(true);
      const failResult = { groups: [], modifier: 0, total: 0, breakdownParts: ['Auto-fail'] };
      setRollResult(failResult);
      setTimeout(() => {
        respondToPrompt(prompt.prompt_id, {
          name: playerName, roll_total: 0,
          breakdown: rollMode === 'auto_fail' ? 'Auto-fail (condition effect)' : "Can't act (incapacitated)",
          roll_raw: 0, auto_fail: true,
          pass: prompt.dc ? false : undefined,
        });
        if (prompt.show_dc && prompt.dc) {
          setResultView({ pass: false, text: prompt.fail_text || 'Auto-Failed due to condition.' });
          resultTimerRef.current = setTimeout(() => { setResultView(null); setRollResult(null); setRolling(false); }, 4000);
        } else {
          setRollResult(null);
          setRolling(false);
        }
      }, 900);
      return;
    }

    setRolling(true);
    const modifier = calcModifier(prompt);

    let result;
    if (rollMode === 'disadvantage') {
      // Roll 2d20, take lower, then add modifier
      const roll1 = parseAndRollExpression('1d20');
      const roll2 = parseAndRollExpression('1d20');
      const r1 = roll1.groups[0].rolls[0];
      const r2 = roll2.groups[0].rolls[0];
      const kept = Math.min(r1, r2);
      const total = kept + modifier;
      result = {
        groups: [{ count: 2, sides: 20, keepMode: 'l', keepCount: 1, rolls: [r1, r2], kept: [kept], subtotal: kept, sign: 1, expr: '2d20kl1' }],
        modifier, total,
        breakdownParts: [`[${r1 === kept ? `**${r1}**` : `~~${r1}~~`}, ${r2 === kept ? `**${r2}**` : `~~${r2}~~`}]`, modifier ? `+ ${modifier}` : ''].filter(Boolean),
        _rollMode: 'disadvantage',
      };
    } else if (rollMode === 'advantage') {
      // Roll 2d20, take higher, then add modifier
      const roll1 = parseAndRollExpression('1d20');
      const roll2 = parseAndRollExpression('1d20');
      const r1 = roll1.groups[0].rolls[0];
      const r2 = roll2.groups[0].rolls[0];
      const kept = Math.max(r1, r2);
      const total = kept + modifier;
      result = {
        groups: [{ count: 2, sides: 20, keepMode: 'h', keepCount: 1, rolls: [r1, r2], kept: [kept], subtotal: kept, sign: 1, expr: '2d20kh1' }],
        modifier, total,
        breakdownParts: [`[${r1 === kept ? `**${r1}**` : `~~${r1}~~`}, ${r2 === kept ? `**${r2}**` : `~~${r2}~~`}]`, modifier ? `+ ${modifier}` : ''].filter(Boolean),
        _rollMode: 'advantage',
      };
    } else {
      result = parseAndRollExpression(`1d20+${modifier}`);
    }

    if (result) {
      setRollResult(result);
      const dc = prompt.dc;
      const passed = dc ? result.total >= dc : null;
      setTimeout(() => {
        const d20Raw = result.groups?.[0]?.kept?.[0] || result.groups?.[0]?.rolls?.[0] || result.total;
        respondToPrompt(prompt.prompt_id, {
          name: playerName, roll_total: result.total,
          breakdown: `${result._rollMode ? `(${result._rollMode}) ` : ''}d20(${d20Raw})${modifier ? ` + ${modifier}` : ''}`,
          modifier,
          roll_raw: d20Raw,
          roll_mode: result._rollMode || 'normal',
          pass: prompt.dc ? result.total >= prompt.dc : undefined,
        });
        if (prompt.show_dc && dc) {
          setResultView({ pass: passed, text: passed ? (prompt.success_text || 'Success!') : (prompt.fail_text || 'Failed.') });
          resultTimerRef.current = setTimeout(() => { setResultView(null); setRollResult(null); setRolling(false); }, 4000);
        } else {
          setRollResult(null);
          setRolling(false);
        }
      }, 900);
    }
  }, [prompt, respondToPrompt, getPromptRollMode, playerName, calcModifier]);

  const handleChoice = useCallback((option) => {
    if (!prompt) return;
    respondToPrompt(prompt.prompt_id, { name: playerName, choice: option });
  }, [prompt, respondToPrompt, playerName]);

  const handleConfirm = useCallback((accepted) => {
    if (!prompt) return;
    respondToPrompt(prompt.prompt_id, { name: playerName, accepted });
  }, [prompt, respondToPrompt, playerName]);

  const handleFreeTextSubmit = useCallback(() => {
    if (!prompt || !freeText.trim()) return;
    respondToPrompt(prompt.prompt_id, { name: playerName, text: freeText.trim() });
    setFreeText('');
  }, [prompt, freeText, respondToPrompt, playerName]);

  // --- Event action handlers ---
  const handleInitiativeRoll = useCallback(() => {
    if (!action) return;
    setRolling(true);
    const dexMod = action.dex_modifier || 0;
    const result = parseAndRollExpression(`1d20+${dexMod}`);
    if (result) {
      setRollResult(result);
      setTimeout(() => {
        sendActionResponse(action.id, 'initiative_roll', {
          roll_total: result.total, name: playerName, client_id: myClientId,
        });
        setRolling(false);
      }, 900);
    }
  }, [action, myClientId, sendActionResponse, playerName]);

  const handleLootClaim = useCallback((itemIndex) => {
    if (!action) return;
    sendActionResponse(action.id, 'loot_claim', { item_index: itemIndex, name: playerName, client_id: myClientId });
  }, [action, myClientId, sendActionResponse, playerName]);

  const handleLootDismiss = useCallback(async () => {
    if (!action) { dismissAction(); return; }
    try {
      // Persist items to inventory
      if (characterId && action.items && action.items.length > 0) {
        for (const item of action.items) {
          await invoke('add_item', {
            characterId,
            payload: {
              name: item.name || 'Unknown Item',
              item_type: item.type || item.item_type || 'gear',
              weight: item.weight ?? 0,
              value_gp: item.value_gp ?? 0,
              quantity: item.quantity ?? 1,
              description: item.description || '',
              attunement: item.attunement || false,
              attuned: false,
              equipped: false,
              equipment_slot: item.equipment_slot || '',
              rarity: item.rarity || 'common',
            },
          }).catch(e => console.error('Failed to add item:', e));
        }
      }
      // Persist gold to currency
      if (characterId && action.gold && action.gold > 0) {
        try {
          const currency = await invoke('get_currency', { characterId });
          const updatedGp = (currency?.gp || 0) + action.gold;
          await invoke('update_currency', { characterId, payload: { ...currency, gp: updatedGp } });
        } catch (e) {
          console.error('Failed to update currency:', e);
        }
      }
      const parts = [];
      if (action.items?.length) parts.push(`${action.items.length} item(s)`);
      if (action.gold) parts.push(`+${action.gold} GP`);
      if (parts.length > 0) {
        toast(`Loot claimed! ${parts.join(', ')}`, {
          icon: '\uD83D\uDCB0', duration: 3000,
          style: { background: '#1a1a10', color: '#fde68a', border: '1px solid rgba(201,168,76,0.3)' },
        });
      }
    } catch (e) {
      console.error('Failed to claim loot:', e);
    }
    dismissAction();
  }, [action, characterId, dismissAction]);

  const handleSocialChoice = useCallback((choice) => {
    if (!action) return;
    sendActionResponse(action.id, 'social_choice', { choice, name: playerName, client_id: myClientId });
    dismissAction();
  }, [action, myClientId, sendActionResponse, dismissAction, playerName]);

  const handleGroupCheckRoll = useCallback(() => {
    if (!action) return;
    setRolling(true);
    const modifier = calcModifier(action);
    const result = parseAndRollExpression(`1d20+${modifier}`);
    if (result) {
      setRollResult(result);
      const dc = action.dc;
      const passed = dc ? result.total >= dc : null;
      const d20Raw = result.groups?.[0]?.rolls?.[0] || result.total;
      setTimeout(() => {
        sendActionResponse(action.id, 'group_check_roll', {
          roll_total: result.total, name: playerName, client_id: myClientId, passed,
          modifier, breakdown: `d20(${d20Raw})${modifier ? ` + ${modifier}` : ''}`,
          pass: passed !== null ? passed : undefined,
        });
        if (action.show_dc && dc) {
          setResultView({ pass: passed, text: passed ? (action.success_text || 'Success!') : (action.fail_text || 'Failed.') });
          resultTimerRef.current = setTimeout(() => { dismissAction(); }, 4000);
        } else {
          setRolling(false);
          setTimeout(() => dismissAction(), 1500);
        }
      }, 900);
    }
  }, [action, myClientId, sendActionResponse, dismissAction, playerName, calcModifier]);

  // ─── DEATH SAVE HANDLER ─────────────────────────────────────────────
  const handleDeathSaveRoll = useCallback(() => {
    if (!pendingDeathSavePrompt) return;
    setDeathSaveRolling(true);
    const result = parseAndRollExpression('1d20');
    if (result) {
      const roll = result.groups?.[0]?.rolls?.[0] || result.total;
      setTimeout(() => {
        setDeathSaveResult({ roll, total: roll });
        const nat20 = roll === 20;
        const nat1 = roll === 1;
        const success = roll >= 10;
        sendEvent('death_save_result', { roll, nat20, nat1: nat1, success });
        deathSaveTimerRef.current = setTimeout(() => {
          clearDeathSavePrompt();
          setDeathSaveRolling(false);
          setDeathSaveResult(null);
        }, 4000);
      }, 900);
    }
  }, [pendingDeathSavePrompt, sendEvent, clearDeathSavePrompt]);

  // Cleanup death save timer
  useEffect(() => () => { if (deathSaveTimerRef.current) clearTimeout(deathSaveTimerRef.current); }, []);

  // ─── REACTION HANDLERS ────────────────────────────────────────────────
  // Start countdown when a reaction prompt arrives
  useEffect(() => {
    if (pendingReaction) {
      setReactionCountdown(5);
      setReactionRolling(false);
      setReactionRollResult(null);
      reactionIntervalRef.current = setInterval(() => {
        setReactionCountdown(prev => {
          if (prev <= 1) {
            // Auto-pass on expiry
            clearInterval(reactionIntervalRef.current);
            sendEvent('reaction_response', { accepted: false, type: pendingReaction.type });
            clearReaction();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => {
        if (reactionIntervalRef.current) clearInterval(reactionIntervalRef.current);
      };
    }
  }, [pendingReaction, sendEvent, clearReaction]);

  const handleReactionAccept = useCallback(() => {
    if (!pendingReaction) return;
    if (reactionIntervalRef.current) clearInterval(reactionIntervalRef.current);

    const type = pendingReaction.type;
    if (type === 'opportunity_attack') {
      // Quick attack roll
      setReactionRolling(true);
      const result = parseAndRollExpression('1d20');
      if (result) {
        const roll = result.groups?.[0]?.rolls?.[0] || result.total;
        setTimeout(() => {
          setReactionRollResult({ roll, total: roll });
          sendEvent('reaction_response', { accepted: true, type, roll });
          reactionTimerRef.current = setTimeout(() => {
            clearReaction();
            setReactionRolling(false);
            setReactionRollResult(null);
          }, 2500);
        }, 900);
      }
    } else {
      // Spell reactions (counterspell, shield, custom) — just confirm
      sendEvent('reaction_response', { accepted: true, type });
      clearReaction();
    }
  }, [pendingReaction, sendEvent, clearReaction]);

  const handleReactionPass = useCallback(() => {
    if (!pendingReaction) return;
    if (reactionIntervalRef.current) clearInterval(reactionIntervalRef.current);
    sendEvent('reaction_response', { accepted: false, type: pendingReaction.type });
    clearReaction();
  }, [pendingReaction, sendEvent, clearReaction]);

  // Cleanup reaction timer
  useEffect(() => () => { if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current); }, []);

  if (!hasOverlay && !combatActive && !pendingDeathSavePrompt && !pendingReaction) {
    return (
      <>
        <JournalButton characterId={characterId} showJournal={showJournal} setShowJournal={setShowJournal} />
        <JournalPanel characterId={characterId} showJournal={showJournal} setShowJournal={setShowJournal} journalTab={journalTab} setJournalTab={setJournalTab} />
      </>
    );
  }

  // --- Death Save Overlay (takes priority over everything) ---
  if (pendingDeathSavePrompt) {
    return (
      <ModalPortal>
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10001,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(5,0,0,0.95)', backdropFilter: 'blur(16px)',
          animation: 'pao-fadeIn 0.3s ease-out',
        }}>
          <div style={{
            maxWidth: 440, width: '90vw', textAlign: 'center',
            padding: '40px 32px', animation: 'pao-slideUp 0.5s ease-out',
          }}>
            <Skull size={56} style={{ color: '#ef4444', marginBottom: 20, filter: 'drop-shadow(0 0 20px rgba(239,68,68,0.5))' }} />
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700,
              color: '#fca5a5', letterSpacing: '0.12em', marginBottom: 8,
              textShadow: '0 0 30px rgba(239,68,68,0.4)',
            }}>
              DEATH SAVE
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 8 }}>
              Roll a d20 — no modifiers. DC 10 to survive.
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginBottom: 28 }}>
              Nat 20 = stabilize + 1 HP &bull; Nat 1 = 2 failures
            </div>

            {deathSaveResult ? (
              <div style={{ animation: 'pao-resultPop 0.4s ease-out' }}>
                <div style={{
                  fontSize: 64, fontWeight: 700, fontFamily: 'var(--font-heading)', lineHeight: 1.1,
                  color: deathSaveResult.roll === 20 ? '#4ade80'
                    : deathSaveResult.roll === 1 ? '#ef4444'
                    : deathSaveResult.roll >= 10 ? '#fde68a' : '#ef4444',
                }}>
                  {deathSaveResult.roll}
                </div>
                <div style={{
                  fontSize: 18, fontWeight: 700, marginTop: 10,
                  fontFamily: 'var(--font-heading)', letterSpacing: '0.08em',
                  color: deathSaveResult.roll === 20 ? '#4ade80'
                    : deathSaveResult.roll === 1 ? '#ef4444'
                    : deathSaveResult.roll >= 10 ? '#fde68a' : '#fca5a5',
                }}>
                  {deathSaveResult.roll === 20 ? 'MIRACULOUS RECOVERY! Stabilized + 1 HP!'
                    : deathSaveResult.roll === 1 ? 'CRITICAL FAILURE — 2 Death Failures!'
                    : deathSaveResult.roll >= 10 ? 'Success — You cling to life.'
                    : 'Failure — The void beckons...'}
                </div>
              </div>
            ) : (
              <button onClick={handleDeathSaveRoll} disabled={deathSaveRolling} style={{
                ...actionBtn('#ef4444', 'rgba(239,68,68,0.12)'),
                animation: deathSaveRolling ? 'none' : 'pao-pulseGold 2s ease-in-out infinite',
                boxShadow: '0 0 30px rgba(239,68,68,0.2)',
              }}>
                <Dice5 size={24} style={deathSaveRolling ? { animation: 'pao-rollSpin 0.6s ease-in-out infinite' } : {}} />
                {deathSaveRolling ? 'Rolling...' : 'Roll Death Save'}
              </button>
            )}
          </div>
        </div>
      </ModalPortal>
    );
  }

  // --- Reaction Prompt Overlay ---
  if (pendingReaction) {
    const reactionLabels = {
      opportunity_attack: 'Opportunity Attack',
      counterspell: 'Counterspell',
      shield: 'Shield',
      custom: pendingReaction.label || 'Reaction',
    };
    const reactionLabel = reactionLabels[pendingReaction.type] || pendingReaction.type || 'Reaction';
    const reactionColor = pendingReaction.type === 'opportunity_attack' ? '#fca5a5'
      : pendingReaction.type === 'counterspell' ? '#c4b5fd'
      : pendingReaction.type === 'shield' ? '#93c5fd' : '#fde68a';

    return (
      <ModalPortal>
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10001,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(5,0,15,0.92)', backdropFilter: 'blur(14px)',
          animation: 'pao-fadeIn 0.2s ease-out',
        }}>
          <div style={{
            maxWidth: 440, width: '90vw', textAlign: 'center',
            padding: '36px 28px', animation: 'pao-slideUp 0.35s ease-out',
          }}>
            <Zap size={44} style={{ color: reactionColor, marginBottom: 16, filter: `drop-shadow(0 0 12px ${reactionColor}40)` }} />
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700,
              color: reactionColor, letterSpacing: '0.1em', marginBottom: 6,
            }}>
              {reactionLabel}
            </div>
            {pendingReaction.description && (
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 16, lineHeight: 1.5 }}>
                {pendingReaction.description}
              </div>
            )}

            {/* Countdown timer */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              marginBottom: 24,
            }}>
              <Clock size={14} style={{ color: reactionCountdown <= 2 ? '#ef4444' : 'rgba(255,255,255,0.4)' }} />
              <span style={{
                fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-heading)',
                color: reactionCountdown <= 2 ? '#ef4444' : 'rgba(255,255,255,0.5)',
              }}>
                {reactionCountdown}s
              </span>
            </div>

            {reactionRollResult ? (
              <div style={{ animation: 'pao-resultPop 0.4s ease-out' }}>
                <div style={{
                  fontSize: 52, fontWeight: 700, fontFamily: 'var(--font-heading)',
                  color: reactionRollResult.roll >= 15 ? '#4ade80' : reactionRollResult.roll >= 10 ? '#fde68a' : '#fca5a5',
                }}>
                  {reactionRollResult.roll}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>Attack Roll</div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                <button onClick={handleReactionAccept} disabled={reactionRolling} style={{
                  ...actionBtn(reactionColor, `${reactionColor}18`),
                  animation: 'pao-pulseGold 1.5s ease-in-out infinite',
                }}>
                  <Zap size={20} />
                  {reactionRolling ? 'Rolling...' : 'React'}
                </button>
                <button onClick={handleReactionPass} style={{
                  ...actionBtn('rgba(255,255,255,0.4)', 'rgba(255,255,255,0.04)'),
                  animation: 'none',
                }}>
                  <X size={20} /> Pass
                </button>
              </div>
            )}
          </div>
        </div>
      </ModalPortal>
    );
  }

  // --- Compact combat HUD (when no overlay is active but combat is running) ---
  if (!hasOverlay && combatActive) {
    return (
      <>
        {/* YOUR TURN banner */}
        {showTurnBanner && isMyTurn && (
          <ModalPortal>
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10000,
              background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.05))',
              borderBottom: '2px solid rgba(201,168,76,0.4)',
              padding: '12px 20px',
              textAlign: 'center',
              animation: 'pao-fadeIn 0.3s ease',
              backdropFilter: 'blur(10px)',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                fontWeight: 700,
                color: '#fde68a',
                textShadow: '0 0 20px rgba(201,168,76,0.5)',
                animation: 'pao-turnPulse 1.5s ease-in-out infinite',
                letterSpacing: '0.15em',
              }}>
                ⚔️ YOUR TURN ⚔️
              </div>
            </div>
          </ModalPortal>
        )}
        <CombatHUD initiativeOrder={initiativeOrder} currentTurn={currentTurn} round={round} isMyTurn={isMyTurn} />
        {/* PlayerCombatHUD — full combat action panel when it's my turn */}
        {combatActive && isMyTurn && (
          <ErrorBoundary label="Combat HUD">
            <PlayerCombatHUD characterId={characterId} />
          </ErrorBoundary>
        )}
        <JournalButton characterId={characterId} showJournal={showJournal} setShowJournal={setShowJournal} />
        <JournalPanel characterId={characterId} showJournal={showJournal} setShowJournal={setShowJournal} journalTab={journalTab} setJournalTab={setJournalTab} />
      </>
    );
  }

  return (
    <ModalPortal>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: BG_DARK, backdropFilter: 'blur(12px)',
        animation: 'pao-fadeIn 0.3s ease-out',
      }}>
        <div style={{
          maxWidth: 520, width: '92vw', maxHeight: '90vh', overflowY: 'auto',
          animation: 'pao-slideUp 0.4s ease-out',
          textAlign: 'center', padding: '32px 28px',
        }}>
          {/* Prompt-based views */}
          {prompt && !action && <PromptView
            prompt={prompt} rollResult={rollResult} rolling={rolling} resultView={resultView}
            freeText={freeText} setFreeText={setFreeText}
            onRoll={handlePromptRoll} onChoice={handleChoice} onConfirm={handleConfirm}
            onFreeTextSubmit={handleFreeTextSubmit}
            condEffects={condEffects} activeConditions={activeConditions}
            calculatedModifier={calcModifier(prompt)}
          />}

          {/* Event-based views */}
          {action && action.type === 'combat_start' && <CombatStartView
            action={action} rollResult={rollResult} rolling={rolling}
            onRoll={handleInitiativeRoll} initiativeOrder={initiativeOrder} combatActive={combatActive}
            onDismiss={dismissAction}
          />}
          {action && action.type === 'loot_drop' && <LootView action={action} onClaim={handleLootClaim} onDismiss={handleLootDismiss} />}
          {action && action.type === 'social_encounter' && <SocialView action={action} onChoice={handleSocialChoice} onDismiss={dismissAction}
            rollResult={rollResult} rolling={rolling} onRoll={handleGroupCheckRoll} />}
          {action && action.type === 'group_check' && <GroupCheckView
            action={action} rollResult={rollResult} rolling={rolling} resultView={resultView}
            onRoll={handleGroupCheckRoll}
          />}
        </div>
      </div>
      <JournalButton characterId={characterId} showJournal={showJournal} setShowJournal={setShowJournal} />
      <JournalPanel characterId={characterId} showJournal={showJournal} setShowJournal={setShowJournal} journalTab={journalTab} setJournalTab={setJournalTab} />
    </ModalPortal>
  );
})

// ─── JOURNAL COMPONENTS ──────────────────────────────────────────────────
function JournalButton({ characterId, showJournal, setShowJournal }) {
  if (!characterId) return null;
  // Only show in Party Connect mode (DM pushes journal data)
  try { const s = JSON.parse(localStorage.getItem('codex-v3-settings') || '{}'); if (s.sessionStyle !== 'connected') return null; } catch {}
  return (
    <button onClick={() => setShowJournal(!showJournal)} style={{
      position: 'fixed', bottom: 20, right: 80, zIndex: 9999,
      width: 44, height: 44, borderRadius: '50%',
      background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)',
      color: '#c9a84c', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Book size={20} />
    </button>
  );
}

function JournalPanel({ characterId, showJournal, setShowJournal, journalTab, setJournalTab }) {
  if (!showJournal || !characterId) return null;
  return (
    <ModalPortal>
      <div style={{ position: 'fixed', bottom: 70, right: 20, width: 340, maxHeight: 500, zIndex: 9999,
        background: 'rgba(10,8,16,0.95)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12,
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
        {/* Tab header */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {['quests', 'npcs'].map(tab => (
            <button key={tab} onClick={() => setJournalTab(tab)} style={{
              flex: 1, padding: '10px 0', background: journalTab === tab ? 'rgba(201,168,76,0.1)' : 'transparent',
              border: 'none', borderBottom: journalTab === tab ? '2px solid #c9a84c' : '2px solid transparent',
              color: journalTab === tab ? '#c9a84c' : 'rgba(255,255,255,0.4)',
              fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1,
            }}>
              {tab === 'quests' ? 'Quest Log' : 'Known NPCs'}
            </button>
          ))}
          <button onClick={() => setShowJournal(false)} style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '8px',
          }}>
            <X size={14} />
          </button>
        </div>
        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
          <JournalContent characterId={characterId} tab={journalTab} />
        </div>
      </div>
    </ModalPortal>
  );
}

function JournalContent({ characterId, tab }) {
  const journal = loadJournal(characterId);
  if (tab === 'quests') {
    if (journal.quests.length === 0) return <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, textAlign: 'center', padding: 20 }}>No quests discovered yet</div>;
    return journal.quests.map((q, i) => (
      <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#e8d9b5' }}>{q.title}</span>
          <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4,
            background: q.status === 'completed' ? 'rgba(74,222,128,0.15)' : 'rgba(201,168,76,0.15)',
            color: q.status === 'completed' ? '#4ade80' : '#c9a84c',
          }}>{q.status || 'active'}</span>
        </div>
        {q.description && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{q.description}</div>}
      </div>
    ));
  }
  if (tab === 'npcs') {
    if (journal.npcs.length === 0) return <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, textAlign: 'center', padding: 20 }}>No NPCs discovered yet</div>;
    return journal.npcs.map((n, i) => (
      <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#e8d9b5' }}>{n.name}</span>
        {n.description && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{n.description}</div>}
      </div>
    ));
  }
  return null;
}

// ─── CONDITION WARNING BANNER ─────────────────────────────────────────────
function ConditionWarnings({ prompt, condEffects, activeConditions }) {
  if (!prompt || !condEffects || !activeConditions || activeConditions.length === 0) return null;
  if (prompt.prompt_type !== 'roll_check' && prompt.prompt_type !== 'group_check') return null;

  const ability = (prompt.ability || '').toUpperCase();
  const warnings = [];

  // Can't act (Incapacitated, Stunned, Paralyzed, etc.)
  if (condEffects.cantAct) {
    const cantActConditions = activeConditions.filter(c => {
      const effects = { Incapacitated: true, Paralyzed: true, Petrified: true, Stunned: true, Unconscious: true };
      return effects[c];
    });
    warnings.push({ type: 'error', text: `You cannot act due to: ${cantActConditions.join(', ')}` });
  }

  // Saving throw auto-fail
  if (prompt.roll_type === 'save' && ability && condEffects.autoFailSaves.has(ability)) {
    warnings.push({ type: 'error', text: `AUTO-FAIL: You auto-fail ${ability} saves due to your conditions` });
  }

  // Saving throw disadvantage
  if (prompt.roll_type === 'save' && ability && condEffects.saveDisadvantage.has(ability)) {
    warnings.push({ type: 'warning', text: `Rolling with Disadvantage on ${ability} save` });
  }

  // Ability check / skill check disadvantage
  if ((prompt.roll_type === 'ability' || prompt.roll_type === 'skill') && condEffects.checkDisadvantage) {
    warnings.push({ type: 'warning', text: 'Rolling with Disadvantage on ability checks' });
  }

  // Attack roll mode
  if (prompt.roll_type === 'attack') {
    if (condEffects.netAttackMode === 'disadvantage') {
      warnings.push({ type: 'warning', text: 'Rolling with Disadvantage on attack rolls' });
    } else if (condEffects.netAttackMode === 'advantage') {
      warnings.push({ type: 'info', text: 'Rolling with Advantage on attack rolls' });
    }
  }

  // List active condition summaries
  const condSummaries = condEffects.activeEffects
    .filter(e => e.summary)
    .map(e => ({ name: e.name, summary: e.summary }));

  if (warnings.length === 0 && condSummaries.length === 0) return null;

  return (
    <div style={{ marginBottom: 16 }}>
      {warnings.map((w, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
          borderRadius: 10, marginBottom: 6,
          background: w.type === 'error' ? 'rgba(239,68,68,0.1)' : w.type === 'info' ? 'rgba(96,165,250,0.1)' : 'rgba(251,191,36,0.1)',
          border: `1px solid ${w.type === 'error' ? 'rgba(239,68,68,0.3)' : w.type === 'info' ? 'rgba(96,165,250,0.3)' : 'rgba(251,191,36,0.3)'}`,
        }}>
          <AlertTriangle size={14} style={{ color: w.type === 'error' ? '#ef4444' : w.type === 'info' ? '#60a5fa' : '#fbbf24', flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: w.type === 'error' ? '#fca5a5' : w.type === 'info' ? '#93c5fd' : '#fde68a' }}>
            {w.text}
          </span>
        </div>
      ))}
      {condSummaries.length > 0 && (
        <div style={{ marginTop: 4 }}>
          {condSummaries.map((c, i) => (
            <div key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', padding: '2px 0' }}>
              <span style={{ color: 'rgba(251,191,36,0.6)', fontWeight: 600 }}>{c.name}:</span> {c.summary}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PROMPT VIEW (replaces PlayerPromptPopup) ────────────────────────────
function PromptView({ prompt, rollResult, rolling, resultView, freeText, setFreeText, onRoll, onChoice, onConfirm, onFreeTextSubmit, condEffects, activeConditions, calculatedModifier }) {
  return (
    <>
      {prompt.scene_context && (
        <div style={{ fontSize: 12, color: 'rgba(160,120,200,0.5)', fontStyle: 'italic', marginBottom: 12 }}>{prompt.scene_context}</div>
      )}
      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em', color: GOLD_DIM, fontFamily: 'var(--font-heading)', marginBottom: 8 }}>
        The DM requests
      </div>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 26, color: '#e8d9b5', lineHeight: 1.3, marginBottom: 8 }}>
        {prompt.label || prompt.title || prompt.question || 'Action Required'}
      </div>
      {(prompt.body || prompt.description) && (
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 20, lineHeight: 1.6 }}>
          {prompt.body || prompt.description}
        </div>
      )}
      {prompt.show_dc && prompt.dc && (
        <div style={{ fontSize: 14, color: GOLD, fontWeight: 600, marginBottom: 16 }}>DC {prompt.dc}</div>
      )}

      {/* Condition effect warnings */}
      <ConditionWarnings prompt={prompt} condEffects={condEffects} activeConditions={activeConditions} />

      {resultView && <ResultBanner pass={resultView.pass} text={resultView.text} />}

      {/* Roll check */}
      {prompt.prompt_type === 'roll_check' && !resultView && (
        <RollButton result={rollResult} rolling={rolling} onRoll={onRoll} modifier={calculatedModifier}
          rollMode={condEffects?.cantAct ? 'cant_act' : condEffects?.autoFailSaves?.has((prompt.ability || '').toUpperCase()) && prompt.roll_type === 'save' ? 'auto_fail' : null} />
      )}
      {/* Group check via prompt */}
      {prompt.prompt_type === 'group_check' && !resultView && (
        <RollButton result={rollResult} rolling={rolling} onRoll={onRoll} modifier={calculatedModifier} />
      )}
      {/* Choice */}
      {prompt.prompt_type === 'choice' && prompt.options && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {prompt.options.map((opt, i) => (
            <button key={i} onClick={() => onChoice(opt)} style={{
              padding: '14px 20px', borderRadius: 12,
              background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.25)',
              color: '#93c5fd', fontSize: 16, fontWeight: 500, cursor: 'pointer',
              transition: 'all 0.15s', textAlign: 'left', fontFamily: 'var(--font-ui)',
            }}>{opt}</button>
          ))}
        </div>
      )}
      {/* Confirm */}
      {prompt.prompt_type === 'confirm' && (
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button onClick={() => onConfirm(true)} style={actionBtn('#4ade80', 'rgba(74,222,128,0.1)')}>
            <Check size={20} /> Accept
          </button>
          <button onClick={() => onConfirm(false)} style={{ ...actionBtn('#ef4444', 'rgba(239,68,68,0.1)'), animation: 'none' }}>
            <X size={20} /> Decline
          </button>
        </div>
      )}
      {/* Free text */}
      {prompt.prompt_type === 'free_text' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
          <textarea value={freeText} onChange={e => setFreeText(e.target.value)} placeholder="Type your response..."
            rows={3} autoFocus onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onFreeTextSubmit(); } }}
            style={{
              width: '100%', padding: '12px 16px', borderRadius: 12,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#e8d9b5', fontSize: 15, resize: 'vertical', fontFamily: 'var(--font-ui)', outline: 'none',
            }} />
          <button onClick={onFreeTextSubmit} disabled={!freeText.trim()} style={{
            ...actionBtn(freeText.trim() ? GOLD : 'rgba(255,255,255,0.2)', freeText.trim() ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.03)'),
            animation: 'none', alignSelf: 'flex-end', padding: '10px 24px', fontSize: 14,
          }}><Send size={16} /> Submit</button>
        </div>
      )}
    </>
  );
}

// ─── COMBAT START VIEW ───────────────────────────────────────────────────
function CombatStartView({ action, rollResult, rolling, onRoll, initiativeOrder, combatActive, onDismiss }) {
  // Once combat is active and initiative is filled, auto-dismiss after delay
  useEffect(() => {
    if (combatActive && rollResult && initiativeOrder.length > 0) {
      const t = setTimeout(onDismiss, 3000);
      return () => clearTimeout(t);
    }
  }, [combatActive, rollResult, initiativeOrder, onDismiss]);

  return (
    <>
      <Swords size={48} style={{ color: GOLD, marginBottom: 16 }} />
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 32, color: '#fde68a', letterSpacing: '0.08em', marginBottom: 8 }}>
        ROLL FOR INITIATIVE
      </div>
      {action.enemies && action.enemies.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: GOLD_DIM, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>You face</div>
          {action.enemies.map((enemy, i) => (
            <div key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', margin: 4, borderRadius: 8,
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              color: '#fca5a5', fontSize: 14, fontFamily: 'var(--font-ui)',
            }}>
              <Shield size={14} />
              {enemy.count && enemy.count > 1 ? `${enemy.count}x ` : ''}{enemy.name || 'Unknown'}
            </div>
          ))}
        </div>
      )}
      {action.description && (
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 20, lineHeight: 1.6 }}>{action.description}</div>
      )}
      <RollButton result={rollResult} rolling={rolling} onRoll={onRoll} label="Roll Initiative" modifier={action.dex_modifier} />
      {rollResult && initiativeOrder.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 11, color: GOLD_DIM, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Initiative Order</div>
          {initiativeOrder.map((c, i) => (
            <div key={c.client_id || c.name || i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '6px 14px', borderRadius: 8, marginBottom: 4,
              background: i === 0 ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${i === 0 ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)'}`,
            }}>
              <span style={{ color: '#e8d9b5', fontSize: 14 }}>{c.name || '?'}</span>
              <span style={{ color: GOLD, fontSize: 14, fontWeight: 700 }}>{c.initiative ?? '?'}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ─── LOOT VIEW ───────────────────────────────────────────────────────────
function LootView({ action, onClaim, onDismiss }) {
  const [claimed, setClaimed] = useState(new Set());
  return (
    <>
      <Coins size={48} style={{ color: '#fbbf24', marginBottom: 16 }} />
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 30, color: '#fde68a', marginBottom: 8 }}>LOOT FOUND!</div>
      {action.description && <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>{action.description}</div>}
      {action.gold > 0 && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 10,
          background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24',
          fontSize: 18, fontWeight: 700, marginBottom: 16, fontFamily: 'var(--font-heading)',
        }}><Coins size={18} /> {action.gold} Gold</div>
      )}
      {action.items && action.items.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          {action.items.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 16px', borderRadius: 10,
              background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)',
            }}>
              <span style={{ color: '#e8d9b5', fontSize: 15 }}>{item.name || item}</span>
              {item.contested && !claimed.has(i) ? (
                <button onClick={() => { onClaim(i); setClaimed(prev => new Set(prev).add(i)); }} style={{
                  padding: '6px 14px', borderRadius: 8, background: 'rgba(201,168,76,0.15)',
                  border: '1px solid rgba(201,168,76,0.35)', color: GOLD, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}>Claim</button>
              ) : (
                <span style={{ fontSize: 12, color: 'rgba(74,222,128,0.7)', fontWeight: 600 }}>
                  {claimed.has(i) ? 'Claimed' : 'Collected'}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      <button onClick={onDismiss} style={{
        marginTop: 24, padding: '10px 24px', borderRadius: 10,
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer',
      }}>Close</button>
    </>
  );
}

// ─── SOCIAL ENCOUNTER VIEW ──────────────────────────────────────────────
function SocialView({ action, onChoice, onDismiss, rollResult, rolling, onRoll }) {
  return (
    <>
      <Users size={44} style={{ color: '#a78bfa', marginBottom: 16 }} />
      {action.npc_name && (
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 24, color: '#e8d9b5', marginBottom: 4 }}>{action.npc_name}</div>
      )}
      {action.npc_role && (
        <div style={{ fontSize: 12, color: 'rgba(167,139,250,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>{action.npc_role}</div>
      )}
      {action.narrative && (
        <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 20,
          padding: '14px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.02)',
          borderLeft: '3px solid rgba(167,139,250,0.3)', textAlign: 'left', fontStyle: 'italic',
        }}>{action.narrative}</div>
      )}
      {action.choices && action.choices.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {action.choices.map((c, i) => (
            <button key={i} onClick={() => onChoice(c)} style={{
              padding: '12px 18px', borderRadius: 12, textAlign: 'left',
              background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.2)',
              color: '#c4b5fd', fontSize: 15, cursor: 'pointer', transition: 'all 0.15s',
              fontFamily: 'var(--font-ui)', display: 'flex', alignItems: 'center', gap: 8,
            }}><ChevronRight size={16} />{c}</button>
          ))}
        </div>
      )}
      {action.check && !rollResult && (
        <RollButton result={rollResult} rolling={rolling} onRoll={onRoll} label={`Roll ${action.check}`} modifier={action.modifier} />
      )}
      {rollResult && <div style={{ marginTop: 12 }}><RollResultDisplay result={rollResult} /></div>}
      {!action.choices && !action.check && (
        <button onClick={onDismiss} style={{
          marginTop: 16, padding: '10px 24px', borderRadius: 10,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer',
        }}>Continue</button>
      )}
    </>
  );
}

// ─── GROUP CHECK VIEW ───────────────────────────────────────────────────
function GroupCheckView({ action, rollResult, rolling, resultView, onRoll }) {
  return (
    <>
      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em', color: GOLD_DIM, fontFamily: 'var(--font-heading)', marginBottom: 8 }}>
        The DM requests
      </div>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 26, color: '#e8d9b5', marginBottom: 8 }}>
        {action.skill || 'Ability'} Check
      </div>
      {action.description && (
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 20, lineHeight: 1.6 }}>{action.description}</div>
      )}
      {action.show_dc && action.dc && (
        <div style={{ fontSize: 14, color: GOLD, fontWeight: 600, marginBottom: 16 }}>DC {action.dc}</div>
      )}
      {resultView ? <ResultBanner pass={resultView.pass} text={resultView.text} />
        : <RollButton result={rollResult} rolling={rolling} onRoll={onRoll} modifier={action.modifier} />}
    </>
  );
}

// ─── COMBAT HUD (compact, always-on during combat) ─────────────────────
function CombatHUD({ initiativeOrder, currentTurn, round, isMyTurn }) {
  if (!initiativeOrder.length) return null;
  const current = initiativeOrder[currentTurn] || {};
  return (
    <ModalPortal>
      {isMyTurn && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 52,
          background: 'linear-gradient(90deg, rgba(201,168,76,0.15), rgba(201,168,76,0.25), rgba(201,168,76,0.15))',
          borderBottom: '2px solid rgba(201,168,76,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
        }}>
          <Swords size={20} style={{ color: GOLD }} />
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: '#fde68a',
            letterSpacing: '0.08em', animation: 'pao-turnPulse 2s ease-in-out infinite' }}>
            YOUR TURN
          </span>
          <Swords size={20} style={{ color: GOLD }} />
        </div>
      )}
      <div style={{
        position: 'fixed', top: isMyTurn ? 52 : 0, left: 0, right: 0, zIndex: 99, height: 34,
        background: 'rgba(10,10,18,0.92)', borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        padding: '0 16px', backdropFilter: 'blur(8px)',
      }}>
        <span style={{ fontSize: 10, color: GOLD_DIM, fontFamily: 'var(--font-heading)', letterSpacing: '0.1em', marginRight: 10 }}>
          Round {round}
        </span>
        {initiativeOrder.map((c, i) => {
          const active = i === currentTurn;
          return (
            <div key={c.client_id || c.name || i} style={{
              display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 6,
              background: active ? 'rgba(201,168,76,0.15)' : 'transparent',
              border: `1px solid ${active ? 'rgba(201,168,76,0.35)' : 'transparent'}`, transition: 'all 0.2s',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%',
                background: active ? GOLD : 'rgba(255,255,255,0.15)',
                boxShadow: active ? '0 0 6px rgba(201,168,76,0.5)' : 'none' }} />
              <span style={{ fontSize: 11, fontWeight: active ? 700 : 400,
                color: active ? '#e8d9b5' : 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-ui)',
                maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.name || '?'}
              </span>
            </div>
          );
        })}
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginLeft: 10 }}>{current.name || '?'}'s Turn</span>
      </div>
    </ModalPortal>
  );
}

// ─── SHARED: Roll Button ────────────────────────────────────────────────
function RollButton({ result, rolling, onRoll, label, modifier, rollMode }) {
  if (result) return <RollResultDisplay result={result} />;

  const isAutoFail = rollMode === 'auto_fail' || rollMode === 'cant_act';
  const btnLabel = isAutoFail
    ? (rollMode === 'cant_act' ? "Can't Act — Auto-Fail" : 'Auto-Fail — Submit')
    : (label || `Roll d20${modifier ? ` + ${modifier}` : ''}`);
  const btnColor = isAutoFail ? '#ef4444' : GOLD;
  const btnBg = isAutoFail ? 'rgba(239,68,68,0.12)' : 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.08))';

  return (
    <button onClick={onRoll} disabled={rolling} style={{
      ...actionBtn(btnColor, btnBg),
      opacity: rolling ? 0.6 : 1,
      animation: isAutoFail ? 'none' : actionBtn(GOLD, '').animation,
    }}>
      <Dice5 size={24} style={rolling ? { animation: 'pao-rollSpin 0.6s ease-in-out infinite' } : {}} />
      {btnLabel}
    </button>
  );
}

// ─── SHARED: Roll Result ────────────────────────────────────────────────
function RollResultDisplay({ result }) {
  const isAutoFail = result.breakdownParts?.[0] === 'Auto-fail';
  const rolls = result.groups?.[0]?.rolls || [];
  const kept = result.groups?.[0]?.kept || [];
  const isNat20 = kept.length > 0 ? kept[0] === 20 : rolls[0] === 20;
  const isNat1 = kept.length > 0 ? kept[0] === 1 : rolls[0] === 1;
  const rollMode = result._rollMode;

  return (
    <div style={{ animation: 'pao-resultPop 0.4s ease-out' }}>
      {rollMode && (
        <div style={{
          fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 6,
          color: rollMode === 'advantage' ? '#4ade80' : rollMode === 'disadvantage' ? '#fbbf24' : 'rgba(255,255,255,0.4)',
        }}>
          {rollMode === 'advantage' ? 'Advantage' : rollMode === 'disadvantage' ? 'Disadvantage' : ''}
        </div>
      )}
      {isAutoFail && (
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 6, color: '#ef4444' }}>
          Auto-Fail
        </div>
      )}
      <div style={{
        fontSize: 56, fontWeight: 700, fontFamily: 'var(--font-heading)',
        color: isAutoFail ? '#ef4444' : isNat20 ? '#4ade80' : isNat1 ? '#ef4444' : GOLD, lineHeight: 1.1,
      }}>{result.total}</div>
      {!isAutoFail && isNat20 && <div style={{ fontSize: 14, color: '#4ade80', fontWeight: 700, marginTop: 4 }}>NATURAL 20!</div>}
      {!isAutoFail && isNat1 && <div style={{ fontSize: 14, color: '#ef4444', fontWeight: 700, marginTop: 4 }}>Critical Fail!</div>}
      {/* Show both dice for advantage/disadvantage */}
      {rollMode && rolls.length === 2 && (
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 6 }}>
          Rolled: {rolls[0]} and {rolls[1]} — kept {kept[0]}
        </div>
      )}
      {result.breakdownParts && !isAutoFail && (
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 6 }}>{result.breakdownParts.join(' ')}</div>
      )}
    </div>
  );
}

// ─── SHARED: Result Banner ──────────────────────────────────────────────
function ResultBanner({ pass, text }) {
  return (
    <div style={{
      padding: '20px 28px', borderRadius: 14, marginTop: 12,
      background: pass ? 'rgba(74,222,128,0.08)' : 'rgba(239,68,68,0.08)',
      border: `2px solid ${pass ? 'rgba(74,222,128,0.35)' : 'rgba(239,68,68,0.35)'}`,
      animation: 'pao-resultPop 0.4s ease-out',
    }}>
      <div style={{
        fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700,
        color: pass ? '#4ade80' : '#ef4444', marginBottom: 6,
      }}>{pass ? 'PASS' : 'FAIL'}</div>
      <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)' }}>{text}</div>
    </div>
  );
}
