/**
 * questDeadlines.js
 *
 * Quest deadline tracking data and helper functions.
 *
 * Roadmap Items Covered:
 *   - 172: Quest deadline tracking
 *
 * Provides urgency levels, deadline types, expiration consequences,
 * reminder schedules, and extension rules for time-sensitive quests.
 * Includes helper functions for deadline evaluation and DM notifications.
 *
 * No React dependencies — pure data and logic.
 */

// ---------------------------------------------------------------------------
// URGENCY LEVELS
// ---------------------------------------------------------------------------

/**
 * Five urgency tiers based on sessions remaining until deadline.
 * Used to drive UI color coding, icon hints, and notification cadence.
 */
export const URGENCY_LEVELS = {
  NONE: {
    id: "none",
    label: "None",
    description: "No deadline — quest can be completed at any pace.",
    sessionsThreshold: null,
    color: "#6b7280",       // gray
    iconHint: "clock-off",
    notificationFrequency: "never",
  },
  LOW: {
    id: "low",
    label: "Low",
    description: "Plenty of time remaining (10 or more sessions).",
    sessionsThreshold: 10,
    color: "#22c55e",       // green
    iconHint: "clock",
    notificationFrequency: "on_acceptance",
  },
  MEDIUM: {
    id: "medium",
    label: "Medium",
    description: "Moderate urgency — 5 to 9 sessions remaining.",
    sessionsThreshold: 5,
    color: "#eab308",       // yellow
    iconHint: "clock-alert",
    notificationFrequency: "every_other_session",
  },
  HIGH: {
    id: "high",
    label: "High",
    description: "Getting close — only 2 to 4 sessions remaining.",
    sessionsThreshold: 2,
    color: "#f97316",       // orange
    iconHint: "clock-warning",
    notificationFrequency: "every_session",
  },
  CRITICAL: {
    id: "critical",
    label: "Critical",
    description: "Deadline is this session or already passed.",
    sessionsThreshold: 1,
    color: "#ef4444",       // red
    iconHint: "clock-x",
    notificationFrequency: "session_start_and_end",
  },
};

// ---------------------------------------------------------------------------
// DEADLINE TYPES
// ---------------------------------------------------------------------------

/**
 * Five deadline type definitions describing how the deadline is measured
 * and when the clock starts or triggers.
 */
export const DEADLINE_TYPES = {
  ABSOLUTE: {
    id: "absolute",
    label: "Absolute",
    description:
      "Deadline is a specific session number in the campaign timeline. " +
      "The quest expires when that session number is reached regardless of " +
      "when the party accepted it.",
    example: "Must be completed before Session 20.",
    requiresFields: ["deadlineSession"],
  },
  RELATIVE: {
    id: "relative",
    label: "Relative",
    description:
      "Deadline counts X sessions from the session the quest was accepted. " +
      "The clock starts ticking the moment the party takes the job.",
    example: "Party has 4 sessions from acceptance.",
    requiresFields: ["acceptedSession", "sessionWindow"],
  },
  EVENT_BASED: {
    id: "event_based",
    label: "Event-Based",
    description:
      "Deadline is triggered by a specific world event rather than a fixed " +
      "session count. The quest expires or escalates when that event fires.",
    example: "Must be resolved before the Eclipse Ritual completes.",
    requiresFields: ["triggerEvent"],
  },
  COUNTDOWN: {
    id: "countdown",
    label: "Countdown",
    description:
      "Deadline is tracked in real-world calendar days, useful for " +
      "time-sensitive scenarios that span multiple short sessions or " +
      "when the DM ties quest pacing to real scheduling.",
    example: "7 real-world days to complete before the villain escapes.",
    requiresFields: ["dueDateISO"],
  },
  FLEXIBLE: {
    id: "flexible",
    label: "Flexible",
    description:
      "DM adjusts the deadline on the fly based on narrative context, " +
      "player actions, or pacing needs. A soft target session is stored " +
      "but can be updated at any time.",
    example: "DM will call the deadline when the story demands it.",
    requiresFields: ["softDeadlineSession"],
  },
};

// ---------------------------------------------------------------------------
// EXPIRATION CONSEQUENCES
// ---------------------------------------------------------------------------

