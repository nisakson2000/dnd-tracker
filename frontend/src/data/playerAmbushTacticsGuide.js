/**
 * playerAmbushTacticsGuide.js
 * Player Mode: Surprise and ambush — rules and optimization
 * Pure JS — no React dependencies.
 */

export const SURPRISE_RULES = {
  check: 'Group Stealth vs each target\'s passive Perception.',
  effect: 'Surprised: can\'t move, act, or react on first turn.',
  notARound: 'No "surprise round." Condition only.',
  reactions: 'Regain reactions at end of first turn.',
};

export const SURPRISE_METHODS = [
  { method: 'Pass without Trace (+10)', rating: 'S+', note: 'Best tool for surprise.' },
  { method: 'Invisibility', rating: 'S', note: 'Likely auto-success Stealth.' },
  { method: 'High party Stealth', rating: 'A+', note: 'Everyone proficient.' },
  { method: 'Ambush from cover', rating: 'A', note: 'Natural advantage.' },
];

export const EXPLOITERS = [
  { feature: 'Assassinate (Assassin)', effect: 'Advantage + auto-crit vs surprised.' },
  { feature: 'Dread Ambusher (Gloom Stalker)', effect: 'Extra attack + 1d8 round 1.' },
  { feature: 'Surprise Attack (Bugbear)', effect: '+2d6 vs surprised.' },
  { feature: 'Alert feat', effect: 'Immune to surprise. +5 initiative.' },
];

export const AMBUSH_TIPS = [
  'No surprise round. Surprised is a condition.',
  'One loud party member ruins it.',
  'Pass without Trace is essential.',
  'Alert feat = immunity.',
  'Assassin needs surprise for auto-crit. Hard to get.',
];
