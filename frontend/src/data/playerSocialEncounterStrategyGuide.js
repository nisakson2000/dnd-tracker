/**
 * playerSocialEncounterStrategyGuide.js
 * Player Mode: Social encounter structure, skill use, and optimization
 * Pure JS — no React dependencies.
 */

export const SOCIAL_SKILLS_DETAILED = [
  {
    skill: 'Persuasion',
    ability: 'CHA',
    use: 'Convince through logic, charm, or appeal. Non-deceptive influence.',
    examples: ['Negotiate a better price', 'Convince a guard to let you pass', 'Rally troops', 'Make a case in court'],
    rating: 'S+',
    note: 'Most commonly used social skill. The "default" face skill.',
  },
  {
    skill: 'Deception',
    ability: 'CHA',
    use: 'Lie, mislead, create false impressions. Contested by Insight.',
    examples: ['Bluff past a guard', 'Disguise your identity', 'Forge a document (with Forgery Kit)', 'Plant false information'],
    rating: 'S',
    note: 'Essential for infiltration. Contested by Insight, not a flat DC.',
  },
  {
    skill: 'Intimidation',
    ability: 'CHA (or STR at DM discretion)',
    use: 'Coerce through threats, displays of power, or force of personality.',
    examples: ['Threaten a prisoner for information', 'Cow a crowd into submission', 'Assert dominance in negotiation'],
    rating: 'A+',
    note: 'Works fast but creates enemies. NPCs comply out of fear, not loyalty.',
  },
  {
    skill: 'Insight',
    ability: 'WIS',
    use: 'Read body language, detect lies, understand true motivations.',
    examples: ['Detect if someone is lying', 'Read an NPC\'s emotional state', 'Sense hidden agenda', 'Judge trustworthiness'],
    rating: 'S',
    note: 'Defensive social skill. Contested vs Deception. Crucial for intrigue.',
  },
  {
    skill: 'Performance',
    ability: 'CHA',
    use: 'Entertain, distract, or impress through artistic expression.',
    examples: ['Play music at a tavern', 'Create a distraction', 'Impress nobles at court', 'Deliver a rousing speech'],
    rating: 'B+',
    note: 'Niche but powerful for Bards. Distractions can enable other party actions.',
  },
];

export const NPC_DISPOSITION_LEVELS = [
  { disposition: 'Hostile', dc: '20+', description: 'Actively wants to harm or hinder you.', approach: 'Don\'t push. Avoid Intimidation (makes it worse). Try to shift to Indifferent first.' },
  { disposition: 'Unfriendly', dc: '15-20', description: 'Dislikes you but not aggressive.', approach: 'Appeal to self-interest. Offer something they want. Avoid demands.' },
  { disposition: 'Indifferent', dc: '10-15', description: 'No strong feelings. Default for strangers.', approach: 'Standard Persuasion. Fair trades. Be polite. Most common starting point.' },
  { disposition: 'Friendly', dc: '5-10', description: 'Likes you. Willing to help within reason.', approach: 'Simple requests succeed easily. Don\'t abuse goodwill.' },
  { disposition: 'Allied', dc: '0-5', description: 'Loyal. Will take risks for you.', approach: 'Will help even at cost to themselves. Built through sustained interaction.' },
];

export const SOCIAL_ENCOUNTER_STRUCTURE = [
  { phase: 'Read the Room', detail: 'Insight check to gauge NPC disposition. Perception for environmental context.', tip: 'Always Insight before you Persuade. Know your starting point.' },
  { phase: 'Establish Common Ground', detail: 'Find shared interests, enemies, or goals. Information = leverage.', tip: 'History, Religion, or Nature checks may reveal NPC background you can reference.' },
  { phase: 'Make Your Case', detail: 'Persuasion, Deception, or Intimidation based on approach. Present evidence.', tip: 'Roleplay your argument. Good RP may lower the DC or grant advantage.' },
  { phase: 'Handle Objections', detail: 'NPC may push back. Additional checks or concessions needed.', tip: 'Don\'t repeat the same argument. Adapt based on NPC response.' },
  { phase: 'Close the Deal', detail: 'Final check if needed. Establish terms. Both sides agree.', tip: 'Get specifics. "I\'ll help you" is vague. "I\'ll give you the key at midnight" is concrete.' },
];

export const SOCIAL_SPELLS_RANKED = [
  { spell: 'Charm Person', level: 1, effect: 'Target regards you as friendly. Knows it was charmed after.', rating: 'A' },
  { spell: 'Suggestion', level: 2, effect: 'Suggest a course of action. Must sound reasonable.', rating: 'S' },
  { spell: 'Zone of Truth', level: 2, effect: 'Creatures can\'t lie. They know the effect.', rating: 'A+' },
  { spell: 'Detect Thoughts', level: 2, effect: 'Read surface thoughts. Deeper probe: WIS save.', rating: 'S' },
  { spell: 'Tongues', level: 3, effect: 'Understand and speak any language.', rating: 'A' },
  { spell: 'Modify Memory', level: 5, effect: 'Change up to 10 minutes of memory.', rating: 'S+' },
  { spell: 'Dominate Person', level: 5, effect: 'Total control. WIS save. Concentration.', rating: 'S' },
  { spell: 'Geas', level: 5, effect: 'Command to follow for 30 days or take 5d10 psychic.', rating: 'A' },
  { spell: 'Glibness', level: 8, effect: 'CHA checks minimum 15 on the die. 8 hours.', rating: 'S+' },
];

export const SOCIAL_ENCOUNTER_TIPS = [
  'Let the highest-CHA character be the face. Others use Help action (advantage).',
  'Insight BEFORE Persuasion. Know the NPC\'s disposition first.',
  'Intimidation works fast but burns bridges. Use for one-time encounters.',
  'Deception is risky. If caught, disposition drops to Hostile.',
  'Bribery works. Most NPCs have a price. Gold bypasses Persuasion checks.',
  'Don\'t roll for everything. Good roleplay can skip the check entirely.',
  'Nat 20 on Persuasion doesn\'t mean the king gives you his throne.',
  'Zone of Truth: target can stay silent. Pair with Intimidation for interrogation.',
  'Detect Thoughts during conversation gives you an enormous advantage.',
  'Eloquence Bard: Unsettling Words (BA) → subtract BI die from save → Suggestion.',
  'Friends cantrip: advantage on CHA check, but NPC becomes hostile after.',
];
