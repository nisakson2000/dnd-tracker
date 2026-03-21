/**
 * playerProficiencyBonus.js
 * Player Mode: Proficiency bonus by level and where it applies
 * Pure JS — no React dependencies.
 */

export const PROFICIENCY_BY_LEVEL = [
  { level: 1, bonus: 2 },
  { level: 5, bonus: 3 },
  { level: 9, bonus: 4 },
  { level: 13, bonus: 5 },
  { level: 17, bonus: 6 },
];

export const PROFICIENCY_APPLIES = [
  'Attack rolls with proficient weapons.',
  'Saving throws you\'re proficient in.',
  'Ability checks with proficient skills.',
  'Ability checks with proficient tools.',
  'Spell save DC (8 + proficiency + ability mod).',
  'Spell attack modifier (proficiency + ability mod).',
  'Passive Perception/Investigation/Insight.',
  'Ki save DC (Monk).',
  'Channel Divinity save DC.',
  'Any class feature that says "add your proficiency bonus".',
];

export const EXPERTISE_RULES = {
  description: 'Double proficiency bonus for chosen skills/tools.',
  classes: [
    { class: 'Rogue', level: 1, count: 2, additional: 'Two more at 6th level.' },
    { class: 'Bard', level: 3, count: 2, additional: 'Two more at 10th level (Jack of All Trades gives half prof to non-proficient at 2nd).' },
    { class: 'Ranger (Deft Explorer)', level: 1, count: 1, additional: 'One more at 6th and 10th level.' },
  ],
  feat: 'Skill Expert feat: +1 ability score, one skill proficiency, one expertise.',
};

export function getProficiencyBonus(level) {
  for (let i = PROFICIENCY_BY_LEVEL.length - 1; i >= 0; i--) {
    if (level >= PROFICIENCY_BY_LEVEL[i].level) return PROFICIENCY_BY_LEVEL[i].bonus;
  }
  return 2;
}

export function getSkillModifier(abilityScore, level, isProficient, hasExpertise = false) {
  const abilityMod = Math.floor((abilityScore - 10) / 2);
  const prof = getProficiencyBonus(level);
  if (hasExpertise) return abilityMod + (prof * 2);
  if (isProficient) return abilityMod + prof;
  return abilityMod;
}

export function getJackOfAllTrades(abilityScore, level) {
  const abilityMod = Math.floor((abilityScore - 10) / 2);
  const halfProf = Math.floor(getProficiencyBonus(level) / 2);
  return abilityMod + halfProf;
}
