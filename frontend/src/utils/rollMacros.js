/**
 * Roll Macros — Save and reuse frequently used rolls.
 * Macros include full context: attack bonus, damage dice, damage type.
 */

const STORAGE_KEY = 'codex_roll_macros';

const d = (sides) => Math.floor(Math.random() * sides) + 1;

/**
 * Parse a dice expression like "2d6+3" or "1d20+5"
 * Returns { count, sides, modifier, expression }
 */
export function parseDiceExpression(expr) {
  const match = expr.trim().match(/^(\d+)?d(\d+)([+-]\d+)?$/i);
  if (!match) return null;
  return {
    count: parseInt(match[1]) || 1,
    sides: parseInt(match[2]),
    modifier: parseInt(match[3]) || 0,
    expression: expr.trim(),
  };
}

/**
 * Roll a parsed dice expression.
 * Returns { rolls, total, expression, critical, fumble }
 */
export function rollExpression(expr) {
  const parsed = typeof expr === 'string' ? parseDiceExpression(expr) : expr;
  if (!parsed) return { rolls: [], total: 0, expression: expr, error: 'Invalid expression' };

  const rolls = Array.from({ length: parsed.count }, () => d(parsed.sides));
  const total = rolls.reduce((a, b) => a + b, 0) + parsed.modifier;

  return {
    rolls,
    total,
    expression: parsed.expression,
    modifier: parsed.modifier,
    critical: parsed.sides === 20 && parsed.count === 1 && rolls[0] === 20,
    fumble: parsed.sides === 20 && parsed.count === 1 && rolls[0] === 1,
  };
}

/**
 * Roll with advantage (2d20, take highest) or disadvantage (take lowest).
 */
export function rollWithAdvantage(modifier = 0, type = 'advantage') {
  const roll1 = d(20);
  const roll2 = d(20);
  const chosen = type === 'advantage' ? Math.max(roll1, roll2) : Math.min(roll1, roll2);
  return {
    roll1,
    roll2,
    chosen,
    total: chosen + modifier,
    type,
    critical: chosen === 20,
    fumble: chosen === 1,
  };
}

// ── Macro CRUD ──

export function loadMacros() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export function saveMacros(macros) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(macros));
}

export function addMacro(macro) {
  const macros = loadMacros();
  const newMacro = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: macro.name || 'Unnamed Roll',
    expression: macro.expression || '1d20',
    damageType: macro.damageType || null,
    attackBonus: macro.attackBonus || null,
    description: macro.description || '',
    category: macro.category || 'general',
    createdAt: new Date().toISOString(),
  };
  macros.push(newMacro);
  saveMacros(macros);
  return newMacro;
}

export function deleteMacro(id) {
  const macros = loadMacros().filter(m => m.id !== id);
  saveMacros(macros);
}

export function executeMacro(macro) {
  const result = rollExpression(macro.expression);
  return {
    ...result,
    macroName: macro.name,
    damageType: macro.damageType,
    attackBonus: macro.attackBonus,
    executedAt: new Date().toISOString(),
  };
}

// ── Preset Macros ──
export const PRESET_MACROS = [
  { name: 'Longsword Attack', expression: '1d20+5', damageType: null, category: 'attack', description: 'Standard longsword attack roll' },
  { name: 'Longsword Damage', expression: '1d8+3', damageType: 'slashing', category: 'damage', description: 'Longsword damage (one-handed)' },
  { name: 'Greatsword Damage', expression: '2d6+4', damageType: 'slashing', category: 'damage', description: 'Greatsword damage' },
  { name: 'Fireball', expression: '8d6', damageType: 'fire', category: 'spell', description: 'Fireball damage (3rd level)' },
  { name: 'Healing Word', expression: '1d4+3', damageType: 'healing', category: 'spell', description: 'Healing Word (1st level)' },
  { name: 'Sneak Attack (3rd)', expression: '2d6', damageType: 'same as weapon', category: 'feature', description: 'Sneak Attack at 3rd level' },
  { name: 'Eldritch Blast', expression: '1d10+4', damageType: 'force', category: 'cantrip', description: 'Eldritch Blast with Agonizing Blast' },
  { name: 'Short Bow', expression: '1d6+3', damageType: 'piercing', category: 'damage', description: 'Shortbow damage' },
  { name: 'Ability Check', expression: '1d20', damageType: null, category: 'check', description: 'Basic d20 roll' },
  { name: 'Hit Dice (d10)', expression: '1d10+2', damageType: 'healing', category: 'rest', description: 'Short rest hit die + CON mod' },
];
