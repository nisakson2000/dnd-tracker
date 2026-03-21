// ============================================================================
// monsterStatBlocks.js — SRD 5.1 Monster Stat Block Database
// Pure JS, no React. Provides the 50 most commonly used SRD monsters.
// ============================================================================

export const MONSTER_STAT_BLOCKS = [
  // ===========================================================================
  // CR 0
  // ===========================================================================
  {
    name: "Commoner",
    size: "Medium",
    type: "humanoid",
    alignment: "any alignment",
    ac: 10,
    acType: "no armor",
    hp: 4,
    hpFormula: "1d8",
    speed: { walk: 30 },
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10,
    cr: 0,
    xp: 10,
    skills: {},
    senses: { passivePerception: 10 },
    languages: ["Common"],
    traits: [],
    actions: [
      {
        name: "Club",
        type: "melee",
        toHit: 2,
        reach: 5,
        damage: "1d4",
        damageType: "bludgeoning",
        description: "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 2 (1d4) bludgeoning damage."
      }
    ]
  },

  // ===========================================================================
  // CR 1/8
  // ===========================================================================
  {
    name: "Guard",
    size: "Medium",
    type: "humanoid",
    alignment: "any alignment",
    ac: 16,
    acType: "chain shirt, shield",
    hp: 11,
    hpFormula: "2d8+2",
    speed: { walk: 30 },
    str: 13,
    dex: 12,
    con: 12,
    int: 10,
    wis: 11,
    cha: 10,
    cr: 0.125,
    xp: 25,
    skills: { Perception: 2 },
    senses: { passivePerception: 12 },
    languages: ["Common"],
    traits: [],
    actions: [
      {
        name: "Spear",
        type: "melee",
        toHit: 3,
        reach: 5,
        damage: "1d6+1",
        damageType: "piercing",
        description: "Melee or Ranged Weapon Attack: +3 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 4 (1d6+1) piercing damage, or 5 (1d8+1) piercing damage if used with two hands."
      }
    ]
  },
  {
    name: "Bandit",
    size: "Medium",
    type: "humanoid",
    alignment: "any non-lawful alignment",
    ac: 12,
    acType: "leather armor",
    hp: 11,
    hpFormula: "2d8+2",
    speed: { walk: 30 },
    str: 11,
    dex: 12,
    con: 12,
    int: 10,
    wis: 10,
    cha: 10,
    cr: 0.125,
    xp: 25,
    skills: {},
    senses: { passivePerception: 10 },
    languages: ["Common"],
    traits: [],
    actions: [
      {
        name: "Scimitar",
        type: "melee",
        toHit: 3,
        reach: 5,
        damage: "1d6+1",
        damageType: "slashing",
        description: "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6+1) slashing damage."
      },
      {
        name: "Light Crossbow",
        type: "ranged",
        toHit: 3,
        range: "80/320",
        damage: "1d8+1",
        damageType: "piercing",
        description: "Ranged Weapon Attack: +3 to hit, range 80/320 ft., one target. Hit: 5 (1d8+1) piercing damage."
      }
    ]
  },
  {
    name: "Kobold",
    size: "Small",
    type: "humanoid",
    alignment: "lawful evil",
    ac: 12,
    acType: "natural armor",
    hp: 5,
    hpFormula: "2d6-2",
    speed: { walk: 30 },
    str: 7,
    dex: 15,
    con: 9,
    int: 8,
    wis: 7,
    cha: 8,
    cr: 0.125,
    xp: 25,
    skills: {},
    senses: { darkvision: 60, passivePerception: 8 },
    languages: ["Common", "Draconic"],
    traits: [
      {
        name: "Sunlight Sensitivity",
        description: "While in sunlight, the kobold has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight."
      },
      {
        name: "Pack Tactics",
        description: "The kobold has advantage on an attack roll against a creature if at least one of the kobold's allies is within 5 feet of the creature and the ally isn't incapacitated."
      }
    ],
    actions: [
      {
        name: "Dagger",
        type: "melee",
        toHit: 4,
        reach: 5,
        damage: "1d4+2",
        damageType: "piercing",
        description: "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4+2) piercing damage."
      },
      {
        name: "Sling",
        type: "ranged",
        toHit: 4,
        range: "30/120",
        damage: "1d4+2",
        damageType: "bludgeoning",
        description: "Ranged Weapon Attack: +4 to hit, range 30/120 ft., one target. Hit: 4 (1d4+2) bludgeoning damage."
      }
    ]
  },

  // ===========================================================================
  // CR 1/4
  // ===========================================================================
  {
    name: "Goblin",
    size: "Small",
    type: "humanoid",
    alignment: "neutral evil",
    ac: 15,
    acType: "leather armor, shield",
    hp: 7,
    hpFormula: "2d6",
    speed: { walk: 30 },
    str: 8,
    dex: 14,
    con: 10,
    int: 10,
    wis: 8,
    cha: 8,
    cr: 0.25,
    xp: 50,
    skills: { Stealth: 6 },
    senses: { darkvision: 60, passivePerception: 9 },
    languages: ["Common", "Goblin"],
    traits: [
      {
        name: "Nimble Escape",
        description: "The goblin can take the Disengage or Hide action as a bonus action on each of its turns."
      }
    ],
    actions: [
      {
        name: "Scimitar",
        type: "melee",
        toHit: 4,
        reach: 5,
        damage: "1d6+2",
        damageType: "slashing",
        description: "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6+2) slashing damage."
      },
      {
        name: "Shortbow",
        type: "ranged",
        toHit: 4,
        range: "80/320",
        damage: "1d6+2",
        damageType: "piercing",
        description: "Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target. Hit: 5 (1d6+2) piercing damage."
      }
    ]
  },
  {
    name: "Skeleton",
    size: "Medium",
    type: "undead",
    alignment: "lawful evil",
    ac: 13,
    acType: "armor scraps",
    hp: 13,
    hpFormula: "2d8+4",
    speed: { walk: 30 },
    str: 10,
    dex: 14,
    con: 15,
    int: 6,
    wis: 8,
    cha: 5,
    cr: 0.25,
    xp: 50,
    skills: {},
    senses: { darkvision: 60, passivePerception: 9 },
    languages: ["understands languages it knew in life but can't speak"],
    traits: [
      {
        name: "Damage Vulnerabilities",
        description: "Bludgeoning."
      },
      {
        name: "Damage Immunities",
        description: "Poison."
      },
      {
        name: "Condition Immunities",
        description: "Exhaustion, poisoned."
      }
    ],
    actions: [
      {
        name: "Shortsword",
        type: "melee",
        toHit: 4,
        reach: 5,
        damage: "1d6+2",
        damageType: "piercing",
        description: "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6+2) piercing damage."
      },
      {
        name: "Shortbow",
        type: "ranged",
        toHit: 4,
        range: "80/320",
        damage: "1d6+2",
        damageType: "piercing",
        description: "Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target. Hit: 5 (1d6+2) piercing damage."
      }
    ]
  },
  {
    name: "Zombie",
    size: "Medium",
    type: "undead",
    alignment: "neutral evil",
    ac: 8,
    acType: "no armor",
    hp: 22,
    hpFormula: "3d8+9",
    speed: { walk: 20 },
    str: 13,
    dex: 6,
    con: 16,
    int: 3,
    wis: 6,
    cha: 5,
    cr: 0.25,
    xp: 50,
    skills: {},
    senses: { darkvision: 60, passivePerception: 8 },
    languages: ["understands languages it knew in life but can't speak"],
    traits: [
      {
        name: "Undead Fortitude",
        description: "If damage reduces the zombie to 0 hit points, it must make a Constitution saving throw with a DC of 5 + the damage taken, unless the damage is radiant or from a critical hit. On a success, the zombie drops to 1 hit point instead."
      },
      {
        name: "Damage Immunities",
        description: "Poison."
      },
      {
        name: "Condition Immunities",
        description: "Poisoned."
      }
    ],
    actions: [
      {
        name: "Slam",
        type: "melee",
        toHit: 3,
        reach: 5,
        damage: "1d6+1",
        damageType: "bludgeoning",
        description: "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6+1) bludgeoning damage."
      }
    ]
  },

  // ===========================================================================
  // CR 1/2
  // ===========================================================================
  {
    name: "Orc",
    size: "Medium",
    type: "humanoid",
    alignment: "chaotic evil",
    ac: 13,
    acType: "hide armor",
    hp: 15,
    hpFormula: "2d8+6",
    speed: { walk: 30 },
    str: 16,
    dex: 12,
    con: 16,
    int: 7,
    wis: 11,
    cha: 10,
    cr: 0.5,
    xp: 100,
    skills: { Intimidation: 2 },
    senses: { darkvision: 60, passivePerception: 10 },
    languages: ["Common", "Orc"],
    traits: [
      {
        name: "Aggressive",
        description: "As a bonus action, the orc can move up to its speed toward a hostile creature that it can see."
      }
    ],
    actions: [
      {
        name: "Greataxe",
        type: "melee",
        toHit: 5,
        reach: 5,
        damage: "1d12+3",
        damageType: "slashing",
        description: "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9 (1d12+3) slashing damage."
      },
      {
        name: "Javelin",
        type: "ranged",
        toHit: 5,
        range: "30/120",
        damage: "1d6+3",
        damageType: "piercing",
        description: "Melee or Ranged Weapon Attack: +5 to hit, reach 5 ft. or range 30/120 ft., one target. Hit: 6 (1d6+3) piercing damage."
      }
    ]
  },
  {
    name: "Shadow",
    size: "Medium",
    type: "undead",
    alignment: "chaotic evil",
    ac: 12,
    acType: "natural armor",
    hp: 16,
    hpFormula: "3d8+3",
    speed: { walk: 40 },
    str: 6,
    dex: 14,
    con: 13,
    int: 6,
    wis: 10,
    cha: 8,
    cr: 0.5,
    xp: 100,
    skills: { Stealth: 4 },
    senses: { darkvision: 60, passivePerception: 10 },
    languages: [],
    traits: [
      {
        name: "Amorphous",
        description: "The shadow can move through a space as narrow as 1 inch wide without squeezing."
      },
      {
        name: "Shadow Stealth",
        description: "While in dim light or darkness, the shadow can take the Hide action as a bonus action. Its stealth bonus is also improved to +6."
      },
      {
        name: "Sunlight Weakness",
        description: "While in sunlight, the shadow has disadvantage on attack rolls, ability checks, and saving throws."
      }
    ],
    actions: [
      {
        name: "Strength Drain",
        type: "melee",
        toHit: 4,
        reach: 5,
        damage: "2d6+2",
        damageType: "necrotic",
        description: "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 9 (2d6+2) necrotic damage, and the target's Strength score is reduced by 1d4. The target dies if this reduces its Strength to 0. Otherwise, the reduction lasts until the target finishes a short or long rest. A non-evil humanoid slain by this attack rises 1d4 hours later as a shadow."
      }
    ]
  },
  {
    name: "Thug",
    size: "Medium",
    type: "humanoid",
    alignment: "any non-good alignment",
    ac: 11,
    acType: "leather armor",
    hp: 32,
    hpFormula: "5d8+10",
    speed: { walk: 30 },
    str: 15,
    dex: 11,
    con: 14,
    int: 10,
    wis: 10,
    cha: 11,
    cr: 0.5,
    xp: 100,
    skills: { Intimidation: 2 },
    senses: { passivePerception: 10 },
    languages: ["Common"],
    traits: [
      {
        name: "Pack Tactics",
        description: "The thug has advantage on an attack roll against a creature if at least one of the thug's allies is within 5 feet of the creature and the ally isn't incapacitated."
      }
    ],
    actions: [
      {
        name: "Multiattack",
        type: "special",
        description: "The thug makes two melee attacks."
      },
      {
        name: "Mace",
        type: "melee",
        toHit: 4,
        reach: 5,
        damage: "1d6+2",
        damageType: "bludgeoning",
        description: "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 5 (1d6+2) bludgeoning damage."
      },
      {
        name: "Heavy Crossbow",
        type: "ranged",
        toHit: 2,
        range: "100/400",
        damage: "1d10",
        damageType: "piercing",
        description: "Ranged Weapon Attack: +2 to hit, range 100/400 ft., one target. Hit: 5 (1d10) piercing damage."
      }
    ]
  },

  // ===========================================================================
  // CR 1
  // ===========================================================================
  {
    name: "Dire Wolf",
    size: "Large",
    type: "beast",
    alignment: "unaligned",
    ac: 14,
    acType: "natural armor",
    hp: 37,
    hpFormula: "5d10+10",
    speed: { walk: 50 },
    str: 17,
    dex: 15,
    con: 15,
    int: 3,
    wis: 12,
    cha: 7,
    cr: 1,
    xp: 200,
    skills: { Perception: 3, Stealth: 4 },
    senses: { passivePerception: 13 },
    languages: [],
    traits: [
      {
        name: "Keen Hearing and Smell",
        description: "The wolf has advantage on Wisdom (Perception) checks that rely on hearing or smell."
      },
      {
        name: "Pack Tactics",
        description: "The wolf has advantage on an attack roll against a creature if at least one of the wolf's allies is within 5 feet of the creature and the ally isn't incapacitated."
      }
    ],
    actions: [
      {
        name: "Bite",
        type: "melee",
        toHit: 5,
        reach: 5,
        damage: "2d6+3",
        damageType: "piercing",
        description: "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6+3) piercing damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone."
      }
    ]
  },
  {
    name: "Giant Spider",
    size: "Large",
    type: "beast",
    alignment: "unaligned",
    ac: 14,
    acType: "natural armor",
    hp: 26,
    hpFormula: "4d10+4",
    speed: { walk: 30, climb: 30 },
    str: 14,
    dex: 16,
    con: 12,
    int: 2,
    wis: 11,
    cha: 4,
    cr: 1,
    xp: 200,
    skills: { Stealth: 7 },
    senses: { blindsight: 10, darkvision: 60, passivePerception: 10 },
    languages: [],
    traits: [
      {
        name: "Spider Climb",
        description: "The spider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."
      },
      {
        name: "Web Sense",
        description: "While in contact with a web, the spider knows the exact location of any other creature in contact with the same web."
      },
      {
        name: "Web Walker",
        description: "The spider ignores movement restrictions caused by webbing."
      }
    ],
    actions: [
      {
        name: "Bite",
        type: "melee",
        toHit: 5,
        reach: 5,
        damage: "1d8+3",
        damageType: "piercing",
        description: "Melee Weapon Attack: +5 to hit, reach 5 ft., one creature. Hit: 7 (1d8+3) piercing damage, and the target must make a DC 11 Constitution saving throw, taking 9 (2d8) poison damage on a failed save, or half as much on a successful one. If the poison damage reduces the target to 0 hit points, the target is stable but poisoned for 1 hour, even after regaining hit points, and is paralyzed while poisoned in this way."
      },
      {
        name: "Web (Recharge 5-6)",
        type: "ranged",
        toHit: 5,
        range: "30/60",
        damage: "0",
        damageType: "none",
        description: "Ranged Weapon Attack: +5 to hit, range 30/60 ft., one creature. Hit: The target is restrained by webbing. As an action, the restrained target can make a DC 12 Strength check, bursting the webbing on a success. The webbing can also be attacked and destroyed (AC 10; hp 5; vulnerability to fire damage; immunity to bludgeoning, poison, and psychic damage)."
      }
    ]
  },
  {
    name: "Ghoul",
    size: "Medium",
    type: "undead",
    alignment: "chaotic evil",
    ac: 12,
    acType: "natural armor",
    hp: 22,
    hpFormula: "5d8",
    speed: { walk: 30 },
    str: 13,
    dex: 15,
    con: 10,
    int: 7,
    wis: 10,
    cha: 6,
    cr: 1,
    xp: 200,
    skills: {},
    senses: { darkvision: 60, passivePerception: 10 },
    languages: ["Common"],
    traits: [
      {
        name: "Damage Immunities",
        description: "Poison."
      },
      {
        name: "Condition Immunities",
        description: "Charmed, exhaustion, poisoned."
      }
    ],
    actions: [
      {
        name: "Bite",
        type: "melee",
        toHit: 2,
        reach: 5,
        damage: "2d6+2",
        damageType: "piercing",
        description: "Melee Weapon Attack: +2 to hit, reach 5 ft., one creature. Hit: 9 (2d6+2) piercing damage."
      },
      {
        name: "Claws",
        type: "melee",
        toHit: 4,
        reach: 5,
        damage: "2d4+2",
        damageType: "slashing",
        description: "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (2d4+2) slashing damage. If the target is a creature other than an elf or undead, it must succeed on a DC 10 Constitution saving throw or be paralyzed for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ]
  },
  {
    name: "Specter",
    size: "Medium",
    type: "undead",
    alignment: "chaotic evil",
    ac: 12,
    acType: "natural armor",
    hp: 22,
    hpFormula: "5d8",
    speed: { walk: 0, fly: 50 },
    str: 1,
    dex: 14,
    con: 11,
    int: 10,
    wis: 10,
    cha: 11,
    cr: 1,
    xp: 200,
    skills: {},
    senses: { darkvision: 60, passivePerception: 10 },
    languages: ["understands languages it knew in life but can't speak"],
    traits: [
      {
        name: "Incorporeal Movement",
        description: "The specter can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object."
      },
      {
        name: "Sunlight Sensitivity",
        description: "While in sunlight, the specter has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight."
      },
      {
        name: "Damage Resistances",
        description: "Acid, cold, fire, lightning, thunder; bludgeoning, piercing, and slashing from nonmagical attacks."
      }
    ],
    actions: [
      {
        name: "Life Drain",
        type: "melee",
        toHit: 4,
        reach: 5,
        damage: "3d6",
        damageType: "necrotic",
        description: "Melee Spell Attack: +4 to hit, reach 5 ft., one creature. Hit: 10 (3d6) necrotic damage. The target must succeed on a DC 10 Constitution saving throw or its hit point maximum is reduced by an amount equal to the damage taken. This reduction lasts until the creature finishes a long rest. The target dies if this effect reduces its hit point maximum to 0."
      }
    ]
  },

  // ===========================================================================
  // CR 2
  // ===========================================================================
  {
    name: "Ogre",
    size: "Large",
    type: "giant",
    alignment: "chaotic evil",
    ac: 11,
    acType: "hide armor",
    hp: 59,
    hpFormula: "7d10+21",
    speed: { walk: 40 },
    str: 19,
    dex: 8,
    con: 16,
    int: 5,
    wis: 7,
    cha: 7,
    cr: 2,
    xp: 450,
    skills: {},
    senses: { darkvision: 60, passivePerception: 8 },
    languages: ["Common", "Giant"],
    traits: [],
    actions: [
      {
        name: "Greatclub",
        type: "melee",
        toHit: 6,
        reach: 5,
        damage: "2d8+4",
        damageType: "bludgeoning",
        description: "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 13 (2d8+4) bludgeoning damage."
      },
      {
        name: "Javelin",
        type: "ranged",
        toHit: 6,
        range: "30/120",
        damage: "2d6+4",
        damageType: "piercing",
        description: "Melee or Ranged Weapon Attack: +6 to hit, reach 5 ft. or range 30/120 ft., one target. Hit: 11 (2d6+4) piercing damage."
      }
    ]
  },
  {
    name: "Ghast",
    size: "Medium",
    type: "undead",
    alignment: "chaotic evil",
    ac: 13,
    acType: "natural armor",
    hp: 36,
    hpFormula: "8d8",
    speed: { walk: 30 },
    str: 16,
    dex: 17,
    con: 10,
    int: 11,
    wis: 10,
    cha: 8,
    cr: 2,
    xp: 450,
    skills: {},
    senses: { darkvision: 60, passivePerception: 10 },
    languages: ["Common"],
    traits: [
      {
        name: "Stench",
        description: "Any creature that starts its turn within 5 feet of the ghast must succeed on a DC 10 Constitution saving throw or be poisoned until the start of its next turn. On a successful saving throw, the creature is immune to the ghast's Stench for 24 hours."
      },
      {
        name: "Turning Defiance",
        description: "The ghast and any ghouls within 30 feet of it have advantage on saving throws against effects that turn undead."
      },
      {
        name: "Damage Immunities",
        description: "Poison."
      }
    ],
    actions: [
      {
        name: "Bite",
        type: "melee",
        toHit: 3,
        reach: 5,
        damage: "2d8+3",
        damageType: "piercing",
        description: "Melee Weapon Attack: +3 to hit, reach 5 ft., one creature. Hit: 12 (2d8+3) piercing damage."
      },
      {
        name: "Claws",
        type: "melee",
        toHit: 5,
        reach: 5,
        damage: "2d6+3",
        damageType: "slashing",
        description: "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6+3) slashing damage. If the target is a creature other than an undead, it must succeed on a DC 10 Constitution saving throw or be paralyzed for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ]
  },
  {
    name: "Mimic",
    size: "Medium",
    type: "monstrosity",
    alignment: "neutral",
    ac: 12,
    acType: "natural armor",
    hp: 58,
    hpFormula: "9d8+18",
    speed: { walk: 15 },
    str: 17,
    dex: 12,
    con: 15,
    int: 5,
    wis: 13,
    cha: 8,
    cr: 2,
    xp: 450,
    skills: { Stealth: 5 },
    senses: { darkvision: 60, passivePerception: 11 },
    languages: [],
    traits: [
      {
        name: "Shapechanger",
        description: "The mimic can use its action to polymorph into an object or back into its true, amorphous form. Its statistics are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies."
      },
      {
        name: "Adhesive (Object Form Only)",
        description: "The mimic adheres to anything that touches it. A Huge or smaller creature adhered to the mimic is also grappled by it (escape DC 13). Ability checks made to escape this grapple have disadvantage."
      },
      {
        name: "False Appearance (Object Form Only)",
        description: "While the mimic remains motionless, it is indistinguishable from an ordinary object."
      }
    ],
    actions: [
      {
        name: "Pseudopod",
        type: "melee",
        toHit: 5,
        reach: 5,
        damage: "1d8+3",
        damageType: "bludgeoning",
        description: "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8+3) bludgeoning damage. If the mimic is in object form, the target is subjected to its Adhesive trait."
      },
      {
        name: "Bite",
        type: "melee",
        toHit: 5,
        reach: 5,
        damage: "1d8+3",
        damageType: "piercing",
        description: "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8+3) piercing damage plus 4 (1d8) acid damage."
      }
    ]
  },

  // ===========================================================================
  // CR 3
  // ===========================================================================
  {
    name: "Werewolf",
    size: "Medium",
    type: "humanoid",
    alignment: "chaotic evil",
    ac: 12,
    acType: "natural armor in hybrid/wolf form, 11 in humanoid form",
    hp: 58,
    hpFormula: "9d8+18",
    speed: { walk: 30 },
    str: 15,
    dex: 13,
    con: 14,
    int: 10,
    wis: 11,
    cha: 10,
    cr: 3,
    xp: 700,
    skills: { Perception: 4, Stealth: 3 },
    senses: { passivePerception: 14 },
    languages: ["Common"],
    traits: [
      {
        name: "Shapechanger",
        description: "The werewolf can use its action to polymorph into a wolf-humanoid hybrid or into a wolf, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form."
      },
      {
        name: "Keen Hearing and Smell",
        description: "The werewolf has advantage on Wisdom (Perception) checks that rely on hearing or smell."
      },
      {
        name: "Damage Immunities",
        description: "Bludgeoning, piercing, and slashing from nonmagical attacks not made with silvered weapons."
      }
    ],
    actions: [
      {
        name: "Multiattack (Humanoid or Hybrid Form Only)",
        type: "special",
        description: "The werewolf makes two attacks: one with its bite and one with its claws or spear."
      },
      {
        name: "Bite (Wolf or Hybrid Form Only)",
        type: "melee",
        toHit: 4,
        reach: 5,
        damage: "1d8+2",
        damageType: "piercing",
        description: "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8+2) piercing damage. If the target is a humanoid, it must succeed on a DC 12 Constitution saving throw or be cursed with werewolf lycanthropy."
      },
      {
        name: "Claws (Hybrid Form Only)",
        type: "melee",
        toHit: 4,
        reach: 5,
        damage: "2d4+2",
        damageType: "slashing",
        description: "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 7 (2d4+2) slashing damage."
      }
    ]
  },
  {
    name: "Owlbear",
    size: "Large",
    type: "monstrosity",
    alignment: "unaligned",
    ac: 13,
    acType: "natural armor",
    hp: 59,
    hpFormula: "7d10+21",
    speed: { walk: 40 },
    str: 20,
    dex: 12,
    con: 17,
    int: 3,
    wis: 12,
    cha: 7,
    cr: 3,
    xp: 700,
    skills: { Perception: 3 },
    senses: { darkvision: 60, passivePerception: 13 },
    languages: [],
    traits: [
      {
        name: "Keen Sight and Smell",
        description: "The owlbear has advantage on Wisdom (Perception) checks that rely on sight or smell."
      }
    ],
    actions: [
      {
        name: "Multiattack",
        type: "special",
        description: "The owlbear makes two attacks: one with its beak and one with its claws."
      },
      {
        name: "Beak",
        type: "melee",
        toHit: 7,
        reach: 5,
        damage: "1d10+5",
        damageType: "piercing",
        description: "Melee Weapon Attack: +7 to hit, reach 5 ft., one creature. Hit: 10 (1d10+5) piercing damage."
      },
      {
        name: "Claws",
        type: "melee",
        toHit: 7,
        reach: 5,
        damage: "2d8+5",
        damageType: "slashing",
        description: "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 14 (2d8+5) slashing damage."
      }
    ]
  },
  {
    name: "Mummy",
    size: "Medium",
    type: "undead",
    alignment: "lawful evil",
    ac: 11,
    acType: "natural armor",
    hp: 58,
    hpFormula: "9d8+18",
    speed: { walk: 20 },
    str: 16,
    dex: 8,
    con: 15,
    int: 6,
    wis: 10,
    cha: 12,
    cr: 3,
    xp: 700,
    skills: {},
    senses: { darkvision: 60, passivePerception: 10 },
    languages: ["languages it knew in life"],
    traits: [
      {
        name: "Damage Vulnerabilities",
        description: "Fire."
      },
      {
        name: "Damage Resistances",
        description: "Bludgeoning, piercing, and slashing from nonmagical attacks."
      },
      {
        name: "Damage Immunities",
        description: "Necrotic, poison."
      }
    ],
    actions: [
      {
        name: "Multiattack",
        type: "special",
        description: "The mummy can use its Dreadful Glare and makes one attack with its rotting fist."
      },
      {
        name: "Rotting Fist",
        type: "melee",
        toHit: 5,
        reach: 5,
        damage: "2d6+3",
        damageType: "bludgeoning",
        description: "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6+3) bludgeoning damage plus 10 (3d6) necrotic damage. If the target is a creature, it must succeed on a DC 12 Constitution saving throw or be cursed with mummy rot."
      },
      {
        name: "Dreadful Glare",
        type: "special",
        description: "The mummy targets one creature it can see within 60 feet of it. If the target can see the mummy, it must succeed on a DC 11 Wisdom saving throw against this magic or become frightened until the end of the mummy's next turn. If the target fails the saving throw by 5 or more, it is also paralyzed for the same duration."
      }
    ]
  },
  {
    name: "Manticore",
    size: "Large",
    type: "monstrosity",
    alignment: "lawful evil",
    ac: 14,
    acType: "natural armor",
    hp: 68,
    hpFormula: "8d10+24",
    speed: { walk: 30, fly: 50 },
    str: 17,
    dex: 16,
    con: 17,
    int: 7,
    wis: 12,
    cha: 8,
    cr: 3,
    xp: 700,
    skills: {},
    senses: { darkvision: 60, passivePerception: 11 },
    languages: ["Common"],
    traits: [
      {
        name: "Tail Spike Regrowth",
        description: "The manticore has twenty-four tail spikes. Used spikes regrow when the manticore finishes a long rest."
      }
    ],
    actions: [
      {
        name: "Multiattack",
        type: "special",
        description: "The manticore makes three attacks: one with its bite and two with its claws or three with its tail spikes."
      },
      {
        name: "Bite",
        type: "melee",
        toHit: 5,
        reach: 5,
        damage: "1d8+3",
        damageType: "piercing",
        description: "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8+3) piercing damage."
      },
      {
        name: "Claw",
        type: "melee",
        toHit: 5,
        reach: 5,
        damage: "1d6+3",
        damageType: "slashing",
        description: "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6+3) slashing damage."
      },
      {
        name: "Tail Spike",
        type: "ranged",
        toHit: 5,
        range: "100/200",
        damage: "1d8+3",
        damageType: "piercing",
        description: "Ranged Weapon Attack: +5 to hit, range 100/200 ft., one target. Hit: 7 (1d8+3) piercing damage."
      }
    ]
  },

  // ===========================================================================
  // CR 4
  // ===========================================================================
  {
    name: "Banshee",
    size: "Medium",
    type: "undead",
    alignment: "chaotic evil",
    ac: 12,
    acType: "natural armor",
    hp: 58,
    hpFormula: "13d8",
    speed: { walk: 0, fly: 40 },
    str: 1,
    dex: 14,
    con: 10,
    int: 12,
    wis: 11,
    cha: 17,
    cr: 4,
    xp: 1100,
    skills: {},
    senses: { darkvision: 60, passivePerception: 10 },
    languages: ["Common", "Elvish"],
    traits: [
      {
        name: "Detect Life",
        description: "The banshee can magically sense the presence of living creatures up to 5 miles away that aren't undead or constructs. She knows the general direction they're in but not their exact locations."
      },
      {
        name: "Incorporeal Movement",
        description: "The banshee can move through other creatures and objects as if they were difficult terrain. She takes 5 (1d10) force damage if she ends her turn inside an object."
      },
      {
        name: "Damage Resistances",
        description: "Acid, fire, lightning, thunder; bludgeoning, piercing, and slashing from nonmagical attacks."
      }
    ],
    actions: [
      {
        name: "Corrupting Touch",
        type: "melee",
        toHit: 4,
        reach: 5,
        damage: "3d6+2",
        damageType: "necrotic",
        description: "Melee Spell Attack: +4 to hit, reach 5 ft., one target. Hit: 12 (3d6+2) necrotic damage."
      },
      {
        name: "Horrifying Visage",
        type: "special",
        description: "Each non-undead creature within 60 feet of the banshee that can see her must succeed on a DC 13 Wisdom saving throw or be frightened for 1 minute. A frightened target can repeat the saving throw at the end of each of its turns, with disadvantage if the banshee is within line of sight, ending the effect on itself on a success."
      },
      {
        name: "Wail (1/Day)",
        type: "special",
        description: "The banshee releases a mournful wail, provided that she isn't in sunlight. This wail has no effect on constructs and undead. All other creatures within 30 feet of her that can hear her must make a DC 13 Constitution saving throw. On a failure, a creature drops to 0 hit points. On a success, a creature takes 10 (3d6) psychic damage."
      }
    ]
  },
  {
    name: "Ettin",
    size: "Large",
    type: "giant",
    alignment: "chaotic evil",
    ac: 12,
    acType: "natural armor",
    hp: 85,
    hpFormula: "10d10+30",
    speed: { walk: 40 },
    str: 21,
    dex: 8,
    con: 17,
    int: 6,
    wis: 10,
    cha: 8,
    cr: 4,
    xp: 1100,
    skills: { Perception: 4 },
    senses: { darkvision: 60, passivePerception: 14 },
    languages: ["Giant", "Orc"],
    traits: [
      {
        name: "Two Heads",
        description: "The ettin has advantage on Wisdom (Perception) checks and on saving throws against being blinded, charmed, deafened, frightened, stunned, and knocked unconscious."
      },
      {
        name: "Wakeful",
        description: "When one of the ettin's heads is asleep, its other head is awake."
      }
    ],
    actions: [
      {
        name: "Multiattack",
        type: "special",
        description: "The ettin makes two attacks: one with its battleaxe and one with its morningstar."
      },
      {
        name: "Battleaxe",
        type: "melee",
        toHit: 7,
        reach: 5,
        damage: "2d8+5",
        damageType: "slashing",
        description: "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 14 (2d8+5) slashing damage."
      },
      {
        name: "Morningstar",
        type: "melee",
        toHit: 7,
        reach: 5,
        damage: "2d8+5",
        damageType: "piercing",
        description: "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 14 (2d8+5) piercing damage."
      }
    ]
  },

  // ===========================================================================
  // CR 5
  // ===========================================================================
  {
    name: "Troll",
    size: "Large",
    type: "giant",
    alignment: "chaotic evil",
    ac: 15,
    acType: "natural armor",
    hp: 84,
    hpFormula: "8d10+40",
    speed: { walk: 30 },
    str: 18,
    dex: 13,
    con: 20,
    int: 7,
    wis: 9,
    cha: 7,
    cr: 5,
    xp: 1800,
    skills: { Perception: 2 },
    senses: { darkvision: 60, passivePerception: 12 },
    languages: ["Giant"],
    traits: [
      {
        name: "Keen Smell",
        description: "The troll has advantage on Wisdom (Perception) checks that rely on smell."
      },
      {
        name: "Regeneration",
        description: "The troll regains 10 hit points at the start of its turn. If the troll takes acid or fire damage, this trait doesn't function at the start of the troll's next turn. The troll dies only if it starts its turn with 0 hit points and doesn't regenerate."
      }
    ],
    actions: [
      {
        name: "Multiattack",
        type: "special",
        description: "The troll makes three attacks: one with its bite and two with its claws."
      },
      {
        name: "Bite",
        type: "melee",
        toHit: 7,
        reach: 5,
        damage: "1d6+4",
        damageType: "piercing",
        description: "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 7 (1d6+4) piercing damage."
      },
      {
        name: "Claw",
        type: "melee",
        toHit: 7,
        reach: 5,
        damage: "2d6+4",
        damageType: "slashing",
        description: "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6+4) slashing damage."
      }
    ]
  },
  {
    name: "Salamander",
    size: "Large",
    type: "elemental",
    alignment: "neutral evil",
    ac: 15,
    acType: "natural armor",
    hp: 90,
    hpFormula: "12d10+24",
    speed: { walk: 30 },
    str: 18,
    dex: 14,
    con: 15,
    int: 11,
    wis: 10,
    cha: 12,
    cr: 5,
    xp: 1800,
    skills: {},
    senses: { darkvision: 60, passivePerception: 10 },
    languages: ["Ignan"],
    traits: [
      {
        name: "Heated Body",
        description: "A creature that touches the salamander or hits it with a melee attack while within 5 feet of it takes 7 (2d6) fire damage."
      },
      {
        name: "Heated Weapons",
        description: "Any metal melee weapon the salamander wields deals an extra 3 (1d6) fire damage on a hit (included in the attack)."
      },
      {
        name: "Damage Vulnerabilities",
        description: "Cold."
      }
    ],
    actions: [
      {
        name: "Multiattack",
        type: "special",
        description: "The salamander makes two attacks: one with its spear and one with its tail."
      },
      {
        name: "Spear",
        type: "melee",
        toHit: 7,
        reach: 5,
        damage: "2d6+4",
        damageType: "piercing",
        description: "Melee or Ranged Weapon Attack: +7 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 11 (2d6+4) piercing damage, or 13 (2d8+4) piercing damage if used with two hands, plus 3 (1d6) fire damage."
      },
      {
        name: "Tail",
        type: "melee",
        toHit: 7,
        reach: 10,
        damage: "2d6+4",
        damageType: "bludgeoning",
        description: "Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 11 (2d6+4) bludgeoning damage plus 7 (2d6) fire damage, and the target is grappled (escape DC 14). Until this grapple ends, the target is restrained, the target takes 7 (2d6) fire damage at the start of each of its turns, and the salamander can't make tail attacks against other targets."
      }
    ]
  },
  {
    name: "Hill Giant",
    size: "Huge",
    type: "giant",
    alignment: "chaotic evil",
    ac: 13,
    acType: "natural armor",
    hp: 105,
    hpFormula: "10d12+40",
    speed: { walk: 40 },
    str: 21,
    dex: 8,
    con: 19,
    int: 5,
    wis: 9,
    cha: 6,
    cr: 5,
    xp: 1800,
    skills: { Perception: 2 },
    senses: { passivePerception: 12 },
    languages: ["Giant"],
    traits: [],
    actions: [
      {
        name: "Multiattack",
        type: "special",
        description: "The giant makes two greatclub attacks."
      },
      {
        name: "Greatclub",
        type: "melee",
        toHit: 8,
        reach: 10,
        damage: "3d8+5",
        damageType: "bludgeoning",
        description: "Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 18 (3d8+5) bludgeoning damage."
      },
      {
        name: "Rock",
        type: "ranged",
        toHit: 8,
        range: "60/240",
        damage: "3d10+5",
        damageType: "bludgeoning",
        description: "Ranged Weapon Attack: +8 to hit, range 60/240 ft., one target. Hit: 21 (3d10+5) bludgeoning damage."
      }
    ]
  },
  {
    name: "Shambling Mound",
    size: "Large",
    type: "plant",
    alignment: "unaligned",
    ac: 15,
    acType: "natural armor",
    hp: 136,
    hpFormula: "16d10+48",
    speed: { walk: 20, swim: 20 },
    str: 18,
    dex: 8,
    con: 16,
    int: 5,
    wis: 10,
    cha: 5,
    cr: 5,
    xp: 1800,
    skills: { Stealth: 2 },
    senses: { blindsight: 60, passivePerception: 10 },
    languages: [],
    traits: [
      {
        name: "Lightning Absorption",
        description: "Whenever the shambling mound is subjected to lightning damage, it takes no damage and regains a number of hit points equal to the lightning damage dealt."
      },
      {
        name: "Damage Resistances",
        description: "Cold, fire."
      },
      {
        name: "Damage Immunities",
        description: "Lightning."
      }
    ],
    actions: [
      {
        name: "Multiattack",
        type: "special",
        description: "The shambling mound makes two slam attacks. If both attacks hit a Medium or smaller target, the target is grappled (escape DC 14), and the shambling mound uses its Engulf on it."
      },
      {
        name: "Slam",
        type: "melee",
        toHit: 7,
        reach: 5,
        damage: "2d8+4",
        damageType: "bludgeoning",
        description: "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 13 (2d8+4) bludgeoning damage."
      },
      {
        name: "Engulf",
        type: "special",
        description: "The shambling mound engulfs a Medium or smaller creature grappled by it. The engulfed target is blinded, restrained, and unable to breathe, and it must succeed on a DC 14 Constitution saving throw at the start of each of the mound's turns or take 13 (2d8+4) bludgeoning damage. If the mound moves, the engulfed target moves with it. The mound can have only one creature engulfed at a time."
      }
    ]
  },

  // ===========================================================================
  // CR 6
  // ===========================================================================
  {
    name: "Wyvern",
    size: "Large",
    type: "dragon",
    alignment: "unaligned",
    ac: 13,
    acType: "natural armor",
    hp: 110,
    hpFormula: "13d10+39",
    speed: { walk: 20, fly: 80 },
    str: 19,
    dex: 10,
    con: 16,
    int: 5,
    wis: 12,
    cha: 6,
    cr: 6,
    xp: 2300,
    skills: { Perception: 4 },
    senses: { darkvision: 60, passivePerception: 14 },
    languages: [],
    traits: [],
    actions: [
      {
        name: "Multiattack",
        type: "special",
        description: "The wyvern makes two attacks: one with its bite and one with its stinger. While flying, it can use its claws in place of one other attack."
      },
      {
        name: "Bite",
        type: "melee",
        toHit: 7,
        reach: 10,
        damage: "2d6+4",
        damageType: "piercing",
        description: "Melee Weapon Attack: +7 to hit, reach 10 ft., one creature. Hit: 11 (2d6+4) piercing damage."
      },
      {
        name: "Claws",
        type: "melee",
        toHit: 7,
        reach: 5,
        damage: "2d8+4",
        damageType: "slashing",
        description: "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 13 (2d8+4) slashing damage."
      },
      {
        name: "Stinger",
        type: "melee",
        toHit: 7,
        reach: 10,
        damage: "2d6+4",
        damageType: "piercing",
        description: "Melee Weapon Attack: +7 to hit, reach 10 ft., one creature. Hit: 11 (2d6+4) piercing damage. The target must make a DC 15 Constitution saving throw, taking 24 (7d6) poison damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },

  // ===========================================================================
  // CR 7
  // ===========================================================================
  {
    name: "Stone Giant",
    size: "Huge",
    type: "giant",
    alignment: "neutral",
    ac: 17,
    acType: "natural armor",
    hp: 126,
    hpFormula: "11d12+55",
    speed: { walk: 40 },
    str: 23,
    dex: 15,
    con: 20,
    int: 10,
    wis: 12,
    cha: 9,
    cr: 7,
    xp: 2900,
    skills: { Athletics: 12, Perception: 4 },
    senses: { darkvision: 60, passivePerception: 14 },
    languages: ["Giant"],
    traits: [
      {
        name: "Stone Camouflage",
        description: "The giant has advantage on Dexterity (Stealth) checks made to hide in rocky terrain."
      }
    ],
    actions: [
      {
        name: "Multiattack",
        type: "special",
        description: "The giant makes two greatclub attacks."
      },
      {
        name: "Greatclub",
        type: "melee",
        toHit: 9,
        reach: 15,
        damage: "3d8+6",
        damageType: "bludgeoning",
        description: "Melee Weapon Attack: +9 to hit, reach 15 ft., one target. Hit: 19 (3d8+6) bludgeoning damage."
      },
      {
        name: "Rock",
        type: "ranged",
        toHit: 9,
        range: "60/240",
        damage: "4d10+6",
        damageType: "bludgeoning",
        description: "Ranged Weapon Attack: +9 to hit, range 60/240 ft., one target. Hit: 28 (4d10+6) bludgeoning damage. If the target is a creature, it must succeed on a DC 17 Strength saving throw or be knocked prone."
      }
    ]
  },

  // ===========================================================================
  // CR 8
  // ===========================================================================
  {
    name: "Frost Giant",
    size: "Huge",
    type: "giant",
    alignment: "neutral evil",
    ac: 15,
    acType: "patchwork armor",
    hp: 138,
    hpFormula: "12d12+60",
    speed: { walk: 40 },
    str: 23,
    dex: 9,
    con: 21,
    int: 9,
    wis: 10,
    cha: 12,
    cr: 8,
    xp: 3900,
    skills: { Athletics: 9, Perception: 3 },
    senses: { passivePerception: 13 },
    languages: ["Giant"],
    traits: [
      {
        name: "Damage Immunities",
        description: "Cold."
      }
    ],
    actions: [
      {
        name: "Multiattack",
        type: "special",
        description: "The giant makes two greataxe attacks."
      },
      {
        name: "Greataxe",
        type: "melee",
        toHit: 9,
        reach: 10,
        damage: "3d12+6",
        damageType: "slashing",
        description: "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 25 (3d12+6) slashing damage."
      },
      {
        name: "Rock",
        type: "ranged",
        toHit: 9,
        range: "60/240",
        damage: "4d10+6",
        damageType: "bludgeoning",
        description: "Ranged Weapon Attack: +9 to hit, range 60/240 ft., one target. Hit: 28 (4d10+6) bludgeoning damage."
      }
    ]
  },

  // ===========================================================================
  // CR 9
  // ===========================================================================
  {
    name: "Fire Giant",
    size: "Huge",
    type: "giant",
    alignment: "lawful evil",
    ac: 18,
    acType: "plate armor",
    hp: 162,
    hpFormula: "13d12+78",
    speed: { walk: 30 },
    str: 25,
    dex: 9,
    con: 23,
    int: 10,
    wis: 14,
    cha: 13,
    cr: 9,
    xp: 5000,
    skills: { Athletics: 11, Perception: 6 },
    senses: { passivePerception: 16 },
    languages: ["Giant"],
    traits: [
      {
        name: "Damage Immunities",
        description: "Fire."
      }
    ],
    actions: [
      {
        name: "Multiattack",
        type: "special",
        description: "The giant makes two greatsword attacks."
      },
      {
        name: "Greatsword",
        type: "melee",
        toHit: 11,
        reach: 10,
        damage: "6d6+7",
        damageType: "slashing",
        description: "Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 28 (6d6+7) slashing damage."
      },
      {
        name: "Rock",
        type: "ranged",
        toHit: 11,
        range: "60/240",
        damage: "4d10+7",
        damageType: "bludgeoning",
        description: "Ranged Weapon Attack: +11 to hit, range 60/240 ft., one target. Hit: 29 (4d10+7) bludgeoning damage."
      }
    ]
  },
  {
    name: "Young Blue Dragon",
    size: "Large",
    type: "dragon",
    alignment: "lawful evil",
    ac: 18,
    acType: "natural armor",
    hp: 152,
    hpFormula: "16d10+64",
    speed: { walk: 40, burrow: 20, fly: 80 },
    str: 21,
    dex: 10,
    con: 19,
    int: 14,
    wis: 13,
    cha: 17,
    cr: 9,
    xp: 5000,
    skills: { Perception: 9, Stealth: 4 },
    senses: { blindsight: 30, darkvision: 120, passivePerception: 19 },
    languages: ["Common", "Draconic"],
    traits: [
      {
        name: "Damage Immunities",
        description: "Lightning."
      }
    ],
    actions: [
      {
        name: "Multiattack",
        type: "special",
        description: "The dragon makes three attacks: one with its bite and two with its claws."
      },
      {
        name: "Bite",
        type: "melee",
        toHit: 9,
        reach: 10,
        damage: "2d10+5",
        damageType: "piercing",
        description: "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 16 (2d10+5) piercing damage plus 5 (1d10) lightning damage."
      },
      {
        name: "Claw",
        type: "melee",
        toHit: 9,
        reach: 5,
        damage: "2d6+5",
        damageType: "slashing",
        description: "Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 12 (2d6+5) slashing damage."
      },
      {
        name: "Lightning Breath (Recharge 5-6)",
        type: "special",
        description: "The dragon exhales lightning in a 60-foot line that is 5 feet wide. Each creature in that line must make a DC 16 Dexterity saving throw, taking 55 (10d10) lightning damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  {
    name: "Cloud Giant",
    size: "Huge",
    type: "giant",
    alignment: "neutral good (50%) or neutral evil (50%)",
    ac: 14,
    acType: "natural armor",
    hp: 200,
    hpFormula: "16d12+96",
    speed: { walk: 40 },
    str: 27,
    dex: 10,
    con: 22,
    int: 12,
    wis: 16,
    cha: 16,
    cr: 9,
    xp: 5000,
    skills: { Insight: 7, Perception: 7 },
    senses: { passivePerception: 17 },
    languages: ["Common", "Giant"],
    traits: [
      {
        name: "Keen Smell",
        description: "The giant has advantage on Wisdom (Perception) checks that rely on smell."
      },
      {
        name: "Innate Spellcasting",
        description: "The giant's innate spellcasting ability is Charisma. It can innately cast the following spells, requiring no material components: At will: detect magic, fog cloud, light; 3/day each: feather fall, fly, misty step, telekinesis; 1/day each: control weather, gaseous form."
      }
    ],
    actions: [
      {
        name: "Multiattack",
        type: "special",
        description: "The giant makes two morningstar attacks."
      },
      {
        name: "Morningstar",
        type: "melee",
        toHit: 12,
        reach: 10,
        damage: "3d8+8",
        damageType: "piercing",
        description: "Melee Weapon Attack: +12 to hit, reach 10 ft., one target. Hit: 21 (3d8+8) piercing damage."
      },
      {
        name: "Rock",
        type: "ranged",
        toHit: 12,
        range: "60/240",
        damage: "4d10+8",
        damageType: "bludgeoning",
        description: "Ranged Weapon Attack: +12 to hit, range 60/240 ft., one target. Hit: 30 (4d10+8) bludgeoning damage."
      }
    ]
  },

  // ===========================================================================
  // CR 10
  // ===========================================================================
  {
    name: "Young Red Dragon",
    size: "Large",
    type: "dragon",
    alignment: "chaotic evil",
    ac: 18,
    acType: "natural armor",
    hp: 178,
    hpFormula: "17d10+85",
    speed: { walk: 40, climb: 40, fly: 80 },
    str: 23,
    dex: 10,
    con: 21,
    int: 14,
    wis: 11,
    cha: 19,
    cr: 10,
    xp: 5900,
    skills: { Perception: 8, Stealth: 4 },
    senses: { blindsight: 30, darkvision: 120, passivePerception: 18 },
    languages: ["Common", "Draconic"],
    traits: [
      {
        name: "Damage Immunities",
        description: "Fire."
      }
    ],
    actions: [
      {
        name: "Multiattack",
        type: "special",
        description: "The dragon makes three attacks: one with its bite and two with its claws."
      },
      {
        name: "Bite",
        type: "melee",
        toHit: 10,
        reach: 10,
        damage: "2d10+6",
        damageType: "piercing",
        description: "Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 17 (2d10+6) piercing damage plus 3 (1d6) fire damage."
      },
      {
        name: "Claw",
        type: "melee",
        toHit: 10,
        reach: 5,
        damage: "2d6+6",
        damageType: "slashing",
        description: "Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 13 (2d6+6) slashing damage."
      },
      {
        name: "Fire Breath (Recharge 5-6)",
        type: "special",
        description: "The dragon exhales fire in a 30-foot cone. Each creature in that area must make a DC 17 Dexterity saving throw, taking 56 (16d6) fire damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },

  // ===========================================================================
  // CR 13
  // ===========================================================================
  {
    name: "Beholder",
    size: "Large",
    type: "aberration",
    alignment: "lawful evil",
    ac: 18,
    acType: "natural armor",
    hp: 180,
    hpFormula: "19d10+76",
    speed: { walk: 0, fly: 20 },
    str: 10,
    dex: 14,
    con: 18,
    int: 17,
    wis: 15,
    cha: 17,
    cr: 13,
    xp: 10000,
    skills: { Perception: 12 },
    senses: { darkvision: 120, passivePerception: 22 },
    languages: ["Deep Speech", "Undercommon"],
    traits: [
      {
        name: "Antimagic Cone",
        description: "The beholder's central eye creates an area of antimagic, as in the antimagic field spell, in a 150-foot cone. At the start of each of its turns, the beholder decides which way the cone faces and whether the cone is active. The area works against the beholder's own eye rays."
      },
      {
        name: "Saving Throws",
        description: "Int +8, Wis +7, Cha +8."
      },
      {
        name: "Condition Immunities",
        description: "Prone."
      }
    ],
    actions: [
      {
        name: "Bite",
        type: "melee",
        toHit: 5,
        reach: 5,
        damage: "4d6",
        damageType: "piercing",
        description: "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 14 (4d6) piercing damage."
      },
      {
        name: "Eye Rays",
        type: "special",
        description: "The beholder shoots three of its ten eye rays at random (reroll duplicates), each targeting a creature it can see within 120 feet. Rays include: 1) Charm Ray (DC 16 Wis), 2) Paralyzing Ray (DC 16 Con), 3) Fear Ray (DC 16 Wis), 4) Slowing Ray (DC 16 Dex), 5) Enervation Ray (DC 16 Con, 36 (8d8) necrotic), 6) Telekinetic Ray (DC 16 Str), 7) Sleep Ray (DC 16 Wis), 8) Petrification Ray (DC 16 Dex), 9) Disintegration Ray (DC 16 Dex, 45 (10d8) force), 10) Death Ray (DC 16 Dex, 55 (10d10) necrotic)."
      }
    ]
  },

  // ===========================================================================
  // CR 16
  // ===========================================================================
  {
    name: "Adult Blue Dragon",
    size: "Huge",
    type: "dragon",
    alignment: "lawful evil",
    ac: 19,
    acType: "natural armor",
    hp: 225,
    hpFormula: "16d12+128",
    speed: { walk: 40, burrow: 30, fly: 80 },
    str: 25,
    dex: 10,
    con: 23,
    int: 16,
    wis: 15,
    cha: 19,
    cr: 16,
    xp: 15000,
    skills: { Perception: 12, Stealth: 5 },
    senses: { blindsight: 60, darkvision: 120, passivePerception: 22 },
    languages: ["Common", "Draconic"],
    traits: [
      {
        name: "Legendary Resistance (3/Day)",
        description: "If the dragon fails a saving throw, it can choose to succeed instead."
      },
      {
        name: "Damage Immunities",
        description: "Lightning."
      },
      {
        name: "Saving Throws",
        description: "Dex +5, Con +11, Wis +7, Cha +9."
      }
    ],
    actions: [
      {
        name: "Multiattack",
        type: "special",
        description: "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
      },
      {
        name: "Bite",
        type: "melee",
        toHit: 12,
        reach: 10,
        damage: "2d10+7",
        damageType: "piercing",
        description: "Melee Weapon Attack: +12 to hit, reach 10 ft., one target. Hit: 18 (2d10+7) piercing damage plus 5 (1d10) lightning damage."
      },
      {
        name: "Claw",
        type: "melee",
        toHit: 12,
        reach: 5,
        damage: "2d6+7",
        damageType: "slashing",
        description: "Melee Weapon Attack: +12 to hit, reach 5 ft., one target. Hit: 14 (2d6+7) slashing damage."
      },
      {
        name: "Tail",
        type: "melee",
        toHit: 12,
        reach: 15,
        damage: "2d8+7",
        damageType: "bludgeoning",
        description: "Melee Weapon Attack: +12 to hit, reach 15 ft., one target. Hit: 16 (2d8+7) bludgeoning damage."
      },
      {
        name: "Frightful Presence",
        type: "special",
        description: "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 17 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      },
      {
        name: "Lightning Breath (Recharge 5-6)",
        type: "special",
        description: "The dragon exhales lightning in a 90-foot line that is 5 feet wide. Each creature in that line must make a DC 19 Dexterity saving throw, taking 66 (12d10) lightning damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },

  // ===========================================================================
  // CR 17
  // ===========================================================================
  {
    name: "Adult Red Dragon",
    size: "Huge",
    type: "dragon",
    alignment: "chaotic evil",
    ac: 19,
    acType: "natural armor",
    hp: 256,
    hpFormula: "17d12+153",
    speed: { walk: 40, climb: 40, fly: 80 },
    str: 27,
    dex: 10,
    con: 25,
    int: 16,
    wis: 13,
    cha: 21,
    cr: 17,
    xp: 18000,
    skills: { Perception: 13, Stealth: 6 },
    senses: { blindsight: 60, darkvision: 120, passivePerception: 23 },
    languages: ["Common", "Draconic"],
    traits: [
      {
        name: "Legendary Resistance (3/Day)",
        description: "If the dragon fails a saving throw, it can choose to succeed instead."
      },
      {
        name: "Damage Immunities",
        description: "Fire."
      },
      {
        name: "Saving Throws",
        description: "Dex +6, Con +13, Wis +7, Cha +11."
      }
    ],
    actions: [
      {
        name: "Multiattack",
        type: "special",
        description: "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
      },
      {
        name: "Bite",
        type: "melee",
        toHit: 14,
        reach: 10,
        damage: "2d10+8",
        damageType: "piercing",
        description: "Melee Weapon Attack: +14 to hit, reach 10 ft., one target. Hit: 19 (2d10+8) piercing damage plus 7 (2d6) fire damage."
      },
      {
        name: "Claw",
        type: "melee",
        toHit: 14,
        reach: 5,
        damage: "2d6+8",
        damageType: "slashing",
        description: "Melee Weapon Attack: +14 to hit, reach 5 ft., one target. Hit: 15 (2d6+8) slashing damage."
      },
      {
        name: "Tail",
        type: "melee",
        toHit: 14,
        reach: 15,
        damage: "2d8+8",
        damageType: "bludgeoning",
        description: "Melee Weapon Attack: +14 to hit, reach 15 ft., one target. Hit: 17 (2d8+8) bludgeoning damage."
      },
      {
        name: "Frightful Presence",
        type: "special",
        description: "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      },
      {
        name: "Fire Breath (Recharge 5-6)",
        type: "special",
        description: "The dragon exhales fire in a 60-foot cone. Each creature in that area must make a DC 21 Dexterity saving throw, taking 63 (18d6) fire damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },

  // ===========================================================================
  // CR 21
  // ===========================================================================
  {
    name: "Lich",
    size: "Medium",
    type: "undead",
    alignment: "any evil alignment",
    ac: 17,
    acType: "natural armor",
    hp: 135,
    hpFormula: "18d8+54",
    speed: { walk: 30 },
    str: 11,
    dex: 16,
    con: 16,
    int: 20,
    wis: 14,
    cha: 16,
    cr: 21,
    xp: 33000,
    skills: { Arcana: 18, History: 12, Insight: 9, Perception: 9 },
    senses: { truesight: 120, passivePerception: 19 },
    languages: ["Common", "plus up to five other languages"],
    traits: [
      {
        name: "Legendary Resistance (3/Day)",
        description: "If the lich fails a saving throw, it can choose to succeed instead."
      },
      {
        name: "Rejuvenation",
        description: "If it has a phylactery, a destroyed lich gains a new body in 1d10 days, regaining all its hit points and becoming active again. The new body appears within 5 feet of the phylactery."
      },
      {
        name: "Spellcasting",
        description: "The lich is an 18th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 20, +12 to hit with spell attacks). The lich has the following wizard spells prepared: Cantrips: mage hand, prestidigitation, ray of frost. 1st (4 slots): detect magic, magic missile, shield, thunderwave. 2nd (3 slots): detect thoughts, invisibility, Melf's acid arrow, mirror image. 3rd (3 slots): animate dead, counterspell, dispel magic, fireball. 4th (3 slots): blight, dimension door. 5th (3 slots): cloudkill, scrying. 6th (1 slot): disintegrate, globe of invulnerability. 7th (1 slot): finger of death, plane shift. 8th (1 slot): dominate monster, power word stun. 9th (1 slot): power word kill."
      }
    ],
    actions: [
      {
        name: "Paralyzing Touch",
        type: "melee",
        toHit: 12,
        reach: 5,
        damage: "3d6",
        damageType: "cold",
        description: "Melee Spell Attack: +12 to hit, reach 5 ft., one creature. Hit: 10 (3d6) cold damage. The target must succeed on a DC 18 Constitution saving throw or be paralyzed for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ]
  },

  // ===========================================================================
  // CR 24
  // ===========================================================================
  {
    name: "Ancient Red Dragon",
    size: "Gargantuan",
    type: "dragon",
    alignment: "chaotic evil",
    ac: 22,
    acType: "natural armor",
    hp: 546,
    hpFormula: "28d20+252",
    speed: { walk: 40, climb: 40, fly: 80 },
    str: 30,
    dex: 10,
    con: 29,
    int: 18,
    wis: 15,
    cha: 23,
    cr: 24,
    xp: 62000,
    skills: { Perception: 16, Stealth: 7 },
    senses: { blindsight: 60, darkvision: 120, passivePerception: 26 },
    languages: ["Common", "Draconic"],
    traits: [
      {
        name: "Legendary Resistance (3/Day)",
        description: "If the dragon fails a saving throw, it can choose to succeed instead."
      },
      {
        name: "Damage Immunities",
        description: "Fire."
      },
      {
        name: "Saving Throws",
        description: "Dex +7, Con +16, Wis +9, Cha +13."
      }
    ],
    actions: [
      {
        name: "Multiattack",
        type: "special",
        description: "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
      },
      {
        name: "Bite",
        type: "melee",
        toHit: 17,
        reach: 15,
        damage: "2d10+10",
        damageType: "piercing",
        description: "Melee Weapon Attack: +17 to hit, reach 15 ft., one target. Hit: 21 (2d10+10) piercing damage plus 14 (4d6) fire damage."
      },
      {
        name: "Claw",
        type: "melee",
        toHit: 17,
        reach: 10,
        damage: "2d6+10",
        damageType: "slashing",
        description: "Melee Weapon Attack: +17 to hit, reach 10 ft., one target. Hit: 17 (2d6+10) slashing damage."
      },
      {
        name: "Tail",
        type: "melee",
        toHit: 17,
        reach: 20,
        damage: "2d8+10",
        damageType: "bludgeoning",
        description: "Melee Weapon Attack: +17 to hit, reach 20 ft., one target. Hit: 19 (2d8+10) bludgeoning damage."
      },
      {
        name: "Frightful Presence",
        type: "special",
        description: "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 21 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      },
      {
        name: "Fire Breath (Recharge 5-6)",
        type: "special",
        description: "The dragon exhales fire in a 90-foot cone. Each creature in that area must make a DC 24 Dexterity saving throw, taking 91 (26d6) fire damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },

  // ===========================================================================
  // CR 30
  // ===========================================================================
  {
    name: "Tarrasque",
    size: "Gargantuan",
    type: "monstrosity",
    alignment: "unaligned",
    ac: 25,
    acType: "natural armor",
    hp: 676,
    hpFormula: "33d20+330",
    speed: { walk: 40 },
    str: 30,
    dex: 11,
    con: 30,
    int: 3,
    wis: 11,
    cha: 11,
    cr: 30,
    xp: 155000,
    skills: {},
    senses: { blindsight: 120, passivePerception: 10 },
    languages: [],
    traits: [
      {
        name: "Legendary Resistance (3/Day)",
        description: "If the tarrasque fails a saving throw, it can choose to succeed instead."
      },
      {
        name: "Magic Resistance",
        description: "The tarrasque has advantage on saving throws against spells and other magical effects."
      },
      {
        name: "Reflective Carapace",
        description: "Any time the tarrasque is targeted by a magic missile spell, a line spell, or a spell that requires a ranged attack roll, roll a d6. On a 1 to 5, the tarrasque is unaffected. On a 6, the tarrasque is unaffected, and the effect is reflected back at the caster as though it originated from the tarrasque, turning the caster into the target."
      }
    ],
    actions: [
      {
        name: "Multiattack",
        type: "special",
        description: "The tarrasque can use its Frightful Presence. It then makes five attacks: one with its bite, two with its claws, one with its horns, and one with its tail. It can use its Swallow instead of its bite."
      },
      {
        name: "Bite",
        type: "melee",
        toHit: 19,
        reach: 10,
        damage: "4d12+10",
        damageType: "piercing",
        description: "Melee Weapon Attack: +19 to hit, reach 10 ft., one target. Hit: 36 (4d12+10) piercing damage. If the target is a creature, it is grappled (escape DC 20). Until this grapple ends, the target is restrained, and the tarrasque can't bite another target."
      },
      {
        name: "Claw",
        type: "melee",
        toHit: 19,
        reach: 15,
        damage: "4d8+10",
        damageType: "slashing",
        description: "Melee Weapon Attack: +19 to hit, reach 15 ft., one target. Hit: 28 (4d8+10) slashing damage."
      },
      {
        name: "Horns",
        type: "melee",
        toHit: 19,
        reach: 10,
        damage: "4d10+10",
        damageType: "piercing",
        description: "Melee Weapon Attack: +19 to hit, reach 10 ft., one target. Hit: 32 (4d10+10) piercing damage."
      },
      {
        name: "Tail",
        type: "melee",
        toHit: 19,
        reach: 20,
        damage: "4d6+10",
        damageType: "bludgeoning",
        description: "Melee Weapon Attack: +19 to hit, reach 20 ft., one target. Hit: 24 (4d6+10) bludgeoning damage. If the target is a creature, it must succeed on a DC 20 Strength saving throw or be knocked prone."
      },
      {
        name: "Frightful Presence",
        type: "special",
        description: "Each creature of the tarrasque's choice within 120 feet of it and aware of it must succeed on a DC 17 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      },
      {
        name: "Swallow",
        type: "special",
        description: "The tarrasque makes one bite attack against a Large or smaller creature it is grappling. If the attack hits, the target takes the bite's damage, the target is swallowed, and the grapple ends. While swallowed, the creature is blinded and restrained, it has total cover against attacks and other effects outside the tarrasque, and it takes 56 (16d6) acid damage at the start of each of the tarrasque's turns. If the tarrasque takes 60 damage or more on a single turn from a creature inside it, the tarrasque must succeed on a DC 20 Constitution saving throw at the end of that turn or regurgitate all swallowed creatures, which fall prone in a space within 10 feet of the tarrasque."
      }
    ]
  }
];

// =============================================================================
// Lookup Helpers
// =============================================================================

/**
 * Find a monster by exact name (case-insensitive).
 * @param {string} name
 * @returns {object|undefined}
 */
export function getMonster(name) {
  const lower = name.toLowerCase();
  return MONSTER_STAT_BLOCKS.find(m => m.name.toLowerCase() === lower);
}

/**
 * Get all monsters matching a given CR value.
 * Fractional CRs: use 0.125 for 1/8, 0.25 for 1/4, 0.5 for 1/2.
 * @param {number} cr
 * @returns {object[]}
 */
export function getMonstersByCR(cr) {
  return MONSTER_STAT_BLOCKS.filter(m => m.cr === cr);
}

/**
 * Get all monsters of a given type (e.g. "undead", "dragon", "humanoid").
 * Case-insensitive.
 * @param {string} type
 * @returns {object[]}
 */
export function getMonstersByType(type) {
  const lower = type.toLowerCase();
  return MONSTER_STAT_BLOCKS.filter(m => m.type.toLowerCase() === lower);
}

/**
 * Search monsters by a partial name, type, or trait keyword.
 * Returns all monsters where the query appears in name, type, trait names,
 * trait descriptions, or action names (case-insensitive).
 * @param {string} query
 * @returns {object[]}
 */
export function searchMonsters(query) {
  const lower = query.toLowerCase();
  return MONSTER_STAT_BLOCKS.filter(m => {
    if (m.name.toLowerCase().includes(lower)) return true;
    if (m.type.toLowerCase().includes(lower)) return true;
    if (m.alignment.toLowerCase().includes(lower)) return true;
    if (m.traits.some(t =>
      t.name.toLowerCase().includes(lower) ||
      t.description.toLowerCase().includes(lower)
    )) return true;
    if (m.actions.some(a =>
      a.name.toLowerCase().includes(lower) ||
      (a.description && a.description.toLowerCase().includes(lower))
    )) return true;
    if (m.languages.some(l => l.toLowerCase().includes(lower))) return true;
    return false;
  });
}
