/**
 * playerDowntimeActivitiesGuide.js
 * Player Mode: Downtime activities — what to do between adventures
 * Pure JS — no React dependencies.
 */

export const DOWNTIME_BASICS = {
  concept: 'Between adventures, characters can spend days/weeks on activities. PHB, DMG, and Xanathar\'s each have options.',
  tracking: 'Track days spent and gold cost. Most activities require consecutive days.',
  note: 'Downtime is one of the most underused parts of D&D. Push your DM to include it.',
};

export const PHB_DOWNTIME = [
  { activity: 'Crafting', time: '5gp of value per day', cost: 'Half the item market value in materials', requirement: 'Tool proficiency. Multiple characters can combine effort.', note: 'Very slow for expensive items. A 100gp item takes 20 days. Useful for potions and poisons.' },
  { activity: 'Practicing a Profession', time: 'Ongoing', cost: 'None', benefit: 'Maintain modest lifestyle for free. Earns 0 extra gold.', note: 'Just pays your bills. Not exciting but useful if gold-strapped.' },
  { activity: 'Recuperating', time: '3+ days', cost: 'None', benefit: 'End one effect preventing HP recovery. Advantage on saves vs one disease/poison.', note: 'For removing lingering effects. Rarely needed but important when it is.' },
  { activity: 'Researching', time: 'Per DM', cost: '1gp+ per day', benefit: 'Learn lore. DM determines what you find.', note: 'Vague rules. Ask your DM what you can learn about BBEG, items, dungeons.' },
  { activity: 'Training (new language/tool)', time: '250 days', cost: '1gp/day (250gp total)', benefit: 'Learn one language or tool proficiency.', note: '250 days is absurd. Xanathar\'s reduces to 10 weeks minus INT mod.' },
];

export const XANATHARS_DOWNTIME = [
  { activity: 'Buying a Magic Item', time: '1 workweek (5 days) + time to find', cost: 'Varies by rarity', steps: 'Persuasion check DC 20 → find seller → roll on price table → complications.', note: 'Best way to acquire specific magic items. Persuasion check determines quality of selection.' },
  { activity: 'Carousing', time: '1 workweek', cost: '10-250gp (by lifestyle)', benefit: 'Make contacts. Roll on complications table. Social networking.', note: 'Great for building NPC connections. Lower class = criminal contacts. Upper class = noble contacts.' },
  { activity: 'Crafting an Item', time: 'Varies by rarity', cost: 'Half market value', requirement: 'Tool proficiency. May need formula. May need exotic materials.', note: 'Common: 1 week, 25gp. Uncommon: 2 weeks, 100gp. Rare: 10 weeks, 1000gp. Very Rare: 25 weeks, 5000gp.' },
  { activity: 'Crime', time: '1 workweek', cost: '25gp (expenses)', benefit: 'Steal. Make checks: Stealth, Thieves\' tools, one of Deception/Sleight/Stealth. Compare DC by target value.', note: 'Risky but lucrative. Failure: fines, jail, or enemies. Great for Rogues.' },
  { activity: 'Gambling', time: '1 workweek', cost: 'Bet amount (varies)', benefit: 'Three checks: Insight, Deception, Intimidation. Net wins/losses based on successes.', note: 'Fun but random. 0 successes: lose bet + debt. 3 successes: win 2.5× bet.' },
  { activity: 'Pit Fighting', time: '1 workweek', cost: 'None', benefit: 'Three checks from Athletics, Acrobatics, or special (DM). Win = prize money.', note: 'Free entry. 3 successes = big prize. 0 = injury + debt. Great for martial characters.' },
  { activity: 'Relaxation', time: '1 workweek', cost: 'Lifestyle expenses', benefit: 'Advantage on saves vs disease/poison. End one effect (DC 15 CON save).', note: 'Simple recovery. Good between dangerous adventures.' },
  { activity: 'Religious Service', time: '1 workweek', cost: 'None', benefit: 'Earn favors. Religion + Persuasion checks. Complications possible.', note: 'Good for Clerics/Paladins. Build temple connections. Cash in favors later.' },
  { activity: 'Research', time: '1 workweek', cost: '50gp per week', benefit: 'INT check + Lore proficiency. Each 50gp = +1 bonus. Discover lore.', note: 'Much clearer than PHB version. Gold investment improves results.' },
  { activity: 'Scribing a Spell Scroll', time: 'Varies by level', cost: 'Varies (15gp for cantrip, 250gp for L3, 25000gp for L9)', requirement: 'Spellcasting, Arcana proficiency, spell prepared/known, materials.', note: 'Create scrolls for emergency use. L3 scroll: 1 workweek, 250gp. Very useful for Wizards.' },
  { activity: 'Selling a Magic Item', time: '1 workweek to find buyer', cost: '25gp expenses', benefit: 'Persuasion check → offer at percentage of base price.', note: 'DC 20 to find buyer. Price varies by rarity and roll.' },
  { activity: 'Training (Xanathar\'s)', time: '10 weeks - INT mod (min 1)', cost: '25gp per week', benefit: 'Learn language or tool proficiency.', note: 'Much better than PHB training. INT 20 = 5 weeks instead of 250 days.' },
];

export const CRAFTING_TIMES = [
  { rarity: 'Common', time: '1 workweek', cost: '25gp', note: 'Potions of Healing, basic gear.' },
  { rarity: 'Uncommon', time: '2 workweeks', cost: '100gp', note: '+1 weapons, Bag of Holding.' },
  { rarity: 'Rare', time: '10 workweeks', cost: '1,000gp', note: '+2 weapons, Cloak of Displacement.' },
  { rarity: 'Very Rare', time: '25 workweeks', cost: '5,000gp', note: '+3 weapons. Half a year of crafting.' },
  { rarity: 'Legendary', time: '50 workweeks', cost: '25,000gp', note: 'Nearly a year. Need exotic materials.' },
];

export const BEST_DOWNTIME_BY_CLASS = [
  { class: 'Wizard', activity: 'Scribing Scrolls / Research', reason: 'Create backup spell scrolls. Research lore. Copy spells into spellbook.' },
  { class: 'Rogue', activity: 'Crime / Gambling', reason: 'Use your skills. Stealth + Thieves\' Tools = easy heists.' },
  { class: 'Cleric/Paladin', activity: 'Religious Service', reason: 'Build temple favors. Cash in for divine aid, healing, resurrection.' },
  { class: 'Artificer', activity: 'Crafting', reason: 'Tool proficiencies + class features = efficient crafter.' },
  { class: 'Fighter/Barbarian', activity: 'Pit Fighting', reason: 'Use Athletics. Win prize money. No cost to enter.' },
  { class: 'Bard', activity: 'Carousing / Performing', reason: 'Build contacts. Earn gold. Social networking.' },
];

export function xanatharTrainingWeeks(intMod) {
  return Math.max(1, 10 - intMod);
}

export function scrollScribingCost(spellLevel) {
  const costs = { 0: 15, 1: 25, 2: 100, 3: 250, 4: 500, 5: 1000, 6: 5000, 7: 10000, 8: 25000, 9: 50000 };
  return costs[spellLevel] || 0;
}

export function scrollScribingTime(spellLevel) {
  // In workweeks (5 days each)
  const times = { 0: 0.2, 1: 0.2, 2: 0.6, 3: 1, 4: 2, 5: 4, 6: 8, 7: 16, 8: 32, 9: 48 };
  return times[spellLevel] || 0;
}
