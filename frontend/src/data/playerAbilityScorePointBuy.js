/**
 * playerAbilityScorePointBuy.js
 * Player Mode: Point buy calculator and standard array reference
 * Pure JS — no React dependencies.
 */

export const POINT_BUY_COSTS = [
  { score: 8, cost: 0 },
  { score: 9, cost: 1 },
  { score: 10, cost: 2 },
  { score: 11, cost: 3 },
  { score: 12, cost: 4 },
  { score: 13, cost: 5 },
  { score: 14, cost: 7 },
  { score: 15, cost: 9 },
];

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

export const POINT_BUY_TOTAL = 27;

export const ABILITY_PRIORITY_BY_CLASS = {
  Barbarian: { primary: 'STR', secondary: 'CON', dump: ['INT', 'CHA'], note: 'DEX 14 for medium armor.' },
  Bard: { primary: 'CHA', secondary: 'DEX', dump: ['STR'], note: 'CON 14+ for concentration.' },
  Cleric: { primary: 'WIS', secondary: 'CON', dump: ['INT', 'CHA'], note: 'STR 15 for heavy armor (some domains).' },
  Druid: { primary: 'WIS', secondary: 'CON', dump: ['STR', 'CHA'], note: 'DEX 14 for medium armor.' },
  Fighter: { primary: 'STR or DEX', secondary: 'CON', dump: ['INT', 'CHA'], note: 'Choose STR for GWM, DEX for ranged/finesse.' },
  Monk: { primary: 'DEX', secondary: 'WIS', dump: ['STR', 'INT', 'CHA'], note: 'CON matters but can be tertiary.' },
  Paladin: { primary: 'STR', secondary: 'CHA', dump: ['INT'], note: 'CON 14+. CHA for saves aura + smite spells.' },
  Ranger: { primary: 'DEX', secondary: 'WIS', dump: ['STR', 'INT', 'CHA'], note: 'CON 14 minimum.' },
  Rogue: { primary: 'DEX', secondary: 'CON', dump: ['STR', 'INT'], note: 'CHA or WIS as tertiary for skills.' },
  Sorcerer: { primary: 'CHA', secondary: 'CON', dump: ['STR'], note: 'DEX 14 for AC. CON for concentration.' },
  Warlock: { primary: 'CHA', secondary: 'CON', dump: ['STR'], note: 'Hexblade can dump DEX too.' },
  Wizard: { primary: 'INT', secondary: 'CON', dump: ['STR', 'CHA'], note: 'DEX 14 for AC. CON for concentration.' },
};

export function getPointCost(score) {
  const entry = POINT_BUY_COSTS.find(p => p.score === score);
  return entry ? entry.cost : null;
}

export function calculateTotalCost(scores) {
  return Object.values(scores).reduce((total, score) => {
    const cost = getPointCost(score);
    return total + (cost || 0);
  }, 0);
}

export function getRemainingPoints(scores) {
  return POINT_BUY_TOTAL - calculateTotalCost(scores);
}

export function getAbilityMod(score) {
  return Math.floor((score - 10) / 2);
}

export function suggestPointBuy(className) {
  const priority = ABILITY_PRIORITY_BY_CLASS[className];
  if (!priority) return null;
  return {
    ...priority,
    suggestedArray: 'Put 15 in primary, 14 in secondary, 13-14 in CON, dump the rest.',
  };
}
