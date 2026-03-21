/**
 * playerCombatRecap.js
 * Player Mode: Post-combat recap generator and analysis tools
 * Pure JS — no React dependencies.
 */

export const RECAP_SECTIONS = [
  { section: 'Combat Overview', fields: ['rounds', 'duration', 'difficulty', 'outcome'] },
  { section: 'Party Performance', fields: ['totalDamageDealt', 'totalDamageTaken', 'totalHealing', 'mvp'] },
  { section: 'Individual Stats', fields: ['damageDealt', 'damageTaken', 'healed', 'killCount', 'criticalHits', 'timesDown'] },
  { section: 'Resource Usage', fields: ['spellSlotsUsed', 'classAbilitiesUsed', 'potionsUsed', 'itemsConsumed'] },
  { section: 'Tactical Analysis', fields: ['bestMove', 'worstMoment', 'lessonsLearned'] },
  { section: 'Loot', fields: ['goldFound', 'itemsFound', 'xpEarned'] },
];

export const PERFORMANCE_RATINGS = [
  { rating: 'Flawless Victory', criteria: 'No party members went down. No resources wasted.', icon: '🏆' },
  { rating: 'Decisive Victory', criteria: 'Won cleanly with minimal losses. Good resource management.', icon: '⭐' },
  { rating: 'Hard-Fought Win', criteria: 'Won but took significant damage or lost resources.', icon: '⚔️' },
  { rating: 'Pyrrhic Victory', criteria: 'Won but at great cost. Multiple party members went down.', icon: '💀' },
  { rating: 'Tactical Retreat', criteria: 'Withdrew from combat. Survived to fight another day.', icon: '🏃' },
  { rating: 'Defeat', criteria: 'Party was defeated. TPK or captured.', icon: '☠️' },
];

export const MVP_CRITERIA = [
  { category: 'Damage Dealer', metric: 'Highest total damage dealt' },
  { category: 'Tank', metric: 'Most damage absorbed (taken - healing received)' },
  { category: 'Healer', metric: 'Most HP restored to allies' },
  { category: 'Controller', metric: 'Most enemies affected by control effects' },
  { category: 'Clutch Player', metric: 'Saved the fight with a key action (DM/party vote)' },
];

export const LESSONS_TEMPLATES = [
  { trigger: 'partyMemberDown', lesson: 'Consider: was positioning optimal? Could the healer have reached them? Was the threat prioritized?' },
  { trigger: 'longCombat', lesson: 'Combat lasted many rounds. Consider: were you focusing fire effectively? Could AoE have shortened the fight?' },
  { trigger: 'resourceHeavy', lesson: 'Heavy resource usage. Consider: was this fight harder than expected? Are there more encounters ahead? Short rest?' },
  { trigger: 'quickVictory', lesson: 'Fast victory! Great coordination. What worked well here that can be repeated?' },
  { trigger: 'noHealing', lesson: 'No healing was needed. Excellent positioning and threat management!' },
];

export function createRecap(combatData) {
  return {
    rounds: combatData.rounds || 0,
    outcome: combatData.outcome || 'Victory',
    totalDamageDealt: combatData.damageDealt || 0,
    totalDamageTaken: combatData.damageTaken || 0,
    totalHealing: combatData.healing || 0,
    timesDown: combatData.timesDown || 0,
    rating: getPerformanceRating(combatData),
    timestamp: new Date().toISOString(),
  };
}

export function getPerformanceRating(combatData) {
  if (combatData.outcome === 'Retreat') return PERFORMANCE_RATINGS.find(r => r.rating === 'Tactical Retreat');
  if (combatData.outcome === 'Defeat') return PERFORMANCE_RATINGS.find(r => r.rating === 'Defeat');
  if ((combatData.timesDown || 0) === 0 && (combatData.rounds || 0) <= 3) return PERFORMANCE_RATINGS.find(r => r.rating === 'Flawless Victory');
  if ((combatData.timesDown || 0) >= 2) return PERFORMANCE_RATINGS.find(r => r.rating === 'Pyrrhic Victory');
  if ((combatData.timesDown || 0) >= 1) return PERFORMANCE_RATINGS.find(r => r.rating === 'Hard-Fought Win');
  return PERFORMANCE_RATINGS.find(r => r.rating === 'Decisive Victory');
}

export function generateLessons(combatData) {
  const lessons = [];
  if (combatData.timesDown > 0) lessons.push(LESSONS_TEMPLATES.find(l => l.trigger === 'partyMemberDown'));
  if (combatData.rounds > 5) lessons.push(LESSONS_TEMPLATES.find(l => l.trigger === 'longCombat'));
  if (combatData.rounds <= 2) lessons.push(LESSONS_TEMPLATES.find(l => l.trigger === 'quickVictory'));
  if (combatData.healing === 0) lessons.push(LESSONS_TEMPLATES.find(l => l.trigger === 'noHealing'));
  return lessons.filter(Boolean);
}
