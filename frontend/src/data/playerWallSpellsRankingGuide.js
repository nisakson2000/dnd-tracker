/**
 * playerWallSpellsRankingGuide.js
 * Player Mode: Wall spells ranked — battlefield control
 * Pure JS — no React dependencies.
 */

export const WALL_SPELLS_RANKED = [
  {
    spell: 'Wall of Force',
    level: 5,
    classes: ['Wizard'],
    shape: '10 panels (10ft×10ft) or dome/sphere up to 10ft radius',
    duration: '10 min (concentration)',
    rating: 'S+',
    note: 'Indestructible. Nothing passes through. Only Disintegrate or Dispel removes it. Splits encounters.',
  },
  {
    spell: 'Wall of Fire',
    level: 4,
    classes: ['Wizard', 'Druid', 'Sorcerer'],
    shape: '60ft long, 20ft high, 1ft thick (or 20ft ring)',
    damage: '5d8 fire (entering/starting within 10ft of fire side)',
    rating: 'S',
    note: 'Massive damage zone. Push enemies through = 5d8 each pass. Ring traps creatures.',
  },
  {
    spell: 'Wall of Stone',
    level: 5,
    classes: ['Wizard', 'Druid', 'Sorcerer', 'Artificer'],
    shape: '10 panels (10ft×10ft×6in). Each: AC 15, 15HP/inch.',
    duration: '10 min (becomes permanent if maintained)',
    rating: 'A',
    note: 'Permanent structures. Build bridges, barricades, tombs.',
  },
  {
    spell: 'Wall of Thorns',
    level: 6,
    classes: ['Druid'],
    shape: '60ft long, 10ft high, 5ft thick',
    damage: '7d8 piercing (entering or starting turn in wall)',
    rating: 'A',
    note: 'Druid-exclusive. Very painful to cross. L6 slot is expensive.',
  },
  {
    spell: 'Wall of Ice',
    level: 6,
    classes: ['Wizard'],
    damage: '10d6 cold initial (DEX half). Panels: 30 HP, fire vulnerable.',
    rating: 'B+',
    note: 'Good initial damage. Panels are fragile.',
  },
  {
    spell: 'Wind Wall',
    level: 3,
    classes: ['Druid', 'Ranger'],
    damage: '3d8 bludgeoning.',
    rating: 'B',
    note: 'Blocks projectiles, gases, fog, flying Small+ creatures. Counters archers.',
  },
];

export const WALL_TACTICS = [
  { tactic: 'Wall of Force dome', detail: 'Dome over half the enemies. Fight the rest first.', rating: 'S' },
  { tactic: 'Wall of Fire + push', detail: 'Push enemies through with EB/Thunderwave. 5d8 each pass.', rating: 'S' },
  { tactic: 'Wall of Fire ring', detail: 'Ring traps enemies. 5d8 to leave.', rating: 'S' },
  { tactic: 'Wall of Stone permanent', detail: 'Concentrate 10 min = permanent stone. Build structures.', rating: 'A' },
  { tactic: 'Split melee from casters', detail: 'Wall between groups. Fight one group at a time.', rating: 'A' },
];

export const WALL_OF_FORCE_COUNTERS = [
  { counter: 'Disintegrate', note: 'Auto-destroys Wall of Force.' },
  { counter: 'Dispel Magic', note: 'DC 15 check.' },
  { counter: 'Teleportation', note: 'Misty Step, Dimension Door pass through.' },
  { counter: 'Etherealness', note: 'Move through on Ethereal Plane.' },
];
