/**
 * playerCombatStatistics.js
 * Player Mode: Track combat performance stats across sessions
 * Pure JS — no React dependencies.
 */

export const STAT_CATEGORIES = [
  { stat: 'totalDamageDealt', label: 'Total Damage Dealt', icon: '⚔️', color: '#f44336' },
  { stat: 'totalDamageTaken', label: 'Total Damage Taken', icon: '🛡️', color: '#ff9800' },
  { stat: 'totalHealing', label: 'Total Healing Done', icon: '💚', color: '#4caf50' },
  { stat: 'attacksMade', label: 'Attacks Made', icon: '🎯', color: '#2196f3' },
  { stat: 'attacksHit', label: 'Attacks Hit', icon: '✅', color: '#4caf50' },
  { stat: 'criticalHits', label: 'Critical Hits', icon: '💥', color: '#ff1744' },
  { stat: 'criticalMisses', label: 'Critical Misses', icon: '😬', color: '#9e9e9e' },
  { stat: 'spellsCast', label: 'Spells Cast', icon: '✨', color: '#9c27b0' },
  { stat: 'enemiesKilled', label: 'Enemies Defeated', icon: '☠️', color: '#f44336' },
  { stat: 'timesDown', label: 'Times at 0 HP', icon: '💀', color: '#212121' },
  { stat: 'deathSaves', label: 'Death Saves Made', icon: '🎲', color: '#ff9800' },
  { stat: 'combatsWon', label: 'Combats Won', icon: '🏆', color: '#ffd700' },
];

export function createCombatStats() {
  const stats = {};
  STAT_CATEGORIES.forEach(cat => { stats[cat.stat] = 0; });
  stats.highestSingleHit = 0;
  stats.longestCombat = 0;
  stats.combatHistory = [];
  return stats;
}

export function recordAttack(stats, hit, damage, isCrit) {
  const newStats = { ...stats };
  newStats.attacksMade += 1;
  if (hit) {
    newStats.attacksHit += 1;
    newStats.totalDamageDealt += damage;
    if (damage > newStats.highestSingleHit) newStats.highestSingleHit = damage;
  }
  if (isCrit && hit) newStats.criticalHits += 1;
  if (isCrit && !hit) newStats.criticalMisses += 1;
  return newStats;
}

export function getHitRate(stats) {
  if (!stats.attacksMade) return 0;
  return Math.round((stats.attacksHit / stats.attacksMade) * 100);
}

export function getCritRate(stats) {
  if (!stats.attacksMade) return 0;
  return Math.round((stats.criticalHits / stats.attacksMade) * 100);
}

export function getDamagePerRound(stats, totalRounds) {
  if (!totalRounds) return 0;
  return Math.round(stats.totalDamageDealt / totalRounds * 10) / 10;
}

export function generateCombatReport(stats) {
  return {
    hitRate: `${getHitRate(stats)}%`,
    critRate: `${getCritRate(stats)}%`,
    totalDamage: stats.totalDamageDealt,
    totalHealing: stats.totalHealing,
    highestHit: stats.highestSingleHit,
    timesDown: stats.timesDown,
    kills: stats.enemiesKilled,
  };
}
