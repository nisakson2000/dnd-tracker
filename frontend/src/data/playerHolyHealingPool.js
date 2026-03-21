/**
 * playerHolyHealingPool.js
 * Player Mode: Paladin Lay on Hands optimization and usage
 * Pure JS — no React dependencies.
 */

export const LAY_ON_HANDS_RULES = {
  pool: 'Paladin level × 5 HP.',
  action: 'Action. Touch. Choose how many HP to spend.',
  cureDisease: '5 HP to cure 1 disease or neutralize 1 poison.',
  selfHeal: 'Can target yourself.',
  recovery: 'Full pool on long rest.',
};

export const LOH_TIPS = [
  { tip: '1 HP revive', detail: 'Ally at 0 HP? 1 HP from pool → conscious + full turn.', priority: 'S' },
  { tip: 'Don\'t top off', detail: 'Heal to prevent going down, not for comfort.', priority: 'A' },
  { tip: 'Cure poison/disease', detail: '5 HP per cure. Worth it for bad conditions.', priority: 'A' },
  { tip: 'Save for emergencies', detail: 'Keep 10-20 HP reserve for clutch saves.', priority: 'S' },
  { tip: 'Post-combat dump', detail: 'Spend remaining pool to top off between fights.', priority: 'A' },
];

export const LOH_POOL = [
  { level: 2, pool: 10 }, { level: 5, pool: 25 }, { level: 10, pool: 50 },
  { level: 15, pool: 75 }, { level: 20, pool: 100 },
];

export function lohPool(level) { return level * 5; }
export function curesAvailable(pool) { return Math.floor(pool / 5); }
