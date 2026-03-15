import { useState, useMemo, useCallback } from 'react';
import { pick } from '../../utils/dndHelpers';
import {
  Swords, RefreshCw, Copy, ChevronDown, Shield, Skull,
  TreePine, Mountain, Sun, Droplets, Eye, Building2,
  Waves, Snowflake, Sprout, DoorOpen, AlertTriangle, Zap,
} from 'lucide-react';

/* ─── XP thresholds per character level (DMG p.82) ─── */
const XP_THRESHOLDS = {
  1:  { easy: 25,  medium: 50,   hard: 75,   deadly: 100  },
  2:  { easy: 50,  medium: 100,  hard: 150,  deadly: 200  },
  3:  { easy: 75,  medium: 150,  hard: 225,  deadly: 400  },
  4:  { easy: 125, medium: 250,  hard: 375,  deadly: 500  },
  5:  { easy: 250, medium: 500,  hard: 750,  deadly: 1100 },
  6:  { easy: 300, medium: 600,  hard: 900,  deadly: 1400 },
  7:  { easy: 350, medium: 750,  hard: 1100, deadly: 1700 },
  8:  { easy: 450, medium: 900,  hard: 1400, deadly: 2100 },
  9:  { easy: 550, medium: 1100, hard: 1600, deadly: 2400 },
  10: { easy: 600, medium: 1200, hard: 1900, deadly: 2800 },
  11: { easy: 800, medium: 1600, hard: 2400, deadly: 3600 },
  12: { easy: 1000,medium: 2000, hard: 3000, deadly: 4500 },
  13: { easy: 1100,medium: 2200, hard: 3400, deadly: 5100 },
  14: { easy: 1250,medium: 2500, hard: 3800, deadly: 5700 },
  15: { easy: 1400,medium: 2800, hard: 4300, deadly: 6400 },
  16: { easy: 1600,medium: 3200, hard: 4800, deadly: 7200 },
  17: { easy: 2000,medium: 3900, hard: 5900, deadly: 8800 },
  18: { easy: 2100,medium: 4200, hard: 6300, deadly: 9500 },
  19: { easy: 2400,medium: 4900, hard: 7300, deadly: 10900},
  20: { easy: 2800,medium: 5700, hard: 8500, deadly: 12700},
};

/* ─── CR → XP mapping (DMG p.275) ─── */
const CR_XP = {
  0: 10, 0.125: 25, 0.25: 50, 0.5: 100,
  1: 200, 2: 450, 3: 700, 4: 1100, 5: 1800,
  6: 2300, 7: 2900, 8: 3900, 9: 5000, 10: 5900,
  11: 7200, 12: 8400, 13: 10000, 14: 11500, 15: 13000,
  16: 15000, 17: 18000, 18: 20000, 19: 22000, 20: 25000,
  21: 33000, 22: 41000, 23: 50000, 24: 62000, 25: 75000,
  26: 90000, 27: 105000, 28: 120000, 29: 135000, 30: 155000,
};

/* ─── Encounter multiplier by monster count (DMG p.82) ─── */
function getMultiplier(monsterCount) {
  if (monsterCount <= 1)  return 1;
  if (monsterCount === 2) return 1.5;
  if (monsterCount <= 6)  return 2;
  if (monsterCount <= 10) return 2.5;
  if (monsterCount <= 14) return 3;
  return 4;
}

/* ─── Biome data ─── */
const BIOMES = [
  { key: 'forest',    label: 'Forest',    Icon: TreePine },
  { key: 'mountain',  label: 'Mountain',  Icon: Mountain },
  { key: 'desert',    label: 'Desert',    Icon: Sun },
  { key: 'swamp',     label: 'Swamp',     Icon: Droplets },
  { key: 'underdark', label: 'Underdark', Icon: Eye },
  { key: 'urban',     label: 'Urban',     Icon: Building2 },
  { key: 'coastal',   label: 'Coastal',   Icon: Waves },
  { key: 'arctic',    label: 'Arctic',    Icon: Snowflake },
  { key: 'grassland', label: 'Grassland', Icon: Sprout },
  { key: 'dungeon',   label: 'Dungeon',   Icon: DoorOpen },
];

