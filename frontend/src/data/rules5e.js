// D&D 5e 2014 PHB Rules Data Module

export const PROFICIENCY_BONUS = {
  1: 2, 2: 2, 3: 2, 4: 2,
  5: 3, 6: 3, 7: 3, 8: 3,
  9: 4, 10: 4, 11: 4, 12: 4,
  13: 5, 14: 5, 15: 5, 16: 5,
  17: 6, 18: 6, 19: 6, 20: 6,
};

export const POINT_BUY_COSTS = {
  8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9,
};

export const ABILITIES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

export const SKILLS = {
  'Acrobatics': 'DEX',
  'Animal Handling': 'WIS',
  'Arcana': 'INT',
  'Athletics': 'STR',
  'Deception': 'CHA',
  'History': 'INT',
  'Insight': 'WIS',
  'Intimidation': 'CHA',
  'Investigation': 'INT',
  'Medicine': 'WIS',
  'Nature': 'INT',
  'Perception': 'WIS',
  'Performance': 'CHA',
  'Persuasion': 'CHA',
  'Religion': 'INT',
  'Sleight of Hand': 'DEX',
  'Stealth': 'DEX',
  'Survival': 'WIS',
};

export const RACES = [
  {
    name: 'Human', subrace: 'Standard', speed: 30, size: 'Medium',
    abilityBonuses: { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },
    traits: [{ name: 'Extra Language', description: 'You can speak, read, and write one extra language of your choice.' }],
    languages: ['Common', 'One extra'], darkvision: 0,
  },
  {
    name: 'Human', subrace: 'Variant', speed: 30, size: 'Medium',
    abilityBonuses: {}, // +1 to two abilities of choice
    traits: [
      { name: 'Ability Score Increase', description: '+1 to two different ability scores of your choice.' },
      { name: 'Bonus Feat', description: 'You gain one feat of your choice.' },
      { name: 'Bonus Skill', description: 'You gain proficiency in one skill of your choice.' },
    ],
    languages: ['Common', 'One extra'], darkvision: 0,
  },
  {
    name: 'Dwarf', subrace: 'Hill', speed: 25, size: 'Medium',
    abilityBonuses: { CON: 2, WIS: 1 },
    traits: [
      { name: 'Darkvision', description: '60 ft. darkvision.' },
      { name: 'Dwarven Resilience', description: 'Advantage on saving throws against poison, resistance to poison damage.' },
      { name: 'Stonecunning', description: 'Add double proficiency bonus to Intelligence (History) checks related to stonework.' },
      { name: 'Dwarven Toughness', description: 'Hit point maximum increases by 1, and +1 each level.' },
    ],
    languages: ['Common', 'Dwarvish'], darkvision: 60,
  },
  {
    name: 'Dwarf', subrace: 'Mountain', speed: 25, size: 'Medium',
    abilityBonuses: { CON: 2, STR: 2 },
    traits: [
      { name: 'Darkvision', description: '60 ft. darkvision.' },
      { name: 'Dwarven Resilience', description: 'Advantage on saving throws against poison, resistance to poison damage.' },
      { name: 'Stonecunning', description: 'Add double proficiency bonus to Intelligence (History) checks related to stonework.' },
      { name: 'Dwarven Armor Training', description: 'Proficiency with light and medium armor.' },
    ],
    languages: ['Common', 'Dwarvish'], darkvision: 60,
  },
  {
    name: 'Elf', subrace: 'High', speed: 30, size: 'Medium',
    abilityBonuses: { DEX: 2, INT: 1 },
    traits: [
      { name: 'Darkvision', description: '60 ft. darkvision.' },
      { name: 'Keen Senses', description: 'Proficiency in the Perception skill.' },
      { name: 'Fey Ancestry', description: 'Advantage on saves against being charmed, immune to magical sleep.' },
      { name: 'Trance', description: 'Elves meditate for 4 hours instead of sleeping 8.' },
      { name: 'Cantrip', description: 'You know one wizard cantrip of your choice (INT is spellcasting ability).' },
      { name: 'Extra Language', description: 'You can speak, read, and write one extra language.' },
    ],
    languages: ['Common', 'Elvish', 'One extra'], darkvision: 60,
  },
  {
    name: 'Elf', subrace: 'Wood', speed: 35, size: 'Medium',
    abilityBonuses: { DEX: 2, WIS: 1 },
    traits: [
      { name: 'Darkvision', description: '60 ft. darkvision.' },
      { name: 'Keen Senses', description: 'Proficiency in the Perception skill.' },
      { name: 'Fey Ancestry', description: 'Advantage on saves against being charmed, immune to magical sleep.' },
      { name: 'Trance', description: 'Elves meditate for 4 hours instead of sleeping 8.' },
      { name: 'Fleet of Foot', description: 'Base walking speed is 35 feet.' },
      { name: 'Mask of the Wild', description: 'You can attempt to hide when lightly obscured by natural phenomena.' },
    ],
    languages: ['Common', 'Elvish'], darkvision: 60,
  },
  {
    name: 'Elf', subrace: 'Drow', speed: 30, size: 'Medium',
    abilityBonuses: { DEX: 2, CHA: 1 },
    traits: [
      { name: 'Superior Darkvision', description: '120 ft. darkvision.' },
      { name: 'Keen Senses', description: 'Proficiency in the Perception skill.' },
      { name: 'Fey Ancestry', description: 'Advantage on saves against being charmed, immune to magical sleep.' },
      { name: 'Trance', description: 'Elves meditate for 4 hours instead of sleeping 8.' },
      { name: 'Sunlight Sensitivity', description: 'Disadvantage on attack rolls and Perception checks in direct sunlight.' },
      { name: 'Drow Magic', description: 'You know the Dancing Lights cantrip. At 3rd level: Faerie Fire 1/day. At 5th level: Darkness 1/day.' },
    ],
    languages: ['Common', 'Elvish'], darkvision: 120,
  },
  {
    name: 'Halfling', subrace: 'Lightfoot', speed: 25, size: 'Small',
    abilityBonuses: { DEX: 2, CHA: 1 },
    traits: [
      { name: 'Lucky', description: 'When you roll a 1 on a d20, you can reroll and must use the new roll.' },
      { name: 'Brave', description: 'Advantage on saving throws against being frightened.' },
      { name: 'Halfling Nimbleness', description: 'You can move through the space of any creature that is a size larger than yours.' },
      { name: 'Naturally Stealthy', description: 'You can attempt to hide when obscured by a creature at least one size larger.' },
    ],
    languages: ['Common', 'Halfling'], darkvision: 0,
  },
  {
    name: 'Halfling', subrace: 'Stout', speed: 25, size: 'Small',
    abilityBonuses: { DEX: 2, CON: 1 },
    traits: [
      { name: 'Lucky', description: 'When you roll a 1 on a d20, you can reroll and must use the new roll.' },
      { name: 'Brave', description: 'Advantage on saving throws against being frightened.' },
      { name: 'Halfling Nimbleness', description: 'You can move through the space of any creature that is a size larger than yours.' },
      { name: 'Stout Resilience', description: 'Advantage on saving throws against poison, resistance to poison damage.' },
    ],
    languages: ['Common', 'Halfling'], darkvision: 0,
  },
  {
    name: 'Half-Elf', subrace: '', speed: 30, size: 'Medium',
    abilityBonuses: { CHA: 2 }, // +1 to two others of choice
    traits: [
      { name: 'Darkvision', description: '60 ft. darkvision.' },
      { name: 'Fey Ancestry', description: 'Advantage on saves against being charmed, immune to magical sleep.' },
      { name: 'Skill Versatility', description: 'You gain proficiency in two skills of your choice.' },
      { name: 'Ability Score Increase', description: '+2 CHA, and +1 to two other ability scores of your choice.' },
    ],
    languages: ['Common', 'Elvish', 'One extra'], darkvision: 60,
  },
  {
    name: 'Half-Orc', subrace: '', speed: 30, size: 'Medium',
    abilityBonuses: { STR: 2, CON: 1 },
    traits: [
      { name: 'Darkvision', description: '60 ft. darkvision.' },
      { name: 'Menacing', description: 'Proficiency in the Intimidation skill.' },
      { name: 'Relentless Endurance', description: 'When reduced to 0 HP but not killed, you drop to 1 HP instead. Once per long rest.' },
      { name: 'Savage Attacks', description: 'On a critical hit with a melee weapon, roll one additional damage die.' },
    ],
    languages: ['Common', 'Orc'], darkvision: 60,
  },
  {
    name: 'Tiefling', subrace: '', speed: 30, size: 'Medium',
    abilityBonuses: { CHA: 2, INT: 1 },
    traits: [
      { name: 'Darkvision', description: '60 ft. darkvision.' },
      { name: 'Hellish Resistance', description: 'Resistance to fire damage.' },
      { name: 'Infernal Legacy', description: 'You know the Thaumaturgy cantrip. At 3rd level: Hellish Rebuke (2nd level) 1/day. At 5th level: Darkness 1/day. CHA is spellcasting ability.' },
    ],
    languages: ['Common', 'Infernal'], darkvision: 60,
  },
  {
    name: 'Dragonborn', subrace: '', speed: 30, size: 'Medium',
    abilityBonuses: { STR: 2, CHA: 1 },
    traits: [
      { name: 'Draconic Ancestry', description: 'Choose a dragon type from: Black (Acid, 5\u00d730 ft line, DEX save), Blue (Lightning, 5\u00d730 ft line, DEX save), Brass (Fire, 5\u00d730 ft line, DEX save), Bronze (Lightning, 5\u00d730 ft line, DEX save), Copper (Acid, 5\u00d730 ft line, DEX save), Gold (Fire, 15 ft cone, DEX save), Green (Poison, 15 ft cone, CON save), Red (Fire, 15 ft cone, DEX save), Silver (Cold, 15 ft cone, CON save), White (Cold, 15 ft cone, CON save).' },
      { name: 'Breath Weapon', description: 'Exhale destructive energy. Damage and area based on draconic ancestry. DC = 8 + CON mod + proficiency. Usable once per short/long rest.' },
      { name: 'Damage Resistance', description: 'Resistance to the damage type associated with your draconic ancestry.' },
    ],
    languages: ['Common', 'Draconic'], darkvision: 0,
  },
  {
    name: 'Gnome', subrace: 'Forest', speed: 25, size: 'Small',
    abilityBonuses: { INT: 2, DEX: 1 },
    traits: [
      { name: 'Darkvision', description: '60 ft. darkvision.' },
      { name: 'Gnome Cunning', description: 'Advantage on INT, WIS, and CHA saving throws against magic.' },
      { name: 'Natural Illusionist', description: 'You know the Minor Illusion cantrip. INT is spellcasting ability.' },
      { name: 'Speak with Small Beasts', description: 'You can communicate simple ideas with Small or smaller beasts.' },
    ],
    languages: ['Common', 'Gnomish'], darkvision: 60,
  },
  {
    name: 'Gnome', subrace: 'Rock', speed: 25, size: 'Small',
    abilityBonuses: { INT: 2, CON: 1 },
    traits: [
      { name: 'Darkvision', description: '60 ft. darkvision.' },
      { name: 'Gnome Cunning', description: 'Advantage on INT, WIS, and CHA saving throws against magic.' },
      { name: "Artificer's Lore", description: 'Add double proficiency bonus to History checks related to magic items, alchemical objects, or technological devices.' },
      { name: 'Tinker', description: 'You can construct tiny clockwork devices (AC 5, 1 HP). Choose from: Clockwork Toy, Fire Starter, or Music Box.' },
    ],
    languages: ['Common', 'Gnomish'], darkvision: 60,
  },
  // --- Volo's Guide to Monsters ---
  {
    name: 'Aasimar', subrace: 'Protector', speed: 30, size: 'Medium',
    abilityBonuses: { CHA: 2, WIS: 1 },
    traits: [
      { name: 'Darkvision', description: '60 ft. darkvision.' },
      { name: 'Celestial Resistance', description: 'Resistance to necrotic damage and radiant damage.' },
      { name: 'Healing Hands', description: 'As an action, touch a creature to restore HP equal to your level. Once per long rest.' },
      { name: 'Light Bearer', description: 'You know the Light cantrip. CHA is your spellcasting ability.' },
      { name: 'Radiant Soul', description: 'Starting at 3rd level, use an action to unleash divine energy. For 1 minute, sprout spectral wings (fly speed 30 ft) and deal extra radiant damage equal to your level once per turn. Once per long rest.' },
    ],
    languages: ['Common', 'Celestial'], darkvision: 60,
  },
  {
    name: 'Aasimar', subrace: 'Scourge', speed: 30, size: 'Medium',
    abilityBonuses: { CHA: 2, CON: 1 },
    traits: [
      { name: 'Darkvision', description: '60 ft. darkvision.' },
      { name: 'Celestial Resistance', description: 'Resistance to necrotic damage and radiant damage.' },
      { name: 'Healing Hands', description: 'As an action, touch a creature to restore HP equal to your level. Once per long rest.' },
      { name: 'Light Bearer', description: 'You know the Light cantrip. CHA is your spellcasting ability.' },
      { name: 'Radiant Consumption', description: 'Starting at 3rd level, use an action to unleash divine energy. For 1 minute, shed bright light 10 ft and dim light 10 ft beyond that. At the end of each turn, you and creatures within 10 ft take radiant damage equal to half your level (rounded up). Once per turn, deal extra radiant damage equal to your level. Once per long rest.' },
    ],
    languages: ['Common', 'Celestial'], darkvision: 60,
  },
  {
    name: 'Aasimar', subrace: 'Fallen', speed: 30, size: 'Medium',
    abilityBonuses: { CHA: 2, STR: 1 },
    traits: [
      { name: 'Darkvision', description: '60 ft. darkvision.' },
      { name: 'Celestial Resistance', description: 'Resistance to necrotic damage and radiant damage.' },
      { name: 'Healing Hands', description: 'As an action, touch a creature to restore HP equal to your level. Once per long rest.' },
      { name: 'Light Bearer', description: 'You know the Light cantrip. CHA is your spellcasting ability.' },
      { name: 'Necrotic Shroud', description: 'Starting at 3rd level, use an action to unleash divine energy. For 1 minute, eyes become pools of darkness and two skeletal ghostly flightless wings sprout. Creatures within 10 ft must succeed on a CHA save (DC 8 + proficiency + CHA mod) or be frightened until end of your next turn. Once per turn, deal extra necrotic damage equal to your level. Once per long rest.' },
    ],
    languages: ['Common', 'Celestial'], darkvision: 60,
  },
  {
    name: 'Goliath', subrace: '', speed: 30, size: 'Medium',
    abilityBonuses: { STR: 2, CON: 1 },
    traits: [
      { name: "Stone's Endurance", description: 'When you take damage, use your reaction to roll a d12 + CON modifier and reduce the damage by that total. Once per short or long rest.' },
      { name: 'Powerful Build', description: 'You count as one size larger when determining carrying capacity and the weight you can push, drag, or lift.' },
      { name: 'Mountain Born', description: 'You are acclimated to high altitude and naturally adapted to cold climates (no checks needed).' },
      { name: 'Natural Athlete', description: 'Proficiency in the Athletics skill.' },
    ],
    languages: ['Common', 'Giant'], darkvision: 0,
  },
  {
    name: 'Firbolg', subrace: '', speed: 30, size: 'Medium',
    abilityBonuses: { WIS: 2, STR: 1 },
    traits: [
      { name: 'Firbolg Magic', description: 'You can cast Detect Magic and Disguise Self with this trait, using WIS as your spellcasting ability. When you use Disguise Self, you can seem up to 3 feet shorter. Once each per short or long rest.' },
      { name: 'Hidden Step', description: 'As a bonus action, you become invisible until the start of your next turn or until you attack, make a damage roll, or force someone to make a saving throw. Once per short or long rest.' },
      { name: 'Powerful Build', description: 'You count as one size larger when determining carrying capacity and the weight you can push, drag, or lift.' },
      { name: 'Speech of Beast and Leaf', description: 'You can communicate simple ideas to beasts and plants. You have advantage on CHA checks to influence them.' },
    ],
    languages: ['Common', 'Elvish', 'Giant'], darkvision: 0,
  },
  {
    name: 'Genasi', subrace: 'Air', speed: 30, size: 'Medium',
    abilityBonuses: { CON: 2, DEX: 1 },
    traits: [
      { name: 'Unending Breath', description: 'You can hold your breath indefinitely while you are not incapacitated.' },
      { name: 'Mingle with the Wind', description: 'You can cast Levitate once with this trait, requiring no material components. CON is your spellcasting ability. Once per long rest.' },
    ],
    languages: ['Common', 'Primordial'], darkvision: 0,
  },
  {
    name: 'Genasi', subrace: 'Earth', speed: 30, size: 'Medium',
    abilityBonuses: { CON: 2, STR: 1 },
    traits: [
      { name: 'Earth Walk', description: 'You can move across difficult terrain made of earth or stone without expending extra movement.' },
      { name: 'Merge with Stone', description: 'You can cast Pass without Trace once with this trait, requiring no material components. CON is your spellcasting ability. Once per long rest.' },
    ],
    languages: ['Common', 'Primordial'], darkvision: 0,
  },
  {
    name: 'Genasi', subrace: 'Fire', speed: 30, size: 'Medium',
    abilityBonuses: { CON: 2, INT: 1 },
    traits: [
      { name: 'Darkvision', description: '60 ft. darkvision.' },
      { name: 'Fire Resistance', description: 'Resistance to fire damage.' },
      { name: 'Reach to the Blaze', description: 'You know the Produce Flame cantrip. Once you reach 3rd level, you can cast Burning Hands once as a 1st-level spell. CON is your spellcasting ability. Once per long rest.' },
    ],
    languages: ['Common', 'Primordial'], darkvision: 60,
  },
  {
    name: 'Genasi', subrace: 'Water', speed: 30, size: 'Medium',
    abilityBonuses: { CON: 2, WIS: 1 },
    traits: [
      { name: 'Acid Resistance', description: 'Resistance to acid damage.' },
      { name: 'Amphibious', description: 'You can breathe air and water.' },
      { name: 'Swim', description: 'You have a swimming speed of 30 feet.' },
      { name: 'Call to the Wave', description: 'You know the Shape Water cantrip. Once you reach 3rd level, you can cast Create or Destroy Water once as a 2nd-level spell. CON is your spellcasting ability. Once per long rest.' },
    ],
    languages: ['Common', 'Primordial'], darkvision: 0,
  },
  {
    name: 'Tabaxi', subrace: '', speed: 30, size: 'Medium',
    abilityBonuses: { DEX: 2, CHA: 1 },
    traits: [
      { name: 'Darkvision', description: '60 ft. darkvision.' },
      { name: 'Feline Agility', description: 'When you move on your turn in combat, you can double your speed until the end of the turn. Once you use this trait, you cannot use it again until you move 0 feet on one of your turns.' },
      { name: "Cat's Claws", description: 'You have a climbing speed of 20 feet. Your claws are natural weapons dealing 1d4 + STR modifier slashing damage.' },
      { name: "Cat's Talent", description: 'Proficiency in the Perception and Stealth skills.' },
    ],
    languages: ['Common', 'One extra'], darkvision: 60,
  },
  {
    name: 'Kenku', subrace: '', speed: 30, size: 'Medium',
    abilityBonuses: { DEX: 2, WIS: 1 },
    traits: [
      { name: 'Expert Forgery', description: 'You can duplicate other creatures\' handwriting and craftwork. Advantage on checks to produce forgeries or duplicates of existing objects.' },
      { name: 'Kenku Training', description: 'Proficiency in two of the following skills: Acrobatics, Deception, Stealth, or Sleight of Hand.' },
      { name: 'Mimicry', description: 'You can mimic sounds you have heard, including voices. A creature that hears the sound can tell it is an imitation with a successful WIS (Insight) check opposed by your CHA (Deception) check.' },
    ],
    languages: ['Common', 'Auran'], darkvision: 0,
  },
  {
    name: 'Lizardfolk', subrace: '', speed: 30, size: 'Medium',
    abilityBonuses: { CON: 2, WIS: 1 },
    traits: [
      { name: 'Natural Armor', description: 'You have tough, scaly skin. When not wearing armor, your AC is 13 + DEX modifier. You can use a shield and still gain this benefit.' },
      { name: 'Hungry Jaws', description: 'As a bonus action, make a special bite attack (1d6 + STR modifier piercing). If it hits, you gain temporary HP equal to your CON modifier (minimum 1). Once per short or long rest.' },
      { name: 'Cunning Artisan', description: 'During a short rest, you can harvest bone and hide from a slain beast, construct, dragon, monstrosity, or plant to create a shield, club, javelin, or 1d4 darts or blowgun needles.' },
      { name: 'Hold Breath', description: 'You can hold your breath for up to 15 minutes at a time.' },
      { name: 'Swim', description: 'You have a swimming speed of 30 feet.' },
    ],
    languages: ['Common', 'Draconic'], darkvision: 0,
  },
  {
    name: 'Triton', subrace: '', speed: 30, size: 'Medium',
    abilityBonuses: { STR: 1, CON: 1, CHA: 1 },
    traits: [
      { name: 'Darkvision', description: '60 ft. darkvision.' },
      { name: 'Amphibious', description: 'You can breathe air and water.' },
      { name: 'Swim', description: 'You have a swimming speed of 30 feet.' },
      { name: 'Control Air and Water', description: 'You can cast Fog Cloud at 1st level. At 3rd level: Gust of Wind. At 5th level: Wall of Water. Once each per long rest. CHA is your spellcasting ability.' },
      { name: 'Emissary of the Sea', description: 'You can communicate simple ideas with beasts that can breathe water.' },
      { name: 'Guardians of the Depths', description: 'You are resistant to cold damage and ignore any drawbacks caused by a deep, underwater environment.' },
    ],
    languages: ['Common', 'Primordial'], darkvision: 60,
  },
  {
    name: 'Bugbear', subrace: '', speed: 30, size: 'Medium',
    abilityBonuses: { STR: 2, DEX: 1 },
    traits: [
      { name: 'Darkvision', description: '60 ft. darkvision.' },
      { name: 'Long-Limbed', description: 'When you make a melee attack on your turn, your reach for it is 5 feet greater than normal.' },
      { name: 'Powerful Build', description: 'You count as one size larger when determining carrying capacity and the weight you can push, drag, or lift.' },
      { name: 'Sneaky', description: 'Proficiency in the Stealth skill.' },
      { name: 'Surprise Attack', description: 'If you surprise a creature and hit it with an attack on your first turn in combat, the attack deals an extra 2d6 damage.' },
    ],
    languages: ['Common', 'Goblin'], darkvision: 60,
  },
  {
    name: 'Goblin', subrace: '', speed: 30, size: 'Small',
    abilityBonuses: { DEX: 2, CON: 1 },
    traits: [
      { name: 'Darkvision', description: '60 ft. darkvision.' },
      { name: 'Fury of the Small', description: 'When you damage a creature of a size larger than yours with an attack or spell, you can deal extra damage equal to your level. Once per short or long rest.' },
      { name: 'Nimble Escape', description: 'You can take the Disengage or Hide action as a bonus action on each of your turns.' },
    ],
    languages: ['Common', 'Goblin'], darkvision: 60,
  },
  {
    name: 'Hobgoblin', subrace: '', speed: 30, size: 'Medium',
    abilityBonuses: { CON: 2, INT: 1 },
    traits: [
      { name: 'Darkvision', description: '60 ft. darkvision.' },
      { name: 'Martial Training', description: 'Proficiency with two martial weapons of your choice and light armor.' },
      { name: 'Saving Face', description: 'When you miss an attack roll or fail an ability check or saving throw, you can gain a bonus equal to the number of allies you can see within 30 feet (max +5). Once per short or long rest.' },
    ],
    languages: ['Common', 'Goblin'], darkvision: 60,
  },
  {
    name: 'Kobold', subrace: '', speed: 30, size: 'Small',
    abilityBonuses: { DEX: 2, STR: -2 },
    traits: [
      { name: 'Darkvision', description: '60 ft. darkvision.' },
      { name: 'Grovel, Cower, and Beg', description: 'As an action, you cower pathetically. Until the end of your next turn, your allies gain advantage on attack rolls against enemies within 10 feet of you that can see you. Once per short or long rest.' },
      { name: 'Pack Tactics', description: 'You have advantage on attack rolls against a creature if at least one of your allies is within 5 feet of the creature and the ally is not incapacitated.' },
      { name: 'Sunlight Sensitivity', description: 'Disadvantage on attack rolls and Perception checks that rely on sight when you, the target of your attack, or what you are trying to perceive is in direct sunlight.' },
    ],
    languages: ['Common', 'Draconic'], darkvision: 60,
  },
  {
    name: 'Orc', subrace: '', speed: 30, size: 'Medium',
    abilityBonuses: { STR: 2, CON: 1, INT: -2 },
    traits: [
      { name: 'Darkvision', description: '60 ft. darkvision.' },
      { name: 'Aggressive', description: 'As a bonus action, you can move up to your speed toward an enemy you can see or hear. You must end this move closer to the enemy than you started.' },
      { name: 'Menacing', description: 'Proficiency in the Intimidation skill.' },
      { name: 'Powerful Build', description: 'You count as one size larger when determining carrying capacity and the weight you can push, drag, or lift.' },
    ],
    languages: ['Common', 'Orc'], darkvision: 60,
  },
  {
    name: 'Yuan-ti Pureblood', subrace: '', speed: 30, size: 'Medium',
    abilityBonuses: { CHA: 2, INT: 1 },
    traits: [
      { name: 'Darkvision', description: '60 ft. darkvision.' },
      { name: 'Innate Spellcasting', description: 'You know the Poison Spray cantrip. At 3rd level: Animal Friendship (snakes only) at will. At 5th level: Suggestion 1/day. CHA is your spellcasting ability.' },
      { name: 'Magic Resistance', description: 'Advantage on saving throws against spells and other magical effects.' },
      { name: 'Poison Immunity', description: 'You are immune to poison damage and the poisoned condition.' },
    ],
    languages: ['Common', 'Abyssal', 'Draconic'], darkvision: 60,
  },
  // --- Tortle Package ---
  {
    name: 'Tortle', subrace: '', speed: 30, size: 'Medium',
    abilityBonuses: { STR: 2, WIS: 1 },
    traits: [
      { name: 'Natural Armor', description: 'Your shell provides a base AC of 17 (your DEX modifier does not affect this number). You cannot wear armor, but can use a shield.' },
      { name: 'Hold Breath', description: 'You can hold your breath for up to 1 hour at a time.' },
      { name: 'Shell Defense', description: 'You can withdraw into your shell as an action. Until you emerge, you gain +4 AC, advantage on STR and CON saves, and disadvantage on DEX saves. You are prone, speed is 0, cannot take reactions, and can only use a bonus action to emerge.' },
      { name: 'Survival Instinct', description: 'Proficiency in the Survival skill.' },
      { name: 'Claws', description: 'Your claws are natural weapons dealing 1d4 + STR modifier slashing damage.' },
    ],
    languages: ['Common', 'Aquan'], darkvision: 0,
  },
  // --- Eberron: Rising from the Last War ---
  {
    name: 'Changeling', subrace: '', speed: 30, size: 'Medium',
    abilityBonuses: { CHA: 2 }, // +1 to one other ability of choice
    traits: [
      { name: 'Ability Score Increase', description: '+2 CHA, and +1 to one other ability score of your choice.' },
      { name: 'Changeling Instincts', description: 'Proficiency in two of the following skills: Deception, Insight, Intimidation, or Persuasion.' },
      { name: 'Shapechanger', description: 'As an action, you can change your appearance and voice. You determine the specifics of the changes. You can make yourself appear as a member of another race, though your statistics do not change. You revert to your natural appearance if you die.' },
    ],
    languages: ['Common', 'Two extra'], darkvision: 0,
  },
  {
    name: 'Warforged', subrace: '', speed: 30, size: 'Medium',
    abilityBonuses: { CON: 2 }, // +1 to one other ability of choice
    traits: [
      { name: 'Ability Score Increase', description: '+2 CON, and +1 to one other ability score of your choice.' },
      { name: 'Constructed Resilience', description: 'Advantage on saving throws against being poisoned, resistance to poison damage. You do not need to eat, drink, or breathe. You are immune to disease. You do not need to sleep and cannot be put to sleep by magic.' },
      { name: "Sentry's Rest", description: 'When you take a long rest, you must spend at least 6 hours in an inactive, motionless state rather than sleeping. You appear inert but are not unconscious and can see and hear as normal.' },
      { name: 'Integrated Protection', description: 'Your body has built-in defensive layers. You gain a +1 bonus to Armor Class. You can don or doff armor over the course of 1 hour, during which you must remain in contact with the armor. You can rest while donning or doffing armor.' },
      { name: 'Specialized Design', description: 'You gain one skill proficiency and one tool proficiency of your choice.' },
    ],
    languages: ['Common', 'One extra'], darkvision: 0,
  },
  {
    name: 'Kalashtar', subrace: '', speed: 30, size: 'Medium',
    abilityBonuses: { WIS: 2, CHA: 1 },
    traits: [
      { name: 'Dual Mind', description: 'Advantage on all WIS saving throws.' },
      { name: 'Mental Discipline', description: 'Resistance to psychic damage.' },
      { name: 'Mind Link', description: 'You can speak telepathically to any creature you can see within 10 times your level in feet. The creature must be able to understand at least one language. You can use this while one of you is asleep.' },
      { name: 'Severed from Dreams', description: 'You cannot be affected by the Dream spell or similar magic that affects dreams. You still need to sleep but do not dream.' },
    ],
    languages: ['Common', 'Quori', 'One extra'], darkvision: 0,
  },
  {
    name: 'Shifter', subrace: 'Beasthide', speed: 30, size: 'Medium',
    abilityBonuses: { CON: 2, STR: 1 },
    traits: [
      { name: 'Darkvision', description: '60 ft. darkvision.' },
      { name: 'Shifting', description: 'As a bonus action, you can assume a more bestial appearance for 1 minute. You gain temporary HP equal to your level + CON modifier. While shifted, you gain +1 to AC. Once per short or long rest.' },
    ],
    languages: ['Common'], darkvision: 60,
  },
  {
    name: 'Shifter', subrace: 'Longtooth', speed: 30, size: 'Medium',
    abilityBonuses: { STR: 2, DEX: 1 },
    traits: [
      { name: 'Darkvision', description: '60 ft. darkvision.' },
      { name: 'Shifting', description: 'As a bonus action, you can assume a more bestial appearance for 1 minute. You gain temporary HP equal to your level + CON modifier. While shifted, you can use your elongated fangs to make an unarmed strike as a bonus action (1d6 + STR modifier piercing). Once per short or long rest.' },
    ],
    languages: ['Common'], darkvision: 60,
  },
  {
    name: 'Shifter', subrace: 'Swiftstride', speed: 30, size: 'Medium',
    abilityBonuses: { DEX: 2, CHA: 1 },
    traits: [
      { name: 'Darkvision', description: '60 ft. darkvision.' },
      { name: 'Shifting', description: 'As a bonus action, you can assume a more bestial appearance for 1 minute. You gain temporary HP equal to your level + CON modifier. While shifted, your walking speed increases by 10 feet, and you can move up to 10 feet as a reaction when an enemy ends its turn within 5 feet of you without provoking opportunity attacks. Once per short or long rest.' },
    ],
    languages: ['Common'], darkvision: 60,
  },
  {
    name: 'Shifter', subrace: 'Wildhunt', speed: 30, size: 'Medium',
    abilityBonuses: { WIS: 2, DEX: 1 },
    traits: [
      { name: 'Darkvision', description: '60 ft. darkvision.' },
      { name: 'Shifting', description: 'As a bonus action, you can assume a more bestial appearance for 1 minute. You gain temporary HP equal to your level + CON modifier. While shifted, no creature within 30 feet of you can make an attack roll with advantage against you unless you are incapacitated. Once per short or long rest.' },
    ],
    languages: ['Common'], darkvision: 60,
  },
  // --- Mythic Odysseys of Theros ---
  {
    name: 'Satyr', subrace: '', speed: 35, size: 'Medium',
    abilityBonuses: { CHA: 2, DEX: 1 },
    traits: [
      { name: 'Fey', description: 'Your creature type is fey rather than humanoid.' },
      { name: 'Magic Resistance', description: 'Advantage on saving throws against spells and other magical effects.' },
      { name: 'Mirthful Leaps', description: 'Whenever you make a long or high jump, you can roll a d8 and add the number rolled to the number of feet you cover, even when making a standing jump.' },
      { name: 'Ram', description: 'You can use your head and horns to make unarmed strikes. On a hit, you deal 1d4 + STR modifier bludgeoning damage.' },
      { name: 'Reveler', description: 'Proficiency in the Performance and Persuasion skills and one musical instrument of your choice.' },
    ],
    languages: ['Common', 'Sylvan'], darkvision: 0,
  },
  // --- The Wild Beyond the Witchlight ---
  {
    name: 'Fairy', subrace: '', speed: 30, size: 'Small',
    abilityBonuses: { DEX: 1 }, // +1 to one other ability of choice
    traits: [
      { name: 'Ability Score Increase', description: '+1 DEX, and +1 to one other ability score of your choice.' },
      { name: 'Fey', description: 'Your creature type is fey rather than humanoid.' },
      { name: 'Flight', description: 'You have a flying speed equal to your walking speed. You cannot use this flying speed while wearing medium or heavy armor.' },
      { name: 'Fairy Magic', description: 'You know the Druidcraft cantrip. At 3rd level: Faerie Fire 1/day. At 5th level: Enlarge/Reduce 1/day. You can cast these without material components. Your spellcasting ability is your choice of INT, WIS, or CHA.' },
    ],
    languages: ['Common', 'Sylvan'], darkvision: 0,
  },
  {
    name: 'Harengon', subrace: '', speed: 30, size: 'Medium',
    abilityBonuses: {}, // +2 to one ability, +1 to another of choice
    traits: [
      { name: 'Ability Score Increase', description: '+2 to one ability score and +1 to a different ability score of your choice, or +1 to three different ability scores.' },
      { name: 'Hare-Trigger', description: 'You can add your proficiency bonus to your initiative rolls.' },
      { name: 'Leporine Senses', description: 'Proficiency in the Perception skill.' },
      { name: 'Lucky Footwork', description: 'When you fail a DEX saving throw, you can use your reaction to roll a d4 and add it to the save, potentially turning the failure into a success. You cannot use this trait if you are prone or your speed is 0.' },
      { name: 'Rabbit Hop', description: 'As a bonus action, you can jump a number of feet equal to 5 times your proficiency bonus without provoking opportunity attacks. You can use this trait a number of times equal to your proficiency bonus, regaining all uses on a long rest.' },
    ],
    languages: ['Common', 'One extra'], darkvision: 0,
  },
];

