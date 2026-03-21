/**
 * playerCombatActions.js
 * Player Mode Improvements 1-25: Combat HUD Data
 * Pure JS — no React dependencies.
 *
 * Exports:
 *   COMBAT_ACTIONS_REFERENCE
 *   BONUS_ACTIONS
 *   REACTIONS
 *   ATTACK_MODIFIERS
 *   ACTION_ECONOMY_TEMPLATE
 *   FEAT_COMBAT_PROMPTS
 *
 *   getCombatAction(actionName)
 *   getBonusActionsForClass(className)
 *   getReactionsForClass(className, feats)
 *   getSneakAttackDice(rogueLevel)
 *   getRageDamage(barbarianLevel)
 *   calculateSmiteDamage(slotLevel, isUndead)
 *   getActionEconomyTemplate(speed)
 *   checkFeatPrompt(featName, situation)
 */

// ---------------------------------------------------------------------------
// 1. COMBAT_ACTIONS_REFERENCE
// ---------------------------------------------------------------------------

export const COMBAT_ACTIONS_REFERENCE = {
  Attack: {
    actionCost: 'action',
    description: 'Make one melee or ranged weapon attack (or unarmed strike) against a target within reach or range.',
    rules: [
      'Roll d20 + ability modifier + proficiency bonus (if proficient with the weapon).',
      'Compare total to target\'s AC — meet or beat to hit.',
      'On a hit, roll the weapon\'s damage dice + the relevant ability modifier.',
      'A natural 20 is a critical hit: roll all damage dice twice.',
      'A natural 1 is an automatic miss regardless of modifiers.',
      'Extra Attack (certain classes at higher levels) grants additional attacks as part of the same Attack action.',
    ],
    tips: [
      'Use STR for melee, DEX for ranged (or finesse weapons).',
      'Check if your weapon has the Thrown, Versatile, or Reach property.',
      'Remember bonus action attacks from Two-Weapon Fighting or Martial Arts.',
    ],
  },

  CastASpell: {
    actionCost: 'action (varies by spell)',
    description: 'Cast a spell by expending an appropriate spell slot (or using a cantrip, which costs no slot).',
    rules: [
      'Cantrips require no spell slot and can be cast freely each turn.',
      'Levelled spells require a spell slot of equal or higher level.',
      'Casting time listed on the spell determines the action cost (action, bonus action, reaction, or longer).',
      'Concentration spells require maintaining concentration — only one at a time.',
      'Verbal and/or Somatic components must be free to use (not silenced or restrained).',
      'Material components (M) must be in hand or in a component pouch / arcane focus.',
    ],
    tips: [
      'Upcast spells (use a higher slot) for increased effect on eligible spells.',
      'Bonus action spells restrict you to cantrips for any other spells that turn.',
      'Check if the spell requires a spell attack roll or forces a saving throw.',
    ],
  },

  Dash: {
    actionCost: 'action',
    description: 'Gain extra movement equal to your speed for the current turn.',
    rules: [
      'Your total movement for the turn becomes double your speed.',
      'The extra movement is subject to terrain and movement penalties.',
      'Does NOT prevent opportunity attacks.',
    ],
    tips: [
      'Rogues can Dash as a bonus action via Cunning Action.',
      'Monks can spend a ki point to Dash as a bonus action (Step of the Wind).',
      'Combine with Disengage if you need to leave melee without provoking attacks.',
    ],
  },

  Disengage: {
    actionCost: 'action',
    description: 'Your movement doesn\'t provoke opportunity attacks for the rest of the turn.',
    rules: [
      'Prevents all opportunity attacks triggered by your movement.',
      'Does not prevent other types of reactions.',
      'Lasts only for the current turn.',
    ],
    tips: [
      'Rogues can Disengage as a bonus action via Cunning Action.',
      'Monks can spend a ki point to Disengage as a bonus action (Step of the Wind).',
      'Useful when surrounded by multiple enemies — move away safely.',
    ],
  },

  Dodge: {
    actionCost: 'action',
    description: 'Focus entirely on avoiding attacks. Attacks against you have disadvantage and you have advantage on DEX saves.',
    rules: [
      'Until the start of your next turn, attack rolls against you have disadvantage.',
      'You have advantage on Dexterity saving throws.',
      'Effect ends if you are incapacitated or if your speed drops to 0.',
    ],
    tips: [
      'Best used when you are surrounded and can\'t escape safely.',
      'Protects against both weapon attacks and spell attacks.',
      'Doesn\'t help against effects that don\'t require an attack roll and don\'t call for a DEX save.',
    ],
  },

  Help: {
    actionCost: 'action',
    description: 'Aid an ally, giving them advantage on their next ability check or attack roll against a creature within 5 ft of you.',
    rules: [
      'For ability checks: the ally must make the check before the start of your next turn.',
      'For attacks: the creature you aid against must be within 5 ft of you.',
      'The advantage applies to the very next roll made for that purpose.',
    ],
    tips: [
      'Excellent for enabling Sneak Attack — stay within 5 ft of the target.',
      'Use when your own attacks would be less effective than boosting an ally\'s.',
      'Works for skill checks outside of combat too.',
    ],
  },

  Hide: {
    actionCost: 'action',
    description: 'Attempt to hide from enemies using a Stealth check, becoming hidden if successful.',
    rules: [
      'Roll a Dexterity (Stealth) check.',
      'You can only hide if you are obscured from the creature\'s line of sight (heavily obscured, behind cover, etc.).',
      'If you succeed, enemies can\'t see you — attacks against you have disadvantage and you have advantage on attacks from hiding.',
      'You lose the hidden condition if you move into a visible area, attack, or cast a spell with a visible effect.',
    ],
    tips: [
      'Rogues can Hide as a bonus action via Cunning Action.',
      'Attacking from hiding grants advantage AND enables Sneak Attack (Rogues).',
      'Remember the DM sets DC based on enemy Passive Perception.',
    ],
  },

  Ready: {
    actionCost: 'action (held)',
    description: 'Hold an action and set a trigger; use your reaction to perform the readied action when the trigger occurs.',
    rules: [
      'Decide the action you will take and the trigger (a perceivable circumstance).',
      'When the trigger occurs before the start of your next turn, you may use your reaction to execute the action.',
      'If the trigger doesn\'t occur, the readied action is lost.',
      'Readying a spell holds concentration; if you don\'t release it before your next turn, the spell slot is expended and the spell fades.',
      'You can choose not to trigger even if the condition is met.',
    ],
    tips: [
      'Pair with a spell for ambush situations (e.g., Ready Fireball for when enemies enter the doorway).',
      'Use to attack on an enemy\'s turn — can disrupt casters.',
      'Be specific with your trigger to avoid ambiguity at the table.',
    ],
  },

  Search: {
    actionCost: 'action',
    description: 'Devote your attention to finding something using a Perception or Investigation check.',
    rules: [
      'Wisdom (Perception) to spot, hear, or otherwise sense something hidden.',
      'Intelligence (Investigation) to deduce the location of hidden objects or creatures through deduction.',
      'DM may call for the check or just tell you what you find based on your passive score.',
    ],
    tips: [
      'Use in combat to locate hidden enemies.',
      'High Passive Perception may make this unnecessary — the DM may inform you automatically.',
      'Consider Insight checks to read creature intent (separate from Search).',
    ],
  },

  UseAnObject: {
    actionCost: 'action',
    description: 'Interact with an object that requires more than a simple free interaction.',
    rules: [
      'One simple free object interaction is allowed per turn without cost (e.g., draw a weapon, open a door).',
      'Complex interactions — drinking a potion, activating a magic item, loading a hand crossbow — require the Use an Object action.',
      'Some magic items specify their own action cost.',
    ],
    tips: [
      'Drinking a healing potion costs your action; having an ally administer it also costs their action.',
      'The Healer feat lets you use a healer\'s kit to stabilize or restore HP as a Use an Object action.',
      'If an item says "requires an action to activate," this is the action you use.',
    ],
  },
};