/**
 * Eight consequence templates applied when a quest expires without completion.
 * Each template carries default severity, a narrative hook, and a flag
 * indicating whether the quest should be automatically closed.
 */
export const EXPIRATION_CONSEQUENCES = {
  QUEST_UNAVAILABLE: {
    id: "quest_unavailable",
    label: "Quest Becomes Unavailable",
    description:
      "The quest is no longer obtainable or completable. The window of " +
      "opportunity has permanently closed.",
    defaultSeverity: "moderate",
    narrativeHook:
      "The situation resolved itself — for better or worse — without the party's involvement.",
    autoCloseQuest: true,
  },
  NPC_HANDLES_POORLY: {
    id: "npc_handles_poorly",
    label: "NPC Handles It Poorly",
    description:
      "The quest-giver or a related NPC attempts to solve the problem " +
      "themselves with disastrous results, complicating the world state.",
    defaultSeverity: "moderate",
    narrativeHook:
      "Unable to wait any longer, [NPC] took matters into their own hands — and made everything worse.",
    autoCloseQuest: false,
  },
  ENEMY_SUCCEEDS: {
    id: "enemy_succeeds",
    label: "Enemy Succeeds",
    description:
      "The antagonist or opposing faction achieves their goal because the " +
      "party did not intervene in time. World state shifts accordingly.",
    defaultSeverity: "severe",
    narrativeHook:
      "While the party was occupied elsewhere, [enemy] completed their plan unopposed.",
    autoCloseQuest: true,
  },
  REWARD_DECREASES: {
    id: "reward_decreases",
    label: "Reward Decreases",
    description:
      "The quest can still be completed but the promised reward is reduced " +
      "due to the delay, partial resolution, or disappointed quest-giver.",
    defaultSeverity: "minor",
    narrativeHook:
      "[NPC] is disappointed by the delay and can only offer a fraction of the original reward.",
    autoCloseQuest: false,
  },
  DIFFICULTY_INCREASES: {
    id: "difficulty_increases",
    label: "Difficulty Increases",
    description:
      "The situation has escalated. Enemies are better prepared, traps " +
      "are reset, reinforcements have arrived, or the environment has changed.",
    defaultSeverity: "moderate",
    narrativeHook:
      "Time has worked against the party — the challenge ahead is now significantly harder.",
    autoCloseQuest: false,
  },
  NEW_QUEST_SPAWNED: {
    id: "new_quest_spawned",
    label: "Cleanup Quest Spawned",
    description:
      "A new follow-up quest is generated to deal with the fallout from " +
      "the original quest's failure. The party must now address the consequences.",
    defaultSeverity: "moderate",
    narrativeHook:
      "The original problem wasn't solved — now the party must deal with the aftermath.",
    autoCloseQuest: true,
    spawnFollowUp: true,
  },
  REPUTATION_LOSS: {
    id: "reputation_loss",
    label: "Reputation Loss",
    description:
      "The party loses standing with the relevant faction, NPC, or " +
      "settlement. Future interactions may be hostile or services unavailable.",
    defaultSeverity: "moderate",
    narrativeHook:
      "Word has spread that the party could not be counted on when it mattered most.",
    autoCloseQuest: false,
  },
  NPC_DIES_OR_CAPTURED: {
    id: "npc_dies_or_captured",
    label: "NPC Dies or Is Captured",
    description:
      "An NPC the party was meant to protect, rescue, or assist is killed " +
      "or captured as a direct result of the party's inaction.",
    defaultSeverity: "severe",
    narrativeHook:
      "Without the party's intervention, [NPC] could not survive what came next.",
    autoCloseQuest: true,
  },
};

// ---------------------------------------------------------------------------
// REMINDER SCHEDULE
// ---------------------------------------------------------------------------

/**
 * Six reminder trigger points for notifying the DM about approaching deadlines.
 * Each entry defines when it fires, what message to surface, and priority.
 */
