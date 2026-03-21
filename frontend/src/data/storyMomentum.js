/**
 * Story Momentum System — Thread Energy & Auto-Events
 *
 * Covers roadmap items 281-285 (Story momentum tracker, High momentum auto-escalation,
 * Low momentum fade-out, DM momentum dashboard, Momentum-triggered auto-events).
 */

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ── Momentum Levels ──
export const MOMENTUM_LEVELS = [
  { min: 0, max: 1, label: 'Dormant', description: 'Thread has been inactive. Will resolve itself (usually badly) if left alone.', color: '#374151', icon: 'pause', autoEvent: 'fade_out' },
  { min: 2, max: 3, label: 'Simmering', description: 'Thread is present but not active. Needs a push to become relevant.', color: '#6b7280', icon: 'clock', autoEvent: null },
  { min: 4, max: 5, label: 'Active', description: 'Thread is in play. Party is aware and engaged.', color: '#3b82f6', icon: 'play', autoEvent: null },
  { min: 6, max: 7, label: 'Building', description: 'Thread is gaining urgency. Events are accelerating.', color: '#eab308', icon: 'trending-up', autoEvent: null },
  { min: 8, max: 9, label: 'Critical', description: 'Thread is near climax. Something must happen soon.', color: '#f97316', icon: 'alert-triangle', autoEvent: 'escalation' },
  { min: 10, max: 10, label: 'Climax', description: 'Thread has reached its peak. Immediate resolution required.', color: '#ef4444', icon: 'zap', autoEvent: 'climax' },
];

// ── Momentum Change Events ──
export const MOMENTUM_MODIFIERS = {
  increase: [
    { event: 'Party investigated this thread', change: 1 },
    { event: 'NPC related to this thread appeared', change: 1 },
    { event: 'New clue discovered', change: 1 },
    { event: 'Villain advanced their plan', change: 2 },
    { event: 'Deadline approaching', change: 2 },
    { event: 'Ally sent urgent message', change: 1 },
    { event: 'Dramatic revelation', change: 2 },
    { event: 'Party made a promise related to this', change: 1 },
  ],
  decrease: [
    { event: 'Party ignored this for a session', change: -1 },
    { event: 'Party resolved a related sub-quest', change: -1 },
    { event: 'Threat was temporarily neutralized', change: -2 },
    { event: 'NPC handled the situation without party', change: -1 },
    { event: 'Party actively chose another thread', change: -1 },
  ],
  natural: [
    { event: 'Time passed (per session)', change: -1, description: 'All threads naturally lose momentum over time' },
  ],
};

// ── Auto-Event Templates ──
export const AUTO_EVENTS = {
  fade_out: {
    label: 'Fade Out (Momentum 0-1)',
    description: 'The thread resolves itself without party intervention — usually badly.',
    templates: [
      'The {thread} resolved on its own. The outcome was worse than if the party had intervened: {consequence}.',
      'News arrives that {thread} ended. An NPC handled it, but at great cost: {consequence}.',
      'The opportunity related to {thread} has passed. The window of action is closed.',
      '{thread} fizzled out. The threat dissipated, but so did the potential reward.',
    ],
    consequences: [
      'innocent lives were lost',
      'the villain gained ground elsewhere',
      'a valuable resource was destroyed',
      'an ally lost faith in the party',
      'the enemy learned from the experience and is now stronger',
      'nothing dramatic happened — it simply didn\'t matter anymore',
    ],
  },
  escalation: {
    label: 'Escalation (Momentum 8-9)',
    description: 'The thread demands immediate attention with a dramatic event.',
    templates: [
      'URGENT: {thread} has reached a critical point. {escalation}',
      'The situation with {thread} has spiraled. {escalation}',
      'A messenger arrives, breathless: "{thread} — it\'s happening NOW. {escalation}"',
    ],
    escalations: [
      'An army is marching. There\'s no more time to prepare.',
      'The ritual is nearly complete. Hours remain, not days.',
      'An innocent is about to die. Intervention is needed immediately.',
      'The villain has issued an ultimatum. The deadline is tonight.',
      'A natural disaster is imminent. Evacuation must begin now.',
      'The artifact has been activated. Its effects are spreading.',
    ],
  },
  climax: {
    label: 'Climax (Momentum 10)',
    description: 'The thread has reached its peak. The next session MUST address it.',
    templates: [
      'THE CLIMAX: {thread} has reached its breaking point. This cannot wait another session.',
      'Everything about {thread} comes to a head. The final confrontation is here.',
    ],
  },
};

