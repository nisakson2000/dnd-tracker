/**
 * Centralized Skill Check Resolver — Phase 6B
 *
 * Replaces scattered dice math with a single resolver that auto-applies
 * proficiency, expertise, advantage/disadvantage, conditions, item bonuses,
 * and spell effects.
 */

// ── Ability score → modifier ──
export function abilityModifier(score) {
  return Math.floor((score - 10) / 2);
}

// ── Roll a d20 ──
function rollD20() {
  return Math.floor(Math.random() * 20) + 1;
}

// ── Roll XdY ──
function rollDice(count, sides) {
  let total = 0;
  const rolls = [];
  for (let i = 0; i < count; i++) {
    const r = Math.floor(Math.random() * sides) + 1;
    rolls.push(r);
    total += r;
  }
  return { total, rolls };
}

// ── Condition effects on checks ──
const CONDITION_CHECK_EFFECTS = {
  blinded: { attackDisadvantage: true },
  charmed: {},
  deafened: {},
  frightened: { abilityCheckDisadvantage: true },
  grappled: { speed0: true },
  incapacitated: { cantAct: true },
  invisible: { attackAdvantage: true },
  paralyzed: { autoFail: ['str_save', 'dex_save'], cantAct: true },
  petrified: { autoFail: ['str_save', 'dex_save'], resistAll: true },
  poisoned: { abilityCheckDisadvantage: true, attackDisadvantage: true },
  prone: { attackDisadvantage: true, meleeAdvantageAgainst: true },
  restrained: { attackDisadvantage: true, dexSaveDisadvantage: true },
  stunned: { autoFail: ['str_save', 'dex_save'], cantAct: true },
  unconscious: { autoFail: ['str_save', 'dex_save'], cantAct: true },
  exhaustion1: { abilityCheckDisadvantage: true },
  exhaustion3: { abilityCheckDisadvantage: true, attackDisadvantage: true, savingThrowDisadvantage: true },
  exhaustion5: { speed0: true, abilityCheckDisadvantage: true, attackDisadvantage: true },
};

// ── Skill → Ability mapping ──
const SKILL_ABILITY_MAP = {
  acrobatics: 'dex', animal_handling: 'wis', arcana: 'int',
  athletics: 'str', deception: 'cha', history: 'int',
  insight: 'wis', intimidation: 'cha', investigation: 'int',
  medicine: 'wis', nature: 'int', perception: 'wis',
  performance: 'cha', persuasion: 'cha', religion: 'int',
  sleight_of_hand: 'dex', stealth: 'dex', survival: 'wis',
};

/**
 * Resolve a skill check with all modifiers applied.
 *
 * @param {Object} params
 * @param {Object} params.abilityScores - { str, dex, con, int, wis, cha }
 * @param {string} params.skill - skill name (e.g., 'perception')
 * @param {number} params.proficiencyBonus - character's proficiency bonus
 * @param {boolean} params.proficient - is the character proficient?
 * @param {boolean} params.expertise - does the character have expertise?
 * @param {string[]} params.conditions - active conditions
 * @param {boolean} params.advantage - forced advantage
 * @param {boolean} params.disadvantage - forced disadvantage
 * @param {number[]} params.bonuses - additional flat bonuses
 * @param {Object[]} params.bonusDice - additional dice bonuses [{count, sides, source}]
 * @param {number} params.dc - target DC (optional, for auto-success/fail)
 * @returns {Object} result
 */
