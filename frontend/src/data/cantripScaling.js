/**
 * @file cantripScaling.js
 * @description Cantrip scaling data and helper functions for D&D 5e (2014 & 2024 rules).
 *
 * Roadmap items covered:
 *   - #86: Cantrip scaling (damage dice tiers by character level, per-cantrip data)
 *
 * Exports:
 *   - SCALING_TIERS            — Level thresholds at which cantrip damage dice increase
 *   - DAMAGE_CANTRIPS          — Comprehensive list of damage-dealing cantrips with metadata
 *   - UTILITY_CANTRIPS_WITH_SCALING — Cantrips with non-damage scaling effects
 *   - getDamageDice(cantripName, characterLevel)
 *   - getCantripDamage(cantripName, characterLevel, spellcastingMod)
 *   - getScalingTier(characterLevel)
 *   - getAllDamageCantrips()
 *   - getEldritchBlastBeams(characterLevel)
 */

// ---------------------------------------------------------------------------
// Scaling Tiers
// ---------------------------------------------------------------------------

/**
 * Standard cantrip scaling breakpoints for 5e.
 * At each listed level the base damage dice count increases by 1 (or beams
 * for Eldritch Blast).
 *
 * @type {Array<{ level: number, damageDice: number }>}
 */
export const SCALING_TIERS = [
  { level: 1,  damageDice: 1 },
  { level: 5,  damageDice: 2 },
  { level: 11, damageDice: 3 },
  { level: 17, damageDice: 4 },
];

// ---------------------------------------------------------------------------
// Damage Cantrips
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} DamageCantrip
 * @property {string}  name         — Cantrip name
 * @property {string}  baseDie      — Die expression for one scaling tier (e.g. "1d6")
 * @property {string}  damageType   — Damage type (e.g. "acid")
 * @property {'ranged'|'melee'|'save'} attackType — How the cantrip is resolved
 * @property {string|null} saveAbility — Saving throw ability abbreviation, or null
 * @property {string}  range        — Range as a string (e.g. "60 ft.")
 * @property {'dice'|'beams'} scalingType — Whether scaling adds dice or additional beams
 * @property {string|null} notes    — Optional rules notes or exceptions
 */

/**
 * Comprehensive list of 5e damage-dealing cantrips.
 *
 * @type {DamageCantrip[]}
 */
