/**
 * Class Ability Tracking — D&D 5e Resource Tracking
 *
 * Covers roadmap items 41-50 (GWM/Sharpshooter, Sneak Attack, Rage, Smite,
 * Bardic Inspiration, Ki Points, Sorcery Points, Channel Divinity, Wildshape).
 */

// ── Class Resource Templates ──
export const CLASS_RESOURCES = {
  Barbarian: {
    rage: {
      label: 'Rage',
      resourceType: 'uses',
      usesByLevel: { 1: 2, 3: 3, 6: 4, 12: 5, 17: 6, 20: Infinity },
      recharge: 'Long Rest',
      bonusDamage: { 1: 2, 9: 3, 16: 4 },
      duration: '1 minute (10 rounds)',
      rules: [
        'Advantage on STR checks and STR saves',
        'Bonus rage damage on melee STR attacks',
        'Resistance to bludgeoning, piercing, slashing damage',
        'Can\'t cast or concentrate on spells',
        'Ends early if you don\'t attack or take damage for a round',
      ],
    },
  },
  Fighter: {
    secondWind: {
      label: 'Second Wind',
      resourceType: 'uses',
      usesByLevel: { 1: 1 },
      recharge: 'Short Rest',
      rules: ['Bonus action: regain 1d10 + Fighter level HP'],
    },
    actionSurge: {
      label: 'Action Surge',
      resourceType: 'uses',
      usesByLevel: { 2: 1, 17: 2 },
      recharge: 'Short Rest',
      rules: ['Take one additional action on your turn', 'Can only use once per turn (even with 2 uses)'],
    },
    superiorityDice: {
      label: 'Superiority Dice',
      subclass: 'Battle Master',
      resourceType: 'dice',
      diceByLevel: { 3: { count: 4, die: 8 }, 7: { count: 5, die: 8 }, 10: { count: 5, die: 10 }, 15: { count: 6, die: 10 }, 18: { count: 6, die: 12 } },
      recharge: 'Short Rest',
    },
  },
  Rogue: {
    sneakAttack: {
      label: 'Sneak Attack',
      resourceType: 'passive',
      diceByLevel: { 1: 1, 3: 2, 5: 3, 7: 4, 9: 5, 11: 6, 13: 7, 15: 8, 17: 9, 19: 10 },
      rules: [
        'Once per turn, extra damage on attack with finesse or ranged weapon',
        'Must have advantage on attack, OR ally within 5ft of target (and no disadvantage)',
        'Damage: Xd6 where X scales with rogue level',
      ],
    },
  },
  Paladin: {
    layOnHands: {
      label: 'Lay on Hands',
      resourceType: 'pool',
      poolFormula: 'Paladin level × 5',
      recharge: 'Long Rest',
      rules: [
        'Touch: restore HP from pool (any amount)',
        '5 points from pool: cure one disease or neutralize one poison',
        'No effect on undead or constructs',
      ],
    },
    divineSmite: {
      label: 'Divine Smite',
      resourceType: 'spell_slot',
      rules: [
        'On melee hit: expend spell slot for extra radiant damage',
        '2d8 for 1st-level slot + 1d8 per slot level above 1st (max 5d8)',
        '+1d8 vs undead or fiend (max 6d8 total)',
        'Can decide AFTER knowing hit — no wasted slots',
      ],
      damageBySlot: { 1: '2d8', 2: '3d8', 3: '4d8', 4: '5d8' },
    },
  },
  Bard: {
    bardicInspiration: {
      label: 'Bardic Inspiration',
      resourceType: 'uses',
      usesByLevel: { 1: 'CHA mod (min 1)' },
      recharge: { 1: 'Long Rest', 5: 'Short Rest' },
      dieByLevel: { 1: 'd6', 5: 'd8', 10: 'd10', 15: 'd12' },
      rules: [
        'Bonus action: give inspiration die to creature within 60ft',
        'Creature adds die to one ability check, attack roll, or saving throw',
        'Must use within 10 minutes',
        'One inspiration die at a time per creature',
      ],
    },
  },
  Monk: {
    ki: {
      label: 'Ki Points',
      resourceType: 'pool',
      poolFormula: 'Monk level (starting at level 2)',
      recharge: 'Short Rest',
      abilities: [
        { name: 'Flurry of Blows', cost: 1, action: 'Bonus Action', description: 'Two unarmed strikes after Attack action' },
        { name: 'Patient Defense', cost: 1, action: 'Bonus Action', description: 'Take the Dodge action' },
        { name: 'Step of the Wind', cost: 1, action: 'Bonus Action', description: 'Take the Disengage or Dash action, jump distance doubled' },
        { name: 'Stunning Strike', cost: 1, action: 'On Hit', description: 'Target must CON save or be Stunned until end of your next turn', levelReq: 5 },
        { name: 'Deflect Missiles', cost: 1, action: 'Reaction', description: 'Catch and throw back a ranged missile (1d10 + DEX + Monk level damage)', levelReq: 3 },
      ],
    },
    martialArts: {
      label: 'Martial Arts Die',
      resourceType: 'passive',
      dieByLevel: { 1: 'd4', 5: 'd6', 11: 'd8', 17: 'd10' },
    },
  },
  Sorcerer: {
    sorceryPoints: {
      label: 'Sorcery Points',
      resourceType: 'pool',
      poolFormula: 'Sorcerer level (starting at level 2)',
      recharge: 'Long Rest',
      conversion: {
        slotToPoints: { 1: 2, 2: 3, 3: 5, 4: 6, 5: 7 },
        pointsToSlot: { 1: 2, 2: 3, 3: 5, 4: 6, 5: 7 },
        maxCreatedSlot: 5,
      },
      metamagic: [
        { name: 'Careful Spell', cost: 1, description: 'Chosen creatures auto-succeed on spell save' },
        { name: 'Distant Spell', cost: 1, description: 'Double range (touch becomes 30ft)' },
        { name: 'Empowered Spell', cost: 1, description: 'Reroll up to CHA mod damage dice' },
        { name: 'Extended Spell', cost: 1, description: 'Double duration (max 24 hours)' },
        { name: 'Heightened Spell', cost: 3, description: 'One target has disadvantage on first save' },
        { name: 'Quickened Spell', cost: 2, description: 'Change casting time to bonus action' },
        { name: 'Subtle Spell', cost: 1, description: 'Cast without verbal or somatic components' },
        { name: 'Twinned Spell', cost: 'spell level (1 min)', description: 'Target a second creature with single-target spell' },
      ],
    },
  },
  Cleric: {
    channelDivinity: {
      label: 'Channel Divinity',
      resourceType: 'uses',
      usesByLevel: { 2: 1, 6: 2, 18: 3 },
      recharge: 'Short Rest',
      baseAbility: {
        name: 'Turn Undead',
        description: 'Each undead within 30ft must WIS save or be turned for 1 minute (flee and can\'t take actions)',
      },
    },
  },
  Druid: {
    wildShape: {
      label: 'Wild Shape',
      resourceType: 'uses',
      usesByLevel: { 2: 2 },
      recharge: 'Short Rest',
      maxCR: { 2: '1/4 (no fly/swim)', 4: '1/2 (no fly)', 8: '1' },
      rules: [
        'Bonus action to transform',
        'Duration: Druid level / 2 hours',
        'Gain beast\'s HP as temp HP (revert at 0)',
        'Can\'t cast spells in beast form (until Beast Spells at 18)',
        'Keep INT, WIS, CHA scores',
        'Retain proficiencies and features (if beast can physically do them)',
      ],
    },
  },
  Warlock: {
    eldritchInvocations: {
      label: 'Eldritch Invocations',
      resourceType: 'passive',
      countByLevel: { 2: 2, 5: 3, 7: 4, 9: 5, 12: 6, 15: 7, 18: 8 },
    },
  },
};

