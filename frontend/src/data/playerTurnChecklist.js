/**
 * playerTurnChecklist.js
 * Turn management data for player mode (improvements 8-10, 144-155)
 * Pure JS — no React
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. TURN_PHASES
// Three structured phases that make up a single combat turn.
// ─────────────────────────────────────────────────────────────────────────────

export const TURN_PHASES = [
  {
    id: 'start_of_turn',
    label: 'Start of Turn',
    order: 1,
    description: 'Resolve all start-of-turn triggers before taking any actions.',
    checks: [
      {
        id: 'start_aura_effects',
        label: 'Aura & Ongoing Damage',
        detail: 'Check for auras (e.g. Spirit Guardians) or ongoing effects that deal damage at the start of your turn.',
      },
      {
        id: 'start_regeneration',
        label: 'Regeneration Features',
        detail: 'Apply regeneration (Troll, Ring of Regeneration, etc.) and similar recovery features.',
      },
      {
        id: 'start_condition_triggers',
        label: 'Start-of-Turn Condition Triggers',
        detail: 'Some conditions and spells require saving throws or actions at the start of your turn (e.g. Crown of Madness, Hunger of Hadar).',
      },
    ],
  },
  {
    id: 'during_turn',
    label: 'During Turn',
    order: 2,
    description: 'Use your action economy — action, bonus action, movement, and reaction.',
    checks: [
      {
        id: 'action',
        label: 'Action',
        detail: 'Attack, cast a spell, Dash, Disengage, Dodge, Help, Hide, Ready, Search, Use an Object, or other action.',
      },
      {
        id: 'bonus_action',
        label: 'Bonus Action',
        detail: 'Use a class feature, off-hand attack, or spell that requires a bonus action (only one per turn).',
      },
      {
        id: 'movement',
        label: 'Movement',
        detail: 'Move up to your speed. You can split movement before and after your action. Difficult terrain costs double.',
      },
      {
        id: 'free_interaction',
        label: 'Free Object Interaction',
        detail: 'Interact with one object or feature of the environment for free (draw a weapon, open a door, pick up a coin, etc.).',
      },
      {
        id: 'reaction',
        label: 'Reaction (if triggered)',
        detail: 'Reactions can be taken on your turn or on someone else\'s. Opportunity attacks, Shield, Counterspell, and Sentinel are common triggers.',
      },
    ],
  },
  {
    id: 'end_of_turn',
    label: 'End of Turn',
    order: 3,
    description: 'Resolve all end-of-turn effects and saving throws.',
    checks: [
      {
        id: 'end_condition_saves',
        label: 'End-of-Turn Saving Throws',
        detail: 'Many conditions (Frightened, Charmed, Stunned, Paralyzed) allow a save at the end of your turn to end the effect.',
      },
      {
        id: 'end_ongoing_effects',
        label: 'Ongoing Effect Checks',
        detail: 'Resolve ongoing damage spells that trigger at the end of your turn (e.g. Witch Bolt, Heat Metal, Moonbeam).',
      },
      {
        id: 'end_lair_actions',
        label: 'Lair Actions (Initiative 20)',
        detail: 'If initiative count reaches 20 (going before everyone on a tie), the lair acts. DM resolves lair actions here.',
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. TURN_CHECKLIST
// Per-turn tracker items. Populated at runtime with actual values.
// ─────────────────────────────────────────────────────────────────────────────

export const TURN_CHECKLIST = [
  {
    id: 'movement',
    label: 'Movement Used',
    type: 'progress',
    fields: {
      used: 0,       // feet used this turn
      total: 30,     // base speed; should be overridden at runtime
      remaining: 30, // computed: total - used
    },
    note: 'Difficult terrain costs double movement. Flying and swimming may apply extra rules.',
  },
  {
    id: 'action',
    label: 'Action Taken',
    type: 'text',
    value: null,     // e.g. "Attack — longsword x2", "Cast Fireball"
    used: false,
  },
  {
    id: 'bonus_action',
    label: 'Bonus Action Taken',
    type: 'text',
    value: null,     // e.g. "Cunning Action: Dash", "Healing Word"
    used: false,
  },
  {
    id: 'reaction',
    label: 'Reaction Available',
    type: 'toggle_with_detail',
    available: true,
    usedFor: null,   // e.g. "Opportunity Attack on goblin", "Shield spell"
  },
  {
    id: 'free_interaction',
    label: 'Free Object Interaction Used',
    type: 'toggle',
    used: false,
    detail: null,    // e.g. "Drew shortsword"
  },
  {
    id: 'concentration',
    label: 'Concentration Maintained',
    type: 'toggle_with_detail',
    active: false,   // true if the character is currently concentrating
    maintained: true,
    spellName: null, // e.g. "Bless", "Hypnotic Pattern"
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. START_OF_TURN_PROMPTS
// Common effects that trigger at the start of a character's turn.
// ─────────────────────────────────────────────────────────────────────────────

export const START_OF_TURN_PROMPTS = [
  {
    id: 'regeneration',
    label: 'Regeneration',
    trigger: 'start_of_turn',
    sources: ['Troll', 'Ring of Regeneration', 'Wish (regeneration effect)', 'Custom feature'],
    prompt: 'Regain hit points as listed by the feature (e.g. Troll: 10 HP; Ring of Regeneration: 1d6 HP). Cannot occur if you took fire or acid damage since your last turn (Troll).',
    requiresRoll: true,
    rollType: 'hp_recovery',
  },
  {
    id: 'aura_damage',
    label: 'Aura Damage',
    trigger: 'start_of_turn',
    sources: ['Spirit Guardians', 'Aura of Vitality (heal)', 'Cloudkill', 'Wall of Fire (inside)'],
    prompt: 'Any creature that starts its turn in the aura/area may take damage or gain a benefit. Check active aura effects on your character.',
    requiresRoll: true,
    rollType: 'damage_or_save',
  },
  {
    id: 'ongoing_save_start',
    label: 'Ongoing Saving Throw (Start)',
    trigger: 'start_of_turn',
    sources: ['Some homebrew conditions', 'Certain monster abilities'],
    prompt: 'Some effects call for a saving throw at the start of your turn. Check any active conditions for "start of your turn" language.',
    requiresRoll: true,
    rollType: 'saving_throw',
  },
  {
    id: 'crown_of_madness',
    label: 'Crown of Madness',
    trigger: 'start_of_turn',
    sources: ['Crown of Madness spell'],
    prompt: 'If charmed by Crown of Madness, you MUST use your action to make a melee attack against a creature the caster mentally designates (or waste your action if none is within reach). The caster must use their action on subsequent turns to maintain control.',
    requiresRoll: false,
    rollType: null,
    forceAction: true,
  },
  {
    id: 'hunger_of_hadar',
    label: 'Hunger of Hadar — Start Acid Damage',
    trigger: 'start_of_turn',
    sources: ['Hunger of Hadar spell'],
    prompt: 'Any creature that starts its turn in the Hunger of Hadar area takes 2d6 cold damage. Creatures ending their turn inside also take damage (see end-of-turn prompts).',
    requiresRoll: true,
    rollType: 'damage',
    damageType: 'cold',
    damageDice: '2d6',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. END_OF_TURN_PROMPTS
// Common effects that trigger at the end of a character's turn.
// ─────────────────────────────────────────────────────────────────────────────

export const END_OF_TURN_PROMPTS = [
  {
    id: 'save_frightened',
    label: 'Save vs. Frightened',
    trigger: 'end_of_turn',
    condition: 'frightened',
    prompt: 'Make a Wisdom saving throw (DC set by the source). On a success, the Frightened condition ends.',
    requiresRoll: true,
    rollType: 'saving_throw',
    ability: 'wisdom',
  },
  {
    id: 'save_charmed',
    label: 'Save vs. Charmed',
    trigger: 'end_of_turn',
    condition: 'charmed',
    prompt: 'Make a Wisdom saving throw (DC set by the source). On a success, the Charmed condition ends. Note: some charm effects require a different save or allow saves at different intervals.',
    requiresRoll: true,
    rollType: 'saving_throw',
    ability: 'wisdom',
  },
  {
    id: 'save_stunned',
    label: 'Save vs. Stunned',
    trigger: 'end_of_turn',
    condition: 'stunned',
    prompt: 'Make a Constitution saving throw (DC set by the source, e.g. Stunning Strike DC = Ki save DC). On a success, the Stunned condition ends.',
    requiresRoll: true,
    rollType: 'saving_throw',
    ability: 'constitution',
  },
  {
    id: 'save_paralyzed',
    label: 'Save vs. Paralyzed',
    trigger: 'end_of_turn',
    condition: 'paralyzed',
    prompt: 'Make a saving throw (ability and DC determined by the source). On a success, the Paralyzed condition ends.',
    requiresRoll: true,
    rollType: 'saving_throw',
    ability: 'varies',
  },
  {
    id: 'witch_bolt',
    label: 'Witch Bolt — Ongoing Damage',
    trigger: 'end_of_turn',
    sources: ['Witch Bolt spell'],
    prompt: 'On each of your turns for the duration, use your action to deal 1d12 lightning damage to the target automatically (no attack roll needed). The spell ends if the target moves out of range (30 ft) or if you use your action on something else.',
    requiresRoll: true,
    rollType: 'damage',
    damageType: 'lightning',
    damageDice: '1d12',
    requiresAction: true,
  },
  {
    id: 'heat_metal',
    label: 'Heat Metal — Ongoing Damage',
    trigger: 'end_of_turn',
    sources: ['Heat Metal spell'],
    prompt: 'On each of your turns for the duration, you can use a bonus action to cause 2d8 fire damage to the target. The target must also make a Constitution save or drop the object (if it can). You must use your bonus action each turn to maintain the effect.',
    requiresRoll: true,
    rollType: 'damage',
    damageType: 'fire',
    damageDice: '2d8',
    requiresBonusAction: true,
  },
  {
    id: 'moonbeam',
    label: 'Moonbeam — Ongoing Damage',
    trigger: 'end_of_turn',
    sources: ['Moonbeam spell'],
    prompt: 'Any creature that ends its turn in the Moonbeam cylinder takes 2d10 radiant damage (Constitution save for half). Shapechangers have disadvantage on the save.',
    requiresRoll: true,
    rollType: 'damage_or_save',
    damageType: 'radiant',
    damageDice: '2d10',
    saveAbility: 'constitution',
  },
  {
    id: 'hunger_of_hadar_end',
    label: 'Hunger of Hadar — End Acid Damage',
    trigger: 'end_of_turn',
    sources: ['Hunger of Hadar spell'],
    prompt: 'Any creature that ends its turn in the Hunger of Hadar area takes 2d6 acid damage.',
    requiresRoll: true,
    rollType: 'damage',
    damageType: 'acid',
    damageDice: '2d6',
  },
  {
    id: 'concentration_check',
    label: 'Concentration Spell Duration',
    trigger: 'end_of_turn',
    prompt: 'Check if any active concentration spell has expired or was broken this round. If you took damage since your last turn, confirm you made your concentration saving throw (DC 10 or half damage, whichever is higher).',
    requiresRoll: false,
    rollType: null,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 5. PRE_PLAN_TEMPLATE
// Structure for planning the next turn while waiting for others to act.
// ─────────────────────────────────────────────────────────────────────────────

export const PRE_PLAN_TEMPLATE = {
  plannedAction: null,       // string | null — e.g. "Cast Fireball at cluster near door"
  plannedBonusAction: null,  // string | null — e.g. "Healing Word on Aria if < 10 HP"
  plannedMovement: null,     // string | null — e.g. "Move 20 ft toward north pillar"
  plannedTarget: null,       // string | null — e.g. "Hobgoblin Warlord"
  notes: '',                 // freeform — situational notes, positioning thoughts
  contingency: '',           // freeform — "If hobgoblin moves away, cast Hold Person instead"
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. TURN_TIMER_CONFIG
// Suggested turn time limits for different play styles.
// warningThreshold triggers a visual/audio warning at X% of the limit.
// criticalThreshold triggers a critical warning at Y% of the limit.
// ─────────────────────────────────────────────────────────────────────────────

export const TURN_TIMER_CONFIG = {
  fast: {
    id: 'fast',
    label: 'Fast',
    limitSeconds: 60,
    limitLabel: '60 seconds',
    warningThreshold: 0.75,  // warn at 45 s elapsed
    criticalThreshold: 0.90, // critical at 54 s elapsed
    description: 'Quick, decisive play. Good for experienced groups or simple encounters.',
  },
  standard: {
    id: 'standard',
    label: 'Standard',
    limitSeconds: 120,
    limitLabel: '2 minutes',
    warningThreshold: 0.75,  // warn at 90 s elapsed
    criticalThreshold: 0.90, // critical at 108 s elapsed
    description: 'Balanced pacing. Suitable for most groups and encounter complexities.',
  },
  relaxed: {
    id: 'relaxed',
    label: 'Relaxed',
    limitSeconds: 180,
    limitLabel: '3 minutes',
    warningThreshold: 0.75,  // warn at 135 s elapsed
    criticalThreshold: 0.90, // critical at 162 s elapsed
    description: 'Comfortable pace for newer players or complex spell choices.',
  },
  unlimited: {
    id: 'unlimited',
    label: 'Unlimited',
    limitSeconds: null,
    limitLabel: 'No limit',
    warningThreshold: null,
    criticalThreshold: null,
    description: 'No timer. Players take as long as needed.',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * getTurnChecklist
 * Returns a deep copy of TURN_CHECKLIST, optionally augmented with class-specific
 * items derived from the provided classFeatures array.
 *
 * @param {string[]} [classFeatures=[]] - Array of class feature IDs/names to check.
 * @returns {object[]} Array of checklist item objects for the current turn.
 */
