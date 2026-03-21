/**
 * playerCriticalHits.js
 * Player Mode: Critical hit rules, effects, and flavor text
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// CRITICAL HIT RULES
// ---------------------------------------------------------------------------

export const CRITICAL_HIT_RULES = {
  trigger: 'Rolling a natural 20 on an attack roll.',
  effect: 'Double all damage dice of the attack (but not modifiers).',
  notes: [
    'All damage dice are doubled — weapon dice, sneak attack, smite, etc.',
    'Static modifiers (STR/DEX mod, magic weapon bonus) are NOT doubled.',
    'A natural 20 always hits, regardless of the target\'s AC.',
    'Some features add extra effects on crits (Champion Fighter, Brutal Critical).',
  ],
  specialFeatures: [
    { name: 'Brutal Critical (Barbarian)', level: 9, effect: 'Add 1 extra weapon die to critical hits. Additional die at 13th and 17th level.' },
    { name: 'Improved Critical (Champion)', level: 3, effect: 'Crit on 19-20.' },
    { name: 'Superior Critical (Champion)', level: 15, effect: 'Crit on 18-20.' },
    { name: 'Hexblade\'s Curse (Warlock)', level: 1, effect: 'Crit on 19-20 against cursed target.' },
  ],
};

// ---------------------------------------------------------------------------
// CRITICAL FUMBLE RULES (Optional)
// ---------------------------------------------------------------------------

export const CRITICAL_FUMBLE_RULES = {
  trigger: 'Rolling a natural 1 on an attack roll.',
  officialRule: 'A natural 1 always misses. No other effect by RAW.',
  note: 'Critical fumble tables are a popular house rule but not in the official rules.',
};

// ---------------------------------------------------------------------------
// CRITICAL HIT FLAVOR TEXT
// ---------------------------------------------------------------------------

export const CRIT_FLAVOR = {
  slashing: [
    'Your blade bites deep, finding the gap in their defenses!',
    'A devastating slash opens a terrible wound!',
    'With surgical precision, your weapon carves through armor!',
  ],
  piercing: [
    'Your weapon finds a vital point!',
    'A perfect thrust pierces clean through!',
    'The point drives deep with terrible accuracy!',
  ],
  bludgeoning: [
    'A bone-shattering impact!',
    'The crushing blow sends them reeling!',
    'You connect with devastating force!',
  ],
  fire: [
    'Flames engulf the target with searing intensity!',
    'A blinding burst of fire scorches everything!',
  ],
  radiant: [
    'Divine light blazes with purifying intensity!',
    'Holy energy sears through the target!',
  ],
  necrotic: [
    'Dark energy drains the life force with terrible efficiency!',
    'The touch of death withers flesh and spirit!',
  ],
};

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Double damage dice for a critical hit.
 */
export function doubleDamageDice(diceExpression) {
  return diceExpression.replace(/(\d+)d(\d+)/g, (_, count, sides) => {
    return `${parseInt(count) * 2}d${sides}`;
  });
}

/**
 * Get crit range for a character.
 */
export function getCritRange(className, level, features = []) {
  let range = 20;
  const lc = (className || '').toLowerCase();
  if (lc.includes('champion') || features.includes('Improved Critical')) {
    range = level >= 15 ? 18 : 19;
  }
  if (features.includes('Hexblade\'s Curse')) range = Math.min(range, 19);
  return range;
}

/**
 * Check if a roll is a critical hit.
 */
export function isCriticalHit(d20Roll, critRange = 20) {
  return d20Roll >= critRange;
}

/**
 * Get random crit flavor text.
 */
export function getCritFlavor(damageType) {
  const type = (damageType || 'slashing').toLowerCase();
  const flavors = CRIT_FLAVOR[type] || CRIT_FLAVOR.slashing;
  return flavors[Math.floor(Math.random() * flavors.length)];
}
