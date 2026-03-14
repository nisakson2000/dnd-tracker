// 5e class categories for spell slot computation
export const FULL_CASTERS = ['bard', 'cleric', 'druid', 'sorcerer', 'wizard'];
export const HALF_CASTERS = ['paladin', 'ranger'];
export const THIRD_CASTER_SUBCLASSES = ['eldritch knight', 'arcane trickster'];
export const PACT_CASTERS = ['warlock']; // Uses own slot table, not combined

export const HIT_DIE_BY_CLASS = {
  barbarian: 12, fighter: 10, paladin: 10, ranger: 10,
  bard: 8, cleric: 8, druid: 8, monk: 8, rogue: 8, warlock: 8,
  sorcerer: 6, wizard: 6,
};

// 5e Multiclass Spellcaster table (PHB p.165)
const MULTICLASS_SLOTS = {
  1:  [2,0,0,0,0,0,0,0,0],
  2:  [3,0,0,0,0,0,0,0,0],
  3:  [4,2,0,0,0,0,0,0,0],
  4:  [4,3,0,0,0,0,0,0,0],
  5:  [4,3,2,0,0,0,0,0,0],
  6:  [4,3,3,0,0,0,0,0,0],
  7:  [4,3,3,1,0,0,0,0,0],
  8:  [4,3,3,2,0,0,0,0,0],
  9:  [4,3,3,3,1,0,0,0,0],
  10: [4,3,3,3,2,0,0,0,0],
  11: [4,3,3,3,2,1,0,0,0],
  12: [4,3,3,3,2,1,0,0,0],
  13: [4,3,3,3,2,1,1,0,0],
  14: [4,3,3,3,2,1,1,0,0],
  15: [4,3,3,3,2,1,1,1,0],
  16: [4,3,3,3,2,1,1,1,0],
  17: [4,3,3,3,2,1,1,1,1],
  18: [4,3,3,3,3,1,1,1,1],
  19: [4,3,3,3,3,2,1,1,1],
  20: [4,3,3,3,3,2,2,1,1],
};

export function computeCasterLevel(primaryClass, primaryLevel, multiclassData = []) {
  let casterLevel = 0;
  const allClasses = [{ class: primaryClass, level: primaryLevel }, ...multiclassData];

  for (const entry of allClasses) {
    const cls = (entry.class || '').toLowerCase();
    const sub = (entry.subclass || '').toLowerCase();
    if (PACT_CASTERS.includes(cls)) continue; // Warlock uses own table
    if (FULL_CASTERS.includes(cls)) casterLevel += entry.level;
    else if (HALF_CASTERS.includes(cls)) casterLevel += Math.floor(entry.level / 2);
    else if (THIRD_CASTER_SUBCLASSES.includes(sub)) casterLevel += Math.floor(entry.level / 3);
  }
  return Math.min(20, casterLevel);
}

export function getMulticlassSpellSlots(primaryClass, primaryLevel, multiclassData = []) {
  const casterLevel = computeCasterLevel(primaryClass, primaryLevel, multiclassData);
  if (casterLevel <= 0) return [];
  return MULTICLASS_SLOTS[casterLevel] || [];
}

export function getTotalLevel(primaryLevel, multiclassData = []) {
  return primaryLevel + multiclassData.reduce((s, m) => s + (m.level || 0), 0);
}

export function getHitDiceBreakdown(primaryClass, primaryLevel, multiclassData = []) {
  const result = [];
  const die = HIT_DIE_BY_CLASS[(primaryClass || '').toLowerCase()] || 8;
  result.push({ class: primaryClass, die: `d${die}`, count: primaryLevel });
  for (const entry of multiclassData) {
    const d = HIT_DIE_BY_CLASS[(entry.class || '').toLowerCase()] || 8;
    result.push({ class: entry.class, die: `d${d}`, count: entry.level || 0 });
  }
  return result;
}
