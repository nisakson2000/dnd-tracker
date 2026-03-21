/**
 * playerMorale.js
 * Player Mode: Party morale tracking and roleplay prompts
 * Pure JS — no React dependencies.
 */

export const MORALE_STATES = [
  { state: 'Triumphant', value: 5, color: '#22c55e', description: 'Major victory! Party is confident and energized.', rpPrompts: ['Celebrate the victory!', 'Toast to fallen enemies.', 'Share war stories around the fire.'] },
  { state: 'Confident', value: 4, color: '#86efac', description: 'Things are going well. Resources are healthy.', rpPrompts: ['Plan the next move with optimism.', 'Help a struggling party member.', 'Take a moment to enjoy the journey.'] },
  { state: 'Steady', value: 3, color: '#eab308', description: 'Neutral. No strong feelings either way.', rpPrompts: ['Stay focused on the mission.', 'Check in with party members.', 'Review the plan.'] },
  { state: 'Worried', value: 2, color: '#f97316', description: 'Resources are low or situation looks grim.', rpPrompts: ['Express concern about the dangers ahead.', 'Suggest a short rest to regroup.', 'Share a personal fear or doubt.'] },
  { state: 'Desperate', value: 1, color: '#ef4444', description: 'Party is in serious trouble. Retreat may be wise.', rpPrompts: ['Make a rallying speech.', 'Consider retreat or negotiation.', 'Pray to your deity for guidance.', 'Make peace with potential consequences.'] },
];

export const MORALE_BOOSTERS = [
  'Winning a tough combat encounter',
  'Completing a quest objective',
  'Finding valuable treasure or magic items',
  'Successful long rest in a safe location',
  'NPC ally joins or provides aid',
  'Bardic Inspiration or Heroes\' Feast',
  'Character achieves a personal goal',
  'Clever plan succeeds',
];

export const MORALE_REDUCERS = [
  'Party member goes unconscious',
  'Failed death saves or character death',
  'Major quest setback or betrayal',
  'Resources critically low (spell slots, HP, items)',
  'Lost or hopelessly confused',
  'NPC ally dies or is captured',
  'Overwhelming enemy forces',
  'Consecutive failed ability checks',
];

export function getMoraleState(value) {
  return MORALE_STATES.find(m => m.value === value) || MORALE_STATES[2];
}

export function suggestMorale(partyStatus) {
  const { avgHPPercent, downMembers, questProgress, recentVictory } = partyStatus;
  if (recentVictory && avgHPPercent > 70) return 5;
  if (avgHPPercent > 60 && downMembers === 0) return 4;
  if (avgHPPercent > 35) return 3;
  if (avgHPPercent > 15 || downMembers > 0) return 2;
  return 1;
}