export function getTurnChecklist(classFeatures = []) {
  const base = JSON.parse(JSON.stringify(TURN_CHECKLIST));

  // Inject class-specific checklist items based on known feature identifiers.
  const extras = [];

  const featureSet = new Set(classFeatures.map((f) => f.toLowerCase()));

  if (featureSet.has('second wind') || featureSet.has('secondwind')) {
    extras.push({
      id: 'second_wind',
      label: 'Second Wind (Bonus Action)',
      type: 'toggle',
      used: false,
      detail: 'Regain 1d10 + Fighter level HP. Recharges on short or long rest.',
    });
  }

  if (featureSet.has('action surge') || featureSet.has('actionsurge')) {
    extras.push({
      id: 'action_surge',
      label: 'Action Surge Used',
      type: 'toggle',
      used: false,
      detail: 'Gain one additional action this turn. Recharges on short or long rest.',
    });
  }

  if (featureSet.has('cunning action') || featureSet.has('cunningaction')) {
    extras.push({
      id: 'cunning_action',
      label: 'Cunning Action (Bonus Action)',
      type: 'text',
      used: false,
      value: null,
      detail: 'Dash, Disengage, or Hide as a bonus action.',
    });
  }

  if (featureSet.has('ki') || featureSet.has('monk')) {
    extras.push({
      id: 'ki_points',
      label: 'Ki Points Spent',
      type: 'number',
      spent: 0,
      detail: 'Track ki spent this turn (Flurry of Blows, Patient Defense, Step of the Wind).',
    });
  }

  if (featureSet.has('wild shape') || featureSet.has('wildshape')) {
    extras.push({
      id: 'wild_shape',
      label: 'Wild Shape Active',
      type: 'toggle_with_detail',
      active: false,
      form: null,
      detail: 'Track current beast form and remaining HP.',
    });
  }

  if (featureSet.has('bardic inspiration') || featureSet.has('bardicinspiration')) {
    extras.push({
      id: 'bardic_inspiration',
      label: 'Bardic Inspiration Given',
      type: 'toggle',
      used: false,
      detail: 'Grant a d6/d8/d10/d12 inspiration die to a creature within 60 ft (bonus action).',
    });
  }

  if (featureSet.has('channel divinity') || featureSet.has('channeldivinity')) {
    extras.push({
      id: 'channel_divinity',
      label: 'Channel Divinity Used',
      type: 'toggle',
      used: false,
      detail: 'Track Channel Divinity use for this encounter.',
    });
  }

  if (featureSet.has('sneak attack') || featureSet.has('sneakattack')) {
    extras.push({
      id: 'sneak_attack',
      label: 'Sneak Attack Applied',
      type: 'toggle',
      used: false,
      detail: 'Sneak Attack can only be applied once per turn.',
    });
  }

  return [...base, ...extras];
}

