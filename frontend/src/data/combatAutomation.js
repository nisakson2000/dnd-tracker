/**
 * Combat Automation — Automated Combat Rules & Prompts
 *
 * Covers roadmap items 17-31, 326-339 (Condition automation, Condition reminders,
 * Duration ticks, Save prompts, Auto-death save, Auto-concentration, Auto-XP, etc.)
 */

// ── Condition Duration Types ──
export const DURATION_TYPES = {
  startOfTurn: { label: 'Start of Turn', description: 'Condition ticks at the start of the affected creature\'s turn.' },
  endOfTurn: { label: 'End of Turn', description: 'Condition ticks at the end of the affected creature\'s turn.' },
  endOfNextTurn: { label: 'End of Next Turn', description: 'Lasts until the end of the source creature\'s next turn.' },
  rounds: { label: 'X Rounds', description: 'Lasts a fixed number of rounds.' },
  minutes: { label: 'Minutes', description: 'Lasts a fixed number of minutes (1 min = 10 rounds).' },
  concentration: { label: 'Concentration', description: 'Lasts as long as the caster maintains concentration.' },
  untilDispelled: { label: 'Until Dispelled', description: 'Lasts until removed by Dispel Magic or similar.' },
  special: { label: 'Special', description: 'Custom end condition (e.g., until creature takes damage).' },
};

// ── Turn Reminders ──
export const TURN_REMINDERS = {
  startOfTurn: [
    { condition: 'Frightened', reminder: 'Cannot move closer to source of fear. Check line of sight to source.' },
    { condition: 'Grappled', reminder: 'Speed is 0. Can attempt to escape (Athletics/Acrobatics vs Athletics).' },
    { condition: 'Restrained', reminder: 'Speed is 0. Attacks have disadvantage. Attacks against you have advantage.' },
    { condition: 'Prone', reminder: 'Standing up costs half your movement. Attacks have disadvantage.' },
    { condition: 'Poisoned', reminder: 'Disadvantage on attack rolls and ability checks.' },
    { condition: 'Exhaustion', reminder: 'Check current exhaustion level for penalties.' },
    { condition: 'Concentrating', reminder: 'Maintaining concentration on a spell. Don\'t cast another concentration spell.' },
  ],
  endOfTurn: [
    { condition: 'Frightened', save: 'WIS', reminder: 'Wisdom save to end the Frightened condition.' },
    { condition: 'Charmed', save: 'WIS', reminder: 'Wisdom save to end the Charmed condition (if applicable).' },
    { condition: 'Paralyzed', save: 'varies', reminder: 'Saving throw to end Paralysis (check source for save type).' },
    { condition: 'Stunned', save: 'CON', reminder: 'Constitution save to end Stunned condition.' },
    { condition: 'Petrified', save: 'CON', reminder: 'Constitution save to resist further Petrification.' },
  ],
};

// ── Auto-Prompt Rules ──
export const AUTO_PROMPTS = {
  deathSave: {
    trigger: 'Creature drops to 0 HP on their turn',
    action: 'Prompt death saving throw',
    rules: [
      'DC 10 — roll d20',
      '10+: success, below 10: failure',
      'Nat 20: regain 1 HP and consciousness',
      'Nat 1: counts as 2 failures',
      '3 successes: stabilized (unconscious but stable)',
      '3 failures: death',
      'Taking damage while at 0: auto-failure (crit = 2 failures)',
    ],
  },
  concentrationCheck: {
    trigger: 'Concentrating caster takes damage',
    action: 'Prompt concentration save',
    rules: [
      'Constitution saving throw',
      'DC = 10 or half damage taken, whichever is higher',
      'War Caster feat: advantage on this save',
      'Failure: spell ends immediately',
    ],
  },
  opportunityAttack: {
    trigger: 'Enemy leaves reach without Disengaging',
    action: 'Prompt opportunity attack',
    rules: [
      'Uses reaction',
      'One melee weapon attack',
      'Doesn\'t trigger if enemy Disengages, teleports, or is moved by forced movement',
      'Sentinel: reduces speed to 0 on hit',
      'Polearm Master: triggers when entering reach too',
    ],
  },
  legendaryAction: {
    trigger: 'End of another creature\'s turn (if boss has legendary actions)',
    action: 'Remind DM of available legendary actions',
    rules: [
      'Boss can use 1-3 legendary actions between turns',
      'Only one option per turn',
      'Regain all at start of boss\'s turn',
    ],
  },
};

