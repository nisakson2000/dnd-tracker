/**
 * Special Combat Rules — Advanced and optional combat mechanics for D&D 5e.
 * Covers roadmap items:
 *   34  — Flanking (optional adjacency-based advantage)
 *   37  — Underwater Combat (weapon penalties, breath holding)
 *   38  — Aerial Combat (altitude tiers, hover vs fly, 3D reach)
 *   40  — Grapple & Shove (contested rolls, conditions, size limits)
 *   41  — Two-Weapon Fighting (light weapon rule, bonus action attack)
 *   54  — Minion Rules (optional 1 HP, simplified saves)
 *   56  — Swarm Mechanics (damage scaling, resistance, space sharing)
 */

// ---------------------------------------------------------------------------
// 1. Flanking (Roadmap item 34)
// ---------------------------------------------------------------------------

export const FLANKING_RULES = {
  label: 'Flanking',
  isOptional: true,
  source: 'DMG p. 251',
  summary:
    'When two allies are on exactly opposite sides of an enemy, each gains advantage on melee attack rolls against that enemy.',
  requirement:
    'Both creatures must be within melee reach of the target and able to see it. Neither may be incapacitated.',
  benefit: 'Advantage on melee attack rolls against the flanked target.',
  rules: [
    {
      title: 'Opposite Sides (Grid)',
      description:
        'On a grid, draw an imaginary line between the centers of the two flanking creatures. The line must pass through opposite sides or opposite corners of the target\'s space.',
    },
    {
      title: 'Melee Only',
      description:
        'Flanking applies only to melee attack rolls. Ranged attacks receive no flanking benefit.',
    },
    {
      title: 'Reach Counts',
      description:
        'A creature with a reach weapon (10 ft reach) can be part of a flanking pair from farther away, provided the line still passes through opposite sides of the target.',
    },
    {
      title: 'Conscious and Capable',
      description:
        'An incapacitated flanker or one that cannot see the target does not count for flanking purposes.',
    },
    {
      title: 'Why It\'s Optional',
      description:
        'Flanking can make advantage too easy to obtain in group combat, potentially reducing tactical variety. The DM should decide whether to use this rule at session zero.',
    },
  ],
  variantOptions: [
    {
      name: 'Standard Flanking',
      description:
        'Exactly opposite sides required (PHB/DMG default). Grants advantage.',
    },
    {
      name: 'Flanking Bonus (Flat)',
      description:
        'Some tables use a flat +2 bonus instead of advantage to prevent it from overshadowing other tactics.',
    },
    {
      name: 'Three-Creature Flanking',
      description:
        'A few DMs require three attackers around a target before any flanking bonus applies, making it harder to achieve.',
    },
  ],
};

// ---------------------------------------------------------------------------
// 2. Underwater Combat (Roadmap item 37)
// ---------------------------------------------------------------------------

