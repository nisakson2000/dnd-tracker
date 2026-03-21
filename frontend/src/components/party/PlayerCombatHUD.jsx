import { memo, useState, useEffect, useCallback, useMemo } from 'react';
import { Swords, Wand2, FlaskConical, Sparkles, Shield, Heart, X, ChevronRight, Zap, Target, Clock, Send, Skull, AlertTriangle, Hand, ArrowRight, User, ChevronDown, ChevronUp, ClipboardList, Check, Footprints, BookOpen, Lightbulb } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCampaignSync } from '../../contexts/CampaignSyncContext';
import CombatStateBar from './CombatStateBar';
import { useParty } from '../../contexts/PartyContext';
import { rollDie, parseAndRollExpression } from '../../utils/dice';
import { computeConditionEffects } from '../../data/conditionEffects';
import { getExhaustionLevel, getExhaustionEffects } from '../../utils/exhaustionEffects';
import { getOverview, updateOverview } from '../../api/overview';
import { getAttacks, getConditions } from '../../api/combat';
import { getSpells, getSpellSlots, updateSpellSlots } from '../../api/spells';
import { getItems, updateItem, deleteItem } from '../../api/inventory';
import { getFeatures, updateFeature } from '../../api/features';
import { DEATH_SAVE_RULES, DEATH_SAVE_TRACKER_TEMPLATE } from '../../data/playerDeathSaves';
import { POST_COMBAT_CHECKLIST, RESOURCE_RECOVERY_QUICK_REF, getTriagePriority } from '../../data/playerCombatRecovery';
import { TURN_PHASES } from '../../data/playerTurnChecklist';
import { getClassCombatPrompts, SNEAK_ATTACK, DIVINE_SMITE, RAGE } from '../../data/playerClassFeatures';
import { calculateEffectiveSpeed, SPEED_MODIFIERS, resetMovementForTurn } from '../../data/playerMovementTracker';
import { getConcentrationDC } from '../../data/playerConcentration';
import { getAutoSuggestions } from '../../data/playerActionSuggestions';
import { KNOWLEDGE_SKILLS, KNOWLEDGE_DC_TABLE, CREATURE_TYPE_TIPS, getKnowledgeSkill, getKnowledgeRevealed } from '../../data/playerCreatureKnowledge';
import toast from 'react-hot-toast';

const GOLD = '#c9a84c';

const TABS = [
  { id: 'attack', label: 'Attack', icon: Swords, color: '#fca5a5' },
  { id: 'spells', label: 'Spells', icon: Wand2, color: '#c4b5fd' },
  { id: 'items', label: 'Items', icon: FlaskConical, color: '#86efac' },
  { id: 'features', label: 'Features', icon: Sparkles, color: '#fde68a' },
];

// Potion healing auto-detect
const POTION_HEALING = {
  'Potion of Healing': '2d4+2',
  'Potion of Greater Healing': '4d4+4',
  'Potion of Superior Healing': '8d4+8',
  'Potion of Supreme Healing': '10d4+20',
};

// Class resource detection by feature name patterns
const CLASS_RESOURCE_PATTERNS = [
  { pattern: /^rage$/i, name: 'Rage', recharge: 'long_rest' },
  { pattern: /^bardic inspiration$/i, name: 'Bardic Inspiration', recharge: 'short_rest' },
  { pattern: /^channel divinity$/i, name: 'Channel Divinity', recharge: 'short_rest' },
  { pattern: /^wild shape$/i, name: 'Wild Shape', recharge: 'short_rest' },
  { pattern: /^action surge$/i, name: 'Action Surge', recharge: 'short_rest' },
  { pattern: /^second wind$/i, name: 'Second Wind', recharge: 'short_rest' },
  { pattern: /^ki points?$/i, name: 'Ki Points', recharge: 'short_rest' },
  { pattern: /^lay on hands$/i, name: 'Lay on Hands', recharge: 'long_rest' },
  { pattern: /^sorcery points?$/i, name: 'Sorcery Points', recharge: 'long_rest' },
  { pattern: /^superiority dice?$/i, name: 'Superiority Dice', recharge: 'short_rest' },
];

const RECHARGE_COLORS = {
  short_rest: '#60a5fa',
  long_rest: '#a78bfa',
  dawn: '#fbbf24',
};

// Spell auto-effect lookup — maps lowercase spell name to mechanical effects
const SPELL_AUTO_EFFECTS = {
  'cure wounds': { type: 'heal', dice: level => `${level}d8`, addMod: true },
  'healing word': { type: 'heal', dice: level => `${level}d4`, addMod: true },
  'mass cure wounds': { type: 'heal', dice: () => '3d8', addMod: true, targets: 6 },
  'guiding bolt': { type: 'attack_damage', dice: '4d6', damageType: 'radiant' },
  'shield of faith': { type: 'buff', effect: '+2 AC', duration: 'concentration' },
  'bless': { type: 'buff', effect: '+1d4 to attacks & saves', duration: 'concentration', targets: 3 },
  'bane': { type: 'debuff', effect: '-1d4 to attacks & saves', duration: 'concentration', targets: 3 },
  'shield': { type: 'reaction_buff', effect: '+5 AC until next turn' },
  'hex': { type: 'debuff', effect: '+1d6 necrotic on hits', duration: 'concentration' },
  "hunter's mark": { type: 'buff', effect: '+1d6 on weapon hits', duration: 'concentration' },
  'hunters mark': { type: 'buff', effect: '+1d6 on weapon hits', duration: 'concentration' },
  'divine smite': { type: 'extra_damage', dice: level => `${level + 1}d8`, damageType: 'radiant' },
  'smite': { type: 'extra_damage', dice: level => `${level + 1}d8`, damageType: 'radiant' },
  'eldritch blast': { type: 'attack_damage', dice: '1d10', damageType: 'force' },
  'fire bolt': { type: 'attack_damage', dice: '1d10', damageType: 'fire' },
  'sacred flame': { type: 'save_damage', dice: '1d8', damageType: 'radiant' },
  'haste': { type: 'buff', effect: '+2 AC, doubled speed, extra action', duration: 'concentration' },
  'mirror image': { type: 'buff', effect: '3 duplicates (AC 10+DEX)' },
  'mage armor': { type: 'buff', effect: 'AC becomes 13+DEX' },
  'spiritual weapon': { type: 'summon_damage', dice: level => `${Math.floor(level / 2)}d8`, addMod: true, damageType: 'force' },
};

