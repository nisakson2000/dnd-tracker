/**
 * Combat AI Intelligence System — Monster Tactical Behavior
 *
 * Covers roadmap items 3-16 (Combat AI intelligence tiers, spell selection,
 * AoE targeting, healing, concentration breaking, counterspell, combo attacks,
 * retreat logic, hostage behavior, reinforcements, target adaptation, formation breaking).
 */

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const d = (n) => Math.floor(Math.random() * n) + 1;

// ── Intelligence Tiers ──
export const INTELLIGENCE_TIERS = {
  mindless: {
    label: 'Mindless',
    intRange: '1-2',
    description: 'Zombies, oozes, animated objects. Attack nearest target, never retreat, ignore tactics.',
    behaviors: [
      'Always attacks the nearest target',
      'Never retreats or surrenders',
      'Doesn\'t use cover or tactical positioning',
      'Ignores dying allies',
      'Uses only basic attacks (no spell selection)',
    ],
    targetPriority: 'nearest',
    retreats: false,
    usesCover: false,
    usesSpells: false,
    callsReinforcements: false,
  },
  bestial: {
    label: 'Bestial',
    intRange: '3-4',
    description: 'Animals, low beasts. Pack tactics, fight or flight instinct.',
    behaviors: [
      'Attacks weakest-looking target (smallest, wounded)',
      'Retreats at 25% HP unless cornered or protecting young',
      'Uses pack tactics if applicable',
      'Flanks when possible',
      'Doesn\'t use equipment or complex tactics',
    ],
    targetPriority: 'weakest',
    retreats: true,
    retreatThreshold: 0.25,
    usesCover: false,
    usesSpells: false,
    callsReinforcements: false,
  },
  low: {
    label: 'Low Intelligence',
    intRange: '5-7',
    description: 'Goblins, kobolds, ogres. Basic tactics, self-preservation.',
    behaviors: [
      'Focuses fire on wounded targets',
      'Uses cover when available',
      'Retreats at 25% HP',
      'Calls for help (shouts)',
      'Uses simple traps and ambush tactics',
      'May take hostages if desperate',
    ],
    targetPriority: 'wounded',
    retreats: true,
    retreatThreshold: 0.25,
    usesCover: true,
    usesSpells: false,
    callsReinforcements: true,
  },
  average: {
    label: 'Average Intelligence',
    intRange: '8-11',
    description: 'Guards, bandits, most humanoids. Standard tactical awareness.',
    behaviors: [
      'Targets spellcasters and healers first',
      'Uses cover and flanking',
      'Retreats at 25% HP or when fight is clearly lost',
      'Coordinates with allies',
      'Uses basic spells if available',
      'Will negotiate or surrender if outmatched',
    ],
    targetPriority: 'casters_first',
    retreats: true,
    retreatThreshold: 0.25,
    usesCover: true,
    usesSpells: true,
    callsReinforcements: true,
  },
  smart: {
    label: 'Smart',
    intRange: '12-15',
    description: 'Hobgoblin captains, mages, experienced warriors. Advanced tactics.',
    behaviors: [
      'Targets concentration casters to break spells',
      'Uses AoE when 3+ enemies grouped',
      'Heals allies below 25% HP',
      'Uses Counterspell when seeing enemy cast',
      'Retreats strategically — regroups and attacks again',
      'Sets ambushes and uses terrain',
      'Calls for reinforcements early',
      'Adapts after 2 failed attacks on same target',
    ],
    targetPriority: 'concentrating_casters',
    retreats: true,
    retreatThreshold: 0.3,
    usesCover: true,
    usesSpells: true,
    callsReinforcements: true,
    usesCounterspell: true,
    breaksConcentration: true,
  },
  genius: {
    label: 'Genius',
    intRange: '16-20',
    description: 'Liches, mind flayers, archmages. Mastermind-level tactics.',
    behaviors: [
      'Everything Smart does, plus:',
      'Combo attacks (Darkness + Devil\'s Sight, etc.)',
      'Baits reactions before main attack',
      'Uses environment (push off ledge, collapse ceiling)',
      'Targets party\'s weakest save',
      'Saves best abilities for critical moments',
      'Has contingency plans',
      'May flee and return with better preparation',
      'Uses minions as shields and scouts',
      'Negotiates from position of strength',
    ],
    targetPriority: 'optimal',
    retreats: true,
    retreatThreshold: 0.4,
    usesCover: true,
    usesSpells: true,
    callsReinforcements: true,
    usesCounterspell: true,
    breaksConcentration: true,
    usesComboAttacks: true,
    baitsReactions: true,
    usesEnvironment: true,
  },
  legendary: {
    label: 'Legendary',
    intRange: '21-30',
    description: 'Ancient dragons, archdevils, elder brains. Near-omniscient tactical awareness.',
    behaviors: [
      'Everything Genius does, plus:',
      'Has studied the party beforehand (spy network)',
      'Pre-positioned traps and minions',
      'Legendary actions used optimally between turns',
      'Multiple contingency plans',
      'Will sacrifice minions without hesitation',
      'Targets each PC\'s specific weakness',
      'May monologue to demoralize (Frightening Presence)',
      'Uses lair actions to reshape battlefield',
    ],
    targetPriority: 'individual_weaknesses',
    retreats: true,
    retreatThreshold: 0.5,
    usesCover: true,
    usesSpells: true,
    callsReinforcements: true,
    usesCounterspell: true,
    breaksConcentration: true,
    usesComboAttacks: true,
    baitsReactions: true,
    usesEnvironment: true,
    hasSpyNetwork: true,
    usesLairActions: true,
  },
};

