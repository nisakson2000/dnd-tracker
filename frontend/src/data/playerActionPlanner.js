/**
 * playerActionPlanner.js
 * Player Mode Improvements 147, 150, 152: Ready action, pre-plan actions, held action triggers
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// READY ACTION RULES
// ---------------------------------------------------------------------------

export const READY_ACTION_RULES = {
  description: 'Use your action to ready a response to a specific trigger.',
  rules: [
    'Decide what perceivable circumstance will trigger your reaction.',
    'Choose the action or spell you will take in response.',
    'When the trigger occurs, use your reaction to take the readied action.',
    'You can choose NOT to take the readied action when the trigger occurs.',
  ],
  spellRules: [
    'Readying a spell requires concentration (even if the spell doesn\'t).',
    'The spell is cast normally but holds its energy until the trigger.',
    'The spell slot is expended when you ready it, not when you release it.',
    'If the trigger never occurs, the spell is wasted.',
  ],
};

// ---------------------------------------------------------------------------
// READY ACTION TEMPLATE
// ---------------------------------------------------------------------------

export const READY_ACTION_TEMPLATE = {
  trigger: '',        // "When the goblin opens the door..."
  action: '',         // "I attack with my longsword"
  isSpell: false,     // If true, requires concentration
  spellName: null,    // Name of readied spell
  active: false,      // Currently holding a readied action
  roundSet: 0,        // Round when the action was readied
};

// ---------------------------------------------------------------------------
// COMMON READY TRIGGERS
// ---------------------------------------------------------------------------

export const COMMON_TRIGGERS = [
  { id: 'enemy_moves', label: 'Enemy moves into range', example: 'When the orc moves within 5ft of me' },
  { id: 'enemy_attacks', label: 'Enemy attacks an ally', example: 'When the dragon attacks the cleric' },
  { id: 'door_opens', label: 'Door/entrance opens', example: 'When the door opens' },
  { id: 'enemy_casts', label: 'Enemy begins casting', example: 'When the mage starts casting a spell' },
  { id: 'ally_signal', label: 'Ally gives signal', example: 'When the rogue gives the signal' },
  { id: 'enemy_visible', label: 'Enemy becomes visible', example: 'When the invisible creature is revealed' },
  { id: 'object_interacted', label: 'Object is interacted with', example: 'When someone touches the altar' },
  { id: 'enemy_flees', label: 'Enemy tries to flee', example: 'When the bandit runs away' },
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Create a readied action.
 */
export function createReadyAction(trigger, action, currentRound, isSpell = false, spellName = null) {
  return {
    trigger,
    action,
    isSpell,
    spellName,
    active: true,
    roundSet: currentRound,
  };
}

/**
 * Check if readied action should expire (lasts until start of your next turn).
 */
export function isReadyActionExpired(readyAction, currentRound) {
  if (!readyAction || !readyAction.active) return true;
  return currentRound > readyAction.roundSet;
}
