/**
 * D&D 5e Condition Mechanical Effects
 *
 * Each condition maps to its RAW (Rules As Written) effects.
 * Used by useConditionEffects hook to compute net modifiers.
 */

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
 * Compute aggregate effects from a list of active condition names.
 * Returns a summary object with all net modifiers.
 */
export function computeConditionEffects(activeConditionNames = []) {
  const effects = {
    // Attack rolls
    attackAdvantage: false,
    attackDisadvantage: false,
    // Ability checks
    checkDisadvantage: false,
    // Speed
    speedOverride: null, // null = no override, 0 = speed becomes 0
    // Saving throws
    autoFailSaves: new Set(),       // e.g. Set(['STR', 'DEX'])
    saveDisadvantage: new Set(),    // e.g. Set(['DEX'])
    // Attacks against you
    attacksAgainstAdvantage: false,
    attacksAgainstDisadvantage: false,
    autoCritMelee: false,
    // Other
    cantAct: false,
    resistAll: false,
    // Active effect list for display
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

  // D&D rule: if you have both advantage and disadvantage, they cancel out
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
