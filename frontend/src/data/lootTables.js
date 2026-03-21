/**
 * Loot Tables — Treasure generation by CR and context.
 * Based on DMG individual and hoard loot tables.
 */

const d = (n) => Math.floor(Math.random() * n) + 1;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const INDIVIDUAL_LOOT = {
  '0-4': [
    { roll: [1, 30], copper: '5d6', silver: '0', gold: '0' },
    { roll: [31, 60], copper: '0', silver: '4d6', gold: '0' },
    { roll: [61, 70], copper: '0', silver: '0', gold: '3d6' },
    { roll: [71, 95], copper: '0', silver: '0', gold: '1d6', gems: '1 gem (10 gp)' },
    { roll: [96, 100], copper: '0', silver: '0', gold: '2d6', art: '1 art object (25 gp)' },
  ],
  '5-10': [
    { roll: [1, 30], copper: '0', silver: '4d6 x 10', gold: '1d6 x 10' },
    { roll: [31, 60], copper: '0', silver: '0', gold: '6d6 x 10' },
    { roll: [61, 70], copper: '0', silver: '0', gold: '3d6 x 10', gems: '1d4 gems (50 gp each)' },
    { roll: [71, 95], copper: '0', silver: '0', gold: '2d6 x 10', art: '1d4 art (250 gp each)' },
    { roll: [96, 100], copper: '0', silver: '0', gold: '4d6 x 10', gems: '1d4 gems (100 gp each)' },
  ],
  '11-16': [
    { roll: [1, 20], copper: '0', silver: '0', gold: '4d6 x 100' },
    { roll: [21, 35], copper: '0', silver: '0', gold: '1d6 x 100', gems: '1d4 gems (500 gp each)' },
    { roll: [36, 75], copper: '0', silver: '0', gold: '1d6 x 100', art: '1d4 art (750 gp each)' },
    { roll: [76, 100], copper: '0', silver: '0', gold: '1d6 x 100', gems: '1d4 gems (1000 gp each)' },
  ],
  '17+': [
    { roll: [1, 15], copper: '0', silver: '0', gold: '12d6 x 100', gems: '1d8 gems (1000 gp each)' },
    { roll: [16, 55], copper: '0', silver: '0', gold: '8d6 x 1000', art: '1d10 art (2500 gp each)' },
    { roll: [56, 100], copper: '0', silver: '0', gold: '10d6 x 1000', gems: '1d4 gems (5000 gp each)' },
  ],
};

export const MAGIC_ITEM_RARITY_BY_LEVEL = {
  '1-4': ['Common', 'Uncommon'],
  '5-10': ['Uncommon', 'Rare'],
  '11-16': ['Rare', 'Very Rare'],
  '17-20': ['Very Rare', 'Legendary'],
};

export const CONTEXT_LOOT = {
  dragon_hoard: {
    label: 'Dragon Hoard',
    flavor: 'Mountains of gold coins, gems glittering in the firelight, and magic items accumulated over centuries.',
    extraItems: ['Crown of a fallen kingdom', 'Ancient spellbook', 'Petrified dragon egg', 'Suit of +1 armor', 'Legendary weapon'],
    goldMultiplier: 3,
  },
  bandit_camp: {
    label: 'Bandit Camp',
    flavor: 'Stolen goods in sacks, a locked strongbox, and personal effects of past victims.',
    extraItems: ['Stolen merchant goods (200 gp trade value)', 'Coded letter to bandit lord', 'Map to hidden cache', 'Potion of Healing'],
    goldMultiplier: 0.5,
  },
  wizard_tower: {
    label: 'Wizard Tower',
    flavor: 'Spell components line the shelves. Scrolls and tomes are the real treasure here.',
    extraItems: ['Spellbook with 1d6 spells', 'Spell scroll (random level)', 'Rare component (500 gp)', 'Enchanted focus', 'Research notes'],
    goldMultiplier: 0.8,
  },
  tomb: {
    label: 'Ancient Tomb',
    flavor: 'Burial goods of a forgotten era. Some items crumble at touch, but others endure.',
    extraItems: ['Ancient weapon (possible +1)', 'Ceremonial armor', 'Death mask of gold', 'Cursed amulet', 'Historical artifact (priceless to scholars)'],
    goldMultiplier: 1.2,
  },
  merchant_caravan: {
    label: 'Merchant Caravan',
    flavor: 'Trade goods in crates and barrels. Practical wealth, not legendary treasure.',
    extraItems: ['Bolts of fine silk (100 gp)', 'Cask of aged wine (50 gp)', 'Exotic spices (75 gp)', 'Rare dyes (60 gp)', 'Masterwork tools'],
    goldMultiplier: 1.0,
  },
  cultist_lair: {
    label: 'Cultist Lair',
    flavor: 'Offerings to dark powers. Some items radiate an unsettling energy.',
    extraItems: ['Unholy symbol (silver, 25 gp)', 'Dark ritual scroll', 'Sacrificial dagger (+1, cursed)', 'Eldritch tome', 'Vial of strange ichor'],
    goldMultiplier: 0.7,
  },
};

export const GEM_DESCRIPTIONS = [
  { value: 10, examples: ['Azurite', 'Banded agate', 'Blue quartz', 'Eye agate', 'Hematite', 'Lapis lazuli', 'Malachite', 'Moss agate', 'Obsidian', 'Rhodochrosite', 'Tiger eye', 'Turquoise'] },
  { value: 50, examples: ['Bloodstone', 'Carnelian', 'Chalcedony', 'Chrysoprase', 'Citrine', 'Jasper', 'Moonstone', 'Onyx', 'Quartz', 'Sardonyx', 'Star rose quartz', 'Zircon'] },
  { value: 100, examples: ['Amber', 'Amethyst', 'Chrysoberyl', 'Coral', 'Garnet', 'Jade', 'Jet', 'Pearl', 'Spinel', 'Tourmaline'] },
  { value: 500, examples: ['Alexandrite', 'Aquamarine', 'Black pearl', 'Blue spinel', 'Peridot', 'Topaz'] },
  { value: 1000, examples: ['Black opal', 'Blue sapphire', 'Emerald', 'Fire opal', 'Opal', 'Star ruby', 'Star sapphire', 'Yellow sapphire'] },
  { value: 5000, examples: ['Black sapphire', 'Diamond', 'Jacinth', 'Ruby'] },
];

export function generateLoot(cr, context = null) {
  const tier = cr <= 4 ? '0-4' : cr <= 10 ? '5-10' : cr <= 16 ? '11-16' : '17+';
  const table = INDIVIDUAL_LOOT[tier];
  const roll = d(100);
  const entry = table.find(e => roll >= e.roll[0] && roll <= e.roll[1]) || table[0];

  const result = {
    roll,
    tier,
    copper: entry.copper,
    silver: entry.silver,
    gold: entry.gold,
    gems: entry.gems || null,
    art: entry.art || null,
  };

  if (context && CONTEXT_LOOT[context]) {
    const ctx = CONTEXT_LOOT[context];
    result.contextFlavor = ctx.flavor;
    result.extraItem = pick(ctx.extraItems);
    result.contextLabel = ctx.label;
  }

  return result;
}

export function getContextTypes() {
  return Object.entries(CONTEXT_LOOT).map(([key, c]) => ({ id: key, label: c.label }));
}

export function getRandomGem(minValue = 10) {
  const eligible = GEM_DESCRIPTIONS.filter(g => g.value >= minValue);
  const tier = pick(eligible.length > 0 ? eligible : GEM_DESCRIPTIONS);
  return { gem: pick(tier.examples), value: tier.value };
}