// ---------------------------------------------------------------------------
// 2. BONUS_ACTIONS
// ---------------------------------------------------------------------------

export const BONUS_ACTIONS = {
  TwoWeaponFighting: {
    source: 'Any (light weapons in each hand)',
    classes: ['any'],
    description:
      'When you take the Attack action with a light melee weapon, you can use your bonus action to make one additional attack with a different light melee weapon in your off-hand. You do NOT add your ability modifier to the damage of the bonus attack (unless negative).',
  },

  CunningAction: {
    source: 'Rogue (level 2)',
    classes: ['rogue'],
    description:
      'You can take a bonus action on each of your turns in combat to take the Dash, Disengage, or Hide action.',
  },

  MartialArts: {
    source: 'Monk (level 1)',
    classes: ['monk'],
    description:
      'When you take the Attack action with an unarmed strike or a monk weapon, you can make one unarmed strike as a bonus action. Your unarmed strikes use your Martial Arts die (d4 → d6 → d8 → d10 by level).',
  },

  Rage: {
    source: 'Barbarian (level 1)',
    classes: ['barbarian'],
    description:
      'Enter a rage as a bonus action. While raging: advantage on STR checks and saves, bonus damage on STR-based melee attacks, resistance to bludgeoning/piercing/slashing damage. Lasts 1 minute (10 rounds) or until you don\'t attack or take damage on your turn.',
  },

  HealingWord: {
    source: 'Bard, Cleric, Druid (spell)',
    classes: ['bard', 'cleric', 'druid'],
    description:
      'Cast Healing Word (1st-level spell) as a bonus action. A creature you can see regains HP equal to 1d4 + your spellcasting modifier (higher when upcast). Cannot cast another non-cantrip spell on the same turn.',
  },

  MistyStep: {
    source: 'Sorcerer, Warlock, Wizard, Paladin (Oath of Glory/Ancients/Vengeance) (spell)',
    classes: ['sorcerer', 'warlock', 'wizard', 'paladin'],
    description:
      'Cast Misty Step (2nd-level spell) as a bonus action. Teleport up to 30 feet to an unoccupied space you can see. Only a brief shimmer of silver mist — no Verbal restriction applies.',
  },

  SpiritualWeapon: {
    source: 'Cleric (spell)',
    classes: ['cleric'],
    description:
      'After casting Spiritual Weapon (2nd-level spell, action), on subsequent turns use a bonus action to move the spectral weapon up to 20 ft and make a melee spell attack. Deals 1d8 + spellcasting modifier force damage (+1d8 per slot level above 2nd). Not concentration.',
  },

  HuntersMark: {
    source: 'Ranger (spell / class feature)',
    classes: ['ranger'],
    description:
      'Cast Hunter\'s Mark (1st-level spell) as a bonus action. The marked creature takes an extra 1d6 damage from your attacks. If it dies, you can use a bonus action to move the mark. Requires concentration.',
  },

  Hex: {
    source: 'Warlock (spell)',
    classes: ['warlock'],
    description:
      'Cast Hex (1st-level spell) as a bonus action. The hexed creature takes 1d6 necrotic damage whenever you hit with an attack. Choose an ability type — the target has disadvantage on checks using that ability. Move the hex with a bonus action if the target dies. Requires concentration.',
  },

  ShieldMasterShove: {
    source: 'Shield Master (feat)',
    classes: ['any'],
    description:
      'If you take the Attack action, you can use a bonus action to shove a creature within 5 ft using your shield. The target must succeed on a STR saving throw (DC 8 + proficiency + STR modifier) or be knocked prone or pushed 5 ft.',
  },

  QuickenedSpell: {
    source: 'Sorcerer (Metamagic, level 3)',
    classes: ['sorcerer'],
    description:
      'Spend 2 sorcery points to change the casting time of a spell with a 1-action casting time to a bonus action. Allows casting a leveled spell as a bonus action — note the rule that prevents casting another non-cantrip spell the same turn still applies (you may cantrip with your action).',
  },
};