/* ─── Monster tables per biome ─── */
const BIOME_MONSTERS = {
  forest: [
    { name: 'Twig Blight',      cr: 0.125 },
    { name: 'Giant Rat',         cr: 0.125 },
    { name: 'Wolf',              cr: 0.25  },
    { name: 'Pixie',             cr: 0.25  },
    { name: 'Giant Spider',      cr: 1     },
    { name: 'Dire Wolf',         cr: 1     },
    { name: 'Goblin',            cr: 0.25  },
    { name: 'Bugbear',           cr: 1     },
    { name: 'Ettercap',          cr: 2     },
    { name: 'Owlbear',           cr: 3     },
    { name: 'Green Hag',         cr: 3     },
    { name: 'Werewolf',          cr: 3     },
    { name: 'Displacer Beast',   cr: 3     },
    { name: 'Troll',             cr: 5     },
    { name: 'Shambling Mound',   cr: 5     },
    { name: 'Unicorn',           cr: 5     },
    { name: 'Young Green Dragon',cr: 8     },
    { name: 'Treant',            cr: 9     },
    { name: 'Guardian Naga',     cr: 10    },
    { name: 'Adult Green Dragon',cr: 15    },
    { name: 'Ancient Green Dragon', cr: 22 },
  ],
  mountain: [
    { name: 'Kobold',            cr: 0.125 },
    { name: 'Blood Hawk',        cr: 0.125 },
    { name: 'Giant Goat',        cr: 0.5   },
    { name: 'Pteranodon',        cr: 0.25  },
    { name: 'Orc',               cr: 0.5   },
    { name: 'Half-Ogre',         cr: 1     },
    { name: 'Hippogriff',        cr: 1     },
    { name: 'Ogre',              cr: 2     },
    { name: 'Griffon',           cr: 2     },
    { name: 'Peryton',           cr: 2     },
    { name: 'Manticore',         cr: 3     },
    { name: 'Basilisk',          cr: 3     },
    { name: 'Bulette',           cr: 5     },
    { name: 'Air Elemental',     cr: 5     },
    { name: 'Chimera',           cr: 6     },
    { name: 'Young Red Dragon',  cr: 10    },
    { name: 'Frost Giant',       cr: 8     },
    { name: 'Stone Giant',       cr: 7     },
    { name: 'Cloud Giant',       cr: 9     },
    { name: 'Roc',               cr: 11    },
    { name: 'Adult Red Dragon',  cr: 17    },
    { name: 'Ancient Red Dragon',cr: 24    },
  ],
  desert: [
    { name: 'Scorpion',          cr: 0     },
    { name: 'Jackal',            cr: 0     },
    { name: 'Giant Lizard',      cr: 0.25  },
    { name: 'Giant Scorpion',    cr: 3     },
    { name: 'Mummy',             cr: 3     },
    { name: 'Gnoll',             cr: 0.5   },
    { name: 'Dust Mephit',       cr: 0.5   },
    { name: 'Gnoll Pack Lord',   cr: 2     },
    { name: 'Yuan-Ti Malison',   cr: 3     },
    { name: 'Lamia',             cr: 4     },
    { name: 'Fire Elemental',    cr: 5     },
    { name: 'Young Blue Dragon', cr: 9     },
    { name: 'Medusa',            cr: 6     },
    { name: 'Efreeti',           cr: 11    },
    { name: 'Mummy Lord',        cr: 15    },
    { name: 'Adult Blue Dragon', cr: 16    },
    { name: 'Androsphinx',       cr: 17    },
    { name: 'Ancient Blue Dragon',cr: 23   },
  ],
  swamp: [
    { name: 'Frog',              cr: 0     },
    { name: 'Giant Frog',        cr: 0.25  },
    { name: 'Lizardfolk',        cr: 0.5   },
    { name: 'Zombie',            cr: 0.25  },
    { name: 'Crocodile',         cr: 0.5   },
    { name: 'Ghoul',             cr: 1     },
    { name: 'Giant Constrictor Snake', cr: 2 },
    { name: 'Will-o\'-Wisp',    cr: 2     },
    { name: 'Green Hag',         cr: 3     },
    { name: 'Wight',             cr: 3     },
    { name: 'Giant Crocodile',   cr: 5     },
    { name: 'Shambling Mound',   cr: 5     },
    { name: 'Troll',             cr: 5     },
    { name: 'Young Black Dragon',cr: 7     },
    { name: 'Hydra',             cr: 8     },
    { name: 'Spirit Naga',       cr: 8     },
    { name: 'Adult Black Dragon',cr: 14    },
    { name: 'Ancient Black Dragon', cr: 21 },
  ],
  underdark: [
    { name: 'Giant Fire Beetle', cr: 0     },
    { name: 'Myconid Sprout',    cr: 0     },
    { name: 'Kobold',            cr: 0.125 },
    { name: 'Skeleton',          cr: 0.25  },
    { name: 'Drow',              cr: 0.25  },
    { name: 'Piercer',           cr: 0.5   },
    { name: 'Darkmantle',        cr: 0.5   },
    { name: 'Intellect Devourer',cr: 2     },
    { name: 'Minotaur',          cr: 3     },
    { name: 'Hook Horror',       cr: 3     },
    { name: 'Drider',            cr: 6     },
    { name: 'Cloaker',           cr: 8     },
    { name: 'Mind Flayer',       cr: 7     },
    { name: 'Drow Priestess',    cr: 8     },
    { name: 'Umber Hulk',        cr: 5     },
    { name: 'Beholder',          cr: 13    },
    { name: 'Purple Worm',       cr: 15    },
    { name: 'Death Tyrant',      cr: 14    },
    { name: 'Elder Brain',       cr: 14    },
  ],
  urban: [
    { name: 'Commoner',          cr: 0     },
    { name: 'Noble',             cr: 0.125 },
    { name: 'Bandit',            cr: 0.125 },
    { name: 'Guard',             cr: 0.125 },
    { name: 'Thug',              cr: 0.5   },
    { name: 'Spy',               cr: 1     },
    { name: 'Bandit Captain',    cr: 2     },
    { name: 'Wererat',           cr: 2     },
    { name: 'Gargoyle',          cr: 2     },
    { name: 'Knight',            cr: 3     },
    { name: 'Veteran',           cr: 3     },
    { name: 'Assassin',          cr: 8     },
    { name: 'Mage',              cr: 6     },
    { name: 'Archmage',          cr: 12    },
    { name: 'Vampire',           cr: 13    },
    { name: 'Rakshasa',          cr: 13    },
    { name: 'Adult Bronze Dragon',cr: 15   },
  ],
  coastal: [
    { name: 'Crab',              cr: 0     },
    { name: 'Giant Crab',        cr: 0.125 },
    { name: 'Sahuagin',          cr: 0.5   },
    { name: 'Merfolk',           cr: 0.125 },
    { name: 'Reef Shark',        cr: 0.5   },
    { name: 'Sea Hag',           cr: 2     },
    { name: 'Merrow',            cr: 2     },
    { name: 'Harpy',             cr: 1     },
    { name: 'Hunter Shark',      cr: 2     },
    { name: 'Sahuagin Priestess',cr: 2     },
    { name: 'Water Elemental',   cr: 5     },
    { name: 'Young Bronze Dragon',cr: 8    },
    { name: 'Marid',             cr: 11    },
    { name: 'Storm Giant',       cr: 13    },
    { name: 'Dragon Turtle',     cr: 17    },
    { name: 'Kraken',            cr: 23    },
  ],
  arctic: [
    { name: 'Ice Mephit',        cr: 0.5   },
    { name: 'Polar Bear',        cr: 2     },
    { name: 'Saber-Toothed Tiger',cr: 2    },
    { name: 'Wolf',              cr: 0.25  },
    { name: 'Dire Wolf',         cr: 1     },
    { name: 'Berserker',         cr: 2     },
    { name: 'Winter Wolf',       cr: 3     },
    { name: 'Yeti',              cr: 3     },
    { name: 'Ice Troll',         cr: 5     },
    { name: 'Young White Dragon',cr: 6     },
    { name: 'Frost Giant',       cr: 8     },
    { name: 'Abominable Yeti',   cr: 9     },
    { name: 'Young Remorhaz',    cr: 5     },
    { name: 'Remorhaz',          cr: 11    },
    { name: 'Adult White Dragon',cr: 13    },
    { name: 'Ancient White Dragon',cr: 20  },
  ],
  grassland: [
    { name: 'Giant Weasel',      cr: 0.125 },
    { name: 'Hyena',             cr: 0     },
    { name: 'Vulture',           cr: 0     },
    { name: 'Axe Beak',          cr: 0.25  },
    { name: 'Goblin',            cr: 0.25  },
    { name: 'Gnoll',             cr: 0.5   },
    { name: 'Lion',              cr: 1     },
    { name: 'Giant Hyena',       cr: 1     },
    { name: 'Ankheg',            cr: 2     },
    { name: 'Rhinoceros',        cr: 2     },
    { name: 'Centaur',           cr: 2     },
    { name: 'Owlbear',           cr: 3     },
    { name: 'Elephant',          cr: 4     },
    { name: 'Bulette',           cr: 5     },
    { name: 'Triceratops',       cr: 5     },
    { name: 'Cyclops',           cr: 6     },
    { name: 'Young Gold Dragon', cr: 10    },
    { name: 'Adult Gold Dragon', cr: 17    },
  ],
  dungeon: [
    { name: 'Giant Rat',         cr: 0.125 },
    { name: 'Skeleton',          cr: 0.25  },
    { name: 'Zombie',            cr: 0.25  },
    { name: 'Goblin',            cr: 0.25  },
    { name: 'Kobold',            cr: 0.125 },
    { name: 'Rust Monster',      cr: 0.5   },
    { name: 'Ghoul',             cr: 1     },
    { name: 'Specter',           cr: 1     },
    { name: 'Gelatinous Cube',   cr: 2     },
    { name: 'Mimic',             cr: 2     },
    { name: 'Ochre Jelly',       cr: 2     },
    { name: 'Wight',             cr: 3     },
    { name: 'Wraith',            cr: 5     },
    { name: 'Flesh Golem',       cr: 5     },
    { name: 'Otyugh',            cr: 5     },
    { name: 'Young Red Dragon',  cr: 10    },
    { name: 'Beholder',          cr: 13    },
    { name: 'Iron Golem',        cr: 16    },
    { name: 'Lich',              cr: 21    },
    { name: 'Demilich',          cr: 18    },
  ],
};

