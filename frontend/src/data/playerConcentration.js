/**
 * playerConcentration.js
 * Player Mode Improvements 12, 43-44: Concentration tracking & auto-prompts
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// CONCENTRATION RULES
// ---------------------------------------------------------------------------

export const CONCENTRATION_RULES = {
  maxActiveSpells: 1,
  description: 'You can only concentrate on one spell at a time. Casting a new concentration spell ends the previous one.',
  checkTriggers: [
    'Taking damage',
    'Being incapacitated or killed',
    'Environmental effects (DM discretion)',
  ],
  savingThrow: {
    type: 'Constitution',
    dc: 'Higher of 10 or half the damage taken',
    description: 'DC = max(10, damage / 2). Each source of damage requires a separate check.',
  },
  warCasterBenefit: 'Advantage on Constitution saving throws to maintain concentration.',
};

// ---------------------------------------------------------------------------
// CONCENTRATION CHECK CALCULATOR
// ---------------------------------------------------------------------------

/**
 * Calculate the DC for a concentration save.
 * @param {number} damageTaken - The amount of damage taken from a single source.
 * @returns {{ dc: number, description: string }}
 */
export function getConcentrationDC(damageTaken) {
  const dc = Math.max(10, Math.floor(damageTaken / 2));
  return {
    dc,
    description: `DC ${dc} (${damageTaken} damage → ${Math.floor(damageTaken / 2)}, minimum 10)`,
  };
}

/**
 * Determine if concentration is maintained after a save roll.
 * @param {number} saveTotal - The total Constitution saving throw result.
 * @param {number} dc - The DC to beat.
 * @returns {{ maintained: boolean, margin: number }}
 */
export function checkConcentration(saveTotal, dc) {
  const maintained = saveTotal >= dc;
  return {
    maintained,
    margin: saveTotal - dc,
    message: maintained
      ? `Concentration maintained! (${saveTotal} vs DC ${dc}, +${saveTotal - dc})`
      : `Concentration BROKEN! (${saveTotal} vs DC ${dc}, -${dc - saveTotal})`,
  };
}

// ---------------------------------------------------------------------------
// COMMON CONCENTRATION SPELLS (for quick reference)
// ---------------------------------------------------------------------------

export const COMMON_CONCENTRATION_SPELLS = [
  { name: 'Bless', level: 1, duration: '1 minute', effect: '+1d4 to attacks & saves (3 targets)' },
  { name: 'Bane', level: 1, duration: '1 minute', effect: '-1d4 to attacks & saves (3 targets)' },
  { name: 'Shield of Faith', level: 1, duration: '10 minutes', effect: '+2 AC' },
  { name: 'Hex', level: 1, duration: '1 hour', effect: '+1d6 necrotic on hits, disadvantage on one ability check' },
  { name: "Hunter's Mark", level: 1, duration: '1 hour', effect: '+1d6 on weapon hits, track the target' },
  { name: 'Hold Person', level: 2, duration: '1 minute', effect: 'Target paralyzed (WIS save each turn)' },
  { name: 'Moonbeam', level: 2, duration: '1 minute', effect: '2d10 radiant in 5ft cylinder' },
  { name: 'Spirit Guardians', level: 3, duration: '10 minutes', effect: '3d8 radiant/necrotic to enemies within 15ft' },
  { name: 'Haste', level: 3, duration: '1 minute', effect: '+2 AC, double speed, extra action' },
  { name: 'Fly', level: 3, duration: '10 minutes', effect: '60ft fly speed' },
  { name: 'Greater Invisibility', level: 4, duration: '1 minute', effect: 'Invisible (can still attack/cast)' },
  { name: 'Polymorph', level: 4, duration: '1 hour', effect: 'Transform into beast' },
  { name: 'Wall of Force', level: 5, duration: '10 minutes', effect: 'Invisible wall, immune to damage' },
  { name: 'Hold Monster', level: 5, duration: '1 minute', effect: 'Target paralyzed (WIS save each turn)' },
];

// ---------------------------------------------------------------------------
// CONCENTRATION TRACKER TEMPLATE
// ---------------------------------------------------------------------------

export const CONCENTRATION_TRACKER_TEMPLATE = {
  activeSpell: null,       // { name, level, castTime, remainingRounds }
  checksPassed: 0,
  checksFailed: 0,
  history: [],             // [{ spell, maintained, dc, roll, timestamp }]
};
