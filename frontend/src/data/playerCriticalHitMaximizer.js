/**
 * playerCriticalHitMaximizer.js
 * Player Mode: Maximizing critical hit damage, crit-fishing builds, and crit timing
 * Pure JS — no React dependencies.
 */

export const CRITICAL_HIT_RULES = {
  trigger: 'Natural 20 on an attack roll',
  effect: 'Double ALL damage dice rolled for the attack (weapon dice, Sneak Attack, Smite, etc.)',
  doesNotDouble: ['Flat modifiers (STR/DEX mod)', 'Bonus damage from features that don\'t roll dice'],
  probability: '5% on any single attack (1 in 20)',
  withAdvantage: '9.75% (roughly 1 in 10)',
  withElvenAccuracy: '14.3% (roughly 1 in 7) — three d20s',
  note: 'Critical hits bypass AC. Even if the target has AC 25, a nat 20 hits.',
};

export const CRIT_DAMAGE_OPTIMIZATION = [
  { method: 'More dice = bigger crits', detail: 'Smite, Sneak Attack, Hex — all dice-based damage doubles on crit. Stack as many dice as possible.', impact: 'S' },
  { method: 'Paladin Smite on crit', detail: 'Wait to see if you crit, THEN Smite. 4d8 becomes 8d8 radiant. Undead: 10d8.', impact: 'S' },
  { method: 'Rogue Sneak Attack crit', detail: 'At level 11: 6d6 → 12d6 Sneak Attack damage on crit. Plus weapon dice doubled.', impact: 'S' },
  { method: 'Half-Orc Savage Attacks', detail: 'Roll one additional weapon damage die on crit. Greatsword: 2d6 → 5d6 (not 4d6).', impact: 'A' },
  { method: 'Barbarian Brutal Critical', detail: 'Extra weapon die on crit at levels 9, 13, 17. Stacks with Half-Orc.', impact: 'A' },
  { method: 'Great Weapon Fighting', detail: 'Reroll 1s and 2s on weapon damage dice (not smite/SA). Small boost on crits.', impact: 'B' },
  { method: 'Hexblade\'s Curse', detail: 'Add proficiency to damage. This is a flat bonus — does NOT double on crit.', impact: 'C (for crits)' },
];

export const CRIT_FISHING_BUILDS = [
  {
    build: 'Champion Fighter',
    critRange: '19-20 (level 3), 18-20 (level 15)',
    probability: '10% at level 3, 15% at level 15',
    note: 'More attacks = more crit chances. 4 attacks at level 20 with 15% crit = very frequent crits.',
  },
  {
    build: 'Hexblade Warlock (Hexblade\'s Curse)',
    critRange: '19-20 (against cursed target)',
    probability: '10%',
    note: 'Expanded crit range on cursed target. Combine with Eldritch Blast for multiple crit chances.',
  },
  {
    build: 'Assassin Rogue',
    critRange: 'Auto-crit on surprised targets',
    probability: '100% (if surprised)',
    note: 'Not crit-fishing — guaranteed crit. Sneak Attack dice doubled. Devastating opener.',
  },
  {
    build: 'Elven Accuracy + Advantage',
    critRange: '20 (but roll 3 dice)',
    probability: '14.3%',
    note: 'Three d20s with advantage. Nearly 1 in 7 chance. Best for DEX/CHA/WIS attackers.',
  },
  {
    build: 'Paladin/Warlock (Smite-lock)',
    critRange: '19-20 (Hexblade Curse)',
    probability: '10% + Smite dice doubled',
    note: 'Crit on 19-20 with Hexblade. Smite with highest slot. 8d8+ radiant on crit. Nuclear.',
  },
];

export const WHEN_TO_FISH = [
  { situation: 'Boss with Legendary Resistance', recommendation: 'Crit-fish with attacks. LR doesn\'t affect attack rolls.', priority: 'S' },
  { situation: 'High AC target', recommendation: 'Nat 20 always hits. Advantage = more chances to nat 20.', priority: 'A' },
  { situation: 'Paladin with spell slots', recommendation: 'Hold Smite until you crit. Multiple attacks = multiple chances.', priority: 'S' },
  { situation: 'Rogue with Sneak Attack', recommendation: 'Advantage + Elven Accuracy = high crit chance on big SA dice.', priority: 'A' },
  { situation: 'Low HP targets', recommendation: 'Don\'t fish — just kill them. Crits matter most vs tough enemies.', priority: 'C' },
];

export const MATH_REFERENCE = {
  critChancePerAttack: {
    normal: '5%',
    advantage: '9.75%',
    elvenAccuracy: '14.26%',
    champion3: '10%',
    champion3Adv: '19%',
    champion15: '15%',
    champion15Adv: '27.75%',
    champion15EA: '38.6%',
  },
  expectedCritsPerCombat: {
    fighter5_normal: '0.5 crits per 5-round combat (2 attacks)',
    fighter5_advantage: '0.975 crits per 5-round combat (2 attacks)',
    fighter11_champion: '2.25 crits per 5-round combat (3 attacks, 18-20 range)',
  },
};

export function critChance(numDice, critRange) {
  const critOn = 21 - critRange; // Number of values that crit (e.g., 19-20 = 2 values)
  const missChance = Math.pow((20 - critOn) / 20, numDice);
  return Math.round((1 - missChance) * 10000) / 100;
}

export function critDamage(weaponDice, weaponDieSize, additionalDice, additionalDieSize, flatMod) {
  const weaponCrit = weaponDice * 2 * ((weaponDieSize + 1) / 2);
  const additionalCrit = additionalDice * 2 * ((additionalDieSize + 1) / 2);
  return { doubled: weaponCrit + additionalCrit + flatMod, normal: weaponDice * ((weaponDieSize + 1) / 2) + additionalDice * ((additionalDieSize + 1) / 2) + flatMod };
}