/* ─── Environmental hazards per biome ─── */
const BIOME_HAZARDS = {
  forest: [
    'Dense undergrowth provides half cover but difficult terrain',
    'Thick canopy blocks sunlight — dim light at ground level',
    'Tangled roots create natural tripwires (DC 12 DEX or fall prone)',
    'A patch of quicksand lurks beneath dead leaves (DC 13 STR to escape)',
    'Fallen tree blocks the path, forcing a detour or DC 10 Athletics to climb',
  ],
  mountain: [
    'Loose scree — difficult terrain, DC 12 DEX to avoid sliding 10 ft',
    'High altitude: CON save DC 10 or gain 1 level of exhaustion per hour',
    'Narrow ledge (2 ft wide) over a 200-ft drop',
    'Sudden rockslide — DC 14 DEX save or 2d10 bludgeoning damage',
    'Howling winds impose disadvantage on ranged attacks',
  ],
  desert: [
    'Extreme heat: CON save DC 10 per hour or gain exhaustion',
    'Sandstorm reduces visibility to 30 ft, disadvantage on Perception',
    'Shifting sand dunes — difficult terrain everywhere',
    'Mirage disorients the party: DC 13 WIS (Survival) to stay on track',
    'Sun glare imposes disadvantage on Perception checks relying on sight',
  ],
  swamp: [
    'Murky water (waist-deep) — difficult terrain, half speed',
    'Poisonous fog: DC 12 CON save or poisoned for 1 hour',
    'Quicksand bog: DC 13 STR (Athletics) to escape, sinking each round',
    'Swarms of biting insects: DC 11 CON save or distracted (disadvantage on concentration)',
    'Unstable ground — DC 10 DEX or fall into hidden sinkhole (1d6 damage)',
  ],
  underdark: [
    'Total darkness — no natural light source',
    'Unstable ceiling: loud noises trigger rockfall (DC 13 DEX, 2d6 bludgeoning)',
    'Faerzress zone — magic surges cause Wild Magic effects on spellcasting',
    'Mushroom spores: DC 12 CON save or hallucinate for 1d4 rounds',
    'Narrow tunnel (3 ft wide) — Medium creatures squeeze, half speed',
  ],
  urban: [
    'Crowded streets provide three-quarters cover to fleeing targets',
    'Rooftop chase: DC 12 Athletics/Acrobatics to jump between buildings (10 ft gap)',
    'Collateral damage: stray attacks risk hitting bystanders (roll d20, hit on 1)',
    'Sewer grates allow escape underground — DC 14 Investigation to track',
    'Guard patrols arrive in 1d4+1 rounds after combat noise',
  ],
  coastal: [
    'Slippery rocks: DC 12 DEX (Acrobatics) or fall prone',
    'Incoming tide raises water 1 ft every 2 rounds',
    'Strong undertow: DC 13 STR (Athletics) to swim, or pulled 15 ft out',
    'Sea spray imposes disadvantage on fire-based attacks',
    'Fog bank rolls in — heavily obscured beyond 20 ft',
  ],
  arctic: [
    'Extreme cold: CON save DC 10 per hour or gain exhaustion (no cold resistance)',
    'Thin ice: DC 12 DEX or fall through into freezing water (1d6 cold/round)',
    'Blizzard: heavily obscured, disadvantage on Perception, half speed',
    'Snow drifts — difficult terrain across the area',
    'Ice slick: DC 13 DEX (Acrobatics) or fall prone at start of turn',
  ],
  grassland: [
    'Tall grass (4 ft) provides concealment for Medium or smaller creatures',
    'Wildfire sweeps across the field — 2d6 fire damage per round in the area',
    'Stampede of beasts — DC 14 DEX save or 3d10 bludgeoning damage',
    'Open terrain — no cover, ranged attackers have advantage at long range',
    'Hidden burrow holes — DC 12 DEX or twist ankle (speed halved for 1 hour)',
  ],
  dungeon: [
    'Trapped hallway: DC 14 Investigation to find, DC 14 DEX save or 2d10 piercing',
    'Collapsing floor: DC 12 DEX save or fall 20 ft (2d6 bludgeoning)',
    'Locked portcullis slams down, splitting the party',
    'Room floods with water — rises 1 ft per round',
    'Anti-magic zone suppresses all spells and magic items in a 30-ft area',
  ],
};