/**
 * getStartOfTurnPrompts
 * Returns the start-of-turn prompts relevant to the character's current
 * conditions and active effects.
 *
 * @param {string[]} [conditions=[]] - Active condition names (e.g. ['frightened', 'charmed']).
 * @param {string[]} [activeEffects=[]] - Active spell/effect IDs or names.
 * @returns {object[]} Filtered array of start-of-turn prompt objects.
 */
export function getStartOfTurnPrompts(conditions = [], activeEffects = []) {
  const conditionSet = new Set(conditions.map((c) => c.toLowerCase()));
  const effectSet = new Set(activeEffects.map((e) => e.toLowerCase()));

  return START_OF_TURN_PROMPTS.filter((prompt) => {
    // Always include regeneration — caller should gate it on character features.
    if (prompt.id === 'regeneration') return true;

    // Include aura_damage if any relevant spell is active.
    if (prompt.id === 'aura_damage') {
      const auraSources = ['spirit guardians', 'aura of vitality', 'cloudkill', 'wall of fire'];
      return auraSources.some((s) => effectSet.has(s));
    }

    // Include Crown of Madness if charmed condition is present or the effect is active.
    if (prompt.id === 'crown_of_madness') {
      return conditionSet.has('charmed') || effectSet.has('crown of madness');
    }

    // Include Hunger of Hadar start damage if the spell is active.
    if (prompt.id === 'hunger_of_hadar') {
      return effectSet.has('hunger of hadar');
    }

    // Generic ongoing save at start.
    if (prompt.id === 'ongoing_save_start') {
      return activeEffects.length > 0 || conditions.length > 0;
    }

    return false;
  });
}

