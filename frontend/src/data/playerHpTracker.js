/**
 * playerHpTracker.js
 * Player Mode Improvements 81-85: HP management helpers, temp HP, healing tracker
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// HP BAR COLORS
// ---------------------------------------------------------------------------

export const HP_BAR_COLORS = {
  healthy: { min: 0.75, color: '#4ade80', bg: 'rgba(74,222,128,0.15)', label: 'Healthy' },
  wounded: { min: 0.5, color: '#fbbf24', bg: 'rgba(251,191,36,0.15)', label: 'Wounded' },
  bloodied: { min: 0.25, color: '#f97316', bg: 'rgba(249,115,22,0.15)', label: 'Bloodied' },
  critical: { min: 0, color: '#ef4444', bg: 'rgba(239,68,68,0.15)', label: 'Critical' },
  dead: { min: -Infinity, color: '#6b21a8', bg: 'rgba(107,33,168,0.15)', label: 'Down' },
};

/**
 * Get HP status color and label based on percentage.
 */
export function getHpStatus(currentHp, maxHp) {
  if (maxHp <= 0) return HP_BAR_COLORS.dead;
  if (currentHp <= 0) return HP_BAR_COLORS.dead;
  const pct = currentHp / maxHp;
  if (pct >= 0.75) return HP_BAR_COLORS.healthy;
  if (pct >= 0.5) return HP_BAR_COLORS.wounded;
  if (pct >= 0.25) return HP_BAR_COLORS.bloodied;
  return HP_BAR_COLORS.critical;
}

// ---------------------------------------------------------------------------
// TEMP HP RULES
// ---------------------------------------------------------------------------

export const TEMP_HP_RULES = {
  description: 'Temporary hit points are a buffer against damage, absorbed before regular HP.',
  rules: [
    'Temp HP does NOT stack — you choose the higher value.',
    'Temp HP is lost after a long rest (unless specified otherwise).',
    'Healing does NOT restore temporary hit points.',
    'Temp HP is subtracted from damage before regular HP.',
  ],
  commonSources: [
    { name: 'Heroism', value: 'Spellcasting mod each turn', duration: 'Concentration (1 min)' },
    { name: 'Inspiring Leader', value: 'Level + CHA mod', duration: 'Until lost or long rest' },
    { name: 'Armor of Agathys', value: '5 per slot level', duration: '1 hour' },
    { name: 'False Life', value: '1d4+4 (base)', duration: '1 hour' },
    { name: 'Dark One\'s Blessing (Fiend Warlock)', value: 'CHA mod + Warlock level', duration: 'Until lost or long rest' },
  ],
};

// ---------------------------------------------------------------------------
// HIT DICE
// ---------------------------------------------------------------------------

export const HIT_DICE_BY_CLASS = {
  Barbarian: 12,
  Fighter: 10,
  Paladin: 10,
  Ranger: 10,
  Bard: 8,
  Cleric: 8,
  Druid: 8,
  Monk: 8,
  Rogue: 8,
  Warlock: 8,
  Sorcerer: 6,
  Wizard: 6,
};

/**
 * Calculate average hit die healing (die / 2 + 0.5 + CON mod).
 */
export function averageHitDieHealing(hitDie, conMod = 0) {
  return Math.floor(hitDie / 2) + 1 + conMod;
}

// ---------------------------------------------------------------------------
// DAMAGE LOG TEMPLATE
// ---------------------------------------------------------------------------

export const DAMAGE_LOG_ENTRY = {
  timestamp: null,
  amount: 0,
  type: 'unknown',     // slashing, fire, etc.
  source: '',          // who/what dealt the damage
  wasResisted: false,  // halved by resistance
  wasVulnerable: false, // doubled by vulnerability
};

/**
 * Calculate net damage after resistance/vulnerability/immunity.
 */
export function calculateNetDamage(baseDamage, damageType, resistances = [], vulnerabilities = [], immunities = []) {
  const lowerType = (damageType || '').toLowerCase();
  if (immunities.some(i => i.toLowerCase() === lowerType)) return 0;
  if (resistances.some(r => r.toLowerCase() === lowerType)) return Math.floor(baseDamage / 2);
  if (vulnerabilities.some(v => v.toLowerCase() === lowerType)) return baseDamage * 2;
  return baseDamage;
}
