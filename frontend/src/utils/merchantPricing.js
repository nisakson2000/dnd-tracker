/**
 * Merchant AI + Dynamic Pricing — Phase 6F
 *
 * Calculates item prices based on supply, demand, reputation,
 * location, NPC personality, and relationship.
 */

// ── Location type price modifiers ──
const LOCATION_MODIFIERS = {
  capital: 0.90,       // Trade hub — competitive prices
  city: 0.95,          // Large market — slightly below base
  town: 1.00,          // Standard pricing
  village: 1.15,       // Limited supply — slightly above
  outpost: 1.30,       // Remote — markup for scarcity
  wilderness: 1.50,    // Frontier — significant markup
  underdark: 1.60,     // Hard to reach — premium
  planar: 1.40,        // Exotic — unusual goods, unusual prices
  black_market: 0.70,  // Stolen goods — sells cheap, buys cheaper
};

// ── NPC trait price modifiers ──
const TRAIT_MODIFIERS = {
  greedy: 1.20,
  generous: 0.85,
  shrewd: 1.10,
  kind: 0.90,
  suspicious: 1.05,
  deceptive: 1.15,     // Hidden markup
  honest: 0.95,
  pragmatic: 1.00,
};

// ── Trust score → price modifier ──
function trustPriceModifier(trustScore) {
  if (trustScore >= 80) return 0.80;   // Best friends — 20% off
  if (trustScore >= 50) return 0.85;   // Devoted — 15% off
  if (trustScore >= 20) return 0.92;   // Friendly — 8% off
  if (trustScore >= -19) return 1.00;  // Neutral — base price
  if (trustScore >= -49) return 1.15;  // Distrustful — 15% markup
  if (trustScore >= -79) return 1.30;  // Hostile — 30% markup
  return 1.50;                          // Sworn enemy — 50% markup
}

// ── Faction reputation → price modifier ──
function factionPriceModifier(reputationScore) {
  if (reputationScore >= 50) return 0.90;
  if (reputationScore >= 20) return 0.95;
  if (reputationScore >= -19) return 1.00;
  if (reputationScore >= -49) return 1.10;
  return 1.25;
}

// ── Rarity → base price ranges ──
export const RARITY_PRICE_RANGES = {
  common: { min: 1, max: 100 },
  uncommon: { min: 101, max: 500 },
  rare: { min: 501, max: 5000 },
  'very rare': { min: 5001, max: 50000 },
  legendary: { min: 50001, max: 500000 },
};

/**
 * Calculate the final price of an item with all modifiers applied.
 *
 * @param {Object} params
 * @param {number} params.basePrice - Base GP price (SRD value)
 * @param {string} params.locationType - One of LOCATION_MODIFIERS keys
 * @param {string[]} params.merchantTraits - NPC personality traits
 * @param {number} params.trustScore - NPC trust toward party (-100 to 100)
 * @param {number} params.factionReputation - Party's reputation with merchant's faction (-100 to 100)
 * @param {number} params.demandMultiplier - Supply/demand modifier (default 1.0)
 * @param {number} params.economyModifier - Regional economy modifier from campaign_economy table
 * @param {boolean} params.isBuying - true if party is buying from merchant, false if selling
 * @returns {Object} { finalPrice, breakdown, totalMultiplier }
 */
export function calculatePrice({
  basePrice = 0,
  locationType = 'town',
  merchantTraits = [],
  trustScore = 0,
  factionReputation = 0,
  demandMultiplier = 1.0,
  economyModifier = 1.0,
  isBuying = true,
}) {
  const breakdown = [];
  let totalMultiplier = 1.0;

  // Location modifier
  const locMod = LOCATION_MODIFIERS[locationType] || 1.0;
  if (locMod !== 1.0) {
    breakdown.push({ source: `Location (${locationType})`, modifier: locMod });
    totalMultiplier *= locMod;
  }

  // Merchant personality traits (use most impactful one)
  let traitMod = 1.0;
  let traitSource = '';
  for (const trait of merchantTraits) {
    const mod = TRAIT_MODIFIERS[trait];
    if (mod && Math.abs(mod - 1.0) > Math.abs(traitMod - 1.0)) {
      traitMod = mod;
      traitSource = trait;
    }
  }
  if (traitMod !== 1.0) {
    breakdown.push({ source: `Merchant trait (${traitSource})`, modifier: traitMod });
    totalMultiplier *= traitMod;
  }

  // Trust modifier
  const trustMod = trustPriceModifier(trustScore);
  if (trustMod !== 1.0) {
    breakdown.push({ source: `Trust (${trustScore})`, modifier: trustMod });
    totalMultiplier *= trustMod;
  }

  // Faction reputation
  const factionMod = factionPriceModifier(factionReputation);
  if (factionMod !== 1.0) {
    breakdown.push({ source: `Faction reputation (${factionReputation})`, modifier: factionMod });
    totalMultiplier *= factionMod;
  }

  // Supply/demand
  if (demandMultiplier !== 1.0) {
    breakdown.push({ source: 'Supply/Demand', modifier: demandMultiplier });
    totalMultiplier *= demandMultiplier;
  }

  // Regional economy
  if (economyModifier !== 1.0) {
    breakdown.push({ source: 'Regional economy', modifier: economyModifier });
    totalMultiplier *= economyModifier;
  }

  // If selling to merchant, they buy at 50% (standard 5e rule)
  if (!isBuying) {
    const sellMod = locationType === 'black_market' ? 0.30 : 0.50;
    breakdown.push({ source: isBuying ? 'Buy price' : 'Sell price', modifier: sellMod });
    totalMultiplier *= sellMod;
  }

  const finalPrice = Math.max(1, Math.round(basePrice * totalMultiplier));

  return {
    basePrice,
    finalPrice,
    totalMultiplier: Math.round(totalMultiplier * 100) / 100,
    breakdown,
    savings: isBuying ? Math.max(0, basePrice - finalPrice) : 0,
    markup: isBuying ? Math.max(0, finalPrice - basePrice) : 0,
  };
}