/* ─── Tactical suggestions per biome ─── */
const BIOME_TACTICS = {
  forest: [
    'Monsters use trees for cover and ambush from above',
    'Enemies retreat into dense brush to break line of sight',
    'Foes use pack tactics, flanking from multiple directions',
    'Archers fire from elevated tree platforms',
  ],
  mountain: [
    'Enemies hold the high ground, forcing uphill assault',
    'Monsters use narrow passes to negate numerical advantage',
    'Foes push characters toward cliff edges (shove attacks)',
    'Ranged attackers snipe from concealed ledges',
  ],
  desert: [
    'Enemies burrow beneath sand and burst out for surprise attacks',
    'Foes use the blinding sun behind them for advantage',
    'Monsters conserve energy, letting the heat weaken the party first',
    'Hit-and-run tactics using superior knowledge of oasis locations',
  ],
  swamp: [
    'Enemies lurk beneath murky water, gaining surprise',
    'Foes drag characters into deep water to drown them',
    'Monsters use fog and mist for concealment between attacks',
    'Amphibious creatures retreat underwater when injured',
  ],
  underdark: [
    'Enemies exploit darkness — attack from beyond darkvision range',
    'Foes collapse tunnels to cut off retreat',
    'Monsters use verticality: ceilings, walls, pits',
    'Ambushers disguise themselves as natural cave features',
  ],
  urban: [
    'Enemies use civilians as shields or distractions',
    'Foes split up and flee through alleyways and buildings',
    'Ambush from rooftops and upper-floor windows',
    'Reinforcements arrive from adjacent buildings',
  ],
  coastal: [
    'Aquatic enemies drag characters into the water',
    'Foes use the tide to their advantage — fight during high water',
    'Monsters attack from underwater, surfacing only to strike',
    'Enemies retreat into the sea when the fight turns against them',
  ],
  arctic: [
    'Enemies use blizzard conditions to approach unseen',
    'Foes lure party onto thin ice, then break it',
    'Monsters use white coloring for camouflage in snow',
    'Hit-and-run from snowdrifts, using burrow speed',
  ],
  grassland: [
    'Mounted enemies use superior speed for hit-and-run attacks',
    'Foes set fire to grass to herd the party',
    'Enemies use tall grass for concealment and ambush',
    'Ranged attackers exploit the open ground — no cover for the party',
  ],
  dungeon: [
    'Enemies funnel the party through chokepoints',
    'Foes trigger traps behind the party to cut off retreat',
    'Monsters use secret doors and passages to flank',
    'Enemies extinguish light sources to fight in darkness',
  ],
};

