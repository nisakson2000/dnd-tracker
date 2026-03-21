/**
 * playerPotionBrewingGuide.js
 * Player Mode: Potion brewing, identification, and use
 * Pure JS — no React dependencies.
 */

export const POTION_BASICS = {
  use: 'Action to drink or administer to another creature.',
  identification: 'Small taste or sip: identify the potion (DM may require Arcana check).',
  mixing: 'DMG optional rule: mixing potions has random effects (50% chance of working, 50% weird side effects).',
  note: 'Potions are actions RAW. Many tables use BA for self-drinking as a house rule. Always ask your DM.',
};

export const HEALING_POTIONS = [
  { potion: 'Potion of Healing', rarity: 'Common', healing: '2d4+2', avg: 7, cost: '50 gp', note: 'Basic. Available in most shops.' },
  { potion: 'Potion of Greater Healing', rarity: 'Uncommon', healing: '4d4+4', avg: 14, cost: '100-200 gp', note: 'Good mid-tier healing. Worth carrying.' },
  { potion: 'Potion of Superior Healing', rarity: 'Rare', healing: '8d4+8', avg: 28, cost: '500-1000 gp', note: 'Significant healing. Worth the gold at higher levels.' },
  { potion: 'Potion of Supreme Healing', rarity: 'Very Rare', healing: '10d4+20', avg: 45, cost: '5000+ gp', note: 'Best healing potion. Emergency full heal.' },
];

export const COMMON_POTIONS = [
  { potion: 'Potion of Fire Resistance', rarity: 'Uncommon', effect: '1 hour fire resistance.', note: 'Pre-dragon fight buff. No concentration.' },
  { potion: 'Potion of Water Breathing', rarity: 'Uncommon', effect: '1 hour water breathing.', note: 'Underwater exploration. No concentration.' },
  { potion: 'Potion of Heroism', rarity: 'Rare', effect: '1 hour: 10 temp HP + Bless effect (no concentration).', note: 'Bless without concentration. Great pre-buff.' },
  { potion: 'Potion of Speed', rarity: 'Very Rare', effect: '1 minute Haste (no concentration). No lethargy at end.', note: 'Haste without concentration AND no stun when it ends. Incredible.' },
  { potion: 'Potion of Flying', rarity: 'Very Rare', effect: '1 hour fly speed 60ft.', note: 'Free flight. No concentration. Essential for high-level play.' },
  { potion: 'Potion of Invisibility', rarity: 'Very Rare', effect: '1 hour invisibility. Ends if you attack or cast.', note: 'Infiltration/scouting. Full hour invisible.' },
  { potion: 'Potion of Giant Strength (Hill)', rarity: 'Uncommon', effect: '1 hour: STR = 21.', note: 'Set STR to 21. Great for low-STR characters needing melee.' },
  { potion: 'Potion of Giant Strength (Frost)', rarity: 'Rare', effect: '1 hour: STR = 23.', note: 'STR 23. Above normal max.' },
  { potion: 'Potion of Giant Strength (Storm)', rarity: 'Legendary', effect: '1 hour: STR = 29.', note: 'STR 29. Near-maximum possible. Devastating for any melee character.' },
];

export const POTION_CRAFTING = {
  rules: 'Xanathar\'s Guide downtime. Requires Herbalism Kit proficiency (healing potions) or Alchemist\'s Supplies.',
  healingPotionCrafting: [
    { potion: 'Potion of Healing', time: '1 day', cost: '25 gp', note: 'Quick and cheap.' },
    { potion: 'Potion of Greater Healing', time: '1 workweek', cost: '100 gp', note: 'Worth crafting during downtime.' },
    { potion: 'Potion of Superior Healing', time: '3 workweeks', cost: '1,000 gp', note: 'Significant time investment.' },
    { potion: 'Potion of Supreme Healing', time: '4 workweeks', cost: '10,000 gp', note: 'Expensive but cheaper than buying.' },
  ],
  note: 'Crafting is half the purchase cost. Always craft if you have downtime.',
};

export const POTION_TACTICS = [
  { tactic: 'Pre-combat buffs', detail: 'Drink potions before combat starts. Fire Resistance before dragon. Heroism before boss. No action cost.', rating: 'S' },
  { tactic: 'Thief Fast Hands', detail: 'Thief Rogue: drink potions as BA (Fast Hands Use Object). Attack + potion in same turn.', rating: 'S' },
  { tactic: 'Potion of Speed', detail: 'Haste without concentration. No stun at end. Best combat potion in the game.', rating: 'S' },
  { tactic: 'Emergency healing stockpile', detail: 'Carry 3-5 Potions of Healing minimum. Cheap insurance. Use on downed allies.', rating: 'A' },
  { tactic: 'Craft during downtime', detail: 'Herbalism Kit: brew healing potions at half cost. Always worth doing between adventures.', rating: 'A' },
];

export function potionHealingAvg(potionType) {
  const avgs = { healing: 7, greater: 14, superior: 28, supreme: 45 };
  return avgs[potionType] || 0;
}

export function craftingCostSavings(purchasePrice, craftingCost) {
  return { savings: purchasePrice - craftingCost, percentSaved: Math.round((1 - craftingCost / purchasePrice) * 100) };
}
