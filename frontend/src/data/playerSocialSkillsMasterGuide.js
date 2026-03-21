/**
 * playerSocialSkillsMasterGuide.js
 * Player Mode: Social encounters — persuasion, deception, negotiation
 * Pure JS — no React dependencies.
 */

export const SOCIAL_SKILLS = [
  { skill: 'Persuasion (CHA)', when: 'Honest convincing, negotiation, diplomacy', note: 'Most common social skill.' },
  { skill: 'Deception (CHA)', when: 'Lying, misleading, disguises', note: 'Requires believable cover story.' },
  { skill: 'Intimidation (CHA/STR)', when: 'Threatening, coercing, demanding', note: 'Some DMs allow STR-based.' },
  { skill: 'Insight (WIS)', when: 'Detecting lies, reading motives', note: 'Defensive social skill.' },
  { skill: 'Performance (CHA)', when: 'Entertaining, distracting, earning money', note: 'Bard specialty.' },
];

export const SOCIAL_SPELLS = [
  { spell: 'Charm Person (L1)', effect: 'Friendly acquaintance. Advantage on CHA checks.', risk: 'They know afterward.', rating: 'A' },
  { spell: 'Suggestion (L2)', effect: 'Suggest reasonable action. They comply.', risk: 'Must be "reasonable."', rating: 'S' },
  { spell: 'Zone of Truth (L2)', effect: 'Can\'t lie in area (WIS save).', risk: 'Can be evasive.', rating: 'A+' },
  { spell: 'Detect Thoughts (L2)', effect: 'Read surface thoughts. Probe deeper with WIS save.', rating: 'A+' },
  { spell: 'Modify Memory (L5)', effect: 'Change 10 min of memory.', risk: 'Discover = regain original.', rating: 'S' },
  { spell: 'Friends (cantrip)', effect: 'Advantage on CHA for 1 min.', risk: 'Target goes hostile after.', rating: 'C' },
];

export const SOCIAL_TACTICS = [
  { tactic: 'Good cop / bad cop', detail: 'One intimidates, another persuades. Classic.', rating: 'A+' },
  { tactic: 'Intel first', detail: 'Learn what NPC wants before negotiating.', rating: 'S' },
  { tactic: 'Let the face lead', detail: 'Bard with +12 should talk. Help action for advantage.', rating: 'S' },
  { tactic: 'Subtle Spell + Suggestion', detail: 'No one sees you cast. NPC just agrees.', rating: 'S' },
  { tactic: 'Offer incentives', detail: 'Give them a reason beyond "please."', rating: 'S' },
];

export const NPC_DISPOSITION = {
  hostile: { dc: '20-25', note: 'They want to harm you. Very hard to persuade.' },
  unfriendly: { dc: '15-20', note: 'Don\'t like you. Need leverage.' },
  indifferent: { dc: '10-15', note: 'Don\'t care. Easiest to sway with incentives.' },
  friendly: { dc: '5-10', note: 'They like you. Simple requests succeed.' },
};

export const SOCIAL_MISTAKES = [
  'Rolling Persuasion for impossible requests.',
  'Intimidating NPCs more powerful than you.',
  'Charm Person in public — witnesses report you.',
  'Everyone rolling the same check — let the expert handle it.',
  'Forgetting NPCs have their own goals and motivations.',
];
