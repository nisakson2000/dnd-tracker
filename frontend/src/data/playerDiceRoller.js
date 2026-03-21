/**
 * playerDiceRoller.js
 * Player Mode: Dice rolling utilities and probability reference
 * Pure JS — no React dependencies.
 */

export const DICE_TYPES = [
  { die: 'd4', sides: 4, average: 2.5, color: '#4caf50', uses: 'Dagger, Guidance, Bless, Light crossbow' },
  { die: 'd6', sides: 6, average: 3.5, color: '#2196f3', uses: 'Shortsword, Sneak Attack, Fireball, most common' },
  { die: 'd8', sides: 8, average: 4.5, color: '#9c27b0', uses: 'Longsword, Rapier, most hit dice, Healing Word' },
  { die: 'd10', sides: 10, average: 5.5, color: '#ff9800', uses: 'Fighter/Paladin/Ranger hit dice, Eldritch Blast, Fire Bolt' },
  { die: 'd12', sides: 12, average: 6.5, color: '#f44336', uses: 'Greataxe, Barbarian hit dice, Witch Bolt' },
  { die: 'd20', sides: 20, average: 10.5, color: '#e91e63', uses: 'Attacks, saves, ability checks — THE die' },
  { die: 'd100', sides: 100, average: 50.5, color: '#607d8b', uses: 'Wild Magic, random tables, percentile rolls' },
];

export const COMMON_ROLLS = [
  { name: 'Attack Roll', formula: '1d20 + ability mod + proficiency', description: 'vs target AC' },
  { name: 'Damage Roll', formula: 'weapon die + ability mod', description: 'STR for melee, DEX for ranged/finesse' },
  { name: 'Saving Throw', formula: '1d20 + ability mod (+ proficiency if proficient)', description: 'vs effect DC' },
  { name: 'Ability Check', formula: '1d20 + ability mod (+ proficiency if proficient) (+ expertise if applicable)', description: 'vs DC' },
  { name: 'Initiative', formula: '1d20 + DEX mod', description: 'Determines turn order' },
  { name: 'Death Save', formula: '1d20 (unmodified)', description: '10+ success, 9- failure, nat 1 = 2 fails, nat 20 = 1 HP' },
  { name: 'Hit Dice', formula: 'class die + CON mod per die', description: 'Short rest healing' },
  { name: 'Concentration', formula: '1d20 + CON save', description: 'vs DC 10 or half damage taken (whichever higher)' },
];

export const ADVANTAGE_MATH = {
  advantage: 'Average d20 roll goes from 10.5 to ~13.8 (roughly +3.3)',
  disadvantage: 'Average d20 roll goes from 10.5 to ~7.2 (roughly -3.3)',
  superAdvantage: 'Elven Accuracy: roll 3, keep highest. Average ~15.5',
  note: 'Advantage is roughly equivalent to +5 to the roll.',
};

export function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

export function rollDice(count, sides) {
  const rolls = [];
  for (let i = 0; i < count; i++) {
    rolls.push(rollDie(sides));
  }
  return { rolls, total: rolls.reduce((a, b) => a + b, 0), count, sides };
}

export function rollWithAdvantage(sides) {
  const r1 = rollDie(sides);
  const r2 = rollDie(sides);
  return { roll1: r1, roll2: r2, result: Math.max(r1, r2), type: 'advantage' };
}

export function rollWithDisadvantage(sides) {
  const r1 = rollDie(sides);
  const r2 = rollDie(sides);
  return { roll1: r1, roll2: r2, result: Math.min(r1, r2), type: 'disadvantage' };
}

export function parseRollExpression(expr) {
  // Parse "2d6+3" style expressions
  const match = (expr || '').match(/^(\d+)?d(\d+)([+-]\d+)?$/i);
  if (!match) return null;
  const count = parseInt(match[1] || '1');
  const sides = parseInt(match[2]);
  const modifier = parseInt(match[3] || '0');
  return { count, sides, modifier };
}

export function executeRoll(expr) {
  const parsed = parseRollExpression(expr);
  if (!parsed) return null;
  const result = rollDice(parsed.count, parsed.sides);
  return { ...result, modifier: parsed.modifier, grandTotal: result.total + parsed.modifier, expression: expr };
}
