/**
 * playerTerrainCreation.js
 * Player Mode: Spells and abilities that create or modify terrain
 * Pure JS — no React dependencies.
 */

export const TERRAIN_CREATION_SPELLS = [
  { spell: 'Mold Earth', level: 'Cantrip', area: '5ft cube', duration: 'Instant/1 hour', effect: 'Move 5ft cube of loose earth. Create difficult terrain. Shape earth into simple forms.', rating: 'A', note: 'Free cover creation, trench digging, pit traps. Criminally underrated cantrip.' },
  { spell: 'Shape Water', level: 'Cantrip', area: '5ft cube', duration: 'Instant/1 hour', effect: 'Move/freeze/color water. Freeze water to create ice platforms or barriers.', rating: 'B', note: 'Freeze water under enemies for difficult terrain. Create ice bridges.' },
  { spell: 'Spike Growth', level: 2, area: '20ft radius', duration: '10 min (conc)', effect: '2d4 per 5ft moved. Difficult terrain. Camouflaged.', rating: 'S', note: 'Area denial king. Force movement through it for insane damage.' },
  { spell: 'Plant Growth', level: 3, area: '100ft radius', duration: 'Instant', effect: '4ft movement per 1ft. Not concentration. Can\'t be dispelled.', rating: 'S', note: 'Permanent quarter-speed zone. 100ft radius is enormous. No save.' },
  { spell: 'Wall of Stone', level: 5, area: '10 panels (10x10x6 each)', duration: '10 min (conc) → permanent', effect: 'Create stone walls. If maintained full duration, becomes permanent.', rating: 'S', note: 'Permanent fortification. Bridge building. Instant cover.' },
  { spell: 'Wall of Fire', level: 4, area: '60ft long, 20ft high', duration: '1 min (conc)', effect: '5d8 fire to creatures within 10ft of one side.', rating: 'S', note: 'Splits battlefield. Forces repositioning or damage.' },
  { spell: 'Wall of Force', level: 5, area: '10 panels', duration: '10 min (conc)', effect: 'Indestructible invisible barrier. Nothing passes.', rating: 'S+', note: 'Dome traps, battlefield splits, total defense. Only Disintegrate breaks it.' },
  { spell: 'Transmute Rock', level: 5, area: '40ft cube', duration: 'Until dispelled', effect: 'Rock to mud: difficult terrain, creatures sink. Mud to rock: trap creatures in stone.', rating: 'A', note: 'Rock to mud under enemies. Then mud to rock to trap them.' },
  { spell: 'Move Earth', level: 6, area: '40ft square, 10ft deep', duration: '2 hours (conc)', effect: 'Reshape terrain. Dig trenches, raise hills, create fortifications.', rating: 'A', note: 'Slow but powerful. Battlefield preparation before a siege.' },
  { spell: 'Mirage Arcane', level: 7, area: '1 mile square', duration: '10 days', effect: 'Terrain looks, sounds, smells, and FEELS different. Can create structures.', rating: 'S', note: 'The terrain is REAL to touch. Illusory bridges actually hold weight. Insane.' },
];

export const TERRAIN_TACTICS = [
  { tactic: 'Trench warfare', description: 'Use Mold Earth to dig trenches for three-quarters cover. Quick and free (cantrip).', setup: '1 round per 5ft cube' },
  { tactic: 'Kill box', description: 'Wall of Stone on three sides, Spike Growth on the floor. Push enemies in.', setup: '2 rounds (wall + spike growth)' },
  { tactic: 'Bridge destruction', description: 'Transmute Rock on a stone bridge = mud = bridge collapses. Enemies fall.', setup: '1 action' },
  { tactic: 'Instant fortification', description: 'Wall of Stone creates permanent battlements if maintained for 10 minutes. Pre-combat prep.', setup: '10 minutes' },
  { tactic: 'Mud trap', description: 'Transmute Rock → mud under enemies. Next turn: Transmute Rock → rock. Enemies trapped in stone.', setup: '2 rounds, 2 5th-level slots' },
  { tactic: 'Ice path', description: 'Shape Water to freeze a path of ice. Enemies without ice climbing gear treat it as difficult terrain.', setup: 'Cantrip, multiple casts' },
];

export const ENVIRONMENTAL_WEAPONS = [
  { weapon: 'Chandeliers', action: 'Cut the rope (attack or fire)', effect: 'Falls on enemies below. 2d6-4d6 bludgeoning, DM discretion.', note: 'Classic adventure movie move.' },
  { weapon: 'Pillars', action: 'Destroy supports (enough damage)', effect: 'Ceiling collapse. 4d10 bludgeoning, DEX save for half.', note: 'Risk: you might be under it too.' },
  { weapon: 'Cliffs/ledges', action: 'Shove, Thunderwave, Repelling Blast', effect: 'Fall damage: 1d6 per 10ft. No save if pushed.', note: 'Falling damage can be massive. Best forced movement payoff.' },
  { weapon: 'Water', action: 'Break dam, Destroy Water control', effect: 'Flash flood. STR save or swept away + bludgeoning.', note: 'Devastating in narrow spaces.' },
  { weapon: 'Fire hazards', action: 'Oil + fire, burning buildings', effect: '1d10 fire damage per round in burning area.', note: 'Smoke = heavily obscured. Fire spreads.' },
];

export function getTerrainSpellsForLevel(maxLevel) {
  return TERRAIN_CREATION_SPELLS.filter(s => {
    const lvl = s.level === 'Cantrip' ? 0 : s.level;
    return lvl <= maxLevel;
  });
}

export function getTerrainTactic(tacticName) {
  return TERRAIN_TACTICS.find(t =>
    t.tactic.toLowerCase().includes((tacticName || '').toLowerCase())
  ) || null;
}
