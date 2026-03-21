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

  // Check flee condition — Smart+ creatures also flee when fight is unwinnable (item 12)
  const aliveAllies = allies.filter(a => (a.hpCurrent || 0) > 0);
  const aliveEnemies = enemies.filter(e => (e.hpCurrent || 0) > 0);
  const outnumberedBadly = aliveEnemies.length >= (aliveAllies.length + 1) * 2;
  const smartRetreat = (tier.tactics === 'advanced' || tier.tactics === 'masterful') && outnumberedBadly && hpPercent < 0.5;

  if ((hpPercent <= style.fleeThreshold && style.fleeThreshold > 0) || smartRetreat) {
    const fleeActions = ['Surrender', 'Fighting retreat (Disengage + Dash)'];
    if (tier.tactics === 'advanced' || tier.tactics === 'masterful') {
      fleeActions.push('Call for reinforcements before retreating');
      fleeActions.push('Leave a trap or obstacle to slow pursuit');
      fleeActions.push('Bargain for their life — offer information');
    }
    return {
      action: smartRetreat ? 'tactical_retreat' : 'flee',
      target: null,
      reasoning: smartRetreat
        ? `INT ${intScore} (${tier.label}) — fight is unwinnable (outnumbered ${aliveEnemies.length} to ${aliveAllies.length + 1}, ${Math.round(hpPercent * 100)}% HP). Smart creatures retreat to fight another day.`
        : `HP at ${Math.round(hpPercent * 100)}% — below ${style.label.toLowerCase()} flee threshold (${Math.round(style.fleeThreshold * 100)}%).`,
      alternatives: fleeActions,
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
  const alive = enemies.filter(e => (e.hpCurrent || 0) > 0);

  // --- Genius: Counterspell / Ready action against casters ---
  if (tier.tactics === 'masterful' && combatant.spells?.some(s => s.name?.toLowerCase() === 'counterspell')) {
    const caster = alive.find(e => e.spellcaster);
    if (caster) {
      return `Ready Counterspell — wait for ${caster.name} to cast, then counter it`;
    }
  }

  // --- Break concentration (priority for Smart+) ---
  const concentrating = alive.find(e => e.isConcentrating);
  if (concentrating) {
    return `Attack ${concentrating.name} to break concentration on their spell`;
  }

  // --- Exploit conditions (advantage attacks) ---
  const conditioned = alive.find(e =>
    e.conditions?.includes('prone') || e.conditions?.includes('restrained') ||
    e.conditions?.includes('stunned') || e.conditions?.includes('paralyzed')
  );
  if (conditioned) {
    const conds = conditioned.conditions.filter(c => ['prone', 'restrained', 'stunned', 'paralyzed'].includes(c));
    return `Attack ${conditioned.name} (${conds.join(', ')} — advantage on attacks${conds.includes('paralyzed') ? ', auto-crit in melee!' : ''})`;
  }

  // --- Target backline / formation breaking (Smart+, item 16) ---
  if (tier.tactics === 'masterful' || tier.tactics === 'advanced') {
    const backline = alive.filter(e => e.spellcaster || ['wizard', 'sorcerer', 'cleric', 'bard'].includes((e.class || '').toLowerCase()));
    if (backline.length > 0 && !combatant.isRanged) {
      return `Dash past frontline to attack ${backline[0].name} (break formation — target backline caster)`;
    }
  }

  // --- Adapt mid-fight: switch targets after repeated misses (item 15) ---
  if (combatant.missCount >= 2 && alive.length > 1) {
    const easiest = [...alive].sort((a, b) => (a.ac || 10) - (b.ac || 10))[0];
    if (easiest.name !== target.name) {
      return `Switch to ${easiest.name} (AC ${easiest.ac}) — previous target too hard to hit`;
    }
  }

  // --- Multi-monster coordination: pack tactics (item 11) ---
  if (allies.length >= 1 && combatant.creatureType?.toLowerCase() === 'wolf') {
    return `Attack ${target.name} with Pack Tactics (advantage — ally adjacent)`;
  }

  // --- AoE when 3+ enemies grouped ---
  if (combatant.spells?.length && tier.tactics === 'masterful') {
    if (alive.length >= 3) {
      return `Cast area spell targeting cluster of ${alive.length} enemies`;
    }
  }

  // --- Call for reinforcements when losing (item 14) ---
  const aliveAllies = allies.filter(a => (a.hpCurrent || 0) > 0);
  if (aliveAllies.length <= 1 && alive.length >= 3 && combatant.canCallReinforcements) {
    return `Call for reinforcements! (outnumbered ${alive.length} to ${aliveAllies.length + 1})`;
  }

  return `Attack ${target.name} (${target.reason})`;
}

function buildMovement(combatant, target, style, enemies) {
  // Ranged: kite at max range
  if (combatant.isRanged) {
    if (style.useCover) return `Move to cover at 30+ ft range, attack ${target.name}`;
    return `Maintain distance (30+ ft), attack ${target.name}`;
  }
  // Melee: close and engage
  if (style.useCover) {
    return `Move to half-cover near ${target.name}, then attack`;
  }
  // Hit-and-run: move in, attack, move out (with Disengage if available)
  if (combatant.speed >= 40 && style.label === 'Cunning') {
    return `Hit-and-run: move in, attack ${target.name}, then Disengage and move to safety`;
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
 * Suggest environmental actions based on location type (item 10).
 * @param {string} environment — 'dungeon', 'tavern', 'forest', 'cave', 'ship', 'tower', 'bridge', etc.
 * @param {string} tierKey — intelligence tier key
 * @returns {string[]} possible environment interactions
 */
export function suggestEnvironmentActions(environment = 'generic', tierKey = 'average') {
  if (tierKey === 'mindless' || tierKey === 'beast') return [];

  const ENV_ACTIONS = {
    dungeon: ['Kick over brazier (fire damage)', 'Collapse unstable ceiling section', 'Push enemy into pit trap', 'Slam and bar a door'],
    tavern: ['Throw a chair/table', 'Smash a lantern (fire)', 'Shove enemy into the hearth', 'Flip table for cover'],
    forest: ['Push enemy into thorns (1d4 piercing)', 'Knock down dead tree on target', 'Use thick trunk as cover', 'Start a fire to create smoke screen'],
    cave: ['Collapse stalactites on enemies', 'Push enemy off ledge', 'Douse torches for darkness', 'Cave-in to block passage'],
    ship: ['Cut rigging to drop sail on enemies', 'Push enemy overboard', 'Swing on rope to flank', 'Tip a cannon'],
    tower: ['Push enemy down stairs', 'Drop heavy object from above', 'Block stairwell', 'Kick out supports'],
    bridge: ['Push enemy off edge', 'Cut rope supports', 'Block passage on narrow bridge', 'Shake bridge to knock prone'],
    generic: ['Use terrain for cover', 'Kick debris at enemy (improvised weapon)', 'Destroy light source', 'Block a doorway or chokepoint'],
  };

  return ENV_ACTIONS[environment] || ENV_ACTIONS.generic;
}

/**
 * Suggest multi-monster coordination tactics (item 11).
 * @param {Object} combatant
 * @param {Object[]} allies — same-side combatants
 * @param {Object} target
 * @returns {string|null}
 */
export function suggestCoordination(combatant, allies = [], target) {
  const aliveAllies = allies.filter(a => (a.hpCurrent || 0) > 0);
  if (aliveAllies.length === 0) return null;

  const type = (combatant.creatureType || '').toLowerCase();
  const tactics = [];

  // Pack tactics (wolves, etc.)
  if (type === 'wolf' || type === 'dire wolf' || combatant.packTactics) {
    tactics.push(`Pack Tactics: attack with advantage (ally adjacent to ${target?.name || 'target'})`);
  }

  // Flanking (if 2+ melee allies)
  const meleeAllies = aliveAllies.filter(a => !a.isRanged);
  if (meleeAllies.length >= 1) {
    tactics.push(`Coordinate flanking with ${meleeAllies[0].name} for advantage`);
  }

  // Grapple + Attack combo
  if (aliveAllies.length >= 1) {
    tactics.push(`One ally grapples ${target?.name || 'target'}, others attack with advantage`);
  }

  // Surround to prevent escape
  if (aliveAllies.length >= 2) {
    tactics.push(`Surround ${target?.name || 'target'} to cut off Disengage escape`);
  }

  return tactics.length > 0 ? tactics[Math.floor(Math.random() * tactics.length)] : null;
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

// ════════════════════════════════════════════════════════════════
// COMBAT AI SPELL SELECTION — Intelligence-based spell usage
// ════════════════════════════════════════════════════════════════

/**
 * Suggest the best spell for a combatant to cast based on their intelligence tier,
 * available spells/slots, and the current battlefield situation.
 *
 * @param {Object} options
 * @param {Object} options.combatant — { name, intelligence, spells: [{name, level, school, tags, aoe, damage, healing, condition, concentration}], spellSlots: {1: 3, 2: 1, ...}, isConcentrating }
 * @param {Array} options.enemies — alive enemies with { name, hpCurrent, hpMax, ac, conditions, isConcentrating }
 * @param {Array} options.allies — alive allies with { name, hpCurrent, hpMax, conditions }
 * @returns {Object|null} { spell, slotLevel, reasoning, targets } or null if no spell recommended
 */
export function suggestSpellAction({ combatant = {}, enemies = [], allies = [] }) {
  const intScore = combatant.intelligence || 10;
  const tier = getIntelligenceTier(intScore);
  const spells = combatant.spells || [];
  const slots = combatant.spellSlots || {};

  if (!spells.length) return null;

  // Get available spells (have a slot or cantrip)
  const cantrips = spells.filter(s => s.level === 0);
  const slotted = spells.filter(s => s.level > 0 && slots[s.level] > 0);
  const available = [...cantrips, ...slotted];

  if (!available.length) {
    // Only cantrips left
    if (cantrips.length) {
      const best = pickBestCantrip(cantrips, enemies, tier);
      return best ? { spell: best, slotLevel: 0, reasoning: 'No spell slots remaining — using cantrip.', targets: [enemies[0]?.name] } : null;
    }
    return null;
  }

  const aliveEnemies = enemies.filter(e => (e.hpCurrent || 0) > 0);
  const woundedAllies = allies.filter(a => a.hpMax && (a.hpCurrent / a.hpMax) < 0.4);

  // ── Tier-based spell selection ──

  if (tier.key === 'mindless' || tier.key === 'beast') {
    // Mindless/Beast: only innate abilities (cantrips or level 1 damage)
    const dmgCantrip = cantrips.find(s => s.damage);
    if (dmgCantrip) return { spell: dmgCantrip, slotLevel: 0, reasoning: 'Instinct — uses innate attack.', targets: [aliveEnemies[0]?.name] };
    return null;
  }

  if (tier.key === 'low') {
    // Low intelligence: simple damage spells, no tactics
    const dmgSpell = slotted.find(s => s.tags?.includes('damage') && s.level <= 2) || cantrips.find(s => s.damage);
    if (dmgSpell) {
      return {
        spell: dmgSpell,
        slotLevel: dmgSpell.level,
        reasoning: 'Low intelligence — picks first available damage spell.',
        targets: [aliveEnemies[0]?.name],
      };
    }
    return null;
  }

  if (tier.key === 'average') {
    // Average: match spell to situation
    // Heal ally if someone is badly hurt
    if (woundedAllies.length > 0) {
      const heal = slotted.find(s => s.tags?.includes('healing'));
      if (heal) {
        const target = woundedAllies.sort((a, b) => (a.hpCurrent / a.hpMax) - (b.hpCurrent / b.hpMax))[0];
        return {
          spell: heal,
          slotLevel: heal.level,
          reasoning: `${target.name} is at ${Math.round((target.hpCurrent / target.hpMax) * 100)}% HP — casting healing spell.`,
          targets: [target.name],
        };
      }
    }

    // AoE if 3+ enemies grouped
    if (aliveEnemies.length >= 3) {
      const aoe = slotted.find(s => s.tags?.includes('aoe') && s.tags?.includes('damage'));
      if (aoe) {
        return {
          spell: aoe,
          slotLevel: aoe.level,
          reasoning: `${aliveEnemies.length} enemies — area spell for maximum damage.`,
          targets: aliveEnemies.map(e => e.name),
        };
      }
    }

    // Default to single-target damage
    const dmg = slotted.find(s => s.tags?.includes('damage')) || cantrips.find(s => s.damage);
    if (dmg) return { spell: dmg, slotLevel: dmg.level, reasoning: 'Standard damage spell.', targets: [aliveEnemies[0]?.name] };
    return null;
  }

  // ── Smart / Genius tier ──
  // Priority: Counterspell > Break concentration > Control > AoE > Heal ally > Buff > Single damage

  // 1. If enemy just cast, suggest Counterspell (Genius only)
  if (tier.key === 'genius') {
    const counterspell = available.find(s => s.name === 'Counterspell');
    if (counterspell && slots[3] > 0) {
      // Suggest readying Counterspell
      return {
        spell: counterspell,
        slotLevel: 3,
        reasoning: 'Genius — ready Counterspell for when an enemy caster begins casting.',
        targets: ['(reaction — enemy caster)'],
      };
    }
  }

  // 2. Break enemy concentration
  const concentrating = aliveEnemies.filter(e => e.isConcentrating);
  if (concentrating.length > 0) {
    const dispel = available.find(s => s.name === 'Dispel Magic');
    if (dispel && slots[3] > 0) {
      return {
        spell: dispel,
        slotLevel: 3,
        reasoning: `${concentrating[0].name} is concentrating — Dispel Magic to end their spell.`,
        targets: [concentrating[0].name],
      };
    }
    // Or just attack to force concentration check
  }

  // 3. Control spells for groups
  if (aliveEnemies.length >= 3) {
    const control = slotted.find(s => s.tags?.includes('control') && s.tags?.includes('aoe'));
    if (control) {
      return {
        spell: control,
        slotLevel: control.level,
        reasoning: `${aliveEnemies.length} enemies — area control spell to neutralize the group.`,
        targets: aliveEnemies.map(e => e.name),
      };
    }
  }

  // 4. AoE damage for groups
  if (aliveEnemies.length >= 3) {
    const aoe = slotted.find(s => s.tags?.includes('aoe') && s.tags?.includes('damage'));
    if (aoe) {
      return {
        spell: aoe,
        slotLevel: aoe.level,
        reasoning: `${aliveEnemies.length} enemies grouped — maximize damage with area spell.`,
        targets: aliveEnemies.map(e => e.name),
      };
    }
  }

  // 5. Heal badly wounded ally
  if (woundedAllies.length > 0) {
    const heal = slotted.find(s => s.tags?.includes('healing'));
    if (heal) {
      const target = woundedAllies.sort((a, b) => (a.hpCurrent / a.hpMax) - (b.hpCurrent / b.hpMax))[0];
      return {
        spell: heal,
        slotLevel: heal.level,
        reasoning: `${target.name} critically wounded (${Math.round((target.hpCurrent / target.hpMax) * 100)}% HP) — healing.`,
        targets: [target.name],
      };
    }
  }

  // 6. Buff self/allies if not yet concentrating
  if (!combatant.isConcentrating) {
    const buff = slotted.find(s => s.tags?.includes('buff') && s.concentration);
    if (buff) {
      return {
        spell: buff,
        slotLevel: buff.level,
        reasoning: 'No active concentration — cast buff spell for sustained advantage.',
        targets: [combatant.name],
      };
    }
  }

  // 7. Single-target damage (highest level available for max damage)
  const dmgSorted = slotted.filter(s => s.tags?.includes('damage')).sort((a, b) => b.level - a.level);
  if (dmgSorted.length > 0) {
    const target = aliveEnemies.sort((a, b) => (a.hpCurrent / a.hpMax) - (b.hpCurrent / b.hpMax))[0]; // lowest HP %
    return {
      spell: dmgSorted[0],
      slotLevel: dmgSorted[0].level,
      reasoning: `Single-target damage — ${target?.name || 'enemy'} at ${target ? Math.round((target.hpCurrent / target.hpMax) * 100) : '?'}% HP.`,
      targets: [target?.name],
    };
  }

  // 8. Fall back to cantrip
  const best = pickBestCantrip(cantrips, aliveEnemies, tier);
  if (best) return { spell: best, slotLevel: 0, reasoning: 'Conserving spell slots — using cantrip.', targets: [aliveEnemies[0]?.name] };

  return null;
}

function pickBestCantrip(cantrips, enemies, tier) {
  if (!cantrips.length) return null;
  // Prefer damage cantrips
  const dmg = cantrips.filter(s => s.damage);
  if (dmg.length) {
    // Pick highest damage cantrip
    return dmg.sort((a, b) => {
      const aDice = parseInt(a.damage) || 0;
      const bDice = parseInt(b.damage) || 0;
      return bDice - aDice;
    })[0];
  }
  // Otherwise pick first utility cantrip
  return cantrips[0];
}
