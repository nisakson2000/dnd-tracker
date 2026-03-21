/**
 * playerPotionReference.js
 * Player Mode: Potion reference with effects, costs, and crafting
 * Pure JS — no React dependencies.
 */

export const POTIONS = [
  { name: 'Potion of Healing', rarity: 'Common', cost: '50 gp', effect: 'Heal 2d4+2 (avg 7)', action: 'Action (self or feed to ally)', color: '#f44336' },
  { name: 'Potion of Greater Healing', rarity: 'Uncommon', cost: '100-200 gp', effect: 'Heal 4d4+4 (avg 14)', action: 'Action', color: '#e91e63' },
  { name: 'Potion of Superior Healing', rarity: 'Rare', cost: '500-1,000 gp', effect: 'Heal 8d4+8 (avg 28)', action: 'Action', color: '#9c27b0' },
  { name: 'Potion of Supreme Healing', rarity: 'Very Rare', cost: '5,000-10,000 gp', effect: 'Heal 10d4+20 (avg 45)', action: 'Action', color: '#673ab7' },
  { name: 'Potion of Fire Resistance', rarity: 'Uncommon', cost: '100-300 gp', effect: 'Resistance to fire damage for 1 hour', action: 'Action', color: '#ff5722' },
  { name: 'Potion of Speed', rarity: 'Very Rare', cost: '5,000 gp', effect: 'Haste effect for 1 minute (no concentration!)', action: 'Action', color: '#00bcd4' },
  { name: 'Potion of Invisibility', rarity: 'Very Rare', cost: '5,000 gp', effect: 'Invisible for 1 hour. Ends on attack/spell.', action: 'Action', color: '#607d8b' },
  { name: 'Potion of Flying', rarity: 'Very Rare', cost: '5,000 gp', effect: '60ft flying speed for 1 hour.', action: 'Action', color: '#03a9f4' },
  { name: 'Potion of Giant Strength (Hill)', rarity: 'Uncommon', cost: '200 gp', effect: 'STR 21 for 1 hour.', action: 'Action', color: '#795548' },
  { name: 'Potion of Giant Strength (Fire)', rarity: 'Rare', cost: '1,000 gp', effect: 'STR 25 for 1 hour.', action: 'Action', color: '#ff5722' },
  { name: 'Potion of Giant Strength (Storm)', rarity: 'Legendary', cost: '30,000+ gp', effect: 'STR 29 for 1 hour.', action: 'Action', color: '#1565c0' },
  { name: 'Oil of Sharpness', rarity: 'Very Rare', cost: '5,000 gp', effect: 'Weapon becomes +3 for 1 hour.', action: 'Action (1 minute to apply)', color: '#ffc107' },
  { name: 'Elixir of Health', rarity: 'Rare', cost: '500 gp', effect: 'Cures disease, poison, blindness, deafness, paralysis.', action: 'Action', color: '#4caf50' },
  { name: 'Potion of Vitality', rarity: 'Very Rare', cost: '5,000 gp', effect: 'Remove exhaustion. Cure disease/poison. Max hit dice recovery.', action: 'Action', color: '#8bc34a' },
];

export const POTION_RULES = {
  action: 'Drinking a potion is an ACTION (some DMs house-rule bonus action).',
  feedAlly: 'Feeding a potion to an unconscious ally is an ACTION.',
  identify: 'Can identify by taste (sip) or Identify spell.',
  mixing: 'Mixing potions is NOT in RAW rules. Potion Miscibility table is optional (DMG).',
  duration: 'Most potions last 1 hour unless specified.',
  stacking: 'Same potion effects don\'t stack (e.g., two Potions of Healing = take one, save the other).',
};

export const POTION_SHOPPING_LIST = {
  essential: ['Potion of Healing (always carry 2-3)', 'Antitoxin (advantage on poison saves)'],
  recommended: ['Potion of Greater Healing (mid-levels)', 'Potion of Fire Resistance (dragon fights)'],
  luxury: ['Potion of Speed (no concentration Haste!)', 'Oil of Sharpness (+3 weapon for 1 hour)'],
};

export function getPotionInfo(name) {
  return POTIONS.find(p => p.name.toLowerCase().includes((name || '').toLowerCase())) || null;
}

export function getPotionsByRarity(rarity) {
  return POTIONS.filter(p => p.rarity.toLowerCase() === (rarity || '').toLowerCase());
}

export function getHealingPotionAvg(name) {
  const potion = getPotionInfo(name);
  if (!potion) return null;
  const match = potion.effect.match(/avg (\d+)/);
  return match ? parseInt(match[1]) : null;
}
