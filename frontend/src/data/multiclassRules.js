/**
 * @file multiclassRules.js
 * @description Multiclassing prerequisites, proficiency grants, spell slot
 * calculation, and related rules for D&D 5e.
 *
 * Roadmap items covered:
 *   - #84: Multiclass spell slot calculation
 *   - #85: Multiclass prerequisite validation
 *   - #86: Multiclass proficiency grants
 *
 * Exports:
 *   - MULTICLASS_PREREQUISITES        — Ability score requirements to multiclass into each class
 *   - MULTICLASS_PROFICIENCIES        — Reduced proficiency grants when multiclassing into a class
 *   - CASTER_TYPE_TABLE               — How each class/subclass contributes to combined caster level
 *   - MULTICLASS_SPELL_SLOTS          — PHB combined caster level → spell slots table (levels 1–20)
 *   - EXTRA_ATTACK_STACKING           — Rules on Extra Attack stacking across classes
 *   - checkMulticlassEligibility(currentClass, currentAbilities, targetClass)
 *   - getMulticlassProficiencies(targetClass)
 *   - calculateCombinedCasterLevel(classLevels)
 *   - getMulticlassSpellSlots(combinedCasterLevel)
 *   - canMulticlassOut(currentClass, abilities)
 *
 * No React imports. Pure data and utility exports only.
 * Reference: PHB pp. 163–165.
 */

// ---------------------------------------------------------------------------
// 1. MULTICLASS_PREREQUISITES
// ---------------------------------------------------------------------------

/**
 * Ability score minimums required to multiclass INTO a given class.
 * A character must also meet the prerequisites of their CURRENT class to
 * multiclass out (see canMulticlassOut).
 *
 * PHB p. 163.
 *
 * Each entry is an array of requirement objects. Multiple objects in the array
 * are treated as AND (all must be met). When a requirement has multiple keys
 * inside a single object they are treated as OR (any one satisfies it).
 *
 * @type {Object.<string, Array<{ability: string|string[], score: number}>>}
 */
export const MULTICLASS_PREREQUISITES = {
  Barbarian: [
    { ability: 'STR', score: 13 },
  ],
  Bard: [
    { ability: 'CHA', score: 13 },
  ],
  Cleric: [
    { ability: 'WIS', score: 13 },
  ],
  Druid: [
    { ability: 'WIS', score: 13 },
  ],
  Fighter: [
    // OR: STR 13 or DEX 13
    { ability: ['STR', 'DEX'], score: 13 },
  ],
  Monk: [
    { ability: 'DEX', score: 13 },
    { ability: 'WIS', score: 13 },
  ],
  Paladin: [
    { ability: 'STR', score: 13 },
    { ability: 'CHA', score: 13 },
  ],
  Ranger: [
    { ability: 'DEX', score: 13 },
    { ability: 'WIS', score: 13 },
  ],
  Rogue: [
    { ability: 'DEX', score: 13 },
  ],
  Sorcerer: [
    { ability: 'CHA', score: 13 },
  ],
  Warlock: [
    { ability: 'CHA', score: 13 },
  ],
  Wizard: [
    { ability: 'INT', score: 13 },
  ],
};

// ---------------------------------------------------------------------------
// 2. MULTICLASS_PROFICIENCIES
// ---------------------------------------------------------------------------

/**
 * Proficiencies gained when multiclassing INTO a class for the first time.
 * These are the reduced multiclass proficiency grants from PHB Table "Multiclassing
 * Proficiencies" (p. 164) — NOT the full class starting proficiencies.
 *
 * @type {Object.<string, {armor: string[], weapons: string[], tools: string[], skills: string|null, skillCount: number}>}
 */
