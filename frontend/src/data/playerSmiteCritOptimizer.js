/**
 * playerSmiteCritOptimizer.js
 * Player Mode: Smite optimization, crit fishing, and damage nova calculations
 * Pure JS — no React dependencies.
 */

export const SMITE_DAMAGE_TABLE = [
  { slot: 1, baseDice: '2d8', avgDamage: 9, critDice: '4d8', critAvg: 18, note: 'Minimum smite. Good for trash mobs.' },
  { slot: 2, baseDice: '3d8', avgDamage: 13.5, critDice: '6d8', critAvg: 27, note: 'Sweet spot for most fights.' },
  { slot: 3, baseDice: '4d8', avgDamage: 18, critDice: '8d8', critAvg: 36, note: 'Big hits. Save for important targets.' },
  { slot: 4, baseDice: '5d8', avgDamage: 22.5, critDice: '10d8', critAvg: 45, note: 'Max. Only for boss crits.' },
];

export const SMITE_RULES = {
  timing: 'Declare AFTER you hit (not before rolling). Perfect for crits.',
  maxDice: '5d8 base maximum (4th-level slot or higher). +1d8 vs undead/fiend.',
  crit: 'All smite dice are doubled on a critical hit.',
  weaponRequired: 'Must hit with a MELEE WEAPON attack. Not spell attacks.',
  stacking: 'Can stack with Smite spells (Thunderous, Wrathful, Branding).',
  multiattack: 'Can smite on EACH hit, but watch your spell slots.',
};

export const CRIT_FISHING_METHODS = [
  { method: 'Champion Fighter 3 / Paladin X', benefit: 'Crit on 19-20. Doubled smite dice on crits.', rating: 'A' },
  { method: 'Elven Accuracy', benefit: 'Roll 3 dice with advantage. ~14% crit chance per attack.', rating: 'S' },
  { method: 'Hold Person / Hold Monster', benefit: 'Paralyzed = auto-crit within 5ft. Guaranteed smite crit.', rating: 'S' },
  { method: 'Greater Invisibility / Darkness + Devil\'s Sight', benefit: 'Advantage on all attacks = double crit chance.', rating: 'A' },
  { method: 'Oath of Vengeance: Vow of Enmity', benefit: 'Advantage on ALL attacks vs one target for 1 minute.', rating: 'A' },
];

export const NOVA_ROUND_EXAMPLE = {
  setup: 'Paladin 11 / Fighter 2 — Action Surge turn vs paralyzed target',
  attacks: '3 attacks (Extra Attack) + 3 attacks (Action Surge) = 6 attacks',
  allCrit: 'All auto-crit (paralyzed). Each smite at 2nd level = 6d8 per hit.',
  totalDice: '6 attacks × (weapon die + 6d8 smite) = potentially 36d8 + 6 weapon dice + 6×STR',
  averageDamage: '~200+ damage in one round.',
  note: 'This is the Paladin fantasy. Save slots for this moment.',
};

export function calculateSmiteDamage(slotLevel, isCrit, isUndead) {
  const baseDice = Math.min(1 + slotLevel, 5);
  const undeadBonus = isUndead ? 1 : 0;
  const totalDice = baseDice + undeadBonus;
  const diceAfterCrit = isCrit ? totalDice * 2 : totalDice;
  return {
    dice: `${diceAfterCrit}d8`,
    average: diceAfterCrit * 4.5,
    minimum: diceAfterCrit,
    maximum: diceAfterCrit * 8,
    isCrit,
    slotUsed: slotLevel,
  };
}

export function shouldSmite(slotLevel, remainingSlots, isCrit, isImportantTarget) {
  if (isCrit) return { should: true, reason: 'Always smite on crits. Double all dice.' };
  if (isImportantTarget && remainingSlots > 2) return { should: true, reason: 'Important target and you have slots to spare.' };
  if (remainingSlots <= 1) return { should: false, reason: 'Save your last slot for Healing Word or emergency smite crit.' };
  if (slotLevel >= 3 && !isCrit) return { should: false, reason: 'Don\'t use 3rd+ slots without a crit. Use 1st or 2nd instead.' };
  return { should: true, reason: 'Reasonable use of resources.' };
}
