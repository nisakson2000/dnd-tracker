/**
 * playerSwarmTactics.js
 * Player Mode: Fighting swarms and large groups of enemies — AoE strategy and action economy
 * Pure JS — no React dependencies.
 */

export const SWARM_CHARACTERISTICS = {
  description: 'Swarms are groups of tiny/small creatures acting as one. They have special rules.',
  rules: [
    'Swarms can occupy another creature\'s space and vice versa.',
    'Swarms can move through small openings.',
    'Swarms can\'t regain HP or gain temp HP.',
    'Swarms have resistance to bludgeoning, piercing, and slashing damage.',
    'Swarm damage is halved when the swarm is at half HP.',
  ],
  weakness: 'AoE damage. Fire, thunder, and AoE spells bypass their physical resistance and hit the whole swarm.',
};

export const ANTI_SWARM_SPELLS = [
  { spell: 'Fireball', level: 3, damage: '8d6 fire', area: '20ft radius', why: 'The gold standard anti-group spell. Hits everyone in range.', rating: 'S' },
  { spell: 'Spirit Guardians', level: 3, damage: '3d8 radiant/necrotic per turn', area: '15ft radius (moves with you)', why: 'Sustained AoE. Walk into the swarm. They all take damage.', rating: 'S' },
  { spell: 'Thunderwave', level: 1, damage: '2d8 thunder', area: '15ft cube', why: 'Low level AoE. Also pushes enemies back 10ft.', rating: 'A' },
  { spell: 'Burning Hands', level: 1, damage: '3d6 fire', area: '15ft cone', why: 'Low level fire AoE. Good against insect swarms.', rating: 'A' },
  { spell: 'Shatter', level: 2, damage: '3d8 thunder', area: '10ft radius sphere', why: 'Thunder damage. Good range (60ft). Hits constructs hard.', rating: 'A' },
  { spell: 'Hypnotic Pattern', level: 3, damage: 'None (incapacitate)', area: '30ft cube', why: 'Incapacitate multiple enemies. No damage but removes them from combat.', rating: 'S' },
  { spell: 'Web', level: 2, damage: 'None (restrain)', area: '20ft cube', why: 'Restrains multiple enemies. Flammable. Good combo with fire.', rating: 'A' },
  { spell: 'Entangle', level: 1, damage: 'None (restrain)', area: '20ft square', why: 'Low-level restraining AoE. Multiple enemies stuck.', rating: 'A' },
  { spell: 'Plant Growth', level: 3, damage: 'None (difficult terrain)', area: '100ft radius', why: 'No save. No concentration. Costs 4x movement. Swarms can\'t reach you.', rating: 'A' },
  { spell: 'Moonbeam', level: 2, damage: '2d10 radiant per turn', area: '5ft radius cylinder', why: 'Move it each turn. Good sustained damage vs shapeshifters.', rating: 'B' },
];

export const ANTI_SWARM_TACTICS = [
  { tactic: 'Chokepoint', detail: 'Fight in a doorway. Only 1-2 enemies can reach you per turn. Negates their numbers.', rating: 'S' },
  { tactic: 'AoE first, then clean up', detail: 'Open with Fireball/Hypnotic Pattern. Then focus fire survivors.', rating: 'S' },
  { tactic: 'Spirit Guardians + Dodge', detail: 'Cleric casts Spirit Guardians, then Dodge action. Enemies take damage approaching and have disadvantage attacking.', rating: 'S' },
  { tactic: 'Create difficult terrain', detail: 'Spike Growth, Plant Growth, Web. Slow their approach so they can\'t swarm you.', rating: 'A' },
  { tactic: 'Forced movement through hazards', detail: 'Spike Growth + Repelling Blast. Each 5ft of forced movement = 2d4 damage.', rating: 'A' },
  { tactic: 'High ground', detail: 'Get on a ledge or roof. Melee swarms can\'t reach you without climbing.', rating: 'A' },
  { tactic: 'Turn Undead (vs undead swarms)', detail: 'Channel Divinity: Turn Undead. All undead within 30ft flee for 1 minute on failed WIS save.', rating: 'S (vs undead)' },
  { tactic: 'Sleep (low level)', detail: 'Sleep affects based on HP. Against lots of weak creatures, it can knock out many at once.', rating: 'A (low level)' },
];

export const LARGE_GROUP_MATH = {
  description: 'When fighting 8+ enemies, action economy is the real danger.',
  examples: [
    { enemies: '8 goblins', attacks: '8 attacks per round', avgDamage: '40 damage/round (5 per goblin)', note: 'Even 5 damage per hit × 8 = 40 DPR. That kills most PCs in 2 rounds.' },
    { enemies: '6 wolves', attacks: '6 attacks with Pack Tactics (advantage)', avgDamage: '42 damage/round (7 per wolf with advantage)', note: 'Pack Tactics gives advantage. They hit often.' },
    { enemies: '10 zombies', attacks: '10 attacks', avgDamage: '45 damage/round (4.5 per zombie)', note: 'Undead Fortitude means they don\'t die easily. Sustained threat.' },
  ],
  conclusion: 'Never underestimate large groups. Action economy kills parties.',
};

export function aoeEfficiency(spellDamage, targetsHit, spellSlotLevel) {
  const totalDamage = spellDamage * targetsHit;
  const damagePerSlotLevel = totalDamage / spellSlotLevel;
  return { totalDamage, damagePerSlotLevel, worthIt: targetsHit >= 3 };
}

export function isAoEWorthIt(targets, aoeAvgDamage, singleTargetAvgDamage) {
  return { aoeTotal: aoeAvgDamage * targets, singleTotal: singleTargetAvgDamage, useAoE: aoeAvgDamage * targets > singleTargetAvgDamage * 1.5 };
}
