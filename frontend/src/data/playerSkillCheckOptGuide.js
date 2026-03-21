/**
 * playerSkillCheckOptGuide.js
 * Player Mode: Skill check optimization — expertise, advantage, and reliability
 * Pure JS — no React dependencies.
 */

export const SKILL_BOOSTERS = [
  { method: 'Expertise (2x PB)', sources: ['Rogue (L1, L6)', 'Bard (L3, L10)', 'Skill Expert feat', 'Knowledge Cleric (L1)', 'Ranger (Deft Explorer)'], bonus: '+4 to +12', rating: 'S+' },
  { method: 'Guidance (cantrip)', sources: ['Cleric', 'Druid', 'Artificer'], bonus: '+1d4 (avg +2.5)', rating: 'S+' },
  { method: 'Enhance Ability (L2)', sources: ['Many casters'], bonus: 'Advantage on checks', rating: 'S' },
  { method: 'Bardic Inspiration', sources: ['Bard'], bonus: '+1d6 to +1d12', rating: 'S' },
  { method: 'Flash of Genius', sources: ['Artificer L7'], bonus: '+INT mod (reaction)', rating: 'S' },
  { method: 'Reliable Talent', sources: ['Rogue L11'], bonus: 'Minimum 10 on d20', rating: 'S+ (best skill feature)' },
  { method: 'Jack of All Trades', sources: ['Bard L2'], bonus: '+half PB to non-proficient', rating: 'A+' },
  { method: 'Pass Without Trace', sources: ['Druid', 'Ranger'], bonus: '+10 Stealth (party)', rating: 'S+' },
];

export const SKILL_BY_ABILITY = {
  STR: [
    { skill: 'Athletics', uses: 'Climbing, swimming, grappling, jumping, shoving', note: 'Only STR skill. Crucial for grapple builds.' },
  ],
  DEX: [
    { skill: 'Acrobatics', uses: 'Balance, escape grapple (DEX alternative), tumbling', note: 'Alternative to Athletics for grapple escape.' },
    { skill: 'Sleight of Hand', uses: 'Pickpocket, plant items, fine manipulation', note: 'Rogue staple. Disable traps with Thieves\' Tools.' },
    { skill: 'Stealth', uses: 'Hiding, sneaking, ambush', note: 'Most checked skill in game. Disadvantage in heavy armor.' },
  ],
  INT: [
    { skill: 'Arcana', uses: 'Magic knowledge, identify spells, magical phenomena', note: 'Wizard primary. Identify magical effects.' },
    { skill: 'History', uses: 'Historical events, wars, civilizations, legends', note: 'Lore dumps. Bard/Wizard.' },
    { skill: 'Investigation', uses: 'Search for clues, deduce, find hidden things (active)', note: 'Active searching. Different from Perception.' },
    { skill: 'Nature', uses: 'Fauna, flora, weather, natural cycles', note: 'Druid/Ranger. Identify plants/animals.' },
    { skill: 'Religion', uses: 'Deities, rites, undead, fiends, celestials', note: 'Cleric/Paladin. Know your enemy.' },
  ],
  WIS: [
    { skill: 'Animal Handling', uses: 'Calm animals, mounted combat, tame beasts', note: 'Niche. Mounted builds.' },
    { skill: 'Insight', uses: 'Detect lies, read intentions, social awareness', note: 'Counter to Deception. Social pillar.' },
    { skill: 'Medicine', uses: 'Stabilize dying, diagnose illness, identify poisons', note: 'Rarely used with Healing Word existing.' },
    { skill: 'Perception', uses: 'Notice threats, spot hidden, hear sounds', note: 'MOST IMPORTANT skill. Take proficiency always.' },
    { skill: 'Survival', uses: 'Track, forage, navigate, avoid hazards', note: 'Ranger. Exploration pillar.' },
  ],
  CHA: [
    { skill: 'Deception', uses: 'Lie, disguise intentions, mislead', note: 'Social. Rogue/Bard/Warlock.' },
    { skill: 'Intimidation', uses: 'Threaten, coerce, frighten', note: 'Can use STR in some situations (DM ruling).' },
    { skill: 'Performance', uses: 'Entertain, distract, inspire', note: 'Bard. Niche but flavorful.' },
    { skill: 'Persuasion', uses: 'Convince, negotiate, diplomacy', note: 'Most important social skill. Face of party.' },
  ],
};

export const RELIABLE_TALENT_MATH = {
  feature: 'Rogue L11: Reliable Talent',
  effect: 'Any proficient skill check: treat d20 roll of 9 or below as 10.',
  withExpertise: 'Expertise + Reliable Talent: minimum result = 10 + (2 × PB) + ability mod.',
  examples: [
    { skill: 'Stealth (L11, DEX 20, Expertise)', minimum: '10 + 8 + 5 = 23', note: 'Can\'t roll below 23 on Stealth.' },
    { skill: 'Perception (L11, WIS 14, Proficient)', minimum: '10 + 4 + 2 = 16', note: 'Minimum 16 Perception check.' },
    { skill: 'Thieves\' Tools (L11, DEX 20, Expertise)', minimum: '10 + 8 + 5 = 23', note: 'Can\'t fail most locks (DC 15-20).' },
  ],
};

export const SKILL_TIPS = [
  'Perception: most checked skill. Everyone should have proficiency or good WIS.',
  'Stealth: whole party needs decent Stealth or one person ruins it for everyone.',
  'Guidance: +1d4 to any check. Cast it before EVERY skill check.',
  'Pass Without Trace: +10 Stealth to entire party. Auto-pass most Stealth DCs.',
  'Reliable Talent (Rogue 11): can\'t roll below 10. Expertise skills become guaranteed.',
  'Expertise > Proficiency. Expertise Stealth at L1 = +7 minimum.',
  'Investigation: ACTIVE search. Perception: PASSIVE notice. Know the difference.',
  'Enhance Ability: advantage = +3.5 average. Better than Guidance for important checks.',
  'Jack of All Trades (Bard): applies to initiative (it\'s a DEX check).',
  'Help action: give ally advantage on skill check. Use it.',
];
