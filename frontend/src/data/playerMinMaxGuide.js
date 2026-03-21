/**
 * playerMinMaxGuide.js
 * Player Mode: Min-maxing vs optimization vs balanced play guide
 * Pure JS — no React dependencies.
 */

export const OPTIMIZATION_LEVELS = [
  { level: 'Casual', description: 'Pick what sounds fun. Don\'t worry about optimization. Enjoy the story.', pros: 'Most creative. Best for RP-heavy games.', cons: 'May feel underpowered in combat-heavy games.' },
  { level: 'Optimized', description: 'Make smart choices within your concept. Good stats in your main ability. Solid feat choices.', pros: 'Effective in combat AND roleplay. Best balance.', cons: 'Requires some system knowledge.' },
  { level: 'Min-Maxed', description: 'Squeeze every mechanical advantage. Optimal race/class/feat combinations.', pros: 'Dominant in combat. Reliable contributor.', cons: 'Can overshadow other players. May limit RP flexibility.' },
  { level: 'Munchkin', description: 'Exploit rules interactions and edge cases. Often at the expense of fun.', pros: 'Peak mechanical performance.', cons: 'Annoys other players and DMs. Gets banned from tables.' },
];

export const OPTIMIZATION_GUIDELINES = [
  'Max your primary ability score FIRST. Nothing is more important than hitting your targets.',
  'CON is the second most important stat for everyone. You can\'t deal damage if you\'re dead.',
  'Don\'t dump STR below 8 unless you have a plan for carry weight and grapples.',
  'Take ASIs over feats UNTIL your primary stat is 20. Then feats.',
  'Exception: feats that define your build (GWM, Sharpshooter, PAM) can come before ASI cap.',
  'Concentration spells are the most powerful. Protect them with War Caster or Resilient CON.',
  'Don\'t multiclass unless you have a specific goal. Single-class is almost always stronger.',
  'Multiclass dips of 1-3 levels can be powerful. Deep multiclassing usually isn\'t.',
  'The best optimization is knowing the rules. Rules knowledge > character build.',
];

export const COMMON_TRAPS = [
  { trap: 'Dumping CON', why: 'Low CON = low HP = dead character. Every class needs at least 12-14 CON.' },
  { trap: 'Too many multiclass levels', why: 'Delaying Extra Attack, ASIs, and high-level features for minor benefits.' },
  { trap: 'Ignoring action economy', why: 'Using your action for something your bonus action could do wastes potential.' },
  { trap: 'Building for one situation', why: 'A character who only excels in one scenario is a liability in all others.' },
  { trap: 'Choosing flavor over function', why: 'A cool concept that can\'t contribute to the party isn\'t fun for anyone long-term.' },
  { trap: 'Taking bad feats', why: 'Some feats are traps: Keen Mind, Linguist, Weapon Master. Research before taking.' },
  { trap: 'Not having ranged AND melee options', why: 'Flying enemies, ranged enemies, or tight quarters can shut you down completely.' },
  { trap: 'Ignoring saving throw proficiency', why: 'WIS saves stop mind control. DEX saves stop Fireball. CON saves protect concentration.' },
];

export const TABLE_ETIQUETTE = [
  'Match the party\'s optimization level. Don\'t be the only min-maxer at a casual table.',
  'Don\'t tell other players how to build their characters unless they ask.',
  'Optimize your character\'s ROLE, not just damage. Tanks should tank, support should support.',
  'If you\'re dominating combat, find ways to share the spotlight.',
  'A character who\'s fun to play WITH is better than one who\'s fun to play.',
  'Discuss optimization expectations at session zero. Is this a tactics game or a story game?',
  'Remember: the DM controls difficulty. An optimized party just faces harder encounters.',
];

export function getOptimizationLevel(description) {
  return OPTIMIZATION_LEVELS.find(l =>
    l.level.toLowerCase().includes((description || '').toLowerCase())
  ) || null;
}

export function checkForTraps(build) {
  const warnings = [];
  if (build.con < 12) warnings.push(COMMON_TRAPS.find(t => t.trap.includes('CON')));
  if (build.multiclassLevels > 3) warnings.push(COMMON_TRAPS.find(t => t.trap.includes('multiclass')));
  if (!build.hasRanged) warnings.push(COMMON_TRAPS.find(t => t.trap.includes('ranged AND melee')));
  return warnings.filter(Boolean);
}
