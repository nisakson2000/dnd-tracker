/**
 * playerStatusEffects.js
 * Player Mode: Buff/debuff tracking, duration timers, and status effect management
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// BUFF / DEBUFF CATEGORIES
// ---------------------------------------------------------------------------

export const EFFECT_TYPES = {
  buff: { label: 'Buff', color: '#4ade80', bgColor: 'rgba(74,222,128,0.1)' },
  debuff: { label: 'Debuff', color: '#ef4444', bgColor: 'rgba(239,68,68,0.1)' },
  neutral: { label: 'Neutral', color: '#60a5fa', bgColor: 'rgba(96,165,250,0.1)' },
  environmental: { label: 'Environmental', color: '#fbbf24', bgColor: 'rgba(251,191,36,0.1)' },
};

// ---------------------------------------------------------------------------
// DURATION TYPES
// ---------------------------------------------------------------------------

export const DURATION_TYPES = {
  rounds: { label: 'Rounds', description: 'Expires after N rounds' },
  minutes: { label: 'Minutes', description: 'Expires after N minutes' },
  hours: { label: 'Hours', description: 'Expires after N hours' },
  until_dispelled: { label: 'Until Dispelled', description: 'Lasts until dispelled or ended' },
  concentration: { label: 'Concentration', description: 'Lasts as long as caster maintains concentration' },
  until_long_rest: { label: 'Until Long Rest', description: 'Lasts until the next long rest' },
  permanent: { label: 'Permanent', description: 'Does not expire' },
  save_ends: { label: 'Save Ends', description: 'Target can repeat save at end of each turn' },
};

// ---------------------------------------------------------------------------
// COMMON BUFFS
// ---------------------------------------------------------------------------

export const COMMON_BUFFS = [
  { name: 'Bless', duration: { type: 'concentration', value: 10, unit: 'rounds' }, effect: '+1d4 to attacks and saves', source: 'spell', level: 1 },
  { name: 'Shield of Faith', duration: { type: 'concentration', value: 100, unit: 'rounds' }, effect: '+2 AC', source: 'spell', level: 1 },
  { name: 'Haste', duration: { type: 'concentration', value: 10, unit: 'rounds' }, effect: '+2 AC, double speed, extra action', source: 'spell', level: 3 },
  { name: 'Heroism', duration: { type: 'concentration', value: 10, unit: 'rounds' }, effect: 'Immune to frightened, temp HP each turn', source: 'spell', level: 1 },
  { name: 'Mage Armor', duration: { type: 'hours', value: 8 }, effect: 'AC = 13 + DEX mod', source: 'spell', level: 1 },
  { name: 'Mirror Image', duration: { type: 'minutes', value: 1 }, effect: '3 duplicates, AC 10+DEX', source: 'spell', level: 2 },
  { name: 'Barkskin', duration: { type: 'concentration', value: 100, unit: 'rounds' }, effect: 'AC cannot be lower than 16', source: 'spell', level: 2 },
  { name: 'Rage', duration: { type: 'rounds', value: 10 }, effect: 'Bonus damage, resistance, ADV on STR', source: 'class', level: null },
  { name: 'Bardic Inspiration', duration: { type: 'minutes', value: 10 }, effect: 'Add inspiration die to one roll', source: 'class', level: null },
  { name: 'Guidance', duration: { type: 'concentration', value: 10, unit: 'rounds' }, effect: '+1d4 to one ability check', source: 'spell', level: 0 },
  { name: 'Aid', duration: { type: 'hours', value: 8 }, effect: '+5 max HP (scales with level)', source: 'spell', level: 2 },
  { name: 'Death Ward', duration: { type: 'hours', value: 8 }, effect: 'First time dropping to 0 HP, drop to 1 instead', source: 'spell', level: 4 },
];

// ---------------------------------------------------------------------------
// COMMON DEBUFFS
// ---------------------------------------------------------------------------

export const COMMON_DEBUFFS = [
  { name: 'Bane', duration: { type: 'concentration', value: 10, unit: 'rounds' }, effect: '-1d4 to attacks and saves', source: 'spell', save: 'CHA' },
  { name: 'Hex', duration: { type: 'concentration', value: 100, unit: 'rounds' }, effect: '+1d6 necrotic on hits, DIS on chosen ability checks', source: 'spell', save: null },
  { name: 'Hunter\'s Mark', duration: { type: 'concentration', value: 100, unit: 'rounds' }, effect: '+1d6 on weapon hits', source: 'spell', save: null },
  { name: 'Faerie Fire', duration: { type: 'concentration', value: 10, unit: 'rounds' }, effect: 'Attack rolls against have advantage, visible if invisible', source: 'spell', save: 'DEX' },
  { name: 'Hold Person', duration: { type: 'concentration', value: 10, unit: 'rounds' }, effect: 'Paralyzed', source: 'spell', save: 'WIS' },
  { name: 'Slow', duration: { type: 'concentration', value: 10, unit: 'rounds' }, effect: 'Halved speed, -2 AC, no reactions', source: 'spell', save: 'WIS' },
  { name: 'Blindness/Deafness', duration: { type: 'minutes', value: 1 }, effect: 'Blinded or Deafened', source: 'spell', save: 'CON' },
  { name: 'Bestow Curse', duration: { type: 'concentration', value: 10, unit: 'rounds' }, effect: 'DIS on checks/saves with chosen ability', source: 'spell', save: 'WIS' },
];

// ---------------------------------------------------------------------------
// EFFECT TRACKER TEMPLATE
// ---------------------------------------------------------------------------

export const ACTIVE_EFFECT_TEMPLATE = {
  id: '',
  name: '',
  type: 'buff',         // buff, debuff, neutral, environmental
  effect: '',
  source: '',            // who/what applied it
  duration: null,        // { type, value, unit }
  roundsRemaining: null,
  saveDC: null,
  saveType: null,
  concentration: false,
  casterName: null,
  appliedAt: null,       // timestamp
};

/**
 * Create a new active effect.
 */
export function createActiveEffect(name, type, effect, duration, source = '') {
  return {
    ...ACTIVE_EFFECT_TEMPLATE,
    id: `effect_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name,
    type,
    effect,
    duration,
    source,
    roundsRemaining: duration?.type === 'rounds' ? duration.value : null,
    concentration: duration?.type === 'concentration',
    appliedAt: Date.now(),
  };
}

/**
 * Tick effects for a new round (decrement round-based durations).
 */
export function tickEffects(effects) {
  return effects
    .map(e => {
      if (e.roundsRemaining != null && e.roundsRemaining > 0) {
        return { ...e, roundsRemaining: e.roundsRemaining - 1 };
      }
      return e;
    })
    .filter(e => e.roundsRemaining === null || e.roundsRemaining > 0);
}
