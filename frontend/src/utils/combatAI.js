/**
 * NPC Combat AI — Phase 6G
 *
 * Generates tactical suggestions for enemy combatants based on
 * their intelligence, personality, and the battlefield situation.
 */

// ── Intelligence Tiers ──
const INTELLIGENCE_TIERS = {
  mindless: { min: 0, max: 2, label: 'Mindless', tactics: 'none' },
  beast: { min: 3, max: 4, label: 'Beast', tactics: 'instinct' },
  low: { min: 5, max: 8, label: 'Low', tactics: 'basic' },
  average: { min: 9, max: 12, label: 'Average', tactics: 'moderate' },
  smart: { min: 13, max: 16, label: 'Smart', tactics: 'advanced' },
  genius: { min: 17, max: 30, label: 'Genius', tactics: 'masterful' },
};

function getIntelligenceTier(intScore) {
  for (const [key, tier] of Object.entries(INTELLIGENCE_TIERS)) {
    if (intScore >= tier.min && intScore <= tier.max) return { key, ...tier };
  }
  return { key: 'average', ...INTELLIGENCE_TIERS.average };
}

// ── Personality combat overlays ──
const PERSONALITY_COMBAT_STYLES = {
  cowardly: {
    label: 'Cowardly',
    fleeThreshold: 0.40,     // Flee at 40% HP
    targetPriority: 'weakest', // Attack weakest to win fast
    useCover: true,
    description: 'Prioritizes self-preservation, attacks weak targets, flees when wounded.',
  },
  aggressive: {
    label: 'Aggressive',
    fleeThreshold: 0.0,       // Never flee
    targetPriority: 'highest_damage',
    useCover: false,
    description: 'Always attacks the biggest threat, never retreats, reckless.',
  },
  cunning: {
    label: 'Cunning',
    fleeThreshold: 0.25,
    targetPriority: 'casters',
    useCover: true,
    description: 'Targets spellcasters, uses terrain and cover, baits reactions.',
  },
  protective: {
    label: 'Protective',
    fleeThreshold: 0.15,
    targetPriority: 'nearest_to_ally',
    useCover: false,
    description: 'Guards allies and leaders, intercepts attacks, bodyguard behavior.',
  },
  chaotic: {
    label: 'Chaotic',
    fleeThreshold: 0.20,
    targetPriority: 'random',
    useCover: false,
    description: 'Unpredictable targeting, random actions, hard to predict.',
  },
  tactical: {
    label: 'Tactical',
    fleeThreshold: 0.20,
    targetPriority: 'optimal',
    useCover: true,
    description: 'Analyzes weaknesses, coordinates with allies, exploits conditions.',
  },
};

/**
 * Analyze the battlefield and suggest an action for a combatant.
 *
 * @param {Object} params
 * @param {Object} params.combatant - The NPC/monster taking their turn
 *   { name, intelligence, hpCurrent, hpMax, ac, conditions, personality,
 *     attacks, spells, speed, isRanged, legendaryActions }
 * @param {Object[]} params.enemies - Party members / hostile targets
 *   [{ name, hpCurrent, hpMax, ac, conditions, class, isConcentrating, spellcaster }]
 * @param {Object[]} params.allies - Friendly combatants
 *   [{ name, hpCurrent, hpMax, isLeader }]
 * @returns {Object} suggestion
 */
