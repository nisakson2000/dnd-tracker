// ─── XP Thresholds per character level (DMG p. 82) ─────────────────────────
export const XP_THRESHOLDS = {
  1:  [25, 50, 75, 100],
  2:  [50, 100, 150, 200],
  3:  [75, 150, 225, 400],
  4:  [125, 250, 375, 500],
  5:  [250, 500, 750, 1100],
  6:  [300, 600, 900, 1400],
  7:  [350, 750, 1100, 1700],
  8:  [450, 900, 1400, 2100],
  9:  [550, 1100, 1600, 2400],
  10: [600, 1200, 1900, 2800],
  11: [800, 1600, 2400, 3600],
  12: [1000, 2000, 3000, 4500],
  13: [1100, 2200, 3400, 5100],
  14: [1250, 2500, 3800, 5700],
  15: [1400, 2800, 4300, 6400],
  16: [1600, 3200, 4800, 7200],
  17: [2000, 3900, 5900, 8800],
  18: [2100, 4200, 6300, 9500],
  19: [2400, 4900, 7300, 10900],
  20: [2800, 5700, 8500, 12700],
};

// ─── Monster XP by CR ───────────────────────────────────────────────────────
export const CR_XP = {
  '0': 10, '1/8': 25, '1/4': 50, '1/2': 100,
  '1': 200, '2': 450, '3': 700, '4': 1100, '5': 1800,
  '6': 2300, '7': 2900, '8': 3900, '9': 5000, '10': 5900,
  '11': 7200, '12': 8400, '13': 10000, '14': 11500, '15': 13000,
  '16': 15000, '17': 18000, '18': 20000, '19': 22000, '20': 25000,
  '21': 33000, '22': 41000, '23': 50000, '24': 62000, '25': 75000,
  '26': 90000, '27': 105000, '28': 120000, '29': 135000, '30': 155000,
};

// ─── Encounter multiplier by monster count (DMG) ────────────────────────────
export function getEncounterMultiplier(monsterCount, partySize) {
  // Base multiplier from DMG
  let mult;
  if (monsterCount <= 0) mult = 1;
  else if (monsterCount === 1) mult = 1;
  else if (monsterCount === 2) mult = 1.5;
  else if (monsterCount <= 6) mult = 2;
  else if (monsterCount <= 10) mult = 2.5;
  else if (monsterCount <= 14) mult = 3;
  else mult = 4;

  // DMG party-size adjustment: small parties bump up, large parties bump down
  if (partySize !== undefined) {
    if (partySize < 3) {
      // Use next higher multiplier tier
      const tiers = [1, 1.5, 2, 2.5, 3, 4, 5];
      const idx = tiers.indexOf(mult);
      if (idx >= 0 && idx < tiers.length - 1) mult = tiers[idx + 1];
    } else if (partySize >= 6) {
      // Use next lower multiplier tier
      const tiers = [0.5, 1, 1.5, 2, 2.5, 3, 4];
      const idx = tiers.indexOf(mult);
      if (idx > 0) mult = tiers[idx - 1];
    }
  }

  return mult;
}

// ─── Calculate encounter difficulty ─────────────────────────────────────────
// partyLevels: number[]  — each player's level
// monsterCRs:  (string|number)[] — each alive monster's CR value
export function calcDifficulty(partyLevels, monsterCRs) {
  if (!partyLevels || partyLevels.length === 0) return null;
  if (!monsterCRs || monsterCRs.length === 0) {
    return { rating: 'Trivial', color: 'rgba(255,255,255,0.3)', adjustedXP: 0, percent: 0 };
  }

  // Sum party thresholds across all members
  const partyThresholds = [0, 0, 0, 0]; // Easy, Medium, Hard, Deadly
  for (const lvl of partyLevels) {
    const clamped = Math.max(1, Math.min(20, Math.round(lvl)));
    const t = XP_THRESHOLDS[clamped] || XP_THRESHOLDS[1];
    partyThresholds[0] += t[0];
    partyThresholds[1] += t[1];
    partyThresholds[2] += t[2];
    partyThresholds[3] += t[3];
  }

  // Total raw XP from all monsters
  const rawXP = monsterCRs.reduce((sum, cr) => sum + (CR_XP[String(cr)] || 0), 0);

  // Apply encounter multiplier
  const multiplier = getEncounterMultiplier(monsterCRs.length, partyLevels.length);
  const adjustedXP = Math.floor(rawXP * multiplier);

  // Determine rating
  let rating, color;
  if (adjustedXP >= partyThresholds[3]) {
    rating = 'Deadly';
    color = '#ef4444';
  } else if (adjustedXP >= partyThresholds[2]) {
    rating = 'Hard';
    color = '#f97316';
  } else if (adjustedXP >= partyThresholds[1]) {
    rating = 'Medium';
    color = '#fbbf24';
  } else if (adjustedXP >= partyThresholds[0]) {
    rating = 'Easy';
    color = '#4ade80';
  } else {
    rating = 'Trivial';
    color = 'rgba(255,255,255,0.3)';
  }

  // Percent: 0% at Easy threshold, 100% at Deadly threshold
  const easyXP = partyThresholds[0];
  const deadlyXP = partyThresholds[3];
  const range = deadlyXP - easyXP;
  const percent = range > 0 ? Math.max(0, ((adjustedXP - easyXP) / range) * 100) : 0;

  return { rating, color, adjustedXP, percent };
}
