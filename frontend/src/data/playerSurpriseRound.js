/**
 * playerSurpriseRound.js
 * Player Mode: Surprise rules, ambush tactics, and alert features
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// SURPRISE RULES
// ---------------------------------------------------------------------------

export const SURPRISE_RULES = {
  determination: 'DM determines surprise. Compare Stealth (hiding side) vs Passive Perception (other side).',
  effect: 'Surprised creatures can\'t move or take actions on their first turn. No reactions until that turn ends.',
  initiative: 'Everyone still rolls initiative, even surprised creatures.',
  important: [
    'Surprise is NOT an extra round — it\'s a condition on the first round.',
    'A surprised creature can still take reactions AFTER their turn in the first round.',
    'If even one member of a group isn\'t hidden, the entire opposing group might not be surprised.',
    'Group Stealth check: if at least half succeed, the group is stealthy.',
  ],
};

// ---------------------------------------------------------------------------
// FEATURES THAT INTERACT WITH SURPRISE
// ---------------------------------------------------------------------------

export const SURPRISE_FEATURES = [
  { name: 'Alert (feat)', effect: 'Cannot be surprised while conscious. +5 initiative.' },
  { name: 'Assassinate (Rogue 3)', effect: 'Advantage on attack rolls against surprised creatures. Any hit against a surprised creature is a critical hit.' },
  { name: 'Feral Instinct (Barbarian 7)', effect: 'Advantage on initiative. If surprised, can act normally if you rage first.' },
  { name: 'Ambush Master (Ranger: Gloom Stalker 3)', effect: 'First turn: +WIS to initiative. Extra attack during first round that deals +1d8 damage.' },
  { name: 'Gift of the Ever-Living Ones (Warlock)', effect: 'Not directly related but often used in ambush builds.' },
  { name: 'Skulker (feat)', effect: 'Can hide when lightly obscured. Missing ranged attack doesn\'t reveal position. No disadvantage on Perception in dim light.' },
];

// ---------------------------------------------------------------------------
// AMBUSH CHECKLIST
// ---------------------------------------------------------------------------

export const AMBUSH_CHECKLIST = [
  { step: 1, label: 'Find hiding positions', skill: 'Stealth', dc: 'vs target Passive Perception' },
  { step: 2, label: 'Roll group Stealth', skill: 'Stealth', note: 'Half must succeed' },
  { step: 3, label: 'DM determines surprise', skill: null, note: 'Based on Stealth vs Passive Perception' },
  { step: 4, label: 'Roll initiative', skill: null, note: 'Everyone rolls, including surprised creatures' },
  { step: 5, label: 'First round: surprised creatures skip turn', skill: null, note: 'No movement, action, or bonus action' },
  { step: 6, label: 'After a surprised creature\'s turn: they can use reactions', skill: null, note: 'Including opportunity attacks' },
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Determine if a group is surprised.
 */
export function isSurprised(stealthResults, passivePerception) {
  // If ANY sneaker beats the passive perception, the perceiver is surprised
  return stealthResults.some(stealth => stealth >= passivePerception);
}

/**
 * Check if a character has Alert feat or similar.
 */
export function canBeSurprised(features = []) {
  const lower = features.map(f => f.toLowerCase());
  if (lower.some(f => f.includes('alert'))) return false;
  return true;
}
