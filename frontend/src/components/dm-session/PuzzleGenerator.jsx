import { useState } from 'react';
import {
  Puzzle, Copy, RefreshCw, Eye, EyeOff,
  ChevronDown, ChevronRight, Lightbulb, AlertTriangle,
  Dices,
} from 'lucide-react';

/* ── helpers ─────────────────────────────────────────── */
const pick  = a => a[Math.floor(Math.random() * a.length)];
const pickN = (a, n) => {
  const s = [...a];
  for (let i = s.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [s[i], s[j]] = [s[j], s[i]]; }
  return s.slice(0, Math.min(n, s.length));
};
const roll  = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffle = a => [...a].sort(() => Math.random() - 0.5);

/* ── shared style tokens ─────────────────────────────── */
const PURPLE = '#a78bfa';

const panelBg = {
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '12px', overflow: 'hidden',
};

const headerStyle = {
  padding: '10px 16px',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
  fontSize: '11px', fontWeight: 700,
  letterSpacing: '0.08em', textTransform: 'uppercase',
  color: 'var(--text-mute)',
  fontFamily: 'var(--font-mono, monospace)',
  display: 'flex', alignItems: 'center', gap: '8px',
};

const inputStyle = {
  width: '100%', padding: '8px 12px', borderRadius: '6px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'var(--text)', fontSize: '13px',
  fontFamily: 'var(--font-ui)', outline: 'none',
  boxSizing: 'border-box',
};

const selectStyle = { ...inputStyle, cursor: 'pointer' };

const btnBase = {
  display: 'inline-flex', alignItems: 'center', gap: '6px',
  padding: '7px 14px', borderRadius: '8px', fontSize: '12px',
  fontWeight: 600, fontFamily: 'var(--font-ui)',
  cursor: 'pointer', border: 'none', transition: 'all 0.15s',
};

const primaryBtn = {
  ...btnBase,
  background: `${PURPLE}22`, color: PURPLE,
  border: `1px solid ${PURPLE}44`,
};

const ghostBtn = {
  ...btnBase,
  background: 'rgba(255,255,255,0.04)',
  color: 'var(--text-mute)',
  border: '1px solid rgba(255,255,255,0.08)',
  fontSize: '11px', padding: '5px 10px',
};

const labelStyle = {
  fontSize: '10px', color: 'var(--text-mute)',
  fontFamily: 'var(--font-ui)', display: 'block',
  marginBottom: '3px', textTransform: 'uppercase',
  letterSpacing: '0.06em', fontWeight: 600,
};

const sectionHeadStyle = {
  display: 'flex', alignItems: 'center', gap: '6px',
  cursor: 'pointer', padding: '8px 12px', borderRadius: '8px',
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.04)',
  color: 'var(--text)', fontSize: '12px', fontWeight: 600,
  fontFamily: 'var(--font-ui)', width: '100%',
  userSelect: 'none', transition: 'background 0.15s',
};

/* ── template data ───────────────────────────────────── */

