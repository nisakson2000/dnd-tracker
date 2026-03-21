/**
 * playerMeleeOptimizer.js
 * Player Mode: Melee combat optimization tips and weapon comparisons
 * Pure JS — no React dependencies.
 */

export const MELEE_OPTIMIZATION_TIPS = [
  {
    title: 'Great Weapon Master vs Normal',
    description: '-5 to hit for +10 damage. Use when your hit bonus is much higher than needed.',
    rule: 'Use GWM when target AC is ≤ your attack bonus + 9 (rough guideline).',
    tip: 'GWM gets better with advantage, Bless, or against low AC targets.',
  },
  {
    title: 'Greatsword (2d6) vs Greataxe (1d12)',
    description: 'Greatsword averages 7 damage, same as Greataxe. But 2d6 is more consistent (less variance).',
    rule: 'Greataxe is better for Brutal Critical (Barbarian) — extra die is d12 vs d6.',
    tip: 'Great Weapon Fighting reroll favors 2d6 slightly more than 1d12.',
  },
  {
    title: 'Polearm Master + Sentinel',
    description: 'OA when enemy enters your 10ft reach. On hit, speed becomes 0. They can\'t reach you.',
    rule: 'This combo essentially prevents enemies from reaching you in melee.',
    tip: 'Works best in chokepoints or when you have room to back up.',
  },
  {
    title: 'Shield + Dueling',
    description: '1d8+2+STR with shield (+2 AC). Very consistent and defensive.',
    rule: 'Best for tanks who want high AC and steady damage.',
    tip: 'Shield Master feat adds bonus action shove for prone → advantage.',
  },
  {
    title: 'Dual Wielding Optimization',
    description: 'Two-Weapon Fighting style adds ability mod to off-hand. Dual Wielder feat allows non-Light weapons.',
    rule: 'Best for classes that benefit from per-hit effects (Hunter\'s Mark, Hex, Rage damage).',
    tip: 'Dual wielding competes for bonus action — bad for classes that need bonus actions.',
  },
];

export const WEAPON_TIER_LIST = [
  { tier: 'S', weapons: ['Greatsword/Maul (2d6)', 'Polearms (Glaive/Halberd with PAM)', 'Rapier + Shield'] },
  { tier: 'A', weapons: ['Greataxe (Barbarian)', 'Longsword/Warhammer + Shield', 'Dual Scimitars/Shortswords'] },
  { tier: 'B', weapons: ['Quarterstaff (Monk)', 'Whip (reach + finesse)', 'Trident'] },
  { tier: 'C', weapons: ['Club', 'Sickle', 'Light Hammer'] },
];

export function shouldUseGWM(attackBonus, targetAC, hasAdvantage = false) {
  const normalHitChance = Math.min(0.95, Math.max(0.05, (21 - (targetAC - attackBonus)) / 20));
  const gwmHitChance = Math.min(0.95, Math.max(0.05, (21 - (targetAC - (attackBonus - 5))) / 20));

  // With advantage, approximate: 1 - (1 - hitChance)^2
  const effectiveNormal = hasAdvantage ? 1 - Math.pow(1 - normalHitChance, 2) : normalHitChance;
  const effectiveGWM = hasAdvantage ? 1 - Math.pow(1 - gwmHitChance, 2) : gwmHitChance;

  // Compare expected damage (assuming ~10 base damage)
  const normalDPR = effectiveNormal * 10;
  const gwmDPR = effectiveGWM * 20;

  return { useGWM: gwmDPR > normalDPR, normalDPR: Math.round(normalDPR * 10) / 10, gwmDPR: Math.round(gwmDPR * 10) / 10 };
}
