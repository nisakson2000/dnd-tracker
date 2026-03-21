/**
 * playerBattleFieldControl.js
 * Player Mode: Battlefield control spells and tactics
 * Pure JS — no React dependencies.
 */

export const CONTROL_SPELLS_RANKED = [
  { spell: 'Wall of Force', level: 5, rating: 'S', shape: 'Wall/Dome', saves: 'None', detail: 'Indestructible. Invisible. Splits encounters. THE control spell. Nothing gets through except Disintegrate.' },
  { spell: 'Hypnotic Pattern', level: 3, rating: 'S', shape: '30ft cube', saves: 'WIS', detail: 'Incapacitate a group. NO repeated saves. Must be shaken awake.' },
  { spell: 'Web', level: 2, rating: 'S', shape: '20ft cube', saves: 'DEX → STR', detail: 'Restrained + difficult terrain. Flammable. Low level, high impact.' },
  { spell: 'Spirit Guardians', level: 3, rating: 'S', shape: '15ft radius (you)', saves: 'WIS', detail: 'Mobile damage aura. Halves speed of enemies. Incredible for melee Clerics.' },
  { spell: 'Entangle', level: 1, rating: 'A', shape: '20ft square', saves: 'STR', detail: 'Restrained. 1st level! Difficult terrain stays even after breaking free.' },
  { spell: 'Spike Growth', level: 2, rating: 'A', shape: '20ft radius', saves: 'None', detail: '2d4 per 5ft of movement through it. Invisible difficult terrain. Devastating with forced movement.' },
  { spell: 'Sleet Storm', level: 3, rating: 'A', shape: '40ft radius', saves: 'DEX/CON', detail: 'Difficult terrain, heavily obscured, prone on failed DEX. Breaks concentration on failed CON.' },
  { spell: 'Wall of Fire', level: 4, rating: 'A', shape: '60ft line or 20ft ring', saves: 'DEX', detail: '5d8 when entering/starting near. Splits battlefield. Forces movement.' },
  { spell: 'Forcecage', level: 7, rating: 'S', shape: 'Box or Cage', saves: 'CHA (teleport)', detail: 'No concentration. Traps creatures. Only Plane Shift gets out (CHA save).' },
  { spell: 'Fog Cloud', level: 1, rating: 'B', shape: '20ft sphere', saves: 'None', detail: 'Heavily obscured. Blocks targeting. Great for retreat or blocking archers.' },
];

export const CONTROL_TACTICS = [
  { tactic: 'Split and Conquer', detail: 'Use Wall of Force/Fire to split enemy group in half. Fight half at a time.', requiredSpell: 'Wall of Force, Wall of Fire' },
  { tactic: 'Funnel', detail: 'Force enemies through a narrow space. Spirit Guardians or Spike Growth at the choke.', requiredSpell: 'Spirit Guardians, Spike Growth' },
  { tactic: 'Lockdown', detail: 'Web + Fire = restrained + burning. Hypnotic Pattern = entire group disabled.', requiredSpell: 'Web, Hypnotic Pattern' },
  { tactic: 'Push Into Hazard', detail: 'Spike Growth + Repelling Blast/Thorn Whip = forced movement through damaging terrain.', requiredSpell: 'Spike Growth + any push/pull' },
  { tactic: 'Deny Area', detail: 'Cloud spells block movement and visibility. Enemies can\'t reach you.', requiredSpell: 'Fog Cloud, Cloudkill, Stinking Cloud' },
  { tactic: 'Cage Match', detail: 'Forcecage the boss. Party kills minions freely. Then focus the caged boss.', requiredSpell: 'Forcecage' },
];

export const CONTROL_VS_DAMAGE = {
  when_control: 'Multiple enemies, party is outnumbered, need to prevent damage.',
  when_damage: 'Few enemies, boss solo, enemies are already controlled.',
  rule: 'Control first, damage second. Disabling 4 enemies for 1 round is better than dealing 30 damage to one.',
  exception: 'If you can kill an enemy outright, that\'s the best control — dead enemies do nothing.',
};

export function getControlSpellsForLevel(maxLevel) {
  return CONTROL_SPELLS_RANKED.filter(s => s.level <= maxLevel);
}

export function suggestControlTactic(situation) {
  return CONTROL_TACTICS.find(t =>
    t.tactic.toLowerCase().includes((situation || '').toLowerCase()) ||
    t.detail.toLowerCase().includes((situation || '').toLowerCase())
  ) || null;
}