export const REMINDER_SCHEDULE = {
  ON_ACCEPTANCE: {
    id: "on_acceptance",
    label: "On Acceptance",
    triggerCondition: "quest accepted",
    sessionsBeforeDeadline: null,
    priority: "low",
    message:
      "Quest accepted with a deadline. Track progress carefully to stay on schedule.",
  },
  HALFWAY_POINT: {
    id: "halfway_point",
    label: "Halfway Point",
    triggerCondition: "50% of session window elapsed",
    sessionsBeforeDeadline: null,
    priority: "low",
    message:
      "You are halfway through the deadline window. Evaluate quest progress.",
  },
  THREE_SESSIONS_REMAINING: {
    id: "three_sessions_remaining",
    label: "3 Sessions Remaining",
    triggerCondition: "3 sessions before deadline",
    sessionsBeforeDeadline: 3,
    priority: "medium",
    message:
      "Only 3 sessions remain before the deadline. Prioritize this quest.",
  },
  ONE_SESSION_REMAINING: {
    id: "one_session_remaining",
    label: "1 Session Remaining",
    triggerCondition: "1 session before deadline",
    sessionsBeforeDeadline: 1,
    priority: "high",
    message:
      "Final warning — this quest expires after the next session.",
  },
  DEADLINE_SESSION: {
    id: "deadline_session",
    label: "Deadline Session",
    triggerCondition: "current session equals deadline session",
    sessionsBeforeDeadline: 0,
    priority: "critical",
    message:
      "This is the last session to complete this quest before it expires.",
  },
  OVERDUE: {
    id: "overdue",
    label: "Overdue",
    triggerCondition: "deadline session has passed",
    sessionsBeforeDeadline: -1,
    priority: "critical",
    message:
      "This quest is overdue. Apply expiration consequences and consider closing it.",
  },
};

// ---------------------------------------------------------------------------
// EXTENSION RULES
// ---------------------------------------------------------------------------

/**
 * Five condition categories under which a quest deadline can be legitimately
 * extended. Each rule carries the maximum extension allowed and required
 * narrative justification.
 */
export const EXTENSION_RULES = {
  DIPLOMATIC_SUCCESS: {
    id: "diplomatic_success",
    label: "Diplomatic Success",
    description:
      "The party negotiates more time through roleplay, persuasion checks, " +
      "or establishing trust with the quest-giver.",
    maxExtensionSessions: 3,
    requiresJustification: true,
    example: "Party persuaded the merchant to wait three more sessions.",
  },
  PAYMENT: {
    id: "payment",
    label: "Payment or Bribe",
    description:
      "The party pays gold, offers valuable items, or provides a service " +
      "in exchange for a deadline extension.",
    maxExtensionSessions: 4,
    requiresJustification: true,
    example: "Party paid 500gp to buy two extra sessions.",
  },
  SIDE_QUEST_COMPLETION: {
    id: "side_quest_completion",
    label: "Side Quest Completion",
    description:
      "Completing a related side quest earns goodwill or directly buys " +
      "more time by addressing the underlying urgency.",
    maxExtensionSessions: 5,
    requiresJustification: true,
    example: "Clearing the road bandits let supplies arrive early, buying time.",
  },
  NATURAL_EVENTS: {
    id: "natural_events",
    label: "Natural Events",
    description:
      "In-world circumstances beyond the party's control — storms, road " +
      "closures, magical anomalies — cause a delay that the quest-giver " +
      "accepts as legitimate.",
    maxExtensionSessions: 2,
    requiresJustification: false,
    example: "A blizzard closed the mountain pass, delaying travel by two sessions.",
  },
  DM_DISCRETION: {
    id: "dm_discretion",
    label: "DM Discretion",
    description:
      "The DM extends the deadline for narrative, pacing, or session " +
      "scheduling reasons. No in-world justification required.",
    maxExtensionSessions: null,    // unlimited — DM decides
    requiresJustification: false,
    example: "DM pushed the deadline back to fit the session schedule.",
  },
};

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Returns the urgency level object for the given number of sessions remaining.
 *
 * @param {number|null} sessionsRemaining - Sessions left until deadline.
 *   Pass null or undefined to receive URGENCY_LEVELS.NONE.
 * @returns {object} The matching URGENCY_LEVELS entry.
 */
export function getUrgencyLevel(sessionsRemaining) {
  if (sessionsRemaining === null || sessionsRemaining === undefined) {
    return URGENCY_LEVELS.NONE;
  }
  if (sessionsRemaining <= 0) return URGENCY_LEVELS.CRITICAL;
  if (sessionsRemaining === 1) return URGENCY_LEVELS.CRITICAL;
  if (sessionsRemaining <= 4) return URGENCY_LEVELS.HIGH;
  if (sessionsRemaining <= 9) return URGENCY_LEVELS.MEDIUM;
  return URGENCY_LEVELS.LOW;
}

