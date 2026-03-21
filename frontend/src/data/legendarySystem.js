/**
 * Legendary & Boss Mechanics — D&D 5e
 *
 * Covers roadmap items 51-52, 55 (Legendary Actions, Legendary Resistance,
 * Boss Phase Transitions).
 */

// ── Legendary Action Templates ──
export const LEGENDARY_ACTION_TEMPLATES = {
  dragon: {
    label: 'Dragon',
    actionsPerRound: 3,
    actions: [
      { name: 'Detect', cost: 1, description: 'The dragon makes a Wisdom (Perception) check.' },
      { name: 'Tail Attack', cost: 1, description: 'The dragon makes a tail attack.' },
      { name: 'Wing Attack', cost: 2, description: 'The dragon beats its wings. Each creature within 10 ft must succeed on a DEX save or take bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.' },
    ],
  },
  lich: {
    label: 'Lich',
    actionsPerRound: 3,
    actions: [
      { name: 'Cantrip', cost: 1, description: 'The lich casts a cantrip.' },
      { name: 'Paralyzing Touch', cost: 2, description: 'The lich uses its Paralyzing Touch.' },
      { name: 'Frightening Gaze', cost: 2, description: 'The lich fixes its gaze on one creature within 10 feet. The target must succeed on a WIS save against the lich\'s spell save DC or become frightened for 1 minute.' },
      { name: 'Disrupt Life', cost: 3, description: 'Each living creature within 20 feet must make a CON save, taking 21 (6d6) necrotic damage on a failed save, or half as much on a successful one.' },
    ],
  },
  vampire: {
    label: 'Vampire',
    actionsPerRound: 3,
    actions: [
      { name: 'Move', cost: 1, description: 'The vampire moves up to its speed without provoking opportunity attacks.' },
      { name: 'Unarmed Strike', cost: 1, description: 'The vampire makes one unarmed strike.' },
      { name: 'Bite', cost: 2, description: 'The vampire makes one bite attack.' },
    ],
  },
  beholder: {
    label: 'Beholder',
    actionsPerRound: 3,
    actions: [
      { name: 'Eye Ray', cost: 1, description: 'The beholder uses one random eye ray.' },
    ],
  },
  generic: {
    label: 'Generic Boss',
    actionsPerRound: 3,
    actions: [
      { name: 'Attack', cost: 1, description: 'The boss makes one weapon attack.' },
      { name: 'Move', cost: 1, description: 'The boss moves up to half its speed.' },
      { name: 'Cast Cantrip', cost: 1, description: 'The boss casts a cantrip.' },
      { name: 'Special Attack', cost: 2, description: 'The boss uses a special attack or ability.' },
    ],
  },
};

// ── Legendary Resistance ──
export const LEGENDARY_RESISTANCE = {
  description: 'If the creature fails a saving throw, it can choose to succeed instead.',
  usesPerDay: 3,
  rules: [
    'Costs one use of Legendary Resistance',
    'The creature simply chooses to succeed — no roll needed',
    'Typically 3 uses per day (refreshes on long rest)',
    'Once depleted, the creature must make saves normally',
    'DM tip: save these for the most devastating effects (banishment, hold person, etc.)',
  ],
  dmTips: [
    'Don\'t waste these on low-impact spells',
    'Announce when using it — it creates dramatic tension',
    'Players feel accomplished when they "burn" a legendary resistance',
    'Consider the narrative impact — the boss shrugging off a spell is intimidating',
  ],
};

// ── Boss Phase Transitions ──
export const PHASE_TEMPLATES = {
  twoPhase: {
    label: 'Two-Phase Boss',
    phases: [
      { phase: 1, hpThreshold: '100%-50%', description: 'Standard tactics. Uses normal attacks and abilities.', trigger: 'Drops below 50% HP' },
      { phase: 2, hpThreshold: '50%-0%', description: 'Enraged form. New abilities unlocked, attacks hit harder.', changes: ['Gain multiattack or extra attack', '+2 to damage rolls', 'New legendary action unlocked', 'Possible form change or aura effect'] },
    ],
  },
  threePhase: {
    label: 'Three-Phase Boss',
    phases: [
      { phase: 1, hpThreshold: '100%-66%', description: 'Testing phase. Boss evaluates party, uses standard abilities.', trigger: 'Drops below 66% HP' },
      { phase: 2, hpThreshold: '66%-33%', description: 'Serious phase. Boss uses stronger abilities, summons reinforcements.', changes: ['Summon minions or reinforcements', 'Use higher-level spells', 'Activate lair actions'] },
      { phase: 3, hpThreshold: '33%-0%', description: 'Desperate phase. All-out assault, most powerful abilities.', changes: ['Gain +2 AC from desperate defense', 'All damage maximized', 'Legendary actions cost 1 less', 'May attempt to flee or self-destruct'] },
    ],
  },
  formChange: {
    label: 'Form-Change Boss',
    phases: [
      { phase: 1, hpThreshold: '100%-0% (first form)', description: 'First form with initial stat block.', trigger: 'Reaches 0 HP in first form' },
      { phase: 2, hpThreshold: 'New HP pool', description: 'Second form — completely new abilities and potentially new stat block.', changes: ['New HP pool (could be higher or lower)', 'Different damage types', 'Different movement (flying, burrowing, etc.)', 'New legendary actions', 'Existing conditions may or may not carry over'] },
    ],
  },
  escalating: {
    label: 'Escalating Environment Boss',
    phases: [
      { phase: 1, hpThreshold: '100%-75%', description: 'Arena is stable. Standard combat.', trigger: 'Drops below 75% HP' },
      { phase: 2, hpThreshold: '75%-50%', description: 'Environment becomes hazardous.', changes: ['Lair begins collapsing or changing', 'Environmental damage zones appear', 'Difficult terrain spreads'] },
      { phase: 3, hpThreshold: '50%-25%', description: 'Arena is actively dangerous.', changes: ['Half the arena is now hazardous', 'Environmental damage increases', 'Boss uses environment offensively'] },
      { phase: 4, hpThreshold: '25%-0%', description: 'Arena is collapsing. Race against time.', changes: ['Timer starts — arena will be destroyed', 'Maximum environmental damage', 'Boss becomes desperate and reckless'] },
    ],
  },
};