/* ─── Helpers ─── */
function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function crLabel(cr) { return cr < 1 ? (cr === 0.125 ? '1/8' : cr === 0.25 ? '1/4' : cr === 0.5 ? '1/2' : '0') : String(cr); }

/* ─── Encounter builder logic ─── */
function buildEncounter(biome, partyLevel, partySize, difficulty) {
  const level = Math.max(1, Math.min(20, partyLevel));
  const size  = Math.max(1, Math.min(6, partySize));
  const thresholds = XP_THRESHOLDS[level];
  const budget = thresholds[difficulty] * size;

  const monsters = BIOME_MONSTERS[biome] || BIOME_MONSTERS.forest;
  // Filter to monsters the party can actually face
  const maxCR = level + 3;
  const eligible = monsters.filter(m => CR_XP[m.cr] !== undefined && m.cr <= maxCR && CR_XP[m.cr] <= budget);

  if (eligible.length === 0) {
    return null;
  }

  // Try to fill the XP budget
  let remaining = budget;
  const chosen = [];
  const attempts = 200;

  for (let i = 0; i < attempts && remaining > 0; i++) {
    const pool = eligible.filter(m => CR_XP[m.cr] <= remaining);
    if (pool.length === 0) break;

    const monster = pick(pool);
    const xp = CR_XP[monster.cr];

    // Check if adding this monster would exceed the budget with multiplier
    const testChosen = [...chosen, monster];
    const testTotal = testChosen.reduce((s, m) => s + CR_XP[m.cr], 0);
    const testCount = testChosen.length;
    const testAdjusted = testTotal * getMultiplier(testCount);

    // Allow up to 15% over budget
    if (testAdjusted > budget * 1.15) {
      // If we have nothing yet, force at least one
      if (chosen.length === 0) {
        chosen.push(monster);
        remaining -= xp;
      }
      continue;
    }

    chosen.push(monster);
    remaining = budget - testTotal;
  }

  if (chosen.length === 0) return null;

  // Aggregate monsters
  const counts = {};
  chosen.forEach(m => { counts[m.name] = (counts[m.name] || { ...m, count: 0 }); counts[m.name].count++; });
  const monsterList = Object.values(counts).sort((a, b) => b.cr - a.cr);

  const totalXP = chosen.reduce((s, m) => s + CR_XP[m.cr], 0);
  const adjustedXP = Math.round(totalXP * getMultiplier(chosen.length));

  // Determine actual difficulty rating
  let actualDifficulty = 'Easy';
  const partyThresholds = {
    easy:   thresholds.easy * size,
    medium: thresholds.medium * size,
    hard:   thresholds.hard * size,
    deadly: thresholds.deadly * size,
  };
  if (adjustedXP >= partyThresholds.deadly) actualDifficulty = 'Deadly';
  else if (adjustedXP >= partyThresholds.hard) actualDifficulty = 'Hard';
  else if (adjustedXP >= partyThresholds.medium) actualDifficulty = 'Medium';

  const terrain = pick(BIOME_HAZARDS[biome] || BIOME_HAZARDS.forest);
  const tactic  = pick(BIOME_TACTICS[biome] || BIOME_TACTICS.forest);

  return { monsterList, totalXP, adjustedXP, actualDifficulty, terrain, tactic, monsterCount: chosen.length };
}

