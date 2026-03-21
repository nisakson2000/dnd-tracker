/**
 * playerHasteSlowComparisonGuide.js
 * Player Mode: Haste vs Slow — comparison, when to use each
 * Pure JS — no React dependencies.
 */

export const HASTE_SPELL = {
  level: 3,
  concentration: true,
  duration: '1 minute',
  target: '1 willing creature',
  effects: ['+2 AC', 'Double speed', 'Advantage on DEX saves', 'Extra action (Attack [one], Dash, Disengage, Hide, Use Object)'],
  risk: 'If concentration breaks: target LOSES NEXT TURN (can\'t move or act).',
  rating: 'S+',
  note: 'Best single-target buff. But concentration loss is devastating.',
};

export const SLOW_SPELL = {
  level: 3,
  concentration: true,
  duration: '1 minute',
  targets: 'Up to 6 creatures in 40ft cube',
  effects: ['-2 AC', 'Half speed', 'No reactions', 'Can\'t use more than 1 attack', '50% chance to lose spell (must use action + next turn)'],
  save: 'WIS save. Repeat at end of each turn.',
  rating: 'S',
  note: 'Multi-target debuff. Devastating on martial enemies. No repeat save for escape — save each turn.',
};

export const COMPARISON = [
  { factor: 'Targets', haste: '1 ally', slow: 'Up to 6 enemies', winner: 'Slow' },
  { factor: 'Action cost', haste: 'Buff ally action', slow: 'Reduce enemy actions', winner: 'Slow (affects more)' },
  { factor: 'Risk', haste: 'Ally loses turn if broken', slow: 'Enemies save each turn', winner: 'Haste (predictable if held)' },
  { factor: 'AC change', haste: '+2 AC to ally', slow: '-2 AC to enemies', winner: 'Tie (same magnitude)' },
  { factor: 'Caster safety', haste: 'Lose concentration = ally punished', slow: 'Lose concentration = enemies return to normal', winner: 'Slow (less punishing failure)' },
  { factor: 'Multi-attack enemies', haste: 'Ally gets 1 extra attack', slow: 'Enemies limited to 1 attack total', winner: 'Slow (removes 2+ attacks per enemy)' },
  { factor: 'Caster enemies', haste: 'No specific benefit', slow: '50% chance to waste spell', winner: 'Slow' },
];

export const WHEN_TO_HASTE = [
  'Target has Extra Attack (Fighter L11+: 3 attacks → 4 attacks).',
  'Target is a Rogue (extra attack = extra SA chance).',
  'You can maintain concentration safely (War Caster, back line).',
  'Single big ally needs maximum output (Paladin smite build).',
  'Mobility matters: double speed for positioning.',
];

export const WHEN_TO_SLOW = [
  'Multiple enemies (3+ targets = massive value).',
  'Enemy relies on multi-attack (Dragons, Giants).',
  'Enemy casters (50% spell failure chance).',
  'You\'re not confident about maintaining concentration (Slow failing is less punishing).',
  'Martial enemies with reactions (Slow removes reactions).',
];

export const HASTE_SLOW_TIPS = [
  'Haste: best on Fighter L11+ (3 attacks → 4). Or Rogue (extra SA chance).',
  'Slow: better than Haste in most group fights. Affects 6 targets.',
  'Haste risk: losing concentration = ally loses a FULL TURN. Devastating.',
  'Slow: losing concentration = enemies return to normal. Less punishing.',
  'Slow removes reactions. Enemies can\'t AoE or OA.',
  'Slow vs multi-attack: Dragon with 3 attacks → 1 attack. Huge.',
  'Slow vs casters: 50% chance to waste their spell. Anti-caster.',
  'Don\'t Haste squishy casters. They\'ll lose concentration.',
  'Haste on Paladin: extra attack = extra smite opportunity.',
  'When in doubt: Slow is usually the better choice for groups.',
];
