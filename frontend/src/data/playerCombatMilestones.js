/**
 * playerCombatMilestones.js
 * Player Mode: Combat achievement tracking and milestone rewards
 * Pure JS — no React dependencies.
 */

export const COMBAT_MILESTONES = [
  { milestone: 'First Blood', description: 'Deal the first damage in a combat encounter.', icon: '🩸', category: 'offense' },
  { milestone: 'Finishing Blow', description: 'Land the killing blow on an enemy.', icon: '💀', category: 'offense' },
  { milestone: 'One-Hit Kill', description: 'Kill an enemy in a single attack.', icon: '⚡', category: 'offense' },
  { milestone: 'Critical Strike', description: 'Roll a natural 20 on an attack roll.', icon: '🎯', category: 'offense' },
  { milestone: 'Perfect Defense', description: 'Go an entire combat without taking damage.', icon: '🛡️', category: 'defense' },
  { milestone: 'Last Stand', description: 'Win a combat where you were the last party member standing.', icon: '🏴', category: 'defense' },
  { milestone: 'Guardian', description: 'Protect an ally from a killing blow.', icon: '🦸', category: 'support' },
  { milestone: 'Clutch Heal', description: 'Heal a downed ally who then acts to turn the tide.', icon: '💚', category: 'support' },
  { milestone: 'Crowd Controller', description: 'Successfully control 3+ enemies with one spell.', icon: '🌀', category: 'control' },
  { milestone: 'Untouchable', description: 'Dodge or block 3+ attacks in a single round.', icon: '🌬️', category: 'defense' },
  { milestone: 'Dragon Slayer', description: 'Participate in killing a dragon.', icon: '🐉', category: 'boss' },
  { milestone: 'Boss Killer', description: 'Land the killing blow on a boss-level enemy.', icon: '👑', category: 'boss' },
  { milestone: 'Demolisher', description: 'Deal 50+ damage in a single turn.', icon: '💥', category: 'offense' },
  { milestone: 'Comeback King', description: 'Win a fight after 2+ party members went down.', icon: '👊', category: 'team' },
  { milestone: 'Speed Run', description: 'End a combat in 2 rounds or fewer.', icon: '⏱️', category: 'efficiency' },
  { milestone: 'Survivor', description: 'Make 3 death saves in a row and survive.', icon: '❤️‍🔥', category: 'survival' },
  { milestone: 'Diplomat', description: 'End a combat through negotiation instead of violence.', icon: '🕊️', category: 'social' },
  { milestone: 'Executioner', description: 'Kill 5+ enemies in a single combat.', icon: '⚔️', category: 'offense' },
  { milestone: 'Iron Wall', description: 'Absorb 100+ damage in a single combat.', icon: '🧱', category: 'defense' },
  { milestone: 'Counter Master', description: 'Successfully Counterspell a 5th+ level spell.', icon: '✋', category: 'control' },
];

export const LIFETIME_ACHIEVEMENTS = [
  { achievement: 'Veteran', requirement: 'Survive 10 combat encounters.', icon: '🎖️' },
  { achievement: 'War Hero', requirement: 'Survive 50 combat encounters.', icon: '🏅' },
  { achievement: 'Legend', requirement: 'Survive 100 combat encounters.', icon: '🏆' },
  { achievement: 'Damage Machine', requirement: 'Deal 1,000 total damage.', icon: '💣' },
  { achievement: 'Life Saver', requirement: 'Revive 10 downed allies.', icon: '🩹' },
  { achievement: 'Perfect Streak', requirement: '5 combats in a row without going down.', icon: '🔥' },
];

export function checkMilestone(event, combatData) {
  const earned = [];
  if (event === 'kill' && combatData.killCount >= 5) earned.push('Executioner');
  if (event === 'crit') earned.push('Critical Strike');
  if (event === 'damage' && combatData.turnDamage >= 50) earned.push('Demolisher');
  if (event === 'heal' && combatData.targetWasDown) earned.push('Clutch Heal');
  if (event === 'combatEnd' && combatData.damageTaken === 0) earned.push('Perfect Defense');
  return earned.map(name => COMBAT_MILESTONES.find(m => m.milestone === name)).filter(Boolean);
}

export function getMilestonesByCategory(category) {
  return COMBAT_MILESTONES.filter(m => m.category === category);
}

export function getAllMilestones() {
  return COMBAT_MILESTONES;
}