/* ─── Styles ─── */
const cardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '10px',
  padding: '16px',
};

const inputStyle = {
  width: '100%', padding: '8px 12px', borderRadius: '6px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'var(--text)', fontSize: '13px',
  fontFamily: 'var(--font-ui)', outline: 'none',
  boxSizing: 'border-box',
};

const selectStyle = {
  ...inputStyle,
  appearance: 'none', cursor: 'pointer',
  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'%23888\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 11L3 6h10z\'/%3E%3C/svg%3E")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  paddingRight: '28px',
};

const labelStyle = {
  fontSize: '10px', color: 'var(--text-mute)',
  fontFamily: 'var(--font-ui)', display: 'block',
  marginBottom: '3px', textTransform: 'uppercase',
  letterSpacing: '0.06em', fontWeight: 600,
};

const btnPrimary = {
  display: 'flex', alignItems: 'center', gap: '6px',
  padding: '8px 16px', borderRadius: '8px',
  background: '#c084fc22', border: '1px solid #c084fc44',
  color: '#c084fc', fontSize: '12px', fontWeight: 600,
  cursor: 'pointer', fontFamily: 'var(--font-ui)',
  transition: 'all 0.15s',
};

const btnSecondary = {
  ...btnPrimary,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'var(--text-dim)',
};

