/**
 * Encounter Builder — D&D 5e CR/XP Budget System
 *
 * Covers roadmap items 1, 129-137 (Encounter Difficulty Calculator, Encounter Building).
 * CR/XP budget, DMG difficulty thresholds, monster count multipliers.
 */

const d = (n) => Math.floor(Math.random() * n) + 1;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ── XP Thresholds by Character Level ──
export const XP_THRESHOLDS_BY_LEVEL = {
  1:  { easy: 25,   medium: 50,   hard: 75,    deadly: 100 },
  2:  { easy: 50,   medium: 100,  hard: 150,   deadly: 200 },
  3:  { easy: 75,   medium: 150,  hard: 225,   deadly: 400 },
  4:  { easy: 125,  medium: 250,  hard: 375,   deadly: 500 },
  5:  { easy: 250,  medium: 500,  hard: 750,   deadly: 1100 },
  6:  { easy: 300,  medium: 600,  hard: 900,   deadly: 1400 },
  7:  { easy: 350,  medium: 750,  hard: 1100,  deadly: 1700 },
  8:  { easy: 450,  medium: 900,  hard: 1400,  deadly: 2100 },
  9:  { easy: 550,  medium: 1100, hard: 1600,  deadly: 2400 },
  10: { easy: 600,  medium: 1200, hard: 1900,  deadly: 2800 },
  11: { easy: 800,  medium: 1600, hard: 2400,  deadly: 3600 },
  12: { easy: 1000, medium: 2000, hard: 3000,  deadly: 4500 },
  13: { easy: 1100, medium: 2200, hard: 3400,  deadly: 5100 },
  14: { easy: 1250, medium: 2500, hard: 3800,  deadly: 5700 },
  15: { easy: 1400, medium: 2800, hard: 4300,  deadly: 6400 },
  16: { easy: 1600, medium: 3200, hard: 4800,  deadly: 7200 },
  17: { easy: 2000, medium: 3900, hard: 5900,  deadly: 8800 },
  18: { easy: 2100, medium: 4200, hard: 6300,  deadly: 9500 },
  19: { easy: 2400, medium: 4900, hard: 7300,  deadly: 10900 },
  20: { easy: 2800, medium: 5700, hard: 8500,  deadly: 12700 },
};

// ── CR to XP ──
export const CR_TO_XP = {
  '0': 10, '1/8': 25, '1/4': 50, '1/2': 100,
  '1': 200, '2': 450, '3': 700, '4': 1100, '5': 1800,
  '6': 2300, '7': 2900, '8': 3900, '9': 5000, '10': 5900,
  '11': 7200, '12': 8400, '13': 10000, '14': 11500, '15': 13000,
  '16': 15000, '17': 18000, '18': 20000, '19': 22000, '20': 25000,
  '21': 33000, '22': 41000, '23': 50000, '24': 62000, '25': 75000,
  '26': 90000, '27': 105000, '28': 120000, '29': 135000, '30': 155000,
};

// ── Monster Count Multipliers (DMG p.82) ──
export const MONSTER_MULTIPLIERS = [
  { min: 1, max: 1, multiplier: 1 },
  { min: 2, max: 2, multiplier: 1.5 },
  { min: 3, max: 6, multiplier: 2 },
  { min: 7, max: 10, multiplier: 2.5 },
  { min: 11, max: 14, multiplier: 3 },
  { min: 15, max: Infinity, multiplier: 4 },
];

