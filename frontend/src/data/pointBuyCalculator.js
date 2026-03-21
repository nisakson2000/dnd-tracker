/**
 * Point Buy & Standard Array Calculator — D&D 5e Character Creation
 *
 * Covers roadmap items 68-70 (Point buy calculator, Standard array, Roll 4d6 drop lowest).
 * Ability score generation methods with validation.
 */

const d = (n) => Math.floor(Math.random() * n) + 1;

// ── Point Buy Rules ──
export const POINT_BUY_RULES = {
  totalPoints: 27,
  minScore: 8,
  maxScore: 15,
  costs: {
    8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9,
  },
  defaultScores: { STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 },
};

// ── Standard Array ──
export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

// ── Ability Score Info ──
export const ABILITIES = [
  { abbr: 'STR', name: 'Strength', description: 'Physical power, athletics, melee attacks, carrying capacity' },
  { abbr: 'DEX', name: 'Dexterity', description: 'Agility, reflexes, ranged attacks, AC, stealth, initiative' },
  { abbr: 'CON', name: 'Constitution', description: 'Health, stamina, hit points, concentration saves' },
  { abbr: 'INT', name: 'Intelligence', description: 'Memory, logic, arcana, history, investigation' },
  { abbr: 'WIS', name: 'Wisdom', description: 'Perception, intuition, insight, survival, willpower' },
  { abbr: 'CHA', name: 'Charisma', description: 'Force of personality, persuasion, deception, leadership' },
];

// ── Racial Ability Bonuses (PHB races) ──
export const RACIAL_BONUSES = {
  Human: { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },
  'Variant Human': { choice1: 1, choice2: 1, feat: true },
  'High Elf': { DEX: 2, INT: 1 },
  'Wood Elf': { DEX: 2, WIS: 1 },
  'Dark Elf (Drow)': { DEX: 2, CHA: 1 },
  'Hill Dwarf': { CON: 2, WIS: 1 },
  'Mountain Dwarf': { CON: 2, STR: 2 },
  'Lightfoot Halfling': { DEX: 2, CHA: 1 },
  'Stout Halfling': { DEX: 2, CON: 1 },
  'Forest Gnome': { INT: 2, DEX: 1 },
  'Rock Gnome': { INT: 2, CON: 1 },
  'Half-Elf': { CHA: 2, choice1: 1, choice2: 1 },
  'Half-Orc': { STR: 2, CON: 1 },
  Tiefling: { CHA: 2, INT: 1 },
  Dragonborn: { STR: 2, CHA: 1 },
  'Custom Lineage': { choice1: 2, feat: true },
};

/**
 * Calculate ability modifier from score.
 */
export function getModifier(score) {
  return Math.floor((score - 10) / 2);
}

/**
 * Format modifier as string (+2, -1, etc).
 */