// ---------------------------------------------------------------------------
// 3. REACTIONS
// ---------------------------------------------------------------------------

export const REACTIONS = {
  OpportunityAttack: {
    trigger: 'A hostile creature you can see moves out of your melee reach without Disengaging.',
    effect: 'Make one melee weapon attack against the creature. Interrupts movement — happens before the creature leaves your reach.',
    source: 'All creatures (base rule)',
    classes: ['any'],
  },

  Shield: {
    trigger: 'You are hit by an attack roll or targeted by the Magic Missile spell.',
    effect: '+5 bonus to AC until the start of your next turn (potentially turning the hit into a miss). Immune to Magic Missile for the same duration.',
    source: 'Wizard, Sorcerer (1st-level spell)',
    classes: ['wizard', 'sorcerer'],
  },

  Counterspell: {
    trigger: 'A creature within 60 ft of you casts a spell.',
    effect: 'Attempt to interrupt the spell. Spells of 3rd level or lower are automatically countered. For 4th level and above, make an ability check (DC 10 + spell level) — on a success, the spell is countered.',
    source: 'Sorcerer, Warlock, Wizard (3rd-level spell)',
    classes: ['sorcerer', 'warlock', 'wizard'],
  },

  AbsorbElements: {
    trigger: 'You take acid, cold, fire, lightning, or thunder damage.',
    effect: 'Gain resistance to the triggering damage type until the start of your next turn. The next time you hit with a melee attack before then, deal an extra 1d6 of that damage type (+1d6 per slot level above 1st).',
    source: 'Druid, Ranger, Wizard, Sorcerer (1st-level spell)',
    classes: ['druid', 'ranger', 'wizard', 'sorcerer'],
  },

  UncannyDodge: {
    trigger: 'An attacker that you can see hits you with an attack.',
    effect: 'Halve the attack\'s damage against you.',
    source: 'Rogue (level 5)',
    classes: ['rogue'],
  },

  HellishRebuke: {
    trigger: 'You are damaged by a creature within 60 ft that you can see.',
    effect: 'The creature is bathed in flames and must make a DEX saving throw (DC = spell save DC). On a fail, it takes 2d10 fire damage; half on a success. (+1d10 per slot level above 1st.)',
    source: 'Warlock (1st-level spell), Tiefling (Infernal Legacy)',
    classes: ['warlock', 'tiefling'],
  },

  Sentinel: {
    trigger: '(1) A creature within your reach makes an attack against a target other than you. (2) A creature within your reach attempts to move away.',
    effect:
      '(1) Make one opportunity attack against that creature. (2) The creature\'s speed becomes 0 for the rest of the turn. Also: creatures provoke opportunity attacks from you even if they take the Disengage action.',
    source: 'Sentinel (feat)',
    classes: ['any'],
  },

  WarCaster: {
    trigger: 'A creature provokes an opportunity attack from you.',
    effect: 'Instead of a weapon attack, you can cast a spell as the opportunity attack. The spell must have a casting time of 1 action and must target only that creature.',
    source: 'War Caster (feat)',
    classes: ['any'],
  },
};

