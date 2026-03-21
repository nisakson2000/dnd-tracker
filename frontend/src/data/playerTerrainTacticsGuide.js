/**
 * playerTerrainTacticsGuide.js
 * Player Mode: Terrain types, difficult terrain, and tactical positioning
 * Pure JS — no React dependencies.
 */

export const DIFFICULT_TERRAIN_RULES = {
  effect: 'Every foot of movement costs 2 feet. 30ft speed = 15ft actual movement in difficult terrain.',
  sources: ['Rubble', 'Thick vegetation', 'Stairs', 'Snow', 'Shallow water', 'Webs', 'Spell effects (Entangle, Spike Growth, Web)'],
  stacking: 'Multiple difficult terrain sources do NOT stack. It\'s always 2:1 cost regardless of sources.',
  crawling: 'Crawling costs 2:1. Crawling through difficult terrain = 3:1.',
  note: 'Difficult terrain is crucial for melee characters. If you can\'t reach enemies, you can\'t fight. Control casters create difficult terrain to lockdown.',
};

export const TERRAIN_SPELLS = [
  { spell: 'Entangle', level: 1, area: '20ft square', effect: 'Difficult terrain + STR save or restrained.', class: 'Druid/Ranger', rating: 'A', note: 'L1 area denial + restrain. Great early. No friendly fire option.' },
  { spell: 'Web', level: 2, area: '20ft cube', effect: 'Difficult terrain + DEX save or restrained. Flammable (2d4 fire).', class: 'Sorcerer/Wizard', rating: 'S', note: 'Best L2 control spell. Restrain + difficult terrain. Set on fire for bonus damage.' },
  { spell: 'Spike Growth', level: 2, area: '20ft radius', effect: 'Difficult terrain + 2d4 piercing per 5ft moved through. Camouflaged.', class: 'Druid/Ranger', rating: 'S', note: 'Damage on movement. Push/pull enemies through it for massive damage. Repelling Blast combo.' },
  { spell: 'Plant Growth', level: 3, area: '100ft radius', effect: '4:1 movement cost (not just 2:1). No save. Not concentration.', class: 'Druid/Ranger/Bard', rating: 'S', note: 'NO CONCENTRATION. 100ft radius. 4:1 movement = 30ft speed becomes 7.5ft. Shuts down melee enemies.' },
  { spell: 'Sleet Storm', level: 3, area: '40ft radius', effect: 'Difficult terrain + heavily obscured + DEX save or prone + concentration checks.', class: 'Druid/Sorcerer/Wizard', rating: 'S', note: 'Does everything. Blind, slow, prone, break concentration. Top-tier control.' },
  { spell: 'Wall of Thorns', level: 6, area: '60×10×5 or ring', effect: 'Difficult terrain + 7d8 piercing to enter/start turn. DEX save half.', class: 'Druid', rating: 'A', note: 'High damage wall + difficult terrain. Keeps enemies away.' },
  { spell: 'Bones of the Earth', level: 6, area: '6 pillars', effect: 'Create 5ft diameter pillars (30ft tall). DEX save or knocked prone + take damage.', class: 'Druid', rating: 'A', note: 'Reshape terrain with stone pillars. Trap creatures between them.' },
];

export const TERRAIN_COMBO_TACTICS = [
  { combo: 'Spike Growth + Repelling Blast', detail: 'Warlock/Druid: Spike Growth on ground. EB pushes enemies through it. 2d4 per 5ft × 4 beams × 10ft push = 16d4.', rating: 'S' },
  { combo: 'Spike Growth + Thorn Whip', detail: 'Pull enemy 10ft through Spike Growth. 4d4 (10 avg) + cantrip damage. Every turn.', rating: 'S' },
  { combo: 'Web + Fire Bolt', detail: 'Web restrains in area. Fire Bolt ignites it: 2d4 fire damage to creatures in web. Web destroyed.', rating: 'A' },
  { combo: 'Plant Growth + ranged attacks', detail: 'Plant Growth (100ft, no concentration). Enemies can barely move. Your ranged characters destroy them.', rating: 'S' },
  { combo: 'Sleet Storm + ranged', detail: 'Sleet Storm: enemies blinded, prone, can\'t concentrate. Your ranged attacks from outside the area.', rating: 'S' },
  { combo: 'Spike Growth + grapple drag', detail: 'Grapple enemy → drag through Spike Growth at half speed. 2d4 per 5ft. Drag 15ft = 6d4.', rating: 'A' },
];

export const POSITIONING_TIPS = [
  { tip: 'Chokepoints', detail: 'Funnel enemies through narrow passages. One tank + Spirit Guardians in a doorway = army-killer.', rating: 'S' },
  { tip: 'High ground', detail: 'Elevated positions provide cover against melee. Ranged attackers on high ground are difficult to reach.', rating: 'A' },
  { tip: 'Flanking awareness', detail: 'If using flanking rules: position 2 melee on opposite sides. If not: still surround to prevent escape.', rating: 'A' },
  { tip: 'Caster positioning', detail: 'Casters stay 60ft+ back. Most cantrips have 120ft range. Let martials be the front line.', rating: 'S' },
  { tip: 'Escape routes', detail: 'Always have a path out. Don\'t get surrounded. Keep Misty Step or Dimension Door ready.', rating: 'A' },
];

export function movementInDifficultTerrain(baseSpeed) {
  return Math.floor(baseSpeed / 2);
}

export function movementInPlantGrowth(baseSpeed) {
  return Math.floor(baseSpeed / 4);
}

export function spikeGrowthDamage(distanceMoved) {
  const fiveFtIncrements = Math.floor(distanceMoved / 5);
  return fiveFtIncrements * 7; // 2d4 avg = 5, but each 5ft = 2d4
}
