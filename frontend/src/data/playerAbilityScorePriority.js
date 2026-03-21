/**
 * playerAbilityScorePriority.js
 * Player Mode: Which ability scores matter most for each class and why
 * Pure JS — no React dependencies.
 */

export const ABILITY_SCORE_OVERVIEW = {
  STR: { name: 'Strength', affects: 'Melee attacks, Athletics, carrying capacity, heavy armor requirement', dump: 'Safe to dump for ranged/caster builds.' },
  DEX: { name: 'Dexterity', affects: 'AC, initiative, ranged attacks, finesse weapons, DEX saves, Acrobatics/Stealth', dump: 'Almost never dump. Too many things depend on it.' },
  CON: { name: 'Constitution', affects: 'HP, concentration saves, CON saves (very common)', dump: 'NEVER dump. Every character needs HP.' },
  INT: { name: 'Intelligence', affects: 'Investigation, Arcana, History, Nature, Religion', dump: 'Safe to dump for non-INT casters.' },
  WIS: { name: 'Wisdom', affects: 'Perception, Insight, Survival, WIS saves (very common, fear/charm)', dump: 'Risky to dump. WIS saves are frequent and devastating.' },
  CHA: { name: 'Charisma', affects: 'Social skills, CHA saves (Banishment)', dump: 'Safe to dump if someone else handles social.' },
};

export const CLASS_PRIORITIES = {
  Fighter: {
    melee: { primary: 'STR', secondary: 'CON', tertiary: 'WIS/DEX', dump: 'INT/CHA', note: 'STR for attacks, CON for HP, DEX for initiative/saves.' },
    ranged: { primary: 'DEX', secondary: 'CON', tertiary: 'WIS', dump: 'STR/INT/CHA', note: 'DEX for attacks AND AC. CON for HP.' },
  },
  Wizard: {
    primary: 'INT', secondary: 'DEX/CON', tertiary: 'WIS', dump: 'STR/CHA',
    note: 'INT for spell DC and attacks. DEX for AC and initiative. CON for concentration and HP.',
  },
  Cleric: {
    primary: 'WIS', secondary: 'CON', tertiary: 'STR or DEX', dump: 'INT/CHA',
    note: 'WIS for spells. Heavy armor Clerics can dump DEX. STR for melee Clerics.',
  },
  Rogue: {
    primary: 'DEX', secondary: 'CON', tertiary: 'WIS/CHA', dump: 'STR/INT',
    note: 'DEX for everything. CHA for social rogues. WIS for Perception.',
  },
  Barbarian: {
    primary: 'STR', secondary: 'CON', tertiary: 'DEX', dump: 'INT/CHA/WIS',
    note: 'STR for Reckless Attack. CON for HP and Unarmored Defense. DEX for AC.',
  },
  Paladin: {
    primary: 'STR/CHA', secondary: 'CON', tertiary: 'WIS', dump: 'INT/DEX',
    note: 'STR for attacks, CHA for spells AND Aura of Protection. Both are critical.',
  },
  Ranger: {
    primary: 'DEX', secondary: 'WIS', tertiary: 'CON', dump: 'STR/INT/CHA',
    note: 'DEX for attacks and AC. WIS for spells. CON for HP.',
  },
  Monk: {
    primary: 'DEX', secondary: 'WIS', tertiary: 'CON', dump: 'STR/INT/CHA',
    note: 'DEX for attacks and AC. WIS for AC, save DC, and features. Both are essential (MAD class).',
  },
  Warlock: {
    primary: 'CHA', secondary: 'CON', tertiary: 'DEX', dump: 'STR/INT/WIS',
    note: 'CHA for everything. CON for concentration. Hexblade can dump DEX.',
  },
  Sorcerer: {
    primary: 'CHA', secondary: 'CON', tertiary: 'DEX', dump: 'STR/INT/WIS',
    note: 'CHA for spells. CON for concentration. DEX for AC and initiative.',
  },
  Bard: {
    primary: 'CHA', secondary: 'DEX', tertiary: 'CON', dump: 'STR/INT',
    note: 'CHA for spells and social. DEX for AC and initiative. WIS for Perception.',
  },
  Druid: {
    primary: 'WIS', secondary: 'CON', tertiary: 'DEX', dump: 'STR/INT/CHA',
    note: 'WIS for spells. CON for Wild Shape HP pool and concentration.',
  },
  Artificer: {
    primary: 'INT', secondary: 'CON', tertiary: 'DEX', dump: 'STR/CHA/WIS',
    note: 'INT for everything. CON for concentration and HP. Battle Smith uses INT for attacks.',
  },
};

export const ASI_VS_FEAT = {
  description: 'At levels 4, 8, 12, 16, 19 you choose: +2 to an ability score OR a feat.',
  guidelines: [
    { guideline: 'Max your primary stat first', detail: 'Getting your main stat to 20 is almost always the first priority. +1 to hit and +1 damage/DC per 2 points.', priority: 'S' },
    { guideline: 'Take key feats at 4 if your stat is 16+', detail: 'If you start with 16 in your primary, a feat like GWM/SS/PAM can outperform +2 ASI.', priority: 'A' },
    { guideline: 'Half-feats at odd scores', detail: 'Resilient, Fey Touched, Shadow Touched, etc. give +1 to a stat PLUS a feature. Best at odd scores (17→18).', priority: 'S' },
    { guideline: 'CON is always useful', detail: 'After maxing your primary, +2 CON is never wrong. More HP, better concentration saves.', priority: 'A' },
    { guideline: 'Don\'t spread too thin', detail: 'Getting one stat to 20 > getting two stats to 16. Focus beats breadth.', priority: 'A' },
  ],
};

export const POINT_BUY_OPTIMIZATION = {
  budget: 27,
  costs: { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 },
  commonArrays: [
    { array: [15, 15, 15, 8, 8, 8], note: 'Three 15s. Best with +2/+1 racial bonus for a 17/16 start.' },
    { array: [15, 14, 13, 12, 10, 8], note: 'Balanced. No dumps below 8. Good for MAD classes.' },
    { array: [15, 15, 13, 12, 8, 8], note: 'Two primary stats high. Good for half-feats at 13.' },
    { array: [15, 15, 14, 8, 8, 8], note: 'Aggressive. Three high stats, three dumps.' },
  ],
  standardArray: [15, 14, 13, 12, 10, 8],
};

export function getModifier(score) {
  return Math.floor((score - 10) / 2);
}

export function getPriorityForClass(className) {
  return CLASS_PRIORITIES[className] || CLASS_PRIORITIES.Fighter.melee;
}

export function pointBuyRemaining(scores) {
  const costs = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
  const spent = scores.reduce((sum, s) => sum + (costs[Math.min(15, Math.max(8, s))] || 0), 0);
  return 27 - spent;
}
