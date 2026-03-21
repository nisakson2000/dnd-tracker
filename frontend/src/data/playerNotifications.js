/**
 * Player Notification Templates — Automated Alerts & Prompts
 *
 * Covers roadmap items 415-422 (Player Notifications — Your turn, Concentration check,
 * Spell slot recovered, Feature recharged, Low HP warning, Death save, Legendary action).
 */

// ── Notification Types ──
export const NOTIFICATION_TYPES = {
  yourTurn: {
    id: 'your_turn',
    label: 'Your Turn!',
    priority: 'high',
    sound: 'turn_start',
    icon: 'sword',
    color: '#fbbf24',
    autoFade: 0, // don't auto-fade — player must acknowledge
    template: 'It\'s your turn, {playerName}! You have {actions} available.',
  },
  concentrationCheck: {
    id: 'concentration_check',
    label: 'Concentration Check!',
    priority: 'high',
    sound: 'alert',
    icon: 'zap',
    color: '#f97316',
    autoFade: 0,
    template: '{playerName}, you took {damage} damage while concentrating on {spellName}. DC {dc} Constitution save required.',
  },
  lowHP: {
    id: 'low_hp',
    label: 'Low HP Warning',
    priority: 'medium',
    sound: 'warning',
    icon: 'heart',
    color: '#ef4444',
    autoFade: 5000,
    template: '{playerName} is at {currentHP}/{maxHP} HP ({percentage}%). Be careful!',
    threshold: 0.25,
  },
  deathSave: {
    id: 'death_save',
    label: 'Death Save Needed',
    priority: 'critical',
    sound: 'death_save',
    icon: 'skull',
    color: '#7f1d1d',
    autoFade: 0,
    template: '{playerName} is at 0 HP! Death saving throw required. Successes: {successes}/3, Failures: {failures}/3.',
  },
  slotRecovered: {
    id: 'slot_recovered',
    label: 'Spell Slot Recovered',
    priority: 'low',
    sound: 'positive',
    icon: 'sparkles',
    color: '#818cf8',
    autoFade: 5000,
    template: 'Spell slots recovered after {restType}! You now have: {slots}.',
  },
  featureRecharged: {
    id: 'feature_recharged',
    label: 'Feature Recharged',
    priority: 'low',
    sound: 'positive',
    icon: 'refresh-cw',
    color: '#22c55e',
    autoFade: 5000,
    template: '{featureName} has recharged after {restType}!',
  },
  legendaryAction: {
    id: 'legendary_action',
    label: 'Legendary Action Incoming!',
    priority: 'high',
    sound: 'boss',
    icon: 'crown',
    color: '#fbbf24',
    autoFade: 3000,
    template: '{bossName} uses a Legendary Action: {actionName}!',
  },
  conditionApplied: {
    id: 'condition_applied',
    label: 'Condition Applied',
    priority: 'medium',
    sound: 'debuff',
    icon: 'alert-triangle',
    color: '#eab308',
    autoFade: 5000,
    template: '{playerName} is now {condition}! {effects}',
  },
  conditionRemoved: {
    id: 'condition_removed',
    label: 'Condition Removed',
    priority: 'low',
    sound: 'positive',
    icon: 'check-circle',
    color: '#22c55e',
    autoFade: 3000,
    template: '{playerName} is no longer {condition}.',
  },
  combatStart: {
    id: 'combat_start',
    label: 'Roll Initiative!',
    priority: 'high',
    sound: 'combat_start',
    icon: 'swords',
    color: '#ef4444',
    autoFade: 0,
    template: 'Combat begins! Roll initiative!',
  },
  combatEnd: {
    id: 'combat_end',
    label: 'Combat Over',
    priority: 'medium',
    sound: 'victory',
    icon: 'flag',
    color: '#22c55e',
    autoFade: 5000,
    template: 'Combat is over! {summary}',
  },
  criticalHit: {
    id: 'critical_hit',
    label: 'CRITICAL HIT!',
    priority: 'medium',
    sound: 'critical',
    icon: 'zap',
    color: '#fbbf24',
    autoFade: 3000,
    template: '{attackerName} scored a critical hit on {targetName}! Double damage dice!',
  },
  naturalOne: {
    id: 'natural_one',
    label: 'Natural 1!',
    priority: 'medium',
    sound: 'fumble',
    icon: 'frown',
    color: '#6b7280',
    autoFade: 3000,
    template: '{attackerName} rolled a natural 1. Automatic miss!',
  },
  inspiration: {
    id: 'inspiration',
    label: 'Inspiration Gained!',
    priority: 'low',
    sound: 'positive',
    icon: 'star',
    color: '#fbbf24',
    autoFade: 5000,
    template: '{playerName} gained Inspiration! Use it for advantage on one attack, save, or check.',
  },
};

// ── Sound Effect Mapping ──
export const SOUND_EFFECTS = {
  turn_start: { file: 'turn-bell.mp3', volume: 0.6 },
  alert: { file: 'alert.mp3', volume: 0.7 },
  warning: { file: 'warning.mp3', volume: 0.5 },
  death_save: { file: 'heartbeat.mp3', volume: 0.8 },
  positive: { file: 'chime.mp3', volume: 0.4 },
  boss: { file: 'boss-action.mp3', volume: 0.7 },
  debuff: { file: 'debuff.mp3', volume: 0.5 },
  combat_start: { file: 'combat-drums.mp3', volume: 0.6 },
  victory: { file: 'victory.mp3', volume: 0.6 },
  critical: { file: 'critical-hit.mp3', volume: 0.8 },
  fumble: { file: 'fumble.mp3', volume: 0.5 },
};

// ── Notification Priority Order ──
export const PRIORITY_ORDER = ['critical', 'high', 'medium', 'low'];

/**
 * Create a notification from a template.
 */
export function createNotification(typeId, data = {}) {
  const template = NOTIFICATION_TYPES[typeId];
  if (!template) return null;

  let text = template.template;
  for (const [key, value] of Object.entries(data)) {
    text = text.replace(`{${key}}`, value);
  }
  // Remove any unreplaced placeholders
  text = text.replace(/\{[^}]+\}/g, '');

  return {
    id: `${typeId}-${Date.now()}`,
    type: typeId,
    label: template.label,
    text,
    priority: template.priority,
    icon: template.icon,
    color: template.color,
    sound: template.sound,
    autoFade: template.autoFade,
    timestamp: new Date().toISOString(),
    dismissed: false,
  };
}

/**
 * Check if low HP notification should fire.
 */
export function checkLowHP(currentHP, maxHP) {
  const threshold = NOTIFICATION_TYPES.lowHP.threshold;
  const percentage = currentHP / maxHP;
  return percentage <= threshold && currentHP > 0;
}

/**
 * Sort notifications by priority.
 */
export function sortByPriority(notifications) {
  return [...notifications].sort((a, b) => {
    return PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority);
  });
}

/**
 * Get notification type config.
 */
export function getNotificationType(typeId) {
  return NOTIFICATION_TYPES[typeId] || null;
}

/**
 * Get all notification types for settings UI.
 */
export function getAllNotificationTypes() {
  return Object.entries(NOTIFICATION_TYPES).map(([key, n]) => ({
    id: key,
    label: n.label,
    priority: n.priority,
    sound: n.sound,
    autoFade: n.autoFade,
  }));
}
