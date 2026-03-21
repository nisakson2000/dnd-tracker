/**
 * questRewards.js
 *
 * Roadmap items covered:
 *   - #174: Quest reward calculator
 *
 * Data sources: D&D 5e Dungeon Master's Guide (DMG)
 *   - XP thresholds by character level (DMG p. 82)
 *   - Treasure Hoard tables by tier (DMG p. 133–136)
 *   - Individual Treasure tables by CR (DMG p. 136–139)
 *   - Magic Item tables A–G (DMG p. 144–149)
 *
 * No React. All exports are plain JS constants and functions.
 */

// ---------------------------------------------------------------------------
// 1. XP_BY_DIFFICULTY
// XP thresholds per character level for Easy/Medium/Hard/Deadly encounters.
// Key: character level (1–20), Value: { easy, medium, hard, deadly }
// Source: DMG p. 82
// ---------------------------------------------------------------------------

export const XP_BY_DIFFICULTY = {
  1:  { easy: 25,   medium: 50,   hard: 75,   deadly: 100   },
  2:  { easy: 50,   medium: 100,  hard: 150,  deadly: 200   },
  3:  { easy: 75,   medium: 150,  hard: 225,  deadly: 400   },
  4:  { easy: 125,  medium: 250,  hard: 375,  deadly: 500   },
  5:  { easy: 250,  medium: 500,  hard: 750,  deadly: 1100  },
  6:  { easy: 300,  medium: 600,  hard: 900,  deadly: 1400  },
  7:  { easy: 350,  medium: 750,  hard: 1100, deadly: 1700  },
  8:  { easy: 450,  medium: 900,  hard: 1400, deadly: 2100  },
  9:  { easy: 550,  medium: 1100, hard: 1600, deadly: 2400  },
  10: { easy: 600,  medium: 1200, hard: 1900, deadly: 2800  },
  11: { easy: 800,  medium: 1600, hard: 2400, deadly: 3600  },
  12: { easy: 1000, medium: 2000, hard: 3000, deadly: 4500  },
  13: { easy: 1100, medium: 2200, hard: 3400, deadly: 5100  },
  14: { easy: 1250, medium: 2500, hard: 3800, deadly: 5700  },
  15: { easy: 1400, medium: 2800, hard: 4300, deadly: 6400  },
  16: { easy: 1600, medium: 3200, hard: 4800, deadly: 7200  },
  17: { easy: 2000, medium: 3900, hard: 5900, deadly: 8800  },
  18: { easy: 2100, medium: 4200, hard: 6300, deadly: 9500  },
  19: { easy: 2400, medium: 4900, hard: 7300, deadly: 10900 },
  20: { easy: 2800, medium: 5700, hard: 8500, deadly: 12700 },
};

// ---------------------------------------------------------------------------
// 2. TREASURE_HOARD_BY_TIER
// Dice expressions for treasure hoards per tier.
// Each entry: { cp, sp, ep, gp, pp } — dice notation strings (may be null)
// Source: DMG p. 133–136
// ---------------------------------------------------------------------------

export const TREASURE_HOARD_BY_TIER = {
  1: {
    levels: '1–4',
    cp: '6d6x100',
    sp: '3d6x100',
    ep: null,
    gp: '2d6x10',
    pp: null,
  },
  2: {
    levels: '5–10',
    cp: null,
    sp: '2d6x100',
    ep: null,
    gp: '6d6x100',
    pp: '3d6x10',
  },
  3: {
    levels: '11–16',
    cp: null,
    sp: null,
    ep: null,
    gp: '4d6x1000',
    pp: '5d6x100',
  },
  4: {
    levels: '17–20',
    cp: null,
    sp: null,
    ep: null,
    gp: '12d6x1000',
    pp: '8d6x1000',
  },
};

// ---------------------------------------------------------------------------
// 3. INDIVIDUAL_TREASURE
// Individual monster treasure tables by CR range.
// Each entry: array of coin types with dice notation and multiplier.
// Source: DMG p. 136–139
// ---------------------------------------------------------------------------