export const UNDERWATER_COMBAT = {
  label: 'Underwater Combat',
  source: 'PHB p. 198',
  summary:
    'Most weapons are ineffective underwater. Ranged weapons are severely hampered. Creatures without a swim speed are impeded.',
  meleeRules: [
    {
      title: 'Disadvantage on Most Melee Attacks',
      description:
        'A creature makes melee weapon attacks with disadvantage unless it has a swim speed or the weapon is a dagger, javelin, shortsword, spear, or trident.',
    },
    {
      title: 'Immune Weapon Types (no penalty)',
      description:
        'The following melee weapons function normally underwater: dagger, javelin, shortsword, spear, trident.',
      immuneWeapons: ['dagger', 'javelin', 'shortsword', 'spear', 'trident'],
    },
    {
      title: 'Swim Speed Exception',
      description:
        'Creatures with a natural swim speed (e.g., merfolk, water elementals) make melee weapon attacks normally with any weapon.',
    },
  ],
  rangedRules: [
    {
      title: 'Ranged Weapon Attacks — Automatic Miss',
      description:
        'A ranged weapon attack automatically misses a target beyond its normal range. Even within normal range it is made with disadvantage, unless the weapon is a crossbow, net, or a weapon that is thrown (javelin, spear, trident, dart).',
      exceptions: ['crossbow', 'net', 'javelin', 'spear', 'trident', 'dart'],
    },
    {
      title: 'Fire Damage Immunity',
      description:
        'Creatures and objects that are fully submerged are immune to fire damage.',
    },
  ],
  breathHolding: {
    label: 'Breath Holding',
    source: 'PHB p. 183',
    formula: 'CON modifier + 1 minutes (minimum 30 seconds)',
    detail:
      'A creature can hold its breath for a number of minutes equal to 1 + its Constitution modifier (minimum 30 seconds). When it runs out of breath, it can survive for a number of rounds equal to its Constitution modifier (minimum 1 round). At the start of its next turn after those rounds end, it drops to 0 hit points and is dying.',
    suffocationRounds: 'CON modifier (minimum 1 round) after breath runs out',
  },
  swimSpeedRules: [
    {
      title: 'No Swim Speed — Double Cost',
      description:
        'A creature without a swim speed must spend 2 feet of movement for every 1 foot it swims.',
    },
    {
      title: 'Swim Speed — Normal Cost',
      description:
        'A creature with a swim speed moves through water at 1:1 movement cost without penalty.',
    },
    {
      title: 'Difficult Terrain Stacks',
      description:
        'Strong currents, thick seaweed, or magical effects can impose difficult terrain underwater, doubling movement costs on top of the existing swim penalty.',
    },
  ],
};

// ---------------------------------------------------------------------------
// 3. Aerial Combat (Roadmap item 38)
// ---------------------------------------------------------------------------

export const AERIAL_COMBAT = {
  label: 'Aerial Combat',
  source: 'PHB p. 191, DMG p. 119',
  summary:
    'Flying creatures operate in three dimensions. Altitude affects tactical options, falling is lethal, and hovering creatures have advantages over those that cannot.',
  altitudeTiers: [
    {
      key: 'ground',
      label: 'Ground Level',
      heightRange: '0 ft',
      description:
        'The creature is on the ground or a surface. Normal combat rules apply. Flying creatures that land here lose their fly altitude.',
    },
    {
      key: 'low',
      label: 'Low Altitude',
      heightRange: '1–30 ft',
      description:
        'Within reach of most ranged and some thrown weapons from the ground. Melee is possible with reach weapons or by jumping. Falling deals 1d6 bludgeoning per 10 ft (up to 3d6).',
    },
    {
      key: 'high',
      label: 'High Altitude',
      heightRange: '31–100 ft',
      description:
        'Out of normal melee range from the ground. Most ranged weapons can still target this altitude. Falling deals up to 10d6 bludgeoning damage.',
    },
    {
      key: 'extreme',
      label: 'Extreme Altitude',
      heightRange: '101 ft+',
      description:
        'Beyond the normal range of most ranged weapons (typically 150–600 ft max). Magic is often the only option to engage from the ground. Falling deals 20d6 bludgeoning damage (max fall damage).',
    },
  ],
  fallingRules: {
    label: 'Falling from Flight',
    damage: '1d6 bludgeoning per 10 feet fallen, max 20d6',
    onIncapacitation:
      'If a flying creature is incapacitated or its speed drops to 0 mid-flight, it falls — unless it has the hover ability or is held aloft by magic.',
    hoverException:
      'Creatures with the Hover trait (e.g., Beholder, Couatl) do not fall when incapacitated. They remain aloft until their speed returns.',
    proneFlight:
      'A flying creature knocked prone must use movement to right itself, and cannot fly if its speed is reduced to 0.',
  },
  hoverVsFly: [
    {
      title: 'Fly Speed (No Hover)',
      description:
        'Must keep moving or fall. Stopping in mid-air requires the creature to still be technically moving enough to maintain altitude. Going prone triggers falling unless it can hover.',
    },
    {
      title: 'Hover Trait',
      description:
        'The creature can remain stationary in the air without falling. It is immune to the flying + prone = falling rule.',
    },
    {
      title: 'Magical Flight',
      description:
        'Spells like Fly grant a fly speed but not hover; the target can still fall if incapacitated. Levitate grants hover behavior.',
    },
  ],
  threeDReach: {
    label: '3D Reach in Aerial Combat',
    description:
      'Reach in aerial combat extends in all directions, including up and down. A creature with 5 ft reach threatens a 5 ft cube around itself; reach weapons extend this to 10 ft in all directions.',
    diagonalNote:
      'On a 3D grid, moving diagonally upward costs movement normally (5 ft per diagonal). Some tables use the optional "every other diagonal costs 10 ft" rule for precision.',
  },
  specialRules: [
    {
      title: 'Charging from Above',
      description:
        'A creature that dives at least 30 ft straight down before attacking may (DM discretion) gain advantage on the attack, representing a diving strike. The creature must land or use movement to pull up afterward.',
    },
    {
      title: 'Wind Effects',
      description:
        'Strong winds (30+ mph) impose disadvantage on ranged weapon attack rolls and Wisdom (Perception) checks relying on hearing. Extreme winds may require STR or Athletics checks to fly at all.',
    },
    {
      title: 'Aerial Grappling',
      description:
        'If a flying creature is grappled, the grappler controls direction of movement. If neither creature can fly and the grappled creature was the only one flying, both fall.',
    },
  ],
};

