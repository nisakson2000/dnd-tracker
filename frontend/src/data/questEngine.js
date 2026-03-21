/**
 * Quest Engine — Quest Management, Dependencies, Stale Detection
 *
 * Covers roadmap items 168-179 (Stale quest detection, Plot thread analyzer,
 * Quest dependency graph, Quest deadlines, Auto plot hooks, Quest rewards,
 * Quest branching, Failed quest consequences).
 */

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ── Quest Status Flow ──
export const QUEST_STATUSES = [
  { id: 'unknown', label: 'Unknown', description: 'Quest exists in the world but party hasn\'t discovered it.', color: '#374151', icon: 'help-circle' },
  { id: 'discovered', label: 'Discovered', description: 'Party knows about this quest but hasn\'t accepted it.', color: '#6b7280', icon: 'search' },
  { id: 'active', label: 'Active', description: 'Party is working on this quest.', color: '#3b82f6', icon: 'play' },
  { id: 'stale', label: 'Stale', description: 'No progress in 3+ sessions. Risk of expiring.', color: '#eab308', icon: 'clock' },
  { id: 'completed', label: 'Completed', description: 'Quest objectives fulfilled.', color: '#22c55e', icon: 'check-circle' },
  { id: 'failed', label: 'Failed', description: 'Quest timed out or party failed objectives.', color: '#ef4444', icon: 'x-circle' },
  { id: 'abandoned', label: 'Abandoned', description: 'Party chose to drop this quest.', color: '#78716c', icon: 'trash-2' },
];

// ── Quest Types ──
export const QUEST_TYPES = [
  { id: 'main', label: 'Main Quest', priority: 1, color: '#fbbf24', description: 'Core story arc. Critical to campaign.' },
  { id: 'side', label: 'Side Quest', priority: 2, color: '#60a5fa', description: 'Optional but rewarding. Builds world depth.' },
  { id: 'personal', label: 'Personal Quest', priority: 2, color: '#a78bfa', description: 'Tied to a specific PC\'s backstory or bonds.' },
  { id: 'faction', label: 'Faction Quest', priority: 3, color: '#34d399', description: 'Given by or related to a specific faction.' },
  { id: 'bounty', label: 'Bounty', priority: 3, color: '#f87171', description: 'Kill or capture a target for reward.' },
  { id: 'fetch', label: 'Fetch Quest', priority: 4, color: '#94a3b8', description: 'Retrieve an item from somewhere.' },
  { id: 'escort', label: 'Escort Quest', priority: 3, color: '#fb923c', description: 'Protect someone on a journey.' },
  { id: 'mystery', label: 'Mystery', priority: 2, color: '#c084fc', description: 'Investigate and solve a puzzle or crime.' },
];

// ── Quest Reward Guidelines ──
export const QUEST_REWARDS_BY_DIFFICULTY = {
  trivial: { xpMultiplier: 0.25, goldRange: '10-50 gp', items: 'Consumables only', description: 'Quick favor, small task' },
  easy: { xpMultiplier: 0.5, goldRange: '50-200 gp', items: 'Common items', description: 'Simple quest, low risk' },
  medium: { xpMultiplier: 1.0, goldRange: '200-500 gp', items: 'Uncommon items', description: 'Standard adventure, moderate risk' },
  hard: { xpMultiplier: 2.0, goldRange: '500-2000 gp', items: 'Rare items', description: 'Dangerous quest, significant risk' },
  deadly: { xpMultiplier: 3.0, goldRange: '2000-10000 gp', items: 'Very Rare items', description: 'Epic quest, extreme danger' },
  legendary: { xpMultiplier: 5.0, goldRange: '10000+ gp', items: 'Legendary items', description: 'World-changing quest, ultimate challenge' },
};

// ── Failed Quest Consequences ──
export const FAILURE_CONSEQUENCES = [
  { type: 'reputation', description: 'Party reputation decreases in the region. NPCs are less helpful.', severity: 'medium' },
  { type: 'villain_advance', description: 'The villain\'s plan advances one stage. Clock ticks forward.', severity: 'high' },
  { type: 'npc_death', description: 'An NPC the party was supposed to save dies. Ripple effects.', severity: 'high' },
  { type: 'resource_loss', description: 'Resources the quest would have secured are lost — treasure, territory, allies.', severity: 'medium' },
  { type: 'enemy_strengthens', description: 'The enemy gains what the party failed to prevent — troops, artifacts, alliances.', severity: 'high' },
  { type: 'economic', description: 'Trade routes close, prices increase, merchants leave the area.', severity: 'medium' },
  { type: 'political', description: 'A faction loses faith in the party. Alliance weakened or broken.', severity: 'medium' },
  { type: 'natural_disaster', description: 'The unchecked crisis causes environmental damage — flooding, corruption, wildfire.', severity: 'high' },
  { type: 'new_quest', description: 'The failure creates a new, harder quest to deal with the consequences.', severity: 'low' },
  { type: 'civilian_casualties', description: 'Innocents die because the party didn\'t act in time.', severity: 'high' },
];

