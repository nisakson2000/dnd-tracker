/**
 * playerSlotRecoveryGuide.js
 * Player Mode: Spell slot recovery methods — Arcane Recovery, Pact Magic, and more
 * Pure JS — no React dependencies.
 */

export const ARCANE_RECOVERY = {
  class: 'Wizard',
  uses: 'Once per day on SHORT REST.',
  amount: 'Recover slots ≤ half Wizard level (rounded up). No L6+.',
  examples: [
    { level: 4, recover: '2 levels', best: '1 × L2 or 2 × L1' },
    { level: 6, recover: '3 levels', best: '1 × L3' },
    { level: 10, recover: '5 levels', best: '1 × L5' },
    { level: 20, recover: '10 levels', best: '2 × L5' },
  ],
};

export const SLOT_RECOVERY_METHODS = [
  { feature: 'Pact Magic (Warlock)', recovery: 'ALL slots on SR.', rating: 'S+' },
  { feature: 'Arcane Recovery (Wizard)', recovery: 'Half level in slot levels. 1/day on SR.', rating: 'A+' },
  { feature: 'Natural Recovery (Land Druid)', recovery: 'Same as Arcane Recovery.', rating: 'A+' },
  { feature: 'Harness Divine Power (Cleric/Paladin)', recovery: 'Channel Divinity → slot (up to half PB level).', rating: 'A+' },
  { feature: 'Font of Magic (Sorcerer)', recovery: 'SP → slots. Expensive rate.', rating: 'A' },
  { feature: 'Pearl of Power (item)', recovery: '1 × L1-3 slot. 1/day.', rating: 'A+' },
];

export const RECOVERY_TIPS = [
  'Arcane Recovery: use on FIRST short rest. Don\'t waste it.',
  'Recover highest single slot available. L3 > 3×L1.',
  'Warlock: push for short rests. Full recovery.',
  'Harness Divine Power: convert unused CD to slots.',
  'Pearl of Power: free slot daily. Any caster.',
  'Don\'t forget Arcane Recovery. Most-wasted Wizard feature.',
  'No L6+ recovery. Only 1-5.',
  'Font of Magic: emergency slots only. Bad conversion rate.',
];