// ---------------------------------------------------------------------------
// 4. Grapple & Shove (Roadmap item 40)
// ---------------------------------------------------------------------------

export const GRAPPLE_SHOVE = {
  label: 'Grapple & Shove',
  source: 'PHB p. 195',
  summary:
    'Special melee attacks that impose conditions rather than deal damage. Both replace one of a creature\'s attacks when using the Attack action.',
  grapple: {
    label: 'Grapple',
    actionCost: 'Replaces one Attack (requires Attack action)',
    requirement: 'At least one free hand. Target must be within reach.',
    sizeLimit: 'Target can be no more than one size larger than the attacker.',
    contest: {
      attacker: 'Strength (Athletics)',
      defender: 'Strength (Athletics) OR Dexterity (Acrobatics) — defender\'s choice',
    },
    onSuccess: {
      condition: 'Grappled',
      effect: 'Target\'s speed becomes 0. It cannot benefit from bonuses to speed.',
    },
    onFailure: 'Nothing happens. The grapple attempt fails.',
    endingGrapple: [
      { method: 'Escape', description: 'The grappled creature uses its action to make a Strength (Athletics) or Dexterity (Acrobatics) check (DC = grappler\'s Athletics result). Success ends the grappled condition.' },
      { method: 'Incapacitation', description: 'If the grappler is incapacitated, the grappled condition ends automatically.' },
      { method: 'Forced Separation', description: 'An effect that removes the grappled creature from reach of the grappler (teleport, Thunderwave, etc.) ends the grapple.' },
      { method: 'Release', description: 'The grappler can release the grapple for free at any time — no action required.' },
    ],
    movingGrappledCreature:
      'The grappler can drag or carry the grappled creature, but its speed is halved (unless the creature is two or more sizes smaller).',
  },
  shove: {
    label: 'Shove',
    actionCost: 'Replaces one Attack (requires Attack action)',
    requirement: 'Target must be within reach.',
    sizeLimit: 'Target can be no more than one size larger than the attacker.',
    contest: {
      attacker: 'Strength (Athletics)',
      defender: 'Strength (Athletics) OR Dexterity (Acrobatics) — defender\'s choice',
    },
    onSuccess: {
      options: [
        { choice: 'Knock Prone', condition: 'Prone', effect: 'Target falls prone. Melee attacks against it have advantage; ranged attacks have disadvantage. Gets up by spending half its speed.' },
        { choice: 'Push 5 ft', condition: null, effect: 'Target is pushed 5 feet directly away from the attacker.' },
      ],
    },
    onFailure: 'Nothing happens. The shove attempt fails.',
    specialInteractions: [
      { name: 'Shield Master Feat', description: 'Allows a bonus action shove after taking the Attack action, enabling shove + attack combos.' },
      { name: 'Pushing off Ledges', description: 'The DM may rule that a successful shove toward a ledge or pit sends the target over the edge, potentially triggering a fall.' },
    ],
  },
};

