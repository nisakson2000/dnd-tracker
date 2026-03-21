/**
 * playerNat20CritGuide.js
 * Player Mode: Critical hit rules, optimization, and crit-fishing builds
 * Pure JS — no React dependencies.
 */

export const CRIT_RULES = {
  trigger: 'Natural 20 on attack roll = critical hit.',
  damage: 'Roll all damage dice TWICE. Add modifiers once.',
  autoHit: 'Nat 20 always hits regardless of AC.',
  spells: 'Spell attacks can crit. Save spells cannot.',
  nat1: 'Nat 1 always misses. No fumble rules RAW.',
};

export const WHAT_DOUBLES = {
  yes: ['Weapon dice', 'Sneak Attack dice', 'Divine Smite dice', 'Spell damage dice', 'Hex/Hunter\'s Mark dice', 'Superiority dice', 'Savage Attacks (Half-Orc)', 'Brutal Critical (Barbarian)'],
  no: ['Ability modifiers', 'Flat bonuses (GWM +5)', 'Agonizing Blast CHA', 'Magic weapon +1/+2/+3'],
};

export const CRIT_BUILDS = [
  { build: 'Champion Fighter', range: '19-20 (L3), 18-20 (L15)', why: 'Expanded range + many attacks.' },
  { build: 'Paladin Smite', range: '20', why: 'Smite AFTER seeing crit. Dice double.' },
  { build: 'Assassin Rogue', range: 'Auto-crit on surprised', why: 'Sneak Attack doubles.' },
  { build: 'Half-Orc Barbarian', range: '20 + advantage (Reckless)', why: 'Extra crit dice stack.' },
  { build: 'Hexblade', range: '19-20 on cursed target', why: 'Expanded range + Eldritch Smite.' },
];

export const MAXIMIZE_CRITS = [
  { method: 'More Attacks', how: 'More rolls = more chances.' },
  { method: 'Advantage', how: '~10% crit (vs 5%). Reckless, Faerie Fire.' },
  { method: 'Elven Accuracy', how: '~14.3%. Triple advantage. Elf/Half-Elf.' },
  { method: 'Hold Person/Monster', how: 'Auto-crit melee within 5ft.' },
  { method: 'Expanded Range', how: 'Champion 18-20, Hexblade 19-20.' },
];

export const CRIT_TIPS = [
  'Only dice double. Modifiers stay the same.',
  'Paladin: smite AFTER seeing crit. Save slots.',
  'Sneak Attack doubles on crit. Rogue crits are massive.',
  'Hold Person: auto-crit within 5ft. Set it up.',
  'Advantage doubles crit chance.',
  'Elven Accuracy: 14.3% crit with advantage.',
  'Half-Orc + Barbarian: extra crit dice stack.',
  'More attacks = more crits. Action Surge maximizes.',
  'Hexblade Curse: 19-20 on cursed target.',
  'Champion Fighter: 18-20 at L15. Most crits.',
];
