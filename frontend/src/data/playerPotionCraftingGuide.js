/**
 * playerPotionCraftingGuide.js
 * Player Mode: Potion brewing, crafting costs, and ingredient gathering
 * Pure JS — no React dependencies.
 */

export const POTION_CRAFTING_RULES = {
  system: 'Xanathar\'s Guide to Everything (expanded crafting rules).',
  requirements: [
    'Proficiency with Herbalism Kit (potions of healing) or Alchemist\'s Supplies',
    'A formula/recipe (DM provides or you research)',
    'Gold for materials (half the potion\'s market value)',
    'Downtime days (based on rarity)',
  ],
  note: 'Healing potions specifically only need Herbalism Kit proficiency.',
};

export const HEALING_POTION_CRAFTING = [
  { potion: 'Potion of Healing', rarity: 'Common', heals: '2d4+2 (avg 7)', cost: '25 gp', time: '1 day', marketPrice: '50 gp' },
  { potion: 'Potion of Greater Healing', rarity: 'Uncommon', heals: '4d4+4 (avg 14)', cost: '50 gp', time: '1 workweek', marketPrice: '100-500 gp' },
  { potion: 'Potion of Superior Healing', rarity: 'Rare', heals: '8d4+8 (avg 28)', cost: '500 gp', time: '3 workweeks', marketPrice: '1,000-5,000 gp' },
  { potion: 'Potion of Supreme Healing', rarity: 'Very Rare', heals: '10d4+20 (avg 45)', cost: '5,000 gp', time: '4 workweeks', marketPrice: '10,000-50,000 gp' },
];

export const USEFUL_POTIONS = [
  { potion: 'Potion of Speed', rarity: 'Very Rare', effect: 'Haste for 1 minute (no concentration).', rating: 'S+', note: 'Best combat potion. No concentration Haste.' },
  { potion: 'Potion of Invisibility', rarity: 'Very Rare', effect: 'Invisible for 1 hour.', rating: 'S', note: 'Hour-long stealth. Amazing for scouting.' },
  { potion: 'Potion of Flying', rarity: 'Very Rare', effect: '60ft fly speed for 1 hour.', rating: 'S', note: 'Flight without concentration or spell slots.' },
  { potion: 'Potion of Fire Breath', rarity: 'Uncommon', effect: '3 uses of 4d6 fire breath (30ft cone, DEX save).', rating: 'A', note: 'Cheap AoE damage for non-casters.' },
  { potion: 'Potion of Giant Strength', rarity: 'Varies', effect: 'STR 21-29 for 1 hour.', rating: 'A+', note: 'Free ability boost. Great for skill checks too.' },
  { potion: 'Potion of Resistance', rarity: 'Uncommon', effect: 'Resistance to one damage type for 1 hour.', rating: 'A', note: 'Pre-fight buff if you know enemy damage types.' },
  { potion: 'Oil of Sharpness', rarity: 'Very Rare', effect: '+3 weapon for 1 hour.', rating: 'S', note: 'Turn any weapon into a +3. Incredible for martials.' },
  { potion: 'Potion of Vitality', rarity: 'Very Rare', effect: 'Remove exhaustion, cure disease/poison, maximize HD for 24 hrs.', rating: 'A+', note: 'Exhaustion removal alone makes this great.' },
];

export const CRAFTING_BY_RARITY = [
  { rarity: 'Common', cost: '25 gp', time: '1 workweek (5 days)', crLevel: 'L3+' },
  { rarity: 'Uncommon', cost: '100 gp', time: '2 workweeks', crLevel: 'L3+' },
  { rarity: 'Rare', cost: '500 gp', time: '10 workweeks', crLevel: 'L6+' },
  { rarity: 'Very Rare', cost: '2,500 gp', time: '25 workweeks', crLevel: 'L11+' },
  { rarity: 'Legendary', cost: '25,000 gp', time: '50 workweeks', crLevel: 'L17+' },
];

export const CRAFTING_TIPS = [
  'Healing potions are the best crafting investment. Always brew during downtime.',
  'Multiple characters can work together to reduce crafting time.',
  'Artificers are the best crafters — Alchemist subclass gets free potions.',
  'Ask your DM about ingredient gathering. Harvesting from monsters can reduce costs.',
  'Herbalism Kit proficiency is available from backgrounds (Hermit, Outlander variant).',
  'Scroll scribing is often more valuable than potion brewing for casters.',
  'Potions don\'t require attunement and can be used by anyone. Great party investment.',
];
