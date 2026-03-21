/**
 * playerClassFeatures.js
 * Player Mode Improvements 3-7, 15-25: Class-specific combat prompts & auto-calculations
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// SNEAK ATTACK (Rogue)
// ---------------------------------------------------------------------------

export const SNEAK_ATTACK = {
  className: 'Rogue',
  description: 'Extra damage once per turn when you have advantage or an ally is adjacent to the target.',
  conditions: [
    'You must use a finesse or ranged weapon.',
    'You need advantage on the attack roll, OR an enemy of the target must be within 5 feet of it.',
    'You cannot have disadvantage on the attack roll.',
    'Only once per turn (not once per round — can trigger on opportunity attacks).',
  ],
  getDice: (rogueLevel) => {
    if (rogueLevel < 1) return null;
    const d6Count = Math.ceil(rogueLevel / 2);
    return { expression: `${d6Count}d6`, dice: d6Count, sides: 6 };
  },
};

// ---------------------------------------------------------------------------
// DIVINE SMITE (Paladin)
// ---------------------------------------------------------------------------

export const DIVINE_SMITE = {
  className: 'Paladin',
  description: 'Expend a spell slot after hitting with a melee weapon to deal extra radiant damage.',
  conditions: [
    'Must hit with a melee weapon attack.',
    'Expend a spell slot of 1st level or higher.',
    'Cannot be used on ranged attacks.',
  ],
  getDamage: (slotLevel, isUndead = false) => {
    const baseDice = slotLevel + 1;
    const undeadBonus = isUndead ? 1 : 0;
    const totalDice = Math.min(baseDice + undeadBonus, 6); // Cap at 5d8 normally, 6d8 vs undead
    return { expression: `${totalDice}d8`, dice: totalDice, sides: 8, damageType: 'radiant' };
  },
  maxSlotLevel: 4, // PHB caps the extra dice at 5th-level slot but smite uses up to 4 extra d8
};

// ---------------------------------------------------------------------------
// RAGE (Barbarian)
// ---------------------------------------------------------------------------

export const RAGE = {
  className: 'Barbarian',
  description: 'Enter a rage for extra melee damage, resistance, and advantage on STR checks/saves.',
  bonusDamage: (barbarianLevel) => {
    if (barbarianLevel >= 16) return 4;
    if (barbarianLevel >= 9) return 3;
    return 2;
  },
  benefits: [
    'Advantage on Strength checks and saving throws.',
    'Bonus melee damage (STR-based attacks only).',
    'Resistance to bludgeoning, piercing, and slashing damage.',
  ],
  restrictions: [
    'Cannot cast spells or concentrate on spells while raging.',
    'Must make an attack or take damage each turn to maintain rage.',
    'Rage lasts 1 minute (10 rounds).',
  ],
  ragesPerDay: (level) => {
    if (level >= 20) return Infinity; // Unlimited at 20
    if (level >= 17) return 6;
    if (level >= 12) return 5;
    if (level >= 6) return 4;
    if (level >= 3) return 3;
    return 2;
  },
};

// ---------------------------------------------------------------------------
// GREAT WEAPON MASTER / SHARPSHOOTER
// ---------------------------------------------------------------------------

export const POWER_ATTACK_FEATS = {
  'Great Weapon Master': {
    attackPenalty: -5,
    damagebonus: 10,
    description: 'Take -5 to attack for +10 damage on heavy melee weapons.',
    weaponRequirement: 'heavy melee weapon',
    bonusAttack: 'On a critical hit or reducing a creature to 0 HP, make one melee weapon attack as a bonus action.',
  },
  'Sharpshooter': {
    attackPenalty: -5,
    damagebonus: 10,
    description: 'Take -5 to attack for +10 damage on ranged weapons.',
    weaponRequirement: 'ranged weapon',
    otherBenefits: [
      'No disadvantage at long range.',
      'Ignore half and three-quarters cover.',
    ],
  },
};

// ---------------------------------------------------------------------------
// REACTION FEATURES
// ---------------------------------------------------------------------------

export const REACTION_FEATURES = {
  Shield: {
    className: 'Wizard/Sorcerer',
    trigger: 'When you are hit by an attack or targeted by magic missile.',
    effect: '+5 AC until the start of your next turn (including against the triggering attack).',
    cost: '1st-level spell slot',
    castingTime: 'Reaction',
  },
  'Uncanny Dodge': {
    className: 'Rogue (5+)',
    trigger: 'When an attacker you can see hits you with an attack.',
    effect: 'Halve the attack damage against you.',
    cost: 'Reaction',
  },
  'Hellish Rebuke': {
    className: 'Warlock/Tiefling',
    trigger: 'When you are damaged by a creature you can see within 60 feet.',
    effect: 'Target makes DEX save or takes 2d10 fire damage (half on save).',
    cost: '1st-level spell slot, Reaction',
  },
  Sentinel: {
    className: 'Any (feat)',
    trigger: 'When a creature within your reach attacks a target other than you.',
    effect: 'Make an opportunity attack against the creature. On hit, its speed becomes 0.',
    cost: 'Reaction',
  },
  'War Caster': {
    className: 'Any (feat)',
    trigger: 'When a creature provokes an opportunity attack.',
    effect: 'Cast a spell instead of making a melee attack. The spell must target only that creature and have a casting time of 1 action.',
    cost: 'Reaction',
  },
  Lucky: {
    className: 'Any (feat)',
    trigger: 'After rolling an attack, ability check, or saving throw.',
    effect: 'Roll an additional d20 and choose which to use. 3 luck points per long rest.',
    cost: '1 luck point',
  },
  'Savage Attacker': {
    className: 'Any (feat)',
    trigger: 'After rolling melee weapon damage.',
    effect: 'Reroll the damage dice and use either total. Once per turn.',
    cost: 'Free (once per turn)',
  },
};

// ---------------------------------------------------------------------------
// TWO-WEAPON FIGHTING
// ---------------------------------------------------------------------------

export const TWO_WEAPON_FIGHTING = {
  description: 'When you take the Attack action with a light melee weapon, you can make one additional attack with a different light melee weapon as a bonus action.',
  rules: [
    'Both weapons must have the Light property.',
    'You do NOT add your ability modifier to the damage of the bonus attack (unless you have the Two-Weapon Fighting fighting style).',
    'You can draw or stow two weapons as part of the Attack action.',
  ],
  fightingStyleBonus: 'Two-Weapon Fighting: Add your ability modifier to the damage of the bonus attack.',
};

// ---------------------------------------------------------------------------
// EXTRA ATTACK
// ---------------------------------------------------------------------------

export const EXTRA_ATTACK = {
  classes: {
    Barbarian: { level: 5, attacks: 2 },
    Fighter: { level: 5, attacks: 2, upgrades: [{ level: 11, attacks: 3 }, { level: 20, attacks: 4 }] },
    Monk: { level: 5, attacks: 2 },
    Paladin: { level: 5, attacks: 2 },
    Ranger: { level: 5, attacks: 2 },
  },
  getAttackCount: (className, level) => {
    const cls = EXTRA_ATTACK.classes[className];
    if (!cls || level < cls.level) return 1;
    if (cls.upgrades) {
      for (let i = cls.upgrades.length - 1; i >= 0; i--) {
        if (level >= cls.upgrades[i].level) return cls.upgrades[i].attacks;
      }
    }
    return cls.attacks;
  },
};

// ---------------------------------------------------------------------------
// Helper: Check if a class feature prompt should show
// ---------------------------------------------------------------------------

export function shouldPromptSneakAttack(className, hasAdvantage, allyAdjacentToTarget) {
  if (!className || !className.toLowerCase().includes('rogue')) return false;
  return hasAdvantage || allyAdjacentToTarget;
}

export function shouldPromptSmite(className, hasSpellSlots, isMeleeHit) {
  if (!className || !className.toLowerCase().includes('paladin')) return false;
  return hasSpellSlots && isMeleeHit;
}

export function shouldPromptRage(className, isRaging) {
  if (!className || !className.toLowerCase().includes('barbarian')) return false;
  return !isRaging;
}

export function getClassCombatPrompts(className, level, feats = []) {
  const prompts = [];
  const lc = (className || '').toLowerCase();

  if (lc.includes('rogue')) {
    const sa = SNEAK_ATTACK.getDice(level);
    if (sa) prompts.push({ type: 'sneak_attack', label: `Sneak Attack (${sa.expression})`, ...sa });
  }
  if (lc.includes('paladin')) {
    prompts.push({ type: 'divine_smite', label: 'Divine Smite Available' });
  }
  if (lc.includes('barbarian')) {
    const dmg = RAGE.bonusDamage(level);
    prompts.push({ type: 'rage', label: `Rage Damage (+${dmg})`, bonusDamage: dmg });
  }

  for (const feat of feats) {
    const paf = POWER_ATTACK_FEATS[feat];
    if (paf) {
      prompts.push({ type: 'power_attack', label: `${feat} (-5/+10)`, feat, ...paf });
    }
    const rf = REACTION_FEATURES[feat];
    if (rf) {
      prompts.push({ type: 'reaction', label: feat, ...rf });
    }
  }

  return prompts;
}
