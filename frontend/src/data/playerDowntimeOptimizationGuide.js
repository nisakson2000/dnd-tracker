/**
 * playerDowntimeOptimizationGuide.js
 * Player Mode: Downtime activities — what to do between adventures
 * Pure JS — no React dependencies.
 */

export const DOWNTIME_BASICS = {
  sources: 'PHB Chapter 8, DMG Chapter 6, Xanathar\'s Guide Chapter 2',
  note: 'Between-adventure time. XGtE has the best expanded options. Use downtime to craft, research, or build connections.',
};

export const DOWNTIME_ACTIVITIES = [
  { activity: 'Crafting Magic Items', time: 'Varies by rarity', cost: 'Varies', requirement: 'Tool proficiency + formula', note: 'Requires a recipe. Time + gold but you choose what you get.' },
  { activity: 'Scribing Spell Scrolls', time: '1 day (L1) to 48 weeks (L9)', cost: '25gp to 250,000gp', requirement: 'Spell prepared each day', note: 'Bank spells for emergencies. Revivify scrolls = gold well spent.' },
  { activity: 'Brewing Potions', time: '1 day to 4 weeks', cost: '25gp to 10,000gp', requirement: 'Herbalism Kit proficiency', note: 'Half purchase cost. Always brew during downtime.' },
  { activity: 'Training', time: '10 workweeks (XGtE)', cost: '25gp/workweek', result: 'New language or tool proficiency.', note: 'Long time investment. Use for needed proficiencies.' },
  { activity: 'Research', time: '1+ workweeks', cost: '50gp/workweek', result: 'Learn lore (INT check).', note: 'Great for learning about BBEG, items, locations.' },
  { activity: 'Carousing', time: '1 workweek', cost: '10-250gp', result: 'Make contacts.', note: 'Build NPC network. Campaign-dependent value.' },
  { activity: 'Crime', time: '1 workweek', cost: '25gp', result: 'Profit or jail.', note: 'Stealth + tools + check. Risk/reward for Rogues.' },
  { activity: 'Gambling', time: '1 workweek', cost: 'Wager', result: 'Win or lose based on 3 checks.', note: 'High-risk, high-reward. Gaming set proficiency helps.' },
  { activity: 'Buying Magic Items', time: '1 workweek', cost: 'Item price + 100gp', result: 'Find seller.', note: 'Persuasion to find. Rarity determines availability.' },
  { activity: 'Pit Fighting', time: '1 workweek', cost: 'None', result: 'Win bets.', note: 'Fun for martials. Athletics/Acrobatics checks.' },
];

export const MAGIC_ITEM_CRAFTING_TABLE = [
  { rarity: 'Common', time: '1 workweek', cost: '50 gp', minLevel: 3 },
  { rarity: 'Uncommon', time: '2 workweeks', cost: '200 gp', minLevel: 3 },
  { rarity: 'Rare', time: '10 workweeks', cost: '2,000 gp', minLevel: 6 },
  { rarity: 'Very Rare', time: '25 workweeks', cost: '20,000 gp', minLevel: 11 },
  { rarity: 'Legendary', time: '50 workweeks', cost: '100,000 gp', minLevel: 17 },
];

export const DOWNTIME_PRIORITIES = [
  { priority: 'S', activities: ['Brewing Potions', 'Scribing Spell Scrolls'], reason: 'Direct combat power. Bank resources.' },
  { priority: 'A', activities: ['Crafting Magic Items', 'Research', 'Buying Magic Items'], reason: 'Long-term power.' },
  { priority: 'B', activities: ['Training', 'Carousing'], reason: 'Slow but useful.' },
  { priority: 'C', activities: ['Working', 'Crime', 'Gambling'], reason: 'Income-focused. Fun but low strategic value.' },
];

export function craftingTime(rarity) {
  const weeks = { common: 1, uncommon: 2, rare: 10, veryRare: 25, legendary: 50 };
  return weeks[rarity] || 0;
}
