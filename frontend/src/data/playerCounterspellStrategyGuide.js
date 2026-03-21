/**
 * playerCounterspellStrategyGuide.js
 * Player Mode: Counterspell — the most important reaction spell
 * Pure JS — no React dependencies.
 */

export const COUNTERSPELL_BASICS = {
  spell: 'Counterspell',
  level: 3,
  school: 'Abjuration',
  castTime: '1 reaction (when you see a creature within 60ft casting a spell)',
  range: '60 feet',
  classes: ['Sorcerer', 'Warlock', 'Wizard', 'Redemption Paladin (Oath)', 'Clockwork Sorcerer'],
  effect: 'Automatically counter a L3 or lower spell. For L4+: ability check DC 10 + spell level.',
};

export const COUNTERSPELL_RULES = [
  { rule: 'Auto-success at same level', detail: 'Slot ≥ enemy spell level = auto-counter. No check needed.' },
  { rule: 'Check for lower slots', detail: 'Slot < enemy spell = ability check DC 10 + spell level.' },
  { rule: 'Must see the casting', detail: 'Subtle Spell, invisible casters = uncounterable.' },
  { rule: 'Counter the Counter', detail: 'Ally can Counterspell an enemy Counterspell. Requires 3rd caster.' },
];

export const COUNTERSPELL_PROBABILITY = [
  { spellLevel: 4, dc: 14, rawChance: '35%', note: 'With +5 mod: need 9+' },
  { spellLevel: 5, dc: 15, rawChance: '30%', note: 'Even odds with good mod' },
  { spellLevel: 6, dc: 16, rawChance: '25%', note: 'Risky — upcast if possible' },
  { spellLevel: 7, dc: 17, rawChance: '20%', note: 'Definitely upcast' },
  { spellLevel: 8, dc: 18, rawChance: '15%', note: 'Need high slot or bonuses' },
  { spellLevel: 9, dc: 19, rawChance: '10%', note: 'Need L9 slot or Glibness' },
];

export const COUNTERSPELL_BOOSTERS = [
  { boost: 'Abjuration Wizard (L10)', detail: 'Add PB to ability checks to counter spells.', rating: 'S' },
  { boost: 'Jack of All Trades (Bard)', detail: 'Half PB added to the check.', rating: 'A+' },
  { boost: 'Glibness (Bard/Warlock)', detail: 'Min 15 on CHA checks. Auto-succeed on DC 15-.', rating: 'S' },
  { boost: 'Flash of Genius (Artificer)', detail: 'Add INT mod as reaction.', rating: 'A' },
  { boost: 'Upcast', detail: 'Match or exceed slot level = guaranteed.', rating: 'S' },
];

export const WHEN_TO_COUNTERSPELL = [
  { priority: 'Critical', spells: ['Power Word Kill', 'Meteor Swarm', 'Wish', 'Feeblemind'], note: 'Always counter.' },
  { priority: 'High', spells: ['Fireball', 'Hold Person', 'Banishment', 'Wall of Force'], note: 'Counter if able.' },
  { priority: 'Medium', spells: ['Haste', 'Greater Invisibility', 'Spirit Guardians'], note: 'Counter if slots spare.' },
  { priority: 'Low', spells: ['Cantrips', 'Healing Word', 'Shield'], note: 'Usually not worth it.' },
];

export const COUNTERSPELL_TIPS = [
  'Position within 60 feet of enemy casters.',
  'Save at least one L3 slot for Counterspell.',
  'Subtle Spell Counterspell can\'t be counter-countered.',
  'Don\'t counter low-level spells — save slots for big threats.',
  'Coordinate with allies to avoid double-countering.',
  'Against multiple casters: prioritize the most dangerous one.',
];
