/**
 * playerSkillCheckMasteryGuide.js
 * Player Mode: Skill checks — when to roll, how to boost, and creative uses
 * Pure JS — no React dependencies.
 */

export const SKILL_CHECK_BASICS = {
  formula: 'd20 + ability modifier + proficiency bonus (if proficient) + bonuses.',
  expertise: 'Double proficiency bonus. Rogues, Bards, some feats.',
  advantage: 'Roll 2d20, take higher. ~+3.5 average.',
  passiveCheck: '10 + all modifiers. Perception, Insight, sometimes Investigation.',
  helpAction: 'One creature helps = advantage on next check.',
};

export const ALL_SKILLS_RANKED = [
  { skill: 'Perception', ability: 'WIS', frequency: 'Very High', rating: 'S+', note: 'Most rolled skill. Take it if you can.' },
  { skill: 'Persuasion', ability: 'CHA', frequency: 'Very High', rating: 'S+', note: 'Default social skill. Every party needs a face.' },
  { skill: 'Stealth', ability: 'DEX', frequency: 'High', rating: 'S', note: 'Scouting, ambushes, avoiding encounters.' },
  { skill: 'Insight', ability: 'WIS', frequency: 'High', rating: 'S', note: 'Detect lies, read motives. Defensive social skill.' },
  { skill: 'Investigation', ability: 'INT', frequency: 'High', rating: 'A+', note: 'Find clues by logic. Traps, puzzles, mysteries.' },
  { skill: 'Athletics', ability: 'STR', frequency: 'High', rating: 'A+', note: 'Grapple, shove, climb, swim. Combat relevant.' },
  { skill: 'Deception', ability: 'CHA', frequency: 'High', rating: 'S', note: 'Lying, disguises, infiltration.' },
  { skill: 'Arcana', ability: 'INT', frequency: 'Medium', rating: 'A', note: 'Identify magic, know magical lore.' },
  { skill: 'Intimidation', ability: 'CHA', frequency: 'Medium', rating: 'A+', note: 'Coerce through threats.' },
  { skill: 'Acrobatics', ability: 'DEX', frequency: 'Medium', rating: 'B+', note: 'Balance, escape grapple alternative.' },
  { skill: 'History', ability: 'INT', frequency: 'Medium', rating: 'B+', note: 'Historical knowledge, artifacts.' },
  { skill: 'Religion', ability: 'INT', frequency: 'Medium', rating: 'B+', note: 'Deities, rites, undead lore.' },
  { skill: 'Medicine', ability: 'WIS', frequency: 'Low', rating: 'B', note: 'Stabilize dying (DC 10).' },
  { skill: 'Sleight of Hand', ability: 'DEX', frequency: 'Low', rating: 'B+', note: 'Pickpocket, palm objects.' },
  { skill: 'Nature', ability: 'INT', frequency: 'Low', rating: 'B', note: 'Terrain, weather, flora/fauna.' },
  { skill: 'Survival', ability: 'WIS', frequency: 'Low', rating: 'B', note: 'Track, navigate, forage.' },
  { skill: 'Performance', ability: 'CHA', frequency: 'Low', rating: 'B', note: 'Entertain, distract.' },
  { skill: 'Animal Handling', ability: 'WIS', frequency: 'Low', rating: 'C+', note: 'Calm animals, control mounts.' },
];

export const SKILL_BOOSTERS = [
  { method: 'Guidance', bonus: '+1d4', rating: 'S+', note: 'Best cantrip. Any ability check.' },
  { method: 'Expertise', bonus: '×2 PB', rating: 'S+', note: 'Doubles proficiency. Up to +12.' },
  { method: 'Bardic Inspiration', bonus: '+1d6 to 1d12', rating: 'S', note: 'Any ability check.' },
  { method: 'Enhance Ability', bonus: 'Advantage', rating: 'A+', note: 'All checks of one ability. 1 hour.' },
  { method: 'Pass Without Trace', bonus: '+10 Stealth', rating: 'S+', note: 'Entire party. Incredible.' },
  { method: 'Reliable Talent', bonus: 'Min 10 on d20', rating: 'S++', note: 'Rogue L11. Can\'t fail easy checks.' },
  { method: 'Glibness', bonus: 'Min 15 on CHA', rating: 'S+', note: 'Bard L8. CHA checks auto-succeed.' },
];

export const SKILL_CHECK_TIPS = [
  'Perception is the most-rolled skill. Always take it if possible.',
  'Guidance is the best cantrip. +1d4 on every out-of-combat check.',
  'Help action: one person assists = advantage. Great teamwork.',
  'Investigation finds by LOGIC. Perception finds by SENSES.',
  'Athletics: grapple + shove. Critical combat skill.',
  'Don\'t ask to roll. Describe what you do. DM decides if you roll.',
  'Take tool proficiencies that overlap with skills for advantage (Xanathar\'s).',
  'Expertise in Stealth + Pass Without Trace = +17 Stealth at L5.',
];
