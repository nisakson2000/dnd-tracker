/**
 * playerBlessSpellGuide.js
 * Player Mode: Bless — the best L1 buff spell
 * Pure JS — no React dependencies.
 */

export const BLESS_BASICS = {
  spell: 'Bless',
  level: 1,
  school: 'Enchantment',
  castTime: '1 action',
  range: '30 feet',
  duration: '1 minute (concentration)',
  targets: 'Up to 3 creatures',
  classes: ['Cleric', 'Paladin'],
  effect: 'Each target adds 1d4 to ALL attack rolls and ALL saving throws for the duration.',
  note: 'The most efficient buff spell in the game. +1d4 (avg 2.5) to attacks AND saves for 3 targets. Always prepare.',
};

export const BLESS_MATH = {
  avgBonus: 2.5,
  hitImpact: '+12.5% chance to hit per attack. For 3 targets making 2 attacks each = 6 rolls affected per round.',
  saveImpact: '+12.5% chance to pass any saving throw. Across 3 targets, protects against most save-or-suck.',
  efficiency: 'One L1 slot affects 6+ d20 rolls per round for up to 10 rounds. No other L1 spell comes close.',
  stacking: 'Stacks with Peace Cleric\'s Emboldening Bond (+1d4). Two +1d4s = +2d4 (avg 5) to every d20.',
};

export const BLESS_VS_ALTERNATIVES = {
  vsHex: { bless: '3 targets, +1d4 attacks AND saves', hex: '1 target, +1d6 damage per hit', verdict: 'Bless for party support. Hex for personal damage.' },
  vsFaerieFire: { bless: '+1d4 to hit + saves', faerieFire: 'Advantage on attacks (much stronger to-hit, no save bonus)', verdict: 'Faerie Fire is better offensively. Bless adds save protection.' },
  vsShieldOfFaith: { bless: '+1d4 attacks and saves for 3', sof: '+2 AC for 1', verdict: 'Bless affects more targets and more rolls. Usually better.' },
};

export const BLESS_TIPS = [
  'Cast round 1. Bless is at its best when it affects the most rolls.',
  'Target the party members making the most attack rolls (Fighters, Rangers with Extra Attack).',
  'Also target allies with weak saves (Fighters, Barbarians) for save protection.',
  'Concentration: protect it. War Caster or Resilient (CON). Losing Bless costs the party 2.5 per roll.',
  'Upcasting: L2 = 4 targets. L3 = 5 targets. Great for larger parties.',
  'Bless + Bane on enemies = +1d4 to allies, -1d4 to enemies. But both need concentration (from different casters).',
];

export const BLESS_PARTY_VALUE = {
  twoMartials: '+1d4 on 4+ attack rolls per round = ~2 extra hits per combat.',
  savingThrows: 'Party-wide +1d4 saves = ~12.5% less likely to be Held/Feared/Banished.',
  totalImpact: 'Over 10 rounds of combat: affects 60+ d20 rolls. For a single L1 slot.',
  note: 'Bless is one of the only L1 spells that remains excellent at every level of play.',
};

export function blessImpact(numTargets, avgAttacksPerTarget) {
  const totalRolls = numTargets * avgAttacksPerTarget;
  const extraHits = totalRolls * 0.125;
  return { totalRolls, extraHits: Math.round(extraHits * 10) / 10, note: `Bless on ${numTargets} targets: ~${Math.round(extraHits * 10) / 10} extra hits per round (+ save protection)` };
}
