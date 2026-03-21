/**
 * playerDowntimeMasterGuide.js
 * Player Mode: Downtime activities — what to do between adventures
 * Pure JS — no React dependencies.
 */

export const DOWNTIME_OVERVIEW = {
  concept: 'Between adventures, PCs can spend days/weeks on personal projects.',
  sources: 'PHB Ch8 + Xanathar\'s Ch2 (expanded options).',
  note: 'Smart downtime makes your character significantly stronger.',
};

export const XANATHARS_DOWNTIME = [
  { activity: 'Buying Magic Items', time: '1+ workweeks', cost: 'By rarity', note: 'Best downtime. Magic items change everything.', rating: 'S' },
  { activity: 'Scribing Spell Scrolls', time: '1 day (L1) to 48 wks (L9)', note: 'Emergency scrolls: Revivify, Counterspell.', rating: 'S' },
  { activity: 'Crafting Magic Items', time: '1-25 workweeks', note: 'Need formula + materials + proficiency.', rating: 'A+' },
  { activity: 'Research', time: '1+ workweeks', cost: '50gp+', note: 'Information about threats.', rating: 'A+' },
  { activity: 'Training', time: '10 workweeks', cost: '25gp/wk', note: 'New tool or language proficiency.', rating: 'A' },
  { activity: 'Religious Service', time: '1 workweek', note: 'Temple favors: free healing, political support.', rating: 'A' },
  { activity: 'Carousing', time: '1 workweek', cost: '10-250gp', note: 'Build NPC contacts.', rating: 'B+' },
  { activity: 'Crime', time: '1 workweek', cost: '25gp', note: 'Stolen goods. Risk: getting caught.', rating: 'B' },
  { activity: 'Gambling', time: '1 workweek', note: '3 checks. Win or lose stakes.', rating: 'B' },
  { activity: 'Pit Fighting', time: '1 workweek', note: '3 checks. Win 200gp or get injured.', rating: 'B' },
  { activity: 'Selling Magic Items', time: '1+ workweeks', note: 'Liquidate unwanted items.', rating: 'A' },
];

export const BEST_DOWNTIME_PRIORITIES = [
  { priority: 1, activity: 'Buy magic items', why: 'Fastest power increase.', rating: 'S' },
  { priority: 2, activity: 'Scribe spell scrolls', why: 'Safety net for critical spells.', rating: 'S' },
  { priority: 3, activity: 'Craft magic items', why: 'Custom gear for your build.', rating: 'A+' },
  { priority: 4, activity: 'Research', why: 'Intel on upcoming threats saves lives.', rating: 'A+' },
  { priority: 5, activity: 'Train proficiency', why: 'New tools or languages.', rating: 'A' },
];

export const PHB_DOWNTIME = [
  { activity: 'Crafting', time: '5gp/day', note: 'Slow. Need tools + half cost materials.' },
  { activity: 'Practicing Profession', note: 'Maintain lifestyle without spending gold.' },
  { activity: 'Recuperating', time: '3+ days', note: 'End diseases/poisons.' },
  { activity: 'Researching', note: 'Need library or sage. DM sets time/cost.' },
  { activity: 'Training (language/tool)', time: '250 days', note: 'Very slow RAW. Most DMs reduce.' },
];
