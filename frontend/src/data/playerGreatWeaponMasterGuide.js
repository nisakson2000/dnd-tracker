/**
 * playerGreatWeaponMasterGuide.js
 * Player Mode: Great Weapon Master — the power attack feat
 * Pure JS — no React dependencies.
 */

export const GWM_BASICS = {
  feat: 'Great Weapon Master',
  source: 'Player\'s Handbook',
  benefit1: 'When you score a critical hit or reduce a creature to 0 HP with a melee weapon: bonus action melee attack.',
  benefit2: 'Before making a melee attack with a heavy weapon: take -5 to hit, deal +10 damage.',
  weapons: 'Heavy weapons: Greatsword, Greataxe, Maul, Glaive, Halberd, Pike',
  note: 'Defines melee damage builds. -5/+10 is a massive DPR increase when you can offset the penalty with advantage or other bonuses.',
};

export const GWM_MATH = [
  { scenario: 'Without advantage', baseTo Hit: '+7', effectiveBonus: '+2 (-5 from GWM)', dprIncrease: 'Moderate. -5 hurts accuracy. Use vs low-AC enemies (AC ≤ 15).', recommendation: 'Use GWM when enemy AC ≤ target\'s hit bonus + 9.' },
  { scenario: 'With advantage', baseToHit: '+7', effectiveBonus: '+2 (-5 from GWM)', dprIncrease: 'Excellent. Advantage compensates for -5 penalty. Always use GWM with advantage.', recommendation: 'Always activate GWM when you have advantage.' },
  { scenario: 'Vs high AC (20+)', baseToHit: '+7', effectiveBonus: '+2', dprIncrease: 'Negative. You miss too often. The +10 doesn\'t compensate for the misses.', recommendation: 'Don\'t use GWM vs AC 20+ without advantage.' },
];

export const GWM_ADVANTAGE_SOURCES = [
  { source: 'Reckless Attack (Barbarian)', detail: 'Free advantage every turn. Enemies get advantage on you, but you\'re raging. Perfect GWM enabler.', rating: 'S' },
  { source: 'Flanking (optional rule)', detail: 'If using flanking: position for advantage. GWM + flanking = consistent big damage.', rating: 'S' },
  { source: 'Faerie Fire', detail: 'Ally casts Faerie Fire → advantage on attacks. Enable GWM for the party\'s Fighter.', rating: 'A' },
  { source: 'Shove prone (ally)', detail: 'Ally shoves enemy prone → melee attacks have advantage → GWM with advantage.', rating: 'A' },
  { source: 'Mastermind Help (30ft)', detail: 'Mastermind Rogue: bonus action Help from 30ft. Give GWM Fighter advantage.', rating: 'A' },
  { source: 'Owl familiar Help', detail: 'Familiar uses Help → flyby away. Free advantage for GWM.', rating: 'A' },
];

export const GWM_WHEN_TO_USE = [
  { acRange: '≤ 14', useGWM: 'Always', note: 'Even without advantage, +10 damage far outweighs the accuracy loss vs low AC.' },
  { acRange: '15-17', useGWM: 'Usually', note: 'Without advantage: borderline. With advantage: always use it.' },
  { acRange: '18-19', useGWM: 'With advantage only', note: '-5 to hit vs AC 18+ is too expensive without advantage.' },
  { acRange: '20+', useGWM: 'Rarely', note: 'Only with advantage AND other bonuses (Bless, Precision Attack).' },
];

export const GWM_CLASS_SYNERGY = [
  { class: 'Barbarian', synergy: 'S', reason: 'Reckless Attack = free advantage. Rage damage stacks. GWM Barbarian is the top melee DPR build.' },
  { class: 'Fighter', synergy: 'S', reason: 'More attacks = more GWM procs. Action Surge for burst. Battlemaster Precision Attack (+d8 to hit) offsets -5.' },
  { class: 'Paladin', synergy: 'A', reason: 'GWM + Smite on crit = devastating. Less attacks than Fighter but bigger individual hits.' },
  { class: 'Ranger', synergy: 'B', reason: 'Works but Sharpshooter is usually better for Rangers (ranged builds).' },
];

export function gwmDPR(baseToHit, targetAC, baseDamage, hasAdvantage = false) {
  // Calculate DPR with and without GWM
  const normalHitChance = Math.min(0.95, Math.max(0.05, (baseToHit + 21 - targetAC) / 20));
  const gwmHitChance = Math.min(0.95, Math.max(0.05, (baseToHit - 5 + 21 - targetAC) / 20));

  const advNormalHit = hasAdvantage ? 1 - (1 - normalHitChance) ** 2 : normalHitChance;
  const advGwmHit = hasAdvantage ? 1 - (1 - gwmHitChance) ** 2 : gwmHitChance;

  const normalDPR = advNormalHit * baseDamage;
  const gwmDPR = advGwmHit * (baseDamage + 10);

  return { normalDPR: Math.round(normalDPR * 10) / 10, gwmDPR: Math.round(gwmDPR * 10) / 10, useGWM: gwmDPR > normalDPR };
}
