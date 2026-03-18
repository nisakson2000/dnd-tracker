import { useState, useEffect, useRef } from 'react';

/**
 * Hook that watches SessionContext state and produces contextual DM suggestions.
 * Used by the live session companion strip in DMSession.
 *
 * @param {object} params
 * @param {boolean} params.encounterActive - Whether an encounter/combat is active
 * @param {object} params.currentScene - Current scene object
 * @param {number} params.elapsedSeconds - Session elapsed time in seconds
 * @param {Array} params.actionLog - Session action log entries
 * @param {boolean} params.sessionActive - Whether the session is active
 * @returns {Array} suggestions - Array of { id, text, type } objects
 */
export function useSessionGuidance({ encounterActive, currentScene, elapsedSeconds, actionLog, sessionActive }) {
  const [suggestions, setSuggestions] = useState([]);
  const prevEncounterActive = useRef(encounterActive);
  const prevScene = useRef(currentScene);
  const [dismissedIds, setDismissedIds] = useState(new Set());
  const lastBroadcastTime = useRef(0);
  const firstEncounterSeen = useRef(false);

  // Track broadcast times from action log
  useEffect(() => {
    if (!actionLog?.length) return;
    const lastBroadcast = [...actionLog].reverse().find(e =>
      e.type === 'broadcast' || e.action === 'broadcast'
    );
    if (lastBroadcast?.timestamp) {
      lastBroadcastTime.current = Date.now();
    }
  }, [actionLog?.length]);

  useEffect(() => {
    if (!sessionActive) {
      setSuggestions([]);
      return;
    }

    const newSuggestions = [];

    // Combat just ended → suggest XP/loot
    if (prevEncounterActive.current && !encounterActive) {
      newSuggestions.push({
        id: 'combat-ended',
        text: 'Combat is over! Consider awarding XP and distributing loot.',
        type: 'combat',
      });
    }

    // Scene changed recently → suggest broadcasting description
    if (currentScene && prevScene.current && currentScene.id !== prevScene.current.id) {
      newSuggestions.push({
        id: 'scene-changed',
        text: 'New scene! Consider broadcasting the scene description to players.',
        type: 'narrative',
      });
    }

    // First time entering combat → show combat tips
    if (encounterActive && !firstEncounterSeen.current) {
      firstEncounterSeen.current = true;
      newSuggestions.push({
        id: 'first-encounter',
        text: 'Initiative auto-rolls for everyone. Use damage buttons on monster cards to track HP.',
        type: 'combat',
      });
    }

    // No broadcasts in 15+ min
    const minutesSinceBroadcast = lastBroadcastTime.current > 0
      ? (Date.now() - lastBroadcastTime.current) / 60000
      : elapsedSeconds / 60;
    if (minutesSinceBroadcast >= 15 && !encounterActive && elapsedSeconds > 900) {
      newSuggestions.push({
        id: 'no-broadcast',
        text: "It's been a while since your last broadcast. Consider narrating what's happening.",
        type: 'narrative',
      });
    }

    prevEncounterActive.current = encounterActive;
    prevScene.current = currentScene;

    // Filter out dismissed suggestions
    const filtered = newSuggestions.filter(s => !dismissedIds.has(s.id));
    if (filtered.length > 0) {
      setSuggestions(prev => {
        // Merge, avoiding duplicates
        const existing = new Set(prev.map(s => s.id));
        const merged = [...prev];
        for (const s of filtered) {
          if (!existing.has(s.id)) merged.push(s);
        }
        return merged.slice(-3); // Keep max 3
      });
    }
  }, [encounterActive, currentScene, elapsedSeconds, sessionActive, actionLog?.length, dismissedIds]);

  const dismissSuggestion = (id) => {
    setDismissedIds(prev => new Set([...prev, id]));
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  return { suggestions, dismissSuggestion };
}
