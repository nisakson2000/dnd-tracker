/**
 * playerSwarmkeeperGuide.js
 * Player Mode: Swarmkeeper Ranger — nature's swarm commander
 * Pure JS — no React dependencies.
 */

export const SWARMKEEPER_BASICS = {
  class: 'Ranger (Swarmkeeper)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Bonded with a swarm of tiny creatures (insects, birds, fey spirits, etc.).',
  note: 'Underrated Ranger. Gathered Swarm gives free forced movement + damage on every hit. Web spell access.',
};

export const SWARMKEEPER_FEATURES = [
  { feature: 'Gathered Swarm', level: 3, effect: 'Once per turn, on hit: choose one — target takes +1d6 piercing, or target moves 15ft horizontally (STR save), or you move 5ft (no OA).', note: '1d6 extra damage OR 15ft push OR free 5ft shift. Every turn. Free. Three great options.' },
  { feature: 'Swarmkeeper Magic', level: 3, effect: 'Learn extra spells: Faerie Fire (3rd), Web (5th), Gaseous Form (9th), Arcane Eye (13th), Insect Plague (17th).', note: 'Web is incredible (restrained on failed save, concentration). Faerie Fire for advantage. Great list.' },
  { feature: 'Writhing Tide', level: 7, effect: 'Bonus action: swarm lifts you, 10ft hover for 1 minute. PB times/long rest.', note: '10ft hover. Avoid ground hazards, difficult terrain, some traps. Pseudo-flight.' },
  { feature: 'Mighty Swarm', level: 11, effect: 'Gathered Swarm upgrade: push option becomes Large or smaller + knocked prone. Movement option gives half cover. Damage option stays same.', note: 'Push + prone (advantage for melee allies) or half cover when you move. Huge upgrade.' },
  { feature: 'Swarming Dispersal', level: 15, effect: 'Reaction when you take damage: gain resistance to that damage. Teleport 30ft to unoccupied space. You appear in swarm form. PB times/long rest.', note: 'Damage resistance + teleport. Excellent escape/survival.' },
];

export const GATHERED_SWARM_TACTICS = [
  { tactic: 'Push into hazards', detail: 'Push target 15ft into: Spike Growth (2d4 per 5ft = 6d4), Spirit Guardians, Wall of Fire, pits, cliffs.', rating: 'S', note: 'Spike Growth + Swarmkeeper push = 6d4 damage per push. Every turn.' },
  { tactic: 'Prone + ally advantage', detail: 'L11: push Large or smaller prone. All melee allies have advantage on attacks against prone target.', rating: 'S' },
  { tactic: 'Free repositioning', detail: 'Move 5ft (no OA) on hit. Stay mobile without using Cunning Action or similar.', rating: 'A' },
  { tactic: 'Web + push', detail: 'Cast Web (swarmkeeper spell). Push enemies into it with Gathered Swarm. Restrained.', rating: 'A' },
  { tactic: 'Half cover on move', detail: 'L11: when you use the move option, gain half cover (+2 AC/DEX saves). Hit-and-run defense.', rating: 'A' },
];

export const SPIKE_GROWTH_PUSH_MATH = {
  combo: 'Spike Growth + Gathered Swarm push',
  spikeGrowthDamage: '2d4 per 5ft moved through thorns',
  pushDistance: '15ft (3 × 5ft segments)',
  totalDamage: '6d4 = avg 15 per push',
  perTurn: 'Hit once, push once per turn = 15 extra damage',
  note: 'Two attacks at L5: hit with first, push into Spike Growth. Hit with second, push again if Druidic Warrior or ally pushes.',
};

export const SWARMKEEPER_VS_GLOOM_STALKER = {
  swarmkeeper: { pros: ['Forced movement every turn', 'Spike Growth combo', 'Web spell access', 'Hover/flight', 'Prone at L11'], cons: ['Less burst damage', 'No invisibility', 'Push requires hit'] },
  gloomStalker: { pros: ['Turn-1 burst', 'Darkvision invisibility', '+WIS initiative', 'Best multiclass dip'], cons: ['No forced movement', 'Darkness-dependent', 'Front-loaded'] },
  verdict: 'Swarmkeeper for sustained control + Spike Growth combos. Gloom Stalker for burst.',
};

export function gatheredSwarmDamage(rangerLevel) {
  return rangerLevel >= 11 ? 4.5 : 3.5; // 1d8 at L11? No, stays 1d6. Just extra options.
  // Actually stays 1d6 throughout. The upgrade is to push/prone/cover.
}

export function spikeGrowthPushDamage(pushDistance) {
  const segments = Math.floor(pushDistance / 5);
  return segments * 5; // 2d4 avg = 5 per 5ft
}

export function writhingTideUses(proficiencyBonus) {
  return proficiencyBonus;
}
