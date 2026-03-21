/**
 * playerAoEPlacement.js
 * Player Mode: AoE spell placement optimizer and safety checker
 * Pure JS — no React dependencies.
 */

export const AOE_PLACEMENT_TIPS = [
  { shape: 'Sphere (Fireball)', tip: 'Center between enemy clusters. 20ft radius = 40ft diameter. Watch for allies in the blast.', gridSquares: '~13 squares at 5ft grid' },
  { shape: 'Cone (Burning Hands)', tip: 'Position so cone sweeps across enemy line. Width at endpoint = distance from you.', gridSquares: 'Varies: 15ft cone = ~6 squares' },
  { shape: 'Cube (Thunderwave)', tip: 'Origin is one face of the cube. You can stand at the edge without being inside.', gridSquares: '15ft cube = 9 squares' },
  { shape: 'Line (Lightning Bolt)', tip: 'Line up enemies. Works best in corridors. 100ft × 5ft = 20 squares.', gridSquares: '~20 squares in a line' },
  { shape: 'Cylinder (Moonbeam)', tip: 'Drop from above. Good for hitting flying enemies or lighting up areas.', gridSquares: 'Varies by radius' },
  { shape: 'Wall (Wall of Fire)', tip: 'Split the battlefield. Force enemies through it or trap them behind it.', gridSquares: '60ft long or 20ft ring' },
];

export const FRIENDLY_FIRE_PREVENTION = [
  { method: 'Careful Spell (Sorcerer)', detail: 'Choose CHA mod creatures to auto-succeed on the save. Still take half damage.' },
  { method: 'Sculpt Spells (Evocation Wizard)', detail: 'Choose 1 + spell level creatures. Auto-succeed AND take no damage.' },
  { method: 'Careful positioning', detail: 'Place the AoE so allies are outside. Sometimes worth less coverage for 0 friendly fire.' },
  { method: 'Warn your allies first', detail: '"Move away from the door — I\'m about to Fireball it." Let them reposition.' },
  { method: 'Use save-friendly spells', detail: 'Spirit Guardians lets you choose who is affected. No friendly fire possible.' },
];

export const AOE_SIZE_REFERENCE = {
  '5ft': 'Tiny. 1 square. Thunderous Smite area.',
  '10ft': '4 squares (2×2). Grease, Web is 20ft cube.',
  '15ft': '~12 squares. Thunderwave cube, Burning Hands cone, Spirit Guardians radius.',
  '20ft': '~50 squares in a sphere. Fireball, Hunger of Hadar, Hypnotic Pattern.',
  '30ft': '~113 squares in a sphere. Fear cone.',
  '60ft': 'Huge. Cone of Cold. Half the battlefield.',
  '100ft': 'Lightning Bolt line. Covers almost any corridor.',
};

export function estimateTargetsHit(aoeRadius, enemyCount, spreadLevel) {
  // spreadLevel: 'tight' (clustered), 'normal', 'spread' (scattered)
  const baseHitRate = { tight: 0.8, normal: 0.5, spread: 0.25 };
  const rate = baseHitRate[spreadLevel] || 0.5;
  const scaleFactor = Math.min(1, aoeRadius / 20); // larger AoE hits more
  return Math.max(1, Math.round(enemyCount * rate * (0.5 + scaleFactor)));
}

export function isAllyInBlast(allyDistance, aoeRadius) {
  return allyDistance <= aoeRadius;
}
