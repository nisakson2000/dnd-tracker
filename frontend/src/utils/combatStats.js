// Combat statistics tracker - accumulates stats during a session
const STATS_KEY = 'codex-combat-stats';

function getStats() {
  try {
    return JSON.parse(sessionStorage.getItem(STATS_KEY) || 'null') || createEmpty();
  } catch { return createEmpty(); }
}

function saveStats(stats) {
  sessionStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

function createEmpty() {
  return {
    totalDamageDealt: 0,
    totalDamageReceived: 0,
    totalHealing: 0,
    attacksMade: 0,
    attacksHit: 0,
    criticalHits: 0,
    criticalMisses: 0,
    spellsCast: 0,
    slotsUsed: 0,
    killCount: 0,
    turnsPlayed: 0,
    conditionsApplied: 0,
    deathSaveSuccesses: 0,
    deathSaveFailures: 0,
    itemsUsed: 0,
    featuresUsed: 0,
    highestDamage: { amount: 0, source: '' },
    biggestHeal: { amount: 0, source: '' },
    encountersCompleted: 0,
    sessionStart: Date.now(),
    combatLog: [] // last 100 entries
  };
}

export function recordAttack(hit, damage, source, isCrit, isCritMiss) {
  const s = getStats();
  s.attacksMade++;
  if (hit) { s.attacksHit++; s.totalDamageDealt += damage; }
  if (isCrit) s.criticalHits++;
  if (isCritMiss) s.criticalMisses++;
  if (damage > s.highestDamage.amount) s.highestDamage = { amount: damage, source };
  s.combatLog.push({ type: 'attack', hit, damage, source, isCrit, time: Date.now() });
  if (s.combatLog.length > 100) s.combatLog.shift();
  saveStats(s);
}

export function recordDamageReceived(amount) {
  const s = getStats();
  s.totalDamageReceived += amount;
  saveStats(s);
}

export function recordHealing(amount, source) {
  const s = getStats();
  s.totalHealing += amount;
  if (amount > s.biggestHeal.amount) s.biggestHeal = { amount, source };
  s.combatLog.push({ type: 'heal', amount, source, time: Date.now() });
  if (s.combatLog.length > 100) s.combatLog.shift();
  saveStats(s);
}

export function recordSpellCast(slotLevel) {
  const s = getStats();
  s.spellsCast++;
  if (slotLevel > 0) s.slotsUsed++;
  saveStats(s);
}

export function recordKill() {
  const s = getStats();
  s.killCount++;
  saveStats(s);
}

export function recordTurn() {
  const s = getStats();
  s.turnsPlayed++;
  saveStats(s);
}

export function recordDeathSave(success) {
  const s = getStats();
  if (success) s.deathSaveSuccesses++;
  else s.deathSaveFailures++;
  saveStats(s);
}

export function recordItemUsed() {
  const s = getStats();
  s.itemsUsed++;
  saveStats(s);
}

export function recordFeatureUsed() {
  const s = getStats();
  s.featuresUsed++;
  saveStats(s);
}

export function recordConditionApplied() {
  const s = getStats();
  s.conditionsApplied++;
  saveStats(s);
}

export function recordEncounterComplete() {
  const s = getStats();
  s.encountersCompleted++;
  saveStats(s);
}

export function getCombatStats() {
  const s = getStats();
  const hitRate = s.attacksMade > 0 ? Math.round((s.attacksHit / s.attacksMade) * 100) : 0;
  const sessionDuration = Math.round((Date.now() - s.sessionStart) / 60000); // minutes
  return { ...s, hitRate, sessionDuration };
}

export function resetCombatStats() {
  sessionStorage.removeItem(STATS_KEY);
}
