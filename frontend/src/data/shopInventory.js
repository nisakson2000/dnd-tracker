/**
 * Shop Inventory — Merchant systems and shop generation.
 *
 * Roadmap items covered:
 *   443 — Shop/merchant inventory generation system
 *   444 — Settlement size affects shop availability and item rarity
 *   445 — Haggling rules tied to CHA checks and merchant disposition
 *   446 — Supply and demand modifiers (wartime, scarcity, abundance)
 *   447 — Shop restock logic based on sessions elapsed
 *   448 — Shop type templates (blacksmith, alchemist, magic shop, etc.)
 */

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const d = (n) => Math.floor(Math.random() * n) + 1;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

// ---------------------------------------------------------------------------
// SHOP_TYPES
// ---------------------------------------------------------------------------

export const SHOP_TYPES = {
  general_store: {
    id: 'general_store',
    name: 'General Store',
    description: 'Carries everyday adventuring supplies, food, and basic tools.',
    inventoryCategories: ['adventuring_gear', 'food_drink', 'tools', 'clothing', 'containers'],
    priceModifier: 1.0,
    availability: {
      hamlet: true,
      village: true,
      town: true,
      city: true,
      metropolis: true,
    },
  },
  blacksmith: {
    id: 'blacksmith',
    name: 'Blacksmith',
    description: 'Forges and sells weapons, armor, and metal tools.',
    inventoryCategories: ['simple_weapons', 'martial_weapons', 'light_armor', 'medium_armor', 'heavy_armor', 'shields', 'tools'],
    priceModifier: 1.0,
    availability: {
      hamlet: false,
      village: true,
      town: true,
      city: true,
      metropolis: true,
    },
  },
  alchemist: {
    id: 'alchemist',
    name: 'Alchemist',
    description: 'Brews potions, sells alchemical reagents, and provides antitoxins.',
    inventoryCategories: ['potions', 'alchemical_components', 'antitoxins', 'oils', 'acids'],
    priceModifier: 1.15,
    availability: {
      hamlet: false,
      village: false,
      town: true,
      city: true,
      metropolis: true,
    },
  },
  magic_shop: {
    id: 'magic_shop',
    name: 'Magic Shop',
    description: 'Trades in spell components, scrolls, and minor magic items.',
    inventoryCategories: ['spell_components', 'spell_scrolls', 'magic_items', 'arcane_foci', 'ritual_supplies'],
    priceModifier: 1.5,
    availability: {
      hamlet: false,
      village: false,
      town: false,
      city: true,
      metropolis: true,
    },
  },
  temple_shop: {
    id: 'temple_shop',
    name: 'Temple Shop',
    description: 'Sells holy symbols, religious texts, healing supplies, and divine goods.',
    inventoryCategories: ['holy_symbols', 'healing_supplies', 'divine_foci', 'religious_texts', 'incense'],
    priceModifier: 1.1,
    availability: {
      hamlet: false,
      village: true,
      town: true,
      city: true,
      metropolis: true,
    },
  },
  tavern: {
    id: 'tavern',
    name: 'Tavern',
    description: 'Provides food, drink, lodging, and a place to hear rumors.',
    inventoryCategories: ['food_drink', 'lodging', 'information', 'common_goods'],
    priceModifier: 1.0,
    availability: {
      hamlet: true,
      village: true,
      town: true,
      city: true,
      metropolis: true,
    },
  },
  jeweler: {
    id: 'jeweler',
    name: 'Jeweler',
    description: 'Buys and sells gems, jewelry, and luxury goods.',
    inventoryCategories: ['gems', 'jewelry', 'art_objects', 'luxury_goods'],
    priceModifier: 1.2,
    availability: {
      hamlet: false,
      village: false,
      town: true,
      city: true,
      metropolis: true,
    },
  },
  bookshop_scribe: {
    id: 'bookshop_scribe',
    name: 'Bookshop & Scribe',
    description: 'Sells books, maps, scroll cases, and scribing supplies. Offers copying services.',
    inventoryCategories: ['books', 'maps', 'scribing_supplies', 'languages', 'scroll_cases'],
    priceModifier: 1.25,
    availability: {
      hamlet: false,
      village: false,
      town: true,
      city: true,
      metropolis: true,
    },
  },
  fletcher_bowyer: {
    id: 'fletcher_bowyer',
    name: 'Fletcher & Bowyer',
    description: 'Crafts and sells bows, crossbows, arrows, bolts, and related gear.',
    inventoryCategories: ['ranged_weapons', 'ammunition', 'hunting_gear', 'leather_goods'],
    priceModifier: 1.0,
    availability: {
      hamlet: false,
      village: true,
      town: true,
      city: true,
      metropolis: true,
    },
  },
  exotic_goods: {
    id: 'exotic_goods',
    name: 'Exotic Goods',
    description: 'A mysterious merchant dealing in rare imports, curiosities, and hard-to-find items.',
    inventoryCategories: ['exotic_materials', 'foreign_goods', 'rare_components', 'curios', 'contraband_adjacent'],
    priceModifier: 2.0,
    availability: {
      hamlet: false,
      village: false,
      town: false,
      city: true,
      metropolis: true,
    },
  },
};

