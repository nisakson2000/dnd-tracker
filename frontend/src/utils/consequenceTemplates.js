/**
 * Consequence Templates — Phase 6A
 *
 * Maps common player actions to consequence suggestions.
 * The DM reviews and approves/dismisses each one.
 */

// ── Action → Consequence mapping ──
export const CONSEQUENCE_TEMPLATES = {
  kill_npc: {
    label: 'Kill an NPC',
    icon: 'Skull',
    consequences: [
      { type: 'reputation_change', severity: 'major', description: 'Faction hostility increases (+20 hostility)', target_type: 'faction' },
      { type: 'npc_reaction', severity: 'moderate', description: 'Allied NPCs grieve or become hostile', target_type: 'npc' },
      { type: 'world_state_change', severity: 'moderate', description: 'Bounty posted if NPC was important', target_type: 'world' },
      { type: 'quest_update', severity: 'minor', description: 'Related quests may fail or change', target_type: 'quest' },
    ],
  },
  complete_quest: {
    label: 'Complete a Quest',
    icon: 'CheckCircle',
    consequences: [
      { type: 'reputation_change', severity: 'moderate', description: 'Reputation with quest giver\'s faction +10', target_type: 'faction' },
      { type: 'npc_reaction', severity: 'minor', description: 'Quest giver becomes friendlier (+10 trust)', target_type: 'npc' },
      { type: 'quest_update', severity: 'minor', description: 'Follow-up quest may unlock', target_type: 'quest' },
    ],
  },
  betray_ally: {
    label: 'Betray an Ally',
    icon: 'HeartCrack',
    consequences: [
      { type: 'npc_reaction', severity: 'catastrophic', description: 'Betrayed NPC trust drops to -50 or lower', target_type: 'npc' },
      { type: 'reputation_change', severity: 'major', description: 'Word spreads — all allied NPCs trust decreases', target_type: 'faction' },
      { type: 'world_state_change', severity: 'major', description: 'Faction realignment — allies may become enemies', target_type: 'world' },
    ],
  },
  steal_from: {
    label: 'Steal from Someone',
    icon: 'EyeOff',
    consequences: [
      { type: 'npc_reaction', severity: 'moderate', description: 'Merchant prices increase +25% if caught', target_type: 'npc' },
      { type: 'world_state_change', severity: 'minor', description: 'Guards alerted in the area', target_type: 'world' },
      { type: 'reputation_change', severity: 'moderate', description: 'Wanted status in region if caught', target_type: 'world' },
    ],
  },
  save_npc: {
    label: 'Save an NPC\'s Life',
    icon: 'Heart',
    consequences: [
      { type: 'npc_reaction', severity: 'moderate', description: 'NPC trust increases significantly (+15)', target_type: 'npc' },
      { type: 'reputation_change', severity: 'minor', description: 'Word of heroism spreads (+5 local reputation)', target_type: 'faction' },
      { type: 'quest_update', severity: 'minor', description: 'Saved NPC may offer a quest or reward', target_type: 'quest' },
    ],
  },
  destroy_property: {
    label: 'Destroy Property',
    icon: 'Flame',
    consequences: [
      { type: 'reputation_change', severity: 'moderate', description: 'Local reputation decreases (-10)', target_type: 'faction' },
      { type: 'world_state_change', severity: 'minor', description: 'Owner demands compensation', target_type: 'world' },
      { type: 'npc_reaction', severity: 'minor', description: 'Witnesses become unfriendly', target_type: 'npc' },
    ],
  },
  help_faction: {
    label: 'Help a Faction',
    icon: 'Users',
    consequences: [
      { type: 'reputation_change', severity: 'moderate', description: 'Faction reputation +15', target_type: 'faction' },
      { type: 'reputation_change', severity: 'minor', description: 'Rival factions reputation -5', target_type: 'faction' },
      { type: 'quest_update', severity: 'minor', description: 'New faction quests may become available', target_type: 'quest' },
    ],
  },
  break_law: {
    label: 'Break the Law',
    icon: 'AlertTriangle',
    consequences: [
      { type: 'world_state_change', severity: 'moderate', description: 'Wanted status in jurisdiction', target_type: 'world' },
      { type: 'npc_reaction', severity: 'minor', description: 'Law-abiding NPCs become wary', target_type: 'npc' },
      { type: 'reputation_change', severity: 'minor', description: 'Criminal contacts may become available (-/+)', target_type: 'faction' },
    ],
  },
  make_deal: {
    label: 'Strike a Deal/Alliance',
    icon: 'Handshake',
    consequences: [
      { type: 'npc_reaction', severity: 'moderate', description: 'Deal partner trust +10', target_type: 'npc' },
      { type: 'quest_update', severity: 'minor', description: 'New obligations or quests from the deal', target_type: 'quest' },
      { type: 'world_state_change', severity: 'minor', description: 'Political landscape shifts slightly', target_type: 'world' },
    ],
  },
  desecrate_holy: {
    label: 'Desecrate Holy Site',
    icon: 'Zap',
    consequences: [
      { type: 'reputation_change', severity: 'catastrophic', description: 'Religious faction becomes hostile (-50)', target_type: 'faction' },
      { type: 'world_state_change', severity: 'major', description: 'Divine retribution or curse possible', target_type: 'world' },
      { type: 'npc_reaction', severity: 'major', description: 'All religious NPCs become hostile', target_type: 'npc' },
    ],
  },
  free_prisoner: {
    label: 'Free a Prisoner',
    icon: 'Unlock',
    consequences: [
      { type: 'npc_reaction', severity: 'moderate', description: 'Freed NPC trust +20, becomes ally', target_type: 'npc' },
      { type: 'reputation_change', severity: 'minor', description: 'Captor faction hostility +10', target_type: 'faction' },
      { type: 'quest_update', severity: 'minor', description: 'Freed NPC may reveal information or offer quest', target_type: 'quest' },
    ],
  },
  show_mercy: {
    label: 'Show Mercy to Enemy',
    icon: 'HandHeart',
    consequences: [
      { type: 'npc_reaction', severity: 'moderate', description: 'Spared enemy may become informant (+5 trust)', target_type: 'npc' },
      { type: 'reputation_change', severity: 'minor', description: 'Reputation as merciful spreads (+5)', target_type: 'faction' },
      { type: 'world_state_change', severity: 'minor', description: 'Spared enemy may return — as ally or foe', target_type: 'world' },
    ],
  },
};