export const MULTICLASS_PROFICIENCIES = {
  Barbarian: {
    armor: ['shields', 'light armor', 'medium armor'],
    weapons: ['simple weapons', 'martial weapons'],
    tools: [],
    skills: null,
    skillCount: 0,
    notes: 'No skill proficiencies granted on multiclass.',
  },
  Bard: {
    armor: ['light armor'],
    weapons: [],
    tools: ['one musical instrument of your choice'],
    skills: 'any',
    skillCount: 1,
    notes: 'Choose 1 skill from the Bard skill list.',
  },
  Cleric: {
    armor: ['light armor', 'medium armor', 'shields'],
    weapons: [],
    tools: [],
    skills: null,
    skillCount: 0,
    notes: 'No skill proficiencies granted on multiclass.',
  },
  Druid: {
    armor: ['light armor', 'medium armor', 'shields'],
    weapons: [],
    tools: [],
    skills: null,
    skillCount: 0,
    notes: 'Druids will not wear armor or use shields made of metal.',
  },
  Fighter: {
    armor: ['light armor', 'medium armor', 'shields'],
    weapons: ['simple weapons', 'martial weapons'],
    tools: [],
    skills: null,
    skillCount: 0,
    notes: 'No skill proficiencies granted on multiclass.',
  },
  Monk: {
    armor: [],
    weapons: ['simple weapons', 'shortswords'],
    tools: [],
    skills: null,
    skillCount: 0,
    notes: 'No skill proficiencies granted on multiclass.',
  },
  Paladin: {
    armor: ['light armor', 'medium armor', 'shields'],
    weapons: ['simple weapons', 'martial weapons'],
    tools: [],
    skills: null,
    skillCount: 0,
    notes: 'No skill proficiencies granted on multiclass.',
  },
  Ranger: {
    armor: ['light armor', 'medium armor', 'shields'],
    weapons: ['simple weapons', 'martial weapons'],
    tools: [],
    skills: 'Ranger list',
    skillCount: 1,
    notes: 'Choose 1 skill from the Ranger skill list.',
  },
  Rogue: {
    armor: ['light armor'],
    weapons: [],
    tools: ["thieves' tools"],
    skills: 'Rogue list',
    skillCount: 1,
    notes: 'Choose 1 skill from the Rogue skill list.',
  },
  Sorcerer: {
    armor: [],
    weapons: [],
    tools: [],
    skills: null,
    skillCount: 0,
    notes: 'No proficiencies granted on multiclass.',
  },
  Warlock: {
    armor: ['light armor'],
    weapons: ['simple weapons'],
    tools: [],
    skills: null,
    skillCount: 0,
    notes: 'No skill proficiencies granted on multiclass.',
  },
  Wizard: {
    armor: [],
    weapons: [],
    tools: [],
    skills: null,
    skillCount: 0,
    notes: 'No proficiencies granted on multiclass.',
  },
};

// ---------------------------------------------------------------------------
// 3. CASTER_TYPE_TABLE
// ---------------------------------------------------------------------------

/**
 * Defines how each class or subclass contributes to the combined caster level
 * used to determine multiclass spell slots (PHB p. 165).
 *
 * multiplier: how each class level translates to a caster level contribution.
 *   1     — full caster  (add full level)
 *   0.5   — half caster  (add floor(level / 2))
 *   0.333 — third caster (add floor(level / 3))
 *   0     — pact caster  (Warlock uses a separate pact magic pool; not combined)
 *   null  — non-caster   (no contribution)
 *
 * @type {Object.<string, {casterType: string, multiplier: number|null, notes: string}>}
 */
export const CASTER_TYPE_TABLE = {
  Bard: {
    casterType: 'full',
    multiplier: 1,
    notes: 'Full caster. Add all Bard levels to combined caster level.',
  },
  Cleric: {
    casterType: 'full',
    multiplier: 1,
    notes: 'Full caster. Add all Cleric levels to combined caster level.',
  },
  Druid: {
    casterType: 'full',
    multiplier: 1,
    notes: 'Full caster. Add all Druid levels to combined caster level.',
  },
  Sorcerer: {
    casterType: 'full',
    multiplier: 1,
    notes: 'Full caster. Add all Sorcerer levels to combined caster level.',
  },
  Wizard: {
    casterType: 'full',
    multiplier: 1,
    notes: 'Full caster. Add all Wizard levels to combined caster level.',
  },
  Paladin: {
    casterType: 'half',
    multiplier: 0.5,
    notes: 'Half caster. Add floor(Paladin level / 2) to combined caster level.',
  },
  Ranger: {
    casterType: 'half',
    multiplier: 0.5,
    notes: 'Half caster. Add floor(Ranger level / 2) to combined caster level.',
  },
  'Eldritch Knight': {
    casterType: 'third',
    multiplier: 1 / 3,
    notes: 'Fighter subclass. Add floor(Fighter level / 3) to combined caster level.',
  },
  'Arcane Trickster': {
    casterType: 'third',
    multiplier: 1 / 3,
    notes: 'Rogue subclass. Add floor(Rogue level / 3) to combined caster level.',
  },
  Warlock: {
    casterType: 'pact',
    multiplier: 0,
    notes:
      'Pact caster. Warlock spell slots are tracked separately using Pact Magic ' +
      'and do NOT contribute to or consume the combined spell slot pool.',
  },
  // Non-casters (for completeness in multi-class tracking)
  Barbarian: { casterType: 'none', multiplier: null, notes: 'Non-caster. No contribution to combined caster level.' },
  Fighter: { casterType: 'none', multiplier: null, notes: 'Non-caster (unless Eldritch Knight subclass).' },
  Monk: { casterType: 'none', multiplier: null, notes: 'Non-caster. No contribution to combined caster level.' },
  Rogue: { casterType: 'none', multiplier: null, notes: 'Non-caster (unless Arcane Trickster subclass).' },
};

