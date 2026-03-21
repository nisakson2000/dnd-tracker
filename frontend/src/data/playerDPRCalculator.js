/**
 * playerDPRCalculator.js
 * Player Mode: Damage Per Round (DPR) calculator for build optimization
 * Pure JS — no React dependencies.
 */

export const DPR_BENCHMARKS = {
  low: { dpr: 10, label: 'Low DPR', color: '#9e9e9e', typical: 'Support caster, utility character' },
  moderate: { dpr: 20, label: 'Moderate DPR', color: '#4caf50', typical: 'Standard martial, cantrip + bonus attack' },
  high: { dpr: 30, label: 'High DPR', color: '#ff9800', typical: 'Optimized martial, GWM/Sharpshooter build' },
  excellent: { dpr: 40, label: 'Excellent DPR', color: '#f44336', typical: 'Action Surge + Smite nova, Gloom Stalker' },
  insane: { dpr: 50, label: 'Insane DPR', color: '#9c27b0', typical: 'PAM/GWM + Action Surge, Sorcadin nova' },
};

export const DPR_FACTORS = [
  { factor: 'Hit Chance', description: 'Accuracy is king. +1 to hit = ~5% more DPR.', impact: 'Critical' },
  { factor: 'Number of Attacks', description: 'More attacks = more damage. Extra Attack is huge.', impact: 'Critical' },
  { factor: 'Damage per Hit', description: 'Flat bonuses (STR/DEX mod, GWM +10) multiply by attacks.', impact: 'High' },
  { factor: 'Advantage', description: 'Advantage ≈ +3.3 to hit. Also increases crit chance to ~10%.', impact: 'High' },
  { factor: 'Critical Hits', description: 'Double damage dice. More impactful with more dice (Smite, Sneak Attack).', impact: 'Medium' },
  { factor: 'Bonus Action Attacks', description: 'TWF, PAM, Crossbow Expert add bonus action attacks.', impact: 'Medium' },
  { factor: 'Damage Type', description: 'Force/radiant rarely resisted. Fire/poison often resisted.', impact: 'Situational' },
];

export function calculateDPR(attacks, hitBonus, targetAC, avgDamagePerHit, critDamageBonus) {
  const hitChance = Math.max(0.05, Math.min(0.95, (21 - (targetAC - hitBonus)) / 20));
  const critChance = 0.05; // 5% for nat 20
  const normalHitChance = hitChance - critChance;

  const normalDPR = attacks * normalHitChance * avgDamagePerHit;
  const critDPR = attacks * critChance * (avgDamagePerHit + (critDamageBonus || avgDamagePerHit * 0.5));
  const totalDPR = normalDPR + critDPR;

  return {
    dpr: Math.round(totalDPR * 10) / 10,
    hitChance: Math.round(hitChance * 100),
    attacks,
    averageDamagePerHit: avgDamagePerHit,
  };
}

export function calculateGWMDPR(attacks, hitBonus, targetAC, baseDamage) {
  const normalDPR = calculateDPR(attacks, hitBonus, targetAC, baseDamage, 0);
  const gwmDPR = calculateDPR(attacks, hitBonus - 5, targetAC, baseDamage + 10, 0);

  return {
    normal: normalDPR,
    gwm: gwmDPR,
    recommendation: gwmDPR.dpr > normalDPR.dpr ? 'Use GWM/Sharpshooter' : 'Attack normally',
    dprDifference: Math.round((gwmDPR.dpr - normalDPR.dpr) * 10) / 10,
  };
}

export function getDPRRating(dpr) {
  if (dpr >= 50) return DPR_BENCHMARKS.insane;
  if (dpr >= 40) return DPR_BENCHMARKS.excellent;
  if (dpr >= 30) return DPR_BENCHMARKS.high;
  if (dpr >= 20) return DPR_BENCHMARKS.moderate;
  return DPR_BENCHMARKS.low;
}
