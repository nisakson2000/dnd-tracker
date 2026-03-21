/**
 * playerDamageCalculator.js
 * Player Mode: Damage calculation helpers for various scenarios
 * Pure JS — no React dependencies.
 */

export const DAMAGE_MODIFIERS = {
  resistance: 0.5,
  vulnerability: 2.0,
  immunity: 0,
  normal: 1.0,
};

export const AVERAGE_DAMAGE_BY_DIE = {
  d4: 2.5,
  d6: 3.5,
  d8: 4.5,
  d10: 5.5,
  d12: 6.5,
  d20: 10.5,
};

/**
 * Calculate average damage for a dice expression.
 */
export function averageDamage(diceExpression) {
  if (!diceExpression) return 0;
  let total = 0;
  const parts = diceExpression.replace(/\s/g, '').split(/([+-])/);
  let sign = 1;

  for (const part of parts) {
    if (part === '+') { sign = 1; continue; }
    if (part === '-') { sign = -1; continue; }
    if (part === '') continue;

    const diceMatch = part.match(/^(\d+)d(\d+)$/);
    if (diceMatch) {
      const count = parseInt(diceMatch[1]);
      const sides = parseInt(diceMatch[2]);
      total += sign * count * (sides / 2 + 0.5);
    } else {
      const num = parseInt(part);
      if (!isNaN(num)) total += sign * num;
    }
    sign = 1;
  }

  return Math.round(total * 10) / 10;
}

/**
 * Calculate damage per round (DPR) for a weapon.
 */
export function calculateDPR(attackBonus, targetAC, damageDice, damageModifier, attacksPerRound = 1, critRange = 20) {
  const hitChance = Math.min(0.95, Math.max(0.05, (21 - (targetAC - attackBonus)) / 20));
  const critChance = (21 - critRange) / 20;
  const normalHitChance = hitChance - critChance;

  const avgDamage = averageDamage(damageDice) + damageModifier;
  const critDamage = averageDamage(damageDice) * 2 + damageModifier;

  const dprPerAttack = (normalHitChance * avgDamage) + (critChance * critDamage);
  return Math.round(dprPerAttack * attacksPerRound * 10) / 10;
}

/**
 * Apply resistance/vulnerability/immunity to damage.
 */
export function applyDamageModifier(damage, modifier) {
  const mult = DAMAGE_MODIFIERS[modifier] ?? 1.0;
  return Math.floor(damage * mult);
}

/**
 * Compare DPR of two weapon options.
 */
export function compareDPR(option1, option2, targetAC) {
  const dpr1 = calculateDPR(option1.attackBonus, targetAC, option1.damageDice, option1.damageModifier, option1.attacks, option1.critRange);
  const dpr2 = calculateDPR(option2.attackBonus, targetAC, option2.damageDice, option2.damageModifier, option2.attacks, option2.critRange);
  return {
    option1: { ...option1, dpr: dpr1 },
    option2: { ...option2, dpr: dpr2 },
    better: dpr1 >= dpr2 ? 'option1' : 'option2',
    difference: Math.abs(dpr1 - dpr2),
  };
}
