/**
 * playerSpellSlotRecoveryGuide.js
 * Player Mode: Spell slot recovery features — all classes compared
 * Pure JS — no React dependencies.
 */

export const SPELL_RECOVERY_FEATURES = [
  { feature: 'Arcane Recovery', class: 'Wizard', timing: 'SR (once/day)', amount: 'Half Wizard level in slots (rounded up). Max L5.', rating: 'S' },
  { feature: 'Natural Recovery', class: 'Land Druid', timing: 'SR (once/day)', amount: 'Half Druid level in slots.', rating: 'A+' },
  { feature: 'Pact Magic', class: 'Warlock', timing: 'Short rest', amount: 'ALL slots recover.', rating: 'S' },
  { feature: 'Font of Magic', class: 'Sorcerer', timing: 'BA', amount: 'SP↔slots conversion.', rating: 'A' },
  { feature: 'Harness Divine Power', class: 'Cleric/Paladin', timing: 'CD use', amount: 'One slot = half PB (rounded up).', rating: 'A' },
  { feature: 'Spell Mastery', class: 'Wizard L18', timing: 'At will', amount: 'One L1 + one L2 spell at will.', rating: 'S' },
];

export const RECOVERY_TIPS = [
  'Wizards: use Arcane Recovery on your first SR every day.',
  'Recover highest slot possible. One L5 > two L2.',
  'Warlocks: push for SRs. Each one = full slot reset.',
  'Sorcerers: burn low slots to SP early, spend on Metamagic.',
  'Don\'t forget these features exist. Free resources.',
];

export const SP_CONVERSION_TABLE = [
  { slot: 1, costToCreate: 2, spWhenBurned: 1 },
  { slot: 2, costToCreate: 3, spWhenBurned: 2 },
  { slot: 3, costToCreate: 5, spWhenBurned: 3 },
  { slot: 4, costToCreate: 6, spWhenBurned: 4 },
  { slot: 5, costToCreate: 7, spWhenBurned: 5 },
];
