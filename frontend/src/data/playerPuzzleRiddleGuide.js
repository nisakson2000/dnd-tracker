/**
 * playerPuzzleRiddleGuide.js
 * Player Mode: Common D&D puzzles, riddles, and approaches for solving them
 * Pure JS — no React dependencies.
 */

export const COMMON_PUZZLE_TYPES = [
  {
    type: 'Riddle Door',
    description: 'A door or guardian asks a riddle. Correct answer opens the way.',
    approach: 'Listen carefully. Think literally AND metaphorically. Classic answers: time, shadow, echo, fire.',
    spells: ['Divination', 'Augury', 'Commune', 'Legend Lore'],
    tip: 'If stuck, ask the DM if an Intelligence check can give a hint.',
  },
  {
    type: 'Tile/Floor Puzzle',
    description: 'Step on correct tiles in order. Wrong tiles trigger traps.',
    approach: 'Look for patterns on walls, ceilings. Check for clues. Test with Mage Hand or thrown objects.',
    spells: ['Mage Hand', 'Fly', 'Misty Step', 'Dimension Door'],
    tip: 'Fly or teleport to bypass if allowed. Mage Hand to test tiles safely.',
  },
  {
    type: 'Lever/Switch Puzzle',
    description: 'Multiple levers/switches in specific combination opens the way.',
    approach: 'Systematic trial: flip one at a time, note effects. Look for labels or nearby clues.',
    spells: ['Mage Hand', 'Detect Magic', 'Identify'],
    tip: 'Have someone with high INT do Investigation checks on each lever.',
  },
  {
    type: 'Rotating Room',
    description: 'Room or sections rotate. Align exits/symbols correctly.',
    approach: 'Map the room. Track which sections move. Look for a control mechanism.',
    spells: ['Detect Magic', 'Arcane Eye', 'Clairvoyance'],
    tip: 'Draw it out on paper. Tracking rotations mentally is hard.',
  },
  {
    type: 'Mirror/Light Puzzle',
    description: 'Redirect beams of light using mirrors to hit a target.',
    approach: 'Angle of incidence = angle of reflection. Move mirrors systematically.',
    spells: ['Light', 'Dancing Lights', 'Prestidigitation'],
    tip: 'If a mirror is missing, a polished shield can work.',
  },
  {
    type: 'Symbol Matching',
    description: 'Match symbols, runes, or colors in correct order/pattern.',
    approach: 'Check walls, books, and nearby rooms for the key. Often tied to lore.',
    spells: ['Comprehend Languages', 'Detect Magic', 'Identify'],
    tip: 'History or Religion checks may reveal the meaning of symbols.',
  },
  {
    type: 'Weight/Pressure Puzzle',
    description: 'Correct weight on pressure plates. Too much or too little triggers trap.',
    approach: 'Use items to match weight. Sand, coins, rocks. Indiana Jones style.',
    spells: ['Mage Hand (10 lb limit)', 'Unseen Servant (can carry items)', 'Telekinesis'],
    tip: 'Ask DM how much items weigh. Creative solutions welcome.',
  },
  {
    type: 'Water Level Puzzle',
    description: 'Raise or lower water to access areas.',
    approach: 'Find valves, plugs, or channels. Control water flow.',
    spells: ['Control Water', 'Shape Water', 'Create or Destroy Water', 'Wall of Ice'],
    tip: 'Druids and water-themed casters trivialize these.',
  },
];

export const CLASSIC_RIDDLES = [
  { riddle: 'What has keys but no locks?', answer: 'A piano.' },
  { riddle: 'I have cities but no houses, forests but no trees, water but no fish. What am I?', answer: 'A map.' },
  { riddle: 'The more you take, the more you leave behind. What am I?', answer: 'Footsteps.' },
  { riddle: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind.', answer: 'An echo.' },
  { riddle: 'What can run but never walks, has a mouth but never talks?', answer: 'A river.' },
  { riddle: 'I am not alive, but I grow. I don\'t have lungs, but I need air. What am I?', answer: 'Fire.' },
  { riddle: 'What has a head and a tail but no body?', answer: 'A coin.' },
  { riddle: 'I fly without wings. I cry without eyes. Wherever I go, darkness follows me.', answer: 'A cloud.' },
];

export const PUZZLE_SOLVING_SKILLS = [
  { skill: 'Investigation (INT)', use: 'Examine mechanisms, find hidden clues, deduce patterns.', rating: 'S+' },
  { skill: 'Perception (WIS)', use: 'Notice hidden levers, faint markings, environmental clues.', rating: 'S' },
  { skill: 'Arcana (INT)', use: 'Identify magical mechanisms, rune meanings, arcane patterns.', rating: 'A+' },
  { skill: 'History (INT)', use: 'Recognize historical references, ancient languages, cultural clues.', rating: 'A' },
  { skill: 'Religion (INT)', use: 'Identify divine symbols, religious iconography, holy/unholy patterns.', rating: 'A' },
  { skill: 'Thieves\' Tools', use: 'Bypass mechanical puzzles, disable trap triggers, pick locks.', rating: 'S' },
];

export const PUZZLE_TIPS = [
  'Always check for Detect Magic on puzzle elements. Many have magical components.',
  'Investigation > Perception for puzzles. Perception finds clues; Investigation solves them.',
  'Mage Hand: test traps, push buttons, place objects from safety.',
  'When stuck: ask the DM if ability checks can provide hints. Most DMs allow this.',
  'Don\'t overthink. DMs design puzzles to be solved. The answer is usually simpler than you think.',
  'Talk it out as a party. Multiple perspectives solve puzzles faster.',
  'Fly, Dimension Door, and Misty Step can bypass many physical puzzles.',
  'Draw puzzles on paper. Especially for rotation, tile, and symbol matching puzzles.',
  'Brute force is sometimes valid. 8 levers = 256 combinations. Systematic trial works.',
  'If the puzzle is annoying the whole table, the DM will likely give more hints.',
];
