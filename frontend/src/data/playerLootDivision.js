/**
 * playerLootDivision.js
 * Player Mode: Loot division strategies and fairness
 * Pure JS — no React dependencies.
 */

export const LOOT_DIVISION_METHODS = [
  {
    method: 'Equal Split',
    description: 'All gold and sellable items divided equally among party members.',
    pros: ['Simple', 'Fair', 'No arguments'],
    cons: ['Magic items can\'t be easily split', 'Players who contribute more get the same'],
    bestFor: 'Casual groups, new players, groups that want simplicity.',
  },
  {
    method: 'Need Before Greed',
    description: 'Magic items go to whoever can use them best. Gold split equally.',
    pros: ['Items go where they\'re most effective', 'Common in video games, familiar to players'],
    cons: ['Subjective "need" can cause disputes', 'Some classes get more items'],
    bestFor: 'Most D&D groups. Standard approach.',
  },
  {
    method: 'Round Robin',
    description: 'Players take turns picking items. Resets after everyone has picked.',
    pros: ['Everyone gets equal picks', 'Feels fair'],
    cons: ['First pick advantage', 'May not optimize item distribution'],
    bestFor: 'Groups with trust issues or frequent loot disputes.',
  },
  {
    method: 'Party Fund + Individual',
    description: 'Percentage goes to party fund (potions, scrolls, lodging), rest split.',
    pros: ['Covers group expenses', 'Encourages teamwork'],
    cons: ['Need to agree on percentage', 'Fund management overhead'],
    bestFor: 'Organized groups, long campaigns.',
  },
  {
    method: 'DKP / Points',
    description: 'Each item costs "points." Everyone starts equal. Spend points to claim items.',
    pros: ['Very fair over time', 'Prevents hoarding'],
    cons: ['Complex tracking', 'Unusual for D&D'],
    bestFor: 'Very loot-heavy campaigns with many magic items.',
  },
];

export const LOOT_PRIORITIES = [
  { priority: 1, category: 'Resurrection Components', description: 'Diamonds (300gp+ for Revivify). Team survival trumps all.' },
  { priority: 2, category: 'Party Healing', description: 'Healing potions, healer supplies. Everyone benefits.' },
  { priority: 3, category: 'Core Upgrades', description: '+1/+2 weapons for primary attackers, armor for tanks. Biggest combat impact.' },
  { priority: 4, category: 'Defensive Items', description: 'Cloak/Ring of Protection, Amulet of Health. Keeps people alive.' },
  { priority: 5, category: 'Utility Items', description: 'Bag of Holding, Immovable Rod. Quality of life for everyone.' },
  { priority: 6, category: 'Individual Upgrades', description: 'Class-specific items, niche magic items.' },
  { priority: 7, category: 'Luxury / RP Items', description: 'Cosmetic items, instruments, decorative gear.' },
];

export const SELLING_GUIDELINES = {
  weapons_armor: 'Sell for half the listed price (PHB rule).',
  magic_items: 'Very DM-dependent. Typically 50-100% of listed price, if a buyer can be found.',
  gems: 'Full listed value. Gems are portable wealth.',
  art_objects: 'Full listed value in most markets.',
  mundane_loot: 'Usually sell for 50% of listed price.',
  tip: 'Persuasion check may get you a better price. Intimidation works too, but may have consequences.',
};

export function splitGold(totalGold, partySize, partyFundPercent = 0) {
  const partyFund = Math.floor(totalGold * (partyFundPercent / 100));
  const remainder = totalGold - partyFund;
  const perPerson = Math.floor(remainder / partySize);
  const leftover = remainder - (perPerson * partySize);
  return { perPerson, partyFund, leftover };
}

export function getLootMethod(method) {
  return LOOT_DIVISION_METHODS.find(m => m.method.toLowerCase().includes((method || '').toLowerCase())) || null;
}
