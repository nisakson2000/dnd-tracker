/**
 * playerBuffDebuffTracker.js
 * Player Mode: Track active buffs and debuffs with durations and effects
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// BUFF/DEBUFF CATEGORIES
// ---------------------------------------------------------------------------

export const EFFECT_TYPES = {
  buff: { label: 'Buff', color: '#4ade80', bgColor: 'rgba(74,222,128,0.1)' },
  debuff: { label: 'Debuff', color: '#ef4444', bgColor: 'rgba(239,68,68,0.1)' },
  neutral: { label: 'Neutral', color: '#94a3b8', bgColor: 'rgba(148,163,184,0.1)' },
  environmental: { label: 'Environmental', color: '#fbbf24', bgColor: 'rgba(251,191,36,0.1)' },
};

// ---------------------------------------------------------------------------
// COMMON BUFFS (from spells/features)
// ---------------------------------------------------------------------------

export const COMMON_BUFFS = [
  { name: 'Bless', type: 'buff', effect: '+1d4 to attacks and saves', duration: '1 minute', concentration: true, source: 'spell' },
  { name: 'Shield of Faith', type: 'buff', effect: '+2 AC', duration: '10 minutes', concentration: true, source: 'spell' },
  { name: 'Haste', type: 'buff', effect: '+2 AC, doubled speed, extra action', duration: '1 minute', concentration: true, source: 'spell' },
  { name: 'Bardic Inspiration', type: 'buff', effect: 'Add 1d6/d8/d10/d12 to one roll', duration: '10 minutes', concentration: false, source: 'feature' },
  { name: 'Guidance', type: 'buff', effect: '+1d4 to one ability check', duration: '1 minute', concentration: true, source: 'spell' },
  { name: 'Mage Armor', type: 'buff', effect: 'AC = 13 + DEX mod', duration: '8 hours', concentration: false, source: 'spell' },
  { name: 'Aid', type: 'buff', effect: '+5 HP (max and current)', duration: '8 hours', concentration: false, source: 'spell' },
  { name: 'Protection from Evil and Good', type: 'buff', effect: 'Disadvantage on attacks from aberrations, etc.', duration: '10 minutes', concentration: true, source: 'spell' },
  { name: 'Heroism', type: 'buff', effect: 'Immune to frightened, gain temp HP each turn', duration: '1 minute', concentration: true, source: 'spell' },
  { name: 'Mirror Image', type: 'buff', effect: '3 duplicates absorb attacks', duration: '1 minute', concentration: false, source: 'spell' },
  { name: 'Rage', type: 'buff', effect: 'Bonus melee damage, resistance to BPS, advantage on STR', duration: '1 minute', concentration: false, source: 'feature' },
  { name: "Hunter's Mark", type: 'buff', effect: '+1d6 weapon damage to target', duration: '1 hour', concentration: true, source: 'spell' },
];

// ---------------------------------------------------------------------------
// COMMON DEBUFFS (from spells/effects)
// ---------------------------------------------------------------------------

export const COMMON_DEBUFFS = [
  { name: 'Bane', type: 'debuff', effect: '-1d4 to attacks and saves', duration: '1 minute', save: 'CHA', source: 'spell' },
  { name: 'Hex', type: 'debuff', effect: '+1d6 necrotic on hits, disadvantage on one ability', duration: '1 hour', source: 'spell' },
  { name: 'Faerie Fire', type: 'debuff', effect: 'Attacks have advantage against you, no invisibility', duration: '1 minute', save: 'DEX', source: 'spell' },
  { name: 'Slow', type: 'debuff', effect: '-2 AC, -2 DEX saves, half speed, no reactions', duration: '1 minute', save: 'WIS', source: 'spell' },
  { name: 'Entangle', type: 'debuff', effect: 'Restrained', duration: '1 minute', save: 'STR', source: 'spell' },
  { name: 'Hold Person', type: 'debuff', effect: 'Paralyzed', duration: '1 minute', save: 'WIS', source: 'spell' },
  { name: 'Blindness/Deafness', type: 'debuff', effect: 'Blinded or deafened', duration: '1 minute', save: 'CON', source: 'spell' },
  { name: 'Fear', type: 'debuff', effect: 'Frightened, must Dash away', duration: '1 minute', save: 'WIS', source: 'spell' },
];

// ---------------------------------------------------------------------------
// ACTIVE EFFECT TEMPLATE
// ---------------------------------------------------------------------------

export const ACTIVE_EFFECT_TEMPLATE = {
  id: '',
  name: '',
  type: 'buff',        // buff, debuff, neutral, environmental
  effect: '',
  source: '',          // spell, feature, item, environmental
  roundsRemaining: null,
  concentration: false,
  casterName: '',
  timestamp: null,
};

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Create an active effect.
 */
export function createActiveEffect(name, type, effect, roundsRemaining = null, concentration = false) {
  return {
    ...ACTIVE_EFFECT_TEMPLATE,
    id: `eff-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    type,
    effect,
    roundsRemaining,
    concentration,
    timestamp: Date.now(),
  };
}

/**
 * Tick effects by 1 round. Remove expired effects.
 */
export function tickEffects(effects) {
  return effects
    .map(e => e.roundsRemaining != null ? { ...e, roundsRemaining: e.roundsRemaining - 1 } : e)
    .filter(e => e.roundsRemaining == null || e.roundsRemaining > 0);
}

/**
 * Get effects about to expire (1-2 rounds).
 */
export function getExpiringEffects(effects) {
  return effects.filter(e => e.roundsRemaining != null && e.roundsRemaining <= 2 && e.roundsRemaining > 0);
}

/**
 * Separate buffs and debuffs.
 */
export function separateEffects(effects) {
  return {
    buffs: effects.filter(e => e.type === 'buff'),
    debuffs: effects.filter(e => e.type === 'debuff'),
    other: effects.filter(e => e.type !== 'buff' && e.type !== 'debuff'),
  };
}