/**
 * Calculate haggling result.
 *
 * @param {Object} params
 * @param {number} params.currentPrice - The price before haggling
 * @param {number} params.persuasionRoll - Total persuasion check result
 * @param {number} params.dc - Haggling DC (default 15)
 * @param {string[]} params.merchantTraits - NPC traits
 * @param {number} params.trustScore - Trust level
 * @returns {Object} { success, newPrice, discountPercent, npcReaction }
 */
export function resolveHaggling({
  currentPrice = 0,
  persuasionRoll = 0,
  dc = 15,
  merchantTraits = [],
  trustScore = 0,
}) {
  // Adjust DC based on traits
  let adjustedDC = dc;
  if (merchantTraits.includes('greedy')) adjustedDC += 3;
  if (merchantTraits.includes('generous')) adjustedDC -= 3;
  if (merchantTraits.includes('shrewd')) adjustedDC += 2;
  if (trustScore >= 50) adjustedDC -= 2;
  if (trustScore <= -20) adjustedDC += 3;

  const margin = persuasionRoll - adjustedDC;
  const isNat20 = false; // Caller should pass this separately if needed

  if (margin >= 10) {
    // Critical success — big discount
    const discount = Math.min(30, 15 + margin);
    return {
      success: true,
      newPrice: Math.max(1, Math.round(currentPrice * (1 - discount / 100))),
      discountPercent: discount,
      npcReaction: 'impressed',
      description: `Impressive negotiation! ${discount}% discount.`,
    };
  } else if (margin >= 0) {
    // Success — moderate discount
    const discount = Math.min(20, 5 + margin * 2);
    return {
      success: true,
      newPrice: Math.max(1, Math.round(currentPrice * (1 - discount / 100))),
      discountPercent: discount,
      npcReaction: 'agreeable',
      description: `Fair haggling. ${discount}% discount.`,
    };
  } else if (margin >= -5) {
    // Close fail — no discount but no penalty
    return {
      success: false,
      newPrice: currentPrice,
      discountPercent: 0,
      npcReaction: 'firm',
      description: 'The merchant holds firm on their price.',
    };
  } else {
    // Bad fail — merchant offended, prices increase
    const penalty = merchantTraits.includes('vengeful') ? 15 : 10;
    return {
      success: false,
      newPrice: Math.round(currentPrice * (1 + penalty / 100)),
      discountPercent: -penalty,
      npcReaction: 'offended',
      description: `Offended! Prices increase by ${penalty}% for this transaction.`,
    };
  }
}

/**
 * Generate restocked inventory for a shop.
 * Returns a list of suggested new items based on shop type.
 */
export function suggestRestock(shopType = 'general', locationType = 'town') {
  const RESTOCK_POOLS = {
    general: ['Rope (50 ft)', 'Torch (10)', 'Rations (5 days)', 'Waterskin', 'Backpack', 'Bedroll', 'Tinderbox', 'Crowbar', 'Hammer', 'Pitons (10)'],
    blacksmith: ['Longsword', 'Shortsword', 'Handaxe', 'Dagger', 'Shield', 'Chain Mail', 'Leather Armor', 'Scale Mail', 'Mace', 'Warhammer'],
    magic: ['Potion of Healing', 'Scroll of Identify', 'Scroll of Shield', 'Potion of Fire Resistance', 'Arcane Focus', 'Component Pouch', 'Spellbook'],
    potion: ['Potion of Healing', 'Potion of Greater Healing', 'Antitoxin', 'Potion of Fire Resistance', 'Potion of Water Breathing', 'Oil of Slipperiness'],
    tavern: ['Ale (mug)', 'Wine (pitcher)', 'Rations (1 day)', 'Room (modest)', 'Room (comfortable)', 'Meal (modest)'],
  };

  const pool = RESTOCK_POOLS[shopType] || RESTOCK_POOLS.general;
  const count = locationType === 'capital' ? 8 : locationType === 'village' ? 3 : 5;

  // Randomly select items
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get the location types and their descriptions.
 */
export function getLocationTypes() {
  return [
    { id: 'capital', label: 'Capital City', modifier: LOCATION_MODIFIERS.capital, description: 'Major trade hub — best prices' },
    { id: 'city', label: 'City', modifier: LOCATION_MODIFIERS.city, description: 'Large market — competitive' },
    { id: 'town', label: 'Town', modifier: LOCATION_MODIFIERS.town, description: 'Standard pricing' },
    { id: 'village', label: 'Village', modifier: LOCATION_MODIFIERS.village, description: 'Limited supply — slight markup' },
    { id: 'outpost', label: 'Outpost', modifier: LOCATION_MODIFIERS.outpost, description: 'Remote — noticeable markup' },
    { id: 'wilderness', label: 'Wilderness', modifier: LOCATION_MODIFIERS.wilderness, description: 'Frontier — premium prices' },
    { id: 'underdark', label: 'Underdark', modifier: LOCATION_MODIFIERS.underdark, description: 'Hard to reach — high markup' },
    { id: 'planar', label: 'Planar Market', modifier: LOCATION_MODIFIERS.planar, description: 'Exotic goods, exotic prices' },
    { id: 'black_market', label: 'Black Market', modifier: LOCATION_MODIFIERS.black_market, description: 'Cheap to buy, cheap to sell' },
  ];
}
