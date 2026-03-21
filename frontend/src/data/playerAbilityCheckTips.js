/**
 * playerAbilityCheckTips.js
 * Player Mode: Ability check optimization, skill check strategies, and advantage sources
 * Pure JS — no React dependencies.
 */

export const ABILITY_CHECK_RULES = {
  formula: 'd20 + ability modifier + proficiency (if proficient) + other bonuses.',
  expertise: 'Double proficiency bonus. Rogues (2 skills), Bards (2 skills at L3, 2 more at L10).',
  jackOfAllTrades: 'Bard: add half proficiency to checks you\'re NOT proficient in.',
  reliableTalent: 'Rogue L11: minimum 10 on any proficient check. Can\'t roll below 10+mods.',
  passiveChecks: '10 + modifiers. Used for Perception, Investigation, Insight (DM compares to DCs).',
};

export const ADVANTAGE_SOURCES = [
  { source: 'Help action', effect: 'Advantage on one check. Anyone can Help.', note: 'Costs an ally\'s action but advantage is powerful.' },
  { source: 'Guidance (cantrip)', effect: '+1d4 to one check.', note: 'Cast before EVERY check. Free bonus. Most impactful cantrip.' },
  { source: 'Enhance Ability (2nd)', effect: 'Advantage on one type of ability check for 1 hour.', note: 'Bull\'s Strength, Cat\'s Grace, etc. Concentration.' },
  { source: 'Bardic Inspiration', effect: '+1d6 to 1d12 to one check.', note: 'Bard gives you a die to add after rolling.' },
  { source: 'Flash of Genius (Artificer)', effect: '+INT mod as reaction.', note: 'Artificer adds INT to any ability check within 30ft.' },
  { source: 'Portent (Divination Wizard)', effect: 'Replace any d20 roll with a pre-rolled die.', note: 'Replace a failed check with a high Portent die.' },
];

export const SKILL_CHECK_STRATEGIES = [
  { skill: 'Athletics', tips: 'Advantage from Rage (Barbarian), Enhance Ability. Expertise from Skill Expert feat.', common: 'Grapple, shove, climb, swim, jump.' },
  { skill: 'Acrobatics', tips: 'Balance, tumble through enemy space, escape grapple.', common: 'Escape grapple (your choice: Athletics or Acrobatics).' },
  { skill: 'Stealth', tips: 'Disadvantage in heavy armor. Expertise + Pass Without Trace (+10) is nearly unbeatable.', common: 'Hiding, sneaking, surprise setup.' },
  { skill: 'Perception', tips: 'Passive Perception is always on. Observant feat +5. Advantage from Sentinel Shield.', common: 'Spotting hidden things, enemies, traps.' },
  { skill: 'Investigation', tips: 'Used for searching (different from Perception). Find traps, clues, secret doors.', common: 'Searching rooms, deducing information, finding hidden objects.' },
  { skill: 'Persuasion', tips: 'CHA-based. Expertise from Bard or Skill Expert. Role-play your argument for advantage.', common: 'Convincing NPCs, negotiation, diplomacy.' },
  { skill: 'Arcana', tips: 'Identify spells, understand magical phenomena, recognize magical creatures.', common: 'Magic knowledge, spell identification, ritual understanding.' },
];

export const IMPOSSIBLE_CHECKS = {
  dc30: 'Nearly impossible. Only achievable with expertise + high stat + advantage + bonuses.',
  bestBuilds: [
    { build: 'Rogue 11+ with Expertise', total: 'Min 10 + 6 (expertise) + 5 (mod) = 21 minimum. Can\'t fail DC 21.', note: 'Reliable Talent guarantees minimum 10.' },
    { build: 'Bard with Expertise + Jack', total: '+17 at level 20 (5 mod + 12 expertise). Floor of 27 with Reliable Talent.', note: 'Needs Rogue multiclass for RT.' },
    { build: 'Artificer Flash of Genius', total: '+INT on any check as reaction. Stack with other bonuses.', note: 'Help allies reach high DCs.' },
  ],
};

export function abilityCheckBonus(abilityMod, profBonus, isProficient, hasExpertise) {
  let bonus = abilityMod;
  if (isProficient) bonus += profBonus * (hasExpertise ? 2 : 1);
  return bonus;
}

export function passiveScore(abilityMod, profBonus, isProficient, hasAdvantage, hasObservant) {
  let score = 10 + abilityMod;
  if (isProficient) score += profBonus;
  if (hasAdvantage) score += 5;
  if (hasObservant) score += 5;
  return score;
}

export function checkSuccessChance(bonus, dc) {
  const needed = dc - bonus;
  return Math.min(95, Math.max(5, (21 - needed) * 5));
}
