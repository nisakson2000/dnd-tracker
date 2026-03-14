import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Swords, Heart, Shield, Skull, ChevronRight, SkipForward, X, Users, Timer, AlertTriangle, Star, Zap, Crown, Castle, ShieldAlert } from 'lucide-react';
import { useLiveSession } from '../../contexts/LiveSessionContext';
import { useCampaignSync } from '../../contexts/CampaignSyncContext';
import { useParty } from '../../contexts/PartyContext';
import { calcDifficulty, CR_XP } from '../../utils/encounterMath';
import { getExhaustionLevel } from '../../utils/exhaustionEffects';

// ── 5e SRD Conditions ──
const CONDITIONS = [
  { id: 'blinded', label: 'Blinded', color: '#6b7280' },
  { id: 'charmed', label: 'Charmed', color: '#f472b6' },
  { id: 'deafened', label: 'Deafened', color: '#9ca3af' },
  { id: 'frightened', label: 'Frightened', color: '#a78bfa' },
  { id: 'grappled', label: 'Grappled', color: '#f97316' },
  { id: 'incapacitated', label: 'Incapacitated', color: '#dc2626' },
  { id: 'invisible', label: 'Invisible', color: '#67e8f9' },
  { id: 'paralyzed', label: 'Paralyzed', color: '#eab308' },
  { id: 'petrified', label: 'Petrified', color: '#78716c' },
  { id: 'poisoned', label: 'Poisoned', color: '#22c55e' },
  { id: 'prone', label: 'Prone', color: '#d97706' },
  { id: 'restrained', label: 'Restrained', color: '#ea580c' },
  { id: 'stunned', label: 'Stunned', color: '#facc15' },
  { id: 'unconscious', label: 'Unconscious', color: '#991b1b' },
  { id: 'concentrating', label: 'Concentrating', color: '#60a5fa' },
];

/** Parse stat_block_json safely */
function parseStatBlock(monster) {
  if (!monster?.stat_block_json) return null;
  try {
    return typeof monster.stat_block_json === 'string'
      ? JSON.parse(monster.stat_block_json)
      : monster.stat_block_json;
  } catch { return null; }
}