// ---------------------------------------------------------------------------
// SETTLEMENT_SIZES
// ---------------------------------------------------------------------------

export const SETTLEMENT_SIZES = {
  hamlet: {
    id: 'hamlet',
    name: 'Hamlet',
    populationRange: [20, 100],
    description: 'A tiny cluster of homes, perhaps a farm community or remote outpost.',
    shopAvailability: ['general_store', 'tavern'],
    maxItemRarity: 'common',
    goldLimitPerTransaction: 50,
    restockDays: 14,
  },
  village: {
    id: 'village',
    name: 'Village',
    populationRange: [100, 500],
    description: 'A small but established community with basic services.',
    shopAvailability: ['general_store', 'blacksmith', 'tavern', 'temple_shop', 'fletcher_bowyer'],
    maxItemRarity: 'common',
    goldLimitPerTransaction: 200,
    restockDays: 7,
  },
  town: {
    id: 'town',
    name: 'Town',
    populationRange: [500, 5000],
    description: 'A proper settlement with a market district and variety of craftsmen.',
    shopAvailability: [
      'general_store', 'blacksmith', 'alchemist', 'tavern',
      'temple_shop', 'jeweler', 'bookshop_scribe', 'fletcher_bowyer',
    ],
    maxItemRarity: 'uncommon',
    goldLimitPerTransaction: 2000,
    restockDays: 5,
  },
  city: {
    id: 'city',
    name: 'City',
    populationRange: [5000, 25000],
    description: 'A major hub of commerce, culture, and governance.',
    shopAvailability: [
      'general_store', 'blacksmith', 'alchemist', 'magic_shop',
      'temple_shop', 'tavern', 'jeweler', 'bookshop_scribe',
      'fletcher_bowyer', 'exotic_goods',
    ],
    maxItemRarity: 'rare',
    goldLimitPerTransaction: 25000,
    restockDays: 3,
  },
  metropolis: {
    id: 'metropolis',
    name: 'Metropolis',
    populationRange: [25000, Infinity],
    description: 'A sprawling capital or trade center where nearly anything can be found.',
    shopAvailability: [
      'general_store', 'blacksmith', 'alchemist', 'magic_shop',
      'temple_shop', 'tavern', 'jeweler', 'bookshop_scribe',
      'fletcher_bowyer', 'exotic_goods',
    ],
    maxItemRarity: 'very_rare',
    goldLimitPerTransaction: 100000,
    restockDays: 1,
  },
};

// ---------------------------------------------------------------------------
// SHOP_INVENTORY_TEMPLATES
// ---------------------------------------------------------------------------

