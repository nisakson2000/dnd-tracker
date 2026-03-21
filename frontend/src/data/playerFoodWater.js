/**
 * playerFoodWater.js
 * Player Mode: Food and water requirements, survival tracking
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// DAILY REQUIREMENTS
// ---------------------------------------------------------------------------

export const DAILY_REQUIREMENTS = {
  food: {
    poundsPerDay: 1,
    note: 'A character needs 1 pound of food per day.',
    halfRations: 'Can go on half rations — counts as half a day without food.',
  },
  water: {
    gallonsPerDay: 1,
    hotWeather: 2,
    note: 'A character needs 1 gallon of water per day (2 in hot weather).',
  },
};

// ---------------------------------------------------------------------------
// STARVATION RULES
// ---------------------------------------------------------------------------

export const STARVATION_RULES = {
  food: {
    daysWithout: '3 + CON modifier (minimum 1)',
    effect: 'After that, 1 level of exhaustion per day without food.',
    recovery: 'A day of eating resets the count.',
    halfRations: 'Half a day of eating counts as half a day without food.',
  },
  water: {
    daysWithout: 'Depends on current intake',
    noWater: '1 level of exhaustion at end of day (or 2 if already exhausted).',
    halfWater: 'DC 15 CON save or gain 1 level of exhaustion.',
    note: 'Dehydration is much more dangerous than starvation.',
  },
};

// ---------------------------------------------------------------------------
// RATIONS AND FOOD ITEMS
// ---------------------------------------------------------------------------

export const FOOD_ITEMS = [
  { name: 'Rations (1 day)', cost: 0.5, weight: 2, days: 1 },
  { name: 'Rations (10 days)', cost: 5, weight: 20, days: 10 },
  { name: 'Goodberry (spell)', cost: 0, weight: 0, days: 1, note: '10 berries, each provides 1 day nourishment + 1 HP' },
  { name: 'Create Food and Water (3rd)', cost: 0, weight: 0, days: null, note: '45 pounds food + 30 gallons water for 15 creatures' },
  { name: 'Heroes\' Feast (6th)', cost: 1000, weight: 0, days: null, note: 'Cures poison/disease, immunity to poison/fear, +2d10 max HP, advantage on WIS saves' },
  { name: 'Ale (gallon)', cost: 0.2, weight: 8, days: 0 },
  { name: 'Wine (common)', cost: 0.2, weight: 0, days: 0 },
  { name: 'Waterskin', cost: 0.2, weight: 5, days: 0, note: 'Holds 4 pints (half gallon)' },
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Calculate days of food remaining.
 */
export function getDaysOfFood(poundsOfFood, partySize = 1) {
  if (partySize <= 0) return Infinity;
  return Math.floor(poundsOfFood / partySize);
}

/**
 * Calculate days before starvation effects.
 */
export function getDaysBeforeStarvation(conScore) {
  const conMod = Math.floor((conScore - 10) / 2);
  return Math.max(1, 3 + conMod);
}

/**
 * Get water requirement for weather.
 */
export function getWaterRequirement(isHotWeather = false) {
  return isHotWeather ? DAILY_REQUIREMENTS.water.hotWeather : DAILY_REQUIREMENTS.water.gallonsPerDay;
}
