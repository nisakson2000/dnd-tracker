/**
 * Puzzle Generator — Pre-built puzzle templates for DMs.
 * Each puzzle has a setup, clues, solution, and difficulty.
 */

export const PUZZLES = [
  {
    title: 'The Mirror Riddle',
    difficulty: 'Easy',
    setup: 'Three mirrors face a pedestal. An inscription reads: "Only truth reveals the path."',
    clues: ['One mirror shows things as they are', 'One mirror shows things reversed', 'One mirror shows things as they will be', 'The true mirror has no frame'],
    solution: 'Step before the unframed mirror and speak your true name to reveal the passage.',
    skillChecks: ['Investigation DC 12 to notice the frames', 'Arcana DC 14 to detect divination magic', 'Insight DC 10 to understand "truth"'],
  },
  {
    title: 'The Pressure Plates',
    difficulty: 'Medium',
    setup: 'A 5x5 grid of stone tiles fills the corridor. Some tiles click when weight is applied. The wrong path triggers darts.',
    clues: ['Worn tiles mark the safe path', 'The pattern follows a knight\'s move in chess', 'A skeleton on a wrong tile points toward the correct next step'],
    solution: 'Follow the knight\'s move pattern: 2 forward, 1 to the side (or vice versa) from the entrance to the exit.',
    skillChecks: ['Perception DC 13 to spot worn tiles', 'Investigation DC 15 to deduce the pattern', 'Dexterity DC 12 to navigate carefully'],
  },
  {
    title: 'The Elemental Doors',
    difficulty: 'Medium',
    setup: 'Four doors, each marked with an elemental symbol (fire, water, earth, air). A riddle on the wall: "I consume without hunger, I drink without thirst, I breathe without lungs, I stand without bones."',
    clues: ['Each line refers to one element', '"Consume without hunger" = Fire', '"Drink without thirst" = Earth (absorbs water)', '"Breathe without lungs" = Wind', '"Stand without bones" = Water (ice)'],
    solution: 'The answer is Fire — it consumes, drinks (extinguished by water), breathes (needs oxygen), and stands (as a pillar of flame). Open the fire door.',
    skillChecks: ['Arcana DC 12 to identify elemental symbols', 'Intelligence DC 14 to solve the riddle'],
  },
  {
    title: 'The Weighted Scales',
    difficulty: 'Hard',
    setup: 'A massive balance scale dominates the room. One side holds a golden orb. The door won\'t open until the scale is perfectly balanced.',
    clues: ['The orb weighs exactly as much as a person\'s conscience', 'There are items in the room of various weights', 'A truthful confession lightens the orb', 'A lie makes it heavier'],
    solution: 'Players must confess something genuinely weighing on their conscience. Each honest confession reduces the orb\'s weight. Enough confessions balance the scale.',
    skillChecks: ['Insight DC 15 to understand the mechanism', 'Charisma DC 12 per confession (must be genuine)'],
  },
  {
    title: 'The Shifting Maze',
    difficulty: 'Hard',
    setup: 'Walls in this maze shift every 3 rounds, rearranging the layout. There\'s a map on the ceiling.',
    clues: ['The ceiling map updates in real-time', 'The exit is always in the northeast corner', 'Marking walls is useless — they move', 'The shifts follow a pattern: clockwise, then counter, then random'],
    solution: 'Watch the ceiling map and move quickly during the 3-round windows. The third shift is random, so reach the exit within 6 rounds.',
    skillChecks: ['Perception DC 14 to read the ceiling map', 'Intelligence DC 13 to predict shift patterns', 'Athletics DC 12 to move quickly'],
  },
  {
    title: 'The Singing Stones',
    difficulty: 'Easy',
    setup: 'Seven crystals are embedded in the wall. When touched, each plays a musical note. A melody echoes faintly from deeper in the dungeon.',
    clues: ['The melody plays 4 notes', 'The notes match crystals by color (red=low, violet=high)', 'Playing the melody backwards opens a different passage', 'A wrong note resets the puzzle and triggers a mild shock (1d4 lightning)'],
    solution: 'Reproduce the 4-note melody heard from the dungeon. Playing it backward reveals a secret room.',
    skillChecks: ['Performance DC 10 to identify the notes', 'Perception DC 12 to hear the melody clearly'],
  },
  {
    title: 'The Living Painting',
    difficulty: 'Medium',
    setup: 'A large painting depicts a scene with figures frozen mid-action. The painting is magical — objects can be moved within it.',
    clues: ['Moving the key in the painting moves it to the real world', 'The figures will attack if you try to take their weapons', 'There\'s a hidden keyhole behind the painting that matches the painted key'],
    solution: 'Carefully reach into the painting and remove the key without disturbing the figures. Use Mage Hand for safety.',
    skillChecks: ['Arcana DC 13 to understand the painting\'s magic', 'Sleight of Hand DC 15 to take the key without alerting figures'],
  },
  {
    title: 'The Hourglass Room',
    difficulty: 'Hard',
    setup: 'The room contains a giant hourglass. When flipped, the door opens for exactly 1 minute. The exit is on the far side, 100 feet away through obstacles.',
    clues: ['The sand runs faster in the presence of magic', 'Non-magical movement is the safest approach', 'There are pressure plates that slow the sand if stepped on', 'Flipping the hourglass back resets everything — including the obstacles'],
    solution: 'Flip the hourglass, navigate the obstacles without using magic (which speeds up the timer), step on pressure plates to buy time.',
    skillChecks: ['Athletics DC 14 to navigate obstacles quickly', 'Acrobatics DC 13 for the balance beam section', 'Wisdom DC 12 to resist using magic under pressure'],
  },
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function generatePuzzle(difficulty = null) {
  if (difficulty) {
    const filtered = PUZZLES.filter(p => p.difficulty === difficulty);
    return filtered.length > 0 ? pick(filtered) : pick(PUZZLES);
  }
  return pick(PUZZLES);
}

export function getPuzzleDifficulties() {
  return ['Easy', 'Medium', 'Hard'];
}