// ── Auto-Rest Suggestions ──
export const REST_SUGGESTION_RULES = {
  shortRest: {
    trigger: 'After 2+ combats without rest',
    conditions: ['Party average HP below 50%', 'Short rest features expended (Ki, Action Surge, etc.)', 'Hit dice available'],
    suggestion: 'Party has been through multiple encounters. Consider suggesting a short rest.',
  },
  longRest: {
    trigger: 'After 6-8 encounters or party resources critically low',
    conditions: ['Multiple spell slots expended', 'Hit dice nearly depleted', 'Exhaustion present', 'Party average HP below 30%'],
    suggestion: 'Party resources are critically low. A long rest may be necessary before proceeding.',
  },
};

// ── Auto-XP Calculation ──
export const XP_DISTRIBUTION = {
  method: 'Divide total monster XP equally among all party members',
  milestoneAlternative: 'DM awards levels at story milestones instead of tracking XP',
  adjustments: [
    { condition: 'PC was unconscious for most of the fight', modifier: 'Full XP (they were still at risk)' },
    { condition: 'PC joined mid-combat', modifier: 'Full XP (DM discretion)' },
    { condition: 'Combat avoided through roleplay', modifier: 'Full XP (same challenge, different solution)' },
    { condition: 'Summoned creatures or allies helped', modifier: 'No XP split with NPCs (DM discretion)' },
  ],
};

// ── Combat End Summary Template ──
export const COMBAT_SUMMARY_TEMPLATE = {
  fields: [
    { key: 'roundsFought', label: 'Rounds Fought' },
    { key: 'totalDamageDealt', label: 'Total Damage Dealt by Party' },
    { key: 'totalDamageReceived', label: 'Total Damage Received' },
    { key: 'monstersDefeated', label: 'Monsters Defeated' },
    { key: 'pcsDowned', label: 'PCs Dropped to 0 HP' },
    { key: 'spellSlotsUsed', label: 'Spell Slots Used' },
    { key: 'criticalHits', label: 'Critical Hits' },
    { key: 'criticalMisses', label: 'Natural 1s' },
    { key: 'xpEarned', label: 'XP Earned (per player)' },
    { key: 'lootFound', label: 'Loot Found' },
  ],
};

// ── Chain Conditions (item 30) ──
export const CHAIN_CONDITIONS = {
  Stunned: { includes: ['Incapacitated'], description: 'Stunned creatures are also Incapacitated' },
  Paralyzed: { includes: ['Incapacitated'], description: 'Paralyzed creatures are also Incapacitated' },
  Unconscious: { includes: ['Incapacitated', 'Prone'], description: 'Unconscious creatures are also Incapacitated and fall Prone' },
  Petrified: { includes: ['Incapacitated'], description: 'Petrified creatures are also Incapacitated' },
};

/**
 * Get turn start reminders for a combatant's active conditions.
 */
export function getTurnStartReminders(activeConditions) {
  return TURN_REMINDERS.startOfTurn.filter(r =>
    activeConditions.some(c => c === r.condition || c.name === r.condition)
  );
}

/**
 * Get turn end save prompts for a combatant's active conditions.
 */
export function getTurnEndSaves(activeConditions) {
  return TURN_REMINDERS.endOfTurn.filter(r =>
    activeConditions.some(c => c === r.condition || c.name === r.condition)
  );
}

/**
 * Calculate concentration save DC.
 */
export function getConcentrationDC(damageTaken) {
  return Math.max(10, Math.floor(damageTaken / 2));
}

/**
 * Get chain conditions for a condition.
 */
export function getChainConditions(condition) {
  return CHAIN_CONDITIONS[condition] || { includes: [], description: '' };
}

/**
 * Check if party needs a rest.
 */
export function checkRestNeeded(partyState) {
  const { avgHpPercent, encountersSinceRest, shortRestFeaturesUsed, spellSlotsUsed } = partyState;
  const suggestions = [];

  if (encountersSinceRest >= 2 && (avgHpPercent < 50 || shortRestFeaturesUsed)) {
    suggestions.push(REST_SUGGESTION_RULES.shortRest);
  }
  if (encountersSinceRest >= 6 || avgHpPercent < 30 || spellSlotsUsed > 0.7) {
    suggestions.push(REST_SUGGESTION_RULES.longRest);
  }

  return suggestions;
}

/**
 * Calculate XP distribution for defeated monsters.
 */
export function distributeXP(monsterXPValues, partySize) {
  const totalXP = monsterXPValues.reduce((sum, xp) => sum + xp, 0);
  const perPlayer = Math.floor(totalXP / partySize);
  return { totalXP, perPlayer, partySize };
}

/**
 * Generate combat end summary.
 */
export function generateCombatSummary(combatData) {
  return COMBAT_SUMMARY_TEMPLATE.fields.map(field => ({
    label: field.label,
    value: combatData[field.key] ?? 'N/A',
  }));
}
