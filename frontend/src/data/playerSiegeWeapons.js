/**
 * playerSiegeWeapons.js
 * Player Mode: Siege weapons, fortification rules, and castle assaults
 * Pure JS — no React dependencies.
 */

export const SIEGE_EQUIPMENT = [
  { weapon: 'Ballista', damage: '3d10 piercing', range: '120/480 ft', crew: 1, loadTime: '1 action', fireTime: '1 action', notes: 'Large crossbow on a mount.' },
  { weapon: 'Mangonel (Catapult)', damage: '5d10 bludgeoning', range: '200/800 ft', crew: 3, loadTime: '2 actions', fireTime: '1 action', notes: 'Can\'t hit within 60ft. Lobs projectiles over walls.' },
  { weapon: 'Cannon', damage: '8d10 bludgeoning', range: '600/2,400 ft', crew: 3, loadTime: '3 actions', fireTime: '1 action', notes: 'Gunpowder required. Loud.' },
  { weapon: 'Battering Ram', damage: '3d6 bludgeoning', range: 'Contact', crew: 4, loadTime: 'None', fireTime: '1 action', notes: 'Double damage vs structures. Requires crew to carry.' },
  { weapon: 'Siege Tower', damage: 'None', range: 'Adjacent to wall', crew: 10, loadTime: 'N/A', fireTime: 'N/A', notes: 'Mobile cover to approach walls. Troops climb inside.' },
  { weapon: 'Trebuchet', damage: '8d10 bludgeoning', range: '300/1,200 ft', crew: 5, loadTime: '4 actions', fireTime: '1 action', notes: 'Massive range. Can lob diseased corpses or Greek Fire.' },
];

export const FORTIFICATION_STATS = [
  { structure: 'Wooden Door', ac: 15, hp: 18, immunities: 'Poison, Psychic', notes: 'Easily broken or burned.' },
  { structure: 'Iron Door', ac: 19, hp: 27, immunities: 'Poison, Psychic', notes: 'Much harder to break. Immune to fire.' },
  { structure: 'Stone Wall (1ft thick)', ac: 17, hp: 27, immunities: 'Poison, Psychic', notes: 'Per 1ft section.' },
  { structure: 'Castle Wall (5ft thick)', ac: 17, hp: 135, immunities: 'Poison, Psychic', notes: 'Siege weapons needed.' },
  { structure: 'Tower', ac: 17, hp: 200, immunities: 'Poison, Psychic', notes: 'Multiple floors. Arrow slits for defenders.' },
  { structure: 'Gate (Reinforced)', ac: 18, hp: 100, immunities: 'Poison, Psychic', notes: 'Portcullis adds more HP.' },
];

export const CASTLE_ASSAULT_TACTICS = [
  'Fly over the walls: Fly spell, griffons, or levitate bypass most defenses.',
  'Passwall (5th): Create a passage through stone walls.',
  'Dimension Door / Teleportation Circle: Bypass walls entirely.',
  'Stone Shape (4th): Create holes in stone walls. Slow but quiet.',
  'Earthquake (8th): Collapse fortifications. Devastating to structures.',
  'Animate Objects (5th): Turn siege equipment against defenders.',
  'Fog Cloud: Provide cover for approaching troops.',
  'Charm / Dominate: Control guards to open the gate.',
  'Classic approach: battering ram on the gate while archers provide cover.',
];

export function getSiegeWeapon(name) {
  return SIEGE_EQUIPMENT.find(w => w.weapon.toLowerCase().includes((name || '').toLowerCase())) || null;
}

export function getStructureStats(structure) {
  return FORTIFICATION_STATS.find(f => f.structure.toLowerCase().includes((structure || '').toLowerCase())) || null;
}
