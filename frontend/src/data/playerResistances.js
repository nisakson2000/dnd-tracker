/**
 * playerResistances.js
 * Player Mode Improvements 74, 96-97: Resistances, immunities, vulnerabilities display
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// DEFENSE TYPES
// ---------------------------------------------------------------------------

export const DEFENSE_TYPES = {
  resistance: { label: 'Resistance', multiplier: 0.5, color: '#60a5fa', icon: 'shield', description: 'Take half damage' },
  immunity: { label: 'Immunity', multiplier: 0, color: '#4ade80', icon: 'shield-check', description: 'Take no damage' },
  vulnerability: { label: 'Vulnerability', multiplier: 2, color: '#ef4444', icon: 'alert-triangle', description: 'Take double damage' },
};

// ---------------------------------------------------------------------------
// COMMON RACIAL RESISTANCES
// ---------------------------------------------------------------------------

export const RACIAL_RESISTANCES = {
  Tiefling: { resistance: ['fire'] },
  'Mountain Dwarf': { resistance: ['poison'] },
  'Hill Dwarf': { resistance: ['poison'] },
  Dwarf: { resistance: ['poison'] },
  Dragonborn: {
    note: 'Resistance depends on draconic ancestry',
    options: {
      Black: ['acid'], Blue: ['lightning'], Brass: ['fire'], Bronze: ['lightning'],
      Copper: ['acid'], Gold: ['fire'], Green: ['poison'], Red: ['fire'],
      Silver: ['cold'], White: ['cold'],
    },
  },
  'Half-Orc': {},
  Goliath: { resistance: ['cold'] },
  'Fire Genasi': { resistance: ['fire'] },
  'Water Genasi': { resistance: ['acid'] },
  'Earth Genasi': {},
  'Air Genasi': {},
};

// ---------------------------------------------------------------------------
// COMMON CLASS/FEATURE RESISTANCES
// ---------------------------------------------------------------------------

export const CLASS_RESISTANCES = {
  'Rage (Barbarian)': { resistance: ['bludgeoning', 'piercing', 'slashing'], condition: 'While raging' },
  'Bear Totem (Barbarian)': { resistance: ['all except psychic'], condition: 'While raging' },
  'Forge Domain (Cleric)': { resistance: ['fire'], level: 6 },
  'Storm Sorcerer': { resistance: ['lightning', 'thunder'], level: 6 },
  'Draconic Sorcerer': { resistance: ['varies by ancestry'], level: 6 },
  'Shadow Monk': { resistance: [], note: 'Can become invisible in dim light/darkness' },
};

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Calculate modified damage with resistances/vulnerabilities.
 */
export function calculateModifiedDamage(baseDamage, damageType, defenses = {}) {
  const resistances = (defenses.resistances || []).map(r => r.toLowerCase());
  const immunities = (defenses.immunities || []).map(i => i.toLowerCase());
  const vulnerabilities = (defenses.vulnerabilities || []).map(v => v.toLowerCase());
  const type = (damageType || '').toLowerCase();

  if (immunities.includes(type)) return { damage: 0, modifier: 'immunity', color: '#4ade80' };
  if (vulnerabilities.includes(type)) return { damage: baseDamage * 2, modifier: 'vulnerability', color: '#ef4444' };
  if (resistances.includes(type)) return { damage: Math.floor(baseDamage / 2), modifier: 'resistance', color: '#60a5fa' };
  return { damage: baseDamage, modifier: 'normal', color: '#e8d9b5' };
}

/**
 * Get racial resistances for a race.
 */
export function getRacialResistances(race) {
  for (const [key, val] of Object.entries(RACIAL_RESISTANCES)) {
    if (race && race.toLowerCase().includes(key.toLowerCase())) {
      return val;
    }
  }
  return {};
}

/**
 * Format defenses for display.
 */
export function formatDefenses(defenses) {
  const parts = [];
  if (defenses.resistances?.length) parts.push(`Resist: ${defenses.resistances.join(', ')}`);
  if (defenses.immunities?.length) parts.push(`Immune: ${defenses.immunities.join(', ')}`);
  if (defenses.vulnerabilities?.length) parts.push(`Vuln: ${defenses.vulnerabilities.join(', ')}`);
  return parts;
}
