/**
 * playerWallOfForceGuide.js
 * Player Mode: Wall of Force — the ultimate battlefield divider
 * Pure JS — no React dependencies.
 */

export const WALL_OF_FORCE_BASICS = {
  spell: 'Wall of Force',
  level: 5,
  school: 'Evocation',
  castingTime: '1 action',
  range: '120ft',
  components: 'V, S, M (pinch of powder from clear gemstone)',
  duration: 'Concentration, up to 10 minutes',
  classes: ['Wizard'],
  note: 'The most powerful battlefield control spell in 5e. Invisible, indestructible wall. Nothing physical passes through. No save. No HP. Cannot be dispelled normally.',
};

export const WALL_OF_FORCE_PROPERTIES = {
  invisible: 'The wall is invisible.',
  indestructible: 'Nothing can physically pass through. Immune to all damage.',
  shapes: 'Up to ten 10ft×10ft panels (flat wall), OR a dome/sphere up to 10ft radius.',
  etherealPlane: 'Extends into the Ethereal Plane, blocking ethereal travel.',
  noSave: 'No saving throw. Creatures in the way are pushed to one side (your choice).',
  dispel: 'Disintegrate destroys it. Dispel Magic works (DC 15). Antimagic Field suppresses a section.',
  breathAndLight: 'Air doesn\'t pass through. Creatures inside a sphere will eventually suffocate.',
  note: 'The dome/sphere is the most powerful usage. Traps creatures with no save, no escape (unless they can teleport).',
};

export const WALL_OF_FORCE_TACTICS = [
  { tactic: 'Dome cage on boss', detail: 'Drop a 10ft dome over the boss. No save. They\'re trapped. Fight the minions, then deal with the boss. Boss suffocates in ~10 minutes.', rating: 'S' },
  { tactic: 'Split the battlefield', detail: 'Flat wall between enemy groups. Fight half, then fight the other half. Divide and conquer.', rating: 'S' },
  { tactic: 'Dome + Sickening Radiance', detail: 'Dome a group → cast Sickening Radiance inside (through gaps or before closing). Enemies take radiant damage + exhaustion stacking. TPK combo.', rating: 'S' },
  { tactic: 'Dome + Cloudkill', detail: 'Dome a group → Cloudkill inside. 5d8 poison per round. No escape. Concentration on WoF, Cloudkill stays.', note: 'Requires 2 casters or pre-cast.', rating: 'S' },
  { tactic: 'Emergency wall for escape', detail: 'Wall between you and enemies. 10 minutes of safety. Long enough to short rest.', rating: 'A' },
  { tactic: 'Block a corridor', detail: 'Place wall across a hallway. Enemies behind can\'t reach you. Archers can\'t shoot through it.', rating: 'A' },
  { tactic: 'Protect the caster', detail: 'Dome yourself. You\'re safe from all physical attacks. Concentrate on your other spell.', rating: 'A' },
];

export const WALL_OF_FORCE_COUNTERS = [
  { counter: 'Disintegrate', detail: 'Automatically destroys one panel or section. The only reliable counter.', effectiveness: 'Hard counter' },
  { counter: 'Dispel Magic', detail: 'DC 15 check (L5 spell). Removes the wall if successful.', effectiveness: 'Soft counter' },
  { counter: 'Teleportation', detail: 'Misty Step, Dimension Door, Thunder Step. Can escape the dome.', effectiveness: 'Escape only' },
  { counter: 'Antimagic Field', detail: 'Suppresses the wall where fields overlap. Very rare.', effectiveness: 'Situational' },
  { counter: 'Passwall', detail: 'Creates passage through walls. Works on Wall of Force per RAW debate. DM ruling.', effectiveness: 'Disputed' },
];

export const WALL_SHAPES = [
  { shape: 'Flat Wall', panels: 'Up to 10 panels (10×10ft each)', area: '100ft long × 10ft high or 50ft × 20ft', use: 'Divide battlefield. Block corridors. Separate groups.', note: 'Panels must be contiguous. Can be angled.' },
  { shape: 'Dome', size: '10ft radius hemisphere', use: 'Trap a creature. Protect yourself. Create safe zone.', note: 'No floor — creature can dig out. But most can\'t.' },
  { shape: 'Sphere', size: '10ft radius sphere', use: 'Complete containment. Air-tight. Suffocation timer starts.', note: 'No air exchange. Creatures start suffocating. Brutal.' },
];

export function suffocationTimer(constitutionMod) {
  const minutesOfAir = 1 + Math.max(0, constitutionMod); // 1 + CON mod minutes (min 30 seconds)
  const roundsOfAir = minutesOfAir * 10;
  return { minutes: minutesOfAir, rounds: roundsOfAir, note: `Creature can hold breath for ${minutesOfAir} minutes. Then drops to 0 HP at start of next turn.` };
}
