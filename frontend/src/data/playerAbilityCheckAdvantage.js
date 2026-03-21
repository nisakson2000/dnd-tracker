/**
 * playerAbilityCheckAdvantage.js
 * Player Mode: Common sources of advantage/disadvantage on ability checks
 * Pure JS — no React dependencies.
 */

export const ADVANTAGE_SOURCES = [
  { source: 'Help Action', type: 'advantage', applies: 'One ability check', note: 'Ally within 5ft uses action to help. Advantage on next check.' },
  { source: 'Guidance (cantrip)', type: 'advantage', applies: 'One ability check', note: 'Add 1d4 to one ability check. Concentration, before the roll.' },
  { source: 'Enhance Ability (2nd)', type: 'advantage', applies: 'All checks for one ability', note: 'Choose ability. Advantage on all checks with that ability for duration. Concentration.' },
  { source: 'Bardic Inspiration', type: 'bonus', applies: 'One check/attack/save', note: 'Add Inspiration die (d6-d12) to one roll. After rolling, before result.' },
  { source: 'Flash of Genius (Artificer)', type: 'bonus', applies: 'One check or save', note: 'Reaction: add INT mod to an ally\'s check or save within 30ft.' },
  { source: 'Pass without Trace (2nd)', type: 'bonus', applies: 'Stealth checks', note: '+10 to Stealth for all party members within 30ft. Concentration.' },
  { source: 'Reliable Talent (Rogue 11)', type: 'floor', applies: 'Proficient checks', note: 'Minimum roll of 10 on any proficiency check. Massively powerful.' },
  { source: 'Jack of All Trades (Bard 2)', type: 'bonus', applies: 'All non-proficient checks', note: 'Add half proficiency to all checks you\'re not proficient in.' },
  { source: 'Expertise', type: 'bonus', applies: 'Chosen skills', note: 'Double proficiency bonus for selected skills. Rogue, Bard, some feats.' },
  { source: 'Skill Empowerment (5th)', type: 'bonus', applies: 'One skill', note: 'Double proficiency in one skill for duration. Concentration.' },
  { source: 'Rage (Barbarian)', type: 'advantage', applies: 'STR checks', note: 'Advantage on all Strength checks while raging.' },
  { source: 'Knack (Scout)', type: 'bonus', applies: 'Chosen checks', note: 'Varies by subclass — adds die to specific checks.' },
];

export const DISADVANTAGE_SOURCES = [
  { source: 'Exhaustion (Level 1)', type: 'disadvantage', applies: 'All ability checks', note: 'First level of exhaustion gives disadvantage on ALL ability checks.' },
  { source: 'Frightened', type: 'disadvantage', applies: 'Ability checks and attacks', note: 'Disadvantage while source of fear is in line of sight.' },
  { source: 'Poisoned', type: 'disadvantage', applies: 'Attack rolls and ability checks', note: 'Disadvantage on attacks and ability checks.' },
  { source: 'Heavy Armor (no proficiency)', type: 'disadvantage', applies: 'STR/DEX checks and attacks', note: 'Wearing armor without proficiency = disadvantage on all STR/DEX checks and attacks.' },
  { source: 'Heavily Encumbered', type: 'disadvantage', applies: 'STR/DEX/CON checks and attacks', note: 'Carrying over 10x STR score.' },
  { source: 'Underwater', type: 'disadvantage', applies: 'Some attack rolls', note: 'Melee: disadvantage unless piercing. Ranged: auto-miss beyond normal range.' },
];

export const STACKING_RULES = {
  advantageDisadvantage: 'If you have both advantage and disadvantage, they cancel out (always — even multiple sources of one).',
  multipleBonuses: 'Multiple bonuses stack (Guidance + Bardic Inspiration + Jack of All Trades).',
  multipleAdvantage: 'Multiple sources of advantage don\'t stack — you still only roll 2d20.',
  luckyFeat: 'Lucky feat: spend a luck point to roll a third d20 and choose which to use.',
};

export function getAdvantageSourcesFor(checkType) {
  const ct = (checkType || '').toLowerCase();
  return ADVANTAGE_SOURCES.filter(s =>
    s.applies.toLowerCase().includes(ct) || s.applies.toLowerCase().includes('all') || s.applies.toLowerCase().includes('one')
  );
}
