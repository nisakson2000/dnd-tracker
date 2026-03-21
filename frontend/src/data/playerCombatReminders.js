/**
 * playerCombatReminders.js
 * Player Mode: Smart combat reminder system — contextual prompts during combat
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// PRE-TURN REMINDERS (shown at start of turn)
// ---------------------------------------------------------------------------

export const PRE_TURN_REMINDERS = [
  {
    id: 'rage_maintenance',
    check: (state) => state.isRaging && !state.attackedLastTurn && !state.tookDamageLastTurn,
    message: 'Rage ends if you don\'t attack or take damage!',
    priority: 'high',
    color: '#ef4444',
  },
  {
    id: 'concentration_active',
    check: (state) => !!state.concentrationSpell,
    message: (state) => `Concentrating on: ${state.concentrationSpell}`,
    priority: 'info',
    color: '#60a5fa',
  },
  {
    id: 'low_hp_warning',
    check: (state) => state.hpPercent > 0 && state.hpPercent <= 25,
    message: 'HP critically low! Consider healing, disengaging, or using a potion.',
    priority: 'high',
    color: '#ef4444',
  },
  {
    id: 'no_spell_slots',
    check: (state) => state.isCaster && state.totalSlotsRemaining === 0,
    message: 'All spell slots expended. Cantrips and non-spell abilities only.',
    priority: 'medium',
    color: '#fbbf24',
  },
  {
    id: 'conditions_active',
    check: (state) => state.conditions && state.conditions.length > 0,
    message: (state) => `Active conditions: ${state.conditions.join(', ')}`,
    priority: 'medium',
    color: '#fbbf24',
  },
  {
    id: 'bonus_action_available',
    check: (state) => state.hasBonusActionFeature && !state.bonusActionUsed,
    message: 'Bonus action available! (Cunning Action, Martial Arts, etc.)',
    priority: 'info',
    color: '#4ade80',
  },
];

// ---------------------------------------------------------------------------
// POST-ATTACK REMINDERS
// ---------------------------------------------------------------------------

export const POST_ATTACK_REMINDERS = [
  {
    id: 'sneak_attack_eligible',
    check: (state) => state.isRogue && state.attackHit && !state.sneakAttackUsed && (state.hasAdvantage || state.allyAdjacent),
    message: (state) => `Sneak Attack! Add ${state.sneakAttackDice} to damage.`,
    priority: 'high',
    color: '#c9a84c',
  },
  {
    id: 'smite_available',
    check: (state) => state.isPaladin && state.attackHit && state.meleeAttack && state.hasSlotsRemaining,
    message: 'Divine Smite available! Expend a spell slot for extra radiant damage.',
    priority: 'high',
    color: '#fde68a',
  },
  {
    id: 'gwm_crit_kill',
    check: (state) => state.hasGWM && (state.isCrit || state.targetKilled) && state.heavyWeapon,
    message: 'GWM: Bonus action melee attack available!',
    priority: 'high',
    color: '#f97316',
  },
  {
    id: 'hex_damage',
    check: (state) => state.hasHex && state.attackHit,
    message: 'Hex: Add 1d6 necrotic damage!',
    priority: 'medium',
    color: '#a855f7',
  },
  {
    id: 'hunters_mark_damage',
    check: (state) => state.hasHuntersMark && state.attackHit,
    message: "Hunter's Mark: Add 1d6 damage!",
    priority: 'medium',
    color: '#22c55e',
  },
];

/**
 * Get applicable pre-turn reminders.
 */
export function getPreTurnReminders(characterState) {
  return PRE_TURN_REMINDERS
    .filter(r => r.check(characterState))
    .map(r => ({
      id: r.id,
      message: typeof r.message === 'function' ? r.message(characterState) : r.message,
      priority: r.priority,
      color: r.color,
    }));
}

/**
 * Get applicable post-attack reminders.
 */
export function getPostAttackReminders(characterState) {
  return POST_ATTACK_REMINDERS
    .filter(r => r.check(characterState))
    .map(r => ({
      id: r.id,
      message: typeof r.message === 'function' ? r.message(characterState) : r.message,
      priority: r.priority,
      color: r.color,
    }));
}
