/**
 * Monster AI Behavior Engine — Phase 9A
 *
 * Defines behavior profiles per creature type and boss phase systems.
 */

// ── Creature behavior profiles ──
export const BEHAVIOR_PROFILES = {
  pack: {
    label: 'Pack Hunter',
    description: 'Coordinate attacks, flank, focus weakened targets.',
    examples: 'Wolves, Gnolls, Kobolds, Velociraptors',
    tactics: [
      'Surround isolated targets for Pack Tactics advantage',
      'Focus fire on weakened prey (lowest HP)',
      'Retreat to regroup if alpha is killed',
      'Howl/signal to call reinforcements when outnumbered',
    ],
    fleeCondition: 'Alpha killed or pack reduced to 1-2 members',
    targetPriority: 'isolated_or_weakest',
  },
  ambush: {
    label: 'Ambush Predator',
    description: 'Surprise round priority, hit-and-run, retreat to re-ambush.',
    examples: 'Displacer Beast, Phase Spider, Assassin, Mimic',
    tactics: [
      'Open with surprise attack from hiding for advantage',
      'Hit the most vulnerable target, then disengage',
      'Use Stealth/Hide as bonus action to set up next ambush',
      'Target isolated scouts or rear-guard party members',
    ],
    fleeCondition: 'Ambush fails or HP drops below 40%',
    targetPriority: 'isolated_or_squishiest',
  },
  territorial: {
    label: 'Territorial Guardian',
    description: 'Fight near lair, pursue to boundary then return.',
    examples: 'Owlbear, Troll, Young Dragon, Treant',
    tactics: [
      'Roar/display to warn intruders before attacking',
      'Fight aggressively near lair entrance',
      'Pursue fleeing intruders only to territory boundary',
      'Protect eggs/young/treasure above all else',
    ],
    fleeCondition: 'Intruders leave territory, or HP below 20% near lair exit',
    targetPriority: 'nearest_to_lair',
  },
  mindless: {
    label: 'Mindless',
    description: 'Attack nearest, ignore tactics, never retreat.',
    examples: 'Zombies, Skeletons, Oozes, Animated Objects',
    tactics: [
      'Move toward nearest living creature and attack',
      'Cannot be frightened or demoralized',
      'Ignore terrain hazards (walk through fire, off cliffs)',
      'Continue attacking same target until it stops moving',
    ],
    fleeCondition: 'Never — fights until destroyed',
    targetPriority: 'nearest',
  },
  intelligent: {
    label: 'Intelligent Combatant',
    description: 'Full tactical AI — uses terrain, targets casters, coordinates.',
    examples: 'Mind Flayer, Lich, Vampire, Adult Dragon, Drow',
    tactics: [
      'Target spellcasters and healers first',
      'Use terrain for cover and elevation advantage',
      'Coordinate with allies — flanking, focus fire',
      'Use battlefield control spells/abilities to split party',
      'Ready actions to counter specific party strategies',
      'Retreat tactically if losing, return with reinforcements',
    ],
    fleeCondition: 'When continuation would mean certain death with no benefit',
    targetPriority: 'optimal_tactical',
  },
  swarm: {
    label: 'Swarm',
    description: 'Overwhelm with numbers, occupy space, auto-damage.',
    examples: 'Swarm of Insects, Swarm of Rats, Stirges',
    tactics: [
      'Engulf/surround a single target',
      'Resist single-target attacks (half damage)',
      'Vulnerable to area effects — scatter if hit by AOE',
      'Reform swarm around new target if current one is protected',
    ],
    fleeCondition: 'Reduced below half HP or hit by fire/AOE',
    targetPriority: 'least_armored',
  },
  boss: {
    label: 'Boss Monster',
    description: 'Phase-based behavior with legendary and lair actions.',
    examples: 'Ancient Dragon, Beholder, Tarrasque, BBEG',
    tactics: [
      'Phase 1 (100-66% HP): Standard attacks + legendary actions, test party capabilities',
      'Phase 2 (66-33% HP): New abilities unlock, target healers, use lair actions aggressively',
      'Phase 3 (33-0% HP): Desperate mode — all abilities, lair actions intensify, may offer parley',
      'Use legendary resistances to ignore save-or-suck spells',
      'Lair actions on initiative count 20 (losing ties)',
      'Legendary actions between turns to maintain pressure',
    ],
    fleeCondition: 'Only if escape guarantees survival and revenge',
    targetPriority: 'phase_dependent',
  },
};

/**
 * Get boss phase based on HP percentage.
 */
export function getBossPhase(hpCurrent, hpMax) {
  const percent = hpMax > 0 ? hpCurrent / hpMax : 1;
  if (percent > 0.66) return { phase: 1, label: 'Phase 1 — Testing', color: '#22c55e', description: 'Standard attacks, probing party capabilities' };
  if (percent > 0.33) return { phase: 2, label: 'Phase 2 — Escalation', color: '#f59e0b', description: 'New abilities, aggressive tactics, targets healers' };
  return { phase: 3, label: 'Phase 3 — Desperate', color: '#ef4444', description: 'All abilities active, lair intensifies, fight or die' };
}

/**
 * Get environmental behavior suggestions for creature type.
 */
export function getEnvironmentalBehavior(creatureType) {
  const ENVIRONMENTAL = {
    aquatic: [
      'Pull targets underwater (grapple + drag)',
      'Use deep water to escape melee range',
      'Create whirlpool/current to scatter party',
      'Attack from below — targets have disadvantage on Perception in water',
    ],
    flying: [
      'Stay above melee range (fly-by attacks)',
      'Dive attack — bonus damage from height',
      'Knock prone targets from height for fall damage',
      'Use wind/wings to push back ground targets',
    ],
    burrowing: [
      'Ambush from underground — surprise attack',
      'Burrow away to reposition after attacking',
      'Collapse tunnel behind to prevent pursuit',
      'Drag grappled targets underground',
    ],
    climbing: [
      'Attack from walls/ceiling for unexpected angles',
      'Web/sticky surfaces to restrict movement',
      'Drop on targets from above',
      'Retreat to high ground when wounded',
    ],
  };

  return ENVIRONMENTAL[creatureType] || [];
}

/**
 * Get all behavior profiles for UI display.
 */
export function getBehaviorProfiles() {
  return Object.entries(BEHAVIOR_PROFILES).map(([id, profile]) => ({
    id,
    ...profile,
  }));
}