/**
 * Evaluates a quest against the current session number and returns a
 * deadline status summary.
 *
 * Expected quest shape (relevant fields):
 *   {
 *     id, title,
 *     deadlineType,          // key from DEADLINE_TYPES
 *     deadlineSession,       // used by ABSOLUTE
 *     acceptedSession,       // used by RELATIVE
 *     sessionWindow,         // used by RELATIVE
 *     softDeadlineSession,   // used by FLEXIBLE
 *     dueDateISO,            // used by COUNTDOWN (ISO 8601 string)
 *     triggerEvent,          // used by EVENT_BASED
 *     expired,               // boolean override
 *   }
 *
 * @param {object} quest - Quest object.
 * @param {number} currentSession - The current session number.
 * @returns {object} Status object with shape:
 *   { sessionsRemaining, urgency, isOverdue, isExpired, reminderKey }
 */
export function checkDeadline(quest, currentSession) {
  if (!quest || !quest.deadlineType) {
    return {
      sessionsRemaining: null,
      urgency: URGENCY_LEVELS.NONE,
      isOverdue: false,
      isExpired: false,
      reminderKey: null,
    };
  }

  let deadlineSession = null;

  switch (quest.deadlineType) {
    case DEADLINE_TYPES.ABSOLUTE.id:
      deadlineSession = quest.deadlineSession ?? null;
      break;

    case DEADLINE_TYPES.RELATIVE.id:
      if (quest.acceptedSession != null && quest.sessionWindow != null) {
        deadlineSession = quest.acceptedSession + quest.sessionWindow;
      }
      break;

    case DEADLINE_TYPES.FLEXIBLE.id:
      deadlineSession = quest.softDeadlineSession ?? null;
      break;

    case DEADLINE_TYPES.COUNTDOWN.id:
      // For countdown, sessionsRemaining is not calculable here without a
      // sessions-per-day mapping. Return a flag so the caller handles it.
      return {
        sessionsRemaining: null,
        urgency: URGENCY_LEVELS.NONE,
        isOverdue: false,
        isExpired: quest.expired === true,
        reminderKey: null,
        requiresCalendarCheck: true,
        dueDateISO: quest.dueDateISO ?? null,
      };

    case DEADLINE_TYPES.EVENT_BASED.id:
      // Event-based deadlines are resolved externally when the trigger fires.
      return {
        sessionsRemaining: null,
        urgency: URGENCY_LEVELS.NONE,
        isOverdue: false,
        isExpired: quest.expired === true,
        reminderKey: null,
        requiresEventCheck: true,
        triggerEvent: quest.triggerEvent ?? null,
      };

    default:
      return {
        sessionsRemaining: null,
        urgency: URGENCY_LEVELS.NONE,
        isOverdue: false,
        isExpired: false,
        reminderKey: null,
      };
  }

  if (deadlineSession === null) {
    return {
      sessionsRemaining: null,
      urgency: URGENCY_LEVELS.NONE,
      isOverdue: false,
      isExpired: quest.expired === true,
      reminderKey: null,
    };
  }

  const sessionsRemaining = deadlineSession - currentSession;
  const isOverdue = sessionsRemaining < 0;
  const isExpired = quest.expired === true || isOverdue;
  const urgency = getUrgencyLevel(sessionsRemaining);

  // Determine reminder key
  let reminderKey = null;
  if (isOverdue) {
    reminderKey = REMINDER_SCHEDULE.OVERDUE.id;
  } else if (sessionsRemaining === 0) {
    reminderKey = REMINDER_SCHEDULE.DEADLINE_SESSION.id;
  } else if (sessionsRemaining === 1) {
    reminderKey = REMINDER_SCHEDULE.ONE_SESSION_REMAINING.id;
  } else if (sessionsRemaining === 3) {
    reminderKey = REMINDER_SCHEDULE.THREE_SESSIONS_REMAINING.id;
  }

  return {
    sessionsRemaining,
    urgency,
    isOverdue,
    isExpired,
    reminderKey,
    deadlineSession,
  };
}

