// D&D 5e Exhaustion Levels
export const EXHAUSTION_LEVELS = {
  1: { description: 'Disadvantage on ability checks', effects: { abilityCheckDisadvantage: true } },
  2: { description: 'Speed halved', effects: { abilityCheckDisadvantage: true, speedHalved: true } },
  3: { description: 'Disadvantage on attacks and saves', effects: { abilityCheckDisadvantage: true, speedHalved: true, attackDisadvantage: true, saveDisadvantage: true } },
  4: { description: 'HP maximum halved', effects: { abilityCheckDisadvantage: true, speedHalved: true, attackDisadvantage: true, saveDisadvantage: true, hpMaxHalved: true } },
  5: { description: 'Speed reduced to 0', effects: { abilityCheckDisadvantage: true, speedHalved: true, attackDisadvantage: true, saveDisadvantage: true, hpMaxHalved: true, speedZero: true } },
  6: { description: 'Death', effects: { death: true } }
};

export function getExhaustionLevel(conditions) {
  // Look for conditions named "Exhaustion" or "Exhaustion (X)" or exhaustion with a level
  if (!conditions || !Array.isArray(conditions)) return 0;
  for (const c of conditions) {
    const name = typeof c === 'string' ? c : c.name || '';
    const match = name.match(/exhaustion\s*\(?(\d)?\)?/i);
    if (match) return parseInt(match[1] || '1');
  }
  return 0;
}

export function getExhaustionEffects(level) {
  if (level <= 0 || level > 6) return null;
  return EXHAUSTION_LEVELS[level];
}

export function getExhaustionPenalties(level) {
  // Returns a summary string of all active penalties
  if (level <= 0) return null;
  const penalties = [];
  if (level >= 1) penalties.push('Disadvantage on ability checks');
  if (level >= 2) penalties.push('Speed halved');
  if (level >= 3) penalties.push('Disadvantage on attacks & saves');
  if (level >= 4) penalties.push('HP max halved');
  if (level >= 5) penalties.push('Speed 0');
  if (level >= 6) penalties.push('DEATH');
  return penalties;
}
