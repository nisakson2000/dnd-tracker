/**
 * Dynamic Difficulty Scaling — Phase 9B
 *
 * Monitors combat in real-time and suggests adjustments
 * when encounters are too easy or too hard.
 */

// ── XP Thresholds per character level (5e DMG) ──
const XP_THRESHOLDS = {
  1:  { easy: 25,   medium: 50,   hard: 75,    deadly: 100 },
  2:  { easy: 50,   medium: 100,  hard: 150,   deadly: 200 },
  3:  { easy: 75,   medium: 150,  hard: 225,   deadly: 400 },
  4:  { easy: 125,  medium: 250,  hard: 375,   deadly: 500 },
  5:  { easy: 250,  medium: 500,  hard: 750,   deadly: 1100 },
  6:  { easy: 300,  medium: 600,  hard: 900,   deadly: 1400 },
  7:  { easy: 350,  medium: 750,  hard: 1100,  deadly: 1700 },
  8:  { easy: 450,  medium: 900,  hard: 1400,  deadly: 2100 },
  9:  { easy: 550,  medium: 1100, hard: 1600,  deadly: 2400 },
  10: { easy: 600,  medium: 1200, hard: 1900,  deadly: 2800 },
  11: { easy: 800,  medium: 1600, hard: 2400,  deadly: 3600 },
  12: { easy: 1000, medium: 2000, hard: 3000,  deadly: 4500 },
  13: { easy: 1100, medium: 2200, hard: 3400,  deadly: 5100 },
  14: { easy: 1250, medium: 2500, hard: 3800,  deadly: 5700 },
  15: { easy: 1400, medium: 2800, hard: 4300,  deadly: 6400 },
  16: { easy: 1600, medium: 3200, hard: 4800,  deadly: 7200 },
  17: { easy: 2000, medium: 3900, hard: 5900,  deadly: 8800 },
  18: { easy: 2100, medium: 4200, hard: 6300,  deadly: 9500 },
  19: { easy: 2400, medium: 4900, hard: 7300,  deadly: 10900 },
  20: { easy: 2800, medium: 5700, hard: 8500,  deadly: 12700 },
};

/**
 * Assess the current difficulty of an active combat encounter.
 *
 * @param {Object} params
 * @param {Object[]} params.party - [{ hpCurrent, hpMax, level, isDown }]
 * @param {Object[]} params.enemies - [{ hpCurrent, hpMax, cr, isDown }]
 * @param {number} params.roundNumber - Current combat round
 * @returns {Object} assessment
 */
export function assessCombatDifficulty({ party = [], enemies = [], roundNumber = 1 }) {
  const aliveParty = party.filter(p => !p.isDown && (p.hpCurrent || 0) > 0);
  const aliveEnemies = enemies.filter(e => !e.isDown && (e.hpCurrent || 0) > 0);

  // Average party HP percentage
  const avgPartyHp = aliveParty.length > 0
    ? aliveParty.reduce((sum, p) => sum + (p.hpCurrent / (p.hpMax || 1)), 0) / aliveParty.length
    : 0;

  const partyDeaths = party.filter(p => p.isDown).length;
  const enemiesDefeated = enemies.filter(e => e.isDown || (e.hpCurrent || 0) <= 0).length;
  const totalEnemies = enemies.length;

  let assessment = 'balanced';
  let suggestions = [];
  let urgency = 'low';

  // Emergency: multiple party deaths
  if (partyDeaths >= 2) {
    assessment = 'emergency';
    urgency = 'critical';
    suggestions = [
      'Consider having enemies offer parley or demand surrender',
      'Environmental interruption — cave-in, flood, or third party arrives',
      'Enemies retreat to regroup, giving party breathing room',
      'Reduce remaining enemy HP by 25% (battle fatigue)',
    ];
  }
  // Too hard: party HP very low early
  else if (avgPartyHp < 0.30 && roundNumber <= 3) {
    assessment = 'too_hard';
    urgency = 'high';
    suggestions = [
      'Enemy reinforcements don\'t arrive',
      'Enemies become overconfident, make tactical mistakes',
      'Allied NPC arrives to help',
      `Weaken remaining enemies (${aliveEnemies.length} left)`,
    ];
  }
  // Too easy: party is dominating
  else if (avgPartyHp > 0.75 && roundNumber >= 3 && enemiesDefeated >= totalEnemies * 0.5) {
    assessment = 'too_easy';
    urgency = 'low';
    suggestions = [
      `Add ${Math.max(1, Math.floor(aliveParty.length / 2))} reinforcements`,
      'Boss uses legendary resistance or special ability',
      'Environmental hazard activates (trap, terrain change)',
      'Enemies switch to smarter tactics (target healer, use cover)',
    ];
  }
  // Slight advantage to party
  else if (avgPartyHp > 0.60 && roundNumber >= 4) {
    assessment = 'party_favored';
    urgency = 'low';
    suggestions = [
      'Encounter is proceeding normally — no adjustment needed',
      'Optional: enemy morale breaks, survivors flee',
    ];
  }

  return {
    assessment,
    urgency,
    roundNumber,
    partyStatus: {
      alive: aliveParty.length,
      down: partyDeaths,
      avgHpPercent: Math.round(avgPartyHp * 100),
    },
    enemyStatus: {
      alive: aliveEnemies.length,
      defeated: enemiesDefeated,
      total: totalEnemies,
    },
    suggestions,
  };
}