// ── Quick Monster Templates by CR ──
export const QUICK_MONSTERS = {
  '1/8': [
    { name: 'Bandit', type: 'Humanoid', ac: 12, hp: 11, attacks: 'Scimitar +3 (1d6+1)' },
    { name: 'Kobold', type: 'Humanoid', ac: 12, hp: 5, attacks: 'Dagger +4 (1d4+2), Sling +4 (1d4+2)' },
    { name: 'Stirge', type: 'Beast', ac: 14, hp: 2, attacks: 'Blood Drain +5 (1d4+3)' },
  ],
  '1/4': [
    { name: 'Goblin', type: 'Humanoid', ac: 15, hp: 7, attacks: 'Scimitar +4 (1d6+2), Shortbow +4 (1d6+2)' },
    { name: 'Skeleton', type: 'Undead', ac: 13, hp: 13, attacks: 'Shortsword +4 (1d6+2), Shortbow +4 (1d6+2)' },
    { name: 'Zombie', type: 'Undead', ac: 8, hp: 22, attacks: 'Slam +3 (1d6+1). Undead Fortitude.' },
    { name: 'Wolf', type: 'Beast', ac: 13, hp: 11, attacks: 'Bite +4 (2d4+2). Pack Tactics, Knockdown.' },
  ],
  '1/2': [
    { name: 'Orc', type: 'Humanoid', ac: 13, hp: 15, attacks: 'Greataxe +5 (1d12+3), Javelin +5 (1d6+3)' },
    { name: 'Hobgoblin', type: 'Humanoid', ac: 18, hp: 11, attacks: 'Longsword +3 (1d10+1), Longbow +3 (1d8+1). Martial Advantage.' },
    { name: 'Scout', type: 'Humanoid', ac: 13, hp: 16, attacks: 'Shortsword +4 (1d6+2), Longbow +4 (1d8+2). Multiattack.' },
  ],
  '1': [
    { name: 'Bugbear', type: 'Humanoid', ac: 16, hp: 27, attacks: 'Morningstar +4 (2d8+2). Surprise Attack +2d6.' },
    { name: 'Ghoul', type: 'Undead', ac: 12, hp: 22, attacks: 'Bite +2 (2d6+2), Claws +4 (2d4+2). Paralyzing Touch.' },
    { name: 'Dire Wolf', type: 'Beast', ac: 14, hp: 37, attacks: 'Bite +5 (2d6+3). Pack Tactics, Knockdown.' },
  ],
  '2': [
    { name: 'Ogre', type: 'Giant', ac: 11, hp: 59, attacks: 'Greatclub +6 (2d8+4), Javelin +6 (2d6+4)' },
    { name: 'Bandit Captain', type: 'Humanoid', ac: 15, hp: 65, attacks: 'Multiattack (3). Scimitar +5 (1d6+3), Dagger +5 (1d4+3)' },
    { name: 'Ghast', type: 'Undead', ac: 13, hp: 36, attacks: 'Bite +3 (2d8+3), Claws +5 (2d6+3). Stench, Paralyze.' },
  ],
  '3': [
    { name: 'Owlbear', type: 'Monstrosity', ac: 13, hp: 59, attacks: 'Multiattack. Beak +7 (1d10+5), Claws +7 (2d8+5)' },
    { name: 'Knight', type: 'Humanoid', ac: 18, hp: 52, attacks: 'Multiattack (2). Greatsword +5 (2d6+3)' },
    { name: 'Minotaur', type: 'Monstrosity', ac: 14, hp: 76, attacks: 'Greataxe +6 (2d12+4). Charge (3d8+4). Reckless.' },
  ],
  '5': [
    { name: 'Troll', type: 'Giant', ac: 15, hp: 84, attacks: 'Multiattack (3). Bite +7 (1d6+4), Claws +7 (2d6+4). Regeneration 10.' },
    { name: 'Elementals', type: 'Elemental', ac: '13-17', hp: '90-114', attacks: 'Multiattack (2). Varies by element.' },
    { name: 'Hill Giant', type: 'Giant', ac: 13, hp: 105, attacks: 'Multiattack (2). Greatclub +8 (3d8+5), Rock +8 (3d10+5)' },
  ],
};

/**
 * Calculate encounter difficulty for a party.
 */
