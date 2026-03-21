/**
 * playerCombatLogging.js
 * Player Mode: Combat event logging for review and improvement
 * Pure JS — no React dependencies.
 */

export const LOG_CATEGORIES = [
  { category: 'damage_dealt', icon: '⚔️', label: 'Damage Dealt', fields: ['target', 'amount', 'type', 'source', 'crit'] },
  { category: 'damage_taken', icon: '💔', label: 'Damage Taken', fields: ['source', 'amount', 'type', 'saved'] },
  { category: 'healing', icon: '💚', label: 'Healing', fields: ['target', 'amount', 'spell', 'overheal'] },
  { category: 'spell_cast', icon: '✨', label: 'Spell Cast', fields: ['spell', 'level', 'slot_used', 'targets', 'effect'] },
  { category: 'condition', icon: '⚠️', label: 'Condition Applied', fields: ['condition', 'target', 'source', 'save_dc', 'duration'] },
  { category: 'kill', icon: '💀', label: 'Kill', fields: ['target', 'method', 'overkill_damage'] },
  { category: 'death_save', icon: '☠️', label: 'Death Save', fields: ['result', 'roll', 'successes', 'failures'] },
  { category: 'critical', icon: '🎯', label: 'Critical Hit', fields: ['target', 'damage', 'weapon_or_spell'] },
  { category: 'miss', icon: '💨', label: 'Miss', fields: ['target', 'roll', 'target_ac', 'by_how_much'] },
  { category: 'save', icon: '🛡️', label: 'Saving Throw', fields: ['type', 'dc', 'roll', 'result', 'effect'] },
];

export const COMBAT_LOG_TEMPLATE = {
  combatId: null,
  startTime: null,
  endTime: null,
  roundCount: 0,
  encounter: '',
  difficulty: '',
  events: [],
  summary: {
    totalDamageDealt: 0,
    totalDamageTaken: 0,
    totalHealing: 0,
    spellSlotsUsed: 0,
    killCount: 0,
    critCount: 0,
    missCount: 0,
    hitCount: 0,
    turnsConcentrating: 0,
    deathSaves: { successes: 0, failures: 0 },
  },
};

export const EVENT_TEMPLATE = {
  timestamp: null,
  round: 0,
  turn: '',
  category: '',
  data: {},
  note: '',
};

export const STAT_CALCULATIONS = {
  hitRate: (hits, total) => total > 0 ? ((hits / total) * 100).toFixed(1) + '%' : '0%',
  dpr: (totalDamage, rounds) => rounds > 0 ? (totalDamage / rounds).toFixed(1) : '0',
  healingEfficiency: (healing, overheal) => healing > 0 ? (((healing - overheal) / healing) * 100).toFixed(1) + '%' : '100%',
  slotEfficiency: (slotsUsed, effectiveSlots) => effectiveSlots > 0 ? ((slotsUsed / effectiveSlots) * 100).toFixed(1) + '%' : '0%',
  avgDamagePerHit: (totalDamage, hits) => hits > 0 ? (totalDamage / hits).toFixed(1) : '0',
};

export const POST_COMBAT_QUESTIONS = [
  'Did I use my action every turn?',
  'Did I use my bonus action every turn?',
  'Did I use my reaction when I could have?',
  'Did I focus fire on the right target?',
  'Was my positioning optimal?',
  'Did I protect my concentration?',
  'Did I waste spell slots on overkill?',
  'Did I communicate with my party?',
  'What was my best decision this combat?',
  'What would I do differently?',
];

export function createCombatLog(encounterName, difficulty) {
  return {
    ...COMBAT_LOG_TEMPLATE,
    combatId: Date.now(),
    startTime: new Date().toISOString(),
    encounter: encounterName || 'Unknown Encounter',
    difficulty: difficulty || 'Unknown',
    events: [],
    summary: { ...COMBAT_LOG_TEMPLATE.summary },
  };
}

export function logEvent(combatLog, category, round, data, note) {
  const event = {
    ...EVENT_TEMPLATE,
    timestamp: new Date().toISOString(),
    round,
    category,
    data: { ...data },
    note: note || '',
  };
  combatLog.events.push(event);

  // Auto-update summary
  if (category === 'damage_dealt') combatLog.summary.totalDamageDealt += (data.amount || 0);
  if (category === 'damage_taken') combatLog.summary.totalDamageTaken += (data.amount || 0);
  if (category === 'healing') combatLog.summary.totalHealing += (data.amount || 0);
  if (category === 'kill') combatLog.summary.killCount++;
  if (category === 'critical') combatLog.summary.critCount++;
  if (category === 'miss') combatLog.summary.missCount++;
  if (category === 'spell_cast') combatLog.summary.spellSlotsUsed++;

  return event;
}

export function endCombat(combatLog, roundCount) {
  combatLog.endTime = new Date().toISOString();
  combatLog.roundCount = roundCount;
  return combatLog;
}

export function getCombatStats(combatLog) {
  const s = combatLog.summary;
  const totalAttacks = s.hitCount + s.missCount;
  return {
    hitRate: STAT_CALCULATIONS.hitRate(s.hitCount, totalAttacks),
    dpr: STAT_CALCULATIONS.dpr(s.totalDamageDealt, combatLog.roundCount),
    avgDamagePerHit: STAT_CALCULATIONS.avgDamagePerHit(s.totalDamageDealt, s.hitCount),
    totalDamageDealt: s.totalDamageDealt,
    totalDamageTaken: s.totalDamageTaken,
    totalHealing: s.totalHealing,
    killCount: s.killCount,
    critRate: STAT_CALCULATIONS.hitRate(s.critCount, totalAttacks),
  };
}
