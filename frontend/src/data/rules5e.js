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
];

export const CLASSES = [
  {
    name: 'Barbarian', hitDie: 12, primaryAbility: 'STR',
    savingThrows: ['STR', 'CON'],
    armorProficiencies: ['Light armor', 'Medium armor', 'Shields'],
    weaponProficiencies: ['Simple weapons', 'Martial weapons'],
    skillChoices: { count: 2, from: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'] },
    subclasses: ['Path of the Berserker', 'Path of the Totem Warrior'],
    spellcasting: null,
  },
  {
    name: 'Bard', hitDie: 8, primaryAbility: 'CHA',
    savingThrows: ['DEX', 'CHA'],
    armorProficiencies: ['Light armor'],
    weaponProficiencies: ['Simple weapons', 'Hand crossbows', 'Longswords', 'Rapiers', 'Shortswords'],
    skillChoices: { count: 3, from: Object.keys(SKILLS) },
    subclasses: ['College of Lore', 'College of Valor'],
    spellcasting: { ability: 'CHA', type: 'full' },
  },
  {
    name: 'Cleric', hitDie: 8, primaryAbility: 'WIS',
    savingThrows: ['WIS', 'CHA'],
    armorProficiencies: ['Light armor', 'Medium armor', 'Shields'],
    weaponProficiencies: ['Simple weapons'],
    skillChoices: { count: 2, from: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'] },
    subclasses: ['Knowledge', 'Life', 'Light', 'Nature', 'Tempest', 'Trickery', 'War'],
    spellcasting: { ability: 'WIS', type: 'full' },
  },
  {
    name: 'Druid', hitDie: 8, primaryAbility: 'WIS',
    savingThrows: ['INT', 'WIS'],
    armorProficiencies: ['Light armor (nonmetal)', 'Medium armor (nonmetal)', 'Shields (nonmetal)'],
    weaponProficiencies: ['Clubs', 'Daggers', 'Darts', 'Javelins', 'Maces', 'Quarterstaffs', 'Scimitars', 'Sickles', 'Slings', 'Spears'],
    skillChoices: { count: 2, from: ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'] },
    subclasses: ['Circle of the Land', 'Circle of the Moon'],
    spellcasting: { ability: 'WIS', type: 'full' },
  },
  {
    name: 'Fighter', hitDie: 10, primaryAbility: 'STR',
    savingThrows: ['STR', 'CON'],
    armorProficiencies: ['All armor', 'Shields'],
    weaponProficiencies: ['Simple weapons', 'Martial weapons'],
    skillChoices: { count: 2, from: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'] },
    subclasses: ['Battle Master', 'Champion', 'Eldritch Knight'],
    spellcasting: null,
  },
  {
    name: 'Monk', hitDie: 8, primaryAbility: 'DEX',
    savingThrows: ['STR', 'DEX'],
    armorProficiencies: [],
    weaponProficiencies: ['Simple weapons', 'Shortswords'],
    skillChoices: { count: 2, from: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'] },
    subclasses: ['Way of the Open Hand', 'Way of Shadow', 'Way of the Four Elements'],
    spellcasting: null,
  },
  {
    name: 'Paladin', hitDie: 10, primaryAbility: 'STR',
    savingThrows: ['WIS', 'CHA'],
    armorProficiencies: ['All armor', 'Shields'],
    weaponProficiencies: ['Simple weapons', 'Martial weapons'],
    skillChoices: { count: 2, from: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'] },
    subclasses: ['Oath of Devotion', 'Oath of the Ancients', 'Oath of Vengeance'],
    spellcasting: { ability: 'CHA', type: 'half' },
  },
  {
    name: 'Ranger', hitDie: 10, primaryAbility: 'DEX',
    savingThrows: ['STR', 'DEX'],
    armorProficiencies: ['Light armor', 'Medium armor', 'Shields'],
    weaponProficiencies: ['Simple weapons', 'Martial weapons'],
    skillChoices: { count: 3, from: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'] },
    subclasses: ['Hunter', 'Beast Master'],
    spellcasting: { ability: 'WIS', type: 'half' },
  },
  {
    name: 'Rogue', hitDie: 8, primaryAbility: 'DEX',
    savingThrows: ['DEX', 'INT'],
    armorProficiencies: ['Light armor'],
    weaponProficiencies: ['Simple weapons', 'Hand crossbows', 'Longswords', 'Rapiers', 'Shortswords'],
    skillChoices: { count: 4, from: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'] },
    subclasses: ['Thief', 'Assassin', 'Arcane Trickster'],
    spellcasting: null,
  },
  {
    name: 'Sorcerer', hitDie: 6, primaryAbility: 'CHA',
    savingThrows: ['CON', 'CHA'],
    armorProficiencies: [],
    weaponProficiencies: ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Light crossbows'],
    skillChoices: { count: 2, from: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'] },
    subclasses: ['Draconic Bloodline', 'Wild Magic'],
    spellcasting: { ability: 'CHA', type: 'full' },
  },
  {
    name: 'Warlock', hitDie: 8, primaryAbility: 'CHA',
    savingThrows: ['WIS', 'CHA'],
    armorProficiencies: ['Light armor'],
    weaponProficiencies: ['Simple weapons'],
    skillChoices: { count: 2, from: ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'] },
    subclasses: ['The Archfey', 'The Fiend', 'The Great Old One'],
    spellcasting: { ability: 'CHA', type: 'pact' },
  },
  {
    name: 'Wizard', hitDie: 6, primaryAbility: 'INT',
    savingThrows: ['INT', 'WIS'],
    armorProficiencies: [],
    weaponProficiencies: ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Light crossbows'],
    skillChoices: { count: 2, from: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'] },
    subclasses: ['Abjuration', 'Conjuration', 'Divination', 'Enchantment', 'Evocation', 'Illusion', 'Necromancy', 'Transmutation'],
    spellcasting: { ability: 'INT', type: 'full' },
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