// ── Auto Plot Hooks (item 173) ──
export const PLOT_HOOK_TEMPLATES = [
  { template: 'A messenger arrives with urgent news about {quest} — the deadline has moved up.', trigger: 'quest_stale' },
  { template: 'An NPC the party recently helped offers information about {quest}.', trigger: 'npc_interaction' },
  { template: 'Strange signs appear — {quest_detail} — hinting at the unresolved {quest}.', trigger: 'atmosphere' },
  { template: 'A rival adventuring party has taken an interest in {quest}. Competition looms.', trigger: 'urgency' },
  { template: 'A dream or vision shows one PC a clue about {quest}.', trigger: 'personal' },
  { template: 'The consequences of ignoring {quest} manifest — {consequence}.', trigger: 'escalation' },
  { template: 'A traveler shares a rumor that directly relates to {quest}.', trigger: 'social' },
  { template: 'An item in the party\'s possession reacts when they\'re near something related to {quest}.', trigger: 'item' },
];

/**
 * Detect stale quests (no progress in N sessions).
 */
export function detectStaleQuests(quests, currentSession, staleThreshold = 3) {
  return quests.filter(q => {
    if (q.status !== 'active') return false;
    const sessionsSinceProgress = currentSession - (q.lastProgressSession || q.startSession || 0);
    return sessionsSinceProgress >= staleThreshold;
  }).map(q => ({
    ...q,
    sessionsSinceProgress: currentSession - (q.lastProgressSession || q.startSession || 0),
    urgency: q.deadline ? Math.max(0, q.deadline - currentSession) : null,
  }));
}

/**
 * Check quest deadlines.
 */
export function checkDeadlines(quests, currentSession) {
  return quests
    .filter(q => q.status === 'active' && q.deadline)
    .map(q => ({
      ...q,
      sessionsRemaining: q.deadline - currentSession,
      isExpiring: (q.deadline - currentSession) <= 1,
      isExpired: currentSession > q.deadline,
    }))
    .sort((a, b) => a.sessionsRemaining - b.sessionsRemaining);
}

/**
 * Analyze plot threads — resolved vs unresolved.
 */
export function analyzePlotThreads(quests) {
  const resolved = quests.filter(q => q.status === 'completed');
  const unresolved = quests.filter(q => ['active', 'stale', 'discovered'].includes(q.status));
  const failed = quests.filter(q => q.status === 'failed');

  return {
    totalThreads: quests.length,
    resolved: resolved.length,
    unresolved: unresolved.length,
    failed: failed.length,
    completionRate: quests.length > 0 ? Math.round((resolved.length / quests.length) * 100) : 0,
    activeQuests: unresolved,
    resolvedQuests: resolved,
    failedQuests: failed,
  };
}

/**
 * Check quest dependencies.
 */
export function checkDependencies(quest, allQuests) {
  if (!quest.requires || quest.requires.length === 0) return { met: true, missing: [] };
  const missing = quest.requires.filter(reqId => {
    const reqQuest = allQuests.find(q => q.id === reqId);
    return !reqQuest || reqQuest.status !== 'completed';
  });
  return { met: missing.length === 0, missing };
}

/**
 * Generate quest reward based on difficulty and party level.
 */
export function calculateQuestReward(difficulty, partyLevels) {
  const reward = QUEST_REWARDS_BY_DIFFICULTY[difficulty] || QUEST_REWARDS_BY_DIFFICULTY.medium;
  const avgLevel = Math.round(partyLevels.reduce((a, b) => a + b, 0) / partyLevels.length);
  const partySize = partyLevels.length;

  const baseXP = avgLevel * 100 * reward.xpMultiplier;
  const totalXP = Math.round(baseXP * partySize);

  return {
    xpTotal: totalXP,
    xpPerPlayer: Math.round(totalXP / partySize),
    goldRange: reward.goldRange,
    itemRarity: reward.items,
    difficulty: reward.description,
  };
}

/**
 * Generate failure consequences for a quest.
 */
export function generateFailureConsequences(questType, count = 2) {
  const suitable = FAILURE_CONSEQUENCES.filter(c => {
    if (questType === 'bounty' && c.type === 'enemy_strengthens') return true;
    if (questType === 'main' && c.severity === 'high') return true;
    return true;
  });

  const consequences = [];
  const used = new Set();
  for (let i = 0; i < count; i++) {
    let c;
    do { c = pick(suitable); } while (used.has(c.type) && used.size < suitable.length);
    used.add(c.type);
    consequences.push(c);
  }
  return consequences;
}

/**
 * Generate plot hooks for stale/active quests.
 */
export function generatePlotHooks(quests, count = 3) {
  const activeQuests = quests.filter(q => ['active', 'stale'].includes(q.status));
  if (activeQuests.length === 0) return [];

  const hooks = [];
  for (let i = 0; i < count; i++) {
    const quest = pick(activeQuests);
    const template = pick(PLOT_HOOK_TEMPLATES);
    const hook = template.template
      .replace('{quest}', quest.title || 'the unfinished quest')
      .replace('{quest_detail}', quest.description || 'mysterious signs')
      .replace('{consequence}', pick(FAILURE_CONSEQUENCES).description);
    hooks.push({ questId: quest.id, questTitle: quest.title, hook, trigger: template.trigger });
  }
  return hooks;
}

/**
 * Get quest type info.
 */
export function getQuestType(typeId) {
  return QUEST_TYPES.find(t => t.id === typeId) || QUEST_TYPES[1];
}