// ── Lair Actions ──
export const LAIR_ACTION_TEMPLATES = {
  dragon: [
    'A cloud of poisonous/flame/cold gas fills a 20-ft radius area. CON save or take damage.',
    'Magma/water/ice erupts from a point, creating difficult terrain in a 20-ft radius.',
    'Tremors shake the lair. Each creature on the ground must succeed on a DEX save or be knocked prone.',
  ],
  lich: [
    'The lich rolls a d8 and regains a spell slot of that level or lower.',
    'One creature the lich can see must succeed on a DC 18 CON save or take 18 (4d8) necrotic damage.',
    'Shadowy specters appear and attack one creature. +8 to hit, 10 (3d6) necrotic damage.',
  ],
  vampire: [
    'Mist fills a 20-ft radius, making the area heavily obscured.',
    'Walls of the lair animate. One creature must make a DEX save or be restrained by grasping walls.',
    'Swarm of bats/rats emerges from the walls, attacking one creature.',
  ],
  generic: [
    'The terrain shifts — difficult terrain appears in a 20-ft radius area of the boss\'s choice.',
    'An environmental hazard activates, dealing damage in an area.',
    'The boss summons 1d4 minions in unoccupied spaces.',
    'A magical effect enhances the boss or debilitates the party (save to resist).',
  ],
};

/**
 * Get legendary action template for a boss type.
 */
export function getLegendaryActions(bossType) {
  return LEGENDARY_ACTION_TEMPLATES[bossType] || LEGENDARY_ACTION_TEMPLATES.generic;
}

/**
 * Get phase transition template.
 */
export function getPhaseTemplate(templateType) {
  return PHASE_TEMPLATES[templateType] || PHASE_TEMPLATES.twoPhase;
}

/**
 * Determine current phase based on HP percentage.
 */
export function getCurrentPhase(hpPercent, templateType) {
  const template = PHASE_TEMPLATES[templateType] || PHASE_TEMPLATES.twoPhase;
  const thresholds = template.phases.map((p, i) => {
    const parts = p.hpThreshold.match(/(\d+)%/g);
    return { phase: p.phase, low: parts ? parseInt(parts[parts.length - 1]) : 0, ...p };
  });

  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (hpPercent <= thresholds[i].low || i === thresholds.length - 1) continue;
  }

  // Simple threshold check
  if (template.phases.length === 2) {
    return hpPercent > 50 ? template.phases[0] : template.phases[1];
  }
  if (template.phases.length === 3) {
    if (hpPercent > 66) return template.phases[0];
    if (hpPercent > 33) return template.phases[1];
    return template.phases[2];
  }
  if (template.phases.length === 4) {
    if (hpPercent > 75) return template.phases[0];
    if (hpPercent > 50) return template.phases[1];
    if (hpPercent > 25) return template.phases[2];
    return template.phases[3];
  }
  return template.phases[0];
}

/**
 * Get lair actions for a boss type.
 */
export function getLairActions(bossType) {
  return LAIR_ACTION_TEMPLATES[bossType] || LAIR_ACTION_TEMPLATES.generic;
}

/**
 * Get all boss types for UI.
 */
export function getBossTypes() {
  return Object.entries(LEGENDARY_ACTION_TEMPLATES).map(([key, t]) => ({
    id: key, label: t.label, actionsPerRound: t.actionsPerRound,
  }));
}

/**
 * Get all phase templates for UI.
 */
export function getPhaseTemplateOptions() {
  return Object.entries(PHASE_TEMPLATES).map(([key, t]) => ({
    id: key, label: t.label, phaseCount: t.phases.length,
  }));
}