export const DAMAGE_CANTRIPS = [
  {
    name: "Acid Splash",
    baseDie: "1d6",
    damageType: "acid",
    attackType: "save",
    saveAbility: "DEX",
    range: "60 ft.",
    scalingType: "dice",
    notes: "Can hit two creatures within 5 ft. of each other.",
  },
  {
    name: "Booming Blade",
    baseDie: "1d8",
    damageType: "thunder",
    attackType: "melee",
    saveAbility: null,
    range: "5 ft. (self)",
    scalingType: "dice",
    notes:
      "Requires a melee weapon attack. Extra thunder damage triggers only if the target moves. " +
      "At level 5 adds 1d8 on hit; additional die on movement scales similarly.",
  },
  {
    name: "Chill Touch",
    baseDie: "1d8",
    damageType: "necrotic",
    attackType: "ranged",
    saveAbility: null,
    range: "120 ft.",
    scalingType: "dice",
    notes:
      "Ranged spell attack. Target cannot regain hit points until the start of your next turn. " +
      "Undead targets also have disadvantage on attacks against you.",
  },
  {
    name: "Create Bonfire",
    baseDie: "1d8",
    damageType: "fire",
    attackType: "save",
    saveAbility: "DEX",
    range: "60 ft.",
    scalingType: "dice",
    notes:
      "Creates a 5 ft. cube of fire lasting 1 minute (concentration). " +
      "Any creature that enters or starts its turn in the bonfire makes the save.",
  },
  {
    name: "Eldritch Blast",
    baseDie: "1d10",
    damageType: "force",
    attackType: "ranged",
    saveAbility: null,
    range: "120 ft.",
    scalingType: "beams",
    notes:
      "Scaling adds additional beams rather than additional dice per beam. " +
      "Each beam is a separate ranged spell attack and can target different creatures. " +
      "Invocations (e.g. Agonizing Blast) apply to each beam individually.",
  },
  {
    name: "Fire Bolt",
    baseDie: "1d10",
    damageType: "fire",
    attackType: "ranged",
    saveAbility: null,
    range: "120 ft.",
    scalingType: "dice",
    notes: "Ignites flammable objects not being worn or carried.",
  },
  {
    name: "Frostbite",
    baseDie: "1d6",
    damageType: "cold",
    attackType: "save",
    saveAbility: "CON",
    range: "60 ft.",
    scalingType: "dice",
    notes:
      "On a failed save, target has disadvantage on the next weapon attack roll it makes before the end of its next turn.",
  },
  {
    name: "Green-Flame Blade",
    baseDie: "1d8",
    damageType: "fire",
    attackType: "melee",
    saveAbility: null,
    range: "5 ft. (self)",
    scalingType: "dice",
    notes:
      "Requires a melee weapon attack. On a hit, fire damage leaps to a second creature within 5 ft. " +
      "At level 5 adds 1d8 fire on hit; secondary target also takes 1d8 + spellcasting modifier.",
  },
  {
    name: "Infestation",
    baseDie: "1d6",
    damageType: "poison",
    attackType: "save",
    saveAbility: "CON",
    range: "30 ft.",
    scalingType: "dice",
    notes:
      "On a failed save, the target must use its reaction to move 5 ft. in a random direction.",
  },
  {
    name: "Lightning Lure",
    baseDie: "1d8",
    damageType: "lightning",
    attackType: "save",
    saveAbility: "STR",
    range: "15 ft.",
    scalingType: "dice",
    notes:
      "On a failed save the target is pulled up to 10 ft. straight toward you, " +
      "taking damage if it ends within 5 ft. of you.",
  },
  {
    name: "Poison Spray",
    baseDie: "1d12",
    damageType: "poison",
    attackType: "save",
    saveAbility: "CON",
    range: "10 ft.",
    scalingType: "dice",
    notes: "Highest base die of any single-target damage cantrip.",
  },
  {
    name: "Primal Savagery",
    baseDie: "1d10",
    damageType: "acid",
    attackType: "melee",
    saveAbility: null,
    range: "Self (melee)",
    scalingType: "dice",
    notes:
      "Melee spell attack using your teeth or claws. No material component required.",
  },
  {
    name: "Produce Flame",
    baseDie: "1d8",
    damageType: "fire",
    attackType: "ranged",
    saveAbility: null,
    range: "30 ft.",
    scalingType: "dice",
    notes:
      "Can be used as a light source (20 ft. bright, 20 ft. dim) or thrown as a ranged spell attack.",
  },
  {
    name: "Ray of Frost",
    baseDie: "1d8",
    damageType: "cold",
    attackType: "ranged",
    saveAbility: null,
    range: "60 ft.",
    scalingType: "dice",
    notes: "On a hit, reduces the target's speed by 10 ft. until the start of your next turn.",
  },
  {
    name: "Sacred Flame",
    baseDie: "1d8",
    damageType: "radiant",
    attackType: "save",
    saveAbility: "DEX",
    range: "60 ft.",
    scalingType: "dice",
    notes:
      "The target gains no benefit from cover for this saving throw. " +
      "Ignores most sources of cover that would normally improve AC.",
  },
  {
    name: "Shocking Grasp",
    baseDie: "1d8",
    damageType: "lightning",
    attackType: "melee",
    saveAbility: null,
    range: "Touch",
    scalingType: "dice",
    notes:
      "Advantage on the attack roll if the target is wearing metal armor. " +
      "On a hit, target cannot take reactions until the start of its next turn.",
  },
  {
    name: "Sword Burst",
    baseDie: "1d6",
    damageType: "force",
    attackType: "save",
    saveAbility: "DEX",
    range: "5 ft. (self)",
    scalingType: "dice",
    notes: "Affects all creatures within 5 ft. simultaneously.",
  },
  {
    name: "Thorn Whip",
    baseDie: "1d6",
    damageType: "piercing",
    attackType: "melee",
    saveAbility: null,
    range: "30 ft.",
    scalingType: "dice",
    notes:
      "Melee spell attack with 30 ft. reach. On a hit, pulls the target up to 10 ft. closer to you.",
  },
  {
    name: "Toll the Dead",
    baseDie: "1d8",
    damageType: "necrotic",
    attackType: "save",
    saveAbility: "WIS",
    range: "60 ft.",
    scalingType: "dice",
    notes:
      "If the target is missing any hit points the die increases to 1d12 instead of 1d8.",
  },
  {
    name: "Vicious Mockery",
    baseDie: "1d4",
    damageType: "psychic",
    attackType: "save",
    saveAbility: "WIS",
    range: "60 ft.",
    scalingType: "dice",
    notes:
      "On a failed save, target has disadvantage on the next attack roll it makes before the end of its next turn.",
  },
  {
    name: "Word of Radiance",
    baseDie: "1d6",
    damageType: "radiant",
    attackType: "save",
    saveAbility: "CON",
    range: "5 ft. (self)",
    scalingType: "dice",
    notes: "Affects all creatures of your choice within 5 ft. simultaneously.",
  },
];

