/**
 * playerLootDistribution.js
 * Player Mode: Fair loot distribution systems and guidelines
 * Pure JS — no React dependencies.
 */

export const DISTRIBUTION_SYSTEMS = [
  { system: 'Need Before Greed', description: 'Items go to whoever can use them best. Gold split evenly.', pros: 'Fair, efficient, party-optimal.', cons: 'Can feel biased toward certain classes.', popularity: 'Most Common' },
  { system: 'Round Robin', description: 'Take turns picking items in rotating order.', pros: 'Everyone gets equal picks over time.', cons: 'Someone might pick something they can\'t use well.', popularity: 'Common' },
  { system: 'DKP/Points', description: 'Earn points for participation. Spend points on items you want.', pros: 'Rewards consistent attendance and contribution.', cons: 'Complex to track. Feels gamey.', popularity: 'Uncommon' },
  { system: 'Leader Decides', description: 'Party leader or DM distributes items.', pros: 'Fast. No arguments. Optimal distribution.', cons: 'Can feel unfair. Leader bias.', popularity: 'Uncommon' },
  { system: 'Communal Pool', description: 'All items go to a shared pool. Anyone grabs what they need.', pros: 'Simple. Trust-based.', cons: 'Hoarders ruin it. No accountability.', popularity: 'Small groups only' },
];

export const LOOT_PRIORITY_GUIDE = [
  { category: 'Weapons', priority: 'Class that uses it most. +1 sword → best melee fighter.', tiebreaker: 'Who has the worst weapon currently.' },
  { category: 'Armor', priority: 'Class that benefits most from AC boost.', tiebreaker: 'Who has the lowest AC currently.' },
  { category: 'Caster Items', priority: 'Primary caster > secondary caster.', tiebreaker: 'Who uses concentration spells more (benefits from +DC).' },
  { category: 'Utility Items', priority: 'Party role that uses it most. Cloak of Elvenkind → Rogue.', tiebreaker: 'Who would get the most use in typical sessions.' },
  { category: 'Gold', priority: 'Split evenly. Period.', tiebreaker: 'No tiebreaker needed. Even split.' },
  { category: 'Consumables', priority: 'Whoever is most likely to need it. Healing potions → frontliners.', tiebreaker: 'Whoever took the most damage last fight.' },
  { category: 'Quest Items', priority: 'Party inventory. No one "owns" quest items.', tiebreaker: 'Whoever has the Bag of Holding carries it.' },
];

export const ATTUNEMENT_RULES = {
  maxAttunement: 3,
  attunementProcess: 'Short rest spent focusing on the item. Can attune to 1 item per short rest.',
  unattunement: 'Can un-attune during a short rest, or by being 100+ feet away for 24 hours.',
  tips: [
    'You only have 3 attunement slots. Choose wisely.',
    'Some items don\'t require attunement — always check.',
    'If the party has more attunement items than slots, distribute strategically.',
    'Artificers get extra attunement slots at higher levels.',
    'Don\'t attune to situational items. Save slots for always-on effects.',
  ],
};

export const GOLD_SPLIT_METHODS = [
  { method: 'Even Split', description: '1000 gp ÷ 4 players = 250 gp each.', note: 'Standard and fair.' },
  { method: 'Shares', description: 'Full shares for present players, half shares for absent.', note: 'Rewards attendance.' },
  { method: 'Party Fund', description: '10-20% goes to party fund for shared expenses (resurrections, teleports, supplies).', note: 'Smart for long campaigns.' },
  { method: 'Bonus for MVP', description: 'Small bonus (5-10%) for player who contributed most.', note: 'Controversial. Can create conflict.' },
];

export function calculateGoldSplit(totalGold, numPlayers, partyFundPercent) {
  const partyFund = Math.floor(totalGold * ((partyFundPercent || 0) / 100));
  const remaining = totalGold - partyFund;
  const perPerson = Math.floor(remaining / numPlayers);
  const remainder = remaining - (perPerson * numPlayers);
  return { perPerson, partyFund, remainder };
}

export function suggestItemRecipient(itemType, partyRoles) {
  const priorities = {
    weapon: ['Fighter', 'Paladin', 'Barbarian', 'Ranger', 'Rogue'],
    armor: ['Fighter', 'Paladin', 'Cleric', 'Ranger', 'Barbarian'],
    caster: ['Wizard', 'Sorcerer', 'Warlock', 'Cleric', 'Druid', 'Bard'],
    stealth: ['Rogue', 'Ranger', 'Monk', 'Bard'],
    healing: ['Cleric', 'Druid', 'Paladin', 'Bard', 'Ranger'],
  };
  const priority = priorities[itemType] || [];
  return partyRoles.find(role => priority.some(p => role.toLowerCase().includes(p.toLowerCase()))) || partyRoles[0];
}
