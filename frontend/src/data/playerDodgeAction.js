/**
 * playerDodgeAction.js
 * Player Mode: Dodge action rules, when to use it, and interactions
 * Pure JS — no React dependencies.
 */

export const DODGE_RULES = {
  action: 'Action',
  effect: 'Until the start of your next turn: attacks against you have disadvantage (if you can see the attacker), and DEX saves have advantage.',
  endCondition: 'Ends if incapacitated or speed drops to 0.',
  note: 'One of the most underused actions — extremely powerful for tanks.',
};

export const WHEN_TO_DODGE = [
  'When surrounded by multiple enemies and can\'t escape.',
  'When protecting a downed ally (buying time for healing).',
  'When waiting for allies to arrive / stalling.',
  'When you\'ve already used your action for something and have Patient Defense (Monk).',
  'When the enemy is about to use a powerful attack or AOE.',
  'When you have high AC and want to make yourself nearly unhittable.',
  'When concentrating on a crucial spell and want to avoid damage.',
];

export const DODGE_INTERACTIONS = [
  { feature: 'Patient Defense (Monk)', interaction: 'Use as Bonus Action for 1 ki point — attack AND dodge in same turn.' },
  { feature: 'Heavy Armor + Shield', interaction: 'AC 20+ with Dodge = enemies need high rolls to hit at all.' },
  { feature: 'Concentration', interaction: 'Fewer hits = fewer concentration saves. Great for casters.' },
  { feature: 'Sentinel feat', interaction: 'Dodge + Sentinel: enemies have disadvantage on you, and you punish them for attacking allies.' },
  { feature: 'Haste', interaction: 'Use the Haste action to Dodge while still attacking normally with your main action.' },
];

export function getEffectiveAC(baseAC, isDodging, hasCover) {
  // Dodge doesn't change AC, but effectively makes it harder to be hit
  // This is a rough approximation: disadvantage is roughly -5 on average
  let effective = baseAC;
  if (isDodging) effective += 5; // disadvantage approximation
  if (hasCover === 'half') effective += 2;
  if (hasCover === 'three_quarters') effective += 5;
  return effective;
}