export function formatModifier(score) {
  const mod = getModifier(score);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

/**
 * Calculate point buy cost for a set of scores.
 */
export function calculatePointBuyCost(scores) {
  let total = 0;
  const breakdown = {};
  for (const [ability, score] of Object.entries(scores)) {
    const cost = POINT_BUY_RULES.costs[score];
    if (cost === undefined) return { total: -1, valid: false, reason: `${ability}: ${score} is outside allowed range (8-15)` };
    breakdown[ability] = cost;
    total += cost;
  }
  return {
    total,
    remaining: POINT_BUY_RULES.totalPoints - total,
    valid: total <= POINT_BUY_RULES.totalPoints,
    breakdown,
    reason: total > POINT_BUY_RULES.totalPoints ? `Over budget by ${total - POINT_BUY_RULES.totalPoints} points` : null,
  };
}

/**
 * Roll 4d6 drop lowest for one ability score.
 */
export function roll4d6DropLowest() {
  const rolls = [d(6), d(6), d(6), d(6)];
  rolls.sort((a, b) => b - a);
  const kept = rolls.slice(0, 3);
  const dropped = rolls[3];
  const total = kept.reduce((sum, r) => sum + r, 0);
  return { rolls, kept, dropped, total };
}

/**
 * Generate a full set of 6 ability scores using 4d6 drop lowest.
 */
export function rollAbilityScores() {
  const results = [];
  for (let i = 0; i < 6; i++) {
    results.push(roll4d6DropLowest());
  }
  return {
    results,
    scores: results.map(r => r.total).sort((a, b) => b - a),
    totalModifiers: results.reduce((sum, r) => sum + getModifier(r.total), 0),
  };
}

/**
 * Apply racial bonuses to ability scores.
 */
export function applyRacialBonuses(scores, race, choices = {}) {
  const bonuses = RACIAL_BONUSES[race];
  if (!bonuses) return { ...scores };
  const result = { ...scores };
  for (const [ability, bonus] of Object.entries(bonuses)) {
    if (ability === 'feat') continue;
    if (ability.startsWith('choice')) {
      const chosenAbility = choices[ability];
      if (chosenAbility && result[chosenAbility] !== undefined) {
        result[chosenAbility] += bonus;
      }
    } else if (result[ability] !== undefined) {
      result[ability] += bonus;
    }
  }
  return result;
}

/**
 * Get suggested ability score priority for a class.
 */
export function getSuggestedPriority(className) {
  const priorities = {
    Barbarian: ['STR', 'CON', 'DEX', 'WIS', 'CHA', 'INT'],
    Bard: ['CHA', 'DEX', 'CON', 'WIS', 'INT', 'STR'],
    Cleric: ['WIS', 'CON', 'STR', 'CHA', 'DEX', 'INT'],
    Druid: ['WIS', 'CON', 'DEX', 'INT', 'CHA', 'STR'],
    Fighter: ['STR', 'CON', 'DEX', 'WIS', 'CHA', 'INT'],
    'Fighter (DEX)': ['DEX', 'CON', 'STR', 'WIS', 'CHA', 'INT'],
    Monk: ['DEX', 'WIS', 'CON', 'STR', 'CHA', 'INT'],
    Paladin: ['STR', 'CHA', 'CON', 'WIS', 'DEX', 'INT'],
    Ranger: ['DEX', 'WIS', 'CON', 'STR', 'INT', 'CHA'],
    Rogue: ['DEX', 'CON', 'CHA', 'INT', 'WIS', 'STR'],
    Sorcerer: ['CHA', 'CON', 'DEX', 'WIS', 'INT', 'STR'],
    Warlock: ['CHA', 'CON', 'DEX', 'WIS', 'INT', 'STR'],
    Wizard: ['INT', 'CON', 'DEX', 'WIS', 'CHA', 'STR'],
  };
  return priorities[className] || priorities.Fighter;
}

/**
 * Auto-assign standard array or rolled scores based on class priority.
 */
export function autoAssignScores(scores, className) {
  const priority = getSuggestedPriority(className);
  const sorted = [...scores].sort((a, b) => b - a);
  const assigned = {};
  priority.forEach((ability, i) => {
    assigned[ability] = sorted[i];
  });
  return assigned;
}

/**
 * Check if an ability score is odd (meaning +1 would gain a modifier).
 */
export function isOddScore(score) {
  return score % 2 === 1;
}

/**
 * Get ASI suggestions based on current scores.
 */
export function getASISuggestions(scores, className) {
  const suggestions = [];
  const priority = getSuggestedPriority(className);

  // Check for odd scores in high-priority abilities
  for (const ability of priority.slice(0, 3)) {
    if (isOddScore(scores[ability])) {
      suggestions.push({
        type: 'odd_score',
        ability,
        message: `${ability} is ${scores[ability]} (odd) — +1 gains a modifier!`,
        priority: 'high',
      });
    }
  }

  // Check if any score can be maxed
  for (const ability of priority.slice(0, 2)) {
    if (scores[ability] >= 18 && scores[ability] < 20) {
      suggestions.push({
        type: 'near_max',
        ability,
        message: `${ability} is ${scores[ability]} — close to max 20!`,
        priority: 'medium',
      });
    }
  }

  // Suggest feat if scores are already good
  const primaryMod = getModifier(scores[priority[0]]);
  if (primaryMod >= 4) {
    suggestions.push({
      type: 'feat',
      message: `Primary ${priority[0]} is already strong (+${primaryMod}). Consider a feat instead.`,
      priority: 'medium',
    });
  }

  return suggestions;
}
