/**
 * playerPuzzleEncounters.js
 * Player Mode: Common puzzle types and how to approach them as a player
 * Pure JS — no React dependencies.
 */

export const PUZZLE_APPROACH = {
  general: [
    'Look at everything in the room. DMs describe puzzle elements deliberately.',
    'Take notes. Write down inscriptions, symbols, and patterns.',
    'Ask the DM to repeat descriptions. Details matter.',
    'Try the obvious solution first. DMs often design for the expected approach.',
    'If stuck for 10+ minutes, ask for an ability check (Investigation, Arcana, History).',
    'Don\'t overthink it. The answer is usually simpler than you think.',
  ],
};

export const COMMON_PUZZLE_TYPES = [
  {
    type: 'Riddle',
    approach: 'Listen carefully to every word. Riddles are often about wordplay, not literal meaning.',
    spellHelp: 'Comprehend Languages (if riddle is in another language). Legend Lore for ancient riddles.',
    tip: 'If the answer is an object, look around the room for it.',
  },
  {
    type: 'Pressure Plate / Sequence',
    approach: 'Step on plates in specific order. Look for clues (symbols, paintings, music notes).',
    spellHelp: 'Mage Hand to press plates remotely. Fly to avoid the floor entirely.',
    tip: 'Wrong order usually triggers traps. Test with objects first.',
  },
  {
    type: 'Lever/Switch Combination',
    approach: 'Some combination of levers opens the door. Try systematic approaches (binary counting).',
    spellHelp: 'Detect Magic to find which levers are magical. Knock to bypass entirely.',
    tip: 'Pull all up, then try combinations. Note what each lever does.',
  },
  {
    type: 'Mirror/Light Puzzle',
    approach: 'Redirect light beams using mirrors. Angle mirrors to hit the target.',
    spellHelp: 'Light cantrip for extra light sources. Prestidigitation to clean dirty mirrors.',
    tip: 'Start from the target and work backward to find the path.',
  },
  {
    type: 'Color/Element Matching',
    approach: 'Match colors to elements, seasons, or compass directions. Red=fire, blue=water, etc.',
    spellHelp: 'Detect Magic to identify magical elements. Arcana check for elemental associations.',
    tip: 'Standard D&D color associations: chromatic dragon colors + elements.',
  },
  {
    type: 'Password/Phrase',
    approach: 'Find the password in nearby inscriptions, books, or NPC dialogue.',
    spellHelp: 'Comprehend Languages. Speak with Dead (ask previous visitors). Legend Lore.',
    tip: 'Passwords are often hidden in plain sight. Check everything in the room.',
  },
  {
    type: 'Teleportation Maze',
    approach: 'Map which portals lead where. Mark visited rooms with chalk.',
    spellHelp: 'Find the Path (6th level). Arcane Eye to scout ahead.',
    tip: 'Chalk and rope are your best friends. Mark everything.',
  },
  {
    type: 'Weight/Balance Puzzle',
    approach: 'Place items of correct weight on scales or platforms.',
    spellHelp: 'Unseen Servant to hold items in place. Levitate to remove your weight.',
    tip: 'Count carried items. Gold coins weigh 1/50 lb each (50 = 1 lb).',
  },
];

export const PUZZLE_BYPASSES = [
  { spell: 'Knock (2nd)', bypass: 'Opens any locked door/chest. Skips many puzzles entirely.' },
  { spell: 'Passwall (5th)', bypass: 'Walk through walls. Skip the puzzle room completely.' },
  { spell: 'Misty Step/Dimension Door', bypass: 'Teleport past barriers and locked doors.' },
  { spell: 'Stone Shape (4th)', bypass: 'Create a hole in stone walls. Bypass stone puzzles.' },
  { spell: 'Dispel Magic (3rd)', bypass: 'Remove magical puzzle elements.' },
  { spell: 'Speak with Dead (3rd)', bypass: 'Ask a dead NPC for the answer.' },
];

export const SKILL_CHECKS_FOR_PUZZLES = [
  { skill: 'Investigation', use: 'Find hidden mechanisms, read fine print, spot patterns.' },
  { skill: 'Arcana', use: 'Identify magical symbols, understand arcane mechanisms.' },
  { skill: 'History', use: 'Recall lore about ancient cultures that built the puzzle.' },
  { skill: 'Religion', use: 'Understand religious symbols and divine puzzles.' },
  { skill: 'Perception', use: 'Notice hidden clues, tiny details, subtle sounds.' },
  { skill: 'Nature', use: 'Identify natural phenomena, elemental associations.' },
];
