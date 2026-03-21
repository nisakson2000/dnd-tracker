/**
 * playerDrunkenMasterMonkGuide.js
 * Player Mode: Way of the Drunken Master Monk — the mobile brawler
 * Pure JS — no React dependencies.
 */

export const DRUNKEN_MASTER_BASICS = {
  class: 'Monk (Way of the Drunken Master)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Unpredictable movement. Free Disengage on Flurry. Redirect attacks. Hit-and-run perfected.',
  note: 'Best hit-and-run Monk. Flurry of Blows gives free Disengage + 10ft speed. Redirect attacks make enemies hit each other.',
};

export const DRUNKEN_MASTER_FEATURES = [
  { feature: 'Bonus Proficiencies', level: 3, effect: 'Proficiency in Performance and Brewer\'s Supplies.', note: 'Flavor proficiencies. Performance can be useful for Drunken Master RP.' },
  { feature: 'Drunken Technique', level: 3, effect: 'When you use Flurry of Blows: gain benefit of Disengage and +10ft movement.', note: 'FREE Disengage built into Flurry. No extra ki cost. Plus 10ft speed. Every Flurry turn = hit-and-run perfection.' },
  { feature: 'Tipsy Sway', level: 6, effect: 'Leap to Your Feet: stand from prone for 5ft movement (instead of half speed). Redirect Attack: when missed in melee, use reaction to redirect the attack to another creature within 5ft.', note: 'Redirect Attack is amazing. Enemy misses you → hits their ally instead (using attacker\'s roll vs ally\'s AC).' },
  { feature: 'Drunkard\'s Luck', level: 11, effect: 'When you make a check/save/attack with disadvantage: spend 2 ki to cancel the disadvantage.', note: 'Remove disadvantage for 2 ki. Situational but powerful when it matters. Poisoned? Restrained? Spend ki.' },
  { feature: 'Intoxicated Frenzy', level: 17, effect: 'When you use Flurry of Blows: make up to 3 additional attacks (total 5 Flurry attacks) as long as each targets a different creature.', note: 'Up to 7 attacks in one turn (2 Extra Attack + 5 Flurry). Must hit different creatures. Incredible in crowds.' },
];

export const DRUNKEN_MASTER_TACTICS = [
  { tactic: 'Flurry hit-and-run', detail: 'Move in → Flurry of Blows (2 attacks + free Disengage + 10ft speed) → move away safely. No opportunity attacks. No ki for Step of the Wind.', rating: 'S' },
  { tactic: 'Redirect Attack teamwork', detail: 'L6: position yourself between enemies. When enemy misses you, redirect to their ally. Free damage from enemy attacks.', rating: 'A' },
  { tactic: 'Crowd control at L17', detail: 'Intoxicated Frenzy: 7 attacks against different targets. In a room of 7 enemies, you attack every single one. With Stunning Strike: stun multiple targets.', rating: 'S' },
  { tactic: 'Stunning Strike mobility', detail: 'Stun target A. Use Drunken Technique to disengage and run to target B. Stun target B next turn. Constantly stunning different enemies.', rating: 'S' },
  { tactic: 'Prone immunity', detail: 'Leap to Your Feet: 5ft to stand from prone. Regular creatures spend half movement. You spend almost nothing. Immune to prone as a meaningful condition.', rating: 'B' },
];

export const DRUNKEN_MASTER_VS_OPEN_HAND = {
  drunkenMaster: {
    pros: ['Free Disengage on every Flurry', '+10ft speed on Flurry', 'Redirect Attack (L6)', 'Up to 7 attacks at L17'],
    cons: ['No prone/push effects on Flurry', 'No instant kill (Quivering Palm)', 'Features are more defensive'],
  },
  openHand: {
    pros: ['Prone/push/deny reactions on Flurry', 'Quivering Palm at L17', 'Self-healing'],
    cons: ['Flurry doesn\'t include Disengage', 'Must spend ki on Step of the Wind for mobility'],
  },
  verdict: 'Drunken Master is safer and more mobile. Open Hand has more offensive Flurry options. Both are strong.',
};

export function intoxicatedFrenzyAttacks() {
  return 7; // 2 Extra Attack + 5 Flurry (at L17)
}

export function drunkenTechniqueSpeedBonus() {
  return 10; // +10ft on Flurry turns
}
