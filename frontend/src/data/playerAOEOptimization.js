/**
 * playerAOEOptimization.js
 * Player Mode: AoE spell placement, friendly fire avoidance, and maximum target coverage
 * Pure JS — no React dependencies.
 */

export const AOE_SHAPES = [
  { shape: 'Sphere', spells: ['Fireball', 'Shatter', 'Spirit Guardians'], rule: 'Radius from point of origin. Spreads around corners.', placement: 'Center on enemy cluster. Count squares from center in all directions.' },
  { shape: 'Cone', spells: ['Burning Hands', 'Cone of Cold', 'Breath Weapons'], rule: 'Width at any point = distance from origin. Fan shape.', placement: 'Stand to side of enemy group. Angle cone to maximize targets.' },
  { shape: 'Cube', spells: ['Thunderwave', 'Hypnotic Pattern', 'Cloudkill'], rule: 'Point of origin on any face of the cube.', placement: 'Put a face on the ground, edge touching you for Thunderwave. Or far face facing enemies.' },
  { shape: 'Line', spells: ['Lightning Bolt', 'Wall of Fire'], rule: 'Width usually 5ft. Length varies. Straight line from you.', placement: 'Line up enemies in a row. Position yourself to catch the most in a line.' },
  { shape: 'Cylinder', spells: ['Moonbeam', 'Flame Strike', 'Insect Plague'], rule: 'Radius + height. Like a flat sphere but vertical.', placement: 'Similar to sphere but also catches flying enemies in the column.' },
];

export const FIREBALL_OPTIMIZATION = {
  area: '20ft radius sphere (40ft diameter)',
  squares: '8 squares diameter on a 5ft grid',
  range: '150ft',
  tips: [
    'A 20ft radius covers a LOT of area. 8×8 grid squares = 64 squares.',
    'Fireball spreads around corners. Enemies behind pillars aren\'t necessarily safe.',
    'Center it between two enemy clusters, not on one group.',
    'At 150ft range, you can place it very far from allies.',
    'It ignites flammable objects. Be careful with loot and environment.',
    'If allies are mixed in, consider Careful Spell (Sorcerer) or Sculpt Spells (Evocation Wizard).',
  ],
  sculpting: {
    feature: 'Sculpt Spells (Evocation Wizard 2)',
    effect: 'Choose CHA mod (1+ minimum) creatures. They auto-succeed on the save and take no damage.',
    verdict: 'This feature turns Fireball from "avoid allies" to "fire everywhere." Evocation Wizards are the best blasters.',
  },
};

export const FRIENDLY_FIRE_AVOIDANCE = [
  { method: 'Sculpt Spells (Evocation Wizard)', effect: 'Allies auto-succeed and take no damage', cost: 'Class feature', rating: 'S' },
  { method: 'Careful Spell (Sorcerer)', effect: 'CHA mod creatures auto-succeed on save', cost: '1 sorcery point', rating: 'B', caveat: 'They auto-SUCCEED, not auto-AVOID. Half damage on save-for-half spells.' },
  { method: 'Avoid AoE entirely', effect: 'Use single-target spells when allies are mixed in', cost: 'Opportunity cost', rating: 'A' },
  { method: 'Position first', effect: 'Communicate: "Move out of that area, I\'m Fireballing next turn"', cost: 'Coordination', rating: 'A' },
  { method: 'Use save-or-nothing AoE', effect: 'Hypnotic Pattern: allies who save are unaffected (no half damage)', cost: 'Spell choice', rating: 'A' },
  { method: 'Forced movement first', effect: 'Repelling Blast, Thunderwave allies away. Then AoE the enemies.', cost: 'Extra action/turn', rating: 'B' },
];

export const AOE_DAMAGE_COMPARISON = [
  { spell: 'Burning Hands', level: 1, area: '15ft cone', damage: '3d6 fire', avgPerTarget: 10.5, save: 'DEX', rating: 'B' },
  { spell: 'Thunderwave', level: 1, area: '15ft cube', damage: '2d8 thunder', avgPerTarget: 9, save: 'CON', rating: 'A' },
  { spell: 'Shatter', level: 2, area: '10ft sphere', damage: '3d8 thunder', avgPerTarget: 13.5, save: 'CON', rating: 'A' },
  { spell: 'Fireball', level: 3, area: '20ft sphere', damage: '8d6 fire', avgPerTarget: 28, save: 'DEX', rating: 'S' },
  { spell: 'Lightning Bolt', level: 3, area: '100ft line', damage: '8d6 lightning', avgPerTarget: 28, save: 'DEX', rating: 'A' },
  { spell: 'Synaptic Static', level: 5, area: '20ft sphere', damage: '8d6 psychic', avgPerTarget: 28, save: 'INT', rating: 'S' },
  { spell: 'Cone of Cold', level: 5, area: '60ft cone', damage: '8d8 cold', avgPerTarget: 36, save: 'CON', rating: 'A' },
];

export const MAXIMUM_TARGETS = [
  { tactic: 'Wait for enemies to cluster', description: 'Don\'t AoE one enemy. Wait until 3+ are grouped. Patience = efficiency.' },
  { tactic: 'Chokepoints', description: 'Doorways, hallways, bridges. Enemies bunch up. Perfect AoE targets.' },
  { tactic: 'After enemy movement', description: 'Enemies move toward you, clustering near the tank. AoE behind the tank.' },
  { tactic: 'Forced clustering', description: 'Use Fear, Repelling Blast, or terrain to push enemies together. Then AoE.' },
  { tactic: 'Ready the spell', description: '"When 3+ enemies are within 20ft of each other, I cast Fireball." Ready action.' },
];

export function calculateAoEValue(avgDamage, expectedTargets, spellSlotLevel) {
  const totalDamage = avgDamage * expectedTargets;
  const efficiency = totalDamage / spellSlotLevel;
  return { totalDamage, efficiency, targets: expectedTargets, perSlotLevel: efficiency };
}

export function isWorthAoE(singleTargetDamage, aoeDamage, targetCount) {
  return aoeDamage * targetCount > singleTargetDamage * 2;
}
