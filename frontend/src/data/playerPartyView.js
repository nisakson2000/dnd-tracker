/**
 * playerPartyView.js
 * Player Mode Improvements 121-140 (party communication subset): Party member display & status
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// PARTY MEMBER STATUS INDICATORS
// ---------------------------------------------------------------------------

export const PARTY_STATUS = {
  healthy: { color: '#4ade80', label: 'Healthy', icon: 'heart' },
  wounded: { color: '#fbbf24', label: 'Wounded', icon: 'heart' },
  bloodied: { color: '#f97316', label: 'Bloodied', icon: 'heart' },
  critical: { color: '#ef4444', label: 'Critical', icon: 'heart-crack' },
  down: { color: '#a855f7', label: 'Down', icon: 'skull' },
  dead: { color: '#6b7280', label: 'Dead', icon: 'skull' },
  stable: { color: '#60a5fa', label: 'Stable', icon: 'pause' },
};

/**
 * Get party member status based on HP ratio.
 */
export function getPartyMemberStatus(currentHp, maxHp) {
  if (maxHp <= 0) return PARTY_STATUS.dead;
  if (currentHp <= 0) return PARTY_STATUS.down;
  const ratio = currentHp / maxHp;
  if (ratio >= 0.75) return PARTY_STATUS.healthy;
  if (ratio >= 0.5) return PARTY_STATUS.wounded;
  if (ratio >= 0.25) return PARTY_STATUS.bloodied;
  return PARTY_STATUS.critical;
}

// ---------------------------------------------------------------------------
// QUICK REACTIONS / EMOTES
// ---------------------------------------------------------------------------

export const QUICK_REACTIONS = [
  { id: 'thumbs_up', emoji: '\uD83D\uDC4D', label: 'Thumbs Up' },
  { id: 'thumbs_down', emoji: '\uD83D\uDC4E', label: 'Thumbs Down' },
  { id: 'laugh', emoji: '\uD83D\uDE02', label: 'Laugh' },
  { id: 'thinking', emoji: '\uD83E\uDD14', label: 'Thinking' },
  { id: 'surprised', emoji: '\uD83D\uDE32', label: 'Surprised' },
  { id: 'angry', emoji: '\uD83D\uDE20', label: 'Angry' },
  { id: 'scared', emoji: '\uD83D\uDE28', label: 'Scared' },
  { id: 'celebrate', emoji: '\uD83C\uDF89', label: 'Celebrate' },
  { id: 'clap', emoji: '\uD83D\uDC4F', label: 'Clap' },
  { id: 'eyes', emoji: '\uD83D\uDC40', label: 'Eyes' },
  { id: 'fire', emoji: '\uD83D\uDD25', label: 'Fire' },
  { id: 'skull', emoji: '\uD83D\uDC80', label: 'Skull' },
];

// ---------------------------------------------------------------------------
// PARTY ROLE TAGS
// ---------------------------------------------------------------------------

export const PARTY_ROLES = [
  { id: 'tank', label: 'Tank', color: '#ef4444', description: 'Front-line defender, absorbs damage' },
  { id: 'healer', label: 'Healer', color: '#4ade80', description: 'Restoration and support' },
  { id: 'dps', label: 'DPS', color: '#f97316', description: 'Primary damage dealer' },
  { id: 'support', label: 'Support', color: '#60a5fa', description: 'Buffs, debuffs, and control' },
  { id: 'scout', label: 'Scout', color: '#a78bfa', description: 'Stealth, perception, and reconnaissance' },
  { id: 'face', label: 'Face', color: '#fbbf24', description: 'Social interaction and persuasion' },
  { id: 'utility', label: 'Utility', color: '#22d3ee', description: 'Problem solving and versatility' },
];

// ---------------------------------------------------------------------------
// STATUS MESSAGES (quick status updates to broadcast)
// ---------------------------------------------------------------------------

export const STATUS_MESSAGES = [
  { id: 'ready', message: 'Ready to go!', color: '#4ade80' },
  { id: 'wait', message: 'Hold on, need a moment', color: '#fbbf24' },
  { id: 'low_hp', message: 'Low HP — need healing!', color: '#ef4444' },
  { id: 'no_slots', message: 'Out of spell slots', color: '#a855f7' },
  { id: 'no_resources', message: 'Resources depleted', color: '#f97316' },
  { id: 'afk', message: 'AFK — be right back', color: '#6b7280' },
  { id: 'planning', message: 'Planning my turn...', color: '#60a5fa' },
  { id: 'need_rest', message: 'Party should consider resting', color: '#fbbf24' },
];
