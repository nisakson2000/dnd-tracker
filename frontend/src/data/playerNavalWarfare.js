/**
 * playerNavalWarfare.js
 * Player Mode: Ship combat, vehicle rules, and siege weapon operation
 * Pure JS — no React dependencies.
 */

export const VEHICLE_BASICS = {
  damageThreshold: 'Vehicle ignores damage below threshold (e.g., 15 = hits under 15 do nothing).',
  crew: 'Below minimum crew, vehicle can\'t move or act.',
  components: 'Hull, sails, helm, weapons — each has separate HP.',
};

export const SHIP_TYPES = [
  { ship: 'Rowboat', speed: '1.5 mph', hp: 50, ac: 11, crew: 1, cost: '50 gp' },
  { ship: 'Keelboat', speed: '1 mph', hp: 100, ac: 15, crew: 3, cost: '3,000 gp' },
  { ship: 'Sailing Ship', speed: '2 mph', hp: 300, ac: 15, crew: 20, cost: '10,000 gp' },
  { ship: 'Galley', speed: '4 mph', hp: 500, ac: 15, crew: 80, cost: '30,000 gp' },
  { ship: 'Warship', speed: '2.5 mph', hp: 500, ac: 15, crew: 60, cost: '25,000 gp' },
];

export const SIEGE_WEAPONS = [
  { weapon: 'Ballista', damage: '3d10 (16.5)', range: '120/480', crew: 3 },
  { weapon: 'Mangonel', damage: '5d10 (27.5)', range: '200/800', crew: 5 },
  { weapon: 'Cannon', damage: '8d10 (44)', range: '600/2400', crew: 3 },
  { weapon: 'Trebuchet', damage: '8d10 (44)', range: '300/1200', crew: 5 },
];

export const PLAYER_SHIP_ROLES = [
  { role: 'Captain', action: 'Orders → advantage on crew checks.', best: 'CHA character' },
  { role: 'Helmsman', action: 'Steer. Vehicles proficiency.', best: 'Vehicle proficient' },
  { role: 'Gunner', action: 'Operate siege weapons with your stats.', best: 'High DEX/STR' },
  { role: 'Lookout', action: 'Perception for threats.', best: 'High WIS' },
  { role: 'Spell Support', action: 'Control Water, Wind Wall, etc.', best: 'Druid/Wizard' },
];

export const NAVAL_RULES = [
  'Ships roll initiative. Crew acts on ship\'s turn.',
  'Ramming deals damage to both ships.',
  'Adjacent ships allow boarding. Grappling hooks help.',
  'Hull at 0 HP → 10 rounds to abandon before sinking.',
  'Wooden ships catch fire: 2d6/round until extinguished.',
];

export function turnsToSink(hp, dpr, threshold) {
  const eff = Math.max(0, dpr - threshold);
  return eff > 0 ? Math.ceil(hp / eff) : Infinity;
}
