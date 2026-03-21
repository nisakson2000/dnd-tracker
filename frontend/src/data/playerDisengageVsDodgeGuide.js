/**
 * playerDisengageVsDodgeGuide.js
 * Player Mode: Disengage vs Dodge vs Dash — when to use each
 * Pure JS — no React dependencies.
 */

export const ACTION_OPTIONS = [
  { action: 'Attack', when: 'Default. Kill the enemy faster. Dead enemies deal 0 damage.', priority: 'Almost always' },
  { action: 'Dodge', when: 'When you\'re surrounded and can\'t escape. Disadvantage on all attacks against you. Advantage on DEX saves.', priority: 'When tanking' },
  { action: 'Disengage', when: 'When you need to move away without taking OAs. Better than Dodge if you can get to safety.', priority: 'When escaping' },
  { action: 'Dash', when: 'When you need to cover distance. Double movement. Chase scenes. Fleeing.', priority: 'When repositioning' },
  { action: 'Help', when: 'When you can\'t deal meaningful damage. Give advantage to an ally instead.', priority: 'When weak/support' },
  { action: 'Ready', when: 'When timing matters more than acting now. Hold an action for a trigger.', priority: 'Situational' },
  { action: 'Hide', when: 'When you have cover/concealment. Get advantage on next attack. Rogue Cunning Action.', priority: 'Rogues/stealth' },
];

export const DISENGAGE_ANALYSIS = {
  cost: 'Your entire action.',
  effect: 'No opportunity attacks against you for the rest of your turn.',
  bestFor: 'Moving away from melee enemies when Dodge won\'t save you.',
  classesWithFreeDisengage: ['Rogue (Cunning Action: bonus action Disengage)', 'Monk (Step of the Wind: bonus action for 1 ki)', 'Goblin (Nimble Escape: bonus action Disengage)'],
  note: 'If you\'re giving up your Attack action to Disengage, it\'s usually better to just take the OA and attack. OA is only one attack.',
};

export const DODGE_ANALYSIS = {
  cost: 'Your entire action.',
  effect: 'Attacks against you have disadvantage. Advantage on DEX saves.',
  bestFor: 'When surrounded by multiple enemies. Each attacker has disadvantage. Stacks with high AC.',
  math: 'Disadvantage reduces average hit chance by ~25%. vs 3 enemies: prevents roughly 0.75 hits.',
  note: 'Better than Disengage when you can\'t escape anyway. Also protects against AoE (DEX save advantage).',
};

export const WHEN_TO_OA = {
  takeTheOA: 'Often better to just take the opportunity attack and keep your action. One OA = one attack. Your action = potentially 2+ attacks with Extra Attack.',
  exception1: 'Low HP: one more hit could kill you. Disengage instead.',
  exception2: 'Enemy has Sentinel: OA reduces your speed to 0. You can\'t leave anyway. Must Disengage.',
  exception3: 'Enemy deals massive damage (dragon melee). One OA = too much damage.',
  note: 'Most of the time: just take the OA and run. Your action is worth more than avoiding one attack.',
};

export const CLASS_SPECIFIC_MOVEMENT = [
  { class: 'Rogue', ability: 'Cunning Action', cost: 'Bonus action', options: 'Disengage, Dash, or Hide', note: 'Free Disengage every turn. Never take OAs. Rogues have the best combat mobility.' },
  { class: 'Monk', ability: 'Step of the Wind', cost: '1 ki (bonus action)', options: 'Disengage or Dash + jump distance doubled', note: 'Ki-powered Disengage. 1 ki is cheap but finite. Use when needed.' },
  { class: 'Goblin', ability: 'Nimble Escape', cost: 'Bonus action', options: 'Disengage or Hide', note: 'Same as Rogue Cunning Action. Goblin Rogues have redundancy.' },
  { class: 'Any (Mobile feat)', ability: 'Mobile', cost: 'None', options: 'After attacking a creature, no OA from that creature', note: 'Not a full Disengage — only vs creatures you attacked. But free and always on.' },
];

export function dodgeEffectiveness(incomingAttacks, baseHitChance) {
  const normalExpectedHits = incomingAttacks * baseHitChance;
  const dodgeHitChance = 1 - (1 - baseHitChance) * (1 - baseHitChance); // Actually this is advantage, dodge gives disadvantage
  const dodgeExpectedHits = incomingAttacks * (baseHitChance * baseHitChance); // disadvantage = both must hit
  return { normalHits: normalExpectedHits, dodgeHits: dodgeExpectedHits, hitsPrevented: normalExpectedHits - dodgeExpectedHits };
}
