/**
 * playerCommunication.js
 * Player Mode Improvements 121-140 — Communication Data
 * Pure JS, no React.
 */

// ---------------------------------------------------------------------------
// 1. MESSAGE_TYPES
// ---------------------------------------------------------------------------

export const MESSAGE_TYPES = {
  chat: {
    id: "chat",
    label: "Chat",
    description: "General out-of-character table chat",
    color: "#a0aec0",
    prefix: "",
    iconHint: "chat-bubble",
    visibility: "all",
  },
  whisper: {
    id: "whisper",
    label: "Whisper",
    description: "Private message visible only to the DM",
    color: "#b794f4",
    prefix: "[Whisper]",
    iconHint: "eye-slash",
    visibility: "DM",
  },
  action_request: {
    id: "action_request",
    label: "Action Request",
    description: "A request directed at the DM (e.g. attempt an action)",
    color: "#f6ad55",
    prefix: "[Request]",
    iconHint: "hand-raised",
    visibility: "DM",
  },
  in_character: {
    id: "in_character",
    label: "In Character",
    description: "Roleplay dialogue or action spoken as the character",
    color: "#68d391",
    prefix: "[IC]",
    iconHint: "theater-masks",
    visibility: "all",
  },
  out_of_character: {
    id: "out_of_character",
    label: "Out of Character",
    description: "Meta commentary outside the narrative",
    color: "#63b3ed",
    prefix: "[OOC]",
    iconHint: "comment-dots",
    visibility: "party",
  },
  emote: {
    id: "emote",
    label: "Emote",
    description: "Describes a physical action (*does something*)",
    color: "#fbb6ce",
    prefix: "*",
    iconHint: "sparkles",
    visibility: "all",
  },
};

// ---------------------------------------------------------------------------
// 2. QUICK_REACTIONS
// ---------------------------------------------------------------------------

export const QUICK_REACTIONS = {
  thumbsUp: {
    id: "thumbsUp",
    label: "Thumbs Up",
    emoji: "👍",
    shortcut: "+1",
  },
  laugh: {
    id: "laugh",
    label: "Laugh",
    emoji: "😂",
    shortcut: "lol",
  },
  gasp: {
    id: "gasp",
    label: "Gasp",
    emoji: "😮",
    shortcut: "wow",
  },
  think: {
    id: "think",
    label: "Thinking",
    emoji: "🤔",
    shortcut: "hmm",
  },
  sad: {
    id: "sad",
    label: "Sad",
    emoji: "😢",
    shortcut: "rip",
  },
  angry: {
    id: "angry",
    label: "Angry",
    emoji: "😤",
    shortcut: "ugh",
  },
  cheer: {
    id: "cheer",
    label: "Cheer",
    emoji: "🎉",
    shortcut: "yay",
  },
  clap: {
    id: "clap",
    label: "Clap",
    emoji: "👏",
    shortcut: "clap",
  },
};

// ---------------------------------------------------------------------------
// 3. STATUS_MESSAGES
// ---------------------------------------------------------------------------

export const STATUS_MESSAGES = {
  ready: {
    id: "ready",
    label: "Ready",
    color: "#68d391",
    autoTimeout: null,
  },
  thinking: {
    id: "thinking",
    label: "Thinking...",
    color: "#f6ad55",
    autoTimeout: 30,
  },
  afk: {
    id: "afk",
    label: "AFK",
    color: "#a0aec0",
    autoTimeout: 300,
  },
  typing: {
    id: "typing",
    label: "Typing...",
    color: "#63b3ed",
    autoTimeout: 10,
  },
  confused: {
    id: "confused",
    label: "Confused",
    color: "#fc8181",
    autoTimeout: 60,
  },
  excited: {
    id: "excited",
    label: "Excited!",
    color: "#fbb6ce",
    autoTimeout: 30,
  },
};

// ---------------------------------------------------------------------------
// 4. COMBAT_NARRATION_TEMPLATES
// ---------------------------------------------------------------------------

export const COMBAT_NARRATION_TEMPLATES = {
  criticalHit: {
    id: "criticalHit",
    label: "Critical Hit",
    template:
      "A devastating blow! {character} lands a critical hit for {damage} damage!",
  },
  naturalOne: {
    id: "naturalOne",
    label: "Natural 1",
    template: "{character} swings wide, missing entirely.",
  },
  kill: {
    id: "kill",
    label: "Kill",
    template: "{character} delivers the final blow to {target}!",
  },
  heal: {
    id: "heal",
    label: "Heal",
    template:
      "{character} channels healing energy, restoring {amount} HP.",
  },
  spell: {
    id: "spell",
    label: "Spell Cast",
    template: "{character} casts {spell}, {effect}.",
  },
  saveSuccess: {
    id: "saveSuccess",
    label: "Saving Throw — Success",
    template: "{character} resists the effect!",
  },
  saveFailure: {
    id: "saveFailure",
    label: "Saving Throw — Failure",
    template: "{character} succumbs to the effect.",
  },
};

// ---------------------------------------------------------------------------
// 5. EMOTE_PATTERNS
// ---------------------------------------------------------------------------

export const EMOTE_PATTERNS = {
  asteriskAction: {
    id: "asteriskAction",
    description: "Inline action wrapped in asterisks: *text*",
    pattern: /\*([^*]+)\*/g,
    type: "action",
  },
  meAction: {
    id: "meAction",
    description: "IRC-style /me action: /me text",
    pattern: /^\/me\s+(.+)$/i,
    type: "action",
  },
  oocParens: {
    id: "oocParens",
    description: "Out-of-character wrapped in double parentheses: ((text))",
    pattern: /\(\(([^)]+(?:\)[^)]+)*)\)\)/g,
    type: "OOC",
  },
};

