/**
 * playerDefensiveLayeringGuide.js
 * Player Mode: Defensive layering — AC, saves, HP, temp HP, resistances
 * Pure JS — no React dependencies.
 */

export const DEFENSE_LAYERS = [
  {
    layer: 'Avoidance (Don\'t Get Targeted)',
    methods: ['Stay behind martials.', 'Use cover (+2/+5 AC).', 'Invisibility/Greater Invisibility.', 'Mirror Image (3 decoy images).', 'Fog Cloud / Darkness (no targeting).'],
    priority: 1,
    note: 'Best defense: don\'t be in danger. Positioning is king.',
  },
  {
    layer: 'AC (Miss Chance)',
    methods: ['Heavy armor + shield (AC 20+).', 'Shield spell (+5 AC reaction).', 'Bladesong (+INT to AC).', 'Haste (+2 AC).', 'Shield of Faith (+2 AC).'],
    priority: 2,
    note: 'Higher AC = more missed attacks. Best vs multiattack enemies.',
  },
  {
    layer: 'Saving Throws',
    methods: ['Aura of Protection (+CHA to all saves).', 'Bless (+1d4 to saves).', 'Resilient feats (+proficiency).', 'Ring/Cloak of Protection (+1 all saves).', 'Absorb Elements (reaction).'],
    priority: 3,
    note: 'Saves vs spells and abilities. High saves protect vs save-or-die.',
  },
  {
    layer: 'Hit Points',
    methods: ['High CON score.', 'Tough feat (+2 HP/level).', 'Aid spell (+5-25 max HP).', 'Heroes\' Feast (+2d10 max HP).', 'd10/d12 HD classes.'],
    priority: 4,
    note: 'More HP = more hits before going down. Buffer against burst.',
  },
  {
    layer: 'Temporary Hit Points',
    methods: ['Armor of Agathys (scales with slot).', 'Twilight Sanctuary (1d6+level/round).', 'Inspiring Leader feat (CHA+level temp HP).', 'Heroism (CHA+level temp HP/round).', 'False Life.'],
    priority: 5,
    note: 'Temp HP is a buffer. Doesn\'t stack — only highest applies.',
  },
  {
    layer: 'Resistance (Half Damage)',
    methods: ['Rage (BPS resistance).', 'Absorb Elements (elemental resistance).', 'Bear Totem (all damage except psychic).', 'Stoneskin (BPS nonmagical).', 'Racial resistances.'],
    priority: 6,
    note: 'Effectively doubles HP vs those damage types.',
  },
  {
    layer: 'Death Prevention',
    methods: ['Death Ward (drop to 1 instead of 0).', 'Relentless Endurance (Half-Orc).', 'Zealot Barbarian L14 (can\'t die while raging).', 'Clone (backup body).'],
    priority: 7,
    note: 'Last resort. Prevents permanent death.',
  },
];

export const AC_STACKING = {
  base: [
    { source: 'Unarmored', ac: '10 + DEX', stacks: 'Base AC calculation' },
    { source: 'Light Armor', ac: '11-12 + DEX', stacks: 'Base AC calculation' },
    { source: 'Medium Armor', ac: '12-15 + DEX (max 2)', stacks: 'Base AC calculation' },
    { source: 'Heavy Armor', ac: '14-18 (no DEX)', stacks: 'Base AC calculation' },
    { source: 'Mage Armor', ac: '13 + DEX', stacks: 'Base AC calculation' },
    { source: 'Unarmored Defense (Barb)', ac: '10 + DEX + CON', stacks: 'Base AC calculation' },
    { source: 'Unarmored Defense (Monk)', ac: '10 + DEX + WIS', stacks: 'Base AC calculation' },
  ],
  modifiers: [
    { source: 'Shield', ac: '+2', stacks: 'Yes, with any base AC' },
    { source: 'Shield spell', ac: '+5 (reaction)', stacks: 'Yes, until your next turn' },
    { source: 'Shield of Faith', ac: '+2', stacks: 'Yes, concentration' },
    { source: 'Haste', ac: '+2', stacks: 'Yes, concentration' },
    { source: 'Cloak of Protection', ac: '+1', stacks: 'Yes, attunement' },
    { source: 'Ring of Protection', ac: '+1', stacks: 'Yes, attunement' },
    { source: '+X Armor/Shield', ac: '+1/+2/+3', stacks: 'Yes' },
    { source: 'Bladesong', ac: '+INT', stacks: 'Yes, light armor only' },
    { source: 'Defense Fighting Style', ac: '+1', stacks: 'While wearing armor' },
  ],
  maxExamples: [
    { build: 'Bladesinger', total: 'Mage Armor (13) + DEX 5 + Bladesong 5 + Shield spell 5 = AC 28', note: 'Highest sustained AC in the game.' },
    { build: 'Paladin/Fighter', total: 'Plate (18) + Shield (2) + Defense (1) + Shield of Faith (2) + Shield spell (5) = AC 28', note: 'Tank build. Shield spell is reaction-only.' },
    { build: 'Barbarian (Unarmored)', total: '10 + DEX 5 + CON 5 + Shield (2) = AC 22', note: 'No armor needed. Rage gives resistance anyway.' },
  ],
};

export const SAVE_OPTIMIZATION = {
  proficiency: [
    { save: 'DEX', importance: 'S (Fireball, Dragon Breath, most AoE)', boost: 'Resilient (DEX). Evasion (Rogue/Monk). Absorb Elements.' },
    { save: 'CON', importance: 'S (Concentration, poison, death effects)', boost: 'Resilient (CON). War Caster. Aura of Protection.' },
    { save: 'WIS', importance: 'S+ (Hold Person, Dominate, Fear, Charm)', boost: 'Resilient (WIS). Heroes\' Feast. Aura of Protection.' },
    { save: 'STR', importance: 'B (Grapple/shove alternatives)', boost: 'Athletics proficiency. Resilient (STR). Rare.' },
    { save: 'INT', importance: 'B (Feeblemind, Phantasmal Force)', boost: 'Resilient (INT). Gnome Cunning.' },
    { save: 'CHA', importance: 'A (Banishment, Plane Shift)', boost: 'Resilient (CHA). Aura of Protection.' },
  ],
};

export const DEFENSIVE_LAYERING_TIPS = [
  'Best defense: don\'t get targeted. Positioning behind martials.',
  'AC 20+ makes most enemies miss more than they hit.',
  'Shield spell (+5 AC): best L1 spell for defense.',
  'Aura of Protection: +CHA to ALL saves for nearby allies.',
  'Temp HP doesn\'t stack. Only the highest value applies.',
  'Absorb Elements: reaction to halve elemental damage. Essential.',
  'Death Ward: pre-cast before big fights. 8 hours, no concentration.',
  'Resistance = effectively doubling HP vs that type.',
  'Mirror Image: 3 decoys, no concentration. Free defense layer.',
  'Layer defenses: AC + saves + HP + temp HP + resistance = unkillable.',
];
