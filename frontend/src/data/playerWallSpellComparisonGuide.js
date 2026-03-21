/**
 * playerWallSpellComparisonGuide.js
 * Player Mode: Wall spells compared — zone control and battlefield division
 * Pure JS — no React dependencies.
 */

export const WALL_SPELLS = [
  { spell: 'Wall of Force', level: 5, rating: 'S+', properties: 'Invisible, impenetrable, immune to damage.', note: 'Only Disintegrate breaks it. Split encounters in half.' },
  { spell: 'Forcecage', level: 7, rating: 'S+', properties: 'No concentration. 1 hour. Blocks teleport (CHA save).', note: 'Trap anything. No concentration. Broken.' },
  { spell: 'Wall of Stone', level: 5, rating: 'S', properties: 'Physical stone. Permanent if held 10 min.', note: 'Build permanent structures mid-combat.' },
  { spell: 'Wall of Fire', level: 4, rating: 'S', properties: '5d8 fire one side. Opaque.', note: 'Best damage wall. Force enemies through fire.' },
  { spell: 'Prismatic Wall', level: 9, rating: 'S', properties: '7 layers with escalating effects.', note: 'Ultimate barrier. Multiple damage types + conditions.' },
  { spell: 'Wall of Ice', level: 6, rating: 'A+', properties: '30 HP/panel. 10d6 cold on creation.', note: 'Burst + barrier. Vulnerable to fire.' },
  { spell: 'Wall of Thorns', level: 6, rating: 'A+', properties: '7d8 piercing entry. Difficult terrain.', note: 'Druid wall. Heavy entry damage.' },
  { spell: 'Blade Barrier', level: 6, rating: 'A', properties: '6d10 slashing. 3/4 cover.', note: 'Cleric wall. Ring shape traps enemies.' },
  { spell: 'Wind Wall', level: 3, rating: 'B+', properties: 'Blocks ranged attacks and gas.', note: 'Anti-archer. Cheap L3 counter.' },
  { spell: 'Wall of Sand', level: 3, rating: 'B', properties: 'Heavily obscured. Difficult terrain.', note: 'Vision blocker. Cheap.' },
  { spell: 'Wall of Water', level: 3, rating: 'B', properties: 'Halves fire. Disadvantage on ranged through.', note: 'Soft barrier. Niche.' },
];

export const WALL_TACTICS = [
  { tactic: 'Split encounter', detail: 'Wall of Force between half the enemies. 3v3 instead of 6v3.', rating: 'S+' },
  { tactic: 'Dome trap', detail: 'Wall of Force dome over caster. Trapped for 10 min.', rating: 'S+' },
  { tactic: 'Damage corridor', detail: 'Wall of Fire behind enemies. Retreat = 5d8 fire.', rating: 'S' },
  { tactic: 'Ring trap', detail: 'Ring Wall of Fire. Damage to escape any direction.', rating: 'S' },
  { tactic: 'Forcecage + AoE', detail: 'Forcecage + Sickening Radiance/Cloudkill = unavoidable death.', rating: 'S+' },
  { tactic: 'Permanent construction', detail: 'Wall of Stone → 10 min → permanent. Build bridges, walls, rooms.', rating: 'A+' },
  { tactic: 'Chokepoint creation', detail: 'Wall with gap. Only 1-2 enemies pass at a time.', rating: 'A+' },
];

export const WALL_TIPS = [
  'Wall of Force: best wall. Nothing goes through. Only Disintegrate breaks it.',
  'Wall of Fire: damaging side faces enemies. They take 5d8 to retreat through.',
  'Forcecage has no concentration. Free trap for 1 hour. Combine with AoE.',
  'Wall of Stone: permanent after 10 min. Free construction for fortifications.',
  'Walls can be rings, domes, or curved. Not just straight lines.',
  'Wind Wall hard-counters archer groups. All projectiles blocked.',
];
