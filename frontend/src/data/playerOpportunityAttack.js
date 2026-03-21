/**
 * playerOpportunityAttack.js
 * Player Mode: Opportunity attack rules, triggers, and exceptions
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// OPPORTUNITY ATTACK RULES
// ---------------------------------------------------------------------------

export const OPPORTUNITY_ATTACK_RULES = {
  trigger: 'A hostile creature you can see moves out of your reach.',
  action: 'Uses your reaction.',
  attackType: 'One melee attack (not a full Attack action).',
  notes: [
    'Triggered by leaving reach, not by being pushed/pulled or teleporting.',
    'The Disengage action prevents opportunity attacks.',
    'You can only make one opportunity attack per round (uses reaction).',
    'Forced movement (shove, Thunderwave, etc.) does NOT trigger.',
    'Teleportation does NOT trigger (Misty Step, Dimension Door, etc.).',
  ],
};

// ---------------------------------------------------------------------------
// EXCEPTIONS & SPECIAL CASES
// ---------------------------------------------------------------------------

export const OA_EXCEPTIONS = [
  { name: 'Disengage', type: 'action', effect: 'Movement doesn\'t provoke opportunity attacks for the rest of the turn.' },
  { name: 'Mobile feat', type: 'feat', effect: 'No OA from creatures you attacked this turn (hit or miss).' },
  { name: 'Sentinel feat', type: 'feat', effect: 'OA reduces speed to 0. Disengage doesn\'t prevent your OA. Reaction attack when ally is attacked.' },
  { name: 'Polearm Master', type: 'feat', effect: 'OA when creature enters your reach (not just leaves).' },
  { name: 'Flyby (monster)', type: 'trait', effect: 'Doesn\'t provoke OA when flying out of reach.' },
  { name: 'Fancy Footwork (Swashbuckler)', type: 'class', effect: 'No OA from creatures you attacked this turn.' },
  { name: 'Escape the Horde (Barbarian)', type: 'class', effect: 'OA against you are made with disadvantage.' },
  { name: 'Soul of Deceit (Monk)', type: 'class', effect: 'Various evasive benefits.' },
];

// ---------------------------------------------------------------------------
// REACH WEAPONS
// ---------------------------------------------------------------------------

export const REACH_WEAPONS = [
  'Glaive', 'Halberd', 'Lance', 'Pike', 'Whip',
  'Bugbear (Long-Limbed)', // racial trait
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Check if an OA would be triggered.
 */
export function wouldTriggerOA(movementType, hasDisengaged, specialTraits = []) {
  if (hasDisengaged) return false;
  if (movementType === 'forced') return false;
  if (movementType === 'teleport') return false;
  if (specialTraits.includes('Mobile') || specialTraits.includes('Fancy Footwork') || specialTraits.includes('Flyby')) {
    return false;
  }
  return movementType === 'voluntary';
}

/**
 * Get applicable OA modifiers for a character.
 */
export function getOAModifiers(feats = [], classFeatures = []) {
  const all = [...feats, ...classFeatures];
  return OA_EXCEPTIONS.filter(ex =>
    all.some(f => f.toLowerCase().includes(ex.name.toLowerCase().split(' ')[0]))
  );
}
