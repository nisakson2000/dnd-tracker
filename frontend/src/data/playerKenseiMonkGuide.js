/**
 * playerKenseiMonkGuide.js
 * Player Mode: Way of the Kensei Monk — weapon master monk
 * Pure JS — no React dependencies.
 */

export const KENSEI_BASICS = {
  class: 'Monk (Way of the Kensei)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Weapon master. Use longswords, longbows, and more as monk weapons.',
  note: 'Best ranged monk. Longbow monk is legitimate. Kensei weapons give better damage dice than unarmed.',
};

export const KENSEI_FEATURES = [
  { feature: 'Kensei Weapons', level: 3, effect: 'Choose 2 weapons (1 melee, 1 ranged, no heavy/special). They become monk weapons. Gain painter/calligrapher tools.', note: 'Longsword (1d8/1d10 versatile) and Longbow (1d8, 150/600ft). Gain more at L6, 11, 17.' },
  { feature: 'Agile Parry', level: 3, effect: 'If you make an unarmed strike as part of Attack action and hold a kensei melee weapon: +2 AC until start of next turn.', note: '+2 AC every turn. Attack with weapon, unarmed strike as second attack (or Flurry). 2 more AC than normal monk.' },
  { feature: 'Kensei\'s Shot', level: 3, effect: 'Bonus action: ranged kensei weapon attacks deal +1d4 damage this turn.', note: 'Bonus action +1d4 to ranged attacks. Good for Longbow turns.' },
  { feature: 'One with the Blade', level: 6, effect: 'Kensei weapon attacks count as magical. Spend 1 ki when you hit: +2d6 damage (Deft Strike).', note: 'Magic weapons (free) + 2d6 burst damage for 1 ki. Like a mini-Smite.' },
  { feature: 'Sharpen the Blade', level: 11, effect: 'Bonus action: spend 1-3 ki. Kensei weapon gets +1/+2/+3 bonus to attack and damage for 1 minute.', note: '+3 weapon for 3 ki. Concentration, but monk doesn\'t have many concentration abilities.' },
  { feature: 'Unerring Accuracy', level: 17, effect: 'Once per turn, reroll a missed attack with a monk weapon.', note: 'Free reroll. Significantly increases hit rate for Stunning Strike turns.' },
];

export const KENSEI_TACTICS = [
  { tactic: 'Agile Parry AC', detail: 'Melee: weapon attack + unarmed strike → +2 AC. With 20 DEX + 20 WIS: 20 base + 2 = 22 AC. No armor.', rating: 'A', note: 'Highest AC monk build. But costs one attack being unarmed (lower damage).' },
  { tactic: 'Longbow monk', detail: 'Longbow (1d8+DEX) at 150ft range. Kensei\'s Shot (+1d4). Deft Strike (+2d6). Long-range damage.', rating: 'A', note: 'Only monk that can function as a ranged character. 150ft range.' },
  { tactic: 'Sharpen the Blade burst', detail: 'Spend 3 ki: +3 to attack and damage for 1 minute. Every attack is +3. Stacks with magic weapons... wait, no — only on nonmagical.', rating: 'A', note: 'Doesn\'t work on already-magical weapons. Best with mundane kensei weapons.' },
  { tactic: 'Deft Strike + Stunning Strike', detail: 'Hit with kensei weapon → Deft Strike (1 ki, +2d6) → then Stunning Strike (1 ki, CON save). Stack effects.', rating: 'A' },
  { tactic: 'Ranged Stunning Strike', detail: 'Longbow hit → Stunning Strike. Stun from 150ft away. Only Kensei can do this reliably.', rating: 'S', note: 'Ranged Stunning Strike is unique to Kensei. Incredible.' },
];

export const KENSEI_WEAPON_PICKS = [
  { weapon: 'Longsword', type: 'Melee', damage: '1d8/1d10 versatile', note: 'Best melee kensei weapon. Versatile for 1d10 two-handed when not using Agile Parry.', rating: 'S' },
  { weapon: 'Longbow', type: 'Ranged', damage: '1d8, 150/600ft', note: 'Best ranged option. 150ft range. d8 damage. Essential pick.', rating: 'S' },
  { weapon: 'Whip', type: 'Melee', damage: '1d4, reach', note: '10ft reach monk weapon. Niche but fun for Sentinel builds.', rating: 'B' },
  { weapon: 'Rapier', type: 'Melee', damage: '1d8, finesse', note: 'Same as longsword but finesse (already using DEX). No versatile. Equal to longsword for monks.', rating: 'A' },
  { weapon: 'Hand crossbow', type: 'Ranged', damage: '1d6, 30/120ft', note: 'Shorter range than longbow. Only pick if you want CBE feat (but monks don\'t need it).', rating: 'C' },
];

export function kenseiAC(dexMod, wisMod, agileParry = true) {
  return 10 + dexMod + wisMod + (agileParry ? 2 : 0);
}

export function deftStrikeDamage() {
  return 7; // 2d6 average
}

export function sharpenBonus(kiSpent) {
  return Math.min(3, Math.max(0, kiSpent)); // +1 to +3
}
