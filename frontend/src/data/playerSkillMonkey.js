/**
 * playerSkillMonkey.js
 * Player Mode: Skill monkey builds and skill optimization strategies
 * Pure JS — no React dependencies.
 */

export const SKILL_MONKEY_CLASSES = [
  { class: 'Bard', skillsAtLevel1: 3, expertiseAt: [3, 10], jack: 'Jack of All Trades (level 2): +half proficiency to all non-proficient checks', maxProficiencies: '3 + 2 from background = 5 base', rating: 'S' },
  { class: 'Rogue', skillsAtLevel1: 4, expertiseAt: [1, 6], jack: 'Reliable Talent (level 11): minimum 10 on proficient checks', maxProficiencies: '4 + 2 from background = 6 base', rating: 'S' },
  { class: 'Ranger', skillsAtLevel1: 3, expertiseAt: [1, 6], jack: 'Deft Explorer variants give additional skills/expertise', maxProficiencies: '3 + 2 from background = 5 base', rating: 'A' },
  { class: 'Knowledge Cleric', skillsAtLevel1: 2, expertiseAt: [1], jack: 'Choose 2 from Arcana/History/Nature/Religion: gain proficiency AND expertise', maxProficiencies: '2 + 2 class + 2 domain = 6', rating: 'A' },
  { class: 'Scout Rogue', skillsAtLevel1: 4, expertiseAt: [1, 6], jack: 'Survivalist (level 3): free proficiency + expertise in Nature and Survival', maxProficiencies: '4 + 2 + 2 (Scout) = 8', rating: 'S' },
];

export const SKILL_BOOSTING_FEATS = [
  { feat: 'Skill Expert', benefit: '+1 to any ability, gain 1 proficiency and 1 expertise', note: 'Available to all classes. Best way to get expertise without multiclassing.' },
  { feat: 'Prodigy (Half-Elf/Human/Half-Orc)', benefit: '1 skill proficiency, 1 tool proficiency, 1 language, 1 expertise', note: 'Race-locked. Excellent for skill-focused builds.' },
  { feat: 'Skilled', benefit: 'Gain 3 proficiencies (any combination of skills/tools)', note: 'No expertise, but 3 new skills at once. Quantity over quality.' },
];

export const SKILL_STACKING = [
  { source: 'Proficiency', bonus: '+2 to +6 (by level)', stacks: 'Base layer. Required for expertise.' },
  { source: 'Expertise', bonus: 'Double proficiency (+4 to +12)', stacks: 'Replaces proficiency. The biggest boost.' },
  { source: 'Guidance', bonus: '+1d4 (avg +2.5)', stacks: 'Yes — with everything. Cast it constantly.' },
  { source: 'Bardic Inspiration', bonus: '+1d6 to +1d12', stacks: 'Yes. On demand from a Bard ally.' },
  { source: 'Enhance Ability', bonus: 'Advantage on checks', stacks: 'Yes. Advantage ≈ +5 average.' },
  { source: 'Pass Without Trace', bonus: '+10 to Stealth', stacks: 'Yes. Flat bonus to entire party.' },
  { source: 'Gloves of Thievery', bonus: '+5 to Sleight of Hand/Lockpicking', stacks: 'Yes. Item bonus.' },
  { source: 'Stone of Good Luck', bonus: '+1 to all checks and saves', stacks: 'Yes. Requires attunement.' },
];

export const MAX_SKILL_EXAMPLES = [
  { skill: 'Stealth', maxBonus: '+27', build: 'Rogue 11+ (Reliable Talent min 10), Expertise (+12), Cloak/Boots of Elvenkind (advantage), Pass Without Trace (+10). Minimum roll: 22.', achievableBy: 'Level 11 Rogue' },
  { skill: 'Persuasion', maxBonus: '+17', build: 'Bard with Expertise (+12), CHA 20 (+5). With Guidance + Enhance Ability: +17 + 1d4 with advantage. Eloquence Bard floor: 22.', achievableBy: 'Level 13 Eloquence Bard' },
  { skill: 'Athletics', maxBonus: '+17', build: 'Barbarian/Rogue with Expertise (+12), STR 20 (+5). Advantage from Rage. Reliable grappler.', achievableBy: 'Level 11 Rogue/Barbarian' },
  { skill: 'Perception', maxBonus: '+17', build: 'Rogue with Expertise (+12), WIS 20 (+5). Passive Perception 27 (32 with advantage from Observant).', achievableBy: 'Level 11+ Rogue' },
];

export function calculateSkillBonus(proficiencyBonus, abilityMod, hasExpertise, extraBonuses) {
  let bonus = abilityMod;
  if (hasExpertise) {
    bonus += proficiencyBonus * 2;
  } else {
    bonus += proficiencyBonus;
  }
  bonus += (extraBonuses || 0);
  return bonus;
}

export function getMinRoll(bonus, hasReliableTalent) {
  if (hasReliableTalent) return 10 + bonus;
  return 1 + bonus;
}
