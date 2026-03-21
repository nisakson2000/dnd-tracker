/**
 * playerReputationSystem.js
 * Player Mode: Faction/town reputation tracking
 * Pure JS — no React dependencies.
 */

export const REPUTATION_LEVELS = [
  { level: -3, label: 'Hated', color: '#7f1d1d', description: 'Kill on sight. Bounties posted. No services available.', effects: 'Prices +100%. Guards attack. NPCs refuse interaction.' },
  { level: -2, label: 'Hostile', color: '#ef4444', description: 'Actively working against the party. May ambush or sabotage.', effects: 'Prices +50%. Refused entry. Social checks at disadvantage.' },
  { level: -1, label: 'Unfriendly', color: '#f97316', description: 'Distrustful. Will hinder if it doesn\'t cost them.', effects: 'Prices +25%. Information withheld. Cold reception.' },
  { level: 0, label: 'Neutral', color: '#6b7280', description: 'No opinion. Standard business dealings.', effects: 'Normal prices. Normal interactions. No special treatment.' },
  { level: 1, label: 'Friendly', color: '#22c55e', description: 'Favorable opinion. Willing to help within reason.', effects: 'Prices -10%. Free rumors/info. Warm reception.' },
  { level: 2, label: 'Allied', color: '#3b82f6', description: 'Strong ally. Will take risks to help.', effects: 'Prices -25%. Safe houses. Military/political support.' },
  { level: 3, label: 'Revered', color: '#a855f7', description: 'Heroes of legend. Celebrated and honored.', effects: 'Free lodging. Gifts. Followers. Political influence.' },
];

export const REPUTATION_ACTIONS = [
  { action: 'Complete a Quest', change: '+1', note: 'Depends on quest importance and publicity.' },
  { action: 'Save the Town', change: '+2', note: 'Major public victory with many witnesses.' },
  { action: 'Donate Gold (100+ gp)', change: '+1', note: 'Must be public and to a cause they care about.' },
  { action: 'Betray an Ally', change: '-2', note: 'Word spreads fast. Hard to recover.' },
  { action: 'Murder a Citizen', change: '-3', note: 'Immediate hostility if discovered.' },
  { action: 'Steal from Faction', change: '-1 to -2', note: 'Depends on what was stolen and if caught.' },
  { action: 'Win a Tournament', change: '+1', note: 'Public events build reputation quickly.' },
  { action: 'Resolve a Dispute', change: '+1', note: 'Peaceful resolution earns respect.' },
  { action: 'Spread Bad Rumors', change: '-1', note: 'Deception check to avoid getting caught.' },
  { action: 'Time (per month)', change: '-1 toward 0', note: 'Reputation fades toward neutral over time without reinforcement.' },
];

export const FACTION_TRACKER_TEMPLATE = {
  name: '',
  reputation: 0,
  notes: '',
  questsCompleted: [],
  keyNPCs: [],
  lastInteraction: '',
};

export function getReputationLevel(rep) {
  const clamped = Math.max(-3, Math.min(3, rep));
  return REPUTATION_LEVELS.find(r => r.level === clamped) || REPUTATION_LEVELS[3];
}

export function changeReputation(current, change) {
  return Math.max(-3, Math.min(3, current + change));
}

export function getPriceModifier(reputation) {
  const level = getReputationLevel(reputation);
  if (reputation <= -3) return 2.0;
  if (reputation === -2) return 1.5;
  if (reputation === -1) return 1.25;
  if (reputation === 0) return 1.0;
  if (reputation === 1) return 0.9;
  if (reputation === 2) return 0.75;
  return 0.5; // revered
}
