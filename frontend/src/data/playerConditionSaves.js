/**
 * playerConditionSaves.js
 * Player Mode Improvements 154-155: Auto-prompt start/end of turn saves for conditions
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// CONDITIONS REQUIRING SAVES
// ---------------------------------------------------------------------------

export const START_OF_TURN_CONDITIONS = [
  {
    id: 'burning',
    label: 'On Fire',
    save: null,
    effect: 'Take fire damage at the start of your turn.',
    action: 'Use an action to extinguish the flames.',
  },
  {
    id: 'crown_of_madness',
    label: 'Crown of Madness',
    save: 'WIS',
    effect: 'Must use action to make melee attack against nearest creature (DM chooses).',
    onSuccess: 'Spell ends.',
  },
  {
    id: 'hunger_of_hadar_start',
    label: 'Hunger of Hadar',
    save: null,
    effect: 'Take 2d6 cold damage at the start of your turn if inside the sphere.',
  },
];

export const END_OF_TURN_CONDITIONS = [
  {
    id: 'hold_person',
    label: 'Hold Person / Paralyzed',
    save: 'WIS',
    effect: 'Paralyzed — cannot move or take actions.',
    onSuccess: 'Spell ends. You can move and act normally.',
  },
  {
    id: 'frightened',
    label: 'Frightened',
    save: 'WIS',
    effect: 'Disadvantage on ability checks and attacks while source is in line of sight. Cannot willingly move closer.',
    onSuccess: 'No longer frightened.',
  },
  {
    id: 'stunned',
    label: 'Stunned',
    save: 'CON',
    effect: 'Cannot take actions or reactions. Auto-fail STR and DEX saves. Attacks have advantage.',
    onSuccess: 'No longer stunned.',
  },
  {
    id: 'restrained_web',
    label: 'Restrained (Web)',
    save: 'STR',
    effect: 'Speed 0, attack rolls have disadvantage, advantage on attacks against you.',
    onSuccess: 'Break free of the web.',
    alternative: 'Or use an action to make a STR check (DC = spell save DC).',
  },
  {
    id: 'charmed',
    label: 'Charmed',
    save: 'WIS',
    effect: 'Cannot attack the charmer. Charmer has advantage on social checks.',
    onSuccess: 'No longer charmed.',
  },
  {
    id: 'poisoned',
    label: 'Poisoned',
    save: 'CON',
    effect: 'Disadvantage on attack rolls and ability checks.',
    onSuccess: 'Condition ends.',
  },
  {
    id: 'petrified_progressing',
    label: 'Turning to Stone',
    save: 'CON',
    effect: 'If you fail this save again, you are petrified permanently.',
    onSuccess: 'No longer turning to stone.',
  },
  {
    id: 'banished',
    label: 'Banished',
    save: 'CHA',
    effect: 'Banished to a harmless demiplane or home plane.',
    onSuccess: 'Return to the space you left (if concentration ends).',
    note: 'Save is made at time of casting, not each turn.',
  },
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Get applicable start-of-turn conditions for the character.
 */
export function getStartOfTurnSaves(activeConditions) {
  const condNames = activeConditions.map(c => typeof c === 'string' ? c.toLowerCase() : (c.name || '').toLowerCase());
  return START_OF_TURN_CONDITIONS.filter(c => {
    return condNames.some(name => name.includes(c.id.replace(/_/g, ' ')) || name.includes(c.label.toLowerCase()));
  });
}

/**
 * Get applicable end-of-turn conditions for the character.
 */
export function getEndOfTurnSaves(activeConditions) {
  const condNames = activeConditions.map(c => typeof c === 'string' ? c.toLowerCase() : (c.name || '').toLowerCase());
  return END_OF_TURN_CONDITIONS.filter(c => {
    return condNames.some(name => {
      const label = c.label.toLowerCase();
      const id = c.id.replace(/_/g, ' ');
      return name.includes(label) || name.includes(id) || label.includes(name);
    });
  });
}

/**
 * Get all conditions requiring saves this turn.
 */
export function getAllTurnSaves(activeConditions) {
  return {
    startOfTurn: getStartOfTurnSaves(activeConditions),
    endOfTurn: getEndOfTurnSaves(activeConditions),
  };
}