// ---------------------------------------------------------------------------
// 4. ATTACK_MODIFIERS
// ---------------------------------------------------------------------------

export const ATTACK_MODIFIERS = {
  SneakAttack: {
    levels: {
      1: '1d6',
      3: '2d6',
      5: '3d6',
      7: '4d6',
      9: '5d6',
      11: '6d6',
      13: '7d6',
      15: '8d6',
      17: '9d6',
      19: '10d6',
    },
    condition: 'You must have advantage on the attack roll OR an ally must be within 5 ft of the target (and not incapacitated), and you must not have disadvantage.',
    oncePerTurn: true,
    notes: 'Applies to finesse or ranged weapon attacks only. Doubles on a critical hit (roll all Sneak Attack dice twice).',
  },

  RageDamage: {
    levels: {
      1: 2,
      9: 3,
      16: 4,
    },
    condition: 'Must be raging. Attack must be a STR-based melee weapon attack.',
    notes: 'Flat bonus to damage roll added on top of STR modifier.',
  },

  DivineSmite: {
    baseDice: '2d8',
    perSlotLevel: '1d8',
    maxDice: '5d8',
    extraVsUndead: '1d8',
    damageType: 'radiant',
    condition: 'Must land a melee weapon hit. Expend one spell slot after the hit (no action required).',
    notes: [
      'Base: 2d8 radiant damage for a 1st-level slot.',
      'Add 1d8 for each slot level above 1st (max 5d8 total, i.e., 4th-level slot).',
      'Add 1d8 extra against undead or fiends.',
      'Can be used on a critical hit — all dice are doubled.',
    ],
  },

  GreatWeaponMaster: {
    attackMod: -5,
    damageMod: 10,
    condition: 'Must have the feat and be using a heavy weapon. Choose to apply the penalty/bonus BEFORE the roll.',
    notes: 'Also grants a bonus action melee attack when you score a critical hit or reduce a creature to 0 HP.',
  },

  Sharpshooter: {
    attackMod: -5,
    damageMod: 10,
    condition: 'Must have the feat and be making a ranged weapon attack. Choose to apply BEFORE the roll.',
    notes: 'Also ignores half cover and three-quarters cover, and has no disadvantage on long-range attacks.',
  },

  HexHuntersMark: {
    bonusDamage: '1d6',
    condition: 'Target must be your current hexed/marked creature.',
    notes: 'Hex (Warlock): choose an ability type; target has disadvantage on that ability\'s checks. Hunter\'s Mark (Ranger): bonus action to move the mark.',
  },

  FavoredFoe: {
    bonusDamage: '1d4 (scales to 1d6 at Ranger 6, 1d8 at Ranger 14)',
    condition: 'Ranger class feature (alternate). Target must be your marked creature. Does NOT require concentration.',
    notes: 'Uses a limited number of uses per long rest. Choose one creature per use.',
  },

  BardicInspiration: {
    die: {
      1: 'd6',
      5: 'd8',
      10: 'd10',
      15: 'd12',
    },
    usage: 'Add the die result to one attack roll, ability check, or saving throw. Roll after you know the original result but before the DM says if it succeeds or fails.',
    notes: 'Each creature can only hold one Bardic Inspiration die at a time. New in 2024 rules: Bard also regains uses on a short rest.',
  },
};

