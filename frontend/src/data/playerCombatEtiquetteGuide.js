/**
 * playerCombatEtiquetteGuide.js
 * Player Mode: Table manners and combat flow etiquette
 * Pure JS — no React dependencies.
 */

export const COMBAT_ETIQUETTE = [
  { rule: 'Plan your turn during others\' turns', impact: 'High', reason: 'A 5-player group where each takes 60 seconds means you wait 4 minutes. Cut your turn to 30 seconds and everyone has more fun.' },
  { rule: 'Roll attack AND damage together', impact: 'High', reason: 'Say "That\'s a 19 to hit, 8 slashing damage" in one statement. Saves 5-10 seconds per attack.' },
  { rule: 'Know your character\'s abilities', impact: 'High', reason: 'Don\'t read your spell description for the first time on your turn. Know it beforehand.' },
  { rule: 'Announce your turn structure', impact: 'Medium', reason: '"I move here, attack with my longsword, then bonus action Healing Word." Clear and fast.' },
  { rule: 'Don\'t argue rules during combat', impact: 'High', reason: 'Accept the DM\'s ruling NOW. Discuss it AFTER the session. Flow > correctness.' },
  { rule: 'Don\'t tell other players what to do', impact: 'Medium', reason: 'Suggest, don\'t command. "Maybe the mage?" not "You HAVE to hit the mage."' },
  { rule: 'Stay engaged when it\'s not your turn', impact: 'Medium', reason: 'Watch what happens. You might need to react. And it\'s rude to be on your phone.' },
  { rule: 'Announce when you end your turn', impact: 'Low', reason: '"I end my turn" lets the DM know to move on. Don\'t leave people guessing.' },
  { rule: 'Track your own conditions and effects', impact: 'High', reason: 'Don\'t make the DM remind you that you\'re blessed/hexed/concentrating.' },
  { rule: 'Have your dice ready', impact: 'Low', reason: 'Know which dice you need for your most common actions. Pre-sort them.' },
];

export const TURN_TIME_TARGETS = [
  { complexity: 'Simple (attack)', target: '15-20 seconds', example: '"I attack the goblin. 17 to hit, 9 damage. End turn."' },
  { complexity: 'Standard (attack + bonus)', target: '20-30 seconds', example: '"I attack with longsword — 21 to hit, 11 damage. Bonus action Healing Word on the Rogue, 7 HP. End turn."' },
  { complexity: 'Complex (spellcaster)', target: '30-45 seconds', example: '"I cast Fireball centered on the cluster. DC 15 DEX save. [rolls] 28 fire damage, half on save. End turn."' },
  { complexity: 'Multi-step (summoner)', target: '45-60 seconds', example: '"My turn, then my familiar acts. I cast Haste on the Fighter. Familiar uses Help on the Rogue. End turn."' },
];

export const DICE_ETIQUETTE = [
  'Roll where everyone can see. Hidden rolls breed suspicion.',
  'Accept the result. Rerolling because "it was cocked" should be rare.',
  'Don\'t touch other people\'s dice without asking.',
  'If a die rolls off the table, most tables reroll. Establish this in session zero.',
  'Digital dice are fine if your table allows them. But physical dice are more social.',
  'Roll AFTER the DM asks. Not before. Pre-rolling can be seen as trying to pick results.',
];

export const PHONE_POLICY = [
  { policy: 'Phones away', description: 'No phones at all during combat. Most immersive.', strictness: 'High' },
  { policy: 'Character sheet apps only', description: 'D&D Beyond, dice apps allowed. No social media.', strictness: 'Medium' },
  { policy: 'Free use between turns', description: 'Use your phone while waiting. Put it down on your turn.', strictness: 'Low' },
  { policy: 'No policy', description: 'Everyone does what they want. Can lead to distracted players.', strictness: 'None' },
];

export function getTurnTimeTarget(complexity) {
  return TURN_TIME_TARGETS.find(t =>
    t.complexity.toLowerCase().includes((complexity || '').toLowerCase())
  ) || TURN_TIME_TARGETS[1];
}

export function getTopEtiquetteRules() {
  return COMBAT_ETIQUETTE.filter(e => e.impact === 'High');
}
