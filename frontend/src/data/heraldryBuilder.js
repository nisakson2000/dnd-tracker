/**
 * Heraldry & Sigil Builder — Faction/Noble House Identity Generator
 *
 * Covers roadmap item 188 (Heraldry/sigil builder for factions and noble houses).
 * Generates heraldic descriptions with fields, charges, tinctures, and mottos.
 */

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ── Tinctures (Colors) ──
const TINCTURES = {
  metals: [
    { name: 'Or', color: '#fbbf24', display: 'Gold', meaning: 'Generosity, elevation of the mind' },
    { name: 'Argent', color: '#f1f5f9', display: 'Silver/White', meaning: 'Peace, sincerity' },
  ],
  colors: [
    { name: 'Gules', color: '#dc2626', display: 'Red', meaning: 'Warrior, military strength, martyr' },
    { name: 'Azure', color: '#2563eb', display: 'Blue', meaning: 'Truth, loyalty, strength' },
    { name: 'Sable', color: '#1e293b', display: 'Black', meaning: 'Constancy, grief, knowledge' },
    { name: 'Vert', color: '#16a34a', display: 'Green', meaning: 'Hope, joy, loyalty in love' },
    { name: 'Purpure', color: '#7c3aed', display: 'Purple', meaning: 'Royal majesty, sovereignty, justice' },
  ],
};

// ── Field Patterns (Shield divisions) ──
const FIELD_PATTERNS = [
  { name: 'Plain', description: 'Solid color across the entire shield' },
  { name: 'Party per pale', description: 'Divided vertically into two halves' },
  { name: 'Party per fess', description: 'Divided horizontally into two halves' },
  { name: 'Party per bend', description: 'Divided diagonally from upper left to lower right' },
  { name: 'Quarterly', description: 'Divided into four equal quarters' },
  { name: 'Party per chevron', description: 'Divided by an inverted V shape' },
  { name: 'Party per saltire', description: 'Divided by an X shape into four triangles' },
  { name: 'Gyronny', description: 'Divided into eight triangular sections from center' },
  { name: 'Paly', description: 'Multiple vertical stripes' },
  { name: 'Barry', description: 'Multiple horizontal stripes' },
  { name: 'Bendy', description: 'Multiple diagonal stripes' },
  { name: 'Checky', description: 'Checkerboard pattern' },
];

// ── Charges (Symbols on the shield) ──
const CHARGES = {
  animals: [
    { name: 'Lion rampant', meaning: 'Bravery, valor, strength, royalty', emoji: '' },
    { name: 'Eagle displayed', meaning: 'Nobility, power, bravery', emoji: '' },
    { name: 'Dragon passant', meaning: 'Defender of treasure, valor', emoji: '' },
    { name: 'Stag at lodge', meaning: 'Peace, harmony, one who will fight if provoked', emoji: '' },
    { name: 'Wolf rampant', meaning: 'Reward of perseverance in long siege or hard enterprise', emoji: '' },
    { name: 'Bear rampant', meaning: 'Strength, cunning, ferocity in protection of kin', emoji: '' },
    { name: 'Gryphon segreant', meaning: 'Valor, vigilance, death-defying bravery', emoji: '' },
    { name: 'Serpent', meaning: 'Wisdom, renewal, cunning', emoji: '' },
    { name: 'Raven', meaning: 'Knowledge, divine providence, death\'s messenger', emoji: '' },
    { name: 'Phoenix', meaning: 'Resurrection, rebirth, immortality', emoji: '' },
    { name: 'Unicorn', meaning: 'Purity, extreme courage, virtue', emoji: '' },
    { name: 'Boar', meaning: 'Bravery, fights to the death, hospitality', emoji: '' },
  ],
  objects: [
    { name: 'Sword erect', meaning: 'Justice, military honor', emoji: '' },
    { name: 'Crown', meaning: 'Royal authority, triumph', emoji: '' },
    { name: 'Tower', meaning: 'Protection, defense, grandeur', emoji: '' },
    { name: 'Key', meaning: 'Knowledge, guardianship, dominion', emoji: '' },
    { name: 'Anchor', meaning: 'Hope, steadfastness, sea power', emoji: '' },
    { name: 'Hammer', meaning: 'Honor through industry, craftsmanship', emoji: '' },
    { name: 'Book', meaning: 'Learning, knowledge, scripture', emoji: '' },
    { name: 'Chalice', meaning: 'Faith, holy service, temperance', emoji: '' },
    { name: 'Shield within shield', meaning: 'Defense, protection of the innocent', emoji: '' },
    { name: 'Scales', meaning: 'Justice, fairness, balance', emoji: '' },
  ],
  nature: [
    { name: 'Oak tree', meaning: 'Strength, endurance, ancient lineage', emoji: '' },
    { name: 'Rose', meaning: 'Hope, joy, beauty, grace', emoji: '' },
    { name: 'Sun in splendor', meaning: 'Glory, brilliance, divine grace', emoji: '' },
    { name: 'Crescent moon', meaning: 'Hope for greater glory, second son', emoji: '' },
    { name: 'Star (mullet)', meaning: 'Noble, celestial goodness, third son', emoji: '' },
    { name: 'Mountain', meaning: 'Constancy, strength, immovable', emoji: '' },
    { name: 'Wave', meaning: 'Sea power, mastery of waters', emoji: '' },
    { name: 'Flame', meaning: 'Zeal, passionate pursuit, purification', emoji: '' },
  ],
  ordinaries: [
    { name: 'Chevron', meaning: 'Protection, faithful service', emoji: '' },
    { name: 'Cross', meaning: 'Faith, service in the Crusades', emoji: '' },
    { name: 'Bend', meaning: 'Defense, protection, reward for service', emoji: '' },
    { name: 'Fess', meaning: 'Military belt, readiness to serve', emoji: '' },
    { name: 'Pale', meaning: 'Military strength, fortitude', emoji: '' },
    { name: 'Saltire', meaning: 'Resolution, steadfastness', emoji: '' },
    { name: 'Chief', meaning: 'Authority, dominion, wisdom', emoji: '' },
    { name: 'Bordure', meaning: 'Difference, often a mark of cadency', emoji: '' },
  ],
};

