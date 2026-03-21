/**
 * Downtime Activities — D&D 5e (PHB + DMG + Xanathar's)
 *
 * Covers roadmap items 440-442 (Downtime wealth generation, Travel costs, Taxation).
 * Complete reference for between-adventure activities.
 */

const d = (n) => Math.floor(Math.random() * n) + 1;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const DOWNTIME_ACTIVITIES = {
  crafting: {
    label: 'Crafting',
    description: 'Create nonmagical items — weapons, armor, potions of healing, or mundane goods.',
    rules: [
      'Must be proficient with appropriate artisan\'s tools',
      'Progress: 5 gp worth of item per day',
      'Must pay half the item\'s market price in raw materials',
      'Multiple characters can combine effort on expensive items',
    ],
    dailyIncome: 0,
    dailyCost: 'Half item cost / days required',
    durationFormula: 'Item price / 5 gp per day',
    lifestyle: 'Modest (free — covered by crafting)',
    examples: [
      { item: 'Longsword (15 gp)', days: 3, materialCost: '7 gp 5 sp' },
      { item: 'Chain Mail (75 gp)', days: 15, materialCost: '37 gp 5 sp' },
      { item: 'Potion of Healing (50 gp)', days: 10, materialCost: '25 gp' },
      { item: 'Plate Armor (1500 gp)', days: 300, materialCost: '750 gp' },
    ],
  },
  working: {
    label: 'Working a Job',
    description: 'Find employment at an establishment. Pay covers a modest lifestyle.',
    rules: [
      'Make an ability check based on the job (Performance, Athletics, etc.)',
      'Pay covers a modest lifestyle; no extra income by default',
      'DC 15+: earn enough for comfortable lifestyle',
      'DC 20+: earn 25 gp extra per workweek',
    ],
    dailyIncome: 1,
    dailyCost: 0,
    lifestyle: 'Modest',
  },
  performing: {
    label: 'Performing',
    description: 'Earn money through musical, theatrical, or other performance.',
    rules: [
      'Make a Performance check',
      'DC 10: Modest lifestyle',
      'DC 15: Comfortable lifestyle',
      'DC 20: Comfortable + 1d6 gp per day',
    ],
    dailyIncome: '1-6',
    dailyCost: 0,
    lifestyle: 'Varies by check',
  },
  research: {
    label: 'Research',
    description: 'Spend time studying a topic in libraries, talking to scholars, or experimenting.',
    rules: [
      'Costs 1 gp per day (materials, bribes, drinks for informants)',
      'Make an INT check with relevant tool/skill',
      'Each day: learn one piece of lore on success',
      'DM determines available lore based on source quality',
    ],
    dailyIncome: 0,
    dailyCost: 1,
    lifestyle: 'Must maintain separately',
  },
  training: {
    label: 'Training',
    description: 'Learn a new language or tool proficiency.',
    rules: [
      'Requires an instructor',
      'Duration: 250 days (Xanathar\'s: 10 workweeks minus INT mod, minimum 1 workweek)',
      'Cost: 1 gp per day (Xanathar\'s: 25 gp per workweek)',
      'At end: gain proficiency in chosen language or tool',
    ],
    dailyIncome: 0,
    dailyCost: 1,
    durationDays: 250,
    lifestyle: 'Must maintain separately',
  },
  carousing: {
    label: 'Carousing',
    description: 'Spend time drinking, gambling, and socializing. Build connections or get into trouble.',
    rules: [
      'Cost depends on lifestyle tier',
      'Lower class: 1 gp per day — contacts among commoners, criminals',
      'Middle class: 5 gp per day — contacts among merchants, guild members',
      'Upper class: 25 gp per day — contacts among nobles, officials',
      'Roll on carousing table for result',
    ],
    dailyCost: '1-25',
    lifestyle: 'Varies',
    results: [
      { roll: '1-5', result: 'Jailed for disorderly conduct. Pay 5 gp fine or spend 1d4 days in jail.' },
      { roll: '6-10', result: 'Robbed of 3d6 × 5 gp while blackout drunk. Perception DC 15 or lose more.' },
      { roll: '11-15', result: 'Made an enemy. Someone important is offended or wronged.' },
      { roll: '16-20', result: 'Even — nothing memorable happened. Money well spent... probably.' },
      { roll: '21-25', result: 'Made a useful contact — merchant, guard, or local with inside info.' },
      { roll: '26-30', result: 'Made a good friend — loyal contact who will help within reason.' },
      { roll: '31+', result: 'Invited to exclusive event or gained minor noble favor.' },
    ],
  },
  gambling: {
    label: 'Gambling',
    description: 'Risk gold for potential profit. Three checks determine the outcome.',
    rules: [
      'Stake any amount of gold (minimum 10 gp, max per DM)',
      'Make three checks: Insight, Deception, Intimidation (one each)',
      '0 successes: Lose stake + that amount in debt',
      '1 success: Lose half the stake',
      '2 successes: Win 1.5× the stake',
      '3 successes: Win 2× the stake',
    ],
    dailyCost: 'Varies (stake)',
    lifestyle: 'Must maintain separately',
  },
  crimeSpree: {
    label: 'Crime',
    description: 'Engage in burglary, robbery, or other criminal enterprises.',
    rules: [
      'Make three checks: Stealth, Thieves\' tools, and a choice of Deception/Persuasion/Intimidation',
      'DC determined by target difficulty (10/15/20/25)',
      '0 successes: Caught! Jailed or must flee.',
      '1 success: Partial take — earn 50% of potential',
      '2 successes: Full take — earn 100% of potential',
      '3 successes: Perfect heist — earn 150% of potential, no suspicion',
    ],
    potentialTakes: [
      { target: 'Poor mark', dc: 10, take: '5d6 gp' },
      { target: 'Modest mark', dc: 15, take: '10d6 gp' },
      { target: 'Wealthy mark', dc: 20, take: '20d6 gp' },
      { target: 'Noble mark', dc: 25, take: '50d6 gp' },
    ],
    dailyCost: 'None (risk is getting caught)',
    lifestyle: 'Must maintain separately',
  },
  pitFighting: {
    label: 'Pit Fighting',
    description: 'Enter underground or sanctioned fighting tournaments.',
    rules: [
      'Make three checks: Athletics, Acrobatics, and a special check (Constitution, weapon attack, etc.)',
      '0 successes: Lost fight, earn nothing, possible injury',
      '1 success: Draw — earn back entry fee',
      '2 successes: Won fight — earn entry fee × 2',
      '3 successes: Dominant win — earn entry fee × 4, build reputation',
    ],
    dailyCost: 'Entry fee (usually 10-50 gp)',
    lifestyle: 'Must maintain separately',
  },
  runningBusiness: {
    label: 'Running a Business',
    description: 'Manage an owned business — tavern, shop, smithy, etc.',
    rules: [
      'Roll d100 + days spent running the business',
      '1-20: Pay 1.5× operating cost (bad period)',
      '21-30: Pay full operating cost (break even)',
      '31-40: Cover operating cost exactly',
      '41-60: Cover cost + earn 1d6 × 5 gp profit',
      '61-80: Cover cost + earn 2d8 × 5 gp profit',
      '81-90: Cover cost + earn 3d10 × 5 gp profit',
      '91+: Cover cost + earn 4d10 × 5 gp profit',
    ],
    dailyCost: 'Operating cost (varies by business)',
    lifestyle: 'Comfortable (from business)',
  },
  religiousService: {
    label: 'Religious Service',
    description: 'Serve at a temple — perform rites, tend to the faithful, proselytize.',
    rules: [
      'No cost — temple provides modest lifestyle',
      'After 10+ days: earn favor of the temple',
      'Can request small favors: healing, information, sanctuary',
      'Religion check DC 15: earn 2d6 gp in donations/gifts',
    ],
    dailyIncome: 0,
    dailyCost: 0,
    lifestyle: 'Modest (provided by temple)',
  },
};

