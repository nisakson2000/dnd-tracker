/**
 * playerCounterspellTacticsGuide.js
 * Player Mode: Counterspell rules, tactics, and optimization
 * Pure JS — no React dependencies.
 */

export const COUNTERSPELL_BASICS = {
  level: 3,
  casting: 'Reaction (when you see a creature within 60ft casting a spell)',
  effect: 'Auto-counter spells of same level or lower. Higher: ability check DC 10 + spell level.',
  classes: ['Wizard', 'Sorcerer', 'Warlock'],
};

export const COUNTERSPELL_MATH = [
  { targetLevel: 3, slotUsed: 3, check: 'Auto-success' },
  { targetLevel: 4, slotUsed: 3, check: 'DC 14 (60% with +5)' },
  { targetLevel: 5, slotUsed: 3, check: 'DC 15 (55% with +5)' },
  { targetLevel: 6, slotUsed: 3, check: 'DC 16 (50% with +5)' },
  { targetLevel: 7, slotUsed: 3, check: 'DC 17 (45% with +5)' },
  { targetLevel: 8, slotUsed: 3, check: 'DC 18 (40% with +5)' },
  { targetLevel: 9, slotUsed: 3, check: 'DC 19 (35% with +5)' },
];

export const COUNTERSPELL_BOOSTERS = [
  { source: 'Abjuration Wizard (L10)', effect: '+PB to counterspell checks.', rating: 'S+' },
  { source: 'Jack of All Trades (Bard)', effect: '+half PB to the check.', rating: 'A+' },
  { source: 'Subtle Spell (Sorcerer)', effect: 'Can\'t be counter-counterspelled.', rating: 'S+' },
  { source: 'Upcast', effect: 'Higher slot = auto-counter.', rating: 'S' },
  { source: 'Glibness (Bard L8)', effect: 'Minimum 15 on CHA checks. Auto-pass most.', rating: 'S+' },
];

export const COUNTERSPELL_TACTICS = [
  { tactic: 'Subtle Counterspell', method: 'Sorcerer counters with no components. Can\'t be counter-countered.', rating: 'S+' },
  { tactic: 'Bait the Counter', method: 'Cast cheap spell to waste enemy Counterspell. Cast real spell next.', rating: 'S' },
  { tactic: 'Range Denial', method: 'Stay beyond 60ft. Counterspell can\'t reach.', rating: 'A+' },
  { tactic: 'Counter the Counter', method: 'Enemy counters your spell. Ally counters their counter.', rating: 'S' },
  { tactic: 'Line of Sight Block', method: 'Cast from behind full cover. Can\'t target what you can\'t see.', rating: 'A+' },
];

export const WHEN_TO_COUNTER = [
  { spell: 'Hold Person/Monster', priority: 'S+', reason: 'Paralysis = death. Always counter.' },
  { spell: 'Banishment', priority: 'S+', reason: 'Removes from fight. Permanent if held.' },
  { spell: 'Hypnotic Pattern', priority: 'S+', reason: 'Party wipe potential.' },
  { spell: 'Power Word Kill', priority: 'S+', reason: 'Instant death. No save.' },
  { spell: 'Heal / Mass Heal', priority: 'A+', reason: 'Counter to prevent enemy recovery.' },
  { spell: 'Fireball/AoE', priority: 'A', reason: 'Big damage but survivable.' },
  { spell: 'Cantrips', priority: 'D', reason: 'Never waste a slot on a cantrip.' },
];

export const COUNTERSPELL_TIPS = [
  'Match level = auto-success. Upcast when affordable.',
  'Subtle Counterspell: can\'t be counter-countered. Sorcerer exclusive.',
  'Bait with low-level spell → enemy wastes counter → cast real spell.',
  'Stay beyond 60ft. Counterspell can\'t reach you.',
  'RAW: identifying a spell uses your reaction. Can\'t also Counterspell.',
  'Abjuration Wizard L10: +PB to checks. Best counterspeller.',
  'Always counter: Hold Person, Banishment, Power Word Kill.',
  'Never counter cantrips. Waste of a slot.',
  'Counter enemy healing to prevent attrition wins.',
  'Have two casters ready to counter: one baits, one counters.',
];
