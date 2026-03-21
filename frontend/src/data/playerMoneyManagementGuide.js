/**
 * playerMoneyManagementGuide.js
 * Player Mode: Gold management and spending priorities
 * Pure JS — no React dependencies.
 */

export const GOLD_BY_TIER = [
  { tier: 'L1-4 (Local Heroes)', expectedGold: '100-500 gp', priorities: 'Armor, weapons, basic supplies, component pouch', note: 'Every gold piece matters. Prioritize armor upgrades.' },
  { tier: 'L5-10 (Heroes of the Realm)', expectedGold: '500-5,000 gp', priorities: 'Magic items, diamonds for Revivify, spell components', note: 'Start buying resurrection diamonds (300gp). Save for key components.' },
  { tier: 'L11-16 (Masters of the Realm)', expectedGold: '5,000-50,000 gp', priorities: 'Rare/Very Rare magic items, stronghold, spell services', note: 'Gold becomes less relevant. Magic items are the goal.' },
  { tier: 'L17-20 (Masters of the World)', expectedGold: '50,000+ gp', priorities: 'Legendary items, Clone spell (3,000gp), wish components', note: 'Money is almost irrelevant. Power comes from abilities, not gold.' },
];

export const ESSENTIAL_PURCHASES = [
  { item: 'Component Pouch', cost: '25 gp', when: 'L1', note: 'Replaces all non-costed material components. Essential for any caster.' },
  { item: 'Studded Leather Armor', cost: '45 gp', when: 'L1', note: 'Best light armor. AC 12 + DEX. Upgrade from leather ASAP.' },
  { item: 'Plate Armor', cost: '1,500 gp', when: 'ASAP for heavy armor users', note: 'AC 18. Massive upgrade. Save every gold for this if you wear heavy armor.' },
  { item: 'Shield', cost: '10 gp', when: 'L1', note: '+2 AC for 10gp. Best value purchase in the game.' },
  { item: 'Diamonds (300 gp)', cost: '300 gp each', when: 'L5+', note: 'For Revivify. Buy 2-3 and give to the Cleric. Insurance against death.' },
  { item: 'Diamonds (500 gp)', cost: '500 gp each', when: 'L9+', note: 'For Raise Dead. Backup resurrection option.' },
  { item: 'Diamond Dust (100 gp)', cost: '100 gp per dose', when: 'L9+', note: 'For Greater Restoration. Cures exhaustion, curses, ability drain.' },
  { item: 'Healing Potions', cost: '50 gp each', when: 'Always', note: '2d4+2 healing. Anyone can use. Emergency backup healing.' },
  { item: 'Silvered Weapon', cost: '100 gp', when: 'L3+', note: 'Bypasses lycanthrope immunity. One per party minimum.' },
  { item: 'Holy Water', cost: '25 gp per flask', when: 'L1+', note: '2d6 radiant vs undead/fiend. Cheap and effective early.' },
];

export const MONEY_TRAPS = [
  { trap: 'Buying healing potions in bulk', why: 'Healer feat, Healing Word, or short rest Hit Dice are more efficient. Potions are emergency backup only.' },
  { trap: 'Expensive mundane weapons', why: 'A +1 weapon from the DM is better than any mundane weapon. Save gold for magic items.' },
  { trap: 'Lifestyle expenses', why: 'Unless RP-relevant, don\'t spend gold on "comfortable" lifestyle. Sleep in the dungeon.' },
  { trap: 'Too many consumables', why: 'Oil, acid, ball bearings, etc. Fun but rarely impactful compared to class abilities.' },
];

export const INCOME_SOURCES = [
  { source: 'Loot from adventures', reliability: 'Primary', note: 'Dungeons, quests, treasure hoards. Main income source.' },
  { source: 'Selling magic items', reliability: 'Variable', note: 'DM-dependent. Some campaigns have magic item markets. Others don\'t.' },
  { source: 'Downtime work', reliability: 'Consistent', note: '1-2 gp/day for skilled labor. Not great but reliable between adventures.' },
  { source: 'Crafting', reliability: 'Moderate', note: 'Artificers and characters with tool proficiencies can craft items at half market value.' },
  { source: 'Crime (Rogue)', reliability: 'Risky', note: 'Pickpocketing, heists, cons. High reward but high risk. Campaign-dependent.' },
];

export function healingPotionEfficiency(potionCost, avgHealing) {
  return { costPerHP: potionCost / avgHealing, note: `${potionCost}gp / ${avgHealing} HP = ${(potionCost / avgHealing).toFixed(1)} gp per HP` };
}

export function plateArmorSavings(currentGold, income PerSession) {
  const plateCost = 1500;
  const sessionsNeeded = Math.ceil((plateCost - currentGold) / income PerSession);
  return { sessionsNeeded, note: `Need ${plateCost - currentGold} more gold. ~${sessionsNeeded} sessions at ${income PerSession} gp/session.` };
}
