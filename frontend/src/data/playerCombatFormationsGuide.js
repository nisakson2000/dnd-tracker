/**
 * playerCombatFormationsGuide.js
 * Player Mode: Party combat formations and positioning strategy
 * Pure JS — no React dependencies.
 */

export const FORMATION_BASICS = {
  principle: 'Positioning wins fights. Where you stand matters as much as what you do.',
  frontline: 'Heavy armor, high HP characters absorb attacks. Keep them between enemies and your casters.',
  backline: 'Casters and ranged attackers stay behind cover or the frontline. 60-120ft range is safe.',
  midline: 'Flexible characters (Bards, Clerics, Druids) can shift between support and frontline as needed.',
};

export const PARTY_FORMATIONS = [
  { formation: 'Standard Line', layout: 'Tank - Tank - (gap) - Caster - Caster', bestFor: 'Open terrain. Clear frontline/backline. Classic formation.', note: 'Frontline engages. Backline casts from 60ft. Simple and effective.' },
  { formation: 'V-Shape', layout: 'Tank on each side, Casters in the V behind', bestFor: 'Defending a position. Funneling enemies. Corridor fights.', note: 'Enemies must pass through both tanks. Casters protected in the V.' },
  { formation: 'Circle/Wagon', layout: 'All around, casters in center', bestFor: 'Surrounded. Fighting in open field. Ambush defense.', note: 'Everyone faces outward. Casters in the middle get 360° protection.' },
  { formation: 'Column', layout: 'Tank - Scout/Rogue - Caster - Caster - Tank', bestFor: 'Corridors. Dungeon hallways. Narrow passages.', note: 'Tank leads. Rogue checks for traps. Rear tank watches for flanking.' },
  { formation: 'Skirmish', layout: 'Spread out, 15-20ft between each character', bestFor: 'Against AoE enemies. Dragon breath. Fireball-happy casters.', note: 'Spread so AoE can\'t hit more than 1-2 characters. Sacrifice coordination for safety.' },
];

export const POSITIONING_TIPS = [
  { tip: 'Casters behind total cover', detail: 'Stand behind a wall. Step out, cast, step back. Enemies can\'t target you between turns.' },
  { tip: 'Don\'t cluster vs AoE', detail: 'If enemy has Fireball/breath weapon: spread out. 20ft radius Fireball hits a 40ft diameter. Stay apart.' },
  { tip: 'Chokepoint control', detail: 'Fight in doorways. Only 1-2 enemies can engage your tank at once. Neutralizes numerical advantage.' },
  { tip: 'High ground', detail: 'Elevation gives cover. Ranged attackers on high ground have half cover from below.' },
  { tip: 'Protect the concentrator', detail: 'Whoever is concentrating on the key spell (Hypnotic Pattern, Spirit Guardians) gets babysitting priority.' },
  { tip: 'Flank with 2 melee', detail: 'Two melee characters on opposite sides of an enemy. If using flanking rules: free advantage.' },
];

export const ROLE_POSITIONING = [
  { role: 'Tank (Fighter/Paladin/Barbarian)', position: 'Front, between enemies and party.', distance: '0-5ft from enemies', note: 'Engage enemies. Use Sentinel to lock them down. Shield the backline.' },
  { role: 'Melee DPS (Rogue/Monk)', position: 'Flanking or beside tank.', distance: '5ft from enemies, 10-15ft from tank', note: 'Get Sneak Attack angles. Mobile for repositioning. Don\'t over-extend.' },
  { role: 'Ranged DPS (Fighter/Ranger)', position: 'Behind frontline.', distance: '30-60ft from enemies', note: 'Longbow range 150ft. Stay far back. Use cover.' },
  { role: 'Caster (Wizard/Sorcerer)', position: 'Far backline, behind cover.', distance: '60-120ft from enemies', note: 'Most spells are 60-120ft range. No reason to be close. Use cover between casts.' },
  { role: 'Support (Cleric/Bard)', position: 'Middle, between tank and backline.', distance: '30-40ft from enemies', note: 'Close enough to Healing Word (60ft). Far enough to avoid melee. Can shift to frontline if needed.' },
];

export function aoeSpreadDistance(aoeRadius) {
  // Characters should be at least (2 × radius + 5) ft apart to avoid shared AoE
  return 2 * aoeRadius + 5;
}

export function chokepointEnemyLimit(corridorWidth) {
  // 5ft per creature in melee
  return Math.floor(corridorWidth / 5);
}