export function suggestCombatAction({
  combatant = {},
  enemies = [],
  allies = [],
}) {
  const intScore = combatant.intelligence || 10;
  const tier = getIntelligenceTier(intScore);
  const personality = combatant.personality || 'tactical';
  const style = PERSONALITY_COMBAT_STYLES[personality] || PERSONALITY_COMBAT_STYLES.tactical;
  const hpPercent = combatant.hpMax ? combatant.hpCurrent / combatant.hpMax : 1;

  // Check flee condition
  if (hpPercent <= style.fleeThreshold && style.fleeThreshold > 0) {
    return {
      action: 'flee',
      target: null,
      reasoning: `HP at ${Math.round(hpPercent * 100)}% — below ${style.label.toLowerCase()} flee threshold (${Math.round(style.fleeThreshold * 100)}%).`,
      alternatives: ['Surrender', 'Call for reinforcements', 'Fighting retreat'],
      personality: style.label,
      intelligence: tier.label,
    };
  }

  // Select target based on priority
  const target = selectTarget(enemies, style.targetPriority, tier, combatant);

  // Determine action based on intelligence tier
  let action, movement, bonusAction, reasoning;
  const alternatives = [];

  switch (tier.tactics) {
    case 'none':
    case 'instinct':
      // Mindless/beast: attack nearest
      action = `Attack ${target.name}`;
      movement = 'Move toward nearest enemy';
      bonusAction = null;
      reasoning = `${tier.label} intelligence — attacks nearest visible target.`;
      break;

    case 'basic':
      // Low: focus weakest, basic self-preservation
      action = `Attack ${target.name} (${target.reason})`;
      movement = style.useCover ? 'Move to half-cover if available' : `Move toward ${target.name}`;
      bonusAction = combatant.bonusActions?.[0] || null;
      reasoning = `Targets ${target.reason}. ${style.description}`;
      alternatives.push('Attack nearest target instead');
      break;

    case 'moderate':
      // Average: coordinate, use terrain
      action = buildModerateAction(combatant, target, enemies, style);
      movement = buildMovement(combatant, target, style, enemies);
      bonusAction = suggestBonusAction(combatant, target);
      reasoning = `${tier.label} intelligence with ${style.label.toLowerCase()} personality. ${target.reason}.`;
      alternatives.push('Focus fire on same target as allies');
      if (combatant.spells?.length) alternatives.push('Cast a spell instead');
      break;

    case 'advanced':
    case 'masterful':
      // Smart/genius: exploit weaknesses, predict player strategies
      action = buildAdvancedAction(combatant, target, enemies, allies, style, tier);
      movement = buildMovement(combatant, target, style, enemies);
      bonusAction = suggestBonusAction(combatant, target);
      reasoning = buildAdvancedReasoning(combatant, target, enemies, style, tier);
      alternatives.push('Ready an action for when a caster begins casting');
      alternatives.push('Use environment to gain advantage');
      if (enemies.some(e => e.isConcentrating)) {
        alternatives.push(`Break ${enemies.find(e => e.isConcentrating).name}'s concentration`);
      }
      break;

    default:
      action = `Attack ${target.name}`;
      reasoning = 'Default behavior.';
  }

  return {
    action,
    movement,
    bonusAction,
    target: target.name,
    reasoning,
    alternatives,
    personality: style.label,
    intelligence: tier.label,
    hpPercent: Math.round(hpPercent * 100),
    morale: calculateMorale(combatant, allies, enemies),
  };
}

function selectTarget(enemies, priority, tier, combatant) {
  if (!enemies.length) return { name: 'no target', reason: 'no enemies visible' };

  const alive = enemies.filter(e => (e.hpCurrent || 0) > 0);
  if (!alive.length) return { name: 'no target', reason: 'all enemies down' };

  switch (priority) {
    case 'weakest': {
      const sorted = [...alive].sort((a, b) => (a.hpCurrent / (a.hpMax || 1)) - (b.hpCurrent / (b.hpMax || 1)));
      return { name: sorted[0].name, reason: `lowest HP (${sorted[0].hpCurrent}/${sorted[0].hpMax})` };
    }
    case 'highest_damage': {
      // Rough proxy: martial classes deal most damage
      const damageClasses = ['fighter', 'barbarian', 'paladin', 'ranger', 'rogue'];
      const highDamage = alive.find(e => damageClasses.includes((e.class || '').toLowerCase()));
      if (highDamage) return { name: highDamage.name, reason: `highest damage dealer (${highDamage.class})` };
      return { name: alive[0].name, reason: 'highest perceived threat' };
    }
    case 'casters': {
      const casterClasses = ['wizard', 'sorcerer', 'warlock', 'cleric', 'druid', 'bard'];
      const caster = alive.find(e => e.spellcaster || casterClasses.includes((e.class || '').toLowerCase()));
      if (caster) return { name: caster.name, reason: `spellcaster (${caster.class || 'caster'})` };
      return { name: alive[0].name, reason: 'no casters found — attacking nearest' };
    }
    case 'nearest_to_ally': {
      // Simplified — just target whoever is most threatening
      return { name: alive[0].name, reason: 'nearest threat to protected ally' };
    }
    case 'random': {
      const idx = Math.floor(Math.random() * alive.length);
      return { name: alive[idx].name, reason: 'random target (chaotic behavior)' };
    }
    case 'optimal': {
      // Smart targeting: low AC + low HP = best target
      const scored = alive.map(e => ({
        ...e,
        score: (e.hpMax ? (1 - e.hpCurrent / e.hpMax) : 0) + (20 - (e.ac || 10)) / 20,
      }));
      scored.sort((a, b) => b.score - a.score);
      return { name: scored[0].name, reason: `optimal target (low AC ${scored[0].ac}, ${Math.round((scored[0].hpCurrent / (scored[0].hpMax || 1)) * 100)}% HP)` };
    }
    default:
      return { name: alive[0].name, reason: 'default targeting' };
  }
}

