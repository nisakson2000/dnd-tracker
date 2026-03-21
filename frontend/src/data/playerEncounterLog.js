/**
 * playerEncounterLog.js
 * Player Mode: Encounter logging and session-to-session tracking
 * Pure JS — no React dependencies.
 */

export const ENCOUNTER_TEMPLATE = {
  id: '',
  sessionNumber: 0,
  encounterNumber: 0,
  type: 'combat', // combat, social, exploration, puzzle
  name: '',
  location: '',
  enemies: [],
  allies: [],
  outcome: '', // victory, defeat, retreat, negotiated, avoided
  rounds: 0,
  difficulty: '', // easy, medium, hard, deadly
  loot: { gold: 0, items: [], xp: 0 },
  notes: '',
  timestamp: '',
};

export const ENCOUNTER_TYPES = [
  { type: 'combat', icon: '⚔️', description: 'Armed conflict with enemies', logFields: ['enemies', 'rounds', 'outcome', 'loot'] },
  { type: 'social', icon: '🗣️', description: 'NPC interaction, negotiation, interrogation', logFields: ['npcName', 'approach', 'outcome', 'information'] },
  { type: 'exploration', icon: '🗺️', description: 'Discovering new areas, navigating hazards', logFields: ['location', 'discoveries', 'hazards', 'resources'] },
  { type: 'puzzle', icon: '🧩', description: 'Puzzle, riddle, or challenge solved', logFields: ['puzzleType', 'solution', 'reward', 'timeSpent'] },
  { type: 'trap', icon: '⚠️', description: 'Trap encountered (detected or triggered)', logFields: ['trapType', 'damage', 'disarmed', 'method'] },
  { type: 'rest', icon: '🏕️', description: 'Short or long rest taken', logFields: ['restType', 'hitDiceSpent', 'interruption', 'recovery'] },
];

export const SESSION_TRACKER = {
  sessionTemplate: {
    sessionNumber: 0,
    date: '',
    encounters: [],
    totalXP: 0,
    totalGold: 0,
    itemsFound: [],
    partyLevel: 0,
    notes: '',
  },
};

export const LOG_CATEGORIES = [
  { category: 'Kill Log', tracks: 'Enemies defeated by the party', use: 'Track enemy types for creature knowledge' },
  { category: 'Loot Log', tracks: 'All items and gold found', use: 'Keep track of total wealth and items' },
  { category: 'NPC Log', tracks: 'NPCs met and their dispositions', use: 'Remember who you\'ve talked to and their attitude' },
  { category: 'Location Log', tracks: 'Places visited and explored', use: 'Build a mental map of the world' },
  { category: 'Quest Log', tracks: 'Active and completed quests', use: 'Don\'t forget what you\'re supposed to be doing' },
  { category: 'Death Log', tracks: 'Party member deaths and resurrections', use: 'Sobering reminder of the stakes' },
];

export function createEncounter(sessionNumber, encounterNumber, type) {
  return {
    ...ENCOUNTER_TEMPLATE,
    id: `s${sessionNumber}-e${encounterNumber}`,
    sessionNumber,
    encounterNumber,
    type: type || 'combat',
    timestamp: new Date().toISOString(),
  };
}

export function createSession(sessionNumber, date) {
  return {
    ...SESSION_TRACKER.sessionTemplate,
    sessionNumber,
    date: date || new Date().toISOString().split('T')[0],
  };
}

export function addEncounterToSession(session, encounter) {
  session.encounters.push(encounter);
  if (encounter.loot) {
    session.totalXP += encounter.loot.xp || 0;
    session.totalGold += encounter.loot.gold || 0;
    session.itemsFound.push(...(encounter.loot.items || []));
  }
  return session;
}

export function getEncountersByType(encounters, type) {
  return (encounters || []).filter(e => e.type === type);
}

export function getSessionSummary(session) {
  return {
    encounters: session.encounters.length,
    combats: session.encounters.filter(e => e.type === 'combat').length,
    totalXP: session.totalXP,
    totalGold: session.totalGold,
    items: session.itemsFound.length,
  };
}
