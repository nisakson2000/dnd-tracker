/**
 * playerDiplomacyGuide.js
 * Player Mode: Social interaction rules, persuasion, and NPC negotiation
 * Pure JS — no React dependencies.
 */

export const SOCIAL_SKILLS = [
  { skill: 'Persuasion', ability: 'CHA', use: 'Convince through logic/charm.', note: 'Best when offering something in return.' },
  { skill: 'Deception', ability: 'CHA', use: 'Lie convincingly.', note: 'Contested by Insight. Risky if caught.' },
  { skill: 'Intimidation', ability: 'CHA/STR', use: 'Threaten/coerce.', note: 'Quick results but makes enemies.' },
  { skill: 'Insight', ability: 'WIS', use: 'Read people. Detect lies.', note: 'Always Insight check important NPCs.' },
];

export const NPC_ATTITUDES = [
  { attitude: 'Hostile', dc: '20+', approach: 'Intimidation or avoid.' },
  { attitude: 'Unfriendly', dc: '15-20', approach: 'Find common ground. Offer something.' },
  { attitude: 'Indifferent', dc: '10-15', approach: 'Appeal to self-interest.' },
  { attitude: 'Friendly', dc: '5-10', approach: 'Just ask nicely.' },
];

export const SOCIAL_TACTICS = [
  { tactic: 'Know what they want', detail: 'Trade what they need.', rating: 'S' },
  { tactic: 'Good cop / bad cop', detail: 'Intimidate then offer reasonable deal.', rating: 'A' },
  { tactic: 'Help first', detail: 'Do a favor before asking yours.', rating: 'S' },
  { tactic: 'Bribe', detail: 'Guards: 5-50gp. Merchants: 10-100gp. Officials: 100+gp.', rating: 'A' },
  { tactic: 'Zone of Truth', detail: '2nd level. CHA save or can\'t lie.', rating: 'A' },
];

export const SOCIAL_SPELLS = [
  { spell: 'Charm Person (1st)', note: 'Advantage on CHA checks. Target knows after.' },
  { spell: 'Suggestion (2nd)', note: 'Reasonable action. Can\'t be harmful.' },
  { spell: 'Zone of Truth (2nd)', note: 'Can\'t lie in 15ft. Can stay silent.' },
  { spell: 'Tongues (3rd)', note: 'Speak any language 1 hour.' },
  { spell: 'Modify Memory (5th)', note: 'Change 10 min of memory. WIS save.' },
];

export function socialDC(attitude, difficulty) {
  const base = { hostile: 25, unfriendly: 20, indifferent: 15, friendly: 10 };
  const mod = { easy: -2, moderate: 0, hard: 3 };
  return (base[attitude] || 15) + (mod[difficulty] || 0);
}
