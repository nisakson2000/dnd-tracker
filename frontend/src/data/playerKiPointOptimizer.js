/**
 * playerKiPointOptimizer.js
 * Player Mode: Monk Ki point management and optimal spending
 * Pure JS — no React dependencies.
 */

export const KI_ABILITIES = [
  { name: 'Flurry of Blows', cost: 1, action: 'Bonus', effect: 'Two unarmed strikes as a bonus action.', rating: 'A', tip: 'Best for sustained damage. Use when you expect to hit.' },
  { name: 'Patient Defense', cost: 1, action: 'Bonus', effect: 'Dodge as a bonus action (disadvantage on all attacks against you).', rating: 'B', tip: 'Use when enemies are focusing you. Great at low HP.' },
  { name: 'Step of the Wind', cost: 1, action: 'Bonus', effect: 'Dash or Disengage as a bonus action. Jump distance doubled.', rating: 'B', tip: 'Free with no Ki cost for Drunken Master. Use to escape or reposition.' },
  { name: 'Stunning Strike', cost: 1, action: 'On hit', effect: 'Target must CON save or be Stunned until end of your next turn.', rating: 'S', tip: 'THE reason to play Monk. Stun = auto-crit for melee allies, skip enemy turn.' },
  { name: 'Deflect Missiles (catch & throw)', cost: 1, action: 'Reaction', effect: 'If you reduce ranged damage to 0, throw it back as a ranged attack.', rating: 'B', tip: 'Free to reduce damage. Only costs Ki if you throw it back.' },
  { name: 'Focused Aim (optional)', cost: 1, action: 'On miss', effect: 'Add +2 to a missed attack roll. Can spend up to 3 Ki for +6.', rating: 'A', tip: 'Turn near-misses into hits. Especially good for Stunning Strike attempts.' },
  { name: 'Quickened Healing (optional)', cost: 2, action: 'Action', effect: 'Heal 1d(martial arts die) + proficiency bonus HP.', rating: 'C', tip: 'Only use out of combat. Too expensive for in-combat healing.' },
  { name: 'Empty Body (18th)', cost: 4, action: 'Action', effect: 'Invisible + resistance to all damage except force for 1 minute.', rating: 'S', tip: 'Endgame ability. Near-invincibility.' },
];

export const KI_MANAGEMENT_TIPS = [
  'You get Ki = Monk level. Short rest recovers ALL Ki.',
  'Push for short rests. Monks are short rest dependent.',
  'Don\'t spam Stunning Strike on every hit. Save Ki for good opportunities.',
  'Stunning Strike is best against targets with LOW CON saves.',
  'Flurry of Blows is your damage bread-and-butter. 2 extra attacks.',
  'Patient Defense is underrated. Dodge action as a bonus = tank mode.',
  'At low levels (2-4), you have very few Ki. Be conservative.',
  'At higher levels (11+), you have plenty. Spend more freely.',
  'Don\'t spend Ki if you\'re going to short rest right after the fight.',
];

export const STUNNING_STRIKE_MATH = {
  successRate: 'Depends on your save DC vs target CON save. Typically 35-50% chance.',
  worthIt: 'Even at 35%, the effect is so powerful that 1 Ki is almost always worth trying.',
  targetPriority: [
    'Low CON: Casters, Rogues, most humanoids (best targets).',
    'Medium CON: General monsters, some warriors.',
    'High CON: Avoid. Giants, Constructs, many undead. Don\'t waste Ki.',
  ],
  saveDC: '8 + proficiency + WIS modifier.',
};

export function getKiPointsAtLevel(monkLevel) {
  return monkLevel >= 2 ? monkLevel : 0;
}

export function getStunDC(profBonus, wisMod) {
  return 8 + profBonus + wisMod;
}

export function kiSpendingAdvice(currentKi, maxKi, encountersRemaining, canShortRest) {
  if (canShortRest) return { budget: 'Spend freely', reason: 'Short rest will recover everything.' };
  const ratio = currentKi / maxKi;
  if (ratio > 0.7) return { budget: 'Spend normally', reason: 'Plenty of Ki remaining.' };
  if (ratio > 0.4) return { budget: 'Be selective', reason: 'Only Stunning Strike and Flurry on key targets.' };
  if (ratio > 0.15) return { budget: 'Emergency only', reason: 'Save for Stunning Strike on priority targets.' };
  return { budget: 'Conserve', reason: 'Almost out. Martial arts only until rest.' };
}