export const SHOP_INVENTORY_TEMPLATES = {
  general_store: [
    { name: 'Rope, hempen (50 ft)', basePrice: 1, weight: 10, category: 'adventuring_gear', rarity: 'common' },
    { name: 'Torches (10)', basePrice: 1, weight: 10, category: 'adventuring_gear', rarity: 'common' },
    { name: 'Trail Rations (1 day)', basePrice: 0.5, weight: 2, category: 'food_drink', rarity: 'common' },
    { name: 'Backpack', basePrice: 2, weight: 5, category: 'containers', rarity: 'common' },
    { name: 'Bedroll', basePrice: 1, weight: 7, category: 'adventuring_gear', rarity: 'common' },
    { name: 'Waterskin', basePrice: 0.2, weight: 5, category: 'containers', rarity: 'common' },
    { name: 'Flint and Steel', basePrice: 1, weight: 1, category: 'adventuring_gear', rarity: 'common' },
    { name: 'Lantern, bullseye', basePrice: 10, weight: 2, category: 'adventuring_gear', rarity: 'common' },
    { name: 'Oil (flask)', basePrice: 0.1, weight: 1, category: 'adventuring_gear', rarity: 'common' },
    { name: 'Blanket', basePrice: 0.5, weight: 3, category: 'clothing', rarity: 'common' },
    { name: 'Crowbar', basePrice: 2, weight: 5, category: 'tools', rarity: 'common' },
    { name: 'Hammer', basePrice: 1, weight: 3, category: 'tools', rarity: 'common' },
    { name: 'Piton (10)', basePrice: 0.5, weight: 2.5, category: 'adventuring_gear', rarity: 'common' },
    { name: 'Mirror, steel', basePrice: 5, weight: 0.5, category: 'adventuring_gear', rarity: 'common' },
    { name: 'Sack', basePrice: 0.01, weight: 0.5, category: 'containers', rarity: 'common' },
    { name: 'Shovel', basePrice: 2, weight: 5, category: 'tools', rarity: 'common' },
    { name: 'Tent, two-person', basePrice: 2, weight: 20, category: 'adventuring_gear', rarity: 'common' },
    { name: 'Soap', basePrice: 0.02, weight: 0, category: 'common_goods', rarity: 'common' },
    { name: 'Candles (10)', basePrice: 0.5, weight: 1, category: 'adventuring_gear', rarity: 'common' },
    { name: 'Chalk (1 piece)', basePrice: 0.01, weight: 0, category: 'adventuring_gear', rarity: 'common' },
  ],
  blacksmith: [
    // Simple weapons
    { name: 'Handaxe', basePrice: 5, weight: 2, category: 'simple_weapons', rarity: 'common' },
    { name: 'Spear', basePrice: 1, weight: 3, category: 'simple_weapons', rarity: 'common' },
    { name: 'Dagger', basePrice: 2, weight: 1, category: 'simple_weapons', rarity: 'common' },
    { name: 'Mace', basePrice: 5, weight: 4, category: 'simple_weapons', rarity: 'common' },
    { name: 'Quarterstaff', basePrice: 0.2, weight: 4, category: 'simple_weapons', rarity: 'common' },
    // Martial weapons
    { name: 'Longsword', basePrice: 15, weight: 3, category: 'martial_weapons', rarity: 'common' },
    { name: 'Battleaxe', basePrice: 10, weight: 4, category: 'martial_weapons', rarity: 'common' },
    { name: 'Shortsword', basePrice: 10, weight: 2, category: 'martial_weapons', rarity: 'common' },
    { name: 'Rapier', basePrice: 25, weight: 2, category: 'martial_weapons', rarity: 'common' },
    { name: 'Warhammer', basePrice: 15, weight: 2, category: 'martial_weapons', rarity: 'common' },
    { name: 'Greatsword', basePrice: 50, weight: 6, category: 'martial_weapons', rarity: 'common' },
    { name: 'Halberd', basePrice: 20, weight: 6, category: 'martial_weapons', rarity: 'common' },
    // Armor
    { name: 'Leather Armor', basePrice: 10, weight: 10, category: 'light_armor', rarity: 'common' },
    { name: 'Studded Leather Armor', basePrice: 45, weight: 13, category: 'light_armor', rarity: 'common' },
    { name: 'Chain Shirt', basePrice: 50, weight: 20, category: 'medium_armor', rarity: 'common' },
    { name: 'Scale Mail', basePrice: 50, weight: 45, category: 'medium_armor', rarity: 'common' },
    { name: 'Breastplate', basePrice: 400, weight: 20, category: 'medium_armor', rarity: 'uncommon' },
    { name: 'Chain Mail', basePrice: 75, weight: 55, category: 'heavy_armor', rarity: 'common' },
    { name: 'Splint Armor', basePrice: 200, weight: 60, category: 'heavy_armor', rarity: 'uncommon' },
    { name: 'Shield', basePrice: 10, weight: 6, category: 'shields', rarity: 'common' },
    // Tools
    { name: 'Smiths Tools', basePrice: 20, weight: 8, category: 'tools', rarity: 'common' },
    { name: 'Miners Pick', basePrice: 2, weight: 10, category: 'tools', rarity: 'common' },
  ],
  alchemist: [
    { name: 'Potion of Healing', basePrice: 50, weight: 0.5, category: 'potions', rarity: 'common' },
    { name: 'Potion of Greater Healing', basePrice: 150, weight: 0.5, category: 'potions', rarity: 'uncommon' },
    { name: 'Antitoxin (vial)', basePrice: 50, weight: 0, category: 'antitoxins', rarity: 'common' },
    { name: 'Acid (vial)', basePrice: 25, weight: 1, category: 'acids', rarity: 'common' },
    { name: 'Alchemist\'s Fire (flask)', basePrice: 50, weight: 1, category: 'alchemical_components', rarity: 'common' },
    { name: 'Antitoxin (superior)', basePrice: 100, weight: 0, category: 'antitoxins', rarity: 'uncommon' },
    { name: 'Herbalism Kit', basePrice: 5, weight: 3, category: 'alchemical_components', rarity: 'common' },
    { name: 'Alchemist\'s Supplies', basePrice: 50, weight: 8, category: 'tools', rarity: 'common' },
    { name: 'Healer\'s Kit', basePrice: 5, weight: 3, category: 'healing_supplies', rarity: 'common' },
    { name: 'Potion of Animal Friendship', basePrice: 100, weight: 0.5, category: 'potions', rarity: 'uncommon' },
    { name: 'Potion of Water Breathing', basePrice: 180, weight: 0.5, category: 'potions', rarity: 'uncommon' },
    { name: 'Oil of Slipperiness', basePrice: 480, weight: 0.5, category: 'oils', rarity: 'uncommon' },
    { name: 'Tanglefoot Bag', basePrice: 50, weight: 4, category: 'alchemical_components', rarity: 'common' },
    { name: 'Smokestick', basePrice: 20, weight: 0.5, category: 'alchemical_components', rarity: 'common' },
    { name: 'Thunderstone', basePrice: 30, weight: 1, category: 'alchemical_components', rarity: 'common' },
  ],
  magic_shop: [
    { name: 'Spell Scroll (Cantrip)', basePrice: 25, weight: 0, category: 'spell_scrolls', rarity: 'common' },
    { name: 'Spell Scroll (1st Level)', basePrice: 75, weight: 0, category: 'spell_scrolls', rarity: 'common' },
    { name: 'Spell Scroll (2nd Level)', basePrice: 150, weight: 0, category: 'spell_scrolls', rarity: 'uncommon' },
    { name: 'Spell Scroll (3rd Level)', basePrice: 300, weight: 0, category: 'spell_scrolls', rarity: 'uncommon' },
    { name: 'Arcane Focus, Crystal', basePrice: 10, weight: 1, category: 'arcane_foci', rarity: 'common' },
    { name: 'Arcane Focus, Orb', basePrice: 20, weight: 3, category: 'arcane_foci', rarity: 'common' },
    { name: 'Arcane Focus, Rod', basePrice: 10, weight: 2, category: 'arcane_foci', rarity: 'common' },
    { name: 'Arcane Focus, Wand', basePrice: 10, weight: 1, category: 'arcane_foci', rarity: 'common' },
    { name: 'Potion of Climbing', basePrice: 180, weight: 0.5, category: 'potions', rarity: 'uncommon' },
    { name: 'Bag of Holding', basePrice: 4000, weight: 15, category: 'magic_items', rarity: 'uncommon' },
    { name: 'Rope of Climbing', basePrice: 2000, weight: 3, category: 'magic_items', rarity: 'uncommon' },
    { name: 'Sending Stones (pair)', basePrice: 2000, weight: 0, category: 'magic_items', rarity: 'uncommon' },
    { name: 'Eyes of the Eagle', basePrice: 2500, weight: 0, category: 'magic_items', rarity: 'uncommon' },
    { name: 'Component Pouch', basePrice: 25, weight: 2, category: 'spell_components', rarity: 'common' },
    { name: 'Ritual Candles (10)', basePrice: 10, weight: 1, category: 'ritual_supplies', rarity: 'common' },
    { name: 'Spellbook (blank)', basePrice: 50, weight: 3, category: 'ritual_supplies', rarity: 'common' },
  ],
  temple_shop: [
    { name: 'Holy Symbol, silver', basePrice: 25, weight: 1, category: 'holy_symbols', rarity: 'common' },
    { name: 'Holy Symbol, wooden', basePrice: 5, weight: 1, category: 'holy_symbols', rarity: 'common' },
    { name: 'Holy Symbol, amulet', basePrice: 5, weight: 1, category: 'divine_foci', rarity: 'common' },
    { name: 'Holy Water (flask)', basePrice: 25, weight: 1, category: 'healing_supplies', rarity: 'common' },
    { name: 'Healer\'s Kit', basePrice: 5, weight: 3, category: 'healing_supplies', rarity: 'common' },
    { name: 'Prayer Book', basePrice: 25, weight: 2, category: 'religious_texts', rarity: 'common' },
    { name: 'Incense (block)', basePrice: 0.1, weight: 0, category: 'incense', rarity: 'common' },
    { name: 'Vestments', basePrice: 5, weight: 4, category: 'clothing', rarity: 'common' },
    { name: 'Prayer Beads', basePrice: 10, weight: 0, category: 'holy_symbols', rarity: 'common' },
    { name: 'Candles, blessed (10)', basePrice: 5, weight: 1, category: 'ritual_supplies', rarity: 'common' },
    { name: 'Scroll of Bless', basePrice: 75, weight: 0, category: 'spell_scrolls', rarity: 'common' },
    { name: 'Scroll of Cure Wounds', basePrice: 75, weight: 0, category: 'spell_scrolls', rarity: 'common' },
    { name: 'Potion of Healing', basePrice: 50, weight: 0.5, category: 'potions', rarity: 'common' },
    { name: 'Divine Tome', basePrice: 50, weight: 5, category: 'religious_texts', rarity: 'uncommon' },
  ],
  tavern: [
    { name: 'Ale (mug)', basePrice: 0.04, weight: 1, category: 'food_drink', rarity: 'common' },
    { name: 'Ale (gallon)', basePrice: 0.2, weight: 8, category: 'food_drink', rarity: 'common' },
    { name: 'Wine, common (pitcher)', basePrice: 0.2, weight: 3, category: 'food_drink', rarity: 'common' },
    { name: 'Wine, fine (bottle)', basePrice: 10, weight: 2, category: 'food_drink', rarity: 'uncommon' },
    { name: 'Banquet (per person)', basePrice: 10, weight: 0, category: 'food_drink', rarity: 'uncommon' },
    { name: 'Meals, squalid (per day)', basePrice: 0.03, weight: 0, category: 'food_drink', rarity: 'common' },
    { name: 'Meals, modest (per day)', basePrice: 0.3, weight: 0, category: 'food_drink', rarity: 'common' },
    { name: 'Meals, comfortable (per day)', basePrice: 0.5, weight: 0, category: 'food_drink', rarity: 'common' },
    { name: 'Inn stay, poor (per night)', basePrice: 0.1, weight: 0, category: 'lodging', rarity: 'common' },
    { name: 'Inn stay, modest (per night)', basePrice: 0.5, weight: 0, category: 'lodging', rarity: 'common' },
    { name: 'Inn stay, comfortable (per night)', basePrice: 2, weight: 0, category: 'lodging', rarity: 'common' },
    { name: 'Rumors (general)', basePrice: 1, weight: 0, category: 'information', rarity: 'common' },
    { name: 'Rumors (specific)', basePrice: 5, weight: 0, category: 'information', rarity: 'uncommon' },
  ],
  jeweler: [
    { name: 'Azurite (10 gp gem)', basePrice: 10, weight: 0, category: 'gems', rarity: 'common' },
    { name: 'Bloodstone (50 gp gem)', basePrice: 50, weight: 0, category: 'gems', rarity: 'common' },
    { name: 'Carnelian (50 gp gem)', basePrice: 50, weight: 0, category: 'gems', rarity: 'common' },
    { name: 'Amber (100 gp gem)', basePrice: 100, weight: 0, category: 'gems', rarity: 'common' },
    { name: 'Garnet (100 gp gem)', basePrice: 100, weight: 0, category: 'gems', rarity: 'common' },
    { name: 'Pearl (100 gp gem)', basePrice: 100, weight: 0, category: 'gems', rarity: 'common' },
    { name: 'Spinel (100 gp gem)', basePrice: 100, weight: 0, category: 'gems', rarity: 'uncommon' },
    { name: 'Black pearl (500 gp gem)', basePrice: 500, weight: 0, category: 'gems', rarity: 'uncommon' },
    { name: 'Emerald (1000 gp gem)', basePrice: 1000, weight: 0, category: 'gems', rarity: 'rare' },
    { name: 'Diamond (5000 gp gem)', basePrice: 5000, weight: 0, category: 'gems', rarity: 'very_rare' },
    { name: 'Silver necklace', basePrice: 25, weight: 0, category: 'jewelry', rarity: 'common' },
    { name: 'Gold ring', basePrice: 50, weight: 0, category: 'jewelry', rarity: 'common' },
    { name: 'Gem-set brooch', basePrice: 250, weight: 0, category: 'jewelry', rarity: 'uncommon' },
    { name: 'Painted portrait miniature', basePrice: 25, weight: 0, category: 'art_objects', rarity: 'common' },
    { name: 'Silver ewer (art)', basePrice: 25, weight: 2, category: 'art_objects', rarity: 'common' },
    { name: 'Silk cloth (bolt)', basePrice: 50, weight: 5, category: 'luxury_goods', rarity: 'uncommon' },
  ],
  bookshop_scribe: [
    { name: 'Book, blank journal', basePrice: 25, weight: 5, category: 'books', rarity: 'common' },
    { name: 'Book, history', basePrice: 25, weight: 5, category: 'books', rarity: 'common' },
    { name: 'Book, arcane theory', basePrice: 50, weight: 5, category: 'books', rarity: 'uncommon' },
    { name: 'Map, city', basePrice: 1, weight: 0, category: 'maps', rarity: 'common' },
    { name: 'Map, regional', basePrice: 5, weight: 0, category: 'maps', rarity: 'common' },
    { name: 'Map, dungeon (local rumor)', basePrice: 25, weight: 0, category: 'maps', rarity: 'uncommon' },
    { name: 'Ink (1 oz vial)', basePrice: 10, weight: 0, category: 'scribing_supplies', rarity: 'common' },
    { name: 'Ink pen', basePrice: 0.02, weight: 0, category: 'scribing_supplies', rarity: 'common' },
    { name: 'Parchment (one sheet)', basePrice: 0.1, weight: 0, category: 'scribing_supplies', rarity: 'common' },
    { name: 'Paper (one sheet)', basePrice: 0.2, weight: 0, category: 'scribing_supplies', rarity: 'common' },
    { name: 'Scroll case', basePrice: 1, weight: 0.5, category: 'scroll_cases', rarity: 'common' },
    { name: 'Sealing wax', basePrice: 0.05, weight: 0, category: 'scribing_supplies', rarity: 'common' },
    { name: 'Signet ring (blank)', basePrice: 5, weight: 0, category: 'scribing_supplies', rarity: 'common' },
    { name: 'Language primer', basePrice: 15, weight: 3, category: 'languages', rarity: 'uncommon' },
    { name: 'Calligrapher\'s Supplies', basePrice: 10, weight: 5, category: 'tools', rarity: 'common' },
  ],
  fletcher_bowyer: [
    { name: 'Shortbow', basePrice: 25, weight: 2, category: 'ranged_weapons', rarity: 'common' },
    { name: 'Longbow', basePrice: 50, weight: 2, category: 'ranged_weapons', rarity: 'common' },
    { name: 'Light Crossbow', basePrice: 25, weight: 5, category: 'ranged_weapons', rarity: 'common' },
    { name: 'Heavy Crossbow', basePrice: 50, weight: 18, category: 'ranged_weapons', rarity: 'common' },
    { name: 'Hand Crossbow', basePrice: 75, weight: 3, category: 'ranged_weapons', rarity: 'uncommon' },
    { name: 'Arrows (20)', basePrice: 1, weight: 1, category: 'ammunition', rarity: 'common' },
    { name: 'Crossbow Bolts (20)', basePrice: 1, weight: 1.5, category: 'ammunition', rarity: 'common' },
    { name: 'Blowgun Needles (50)', basePrice: 1, weight: 1, category: 'ammunition', rarity: 'common' },
    { name: 'Quiver', basePrice: 1, weight: 1, category: 'ammunition', rarity: 'common' },
    { name: 'Hunting Trap', basePrice: 5, weight: 25, category: 'hunting_gear', rarity: 'common' },
    { name: 'Crossbow Bolt Case', basePrice: 1, weight: 1, category: 'ammunition', rarity: 'common' },
    { name: 'Leather Gloves', basePrice: 3, weight: 0.5, category: 'leather_goods', rarity: 'common' },
    { name: 'Bowyer\'s Tools', basePrice: 15, weight: 5, category: 'tools', rarity: 'common' },
    { name: 'Silver-tipped Arrows (20)', basePrice: 10, weight: 1, category: 'ammunition', rarity: 'uncommon' },
  ],
  exotic_goods: [
    { name: 'Spice, saffron (1 lb)', basePrice: 15, weight: 1, category: 'foreign_goods', rarity: 'uncommon' },
    { name: 'Spice, cloves (1 lb)', basePrice: 15, weight: 1, category: 'foreign_goods', rarity: 'uncommon' },
    { name: 'Dragon Scale (1)', basePrice: 500, weight: 2, category: 'exotic_materials', rarity: 'rare' },
    { name: 'Basilisk Oil (vial)', basePrice: 300, weight: 0.5, category: 'rare_components', rarity: 'rare' },
    { name: 'Beholder Eye (preserved)', basePrice: 750, weight: 2, category: 'rare_components', rarity: 'rare' },
    { name: 'Wyvern Poison (vial)', basePrice: 1200, weight: 0, category: 'rare_components', rarity: 'rare' },
    { name: 'Astral Projection Map', basePrice: 200, weight: 0, category: 'curios', rarity: 'rare' },
    { name: 'Haunted Compass', basePrice: 150, weight: 0.5, category: 'curios', rarity: 'uncommon' },
    { name: 'Forbidden Tome (redacted)', basePrice: 350, weight: 5, category: 'contraband_adjacent', rarity: 'rare' },
    { name: 'Smuggled Elven Wine (bottle)', basePrice: 100, weight: 2, category: 'foreign_goods', rarity: 'uncommon' },
    { name: 'Drow Silk Cloak', basePrice: 400, weight: 1, category: 'exotic_materials', rarity: 'rare' },
    { name: 'Strange Idol (foreign deity)', basePrice: 50, weight: 3, category: 'curios', rarity: 'uncommon' },
    { name: 'Bag of Exotic Seeds', basePrice: 75, weight: 2, category: 'foreign_goods', rarity: 'uncommon' },
    { name: 'Mechanical Automaton Piece', basePrice: 1000, weight: 10, category: 'curios', rarity: 'rare' },
  ],
};