const diffColors = {
  Easy: '#4ade80', Medium: '#facc15', Hard: '#f97316', Deadly: '#ef4444',
};

/* ─── Component ─── */
export default function EncounterGenerator() {
  const [biome, setBiome]           = useState('forest');
  const [partyLevel, setPartyLevel] = useState(3);
  const [partySize, setPartySize]   = useState(4);
  const [difficulty, setDifficulty] = useState('medium');
  const [encounter, setEncounter]   = useState(null);
  const [copied, setCopied]         = useState(false);

  const generate = useCallback(() => {
    const result = buildEncounter(biome, partyLevel, partySize, difficulty);
    setEncounter(result);
    setCopied(false);
  }, [biome, partyLevel, partySize, difficulty]);

  const copyEncounter = useCallback(() => {
    if (!encounter) return;
    const biomeLabel = BIOMES.find(b => b.key === biome)?.label || biome;
    const lines = [
      `=== Random Encounter: ${biomeLabel} ===`,
      `Party: ${partySize} level-${partyLevel} characters | Difficulty: ${encounter.actualDifficulty}`,
      '',
      '--- Monsters ---',
      ...encounter.monsterList.map(m => `  ${m.count}x ${m.name} (CR ${crLabel(m.cr)}, ${CR_XP[m.cr]} XP each)`),
      '',
      `Total XP: ${encounter.totalXP.toLocaleString()}`,
      `Adjusted XP (x${getMultiplier(encounter.monsterCount)}): ${encounter.adjustedXP.toLocaleString()}`,
      '',
      `--- Terrain ---`,
      encounter.terrain,
      '',
      `--- Tactics ---`,
      encounter.tactic,
    ];
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }, [encounter, biome, partyLevel, partySize]);

  const biomeObj = BIOMES.find(b => b.key === biome);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }}>
        <div style={{
          width: 32, height: 32, borderRadius: '8px',
          background: '#c084fc18', border: '1px solid #c084fc33',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Swords size={16} color="#c084fc" />
        </div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>
            Random Encounter Generator
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-mute)', fontFamily: 'var(--font-ui)' }}>
            CR-balanced encounters by biome
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Biome selector */}
        <div>
          <label style={labelStyle}>Biome</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {BIOMES.map(b => (
              <button
                key={b.key}
                onClick={() => setBiome(b.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '5px 10px', borderRadius: '6px',
                  background: biome === b.key ? '#c084fc22' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${biome === b.key ? '#c084fc55' : 'rgba(255,255,255,0.06)'}`,
                  color: biome === b.key ? '#c084fc' : 'var(--text-dim)',
                  fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'var(--font-ui)', transition: 'all 0.15s',
                }}
              >
                <b.Icon size={12} />
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row: level, size, difficulty */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          <div>
            <label style={labelStyle}>Party Level</label>
            <input
              type="number" min={1} max={20}
              value={partyLevel}
              onChange={e => setPartyLevel(Math.max(1, Math.min(20, +e.target.value || 1)))}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Party Size</label>
            <input
              type="number" min={1} max={6}
              value={partySize}
              onChange={e => setPartySize(Math.max(1, Math.min(6, +e.target.value || 1)))}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Difficulty</label>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              style={selectStyle}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="deadly">Deadly</option>
            </select>
          </div>
        </div>

        {/* Generate button */}
        <button onClick={generate} style={{ ...btnPrimary, justifyContent: 'center', width: '100%' }}>
          <Swords size={14} />
          Generate Encounter
        </button>
      </div>

      {/* Result */}
      {encounter && (
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Difficulty badge + XP */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '11px', fontWeight: 700,
                padding: '3px 10px', borderRadius: '6px',
                background: `${diffColors[encounter.actualDifficulty]}18`,
                border: `1px solid ${diffColors[encounter.actualDifficulty]}44`,
                color: diffColors[encounter.actualDifficulty],
                fontFamily: 'var(--font-ui)', textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                {encounter.actualDifficulty === 'Deadly' && <Skull size={11} style={{ marginRight: 4, verticalAlign: '-1px' }} />}
                {encounter.actualDifficulty}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-mute)', fontFamily: 'var(--font-ui)' }}>
                {biomeObj?.label}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={generate} style={btnSecondary} title="Regenerate">
                <RefreshCw size={12} /> Reroll
              </button>
              <button onClick={copyEncounter} style={btnSecondary} title="Copy">
                <Copy size={12} /> {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Monster list */}
          <div>
            <div style={{
              fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--text-mute)',
              fontFamily: 'var(--font-mono, monospace)',
              marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <Swords size={11} /> Monsters
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {encounter.monsterList.map((m, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '7px 10px', borderRadius: '6px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '12px', fontWeight: 700, color: '#c084fc',
                      fontFamily: 'var(--font-mono, monospace)',
                      minWidth: '20px', textAlign: 'center',
                    }}>
                      {m.count}x
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--text)', fontFamily: 'var(--font-ui)', fontWeight: 500 }}>
                      {m.name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontSize: '10px', color: 'var(--text-mute)',
                      fontFamily: 'var(--font-mono, monospace)',
                      padding: '1px 6px', borderRadius: '4px',
                      background: 'rgba(255,255,255,0.04)',
                    }}>
                      CR {crLabel(m.cr)}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)' }}>
                      {(CR_XP[m.cr] * m.count).toLocaleString()} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* XP totals */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px',
            padding: '10px 12px', borderRadius: '8px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.04)',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: 'var(--text-mute)', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Base XP
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-mono, monospace)' }}>
                {encounter.totalXP.toLocaleString()}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: 'var(--text-mute)', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Multiplier
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#c084fc', fontFamily: 'var(--font-mono, monospace)' }}>
                x{getMultiplier(encounter.monsterCount)}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: 'var(--text-mute)', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Adjusted XP
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: diffColors[encounter.actualDifficulty], fontFamily: 'var(--font-mono, monospace)' }}>
                {encounter.adjustedXP.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Terrain */}
          <div>
            <div style={{
              fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--text-mute)',
              fontFamily: 'var(--font-mono, monospace)',
              marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <AlertTriangle size={11} /> Terrain Hazard
            </div>
            <div style={{
              fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)',
              padding: '8px 12px', borderRadius: '6px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.04)',
              lineHeight: 1.5,
            }}>
              {encounter.terrain}
            </div>
          </div>

          {/* Tactics */}
          <div>
            <div style={{
              fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--text-mute)',
              fontFamily: 'var(--font-mono, monospace)',
              marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <Zap size={11} /> Tactical Suggestion
            </div>
            <div style={{
              fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)',
              padding: '8px 12px', borderRadius: '6px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.04)',
              lineHeight: 1.5,
            }}>
              {encounter.tactic}
            </div>
          </div>
        </div>
      )}

      {encounter === null && (
        <div style={{
          textAlign: 'center', padding: '32px 16px', color: 'var(--text-mute)',
          fontSize: '12px', fontFamily: 'var(--font-ui)',
        }}>
          Configure your encounter parameters and click Generate.
        </div>
      )}
    </div>
  );
}
