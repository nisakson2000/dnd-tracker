/**
 * playerAnimateObjectsGuide.js
 * Player Mode: Animate Objects spell optimization — the swarm strategy
 * Pure JS — no React dependencies.
 */

export const ANIMATE_OBJECTS_BASICS = {
  spell: 'Animate Objects',
  level: 5,
  school: 'Transmutation',
  castingTime: '1 action',
  range: '120ft',
  components: 'V, S',
  duration: 'Concentration, up to 1 minute',
  classes: ['Bard', 'Sorcerer', 'Wizard', 'Artificer'],
  note: 'One of the highest DPR spells in the game. 10 Tiny objects = 10 attacks × (1d4+4) = devastating action economy.',
};

export const ANIMATED_OBJECT_STATS = [
  { size: 'Tiny', count: 10, hp: 20, ac: 18, attack: '+8', damage: '1d4+4', avgDPR: 85, note: 'BEST option. 10 attacks overwhelm. +8 to hit is excellent. AC 18 makes them hard to kill with AoE.' },
  { size: 'Small', count: 10, hp: 25, ac: 16, attack: '+6', damage: '1d8+2', avgDPR: 65, note: 'Fewer total attacks than Tiny. Lower hit bonus. Strictly worse than 10 Tiny.' },
  { size: 'Medium', count: 5, hp: 40, ac: 13, attack: '+5', damage: '2d6+1', avgDPR: 40, note: 'Half the attacks. Lower accuracy. Much worse than Tiny swarm.' },
  { size: 'Large', count: 2, hp: 50, ac: 10, attack: '+6', damage: '2d10+2', avgDPR: 26, note: 'Only 2 attacks. Easy to hit. Not worth it.' },
  { size: 'Huge', count: 1, hp: 80, ac: 10, attack: '+8', damage: '2d12+4', avgDPR: 17, note: 'Single attack. Terrible DPR. Only useful for blocking/grappling.' },
];

export const ANIMATE_OBJECTS_TACTICS = [
  { tactic: 'Always choose 10 Tiny objects', detail: '10 Tiny = 10×(1d4+4) = 85 avg DPR. Highest damage of any configuration. +8 to hit, AC 18. Always Tiny.', rating: 'S' },
  { tactic: 'Use coins or ball bearings', detail: 'Carry a bag of 10 coins. Animate them. They\'re Tiny objects. Always have ammo ready.', rating: 'S' },
  { tactic: 'Bonus action command', detail: 'After initial cast: bonus action to direct them each turn. Send them to attack, defend, or flank. Frees your action.', rating: 'S' },
  { tactic: 'Focus fire one target', detail: 'Send all 10 at one enemy. 10 attacks at +8. Even with AC 20, ~5 hits = 32.5 avg damage per round from a bonus action.', rating: 'A' },
  { tactic: 'Spread for harassment', detail: 'Send 2-3 objects per enemy. Force multiple creatures to deal with them. Objects provoke opportunity attacks.', rating: 'A' },
  { tactic: 'Protect concentration', detail: 'Keep some objects near you as bodyguards. They can take hits for you and threaten opportunity attacks on approaching enemies.', rating: 'A' },
];

export const ANIMATE_OBJECTS_COUNTERS = [
  { counter: 'AoE spells', detail: 'Fireball kills Tiny objects (20 HP). But AC 18 means DEX save might succeed (half damage = survive). Spread objects to avoid one AoE hitting all.' },
  { counter: 'Dispel Magic', detail: 'Ends the spell, destroying all animated objects. Single action counter.' },
  { counter: 'Antimagic Field', detail: 'Objects in the field become inert. Move them out of the field.' },
  { counter: 'Breaking concentration', detail: 'If the caster loses concentration, all objects drop. Protect the caster.' },
];

export function tinyObjectSwarmDPR(numberOfObjects, hitBonus, targetAC) {
  const hitChance = Math.min(0.95, Math.max(0.05, (21 - targetAC + hitBonus) / 20));
  const damagePerHit = 6.5; // 1d4+4 avg
  return numberOfObjects * hitChance * damagePerHit;
}

export function objectSurvivesFireball(dexSaveBonus, saveDC) {
  const saveChance = Math.min(0.95, Math.max(0.05, (21 - saveDC + dexSaveBonus) / 20));
  const avgDamage = 28; // 8d6 avg
  const surviveOnSave = 20 >= avgDamage / 2; // 20 HP vs 14 half damage
  const surviveOnFail = 20 >= avgDamage; // 20 HP vs 28 full damage
  return { saveChance, surviveOnSave, surviveOnFail };
}
