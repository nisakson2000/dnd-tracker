/**
 * playerCombatLog.js
 * Player Mode Improvements 121-140 (combat narration subset): Combat log formatting
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// COMBAT EVENT TYPES
// ---------------------------------------------------------------------------

export const COMBAT_EVENT_TYPES = {
  attack_hit: { icon: 'swords', color: '#fca5a5', label: 'Attack Hit' },
  attack_miss: { icon: 'shield', color: '#6b7280', label: 'Attack Miss' },
  attack_crit: { icon: 'zap', color: '#fde68a', label: 'Critical Hit!' },
  attack_fumble: { icon: 'alert-triangle', color: '#ef4444', label: 'Fumble!' },
  spell_cast: { icon: 'wand', color: '#c4b5fd', label: 'Spell Cast' },
  spell_damage: { icon: 'flame', color: '#f97316', label: 'Spell Damage' },
  heal: { icon: 'heart', color: '#4ade80', label: 'Healing' },
  damage_taken: { icon: 'heart-crack', color: '#ef4444', label: 'Damage Taken' },
  save_success: { icon: 'check', color: '#4ade80', label: 'Save Success' },
  save_failure: { icon: 'x', color: '#ef4444', label: 'Save Failed' },
  condition_applied: { icon: 'alert-circle', color: '#fbbf24', label: 'Condition Applied' },
  condition_removed: { icon: 'check-circle', color: '#4ade80', label: 'Condition Removed' },
  death_save: { icon: 'skull', color: '#a855f7', label: 'Death Save' },
  turn_start: { icon: 'play', color: '#c9a84c', label: 'Turn Start' },
  turn_end: { icon: 'skip-forward', color: '#6b7280', label: 'Turn End' },
  item_used: { icon: 'flask', color: '#86efac', label: 'Item Used' },
  feature_used: { icon: 'sparkles', color: '#fde68a', label: 'Feature Used' },
  movement: { icon: 'footprints', color: '#60a5fa', label: 'Movement' },
};

// ---------------------------------------------------------------------------
// COMBAT NARRATION TEMPLATES
// ---------------------------------------------------------------------------

export const ATTACK_NARRATIONS = {
  hit: [
    '{attacker} strikes {target} with their {weapon}!',
    '{attacker}\'s {weapon} connects solidly with {target}.',
    'A clean hit! {attacker} lands a blow on {target}.',
  ],
  miss: [
    '{attacker}\'s {weapon} swings wide of {target}.',
    '{target} narrowly avoids {attacker}\'s strike.',
    '{attacker}\'s attack glances harmlessly off {target}\'s defenses.',
  ],
  crit: [
    'CRITICAL! {attacker} finds a devastating opening in {target}\'s defense!',
    '{attacker} strikes true — a perfect blow with {weapon}!',
    'A devastating critical hit from {attacker}!',
  ],
  fumble: [
    '{attacker} stumbles badly, completely missing {target}!',
    '{attacker}\'s {weapon} slips from their grip mid-swing!',
    'A terrible miss! {attacker}\'s attack goes wildly off target.',
  ],
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Generate a combat narration for an attack.
 */
export function narrateAttack(attacker, target, weapon, result) {
  const templates = ATTACK_NARRATIONS[result] || ATTACK_NARRATIONS.hit;
  return pick(templates)
    .replace('{attacker}', attacker || 'The attacker')
    .replace('{target}', target || 'the enemy')
    .replace('{weapon}', weapon || 'weapon');
}

// ---------------------------------------------------------------------------
// COMBAT LOG ENTRY TEMPLATE
// ---------------------------------------------------------------------------

export const COMBAT_LOG_ENTRY = {
  id: null,
  timestamp: null,
  round: 0,
  type: '',          // key from COMBAT_EVENT_TYPES
  actor: '',
  target: '',
  description: '',
  details: null,     // { roll, modifier, total, damage, etc. }
  narration: null,   // flavorful text
};

/**
 * Create a formatted combat log entry.
 */
export function createLogEntry(type, actor, description, details = null) {
  const eventType = COMBAT_EVENT_TYPES[type];
  return {
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    timestamp: Date.now(),
    type,
    actor,
    description,
    details,
    color: eventType?.color || '#6b7280',
    icon: eventType?.icon || 'circle',
    label: eventType?.label || type,
  };
}