// ── Target Priority Logic ──
export const TARGET_PRIORITIES = {
  nearest: { label: 'Nearest', description: 'Attack the closest creature' },
  weakest: { label: 'Weakest', description: 'Attack the creature with lowest HP / most wounded' },
  wounded: { label: 'Wounded', description: 'Focus on already-damaged targets for quicker kills' },
  casters_first: { label: 'Casters First', description: 'Target spellcasters, then ranged, then melee' },
  concentrating_casters: { label: 'Concentration Breakers', description: 'Priority: anyone concentrating on a spell' },
  optimal: { label: 'Optimal', description: 'Analyze each target\'s AC, saves, and current condition for best odds' },
  individual_weaknesses: { label: 'Individual Weaknesses', description: 'Target each PC\'s lowest save or known vulnerability' },
};

// ── Morale/Retreat Rules ──
export const MORALE_RULES = {
  retreatTriggers: [
    { trigger: 'Leader killed', description: 'If group leader dies, remaining creatures make DC 10 WIS save or flee.' },
    { trigger: 'Half killed', description: 'When half the group is killed, survivors may retreat.' },
    { trigger: 'HP threshold', description: 'Individual creature retreats when HP drops below threshold (varies by intelligence).' },
    { trigger: 'Outmatched', description: 'Smart+ creatures recognize when they can\'t win and retreat to fight another day.' },
  ],
  retreatBehaviors: [
    'Dash action to flee (provokes opportunity attacks)',
    'Disengage action to flee safely (uses action)',
    'Fighting retreat — attack then move away each turn',
    'Surrender — drop weapons, plead for mercy',
    'Organized retreat — cover each other while falling back',
    'Desperate sacrifice — one stays behind while others flee',
  ],
  noRetreat: [
    'Undead (mindless)',
    'Constructs',
    'Creatures fighting to protect young/lair',
    'Fanatical cultists',
    'Creatures under domination/charm',
    'Berserking creatures',
  ],
};

// ── Environmental Tactics ──
export const ENVIRONMENTAL_TACTICS = [
  { tactic: 'Push off ledge', requirement: 'Near a cliff or pit', effect: 'Shove attack (Athletics vs Athletics/Acrobatics). On success: falling damage.' },
  { tactic: 'Collapse ceiling', requirement: 'Underground or ruined structure', effect: 'Attack structural support. Area: 10-20ft radius. 2d10 bludgeoning, DEX save for half.' },
  { tactic: 'Kick brazier', requirement: 'Fire source in room', effect: 'Scatter burning coals. 5ft area: 1d6 fire damage, ignites flammable objects.' },
  { tactic: 'Destroy bridge', requirement: 'Bridge or walkway', effect: 'Party must cross or find alternate route. Falling damage if on bridge.' },
  { tactic: 'Use cover', requirement: 'Pillars, furniture, walls', effect: '+2 or +5 AC from half/three-quarters cover.' },
  { tactic: 'Flood room', requirement: 'Water source, dam, sluice', effect: 'Room fills with water. Swimming checks required. Difficult terrain.' },
  { tactic: 'Darkness/fog', requirement: 'Spell or mundane source', effect: 'Heavily obscured area. Advantage for creatures with Blindsight/Darkvision.' },
  { tactic: 'Choke point', requirement: 'Narrow corridor or doorway', effect: 'Limit how many attackers can engage simultaneously.' },
];

