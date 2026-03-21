/**
 * Condition Effects — Full D&D 5e condition rules with mechanical effects.
 * Used by the combat system for automated reminders and the quick reference panel.
 */

export const CONDITIONS = {
  Blinded: {
    description: 'A blinded creature can\'t see and automatically fails any ability check that requires sight.',
    effects: [
      'Auto-fail ability checks requiring sight',
      'Attack rolls against the creature have advantage',
      'The creature\'s attack rolls have disadvantage',
    ],
    savingThrow: null,
    endCondition: 'Varies by source',
    icon: 'eye-off',
    color: '#94a3b8',
  },
  Charmed: {
    description: 'A charmed creature can\'t attack the charmer or target the charmer with harmful abilities or magical effects.',
    effects: [
      'Can\'t attack or target the charmer with harmful effects',
      'The charmer has advantage on social ability checks against the creature',
    ],
    savingThrow: 'Wisdom (varies by source)',
    endCondition: 'Varies — often ends if charmer harms the creature',
    icon: 'heart',
    color: '#f472b6',
  },
  Deafened: {
    description: 'A deafened creature can\'t hear and automatically fails any ability check that requires hearing.',
    effects: [
      'Auto-fail ability checks requiring hearing',
      'Immune to thunder damage effects that require hearing',
    ],
    savingThrow: null,
    endCondition: 'Varies by source',
    icon: 'volume-x',
    color: '#94a3b8',
  },
  Frightened: {
    description: 'A frightened creature has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight.',
    effects: [
      'Disadvantage on ability checks while source is visible',
      'Disadvantage on attack rolls while source is visible',
      'Can\'t willingly move closer to the source of fear',
    ],
    savingThrow: 'Wisdom (varies by source)',
    endCondition: 'Varies — often save at end of turn',
    icon: 'alert-triangle',
    color: '#fbbf24',
  },
  Grappled: {
    description: 'A grappled creature\'s speed becomes 0, and it can\'t benefit from any bonus to its speed.',
    effects: [
      'Speed becomes 0',
      'Can\'t benefit from bonuses to speed',
      'Ends if grappler is incapacitated',
      'Ends if moved out of reach by forced movement',
    ],
    savingThrow: 'Athletics or Acrobatics contested check to escape',
    endCondition: 'Escape action (Athletics/Acrobatics vs Athletics)',
    icon: 'lock',
    color: '#f97316',
  },
  Incapacitated: {
    description: 'An incapacitated creature can\'t take actions or reactions.',
    effects: [
      'Can\'t take actions',
      'Can\'t take reactions',
      'Can still move (unless also restrained/paralyzed/etc.)',
    ],
    savingThrow: null,
    endCondition: 'Varies by source',
    icon: 'x-circle',
    color: '#ef4444',
  },
  Invisible: {
    description: 'An invisible creature is impossible to see without magic or special sense. The creature is heavily obscured for the purpose of hiding.',
    effects: [
      'Considered heavily obscured',
      'Can be detected by noise or tracks',
      'Attack rolls against the creature have disadvantage',
      'The creature\'s attack rolls have advantage',
    ],
    savingThrow: null,
    endCondition: 'Varies — attacking or casting often ends the effect',
    icon: 'eye',
    color: '#818cf8',
  },
  Paralyzed: {
    description: 'A paralyzed creature is incapacitated and can\'t move or speak.',
    effects: [
      'Incapacitated (can\'t take actions or reactions)',
      'Can\'t move or speak',
      'Auto-fails Strength and Dexterity saves',
      'Attack rolls against the creature have advantage',
      'Melee hits from within 5 feet are automatic critical hits',
    ],
    savingThrow: 'Varies by source',
    endCondition: 'Varies — often save at end of turn',
    icon: 'zap-off',
    color: '#dc2626',
  },
  Petrified: {
    description: 'A petrified creature is transformed, along with its nonmagical objects, into a solid inanimate substance (usually stone).',
    effects: [
      'Weight increases by factor of 10',
      'Ceases aging',
      'Incapacitated, can\'t move or speak, unaware of surroundings',
      'Attack rolls against the creature have advantage',
      'Auto-fails Strength and Dexterity saves',
      'Resistance to all damage',
      'Immune to poison and disease (existing ones suspended)',
    ],
    savingThrow: 'Constitution (varies by source)',
    endCondition: 'Greater Restoration or similar magic',
    icon: 'mountain',
    color: '#78716c',
  },
  Poisoned: {
    description: 'A poisoned creature has disadvantage on attack rolls and ability checks.',
    effects: [
      'Disadvantage on attack rolls',
      'Disadvantage on ability checks',
    ],
    savingThrow: 'Constitution (varies by source)',
    endCondition: 'Varies — Lesser Restoration, antitoxin, or time',
    icon: 'skull',
    color: '#22c55e',
  },
  Prone: {
    description: 'A prone creature\'s only movement option is to crawl. Standing up costs half your movement.',
    effects: [
      'Only movement option is crawl (half speed)',
      'Disadvantage on attack rolls',
      'Melee attacks from within 5 feet have advantage against the creature',
      'Ranged attacks from more than 5 feet have disadvantage against the creature',
      'Standing up costs half your movement speed',
    ],
    savingThrow: null,
    endCondition: 'Use half movement to stand up',
    icon: 'arrow-down',
    color: '#a3a3a3',
  },
  Restrained: {
    description: 'A restrained creature\'s speed becomes 0, and it can\'t benefit from any bonus to its speed.',
    effects: [
      'Speed becomes 0',
      'Attack rolls against the creature have advantage',
      'The creature\'s attack rolls have disadvantage',
      'Disadvantage on Dexterity saving throws',
    ],
    savingThrow: 'Strength or Dexterity (varies by source)',
    endCondition: 'Varies — STR check, slashing the restraint, etc.',
    icon: 'link',
    color: '#f97316',
  },
  Stunned: {
    description: 'A stunned creature is incapacitated, can\'t move, and can speak only falteringly.',
    effects: [
      'Incapacitated (can\'t take actions or reactions)',
      'Can\'t move',
      'Can speak only falteringly',
      'Auto-fails Strength and Dexterity saves',
      'Attack rolls against the creature have advantage',
    ],
    savingThrow: 'Constitution (varies by source)',
    endCondition: 'Varies — often save at end of turn',
    icon: 'zap',
    color: '#eab308',
  },
  Unconscious: {
    description: 'An unconscious creature is incapacitated, can\'t move or speak, and is unaware of its surroundings.',
    effects: [
      'Drops whatever it\'s holding and falls prone',
      'Incapacitated, can\'t move or speak',
      'Unaware of surroundings',
      'Auto-fails Strength and Dexterity saves',
      'Attack rolls against the creature have advantage',
      'Melee hits from within 5 feet are automatic critical hits',
    ],
    savingThrow: null,
    endCondition: 'Taking damage or another creature using an action to wake it',
    icon: 'moon',
    color: '#1e293b',
  },
  Exhaustion: {
    description: 'Exhaustion is measured in six levels. Effects are cumulative.',
    effects: [
      'Level 1: Disadvantage on ability checks',
      'Level 2: Speed halved',
      'Level 3: Disadvantage on attack rolls and saving throws',
      'Level 4: Hit point maximum halved',
      'Level 5: Speed reduced to 0',
      'Level 6: Death',
    ],
    savingThrow: null,
    endCondition: 'Long rest reduces by 1 level (with food and water)',
    icon: 'battery-low',
    color: '#ef4444',
  },
};

