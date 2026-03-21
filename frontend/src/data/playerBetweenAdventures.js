/**
 * playerBetweenAdventures.js
 * Player Mode: Downtime activities and what to do between adventures
 * Pure JS — no React dependencies.
 */

export const DOWNTIME_ACTIVITIES = [
  { activity: 'Crafting', time: '5 gp/day', req: 'Tool proficiency', note: 'Mundane items. Magic items much longer.' },
  { activity: 'Working', time: '1 gp/day', req: 'None', note: 'Covers modest lifestyle.' },
  { activity: 'Researching', time: '1 gp + checks/day', req: 'Library/sage', note: 'Learn lore, quest hooks.' },
  { activity: 'Training (proficiency)', time: '250 days, 1 gp/day', req: 'Instructor', note: 'New language or tool.' },
  { activity: 'Scribing scrolls', time: 'Varies', req: 'Spellcaster + materials', note: '1st: 1 day, 25 gp.' },
  { activity: 'Brewing potions', time: 'Varies', req: 'Herbalism kit', note: 'Common: 1 day, 25 gp.' },
  { activity: 'Carousing', time: '1 day', req: 'Gold', note: 'Make contacts or enemies.' },
  { activity: 'Crime', time: '1 day', req: 'Skills', note: 'Risk of arrest.' },
  { activity: 'Pit Fighting', time: '1 day', req: 'Combat', note: 'Win gold or lose HP.' },
];

export const SCROLL_COSTS = [
  { level: 0, time: '1 day', cost: '15 gp' },
  { level: 1, time: '1 day', cost: '25 gp' },
  { level: 2, time: '3 days', cost: '250 gp' },
  { level: 3, time: '5 days', cost: '500 gp' },
  { level: 4, time: '10 days', cost: '2,500 gp' },
  { level: 5, time: '20 days', cost: '5,000 gp' },
];

export const POTION_COSTS = [
  { rarity: 'Common (Healing)', time: '1 day', cost: '25 gp' },
  { rarity: 'Uncommon (Greater)', time: '5 days', cost: '100 gp' },
  { rarity: 'Rare (Superior)', time: '25 days', cost: '1,000 gp' },
];

export const PRIORITY = [
  'Scribe scrolls of key spells (emergency backup).',
  'Brew healing potions.',
  'Copy spells (Wizard).',
  'Research the next quest.',
  'Build contacts (carousing).',
];

export function scrollTime(level) {
  const days = [1, 1, 3, 5, 10, 20, 40, 80, 160, 240];
  return days[level] || 1;
}