// ── Severity levels ──
export const SEVERITY_LEVELS = {
  minor: { label: 'Minor', color: '#6b7280', description: 'Flavor text, minor mechanical effect' },
  moderate: { label: 'Moderate', color: '#f59e0b', description: 'Noticeable mechanical/story impact' },
  major: { label: 'Major', color: '#ef4444', description: 'Significant story-changing event' },
  catastrophic: { label: 'Catastrophic', color: '#7f1d1d', description: 'Campaign-altering consequences' },
};

// ── Consequence types ──
export const CONSEQUENCE_TYPES = {
  reputation_change: { label: 'Reputation Change', icon: 'TrendingUp' },
  npc_reaction: { label: 'NPC Reaction', icon: 'User' },
  quest_update: { label: 'Quest Update', icon: 'Map' },
  world_state_change: { label: 'World State Change', icon: 'Globe' },
  faction_response: { label: 'Faction Response', icon: 'Users' },
};

/**
 * Generate consequences for a player action.
 *
 * @param {string} actionType - Key from CONSEQUENCE_TEMPLATES
 * @param {Object} context - { actorName, targetName, targetId, targetType }
 * @returns {Object[]} Array of consequence objects ready for the DM review panel
 */
export function generateConsequences(actionType, context = {}) {
  const template = CONSEQUENCE_TEMPLATES[actionType];
  if (!template) return [];

  return template.consequences.map(c => ({
    trigger_action: actionType,
    trigger_actor: context.actorName || 'Party',
    consequence_type: c.type,
    severity: c.severity,
    description: c.description,
    target_type: c.target_type || context.targetType || '',
    target_id: context.targetId || '',
    mechanical_effect_json: JSON.stringify({}),
    status: 'pending',
    dm_approved: false,
  }));
}

/**
 * Get all available action types for the UI.
 */
export function getActionTypes() {
  return Object.entries(CONSEQUENCE_TEMPLATES).map(([id, template]) => ({
    id,
    label: template.label,
    icon: template.icon,
    consequenceCount: template.consequences.length,
  }));
}
