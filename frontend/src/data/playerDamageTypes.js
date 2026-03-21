/**
 * playerDamageTypes.js
 * Player Mode: Damage type reference, resistance/vulnerability tracking
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// DAMAGE TYPES
// ---------------------------------------------------------------------------

export const DAMAGE_TYPES = [
  { id: 'acid', label: 'Acid', color: '#22c55e', icon: 'droplet', description: 'Corrosive spray, black dragon breath' },
  { id: 'bludgeoning', label: 'Bludgeoning', color: '#9ca3af', icon: 'hammer', description: 'Blunt force from maces, hammers, falls' },
  { id: 'cold', label: 'Cold', color: '#60a5fa', icon: 'snowflake', description: 'Bitter cold from frost spells or white dragon breath' },
  { id: 'fire', label: 'Fire', color: '#ef4444', icon: 'flame', description: 'Flames from fire spells or red dragon breath' },
  { id: 'force', label: 'Force', color: '#a855f7', icon: 'zap', description: 'Pure magical energy (Magic Missile, Eldritch Blast)' },
  { id: 'lightning', label: 'Lightning', color: '#fbbf24', icon: 'bolt', description: 'Electrical energy from lightning spells or blue dragon breath' },
  { id: 'necrotic', label: 'Necrotic', color: '#6b21a8', icon: 'skull', description: 'Life-draining energy (Inflict Wounds, Blight)' },
  { id: 'piercing', label: 'Piercing', color: '#9ca3af', icon: 'target', description: 'Puncture wounds from arrows, daggers, teeth' },
  { id: 'poison', label: 'Poison', color: '#84cc16', icon: 'flask', description: 'Toxic substances (green dragon breath, poison darts)' },
  { id: 'psychic', label: 'Psychic', color: '#ec4899', icon: 'brain', description: 'Mental assault (Mind Blast, Vicious Mockery)' },
  { id: 'radiant', label: 'Radiant', color: '#fde68a', icon: 'sun', description: 'Holy light (Guiding Bolt, Sacred Flame)' },
  { id: 'slashing', label: 'Slashing', color: '#9ca3af', icon: 'swords', description: 'Cutting wounds from swords, axes, claws' },
  { id: 'thunder', label: 'Thunder', color: '#818cf8', icon: 'volume', description: 'Sonic force (Thunderwave, Shatter)' },
];

// ---------------------------------------------------------------------------
// PHYSICAL vs MAGICAL DAMAGE
// ---------------------------------------------------------------------------

export const PHYSICAL_DAMAGE_TYPES = ['bludgeoning', 'piercing', 'slashing'];
export const MAGICAL_DAMAGE_TYPES = ['acid', 'cold', 'fire', 'force', 'lightning', 'necrotic', 'poison', 'psychic', 'radiant', 'thunder'];

// ---------------------------------------------------------------------------
// RESISTANCE / VULNERABILITY / IMMUNITY TEMPLATE
// ---------------------------------------------------------------------------

export const DEFENSE_TEMPLATE = {
  resistances: [],      // damage types halved
  vulnerabilities: [],  // damage types doubled
  immunities: [],       // damage types negated
  conditionImmunities: [], // conditions the creature is immune to
};

/**
 * Get damage type info by id.
 */
export function getDamageType(typeId) {
  return DAMAGE_TYPES.find(d => d.id === (typeId || '').toLowerCase()) || null;
}

/**
 * Get color for a damage type.
 */
export function getDamageTypeColor(typeId) {
  const dt = getDamageType(typeId);
  return dt?.color || '#9ca3af';
}

/**
 * Categorize a list of damage defenses.
 */
export function categorizeDefenses(defenseList) {
  return {
    physical: defenseList.filter(d => PHYSICAL_DAMAGE_TYPES.includes(d)),
    magical: defenseList.filter(d => MAGICAL_DAMAGE_TYPES.includes(d)),
  };
}
