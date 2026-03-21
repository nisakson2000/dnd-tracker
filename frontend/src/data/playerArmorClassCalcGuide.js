/**
 * playerArmorClassCalcGuide.js
 * Player Mode: AC calculation — all methods, stacking rules, and max AC builds
 * Pure JS — no React dependencies.
 */

export const AC_CALCULATION_METHODS = [
  { method: 'No Armor', formula: '10 + DEX mod', example: 'DEX 16 = AC 13', note: 'Base. Worst option for most characters.' },
  { method: 'Light Armor (Studded Leather)', formula: '12 + DEX mod', example: 'DEX 20 = AC 17', note: 'Best light armor. Full DEX bonus.' },
  { method: 'Medium Armor (Half Plate)', formula: '15 + DEX mod (max 2)', example: 'DEX 14 = AC 17', note: 'Best medium armor. Stealth disadvantage.' },
  { method: 'Medium Armor (Breastplate)', formula: '14 + DEX mod (max 2)', example: 'DEX 14 = AC 16', note: 'No stealth disadvantage. -1 AC vs half plate.' },
  { method: 'Heavy Armor (Plate)', formula: '18 (flat)', example: 'AC 18', note: 'Best armor. No DEX. STR 15 required.' },
  { method: 'Shield', formula: '+2 AC', example: 'Plate + Shield = AC 20', note: 'Stacks with any armor. One hand occupied.' },
  { method: 'Mage Armor (spell)', formula: '13 + DEX mod', example: 'DEX 20 = AC 18', note: 'Better than studded leather. Costs a spell slot. 8 hours.' },
  { method: 'Unarmored Defense (Barbarian)', formula: '10 + DEX + CON', example: 'DEX 16 + CON 16 = AC 16', note: 'Scales with two stats. Can use shield.' },
  { method: 'Unarmored Defense (Monk)', formula: '10 + DEX + WIS', example: 'DEX 20 + WIS 20 = AC 20', note: 'High ceiling but needs two maxed stats. No shield.' },
  { method: 'Natural Armor (Lizardfolk)', formula: '13 + DEX mod', example: 'DEX 16 = AC 16', note: 'Can\'t be combined with regular armor. Can use shield.' },
  { method: 'Natural Armor (Tortle)', formula: '17 (flat)', example: 'AC 17', note: 'No DEX needed. Ridiculous at L1. Can use shield (AC 19).' },
  { method: 'Draconic Resilience (Sorcerer)', formula: '13 + DEX mod', example: 'DEX 16 = AC 16', note: 'Like Mage Armor but permanent and frees a spell.' },
  { method: 'Bladesong (Wizard)', formula: 'Light armor + DEX + INT', example: 'Studded (12) + DEX 5 + INT 5 = AC 22', note: 'Requires Bladesong active. Highest Wizard AC.' },
];

export const AC_BOOSTERS = [
  { booster: 'Shield spell', bonus: '+5 AC', duration: 'Until start of next turn', type: 'Reaction', note: 'Best AC boost. Stacks with everything.' },
  { booster: 'Shield of Faith', bonus: '+2 AC', duration: 'Concentration, 10 min', type: '1st level spell', note: 'Stacks with armor and shield.' },
  { booster: 'Haste', bonus: '+2 AC', duration: 'Concentration, 1 min', type: '3rd level spell', note: 'Plus extra action, doubled speed.' },
  { booster: 'Cloak of Protection', bonus: '+1 AC, +1 saves', duration: 'Permanent (attunement)', type: 'Magic Item', note: 'Best uncommon item. +1 to AC AND all saves.' },
  { booster: 'Ring of Protection', bonus: '+1 AC, +1 saves', duration: 'Permanent (attunement)', type: 'Magic Item', note: 'Same as Cloak. Stacks with Cloak.' },
  { booster: '+1/+2/+3 Armor', bonus: '+1 to +3 AC', duration: 'Permanent', type: 'Magic Item', note: 'Enhances existing armor AC.' },
  { booster: '+1/+2/+3 Shield', bonus: '+1 to +3 AC', duration: 'Permanent', type: 'Magic Item', note: 'Enhances shield AC.' },
  { booster: 'Defense Fighting Style', bonus: '+1 AC', duration: 'Permanent (while armored)', type: 'Class feature', note: 'Simple +1 while wearing armor.' },
  { booster: 'Forge Domain Blessing', bonus: '+1 armor or weapon', duration: 'Until next LR', type: 'Class feature', note: 'Free +1 armor at L1.' },
  { booster: 'Warforged racial', bonus: '+1 AC', duration: 'Permanent', type: 'Racial', note: 'Stacks with armor. Best AC race.' },
];

export const MAX_AC_BUILDS = [
  {
    build: 'Plate + Shield + Defense + Forge',
    ac: '18 + 2 + 1 + 1 = 22 (no magic items)',
    class: 'Forge Cleric',
    note: 'AC 22 at L1 with Shield of Faith. No magic items needed.',
  },
  {
    build: 'Bladesinger Wizard',
    ac: '12 + 5 (DEX) + 5 (INT) = 22 (Bladesong)',
    class: 'Wizard (Bladesinger)',
    note: 'AC 22 base. Shield spell = 27. Highest non-magic-item AC.',
  },
  {
    build: 'Theoretical Maximum',
    ac: '26-30+ with magic items',
    class: 'Various',
    note: 'Plate +3 (21) + Shield +3 (26) + Defense (27) + Cloak (28) + Ring (29) + Shield spell (34).',
  },
];

export const AC_TIPS = [
  'Shield spell: +5 AC as reaction. Non-negotiable for any class that can learn it.',
  'Plate + Shield = AC 20. Baseline for martial characters.',
  'Medium Armor Master feat: +3 DEX (not +2). Half plate = AC 18 without stealth disadvantage.',
  'Forge Cleric: 22 AC at level 1. Highest starting AC in the game.',
  'Bladesinger: AC 22+ during Bladesong. Highest Wizard AC.',
  'AC has diminishing returns. After ~22, +1 AC matters less per point.',
  'Enemy attack bonuses scale to +10-+14 at high levels. Even AC 25 gets hit.',
  'Don\'t forget: AC doesn\'t help against save-based effects.',
  'Cloak + Ring of Protection: +2 AC AND +2 to all saves. Best magic item combo.',
  'Warforged: +1 AC racial bonus. Stacks with everything. Best AC race.',
];
