/**
 * playerAbilityCheckHelper.js
 * Player Mode: Ability check reference with common DCs and situational modifiers
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// ABILITY CHECK MODIFIERS
// ---------------------------------------------------------------------------

export const ABILITY_CHECK_MODIFIERS = {
  advantage: { label: 'Advantage', description: 'Roll 2d20, take the higher', color: '#4ade80' },
  disadvantage: { label: 'Disadvantage', description: 'Roll 2d20, take the lower', color: '#ef4444' },
  normal: { label: 'Normal', description: 'Roll 1d20', color: '#94a3b8' },
};

// ---------------------------------------------------------------------------
// COMMON ABILITY CHECKS & SUGGESTED DCs
// ---------------------------------------------------------------------------

export const COMMON_CHECKS = {
  STR: [
    { name: 'Force open a stuck door', dc: 15 },
    { name: 'Break free from restraints', dc: 20 },
    { name: 'Push through a strong current', dc: 13 },
    { name: 'Bend iron bars', dc: 25 },
    { name: 'Jump an unusually long distance', dc: 15 },
  ],
  DEX: [
    { name: 'Pick a simple lock', dc: 10 },
    { name: 'Pick a complex lock', dc: 20 },
    { name: 'Disarm a trap', dc: 15 },
    { name: 'Walk a narrow ledge', dc: 10 },
    { name: 'Escape from tight ropes', dc: 15 },
    { name: 'Pick a pocket', dc: 15 },
  ],
  CON: [
    { name: 'Forced march', dc: 10 },
    { name: 'Hold breath beyond normal', dc: 13 },
    { name: 'Resist effects of alcohol', dc: 10 },
    { name: 'Win an eating contest', dc: 15 },
  ],
  INT: [
    { name: 'Recall lore about a monster', dc: 10 },
    { name: 'Decipher ancient writing', dc: 15 },
    { name: 'Recall historical event', dc: 13 },
    { name: 'Identify a magical item', dc: 15 },
    { name: 'Solve a complex puzzle', dc: 20 },
  ],
  WIS: [
    { name: 'Spot a hidden creature', dc: 15 },
    { name: 'Track a creature through forest', dc: 15 },
    { name: 'Sense motives (Insight)', dc: 13 },
    { name: 'Navigate without a map', dc: 15 },
    { name: 'Calm a frightened animal', dc: 13 },
    { name: 'Determine if food is poisoned', dc: 15 },
  ],
  CHA: [
    { name: 'Convince a guard to let you pass', dc: 15 },
    { name: 'Intimidate a common thug', dc: 10 },
    { name: 'Bluff through a lie', dc: 15 },
    { name: 'Inspire a crowd', dc: 15 },
    { name: 'Negotiate a better price', dc: 13 },
    { name: 'Disguise yourself convincingly', dc: 15 },
  ],
};

// ---------------------------------------------------------------------------
// HELP ACTION
// ---------------------------------------------------------------------------

export const HELP_ACTION = {
  description: 'You can use the Help action to give advantage to an ally\'s next ability check or attack roll.',
  rules: [
    'Must be within 5 feet of the creature you\'re helping (for attacks).',
    'The advantage applies to the ally\'s next roll before your next turn.',
    'You must be able to reasonably assist with the task.',
  ],
};

// ---------------------------------------------------------------------------
// GROUP CHECKS
// ---------------------------------------------------------------------------

export const GROUP_CHECK_RULES = {
  description: 'When the whole party attempts something together, everyone rolls. If at least half succeed, the group succeeds.',
  examples: ['Stealth through a guarded area', 'Navigate difficult terrain', 'Swim across a river'],
};

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Get common checks for an ability.
 */
export function getCommonChecks(ability) {
  return COMMON_CHECKS[ability.toUpperCase()] || [];
}

/**
 * Calculate ability check modifier.
 */
export function getCheckModifier(abilityScore, profBonus = 0, proficient = false, expertise = false) {
  const abilityMod = Math.floor((abilityScore - 10) / 2);
  const profMult = expertise ? 2 : (proficient ? 1 : 0);
  return abilityMod + Math.floor(profBonus * profMult);
}
