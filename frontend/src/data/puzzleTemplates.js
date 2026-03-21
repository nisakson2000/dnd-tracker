/**
 * puzzleTemplates.js
 * ============================================================
 * Static puzzle design templates for Dungeon Masters.
 * Covers puzzle types, riddle collections, combination puzzles,
 * difficulty scaling, hint systems, and trap-puzzle combos.
 *
 * Distinct from puzzleGenerator.js (AI-driven generation).
 * No React — pure data and helper functions.
 *
 * Usage:
 *   import { PUZZLE_TYPES, getRandomRiddle, generatePuzzleEncounter } from './puzzleTemplates';
 * ============================================================
 */

// ============================================================
// 1. PUZZLE_TYPES
// ============================================================

/**
 * Eight core puzzle archetypes with mechanical metadata.
 * difficultyRange: [min, max] on a 1–5 scale.
 * typicalDC: suggested Difficulty Class for the primary check.
 * requiredSkills: player skills most commonly tested.
 */
export const PUZZLE_TYPES = {
  riddle: {
    id: "riddle",
    name: "Riddle",
    difficultyRange: [1, 5],
    typicalDC: 14,
    description:
      "A spoken or inscribed verbal puzzle requiring lateral thinking and wordplay. " +
      "Classic in sphinx encounters, locked vaults, and guardian spirits.",
    requiredSkills: ["Investigation", "History", "Arcana"],
    tags: ["verbal", "classic", "solo-friendly"],
  },

  combination_lock: {
    id: "combination_lock",
    name: "Combination Lock",
    difficultyRange: [1, 4],
    typicalDC: 13,
    description:
      "A physical mechanism — dials, rings, or switches — that must be set to the correct " +
      "combination. Clues are scattered in the environment or within lore documents.",
    requiredSkills: ["Investigation", "Perception", "Thieves' Tools"],
    tags: ["mechanical", "environmental-clue", "multi-step"],
  },

  pattern_match: {
    id: "pattern_match",
    name: "Pattern Match",
    difficultyRange: [1, 5],
    typicalDC: 12,
    description:
      "Players observe a sequence or visual arrangement and must identify the underlying rule " +
      "to replicate or continue the pattern on an interface.",
    requiredSkills: ["Investigation", "Arcana", "Insight"],
    tags: ["visual", "logical", "scalable"],
  },

  pressure_plate_sequence: {
    id: "pressure_plate_sequence",
    name: "Pressure Plate Sequence",
    difficultyRange: [2, 5],
    typicalDC: 15,
    description:
      "A grid or path of pressure-sensitive tiles that must be activated in a specific order. " +
      "Wrong steps trigger traps, alarms, or reset the puzzle.",
    requiredSkills: ["Perception", "Investigation", "Acrobatics"],
    tags: ["physical", "spatial", "trap-adjacent"],
  },

  elemental_alignment: {
    id: "elemental_alignment",
    name: "Elemental Alignment",
    difficultyRange: [2, 5],
    typicalDC: 16,
    description:
      "Statues, crystals, or conduits representing fire, water, earth, and air must be oriented " +
      "or powered in the correct sequence to unlock a door or activate a mechanism.",
    requiredSkills: ["Arcana", "Nature", "Religion"],
    tags: ["magical", "lore-heavy", "environmental"],
  },

  rune_translation: {
    id: "rune_translation",
    name: "Rune / Symbol Translation",
    difficultyRange: [2, 5],
    typicalDC: 17,
    description:
      "An ancient inscription in Dwarvish, Elvish, Infernal, or a cipher must be decoded. " +
      "Partial keys may exist elsewhere in the dungeon.",
    requiredSkills: ["Arcana", "History", "Religion", "Languages"],
    tags: ["knowledge", "lore-heavy", "prep-intensive"],
  },

  lever_switch: {
    id: "lever_switch",
    name: "Lever / Switch Mechanism",
    difficultyRange: [1, 4],
    typicalDC: 13,
    description:
      "A bank of levers or switches must be toggled to a correct configuration. " +
      "Environmental illustrations or rhyming instructions hint at the solution.",
    requiredSkills: ["Investigation", "Perception", "Thieves' Tools"],
    tags: ["mechanical", "visual", "group-friendly"],
  },

  musical_tonal: {
    id: "musical_tonal",
    name: "Musical / Tonal Puzzle",
    difficultyRange: [2, 5],
    typicalDC: 15,
    description:
      "Chimes, organ pipes, or resonating crystals must be struck in the correct melodic sequence. " +
      "Clues appear in sheet music, mural frescos, or NPC song lyrics.",
    requiredSkills: ["Perception", "Performance", "History", "Arcana"],
    tags: ["auditory", "performance", "memorable"],
  },
};