// ── Combat Feats (GWM, Sharpshooter, etc.) ──
export const COMBAT_FEATS = {
  greatWeaponMaster: {
    name: 'Great Weapon Master',
    options: [
      { label: '-5/+10', description: 'Before attacking with a heavy melee weapon, choose -5 to attack roll for +10 damage.' },
      { label: 'Bonus Attack', description: 'When you score a critical hit or reduce a creature to 0 HP with a melee weapon, make one melee weapon attack as a bonus action.' },
    ],
  },
  sharpshooter: {
    name: 'Sharpshooter',
    options: [
      { label: '-5/+10', description: 'Before attacking with a ranged weapon, choose -5 to attack roll for +10 damage.' },
      { label: 'No Disadvantage', description: 'Attacking at long range doesn\'t impose disadvantage.' },
      { label: 'Ignore Cover', description: 'Attacks ignore half cover and three-quarters cover.' },
    ],
  },
  sentinel: {
    name: 'Sentinel',
    options: [
      { label: 'Speed 0', description: 'When you hit with an opportunity attack, creature\'s speed becomes 0.' },
      { label: 'Disengage Ignore', description: 'Creatures provoke opportunity attacks even if they Disengage.' },
      { label: 'Ally Defense', description: 'When a creature within 5ft attacks someone other than you, use reaction to make melee attack.' },
    ],
  },
  warCaster: {
    name: 'War Caster',
    options: [
      { label: 'Concentration ADV', description: 'Advantage on CON saves to maintain concentration.' },
      { label: 'Somatic w/ Weapons', description: 'Can perform somatic components with weapons/shield in hands.' },
      { label: 'Spell as OA', description: 'Cast a spell instead of making an opportunity attack (must target only that creature, 1 action casting time).' },
    ],
  },
  polearmMaster: {
    name: 'Polearm Master',
    options: [
      { label: 'Bonus Attack', description: 'Bonus action: attack with opposite end of glaive/halberd/quarterstaff (1d4 bludgeoning).' },
      { label: 'Enter Reach OA', description: 'Creatures provoke opportunity attacks when they ENTER your reach.' },
    ],
  },
};

