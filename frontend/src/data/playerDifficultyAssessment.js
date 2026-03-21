/**
 * playerDifficultyAssessment.js
 * Player Mode: Encounter difficulty assessment from the player's perspective
 * Pure JS — no React dependencies.
 */

export const DIFFICULTY_SIGNS = {
  easy: {
    label: 'Easy',
    color: '#4caf50',
    signs: ['Enemies are significantly lower level/CR', 'Outnumber enemies 2:1 or more', 'Party is fully rested', 'Enemies have no special abilities'],
    strategy: 'Go aggressive. Save resources for harder fights.',
  },
  medium: {
    label: 'Medium',
    color: '#ffc107',
    signs: ['Roughly equal numbers', 'Party has most resources', 'Some enemies have dangerous abilities', 'Terrain is neutral'],
    strategy: 'Standard tactics. Use class features but save big spells.',
  },
  hard: {
    label: 'Hard',
    color: '#ff9800',
    signs: ['Outnumbered or facing strong enemies', 'Some party members are depleted', 'Enemies have resistances/immunities', 'Unfavorable terrain'],
    strategy: 'Use your best abilities. Coordinate. Consider retreating if things go wrong.',
  },
  deadly: {
    label: 'Deadly',
    color: '#f44336',
    signs: ['Significantly outnumbered or outmatched', 'Boss monster with Legendary Actions', 'Party is depleted from previous fights', 'Enemy has lair actions'],
    strategy: 'Go all-in. Action Surge, highest spell slots, Smites on crits. Have an escape plan.',
  },
};

export const PLAYER_THREAT_ASSESSMENT = [
  { question: 'How many enemies?', below: 'Fewer than party = good', equal: 'Equal = fair', above: 'More = dangerous' },
  { question: 'Do enemies have magic?', answer: 'Enemy casters dramatically increase difficulty. Prioritize them.' },
  { question: 'What\'s the terrain like?', answer: 'Chokepoints favor the party. Open areas favor ranged. Darkness favors darkvision.' },
  { question: 'Are we rested?', answer: 'Full resources = much easier. Depleted party = everything is harder.' },
  { question: 'Can we surprise them?', answer: 'Surprise round = free first turn. MASSIVE advantage.' },
  { question: 'Do we know their weaknesses?', answer: 'Knowledge is power. Knowing immunities prevents wasted actions.' },
];

export const WHEN_TO_RUN = {
  immediate: ['Multiple party members at 0 HP', 'Healer is dead or unconscious', 'Enemy is immune to everything you have'],
  consider: ['Party is below 50% HP average', 'Out of healing resources', 'More enemies arriving', 'Enemy has not been significantly damaged'],
  stay: ['Enemy is nearly dead', 'Running is more dangerous than fighting', 'Party is in a strong defensive position', 'Reinforcements for YOUR side are coming'],
};

export function assessDifficulty(enemyCount, partySize, partyResourcePercent, enemyHasLegendary) {
  let score = 0;
  if (enemyCount > partySize * 1.5) score += 2;
  else if (enemyCount > partySize) score += 1;
  if (partyResourcePercent < 50) score += 1;
  if (partyResourcePercent < 25) score += 1;
  if (enemyHasLegendary) score += 2;

  if (score >= 4) return DIFFICULTY_SIGNS.deadly;
  if (score >= 3) return DIFFICULTY_SIGNS.hard;
  if (score >= 1) return DIFFICULTY_SIGNS.medium;
  return DIFFICULTY_SIGNS.easy;
}