/**
 * getEndOfTurnPrompts
 * Returns the end-of-turn prompts relevant to the character's current
 * conditions and active effects.
 *
 * @param {string[]} [conditions=[]] - Active condition names.
 * @param {string[]} [activeEffects=[]] - Active spell/effect IDs or names.
 * @returns {object[]} Filtered array of end-of-turn prompt objects.
 */
export function getEndOfTurnPrompts(conditions = [], activeEffects = []) {
  const conditionSet = new Set(conditions.map((c) => c.toLowerCase()));
  const effectSet = new Set(activeEffects.map((e) => e.toLowerCase()));

  return END_OF_TURN_PROMPTS.filter((prompt) => {
    // Condition-based saves — only show if the condition is present.
    if (prompt.condition) {
      return conditionSet.has(prompt.condition.toLowerCase());
    }

    // Spell-based ongoing damage — show if the spell is active.
    if (prompt.id === 'witch_bolt') return effectSet.has('witch bolt');
    if (prompt.id === 'heat_metal') return effectSet.has('heat metal');
    if (prompt.id === 'moonbeam') return effectSet.has('moonbeam');
    if (prompt.id === 'hunger_of_hadar_end') return effectSet.has('hunger of hadar');

    // Concentration check — always show if any effects or concentration spells are active.
    if (prompt.id === 'concentration_check') return activeEffects.length > 0;

    return false;
  });
}

