/**
 * playerDowntimeExpanded.js
 * Player Mode: Expanded downtime activities from Xanathar's Guide
 * Pure JS — no React dependencies.
 */

export const DOWNTIME_ACTIVITIES = [
  { activity: 'Brewing Potions', time: 'Varies by rarity', cost: 'Half potion price', skill: 'Herbalism Kit or Alchemist\'s Supplies', details: 'Common: 1 day/25gp. Uncommon: 1 workweek/100gp. Rare: 3 workweeks/500gp. Very Rare: 6 workweeks/2,500gp.' },
  { activity: 'Scribing Scrolls', time: 'Varies by level', cost: 'Half scroll price', skill: 'Arcana + spell slot', details: 'Cantrip: 1 day/15gp. 1st: 1 day/25gp. 2nd: 3 days/250gp. 3rd: 1 week/500gp. Must know the spell.' },
  { activity: 'Crafting Magic Items', time: 'Varies by rarity', cost: 'Half item price + formula', skill: 'Arcana + relevant tool', details: 'Uncommon: 2 workweeks/200gp. Rare: 10 workweeks/2,000gp. Requires a formula (quest reward or purchase).' },
  { activity: 'Research', time: '1 workweek minimum', cost: '50gp per week', skill: 'INT check (DC set by DM)', details: 'Gain lore, uncover secrets, or find quest hooks. +1 per 100gp extra spent.' },
  { activity: 'Training (New Language/Tool)', time: '10 workweeks', cost: '25gp per week (250gp total)', skill: 'None', details: 'Learn a language or tool proficiency. Can reduce time with INT mod.' },
  { activity: 'Training (Feat)', time: 'DM discretion', cost: 'DM discretion', skill: 'Find a trainer', details: 'Variant rule. Some DMs allow training feats during downtime.' },
  { activity: 'Pit Fighting', time: '1 workweek', cost: 'None (risk injury)', skill: 'Athletics, Acrobatics, or weapon', details: 'Make 3 checks (DC 5, 10, 15). Win: earn gold. Lose: may be injured.' },
  { activity: 'Gambling', time: '1 workweek', cost: 'Varies (wager)', skill: 'Insight, Deception, Intimidation', details: 'Make 3 checks. Net successes determine profit/loss.' },
  { activity: 'Crime', time: '1 workweek', cost: 'Varies (tools)', skill: 'Stealth, Thieves\' Tools, etc.', details: 'Attempt a heist. Success = loot. Failure = complications (jail, bounty).' },
  { activity: 'Carousing', time: '1 workweek', cost: '10-250gp (lifestyle dependent)', skill: 'Persuasion or Performance', details: 'Make contacts. Roll on carousing table for results.' },
  { activity: 'Building a Stronghold', time: '60-400 days', cost: '5,000-500,000gp', skill: 'None (hire workers)', details: 'Abbey: 50,000gp/400 days. Keep: 50,000gp/400 days. Tower: 15,000gp/100 days.' },
  { activity: 'Running a Business', time: '1 workweek', cost: 'Maintenance', skill: 'None', details: 'Roll d100 + days spent (max 30). Results range from paying maintenance to earning profit.' },
];

export const CRAFTING_TIMES = {
  common: { cost: '50gp', time: '1 workweek', minLevel: 3 },
  uncommon: { cost: '200gp', time: '2 workweeks', minLevel: 3 },
  rare: { cost: '2,000gp', time: '10 workweeks', minLevel: 6 },
  veryRare: { cost: '20,000gp', time: '25 workweeks', minLevel: 11 },
  legendary: { cost: '100,000gp', time: '50 workweeks', minLevel: 17 },
};

export const DOWNTIME_COMPLICATIONS = [
  'A rival interferes with your work.',
  'Your materials are stolen or damaged.',
  'An NPC demands a favor in return.',
  'Your activities attract unwanted attention.',
  'A natural disaster delays your progress.',
  'You uncover a dangerous secret.',
];

export function getActivityInfo(name) {
  return DOWNTIME_ACTIVITIES.find(a => a.activity.toLowerCase().includes((name || '').toLowerCase())) || null;
}

export function getCraftingRequirements(rarity) {
  return CRAFTING_TIMES[(rarity || '').toLowerCase()] || CRAFTING_TIMES.common;
}
