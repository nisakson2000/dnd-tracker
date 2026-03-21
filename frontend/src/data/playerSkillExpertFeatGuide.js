/**
 * playerSkillExpertFeatGuide.js
 * Player Mode: Skill Expert feat — expertise for any class
 * Pure JS — no React dependencies.
 */

export const SKILL_EXPERT_BASICS = {
  feat: 'Skill Expert',
  source: "Tasha's Cauldron of Everything",
  type: 'Half-feat (+1 to any ability score)',
  benefits: [
    '+1 to any ability score.',
    'Gain proficiency in one skill.',
    'Choose one skill you\'re proficient in: gain Expertise (double proficiency bonus).',
  ],
  note: 'Expertise was previously locked to Rogues and Bards. This feat opens it to everyone. +1 to any stat makes it a great half-feat.',
};

export const BEST_EXPERTISE_PICKS = [
  { skill: 'Perception', reason: 'Highest-used skill. Passive Perception catches ambushes. Expertise + Observant = passive 25+.', rating: 'S' },
  { skill: 'Athletics', reason: 'Grapple/shove builds need this. Expertise in Athletics makes you nearly unbeatable in grapples.', rating: 'S (grapplers)' },
  { skill: 'Stealth', reason: 'Critical for scouts and ambush-heavy campaigns. Expertise + Pass without Trace = unhittable stealth checks.', rating: 'A' },
  { skill: 'Persuasion', reason: 'Best social skill. Face characters want Expertise here. CHA + Expertise = auto-succeed most social checks.', rating: 'A' },
  { skill: 'Deception', reason: 'Second-best social skill. Expertise for con artists and infiltrators.', rating: 'A' },
  { skill: 'Investigation', reason: 'INT-based. Good for finding traps, clues. Wizards with Expertise Investigation are detective-tier.', rating: 'B' },
  { skill: 'Insight', reason: 'Detect lies and motives. WIS-based. Good for social encounters.', rating: 'B' },
  { skill: 'Arcana/Religion/History', reason: 'Knowledge checks. Niche but fun. Rarely critical.', rating: 'C' },
];

export const CLASS_VALUE = [
  { class: 'Fighter', rating: 'S', reason: 'Fighters have no Expertise. Athletics Expertise for grapple builds. +1 STR rounds odd score.' },
  { class: 'Barbarian', rating: 'S', reason: 'Rage advantage + Athletics Expertise = unstoppable grappler.' },
  { class: 'Paladin', rating: 'A', reason: 'Persuasion Expertise for the party face. +1 CHA rounds odd score.' },
  { class: 'Cleric', rating: 'A', reason: 'Perception Expertise. +1 WIS. Best scout/watchkeeper.' },
  { class: 'Wizard', rating: 'B', reason: 'Investigation Expertise. +1 INT. Useful but Wizards have better feat options.' },
  { class: 'Rogue', rating: 'C', reason: 'Rogues already get 4 Expertise. Redundant unless you want a 5th.' },
  { class: 'Bard', rating: 'C', reason: 'Bards get Expertise at L3 and L10. Low priority.' },
];

export const GRAPPLER_BUILD = {
  core: 'Athletics Expertise + Rage Advantage (Barbarian) or Enlarge (any)',
  combo: [
    'Grapple (Athletics vs Athletics/Acrobatics) → Shove prone → attack with advantage.',
    'Expertise Athletics: +11 at L5 (STR 20 + 6 prof). With advantage: effectively +16.',
    'Enemy must beat your Athletics to escape. Most monsters can\'t.',
  ],
  note: 'Skill Expert is the #1 feat for grapple builds that aren\'t Rogue or Bard.',
};

export function expertiseBonus(abilityMod, profBonus) {
  return { normal: abilityMod + profBonus, expertise: abilityMod + profBonus * 2, note: `Normal: +${abilityMod + profBonus}, Expertise: +${abilityMod + profBonus * 2}` };
}