/**
 * Get AI tier for a given intelligence score.
 */
export function getIntelligenceTier(intScore) {
  if (intScore <= 2) return INTELLIGENCE_TIERS.mindless;
  if (intScore <= 4) return INTELLIGENCE_TIERS.bestial;
  if (intScore <= 7) return INTELLIGENCE_TIERS.low;
  if (intScore <= 11) return INTELLIGENCE_TIERS.average;
  if (intScore <= 15) return INTELLIGENCE_TIERS.smart;
  if (intScore <= 20) return INTELLIGENCE_TIERS.genius;
  return INTELLIGENCE_TIERS.legendary;
}

/**
 * Suggest target based on AI tier.
 */
export function suggestTarget(tier, combatants) {
  const enemies = combatants.filter(c => c.isEnemy);
  if (enemies.length === 0) return null;

  switch (tier.targetPriority) {
    case 'nearest':
      return enemies[0]; // assume sorted by proximity
    case 'weakest':
      return enemies.reduce((min, c) => (c.currentHp < min.currentHp ? c : min), enemies[0]);
    case 'wounded':
      return enemies.filter(c => c.currentHp < c.maxHp).sort((a, b) => a.currentHp - b.currentHp)[0] || enemies[0];
    case 'casters_first':
      return enemies.find(c => c.isCaster) || enemies[0];
    case 'concentrating_casters':
      return enemies.find(c => c.isConcentrating) || enemies.find(c => c.isCaster) || enemies[0];
    case 'optimal':
    case 'individual_weaknesses':
      // Sort by: concentrating > casters > lowest AC > wounded
      return enemies.sort((a, b) => {
        if (a.isConcentrating && !b.isConcentrating) return -1;
        if (b.isConcentrating && !a.isConcentrating) return 1;
        if (a.isCaster && !b.isCaster) return -1;
        if (b.isCaster && !a.isCaster) return 1;
        return (a.ac || 10) - (b.ac || 10);
      })[0];
    default:
      return enemies[0];
  }
}

/**
 * Suggest tactical action based on AI tier and situation.
 */
export function suggestTactics(intScore, situation = {}) {
  const tier = getIntelligenceTier(intScore);
  const suggestions = [];

  if (tier.breaksConcentration && situation.enemyConcentrating) {
    suggestions.push({ priority: 'high', action: 'Break concentration', description: 'Target the concentrating caster to disrupt their spell.' });
  }
  if (tier.usesCounterspell && situation.enemyCasting) {
    suggestions.push({ priority: 'high', action: 'Counterspell', description: 'Use Counterspell to negate the enemy\'s spell.' });
  }
  if (tier.usesSpells && situation.groupedEnemies >= 3) {
    suggestions.push({ priority: 'high', action: 'AoE spell', description: `${situation.groupedEnemies} enemies are grouped — use an area effect spell.` });
  }
  if (tier.usesCover && situation.coverAvailable) {
    suggestions.push({ priority: 'medium', action: 'Use cover', description: 'Move behind available cover for AC bonus.' });
  }
  if (tier.callsReinforcements && situation.losing) {
    suggestions.push({ priority: 'medium', action: 'Call reinforcements', description: 'Send a runner or blow a horn to summon allies.' });
  }
  if (tier.retreats && situation.hpPercent <= tier.retreatThreshold) {
    suggestions.push({ priority: 'high', action: 'Retreat', description: 'HP is critical. Consider retreat or surrender.' });
  }
  if (tier.usesEnvironment && situation.environmentalOptions) {
    const tactic = pick(ENVIRONMENTAL_TACTICS);
    suggestions.push({ priority: 'medium', action: tactic.tactic, description: tactic.effect });
  }

  return { tier: tier.label, suggestions };
}

/**
 * Check morale for a group after losses.
 */
export function checkMorale(originalCount, currentCount, leaderAlive, intScore) {
  const tier = getIntelligenceTier(intScore);
  const casualties = originalCount - currentCount;
  const casualtyRate = casualties / originalCount;

  if (MORALE_RULES.noRetreat.some(r => intScore <= 2)) {
    return { flees: false, reason: 'Mindless — never retreats' };
  }

  if (!leaderAlive) {
    return { flees: d(20) < 11, reason: 'Leader killed — morale check failed' };
  }

  if (casualtyRate >= 0.5) {
    return { flees: d(20) < (tier.retreats ? 13 : 5), reason: 'Half the group killed — morale check' };
  }

  return { flees: false, reason: 'Morale holds' };
}