// ---------------------------------------------------------------------------
// 5. Two-Weapon Fighting (Roadmap item 41)
// ---------------------------------------------------------------------------

export const TWO_WEAPON_FIGHTING = {
  label: 'Two-Weapon Fighting',
  source: 'PHB p. 195',
  summary:
    'When wielding a light weapon in each hand, you can attack with both — but the off-hand attack uses your bonus action and normally deals no bonus damage from your ability modifier.',
  coreRules: [
    {
      title: 'Light Weapon Requirement',
      description:
        'Both the main-hand and off-hand weapon must have the Light property (e.g., shortsword, handaxe, dagger, scimitar). You cannot use two-weapon fighting with a longsword and a shortsword without the Dual Wielder feat.',
    },
    {
      title: 'Bonus Action Attack',
      description:
        'After taking the Attack action with a light melee weapon, you can use your bonus action to attack with a different light melee weapon in your other hand.',
    },
    {
      title: 'No Ability Modifier to Damage (Off-Hand)',
      description:
        'You do NOT add your ability modifier (STR or DEX) to the damage roll of the bonus off-hand attack, unless the modifier is negative (negative modifiers always apply).',
    },
    {
      title: 'Thrown Weapons',
      description:
        'You can use two-weapon fighting with a thrown light weapon (e.g., daggers, handaxes). You must draw both weapons before throwing; the free object interaction covers one draw.',
    },
    {
      title: 'One Bonus Action per Turn',
      description:
        'The off-hand attack uses your bonus action. If you have already used your bonus action for another purpose (spell, class feature), you cannot also make the off-hand attack.',
    },
  ],
  fightingStyle: {
    name: 'Two-Weapon Fighting (Fighting Style)',
    classes: ['Fighter', 'Ranger'],
    benefit:
      'When you engage in two-weapon fighting, you CAN add your ability modifier to the damage of the extra off-hand attack. This removes the usual "no ability mod" restriction.',
  },
  dualWielderFeat: {
    name: 'Dual Wielder',
    benefits: [
      '+1 bonus to AC while wielding a separate melee weapon in each hand.',
      'You can use two-weapon fighting even when the one-handed melee weapons you are wielding are not light.',
      'You can draw or stow two one-handed weapons when you would normally be able to draw or stow only one.',
    ],
  },
  eligibilityChecklist: [
    { check: 'Main-hand weapon has Light property?', requiredWithoutFeat: true },
    { check: 'Off-hand weapon has Light property?', requiredWithoutFeat: true },
    { check: 'Both weapons are melee?', requiredWithoutFeat: true },
    { check: 'You took the Attack action this turn?', requiredWithoutFeat: true },
    { check: 'Bonus action still available?', requiredWithoutFeat: true },
    { check: 'Dual Wielder feat removes Light requirement?', requiredWithoutFeat: false },
    { check: 'Two-Weapon Fighting style adds ability mod to off-hand damage?', requiredWithoutFeat: false },
  ],
};

// ---------------------------------------------------------------------------
// 6. Minion Rules (Roadmap item 54)
// ---------------------------------------------------------------------------