/**
 * createPrePlan
 * Returns a fresh copy of the PRE_PLAN_TEMPLATE for planning the next turn.
 *
 * @returns {object} A new pre-plan object.
 */
export function createPrePlan() {
  return { ...PRE_PLAN_TEMPLATE, notes: '', contingency: '' };
}

/**
 * getTurnTimerConfig
 * Returns the timer configuration for the given speed setting.
 * Falls back to 'standard' if an unknown speed is provided.
 *
 * @param {'fast'|'standard'|'relaxed'|'unlimited'} [speed='standard'] - Desired speed setting.
 * @returns {object} Timer configuration object.
 */
export function getTurnTimerConfig(speed = 'standard') {
  return TURN_TIMER_CONFIG[speed] ?? TURN_TIMER_CONFIG.standard;
}

/**
 * resetTurnTracker
 * Generates a fresh turn tracker state object for a new turn.
 * Includes a blank checklist and a blank pre-plan.
 *
 * @param {'fast'|'standard'|'relaxed'|'unlimited'} [speed='standard'] - Timer speed for this turn.
 * @returns {object} Fresh turn tracker state.
 */
export function resetTurnTracker(speed = 'standard') {
  const timer = getTurnTimerConfig(speed);

  return {
    phase: 'start_of_turn',       // current phase: 'start_of_turn' | 'during_turn' | 'end_of_turn'
    checklist: getTurnChecklist(), // reset checklist without class features (caller should pass them)
    prePlan: createPrePlan(),
    timer: {
      config: timer,
      startedAt: null,             // timestamp (ms) set when the turn begins
      elapsedSeconds: 0,
      warningFired: false,
      criticalFired: false,
      expired: false,
    },
    startOfTurnPrompts: [],        // populated by getStartOfTurnPrompts at turn start
    endOfTurnPrompts: [],          // populated by getEndOfTurnPrompts at end of turn
    completed: false,
  };
}
