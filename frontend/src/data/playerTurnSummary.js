/**
 * playerTurnSummary.js
 * Player Mode Improvements 151, 153, 166: Turn history log, monster turn summary, session recap
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// TURN LOG ENTRY
// ---------------------------------------------------------------------------

export const TURN_LOG_ENTRY_TEMPLATE = {
  round: 0,
  turnIndex: 0,
  actorName: '',
  isPlayer: false,
  actions: [],       // [{ type: 'attack', detail: 'Longsword vs Goblin: 18 to hit, 12 damage' }]
  timestamp: null,
};

// ---------------------------------------------------------------------------
// ACTION TYPES FOR LOGGING
// ---------------------------------------------------------------------------

export const TURN_ACTION_TYPES = {
  attack: { label: 'Attack', icon: 'swords', color: '#fca5a5' },
  spell: { label: 'Spell', icon: 'wand', color: '#c4b5fd' },
  move: { label: 'Movement', icon: 'footprints', color: '#4ade80' },
  item: { label: 'Item', icon: 'flask', color: '#86efac' },
  feature: { label: 'Feature', icon: 'sparkles', color: '#fde68a' },
  dodge: { label: 'Dodge', icon: 'shield', color: '#60a5fa' },
  dash: { label: 'Dash', icon: 'zap', color: '#fbbf24' },
  disengage: { label: 'Disengage', icon: 'arrow-right', color: '#86efac' },
  help: { label: 'Help', icon: 'users', color: '#f472b6' },
  hide: { label: 'Hide', icon: 'eye-off', color: '#a78bfa' },
  ready: { label: 'Ready', icon: 'clock', color: '#fbbf24' },
  grapple: { label: 'Grapple', icon: 'grip', color: '#f97316' },
  shove: { label: 'Shove', icon: 'arrow-right', color: '#d97706' },
  other: { label: 'Other', icon: 'circle', color: '#94a3b8' },
};

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Create a turn log entry.
 */
export function createTurnLogEntry(round, turnIndex, actorName, isPlayer = false) {
  return {
    ...TURN_LOG_ENTRY_TEMPLATE,
    round,
    turnIndex,
    actorName,
    isPlayer,
    actions: [],
    timestamp: Date.now(),
  };
}

/**
 * Add an action to a turn log entry.
 */
export function addActionToTurn(entry, actionType, detail) {
  return {
    ...entry,
    actions: [...entry.actions, { type: actionType, detail, timestamp: Date.now() }],
  };
}

/**
 * Generate a summary of a round.
 */
export function summarizeRound(turnEntries) {
  const lines = [];
  for (const entry of turnEntries) {
    if (entry.actions.length === 0) {
      lines.push(`${entry.actorName}: No actions`);
    } else {
      const actionSummary = entry.actions.map(a => {
        const type = TURN_ACTION_TYPES[a.type] || TURN_ACTION_TYPES.other;
        return `${type.label}: ${a.detail}`;
      }).join('; ');
      lines.push(`${entry.actorName}: ${actionSummary}`);
    }
  }
  return lines;
}

/**
 * Generate a session recap from all turn logs.
 */
export function generateSessionRecap(allTurnLogs, playerName) {
  const playerTurns = allTurnLogs.filter(t => t.actorName === playerName);
  const totalActions = playerTurns.reduce((sum, t) => sum + t.actions.length, 0);
  const totalRounds = new Set(allTurnLogs.map(t => t.round)).size;

  const actionCounts = {};
  for (const turn of playerTurns) {
    for (const action of turn.actions) {
      actionCounts[action.type] = (actionCounts[action.type] || 0) + 1;
    }
  }

  return {
    playerName,
    totalRounds,
    totalTurns: playerTurns.length,
    totalActions,
    actionBreakdown: actionCounts,
  };
}

/**
 * Get the last N turn entries for display.
 */
export function getRecentTurns(turnLogs, count = 10) {
  return turnLogs.slice(-count);
}
