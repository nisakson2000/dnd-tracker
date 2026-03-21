/**
 * playerCharacterCreationWalkthroughGuide.js
 * Player Mode: Step-by-step character creation — from concept to ready-to-play
 * Pure JS — no React dependencies.
 */

export const CHARACTER_CREATION_STEPS = [
  {
    step: 1,
    title: 'Choose a Concept',
    detail: 'Think about WHO your character is before stats. A grizzled veteran? A curious scholar? A charming scoundrel?',
    tips: [
      'Start with a personality, not a build.',
      'Consider: What motivates them? What do they fear? What do they want?',
      'Talk to your DM about the campaign setting. A pirate campaign needs different characters than dungeon crawling.',
      'Consider party composition — fill a role no one else is covering.',
    ],
  },
  {
    step: 2,
    title: 'Choose a Race',
    detail: 'Race determines size, speed, languages, and racial features.',
    tips: [
      'Tasha\'s rules: put +2/+1 in any stats. Race choice is about features, not stat bonuses.',
      'Darkvision is very common and very useful. Humans and Halflings lack it (unless variant).',
      'Small races (Halfling, Gnome): can\'t use Heavy weapons. Plan accordingly.',
      'Custom Lineage (Tasha\'s): +2 to one stat, a feat, darkvision or skill. Best for optimization.',
      'Variant Human: +1/+1, a feat, a skill. Best feat-hungry builds.',
    ],
  },
  {
    step: 3,
    title: 'Choose a Class',
    detail: 'Class defines your core abilities, hit dice, proficiencies, and playstyle.',
    tips: [
      'New players: Fighter, Barbarian, or Rogue are simplest to learn.',
      'Want spells? Full casters (Wizard, Cleric, Druid, Sorcerer, Bard) get the most.',
      'Want martial combat? Fighter, Barbarian, Paladin, Ranger.',
      'Want a mix? Paladin, Ranger, Artificer, or Eldritch Knight Fighter.',
      'Check class prerequisites if you plan to multiclass later.',
    ],
  },
  {
    step: 4,
    title: 'Determine Ability Scores',
    detail: 'Use Point Buy (27 points), Standard Array (15/14/13/12/10/8), or roll 4d6 drop lowest.',
    tips: [
      'Point Buy is most balanced. Standard Array is simplest.',
      'Rolling can create very strong or very weak characters. Ask your DM.',
      'Max your primary stat. 15 + 2 racial = 17 → round up at L4 with ASI or half-feat.',
      'Never dump CON below 10. You need HP.',
      'INT is safest dump stat for most classes.',
    ],
  },
  {
    step: 5,
    title: 'Choose a Background',
    detail: 'Background gives 2 skill proficiencies, tool proficiencies or languages, and starting equipment.',
    tips: [
      'Acolyte: Shelter of the Faithful (free temple lodging). Good for Clerics.',
      'Criminal: Thieves\' Tools + Stealth + Deception. Good for Rogues.',
      'Sage: 2 languages + Arcana + History. Good for Wizards.',
      'Soldier: Athletics + Intimidation. Good for Fighters.',
      'Custom Background: choose any 2 skills, 2 tools/languages, and a feature. Best option if DM allows.',
    ],
  },
  {
    step: 6,
    title: 'Choose Skills',
    detail: 'Class gives you a selection of skills. Choose based on your role and party needs.',
    tips: [
      'Perception is the most-rolled skill. Take it if you can.',
      'Party needs: at least one person with Perception, Investigation, Persuasion/Deception, Stealth.',
      'Don\'t overlap too much with other party members.',
      'Athletics: grapple/shove. Acrobatics: escape grapple. Both useful.',
      'Survival and Nature are rarely used. Only take if campaign demands it.',
    ],
  },
  {
    step: 7,
    title: 'Choose Equipment',
    detail: 'Class and background give starting equipment. Or roll for gold and buy.',
    tips: [
      'Starting equipment is usually better than rolling gold.',
      'Buy: rope (50ft), torch, rations, waterskin, component pouch/focus.',
      'Martial classes: get the best armor you can afford.',
      'Spellcasters: component pouch OR arcane focus. Either works.',
      'Buy a healer\'s kit if no one has Healing Word.',
    ],
  },
  {
    step: 8,
    title: 'Flesh Out Personality',
    detail: 'Personality traits, ideals, bonds, flaws. These drive roleplay.',
    tips: [
      'One personality trait is enough to start. Add more as you play.',
      'A good flaw makes the character interesting. Perfect characters are boring.',
      'Bond = why you adventure. This should tie into the campaign.',
      'Ideal = what you believe in. Helps guide decisions.',
      'You can change these as your character grows.',
    ],
  },
  {
    step: 9,
    title: 'Calculate Derived Stats',
    detail: 'AC, HP, initiative, passive Perception, spell save DC, spell attack bonus.',
    formulas: {
      hp: 'Hit die max + CON mod at L1. Each level after: roll or take average + CON mod.',
      ac: 'Depends on armor. Light: 11-12+DEX. Medium: 13-15+DEX(max 2). Heavy: 14-18.',
      initiative: 'DEX modifier (+ any bonuses from features).',
      passivePerception: '10 + WIS mod + proficiency (if proficient in Perception).',
      spellSaveDC: '8 + proficiency + spellcasting ability modifier.',
      spellAttack: 'Proficiency + spellcasting ability modifier.',
    },
  },
  {
    step: 10,
    title: 'Write a Brief Backstory',
    detail: '2-3 paragraphs max. Where they came from, why they adventure, one hook for the DM.',
    tips: [
      'Keep it SHORT. 2-3 paragraphs, not 10 pages.',
      'Leave room for the DM to add connections to the campaign.',
      'Include one NPC (mentor, rival, family) the DM can use.',
      'Don\'t make yourself secretly royalty or the chosen one.',
      'Your backstory should explain your class and proficiencies.',
    ],
  },
];

