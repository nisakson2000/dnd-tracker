/**
 * playerPotionGuide.js
 * Player Mode: Potion usage, types, action economy, and optimization
 * Pure JS — no React dependencies.
 */

export const POTION_RULES = {
  drinking: 'RAW: Drinking a potion is an ACTION. Some DMs house-rule it as a bonus action.',
  administerToOther: 'Administering a potion to another creature is an ACTION.',
  identification: 'A small taste or Identify spell reveals what a potion does.',
  mixing: 'DMG optional rule: mixing potions can cause random (often bad) effects.',
  duration: 'Most potions have a set duration. Some are instantaneous (healing potions).',
  houseRule: 'Common house rule: Drinking your own potion = bonus action. Giving to someone else = action.',
};

export const HEALING_POTIONS = [
  { name: 'Potion of Healing', rarity: 'Common', healing: '2d4 + 2', avgHP: 7, cost: '50 gp', note: 'Baseline. Always carry 1-2.' },
  { name: 'Potion of Greater Healing', rarity: 'Uncommon', healing: '4d4 + 4', avgHP: 14, cost: '100-250 gp', note: 'Good value. Worth stocking up mid-levels.' },
  { name: 'Potion of Superior Healing', rarity: 'Rare', healing: '8d4 + 8', avgHP: 28, cost: '500-2500 gp', note: 'Significant healing. Save for emergencies.' },
  { name: 'Potion of Supreme Healing', rarity: 'Very Rare', healing: '10d4 + 20', avgHP: 45, cost: '5000+ gp', note: 'Near full heal for most characters. Extremely valuable.' },
];

export const BUFF_POTIONS = [
  { name: 'Potion of Speed', rarity: 'Very Rare', effect: 'Haste for 1 minute (no concentration!)', note: 'Haste without concentration. Incredible. Still lose a turn when it ends.' },
  { name: 'Potion of Giant Strength', rarity: 'Varies', effect: 'STR score becomes 21-29 depending on type', note: 'Hill (21), Frost/Stone (23), Fire (25), Cloud (27), Storm (29). Duration 1 hour.' },
  { name: 'Potion of Heroism', rarity: 'Rare', effect: '10 temp HP + Bless effect for 1 hour', note: 'Self-Bless without concentration. +1d4 to attacks and saves.' },
  { name: 'Potion of Invulnerability', rarity: 'Rare', effect: 'Resistance to ALL damage for 1 minute', note: 'Half damage from everything. Use before a boss fight.' },
  { name: 'Potion of Flying', rarity: 'Very Rare', effect: '60ft flying speed for 1 hour', note: 'Free flight. Excellent for non-casters who need aerial mobility.' },
  { name: 'Potion of Invisibility', rarity: 'Very Rare', effect: 'Invisible for 1 hour (or until attack/cast)', note: 'True invisibility. Advantage on first attack, auto-stealth.' },
  { name: 'Potion of Fire Breath', rarity: 'Uncommon', effect: 'Exhale fire 30ft cone, 4d6 fire (DEX half), 3 uses', note: 'Three breath weapons. No action type specified — ask DM.' },
  { name: 'Potion of Resistance', rarity: 'Uncommon', effect: 'Resistance to one damage type for 1 hour', note: 'Choose type when drinking. Plan ahead based on expected enemies.' },
];

export const POTION_STRATEGY = [
  { tip: 'Always carry at least 1 healing potion', detail: 'Even non-healers can save a life with a potion. 50 gp is cheap insurance.', priority: 'S' },
  { tip: 'Pre-buff before boss fights', detail: 'Drink Potion of Speed, Heroism, or Giant Strength before initiative. Buffs that last 1 hour are safe to pre-drink.', priority: 'S' },
  { tip: 'Potions vs spell slots', detail: 'Potions don\'t use concentration or spell slots. They stack with your spells. Use them as supplements, not replacements.', priority: 'A' },
  { tip: 'Action economy matters', detail: 'Drinking a potion costs your ACTION. A Fighter\'s action is worth 2+ attacks. Only drink potions when attacking isn\'t better.', priority: 'A' },
  { tip: 'Give potions to non-healers', detail: 'The party\'s Fighter or Rogue should carry healing potions. If the healer goes down, they can pick them up.', priority: 'A' },
  { tip: 'Healing potions are emergency use', detail: 'Don\'t waste your action on 2d4+2 when you could be attacking. Save potions for when someone\'s at 0 HP and the healer is down.', priority: 'A' },
  { tip: 'Alchemist Artificer potions', detail: 'Alchemist Artificer can create Experimental Elixirs for free each long rest. Great potion economy.', priority: 'B' },
];

export const CRAFTING_POTIONS = {
  rules: 'Requires proficiency in Herbalism kit or Alchemist\'s supplies.',
  healingPotion: {
    cost: '25 gp (half market price)',
    time: '1 day of downtime',
    requirement: 'Herbalism kit proficiency',
  },
  xanatharRules: {
    common: { time: '1 day', cost: '25 gp' },
    uncommon: { time: '1 workweek', cost: '100 gp' },
    rare: { time: '5 workweeks', cost: '1000 gp' },
    veryRare: { time: '12.5 workweeks', cost: '10000 gp' },
  },
};

export function potionHealingAvg(potionType) {
  const potions = {
    basic: { dice: 2, size: 4, flat: 2, avg: 7 },
    greater: { dice: 4, size: 4, flat: 4, avg: 14 },
    superior: { dice: 8, size: 4, flat: 8, avg: 28 },
    supreme: { dice: 10, size: 4, flat: 20, avg: 45 },
  };
  return potions[potionType] || potions.basic;
}

export function shouldDrinkPotion(currentHP, maxHP, potionHealing, canAttackInstead, expectedDamageDealt) {
  if (currentHP <= 0) return { drink: true, reason: 'You\'re at 0 HP. Someone needs to give you this potion.' };
  if (currentHP <= potionHealing && canAttackInstead) return { drink: false, reason: 'Your attack is worth more than the potion heal. Attack and hope to kill the enemy.' };
  if (currentHP / maxHP < 0.15) return { drink: true, reason: 'You\'re critically low. One more hit could kill you.' };
  return { drink: false, reason: 'You\'re healthy enough. Attack instead.' };
}
