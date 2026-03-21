/**
 * playerSocialRoleplayGuide.js
 * Player Mode: Social encounter tactics — persuasion, deception, and roleplay
 * Pure JS — no React dependencies.
 */

export const SOCIAL_SKILLS = [
  { skill: 'Persuasion (CHA)', use: 'Convince through logic, reason, or charm.', note: 'Most important social skill.' },
  { skill: 'Deception (CHA)', use: 'Lie convincingly. Disguise intentions.', note: 'Opposed by Insight.' },
  { skill: 'Intimidation (CHA/STR)', use: 'Threaten or coerce.', note: 'Some DMs allow STR-based.' },
  { skill: 'Insight (WIS)', use: 'Detect lies. Read intent.', note: 'Counter to Deception.' },
  { skill: 'Performance (CHA)', use: 'Entertain and distract.', note: 'Bard specialty.' },
];

export const SOCIAL_SPELLS_RANKED = [
  { spell: 'Suggestion', level: 2, rating: 'S+', note: 'Reasonable request. No memory of compulsion.' },
  { spell: 'Detect Thoughts', level: 2, rating: 'S', note: 'Read surface thoughts. Deep probe: they notice.' },
  { spell: 'Zone of Truth', level: 2, rating: 'A+', note: 'Can\'t lie. Can stay silent.' },
  { spell: 'Charm Person', level: 1, rating: 'A', note: 'Advantage on CHA checks. They know after.' },
  { spell: 'Modify Memory', level: 5, rating: 'S+', note: 'Change memories. Target doesn\'t know.' },
  { spell: 'Mass Suggestion', level: 6, rating: 'S+', note: '12 targets. 24 hours. No concentration.' },
  { spell: 'Glibness', level: 8, rating: 'S+', note: 'Minimum 15 on CHA checks for 1 hour.' },
];

export const SOCIAL_TACTICS = [
  { tactic: 'Good Cop / Bad Cop', method: 'Intimidate then persuade.', rating: 'A+' },
  { tactic: 'Intel First', method: 'Detect Thoughts before negotiating.', rating: 'S' },
  { tactic: 'Offer Value', method: 'Find NPC motivation. Offer what they want.', rating: 'S+' },
  { tactic: 'Subtle Suggestion', method: 'No components visible. NPC doesn\'t know.', rating: 'S+' },
  { tactic: 'Prove Honesty', method: 'Zone of Truth + willingly fail save.', rating: 'A+' },
  { tactic: 'Disguise + Deception', method: 'Disguise Self + impersonate authority.', rating: 'S' },
];

export const SOCIAL_TIPS = [
  'Persuasion works on NPCs, not players.',
  'Suggestion: "reasonable request" is key.',
  'Offer NPCs what they want. Gold, information, favors.',
  'Roleplay the argument. Don\'t just roll CHA.',
  'Subtle Spell: cast social spells undetected.',
  'Intimidation: short-term. Persuasion: long-term.',
  'Know when to walk away.',
];