export const MINION_RULES = {
  label: 'Minion Rules',
  isOptional: true,
  source: 'DMG variant / popular homebrew standard',
  summary:
    'An optional system for handling large numbers of weak enemies efficiently. Minions have 1 HP and die from any damage, with simplified saves and no concentration.',
  coreRules: [
    {
      title: '1 Hit Point',
      description:
        'A minion has exactly 1 HP. Any amount of damage — even 1 point — kills it instantly. This includes damage from area effects, cantrips, and conditions.',
    },
    {
      title: 'Die on Any Damage',
      description:
        'A minion that takes any damage is immediately reduced to 0 HP and dies. There are no death saving throws for minions.',
    },
    {
      title: 'Simplified Saving Throws — Auto-Fail',
      description:
        'When a minion must make a saving throw and the save result would deal at least half damage on failure (e.g., Fireball), the minion automatically fails and dies.',
    },
    {
      title: 'Simplified Saving Throws — Auto-Succeed',
      description:
        'When a spell or effect deals no damage on a successful save (e.g., Hold Person with no damage component), the DM may rule that minions automatically succeed on the save to prevent instant mass-incapacitation.',
    },
    {
      title: 'No Concentration',
      description:
        'Minions are not valid subjects for concentration spells (Charm Person, Hold Monster, etc.) — they lack the complexity required for those effects. The DM may override this for named minion leaders.',
    },
    {
      title: 'Attack Rolls as Normal',
      description:
        'Minions still make attack rolls normally and can deal damage. Their attack bonuses and damage are simplified to match their CR.',
    },
    {
      title: 'Multi-Target Damage Efficiency',
      description:
        'Area spells like Fireball shine against minions, rewarding tactical spell use. Single-target damage is "wasted" on a minion beyond 1 HP, making overkill inefficient.',
    },
  ],
  usageGuidelines: [
    'Best for mobs of zombies, cultists, skeletons, goblins, or any CR ¼ or lower creature.',
    'Named enemies, lieutenants, and bosses should use full HP, not the minion rule.',
    'Consider giving minion groups a shared "morale break" threshold (e.g., flee when 50% of group is dead).',
    'Minions can still pose a threat in numbers — swarm tactics, pack flanking, and action economy pressure remain dangerous.',
  ],
};

// ---------------------------------------------------------------------------
// 7. Swarm Mechanics (Roadmap item 56)
// ---------------------------------------------------------------------------

export const SWARM_MECHANICS = {
  label: 'Swarm Mechanics',
  source: 'MM p. 337',
  summary:
    'Swarms are masses of Tiny creatures that act as a single entity. They resist single-target damage, can occupy the same space as other creatures, and deal less damage as they take casualties.',
  coreProperties: [
    {
      title: 'Occupy Same Space as Target',
      description:
        'A swarm can enter another creature\'s space and vice versa. This is required for the swarm to make attacks against most targets.',
    },
    {
      title: 'Resistance to Single-Target Damage',
      description:
        'Swarms have resistance to bludgeoning, piercing, and slashing damage from nonmagical attacks. Single weapon attacks and targeted spells are far less effective; area spells are ideal.',
    },
    {
      title: 'Cannot Be Grappled or Restrained',
      description:
        'A swarm cannot be grappled or restrained. It is immune to the Grappled and Restrained conditions. Attempting to grapple a swarm automatically fails.',
    },
    {
      title: 'Cannot Be Knocked Prone (Typically)',
      description:
        'Most swarms are immune to the Prone condition. Tiny flying creatures dispersing and reforming makes prone mechanics inapplicable.',
    },
    {
      title: 'Damage Scaling at Half HP',
      description:
        'When a swarm is reduced to half its hit point maximum or fewer, it deals reduced damage — typically rolling half the normal damage dice. This represents the swarm thinning out.',
    },
  ],
  damageScaling: {
    label: 'Swarm Damage Scaling',
    fullStrength: 'Rolls full damage dice (e.g., 4d6 piercing).',
    halfStrength: 'Rolls half the damage dice (e.g., 2d6 piercing) when at or below half max HP.',
    threshold: 'Exactly half max HP or fewer triggers the reduced damage.',
  },
  conditionImmunities: [
    'Charmed',
    'Frightened',
    'Grappled',
    'Paralyzed',
    'Petrified',
    'Prone',
    'Restrained',
    'Stunned',
  ],
  tacticalNotes: [
    {
      title: 'Use Area Spells',
      description:
        'Spells like Thunderwave, Burning Hands, and Fireball deal full damage to swarms without resistance, making area magic the primary counter.',
    },
    {
      title: 'Torch / Fire',
      description:
        'Fire damage is not resisted by most swarms. A torch attack (1 fire damage) or cantrip (Fire Bolt) is more effective than a sword swing.',
    },
    {
      title: 'Crowd Control Limitations',
      description:
        'Many crowd-control spells (Web, Hold Person, Entangle) require the Restrained or Paralyzed condition — conditions swarms are typically immune to.',
    },
    {
      title: 'Multiple Swarms',
      description:
        'Multiple swarms of the same type can stack in the same space without issue. Each is its own entity with separate HP and initiative.',
    },
  ],
};

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Returns whether flanking is active and what benefit it provides.
 * Accounts for the optional variant (flat bonus vs. advantage).
 *
 * @param {boolean} [useVariantFlatBonus=false] — If true, returns +2 instead of advantage.
 * @returns {{ active: boolean, benefit: string, type: 'advantage'|'flatBonus', value: number|null }}
 */
