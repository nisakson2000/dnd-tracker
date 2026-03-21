/**
 * playerCombatDiary.js
 * Player Mode: Session-by-session combat performance diary
 * Pure JS — no React dependencies.
 */

export const DIARY_ENTRY_TEMPLATE = {
  sessionDate: null,
  sessionNumber: 0,
  combats: [],
  totalDamageDealt: 0,
  totalDamageTaken: 0,
  totalHealing: 0,
  killCount: 0,
  timesDown: 0,
  criticalHits: 0,
  criticalMisses: 0,
  spellSlotsUsed: 0,
  bestMoment: '',
  worstMoment: '',
  lessonsLearned: '',
  xpGained: 0,
  goldGained: 0,
  itemsFound: [],
};

export const COMBAT_ENTRY_TEMPLATE = {
  encounterName: '',
  enemies: '',
  difficulty: '',
  rounds: 0,
  result: '', // win, retreat, loss
  personalDamage: 0,
  personalHealing: 0,
  mvpAction: '',
  resourcesUsed: '',
};

export const PERFORMANCE_BADGES = [
  { name: 'First Blood', condition: 'First to deal damage in combat', icon: '🩸' },
  { name: 'Finishing Blow', condition: 'Landed the killing blow on the boss', icon: '⚔️' },
  { name: 'Medic', condition: 'Healed 3+ different allies in one combat', icon: '💊' },
  { name: 'Iron Wall', condition: 'Took 50+ damage in one combat and survived', icon: '🛡️' },
  { name: 'Nova Round', condition: 'Dealt 50+ damage in a single turn', icon: '💥' },
  { name: 'Clutch Save', condition: 'Succeeded on a death save nat 20', icon: '🌟' },
  { name: 'Controller', condition: 'Disabled 3+ enemies with one spell', icon: '🧊' },
  { name: 'Untouchable', condition: 'Took 0 damage in a full combat', icon: '👻' },
  { name: 'Crit Fisher', condition: '3+ critical hits in one session', icon: '🎯' },
  { name: 'Team Player', condition: 'Used Help action or Bardic Inspiration 3+ times', icon: '🤝' },
];

export function createDiaryEntry(sessionNumber) {
  return {
    ...DIARY_ENTRY_TEMPLATE,
    sessionDate: new Date().toISOString().split('T')[0],
    sessionNumber,
    combats: [],
  };
}

export function createCombatEntry(name) {
  return { ...COMBAT_ENTRY_TEMPLATE, encounterName: name };
}

export function checkBadges(entry) {
  const earned = [];
  if (entry.criticalHits >= 3) earned.push(PERFORMANCE_BADGES.find(b => b.name === 'Crit Fisher'));
  if (entry.totalDamageTaken === 0 && entry.combats.length > 0) earned.push(PERFORMANCE_BADGES.find(b => b.name === 'Untouchable'));
  if (entry.killCount > 0) earned.push(PERFORMANCE_BADGES.find(b => b.name === 'Finishing Blow'));
  return earned.filter(Boolean);
}
