/**
 * playerWarCasterGuide.js
 * Player Mode: War Caster feat and somatic component management
 * Pure JS — no React dependencies.
 */

export const WAR_CASTER = {
  name: 'War Caster',
  prerequisite: 'Ability to cast at least one spell',
  benefits: [
    { benefit: 'Advantage on CON saves to maintain concentration', importance: 'S — the primary reason to take this feat', math: 'With +3 CON, you pass DC 10 about 95% of the time with advantage vs 70% without.' },
    { benefit: 'Perform somatic components with hands full (weapon + shield)', importance: 'A — solves a common problem for sword-and-board casters', math: 'Without this, you need a free hand for somatic components. Shield users rejoice.' },
    { benefit: 'Cast a spell as an opportunity attack (instead of a melee attack)', importance: 'A — situationally devastating', math: 'Booming Blade OA is the classic. Enemy takes damage for moving AND for continuing to move.' },
  ],
  rating: 'S tier for any concentration caster in melee',
  bestFor: ['Cleric (Spirit Guardians)', 'Paladin (concentration smite spells)', 'Bladesinger', 'Hexblade Warlock', 'Eldritch Knight', 'Swords Bard'],
};

export const WAR_CASTER_VS_RESILIENT = {
  warCaster: {
    best: 'Low to mid levels (1-10). Advantage on CON saves is better when your proficiency bonus is low.',
    provides: 'Advantage on concentration + somatic components + spell OA',
    math: 'At +3 CON: ~95% pass rate on DC 10',
  },
  resilientCon: {
    best: 'High levels (11-20). Proficiency bonus (+4 to +6) outpaces advantage statistically.',
    provides: 'Proficiency in CON saves (helps ALL CON saves, not just concentration)',
    math: 'At level 13: +3 CON + 5 proficiency = +8. That\'s 95% on DC 10 without advantage.',
  },
  both: 'Taking both is the gold standard for concentration casters. If you can afford 2 feats, do it.',
  verdict: 'Melee casters: War Caster first (somatic + spell OA). Ranged casters: Resilient CON first (proficiency is enough).',
};

export const SOMATIC_COMPONENT_RULES = {
  problem: 'Spells with somatic components require a free hand. But you want to hold a weapon AND shield.',
  solutions: [
    { solution: 'War Caster feat', effect: 'Cast somatic spells with hands full.' },
    { solution: 'Use a spellcasting focus', effect: 'If the spell has BOTH material AND somatic, the same hand holding the focus can do somatic.' },
    { solution: 'Component Pouch', effect: 'Same as focus — hand reaching into pouch satisfies somatic.' },
    { solution: 'Free one hand', effect: 'Drop weapon (free), cast, pick up (free object interaction). Technically works RAW.' },
    { solution: 'Ruby of the War Mage', effect: 'Common magic item. Makes weapon a spellcasting focus. Partial solution.' },
  ],
  note: 'This is one of the most confusing rules in 5e. Ask your DM how they handle it at session zero.',
};

export const CONCENTRATION_SPELL_PRIORITY = [
  { spell: 'Spirit Guardians', level: 3, reason: 'AoE damage every round. Worth protecting at all costs.', warCasterValue: 'S' },
  { spell: 'Haste', level: 3, reason: 'Losing Haste = lose a FULL TURN to lethargy. Devastating to drop.', warCasterValue: 'S' },
  { spell: 'Polymorph', level: 4, reason: 'Dropping = giant ape form ends. Sudden HP loss for the target.', warCasterValue: 'A' },
  { spell: 'Hold Person', level: 2, reason: 'Auto-crit setup. Losing concentration wastes the party\'s positioning.', warCasterValue: 'A' },
  { spell: 'Wall of Force', level: 5, reason: 'Splits the battlefield. Losing it can collapse your tactical advantage.', warCasterValue: 'A' },
  { spell: 'Bless', level: 1, reason: '+1d4 to attacks and saves for 3 people. High value per slot level.', warCasterValue: 'A' },
];

export function shouldTakeWarCaster(classRole, usesShield, inMelee) {
  if (inMelee && usesShield) return { recommendation: 'Strongly recommended', reason: 'Solves somatic + concentration + spell OA' };
  if (inMelee) return { recommendation: 'Recommended', reason: 'Concentration protection + spell OA in melee' };
  if (usesShield) return { recommendation: 'Consider', reason: 'Somatic components with shield. But Resilient CON may be better from range.' };
  return { recommendation: 'Resilient CON may be better', reason: 'Ranged caster with free hands doesn\'t need somatic benefit or spell OA.' };
}
