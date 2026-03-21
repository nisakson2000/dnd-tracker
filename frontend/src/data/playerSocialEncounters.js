/**
 * playerSocialEncounters.js
 * Player Mode: Social encounter helpers for player mode
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// SOCIAL SKILLS QUICK REFERENCE
// ---------------------------------------------------------------------------

export const SOCIAL_SKILLS = [
  { skill: 'Persuasion', ability: 'CHA', description: 'Convince through tact, social graces, or good nature. Requests made in good faith.', tips: ['State your argument clearly', 'Offer something in return', 'Appeal to their interests'] },
  { skill: 'Deception', ability: 'CHA', description: 'Mislead through words, actions, or disguise. Hide the truth.', tips: ['Mix truth with lies', 'Stay calm and confident', 'Have a backup story'] },
  { skill: 'Intimidation', ability: 'CHA', description: 'Influence through threats, hostile actions, or physical presence.', tips: ['Show strength, not desperation', 'Be specific about consequences', 'Follow through on threats'] },
  { skill: 'Performance', ability: 'CHA', description: 'Delight an audience with music, dance, acting, or storytelling.', tips: ['Know your audience', 'Start strong', 'Practice makes perfect'] },
  { skill: 'Insight', ability: 'WIS', description: 'Determine the true intentions of a creature. Detect lies or predict behavior.', tips: ['Watch body language', 'Listen for inconsistencies', 'Ask probing questions'] },
];

// ---------------------------------------------------------------------------
// NPC ATTITUDE SCALE (for players to track)
// ---------------------------------------------------------------------------

export const NPC_ATTITUDES = [
  { id: 'hostile', label: 'Hostile', color: '#ef4444', dcMod: 5, description: 'Actively working against the party. DC 20+ to change.' },
  { id: 'unfriendly', label: 'Unfriendly', color: '#f97316', dcMod: 3, description: 'Distrustful, unhelpful. DC 15-20 for minor requests.' },
  { id: 'indifferent', label: 'Indifferent', color: '#6b7280', dcMod: 0, description: 'No strong feelings. DC 10-15 for reasonable requests.' },
  { id: 'friendly', label: 'Friendly', color: '#4ade80', dcMod: -2, description: 'Well-disposed. DC 5-10 for most requests.' },
  { id: 'allied', label: 'Allied', color: '#60a5fa', dcMod: -5, description: 'Loyal supporter. Will go out of their way to help.' },
];

// ---------------------------------------------------------------------------
// ROLEPLAY PROMPTS
// ---------------------------------------------------------------------------

export const ROLEPLAY_PROMPTS = [
  'What would your character do differently than you?',
  'How does your character feel about what just happened?',
  'What does your character notice that others might miss?',
  'Does this situation remind your character of anything from their past?',
  'What would your character say to the NPC in private?',
  'How does your character react when no one is watching?',
  'What is your character\'s first instinct right now?',
  'Does your character trust this NPC? Why or why not?',
];

/**
 * Get a random roleplay prompt.
 */
export function getRandomPrompt() {
  return ROLEPLAY_PROMPTS[Math.floor(Math.random() * ROLEPLAY_PROMPTS.length)];
}
