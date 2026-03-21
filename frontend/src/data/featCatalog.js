// =============================================================================
// FEAT CATALOG — SRD / PHB Feats for D&D 5e
// =============================================================================

export const FEAT_CATEGORIES = ['General', 'Fighting Style', 'Epic Boon', 'Origin', 'Dragonmark', 'Giant'];

export const FEAT_CATALOG = [
  // ===========================================================================
  // GENERAL FEATS
  // ===========================================================================
  {
    id: 'alert',
    name: 'Alert',
    description:
      'You gain a +5 bonus to initiative. You can\'t be surprised while you are conscious. Other creatures don\'t gain advantage on attack rolls against you as a result of being unseen by you.',
    prerequisite: '',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'athlete',
    name: 'Athlete',
    description:
      'Increase your Strength or Dexterity by 1 (max 20). When you are prone, standing up uses only 5 feet of movement. Climbing doesn\'t cost you extra movement. You can make a running long jump or high jump after moving only 5 feet on foot rather than 10.',
    prerequisite: '',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'actor',
    name: 'Actor',
    description:
      'Increase your Charisma by 1 (max 20). You have advantage on Deception and Performance checks when trying to pass yourself off as a different person. You can mimic the speech of another person or the sounds made by other creatures if you have heard them for at least 1 minute.',
    prerequisite: '',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'charger',
    name: 'Charger',
    description:
      'When you use your action to Dash, you can use a bonus action to make one melee weapon attack or to shove a creature. If you move at least 10 feet in a straight line before taking this bonus action, you gain either a +5 bonus to the attack\'s damage roll or push the target up to 10 feet away.',
    prerequisite: '',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'crossbow-expert',
    name: 'Crossbow Expert',
    description:
      'You ignore the loading quality of crossbows with which you are proficient. Being within 5 feet of a hostile creature doesn\'t impose disadvantage on your ranged attack rolls. When you use the Attack action and attack with a one-handed weapon, you can use a bonus action to attack with a hand crossbow you are holding.',
    prerequisite: '',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'defensive-duelist',
    name: 'Defensive Duelist',
    description:
      'When you are wielding a finesse weapon with which you are proficient and another creature hits you with a melee attack, you can use your reaction to add your proficiency bonus to your AC for that attack, potentially causing it to miss.',
    prerequisite: 'Dexterity 13 or higher',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'dual-wielder',
    name: 'Dual Wielder',
    description:
      'You gain a +1 bonus to AC while you are wielding a separate melee weapon in each hand. You can use two-weapon fighting even when the one-handed melee weapons you are wielding aren\'t light. You can draw or stow two one-handed weapons when you would normally be able to draw or stow only one.',
    prerequisite: '',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'dungeon-delver',
    name: 'Dungeon Delver',
    description:
      'You have advantage on Perception and Investigation checks made to detect the presence of secret doors. You have advantage on saving throws made to avoid or resist traps. You have resistance to damage dealt by traps. Traveling at a fast pace doesn\'t impose a penalty on your passive Perception.',
    prerequisite: '',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'durable',
    name: 'Durable',
    description:
      'Increase your Constitution by 1 (max 20). When you roll a Hit Die to regain hit points, the minimum number of hit points you regain equals twice your Constitution modifier (minimum of 2).',
    prerequisite: '',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'elemental-adept',
    name: 'Elemental Adept',
    description:
      'Choose one damage type: acid, cold, fire, lightning, or thunder. Spells you cast ignore resistance to that damage type. When you roll damage for a spell that deals the chosen type, you can treat any 1 on a damage die as a 2. You can select this feat multiple times, choosing a different damage type each time.',
    prerequisite: 'The ability to cast at least one spell',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'grappler',
    name: 'Grappler',
    description:
      'You have advantage on attack rolls against a creature you are grappling. You can use your action to try to pin a creature grappled by you, restraining both you and the creature on a successful grapple check.',
    prerequisite: 'Strength 13 or higher',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'great-weapon-master',
    name: 'Great Weapon Master',
    description:
      'On your turn, when you score a critical hit with a melee weapon or reduce a creature to 0 hit points with one, you can make one melee weapon attack as a bonus action. Before you make a melee attack with a heavy weapon you are proficient with, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the attack\'s damage.',
    prerequisite: '',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'healer',
    name: 'Healer',
    description:
      'When you use a healer\'s kit to stabilize a dying creature, that creature also regains 1 hit point. As an action, you can spend one use of a healer\'s kit to tend to a creature and restore 1d6 + 4 hit points plus additional hit points equal to the creature\'s maximum number of Hit Dice. A creature can\'t regain hit points from this feat again until it finishes a short or long rest.',
    prerequisite: '',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'heavily-armored',
    name: 'Heavily Armored',
    description:
      'Increase your Strength by 1 (max 20). You gain proficiency with heavy armor.',
    prerequisite: 'Proficiency with medium armor',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'heavy-armor-master',
    name: 'Heavy Armor Master',
    description:
      'Increase your Strength by 1 (max 20). While you are wearing heavy armor, bludgeoning, piercing, and slashing damage that you take from nonmagical weapons is reduced by 3.',
    prerequisite: 'Proficiency with heavy armor',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'inspiring-leader',
    name: 'Inspiring Leader',
    description:
      'You can spend 10 minutes inspiring your companions, bolstering their resolve. Up to six friendly creatures (which can include yourself) within 30 feet who can see or hear you each gain temporary hit points equal to your level + your Charisma modifier.',
    prerequisite: 'Charisma 13 or higher',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'keen-mind',
    name: 'Keen Mind',
    description:
      'Increase your Intelligence by 1 (max 20). You always know which way is north. You always know the number of hours left before the next sunrise or sunset. You can accurately recall anything you have seen or heard within the past month.',
    prerequisite: '',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'lightly-armored',
    name: 'Lightly Armored',
    description:
      'Increase your Strength or Dexterity by 1 (max 20). You gain proficiency with light armor.',
    prerequisite: '',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'linguist',
    name: 'Linguist',
    description:
      'Increase your Intelligence by 1 (max 20). You learn three languages of your choice. You can create written ciphers that others can\'t decipher unless you teach them or they succeed on an Intelligence check (DC equals your Intelligence score + your proficiency bonus).',
    prerequisite: '',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'lucky',
    name: 'Lucky',
    description:
      'You have 3 luck points. Whenever you make an attack roll, ability check, or saving throw, you can spend one luck point to roll an additional d20 and choose which of the d20s to use. You can also spend a luck point when an attack roll is made against you, rolling a d20 and choosing which roll applies. You regain expended luck points when you finish a long rest.',
    prerequisite: '',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'mage-slayer',
    name: 'Mage Slayer',
    description:
      'When a creature within 5 feet of you casts a spell, you can use your reaction to make a melee weapon attack against that creature. When you damage a creature concentrating on a spell, it has disadvantage on the saving throw to maintain concentration. You have advantage on saving throws against spells cast by creatures within 5 feet of you.',
    prerequisite: '',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'magic-initiate',
    name: 'Magic Initiate',
    description:
      'Choose a class: bard, cleric, druid, sorcerer, warlock, or wizard. You learn two cantrips of your choice from that class\'s spell list. In addition, choose one 1st-level spell from the same list. You can cast that spell once at its lowest level without expending a spell slot, regaining the ability to do so after a long rest.',
    prerequisite: '',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'martial-adept',
    name: 'Martial Adept',
    description:
      'You learn two maneuvers of your choice from among those available to the Battle Master archetype. If a maneuver requires a saving throw, the DC equals 8 + your proficiency bonus + your Strength or Dexterity modifier. You gain one superiority die (d6), which is expended when you use a maneuver and regained on a short or long rest.',
    prerequisite: '',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'medium-armor-master',
    name: 'Medium Armor Master',
    description:
      'Wearing medium armor doesn\'t impose disadvantage on your Dexterity (Stealth) checks. When you wear medium armor, you can add 3 rather than 2 to your AC if your Dexterity is 16 or higher.',
    prerequisite: 'Proficiency with medium armor',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'mobile',
    name: 'Mobile',
    description:
      'Your speed increases by 10 feet. When you use the Dash action, difficult terrain doesn\'t cost you extra movement on that turn. When you make a melee attack against a creature, you don\'t provoke opportunity attacks from that creature for the rest of the turn, whether you hit or not.',
    prerequisite: '',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'moderately-armored',
    name: 'Moderately Armored',
    description:
      'Increase your Strength or Dexterity by 1 (max 20). You gain proficiency with medium armor and shields.',
    prerequisite: 'Proficiency with light armor',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'mounted-combatant',
    name: 'Mounted Combatant',
    description:
      'You have advantage on melee attack rolls against any unmounted creature that is smaller than your mount. You can force an attack targeted at your mount to target you instead. If your mount is subjected to an effect that allows a Dexterity saving throw for half damage, it instead takes no damage on a success and half damage on a failure.',
    prerequisite: '',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'observant',
    name: 'Observant',
    description:
      'Increase your Intelligence or Wisdom by 1 (max 20). If you can see a creature\'s mouth while it is speaking a language you understand, you can interpret what it\'s saying by reading its lips. You have a +5 bonus to your passive Perception and passive Investigation scores.',
    prerequisite: '',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'polearm-master',
    name: 'Polearm Master',
    description:
      'When you take the Attack action and attack with only a glaive, halberd, quarterstaff, or spear, you can use a bonus action to make a melee attack with the opposite end of the weapon dealing 1d4 bludgeoning damage. While wielding such a weapon, other creatures provoke an opportunity attack from you when they enter your reach.',
    prerequisite: '',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'resilient',
    name: 'Resilient',
    description:
      'Choose one ability score. Increase that score by 1 (max 20). You gain proficiency in saving throws using the chosen ability.',
    prerequisite: '',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'ritual-caster',
    name: 'Ritual Caster',
    description:
      'You acquire a ritual book holding two 1st-level spells with the ritual tag from a class spell list of your choice. You can cast these spells as rituals. You can copy additional ritual spells you find into your book if the spell is on your chosen list and of a level no higher than half your level (rounded up).',
    prerequisite: 'Intelligence or Wisdom 13 or higher',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'savage-attacker',
    name: 'Savage Attacker',
    description:
      'Once per turn when you roll damage for a melee weapon attack, you can reroll the weapon\'s damage dice and use either total.',
    prerequisite: '',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'sentinel',
    name: 'Sentinel',
    description:
      'When you hit a creature with an opportunity attack, its speed becomes 0 for the rest of the turn. Creatures provoke opportunity attacks from you even if they take the Disengage action. When a creature within 5 feet of you makes an attack against a target other than you, you can use your reaction to make a melee weapon attack against the attacking creature.',
    prerequisite: '',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'sharpshooter',
    name: 'Sharpshooter',
    description:
      'Attacking at long range doesn\'t impose disadvantage on your ranged weapon attack rolls. Your ranged weapon attacks ignore half cover and three-quarters cover. Before you make an attack with a ranged weapon you are proficient with, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the damage.',
    prerequisite: '',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'shield-master',
    name: 'Shield Master',
    description:
      'If you take the Attack action, you can use a bonus action to shove a creature within 5 feet with your shield. If you aren\'t incapacitated, you can add your shield\'s AC bonus to any Dexterity saving throw against a spell or effect targeting only you. If subjected to an effect allowing a Dexterity save for half damage, you can use your reaction to take no damage on a success.',
    prerequisite: '',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'skilled',
    name: 'Skilled',
    description:
      'You gain proficiency in any combination of three skills or tools of your choice.',
    prerequisite: '',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'skulker',
    name: 'Skulker',
    description:
      'You can try to hide when you are lightly obscured from the creature from which you are hiding. When you miss with a ranged weapon attack while hidden, making the attack doesn\'t reveal your position. Dim light doesn\'t impose disadvantage on your Perception checks relying on sight.',
    prerequisite: 'Dexterity 13 or higher',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'spell-sniper',
    name: 'Spell Sniper',
    description:
      'When you cast a spell that requires an attack roll, the spell\'s range is doubled. Your ranged spell attacks ignore half cover and three-quarters cover. You learn one cantrip that requires an attack roll from the bard, cleric, druid, sorcerer, warlock, or wizard spell list.',
    prerequisite: 'The ability to cast at least one spell',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'tavern-brawler',
    name: 'Tavern Brawler',
    description:
      'Increase your Strength or Constitution by 1 (max 20). You are proficient with improvised weapons. Your unarmed strike uses a d4 for damage. When you hit a creature with an unarmed strike or improvised weapon on your turn, you can use a bonus action to attempt to grapple the target.',
    prerequisite: '',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'tough',
    name: 'Tough',
    description:
      'Your hit point maximum increases by an amount equal to twice your level when you gain this feat. Each time you gain a level thereafter, your hit point maximum increases by an additional 2 hit points.',
    prerequisite: '',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'war-caster',
    name: 'War Caster',
    description:
      'You have advantage on Constitution saving throws to maintain concentration on a spell when you take damage. You can perform somatic components of spells even when you have weapons or a shield in one or both hands. When a hostile creature provokes an opportunity attack from you, you can cast a spell at the creature instead of making a melee attack.',
    prerequisite: 'The ability to cast at least one spell',
    category: 'General',
    source: 'PHB',
  },
  {
    id: 'weapon-master',
    name: 'Weapon Master',
    description:
      'Increase your Strength or Dexterity by 1 (max 20). You gain proficiency with four weapons of your choice. Each must be a simple or martial weapon.',
    prerequisite: '',
    category: 'General',
    source: 'PHB',
  },

  // ===========================================================================
  // FIGHTING STYLE FEATS
  // ===========================================================================
  {
    id: 'fighting-style-archery',
    name: 'Archery',
    description:
      'You gain a +2 bonus to attack rolls you make with ranged weapons.',
    prerequisite: '',
    category: 'Fighting Style',
    source: 'PHB',
  },
  {
    id: 'fighting-style-defense',
    name: 'Defense',
    description:
      'While you are wearing armor, you gain a +1 bonus to AC.',
    prerequisite: '',
    category: 'Fighting Style',
    source: 'PHB',
  },
  {
    id: 'fighting-style-dueling',
    name: 'Dueling',
    description:
      'When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.',
    prerequisite: '',
    category: 'Fighting Style',
    source: 'PHB',
  },
  {
    id: 'fighting-style-great-weapon-fighting',
    name: 'Great Weapon Fighting',
    description:
      'When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll. The weapon must have the two-handed or versatile property for you to gain this benefit.',
    prerequisite: '',
    category: 'Fighting Style',
    source: 'PHB',
  },
  {
    id: 'fighting-style-protection',
    name: 'Protection',
    description:
      'When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield.',
    prerequisite: '',
    category: 'Fighting Style',
    source: 'PHB',
  },
  {
    id: 'fighting-style-two-weapon-fighting',
    name: 'Two-Weapon Fighting',
    description:
      'When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack.',
    prerequisite: '',
    category: 'Fighting Style',
    source: 'PHB',
  },

  // ===========================================================================
  // EPIC BOON FEATS
  // ===========================================================================
  {
    id: 'boon-of-combat-prowess',
    name: 'Boon of Combat Prowess',
    description:
      'When you miss with a melee weapon attack, you can choose to hit instead. Once you use this boon, you can\'t use it again until you finish a short rest.',
    prerequisite: '20th level',
    category: 'Epic Boon',
    source: 'SRD',
  },
  {
    id: 'boon-of-dimensional-travel',
    name: 'Boon of Dimensional Travel',
    description:
      'As an action, you can cast the Misty Step spell without using a spell slot or components. Once you use this boon, you can\'t use it again until you finish a short rest.',
    prerequisite: '20th level',
    category: 'Epic Boon',
    source: 'SRD',
  },
  {
    id: 'boon-of-fate',
    name: 'Boon of Fate',
    description:
      'When another creature you can see within 60 feet of you makes an ability check, attack roll, or saving throw, you can roll a d10 and apply the result as a bonus or penalty to the roll. Once you use this boon, you can\'t use it again until you finish a short rest.',
    prerequisite: '20th level',
    category: 'Epic Boon',
    source: 'SRD',
  },
  {
    id: 'boon-of-fortitude',
    name: 'Boon of Fortitude',
    description:
      'Your hit point maximum increases by 40.',
    prerequisite: '20th level',
    category: 'Epic Boon',
    source: 'SRD',
  },
  {
    id: 'boon-of-high-magic',
    name: 'Boon of High Magic',
    description:
      'You gain one additional 9th-level spell slot.',
    prerequisite: '20th level',
    category: 'Epic Boon',
    source: 'SRD',
  },
  {
    id: 'boon-of-immortality',
    name: 'Boon of Immortality',
    description:
      'You stop aging. You are immune to any effect that would age you, and you can\'t die from old age.',
    prerequisite: '20th level',
    category: 'Epic Boon',
    source: 'SRD',
  },
  {
    id: 'boon-of-invincibility',
    name: 'Boon of Invincibility',
    description:
      'When you take damage from any source, you can reduce that damage to 0. Once you use this boon, you can\'t use it again until you finish a short rest.',
    prerequisite: '20th level',
    category: 'Epic Boon',
    source: 'SRD',
  },
  {
    id: 'boon-of-irresistible-offense',
    name: 'Boon of Irresistible Offense',
    description:
      'You can bypass the damage resistances of any creature. Additionally, when you deal damage to a creature with an attack or spell, you can deal an extra 2d6 damage of the same type. Once you use this extra damage, you can\'t do so again until you finish a short rest.',
    prerequisite: '20th level',
    category: 'Epic Boon',
    source: 'SRD',
  },
  {
    id: 'boon-of-luck',
    name: 'Boon of Luck',
    description:
      'You can add a d10 to any ability check, attack roll, or saving throw you make. Once you use this boon, you can\'t use it again until you finish a short rest.',
    prerequisite: '20th level',
    category: 'Epic Boon',
    source: 'SRD',
  },
  {
    id: 'boon-of-magic-resistance',
    name: 'Boon of Magic Resistance',
    description:
      'You have advantage on saving throws against spells and other magical effects.',
    prerequisite: '20th level',
    category: 'Epic Boon',
    source: 'SRD',
  },
  {
    id: 'boon-of-peerless-aim',
    name: 'Boon of Peerless Aim',
    description:
      'You can give yourself a +20 bonus to a ranged attack roll you make. Once you use this boon, you can\'t use it again until you finish a short rest.',
    prerequisite: '20th level',
    category: 'Epic Boon',
    source: 'SRD',
  },
  {
    id: 'boon-of-planar-travel',
    name: 'Boon of Planar Travel',
    description:
      'As an action, you can cast the Plane Shift spell (no spell slot or components required), targeting yourself only. Once you use this boon, you can\'t use it again until you finish a short rest.',
    prerequisite: '20th level',
    category: 'Epic Boon',
    source: 'SRD',
  },
  {
    id: 'boon-of-quick-casting',
    name: 'Boon of Quick Casting',
    description:
      'Choose one of your spells of 1st through 3rd level that has a casting time of 1 action. That spell\'s casting time is now 1 bonus action for you.',
    prerequisite: '20th level',
    category: 'Epic Boon',
    source: 'SRD',
  },
  {
    id: 'boon-of-recovery',
    name: 'Boon of Recovery',
    description:
      'You can use a bonus action to regain a number of hit points equal to half your hit point maximum. Once you use this boon, you can\'t use it again until you finish a long rest.',
    prerequisite: '20th level',
    category: 'Epic Boon',
    source: 'SRD',
  },
  {
    id: 'boon-of-resilience',
    name: 'Boon of Resilience',
    description:
      'You have resistance to bludgeoning, piercing, and slashing damage from nonmagical weapons.',
    prerequisite: '20th level',
    category: 'Epic Boon',
    source: 'SRD',
  },
  {
    id: 'boon-of-skill-proficiency',
    name: 'Boon of Skill Proficiency',
    description:
      'You gain proficiency in all skills.',
    prerequisite: '20th level',
    category: 'Epic Boon',
    source: 'SRD',
  },
  {
    id: 'boon-of-speed',
    name: 'Boon of Speed',
    description:
      'Your walking speed increases by 30 feet. In addition, you can use a bonus action to take the Dash or Disengage action. Once you take the bonus action, you can\'t do so again until you finish a short rest.',
    prerequisite: '20th level',
    category: 'Epic Boon',
    source: 'SRD',
  },
  {
    id: 'boon-of-spell-mastery',
    name: 'Boon of Spell Mastery',
    description:
      'Choose one 1st-level sorcerer, warlock, or wizard spell that you can cast. You can now cast that spell at its lowest level without expending a spell slot.',
    prerequisite: '20th level',
    category: 'Epic Boon',
    source: 'SRD',
  },
  {
    id: 'boon-of-spell-recall',
    name: 'Boon of Spell Recall',
    description:
      'You can cast any spell you know or have prepared without expending a spell slot. The spell must be 5th level or lower. Once you use this boon, you can\'t do so again until you finish a long rest.',
    prerequisite: '20th level',
    category: 'Epic Boon',
    source: 'SRD',
  },
  {
    id: 'boon-of-the-fire-soul',
    name: 'Boon of the Fire Soul',
    description:
      'You have immunity to fire damage. You can also cast Burning Hands (at will), Fireball (3/day), and Wall of Fire (1/day) as innate spellcasting abilities using Charisma as your spellcasting ability.',
    prerequisite: '20th level',
    category: 'Epic Boon',
    source: 'SRD',
  },
  {
    id: 'boon-of-truesight',
    name: 'Boon of Truesight',
    description:
      'You have truesight out to a range of 60 feet.',
    prerequisite: '20th level',
    category: 'Epic Boon',
    source: 'SRD',
  },
  {
    id: 'boon-of-undetectability',
    name: 'Boon of Undetectability',
    description:
      'You gain a +10 bonus to Dexterity (Stealth) checks, and you can\'t be targeted or detected by divination magic, including scrying sensors.',
    prerequisite: '20th level',
    category: 'Epic Boon',
    source: 'SRD',
  },

  // ===========================================================================
  // ORIGIN FEATS (2024 Rules)
  // ===========================================================================
  {
    id: 'origin-alert',
    name: 'Alert',
    description:
      'You gain a +5 bonus to initiative and you can\'t be surprised while you are conscious. When you roll initiative, you can swap your result with one willing ally you can see.',
    prerequisite: '',
    category: 'Origin',
    source: 'PHB',
  },
  {
    id: 'origin-crafter',
    name: 'Crafter',
    description:
      'You gain proficiency with three artisan\'s tools of your choice. When you craft an item using a tool you are proficient with, the required crafting time is reduced by 20%. Items you craft also sell for 10% more than their normal value.',
    prerequisite: '',
    category: 'Origin',
    source: 'PHB',
  },
  {
    id: 'origin-healer',
    name: 'Healer',
    description:
      'You gain proficiency in the Medicine skill. When you use a healer\'s kit, the creature regains 1d6 + your proficiency bonus hit points. You can also use an action with a healer\'s kit to revive an unconscious creature, stabilizing it and restoring 1 hit point.',
    prerequisite: '',
    category: 'Origin',
    source: 'PHB',
  },
  {
    id: 'origin-lucky',
    name: 'Lucky',
    description:
      'You have a number of luck points equal to your proficiency bonus. When you make an attack roll, ability check, or saving throw, you can expend a luck point to gain advantage on the roll. You regain all expended luck points when you finish a long rest.',
    prerequisite: '',
    category: 'Origin',
    source: 'PHB',
  },
  {
    id: 'origin-magic-initiate',
    name: 'Magic Initiate',
    description:
      'Choose a spell list: Arcane, Divine, or Primal. You learn two cantrips and one 1st-level spell from the chosen list. You can cast the 1st-level spell without a spell slot once per long rest, and you can also cast it using any spell slots you have. Your spellcasting ability for these is Intelligence, Wisdom, or Charisma (chosen when you take this feat).',
    prerequisite: '',
    category: 'Origin',
    source: 'PHB',
  },
  {
    id: 'origin-musician',
    name: 'Musician',
    description:
      'You gain proficiency with three musical instruments of your choice. After finishing a short or long rest, you can play a song to give a number of allies equal to your proficiency bonus Inspiration. These allies must hear you play to gain this benefit.',
    prerequisite: '',
    category: 'Origin',
    source: 'PHB',
  },
  {
    id: 'origin-savage-attacker',
    name: 'Savage Attacker',
    description:
      'Once per turn when you roll damage for a melee weapon attack, you can reroll the weapon\'s damage dice and use either total.',
    prerequisite: '',
    category: 'Origin',
    source: 'PHB',
  },
  {
    id: 'origin-skilled',
    name: 'Skilled',
    description:
      'You gain proficiency in any combination of three skills or tools of your choice.',
    prerequisite: '',
    category: 'Origin',
    source: 'PHB',
  },
  {
    id: 'origin-tavern-brawler',
    name: 'Tavern Brawler',
    description:
      'You are proficient with improvised weapons. Your unarmed strikes deal 1d4 + your Strength modifier bludgeoning damage. When you hit with an unarmed strike on your turn, you can deal damage and also push the target 5 feet away. You can also make an unarmed strike as a bonus action.',
    prerequisite: '',
    category: 'Origin',
    source: 'PHB',
  },
  {
    id: 'origin-tough',
    name: 'Tough',
    description:
      'Your hit point maximum increases by an amount equal to twice your level when you gain this feat. Each time you gain a level thereafter, your hit point maximum increases by an additional 2 hit points.',
    prerequisite: '',
    category: 'Origin',
    source: 'PHB',
  },

  // ===========================================================================
  // EPIC BOON FEATS (2024 PHB — Level 19+)
  // ===========================================================================
  {
    id: 'boon-of-combat-prowess-2024',
    name: 'Boon of Combat Prowess (2024)',
    description:
      'Increase your Strength or Dexterity by 1 (max 30). When you miss with a melee weapon attack, you can choose to hit instead. You can use this benefit once per turn.',
    prerequisite: 'Level 19+',
    category: 'Epic Boon',
    source: '2024 PHB',
  },
  {
    id: 'boon-of-dimensional-travel-2024',
    name: 'Boon of Dimensional Travel (2024)',
    description:
      'Increase your Intelligence, Wisdom, or Charisma by 1 (max 30). You can cast Misty Step without expending a spell slot a number of times equal to your proficiency bonus. You regain all expended uses when you finish a long rest.',
    prerequisite: 'Level 19+',
    category: 'Epic Boon',
    source: '2024 PHB',
  },
  {
    id: 'boon-of-energy-resistance-2024',
    name: 'Boon of Energy Resistance (2024)',
    description:
      'Increase your Constitution by 1 (max 30). You gain resistance to two damage types of your choice.',
    prerequisite: 'Level 19+',
    category: 'Epic Boon',
    source: '2024 PHB',
  },
  {
    id: 'boon-of-fate-2024',
    name: 'Boon of Fate (2024)',
    description:
      'Increase one ability score of your choice by 1 (max 30). When you or another creature you can see makes an attack roll, an ability check, or a saving throw, you can roll 2d4 and apply the number rolled as a bonus or penalty to the d20 roll. You can use this benefit a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
    prerequisite: 'Level 19+',
    category: 'Epic Boon',
    source: '2024 PHB',
  },
  {
    id: 'boon-of-fortitude-2024',
    name: 'Boon of Fortitude (2024)',
    description:
      'Increase your Constitution by 1 (max 30). Your hit point maximum increases by 40.',
    prerequisite: 'Level 19+',
    category: 'Epic Boon',
    source: '2024 PHB',
  },
  {
    id: 'boon-of-irresistible-offense-2024',
    name: 'Boon of Irresistible Offense (2024)',
    description:
      'Increase your Strength or Dexterity by 1 (max 30). Your attacks ignore damage resistance. When you deal damage to a creature that has damage immunity, the immunity instead functions as resistance against your attacks.',
    prerequisite: 'Level 19+',
    category: 'Epic Boon',
    source: '2024 PHB',
  },
  {
    id: 'boon-of-recovery-2024',
    name: 'Boon of Recovery (2024)',
    description:
      'Increase your Constitution by 1 (max 30). As a bonus action, you can regain a number of hit points equal to half your hit point maximum. Once you use this benefit, you can\'t use it again until you finish a long rest. Additionally, when you would be reduced to 0 hit points, you can drop to 1 hit point instead. Once you use this benefit, you can\'t use it again until you finish a long rest.',
    prerequisite: 'Level 19+',
    category: 'Epic Boon',
    source: '2024 PHB',
  },
  {
    id: 'boon-of-skill-2024',
    name: 'Boon of Skill (2024)',
    description:
      'Increase one ability score of your choice by 1 (max 30). You gain proficiency in all skills. You also gain expertise in one skill of your choice.',
    prerequisite: 'Level 19+',
    category: 'Epic Boon',
    source: '2024 PHB',
  },
  {
    id: 'boon-of-speed-2024',
    name: 'Boon of Speed (2024)',
    description:
      'Increase your Dexterity by 1 (max 30). Your speed increases by 30 feet. Opportunity attacks against you have disadvantage, and when you move, you don\'t provoke opportunity attacks.',
    prerequisite: 'Level 19+',
    category: 'Epic Boon',
    source: '2024 PHB',
  },
  {
    id: 'boon-of-spell-recall-2024',
    name: 'Boon of Spell Recall (2024)',
    description:
      'Increase your Intelligence, Wisdom, or Charisma by 1 (max 30). You can cast one spell you have prepared of level 1 through 4 without expending a spell slot. Once you use this benefit, you can\'t do so again until you finish a long rest.',
    prerequisite: 'Level 19+',
    category: 'Epic Boon',
    source: '2024 PHB',
  },
  {
    id: 'boon-of-the-night-spirit-2024',
    name: 'Boon of the Night Spirit (2024)',
    description:
      'Increase your Intelligence, Wisdom, or Charisma by 1 (max 30). Merge with Shadows: While you are in dim light or darkness, you can use an action to become invisible. You remain invisible until you take an action, a bonus action, or a reaction.',
    prerequisite: 'Level 19+',
    category: 'Epic Boon',
    source: '2024 PHB',
  },
  {
    id: 'boon-of-truesight-2024',
    name: 'Boon of Truesight (2024)',
    description:
      'Increase your Intelligence, Wisdom, or Charisma by 1 (max 30). You have truesight out to a range of 60 feet.',
    prerequisite: 'Level 19+',
    category: 'Epic Boon',
    source: '2024 PHB',
  },

  // ===========================================================================
  // DRAGONMARK FEATS (Eberron: Rising from the Last War)
  // ===========================================================================
  {
    id: 'aberrant-dragonmark',
    name: 'Aberrant Dragonmark',
    description:
      'Increase your Constitution by 1 (max 20). You learn one cantrip and one 1st-level spell from the sorcerer spell list. You can cast the 1st-level spell once at its lowest level without expending a spell slot, regaining the ability to do so after a long rest. Constitution is your spellcasting ability for these spells. When you cast the 1st-level spell, there is a risk of a dangerous flare: you must succeed on a Constitution saving throw or take 1d4 force damage per level of the spell.',
    prerequisite: 'No existing dragonmark',
    category: 'Dragonmark',
    source: 'ERLW',
  },
  {
    id: 'mark-of-detection',
    name: 'Mark of Detection (Half-Elf)',
    description:
      'Increase your Wisdom by 1 (max 20). You gain an Intuition die (1d4) that you can add to Investigation and Insight checks. You can cast detect magic and see invisibility as dragonmark spells, each once without expending a spell slot, regaining the ability after a long rest.',
    prerequisite: 'Half-Elf',
    category: 'Dragonmark',
    source: 'ERLW',
  },
  {
    id: 'mark-of-finding',
    name: 'Mark of Finding (Half-Orc/Human)',
    description:
      'Increase your Wisdom by 1 (max 20). You gain an Intuition die (1d4) that you can add to Survival and Perception checks. You can cast hunter\'s mark and locate object as dragonmark spells, each once without expending a spell slot, regaining the ability after a long rest.',
    prerequisite: 'Half-Orc or Human',
    category: 'Dragonmark',
    source: 'ERLW',
  },
  {
    id: 'mark-of-handling',
    name: 'Mark of Handling (Human)',
    description:
      'Increase your Wisdom by 1 (max 20). You gain an Intuition die (1d4) that you can add to Animal Handling and Nature checks. You can cast animal friendship and beast sense as dragonmark spells, each once without expending a spell slot, regaining the ability after a long rest.',
    prerequisite: 'Human',
    category: 'Dragonmark',
    source: 'ERLW',
  },
  {
    id: 'mark-of-healing',
    name: 'Mark of Healing (Halfling)',
    description:
      'Increase your Wisdom by 1 (max 20). You gain an Intuition die (1d4) that you can add to Medicine checks. You can cast cure wounds and lesser restoration as dragonmark spells, each once without expending a spell slot, regaining the ability after a long rest.',
    prerequisite: 'Halfling',
    category: 'Dragonmark',
    source: 'ERLW',
  },
  {
    id: 'mark-of-hospitality',
    name: 'Mark of Hospitality (Halfling)',
    description:
      'Increase your Charisma by 1 (max 20). You gain an Intuition die (1d4) that you can add to Persuasion checks. You can cast purify food and drink and unseen servant as dragonmark spells, each once without expending a spell slot, regaining the ability after a long rest.',
    prerequisite: 'Halfling',
    category: 'Dragonmark',
    source: 'ERLW',
  },
  {
    id: 'mark-of-making',
    name: 'Mark of Making (Human)',
    description:
      'Increase your Intelligence by 1 (max 20). You gain an Intuition die (1d4) that you can add to ability checks made with artisan\'s tools. You learn the mending cantrip and can cast magic weapon once without expending a spell slot, regaining the ability after a long rest.',
    prerequisite: 'Human',
    category: 'Dragonmark',
    source: 'ERLW',
  },
  {
    id: 'mark-of-passage',
    name: 'Mark of Passage (Human)',
    description:
      'Increase your Dexterity by 1 (max 20). Your base walking speed increases by 5 feet. You gain an Intuition die (1d4) that you can add to Acrobatics checks. You can cast misty step once without expending a spell slot, regaining the ability after a long rest.',
    prerequisite: 'Human',
    category: 'Dragonmark',
    source: 'ERLW',
  },
  {
    id: 'mark-of-scribing',
    name: 'Mark of Scribing (Gnome)',
    description:
      'Increase your Intelligence by 1 (max 20). You gain an Intuition die (1d4) that you can add to History and Investigation checks involving writing or written text. You can cast comprehend languages and magic mouth as dragonmark spells, each once without expending a spell slot, regaining the ability after a long rest.',
    prerequisite: 'Gnome',
    category: 'Dragonmark',
    source: 'ERLW',
  },
  {
    id: 'mark-of-sentinel',
    name: 'Mark of Sentinel (Human)',
    description:
      'Increase your Wisdom by 1 (max 20). You gain an Intuition die (1d4) that you can add to Perception and Insight checks made to detect threats. You can cast shield and shield of faith as dragonmark spells, each once without expending a spell slot, regaining the ability after a long rest.',
    prerequisite: 'Human',
    category: 'Dragonmark',
    source: 'ERLW',
  },
  {
    id: 'mark-of-shadow',
    name: 'Mark of Shadow (Elf)',
    description:
      'Increase your Charisma by 1 (max 20). You gain an Intuition die (1d4) that you can add to Stealth and Performance checks. You learn the minor illusion cantrip and can cast darkness once without expending a spell slot, regaining the ability after a long rest.',
    prerequisite: 'Elf',
    category: 'Dragonmark',
    source: 'ERLW',
  },
  {
    id: 'mark-of-storm',
    name: 'Mark of Storm (Half-Elf)',
    description:
      'Increase your Charisma by 1 (max 20). You gain an Intuition die (1d4) that you can add to Acrobatics checks and checks made with navigator\'s tools. You gain resistance to lightning damage. You learn the gust cantrip and can cast gust of wind once without expending a spell slot, regaining the ability after a long rest.',
    prerequisite: 'Half-Elf',
    category: 'Dragonmark',
    source: 'ERLW',
  },
  {
    id: 'mark-of-warding',
    name: 'Mark of Warding (Dwarf)',
    description:
      'Increase your Intelligence by 1 (max 20). You gain an Intuition die (1d4) that you can add to Investigation checks and checks made with thieves\' tools involving traps or wards. You can cast alarm and arcane lock as dragonmark spells, each once without expending a spell slot, regaining the ability after a long rest.',
    prerequisite: 'Dwarf',
    category: 'Dragonmark',
    source: 'ERLW',
  },

  // ===========================================================================
  // GIANT FEATS (Bigby Presents: Glory of the Giants)
  // ===========================================================================
  {
    id: 'strike-of-the-giants',
    name: 'Strike of the Giants',
    description:
      'Increase your Strength, Constitution, or Wisdom by 1 (max 20). Once per turn, when you hit a target with a melee weapon attack or a ranged weapon attack using a thrown weapon, you can add bonus damage and inflict a giant-themed effect. Choose one of the following strike types when you take this feat: Cloud Strike (1d4 thunder, target must succeed on a Wisdom save or be unable to see beyond 10 ft until your next turn start), Fire Strike (1d10 fire), Frost Strike (1d6 cold, target must succeed on a Constitution save or have speed reduced by 10 ft until your next turn start), Hill Strike (1d6 damage of the weapon\'s type, target must succeed on a Strength save or be knocked prone), Stone Strike (1d6 force, target must succeed on a Strength save or be pushed 10 ft), Storm Strike (1d6 lightning, target must succeed on a Constitution save or become unable to take reactions until your next turn start). You can use this benefit a number of times equal to your proficiency bonus, regaining all uses after a long rest.',
    prerequisite: 'Martial weapon proficiency or Giant Foundling background',
    category: 'Giant',
    source: 'BGG',
  },
  {
    id: 'ember-of-the-fire-giant',
    name: 'Ember of the Fire Giant',
    description:
      'Increase your Strength, Constitution, or Wisdom by 1 (max 20). When you hit a target with an attack roll, you can deal an extra 1d10 fire damage to that target. You can also cause the target to ignite, taking an additional 1d6 fire damage at the start of each of its turns until it or another creature uses an action to put out the flames. You can use this benefit a number of times equal to your proficiency bonus, regaining all uses after a long rest.',
    prerequisite: '4th level, Strike of the Giants feat',
    category: 'Giant',
    source: 'BGG',
  },
  {
    id: 'fury-of-the-frost-giant',
    name: 'Fury of the Frost Giant',
    description:
      'Increase your Strength, Constitution, or Wisdom by 1 (max 20). When you take damage from a creature within 30 feet of you, you can use your reaction to reduce the damage by 1d12 + your Constitution modifier and retaliate with a blast of cold, dealing cold damage equal to the amount the damage was reduced to the attacking creature. You can use this benefit a number of times equal to your proficiency bonus, regaining all uses after a long rest.',
    prerequisite: '4th level, Strike of the Giants feat',
    category: 'Giant',
    source: 'BGG',
  },
  {
    id: 'guile-of-the-cloud-giant',
    name: 'Guile of the Cloud Giant',
    description:
      'Increase your Strength, Constitution, or Wisdom by 1 (max 20). When a creature you can see targets you with an attack roll, you can use your reaction to teleport up to 30 feet to an unoccupied space you can see. The attack then has disadvantage if you are no longer within range. You can use this benefit a number of times equal to your proficiency bonus, regaining all uses after a long rest.',
    prerequisite: '4th level, Strike of the Giants feat',
    category: 'Giant',
    source: 'BGG',
  },
  {
    id: 'keenness-of-the-stone-giant',
    name: 'Keenness of the Stone Giant',
    description:
      'Increase your Strength, Constitution, or Wisdom by 1 (max 20). You gain darkvision out to 60 feet. If you already have darkvision, its range increases by 60 feet. As a bonus action, you can create a 15-foot cube of difficult terrain centered on a point on the ground within 60 feet of you. The terrain lasts for 1 minute. You can use the difficult terrain benefit a number of times equal to your proficiency bonus, regaining all uses after a long rest.',
    prerequisite: '4th level, Strike of the Giants feat',
    category: 'Giant',
    source: 'BGG',
  },
  {
    id: 'soul-of-the-storm-giant',
    name: 'Soul of the Storm Giant',
    description:
      'Increase your Strength, Constitution, or Wisdom by 1 (max 20). When you are hit by an attack from a creature you can see within 60 feet, you can use your reaction to deal 1d8 lightning damage to every creature within 15 feet of you. You can use this benefit a number of times equal to your proficiency bonus, regaining all uses after a long rest.',
    prerequisite: '4th level, Strike of the Giants feat',
    category: 'Giant',
    source: 'BGG',
  },
  {
    id: 'vigor-of-the-hill-giant',
    name: 'Vigor of the Hill Giant',
    description:
      'Increase your Strength, Constitution, or Wisdom by 1 (max 20). When you deal damage to a creature with an attack or spell, you gain temporary hit points equal to 1d8 + your Constitution modifier. You can use this benefit a number of times equal to your proficiency bonus, regaining all uses after a long rest.',
    prerequisite: '4th level, Strike of the Giants feat',
    category: 'Giant',
    source: 'BGG',
  },
];