export function calculateEncounterDifficulty(partyLevels, monsterCRs) {
  // Calculate party thresholds
  const partyThresholds = { easy: 0, medium: 0, hard: 0, deadly: 0 };
  for (const level of partyLevels) {
    const t = XP_THRESHOLDS_BY_LEVEL[level];
    if (t) {
      partyThresholds.easy += t.easy;
      partyThresholds.medium += t.medium;
      partyThresholds.hard += t.hard;
      partyThresholds.deadly += t.deadly;
    }
  }

  // Calculate total monster XP
  let totalXP = 0;
  for (const cr of monsterCRs) {
    totalXP += CR_TO_XP[String(cr)] || 0;
  }

  // Apply multiplier
  const count = monsterCRs.length;
  const multiplierEntry = MONSTER_MULTIPLIERS.find(m => count >= m.min && count <= m.max);
  const multiplier = multiplierEntry ? multiplierEntry.multiplier : 1;
  const adjustedXP = Math.floor(totalXP * multiplier);

  // Determine difficulty
  let difficulty = 'Trivial';
  if (adjustedXP >= partyThresholds.deadly) difficulty = 'Deadly';
  else if (adjustedXP >= partyThresholds.hard) difficulty = 'Hard';
  else if (adjustedXP >= partyThresholds.medium) difficulty = 'Medium';
  else if (adjustedXP >= partyThresholds.easy) difficulty = 'Easy';

  const difficultyColors = { Trivial: '#6b7280', Easy: '#22c55e', Medium: '#eab308', Hard: '#f97316', Deadly: '#ef4444' };

  return {
    difficulty,
    color: difficultyColors[difficulty],
    totalXP,
    adjustedXP,
    multiplier,
    monsterCount: count,
    partySize: partyLevels.length,
    partyThresholds,
    xpReward: totalXP, // actual XP earned (not adjusted)
    xpPerPlayer: Math.floor(totalXP / partyLevels.length),
  };
}

/**
 * Generate a balanced encounter for a party.
 */
export function generateBalancedEncounter(partyLevels, targetDifficulty = 'medium') {
  const partyThresholds = { easy: 0, medium: 0, hard: 0, deadly: 0 };
  for (const level of partyLevels) {
    const t = XP_THRESHOLDS_BY_LEVEL[level];
    if (t) {
      partyThresholds.easy += t.easy;
      partyThresholds.medium += t.medium;
      partyThresholds.hard += t.hard;
      partyThresholds.deadly += t.deadly;
    }
  }

  const targetXP = partyThresholds[targetDifficulty] || partyThresholds.medium;
  const avgLevel = Math.round(partyLevels.reduce((a, b) => a + b, 0) / partyLevels.length);

  // Find suitable CR
  const crOptions = Object.entries(CR_TO_XP);
  const suggestions = [];

  // Single monster option
  const singleCR = crOptions.find(([, xp]) => xp >= targetXP * 0.8 && xp <= targetXP * 1.2);
  if (singleCR) {
    suggestions.push({ count: 1, cr: singleCR[0], totalXP: singleCR[1], label: `1 × CR ${singleCR[0]}` });
  }

  // Group option (3-5 monsters)
  const groupXP = targetXP / 2; // account for multiplier
  const groupCR = crOptions.find(([, xp]) => xp >= groupXP * 0.6 / 4 && xp <= groupXP * 1.4 / 3);
  if (groupCR) {
    const count = Math.max(2, Math.min(6, Math.round(groupXP / groupCR[1])));
    suggestions.push({ count, cr: groupCR[0], totalXP: groupCR[1] * count, label: `${count} × CR ${groupCR[0]}` });
  }

  // Boss + minions option
  const bossXP = targetXP * 0.6;
  const minionXP = targetXP * 0.15;
  const bossCR = crOptions.find(([, xp]) => xp >= bossXP * 0.7 && xp <= bossXP * 1.3);
  const minionCR = crOptions.find(([, xp]) => xp >= minionXP * 0.5 && xp <= minionXP * 1.5);
  if (bossCR && minionCR) {
    suggestions.push({
      count: '1 boss + 3 minions',
      cr: `${bossCR[0]} + ${minionCR[0]}`,
      totalXP: bossCR[1] + minionCR[1] * 3,
      label: `1 × CR ${bossCR[0]} boss + 3 × CR ${minionCR[0]} minions`,
    });
  }

  return {
    targetDifficulty,
    targetXP,
    avgPartyLevel: avgLevel,
    partySize: partyLevels.length,
    suggestions,
  };
}

/**
 * Get quick monster templates for a CR.
 */
export function getQuickMonsters(cr) {
  return QUICK_MONSTERS[String(cr)] || [];
}

/**
 * Get all available CRs.
 */
export function getAvailableCRs() {
  return Object.keys(CR_TO_XP);
}

/**
 * Convert CR string to number for comparison.
 */
export function crToNumber(cr) {
  if (cr === '1/8') return 0.125;
  if (cr === '1/4') return 0.25;
  if (cr === '1/2') return 0.5;
  return parseFloat(cr);
}
