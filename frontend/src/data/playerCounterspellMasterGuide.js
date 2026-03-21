/**
 * playerCounterspellMasterGuide.js
 * Player Mode: Counterspell — the spell duel
 * Pure JS — no React dependencies.
 */

export const COUNTERSPELL_BASICS = {
  spell: 'Counterspell',
  level: 3,
  castTime: '1 reaction (see creature within 60ft cast a spell)',
  range: '60ft',
  classes: ['Sorcerer', 'Warlock', 'Wizard'],
  note: 'Auto-counter ≤ L3 spells. Higher: ability check DC 10 + spell level. THE most important high-level spell.',
};

export const COUNTERSPELL_MATH = [
  { targetLevel: 4, dc: 14 }, { targetLevel: 5, dc: 15 }, { targetLevel: 6, dc: 16 },
  { targetLevel: 7, dc: 17 }, { targetLevel: 8, dc: 18 }, { targetLevel: 9, dc: 19 },
];

export const COUNTERSPELL_BOOSTERS = [
  { source: 'Upcast', effect: 'Match level = auto-counter.' },
  { source: 'Abjuration Wiz L10', effect: '+PB to abjuration checks.' },
  { source: 'Jack of All Trades', effect: '+half PB to check.' },
  { source: 'Glibness (Bard L8)', effect: 'Min roll 15. Auto-counter L9 spells with CHA +5.' },
  { source: 'Subtle Spell', effect: 'Can\'t be counter-Counterspelled.' },
];

export const COUNTERSPELL_TACTICS = [
  { tactic: 'Subtle Spell CS', detail: 'Enemy can\'t see you casting = can\'t counter your counter.', rating: 'S' },
  { tactic: 'Save for big spells', detail: 'Don\'t CS cantrips. Save for Fireball, Banishment, PWK.', rating: 'S' },
  { tactic: 'Position within 60ft', detail: 'Stay in range of enemy casters.', rating: 'A' },
  { tactic: 'Upcast to guarantee', detail: 'Don\'t gamble on PWK. Match the spell level.', rating: 'S' },
  { tactic: 'Two party members with CS', detail: 'Counter the counter-counterspell. Wins CS wars.', rating: 'S' },
];

export function counterspellDC(targetLevel) {
  return 10 + targetLevel;
}

export function passChance(castingMod, dc, bonusFromFeatures = 0) {
  const bonus = castingMod + bonusFromFeatures;
  return Math.min(1, Math.max(0.05, (21 - (dc - bonus)) / 20));
}
