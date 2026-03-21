/**
 * playerCriticalHitGuide.js
 * Player Mode: Critical hit rules, maximizing crits, and crit-fishing builds
 * Pure JS — no React dependencies.
 */

export const CRIT_RULES = {
  trigger: 'Natural 20 on an attack roll. Always hits regardless of AC.',
  damage: 'Roll all damage dice TWICE. Add modifiers once. Smite/Sneak Attack dice are doubled too.',
  spellAttacks: 'Spell attacks can crit. Inflict Wounds (3d10 → 6d10 on crit) is devastating.',
  nat1: 'Natural 1 always misses. No additional penalty RAW (DMs may add fumble effects).',
  paralyzed: 'Attacks against paralyzed creatures within 5ft are AUTO-CRITS.',
  unconscious: 'Attacks against unconscious creatures within 5ft are AUTO-CRITS.',
};

export const CRIT_FISHING_BUILDS = [
  {
    build: 'Champion Fighter',
    critRange: '19-20 (L3), 18-20 (L15)',
    note: 'Improved Critical doubles your crit chance. Superior Critical triples it.',
    synergy: 'More attacks = more crit chances. Action Surge for burst.',
    rating: 'A',
  },
  {
    build: 'Hexblade Warlock',
    critRange: '19-20 (Hexblade\'s Curse)',
    note: 'Hexblade\'s Curse on a target = crits on 19-20. Stacks with Champion if multiclassed.',
    synergy: 'Eldritch Smite on crit (doubled dice + prone).',
    rating: 'S',
  },
  {
    build: 'Paladin (any)',
    critRange: '20 (normal)',
    note: 'Divine Smite: decide AFTER the hit. Save smites for crits → doubled radiant dice.',
    synergy: 'Vow of Enmity (advantage = more chances to crit).',
    rating: 'S',
  },
  {
    build: 'Rogue (any)',
    critRange: '20 (normal)',
    note: 'Sneak Attack dice are all doubled on crit. 10d6 → 20d6 at L19.',
    synergy: 'Elven Accuracy (triple advantage). Assassinate (auto-crit on surprised).',
    rating: 'S',
  },
  {
    build: 'Half-Orc (any martial)',
    critRange: '20 (normal)',
    note: 'Savage Attacks: one additional weapon damage die on crit. Stacks with doubled dice.',
    synergy: 'Barbarian Brutal Critical adds even more dice.',
    rating: 'A',
  },
];

export const ELVEN_ACCURACY = {
  name: 'Elven Accuracy',
  prereq: 'Elf or Half-Elf',
  effect: 'When you have advantage using DEX, INT, WIS, or CHA, reroll one of the dice.',
  critChance: 'Normal: 5%. Advantage: 9.75%. Elven Accuracy: 14.26%.',
  note: 'Nearly triple the crit rate. Best with reliable advantage sources.',
  bestWith: ['Samurai (Fighting Spirit)', 'Hexblade (Hexblade\'s Curse + advantage)', 'Rogue (Steady Aim)'],
};

export const MAXIMIZING_CRIT_DAMAGE = [
  { method: 'Paladin Divine Smite', bonus: '2d8-5d8 doubled', note: 'Hold smites for crits. 5d8 → 10d8 radiant.' },
  { method: 'Rogue Sneak Attack', bonus: '1d6-10d6 doubled', note: 'All SA dice double. 10d6 → 20d6 at L19.' },
  { method: 'Eldritch Smite (Warlock)', bonus: '1d8+slot level d8 doubled', note: 'Force damage + prone. All doubled.' },
  { method: 'Inflict Wounds', bonus: '3d10 → 6d10', note: 'Biggest single-target spell crit. 6d10 = avg 33.' },
  { method: 'Half-Orc Savage Attacks', bonus: '+1 weapon die', note: 'Extra die on top of doubled dice.' },
  { method: 'Barbarian Brutal Critical', bonus: '+1/2/3 weapon dice', note: 'L9/L13/L17. Stacks with Half-Orc.' },
  { method: 'Hold Person/Monster', bonus: 'Auto-crit within 5ft', note: 'Paralyzed = guaranteed crit. Coordinate with party.' },
];

export function critChance(critRange, hasAdvantage, hasElvenAccuracy) {
  const critOn = 21 - critRange; // e.g., 19-20 = crit on 2 values = 10%
  const p = critOn / 20;
  if (hasElvenAccuracy) return 1 - Math.pow(1 - p, 3);
  if (hasAdvantage) return 1 - Math.pow(1 - p, 2);
  return p;
}

export function critDamage(weaponDice, modifier, bonusDice) {
  const normal = weaponDice / 2 + 0.5 + modifier;
  const doubled = (weaponDice + bonusDice) + modifier; // all dice doubled, mods once
  return { normal, crit: doubled };
}
