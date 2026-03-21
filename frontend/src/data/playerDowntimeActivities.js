/**
 * playerDowntimeActivities.js
 * Player Mode: Downtime activities, costs, and tracking
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// DOWNTIME ACTIVITIES (PHB)
// ---------------------------------------------------------------------------

export const DOWNTIME_ACTIVITIES = [
  {
    name: 'Crafting',
    duration: '1 day per 5gp of item value',
    cost: 'Half the item\'s market price in raw materials',
    requirements: 'Proficiency with relevant tools, appropriate materials',
    description: 'You can craft nonmagical objects. Multiple characters can combine efforts.',
  },
  {
    name: 'Practicing a Profession',
    duration: 'Any number of days',
    cost: 'None',
    requirements: 'None (proficiency in Performance helps)',
    description: 'Maintain a modest lifestyle for free. With Performance proficiency, comfortable lifestyle.',
  },
  {
    name: 'Recuperating',
    duration: '3+ days',
    cost: 'None',
    requirements: 'None',
    description: 'After 3 days, make DC 15 CON save to end one effect or gain advantage on saves vs one disease/poison.',
  },
  {
    name: 'Researching',
    duration: 'Per DM',
    cost: '1gp+ per day',
    requirements: 'Access to a library or sage',
    description: 'Gain information about a topic. DM determines availability.',
  },
  {
    name: 'Training',
    duration: '250 days',
    cost: '1gp per day',
    requirements: 'Instructor',
    description: 'Learn a new language or tool proficiency.',
  },
];

// ---------------------------------------------------------------------------
// XANATHAR'S DOWNTIME
// ---------------------------------------------------------------------------

export const XANATHARS_DOWNTIME = [
  {
    name: 'Buying a Magic Item',
    duration: '1 workweek + additional per rarity',
    cost: 'Varies by rarity',
    check: 'Investigation + Persuasion',
    description: 'Search for and negotiate purchase of a magic item.',
  },
  {
    name: 'Carousing',
    duration: '1 workweek',
    cost: 'Varies by lifestyle (10-250gp)',
    check: 'Persuasion',
    description: 'Make contacts. Results vary from hostile to friendly.',
  },
  {
    name: 'Crime',
    duration: '1 workweek',
    cost: '25gp',
    check: 'Stealth + chosen tool',
    description: 'Attempt a heist. Risk of jail on failure.',
  },
  {
    name: 'Gambling',
    duration: '1 workweek',
    cost: 'Stake amount',
    check: 'Three checks (Insight, Deception, Intimidation)',
    description: 'Win or lose based on check results.',
  },
  {
    name: 'Pit Fighting',
    duration: '1 workweek',
    cost: 'None',
    check: 'Athletics, Acrobatics, or special weapon check',
    description: 'Fight in an arena. Prize money based on wins.',
  },
  {
    name: 'Relaxation',
    duration: '1 workweek',
    cost: 'Lifestyle expenses',
    check: 'None',
    description: 'Recover from debilitating injuries, diseases, or poisons.',
  },
  {
    name: 'Religious Service',
    duration: '1 workweek',
    cost: 'None',
    check: 'Religion or Persuasion',
    description: 'Earn favors from a temple. Can request healing, divine intervention, etc.',
  },
  {
    name: 'Scribing a Spell Scroll',
    duration: 'Varies by spell level (1 day to 48 workweeks)',
    cost: 'Varies (15gp to 250,000gp)',
    check: 'Arcana',
    description: 'Create a spell scroll. Must have spell prepared/known and provide materials.',
    costByLevel: [
      { level: 0, time: '1 day', cost: 15 },
      { level: 1, time: '1 day', cost: 25 },
      { level: 2, time: '3 days', cost: 250 },
      { level: 3, time: '1 workweek', cost: 500 },
      { level: 4, time: '2 workweeks', cost: 2500 },
      { level: 5, time: '4 workweeks', cost: 5000 },
      { level: 6, time: '8 workweeks', cost: 15000 },
      { level: 7, time: '16 workweeks', cost: 25000 },
      { level: 8, time: '32 workweeks', cost: 50000 },
      { level: 9, time: '48 workweeks', cost: 250000 },
    ],
  },
  {
    name: 'Selling a Magic Item',
    duration: '1 workweek + additional per rarity',
    cost: '25gp (to find buyer)',
    check: 'Persuasion',
    description: 'Find a buyer for a magic item. Price determined by rarity and checks.',
  },
  {
    name: 'Training to Gain a Feat',
    duration: '10 workweeks (minus INT mod, min 1)',
    cost: '25gp per workweek',
    check: 'None',
    description: 'Work with a trainer to gain a new feat (DM approval).',
  },
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Get all downtime activities.
 */
export function getAllActivities(includeXanathars = true) {
  if (includeXanathars) return [...DOWNTIME_ACTIVITIES, ...XANATHARS_DOWNTIME];
  return [...DOWNTIME_ACTIVITIES];
}

/**
 * Get scroll scribing cost and time.
 */
export function getScrollCost(spellLevel) {
  const entry = XANATHARS_DOWNTIME.find(a => a.name === 'Scribing a Spell Scroll');
  if (!entry?.costByLevel) return null;
  return entry.costByLevel.find(c => c.level === spellLevel) || null;
}

/**
 * Calculate training duration with INT modifier.
 */
export function getTrainingDuration(intScore) {
  const intMod = Math.floor((intScore - 10) / 2);
  return Math.max(1, 10 - intMod);
}
