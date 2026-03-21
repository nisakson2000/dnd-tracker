/**
 * playerRangedCombat.js
 * Player Mode: Ranged attack rules, disadvantage conditions, and cover
 * Pure JS — no React dependencies.
 */

export const RANGED_ATTACK_RULES = {
  normalRange: 'Attack normally within normal range.',
  longRange: 'Disadvantage on attacks beyond normal range up to long range.',
  beyondLong: 'Cannot attack beyond long range.',
  adjacentEnemy: 'Disadvantage on ranged attacks when a hostile creature is within 5ft (unless Crossbow Expert feat).',
  prone: 'Disadvantage on ranged attacks against prone targets beyond 5ft.',
  unseen: 'Guess target location. Disadvantage. Auto-miss if wrong square.',
};

export const RANGED_DISADVANTAGE_SOURCES = [
  { condition: 'Long range', description: 'Beyond normal range, up to maximum range.' },
  { condition: 'Adjacent enemy', description: 'Hostile creature within 5ft that can see you and isn\'t incapacitated.', negatedBy: 'Crossbow Expert feat' },
  { condition: 'Prone target', description: 'Target is prone and beyond 5ft away.' },
  { condition: 'Restrained', description: 'You are restrained.' },
  { condition: 'Blinded', description: 'You can\'t see the target (effectively).' },
  { condition: 'Poisoned', description: 'You are poisoned.' },
  { condition: 'Exhaustion 3+', description: 'You have 3+ levels of exhaustion.' },
  { condition: 'Dodge action', description: 'Target has used Dodge action.' },
  { condition: 'Dim light/darkness', description: 'Targeting unseen creature.' },
];

export const RANGED_ADVANTAGE_SOURCES = [
  { condition: 'Hidden', description: 'You are hidden from the target (successful Stealth).' },
  { condition: 'Target restrained', description: 'Target is restrained.' },
  { condition: 'Target stunned', description: 'Target is stunned.' },
  { condition: 'Target paralyzed', description: 'Target is paralyzed.' },
  { condition: 'Target unconscious (5ft)', description: 'Target is unconscious and within 5ft.' },
  { condition: 'Faerie Fire', description: 'Target is affected by Faerie Fire.' },
  { condition: 'Guiding Bolt', description: 'Next attack after Guiding Bolt hits has advantage.' },
  { condition: 'Invisibility (you)', description: 'You are invisible.' },
];

export function hasRangedDisadvantage(distance, normalRange, longRange, adjacentEnemy, targetProne, crossbowExpert = false) {
  const reasons = [];
  if (distance > normalRange && distance <= longRange) reasons.push('Long range');
  if (distance > longRange) return { disadvantage: true, reasons: ['Beyond maximum range — cannot attack'], canAttack: false };
  if (adjacentEnemy && !crossbowExpert) reasons.push('Adjacent hostile creature');
  if (targetProne && distance > 5) reasons.push('Target is prone (ranged)');
  return { disadvantage: reasons.length > 0, reasons, canAttack: true };
}
