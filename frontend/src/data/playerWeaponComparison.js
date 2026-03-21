/**
 * playerWeaponComparison.js
 * Player Mode: Weapon comparison and selection guide
 * Pure JS — no React dependencies.
 */

export const MELEE_WEAPONS = [
  { weapon: 'Greatsword', damage: '2d6', type: 'Slashing', properties: 'Heavy, two-handed', avgDmg: 7, note: 'Best average damage. Great Weapon Fighting style adds ~1.3 avg.' },
  { weapon: 'Greataxe', damage: '1d12', type: 'Slashing', properties: 'Heavy, two-handed', avgDmg: 6.5, note: 'Better for Half-Orc/Barbarian crits (Savage Attacks, Brutal Critical add full dice).' },
  { weapon: 'Maul', damage: '2d6', type: 'Bludgeoning', properties: 'Heavy, two-handed', avgDmg: 7, note: 'Same as greatsword but bludgeoning. Works with Crusher feat.' },
  { weapon: 'Glaive/Halberd', damage: '1d10', type: 'Slashing', properties: 'Heavy, reach, two-handed', avgDmg: 5.5, note: 'Reach (10ft). PAM compatible. Best with PAM+Sentinel combo.' },
  { weapon: 'Pike', damage: '1d10', type: 'Piercing', properties: 'Heavy, reach, two-handed', avgDmg: 5.5, note: 'Same as glaive but piercing. PAM compatible.' },
  { weapon: 'Longsword', damage: '1d8/1d10', type: 'Slashing', properties: 'Versatile', avgDmg: 4.5, note: 'One-handed (d8) or two-handed (d10). Dueling FS makes d8+2 = 6.5 avg.' },
  { weapon: 'Rapier', damage: '1d8', type: 'Piercing', properties: 'Finesse', avgDmg: 4.5, note: 'Best finesse weapon. DEX builds default.' },
  { weapon: 'Scimitar', damage: '1d6', type: 'Slashing', properties: 'Finesse, light', avgDmg: 3.5, note: 'Two-Weapon Fighting. Light allows dual wielding.' },
  { weapon: 'Shortsword', damage: '1d6', type: 'Piercing', properties: 'Finesse, light', avgDmg: 3.5, note: 'Same as scimitar but piercing. Monk weapon.' },
  { weapon: 'Quarterstaff', damage: '1d6/1d8', type: 'Bludgeoning', properties: 'Versatile', avgDmg: 3.5, note: 'PAM compatible (bonus d4 attack). Monk weapon. Shillelagh target.' },
  { weapon: 'Spear', damage: '1d6/1d8', type: 'Piercing', properties: 'Thrown (20/60), versatile', avgDmg: 3.5, note: 'PAM compatible. Can be thrown. Cheap and versatile.' },
  { weapon: 'Handaxe', damage: '1d6', type: 'Slashing', properties: 'Light, thrown (20/60)', avgDmg: 3.5, note: 'Light for TWF. Throwable. Cheap.' },
  { weapon: 'Whip', damage: '1d4', type: 'Slashing', properties: 'Finesse, reach', avgDmg: 2.5, note: 'Only finesse reach weapon. Low damage but unique niche.' },
  { weapon: 'Lance', damage: '1d12', type: 'Piercing', properties: 'Reach, special', avgDmg: 6.5, note: 'Disadvantage within 5ft. One-handed while mounted. Best mounted weapon.' },
];

export const WEAPON_STYLE_COMPARISON = {
  twoHanded: { avgDmg: '7 + STR + GWF', ac: 'No shield', feat: 'GWM (+10 per hit)', note: 'Highest damage. No shield = lower AC.' },
  swordAndBoard: { avgDmg: '6.5 + STR (Dueling)', ac: '+2 shield', feat: 'Shield Master, Sentinel', note: 'Best defense. Dueling closes damage gap.' },
  twoWeaponFighting: { avgDmg: '3.5+3.5 + STR×2 (with FS)', ac: 'No shield', feat: 'Dual Wielder (+1 AC, d8 weapons)', note: 'More attacks but lower damage per hit. Competes for bonus action.' },
  reach: { avgDmg: '5.5 + STR', ac: 'No shield', feat: 'PAM + Sentinel', note: 'Control zone. PAM adds bonus attack. 10ft reach = safety.' },
  ranged: { avgDmg: '4.5 + DEX (hand xbow)', ac: 'No shield', feat: 'CBE + SS', note: 'Stay at range. 3 attacks with CBE. SS +10 per hit.' },
};

export const MAGIC_WEAPON_IMPACT = {
  plusOne: { hitBonus: '+5% chance to hit', damageBonus: '+1 per hit', value: 'Uncommon. Solid improvement.' },
  plusTwo: { hitBonus: '+10% chance to hit', damageBonus: '+2 per hit', value: 'Rare. Significant. Makes SS/GWM -5 easier to absorb.' },
  plusThree: { hitBonus: '+15% chance to hit', damageBonus: '+3 per hit', value: 'Very Rare. Game-changing. +3 to hit means you rarely miss.' },
};

export function weaponDPR(dieAvg, mod, attacks, hitChance) {
  return attacks * hitChance * (dieAvg + mod);
}

export function gwmDPR(dieAvg, mod, attacks, baseHitChance) {
  const gwmHitChance = Math.max(0.05, baseHitChance - 0.25);
  return attacks * gwmHitChance * (dieAvg + mod + 10);
}

export function duelingBonus() {
  return 2; // Dueling fighting style adds +2 damage with one-handed weapon
}