/**
 * Get class resources for a class at a given level.
 */
export function getClassResources(className, level) {
  const resources = CLASS_RESOURCES[className];
  if (!resources) return [];

  return Object.entries(resources).map(([key, resource]) => {
    const result = { id: key, ...resource };

    // Resolve level-dependent values
    if (resource.usesByLevel) {
      let uses = 0;
      for (const [lvl, count] of Object.entries(resource.usesByLevel)) {
        if (level >= parseInt(lvl)) uses = count;
      }
      result.currentMax = uses;
    }

    if (resource.dieByLevel) {
      let die = 'd4';
      for (const [lvl, d] of Object.entries(resource.dieByLevel)) {
        if (level >= parseInt(lvl)) die = d;
      }
      result.currentDie = die;
    }

    if (resource.diceByLevel) {
      let dice = resource.diceByLevel[1];
      for (const [lvl, d] of Object.entries(resource.diceByLevel)) {
        if (level >= parseInt(lvl)) dice = d;
      }
      result.currentDice = dice;
    }

    if (resource.bonusDamage) {
      let bonus = 0;
      for (const [lvl, dmg] of Object.entries(resource.bonusDamage)) {
        if (level >= parseInt(lvl)) bonus = dmg;
      }
      result.currentBonusDamage = bonus;
    }

    if (resource.poolFormula) {
      // Lay on Hands = Paladin level × 5, Ki/Sorcery Points = class level
      if (resource.poolFormula.includes('× 5')) {
        result.currentPool = level * 5;
      } else {
        result.currentPool = level;
      }
    }

    return result;
  });
}

/**
 * Get combat feat info.
 */
export function getCombatFeat(featName) {
  return COMBAT_FEATS[featName] || null;
}

/**
 * Get all combat feats.
 */
export function getAllCombatFeats() {
  return Object.entries(COMBAT_FEATS).map(([key, feat]) => ({ id: key, ...feat }));
}

/**
 * Calculate Sneak Attack dice for a rogue level.
 */
export function getSneakAttackDice(rogueLevel) {
  return Math.ceil(rogueLevel / 2);
}

/**
 * Calculate Paladin smite damage.
 */
export function calculateSmiteDamage(slotLevel, isUndead = false) {
  const baseDice = Math.min(slotLevel + 1, 5);
  const totalDice = isUndead ? Math.min(baseDice + 1, 6) : baseDice;
  return { dice: totalDice, dieType: 8, damageType: 'radiant', formula: `${totalDice}d8` };
}
