/**
 * playerFactionTracker.js
 * Player Mode Improvements 183-184: Faction reputation display and relationship chart
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// REPUTATION LEVELS
// ---------------------------------------------------------------------------

export const REPUTATION_LEVELS = [
  { id: 'hostile', label: 'Hostile', value: -3, color: '#ef4444', description: 'Actively works against you. May attack on sight.' },
  { id: 'unfriendly', label: 'Unfriendly', value: -2, color: '#f97316', description: 'Distrusts you. Will not help willingly.' },
  { id: 'indifferent', label: 'Indifferent', value: -1, color: '#94a3b8', description: 'No strong feelings. Default starting attitude.' },
  { id: 'neutral', label: 'Neutral', value: 0, color: '#fbbf24', description: 'Aware of you. May help for compensation.' },
  { id: 'friendly', label: 'Friendly', value: 1, color: '#4ade80', description: 'Favorable attitude. Will help if not risky.' },
  { id: 'allied', label: 'Allied', value: 2, color: '#60a5fa', description: 'Strong alliance. Will actively support you.' },
  { id: 'devoted', label: 'Devoted', value: 3, color: '#a78bfa', description: 'Unwavering loyalty. Will sacrifice for you.' },
];

// ---------------------------------------------------------------------------
// FACTION TEMPLATE
// ---------------------------------------------------------------------------

export const FACTION_TEMPLATE = {
  name: '',
  description: '',
  leader: '',
  headquarters: '',
  reputation: 'neutral',
  reputationScore: 0,
  notes: '',
  knownMembers: [],
  relatedQuests: [],
  discoveredDate: null,
};

// ---------------------------------------------------------------------------
// COMMON FACTIONS (D&D 5e Forgotten Realms)
// ---------------------------------------------------------------------------

export const COMMON_FACTIONS = [
  { name: 'Harpers', description: 'Secret network opposing tyranny and promoting balance.', symbol: 'harp' },
  { name: 'Order of the Gauntlet', description: 'Paladins and clerics fighting evil directly.', symbol: 'gauntlet' },
  { name: 'Emerald Enclave', description: 'Druids and rangers preserving the natural order.', symbol: 'leaf' },
  { name: 'Lords\' Alliance', description: 'Coalition of rulers from major cities.', symbol: 'crown' },
  { name: 'Zhentarim', description: 'Shadow network seeking wealth and power.', symbol: 'snake' },
  { name: 'Red Wizards of Thay', description: 'Powerful wizard cabal from Thay.', symbol: 'skull' },
  { name: 'Cult of the Dragon', description: 'Dragon worshippers seeking to raise dracoliches.', symbol: 'dragon' },
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Get reputation level info.
 */
export function getReputationInfo(reputationId) {
  return REPUTATION_LEVELS.find(r => r.id === reputationId) || REPUTATION_LEVELS[3]; // default neutral
}

/**
 * Get reputation by numeric score.
 */
export function getReputationByScore(score) {
  if (score <= -3) return REPUTATION_LEVELS[0];
  if (score <= -2) return REPUTATION_LEVELS[1];
  if (score <= -1) return REPUTATION_LEVELS[2];
  if (score <= 0) return REPUTATION_LEVELS[3];
  if (score <= 1) return REPUTATION_LEVELS[4];
  if (score <= 2) return REPUTATION_LEVELS[5];
  return REPUTATION_LEVELS[6];
}

/**
 * Create a faction entry.
 */
export function createFaction(name, description = '') {
  return {
    ...FACTION_TEMPLATE,
    name,
    description,
    discoveredDate: Date.now(),
  };
}
