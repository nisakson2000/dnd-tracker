/**
 * playerEncounterTactics.js
 * Player Mode: Tactical approaches for different encounter types
 * Pure JS — no React dependencies.
 */

export const ENCOUNTER_TYPES = [
  {
    type: 'Boss + Minions',
    description: 'One powerful creature with weaker allies.',
    tactics: [
      'Option A: Kill minions first to reduce incoming damage, then focus boss.',
      'Option B: Ignore minions, burn the boss fast. Minions often flee when boss dies.',
      'Use AoE on minion clusters while single-target DPS hits the boss.',
      'Control spells on the boss (Hold Monster, Banishment) while clearing adds.',
    ],
    priority: 'Usually focus the boss unless minions are healing/buffing it.',
  },
  {
    type: 'Many Weak Enemies',
    description: 'Large group of low-CR creatures.',
    tactics: [
      'AoE is king: Fireball, Spirit Guardians, Shatter.',
      'Chokepoint formation — don\'t let them surround you.',
      'Hypnotic Pattern or Sleep to disable large groups.',
      'Turn Undead if they\'re undead.',
    ],
    priority: 'AoE spells, then focused attacks on survivors.',
  },
  {
    type: 'Single Powerful Enemy',
    description: 'One high-CR creature, no minions.',
    tactics: [
      'Burn Legendary Resistances with cheap spells first.',
      'Focus fire — every point of damage counts.',
      'Spread out to avoid AoE (breath weapons, etc.).',
      'Haste the primary damage dealer.',
      'Keep concentration on your best debuff.',
    ],
    priority: 'Maximize DPR. Action economy is your advantage — use it.',
  },
  {
    type: 'Enemy Spellcaster',
    description: 'Creature with dangerous spells.',
    tactics: [
      'Counterspell is your best friend.',
      'Rush the caster — melee forces concentration checks.',
      'Silence (2nd level) in a 20ft radius = no verbal component spells.',
      'Grapple the caster to prevent movement and spellcasting.',
    ],
    priority: 'Neutralize the caster ASAP. They\'re usually squishy.',
  },
  {
    type: 'Ambush / Surprise',
    description: 'You\'re ambushed or you ambush enemies.',
    tactics: [
      'If surprised: Dodge on first available turn, regroup, heal.',
      'If ambushing: Nova on first round. All resources, maximum damage.',
      'Assassin Rogue: auto-crit on surprised creatures = devastating.',
      'Alert feat prevents surprise — critical for scouts.',
    ],
    priority: 'First round is everything. Act decisively.',
  },
  {
    type: 'Environmental / Hazard Fight',
    description: 'Terrain is as dangerous as the enemies.',
    tactics: [
      'Fly, Levitate, or Spider Climb to avoid ground hazards.',
      'Use the environment against enemies (push into lava, off cliffs).',
      'Create your own terrain: Wall of Stone, Web, Plant Growth.',
      'Don\'t cluster — environmental AoE hits everyone.',
    ],
    priority: 'Positioning matters more than damage. Control the space.',
  },
];

export function getEncounterTactics(type) {
  return ENCOUNTER_TYPES.find(e => e.type.toLowerCase().includes((type || '').toLowerCase())) || null;
}

export function suggestTacticsForEncounter(enemyCount, hasCaster, hasBoss) {
  if (hasBoss && enemyCount > 1) return getEncounterTactics('Boss + Minions');
  if (hasBoss || enemyCount === 1) return getEncounterTactics('Single Powerful Enemy');
  if (hasCaster) return getEncounterTactics('Enemy Spellcaster');
  if (enemyCount >= 5) return getEncounterTactics('Many Weak Enemies');
  return getEncounterTactics('Single Powerful Enemy');
}