export function getFlankingBonus(useVariantFlatBonus = false) {
  if (useVariantFlatBonus) {
    return {
      active: true,
      benefit: '+2 bonus to melee attack rolls',
      type: 'flatBonus',
      value: 2,
    };
  }
  return {
    active: true,
    benefit: 'Advantage on melee attack rolls',
    type: 'advantage',
    value: null,
  };
}

/**
 * Checks whether a weapon suffers an underwater attack penalty.
 * Returns the penalty type and the reason.
 *
 * @param {string} weaponType — Weapon name or key (e.g., 'longsword', 'dagger', 'crossbow').
 * @returns {{ penalized: boolean, reason: string, penalty: 'disadvantage'|'automatic-miss'|'none' }}
 */
export function checkUnderwaterPenalty(weaponType) {
  const weapon = (weaponType || '').toLowerCase().trim();

  const immuneMelee = UNDERWATER_COMBAT.meleeRules
    .find((r) => r.immuneWeapons)
    ?.immuneWeapons ?? [];

  const immuneRanged = UNDERWATER_COMBAT.rangedRules
    .find((r) => r.exceptions)
    ?.exceptions ?? [];

  if (immuneMelee.includes(weapon)) {
    return {
      penalized: false,
      reason: `${weaponType} is a melee weapon that functions normally underwater.`,
      penalty: 'none',
    };
  }

  if (immuneRanged.includes(weapon)) {
    return {
      penalized: false,
      reason: `${weaponType} is a ranged/thrown weapon that can be used underwater without automatic miss (but still with disadvantage within normal range).`,
      penalty: 'none',
    };
  }

  // Simple heuristic: ranged/thrown weapons not on immune list get auto-miss beyond normal range
  const rangedKeywords = ['bow', 'crossbow', 'sling', 'dart', 'blowgun'];
  const isRanged = rangedKeywords.some((kw) => weapon.includes(kw));

  if (isRanged) {
    return {
      penalized: true,
      reason: `${weaponType} automatically misses targets beyond its normal range underwater, and attacks within normal range are made with disadvantage.`,
      penalty: 'automatic-miss',
    };
  }

  return {
    penalized: true,
    reason: `${weaponType} is a melee weapon that is not on the immune list. Attacks are made with disadvantage unless the attacker has a swim speed.`,
    penalty: 'disadvantage',
  };
}

/**
 * Returns the altitude tier object for a given height in feet.
 *
 * @param {number} height — Height above ground in feet.
 * @returns {{ key: string, label: string, heightRange: string, description: string }}
 */
export function getAltitudeTier(height) {
  const h = Number(height) || 0;
  if (h <= 0) return AERIAL_COMBAT.altitudeTiers.find((t) => t.key === 'ground');
  if (h <= 30) return AERIAL_COMBAT.altitudeTiers.find((t) => t.key === 'low');
  if (h <= 100) return AERIAL_COMBAT.altitudeTiers.find((t) => t.key === 'high');
  return AERIAL_COMBAT.altitudeTiers.find((t) => t.key === 'extreme');
}

/**
 * Resolves a grapple attempt using contested Athletics vs Athletics/Acrobatics.
 * Returns the outcome based on raw modifier values (DM rolls the dice).
 *
 * @param {number} attackerStrMod — Attacker's Strength (Athletics) total modifier.
 * @param {number} defenderStrMod — Defender's Strength (Athletics) total modifier.
 * @param {number} defenderDexMod — Defender's Dexterity (Acrobatics) total modifier.
 * @returns {{ outcome: 'grappled'|'escaped'|'failed', defenderBestMod: number, description: string }}
 */
