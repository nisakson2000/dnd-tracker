/**
 * playerForceWallTactics.js
 * Player Mode: Wall of Force and Forcecage — the most powerful control spells
 * Pure JS — no React dependencies.
 */

export const WALL_OF_FORCE = {
  level: 5,
  class: 'Wizard',
  duration: '10 minutes (concentration)',
  effect: 'Invisible wall of 10 panels (each 10×10ft) or dome/sphere up to 10ft radius.',
  key: [
    'INDESTRUCTIBLE. Cannot be damaged or dispelled by Dispel Magic.',
    'Nothing physically passes through. No attacks, no spells, no creatures.',
    'Only Disintegrate destroys it.',
    'Antimagic Field suppresses it while overlapping.',
    'Creatures inside a sphere/dome are trapped. No save.',
  ],
};

export const WOF_TACTICS = [
  { tactic: 'Sphere trap', detail: 'Dome/sphere around enemy. They\'re trapped for 10 minutes. No save. No escape (usually). Party ignores them.', use: 'Remove boss from fight. Handle minions first.' },
  { tactic: 'Split the fight', detail: 'Wall panels across the battlefield. Half the enemies on each side. Fight 4 instead of 8.', use: 'Always split outnumbered fights.' },
  { tactic: 'Bridge/ramp', detail: 'Wall panels can be angled. Create a ramp or bridge across hazards.', use: 'Cross pits, lava, water. Float panels as platforms.' },
  { tactic: 'Dome over casters', detail: 'Dome over your back line. Enemies can\'t reach casters. Casters can\'t cast out either, but they\'re safe.', use: 'Emergency protection for dying casters.' },
  { tactic: 'Wall + Sickening Radiance', detail: 'Cast Sickening Radiance (4th) inside the Wall dome. Targets take 4d10 radiant per turn, gain exhaustion. Can\'t escape. Eventually die to exhaustion (6 levels = death).', use: 'Combo kill. Controversial but RAW.' },
];

export const FORCECAGE = {
  level: 7,
  class: 'Warlock, Wizard',
  duration: '1 hour (NO concentration)',
  effect: '10ft cube cage (bars, creatures can be targeted through) or 10ft box (no bars, solid walls of force).',
  key: [
    'NO CONCENTRATION. Lasts 1 full hour.',
    'Can\'t be dispelled. Disintegrate doesn\'t work either.',
    'Teleportation out requires CHA save vs your spell DC. Fail = teleport fails and slot is wasted.',
    'Antimagic Field is the only reliable counter.',
    'Costs 1,500 gp in ruby dust (not consumed — reusable).',
  ],
};

export const FORCECAGE_COMBOS = [
  { combo: 'Forcecage + Sickening Radiance', detail: 'Same as Wall of Force combo but NO concentration needed for Forcecage. Both can be active.', rating: 'S (ban-worthy)' },
  { combo: 'Forcecage + Cloudkill', detail: 'Poison cloud inside the cage. 5d8/turn. Moves randomly but stays in cage.', rating: 'A' },
  { combo: 'Forcecage (box) on caster', detail: 'Caster trapped in solid box. Can\'t see out = can\'t target anything. Neutralized.', rating: 'S' },
  { combo: 'Forcecage (bars) on martial', detail: 'Bars version: can target through but can\'t leave. Casters attack in, martial can\'t escape.', rating: 'A' },
];

export const COUNTERING_WOF_FC = [
  { counter: 'Disintegrate', note: 'Destroys Wall of Force panels on contact. Does NOT work on Forcecage.' },
  { counter: 'Antimagic Field', note: 'Suppresses both. But requires getting inside the effect.' },
  { counter: 'Teleportation (vs Forcecage)', note: 'Misty Step, Dimension Door, etc. CHA save vs DC. If fail, slot wasted.' },
  { counter: 'Counterspell', note: 'Counter the Wall/Forcecage when it\'s cast. Only option before it goes up.' },
  { counter: 'Burrowing/Etherealness', note: 'Wall of Force extends into Ethereal. Forcecage also extends. No easy bypass.' },
  { counter: 'Readied action', note: 'Ready Counterspell or Misty Step for when the wall appears.' },
];

export function forcecageTeleportEscape(chaSave, casterDC) {
  const chance = Math.min(95, Math.max(5, (21 - (casterDC - chaSave)) * 5));
  return chance;
}

export function sickeningRadianceKillTurns(conSave, dc) {
  // Need 6 failed saves (6 exhaustion = death). Each turn is a save.
  const failChance = 1 - Math.min(0.95, Math.max(0.05, (21 - (dc - conSave)) / 20));
  return Math.ceil(6 / failChance);
}
