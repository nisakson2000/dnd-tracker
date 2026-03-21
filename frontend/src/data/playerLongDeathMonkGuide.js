/**
 * playerLongDeathMonkGuide.js
 * Player Mode: Way of the Long Death Monk — the unkillable monk
 * Pure JS — no React dependencies.
 */

export const LONG_DEATH_BASICS = {
  class: 'Monk (Way of the Long Death)',
  source: 'Sword Coast Adventurer\'s Guide',
  theme: 'Death study. Temp HP on kills. Fear aura. Spend ki to cheat death.',
  note: 'Surprisingly tanky Monk. Touch of Death for temp HP sustain. Mastery of Death makes you extremely hard to kill.',
};

export const LONG_DEATH_FEATURES = [
  { feature: 'Touch of Death', level: 3, effect: 'When you reduce a creature within 5ft to 0 HP: gain temp HP = WIS mod + Monk level.', note: 'Kill anything (even a rat) near you = temp HP. At L10 with +5 WIS: 15 temp HP per kill. Excellent sustain.' },
  { feature: 'Hour of Reaping', level: 6, effect: 'Action: all creatures within 30ft that can see you must WIS save or be frightened until end of your next turn.', note: 'AoE fear with no resource cost. Just takes your action. Frightened = can\'t approach you + disadvantage.' },
  { feature: 'Mastery of Death', level: 11, effect: 'When reduced to 0 HP: spend 1 ki to drop to 1 HP instead.', note: 'Spend ki to NOT DIE. At L11: 11 ki points = 11 extra lives per rest. Incredibly hard to kill.' },
  { feature: 'Touch of the Long Death', level: 17, effect: '1-10 ki: deal 2d10 necrotic damage per ki spent. CON save for half. No attack roll.', note: 'Maximum 20d10 (110 avg) for 10 ki. Expensive but massive burst. Guaranteed half damage on save.' },
];

export const LONG_DEATH_TACTICS = [
  { tactic: 'Kill small creatures for temp HP', detail: 'Punch a rat, spider, or minion. Get WIS+level temp HP. Start each fight by killing the weakest enemy first.', rating: 'S' },
  { tactic: 'Mastery of Death tanking', detail: 'L11: 1 ki = don\'t die. With 11-20 ki points, you can "die" and revive 11-20 times per short rest. Functionally immortal.', rating: 'S' },
  { tactic: 'Hour of Reaping crowd control', detail: 'Free AoE fear. Use when surrounded. Frightened creatures can\'t approach. Creates space for repositioning.', rating: 'A' },
  { tactic: 'Touch of Death + Stunning Strike', detail: 'Stun enemy → attack stunned enemy → kill → gain temp HP → repeat. Self-sustaining combat loop.', rating: 'A' },
];

export function touchOfDeathTempHP(monkLevel, wisMod) {
  return wisMod + monkLevel;
}

export function masteryOfDeathKiCost() {
  return 1; // 1 ki per death prevention
}

export function touchOfLongDeathDamage(kiSpent) {
  return kiSpent * 11; // 2d10 avg = 11 per ki
}
