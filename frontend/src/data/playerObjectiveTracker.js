/**
 * playerObjectiveTracker.js
 * Player Mode: Combat and quest objective tracking system
 * Pure JS — no React dependencies.
 */

export const COMBAT_OBJECTIVES = [
  { type: 'Eliminate All', description: 'Kill or incapacitate every enemy.', winCondition: 'All enemies at 0 HP, fled, or surrendered.', tactics: 'Focus fire. Efficient resource use. No need to rush.' },
  { type: 'Protect Target', description: 'Keep an NPC, object, or location safe.', winCondition: 'Target survives until combat ends or time expires.', tactics: 'Position between enemies and target. Use control spells. Tank for the target.' },
  { type: 'Escape', description: 'Get the party out alive.', winCondition: 'All party members reach the exit.', tactics: 'Dash, Disengage, cover retreat. Leave no one behind. Fog Cloud to cover.' },
  { type: 'Boss Kill', description: 'Defeat the primary threat.', winCondition: 'Boss at 0 HP.', tactics: 'Burn Legendary Resistances first. Focus all damage on boss. Ignore minions if possible.' },
  { type: 'Hold Position', description: 'Defend a location for a duration.', winCondition: 'Survive X rounds without losing position.', tactics: 'Chokepoint defense. AoE at approaches. Wall spells. Dodge when not attacking.' },
  { type: 'Capture', description: 'Take a target alive.', winCondition: 'Target subdued but alive.', tactics: 'Nonlethal damage on final blow. Sleep, Hold Person, grapple. No AoE near target.' },
  { type: 'Retrieve', description: 'Get an object and escape with it.', winCondition: 'Party possesses the item and is safe.', tactics: 'Speed is key. Grab and go. Dimension Door for extraction. Distraction team.' },
  { type: 'Survival', description: 'Last a set number of rounds until help arrives.', winCondition: 'At least one party member alive when time expires.', tactics: 'Defensive play. Dodge, heal, control. Don\'t waste resources on kills.' },
];

export const QUEST_STATUSES = [
  { status: 'Active', color: '#4caf50', description: 'Currently being pursued.' },
  { status: 'On Hold', color: '#ff9800', description: 'Known but not currently prioritized.' },
  { status: 'Completed', color: '#2196f3', description: 'Finished. Reward claimed.' },
  { status: 'Failed', color: '#f44336', description: 'Time ran out or conditions not met.' },
  { status: 'Abandoned', color: '#9e9e9e', description: 'Deliberately dropped.' },
];

export const QUEST_TEMPLATE = {
  id: '',
  name: '',
  description: '',
  givenBy: '',
  location: '',
  reward: '',
  deadline: '',
  status: 'Active',
  priority: 'Normal', // Low, Normal, High, Urgent
  notes: '',
  subObjectives: [],
  createdAt: '',
};

export const OBJECTIVE_PRIORITIES = [
  { priority: 'Urgent', color: '#f44336', description: 'Time-sensitive. Must address immediately or consequences occur.' },
  { priority: 'High', color: '#ff9800', description: 'Important. Should be addressed soon.' },
  { priority: 'Normal', color: '#4caf50', description: 'Standard priority. Address when convenient.' },
  { priority: 'Low', color: '#9e9e9e', description: 'Can wait. Nice to do but not critical.' },
];

export function createQuest(name, givenBy, description) {
  return {
    ...QUEST_TEMPLATE,
    id: `quest-${Date.now()}`,
    name,
    givenBy: givenBy || 'Unknown',
    description: description || '',
    createdAt: new Date().toISOString(),
  };
}

export function updateQuestStatus(quest, newStatus) {
  quest.status = newStatus;
  return quest;
}

export function getActiveQuests(quests) {
  return (quests || []).filter(q => q.status === 'Active');
}

export function getCombatObjective(type) {
  return COMBAT_OBJECTIVES.find(o =>
    o.type.toLowerCase().includes((type || '').toLowerCase())
  ) || null;
}

export function sortByPriority(quests) {
  const order = { Urgent: 0, High: 1, Normal: 2, Low: 3 };
  return [...(quests || [])].sort((a, b) => (order[a.priority] || 2) - (order[b.priority] || 2));
}