export const INDIVIDUAL_TREASURE = {
  'cr0-4': {
    label: 'CR 0–4',
    coins: [
      { type: 'cp', dice: '5d6',  multiplier: 1   },
      { type: 'sp', dice: '4d6',  multiplier: 1   },
      { type: 'gp', dice: '3d6',  multiplier: 1   },
    ],
  },
  'cr5-10': {
    label: 'CR 5–10',
    coins: [
      { type: 'cp', dice: '4d6',  multiplier: 100  },
      { type: 'sp', dice: '6d6',  multiplier: 10   },
      { type: 'gp', dice: '3d6',  multiplier: 10   },
      { type: 'pp', dice: '3d6',  multiplier: 1    },
    ],
  },
  'cr11-16': {
    label: 'CR 11–16',
    coins: [
      { type: 'sp', dice: '4d6',  multiplier: 100  },
      { type: 'gp', dice: '6d6',  multiplier: 100  },
      { type: 'pp', dice: '3d6',  multiplier: 10   },
    ],
  },
  'cr17plus': {
    label: 'CR 17+',
    coins: [
      { type: 'gp', dice: '12d6', multiplier: 1000 },
      { type: 'pp', dice: '8d6',  multiplier: 1000 },
    ],
  },
};

// ---------------------------------------------------------------------------
// 4. MAGIC_ITEM_TABLES
// Simplified magic item table references per tier.
// Source: DMG p. 144–149
// ---------------------------------------------------------------------------

export const MAGIC_ITEM_TABLES = {
  A: {
    label: 'Table A — Minor Common',
    rarity: 'common',
    type: 'minor',
    tier: 1,
    description: 'Common consumables and trinkets (potions of healing, spell scrolls cantrip/1st).',
    applicableTiers: [1],
  },
  B: {
    label: 'Table B — Minor Uncommon',
    rarity: 'uncommon',
    type: 'minor',
    tier: 1,
    description: 'Uncommon consumables (potions of greater healing, spell scrolls 2nd–3rd).',
    applicableTiers: [1, 2],
  },
  C: {
    label: 'Table C — Minor Rare',
    rarity: 'rare',
    type: 'minor',
    tier: 2,
    description: 'Rare consumables (potions of superior healing, spell scrolls 4th–5th).',
    applicableTiers: [2, 3],
  },
  D: {
    label: 'Table D — Major Uncommon',
    rarity: 'uncommon',
    type: 'major',
    tier: 2,
    description: 'Uncommon permanent magic items (weapons +1, bracers of archery, etc.).',
    applicableTiers: [1, 2],
  },
  E: {
    label: 'Table E — Major Rare',
    rarity: 'rare',
    type: 'major',
    tier: 3,
    description: 'Rare permanent magic items (weapons +2, cloaks of protection, etc.).',
    applicableTiers: [2, 3],
  },
  F: {
    label: 'Table F — Major Very Rare',
    rarity: 'very rare',
    type: 'major',
    tier: 3,
    description: 'Very rare permanent magic items (weapons +3, staff of fire, etc.).',
    applicableTiers: [3, 4],
  },
  G: {
    label: 'Table G — Major Legendary',
    rarity: 'legendary',
    type: 'major',
    tier: 4,
    description: 'Legendary magic items (vorpal sword, staff of the magi, etc.).',
    applicableTiers: [4],
  },
};

// Convenience: which magic item tables are appropriate per treasure tier
export const MAGIC_ITEM_TABLES_BY_TIER = {
  1: ['A', 'B', 'D'],
  2: ['B', 'C', 'D', 'E'],
  3: ['C', 'E', 'F'],
  4: ['F', 'G'],
};

// ---------------------------------------------------------------------------
// 5. NON_MONETARY_REWARDS
// Creative non-coin/non-item rewards with tier suggestions.
// ---------------------------------------------------------------------------

