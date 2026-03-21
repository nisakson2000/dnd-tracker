/**
 * playerTrapSurvivalGuide.js
 * Player Mode: Finding, disabling, and surviving traps
 * Pure JS — no React dependencies.
 */

export const TRAP_DETECTION = {
  passive: 'Passive Perception ≥ trap DC = auto-noticed.',
  active: 'Investigation check to actively search.',
  magical: 'Detect Magic (ritual) reveals magical traps. Dispel Magic disables.',
  note: 'High passive Perception is the best defense.',
};

export const TRAP_DIFFICULTY = [
  { difficulty: 'Low', dc: '10-12', note: 'Simple. Most PCs notice.' },
  { difficulty: 'Moderate', dc: '13-15', note: 'Requires some skill.' },
  { difficulty: 'Hard', dc: '16-19', note: 'Needs proficiency.' },
  { difficulty: 'Deadly', dc: '20-25', note: 'Needs Expertise or high stats.' },
  { difficulty: 'Legendary', dc: '25-30', note: 'Reliable Talent territory.' },
];

export const TRAP_TYPES = [
  { type: 'Pit trap', effect: 'Fall + optional spikes.', counter: 'Feather Fall, fly, jump.' },
  { type: 'Poison dart', effect: 'Poison damage. CON save.', counter: 'High AC, poison resistance.' },
  { type: 'Falling block', effect: '4d10 bludgeoning. DEX save.', counter: 'Evasion (Rogue/Monk).' },
  { type: 'Pressure plate', effect: 'Triggers other traps.', counter: 'Investigation check, thieves\' tools.' },
  { type: 'Glyph of Warding', effect: '5d8 or stored spell.', counter: 'Detect Magic + Dispel Magic.' },
  { type: 'Locking trap', effect: 'Doors lock, walls close.', counter: 'Knock, Passwall, Dimension Door.' },
];

export const TRAP_SPECIALISTS = [
  { class: 'Rogue', why: 'Expertise + thieves\' tools + Reliable Talent.', rating: 'S' },
  { class: 'Artificer', why: 'Tool Expertise + Flash of Genius.', rating: 'A+' },
  { class: 'Familiar', why: 'Send ahead to trigger traps. Expendable.', rating: 'S' },
];

export const TRAP_TACTICS = [
  { tactic: 'Send familiar ahead', detail: 'Trigger traps with expendable scouts.', rating: 'S' },
  { tactic: 'Mage Hand', detail: 'Trigger pressure plates from 30ft away.', rating: 'A+' },
  { tactic: 'Detect Magic (ritual)', detail: 'Free magical trap detection.', rating: 'S' },
  { tactic: 'Passive Perception lead', detail: 'Highest passive Perception walks first.', rating: 'S' },
  { tactic: '10-foot pole', detail: 'Classic. Probe ahead for pressure plates.', rating: 'B+' },
];

export const TRAP_SURVIVAL_TIPS = [
  'Passive Perception above 15 catches most traps.',
  'Always have a thieves\' tools user (Rogue/Artificer).',
  'Detect Magic every room in dungeons. Ritual = free.',
  'Evasion: DEX save traps deal 0 on success.',
  'Never open chests without checking for traps.',
];
