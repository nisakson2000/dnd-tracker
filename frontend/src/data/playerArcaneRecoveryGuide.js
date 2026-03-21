/**
 * playerArcaneRecoveryGuide.js
 * Player Mode: Class-specific resource recovery optimization
 * Pure JS — no React dependencies.
 */

export const RESOURCE_RECOVERY = [
  { class: 'Wizard', feature: 'Arcane Recovery', recharge: 'Short Rest (1/day)', amount: 'Recover slots totaling up to half wizard level (rounded up). No 6th+ slots.', tip: 'Always use this. Free spell slots. Recover your highest-level slots first.' },
  { class: 'Druid (Land)', feature: 'Natural Recovery', recharge: 'Short Rest (1/day)', amount: 'Same as Arcane Recovery — half druid level in slot levels.', tip: 'Identical to Arcane Recovery but for Land Druids only.' },
  { class: 'Sorcerer', feature: 'Font of Magic', recharge: 'Long Rest (Sorcery Points)', amount: 'Convert sorcery points to spell slots or vice versa.', tip: 'Before a long rest, convert unused spell slots into sorcery points (they carry over).' },
  { class: 'Warlock', feature: 'Pact Magic', recharge: 'Short Rest', amount: 'ALL Warlock spell slots recover on short rest.', tip: 'Push for short rests. You benefit more than anyone. 2 short rests = triple your slots.' },
  { class: 'Fighter', feature: 'Second Wind + Action Surge', recharge: 'Short Rest', amount: 'Second Wind: 1d10 + level HP. Action Surge: extra action.', tip: 'Both reset on short rest. Use them freely.' },
  { class: 'Monk', feature: 'Ki Points', recharge: 'Short Rest', amount: 'ALL Ki points recover on short rest.', tip: 'Spend Ki liberally. Short rest = full Ki reset.' },
  { class: 'Bard', feature: 'Bardic Inspiration', recharge: 'Short Rest (level 5+) / Long Rest (before)', amount: 'All Bardic Inspiration dice recover.', tip: 'Before level 5, ration your inspiration dice. After 5, hand them out freely.' },
  { class: 'Cleric', feature: 'Channel Divinity', recharge: 'Short Rest', amount: '1 use (2 at level 6, 3 at level 18).', tip: 'Turn Undead on short rest is excellent. Don\'t save it.' },
  { class: 'Paladin', feature: 'Channel Divinity', recharge: 'Short Rest', amount: '1 use.', tip: 'Sacred Weapon or other oath feature. Recovers on short rest.' },
  { class: 'Barbarian', feature: 'Rage', recharge: 'Long Rest', amount: 'Rages per day increase with level (2 at 1, up to unlimited at 20).', tip: 'Rages only recover on long rest. Budget them carefully in multi-fight days.' },
];

export const SHORT_REST_PRIORITY = [
  { priority: 1, class: 'Warlock', reason: 'Gets ALL spell slots back. Biggest beneficiary.' },
  { priority: 2, class: 'Monk', reason: 'All Ki points back. Stunning Strike available again.' },
  { priority: 3, class: 'Fighter', reason: 'Action Surge + Second Wind + Superiority Dice (if Battle Master).' },
  { priority: 4, class: 'Bard (5+)', reason: 'All Bardic Inspiration dice recover.' },
  { priority: 5, class: 'Cleric', reason: 'Channel Divinity recovers.' },
  { priority: 6, class: 'Wizard', reason: 'Arcane Recovery (1/day). Plus Hit Dice healing.' },
  { priority: 7, class: 'Everyone', reason: 'Hit Dice healing. Always valuable.' },
];

export const REST_NEGOTIATION = [
  'Warlocks and Monks should advocate for short rests — they benefit most.',
  'After 2 fights without resting, a short rest is almost always worth it.',
  'If the Wizard hasn\'t used Arcane Recovery, push for a short rest.',
  'Fighters with 0 Action Surges NEED a short rest before a boss fight.',
  'If more than half the party is below 50% HP, rest unless time-critical.',
  'A dungeon typically allows 2 short rests and 1 long rest per adventuring day.',
];

export function getRecovery(className) {
  return RESOURCE_RECOVERY.find(r =>
    r.class.toLowerCase().includes((className || '').toLowerCase())
  ) || null;
}

export function shouldShortRest(partyClasses, partyHpPercent) {
  const highPriorityClasses = ['Warlock', 'Monk', 'Fighter'];
  const hasHighPriority = partyClasses.some(c =>
    highPriorityClasses.some(hp => c.toLowerCase().includes(hp.toLowerCase()))
  );
  return hasHighPriority || partyHpPercent < 50;
}
