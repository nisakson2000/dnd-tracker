/**
 * playerAbilityScoreOptimizer.js
 * Player Mode: ASI vs feat decision helper and ability score breakpoints
 * Pure JS — no React dependencies.
 */

export const ABILITY_SCORE_BREAKPOINTS = [
  { score: 8, mod: -1, note: 'Below average. Consider avoiding checks with this ability.' },
  { score: 10, mod: 0, note: 'Average. No bonus or penalty.' },
  { score: 12, mod: 1, note: 'Slightly above average. +1 is noticeable on checks.' },
  { score: 14, mod: 2, note: 'Good. Standard starting primary stat for many builds.' },
  { score: 16, mod: 3, note: 'Great. Strong primary stat at level 1.' },
  { score: 18, mod: 4, note: 'Excellent. Maximum at character creation (with racial bonus).' },
  { score: 20, mod: 5, note: 'Maximum natural score. Highest modifier without magic items.' },
];

export const ASI_VS_FEAT_GUIDE = [
  { scenario: 'Primary stat is odd (e.g., 15, 17, 19)', recommendation: 'ASI or Half-Feat', reason: 'Odd scores waste potential. +1 from a half-feat hits the next breakpoint.' },
  { scenario: 'Primary stat is below 18', recommendation: 'Usually ASI', reason: 'Maxing your primary stat (+1 to hit/DC/damage) is almost always the best choice.' },
  { scenario: 'Primary stat is 20', recommendation: 'Feat', reason: 'Can\'t go higher naturally. A feat adds new capabilities.' },
  { scenario: 'Two stats are odd', recommendation: 'ASI (+1/+1)', reason: 'Hit two breakpoints at once for maximum efficiency.' },
  { scenario: 'You need War Caster or Resilient (CON)', recommendation: 'Feat first', reason: 'Concentration protection is critical for casters. Worth delaying ASI.' },
  { scenario: 'You\'re a fighter/rogue/ranger', recommendation: 'Consider Sharpshooter/GWM/PAM early', reason: 'These damage feats are so powerful they may outclass +2 to hit.' },
];

export const TOP_HALF_FEATS = [
  { feat: 'Resilient', abilities: ['Any'], effect: '+1 to chosen ability, gain save proficiency.', bestFor: 'CON (casters) or WIS (everyone)' },
  { feat: 'Fey Touched', abilities: ['INT', 'WIS', 'CHA'], effect: '+1 to casting stat, learn Misty Step + 1 divination/enchantment spell.', bestFor: 'Every caster' },
  { feat: 'Shadow Touched', abilities: ['INT', 'WIS', 'CHA'], effect: '+1 to casting stat, learn Invisibility + 1 illusion/necromancy spell.', bestFor: 'Stealthy characters, warlocks' },
  { feat: 'Telekinetic', abilities: ['INT', 'WIS', 'CHA'], effect: '+1 to casting stat, invisible Mage Hand, bonus action shove 5ft.', bestFor: 'Bonus action economy, battlefield control' },
  { feat: 'Crusher/Slasher/Piercer', abilities: ['STR/CON/DEX'], effect: '+1, plus damage type benefits. Crusher: push 5ft. Slasher: reduce speed. Piercer: reroll damage die.', bestFor: 'Martial characters' },
  { feat: 'Skill Expert', abilities: ['Any'], effect: '+1, one skill proficiency, one expertise.', bestFor: 'Skill monkeys, grapple builds (Athletics expertise)' },
  { feat: 'Actor', abilities: ['CHA'], effect: '+1 CHA, advantage on Deception/Performance for impersonation, mimic speech.', bestFor: 'Social characters, infiltration' },
  { feat: 'Observant', abilities: ['INT', 'WIS'], effect: '+1, +5 passive Perception and Investigation, read lips.', bestFor: 'Scouts, trap detection' },
];

export function getModifier(score) {
  return Math.floor((score - 10) / 2);
}

export function shouldASI(primaryStat) {
  if (primaryStat < 20) return { recommendation: 'ASI', reason: `Primary stat is ${primaryStat} — maxing it improves almost everything you do.` };
  return { recommendation: 'Feat', reason: 'Primary stat is maxed. A feat adds more value than +1 to secondary stats.' };
}

export function getHalfFeatOptions(abilityToBoost) {
  const ability = (abilityToBoost || '').toUpperCase();
  return TOP_HALF_FEATS.filter(f => f.abilities.some(a => a.toUpperCase().includes(ability) || a === 'Any'));
}
