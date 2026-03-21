/**
 * playerWildMagicBarbarianGuide.js
 * Player Mode: Wild Magic Barbarian — the chaotic rager
 * Pure JS — no React dependencies.
 */

export const WILD_MAGIC_BASICS = {
  class: 'Barbarian (Path of Wild Magic)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Random magical effects when you rage. Chaotic and fun. Detect/restore magic while raging.',
  note: 'Roll on Wild Magic table when you rage. Effects range from teleportation to AoE damage to ally buffs. Magic Awareness detects magic. Bolstering Magic gives allies bonuses. Chaotic but surprisingly powerful.',
};

export const WILD_MAGIC_FEATURES = [
  { feature: 'Magic Awareness', level: 3, effect: 'Action: sense magic within 60ft. Know location and school. PB uses/LR.', note: 'Detect Magic without concentration. Know exact location and school. Great utility for a Barbarian.' },
  { feature: 'Wild Surge', level: 3, effect: 'When you rage, roll d8 on Wild Surge table. Effect lasts for duration of rage.', note: 'Random but all 8 effects are useful. No bad results. See table below.' },
  { feature: 'Bolstering Magic', level: 6, effect: 'Action: touch ally — +1d3 to attacks/checks for 10 min, OR restore L1-3 spell slot (roll d3). PB uses/LR.', note: '+1d3 to attacks is excellent for GWM/SS users. Restoring spell slots helps casters. Very versatile.' },
  { feature: 'Unstable Backlash', level: 10, effect: 'Reaction when you take damage or fail save while raging: roll new Wild Surge effect (replaces current).', note: 'Reroll bad surge results. Reaction trigger is easy (take damage while raging = almost every turn).' },
  { feature: 'Controlled Surge', level: 14, effect: 'Roll 2 dice on Wild Surge table, choose which effect to use.', note: 'Choose your surge. Eliminates randomness. Pick the best effect for the situation.' },
];

export const WILD_SURGE_TABLE = [
  { roll: 1, effect: 'Shadowy tendrils', detail: 'Each creature within 30ft (except you): CON save or 1d12 necrotic + you gain temp HP = damage dealt.', rating: 'A' },
  { roll: 2, effect: 'Teleport', detail: 'Teleport 30ft to visible unoccupied space. Can teleport as BA each turn for rage duration.', rating: 'S' },
  { roll: 3, effect: 'Spirit flare', detail: 'Whenever creature within 30ft takes damage: reaction for 1d6 force damage to it.', rating: 'A' },
  { roll: 4, effect: 'Magic shield', detail: 'Light erupts. Until rage ends: you and allies within 10ft get +1 AC.', rating: 'A' },
  { roll: 5, effect: 'Retaliatory flora', detail: 'When hit by attack: reaction for 1d8 force damage + attacker pushed 5ft. Difficult terrain flowers appear.', rating: 'B' },
  { roll: 6, effect: 'Protective lights', detail: 'Until rage ends: you and allies within 30ft have advantage on INT, WIS, and CHA saves.', rating: 'S' },
  { roll: 7, effect: 'Weapon infusion', detail: 'Your weapon deals an extra 1d6 force damage on hit for the rage duration.', rating: 'A' },
  { roll: 8, effect: 'Wild teleport', detail: 'BA: teleport adjacent creature within 30ft to random empty space within 30ft of you. Unwilling: CHA save.', rating: 'B' },
];

export const WILD_MAGIC_TACTICS = [
  { tactic: 'Bolstering Magic + GWM ally', detail: '+1d3 to attacks for 10 min. Offsets GWM/SS -5 penalty. Huge DPR boost for martial allies.', rating: 'S' },
  { tactic: 'Bolstering Magic spell recovery', detail: 'Restore a L1-3 spell slot for your caster. Extra Shield, Healing Word, or Fireball.', rating: 'A' },
  { tactic: 'Controlled Surge targeting', detail: 'L14: choose between 2 rolls. Pick #6 (save advantage) vs casters or #7 (extra d6) vs tanks.', rating: 'S' },
  { tactic: 'Unstable Backlash rerolling', detail: 'L10: take damage → reroll surge. If current surge is weak, fish for #6 or #7.', rating: 'A' },
];

export function bolsteringMagicUses(profBonus) {
  return profBonus;
}

export function wildSurgeChance(preferredRolls = 1) {
  return { single: `${preferredRolls}/8 = ${(preferredRolls / 8 * 100).toFixed(1)}%`, controlled: `1 - (${8 - preferredRolls}/8)² = ${(1 - Math.pow((8 - preferredRolls) / 8, 2)) * 100 | 0}%` };
}