// ---------------------------------------------------------------------------
// 4. MULTICLASS_SPELL_SLOTS
// ---------------------------------------------------------------------------

/**
 * Combined caster level → available spell slots, per PHB p. 165, Table
 * "Multiclass Spellcaster: Spell Slots per Spell Level".
 *
 * Index 0 is unused (no level 0). Levels 1–20 map to slots arrays where each
 * position represents slots available for spell levels 1–9.
 *
 * slots[combinedCasterLevel] = [1st, 2nd, 3rd, 4th, 5th, 6th, 7th, 8th, 9th]
 *
 * @type {Array<number[]>}
 */
export const MULTICLASS_SPELL_SLOTS = [
  // level 0 — placeholder
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  // level 1
  [2, 0, 0, 0, 0, 0, 0, 0, 0],
  // level 2
  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  // level 3
  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  // level 4
  [4, 3, 0, 0, 0, 0, 0, 0, 0],
  // level 5
  [4, 3, 2, 0, 0, 0, 0, 0, 0],
  // level 6
  [4, 3, 3, 0, 0, 0, 0, 0, 0],
  // level 7
  [4, 3, 3, 1, 0, 0, 0, 0, 0],
  // level 8
  [4, 3, 3, 2, 0, 0, 0, 0, 0],
  // level 9
  [4, 3, 3, 3, 1, 0, 0, 0, 0],
  // level 10
  [4, 3, 3, 3, 2, 0, 0, 0, 0],
  // level 11
  [4, 3, 3, 3, 2, 1, 0, 0, 0],
  // level 12
  [4, 3, 3, 3, 2, 1, 0, 0, 0],
  // level 13
  [4, 3, 3, 3, 2, 1, 1, 0, 0],
  // level 14
  [4, 3, 3, 3, 2, 1, 1, 0, 0],
  // level 15
  [4, 3, 3, 3, 2, 1, 1, 1, 0],
  // level 16
  [4, 3, 3, 3, 2, 1, 1, 1, 0],
  // level 17
  [4, 3, 3, 3, 2, 1, 1, 1, 1],
  // level 18
  [4, 3, 3, 3, 3, 1, 1, 1, 1],
  // level 19
  [4, 3, 3, 3, 3, 2, 1, 1, 1],
  // level 20
  [4, 3, 3, 3, 3, 2, 2, 1, 1],
];

// ---------------------------------------------------------------------------
// 5. EXTRA_ATTACK_STACKING
// ---------------------------------------------------------------------------

/**
 * Rules governing Extra Attack when multiclassing (PHB p. 165).
 *
 * Key rule: If you gain Extra Attack from multiple classes it does NOT stack —
 * you use the highest version available. The sole exception is the Fighter's
 * improved Extra Attack (3 attacks at Fighter 11, 4 at Fighter 20), which
 * applies only if you have sufficient Fighter levels regardless of other classes.
 *
 * @type {Object}
 */
export const EXTRA_ATTACK_STACKING = {
  rule: 'Extra Attack does not stack between classes. Use the highest version available.',
  exception:
    "Fighter's additional attacks (3 attacks at level 11, 4 at level 20) are tied " +
    'to Fighter level and apply independently of other class Extra Attack features.',
  classesWithExtraAttack: {
    Barbarian: { level: 5, attacks: 2 },
    Fighter: [
      { level: 5, attacks: 2 },
      { level: 11, attacks: 3 },
      { level: 20, attacks: 4 },
    ],
    Monk: { level: 5, attacks: 2 },
    Paladin: { level: 5, attacks: 2 },
    Ranger: { level: 5, attacks: 2 },
    Warlock: {
      level: 5,
      attacks: 2,
      note: 'Pact of the Blade with Thirsting Blade invocation only.',
    },
  },
  stackingNote:
    'A Fighter 11 / Ranger 5 character makes 3 attacks (from Fighter 11), not 4. ' +
    'The Ranger Extra Attack does not add on top of the Fighter version.',
};

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/**
 * Checks whether a character meets the ability score prerequisites to
 * multiclass INTO a target class.
 *
 * @param {string} currentClass      - The character's primary (current) class name.
 * @param {Object} currentAbilities  - Ability scores: { STR, DEX, CON, INT, WIS, CHA }
 * @param {string} targetClass       - The class the character wants to multiclass into.
 * @returns {{ eligible: boolean, failures: string[], warnings: string[] }}
 */
