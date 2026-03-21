/**
 * playerDodgeDashDecisionGuide.js
 * Player Mode: When to Dodge, Dash, or Disengage — decision matrix
 * Pure JS — no React dependencies.
 */

export const ACTION_COMPARISON = {
  dodge: {
    action: 'Dodge',
    effect: 'Attacks against you have disadvantage. DEX saves have advantage.',
    duration: 'Until your next turn.',
    bestFor: 'Tanking, buying time, no good attack options.',
    note: 'Ends if incapacitated or speed drops to 0.',
  },
  dash: {
    action: 'Dash',
    effect: 'Gain extra movement equal to your speed.',
    duration: 'This turn only.',
    bestFor: 'Closing distance, fleeing, repositioning.',
    note: 'Does NOT stack with itself unless you have bonus action Dash too.',
  },
  disengage: {
    action: 'Disengage',
    effect: 'Movement doesn\'t provoke opportunity attacks this turn.',
    duration: 'This turn only.',
    bestFor: 'Retreating safely, repositioning without AoO.',
    note: 'You still use normal movement. Does NOT give extra speed.',
  },
};

export const DECISION_MATRIX = [
  { situation: 'Surrounded, can\'t escape', best: 'Dodge', why: 'Disadvantage on all attacks. Survive until help arrives.' },
  { situation: 'Need to reach a distant enemy', best: 'Dash', why: 'Double movement to close the gap.' },
  { situation: 'Adjacent to enemy, need to retreat', best: 'Disengage', why: 'Move away safely without eating an AoO.' },
  { situation: 'Concentrating on a key spell', best: 'Dodge', why: 'Fewer hits = fewer concentration saves.' },
  { situation: 'Chasing a fleeing enemy', best: 'Dash', why: 'Match or exceed their speed.' },
  { situation: 'Kiting (ranged attacker)', best: 'Disengage', why: 'Step back and shoot next turn.' },
  { situation: 'Waiting for allies to arrive', best: 'Dodge', why: 'Stall. Disadvantage buys time.' },
  { situation: 'Running from overwhelming encounter', best: 'Dash', why: 'Max distance. Outrun them.' },
  { situation: 'Caster with no good spells left', best: 'Dodge', why: 'Better than a bad cantrip if tanking.' },
  { situation: 'Moving through enemy lines', best: 'Disengage', why: 'Pass through without AoO.' },
];

export const CLASS_SHORTCUTS = [
  { class: 'Rogue', feature: 'Cunning Action', benefit: 'Dash, Disengage, or Hide as BONUS action. Attack + reposition every turn.' },
  { class: 'Monk', feature: 'Step of the Wind', benefit: 'Dash or Disengage as bonus action (1 ki). Plus jump distance doubles.' },
  { class: 'Goblin', feature: 'Nimble Escape', benefit: 'Disengage or Hide as bonus action. Like half of Cunning Action.' },
  { class: 'Fighter (Champion)', feature: 'Remarkable Athlete', benefit: 'Half proficiency to STR/DEX/CON checks. Helps with chase athletics.' },
  { class: 'Any (Mobile feat)', feature: 'Mobile', benefit: 'After melee attack, no AoO from that creature. Free pseudo-disengage.' },
];

export const DODGE_DASH_TIPS = [
  'Dodge: use when you MUST stay in place and survive.',
  'Dash: use when distance matters more than safety.',
  'Disengage: use when you need to move away from melee.',
  'Rogue/Monk: bonus action Dash/Disengage. Attack + move freely.',
  'Mobile feat: attack then move away. No AoO from target.',
  'Dodge protects concentration. Fewer hits = fewer saves.',
  'Dash + Disengage don\'t stack. Pick one per action.',
  'Help action: forgotten alternative. Give ally advantage.',
  'Ready action: another option. Hold attack for trigger.',
  'If nothing else matters, Attack is usually best.',
];
