/**
 * playerSorlockMulticlassGuide.js
 * Player Mode: Sorlock (Sorcerer/Warlock) multiclass — builds, combos, optimization
 * Pure JS — no React dependencies.
 */

export const SORLOCK_CORE = {
  concept: 'Warlock short rest slots fuel Sorcery Points via Font of Magic. Quickened Eldritch Blast = best sustained DPR caster.',
  primaryStat: 'CHA (both classes use it)',
  warlockDip: '2-3 levels for Eldritch Blast + Agonizing Blast + short rest slots',
  sorcererMain: 'Rest of levels in Sorcerer for Metamagic + spell slots',
};

export const SORLOCK_BUILDS = [
  {
    name: 'Coffeelock (Pre-Tasha\'s)',
    split: 'Sorcerer X / Warlock 2-3',
    strategy: 'Convert Warlock slots to Sorcery Points on short rest. Never long rest. Stockpile SP.',
    rating: 'S+ (if DM allows)',
    note: 'Xanathar\'s exhaustion rules counter this. Many tables ban it.',
  },
  {
    name: 'Quickened Blast',
    split: 'Sorcerer 5+ / Warlock 2',
    strategy: 'Quickened Spell Eldritch Blast + normal Eldritch Blast = 4-8 beams/turn.',
    rating: 'S+',
    note: 'Best sustained ranged DPR. No spell slots consumed on main attack.',
  },
  {
    name: 'Hexblade Sorlock',
    split: 'Sorcerer X / Hexblade 1-3',
    strategy: 'Hexblade dip: medium armor, shields, CHA weapon, Hexblade\'s Curse.',
    rating: 'S+',
    note: 'Most common Sorlock. Hexblade 1 is the best single-level dip in 5e.',
  },
  {
    name: 'Darkness Devil\'s Sight',
    split: 'Sorcerer X / Warlock 2 (any)',
    strategy: 'Cast Darkness on self. Devil\'s Sight sees through. Enemies blinded.',
    rating: 'A+',
    note: 'Advantage on all attacks, disadvantage on enemy attacks. Annoys party without Subtle Spell.',
  },
  {
    name: 'Paladin/Sorcerer/Warlock (Padlock-Sorc)',
    split: 'Paladin 2 / Sorcerer X / Hexblade 1',
    strategy: 'Smites + Metamagic + short rest slots. CHA SAD.',
    rating: 'S',
    note: 'MAD without Hexblade. With Hexblade 1: CHA for attacks, smites, spells.',
  },
];

export const SORLOCK_INVOCATIONS = [
  { name: 'Agonizing Blast', priority: 'MANDATORY', note: '+CHA to each EB beam.' },
  { name: 'Repelling Blast', priority: 'S', note: '10ft push per beam. Forced movement combos.' },
  { name: 'Devil\'s Sight', priority: 'S (with Darkness)', note: 'See in magical darkness. Darkness combo.' },
  { name: 'Eldritch Mind', priority: 'A+', note: 'Advantage concentration. Frees War Caster feat.' },
  { name: 'Grasp of Hadar', priority: 'A', note: 'Pull 10ft once/turn. Spike Growth combo.' },
];

export const SORLOCK_METAMAGIC = [
  { name: 'Quickened Spell', priority: 'MANDATORY', note: 'BA Eldritch Blast. Core of the build.' },
  { name: 'Subtle Spell', priority: 'S', note: 'Counterspell-proof casting. Social spell stealth.' },
  { name: 'Twinned Spell', priority: 'S', note: 'Twin Haste, Polymorph, Hold Person.' },
  { name: 'Heightened Spell', priority: 'A+', note: 'Disadvantage on save. Use on key control spells.' },
];

export const SORLOCK_LEVEL_PROGRESSION = [
  { level: '1', class: 'Sorcerer 1', get: 'CON save proficiency. Origin spells.', note: 'Start Sorcerer for CON saves.' },
  { level: '2', class: 'Warlock 1 (Hexblade)', get: 'Hex, medium armor, shields, CHA weapon.', note: 'Hexblade dip. AC jumps.' },
  { level: '3', class: 'Warlock 2', get: 'Agonizing Blast + 1 invocation. 2 slots/SR.', note: 'Core online. EB + AB.' },
  { level: '4-5', class: 'Sorcerer 2-3', get: 'Font of Magic. Metamagic (Quickened + Twinned).', note: 'Quickened EB online at Sorc 3.' },
  { level: '6+', class: 'Sorcerer 4+', get: 'ASIs, higher spells, origin features.', note: 'Pure Sorcerer from here.' },
];

export const SORLOCK_TIPS = [
  'Start Sorcerer 1 for CON save proficiency. Then Warlock dip.',
  'Hexblade 1 is the best dip: medium armor, shields, CHA attacks.',
  'Warlock 2 minimum: Agonizing Blast + 2nd invocation.',
  'Warlock 3 only if you want Pact of the Chain (Gift of the Ever-Living Ones).',
  'Quickened EB = 4 beams at level 5 (2 normal + 2 quickened).',
  'Convert Warlock slots to SP on short rests. Free Metamagic fuel.',
  'Don\'t go deeper than Warlock 3. Sorcerer progression is too valuable.',
  'Repelling Blast + Spike Growth: 2d4 per 5ft × 10ft push per beam.',
  'Subtle Counterspell can\'t be counter-counterspelled.',
  'At high levels: Quickened EB + Action spell = massive turn.',
];