// ── Lifestyle Expenses ──
export const LIFESTYLE_COSTS = {
  wretched:    { daily: 0,    label: 'Wretched',    description: 'Sleeping on streets. No shelter. Constant danger.' },
  squalid:     { daily: 0.1,  label: 'Squalid',     description: 'Leaky shack, moldy food, unsafe area.' },
  poor:        { daily: 0.2,  label: 'Poor',         description: 'Simple food, shared room, worn clothes.' },
  modest:      { daily: 1,    label: 'Modest',       description: 'Small home or room, adequate food, simple clothes.' },
  comfortable: { daily: 2,    label: 'Comfortable',  description: 'Good food, private room, decent clothes.' },
  wealthy:     { daily: 4,    label: 'Wealthy',      description: 'Fine home, excellent food, fashionable clothes.' },
  aristocratic:{ daily: 10,   label: 'Aristocratic', description: 'Luxury estate, banquets, servants, fine everything.' },
};

// ── Regional Taxes (roadmap item 442) ──
export const REGIONAL_TAXES = {
  freeCity:    { rate: 0,    label: 'Free City',       description: 'No taxes — trade hub that profits from volume.' },
  frontier:    { rate: 0.02, label: 'Frontier',        description: '2% tax on trade. Light governance.' },
  kingdom:     { rate: 0.05, label: 'Kingdom',         description: '5% tax. Standard feudal taxation.' },
  empire:      { rate: 0.10, label: 'Empire',          description: '10% tax. Heavy bureaucracy but good roads and security.' },
  theocracy:   { rate: 0.08, label: 'Theocracy',       description: '8% tithe to the temple. Refusing has spiritual consequences.' },
  wartime:     { rate: 0.15, label: 'Wartime',         description: '15% war tax. Temporary but painful.' },
  occupation:  { rate: 0.20, label: 'Occupation',      description: '20% tribute to occupying force. Black market thrives.' },
  tollRoad:    { flat: 1,    label: 'Toll Road',       description: '1 gp per person per toll gate.' },
  gateEntry:   { flat: 2,    label: 'City Gate Entry',  description: '2 gp per person entering city.' },
  adventurerLicense: { flat: 50, label: 'Adventurer License', description: '50 gp annual license to carry weapons and cast magic in city.' },
};