// ---------------------------------------------------------------------------
// Utility Cantrips With Scaling
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} UtilityCantripScaling
 * @property {string} name          — Cantrip name
 * @property {string} school        — Magic school
 * @property {string[]} scalingEffects — Human-readable description of how the cantrip scales
 * @property {string|null} notes    — Optional rules notes
 */

/**
 * Cantrips that scale at higher character levels but do not deal direct damage
 * (or have non-damage scaling in addition to any damage).
 * Includes 2024 Player's Handbook (One D&D) scaling where noted.
 *
 * @type {UtilityCantripScaling[]}
 */
export const UTILITY_CANTRIPS_WITH_SCALING = [
  {
    name: "Guidance",
    school: "Divination",
    scalingEffects: [
      "Level 1–4:  1d4 bonus to one ability check.",
      "Level 5–10: 1d6 bonus (2024 rules).",
      "Level 11–16: 1d8 bonus (2024 rules).",
      "Level 17+:  1d10 bonus (2024 rules).",
    ],
    notes:
      "2014 rules: always 1d4. 2024 rules introduce scaling guidance die matching proficiency growth.",
  },
  {
    name: "Mage Hand",
    school: "Conjuration",
    scalingEffects: [
      "Level 1–4:  Carry/manipulate objects up to 10 lb.",
      "Level 5–10: Weight limit increases to 20 lb. (2024 rules).",
      "Level 11–16: Weight limit increases to 30 lb. (2024 rules).",
      "Level 17+:  Weight limit increases to 40 lb. (2024 rules).",
    ],
    notes: "2014 rules: always 10 lb. limit. Weight scaling is a 2024 Player's Handbook change.",
  },
  {
    name: "Prestidigitation",
    school: "Transmutation",
    scalingEffects: [
      "Level 1+:   Standard utility effects (sensory, light cleaning, minor illusions, etc.).",
      "Level 5+:   Can produce minor magical effects lasting 1 hour (2024 rules).",
    ],
    notes:
      "2024 rules extend effect duration from 1 hour to up to 24 hours for some sensory effects at higher tiers.",
  },
  {
    name: "Thaumaturgy",
    school: "Transmutation",
    scalingEffects: [
      "Level 1+:   Up to 3 effects active simultaneously.",
      "Level 5+:   Effect range increases to 60 ft. (2024 rules).",
    ],
    notes: "2014 rules: 30 ft. range throughout.",
  },
  {
    name: "Druidcraft",
    school: "Transmutation",
    scalingEffects: [
      "Level 1+:   Predict weather, cause minor nature effects, snuff flames, create small sensory effects.",
      "Level 5+:   Minor sensory nature effects can persist up to 1 hour (2024 rules).",
    ],
    notes: null,
  },
  {
    name: "True Strike",
    school: "Divination",
    scalingEffects: [
      "Level 1–4:  Advantage on next attack roll against one creature (action, 2014 rules).",
      "2024 revision: Becomes a weapon attack that deals +1d6 radiant and uses your spellcasting modifier; scales with cantrip tiers.",
    ],
    notes:
      "Significantly reworked in 2024 Player's Handbook. In 2024 rules it is effectively a damage cantrip " +
      "but retains its 'strike' flavour rather than a pure damage roll.",
  },
  {
    name: "Resistance",
    school: "Abjuration",
    scalingEffects: [
      "Level 1+:   1d4 bonus to one saving throw (concentration).",
      "Level 5+:   Bonus increases to 1d6 (2024 rules).",
      "Level 11+:  Bonus increases to 1d8 (2024 rules).",
      "Level 17+:  Bonus increases to 1d10 (2024 rules).",
    ],
    notes:
      "2014 rules: always 1d4. 2024 rules mirror the Guidance scaling die progression.",
  },
  {
    name: "Spare the Dying",
    school: "Necromancy",
    scalingEffects: [
      "Level 1+:   Stabilise a dying creature at 0 hp (touch, action).",
      "Level 5+:   Range increases to 15 ft. and becomes a bonus action (2024 rules).",
    ],
    notes: "2024 quality-of-life improvements make this meaningfully stronger at tier 2+.",
  },
];

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Returns the scaling tier entry that applies at the given character level.
 *
 * @param {number} characterLevel — Character's total level (1–20).
 * @returns {{ level: number, damageDice: number }}
 */