export const CLASSES = [
  {
    name: 'Barbarian', hitDie: 12, primaryAbility: 'STR', subclassLevel: 3,
    savingThrows: ['STR', 'CON'],
    armorProficiencies: ['Light armor', 'Medium armor', 'Shields'],
    weaponProficiencies: ['Simple weapons', 'Martial weapons'],
    skillChoices: { count: 2, from: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'] },
    startingEquipment: [
      { name: 'Greataxe', item_type: 'weapon', weight: 7, value_gp: 30, quantity: 1 },
      { name: 'Handaxe', item_type: 'weapon', weight: 2, value_gp: 5, quantity: 2 },
      { name: 'Javelin', item_type: 'weapon', weight: 2, value_gp: 0.5, quantity: 4 },
      { name: "Explorer's Pack", item_type: 'gear', weight: 59, value_gp: 10, quantity: 1 },
    ],
    startingGold: 10,
    subclasses: ['Path of the Berserker', 'Path of the Totem Warrior', 'Path of the Ancestral Guardian', 'Path of the Storm Herald', 'Path of the Zealot', 'Path of the Beast', 'Path of Wild Magic', 'Path of the Battlerager'],
    spellcasting: null,
    features: [
      { name: 'Rage', level: 1, description: 'Enter a fearsome rage as a bonus action, gaining advantage on STR checks and saving throws, bonus rage damage on melee attacks, and resistance to bludgeoning, piercing, and slashing damage.' },
      { name: 'Unarmored Defense', level: 1, description: 'While not wearing armor, your AC equals 10 + DEX modifier + CON modifier. You can use a shield and still gain this benefit.' },
      { name: 'Reckless Attack', level: 2, description: 'When you make your first attack on your turn, you can choose to attack recklessly, gaining advantage on melee STR attack rolls but granting advantage on attack rolls against you until your next turn.' },
      { name: 'Danger Sense', level: 2, description: 'You have advantage on DEX saving throws against effects you can see, such as traps and spells, as long as you are not blinded, deafened, or incapacitated.' },
      { name: 'Extra Attack', level: 5, description: 'You can attack twice, instead of once, whenever you take the Attack action on your turn.' },
      { name: 'Fast Movement', level: 5, description: 'Your speed increases by 10 feet while you are not wearing heavy armor.' },
      { name: 'Feral Instinct', level: 7, description: 'You have advantage on initiative rolls. Additionally, if you are surprised at the beginning of combat and are not incapacitated, you can act normally on your first turn if you enter your rage.' },
      { name: 'Brutal Critical', level: 9, description: 'You can roll one additional weapon damage die when determining the extra damage for a critical hit with a melee attack. This increases to 2 dice at 13th level and 3 dice at 17th level.' },
      { name: 'Relentless Rage', level: 11, description: 'While raging, if you drop to 0 hit points and do not die outright, you can make a DC 10 CON saving throw to drop to 1 hit point instead. The DC increases by 5 each time until you finish a rest.' },
      { name: 'Persistent Rage', level: 15, description: 'Your rage ends early only if you fall unconscious or choose to end it. You no longer need to attack or take damage each round to maintain it.' },
      { name: 'Indomitable Might', level: 18, description: 'If your total for a STR check is less than your STR score, you can use your STR score in place of the total.' },
      { name: 'Primal Champion', level: 20, description: 'Your STR and CON scores each increase by 4, and their maximum is now 24.' },
    ],
  },
  {
    name: 'Bard', hitDie: 8, primaryAbility: 'CHA', subclassLevel: 3,
    savingThrows: ['DEX', 'CHA'],
    armorProficiencies: ['Light armor'],
    weaponProficiencies: ['Simple weapons', 'Hand crossbows', 'Longswords', 'Rapiers', 'Shortswords'],
    skillChoices: { count: 3, from: Object.keys(SKILLS) },
    startingEquipment: [
      { name: 'Rapier', item_type: 'weapon', weight: 2, value_gp: 25, quantity: 1 },
      { name: 'Leather Armor', item_type: 'armor', weight: 10, value_gp: 10, quantity: 1 },
      { name: 'Dagger', item_type: 'weapon', weight: 1, value_gp: 2, quantity: 1 },
      { name: "Entertainer's Pack", item_type: 'gear', weight: 38, value_gp: 40, quantity: 1 },
      { name: 'Lute', item_type: 'gear', weight: 2, value_gp: 35, quantity: 1 },
    ],
    startingGold: 10,
    subclasses: ['College of Lore', 'College of Valor', 'College of Glamour', 'College of Swords', 'College of Whispers', 'College of Creation', 'College of Eloquence'],
    spellcasting: { ability: 'CHA', type: 'full' },
    features: [
      { name: 'Spellcasting', level: 1, description: 'You can cast bard spells using CHA as your spellcasting ability. You learn spells from the bard spell list and can use a musical instrument as a spellcasting focus.' },
      { name: 'Bardic Inspiration', level: 1, description: 'As a bonus action, grant one creature within 60 feet a Bardic Inspiration die they can add to one ability check, attack roll, or saving throw within 10 minutes. Uses equal to CHA modifier per long rest.' },
      { name: 'Jack of All Trades', level: 2, description: 'You can add half your proficiency bonus, rounded down, to any ability check you make that does not already include your proficiency bonus.' },
      { name: 'Song of Rest', level: 2, description: 'During a short rest, you or any friendly creatures who regain hit points by spending Hit Dice regain an extra 1d6 hit points. The die increases at higher levels.' },
      { name: 'Expertise', level: 3, description: 'Choose two skill proficiencies. Your proficiency bonus is doubled for any ability check you make with those skills. You choose two more at 10th level.' },
      { name: 'Font of Inspiration', level: 5, description: 'You regain all expended uses of Bardic Inspiration when you finish a short or long rest, instead of only on a long rest.' },
      { name: 'Countercharm', level: 6, description: 'As an action, you can start a performance that lasts until the end of your next turn, granting you and friendly creatures within 30 feet advantage on saving throws against being frightened or charmed.' },
      { name: 'Magical Secrets', level: 10, description: 'Choose two spells from any class spell list. These count as bard spells for you and are included in your number of spells known. You gain two more at 14th and 18th level.' },
      { name: 'Superior Inspiration', level: 20, description: 'When you roll initiative and have no uses of Bardic Inspiration remaining, you regain one use.' },
    ],
  },
  {
    name: 'Cleric', hitDie: 8, primaryAbility: 'WIS', subclassLevel: 1,
    savingThrows: ['WIS', 'CHA'],
    armorProficiencies: ['Light armor', 'Medium armor', 'Shields'],
    weaponProficiencies: ['Simple weapons'],
    skillChoices: { count: 2, from: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'] },
    startingEquipment: [
      { name: 'Mace', item_type: 'weapon', weight: 4, value_gp: 5, quantity: 1 },
      { name: 'Scale Mail', item_type: 'armor', weight: 45, value_gp: 50, quantity: 1 },
      { name: 'Shield', item_type: 'armor', weight: 6, value_gp: 10, quantity: 1 },
      { name: 'Light Crossbow', item_type: 'weapon', weight: 5, value_gp: 25, quantity: 1 },
      { name: 'Bolt', item_type: 'ammunition', weight: 0.075, value_gp: 0.05, quantity: 20 },
      { name: "Priest's Pack", item_type: 'gear', weight: 24, value_gp: 19, quantity: 1 },
      { name: 'Holy Symbol', item_type: 'gear', weight: 0, value_gp: 5, quantity: 1 },
    ],
    startingGold: 10,
    subclasses: ['Knowledge', 'Life', 'Light', 'Nature', 'Tempest', 'Trickery', 'War', 'Arcana', 'Forge', 'Grave', 'Order', 'Peace', 'Twilight'],
    spellcasting: { ability: 'WIS', type: 'full' },
    features: [
      { name: 'Spellcasting', level: 1, description: 'You can cast cleric spells using WIS as your spellcasting ability. You prepare spells from the entire cleric spell list each day and can use a holy symbol as a spellcasting focus.' },
      { name: 'Divine Domain', level: 1, description: 'Choose a divine domain related to your deity, granting you domain spells and additional features at 1st, 2nd, 6th, 8th, and 17th levels.' },
      { name: 'Channel Divinity', level: 2, description: 'You gain the ability to channel divine energy to fuel magical effects, starting with Turn Undead and a domain-specific option. You regain uses after a short or long rest.' },
      { name: 'Destroy Undead', level: 5, description: 'When an undead fails its saving throw against your Turn Undead feature, it is instantly destroyed if its CR is at or below a threshold that increases as you level up.' },
      { name: 'Divine Intervention', level: 10, description: 'You can call on your deity to intervene on your behalf by rolling percentile dice. If you roll a number equal to or lower than your cleric level, your deity intervenes. At 20th level, it succeeds automatically.' },
    ],
  },
  {
    name: 'Druid', hitDie: 8, primaryAbility: 'WIS', subclassLevel: 2,
    savingThrows: ['INT', 'WIS'],
    armorProficiencies: ['Light armor (nonmetal)', 'Medium armor (nonmetal)', 'Shields (nonmetal)'],
    weaponProficiencies: ['Clubs', 'Daggers', 'Darts', 'Javelins', 'Maces', 'Quarterstaffs', 'Scimitars', 'Sickles', 'Slings', 'Spears'],
    skillChoices: { count: 2, from: ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'] },
    startingEquipment: [
      { name: 'Wooden Shield', item_type: 'armor', weight: 6, value_gp: 10, quantity: 1 },
      { name: 'Scimitar', item_type: 'weapon', weight: 3, value_gp: 25, quantity: 1 },
      { name: 'Leather Armor', item_type: 'armor', weight: 10, value_gp: 10, quantity: 1 },
      { name: "Explorer's Pack", item_type: 'gear', weight: 59, value_gp: 10, quantity: 1 },
      { name: 'Druidic Focus', item_type: 'gear', weight: 0, value_gp: 1, quantity: 1 },
    ],
    startingGold: 10,
    subclasses: ['Circle of the Land', 'Circle of the Moon', 'Circle of Dreams', 'Circle of the Shepherd', 'Circle of Spores', 'Circle of Stars', 'Circle of Wildfire'],
    spellcasting: { ability: 'WIS', type: 'full' },
    features: [
      { name: 'Druidic', level: 1, description: 'You know Druidic, the secret language of druids. You can speak it and use it to leave hidden messages that only other druids can decipher.' },
      { name: 'Spellcasting', level: 1, description: 'You can cast druid spells using WIS as your spellcasting ability. You prepare spells from the druid spell list each day and can use a druidic focus as a spellcasting focus.' },
      { name: 'Wild Shape', level: 2, description: 'As an action, you can magically assume the shape of a beast you have seen before. You can use this feature twice per short or long rest, with beast CR and movement limitations based on your druid level.' },
      { name: 'Timeless Body', level: 18, description: 'The primal magic you wield causes you to age more slowly. For every 10 years that pass, your body ages only 1 year.' },
      { name: 'Beast Spells', level: 18, description: 'You can cast many of your druid spells in any shape you assume using Wild Shape. You can perform somatic and verbal components while in beast form.' },
      { name: 'Archdruid', level: 20, description: 'You can use Wild Shape an unlimited number of times, and you can ignore the verbal and somatic components of your druid spells as well as any material components without a gold cost.' },
    ],
  },
  {
    name: 'Fighter', hitDie: 10, primaryAbility: 'STR', subclassLevel: 3,
    savingThrows: ['STR', 'CON'],
    armorProficiencies: ['All armor', 'Shields'],
    weaponProficiencies: ['Simple weapons', 'Martial weapons'],
    skillChoices: { count: 2, from: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'] },
    startingEquipment: [
      { name: 'Chain Mail', item_type: 'armor', weight: 55, value_gp: 75, quantity: 1 },
      { name: 'Longsword', item_type: 'weapon', weight: 3, value_gp: 15, quantity: 1 },
      { name: 'Shield', item_type: 'armor', weight: 6, value_gp: 10, quantity: 1 },
      { name: 'Light Crossbow', item_type: 'weapon', weight: 5, value_gp: 25, quantity: 1 },
      { name: 'Bolt', item_type: 'ammunition', weight: 0.075, value_gp: 0.05, quantity: 20 },
      { name: "Explorer's Pack", item_type: 'gear', weight: 59, value_gp: 10, quantity: 1 },
    ],
    startingGold: 10,
    subclasses: ['Battle Master', 'Champion', 'Eldritch Knight', 'Arcane Archer', 'Cavalier', 'Samurai', 'Echo Knight', 'Psi Warrior', 'Rune Knight'],
    spellcasting: null,
    features: [
      { name: 'Fighting Style', level: 1, description: 'You adopt a particular style of fighting as your specialty, such as Archery, Defense, Dueling, Great Weapon Fighting, Protection, or Two-Weapon Fighting.' },
      { name: 'Second Wind', level: 1, description: 'As a bonus action, you can regain hit points equal to 1d10 + your fighter level. You must finish a short or long rest before you can use this feature again.' },
      { name: 'Action Surge', level: 2, description: 'You can push yourself beyond your normal limits for a moment, taking one additional action on top of your regular action and possible bonus action. You regain this after a short or long rest.' },
      { name: 'Extra Attack', level: 5, description: 'You can attack twice, instead of once, whenever you take the Attack action on your turn. This increases to three attacks at 11th level and four at 20th level.' },
      { name: 'Indomitable', level: 9, description: 'You can reroll a saving throw that you fail. You must use the new roll. You can use this feature twice between long rests starting at 13th level, and three times at 17th level.' },
    ],
  },
  {
    name: 'Monk', hitDie: 8, primaryAbility: 'DEX', subclassLevel: 3,
    savingThrows: ['STR', 'DEX'],
    armorProficiencies: [],
    weaponProficiencies: ['Simple weapons', 'Shortswords'],
    skillChoices: { count: 2, from: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'] },
    startingEquipment: [
      { name: 'Shortsword', item_type: 'weapon', weight: 2, value_gp: 10, quantity: 1 },
      { name: 'Dart', item_type: 'weapon', weight: 0.25, value_gp: 0.05, quantity: 10 },
      { name: "Explorer's Pack", item_type: 'gear', weight: 59, value_gp: 10, quantity: 1 },
    ],
    startingGold: 5,
    subclasses: ['Way of the Open Hand', 'Way of Shadow', 'Way of the Four Elements', 'Way of the Kensei', 'Way of the Drunken Master', 'Way of the Sun Soul', 'Way of Mercy', 'Way of the Astral Self'],
    spellcasting: null,
    features: [
      { name: 'Unarmored Defense', level: 1, description: 'While not wearing armor or wielding a shield, your AC equals 10 + DEX modifier + WIS modifier.' },
      { name: 'Martial Arts', level: 1, description: 'While unarmed or wielding monk weapons and not wearing armor or a shield, you can use DEX instead of STR for attack and damage rolls, roll a martial arts die in place of normal damage, and make one unarmed strike as a bonus action after attacking.' },
      { name: 'Ki', level: 2, description: 'You have a pool of ki points equal to your monk level that fuel special features such as Flurry of Blows, Patient Defense, and Step of the Wind. You regain all ki points after a short or long rest.' },
      { name: 'Unarmored Movement', level: 2, description: 'Your speed increases by 10 feet while you are not wearing armor or wielding a shield. This bonus increases as you gain monk levels, reaching +30 feet at 18th level.' },
      { name: 'Deflect Missiles', level: 3, description: 'You can use your reaction to deflect or catch a missile when hit by a ranged weapon attack, reducing the damage. If you reduce the damage to 0, you can spend 1 ki point to make a ranged attack with the caught missile.' },
      { name: 'Slow Fall', level: 4, description: 'You can use your reaction to reduce any falling damage you take by an amount equal to five times your monk level.' },
      { name: 'Extra Attack', level: 5, description: 'You can attack twice, instead of once, whenever you take the Attack action on your turn.' },
      { name: 'Stunning Strike', level: 5, description: 'When you hit a creature with a melee weapon attack, you can spend 1 ki point to attempt a stunning strike. The target must succeed on a CON saving throw or be stunned until the end of your next turn.' },
      { name: 'Ki-Empowered Strikes', level: 6, description: 'Your unarmed strikes count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.' },
      { name: 'Evasion', level: 7, description: 'When you are subjected to an effect that allows a DEX saving throw for half damage, you take no damage on a success and only half damage on a failure.' },
      { name: 'Stillness of Mind', level: 7, description: 'You can use your action to end one effect on yourself that is causing you to be charmed or frightened.' },
      { name: 'Purity of Body', level: 10, description: 'Your mastery of ki flowing through you makes you immune to disease and poison.' },
      { name: 'Tongue of the Sun and Moon', level: 13, description: 'You learn to touch the ki of other minds so that you understand all spoken languages. Any creature that can understand a language can understand what you say.' },
      { name: 'Diamond Soul', level: 14, description: 'Your mastery of ki grants you proficiency in all saving throws. Additionally, whenever you make a saving throw and fail, you can spend 1 ki point to reroll it and take the second result.' },
      { name: 'Timeless Body', level: 15, description: 'Your ki sustains you so that you suffer none of the frailty of old age, and you cannot be aged magically. You still die of old age. You also no longer need food or water.' },
      { name: 'Empty Body', level: 18, description: 'You can spend 4 ki points to become invisible for 1 minute and gain resistance to all damage except force damage. You can also spend 8 ki points to cast the Astral Projection spell.' },
      { name: 'Perfect Self', level: 20, description: 'When you roll initiative and have no ki points remaining, you regain 4 ki points.' },
    ],
  },
  {
    name: 'Paladin', hitDie: 10, primaryAbility: 'STR', subclassLevel: 3,
    savingThrows: ['WIS', 'CHA'],
    armorProficiencies: ['All armor', 'Shields'],
    weaponProficiencies: ['Simple weapons', 'Martial weapons'],
    skillChoices: { count: 2, from: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'] },
    startingEquipment: [
      { name: 'Chain Mail', item_type: 'armor', weight: 55, value_gp: 75, quantity: 1 },
      { name: 'Longsword', item_type: 'weapon', weight: 3, value_gp: 15, quantity: 1 },
      { name: 'Shield', item_type: 'armor', weight: 6, value_gp: 10, quantity: 1 },
      { name: 'Javelin', item_type: 'weapon', weight: 2, value_gp: 0.5, quantity: 5 },
      { name: "Priest's Pack", item_type: 'gear', weight: 24, value_gp: 19, quantity: 1 },
      { name: 'Holy Symbol', item_type: 'gear', weight: 0, value_gp: 5, quantity: 1 },
    ],
    startingGold: 10,
    subclasses: ['Oath of Devotion', 'Oath of the Ancients', 'Oath of Vengeance', 'Oath of Conquest', 'Oath of Redemption', 'Oath of the Crown', 'Oath of Glory', 'Oath of the Watchers', 'Oathbreaker'],
    spellcasting: { ability: 'CHA', type: 'half' },
    features: [
      { name: 'Divine Sense', level: 1, description: 'As an action, you can detect the location of any celestial, fiend, or undead within 60 feet that is not behind total cover. You can use this feature a number of times equal to 1 + CHA modifier per long rest.' },
      { name: 'Lay on Hands', level: 1, description: 'You have a pool of healing power equal to your paladin level x 5. As an action, you can touch a creature and restore hit points from this pool, or expend 5 points to cure one disease or neutralize one poison.' },
      { name: 'Fighting Style', level: 2, description: 'You adopt a particular style of fighting as your specialty, such as Defense, Dueling, Great Weapon Fighting, or Protection.' },
      { name: 'Spellcasting', level: 2, description: 'You can cast paladin spells using CHA as your spellcasting ability. You prepare spells from the paladin spell list each day and can use a holy symbol as a spellcasting focus.' },
      { name: 'Divine Smite', level: 2, description: 'When you hit a creature with a melee weapon attack, you can expend a spell slot to deal extra radiant damage of 2d8 for a 1st-level slot, plus 1d8 per slot level above 1st, to a maximum of 5d8. The damage increases by 1d8 against undead or fiends.' },
      { name: 'Divine Health', level: 3, description: 'The divine magic flowing through you makes you immune to disease.' },
      { name: 'Extra Attack', level: 5, description: 'You can attack twice, instead of once, whenever you take the Attack action on your turn.' },
      { name: 'Aura of Protection', level: 6, description: 'Whenever you or a friendly creature within 10 feet of you must make a saving throw, that creature gains a bonus equal to your CHA modifier (minimum +1). The range increases to 30 feet at 18th level.' },
      { name: 'Aura of Courage', level: 10, description: 'You and friendly creatures within 10 feet of you cannot be frightened while you are conscious. The range increases to 30 feet at 18th level.' },
      { name: 'Improved Divine Smite', level: 11, description: 'Whenever you hit a creature with a melee weapon, the creature takes an extra 1d8 radiant damage in addition to any smite damage you choose to deal.' },
      { name: 'Cleansing Touch', level: 14, description: 'As an action, you can end one spell on yourself or on one willing creature that you touch. You can use this feature a number of times equal to your CHA modifier per long rest.' },
    ],
  },
  {
    name: 'Ranger', hitDie: 10, primaryAbility: 'DEX', subclassLevel: 3,
    savingThrows: ['STR', 'DEX'],
    armorProficiencies: ['Light armor', 'Medium armor', 'Shields'],
    weaponProficiencies: ['Simple weapons', 'Martial weapons'],
    skillChoices: { count: 3, from: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'] },
    startingEquipment: [
      { name: 'Scale Mail', item_type: 'armor', weight: 45, value_gp: 50, quantity: 1 },
      { name: 'Longbow', item_type: 'weapon', weight: 2, value_gp: 50, quantity: 1 },
      { name: 'Arrow', item_type: 'ammunition', weight: 0.05, value_gp: 0.05, quantity: 20 },
      { name: 'Shortsword', item_type: 'weapon', weight: 2, value_gp: 10, quantity: 2 },
      { name: "Explorer's Pack", item_type: 'gear', weight: 59, value_gp: 10, quantity: 1 },
    ],
    startingGold: 10,
    subclasses: ['Hunter', 'Beast Master', 'Gloom Stalker', 'Horizon Walker', 'Monster Slayer', 'Fey Wanderer', 'Swarmkeeper', 'Drakewarden'],
    spellcasting: { ability: 'WIS', type: 'half' },
    features: [
      { name: 'Favored Enemy', level: 1, description: 'You have significant experience studying, tracking, hunting, and even talking to a certain type of enemy. You gain advantage on WIS (Survival) checks to track them and INT checks to recall information about them.' },
      { name: 'Natural Explorer', level: 1, description: 'You are a master of navigating the natural world. In your favored terrain, your travel is not slowed by difficult terrain, you cannot become lost except by magical means, and you gain other exploration benefits.' },
      { name: 'Fighting Style', level: 2, description: 'You adopt a particular style of fighting as your specialty, such as Archery, Defense, Dueling, or Two-Weapon Fighting.' },
      { name: 'Spellcasting', level: 2, description: 'You can cast ranger spells using WIS as your spellcasting ability. You learn spells from the ranger spell list and can use a druidic focus as a spellcasting focus.' },
      { name: 'Primeval Awareness', level: 3, description: 'You can expend a spell slot to sense whether certain aberrations, celestials, dragons, elementals, fey, fiends, or undead are present within 1 mile (or 6 miles in favored terrain).' },
      { name: 'Extra Attack', level: 5, description: 'You can attack twice, instead of once, whenever you take the Attack action on your turn.' },
      { name: "Land's Stride", level: 8, description: 'Moving through nonmagical difficult terrain costs you no extra movement. You can also pass through nonmagical plants without being slowed or taking damage, and you have advantage on saves against magically created or manipulated plants.' },
      { name: 'Hide in Plain Sight', level: 10, description: 'You can spend 1 minute creating camouflage for yourself. You gain a +10 bonus to DEX (Stealth) checks as long as you remain there without moving or taking actions.' },
      { name: 'Vanish', level: 14, description: 'You can use the Hide action as a bonus action on your turn. Also, you cannot be tracked by nonmagical means unless you choose to leave a trail.' },
      { name: 'Feral Senses', level: 18, description: 'You gain preternatural senses that help you fight creatures you cannot see. You are aware of the location of any invisible creature within 30 feet of you, and attacking unseen creatures does not impose disadvantage.' },
      { name: 'Foe Slayer', level: 20, description: 'Once on each of your turns, you can add your WIS modifier to the attack roll or damage roll of an attack you make against one of your favored enemies.' },
    ],
  },
  {
    name: 'Rogue', hitDie: 8, primaryAbility: 'DEX', subclassLevel: 3,
    savingThrows: ['DEX', 'INT'],
    armorProficiencies: ['Light armor'],
    weaponProficiencies: ['Simple weapons', 'Hand crossbows', 'Longswords', 'Rapiers', 'Shortswords'],
    skillChoices: { count: 4, from: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'] },
    startingEquipment: [
      { name: 'Rapier', item_type: 'weapon', weight: 2, value_gp: 25, quantity: 1 },
      { name: 'Shortbow', item_type: 'weapon', weight: 2, value_gp: 25, quantity: 1 },
      { name: 'Arrow', item_type: 'ammunition', weight: 0.05, value_gp: 0.05, quantity: 20 },
      { name: 'Leather Armor', item_type: 'armor', weight: 10, value_gp: 10, quantity: 1 },
      { name: 'Dagger', item_type: 'weapon', weight: 1, value_gp: 2, quantity: 2 },
      { name: "Burglar's Pack", item_type: 'gear', weight: 44, value_gp: 16, quantity: 1 },
      { name: "Thieves' Tools", item_type: 'gear', weight: 1, value_gp: 25, quantity: 1 },
    ],
    startingGold: 10,
    subclasses: ['Thief', 'Assassin', 'Arcane Trickster', 'Inquisitive', 'Mastermind', 'Scout', 'Swashbuckler', 'Phantom', 'Soulknife'],
    spellcasting: null,
    features: [
      { name: 'Expertise', level: 1, description: 'Choose two skill proficiencies or one skill proficiency and thieves\' tools. Your proficiency bonus is doubled for any ability check you make with them. You choose two more at 6th level.' },
      { name: 'Sneak Attack', level: 1, description: 'Once per turn, you can deal extra damage to one creature you hit with an attack if you have advantage on the attack roll or if another enemy of the target is within 5 feet of it. The extra damage starts at 1d6 and increases as you level.' },
      { name: "Thieves' Cant", level: 1, description: 'You have learned thieves\' cant, a secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation. You also understand a set of secret signs and symbols.' },
      { name: 'Cunning Action', level: 2, description: 'You can take a bonus action on each of your turns to Dash, Disengage, or Hide.' },
      { name: 'Uncanny Dodge', level: 5, description: 'When an attacker that you can see hits you with an attack, you can use your reaction to halve the attack\'s damage against you.' },
      { name: 'Evasion', level: 7, description: 'When you are subjected to an effect that allows a DEX saving throw for half damage, you take no damage on a success and only half damage on a failure.' },
      { name: 'Reliable Talent', level: 11, description: 'Whenever you make an ability check that lets you add your proficiency bonus, you can treat a d20 roll of 9 or lower as a 10.' },
      { name: 'Blindsense', level: 14, description: 'If you are able to hear, you are aware of the location of any hidden or invisible creature within 10 feet of you.' },
      { name: 'Slippery Mind', level: 15, description: 'You gain proficiency in WIS saving throws.' },
      { name: 'Elusive', level: 18, description: 'No attack roll has advantage against you while you are not incapacitated.' },
      { name: 'Stroke of Luck', level: 20, description: 'If your attack misses a target within range, you can turn the miss into a hit. Alternatively, if you fail an ability check, you can treat the d20 roll as a 20. Once used, you must finish a short or long rest to use it again.' },
    ],
  },
  {
    name: 'Sorcerer', hitDie: 6, primaryAbility: 'CHA', subclassLevel: 1,
    savingThrows: ['CON', 'CHA'],
    armorProficiencies: [],
    weaponProficiencies: ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Light crossbows'],
    skillChoices: { count: 2, from: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'] },
    startingEquipment: [
      { name: 'Light Crossbow', item_type: 'weapon', weight: 5, value_gp: 25, quantity: 1 },
      { name: 'Bolt', item_type: 'ammunition', weight: 0.075, value_gp: 0.05, quantity: 20 },
      { name: 'Arcane Focus', item_type: 'gear', weight: 1, value_gp: 10, quantity: 1 },
      { name: "Dungeoneer's Pack", item_type: 'gear', weight: 61, value_gp: 12, quantity: 1 },
      { name: 'Dagger', item_type: 'weapon', weight: 1, value_gp: 2, quantity: 2 },
    ],
    startingGold: 10,
    subclasses: ['Draconic Bloodline', 'Wild Magic', 'Divine Soul', 'Shadow Magic', 'Storm Sorcery', 'Aberrant Mind', 'Clockwork Soul'],
    spellcasting: { ability: 'CHA', type: 'full' },
    features: [
      { name: 'Spellcasting', level: 1, description: 'You can cast sorcerer spells using CHA as your spellcasting ability. You learn spells from the sorcerer spell list and can use an arcane focus as a spellcasting focus.' },
      { name: 'Sorcerous Origin', level: 1, description: 'Choose a sorcerous origin that describes the source of your innate magical power, granting you features at 1st, 6th, 14th, and 18th levels.' },
      { name: 'Font of Magic', level: 2, description: 'You have a pool of sorcery points equal to your sorcerer level. You can use sorcery points to create spell slots and expend spell slots to gain additional sorcery points.' },
      { name: 'Metamagic', level: 3, description: 'You gain the ability to twist your spells to suit your needs. You learn two Metamagic options (such as Twinned Spell, Quickened Spell, or Subtle Spell) and gain more at higher levels.' },
      { name: 'Sorcerous Restoration', level: 20, description: 'You regain 4 expended sorcery points whenever you finish a short rest.' },
    ],
  },
  {
    name: 'Warlock', hitDie: 8, primaryAbility: 'CHA', subclassLevel: 1,
    savingThrows: ['WIS', 'CHA'],
    armorProficiencies: ['Light armor'],
    weaponProficiencies: ['Simple weapons'],
    skillChoices: { count: 2, from: ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'] },
    startingEquipment: [
      { name: 'Light Crossbow', item_type: 'weapon', weight: 5, value_gp: 25, quantity: 1 },
      { name: 'Bolt', item_type: 'ammunition', weight: 0.075, value_gp: 0.05, quantity: 20 },
      { name: 'Arcane Focus', item_type: 'gear', weight: 1, value_gp: 10, quantity: 1 },
      { name: 'Leather Armor', item_type: 'armor', weight: 10, value_gp: 10, quantity: 1 },
      { name: "Scholar's Pack", item_type: 'gear', weight: 22, value_gp: 40, quantity: 1 },
      { name: 'Dagger', item_type: 'weapon', weight: 1, value_gp: 2, quantity: 2 },
    ],
    startingGold: 10,
    subclasses: ['The Archfey', 'The Fiend', 'The Great Old One', 'The Celestial', 'The Hexblade', 'The Fathomless', 'The Genie', 'The Undead', 'The Undying'],
    spellcasting: { ability: 'CHA', type: 'pact' },
    features: [
      { name: 'Pact Magic', level: 1, description: 'You can cast warlock spells using CHA as your spellcasting ability. Your spell slots are fewer but recharge on a short rest, and all slots are cast at the same (highest available) level.' },
      { name: 'Otherworldly Patron', level: 1, description: 'You have struck a bargain with an otherworldly being. Your patron grants you features at 1st, 6th, 10th, and 14th levels and expands your spell list.' },
      { name: 'Eldritch Invocations', level: 2, description: 'You gain two eldritch invocations of your choice, which are fragments of forbidden knowledge that imbue you with an abiding magical ability. You learn additional invocations as you level up.' },
      { name: 'Pact Boon', level: 3, description: 'Your otherworldly patron bestows a gift upon you: a Pact of the Chain (familiar), Pact of the Blade (weapon), or Pact of the Tome (cantrips), each unlocking specific invocations.' },
      { name: 'Mystic Arcanum', level: 11, description: 'Your patron bestows upon you a magical secret called an arcanum. Choose one 6th-level warlock spell that you can cast once without expending a spell slot. You gain additional arcana at higher levels.' },
      { name: 'Eldritch Master', level: 20, description: 'You can spend 1 minute entreating your patron to regain all your expended Pact Magic spell slots. You must finish a long rest before you can use this feature again.' },
    ],
  },
  {
    name: 'Wizard', hitDie: 6, primaryAbility: 'INT', subclassLevel: 2,
    savingThrows: ['INT', 'WIS'],
    armorProficiencies: [],
    weaponProficiencies: ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Light crossbows'],
    skillChoices: { count: 2, from: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'] },
    startingEquipment: [
      { name: 'Quarterstaff', item_type: 'weapon', weight: 4, value_gp: 0.2, quantity: 1 },
      { name: 'Arcane Focus', item_type: 'gear', weight: 1, value_gp: 10, quantity: 1 },
      { name: "Scholar's Pack", item_type: 'gear', weight: 22, value_gp: 40, quantity: 1 },
      { name: 'Spellbook', item_type: 'gear', weight: 3, value_gp: 50, quantity: 1 },
    ],
    startingGold: 10,
    subclasses: ['Abjuration', 'Conjuration', 'Divination', 'Enchantment', 'Evocation', 'Illusion', 'Necromancy', 'Transmutation', 'Bladesinging', 'War Magic', 'Chronurgy Magic', 'Graviturgy Magic', 'Order of Scribes'],
    spellcasting: { ability: 'INT', type: 'full' },
    features: [
      { name: 'Spellcasting', level: 1, description: 'You can cast wizard spells using INT as your spellcasting ability. You record spells in a spellbook and prepare a number of them each day. You can use an arcane focus or component pouch as a spellcasting focus.' },
      { name: 'Arcane Recovery', level: 1, description: 'Once per day when you finish a short rest, you can recover expended spell slots with a combined level equal to or less than half your wizard level (rounded up), and none of the slots can be 6th level or higher.' },
      { name: 'Arcane Tradition', level: 2, description: 'Choose an arcane tradition that shapes your practice of magic through one of the schools, granting you features at 2nd, 6th, 10th, and 14th levels.' },
      { name: 'Spell Mastery', level: 18, description: 'Choose a 1st-level and a 2nd-level wizard spell in your spellbook. You can cast those spells at their lowest level without expending a spell slot when you have them prepared.' },
      { name: 'Signature Spells', level: 20, description: 'Choose two 3rd-level wizard spells in your spellbook. You always have them prepared, they do not count against your number of prepared spells, and you can cast each of them once at 3rd level without expending a spell slot.' },
    ],
  },
];

// Full caster spell slots (Bard, Cleric, Druid, Sorcerer, Wizard)
// Index: [characterLevel-1][spellLevel 1-9] => number of slots
const FULL_CASTER_SLOTS = [
  [2,0,0,0,0,0,0,0,0], // 1
  [3,0,0,0,0,0,0,0,0], // 2
  [4,2,0,0,0,0,0,0,0], // 3
  [4,3,0,0,0,0,0,0,0], // 4
  [4,3,2,0,0,0,0,0,0], // 5
  [4,3,3,0,0,0,0,0,0], // 6
  [4,3,3,1,0,0,0,0,0], // 7
  [4,3,3,2,0,0,0,0,0], // 8
  [4,3,3,3,1,0,0,0,0], // 9
  [4,3,3,3,2,0,0,0,0], // 10
  [4,3,3,3,2,1,0,0,0], // 11
  [4,3,3,3,2,1,0,0,0], // 12
  [4,3,3,3,2,1,1,0,0], // 13
  [4,3,3,3,2,1,1,0,0], // 14
  [4,3,3,3,2,1,1,1,0], // 15
  [4,3,3,3,2,1,1,1,0], // 16
  [4,3,3,3,2,1,1,1,1], // 17
  [4,3,3,3,3,1,1,1,1], // 18
  [4,3,3,3,3,2,1,1,1], // 19
  [4,3,3,3,3,2,2,1,1], // 20
];

// Half caster slots (Paladin, Ranger) - levels 1-20, spell levels 1-5
const HALF_CASTER_SLOTS = [
  [0,0,0,0,0], // 1
  [2,0,0,0,0], // 2
  [3,0,0,0,0], // 3
  [3,0,0,0,0], // 4
  [4,2,0,0,0], // 5
  [4,2,0,0,0], // 6
  [4,3,0,0,0], // 7
  [4,3,0,0,0], // 8
  [4,3,2,0,0], // 9
  [4,3,2,0,0], // 10
  [4,3,3,0,0], // 11
  [4,3,3,0,0], // 12
  [4,3,3,1,0], // 13
  [4,3,3,1,0], // 14
  [4,3,3,2,0], // 15
  [4,3,3,2,0], // 16
  [4,3,3,3,1], // 17
  [4,3,3,3,1], // 18
  [4,3,3,3,2], // 19
  [4,3,3,3,2], // 20
];

// Third caster slots (Eldritch Knight, Arcane Trickster) - levels 1-20, spell levels 1-4
const THIRD_CASTER_SLOTS = [
  [0,0,0,0], // 1
  [0,0,0,0], // 2
  [2,0,0,0], // 3
  [3,0,0,0], // 4
  [3,0,0,0], // 5
  [3,0,0,0], // 6
  [4,2,0,0], // 7
  [4,2,0,0], // 8
  [4,2,0,0], // 9
  [4,3,0,0], // 10
  [4,3,0,0], // 11
  [4,3,0,0], // 12
  [4,3,2,0], // 13
  [4,3,2,0], // 14
  [4,3,2,0], // 15
  [4,3,3,0], // 16
  [4,3,3,0], // 17
  [4,3,3,0], // 18
  [4,3,3,1], // 19
  [4,3,3,1], // 20
];

// Warlock Pact Magic - slots and slot level by warlock level
const PACT_MAGIC = [
  { slots: 1, slotLevel: 1 }, // 1
  { slots: 2, slotLevel: 1 }, // 2
  { slots: 2, slotLevel: 2 }, // 3
  { slots: 2, slotLevel: 2 }, // 4
  { slots: 2, slotLevel: 3 }, // 5
  { slots: 2, slotLevel: 3 }, // 6
  { slots: 2, slotLevel: 4 }, // 7
  { slots: 2, slotLevel: 4 }, // 8
  { slots: 2, slotLevel: 5 }, // 9
  { slots: 2, slotLevel: 5 }, // 10
  { slots: 3, slotLevel: 5 }, // 11
  { slots: 3, slotLevel: 5 }, // 12
  { slots: 3, slotLevel: 5 }, // 13
  { slots: 3, slotLevel: 5 }, // 14
  { slots: 3, slotLevel: 5 }, // 15
  { slots: 3, slotLevel: 5 }, // 16
  { slots: 4, slotLevel: 5 }, // 17
  { slots: 4, slotLevel: 5 }, // 18
  { slots: 4, slotLevel: 5 }, // 19
  { slots: 4, slotLevel: 5 }, // 20
];

export const SPELL_SLOTS = {
  full: FULL_CASTER_SLOTS,
  half: HALF_CASTER_SLOTS,
  third: THIRD_CASTER_SLOTS,
  pact: PACT_MAGIC,
};

export const CONDITIONS = {
  'Blinded': 'Cannot see. Auto-fails checks requiring sight. Attack rolls against have advantage, attacks have disadvantage.',
  'Charmed': 'Cannot attack or target the charmer with harmful abilities or magical effects. Charmer has advantage on social interaction checks.',
  'Deafened': 'Cannot hear. Auto-fails checks requiring hearing.',
  'Exhaustion': 'Cumulative levels 1-6 with increasing penalties. See exhaustion table.',
  'Frightened': 'Disadvantage on ability checks and attack rolls while source of fear is in line of sight. Cannot willingly move closer to the source.',
  'Grappled': 'Speed becomes 0 and cannot benefit from speed bonuses. Ends if grappler is incapacitated or effect removes creature from reach.',
  'Incapacitated': 'Cannot take actions or reactions.',
  'Invisible': 'Impossible to see without special sense or magic. Considered heavily obscured. Attack rolls against have disadvantage, attacks have advantage.',
  'Paralyzed': 'Incapacitated, cannot move or speak. Auto-fails STR and DEX saves. Attacks have advantage. Melee hits are automatic critical hits.',
  'Petrified': 'Transformed to inanimate substance. Weight increases x10. Incapacitated, cannot move or speak. Attacks have advantage. Auto-fails STR/DEX saves. Resistance to all damage. Immune to poison and disease.',
  'Poisoned': 'Disadvantage on attack rolls and ability checks.',
  'Prone': 'Can only crawl. Disadvantage on attack rolls. Melee attacks against have advantage, ranged have disadvantage. Standing up costs half movement.',
  'Restrained': 'Speed becomes 0. Attack rolls against have advantage. Attacks and DEX saves have disadvantage.',
  'Stunned': 'Incapacitated, cannot move, can only speak falteringly. Auto-fails STR and DEX saves. Attacks against have advantage.',
  'Unconscious': 'Incapacitated, cannot move or speak. Drops whatever held. Falls prone. Auto-fails STR/DEX saves. Attacks have advantage. Melee hits are auto crits.',
};

export const EXHAUSTION_LEVELS = [
  'Disadvantage on ability checks',
  'Speed halved',
  'Disadvantage on attack rolls and saving throws',
  'Hit point maximum halved',
  'Speed reduced to 0',
  'Death',
];

export const FEATS = [
  { name: 'Alert', description: '+5 to initiative. Cannot be surprised while conscious. Hidden creatures do not gain advantage on attack rolls against you.' },
  { name: 'Athlete', description: '+1 STR or DEX. Standing from prone costs 5ft. Climbing does not cost extra movement. Running long/high jump with only 5ft running start.' },
  { name: 'Actor', description: '+1 CHA. Advantage on Deception and Performance checks to pass as a different person. Can mimic speech or sounds of other creatures.' },
  { name: 'Charger', description: 'When you Dash, you can use a bonus action to make one melee attack or to shove. +5 damage bonus on that attack if you moved at least 10ft in a straight line.' },
  { name: 'Crossbow Expert', description: 'Ignore loading property of crossbows you are proficient with. No disadvantage on ranged attacks within 5ft. When you attack with a one-handed weapon, you can use a bonus action to attack with a hand crossbow.' },
  { name: 'Defensive Duelist', description: 'When wielding a finesse weapon and hit by a melee attack, use reaction to add proficiency bonus to AC for that attack. Requires DEX 13+.' },
  { name: 'Dual Wielder', description: '+1 AC while dual wielding. Can use two-weapon fighting with non-light melee weapons. Can draw or stow two weapons at once.' },
  { name: 'Dungeon Delver', description: 'Advantage on Perception and Investigation checks to detect secret doors. Advantage on saves against traps. Resistance to trap damage. Search for traps at normal pace.' },
  { name: 'Durable', description: '+1 CON. When you roll hit dice to regain HP, minimum of 2x CON modifier (minimum 2).' },
  { name: 'Elemental Adept', description: 'Choose a damage type (acid, cold, fire, lightning, or thunder). Spells you cast ignore resistance to that type. When rolling damage, treat 1s as 2s.' },
  { name: 'Grappler', description: 'Advantage on attack rolls against creatures you are grappling. You can pin a creature grappled by you (both restrained). Requires STR 13+.' },
  { name: 'Great Weapon Master', description: 'On a critical hit or reducing a creature to 0 HP with a melee weapon, make one melee weapon attack as a bonus action. Before attacking with a heavy weapon, take -5 to hit for +10 damage.' },
  { name: 'Healer', description: "Use a healer's kit to stabilize a creature and restore 1 HP. Spend one use of healer's kit to restore 1d6+4+creature's max HD of HP. Once per creature per rest." },
  { name: 'Heavily Armored', description: '+1 STR. Gain proficiency with heavy armor. Requires medium armor proficiency.' },
  { name: 'Heavy Armor Master', description: '+1 STR. While wearing heavy armor, bludgeoning, piercing, and slashing damage from nonmagical weapons is reduced by 3. Requires heavy armor proficiency.' },
  { name: 'Inspiring Leader', description: 'Spend 10 minutes to give a speech. Up to 6 friendly creatures (including yourself) gain temporary HP equal to your level + CHA modifier. Requires CHA 13+.' },
  { name: 'Keen Mind', description: '+1 INT. Always know which way is north. Always know the number of hours before the next sunrise or sunset. Can accurately recall anything you have seen or heard within the past month.' },
  { name: 'Lightly Armored', description: '+1 STR or DEX. Gain proficiency with light armor.' },
  { name: 'Linguist', description: '+1 INT. Learn three languages. Create written ciphers (INT check to decipher without your key).' },
  { name: 'Lucky', description: 'You have 3 luck points. Spend one to roll an additional d20 on an attack roll, ability check, or saving throw, choosing which d20 to use. Can also spend when attacked to roll a d20 and choose whether the attack uses your roll or theirs. Regain all points on a long rest.' },
  { name: 'Mage Slayer', description: 'When a creature within 5ft casts a spell, use reaction to make a melee weapon attack. When you damage a concentrating creature, it has disadvantage on the concentration save. Advantage on saves against spells cast within 5ft.' },
  { name: 'Magic Initiate', description: 'Choose a class. Learn two cantrips and one 1st-level spell from that class spell list. Cast the 1st-level spell once per long rest. Spellcasting ability depends on the class chosen.' },
  { name: 'Martial Adept', description: 'Learn two maneuvers from the Battle Master archetype. Gain one superiority die (d6). Regain on short or long rest.' },
  { name: 'Medium Armor Master', description: 'Wearing medium armor does not impose disadvantage on Stealth checks. When wearing medium armor, add up to +3 (instead of +2) from DEX modifier to AC. Requires medium armor proficiency.' },
  { name: 'Mobile', description: '+10ft speed. When you Dash, difficult terrain does not cost extra movement. When you make a melee attack, you do not provoke opportunity attacks from that creature for the rest of the turn.' },
  { name: 'Moderately Armored', description: '+1 STR or DEX. Gain proficiency with medium armor and shields. Requires light armor proficiency.' },
  { name: 'Mounted Combatant', description: 'Advantage on melee attack rolls against unmounted creatures smaller than your mount. Force attacks targeting your mount to target you instead. Mount takes no damage on successful DEX save (half on fail).' },
  { name: 'Observant', description: '+1 INT or WIS. Can read lips if you can see a creature\'s mouth and understand the language. +5 to passive Perception and passive Investigation.' },
  { name: 'Polearm Master', description: 'When you take the Attack action with a glaive, halberd, quarterstaff, or spear, you can use a bonus action to make a melee attack with the opposite end (1d4 bludgeoning). Creatures provoke opportunity attacks when entering your reach.' },
  { name: 'Resilient', description: '+1 to one ability score. Gain proficiency in saving throws for that ability.' },
  { name: 'Ritual Caster', description: 'Gain a ritual book with two 1st-level ritual spells from a chosen class. Can cast spells in the book as rituals. Can add more ritual spells when found. Requires INT or WIS 13+.' },
  { name: 'Savage Attacker', description: 'Once per turn when you roll damage for a melee weapon attack, you can reroll the damage dice and use either total.' },
  { name: 'Sentinel', description: 'Creatures you hit with opportunity attacks have speed reduced to 0. Creatures provoke opportunity attacks even if they Disengage. When a creature within 5ft attacks a target other than you, use reaction to make a melee weapon attack.' },
  { name: 'Sharpshooter', description: 'Attacking at long range does not impose disadvantage. Ranged weapon attacks ignore half cover and three-quarters cover. Before attacking with a ranged weapon, take -5 to hit for +10 damage.' },
  { name: 'Shield Master', description: 'Use a bonus action to shove a creature within 5ft when you take the Attack action. Add shield AC bonus to DEX saves against effects targeting only you. Use reaction to take no damage on a successful DEX save (instead of half).' },
  { name: 'Skilled', description: 'Gain proficiency in any combination of three skills or tools.' },
  { name: 'Skulker', description: 'Can try to hide when lightly obscured. Missing a ranged attack does not reveal your position. Dim light does not impose disadvantage on Perception checks. Requires DEX 13+.' },
  { name: 'Spell Sniper', description: 'Double the range of attack roll spells. Ranged spell attacks ignore half cover and three-quarters cover. Learn one cantrip that requires an attack roll.' },
  { name: 'Tavern Brawler', description: '+1 STR or CON. Proficient with improvised weapons. Unarmed strikes deal 1d4 damage. When you hit with an unarmed strike or improvised weapon, you can use a bonus action to grapple.' },
  { name: 'Tough', description: 'Hit point maximum increases by an amount equal to twice your level when you gain this feat. Each time you gain a level thereafter, HP max increases by an additional 2.' },
  { name: 'War Caster', description: 'Advantage on CON saves to maintain concentration. Can perform somatic components with hands full of weapons or shield. Can cast a spell as an opportunity attack (single target, 1 action casting time). Requires spellcasting ability.' },
  { name: 'Weapon Master', description: '+1 STR or DEX. Gain proficiency with four weapons of your choice.' },
];