// ---------------------------------------------------------------------------
// 5. ACTION_ECONOMY_TEMPLATE
// ---------------------------------------------------------------------------

export const ACTION_ECONOMY_TEMPLATE = {
  action: false,
  bonusAction: false,
  reaction: false,
  movement: 0,
  movementMax: 30,
  freeInteraction: false,
};

// ---------------------------------------------------------------------------
// 6. FEAT_COMBAT_PROMPTS
// ---------------------------------------------------------------------------

export const FEAT_COMBAT_PROMPTS = {
  Lucky: {
    trigger: 'Any d20 roll (attack roll, ability check, or saving throw).',
    effect: 'Spend a luck point to roll an additional d20 and choose which result to use (yours or the source\'s if targeted).',
    usesPerDay: 3,
    resetOn: 'long rest',
    promptWhen: ['attack_roll', 'ability_check', 'saving_throw'],
  },

  SavageAttacker: {
    trigger: 'You make a melee weapon damage roll.',
    effect: 'Reroll the weapon\'s damage dice once and use either result.',
    usesPerTurn: 1,
    resetOn: 'each turn',
    promptWhen: ['melee_damage_roll'],
  },

  GreatWeaponMaster: {
    trigger: 'You score a critical hit with a melee weapon OR reduce a creature to 0 HP.',
    effect: 'Make one melee weapon attack as a bonus action this turn.',
    promptWhen: ['critical_hit_melee', 'kill_with_melee'],
    notes: 'The separate -5/+10 trade-off is chosen before the attack roll (not a feat prompt scenario).',
  },

  Sentinel: {
    trigger: [
      'A creature within your reach attacks a target other than you.',
      'A creature you have hit attempts to move away from you.',
    ],
    effect: [
      'Make an opportunity attack against the creature (even if it didn\'t leave your reach).',
      'The creature\'s speed becomes 0 for the rest of the turn.',
    ],
    promptWhen: ['ally_attacked_within_reach', 'hit_creature_attempts_move'],
    notes: 'Creatures can\'t avoid your opportunity attacks via Disengage while you have this feat.',
  },

  PolearmMaster: {
    trigger: 'A creature enters the reach of your polearm (glaive, halberd, pike, quarterstaff, or spear).',
    effect: 'Make an opportunity attack against that creature.',
    promptWhen: ['creature_enters_reach'],
    notes: 'Also grants a bonus action attack with the butt of the polearm (1d4 bludgeoning) when you take the Attack action.',
  },
};

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Get a specific combat action by name.
 * @param {string} actionName - Key from COMBAT_ACTIONS_REFERENCE (e.g. 'Attack', 'Dodge')
 * @returns {object|null}
 */
export function getCombatAction(actionName) {
  return COMBAT_ACTIONS_REFERENCE[actionName] ?? null;
}

/**
 * Get all bonus actions available to a given class.
 * @param {string} className - e.g. 'rogue', 'barbarian', 'any'
 * @returns {object} Filtered subset of BONUS_ACTIONS
 */
