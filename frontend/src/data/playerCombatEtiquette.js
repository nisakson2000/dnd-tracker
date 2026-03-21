/**
 * playerCombatEtiquette.js
 * Player Mode: Combat etiquette and table tips for faster play
 * Pure JS — no React dependencies.
 */

export const COMBAT_ETIQUETTE = [
  { rule: 'Plan Your Turn Ahead', description: 'Think about what you\'ll do DURING other players\' turns, not when it\'s your turn. This keeps combat flowing.' },
  { rule: 'Know Your Abilities', description: 'Read your spell/feature descriptions BEFORE your turn. Don\'t look them up when you\'re on the clock.' },
  { rule: 'Roll Attack and Damage Together', description: 'When you attack, roll your d20 and damage dice at the same time. If you hit, damage is ready.' },
  { rule: 'Announce Your Action Clearly', description: '"I attack the goblin with my longsword. That\'s a 17 to hit, 8 slashing damage."' },
  { rule: 'Keep Dice Rolling Quick', description: 'Use a dice tray. Have your dice ready. Don\'t search for the right die on your turn.' },
  { rule: 'Don\'t Rules-Lawyer During Combat', description: 'If there\'s a dispute, let the DM make a call and discuss it after combat.' },
  { rule: 'Stay Engaged When It\'s Not Your Turn', description: 'Watch the battle. React to events. Plan your response. Don\'t check your phone.' },
  { rule: 'Communicate Tactics Briefly', description: '"I\'ll lock down the left side." Keep tactical discussion short and in-character if possible.' },
  { rule: 'Accept Bad Rolls Gracefully', description: 'Everyone rolls badly sometimes. Don\'t slow the game with frustration.' },
  { rule: 'Describe Your Actions', description: 'Add flavor! "I swing my warhammer in a wide arc" is better than "I attack." But keep it brief.' },
];

export const SPEED_UP_COMBAT = [
  'Pre-roll initiative at the start of the session.',
  'Use average damage instead of rolling (for summons/minions).',
  'Write your attack bonus and damage on a card for quick reference.',
  'Have your spell list marked with frequently used spells.',
  'Use physical tokens or marks to track conditions/concentration.',
  'If you have multiple attacks, roll all d20s simultaneously.',
  'Set a 30-second turn timer for casual groups, 1 minute for newer players.',
  'Take your turn even if it\'s not optimal. A fast okay turn beats a slow perfect turn.',
];

export const COMMON_COMBAT_DELAYS = [
  { delay: 'Looking up spell effects', fix: 'Mark frequently used spells with sticky tabs or have them written out.' },
  { delay: 'Deciding what to do', fix: 'Plan during other turns. Have a default action if you can\'t decide.' },
  { delay: 'Counting damage dice', fix: 'Roll attack and damage together. Use dice apps for complex rolls.' },
  { delay: 'Tracking conditions', fix: 'Use colored rings/tokens on minis. Or a shared condition tracker.' },
  { delay: 'Side conversations', fix: 'Keep table talk to minimum during combat. Save social chat for exploration.' },
  { delay: 'Optimizing the perfect turn', fix: 'Good enough is good enough. A quick action keeps combat exciting.' },
];

export function getCombatTip(index) {
  return COMBAT_ETIQUETTE[index % COMBAT_ETIQUETTE.length];
}

export function getRandomSpeedTip() {
  return SPEED_UP_COMBAT[Math.floor(Math.random() * SPEED_UP_COMBAT.length)];
}
