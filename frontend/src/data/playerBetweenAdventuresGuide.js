/**
 * playerBetweenAdventuresGuide.js
 * Player Mode: Downtime activities — what to do between adventures
 * Pure JS — no React dependencies.
 */

export const DOWNTIME_ACTIVITIES = [
  { activity: 'Crafting', time: '5gp/day (PHB). Varies (Xanathar\'s).', cost: 'Half item price', requires: 'Tool proficiency', note: 'Magic items need formulas + Arcana.' },
  { activity: 'Training (New Proficiency)', time: '250 days (PHB). 10 workweeks (Xanathar\'s).', cost: '1gp/day or 25gp total', requires: 'Instructor', note: 'Learn language or tool proficiency.' },
  { activity: 'Scribing Spell Scrolls', time: '1 day (cantrip) to 48 weeks (L9).', cost: '15gp to 250,000gp', requires: 'Spell known + Arcana', note: 'Emergency scrolls are lifesavers.' },
  { activity: 'Brewing Potions', time: '1 day (common) to 4 weeks (very rare).', cost: '25gp to 50,000gp', requires: 'Herbalism Kit prof', note: 'Healing potions at cost. Very efficient.' },
  { activity: 'Research', time: '1 workweek', cost: '50gp minimum', requires: 'INT check', note: 'Learn lore, discover secrets.' },
  { activity: 'Carousing', time: '1 workweek', cost: '10-250gp', requires: 'Persuasion/Performance', note: 'Make contacts. Random events.' },
  { activity: 'Crime', time: '1 workweek', cost: '25gp', requires: 'Stealth/Thieves\' Tools/Deception', note: 'Heist planning. Risk vs reward.' },
  { activity: 'Gambling', time: '1 workweek', cost: '10-1,000gp wager', requires: 'Insight/Deception/Intimidation', note: 'Win or lose money.' },
  { activity: 'Pit Fighting', time: '1 workweek', cost: 'None', requires: 'Athletics/Acrobatics', note: 'Win gold and reputation.' },
  { activity: 'Building Stronghold', time: '60+ days', cost: '5,000-500,000gp', requires: 'Land, workers', note: 'Base of operations. Long-term.' },
];

export const PRIORITY_DOWNTIME = [
  { priority: 'S+', activity: 'Scribe Emergency Scrolls', why: 'Revivify, Counterspell scrolls. Life-saving.' },
  { priority: 'S', activity: 'Brew Healing Potions', why: 'Herbalism Kit + 25gp = Potion of Healing.' },
  { priority: 'S', activity: 'Train Tool Proficiency', why: 'Thieves\' Tools if no Rogue. Herbalism Kit for potions.' },
  { priority: 'A+', activity: 'Research Next Quest', why: 'Know what you face. Prepare accordingly.' },
  { priority: 'A', activity: 'Craft Magic Items', why: 'If DM allows and you have formulas.' },
  { priority: 'A', activity: 'Learn a Language', why: 'Undercommon, Draconic, Celestial — campaign dependent.' },
  { priority: 'B+', activity: 'Carousing', why: 'Network for allies and information.' },
];

export const DOWNTIME_TIPS = [
  'Brew Healing Potions: Herbalism Kit + 25gp each. Do this always.',
  'Scribe Revivify scrolls. Emergency resurrection backup.',
  'Train Thieves\' Tools if no Rogue in party. 10 workweeks.',
  'Research upcoming quests. Preparation wins fights.',
  'Carousing: make NPC contacts. Information is power.',
  'Xanathar\'s downtime is faster and better than PHB rules.',
  'Ask your DM which downtime rules they use.',
  'Craft scrolls of situational spells you don\'t want prepared daily.',
  'Always spend downtime productively. Prep saves lives.',
  'Stronghold building: talk to DM. Not every campaign supports it.',
];
