/**
 * playerOptimalPointBuyGuide.js
 * Player Mode: Point Buy optimization — best stat arrays for every class
 * Pure JS — no React dependencies.
 */

export const POINT_BUY_RULES = {
  points: 27,
  range: '8 to 15 before racial bonuses.',
  costs: { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 },
  note: 'Going from 14 to 15 costs 2 points (expensive). 13 is the feat prerequisite breakpoint.',
};

export const OPTIMAL_ARRAYS = {
  SAD_caster: {
    label: 'Single Ability Dependent Caster (Wizard, Cleric, Druid)',
    array: '15 / 14 / 14 / 8 / 8 / 8 → +racial',
    why: 'Max primary stat. CON and DEX for survival. Dump the rest.',
    example: 'Wizard: 8/14/14/15+2/8/8. INT 17 → half-feat at L4 → 18.',
  },
  MAD_melee: {
    label: 'Multiple Ability Dependent Melee (Paladin, Ranger, Monk)',
    array: '15 / 14 / 13 / 8 / 12 / 8 → +racial',
    why: 'Need STR/DEX + CON + casting stat. Tight budget.',
    example: 'Paladin: 15+2/8/13/8/12/14+1. STR 17, CON 13, CHA 15.',
  },
  CHA_caster: {
    label: 'Charisma Caster (Warlock, Sorcerer, Bard)',
    array: '8 / 14 / 15 / 8 / 10 / 15 → +racial',
    why: 'CHA primary. CON and DEX for AC/HP. Dump STR/INT.',
    example: 'Warlock: 8/14/15+1/8/10/15+2. CHA 17, CON 16.',
  },
  gish: {
    label: 'Gish / Hexblade',
    array: '8 / 14 / 14 / 8 / 10 / 15 → +racial',
    why: 'Hexblade uses CHA for attacks. DEX for AC. CON for HP.',
    example: 'Hexblade: 8/14/14/8/10/15+2. CHA 17 → Fey Touched L4 → 18.',
  },
  fighter_barb: {
    label: 'Fighter / Barbarian',
    array: '15 / 14 / 15 / 8 / 8 / 8 → +racial',
    why: 'STR primary. CON secondary. DEX for AC (medium armor).',
    example: 'Fighter: 15+2/14/15/8/8/8. STR 17, CON 15. Resilient CON at L4.',
  },
  rogue: {
    label: 'Rogue',
    array: '8 / 15 / 14 / 8 / 14 / 8 → +racial',
    why: 'DEX primary. CON + WIS for saves and HP.',
    example: 'Rogue: 8/15+2/14/8/14/8. DEX 17. Half-feat at L4 → 18.',
  },
};

export const ODD_STAT_STRATEGY = {
  concept: 'Leave your primary stat at an ODD number (15, 17). Take a half-feat at L4 to round up.',
  benefit: '+1 stat modifier AND a feat benefit from one ASI.',
  bestHalfFeats: ['Fey Touched (+1 CHA/INT/WIS)', 'Resilient CON (+1 CON)', 'Elven Accuracy (+1 DEX/CHA)', 'Skill Expert (+1 any)'],
};

export const BREAKPOINTS = [
  { score: 13, why: 'Multiclass prerequisite for most classes.' },
  { score: 14, why: 'Optimal DEX for medium armor (+2 max). No higher needed.' },
  { score: 15, why: 'Max point buy. +racial → 16 or 17.' },
  { score: 16, why: '+3 modifier. Strong primary stat at L1.' },
  { score: 20, why: 'Cap. +5 modifier. Don\'t go higher (hard cap).' },
];

export const POINT_BUY_TIPS = [
  '15 is the max before racial bonuses. +2 racial = 17.',
  'Leave primary stat odd. Half-feat at L4 rounds it up.',
  '14 DEX is optimal for medium armor (+2 DEX cap).',
  '13 in stats needed for multiclassing prerequisites.',
  'Don\'t spread stats evenly. Specialize.',
  'CON 14+ for all builds. HP matters.',
  '8 STR is fine for DEX/CHA builds. Accept encumbrance.',
  'WIS saves are common. 10-12 WIS even for non-WIS classes.',
  'Dump INT if you\'re not a Wizard/Artificer.',
  'Standard Array (15/14/13/12/10/8) is baseline. Point Buy is usually better.',
];
