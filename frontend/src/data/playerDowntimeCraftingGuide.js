/**
 * playerDowntimeCraftingGuide.js
 * Player Mode: Downtime activities — crafting, training, and between-adventure options
 * Pure JS — no React dependencies.
 */

export const XANATHARS_DOWNTIME = [
  { activity: 'Buying a Magic Item', time: '1 workweek + gold', check: 'Persuasion/Investigation', note: 'DM sets available items.' },
  { activity: 'Carousing', time: '1 workweek, 10-250 gp', check: 'Varies', note: 'Make contacts. Random events.' },
  { activity: 'Crafting', time: '1 workweek per 50 gp', check: 'Tool proficiency', note: 'Magic items need formula + exotic materials.' },
  { activity: 'Crime', time: '1 workweek', check: 'Stealth, Tools, Deception', note: 'Risk arrest. Big payout.' },
  { activity: 'Gambling', time: '1 workweek', check: 'Insight, Deception, Intimidation', note: 'Win or lose gold.' },
  { activity: 'Pit Fighting', time: '1 workweek', check: 'Athletics, Acrobatics, attack', note: 'Prize money + reputation.' },
  { activity: 'Research', time: '1+ workweeks, 50 gp/week', check: 'INT + proficiency', note: 'Uncover lore.' },
  { activity: 'Scribing Spell Scroll', time: 'Varies', check: 'Arcana + tools', note: 'L1: 1 day, 25 gp.' },
  { activity: 'Training', time: '10 workweeks, 25 gp/week', check: 'None', note: 'Learn language or tool.' },
  { activity: 'Work', time: '1+ workweeks', check: 'Relevant skill', note: 'Earn gold.' },
];

export const CRAFTING_MAGIC_ITEMS = {
  requirements: ['Formula (recipe)', 'Exotic material', 'Tool proficiency', 'Spell slots', 'Time and gold'],
  costs: [
    { rarity: 'Common', time: '1 workweek', cost: '50 gp' },
    { rarity: 'Uncommon', time: '2 workweeks', cost: '200 gp' },
    { rarity: 'Rare', time: '10 workweeks', cost: '2,000 gp' },
    { rarity: 'Very Rare', time: '25 workweeks', cost: '20,000 gp' },
    { rarity: 'Legendary', time: '50 workweeks', cost: '100,000 gp' },
  ],
};

export const SPELL_SCROLL_COSTS = [
  { level: 'Cantrip', time: '1 day', cost: '15 gp' },
  { level: '1st', time: '1 day', cost: '25 gp' },
  { level: '2nd', time: '3 days', cost: '250 gp' },
  { level: '3rd', time: '1 workweek', cost: '500 gp' },
  { level: '4th', time: '2 workweeks', cost: '2,500 gp' },
  { level: '5th', time: '4 workweeks', cost: '5,000 gp' },
];

export const POTION_BREWING = [
  { potion: 'Healing', time: '1 day', cost: '25 gp', tool: 'Herbalism Kit' },
  { potion: 'Greater Healing', time: '1 workweek', cost: '100 gp', tool: 'Herbalism Kit' },
  { potion: 'Superior Healing', time: '3 workweeks', cost: '1,000 gp', tool: 'Herbalism Kit' },
  { potion: 'Supreme Healing', time: '4 workweeks', cost: '10,000 gp', tool: 'Herbalism Kit' },
];

export const DOWNTIME_TIPS = [
  'Scribing spell scrolls: best Wizard downtime. Stockpile Revivify scrolls.',
  'Healing potion crafting: Herbalism Kit proficiency. Stock up.',
  'Training: 10 workweeks for language or tool. Invest early.',
  'Buying magic items: Persuasion checks matter. Complications possible.',
  'Carousing: make NPC contacts. Social campaign value.',
  'Crime: high risk, high reward. Stealth + Tools + Deception.',
  'Always ask DM what downtime is available.',
  'Magic item crafting needs formulas. Quest for them.',
  'Gambling: fun RP. 3-check system.',
  'Research: uncover lore about upcoming threats.',
];
