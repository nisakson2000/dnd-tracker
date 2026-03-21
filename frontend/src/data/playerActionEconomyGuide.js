/**
 * playerActionEconomyGuide.js
 * Player Mode: Understanding and maximizing action economy
 * Pure JS — no React dependencies.
 */

export const ACTION_ECONOMY_BASICS = {
  action: { label: 'Action', description: 'Your main action each turn. Attack, Cast, Dash, Dodge, Disengage, Help, Hide, Ready, Search, Use Object.', color: '#f44336' },
  bonusAction: { label: 'Bonus Action', description: 'Only if you have an ability that uses one. Can\'t substitute for an Action.', color: '#ff9800' },
  reaction: { label: 'Reaction', description: 'One per round. Refreshes at start of your turn. OA, Shield, Counterspell.', color: '#ffc107' },
  movement: { label: 'Movement', description: 'Up to your speed. Can split before/after action. Not an action.', color: '#4caf50' },
  freeAction: { label: 'Free Action', description: 'One object interaction per turn. Draw/sheathe weapon, open door.', color: '#2196f3' },
};

export const ACTION_ECONOMY_TIPS = [
  { tip: 'Use ALL your actions every turn', detail: 'Action + Bonus Action + Movement + Free Interaction + planned Reaction. Unused actions are wasted.', priority: 'Critical' },
  { tip: 'Bonus action spells → cantrip action only', detail: 'If you cast a bonus action spell, your action can only be a cantrip. Plan accordingly.', priority: 'Critical' },
  { tip: 'Action economy wins fights', detail: 'A party of 4 vs 8 goblins: goblins have 2x the actions. That\'s why AoE and crowd control are powerful.', priority: 'High' },
  { tip: 'Summons add to your action economy', detail: 'Conjure Animals gives your side 8 more attacks per round. That\'s why it\'s so strong.', priority: 'High' },
  { tip: 'Legendary Actions break the rules', detail: 'Bosses get extra actions between player turns. That\'s why they feel dangerous despite being outnumbered.', priority: 'Medium' },
  { tip: 'Conditions that remove actions are devastating', detail: 'Stunned, Paralyzed, Incapacitated = enemy loses their entire turn. Best form of damage.', priority: 'High' },
  { tip: 'Two-weapon fighting needs a bonus action', detail: 'If you need your bonus action for other things (Hex, Cunning Action), TWF conflicts.', priority: 'Medium' },
  { tip: 'Haste gives an extra action but NOT bonus action', detail: 'The extra action can only be Attack (one attack), Dash, Disengage, Hide, or Use Object.', priority: 'Medium' },
];

export const EFFICIENT_COMBOS = [
  { name: 'Healing Word + Attack', actions: 'Bonus + Action', detail: 'Pick up a downed ally AND still attack. Best healer pattern.' },
  { name: 'Spiritual Weapon + Spell', actions: 'Bonus (after 1st turn) + Action', detail: 'Attack with spiritual weapon AND cast another spell. Cleric damage machine.' },
  { name: 'Hex/Hunter\'s Mark + EB/Attacks', actions: 'Bonus (1st turn) + Action', detail: '+1d6 per hit. Cast once, benefit for hours.' },
  { name: 'Cunning Action Hide + Attack', actions: 'Bonus + Action', detail: 'Rogue: Hide for advantage → Sneak Attack. Every single turn.' },
  { name: 'Rage + Reckless Attack', actions: 'Bonus (1st turn) + Action', detail: 'Barbarian: Rage for damage/resistance, Reckless for advantage.' },
  { name: 'Misty Step + Cantrip', actions: 'Bonus + Action', detail: 'Teleport + cast a cantrip (only cantrip, not leveled spell).' },
];

export function getActionType(actionName) {
  return ACTION_ECONOMY_BASICS[actionName] || null;
}

export function analyzeActionUsage(usedAction, usedBonus, usedReaction, usedMovement) {
  const unused = [];
  if (!usedAction) unused.push('Action');
  if (!usedBonus) unused.push('Bonus Action');
  if (!usedReaction) unused.push('Reaction');
  if (!usedMovement) unused.push('Movement');
  return {
    efficiency: `${4 - unused.length}/4 actions used`,
    unused,
    tip: unused.length > 0 ? `You didn't use: ${unused.join(', ')}. Consider how to use them next turn.` : 'Perfect action economy!',
  };
}
