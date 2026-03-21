/**
 * playerSpiritGuardiansBuildGuide.js
 * Player Mode: Spirit Guardians optimization — best sustained AoE spell
 * Pure JS — no React dependencies.
 */

export const SPIRIT_GUARDIANS = {
  level: 3, concentration: true, duration: '10 min',
  range: '15ft radius, moves with you',
  damage: '3d8 radiant/necrotic (WIS half). +1d8/slot level.',
  terrain: 'Difficult terrain for enemies.',
  rating: 'S+ (best sustained AoE)',
};

export const SG_TACTICS = [
  { tactic: 'Walk into enemies', method: 'Get in melee. They take damage at turn start.', rating: 'S+' },
  { tactic: 'Dodge + SG', method: 'Cast SG, Dodge each turn. Tank damage aura.', rating: 'S+' },
  { tactic: 'SG + Spiritual Weapon', method: 'SG (concentration) + SW (not). BA attack each turn.', rating: 'S+' },
  { tactic: 'Chokepoint', method: 'Doorway + SG. Nothing passes without damage.', rating: 'S+' },
  { tactic: 'Upcast L5', method: '5d8/turn per enemy = 22.5 avg. Better than Fireball sustained.', rating: 'S+' },
];

export const SG_BUILD = {
  armor: 'Heavy armor + shield = 20+ AC.',
  feats: ['War Caster', 'Resilient (CON)', 'Tough'],
  combo: ['Spiritual Weapon (BA damage)', 'Healing Word (BA revive)'],
  domains: ['Life', 'Forge', 'Twilight', 'War'],
};

export const SG_TIPS = [
  'Cast SG → walk into enemies → Dodge action.',
  'Spiritual Weapon: not concentration. Use with SG.',
  'Heavy armor + shield: you MUST be in melee.',
  'War Caster: advantage concentration. Mandatory.',
  'Upcast SG: +1d8/level. Best upcast scaling.',
  'Difficult terrain: enemies can\'t escape easily.',
  '10 minutes: lasts multiple encounters.',
  'Best domains: Life, Forge, Twilight.',
];