// ============================================================
// 2. RIDDLE_COLLECTION
// ============================================================

/**
 * Fifteen classic fantasy riddles.
 * difficulty: 1 (trivial) – 5 (devious).
 * hints: three-step progression from vague to near-obvious.
 */
export const RIDDLE_COLLECTION = [
  {
    id: "riddle_001",
    riddle: "I have cities, but no houses live there. I have mountains, but no trees grow there. I have water, but no fish swim there. I have roads, but no carriages travel them. What am I?",
    answer: "A map",
    difficulty: 1,
    hints: [
      "Think of something a traveler always carries but never walks upon.",
      "It represents the world without being part of it.",
      "Unfold it and you will see kingdoms — but only in miniature.",
    ],
    source: "classic",
  },
  {
    id: "riddle_002",
    riddle: "The more you take, the more you leave behind. What am I?",
    answer: "Footsteps",
    difficulty: 1,
    hints: [
      "Every journey produces them.",
      "They trail behind you, yet you create them by moving forward.",
      "Look at the ground behind you on a muddy road.",
    ],
    source: "classic",
  },
  {
    id: "riddle_003",
    riddle: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
    answer: "An echo",
    difficulty: 2,
    hints: [
      "Shout into a mountain pass and you may meet me.",
      "I repeat what you say, but I have no voice of my own.",
      "Caves and canyon walls are my home.",
    ],
    source: "classic",
  },
  {
    id: "riddle_004",
    riddle: "I have hands but cannot clap. I have a face but cannot smile. I tell you something every moment, yet I never speak. What am I?",
    answer: "A clock (or sundial)",
    difficulty: 2,
    hints: [
      "You consult me when you need to know how late it is.",
      "My face is round and my hands never stop moving.",
      "Without me, adventurers miss their watches.",
    ],
    source: "classic",
  },
  {
    id: "riddle_005",
    riddle: "Kings and queens sit upon me, yet I am made of wood. I have four legs but cannot walk. I hold things without arms. What am I?",
    answer: "A throne (or chair/table)",
    difficulty: 2,
    hints: [
      "You find me in great halls and throne rooms.",
      "Four-legged and sturdy, yet motionless.",
      "Sit down and think.",
    ],
    source: "classic",
  },
  {
    id: "riddle_006",
    riddle: "I am always in front of you but cannot be seen. I am promised to you but never owned. I am shaped by your choices but not yet written. What am I?",
    answer: "The future",
    difficulty: 3,
    hints: [
      "No spell of divination can fully reveal me.",
      "Every action you take shapes me, yet I remain ahead.",
      "Yesterday is behind you; today surrounds you; I am what comes next.",
    ],
    source: "philosophical",
  },
  {
    id: "riddle_007",
    riddle: "The man who made me doesn't want me. The man who bought me doesn't use me. The man who uses me doesn't know he uses me. What am I?",
    answer: "A coffin",
    difficulty: 3,
    hints: [
      "A craftsman builds me hoping never to need me.",
      "I am a final destination.",
      "The dead rest within me.",
    ],
    source: "dark",
  },
  {
    id: "riddle_008",
    riddle: "I can be cracked, I can be made. I can be told, I can be played. What am I?",
    answer: "A joke",
    difficulty: 3,
    hints: [
      "Bards love me. Scholars tolerate me.",
      "Some are terrible; some make kings laugh.",
      "I am lighter than a spell and cheaper than an inn.",
    ],
    source: "wordplay",
  },
  {
    id: "riddle_009",
    riddle: "I am heavier than air but rise above it. I am born from destruction yet bring warmth and light. Touch me and I will devour you. What am I?",
    answer: "Fire",
    difficulty: 2,
    hints: [
      "Dragons breathe me.",
      "I cook your food and warm your camp.",
      "Fuel me and I grow; starve me and I die.",
    ],
    source: "elemental",
  },
  {
    id: "riddle_010",
    riddle: "I have teeth but cannot bite. I have a spine but no backbone. I am found in libraries and tombs alike. Sages covet me; illiterates fear me. What am I?",
    answer: "A book",
    difficulty: 2,
    hints: [
      "Wizards carry me everywhere.",
      "Open me and you gain knowledge; close me and I keep my secrets.",
      "My teeth are along my edge; my spine holds me together.",
    ],
    source: "classic",
  },
  {
    id: "riddle_011",
    riddle: "I am not alive, yet I grow. I have no lungs, yet I need air. I have no mouth, yet water kills me. What am I?",
    answer: "Fire",
    difficulty: 3,
    hints: [
      "I am the same as riddle_009's answer, but described differently.",
      "Think of what consumes wood and air together.",
      "Suffocate me and I vanish.",
    ],
    source: "elemental",
  },
  {
    id: "riddle_012",
    riddle: "What runs but never walks, has a mouth but never talks, has a bed but never sleeps, and a head but never weeps?",
    answer: "A river",
    difficulty: 2,
    hints: [
      "Sailors navigate me; fish call me home.",
      "My banks are my sides; my source is my head.",
      "I flow toward the sea without ever choosing to.",
    ],
    source: "classic",
  },
  {
    id: "riddle_013",
    riddle: "I am a word of letters three. Add two and fewer there will be. What am I?",
    answer: "Few",
    difficulty: 4,
    hints: [
      "Think about the word itself, not what it describes.",
      "The word has three letters. Adding two letters spells a word meaning less.",
      "F-E-W becomes F-E-W-E-R, meaning 'a smaller number'.",
    ],
    source: "wordplay",
  },
  {
    id: "riddle_014",
    riddle: "I protect a king yet am no soldier. I guard a vault yet am no watchman. Cut me and I bleed no blood. Break me and the king weeps. What am I?",
    answer: "A seal (wax seal / signet ring)",
    difficulty: 4,
    hints: [
      "Authority and identity travel with me.",
      "Nobles press me into warm wax.",
      "I am the mark of authenticity on a royal letter.",
    ],
    source: "political",
  },
  {
    id: "riddle_015",
    riddle: "I am the beginning of eternity, the end of time and space, the beginning of every end, and the end of every place. What am I?",
    answer: "The letter E",
    difficulty: 5,
    hints: [
      "Look for a pattern in the phrase itself, not in the cosmos.",
      "Examine the first and last letters of key words.",
      "The answer is a single character hidden in plain sight within the riddle.",
    ],
    source: "wordplay",
  },
];

