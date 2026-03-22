// D&D 5th Edition (2024 PHB Revised) Ruleset Module
// Key differences from 2014: Species replaces Races (no ability bonuses),
// Backgrounds grant ability score increases, revised class features,
// categorized feats, simplified exhaustion, weapon mastery.

// Shared data that is identical between 2014 and 2024
import { PROFICIENCY_BONUS, ABILITIES, SKILLS, POINT_BUY_COSTS } from '../rules5e';

// Spell slot tables are unchanged in 2024
const FULL_CASTER_SLOTS = [
  [2,0,0,0,0,0,0,0,0],
  [3,0,0,0,0,0,0,0,0],
  [4,2,0,0,0,0,0,0,0],
  [4,3,0,0,0,0,0,0,0],
  [4,3,2,0,0,0,0,0,0],
  [4,3,3,0,0,0,0,0,0],
  [4,3,3,1,0,0,0,0,0],
  [4,3,3,2,0,0,0,0,0],
  [4,3,3,3,1,0,0,0,0],
  [4,3,3,3,2,0,0,0,0],
  [4,3,3,3,2,1,0,0,0],
  [4,3,3,3,2,1,0,0,0],
  [4,3,3,3,2,1,1,0,0],
  [4,3,3,3,2,1,1,0,0],
  [4,3,3,3,2,1,1,1,0],
  [4,3,3,3,2,1,1,1,0],
  [4,3,3,3,2,1,1,1,1],
  [4,3,3,3,3,1,1,1,1],
  [4,3,3,3,3,2,1,1,1],
  [4,3,3,3,3,2,2,1,1],
];

const HALF_CASTER_SLOTS = [
  [0,0,0,0,0],
  [2,0,0,0,0],
  [3,0,0,0,0],
  [3,0,0,0,0],
  [4,2,0,0,0],
  [4,2,0,0,0],
  [4,3,0,0,0],
  [4,3,0,0,0],
  [4,3,2,0,0],
  [4,3,2,0,0],
  [4,3,3,0,0],
  [4,3,3,0,0],
  [4,3,3,1,0],
  [4,3,3,1,0],
  [4,3,3,2,0],
  [4,3,3,2,0],
  [4,3,3,3,1],
  [4,3,3,3,1],
  [4,3,3,3,2],
  [4,3,3,3,2],
];

const THIRD_CASTER_SLOTS = [
  [0,0,0,0],
  [0,0,0,0],
  [2,0,0,0],
  [3,0,0,0],
  [3,0,0,0],
  [3,0,0,0],
  [4,2,0,0],
  [4,2,0,0],
  [4,2,0,0],
  [4,3,0,0],
  [4,3,0,0],
  [4,3,0,0],
  [4,3,2,0],
  [4,3,2,0],
  [4,3,2,0],
  [4,3,3,0],
  [4,3,3,0],
  [4,3,3,0],
  [4,3,3,1],
  [4,3,3,1],
];

const PACT_MAGIC = [
  { slots: 1, slotLevel: 1 },
  { slots: 2, slotLevel: 1 },
  { slots: 2, slotLevel: 2 },
  { slots: 2, slotLevel: 2 },
  { slots: 2, slotLevel: 3 },
  { slots: 2, slotLevel: 3 },
  { slots: 2, slotLevel: 4 },
  { slots: 2, slotLevel: 4 },
  { slots: 2, slotLevel: 5 },
  { slots: 2, slotLevel: 5 },
  { slots: 3, slotLevel: 5 },
  { slots: 3, slotLevel: 5 },
  { slots: 3, slotLevel: 5 },
  { slots: 3, slotLevel: 5 },
  { slots: 3, slotLevel: 5 },
  { slots: 3, slotLevel: 5 },
  { slots: 4, slotLevel: 5 },
  { slots: 4, slotLevel: 5 },
  { slots: 4, slotLevel: 5 },
  { slots: 4, slotLevel: 5 },
];

const SPELL_SLOTS = {
  full: FULL_CASTER_SLOTS,
  half: HALF_CASTER_SLOTS,
  third: THIRD_CASTER_SLOTS,
  pact: PACT_MAGIC,
};

// 2024 Species — no ability score bonuses (those come from Background)
const RACES = [
  {
    name: 'Aasimar', subrace: '', speed: 30, size: 'Medium',
    abilityBonuses: {},
    traits: [
      { name: 'Celestial Resistance', description: 'Resistance to Necrotic and Radiant damage.' },
      { name: 'Darkvision', description: '60 ft. darkvision.' },
      { name: 'Healing Hands', description: 'As an action, touch a creature to restore HP equal to 1d4 + your proficiency bonus. Usable proficiency bonus times per long rest.' },
      { name: 'Light Bearer', description: 'You know the Light cantrip.' },
      { name: 'Celestial Revelation', description: 'At 3rd level, choose Necrotic Shroud, Radiant Consumption, or Radiant Soul transformation. Usable once per long rest.' },
    ],
    languages: ['Common', 'One extra'], darkvision: 60,
  },
  {
    name: 'Dragonborn', subrace: '', speed: 30, size: 'Medium',
    abilityBonuses: {},
    traits: [
      { name: 'Draconic Ancestry', description: 'Choose a dragon type. You gain a breath weapon and damage resistance associated with that type.' },
      { name: 'Breath Weapon', description: 'Exhale destructive energy as an action. 15-ft cone or 30-ft line (5 ft wide). DC = 8 + CON mod + proficiency. Usable proficiency bonus times per long rest. Damage: 1d10 at 1st, 2d10 at 5th, 3d10 at 11th, 4d10 at 17th.' },
      { name: 'Damage Resistance', description: 'Resistance to the damage type associated with your draconic ancestry.' },
      { name: 'Darkvision', description: '60 ft. darkvision.' },
      { name: 'Draconic Flight', description: 'At 5th level, sprout spectral wings as a bonus action. Fly speed equal to walking speed for 10 minutes. Usable once per long rest.' },
    ],
    languages: ['Common', 'Draconic'], darkvision: 60,
  },
  {
    name: 'Dwarf', subrace: '', speed: 30, size: 'Medium',
    abilityBonuses: {},
    traits: [
      { name: 'Darkvision', description: '120 ft. darkvision.' },
      { name: 'Dwarven Resilience', description: 'Resistance to Poison damage. Advantage on saving throws to avoid or end the Poisoned condition.' },
      { name: 'Dwarven Toughness', description: 'HP maximum increases by 1, and +1 each level.' },
      { name: 'Stonecunning', description: 'As a bonus action, gain Tremorsense 60 ft for 10 minutes. Usable proficiency bonus times per long rest.' },
    ],
    languages: ['Common', 'Dwarvish'], darkvision: 120,
  },
  {
    name: 'Elf', subrace: '', speed: 30, size: 'Medium',
    abilityBonuses: {},
    traits: [
      { name: 'Darkvision', description: '60 ft. darkvision.' },
      { name: 'Elven Lineage', description: 'Choose Drow (Faerie Fire), High Elf (one Wizard cantrip), or Wood Elf (Longstrider). Cast lineage spell once per long rest; also with spell slots.' },
      { name: 'Fey Ancestry', description: 'Advantage on saves to avoid or end the Charmed condition.' },
      { name: 'Keen Senses', description: 'Proficiency in Insight or Perception.' },
      { name: 'Trance', description: 'You do not sleep. 4 hours of trance equals 8 hours of sleep. During trance, gain proficiency with two weapons or tools until your next trance.' },
    ],
    languages: ['Common', 'Elvish'], darkvision: 60,
  },
  {
    name: 'Gnome', subrace: '', speed: 30, size: 'Small',
    abilityBonuses: {},
    traits: [
      { name: 'Darkvision', description: '60 ft. darkvision.' },
      { name: 'Gnomish Cunning', description: 'Advantage on INT, WIS, and CHA saving throws.' },
      { name: 'Gnomish Lineage', description: 'Choose Forest Gnome (Minor Illusion + Speak with Small Beasts) or Rock Gnome (Mending + Tinker clockwork devices).' },
    ],
    languages: ['Common', 'Gnomish'], darkvision: 60,
  },
  {
    name: 'Goliath', subrace: '', speed: 35, size: 'Medium',
    abilityBonuses: {},
    traits: [
      { name: 'Giant Ancestry', description: "Choose Cloud (use reaction to become briefly invisible), Fire (add 1d10 fire to an attack, prof bonus/long rest), Frost (resistance to Cold), Hill (resistance to falling prone + use reaction to reduce damage by 1d12 + CON mod), Stone (gain +1 AC from stony skin), or Storm (resistance to Lightning + 30 ft flight as bonus action)." },
      { name: "Large Form", description: "At 5th level, you can make yourself Large for 10 minutes as a bonus action. Advantage on STR checks, +10 ft reach. Usable proficiency bonus times per long rest." },
      { name: 'Powerful Build', description: 'Count as one size larger for carrying capacity and push/drag/lift.' },
    ],
    languages: ['Common', 'Giant'], darkvision: 0,
  },
  {
    name: 'Halfling', subrace: '', speed: 30, size: 'Small',
    abilityBonuses: {},
    traits: [
      { name: 'Brave', description: 'Advantage on saving throws to avoid or end the Frightened condition.' },
      { name: 'Halfling Nimbleness', description: 'Move through the space of any creature whose size is larger than yours.' },
      { name: 'Luck', description: 'When you roll a 1 on a d20 for a d20 Test, you can reroll and must use the new roll.' },
      { name: 'Naturally Stealthy', description: 'You can take the Hide action even when obscured only by a creature at least one size larger.' },
    ],
    languages: ['Common', 'Halfling'], darkvision: 0,
  },
  {
    name: 'Human', subrace: '', speed: 30, size: 'Medium or Small',
    abilityBonuses: {},
    traits: [
      { name: 'Resourceful', description: 'You gain Heroic Inspiration whenever you finish a Long Rest.' },
      { name: 'Skillful', description: 'You gain proficiency in one skill of your choice.' },
      { name: 'Versatile', description: 'You gain an Origin feat of your choice (see feats with the Origin category).' },
    ],
    languages: ['Common', 'One extra'], darkvision: 0,
  },
  {
    name: 'Orc', subrace: '', speed: 30, size: 'Medium',
    abilityBonuses: {},
    traits: [
      { name: 'Adrenaline Rush', description: 'Take the Dash action as a bonus action. You gain temporary HP equal to your proficiency bonus. Usable proficiency bonus times per long rest.' },
      { name: 'Darkvision', description: '120 ft. darkvision.' },
      { name: 'Relentless Endurance', description: 'When reduced to 0 HP but not killed, you drop to 1 HP instead. Once per long rest.' },
    ],
    languages: ['Common', 'Orc'], darkvision: 120,
  },
  {
    name: 'Tiefling', subrace: '', speed: 30, size: 'Medium or Small',
    abilityBonuses: {},
    traits: [
      { name: 'Darkvision', description: '60 ft. darkvision.' },
      { name: 'Fiendish Legacy', description: 'Choose Abyssal (Poison Spray cantrip, then Ray of Sickness + Hold Person), Chthonic (Chill Touch cantrip, then False Life + Ray of Enfeeblement), or Infernal (Fire Bolt cantrip, then Hellish Rebuke + Darkness). Spells gained at 1st, 3rd, 5th level. CHA is spellcasting ability.' },
      { name: 'Otherworldly Presence', description: 'You know the Thaumaturgy cantrip.' },
    ],
    languages: ['Common', 'One extra'], darkvision: 60,
  },
];

