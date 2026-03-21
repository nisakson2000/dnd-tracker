/**
 * playerTurnOptimization.js
 * Player Mode: Optimizing your turn — action economy and turn flow
 * Pure JS — no React dependencies.
 */

export const TURN_STRUCTURE = {
  order: ['Start-of-turn effects', 'Movement (can split)', 'Action', 'Bonus Action (if available)', 'Free Object Interaction', 'End-of-turn effects'],
  note: 'You can interleave movement between actions. Move → Attack → Move → Bonus Action is legal.',
  timing: 'Reactions can happen on ANY turn (yours or enemy\'s). They reset at your turn start.',
};

export const COMMON_MISTAKES = [
  { mistake: 'Not planning your turn during others\' turns', fix: 'Watch the battlefield while others go. Know your action before it\'s your turn.' },
  { mistake: 'Forgetting free object interaction', fix: 'Draw a weapon, pick up an item, open a door — one free per turn. Don\'t waste an action.' },
  { mistake: 'Moving before thinking', fix: 'Announce action first, then move. Don\'t walk into danger without a plan.' },
  { mistake: 'Holding action unnecessarily', fix: 'Ready Action costs your reaction AND the action might not trigger. Usually better to act now.' },
  { mistake: 'Forgetting concentration checks', fix: 'Take damage while concentrating = CON save DC 10 or half damage (whichever is higher). Track this.' },
  { mistake: 'Not using movement', fix: 'You have 30ft of movement. Use it to get cover, reposition, or get within range. Standing still wastes it.' },
  { mistake: 'Casting two leveled spells', fix: 'If you cast a BA spell, your action spell must be a cantrip. Plan accordingly. Action Surge is the exception.' },
  { mistake: 'Ignoring Dodge action', fix: 'Dodging imposes disadvantage on ALL attacks against you. Better than swinging and missing.' },
];

export const OPTIMAL_TURN_FLOW = {
  melee: [
    'Move to target (use Disengage if needed to avoid OAs).',
    'Attack action (Extra Attack if available).',
    'Bonus action (TWF offhand, Martial Arts, Flurry of Blows, etc.).',
    'Move out of reach if possible (Rogue: Cunning Action Disengage, Monk: Step of the Wind).',
  ],
  ranged: [
    'Check line of sight and cover.',
    'Attack from maximum effective range.',
    'Bonus action (Hunter\'s Mark, Crossbow Expert BA attack, etc.).',
    'Move behind full cover if possible.',
  ],
  caster: [
    'Check concentration (are you already concentrating on something?).',
    'Cast highest impact spell for the situation.',
    'Bonus action spell or ability (Healing Word, Spiritual Weapon, Misty Step).',
    'Move to safety. Behind ally, behind cover, out of range.',
  ],
  support: [
    'Assess party HP and status. Who needs healing?',
    'Buff allies or debuff enemies (Bless, Faerie Fire, Hold Person).',
    'Bonus action heal (Healing Word) if someone is down.',
    'Position to maximize aura/buff ranges.',
  ],
};

export const READY_ACTION_RULES = {
  howItWorks: 'Use your action to set a trigger. When triggered, use your reaction to perform the readied action.',
  spells: 'Readying a spell uses your action AND concentration. If trigger doesn\'t happen, slot is wasted.',
  attacks: 'Readying Attack action = only 1 attack (not Extra Attack). Usually worse than just attacking.',
  whenGood: [
    'Enemy is about to come around a corner (ready ranged attack).',
    'Ally is about to move an enemy through Spike Growth (ready push/pull).',
    'You want to attack the NEXT enemy that appears (ambush setup).',
  ],
  whenBad: [
    'You could just attack on your turn (Ready wastes your reaction + no Extra Attack).',
    'You ready a spell and it doesn\'t trigger (slot wasted).',
    'The trigger condition is too specific to ever happen.',
  ],
};

export function turnsInCombat(roundCount) {
  return roundCount; // each creature gets 1 turn per round
}

export function actionsPerCombat(rounds, hasActionSurge) {
  return rounds + (hasActionSurge ? 1 : 0);
}
