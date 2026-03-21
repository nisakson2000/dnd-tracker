/**
 * playerHorizonWalkerRangerGuide.js
 * Player Mode: Horizon Walker Ranger — the planar warrior
 * Pure JS — no React dependencies.
 */

export const HORIZON_WALKER_BASICS = {
  class: 'Ranger (Horizon Walker)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Planar guardian. Force damage bonus. Teleportation. Ethereal Step.',
  note: 'Strong combat Ranger. Planar Warrior adds force damage (best type). Ethereal Step is incredible utility. Distant Strike teleports on every attack at L11.',
};

export const HORIZON_WALKER_FEATURES = [
  { feature: 'Detect Portal', level: 3, effect: 'Action: detect distance and direction to nearest planar portal within 1 mile. 1/SR.', note: 'Situational but can be campaign-defining in planar adventures. Ribbon feature otherwise.' },
  { feature: 'Planar Warrior', level: 3, effect: 'Bonus action: choose one creature you can see within 30ft. Next time you hit it this turn: all damage becomes force, +1d8 force damage.', note: 'Force damage ignores almost all resistances. +1d8 per turn (scales to 2d8 at L11). Reliable damage boost.' },
  { feature: 'Ethereal Step', level: 7, effect: 'Bonus action: step into the Ethereal Plane until end of your turn. 1/SR.', note: 'Phase through walls, avoid all attacks for a turn, scout ahead. Incredibly versatile. Once per short rest.' },
  { feature: 'Distant Strike', level: 11, effect: 'When you take Attack action: before each attack, teleport 10ft. If you attack 2 different creatures, gain a third attack.', note: 'Teleport 10ft before EACH attack. Attack 2 targets → bonus 3rd attack. Incredible mobility + damage. No concentration.' },
  { feature: 'Spectral Defense', level: 15, effect: 'Reaction when you take damage: resistance to all of that attack\'s damage.', note: 'Halve any damage as a reaction. No limit on uses. Just costs your reaction. Excellent survivability.' },
];

export const HORIZON_WALKER_TACTICS = [
  { tactic: 'Planar Warrior + Hunter\'s Mark', detail: 'BA: Planar Warrior (1d8 force). If HM already up, switch BA usage per turn. At L11: Planar Warrior scales to 2d8, may drop HM.', rating: 'A' },
  { tactic: 'Distant Strike teleport blitz', detail: 'L11: teleport 10ft → attack → teleport 10ft → attack different target → bonus 3rd attack. 30ft of teleportation + 3 attacks.', rating: 'S' },
  { tactic: 'Ethereal Step scouting', detail: 'Go ethereal → walk through walls → scout ahead → reappear. See the layout without risk. 1/SR.', rating: 'S' },
  { tactic: 'Force damage vs resistances', detail: 'Planar Warrior converts all damage to force. Almost nothing resists force. Bypasses physical resistance without magic weapons.', rating: 'A' },
  { tactic: 'Spectral Defense tanking', detail: 'L15: take a big hit → reaction → halve the damage. Every round. No resource cost. Makes you surprisingly tanky.', rating: 'A' },
  { tactic: 'Distant Strike + Sharpshooter', detail: 'Teleport 10ft (avoid melee) → Sharpshooter shot → teleport → Sharpshooter shot → bonus 3rd shot if 2 targets. Massive ranged burst.', rating: 'S' },
];

export function planarWarriorDamage(rangerLevel) {
  return rangerLevel >= 11 ? 9 : 4.5; // 2d8 avg at 11, 1d8 avg before
}

export function distantStrikeTeleportTotal(numberOfAttacks) {
  return numberOfAttacks * 10; // 10ft per attack
}

export function spectralDefenseReduction(incomingDamage) {
  return Math.floor(incomingDamage / 2);
}
