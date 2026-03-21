/**
 * playerSkillExpertise.js
 * Player Mode: Expertise and skill optimization guide
 * Pure JS — no React dependencies.
 */

export const EXPERTISE_SOURCES = [
  { source: 'Rogue (1st, 6th)', skills: 2, note: 'Two skills at 1st, two more at 6th. Total 4 Expertise.' },
  { source: 'Bard (3rd, 10th)', skills: 2, note: 'Two skills at 3rd, two more at 10th. Total 4 Expertise.' },
  { source: 'Knowledge Cleric (1st)', skills: 2, note: 'Two skills from Arcana, History, Nature, Religion.' },
  { source: 'Skill Expert Feat', skills: 1, note: 'One Expertise + one new proficiency + ASI.' },
  { source: 'Prodigy Feat (half-races)', skills: 1, note: 'Human, half-elf, or half-orc only. One Expertise.' },
  { source: 'Ranger (Deft Explorer)', skills: 1, note: 'One Expertise at 1st level (if using optional features).' },
];

export const BEST_EXPERTISE_PICKS = [
  { skill: 'Perception', why: 'Most rolled skill in the game. Detect traps, enemies, secrets.', priority: 'S' },
  { skill: 'Stealth', why: 'Critical for scouting, ambushes, and avoiding encounters.', priority: 'S' },
  { skill: 'Athletics', why: 'Grappling, shoving, climbing. Only STR skill. Important for grapplers.', priority: 'A' },
  { skill: 'Persuasion', why: 'Most important social skill. Better prices, allies, information.', priority: 'A' },
  { skill: 'Thieves\' Tools', why: 'Not a skill but can take Expertise. Open locks, disarm traps.', priority: 'A' },
  { skill: 'Deception', why: 'Lying, disguises, bluffing. The face\'s offensive skill.', priority: 'B' },
  { skill: 'Investigation', why: 'Find hidden things, analyze clues. Pairs with Perception.', priority: 'B' },
  { skill: 'Insight', why: 'Detect lies and read motives. Social encounters.', priority: 'B' },
  { skill: 'Acrobatics', why: 'Escape grapples (DEX alternative to Athletics). Balance checks.', priority: 'C' },
];

export const RELIABLE_TALENT = {
  class: 'Rogue (11th)',
  effect: 'Any proficient ability check that rolls below 10 counts as 10.',
  impact: 'With Expertise + Reliable Talent, your minimum roll is 10 + proficiency×2 + ability mod.',
  example: 'Level 11 Rogue, +5 DEX, Stealth Expertise: minimum Stealth check = 10 + 8 + 5 = 23.',
  note: 'This makes Rogues the best at skills in the entire game. Impossible to fail easy/medium checks.',
};

export function calculateSkillBonus(abilityMod, profBonus, hasExpertise, isProficient) {
  if (!isProficient) return abilityMod;
  const prof = hasExpertise ? profBonus * 2 : profBonus;
  return abilityMod + prof;
}

export function getMinRoll(abilityMod, profBonus, hasExpertise, hasReliableTalent) {
  const bonus = calculateSkillBonus(abilityMod, profBonus, hasExpertise, true);
  const minD20 = hasReliableTalent ? 10 : 1;
  return minD20 + bonus;
}