// ── Mottos ──
const MOTTOS = [
  'Through fire, we are forged',
  'Honor above all',
  'The night remembers',
  'By steel and stone',
  'Unbowed, unbroken',
  'Wisdom guides the blade',
  'From darkness, light',
  'We do not falter',
  'Blood and duty',
  'The mountain endures',
  'Swift as the wind',
  'Truth before glory',
  'By ancient right',
  'The dawn is ours',
  'Vigilance eternal',
  'Neither chain nor crown',
  'We guard the gate',
  'Roots run deep',
  'Fortune favors the bold',
  'In shadow, strength',
  'Rise from the ashes',
  'The tide turns',
  'Loyal unto death',
  'Knowledge conquers fear',
  'We stand together',
  'No retreat, no surrender',
  'By star and steel',
  'The hunt never ends',
  'Where others flee, we fight',
  'Winter cannot last forever',
];

// ── House Words Templates ──
const HOUSE_TYPES = [
  { type: 'Military', focus: 'Warfare, conquest, defense', suggestedCharges: ['Lion rampant', 'Sword erect', 'Eagle displayed'], suggestedColors: ['Gules', 'Sable'] },
  { type: 'Mercantile', focus: 'Trade, wealth, commerce', suggestedCharges: ['Key', 'Scales', 'Anchor'], suggestedColors: ['Or', 'Azure'] },
  { type: 'Scholarly', focus: 'Knowledge, magic, lore', suggestedCharges: ['Book', 'Star (mullet)', 'Raven'], suggestedColors: ['Azure', 'Argent'] },
  { type: 'Religious', focus: 'Faith, divine service, purity', suggestedCharges: ['Chalice', 'Cross', 'Sun in splendor'], suggestedColors: ['Argent', 'Or'] },
  { type: 'Nature', focus: 'Wilderness, druidism, natural order', suggestedCharges: ['Oak tree', 'Stag at lodge', 'Wolf rampant'], suggestedColors: ['Vert', 'Argent'] },
  { type: 'Shadow', focus: 'Espionage, secrecy, assassination', suggestedCharges: ['Serpent', 'Crescent moon', 'Raven'], suggestedColors: ['Sable', 'Purpure'] },
  { type: 'Naval', focus: 'Sea power, exploration, piracy', suggestedCharges: ['Anchor', 'Wave', 'Dragon passant'], suggestedColors: ['Azure', 'Argent'] },
  { type: 'Ancient', focus: 'Old bloodline, tradition, legacy', suggestedCharges: ['Crown', 'Tower', 'Gryphon segreant'], suggestedColors: ['Or', 'Purpure'] },
];

/**
 * Generate a random heraldic description.
 */
export function generateHeraldry(options = {}) {
  const { houseType } = options;

  const allTinctures = [...TINCTURES.metals, ...TINCTURES.colors];
  const pattern = pick(FIELD_PATTERNS);
  const primaryTincture = pick(allTinctures);
  let secondaryTincture = pick(allTinctures);
  while (secondaryTincture.name === primaryTincture.name) {
    secondaryTincture = pick(allTinctures);
  }

  const chargeCategory = pick(Object.keys(CHARGES));
  const charge = pick(CHARGES[chargeCategory]);
  const chargeTincture = pick(allTinctures.filter(t => t.name !== primaryTincture.name));

  const motto = pick(MOTTOS);

  const matchingType = houseType
    ? HOUSE_TYPES.find(h => h.type.toLowerCase() === houseType.toLowerCase())
    : pick(HOUSE_TYPES);

  const blazon = pattern.name === 'Plain'
    ? `${primaryTincture.name}, a ${charge.name} ${chargeTincture.name}`
    : `${pattern.name} ${primaryTincture.name} and ${secondaryTincture.name}, a ${charge.name} ${chargeTincture.name}`;

  return {
    blazon,
    pattern: pattern,
    primaryColor: primaryTincture,
    secondaryColor: secondaryTincture,
    charge: charge,
    chargeColor: chargeTincture,
    motto,
    houseType: matchingType,
    description: `A shield ${pattern.description.toLowerCase()}, colored ${primaryTincture.display.toLowerCase()}${pattern.name !== 'Plain' ? ` and ${secondaryTincture.display.toLowerCase()}` : ''}, bearing a ${charge.name.toLowerCase()} in ${chargeTincture.display.toLowerCase()}. The house motto reads: "${motto}"`,
  };
}

/**
 * Get all charge categories.
 */
export function getChargeCategories() {
  return Object.entries(CHARGES).map(([key, charges]) => ({
    id: key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    count: charges.length,
  }));
}

/**
 * Get charges by category.
 */
export function getChargesByCategory(category) {
  return CHARGES[category] || [];
}

/**
 * Get all tinctures.
 */
export function getTinctures() {
  return TINCTURES;
}

/**
 * Get house types for UI.
 */
export function getHouseTypes() {
  return HOUSE_TYPES;
}

/**
 * Get all mottos.
 */
export function getAllMottos() {
  return MOTTOS;
}

export { TINCTURES, FIELD_PATTERNS, CHARGES, MOTTOS, HOUSE_TYPES };