// ---------------------------------------------------------------------------
// HAGGLING_RULES
// ---------------------------------------------------------------------------

export const HAGGLING_RULES = {
  description: 'A Charisma (Persuasion) check against the merchant\'s haggle DC. The DC is modified by merchant disposition.',
  dcBreakpoints: [
    { dc: 10, discount: 0.05, label: '5% off' },
    { dc: 15, discount: 0.10, label: '10% off' },
    { dc: 20, discount: 0.15, label: '15% off' },
    { dc: 25, discount: 0.25, label: '25% off' },
  ],
  merchantDispositions: {
    hostile: {
      label: 'Hostile',
      dcModifier: +5,
      description: 'The merchant dislikes you. Prices are firm and negotiation is risky.',
      failurePenalty: 'Merchant may refuse further haggling this visit.',
    },
    unfriendly: {
      label: 'Unfriendly',
      dcModifier: +3,
      description: 'The merchant is cool toward you. Expects fair payment.',
      failurePenalty: 'No discount available until disposition improves.',
    },
    indifferent: {
      label: 'Indifferent',
      dcModifier: 0,
      description: 'The merchant treats you like any customer.',
      failurePenalty: 'No discount; full price applies.',
    },
    friendly: {
      label: 'Friendly',
      dcModifier: -2,
      description: 'The merchant likes you. Willing to negotiate.',
      failurePenalty: 'Full price, no hard feelings.',
    },
    helpful: {
      label: 'Helpful',
      dcModifier: -5,
      description: 'The merchant considers you a valued patron or ally.',
      failurePenalty: 'Still gets a 5% loyalty discount on failure.',
    },
  },
  bulkDiscounts: [
    { itemsOrMore: 5, goldOrMore: 50, discount: 0.05, label: '5% bulk (5+ items or 50+ gp)' },
    { itemsOrMore: 10, goldOrMore: 200, discount: 0.10, label: '10% bulk (10+ items or 200+ gp)' },
    { itemsOrMore: 20, goldOrMore: 500, discount: 0.15, label: '15% bulk (20+ items or 500+ gp)' },
  ],
  rules: [
    'Haggling requires a Charisma (Persuasion) check.',
    'The base haggle DC is 15, modified by merchant disposition.',
    'A natural 1 may offend the merchant and worsen disposition.',
    'A natural 20 always achieves the 25% discount regardless of disposition.',
    'Bulk discounts stack additively with haggle discounts, up to a maximum of 35% off.',
    'Magical, exotic, or unique items may be non-negotiable at DM discretion.',
    'Repeated haggling attempts at the same merchant increase DC by 3 per attempt.',
  ],
};

