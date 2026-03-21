/**
 * playerTacticalPlacementGuide.js
 * Player Mode: Tactical positioning — where to stand and why
 * Pure JS — no React dependencies.
 */

export const POSITIONING_PRINCIPLES = [
  { principle: 'Casters Behind Martials', why: 'd6/d8 casters die fast in melee.', rule: 'Stay 30-60ft behind front line.' },
  { principle: 'Spread Out vs AoE', why: 'Fireball hits clustered groups.', rule: '15+ ft from allies.' },
  { principle: 'Use Cover', why: 'Half cover: +2 AC/DEX. Three-quarters: +5.', rule: 'Pillars, walls, corners.' },
  { principle: 'Control Chokepoints', why: 'One defender blocks many.', rule: 'PAM/Sentinel in doorways.' },
  { principle: 'Elevation', why: 'Better line of sight. Enemies must climb.', rule: 'High ground for ranged.' },
];

export const CLASS_POSITIONS = [
  { class: 'Fighter/Barbarian', position: 'Front line. 0-10ft from enemies.' },
  { class: 'Paladin', position: 'Central. Within 10ft of allies for Aura.' },
  { class: 'Cleric (Spirit Guardians)', position: 'Near enemies. 0-15ft for damage.' },
  { class: 'Rogue', position: '5ft of ally (SA) or 30-120ft (ranged + Hide).' },
  { class: 'Wizard/Sorcerer', position: 'Behind everyone. 60-120ft range.' },
  { class: 'Warlock', position: 'Behind front line. EB 120ft range.' },
  { class: 'Ranger', position: 'Mid-range or elevated. Longbow 150ft.' },
  { class: 'Monk', position: 'Mobile. Hit and run. High speed + Disengage.' },
  { class: 'Bard', position: 'Mid-range. 30-60ft. Near allies for Inspiration.' },
];

export const TERRAIN_USE = [
  { terrain: 'Doorways', tactic: 'Bottleneck. One defender blocks all.', best: 'PAM/Sentinel Fighter.' },
  { terrain: 'Pillars/Walls', tactic: 'Cover: +2/+5 AC. Peek and shoot.', best: 'Ranged characters.' },
  { terrain: 'Elevated Platforms', tactic: 'Height advantage. Enemies must climb.', best: 'Ranged and casters.' },
  { terrain: 'Bridges', tactic: 'Narrow. Push enemies off.', best: 'Repelling Blast, Shove.' },
  { terrain: 'Open Field', tactic: 'Spread out. Use range. Mobility.', best: 'Mounted. Ranged builds.' },
];

export const PLACEMENT_TIPS = [
  'Casters behind martials. Low HP = avoid melee.',
  'Spread out vs AoE. Don\'t cluster.',
  'Half cover: +2 AC free. Use walls/pillars.',
  'Paladin: stay central for Aura coverage.',
  'Chokepoints: one defender blocks many.',
  'Spirit Guardians: wade into enemies.',
  'Rogue: adjacent to ally for Sneak Attack.',
  'Get high ground for ranged attacks.',
  'Don\'t block ally line of sight.',
  'Wall spells reshape the battlefield.',
];
