/**
 * playerPuzzleSolver.js
 * Player Mode: Puzzle-solving strategies and common puzzle types
 * Pure JS — no React dependencies.
 */

export const PUZZLE_TYPES = [
  { type: 'Riddle', description: 'Word-based puzzle with a specific answer.', strategies: ['Think literally AND figuratively', 'Look for double meanings', 'Consider the context of where you found it', 'Ask the DM to repeat it — write it down exactly'] },
  { type: 'Tile/Pressure Plate', description: 'Step on correct tiles in order.', strategies: ['Look for patterns on walls or ceiling', 'Use Mage Hand or thrown objects to test', 'Weight-based? Try different-sized party members', 'Investigation check on surrounding clues'] },
  { type: 'Lock/Combination', description: 'Find the correct sequence or combination.', strategies: ['Search the room thoroughly — code is usually nearby', 'Check journals, paintings, inscriptions', 'Knock spell bypasses entirely', 'Thieves\' Tools + Investigation for mechanical insight'] },
  { type: 'Light/Mirror', description: 'Redirect beams of light to targets.', strategies: ['Dancing Lights or Light cantrip to test paths', 'Polished shields work as mirrors', 'Some puzzles need colored light — use Prestidigitation', 'Track which mirrors affect which targets'] },
  { type: 'Elemental', description: 'Apply the correct element to solve.', strategies: ['Fire: torches, Fire Bolt, Alchemist\'s Fire', 'Water: Create Water, Decanter of Endless Water', 'Air: Gust, Gust of Wind, bellows', 'Earth: Mold Earth, Stoneshape, physical force'] },
  { type: 'Symbol/Rune', description: 'Arrange or activate symbols in order.', strategies: ['Arcana check to identify magical symbols', 'Religion check for divine symbols', 'History check for ancient writing', 'Copy them down — the order might matter'] },
  { type: 'Mechanical', description: 'Levers, gears, pipes to manipulate.', strategies: ['Investigation check for mechanical understanding', 'Try one lever at a time, note effects', 'Some mechanisms need simultaneous activation — split party', 'Mending cantrip if something is broken'] },
  { type: 'Social/NPC', description: 'Convince, trick, or satisfy an NPC guardian.', strategies: ['Insight check to determine what they want', 'It\'s not always a fight — sometimes the answer is kindness', 'Zone of Truth or Detect Thoughts for tricky NPCs', 'Bring offerings relevant to the guardian\'s nature'] },
];

export const PUZZLE_SPELLS = [
  { spell: 'Comprehend Languages', use: 'Read ancient inscriptions, coded messages, foreign text.' },
  { spell: 'Detect Magic', use: 'Find magical elements of the puzzle. Reveals illusions.' },
  { spell: 'Identify', use: 'Learn properties of magical puzzle components.' },
  { spell: 'Mage Hand', use: 'Safely interact with pressure plates, levers, trapped elements.' },
  { spell: 'Knock', use: 'Bypass locks entirely. Loud (audible 300ft).' },
  { spell: 'Dispel Magic', use: 'Remove magical barriers, illusions, or enchantments blocking progress.' },
  { spell: 'Stone Shape', use: 'Reshape stone puzzle elements. Create passages.' },
  { spell: 'Speak with Dead', use: 'Ask a corpse near the puzzle for the answer (5 questions).' },
  { spell: 'Legend Lore', use: 'Learn the history and purpose of the puzzle.' },
  { spell: 'Wish', use: 'Skip the puzzle entirely. Nuclear option.' },
];

export const PUZZLE_TIPS = [
  'Write everything down — the DM gave you those details for a reason.',
  'If you\'re stuck for 15+ minutes, ask the DM for an Intelligence check for a hint.',
  'Try the obvious answer first. DMs often make puzzles easier than players think.',
  'Collaborate out loud. Someone else might see what you\'re missing.',
  'Think about what WOULDN\'T work. Process of elimination.',
  'Check if there\'s a non-puzzle solution (break it, bypass it, fly over it).',
  'Re-read the room description. Clues are often in the flavor text.',
  'Don\'t overthink it. The answer is usually simpler than you expect.',
];

export function getPuzzleStrategy(type) {
  return PUZZLE_TYPES.find(p =>
    p.type.toLowerCase().includes((type || '').toLowerCase())
  ) || null;
}

export function getUsefulSpells(spellsKnown) {
  return PUZZLE_SPELLS.filter(ps =>
    (spellsKnown || []).some(s => s.toLowerCase() === ps.spell.toLowerCase())
  );
}