export function getCondition(name) {
  return CONDITIONS[name] || null;
}

export function getAllConditions() {
  return Object.entries(CONDITIONS).map(([key, c]) => ({ name: key, ...c }));
}

export function getConditionEffects(name) {
  const condition = CONDITIONS[name];
  return condition ? condition.effects : [];
}

export function getAttackModifiers(activeConditions) {
  const mods = { advantage: false, disadvantage: false };
  activeConditions.forEach(c => {
    const cond = CONDITIONS[c];
    if (!cond) return;
    if (['Blinded', 'Poisoned', 'Prone', 'Restrained'].includes(c)) mods.disadvantage = true;
    if (c === 'Invisible') mods.advantage = true;
  });
  return mods;
}

// ── Backward-compatible exports ──
// The old CONDITION_EFFECTS format used by 9+ files across the codebase.

export const CONDITION_EFFECTS = {
  Blinded: {
    attackRolls: 'disadvantage',
    attacksAgainstYou: 'advantage',
    autoFailChecks: ['sight-based'],
    summary: 'Disadvantage on attacks. Attacks against you have advantage.',
    shortTag: 'DIS on attacks',
  },
  Charmed: {
    summary: "Can't attack the charmer. Charmer has advantage on social checks against you.",
    shortTag: 'Social restriction',
  },
  Deafened: {
    autoFailChecks: ['hearing-based'],
    summary: "Can't hear. Auto-fail any check requiring hearing.",
    shortTag: 'No hearing',
  },
  Frightened: {
    attackRolls: 'disadvantage',
    abilityChecks: 'disadvantage',
    summary: 'Disadvantage on ability checks and attacks while source is in sight.',
    shortTag: 'DIS on attacks & checks',
  },
  Grappled: {
    speedOverride: 0,
    summary: 'Speed becomes 0.',
    shortTag: 'Speed 0',
  },
  Incapacitated: {
    cantAct: true,
    summary: "Can't take actions or reactions.",
    shortTag: "Can't act",
  },
  Invisible: {
    attackRolls: 'advantage',
    attacksAgainstYou: 'disadvantage',
    summary: 'Advantage on attacks. Attacks against you have disadvantage.',
    shortTag: 'ADV on attacks',
  },
  Paralyzed: {
    cantAct: true,
    speedOverride: 0,
    autoFailSaves: ['STR', 'DEX'],
    attacksAgainstYou: 'advantage',
    autoCritMelee: true,
    summary: "Can't move or act. Auto-fail STR/DEX saves. Attacks against have advantage and auto-crit within 5ft.",
    shortTag: 'Auto-fail STR/DEX saves',
  },
  Petrified: {
    cantAct: true,
    speedOverride: 0,
    autoFailSaves: ['STR', 'DEX'],
    attacksAgainstYou: 'advantage',
    resistAll: true,
    summary: "Turned to stone. Auto-fail STR/DEX saves. Attacks against have advantage. Resistance to all damage.",
    shortTag: 'Auto-fail STR/DEX saves',
  },
  Poisoned: {
    attackRolls: 'disadvantage',
    abilityChecks: 'disadvantage',
    summary: 'Disadvantage on attack rolls and ability checks.',
    shortTag: 'DIS on attacks & checks',
  },
  Prone: {
    attackRolls: 'disadvantage',
    meleeAgainstYou: 'advantage',
    rangedAgainstYou: 'disadvantage',
    summary: 'Disadvantage on attacks. Melee attacks against you have advantage; ranged have disadvantage.',
    shortTag: 'DIS on attacks',
  },
  Restrained: {
    speedOverride: 0,
    attackRolls: 'disadvantage',
    attacksAgainstYou: 'advantage',
    savePenalty: { DEX: 'disadvantage' },
    summary: 'Speed 0. Disadvantage on attacks and DEX saves. Attacks against you have advantage.',
    shortTag: 'Speed 0, DIS on attacks',
  },
  Stunned: {
    cantAct: true,
    autoFailSaves: ['STR', 'DEX'],
    attacksAgainstYou: 'advantage',
    summary: "Can't act. Auto-fail STR/DEX saves. Attacks against you have advantage.",
    shortTag: 'Auto-fail STR/DEX saves',
  },
  Unconscious: {
    cantAct: true,
    speedOverride: 0,
    autoFailSaves: ['STR', 'DEX'],
    attacksAgainstYou: 'advantage',
    autoCritMelee: true,
    summary: "Unconscious. Auto-fail STR/DEX saves. Attacks against have advantage and auto-crit within 5ft.",
    shortTag: 'Auto-fail STR/DEX saves',
  },
};

