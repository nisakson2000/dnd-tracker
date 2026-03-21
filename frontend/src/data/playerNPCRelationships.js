/**
 * playerNPCRelationships.js
 * Player Mode: NPC relationship tracking and disposition
 * Pure JS — no React dependencies.
 */

export const NPC_DISPOSITIONS = [
  { disposition: 'Hostile', value: -2, color: '#ef4444', description: 'Actively working against the party.', socialDC: 'DC 20+ to improve. May attack on sight.' },
  { disposition: 'Unfriendly', value: -1, color: '#f97316', description: 'Distrustful, unhelpful, may hinder.', socialDC: 'DC 15-20 Persuasion/Deception to get cooperation.' },
  { disposition: 'Indifferent', value: 0, color: '#eab308', description: 'Neutral. Will help for fair payment.', socialDC: 'DC 10-15 for simple requests. Payment expected.' },
  { disposition: 'Friendly', value: 1, color: '#22c55e', description: 'Likes the party. Willing to help.', socialDC: 'DC 10 or lower for reasonable requests. May offer aid.' },
  { disposition: 'Allied', value: 2, color: '#3b82f6', description: 'Loyal friend or ally. Will take risks to help.', socialDC: 'No check needed for most requests. Will fight alongside party.' },
];

export const RELATIONSHIP_ACTIONS = [
  { action: 'Give a Gift', effect: '+1 disposition if appropriate and valued.', tip: 'Learn what the NPC wants or needs first.' },
  { action: 'Complete a Favor', effect: '+1 disposition per significant favor.', tip: 'Side quests from NPCs are opportunities to build relationships.' },
  { action: 'Betray Trust', effect: '-1 to -2 disposition immediately.', tip: 'Some NPCs never forgive betrayal.' },
  { action: 'Threaten', effect: 'May get compliance but -1 disposition.', tip: 'Intimidation works short-term but damages relationships.' },
  { action: 'Share Information', effect: '+1 if the info is valuable to the NPC.', tip: 'Information is currency in D&D social encounters.' },
  { action: 'Save Their Life', effect: '+1 to +2 disposition.', tip: 'Nothing builds trust like saving someone from danger.' },
  { action: 'Insult or Offend', effect: '-1 disposition.', tip: 'Know cultural norms — what\'s funny in one culture is offensive in another.' },
  { action: 'Spend Time Together', effect: 'Gradual +1 over time.', tip: 'Downtime activities with NPCs build relationships naturally.' },
];

export const NPC_TRACKER_TEMPLATE = {
  name: '',
  location: '',
  disposition: 0,
  notes: '',
  questsGiven: [],
  favorsOwed: [],
  lastInteraction: '',
  knownInfo: '',
};

export function getDisposition(value) {
  return NPC_DISPOSITIONS.find(d => d.value === value) || NPC_DISPOSITIONS[2];
}

export function changeDisposition(current, change) {
  return Math.max(-2, Math.min(2, current + change));
}

export function createNPCEntry(name, location, disposition = 0) {
  return { ...NPC_TRACKER_TEMPLATE, name, location, disposition };
}