const RIDDLES = [
  { riddle: 'I have cities, but no houses live there. I have mountains, but no trees grow. I have water, but no fish swim. What am I?', answer: 'A map' },
  { riddle: 'The more you take, the more you leave behind. What am I?', answer: 'Footsteps' },
  { riddle: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?', answer: 'An echo' },
  { riddle: 'I can be cracked, made, told, and played. What am I?', answer: 'A joke' },
  { riddle: 'What has roots that nobody sees, is taller than trees, up up up it goes, and yet never grows?', answer: 'A mountain' },
  { riddle: 'Alive without breath, cold as death, never thirsty, ever drinking, clad in mail, never clinking. What am I?', answer: 'A fish' },
  { riddle: 'I have keys but open no locks. I have space but no room. You can enter but cannot go inside. What am I?', answer: 'A keyboard (or a riddle piano in a wizard\'s study)' },
  { riddle: 'What runs but never walks, has a mouth but never talks, has a bed but never sleeps?', answer: 'A river' },
  { riddle: 'I fly without wings. I cry without eyes. Wherever I go, darkness follows me. What am I?', answer: 'A cloud' },
  { riddle: 'Feed me and I live, give me water and I die. What am I?', answer: 'Fire' },
  { riddle: 'I am not alive, but I grow; I don\'t have lungs, but I need air; I don\'t have a mouth, but water kills me. What am I?', answer: 'Fire' },
  { riddle: 'What can travel around the world while staying in a corner?', answer: 'A stamp' },
  { riddle: 'The person who makes it, sells it. The person who buys it never uses it. The person who uses it never knows they\'re using it. What is it?', answer: 'A coffin' },
  { riddle: 'I have hands but cannot clap. I have a face but cannot smile. I am always running but never move. What am I?', answer: 'A clock' },
];

const SYMBOLS = ['Sun', 'Moon', 'Star', 'Serpent', 'Eye', 'Crown', 'Skull', 'Tree', 'Flame', 'Wave', 'Mountain', 'Lightning', 'Heart', 'Shield', 'Key', 'Feather'];

const ELEMENTS = ['Fire', 'Water', 'Earth', 'Air', 'Lightning', 'Ice', 'Shadow', 'Light', 'Nature', 'Arcane'];

const CIPHER_WORDS = [
  'DARKNESS', 'FREEDOM', 'DRAGON', 'ANCIENT', 'SACRIFICE', 'GUARDIAN',
  'ECLIPSE', 'PHOENIX', 'SORROW', 'TRIUMPH', 'RECKONING', 'IMMORTAL',
  'BETRAYAL', 'SANCTUARY', 'PROPHECY', 'OBLIVION',
];

const LEVER_NAMES = ['Iron', 'Copper', 'Bronze', 'Silver', 'Gold', 'Obsidian', 'Crystal', 'Bone', 'Jade', 'Ruby', 'Emerald', 'Sapphire'];
const LEVER_EFFECTS = [
  'emits a low hum', 'glows faintly', 'causes the floor to vibrate',
  'produces a clicking sound from the walls', 'releases a puff of cold air',
  'makes a grinding noise above', 'causes runes to flicker on the door',
  'triggers a brief flash of light', 'sends sparks along the ceiling',
  'causes water to drip from the walls',
];

const ROOM_ITEMS = [
  { item: 'candles on the altar', countRange: [3, 7] },
  { item: 'skulls on the shelf', countRange: [2, 5] },
  { item: 'pillars in the room', countRange: [4, 8] },
  { item: 'gemstones in the mosaic', countRange: [3, 6] },
  { item: 'statues along the walls', countRange: [2, 6] },
  { item: 'shields mounted above the doorways', countRange: [2, 4] },
  { item: 'torches in their sconces', countRange: [4, 8] },
  { item: 'runes carved into the floor', countRange: [3, 9] },
  { item: 'swords crossed above the mantle', countRange: [2, 4] },
  { item: 'chains hanging from the ceiling', countRange: [3, 6] },
];

const MIRROR_DIRECTIONS = ['north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest'];

const PLATE_SYMBOLS = ['Dragon', 'Phoenix', 'Griffon', 'Unicorn', 'Basilisk', 'Hydra', 'Chimera', 'Manticore', 'Wyvern', 'Kraken'];

const FAILURE_CONSEQUENCES = {
  easy: [
    'A mild shock deals 1d4 lightning damage to whoever touched the puzzle.',
    'The room fills with harmless but foul-smelling smoke for one minute.',
    'A loud alarm sounds — nearby creatures are alerted.',
    'The puzzle resets and the party must wait 1 minute before trying again.',
  ],
  medium: [
    'Poison darts fire from the walls — each creature must make a DC 13 DEX save or take 2d6 piercing damage.',
    'The floor gives way partially — DC 12 DEX save or fall 10 feet into a pit (1d6 bludgeoning).',
    'A glyph of warding triggers: 3d6 fire damage (DC 13 DEX save for half).',
    'The exits seal for 1d4 rounds while a poison gas fills the room (DC 12 CON save or 2d4 poison damage per round).',
  ],
  hard: [
    'The room begins flooding with acid — 3d6 acid damage per round until the puzzle is solved or the party escapes.',
    'A guardian construct (CR appropriate) animates and attacks.',
    'A Reverse Gravity spell triggers for 1 round — DC 15 DEX save or take 4d6 bludgeoning from the ceiling.',
    'A curse afflicts the one who failed: disadvantage on ability checks until Remove Curse is cast.',
    'Necrotic energy pulses outward — 4d8 necrotic damage (DC 15 CON save for half) to all within 30 feet.',
  ],
};

const ROOM_DESCRIPTIONS = [
  'a circular stone chamber with ancient runes carved into every surface, glowing faintly with residual magic',
  'a dusty crypt with crumbling pillars and a heavy stone door blocking the far passage',
  'a cavernous underground hall lit by bioluminescent fungi clinging to the damp walls',
  'a grand dwarven vault with geometric patterns inlaid in bronze across the floor and walls',
  'an overgrown temple ruin where vines creep through cracked marble and a strange altar sits at the center',
  'a frost-covered chamber deep within a glacier, where ice crystals refract dim blue light',
  'a wizard\'s abandoned laboratory, glass vials shattered on the floor, arcane diagrams still visible on the walls',
  'a subterranean shrine with obsidian walls that seem to absorb torchlight, leaving only shadows',
  'a natural cavern where stalactites drip into still pools, and the sound of dripping echoes endlessly',
  'a perfectly preserved elven sanctum with silver filigree on white stone walls, an ethereal glow hanging in the air',
];

/* ── puzzle generators ───────────────────────────────── */

function genRiddleDoor(diff) {
  const r = pick(RIDDLES);
  const room = pick(ROOM_DESCRIPTIONS);
  return {
    type: 'Riddle Door',
    name: `The ${pick(['Whispering','Sealed','Enchanted','Forgotten','Arcane','Silent'])} Door`,
    description: `The party enters ${room}. A massive stone door blocks the way forward. As they approach, a spectral face materialises on the door's surface and speaks in a hollow voice:\n\n"${r.riddle}"`,
    mechanics: `The spectral face waits patiently for an answer. Players may attempt an Intelligence (${diff === 'easy' ? 'DC 10' : diff === 'medium' ? 'DC 13' : 'DC 16'}) check to get a nudge. The door accepts only the correct answer spoken aloud.`,
    solution: r.answer,
    hints: [
      `The face tilts its head and says: "Think not of the literal, but the abstract."`,
      `A faint engraving appears on the wall nearby, depicting a subtle visual clue related to "${r.answer.toLowerCase()}."`,
      `The spectral face sighs: "You carry one with you, or have seen one recently... ${r.answer.split(' ').pop().toLowerCase()}."`,
    ],
    failure: pick(FAILURE_CONSEQUENCES[diff]),
  };
}

function genSymbolSequence(diff) {
  const count = diff === 'easy' ? 3 : diff === 'medium' ? 4 : 5;
  const symbols = pickN(SYMBOLS, count + 2);
  const correct = pickN(symbols, count);
  const room = pick(ROOM_DESCRIPTIONS);
  const clueOrder = ['oldest to youngest', 'weakest to strongest', 'smallest to largest', 'birth to death', 'dawn to dusk'];
  const clue = pick(clueOrder);
  return {
    type: 'Symbol Sequence',
    name: `The ${pick(['Celestial','Ancient','Forbidden','Primordial','Elemental'])} Sequence`,
    description: `The party enters ${room}. On the far wall, ${symbols.length} stone tiles are set into the surface, each bearing a different symbol: ${symbols.join(', ')}. Below them, an inscription reads:\n\n"Arrange the worthy from ${clue}, and the path shall open."`,
    mechanics: `${count} of the ${symbols.length} symbols must be pressed in the correct order. Each press causes the tile to glow. Pressing wrong resets the sequence. Investigation DC ${diff === 'easy' ? '10' : diff === 'medium' ? '13' : '16'} reveals environmental clues about the ordering.`,
    solution: `Correct sequence: ${correct.join(' → ')}`,
    hints: [
      `One of the incorrect symbols (${symbols.find(s => !correct.includes(s))}) has a faded crack through it — it is not part of the solution.`,
      `The first symbol in the sequence is ${correct[0]}, as suggested by a mural near the entrance.`,
      `The order follows the theme "${clue}" — ${correct[0]} comes first, ${correct[correct.length - 1]} comes last.`,
    ],
    failure: pick(FAILURE_CONSEQUENCES[diff]),
  };
}

function genPressurePlate(diff) {
  const gridSize = diff === 'easy' ? 3 : diff === 'medium' ? 4 : 5;
  const plateSymbols = pickN(PLATE_SYMBOLS, gridSize);
  const room = pick(ROOM_DESCRIPTIONS);
  // Generate unique grid positions for each plate
  const allPositions = [];
  for (let r = 1; r <= gridSize; r++) for (let c = 1; c <= gridSize; c++) allPositions.push([r, c]);
  const positions = pickN(allPositions, plateSymbols.length);
  const path = plateSymbols.map((s, i) => `${s} (row ${positions[i][0]}, col ${positions[i][1]})`);
  return {
    type: 'Pressure Plate',
    name: `The ${pick(['Gauntlet','Trial','Passage','Threshold'])} of ${pick(['Stones','Steps','the Worthy','Trials'])}`,
    description: `The party enters ${room}. The floor is a ${gridSize}x${gridSize} grid of stone pressure plates, each engraved with a creature symbol. A plaque on the wall reads:\n\n"Walk the path of the hunter — prey to predator, least to greatest."`,
    mechanics: `Players must step on plates in the correct order. Stepping on a wrong plate triggers a trap. The plates are arranged in a grid and each bears one of these symbols: ${plateSymbols.join(', ')}. A Survival or Nature check (DC ${diff === 'easy' ? '10' : diff === 'medium' ? '13' : '16'}) can help determine the food chain order.`,
    solution: `Correct path: ${path.join(' → ')}`,
    hints: [
      `Claw marks near the edge of the grid suggest the path starts with the smallest creature: ${plateSymbols[0]}.`,
      `A mosaic on the ceiling shows ${plateSymbols[1]} being hunted by ${plateSymbols[2]} — the sequence follows a predator hierarchy.`,
      `The full order from least to greatest: ${plateSymbols.join(' → ')}`,
    ],
    failure: pick(FAILURE_CONSEQUENCES[diff]),
  };
}

function genElementalLock(diff) {
  const slotCount = diff === 'easy' ? 3 : diff === 'medium' ? 4 : 5;
  const elements = pickN(ELEMENTS, slotCount);
  const room = pick(ROOM_DESCRIPTIONS);
  const slots = elements.map((el, i) => ({
    position: pick(['top', 'bottom', 'left', 'right', 'center', 'upper-left', 'upper-right', 'lower-left', 'lower-right']),
    element: el,
  }));
  return {
    type: 'Elemental Lock',
    name: `The ${pick(['Elemental','Primal','Arcane','Convergence'])} Lock`,
    description: `The party enters ${room}. A massive door is sealed by ${slotCount} crystalline slots arranged in a pattern. Each slot pulses with faint energy. Scattered around the room are environmental clues:\n\n${slots.map(s => `• The ${s.position} slot has ${s.element === 'Fire' ? 'scorch marks' : s.element === 'Water' ? 'moisture condensation' : s.element === 'Earth' ? 'crumbling stone dust' : s.element === 'Air' ? 'a faint breeze' : s.element === 'Lightning' ? 'static discharge' : s.element === 'Ice' ? 'frost crystals' : s.element === 'Shadow' ? 'an absence of light' : s.element === 'Light' ? 'a warm glow' : s.element === 'Nature' ? 'tiny vines' : 'faint arcane symbols'} around it.`).join('\n')}`,
    mechanics: `Players must channel the correct element into each slot using spells, items, or creative problem-solving. Arcana check DC ${diff === 'easy' ? '10' : diff === 'medium' ? '13' : '16'} can identify what element each slot requires. Wrong elements cause a backlash.`,
    solution: `Slot assignments: ${slots.map(s => `${s.position} = ${s.element}`).join(', ')}`,
    hints: [
      `The environmental clues around each slot directly indicate the element needed. The ${slots[0].position} slot clearly needs ${slots[0].element}.`,
      `${slots.length > 2 ? `The ${slots[1].position} slot requires ${slots[1].element}, and the ${slots[2].position} slot requires ${slots[2].element}.` : `The ${slots[1].position} slot requires ${slots[1].element}.`}`,
      `Full solution: ${slots.map(s => `${s.position} = ${s.element}`).join(', ')}`,
    ],
    failure: pick(FAILURE_CONSEQUENCES[diff]),
  };
}

function genMirrorPuzzle(diff) {
  const mirrorCount = diff === 'easy' ? 3 : diff === 'medium' ? 4 : 6;
  const mirrors = Array.from({ length: mirrorCount }, (_, i) => ({
    id: i + 1,
    facing: pick(MIRROR_DIRECTIONS),
    correct: pick(MIRROR_DIRECTIONS),
  }));
  const room = pick(ROOM_DESCRIPTIONS);
  const source = pick(['a beam of sunlight from a crack in the ceiling', 'a glowing crystal embedded in the wall', 'a magical flame hovering above a pedestal', 'a shaft of moonlight filtering through a skylight']);
  return {
    type: 'Mirror Puzzle',
    name: `The ${pick(['Hall','Chamber','Gallery','Sanctum'])} of ${pick(['Reflections','Light','Mirrors','Illumination'])}`,
    description: `The party enters ${room}. ${mirrorCount} tarnished bronze mirrors are mounted on adjustable pivots around the chamber. ${source.charAt(0).toUpperCase() + source.slice(1)} provides the light source. A sealed crystal door on the far wall has a small lens at its center that needs to be struck by the beam.`,
    mechanics: `Each mirror can be rotated to redirect the light beam. Players must chain the reflections from the source to the crystal lens on the door. Each mirror currently faces the wrong direction. Intelligence (Investigation) DC ${diff === 'easy' ? '10' : diff === 'medium' ? '13' : '16'} to figure out the path. Each mirror adjustment is a free action.`,
    solution: `Mirror positions: ${mirrors.map(m => `Mirror ${m.id}: rotate to face ${m.correct}`).join(', ')}. The beam path is: Source → ${mirrors.map(m => `Mirror ${m.id}`).join(' → ')} → Crystal lens.`,
    hints: [
      `The light source enters from the ${pick(MIRROR_DIRECTIONS)} side. Mirror 1 is closest to the source and should redirect the beam toward Mirror 2.`,
      `Mirrors ${mirrors[0].id} and ${mirrors[1].id} should face ${mirrors[0].correct} and ${mirrors[1].correct} respectively.`,
      `The full chain: ${mirrors.map(m => `Mirror ${m.id} → ${m.correct}`).join(', ')}`,
    ],
    failure: pick(FAILURE_CONSEQUENCES[diff]),
  };
}

function genCipher(diff) {
  const word = pick(CIPHER_WORDS);
  const shift = diff === 'easy' ? 1 : diff === 'medium' ? roll(3, 7) : roll(8, 15);
  const encoded = word.split('').map(c => {
    const code = c.charCodeAt(0) - 65;
    return String.fromCharCode(((code + shift) % 26) + 65);
  }).join('');
  const room = pick(ROOM_DESCRIPTIONS);
  const cipherName = pick(['Caesar', 'Shifting Rune', 'Rotational Glyph', 'Arcane Offset']);
  return {
    type: 'Cipher / Code',
    name: `The ${pick(['Encoded','Cryptic','Secret','Hidden'])} ${pick(['Message','Inscription','Tablet','Scroll'])}`,
    description: `The party enters ${room}. Carved into an ancient stone tablet is a string of unfamiliar letters:\n\n"${encoded}"\n\nBelow it, a keyhole awaits a spoken word. The walls are covered in repeating alphabet sequences with some letters highlighted.`,
    mechanics: `This is a ${cipherName} cipher with a shift of ${shift}. Players can attempt Intelligence (Investigation) DC ${diff === 'easy' ? '10' : diff === 'medium' ? '14' : '17'} to recognize the cipher type. Each letter is shifted ${shift} positions forward in the alphabet. Players must decode the message and speak the answer aloud.`,
    solution: `The encoded text "${encoded}" decodes to "${word}" using a shift of ${shift}.`,
    hints: [
      `The alphabet sequences on the wall suggest a substitution cipher. The shift is consistent for every letter.`,
      `The first letter "${encoded[0]}" decodes to "${word[0]}". The shift is ${shift} positions.`,
      `The decoded word is "${word}".`,
    ],
    failure: pick(FAILURE_CONSEQUENCES[diff]),
  };
}

function genCountingPuzzle(diff) {
  const itemCount = diff === 'easy' ? 2 : diff === 'medium' ? 3 : 4;
  const items = pickN(ROOM_ITEMS, itemCount).map(it => ({
    ...it,
    count: roll(it.countRange[0], it.countRange[1]),
  }));
  const combo = items.map(i => i.count).join('-');
  const room = pick(ROOM_DESCRIPTIONS);
  return {
    type: 'Counting Puzzle',
    name: `The ${pick(['Vault','Lock','Combination','Sealed'])} ${pick(['Door','Gate','Chest','Chamber'])}`,
    description: `The party enters ${room}. A heavy ${pick(['iron door','stone vault','ornate chest','crystal barrier'])} is sealed with a combination lock that requires ${itemCount} numbers. An inscription reads:\n\n"Count what can be counted, and the truth shall set you free."\n\nThe room contains:\n${items.map(i => `• ${i.count} ${i.item}`).join('\n')}`,
    mechanics: `Players must carefully count specific objects in the room to determine the combination. Perception check DC ${diff === 'easy' ? '8' : diff === 'medium' ? '12' : '15'} helps ensure accurate counting. The combination must be entered in the order the objects appear (left to right, or as encountered).`,
    solution: `The combination is ${combo} (${items.map(i => `${i.count} ${i.item}`).join(', ')}).`,
    hints: [
      `The inscription mentions counting — look carefully at repeating objects in the room.`,
      `The first number is ${items[0].count}, corresponding to the ${items[0].item}.`,
      `The full combination is ${combo}: ${items.map(i => `${i.count} ${i.item}`).join(', ')}.`,
    ],
    failure: pick(FAILURE_CONSEQUENCES[diff]),
  };
}

function genLeverPuzzle(diff) {
  const leverCount = diff === 'easy' ? 3 : diff === 'medium' ? 4 : 5;
  const levers = pickN(LEVER_NAMES, leverCount).map((name, i) => ({
    name, effect: pick(LEVER_EFFECTS),
  }));
  const correctOrder = shuffle(levers.map(l => l.name));
  const room = pick(ROOM_DESCRIPTIONS);
  return {
    type: 'Lever Puzzle',
    name: `The ${pick(['Mechanism','Contraption','Apparatus','Device'])} of ${pick(['the Ancients','Iron','the Dwarves','Shadows'])}`,
    description: `The party enters ${room}. On the wall are ${leverCount} levers, each made of a different material:\n\n${levers.map(l => `• The ${l.name} lever — pulling it ${l.effect}`).join('\n')}\n\nAbove them, a worn inscription reads: "In the proper order, the way opens. In the wrong order, peril awaits."`,
    mechanics: `The levers must be pulled in the correct order. Each lever produces a different effect when pulled. Investigation DC ${diff === 'easy' ? '10' : diff === 'medium' ? '13' : '16'} can reveal clues about the order. Pulling in the wrong order resets the mechanism and triggers a trap.`,
    solution: `Correct order: ${correctOrder.join(' → ')}`,
    hints: [
      `The effects give clues about the sequence. The first lever to pull is the one that ${levers.find(l => l.name === correctOrder[0])?.effect || 'glows faintly'} — the ${correctOrder[0]} lever.`,
      `The first two in order are: ${correctOrder[0]} → ${correctOrder[1]}.`,
      `Full order: ${correctOrder.join(' → ')}`,
    ],
    failure: pick(FAILURE_CONSEQUENCES[diff]),
  };
}

const PUZZLE_TYPES = [
  { key: 'riddle', label: 'Riddle Door', gen: genRiddleDoor },
  { key: 'symbol', label: 'Symbol Sequence', gen: genSymbolSequence },
  { key: 'pressure', label: 'Pressure Plate', gen: genPressurePlate },
  { key: 'elemental', label: 'Elemental Lock', gen: genElementalLock },
  { key: 'mirror', label: 'Mirror Puzzle', gen: genMirrorPuzzle },
  { key: 'cipher', label: 'Cipher / Code', gen: genCipher },
  { key: 'counting', label: 'Counting Puzzle', gen: genCountingPuzzle },
  { key: 'lever', label: 'Lever Puzzle', gen: genLeverPuzzle },
];

const DIFFICULTIES = ['easy', 'medium', 'hard'];

/* ── collapsible section component ───────────────────── */
function Section({ title, icon: Icon, iconColor, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: '6px' }}>
      <button onClick={() => setOpen(!open)} style={sectionHeadStyle}>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        {Icon && <Icon size={13} style={{ color: iconColor || PURPLE }} />}
        <span>{title}</span>
      </button>
      {open && (
        <div style={{
          padding: '10px 14px', fontSize: '13px', lineHeight: 1.6,
          color: 'var(--text)', fontFamily: 'var(--font-ui)',
          whiteSpace: 'pre-wrap',
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ── main component ──────────────────────────────────── */
export default function PuzzleGenerator() {
  const [difficulty, setDifficulty] = useState('medium');
  const [puzzleType, setPuzzleType] = useState('random');
  const [puzzle, setPuzzle] = useState(null);
  const [revealedHints, setRevealedHints] = useState([]);
  const [solutionRevealed, setSolutionRevealed] = useState(false);

  const generate = () => {
    const type = puzzleType === 'random'
      ? pick(PUZZLE_TYPES)
      : PUZZLE_TYPES.find(t => t.key === puzzleType);
    const result = type.gen(difficulty);
    result.difficulty = difficulty;
    setPuzzle(result);
    setRevealedHints([]);
    setSolutionRevealed(false);
  };

  const revealHint = (index) => {
    if (!revealedHints.includes(index)) {
      setRevealedHints([...revealedHints, index]);
    }
  };

  const copyPuzzle = () => {
    if (!puzzle) return;
    const text = [
      `## ${puzzle.name} (${puzzle.type})`,
      `**Difficulty:** ${puzzle.difficulty}`,
      '',
      `### Description`,
      puzzle.description,
      '',
      `### Mechanics`,
      puzzle.mechanics,
      '',
      `### Hints`,
      ...puzzle.hints.map((h, i) => `${i + 1}. ${h}`),
      '',
      `### Solution`,
      puzzle.solution,
      '',
      `### Failure Consequence`,
      puzzle.failure,
    ].join('\n');
    navigator.clipboard.writeText(text).catch(() => {});
  };

  const diffColor = difficulty === 'easy' ? '#4ade80' : difficulty === 'medium' ? '#c9a84c' : '#ef4444';

  return (
    <div style={panelBg}>
      {/* header */}
      <div style={headerStyle}>
        <Puzzle size={12} style={{ color: PURPLE }} />
        Puzzle Generator
      </div>

      {/* controls */}
      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Difficulty</label>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              style={selectStyle}
            >
              {DIFFICULTIES.map(d => (
                <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Puzzle Type</label>
            <select
              value={puzzleType}
              onChange={e => setPuzzleType(e.target.value)}
              style={selectStyle}
            >
              <option value="random">Random</option>
              {PUZZLE_TYPES.map(t => (
                <option key={t.key} value={t.key}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        <button onClick={generate} style={primaryBtn}>
          <Dices size={14} /> Generate Puzzle
        </button>
      </div>

      {/* generated puzzle */}
      {puzzle && (
        <div style={{
          margin: '0 12px 12px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '10px', padding: '12px',
        }}>
          {/* puzzle title bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '10px', flexWrap: 'wrap', gap: '6px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '14px', fontWeight: 700, color: 'var(--text)',
                fontFamily: 'var(--font-ui)',
              }}>{puzzle.name}</span>
              <span style={{
                fontSize: '10px', fontWeight: 600, padding: '2px 8px',
                borderRadius: '4px', textTransform: 'capitalize',
                background: `${diffColor}22`, color: diffColor,
                border: `1px solid ${diffColor}44`,
                fontFamily: 'var(--font-ui)',
              }}>{puzzle.difficulty}</span>
              <span style={{
                fontSize: '10px', fontWeight: 600, padding: '2px 8px',
                borderRadius: '4px',
                background: `${PURPLE}22`, color: PURPLE,
                border: `1px solid ${PURPLE}44`,
                fontFamily: 'var(--font-ui)',
              }}>{puzzle.type}</span>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={copyPuzzle} style={ghostBtn} title="Copy to clipboard">
                <Copy size={12} /> Copy
              </button>
              <button onClick={generate} style={ghostBtn} title="Regenerate">
                <RefreshCw size={12} /> New
              </button>
            </div>
          </div>

          {/* sections */}
          <Section title="Description (Read Aloud)" icon={Puzzle} defaultOpen>
            {puzzle.description}
          </Section>

          <Section title="Mechanics" icon={Puzzle} iconColor="#60a5fa" defaultOpen>
            {puzzle.mechanics}
          </Section>

          <Section title="Hints" icon={Lightbulb} iconColor="#c9a84c">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {puzzle.hints.map((hint, i) => (
                <div key={i}>
                  {revealedHints.includes(i) ? (
                    <div style={{
                      padding: '8px 12px', borderRadius: '6px',
                      background: 'rgba(201,168,76,0.08)',
                      border: '1px solid rgba(201,168,76,0.2)',
                      fontSize: '12px', lineHeight: 1.5,
                    }}>
                      <strong style={{ color: '#c9a84c' }}>Hint {i + 1}:</strong> {hint}
                    </div>
                  ) : (
                    <button
                      onClick={() => revealHint(i)}
                      style={{
                        ...ghostBtn,
                        width: '100%', justifyContent: 'center',
                        background: 'rgba(201,168,76,0.06)',
                        border: '1px solid rgba(201,168,76,0.15)',
                        color: '#c9a84c',
                      }}
                    >
                      <Eye size={12} /> Reveal Hint {i + 1}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Section>

          <Section title="Failure Consequence" icon={AlertTriangle} iconColor="#ef4444">
            {puzzle.failure}
          </Section>

          {/* solution spoiler */}
          <div style={{ marginTop: '6px' }}>
            {solutionRevealed ? (
              <div style={{
                padding: '10px 14px', borderRadius: '8px',
                background: 'rgba(167,139,250,0.08)',
                border: '1px solid rgba(167,139,250,0.2)',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: '6px',
                }}>
                  <span style={{
                    fontSize: '11px', fontWeight: 700, color: PURPLE,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    fontFamily: 'var(--font-ui)',
                  }}>Solution</span>
                  <button onClick={() => setSolutionRevealed(false)} style={ghostBtn}>
                    <EyeOff size={12} /> Hide
                  </button>
                </div>
                <div style={{
                  fontSize: '13px', lineHeight: 1.6, color: 'var(--text)',
                  fontFamily: 'var(--font-ui)', whiteSpace: 'pre-wrap',
                }}>
                  {puzzle.solution}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setSolutionRevealed(true)}
                style={{
                  ...primaryBtn, width: '100%', justifyContent: 'center',
                }}
              >
                <Eye size={14} /> Reveal Solution
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
