/**
 * Shared dice utility functions.
 * Extracted from DiceRoller.jsx for reuse across components.
 */

export function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

/**
 * Roll multiple dice and return the sum.
 */
export function rollDice(count, sides) {
  let total = 0;
  for (let i = 0; i < count; i++) total += rollDie(sides);
  return total;
}

/**
 * Advanced expression parser.
 * Supports: 2d6+1d8+5, 4d6kh3, 2d20kl1, flat modifiers, subtraction
 * Returns null on invalid input.
 *
 * Result: { groups: [{ count, sides, keep, keepMode, rolls, kept, subtotal }], modifier, total, breakdownParts }
 */
export function parseAndRollExpression(expr) {
  const cleaned = expr.replace(/\s+/g, '').toLowerCase();
  if (!cleaned) return null;

  const tokens = [];
  let current = '';
  let sign = '+';
  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if ((ch === '+' || ch === '-') && i > 0) {
      tokens.push({ sign, token: current });
      sign = ch;
      current = '';
    } else if (ch === '+' || ch === '-') {
      sign = ch;
    } else {
      current += ch;
    }
  }
  if (current) tokens.push({ sign, token: current });

  if (tokens.length === 0) return null;

  const groups = [];
  let flatModifier = 0;
  let totalResult = 0;
  const breakdownParts = [];

  for (const { sign, token } of tokens) {
    const signMul = sign === '-' ? -1 : 1;

    const diceMatch = token.match(/^(\d+)?d(\d+)(?:k([hl])(\d+))?$/);
    if (diceMatch) {
      const count = parseInt(diceMatch[1]) || 1;
      const sides = parseInt(diceMatch[2]) || 6;
      const keepMode = diceMatch[3] || null;
      const keepCount = diceMatch[4] ? parseInt(diceMatch[4]) : null;

      if (count > 100 || sides > 1000 || count < 1 || sides < 1) return null;
      if (keepCount !== null && (keepCount < 1 || keepCount > count)) return null;

      const rolls = Array.from({ length: count }, () => rollDie(sides));
      let kept = [...rolls];
      let dropped = [];

      if (keepMode && keepCount !== null) {
        const sorted = rolls.map((v, i) => ({ v, i })).sort((a, b) => b.v - a.v);
        if (keepMode === 'h') {
          const keptIndices = new Set(sorted.slice(0, keepCount).map(x => x.i));
          kept = rolls.filter((_, i) => keptIndices.has(i));
          dropped = rolls.map((v, i) => ({ v, i, drop: !keptIndices.has(i) }));
        } else {
          const keptIndices = new Set(sorted.slice(-keepCount).map(x => x.i));
          kept = rolls.filter((_, i) => keptIndices.has(i));
          dropped = rolls.map((v, i) => ({ v, i, drop: !keptIndices.has(i) }));
        }
      }

      const subtotal = kept.reduce((s, v) => s + v, 0) * signMul;
      totalResult += subtotal;

      let bk = `[${rolls.map((v, i) => {
        if (dropped.length > 0) {
          const info = dropped.find(d => d.i === i);
          return info && info.drop ? `~~${v}~~` : `**${v}**`;
        }
        return String(v);
      }).join(', ')}]`;
      if (keepMode) {
        bk += ` keep ${keepMode === 'h' ? 'highest' : 'lowest'} ${keepCount}`;
      }

      groups.push({
        count, sides, keepMode, keepCount, rolls, kept, dropped,
        subtotal: Math.abs(subtotal), sign: signMul,
        expr: `${count}d${sides}${keepMode ? `k${keepMode}${keepCount}` : ''}`,
      });

      breakdownParts.push(`${sign === '-' ? '- ' : (breakdownParts.length > 0 ? '+ ' : '')}${bk}`);
    } else {
      const num = parseInt(token);
      if (isNaN(num)) return null;
      flatModifier += num * signMul;
      totalResult += num * signMul;
      breakdownParts.push(`${sign === '-' ? '- ' : (breakdownParts.length > 0 ? '+ ' : '')}${num}`);
    }
  }

  if (groups.length === 0 && flatModifier === 0) return null;

  return { groups, modifier: flatModifier, total: totalResult, breakdownParts };
}

/**
 * Validate an expression string without rolling it.
 */
export function validateExpression(expr) {
  const cleaned = expr.replace(/\s+/g, '').toLowerCase();
  if (!cleaned) return false;
  const pattern = /^[+-]?(\d*d\d+(k[hl]\d+)?|\d+)([+-](\d*d\d+(k[hl]\d+)?|\d+))*$/;
  return pattern.test(cleaned);
}