export function getScalingTier(characterLevel) {
  const level = Math.max(1, Math.min(20, characterLevel));
  let active = SCALING_TIERS[0];
  for (const tier of SCALING_TIERS) {
    if (level >= tier.level) {
      active = tier;
    }
  }
  return active;
}

/**
 * Returns the number of damage dice (or beams for Eldritch Blast) for a
 * cantrip at the given character level.
 *
 * @param {string} cantripName    — Cantrip name (case-insensitive).
 * @param {number} characterLevel — Character's total level (1–20).
 * @returns {number} Number of dice or beams, or 0 if the cantrip is not found.
 */
export function getDamageDice(cantripName, characterLevel) {
  const cantrip = DAMAGE_CANTRIPS.find(
    (c) => c.name.toLowerCase() === cantripName.toLowerCase()
  );
  if (!cantrip) return 0;

  const tier = getScalingTier(characterLevel);

  // Eldritch Blast scales in beams, not dice — each beam is still 1d10
  if (cantrip.scalingType === "beams") {
    return tier.damageDice; // repurposed as beam count
  }

  return tier.damageDice;
}

/**
 * Returns the number of beams for Eldritch Blast at the given character level.
 * Convenience wrapper around getDamageDice.
 *
 * @param {number} characterLevel — Character's total level (1–20).
 * @returns {number} Number of Eldritch Blast beams (1–4).
 */
export function getEldritchBlastBeams(characterLevel) {
  return getScalingTier(characterLevel).damageDice;
}

/**
 * Returns all damage cantrips.
 *
 * @returns {DamageCantrip[]}
 */
export function getAllDamageCantrips() {
  return DAMAGE_CANTRIPS.slice();
}

/**
 * Builds a human-readable damage expression for a cantrip at a given level,
 * optionally incorporating the caster's spellcasting ability modifier.
 *
 * For Eldritch Blast, the expression shows damage per beam followed by the
 * total beam count (modifier is NOT added automatically since invocations
 * vary — pass spellcastingMod only if Agonizing Blast is active).
 *
 * For melee cantrips that add the spellcasting modifier (e.g. Booming Blade,
 * Green-Flame Blade), the modifier is appended to the first-hit expression.
 *
 * @param {string}      cantripName      — Cantrip name (case-insensitive).
 * @param {number}      characterLevel   — Character's total level (1–20).
 * @param {number|null} [spellcastingMod] — Spellcasting ability modifier (optional).
 * @returns {{ expression: string, diceCount: number, dieSize: number, modifier: number, beams: number|null }|null}
 *   Returns null if the cantrip is not found in DAMAGE_CANTRIPS.
 */
export function getCantripDamage(cantripName, characterLevel, spellcastingMod = null) {
  const cantrip = DAMAGE_CANTRIPS.find(
    (c) => c.name.toLowerCase() === cantripName.toLowerCase()
  );
  if (!cantrip) return null;

  // Parse die size from baseDie (e.g. "1d8" → 8)
  const dieMatch = cantrip.baseDie.match(/\d+d(\d+)/);
  const dieSize = dieMatch ? parseInt(dieMatch[1], 10) : 0;

  const tier = getScalingTier(characterLevel);
  const diceCount = tier.damageDice;
  const mod = typeof spellcastingMod === "number" ? spellcastingMod : 0;

  if (cantrip.scalingType === "beams") {
    const beams = diceCount;
    const modPart = mod !== 0 ? ` + ${mod}` : "";
    const perBeam = `1d${dieSize}${modPart}`;
    const expression =
      beams > 1
        ? `${perBeam} per beam × ${beams} beams`
        : perBeam;
    return {
      expression,
      diceCount: 1,
      dieSize,
      modifier: mod,
      beams,
    };
  }

  // Standard dice scaling
  const diceExpr = `${diceCount}d${dieSize}`;
  const modPart = mod > 0 ? ` + ${mod}` : mod < 0 ? ` - ${Math.abs(mod)}` : "";
  const expression = `${diceExpr}${modPart} ${cantrip.damageType}`;

  return {
    expression,
    diceCount,
    dieSize,
    modifier: mod,
    beams: null,
  };
}
