/**
 * playerSkillContests.js
 * Player Mode: Contested checks, group checks, and passive score rules
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// CONTESTED CHECKS
// ---------------------------------------------------------------------------

export const CONTESTED_CHECKS = [
  { name: 'Grapple', attacker: 'Athletics', defender: 'Athletics or Acrobatics (defender chooses)' },
  { name: 'Shove', attacker: 'Athletics', defender: 'Athletics or Acrobatics (defender chooses)' },
  { name: 'Hide vs. Spot', attacker: 'Stealth', defender: 'Perception (passive or active)' },
  { name: 'Deception vs. Insight', attacker: 'Deception', defender: 'Insight' },
  { name: 'Persuasion vs. Will', attacker: 'Persuasion', defender: 'Insight (or flat DC)' },
  { name: 'Intimidation', attacker: 'Intimidation', defender: 'Insight (or flat DC)' },
  { name: 'Sleight of Hand vs. Perception', attacker: 'Sleight of Hand', defender: 'Perception' },
  { name: 'Disguise vs. Investigation', attacker: 'Deception (with disguise kit)', defender: 'Investigation or Perception' },
  { name: 'Stealth vs. Passive Perception', attacker: 'Stealth', defender: 'Passive Perception' },
];

// ---------------------------------------------------------------------------
// GROUP CHECK RULES
// ---------------------------------------------------------------------------

export const GROUP_CHECK_RULES = {
  description: 'When a group attempts something together, the DM may call for a group check.',
  rule: 'Everyone makes the check. If at least half succeed, the group succeeds.',
  commonUses: [
    'Group Stealth (sneaking past guards)',
    'Group Survival (navigating wilderness)',
    'Group Athletics (climbing a cliff)',
    'Group Perception (searching a room)',
  ],
};

// ---------------------------------------------------------------------------
// ADVANTAGE/DISADVANTAGE RULES
// ---------------------------------------------------------------------------

export const ADVANTAGE_RULES = {
  advantage: {
    description: 'Roll 2d20, take the higher result.',
    sources: [
      'Attacking a prone target from within 5ft',
      'Attacking an unseen target (you are hidden/invisible)',
      'Pack Tactics (allies within 5ft of target)',
      'Reckless Attack (Barbarian)',
      'Faerie Fire, Guiding Bolt (until next hit)',
      'True Strike (next turn)',
      'Help action',
      'Flanking (optional rule)',
    ],
  },
  disadvantage: {
    description: 'Roll 2d20, take the lower result.',
    sources: [
      'Attacking a prone target from more than 5ft away',
      'Attacking while blinded, frightened, or restrained',
      'Long range attacks',
      'Attacking while prone',
      'Nearby hostile creature (ranged attack)',
      'Dodge action by target',
      'Exhaustion level 3+',
    ],
  },
  stacking: 'Advantage and disadvantage do NOT stack. If you have both (any number), they cancel out — roll normally.',
};

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Resolve a contested check.
 */
export function resolveContest(attackerRoll, defenderRoll) {
  if (attackerRoll > defenderRoll) return { winner: 'attacker', tie: false };
  if (defenderRoll > attackerRoll) return { winner: 'defender', tie: false };
  return { winner: 'defender', tie: true, note: 'Ties go to the defender (status quo).' };
}

/**
 * Resolve a group check.
 */
export function resolveGroupCheck(results) {
  const successes = results.filter(r => r.success).length;
  return {
    groupSuccess: successes >= Math.ceil(results.length / 2),
    successes,
    failures: results.length - successes,
    total: results.length,
  };
}

/**
 * Calculate passive score.
 */
export function getPassiveScore(abilityMod, profBonus, isProficient, hasAdvantage = false, hasDisadvantage = false) {
  let score = 10 + abilityMod + (isProficient ? profBonus : 0);
  if (hasAdvantage && !hasDisadvantage) score += 5;
  if (hasDisadvantage && !hasAdvantage) score -= 5;
  return score;
}