/**
 * Post-encounter analysis — was it the right difficulty?
 *
 * @param {Object} params
 * @param {Object[]} params.party - [{ level, hpStart, hpEnd, hpMax, spellSlotsUsed, isDown }]
 * @param {string} params.ratedDifficulty - Original difficulty rating (easy/medium/hard/deadly)
 * @param {number} params.totalRounds - How many rounds the combat lasted
 * @param {string[]} params.notableEvents - Notable things that happened
 * @returns {Object} analysis
 */
export function analyzeEncounter({ party = [], ratedDifficulty = 'medium', totalRounds = 0, notableEvents = [] }) {
  const avgHpLost = party.length > 0
    ? party.reduce((sum, p) => sum + ((p.hpStart || p.hpMax || 1) - (p.hpEnd || 0)) / (p.hpMax || 1), 0) / party.length
    : 0;

  const anyDown = party.some(p => p.isDown);
  const avgLevel = party.length > 0
    ? Math.round(party.reduce((sum, p) => sum + (p.level || 1), 0) / party.length)
    : 1;

  // Determine what difficulty it actually played as
  let actualDifficulty;
  if (anyDown && avgHpLost > 0.6) actualDifficulty = 'deadly';
  else if (avgHpLost > 0.4) actualDifficulty = 'hard';
  else if (avgHpLost > 0.2) actualDifficulty = 'medium';
  else actualDifficulty = 'easy';

  const difficultyMatch = actualDifficulty === ratedDifficulty;
  const wasEasier = ['easy', 'medium', 'hard', 'deadly'].indexOf(actualDifficulty) < ['easy', 'medium', 'hard', 'deadly'].indexOf(ratedDifficulty);

  let recommendation = '';
  if (wasEasier && !difficultyMatch) {
    recommendation = `This encounter was rated ${ratedDifficulty} but played as ${actualDifficulty}. Consider increasing future encounter CR by 1 for this party.`;
  } else if (!wasEasier && !difficultyMatch) {
    recommendation = `This encounter was rated ${ratedDifficulty} but played as ${actualDifficulty}. Consider reducing future encounter CR by 1.`;
  } else {
    recommendation = `Encounter difficulty matched expectations (${ratedDifficulty}).`;
  }

  return {
    ratedDifficulty,
    actualDifficulty,
    difficultyMatch,
    totalRounds,
    avgHpLostPercent: Math.round(avgHpLost * 100),
    partyDeaths: party.filter(p => p.isDown).length,
    partyLevel: avgLevel,
    recommendation,
    notableEvents,
  };
}

/**
 * Get XP thresholds for a party.
 */
export function getPartyThresholds(partyLevels = []) {
  const thresholds = { easy: 0, medium: 0, hard: 0, deadly: 0 };

  for (const level of partyLevels) {
    const t = XP_THRESHOLDS[Math.min(20, Math.max(1, level))] || XP_THRESHOLDS[1];
    thresholds.easy += t.easy;
    thresholds.medium += t.medium;
    thresholds.hard += t.hard;
    thresholds.deadly += t.deadly;
  }

  return thresholds;
}