// ============================================================
// 3. COMBINATION_PUZZLES
// ============================================================

/**
 * Six combination-puzzle templates.
 * setupDescription: how to present the puzzle to players.
 * solutionMethod: how the correct answer is reached.
 * physicalProps: real-world or in-session prop suggestions.
 */
export const COMBINATION_PUZZLES = [
  {
    id: "combo_color_sequence",
    name: "Color Sequence",
    type: "combination_lock",
    setupDescription:
      "A stone pedestal bears five gemstone-shaped recesses, each capable of holding a " +
      "gem of a different hue. A mural on the wall depicts a rainbow arcing over a stormy sea, " +
      "but three of the colors are obscured by grime. Players must clean the mural (Investigation DC 12) " +
      "and determine the correct gem order from top to bottom of the rainbow.",
    solutionMethod:
      "The correct order mirrors the visible spectrum: red, orange, yellow, green, blue (ROYGB). " +
      "Scattered journal entries replace 'indigo' and 'violet' with 'deep blue' and 'amethyst' " +
      "as narrative flavor. Inserting gems in the wrong order causes a mild shock (1d4 lightning).",
    physicalProps: [
      "Colored glass beads or poker chips labeled with gem names",
      "A printed mural handout with smudged sections",
      "Five small numbered stands to track player guesses",
    ],
    sampleSolution: ["red", "orange", "yellow", "green", "blue"],
    resetCondition: "Removing any gem resets all slots.",
  },
  {
    id: "combo_number_lock",
    name: "Number Lock",
    type: "combination_lock",
    setupDescription:
      "An iron vault door has three rotating dials, each numbered 0–9. A poem is carved above: " +
      "'Three virtues guard this keep: the years the keep has stood, the king's birth-year reversed, " +
      "the number of towers in this citadel.' Players must piece together the lore from explored areas.",
    solutionMethod:
      "Each number is hidden in flavor text scattered across the dungeon. " +
      "DM sets the actual values (e.g., 3 – 7 – 4) before the session and seeds the clues. " +
      "Brute force is possible but triggers an alarm after three failed attempts.",
    physicalProps: [
      "A paper dial handout with numbered wheel cutouts",
      "Index cards with lore fragments for each number",
      "A physical combination lock (real prop) with the DM-set code",
    ],
    sampleSolution: "DM-defined; seed three lore clues before session.",
    resetCondition: "Each wrong attempt advances an alarm counter visible to players.",
  },
  {
    id: "combo_symbol_matching",
    name: "Symbol Matching",
    type: "combination_lock",
    setupDescription:
      "Six stone tablets are arranged in two rows of three. Each tablet on the top row bears a " +
      "celestial symbol (sun, moon, comet, star, eclipse, aurora). The bottom row tablets are blank. " +
      "A prophetic text on the wall says each celestial body 'finds its mirror below.' " +
      "Players must match each top symbol to the corresponding bottom slot based on a star chart found earlier.",
    solutionMethod:
      "The star chart (found in the observatory) shows the symbols paired with their mythological counterparts. " +
      "Correct pairs: sun↔eclipse, moon↔aurora, comet↔star. Placing a wrong pair causes a thunderclap " +
      "and deals 1d6 thunder to the active player.",
    physicalProps: [
      "Six poker chips or tiles with drawn symbols for the top row",
      "Six blank tiles for the bottom row (players write or place matches)",
      "A printed star chart handout",
    ],
    sampleSolution: {
      sun: "eclipse",
      moon: "aurora",
      comet: "star",
    },
    resetCondition: "Thunderclap resets matched pairs to random positions.",
  },
  {
    id: "combo_rotating_rings",
    name: "Rotating Rings",
    type: "combination_lock",
    setupDescription:
      "A circular door contains three concentric bronze rings, each engraved with twelve arcane symbols. " +
      "A plaque reads: 'Align the Serpent, the Eye, and the Flame.' Players must rotate each ring " +
      "independently until the correct symbols line up at the 12 o'clock position.",
    solutionMethod:
      "Each ring's correct symbol is referenced in separate clues: the Serpent in a statue's gaze, " +
      "the Eye in a painting's inscription, and the Flame in a prayer book. Aligning all three simultaneously " +
      "unlocks the door. Partial alignment (1 or 2 rings correct) produces a harmonic hum as feedback.",
    physicalProps: [
      "Three paper rings with symbols that can be rotated independently",
      "A printed 'door face' background players place rings onto",
      "Clue handouts referencing each symbol",
    ],
    sampleSolution: "Ring 1: Serpent, Ring 2: Eye, Ring 3: Flame",
    resetCondition: "Rings snap back to a default 'locked' position after 10 minutes.",
  },
  {
    id: "combo_sliding_tiles",
    name: "Sliding Tiles",
    type: "combination_lock",
    setupDescription:
      "A 3×3 grid of carved stone tiles is set into a wall, with one empty slot allowing tiles to slide. " +
      "The tiles depict a fragmented mural of a dragon in flight. When correctly assembled, " +
      "a hidden latch releases. Players must describe intended moves; the DM tracks the tile state.",
    solutionMethod:
      "The completed mural shows the dragon facing right with wings spread and tail curled left. " +
      "Players may use History (DC 13) to recall the icon from a tapestry seen earlier as a reference. " +
      "Minimum moves to solve: 22. Each 5-minute block represents ~10 tile moves narratively.",
    physicalProps: [
      "A printed 3×3 tile grid that can be cut out and shuffled",
      "Numbered tiles for abstract play if physical tiles are unavailable",
      "A 'solved state' reference image the DM keeps hidden",
    ],
    sampleSolution: "Dragon image assembled correctly — DM reference image required.",
    resetCondition: "Tiles reset to starting position if the empty slot returns to center.",
  },
  {
    id: "combo_weight_balance",
    name: "Weight Balance",
    type: "combination_lock",
    setupDescription:
      "A large brass scale dominates the room. On the left pan rests a golden skull; the right pan is empty. " +
      "Five pedestals hold objects of varying sizes: a feather, an iron bar, a clay pot, a gem, and a tome. " +
      "An inscription reads: 'Balance truth with knowledge and the way shall open.' " +
      "Adding objects to the right pan tips the scale; if it tips too far, a trap triggers.",
    solutionMethod:
      "The skull weighs exactly as much as the tome and the gem combined. " +
      "Players must discover this through Perception (DC 12) to notice weight markings, " +
      "or by trial — placing objects and watching the scale's reaction. " +
      "Correct solution: place tome + gem on the right pan.",
    physicalProps: [
      "A small physical balance scale as a prop",
      "Labeled weight cards for each object (actual gram values on DM side)",
      "A slip with object names players can physically place on the scale",
    ],
    sampleSolution: "Tome + Gem on right pan equals the skull's weight on the left.",
    resetCondition: "Removing any object from the correct pan reseals the door.",
  },
];

