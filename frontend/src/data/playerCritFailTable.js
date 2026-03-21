/**
 * playerCritFailTable.js
 * Player Mode: Critical failure (nat 1) optional tables and handling
 * Pure JS — no React dependencies.
 */

export const CRITICAL_FAIL_RULES = {
  raw: 'A natural 1 on an attack roll is an automatic MISS. That\'s it. No extra penalty by RAW.',
  common_homebrew: 'Many tables use fumble tables for nat 1s. These are homebrew and hurt martial characters disproportionately.',
  why_fumbles_are_bad: 'A level 20 Fighter attacks 4 times per turn. That\'s a 19% chance of a fumble EVERY TURN. Meanwhile, a caster rolling one save-or-suck spell has only a 5% chance. Fumble tables punish martials.',
  recommendation: 'If your table uses fumbles, suggest: fumble = miss + enemy gets advantage on their next attack against you. Simple and fair.',
};

export const MELEE_FUMBLE_TABLE = [
  { roll: 1, result: 'Overswing', effect: 'You swing wide. Next attack against you has advantage until your next turn.' },
  { roll: 2, result: 'Dropped Weapon', effect: 'Weapon flies 10ft in a random direction. Free object interaction to pick up (if adjacent).' },
  { roll: 3, result: 'Off Balance', effect: 'You stumble. Movement speed halved on your next turn.' },
  { roll: 4, result: 'Pulled Muscle', effect: 'Sharp pain. Disadvantage on your next attack roll.' },
  { roll: 5, result: 'Friendly Fire', effect: 'If an ally is adjacent to the target, roll damage against them instead. Otherwise, just a miss.' },
  { roll: 6, result: 'Stuck Weapon', effect: 'Weapon lodges in something. STR check DC 10 as bonus action to free it.' },
];

export const RANGED_FUMBLE_TABLE = [
  { roll: 1, result: 'Bowstring Snaps', effect: 'Bow is unusable until repaired (1 minute or Mending cantrip).' },
  { roll: 2, result: 'Arrow Goes Wild', effect: 'Arrow hits a random object in the environment. May cause complications.' },
  { roll: 3, result: 'Finger Slip', effect: 'Arrow barely leaves the bow. Lands at your feet. Wasted ammo.' },
  { roll: 4, result: 'Friendly Fire', effect: 'If allies are in the line of fire, roll attack against the closest ally.' },
  { roll: 5, result: 'Quiver Spill', effect: 'Arrows scatter. Spend an action to gather them or lose 1d4 arrows.' },
  { roll: 6, result: 'Cramped Hand', effect: 'Hand cramps. Disadvantage on ranged attacks until end of next turn.' },
];

export const SPELL_FUMBLE_TABLE = [
  { roll: 1, result: 'Wild Surge', effect: 'Roll on the Wild Magic Surge table (PHB p.104). Regardless of class.' },
  { roll: 2, result: 'Spell Fizzle', effect: 'Spell fails but slot is consumed. Visual effect but no damage/effect.' },
  { roll: 3, result: 'Feedback', effect: 'Magical backlash. Take 1d6 force damage.' },
  { roll: 4, result: 'Wrong Target', effect: 'Spell targets the nearest creature instead of the intended target.' },
  { roll: 5, result: 'Delayed Effect', effect: 'Spell goes off at the start of your NEXT turn instead. Same target/area.' },
  { roll: 6, result: 'Component Mishap', effect: 'Focus or component pouch malfunctions. Can\'t use it until next turn.' },
];

export const NAT1_ALTERNATIVES = [
  'Just a miss. No extra penalty. (Recommended)',
  'Miss + enemy can use reaction to move 5ft without provoking OA.',
  'Miss + you describe an embarrassing moment for flavor (no mechanical effect).',
  'Miss + the DM narrates something cinematic but harmless.',
  'Miss + the enemy taunts you (Intimidation vs your WIS save or disadvantage on next attack).',
];

export function rollFumble(type) {
  const table = type === 'melee' ? MELEE_FUMBLE_TABLE :
                type === 'ranged' ? RANGED_FUMBLE_TABLE :
                SPELL_FUMBLE_TABLE;
  return table[Math.floor(Math.random() * table.length)];
}

export function shouldUseFumbleTable() {
  return false; // RAW recommendation: no fumble tables
}