export const COMMON_MISTAKES = [
  { mistake: 'Dumping CON', fix: 'Never go below 10 CON. Even casters need HP to survive.' },
  { mistake: 'Ignoring party composition', fix: 'Check what roles are covered. No healer = bad time.' },
  { mistake: 'Making a lone wolf', fix: 'D&D is cooperative. Make a character who WANTS to be in a group.' },
  { mistake: 'Overly complex backstory', fix: 'Keep it simple. Your story develops during play, not before it.' },
  { mistake: 'Min-maxing without understanding the class', fix: 'Learn how the class plays before optimizing. Fun > numbers.' },
  { mistake: 'Choosing race purely for stats', fix: 'Tasha\'s lets you put stats anywhere. Pick the race you WANT to play.' },
  { mistake: 'Not knowing your abilities', fix: 'Read ALL your class features, racial features, and spells before Session 1.' },
  { mistake: 'Tragic backstory syndrome', fix: 'Not every character needs dead parents. Happy characters are fine.' },
];

export const QUICK_BUILD_TEMPLATES = [
  { name: 'Classic Tank', race: 'Variant Human (Sentinel)', class: 'Fighter (Champion)', stats: 'STR 16, CON 16, DEX 12', gear: 'Chain mail + Shield + Longsword', note: 'Simple, effective, hard to kill.' },
  { name: 'Blaster Caster', race: 'Half-Elf', class: 'Sorcerer (Draconic)', stats: 'CHA 16, CON 14, DEX 14', gear: 'Component pouch + Light crossbow', note: 'Fireball + Metamagic. Straightforward.' },
  { name: 'Sneaky Rogue', race: 'Lightfoot Halfling', class: 'Rogue (Thief)', stats: 'DEX 17, CON 14, CHA 12', gear: 'Leather + 2 shortswords + Thieves\' tools', note: 'Hide, sneak, stab. Classic.' },
  { name: 'Holy Warrior', race: 'Dragonborn', class: 'Paladin (Devotion)', stats: 'STR 16, CHA 14, CON 14', gear: 'Chain mail + Shield + Longsword', note: 'Smite everything. Heal when needed.' },
  { name: 'Nature Caster', race: 'Wood Elf', class: 'Druid (Circle of the Land)', stats: 'WIS 16, CON 14, DEX 14', gear: 'Leather + Shield + Quarterstaff', note: 'Control spells + Wild Shape scouting.' },
];
