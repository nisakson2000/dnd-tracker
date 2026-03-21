/**
 * playerSpellComponents.js
 * Player Mode Improvements 49-50, 55-56: Spell components, ritual casting, arcane recovery
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// SPELL COMPONENT TYPES
// ---------------------------------------------------------------------------

export const COMPONENT_TYPES = {
  V: { label: 'Verbal', description: 'A spoken incantation. Cannot cast if silenced.', icon: 'mic', color: '#60a5fa' },
  S: { label: 'Somatic', description: 'Measured hand gestures. Need at least one free hand.', icon: 'hand', color: '#4ade80' },
  M: { label: 'Material', description: 'Physical components. Can use a component pouch or arcane focus.', icon: 'gem', color: '#fbbf24' },
};

/**
 * Parse spell component string (e.g., "V, S, M (a bit of fleece)")
 */
export function parseComponents(componentStr) {
  if (!componentStr) return { V: false, S: false, M: false, materialDetail: null };
  const str = componentStr.trim();
  const V = /\bV\b/.test(str);
  const S = /\bS\b/.test(str);
  const M = /\bM\b/.test(str);
  const materialMatch = str.match(/M\s*\(([^)]+)\)/);
  return {
    V,
    S,
    M,
    materialDetail: materialMatch ? materialMatch[1].trim() : null,
  };
}

/**
 * Format components for compact display.
 */
export function formatComponents(components) {
  const parts = [];
  if (components.V) parts.push('V');
  if (components.S) parts.push('S');
  if (components.M) parts.push('M');
  return parts.join(', ');
}

// ---------------------------------------------------------------------------
// ARCANE RECOVERY (Wizard)
// ---------------------------------------------------------------------------

export const ARCANE_RECOVERY = {
  className: 'Wizard',
  description: 'Once per day during a short rest, recover spell slots with a combined level equal to or less than half your wizard level (rounded up). No slot above 5th level.',
  getRecoverableSlotLevels: (wizardLevel) => {
    const maxTotal = Math.ceil(wizardLevel / 2);
    return { maxTotalLevels: maxTotal, maxSlotLevel: 5 };
  },
};

// ---------------------------------------------------------------------------
// SORCERY POINTS (Sorcerer)
// ---------------------------------------------------------------------------

export const SORCERY_POINTS = {
  className: 'Sorcerer',
  getMaxPoints: (sorcererLevel) => sorcererLevel, // 1 point per level
  slotCosts: {
    1: 2,  // 2 points = 1st-level slot
    2: 3,
    3: 5,
    4: 6,
    5: 7,
  },
  slotToPoints: {
    1: 1,  // 1st-level slot = 1 point
    2: 2,
    3: 3,
    4: 4,
    5: 5,
  },
  metamagic: [
    { name: 'Careful Spell', cost: 1, description: 'Choose CHA mod creatures to auto-succeed on save' },
    { name: 'Distant Spell', cost: 1, description: 'Double range (touch becomes 30ft)' },
    { name: 'Empowered Spell', cost: 1, description: 'Reroll CHA mod damage dice' },
    { name: 'Extended Spell', cost: 1, description: 'Double duration (max 24 hours)' },
    { name: 'Heightened Spell', cost: 3, description: 'Target has disadvantage on first save' },
    { name: 'Quickened Spell', cost: 2, description: 'Cast as bonus action instead of action' },
    { name: 'Seeking Spell', cost: 2, description: 'Reroll missed spell attack' },
    { name: 'Subtle Spell', cost: 1, description: 'No V or S components needed' },
    { name: 'Transmuted Spell', cost: 1, description: 'Change damage type (acid/cold/fire/lightning/poison/thunder)' },
    { name: 'Twinned Spell', cost: 'spell level', description: 'Target a second creature with single-target spell' },
  ],
};

// ---------------------------------------------------------------------------
// CHANNEL DIVINITY
// ---------------------------------------------------------------------------

export const CHANNEL_DIVINITY = {
  className: 'Cleric/Paladin',
  getUses: (level) => {
    if (level >= 18) return 3;
    if (level >= 6) return 2;
    return 1;
  },
  recharge: 'short_rest',
  description: 'Channel divine energy for special abilities. Recharges on short or long rest.',
};
