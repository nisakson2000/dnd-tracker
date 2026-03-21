/**
 * playerActionEconomy.js
 * Player Mode: Detailed action economy reference and tracking
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// ACTION TYPES
// ---------------------------------------------------------------------------

export const ACTION_TYPES = {
  action: {
    label: 'Action',
    color: '#c9a84c',
    description: 'Your main action each turn.',
    options: ['Attack', 'Cast a Spell', 'Dash', 'Disengage', 'Dodge', 'Help', 'Hide', 'Ready', 'Search', 'Use an Object', 'Grapple', 'Shove'],
  },
  bonus_action: {
    label: 'Bonus Action',
    color: '#60a5fa',
    description: 'A quick action, only if you have a feature that grants one.',
    options: ['Off-hand Attack (TWF)', 'Cunning Action', 'Martial Arts', 'Healing Word', 'Misty Step', 'Shield Master Shove', 'Quickened Spell', 'Rage', 'Second Wind', 'Spiritual Weapon Attack'],
  },
  reaction: {
    label: 'Reaction',
    color: '#f472b6',
    description: 'One per round, triggered by specific events.',
    options: ['Opportunity Attack', 'Shield (spell)', 'Counterspell', 'Uncanny Dodge', 'Hellish Rebuke', 'Sentinel', 'War Caster OA', 'Absorb Elements', 'Feather Fall'],
  },
  movement: {
    label: 'Movement',
    color: '#4ade80',
    description: 'Move up to your speed. Can split before and after actions.',
    options: ['Walk', 'Climb (2x cost)', 'Swim (2x cost)', 'Crawl (2x cost)', 'Jump', 'Fly (if available)', 'Stand from Prone (half speed)'],
  },
  free_action: {
    label: 'Free Action',
    color: '#94a3b8',
    description: 'Brief interactions that don\'t cost an action.',
    options: ['Draw/stow one weapon', 'Open an unlocked door', 'Drop an item', 'Speak a few words', 'Release a grapple'],
  },
};

// ---------------------------------------------------------------------------
// ACTION ECONOMY TRACKER TEMPLATE
// ---------------------------------------------------------------------------

export const ACTION_ECONOMY_TEMPLATE = {
  actionUsed: false,
  bonusActionUsed: false,
  reactionUsed: false,
  movementUsed: 0,
  maxMovement: 30,
  freeInteractionUsed: false,
};

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Reset action economy for a new turn.
 */
export function resetForNewTurn(maxMovement = 30) {
  return {
    ...ACTION_ECONOMY_TEMPLATE,
    maxMovement,
  };
}

/**
 * Check what actions are still available.
 */
export function getAvailableActions(economy) {
  const available = [];
  if (!economy.actionUsed) available.push('action');
  if (!economy.bonusActionUsed) available.push('bonus_action');
  if (!economy.reactionUsed) available.push('reaction');
  if (economy.movementUsed < economy.maxMovement) available.push('movement');
  if (!economy.freeInteractionUsed) available.push('free_action');
  return available;
}

/**
 * Get remaining movement.
 */
export function getRemainingMovement(economy) {
  return Math.max(0, economy.maxMovement - economy.movementUsed);
}

/**
 * Check if all main actions are spent.
 */
export function isTurnFullyUsed(economy) {
  return economy.actionUsed && economy.bonusActionUsed && economy.movementUsed >= economy.maxMovement;
}

/**
 * Get a summary of what was done this turn.
 */
export function getTurnActionSummary(economy) {
  const parts = [];
  if (economy.actionUsed) parts.push('Action');
  if (economy.bonusActionUsed) parts.push('Bonus');
  if (economy.reactionUsed) parts.push('Reaction');
  if (economy.movementUsed > 0) parts.push(`${economy.movementUsed}ft moved`);
  return parts.length > 0 ? parts.join(', ') : 'No actions taken';
}