function buildModerateAction(combatant, target, enemies, style) {
  // Check for concentration targets
  const concentrating = enemies.find(e => e.isConcentrating);
  if (concentrating && style.targetPriority === 'casters') {
    return `Attack ${concentrating.name} to break concentration`;
  }
  return `Attack ${target.name}`;
}

function buildAdvancedAction(combatant, target, enemies, allies, style, tier) {
  // Check for concentration targets first
  const concentrating = enemies.find(e => e.isConcentrating);
  if (concentrating) {
    return `Attack ${concentrating.name} to break concentration on their spell`;
  }

  // Check if any enemy has a condition we can exploit
  const conditioned = enemies.find(e => e.conditions?.includes('prone') || e.conditions?.includes('restrained'));
  if (conditioned) {
    return `Attack ${conditioned.name} (${conditioned.conditions.join(', ')} — advantage on melee attacks)`;
  }

  // Use spells if available
  if (combatant.spells?.length && tier.tactics === 'masterful') {
    const grouped = enemies.filter(e => (e.hpCurrent || 0) > 0);
    if (grouped.length >= 3) {
      return `Cast area spell targeting cluster of ${grouped.length} enemies`;
    }
  }

  return `Attack ${target.name} (${target.reason})`;
}

function buildMovement(combatant, target, style, enemies) {
  if (style.useCover) {
    return `Move to half-cover, then attack ${target.name}`;
  }
  if (combatant.isRanged) {
    return `Maintain distance (30+ ft), attack ${target.name}`;
  }
  return `Move into melee range with ${target.name}`;
}

function buildAdvancedReasoning(combatant, target, enemies, style, tier) {
  const parts = [`INT ${combatant.intelligence} (${tier.label})`];
  parts.push(`${style.label} combat style`);
  parts.push(`Target: ${target.name} — ${target.reason}`);

  const concentrating = enemies.find(e => e.isConcentrating);
  if (concentrating) {
    parts.push(`Priority: break ${concentrating.name}'s concentration`);
  }

  return parts.join('. ') + '.';
}

function suggestBonusAction(combatant, target) {
  if (combatant.bonusActions?.length) return combatant.bonusActions[0];
  return null;
}

function calculateMorale(combatant, allies, enemies) {
  const hpPercent = combatant.hpMax ? (combatant.hpCurrent / combatant.hpMax) * 100 : 100;
  const allyCount = allies.filter(a => (a.hpCurrent || 0) > 0).length;
  const enemyCount = enemies.filter(e => (e.hpCurrent || 0) > 0).length;
  const fearCourage = combatant.fearCourage || 50;

  let morale = fearCourage;
  morale += (hpPercent - 50) * 0.5; // HP affects morale
  morale += (allyCount - enemyCount) * 5; // Outnumbered = lower morale
  if (combatant.conditions?.includes('frightened')) morale -= 20;

  return Math.max(0, Math.min(100, Math.round(morale)));
}

/**
 * Get the personality combat styles for UI selection.
 */
export function getCombatStyles() {
  return Object.entries(PERSONALITY_COMBAT_STYLES).map(([id, style]) => ({
    id,
    ...style,
  }));
}

/**
 * Get intelligence tier info for a score.
 */
export function getIntelligenceInfo(intScore) {
  return getIntelligenceTier(intScore);
}
