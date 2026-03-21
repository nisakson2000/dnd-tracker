/**
 * playerQuestObjectives.js
 * Player Mode Improvements 172-177: Quest objectives, priority, rewards, deadlines
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// QUEST OBJECTIVE TEMPLATE
// ---------------------------------------------------------------------------

export const QUEST_OBJECTIVE_TEMPLATE = {
  id: '',
  questId: '',
  text: '',
  completed: false,
  optional: false,
  order: 0,
};

// ---------------------------------------------------------------------------
// QUEST PRIORITY LEVELS
// ---------------------------------------------------------------------------

export const QUEST_PRIORITIES = [
  { id: 'critical', label: 'Critical', color: '#ef4444', icon: 'alert-circle', description: 'Must complete ASAP — failure has severe consequences' },
  { id: 'high', label: 'High', color: '#f97316', icon: 'arrow-up', description: 'Important quest, should prioritize' },
  { id: 'medium', label: 'Medium', color: '#fbbf24', icon: 'minus', description: 'Standard quest, complete when convenient' },
  { id: 'low', label: 'Low', color: '#60a5fa', icon: 'arrow-down', description: 'Side quest, no urgency' },
  { id: 'optional', label: 'Optional', color: '#94a3b8', icon: 'circle', description: 'Completely optional, bonus content' },
];

// ---------------------------------------------------------------------------
// QUEST REWARD TYPES
// ---------------------------------------------------------------------------

export const REWARD_TYPES = [
  { id: 'gold', label: 'Gold', color: '#fbbf24', icon: 'coins' },
  { id: 'item', label: 'Item', color: '#60a5fa', icon: 'package' },
  { id: 'xp', label: 'Experience', color: '#a78bfa', icon: 'star' },
  { id: 'reputation', label: 'Reputation', color: '#4ade80', icon: 'users' },
  { id: 'information', label: 'Information', color: '#f472b6', icon: 'info' },
  { id: 'favor', label: 'Favor', color: '#fde68a', icon: 'handshake' },
  { id: 'land', label: 'Land/Property', color: '#86efac', icon: 'home' },
  { id: 'other', label: 'Other', color: '#94a3b8', icon: 'gift' },
];

// ---------------------------------------------------------------------------
// EXTENDED QUEST TEMPLATE
// ---------------------------------------------------------------------------

export const EXTENDED_QUEST_TEMPLATE = {
  id: '',
  name: '',
  description: '',
  status: 'active',      // active, completed, failed, abandoned
  priority: 'medium',
  giver: '',             // NPC who gave the quest
  giverLocation: '',
  objectives: [],        // QUEST_OBJECTIVE_TEMPLATE[]
  rewards: [],           // { type, description, amount }
  deadline: null,        // Session or in-game date
  location: '',          // Where to go
  notes: '',
  discoveredSession: null,
  completedSession: null,
  timestamp: null,
};

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Create an objective.
 */
export function createObjective(questId, text, optional = false) {
  return {
    ...QUEST_OBJECTIVE_TEMPLATE,
    id: `obj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    questId,
    text,
    optional,
    order: Date.now(),
  };
}

/**
 * Calculate quest completion percentage.
 */
export function getQuestProgress(objectives) {
  if (!objectives || objectives.length === 0) return 0;
  const required = objectives.filter(o => !o.optional);
  if (required.length === 0) return objectives.some(o => o.completed) ? 100 : 0;
  const completed = required.filter(o => o.completed).length;
  return Math.round((completed / required.length) * 100);
}

/**
 * Get priority info.
 */
export function getPriorityInfo(priorityId) {
  return QUEST_PRIORITIES.find(p => p.id === priorityId) || QUEST_PRIORITIES[2];
}

/**
 * Sort quests by priority.
 */
export function sortQuestsByPriority(quests) {
  const order = { critical: 0, high: 1, medium: 2, low: 3, optional: 4 };
  return [...quests].sort((a, b) => (order[a.priority] || 2) - (order[b.priority] || 2));
}

/**
 * Get quests with deadlines approaching (within N sessions).
 */
export function getUrgentQuests(quests, currentSession, withinSessions = 2) {
  return quests.filter(q => {
    if (!q.deadline || q.status !== 'active') return false;
    return q.deadline <= currentSession + withinSessions;
  });
}
