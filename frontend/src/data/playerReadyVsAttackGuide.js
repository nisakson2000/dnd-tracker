/**
 * playerReadyVsAttackGuide.js
 * Player Mode: Ready action — when to use it vs attacking now
 * Pure JS — no React dependencies.
 */

export const READY_RULES = {
  action: 'Uses your Action on your turn.',
  trigger: 'Specify perceivable circumstance.',
  reaction: 'When triggered: use REACTION to act.',
  spells: 'Slot used when Ready (not trigger). Must concentrate until trigger.',
  extraAttack: 'Ready Attack = ONE attack only. No Extra Attack.',
};

export const WHEN_TO_READY = [
  { situation: 'Enemy behind cover', action: 'Ready: "When they peek out."', rating: 'A+' },
  { situation: 'Waiting for ally setup', action: 'Ready: "When ally knocks prone."', rating: 'A' },
  { situation: 'Counterspell range', action: 'Ready Counterspell for enemy caster turn.', rating: 'S' },
  { situation: 'Chokepoint', action: 'Ready: "When enemy enters doorway."', rating: 'A+' },
];

export const WHEN_NOT_TO_READY = [
  'You can attack now (Extra Attack > Ready 1 attack).',
  'Readying a spell (slot wasted if trigger fails).',
  'You have valuable BA (wasted if you Ready).',
  'Trigger is unclear (DM interprets).',
];

export const READY_TIPS = [
  'Ready = ONE attack. No Extra Attack.',
  'Readied spells: slot used immediately.',
  'Be SPECIFIC with triggers.',
  'Uses your reaction. Can\'t Shield that round.',
  'Usually Dodge > Ready if unsure.',
  'Best use: Counterspell positioning.',
  'Don\'t Ready unless attacking now is impossible.',
];