// ---------------------------------------------------------------------------
// SUPPLY_AND_DEMAND
// ---------------------------------------------------------------------------

export const SUPPLY_AND_DEMAND = {
  modifiers: {
    abundant: {
      id: 'abundant',
      label: 'Abundant',
      priceMultiplier: 0.80,
      description: 'The item is overproduced or in seasonal surplus.',
      exampleEvents: ['Successful harvest', 'Flooded market from caravans', 'Peacetime manufacturing boom'],
    },
    normal: {
      id: 'normal',
      label: 'Normal',
      priceMultiplier: 1.0,
      description: 'Standard supply and demand. Base price applies.',
      exampleEvents: ['Stable trade routes', 'No major disruptions'],
    },
    scarce: {
      id: 'scarce',
      label: 'Scarce',
      priceMultiplier: 1.25,
      description: 'The item is harder to come by than usual.',
      exampleEvents: ['Trade route disruption', 'Seasonal shortage', 'Increased demand from adventurers'],
    },
    rare_supply: {
      id: 'rare_supply',
      label: 'Rare',
      priceMultiplier: 1.50,
      description: 'Very limited availability. Merchants are reluctant to part with stock.',
      exampleEvents: ['Artisan has left town', 'Import blocked by conflict', 'Unusual spell component demand'],
    },
    wartime: {
      id: 'wartime',
      label: 'Wartime',
      priceMultiplier: 2.0,
      description: 'War or major conflict drives up prices dramatically, especially for weapons, armor, and food.',
      exampleEvents: ['Open warfare nearby', 'Army conscription of goods', 'Siege conditions'],
    },
    black_market: {
      id: 'black_market',
      label: 'Black Market',
      priceMultiplier: 3.0,
      description: 'Illegal or contraband supply chain. Extreme markup; extreme risk.',
      exampleEvents: ['Item banned by local lord', 'Guild monopoly broken', 'Item classified as dangerous magic'],
    },
  },
  eventTable: [
    { d20Roll: [1, 2], modifier: 'abundant', note: 'Overstock sale — merchant has too much of one category.' },
    { d20Roll: [3, 10], modifier: 'normal', note: 'Business as usual.' },
    { d20Roll: [11, 14], modifier: 'scarce', note: 'Delayed shipment or increased demand.' },
    { d20Roll: [15, 17], modifier: 'rare_supply', note: 'Item rarely reaches this settlement.' },
    { d20Roll: [18, 19], modifier: 'wartime', note: 'Regional conflict inflating prices.' },
    { d20Roll: [20, 20], modifier: 'black_market', note: 'Item is restricted; merchant risks selling it.' },
  ],
};

