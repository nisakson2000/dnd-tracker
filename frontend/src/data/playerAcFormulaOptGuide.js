/**
 * playerAcFormulaOptGuide.js
 * Player Mode: Armor Class calculation — all AC formulas and optimization
 * Pure JS — no React dependencies.
 */

export const AC_FORMULAS = [
  { source: 'No Armor', formula: '10 + DEX mod', note: 'Base AC.' },
  { source: 'Leather', formula: '11 + DEX mod', note: 'No stealth penalty.' },
  { source: 'Studded Leather', formula: '12 + DEX mod', note: 'Best light armor.' },
  { source: 'Chain Shirt', formula: '13 + DEX (max 2)', note: 'No stealth penalty.' },
  { source: 'Breastplate', formula: '14 + DEX (max 2)', note: 'Best non-heavy, no penalty.' },
  { source: 'Half Plate', formula: '15 + DEX (max 2)', note: 'Stealth disadvantage.' },
  { source: 'Chain Mail', formula: '16 flat', note: 'Starting heavy armor.' },
  { source: 'Splint', formula: '17 flat', note: 'Stealth disadvantage.' },
  { source: 'Plate', formula: '18 flat', note: 'Best armor. 1,500 gp.' },
  { source: 'Shield', formula: '+2 AC', note: 'Stacks with any armor.' },
  { source: 'Mage Armor', formula: '13 + DEX', note: 'Spell. 8 hours. No concentration.' },
  { source: 'Barbarian Unarmored', formula: '10 + DEX + CON', note: 'Can use shield.' },
  { source: 'Monk Unarmored', formula: '10 + DEX + WIS', note: 'No armor, no shield.' },
  { source: 'Draconic Sorcerer', formula: '13 + DEX', note: 'Permanent.' },
  { source: 'Tortle Natural Armor', formula: '17 flat', note: 'No DEX needed.' },
  { source: 'Lizardfolk Natural Armor', formula: '13 + DEX', note: 'Can use shield.' },
];

export const AC_BOOSTERS = [
  { source: 'Shield (item)', bonus: '+2', type: 'Equipment' },
  { source: 'Shield (spell)', bonus: '+5 reaction', type: 'Spell' },
  { source: 'Shield of Faith', bonus: '+2 concentration', type: 'Spell' },
  { source: 'Defense Style', bonus: '+1', type: 'Class Feature' },
  { source: 'Haste', bonus: '+2', type: 'Spell' },
  { source: 'Ring of Protection', bonus: '+1', type: 'Magic Item' },
  { source: 'Cloak of Protection', bonus: '+1', type: 'Magic Item' },
  { source: '+1/+2/+3 Armor', bonus: '+1/+2/+3', type: 'Magic Item' },
  { source: 'Bracers of Defense', bonus: '+2', type: 'Magic Item' },
  { source: 'Bladesinger Bladesong', bonus: '+INT mod', type: 'Class Feature' },
];

export const MAX_AC_BUILDS = [
  { build: 'Plate + Shield + Defense', ac: 21, accessible: 'Fighter/Paladin L1' },
  { build: 'Above + Shield spell', ac: 26, accessible: 'Eldritch Knight or multiclass' },
  { build: 'Bladesinger (20 DEX, 20 INT) + Shield spell', ac: 27, accessible: 'Wizard L14+' },
  { build: 'Warforged Plate + Shield + Defense + Shield spell', ac: 27, accessible: 'Warforged Fighter' },
  { build: 'Barbarian 20 DEX 20 CON + Shield (item)', ac: 22, accessible: 'Barbarian L20' },
];

export const AC_TIPS = [
  'Plate + Shield = AC 20. Gold standard for tanks.',
  'Studded Leather + 20 DEX = AC 17. Best light armor.',
  'Half Plate + 14 DEX = AC 17. Don\'t invest DEX past 14 for medium.',
  'Shield spell: +5 AC as reaction. Always prepare.',
  'Mage Armor: AC 13+DEX. Better than studded until 20 DEX.',
  'Medium Armor Master: +3 DEX cap, no stealth penalty.',
  'Defense style: free +1 AC. Never wasted.',
  'Unarmored formulas don\'t stack with each other.',
  'Shield (item) + Shield (spell) stack.',
  'Bracers of Defense: +2 AC for unarmored Monk/Barbarian.',
];
