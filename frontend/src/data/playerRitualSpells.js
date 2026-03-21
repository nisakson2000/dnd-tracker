/**
 * playerRitualSpells.js
 * Player Mode: Ritual casting reference
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// RITUAL CASTING RULES
// ---------------------------------------------------------------------------

export const RITUAL_RULES = {
  description: 'Cast a spell with the "Ritual" tag without expending a spell slot.',
  extraTime: '+10 minutes added to the normal casting time.',
  restrictions: [
    'The spell must have the "Ritual" tag.',
    'You must have the spell prepared (or in your spellbook for Wizards).',
    'Cannot be cast at a higher level as a ritual.',
  ],
  classDifferences: {
    Wizard: 'Can ritual cast any spell in their spellbook with the Ritual tag (does not need to be prepared).',
    Cleric: 'Must have the ritual spell prepared.',
    Druid: 'Must have the ritual spell prepared.',
    Bard: 'Must know the ritual spell.',
    'Ritual Caster (feat)': 'Can ritual cast from a separate ritual book. Can add rituals found as scrolls.',
  },
};

// ---------------------------------------------------------------------------
// RITUAL SPELLS LIST
// ---------------------------------------------------------------------------

export const RITUAL_SPELLS = [
  // Level 1
  { name: 'Alarm', level: 1, classes: ['Ranger', 'Wizard'], description: 'Ward an area for 8 hours. Alert (mental or audible) when triggered.' },
  { name: 'Comprehend Languages', level: 1, classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard'], description: 'Understand any spoken language for 1 hour.' },
  { name: 'Detect Magic', level: 1, classes: ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Wizard'], description: 'Sense magic within 30 feet for 10 minutes.' },
  { name: 'Detect Poison and Disease', level: 1, classes: ['Cleric', 'Druid', 'Paladin', 'Ranger'], description: 'Sense poisons, diseases, and poisonous creatures within 30 feet.' },
  { name: 'Find Familiar', level: 1, classes: ['Wizard'], description: 'Summon a spirit in animal form as your familiar.' },
  { name: 'Identify', level: 1, classes: ['Bard', 'Wizard'], description: 'Learn properties of one magic item or magical effect.' },
  { name: 'Illusory Script', level: 1, classes: ['Bard', 'Warlock', 'Wizard'], description: 'Write a hidden message readable only by designated creatures.' },
  { name: 'Purify Food and Drink', level: 1, classes: ['Cleric', 'Druid', 'Paladin'], description: 'Remove poison and disease from food and water.' },
  { name: 'Speak with Animals', level: 1, classes: ['Bard', 'Druid', 'Ranger'], description: 'Communicate with beasts for 10 minutes.' },
  { name: 'Unseen Servant', level: 1, classes: ['Bard', 'Warlock', 'Wizard'], description: 'Create an invisible force for simple tasks for 1 hour.' },
  { name: 'Ceremony', level: 1, classes: ['Cleric', 'Paladin'], description: 'Perform religious ceremonies (bless water, wedding, etc.).' },

  // Level 2
  { name: 'Augury', level: 2, classes: ['Cleric'], description: 'Receive an omen about a specific action within 30 minutes.' },
  { name: 'Beast Sense', level: 2, classes: ['Druid', 'Ranger'], description: 'See/hear through a willing beast\'s senses for 1 hour.' },
  { name: 'Gentle Repose', level: 2, classes: ['Cleric', 'Wizard'], description: 'Preserve a corpse for 10 days. Extends resurrection window.' },
  { name: 'Magic Mouth', level: 2, classes: ['Bard', 'Wizard'], description: 'Implant a message in an object, triggered by conditions.' },
  { name: 'Silence', level: 2, classes: ['Bard', 'Cleric', 'Ranger'], description: '20ft sphere of silence for 10 minutes.' },
  { name: 'Skywrite', level: 2, classes: ['Bard', 'Druid', 'Wizard'], description: 'Write up to 10 words in the sky for 1 hour.' },

  // Level 3
  { name: 'Feign Death', level: 3, classes: ['Bard', 'Cleric', 'Druid', 'Wizard'], description: 'Target appears dead and gains resistance to non-psychic damage.' },
  { name: 'Leomund\'s Tiny Hut', level: 3, classes: ['Bard', 'Wizard'], description: 'Create a dome shelter for 8 hours (up to 9 creatures).' },
  { name: 'Meld into Stone', level: 3, classes: ['Cleric', 'Druid'], description: 'Step into stone for 8 hours.' },
  { name: 'Phantom Steed', level: 3, classes: ['Wizard'], description: 'Create a quasi-real horse (speed 100ft) for 1 hour.' },
  { name: 'Water Breathing', level: 3, classes: ['Druid', 'Ranger', 'Sorcerer', 'Wizard'], description: 'Up to 10 creatures can breathe underwater for 24 hours.' },
  { name: 'Water Walk', level: 3, classes: ['Cleric', 'Druid', 'Ranger', 'Sorcerer'], description: 'Up to 10 creatures can walk on water for 1 hour.' },

  // Level 4+
  { name: 'Divination', level: 4, classes: ['Cleric'], description: 'Ask your deity a question about a specific goal or event.' },
  { name: 'Commune', level: 5, classes: ['Cleric'], description: 'Ask your deity 3 yes/no questions.' },
  { name: 'Commune with Nature', level: 5, classes: ['Druid', 'Ranger'], description: 'Learn about the surrounding territory (3 miles outdoors, 300 feet underground).' },
  { name: 'Contact Other Plane', level: 5, classes: ['Warlock', 'Wizard'], description: 'Mentally contact a demigod or other extraplanar entity. Risk of insanity.' },
  { name: 'Rary\'s Telepathic Bond', level: 5, classes: ['Wizard'], description: 'Up to 8 creatures share telepathy for 1 hour.' },
  { name: 'Forbiddance', level: 6, classes: ['Cleric'], description: 'Ward an area against planar travel and damage specific creature types.' },
];

/**
 * Get ritual spells available to a specific class.
 */
export function getRitualSpellsForClass(className) {
  return RITUAL_SPELLS.filter(spell =>
    spell.classes.some(c => c.toLowerCase() === (className || '').toLowerCase())
  );
}