export function checkMulticlassEligibility(currentClass, currentAbilities, targetClass) {
  const result = { eligible: true, failures: [], warnings: [] };

  const prereqs = MULTICLASS_PREREQUISITES[targetClass];
  if (!prereqs) {
    result.warnings.push(`No prerequisite data found for class "${targetClass}".`);
    return result;
  }

  for (const req of prereqs) {
    const abilities = Array.isArray(req.ability) ? req.ability : [req.ability];
    const satisfied = abilities.some((ab) => (currentAbilities[ab] ?? 0) >= req.score);
    if (!satisfied) {
      const label = abilities.join(' or ');
      result.eligible = false;
      result.failures.push(`Requires ${label} ${req.score} (have ${abilities.map((ab) => `${ab} ${currentAbilities[ab] ?? 0}`).join(' / ')}).`);
    }
  }

  // Remind caller to also verify multiclass-out prereqs for current class
  if (currentClass && MULTICLASS_PREREQUISITES[currentClass]) {
    result.warnings.push(
      `Also verify you meet the prerequisites for your current class (${currentClass}) to multiclass out.`
    );
  }

  return result;
}

/**
 * Returns the multiclass proficiency grants for a given target class.
 *
 * @param {string} targetClass - The class being multiclassed into.
 * @returns {Object|null} The proficiency grant object, or null if not found.
 */
export function getMulticlassProficiencies(targetClass) {
  return MULTICLASS_PROFICIENCIES[targetClass] ?? null;
}

/**
 * Calculates the combined caster level from a map of class names to levels.
 * Warlock levels are excluded from the combined pool (Pact Magic is separate).
 * Subclasses (Eldritch Knight, Arcane Trickster) must be passed explicitly.
 *
 * @param {Object.<string, number>} classLevels
 *   Map of class/subclass name to level, e.g.:
 *   { Wizard: 5, Paladin: 3, 'Eldritch Knight': 4 }
 *   For Eldritch Knight pass the Fighter level under the 'Eldritch Knight' key.
 *   For Arcane Trickster pass the Rogue level under the 'Arcane Trickster' key.
 * @returns {{ combinedCasterLevel: number, breakdown: Object[], warlockLevels: number }}
 */
export function calculateCombinedCasterLevel(classLevels) {
  const breakdown = [];
  let total = 0;
  let warlockLevels = 0;

  for (const [className, level] of Object.entries(classLevels)) {
    if (!level || level < 1) continue;

    const entry = CASTER_TYPE_TABLE[className];
    if (!entry || entry.multiplier === null) {
      breakdown.push({ class: className, level, contribution: 0, casterType: 'none' });
      continue;
    }
    if (entry.casterType === 'pact') {
      warlockLevels += level;
      breakdown.push({ class: className, level, contribution: 0, casterType: 'pact' });
      continue;
    }

    const contribution = Math.floor(level * entry.multiplier);
    total += contribution;
    breakdown.push({ class: className, level, contribution, casterType: entry.casterType });
  }

  return {
    combinedCasterLevel: Math.min(total, 20),
    breakdown,
    warlockLevels,
  };
}

/**
 * Returns the spell slot array for a given combined caster level.
 *
 * @param {number} combinedCasterLevel - An integer from 1 to 20.
 * @returns {number[]} Array of 9 numbers representing slots per spell level (1–9),
 *   or an array of zeros if the level is out of range.
 */
export function getMulticlassSpellSlots(combinedCasterLevel) {
  const level = Math.floor(combinedCasterLevel);
  if (level < 1 || level > 20) {
    return [0, 0, 0, 0, 0, 0, 0, 0, 0];
  }
  return [...MULTICLASS_SPELL_SLOTS[level]];
}

/**
 * Checks whether a character meets the prerequisites of their current class
 * in order to multiclass OUT (i.e., take a level in a new class).
 *
 * This is the same prerequisite table — the PHB requires meeting the prereqs
 * of BOTH the current class and the target class before multiclassing.
 *
 * @param {string} currentClass - The class to check exit prerequisites for.
 * @param {Object} abilities    - Ability scores: { STR, DEX, CON, INT, WIS, CHA }
 * @returns {{ canLeave: boolean, failures: string[] }}
 */
export function canMulticlassOut(currentClass, abilities) {
  const result = { canLeave: true, failures: [] };

  const prereqs = MULTICLASS_PREREQUISITES[currentClass];
  if (!prereqs) {
    // No listed prereqs for this class (or unrecognised class) — allow by default
    return result;
  }

  for (const req of prereqs) {
    const abilityList = Array.isArray(req.ability) ? req.ability : [req.ability];
    const satisfied = abilityList.some((ab) => (abilities[ab] ?? 0) >= req.score);
    if (!satisfied) {
      result.canLeave = false;
      const label = abilityList.join(' or ');
      result.failures.push(
        `${currentClass} requires ${label} ${req.score} to multiclass out ` +
          `(have ${abilityList.map((ab) => `${ab} ${abilities[ab] ?? 0}`).join(' / ')}).`
      );
    }
  }

  return result;
}