/**
 * Get a downtime activity by key.
 */
export function getActivity(key) {
  return DOWNTIME_ACTIVITIES[key] || null;
}

/**
 * Get all activities for UI display.
 */
export function getAllActivities() {
  return Object.entries(DOWNTIME_ACTIVITIES).map(([key, a]) => ({
    id: key,
    label: a.label,
    description: a.description,
    dailyCost: a.dailyCost,
    dailyIncome: a.dailyIncome,
  }));
}

/**
 * Calculate lifestyle cost over a number of days.
 */
export function calculateLifestyleCost(lifestyle, days) {
  const ls = LIFESTYLE_COSTS[lifestyle];
  if (!ls) return 0;
  return ls.daily * days;
}

/**
 * Calculate crafting time and cost for an item.
 */
export function calculateCraftingTime(itemPriceGP) {
  const days = Math.ceil(itemPriceGP / 5);
  const materialCost = itemPriceGP / 2;
  return { days, materialCost, totalCost: materialCost };
}

/**
 * Roll a carousing result.
 */
export function rollCarousingResult(charismaModifier = 0) {
  const roll = d(20) + charismaModifier;
  const table = DOWNTIME_ACTIVITIES.carousing.results;
  for (const entry of table) {
    const [low, high] = entry.roll.includes('+') ? [parseInt(entry.roll), 999] : entry.roll.split('-').map(Number);
    if (roll >= low && roll <= (high || low)) return { roll, ...entry };
  }
  return { roll, result: table[table.length - 1].result };
}

/**
 * Roll a business result.
 */
export function rollBusinessResult(daysSpent = 30) {
  const roll = d(100) + daysSpent;
  if (roll <= 20) return { roll, outcome: 'Loss', profit: -(d(6) * 10), description: 'Bad period — lost money.' };
  if (roll <= 30) return { roll, outcome: 'Break Even', profit: 0, description: 'Broke even — no profit or loss.' };
  if (roll <= 40) return { roll, outcome: 'Covered Costs', profit: 0, description: 'Exactly covered operating costs.' };
  if (roll <= 60) return { roll, outcome: 'Modest Profit', profit: d(6) * 5, description: 'Earned a modest profit.' };
  if (roll <= 80) return { roll, outcome: 'Good Profit', profit: (d(8) + d(8)) * 5, description: 'Good business period.' };
  if (roll <= 90) return { roll, outcome: 'Great Profit', profit: (d(10) + d(10) + d(10)) * 5, description: 'Excellent returns.' };
  return { roll, outcome: 'Exceptional', profit: (d(10) + d(10) + d(10) + d(10)) * 5, description: 'Exceptional period — business thrived.' };
}

/**
 * Calculate tax on a transaction.
 */
export function calculateTax(goldAmount, regionType) {
  const tax = REGIONAL_TAXES[regionType];
  if (!tax) return 0;
  if (tax.flat) return tax.flat;
  return Math.ceil(goldAmount * tax.rate);
}
