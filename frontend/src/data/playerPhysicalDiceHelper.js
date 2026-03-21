/**
 * playerPhysicalDiceHelper.js
 * Player Mode: Physical dice rolling reference, probability, and notation
 * Pure JS — no React dependencies.
 */

export const DICE_NOTATION = {
  format: 'XdY+Z — Roll X dice with Y sides, add Z',
  examples: [
    { notation: '1d20', meaning: 'Roll one 20-sided die', use: 'Attack rolls, saves, ability checks' },
    { notation: '2d6+3', meaning: 'Roll two 6-sided dice, add 3', use: 'Greatsword damage + STR mod' },
    { notation: '8d6', meaning: 'Roll eight 6-sided dice', use: 'Fireball damage' },
    { notation: '4d6 drop lowest', meaning: 'Roll four d6, remove the lowest result', use: 'Ability score generation' },
    { notation: '1d20+7', meaning: 'Roll d20, add 7 to the result', use: 'Attack roll with +7 modifier' },
  ],
};

export const DICE_STATISTICS = [
  { die: 'd4', sides: 4, average: 2.5, min: 1, max: 4, uses: 'Dagger damage, Guidance, Bless' },
  { die: 'd6', sides: 6, average: 3.5, min: 1, max: 6, uses: 'Shortsword, Fireball (per die), Sneak Attack' },
  { die: 'd8', sides: 8, average: 4.5, min: 1, max: 8, uses: 'Longsword, Cure Wounds, most hit dice' },
  { die: 'd10', sides: 10, average: 5.5, min: 1, max: 10, uses: 'Heavy crossbow, Fire Bolt (higher levels), Fighter hit die' },
  { die: 'd12', sides: 12, average: 6.5, min: 1, max: 12, uses: 'Greataxe, Barbarian hit die, Witch Bolt' },
  { die: 'd20', sides: 20, average: 10.5, min: 1, max: 20, uses: 'Attack rolls, saves, ability checks — THE die' },
  { die: 'd100', sides: 100, average: 50.5, min: 1, max: 100, uses: 'Percentile rolls, Wild Magic Surge, random tables' },
];

export const PROBABILITY_REFERENCE = {
  d20: [
    { target: 2, chance: '95% (only nat 1 misses)' },
    { target: 5, chance: '80%' },
    { target: 8, chance: '65%' },
    { target: 10, chance: '55%' },
    { target: 11, chance: '50% (coin flip)' },
    { target: 13, chance: '40%' },
    { target: 15, chance: '30%' },
    { target: 17, chance: '20%' },
    { target: 19, chance: '10%' },
    { target: 20, chance: '5% (nat 20)' },
  ],
  advantage: 'Rolling with advantage ≈ +5 to your roll on average. 9.5% chance of nat 20.',
  disadvantage: 'Rolling with disadvantage ≈ -5 to your roll on average. 0.25% chance of nat 20.',
};

export const COMMON_ROLLS_QUICK_REF = [
  { situation: 'Attack with +5 vs AC 15', needed: '10+', chance: '55%', withAdvantage: '80%' },
  { situation: 'Attack with +7 vs AC 16', needed: '9+', chance: '60%', withAdvantage: '84%' },
  { situation: 'Save with +3 vs DC 15', needed: '12+', chance: '45%', withAdvantage: '70%' },
  { situation: 'Save with +5 vs DC 13', needed: '8+', chance: '65%', withAdvantage: '88%' },
  { situation: 'Ability check +4 vs DC 15', needed: '11+', chance: '50%', withAdvantage: '75%' },
  { situation: 'Concentration save +5 vs DC 10', needed: '5+', chance: '80%', withAdvantage: '96%' },
];

export const CRITICAL_RULES = {
  nat20Attack: 'Natural 20 = automatic HIT regardless of AC. Roll all damage dice TWICE (then add modifiers once).',
  nat1Attack: 'Natural 1 = automatic MISS regardless of modifiers. No extra penalty by RAW.',
  nat20Save: 'NOT auto-success on saves (RAW). Many tables house-rule it as auto-success.',
  nat1Save: 'NOT auto-failure on saves (RAW). Many tables house-rule it.',
  nat20Check: 'NOT auto-success on ability checks (RAW). DC 30 with +2 still fails on nat 20.',
  critDamage: 'Double the number of damage dice. Example: 2d6+4 becomes 4d6+4 on a crit.',
};

export function calculateHitChance(attackBonus, targetAC) {
  const needed = targetAC - attackBonus;
  if (needed <= 1) return 95; // nat 1 always misses
  if (needed > 20) return 5; // nat 20 always hits
  return (21 - needed) * 5;
}

export function calculateAdvantageChance(attackBonus, targetAC) {
  const baseChance = calculateHitChance(attackBonus, targetAC) / 100;
  return Math.round((1 - Math.pow(1 - baseChance, 2)) * 100);
}

export function averageDamage(numDice, dieSize, modifier) {
  return (numDice * ((dieSize + 1) / 2)) + (modifier || 0);
}

export function critDamage(numDice, dieSize, modifier) {
  return (numDice * 2 * ((dieSize + 1) / 2)) + (modifier || 0);
}
