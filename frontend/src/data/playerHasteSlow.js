/**
 * playerHasteSlow.js
 * Player Mode: Haste and Slow spell analysis, usage, and counters
 * Pure JS — no React dependencies.
 */

export const HASTE_SPELL = {
  level: 3,
  school: 'Transmutation',
  castingTime: 'Action',
  range: '30ft',
  duration: '1 minute (concentration)',
  target: 'One willing creature',
  effects: [
    'Speed doubled',
    '+2 AC',
    'Advantage on DEX saves',
    'Extra action each turn (Attack [one attack only], Dash, Disengage, Hide, or Use Object)',
  ],
  lethargy: 'When spell ends, target can\'t move or take actions until after its next turn.',
  classes: ['Sorcerer', 'Wizard', 'Artificer'],
  subclasses: ['Oath of Vengeance Paladin', 'Horizon Walker Ranger'],
};

export const HASTE_BEST_TARGETS = [
  { target: 'Paladin', reason: 'Extra attack = extra smite opportunity. +2 AC and DEX saves on a frontliner.', rating: 'S' },
  { target: 'Rogue', reason: 'Extra attack means two chances for Sneak Attack. If first misses, second can land.', rating: 'S' },
  { target: 'Fighter', reason: 'Already has Action Surge. Extra action for more attacks. Good but diminishing returns.', rating: 'A' },
  { target: 'Barbarian', reason: '+2 AC stacks with Rage DR. Extra attack while Reckless Attacking is great.', rating: 'A' },
  { target: 'Monk', reason: 'Doubled speed + Dash = insane movement. Extra attack for Stunning Strike attempts.', rating: 'B' },
  { target: 'Wizard (self)', reason: 'Risky — you\'re concentrating AND in the action. +2 AC helps. Extra action for Dash/Disengage escape.', rating: 'B' },
];

export const HASTE_MISTAKES = [
  'Using the extra action to cast a spell — you CAN\'T. It\'s limited to Attack (one attack), Dash, Disengage, Hide, or Use Object.',
  'Forgetting lethargy — if concentration drops, the target is STUNNED for a round. Massive risk.',
  'Casting Haste on yourself as a fragile caster — one lost concentration check and YOU\'RE stunned.',
  'Not communicating with the target — they need to know they\'re Hasted to use the extra action.',
  'Stacking Haste with other concentration spells — you can only concentrate on ONE spell.',
];

export const SLOW_SPELL = {
  level: 3,
  school: 'Transmutation',
  castingTime: 'Action',
  range: '120ft',
  area: '40ft cube',
  duration: '1 minute (concentration)',
  save: 'WIS save each turn to end',
  effects: [
    'Speed halved',
    '-2 AC',
    '-2 DEX saves',
    'Can\'t use reactions',
    'Can only use action OR bonus action, not both',
    'Casting a spell with 1 action has 50% chance of being delayed to next turn',
  ],
  classes: ['Sorcerer', 'Wizard'],
};

export const SLOW_VS_HASTE = {
  comparison: [
    { category: 'Targets', haste: '1 ally', slow: 'Up to 6 enemies (40ft cube)', verdict: 'Slow' },
    { category: 'Offensive value', haste: '+1 attack/round', slow: 'Halves enemy action economy', verdict: 'Slow' },
    { category: 'Defensive value', haste: '+2 AC, ADV DEX saves', slow: '-2 AC, -2 DEX saves on enemies', verdict: 'Similar' },
    { category: 'Risk', haste: 'Lethargy stuns ally on drop', slow: 'No downside if dropped', verdict: 'Slow' },
    { category: 'Reliability', haste: 'Guaranteed (willing target)', slow: 'WIS save each turn to end', verdict: 'Haste' },
    { category: 'Caster shutdown', haste: 'None', slow: '50% chance to waste spell', verdict: 'Slow' },
  ],
  verdict: 'Slow is generally better in optimization terms. Haste feels better. Slow is mathematically superior against groups.',
};

export const TWINNED_HASTE = {
  description: 'Sorcerer Metamagic: Twin Spell on Haste. Costs 3 sorcery points.',
  benefit: 'Haste TWO allies at once for one concentration slot.',
  risk: 'If concentration drops, BOTH allies are stunned for a round. Catastrophic.',
  verdict: 'High risk, high reward. Only if you\'re confident in your concentration saves.',
  protections: ['War Caster', 'Resilient (CON)', 'Lucky', 'Ring of Protection', 'Cover'],
};

export function hasteValue(targetClass) {
  const target = HASTE_BEST_TARGETS.find(t =>
    t.target.toLowerCase().includes((targetClass || '').toLowerCase())
  );
  return target || { target: targetClass, reason: 'Moderate benefit from extra action and AC.', rating: 'B' };
}

export function shouldHasteOrSlow(allyCount, enemyCount, enemyCasters) {
  if (enemyCount >= 3) return { spell: 'Slow', reason: `Affects ${enemyCount} enemies. Action economy devastation.` };
  if (enemyCasters) return { spell: 'Slow', reason: '50% spell failure shuts down enemy casters.' };
  if (allyCount === 1) return { spell: 'Haste', reason: 'Single ally buff is more reliable than Slow on few enemies.' };
  return { spell: 'Slow', reason: 'Generally better value. No lethargy risk.' };
}
