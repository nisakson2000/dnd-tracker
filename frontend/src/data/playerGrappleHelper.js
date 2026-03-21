/**
 * playerGrappleHelper.js
 * Player Mode: Detailed grapple and shove rules and state tracking
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// GRAPPLE RULES
// ---------------------------------------------------------------------------

export const GRAPPLE_RULES = {
  action: 'Replaces one attack (part of the Attack action).',
  contest: 'Your Athletics vs target\'s Athletics or Acrobatics (target chooses).',
  requirements: [
    'Target must be no more than one size larger than you.',
    'You must have a free hand.',
    'You cannot be incapacitated.',
  ],
  effects: [
    'On success: target\'s speed becomes 0.',
    'You can move the grappled creature with you at half speed.',
    'The grapple ends if you are incapacitated.',
    'The grapple ends if the target is forced out of your reach.',
  ],
  escaping: {
    action: 'Use an action to make an Athletics or Acrobatics check vs your Athletics.',
    note: 'The grappled creature can also attack you normally.',
  },
};

// ---------------------------------------------------------------------------
// SHOVE RULES
// ---------------------------------------------------------------------------

export const SHOVE_RULES = {
  action: 'Replaces one attack (part of the Attack action).',
  contest: 'Your Athletics vs target\'s Athletics or Acrobatics (target chooses).',
  requirements: [
    'Target must be no more than one size larger than you.',
  ],
  options: [
    { id: 'prone', label: 'Knock Prone', effect: 'Target falls prone (advantage on melee attacks within 5ft, disadvantage on ranged).' },
    { id: 'push', label: 'Push Away', effect: 'Push the target 5 feet away from you.' },
  ],
};

// ---------------------------------------------------------------------------
// GRAPPLE + SHOVE COMBO
// ---------------------------------------------------------------------------

export const GRAPPLE_TACTICS = [
  {
    name: 'Grapple + Shove Prone',
    description: 'Grapple first, then shove prone. Target can\'t stand up (speed 0 from grapple), giving you advantage on melee attacks.',
    requirements: 'Extra Attack or Action Surge',
  },
  {
    name: 'Grapple + Drag',
    description: 'Grapple and drag the target into hazardous terrain (lava, off a cliff, into an ally\'s Spirit Guardians).',
    requirements: 'Sufficient movement (half speed while grappling)',
  },
  {
    name: 'Shield Master + Shove',
    description: 'Use Shield Master feat to shove as a bonus action after the Attack action. Knock prone then attack with advantage.',
    requirements: 'Shield Master feat, wielding a shield',
  },
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Check if a creature can be grappled.
 */
export function canGrapple(grappler, target) {
  const sizeOrder = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
  const grapplerIdx = sizeOrder.indexOf(grappler.size || 'Medium');
  const targetIdx = sizeOrder.indexOf(target.size || 'Medium');
  return targetIdx <= grapplerIdx + 1; // Can grapple up to one size larger
}

/**
 * Get Athletics modifier.
 */
export function getAthleticsBonus(strScore, profBonus, isProficient) {
  const strMod = Math.floor((strScore - 10) / 2);
  return strMod + (isProficient ? profBonus : 0);
}