// ---------------------------------------------------------------------------
// Exported helper functions
// ---------------------------------------------------------------------------

/**
 * Returns a shop type definition by its id.
 * @param {string} typeId
 * @returns {object|null}
 */
export function getShopType(typeId) {
  return SHOP_TYPES[typeId] ?? null;
}

/**
 * Returns all shop types available in a given settlement size.
 * @param {string} settlementSize — key from SETTLEMENT_SIZES
 * @returns {object[]}
 */
export function getAvailableShops(settlementSize) {
  const settlement = SETTLEMENT_SIZES[settlementSize];
  if (!settlement) return [];
  return settlement.shopAvailability.map((id) => SHOP_TYPES[id]).filter(Boolean);
}

/**
 * Applies supply/demand and haggle modifiers to a base price.
 * @param {number} basePrice
 * @param {string} supplyLevel — key from SUPPLY_AND_DEMAND.modifiers
 * @param {number} [haggleDiscount=0] — fractional discount from haggling (e.g. 0.10 for 10% off)
 * @returns {number} final price in gold, rounded to nearest copper (2 decimals)
 */
export function calculatePrice(basePrice, supplyLevel, haggleDiscount = 0) {
  const mod = SUPPLY_AND_DEMAND.modifiers[supplyLevel] ?? SUPPLY_AND_DEMAND.modifiers.normal;
  const supplyPrice = basePrice * mod.priceMultiplier;
  const discount = clamp(haggleDiscount, 0, 0.35);
  const final = supplyPrice * (1 - discount);
  return Math.round(final * 100) / 100;
}