// ============================================================
// 4. PUZZLE_DIFFICULTY
// ============================================================

/**
 * Five difficulty tiers scaling DC, check count, time, hints, and failure stakes.
 */
export const PUZZLE_DIFFICULTY = {
  trivial: {
    level: 1,
    label: "Trivial",
    dc: 10,
    checksRequired: 1,
    suggestedTimeLimitMinutes: 5,
    hintAvailability: "All hints freely available; DM may simply give the answer.",
    failureConsequence:
      "Minor narrative setback — a door stays closed an extra round, a small noise is made.",
    xpAward: 25,
    notes: "Best used for warming up new players or rewarding thoroughness.",
  },
  easy: {
    level: 2,
    label: "Easy",
    dc: 12,
    checksRequired: 2,
    suggestedTimeLimitMinutes: 10,
    hintAvailability: "Environmental clue free; one Investigation hint available at DC 12.",
    failureConsequence:
      "Mild trap triggers (1d4 damage or disadvantage on next check); puzzle resets.",
    xpAward: 50,
    notes: "Suitable for low-level parties or side-content puzzles.",
  },
  moderate: {
    level: 3,
    label: "Moderate",
    dc: 15,
    checksRequired: 3,
    suggestedTimeLimitMinutes: 15,
    hintAvailability: "Environmental clue free; hints 2 and 3 require skill checks.",
    failureConsequence:
      "Trap deals 2d6 damage to the active player; puzzle locks for 1 minute before resetting.",
    xpAward: 100,
    notes: "Standard dungeon puzzle difficulty. Most players find this engaging.",
  },
  hard: {
    level: 4,
    label: "Hard",
    dc: 18,
    checksRequired: 4,
    suggestedTimeLimitMinutes: 20,
    hintAvailability:
      "Only the environmental clue is free; subsequent hints cost a resource (spell slot, HP, time).",
    failureConsequence:
      "Significant trap (3d6 damage, condition, or spawns encounter); full puzzle reset.",
    xpAward: 200,
    notes: "Reserve for major dungeon gates or climactic moments.",
  },
  devious: {
    level: 5,
    label: "Devious",
    dc: 20,
    checksRequired: 5,
    suggestedTimeLimitMinutes: 30,
    hintAvailability:
      "No free hints. All hints cost resources or inflict narrative consequences. DM bailout available but costly.",
    failureConsequence:
      "Lethal trap potential (4d10 damage, permanent scar, or catastrophic dungeon event); puzzle may be unsolvable after three failures.",
    xpAward: 500,
    notes: "Endgame or legendary dungeon use only. Warn players in Session Zero.",
  },
};

