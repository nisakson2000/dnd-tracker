/**
 * playerDispelRemoveCurseGuide.js
 * Player Mode: Dispel Magic and Remove Curse — rules and optimization
 * Pure JS — no React dependencies.
 */

export const DISPEL_MAGIC_RULES = {
  level: 3,
  range: '120 feet',
  effect: 'End one spell of 3rd level or lower. Higher: DC 10 + spell level ability check.',
  note: 'Targets ONE spell per casting.',
};

export const DISPEL_CHECK_TABLE = [
  { spellLevel: 4, dc: 14, chance: '85%' },
  { spellLevel: 5, dc: 15, chance: '80%' },
  { spellLevel: 6, dc: 16, chance: '75%' },
  { spellLevel: 7, dc: 17, chance: '70%' },
  { spellLevel: 8, dc: 18, chance: '65%' },
  { spellLevel: 9, dc: 19, chance: '60%' },
];

export const DISPEL_BOOSTERS = [
  { booster: 'Upcast', effect: 'Auto-dispel same level or lower.', rating: 'S+' },
  { booster: 'Abjuration Wizard L10', effect: '+PB to abjuration checks.', rating: 'S' },
  { booster: 'Jack of All Trades (Bard)', effect: '+half PB to check.', rating: 'A+' },
  { booster: 'Flash of Genius (Artificer)', effect: '+INT as reaction.', rating: 'S' },
  { booster: 'Bardic Inspiration', effect: '+BI die to check.', rating: 'A+' },
];

export const REMOVE_CURSE_RULES = {
  level: 3,
  range: 'Touch',
  effect: 'End one curse on creature. Cursed items: breaks attunement only.',
  note: 'Item stays cursed. Just breaks attunement.',
};

export const DISPEL_TIPS = [
  'Dispel targets ONE effect per casting.',
  'Upcast to auto-succeed against same-level spells.',
  'Abjuration Wizard: best dispeller (+PB).',
  'Bards: Jack of All Trades applies.',
  'Remove Curse doesn\'t uncurse items, just breaks attunement.',
  'Always have Dispel prepared.',
  'Counterspell > Dispel. Prevent rather than remove.',
];
