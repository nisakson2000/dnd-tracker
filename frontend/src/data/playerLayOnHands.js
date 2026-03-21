/**
 * playerLayOnHands.js
 * Player Mode: Paladin Lay on Hands tracking
 * Pure JS — no React dependencies.
 */

export const LAY_ON_HANDS_RULES = {
  pool: 'Paladin level x 5 HP.',
  action: 'Action to touch a creature.',
  healing: 'Restore any number of HP from your pool (choose how many).',
  cureDisease: 'Expend 5 HP from pool to cure one disease or neutralize one poison.',
  selfHealing: 'Can use on yourself.',
  recharge: 'Long Rest restores full pool.',
  restrictions: 'No effect on undead or constructs.',
};

export function getMaxPool(paladinLevel) {
  return paladinLevel * 5;
}

export function canCureDisease(currentPool) {
  return currentPool >= 5;
}

export function usePool(currentPool, amount) {
  const used = Math.min(currentPool, Math.max(0, amount));
  return { remaining: currentPool - used, used };
}

export function getEfficiency(currentHP, maxHP, poolRemaining) {
  const missing = maxHP - currentHP;
  if (missing <= 0) return { suggestion: 'Full HP — save your pool.', priority: 'low' };
  if (missing <= 10) return { suggestion: `Heal ${missing} HP (small amount).`, priority: 'low' };
  if (currentHP <= maxHP * 0.25) return { suggestion: `Critical HP! Heal ${Math.min(missing, poolRemaining)} HP.`, priority: 'high' };
  return { suggestion: `Heal some HP. ${poolRemaining} remaining in pool.`, priority: 'medium' };
}