// ============================================================
// 5. HINT_SYSTEM
// ============================================================

/**
 * Five-tier progressive hint framework applicable to any puzzle.
 * cost: what players must spend or risk to receive the hint.
 * trigger: how the hint is delivered narratively.
 */
export const HINT_SYSTEM = {
  environmental_clue: {
    tier: 0,
    label: "Environmental Clue",
    cost: "Free — no action or check required.",
    trigger:
      "Automatically presented when players enter the puzzle room. " +
      "Embedded in description: scratches on the floor, a half-burned note, a painted arrow.",
    dmNote:
      "Always include at least one environmental clue. It sets the puzzle's theme and ensures " +
      "players know a puzzle exists rather than feeling lost.",
    exampleDelivery:
      "As you enter, you notice grooves worn into the stone floor in front of each of the five pedestals, " +
      "as if something heavy has been slid back and forth many times.",
  },
  investigation_hint: {
    tier: 1,
    label: "Investigation Hint",
    cost: "Action + Investigation DC 12 check.",
    trigger:
      "Player declares they search the room carefully. On success, they find a secondary clue — " +
      "a journal entry, a carved instruction, or a lingering magical impression.",
    dmNote:
      "This hint should narrow down the solution space without giving it away. " +
      "It rewards players who engage with the environment.",
    exampleDelivery:
      "Behind the statue's plinth, scratched in hasty Common: 'Do NOT place the iron — tried it twice, lost two fingers.'",
  },
  arcana_history_hint: {
    tier: 2,
    label: "Arcana / History Hint",
    cost: "Action + Arcana or History DC 15 (whichever fits the puzzle's theme).",
    trigger:
      "Player recalls relevant magical theory, historical context, or cultural knowledge. " +
      "This hint reveals the logic behind the puzzle.",
    dmNote:
      "Tie this hint to the world lore. It rewards players who invested in knowledge skills " +
      "and makes the dungeon feel like it exists in a living world.",
    exampleDelivery:
      "You recall that the Cult of the Amber Throne used the number of their founding members — seven — " +
      "as a sacred cipher in all their locks.",
  },
  direct_hint: {
    tier: 3,
    label: "Direct Hint",
    cost: "Costs a resource: expend a spell slot of 1st level or higher, take 1d6 psychic damage, or spend 10 minutes of in-game time.",
    trigger:
      "Player explicitly asks for help from the environment — touching a magical inscription, " +
      "praying at an altar, or draining energy from a ley-line node.",
    dmNote:
      "This hint gives the answer's structure but not the answer itself. " +
      "E.g., 'You need exactly three objects on the right pan' but not which objects.",
    exampleDelivery:
      "The inscription glows as you touch it, and a voice whispers: 'The worthy place only what the mind values above the body.' " +
      "You feel drained (-1d6 HP).",
  },
  dm_bailout: {
    tier: 4,
    label: "DM Bailout",
    cost:
      "Puzzle solves itself, but with a narrative consequence: treasure is reduced, an alarm triggers, " +
      "a resource is depleted, or an NPC loses faith in the party.",
    trigger:
      "DM uses this when the session has stalled for 20+ real minutes and frustration is high. " +
      "Present it as a diegetic event — the mechanism rusts open, a ghost takes pity, time pressure resolves it.",
    dmNote:
      "Never frame this as the DM 'giving up.' Frame it as the dungeon itself responding. " +
      "Always attach a cost so the bypass feels meaningful, not like cheating.",
    exampleDelivery:
      "After long minutes of struggle, a crack runs through the ancient mechanism. " +
      "With a grinding protest, the door swings open — but the impact shatters the gem inlaid in its frame. " +
      "Whatever treasure it held is lost.",
  },
};

