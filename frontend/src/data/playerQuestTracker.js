// playerQuestTracker.js
// Player mode improvements 171-190: Quest & NPC tracking data for players
// Pure JS — no React

// ─── Quest Status ───────────────────────────────────────────────────────────

export const QUEST_STATUS_COLORS = {
  active: {
    color: '#c9a84c',
    iconHint: 'scroll',
    label: 'Active',
  },
  completed: {
    color: '#4ade80',
    iconHint: 'check-circle',
    label: 'Completed',
  },
  failed: {
    color: '#ef4444',
    iconHint: 'x-circle',
    label: 'Failed',
  },
  abandoned: {
    color: '#6b7280',
    iconHint: 'slash',
    label: 'Abandoned',
  },
  on_hold: {
    color: '#60a5fa',
    iconHint: 'pause-circle',
    label: 'On Hold',
  },
};

// ─── Quest Priority ──────────────────────────────────────────────────────────

export const QUEST_PRIORITY = {
  low: {
    color: '#6b7280',
    label: 'Low',
    description: 'Can wait',
    sortOrder: 3,
  },
  medium: {
    color: '#c9a84c',
    label: 'Medium',
    description: 'Should do soon',
    sortOrder: 2,
  },
  high: {
    color: '#ef4444',
    label: 'High',
    description: 'Urgent',
    sortOrder: 1,
  },
};

// ─── Quest Objective Template ────────────────────────────────────────────────

export const QUEST_OBJECTIVE_TEMPLATE = {
  id: '',
  description: '',
  completed: false,
  optional: false,
};

// ─── NPC Relationship Levels ─────────────────────────────────────────────────

export const NPC_RELATIONSHIP_LEVELS = {
  hostile: {
    value: -2,
    color: '#ef4444',
    label: 'Hostile',
    description: 'Actively wishes harm upon the party.',
    typicalBehavior: 'Attacks on sight, refuses all interaction, may alert others.',
  },
  unfriendly: {
    value: -1,
    color: '#f97316',
    label: 'Unfriendly',
    description: 'Distrustful and uncooperative.',
    typicalBehavior: 'Ignores requests, gives minimal information, may report the party.',
  },
  neutral: {
    value: 0,
    color: '#6b7280',
    label: 'Neutral',
    description: 'No strong feelings either way.',
    typicalBehavior: 'Standard reactions; responds to persuasion at face value.',
  },
  friendly: {
    value: 1,
    color: '#4ade80',
    label: 'Friendly',
    description: 'Likes and trusts the party.',
    typicalBehavior: 'Willing to help, shares useful information, gives benefit of the doubt.',
  },
  allied: {
    value: 2,
    color: '#60a5fa',
    label: 'Allied',
    description: 'Deep loyalty and mutual trust.',
    typicalBehavior: 'Goes out of their way to assist, keeps secrets, may risk themselves for the party.',
  },
};

// ─── NPC Note Template ───────────────────────────────────────────────────────

export const NPC_NOTE_TEMPLATE = {
  npcId: '',
  npcName: '',
  playerNotes: '',
  relationship: 'neutral',
  lastSeen: null,
  questsInvolved: [],
  giftsGiven: [],
  promisesMade: [],
};

// ─── Faction Display Template ────────────────────────────────────────────────

export const FACTION_DISPLAY = {
  factionName: '',
  standing: 'neutral',
  reputation: 0,
  color: '#6b7280',
};

// ─── Location Log Template ───────────────────────────────────────────────────

export const LOCATION_LOG_TEMPLATE = {
  id: '',
  name: '',
  type: '',
  discovered: false,
  notes: '',
  dangers: '',
  npcsHere: [],
  questsHere: [],
};

// ─── Rumor Template ──────────────────────────────────────────────────────────

export const RUMOR_TEMPLATE = {
  id: '',
  text: '',
  source: '',
  verified: false,
  category: '',
  session: 0,
};

// ─── Lore Entry Template ─────────────────────────────────────────────────────

export const LORE_ENTRY_TEMPLATE = {
  id: '',
  topic: '',
  content: '',
  source: '',
  discoveredSession: 0,
  category: '',
};

// ─── Helper: Generate ID ─────────────────────────────────────────────────────

function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Export Functions ────────────────────────────────────────────────────────

/**
 * Returns the status config for a given quest status key.
 * Falls back to the 'active' config if the key is unrecognized.
 */
export function getQuestStatusColor(status) {
  return QUEST_STATUS_COLORS[status] ?? QUEST_STATUS_COLORS.active;
}

/**
 * Returns the priority config for a given priority level key.
 * Falls back to 'medium' if the key is unrecognized.
 */
export function getQuestPriority(level) {
  return QUEST_PRIORITY[level] ?? QUEST_PRIORITY.medium;
}

/**
 * Creates a new quest objective with a generated ID.
 * @param {string} description - The objective text.
 * @param {boolean} [optional=false] - Whether the objective is optional.
 * @returns {object}
 */
export function createObjective(description, optional = false) {
  return {
    ...QUEST_OBJECTIVE_TEMPLATE,
    id: generateId('obj'),
    description,
    optional,
  };
}

/**
 * Returns the NPC relationship config for a given level key.
 * Falls back to 'neutral' if the key is unrecognized.
 */
export function getNPCRelationship(level) {
  return NPC_RELATIONSHIP_LEVELS[level] ?? NPC_RELATIONSHIP_LEVELS.neutral;
}

/**
 * Creates a new NPC note record.
 * @param {string} npcId - Unique identifier for the NPC.
 * @param {string} npcName - Display name of the NPC.
 * @returns {object}
 */
export function createNPCNote(npcId, npcName) {
  return {
    ...NPC_NOTE_TEMPLATE,
    npcId,
    npcName,
    questsInvolved: [],
    giftsGiven: [],
    promisesMade: [],
  };
}

/**
 * Creates a new location log entry with a generated ID.
 * @param {string} name - Name of the location.
 * @param {string} type - Type/category of location (e.g. 'dungeon', 'city', 'wilderness').
 * @returns {object}
 */
export function createLocationLog(name, type) {
  return {
    ...LOCATION_LOG_TEMPLATE,
    id: generateId('loc'),
    name,
    type,
    npcsHere: [],
    questsHere: [],
  };
}

/**
 * Creates a new rumor entry with a generated ID.
 * @param {string} text - The rumor text.
 * @param {string} [source=''] - Where/who the rumor came from.
 * @returns {object}
 */
export function createRumor(text, source = '') {
  return {
    ...RUMOR_TEMPLATE,
    id: generateId('rum'),
    text,
    source,
  };
}

/**
 * Creates a new lore entry with a generated ID.
 * @param {string} topic - Short topic title.
 * @param {string} content - Full lore text.
 * @param {string} [source=''] - Where this lore was learned.
 * @returns {object}
 */
export function createLoreEntry(topic, content, source = '') {
  return {
    ...LORE_ENTRY_TEMPLATE,
    id: generateId('lore'),
    topic,
    content,
    source,
  };
}

/**
 * Sorts an array of quest objects by priority (high → medium → low).
 * Quests with unrecognized priority values sort to the end.
 * Does not mutate the original array.
 * @param {Array<{priority: string}>} quests
 * @returns {Array}
 */
export function sortQuestsByPriority(quests) {
  return [...quests].sort((a, b) => {
    const orderA = QUEST_PRIORITY[a.priority]?.sortOrder ?? 99;
    const orderB = QUEST_PRIORITY[b.priority]?.sortOrder ?? 99;
    return orderA - orderB;
  });
}
