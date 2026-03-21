/**
 * playerSiegeCombat.js
 * Player Mode: Siege warfare, castle assault/defense, fortification combat
 * Pure JS — no React dependencies.
 */

export const SIEGE_EQUIPMENT = [
  { name: 'Ballista', damage: '3d10 piercing', range: '120/480', crew: 3, note: 'Large crossbow. 1 action to load, 1 to aim, 1 to fire.' },
  { name: 'Cannon', damage: '8d10 bludgeoning', range: '600/2400', crew: 3, note: 'Smokepowder. Rare in most settings.' },
  { name: 'Mangonel (catapult)', damage: '5d10 bludgeoning', range: '200/800 (indirect)', crew: 5, note: 'Lobs projectiles over walls. Can fire barrels of alchemist\'s fire.' },
  { name: 'Trebuchet', damage: '8d10 bludgeoning', range: '300/1200 (indirect)', crew: 5, note: 'Largest siege weapon. Destroys walls. Takes 2 actions to load.' },
  { name: 'Battering Ram', damage: '4d10 bludgeoning', range: 'Touch', crew: 4, note: 'Double damage to objects/structures. Requires multiple operators.' },
  { name: 'Siege Tower', damage: 'N/A', range: 'N/A', crew: 'Many', note: 'Mobile cover. Troops climb inside to reach wall tops safely.' },
];

export const CASTLE_DEFENSE = [
  'Arrow slits: 3/4 cover (+5 AC) for defenders, half cover at best for attackers.',
  'Murder holes: pour boiling oil (2d6 fire, 10ft area) or rocks on attackers at gates.',
  'Crenellations: half cover (+2 AC) for defenders on walls.',
  'Portcullis: AC 19, 27 HP (iron), immune to poison/psychic. STR DC 25 to lift.',
  'Drawbridge: prevents direct approach. Must be lowered or destroyed.',
  'Moat: difficult terrain. Some filled with hazards. Negates siege towers.',
];

export const MAGIC_IN_SIEGE = {
  offense: [
    { spell: 'Disintegrate', note: 'Automatically destroys 10ft cube of nonmagical wall/stone.' },
    { spell: 'Passwall', note: 'Create a passage through 20ft of stone. No save, no check.' },
    { spell: 'Move Earth', note: 'Reshape terrain. Fill moats, create ramps, undermine walls.' },
    { spell: 'Earthquake', note: 'Collapse structures. 50ft fissures. Concentration 1 min.' },
    { spell: 'Animate Objects', note: 'Animate 10 siege stones. Tiny objects: +8 to hit, 1d4+4 damage each.' },
    { spell: 'Catapult', note: 'Launch objects. 3d8 bludgeoning. Scale with slot level.' },
  ],
  defense: [
    { spell: 'Wall of Force', note: 'Indestructible 10-panel wall. Blocks all passage for 10 minutes.' },
    { spell: 'Wall of Stone', note: 'Permanent if concentrated 10 minutes. Rebuild walls instantly.' },
    { spell: 'Guards and Wards', note: 'Protect entire building with fog, webs, locks, suggestions, illusions.' },
    { spell: 'Forbiddance', note: 'Prevent teleportation and planar travel. 5d10 damage to chosen types.' },
    { spell: 'Glyph of Warding', note: 'Explosive runes (5d8) on doors, gates, stairs. Trap the fortress.' },
  ],
};

export const PLAYER_SIEGE_ROLES = [
  { role: 'Siege Engineer', classes: 'Artificer, Fighter', tasks: 'Operate siege weapons, build fortifications, breach walls.' },
  { role: 'Wall Breacher', classes: 'Wizard, Sorcerer', tasks: 'Disintegrate walls, Passwall, Fireball archers.' },
  { role: 'Infiltrator', classes: 'Rogue, Ranger, Monk', tasks: 'Sneak in, open gates, assassinate commanders, scout.' },
  { role: 'Healer/Buffer', classes: 'Cleric, Bard, Druid', tasks: 'Mass healing, Spirit Guardians on walls, Bless the troops.' },
  { role: 'Air Support', classes: 'Druid (Wild Shape), any with Fly', tasks: 'Drop spells from above, bypass walls, aerial recon.' },
];

export function wallHP(material) {
  const hp = { wood: 15, brick: 30, stone: 45, iron: 60, adamantine: 120 };
  return hp[material] || 30;
}

export function siegeRounds(weaponDamageAvg, wallHitPoints) {
  return Math.ceil(wallHitPoints / weaponDamageAvg);
}
