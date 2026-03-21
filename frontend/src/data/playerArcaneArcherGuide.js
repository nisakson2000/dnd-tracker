/**
 * playerArcaneArcherGuide.js
 * Player Mode: Arcane Archer subclass — arcane shots, optimization, and builds
 * Pure JS — no React dependencies.
 */

export const ARCANE_ARCHER_BASICS = {
  class: 'Fighter (Arcane Archer)',
  level: 3,
  resource: 'Arcane Shot — 2 uses per short rest. Choose 2 options at level 3, gain more at higher levels.',
  scaling: 'Arcane Shot damage increases from 2d6 to 4d6 at Fighter level 18.',
  limitation: 'Only 2 shots per rest is the main weakness. Make them count.',
  magicArrow: 'At level 3, your arrows count as magical (overcome resistance).',
};

export const ARCANE_SHOTS = [
  { name: 'Banishing Arrow', save: 'CHA', effect: 'Force damage + target banished until end of your next turn on fail', rating: 'S', why: 'Remove a target from combat for a full round. No concentration.' },
  { name: 'Beguiling Arrow', save: 'WIS', effect: 'Psychic damage + charmed by an ally', rating: 'A', why: 'Target can\'t attack the chosen ally. Good for protecting squishies.' },
  { name: 'Bursting Arrow', save: 'None', effect: 'Force damage to target + 2d6 to all within 10ft', rating: 'A', why: 'Auto-hit AoE damage. No save. Good against groups.' },
  { name: 'Enfeebling Arrow', save: 'CON', effect: 'Necrotic damage + target\'s weapon damage halved', rating: 'B', why: 'Reduces boss damage output. CON save is hard to fail for big enemies.' },
  { name: 'Grasping Arrow', save: 'None', effect: 'Poison damage + 2d6 slashing on movement + speed reduced 10ft', rating: 'S', why: 'No save. Punishes movement. Lasts for 1 minute. Hard to remove.' },
  { name: 'Piercing Arrow', save: 'DEX', effect: 'Ignores cover, hits everything in a 30ft line', rating: 'A', why: 'Line AoE. Hits through walls and cover. Good positioning = multiple hits.' },
  { name: 'Seeking Arrow', save: 'DEX', effect: 'Ignores cover and disadvantage. Curved shot.', rating: 'A', why: 'Can\'t hide from this shot. Hit invisible or behind-cover targets.' },
  { name: 'Shadow Arrow', save: 'WIS', effect: 'Psychic damage + can\'t see beyond 5ft', rating: 'A', why: 'Blind enemy beyond 5ft. Shuts down ranged attackers and casters.' },
];

export const ARCANE_ARCHER_OPTIMIZATION = [
  { tip: 'Pick Grasping + Banishing at level 3', detail: 'Grasping has no save and punishes movement. Banishing removes a key target.', priority: 'S' },
  { tip: 'Save shots for important targets', detail: 'Only 2 per short rest. Don\'t waste on minions. Use on bosses and key threats.', priority: 'S' },
  { tip: 'Take Sharpshooter', detail: '-5/+10 damage applies to EVERY attack, not just Arcane Shots. Core feat.', priority: 'S' },
  { tip: 'Use Action Surge for nova', detail: 'Normal attacks + Action Surge attacks + Arcane Shot on the best hit. Devastating burst.', priority: 'A' },
  { tip: 'Short rest aggressively', detail: 'Arcane Shots recover on short rest. Push for short rests to get them back.', priority: 'A' },
  { tip: 'Multiclass considerations', detail: 'Ranger 3 (Gloom Stalker) adds WIS to initiative + extra first-turn attack. Strong combo.', priority: 'B' },
];

export const RECOMMENDED_PICKS = {
  level3: ['Grasping Arrow', 'Banishing Arrow'],
  level7: ['Seeking Arrow or Shadow Arrow'],
  level10: ['Bursting Arrow or Piercing Arrow'],
  level15: ['Beguiling Arrow or Enfeebling Arrow'],
};

export function getArcaneShots(fighterLevel) {
  if (fighterLevel < 3) return [];
  let count = 2;
  if (fighterLevel >= 7) count = 3;
  if (fighterLevel >= 10) count = 4;
  if (fighterLevel >= 15) count = 5;
  if (fighterLevel >= 18) count = 6;
  return { known: count, perRest: 2, damageDice: fighterLevel >= 18 ? '4d6' : '2d6' };
}
