/**
 * playerCombatTimers.js
 * Player Mode: Track spell durations, effect timers, and round counting
 * Pure JS — no React dependencies.
 */

export const DURATION_TYPES = {
  instantaneous: { rounds: 0, label: 'Instantaneous', color: '#9e9e9e' },
  '1round': { rounds: 1, label: '1 Round', color: '#f44336' },
  '1minute': { rounds: 10, label: '1 Minute (10 rounds)', color: '#ff9800' },
  '10minutes': { rounds: 100, label: '10 Minutes', color: '#ffc107' },
  '1hour': { rounds: 600, label: '1 Hour', color: '#4caf50' },
  '8hours': { rounds: 4800, label: '8 Hours', color: '#2196f3' },
  '24hours': { rounds: 14400, label: '24 Hours', color: '#3f51b5' },
  concentration: { rounds: null, label: 'Concentration (varies)', color: '#e91e63' },
  untilDispelled: { rounds: Infinity, label: 'Until Dispelled', color: '#9c27b0' },
};

export const COMMON_TIMED_EFFECTS = [
  { name: 'Bless', duration: '1minute', concentration: true, reminder: 'Targets add 1d4 to attacks and saves.' },
  { name: 'Shield of Faith', duration: '10minutes', concentration: true, reminder: '+2 AC to target.' },
  { name: 'Haste', duration: '1minute', concentration: true, reminder: 'Double speed, +2 AC, extra action. Lethargy if broken!' },
  { name: 'Fly', duration: '10minutes', concentration: true, reminder: '60ft flying speed. Falls if concentration breaks!' },
  { name: 'Greater Invisibility', duration: '1minute', concentration: true, reminder: 'Invisible even when attacking/casting.' },
  { name: 'Spirit Guardians', duration: '10minutes', concentration: true, reminder: '3d8 damage when enemies enter/start in 15ft radius.' },
  { name: 'Hold Person', duration: '1minute', concentration: true, reminder: 'Target paralyzed. Repeats save each turn end.' },
  { name: 'Web', duration: '1hour', concentration: true, reminder: 'Restrained if failed STR save. Flammable!' },
  { name: 'Hex', duration: '1hour', concentration: true, reminder: '+1d6 necrotic per hit. Disadvantage on one ability check.' },
  { name: 'Hunter\'s Mark', duration: '1hour', concentration: true, reminder: '+1d6 per hit. Advantage tracking target.' },
  { name: 'Rage', duration: '1minute', concentration: false, reminder: 'Resistance B/P/S, +damage. Must attack or take damage.' },
  { name: 'Bardic Inspiration', duration: '10minutes', concentration: false, reminder: 'Add die to one attack/check/save. Use before roll result.' },
  { name: 'Shield', duration: '1round', concentration: false, reminder: '+5 AC until start of next turn.' },
  { name: 'Mage Armor', duration: '8hours', concentration: false, reminder: 'AC = 13 + DEX mod.' },
  { name: 'Aid', duration: '8hours', concentration: false, reminder: '+5/+10/+15 max HP (scales with slot).' },
  { name: 'Death Ward', duration: '8hours', concentration: false, reminder: 'First drop to 0 HP → go to 1 HP instead. One use.' },
];

export function createTimer(effectName, currentRound) {
  const effect = COMMON_TIMED_EFFECTS.find(e => e.name.toLowerCase() === (effectName || '').toLowerCase());
  const durationType = effect ? DURATION_TYPES[effect.duration] : null;
  return {
    name: effectName,
    startRound: currentRound,
    totalRounds: durationType ? durationType.rounds : null,
    concentration: effect ? effect.concentration : false,
    reminder: effect ? effect.reminder : '',
    active: true,
  };
}

export function getRemainingRounds(timer, currentRound) {
  if (!timer || timer.totalRounds === null || timer.totalRounds === Infinity) return null;
  const elapsed = currentRound - timer.startRound;
  return Math.max(0, timer.totalRounds - elapsed);
}

export function isExpired(timer, currentRound) {
  const remaining = getRemainingRounds(timer, currentRound);
  return remaining !== null && remaining <= 0;
}
