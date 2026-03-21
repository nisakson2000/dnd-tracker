/**
 * playerDisengageVsDodge.js
 * Player Mode: When to Disengage vs Dodge vs Dash — action comparison
 * Pure JS — no React dependencies.
 */

export const ACTION_COMPARISON = [
  {
    action: 'Disengage',
    effect: 'Your movement doesn\'t provoke opportunity attacks for the rest of the turn.',
    bestWhen: ['You need to retreat from melee', 'Multiple enemies surround you', 'You\'re a squishy caster stuck in melee'],
    worstWhen: ['No enemies are in melee range', 'You\'re planning to stay in melee', 'You have Mobile feat or similar'],
    freeFor: ['Rogue (Cunning Action)', 'Goblin (Nimble Escape)', 'Monk (Step of the Wind, bonus action, 1 ki)'],
  },
  {
    action: 'Dodge',
    effect: 'Attacks against you have disadvantage. You have advantage on DEX saves. Lasts until your next turn.',
    bestWhen: ['You\'re tanking and need to survive', 'You\'re concentrating on a critical spell', 'Waiting for allies to arrive', 'No good attack options'],
    worstWhen: ['You could kill an enemy instead (dead enemies do 0 damage)', 'Only one enemy is attacking you', 'You have high AC already'],
    freeFor: ['Monk (Patient Defense, bonus action, 1 ki)'],
  },
  {
    action: 'Dash',
    effect: 'Gain extra movement equal to your speed for this turn.',
    bestWhen: ['You need to close distance to a priority target', 'You need to flee from an overwhelming fight', 'You\'re chasing a fleeing enemy'],
    worstWhen: ['You\'re already in range of enemies', 'You\'d provoke OAs by moving (Disengage first)', 'There\'s no tactical reason to reposition'],
    freeFor: ['Rogue (Cunning Action)', 'Monk (Step of the Wind, bonus action, 1 ki)', 'Goblin (Nimble Escape — Disengage or Hide only, not Dash)'],
  },
  {
    action: 'Help',
    effect: 'Give one ally advantage on their next ability check or attack roll against a target within 5ft of you.',
    bestWhen: ['Your attacks are weak but ally hits hard', 'Ally needs to land a critical spell/attack', 'You\'re a familiar (owl Help + Flyby)'],
    worstWhen: ['You could deal meaningful damage yourself', 'No allies are nearby', 'The advantage is redundant (ally already has it)'],
    freeFor: ['Mastermind Rogue (bonus action, 30ft range)'],
  },
  {
    action: 'Hide',
    effect: 'Make a Stealth check. If successful, you\'re hidden (unseen attacker advantage, can\'t be targeted by many spells).',
    bestWhen: ['You\'re a Rogue wanting Sneak Attack without an ally nearby', 'You need to break line of sight', 'You\'re setting up an ambush mid-combat'],
    worstWhen: ['No cover or concealment available', 'Enemies have high passive Perception', 'You\'re in the open'],
    freeFor: ['Rogue (Cunning Action)', 'Goblin (Nimble Escape)'],
  },
];

export const DECISION_MATRIX = [
  { situation: 'Surrounded, low HP, need to escape', best: 'Disengage', second: 'Dodge', avoid: 'Dash (you\'ll eat OAs)' },
  { situation: 'One enemy in melee, need to run', best: 'Disengage', second: 'Dash (eat one OA)', avoid: 'Dodge (doesn\'t help you escape)' },
  { situation: 'Concentrating on key spell, tanking hits', best: 'Dodge', second: 'Disengage (retreat)', avoid: 'Dash' },
  { situation: 'Need to reach the enemy caster 60ft away', best: 'Dash', second: 'Normal move + ranged attack', avoid: 'Dodge (you\'re not in danger yet)' },
  { situation: 'Nothing useful to do with your action', best: 'Dodge', second: 'Help (give ally advantage)', avoid: 'Dash (aimlessly)' },
  { situation: 'Rogue in melee without ally for Sneak Attack', best: 'Hide (bonus)', second: 'Steady Aim (if available)', avoid: 'Just attack without SA' },
];

export const ROGUE_ACTION_ECONOMY = {
  note: 'Rogues get Cunning Action at level 2: Dash, Disengage, or Hide as a BONUS action.',
  typical: [
    'Attack + Cunning Action: Hide (for next turn\'s advantage)',
    'Attack + Cunning Action: Disengage (hit and run)',
    'Attack + Cunning Action: Dash (chase or flee)',
  ],
  advanced: [
    'Steady Aim (bonus, Tasha\'s) + Sneak Attack (advantage on self, can\'t move)',
    'Attack on turn + Ready Attack for ally\'s turn (double Sneak Attack)',
  ],
};

export function suggestAction(inMelee, lowHP, concentrating, needsToMove, isRogue) {
  if (isRogue) return { action: 'Attack', bonusAction: inMelee ? 'Disengage' : 'Hide', reason: 'Cunning Action frees your action for attacks' };
  if (lowHP && inMelee) return { action: 'Disengage', reason: 'Get out alive. Dead players do 0 damage.' };
  if (concentrating && inMelee) return { action: 'Dodge', reason: 'Protect concentration. Disadvantage on attacks = fewer saves.' };
  if (needsToMove && !inMelee) return { action: 'Dash', reason: 'Close the distance or reposition.' };
  return { action: 'Attack', reason: 'Default: deal damage. Dead enemies are the best defense.' };
}