export const NON_MONETARY_REWARDS = [
  {
    id: 'land',
    label: 'Land Grant',
    tier: [2, 3, 4],
    description:
      'A parcel of land bestowed by a noble or crown — a farm, a manor grounds, or a small estate. Provides passive income, a home base, and social standing.',
  },
  {
    id: 'title',
    label: 'Noble Title or Honorific',
    tier: [2, 3, 4],
    description:
      'A formal title (Knight, Baron, Champion of the Realm) granted by royalty or a powerful organization. Opens doors to high society and political circles.',
  },
  {
    id: 'favor',
    label: 'Owed Favor',
    tier: [1, 2, 3, 4],
    description:
      'A powerful NPC owes the party a future favor — smuggling passage, a jailbreak, a military escort, or access to forbidden knowledge. Worth more than gold at the right moment.',
  },
  {
    id: 'information',
    label: 'Rare Information',
    tier: [1, 2, 3, 4],
    description:
      'A map to a hidden dungeon, the true name of a demon lord, the location of a lost artifact, or intelligence on a rival faction. Information as currency.',
  },
  {
    id: 'reputation',
    label: 'Reputation & Renown',
    tier: [1, 2, 3, 4],
    description:
      'Fame within a faction, guild, or city. Grants renown points, better prices with merchants, free lodging, or recruitment of followers. Scales with the deed.',
  },
  {
    id: 'magic_item',
    label: 'Specific Magic Item',
    tier: [1, 2, 3, 4],
    description:
      'A bespoke magic item tailored to a character (a ring carved with their family crest, a weapon from a famous lineage). Narratively resonant beyond its mechanical value.',
  },
  {
    id: 'boon',
    label: 'Supernatural Boon',
    tier: [2, 3, 4],
    description:
      'A deity, archfey, or cosmic entity grants a boon: a charm, an epic boon, or a permanent blessing. Examples: Boon of Fortitude, Charm of the Slayer.',
  },
  {
    id: 'property',
    label: 'Property or Business',
    tier: [2, 3, 4],
    description:
      'Ownership of a tavern, a shop, a tower, or a thieves\' den. Provides a safe house, passive income (downtime activity), and narrative hooks.',
  },
  {
    id: 'followers',
    label: 'Followers or Retainers',
    tier: [2, 3, 4],
    description:
      'Loyal NPCs join the party\'s cause: a squire, a ship crew, a band of mercenaries, or a spy network contact. Use the Sidekick rules (Tasha\'s) or as narrative assets.',
  },
  {
    id: 'political_influence',
    label: 'Political Influence',
    tier: [2, 3, 4],
    description:
      'The party gains leverage over a noble house, guild, or government body — blackmail material, a signed treaty, or a seat on an advisory council. Shapes the political landscape.',
  },
];

// ---------------------------------------------------------------------------
// Helper Utilities (internal)
// ---------------------------------------------------------------------------

/**
 * Roll a dice expression and return the numeric result.
 * Supports notation like "3d6", "2d6x100", "5d6x1000".
 * Uses Math.random() — deterministic seeding not provided here.
 * @param {string} notation - e.g. "3d6x100"
 * @returns {number}
 */
function rollDice(notation) {
  if (!notation) return 0;
  // Parse "XdYxZ" or "XdY"
  const match = notation.match(/^(\d+)d(\d+)(?:x(\d+))?$/i);
  if (!match) return 0;
  const count = parseInt(match[1], 10);
  const sides = parseInt(match[2], 10);
  const multiplier = match[3] ? parseInt(match[3], 10) : 1;
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += Math.floor(Math.random() * sides) + 1;
  }
  return total * multiplier;
}

/**
 * Clamp a number between min and max.
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/**
 * Return the treasure tier (1–4) for a given party/character level.
 * @param {number} level
 * @returns {number}
 */
function tierForLevel(level) {
  if (level <= 4)  return 1;
  if (level <= 10) return 2;
  if (level <= 16) return 3;
  return 4;
}

// ---------------------------------------------------------------------------
// Exported Helper Functions
// ---------------------------------------------------------------------------

/**
 * Calculate recommended XP for a quest based on party level, party size,
 * and encounter difficulty. Returns total XP for the party and per-character XP.
 *
 * @param {number} partyLevel  - Average or representative party level (1–20)
 * @param {number} partySize   - Number of players (default 4)
 * @param {'easy'|'medium'|'hard'|'deadly'} difficulty - Encounter difficulty
 * @returns {{ totalXP: number, perCharacterXP: number, difficulty: string, partyLevel: number }}
 */
export function calculateQuestXP(partyLevel, partySize = 4, difficulty = 'medium') {
  const level = clamp(Math.round(partyLevel), 1, 20);
  const size  = clamp(Math.round(partySize), 1, 20);
  const diff  = ['easy', 'medium', 'hard', 'deadly'].includes(difficulty)
    ? difficulty
    : 'medium';

  const thresholds = XP_BY_DIFFICULTY[level];
  const perCharacterXP = thresholds[diff];
  const totalXP = perCharacterXP * size;

  return {
    partyLevel: level,
    partySize: size,
    difficulty: diff,
    perCharacterXP,
    totalXP,
    thresholds,
  };
}

