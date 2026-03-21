/**
 * playerChatEnhancements.js
 * Player Mode Improvements 124-140: Chat message formatting, emotes, IC/OOC toggle
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// MESSAGE TYPES
// ---------------------------------------------------------------------------

export const MESSAGE_TYPES = {
  ic: { label: 'In-Character', prefix: '', color: '#e8d9b5', icon: 'user' },
  ooc: { label: 'Out-of-Character', prefix: '(OOC) ', color: '#94a3b8', icon: 'message-circle' },
  emote: { label: 'Emote', prefix: '* ', color: '#f472b6', icon: 'smile', italic: true },
  whisper: { label: 'Whisper', prefix: '[Whisper] ', color: '#a78bfa', icon: 'lock' },
  roll: { label: 'Roll Result', prefix: '', color: '#fbbf24', icon: 'dice' },
};

// ---------------------------------------------------------------------------
// QUICK REACTIONS
// ---------------------------------------------------------------------------

export const QUICK_CHAT_REACTIONS = [
  { id: 'thumbs_up', emoji: '\uD83D\uDC4D', label: 'Thumbs Up' },
  { id: 'clap', emoji: '\uD83D\uDC4F', label: 'Applause' },
  { id: 'laugh', emoji: '\uD83D\uDE02', label: 'Laughing' },
  { id: 'gasp', emoji: '\uD83D\uDE31', label: 'Shocked' },
  { id: 'think', emoji: '\uD83E\uDD14', label: 'Thinking' },
  { id: 'fire', emoji: '\uD83D\uDD25', label: 'Fire' },
  { id: 'skull', emoji: '\uD83D\uDC80', label: 'Dead' },
  { id: 'heart', emoji: '\u2764\uFE0F', label: 'Love' },
  { id: 'sword', emoji: '\u2694\uFE0F', label: 'Fight' },
  { id: 'shield', emoji: '\uD83D\uDEE1\uFE0F', label: 'Defend' },
  { id: 'sparkle', emoji: '\u2728', label: 'Magic' },
  { id: 'dice', emoji: '\uD83C\uDFB2', label: 'Roll' },
];

// ---------------------------------------------------------------------------
// STATUS MESSAGES
// ---------------------------------------------------------------------------

export const PLAYER_STATUS_OPTIONS = [
  { id: 'ready', label: 'Ready', color: '#4ade80', icon: 'check-circle' },
  { id: 'thinking', label: 'Thinking...', color: '#fbbf24', icon: 'brain' },
  { id: 'afk', label: 'AFK', color: '#94a3b8', icon: 'coffee' },
  { id: 'brb', label: 'BRB', color: '#f97316', icon: 'clock' },
  { id: 'roleplaying', label: 'In Character', color: '#a78bfa', icon: 'theater' },
  { id: 'combat_ready', label: 'Combat Ready', color: '#ef4444', icon: 'swords' },
];

// ---------------------------------------------------------------------------
// EMOTE FORMATTER
// ---------------------------------------------------------------------------

/**
 * Parse message text for emote formatting.
 * *text* becomes italic emote, [roll:2d6] becomes roll link, etc.
 */
export function parseMessageFormat(text) {
  const parts = [];
  let remaining = text;

  // Check for emote pattern: starts and ends with *
  if (remaining.startsWith('*') && remaining.endsWith('*') && remaining.length > 2) {
    return [{ type: 'emote', text: remaining.slice(1, -1) }];
  }

  // Check for OOC pattern: starts with (( and ends with ))
  if (remaining.startsWith('((') && remaining.endsWith('))')) {
    return [{ type: 'ooc', text: remaining.slice(2, -2) }];
  }

  // Regular text
  parts.push({ type: 'text', text: remaining });
  return parts;
}

/**
 * Format a chat message for display.
 */
export function formatChatMessage(message, playerName, messageType = 'ic') {
  const config = MESSAGE_TYPES[messageType] || MESSAGE_TYPES.ic;
  return {
    prefix: config.prefix,
    color: config.color,
    italic: config.italic || false,
    displayName: messageType === 'emote' ? playerName : undefined,
    formatted: messageType === 'emote' ? `${playerName} ${message}` : `${config.prefix}${message}`,
  };
}

/**
 * Get timestamp display string.
 */
export function formatMessageTimestamp(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