// ============================================================
// 6. TRAP_PUZZLE_COMBOS
// ============================================================

/**
 * Five puzzles with integrated trap consequences for wrong answers.
 * trapType: the school/type of danger.
 * wrongAnswerEffect: what happens immediately on a failed attempt.
 * partialSuccessRule: optional graduated consequence for near-misses.
 */
export const TRAP_PUZZLE_COMBOS = [
  {
    id: "trap_combo_001",
    name: "The Singing Bridge",
    puzzleType: "musical_tonal",
    description:
      "A narrow stone bridge spans a chasm. Seven chimes hang above it, each carved with a note. " +
      "An inscription reads: 'Sing the vault's lullaby and cross safely. Strike a false note and the bridge remembers.' " +
      "The lullaby's first four notes are written on a child's grave marker nearby.",
    solution:
      "Strike chimes in the order matching the lullaby: notes 1-2-4-3-5-7-6. " +
      "The full melody is discoverable via Performance DC 13 after hearing the partial version.",
    trapType: "Structural / Falling",
    wrongAnswerEffect:
      "Each wrong note causes a 1-foot section of the bridge to crumble. " +
      "After 5 wrong notes, the bridge collapses. Characters on the bridge must make DC 15 Dexterity saves " +
      "or fall into the chasm (6d6 bludgeoning, ledge reachable with DC 12 Athletics).",
    partialSuccessRule:
      "Getting 3 of 4 partial notes correct triggers a warning tremor (no damage) and resets the sequence.",
    resetCondition: "Bridge fully collapses after 5 errors — becomes a traversal challenge instead.",
    difficulty: "hard",
    rewards: "Safe passage + hidden alcove with 200gp of antique instruments.",
  },
  {
    id: "trap_combo_002",
    name: "The Philosopher's Dial",
    puzzleType: "rune_translation",
    description:
      "A circular dial with twelve runic positions controls a portcullis. " +
      "Each rune represents a concept (Truth, Lies, Gold, Death, Love, Fear, Time, Memory, Shadow, Light, Blood, Silence). " +
      "A plaque reads: 'What the wise seek; what the greedy destroy; what lovers share; what none can buy.' " +
      "Each phrase corresponds to one rune.",
    solution:
      "Truth, Gold, Love, Time — set the dial to these four in the stated order. " +
      "Arcana DC 15 or Religion DC 13 helps decode the runic symbols.",
    trapType: "Magical / Psychic",
    wrongAnswerEffect:
      "Selecting a wrong rune deals 2d6 psychic damage and imposes disadvantage on Wisdom saves for 1 hour. " +
      "After three wrong runes, a Shadow (MM) is summoned.",
    partialSuccessRule:
      "First wrong rune: psychic damage only. Second wrong rune: damage + disadvantage. Third: Shadow summoned.",
    resetCondition: "Shadow despawns if defeated; dial resets to neutral.",
    difficulty: "devious",
    rewards: "Portcullis opens to a vault containing a rare spellbook and 500gp.",
  },
  {
    id: "trap_combo_003",
    name: "The Warden's Gaze",
    puzzleType: "pressure_plate_sequence",
    description:
      "A 4×4 grid of stone tiles, each bearing a faded symbol. A stone warden statue watches from the far end. " +
      "A map fragment shows a winding path through the grid. The 'safe' tiles form a specific route; " +
      "all others are pressure plates connected to the statue's gaze attack.",
    solution:
      "Follow the path: (1,1) → (1,2) → (2,2) → (2,3) → (3,3) → (3,4) → (4,4). " +
      "Perception DC 14 reveals slight discoloration on safe tiles.",
    trapType: "Force / Petrification",
    wrongAnswerEffect:
      "Stepping on a trapped tile triggers the warden's Petrifying Gaze (Constitution save DC 15 or be restrained; " +
      "fail again next turn to be fully petrified). Effect ends after 1 hour or with Remove Curse.",
    partialSuccessRule:
      "Creatures moving off the safe path but staying in the same column take only 2d8 force damage instead of the gaze attack.",
    resetCondition: "Statue resets after all creatures exit the grid.",
    difficulty: "hard",
    rewards: "Safe path leads to a warden's cache: Boots of Striding, 150gp.",
  },
  {
    id: "trap_combo_004",
    name: "The Alchemist's Cabinet",
    puzzleType: "combination_lock",
    description:
      "A cabinet with four labeled drawers: Red, Blue, Green, Yellow. Each can be locked or unlocked. " +
      "A journal entry reads: 'Lock that which burns; free that which heals; lock what clouds the mind; " +
      "free what strengthens the arm.' Alchemical substances are referenced throughout the dungeon.",
    solution:
      "Lock Red (fire/burning), Unlock Blue (water/healing), Lock Green (poison/clouds mind), Unlock Yellow (gold/strength). " +
      "Nature DC 12 or Medicine DC 12 helps decode the alchemical references.",
    trapType: "Poison / Acid",
    wrongAnswerEffect:
      "Incorrect lock/unlock combination releases a cloud of toxic gas from the cabinet " +
      "(Constitution save DC 14 or take 3d6 poison damage and be poisoned for 1 hour). " +
      "Room fills with gas after 3 wrong combinations; all in room must save each round.",
    partialSuccessRule:
      "Getting 2 of 4 drawers correct creates only a minor gas leak (DC 10 save, 1d4 poison damage).",
    resetCondition: "Gas disperses after 10 minutes or with wind magic. Cabinet resets after dispersal.",
    difficulty: "moderate",
    rewards: "Cabinet contains rare alchemical components worth 300gp and a Potion of Greater Healing.",
  },
  {
    id: "trap_combo_005",
    name: "The Twin Thrones",
    puzzleType: "elemental_alignment",
    description:
      "Two thrones face each other: one of obsidian (cold to the touch), one of sunstone (warm). " +
      "Four braziers in the corners hold different materials: sea salt, dry wood, iron filings, rich soil. " +
      "An inscription above each throne names a concept. The puzzle requires two players to sit simultaneously " +
      "and align the braziers to the correct elements before a sand timer empties.",
    solution:
      "Obsidian throne = Water element (sea salt brazier lit). Sunstone throne = Fire element (dry wood lit). " +
      "Earth (soil) and Air braziers remain unlit. Must be completed while both thrones are occupied. " +
      "Arcana DC 16 to recall the elemental correspondence.",
    trapType: "Elemental / Multi-target",
    wrongAnswerEffect:
      "Lighting the wrong brazier causes the corresponding element to strike both seated players: " +
      "wrong water = ice bolt (2d8 cold, restrained), wrong earth = stone spike (2d10 piercing), " +
      "wrong air = thunderclap (3d6 thunder, both players knocked prone).",
    partialSuccessRule:
      "If only one throne is occupied when the timer ends, only that player takes the trap effect.",
    resetCondition: "Both players must leave the thrones for 1 full round to reset the braziers.",
    difficulty: "devious",
    rewards: "Secret compartment opens beneath each throne: crown worth 750gp + Amulet of the Elements.",
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Retrieve a puzzle type definition by its ID.
 * @param {string} typeId - Key from PUZZLE_TYPES (e.g. "riddle", "lever_switch").
 * @returns {Object|null} The puzzle type object, or null if not found.
 */
export function getPuzzleType(typeId) {
  return PUZZLE_TYPES[typeId] ?? null;
}

/**
 * Return a random riddle, optionally filtered by difficulty.
 * @param {number|null} difficulty - 1–5, or null for any difficulty.
 * @returns {Object} A riddle entry from RIDDLE_COLLECTION.
 */
export function getRandomRiddle(difficulty = null) {
  let pool = RIDDLE_COLLECTION;
  if (difficulty !== null) {
    pool = RIDDLE_COLLECTION.filter((r) => r.difficulty === difficulty);
    if (pool.length === 0) pool = RIDDLE_COLLECTION;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Generate a combination puzzle instance with scaled flavor.
 * @param {string} type - Key from COMBINATION_PUZZLES id values without "combo_" prefix
 *                        (e.g. "color_sequence", "number_lock").
 * @param {number} difficulty - 1–5 difficulty level.
 * @returns {Object} The matching template enriched with a difficulty descriptor.
 */
export function generateCombinationPuzzle(type, difficulty = 3) {
  const normalizedType = type.startsWith("combo_") ? type : `combo_${type}`;
  const template = COMBINATION_PUZZLES.find((p) => p.id === normalizedType) ?? COMBINATION_PUZZLES[0];
  const difficultyInfo = getPuzzleDifficulty(difficulty);

  return {
    ...template,
    appliedDifficulty: difficultyInfo,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Retrieve a specific hint tier for a puzzle by hint level (0–4).
 * @param {string} puzzleId - Unused in static lookup; reserved for future dynamic puzzles.
 * @param {number} hintLevel - 0 (environmental) through 4 (DM bailout).
 * @returns {Object|null} The hint tier object from HINT_SYSTEM.
 */
export function getHint(puzzleId, hintLevel) {
  const tierMap = {
    0: HINT_SYSTEM.environmental_clue,
    1: HINT_SYSTEM.investigation_hint,
    2: HINT_SYSTEM.arcana_history_hint,
    3: HINT_SYSTEM.direct_hint,
    4: HINT_SYSTEM.dm_bailout,
  };
  return tierMap[hintLevel] ?? null;
}

/**
 * Retrieve a difficulty descriptor by numeric level.
 * @param {number} level - 1 (trivial) through 5 (devious).
 * @returns {Object|null} The matching entry from PUZZLE_DIFFICULTY.
 */
export function getPuzzleDifficulty(level) {
  const key = Object.keys(PUZZLE_DIFFICULTY).find(
    (k) => PUZZLE_DIFFICULTY[k].level === level
  );
  return key ? PUZZLE_DIFFICULTY[key] : null;
}

/**
 * Generate a full puzzle encounter object combining type, difficulty, and optional trap.
 * @param {string} type - A key from PUZZLE_TYPES.
 * @param {number} difficulty - 1–5 difficulty level.
 * @param {boolean} hasTrap - Whether to attach a trap-puzzle combo.
 * @returns {Object} A ready-to-use encounter descriptor.
 */
export function generatePuzzleEncounter(type, difficulty = 3, hasTrap = false) {
  const puzzleType = getPuzzleType(type);
  const difficultyInfo = getPuzzleDifficulty(difficulty);

  // Find a trap combo that matches the puzzle type if requested.
  let trapCombo = null;
  if (hasTrap) {
    const matching = TRAP_PUZZLE_COMBOS.filter((t) => t.puzzleType === type);
    trapCombo = matching.length > 0
      ? matching[Math.floor(Math.random() * matching.length)]
      : TRAP_PUZZLE_COMBOS[Math.floor(Math.random() * TRAP_PUZZLE_COMBOS.length)];
  }

  // Select a relevant riddle if this is a riddle-type encounter.
  const featuredRiddle =
    type === "riddle" ? getRandomRiddle(Math.min(difficulty, 5)) : null;

  // Build hint progression for this encounter's difficulty.
  const availableHints = [];
  if (difficultyInfo) {
    const maxHintTier = Math.max(0, 4 - difficultyInfo.level); // harder = fewer free hints
    for (let i = 0; i <= maxHintTier; i++) {
      const hint = getHint(null, i);
      if (hint) availableHints.push(hint);
    }
    // DM bailout always available at any difficulty.
    if (!availableHints.find((h) => h.tier === 4)) {
      availableHints.push(HINT_SYSTEM.dm_bailout);
    }
  }

  return {
    encounterType: "puzzle",
    puzzleType: puzzleType ?? { id: type, name: type },
    difficulty: difficultyInfo,
    hasTrap,
    trapCombo,
    featuredRiddle,
    availableHints,
    summary: puzzleType
      ? `A ${difficultyInfo?.label ?? "moderate"} ${puzzleType.name} puzzle` +
        (hasTrap ? " with integrated trap consequences." : ".")
      : "Custom puzzle encounter.",
    generatedAt: new Date().toISOString(),
  };
}
