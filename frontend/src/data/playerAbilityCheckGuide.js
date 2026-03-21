/**
 * playerAbilityCheckGuide.js
 * Player Mode: Ability checks — when DMs call for them, modifiers, and optimization
 * Pure JS — no React dependencies.
 */

export const ABILITY_CHECK_RULES = {
  formula: 'd20 + ability modifier + proficiency bonus (if proficient in relevant skill).',
  dc: 'DC 5 (very easy) → DC 10 (easy) → DC 15 (medium) → DC 20 (hard) → DC 25 (very hard) → DC 30 (nearly impossible).',
  advantage: 'Roll 2d20, take higher. Average bonus: ~+3.3.',
  disadvantage: 'Roll 2d20, take lower. Average penalty: ~-3.3.',
  passiveCheck: '10 + all modifiers. Used for Perception, Insight, Investigation when not actively checking.',
  contest: 'Both roll ability checks. Higher wins. Ties: status quo maintained.',
};

export const ABILITY_SCORE_USES = [
  { ability: 'Strength', checks: 'Athletics, forced entry, lifting, pushing, grappling.', saves: 'Pushed, restrained, physical force.', note: 'Martials. Grapple/Shove use STR (Athletics).' },
  { ability: 'Dexterity', checks: 'Acrobatics, Sleight of Hand, Stealth, lockpicking.', saves: 'Dodge effects, AoE spells (Fireball, Lightning Bolt).', note: 'Most common save. AC. Initiative.' },
  { ability: 'Constitution', checks: 'Endurance, forced march, holding breath, resisting poison.', saves: 'Concentration, poison, endurance effects.', note: 'HP. Concentration saves. No skills based on CON.' },
  { ability: 'Intelligence', checks: 'Arcana, History, Investigation, Nature, Religion.', saves: 'Mind attacks, psychic effects. Rare.', note: 'Knowledge skills. Wizard/Artificer casting.' },
  { ability: 'Wisdom', checks: 'Animal Handling, Insight, Medicine, Perception, Survival.', saves: 'Charm, fear, domination. MOST IMPORTANT save.', note: 'Perception. Cleric/Druid/Ranger casting.' },
  { ability: 'Charisma', checks: 'Deception, Intimidation, Performance, Persuasion.', saves: 'Banishment, some charm effects.', note: 'Social skills. Sorcerer/Warlock/Bard/Paladin casting.' },
];

export const CHECK_BOOSTERS = [
  { booster: 'Proficiency', effect: '+2 to +6 (PB scales with level).', source: 'Class, background, racial, feat.', rating: 'S+' },
  { booster: 'Expertise', effect: 'Double proficiency bonus.', source: 'Rogue, Bard, Skill Expert feat, Prodigy feat.', rating: 'S+' },
  { booster: 'Guidance', effect: '+1d4 to one ability check.', source: 'Cleric/Druid cantrip.', rating: 'S+' },
  { booster: 'Enhance Ability', effect: 'Advantage on checks for one ability. 1 hour.', source: '2nd level spell.', rating: 'S' },
  { booster: 'Jack of All Trades', effect: '+half PB to non-proficient checks.', source: 'Bard L2.', rating: 'A+' },
  { booster: 'Reliable Talent', effect: 'Treat any d20 roll below 10 as 10 on proficient checks.', source: 'Rogue L11.', rating: 'S+' },
  { booster: 'Bardic Inspiration', effect: '+1d6 to +1d12 to one check.', source: 'Bard feature.', rating: 'S' },
  { booster: 'Flash of Genius', effect: '+INT to one check/save.', source: 'Artificer L7.', rating: 'S' },
  { booster: 'Pass without Trace', effect: '+10 to Stealth checks.', source: '2nd level Druid/Ranger.', rating: 'S+' },
];

export const ABILITY_CHECK_TIPS = [
  'Guidance: +1d4 to any check. Always cast before important checks.',
  'Expertise: double PB. Rogue/Bard get this. Skill Expert feat for anyone.',
  'Reliable Talent (Rogue L11): minimum 10+modifiers. Can\'t roll below ~20 on expertise skills.',
  'Passive Perception is always active. Observant feat adds +5.',
  'Enhance Ability: advantage for 1 hour. Cast before infiltration/negotiation.',
  'Contest (grapple, shove): both roll. No DC — just beat the opponent.',
  'Jack of All Trades: Bards add half PB to everything, including Counterspell checks.',
  'Flash of Genius: Artificer adds +INT to any check or save as reaction.',
  'DC 15 is "medium." With +7 modifier, you succeed 65% of the time.',
  'Advantage ≈ +3.3. Disadvantage ≈ -3.3. Stacks with other bonuses.',
];
