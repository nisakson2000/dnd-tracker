/**
 * playerNPCInteraction.js
 * Player Mode: NPC interaction tracking, relationship levels, and notes
 * Pure JS — no React dependencies.
 */

export const RELATIONSHIP_LEVELS = [
  { level: -3, label: 'Nemesis', color: '#7f1d1d', description: 'Actively trying to destroy you.' },
  { level: -2, label: 'Hostile', color: '#dc2626', description: 'Opposes you. Will work against you.' },
  { level: -1, label: 'Unfriendly', color: '#f97316', description: 'Dislikes you. Won\'t help.' },
  { level: 0, label: 'Neutral', color: '#94a3b8', description: 'Indifferent. Might help for payment.' },
  { level: 1, label: 'Friendly', color: '#22c55e', description: 'Likes you. Will help within reason.' },
  { level: 2, label: 'Allied', color: '#3b82f6', description: 'Strong ally. Will go out of their way.' },
  { level: 3, label: 'Devoted', color: '#a855f7', description: 'Would risk their life for you.' },
];

export const NPC_TEMPLATE = {
  name: '',
  location: '',
  occupation: '',
  relationship: 0,
  notes: '',
  lastInteraction: null,
  questGiver: false,
  merchant: false,
  tags: [],
};

export function getRelationshipInfo(level) {
  return RELATIONSHIP_LEVELS.find(r => r.level === level) || RELATIONSHIP_LEVELS[3];
}

export function getRelationshipColor(level) {
  return getRelationshipInfo(level).color;
}

export function createNPC(name, location = '', occupation = '', relationship = 0) {
  return {
    ...NPC_TEMPLATE,
    name,
    location,
    occupation,
    relationship,
    lastInteraction: Date.now(),
  };
}

export function filterNPCsByRelationship(npcs, minLevel) {
  return npcs.filter(npc => npc.relationship >= minLevel);
}

export function searchNPCs(npcs, query) {
  const lc = query.toLowerCase();
  return npcs.filter(npc =>
    npc.name.toLowerCase().includes(lc) ||
    npc.location?.toLowerCase().includes(lc) ||
    npc.occupation?.toLowerCase().includes(lc) ||
    npc.notes?.toLowerCase().includes(lc)
  );
}
