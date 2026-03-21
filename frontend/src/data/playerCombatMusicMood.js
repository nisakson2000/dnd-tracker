/**
 * playerCombatMusicMood.js
 * Player Mode: Combat mood indicators and intensity tracking
 * Pure JS — no React dependencies.
 */

export const COMBAT_MOODS = [
  { mood: 'Tense Standoff', color: '#607d8b', description: 'Pre-combat. Both sides sizing each other up.', intensity: 1, suggestion: 'Plan carefully. Initiative hasn\'t been rolled yet.' },
  { mood: 'Skirmish', color: '#4caf50', description: 'Light combat. Enemies aren\'t a serious threat.', intensity: 2, suggestion: 'Conserve resources. Don\'t waste big spells.' },
  { mood: 'Full Battle', color: '#ff9800', description: 'Serious combat. Both sides fully engaged.', intensity: 3, suggestion: 'Use your class features. This is what they\'re for.' },
  { mood: 'Desperate Fight', color: '#f44336', description: 'Things are going badly. Party is in danger.', intensity: 4, suggestion: 'Pull out all stops. Action Surge, highest spell slots.' },
  { mood: 'Last Stand', color: '#9c27b0', description: 'Multiple allies down. Fighting for survival.', intensity: 5, suggestion: 'Nova everything. Retreat if there\'s any opening.' },
  { mood: 'Victory', color: '#ffd700', description: 'Combat won. Mopping up remaining threats.', intensity: 0, suggestion: 'Finish off stragglers. Begin post-combat procedures.' },
  { mood: 'Retreat', color: '#212121', description: 'Party is falling back. Fighting withdrawal.', intensity: 4, suggestion: 'Fog Cloud, Disengage, Dash. Cover each other.' },
];

export const INTENSITY_INDICATORS = {
  1: { label: 'Low', color: '#4caf50', description: 'Party is in control.' },
  2: { label: 'Medium', color: '#8bc34a', description: 'Challenge present but manageable.' },
  3: { label: 'High', color: '#ff9800', description: 'Real danger. Resources being consumed.' },
  4: { label: 'Critical', color: '#f44336', description: 'Party is in serious trouble.' },
  5: { label: 'Maximum', color: '#9c27b0', description: 'Life or death situation.' },
};

export function assessCombatMood(partyHpPercent, partyDown, partySize, roundNumber) {
  const downRatio = partyDown / partySize;

  if (downRatio >= 0.5) return COMBAT_MOODS.find(m => m.mood === 'Last Stand');
  if (partyHpPercent < 25 && downRatio > 0) return COMBAT_MOODS.find(m => m.mood === 'Desperate Fight');
  if (partyHpPercent < 50 || downRatio > 0.25) return COMBAT_MOODS.find(m => m.mood === 'Full Battle');
  if (roundNumber <= 1) return COMBAT_MOODS.find(m => m.mood === 'Tense Standoff');
  return COMBAT_MOODS.find(m => m.mood === 'Skirmish');
}

export function getIntensityColor(level) {
  return INTENSITY_INDICATORS[level] || INTENSITY_INDICATORS[1];
}
