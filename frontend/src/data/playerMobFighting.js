/**
 * playerMobFighting.js
 * Player Mode: Fighting large groups, mob rules, and horde tactics
 * Pure JS — no React dependencies.
 */

export const MOB_ATTACK_RULE = {
  source: 'DMG p. 250',
  rule: 'Instead of rolling attacks individually for large groups, determine hits by ratio.',
  table: [
    { needed: '1-5', ratio: '1 attacker per hit' },
    { needed: '6-12', ratio: '2 attackers per hit' },
    { needed: '13-14', ratio: '3 attackers per hit' },
    { needed: '15-16', ratio: '4 attackers per hit' },
    { needed: '17-18', ratio: '5 attackers per hit' },
    { needed: '19', ratio: '10 attackers per hit' },
    { needed: '20', ratio: '20 attackers per hit' },
  ],
};

export const ANTI_HORDE_SPELLS = [
  { spell: 'Hypnotic Pattern', level: 3, effect: 'Incapacitate all in 30ft cube. WIS save. No repeat save.', rating: 'S' },
  { spell: 'Fireball', level: 3, effect: '8d6 fire 20ft sphere. Kills most low-CR mobs outright.', rating: 'S' },
  { spell: 'Spirit Guardians', level: 3, effect: '3d8/turn to all enemies within 15ft. Half speed. Cleric\'s bread and butter.', rating: 'S' },
  { spell: 'Sleep', level: 1, effect: '5d8 HP worth of creatures fall asleep. No save. Wipes weak mobs.', rating: 'A (low levels)' },
  { spell: 'Web', level: 2, effect: '20ft cube restraining. Difficult terrain even on save. Flammable.', rating: 'A' },
  { spell: 'Spike Growth', level: 2, effect: '2d4/5ft moved. Invisible. Devastating with forced movement.', rating: 'A' },
  { spell: 'Slow', level: 3, effect: '6 targets: half speed, -2 AC, no reactions, 1 attack only.', rating: 'A' },
  { spell: 'Wall of Fire', level: 4, effect: 'Split the horde. 5d8 fire to those near or passing through.', rating: 'S' },
];

export const HORDE_COMBAT_TIPS = [
  'Choke points are your best friend. Funnel enemies through narrow spaces.',
  'Prioritize AoE over single-target damage. One Fireball > 8 longsword swings.',
  'Tank should Dodge action, not Attack. Buy time for casters to AoE.',
  'Don\'t waste healing on chip damage. Focus on preventing deaths.',
  'Readied actions waste your turn. Use your full action on your turn instead.',
  'If overwhelmed, fighting retreat through prepared ground (caltrops, spike growth).',
  'Morale: many creatures flee at 50% casualties. Intimidation can break them early.',
];

export const CLEAVE_RULE = {
  optional: 'DMG p. 272: When a melee attack drops a creature to 0 HP, leftover damage carries to adjacent target.',
  condition: 'New target must be within reach. Original attack roll vs new target AC.',
  note: 'Great Weapon Master builds benefit hugely from cleave.',
};

export function mobHits(numAttackers, attackBonus, targetAC) {
  const needed = targetAC - attackBonus;
  if (needed <= 5) return numAttackers;
  if (needed <= 12) return Math.floor(numAttackers / 2);
  if (needed <= 14) return Math.floor(numAttackers / 3);
  if (needed <= 16) return Math.floor(numAttackers / 4);
  if (needed <= 18) return Math.floor(numAttackers / 5);
  if (needed === 19) return Math.floor(numAttackers / 10);
  return Math.floor(numAttackers / 20);
}

export function aoeEfficiency(spellLevel, targetCount) {
  const baseDamage = { 1: 14, 2: 18, 3: 28, 4: 32, 5: 40 };
  return (baseDamage[spellLevel] || 20) * targetCount;
}
