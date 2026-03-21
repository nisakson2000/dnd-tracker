/**
 * playerPsiWarriorGuide.js
 * Player Mode: Psi Warrior Fighter — telekinetic fighter
 * Pure JS — no React dependencies.
 */

export const PSI_WARRIOR_BASICS = {
  class: 'Fighter (Psi Warrior)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Telekinetic warrior. Force damage, psionic shields, and telekinetic movement.',
  note: 'Very flexible Fighter. Psi dice fuel offense, defense, AND utility. INT-dependent but rewarding.',
};

export const PSI_WARRIOR_FEATURES = [
  { feature: 'Psionic Power', level: 3, effect: 'Gain psi dice (d6, scales to d12). PB×2 dice per long rest. Three uses: Protective Field, Psionic Strike, Telekinetic Movement.', note: 'Resource pool = PB×2 per long rest. Scales in die size AND number. Very flexible.' },
  { feature: 'Protective Field', level: 3, effect: 'Reaction: when you or ally within 30ft takes damage, reduce damage by psi die roll + INT mod.', note: 'Damage reduction reaction. Like a Shield for allies. Scales with INT.' },
  { feature: 'Psionic Strike', level: 3, effect: 'On weapon hit: add psi die + INT mod force damage.', note: 'Extra force damage (rarely resisted). Psi die + INT = significant bonus.' },
  { feature: 'Telekinetic Movement', level: 3, effect: 'Action: move Large or smaller creature/object 30ft. Creature gets STR save. Once/short rest or spend psi die.', note: 'Move enemies off cliffs, allies out of danger, objects to block paths.' },
  { feature: 'Telekinetic Adept', level: 7, effect: 'Psi-Powered Leap: bonus action, fly speed = 2× walking speed until end of turn. Once/short rest or psi die. Telekinetic Thrust: on Psionic Strike, target is Large or smaller? Push 10ft or knock prone (STR save).', note: 'Jump/fly as bonus action. Push/prone on your strikes. Good control.' },
  { feature: 'Guarded Mind', level: 10, effect: 'Resistance to psychic damage. Spend psi die to end charmed/frightened on yourself (no action).', note: 'Anti-control passive. Spend a die to break free of charm/fear.' },
  { feature: 'Bulwark of Force', level: 15, effect: 'Bonus action: give half cover (+2 AC, +2 DEX saves) to INT mod creatures within 30ft for 1 minute. Once/LR or psi die.', note: 'Party-wide +2 AC. Incredible defensive buff.' },
  { feature: 'Telekinetic Master', level: 18, effect: 'Cast Telekinesis (no components, concentration). While concentrating: make one weapon attack as bonus action.', note: 'Free Telekinesis + bonus action attacks. Move creatures, objects, yourself.' },
];

export const PSI_DIE_SCALING = [
  { level: 3, dieSize: 'd6', diceCount: 4, note: 'PB 2 × 2 = 4 dice' },
  { level: 5, dieSize: 'd8', diceCount: 6, note: 'PB 3 × 2 = 6 dice' },
  { level: 9, dieSize: 'd8', diceCount: 8, note: 'PB 4 × 2 = 8 dice' },
  { level: 13, dieSize: 'd10', diceCount: 10, note: 'PB 5 × 2 = 10 dice' },
  { level: 17, dieSize: 'd12', diceCount: 12, note: 'PB 6 × 2 = 12 dice' },
];

export const PSI_WARRIOR_TACTICS = [
  { tactic: 'Psionic Strike on crits', detail: 'Save Psionic Strike for critical hits. Force damage die is doubled. Psi d8 + 5 INT → d8+5 normal, 2d8+5 on crit.', rating: 'A' },
  { tactic: 'Protective Field stack', detail: 'Reduce damage by psi die + INT. At L5: d8+5 = avg 9.5 damage reduction. Like a mini-Shield for anyone.', rating: 'A' },
  { tactic: 'Telekinetic cliff push', detail: 'Telekinetic Movement: push enemy 30ft. Off a cliff, into lava, into ally\'s Spirit Guardians.', rating: 'A' },
  { tactic: 'Psi-Powered Leap + Attack', detail: 'Bonus action: fly 60ft. Action: attack. Reach flying enemies, bypass terrain, escape.', rating: 'A' },
  { tactic: 'Bulwark of Force party buff', detail: 'L15: +2 AC to INT mod allies (probably 5). Entire party gets half cover. Massive defensive swing.', rating: 'S' },
];

export function psiDieAvg(fighterLevel) {
  if (fighterLevel >= 17) return 6.5; // d12
  if (fighterLevel >= 13) return 5.5; // d10
  if (fighterLevel >= 5) return 4.5; // d8
  return 3.5; // d6
}

export function psionicStrikeDamage(fighterLevel, intMod) {
  return psiDieAvg(fighterLevel) + intMod;
}

export function protectiveFieldReduction(fighterLevel, intMod) {
  return psiDieAvg(fighterLevel) + intMod;
}

export function psiDicePool(proficiencyBonus) {
  return proficiencyBonus * 2;
}