// ── Thread Types ──
export const THREAD_TYPES = [
  { id: 'main_quest', label: 'Main Quest', baseDecay: 0, description: 'Core campaign thread. Never fades naturally.' },
  { id: 'side_quest', label: 'Side Quest', baseDecay: -1, description: 'Optional thread. Loses momentum if ignored.' },
  { id: 'villain_plan', label: 'Villain Plan', baseDecay: 1, description: 'Villain threads GAIN momentum over time.' },
  { id: 'faction', label: 'Faction Thread', baseDecay: 0, description: 'Faction-related events. Stable unless acted upon.' },
  { id: 'personal', label: 'PC Personal', baseDecay: -0.5, description: 'Personal character arc. Slow decay if ignored.' },
  { id: 'mystery', label: 'Mystery', baseDecay: 0, description: 'Investigation thread. Stable until clues emerge.' },
  { id: 'crisis', label: 'Active Crisis', baseDecay: 1, description: 'Crises escalate on their own. Will reach climax.' },
  { id: 'relationship', label: 'NPC Relationship', baseDecay: -0.5, description: 'NPC bonds slowly fade without interaction.' },
];

/**
 * Get momentum level info for a given score.
 */
export function getMomentumLevel(score) {
  const clamped = Math.max(0, Math.min(10, score));
  return MOMENTUM_LEVELS.find(m => clamped >= m.min && clamped <= m.max) || MOMENTUM_LEVELS[0];
}

/**
 * Apply natural decay to a set of threads.
 */
export function applySessionDecay(threads) {
  return threads.map(thread => {
    const threadType = THREAD_TYPES.find(t => t.id === thread.type) || THREAD_TYPES[1];
    const newMomentum = Math.max(0, Math.min(10, thread.momentum + threadType.baseDecay));
    return { ...thread, momentum: newMomentum, previousMomentum: thread.momentum };
  });
}

/**
 * Generate auto-event for threads that hit thresholds.
 */
export function generateAutoEvent(thread) {
  const level = getMomentumLevel(thread.momentum);
  if (!level.autoEvent) return null;

  const eventTemplate = AUTO_EVENTS[level.autoEvent];
  if (!eventTemplate) return null;

  let text = pick(eventTemplate.templates).replace('{thread}', thread.name || 'the situation');

  if (eventTemplate.consequences) {
    text = text.replace('{consequence}', pick(eventTemplate.consequences));
  }
  if (eventTemplate.escalations) {
    text = text.replace('{escalation}', pick(eventTemplate.escalations));
  }

  return {
    threadId: thread.id,
    threadName: thread.name,
    eventType: level.autoEvent,
    text,
    momentum: thread.momentum,
    level: level.label,
  };
}

/**
 * Get all threads sorted by momentum (highest first).
 */
export function sortByMomentum(threads) {
  return [...threads].sort((a, b) => b.momentum - a.momentum);
}

/**
 * Get threads that need attention (momentum >= 8 or <= 1).
 */
export function getAttentionThreads(threads) {
  return {
    critical: threads.filter(t => t.momentum >= 8),
    fading: threads.filter(t => t.momentum <= 1 && t.momentum > 0),
    dormant: threads.filter(t => t.momentum === 0),
  };
}

/**
 * Create a new story thread.
 */
export function createThread(name, type = 'side_quest', initialMomentum = 5) {
  return {
    id: `thread_${Date.now()}`,
    name,
    type,
    momentum: initialMomentum,
    created: new Date().toISOString(),
    history: [{ session: 0, momentum: initialMomentum, event: 'Thread created' }],
  };
}