export function resolveGrapple(attackerStrMod, defenderStrMod, defenderDexMod) {
  const defenderBestMod = Math.max(defenderStrMod, defenderDexMod);
  const defenderUsedStat = defenderStrMod >= defenderDexMod ? 'Athletics' : 'Acrobatics';

  if (attackerStrMod > defenderBestMod) {
    return {
      outcome: 'grappled',
      defenderBestMod,
      defenderUsedStat,
      description: `Attacker wins the contest (${attackerStrMod} vs ${defenderBestMod} ${defenderUsedStat}). Target is Grappled — speed becomes 0.`,
    };
  }

  if (attackerStrMod === defenderBestMod) {
    return {
      outcome: 'failed',
      defenderBestMod,
      defenderUsedStat,
      description: `Tie goes to the defender (${attackerStrMod} vs ${defenderBestMod} ${defenderUsedStat}). Grapple attempt fails.`,
    };
  }

  return {
    outcome: 'failed',
    defenderBestMod,
    defenderUsedStat,
    description: `Defender wins the contest (${attackerStrMod} vs ${defenderBestMod} ${defenderUsedStat}). Grapple attempt fails.`,
  };
}

/**
 * Checks whether a two-weapon fighting attack is eligible based on main-hand
 * and off-hand weapon properties.
 *
 * @param {{ name: string, isLight: boolean, isMelee: boolean }} mainHand
 * @param {{ name: string, isLight: boolean, isMelee: boolean }} offHand
 * @param {{ hasDualWielder?: boolean, hasTwoWeaponFightingStyle?: boolean }} [options]
 * @returns {{ eligible: boolean, reason: string, abilityModToOffHand: boolean }}
 */
export function checkTwoWeaponEligibility(mainHand, offHand, options = {}) {
  const { hasDualWielder = false, hasTwoWeaponFightingStyle = false } = options;

  if (!mainHand || !offHand) {
    return { eligible: false, reason: 'Both a main-hand and off-hand weapon are required.', abilityModToOffHand: false };
  }

  if (!mainHand.isMelee || !offHand.isMelee) {
    return { eligible: false, reason: 'Both weapons must be melee weapons to use two-weapon fighting.', abilityModToOffHand: false };
  }

  if (!hasDualWielder) {
    if (!mainHand.isLight) {
      return {
        eligible: false,
        reason: `${mainHand.name} does not have the Light property. Requires the Dual Wielder feat to use without it.`,
        abilityModToOffHand: false,
      };
    }
    if (!offHand.isLight) {
      return {
        eligible: false,
        reason: `${offHand.name} does not have the Light property. Requires the Dual Wielder feat to use without it.`,
        abilityModToOffHand: false,
      };
    }
  }

  return {
    eligible: true,
    reason: hasDualWielder
      ? `Eligible via Dual Wielder feat. Off-hand attack uses bonus action.`
      : `Both weapons are Light melee weapons. Off-hand attack uses bonus action.`,
    abilityModToOffHand: hasTwoWeaponFightingStyle,
  };
}

/**
 * Determines whether a swarm's damage is reduced based on its current HP.
 * Returns true if the swarm is at half HP or fewer (reduced damage state).
 *
 * @param {number} currentHP — The swarm's current hit points.
 * @param {number} maxHP — The swarm's maximum hit points.
 * @returns {{ reduced: boolean, description: string, threshold: number }}
 */
export function isSwarmDamageReduced(currentHP, maxHP) {
  if (maxHP <= 0) {
    return { reduced: false, description: 'Invalid max HP.', threshold: 0 };
  }
  const threshold = Math.floor(maxHP / 2);
  const reduced = currentHP <= threshold;
  return {
    reduced,
    threshold,
    description: reduced
      ? `Swarm is at half HP or fewer (${currentHP}/${maxHP}). Damage dice are halved.`
      : `Swarm is above half HP (${currentHP}/${maxHP}). Full damage dice apply.`,
  };
}