// ---------------------------------------------------------------------------
// EXPORTED FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Format a message string with the metadata for a given type.
 *
 * @param {string} text     - The raw message text.
 * @param {string} type     - A key from MESSAGE_TYPES.
 * @returns {{ type: object, text: string, formatted: string, timestamp: string }}
 */
export function formatMessage(text, type) {
  const messageType = MESSAGE_TYPES[type] || MESSAGE_TYPES.chat;
  const prefix = messageType.prefix ? `${messageType.prefix} ` : "";
  const formatted = `${prefix}${text}`.trim();
  return {
    type: messageType,
    text,
    formatted,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Auto-detect the most appropriate message type from the raw text content.
 *
 * Detection order:
 *  1. /me … → emote
 *  2. (( … )) → out_of_character
 *  3. Starts with *…* pattern → emote
 *  4. Starts with [Whisper] or "whisper:" → whisper
 *  5. Starts with [Request] or "?" → action_request
 *  6. Starts with [IC] or quote characters → in_character
 *  7. Fallback → chat
 *
 * @param {string} text
 * @returns {string} A key from MESSAGE_TYPES
 */
export function detectMessageType(text) {
  if (!text || typeof text !== "string") return "chat";

  const trimmed = text.trim();

  if (EMOTE_PATTERNS.meAction.pattern.test(trimmed)) {
    // Reset lastIndex for global patterns (not needed here, but safe practice)
    EMOTE_PATTERNS.meAction.pattern.lastIndex = 0;
    return "emote";
  }

  if (EMOTE_PATTERNS.oocParens.pattern.test(trimmed)) {
    EMOTE_PATTERNS.oocParens.pattern.lastIndex = 0;
    return "out_of_character";
  }

  if (/^\*[^*]+\*/.test(trimmed)) {
    return "emote";
  }

  if (/^\[whisper\]/i.test(trimmed) || /^whisper:/i.test(trimmed)) {
    return "whisper";
  }

  if (
    /^\[request\]/i.test(trimmed) ||
    /^request:/i.test(trimmed) ||
    trimmed.startsWith("?")
  ) {
    return "action_request";
  }

  if (
    /^\[ic\]/i.test(trimmed) ||
    trimmed.startsWith('"') ||
    trimmed.startsWith("\u201c")
  ) {
    return "in_character";
  }

  if (/^\[ooc\]/i.test(trimmed)) {
    return "out_of_character";
  }

  return "chat";
}

/**
 * Generate a combat narration string from a template, substituting the
 * provided data object.
 *
 * Supported rollTypes: criticalHit, naturalOne, kill, heal, spell,
 *                      saveSuccess, saveFailure
 *
 * @param {string} rollType - A key from COMBAT_NARRATION_TEMPLATES.
 * @param {Object} data     - Substitution values, e.g. { character, damage, target, amount, spell, effect }
 * @returns {string} The rendered narration string.
 */
export function generateCombatNarration(rollType, data = {}) {
  const template = COMBAT_NARRATION_TEMPLATES[rollType];
  if (!template) {
    return `[Unknown roll type: ${rollType}]`;
  }

  return template.template.replace(/\{(\w+)\}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : match;
  });
}

/**
 * Retrieve a quick reaction object by its ID.
 *
 * @param {string} reactionId - A key from QUICK_REACTIONS.
 * @returns {object|null}
 */
export function getQuickReaction(reactionId) {
  return QUICK_REACTIONS[reactionId] || null;
}

/**
 * Retrieve a status message object by its ID.
 *
 * @param {string} statusId - A key from STATUS_MESSAGES.
 * @returns {object|null}
 */
export function getStatusMessage(statusId) {
  return STATUS_MESSAGES[statusId] || null;
}

/**
 * Parse a text string and replace emote patterns with structured tokens.
 *
 * Returns an array of segments, each being either:
 *   { kind: "text",   content: string }
 *   { kind: "emote",  content: string, emoteType: "action"|"OOC" }
 *
 * @param {string} text
 * @returns {Array<{ kind: string, content: string, emoteType?: string }>}
 */
export function parseEmotes(text) {
  if (!text || typeof text !== "string") return [{ kind: "text", content: "" }];

  // Handle /me as whole-line match first
  const meMatch = text.trim().match(EMOTE_PATTERNS.meAction.pattern);
  if (meMatch) {
    const inner = text.trim().replace(/^\/me\s+/i, "");
    return [{ kind: "emote", content: inner, emoteType: "action" }];
  }

  const segments = [];
  let remaining = text;

  // We'll scan left-to-right looking for OOC (( )) and *action* patterns.
  const combined = /\*([^*]+)\*|\(\(([^)]+(?:\)[^)]+)*)\)\)/g;
  let lastIndex = 0;
  let match;

  combined.lastIndex = 0;
  while ((match = combined.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        kind: "text",
        content: text.slice(lastIndex, match.index),
      });
    }

    if (match[1] !== undefined) {
      // *action*
      segments.push({ kind: "emote", content: match[1], emoteType: "action" });
    } else if (match[2] !== undefined) {
      // ((OOC))
      segments.push({ kind: "emote", content: match[2], emoteType: "OOC" });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ kind: "text", content: text.slice(lastIndex) });
  }

  return segments.length > 0 ? segments : [{ kind: "text", content: text }];
}
