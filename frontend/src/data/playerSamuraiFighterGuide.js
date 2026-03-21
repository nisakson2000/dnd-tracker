/**
 * playerSamuraiFighterGuide.js
 * Player Mode: Samurai Fighter — relentless attacker with Fighting Spirit
 * Pure JS — no React dependencies.
 */

export const SAMURAI_BASICS = {
  class: 'Fighter (Samurai)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Disciplined warrior. Self-granted advantage and incredible nova turns.',
  note: 'Top-tier Fighter. Fighting Spirit = advantage on all attacks for a turn. Combined with Action Surge = devastating.',
};

export const SAMURAI_FEATURES = [
  { feature: 'Fighting Spirit', level: 3, effect: 'Bonus action: advantage on all attacks this turn + 5 temp HP. Three times per long rest (10 temp HP at L10, 15 at L15).', note: 'Free advantage. 3/long rest. Temp HP is a bonus. This + Action Surge + GWM = nuclear.' },
  { feature: 'Elegant Courtier', level: 7, effect: 'Add WIS to Persuasion checks. Proficiency in WIS saves (or INT/CHA if already proficient).', note: 'WIS save proficiency on a Fighter. Covers your worst save. Persuasion bonus is nice.' },
  { feature: 'Tireless Spirit', level: 10, effect: 'Roll initiative with 0 Fighting Spirit uses? Regain one use.', note: 'Always have at least 1 Fighting Spirit. Never completely out of your key resource.' },
  { feature: 'Rapid Strike', level: 15, effect: 'Once per turn, when you have advantage and hit: forgo advantage on one attack to make an extra attack.', note: 'Trade advantage for one more attack. With 3 attacks + Rapid Strike = 4 attacks. With Action Surge = 7 attacks.' },
  { feature: 'Strength Before Death', level: 18, effect: 'When reduced to 0 HP: take an entire extra turn immediately. Once per long rest.', note: 'Die → take a full turn → Action Surge → 8+ attacks. Then actually go unconscious. Or heal yourself.' },
];

export const SAMURAI_NOVA_MATH = {
  level5: {
    scenario: 'Fighting Spirit + Action Surge',
    attacks: 4, // 2 + 2 from Surge
    advantage: true,
    gwm: true,
    detail: '4 attacks with advantage + GWM. At +5 STR: ~4 × 0.70 × 22.5 = ~63 DPR.',
  },
  level11: {
    scenario: 'Fighting Spirit + Action Surge',
    attacks: 6, // 3 + 3
    advantage: true,
    gwm: true,
    detail: '6 attacks with advantage + GWM = ~6 × 0.70 × 22.5 = ~94.5 DPR.',
  },
  level15: {
    scenario: 'Fighting Spirit + Action Surge + Rapid Strike',
    attacks: 8, // 3 + 1 Rapid + 3 Surge + 1 possible
    advantage: true,
    gwm: true,
    detail: '7-8 attacks with advantage + GWM. ~7 × 0.70 × 22.5 = ~110 DPR. One round.',
  },
  level20: {
    scenario: 'Fighting Spirit + Action Surge x2 + Rapid Strike',
    attacks: 10, // 4 + 1 Rapid + 4 Surge + maybe more
    advantage: true,
    gwm: true,
    detail: '9-10 attacks with advantage + GWM in one round. ~150+ DPR.',
  },
};

export const SAMURAI_TACTICS = [
  { tactic: 'GWM nova', detail: 'Fighting Spirit (advantage) → GWM (-5/+10). Advantage negates the -5. All attacks deal +10. Devastating.', rating: 'S' },
  { tactic: 'Sharpshooter nova', detail: 'Same concept with a bow. Longbow + Sharpshooter + advantage. 600ft range. Sniper Samurai.', rating: 'S' },
  { tactic: 'Action Surge double', detail: 'Fighting Spirit + Action Surge: 4-8 attacks with advantage in one turn. Boss killing.', rating: 'S' },
  { tactic: 'Rapid Strike efficiency', detail: 'L15: trade advantage on one attack for an extra attack. More damage per turn on average.', rating: 'A' },
  { tactic: 'Archery Samurai', detail: 'Longbow + Sharpshooter + Fighting Spirit. Ranged Samurai is arguably better than melee.', rating: 'S', note: 'Archery fighting style (+2) + advantage + SS. Hit rate stays high.' },
];

export const SAMURAI_VS_BATTLEMASTER = {
  samurai: { pros: ['Self-advantage (3/LR)', 'Temp HP', 'WIS save proficiency', 'Rapid Strike extra attack', 'Higher nova damage'], cons: ['No maneuvers', 'Less versatile', 'No superiority dice utility'] },
  battlemaster: { pros: ['16+ maneuvers', 'Trip/Precision/Riposte', 'More versatile', 'Short rest recovery'], cons: ['No self-advantage', 'No WIS saves', 'Lower sustained nova'] },
  verdict: 'Samurai for raw damage output. Battlemaster for versatility and control. Both S-tier.',
};

export function fightingSpiritTempHP(fighterLevel) {
  if (fighterLevel >= 15) return 15;
  if (fighterLevel >= 10) return 10;
  return 5;
}

export function samuraiNovaDPR(fighterLevel, strMod, targetAC, useGWM = true) {
  const attacks = fighterLevel >= 20 ? 4 : fighterLevel >= 11 ? 3 : 2;
  const rapidStrike = fighterLevel >= 15 ? 1 : 0;
  const actionSurge = attacks; // Double on surge turn
  const totalAttacks = attacks + rapidStrike + actionSurge;
  const profBonus = Math.min(6, 2 + Math.floor((fighterLevel + 3) / 4));
  const attackBonus = strMod + profBonus + (useGWM ? -5 : 0);
  const hitChance = Math.min(0.95, Math.max(0.05, (21 - (targetAC - attackBonus)) / 20));
  const advHitChance = 1 - Math.pow(1 - hitChance, 2);
  const damage = 6.5 + strMod + (useGWM ? 10 : 0); // greatsword
  return totalAttacks * advHitChance * damage;
}
