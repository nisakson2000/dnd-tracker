/**
 * playerCommonActions.js
 * Player Mode: All standard actions in combat with descriptions
 * Pure JS — no React dependencies.
 */

export const COMBAT_ACTIONS = [
  { name: 'Attack', type: 'action', description: 'Make one melee or ranged attack (more with Extra Attack).', note: 'Extra Attack allows 2+ attacks as part of this action.' },
  { name: 'Cast a Spell', type: 'action', description: 'Cast a spell with a casting time of 1 action.', note: 'If you cast a spell as bonus action, you can only cast cantrips with your action.' },
  { name: 'Dash', type: 'action', description: 'Gain extra movement equal to your speed.', note: 'Can be bonus action (Rogue, Monk).' },
  { name: 'Disengage', type: 'action', description: 'Your movement doesn\'t provoke opportunity attacks.', note: 'Can be bonus action (Rogue, Monk).' },
  { name: 'Dodge', type: 'action', description: 'Attacks against you have disadvantage. Advantage on DEX saves.', note: 'Ends if incapacitated or speed is 0.' },
  { name: 'Help', type: 'action', description: 'Give an ally advantage on their next check or attack.', note: 'Must be within 5ft of the target or task.' },
  { name: 'Hide', type: 'action', description: 'Make a Stealth check to become hidden.', note: 'Can be bonus action (Rogue). Must be obscured.' },
  { name: 'Ready', type: 'action', description: 'Prepare an action with a trigger. Uses your reaction when triggered.', note: 'Readied spells require concentration and expend the slot immediately.' },
  { name: 'Search', type: 'action', description: 'Make a Perception or Investigation check.', note: 'Find hidden creatures, traps, or objects.' },
  { name: 'Use an Object', type: 'action', description: 'Interact with a second object or use a complex item.', note: 'First object interaction is free. This covers the second.' },
  { name: 'Grapple', type: 'special_attack', description: 'Replace one attack. Athletics vs target\'s Athletics/Acrobatics.', note: 'Requires free hand. Target max one size larger.' },
  { name: 'Shove', type: 'special_attack', description: 'Replace one attack. Push 5ft or knock prone.', note: 'Athletics vs target\'s Athletics/Acrobatics.' },
];

export const OTHER_ACTIONS = [
  { name: 'Two-Weapon Fighting', type: 'bonus_action', description: 'Attack with off-hand weapon (Light property required).' },
  { name: 'Opportunity Attack', type: 'reaction', description: 'One melee attack when a creature leaves your reach.' },
];

export function getAction(name) {
  return [...COMBAT_ACTIONS, ...OTHER_ACTIONS].find(a => a.name.toLowerCase() === (name || '').toLowerCase()) || null;
}

export function getActionsByType(type) {
  return COMBAT_ACTIONS.filter(a => a.type === type);
}