export default memo(function PlayerCombatHUD({ characterId }) {
  const { sendEvent, sharedCombatLog, sendConcentrationUpdate, isMyTurn, monsterHpTiers, turnFlash, combatActive, initiativeOrder, round } = useCampaignSync();
  const { myClientId } = useParty();

  // Self-load character data
  const [character, setCharacter] = useState(null);
  const [attacks, setAttacks] = useState([]);
  const [spells, setSpells] = useState([]);
  const [spellSlots, setSpellSlots] = useState([]);
  const [items, setItems] = useState([]);
  const [features, setFeatures] = useState([]);
  const [activeConditions, setActiveConditions] = useState([]);
  const [abilityScores, setAbilityScores] = useState([]);
  const [savingThrows, setSavingThrows] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [lastSpellResult, setLastSpellResult] = useState(null); // { spellName, effect, level }
  const [showRecoveryPanel, setShowRecoveryPanel] = useState(false);
  const [recoveryChecked, setRecoveryChecked] = useState({});

  useEffect(() => {
    if (!characterId) return;
    let cancelled = false;
    (async () => {
      try {
        const [ov, atk, sp, sl, it, ft, conds] = await Promise.all([
          getOverview(characterId).catch(() => null),
          getAttacks(characterId).catch(() => []),
          getSpells(characterId).catch(() => []),
          getSpellSlots(characterId).catch(() => []),
          getItems(characterId).catch(() => []),
          getFeatures(characterId).catch(() => []),
          getConditions(characterId).catch(() => []),
        ]);
        if (cancelled) return;
        setCharacter(ov?.overview || null);
        if (ov?.ability_scores) setAbilityScores(ov.ability_scores);
        if (ov?.saving_throws) setSavingThrows(ov.saving_throws);
        setAttacks(atk || []);
        setSpells(sp || []);
        setSpellSlots(sl || []);
        setItems(it || []);
        setFeatures(ft || []);
        const activeConds = (conds || []).filter(c => c.active).map(c => c.name);
        setActiveConditions(activeConds);
        setDataLoaded(true);
      } catch (e) {
        console.warn('PlayerCombatHUD: failed to load data', e);
      }
    })();
    return () => { cancelled = true; };
  }, [characterId]);

  // Compute condition effects
  const condEffects = useMemo(() => computeConditionEffects(activeConditions), [activeConditions]);

  // Compute exhaustion level
  const exhaustionLevel = useMemo(() => getExhaustionLevel(activeConditions), [activeConditions]);
  const exhaustionEffects = useMemo(() => getExhaustionEffects(exhaustionLevel), [exhaustionLevel]);

  // Reload data when turn starts (to get fresh spell slots, items, etc.)
  useEffect(() => {
    if (!isMyTurn || !characterId || !dataLoaded) return;
    (async () => {
      try {
        const [sl, it, ft, conds] = await Promise.all([
          getSpellSlots(characterId).catch(() => null),
          getItems(characterId).catch(() => null),
          getFeatures(characterId).catch(() => null),
          getConditions(characterId).catch(() => null),
        ]);
        if (sl) setSpellSlots(sl);
        if (it) setItems(it);
        if (ft) setFeatures(ft);
        if (conds) {
          const activeConds = conds.filter(c => c.active).map(c => c.name);
          setActiveConditions(activeConds);
        }
      } catch (e) { /* ignore */ }
    })();
  }, [isMyTurn, characterId, dataLoaded]);

  // Callback handlers for local data updates
  const onSpellSlotUsed = useCallback(async (level) => {
    const slot = spellSlots.find(s => s.slot_level === level);
    if (!slot) return;
    const updated = spellSlots.map(s =>
      s.slot_level === level ? { ...s, used_slots: s.used_slots + 1 } : s
    );
    setSpellSlots(updated);
    try { await updateSpellSlots(characterId, updated); } catch (e) { /* ignore */ }
  }, [spellSlots, characterId]);

  const onItemUsed = useCallback(async (item) => {
    if ((item.quantity || 1) <= 1) {
      setItems(prev => prev.filter(i => i.id !== item.id));
      try { await deleteItem(characterId, item.id); } catch (e) { /* ignore */ }
    } else {
      const updated = { ...item, quantity: (item.quantity || 1) - 1 };
      setItems(prev => prev.map(i => i.id === item.id ? updated : i));
      try { await updateItem(characterId, item.id, updated); } catch (e) { /* ignore */ }
    }
  }, [characterId]);

  const onFeatureUsed = useCallback(async (feature) => {
    const updated = { ...feature, uses_remaining: Math.max(0, (feature.uses_remaining || 0) - 1) };
    setFeatures(prev => prev.map(f => f.id === feature.id ? updated : f));
    try { await updateFeature(characterId, feature.id, updated); } catch (e) { /* ignore */ }
  }, [characterId]);

  const onEndTurn = useCallback(() => {
    sendEvent('player_end_turn', { player_name: character?.name || 'Player' });
  }, [sendEvent, character]);

  const [activeTab, setActiveTab] = useState('attack');
  const [actionUsed, setActionUsed] = useState(false);
  const [bonusActionUsed, setBonusActionUsed] = useState(false);
  const [reactionUsed, setReactionUsed] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [attackRoll, setAttackRoll] = useState(null); // { d20, bonus, total, isCrit, weapon }
  const [damageRoll, setDamageRoll] = useState(null); // { total, breakdown }
  const [shoveChoice, setShoveChoice] = useState(null); // 'prone' | 'push' | null (for shove sub-menu)
  const [grappleResult, setGrappleResult] = useState(null); // { roll, bonus, total, type }
  const [deathSaves, setDeathSaves] = useState({ ...DEATH_SAVE_TRACKER_TEMPLATE });
  const [showTurnChecklist, setShowTurnChecklist] = useState(false);
  const [checklistChecked, setChecklistChecked] = useState({});
  const [movementUsed, setMovementUsed] = useState(0);
  const [movementModifiers, setMovementModifiers] = useState([]);
  const [showClassPrompts, setShowClassPrompts] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCreatureKnowledge, setShowCreatureKnowledge] = useState(false);
  const [knowledgeCreatureType, setKnowledgeCreatureType] = useState('');
  const [knowledgeCheckResult, setKnowledgeCheckResult] = useState('');

  const playerName = character?.name || 'Player';

  // Class combat prompts
  const classCombatPrompts = useMemo(() => {
    if (!character) return [];
    const className = character.primary_class || character.class || '';
    const level = character.level || 1;
    return getClassCombatPrompts(className, level);
  }, [character]);

  // Movement tracking
  const baseSpeed = useMemo(() => {
    if (!character) return 30;
    return character.speed || 30;
  }, [character]);

  const effectiveSpeed = useMemo(() => {
    return calculateEffectiveSpeed(baseSpeed, movementModifiers);
  }, [baseSpeed, movementModifiers]);

  const remainingMovement = useMemo(() => {
    return Math.max(0, effectiveSpeed - movementUsed);
  }, [effectiveSpeed, movementUsed]);

  // Combat suggestions — context-aware action tips
  const combatSuggestions = useMemo(() => {
    if (!combatActive || !character) return [];
    const currentHp = character.current_hp ?? 0;
    const maxHp = character.max_hp ?? 1;
    const hpPercent = (currentHp / maxHp) * 100;
    // Detect allies down from initiative order (non-monster entries at 0 HP aren't directly available, so we approximate)
    const hasAllyDown = false; // No reliable cross-player HP data in player mode
    const isSurrounded = false; // Would need positional data
    const enemyHasCaster = false; // Would need monster type data
    const isFirstTurn = round === 1 && isMyTurn;
    // Approximate remaining spell slots
    const slotsRemaining = spellSlots.reduce((sum, s) => sum + Math.max(0, (s.max_slots || 0) - (s.used_slots || 0)), 0);
    return getAutoSuggestions(hpPercent, hasAllyDown, isSurrounded, enemyHasCaster, isFirstTurn, slotsRemaining);
  }, [combatActive, character, round, isMyTurn, spellSlots]);

  // Reset action economy on turn start
  useEffect(() => {
    if (isMyTurn) {
      setActionUsed(false);
      setBonusActionUsed(false);
      // Don't reset reaction — it resets on round start
      setAttackRoll(null);
      setDamageRoll(null);
      setLastSpellResult(null);
      setMovementUsed(0);
      setMovementModifiers([]);
    }
  }, [isMyTurn]);

  // Classify features into class resources vs regular features
  const { classResources, regularFeatures } = useMemo(() => {
    const resources = [];
    const regular = [];
    for (const feat of features) {
      const match = CLASS_RESOURCE_PATTERNS.find(p => p.pattern.test(feat.name));
      if (match) {
        resources.push({ ...feat, resourceName: match.name, recharge: match.recharge || feat.recharge });
      } else if ((feat.uses_total ?? 0) > 0) {
        regular.push(feat);
      }
    }
    return { classResources: resources, regularFeatures: regular };
  }, [features]);

  // Consumable items only
  const consumables = useMemo(() => {
    return items.filter(item =>
      item.item_type === 'consumable' ||
      item.type === 'consumable' ||
      Object.keys(POTION_HEALING).some(p => item.name?.toLowerCase().includes(p.toLowerCase()))
    );
  }, [items]);

  // Group spells by level
  const spellsByLevel = useMemo(() => {
    const groups = {};
    for (const spell of spells) {
      const level = spell.level ?? 0;
      if (!groups[level]) groups[level] = [];
      groups[level].push(spell);
    }
    return groups;
  }, [spells]);

  // Get slot info for a level
  const getSlotInfo = (level) => {
    const slot = spellSlots.find(s => s.slot_level === level);
    if (!slot) return { max: 0, used: 0, remaining: 0 };
    return { max: slot.max_slots, used: slot.used_slots, remaining: slot.max_slots - slot.used_slots };
  };

  // Attack handler
  const handleAttack = (weapon) => {
    // Condition checks
    if (condEffects.cantAct) {
      toast('Cannot act \u2014 Incapacitated!', { icon: '\u{1F6AB}', duration: 3000,
        style: { background: '#1a1015', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)', fontFamily: 'monospace' } });
      return;
    }
    if (condEffects.autoMissAttacks) {
      toast('Cannot attack \u2014 condition prevents it!', { icon: '\u{1F6AB}', duration: 3000,
        style: { background: '#1a1015', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)', fontFamily: 'monospace' } });
      return;
    }

    const bonus = parseInt(weapon.attack_bonus) || 0;
    const attackMode = condEffects.netAttackMode || 'normal';

    let d20, d20_second, modeLabel = '';
    if (attackMode === 'advantage') {
      const r1 = rollDie(20);
      const r2 = rollDie(20);
      d20 = Math.max(r1, r2);
      d20_second = Math.min(r1, r2);
      modeLabel = ' (ADV)';
    } else if (attackMode === 'disadvantage') {
      const r1 = rollDie(20);
      const r2 = rollDie(20);
      d20 = Math.min(r1, r2);
      d20_second = Math.max(r1, r2);
      modeLabel = ' (DIS)';
    } else {
      d20 = rollDie(20);
      d20_second = null;
    }

    const total = d20 + bonus;
    const isCrit = d20 === 20;
    const isFumble = d20 === 1;

    setAttackRoll({ d20, d20_second, bonus, total, isCrit, isFumble, weapon: weapon.name, attackMode });
    setActionUsed(true);

    const rollText = d20_second != null
      ? `[${attackMode === 'advantage' ? d20 : d20_second}, ${attackMode === 'advantage' ? d20_second : d20}]${modeLabel} keep ${d20}+${bonus}=${total}`
      : `${d20}+${bonus}=${total}`;

    // Auto-roll damage if hit (DM determines actual hit/miss)
    if (weapon.damage_dice) {
      const dmgResult = parseAndRollExpression(isCrit ? doubleDice(weapon.damage_dice) : weapon.damage_dice);
      if (dmgResult) {
        setDamageRoll({ total: dmgResult.total, breakdown: dmgResult.breakdownParts.join(' ') });

        sendEvent('player_attack', {
          player_name: playerName,
          weapon: weapon.name,
          attack_roll: total,
          d20,
          attack_mode: attackMode,
          damage_roll: dmgResult.total,
          damage_breakdown: dmgResult.breakdownParts.join(' '),
          is_crit: isCrit,
          is_fumble: isFumble,
          text: `${playerName} attacks with ${weapon.name}${modeLabel}: ${isCrit ? 'CRIT! ' : isFumble ? 'FUMBLE! ' : ''}${rollText} | ${isCrit ? 'CRIT DMG: ' : 'DMG: '}${dmgResult.total}`,
        });
      }
    } else {
      sendEvent('player_attack', {
        player_name: playerName,
        weapon: weapon.name,
        attack_roll: total,
        d20,
        attack_mode: attackMode,
        is_crit: isCrit,
        is_fumble: isFumble,
        text: `${playerName} attacks with ${weapon.name}${modeLabel}: ${isCrit ? 'CRIT! ' : isFumble ? 'FUMBLE! ' : ''}${rollText}`,
      });
    }

    const toastPrefix = attackMode !== 'normal' ? `${attackMode === 'advantage' ? 'ADV' : 'DIS'} ` : '';
    toast(
      `${isCrit ? 'CRITICAL HIT! ' : isFumble ? 'FUMBLE! ' : ''}${toastPrefix}${weapon.name}: ${d20}+${bonus} = ${total}`,
      {
        icon: isCrit ? '\u{1F3AF}' : isFumble ? '\u{1F4A8}' : '\u2694\uFE0F',
        duration: 4000,
        style: {
          background: isCrit ? '#1a1a10' : isFumble ? '#1a1015' : '#1a1520',
          color: isCrit ? '#fde68a' : isFumble ? '#fca5a5' : '#e8d9b5',
          border: `1px solid ${isCrit ? 'rgba(201,168,76,0.4)' : isFumble ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.15)'}`,
          fontFamily: 'monospace',
        },
      }
    );
  };

  // Cast spell handler
  const handleCastSpell = (spell, slotLevel) => {
    // Condition checks for spells that require attacks
    const isSpellAttack = spell.attack_type === 'ranged' || spell.attack_type === 'melee' || spell.requires_attack;
    if (condEffects.cantAct) {
      toast('Cannot act \u2014 Incapacitated!', { icon: '\u{1F6AB}', duration: 3000,
        style: { background: '#1a1015', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)', fontFamily: 'monospace' } });
      return;
    }

    const level = slotLevel || spell.level || 0;

    // Deduct slot for non-cantrips
    if (level > 0) {
      const slotInfo = getSlotInfo(level);
      if (slotInfo.remaining <= 0) {
        toast('No spell slots remaining at this level!', { icon: '\u26A0\uFE0F', duration: 2000 });
        return;
      }
      if (onSpellSlotUsed) onSpellSlotUsed(level);
      sendEvent('spell_slot_update', { slot_level: level, player_name: playerName });
    }

    // Handle concentration
    if (spell.concentration) {
      sendConcentrationUpdate(spell.name);
    }

    // Roll spell attack if applicable (with condition advantage/disadvantage)
    let attackInfo = '';
    if (isSpellAttack) {
      const spellMod = character?.spell_save_dc ? character.spell_save_dc - 8 : 0;
      const attackMode = condEffects.netAttackMode || 'normal';
      let d20, modeLabel = '';

      if (attackMode === 'advantage') {
        const r1 = rollDie(20);
        const r2 = rollDie(20);
        d20 = Math.max(r1, r2);
        modeLabel = ' ADV';
        attackInfo = ` | Attack${modeLabel}: [${r1},${r2}] keep ${d20}+${spellMod}=${d20 + spellMod}${d20 === 20 ? ' CRIT!' : ''}`;
      } else if (attackMode === 'disadvantage') {
        const r1 = rollDie(20);
        const r2 = rollDie(20);
        d20 = Math.min(r1, r2);
        modeLabel = ' DIS';
        attackInfo = ` | Attack${modeLabel}: [${r1},${r2}] keep ${d20}+${spellMod}=${d20 + spellMod}${d20 === 20 ? ' CRIT!' : ''}`;
      } else {
        d20 = rollDie(20);
        const total = d20 + spellMod;
        attackInfo = ` | Attack: ${d20}+${spellMod}=${total}${d20 === 20 ? ' CRIT!' : ''}`;
      }
    }

    // Roll damage if dice specified
    let damageInfo = '';
    if (spell.damage_dice) {
      const dmgResult = parseAndRollExpression(spell.damage_dice);
      if (dmgResult) {
        damageInfo = ` | Damage: ${dmgResult.total}`;
      }
    }

    // ── Spell Auto-Effects ──
    const spellKey = spell.name?.toLowerCase().trim();
    const autoEffect = SPELL_AUTO_EFFECTS[spellKey];
    let autoEffectInfo = '';

    if (autoEffect) {
      switch (autoEffect.type) {
        case 'heal': {
          const healDice = typeof autoEffect.dice === 'function' ? autoEffect.dice(level || 1) : autoEffect.dice;
          const healResult = parseAndRollExpression(healDice);
          if (healResult) {
            const modNote = autoEffect.addMod ? ' +mod' : '';
            autoEffectInfo = ` | Healing: ${healResult.total}${modNote} HP`;
            if (autoEffect.targets) {
              autoEffectInfo += ` (up to ${autoEffect.targets} targets)`;
            }
          }
          break;
        }
        case 'extra_damage': {
          const extraDice = typeof autoEffect.dice === 'function' ? autoEffect.dice(level || 1) : autoEffect.dice;
          const extraResult = parseAndRollExpression(extraDice);
          if (extraResult) {
            const dtype = autoEffect.damageType ? ` ${autoEffect.damageType}` : '';
            autoEffectInfo = ` | Extra Damage: ${extraResult.total}${dtype}`;
          }
          break;
        }
        case 'summon_damage': {
          const sumDice = typeof autoEffect.dice === 'function' ? autoEffect.dice(level || 1) : autoEffect.dice;
          const sumResult = parseAndRollExpression(sumDice);
          if (sumResult) {
            const modNote = autoEffect.addMod ? '+mod' : '';
            const dtype = autoEffect.damageType ? ` ${autoEffect.damageType}` : '';
            autoEffectInfo = ` | Damage: ${sumResult.total}${modNote}${dtype}`;
          }
          break;
        }
        case 'buff':
        case 'debuff':
        case 'reaction_buff': {
          autoEffectInfo = ` | Effect: ${autoEffect.effect}`;
          if (autoEffect.duration) autoEffectInfo += ` [${autoEffect.duration}]`;
          if (autoEffect.targets) autoEffectInfo += ` (up to ${autoEffect.targets} targets)`;
          break;
        }
        case 'attack_damage':
        case 'save_damage': {
          // Only add auto-effect damage if no damage_dice was already on the spell
          if (!spell.damage_dice) {
            const autoDice = typeof autoEffect.dice === 'function' ? autoEffect.dice(level || 1) : autoEffect.dice;
            const autoResult = parseAndRollExpression(autoDice);
            if (autoResult) {
              const dtype = autoEffect.damageType ? ` ${autoEffect.damageType}` : '';
              damageInfo = ` | Damage: ${autoResult.total}${dtype}`;
            }
          }
          break;
        }
        default:
          break;
      }
    }

    setActionUsed(true);

    // Apply healing spells locally
    let healApplied = 0;
    if (autoEffect?.type === 'heal') {
      const healDice = typeof autoEffect.dice === 'function' ? autoEffect.dice(level || 1) : autoEffect.dice;
      const healResult = parseAndRollExpression(healDice);
      if (healResult && character) {
        healApplied = healResult.total;
        const maxHp = character.max_hp || 999;
        const currentHp = character.current_hp || 0;
        const newHp = Math.min(maxHp, currentHp + healApplied);
        setCharacter(prev => ({ ...prev, current_hp: newHp }));
        updateOverview(characterId, { current_hp: newHp }).catch(() => {});
      }
    }

    // Store last spell result for inline display
    setLastSpellResult({
      spellName: spell.name,
      level,
      effect: autoEffectInfo || damageInfo || attackInfo || null,
      type: autoEffect?.type || (spell.damage_dice ? 'damage' : 'utility'),
      healApplied,
    });

    sendEvent('player_cast_spell', {
      player_name: playerName,
      spell_name: spell.name,
      slot_level: level,
      concentration: spell.concentration || false,
      auto_effect: autoEffect ? { type: autoEffect.type, effect: autoEffect.effect || null } : null,
      heal_applied: healApplied || undefined,
      text: `${playerName} casts ${spell.name}${level > 0 ? ` (Lv${level})` : ''}${attackInfo}${damageInfo}${autoEffectInfo}`,
    });

    const toastMsg = autoEffectInfo
      ? `Cast ${spell.name}${level > 0 ? ` (Lv${level})` : ''}${autoEffectInfo}`
      : `Cast ${spell.name}${level > 0 ? ` (Lv${level})` : ''}`;

    toast(toastMsg, {
      icon: autoEffect?.type === 'heal' ? '\u2764\uFE0F' : '\u2728',
      duration: autoEffectInfo ? 4000 : 3000,
      style: {
        background: autoEffect?.type === 'heal' ? '#101a15' : '#1a1520',
        color: autoEffect?.type === 'heal' ? '#86efac' : '#c4b5fd',
        border: `1px solid ${autoEffect?.type === 'heal' ? 'rgba(74,222,128,0.3)' : 'rgba(139,92,246,0.3)'}`,
        fontFamily: 'monospace', maxWidth: 400,
      },
    });
  };

  // Use item handler
  const handleUseItem = (item) => {
    const potionKey = Object.keys(POTION_HEALING).find(k =>
      item.name?.toLowerCase().includes(k.toLowerCase())
    );

    let healAmount = 0;
    if (potionKey) {
      // Auto-roll healing
      const healResult = parseAndRollExpression(POTION_HEALING[potionKey]);
      if (healResult) {
        healAmount = healResult.total;
        // Apply healing locally
        if (character) {
          const maxHp = character.max_hp || 999;
          const currentHp = character.current_hp || 0;
          const newHp = Math.min(maxHp, currentHp + healAmount);
          setCharacter(prev => ({ ...prev, current_hp: newHp }));
          // Persist HP update
          updateOverview(characterId, { current_hp: newHp }).catch(() => {});
        }
        toast(`${item.name}: Healed ${healAmount} HP! (${POTION_HEALING[potionKey]})`, {
          icon: '\u{1F9EA}', duration: 3000,
          style: { background: '#1a1520', color: '#86efac', border: '1px solid rgba(74,222,128,0.3)', fontFamily: 'monospace' },
        });
      }
    } else {
      toast(`Used ${item.name}`, {
        icon: '\u{1F9EA}', duration: 2000,
        style: { background: '#1a1520', color: '#86efac', border: '1px solid rgba(74,222,128,0.3)', fontFamily: 'monospace' },
      });
    }

    if (onItemUsed) onItemUsed(item);
    setBonusActionUsed(true); // Most item uses are bonus actions

    sendEvent('item_used', {
      player_name: playerName,
      item_name: item.name,
      healing: healAmount || undefined,
      text: healAmount
        ? `${playerName} uses ${item.name} — Healed ${healAmount} HP`
        : `${playerName} uses ${item.name}`,
    });
  };

  // Use feature handler
  const handleUseFeature = (feature) => {
    if ((feature.uses_remaining ?? 0) <= 0 && (feature.uses_total ?? 0) > 0) {
      toast(`${feature.name} has no uses remaining!`, { icon: '\u26A0\uFE0F', duration: 2000 });
      return;
    }

    if (onFeatureUsed) onFeatureUsed(feature);

    sendEvent('feature_use', {
      player_name: playerName,
      name: feature.name,
      uses_remaining: Math.max(0, (feature.uses_remaining ?? 1) - 1),
      text: `${playerName} uses ${feature.name}`,
    });

    toast(`Used ${feature.name}`, {
      icon: '\u26A1',
      duration: 2000,
      style: { background: '#1a1520', color: '#fde68a', border: '1px solid rgba(201,168,76,0.3)' },
    });
  };

  // End turn
  const handleEndTurn = () => {
    sendEvent('player_end_turn', { player_name: playerName });
    if (onEndTurn) onEndTurn();
    toast('Turn ended', { icon: '\u23ED\uFE0F', duration: 1500 });
  };

  // ── Death Save Roll Handler ──
  const handleDeathSaveRoll = useCallback(() => {
    if (deathSaves.stable || deathSaves.dead) return;

    const roll = rollDie(20);
    const updated = { ...deathSaves };

    if (roll === 20) {
      // Nat 20: regain 1 HP, reset death saves
      if (character) {
        const newHp = 1;
        setCharacter(prev => ({ ...prev, current_hp: newHp }));
        updateOverview(characterId, { current_hp: newHp }).catch(() => {});
      }
      setDeathSaves({ ...DEATH_SAVE_TRACKER_TEMPLATE });
      toast('NAT 20! Regained 1 HP!', {
        icon: '\u2728', duration: 4000,
        style: { background: '#1a1a10', color: '#fde68a', border: '1px solid rgba(201,168,76,0.4)', fontFamily: 'monospace' },
      });
      sendEvent('death_save_roll', { player_name: playerName, roll, result: 'nat20', successes: 0, failures: 0 });
      return;
    }

    if (roll === 1) {
      updated.failures = Math.min(3, updated.failures + 2);
    } else if (roll >= DEATH_SAVE_RULES.dc) {
      updated.successes = Math.min(3, updated.successes + 1);
    } else {
      updated.failures = Math.min(3, updated.failures + 1);
    }

    if (updated.successes >= 3) {
      updated.stable = true;
      toast('Stabilized!', {
        icon: '\u{1F6E1}\uFE0F', duration: 4000,
        style: { background: '#101a15', color: '#86efac', border: '1px solid rgba(74,222,128,0.3)', fontFamily: 'monospace' },
      });
    } else if (updated.failures >= 3) {
      updated.dead = true;
      toast('Character has died...', {
        icon: '\u{1F480}', duration: 5000,
        style: { background: '#1a1015', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.4)', fontFamily: 'monospace' },
      });
    } else {
      const isSuccess = roll >= DEATH_SAVE_RULES.dc;
      toast(`Death Save: ${roll} — ${isSuccess ? 'Success' : 'Failure'}${roll === 1 ? ' (2 failures!)' : ''}`, {
        icon: isSuccess ? '\u2705' : '\u274C', duration: 3000,
        style: { background: '#1a1015', color: isSuccess ? '#86efac' : '#fca5a5', border: `1px solid ${isSuccess ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}`, fontFamily: 'monospace' },
      });
    }

    setDeathSaves(updated);
    sendEvent('death_save_roll', { player_name: playerName, roll, result: roll === 1 ? 'nat1' : roll >= DEATH_SAVE_RULES.dc ? 'success' : 'failure', successes: updated.successes, failures: updated.failures, stable: updated.stable, dead: updated.dead });
  }, [deathSaves, character, characterId, playerName, sendEvent]);

  // Reset death saves when HP goes above 0
  useEffect(() => {
    if (character && (character.current_hp ?? 0) > 0) {
      setDeathSaves(prev => {
        if (prev.successes > 0 || prev.failures > 0 || prev.stable || prev.dead) {
          return { ...DEATH_SAVE_TRACKER_TEMPLATE };
        }
        return prev;
      });
    }
  }, [character?.current_hp]);

  // ── Grapple & Shove ──
  // Athletics bonus = STR mod + proficiency (if proficient)
  const athleticsBonus = useMemo(() => {
    if (!character) return 0;
    const strMod = character.str_mod ?? character.strength_mod ?? Math.floor(((character.str ?? character.strength ?? 10) - 10) / 2);
    const prof = character.proficiency_bonus ?? character.prof_bonus ?? 2;
    // Check if proficient in Athletics — look for it in skills or proficiencies
    const hasAthletics = character.athletics_proficient
      || character.skill_proficiencies?.includes?.('athletics')
      || character.skills?.athletics?.proficient;
    return strMod + (hasAthletics ? prof : 0);
  }, [character]);

  // Check if grapple/shove should be disabled
  const specialActionsDisabled = useMemo(() => {
    const incapacitated = activeConditions.some(c =>
      typeof c === 'string' ? /incapacitated|stunned/i.test(c) : /incapacitated|stunned/i.test(c.name || '')
    );
    return incapacitated || condEffects.cantAct;
  }, [activeConditions, condEffects]);

  const handleGrapple = () => {
    if (specialActionsDisabled) {
      toast('Cannot act \u2014 Incapacitated or Stunned!', { icon: '\u{1F6AB}', duration: 3000,
        style: { background: '#1a1015', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)', fontFamily: 'monospace' } });
      return;
    }
    const d20 = rollDie(20);
    const total = d20 + athleticsBonus;
    setGrappleResult({ roll: d20, bonus: athleticsBonus, total, type: 'grapple' });
    setActionUsed(true);

    sendEvent('player_grapple', {
      player_name: playerName,
      roll: total,
      d20,
      bonus: athleticsBonus,
      target: 'DM chooses',
      text: `${playerName} attempts to Grapple: Athletics ${d20}+${athleticsBonus}=${total}`,
    });

    toast(`Grapple: Athletics ${d20}+${athleticsBonus} = ${total}`, {
      icon: '\u{270A}', duration: 4000,
      style: { background: '#1a1520', color: '#f97316', border: '1px solid rgba(249,115,22,0.3)', fontFamily: 'monospace' },
    });
  };

  const handleShove = (effect) => {
    if (specialActionsDisabled) {
      toast('Cannot act \u2014 Incapacitated or Stunned!', { icon: '\u{1F6AB}', duration: 3000,
        style: { background: '#1a1015', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)', fontFamily: 'monospace' } });
      return;
    }
    const d20 = rollDie(20);
    const total = d20 + athleticsBonus;
    const effectLabel = effect === 'prone' ? 'Prone' : 'Push 5ft';
    setGrappleResult({ roll: d20, bonus: athleticsBonus, total, type: 'shove', effect });
    setShoveChoice(null);
    setActionUsed(true);

    sendEvent('player_shove', {
      player_name: playerName,
      roll: total,
      d20,
      bonus: athleticsBonus,
      effect,
      target: 'DM chooses',
      text: `${playerName} attempts to Shove (${effectLabel}): Athletics ${d20}+${athleticsBonus}=${total}`,
    });

    toast(`Shove (${effectLabel}): Athletics ${d20}+${athleticsBonus} = ${total}`, {
      icon: '\u{1F4A8}', duration: 4000,
      style: { background: '#1a1520', color: '#d97706', border: '1px solid rgba(217,119,6,0.3)', fontFamily: 'monospace' },
    });
  };

  // Helper: double dice for crits
  function doubleDice(diceStr) {
    return diceStr.replace(/(\d+)d(\d+)/g, (_, count, sides) => {
      return `${parseInt(count) * 2}d${sides}`;
    });
  }

  const containerStyle = {
    background: 'rgba(10,8,16,0.95)',
    backdropFilter: 'blur(20px)',
    border: `2px solid ${isMyTurn ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: 16,
    padding: 0,
    overflow: 'hidden',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div style={containerStyle}>
      {/* Turn Flash Banner */}
      <AnimatePresence>
        {turnFlash && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{
              padding: '10px 16px',
              background: 'linear-gradient(135deg, rgba(201,168,76,0.2) 0%, rgba(201,168,76,0.08) 100%)',
              borderBottom: '2px solid rgba(201,168,76,0.4)',
              textAlign: 'center',
              fontSize: 16, fontWeight: 800,
              color: '#c9a84c',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textShadow: '0 0 12px rgba(201,168,76,0.4)',
            }}
          >
            Your Turn!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Combat State Bar — initiative order + monster status */}
      <CombatStateBar />

      {/* Exhaustion Warning Banners */}
      {exhaustionLevel >= 3 && (
        <div style={{
          padding: '6px 12px',
          background: exhaustionLevel >= 5 ? 'rgba(168,85,247,0.12)' : 'rgba(239,68,68,0.1)',
          borderBottom: `1px solid ${exhaustionLevel >= 5 ? 'rgba(168,85,247,0.25)' : 'rgba(239,68,68,0.2)'}`,
          display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600,
          color: exhaustionLevel >= 5 ? '#c084fc' : '#fca5a5',
        }}>
          <AlertTriangle size={13} />
          <div>
            <div>{'\u26A0\uFE0F'} Exhaustion {exhaustionLevel}: Disadvantage on attacks</div>
            {exhaustionLevel >= 5 && (
              <div style={{ fontSize: 10, marginTop: 2, color: '#c084fc' }}>Speed: 0 — Cannot move</div>
            )}
          </div>
          {exhaustionLevel >= 3 && (
            <span style={{
              marginLeft: 'auto', fontSize: 8, padding: '2px 6px', borderRadius: 4,
              background: 'rgba(239,68,68,0.15)', color: '#fca5a5', fontWeight: 700,
            }}>
              ATK DIS
            </span>
          )}
        </div>
      )}

      {/* Condition Effects Banner */}
      {activeConditions.length > 0 && (
        <div style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.08)', borderBottom: '1px solid rgba(239,68,68,0.15)', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {activeConditions.map(c => (
            <span key={c} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(239,68,68,0.15)', color: '#fca5a5' }}>{c}</span>
          ))}
        </div>
      )}

      {/* Class Combat Prompts */}
      {classCombatPrompts.length > 0 && isMyTurn && (
        <div style={{
          padding: '6px 12px',
          background: 'rgba(201,168,76,0.06)',
          borderBottom: '1px solid rgba(201,168,76,0.15)',
          display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center',
        }}>
          <span style={{ fontSize: 8, fontWeight: 700, color: 'rgba(201,168,76,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: 4 }}>
            Class:
          </span>
          {classCombatPrompts.map(p => (
            <span key={p.type} style={{
              fontSize: 9, padding: '2px 8px', borderRadius: 4,
              background: p.type === 'sneak_attack' ? 'rgba(201,168,76,0.12)' : p.type === 'divine_smite' ? 'rgba(253,230,138,0.12)' : p.type === 'rage' ? 'rgba(239,68,68,0.12)' : 'rgba(249,115,22,0.12)',
              border: `1px solid ${p.type === 'sneak_attack' ? 'rgba(201,168,76,0.25)' : p.type === 'divine_smite' ? 'rgba(253,230,138,0.25)' : p.type === 'rage' ? 'rgba(239,68,68,0.25)' : 'rgba(249,115,22,0.25)'}`,
              color: p.type === 'sneak_attack' ? '#c9a84c' : p.type === 'divine_smite' ? '#fde68a' : p.type === 'rage' ? '#fca5a5' : '#f97316',
              fontWeight: 600,
            }}>
              {p.label}
            </span>
          ))}
        </div>
      )}

      {/* Combat Suggestions Panel — context-aware tips during active combat */}
      {combatActive && combatSuggestions.length > 0 && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '0 12px' }}>
          <button
            onClick={() => setShowSuggestions(p => !p)}
            title="Toggle combat suggestions"
            style={{
              background: 'none', border: 'none', cursor: 'pointer', width: '100%',
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 0',
              color: '#fbbf24', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-heading)',
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}
          >
            <Lightbulb size={13} />
            Combat Suggestions
            <span style={{ marginLeft: 4, fontSize: 9, fontWeight: 600, padding: '1px 5px', borderRadius: 4, background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>
              {combatSuggestions.length}
            </span>
            <ChevronRight size={9} style={{ marginLeft: 'auto', transform: showSuggestions ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
          </button>
          {showSuggestions && (
            <div style={{ paddingBottom: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {combatSuggestions.map((s, i) => {
                const priorityColor = { critical: '#f87171', high: '#fb923c', medium: '#facc15' }[s.priority] || '#999';
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 8, padding: '5px 8px',
                    borderRadius: 6, background: 'rgba(251,191,36,0.04)',
                    border: '1px solid rgba(251,191,36,0.1)',
                  }}>
                    <span style={{
                      fontSize: 7, fontWeight: 700, padding: '2px 5px', borderRadius: 3, flexShrink: 0, marginTop: 1,
                      background: `${priorityColor}20`, color: priorityColor, textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>
                      {s.priority}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#e8d9b5' }}>{s.action}</div>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginTop: 1, lineHeight: 1.3 }}>{s.reason}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Death Save Tracker Panel — shown at 0 HP */}
      {character && (character.current_hp ?? 1) <= 0 && (
        <div style={{
          padding: 12,
          background: 'linear-gradient(135deg, rgba(127,29,29,0.25) 0%, rgba(80,20,20,0.15) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Skull size={16} style={{ color: '#fca5a5' }} />
            <span style={{ fontSize: 13, fontWeight: 800, color: '#fca5a5', fontFamily: 'var(--font-heading)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Death Saves
            </span>
            {deathSaves.stable && (
              <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', color: '#86efac' }}>
                STABLE
              </span>
            )}
            {deathSaves.dead && (
              <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5' }}>
                DEAD
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            {/* Successes */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 9, fontWeight: 600, color: 'rgba(74,222,128,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pass</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <div key={`s${i}`} style={{
                    width: 14, height: 14, borderRadius: '50%',
                    background: i < deathSaves.successes ? '#4ade80' : 'rgba(74,222,128,0.12)',
                    border: `2px solid ${i < deathSaves.successes ? '#22c55e' : 'rgba(74,222,128,0.25)'}`,
                    transition: 'all 0.2s',
                  }} />
                ))}
              </div>
            </div>

            {/* Failures */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 9, fontWeight: 600, color: 'rgba(239,68,68,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fail</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <div key={`f${i}`} style={{
                    width: 14, height: 14, borderRadius: '50%',
                    background: i < deathSaves.failures ? '#ef4444' : 'rgba(239,68,68,0.12)',
                    border: `2px solid ${i < deathSaves.failures ? '#dc2626' : 'rgba(239,68,68,0.25)'}`,
                    transition: 'all 0.2s',
                  }} />
                ))}
              </div>
            </div>
          </div>

          {/* Roll button */}
          {!deathSaves.stable && !deathSaves.dead && (
            <button
              onClick={handleDeathSaveRoll}
              title="Roll a death saving throw (d20, DC 10)"
              style={{
                width: '100%', padding: '8px 12px', borderRadius: 6,
                background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#fca5a5', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'var(--font-heading)', letterSpacing: '0.05em',
                transition: 'all 0.15s',
              }}
            >
              Roll Death Save (d20, DC {DEATH_SAVE_RULES.dc})
            </button>
          )}

          {/* Rules reminder */}
          <div style={{ marginTop: 6, fontSize: 8, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', textAlign: 'center' }}>
            DC {DEATH_SAVE_RULES.dc} | Nat 20: regain 1 HP | Nat 1: 2 failures
          </div>
        </div>
      )}

      {/* Action Economy Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: 12,
        background: isMyTurn ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.02)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-heading)', marginRight: 4 }}>
          Actions:
        </span>
        {[
          { label: 'Action', used: actionUsed, set: setActionUsed, color: '#c9a84c' },
          { label: 'Bonus', used: bonusActionUsed, set: setBonusActionUsed, color: '#60a5fa' },
          { label: 'Reaction', used: reactionUsed, set: setReactionUsed, color: '#f472b6' },
        ].map(({ label, used, set, color }) => (
          <button
            key={label}
            onClick={() => set(!used)}
            title={`${label}: ${used ? 'Used (click to reset)' : 'Available (click to mark used)'}`}
            style={{
              padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600,
              background: used ? 'rgba(255,255,255,0.03)' : `${color}15`,
              border: `1px solid ${used ? 'rgba(255,255,255,0.06)' : `${color}35`}`,
              color: used ? 'rgba(255,255,255,0.2)' : color,
              cursor: 'pointer', fontFamily: 'var(--font-heading)',
              textDecoration: used ? 'line-through' : 'none',
              opacity: used ? 0.5 : 1,
              transition: 'all 0.15s',
            }}
          >
            {label}
          </button>
        ))}

        {/* Movement Tracker */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          marginLeft: 8, paddingLeft: 8,
          borderLeft: '1px solid rgba(255,255,255,0.08)',
        }}>
          <Footprints size={11} style={{ color: remainingMovement > 0 ? '#4ade80' : 'rgba(255,255,255,0.2)' }} />
          <span style={{
            fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-mono, monospace)',
            color: remainingMovement > 0 ? '#4ade80' : 'rgba(255,255,255,0.3)',
          }}>
            {remainingMovement}/{effectiveSpeed}ft
          </span>
          {remainingMovement > 0 && (
            <button
              onClick={() => setMovementUsed(prev => Math.min(prev + 5, effectiveSpeed))}
              style={{
                padding: '2px 5px', borderRadius: 4, fontSize: 8, fontWeight: 600,
                background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)',
                color: '#4ade80', cursor: 'pointer',
              }}
              title="Move 5ft"
            >
              -5ft
            </button>
          )}
        </div>

        <div style={{ flex: 1 }} />

        <button
          onClick={handleEndTurn}
          title="End your turn"
          style={{
            padding: '8px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
            background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.35)',
            color: GOLD, cursor: 'pointer', fontFamily: 'var(--font-heading)',
            letterSpacing: '0.05em',
            transition: 'all 0.15s',
          }}
        >
          End Turn
        </button>

        {/* Turn Checklist Button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowTurnChecklist(!showTurnChecklist);
              if (!showTurnChecklist) setChecklistChecked({});
            }}
            title="Toggle turn checklist"
            style={{
              padding: '8px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
              background: showTurnChecklist ? 'rgba(96,165,250,0.15)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${showTurnChecklist ? 'rgba(96,165,250,0.35)' : 'rgba(255,255,255,0.1)'}`,
              color: showTurnChecklist ? '#60a5fa' : 'var(--text-mute, rgba(255,255,255,0.4))',
              cursor: 'pointer', fontFamily: 'var(--font-heading)',
              display: 'flex', alignItems: 'center', gap: 4,
              transition: 'all 0.15s',
            }}
          >
            <ClipboardList size={11} /> Checklist
          </button>

          {/* Turn Checklist Dropdown */}
          {showTurnChecklist && (
            <div style={{
              position: 'absolute', top: '110%', right: 0, zIndex: 50,
              width: 280, maxHeight: 340, overflowY: 'auto',
              background: 'rgba(10,8,16,0.97)', border: '1px solid rgba(96,165,250,0.25)',
              borderRadius: 10, padding: 12,
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            }}>
              {/* Start of Turn */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, fontFamily: 'var(--font-heading)' }}>
                  {TURN_PHASES[0].label}
                </div>
                <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', marginBottom: 6, fontStyle: 'italic' }}>
                  {TURN_PHASES[0].description}
                </div>
                {TURN_PHASES[0].checks.map(check => (
                  <label
                    key={check.id}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 8, padding: '4px 0', cursor: 'pointer',
                    }}
                  >
                    <div
                      onClick={() => setChecklistChecked(prev => ({ ...prev, [check.id]: !prev[check.id] }))}
                      style={{
                        width: 14, height: 14, borderRadius: 3, flexShrink: 0, marginTop: 1,
                        background: checklistChecked[check.id] ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${checklistChecked[check.id] ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.15)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      {checklistChecked[check.id] && <Check size={10} style={{ color: '#4ade80' }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: checklistChecked[check.id] ? 'rgba(255,255,255,0.3)' : '#e8d9b5', textDecoration: checklistChecked[check.id] ? 'line-through' : 'none' }}>
                        {check.label}
                      </div>
                      <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', marginTop: 1 }}>
                        {check.detail}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginBottom: 10 }} />

              {/* End of Turn */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#f472b6', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, fontFamily: 'var(--font-heading)' }}>
                  {TURN_PHASES[2].label}
                </div>
                <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', marginBottom: 6, fontStyle: 'italic' }}>
                  {TURN_PHASES[2].description}
                </div>
                {TURN_PHASES[2].checks.map(check => (
                  <label
                    key={check.id}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 8, padding: '4px 0', cursor: 'pointer',
                    }}
                  >
                    <div
                      onClick={() => setChecklistChecked(prev => ({ ...prev, [check.id]: !prev[check.id] }))}
                      style={{
                        width: 14, height: 14, borderRadius: 3, flexShrink: 0, marginTop: 1,
                        background: checklistChecked[check.id] ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${checklistChecked[check.id] ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.15)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      {checklistChecked[check.id] && <Check size={10} style={{ color: '#4ade80' }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: checklistChecked[check.id] ? 'rgba(255,255,255,0.3)' : '#e8d9b5', textDecoration: checklistChecked[check.id] ? 'line-through' : 'none' }}>
                        {check.label}
                      </div>
                      <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', marginTop: 1 }}>
                        {check.detail}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div style={{
        display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 8px',
      }}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={`Switch to ${tab.label} tab`}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                padding: '9px 8px', fontSize: 11, fontWeight: 600,
                background: active ? 'rgba(201,168,76,0.08)' : 'transparent',
                borderBottom: active ? `2px solid ${GOLD}` : '2px solid transparent',
                color: active ? GOLD : 'var(--text-mute, rgba(255,255,255,0.3))',
                cursor: 'pointer', border: 'none',
                fontFamily: 'var(--font-heading)', letterSpacing: '0.03em',
                transition: 'all 0.15s',
              }}
            >
              <Icon size={13} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 12, minHeight: 120, maxHeight: 300 }}>

        {/* ATTACK TAB */}
        {activeTab === 'attack' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {attacks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 20, color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>
                No attacks configured. Add weapons in your Inventory.
              </div>
            ) : attacks.map((weapon, i) => (
              <button
                key={weapon.id || i}
                onClick={() => handleAttack(weapon)}
                disabled={actionUsed}
                title={`Attack with ${weapon.name}: +${weapon.attack_bonus || 0} to hit, ${weapon.damage_dice || 'no damage dice'}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 12px', borderRadius: 6,
                  background: actionUsed ? 'rgba(255,255,255,0.01)' : 'rgba(239,68,68,0.06)',
                  border: `1px solid ${actionUsed ? 'rgba(255,255,255,0.04)' : 'rgba(239,68,68,0.15)'}`,
                  cursor: actionUsed ? 'default' : 'pointer',
                  opacity: actionUsed ? 0.4 : 1,
                  textAlign: 'left', width: '100%',
                  fontSize: 11, fontWeight: 600,
                  transition: 'all 0.15s',
                }}
              >
                <Swords size={14} style={{ color: '#fca5a5', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#e8d9b5' }}>{weapon.name}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
                    +{weapon.attack_bonus || 0} to hit | {weapon.damage_dice || '\u2014'} {weapon.damage_type || ''}
                    {weapon.range ? ` | ${weapon.range}` : ''}
                  </div>
                </div>
                <div style={{ fontSize: 9, color: 'rgba(201,168,76,0.5)', fontWeight: 600, flexShrink: 0 }}>
                  ATTACK
                </div>
              </button>
            ))}

            {/* Attack result display */}
            {attackRoll && (
              <div style={{
                padding: '8px 12px', borderRadius: 6, marginTop: 4,
                background: attackRoll.isCrit ? 'rgba(201,168,76,0.1)' : attackRoll.isFumble ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${attackRoll.isCrit ? 'rgba(201,168,76,0.3)' : attackRoll.isFumble ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.06)'}`,
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: attackRoll.isCrit ? '#fde68a' : attackRoll.isFumble ? '#fca5a5' : '#e8d9b5', marginBottom: 4 }}>
                  {attackRoll.isCrit ? 'CRITICAL HIT!' : attackRoll.isFumble ? 'FUMBLE!' : `Attack: ${attackRoll.total}`}
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono, monospace)' }}>
                  d20: {attackRoll.d20} + {attackRoll.bonus} = {attackRoll.total}
                </div>
                {damageRoll && (
                  <div style={{ fontSize: 10, color: '#fca5a5', fontFamily: 'var(--font-mono, monospace)', marginTop: 2 }}>
                    Damage: {damageRoll.total} ({damageRoll.breakdown})
                  </div>
                )}
              </div>
            )}

            {/* ── Special Actions: Grapple & Shove ── */}
            <div style={{ marginTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
              <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(249,115,22,0.5)', marginBottom: 6, fontFamily: 'var(--font-heading)' }}>
                Special Actions
              </div>
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', marginBottom: 6, fontStyle: 'italic' }}>
                Contested Athletics vs. Athletics or Acrobatics
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {/* Grapple button */}
                <button
                  onClick={handleGrapple}
                  disabled={actionUsed || specialActionsDisabled}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '8px 12px', borderRadius: 6,
                    background: (actionUsed || specialActionsDisabled) ? 'rgba(255,255,255,0.01)' : 'rgba(249,115,22,0.06)',
                    border: `1px solid ${(actionUsed || specialActionsDisabled) ? 'rgba(255,255,255,0.04)' : 'rgba(249,115,22,0.2)'}`,
                    cursor: (actionUsed || specialActionsDisabled) ? 'default' : 'pointer',
                    opacity: (actionUsed || specialActionsDisabled) ? 0.4 : 1,
                    fontSize: 11, fontWeight: 600, color: '#f97316',
                    transition: 'all 0.15s',
                  }}
                  title={specialActionsDisabled ? 'Cannot act while Incapacitated or Stunned' : 'Grapple: contested Athletics check'}
                >
                  <Hand size={13} /> Grapple
                  <span style={{ fontSize: 8, color: 'rgba(249,115,22,0.5)', fontWeight: 400 }}>+{athleticsBonus}</span>
                </button>

                {/* Shove button */}
                <div style={{ flex: 1, position: 'relative' }}>
                  <button
                    onClick={() => setShoveChoice(shoveChoice ? null : 'picking')}
                    disabled={actionUsed || specialActionsDisabled}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      padding: '8px 12px', borderRadius: 6,
                      background: (actionUsed || specialActionsDisabled) ? 'rgba(255,255,255,0.01)' : 'rgba(217,119,6,0.06)',
                      border: `1px solid ${(actionUsed || specialActionsDisabled) ? 'rgba(255,255,255,0.04)' : 'rgba(217,119,6,0.2)'}`,
                      cursor: (actionUsed || specialActionsDisabled) ? 'default' : 'pointer',
                      opacity: (actionUsed || specialActionsDisabled) ? 0.4 : 1,
                      fontSize: 11, fontWeight: 600, color: '#d97706',
                      transition: 'all 0.15s',
                    }}
                    title={specialActionsDisabled ? 'Cannot act while Incapacitated or Stunned' : 'Shove: choose Prone or Push 5ft'}
                  >
                    <ArrowRight size={13} /> Shove
                    <span style={{ fontSize: 8, color: 'rgba(217,119,6,0.5)', fontWeight: 400 }}>+{athleticsBonus}</span>
                  </button>

                  {/* Shove sub-menu: Prone or Push */}
                  {shoveChoice === 'picking' && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, zIndex: 10,
                      display: 'flex', gap: 4, padding: '6px', borderRadius: 6,
                      background: 'rgba(10,8,16,0.95)', border: '1px solid rgba(217,119,6,0.25)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                    }}>
                      <button
                        onClick={() => handleShove('prone')}
                        title="Shove target prone"
                        style={{
                          flex: 1, padding: '8px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                          background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.25)',
                          color: '#d97706', cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        Prone
                      </button>
                      <button
                        onClick={() => handleShove('push')}
                        title="Shove target 5 feet away"
                        style={{
                          flex: 1, padding: '8px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                          background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.25)',
                          color: '#d97706', cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        Push 5ft
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Grapple/Shove result display */}
              {grappleResult && (
                <div style={{
                  padding: '8px 12px', borderRadius: 6, marginTop: 6,
                  background: grappleResult.type === 'grapple' ? 'rgba(249,115,22,0.08)' : 'rgba(217,119,6,0.08)',
                  border: `1px solid ${grappleResult.type === 'grapple' ? 'rgba(249,115,22,0.2)' : 'rgba(217,119,6,0.2)'}`,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: grappleResult.type === 'grapple' ? '#f97316' : '#d97706', marginBottom: 2 }}>
                    {grappleResult.type === 'grapple' ? 'Grapple' : `Shove (${grappleResult.effect === 'prone' ? 'Prone' : 'Push 5ft'})`} — Athletics: {grappleResult.total}
                  </div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono, monospace)' }}>
                    d20: {grappleResult.roll} + {grappleResult.bonus} = {grappleResult.total}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SPELLS TAB */}
        {activeTab === 'spells' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Spell slot display */}
            {spellSlots.filter(s => s.max_slots > 0).length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
                {spellSlots.filter(s => s.max_slots > 0).map(slot => {
                  const remaining = slot.max_slots - slot.used_slots;
                  return (
                    <div key={slot.slot_level} style={{
                      display: 'flex', alignItems: 'center', gap: 3,
                      padding: '3px 6px', borderRadius: 5,
                      background: remaining > 0 ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.03)',
                      border: `1px solid ${remaining > 0 ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.08)'}`,
                    }}>
                      <span style={{ fontSize: 9, color: remaining > 0 ? '#c4b5fd' : 'rgba(196,181,253,0.3)', fontWeight: 600 }}>
                        Lv{slot.slot_level}
                      </span>
                      <span style={{ display: 'flex', gap: 3 }}>
                        {Array.from({ length: slot.max_slots }, (_, i) => (
                          <div key={i} style={{
                            width: 8, height: 8, borderRadius: '50%',
                            background: i < remaining ? '#a78bfa' : 'rgba(167,139,250,0.15)',
                            border: `1px solid ${i < remaining ? 'rgba(167,139,250,0.5)' : 'rgba(167,139,250,0.25)'}`,
                            transition: 'all 0.2s',
                          }} />
                        ))}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Cantrips */}
            {spellsByLevel[0]?.length > 0 && (
              <>
                <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', color: 'rgba(196,181,253,0.4)', letterSpacing: '0.08em' }}>Cantrips</div>
                {spellsByLevel[0].map((spell, i) => (
                  <button
                    key={spell.id || i}
                    onClick={() => handleCastSpell(spell, 0)}
                    title={`Cast ${spell.name} (cantrip)${spell.concentration ? ' — Concentration' : ''}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                      padding: '8px 12px', borderRadius: 6,
                      background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.1)',
                      cursor: 'pointer', textAlign: 'left',
                      fontSize: 11, fontWeight: 600,
                      transition: 'all 0.15s',
                    }}
                  >
                    <Wand2 size={11} style={{ color: '#c4b5fd', flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: '#e8d9b5', flex: 1 }}>{spell.name}</span>
                    {spell.concentration && <span style={{ fontSize: 7, color: '#60a5fa', fontWeight: 600 }}>CONC</span>}
                    <span style={{ fontSize: 9, color: 'rgba(196,181,253,0.4)', fontWeight: 600, flexShrink: 0 }}>CAST</span>
                  </button>
                ))}
              </>
            )}

            {/* Leveled spells */}
            {Object.keys(spellsByLevel).filter(l => l > 0).sort((a, b) => a - b).map(level => {
              const slotInfo = getSlotInfo(parseInt(level));
              return (
                <div key={level}>
                  <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', color: 'rgba(196,181,253,0.4)', letterSpacing: '0.08em', marginBottom: 4 }}>
                    Level {level} ({slotInfo.remaining}/{slotInfo.max} slots)
                  </div>
                  {spellsByLevel[level].map((spell, i) => (
                    <button
                      key={spell.id || i}
                      onClick={() => handleCastSpell(spell, parseInt(level))}
                      disabled={slotInfo.remaining <= 0}
                      title={`Cast ${spell.name} (Level ${level})${spell.concentration ? ' — Concentration' : ''}${slotInfo.remaining <= 0 ? ' — No slots remaining' : ''}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                        padding: '8px 12px', borderRadius: 6, marginBottom: 3,
                        background: slotInfo.remaining > 0 ? 'rgba(139,92,246,0.04)' : 'rgba(255,255,255,0.01)',
                        border: `1px solid ${slotInfo.remaining > 0 ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.04)'}`,
                        cursor: slotInfo.remaining > 0 ? 'pointer' : 'default',
                        opacity: slotInfo.remaining > 0 ? 1 : 0.4,
                        textAlign: 'left',
                        fontSize: 11, fontWeight: 600,
                        transition: 'all 0.15s',
                      }}
                    >
                      <Wand2 size={11} style={{ color: '#c4b5fd', flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: '#e8d9b5', flex: 1 }}>{spell.name}</span>
                      {spell.concentration && <span style={{ fontSize: 7, color: '#60a5fa', fontWeight: 600 }}>CONC</span>}
                      <span style={{ fontSize: 8, color: 'rgba(196,181,253,0.4)' }}>{spell.school || ''}</span>
                      <span style={{ fontSize: 9, color: slotInfo.remaining > 0 ? 'rgba(196,181,253,0.4)' : 'rgba(255,255,255,0.15)', fontWeight: 600, flexShrink: 0 }}>CAST</span>
                    </button>
                  ))}
                </div>
              );
            })}

            {/* Last spell result display */}
            {lastSpellResult && (
              <div style={{
                padding: '8px 12px', borderRadius: 6, marginTop: 6,
                background: lastSpellResult.type === 'heal' ? 'rgba(74,222,128,0.08)' : 'rgba(139,92,246,0.08)',
                border: `1px solid ${lastSpellResult.type === 'heal' ? 'rgba(74,222,128,0.2)' : 'rgba(139,92,246,0.2)'}`,
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: lastSpellResult.type === 'heal' ? '#86efac' : '#c4b5fd', marginBottom: 2 }}>
                  {lastSpellResult.spellName}{lastSpellResult.level > 0 ? ` (Lv${lastSpellResult.level})` : ''}
                </div>
                {lastSpellResult.effect && (
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono, monospace)' }}>
                    {lastSpellResult.effect}
                  </div>
                )}
                {lastSpellResult.healApplied > 0 && (
                  <div style={{ fontSize: 9, color: '#86efac', fontFamily: 'var(--font-mono, monospace)', marginTop: 2 }}>
                    Applied {lastSpellResult.healApplied} HP healing
                  </div>
                )}
              </div>
            )}

            {spells.length === 0 && (
              <div style={{ textAlign: 'center', padding: 20, color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>
                No spells known. Add spells in your Spellbook.
              </div>
            )}
          </div>
        )}

        {/* ITEMS TAB */}
        {activeTab === 'items' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {consumables.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 20, color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>
                No consumable items. Add potions or scrolls in your Inventory.
              </div>
            ) : consumables.map((item, i) => (
              <button
                key={item.id || i}
                onClick={() => handleUseItem(item)}
                disabled={(item.quantity ?? 1) <= 0}
                title={`Use ${item.name} (${item.quantity ?? 1} remaining)`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                  padding: '8px 12px', borderRadius: 6,
                  background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.12)',
                  cursor: (item.quantity ?? 1) > 0 ? 'pointer' : 'default',
                  opacity: (item.quantity ?? 1) > 0 ? 1 : 0.4,
                  textAlign: 'left',
                  fontSize: 11, fontWeight: 600,
                  transition: 'all 0.15s',
                }}
              >
                <FlaskConical size={12} style={{ color: '#86efac', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: '#e8d9b5' }}>{item.name}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>
                    {(() => {
                      const potionKey = Object.keys(POTION_HEALING).find(k => item.name?.toLowerCase().includes(k.toLowerCase()));
                      if (potionKey) return `Heals ${POTION_HEALING[potionKey]} HP`;
                      if (item.description) return item.description.slice(0, 60) + (item.description.length > 60 ? '\u2026' : '');
                      return null;
                    })()}
                  </div>
                </div>
                <span style={{ fontSize: 10, color: 'rgba(74,222,128,0.6)', fontWeight: 600, marginRight: 4 }}>
                  x{item.quantity ?? 1}
                </span>
                <span style={{ fontSize: 9, color: 'rgba(74,222,128,0.4)', fontWeight: 600, flexShrink: 0 }}>USE</span>
              </button>
            ))}
          </div>
        )}

        {/* FEATURES TAB */}
        {activeTab === 'features' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Class Resources */}
            {classResources.length > 0 && (
              <>
                <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', color: 'rgba(253,230,138,0.4)', letterSpacing: '0.08em' }}>Class Resources</div>
                {classResources.map((feat, i) => {
                  const rechargeColor = RECHARGE_COLORS[feat.recharge] || '#c9a84c';
                  return (
                    <div key={feat.id || i} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 12px', borderRadius: 6,
                      background: 'rgba(253,230,138,0.03)', border: '1px solid rgba(253,230,138,0.1)',
                    }}>
                      <Zap size={12} style={{ color: '#fde68a', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, color: '#e8d9b5', fontWeight: 600 }}>{feat.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                          {/* Resource pips */}
                          {(feat.uses_total ?? 0) <= 10 ? (
                            <span style={{ display: 'flex', gap: 3 }}>
                              {Array.from({ length: feat.uses_total ?? 0 }, (_, j) => (
                                <div key={j} style={{
                                  width: 8, height: 8, borderRadius: '50%',
                                  background: j < (feat.uses_remaining ?? 0) ? rechargeColor : `${rechargeColor}25`,
                                  border: `1px solid ${rechargeColor}50`,
                                  transition: 'all 0.2s',
                                }} />
                              ))}
                            </span>
                          ) : (
                            <span style={{ fontSize: 10, color: rechargeColor, fontWeight: 600 }}>
                              {feat.uses_remaining ?? 0}/{feat.uses_total ?? 0}
                            </span>
                          )}
                          <span style={{ fontSize: 7, color: rechargeColor, padding: '1px 4px', borderRadius: 3, background: `${rechargeColor}15`, fontWeight: 600, marginLeft: 4 }}>
                            {feat.recharge === 'short_rest' ? 'SHORT' : feat.recharge === 'long_rest' ? 'LONG' : 'DAWN'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUseFeature(feat)}
                        disabled={(feat.uses_remaining ?? 0) <= 0}
                        title={`Use ${feat.name} (${feat.uses_remaining ?? 0}/${feat.uses_total ?? 0} remaining)`}
                        style={{
                          padding: '8px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                          background: (feat.uses_remaining ?? 0) > 0 ? 'rgba(253,230,138,0.1)' : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${(feat.uses_remaining ?? 0) > 0 ? 'rgba(253,230,138,0.25)' : 'rgba(255,255,255,0.06)'}`,
                          color: (feat.uses_remaining ?? 0) > 0 ? '#fde68a' : 'rgba(255,255,255,0.2)',
                          cursor: (feat.uses_remaining ?? 0) > 0 ? 'pointer' : 'default',
                          transition: 'all 0.15s',
                        }}
                      >
                        Use
                      </button>
                    </div>
                  );
                })}
              </>
            )}

            {/* Regular Features */}
            {regularFeatures.length > 0 && (
              <>
                <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', color: 'rgba(253,230,138,0.4)', letterSpacing: '0.08em', marginTop: classResources.length > 0 ? 4 : 0 }}>Features</div>
                {regularFeatures.map((feat, i) => (
                  <div key={feat.id || i} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 12px', borderRadius: 6,
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <Sparkles size={11} style={{ color: 'rgba(253,230,138,0.5)', flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: '#e8d9b5', flex: 1 }}>{feat.name}</span>
                    <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>
                      {feat.uses_remaining ?? 0}/{feat.uses_total ?? 0}
                    </span>
                    <button
                      onClick={() => handleUseFeature(feat)}
                      disabled={(feat.uses_remaining ?? 0) <= 0}
                      title={`Use ${feat.name} (${feat.uses_remaining ?? 0}/${feat.uses_total ?? 0} remaining)`}
                      style={{
                        padding: '8px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                        background: (feat.uses_remaining ?? 0) > 0 ? 'rgba(253,230,138,0.08)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${(feat.uses_remaining ?? 0) > 0 ? 'rgba(253,230,138,0.2)' : 'rgba(255,255,255,0.06)'}`,
                        color: (feat.uses_remaining ?? 0) > 0 ? '#fde68a' : 'rgba(255,255,255,0.15)',
                        cursor: (feat.uses_remaining ?? 0) > 0 ? 'pointer' : 'default',
                        transition: 'all 0.15s',
                      }}
                    >
                      Use
                    </button>
                  </div>
                ))}
              </>
            )}

            {classResources.length === 0 && regularFeatures.length === 0 && (
              <div style={{ textAlign: 'center', padding: 20, color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>
                No features with charges. Add features in Features & Traits.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Character Quick-View Stats Drawer */}
      {character && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => setShowStats(!showStats)}
            title="Toggle character stats"
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '6px 12px', background: showStats ? 'rgba(96,165,250,0.06)' : 'none',
              border: 'none', cursor: 'pointer',
              color: 'var(--text-mute, rgba(255,255,255,0.4))', fontSize: 9, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.08em',
              fontFamily: 'var(--font-heading)',
              transition: 'all 0.15s',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <User size={10} /> Character Stats
            </span>
            {showStats ? <ChevronUp size={9} /> : <ChevronDown size={9} />}
          </button>
          {showStats && (
            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* AC, Speed, HP row */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <div style={{
                  padding: '4px 10px', borderRadius: 6,
                  background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.15)',
                  fontSize: 10, color: '#60a5fa', fontWeight: 600,
                }}>
                  <Shield size={9} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
                  AC {character.armor_class ?? 10}
                </div>
                <div style={{
                  padding: '4px 10px', borderRadius: 6,
                  background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)',
                  fontSize: 10, color: '#4ade80', fontWeight: 600,
                }}>
                  Speed {character.speed ?? 30}ft
                </div>
                <div style={{
                  padding: '4px 10px', borderRadius: 6,
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
                  fontSize: 10, color: '#fca5a5', fontWeight: 600,
                }}>
                  <Heart size={9} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
                  {character.current_hp ?? 0}/{character.max_hp ?? 0}
                  {(character.temp_hp ?? 0) > 0 && <span style={{ color: '#60a5fa' }}> +{character.temp_hp}</span>}
                </div>
              </div>

              {/* Ability Scores — compact grid */}
              {abilityScores.length > 0 && (
                <div>
                  <div style={{ fontSize: 8, fontWeight: 600, textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', marginBottom: 4 }}>Ability Scores</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4 }}>
                    {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map(ab => {
                      const entry = abilityScores.find(a => a.ability?.toUpperCase()?.startsWith(ab.slice(0, 3)));
                      const score = entry?.score ?? 10;
                      const mod = Math.floor((score - 10) / 2);
                      return (
                        <div key={ab} style={{
                          textAlign: 'center', padding: '4px 2px', borderRadius: 5,
                          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                        }}>
                          <div style={{ fontSize: 7, fontWeight: 700, color: 'rgba(201,168,76,0.5)', letterSpacing: '0.05em' }}>{ab}</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#e8d9b5' }}>{mod >= 0 ? `+${mod}` : mod}</div>
                          <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)' }}>{score}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Saving Throw Proficiencies */}
              {savingThrows.length > 0 && (
                <div>
                  <div style={{ fontSize: 8, fontWeight: 600, textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', marginBottom: 4 }}>Saving Throws</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {savingThrows.map(st => {
                      const abbr = st.ability?.slice(0, 3)?.toUpperCase() || '???';
                      return (
                        <span key={st.ability} style={{
                          padding: '2px 6px', borderRadius: 4, fontSize: 9, fontWeight: 600,
                          background: st.proficient ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${st.proficient ? 'rgba(201,168,76,0.25)' : 'rgba(255,255,255,0.06)'}`,
                          color: st.proficient ? '#c9a84c' : 'rgba(255,255,255,0.2)',
                        }}>
                          {abbr}{st.proficient ? ' \u2713' : ''}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Active Conditions */}
              {activeConditions.length > 0 && (
                <div>
                  <div style={{ fontSize: 8, fontWeight: 600, textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', marginBottom: 4 }}>Active Conditions</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {activeConditions.map(c => (
                      <span key={c} style={{
                        padding: '2px 6px', borderRadius: 4, fontSize: 9, fontWeight: 600,
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                        color: '#fca5a5',
                      }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Enemies HP Tiers */}
      {Object.keys(monsterHpTiers).length > 0 && (
        <div style={{ padding: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 9, color: 'var(--text-mute, rgba(255,255,255,0.4))', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Enemies</div>
          {Object.values(monsterHpTiers).filter(m => m.tier !== 'dead').map(m => (
            <div key={m.monster_id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 0' }}>
              <Skull size={10} style={{ color: m.tier_color }} />
              <span style={{ fontSize: 12, color: '#e8d9b5' }}>{m.name}</span>
              <span style={{ fontSize: 10, color: m.tier_color, fontStyle: 'italic' }}>{m.tier_label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Creature Knowledge Panel — only during combat */}
      {combatActive && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '0 12px' }}>
          <button
            onClick={() => setShowCreatureKnowledge(p => !p)}
            title="Toggle creature knowledge panel"
            style={{
              background: 'none', border: 'none', cursor: 'pointer', width: '100%',
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 0',
              color: showCreatureKnowledge ? '#a78bfa' : 'var(--text-mute, rgba(255,255,255,0.3))',
              fontSize: 9, fontWeight: 700, fontFamily: 'var(--font-heading)',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              transition: 'all 0.15s',
            }}
          >
            <BookOpen size={13} />
            Creature Knowledge
            <ChevronRight size={9} style={{ marginLeft: 'auto', transform: showCreatureKnowledge ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
          </button>
          {showCreatureKnowledge && (
            <div style={{ paddingBottom: 10 }}>
              {/* Creature type selector */}
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>
                  Creature Type
                </label>
                <select
                  value={knowledgeCreatureType}
                  onChange={e => { setKnowledgeCreatureType(e.target.value); setKnowledgeCheckResult(''); }}
                  style={{
                    width: '100%', padding: '5px 8px', borderRadius: 6, fontSize: 11,
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#e8d9b5', fontFamily: 'var(--font-mono, monospace)',
                    cursor: 'pointer', outline: 'none',
                  }}
                >
                  <option value="" style={{ background: '#1a1015' }}>-- Select type --</option>
                  {KNOWLEDGE_SKILLS.map(k => (
                    <option key={k.creatureType} value={k.creatureType} style={{ background: '#1a1015' }}>
                      {k.creatureType} ({k.skill})
                    </option>
                  ))}
                </select>
              </div>

              {/* Skill to roll indicator */}
              {knowledgeCreatureType && (() => {
                const skill = getKnowledgeSkill(knowledgeCreatureType);
                const entry = KNOWLEDGE_SKILLS.find(k => k.creatureType === knowledgeCreatureType);
                const tip = CREATURE_TYPE_TIPS[knowledgeCreatureType];
                return (
                  <div style={{
                    padding: '6px 10px', borderRadius: 6, marginBottom: 8,
                    background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)',
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#c4b5fd', marginBottom: 2 }}>
                      Roll: {skill}
                    </div>
                    {entry && (
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginBottom: tip ? 4 : 0 }}>
                        Examples: {entry.examples}
                      </div>
                    )}
                    {tip && (
                      <div style={{ fontSize: 9, color: '#fde68a', fontStyle: 'italic', lineHeight: 1.4 }}>
                        {tip}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Check result input */}
              {knowledgeCreatureType && (
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>
                    Check Result
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={knowledgeCheckResult}
                    onChange={e => setKnowledgeCheckResult(e.target.value)}
                    placeholder="Enter roll total..."
                    style={{
                      width: '100%', padding: '5px 8px', borderRadius: 6, fontSize: 11,
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                      color: '#e8d9b5', fontFamily: 'var(--font-mono, monospace)',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
              )}

              {/* Revealed knowledge tiers */}
              {knowledgeCheckResult && (() => {
                const result = parseInt(knowledgeCheckResult, 10);
                if (isNaN(result)) return null;
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {KNOWLEDGE_DC_TABLE.map(tier => {
                      const unlocked = result >= tier.dc;
                      return (
                        <div key={tier.dc} style={{
                          padding: '5px 8px', borderRadius: 6,
                          background: unlocked ? 'rgba(134,239,172,0.06)' : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${unlocked ? 'rgba(134,239,172,0.2)' : 'rgba(255,255,255,0.05)'}`,
                          opacity: unlocked ? 1 : 0.4,
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                            <span style={{
                              fontSize: 9, fontWeight: 800, color: unlocked ? '#86efac' : 'rgba(255,255,255,0.25)',
                              minWidth: 30,
                            }}>
                              DC {tier.dc}
                            </span>
                            {unlocked && <Check size={10} style={{ color: '#86efac' }} />}
                          </div>
                          <div style={{ fontSize: 10, color: unlocked ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)', lineHeight: 1.4 }}>
                            {tier.reveals}
                          </div>
                          {unlocked && (
                            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', marginTop: 2, lineHeight: 1.4 }}>
                              {tier.example}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* Combat Log toggle */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '4px 12px',
      }}>
        <button
          onClick={() => setShowLog(!showLog)}
          title="Toggle combat log"
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '4px 0', background: 'none', border: 'none',
            color: 'var(--text-mute, rgba(255,255,255,0.3))', fontSize: 9, fontWeight: 600, cursor: 'pointer',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            transition: 'all 0.15s',
          }}
        >
          <span>Combat Log ({(sharedCombatLog || []).length})</span>
          <ChevronRight size={9} style={{ transform: showLog ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
        </button>
        {showLog && (
          <div style={{ maxHeight: 120, overflowY: 'auto', paddingBottom: 6 }}>
            {(sharedCombatLog || []).length === 0 ? (
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.15)', textAlign: 'center', padding: 8 }}>No combat events yet</div>
            ) : (sharedCombatLog || []).slice().reverse().map((entry, i) => (
              <div key={i} style={{
                fontSize: 9, color: 'rgba(255,255,255,0.4)', padding: '2px 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                fontFamily: 'var(--font-mono, monospace)',
              }}>
                {entry.text}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post-Combat Recovery Panel */}
      {!combatActive && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '0 12px' }}>
          <button
            onClick={() => setShowRecoveryPanel(p => !p)}
            title="Toggle post-combat recovery checklist"
            style={{
              background: 'none', border: 'none', cursor: 'pointer', width: '100%',
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 0',
              color: GOLD, fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-heading)',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              transition: 'all 0.15s',
            }}
          >
            <ClipboardList size={13} />
            Post-Combat Recovery
            <ChevronRight size={9} style={{ marginLeft: 'auto', transform: showRecoveryPanel ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
          </button>
          {showRecoveryPanel && (
            <div style={{ paddingBottom: 10 }}>
              {/* Checklist — first 5 items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 8 }}>
                {POST_COMBAT_CHECKLIST.slice(0, 5).map(item => {
                  const priorityColor = { critical: '#f87171', high: '#fb923c', medium: '#facc15', low: 'rgba(255,255,255,0.35)' }[item.priority] || '#999';
                  return (
                    <label key={item.step} style={{
                      display: 'flex', alignItems: 'center', gap: 6, fontSize: 10,
                      color: recoveryChecked[item.step] ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.7)',
                      textDecoration: recoveryChecked[item.step] ? 'line-through' : 'none',
                      cursor: 'pointer', padding: '2px 0',
                    }}>
                      <input
                        type="checkbox"
                        checked={!!recoveryChecked[item.step]}
                        onChange={() => setRecoveryChecked(prev => ({ ...prev, [item.step]: !prev[item.step] }))}
                        style={{ accentColor: priorityColor, width: 12, height: 12, cursor: 'pointer' }}
                      />
                      <span style={{ color: priorityColor, fontWeight: 700, minWidth: 6, fontSize: 9 }}>{'\u25CF'}</span>
                      <span style={{ flex: 1 }}>{item.label}</span>
                      <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.description}
                      </span>
                    </label>
                  );
                })}
              </div>
              {/* Short Rest Recovery Reference */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 6 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#60a5fa', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Short Rest Recovery
                </div>
                <ul style={{ margin: 0, paddingLeft: 14, listStyle: 'disc' }}>
                  {RESOURCE_RECOVERY_QUICK_REF.shortRest.map((line, i) => (
                    <li key={i} style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', padding: '1px 0', lineHeight: 1.4 }}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
})
