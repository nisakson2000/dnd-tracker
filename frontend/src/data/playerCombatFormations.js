/**
 * playerCombatFormations.js
 * Player Mode: Party formation suggestions and positioning tips
 * Pure JS — no React dependencies.
 */

export const FORMATIONS = [
  {
    name: 'Standard Line',
    description: 'Frontline fighters in front, casters and ranged behind.',
    positions: [
      { role: 'Tank', position: 'Front center', notes: 'Draw enemy attention, use Shield or Dodge when overwhelmed' },
      { role: 'Melee DPS', position: 'Front flanks', notes: 'Flank enemies for advantage (optional rule)' },
      { role: 'Ranged/Caster', position: 'Behind frontline (30-60ft)', notes: 'Stay within range but out of melee' },
      { role: 'Healer', position: 'Behind melee, within 60ft', notes: 'Healing Word range is 60ft' },
    ],
  },
  {
    name: 'Diamond',
    description: 'Point forward, flanks covered, rear guard.',
    positions: [
      { role: 'Scout/Rogue', position: 'Point (front)', notes: 'Stealth ahead, spot traps and ambushes' },
      { role: 'Fighter 1', position: 'Left flank', notes: 'Cover left approach' },
      { role: 'Fighter 2', position: 'Right flank', notes: 'Cover right approach' },
      { role: 'Caster/Healer', position: 'Center rear', notes: 'Protected, can reach all allies' },
    ],
  },
  {
    name: 'Tight Cluster',
    description: 'Grouped for buff coverage (Spirit Guardians, Aura of Protection).',
    positions: [
      { role: 'All', position: 'Within 10-15ft of center', notes: 'Maximizes aura/buff effects' },
    ],
    warning: 'Vulnerable to AOE spells (Fireball, etc.)',
  },
  {
    name: 'Spread Out',
    description: 'Dispersed to avoid AOE effects.',
    positions: [
      { role: 'All', position: '20-30ft apart', notes: 'Can\'t all be hit by one Fireball' },
    ],
    warning: 'Harder to heal/buff. Enemies may isolate individuals.',
  },
  {
    name: 'Corridor/Chokepoint',
    description: 'One or two fighters block a narrow passage.',
    positions: [
      { role: 'Tank', position: 'Blocking the chokepoint', notes: 'Enemies can\'t get past. Use Sentinel feat for maximum control.' },
      { role: 'Polearm User', position: 'Behind tank (with reach)', notes: 'Attack over the tank\'s shoulder' },
      { role: 'Ranged', position: 'Further back in corridor', notes: 'Safe firing line' },
    ],
  },
];

export const POSITIONING_TIPS = [
  'Don\'t cluster within 20ft — Fireball hits a 20ft radius sphere.',
  'Keep healers within 60ft of frontline (Healing Word range).',
  'Polearm users: stay 10ft from enemies to use Polearm Master + Sentinel combo.',
  'Rogues: stay near an ally for Sneak Attack (ally within 5ft of target).',
  'Casters with concentration: stay behind cover if possible.',
  'Use terrain: half cover (+2 AC), three-quarters cover (+5 AC).',
  'Prone: advantage from within 5ft, disadvantage from range. Don\'t go prone against ranged enemies.',
];

export function getFormation(name) {
  return FORMATIONS.find(f => f.name.toLowerCase().includes(name.toLowerCase())) || null;
}

export function getFormationsByPartySize(size) {
  if (size <= 3) return FORMATIONS.filter(f => f.name !== 'Diamond');
  return FORMATIONS;
}
