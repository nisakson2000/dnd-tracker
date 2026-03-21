/**
 * playerHalfOrcGuide.js
 * Player Mode: Half-Orc race optimization and Savage Attacks tactics
 * Pure JS — no React dependencies.
 */

export const HALF_ORC_TRAITS = {
  asi: '+2 STR, +1 CON',
  size: 'Medium',
  speed: '30ft',
  darkvision: '60ft',
  menacing: 'Proficiency in Intimidation.',
  relentlessEndurance: 'When reduced to 0 HP (but not killed outright): drop to 1 HP instead. Once per long rest.',
  savageAttacks: 'On a critical hit with melee weapon: roll one additional weapon damage die.',
};

export const HALF_ORC_FEATURES_ANALYSIS = {
  relentlessEndurance: {
    value: 'Essentially a free Death Ward. Prevents going down once per day.',
    math: 'At any level, staying at 1 HP instead of 0 is enormous. You stay in the fight. No death saves.',
    synergy: 'Barbarian: Rage keeps you alive. 1 HP with Rage resistance = effectively 2 HP.',
    note: 'Doesn\'t work against massive damage (damage that exceeds your max HP from 0 = instant death).',
  },
  savageAttacks: {
    value: 'Extra die on crits. Greatsword: 2d6 → 3d6 on crit. Greataxe: 1d12 → 2d12 on crit.',
    math: 'Greataxe benefits MORE from Savage Attacks (1 extra d12 = +6.5 avg) vs Greatsword (1 extra d6 = +3.5).',
    synergy: 'Half-Orc Barbarian with Brutal Critical: Greataxe crit at L9 = 4d12 + mods. Devastating.',
    champion: 'Half-Orc Champion Fighter: crits on 19-20. Double the crit chance = double the savage attacks.',
  },
};

export const HALF_ORC_BUILDS = [
  { build: 'Half-Orc Barbarian (any)', detail: 'STR + CON. Relentless Endurance + Rage. Savage Attacks + Brutal Critical. The iconic build.', rating: 'S' },
  { build: 'Half-Orc Champion Fighter', detail: 'Crits on 19-20. Savage Attacks triggers more often. Great Weapon Fighting style.', rating: 'A' },
  { build: 'Half-Orc Paladin', detail: 'STR + CON. Smite on crit + Savage Attacks = massive burst. Relentless keeps you smiting.', rating: 'A' },
  { build: 'Half-Orc Conquest Paladin', detail: 'Intimidation proficiency + Menacing feat. Frightening Presence for Conquest aura lockdown.', rating: 'A' },
  { build: 'Half-Orc Rune Knight Fighter', detail: 'Giant\'s Might + Savage Attacks crits. Fire Rune restrains. STR build.', rating: 'A' },
];

export const GREATAXE_VS_GREATSWORD = {
  normal: { greataxe: '1d12 (6.5 avg)', greatsword: '2d6 (7 avg)', winner: 'Greatsword by 0.5' },
  critWithSavage: { greataxe: '3d12 (19.5 avg)', greatsword: '4d6 + 1d6 (17.5 avg)', winner: 'Greataxe by 2' },
  withBrutalCritical: { greataxe: '4d12 (26 avg)', greatsword: '4d6 + 2d6 (21 avg)', winner: 'Greataxe by 5' },
  verdict: 'Half-Orc + Barbarian = Greataxe is strictly better due to Savage Attacks + Brutal Critical stacking.',
};

export function savageAttacksDamage(weaponDie) {
  return weaponDie / 2; // avg of one extra die on crit
}

export function critDamageHalfOrc(weaponDice, weaponDieSize, modifiers) {
  // Normal crit: 2× weapon dice + mods. Savage Attacks: +1 die.
  const critDice = weaponDice * 2 + 1;
  return critDice * (weaponDieSize / 2) + modifiers;
}
