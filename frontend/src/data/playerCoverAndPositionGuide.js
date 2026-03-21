/**
 * playerCoverAndPositionGuide.js
 * Player Mode: Cover types, usage, and tactical exploitation
 * Pure JS — no React dependencies.
 */

export const COVER_TYPES = [
  {
    type: 'Half Cover',
    acBonus: '+2 AC, +2 DEX saves',
    description: 'At least half blocked (low wall, furniture, another creature).',
    examples: ['Behind another creature', 'Low wall (3ft)', 'Thick table', 'Barrel'],
  },
  {
    type: 'Three-Quarters Cover',
    acBonus: '+5 AC, +5 DEX saves',
    description: 'Three-quarters blocked (portcullis, arrow slit, thick tree).',
    examples: ['Arrow slit', 'Thick tree trunk', 'Portcullis'],
  },
  {
    type: 'Full Cover',
    acBonus: 'Can\'t be targeted directly',
    description: 'Completely concealed (behind wall, closed door, around corner).',
    examples: ['Solid wall', 'Closed door', 'Around a corner'],
  },
];

export const COVER_INTERACTIONS = [
  { feature: 'Sharpshooter', interaction: 'Ignores half and three-quarters cover.', note: 'Makes cover mostly useless vs Sharpshooter.' },
  { feature: 'Spell Sniper', interaction: 'Ignores half and three-quarters cover for spell attacks.', note: 'EB + Spell Sniper = cover-piercing.' },
  { feature: 'Sacred Flame', interaction: 'Target gains no benefit from cover.', note: 'Only cantrip that ignores cover.' },
  { feature: 'AoE spells', interaction: 'Cover provides DEX save bonus if between target and origin.', note: 'Fireball: +2 or +5 DEX save with cover.' },
  { feature: 'Allies as cover', interaction: 'RAW: creatures provide half cover (+2 AC).', note: 'Enemy shooting past your tank gives you +2 AC.' },
];

export const COVER_TACTICS = [
  { tactic: 'Pop-out Attacks', method: 'Move from full cover → attack → move back.', rating: 'S' },
  { tactic: 'Arrow Slit Defense', method: 'Three-quarters cover while shooting. +5 AC.', rating: 'S+' },
  { tactic: 'Ally Bodyshield', method: 'Stand behind tank. Half cover from ranged.', rating: 'A' },
  { tactic: 'Prone Behind Wall', method: 'Drop prone behind half cover. Nearly immune to ranged.', rating: 'A+' },
  { tactic: 'Corner Peeking', method: 'Step around corner → attack → step back. Full cover between turns.', rating: 'S' },
  { tactic: 'Create Cover', method: 'Wall of Stone, Mold Earth, Minor Illusion (5ft cube).', rating: 'A+' },
];

export const COVER_TIPS = [
  'Half cover (+2 AC) = low walls, creatures, furniture.',
  'Three-quarters cover (+5 AC) = arrow slits, thick trees.',
  'Sharpshooter ignores half and three-quarters cover.',
  'Sacred Flame: only cantrip that ignores cover entirely.',
  'Allies provide half cover. Position casters behind tanks.',
  'Pop-out: move from cover, attack, move back. Simple and effective.',
  'AoE: cover gives DEX save bonus from blast origin point.',
  'Create cover with Wall of Stone, Mold Earth, or Minor Illusion.',
];
