/**
 * playerAbilityScoreReference.js
 * Player Mode: Ability score modifiers, point buy, and standard array
 * Pure JS — no React dependencies.
 */

export const ABILITY_MODIFIER_TABLE = [
  { score: 1, modifier: -5 },
  { score: 2, modifier: -4 }, { score: 3, modifier: -4 },
  { score: 4, modifier: -3 }, { score: 5, modifier: -3 },
  { score: 6, modifier: -2 }, { score: 7, modifier: -2 },
  { score: 8, modifier: -1 }, { score: 9, modifier: -1 },
  { score: 10, modifier: 0 }, { score: 11, modifier: 0 },
  { score: 12, modifier: 1 }, { score: 13, modifier: 1 },
  { score: 14, modifier: 2 }, { score: 15, modifier: 2 },
  { score: 16, modifier: 3 }, { score: 17, modifier: 3 },
  { score: 18, modifier: 4 }, { score: 19, modifier: 4 },
  { score: 20, modifier: 5 }, { score: 21, modifier: 5 },
  { score: 22, modifier: 6 }, { score: 23, modifier: 6 },
  { score: 24, modifier: 7 }, { score: 25, modifier: 7 },
  { score: 26, modifier: 8 }, { score: 27, modifier: 8 },
  { score: 28, modifier: 9 }, { score: 29, modifier: 9 },
  { score: 30, modifier: 10 },
];

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

export const POINT_BUY = {
  totalPoints: 27,
  minScore: 8,
  maxScore: 15,
  costs: { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 },
};

export const ABILITY_DESCRIPTIONS = [
  { ability: 'STR', name: 'Strength', skills: ['Athletics'], saves: 'Physical force, grapple, shove', combat: 'Melee attack/damage (or ranged thrown)' },
  { ability: 'DEX', name: 'Dexterity', skills: ['Acrobatics', 'Sleight of Hand', 'Stealth'], saves: 'Dodge, reflex (fireballs, traps)', combat: 'Ranged attack/damage, finesse weapons, AC, initiative' },
  { ability: 'CON', name: 'Constitution', skills: [], saves: 'Endurance, poison, concentration', combat: 'HP per level, concentration saves' },
  { ability: 'INT', name: 'Intelligence', skills: ['Arcana', 'History', 'Investigation', 'Nature', 'Religion'], saves: 'Mental attacks (rare)', combat: 'Wizard spellcasting' },
  { ability: 'WIS', name: 'Wisdom', skills: ['Animal Handling', 'Insight', 'Medicine', 'Perception', 'Survival'], saves: 'Charm, fear, wisdom-based effects', combat: 'Cleric/Druid/Ranger spellcasting, Passive Perception' },
  { ability: 'CHA', name: 'Charisma', skills: ['Deception', 'Intimidation', 'Performance', 'Persuasion'], saves: 'Banishment, charm, social magic', combat: 'Bard/Paladin/Sorcerer/Warlock spellcasting' },
];

export function getModifier(score) {
  return Math.floor((score - 10) / 2);
}

export function formatModifier(score) {
  const mod = getModifier(score);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function getPointBuyCost(score) {
  return POINT_BUY.costs[score] ?? null;
}

export function calculatePointBuyRemaining(scores) {
  let spent = 0;
  for (const score of Object.values(scores)) {
    const cost = getPointBuyCost(score);
    if (cost !== null) spent += cost;
  }
  return POINT_BUY.totalPoints - spent;
}
