/**
 * playerQuickMath.js
 * Player Mode: Quick math helpers for common D&D calculations
 * Pure JS — no React dependencies.
 */

export const AVERAGE_DICE = {
  d4: 2.5,
  d6: 3.5,
  d8: 4.5,
  d10: 5.5,
  d12: 6.5,
  d20: 10.5,
  d100: 50.5,
};

export const HIT_PROBABILITY = [
  { targetAC: 10, bonus5: 80, bonus7: 90, bonus9: 95 },
  { targetAC: 12, bonus5: 70, bonus7: 80, bonus9: 90 },
  { targetAC: 14, bonus5: 60, bonus7: 70, bonus9: 80 },
  { targetAC: 16, bonus5: 50, bonus7: 60, bonus9: 70 },
  { targetAC: 18, bonus5: 40, bonus7: 50, bonus9: 60 },
  { targetAC: 20, bonus5: 30, bonus7: 40, bonus9: 50 },
  { targetAC: 22, bonus5: 20, bonus7: 30, bonus9: 40 },
  { targetAC: 24, bonus5: 10, bonus7: 20, bonus9: 30 },
];

export const SAVE_PROBABILITY = [
  { saveDC: 13, mod0: 40, mod3: 55, mod5: 65, mod7: 75 },
  { saveDC: 15, mod0: 30, mod3: 45, mod5: 55, mod7: 65 },
  { saveDC: 17, mod0: 20, mod3: 35, mod5: 45, mod7: 55 },
  { saveDC: 19, mod0: 10, mod3: 25, mod5: 35, mod7: 45 },
];

export function averageDamage(diceCount, dieSize, modifier = 0) {
  const dieKey = `d${dieSize}`;
  const avg = AVERAGE_DICE[dieKey] || 0;
  return diceCount * avg + modifier;
}

export function hitChance(attackBonus, targetAC) {
  const needed = targetAC - attackBonus;
  if (needed <= 1) return 100; // nat 1 always misses though
  if (needed >= 20) return 5; // nat 20 always hits
  return Math.min(100, Math.max(5, (21 - needed) * 5));
}

export function expectedDamage(attackBonus, targetAC, avgDamage) {
  const chance = hitChance(attackBonus, targetAC) / 100;
  const critChance = 0.05;
  return (chance - critChance) * avgDamage + critChance * avgDamage * 2;
}

export function saveDC(abilityMod, profBonus) {
  return 8 + abilityMod + profBonus;
}

export function abilityModifier(score) {
  return Math.floor((score - 10) / 2);
}

export function passiveScore(abilityMod, profBonus, isProficient, hasAdvantage = false, hasDisadvantage = false) {
  let base = 10 + abilityMod;
  if (isProficient) base += profBonus;
  if (hasAdvantage) base += 5;
  if (hasDisadvantage) base -= 5;
  return base;
}

export function pointBuyCost(score) {
  const costs = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
  return costs[score] !== undefined ? costs[score] : null;
}
