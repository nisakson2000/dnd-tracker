/**
 * playerShieldSpellMasteryGuide.js
 * Player Mode: Shield spell optimization — when to cast and when to save the slot
 * Pure JS — no React dependencies.
 */

export const SHIELD_RULES = {
  level: '1st level (Wizard, Sorcerer, Hexblade Warlock)',
  casting: 'Reaction — when you are hit by an attack or targeted by Magic Missile.',
  effect: '+5 AC until the start of your next turn.',
  magicMissile: 'Blocks ALL Magic Missile darts (they auto-hit, but Shield negates).',
  duration: 'Until start of your next turn — covers ALL attacks between now and then.',
  components: 'V, S',
};

export const SHIELD_MATH = {
  breakpoint: 'Cast Shield when the attack roll is within 5 of your AC.',
  example: 'AC 15. Enemy rolls 17. 17 < 20 (15+5). Shield blocks it.',
  multiattack: 'Lasts until your turn. If enemy has multiattack, Shield helps against ALL remaining attacks.',
  efficient: 'More efficient vs multiattackers. One slot blocks 2-4 attacks.',
  wasteful: 'Don\'t Shield against a roll of natural 20 (auto-hit) or very high rolls (25+ vs AC 15).',
};

export const WHEN_TO_SHIELD = [
  { situation: 'Attack hits by 1-5', decision: 'CAST. Shield will block it.', priority: 'S+' },
  { situation: 'Multiattacker hits first attack', decision: 'CAST. Blocks remaining attacks too.', priority: 'S+' },
  { situation: 'Low HP and any hit could down you', decision: 'CAST. Survival > slot conservation.', priority: 'S+' },
  { situation: 'Magic Missile targeting you', decision: 'CAST. Blocks ALL darts.', priority: 'S' },
  { situation: 'Attack hits by 6+', decision: 'SAVE. Shield won\'t help.', priority: 'Don\'t cast' },
  { situation: 'Natural 20', decision: 'SAVE. Auto-hit regardless.', priority: 'Don\'t cast' },
  { situation: 'Plenty of spell slots left', decision: 'CAST more freely.', priority: 'A' },
  { situation: 'Last spell slot', decision: 'Only if it saves your life.', priority: 'B' },
];

export const SHIELD_COMBOS = [
  { combo: 'Shield + Mage Armor', ac: '13 + DEX + 5. Wizard with 16 DEX = AC 21.', rating: 'S+' },
  { combo: 'Shield + Half Plate + Shield (item)', ac: '14+2+2+5 = AC 23.', rating: 'S+' },
  { combo: 'Shield + Haste', ac: 'Haste +2 AC + Shield +5 = +7 total.', rating: 'S' },
  { combo: 'Shield + Bladesinger INT', ac: '13 + DEX + INT + 5 = extreme AC.', rating: 'S+' },
];

export const SHIELD_TIPS = [
  'Shield is the best L1 spell in the game. Always prepare it.',
  '+5 AC until YOUR next turn. Covers all attacks until then.',
  'Ask DM the attack roll before deciding to Shield.',
  'Don\'t Shield against crits (nat 20). Auto-hit regardless.',
  'Shield + Mage Armor = AC 21+ for Wizards with 16 DEX.',
  'Hexblade: Shield via Warlock. Slots recover on short rest.',
  'Bladesinger: AC can reach 25+ with Shield.',
  'Magic Missile: Shield is the ONLY defense. Blocks all darts.',
  'Budget slots: Shield freely in boss fights, conserve otherwise.',
  'Multiclass 1 level Wizard or Hexblade dip = Shield access.',
];
