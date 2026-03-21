/**
 * playerSkillCheckOptimizationGuide.js
 * Player Mode: Maximizing skill check success rates
 * Pure JS — no React dependencies.
 */

export const SKILL_CHECK_BASICS = {
  formula: 'd20 + ability modifier + proficiency bonus (if proficient) + other bonuses',
  dc: { 5: 'Very Easy', 10: 'Easy', 15: 'Medium', 20: 'Hard', 25: 'Very Hard', 30: 'Nearly Impossible' },
  note: 'Most checks are DC 10-15. At +5 to +10, you pass these reliably. At +15+, you\'re near-guaranteed.',
};

export const SKILL_BOOSTERS = [
  { source: 'Proficiency', bonus: '+2 to +6 (by level)', note: 'Base requirement. Be proficient in skills you use often.', rating: 'A+' },
  { source: 'Expertise (double PB)', bonus: '+4 to +12', note: 'Rogues, Bards, Skill Expert feat. Double proficiency.', rating: 'S' },
  { source: 'Guidance (cantrip)', bonus: '+1d4', note: 'Cleric/Druid/Artificer. Cast before any check. Free +2.5 average.', rating: 'S' },
  { source: 'Enhance Ability (L2)', bonus: 'Advantage', note: 'Pick a stat = advantage on all checks with that stat. Concentration.', rating: 'A+' },
  { source: 'Bardic Inspiration', bonus: '+1d6 to +1d12', note: 'Given by Bard. Use on any check. Scales with Bard level.', rating: 'S' },
  { source: 'Flash of Genius (Artificer)', bonus: '+INT mod', note: 'Reaction. +3 to +5 on any check within 30ft.', rating: 'A+' },
  { source: 'Emboldening Bond (Peace Cleric)', bonus: '+1d4', note: 'Like Guidance but for up to PB creatures, 10 minutes.', rating: 'S' },
  { source: 'Pass Without Trace (L2)', bonus: '+10 Stealth', note: 'Entire party. +10 is enormous. Makes heavy armor stealthy.', rating: 'S' },
  { source: 'Glibness (L8)', bonus: 'Minimum 15 on CHA checks', note: 'Can\'t roll below 15. Auto-pass DC 15. Bard/Warlock.', rating: 'S' },
  { source: 'Reliable Talent (Rogue 11)', bonus: 'Minimum 10 on proficient checks', note: 'Can\'t roll below 10. With +11: minimum result is 21.', rating: 'S+' },
];

export const MAX_SKILL_BUILDS = {
  stealth: {
    build: 'Rogue with Expertise + Pass Without Trace',
    math: '10 (Reliable Talent) + 5 (DEX) + 12 (Expertise at L17) + 10 (PwT) = 37 minimum',
    note: 'Minimum 37 Stealth. Nothing detects you passively.',
  },
  persuasion: {
    build: 'Eloquence Bard with Expertise + Glibness',
    math: '15 (Glibness minimum) + 5 (CHA) + 12 (Expertise at L17) = 32 minimum. Silver Tongue: min 10 on Persuasion/Deception.',
    note: 'Minimum 32. You convince kings and gods.',
  },
  athletics: {
    build: 'Barbarian with Expertise (Skill Expert) + Rage + Enhance Ability',
    math: 'd20 (advantage from Rage+Enhance) + 5 (STR) + 12 (Expertise) = average ~28',
    note: 'Advantage + Expertise. Grapple/shove nearly guaranteed.',
  },
  perception: {
    build: 'Rogue/Cleric with Expertise + Observant + Reliable Talent',
    math: '10 (RT) + 5 (WIS) + 12 (Expertise) + 5 (Observant passive) = 27 passive, 27+ active minimum',
    note: 'Nothing sneaks past you. 32 passive Perception.',
  },
};

export const HELP_ACTION_FOR_SKILLS = {
  rule: 'One ally can Help you, granting advantage on the check.',
  requirement: 'The helper must be proficient in the skill OR the DM must agree they can help.',
  note: 'Advantage on a check = approximately +5. Always ask for Help when possible.',
  mastermind: 'Mastermind Rogue: Help as BA from 30 feet. Free advantage every round.',
};

export const PASSIVE_CHECKS = {
  formula: '10 + all modifiers that apply to the check',
  advantage: '+5 to passive check if you have advantage on that check type',
  disadvantage: '-5 to passive check',
  note: 'DMs use passive checks when you\'re not actively looking. Passive Perception is the most common.',
  observant: 'Observant feat: +5 to passive Perception AND passive Investigation.',
};

export const SKILL_CHECK_TIPS = [
  'Always ask for Guidance before skill checks. +1d4 is free.',
  'Bards: give Inspiration before risky checks, not after.',
  'Help action is often forgotten. Ask allies to help for advantage.',
  'Reliable Talent (Rogue 11) makes you the best skill monkey in the game.',
  'Expertise > proficiency > nothing. Prioritize Expertise in your most-used skill.',
  'Enhance Ability: ask for it before a series of checks (investigation montage, social encounter).',
  'Passive checks: stack bonuses for passive Perception. You don\'t have to actively look.',
];