/**
 * Compute aggregate effects from a list of active condition names + exhaustion level.
 * Returns a summary object with all net modifiers.
 */
export function computeConditionEffects(activeConditionNames = [], exhaustionLevel = 0) {
  const effects = {
    attackAdvantage: false,
    attackDisadvantage: false,
    checkDisadvantage: false,
    speedOverride: null,
    autoFailSaves: new Set(),
    saveDisadvantage: new Set(),
    attacksAgainstAdvantage: false,
    attacksAgainstDisadvantage: false,
    autoCritMelee: false,
    cantAct: false,
    resistAll: false,
    speedHalved: false,
    saveDisadvantageAll: false,
    hpMaxHalved: false,
    dead: false,
    exhaustionLevel: 0,
    activeEffects: [],
  };

  for (const name of activeConditionNames) {
    const cond = CONDITION_EFFECTS[name];
    if (!cond) continue;
    if (cond.attackRolls === 'advantage') effects.attackAdvantage = true;
    if (cond.attackRolls === 'disadvantage') effects.attackDisadvantage = true;
    if (cond.abilityChecks === 'disadvantage') effects.checkDisadvantage = true;
    if (cond.speedOverride === 0) effects.speedOverride = 0;
    if (cond.autoFailSaves) cond.autoFailSaves.forEach(s => effects.autoFailSaves.add(s));
    if (cond.savePenalty) {
      Object.entries(cond.savePenalty).forEach(([ab, type]) => {
        if (type === 'disadvantage') effects.saveDisadvantage.add(ab);
      });
    }
    if (cond.attacksAgainstYou === 'advantage') effects.attacksAgainstAdvantage = true;
    if (cond.attacksAgainstYou === 'disadvantage') effects.attacksAgainstDisadvantage = true;
    if (cond.autoCritMelee) effects.autoCritMelee = true;
    if (cond.cantAct) effects.cantAct = true;
    if (cond.resistAll) effects.resistAll = true;
    effects.activeEffects.push({ name, ...cond });
  }

  const exh = Math.max(0, Math.min(6, exhaustionLevel || 0));
  if (exh >= 1) { effects.checkDisadvantage = true; effects.activeEffects.push({ name: 'Exhaustion 1', shortTag: 'DIS on ability checks', summary: 'Disadvantage on ability checks.' }); }
  if (exh >= 2) { effects.speedHalved = true; effects.activeEffects.push({ name: 'Exhaustion 2', shortTag: 'Speed halved', summary: 'Speed halved.' }); }
  if (exh >= 3) { effects.attackDisadvantage = true; effects.saveDisadvantageAll = true; effects.activeEffects.push({ name: 'Exhaustion 3', shortTag: 'DIS on attacks & saves', summary: 'Disadvantage on attack rolls and saving throws.' }); }
  if (exh >= 4) { effects.hpMaxHalved = true; effects.activeEffects.push({ name: 'Exhaustion 4', shortTag: 'HP max halved', summary: 'Hit point maximum halved.' }); }
  if (exh >= 5) { effects.speedOverride = 0; effects.activeEffects.push({ name: 'Exhaustion 5', shortTag: 'Speed 0', summary: 'Speed reduced to 0.' }); }
  if (exh >= 6) { effects.dead = true; effects.activeEffects.push({ name: 'Exhaustion 6', shortTag: 'Death', summary: 'Character dies.' }); }
  effects.exhaustionLevel = exh;

  if (effects.attackAdvantage && effects.attackDisadvantage) {
    effects.netAttackMode = 'normal';
  } else if (effects.attackAdvantage) {
    effects.netAttackMode = 'advantage';
  } else if (effects.attackDisadvantage) {
    effects.netAttackMode = 'disadvantage';
  } else {
    effects.netAttackMode = 'normal';
  }

  return effects;
}
