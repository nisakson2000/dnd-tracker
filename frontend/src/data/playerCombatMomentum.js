/**
 * playerCombatMomentum.js
 * Player Mode: Combat momentum tracking and swing detection
 * Pure JS — no React dependencies.
 */

export const MOMENTUM_STATES = [
  { state: 'Dominating', threshold: 75, color: '#4caf50', description: 'Party is in full control. Enemies are crumbling.', advice: 'Don\'t get cocky. Finish the fight efficiently. Conserve resources for next encounter.' },
  { state: 'Advantage', threshold: 60, color: '#8bc34a', description: 'Party has the upper hand. Things are going well.', advice: 'Press the advantage. Focus fire to remove enemies from the fight.' },
  { state: 'Even', threshold: 40, color: '#ff9800', description: 'Could go either way. Both sides trading blows.', advice: 'This is where tactics matter most. Smart play wins even fights.' },
  { state: 'Disadvantage', threshold: 25, color: '#f44336', description: 'Enemies gaining ground. Party taking heavy losses.', advice: 'Commit resources NOW or consider retreat. Half-measures lose fights.' },
  { state: 'Critical', threshold: 0, color: '#9c27b0', description: 'Party is in serious danger. Multiple members down or near death.', advice: 'All-or-nothing. Use everything. If retreat is possible, take it.' },
];

export const MOMENTUM_SWINGS = [
  { event: 'Enemy caster eliminated', swing: +20, reason: 'Removes the biggest threat source. Enemy damage output drops significantly.' },
  { event: 'Party member drops to 0 HP', swing: -15, reason: 'Lose one attacker, someone must spend action to heal. Double negative.' },
  { event: 'Successful AoE on 3+ enemies', swing: +15, reason: 'Significant HP drain on multiple enemies. Potential kills.' },
  { event: 'Enemy reinforcements arrive', swing: -20, reason: 'Action economy shifts against you. New threats to assess.' },
  { event: 'Concentration spell broken', swing: -10, reason: 'Lost an ongoing effect. Wasted the initial spell slot.' },
  { event: 'Critical hit on boss', swing: +10, reason: 'Big damage spike. Morale boost. Closer to ending the fight.' },
  { event: 'Enemy uses Legendary Resistance', swing: +5, reason: 'One fewer LR remaining. Getting closer to landing the big spell.' },
  { event: 'Successful control spell lands', swing: +15, reason: 'Enemy removed from combat temporarily. Free attacks with advantage.' },
  { event: 'TPK threat (2+ members down)', swing: -30, reason: 'Existential danger. Retreat or die.' },
];

export const COMEBACK_MECHANICS = [
  { mechanic: 'Action Surge', description: 'Fighter\'s emergency button. Extra action for burst damage.', when: 'Boss is low HP or ally needs saving.' },
  { mechanic: 'Stunning Strike', description: 'Monk stuns the biggest threat. Full round of free attacks with advantage.', when: 'Enemy has failed CON saves already, or you\'re desperate.' },
  { mechanic: 'Divine Smite (crit)', description: 'Paladin rolls a crit and dumps max smite. Massive burst.', when: 'Any crit. Always smite on crits.' },
  { mechanic: 'Hypnotic Pattern', description: 'Incapacitate multiple enemies. Swing action economy.', when: 'Multiple enemies clustered. Low WIS targets.' },
  { mechanic: 'Heal (6th level)', description: '70 HP to one creature. Full recovery.', when: 'Key party member critically low. Emergency stabilization.' },
  { mechanic: 'Polymorph (Giant Ape)', description: 'Instant 157 HP tank on the field.', when: 'Party needs an HP sponge or damage dealer immediately.' },
];

export function calculateMomentum(partyHP, partyMaxHP, enemyHP, enemyMaxHP, partyDown) {
  const partyPercent = partyMaxHP > 0 ? (partyHP / partyMaxHP) * 100 : 0;
  const enemyPercent = enemyMaxHP > 0 ? (enemyHP / enemyMaxHP) * 100 : 0;
  const momentum = ((100 - enemyPercent) - (100 - partyPercent)) / 2 + 50;
  const adjustedMomentum = Math.max(0, momentum - (partyDown * 10));
  return Math.round(Math.max(0, Math.min(100, adjustedMomentum)));
}

export function getMomentumState(momentum) {
  return MOMENTUM_STATES.find(s => momentum >= s.threshold) || MOMENTUM_STATES[MOMENTUM_STATES.length - 1];
}

export function applySwing(currentMomentum, event) {
  const swing = MOMENTUM_SWINGS.find(s =>
    s.event.toLowerCase().includes((event || '').toLowerCase())
  );
  if (!swing) return currentMomentum;
  return Math.max(0, Math.min(100, currentMomentum + swing.swing));
}
