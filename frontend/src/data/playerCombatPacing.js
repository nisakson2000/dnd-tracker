/**
 * playerCombatPacing.js
 * Player Mode: Keeping combat moving quickly — prep tips, decision shortcuts, and table etiquette
 * Pure JS — no React dependencies.
 */

export const PACING_PRINCIPLES = [
  { principle: 'Know your turn before it comes', detail: 'While others are acting, plan your turn. Don\'t wait until it\'s your turn to start thinking.', impact: 'S' },
  { principle: 'Roll attack and damage together', detail: 'Roll your d20 and damage dice at the same time. Saves 5-10 seconds per attack.', impact: 'A' },
  { principle: 'Have your spell/ability ready', detail: 'Open your spell description BEFORE your turn. Know the save DC, damage, range.', impact: 'S' },
  { principle: 'Declare actions clearly', detail: '"I attack the goblin with my longsword" is faster than "Um, can I... what should I do..."', impact: 'A' },
  { principle: 'Accept the DM\'s ruling', detail: 'If the DM makes a call you disagree with, accept it and discuss after the session.', impact: 'A' },
  { principle: 'Don\'t rules-lawyer mid-combat', detail: 'Looking up rules takes time. Accept the DM\'s on-the-spot ruling and move on.', impact: 'A' },
  { principle: 'Keep phone away', detail: 'Scrolling your phone when it\'s not your turn means you miss what\'s happening and slow down when it IS your turn.', impact: 'B' },
];

export const TURN_SPEED_TIPS = {
  beginner: [
    'Have a "default action" — when in doubt, attack the nearest enemy.',
    'Write your most-used numbers on a sticky note: attack bonus, damage, spell DC.',
    'If you\'re unsure, say "I attack with my sword" and the DM will walk you through it.',
    'Don\'t try to be optimal. Try to be fast. Speed comes before optimization.',
  ],
  intermediate: [
    'Pre-roll damage when you roll to attack. If it misses, ignore the damage dice.',
    'Bookmark your most-used spell pages or use spell cards.',
    'Announce your turn in order: "Move here, attack this, bonus action that."',
    'Know your bonus action options before your turn starts.',
  ],
  advanced: [
    'Pre-calculate conditional damage: "If I hit with Sneak Attack, that\'s [total]."',
    'Track enemy AC from previous attacks: "Last hit at 14, so AC is 14 or less."',
    'Have contingency plans: "If target A dies before my turn, I switch to target B."',
    'Know your reaction options so you can respond instantly during others\' turns.',
  ],
};

export const QUICK_REFERENCE_CARD = {
  description: 'Make a small card with your most-used combat info:',
  fields: [
    { label: 'AC', example: '18 (Plate + Shield)' },
    { label: 'HP', example: '__/45' },
    { label: 'Attack', example: '+7 to hit, 1d8+4 slashing' },
    { label: 'Spell Save DC', example: 'DC 15' },
    { label: 'Speed', example: '30ft' },
    { label: 'Bonus Actions', example: 'Healing Word, Spiritual Weapon' },
    { label: 'Reactions', example: 'Shield (+5 AC), OA (+7, 1d8+4)' },
    { label: 'Key Spells', example: 'Spirit Guardians, Bless, Guiding Bolt' },
    { label: 'Passive Perception', example: '14' },
    { label: 'Concentration', example: '____ (current spell)' },
  ],
};

export const TABLE_ETIQUETTE = [
  { rule: 'Pay attention during other turns', why: 'You\'ll know what happened and can plan accordingly. Also, it\'s respectful.' },
  { rule: 'Cheer for other players', why: 'Celebrate crits, cool moves, and clutch saves. It makes combat fun for everyone.' },
  { rule: 'Don\'t backseat-game', why: 'Suggesting strategy is fine. Telling another player what to do on their turn is not.' },
  { rule: 'Keep side conversations brief', why: 'Extended chatter during combat slows everyone down.' },
  { rule: 'Say "end of turn" clearly', why: 'Let the DM and next player know you\'re done. Prevents awkward pauses.' },
  { rule: 'Ask before touching others\' dice/minis', why: 'Moving someone else\'s mini without asking is a common pet peeve.' },
  { rule: 'Track your own conditions/spells', why: 'Don\'t rely on the DM to remember YOUR buffs and conditions.' },
];

export const ANALYSIS_PARALYSIS_SOLUTIONS = [
  { problem: 'Too many spell options', solution: 'Pick 3 "go-to" spells before the session. Default to those unless the situation demands otherwise.' },
  { problem: 'Can\'t decide on a target', solution: 'Attack whatever the last person attacked. Focus fire is almost always correct.' },
  { problem: 'Worried about making mistakes', solution: 'There are no wrong actions in D&D. Attacking is never bad. Healing is never bad. Just do something.' },
  { problem: 'Overthinking positioning', solution: 'Move to the nearest useful spot. Behind cover if ranged, next to an enemy if melee.' },
  { problem: 'Too many bonus action options', solution: 'Priority: Healing Word (if ally down) > Spiritual Weapon (if active) > other options.' },
  { problem: 'Can\'t remember abilities', solution: 'Write your top 3 abilities on a sticky note. If none of those apply, just attack.' },
];

export function createQuickRefCard(character) {
  return {
    name: character.name,
    ac: character.ac,
    hp: `__/${character.maxHP}`,
    attack: `+${character.attackBonus} to hit, ${character.damage}`,
    spellDC: character.spellDC ? `DC ${character.spellDC}` : 'N/A',
    speed: `${character.speed}ft`,
    keyAbilities: character.keyAbilities || ['Attack'],
  };
}

export function turnTimeGoal(experienceLevel) {
  const goals = {
    beginner: { seconds: 60, note: 'Take your time. Ask questions. 1 minute is fine.' },
    intermediate: { seconds: 30, note: 'You know your abilities. 30 seconds per turn.' },
    advanced: { seconds: 15, note: 'Declarations are instant. Dice hit the table immediately.' },
  };
  return goals[experienceLevel] || goals.intermediate;
}
