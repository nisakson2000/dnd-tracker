// pacingSuggestions.js — Pacing suggestions based on session activity patterns (Roadmap #225)

export const PACING_TIPS = [
  "The Rule of Three: set up, reinforce, pay off",
  "End sessions on cliffhangers for excitement next time",
  "Alternate high and low tension scenes",
  "Give every player a personal moment each session",
  "Use the 'yes, and' principle for unexpected player ideas",
  "A 5-second pause after a reveal is more dramatic than exposition",
  "NPCs with conflicting interests create natural drama",
  "Travel montages keep things moving — don't play every hour of a journey",
];

/**
 * Generates pacing suggestions based on current session activity patterns.
 *
 * @param {Object} sessionState
 * @param {number} sessionState.elapsedSeconds — total session time in seconds
 * @param {number} sessionState.combatCount — number of combats this session
 * @param {number|null} sessionState.lastCombatTime — timestamp (ms) of last combat end, or null
 * @param {number|null} sessionState.lastSocialTime — timestamp (ms) of last social/RP moment, or null
 * @param {number|null} sessionState.lastExplorationTime — timestamp (ms) of last exploration, or null
 * @param {number|null} sessionState.currentTension — 1-10 tension level, or null
 * @param {number} sessionState.playersCount — number of connected players
 * @returns {Array<{id: string, text: string, priority: number, type: string}>}
 */
export function getPacingSuggestions(sessionState) {
  const {
    elapsedSeconds = 0,
    combatCount = 0,
    lastCombatTime = null,
    lastSocialTime = null,
    lastExplorationTime = null,
    currentTension = null,
    // playersCount is accepted but not currently used by any rule
  } = sessionState || {};

  const now = Date.now();
  const suggestions = [];
  let idCounter = 1;

  function addSuggestion(text, priority, type) {
    suggestions.push({
      id: `pacing-${idCounter++}`,
      text,
      priority,
      type,
    });
  }

  // 1. Three or more combats in a row without social interaction
  if (combatCount >= 3 && (lastSocialTime === null || (lastCombatTime !== null && lastSocialTime < lastCombatTime))) {
    addSuggestion(
      "Consider an RP or social encounter — 3 combats in a row can be exhausting",
      1,
      "social"
    );
  }

  // 2. No combat in 90+ minutes
  if (lastCombatTime !== null) {
    const minutesSinceCombat = (now - lastCombatTime) / 1000 / 60;
    if (minutesSinceCombat >= 90) {
      addSuggestion(
        "It's been a while since combat — a minor encounter could raise stakes",
        2,
        "combat"
      );
    }
  }

  // 3. Session over 2 hours — break reminder
  if (elapsedSeconds > 2 * 3600) {
    addSuggestion(
      "Over 2 hours in — a short break keeps everyone sharp",
      2,
      "break"
    );
  }

  // 4. Session over 3.5 hours — marathon warning
  if (elapsedSeconds > 3.5 * 3600) {
    addSuggestion(
      "Marathon session! Consider wrapping up with a cliffhanger",
      1,
      "wrap-up"
    );
  }

  // 5. Tension 8+ sustained for more than 20 minutes
  if (currentTension !== null && currentTension >= 8) {
    // We check if the high-tension state has been going long enough.
    // Since we only have instantaneous tension, we use time since last
    // social or exploration as a proxy for how long tension has been high.
    const lastRelief = Math.max(lastSocialTime || 0, lastExplorationTime || 0);
    const minutesSinceRelief = lastRelief > 0 ? (now - lastRelief) / 1000 / 60 : Infinity;
    if (minutesSinceRelief >= 20) {
      addSuggestion(
        "High tension sustained — consider a resolution or relief moment",
        1,
        "tension"
      );
    }
  }

  // 6. Tension 1-2 sustained for more than 30 minutes
  if (currentTension !== null && currentTension >= 1 && currentTension <= 2) {
    const lastExcitement = Math.max(lastCombatTime || 0, lastSocialTime || 0);
    const minutesSinceExcitement = lastExcitement > 0 ? (now - lastExcitement) / 1000 / 60 : Infinity;
    if (minutesSinceExcitement >= 30) {
      addSuggestion(
        "Low tension for a while — introduce a mystery, threat, or hook",
        2,
        "tension"
      );
    }
  }

  // 7. No exploration in 2+ hours
  if (lastExplorationTime !== null) {
    const minutesSinceExploration = (now - lastExplorationTime) / 1000 / 60;
    if (minutesSinceExploration >= 120) {
      addSuggestion(
        "No exploration recently — a discovery or puzzle could add variety",
        3,
        "exploration"
      );
    }
  }

  // 8. First hour done, no combat yet
  if (combatCount === 0 && elapsedSeconds > 3600) {
    addSuggestion(
      "First hour done, no combat yet — this could be building tension or might need a spark",
      3,
      "combat"
    );
  }

  // Sort by priority (1 = highest)
  suggestions.sort((a, b) => a.priority - b.priority);

  return suggestions;
}