/**
 * Resolves a haggle attempt given a Charisma modifier and merchant disposition.
 * @param {number} charismaModifier — the character's CHA modifier (not score)
 * @param {string} merchantDisposition — key from HAGGLING_RULES.merchantDispositions
 * @returns {{ roll: number, total: number, dc: number, discount: number, label: string, success: boolean }}
 */
export function rollHaggle(charismaModifier, merchantDisposition) {
  const disposition = HAGGLING_RULES.merchantDispositions[merchantDisposition]
    ?? HAGGLING_RULES.merchantDispositions.indifferent;
  const baseDc = 15;
  const dc = baseDc + disposition.dcModifier;
  const roll = d(20);
  const total = roll + charismaModifier;

  // Natural 20 always gives max discount; natural 1 always fails
  if (roll === 20) {
    const best = HAGGLING_RULES.dcBreakpoints[HAGGLING_RULES.dcBreakpoints.length - 1];
    return { roll, total, dc, discount: best.discount, label: best.label, success: true, critical: true };
  }
  if (roll === 1) {
    return { roll, total, dc, discount: 0, label: 'No discount', success: false, critical: false };
  }

  // Find highest breakpoint met
  const met = HAGGLING_RULES.dcBreakpoints.filter((bp) => total >= dc + (bp.dc - baseDc));
  if (met.length === 0) {
    // Friendly failure still gets loyalty discount
    if (merchantDisposition === 'helpful') {
      return { roll, total, dc, discount: 0.05, label: '5% loyalty (failure)', success: false, critical: false };
    }
    return { roll, total, dc, discount: 0, label: 'No discount', success: false, critical: false };
  }

  const best = met[met.length - 1];
  return { roll, total, dc, discount: best.discount, label: best.label, success: true, critical: false };
}

