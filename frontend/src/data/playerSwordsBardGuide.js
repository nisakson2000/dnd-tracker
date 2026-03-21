/**
 * playerSwordsBardGuide.js
 * Player Mode: College of Swords Bard — the blade dancer
 * Pure JS — no React dependencies.
 */

export const SWORDS_BASICS = {
  class: 'Bard (College of Swords)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Blade dancer and weapon performer. Melee Bard with Flourishes.',
  note: 'Best melee Bard. Extra Attack + Blade Flourishes + full casting. Jack of all trades, master of several.',
};

export const SWORDS_FEATURES = [
  { feature: 'Bonus Proficiencies', level: 3, effect: 'Medium armor + scimitar proficiency. Use weapon as spellcasting focus.', note: 'Medium armor is great for a Bard. Half-plate + shield = 19 AC.' },
  { feature: 'Fighting Style', level: 3, effect: 'Choose Dueling (+2 damage with one-handed weapon) or Two-Weapon Fighting (add ability mod to offhand).', note: 'Dueling is usually better. +2 damage per hit with rapier + shield.' },
  { feature: 'Blade Flourish', level: 3, effect: '+10ft walking speed on Attack action turn. Spend Inspiration die on hit: choose Defensive, Slashing, or Mobile Flourish.', note: 'Three flourish options. Add Inspiration die to damage + effect. One per turn.' },
  { feature: 'Extra Attack', level: 6, effect: 'Attack twice when you take the Attack action.', note: 'Bards normally don\'t get Extra Attack. This makes Swords a real melee threat.' },
  { feature: 'Master\'s Flourish', level: 14, effect: 'Use a d6 for Blade Flourish instead of spending Inspiration die. Still use Inspiration die if you want the higher roll.', note: 'FREE flourish every attack. Save Inspiration for allies. d6 is usually enough for the effect.' },
];

export const BLADE_FLOURISHES = [
  { flourish: 'Defensive Flourish', effect: 'Add Inspiration die to damage AND AC until start of next turn.', note: 'Damage + AC boost. With half-plate + shield + Defensive: 19 + d8 AC. Can hit 25+ AC.', rating: 'S' },
  { flourish: 'Slashing Flourish', effect: 'Add Inspiration die to damage to target AND deal Inspiration die damage to another creature within 5ft.', note: 'Cleave attack. Hit two enemies. Good against groups.', rating: 'A' },
  { flourish: 'Mobile Flourish', effect: 'Add Inspiration die to damage. Push target back Inspiration die + 5 ft. You can move into vacated space (no OA).', note: 'Push enemies away + reposition. Good for controlling space.', rating: 'B' },
];

export const SWORDS_TACTICS = [
  { tactic: 'Defensive Flourish tank', detail: 'Hit + Defensive Flourish. 19 AC base + d8 = 20-27 AC until next turn. Full caster with fighter AC.', rating: 'S' },
  { tactic: 'Extra Attack + cantrip', detail: 'L6: two weapon attacks. Then use bonus action for Healing Word or spell. Full action economy.', rating: 'A' },
  { tactic: 'Master\'s Flourish (L14)', detail: 'Free d6 flourish every turn. Save all Inspiration dice for allies. Flourish is now unlimited.', rating: 'S' },
  { tactic: 'Half-plate + Shield + Dueling', detail: '19 AC, +2 damage per hit, still a full caster. Best of both worlds.', rating: 'A' },
  { tactic: 'Magical Secrets melee', detail: 'L10 Magical Secrets: grab Steel Wind Strike, Destructive Wave, or Spirit Guardians for melee.', rating: 'A' },
];

export const SWORDS_VS_VALOR = {
  swords: { pros: ['Blade Flourishes (damage + AC/push/cleave)', 'Fighting Style', 'Extra Attack at L6', 'Master\'s Flourish = free effects', '+10ft speed on attack turns'], cons: ['Can\'t use shield with two-weapon fighting', 'Flourishes use Inspiration (until L14)'] },
  valor: { pros: ['Combat Inspiration (ally uses for AC or damage)', 'Shield proficiency from start', 'Battle Magic at L14 (cast + attack)'], cons: ['No Fighting Style', 'Extra Attack at L6 (same)', 'Inspiration for ALLY defense, not self'] },
  verdict: 'Swords is better for personal combat. Valor is better for party support. Swords is generally preferred.',
};

export function defensiveFlourishAC(baseAC, inspirationDie) {
  const dieAvg = { 6: 3.5, 8: 4.5, 10: 5.5, 12: 6.5 };
  return baseAC + (dieAvg[inspirationDie] || 4.5);
}

export function swordsBardDPR(bardLevel, dexMod, targetAC, useDueling = true) {
  const attacks = bardLevel >= 6 ? 2 : 1;
  const profBonus = Math.min(6, 2 + Math.floor((bardLevel + 3) / 4));
  const attackBonus = dexMod + profBonus;
  const hitChance = Math.min(0.95, Math.max(0.05, (21 - (targetAC - attackBonus)) / 20));
  const damage = 4.5 + dexMod + (useDueling ? 2 : 0); // rapier + DEX + Dueling
  return attacks * hitChance * damage;
}