export function resolveSkillCheck({
  abilityScores = {},
  skill = '',
  proficiencyBonus = 2,
  proficient = false,
  expertise = false,
  conditions = [],
  advantage = false,
  disadvantage = false,
  bonuses = [],
  bonusDice = [],
  dc = null,
}) {
  const ability = SKILL_ABILITY_MAP[skill] || 'str';
  const abilityScore = abilityScores[ability] || 10;
  const abilityMod = abilityModifier(abilityScore);

  // Build modifier breakdown
  const breakdown = [];
  let totalModifier = abilityMod;
  breakdown.push({ source: `${ability.toUpperCase()} modifier`, value: abilityMod });

  // Proficiency
  if (expertise) {
    const bonus = proficiencyBonus * 2;
    totalModifier += bonus;
    breakdown.push({ source: 'Expertise', value: bonus });
  } else if (proficient) {
    totalModifier += proficiencyBonus;
    breakdown.push({ source: 'Proficiency', value: proficiencyBonus });
  }

  // Flat bonuses
  for (const b of bonuses) {
    if (b !== 0) {
      totalModifier += b;
      breakdown.push({ source: 'Bonus', value: b });
    }
  }

  // Check conditions for advantage/disadvantage
  let hasAdvantage = advantage;
  let hasDisadvantage = disadvantage;
  const conditionNotes = [];

  for (const cond of conditions) {
    const effect = CONDITION_CHECK_EFFECTS[cond.toLowerCase()];
    if (!effect) continue;
    if (effect.abilityCheckDisadvantage) {
      hasDisadvantage = true;
      conditionNotes.push(`${cond}: disadvantage on ability checks`);
    }
    if (effect.cantAct) {
      conditionNotes.push(`${cond}: cannot take actions`);
    }
  }

  // Roll d20 (with advantage/disadvantage)
  const roll1 = rollD20();
  const roll2 = rollD20();
  let roll;
  let rollType = 'normal';

  if (hasAdvantage && hasDisadvantage) {
    // They cancel out
    roll = roll1;
    rollType = 'normal (adv+disadv cancel)';
  } else if (hasAdvantage) {
    roll = Math.max(roll1, roll2);
    rollType = 'advantage';
  } else if (hasDisadvantage) {
    roll = Math.min(roll1, roll2);
    rollType = 'disadvantage';
  } else {
    roll = roll1;
  }

  // Bonus dice (e.g., Bless 1d4, Guidance 1d4)
  let bonusDiceTotal = 0;
  const bonusDiceResults = [];
  for (const bd of bonusDice) {
    const result = rollDice(bd.count || 1, bd.sides || 4);
    bonusDiceTotal += result.total;
    bonusDiceResults.push({ source: bd.source || 'Bonus die', rolls: result.rolls, total: result.total });
    breakdown.push({ source: bd.source || 'Bonus die', value: result.total });
  }

  const total = roll + totalModifier + bonusDiceTotal;
  const isNat20 = roll === 20;
  const isNat1 = roll === 1;

  const result = {
    roll,
    rolls: rollType !== 'normal' && rollType !== 'normal (adv+disadv cancel)' ? [roll1, roll2] : [roll1],
    rollType,
    modifier: totalModifier,
    bonusDice: bonusDiceResults,
    total,
    isNat20,
    isNat1,
    breakdown,
    conditionNotes,
    skill,
    ability,
  };

  if (dc !== null) {
    result.dc = dc;
    result.success = total >= dc;
    result.margin = total - dc;
  }

  return result;
}

/**
 * Calculate passive check score.
 * Passive = 10 + all modifiers that apply to the check.
 */
export function passiveCheck({
  abilityScores = {},
  skill = '',
  proficiencyBonus = 2,
  proficient = false,
  expertise = false,
  conditions = [],
  bonuses = [],
}) {
  const ability = SKILL_ABILITY_MAP[skill] || 'wis';
  const abilityScore = abilityScores[ability] || 10;
  let total = 10 + abilityModifier(abilityScore);

  if (expertise) {
    total += proficiencyBonus * 2;
  } else if (proficient) {
    total += proficiencyBonus;
  }

  for (const b of bonuses) total += b;

  // Conditions: disadvantage = -5, advantage = +5
  for (const cond of conditions) {
    const effect = CONDITION_CHECK_EFFECTS[cond.toLowerCase()];
    if (effect?.abilityCheckDisadvantage) total -= 5;
  }

  return total;
}

/**
 * Suggest an appropriate DC for a skill check based on party level.
 */
