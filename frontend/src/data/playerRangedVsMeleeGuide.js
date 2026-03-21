/**
 * playerRangedVsMeleeGuide.js
 * Player Mode: Ranged vs melee combat comparison
 * Pure JS — no React dependencies.
 */

export const RANGED_VS_MELEE = {
  rangedPros: ['Safer (60-150ft from enemies)', 'No OAs to worry about', 'Target anyone in line of sight', 'Sharpshooter ignores cover'],
  rangedCons: ['Disadvantage within 5ft of hostile', 'Cover penalties (without SS)', 'Can\'t grapple/shove', 'Less AC (usually no shield)'],
  meleePros: ['Higher base damage (GWM weapons)', 'Shield for AC', 'Can grapple/shove', 'Opportunity attacks', 'More feat combos (PAM+Sentinel)'],
  meleeCons: ['In danger constantly', 'Must close distance', 'Vulnerable to AoE', 'Can be surrounded'],
};

export const BUILD_COMPARISON = [
  { build: 'Hand Crossbow + CBE + SS', style: 'Ranged', dpr: '3 × (1d6+5+10) = 55.5 avg (before accuracy)', acRange: '30-120ft', note: 'Highest sustained ranged DPR. Safe distance.' },
  { build: 'Longbow + SS', style: 'Ranged', dpr: '2 × (1d8+5+10) = 39 avg', acRange: '150/600ft', note: 'Extreme range. Safe. No bonus action attack without CBE.' },
  { build: 'Greatsword + GWM', style: 'Melee', dpr: '2 × (2d6+5+10) = 44 avg + PAM BA attack', acRange: 'Melee 5ft', note: 'High damage with PAM bonus attack. Must be in melee.' },
  { build: 'Glaive + PAM + GWM', style: 'Melee', dpr: '2 × (1d10+5+10) + 1 × (1d4+5+10) = 48 avg', acRange: 'Melee 10ft', note: 'Best melee DPR. 10ft reach. PAM+Sentinel lockdown.' },
  { build: 'Sword + Shield + Dueling', style: 'Melee', dpr: '2 × (1d8+5+2) = 22 avg', acRange: 'Melee 5ft', note: 'Defensive build. AC 20 with plate+shield. Lower DPR but tankier.' },
];

export const WHEN_TO_GO_RANGED = [
  'Enemy is flying (melee can\'t reach)',
  'Enemy has dangerous melee abilities (aura, grapple, swallow)',
  'You\'re a caster/squishy and need to stay safe',
  'Open terrain with lots of space',
  'Enemy is retreating or kiting',
];

export const WHEN_TO_GO_MELEE = [
  'You have Sentinel/PAM for lockdown',
  'Enemy is a caster you need to pin down',
  'Tight corridors where positioning matters',
  'You have Spirit Guardians or other melee auras',
  'You need to grapple/shove enemies into hazards',
  'You have Reckless Attack (advantage enables GWM)',
];

export function rangedVsMeleeDPR(rangedAttacks, rangedDmg, meleeAttacks, meleeDmg, rangedHitChance, meleeHitChance) {
  const rangedDPR = rangedAttacks * rangedHitChance * rangedDmg;
  const meleeDPR = meleeAttacks * meleeHitChance * meleeDmg;
  return { rangedDPR, meleeDPR, winner: rangedDPR > meleeDPR ? 'Ranged' : 'Melee' };
}