/**
 * Generate a random treasure hoard for the given tier (1–4).
 * Returns rolled coin amounts and suggested magic item tables.
 *
 * @param {number} tier - 1, 2, 3, or 4
 * @returns {{ tier: number, levels: string, coins: object, magicItemTables: string[] }}
 */
export function generateTreasureHoard(tier) {
  const t = clamp(Math.round(tier), 1, 4);
  const hoard = TREASURE_HOARD_BY_TIER[t];

  const coins = {};
  for (const [currency, notation] of Object.entries(hoard)) {
    if (currency === 'levels' || notation === null) continue;
    coins[currency] = rollDice(notation);
  }

  return {
    tier: t,
    levels: hoard.levels,
    coins,
    magicItemTables: MAGIC_ITEM_TABLES_BY_TIER[t],
  };
}

/**
 * Generate individual treasure for a monster of the given CR.
 * Returns rolled coin amounts per currency type.
 *
 * @param {number} cr - Challenge Rating (0–30+)
 * @returns {{ crRange: string, label: string, coins: object }}
 */
export function generateIndividualTreasure(cr) {
  let key;
  if (cr <= 4)       key = 'cr0-4';
  else if (cr <= 10) key = 'cr5-10';
  else if (cr <= 16) key = 'cr11-16';
  else               key = 'cr17plus';

  const table = INDIVIDUAL_TREASURE[key];
  const coins = {};

  for (const entry of table.coins) {
    coins[entry.type] = (coins[entry.type] || 0) + rollDice(`${entry.dice}x${entry.multiplier}`);
  }

  return {
    crRange: key,
    label: table.label,
    coins,
  };
}

/**
 * Suggest a reward package for a quest at a given party level and difficulty.
 * Returns XP, a treasure hoard, magic item table suggestions, and non-monetary reward ideas.
 *
 * @param {number} partyLevel       - 1–20
 * @param {'easy'|'medium'|'hard'|'deadly'} questDifficulty
 * @param {number} [partySize=4]
 * @returns {object} Complete reward suggestion bundle
 */
export function suggestRewards(partyLevel, questDifficulty = 'medium', partySize = 4) {
  const level = clamp(Math.round(partyLevel), 1, 20);
  const tier  = tierForLevel(level);

  const xp    = calculateQuestXP(level, partySize, questDifficulty);
  const hoard = generateTreasureHoard(tier);

  // Boost hoard slightly for harder quests
  if (questDifficulty === 'hard')   hoard.coins = Object.fromEntries(Object.entries(hoard.coins).map(([k, v]) => [k, Math.round(v * 1.25)]));
  if (questDifficulty === 'deadly') hoard.coins = Object.fromEntries(Object.entries(hoard.coins).map(([k, v]) => [k, Math.round(v * 1.5)]));

  const nonMonetary = getNonMonetaryReward(tier);

  return {
    partyLevel: level,
    tier,
    questDifficulty,
    xp,
    treasureHoard: hoard,
    magicItemTables: MAGIC_ITEM_TABLES_BY_TIER[tier],
    nonMonetaryRewards: nonMonetary,
  };
}

/**
 * Split a total gold amount evenly among party members.
 * Returns per-character share and any remainder in smaller denominations.
 *
 * @param {number} totalGold  - Total GP to split
 * @param {number} partySize  - Number of party members
 * @returns {{ perCharacterGold: number, remainder: number, totalGold: number, partySize: number }}
 */
export function splitRewards(totalGold, partySize = 4) {
  const gold = Math.max(0, Math.round(totalGold));
  const size = clamp(Math.round(partySize), 1, 20);
  const perCharacterGold = Math.floor(gold / size);
  const remainder = gold % size;

  return {
    totalGold: gold,
    partySize: size,
    perCharacterGold,
    remainder,
    // Remainder expressed in silver for easy conversion
    remainderInSilver: remainder * 10,
  };
}

/**
 * Return a random non-monetary reward appropriate for the given tier.
 * Optionally filter by tier relevance.
 *
 * @param {number} tier - 1–4
 * @returns {object[]} Array of 2 random non-monetary reward objects
 */
export function getNonMonetaryReward(tier) {
  const t = clamp(Math.round(tier), 1, 4);
  const eligible = NON_MONETARY_REWARDS.filter((r) => r.tier.includes(t));

  // Shuffle and return 2 suggestions
  const shuffled = [...eligible].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
}
