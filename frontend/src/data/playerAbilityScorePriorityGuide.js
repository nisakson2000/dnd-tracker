/**
 * playerAbilityScorePriorityGuide.js
 * Player Mode: Ability score priority and point buy optimization per class
 * Pure JS — no React dependencies.
 */

export const ABILITY_SCORE_METHODS = {
  standardArray: [15, 14, 13, 12, 10, 8],
  pointBuy: { budget: 27, minScore: 8, maxScore: 15, costs: { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 } },
  rolledStats: '4d6 drop lowest × 6. Higher variance. Can be very strong or very weak.',
  note: 'Point Buy is the most balanced. Standard Array is simple. Rolled stats add excitement but risk.',
};

export const CLASS_ABILITY_PRIORITY = [
  { class: 'Barbarian', priority: ['STR', 'CON', 'DEX'], dump: ['INT', 'CHA'], note: 'STR for attacks, CON for HP/Unarmored Defense, DEX for AC.' },
  { class: 'Bard', priority: ['CHA', 'DEX', 'CON'], dump: ['STR'], note: 'CHA for everything. DEX for AC. CON for concentration.' },
  { class: 'Cleric', priority: ['WIS', 'CON', 'STR/DEX'], dump: ['INT/CHA'], note: 'WIS for spells. CON for concentration. STR if heavy armor, DEX if medium.' },
  { class: 'Druid', priority: ['WIS', 'CON', 'DEX'], dump: ['STR', 'CHA'], note: 'WIS for spells. CON for Wild Shape HP. DEX for AC.' },
  { class: 'Fighter', priority: ['STR or DEX', 'CON', 'WIS'], dump: ['INT', 'CHA'], note: 'STR for melee, DEX for ranged. CON for HP. WIS for saves.' },
  { class: 'Monk', priority: ['DEX', 'WIS', 'CON'], dump: ['STR', 'INT', 'CHA'], note: 'DEX for attacks/AC. WIS for Ki DC/AC. Both are critical.' },
  { class: 'Paladin', priority: ['STR or DEX', 'CHA', 'CON'], dump: ['INT'], note: 'STR/DEX for attacks. CHA for spells/auras. CON for frontline survival.' },
  { class: 'Ranger', priority: ['DEX', 'WIS', 'CON'], dump: ['STR', 'CHA', 'INT'], note: 'DEX for attacks/AC. WIS for spells. CON for HP.' },
  { class: 'Rogue', priority: ['DEX', 'CON/CHA/INT', 'WIS'], dump: ['STR'], note: 'DEX for everything. Secondary depends on subclass.' },
  { class: 'Sorcerer', priority: ['CHA', 'CON', 'DEX'], dump: ['STR'], note: 'CHA for spells. CON for concentration. DEX for AC.' },
  { class: 'Warlock', priority: ['CHA', 'CON', 'DEX'], dump: ['STR'], note: 'CHA for everything. CON for concentration. DEX for AC.' },
  { class: 'Wizard', priority: ['INT', 'CON', 'DEX'], dump: ['STR', 'CHA'], note: 'INT for spells. CON for concentration. DEX for AC.' },
  { class: 'Artificer', priority: ['INT', 'CON', 'DEX'], dump: ['STR', 'CHA'], note: 'INT for spells/infusions. CON for frontline. DEX for AC.' },
];

export const POINT_BUY_OPTIMAL_ARRAYS = [
  { name: 'SAD Caster', array: [8, 14, 14, 8, 8, 15], note: 'Max primary stat (15 → 17 with racial +2). 14 CON + 14 DEX. Dump physical.' },
  { name: 'MAD Martial', array: [15, 14, 13, 8, 10, 8], note: 'STR 15 + DEX 14 + CON 13. Balanced martial stats.' },
  { name: 'Paladin/Hexblade', array: [15, 10, 13, 8, 8, 15], note: 'STR/CHA both at 15. CON 13 for Resilient (CON) later. Both key stats high.' },
  { name: 'Monk', array: [8, 15, 14, 8, 15, 8], note: 'DEX 15 + WIS 15. Both critical. CON 14 for survival. Dump everything else.' },
  { name: 'Half-feat ready', array: [8, 14, 14, 8, 8, 15], note: '15 in primary + racial +2 = 17. Then half-feat (+1) = 18 at L4. Optimal progression.' },
];

export const ASI_PROGRESSION = {
  levels: [4, 8, 12, 16, 19],
  fighterExtra: [6, 14],
  rogueExtra: [10],
  note: 'Most classes get 5 ASIs. Fighter gets 7. Rogue gets 6. Plan your feat/ASI split in advance.',
  strategy: 'L4: Max primary stat to 18 (or 20 if rolled high). L8: Max to 20 or take S-tier feat. L12+: feats.',
};

export function pointBuyCost(score) {
  const costs = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
  return costs[score] || 0;
}

export function totalPointBuyCost(scores) {
  return scores.reduce((sum, s) => sum + pointBuyCost(s), 0);
}

export function isValidPointBuy(scores) {
  const total = totalPointBuyCost(scores);
  const allValid = scores.every(s => s >= 8 && s <= 15);
  return allValid && total <= 27;
}

export function abilityModifier(score) {
  return Math.floor((score - 10) / 2);
}
