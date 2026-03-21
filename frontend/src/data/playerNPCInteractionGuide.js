/**
 * playerNPCInteractionGuide.js
 * Player Mode: NPC interaction — social skills, disposition, and persuasion
 * Pure JS — no React dependencies.
 */

export const NPC_DISPOSITION = {
  note: 'Most DMs track NPC attitude on a spectrum. Your approach shifts it.',
  levels: [
    { disposition: 'Hostile', dc: 'DC 20+ or impossible', behavior: 'Actively works against you. May attack.', shift: 'Very hard to change. May need magic or major favors.' },
    { disposition: 'Unfriendly', dc: 'DC 15-20', behavior: 'Unhelpful. Rude. Won\'t assist willingly.', shift: 'Possible with good roleplay + check. Bribes may work.' },
    { disposition: 'Indifferent', dc: 'DC 10-15', behavior: 'Default. Will help for fair compensation.', shift: 'Standard social checks. Most NPCs start here.' },
    { disposition: 'Friendly', dc: 'DC 5-10', behavior: 'Willing to help. Shares information freely.', shift: 'Easy asks succeed. Harder asks need checks.' },
    { disposition: 'Allied', dc: 'DC 0-5', behavior: 'Goes out of their way to help. Takes risks.', shift: 'Built through repeated positive interaction.' },
  ],
};

export const SOCIAL_SKILLS_GUIDE = [
  { skill: 'Persuasion', use: 'Convince through logic, reason, or appeal to interests.', example: '"The town needs your help. If we don\'t stop the bandits, your trade route dies."', note: 'Most commonly used social skill. Works when the NPC has a reason to agree.' },
  { skill: 'Deception', use: 'Lie, mislead, or create false impressions.', example: '"We\'re emissaries from the King. Open the gates."', note: 'Contested by Insight. If caught, disposition drops sharply.' },
  { skill: 'Intimidation', use: 'Threaten or coerce through fear.', example: '"Tell us where the hideout is, or we\'ll let the guards handle you."', note: 'Fast results but damages relationships. May backfire with powerful NPCs.' },
  { skill: 'Performance', use: 'Entertain, distract, or earn favor through art.', example: 'Play a song at the tavern to earn goodwill and information.', note: 'Niche but useful for Bards and social situations.' },
  { skill: 'Insight', use: 'Detect lies, read emotions, understand motives.', example: '"Is the merchant hiding something? I study his body language."', note: 'Defensive social skill. Contested by Deception.' },
];

export const SOCIAL_SPELLS_RANKED = [
  { spell: 'Suggestion', level: 2, rating: 'S', note: '"Reasonable" command for 8 hours. Incredibly versatile. WIS save.' },
  { spell: 'Charm Person', level: 1, rating: 'A+', note: 'Charmed: advantage on social checks. Target knows after.' },
  { spell: 'Zone of Truth', level: 2, rating: 'A+', note: 'Can\'t lie in area. CHA save. Can refuse to speak.' },
  { spell: 'Detect Thoughts', level: 2, rating: 'A+', note: 'Read surface thoughts. Probe deeper (WIS save). Incredible interrogation.' },
  { spell: 'Modify Memory', level: 5, rating: 'S', note: 'Rewrite 10 min of memory. Perfect crime. WIS save.' },
  { spell: 'Dominate Person', level: 5, rating: 'A+', note: 'Full control. Obvious magic. WIS save.' },
  { spell: 'Mass Suggestion', level: 6, rating: 'S+', note: '12 creatures. 24 hours. NO concentration. Insane.' },
  { spell: 'Disguise Self', level: 1, rating: 'A', note: 'Appear as anyone. Investigation to see through.' },
  { spell: 'Friends (cantrip)', level: 0, rating: 'C', note: 'Advantage on CHA checks for 1 min. Target knows and becomes hostile after.' },
  { spell: 'Subtle Spell + any enchantment', level: 'Meta', rating: 'S+', note: 'Cast without anyone seeing. Subtle Suggestion in court is devastating.' },
];

export const SOCIAL_TIPS = [
  'Roleplay the approach, then roll. Good roleplay may lower the DC.',
  'Know what the NPC wants. Appeal to their interests, not yours.',
  'Don\'t always roll Persuasion. Sometimes the right approach is Intimidation or Deception.',
  'Insight before Persuasion: learn what motivates them, then tailor your pitch.',
  'Bribes work. Gold is persuasive. Factor NPC wealth when choosing amounts.',
  'Don\'t threaten NPCs who are more powerful than you. Intimidation only works if credible.',
  'Zone of Truth + Insight: force truth-telling, then read what they\'re avoiding saying.',
  'Subtle Spell + Suggestion: cast in conversation without anyone knowing. Ultimate social tool.',
  'Charisma is not mind control. A Nat 20 Persuasion doesn\'t make the king give you his throne.',
];
