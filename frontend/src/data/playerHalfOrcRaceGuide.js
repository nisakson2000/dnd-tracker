/**
 * playerHalfOrcRaceGuide.js
 * Player Mode: Half-Orc — the savage warrior
 * Pure JS — no React dependencies.
 */

export const HALF_ORC_BASICS = {
  race: 'Half-Orc',
  source: 'Player\'s Handbook',
  asis: '+2 STR, +1 CON',
  speed: '30ft',
  size: 'Medium',
  darkvision: '60ft',
  note: 'Relentless Endurance (cheat death once) + Savage Attacks (extra crit die). Built for melee combat. Best for Barbarians, Fighters, and Paladins.',
};

export const HALF_ORC_TRAITS = [
  { trait: 'Relentless Endurance', effect: 'When reduced to 0 HP but not killed: drop to 1 HP instead. Once per long rest.', note: 'Cheat death once per day. Incredibly valuable. Buys one more round of combat. Can be the difference between TPK and victory.' },
  { trait: 'Savage Attacks', effect: 'On crit with melee weapon: roll one additional weapon damage die.', note: 'Extra crit die. Greatsword crit: normally 4d6, Half-Orc: 5d6. Stacks with Brutal Critical (Barbarian) and Smite.' },
  { trait: 'Menacing', effect: 'Proficiency in Intimidation.', note: 'Free Intimidation. STR-based Intimidation is thematic and fun.' },
];

export const HALF_ORC_CLASS_SYNERGY = [
  { class: 'Barbarian', priority: 'S', reason: 'STR+CON. Savage Attacks + Brutal Critical = massive crits. Reckless Attack = more crits. Relentless + Rage = survive everything.' },
  { class: 'Fighter (Champion)', priority: 'S', reason: 'STR+CON. Champion expanded crit range (19-20) + Savage Attacks. More crits, bigger crits.' },
  { class: 'Paladin', priority: 'A', reason: 'STR. Savage Attacks + Divine Smite on crit = enormous burst. Relentless for frontline survival.' },
  { class: 'Cleric (melee)', priority: 'B', reason: 'STR + CON. Frontline Cleric with Relentless. No WIS bonus hurts.' },
  { class: 'Any martial', priority: 'A', reason: 'STR + CON + crit bonus + death save. Universal melee package.' },
];

export const HALF_ORC_CRIT_MATH = [
  { weapon: 'Greatsword (2d6)', normalCrit: '4d6 (14 avg)', halfOrcCrit: '5d6 (17.5 avg)', note: '+1d6 = +3.5 damage on crits.' },
  { weapon: 'Greataxe (1d12)', normalCrit: '2d12 (13 avg)', halfOrcCrit: '3d12 (19.5 avg)', note: '+1d12 = +6.5! Greataxe is BETTER for Half-Orc Savage Attacks.' },
  { weapon: 'Maul (2d6)', normalCrit: '4d6 (14 avg)', halfOrcCrit: '5d6 (17.5 avg)', note: 'Same as greatsword.' },
  { weapon: 'Greataxe + Brutal Crit (L9)', normalCrit: '3d12 (19.5 avg)', halfOrcCrit: '4d12 (26 avg)', note: 'Barbarian Half-Orc: 4d12 = 26 avg on crit.' },
  { weapon: 'Greataxe + Brutal Crit (L17)', normalCrit: '5d12 (32.5 avg)', halfOrcCrit: '6d12 (39 avg)', note: 'L17 Barbarian: 6d12 = 39 avg on weapon crit alone.' },
];

export const HALF_ORC_TACTICS = [
  { tactic: 'Greataxe over Greatsword', detail: 'Half-Orc + Barbarian: Greataxe crits add d12 (avg 6.5) vs Greatsword adds d6 (avg 3.5). Greataxe wins for crit builds.', rating: 'S' },
  { tactic: 'Relentless + Zealot', detail: 'Zealot Barbarian: can\'t die while raging. Relentless Endurance: cheat death outside rage. Two layers of death prevention.', rating: 'S' },
  { tactic: 'Champion crit fishing', detail: 'Champion (19-20 crit) + Half-Orc + Reckless Attack = frequent, massive crits. GWM bonus action attack on kill/crit.', rating: 'A' },
  { tactic: 'Paladin Smite crits', detail: 'Crit + Divine Smite + Savage Attacks: all dice doubled + extra die. Enormous single-hit burst.', rating: 'A' },
];

export function savageAttackCritDamage(weaponDie, numWeaponDice, brutalCritDice = 0) {
  const totalDice = (numWeaponDice * 2) + 1 + brutalCritDice;
  const avg = totalDice * ((weaponDie / 2) + 0.5);
  return { totalDice, dieSize: weaponDie, avg: Math.round(avg * 10) / 10, note: `${totalDice}d${weaponDie} on crit` };
}
