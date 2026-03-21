/**
 * playerWallSpellRankingGuide.js
 * Player Mode: All Wall spells compared — uses, damage, and tactical value
 * Pure JS — no React dependencies.
 */

export const WALL_SPELLS_RANKED = [
  { spell: 'Wall of Force', level: 5, rating: 'S+', effect: 'Nothing passes. No save. Only Disintegrate breaks.', note: 'Best wall. Splits encounters.' },
  { spell: 'Wall of Fire', level: 4, rating: 'S', effect: '5d8 fire on one side. Area denial.', note: 'Push enemies through for 5d8 each pass.' },
  { spell: 'Wall of Stone', level: 5, rating: 'A+', effect: '30 HP panels. Can become permanent.', note: 'Permanent fortifications.' },
  { spell: 'Wall of Ice', level: 6, rating: 'A+', effect: '10d6 cold on creation + wall + cold zone.', note: 'Damage + barrier.' },
  { spell: 'Blade Barrier', level: 6, rating: 'A', effect: '6d10 slashing. 3/4 cover.', note: 'Highest damage wall.' },
  { spell: 'Wind Wall', level: 3, rating: 'A', effect: 'Blocks ALL ranged attacks + gases.', note: 'Counters archer groups.' },
  { spell: 'Wall of Thorns', level: 6, rating: 'A', effect: '7d8 piercing entering. Difficult terrain.', note: 'Druid area denial.' },
  { spell: 'Prismatic Wall', level: 9, rating: 'S+', effect: '7 layers. No concentration.', note: 'Best offensive wall.' },
];

export const WALL_COMBOS = [
  { combo: 'Wall of Force + AoE', effect: 'Trap + AoE. No escape.', rating: 'S+' },
  { combo: 'Wall of Fire + forced movement', effect: 'Push through fire. 5d8 per pass.', rating: 'S' },
  { combo: 'Wall of Force + Sickening Radiance', effect: 'Death trap. Exhaustion to death.', rating: 'S+ (often banned)' },
  { combo: 'Wall of Stone + permanent', effect: 'Reshape terrain permanently.', rating: 'A+' },
];

export const WALL_TIPS = [
  'Wall of Force: best wall. Only Disintegrate breaks it.',
  'Wall of Fire: choose which side burns. Face toward enemies.',
  'Wall of Stone maintained 10 min = permanent.',
  'Use walls to split enemy groups. Fight half at a time.',
  'Walls are concentration. Protect the caster.',
];
