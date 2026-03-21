/**
 * playerEncounterDifficulty.js
 * Player Mode: Encounter difficulty estimation from player perspective
 * Pure JS — no React dependencies.
 */

export const DIFFICULTY_INDICATORS = [
  {
    difficulty: 'Easy',
    color: '#22c55e',
    signs: [
      'Enemies go down in 1-2 hits.',
      'Party takes minimal damage.',
      'No need for healing during combat.',
      'Low-CR creatures, significantly outnumbered.',
    ],
  },
  {
    difficulty: 'Medium',
    color: '#eab308',
    signs: [
      'Combat lasts 3-4 rounds.',
      'Some resources expended (spell slots, ki, etc.).',
      'Minor healing needed after combat.',
      'Manageable but requires some strategy.',
    ],
  },
  {
    difficulty: 'Hard',
    color: '#f97316',
    signs: [
      'Combat lasts 4-6+ rounds.',
      'Significant resources expended.',
      'Party members drop to low HP.',
      'Requires good tactics and coordination.',
    ],
  },
  {
    difficulty: 'Deadly',
    color: '#ef4444',
    signs: [
      'Real risk of character death.',
      'Multiple party members may go down.',
      'Must use high-level spells and class features.',
      'May need to retreat or get creative.',
    ],
  },
];

export const RETREAT_INDICATORS = [
  'Multiple party members unconscious.',
  'Healer is down or out of slots.',
  'Enemy is clearly much stronger than expected.',
  'No way to damage the enemy (immunities, too high AC).',
  'Environment is becoming deadly (collapsing, flooding, etc.).',
  'Enemy reinforcements arriving.',
];

export const RETREAT_OPTIONS = [
  { method: 'Dash', description: 'Everyone uses Dash action to run. Provokes opportunity attacks.' },
  { method: 'Disengage + Dash', description: 'Disengage to avoid OA, then Dash on next turn.' },
  { method: 'Fog Cloud / Darkness', description: 'Block line of sight, then flee. Enemies can\'t use OA if they can\'t see you.' },
  { method: 'Wall of Force', description: 'Block enemies while party retreats.' },
  { method: 'Teleportation', description: 'Misty Step, Dimension Door, or Teleport to escape instantly.' },
  { method: 'Hypnotic Pattern', description: 'Incapacitate enemies to buy time for escape.' },
];

export function getDifficultyInfo(difficulty) {
  return DIFFICULTY_INDICATORS.find(d => d.difficulty.toLowerCase() === (difficulty || '').toLowerCase()) || null;
}

export function shouldRetreat(partyStatus) {
  const { downMembers, totalMembers, healerDown, avgHPPercent } = partyStatus;
  if (downMembers >= Math.ceil(totalMembers / 2)) return true;
  if (healerDown && avgHPPercent < 30) return true;
  if (avgHPPercent < 15) return true;
  return false;
}
