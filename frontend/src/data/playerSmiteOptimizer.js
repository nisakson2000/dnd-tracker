/**
 * playerSmiteOptimizer.js
 * Player Mode: Paladin Divine Smite rules, optimization, and slot management
 * Pure JS — no React dependencies.
 */

export const DIVINE_SMITE_RULES = {
  trigger: 'Hit with melee weapon → expend slot → extra radiant damage.',
  damage: '2d8 for 1st slot, +1d8 per level above (max 5d8).',
  undeadBonus: '+1d8 vs undead/fiends (max 6d8).',
  timing: 'AFTER hit. Know it landed before deciding.',
  critSmite: 'Smite dice doubled on crit. 2d8 → 4d8.',
  notASpell: 'Not a spell. No concentration. Stacks with everything.',
};

export const SMITE_TABLE = [
  { slot: 1, dice: '2d8', avg: 9, critAvg: 18 },
  { slot: 2, dice: '3d8', avg: 13.5, critAvg: 27 },
  { slot: 3, dice: '4d8', avg: 18, critAvg: 36 },
  { slot: 4, dice: '5d8', avg: 22.5, critAvg: 45 },
];

export const SMITE_TIPS = [
  { tip: 'Smite on crits', detail: 'Save highest slot for crits. Doubled dice = devastating.', priority: 'S' },
  { tip: 'Don\'t smite every hit', detail: 'Limited slots. Save for crits and killing blows.', priority: 'S' },
  { tip: '1st-level efficiency', detail: '2d8 for 1st slot = 9 avg. Spread across more hits.', priority: 'A' },
  { tip: 'Undead/Fiend bonus', detail: '+1d8 extra. 2nd slot vs undead = 4d8 (18 avg).', priority: 'S' },
  { tip: 'Stack with Smite spells', detail: 'Divine Smite + Thunderous/Wrathful Smite stack.', priority: 'A' },
  { tip: 'Sorcadin multiclass', detail: 'Sorcerer slots fuel smites. More slots = more power.', priority: 'S' },
];

export const IMPROVED_DIVINE_SMITE = {
  level: 11,
  effect: '+1d8 radiant on every melee hit. Free. No slot.',
  note: 'Stacks with regular Divine Smite.',
};

export function smiteDamage(slotLevel, isUndead, isCrit) {
  let dice = Math.min(5, 1 + slotLevel);
  if (isUndead) dice = Math.min(6, dice + 1);
  if (isCrit) dice *= 2;
  return dice * 4.5;
}

export function smiteBurst(slotLevel, weaponDmg, isUndead, isCrit) {
  return weaponDmg + smiteDamage(slotLevel, isUndead, isCrit);
}
