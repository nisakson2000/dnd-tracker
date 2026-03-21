/**
 * playerPsiWarriorFighterGuide.js
 * Player Mode: Psi Warrior Fighter — the telekinetic soldier
 * Pure JS — no React dependencies.
 */

export const PSI_WARRIOR_BASICS = {
  class: 'Fighter (Psi Warrior)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Psionic Energy dice fuel force damage, shields, and telekinesis. Half-caster feel on a Fighter chassis.',
  note: 'Psionic Energy dice (INT mod + proficiency bonus pool, d6→d12 scaling) power three abilities: extra force damage, damage reduction shield, and telekinetic movement. Versatile and flavorful.',
};

export const PSI_WARRIOR_FEATURES = [
  { feature: 'Psionic Power', level: 3, effect: 'Pool of Psionic Energy dice (proficiency bonus + INT mod). Recover one die per short rest as BA.', note: 'At L3 with INT +3: 5 dice. Recover 1/SR. Resource management is key.' },
  { feature: 'Protective Field', level: 3, effect: 'Reaction: reduce damage to you or ally within 30ft by Psionic Energy die + INT mod.', note: 'Like Shield but for any damage, any ally. At L3: reduce by 1d6+3 (avg 6.5). Scales to d12+5.' },
  { feature: 'Psionic Strike', level: 3, effect: 'On weapon hit: add Psionic Energy die + INT mod force damage.', note: 'Extra 1d6+3 force damage (avg 6.5). Force is the best damage type. Scales to d12+5.' },
  { feature: 'Telekinetic Movement', level: 3, effect: 'Action: move Large or smaller creature/object 30ft. If creature: STR save.', note: 'Move allies out of danger, enemies off cliffs, objects as improvised attacks. Very creative.' },
  { feature: 'Telekinetic Adept', level: 7, effect: 'Psi-Powered Leap: BA fly speed = 2× walking speed for turn. Telekinetic Thrust: Psionic Strike can also push 10ft + prone (STR save).', note: 'Free flight as BA (once per SR free, then costs die). Forced prone on damage = advantage on next attacks.' },
  { feature: 'Guarded Mind', level: 10, effect: 'Resistance to psychic damage. Spend die to end charmed/frightened on self.', note: 'Psychic resistance + condition removal. Good defensive utility.' },
  { feature: 'Bulwark of Force', level: 15, effect: 'Action: INT mod creatures within 30ft get half cover (+2 AC, +2 DEX saves) for 1 minute. Free once/LR.', note: 'Party-wide +2 AC. Like Shield of Faith for the whole team. Incredible pre-buff.' },
  { feature: 'Telekinetic Master', level: 18, effect: 'Cast Telekinesis (no components). Concentration. Free once/LR or costs Psionic Energy die.', note: 'Telekinesis at will = move creatures, restrain, manipulate objects from 60ft.' },
];

export const PSI_WARRIOR_TACTICS = [
  { tactic: 'Psionic Strike on crits', detail: 'Add die after you see the hit. On crit: Psionic die doubles too. Save dice for crits with Champion or high-crit builds.', rating: 'S' },
  { tactic: 'Protective Field party defense', detail: 'Reduce damage to any ally within 30ft. Save for big hits. At L7: d8+4 = avg 8.5 reduction per use.', rating: 'A' },
  { tactic: 'Telekinetic Thrust + prone', detail: 'L7: hit + push 10ft + prone. Next attacks have advantage. Action Surge for advantage attacks.', rating: 'A' },
  { tactic: 'Bulwark of Force pre-fight', detail: 'L15: +2 AC to INT mod allies for 1 minute. Cast before boss fight. Free once/LR.', rating: 'S' },
  { tactic: 'Psi-Powered Leap mobility', detail: 'BA: fly 60ft (at 30ft speed). Reach flying enemies, cross gaps, avoid ground hazards.', rating: 'A' },
];

export function psionicEnergyDice(profBonus, intMod) {
  return { total: profBonus + Math.max(0, intMod), dieSize: profBonus <= 2 ? 6 : profBonus <= 4 ? 8 : profBonus <= 5 ? 10 : 12 };
}

export function psionicStrikeDamage(dieSize, intMod) {
  return { damage: `1d${dieSize}+${intMod}`, avg: (dieSize / 2 + 0.5) + intMod, type: 'force' };
}