// 2024 Backgrounds — provide ability score bonuses and an Origin feat
const BACKGROUNDS = [
  { name: 'Acolyte', abilityBonuses: { INT: 2, WIS: 1 }, feat: 'Magic Initiate (Cleric)', skillProficiencies: ['Insight', 'Religion'] },
  { name: 'Charlatan', abilityBonuses: { CHA: 2, DEX: 1 }, feat: 'Skilled', skillProficiencies: ['Deception', 'Sleight of Hand'] },
  { name: 'Criminal', abilityBonuses: { DEX: 2, CON: 1 }, feat: 'Alert', skillProficiencies: ['Sleight of Hand', 'Stealth'] },
  { name: 'Entertainer', abilityBonuses: { CHA: 2, DEX: 1 }, feat: 'Musician', skillProficiencies: ['Acrobatics', 'Performance'] },
  { name: 'Farmer', abilityBonuses: { CON: 2, WIS: 1 }, feat: 'Tough', skillProficiencies: ['Animal Handling', 'Nature'] },
  { name: 'Guard', abilityBonuses: { STR: 2, WIS: 1 }, feat: 'Alert', skillProficiencies: ['Athletics', 'Perception'] },
  { name: 'Guide', abilityBonuses: { WIS: 2, DEX: 1 }, feat: 'Magic Initiate (Druid)', skillProficiencies: ['Stealth', 'Survival'] },
  { name: 'Hermit', abilityBonuses: { WIS: 2, CON: 1 }, feat: 'Healer', skillProficiencies: ['Medicine', 'Religion'] },
  { name: 'Merchant', abilityBonuses: { CHA: 2, INT: 1 }, feat: 'Lucky', skillProficiencies: ['Animal Handling', 'Persuasion'] },
  { name: 'Noble', abilityBonuses: { CHA: 2, INT: 1 }, feat: 'Skilled', skillProficiencies: ['History', 'Persuasion'] },
  { name: 'Sage', abilityBonuses: { INT: 2, WIS: 1 }, feat: 'Magic Initiate (Wizard)', skillProficiencies: ['Arcana', 'History'] },
  { name: 'Sailor', abilityBonuses: { DEX: 2, WIS: 1 }, feat: 'Tavern Brawler', skillProficiencies: ['Acrobatics', 'Perception'] },
  { name: 'Scribe', abilityBonuses: { INT: 2, DEX: 1 }, feat: 'Skilled', skillProficiencies: ['Investigation', 'Perception'] },
  { name: 'Soldier', abilityBonuses: { STR: 2, CON: 1 }, feat: 'Savage Attacker', skillProficiencies: ['Athletics', 'Intimidation'] },
  { name: 'Wayfarer', abilityBonuses: { WIS: 2, CON: 1 }, feat: 'Lucky', skillProficiencies: ['Insight', 'Stealth'] },
];

