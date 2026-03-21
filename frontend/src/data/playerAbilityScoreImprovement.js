/**
 * playerAbilityScoreImprovement.js
 * Player Mode: ASI tracking, when you get them, and feat-vs-ASI decisions
 * Pure JS — no React dependencies.
 */

export const ASI_LEVELS = {
  default: [4, 8, 12, 16, 19],
  Fighter: [4, 6, 8, 12, 14, 16, 19],
  Rogue: [4, 8, 10, 12, 16, 19],
};

export const ASI_DECISION_GUIDE = [
  { scenario: 'Primary stat is odd', recommendation: 'Half-feat to get +1 AND a feat benefit', reason: 'Getting to the next modifier breakpoint is critical.' },
  { scenario: 'Primary stat < 18', recommendation: 'Usually ASI (+2 to primary)', reason: 'Accuracy and save DC improvements are huge.' },
  { scenario: 'Primary stat = 20', recommendation: 'Take a feat', reason: 'Can\'t increase above 20. Feats are now always better.' },
  { scenario: 'GWM/Sharpshooter build', recommendation: 'Get GWM/SS ASAP (usually level 4)', reason: '+10 damage is the biggest DPR increase in the game.' },
  { scenario: 'Concentration caster', recommendation: 'War Caster or Resilient (CON)', reason: 'Losing concentration loses your best spell AND the slot.' },
  { scenario: 'Multiple odd scores', recommendation: 'Half-feat (Fey Touched, Elven Accuracy, etc.)', reason: 'Round up two stats with one ASI choice.' },
];

export const POPULAR_HALF_FEATS = [
  { feat: 'Fey Touched', stat: 'CHA/WIS/INT', benefit: 'Misty Step + 1st-level divination/enchantment' },
  { feat: 'Shadow Touched', stat: 'CHA/WIS/INT', benefit: 'Invisibility + 1st-level illusion/necromancy' },
  { feat: 'Elven Accuracy', stat: 'DEX/INT/WIS/CHA', benefit: 'Triple advantage on attacks (elves only)' },
  { feat: 'Observant', stat: 'INT/WIS', benefit: '+5 passive Perception and Investigation' },
  { feat: 'Resilient', stat: 'Any', benefit: 'Proficiency in saves for chosen ability' },
  { feat: 'Skill Expert', stat: 'Any', benefit: 'One skill proficiency + one Expertise' },
  { feat: 'Telekinetic', stat: 'CHA/WIS/INT', benefit: 'Invisible Mage Hand + bonus action shove 5ft' },
  { feat: 'Crusher/Piercer/Slasher', stat: 'STR/DEX', benefit: 'Damage type-specific combat benefits' },
];

export function getASILevels(className) {
  return ASI_LEVELS[className] || ASI_LEVELS.default;
}

export function getNextASI(className, currentLevel) {
  const levels = getASILevels(className);
  return levels.find(l => l > currentLevel) || null;
}

export function levelsUntilASI(className, currentLevel) {
  const next = getNextASI(className, currentLevel);
  return next ? next - currentLevel : null;
}
