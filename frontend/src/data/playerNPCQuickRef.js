/**
 * playerNPCQuickRef.js
 * Player Mode: NPC quick reference for player interaction tracking
 * Pure JS — no React dependencies.
 */

export const NPC_TEMPLATE = {
  name: '',
  location: '',
  occupation: '',
  attitude: 'Indifferent', // Hostile, Unfriendly, Indifferent, Friendly, Allied
  notes: '',
  questGiver: false,
  shopkeeper: false,
  lastInteraction: null,
  knownInfo: [],
  favors: { owed: 0, given: 0 },
};

export const ATTITUDE_COLORS = {
  Hostile: '#f44336',
  Unfriendly: '#ff9800',
  Indifferent: '#ffc107',
  Friendly: '#8bc34a',
  Allied: '#4caf50',
};

export const ATTITUDE_SHIFT_ACTIONS = [
  { action: 'Complete a quest for them', shift: '+1 to +2', note: 'Best way to improve relations.' },
  { action: 'Gift appropriate items/gold', shift: '+1', note: 'Know what they value first.' },
  { action: 'Help their allies/cause', shift: '+1', note: 'Indirect favors build trust.' },
  { action: 'Save their life', shift: '+2', note: 'Creates a strong bond.' },
  { action: 'Threaten or intimidate', shift: '-1 to -2', note: 'May work short-term but damages relationship.' },
  { action: 'Lie (and get caught)', shift: '-1 to -2', note: 'Trust is hard to rebuild.' },
  { action: 'Break a promise', shift: '-2', note: 'One of the worst things you can do for relations.' },
  { action: 'Harm their allies', shift: '-2 to -3', note: 'May make them permanently hostile.' },
];

export const NPC_INTERACTION_TIPS = [
  'Write down NPC names immediately. You WILL forget.',
  'Note what they want — every NPC has desires you can leverage.',
  'Track favors. "Remember when I saved your shop?" is powerful.',
  'Attitude is a spectrum. One bad interaction doesn\'t make them hostile.',
  'Shopkeepers remember good customers. Build relationships for discounts.',
  'Quest givers may have more quests if you impress them.',
  'NPCs talk to each other. Your reputation in a town is collective.',
];

export function createNPC(name, location, occupation) {
  return {
    ...NPC_TEMPLATE,
    name,
    location,
    occupation,
    lastInteraction: Date.now(),
  };
}

export function getAttitudeColor(attitude) {
  return ATTITUDE_COLORS[attitude] || ATTITUDE_COLORS.Indifferent;
}

export function shiftAttitude(currentAttitude, direction) {
  const scale = ['Hostile', 'Unfriendly', 'Indifferent', 'Friendly', 'Allied'];
  const currentIdx = scale.indexOf(currentAttitude);
  const newIdx = Math.max(0, Math.min(scale.length - 1, currentIdx + direction));
  return scale[newIdx];
}
