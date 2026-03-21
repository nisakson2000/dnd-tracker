/**
 * playerHasteSlowGuide.js
 * Player Mode: Haste and Slow spell analysis, tactics, and risks
 * Pure JS — no React dependencies.
 */

export const HASTE_SPELL = {
  level: 3,
  class: 'Sorcerer/Wizard/Artificer',
  duration: '1 minute (concentration)',
  target: 'One willing creature',
  benefits: [
    'Double speed',
    '+2 AC',
    'Advantage on DEX saves',
    'Extra action each turn (Attack [one weapon only], Dash, Disengage, Hide, or Use Object)',
  ],
  lethargy: 'When Haste ends, target can\'t move or take actions until after their next turn.',
  risk: 'If you lose concentration, the target loses their ENTIRE next turn. Devastating.',
};

export const HASTE_TACTICS = [
  { tactic: 'Haste the Fighter', detail: '3 attacks → 4 attacks + doubled speed + +2 AC.', rating: 'S' },
  { tactic: 'Haste the Rogue', detail: 'Extra attack action = extra Sneak Attack chance. Also Dash for 120ft+ movement.', rating: 'A' },
  { tactic: 'Haste the Paladin', detail: 'Extra attack = extra Smite opportunity. +2 AC on an already tanky class.', rating: 'S' },
  { tactic: 'Twin Haste (Sorcerer)', detail: 'Haste TWO allies for 3 Sorcery Points. Double the value.', rating: 'S' },
  { tactic: 'Haste + Find Steed (Paladin)', detail: 'Find Steed shares self-targeted spells. Haste on yourself = mount also Hasted.', rating: 'S' },
  { tactic: 'Dash with Haste action', detail: 'Regular Dash + Haste Dash = triple speed. Cover massive distances.', rating: 'A' },
];

export const HASTE_RISKS = [
  'Losing concentration = target loses ENTIRE next turn. No movement, no actions, nothing.',
  'Enemy dispels or breaks your concentration at a critical moment → ally is stunned.',
  'War Caster and/or Resilient (CON) are almost mandatory if casting Haste.',
  'Don\'t Haste a character who\'s likely to take heavy damage (they\'ll need CON saves).',
  'Some DMs target the Haste caster specifically to drop the buff.',
];

export const SLOW_SPELL = {
  level: 3,
  class: 'Sorcerer/Wizard',
  duration: '1 minute (concentration)',
  targets: 'Up to 6 creatures in 40ft cube (WIS save)',
  effects: [
    'Speed halved',
    '-2 AC and DEX saves',
    'Can\'t use reactions',
    'Only one attack per turn (regardless of multiattack)',
    'Spellcasters: 50% chance spell is delayed to next turn (action wasted)',
  ],
  save: 'WIS save at end of each turn to end the effect.',
};

export const SLOW_TACTICS = [
  { tactic: 'Slow multiattacking enemies', detail: 'Dragon with 3 attacks → 1 attack. Huge damage reduction.', rating: 'S' },
  { tactic: 'Slow enemy casters', detail: '50% chance their spell fails each turn. Devastating for casters.', rating: 'S' },
  { tactic: 'Slow + party focus fire', detail: 'Enemies can\'t use reactions → free movement, no OAs, no Shield/Counterspell.', rating: 'S' },
  { tactic: 'Slow vs Haste', detail: 'Slow affects 6 targets. Haste affects 1. Slow is often the better spell.', rating: 'S' },
];

export const HASTE_VS_SLOW = {
  haste: { targets: 1, offensive: 'Extra attack + speed', defensive: '+2 AC + DEX saves', risk: 'Lethargy on concentration loss' },
  slow: { targets: 6, offensive: 'Halves enemy actions', defensive: '-2 AC + no reactions', risk: 'Enemies save each turn' },
  verdict: 'Slow is often mathematically better (6 targets vs 1). Haste is better for a single powerhouse ally.',
};

export function hastedAttacks(baseAttacks) {
  return baseAttacks + 1; // Haste grants one additional attack
}

export function slowedDPR(normalDPR, normalAttacks) {
  if (normalAttacks <= 1) return normalDPR;
  return normalDPR / normalAttacks; // Only 1 attack regardless of multiattack
}