export default function DmCombatPanel() {
  const {
    sessionActive, activeEncounterId, encounterMonsters,
    damageMonster, endSceneEncounter, startSceneEncounter, currentScene,
  } = useLiveSession();
  const { combatActive, initiativeOrder, currentTurn, round, advanceTurn,
    sendHpChange, sendDeathSavePrompt, sendInspirationToggle, sendReactionPrompt,
    sendCombatLogEntry, sendMonsterCondition, concentrationState,
    sendPrompt, incomingAttacks, removeIncomingAttack,
  } = useCampaignSync();
  const { members, myClientId, memberPresence, sendEvent } = useParty();

  const presenceColor = (clientId) => {
    const status = memberPresence[clientId]?.status;
    if (status === 'online') return '#4ade80';
    if (status === 'idle') return '#fbbf24';
    return '#ef4444';
  };
  const PresenceDot = ({ clientId }) => (
    <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: presenceColor(clientId), flexShrink: 0 }} />
  );

  const [damageInputs, setDamageInputs] = useState({});
  const [playerDamageInputs, setPlayerDamageInputs] = useState({});
  const [deathSaves, setDeathSaves] = useState({}); // { clientId: { successes: 0, failures: 0 } }
  const [monsterConditions, setMonsterConditions] = useState({}); // { monsterId: ['poisoned', 'prone'] }
  const [showConditionPicker, setShowConditionPicker] = useState(null); // monsterId or null
  const [turnTimer, setTurnTimer] = useState(0);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const timerRef = useRef(null);

  // ── Feature 1: Auto-damage — target selection per attack ──
  const [attackTargets, setAttackTargets] = useState({}); // { attackId: monsterId }

  // ── Feature 2: Concentration save toast ──
  const [conToasts, setConToasts] = useState([]); // [{ id, text, expires }]

  // ── Feature 3: Legendary Actions ──
  const [legendaryActions, setLegendaryActions] = useState({}); // { monsterId: { max: 3, used: 0 } }
  const [lairActionDismissedRound, setLairActionDismissedRound] = useState(0);

  // ── Cover System ──
  const [coverStatus, setCoverStatus] = useState({}); // { combatantName/id: 'none'|'half'|'three_quarters'|'full' }

  // ── Derive legendary/lair info from monster stat blocks ──
  const legendaryMonsters = useMemo(() => {
    if (!encounterMonsters) return [];
    return encounterMonsters
      .filter(m => m.alive !== false && m.alive !== 0)
      .map(m => {
        const sb = parseStatBlock(m);
        if (!sb) return null;
        const laCount = sb.legendary_actions
          || sb.legendaryActions
          || sb.legendary_action_count
          || (sb.legendary_actions_text ? 3 : 0);
        if (!laCount) return null;
        return { id: m.id, name: m.name, max: typeof laCount === 'number' ? laCount : 3 };
      })
      .filter(Boolean);
  }, [encounterMonsters]);

  const hasLairActions = useMemo(() => {
    if (!encounterMonsters) return false;
    return encounterMonsters.some(m => {
      const sb = parseStatBlock(m);
      return sb && (sb.lair_actions || sb.lairActions || sb.lair_actions_text);
    });
  }, [encounterMonsters]);

  // Initialize legendary action tracking when combat starts or monsters change
  useEffect(() => {
    if (!combatActive) { setLegendaryActions({}); return; }
    setLegendaryActions(prev => {
      const next = { ...prev };
      for (const lm of legendaryMonsters) {
        if (!next[lm.id]) next[lm.id] = { max: lm.max, used: 0 };
        else next[lm.id] = { ...next[lm.id], max: lm.max };
      }
      return next;
    });
  }, [combatActive, legendaryMonsters]);

  // Reset legendary actions at start of each legendary monster's turn
  const prevTurnRef = useRef(currentTurn);
  useEffect(() => {
    if (!combatActive || prevTurnRef.current === currentTurn) return;
    prevTurnRef.current = currentTurn;
    const entry = initiativeOrder[currentTurn];
    if (!entry?.is_monster) return;
    // Check if this monster is legendary
    const monsterId = entry.monster_id;
    if (legendaryActions[monsterId]) {
      setLegendaryActions(prev => ({
        ...prev,
        [monsterId]: { ...prev[monsterId], used: 0 },
      }));
      sendCombatLogEntry('legendary', `${entry.name}'s legendary actions reset`);
    }
  }, [combatActive, currentTurn, initiativeOrder, legendaryActions, sendCombatLogEntry]);

  // Clean up concentration toasts
  useEffect(() => {
    if (conToasts.length === 0) return;
    const timer = setTimeout(() => {
      setConToasts(prev => prev.filter(t => t.expires > Date.now()));
    }, 3500);
    return () => clearTimeout(timer);
  }, [conToasts]);

  // ── Live encounter difficulty ──
  const difficultyInfo = useMemo(() => {
    if (!combatActive) return null;
    const partyLevels = members
      .filter(m => m.client_id !== myClientId && m.character)
      .map(m => m.character?.level || 1);
    if (partyLevels.length === 0) return null;
    const monsterCRs = (encounterMonsters || [])
      .filter(m => (m.hp_current ?? m.hp_max) > 0)
      .map(m => m.cr || 0);
    return calcDifficulty(partyLevels, monsterCRs);
  }, [combatActive, members, myClientId, encounterMonsters]);

  // Turn timer — resets on turn change
  useEffect(() => {
    if (!combatActive || !timerEnabled) {
      setTurnTimer(0);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    setTurnTimer(0);
    timerRef.current = setInterval(() => setTurnTimer(t => t + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [combatActive, currentTurn, timerEnabled]);

  if (!sessionActive) {
    return (
      <div style={{ textAlign: 'center', padding: 16, color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
        Start a live session to manage combat.
      </div>
    );
  }

  if (!combatActive) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ textAlign: 'center', padding: 16, color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
          No active encounter
        </div>
        <button
          onClick={() => currentScene?.id && startSceneEncounter(currentScene.id)}
          disabled={!currentScene?.id}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '10px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
            color: '#ef4444', cursor: 'pointer', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em',
          }}
        >
          <Swords size={13} /> Start Encounter
        </button>
      </div>
    );
  }

  const setDamage = (id, val) => setDamageInputs(prev => ({ ...prev, [id]: val }));

  const applyDamage = (id, multiplier = -1) => {
    const val = parseInt(damageInputs[id]) || 0;
    if (val <= 0) return;
    damageMonster(id, val * multiplier);
    setDamageInputs(prev => ({ ...prev, [id]: '' }));
  };

  const setPlayerDamage = (clientId, val) => setPlayerDamageInputs(prev => ({ ...prev, [clientId]: val }));

  // ── Feature 2: Auto-concentration save on player damage ──
  const applyPlayerDamage = (clientId, multiplier = -1) => {
    const val = parseInt(playerDamageInputs[clientId]) || 0;
    if (val <= 0) return;
    const delta = val * multiplier;
    sendHpChange(delta, multiplier < 0 ? 'DM Damage' : 'DM Healing', [clientId]);
    sendCombatLogEntry('hp_change', `${getMemberName(clientId)}: ${delta > 0 ? '+' : ''}${delta} HP`);
    setPlayerDamageInputs(prev => ({ ...prev, [clientId]: '' }));

    // Auto-concentration save: if dealing damage and player is concentrating
    if (multiplier < 0 && concentrationState?.[clientId]) {
      const dc = Math.max(10, Math.floor(val / 2));
      try {
        sendPrompt({
          type: 'roll_check',
          roll_type: 'Saving Throw',
          ability: 'CON',
          dc,
          label: 'Concentration Check',
          show_dc: true,
          pass_text: 'Concentration maintained!',
          fail_text: 'Concentration broken!',
        }, [clientId]);
      } catch (_) {}
      sendCombatLogEntry('concentration', `Concentration check sent to ${getMemberName(clientId)} (DC ${dc})`);
      setConToasts(prev => [...prev, {
        id: `con_${Date.now()}`,
        text: `Concentration check sent to ${getMemberName(clientId)} (DC ${dc})`,
        expires: Date.now() + 3000,
      }]);
    }
  };

  const getMemberName = (clientId) => {
    const m = members.find(m => m.client_id === clientId);
    return m?.character?.name || m?.display_name || 'Player';
  };

  const triggerDeathSave = (clientId) => {
    sendDeathSavePrompt(clientId);
    sendCombatLogEntry('death_save', `Death save prompted for ${getMemberName(clientId)}`);
  };

  const grantInspiration = (clientId) => {
    sendInspirationToggle(true, [clientId]);
    sendCombatLogEntry('inspiration', `Inspiration granted to ${getMemberName(clientId)}`);
  };

  const toggleCondition = (monsterId, conditionId) => {
    const current = monsterConditions[monsterId] || [];
    const has = current.includes(conditionId);
    const cond = CONDITIONS.find(c => c.id === conditionId);
    const monsterEntry = encounterMonsters.find(m => m.id === monsterId);
    const monsterName = monsterEntry?.name || 'Monster';

    setMonsterConditions(prev => ({
      ...prev,
      [monsterId]: has ? current.filter(c => c !== conditionId) : [...current, conditionId],
    }));
    setShowConditionPicker(null);

    // Persist to backend (fire-and-forget; .catch so it won't break if command doesn't exist yet)
    if (has) {
      invoke('campaign_remove_condition', { encounter_id: activeEncounterId, monster_id: monsterId, condition: conditionId }).catch(() => {});
    } else {
      invoke('campaign_apply_condition', { encounter_id: activeEncounterId, monster_id: monsterId, condition: conditionId }).catch(() => {});
    }

    // Sync to players
    if (sendMonsterCondition) {
      try { sendMonsterCondition({ monster_id: monsterId, monster_name: monsterName, condition: conditionId, action: has ? 'remove' : 'add' }); } catch (_) {}
    }

    // Combat log entry
    if (sendCombatLogEntry) {
      const text = has
        ? `${cond?.label || conditionId} removed from ${monsterName}`
        : `${monsterName} is now ${cond?.label || conditionId}`;
      try { sendCombatLogEntry('condition', text); } catch (_) {}
    }
  };

  const removeCondition = (monsterId, conditionId) => {
    const cond = CONDITIONS.find(c => c.id === conditionId);
    const monsterEntry = encounterMonsters.find(m => m.id === monsterId);
    const monsterName = monsterEntry?.name || 'Monster';

    setMonsterConditions(prev => ({
      ...prev,
      [monsterId]: (prev[monsterId] || []).filter(c => c !== conditionId),
    }));

    // Persist to backend (fire-and-forget; .catch so it won't break if command doesn't exist yet)
    invoke('campaign_remove_condition', { encounter_id: activeEncounterId, monster_id: monsterId, condition: conditionId }).catch(() => {});

    // Sync to players
    if (sendMonsterCondition) {
      try { sendMonsterCondition({ monster_id: monsterId, monster_name: monsterName, condition: conditionId, action: 'remove' }); } catch (_) {}
    }

    // Combat log entry
    if (sendCombatLogEntry) {
      const text = `${cond?.label || conditionId} removed from ${monsterName}`;
      try { sendCombatLogEntry('condition', text); } catch (_) {}
    }
  };

  // ── Feature 1: Apply incoming player attack damage to a monster ──
  const applyAttackDamage = (attack) => {
    const targetId = attackTargets[attack.id];
    if (!targetId) return;
    const dmg = attack.damage_roll || 0;
    if (dmg <= 0) return;
    damageMonster(targetId, -dmg);
    const monsterEntry = encounterMonsters.find(m => m.id === targetId);
    sendCombatLogEntry('damage_applied', `${attack.player_name}'s ${attack.weapon} deals ${dmg} damage to ${monsterEntry?.name || 'monster'}`);
    removeIncomingAttack(attack.id);
    setAttackTargets(prev => { const n = { ...prev }; delete n[attack.id]; return n; });
  };

  // ── Feature 3: Use legendary action ──
  const useLegendaryAction = (monsterId) => {
    setLegendaryActions(prev => {
      const la = prev[monsterId];
      if (!la || la.used >= la.max) return prev;
      return { ...prev, [monsterId]: { ...la, used: la.used + 1 } };
    });
    const monster = encounterMonsters.find(m => m.id === monsterId);
    sendCombatLogEntry('legendary', `${monster?.name || 'Monster'} uses a legendary action`);
  };

  const aliveMonsters = encounterMonsters.filter(m => m.alive !== false && m.alive !== 0);

  // ── Cover system helpers ──
  const COVER_CYCLE = ['none', 'half', 'three_quarters', 'full'];
  const COVER_INFO = {
    none: { label: null, badge: null, acBonus: 0, dexSaveBonus: 0 },
    half: { label: 'Half Cover', badge: '\u00BD', acBonus: 2, dexSaveBonus: 2, color: '#60a5fa' },
    three_quarters: { label: '\u00BE Cover', badge: '\u00BE', acBonus: 5, dexSaveBonus: 5, color: '#fbbf24' },
    full: { label: 'Full Cover', badge: 'Full', acBonus: Infinity, dexSaveBonus: Infinity, color: '#ef4444' },
  };

  const cycleCover = (id, name, isPlayer = false) => {
    const current = coverStatus[id] || 'none';
    const idx = COVER_CYCLE.indexOf(current);
    const next = COVER_CYCLE[(idx + 1) % COVER_CYCLE.length];
    setCoverStatus(prev => ({ ...prev, [id]: next }));

    const info = COVER_INFO[next];
    if (next !== 'none') {
      sendCombatLogEntry('cover', `${name}: ${info.label} (+${info.acBonus === Infinity ? '\u221E' : info.acBonus} AC)`);
    } else {
      sendCombatLogEntry('cover', `${name}: Cover removed`);
    }

    // Notify players of cover change
    if (isPlayer && sendEvent) {
      try {
        sendEvent('cover_change', { target: name, cover: next, acBonus: info.acBonus === Infinity ? 999 : info.acBonus });
      } catch (_) {}
    }
  };

  // ── Exhaustion color scale ──
  const EXHAUSTION_COLORS = {
    1: '#eab308', // yellow
    2: '#f97316', // orange
    3: '#ef4444', // red
    4: '#b91c1c', // dark red
    5: '#a855f7', // purple
    6: '#1f2937', // black/dark
  };

  const formatTimer = (secs) => `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;

  // Show lair action reminder at start of each new round (initiative count 20 = top of round)
  const showLairReminder = hasLairActions && currentTurn === 0 && round > 0 && lairActionDismissedRound < round;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Concentration save toasts */}
      {conToasts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {conToasts.map(t => (
            <div key={t.id} style={{
              padding: '5px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600,
              background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.25)',
              color: '#60a5fa', display: 'flex', alignItems: 'center', gap: 6,
              animation: 'fadeIn 0.2s ease',
            }}>
              <Zap size={10} />
              {t.text}
            </div>
          ))}
        </div>
      )}

      {/* Lair Action Reminder (Feature 3) */}
      {showLairReminder && (
        <div style={{
          padding: '8px 10px', borderRadius: 8, fontSize: 11,
          background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)',
          color: '#c084fc', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Castle size={14} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 2 }}>Lair Action</div>
            <div style={{ fontSize: 9, color: 'rgba(192,132,252,0.7)' }}>Initiative count 20 — resolve lair action this round</div>
          </div>
          <button
            onClick={() => {
              setLairActionDismissedRound(round);
              sendCombatLogEntry('lair', `Lair action resolved (Round ${round})`);
            }}
            style={{
              padding: '3px 8px', borderRadius: 5, fontSize: 9, fontWeight: 600,
              background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)',
              color: '#c084fc', cursor: 'pointer',
            }}
          >
            Done
          </button>
          <button
            onClick={() => setLairActionDismissedRound(round)}
            style={{
              padding: '3px 5px', borderRadius: 5,
              background: 'transparent', border: '1px solid rgba(168,85,247,0.15)',
              color: 'rgba(168,85,247,0.4)', cursor: 'pointer',
            }}
          >
            <X size={9} />
          </button>
        </div>
      )}

      {/* Round & controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Swords size={13} style={{ color: '#ef4444' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e8d9b5' }}>
            Round {round}
          </span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
            {aliveMonsters.length} monster{aliveMonsters.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {/* Turn timer toggle */}
          <button
            onClick={() => setTimerEnabled(!timerEnabled)}
            title={timerEnabled ? 'Disable turn timer' : 'Enable turn timer'}
            style={{
              padding: '4px 6px', borderRadius: 5, fontSize: 9,
              background: timerEnabled ? 'rgba(251,191,36,0.1)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${timerEnabled ? 'rgba(251,191,36,0.25)' : 'rgba(255,255,255,0.06)'}`,
              color: timerEnabled ? '#fbbf24' : 'rgba(255,255,255,0.2)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 3,
            }}
          >
            <Timer size={9} />
            {timerEnabled && <span style={{ fontFamily: 'var(--font-mono, monospace)', fontWeight: 600 }}>{formatTimer(turnTimer)}</span>}
          </button>
          <button
            onClick={advanceTurn}
            title="Next Turn"
            style={{
              padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600,
              background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)',
              color: '#c9a84c', cursor: 'pointer',
            }}
          >
            <SkipForward size={10} />
          </button>
          <button
            onClick={endSceneEncounter}
            title="End Encounter"
            style={{
              padding: '4px 10px', borderRadius: 6, fontSize: 10,
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              color: '#ef4444', cursor: 'pointer',
            }}
          >
            <X size={10} />
          </button>
        </div>
      </div>

      {/* Encounter difficulty meter */}
      {difficultyInfo && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px', marginBottom: 6 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: difficultyInfo.color, textTransform: 'uppercase', letterSpacing: 1, minWidth: 50 }}>
            {difficultyInfo.rating}
          </span>
          <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, difficultyInfo.percent)}%`, height: '100%', background: difficultyInfo.color, borderRadius: 2, transition: 'all 0.5s ease' }} />
          </div>
          <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
            {difficultyInfo.adjustedXP} XP
          </span>
        </div>
      )}

      {/* ── Feature 1: Incoming Player Attacks ── */}
      {incomingAttacks && incomingAttacks.length > 0 && (
        <>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(251,191,36,0.5)', fontFamily: 'var(--font-heading)' }}>
            <Zap size={9} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
            Incoming Attacks
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {incomingAttacks.map(atk => (
              <div
                key={atk.id}
                style={{
                  background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.15)',
                  borderRadius: 7, padding: '6px 8px', fontSize: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: '#fbbf24' }}>{atk.player_name || 'Player'}</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>{atk.weapon || 'Attack'}</span>
                  {atk.is_crit && <span style={{ fontSize: 8, padding: '1px 4px', borderRadius: 3, background: 'rgba(239,68,68,0.2)', color: '#ef4444', fontWeight: 700 }}>CRIT</span>}
                  {atk.is_fumble && <span style={{ fontSize: 8, padding: '1px 4px', borderRadius: 3, background: 'rgba(107,114,128,0.2)', color: '#9ca3af', fontWeight: 700 }}>FUMBLE</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>
                    Roll: <span style={{ color: '#e8d9b5', fontWeight: 600 }}>{atk.attack_roll}</span>
                  </span>
                  {atk.damage_roll != null && (
                    <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>
                      DMG: <span style={{ color: '#ef4444', fontWeight: 600 }}>{atk.damage_roll}</span>
                    </span>
                  )}
                  {atk.damage_breakdown && (
                    <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>({atk.damage_breakdown})</span>
                  )}
                </div>
                {/* Apply to monster controls */}
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <select
                    value={attackTargets[atk.id] || ''}
                    onChange={e => setAttackTargets(prev => ({ ...prev, [atk.id]: e.target.value }))}
                    style={{
                      flex: 1, padding: '3px 5px', borderRadius: 4, fontSize: 9,
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                      color: '#e8d9b5', outline: 'none',
                    }}
                  >
                    <option value="">Select target...</option>
                    {aliveMonsters.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.hp_current ?? m.hp_max}/{m.hp_max})</option>
                    ))}
                  </select>
                  <button
                    onClick={() => applyAttackDamage(atk)}
                    disabled={!attackTargets[atk.id]}
                    style={{
                      padding: '3px 8px', borderRadius: 4, fontSize: 9, fontWeight: 600,
                      background: attackTargets[atk.id] ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${attackTargets[atk.id] ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.06)'}`,
                      color: attackTargets[atk.id] ? '#ef4444' : 'rgba(255,255,255,0.2)',
                      cursor: attackTargets[atk.id] ? 'pointer' : 'default',
                    }}
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => {
                      removeIncomingAttack(atk.id);
                      setAttackTargets(prev => { const n = { ...prev }; delete n[atk.id]; return n; });
                    }}
                    title="Dismiss"
                    style={{
                      padding: '3px 5px', borderRadius: 4,
                      background: 'transparent', border: '1px solid rgba(255,255,255,0.06)',
                      color: 'rgba(255,255,255,0.2)', cursor: 'pointer',
                    }}
                  >
                    <X size={8} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Initiative order */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(201,168,76,0.4)', fontFamily: 'var(--font-heading)', marginBottom: 2 }}>
          Initiative
        </div>
        {initiativeOrder.map((entry, i) => (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '5px 8px', borderRadius: 6, fontSize: 11,
              background: i === currentTurn ? 'rgba(201,168,76,0.1)' : 'transparent',
              border: i === currentTurn ? '1px solid rgba(201,168,76,0.2)' : '1px solid transparent',
              color: i === currentTurn ? '#e8d9b5' : 'rgba(255,255,255,0.35)',
            }}
          >
            <ChevronRight size={9} style={{ opacity: i === currentTurn ? 1 : 0, color: '#c9a84c' }} />
            {!entry.is_monster && entry.client_id && <PresenceDot clientId={entry.client_id} />}
            <span style={{ fontWeight: i === currentTurn ? 600 : 400, flex: 1 }}>{entry.name}</span>
            {entry.is_monster && (
              <span style={{ fontSize: 9, color: 'rgba(239,68,68,0.5)' }}>MON</span>
            )}
            {/* Legendary badge in initiative */}
            {entry.is_monster && legendaryActions[entry.monster_id] && (
              <Crown size={9} style={{ color: '#fbbf24', opacity: 0.6 }} />
            )}
            {/* Show conditions inline for initiative entries that are monsters */}
            {entry.is_monster && (monsterConditions[entry.monster_id] || []).length > 0 && (
              <div style={{ display: 'flex', gap: 2 }}>
                {(monsterConditions[entry.monster_id] || []).map(cid => {
                  const cond = CONDITIONS.find(c => c.id === cid);
                  return cond ? (
                    <span key={cid} style={{ fontSize: 7, padding: '1px 3px', borderRadius: 3, background: `${cond.color}20`, color: cond.color, fontWeight: 600 }}>
                      {cond.label.slice(0, 3).toUpperCase()}
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Monster cards */}
      {aliveMonsters.length > 0 && (
        <>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(239,68,68,0.4)', fontFamily: 'var(--font-heading)' }}>
            Monsters
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {aliveMonsters.map(monster => {
              const hpPct = Math.max(0, ((monster.hp_current ?? monster.hp_max) / monster.hp_max) * 100);
              const hpColor = hpPct > 50 ? '#4ade80' : hpPct > 25 ? '#fbbf24' : '#ef4444';
              const conditions = monsterConditions[monster.id] || [];
              const la = legendaryActions[monster.id];
              return (
                <div
                  key={monster.id}
                  style={{
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 8, padding: '8px 10px',
                  }}
                >
                  {/* Name & stats */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#e8d9b5' }}>{monster.name}</span>
                      {la && <Crown size={10} style={{ color: '#fbbf24' }} title="Legendary" />}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
                      {/* Cover toggle button */}
                      <button
                        onClick={() => cycleCover(monster.id, monster.name)}
                        title={coverStatus[monster.id] && coverStatus[monster.id] !== 'none' ? COVER_INFO[coverStatus[monster.id]].label : 'Set Cover (None)'}
                        style={{
                          padding: '2px 4px', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3,
                          background: coverStatus[monster.id] && coverStatus[monster.id] !== 'none' ? `${COVER_INFO[coverStatus[monster.id]].color}15` : 'transparent',
                          border: `1px solid ${coverStatus[monster.id] && coverStatus[monster.id] !== 'none' ? `${COVER_INFO[coverStatus[monster.id]].color}40` : 'rgba(255,255,255,0.06)'}`,
                          color: coverStatus[monster.id] && coverStatus[monster.id] !== 'none' ? COVER_INFO[coverStatus[monster.id]].color : 'rgba(255,255,255,0.2)',
                        }}
                      >
                        <ShieldAlert size={9} />
                        {coverStatus[monster.id] && coverStatus[monster.id] !== 'none' && (
                          <span style={{ fontSize: 7, fontWeight: 700 }}>{COVER_INFO[coverStatus[monster.id]].badge}</span>
                        )}
                      </button>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Shield size={9} />
                        {monster.ac || '?'}
                        {coverStatus[monster.id] && coverStatus[monster.id] !== 'none' && coverStatus[monster.id] !== 'full' && (
                          <span style={{ fontSize: 8, color: COVER_INFO[coverStatus[monster.id]].color, fontWeight: 600 }}>
                            (+{COVER_INFO[coverStatus[monster.id]].acBonus})
                          </span>
                        )}
                        {coverStatus[monster.id] === 'full' && (
                          <span style={{ fontSize: 7, color: '#ef4444', fontWeight: 700 }}>UNTARGETABLE</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Condition badges */}
                  {conditions.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 5 }}>
                      {conditions.map(cid => {
                        const cond = CONDITIONS.find(c => c.id === cid);
                        if (!cond) return null;
                        return (
                          <span
                            key={cid}
                            onClick={() => removeCondition(monster.id, cid)}
                            style={{
                              fontSize: 8, padding: '2px 5px', borderRadius: 4, cursor: 'pointer',
                              background: `${cond.color}18`, border: `1px solid ${cond.color}30`,
                              color: cond.color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3,
                            }}
                            title={`Remove ${cond.label}`}
                          >
                            {cond.label} <X size={7} />
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* HP bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <Heart size={10} style={{ color: hpColor, flexShrink: 0 }} />
                    <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        width: `${hpPct}%`, height: '100%', borderRadius: 3,
                        background: hpColor, transition: 'width 0.3s, background 0.3s',
                      }} />
                    </div>
                    <span style={{ fontSize: 10, color: hpColor, fontWeight: 600, minWidth: 42, textAlign: 'right' }}>
                      {monster.hp_current ?? monster.hp_max}/{monster.hp_max}
                    </span>
                  </div>

                  {/* ── Feature 3: Legendary Action pips ── */}
                  {la && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <Crown size={9} style={{ color: '#fbbf24', flexShrink: 0 }} />
                      <span style={{ fontSize: 9, color: 'rgba(251,191,36,0.6)', fontWeight: 600 }}>Legendary</span>
                      <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                        {Array.from({ length: la.max }).map((_, i) => (
                          <div key={i} style={{
                            width: 10, height: 10, borderRadius: '50%',
                            background: i < (la.max - la.used) ? '#fbbf24' : 'rgba(251,191,36,0.12)',
                            border: '1px solid rgba(251,191,36,0.3)',
                            transition: 'background 0.2s',
                          }} />
                        ))}
                      </div>
                      <span style={{ fontSize: 8, color: 'rgba(251,191,36,0.4)', fontFamily: 'monospace' }}>
                        {la.max - la.used}/{la.max}
                      </span>
                      <button
                        onClick={() => useLegendaryAction(monster.id)}
                        disabled={la.used >= la.max}
                        title="Use Legendary Action"
                        style={{
                          padding: '2px 6px', borderRadius: 4, fontSize: 8, fontWeight: 600, marginLeft: 'auto',
                          background: la.used < la.max ? 'rgba(251,191,36,0.1)' : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${la.used < la.max ? 'rgba(251,191,36,0.25)' : 'rgba(255,255,255,0.05)'}`,
                          color: la.used < la.max ? '#fbbf24' : 'rgba(255,255,255,0.15)',
                          cursor: la.used < la.max ? 'pointer' : 'default',
                        }}
                      >
                        Use
                      </button>
                    </div>
                  )}

                  {/* Damage controls + condition button */}
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <input
                      type="number"
                      min="1"
                      value={damageInputs[monster.id] || ''}
                      onChange={e => setDamage(monster.id, e.target.value)}
                      placeholder="Dmg"
                      style={{
                        width: 48, padding: '4px 6px', borderRadius: 5, fontSize: 10,
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                        color: '#e8d9b5', outline: 'none', textAlign: 'center',
                      }}
                      onKeyDown={e => { if (e.key === 'Enter') applyDamage(monster.id); }}
                    />
                    <button
                      onClick={() => applyDamage(monster.id, -1)}
                      style={{
                        padding: '4px 8px', borderRadius: 5, fontSize: 9, fontWeight: 600,
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                        color: '#ef4444', cursor: 'pointer',
                      }}
                    >
                      DMG
                    </button>
                    <button
                      onClick={() => applyDamage(monster.id, 1)}
                      style={{
                        padding: '4px 8px', borderRadius: 5, fontSize: 9, fontWeight: 600,
                        background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)',
                        color: '#4ade80', cursor: 'pointer',
                      }}
                    >
                      HEAL
                    </button>
                    <button
                      onClick={() => setShowConditionPicker(showConditionPicker === monster.id ? null : monster.id)}
                      title="Add Condition"
                      style={{
                        padding: '4px 6px', borderRadius: 5,
                        background: showConditionPicker === monster.id ? 'rgba(251,191,36,0.1)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${showConditionPicker === monster.id ? 'rgba(251,191,36,0.25)' : 'rgba(255,255,255,0.06)'}`,
                        color: showConditionPicker === monster.id ? '#fbbf24' : 'rgba(255,255,255,0.3)', cursor: 'pointer',
                      }}
                    >
                      <AlertTriangle size={9} />
                    </button>
                    <button
                      onClick={() => damageMonster(monster.id, -(monster.hp_current ?? monster.hp_max))}
                      title="Kill"
                      style={{
                        padding: '4px 6px', borderRadius: 5, marginLeft: 'auto',
                        background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)',
                        color: 'rgba(239,68,68,0.5)', cursor: 'pointer',
                      }}
                    >
                      <Skull size={10} />
                    </button>
                  </div>

                  {/* Condition picker dropdown */}
                  {showConditionPicker === monster.id && (
                    <div style={{
                      display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 6,
                      padding: '6px 8px', borderRadius: 6,
                      background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      {CONDITIONS.map(cond => {
                        const active = conditions.includes(cond.id);
                        return (
                          <button
                            key={cond.id}
                            onClick={() => toggleCondition(monster.id, cond.id)}
                            style={{
                              fontSize: 8, padding: '2px 5px', borderRadius: 4,
                              background: active ? `${cond.color}25` : 'rgba(255,255,255,0.03)',
                              border: `1px solid ${active ? `${cond.color}50` : 'rgba(255,255,255,0.06)'}`,
                              color: active ? cond.color : 'rgba(255,255,255,0.3)',
                              cursor: 'pointer', fontWeight: 600,
                            }}
                          >
                            {cond.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Player HP strip — enhanced with controls */}
      {(() => {
        const players = members.filter(m => m.client_id !== myClientId && m.character);
        if (players.length === 0) return null;
        return (
          <>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(74,222,128,0.4)', fontFamily: 'var(--font-heading)' }}>
              <Users size={9} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
              Party
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {players.map(m => {
                const char = m.character;
                const hpMax = char.hp_max || char.maxHp || char.max_hp || 0;
                const hpCur = char.hp_current ?? char.currentHp ?? char.hp ?? hpMax;
                const hpPct = hpMax > 0 ? Math.max(0, (hpCur / hpMax) * 100) : 100;
                const hpColor = hpPct > 50 ? '#4ade80' : hpPct > 25 ? '#fbbf24' : '#ef4444';
                const isDown = hpMax > 0 && hpCur <= 0;
                const ds = deathSaves[m.client_id] || { successes: 0, failures: 0 };
                const conSpell = concentrationState?.[m.client_id];
                const playerCoverId = `player_${m.client_id}`;
                const playerCover = coverStatus[playerCoverId] || 'none';
                const playerCoverInfo = COVER_INFO[playerCover];
                // Exhaustion detection from character conditions
                const playerConditions = char.conditions || char.active_conditions || [];
                const playerExhaustion = getExhaustionLevel(playerConditions);

                return (
                  <div
                    key={m.client_id}
                    style={{
                      background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 8, padding: '8px 10px',
                    }}
                  >
                    {/* Name + HP bar row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <PresenceDot clientId={m.client_id} />
                      <span style={{ fontSize: 11, fontWeight: 500, color: '#e8d9b5', minWidth: 60, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {char.name || m.display_name || 'Player'}
                      </span>
                      {/* Exhaustion badge */}
                      {playerExhaustion > 0 && (
                        <span
                          title={`Exhaustion Level ${playerExhaustion}`}
                          style={{
                            fontSize: 7, fontWeight: 700, padding: '1px 4px', borderRadius: 3,
                            background: playerExhaustion === 6 ? '#1f2937' : `${EXHAUSTION_COLORS[playerExhaustion]}20`,
                            border: `1px solid ${playerExhaustion === 6 ? '#4b5563' : `${EXHAUSTION_COLORS[playerExhaustion]}40`}`,
                            color: playerExhaustion === 6 ? '#9ca3af' : EXHAUSTION_COLORS[playerExhaustion],
                            display: 'flex', alignItems: 'center', gap: 2,
                          }}
                        >
                          {playerExhaustion === 6 ? <Skull size={7} /> : null}
                          EXH {playerExhaustion}
                        </span>
                      )}
                      {/* Cover toggle */}
                      <button
                        onClick={() => cycleCover(playerCoverId, char.name || m.display_name || 'Player', true)}
                        title={playerCover !== 'none' ? playerCoverInfo.label : 'Set Cover (None)'}
                        style={{
                          padding: '1px 4px', borderRadius: 3, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2,
                          background: playerCover !== 'none' ? `${playerCoverInfo.color}15` : 'transparent',
                          border: `1px solid ${playerCover !== 'none' ? `${playerCoverInfo.color}40` : 'rgba(255,255,255,0.06)'}`,
                          color: playerCover !== 'none' ? playerCoverInfo.color : 'rgba(255,255,255,0.2)',
                          fontSize: 7, fontWeight: 600,
                        }}
                      >
                        <ShieldAlert size={8} />
                        {playerCover !== 'none' && <span>{playerCoverInfo.badge}</span>}
                      </button>
                      {/* Concentration indicator */}
                      {conSpell && (
                        <span style={{ fontSize: 7, padding: '1px 4px', borderRadius: 3, background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.25)', color: '#60a5fa', fontWeight: 600 }}>
                          CON: {conSpell.length > 10 ? conSpell.slice(0, 10) + '\u2026' : conSpell}
                        </span>
                      )}
                      <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{
                          width: `${hpPct}%`, height: '100%', borderRadius: 3,
                          background: hpColor, transition: 'width 0.3s, background 0.3s',
                        }} />
                      </div>
                      <span style={{ fontSize: 9, color: hpColor, fontWeight: 600, minWidth: 36, textAlign: 'right' }}>
                        {hpMax > 0 ? `${hpCur}/${hpMax}` : '\u2014'}
                      </span>
                    </div>

                    {/* Damage/Heal controls */}
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <input
                        type="number"
                        min="1"
                        value={playerDamageInputs[m.client_id] || ''}
                        onChange={e => setPlayerDamage(m.client_id, e.target.value)}
                        placeholder="HP"
                        style={{
                          width: 42, padding: '3px 5px', borderRadius: 4, fontSize: 9,
                          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                          color: '#e8d9b5', outline: 'none', textAlign: 'center',
                        }}
                        onKeyDown={e => { if (e.key === 'Enter') applyPlayerDamage(m.client_id); }}
                      />
                      <button
                        onClick={() => applyPlayerDamage(m.client_id, -1)}
                        style={{
                          padding: '3px 6px', borderRadius: 4, fontSize: 8, fontWeight: 600,
                          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                          color: '#ef4444', cursor: 'pointer',
                        }}
                      >DMG</button>
                      <button
                        onClick={() => applyPlayerDamage(m.client_id, 1)}
                        style={{
                          padding: '3px 6px', borderRadius: 4, fontSize: 8, fontWeight: 600,
                          background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)',
                          color: '#4ade80', cursor: 'pointer',
                        }}
                      >HEAL</button>
                      <button
                        onClick={() => grantInspiration(m.client_id)}
                        title="Grant Inspiration"
                        style={{
                          padding: '3px 5px', borderRadius: 4,
                          background: 'rgba(253,230,138,0.06)', border: '1px solid rgba(253,230,138,0.15)',
                          color: 'rgba(253,230,138,0.5)', cursor: 'pointer', marginLeft: 'auto',
                        }}
                      >
                        <Star size={8} />
                      </button>
                      {isDown && (
                        <button
                          onClick={() => triggerDeathSave(m.client_id)}
                          title="Trigger Death Save"
                          style={{
                            padding: '3px 6px', borderRadius: 4, fontSize: 8, fontWeight: 600,
                            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                            color: '#ef4444', cursor: 'pointer',
                          }}
                        >DEATH SAVE</button>
                      )}
                    </div>

                    {/* Death save pips (show when down) */}
                    {isDown && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, fontSize: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <span style={{ color: 'rgba(74,222,128,0.5)' }}>Pass:</span>
                          {[0, 1, 2].map(i => (
                            <div key={i} style={{
                              width: 8, height: 8, borderRadius: '50%',
                              background: i < ds.successes ? '#4ade80' : 'rgba(74,222,128,0.15)',
                              border: '1px solid rgba(74,222,128,0.3)',
                            }} />
                          ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <span style={{ color: 'rgba(239,68,68,0.5)' }}>Fail:</span>
                          {[0, 1, 2].map(i => (
                            <div key={i} style={{
                              width: 8, height: 8, borderRadius: '50%',
                              background: i < ds.failures ? '#ef4444' : 'rgba(239,68,68,0.15)',
                              border: '1px solid rgba(239,68,68,0.3)',
                            }} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        );
      })()}
    </div>
  );
}