const CLASSES = [
  {
    name: 'Barbarian', hitDie: 12, primaryAbility: 'STR', subclassLevel: 3,
    savingThrows: ['STR', 'CON'],
    armorProficiencies: ['Light armor', 'Medium armor', 'Shields'],
    weaponProficiencies: ['Simple weapons', 'Martial weapons'],
    skillChoices: { count: 2, from: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'] },
    subclasses: ['Path of the Berserker', 'Path of the Wild Heart', 'Path of the World Tree', 'Path of the Zealot'],
    spellcasting: null,
  },
  {
    name: 'Bard', hitDie: 8, primaryAbility: 'CHA', subclassLevel: 3,
    savingThrows: ['DEX', 'CHA'],
    armorProficiencies: ['Light armor'],
    weaponProficiencies: ['Simple weapons'],
    skillChoices: { count: 3, from: Object.keys(SKILLS) },
    subclasses: ['College of Dance', 'College of Glamour', 'College of Lore', 'College of Valor'],
    spellcasting: { ability: 'CHA', type: 'full' },
  },
  {
    name: 'Cleric', hitDie: 8, primaryAbility: 'WIS', subclassLevel: 3,
    savingThrows: ['WIS', 'CHA'],
    armorProficiencies: ['Light armor', 'Medium armor', 'Shields'],
    weaponProficiencies: ['Simple weapons'],
    skillChoices: { count: 2, from: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'] },
    subclasses: ['Life Domain', 'Light Domain', 'Trickery Domain', 'War Domain'],
    spellcasting: { ability: 'WIS', type: 'full' },
  },
  {
    name: 'Druid', hitDie: 8, primaryAbility: 'WIS', subclassLevel: 3,
    savingThrows: ['INT', 'WIS'],
    armorProficiencies: ['Light armor', 'Shields'],
    weaponProficiencies: ['Simple weapons'],
    skillChoices: { count: 2, from: ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'] },
    subclasses: ['Circle of the Land', 'Circle of the Moon', 'Circle of the Sea', 'Circle of the Stars'],
    spellcasting: { ability: 'WIS', type: 'full' },
  },
  {
    name: 'Fighter', hitDie: 10, primaryAbility: 'STR', subclassLevel: 3,
    savingThrows: ['STR', 'CON'],
    armorProficiencies: ['All armor', 'Shields'],
    weaponProficiencies: ['Simple weapons', 'Martial weapons'],
    skillChoices: { count: 2, from: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'] },
    subclasses: ['Battle Master', 'Champion', 'Eldritch Knight', 'Psi Warrior'],
    spellcasting: null,
  },
  {
    name: 'Monk', hitDie: 8, primaryAbility: 'DEX', subclassLevel: 3,
    savingThrows: ['STR', 'DEX'],
    armorProficiencies: [],
    weaponProficiencies: ['Simple weapons', 'Martial weapons (with Monk property)'],
    skillChoices: { count: 2, from: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'] },
    subclasses: ['Warrior of Mercy', 'Warrior of Shadow', 'Warrior of the Elements', 'Warrior of the Open Hand'],
    spellcasting: null,
  },
  {
    name: 'Paladin', hitDie: 10, primaryAbility: 'STR', subclassLevel: 3,
    savingThrows: ['WIS', 'CHA'],
    armorProficiencies: ['All armor', 'Shields'],
    weaponProficiencies: ['Simple weapons', 'Martial weapons'],
    skillChoices: { count: 2, from: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'] },
    subclasses: ['Oath of Devotion', 'Oath of Glory', 'Oath of the Ancients', 'Oath of Vengeance'],
    spellcasting: { ability: 'CHA', type: 'half' },
  },
  {
    name: 'Ranger', hitDie: 10, primaryAbility: 'DEX', subclassLevel: 3,
    savingThrows: ['STR', 'DEX'],
    armorProficiencies: ['Light armor', 'Medium armor', 'Shields'],
    weaponProficiencies: ['Simple weapons', 'Martial weapons'],
    skillChoices: { count: 3, from: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'] },
    subclasses: ['Beast Master', 'Fey Wanderer', 'Gloom Stalker', 'Hunter'],
    spellcasting: { ability: 'WIS', type: 'half' },
  },
  {
    name: 'Rogue', hitDie: 8, primaryAbility: 'DEX', subclassLevel: 3,
    savingThrows: ['DEX', 'INT'],
    armorProficiencies: ['Light armor'],
    weaponProficiencies: ['Simple weapons', 'Martial weapons (with Finesse or Light)'],
    skillChoices: { count: 4, from: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'] },
    subclasses: ['Arcane Trickster', 'Assassin', 'Soulknife', 'Thief'],
    spellcasting: null,
  },
  {
    name: 'Sorcerer', hitDie: 6, primaryAbility: 'CHA', subclassLevel: 3,
    savingThrows: ['CON', 'CHA'],
    armorProficiencies: [],
    weaponProficiencies: ['Simple weapons'],
    skillChoices: { count: 2, from: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'] },
    subclasses: ['Aberrant Sorcery', 'Clockwork Sorcery', 'Draconic Sorcery', 'Wild Magic Sorcery'],
    spellcasting: { ability: 'CHA', type: 'full' },
  },
  {
    name: 'Warlock', hitDie: 8, primaryAbility: 'CHA', subclassLevel: 3,
    savingThrows: ['WIS', 'CHA'],
    armorProficiencies: ['Light armor'],
    weaponProficiencies: ['Simple weapons'],
    skillChoices: { count: 2, from: ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'] },
    subclasses: ['Archfey Patron', 'Celestial Patron', 'Fiend Patron', 'Great Old One Patron'],
    spellcasting: { ability: 'CHA', type: 'pact' },
  },
  {
    name: 'Wizard', hitDie: 6, primaryAbility: 'INT', subclassLevel: 3,
    savingThrows: ['INT', 'WIS'],
    armorProficiencies: [],
    weaponProficiencies: ['Simple weapons'],
    skillChoices: { count: 2, from: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'] },
    subclasses: ['Abjurer', 'Diviner', 'Evoker', 'Illusionist'],
    spellcasting: { ability: 'INT', type: 'full' },
  },
];

const CONDITIONS = {
  'Blinded': 'Cannot see. Auto-fails checks requiring sight. Attack rolls against have advantage, attacks have disadvantage.',
  'Charmed': 'Cannot attack or target the charmer with harmful abilities. Charmer has advantage on social checks against you.',
  'Deafened': 'Cannot hear. Auto-fails checks requiring hearing.',
  'Exhaustion': 'Each level: -2 to d20 Tests, -5 ft Speed. 10 levels = death. Removed by Long Rest (one level) or Greater Restoration (all levels).',
  'Frightened': 'Disadvantage on ability checks and attack rolls while source of fear is in line of sight. Cannot willingly move closer to source.',
  'Grappled': 'Speed becomes 0. Cannot benefit from speed bonuses. Ends if grappler is incapacitated or effect removes creature from reach.',
  'Incapacitated': 'Cannot take actions, bonus actions, or reactions.',
  'Invisible': 'Cannot be seen without special sense or magic. Heavily obscured. Attack rolls against have disadvantage, attacks have advantage.',
  'Paralyzed': 'Incapacitated, cannot move or speak. Auto-fails STR and DEX saves. Attacks have advantage. Melee hits within 5 ft are automatic critical hits.',
  'Petrified': 'Transformed to solid substance. Weight x10. Incapacitated. Attacks have advantage. Auto-fails STR/DEX saves. Resistance to all damage. Immune to poison and disease.',
  'Poisoned': 'Disadvantage on attack rolls and ability checks.',
  'Prone': 'Can only crawl. Disadvantage on attack rolls. Melee attacks within 5 ft have advantage, ranged attacks have disadvantage. Standing costs half movement.',
  'Restrained': 'Speed becomes 0. Attack rolls against have advantage. Attacks and DEX saves have disadvantage.',
  'Stunned': 'Incapacitated, cannot move, can only speak falteringly. Auto-fails STR and DEX saves. Attacks against have advantage.',
  'Unconscious': 'Incapacitated, cannot move or speak. Drops items, falls prone. Auto-fails STR/DEX saves. Attacks have advantage. Melee hits within 5 ft are auto crits.',
};

// 2024 Exhaustion: simplified cumulative system
// Each level: -2 to d20 Tests (ability checks, attack rolls, saving throws), -5 ft Speed
// 10 levels = death
const EXHAUSTION_LEVELS = [
  '-2 to d20 Tests, -5 ft Speed',
  '-4 to d20 Tests, -10 ft Speed',
  '-6 to d20 Tests, -15 ft Speed',
  '-8 to d20 Tests, -20 ft Speed',
  '-10 to d20 Tests, -25 ft Speed',
  '-12 to d20 Tests, -30 ft Speed',
  '-14 to d20 Tests, -35 ft Speed',
  '-16 to d20 Tests, -40 ft Speed',
  '-18 to d20 Tests, -45 ft Speed',
  'Death',
];

// 2024 Feats — categorized with level prerequisites
const FEATS = [
  // Origin Feats (level 1, granted by Background)
  { name: 'Alert', category: 'Origin', prerequisite: 'None', description: 'Add your proficiency bonus to Initiative. You cannot be surprised. At the start of each combat, swap Initiative with a willing ally.' },
  { name: 'Crafter', category: 'Origin', prerequisite: 'None', description: 'Gain proficiency with three Artisan Tools. 20% discount when buying nonmagical items. During a Long Rest, craft one item using your tools (must have materials).' },
  { name: 'Healer', category: 'Origin', prerequisite: 'None', description: "Use a Healer's Kit to restore 2d6 + proficiency bonus HP to a creature (once per creature per Short/Long Rest). Stabilize a dying creature as a Utilize action." },
  { name: 'Lucky', category: 'Origin', prerequisite: 'None', description: 'Gain Luck Points equal to proficiency bonus. Spend to gain advantage on a d20 Test or impose disadvantage on an attack against you. Regain all on Long Rest.' },
  { name: 'Magic Initiate', category: 'Origin', prerequisite: 'None', description: 'Choose Cleric, Druid, or Wizard. Learn two cantrips and one 1st-level spell from that list. Cast the 1st-level spell once per Long Rest (or with spell slots). Can swap this feat for another version when leveling up.' },
  { name: 'Musician', category: 'Origin', prerequisite: 'None', description: 'Gain proficiency with three Musical Instruments. After a Short or Long Rest, play for 10 minutes to give allies Heroic Inspiration. Number of allies = proficiency bonus.' },
  { name: 'Savage Attacker', category: 'Origin', prerequisite: 'None', description: 'Once per turn when you hit with a weapon or Unarmed Strike, you can roll damage dice twice and use either roll.' },
  { name: 'Skilled', category: 'Origin', prerequisite: 'None', description: 'Gain proficiency in any combination of three skills or tools.' },
  { name: 'Tavern Brawler', category: 'Origin', prerequisite: 'None', description: 'Proficient with Improvised Weapons. Unarmed Strike damage: 1d4 + STR mod. Reroll 1s on damage for Unarmed Strikes and Improvised Weapons. Push a creature 5 ft when you hit with Unarmed Strike (bonus action to grapple).' },
  { name: 'Tough', category: 'Origin', prerequisite: 'None', description: 'HP maximum increases by 2 per character level (retroactive).' },

  // General Feats (available at ASI levels)
  { name: 'Ability Score Improvement', category: 'General', prerequisite: 'Level 4+', description: '+2 to one ability score (max 20) or +1 to two different ability scores (max 20).' },
  { name: 'Actor', category: 'General', prerequisite: 'Level 4+, CHA 13+', description: '+1 CHA (max 20). Advantage on Deception and Performance checks to impersonate. Can mimic speech of others after hearing for 1 minute.' },
  { name: 'Athlete', category: 'General', prerequisite: 'Level 4+, STR or DEX 13+', description: '+1 STR or DEX (max 20). Standing from prone costs 5 ft. Climbing costs no extra movement. Running long/high jump with only 5 ft start.' },
  { name: 'Charger', category: 'General', prerequisite: 'Level 4+, STR or DEX 13+', description: '+1 STR or DEX. When you Dash and move 10+ ft in a straight line, make a melee attack with +1d8 damage as part of the Dash, or push target 10 ft.' },
  { name: 'Chef', category: 'General', prerequisite: 'Level 4+, CON or WIS 13+', description: "+1 CON or WIS. Cook treats during Short Rest: prof bonus creatures regain 1d8 extra HP. Prepare special food during Long Rest: prof bonus treats granting temp HP = prof bonus." },
  { name: 'Crossbow Expert', category: 'General', prerequisite: 'Level 4+, DEX 13+', description: '+1 DEX (max 20). Ignore Loading on crossbows. No disadvantage on ranged attacks within 5 ft. When you attack with a one-handed weapon, bonus action attack with hand crossbow.' },
  { name: 'Crusher', category: 'General', prerequisite: 'Level 4+, STR or CON 13+', description: '+1 STR or CON. Once per turn with Bludgeoning damage, push target 5 ft. On a crit with Bludgeoning, attacks against target have advantage until your next turn.' },
  { name: 'Defensive Duelist', category: 'General', prerequisite: 'Level 4+, DEX 13+', description: '+1 DEX. When wielding a Finesse weapon and hit by a melee attack, use reaction to add proficiency bonus to AC for that attack.' },
  { name: 'Dual Wielder', category: 'General', prerequisite: 'Level 4+, STR or DEX 13+', description: '+1 STR or DEX. When you take the Attack action and attack with a Light weapon, make an extra attack with a different Light weapon (no ability mod to damage unless negative). Draw or stow two weapons at once.' },
  { name: 'Durable', category: 'General', prerequisite: 'Level 4+, CON 13+', description: '+1 CON. Spend fewer Hit Dice during Short Rest: treat dice that roll below 6 as if they rolled 6.' },
  { name: 'Elemental Adept', category: 'General', prerequisite: 'Level 4+, Spellcasting', description: 'Choose Acid, Cold, Fire, Lightning, or Thunder. Spells ignore resistance to that type. Treat 1s on damage dice as 2s. Repeatable for different elements.' },
  { name: 'Fey Touched', category: 'General', prerequisite: 'Level 4+, INT/WIS/CHA 13+', description: '+1 INT, WIS, or CHA. Learn Misty Step and one 1st-level Divination or Enchantment spell. Cast each once per Long Rest or with spell slots.' },
  { name: 'Great Weapon Master', category: 'General', prerequisite: 'Level 4+, STR 13+', description: '+1 STR. When you hit with a Heavy weapon, add proficiency bonus to damage. On a crit with a Heavy melee weapon, make one bonus action melee attack.' },
  { name: 'Heavily Armored', category: 'General', prerequisite: 'Level 4+, Medium armor proficiency', description: '+1 STR or CON. Gain proficiency with Heavy armor.' },
  { name: 'Heavy Armor Master', category: 'General', prerequisite: 'Level 4+, Heavy armor proficiency', description: '+1 STR or CON. While wearing Heavy armor, reduce Bludgeoning, Piercing, or Slashing damage you take by your proficiency bonus (nonmagical and magical).' },
  { name: 'Inspiring Leader', category: 'General', prerequisite: 'Level 4+, CHA or WIS 13+', description: '+1 CHA or WIS. After a Short or Long Rest, give a 10-minute speech. Up to 6 allies gain temporary HP = your level + CHA or WIS mod.' },
  { name: 'Keen Mind', category: 'General', prerequisite: 'Level 4+, INT 13+', description: '+1 INT. Choose proficiency in Arcana, History, Investigation, Nature, or Religion (or Expertise if already proficient). Study an object for 1 minute to learn its magical properties.' },
  { name: 'Lightly Armored', category: 'General', prerequisite: 'Level 4+', description: '+1 STR or DEX. Gain proficiency with Light armor and Shields.' },
  { name: 'Mage Slayer', category: 'General', prerequisite: 'Level 4+', description: '+1 STR or DEX. When a creature within 5 ft casts a spell, make an opportunity attack. When you damage a concentrating creature, it has disadvantage on the save. On a failed CON save vs. your damage, the creature also has disadvantage on its next attack roll.' },
  { name: 'Medium Armor Master', category: 'General', prerequisite: 'Level 4+, Medium armor proficiency', description: '+1 STR or DEX. Medium armor does not impose Stealth disadvantage. Add up to +3 from DEX to AC in Medium armor (instead of +2).' },
  { name: 'Mobile', category: 'General', prerequisite: 'Level 4+, DEX or CON 13+', description: '+1 DEX or CON. +10 ft speed. When you Dash, difficult terrain does not cost extra. When you make a melee attack, no opportunity attacks from that creature this turn.' },
  { name: 'Mounted Combatant', category: 'General', prerequisite: 'Level 4+', description: '+1 STR, DEX, or WIS. Advantage on melee attacks against unmounted creatures smaller than mount. Force attacks on mount to target you instead. Mount takes no damage on successful DEX save (half on fail).' },
  { name: 'Observant', category: 'General', prerequisite: 'Level 4+, INT or WIS 13+', description: '+1 INT or WIS. Choose proficiency in Investigation or Perception (or Expertise if proficient). Can read lips. +5 to passive Perception and Investigation.' },
  { name: 'Piercer', category: 'General', prerequisite: 'Level 4+, STR or DEX 13+', description: '+1 STR or DEX. Once per turn with Piercing damage, reroll one damage die and use the higher. On a crit with Piercing, +1 extra damage die.' },
  { name: 'Poisoner', category: 'General', prerequisite: 'Level 4+', description: '+1 DEX or INT. Gain proficiency with Poisoner Kit. Apply poison as a bonus action. Craft potent poison (2d8 Poison damage + Poisoned for 1 minute, CON save DC 14).' },
  { name: 'Polearm Master', category: 'General', prerequisite: 'Level 4+, STR or DEX 13+', description: '+1 STR or DEX. When you attack with a glaive/halberd/pike/quarterstaff/spear, bonus action melee attack with opposite end (1d4 Bludgeoning). Creatures provoke opportunity attacks when entering your reach.' },
  { name: 'Resilient', category: 'General', prerequisite: 'Level 4+', description: '+1 to one ability score (max 20). Gain proficiency in saving throws for that ability.' },
  { name: 'Ritual Caster', category: 'General', prerequisite: 'Level 4+, INT or WIS 13+', description: '+1 INT or WIS. You have a ritual book with two 1st-level Ritual spells. Can cast spells as Rituals (+10 min casting time). Can copy more Ritual spells from scrolls/books.' },
  { name: 'Sentinel', category: 'General', prerequisite: 'Level 4+, STR or DEX 13+', description: '+1 STR or DEX. Creatures you hit with opportunity attacks have speed reduced to 0. Creatures provoke opportunity attacks even if they Disengage. When a creature attacks someone other than you within 5 ft, use reaction for a melee attack.' },
  { name: 'Shadow Touched', category: 'General', prerequisite: 'Level 4+, INT/WIS/CHA 13+', description: '+1 INT, WIS, or CHA. Learn Invisibility and one 1st-level Illusion or Necromancy spell. Cast each once per Long Rest or with spell slots.' },
  { name: 'Sharpshooter', category: 'General', prerequisite: 'Level 4+, DEX 13+', description: '+1 DEX. No disadvantage at long range. Ignore half and three-quarters cover. When you hit with a ranged weapon, add proficiency bonus to damage.' },
  { name: 'Shield Master', category: 'General', prerequisite: 'Level 4+', description: '+1 STR or DEX. When you take the Attack action, shove as a bonus action. Add shield AC to DEX saves vs single-target effects. On successful DEX save for half damage, take none (reaction).' },
  { name: 'Skill Expert', category: 'General', prerequisite: 'Level 4+', description: '+1 to one ability score (max 20). Gain proficiency in one skill. Gain Expertise in one skill you are proficient with.' },
  { name: 'Skulker', category: 'General', prerequisite: 'Level 4+, DEX 13+', description: '+1 DEX. Hide when lightly obscured. Dim light does not impose disadvantage on Perception. When you miss with a ranged attack, you do not reveal your location.' },
  { name: 'Slasher', category: 'General', prerequisite: 'Level 4+, STR or DEX 13+', description: '+1 STR or DEX. Once per turn with Slashing damage, reduce target speed by 10 ft until your next turn. On a crit with Slashing, target has disadvantage on attacks until your next turn.' },
  { name: 'Speedy', category: 'General', prerequisite: 'Level 4+, DEX or CON 13+', description: '+1 DEX or CON. +10 ft speed. Dash as a bonus action. Opportunity attacks against you have disadvantage.' },
  { name: 'Spell Sniper', category: 'General', prerequisite: 'Level 4+, Spellcasting', description: '+1 INT, WIS, or CHA. Double range of attack-roll spells. Ignore half and three-quarters cover for spell attacks. Learn one attack-roll cantrip.' },
  { name: 'Telekinetic', category: 'General', prerequisite: 'Level 4+, INT/WIS/CHA 13+', description: '+1 INT, WIS, or CHA. Learn Mage Hand (invisible if already known). As a bonus action, push/pull a creature within 30 ft by 5 ft (STR save to resist).' },
  { name: 'Telepathic', category: 'General', prerequisite: 'Level 4+, INT/WIS/CHA 13+', description: '+1 INT, WIS, or CHA. Telepathically speak to a creature within 60 ft (one-way, shared language). Cast Detect Thoughts once per Long Rest or with spell slots.' },
  { name: 'War Caster', category: 'General', prerequisite: 'Level 4+, Spellcasting', description: '+1 INT, WIS, or CHA. Advantage on CON saves to maintain Concentration. Somatic components with hands full. Cast a cantrip (targeting only the trigger) as an opportunity attack.' },
  { name: 'Weapon Master', category: 'General', prerequisite: 'Level 4+', description: '+1 STR or DEX. Gain proficiency with Martial Weapons. When you miss with a weapon that has a Mastery property, you can use a different Mastery property you qualify for (once per turn).' },

  // Epic Boon Feats (level 19+)
  { name: 'Boon of Combat Prowess', category: 'Epic Boon', prerequisite: 'Level 19+', description: '+1 to any ability score (max 30). When you miss with an attack, turn it into a hit. Once per Short or Long Rest.' },
  { name: 'Boon of Dimensional Travel', category: 'Epic Boon', prerequisite: 'Level 19+', description: '+1 to any ability score (max 30). Immediately after using the Attack action or Magic action, teleport up to 30 ft to an unoccupied space you can see.' },
  { name: 'Boon of Energy Resistance', category: 'Epic Boon', prerequisite: 'Level 19+', description: '+1 to any ability score (max 30). Gain resistance to two of: Acid, Cold, Fire, Lightning, Necrotic, Poison, Psychic, Radiant, Thunder. When you take damage of a resisted type, gain temp HP = half the damage taken.' },
  { name: 'Boon of Fate', category: 'Epic Boon', prerequisite: 'Level 19+', description: '+1 to any ability score (max 30). When you or another creature within 60 ft fails a d20 Test, roll 2d4 and add or subtract from the roll. Potentially changes outcome. Proficiency bonus times per Long Rest.' },
  { name: 'Boon of Fortitude', category: 'Epic Boon', prerequisite: 'Level 19+', description: '+1 to any ability score (max 30). HP maximum increases by 40.' },
  { name: 'Boon of Irresistible Offense', category: 'Epic Boon', prerequisite: 'Level 19+', description: '+1 to any ability score (max 30). Your attacks ignore Resistance. When you deal damage and the target has Immunity, it takes half damage instead.' },
  { name: 'Boon of Recovery', category: 'Epic Boon', prerequisite: 'Level 19+', description: '+1 to any ability score (max 30). As a bonus action, regain half your HP max. Once per Long Rest. When you roll a 1 or 2 on a Hit Die, reroll (must use new roll).' },
  { name: 'Boon of Skill', category: 'Epic Boon', prerequisite: 'Level 19+', description: '+1 to any ability score (max 30). Gain proficiency in all skills. Gain Expertise in any 5 skills.' },
  { name: 'Boon of Speed', category: 'Epic Boon', prerequisite: 'Level 19+', description: '+1 to any ability score (max 30). +30 ft speed. Opportunity attacks against you have disadvantage. When a creature misses you with an opportunity attack, move up to half your speed as a reaction.' },
  { name: 'Boon of Truesight', category: 'Epic Boon', prerequisite: 'Level 19+', description: '+1 to any ability score (max 30). Gain Truesight 60 ft.' },
];

// 2024 ASI Levels — Fighter still gets extra, Rogue gets extra
const ASI_LEVELS = {
  default: [4, 8, 12, 16, 19],
  Fighter: [4, 6, 8, 12, 14, 16, 19],
  Rogue: [4, 8, 10, 12, 16, 19],
};

// 2024 Class Features by Level
const CLASS_FEATURES = {
  Barbarian: {
    1: [
      { name: 'Rage', description: 'Bonus action to rage: advantage on STR checks/saves, bonus rage damage (+2 at 1st, +3 at 9th, +4 at 16th), resistance to Bludgeoning/Piercing/Slashing. Rages = proficiency bonus per Long Rest.' },
      { name: 'Unarmored Defense', description: 'AC = 10 + DEX mod + CON mod when not wearing armor.' },
      { name: 'Weapon Mastery', description: 'You gain the Weapon Mastery property of two weapons you are proficient with. Swap one choice when you level up.' },
    ],
    2: [
      { name: 'Danger Sense', description: 'Advantage on DEX saving throws against effects you can see (traps, spells, etc.).' },
      { name: 'Reckless Attack', description: 'When you make your first attack on your turn, you can attack recklessly: advantage on all STR-based melee attacks this turn, but attacks against you have advantage until your next turn.' },
    ],
    3: [
      { name: 'Primal Path', description: 'Choose your subclass archetype (Path of the Berserker, Wild Heart, World Tree, or Zealot).' },
    ],
    5: [
      { name: 'Extra Attack', description: 'Attack twice when you take the Attack action.' },
      { name: 'Fast Movement', description: '+10 ft speed while not wearing Heavy armor.' },
    ],
    7: [
      { name: 'Feral Instinct', description: 'Advantage on Initiative rolls. If you are surprised, you can act normally on your first turn if you enter a Rage.' },
      { name: 'Instinctive Pounce', description: 'When you enter a Rage, move up to half your speed without provoking opportunity attacks.' },
    ],
    9: [
      { name: 'Brutal Strike', description: 'When you use Reckless Attack and hit, you can forgo advantage to deal an extra 1d10 damage and push target 5 ft or knock prone (target STR save).' },
    ],
    11: [
      { name: 'Relentless Rage', description: 'If you drop to 0 HP while raging, CON save DC 10 to drop to 1 HP instead. DC increases by 5 each time until you finish a Short/Long Rest.' },
    ],
    13: [
      { name: 'Improved Brutal Strike', description: 'Brutal Strike damage increases. Choose two effects: Hamstring (halve speed), Stagger (disadvantage on next save), or Sundering (reduce AC by your rage damage until your next turn).' },
    ],
    15: [
      { name: 'Persistent Rage', description: 'Rage only ends early if you fall Unconscious or choose to end it. Also regain one Rage when you roll Initiative and have none.' },
    ],
    17: [
      { name: 'Improved Brutal Strike', description: 'Brutal Strike extra damage increases to 2d10. Choose from all Brutal Strike effects.' },
    ],
    18: [
      { name: 'Indomitable Might', description: 'If your total for a STR check is less than your STR score, you can use your STR score instead.' },
    ],
    20: [
      { name: 'Primal Champion', description: '+4 to STR and CON. Maximum for both increases to 25.' },
    ],
  },

  Bard: {
    1: [
      { name: 'Spellcasting', description: 'Cast bard spells using CHA as your spellcasting ability.' },
      { name: 'Bardic Inspiration', description: 'Bonus action to give an ally a Bardic Inspiration die (d6). Uses = CHA modifier per Long Rest. Die increases at 5th (d8), 10th (d10), 15th (d12).' },
    ],
    2: [
      { name: 'Expertise', description: 'Choose two skill proficiencies. Your proficiency bonus is doubled for those skills.' },
      { name: 'Jack of All Trades', description: 'Add half your proficiency bonus (round down) to any ability check that does not already include your proficiency bonus.' },
    ],
    3: [
      { name: 'Bard College', description: 'Choose your subclass (College of Dance, Glamour, Lore, or Valor).' },
    ],
    5: [
      { name: 'Font of Inspiration', description: 'Regain all Bardic Inspiration uses when you finish a Short or Long Rest (previously Long Rest only).' },
    ],
    7: [
      { name: 'Countercharm', description: 'As a reaction when you or an ally within 30 ft fails a save against Charmed or Frightened, reroll the save (use new result).' },
    ],
    9: [
      { name: 'Expertise', description: 'Choose two more skill proficiencies for Expertise.' },
    ],
    10: [
      { name: 'Magical Secrets', description: 'Learn two spells from any spell list. They count as Bard spells for you.' },
    ],
    14: [
      { name: 'Magical Secrets', description: 'Learn two more spells from any spell list.' },
    ],
    18: [
      { name: 'Superior Inspiration', description: 'When you roll Initiative and have no Bardic Inspiration uses, you regain two uses.' },
      { name: 'Magical Secrets', description: 'Learn two more spells from any spell list.' },
    ],
    20: [
      { name: 'Words of Creation', description: 'When you roll Bardic Inspiration dice, you can roll twice and use either. If a Bardic Inspiration die is unused when the effect would end, the ally keeps it.' },
    ],
  },

  Cleric: {
    1: [
      { name: 'Spellcasting', description: 'Cast cleric spells using WIS as your spellcasting ability. You can prepare spells from the full Divine spell list each Long Rest.' },
      { name: 'Divine Order', description: 'Choose Protector (gain Heavy armor and Martial weapon proficiency) or Thaumaturge (gain one extra cantrip and add WIS mod to Religion checks).' },
    ],
    2: [
      { name: 'Channel Divinity', description: 'Gain Channel Divinity: Divine Spark (deal Radiant damage or heal) and Turn Undead. Uses = 2, regain on Short/Long Rest. Uses increase at 6th (3) and 18th (4).' },
    ],
    3: [
      { name: 'Divine Domain', description: 'Choose your subclass domain (Life, Light, Trickery, or War).' },
    ],
    5: [
      { name: 'Sear Undead', description: 'When you use Turn Undead, each affected undead also takes Radiant damage = 2d8 + Cleric level.' },
    ],
    7: [
      { name: 'Blessed Strikes', description: 'Once per turn, when you deal damage with a cantrip or weapon attack, add 1d8 Radiant damage.' },
    ],
    9: [
      { name: 'Sear Undead Improvement', description: 'Sear Undead damage increases. Destroy Undead if CR 1/2 or lower.' },
    ],
    10: [
      { name: 'Divine Intervention', description: 'As a Magic action, cast any Cleric spell of 5th level or lower without a spell slot or Material components. Once per Long Rest.' },
    ],
    11: [
      { name: 'Destroy Undead (CR 1)', description: 'Turn Undead destroys undead of CR 1 or lower.' },
    ],
    14: [
      { name: 'Improved Blessed Strikes', description: 'Blessed Strikes damage increases to 2d8.' },
      { name: 'Destroy Undead (CR 2)', description: 'Turn Undead destroys undead of CR 2 or lower.' },
    ],
    17: [
      { name: 'Destroy Undead (CR 3)', description: 'Turn Undead destroys undead of CR 3 or lower.' },
    ],
    20: [
      { name: 'Greater Divine Intervention', description: 'Cast any spell of 9th level or lower as Divine Intervention. Also cast Wish once. After casting Wish, never suffer negative consequences for it.' },
    ],
  },

  Druid: {
    1: [
      { name: 'Spellcasting', description: 'Cast druid spells using WIS as your spellcasting ability. Prepare spells from the Primal spell list.' },
      { name: 'Druidic', description: 'You know Druidic, the secret language of druids.' },
      { name: 'Primal Order', description: 'Choose Magician (gain one extra cantrip, add WIS to Arcana checks) or Warden (gain Martial weapon proficiency, Medium armor, Shield proficiency, add WIS to Animal Handling checks).' },
    ],
    2: [
      { name: 'Wild Shape', description: 'Magically assume the form of an animal. Bonus action, prof bonus times per Long Rest. Gain temp HP instead of beast stat block. Maintain concentration on spells.' },
      { name: 'Wild Companion', description: 'Expend a Wild Shape use to cast Find Familiar without material components.' },
    ],
    3: [
      { name: 'Druid Circle', description: 'Choose your subclass (Circle of the Land, Moon, Sea, or Stars).' },
    ],
    5: [
      { name: 'Wild Resurgence', description: 'Once per turn, when you use Wild Shape, you can expend a spell slot to regain one use of Wild Shape. Also, once per Long Rest, use a bonus action to regain a 1st-level spell slot.' },
    ],
    7: [
      { name: 'Elemental Fury', description: 'Your attacks (weapons and cantrips) deal an extra 1d8 damage of a type you choose: Cold, Fire, Lightning, or Thunder. Choose each time you deal damage.' },
    ],
    9: [
      { name: 'Wild Shape Improvement', description: 'Wild Shape temp HP increases. Wild Shape forms gain additional abilities.' },
    ],
    11: [
      { name: 'Elemental Fury Improvement', description: 'Elemental Fury damage increases to 2d8.' },
    ],
    15: [
      { name: 'Improved Wild Shape', description: 'Wild Shape becomes more powerful. Temp HP and damage increase further.' },
    ],
    18: [
      { name: 'Beast Spells', description: 'Cast spells while in Wild Shape form.' },
    ],
    20: [
      { name: 'Archdruid', description: 'Wild Shape uses are unlimited. You can ignore Verbal and Somatic components of druid spells. Ignore Material components without a cost.' },
    ],
  },

  Fighter: {
    1: [
      { name: 'Fighting Style', description: 'Choose a fighting style: Archery, Blind Fighting, Defense, Dueling, Great Weapon Fighting, Interception, Protection, Thrown Weapon Fighting, Two-Weapon Fighting, or Unarmed Fighting.' },
      { name: 'Second Wind', description: 'Bonus action to regain 1d10 + Fighter level HP. Uses = proficiency bonus per Long Rest.' },
      { name: 'Weapon Mastery', description: 'You gain the Weapon Mastery property of three weapons you are proficient with.' },
    ],
    2: [
      { name: 'Action Surge', description: 'Take one additional action on your turn. Once per Short/Long Rest. At 17th level, twice per Short/Long Rest.' },
      { name: 'Tactical Mind', description: 'When you fail an ability check, expend a use of Second Wind to add 1d10 to the roll (potentially turning failure into success). No HP regained.' },
    ],
    3: [
      { name: 'Martial Archetype', description: 'Choose your subclass (Battle Master, Champion, Eldritch Knight, or Psi Warrior).' },
    ],
    5: [
      { name: 'Extra Attack', description: 'Attack twice when you take the Attack action.' },
      { name: 'Tactical Shift', description: 'When you use Second Wind, move up to half your speed without provoking opportunity attacks.' },
    ],
    9: [
      { name: 'Indomitable', description: 'Reroll a failed saving throw. Once per Long Rest. At 13th (twice), 17th (three times).' },
      { name: 'Tactical Master', description: 'When you attack with a weapon with a Mastery property, you can replace that Mastery with Push, Sap, or Slow.' },
    ],
    11: [
      { name: 'Extra Attack (2)', description: 'Attack three times when you take the Attack action.' },
    ],
    13: [
      { name: 'Indomitable (2 uses)', description: 'Reroll a failed saving throw. Two uses per Long Rest.' },
      { name: 'Studied Attacks', description: 'When you miss an attack, you have advantage on your next attack against the same target before end of your next turn.' },
    ],
    17: [
      { name: 'Action Surge (2 uses)', description: 'Action Surge can be used twice per Short/Long Rest (not on the same turn).' },
      { name: 'Indomitable (3 uses)', description: 'Reroll a failed saving throw. Three uses per Long Rest.' },
    ],
    20: [
      { name: 'Extra Attack (3)', description: 'Attack four times when you take the Attack action.' },
    ],
  },

  Monk: {
    1: [
      { name: 'Martial Arts', description: 'Use DEX for unarmed/monk weapon attacks. Unarmed strike deals 1d6. Bonus action unarmed strike after attacking with a Monk weapon or unarmed strike.' },
      { name: 'Unarmored Defense', description: 'AC = 10 + DEX mod + WIS mod when not wearing armor or wielding a shield.' },
    ],
    2: [
      { name: 'Monk\'s Focus', description: 'Gain Focus Points equal to Monk level. Spend to fuel: Flurry of Blows (two bonus action unarmed strikes), Patient Defense (Dodge as bonus action + Disengage), Step of the Wind (Dash or Disengage as bonus action + jump distance doubled).', uses_total: 2, recharge: 'short_rest', scales_with_level: true },
      { name: 'Unarmored Movement', description: '+10 ft speed while not wearing armor or wielding a shield. Increases at 6th (+15), 10th (+20), 14th (+25), 18th (+30).' },
      { name: 'Uncanny Metabolism', description: 'When you roll Initiative, regain all Focus Points. Also regain one Hit Die. Once per Long Rest.' },
    ],
    3: [
      { name: 'Monastic Tradition', description: 'Choose your subclass (Warrior of Mercy, Shadow, the Elements, or the Open Hand).' },
      { name: 'Deflect Attacks', description: 'Use reaction to reduce damage from an attack by 1d10 + DEX mod + Monk level. If reduced to 0, spend 1 Focus to deflect it back (ranged attack, Martial Arts die damage).' },
    ],
    5: [
      { name: 'Extra Attack', description: 'Attack twice when you take the Attack action.' },
      { name: 'Stunning Strike', description: 'Once per turn when you hit, spend 1 Focus Point. Target makes CON save or is Stunned until start of your next turn.' },
    ],
    6: [
      { name: 'Empowered Strikes', description: 'Unarmed strikes count as magical for overcoming resistance and immunity.' },
    ],
    7: [
      { name: 'Evasion', description: 'DEX save for half damage: take none on success, half on failure.' },
    ],
    9: [
      { name: 'Acrobatic Movement', description: 'While not wearing armor or a shield, you gain a Climb speed and Swim speed equal to your Speed.' },
    ],
    10: [
      { name: 'Heightened Focus', description: 'Flurry of Blows, Patient Defense, and Step of the Wind gain enhanced options when you spend 2 Focus Points instead of 1.' },
      { name: 'Self-Restoration', description: 'At the end of each of your turns, if you have the Charmed, Frightened, or Poisoned condition, that condition ends.' },
    ],
    13: [
      { name: 'Deflect Energy', description: 'Deflect Attacks now works against any damage type, not just from attacks.' },
      { name: 'Disciplined Survivor', description: 'Proficiency in all saving throws. Spend 1 Focus Point to reroll a failed save (must use new result).' },
    ],
    14: [
      { name: 'Martial Arts (d10)', description: 'Martial Arts die increases to d10.' },
    ],
    15: [
      { name: 'Perfect Focus', description: 'When you roll Initiative and have fewer than 4 Focus Points, you are set to 4 Focus Points.' },
    ],
    17: [
      { name: 'Martial Arts (d12)', description: 'Martial Arts die increases to d12.' },
    ],
    18: [
      { name: 'Superior Defense', description: 'At the start of your turn, if you have no temp HP, gain temp HP equal to your Martial Arts die + WIS mod.' },
    ],
    20: [
      { name: 'Body and Mind', description: '+4 to DEX and WIS. Maximum for both increases to 25.' },
    ],
  },

  Paladin: {
    1: [
      { name: 'Lay on Hands', description: 'A pool of healing equal to Paladin level x 5. Touch to restore HP or remove one Poisoned/Diseased condition (5 HP per effect).' },
      { name: 'Spellcasting', description: 'Cast paladin spells using CHA. Prepare spells from the Divine spell list.' },
      { name: 'Weapon Mastery', description: 'You gain the Weapon Mastery property of two weapons you are proficient with.' },
    ],
    2: [
      { name: 'Divine Smite', description: 'When you hit with a melee weapon or Unarmed Strike, spend a spell slot to deal extra Radiant damage: 2d8 for 1st-level slot, +1d8 per slot level above 1st (max 5d8). +1d8 vs. Undead or Fiend.' },
      { name: 'Fighting Style', description: 'Choose a fighting style.' },
    ],
    3: [
      { name: 'Sacred Oath', description: 'Choose your subclass oath (Devotion, Glory, the Ancients, or Vengeance).' },
      { name: 'Channel Divinity', description: 'Gain Channel Divinity uses (proficiency bonus times per Long Rest). Each oath grants unique options.' },
    ],
    5: [
      { name: 'Extra Attack', description: 'Attack twice when you take the Attack action.' },
      { name: 'Faithful Steed', description: 'Cast Find Steed without a spell slot. The steed gains additional benefits and has an Intelligence of at least 6.' },
    ],
    6: [
      { name: 'Aura of Protection', description: 'You and friendly creatures within 10 ft add your CHA modifier (min +1) to saving throws. Range increases to 30 ft at 18th level.' },
    ],
    9: [
      { name: 'Abjure Foes', description: 'As a Magic action, frighten creatures within 60 ft (WIS save). Frightened targets also have speed 0. Proficiency bonus uses per Long Rest.' },
    ],
    10: [
      { name: 'Aura of Courage', description: 'You and friendly creatures within 10 ft cannot be Frightened while you are conscious. Range increases to 30 ft at 18th level.' },
    ],
    11: [
      { name: 'Radiant Strikes', description: 'Your weapon attacks deal an extra 1d8 Radiant damage.' },
    ],
    14: [
      { name: 'Restoring Touch', description: 'Spend 5 HP from Lay on Hands to remove one condition: Blinded, Charmed, Deafened, Frightened, Paralyzed, or Stunned.' },
    ],
    18: [
      { name: 'Aura Expansion', description: 'Aura of Protection and Aura of Courage ranges increase to 30 ft.' },
    ],
    20: [
      { name: 'Sacred Oath Capstone', description: 'Your Sacred Oath grants its ultimate 20th-level feature.' },
    ],
  },

  Ranger: {
    1: [
      { name: 'Spellcasting', description: 'Cast ranger spells using WIS. You know spells (no preparation needed) from the Primal spell list.' },
      { name: 'Favored Enemy', description: 'You always have Hunter\'s Mark prepared. Cast it prof bonus times without a spell slot per Long Rest. It does not require Concentration for you.' },
      { name: 'Weapon Mastery', description: 'You gain the Weapon Mastery property of two weapons you are proficient with.' },
    ],
    2: [
      { name: 'Deft Explorer', description: 'Choose Expertise in one skill. Gain two languages. Your Speed increases by 5 ft.' },
      { name: 'Fighting Style', description: 'Choose a fighting style.' },
    ],
    3: [
      { name: 'Ranger Archetype', description: 'Choose your subclass (Beast Master, Fey Wanderer, Gloom Stalker, or Hunter).' },
    ],
    5: [
      { name: 'Extra Attack', description: 'Attack twice when you take the Attack action.' },
      { name: 'Roving', description: '+10 ft speed. You gain a Climb speed and Swim speed equal to your Speed.' },
    ],
    7: [
      { name: 'Conjure Barrage', description: 'You always have Conjure Barrage prepared.' },
    ],
    9: [
      { name: 'Deft Explorer Improvement', description: 'Choose Expertise in another skill.' },
      { name: 'Conjure Barrage Improvement', description: 'Conjure Barrage now deals extra damage equal to your WIS modifier.' },
    ],
    10: [
      { name: 'Tireless', description: "As a bonus action, gain temp HP = 1d8 + WIS mod. Proficiency bonus uses per Long Rest. On a Short Rest, reduce Exhaustion by 1." },
    ],
    13: [
      { name: 'Relentless Hunter', description: "Hunter's Mark damage increases to 1d10." },
    ],
    14: [
      { name: "Nature's Veil", description: 'As a bonus action, become Invisible until the start of your next turn. Proficiency bonus uses per Long Rest.' },
    ],
    17: [
      { name: 'Deft Explorer Improvement', description: 'Choose Expertise in a third skill.' },
      { name: "Relentless Hunter Improvement", description: "Hunter's Mark now also gives you advantage on attacks against the marked target." },
    ],
    18: [
      { name: 'Feral Senses', description: 'You gain Blindsight 30 ft.' },
    ],
    20: [
      { name: 'Foe Slayer', description: 'Once per turn, add WIS modifier to the attack or damage roll against your Hunter\'s Mark target. You always have Conjure Woodland Beings prepared.' },
    ],
  },

  Rogue: {
    1: [
      { name: 'Expertise', description: 'Choose two skill proficiencies or one skill and Thieves\' Tools. Your proficiency bonus is doubled for those.' },
      { name: 'Sneak Attack', description: 'Once per turn, deal extra damage when you have advantage or an ally is within 5 ft of the target. Damage: 1d6 at 1st, increasing by 1d6 every two levels.' },
      { name: 'Thieves\' Cant', description: 'You know Thieves\' Cant, a secret mix of dialect, jargon, and code.' },
      { name: 'Weapon Mastery', description: 'You gain the Weapon Mastery property of two weapons you are proficient with.' },
    ],
    2: [
      { name: 'Cunning Action', description: 'Bonus action to Dash, Disengage, or Hide.' },
    ],
    3: [
      { name: 'Roguish Archetype', description: 'Choose your subclass (Arcane Trickster, Assassin, Soulknife, or Thief).' },
      { name: 'Steady Aim', description: 'As a bonus action (if you have not moved), give yourself advantage on your next attack roll this turn. Your speed becomes 0 until end of turn.' },
    ],
    5: [
      { name: 'Cunning Strike', description: 'When you deal Sneak Attack damage, you can forgo some Sneak Attack dice to inflict additional effects: Disarm (1d6), Poison (1d6, target saves or Poisoned), Trip (1d6, target saves or knocked Prone), Withdraw (1d6, Disengage).' },
      { name: 'Uncanny Dodge', description: 'Use reaction to halve damage from an attack you can see.' },
    ],
    7: [
      { name: 'Evasion', description: 'DEX save for half damage: take none on success, half on failure.' },
      { name: 'Reliable Talent', description: 'Treat any d20 roll of 9 or lower as a 10 on ability checks using skills you are proficient with.' },
    ],
    9: [
      { name: 'Expertise', description: 'Choose two more proficiencies for Expertise.' },
    ],
    11: [
      { name: 'Improved Cunning Strike', description: 'New Cunning Strike options: Daze (3d6, target cannot take reactions), Knock Out (6d6, target falls Unconscious for 1 minute if it fails CON save), Obscure (3d6, cloud of smoke in 10-ft cube).' },
    ],
    13: [
      { name: 'Subtle Strikes', description: 'When an ally is within 5 ft of your target, you don\'t need advantage to use Sneak Attack (this is already true in 2014 rules, but now the ally only needs to be within 5 ft and not Incapacitated).' },
      { name: 'Devious Strikes', description: 'New Cunning Strike options available at this level.' },
    ],
    14: [
      { name: 'Blindsense', description: 'If you can hear, you know the location of any hidden or invisible creature within 10 ft of you.' },
    ],
    15: [
      { name: 'Slippery Mind', description: 'Proficiency in WIS and CHA saving throws.' },
    ],
    18: [
      { name: 'Elusive', description: 'No attack roll has advantage against you while you are not Incapacitated.' },
    ],
    20: [
      { name: 'Stroke of Luck', description: 'If an attack misses, turn it into a hit. Or if you fail an ability check, treat the d20 as a 20. Once per Short or Long Rest.' },
    ],
  },

  Sorcerer: {
    1: [
      { name: 'Spellcasting', description: 'Cast sorcerer spells using CHA. You know spells from the Arcane spell list.' },
      { name: 'Sorcerous Origin', description: 'Choose your subclass at 1st level (Aberrant, Clockwork, Draconic, or Wild Magic).' },
      { name: 'Innate Sorcery', description: 'As a bonus action, tap into your magic for 1 minute: advantage on Sorcerer spell attack rolls, +1 to Sorcerer spell save DC. Prof bonus uses per Long Rest.' },
    ],
    2: [
      { name: 'Font of Magic', description: 'Gain Sorcery Points = Sorcerer level. Convert between Sorcery Points and spell slots. Spend points to fuel Metamagic.', uses_total: 2, recharge: 'long_rest', scales_with_level: true },
      { name: 'Metamagic', description: 'Choose two Metamagic options: Careful, Distant, Empowered, Extended, Heightened, Quickened, Seeking, Subtle, Transmuted, or Twinned.' },
    ],
    3: [
      { name: 'Sorcerous Origin Feature', description: 'Your subclass grants an additional feature.' },
    ],
    5: [
      { name: 'Sorcerous Restoration', description: 'When you finish a Short Rest, regain Sorcery Points equal to half your Sorcerer level (rounded down).' },
    ],
    7: [
      { name: 'Sorcery Incarnate', description: 'While Innate Sorcery is active, you can use two Metamagic options on the same spell (instead of one). When you use Innate Sorcery, you can spend 2 Sorcery Points to extend its duration by 1 minute.' },
    ],
    10: [
      { name: 'Metamagic', description: 'Choose one additional Metamagic option.' },
    ],
    17: [
      { name: 'Metamagic', description: 'Choose one additional Metamagic option.' },
    ],
    20: [
      { name: 'Arcane Apotheosis', description: 'While Innate Sorcery is active, when you use a Metamagic option that costs Sorcery Points, you can use it without spending those points.' },
    ],
  },

  Warlock: {
    1: [
      { name: 'Otherworldly Patron', description: 'Choose your subclass patron at 1st level (Archfey, Celestial, Fiend, or Great Old One).' },
      { name: 'Pact Magic', description: 'Cast warlock spells using CHA. Spell slots recover on a Short or Long Rest. Slots are always at the highest level available.' },
      { name: 'Eldritch Invocations', description: 'Choose one Eldritch Invocation. Gain more at higher levels (3rd, 5th, 7th, 9th, 12th, 15th, 18th).' },
    ],
    2: [
      { name: 'Magical Cunning', description: 'If all your Pact Magic slots are expended, you can perform a 1-minute ritual to regain half (rounded up). Once per Long Rest.' },
    ],
    3: [
      { name: 'Pact Boon', description: 'Choose Pact of the Blade, Chain, or Tome. Each grants unique benefits and unlocks specific invocations.' },
    ],
    5: [
      { name: 'Eldritch Invocations', description: 'Learn one additional invocation.' },
    ],
    7: [
      { name: 'Eldritch Invocations', description: 'Learn one additional invocation.' },
    ],
    9: [
      { name: 'Contact Patron', description: 'Cast Contact Other Plane once per Long Rest without a spell slot, specifically contacting your patron. You automatically succeed on the INT save.' },
      { name: 'Eldritch Invocations', description: 'Learn one additional invocation.' },
    ],
    11: [
      { name: 'Mystic Arcanum (6th)', description: 'Choose a 6th-level Warlock spell. Cast once per Long Rest without a spell slot.' },
    ],
    12: [
      { name: 'Eldritch Invocations', description: 'Learn one additional invocation.' },
    ],
    13: [
      { name: 'Mystic Arcanum (7th)', description: 'Choose a 7th-level Warlock spell. Cast once per Long Rest.' },
    ],
    15: [
      { name: 'Mystic Arcanum (8th)', description: 'Choose an 8th-level Warlock spell. Cast once per Long Rest.' },
      { name: 'Eldritch Invocations', description: 'Learn one additional invocation.' },
    ],
    17: [
      { name: 'Mystic Arcanum (9th)', description: 'Choose a 9th-level Warlock spell. Cast once per Long Rest.' },
    ],
    18: [
      { name: 'Eldritch Invocations', description: 'Learn one additional invocation.' },
    ],
    20: [
      { name: 'Eldritch Master', description: 'When you use Magical Cunning, you regain all Pact Magic slots instead of half. You can also replace one of your Mystic Arcanum spells.' },
    ],
  },

  Wizard: {
    1: [
      { name: 'Spellcasting', description: 'Cast wizard spells using INT. You have a spellbook and prepare spells from the Arcane spell list.' },
      { name: 'Ritual Adept', description: 'You can cast any Wizard spell as a Ritual if it has the Ritual tag, even if not prepared (must be in your spellbook).' },
      { name: 'Arcane Recovery', description: 'Once per Long Rest during a Short Rest, recover expended spell slots with a combined level equal to no more than half your Wizard level (rounded up). No slots of 6th level or higher.' },
    ],
    2: [
      { name: 'Scholar', description: 'Choose Expertise in Arcana, History, Investigation, Medicine, Nature, or Religion.' },
    ],
    3: [
      { name: 'Arcane Tradition', description: 'Choose your subclass school (Abjurer, Diviner, Evoker, or Illusionist).' },
    ],
    5: [
      { name: 'Memorize Spell', description: 'When you finish a Short Rest, you can change one prepared spell for another in your spellbook.' },
    ],
    18: [
      { name: 'Spell Mastery', description: 'Choose a 1st-level and a 2nd-level Wizard spell in your spellbook. Cast them at their base level without a spell slot while prepared.' },
    ],
    20: [
      { name: 'Signature Spells', description: 'Choose two 3rd-level Wizard spells in your spellbook. Always prepared, do not count against prepared limit. Cast each once at 3rd level without a spell slot per Long Rest.' },
    ],
  },
};

const ruleset5e2024 = {
  id: '5e-2024',
  name: "D&D 5th Edition (2024 PHB)",
  shortName: '5e 2024',
  ancestryLabel: 'Species',
  ancestryPluralLabel: 'Species',

  PROFICIENCY_BONUS,
  ABILITIES,
  SKILLS,
  RACES,
  CLASSES,
  SPELL_SLOTS,
  CONDITIONS,
  EXHAUSTION_LEVELS,
  FEATS,
  POINT_BUY_COSTS,
  CLASS_FEATURES,
  ASI_LEVELS,
  BACKGROUNDS,
};

export default ruleset5e2024;
