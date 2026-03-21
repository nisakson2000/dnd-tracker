/**
 * playerGiantSlaying.js
 * Player Mode: Fighting giants — tactics, weaknesses, and preparation
 * Pure JS — no React dependencies.
 */

export const GIANT_TYPES = [
  { type: 'Hill Giant', cr: 5, ac: 13, hp: 105, str: 21, weakness: 'Low INT/WIS/CHA. Dumb and greedy.', tactics: 'Kite with ranged. They throw rocks (60/240ft) but low AC.' },
  { type: 'Stone Giant', cr: 7, ac: 17, hp: 126, str: 23, weakness: 'Rock Catching makes ranged harder. Melee is better.', tactics: 'Close to melee. They\'re less dangerous up close than at range (rock catching).' },
  { type: 'Frost Giant', cr: 8, ac: 15, hp: 138, str: 23, weakness: 'Cold immunity but no fire resistance. Use fire.', tactics: 'Fire spells. Stay mobile — they have 40ft speed.' },
  { type: 'Fire Giant', cr: 9, ac: 18, hp: 162, str: 25, weakness: 'Fire immunity but no cold resistance. Use cold.', tactics: 'Cold spells. Heavy armor = high AC. Use save-based attacks.' },
  { type: 'Cloud Giant', cr: 9, ac: 14, hp: 200, str: 27, weakness: 'Innate spellcasting. Can Misty Step and Fog Cloud.', tactics: 'Counterspell their spells. Burst damage before they escape.' },
  { type: 'Storm Giant', cr: 13, ac: 16, hp: 230, str: 29, weakness: 'Lightning immunity. Amphibious. Can cast Control Weather.', tactics: 'Don\'t fight in water. Legendary Resistance (see below). Focus fire.' },
];

export const ANTI_GIANT_TOOLKIT = [
  { tool: 'Heat Metal', note: 'Fire/Frost giants often wear metal armor. Auto-damage, no save to end.' },
  { tool: 'Hold Monster', note: 'Paralyze = auto-crit from within 5ft. Giants have mediocre WIS saves.' },
  { tool: 'Web + fire', note: 'Restrain giants (STR check, not save). Light the web for 2d4 fire.' },
  { tool: 'Fly spell', note: 'Stay airborne. Most giants can\'t fly. Rock throws are their only ranged option.' },
  { tool: 'Enlarge/Reduce', note: 'Reduce the giant: -1 size, disadvantage on STR checks, -1d4 damage.' },
  { tool: 'Polymorph', note: 'Turn giant into turtle/slug. WIS save. Giants have low WIS.' },
  { tool: 'Giant Slayer weapon', note: '+1 weapon, +1d6 vs giants, knocks them prone on hit (STR save).' },
];

export const GIANT_TACTICS = [
  'Giants throw rocks at 60/240ft range. Close distance fast or use cover.',
  'Most giants have multiattack (2 hits). Each hit deals 20-30 damage. Don\'t let squishies get hit.',
  'Giants are huge — difficult terrain and tight spaces limit them. Fight in corridors.',
  'WIS saves are most giants\' worst save. Use WIS-save spells.',
  'Prone giants lose half movement standing up. Shove/trip them to waste their action economy.',
  'Giants\' STR is 21-29. Don\'t try to grapple them unless you have Enlarge or Rune Knight.',
];

export function giantRockDamage(giantType) {
  const dmg = { Hill: 21, Stone: 28, Frost: 28, Fire: 29, Cloud: 30, Storm: 35 };
  return dmg[giantType] || 25;
}

export function giantWisSave(giantType) {
  const saves = { Hill: -1, Stone: 0, Frost: -1, Fire: 1, Cloud: 3, Storm: 5 };
  return saves[giantType] ?? 0;
}
