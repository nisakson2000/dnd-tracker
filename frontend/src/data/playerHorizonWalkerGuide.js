/**
 * playerHorizonWalkerGuide.js
 * Player Mode: Horizon Walker Ranger — planar warrior and teleporting striker
 * Pure JS — no React dependencies.
 */

export const HORIZON_WALKER_BASICS = {
  class: 'Ranger (Horizon Walker)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Guardian of planar boundaries. Teleporting striker with force damage.',
  note: 'Excellent thematic subclass with strong mid-level features. Force damage is rarely resisted.',
};

export const HORIZON_WALKER_FEATURES = [
  { feature: 'Detect Portal', level: 3, effect: 'Action: sense distance and direction to nearest planar portal within 1 mile. 1/short rest.', note: 'Niche but flavorful. Useful in planar campaigns.' },
  { feature: 'Planar Warrior', level: 3, effect: 'Bonus action: choose target within 30ft. Next hit deals force damage instead of normal + extra 1d8 force.', note: 'Force damage is almost never resisted. +1d8 bonus damage per turn.' },
  { feature: 'Ethereal Step', level: 7, effect: 'Bonus action: step into Ethereal Plane until end of turn. Move through creatures and objects. 1/short rest.', note: 'Phase through walls, enemies, obstacles. Escape from grapples, restraints, prisons.' },
  { feature: 'Distant Strike', level: 11, effect: 'When you take the Attack action, teleport 10ft before EACH attack. If you attack 2 different creatures, make a third attack against a third creature.', note: 'Teleport 10ft per attack. 3 attacks at L11 against different targets. Mobile and deadly.' },
  { feature: 'Spectral Defense', level: 15, effect: 'Reaction when you take damage: gain resistance to ALL that damage.', note: 'Universal resistance reaction. Halve any damage. No resource cost except reaction.' },
];

export const HORIZON_WALKER_TACTICS = [
  { tactic: 'Planar Warrior damage', detail: 'Bonus action: next hit deals force + 1d8. At L11: 2d8. Force damage bypasses almost everything.', rating: 'A' },
  { tactic: 'Distant Strike mobility', detail: 'L11: teleport 10ft before each attack. Attack 3 different targets. Never stand still.', rating: 'S' },
  { tactic: 'Ethereal Step escape', detail: 'Phase through walls. Escape from prison cells, Web, grapples. Scout through doors.', rating: 'A' },
  { tactic: 'Spectral Defense tank', detail: 'Take a big hit? Reaction: halve it. Dragon breath? Halved. No cost. Every fight.', rating: 'S' },
  { tactic: 'Haste + Distant Strike', detail: 'Haste gives 4th attack (1 weapon attack only). Teleport 4 times. 4 targets or 3+1.', rating: 'A' },
];

export const HORIZON_WALKER_SPELLS = [
  { level: 1, spell: 'Protection from Evil and Good', note: 'Subclass spell. Prevents charm/frighten from aberrations, fey, fiends.' },
  { level: 2, spell: 'Misty Step', note: 'Subclass spell. Bonus action 30ft teleport. Stacks with Distant Strike teleports.' },
  { level: 3, spell: 'Haste', note: 'Subclass spell. Self-Haste: +2 AC, double speed, extra attack. Risk: lethargy on end.' },
  { level: 4, spell: 'Banishment', note: 'Subclass spell. Send creatures back to their home plane. CHA save.' },
  { level: 5, spell: 'Teleportation Circle', note: 'Subclass spell. Create a permanent teleportation network over time.' },
];

export const HORIZON_WALKER_VS_GLOOM_STALKER = {
  horizonWalker: { pros: ['Force damage (best type)', 'Teleporting attacks', 'Phase through walls', 'Universal damage resistance'], cons: ['Planar Warrior uses bonus action', 'Best features at L11+', 'Less burst than Gloom Stalker'] },
  gloomStalker: { pros: ['Massive turn-1 burst', 'Invisible to darkvision', '+WIS to initiative', 'Best multiclass dip'], cons: ['Less mobile', 'No teleportation', 'Darkness-dependent'] },
  verdict: 'Gloom Stalker for burst and multiclass. Horizon Walker for sustained damage and teleportation.',
};

export function planarWarriorDamage(rangerLevel) {
  return rangerLevel >= 11 ? 9 : 4.5; // 2d8 at 11, 1d8 before
}

export function distantStrikeAttacks(differentTargets) {
  return differentTargets >= 2 ? 3 : 2; // 3 attacks if hitting 2+ different targets
}
