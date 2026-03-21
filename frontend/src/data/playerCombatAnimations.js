/**
 * playerCombatAnimations.js
 * Player Mode: Visual feedback descriptions for combat events
 * Pure JS — no React dependencies.
 */

export const DAMAGE_TYPE_EFFECTS = {
  fire: { color: '#ff5722', glow: '#ff8a50', particle: '🔥', animation: 'pulse-red', description: 'Flames lick across the target' },
  cold: { color: '#81d4fa', glow: '#b3e5fc', particle: '❄️', animation: 'pulse-blue', description: 'Frost crackles and spreads' },
  lightning: { color: '#ffeb3b', glow: '#fff176', particle: '⚡', animation: 'flash-yellow', description: 'Electric arcs surge through' },
  radiant: { color: '#fff176', glow: '#ffffff', particle: '✨', animation: 'glow-gold', description: 'Divine light blazes forth' },
  necrotic: { color: '#4a148c', glow: '#7b1fa2', particle: '💀', animation: 'fade-dark', description: 'Dark energy withers the target' },
  psychic: { color: '#ce93d8', glow: '#e1bee7', particle: '🧠', animation: 'shimmer-purple', description: 'The target clutches their head' },
  thunder: { color: '#90caf9', glow: '#bbdefb', particle: '💥', animation: 'shake', description: 'A thunderous boom erupts' },
  acid: { color: '#76ff03', glow: '#b2ff59', particle: '🧪', animation: 'drip-green', description: 'Acid sizzles and corrodes' },
  poison: { color: '#69f0ae', glow: '#a5d6a7', particle: '☠️', animation: 'pulse-green', description: 'Toxic fumes seep in' },
  force: { color: '#e040fb', glow: '#ea80fc', particle: '💫', animation: 'ripple', description: 'Pure magical force strikes' },
  bludgeoning: { color: '#9e9e9e', glow: '#bdbdbd', particle: '🔨', animation: 'impact', description: 'A crushing blow lands' },
  piercing: { color: '#bcaaa4', glow: '#d7ccc8', particle: '🗡️', animation: 'stab', description: 'The blade finds its mark' },
  slashing: { color: '#a1887f', glow: '#bcaaa4', particle: '⚔️', animation: 'slash', description: 'Steel cleaves through' },
};

export const COMBAT_EVENT_EFFECTS = {
  criticalHit: { emoji: '💥', color: '#ff1744', animation: 'screen-shake', sound: 'crit_hit' },
  criticalMiss: { emoji: '😬', color: '#9e9e9e', animation: 'fumble', sound: 'miss' },
  killShot: { emoji: '☠️', color: '#f44336', animation: 'fade-out', sound: 'kill' },
  healingReceived: { emoji: '💚', color: '#4caf50', animation: 'glow-green', sound: 'heal' },
  buffApplied: { emoji: '⬆️', color: '#2196f3', animation: 'arrow-up', sound: 'buff' },
  debuffApplied: { emoji: '⬇️', color: '#ff9800', animation: 'arrow-down', sound: 'debuff' },
  concentrationBroken: { emoji: '💔', color: '#f44336', animation: 'shatter', sound: 'break' },
  deathSaveSuccess: { emoji: '✅', color: '#4caf50', animation: 'pulse-green', sound: 'success' },
  deathSaveFailure: { emoji: '❌', color: '#f44336', animation: 'pulse-red', sound: 'fail' },
  nat20DeathSave: { emoji: '🌟', color: '#ffd700', animation: 'burst-gold', sound: 'miracle' },
};

export function getDamageEffect(damageType) {
  return DAMAGE_TYPE_EFFECTS[(damageType || '').toLowerCase()] || DAMAGE_TYPE_EFFECTS.force;
}

export function getCombatEventEffect(eventType) {
  return COMBAT_EVENT_EFFECTS[eventType] || null;
}

export function getHPBarColor(hpPercent) {
  if (hpPercent > 75) return '#4caf50';
  if (hpPercent > 50) return '#8bc34a';
  if (hpPercent > 25) return '#ff9800';
  if (hpPercent > 10) return '#f44336';
  return '#b71c1c';
}

export function getHPBarAnimation(hpPercent) {
  if (hpPercent <= 10) return 'pulse-danger';
  if (hpPercent <= 25) return 'pulse-warning';
  return 'none';
}
