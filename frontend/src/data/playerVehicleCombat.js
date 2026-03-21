/**
 * playerVehicleCombat.js
 * Player Mode: Vehicle and ship combat rules
 * Pure JS — no React dependencies.
 */

export const VEHICLE_ROLES = [
  { role: 'Captain', action: 'Use an action to steer the vehicle. Choose direction and speed.', skill: 'Vehicles (water/land) proficiency' },
  { role: 'First Mate', action: 'Use Help action to assist the captain or a crew member.', skill: 'Any' },
  { role: 'Helmsman', action: 'Steer the vehicle. Maintain course and avoid obstacles.', skill: 'Vehicles proficiency, DEX' },
  { role: 'Gunner', action: 'Fire a ship weapon (ballista, cannon, etc.). Uses your action.', skill: 'DEX-based attack roll' },
  { role: 'Bosun', action: 'Repair the ship during combat. Action to restore HP to a component.', skill: 'Carpenter\'s tools, STR' },
  { role: 'Lookout', action: 'Use Perception to spot threats, navigation hazards, or land.', skill: 'WIS (Perception)' },
];

export const SHIP_WEAPONS = [
  { weapon: 'Ballista', damage: '3d10 piercing', range: '120/480 ft', crew: 1, notes: 'Requires action to load, action to fire.' },
  { weapon: 'Mangonel', damage: '5d10 bludgeoning', range: '200/800 ft (can\'t hit within 60ft)', crew: 3, notes: '2 actions to load, 1 to fire.' },
  { weapon: 'Cannon', damage: '8d10 bludgeoning', range: '600/2,400 ft', crew: 3, notes: '3 actions to load, 1 to fire.' },
  { weapon: 'Ram', damage: '2d6 per 10ft speed', range: 'Contact', crew: 0, notes: 'Automatic on collision. Vehicle also takes half damage.' },
];

export const COMMON_VEHICLES = [
  { name: 'Rowboat', hp: 50, ac: 11, speed: '1.5 mph', crew: 2, cargo: '0.25 tons', cost: '50 gp' },
  { name: 'Keelboat', hp: 100, ac: 15, speed: '1 mph', crew: 3, cargo: '0.5 tons', cost: '3,000 gp' },
  { name: 'Sailing Ship', hp: 300, ac: 15, speed: '2 mph', crew: 20, cargo: '100 tons', cost: '10,000 gp' },
  { name: 'Galley', hp: 500, ac: 15, speed: '4 mph', crew: 80, cargo: '150 tons', cost: '30,000 gp' },
  { name: 'Warship', hp: 500, ac: 15, speed: '2.5 mph', crew: 60, cargo: '200 tons', cost: '25,000 gp' },
  { name: 'Longship', hp: 300, ac: 15, speed: '3 mph', crew: 40, cargo: '10 tons', cost: '10,000 gp' },
  { name: 'Cart', hp: 50, ac: 13, speed: 'Horse speed', crew: 1, cargo: '0.5 tons', cost: '15 gp' },
  { name: 'Wagon', hp: 80, ac: 13, speed: 'Horse speed', crew: 1, cargo: '1.5 tons', cost: '35 gp' },
  { name: 'Chariot', hp: 50, ac: 14, speed: 'Horse speed', crew: 1, cargo: '—', cost: '250 gp' },
];

export const VEHICLE_COMBAT_RULES = [
  'Vehicles act on the initiative of their captain.',
  'Each crew member can use their action to perform a role action.',
  'Ships have component HP: hull, sails, weapons. Destroying components disables them.',
  'Ramming: move into another vehicle. Both take damage based on speed.',
  'Boarding: move adjacent, crew can cross to enemy ship. Treat as difficult terrain.',
  'Sinking: at 0 HP, ship begins to sink. Sinks in 10 minutes (or 1d10 rounds in combat).',
];

export function getVehicleInfo(name) {
  return COMMON_VEHICLES.find(v => v.name.toLowerCase() === (name || '').toLowerCase()) || null;
}

export function getWeaponInfo(weapon) {
  return SHIP_WEAPONS.find(w => w.weapon.toLowerCase() === (weapon || '').toLowerCase()) || null;
}