export function suggestDC(partyLevel = 5, difficulty = 'medium') {
  const baseDCs = {
    trivial: 5,
    easy: 8,
    medium: 12,
    hard: 16,
    very_hard: 20,
    nearly_impossible: 25,
  };

  const base = baseDCs[difficulty] || 12;
  // Scale slightly with party level
  const scaling = Math.floor(partyLevel / 4);
  return Math.min(30, base + scaling);
}

/**
 * Resolve a saving throw.
 */
export function resolveSavingThrow({
  abilityScores = {},
  ability = 'str',
  proficiencyBonus = 2,
  proficient = false,
  conditions = [],
  advantage = false,
  disadvantage = false,
  bonuses = [],
  bonusDice = [],
  dc = 10,
}) {
  const abilityScore = abilityScores[ability] || 10;
  const abilityMod = abilityModifier(abilityScore);

  const breakdown = [];
  let totalModifier = abilityMod;
  breakdown.push({ source: `${ability.toUpperCase()} modifier`, value: abilityMod });

  if (proficient) {
    totalModifier += proficiencyBonus;
    breakdown.push({ source: 'Proficiency', value: proficiencyBonus });
  }

  for (const b of bonuses) {
    if (b !== 0) {
      totalModifier += b;
      breakdown.push({ source: 'Bonus', value: b });
    }
  }

  // Check conditions
  let hasAdvantage = advantage;
  let hasDisadvantage = disadvantage;
  const conditionNotes = [];

  for (const cond of conditions) {
    const key = cond.toLowerCase();
    const effect = CONDITION_CHECK_EFFECTS[key];
    if (!effect) continue;
    if (effect.autoFail) {
      const saveKey = `${ability}_save`;
      if (effect.autoFail.includes(saveKey)) {
        return {
          roll: 0, total: 0, dc, success: false, autoFail: true,
          reason: `Auto-fail: ${cond}`, breakdown, conditionNotes: [`${cond}: auto-fail ${ability.toUpperCase()} saves`],
          ability, modifier: totalModifier,
        };
      }
    }
    if (effect.savingThrowDisadvantage || (key === 'restrained' && ability === 'dex')) {
      hasDisadvantage = true;
      conditionNotes.push(`${cond}: disadvantage on ${ability.toUpperCase()} saves`);
    }
  }

  const roll1 = rollD20();
  const roll2 = rollD20();
  let roll;
  let rollType = 'normal';

  if (hasAdvantage && hasDisadvantage) {
    roll = roll1;
    rollType = 'normal';
  } else if (hasAdvantage) {
    roll = Math.max(roll1, roll2);
    rollType = 'advantage';
  } else if (hasDisadvantage) {
    roll = Math.min(roll1, roll2);
    rollType = 'disadvantage';
  } else {
    roll = roll1;
  }

  let bonusDiceTotal = 0;
  for (const bd of bonusDice) {
    const result = rollDice(bd.count || 1, bd.sides || 4);
    bonusDiceTotal += result.total;
    breakdown.push({ source: bd.source || 'Bonus die', value: result.total });
  }

  const total = roll + totalModifier + bonusDiceTotal;

  return {
    roll,
    rolls: rollType !== 'normal' ? [roll1, roll2] : [roll1],
    rollType,
    modifier: totalModifier,
    total,
    dc,
    success: total >= dc,
    margin: total - dc,
    isNat20: roll === 20,
    isNat1: roll === 1,
    breakdown,
    conditionNotes,
    ability,
  };
}

/**
 * Resolve a contested check (two entities rolling opposing skills).
 */
export function resolveContestedCheck(attacker, defender) {
  const attackResult = resolveSkillCheck(attacker);
  const defendResult = resolveSkillCheck(defender);

  return {
    attacker: attackResult,
    defender: defendResult,
    attackerWins: attackResult.total >= defendResult.total,
    tie: attackResult.total === defendResult.total,
    margin: attackResult.total - defendResult.total,
  };
}