/**
 * Selects and returns an expiration consequence template for a quest.
 * If the quest has a preferred consequence ID set, that is returned first.
 * Otherwise defaults to QUEST_UNAVAILABLE.
 *
 * @param {object} quest - Quest object. Optionally includes `preferredConsequenceId`.
 * @returns {object} An EXPIRATION_CONSEQUENCES entry.
 */
export function generateExpirationConsequence(quest) {
  if (quest?.preferredConsequenceId) {
    const match = Object.values(EXPIRATION_CONSEQUENCES).find(
      (c) => c.id === quest.preferredConsequenceId
    );
    if (match) return match;
  }
  return EXPIRATION_CONSEQUENCES.QUEST_UNAVAILABLE;
}

/**
 * Scans an array of quests and returns all active reminders for the
 * current session.
 *
 * @param {object[]} quests - Array of quest objects.
 * @param {number} currentSession - The current session number.
 * @returns {Array<{ quest: object, reminder: object, status: object }>}
 *   Array of reminder objects sorted by reminder priority (critical first).
 */
export function getReminders(quests, currentSession) {
  if (!Array.isArray(quests) || quests.length === 0) return [];

  const PRIORITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };
  const results = [];

  for (const quest of quests) {
    if (quest.status === "completed" || quest.status === "abandoned") continue;

    const status = checkDeadline(quest, currentSession);
    if (!status.reminderKey) continue;

    const reminder = Object.values(REMINDER_SCHEDULE).find(
      (r) => r.id === status.reminderKey
    );
    if (!reminder) continue;

    results.push({ quest, reminder, status });
  }

  results.sort(
    (a, b) =>
      (PRIORITY_ORDER[a.reminder.priority] ?? 99) -
      (PRIORITY_ORDER[b.reminder.priority] ?? 99)
  );

  return results;
}

/**
 * Returns a new quest object with the deadline extended by the given number
 * of sessions.
 *
 * Only applies to ABSOLUTE, RELATIVE, and FLEXIBLE deadline types.
 * Does not mutate the original quest.
 *
 * @param {object} quest - The quest to extend.
 * @param {number} sessions - Number of sessions to add to the deadline.
 * @param {string} reason - Extension rule ID from EXTENSION_RULES or free text.
 * @returns {object} Updated quest object with adjusted deadline fields and
 *   an `extensionHistory` array tracking all extensions applied.
 */
export function extendDeadline(quest, sessions, reason) {
  if (!quest || typeof sessions !== "number" || sessions <= 0) {
    return quest;
  }

  const entry = {
    sessions,
    reason: reason ?? EXTENSION_RULES.DM_DISCRETION.id,
    appliedAt: new Date().toISOString(),
  };

  const history = Array.isArray(quest.extensionHistory)
    ? [...quest.extensionHistory, entry]
    : [entry];

  const updated = { ...quest, extensionHistory: history };

  switch (quest.deadlineType) {
    case DEADLINE_TYPES.ABSOLUTE.id:
      if (updated.deadlineSession != null) {
        updated.deadlineSession = updated.deadlineSession + sessions;
      }
      break;

    case DEADLINE_TYPES.RELATIVE.id:
      if (updated.sessionWindow != null) {
        updated.sessionWindow = updated.sessionWindow + sessions;
      }
      break;

    case DEADLINE_TYPES.FLEXIBLE.id:
      if (updated.softDeadlineSession != null) {
        updated.softDeadlineSession = updated.softDeadlineSession + sessions;
      }
      break;

    default:
      // COUNTDOWN and EVENT_BASED are not session-numeric; return unchanged.
      break;
  }

  return updated;
}

/**
 * Sorts an array of quests by deadline urgency — most urgent first.
 * Quests with no deadline are pushed to the end.
 * Does not mutate the original array.
 *
 * @param {object[]} quests - Array of quest objects.
 * @param {number} currentSession - The current session number.
 * @returns {object[]} New sorted array of quests.
 */
export function sortByDeadline(quests, currentSession) {
  if (!Array.isArray(quests)) return [];

  return [...quests].sort((a, b) => {
    const statusA = checkDeadline(a, currentSession);
    const statusB = checkDeadline(b, currentSession);

    const remainA = statusA.sessionsRemaining ?? Infinity;
    const remainB = statusB.sessionsRemaining ?? Infinity;

    return remainA - remainB;
  });
}
