/**
 * playerFiendWarlockGuide.js
 * Player Mode: Fiend Warlock — the devil's bargain warlock
 * Pure JS — no React dependencies.
 */

export const FIEND_BASICS = {
  class: 'Warlock (The Fiend)',
  source: 'Player\'s Handbook',
  theme: 'Fiendish patron. Temp HP on kills, fire damage, and Hurl Through Hell.',
  note: 'Classic blaster Warlock. Dark One\'s Blessing gives sustain through temp HP. Good spell list with Fireball and Wall of Fire.',
};

export const FIEND_FEATURES = [
  { feature: 'Dark One\'s Blessing', level: 1, effect: 'When you reduce a hostile creature to 0 HP: gain temp HP = CHA mod + Warlock level.', note: 'Kill something → get temp HP. At L5 with 18 CHA: 9 temp HP per kill. Great sustain in multi-enemy fights.' },
  { feature: 'Dark One\'s Own Luck', level: 6, effect: 'Once per short rest: add 1d10 to an ability check or saving throw.', note: 'Free +1d10 to a save or check. Short rest recharge. Use on critical saves.' },
  { feature: 'Fiendish Resilience', level: 10, effect: 'After short/long rest: choose one damage type (except force/radiant). Gain resistance to it until next rest.', note: 'Choose a resistance. Know you\'re fighting a dragon? Pick fire. Flexible pre-fight defense.' },
  { feature: 'Hurl Through Hell', level: 14, effect: 'On hit: send target through the Lower Planes. They vanish until end of your next turn. Non-fiends take 10d10 psychic damage. Once per long rest.', note: 'Remove an enemy from combat for 1 round + 10d10 psychic (avg 55) if non-fiend. Incredible.' },
];

export const FIEND_SPELLS = [
  { level: 1, spells: ['Burning Hands', 'Command'], note: 'Burning Hands: early AoE. Command: versatile control.' },
  { level: 2, spells: ['Blindness/Deafness', 'Scorching Ray'], note: 'Scorching Ray: 3 rays × 2d6 fire. Good single-target damage.' },
  { level: 3, spells: ['Fireball', 'Stinking Cloud'], note: 'FIREBALL. On a Warlock. Excellent AoE option.' },
  { level: 4, spells: ['Fire Shield', 'Wall of Fire'], note: 'Wall of Fire: 5d8 per turn. Excellent battlefield control.' },
  { level: 5, spells: ['Flame Strike', 'Hallow'], note: 'Flame Strike: AoE radiant + fire. Hallow: powerful area spell.' },
];

export const FIEND_TACTICS = [
  { tactic: 'Kill chain temp HP', detail: 'Kill weak enemies → Dark One\'s Blessing → temp HP → tank hits → kill more → more temp HP. Snowball sustain.', rating: 'A', note: 'Best in multi-enemy fights. Each kill heals you.' },
  { tactic: 'Fireball + EB', detail: 'Fireball for AoE. EB for single target. Cover both damage scenarios.', rating: 'A' },
  { tactic: 'Hurl Through Hell removal', detail: 'L14: hit the biggest threat → they\'re gone for a round → party focuses on remaining enemies → they come back to 10d10 psychic.', rating: 'S', note: 'Remove + massive damage. Target is essentially dead for a round, then takes 55 avg damage.' },
  { tactic: 'Fiendish Resilience prep', detail: 'L10: know the enemy damage type? Pick it. Dragon fire? Fire resistance. Undead necrotic? Necrotic resistance.', rating: 'A' },
  { tactic: 'Dark One\'s Own Luck save', detail: '+1d10 to a crucial save. Failed Banishment by 3? Use this. Short rest recharge.', rating: 'A' },
];

export function darkOnesBlessingTempHP(warlockLevel, chaMod) {
  return chaMod + warlockLevel;
}

export function hurlThroughHellDamage() {
  return 55; // 10d10 avg
}

export function darkOnesOwnLuckBonus() {
  return 5.5; // 1d10 avg
}