/**
 * Generates a shop's current inventory.
 * @param {string} shopType — key from SHOP_TYPES
 * @param {string} settlementSize — key from SETTLEMENT_SIZES
 * @param {object} [options]
 * @param {string} [options.supplyLevel='normal'] — key from SUPPLY_AND_DEMAND.modifiers
 * @param {number} [options.stockVariance=0.7] — fraction of template items to include (0–1)
 * @param {boolean} [options.randomizeQuantities=true]
 * @returns {object[]} array of inventory items with current price and stock
 */
export function generateShopInventory(shopType, settlementSize, options = {}) {
  const {
    supplyLevel = 'normal',
    stockVariance = 0.7,
    randomizeQuantities = true,
  } = options;

  const settlement = SETTLEMENT_SIZES[settlementSize];
  const shop = SHOP_TYPES[shopType];
  if (!settlement || !shop) return [];

  // Check this shop type is available in this settlement
  if (!settlement.shopAvailability.includes(shopType)) return [];

  const rarityOrder = ['common', 'uncommon', 'rare', 'very_rare', 'legendary'];
  const maxRarityIndex = rarityOrder.indexOf(settlement.maxItemRarity);

  const template = SHOP_INVENTORY_TEMPLATES[shopType] ?? [];

  return template
    .filter((item) => {
      // Filter out items above the settlement's max rarity
      const itemRarityIndex = rarityOrder.indexOf(item.rarity);
      if (itemRarityIndex > maxRarityIndex) return false;
      // Random stock variance
      return Math.random() < stockVariance;
    })
    .map((item) => {
      const currentPrice = calculatePrice(item.basePrice * shop.priceModifier, supplyLevel);
      const qty = randomizeQuantities ? d(5) : 1;
      return {
        ...item,
        currentPrice,
        supplyLevel,
        quantity: qty,
        shopType,
        settlementSize,
      };
    });
}

/**
 * Simulates restocking a shop after one or more sessions have elapsed.
 * Items with depleted stock are replenished proportional to sessions elapsed.
 * @param {object[]} currentInventory — existing inventory array from generateShopInventory
 * @param {string} shopType
 * @param {number} sessionsElapsed — number of game sessions since last restock
 * @returns {object[]} updated inventory
 */
export function restockShop(currentInventory, shopType, sessionsElapsed) {
  if (!currentInventory || currentInventory.length === 0) return currentInventory;
  const restockRate = clamp(sessionsElapsed * 0.25, 0, 1); // 1 session = 25% restock; 4+ = full

  return currentInventory.map((item) => {
    const maxQty = d(5);
    const restored = Math.floor((maxQty - item.quantity) * restockRate);
    const newQty = Math.min(item.quantity + restored + (Math.random() < restockRate ? d(2) : 0), maxQty);
    return { ...item, quantity: newQty };
  });
}