export function getBonusActionsForClass(className) {
  const lower = (className ?? '').toLowerCase();
  const result = {};
  for (const [key, entry] of Object.entries(BONUS_ACTIONS)) {
    if (
      entry.classes.includes('any') ||
      entry.classes.includes(lower)
    ) {
      result[key] = entry;
    }
  }
  return result;
}

/**
 * Get all reactions available to a given class and optional feat list.
 * @param {string} className - e.g. 'wizard', 'rogue'
 * @param {string[]} feats - Array of feat names the character has (e.g. ['Sentinel', 'WarCaster'])
 * @returns {object} Filtered subset of REACTIONS
 */
export function getReactionsForClass(className, feats = []) {
  const lower = (className ?? '').toLowerCase();
  const normalizedFeats = feats.map((f) => f.toLowerCase());
  const result = {};

  for (const [key, entry] of Object.entries(REACTIONS)) {
    const classMatch =
      entry.classes.includes('any') || entry.classes.includes(lower);
    const featMatch = normalizedFeats.includes(key.toLowerCase());

    if (classMatch || featMatch) {
      result[key] = entry;
    }
  }
  return result;
}

/**
 * Get the Sneak Attack damage dice string for a given Rogue level.
 * Returns the highest tier that the level meets or exceeds.
 * @param {number} rogueLevel
 * @returns {string} e.g. '3d6'
 */
export function getSneakAttackDice(rogueLevel) {
  const tiers = ATTACK_MODIFIERS.SneakAttack.levels;
  const thresholds = Object.keys(tiers)
    .map(Number)
    .sort((a, b) => b - a); // descending

  for (const threshold of thresholds) {
    if (rogueLevel >= threshold) {
      return tiers[threshold];
    }
  }
  return '0';
}

/**
 * Get the Rage bonus damage for a given Barbarian level.
 * @param {number} barbarianLevel
 * @returns {number} Flat bonus damage
 */
export function getRageDamage(barbarianLevel) {
  const tiers = ATTACK_MODIFIERS.RageDamage.levels;
  const thresholds = Object.keys(tiers)
    .map(Number)
    .sort((a, b) => b - a); // descending

  for (const threshold of thresholds) {
    if (barbarianLevel >= threshold) {
      return tiers[threshold];
    }
  }
  return 0;
}

/**
 * Calculate Divine Smite total damage dice count.
 * @param {number} slotLevel - Spell slot level used (1–9)
 * @param {boolean} isUndead - Whether the target is undead or a fiend
 * @returns {{ totalDice: number, dieType: string, damageType: string, breakdown: string }}
 */
export function calculateSmiteDamage(slotLevel, isUndead = false) {
  const smite = ATTACK_MODIFIERS.DivineSmite;
  const baseNum = 2;
  const extraPerLevel = slotLevel - 1;
  const maxBeforeUndead = 5;

  let totalDice = Math.min(baseNum + extraPerLevel, maxBeforeUndead);
  if (isUndead) {
    totalDice = Math.min(totalDice + 1, maxBeforeUndead + 1); // cap at 6d8 vs undead
  }

  const breakdown = `${totalDice}d8 radiant${isUndead ? ' (includes +1d8 vs undead/fiend)' : ''}`;

  return {
    totalDice,
    dieType: 'd8',
    damageType: smite.damageType,
    breakdown,
    slotLevel,
    isUndead,
  };
}

/**
 * Return a fresh action economy tracking object for a turn.
 * @param {number} speed - Character movement speed in feet (default 30)
 * @returns {object}
 */
export function getActionEconomyTemplate(speed = 30) {
  return {
    ...ACTION_ECONOMY_TEMPLATE,
    movement: 0,
    movementMax: speed,
  };
}

/**
 * Check whether a feat should prompt the player in a given situation.
 * @param {string} featName - Feat key from FEAT_COMBAT_PROMPTS
 * @param {string} situation - One of the promptWhen values (e.g. 'critical_hit_melee')
 * @returns {{ shouldPrompt: boolean, prompt: object|null }}
 */
export function checkFeatPrompt(featName, situation) {
  const feat = FEAT_COMBAT_PROMPTS[featName];
  if (!feat) {
    return { shouldPrompt: false, prompt: null };
  }

  const triggers = Array.isArray(feat.promptWhen) ? feat.promptWhen : [];
  const shouldPrompt = triggers.includes(situation);

  return {
    shouldPrompt,
    prompt: shouldPrompt ? feat : null,
  };
}
